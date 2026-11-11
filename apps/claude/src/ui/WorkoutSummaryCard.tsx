import { summarizeWorkout, type ExerciseMap } from '../domain/analytics';
import { formatDateLong, formatDuration } from '../domain/dates';
import type { Settings, Workout } from '../domain/types';
import { formatAggregate } from '../domain/units';
import { plural } from './format';
import { Card, KeyValue, T } from './kit';
import { colors } from './theme';

export function WorkoutSummaryCard({ w, ex, settings }: { w: Workout; ex: ExerciseMap; settings: Settings }) {
  const s = summarizeWorkout(w, ex, settings.unit);
  return (
    <Card>
      <T variant="h2">{formatDateLong(w.workoutDate)}</T>
      {w.routineName ? <T color={colors.muted}>{w.routineName}</T> : null}
      <KeyValue k="Duration" v={formatDuration(w.durationSeconds)} />
      <KeyValue k="Exercises" v={String(s.exerciseCount)} />
      <KeyValue k="Working sets" v={s.plannedWorkingSets ? `${s.workingSets} of ${s.plannedWorkingSets} planned` : String(s.workingSets)} />
      {s.skippedWorkingSets ? <KeyValue k="Skipped" v={plural(s.skippedWorkingSets, 'set')} /> : null}
      <KeyValue k="Total volume" v={formatAggregate(s.volume, settings.unit, settings.showEquivalent)} />
      {s.totalReps ? <KeyValue k="Bodyweight reps" v={String(s.totalReps)} /> : null}
      {s.totalSeconds ? <KeyValue k="Timed work" v={formatDuration(s.totalSeconds)} /> : null}
      {s.prepDone || s.prepSkipped ? <KeyValue k="Preparation" v={`${s.prepDone} done, ${s.prepSkipped} skipped (not counted as volume)`} /> : null}
    </Card>
  );
}
