import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AppState } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import type { Session } from '@supabase/supabase-js';
import { cloud, demoEnabled, synchronize } from './cloud';
import { Repository, Conflict } from './repository';
import { Change, Rest, catalog, catalogById, defaultSettings, remaining } from './model';
import { ordered } from './analytics';
import { reconcileReminders, reconcileRest } from './device';

const DEMO = 'demo-attempt-3';
type Status = 'working' | 'up to date' | 'offline' | 'attention';
type Account = { owner: string; email: string; demo: boolean };

function useSessionState() {
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');
  const [generation, setGeneration] = useState(0);
  const [syncState, setSyncState] = useState<{ state: Status; detail: string }>({ state: 'working', detail: '' });
  const [foreground, setForeground] = useState(0);
  const [online, setOnline] = useState(true);
  const [syncTick, setSyncTick] = useState(0);
  const busy = useRef(false);

  const accept = useCallback((session: Session | null) => {
    setAccount(current => {
      if (current?.demo) return current;
      if (!session) return null;
      if (current?.owner === session.user.id && current.email === session.user.email) return current;
      return { owner: session.user.id, email: session.user.email ?? 'Account', demo: false };
    });
  }, []);

  useEffect(() => {
    let active = true;
    if (!cloud) { setLoading(false); return; }
    cloud.auth.getSession().then(({ data, error }) => {
      if (!active) return;
      if (error) setAuthError(error.message);
      accept(data.session);
      setLoading(false);
    }).catch((error: Error) => {
      if (active) { setAuthError(error.message); setLoading(false); }
    });
    const sub = cloud.auth.onAuthStateChange((event, session) => {
      if (event === 'TOKEN_REFRESHED' && !session) return;
      accept(session);
    });
    return () => { active = false; sub.data.subscription.unsubscribe(); };
  }, [accept]);

  useEffect(() => {
    const handle = (state: string) => {
      if (state === 'active') { cloud?.auth.startAutoRefresh(); setForeground(x => x + 1); }
      else cloud?.auth.stopAutoRefresh();
    };
    handle(AppState.currentState);
    const subscription = AppState.addEventListener('change', handle);
    return () => { subscription.remove(); cloud?.auth.stopAutoRefresh(); };
  }, []);
  useEffect(() => NetInfo.addEventListener(state => setOnline(state.isConnected !== false && state.isInternetReachable !== false)), []);

  const repo = useMemo(() => {
    if (!account) return null;
    const next = new Repository(account.owner, account.demo);
    next.seedDemo();
    return next;
  }, [account]);
  const data = useMemo(() => {
    const workouts = repo?.list('workout') ?? [];
    const ownExercises = repo?.list('exercise') ?? [];
    const customById = new Map(ownExercises.map(x => [x.id, x]));
    return {
      workouts, finished: ordered(workouts), active: workouts.find(w => w.state === 'active'),
      exercises: [...catalog, ...ownExercises],
      exercise: (id: string) => customById.get(id) ?? catalogById.get(id),
      routines: (repo?.list('routine') ?? []).sort((a, b) => a.name.localeCompare(b.name)),
      settings: repo?.list('settings')[0] ?? defaultSettings,
      goals: repo?.list('goal') ?? [], readings: (repo?.list('reading') ?? []).sort((a, b) => b.date.localeCompare(a.date)),
      target: repo?.list('weightTarget')[0], queued: repo?.queue() ?? [], conflicts: repo?.conflicts() ?? [],
      rest: repo?.meta<Rest | null>('rest', null) ?? null,
    };
  }, [repo, generation]); // Generation follows each durable commit or sync page.

  const refresh = useCallback(() => setGeneration(x => x + 1), []);
  const sync = useCallback(() => setSyncTick(x => x + 1), []);
  const controller = useRef<AbortController | null>(null);
  useEffect(() => {
    if (!repo || repo.demo) return;
    const abort = new AbortController();
    controller.current = abort;
    async function run() {
      if (!repo || busy.current || AppState.currentState !== 'active' || abort.signal.aborted) return;
      if (!online) { setSyncState({ state: 'offline', detail: 'Changes are saved on this device.' }); return; }
      busy.current = true;
      try {
        await synchronize(repo, abort.signal);
        if (!abort.signal.aborted) setSyncState({ state: 'up to date', detail: '' });
      } catch (error) {
        if (!abort.signal.aborted) setSyncState({ state: 'attention', detail: error instanceof Error ? error.message : 'Upload failed.' });
      } finally {
        busy.current = false;
        if (!abort.signal.aborted) refresh();
      }
    }
    const timer = setTimeout(run, 500);
    const interval = setInterval(run, 15000);
    return () => { clearTimeout(timer); clearInterval(interval); abort.abort(); };
  }, [repo, online, foreground, syncTick, refresh]);

  const save = useCallback((changes: Change[], rest?: Rest | null) => {
    if (!repo) throw Error('Open an account first.');
    repo.save(changes, rest);
    refresh();
    sync();
  }, [repo, refresh, sync]);

  const rest = data.rest && data.active?.id === data.rest.workoutId
    && data.active.entries.some(e => e.sets.some(s => s.id === data.rest?.setId && s.state === 'done')) ? data.rest : null;

  useEffect(() => {
    if (!repo) return;
    const effect = () => reconcileRest(rest, data.settings.restAlerts).catch(() => {});
    void effect();
    if (!rest?.deadline) return;
    const timer = setTimeout(effect, remaining(rest) * 1000 + 25);
    return () => clearTimeout(timer);
  }, [repo, rest?.deadline, rest?.remaining, rest?.setId, data.settings.restAlerts, foreground]);

  const completedDays = [...new Set(data.finished.map(w => w.date))].join(',');
  const reminderKey = JSON.stringify([data.settings.reminders, data.settings.weekdays, data.settings.hour, data.settings.minute, completedDays]);
  useEffect(() => {
    if (repo) reconcileReminders(data.settings, data.workouts).catch(() => {});
  }, [repo, foreground, reminderKey]);

  async function sign(email: string, password: string, register: boolean) {
    if (!cloud) throw Error('Configure the Supabase URL and publishable key to use an account.');
    if (!email.trim() || !password) throw Error('Enter your email and password.');
    const credentials = { email: email.trim(), password };
    const response = register ? await cloud.auth.signUp(credentials) : await cloud.auth.signInWithPassword(credentials);
    if (response.error) throw Error(response.error.message);
    if (!response.data.session) return 'Check your email to confirm your account, then sign in.';
    accept(response.data.session);
    return '';
  }
  async function signOut() {
    if (repo && (repo.queue().length || repo.conflicts().length)) throw Error('Upload or resolve pending changes before signing out.');
    controller.current?.abort();
    if (!repo?.demo && cloud) {
      const { error } = await cloud.auth.signOut({ scope: 'local' });
      if (error) { sync(); throw Error(error.message); }
    }
    await Promise.allSettled([reconcileRest(null, false), reconcileReminders(null, [])]);
    setAccount(null);
  }
  const enterDemo = () => {
    if (!demoEnabled) throw Error('The development demo is disabled.');
    setAccount({ owner: DEMO, email: 'Offline demo', demo: true });
  };
  const resolve = (conflict: Conflict, action: 'remote' | 'local' | 'copy') => {
    if (!repo) return;
    repo.resolve(conflict, action);
    refresh();
    sync();
  };
  const statusFor = (id: string) => account?.demo ? 'Saved on this device'
    : data.conflicts.some(c => c.id === id) ? 'Needs attention'
      : data.queued.some(o => o.id === id) ? 'Waiting to upload' : 'Uploaded';

  return { ...data, account, loading, authError, syncState, online, rest, save, sign, signOut, enterDemo, sync, resolve, statusFor };
}

const Context = createContext<ReturnType<typeof useSessionState> | null>(null);
export function AppProvider({ children }: { children: React.ReactNode }) {
  const state = useSessionState();
  return <Context.Provider value={state}>{children}</Context.Provider>;
}
export function useApp() {
  const state = useContext(Context);
  if (!state) throw Error('App provider is missing.');
  return state;
}
