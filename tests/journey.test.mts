import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Repository, type Connection } from '../src/db/repository.ts';
import { DAY, NOTICE_TTL } from '../src/domain/models.ts';
import {
  assessNeed,
  evaluatePlace,
  isCurrent,
  matchesSearch,
} from '../src/domain/compatibility.ts';
import { parseSchedule, scheduledLabel } from '../src/domain/dates.ts';

function connection(database: DatabaseSync): Connection {
  return {
    async execAsync(sql) {
      database.exec(sql);
    },
    async runAsync(sql, ...params) {
      return database.prepare(sql).run(...params);
    },
    async getFirstAsync<T>(sql: string, ...params: (string | number | null)[]) {
      return (database.prepare(sql).get(...params) ?? null) as T | null;
    },
    async getAllAsync<T>(sql: string, ...params: (string | number | null)[]) {
      return database.prepare(sql).all(...params) as T[];
    },
    async withTransactionAsync(action) {
      database.exec('BEGIN');
      try {
        await action();
        database.exec('COMMIT');
      } catch (error) {
        database.exec('ROLLBACK');
        throw error;
      }
    },
  };
}

const start = new Date('2026-11-17T15:00:00.000Z');
async function fixture() {
  const db = new DatabaseSync(':memory:');
  let now = start;
  const repo = new Repository(connection(db), () => now);
  await repo.initialize();
  return {
    db,
    repo,
    setNow: (date: Date) => {
      now = date;
    },
  };
}

test('a compatibilidade usa evidência válida, respeita barreiras e não supõe preferências', async () => {
  const { db, repo } = await fixture();
  const data = await repo.readSnapshot();
  const garden = data.places[0];
  const calm = data.places[1];
  const horizon = data.places[2];
  assert.equal(
    evaluatePlace(
      { ...calm, expiresAt: start.toISOString() },
      ['stepFree'],
      data.evidence,
      data.notices,
      start,
    ).status,
    'unknown',
  );
  assert.equal(
    evaluatePlace(garden, ['stepFree', 'quiet'], data.evidence, data.notices, start).status,
    'unknown',
  );
  assert.equal(
    evaluatePlace(calm, ['stepFree', 'quiet'], data.evidence, data.notices, start).status,
    'compatible',
  );
  assert.equal(
    evaluatePlace(horizon, ['stepFree', 'quiet'], data.evidence, data.notices, start).status,
    'barrier',
  );
  assert.equal(evaluatePlace(calm, [], data.evidence, data.notices, start).status, 'unknown');
  assert.equal(
    evaluatePlace(data.places[4], ['predictability'], data.evidence, data.notices, start).status,
    'unknown',
  );
  const fact = data.evidence[0];
  assert.equal(isCurrent(fact, new Date(fact.expiresAt)), false);
  assert.equal(
    isCurrent({ ...fact, confirmedAt: new Date(start.getTime() + DAY).toISOString() }, start),
    false,
  );
  assert.equal(matchesSearch('Clínica Alecrim', 'clinica'), true);
  db.close();
});

test('aviso vencido mantém histórico e pendência; confirmação e resolução são ações diferentes', async () => {
  const { db, repo, setNow } = await fixture();
  let data = await repo.readSnapshot();
  const place = data.places[5];
  assert.equal(assessNeed(place, 'stepFree', data.evidence, data.notices, start).state, 'unknown');
  await repo.updateNotice('demo-aviso-rampa', 'confirmed');
  data = await repo.readSnapshot();
  const notice = data.notices.find((item) => item.id === 'demo-aviso-rampa')!;
  assert.equal(Date.parse(notice.expiresAt) - Date.parse(notice.confirmedAt), NOTICE_TTL);
  assert.equal(assessNeed(place, 'stepFree', data.evidence, data.notices, start).state, 'no');
  setNow(new Date(start.getTime() + NOTICE_TTL));
  assert.equal(
    assessNeed(
      place,
      'stepFree',
      data.evidence,
      data.notices,
      new Date(start.getTime() + NOTICE_TTL),
    ).state,
    'unknown',
  );
  await repo.updateNotice(notice.id, 'resolved');
  data = await repo.readSnapshot();
  assert.ok(data.notices.find((item) => item.id === notice.id)!.resolvedAt);
  assert.deepEqual(
    data.noticeEvents
      .filter((event) => event.noticeId === notice.id)
      .map((event) => event.kind)
      .sort(),
    ['confirmed', 'registered', 'resolved'],
  );
  await assert.rejects(repo.updateNotice(notice.id, 'confirmed'));
  db.close();
});

test('carga inicial e dados pessoais persistem após fechar e reabrir SQLite, sem reseed', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'daprair-test-'));
  const file = join(dir, 'test.db');
  let db = new DatabaseSync(file);
  let repo = new Repository(connection(db), () => start);
  await repo.initialize();
  await repo.savePreferences(['stepFree', 'quiet']);
  const id = await repo.createVisit(
    'clinica-jardim',
    null,
    ['stepFree', 'quiet'],
    'Como está o ruído?',
  );
  await repo.saveGuidePosition('clinica-jardim', 4);
  let data = await repo.readSnapshot();
  await repo.updateItem(data.visits[0].items[0].id, { checked: true });
  await repo.updateVisit(id, { status: 'in_progress', currentStage: 1 });
  db.close();
  db = new DatabaseSync(file);
  repo = new Repository(connection(db), () => new Date(start.getTime() + DAY * 7));
  await repo.initialize();
  data = await repo.readSnapshot();
  assert.equal(data.places.length, 8);
  assert.equal(data.reports.length, 16);
  assert.equal(data.firstRunAt, start.toISOString());
  assert.deepEqual(data.needs, ['stepFree', 'quiet']);
  assert.equal(data.visits[0].items[0].checked, true);
  assert.equal(data.guidePositions['clinica-jardim'], 4);
  assert.equal(data.visits[0].currentStage, 1);
  assert.equal(data.visits[0].status, 'in_progress');
  assert.equal(data.places[0].confirmedAt, new Date(start.getTime() - DAY * 3).toISOString());
  db.close();
  rmSync(dir, { recursive: true });
});

test('checklist aceita edição, remoção e escritas concorrentes sem alterar evidências públicas', async () => {
  const { db, repo } = await fixture();
  const before = await repo.readSnapshot();
  const id = await repo.createVisit('casa-serena', null, ['quiet']);
  await Promise.all([
    repo.addItem(id, 'Separar documento'),
    repo.addItem(id, 'Confirmar recepção', 'confirmation'),
  ]);
  let data = await repo.readSnapshot();
  assert.equal(data.visits[0].items.length, 5);
  const item = data.visits[0].items[3];
  await repo.updateItem(item.id, { text: 'Separar o documento', checked: true });
  data = await repo.readSnapshot();
  assert.equal(data.visits[0].items[3].text, 'Separar o documento');
  await repo.updateItem(item.id, { removed: true });
  data = await repo.readSnapshot();
  assert.equal(data.visits[0].items.length, 4);
  assert.deepEqual(before.evidence, data.evidence);
  assert.deepEqual(before.notices, data.notices);
  await assert.rejects(repo.addItem(id, '  '));
  await assert.rejects(repo.updateVisit(id, { currentStage: 5 }));
  db.close();
});

test('ler o guia não conclui uma visita e relato positivo geral não confirma acessibilidade', async () => {
  const { db, repo } = await fixture();
  const id = await repo.createVisit('nucleo-caminho', null, ['quiet']);
  await repo.saveGuidePosition('nucleo-caminho', 4);
  let data = await repo.readSnapshot();
  assert.equal(data.visits[0].status, 'planned');
  await assert.rejects(
    repo.saveReport({ placeId: 'nucleo-caminho', visitId: id, outcome: 'success' }),
  );
  await repo.updateVisit(id, { status: 'completed' });
  await repo.saveReport({ placeId: 'nucleo-caminho', visitId: id, outcome: 'success' });
  await repo.saveReport({
    placeId: 'nucleo-caminho',
    visitId: id,
    outcome: 'success',
    text: 'A visita funcionou para nós.',
  });
  data = await repo.readSnapshot();
  assert.equal(data.reports.filter((item) => item.visitId === id).length, 1);
  assert.equal(
    evaluatePlace(data.places[7], ['quiet'], data.evidence, data.notices, start).status,
    'barrier',
  );
  assert.ok(data.visits[0].completedAt);
  await assert.rejects(repo.updateVisit(id, { status: 'in_progress' }));
  db.close();
});

test('falha durante carga inicial reverte a transação e permite tentar novamente', async () => {
  const db = new DatabaseSync(':memory:');
  const port = connection(db);
  let fail = true;
  const run = port.runAsync;
  port.runAsync = async (sql, ...params) => {
    if (fail && sql.startsWith('INSERT INTO notices'))
      throw new Error('Falha de gravação simulada');
    return run(sql, ...params);
  };
  const repo = new Repository(port, () => start);
  await assert.rejects(repo.initialize());
  assert.equal(
    (db.prepare('PRAGMA user_version').get() as { user_version: number }).user_version,
    0,
  );
  fail = false;
  await repo.initialize();
  assert.equal((await repo.readSnapshot()).places.length, 8);
  db.close();
});

test('agenda valida datas e preserva um horário informado em São Paulo', () => {
  assert.equal(parseSchedule('31/02/2027', '14:00').error, 'Informe uma data válida.');
  assert.ok(parseSchedule('17/11/2026', '25:00').error);
  assert.ok(parseSchedule('', '14:00').error);
  assert.deepEqual(parseSchedule('', ''), { value: null });
  assert.equal(parseSchedule('19/11/2026', '14:30').value, '2026-11-19T17:30:00.000Z');
  assert.equal(scheduledLabel(null, 'planned'), 'Em planejamento');
  assert.equal(scheduledLabel(null, 'in_progress'), 'Sem horário informado');
  assert.equal(scheduledLabel(null, 'completed'), 'Sem horário informado');
});
