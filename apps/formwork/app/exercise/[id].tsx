import { useState } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useApp } from '../../src/state';
import { actualLabel, kindName, prettyDay, working } from '../../src/model';
import { ExerciseEditor } from '../../src/ExercisePicker';
import { Badge, Button, Empty, ErrorNote, Header, Item, Kicker, Page, Sheet, T, c, confirm, s, useAction } from '../../src/ui';

export default function ExerciseDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const app = useApp();
  const router = useRouter();
  const [edit, setEdit] = useState(false);
  const action = useAction();
  const exercise = app.exercise(id);
  if (!exercise) return <Page><Header title="Exercise unavailable" back={() => router.back()} /></Page>;
  const sessions = app.finished.filter(w => working(w).some(x => x.entry.exerciseId === id));
  function toggle() {
    const e = exercise!;
    action.run(() => app.save([{ kind: 'exercise', id: e.id, value: { ...e, archived: !e.archived } }]));
  }
  return <Page>
    <Header eyebrow="EXERCISE LIBRARY" title={exercise.name} subtitle={`${kindName[exercise.kind]} · ${exercise.equipment}`} back={() => router.back()} />
    {exercise.archived ? <Badge label="Archived" /> : null}
    <View style={s.panel}>
      <Kicker>MUSCLE TAGS</Kicker>
      <T>Primary · {exercise.primary.join(', ') || 'Unspecified'}</T>
      <T color={c.muted}>Secondary · {exercise.secondary.join(', ') || 'None listed'}</T>
    </View>
    {exercise.instructions.length ? <View style={s.panel}>
      <Kicker>HOW TO PERFORM</Kicker>{exercise.instructions.map((step, i) => <T key={i}>{i + 1}. {step}</T>)}
    </View> : null}
    {exercise.custom ? <View style={s.wrap}>
      <Button label="Edit exercise" onPress={() => setEdit(true)} />
      <Button label={exercise.archived ? 'Restore exercise' : 'Archive exercise'} tone={exercise.archived ? 'secondary' : 'danger'}
        onPress={() => exercise.archived ? toggle() : confirm('Archive ' + exercise.name + '?', 'Past workouts keep this exercise. You can restore it from the library.', 'Archive', toggle)} />
    </View> : null}
    <ErrorNote message={action.error} />
    <T kind="sub" accessibilityRole="header">Exercise history</T>
    {sessions.length ? sessions.map(w => <View key={w.id} style={s.panel}>
      <Item title={prettyDay(w.date)} onPress={() => router.push({ pathname: '/session/[id]', params: { id: w.id } })} />
      {working(w).filter(x => x.entry.exerciseId === id).map(x => <T key={x.set.id}>{actualLabel(x.actual, app.settings)}</T>)}
    </View>) : <Empty title="No previous record" detail="Completed working sets for this exercise will appear here." />}
    {edit ? <Sheet title="Edit exercise" onClose={() => setEdit(false)}><ExerciseEditor exercise={exercise}
      onClose={() => setEdit(false)} onSaved={() => setEdit(false)} /></Sheet> : null}
  </Page>;
}
