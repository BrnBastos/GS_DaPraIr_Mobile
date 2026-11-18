export const DATABASE_NAME = 'da-pra-ir.db';

export const migrations = [
  `CREATE TABLE IF NOT EXISTS meta (key TEXT PRIMARY KEY NOT NULL, value TEXT NOT NULL);
   CREATE TABLE IF NOT EXISTS places (id TEXT PRIMARY KEY NOT NULL, payload TEXT NOT NULL CHECK(json_valid(payload)));
   CREATE TABLE IF NOT EXISTS evidence (id TEXT PRIMARY KEY NOT NULL, place_id TEXT NOT NULL REFERENCES places(id), payload TEXT NOT NULL CHECK(json_valid(payload)));
   CREATE TABLE IF NOT EXISTS preferences (id INTEGER PRIMARY KEY CHECK(id = 1), payload TEXT NOT NULL CHECK(json_valid(payload)));
   CREATE TABLE IF NOT EXISTS visits (id TEXT PRIMARY KEY NOT NULL, place_id TEXT NOT NULL REFERENCES places(id), payload TEXT NOT NULL CHECK(json_valid(payload)));
   CREATE TABLE IF NOT EXISTS checklist_items (id TEXT PRIMARY KEY NOT NULL, visit_id TEXT NOT NULL REFERENCES visits(id), payload TEXT NOT NULL CHECK(json_valid(payload)), deleted_at TEXT);
   CREATE TABLE IF NOT EXISTS reports (id TEXT PRIMARY KEY NOT NULL, place_id TEXT NOT NULL REFERENCES places(id), visit_id TEXT UNIQUE REFERENCES visits(id), payload TEXT NOT NULL CHECK(json_valid(payload)));
   CREATE TABLE IF NOT EXISTS notices (id TEXT PRIMARY KEY NOT NULL, place_id TEXT NOT NULL REFERENCES places(id), payload TEXT NOT NULL CHECK(json_valid(payload)));
   CREATE TABLE IF NOT EXISTS notice_events (id TEXT PRIMARY KEY NOT NULL, notice_id TEXT NOT NULL REFERENCES notices(id), payload TEXT NOT NULL CHECK(json_valid(payload)));
   CREATE TABLE IF NOT EXISTS guide_positions (place_id TEXT PRIMARY KEY NOT NULL REFERENCES places(id), position INTEGER NOT NULL CHECK(position BETWEEN 0 AND 4));
   CREATE INDEX IF NOT EXISTS evidence_place ON evidence(place_id);
   CREATE INDEX IF NOT EXISTS visits_place ON visits(place_id);
   CREATE INDEX IF NOT EXISTS checklist_visit ON checklist_items(visit_id);
   CREATE INDEX IF NOT EXISTS reports_place ON reports(place_id);
   CREATE INDEX IF NOT EXISTS notices_place ON notices(place_id);
   CREATE INDEX IF NOT EXISTS events_notice ON notice_events(notice_id);`,
] as const;
