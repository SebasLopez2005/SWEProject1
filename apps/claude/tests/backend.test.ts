// Integration tests against a real Supabase stack (local CLI). Skipped unless
// SUPABASE_TEST_URL and SUPABASE_TEST_PUBLISHABLE_KEY are set (see README).
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { randomUUID } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { addDays, todayLocal } from '../src/domain/dates';
import type { OutboxOp } from '../src/data/repository';
import { SyncCoordinator } from '../src/sync/coordinator';
import { NetworkError, SupabaseSyncGateway, type SyncGateway } from '../src/sync/gateway';
import { seedDemoData } from '../src/data/demo';
import { BENCH, exId, makeRepo } from './helpers';

const URL = process.env.SUPABASE_TEST_URL;
const KEY = process.env.SUPABASE_TEST_PUBLISHABLE_KEY;
const run = URL && KEY ? describe : describe.skip;

async function user(): Promise<{ client: SupabaseClient; id: string }> {
  const client = createClient(URL!, KEY!, { auth: { persistSession: false, autoRefreshToken: false } });
  const email = `t-${randomUUID().slice(0, 8)}@example.test`;
  const { data, error } = await client.auth.signUp({ email, password: 'correct-horse-battery' });
  if (error || !data.user || !data.session) throw new Error(`signUp failed: ${error?.message ?? 'no session (confirmations on?)'}`);
  return { client, id: data.user.id };
}

/** Wraps a gateway to simulate offline or a lost response after the server applied the mutation. */
class FlakyGateway implements SyncGateway {
  offline = false;
  loseNextResponse = false;
  calls: string[] = [];
  constructor(private inner: SyncGateway) {}
  async applyMutation(op: OutboxOp) {
    this.calls.push(op.operationId);
    if (this.offline) throw new NetworkError('Network request failed');
    const r = await this.inner.applyMutation(op);
    if (this.loseNextResponse) {
      this.loseNextResponse = false;
      throw new NetworkError('response lost');
    }
    return r;
  }
  async pullChanges(since: number, limit?: number) {
    if (this.offline) throw new NetworkError('Network request failed');
    return this.inner.pullChanges(since, limit);
  }
}

async function device(u: { client: SupabaseClient; id: string }) {
  const repo = await makeRepo({ ownerId: u.id });
  const gw = new FlakyGateway(new SupabaseSyncGateway(u.client));
  const sync = new SyncCoordinator(repo, gw);
  return { repo, gw, sync };
}

async function logWorkout(repo: Awaited<ReturnType<typeof makeRepo>>, weight = '60', date = todayLocal()) {
  const w = await repo.startWorkout({ date });
  await repo.addEntry(w.id, await exId(repo, BENCH));
  const s = (await repo.getWorkout(w.id))!.entries[0].sets[0].id;
  await repo.completeSet(s, { weight, unit: 'kg', reps: '5' });
  await repo.finishWorkout(w.id, false);
  return { id: w.id, setId: s };
}

run('Supabase sync backend', () => {
  it('logs offline, uploads later, and another device pulls it (FW-09)', async () => {
    const u = await user();
    const d1 = await device(u);
    d1.gw.offline = true;
    const { id } = await logWorkout(d1.repo);
    await d1.sync.syncNow();
    expect(d1.sync.state.status).toBe('waiting');
    expect(d1.sync.state.lastError).toMatch(/saved on this device/);
    d1.gw.offline = false;
    await d1.sync.syncNow();
    expect(d1.sync.state.status).toBe('uploaded');
    const d2 = await device(u);
    await d2.sync.syncNow();
    const pulled = await d2.repo.getWorkout(id);
    expect(pulled?.entries[0].sets[0]).toMatchObject({ weight: 60, unit: 'kg', reps: 5, state: 'done' });
  });

  it('a retried operation after a lost response creates exactly one workout (idempotent receipt)', async () => {
    const u = await user();
    const d1 = await device(u);
    const { id } = await logWorkout(d1.repo);
    d1.gw.loseNextResponse = true;
    await d1.sync.syncNow(); // server applied, client never saw the receipt
    expect(d1.sync.state.status).toBe('waiting');
    await d1.sync.syncNow(); // same operation id is resent
    expect(d1.sync.state.status).toBe('uploaded');
    expect(new Set(d1.gw.calls).size).toBeLessThan(d1.gw.calls.length); // same op id sent twice
    const { data } = await u.client.from('workouts').select('id').eq('id', id);
    expect(data).toHaveLength(1);
    const sets = await u.client.from('workout_sets').select('id');
    expect(sets.data).toHaveLength(1);
  });

  it('rejects operation-id reuse with a different payload', async () => {
    const u = await user();
    const d1 = await device(u);
    await logWorkout(d1.repo);
    const op = (await d1.repo.nextReadyOp())!;
    const first = await new SupabaseSyncGateway(u.client).applyMutation(op);
    expect(first.status).toBe('applied');
    const tampered = { ...op, payload: op.payload.replace('"weight":60', '"weight":61'), payloadHash: 'different' };
    const second = await new SupabaseSyncGateway(u.client).applyMutation(tampered);
    expect(second).toMatchObject({ status: 'rejected' });
  });

  it('preserves both versions on a concurrent edit and resolves by keeping a local copy', async () => {
    const u = await user();
    const d1 = await device(u);
    const d2 = await device(u);
    const { id, setId } = await logWorkout(d1.repo, '60');
    await d1.sync.syncNow();
    await d2.sync.syncNow();
    await d1.repo.completeSet(setId, { weight: '65', unit: 'kg', reps: '5' });
    await d2.repo.completeSet(setId, { weight: '70', unit: 'kg', reps: '5' });
    await d1.sync.syncNow();
    await d2.sync.syncNow();
    expect(d2.sync.state.status).toBe('needs_attention');
    const [c] = await d2.repo.listConflicts();
    expect(c.localSnapshot.entries[0].sets[0].weight).toBe(70);
    expect(c.remoteSnapshot.entries[0].sets[0].weight).toBe(65);
    // nothing was silently overwritten on the server
    const srv = await u.client.from('workout_sets').select('weight').eq('id', setId).single();
    expect(Number(srv.data!.weight)).toBe(65);
    await d2.repo.resolveConflict(id, 'copy_local');
    await d2.sync.syncNow();
    expect(d2.sync.state.status).toBe('uploaded');
    const all = await u.client.from('workouts').select('id').is('deleted_at', null);
    expect(all.data).toHaveLength(2);
    expect((await d2.repo.getWorkout(id))!.entries[0].sets[0].weight).toBe(65);
  });

  it('isolates owners: no cross reads, no cross writes, no direct table writes', async () => {
    const a = await user();
    const b = await user();
    const da = await device(a);
    const { id } = await logWorkout(da.repo);
    await da.sync.syncNow();
    const read = await b.client.from('workouts').select('id').eq('id', id);
    expect(read.data).toEqual([]);
    const db = await device(b);
    const op = (await (async () => { await logWorkout(db.repo); return db.repo.nextReadyOp(); })())!;
    const hijack = await new SupabaseSyncGateway(b.client).applyMutation({ ...op, aggregateId: id, operationId: randomUUID() });
    expect(hijack).toMatchObject({ status: 'rejected', reason: 'forbidden' });
    const direct = await b.client.from('workouts').insert({ id: randomUUID(), owner_id: b.id, workout_date: todayLocal(), state: 'finished', started_at: new Date().toISOString() });
    expect(direct.error).toBeTruthy();
    const feed = await b.client.from('change_events').select('*');
    expect(feed.data ?? []).toEqual([]);
  });

  it('propagates deletions as tombstones and uploads a custom exercise before the workout that uses it', async () => {
    const u = await user();
    const d1 = await device(u);
    const d2 = await device(u);
    const ex = await d1.repo.createExercise({ name: `Sled Push ${randomUUID().slice(0, 4)}`, type: 'seconds' });
    const w = await d1.repo.startWorkout({ date: todayLocal() });
    await d1.repo.addEntry(w.id, ex.id);
    await d1.repo.completeSet((await d1.repo.getWorkout(w.id))!.entries[0].sets[0].id, { seconds: '30' });
    await d1.repo.finishWorkout(w.id, false);
    await d1.sync.syncNow();
    expect(d1.sync.state.status).toBe('uploaded');
    await d2.sync.syncNow();
    expect((await d2.repo.getExercise(ex.id))?.name).toBe(ex.name);
    expect(await d2.repo.getWorkout(w.id)).not.toBeNull();
    await d1.repo.deleteWorkout(w.id);
    await d1.sync.syncNow();
    await d2.sync.syncNow();
    expect(await d2.repo.getWorkout(w.id)).toBeNull();
    const srv = await u.client.from('custom_exercises').select('ever_used').eq('id', ex.id).single();
    expect(srv.data?.ever_used).toBe(true);
  });

  it('server re-validates: future dates and empty finished workouts are rejected', async () => {
    const u = await user();
    const d1 = await device(u);
    await logWorkout(d1.repo);
    const op = (await d1.repo.nextReadyOp())!;
    const payload = JSON.parse(op.payload);
    const gw = new SupabaseSyncGateway(u.client);
    const future = await gw.applyMutation({ ...op, operationId: randomUUID(), aggregateId: randomUUID(), payload: JSON.stringify({ ...payload, workoutDate: addDays(todayLocal(), 3) }) });
    expect(future).toMatchObject({ status: 'rejected' });
    const empty = await gw.applyMutation({ ...op, operationId: randomUUID(), aggregateId: randomUUID(), payload: JSON.stringify({ ...payload, entries: [] }) });
    expect(empty).toMatchObject({ status: 'rejected' });
  });

  it('two devices cannot both have an active workout; the second is flagged, not merged', async () => {
    const u = await user();
    const d1 = await device(u);
    const d2 = await device(u);
    await d1.repo.startWorkout({ date: todayLocal() });
    const w2 = await d2.repo.startWorkout({ date: todayLocal() });
    await d1.sync.syncNow();
    await d2.sync.syncNow();
    const [c] = await d2.repo.listConflicts();
    expect(c.reason).toBe('active_workout');
    expect(c.aggregateId).toBe(w2.id);
  });

  it('the full demo dataset passes server validation and uploads', async () => {
    const u = await user();
    const d1 = await device(u);
    await seedDemoData(d1.repo, () => randomUUID());
    await d1.sync.syncNow();
    expect(await d1.repo.listConflicts()).toEqual([]);
    expect(d1.sync.state.status).toBe('uploaded');
    const { count } = await u.client.from('workouts').select('id', { count: 'exact', head: true });
    expect(count).toBe((await d1.repo.finishedWorkouts()).length);
  });
});
