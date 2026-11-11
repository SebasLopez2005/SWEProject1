// Presenters/aggregations. Every function reads the same current owner records
// (finished, non-deleted workouts) so history, previous performance, graphs,
// reports and goals agree with each other.
import { addDays, diffDays, formatDateShort, monthEnd, monthKey, monthStart, mondayOf, parseDate, previousMonthKey, todayLocal } from './dates';
import type { Exercise, LiftGoal, SetRow, Unit, Workout, WorkoutEntry } from './types';
import { convert, round1 } from './units';

export type ExerciseMap = Map<string, Exercise>;

export const isWorkingDone = (e: WorkoutEntry, s: SetRow) => e.phase === 'work' && s.state === 'done';

export function setVolume(s: SetRow, displayUnit: Unit): number {
  if (s.weight == null || s.unit == null || s.reps == null) return 0;
  return convert(s.weight, s.unit, displayUnit) * s.reps;
}

export interface WorkoutSummary {
  exerciseCount: number;
  workingSets: number;
  plannedWorkingSets: number;
  skippedWorkingSets: number;
  prepDone: number;
  prepSkipped: number;
  volume: number; // display unit, unrounded
  totalReps: number; // reps-only exercises
  totalSeconds: number; // timed exercises
  exerciseNames: string[];
}

export function summarizeWorkout(w: Workout, ex: ExerciseMap, displayUnit: Unit): WorkoutSummary {
  const s: WorkoutSummary = {
    exerciseCount: 0, workingSets: 0, plannedWorkingSets: 0, skippedWorkingSets: 0, prepDone: 0, prepSkipped: 0,
    volume: 0, totalReps: 0, totalSeconds: 0, exerciseNames: [],
  };
  for (const e of w.entries) {
    const exercise = ex.get(e.exerciseId);
    const hasDone = e.sets.some((x) => x.state === 'done');
    if (e.phase === 'work') {
      if (e.sets.length > 0) s.exerciseCount += 1;
      if (e.sets.length > 0) s.exerciseNames.push(exercise?.name ?? 'Unknown exercise');
      for (const set of e.sets) {
        if (set.targetReps != null || set.targetSeconds != null) s.plannedWorkingSets += 1;
        if (set.state === 'skipped') s.skippedWorkingSets += 1;
        if (set.state !== 'done') continue;
        s.workingSets += 1;
        if (exercise?.type === 'weight_reps' || set.weight != null) s.volume += setVolume(set, displayUnit);
        else if (set.reps != null) s.totalReps += set.reps;
        if (set.seconds != null) s.totalSeconds += set.seconds;
      }
    } else {
      for (const set of e.sets) {
        if (set.state === 'done') s.prepDone += 1;
        if (set.state === 'skipped') s.prepSkipped += 1;
      }
      void hasDone;
    }
  }
  return s;
}

export interface PreviousPerformance {
  workoutId: string;
  date: string;
  sets: SetRow[];
}

/** FW-04: the latest finished workout (by calendar date) with done working sets of this exercise. */
export function previousPerformance(workouts: Workout[], exerciseId: string, excludeWorkoutId?: string): PreviousPerformance | null {
  let best: PreviousPerformance | null = null;
  let bestKey = '';
  for (const w of workouts) {
    if (w.state !== 'finished' || w.id === excludeWorkoutId) continue;
    const sets = w.entries.filter((e) => e.exerciseId === exerciseId && e.phase === 'work').flatMap((e) => e.sets.filter((s) => s.state === 'done'));
    if (!sets.length) continue;
    const key = `${w.workoutDate}|${w.finishedAt ?? w.startedAt}`;
    if (key > bestKey) {
      bestKey = key;
      best = { workoutId: w.id, date: w.workoutDate, sets };
    }
  }
  return best;
}

export interface Suggestion {
  weight: number | null;
  unit: Unit | null;
  reps: number | null;
  seconds: number | null;
}

/**
 * FW-02 prefill: copy the previous done set in this entry, else the latest
 * done working set of the exercise; a planned target fills reps/seconds/load
 * when it exists. Load is converted into the entry unit when they differ.
 */
export function suggestActual(entry: WorkoutEntry, row: SetRow, previous: PreviousPerformance | null, entryUnit: Unit): Suggestion {
  const doneInEntry = entry.sets.filter((s) => s.state === 'done' && s.position < row.position);
  const source = doneInEntry[doneInEntry.length - 1] ?? (previous ? previous.sets[previous.sets.length - 1] : null) ?? null;
  const out: Suggestion = { weight: null, unit: entryUnit, reps: null, seconds: null };
  if (row.targetLoad != null && row.targetUnit) out.weight = convert(row.targetLoad, row.targetUnit, entryUnit);
  else if (source?.weight != null && source.unit) out.weight = convert(source.weight, source.unit, entryUnit);
  if (row.targetReps != null) out.reps = row.targetReps;
  else if (source?.reps != null) out.reps = source.reps;
  if (row.targetSeconds != null) out.seconds = row.targetSeconds;
  else if (source?.seconds != null) out.seconds = source.seconds;
  if (out.weight != null) out.weight = Math.round(out.weight * 10) / 10;
  return out;
}

export type Period = '4w' | '12w' | '1y' | 'all';
export const PERIOD_LABEL: Record<Period, string> = { '4w': '4 weeks', '12w': '12 weeks', '1y': '1 year', all: 'All time' };

/** Finite windows include today. All time starts at the earliest finished workout. */
export function periodStart(period: Period, today: string, earliest: string | null): string | null {
  switch (period) {
    case '4w': return addDays(today, -27);
    case '12w': return addDays(today, -83);
    case '1y': return addDays(today, -364);
    case 'all': return earliest;
  }
}

export interface SeriesPoint {
  workoutId: string;
  date: string;
  value: number;
  label: string;
}

/** FW-20 / FW-23: one point per finished workout for one exercise. */
export function exerciseSeries(workouts: Workout[], exercise: Exercise, period: Period, displayUnit: Unit, today = todayLocal()): SeriesPoint[] {
  if (exercise.type === 'seconds') return [];
  const finished = workouts.filter((w) => w.state === 'finished');
  const earliest = finished.reduce<string | null>((m, w) => (m == null || w.workoutDate < m ? w.workoutDate : m), null);
  const start = periodStart(period, today, earliest);
  if (start == null) return [];
  const points: (SeriesPoint & { order: string })[] = [];
  for (const w of finished) {
    if (w.workoutDate < start || w.workoutDate > today) continue;
    const sets = w.entries.filter((e) => e.exerciseId === exercise.id && e.phase === 'work').flatMap((e) => e.sets.filter((s) => s.state === 'done'));
    if (!sets.length) continue;
    const value = exercise.type === 'weight_reps' ? sets.reduce((a, s) => a + setVolume(s, displayUnit), 0) : sets.reduce((a, s) => a + (s.reps ?? 0), 0);
    const label = exercise.type === 'weight_reps' ? `${round1(value)} ${displayUnit}` : `${value} reps`;
    points.push({ workoutId: w.id, date: w.workoutDate, value, label, order: `${w.workoutDate}|${w.startedAt}` });
  }
  points.sort((a, b) => a.order.localeCompare(b.order));
  return points.map(({ order: _o, ...p }) => p);
}

export interface WeekBucket {
  weekStart: string;
  value: number;
  workoutIds: string[];
  partial: boolean;
}

/** FW-22: one value per Monday-start calendar week in the window, zero-filled. */
export function weeklyVolume(workouts: Workout[], ex: ExerciseMap, period: Period, displayUnit: Unit, today = todayLocal()): WeekBucket[] {
  const finished = workouts.filter((w) => w.state === 'finished');
  const earliest = finished.reduce<string | null>((m, w) => (m == null || w.workoutDate < m ? w.workoutDate : m), null);
  const start = periodStart(period, today, earliest);
  if (start == null) return [];
  const buckets = new Map<string, WeekBucket>();
  for (let wk = mondayOf(start); wk <= today; wk = addDays(wk, 7)) {
    const partial = wk < start || addDays(wk, 6) > today;
    buckets.set(wk, { weekStart: wk, value: 0, workoutIds: [], partial });
  }
  for (const w of finished) {
    if (w.workoutDate < start || w.workoutDate > today) continue;
    const b = buckets.get(mondayOf(w.workoutDate));
    if (!b) continue;
    let contributed = false;
    for (const e of w.entries) {
      if (e.phase !== 'work' || ex.get(e.exerciseId)?.type !== 'weight_reps') continue;
      for (const s of e.sets) if (s.state === 'done') { b.value += setVolume(s, displayUnit); contributed = true; }
    }
    if (contributed || !b.workoutIds.includes(w.id)) b.workoutIds.push(w.id);
  }
  return [...buckets.values()];
}

export function weeklyComparisonSentence(buckets: WeekBucket[], displayUnit: Unit): string {
  if (buckets.length < 2) return 'Not enough weeks in this period to compare.';
  const last = buckets[buckets.length - 1];
  const prev = buckets[buckets.length - 2];
  const diff = last.value - prev.value;
  const lastLabel = `week of ${formatDateShort(last.weekStart)}${last.partial ? ' (in progress)' : ''}`;
  if (prev.value === 0) {
    if (last.value === 0) return `No weighted volume in the last two weeks.`;
    return `The ${lastLabel} has ${round1(last.value)} ${displayUnit}, up ${round1(diff)} ${displayUnit} from zero the week before.`;
  }
  const pct = Math.round((diff / prev.value) * 100);
  if (diff === 0) return `The ${lastLabel} matches the previous week at ${round1(last.value)} ${displayUnit}.`;
  return `The ${lastLabel} has ${round1(last.value)} ${displayUnit}, ${diff > 0 ? 'up' : 'down'} ${round1(Math.abs(diff))} ${displayUnit} (${Math.abs(pct)}%) from the previous week.`;
}

export function seriesSummarySentence(points: SeriesPoint[], unitLabel: string): string {
  if (points.length < 2) return 'At least two workouts with this exercise are needed in this period to show a trend.';
  const first = points[0];
  const last = points[points.length - 1];
  const max = points.reduce((m, p) => (p.value > m.value ? p : m), first);
  const dir = last.value > first.value ? 'higher than' : last.value < first.value ? 'lower than' : 'the same as';
  return `${points.length} workouts. The latest (${formatDateShort(last.date)}, ${round1(last.value)} ${unitLabel}) is ${dir} the first in this period (${round1(first.value)} ${unitLabel}). Highest: ${round1(max.value)} ${unitLabel} on ${formatDateShort(max.date)}.`;
}

// ---------- TR-07 muscle activity ----------

export interface MuscleContribution {
  workoutId: string;
  date: string;
  exerciseId: string;
  setId: string;
  role: 'primary' | 'secondary';
  credit: number;
}

export interface MuscleActivity {
  regions: Map<string, { score: number; contributions: MuscleContribution[] }>;
  unmappedSets: number;
  totalSets: number;
}

export function muscleActivity(workouts: Workout[], ex: ExerciseMap, from: string, to: string): MuscleActivity {
  const regions = new Map<string, { score: number; contributions: MuscleContribution[] }>();
  let unmapped = 0;
  let total = 0;
  for (const w of workouts) {
    if (w.state !== 'finished' || w.workoutDate < from || w.workoutDate > to) continue;
    for (const e of w.entries) {
      if (e.phase !== 'work') continue;
      const exercise = ex.get(e.exerciseId);
      const roles = new Map<string, 'primary' | 'secondary'>();
      for (const m of exercise?.secondaryMuscles ?? []) roles.set(m, 'secondary');
      for (const m of exercise?.primaryMuscles ?? []) roles.set(m, 'primary'); // primary precedence
      for (const s of e.sets) {
        if (s.state !== 'done') continue;
        total += 1;
        if (roles.size === 0) { unmapped += 1; continue; }
        for (const [region, role] of roles) {
          const credit = role === 'primary' ? 1 : 0.5;
          const r = regions.get(region) ?? { score: 0, contributions: [] };
          r.score += credit;
          r.contributions.push({ workoutId: w.id, date: w.workoutDate, exerciseId: e.exerciseId, setId: s.id, role, credit });
          regions.set(region, r);
        }
      }
    }
  }
  return { regions, unmappedSets: unmapped, totalSets: total };
}

export const MUSCLE_BANDS = [
  { min: 0, max: 0, label: '0' },
  { min: 0, max: 3, label: 'Under 3' },
  { min: 3, max: 6, label: '3 to under 6' },
  { min: 6, max: 10, label: '6 to under 10' },
  { min: 10, max: Infinity, label: '10 or more' },
];

export function muscleBand(score: number): number {
  if (score <= 0) return 0;
  if (score < 3) return 1;
  if (score < 6) return 2;
  if (score < 10) return 3;
  return 4;
}

// ---------- TR-08 monthly report ----------

export interface Milestone {
  exerciseId: string;
  workoutId: string;
  date: string;
  weight: number; // display unit
  reps: number;
}

export interface MonthStats {
  from: string;
  to: string;
  sessions: number;
  workingSets: number;
  volume: number;
  totalReps: number;
  totalSeconds: number;
}

export interface MonthlyReport {
  month: string;
  inProgress: boolean;
  current: MonthStats;
  previous: MonthStats;
  comparedDays: number | null;
  milestones: Milestone[];
}

function statsFor(workouts: Workout[], ex: ExerciseMap, from: string, to: string, displayUnit: Unit): MonthStats {
  const st: MonthStats = { from, to, sessions: 0, workingSets: 0, volume: 0, totalReps: 0, totalSeconds: 0 };
  for (const w of workouts) {
    if (w.state !== 'finished' || w.workoutDate < from || w.workoutDate > to) continue;
    st.sessions += 1;
    for (const e of w.entries) {
      if (e.phase !== 'work') continue;
      const type = ex.get(e.exerciseId)?.type;
      for (const s of e.sets) {
        if (s.state !== 'done') continue;
        st.workingSets += 1;
        if (type === 'weight_reps') st.volume += setVolume(s, displayUnit);
        else if (type === 'reps') st.totalReps += s.reps ?? 0;
        else st.totalSeconds += s.seconds ?? 0;
      }
    }
  }
  return st;
}

export function monthlyReport(workouts: Workout[], ex: ExerciseMap, month: string, displayUnit: Unit, today = todayLocal()): MonthlyReport {
  const start = monthStart(month);
  const end = monthEnd(month);
  const prevKey = previousMonthKey(month);
  const prevStart = monthStart(prevKey);
  const prevEnd = monthEnd(prevKey);
  const inProgress = monthKey(today) === month;
  let curTo = end;
  let prevTo = prevEnd;
  let comparedDays: number | null = null;
  if (inProgress) {
    const elapsed = diffDays(today, start) + 1;
    const prevLen = diffDays(prevEnd, prevStart) + 1;
    comparedDays = Math.min(elapsed, prevLen);
    curTo = addDays(start, comparedDays - 1);
    prevTo = addDays(prevStart, comparedDays - 1);
  }
  const current = statsFor(workouts, ex, start, curTo, displayUnit);
  const previous = statsFor(workouts, ex, prevStart, prevTo, displayUnit);
  if (inProgress) current.to = today; // label the actual elapsed window
  // Milestones: heaviest working set per weighted exercise that beats every earlier record.
  const ordered = workouts.filter((w) => w.state === 'finished').sort((a, b) => `${a.workoutDate}|${a.startedAt}`.localeCompare(`${b.workoutDate}|${b.startedAt}`));
  const best = new Map<string, number>();
  const milestones = new Map<string, Milestone>();
  for (const w of ordered) {
    if (w.workoutDate > end) break;
    for (const e of w.entries) {
      if (e.phase !== 'work' || ex.get(e.exerciseId)?.type !== 'weight_reps') continue;
      for (const s of e.sets) {
        if (s.state !== 'done' || s.weight == null || !s.unit || s.reps == null) continue;
        const kg = convert(s.weight, s.unit, 'kg');
        const prior = best.get(e.exerciseId);
        if (prior == null || kg > prior + 1e-9) {
          best.set(e.exerciseId, kg);
          if (w.workoutDate >= start && prior != null) {
            milestones.set(e.exerciseId, { exerciseId: e.exerciseId, workoutId: w.id, date: w.workoutDate, weight: convert(s.weight, s.unit, displayUnit), reps: s.reps });
          }
        }
      }
    }
  }
  return { month, inProgress, current, previous, comparedDays, milestones: [...milestones.values()] };
}

// ---------- TR-09 lift goals ----------

export interface GoalProgress {
  best: { workoutId: string; date: string; setId: string; weight: number; unit: Unit; reps: number; inGoalUnit: number } | null;
  achieved: boolean;
  fraction: number;
}

export function goalProgress(goal: LiftGoal, workouts: Workout[]): GoalProgress {
  let best: GoalProgress['best'] = null;
  for (const w of workouts) {
    if (w.state !== 'finished') continue;
    for (const e of w.entries) {
      if (e.exerciseId !== goal.exerciseId || e.phase !== 'work') continue;
      for (const s of e.sets) {
        if (s.state !== 'done' || s.weight == null || !s.unit || s.reps == null || s.reps < goal.minReps) continue;
        const inGoalUnit = convert(s.weight, s.unit, goal.unit);
        if (!best || inGoalUnit > best.inGoalUnit) best = { workoutId: w.id, date: w.workoutDate, setId: s.id, weight: s.weight, unit: s.unit, reps: s.reps, inGoalUnit };
      }
    }
  }
  // Compare at the 0.1 display resolution so e.g. 102.1 kg (225.09 lb) meets 225 lb.
  const achieved = best != null && Math.round(best.inGoalUnit * 10) >= Math.round(goal.targetLoad * 10);
  const fraction = best ? Math.min(1, best.inGoalUnit / goal.targetLoad) : 0;
  return { best, achieved, fraction };
}

export function bestDate(dates: string[]): string | null {
  return dates.reduce<string | null>((m, d) => (m == null || d < m ? d : m), null);
}

export function daysBetweenLabel(a: string, b: string): number {
  return Math.abs(parseDate(a).getTime() - parseDate(b).getTime()) / 86400000;
}
