// AppBootstrap + session context: open the signed-in owner's isolated SQLite
// partition, seed the catalog, start sync triggers and reconcile device effects.
import NetInfo from '@react-native-community/netinfo';
import * as Crypto from 'expo-crypto';
import * as SQLite from 'expo-sqlite';
import { useIsFocused } from 'expo-router';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { AppState } from 'react-native';
import { restoreIdentity, signOut as authSignOut, type Identity } from '../auth/auth';
import { supabase } from '../auth/config';
import { seedCatalog } from '../data/catalog';
import { DB, migrate, type SqlDriver } from '../data/db';
import { DATA_SCOPES, Repository, type ChangeScope } from '../data/repository';
import type { Settings } from '../domain/types';
import { configureNotifications } from '../device/notifications';
import { cancelAllReminders, reconcileReminders } from '../device/reminders';
import { RestService, type RestState } from '../device/rest';
import { SyncCoordinator, type SyncState } from '../sync/coordinator';
import { SupabaseSyncGateway } from '../sync/gateway';

export interface Session {
  identity: Identity;
  repo: Repository;
  sync: SyncCoordinator;
  rest: RestService;
}

interface Ctx {
  phase: 'loading' | 'signed_out' | 'ready' | 'error';
  error: string | null;
  session: Session | null;
  settings: Settings;
  version: number;
  versions: Record<ChangeScope, number>;
  syncState: SyncState;
  restState: RestState | null;
  open(identity: Identity): Promise<void>;
  signOut(): Promise<void>;
}

const DEFAULT_SETTINGS: Settings = { unit: 'kg', unitChosen: false, showEquivalent: true, textScale: 1, bodyFigure: 'male', revision: 0 };
const ZERO_VERSIONS: Record<ChangeScope, number> = { active: 0, finished: 0, exercises: 0, routines: 0, settings: 0, profile: 0, sync: 0 };
const DEFAULT_SYNC: SyncState = { status: 'saved_on_device', running: false, pending: 0, conflicts: 0, lastSyncAt: null, lastError: null };

const AppCtx = createContext<Ctx | null>(null);

async function openDriver(ownerId: string): Promise<SqlDriver> {
  const name = `repwise-${ownerId.replace(/[^a-zA-Z0-9-]/g, '')}.db`;
  const db = await SQLite.openDatabaseAsync(name);
  await db.execAsync('PRAGMA journal_mode = WAL');
  return {
    exec: (sql) => db.execAsync(sql),
    run: async (sql, params) => {
      await db.runAsync(sql, params);
    },
    all: (sql, params) => db.getAllAsync(sql, params),
    close: () => db.closeAsync(),
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<Ctx['phase']>('loading');
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [version, setVersion] = useState(0);
  const [versions, setVersions] = useState<Record<ChangeScope, number>>(ZERO_VERSIONS);
  const [syncState, setSyncState] = useState<SyncState>(DEFAULT_SYNC);
  const [restState, setRestState] = useState<RestState | null>(null);
  const cleanup = useRef<(() => void)[]>([]);

  const open = useCallback(async (identity: Identity) => {
    setPhase('loading');
    try {
      configureNotifications();
      const db = new DB(await openDriver(identity.ownerId));
      await migrate(db);
      await seedCatalog(db);
      const repo = new Repository(db, identity.ownerId, {
        uuid: () => Crypto.randomUUID(),
        sha256: (s) => Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, s),
      });
      const client = identity.kind === 'cloud' ? supabase() : null;
      const sync = new SyncCoordinator(repo, client ? new SupabaseSyncGateway(client) : null);
      if (identity.kind === 'cloud' && !identity.sessionValid) sync.setNeedsSignIn(true);
      const rest = new RestService(repo);
      setSettings(await repo.getSettings());

      let timer: ReturnType<typeof setTimeout> | null = null;
      let lastFinishedCount = -1;
      const unsubRepo = repo.subscribe((scopes) => {
        setVersion(repo.version);
        setVersions(repo.versions);
        if (scopes.includes('settings')) void repo.getSettings().then(setSettings);
        void sync.refreshStatus();
        const dataChange = scopes.some((s) => s !== 'sync');
        if (dataChange) {
          if (timer) clearTimeout(timer);
          timer = setTimeout(() => void sync.syncNow(), 1500);
        }
        // A newly recorded (or synced) finished workout cancels today's reminder.
        if (scopes.includes('finished'))
          void repo.finishedWorkouts().then((ws) => {
            if (lastFinishedCount !== -1 && ws.length !== lastFinishedCount) void reconcileReminders(repo);
            lastFinishedCount = ws.length;
          });
      });
      const unsubSync = sync.subscribe(setSyncState);
      const unsubRest = rest.subscribe(setRestState);
      const appSub = AppState.addEventListener('change', (s) => {
        if (s === 'active') {
          void sync.syncNow();
          void repo.getActiveWorkout().then((w) => rest.reconcile(w?.id ?? null));
          void reconcileReminders(repo);
        }
      });
      let wasConnected: boolean | null = null;
      const netSub = NetInfo.addEventListener((st) => {
        const connected = !!st.isConnected && st.isInternetReachable !== false;
        if (connected && wasConnected === false) void sync.syncNow();
        wasConnected = connected;
      });
      cleanup.current = [unsubRepo, unsubSync, unsubRest, () => appSub.remove(), netSub, () => sync.stop(), () => timer && clearTimeout(timer)];

      const active = await repo.getActiveWorkout();
      await rest.reconcile(active?.id ?? null);
      void reconcileReminders(repo);
      lastFinishedCount = (await repo.finishedWorkouts()).length;
      setSession({ identity, repo, sync, rest });
      setVersion(repo.version);
      setVersions(repo.versions);
      setPhase('ready');
      void sync.syncNow();
    } catch (e) {
      setError(`Could not open your data on this device: ${(e as Error).message}`);
      setPhase('error');
    }
  }, []);

  useEffect(() => {
    (async () => {
      const id = await restoreIdentity().catch(() => null);
      if (id) await open(id);
      else setPhase('signed_out');
    })();
    return () => cleanup.current.forEach((f) => f());
  }, [open]);

  const signOut = useCallback(async () => {
    if (!session) return;
    await session.rest.clear();
    await cancelAllReminders(session.repo);
    cleanup.current.forEach((f) => f());
    cleanup.current = [];
    await authSignOut(session.identity);
    await session.repo.db.close();
    setSession(null);
    setSettings(DEFAULT_SETTINGS);
    setSyncState(DEFAULT_SYNC);
    setRestState(null);
    setPhase('signed_out');
  }, [session]);

  const value = useMemo<Ctx>(
    () => ({ phase, error, session, settings, version, versions, syncState, restState, open, signOut }),
    [phase, error, session, settings, version, versions, syncState, restState, open, signOut],
  );
  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp(): Ctx {
  const c = useContext(AppCtx);
  if (!c) throw new Error('AppProvider missing');
  return c;
}

/** For screens rendered only after sign-in. */
export function useSession() {
  const c = useApp();
  if (!c.session) throw new Error('Not signed in');
  return { ...c, ...c.session, session: c.session };
}

/**
 * Load data for a screen and re-run it when the records it reads change
 * (UI-05). `watch` names the change scopes the loader depends on. Screens
 * that are not focused only mark themselves stale and reload when they
 * become visible again, so recording a set does not recompute other tabs.
 */
export function useLoad<T>(loader: () => Promise<T>, deps: unknown[] = [], watch: ChangeScope[] = DATA_SCOPES): { data: T | undefined; error: string | null; reload: () => void } {
  const { versions } = useApp();
  const focused = useIsFocused();
  const [data, setData] = useState<T | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);
  const key = watch.map((s) => versions[s]).join('.');
  const loadedKey = useRef<string | null>(null);
  const depsKey = JSON.stringify(deps);
  const want = `${key}|${depsKey}|${nonce}`;
  useEffect(() => {
    if (!focused && loadedKey.current !== null) return; // stale until visible
    if (loadedKey.current === want) return;
    let alive = true;
    loader()
      .then((d) => {
        if (!alive) return;
        loadedKey.current = want;
        setData(d);
        setError(null);
      })
      .catch((e) => alive && setError(String(e?.message ?? e)));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [want, focused]);
  return { data, error, reload: () => setNonce((n) => n + 1) };
}
