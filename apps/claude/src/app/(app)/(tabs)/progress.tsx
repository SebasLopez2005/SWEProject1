import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { exerciseSeries, PERIOD_LABEL, seriesSummarySentence, weeklyComparisonSentence, weeklyVolume, type Period } from '../../../domain/analytics';
import { round1 } from '../../../domain/units';
import { setPickerTarget } from '../../../state/picker';
import { useLoad, useSession } from '../../../state/session';
import { ProgressChart, ValueTable, type ChartPoint } from '../../../ui/Chart';
import { Banner, Button, Card, Empty, Loading, Screen, Segmented, T } from '../../../ui/kit';
import { colors } from '../../../ui/theme';

/** FW-20..24: per-exercise volume / total reps, overall weekly volume, period choice, point drill-down. */
export default function Progress() {
  const { repo, settings } = useSession();
  const params = useLocalSearchParams<{ exerciseId?: string }>();
  const [metric, setMetric] = useState<'weekly' | 'exercise'>(params.exerciseId ? 'exercise' : 'weekly');
  const [period, setPeriod] = useState<Period>('12w');
  const [picked, setExerciseId] = useState<string | null>(null);
  const exerciseId = picked ?? params.exerciseId ?? null;
  const { data } = useLoad(async () => ({ ws: await repo.finishedWorkouts(), ex: await repo.exerciseMap() }));
  if (!data) return <Loading />;
  const exercise = exerciseId ? data.ex.get(exerciseId) ?? null : null;

  const choose = () => {
    setPickerTarget((id) => setExerciseId(id), 'Graph an exercise', true);
    router.push('/picker');
  };

  let body;
  if (data.ws.length === 0) {
    body = <Empty title="No finished workouts yet" body="Graphs appear after you finish workouts." />;
  } else if (metric === 'weekly') {
    const buckets = weeklyVolume(data.ws, data.ex, period, settings.unit);
    const points: ChartPoint[] = buckets.map((b) => ({ id: b.weekStart, date: b.weekStart, value: b.value, label: `${round1(b.value)} ${settings.unit}`, partial: b.partial }));
    const open = (p: ChartPoint) => router.push(`/week/${p.id}`);
    body = (
      <Card>
        <T variant="h3">Weekly volume, all weight-based exercises</T>
        <T color={colors.muted}>{weeklyComparisonSentence(buckets, settings.unit)}</T>
        <ProgressChart kind="bar" points={points} yAxisLabel={`Volume (${settings.unit}) per week, weeks start Monday`} onOpen={open} openLabel="List this week's workouts" />
        <ValueTable points={points} onOpen={open} header="Week starting · volume" />
      </Card>
    );
  } else if (!exercise) {
    body = <Empty title="Choose an exercise" body="Pick a weighted or reps-only exercise to see its trend." action={<Button title="Choose exercise" variant="secondary" onPress={choose} />} />;
  } else if (exercise.type === 'seconds') {
    body = <Banner tone="info">{exercise.name} is recorded in seconds. Timed exercises are saved in history but not graphed.</Banner>;
  } else {
    const pts = exerciseSeries(data.ws, exercise, period, settings.unit);
    const unitLabel = exercise.type === 'weight_reps' ? settings.unit : 'reps';
    const points: ChartPoint[] = pts.map((p) => ({ id: p.workoutId, date: p.date, value: p.value, label: p.label }));
    const open = (p: ChartPoint) => router.push(`/workout/${p.id}`);
    body = (
      <Card>
        <T variant="h3">{exercise.name}</T>
        <T color={colors.muted}>{seriesSummarySentence(pts, unitLabel)}</T>
        {points.length >= 2 ? (
          <ProgressChart kind="line" points={points} yAxisLabel={exercise.type === 'weight_reps' ? `Total volume (${settings.unit}) per workout` : 'Total reps per workout'} onOpen={open} openLabel={`Open the workout`} />
        ) : null}
        {points.length ? <ValueTable points={points} onOpen={open} header={`Workout date · ${exercise.type === 'weight_reps' ? 'volume' : 'total reps'}`} /> : <T color={colors.faint}>No workouts with this exercise in this period.</T>}
      </Card>
    );
  }

  return (
    <Screen>
      <Segmented label="Graph" value={metric} onChange={setMetric} options={[{ value: 'weekly', label: 'Weekly volume' }, { value: 'exercise', label: 'One exercise' }]} />
      <Segmented label="Period" value={period} onChange={setPeriod} options={(Object.keys(PERIOD_LABEL) as Period[]).map((p) => ({ value: p, label: PERIOD_LABEL[p] }))} />
      {metric === 'exercise' && exercise ? <Button title={`Change exercise (${exercise.name})`} compact variant="ghost" onPress={choose} /> : null}
      {body}
      <T variant="caption" color={colors.faint}>Volume = weight × reps of completed working sets, converted to {settings.unit} before adding. Warm-up and mobility are excluded. Graphs show your logged numbers only; they do not judge strength or health.</T>
    </Screen>
  );
}
