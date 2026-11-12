import catalogData from '../data/catalog.json';

export type Unit = 'kg' | 'lb';
export type Kind = 'load' | 'reps' | 'time';
export type Phase = 'work' | 'warmup' | 'prep' | 'cooldown';
export type SetState = 'pending' | 'done' | 'skipped';

export type Exercise = {
  id: string; name: string; kind: Kind; equipment: string; category: string;
  primary: string[]; secondary: string[]; instructions: string[];
  custom?: true; archived?: boolean; used?: boolean;
};
export type Actual = { reps?: number; seconds?: number; weight?: number; unit?: Unit; rir?: number; at: number };
export type Target = { reps?: number; seconds?: number; weight?: number; unit?: Unit; rirMin?: number; rirMax?: number };
export type SetRow = { id: string; state: SetState; target?: Target; actual?: Actual };
export type Plan = {
  exerciseId: string; phase: Phase; count: number; target?: Target;
  rest?: number; // undefined inherits, zero disables
};
export type Entry = { id: string; exerciseId: string; phase: Phase; rest?: number; sets: SetRow[] };
export type Routine = { id: string; name: string; entries: Plan[]; rest: number };
export type Workout = {
  id: string; date: string; state: 'active' | 'finished'; started: number; finished?: number;
  routine?: string; rest: number; entries: Entry[];
};
export type Settings = {
  id: 'settings'; unit: Unit; both: boolean; scale: number; chosen: boolean;
  reminders: boolean; weekdays: number[]; hour: number; minute: number; restAlerts: boolean;
};
export type Goal = { id: string; exerciseId: string; weight: number; unit: Unit; reps: number; deadline?: string };
export type Reading = { id: string; date: string; weight: number; unit: Unit };
export type WeightTarget = { id: 'weight-target'; date?: string; weight: number; unit: Unit };
export type Rest = { workoutId: string; setId: string; deadline?: number; remaining?: number };
export type Root = {
  workout: Workout; exercise: Exercise; routine: Routine; settings: Settings;
  goal: Goal; reading: Reading; weightTarget: WeightTarget;
};
export type RootKind = keyof Root;
export type Change = { [K in RootKind]: { kind: K; id: string; value: Root[K] | null } }[RootKind];

export const catalog = catalogData as Exercise[];
export const catalogById = new Map(catalog.map(exercise => [exercise.id, exercise]));
export const defaultSettings: Settings = {
  id: 'settings', unit: 'kg', both: true, scale: 1, chosen: false,
  reminders: false, weekdays: [1, 3, 5], hour: 18, minute: 0, restAlerts: false,
};
export const phaseName: Record<Phase, string> = { work: 'Working sets', warmup: 'Warm-up', prep: 'Pre-workout mobility', cooldown: 'Post-workout mobility' };
export const kindName: Record<Kind, string> = { load: 'Weight + reps', reps: 'Reps only', time: 'Timed' };
export const muscles = [...new Set(catalog.flatMap(x => [...x.primary, ...x.secondary]))].sort();
export const normalized = (name: string) => name.toLowerCase().replace(/\s/gu, '');
export const dateKey = (date = new Date()) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
export const parseDay = (value: string) => new Date(value + 'T12:00:00');
export const daysFrom = (delta: number, base = dateKey()) => {
  const date = parseDay(base);
  date.setDate(date.getDate() + delta);
  return dateKey(date);
};
export const prettyDay = (value: string) => parseDay(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
export const convert = (weight: number, from: Unit, to: Unit) => from === to ? weight : from === 'kg' ? weight * 2.20462 : weight / 2.20462;
export const displayNumber = (number: number) => new Intl.NumberFormat(undefined, { maximumFractionDigits: 1 }).format(number);
export const isUnit = (unit: unknown): unit is Unit => unit === 'kg' || unit === 'lb';
export const bounded = (n: unknown, min: number, max: number): n is number => typeof n === 'number' && Number.isFinite(n) && n >= min && n <= max;
export const whole = (n: unknown, min: number, max: number) => bounded(n, min, max) && Number.isInteger(n);
export const numeric = (s: string) => /^\d+(?:[.,]\d+)?$/.test(s.trim()) ? Number(s.trim().replace(',', '.')) : NaN;

export function validateDay(day: string, allowFuture = false) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || dateKey(parseDay(day)) !== day || (!allowFuture && day > dateKey())) {
    throw Error(allowFuture ? 'Choose a valid calendar date.' : 'Choose today or an earlier date.');
  }
}

export function validateName(value: string, taken: boolean, noun: string) {
  if (!value.trim() || value.trim().length > 60) throw Error(`Enter a ${noun} name of 1 to 60 characters.`);
  if (taken) throw Error(`A ${noun} already uses that name.`);
}

export function validateActual(kind: Kind, value: Actual) {
  if (kind === 'time') {
    if (!whole(value.seconds, 1, 86400)) throw Error('Enter whole seconds between 1 and 86,400.');
    if (value.reps != null || value.weight != null || value.unit != null || value.rir != null) throw Error('Timed sets accept seconds only.');
    return;
  }
  if (!whole(value.reps, 1, 999)) throw Error('Enter whole reps between 1 and 999.');
  if (value.seconds != null) throw Error('Rep-based sets do not accept seconds.');
  if (kind === 'load' && (!bounded(value.weight, 0, 999.9) || !isUnit(value.unit))) throw Error('Enter a weight between 0 and 999.9.');
  if (kind === 'reps' && (value.weight != null || value.unit != null)) throw Error('This exercise uses reps only.');
  if (value.rir != null && !whole(value.rir, 0, 20)) throw Error('Enter a whole RIR from 0 to 20 or leave it blank.');
}

export function validatePlan(plan: Plan, kind: Kind) {
  if (!whole(plan.count, 0, 30)) throw Error('Use 0 to 30 sets per exercise.');
  if (plan.rest != null && !whole(plan.rest, 0, 1800)) throw Error('Rest must be between 0 and 1,800 seconds.');
  const target = plan.target;
  if (plan.count === 0) {
    if (target) throw Error('Set a positive set count before adding targets.');
    return;
  }
  if (!target || !(kind === 'time' ? whole(target.seconds, 1, 86400) : whole(target.reps, 1, 999))) {
    throw Error(kind === 'time' ? 'Enter a valid seconds target.' : 'Enter a valid reps target.');
  }
  if (target.weight != null && (kind !== 'load' || !bounded(target.weight, 0, 999.9) || !isUnit(target.unit))) throw Error('Enter a valid target weight.');
  if (target.rirMin != null || target.rirMax != null) {
    if (kind === 'time' || !whole(target.rirMin, 0, 20) || !whole(target.rirMax, target.rirMin ?? 0, 20)) throw Error('Enter both RIR bounds from 0 to 20, low to high.');
  }
}

export const working = (workout: Workout) => workout.entries.flatMap(entry => entry.phase === 'work'
  ? entry.sets.flatMap(set => set.state === 'done' && set.actual ? [{ entry, set, actual: set.actual }] : []) : []);
export const confirmed = (workout: Workout) => workout.entries.flatMap(entry => entry.sets.filter(set => set.state === 'done'));
export const pending = (workout: Workout) => workout.entries.reduce((sum, entry) => sum + entry.sets.filter(set => set.state === 'pending').length, 0);

export function startWorkout(id: string, date: string, entries: Plan[], rest: number, makeId: () => string, routine?: string, now = Date.now()): Workout {
  validateDay(date);
  return { id, date, state: 'active', started: now, routine, rest, entries: entries.map(plan => ({
    id: makeId(), exerciseId: plan.exerciseId, phase: plan.phase, rest: plan.rest,
    sets: Array.from({ length: plan.count }, () => ({ id: makeId(), state: 'pending', target: plan.target && { ...plan.target } })),
  })) };
}

export function finishWorkout(workout: Workout, confirmedSkips: boolean, now = Date.now()): Workout {
  if (working(workout).length === 0) throw Error('Complete at least one working set before finishing.');
  if (pending(workout) && !confirmedSkips) throw Error('Confirm skipping the remaining planned sets.');
  return {
    ...workout, state: 'finished', finished: now,
    entries: workout.entries.filter(entry => entry.sets.length).map(entry => ({
      ...entry, sets: entry.sets.map(set => set.state === 'pending' ? { ...set, state: 'skipped' } : set),
    })),
  };
}

export function setActual(workout: Workout, entryId: string, rowId: string, actual: Actual, kind: Kind) {
  validateActual(kind, actual);
  return changeRow(workout, entryId, rowId, row => ({ ...row, actual, state: 'done' }));
}

export function changeRow(workout: Workout, entryId: string, rowId: string, change: (row: SetRow) => SetRow) {
  if (!workout.entries.some(entry => entry.id === entryId && entry.sets.some(row => row.id === rowId))) throw Error('This set has been removed.');
  return { ...workout, entries: workout.entries.map(entry => entry.id === entryId
    ? { ...entry, sets: entry.sets.map(row => row.id === rowId ? change(row) : row) } : entry) };
}

export function afterRemoval(workout: Workout) {
  if (workout.state === 'finished' && !working(workout).length) throw Error('Keep at least one working set, or delete the workout.');
  return workout;
}

export function lastWorkout(workouts: Workout[], exerciseId: string, before?: string, exclude?: string) {
  return workouts.find(w => w.state === 'finished' && w.id !== exclude && (!before || w.date <= before)
    && working(w).some(x => x.entry.exerciseId === exerciseId));
}

export function searchExercises(exercises: Exercise[], query: string, recent: string[], archived = false, equipment = '', category = '', muscle = '') {
  const q = query.trim().toLowerCase();
  const rank = new Map(recent.map((id, index) => [id, index]));
  return exercises.filter(x => !!x.archived === archived
    && (!equipment || x.equipment === equipment) && (!category || x.category === category)
    && (!muscle || [...x.primary, ...x.secondary].includes(muscle))
    && (!q || [x.name, x.equipment, x.category, ...x.primary, ...x.secondary].join(' ').toLowerCase().includes(q)))
    .sort((a, b) => (q ? 0 : (rank.get(a.id) ?? 1000) - (rank.get(b.id) ?? 1000)) || a.name.localeCompare(b.name));
}

export function actualLabel(actual: Actual, settings: Settings) {
  if (actual.seconds != null) return `${actual.seconds} sec`;
  let label = `${actual.reps} reps`;
  if (actual.weight != null && actual.unit) {
    const other = settings.unit === 'kg' ? 'lb' : 'kg';
    const primary = `${displayNumber(convert(actual.weight, actual.unit, settings.unit))} ${settings.unit}`;
    const equivalent = settings.both ? ` (${displayNumber(convert(actual.weight, actual.unit, other))} ${other})` : '';
    label = primary + equivalent + ' × ' + label;
  }
  return actual.rir == null ? label : label + ` · RIR ${actual.rir}`;
}

export function targetLabel(target?: Target) {
  if (!target) return 'Unplanned set';
  if (target.seconds != null) return `${target.seconds} sec`;
  return [
    target.weight != null ? `${target.weight} ${target.unit} × ${target.reps} reps` : `${target.reps} reps`,
    target.rirMin != null ? `RIR ${target.rirMin}–${target.rirMax}` : '',
  ].filter(Boolean).join(' · ');
}

export function restAfter(workout: Workout, entry: Entry, rowId: string, now = Date.now()): Rest | null {
  const seconds = entry.rest ?? workout.rest;
  if (workout.state !== 'active' || entry.phase !== 'work' || seconds <= 0) return null;
  const next = workout.entries.some(x => x.phase === 'work' && x.sets.some(row => row.state === 'pending'));
  const adHoc = !workout.routine;
  return next || adHoc ? { workoutId: workout.id, setId: rowId, deadline: now + seconds * 1000 } : null;
}

export const remaining = (rest: Rest, now = Date.now()) =>
  rest.deadline == null ? rest.remaining ?? 0 : Math.max(0, Math.ceil((rest.deadline - now) / 1000));
