import { randomUUID } from 'expo-crypto';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { dateKey, newWorkout, type Exercise, type Template, type Workout } from '../src/domain';
import { ExerciseForm } from '../src/editors';
import { useApp } from '../src/session';
import { Button, Card, c, confirm, DateField, Empty, ExercisePicker, Field, message, Notice, Page, Row, Sheet, SyncLabel, Txt } from '../src/ui';

export default function TemplateRoute() {
  const { id, workoutId } = useLocalSearchParams<{ id?: string; workoutId?: string }>();
  const { model } = useApp();
  const template = model!.templates.find(t => t.id === id);
  const source = model!.workouts.find(w => w.id === workoutId && w.state === 'finished');
  if ((id && !template) || (workoutId && !source)) return <Page title="Template unavailable" back>
    <Empty title="This record is unavailable" detail="It may have been removed. Return to Templates." />
  </Page>;
  return <TemplateScreen key={id ?? workoutId ?? 'new'} template={template} source={source} />;
}

function TemplateScreen({ template, source }: { template?: Template; source?: Workout }) {
  const { model, save } = useApp();
  const router = useRouter();
  const [editing, setEditing] = useState(!template);
  const [base, setBase] = useState(template);
  const [name, setName] = useState(template?.name ?? '');
  const [list, setList] = useState(template?.exercises ?? source?.entries.map(e => e.exerciseId) ?? []);
  const [picking, setPicking] = useState(false);
  const [creating, setCreating] = useState(false);
  const [starting, setStarting] = useState(false);
  const [date, setDate] = useState(dateKey());
  const [error, setError] = useState('');
  const exercises = editing ? list : template?.exercises ?? [];
  const active = model!.workouts.find(w => w.state === 'active');
  const lookup = (id: string) => model!.exercises.find(e => e.id === id);
  const open = (id: string, replace = true) => {
    const route = { pathname: '/workout' as const, params: { id } };
    if (replace) router.replace(route); else router.push(route);
  };
  function run(action: () => void) {
    try { action(); setError(''); } catch (e) { setError('Not saved. ' + message(e)); }
  }
  function move(index: number, direction: number) {
    const next = [...list];
    [next[index], next[index + direction]] = [next[index + direction], next[index]];
    setList(next);
  }
  function add(exercise: Exercise) {
    setList(value => [...value, exercise.id]); setPicking(false); setCreating(false);
  }
  return <Page title={editing ? template ? 'Edit template' : source ? 'Save as template' : 'New template' : template!.name}
    kicker="SAVED ROUTINES" subtitle="Templates store the exercise order only." back>
    {!starting && <Notice message={error} error />}
    {editing && <Field label="Template name" defaultValue={name} onChangeText={setName} placeholder="e.g. Leg Day" autoCapitalize="words" />}
    {!editing && template && <SyncLabel root={template} />}
    {!exercises.length && <Empty title="No exercises selected" detail="Add exercises in the order you want them to appear." />}
    {exercises.map((id, i) => <Card key={id + ':' + i}>
      <Txt variant="strong">{i + 1}. {lookup(id)?.name ?? 'Exercise unavailable'}</Txt>
      {lookup(id)?.archived && <Txt color={c.warning}>Archived · Can be skipped during the workout</Txt>}
      {editing && <Row>
        {i > 0 && <Button label={'Move ' + (i + 1) + ' up'} compact tone="secondary" onPress={() => move(i, -1)} />}
        {i < exercises.length - 1 && <Button label={'Move ' + (i + 1) + ' down'} compact tone="secondary" onPress={() => move(i, 1)} />}
        <Button label={'Remove ' + (i + 1)} compact tone="quiet" onPress={() => setList(list.filter((_, n) => n !== i))} />
      </Row>}
    </Card>)}
    {editing ? <>
      <Button label="Add exercise" icon="add" tone="secondary" onPress={() => setPicking(true)} />
      <Button label="Save template" onPress={() => run(() => {
        save({ kind: 'template', id: template?.id ?? randomUUID(), name: name.trim(), exercises: list,
          workoutId: template?.workoutId ?? source?.id, copyOf: template?.copyOf }, base, new Set(source?.entries.map(e => e.exerciseId)));
        if (!template) router.back(); else setEditing(false);
      })} />
      {!!template && <Button label="Cancel changes" tone="quiet" onPress={() => { setEditing(false); setError(''); }} />}
    </> : <>
      <Button label="Start from this template" icon="play" onPress={() => { setError(''); setDate(dateKey()); setStarting(true); }} />
      <Button label="Edit template" tone="secondary" onPress={() => {
        setBase(template); setName(template!.name); setList(template!.exercises); setEditing(true);
      }} />
      <Button label="Delete template" tone="danger" onPress={() =>
        confirm('Delete ' + template!.name + '?', 'This removes the exercise list. Recorded workouts stay in your log.', 'Delete template',
          () => run(() => { save({ ...template!, deleted: true }, template); router.back(); }))} />
    </>}
    {starting && <Sheet title={active ? 'An unfinished workout exists' : 'Start ' + template!.name} onClose={() => setStarting(false)}>
      {active ? <>
        <Txt>Resume the current session or discard it before starting from this template.</Txt>
        <Button label="Resume workout" onPress={() => { setStarting(false); open(active.id, false); }} />
        <Button label="Discard unfinished workout" tone="danger" onPress={() =>
          confirm('Discard unfinished workout?', 'Its sets will be removed.', 'Discard workout', () =>
            run(() => save({ ...active, deleted: true }, active)))} />
      </> : <>
        <DateField label="Workout date" value={date} onChange={setDate} />
        {exercises.some(id => lookup(id)?.archived) && <Txt color={c.warning}>Archived entries are marked in the workout so you can skip them.</Txt>}
        <Button label="Start workout" onPress={() => run(() => {
          const workout = { ...newWorkout(randomUUID, date, template!.exercises), templateId: template!.id };
          save(workout, undefined, new Set(template!.exercises));
          setStarting(false); open(workout.id);
        })} />
      </>}
      <Notice message={error} error />
    </Sheet>}
    {picking && <ExercisePicker onPick={add} onClose={() => setPicking(false)}
      onCreate={() => { setPicking(false); setCreating(true); }} />}
    {creating && <ExerciseForm onDone={add} onClose={() => { setCreating(false); setPicking(true); }} />}
  </Page>;
}
