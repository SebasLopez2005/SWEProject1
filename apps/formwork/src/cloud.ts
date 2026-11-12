import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Repository, Remote } from './repository';
import { Root } from './model';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const key = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
export const demoEnabled = __DEV__ && process.env.EXPO_PUBLIC_ENABLE_DEMO === '1';

const secureStorage = {
  async getItem(key: string) {
    const count = Number(await SecureStore.getItemAsync(key + '.count'));
    if (!count) return null;
    const parts = await Promise.all(Array.from({ length: count }, (_, i) => SecureStore.getItemAsync(key + '.' + i)));
    return parts.every(part => part !== null) ? parts.join('') : null;
  },
  async setItem(key: string, value: string) {
    const parts = value.match(/[\s\S]{1,480}/gu) ?? [];
    const prior = Number(await SecureStore.getItemAsync(key + '.count'));
    await Promise.all(parts.map((part, i) => SecureStore.setItemAsync(key + '.' + i, part)));
    await SecureStore.setItemAsync(key + '.count', String(parts.length));
    for (let i = parts.length; i < prior; i++) await SecureStore.deleteItemAsync(key + '.' + i);
  },
  async removeItem(key: string) {
    const count = Number(await SecureStore.getItemAsync(key + '.count'));
    await SecureStore.deleteItemAsync(key + '.count');
    await Promise.all(Array.from({ length: count }, (_, i) => SecureStore.deleteItemAsync(key + '.' + i)));
  },
};

export const cloud = url && key ? createClient(url, key, { auth: {
  storage: secureStorage, persistSession: true, autoRefreshToken: true, detectSessionInUrl: false,
} }) : null;

type Receipt = { status: 'ok' | 'conflict'; revision: number; value?: Root[keyof Root] | null; reason?: string };
const errorText = (error: { code?: string; message: string }) => {
  if (error.code === 'PGRST301' || error.code === '42501') return 'Sign in again to upload.';
  return error.message;
};

export async function synchronize(repo: Repository, signal: AbortSignal) {
  if (!cloud || repo.demo || signal.aborted) return;
  const session = (await cloud.auth.getSession()).data.session;
  if (session?.user.id !== repo.owner) throw Error('Sign in again to upload.');
  const queue = repo.queue();
  const conflicts = repo.conflicts();
  const blocked = new Set(conflicts.map(c => c.kind + '/' + c.id));
  const dependencies = new Set(conflicts.filter(c => c.kind === 'exercise').map(c => c.id));

  for (const op of queue) {
    if (signal.aborted) return;
    const id = op.kind + '/' + op.id;
    if (blocked.has(id)) continue;
    const value = op.value ? JSON.parse(op.value) : null;
    const refs: string[] = op.kind === 'workout' || op.kind === 'routine'
      ? (value?.entries ?? []).map((entry: { exerciseId: string }) => entry.exerciseId)
      : op.kind === 'goal' ? [value?.exerciseId] : [];
    if (refs.some(ref => dependencies.has(ref))) continue;
    const fresh = repo.queue().find(row => row.seq === op.seq);
    if (!fresh) continue;
    const { data, error } = await cloud.rpc('apply_mutation', {
      p_operation: fresh.op, p_kind: fresh.kind, p_id: fresh.id, p_base: fresh.base,
      p_value: value, p_zone: fresh.zone, p_schema: 1,
    }).abortSignal(signal);
    if (signal.aborted) return;
    if (error) {
      if (error.code === '22023' || error.code === '23514') {
        const current = await cloud.from('training_records').select('revision,value').eq('owner', repo.owner)
          .eq('kind', fresh.kind).eq('id', fresh.id).abortSignal(signal).maybeSingle();
        if (signal.aborted) return;
        if (current.error) throw Error(errorText(current.error));
        repo.conflict(fresh, current.data?.value ?? null, current.data?.revision ?? 0, 'Server rejected this change. ' + error.message);
        blocked.add(id);
        if (op.kind === 'exercise') dependencies.add(op.id);
        continue;
      }
      throw Error(errorText(error));
    }
    const result = data as Receipt;
    if (result.status === 'ok') repo.acknowledge(fresh, result.revision);
    else {
      repo.conflict(fresh, result.value ?? null, result.revision, result.reason ?? 'A newer version exists online.');
      blocked.add(id);
      if (op.kind === 'exercise') dependencies.add(op.id);
    }
  }
  let ceiling: number | null = null;
  for (let page = 0; page < 20; page++) {
    const { data, error } = await cloud.rpc('pull_changes', { p_after: repo.meta('cursor', 0), p_ceiling: ceiling }).abortSignal(signal);
    if (signal.aborted) return;
    if (error) throw Error(errorText(error));
    const feed = data as { ceiling: number; rows: Remote[] };
    ceiling = feed.ceiling;
    repo.pull(feed.rows);
    if (feed.rows.length < 100) return;
  }
}
