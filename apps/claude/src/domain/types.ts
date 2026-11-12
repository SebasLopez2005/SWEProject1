// Core domain types shared by repositories, services, presenters and sync.

export type Unit = 'kg' | 'lb';
export type ExerciseType = 'weight_reps' | 'reps' | 'seconds';
export type SetState = 'pending' | 'done' | 'skipped';
export type Phase = 'warmup' | 'work' | 'mobility';
export type RestMode = 'inherit' | 'duration' | 'off';
export type WorkoutState = 'active' | 'finished';

export const EXERCISE_TYPE_LABEL: Record<ExerciseType, string> = {
  weight_reps: 'Weight and reps',
  reps: 'Reps only',
  seconds: 'Time (seconds)',
};

export const PHASE_LABEL: Record<Phase, string> = {
  warmup: 'Warm-up',
  work: 'Working sets',
  mobility: 'Mobility',
};

export interface Exercise {
  id: string;
  ownerId: string | null; // null = shared catalog record
  name: string;
  normalizedName: string;
  type: ExerciseType;
  category: string;
  equipment: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  instructions: string;
  sourceId: string | null;
  archived: boolean;
  everUsed: boolean;
  revision: number;
}

export interface SetRow {
  id: string;
  entryId: string;
  position: number;
  state: SetState;
  targetReps: number | null;
  targetSeconds: number | null;
  targetLoad: number | null;
  targetUnit: Unit | null;
  targetRirMin: number | null;
  targetRirMax: number | null;
  weight: number | null;
  unit: Unit | null;
  reps: number | null;
  seconds: number | null;
  rir: number | null;
  completedAt: string | null;
}

export interface WorkoutEntry {
  id: string;
  workoutId: string;
  exerciseId: string;
  position: number;
  phase: Phase;
  restMode: RestMode;
  restSeconds: number | null;
  sets: SetRow[];
}

export interface Workout {
  id: string;
  workoutDate: string; // YYYY-MM-DD calendar date
  state: WorkoutState;
  startedAt: string;
  finishedAt: string | null;
  durationSeconds: number | null;
  routineId: string | null;
  routineName: string | null;
  defaultRestSeconds: number | null;
  backdated: boolean;
  revision: number;
  entries: WorkoutEntry[];
}

export interface RoutineEntry {
  id: string;
  routineId: string;
  exerciseId: string;
  position: number;
  phase: Phase;
  targetSets: number | null; // null = legacy exercise-only template entry
  targetReps: number | null;
  targetSeconds: number | null;
  targetLoad: number | null;
  targetUnit: Unit | null;
  targetRirMin: number | null;
  targetRirMax: number | null;
  restMode: RestMode;
  restSeconds: number | null;
}

export interface Routine {
  id: string;
  name: string;
  normalizedName: string;
  defaultRestSeconds: number | null;
  revision: number;
  updatedAt: string;
  entries: RoutineEntry[];
}

export interface Settings {
  unit: Unit;
  unitChosen: boolean;
  showEquivalent: boolean;
  textScale: number;
  revision: number;
}

export interface ReminderPreference {
  enabled: boolean;
  weekdays: number[]; // 1 = Monday ... 7 = Sunday
  time: string; // HH:MM local
  revision: number;
}

export interface LiftGoal {
  id: string;
  exerciseId: string;
  targetLoad: number;
  unit: Unit;
  minReps: number;
  deadline: string | null;
  revision: number;
  createdAt: string;
}

export interface BodyweightReading {
  id: string;
  readingDate: string;
  enteredAt: string;
  weight: number;
  unit: Unit;
  revision: number;
}

export interface BodyweightTarget {
  weight: number;
  unit: Unit;
  targetDate: string | null;
  revision: number;
}

export type AggregateKind =
  | 'exercise'
  | 'routine'
  | 'workout'
  | 'settings'
  | 'goal'
  | 'bodyweight'
  | 'bodyweight_target'
  | 'reminder';

/** Order in which root kinds must reach the server so references resolve. */
export const KIND_PRIORITY: Record<AggregateKind, number> = {
  settings: 0,
  reminder: 0,
  exercise: 1,
  routine: 2,
  workout: 3,
  goal: 3,
  bodyweight: 3,
  bodyweight_target: 3,
};

export type SyncStatus =
  | 'device_only'
  | 'saved_on_device'
  | 'waiting'
  | 'uploaded'
  | 'needs_sign_in'
  | 'needs_attention'
  | 'not_saved';

export const SYNC_STATUS_LABEL: Record<SyncStatus, string> = {
  device_only: 'Saved on this device (no cloud account)',
  saved_on_device: 'Saved on this device',
  waiting: 'Waiting to upload',
  uploaded: 'Uploaded',
  needs_sign_in: 'Needs sign-in',
  needs_attention: 'Needs attention',
  not_saved: 'Not saved',
};

export class DomainError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'DomainError';
  }
}
