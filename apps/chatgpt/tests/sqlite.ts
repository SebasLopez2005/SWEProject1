import { DatabaseSync, type SQLInputValue } from 'node:sqlite';
import type { Database } from '../src/store';

export function nodeSqlite(path: string) {
  const connection = new DatabaseSync(path);
  const db: Database = {
    execSync: sql => connection.exec(sql),
    runSync: (sql, ...args: SQLInputValue[]) => connection.prepare(sql).run(...args),
    getAllSync: <T>(sql: string, ...args: SQLInputValue[]) => connection.prepare(sql).all(...args) as T[],
    getFirstSync: <T>(sql: string, ...args: SQLInputValue[]) => (connection.prepare(sql).get(...args) ?? null) as T | null,
    withTransactionSync: work => {
      connection.exec('BEGIN');
      try { work(); connection.exec('COMMIT'); }
      catch (error) { connection.exec('ROLLBACK'); throw error; }
    },
  };
  return { db, close: () => connection.close() };
}
