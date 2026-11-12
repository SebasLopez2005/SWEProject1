import { createHash, randomUUID } from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';
import { seedCatalog } from '../src/data/catalog';
import { DB, migrate, type SqlDriver } from '../src/data/db';
import { Repository } from '../src/data/repository';

export function nodeDriver(path = ':memory:'): SqlDriver {
  const db = new DatabaseSync(path);
  return {
    async exec(sql) { db.exec(sql); },
    async run(sql, params) { db.prepare(sql).run(...(params as any[])); },
    async all<T>(sql: string, params: any[]) { return db.prepare(sql).all(...params) as T[]; },
    async close() { db.close(); },
  };
}

export async function makeRepo(opts: { now?: () => Date; failOn?: RegExp; ownerId?: string; path?: string } = {}) {
  const base = nodeDriver(opts.path);
  const driver: SqlDriver = opts.failOn
    ? { ...base, async run(sql, params) { if (opts.failOn!.test(sql) && (globalThis as any).__fail) throw new Error('disk I/O error'); return base.run(sql, params); } }
    : base;
  const db = new DB(driver);
  await migrate(db);
  await seedCatalog(db);
  const repo = new Repository(db, opts.ownerId ?? 'owner-a', {
    uuid: () => randomUUID(),
    sha256: async (s) => createHash('sha256').update(s).digest('hex'),
    now: opts.now,
  });
  return repo;
}

export const BENCH = 'Barbell Bench Press - Medium Grip';
export const PUSHUPS = 'Pushups';
export const PLANK = 'Plank';

export async function exId(repo: Repository, name: string) {
  const all = await repo.exercises();
  const e = [...all.values()].find((x) => x.name === name);
  if (!e) throw new Error(`missing ${name}`);
  return e.id;
}
