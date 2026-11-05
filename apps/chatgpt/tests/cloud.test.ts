import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { test } from 'node:test';
import { createClient } from '@supabase/supabase-js';
import { dateKey, defaults, finishWorkout, newWorkout, type Exercise, type Template, type Workout } from '../src/domain';
import { library } from '../src/seed';
import { Store, type Operation, type Page, type Receipt } from '../src/store';
import { synchronize, type Gateway } from '../src/sync';
import { nodeSqlite } from './sqlite';

const url = process.env.TEST_SUPABASE_URL;
const key = process.env.TEST_SUPABASE_KEY;

test('local Supabase Auth, RLS, idempotent RPC, validation rollback and two-device sync', { skip: !url || !key }, async () => {
  function client() { return createClient(url!, key!, { auth: { persistSession: false, autoRefreshToken: false } }); }
  async function account(label: string) {
    const supabase = client();
    const credentials = { email: label + '-' + randomUUID() + '@example.com', password: randomUUID() + 'aA1!' };
    const { data, error } = await supabase.auth.signUp(credentials);
    assert.equal(error, null);
    assert.ok(data.session, 'Local email confirmation should be disabled');
    return { supabase, credentials };
  }
  function gateway(supabase: ReturnType<typeof client>): Gateway {
    return {
      push: async (op: Operation) => {
        const { error, data } = await supabase.rpc('apply_mutation', { p_operation: op.operationId,
          p_base: op.baseRevision, p_root: op.root, p_timezone: 'UTC', p_schema: op.schemaVersion });
        assert.equal(error, null);
        return data as Receipt;
      },
      pull: async (cursor, highWater) => {
        const { error, data } = await supabase.rpc('pull_changes', { p_after: cursor, p_high: highWater ?? null });
        assert.equal(error, null);
        return data as Page;
      },
    };
  }
  const alice = await account('alice');
  const bob = await account('bob');
  const otherDevice = client();
  assert.equal((await otherDevice.auth.signInWithPassword(alice.credentials)).error, null);
  const a = gateway(alice.supabase);
  const b = gateway(bob.supabase);
  const phone = nodeSqlite(':memory:');
  const replica = nodeSqlite(':memory:');
  try {
    const store = new Store(phone.db, randomUUID);
    const peer = new Store(replica.db, randomUUID);
    const privateExercise: Exercise = { kind: 'exercise', id: randomUUID(), name: 'Paused Split Squat',
      muscle: 'Legs', type: 'weight_reps', archived: false };
    store.save(privateExercise);
    const first = store.next()!;
    assert.deepEqual(await a.push(first), { status: 'ok', revision: 1 });
    // Lost response: leave the real device outbox untouched. It must replay the same operation.
    assert.deepEqual(await a.push(first), { status: 'ok', revision: 1 });
    const replayWithChange = await alice.supabase.rpc('apply_mutation', {
      p_operation: first.operationId, p_base: first.baseRevision, p_timezone: 'UTC', p_schema: 1,
      p_root: { ...privateExercise, name: 'Different payload' },
    });
    assert.match(replayWithChange.error?.message ?? '', /reused/);
    const active = newWorkout(randomUUID, dateKey(), [privateExercise.id, library[2].id]);
    store.save(active);
    const complete: Workout = finishWorkout({ ...active, entries: [
      { ...active.entries[0], sets: [{ id: randomUUID(), weight: 44.5, unit: 'lb', reps: 7 }] },
      { ...active.entries[1], sets: [{ id: randomUUID(), reps: 12 }] },
    ] });
    store.save(complete, active);
    const sync = (s: Store, g: Gateway) => synchronize(s, g, () => true, () => {});
    await sync(store, a);
    assert.deepEqual(store.model().conflicts, []);
    assert.equal(store.model().pending.size, 0);
    assert.equal((await a.pull(0)).changes.filter(c => c.root.id === privateExercise.id).length, 1);
    const mine = await alice.supabase.from('training_sets').select('weight,unit,reps');
    assert.equal(mine.error, null);
    assert.equal(mine.data?.length, 2);
    assert.ok(mine.data?.some(row => row.unit === 'lb' && row.weight === 44.5));
    assert.equal((await bob.supabase.from('training_roots').select('*')).data?.length, 0);
    assert.equal((await bob.supabase.from('training_sets').select('*')).data?.length, 0);
    assert.equal((await b.pull(0)).changes.length, 0);
    assert.equal((await client().rpc('pull_changes', { p_after: 0 })).data, null);
    assert.notEqual((await bob.supabase.from('training_roots').insert({})).error, null);
    const cross = newWorkout(randomUUID, dateKey(), [privateExercise.id]);
    const foreign = await b.push({ seq: 1, operationId: randomUUID(), baseRevision: 0, root: cross, timezone: 'UTC', schemaVersion: 1 });
    assert.equal(foreign.status, 'conflict');
    assert.equal((await b.pull(0)).changes.length, 0);

    const locked = await a.push({ seq: 1, operationId: randomUUID(), baseRevision: 1,
      root: { ...privateExercise, type: 'seconds' }, timezone: 'UTC', schemaVersion: 1 });
    assert.equal(locked.status, 'conflict');
    const malformed = { ...complete, entries: [{ ...complete.entries[0], sets: [{ id: randomUUID(), reps: 0, weight: 12, unit: 'kg' }] }] };
    const bad = await a.push({ seq: 1, operationId: randomUUID(), baseRevision: 2, root: malformed as Workout, timezone: 'UTC', schemaVersion: 1 });
    assert.equal(bad.status, 'conflict');
    assert.equal((await alice.supabase.from('training_sets').select('*')).data?.length, 2);

    const peerGateway = gateway(otherDevice);
    await sync(peer, peerGateway);
    const peerPrior = peer.model().workouts[0];
    assert.equal(peerPrior.id, complete.id);
    const corrected = { ...complete, date: '2026-01-02' };
    store.save(corrected, complete);
    await sync(store, a);
    peer.save({ ...peerPrior, date: '2026-01-03' }, peerPrior);
    await sync(peer, peerGateway);
    const conflict = peer.model().conflicts[0];
    assert.equal((conflict.remote?.root as Workout).date, '2026-01-02');
    assert.equal(peer.model().workouts[0].date, '2026-01-03');

    peer.resolve(conflict, 'copy');
    await sync(peer, peerGateway);
    assert.equal(peer.model().pending.size, 0);
    assert.equal(peer.model().workouts.length, 2);
    await sync(store, a);
    const original = store.get('workout', complete.id)!.root as Workout;
    store.save({ ...original, deleted: true }, original);
    await sync(store, a);
    await sync(peer, peerGateway);
    assert.equal(peer.model().workouts.length, 1);
    assert.equal(peer.model().workouts[0].date, '2026-01-03');

    const template: Template = { kind: 'template', id: randomUUID(), name: 'Home Session',
      exercises: [privateExercise.id, library[2].id] };
    store.save(template);
    const exercise = store.get('exercise', privateExercise.id)!.root as Exercise;
    store.save({ ...exercise, archived: true }, exercise);
    store.save({ ...defaults, unit: 'lb', scale: 2 });
    await sync(store, a);
    await sync(peer, peerGateway);
    assert.deepEqual(peer.model().templates[0].exercises, template.exercises);
    assert.equal(peer.model().settings.scale, 2);
    const fromTemplate: Workout = { ...newWorkout(randomUUID, dateKey(), template.exercises), templateId: template.id };
    store.save(fromTemplate, undefined, new Set(template.exercises));
    await sync(store, a);
    assert.equal(store.model().pending.size, 0);
    const removed = { ...fromTemplate, entries: fromTemplate.entries.slice(1) };
    store.save(removed, fromTemplate);
    store.save(fromTemplate, removed, new Set(template.exercises));
    await sync(store, a);
    assert.deepEqual(store.model().conflicts, []);
    const peerActive = newWorkout(randomUUID, dateKey(), [library[2].id]);
    peerActive.entries[0].sets = [{ id: randomUUID(), reps: 9 }];
    peer.save(peerActive);
    await sync(peer, peerGateway);
    const activeConflict = peer.model().conflicts[0];
    assert.equal(activeConflict.blocker?.root.id, fromTemplate.id);
    peer.resolve(activeConflict, 'copy', finishWorkout(peerActive));
    await sync(peer, peerGateway);
    assert.equal(peer.model().pending.size, 0);
    assert.equal(peer.model().workouts.find(w => w.state === 'active')?.id, fromTemplate.id);
    const templateBefore = peer.get('template', template.id)!.root as Template;
    peer.save({ ...templateBefore, deleted: true }, templateBefore);
    await sync(peer, peerGateway);
    assert.equal(peer.model().templates.length, 0);
    assert.equal(peer.model().workouts.find(w => w.id === fromTemplate.id)?.entries.length, 2);
  } finally { phone.close(); replica.close(); }
});
