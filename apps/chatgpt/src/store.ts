import {
  defaults, isDeleted, rootKey, validateRoot, validateSet,
  type Conflict, type Kind, type Model, type Root, type Snapshot, type Workout,
} from './domain';
import { demoRecords, library } from './seed';

type Value = string | number | null;
export interface Database {
  execSync(sql: string): void;
  runSync(sql: string, ...params: Value[]): unknown;
  getAllSync<T>(sql: string, ...params: Value[]): T[];
  getFirstSync<T>(sql: string, ...params: Value[]): T | null;
  withTransactionSync(work: () => void): void;
}
type Row = { body: string; revision: number };
type QueueRow = { seq: number; operation_id: string; body: string; base_revision: number | null; timezone: string; schema_version: number };
export type Operation = {
  seq: number; operationId: string; root: Root; baseRevision: number; timezone: string; schemaVersion: number;
};
export type Change = Snapshot & { cursor: number; used?: string[] };
export type Page = { changes: Change[]; cursor: number; highWater: number };
export type Receipt =
  | { status: 'ok'; revision: number }
  | { status: 'conflict'; reason: string; remote: Snapshot | null; blocker?: Snapshot };

const migrations = [`
CREATE TABLE roots (
  kind TEXT NOT NULL, id TEXT NOT NULL, body TEXT NOT NULL CHECK(json_valid(body)),
  revision INTEGER NOT NULL CHECK(revision >= 0), PRIMARY KEY(kind,id)
);
CREATE UNIQUE INDEX only_one_active ON roots (kind)
WHERE kind='workout' AND json_extract(body,'$.state')='active' AND json_extract(body,'$.deleted') IS NULL;
CREATE TABLE ever_used (id TEXT PRIMARY KEY);
CREATE TABLE outbox (
  seq INTEGER PRIMARY KEY AUTOINCREMENT, operation_id TEXT NOT NULL UNIQUE,
  kind TEXT NOT NULL, id TEXT NOT NULL, body TEXT NOT NULL CHECK(json_valid(body)),
  timezone TEXT NOT NULL, base_revision INTEGER,
  FOREIGN KEY (kind,id) REFERENCES roots(kind,id)
);
CREATE INDEX outbox_root ON outbox(kind,id,seq);
CREATE TABLE conflicts (
  kind TEXT NOT NULL, id TEXT NOT NULL, body TEXT NOT NULL CHECK(json_valid(body)), PRIMARY KEY(kind,id),
  FOREIGN KEY (kind,id) REFERENCES roots(kind,id)
);
CREATE TABLE metadata (key TEXT PRIMARY KEY, value TEXT NOT NULL);
`, 'ALTER TABLE outbox ADD COLUMN schema_version INTEGER NOT NULL DEFAULT 1;'];

export class Store {
  constructor(private db: Database, private id: () => string, readonly demo = false) {
    db.execSync('PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;');
    const version = db.getFirstSync<{user_version: number}>('PRAGMA user_version')?.user_version ?? 0;
    for (let i = version; i < migrations.length; i++) {
      db.withTransactionSync(() => db.execSync(migrations[i] + 'PRAGMA user_version=' + (i + 1)));
    }
    if (demo && !this.meta('seeded')) {
      db.withTransactionSync(() => {
        for (const root of demoRecords(id)) this.write({ root, revision: 0 });
        this.setMeta('seeded', 'true');
      });
    }
  }

  private meta(key: string) {
    return this.db.getFirstSync<{value: string}>('SELECT value FROM metadata WHERE key=?', key)?.value;
  }
  private setMeta(key: string, value: string) {
    this.db.runSync('INSERT OR REPLACE INTO metadata VALUES (?,?)', key, value);
  }
  get cursor() { return Number(this.meta('cursor') ?? 0); }

  model(): Model {
    const model: Model = {
      workouts: [], exercises: [...library], templates: [], settings: defaults, hasSettings: false,
      used: new Set(this.db.getAllSync<{id: string}>('SELECT id FROM ever_used').map(r => r.id)),
      pending: new Set(this.db.getAllSync<{kind: Kind; id: string}>('SELECT DISTINCT kind,id FROM outbox')
        .map(r => rootKey(r.kind, r.id))),
      conflicts: this.db.getAllSync<{body: string}>('SELECT body FROM conflicts ORDER BY kind,id')
        .map(r => JSON.parse(r.body) as Conflict),
    };
    for (const { body } of this.db.getAllSync<Row>('SELECT body FROM roots')) {
      const root = JSON.parse(body) as Root;
      if (isDeleted(root)) continue;
      if (root.kind === 'workout') model.workouts.push(root);
      if (root.kind === 'exercise') model.exercises.push(root);
      if (root.kind === 'template') model.templates.push(root);
      if (root.kind === 'settings') { model.settings = root; model.hasSettings = true; }
    }
    return model;
  }

  get(kind: Kind, id: string): Snapshot | null {
    const row = this.db.getFirstSync<Row>('SELECT body,revision FROM roots WHERE kind=? AND id=?', kind, id);
    return row ? { root: JSON.parse(row.body) as Root, revision: row.revision } : null;
  }

  private write({ root, revision }: Snapshot) {
    this.db.runSync(`INSERT INTO roots VALUES (?,?,?,?) ON CONFLICT(kind,id)
      DO UPDATE SET body=excluded.body,revision=excluded.revision`,
    root.kind, root.id, JSON.stringify(root), revision);
    if (root.kind === 'workout') {
      for (const entry of root.entries) {
        if (entry.sets.length) this.db.runSync('INSERT OR IGNORE INTO ever_used VALUES (?)', entry.exerciseId);
      }
    }
  }

  private enqueue(root: Root, revision: number) {
    this.write({ root, revision });
    if (!this.demo) {
      this.db.runSync('INSERT INTO outbox(operation_id,kind,id,body,timezone) VALUES (?,?,?,?,?)',
        this.id(), root.kind, root.id, JSON.stringify(root), Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC');
    }
  }

  save(root: Root, expected?: Root, archived?: Set<string>) {
    this.db.withTransactionSync(() => {
      const current = this.get(root.kind, root.id);
      if ((expected && JSON.stringify(expected) !== JSON.stringify(current?.root)) || (!expected && current)) {
        throw Error('This record changed. Reopen it to apply your changes.');
      }
      validateRoot(root, this.model(), archived);
      this.enqueue(root, current?.revision ?? 0);
    });
  }

  next(): Operation | undefined {
    const conflicts = this.model().conflicts;
    const isBlocked = (kind: Kind, id: string) => conflicts.some(c => c.kind === kind && c.id === id);
    const queue = this.db.getAllSync<QueueRow>('SELECT * FROM outbox ORDER BY seq');
    const seen = new Set<string>();
    for (const row of queue) {
      const root = JSON.parse(row.body) as Root;
      const key = rootKey(root.kind, root.id);
      if (seen.has(key)) continue;
      seen.add(key);
      if (isBlocked(root.kind, root.id)) continue;
      const references = root.kind === 'workout' ? root.entries.map(e => e.exerciseId) :
        root.kind === 'template' ? root.exercises : [];
      if (!isDeleted(root) && references.some(id => isBlocked('exercise', id) ||
        this.get('exercise', id)?.revision === 0)) continue;
      const baseRevision = row.base_revision ?? this.get(root.kind, root.id)!.revision;
      if (row.base_revision === null) {
        this.db.runSync('UPDATE outbox SET base_revision=? WHERE seq=?', baseRevision, row.seq);
      }
      return { seq: row.seq, operationId: row.operation_id, root, baseRevision, timezone: row.timezone, schemaVersion: row.schema_version };
    }
  }

  acknowledge(op: Operation, receipt: Receipt) {
    this.db.withTransactionSync(() => {
      if (receipt.status === 'conflict') {
        this.mark({ kind: op.root.kind, id: op.root.id, ...receipt });
      } else {
        this.db.runSync('DELETE FROM outbox WHERE seq=?', op.seq);
        this.db.runSync('UPDATE roots SET revision=? WHERE kind=? AND id=?', receipt.revision, op.root.kind, op.root.id);
      }
    });
  }

  private mark(conflict: Conflict) {
    this.db.runSync('INSERT OR REPLACE INTO conflicts VALUES (?,?,?)',
      conflict.kind, conflict.id, JSON.stringify(conflict));
  }

  private activeConflict(incoming: Snapshot) {
    if (incoming.root.kind !== 'workout' || incoming.root.state !== 'active' || isDeleted(incoming.root)) return false;
    const active = this.model().workouts.find(w => w.state === 'active' && w.id !== incoming.root.id);
    if (!active) return false;
    const old = this.model().conflicts.find(c => c.kind === 'workout' && c.id === active.id);
    this.mark({ kind: 'workout', id: active.id, reason: 'Another device has an active workout.',
      remote: old?.remote ?? null, blocker: incoming });
    return true;
  }

  applyPage(page: Page) {
    this.db.withTransactionSync(() => {
      for (const change of page.changes) {
        const { root, revision } = change;
        for (const id of change.used ?? []) this.db.runSync('INSERT OR IGNORE INTO ever_used VALUES (?)', id);
        const current = this.get(root.kind, root.id);
        if (current && current.revision >= revision) continue;
        const model = this.model();
        const existing = model.conflicts.find(c => c.kind === root.kind && c.id === root.id);
        const blocker = model.conflicts.find(c => c.blocker?.root.id === root.id && c.blocker.root.kind === root.kind);
        if (blocker) {
          this.mark({ ...blocker, blocker: { root, revision } });
        } else if (existing || model.pending.has(rootKey(root.kind, root.id))) {
          this.mark({ kind: root.kind, id: root.id, reason: existing?.reason ?? 'This record changed on another device.',
            remote: { root, revision }, blocker: existing?.blocker });
        } else if (!this.activeConflict({ root, revision })) {
          this.write({ root, revision });
        }
      }
      this.setMeta('cursor', String(page.cursor));
    });
  }

  resolve(conflict: Conflict, choice: 'remote' | 'local' | 'copy', finishedCopy?: Workout, reviewed?: Root) {
    this.db.withTransactionSync(() => {
      const { kind, id, remote, blocker } = conflict;
      const existing = this.model().conflicts.find(c => c.kind === kind && c.id === id);
      if (JSON.stringify(existing) !== JSON.stringify(conflict)) throw Error('The server record changed. Review it again.');
      const local = this.get(kind, id)?.root;
      if (!local) throw Error('Local record unavailable.');
      if (choice === 'local' && kind === 'workout') throw Error('Save workout changes as a separate copy.');
      if (choice === 'remote' && kind === 'exercise' && !remote &&
        (this.model().workouts.some(w => w.entries.some(e => e.exerciseId === id)) ||
          this.model().templates.some(t => t.exercises.includes(id)))) {
        throw Error('This exercise is referenced locally. Rename it and keep your changes to preserve those references.');
      }
      if (choice === 'remote' && local.kind === 'exercise' && remote?.root.kind === 'exercise'
        && local.type !== remote.root.type) {
        const type = remote.root.type;
        try {
          for (const w of this.model().workouts) {
            for (const entry of w.entries.filter(e => e.exerciseId === id)) {
              for (const set of entry.sets) validateSet(set, type);
            }
          }
        } catch {
          throw Error('The server type does not match recorded local sets. Resolve or remove those sets first.');
        }
      }
      if (reviewed && (reviewed.kind !== kind || reviewed.id !== id)) throw Error('Review the same record before saving.');
      this.db.runSync('DELETE FROM outbox WHERE kind=? AND id=?', kind, id);
      this.db.runSync('DELETE FROM conflicts WHERE kind=? AND id=?', kind, id);
      if (remote) this.write(remote);
      else this.db.runSync('DELETE FROM roots WHERE kind=? AND id=?', kind, id);
      if (blocker && !this.activeConflict(blocker)) this.write(blocker);
      if (choice === 'copy') {
        if (local.kind !== 'workout' || isDeleted(local)) throw Error('There is no workout to copy.');
        const source = finishedCopy ?? local;
        const archived = new Set(source.entries.map(e => e.exerciseId));
        const root: Workout = { ...source, id: this.id(), copyOf: local.id,
          entries: source.entries.map(e => ({ ...e, id: this.id(), sets: e.sets.map(s => ({ ...s, id: this.id() })) })) };
        validateRoot(root, this.model(), archived);
        this.enqueue(root, 0);
      } else if (choice === 'local') {
        const root = reviewed ?? local;
        if (root.kind === 'template' && remote && isDeleted(remote.root) && !isDeleted(root)) {
          const restored: Root = { ...root, id: this.id(), copyOf: root.id };
          validateRoot(restored, this.model(), new Set(root.exercises));
          this.enqueue(restored, 0);
        } else {
          validateRoot(root, this.model());
          this.enqueue(root, remote?.revision ?? 0);
        }
      }
    });
  }

  discardPartition() {
    this.db.withTransactionSync(() => {
      this.db.execSync('DELETE FROM outbox; DELETE FROM conflicts; DELETE FROM roots; DELETE FROM ever_used; DELETE FROM metadata;');
    });
  }
}
