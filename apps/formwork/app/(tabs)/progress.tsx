import { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '../../src/state';
import { Exercise, dateKey, displayNumber, prettyDay } from '../../src/model';
import { Period, Point, exercisePoints, periodStart, periods, weeklyPoints } from '../../src/analytics';
import { ExerciseList } from '../../src/ExercisePicker';
import { PointWorkouts, Trend } from '../../src/Charts';
import { Button, Chip, Empty, Header, Kicker, Page, Sheet, T, c, s } from '../../src/ui';

export default function Progress() {
  const app = useApp();
  const router = useRouter();
  const [period, setPeriod] = useState<Period>('4 weeks');
  const [exercise, setExercise] = useState<Exercise>();
  const [picking, setPicking] = useState(false);
  const [point, setPoint] = useState<Point>();
  const selected = exercise ? app.exercise(exercise.id) : undefined;
  const unit = selected?.kind === 'reps' ? 'Total reps' : `${app.settings.unit} × reps`;
  const today = dateKey(), from = periodStart(period, app.finished, today);
  const points = selected ? exercisePoints(app.finished, selected, from, today, app.settings.unit)
    : app.finished.length ? weeklyPoints(app.finished, from, today, app.settings.unit) : [];
  const last = points.at(-1), prior = points.at(-2);
  let comparison = 'Two weeks of data are needed for a comparison.';
  if (last && prior) {
    const delta = last.value - prior.value;
    comparison = delta === 0 ? 'Volume is unchanged from the previous week.' : prior.value === 0
      ? `${displayNumber(last.value)} ${unit} above the previous week’s zero volume.`
      : `${displayNumber(Math.abs(100 * delta / prior.value))}% ${delta > 0 ? 'higher' : 'lower'} than the previous week.`;
  }
  return <Page>
    <Header eyebrow="MEASURE YOUR WORK" title="Progress" subtitle="Confirmed working sets from finished workouts." />
    <View style={s.wrap}>
      <Chip label="Overall" selected={!selected} onPress={() => setExercise(undefined)} />
      <Chip label={selected?.name ?? 'By exercise'} selected={!!selected} onPress={() => setPicking(true)} />
    </View>
    <View style={s.wrap}>{periods.map(p => <Chip key={p} label={p} selected={p === period} onPress={() => setPeriod(p)} />)}</View>
    {selected?.kind === 'time' ? <Empty title="Timed exercise" detail="Open exercise history to see individual timed sets." /> : <>
      <Trend points={points} unit={unit} label={selected ? `${selected.name} · ${selected.kind === 'reps' ? 'Total reps' : 'Session volume'}` : 'Weekly weighted volume'}
        sparse={selected ? undefined : 'Finish a workout to see weekly volume.'}
        open={p => selected ? router.push({ pathname: '/session/[id]', params: { id: p.workouts[0].id } }) : setPoint(p)} />
      {!selected && points.length ? <View style={s.panel}>
        <Kicker>WEEK OVER WEEK</Kicker><T>{comparison}</T>
        <T kind="small" color={c.muted}>Weeks start Monday. The current week is in progress.{points[0].date < from ? ' The first week is partial.' : ''}</T>
      </View> : null}
      {selected && last && prior ? <T color={c.muted}>Last recorded {prettyDay(last.date)} · {displayNumber(last.value)} {unit}.</T> : null}
    </>}
    <Button label="Open exercise library" onPress={() => router.push('/library')} />
    {picking ? <Sheet title="Choose an exercise" onClose={() => setPicking(false)}>
      <ExerciseList onSelect={ex => { setExercise(ex); setPicking(false); }} />
    </Sheet> : null}
    {point ? <PointWorkouts point={point} onClose={() => setPoint(undefined)} /> : null}
  </Page>;
}
