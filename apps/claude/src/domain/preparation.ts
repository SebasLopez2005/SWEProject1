// TR-04 / TR-05: optional warm-up and targeted mobility suggestions.
// Copy describes what a step prepares the lifter for; it never promises
// injury prevention.
import type { Exercise, Phase, Unit } from './types';

export interface PrepStep {
  exerciseId: string;
  phase: Phase;
  sets: { targetReps: number | null; targetSeconds: number | null; targetLoad: number | null; targetUnit: Unit | null }[];
  reason: string;
}

const GENERAL_NAMES = ['Jumping Jacks', 'Rope Jumping', 'Bicycling, Stationary', 'Jogging, Treadmill'];

export function generalWarmup(all: Exercise[]): PrepStep | null {
  for (const name of GENERAL_NAMES) {
    const e = all.find((x) => x.name.toLowerCase() === name.toLowerCase() && !x.archived);
    if (e) {
      return {
        exerciseId: e.id,
        phase: 'warmup',
        sets: [e.type === 'seconds' ? { targetReps: null, targetSeconds: 300, targetLoad: null, targetUnit: null } : { targetReps: 30, targetSeconds: null, targetLoad: null, targetUnit: null }],
        reason: 'A few minutes of easy general movement raises your heart rate before lifting.',
      };
    }
  }
  return null;
}

/** Lighter ramp-up sets for the first weighted lift: about 40%, 60% and 80% of the planned load. */
export function rampSets(exercise: Exercise, targetLoad: number | null, unit: Unit): PrepStep | null {
  if (exercise.type !== 'weight_reps') return null;
  const ramp = [
    { pct: 0.4, reps: 8 },
    { pct: 0.6, reps: 5 },
    { pct: 0.8, reps: 3 },
  ];
  const step = unit === 'kg' ? 2.5 : 5;
  return {
    exerciseId: exercise.id,
    phase: 'warmup',
    sets: ramp.map((r) => ({
      targetReps: r.reps,
      targetSeconds: null,
      targetLoad: targetLoad != null ? Math.max(0, Math.round((targetLoad * r.pct) / step) * step) : null,
      targetUnit: targetLoad != null ? unit : null,
    })),
    reason: `Lighter sets rehearse the ${exercise.name} movement pattern before your working sets.`,
  };
}

/** Stretches from the catalog whose primary muscles overlap the given regions. */
export function mobilityFor(regions: string[], all: Exercise[], limit = 3, phase: Phase = 'mobility'): PrepStep[] {
  const wanted = new Set(regions);
  const scored = all
    .filter((e) => e.category === 'stretching' && !e.archived)
    .map((e) => ({ e, score: e.primaryMuscles.filter((m) => wanted.has(m)).length * 2 + e.secondaryMuscles.filter((m) => wanted.has(m)).length }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.e.name.localeCompare(b.e.name));
  return scored.slice(0, limit).map(({ e }) => ({
    exerciseId: e.id,
    phase,
    sets: [{ targetReps: null, targetSeconds: 30, targetLoad: null, targetUnit: null }],
    reason: `Targets ${e.primaryMuscles.join(', ')}. Move slowly and stay within a comfortable range.`,
  }));
}

export const BODY_AREAS: { id: string; label: string; regions: string[] }[] = [
  { id: 'upper', label: 'Upper body', regions: ['chest', 'shoulders', 'lats', 'triceps', 'biceps', 'traps', 'middle back'] },
  { id: 'lower', label: 'Lower body', regions: ['quadriceps', 'hamstrings', 'glutes', 'calves', 'adductors', 'abductors'] },
  { id: 'core', label: 'Core and back', regions: ['abdominals', 'lower back'] },
  { id: 'shoulders', label: 'Shoulders', regions: ['shoulders', 'traps'] },
  { id: 'hips', label: 'Hips', regions: ['glutes', 'adductors', 'abductors', 'hamstrings'] },
];

export const MUSCLE_LABEL: Record<string, string> = {
  abdominals: 'Abdominals', abductors: 'Abductors', adductors: 'Adductors', biceps: 'Biceps', calves: 'Calves', chest: 'Chest',
  forearms: 'Forearms', glutes: 'Glutes', hamstrings: 'Hamstrings', lats: 'Lats', 'lower back': 'Lower back', 'middle back': 'Middle back',
  neck: 'Neck', quadriceps: 'Quadriceps', shoulders: 'Shoulders', traps: 'Traps', triceps: 'Triceps',
};

export const REMINDER_MESSAGES = [
  'Have you trained today?',
  'Short on time? Start with one planned lift.',
  'Log the set that moves you closer to your goal.',
  'Your next session is ready when you are.',
];
