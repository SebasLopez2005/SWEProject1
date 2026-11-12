import { Actual, Exercise, Goal, Reading, Root, Unit, Workout, convert, dateKey, daysFrom, parseDay, working } from './model';

export type Point = { id: string; date: string; value: number; workouts: Workout[] };
export const periods = ['4 weeks', '12 weeks', '1 year', 'All time'] as const;
export type Period = typeof periods[number];

export const inRange = (date: string, from: string, to: string) => date >= from && date <= to;
export const ordered = (workouts: Workout[]) => workouts.filter(w => w.state === 'finished')
  .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
export const volume = (actual: Actual, unit: Unit) =>
  actual.unit && actual.weight != null ? convert(actual.weight, actual.unit, unit) * (actual.reps ?? 0) : 0;
export const totals = (workouts: Workout[], unit: Unit) => {
  const sets = workouts.flatMap(working);
  return {
    sessions: workouts.length,
    sets: sets.length,
    volume: sets.reduce((sum, set) => sum + volume(set.actual, unit), 0),
    reps: sets.reduce((sum, set) => sum + (set.actual.unit ? 0 : set.actual.reps ?? 0), 0),
    seconds: sets.reduce((sum, set) => sum + (set.actual.seconds ?? 0), 0),
  };
};
export const monday = (day: string) => daysFrom(-((parseDay(day).getDay() + 6) % 7), day);

export function periodStart(period: Period, workouts: Workout[], today = dateKey()) {
  if (period === '4 weeks') return daysFrom(-27, today);
  if (period === '12 weeks') return daysFrom(-83, today);
  if (period === '1 year') return daysFrom(-364, today);
  return ordered(workouts).at(-1)?.date ?? today;
}

export function exercisePoints(workouts: Workout[], exercise: Exercise, from: string, to: string, unit: Unit): Point[] {
  if (exercise.kind === 'time') return [];
  return ordered(workouts).reverse().flatMap(workout => {
    if (!inRange(workout.date, from, to)) return [];
    const sets = working(workout).filter(x => x.entry.exerciseId === exercise.id);
    if (!sets.length) return [];
    const value = sets.reduce((sum, x) => sum + (exercise.kind === 'load' ? volume(x.actual, unit) : x.actual.reps ?? 0), 0);
    return [{ id: workout.id, date: workout.date, value, workouts: [workout] }];
  });
}

export function weeklyPoints(workouts: Workout[], from: string, to: string, unit: Unit): Point[] {
  const buckets = new Map<string, Workout[]>();
  ordered(workouts).filter(w => inRange(w.date, from, to)).forEach(w => {
    const key = monday(w.date);
    buckets.set(key, [...(buckets.get(key) ?? []), w]);
  });
  const points: Point[] = [];
  for (let day = monday(from); day <= to; day = daysFrom(7, day)) {
    const sessions = buckets.get(day) ?? [];
    points.push({ id: day, date: day, value: totals(sessions, unit).volume, workouts: sessions });
  }
  return points;
}

const regions: Record<string, string> = {
  abdominals: 'Core', abductors: 'Hips', adductors: 'Hips', biceps: 'Biceps', calves: 'Calves',
  chest: 'Chest', forearms: 'Forearms', glutes: 'Glutes', hamstrings: 'Hamstrings',
  lats: 'Back', 'lower back': 'Back', 'middle back': 'Back', neck: 'Neck',
  quadriceps: 'Quads', shoulders: 'Shoulders', traps: 'Back', triceps: 'Triceps',
};
export const muscleRegions = [...new Set(Object.values(regions))].sort();
export type Credit = { workout: Workout; exercise: string; setId: string; amount: number };

export function muscleScores(workouts: Workout[], resolve: (id: string) => Exercise | undefined, from: string, to: string) {
  const scores = new Map<string, Credit[]>();
  let unmapped = 0;
  ordered(workouts).filter(w => inRange(w.date, from, to)).forEach(workout => working(workout).forEach(({ entry, set }) => {
    const exercise = resolve(entry.exerciseId);
    const primary = new Set((exercise?.primary ?? []).map(tag => regions[tag]).filter(Boolean));
    const secondary = new Set((exercise?.secondary ?? []).map(tag => regions[tag]).filter(tag => tag && !primary.has(tag)));
    if (!primary.size && !secondary.size) unmapped++;
    for (const region of [...primary, ...secondary]) {
      const credit = { workout, exercise: entry.exerciseId, setId: set.id, amount: primary.has(region) ? 1 : 0.5 };
      scores.set(region, [...(scores.get(region) ?? []), credit]);
    }
  }));
  return { scores, unmapped };
}

export function bestForGoal(goal: Goal, workouts: Workout[]) {
  return ordered(workouts).flatMap(workout => working(workout).flatMap(({ entry, set, actual }) =>
    entry.exerciseId === goal.exerciseId && actual.unit && actual.weight != null && (actual.reps ?? 0) >= goal.reps
      ? [{ workout, set, load: convert(actual.weight, actual.unit, goal.unit) }] : []))
    .sort((a, b) => b.load - a.load)[0];
}

export function reportWindows(month: string, today = dateKey()) {
  const current = parseDay(month + '-01');
  const last = new Date(current.getFullYear(), current.getMonth() + 1, 0, 12);
  const prior = new Date(current.getFullYear(), current.getMonth() - 1, 1, 12);
  const priorLast = new Date(current.getFullYear(), current.getMonth(), 0, 12);
  const partial = month === today.slice(0, 7);
  const days = Math.min(parseDay(today).getDate(), priorLast.getDate());
  if (partial) { last.setDate(days); priorLast.setDate(days); }
  return { from: dateKey(current), to: dateKey(last), priorFrom: dateKey(prior), priorTo: dateKey(priorLast), partial };
}

export function milestones(workouts: Workout[], unit: Unit) {
  const best = new Map<string, { workout: Workout; setId: string; weight: number; reps: number }>();
  ordered(workouts).forEach(workout => working(workout).forEach(({ entry, set, actual }) => {
    if (actual.weight == null || !actual.unit) return;
    const weight = convert(actual.weight, actual.unit, unit);
    const reps = actual.reps ?? 0;
    const previous = best.get(entry.exerciseId);
    if (!previous || weight > previous.weight || (weight === previous.weight && reps > previous.reps)) {
      best.set(entry.exerciseId, { workout, setId: set.id, weight, reps });
    }
  }));
  return [...best];
}

type Cell = string | number | null | undefined;
export function csv(rows: Cell[][]) {
  return rows.map(row => row.map(cell => {
    if (cell == null) return '';
    if (typeof cell === 'number') return String(cell);
    const safe = /^[\t\r\n]|^\s*[=+@-]/.test(cell) ? "'" + cell : cell;
    return '"' + safe.replaceAll('"', '""') + '"';
  }).join(',')).join('\r\n') + '\r\n';
}

export function exportSets(workouts: Workout[], resolve: (id: string) => Exercise | undefined, from: string, to: string) {
  const rows: Cell[][] = [['schema_version', 'workout_id', 'workout_date', 'routine', 'exercise_id', 'exercise_name', 'set_id', 'phase',
    'target_reps', 'target_seconds', 'target_weight', 'target_unit', 'target_rir_min', 'target_rir_max',
    'actual_reps', 'actual_seconds', 'actual_weight', 'actual_unit', 'normalized_kg', 'actual_rir', 'completed_at']];
  for (const workout of ordered(workouts).filter(w => inRange(w.date, from, to))) {
    for (const entry of workout.entries) {
      for (const set of entry.sets) {
        if (set.state !== 'done' || !set.actual) continue;
        const a = set.actual, t = set.target;
        rows.push([1, workout.id, workout.date, workout.routine, entry.exerciseId, resolve(entry.exerciseId)?.name, set.id, entry.phase,
          t?.reps, t?.seconds, t?.weight, t?.unit, t?.rirMin, t?.rirMax, a.reps, a.seconds, a.weight, a.unit,
          a.weight == null || !a.unit ? null : convert(a.weight, a.unit, 'kg'), a.rir, a.at ? new Date(a.at).toISOString() : null]);
      }
    }
  }
  return csv(rows);
}

export function exportReadings(readings: Reading[], from: string, to: string) {
  return csv([['schema_version', 'reading_id', 'reading_date', 'weight', 'unit', 'normalized_kg'],
    ...readings.filter(r => inRange(r.date, from, to)).map(r => [1, r.id, r.date, r.weight, r.unit, convert(r.weight, r.unit, 'kg')])]);
}

export function exportReports(workouts: Workout[], from: string, to: string) {
  const rows: Cell[][] = [['schema_version', 'month', 'from', 'to', 'partial', 'sessions', 'working_sets', 'volume_kg', 'reps_only', 'seconds']];
  const cursor = parseDay(from.slice(0, 7) + '-01');
  const finished = ordered(workouts);
  while (dateKey(cursor) <= to) {
    const first = dateKey(cursor);
    cursor.setMonth(cursor.getMonth() + 1);
    const last = daysFrom(-1, dateKey(cursor));
    const start = first < from ? from : first, end = last > to ? to : last;
    const values = totals(finished.filter(w => inRange(w.date, start, end)), 'kg');
    rows.push([1, first.slice(0, 7), start, end, start !== first || end !== last ? 'yes' : 'no',
      values.sessions, values.sets, values.volume, values.reps, values.seconds]);
  }
  return csv(rows);
}

export function earliestDate(workouts: Workout[], readings: Root['reading'][], today = dateKey()) {
  return [today, ...workouts.map(w => w.date), ...readings.map(r => r.date)].sort()[0];
}
