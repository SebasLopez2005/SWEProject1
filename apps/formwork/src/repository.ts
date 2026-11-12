import * as Crypto from 'expo-crypto';
import { openDatabaseSync } from 'expo-sqlite';
import { Change, Rest, Root, RootKind } from './model';
import { demoSeed } from './seed';

const db = openDatabaseSync('formwork-attempt3.sqlite');
db.execSync(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;
  CREATE TABLE IF NOT EXISTS records (
    owner TEXT NOT NULL, kind TEXT NOT NULL, id TEXT NOT NULL, value TEXT,
    revision INTEGER NOT NULL DEFAULT 0, PRIMARY KEY(owner, kind, id)
  );
  CREATE TABLE IF NOT EXISTS outbox (
    seq INTEGER PRIMARY KEY AUTOINCREMENT, owner TEXT NOT NULL, op TEXT NOT NULL UNIQUE,
    kind TEXT NOT NULL, id TEXT NOT NULL, value TEXT, base INTEGER NOT NULL, zone TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS outbox_root ON outbox(owner, kind, id, seq);
  CREATE TABLE IF NOT EXISTS conflicts (
    owner TEXT NOT NULL, kind TEXT NOT NULL, id TEXT NOT NULL,
    remote TEXT, revision INTEGER NOT NULL, reason TEXT NOT NULL,
    PRIMARY KEY(owner, kind, id)
  );
  CREATE TABLE IF NOT EXISTS meta (
    owner TEXT NOT NULL, key TEXT NOT NULL, value TEXT NOT NULL, PRIMARY KEY(owner, key)
  );
  PRAGMA user_version = 1;
`);

export const newId = () => Crypto.randomUUID();
export type Operation = { seq: number; op: string; kind: RootKind; id: string; value: string | null; base: number; zone: string };
export type Conflict = { kind: RootKind; id: string; remote: string | null; revision: number; reason: string };
export type Remote = { cursor: number; kind: RootKind; id: string; revision: number; value: Root[RootKind] | null };

export class Repository {
  constructor(readonly owner: string, readonly demo: boolean) {}

  list<K extends RootKind>(kind: K): Root[K][] {
    return db.getAllSync<{ value: string }>('SELECT value FROM records WHERE owner=? AND kind=? AND value IS NOT NULL', this.owner, kind)
      .map(row => JSON.parse(row.value));
  }

  private write(kind: RootKind, id: string, value: string | null, revision: number) {
    db.runSync(`INSERT INTO records VALUES (?, ?, ?, ?, ?) ON CONFLICT(owner,kind,id)
      DO UPDATE SET value=excluded.value, revision=excluded.revision`, this.owner, kind, id, value, revision);
  }

  private writeChanges(changes: Change[]) {
    for (const change of changes) {
      const { id, kind } = change;
      const value = change.value == null ? null : JSON.stringify(change.value);
      const base = db.getFirstSync<{ revision: number }>(
        'SELECT revision FROM records WHERE owner=? AND kind=? AND id=?', this.owner, kind, id)?.revision ?? 0;
      this.write(kind, id, value, base);
      if (!this.demo) db.runSync('INSERT INTO outbox(owner,op,kind,id,value,base,zone) VALUES(?,?,?,?,?,?,?)',
        this.owner, newId(), kind, id, value, base, Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC');
    }
  }

  save(changes: Change[], rest?: Rest | null) {
    db.withTransactionSync(() => {
      this.writeChanges(changes);
      if (rest !== undefined) this.setMeta('rest', rest);
    });
  }

  seedDemo() {
    if (!this.demo || this.meta('seeded', false)) return;
    db.withTransactionSync(() => {
      this.writeChanges(demoSeed(newId));
      this.setMeta('seeded', true);
    });
  }

  meta<T>(key: string, fallback: T): T {
    const record = db.getFirstSync<{ value: string }>('SELECT value FROM meta WHERE owner=? AND key=?', this.owner, key);
    return record ? JSON.parse(record.value) : fallback;
  }

  setMeta(key: string, value: unknown) {
    db.runSync('INSERT INTO meta VALUES(?,?,?) ON CONFLICT(owner,key) DO UPDATE SET value=excluded.value',
      this.owner, key, JSON.stringify(value));
  }

  queue() {
    return db.getAllSync<Operation>('SELECT seq,op,kind,id,value,base,zone FROM outbox WHERE owner=? ORDER BY seq', this.owner);
  }

  conflicts() {
    return db.getAllSync<Conflict>('SELECT kind,id,remote,revision,reason FROM conflicts WHERE owner=? ORDER BY kind,id', this.owner);
  }

  acknowledge(op: Operation, revision: number) {
    db.withTransactionSync(() => {
      db.runSync('DELETE FROM outbox WHERE owner=? AND seq=?', this.owner, op.seq);
      db.runSync('UPDATE records SET revision=? WHERE owner=? AND kind=? AND id=?', revision, this.owner, op.kind, op.id);
      db.runSync('UPDATE outbox SET base=? WHERE owner=? AND kind=? AND id=?', revision, this.owner, op.kind, op.id);
    });
  }

  conflict(op: Pick<Operation, 'kind' | 'id'>, value: Root[RootKind] | null, revision: number, reason: string) {
    db.runSync(`INSERT INTO conflicts VALUES (?,?,?,?,?,?) ON CONFLICT(owner,kind,id) DO UPDATE
      SET remote=excluded.remote,revision=excluded.revision,reason=excluded.reason`,
    this.owner, op.kind, op.id, value == null ? null : JSON.stringify(value), revision, reason);
  }

  pull(rows: Remote[]) {
    db.withTransactionSync(() => {
      for (const remote of rows) {
        const { id, kind, revision, value } = remote;
        const local = db.getFirstSync<{ revision: number }>('SELECT revision FROM records WHERE owner=? AND kind=? AND id=?', this.owner, kind, id);
        if ((local?.revision ?? 0) >= revision) continue;
        const dirty = db.getFirstSync('SELECT 1 FROM outbox WHERE owner=? AND kind=? AND id=? LIMIT 1', this.owner, kind, id);
        const active = kind === 'workout' && (value as Root['workout'] | null)?.state === 'active'
          && this.list('workout').some(w => w.state === 'active' && w.id !== id);
        if (dirty || active) this.conflict(remote, value, revision, active ? 'Another workout is active on this device.' : 'A newer version exists online.');
        else {
          this.write(kind, id, value == null ? null : JSON.stringify(value), revision);
          db.runSync('DELETE FROM conflicts WHERE owner=? AND kind=? AND id=?', this.owner, kind, id);
        }
      }
      if (rows.length) this.setMeta('cursor', rows[rows.length - 1].cursor);
    });
  }

  resolve(conflict: Conflict, resolution: 'remote' | 'local' | 'copy') {
    const { kind, id, remote, revision } = conflict;
    db.withTransactionSync(() => {
      const latest = this.conflicts().find(item => item.kind === kind && item.id === id);
      if (!latest || latest.revision !== revision || latest.remote !== remote) throw Error('This conflict changed. Close and review it again.');
      if (kind === 'exercise' && !remote && resolution === 'remote' &&
        (this.list('routine').some(r => r.entries.some(e => e.exerciseId === id))
          || this.list('workout').some(w => w.entries.some(e => e.exerciseId === id))
          || this.list('goal').some(g => g.exerciseId === id))) {
        throw Error('This exercise is still used by local records. Rename it or remove the references first.');
      }
      const record = db.getFirstSync<{ value: string | null }>('SELECT value FROM records WHERE owner=? AND kind=? AND id=?', this.owner, kind, id);
      const local = record?.value ?? null;
      const incoming = kind === 'workout' && remote ? JSON.parse(remote) as Root['workout'] : undefined;
      if (resolution !== 'local' && incoming?.state === 'active'
        && this.list('workout').some(w => w.id !== id && w.state === 'active')) {
        throw Error('Finish or discard the other active workout first.');
      }
      if (resolution === 'local' && !record) throw Error('This device has no version of this record.');
      if (resolution === 'copy' && (!local || kind !== 'workout')) throw Error('There is no workout to copy.');
      const copy = resolution === 'copy' ? JSON.parse(local!) as Root['workout'] : undefined;
      if (copy?.state === 'active') throw Error('Finish the local workout before keeping a copy.');
      db.runSync('DELETE FROM outbox WHERE owner=? AND kind=? AND id=?', this.owner, kind, id);
      db.runSync('DELETE FROM conflicts WHERE owner=? AND kind=? AND id=?', this.owner, kind, id);
      this.write(kind, id, remote, revision);
      if (resolution === 'local') this.writeChanges([{ kind, id, value: local ? JSON.parse(local) : null }]);
      if (copy) {
        copy.id = newId();
        copy.entries = copy.entries.map(e => ({ ...e, id: newId(), sets: e.sets.map(s => ({ ...s, id: newId() })) }));
        this.writeChanges([{ kind: 'workout', id: copy.id, value: copy }]);
      }
    });
  }
}
