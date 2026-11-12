// TR-03 / TR-13: one device-local rest countdown with an absolute deadline,
// a scheduled rest-end alert (when permitted) and an iOS Live Activity.
import { Platform } from 'react-native';
import type { Repository } from '../data/repository';
import { formatClock } from '../domain/dates';
import type { Workout } from '../domain/types';
import { cancel, notificationPermission, scheduleAt } from './notifications';

export const DEFAULT_REST_SECONDS = 90;

export interface RestState {
  workoutId: string;
  sourceSetId: string;
  exercise: string;
  totalSeconds: number;
  state: 'running' | 'paused' | 'done';
  startedAtMs: number;
  endsAtMs: number | null; // while running
  remainingSeconds: number | null; // while paused
  alertId: string | null;
  activityId: string | null;
}

const KEY = 'rest';

type ActivityFactory = { start: (p: any, url?: string) => any; getInstances: () => any[] };
let factory: ActivityFactory | null | undefined;
function activityFactory(): ActivityFactory | null {
  if (factory !== undefined) return factory;
  factory = null;
  if (Platform.OS !== 'ios') return null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    factory = require('./RestActivity').default as ActivityFactory;
  } catch {
    factory = null;
  }
  return factory;
}

export function remainingOf(s: RestState, now = Date.now()): number {
  if (s.state === 'paused') return s.remainingSeconds ?? 0;
  if (s.state === 'done' || s.endsAtMs == null) return 0;
  return Math.max(0, Math.ceil((s.endsAtMs - now) / 1000));
}

/** Rest applies when the entry rule allows it and another working set remains (or the session is ad hoc). */
export function restSecondsFor(workout: Workout, entryId: string): number | null {
  const entry = workout.entries.find((e) => e.id === entryId);
  if (!entry || entry.phase !== 'work') return null;
  if (entry.restMode === 'off') return null;
  const seconds = entry.restMode === 'duration' ? entry.restSeconds : workout.defaultRestSeconds ?? DEFAULT_REST_SECONDS;
  if (!seconds) return null;
  const planned = workout.entries.some((e) => e.sets.some((s) => s.targetReps != null || s.targetSeconds != null));
  const remaining = workout.entries.some((e) => e.phase === 'work' && e.sets.some((s) => s.state === 'pending'));
  if (planned && !remaining) return null;
  return seconds;
}

export class RestService {
  private listeners = new Set<(s: RestState | null) => void>();
  current: RestState | null = null;

  constructor(private repo: Repository) {}

  subscribe(fn: (s: RestState | null) => void) {
    this.listeners.add(fn);
    fn(this.current);
    return () => this.listeners.delete(fn);
  }

  private async persist(s: RestState | null) {
    this.current = s;
    await this.repo.setDeviceState(KEY, s);
    for (const fn of this.listeners) fn(s);
  }

  /** On launch/foreground: derive state from the persisted deadline. */
  async reconcile(activeWorkoutId: string | null): Promise<void> {
    const s = await this.repo.getDeviceState<RestState>(KEY);
    if (!s) return this.persist(null);
    if (!activeWorkoutId || s.workoutId !== activeWorkoutId) return this.clear();
    if (s.state === 'running' && remainingOf(s) === 0) {
      await this.endActivity(s);
      return this.persist({ ...s, state: 'done', endsAtMs: null, remainingSeconds: 0, alertId: null, activityId: null });
    }
    this.current = s;
    for (const fn of this.listeners) fn(s);
  }

  async start(workoutId: string, sourceSetId: string, exercise: string, seconds: number): Promise<void> {
    await this.clearEffects(this.current);
    const now = Date.now();
    const s: RestState = {
      workoutId, sourceSetId, exercise, totalSeconds: seconds, state: 'running', startedAtMs: now, endsAtMs: now + seconds * 1000,
      remainingSeconds: null, alertId: null, activityId: null,
    };
    await this.persist(s);
    await this.applyEffects(s);
  }

  private async applyEffects(s: RestState) {
    if (s.state !== 'running' || s.endsAtMs == null) return;
    const perm = await notificationPermission(true);
    const alertId = perm === 'granted' ? await scheduleAt(new Date(s.endsAtMs), 'Rest complete', `Time for your next set: ${s.exercise}`, { kind: 'rest', url: '/workout' }) : null;
    let activityId: string | null = null;
    const f = activityFactory();
    if (f) {
      try {
        const props = { exercise: s.exercise, startedAtMs: s.startedAtMs, endsAtMs: s.endsAtMs, paused: false, remainingLabel: formatClock(remainingOf(s)) };
        const existing = f.getInstances?.() ?? [];
        if (existing.length) {
          await existing[0].update(props);
          activityId = existing[0].getId();
          for (const extra of existing.slice(1)) await extra.end('immediate');
        } else {
          activityId = f.start(props, 'repwise://workout')?.getId?.() ?? null;
        }
      } catch {
        activityId = null; // Live Activities unavailable or disabled: the in-app countdown remains
      }
    }
    if (this.current) await this.persist({ ...this.current, alertId, activityId });
  }

  private async endActivity(s: RestState | null) {
    const f = activityFactory();
    if (!f) return;
    try {
      for (const a of f.getInstances?.() ?? []) await a.end('immediate');
    } catch {
      /* ignore */
    }
    void s;
  }

  private async clearEffects(s: RestState | null) {
    if (!s) return;
    await cancel(s.alertId);
    await this.endActivity(s);
  }

  async pause(): Promise<void> {
    const s = this.current;
    if (!s || s.state !== 'running') return;
    await cancel(s.alertId);
    const remaining = remainingOf(s);
    const next: RestState = { ...s, state: 'paused', endsAtMs: null, remainingSeconds: remaining, alertId: null };
    await this.persist(next);
    const f = activityFactory();
    try {
      const inst = f?.getInstances?.()[0];
      await inst?.update({ exercise: s.exercise, startedAtMs: s.startedAtMs, endsAtMs: s.startedAtMs, paused: true, remainingLabel: formatClock(remaining) });
    } catch {
      /* ignore */
    }
  }

  async resume(): Promise<void> {
    const s = this.current;
    if (!s || s.state !== 'paused') return;
    const now = Date.now();
    const next: RestState = { ...s, state: 'running', startedAtMs: now, endsAtMs: now + (s.remainingSeconds ?? 0) * 1000, remainingSeconds: null };
    await this.persist(next);
    await this.applyEffects(next);
  }

  async extend(seconds: number): Promise<void> {
    const s = this.current;
    if (!s) return;
    if (s.state === 'paused') return this.persist({ ...s, remainingSeconds: (s.remainingSeconds ?? 0) + seconds, totalSeconds: s.totalSeconds + seconds });
    await cancel(s.alertId);
    const base = s.state === 'done' ? Date.now() : s.endsAtMs ?? Date.now();
    const next: RestState = { ...s, state: 'running', endsAtMs: base + seconds * 1000, totalSeconds: s.totalSeconds + seconds, alertId: null };
    await this.persist(next);
    await this.applyEffects(next);
  }

  async markDoneIfElapsed(): Promise<void> {
    const s = this.current;
    if (s?.state === 'running' && remainingOf(s) === 0) {
      await this.endActivity(s);
      await this.persist({ ...s, state: 'done', endsAtMs: null, remainingSeconds: 0, alertId: null, activityId: null });
    }
  }

  /** Skip, finish, discard, or undo of the triggering set: cancel alert and end the activity. */
  async clear(): Promise<void> {
    await this.clearEffects(this.current ?? (await this.repo.getDeviceState<RestState>(KEY)));
    await this.persist(null);
  }

  async clearIfSource(setId: string): Promise<void> {
    if (this.current?.sourceSetId === setId) await this.clear();
  }
}
