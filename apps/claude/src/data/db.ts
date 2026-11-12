// Minimal async SQL port so the same repository runs on expo-sqlite (device)
// and node:sqlite (tests).
export type Param = string | number | null;

export interface SqlDriver {
  exec(sql: string): Promise<void>;
  run(sql: string, params: Param[]): Promise<void>;
  all<T>(sql: string, params: Param[]): Promise<T[]>;
  close(): Promise<void>;
}

export class DB {
  private queue: Promise<unknown> = Promise.resolve();
  private inTx = false;

  constructor(private driver: SqlDriver) {}

  exec(sql: string) {
    return this.driver.exec(sql);
  }
  run(sql: string, params: Param[] = []) {
    return this.driver.run(sql, params);
  }
  all<T>(sql: string, params: Param[] = []) {
    return this.driver.all<T>(sql, params);
  }
  async first<T>(sql: string, params: Param[] = []): Promise<T | null> {
    const rows = await this.driver.all<T>(sql, params);
    return rows[0] ?? null;
  }

  /**
   * Serialized write transaction. Either every statement commits or none
   * does; callers acknowledge to the user only after this resolves.
   */
  tx<T>(fn: () => Promise<T>): Promise<T> {
    if (this.inTx) return fn(); // nested call joins the outer transaction
    const run = async () => {
      await this.driver.exec('BEGIN IMMEDIATE');
      this.inTx = true;
      try {
        const out = await fn();
        await this.driver.exec('COMMIT');
        return out;
      } catch (e) {
        try {
          await this.driver.exec('ROLLBACK');
        } catch {
          /* already rolled back */
        }
        throw e;
      } finally {
        this.inTx = false;
      }
    };
    const p = this.queue.then(run, run);
    this.queue = p.catch(() => undefined);
    return p;
  }

  close() {
    return this.driver.close();
  }
}

/** Outbox payload schema accepted by the server (unchanged by local-only migrations). */
export const SCHEMA_VERSION = 1;

export const MIGRATIONS: string[] = [
  `
  CREATE TABLE IF NOT EXISTS meta (key TEXT PRIMARY KEY, value TEXT);
  CREATE TABLE IF NOT EXISTS exercises (
    id TEXT PRIMARY KEY,
    owner_id TEXT,
    name TEXT NOT NULL,
    normalized_name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('weight_reps','reps','seconds')),
    category TEXT NOT NULL DEFAULT 'custom',
    equipment TEXT NOT NULL DEFAULT 'unknown',
    primary_muscles TEXT NOT NULL DEFAULT '[]',
    secondary_muscles TEXT NOT NULL DEFAULT '[]',
    instructions TEXT NOT NULL DEFAULT '',
    source_id TEXT,
    archived INTEGER NOT NULL DEFAULT 0,
    ever_used INTEGER NOT NULL DEFAULT 0,
    revision INTEGER NOT NULL DEFAULT 0,
    last_used_at TEXT
  );
  CREATE INDEX IF NOT EXISTS ix_ex_norm ON exercises(normalized_name);
  CREATE TABLE IF NOT EXISTS workouts (
    id TEXT PRIMARY KEY,
    workout_date TEXT NOT NULL,
    state TEXT NOT NULL CHECK (state IN ('active','finished')),
    started_at TEXT NOT NULL,
    finished_at TEXT,
    duration_seconds INTEGER,
    routine_id TEXT,
    routine_name TEXT,
    default_rest_seconds INTEGER,
    backdated INTEGER NOT NULL DEFAULT 0,
    revision INTEGER NOT NULL DEFAULT 0,
    deleted INTEGER NOT NULL DEFAULT 0
  );
  CREATE INDEX IF NOT EXISTS ix_w_date ON workouts(workout_date DESC, id DESC);
  CREATE UNIQUE INDEX IF NOT EXISTS ux_w_active ON workouts(state) WHERE state = 'active' AND deleted = 0;
  CREATE TABLE IF NOT EXISTS entries (
    id TEXT PRIMARY KEY,
    workout_id TEXT NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
    exercise_id TEXT NOT NULL REFERENCES exercises(id),
    position INTEGER NOT NULL,
    phase TEXT NOT NULL CHECK (phase IN ('warmup','work','mobility')),
    rest_mode TEXT NOT NULL DEFAULT 'inherit',
    rest_seconds INTEGER
  );
  CREATE INDEX IF NOT EXISTS ix_entries_w ON entries(workout_id, position);
  CREATE INDEX IF NOT EXISTS ix_entries_ex ON entries(exercise_id);
  CREATE TABLE IF NOT EXISTS sets (
    id TEXT PRIMARY KEY,
    entry_id TEXT NOT NULL REFERENCES entries(id) ON DELETE CASCADE,
    position INTEGER NOT NULL,
    state TEXT NOT NULL CHECK (state IN ('pending','done','skipped')),
    target_reps INTEGER, target_seconds INTEGER, target_load REAL, target_unit TEXT,
    target_rir_min INTEGER, target_rir_max INTEGER,
    weight REAL, unit TEXT, reps INTEGER, seconds INTEGER, rir INTEGER,
    completed_at TEXT
  );
  CREATE INDEX IF NOT EXISTS ix_sets_e ON sets(entry_id, position);
  CREATE TABLE IF NOT EXISTS routines (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    normalized_name TEXT NOT NULL,
    default_rest_seconds INTEGER,
    revision INTEGER NOT NULL DEFAULT 0,
    updated_at TEXT NOT NULL,
    deleted INTEGER NOT NULL DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS routine_entries (
    id TEXT PRIMARY KEY,
    routine_id TEXT NOT NULL REFERENCES routines(id) ON DELETE CASCADE,
    exercise_id TEXT NOT NULL REFERENCES exercises(id),
    position INTEGER NOT NULL,
    phase TEXT NOT NULL DEFAULT 'work',
    target_sets INTEGER, target_reps INTEGER, target_seconds INTEGER, target_load REAL, target_unit TEXT,
    target_rir_min INTEGER, target_rir_max INTEGER,
    rest_mode TEXT NOT NULL DEFAULT 'inherit', rest_seconds INTEGER
  );
  CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    unit TEXT NOT NULL DEFAULT 'kg',
    unit_chosen INTEGER NOT NULL DEFAULT 0,
    show_equivalent INTEGER NOT NULL DEFAULT 1,
    text_scale REAL NOT NULL DEFAULT 1,
    revision INTEGER NOT NULL DEFAULT 0
  );
  INSERT OR IGNORE INTO settings (id) VALUES (1);
  CREATE TABLE IF NOT EXISTS reminder (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    enabled INTEGER NOT NULL DEFAULT 0,
    weekdays TEXT NOT NULL DEFAULT '[1,3,5]',
    time TEXT NOT NULL DEFAULT '18:00',
    revision INTEGER NOT NULL DEFAULT 0
  );
  INSERT OR IGNORE INTO reminder (id) VALUES (1);
  CREATE TABLE IF NOT EXISTS goals (
    id TEXT PRIMARY KEY,
    exercise_id TEXT NOT NULL REFERENCES exercises(id),
    target_load REAL NOT NULL, unit TEXT NOT NULL, min_reps INTEGER NOT NULL, deadline TEXT,
    created_at TEXT NOT NULL,
    revision INTEGER NOT NULL DEFAULT 0,
    deleted INTEGER NOT NULL DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS bodyweight (
    id TEXT PRIMARY KEY,
    reading_date TEXT NOT NULL, entered_at TEXT NOT NULL, weight REAL NOT NULL, unit TEXT NOT NULL,
    revision INTEGER NOT NULL DEFAULT 0,
    deleted INTEGER NOT NULL DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS bodyweight_target (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    weight REAL, unit TEXT, target_date TEXT,
    revision INTEGER NOT NULL DEFAULT 0,
    deleted INTEGER NOT NULL DEFAULT 1
  );
  INSERT OR IGNORE INTO bodyweight_target (id) VALUES (1);
  CREATE TABLE IF NOT EXISTS outbox (
    seq INTEGER PRIMARY KEY AUTOINCREMENT,
    operation_id TEXT NOT NULL UNIQUE,
    kind TEXT NOT NULL,
    aggregate_id TEXT NOT NULL,
    base_revision INTEGER NOT NULL,
    payload TEXT NOT NULL,
    payload_hash TEXT NOT NULL,
    timezone TEXT NOT NULL,
    schema_version INTEGER NOT NULL,
    created_at TEXT NOT NULL,
    attempts INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','blocked')),
    last_error TEXT
  );
  CREATE INDEX IF NOT EXISTS ix_outbox_agg ON outbox(aggregate_id, seq);
  CREATE TABLE IF NOT EXISTS conflicts (
    id TEXT PRIMARY KEY,
    kind TEXT NOT NULL,
    aggregate_id TEXT NOT NULL UNIQUE,
    local_snapshot TEXT NOT NULL,
    remote_snapshot TEXT,
    remote_revision INTEGER NOT NULL,
    reason TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS device_state (key TEXT PRIMARY KEY, value TEXT NOT NULL);
  `,
  // v2 (Claude round 2): exercise form media and the male/female body figure preference.
  `
  ALTER TABLE exercises ADD COLUMN media TEXT NOT NULL DEFAULT '[]';
  ALTER TABLE settings ADD COLUMN body_figure TEXT NOT NULL DEFAULT 'male';
  `,
];

export async function migrate(db: DB): Promise<void> {
  await db.exec('PRAGMA foreign_keys = ON');
  await db.exec('CREATE TABLE IF NOT EXISTS meta (key TEXT PRIMARY KEY, value TEXT)');
  const row = await db.first<{ value: string }>("SELECT value FROM meta WHERE key = 'schema_version'");
  const current = row ? Number(row.value) : 0;
  for (let v = current; v < MIGRATIONS.length; v++) {
    await db.tx(async () => {
      await db.exec(MIGRATIONS[v]);
      await db.run("INSERT OR REPLACE INTO meta (key, value) VALUES ('schema_version', ?)", [String(v + 1)]);
    });
  }
}
