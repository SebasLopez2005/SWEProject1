import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { exerciseSets, finished, formatDate, setLabel, typeLabels } from '../src/domain';
import { ExerciseForm } from '../src/editors';
import { useApp } from '../src/session';
import { Button, Card, c, confirm, Empty, Item, message, Notice, Page, SyncLabel, Txt } from '../src/ui';

export default function ExerciseDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { model, save } = useApp();
  const exercise = model!.exercises.find(e => e.id === id);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const [note, setNote] = useState('');
  const [limit, setLimit] = useState(20);
  if (!exercise) return <Page title="Exercise unavailable" back><Empty title="This exercise is unavailable" detail="Return to the exercise library." /></Page>;
  const workouts = finished(model!.workouts).filter(w => exerciseSets(w, exercise.id).length);
  const archive = () => {
    try {
      save({ ...exercise, archived: !exercise.archived }, exercise);
      setError('');
      setNote(exercise.archived ? 'Exercise restored.' : 'Exercise archived. Its recorded sets remain in history.');
    } catch (e) { setError('Not saved. ' + message(e)); }
  };
  return <Page kicker="EXERCISE HISTORY" title={exercise.name} back
    subtitle={exercise.muscle + ' · ' + typeLabels[exercise.type] + (exercise.archived ? ' · Archived' : '')}>
    <Notice message={error} error /><Notice message={note} />
    {!exercise.shared && <Card>
      <Txt variant="label" color={c.accent}>CUSTOM EXERCISE</Txt>
      <SyncLabel root={exercise} />
      <Button label="Edit custom exercise" icon="create-outline" tone="secondary" onPress={() => setEditing(true)} />
      <Button label={exercise.archived ? 'Restore exercise' : 'Archive exercise'} tone={exercise.archived ? 'primary' : 'danger'}
        onPress={() => exercise.archived ? archive() : confirm('Archive ' + exercise.name + '?',
          'This hides the exercise from new selections. You can restore it here.', 'Archive', archive)} />
    </Card>}
    {exercise.type !== 'seconds' && <Button label="View progress graph" icon="stats-chart-outline" tone="secondary"
      onPress={() => router.navigate({ pathname: '/progress', params: { exerciseId: id } })} />}
    {!workouts.length && <Empty title="No previous record" detail="Finished workouts with recorded sets for this exercise will appear here." />}
    {workouts.slice(0, limit).map(w => <Item key={w.id} title={formatDate(w.date)} icon="calendar-outline"
      detail={exerciseSets(w, exercise.id).map((s, i) => 'Set ' + (i + 1) + ' · ' + setLabel(s, model!.settings)).join('\n')}
      onPress={() => router.push({ pathname: '/workout', params: { id: w.id } })} />)}
    {limit < workouts.length && <Button label="Load older sessions" tone="secondary" onPress={() => setLimit(limit + 20)} />}
    {editing && <ExerciseForm initial={exercise} onClose={() => setEditing(false)} onDone={() => { setEditing(false); setNote('Exercise saved.'); }} />}
  </Page>;
}
