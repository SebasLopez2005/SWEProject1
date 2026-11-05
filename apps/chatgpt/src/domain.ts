export type Unit = 'kg' | 'lb';
export type ExerciseType = 'weight_reps' | 'reps_only' | 'seconds';
type WeightedSet = { weight: number; unit: Unit; reps: number };
export const isWeighted = (set: SetValue): set is WeightedSet => 'weight' in set;
export type SetValue =
  | WeightedSet
  | { reps: number }
  | { seconds: number };
export type TrainingSet = SetValue & { id: string };
export type Entry = { id: string; exerciseId: string; sets: TrainingSet[] };
export type Workout = {
  kind: 'workout'; id: string; date: string; state: 'active' | 'finished';
  startedAt: string; templateId?: string; copyOf?: string; finishedAt?: string; duration?: number; entries: Entry[]; deleted?: true;
};
export type Exercise = {
  kind: 'exercise'; id: string; name: string; muscle: string; type: ExerciseType;
  archived: boolean; shared?: true;
};
export type Template = { kind: 'template'; id: string; name: string; exercises: string[]; workoutId?: string; copyOf?: string; deleted?: true };
export type Settings = {
  kind: 'settings'; id: 'preferences'; unit: Unit; equivalents: boolean; scale: number;
};
export type Root = Workout | Exercise | Template | Settings;
export type Kind = Root['kind'];
export type Snapshot = { root: Root; revision: number };
export type Conflict = { kind: Kind; id: string; reason: string; remote: Snapshot | null; blocker?: Snapshot };
export type Model = {
  workouts: Workout[]; exercises: Exercise[]; templates: Template[]; settings: Settings;
  used: Set<string>; pending: Set<string>; conflicts: Conflict[]; hasSettings: boolean;
};
export type Period = '4 weeks' | '12 weeks' | '1 year' | 'All time';
export const periods: Period[] = ['4 weeks', '12 weeks', '1 year', 'All time'];
export const muscles = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Full body'];
export const typeLabels: Record<ExerciseType, string> = {
  weight_reps: 'Weight & reps', reps_only: 'Reps only', seconds: 'Timed',
};
export const defaults: Settings = { kind: 'settings', id: 'preferences', unit: 'kg', equivalents: true, scale: 1 };
export const rootKey = (kind: Kind, id: string) => kind + ':' + id;
export const isDeleted = (root: Root) => 'deleted' in root && !!root.deleted;

export function dateKey(date = new Date()) {
  return [date.getFullYear(), date.getMonth() + 1, date.getDate()].map(n => String(n).padStart(2, '0')).join('-');
}
export function localDate(value: string) {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day, 12);
}
export function shiftDate(value: string, days: number) {
  const date = localDate(value);
  date.setDate(date.getDate() + days);
  return dateKey(date);
}
export function formatDate(value: string, short = false) {
  return localDate(value).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', ...(short ? {} : { year: 'numeric' }),
  });
}
export function validDate(value: string, today = dateKey()) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && value >= '1900-01-01' &&
    dateKey(localDate(value)) === value && value <= today;
}
export const normalizeExercise = (name: string) => name.toLowerCase().replace(/\s/g, '');
const normalizeTemplate = (name: string) => name.trim().toLowerCase();
function validName(name: string) {
  return name === name.trim() && [...name].length > 0 && [...name].length <= 60;
}

export function parseSet(type: ExerciseType, weight: string, count: string, unit: Unit): SetValue {
  const amount = /^\d+$/.test(count.trim()) ? Number(count) : NaN;
  if (type === 'seconds') {
    if (!Number.isSafeInteger(amount) || amount < 1) throw Error('Enter a positive whole number of seconds.');
    return { seconds: amount };
  }
  if (!Number.isInteger(amount) || amount < 1 || amount > 999) throw Error('Enter whole reps from 1 to 999.');
  if (type === 'reps_only') return { reps: amount };
  const decimal = weight.trim().replace(',', '.');
  const entered = /^(?:\d+(?:\.\d*)?|\.\d+)$/.test(decimal) ? Number(decimal) : NaN;
  if (!Number.isFinite(entered) || entered < 0 || entered > 999.9) {
    throw Error('Enter a weight from 0 to 999.9 ' + unit + '.');
  }
  return { weight: entered, unit, reps: amount };
}

export function validateSet(value: SetValue, type: ExerciseType) {
  if (type === 'seconds' && 'seconds' in value && !('reps' in value) && !('weight' in value) && !('unit' in value)) {
    parseSet(type, '', String(value.seconds), 'kg');
  } else if (type === 'reps_only' && 'reps' in value && !('weight' in value) && !('unit' in value) && !('seconds' in value)) {
    parseSet(type, '', String(value.reps), 'kg');
  } else if (type === 'weight_reps' && 'weight' in value && 'reps' in value &&
    !('seconds' in value) && (value.unit === 'kg' || value.unit === 'lb')) {
    if (typeof value.weight !== 'number' || typeof value.reps !== 'number' ||
      !Number.isFinite(value.weight) || value.weight < 0 || value.weight > 999.9 ||
      !Number.isInteger(value.reps) || value.reps < 1 || value.reps > 999) {
      throw Error('Enter a valid weight and whole reps.');
    }
  } else {
    throw Error('Set fields must match the exercise type.');
  }
}

export function validateRoot(root: Root, data: Model, allowArchived = new Set<string>()) {
  if (isDeleted(root)) return;
  const exercises = new Map(data.exercises.map(e => [e.id, e]));
  if (root.kind === 'exercise') {
    if (!validName(root.name)) throw Error('Enter an exercise name from 1 to 60 characters.');
    if (!muscles.includes(root.muscle) || !(root.type in typeLabels)) throw Error('Choose a muscle group and exercise type.');
    if (exercises.get(root.id)?.shared || root.shared) throw Error('Library exercises are read-only.');
    if (data.exercises.some(e => e.id !== root.id && normalizeExercise(e.name) === normalizeExercise(root.name))) {
      throw Error('An exercise with that name already exists.');
    }
    if (data.used.has(root.id) && exercises.get(root.id)?.type !== root.type) {
      throw Error('The type is locked because this exercise has recorded sets.');
    }
  } else if (root.kind === 'settings') {
    if (!['kg', 'lb'].includes(root.unit) || typeof root.equivalents !== 'boolean' ||
      ![1, 1.25, 1.5, 1.75, 2].includes(root.scale)) throw Error('Choose valid display settings.');
  } else if (root.kind === 'template') {
    if (!validName(root.name)) throw Error('Enter a template name from 1 to 60 characters.');
    if (data.templates.some(t => t.id !== root.id && normalizeTemplate(t.name) === normalizeTemplate(root.name))) {
      throw Error('A template with that name already exists.');
    }
    if (!root.exercises.length) throw Error('Add at least one exercise to the template.');
    const prior = data.templates.find(t => t.id === root.id)?.exercises ?? [];
    for (const id of root.exercises) {
      const exercise = exercises.get(id);
      if (!exercise || (exercise.archived && !prior.includes(id) && !allowArchived.has(id))) {
        throw Error('Select an available exercise.');
      }
    }
  } else {
    if (!validDate(root.date)) throw Error('Choose a valid date no later than today.');
    if (root.state === 'active' && data.workouts.some(w => w.state === 'active' && w.id !== root.id)) {
      throw Error('Resume or discard your active workout first.');
    }
    if (root.state === 'finished' && (!root.entries.length || root.entries.some(e => !e.sets.length))) {
      throw Error('A finished workout needs at least one set. Delete the workout to remove all sets.');
    }
    const prior = data.workouts.find(w => w.id === root.id);
    const ids = new Set<string>();
    for (const entry of root.entries) {
      const exercise = exercises.get(entry.exerciseId);
      if (!exercise || (exercise.archived && !prior?.entries.some(e => e.id === entry.id && e.exerciseId === exercise.id)
        && !allowArchived.has(entry.exerciseId))) throw Error('Select an available exercise.');
      if (ids.has(entry.id)) throw Error('Exercise entries must have unique identities.');
      ids.add(entry.id);
      for (const set of entry.sets) {
        if (ids.has(set.id)) throw Error('Sets must have unique identities.');
        ids.add(set.id);
        validateSet(set, exercise.type);
      }
    }
  }
}
export function newWorkout(id: () => string, date: string, exercises: string[] = []): Workout {
  return { kind: 'workout', id: id(), date, state: 'active', startedAt: new Date().toISOString(),
    entries: exercises.map(exerciseId => ({ id: id(), exerciseId, sets: [] })) };
}
export function finishWorkout(workout: Workout, now = new Date()): Workout {
  const entries = workout.entries.filter(e => e.sets.length);
  if (!entries.length) throw Error('Record at least one set before finishing.');
  return { ...workout, entries, state: 'finished', finishedAt: now.toISOString(),
    duration: workout.date === dateKey(now)
      ? Math.max(0, Math.floor((+now - Date.parse(workout.startedAt)) / 1000)) : undefined };
}
export const setCount = (w: Workout) => w.entries.reduce((count, e) => count + e.sets.length, 0);
export const compareWorkouts = (a: Workout, b: Workout) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id);
export const finished = (workouts: Workout[]) => workouts.filter(w => w.state === 'finished').sort(compareWorkouts);
export const exerciseSets = (w: Workout, id: string) => w.entries.filter(e => e.exerciseId === id).flatMap(e => e.sets);
export function previous(workouts: Workout[], exerciseId: string, exclude?: string) {
  return finished(workouts).filter(w => w.id !== exclude).sort((a, b) =>
    b.date.localeCompare(a.date) || (b.finishedAt ?? '').localeCompare(a.finishedAt ?? '')
  ).find(w => exerciseSets(w, exerciseId).length > 0);
}
export function filterHistory(workouts: Workout[], start: string, end: string, exerciseId?: string) {
  return finished(workouts).filter(w => (!start || w.date >= start) && (!end || w.date <= end) &&
    (!exerciseId || w.entries.some(e => e.exerciseId === exerciseId)));
}
export function searchExercises(data: Model, text: string, muscle = '', archived = false) {
  const query = text.trim().toLowerCase();
  const recent = [...new Set([...data.workouts].sort((a, b) =>
    (b.finishedAt ?? b.startedAt).localeCompare(a.finishedAt ?? a.startedAt)
  ).flatMap(w => [...w.entries].reverse().map(e => e.exerciseId)))].slice(0, 10);
  const rank = (id: string) => recent.includes(id) ? recent.indexOf(id) : 10;
  return data.exercises.filter(e => e.archived === archived &&
    (!muscle || e.muscle === muscle) && e.name.toLowerCase().includes(query))
    .sort((a, b) => (query || archived ? 0 : rank(a.id) - rank(b.id)) || a.name.localeCompare(b.name));
}

export const convert = (weight: number, from: Unit, to: Unit) => from === to ? weight :
  from === 'kg' ? weight * 2.20462 : weight / 2.20462;
export const otherUnit = (unit: Unit) => unit === 'kg' ? 'lb' : 'kg';
export const display = (n: number) => n.toLocaleString('en-US', { maximumFractionDigits: 1 });
export function weightLabel(weight: number, unit: Unit, settings: Settings) {
  const primary = settings.unit;
  const other = otherUnit(primary);
  const equivalent = settings.equivalents ? ' (' + display(convert(weight, unit, other)) + ' ' + other + ')' : '';
  return display(convert(weight, unit, primary)) + ' ' + primary + equivalent;
}
export function setLabel(set: SetValue, settings: Settings) {
  if ('seconds' in set) return set.seconds + ' seconds';
  if ('weight' in set) return weightLabel(set.weight, set.unit, settings) + ' × ' + set.reps + ' reps';
  return set.reps + ' reps';
}
export const volume = (sets: TrainingSet[], unit: Unit) => sets.reduce((sum, set) =>
  sum + ('weight' in set ? convert(set.weight, set.unit, unit) * set.reps : 0), 0);
export const allSets = (w: Workout) => w.entries.flatMap(e => e.sets);

export type Point = { id: string; date: string; value: number; workoutIds: string[]; partial?: boolean };
export function monday(day: string) {
  return shiftDate(day, -((localDate(day).getDay() + 6) % 7));
}
export function graph(workouts: Workout[], period: Period, unit: Unit, exercise?: Exercise, today = dateKey()): Point[] {
  const completed = finished(workouts).reverse().filter(w => w.date <= today);
  if (!completed.length || exercise?.type === 'seconds') return [];
  const days = { '4 weeks': 28, '12 weeks': 84, '1 year': 365, 'All time': 0 }[period];
  const start = days ? shiftDate(today, 1 - days) : completed[0].date;
  const visible = completed.filter(w => w.date >= start);
  if (exercise) {
    return visible.flatMap(w => {
      const sets = exerciseSets(w, exercise.id);
      if (!sets.length) return [];
      const value = exercise.type === 'reps_only'
        ? sets.reduce((sum, set) => sum + ('reps' in set ? set.reps : 0), 0)
        : volume(sets, unit);
      return [{ id: w.id, date: w.date, value, workoutIds: [w.id] }];
    });
  }
  const byWeek = new Map<string, Point>();
  for (let week = monday(start); week <= today; week = shiftDate(week, 7)) {
    byWeek.set(week, { id: week, date: week, value: 0, workoutIds: [],
      partial: (days > 0 && week < start) || shiftDate(week, 6) > today });
  }
  for (const w of visible) {
    const sets = allSets(w);
    if (!sets.some(s => 'weight' in s)) continue;
    const point = byWeek.get(monday(w.date))!;
    point.value += volume(sets, unit);
    point.workoutIds.push(w.id);
  }
  return [...byWeek.values()];
}
