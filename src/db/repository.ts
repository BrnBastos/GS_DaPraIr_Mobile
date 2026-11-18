import {
  createId,
  GUIDE_TTL,
  NOTICE_TTL,
  NEEDS,
  type ChecklistItem,
  type NeedKey,
  type Notice,
  type NoticeEvent,
  type Place,
  type Report,
  type Snapshot,
  type Visit,
  type Evidence,
} from '../domain/models.ts';
import { loadMockPlaces } from '../services/mock.ts';
import { migrations } from './schema.ts';
import { UserFacingError } from '../domain/errors.ts';

type Bind = string | number | null;
export interface Connection {
  execAsync(sql: string): Promise<void>;
  runAsync(sql: string, ...params: Bind[]): Promise<unknown>;
  getFirstAsync<T>(sql: string, ...params: Bind[]): Promise<T | null>;
  getAllAsync<T>(sql: string, ...params: Bind[]): Promise<T[]>;
  withTransactionAsync(action: () => Promise<void>): Promise<void>;
}

type Payload = { payload: string };
const parse = <T>(row: Payload): T => JSON.parse(row.payload) as T;

export class Repository {
  private queue: Promise<unknown> = Promise.resolve();
  private db: Connection;
  private clock: () => Date;

  constructor(db: Connection, clock: () => Date = () => new Date()) {
    this.db = db;
    this.clock = clock;
  }

  private enqueue<T>(action: () => Promise<T>): Promise<T> {
    const result = this.queue.then(action);
    this.queue = result.then(
      () => undefined,
      () => undefined,
    );
    return result;
  }

  private write<T>(action: () => Promise<T>): Promise<T> {
    return this.enqueue(async () => {
      let result!: T;
      await this.db.withTransactionAsync(async () => {
        result = await action();
      });
      return result;
    });
  }

  async initialize() {
    await this.db.execAsync('PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL;');
    await this.write(async () => {
      const version = (await this.db.getFirstAsync<{ user_version: number }>(
        'PRAGMA user_version',
      ))!.user_version;
      if (version > migrations.length)
        throw new UserFacingError('O banco foi criado por uma versão mais recente do aplicativo.');
      for (let index = version; index < migrations.length; index++) {
        await this.db.execAsync(migrations[index]);
        await this.db.execAsync(`PRAGMA user_version = ${index + 1}`);
      }
      if (await this.db.getFirstAsync('SELECT value FROM meta WHERE key = ?', 'firstRunAt')) return;
      const firstRun = this.clock();
      const seed = await loadMockPlaces(firstRun);
      for (const place of seed.places)
        await this.db.runAsync(
          'INSERT INTO places(id,payload) VALUES (?,?)',
          place.id,
          JSON.stringify(place),
        );
      for (const fact of seed.evidence)
        await this.db.runAsync(
          'INSERT INTO evidence(id,place_id,payload) VALUES (?,?,?)',
          fact.id,
          fact.placeId,
          JSON.stringify(fact),
        );
      for (const report of seed.reports)
        await this.db.runAsync(
          'INSERT INTO reports(id,place_id,visit_id,payload) VALUES (?,?,?,?)',
          report.id,
          report.placeId,
          null,
          JSON.stringify(report),
        );
      for (const notice of seed.notices) {
        await this.db.runAsync(
          'INSERT INTO notices(id,place_id,payload) VALUES (?,?,?)',
          notice.id,
          notice.placeId,
          JSON.stringify(notice),
        );
        await this.insertNoticeEvent(notice.id, 'registered', notice.recordedAt);
      }
      await this.db.runAsync(
        'INSERT INTO preferences(id,payload) VALUES (1,?)',
        JSON.stringify([]),
      );
      await this.db.runAsync(
        'INSERT INTO meta(key,value) VALUES (?,?)',
        'firstRunAt',
        firstRun.toISOString(),
      );
    });
  }

  readSnapshot(): Promise<Snapshot> {
    return this.enqueue(async () => {
      const [
        places,
        evidence,
        preferences,
        visits,
        items,
        reports,
        notices,
        noticeEvents,
        positions,
        meta,
      ] = await Promise.all([
        this.db.getAllAsync<Payload>('SELECT payload FROM places ORDER BY rowid'),
        this.db.getAllAsync<Payload>('SELECT payload FROM evidence'),
        this.db.getFirstAsync<Payload>('SELECT payload FROM preferences WHERE id=1'),
        this.db.getAllAsync<Payload>('SELECT payload FROM visits ORDER BY rowid DESC'),
        this.db.getAllAsync<Payload>(
          'SELECT payload FROM checklist_items WHERE deleted_at IS NULL',
        ),
        this.db.getAllAsync<Payload>('SELECT payload FROM reports ORDER BY rowid DESC'),
        this.db.getAllAsync<Payload>('SELECT payload FROM notices ORDER BY rowid DESC'),
        this.db.getAllAsync<Payload>('SELECT payload FROM notice_events ORDER BY rowid DESC'),
        this.db.getAllAsync<{ place_id: string; position: number }>(
          'SELECT * FROM guide_positions',
        ),
        this.db.getFirstAsync<{ value: string }>(
          'SELECT value FROM meta WHERE key=?',
          'firstRunAt',
        ),
      ]);
      const parsedItems = items.map(parse<ChecklistItem>);
      return {
        places: places.map(parse<Place>),
        evidence: evidence.map(parse<Evidence>),
        needs: preferences ? parse<NeedKey[]>(preferences) : [],
        visits: visits.map(parse<Visit>).map((visit) => ({
          ...visit,
          items: parsedItems
            .filter((item) => item.visitId === visit.id)
            .sort((a, b) => a.position - b.position),
        })),
        reports: reports
          .map(parse<Report>)
          .sort((a, b) => b.recordedAt.localeCompare(a.recordedAt)),
        notices: notices
          .map(parse<Notice>)
          .sort((a, b) => b.recordedAt.localeCompare(a.recordedAt)),
        noticeEvents: noticeEvents.map(parse<NoticeEvent>),
        guidePositions: Object.fromEntries(positions.map((row) => [row.place_id, row.position])),
        firstRunAt: meta!.value,
      };
    });
  }

  savePreferences(needs: NeedKey[]) {
    const valid = [...new Set(needs)];
    if (valid.some((key) => !NEEDS.some((need) => need.key === key)))
      return Promise.reject(new UserFacingError('Preferência inválida.'));
    return this.write(() =>
      this.db.runAsync('UPDATE preferences SET payload=? WHERE id=1', JSON.stringify(valid)),
    );
  }

  createVisit(placeId: string, scheduledAt: string | null, needs: NeedKey[], question?: string) {
    return this.write(async () => {
      if (!(await this.db.getFirstAsync('SELECT id FROM places WHERE id=?', placeId)))
        throw new UserFacingError('Local não encontrado.');
      if (scheduledAt !== null && !Number.isFinite(Date.parse(scheduledAt)))
        throw new UserFacingError('Data inválida.');
      const now = this.clock().toISOString();
      const visit: Omit<Visit, 'items'> = {
        id: createId('visita'),
        placeId,
        scheduledAt,
        needs: [...needs],
        status: 'planned',
        currentStage: 0,
        createdAt: now,
        updatedAt: now,
        completedAt: null,
      };
      await this.db.runAsync(
        'INSERT INTO visits(id,place_id,payload) VALUES (?,?,?)',
        visit.id,
        placeId,
        JSON.stringify(visit),
      );
      const initial = [
        'Revisar o horário da consulta',
        'Separar os itens que já fazem parte da nossa rotina',
        question ?? 'Rever o passo a passo da visita',
      ];
      for (let index = 0; index < initial.length; index++)
        await this.insertItem(
          visit.id,
          initial[index],
          index,
          index === 2 && question ? 'confirmation' : 'personal',
        );
      return visit.id;
    });
  }

  private async visit(id: string) {
    const row = await this.db.getFirstAsync<Payload>('SELECT payload FROM visits WHERE id=?', id);
    if (!row) throw new UserFacingError('Visita não encontrada.');
    return parse<Omit<Visit, 'items'>>(row);
  }

  updateVisit(
    id: string,
    patch: { needs?: NeedKey[]; currentStage?: number; status?: Visit['status'] },
  ) {
    return this.write(async () => {
      const current = await this.visit(id);
      if (current.status === 'completed' && patch.status === 'in_progress')
        throw new UserFacingError('Esta visita já foi concluída.');
      if (
        patch.currentStage !== undefined &&
        (!Number.isInteger(patch.currentStage) || patch.currentStage < 0 || patch.currentStage > 4)
      )
        throw new UserFacingError('Etapa inválida.');
      const now = this.clock().toISOString();
      const next = {
        ...current,
        ...patch,
        updatedAt: now,
        completedAt:
          patch.status === 'completed' ? (current.completedAt ?? now) : current.completedAt,
      };
      await this.db.runAsync('UPDATE visits SET payload=? WHERE id=?', JSON.stringify(next), id);
    });
  }

  saveGuidePosition(placeId: string, position: number) {
    if (!Number.isInteger(position) || position < 0 || position > 4)
      return Promise.reject(new UserFacingError('Etapa inválida.'));
    return this.write(() =>
      this.db.runAsync(
        'INSERT INTO guide_positions(place_id,position) VALUES (?,?) ON CONFLICT(place_id) DO UPDATE SET position=excluded.position',
        placeId,
        position,
      ),
    );
  }

  private async insertItem(
    visitId: string,
    text: string,
    position: number,
    kind: ChecklistItem['kind'] = 'personal',
  ) {
    const item: ChecklistItem = {
      id: createId('item'),
      visitId,
      text: text.trim(),
      checked: false,
      position,
      kind,
    };
    await this.db.runAsync(
      'INSERT INTO checklist_items(id,visit_id,payload) VALUES (?,?,?)',
      item.id,
      visitId,
      JSON.stringify(item),
    );
    return item.id;
  }

  addItem(visitId: string, text: string, kind: ChecklistItem['kind'] = 'personal') {
    if (!text.trim() || text.trim().length > 160)
      return Promise.reject(new UserFacingError('Escreva um preparativo de até 160 caracteres.'));
    return this.write(async () => {
      await this.visit(visitId);
      const rows = await this.db.getAllAsync<Payload>(
        'SELECT payload FROM checklist_items WHERE visit_id=? AND deleted_at IS NULL',
        visitId,
      );
      if (
        rows.some(
          (row) => parse<ChecklistItem>(row).text.toLowerCase() === text.trim().toLowerCase(),
        )
      )
        throw new UserFacingError('Este preparativo já está na sua lista.');
      return this.insertItem(visitId, text, rows.length, kind);
    });
  }

  updateItem(id: string, patch: { text?: string; checked?: boolean; removed?: boolean }) {
    return this.write(async () => {
      const row = await this.db.getFirstAsync<Payload>(
        'SELECT payload FROM checklist_items WHERE id=? AND deleted_at IS NULL',
        id,
      );
      if (!row) throw new UserFacingError('Preparativo não encontrado.');
      if (patch.text !== undefined && (!patch.text.trim() || patch.text.trim().length > 160))
        throw new UserFacingError('Escreva um preparativo de até 160 caracteres.');
      const item = {
        ...parse<ChecklistItem>(row),
        ...(patch.text !== undefined ? { text: patch.text.trim() } : {}),
        ...(patch.checked !== undefined ? { checked: patch.checked } : {}),
      };
      await this.db.runAsync(
        'UPDATE checklist_items SET payload=?,deleted_at=? WHERE id=?',
        JSON.stringify(item),
        patch.removed ? this.clock().toISOString() : null,
        id,
      );
    });
  }

  saveReport(input: {
    placeId: string;
    visitId?: string | null;
    outcome: Report['outcome'];
    need?: NeedKey | null;
    text?: string;
  }) {
    return this.write(async () => {
      if (input.visitId) {
        const visit = await this.visit(input.visitId);
        if (visit.placeId !== input.placeId || visit.status !== 'completed')
          throw new UserFacingError('Finalize a visita antes de registrar o retorno.');
      }
      if ((input.text ?? '').length > 600) throw new UserFacingError('Use até 600 caracteres.');
      const existing = input.visitId
        ? await this.db.getFirstAsync<Payload>(
            'SELECT payload FROM reports WHERE visit_id=?',
            input.visitId,
          )
        : null;
      const previous = existing ? parse<Report>(existing) : null;
      const now = this.clock();
      const report: Report = {
        id: previous?.id ?? createId('relato'),
        placeId: input.placeId,
        visitId: input.visitId ?? null,
        outcome: input.outcome,
        need: input.need ?? null,
        text: input.text?.trim() ?? '',
        origin: 'local',
        recordedAt: previous?.recordedAt ?? now.toISOString(),
        confirmedAt: now.toISOString(),
        expiresAt: new Date(now.getTime() + GUIDE_TTL).toISOString(),
      };
      await this.db.runAsync(
        'INSERT INTO reports(id,place_id,visit_id,payload) VALUES (?,?,?,?) ON CONFLICT(id) DO UPDATE SET payload=excluded.payload',
        report.id,
        report.placeId,
        report.visitId,
        JSON.stringify(report),
      );
      return report.id;
    });
  }

  createNotice(input: {
    placeId: string;
    need: NeedKey;
    title: string;
    text: string;
    effect: Notice['effect'];
  }) {
    if (!input.title.trim() || input.title.trim().length > 100 || input.text.length > 600)
      return Promise.reject(
        new UserFacingError('Informe um título de até 100 caracteres e uma descrição de até 600.'),
      );
    return this.write(async () => {
      const now = this.clock();
      const notice: Notice = {
        ...input,
        title: input.title.trim(),
        text: input.text.trim(),
        id: createId('aviso'),
        origin: 'local',
        resolvedAt: null,
        recordedAt: now.toISOString(),
        confirmedAt: now.toISOString(),
        expiresAt: new Date(now.getTime() + NOTICE_TTL).toISOString(),
      };
      await this.db.runAsync(
        'INSERT INTO notices(id,place_id,payload) VALUES (?,?,?)',
        notice.id,
        notice.placeId,
        JSON.stringify(notice),
      );
      await this.insertNoticeEvent(notice.id, 'registered', notice.recordedAt);
      return notice.id;
    });
  }

  private async insertNoticeEvent(noticeId: string, kind: NoticeEvent['kind'], createdAt: string) {
    const event: NoticeEvent = { id: createId('evento'), noticeId, kind, createdAt };
    await this.db.runAsync(
      'INSERT INTO notice_events(id,notice_id,payload) VALUES (?,?,?)',
      event.id,
      noticeId,
      JSON.stringify(event),
    );
  }

  updateNotice(id: string, action: 'confirmed' | 'resolved') {
    return this.write(async () => {
      const row = await this.db.getFirstAsync<Payload>(
        'SELECT payload FROM notices WHERE id=?',
        id,
      );
      if (!row) throw new UserFacingError('Aviso não encontrado.');
      const current = parse<Notice>(row);
      if (current.resolvedAt)
        throw new UserFacingError(
          'Este aviso já foi resolvido. Registre um novo aviso se a situação voltou.',
        );
      const now = this.clock();
      const next =
        action === 'resolved'
          ? { ...current, resolvedAt: now.toISOString() }
          : {
              ...current,
              confirmedAt: now.toISOString(),
              expiresAt: new Date(now.getTime() + NOTICE_TTL).toISOString(),
            };
      await this.db.runAsync('UPDATE notices SET payload=? WHERE id=?', JSON.stringify(next), id);
      await this.insertNoticeEvent(id, action, now.toISOString());
    });
  }
}
