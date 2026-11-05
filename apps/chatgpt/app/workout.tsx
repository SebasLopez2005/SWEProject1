import { randomUUID } from 'expo-crypto';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  allSets, exerciseSets, finishWorkout, formatDate, previous, setCount, setLabel, typeLabels, volume, weightLabel,
  type Entry, type Exercise, type TrainingSet, type Workout,
} from '../src/domain';
import { ExerciseForm, SetForm } from '../src/editors';
import { useApp } from '../src/session';
import { Button, Card, c, confirm, DateField, Empty, ExercisePicker, message, Notice, Page, Row, SyncLabel, Txt } from '../src/ui';

export default function WorkoutRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { model } = useApp();
  const workout = model!.workouts.find(w => w.id === id);
  return workout ? <WorkoutScreen key={workout.id} workout={workout} /> :
    <Page title="Workout unavailable" back><Empty title="This workout is unavailable" detail="It may have been removed. Return to your log." /></Page>;
}

function WorkoutScreen({ workout }: { workout: Workout }) {
  const router = useRouter();
  const { model, save } = useApp();
  const settings = model!.settings;
  const [base, setBase] = useState<Workout>();
  const [draft, setDraft] = useState<Workout>();
  const [undo, setUndo] = useState<Workout>();
  const [picking, setPicking] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<{ entryId: string; set?: TrainingSet; prefill?: TrainingSet }>();
  const [info, setInfo] = useState('');
  const [error, setError] = useState('');
  const current = draft ?? workout;
  const active = workout.state === 'active';
  const editing = active || !!draft;
  const lookup = (id: string) => model!.exercises.find(e => e.id === id);
  function attempt(work: () => void) {
    try { work(); setError(''); } catch (e) { setError('Not saved. ' + message(e)); }
  }
  function apply(next: Workout, removed = false) {
    if (draft) setDraft(next);
    else save(next, workout);
    setUndo(removed ? current : undefined);
    setError('');
    setInfo(active ? (removed ? 'Removed from this workout.' : '') : '');
  }
  function changeEntry(entry: Entry) {
    apply({ ...current, entries: current.entries.map(e => e.id === entry.id ? entry : e) });
  }
  function add(exercise: Exercise) {
    setPicking(false); setCreating(false);
    attempt(() => apply({ ...current, entries: [...current.entries, { id: randomUUID(), exerciseId: exercise.id, sets: [] }] }));
  }
  function remove(entry: Entry, set?: TrainingSet) {
    const subject = set ? 'set' : 'exercise';
    confirm('Remove ' + subject + '?', set ? 'Remove this set from the exercise.' : 'Remove this exercise and all its sets from the workout.',
      'Remove ' + subject, () => attempt(() => {
        const entries = set ? current.entries.map(e => e.id === entry.id ? { ...e, sets: e.sets.filter(s => s.id !== set.id) } : e)
          : current.entries.filter(e => e.id !== entry.id);
        apply({ ...current, entries }, true);
      }));
  }
  function finish() {
    attempt(() => {
      const result = finishWorkout(workout);
      save(result, workout);
      setUndo(undefined);
      const removed = workout.entries.length - result.entries.length;
      setInfo(removed ? 'Workout finished. ' + removed + (removed === 1 ? ' exercise had' : ' exercises had') + ' no sets and was removed from the summary.' : 'Workout finished and saved.');
    });
  }
  function saveCorrection() {
    attempt(() => {
      const entries = draft!.entries.filter(e => e.sets.length);
      save({ ...draft!, entries }, base);
      setDraft(undefined); setBase(undefined); setUndo(undefined);
      setInfo(entries.length === draft!.entries.length ? 'Changes saved.' : 'Changes saved. Empty exercises were removed.');
    });
  }
  const formEntry = current.entries.find(e => e.id === form?.entryId);
  const formExercise = formEntry && lookup(formEntry.exerciseId);
  return <Page title={active ? 'Active workout' : draft ? 'Edit workout' : 'Workout summary'} kicker="TRAINING LOG"
    subtitle={formatDate(current.date)} back>
    <Notice message={error} error />
    <Notice message={info} />
    {undo && <Button label="Undo removal" tone="secondary" icon="arrow-undo-outline" onPress={() => attempt(() => {
      if (draft) setDraft(undo);
      else save(undo, workout, new Set(undo.entries.map(e => e.exerciseId)));
      setUndo(undefined); setInfo('Removal undone.');
    })} />}
    {!active && !draft && <Card dark>
      <Txt variant="label" color={c.accent}>SESSION TOTALS</Txt>
      <Txt variant="h2" color={c.surface}>{workout.entries.length} {workout.entries.length === 1 ? 'exercise' : 'exercises'} · {setCount(workout)} {setCount(workout) === 1 ? 'set' : 'sets'}</Txt>
      <Txt color={c.onDark}>{workout.duration !== undefined
        ? 'Duration: ' + (workout.duration < 60 ? workout.duration + ' seconds' : Math.floor(workout.duration / 60) + ' minutes')
        : 'Duration unavailable for this session'}</Txt>
      <Txt color={c.onDark}>Total volume: {weightLabel(volume(allSets(workout), settings.unit), settings.unit, settings)}</Txt>
    </Card>}
    <SyncLabel root={workout} />
    {draft && <DateField label="Workout date" value={draft.date} onChange={date => { setDraft({ ...draft, date }); setUndo(undefined); }} />}
    {!current.entries.length && <Empty title="No exercises yet" detail="Add an exercise to start recording sets." icon="barbell-outline" />}
    {current.entries.map((entry, index) => {
      const exercise = lookup(entry.exerciseId);
      if (!exercise) return <Notice key={entry.id} message="An exercise is still waiting to sync." />;
      const last = previous(model!.workouts, exercise.id, workout.id);
      return <Card key={entry.id}>
        <Txt variant="label" color={c.green}>{String(index + 1).padStart(2, '0')} · {typeLabels[exercise.type].toUpperCase()}</Txt>
        <Txt variant="h2">{exercise.name}</Txt>
        {exercise.archived && <Txt color={c.warning}>Archived exercise</Txt>}
        {editing && <Txt variant="small" color={c.muted}>{last
          ? 'Previous · ' + formatDate(last.date) + '\n' + exerciseSets(last, exercise.id).map(s => setLabel(s, settings)).join(' / ')
          : 'No previous record'}</Txt>}
        {!entry.sets.length && <Txt color={c.muted}>No sets recorded.</Txt>}
        {entry.sets.map((set, i) => <Row key={set.id} between>
          <Txt style={{ flexShrink: 1 }}>Set {i + 1} · {setLabel(set, settings)}</Txt>
          {editing && <Row>
            <Button label={'Edit set ' + (i + 1)} tone="quiet" compact onPress={() => setForm({ entryId: entry.id, set })} />
            <Button label={'Remove set ' + (i + 1)} tone="quiet" compact onPress={() => remove(entry, set)} />
          </Row>}
        </Row>)}
        {editing && <Button label="Record set" icon="add" onPress={() => setForm({ entryId: entry.id,
          prefill: entry.sets.at(-1) ?? (last && exerciseSets(last, exercise.id).at(-1)) })} />}
        <Row>
          <Button label="Exercise history" tone="secondary" compact onPress={() => {
            setUndo(undefined); router.push({ pathname: '/exercise', params: { id: exercise.id } });
          }} />
          {editing && <Button label={exercise.archived ? 'Skip archived exercise' : 'Remove exercise'} compact tone="quiet" onPress={() => remove(entry)} />}
        </Row>
      </Card>;
    })}
    {editing && <Button label="Add exercise" icon="add" tone="secondary" onPress={() => setPicking(true)} />}
    {active ? <>
      <Button label="Finish workout" icon="checkmark-circle-outline" disabled={!setCount(workout)} onPress={finish} />
      <Button label="Discard workout" tone="danger" onPress={() => confirm('Discard this workout?', 'Recorded sets in this unfinished workout will be removed.',
        'Discard workout', () => attempt(() => { save({ ...workout, deleted: true }, workout); router.back(); }))} />
    </> : draft ? <>
      <Button label="Save changes" icon="checkmark" onPress={saveCorrection} />
      <Button label="Cancel changes" tone="quiet" onPress={() => { setDraft(undefined); setBase(undefined); setUndo(undefined); setError(''); }} />
    </> : <>
      <Button label="Save as template" icon="layers-outline" onPress={() => router.push({ pathname: '/template', params: { workoutId: workout.id } })} />
      <Button label="Edit workout" icon="create-outline" tone="secondary" onPress={() => { setDraft(workout); setBase(workout); setInfo(''); }} />
      <Button label="Delete workout" icon="trash-outline" tone="danger" onPress={() =>
        confirm('Delete ' + formatDate(workout.date) + '?', 'This permanently removes the workout and its ' + setCount(workout) + ' sets.',
          'Delete workout', () => attempt(() => { save({ ...workout, deleted: true }, workout); router.back(); }))} />
    </>}
    {picking && <ExercisePicker onPick={add} onClose={() => setPicking(false)}
      onCreate={() => { setPicking(false); setCreating(true); }} />}
    {creating && <ExerciseForm onDone={add} onClose={() => { setCreating(false); setPicking(true); }} />}
    {!!form && formEntry && formExercise && <SetForm exercise={formExercise} existing={form.set} prefill={form.prefill}
      onClose={() => setForm(undefined)} onSave={set => {
        changeEntry({ ...formEntry, sets: form.set ? formEntry.sets.map(s => s.id === set.id ? set : s) : [...formEntry.sets, set] });
        setForm(undefined);
      }} />}
  </Page>;
}
