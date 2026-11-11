import { isFuture, isValidDateString, todayLocal } from './dates';
import type { ExerciseType, RestMode, Unit } from './types';

export const LIMITS = {
  nameMax: 60,
  weightMax: 999.9,
  repsMax: 999,
  secondsMax: 86399,
  rirMax: 10,
  setsMax: 20,
  restMin: 5,
  restMax: 1800,
  bodyweightMax: 999.9,
};

/** Revised A-EX-2: names compare ignoring case and all whitespace. */
export function normalizeName(name: string): string {
  return name.replace(/\s+/g, '').toLocaleLowerCase('en-US');
}

export function validateName(name: string, label = 'Name'): string | null {
  const t = name.trim();
  if (t.length === 0) return `${label} is required.`;
  if (t.length > LIMITS.nameMax) return `${label} must be ${LIMITS.nameMax} characters or fewer.`;
  return null;
}

export interface ActualInput {
  weight?: string;
  unit?: Unit;
  reps?: string;
  seconds?: string;
  rir?: string;
}

export interface Actual {
  weight: number | null;
  unit: Unit | null;
  reps: number | null;
  seconds: number | null;
  rir: number | null;
}

export type FieldErrors = Partial<Record<'weight' | 'reps' | 'seconds' | 'rir', string>>;

function parseDecimal(s: string | undefined): number | null {
  if (s == null) return null;
  const t = s.trim().replace(',', '.');
  if (t === '') return null;
  if (!/^\d+(\.\d+)?$|^\.\d+$/.test(t)) return NaN;
  return Number(t);
}

function parseWhole(s: string | undefined): number | null {
  if (s == null) return null;
  const t = s.trim();
  if (t === '') return null;
  if (!/^\d+$/.test(t)) return NaN;
  return Number(t);
}

/** Decimal places check: weights accept at most one decimal (0.1 resolution). */
function hasAtMostOneDecimal(s: string): boolean {
  const t = s.trim().replace(',', '.');
  const i = t.indexOf('.');
  return i < 0 || t.length - i - 1 <= 1;
}

/**
 * FW-02 / FW-03 / FW-31 / TR-02: validate typed actuals. Only fields that
 * apply to the exercise type are accepted; irrelevant fields are dropped.
 */
export function validateActual(type: ExerciseType, input: ActualInput): { ok: true; value: Actual } | { ok: false; errors: FieldErrors } {
  const errors: FieldErrors = {};
  const value: Actual = { weight: null, unit: null, reps: null, seconds: null, rir: null };
  if (type === 'weight_reps') {
    const w = parseDecimal(input.weight);
    if (w == null) errors.weight = 'Enter a weight (0 is allowed).';
    else if (Number.isNaN(w) || !Number.isFinite(w)) errors.weight = 'Weight must be a number.';
    else if (w < 0 || w > LIMITS.weightMax) errors.weight = `Weight must be 0 to ${LIMITS.weightMax} ${input.unit ?? ''}`.trim() + '.';
    else if (!hasAtMostOneDecimal(input.weight!)) errors.weight = 'Use at most one decimal place.';
    else value.weight = w;
    if (!input.unit) errors.weight = errors.weight ?? 'Choose kg or lb.';
    value.unit = input.unit ?? null;
  }
  if (type === 'weight_reps' || type === 'reps') {
    const r = parseWhole(input.reps);
    if (r == null) errors.reps = 'Enter reps.';
    else if (Number.isNaN(r) || r < 1 || r > LIMITS.repsMax) errors.reps = `Reps must be a whole number from 1 to ${LIMITS.repsMax}.`;
    else value.reps = r;
    const rir = parseWhole(input.rir);
    if (rir != null) {
      if (Number.isNaN(rir) || rir < 0 || rir > LIMITS.rirMax) errors.rir = `RIR must be a whole number from 0 to ${LIMITS.rirMax}.`;
      else value.rir = rir;
    }
  }
  if (type === 'seconds') {
    const s = parseWhole(input.seconds);
    if (s == null) errors.seconds = 'Enter seconds.';
    else if (Number.isNaN(s) || s < 1 || s > LIMITS.secondsMax) errors.seconds = 'Seconds must be a whole number of at least 1.';
    else value.seconds = s;
  }
  if (Object.keys(errors).length) return { ok: false, errors };
  return { ok: true, value };
}

export interface TargetInput {
  targetSets: number | null;
  targetReps: number | null;
  targetSeconds: number | null;
  targetLoad: number | null;
  targetUnit: Unit | null;
  targetRirMin: number | null;
  targetRirMax: number | null;
  restMode: RestMode;
  restSeconds: number | null;
}

/** TR-01: validate routine targets independently of any actual result. */
export function validateTargets(type: ExerciseType, t: TargetInput): string | null {
  if (t.targetSets == null) return null; // legacy exercise-only entry
  if (!Number.isInteger(t.targetSets) || t.targetSets < 1 || t.targetSets > LIMITS.setsMax)
    return `Sets must be 1 to ${LIMITS.setsMax}.`;
  if (type === 'seconds') {
    if (t.targetSeconds == null || !Number.isInteger(t.targetSeconds) || t.targetSeconds < 1 || t.targetSeconds > LIMITS.secondsMax)
      return 'Target time must be whole seconds of at least 1.';
  } else if (t.targetReps == null || !Number.isInteger(t.targetReps) || t.targetReps < 1 || t.targetReps > LIMITS.repsMax) {
    return `Target reps must be 1 to ${LIMITS.repsMax}.`;
  }
  if (t.targetLoad != null) {
    if (type !== 'weight_reps') return 'Only weight-and-reps exercises take a load.';
    if (!Number.isFinite(t.targetLoad) || t.targetLoad < 0 || t.targetLoad > LIMITS.weightMax) return `Load must be 0 to ${LIMITS.weightMax}.`;
    if (!t.targetUnit) return 'Choose a unit for the load.';
  }
  const { targetRirMin: a, targetRirMax: b } = t;
  if (a != null || b != null) {
    if (type === 'seconds') return 'RIR applies only to rep-based work.';
    if (a == null || b == null) return 'Enter both ends of the RIR range.';
    if (![a, b].every((n) => Number.isInteger(n) && n >= 0 && n <= LIMITS.rirMax)) return `RIR must be 0 to ${LIMITS.rirMax}.`;
    if (a > b) return 'RIR minimum cannot exceed the maximum.';
  }
  if (t.restMode === 'duration') {
    if (t.restSeconds == null || !Number.isInteger(t.restSeconds) || t.restSeconds < LIMITS.restMin || t.restSeconds > LIMITS.restMax)
      return `Rest must be ${LIMITS.restMin} to ${LIMITS.restMax} seconds.`;
  }
  return null;
}

export function validateRestSeconds(s: number | null): string | null {
  if (s == null) return null;
  if (!Number.isInteger(s) || s < LIMITS.restMin || s > LIMITS.restMax) return `Rest must be ${LIMITS.restMin} to ${LIMITS.restMax} seconds.`;
  return null;
}

export function validateWorkoutDate(date: string, today = todayLocal()): string | null {
  if (!isValidDateString(date)) return 'Choose a valid date.';
  if (isFuture(date, today)) return 'Future dates cannot be chosen.';
  return null;
}

export function validateBodyweight(weight: number, date: string, today = todayLocal()): string | null {
  if (!Number.isFinite(weight) || weight <= 0 || weight > LIMITS.bodyweightMax) return `Bodyweight must be greater than 0 and at most ${LIMITS.bodyweightMax}.`;
  if (!isValidDateString(date)) return 'Choose a valid date.';
  if (isFuture(date, today)) return 'Readings cannot be in the future.';
  return null;
}

export function validateGoal(load: number, reps: number, deadline: string | null): string | null {
  if (!Number.isFinite(load) || load <= 0 || load > LIMITS.weightMax) return `Target load must be greater than 0 and at most ${LIMITS.weightMax}.`;
  if (!Number.isInteger(reps) || reps < 1 || reps > LIMITS.repsMax) return `Minimum reps must be 1 to ${LIMITS.repsMax}.`;
  if (deadline != null && !isValidDateString(deadline)) return 'Deadline must be a valid date.';
  return null;
}

export function validateReminder(weekdays: number[], time: string): string | null {
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) return 'Choose a valid time.';
  if (weekdays.some((d) => !Number.isInteger(d) || d < 1 || d > 7)) return 'Invalid weekday.';
  return null;
}
