import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import * as SQLite from 'expo-sqlite';
import * as Network from 'expo-network';
import { randomUUID } from 'expo-crypto';
import { AppState } from 'react-native';
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { Store, type Page, type Receipt } from './store';
import { synchronize, type Gateway } from './sync';
import type { Conflict, Model, Root, Workout } from './domain';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const key = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
export const demoEnabled = __DEV__ && !url && !key;
const storage = {
  getItem: SecureStore.getItemAsync,
  setItem: SecureStore.setItemAsync,
  removeItem: SecureStore.deleteItemAsync,
};
const client = url && key ? createClient(url, key, {
  auth: { storage, autoRefreshToken: true, persistSession: true, detectSessionInUrl: false },
}) : null;
export const hasCloud = !!client;
const ownerKey = 'fitness-owner-v1';
type Owner = { id: string; email: string; demo?: true };
type SyncStatus = 'Idle' | 'Syncing' | 'Offline' | 'Needs sign-in' | 'Sync error';
class GatewayError extends Error {
  constructor(message: string, readonly status: SyncStatus) { super(message); }
}
function gateway(owner: Owner): Gateway {
  async function rpc<T>(name: string, args: object) {
    const connection = await Network.getNetworkStateAsync();
    if (connection.isConnected === false || connection.isInternetReachable === false) {
      throw new GatewayError('Waiting for a network connection.', 'Offline');
    }
    const session = await client!.auth.getSession();
    if (session.error && /fetch|network|timeout/i.test(session.error.message)) {
      throw new GatewayError(session.error.message, 'Offline');
    }
    if (session.data.session?.user.id !== owner.id) throw new GatewayError('Sign in to the same account to upload.', 'Needs sign-in');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const { data, error, status } = await Promise.resolve(client!.rpc(name, args).abortSignal(controller.signal)).finally(() => clearTimeout(timeout));
    if (error) {
      const state = status === 401 || error.code === 'PGRST301' ? 'Needs sign-in' : status === 0 ? 'Offline' : 'Sync error';
      throw new GatewayError(error.message, state);
    }
    return data as T;
  }
  return {
    push: op => rpc<Receipt>('apply_mutation', { p_operation: op.operationId, p_base: op.baseRevision,
      p_root: op.root, p_timezone: op.timezone, p_schema: op.schemaVersion }),
    pull: (cursor, highWater) => rpc<Page>('pull_changes', { p_after: cursor, p_high: highWater ?? null }),
  };
}

type Context = {
  loading: boolean; bootError: string; owner: Owner | null; model: Model | null;
  status: SyncStatus; syncMessage: string;
  login(email: string, password: string, register: boolean): Promise<string | undefined>;
  demo(): Promise<void>; signOut(discard?: boolean): Promise<void>; retry(): void;
  save(root: Root, expected?: Root, archived?: Set<string>): void;
  conflictLocal(conflict: Conflict): Root | undefined;
  resolve(conflict: Conflict, choice: 'remote' | 'local' | 'copy', copy?: Workout, reviewed?: Root): void;
};
const AppContext = createContext<Context | null>(null);
export function useApp() { return useContext(AppContext)!; }

export function SessionProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [bootError, setBootError] = useState('');
  const [owner, setOwner] = useState<Owner | null>(null);
  const [model, setModel] = useState<Model | null>(null);
  const [status, setStatus] = useState<SyncStatus>('Idle');
  const [syncMessage, setSyncMessage] = useState('');
  const current = useRef<{ owner: Owner; store: Store; db: SQLite.SQLiteDatabase } | null>(null);
  const inFlight = useRef(false);
  const switching = useRef(false);
  const failures = useRef(0);
  const retryAfter = useRef(0);
  const refresh = () => setModel(current.current?.store.model() ?? null);

  async function open(account: Owner) {
    if (account.demo ? !demoEnabled : !hasCloud || !/^[a-f0-9-]{36}$/i.test(account.id)) return;
    const db = SQLite.openDatabaseSync('fitness-' + account.id + '.db');
    try {
      const store = new Store(db, randomUUID, !!account.demo);
      await storage.setItem(ownerKey, JSON.stringify(account));
      current.current = { owner: account, store, db };
      failures.current = 0;
      retryAfter.current = 0;
      setOwner(account);
      refresh();
    } catch (error) {
      db.closeSync();
      throw error;
    }
  }

  async function sync(manual = false) {
    const session = current.current;
    if (!session || session.owner.demo || inFlight.current || switching.current || AppState.currentState === 'background' ||
      (!manual && Date.now() < retryAfter.current)) return;
    inFlight.current = true;
    const active = () => current.current === session;
    setStatus('Syncing');
    try {
      await synchronize(session.store, gateway(session.owner), active, refresh);
      if (active()) { setStatus('Idle'); setSyncMessage(''); }
      failures.current = 0;
      retryAfter.current = 0;
    } catch (error) {
      if (active()) {
        setStatus(error instanceof GatewayError ? error.status : 'Sync error');
        setSyncMessage(error instanceof Error ? error.message : 'Sync failed. Try again.');
      }
      retryAfter.current = Date.now() + Math.min(60000, 2000 * 2 ** Math.min(++failures.current, 5));
    } finally {
      inFlight.current = false;
    }
  }

  useEffect(() => {
    void (async () => {
      try {
        const stored = await storage.getItem(ownerKey);
        if (stored) await open(JSON.parse(stored) as Owner);
        else if (client) {
          const { data } = await client.auth.getSession();
          if (data.session) await open({ id: data.session.user.id, email: data.session.user.email ?? '' });
        }
      } catch (error) {
        setBootError(error instanceof Error ? error.message : 'Local storage could not be opened.');
      } finally { setLoading(false); }
    })();
    const app = AppState.addEventListener('change', state => {
      if (state === 'active') { void client?.auth.startAutoRefresh(); void sync(true); }
      else void client?.auth.stopAutoRefresh();
    });
    if (AppState.currentState === 'active') void client?.auth.startAutoRefresh();
    const network = Network.addNetworkStateListener(state => { if (state.isConnected) void sync(true); });
    const timer = setInterval(() => void sync(), 8000);
    return () => { app.remove(); network.remove(); clearInterval(timer); void client?.auth.stopAutoRefresh(); };
  }, []);
  useEffect(() => { if (owner) void sync(true); }, [owner]);

  async function login(email: string, password: string, register: boolean) {
    if (!client) throw Error('Cloud service is not configured.');
    if (inFlight.current) throw Error('Wait for the current sync attempt to finish.');
    if (current.current && (register || current.current.owner.email.toLowerCase() !== email.toLowerCase())) {
      throw Error('Use the same email or sign out first.');
    }
    const credentials = { email: email.trim(), password };
    const { data, error } = register ? await client.auth.signUp(credentials) : await client.auth.signInWithPassword(credentials);
    if (error) throw error;
    if (!data.session) return 'Check your inbox to confirm your email, then return and sign in.';
    if (!current.current) await open({ id: data.session.user.id, email: data.session.user.email ?? email });
    else if (current.current.owner.id !== data.session.user.id) {
      await client.auth.signOut({ scope: 'local' });
      throw Error('Sign in with the account that owns this local data.');
    } else void sync(true);
  }

  async function signOut(discard = false) {
    if (inFlight.current) throw Error('Wait for the current sync attempt to finish.');
    const session = current.current;
    if (!session) return;
    switching.current = true;
    try {
      const snapshot = session.store.model();
      if ((snapshot.pending.size || snapshot.conflicts.length) && !discard) {
        throw Error('Sync pending changes or explicitly discard them before signing out.');
      }
      if (!session.owner.demo && client) {
        const { error } = await client.auth.signOut({ scope: 'local' });
        if (error) {
          const { data } = await client.auth.getSession();
          if (data.session) throw error;
        }
      }
      if (discard) session.store.discardPartition();
      await storage.removeItem(ownerKey);
      current.current = null;
      session.db.closeSync();
      setOwner(null);
      setModel(null);
      setStatus('Idle');
      setSyncMessage('');
    } finally { switching.current = false; }
  }

  function mutate(work: (store: Store) => void) {
    if (switching.current || !current.current) throw Error('Account is unavailable.');
    work(current.current.store);
    refresh();
    void sync();
  }

  return <AppContext.Provider value={{
    loading, bootError, owner, model, status, syncMessage, login, signOut,
    demo: async () => { if (demoEnabled) await open({ id: 'demo', email: 'Classroom demo', demo: true }); },
    retry: () => void sync(true),
    save: (root, expected, archived) => mutate(store => store.save(root, expected, archived)),
    conflictLocal: conflict => current.current?.store.get(conflict.kind, conflict.id)?.root,
    resolve: (conflict, choice, copy, reviewed) => mutate(store => store.resolve(conflict, choice, copy, reviewed)),
  }}>{children}</AppContext.Provider>;
}
