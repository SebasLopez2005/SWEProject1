import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { dateKey, finishWorkout, newWorkout, type Workout } from '../src/domain';
import { library } from '../src/seed';
import { Store } from '../src/store';
import { nodeSqlite } from './sqlite';

test('a failed queue insert rolls back the record, and retry identity survives reopening', () => {
  const dir = mkdtempSync(join(tmpdir(), 'training-store-'));
  const file = join(dir, 'partition.sqlite');
  try {
    const first = nodeSqlite(file);
    const store = new Store(first.db, randomUUID);
    const active = newWorkout(randomUUID, dateKey(), [library[0].id]);
    store.save(active);
    const op = store.next()!;
    first.db.execSync("CREATE TRIGGER fail_insert BEFORE INSERT ON outbox BEGIN SELECT RAISE(ABORT, 'test storage error'); END");
    const withSet: Workout = { ...active, entries: [{ ...active.entries[0], sets: [{ id: randomUUID(), weight: 70, unit: 'kg', reps: 4 }] }] };
    assert.throws(() => store.save(withSet, active), /test storage error/);
    assert.deepEqual(store.get('workout', active.id)?.root, active);
    first.db.execSync('DROP TRIGGER fail_insert');
    store.save(withSet, active);
    first.close();

    const second = nodeSqlite(file);
    const restored = new Store(second.db, randomUUID);
    assert.deepEqual(restored.get('workout', active.id)?.root, withSet);
    assert.deepEqual(restored.next(), op);
    restored.acknowledge(op, { status: 'ok', revision: 1 });
    assert.deepEqual(restored.get('workout', active.id)?.root, withSet);
    assert.equal(restored.next()?.baseRevision, 1);
    assert.deepEqual(restored.next()?.root, withSet);
    second.close();
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('a competing active workout is preserved alongside local work and resolution copies it independently', () => {
  const { db, close } = nodeSqlite(':memory:');
  const store = new Store(db, randomUUID);
  const own = newWorkout(randomUUID, dateKey(), [library[2].id]);
  own.entries[0].sets = [{ id: randomUUID(), reps: 7 }];
  store.save(own);
  const theirs = newWorkout(randomUUID, dateKey());
  store.applyPage({ changes: [{ root: theirs, revision: 1, cursor: 9 }], cursor: 9, highWater: 9 });
  const conflict = store.model().conflicts[0];
  assert.equal(conflict.blocker?.root.id, theirs.id);
  assert.equal(store.cursor, 9);
  assert.equal(store.next(), undefined);
  assert.throws(() => store.resolve(conflict, 'copy'), /active workout/);
  assert.equal(store.model().conflicts.length, 1);
  store.resolve(conflict, 'copy', finishWorkout(own));
  const results = store.model().workouts;
  assert.equal(results.length, 2);
  assert.equal(results.find(w => w.state === 'active')?.id, theirs.id);
  const copy = results.find(w => w.state === 'finished')!;
  assert.notEqual(copy.id, own.id);
  assert.notEqual(copy.entries[0].sets[0].id, own.entries[0].sets[0].id);
  close();
});
