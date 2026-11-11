import type { ExerciseType, SetRow } from '../domain/types';
import { formatStoredWeight } from '../domain/units';

/** One formatter for set rows, previous performance and summaries (FW-30). */
export function formatActual(s: Pick<SetRow, 'weight' | 'unit' | 'reps' | 'seconds' | 'rir'>, type: ExerciseType | undefined, showEquivalent: boolean): string {
  const rir = s.rir != null ? ` · RIR ${s.rir}` : '';
  if (s.seconds != null && (type === 'seconds' || s.reps == null)) return `${s.seconds} s`;
  if (s.weight != null && s.unit) return `${formatStoredWeight(s.weight, s.unit, showEquivalent)} × ${s.reps ?? '?'}${rir}`;
  if (s.reps != null) return `${s.reps} reps${rir}`;
  return '—';
}

export function formatTarget(s: Pick<SetRow, 'targetReps' | 'targetSeconds' | 'targetLoad' | 'targetUnit' | 'targetRirMin' | 'targetRirMax'>, showEquivalent: boolean): string | null {
  const parts: string[] = [];
  if (s.targetLoad != null && s.targetUnit) parts.push(formatStoredWeight(s.targetLoad, s.targetUnit, showEquivalent));
  if (s.targetReps != null) parts.push(`${s.targetReps} reps`);
  if (s.targetSeconds != null) parts.push(`${s.targetSeconds} s`);
  if (s.targetRirMin != null && s.targetRirMax != null) parts.push(s.targetRirMin === s.targetRirMax ? `RIR ${s.targetRirMin}` : `RIR ${s.targetRirMin}–${s.targetRirMax}`);
  return parts.length ? parts.join(' · ') : null;
}

export function plural(n: number, one: string, many = `${one}s`) {
  return `${n} ${n === 1 ? one : many}`;
}

export function namesWithMore(names: string[], max = 3): string {
  if (names.length <= max) return names.join(', ');
  return `${names.slice(0, max).join(', ')} and ${names.length - max} more`;
}
