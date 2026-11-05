import { useRouter } from 'expo-router';
import { useState } from 'react';
import { compareWorkouts, filterHistory, formatDate, setCount, type Workout } from '../../src/domain';
import { useApp } from '../../src/session';
import { Button, Card, DateField, Empty, ExercisePicker, Item, Notice, Page, Txt } from '../../src/ui';

export default function History() {
  const router = useRouter();
  const { model } = useApp();
  const [filters, setFilters] = useState(false);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [exerciseId, setExerciseId] = useState<string>();
  const [picking, setPicking] = useState(false);
  const [cursor, setCursor] = useState<Workout>();
  const invalid = !!start && !!end && start > end;
  const results = invalid ? [] : filterHistory(model!.workouts, start, end, exerciseId);
  const loaded = cursor ? results.filter(w => compareWorkouts(w, cursor) <= 0) : [];
  const rows = loaded.concat(results.slice(loaded.length, loaded.length + 20));
  const lookup = (id: string) => model!.exercises.find(e => e.id === id)?.name ?? 'Exercise';
  const loadMore = () => { if (rows.length < results.length) setCursor(rows.at(-1)); };
  return <Page kicker="TRAINING LOG" title="History" subtitle="Review completed workouts and correct your records." onEnd={loadMore}>
    <Button label={filters ? 'Hide filters' : 'Filter workouts'} icon="options-outline" tone="secondary" onPress={() => setFilters(!filters)} />
    {(filters || !!start || !!end || !!exerciseId) && <Card>
      {filters && <>
        <DateField label="From date" value={start} clear onChange={v => { setStart(v); setCursor(undefined); }} />
        <DateField label="Through date" value={end} clear onChange={v => { setEnd(v); setCursor(undefined); }} />
        <Button label={exerciseId ? 'Exercise: ' + lookup(exerciseId) : 'Choose exercise'} tone="secondary" onPress={() => setPicking(true)} />
        {!!exerciseId && <Button label="Clear exercise" tone="quiet" onPress={() => { setExerciseId(undefined); setCursor(undefined); }} />}
      </>}
      <Button label="Clear all filters" tone="quiet" onPress={() => { setStart(''); setEnd(''); setExerciseId(undefined); setCursor(undefined); }} />
    </Card>}
    <Notice message={invalid ? 'The start date must come before or match the end date.' : ''} error />
    {!invalid && !rows.length && <Empty title={start || end || exerciseId ? 'No workouts match' : 'No completed workouts yet'}
      detail={start || end || exerciseId ? 'Clear a filter or try a wider date range.' : 'Start a workout, record a set, and finish to see it here.'}
      icon="calendar-outline" />}
    {rows.map(w => <Item key={w.id} icon="calendar-outline" title={formatDate(w.date)}
      detail={w.entries.slice(0, 3).map(e => lookup(e.exerciseId)).join(', ') +
        (w.entries.length > 3 ? ' and ' + (w.entries.length - 3) + ' more' : '') + '\n' + setCount(w) + ' sets'}
      onPress={() => router.push({ pathname: '/workout', params: { id: w.id } })} />)}
    {rows.length < results.length && <Button label="Load older workouts" tone="secondary" onPress={loadMore} />}
    {!!rows.length && rows.length === results.length && <Txt variant="small">{results.length} completed workouts</Txt>}
    {picking && <ExercisePicker showArchived onPick={exercise => {
      setExerciseId(exercise.id); setCursor(undefined); setPicking(false);
    }} onClose={() => setPicking(false)} />}
  </Page>;
}
