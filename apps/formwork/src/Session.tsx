import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Check, Dumbbell, Plus, Timer } from 'lucide-react-native';
import { useApp } from './state';
import { newId } from './repository';
import { ExerciseList } from './ExercisePicker';
import { PlanEditor, RoutineEditor } from './Routines';
import { SetEditor } from './SetEditor';
import { clock } from './device';
import { totals } from './analytics';
import {
  Actual, Change, Entry, Exercise, Rest, Routine, SetRow, Workout, actualLabel, afterRemoval,
  changeRow, confirmed, convert, displayNumber, finishWorkout, lastWorkout, pending, phaseName, prettyDay, remaining,
  restAfter, setActual, targetLabel, validateDay, working,
} from './model';
import {
  Badge, Button, DayField, Empty, ErrorNote, Header, Item, Kicker, Page, Sheet, T, c, confirm, s, useAction,
} from './ui';

type Editor = { entry: Entry; row?: SetRow };
const phases = ['warmup', 'prep', 'work', 'cooldown'] as const;
const startLabel = (w: Workout) => w.routine ?? 'Ad hoc workout';
const elapsed = (w: Workout) => {
  const seconds = Math.max(0, Math.floor(((w.finished ?? Date.now()) - w.started) / 1000));
  return seconds < 60 ? seconds + ' sec' : Math.floor(seconds / 60) + ' min';
};

export default function SessionScreen() {
  const { id, setId } = useLocalSearchParams<{ id: string; setId?: string }>();
  const router = useRouter();
  const app = useApp();
  const workout = app.workouts.find(w => w.id === id);
  const [editing, setEditing] = useState(false);
  const [dateEditor, setDateEditor] = useState(false);
  const [date, setDate] = useState('');
  const [picking, setPicking] = useState<'work' | 'prep'>();
  const [prepExercise, setPrepExercise] = useState<Exercise>();
  const [editor, setEditor] = useState<Editor>();
  const [rowMenu, setRowMenu] = useState<Editor>();
  const [info, setInfo] = useState<Exercise>();
  const [routine, setRoutine] = useState<Routine>();
  const [undo, setUndo] = useState<Workout>();
  const [note, setNote] = useState('');
  const [now, setNow] = useState(Date.now);
  const action = useAction();
  const lastUndo = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (lastUndo.current) clearTimeout(lastUndo.current); }, []);
  useEffect(() => {
    if (!app.rest) return;
    setNow(Date.now());
    const timer = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(timer);
  }, [app.rest]);

  function goBack() { if (router.canGoBack()) router.back(); else router.replace('/'); }
  if (!workout) return <Page><Header title="Workout unavailable" subtitle="The record may have been deleted or is still syncing." back={goBack} /></Page>;

  const w = workout;
  const active = w.state === 'active';
  const editable = active || editing;
  const tally = totals([w], app.settings.unit);
  const alternate = app.settings.unit === 'kg' ? 'lb' : 'kg';
  const rest = app.rest?.workoutId === w.id ? app.rest : null;
  const restSeconds = rest ? remaining(rest, now) : 0;
  const focusedSet = setId ? confirmed(w).find(row => row.id === setId) : undefined;

  function save(next: Workout, nextRest?: Rest | null, extra: Change[] = []) {
    const invalidSource = rest && !next.entries.some(e => e.sets.some(row => row.id === rest.setId && row.state === 'done'));
    app.save([...extra, { kind: 'workout', id: next.id, value: next }], invalidSource ? null : nextRest);
    setUndo(undefined);
    setNote('');
  }
  function remove(next: Workout) {
    save(afterRemoval(next));
    if (active) {
      setUndo(w);
      if (lastUndo.current) clearTimeout(lastUndo.current);
      lastUndo.current = setTimeout(() => setUndo(undefined), 15000);
    }
  }
  function previous(entry: Entry) {
    const prior = lastWorkout(app.finished, entry.exerciseId, w.date, w.id);
    return { prior, actuals: prior ? working(prior).filter(x => x.entry.exerciseId === entry.exerciseId).map(x => x.actual) : [] };
  }
  function saveSet(selection: Editor, actual: Actual) {
    const ex = app.exercise(selection.entry.exerciseId);
    if (!ex) throw Error('This exercise is unavailable.');
    const entry = selection.entry;
    const rowId = selection.row?.id ?? newId();
    let next: Workout = w;
    if (!selection.row) {
      const inserted: SetRow = { id: rowId, state: 'pending' };
      next = { ...w, entries: w.entries.some(e => e.id === entry.id)
        ? w.entries.map(e => e.id === entry.id ? { ...e, sets: [...e.sets, inserted] } : e)
        : [...w.entries, { ...entry, sets: [inserted] }] };
    }
    next = setActual(next, entry.id, rowId, actual, ex.kind);
    const committed = next.entries.find(e => e.id === entry.id)!;
    const nextRest = active && entry.phase === 'work' && selection.row?.state !== 'done'
      ? restAfter(next, committed, rowId) : undefined;
    const extra: Change[] = ex.custom && !ex.used ? [{ kind: 'exercise', id: ex.id, value: { ...ex, used: true } }] : [];
    save(next, nextRest, extra);
    setEditor(undefined);
  }
  function finish() {
    if (!working(w).length) return action.setError('Complete at least one working set before finishing.');
    const complete = () => action.run(() => {
      const removed = w.entries.filter(e => !e.sets.length).length;
      save(finishWorkout(w, true), null);
      setEditing(false);
      setNote(removed ? `Workout saved. ${removed} empty ${removed === 1 ? 'entry was' : 'entries were'} removed.` : 'Workout saved.');
    });
    const count = pending(w);
    if (count) confirm('Finish this workout?', `${count} pending ${count === 1 ? 'set will' : 'sets will'} be marked skipped.`, 'Finish workout', complete);
    else complete();
  }
  function pick(ex: Exercise) {
    const phase = picking === 'prep' ? 'prep' : 'work';
    setPicking(undefined);
    if (phase === 'prep') { setPrepExercise(ex); return; }
    const entry: Entry = { id: newId(), exerciseId: ex.id, phase, sets: [] };
    if (active) action.run(() => save({ ...w, entries: [...w.entries, entry] }));
    else setEditor({ entry });
  }
  function prepareRoutine(copyLoads: boolean) {
    setRoutine({
      id: newId(), name: w.routine ? w.routine + ' copy' : '', rest: w.rest || 90,
      entries: w.entries.flatMap(entry => {
        const ex = app.exercise(entry.exerciseId);
        if (!ex) return [];
        const planned = entry.sets.find(row => row.target)?.target;
        const actual = entry.sets.find(row => row.state === 'done')?.actual;
        const fromActual = copyLoads && actual ? {
          reps: actual.reps, seconds: actual.seconds, weight: actual.weight, unit: actual.unit, rirMin: actual.rir, rirMax: actual.rir,
        } : undefined;
        const target = fromActual ?? planned;
        return [{ exerciseId: ex.id, phase: entry.phase, count: target ? Math.min(30, entry.sets.length) : 0, target, rest: entry.rest }];
      }),
    });
  }
  function saveRest(next: Rest | null) {
    action.run(() => { app.save([], next); setNow(Date.now()); setUndo(undefined); });
  }
  return <Page key={w.state}>
    <Header eyebrow={active ? 'ACTIVE WORKOUT' : editing ? 'CORRECT YOUR LOG' : 'WORKOUT SUMMARY'}
      title={startLabel(w)} subtitle={`${prettyDay(w.date)} · ${active ? 'In progress' : elapsed(w)}`} back={goBack} />
    <View style={s.wrap}><Badge label={app.statusFor(w.id)} color={c.green} />
      {!active ? <Badge label={editing ? 'Editing' : 'Finished'} /> : null}</View>
    <View style={[s.panel, { backgroundColor: c.olive }]}>
      <Kicker color={c.green}>{active ? 'SESSION TOTALS' : 'TRAINING TOTALS'}</Kicker>
      <View style={s.wrap}>
        <View style={{ flexBasis: 115, flexGrow: 1 }}><T kind="metric">{tally.sets}</T><T color={c.muted}>Working sets</T></View>
        <View style={{ flexBasis: 115, flexGrow: 1 }}><T kind="metric">{displayNumber(tally.volume)}</T>
          <T color={c.muted}>Volume · {app.settings.unit} × reps</T>
          {app.settings.both ? <T kind="small" color={c.muted}>{displayNumber(convert(tally.volume, app.settings.unit, alternate))} {alternate} × reps</T> : null}</View>
      </View>
      <T kind="small" color={c.muted}>{w.entries.length} exercise entries · {confirmed(w).length} total confirmed sets
        {active ? ` · ${pending(w)} pending` : ` · ${w.entries.flatMap(e => e.sets).filter(row => row.state === 'skipped').length} skipped`}</T>
    </View>
    {focusedSet?.actual ? <View style={s.panel}><Kicker>SELECTED SET</Kicker><T>{actualLabel(focusedSet.actual, app.settings)}</T></View> : null}
    {rest ? <View style={[s.panel, { borderColor: '#756248' }]}>
      <View style={s.row}><Timer color={c.accent} size={21} /><Kicker>BETWEEN SETS</Kicker></View>
      <T kind="title">{restSeconds ? clock(restSeconds) : 'Rest complete'}</T>
      {restSeconds ? <View style={s.wrap}>
        <Button compact label={rest.deadline ? 'Pause rest' : 'Resume rest'} onPress={() => saveRest(rest.deadline
          ? { ...rest, deadline: undefined, remaining: remaining(rest) }
          : { ...rest, remaining: undefined, deadline: Date.now() + restSeconds * 1000 })} />
        <Button compact label="+ 15 sec" onPress={() => saveRest(rest.deadline
          ? { ...rest, deadline: rest.deadline + 15000 } : { ...rest, remaining: restSeconds + 15 })} />
        <Button compact label="Skip rest" tone="quiet" onPress={() => saveRest(null)} />
      </View> : <Button compact label="Dismiss timer" onPress={() => saveRest(null)} />}
    </View> : null}
    {note ? <T color={c.green} accessibilityLiveRegion="polite">{note}</T> : null}
    {undo ? <View style={s.panel}><T>Removed from this workout.</T><Button label="Undo removal" onPress={() => action.run(() => save(undo))} /></View> : null}
    <ErrorNote message={action.error} />
    {editable ? <View style={s.wrap}>
      <Button label="Change date" compact onPress={() => { setDate(w.date); setDateEditor(true); }} />
      <Button label="Add exercise" compact icon={<Plus color={c.accent} size={17} />} onPress={() => setPicking('work')} />
      {active ? <Button label="Add prep or mobility" compact onPress={() => setPicking('prep')} /> : null}
    </View> : <Button label="Edit workout" onPress={() => setEditing(true)} />}
    {!w.entries.length ? <Empty title="No exercises yet" detail="Add an exercise to record your first set." /> : null}

    {phases.map(phase => {
      const entries = w.entries.filter(e => e.phase === phase);
      return entries.length ? <View key={phase} style={{ gap: 12 }}>
        <Kicker>{phaseName[phase]}</Kicker>
        {entries.map(entry => {
          const ex = app.exercise(entry.exerciseId);
          const prior = previous(entry);
          return <View key={entry.id} style={s.panel}>
            <Item title={ex?.name ?? 'Exercise unavailable'} subtitle={ex?.archived ? 'Archived exercise' : undefined}
              lead={<Dumbbell color={c.accent} size={20} />} onPress={() => router.push({ pathname: '/exercise/[id]', params: { id: entry.exerciseId } })} />
            {editable ? <View style={{ backgroundColor: c.raised, borderRadius: 12, padding: 10, gap: 4 }}>
              <Kicker color={c.muted}>{prior.prior ? `LAST TIME · ${prettyDay(prior.prior.date)}` : 'NO PREVIOUS RECORD'}</Kicker>
              {prior.actuals.map((a, i) => <T key={i} kind="small">{actualLabel(a, app.settings)}</T>)}
            </View> : null}
            {phase !== 'work' && ex?.instructions.length ? <Button label="Movement instructions" compact tone="quiet" onPress={() => setInfo(ex)} /> : null}
            {entry.sets.map((row, index) => <View key={row.id} style={s.column}>
              <View style={s.rule} />
              <View style={s.spread}>
                <T kind="label" style={s.flex}>Set {index + 1}</T>
                <Badge label={row.state === 'done' ? 'Done' : row.state === 'skipped' ? 'Skipped' : 'Pending'} color={row.state === 'done' ? c.green : c.muted} />
              </View>
              {row.target ? <T kind="small" color={c.muted}>Target · {targetLabel(row.target)}</T> : null}
              {row.actual ? <T>{actualLabel(row.actual, app.settings)}</T> : null}
              {editable && ex ? <View style={s.wrap}>
                <Button label={row.state === 'done' ? 'Edit set' : 'Enter actuals'} compact onPress={() => setEditor({ entry, row })} />
                <Button label="Set options" compact tone="quiet" onPress={() => setRowMenu({ entry, row })} />
              </View> : null}
            </View>)}
            {editable && ex ? <View style={s.wrap}>
              <Button label="Add set" compact onPress={() => setEditor({ entry })} />
              <Button label="Remove exercise" compact tone="danger" onPress={() =>
                confirm('Remove exercise?', 'All sets in this workout entry will be removed.', 'Remove exercise', () =>
                  action.run(() => remove({ ...w, entries: w.entries.filter(e => e.id !== entry.id) })))} />
            </View> : null}
          </View>;
        })}
      </View> : null;
    })}

    {active ? <>
      <Button label="Finish workout" tone="primary" icon={<Check color={c.ink} size={19} />} onPress={finish} />
      <Button label="Discard workout" tone="danger" onPress={() =>
        confirm('Discard this workout?', 'The active session and all its sets will be removed.', 'Discard', () => action.run(() => {
          app.save([{ kind: 'workout', id: w.id, value: null }], null); goBack();
        }))} />
    </> : editing ? <Button label="Done editing" tone="primary" onPress={() => setEditing(false)} /> : <>
      <View style={s.panel}><Kicker>REPEAT THIS SESSION</Kicker>
        <Button label="Save as routine" onPress={() => prepareRoutine(false)} />
        <Button label="Use recorded loads and RIR as targets" tone="quiet" onPress={() => prepareRoutine(true)} />
      </View>
      <Button label="Delete workout" tone="danger" onPress={() => confirm('Delete workout?', `${prettyDay(w.date)} · ${confirmed(w).length} completed sets will be removed.`,
        'Delete workout', () => action.run(() => { app.save([{ kind: 'workout', id: w.id, value: null }]); goBack(); }))} />
    </>}

    {dateEditor ? <Sheet title="Change workout date" onClose={() => setDateEditor(false)}>
      <DayField label="Workout date" value={date} onChange={setDate} />
      <ErrorNote message={action.error} />
      <Button label="Save date" tone="primary" onPress={() => action.run(() => { validateDay(date); save({ ...w, date }); setDateEditor(false); })} />
    </Sheet> : null}
    {picking ? <Sheet title={picking === 'prep' ? 'Find a preparation movement' : 'Add exercise'} onClose={() => setPicking(undefined)}>
      <ExerciseList picking preset={picking === 'prep' ? 'stretching' : undefined} onSelect={pick} />
    </Sheet> : null}
    {prepExercise ? <Sheet title="Add a preparation step" onClose={() => setPrepExercise(undefined)}>
      <PlanEditor exercise={prepExercise} preferred={app.settings.unit} plan={{ exerciseId: prepExercise.id, count: 1, phase: 'prep',
        target: prepExercise.kind === 'time' ? { seconds: 30 } : { reps: 10 } }}
        onSave={plan => action.run(() => {
          const entry: Entry = { id: newId(), exerciseId: prepExercise.id, phase: plan.phase, rest: plan.rest,
            sets: Array.from({ length: plan.count }, () => ({ id: newId(), state: 'pending', target: plan.target })) };
          save({ ...w, entries: [...w.entries, entry] }); setPrepExercise(undefined);
        })} />
      <ErrorNote message={action.error} />
    </Sheet> : null}
    {editor && app.exercise(editor.entry.exerciseId) ? <SetEditor exercise={app.exercise(editor.entry.exerciseId)!}
      row={editor.row} settings={app.settings} movementTimer={editor.entry.phase !== 'work'}
      suggested={editor.entry.sets.slice(0, editor.row ? editor.entry.sets.findIndex(row => row.id === editor.row?.id) : undefined)
        .filter(row => row.state === 'done').at(-1)?.actual ?? previous(editor.entry).actuals.at(-1)}
      onSave={actual => saveSet(editor, actual)} onClose={() => setEditor(undefined)} /> : null}
    {rowMenu?.row ? <Sheet title="Set options" onClose={() => setRowMenu(undefined)}>
      {active ? <Button label={rowMenu.row.state === 'pending' ? 'Skip set' : rowMenu.row.state === 'done' ? 'Undo completion' : 'Make pending'}
        onPress={() => action.run(() => {
          const row = rowMenu.row!;
          save(changeRow(w, rowMenu.entry.id, row.id, r => ({ ...r, actual: undefined, state: r.state === 'pending' ? 'skipped' : 'pending' })));
          setRowMenu(undefined);
        })} /> : null}
      <Button label="Remove set" tone="danger" onPress={() => confirm('Remove this set?', 'This set will be removed from the workout.', 'Remove set', () =>
        action.run(() => {
          remove({ ...w, entries: w.entries.map(e => e.id === rowMenu.entry.id ? { ...e, sets: e.sets.filter(row => row.id !== rowMenu.row?.id) } : e) });
          setRowMenu(undefined);
        }))} />
      <ErrorNote message={action.error} />
    </Sheet> : null}
    {info ? <Sheet title={info.name} onClose={() => setInfo(undefined)}>
      {info.instructions.map((step, i) => <T key={i}>{i + 1}. {step}</T>)}
    </Sheet> : null}
    {routine ? <RoutineEditor routine={routine} onClose={() => setRoutine(undefined)} /> : null}
  </Page>;
}
