import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const key = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
assert.ok(url && key, 'Set the local Supabase URL and public key.');
assert.ok(['localhost', '127.0.0.1'].includes(new URL(url).hostname), 'Use only a disposable local backend.');
const client = () => createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
const a = client(), b = client();
for (const account of [a, b]) {
  const { data, error } = await account.auth.signUp({ email: 'qa-' + randomUUID() + '@example.com', password: randomUUID() + '!aA8' });
  assert.equal(error, null);
  assert.ok(data.session, 'Local test stack should allow immediate sign-in.');
}
const id = randomUUID();
const entry = randomUUID();
const set = randomUUID();
const date = new Date().toISOString().slice(0, 10);
const payload = {
  p_operation: randomUUID(), p_kind: 'workout', p_id: id, p_base: 0, p_schema: 1, p_zone: 'UTC',
  p_value: { id, date, state: 'finished', started: 1000, finished: 3000, rest: 90, entries: [{
    id: entry, exerciseId: 'catalog:Barbell_Bench_Press_-_Medium_Grip', phase: 'work',
    sets: [{ id: set, target: { reps: 12 }, state: 'done', actual: { at: 2000, reps: 11, weight: 60, unit: 'kg' } }],
  }] },
};
const created = await a.rpc('apply_mutation', payload);
assert.equal(created.error, null);
assert.equal(created.data.status, 'ok');
assert.deepEqual((await a.rpc('apply_mutation', payload)).data, created.data);
const aFeed = await a.rpc('pull_changes', { p_after: 0 });
assert.equal(aFeed.error, null);
assert.equal(aFeed.data.rows.length, 1);
assert.equal(aFeed.data.rows[0].value.entries[0].sets[0].actual.reps, 11);
const bFeed = await b.rpc('pull_changes', { p_after: 0 });
assert.equal(bFeed.error, null);
assert.deepEqual(bFeed.data.rows, []);
const forbidden = await b.from('training_records').select('id').eq('id', id);
assert.equal(forbidden.error, null);
assert.deepEqual(forbidden.data, []);
const invalid = await a.rpc('apply_mutation', { ...payload, p_operation: randomUUID(), p_base: 1, p_value: { ...payload.p_value, entries: [] } });
assert.equal(invalid.error.code, '22023');
const stale = await a.rpc('apply_mutation', { ...payload, p_operation: randomUUID() });
assert.equal(stale.data.status, 'conflict');
const removed = await a.rpc('apply_mutation', { ...payload, p_operation: randomUUID(), p_base: 1, p_value: null });
assert.equal(removed.data.revision, 2);
const tombstone = await a.rpc('pull_changes', { p_after: aFeed.data.ceiling });
assert.equal(tombstone.data.rows[0].value, null);
console.log('Local Supabase signup, authenticated RPC, retry, RLS, conflict and tombstone checks passed.');
