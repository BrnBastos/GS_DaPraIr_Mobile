import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { Repository, type Connection } from '../src/db/repository.ts';
import { evaluatePlace } from '../src/domain/compatibility.ts';

test('jornada completa: aviso altera plano, resolução preserva histórico e retorno não confirma recursos', async () => {
  const db = new DatabaseSync(':memory:');
  const port: Connection = {
    async execAsync(sql) {
      db.exec(sql);
    },
    async runAsync(sql, ...params) {
      return db.prepare(sql).run(...params);
    },
    async getFirstAsync<T>(sql: string, ...params: (string | number | null)[]) {
      return (db.prepare(sql).get(...params) ?? null) as T | null;
    },
    async getAllAsync<T>(sql: string, ...params: (string | number | null)[]) {
      return db.prepare(sql).all(...params) as T[];
    },
    async withTransactionAsync(action) {
      db.exec('BEGIN');
      try {
        await action();
        db.exec('COMMIT');
      } catch (error) {
        db.exec('ROLLBACK');
        throw error;
      }
    },
  };
  const now = new Date('2026-11-17T15:00:00.000Z');
  const repo = new Repository(port, () => now);
  await repo.initialize();
  await repo.savePreferences(['stepFree', 'quiet']);
  const id = await repo.createVisit('casa-serena', '2026-11-19T17:30:00.000Z', [
    'stepFree',
    'quiet',
  ]);
  let data = await repo.readSnapshot();
  const place = data.places.find((item) => item.id === 'casa-serena')!;
  assert.equal(
    evaluatePlace(place, data.visits[0].needs, data.evidence, data.notices, now).status,
    'compatible',
  );
  const noticeId = await repo.createNotice({
    placeId: place.id,
    need: 'quiet',
    title: "Ruído no espaço 'A'",
    text: 'Registro fictício de teste.',
    effect: 'barrier',
  });
  data = await repo.readSnapshot();
  assert.equal(
    evaluatePlace(place, data.visits[0].needs, data.evidence, data.notices, now).status,
    'barrier',
  );
  await repo.updateItem(data.visits[0].items[0].id, { checked: true });
  await repo.updateNotice(noticeId, 'confirmed');
  await repo.updateNotice(noticeId, 'resolved');
  await repo.saveGuidePosition(place.id, 4);
  data = await repo.readSnapshot();
  assert.equal(data.visits[0].status, 'planned');
  assert.equal(
    evaluatePlace(place, data.visits[0].needs, data.evidence, data.notices, now).status,
    'compatible',
  );
  await repo.updateVisit(id, { status: 'in_progress', currentStage: 2 });
  await repo.updateVisit(id, { status: 'completed', currentStage: 4 });
  await repo.saveReport({
    placeId: place.id,
    visitId: id,
    outcome: 'difficulty',
    need: 'quiet',
    text: 'Motivo opcional preservado.',
  });
  await repo.initialize();
  data = await repo.readSnapshot();
  assert.equal(data.places.length, 8);
  assert.equal(data.visits.length, 1);
  assert.equal(data.visits[0].scheduledAt, '2026-11-19T17:30:00.000Z');
  assert.equal(data.visits[0].currentStage, 4);
  assert.equal(data.visits[0].items[0].checked, true);
  assert.equal(data.reports.length, 17);
  assert.equal(
    data.reports.find((report) => report.visitId === id)?.text,
    'Motivo opcional preservado.',
  );
  assert.equal(data.notices.length, 4);
  assert.equal(data.noticeEvents.filter((event) => event.noticeId === noticeId).length, 3);
  assert.equal(
    evaluatePlace(place, data.visits[0].needs, data.evidence, data.notices, now).status,
    'compatible',
  );
  assert.equal(db.prepare('PRAGMA integrity_check').get()?.integrity_check, 'ok');
  db.close();
});
