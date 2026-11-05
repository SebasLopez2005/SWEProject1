import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Line, Polyline, Rect } from 'react-native-svg';
import { display, formatDate, graph, periods, type Period, type Point } from '../../src/domain';
import { useApp } from '../../src/session';
import { Button, Card, c, Chip, Empty, ExercisePicker, Item, Page, Row, Sheet, Txt } from '../../src/ui';

export default function Progress() {
  const router = useRouter();
  const { exerciseId } = useLocalSearchParams<{ exerciseId?: string }>();
  const { model } = useApp();
  const [period, setPeriod] = useState<Period>('4 weeks');
  const [picking, setPicking] = useState(false);
  const [point, setPoint] = useState<string>();
  const [limit, setLimit] = useState(16);
  const exercise = model!.exercises.find(e => e.id === exerciseId);
  const unit = model!.settings.unit;
  const points = graph(model!.workouts, period, unit, exercise);
  const selected = points.find(p => p.id === point);
  const metric = exercise?.type === 'reps_only' ? 'Total reps' : 'Volume (' + unit + ')';
  const pointValue = (p: Point) => display(p.value) + (exercise?.type === 'reps_only' ? ' reps' : ' ' + unit);
  const pointTitle = (p: Point) => (exercise ? '' : 'Week of ') + formatDate(p.date) + (p.partial ? ' · Partial week' : '');
  const open = (id: string) => router.push({ pathname: '/workout', params: { id } });
  const latest = points.at(-1);
  const earlier = points.at(-2);
  const difference = latest && earlier ? latest.value - earlier.value : 0;
  function setExercise(id: string) {
    router.setParams({ exerciseId: id });
    setPoint(undefined); setLimit(16); setPicking(false);
  }
  return <Page kicker="TRAINING TRENDS" title="Progress" subtitle="Follow volume and reps from your completed workouts.">
    <Row>
      <Chip label="Weekly volume" selected={!exercise} onPress={() => setExercise('')} />
      <Chip label={exercise ? exercise.name : 'Choose exercise'} selected={!!exercise} onPress={() => setPicking(true)} />
    </Row>
    <Row>{periods.map(p => <Chip key={p} label={p} selected={period === p} onPress={() => { setPeriod(p); setPoint(undefined); setLimit(16); }} />)}</Row>
    {exercise?.type === 'seconds' ? <Empty title="Timed exercise" detail="View recorded seconds in exercise history." /> :
      !points.length ? <Empty title="No chart data" detail="Finish a workout with logged sets to see your progress." icon="stats-chart-outline" /> : <>
        <Card>
          <Txt variant="label" color={c.green}>{period.toUpperCase()}</Txt>
          <Txt variant="h2">{exercise?.name ?? 'Overall weekly volume'}</Txt>
          <Txt variant="small">{metric} · {exercise ? 'Workout date' : 'Week starting Monday'}</Txt>
          {exercise && points.length < 2 ? <Txt color={c.muted}>Log at least two workouts with this exercise to see a trend.</Txt> :
            <Chart points={points} weekly={!exercise} onPoint={setPoint} />}
          {!exercise && latest && earlier && <Txt>{difference === 0 ? 'The latest two weeks have the same volume.' :
            'The latest week has ' + display(Math.abs(difference)) + ' ' + unit +
            (difference > 0 ? ' more' : ' less') + ' volume than the previous week' +
            (earlier.value > 0 ? ' (' + display(Math.abs(100 * difference / earlier.value)) + '%).' : '.')}
            {latest.partial ? ' This week is still in progress.' : ''}</Txt>}
          {exercise && latest && <Txt>{points.length} {points.length === 1 ? 'workout' : 'workouts'} in this period. Latest: {pointValue(latest)}.</Txt>}
        </Card>
        <Txt variant="h2">Chart values</Txt>
        <Txt color={c.muted}>Select a value to view the recorded workouts.</Txt>
        {[...points].reverse().slice(0, limit).map(p => <Item key={p.id} title={pointTitle(p)} detail={pointValue(p)}
          onPress={() => setPoint(p.id)} />)}
        {limit < points.length && <Button label="Show older values" tone="secondary" onPress={() => setLimit(limit + 16)} />}
      </>}
    {picking && <ExercisePicker title="Choose an exercise to graph" showArchived onClose={() => setPicking(false)} onPick={e => setExercise(e.id)} />}
    {selected && <Sheet title={pointTitle(selected)} onClose={() => setPoint(undefined)}>
      <Txt variant="h2">{pointValue(selected)}</Txt>
      {selected.workoutIds.map(id => {
        const w = model!.workouts.find(w => w.id === id);
        return w && <Item key={id} title={formatDate(w.date)} detail="Open workout summary" icon="calendar-outline"
          onPress={() => { setPoint(undefined); open(id); }} />;
      })}
      {!selected.workoutIds.length && <Empty title="No weighted workouts" detail="No workouts contributed to this week’s volume." />}
    </Sheet>}
  </Page>;
}
function Chart({ points, weekly, onPoint }: { points: Point[]; weekly: boolean; onPoint(id: string): void }) {
  const [width, setWidth] = useState(0);
  const top = 16, bottom = 147, left = 12;
  const max = Math.max(1, ...points.map(p => p.value));
  const step = Math.max(0, (width - left * 2) / points.length);
  const x = (i: number) => left + step * (i + .5);
  const y = (value: number) => bottom - value / max * (bottom - top);
  return <View style={{ gap: 6 }} onLayout={e => setWidth(e.nativeEvent.layout.width)}>
    <Row between><Txt variant="small" color={c.muted}>Top: {display(max)}</Txt><Txt variant="small" color={c.muted}>Base: 0</Txt></Row>
    {width > 0 && <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <Svg width={width} height={158}>
        {[top, (bottom + top) / 2, bottom].map(at => <Line key={at} x1="0" x2={width} y1={at} y2={at}
          stroke={c.line} strokeDasharray={at === bottom ? undefined : '4 4'} />)}
        {!weekly && <Polyline fill="none" stroke={c.green} strokeWidth="2.5" points={points.map((p, i) => x(i) + ',' + y(p.value)).join(' ')} />}
        {points.map((p, i) => weekly
          ? <Rect key={p.id} x={x(i) - Math.min(19, step * .35)} y={Math.min(y(p.value), bottom - 2)}
            width={Math.min(38, step * .7)} height={Math.max(2, bottom - y(p.value))}
            rx={Math.min(5, step * .2)} fill={p.partial ? '#6B8151' : c.green} onPress={() => onPoint(p.id)} />
          : <Circle key={p.id} cx={x(i)} cy={y(p.value)} r={Math.min(5, Math.max(2, step * .22))}
            stroke={c.surface} strokeWidth={1} fill={c.green} onPress={() => onPoint(p.id)} />)}
        {points.map((p, i) => <Rect key={'target-' + p.id} x={x(i) - step / 2} y={0} width={step} height={156}
          fill="transparent" onPress={() => onPoint(p.id)} />)}
      </Svg>
    </View>}
    <Row between><Txt variant="small" color={c.muted}>{formatDate(points[0].date, true)}</Txt>
      <Txt variant="small" color={c.muted}>{formatDate(points.at(-1)!.date, true)}</Txt></Row>
  </View>;
}
