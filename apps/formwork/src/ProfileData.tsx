import { useState } from 'react';
import { Switch, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Directory, File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { bestForGoal, earliestDate, exportReadings, exportReports, exportSets, inRange, milestones, reportWindows, totals } from './analytics';
import { Exercise, Goal, Reading, Unit, WeightTarget, actualLabel, bounded, convert, dateKey, daysFrom,
  displayNumber, numeric, parseDay, prettyDay, validateDay, whole } from './model';
import { useApp } from './state';
import { newId } from './repository';
import { ExerciseList } from './ExercisePicker';
import { UnitChips } from './Routines';
import { Trend } from './Charts';
import { Badge, Button, Chip, DayField, Empty, ErrorNote, Item, Kicker, NumberField, Sheet, T, c, confirm, s, useAction } from './ui';

export function Report() {
  const app = useApp();
  const router = useRouter();
  const today = dateKey();
  const [month, setMonth] = useState(today.slice(0, 7));
  const dates = reportWindows(month, today);
  const focus = app.finished.filter(w => inRange(w.date, dates.from, dates.to));
  const comparison = app.finished.filter(w => inRange(w.date, dates.priorFrom, dates.priorTo));
  const current = totals(focus, app.settings.unit), prior = totals(comparison, app.settings.unit);
  const label = parseDay(month + '-01').toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  function move(delta: number) {
    const date = parseDay(month + '-01'); date.setMonth(date.getMonth() + delta); setMonth(dateKey(date).slice(0, 7));
  }
  return <View style={s.column}>
    <View style={s.panel}>
      <Kicker>MONTHLY REPORT</Kicker><T kind="title">{label}</T>
      {dates.partial ? <Badge label="In progress" color={c.green} /> : null}
      <View style={s.wrap}><Button label="Previous month" compact onPress={() => move(-1)} />
        <Button label="Next month" compact disabled={month === today.slice(0, 7)} onPress={() => move(1)} /></View>
      <T kind="small" color={c.muted}>{prettyDay(dates.from)} to {prettyDay(dates.to)}</T>
      <T kind="small" color={c.muted}>Compared with {prettyDay(dates.priorFrom)} to {prettyDay(dates.priorTo)}</T>
    </View>
    {!focus.length ? <Empty title="No sessions in this period" detail="Finished workouts in this month will populate your report." /> : null}
    <View style={s.panel}>
      <Kicker>CURRENT / PREVIOUS</Kicker>
      {([
        ['Completed sessions', 'sessions'], ['Working sets', 'sets'], [`Weighted volume · ${app.settings.unit} × reps`, 'volume'],
        ['Reps-only repetitions', 'reps'], ['Timed work · seconds', 'seconds'],
      ] as const).map(([text, key]) => <View key={key} style={s.spread}><T style={s.flex}>{text}</T>
        <T kind="label">{displayNumber(current[key])} / {displayNumber(prior[key])}</T></View>)}
    </View>
    {milestones(focus, app.settings.unit).length ? <View style={s.panel}>
      <Kicker>MONTHLY LIFT HIGHLIGHTS</Kicker>
      {milestones(focus, app.settings.unit).map(([id, best]) => <Item key={id} title={app.exercise(id)?.name ?? 'Exercise'}
        subtitle={`${displayNumber(best.weight)} ${app.settings.unit} × ${best.reps} reps`}
        onPress={() => router.push({ pathname: '/session/[id]', params: { id: best.workout.id, setId: best.setId } })} />)}
    </View> : null}
  </View>;
}

export function Goals() {
  const app = useApp();
  const router = useRouter();
  const [edit, setEdit] = useState<Goal | 'new'>();
  return <View style={s.column}>
    <Button label="New lift goal" tone="primary" onPress={() => setEdit('new')} />
    {!app.goals.length ? <Empty title="No lift goals" detail="Choose a weighted exercise and a minimum rep count." /> : null}
    {app.goals.map(goal => {
      const best = bestForGoal(goal, app.finished);
      const reached = !!best && best.load >= goal.weight;
      return <View key={goal.id} style={s.panel}>
        <T kind="sub">{app.exercise(goal.exerciseId)?.name ?? 'Exercise'}</T>
        <T>{goal.weight} {goal.unit} × {goal.reps} reps or more</T>
        {goal.deadline ? <T color={c.muted}>Target date · {prettyDay(goal.deadline)}</T> : null}
        <Badge label={reached ? 'Target reached' : best ? `${Math.floor(100 * best.load / goal.weight)}% of target` : 'No qualifying set'} color={reached ? c.green : c.accent} />
        {best?.set.actual ? <Item title="Best qualifying set" subtitle={actualLabel(best.set.actual, app.settings)}
          onPress={() => router.push({ pathname: '/session/[id]', params: { id: best.workout.id, setId: best.set.id } })} /> : null}
        <Button label="Edit goal" compact onPress={() => setEdit(goal)} />
      </View>;
    })}
    {edit ? <GoalEditor goal={edit === 'new' ? undefined : edit} onClose={() => setEdit(undefined)} /> : null}
  </View>;
}

function GoalEditor({ goal, onClose }: { goal?: Goal; onClose: () => void }) {
  const app = useApp();
  const [exercise, setExercise] = useState<Exercise | undefined>(goal ? app.exercise(goal.exerciseId) : undefined);
  const [picking, setPicking] = useState(false);
  const [weight, setWeight] = useState(goal?.weight.toString() ?? '');
  const [unit, setUnit] = useState(goal?.unit ?? app.settings.unit);
  const [reps, setReps] = useState(goal?.reps.toString() ?? '');
  const [deadline, setDeadline] = useState(goal?.deadline ?? '');
  const action = useAction();
  function save() {
    if (!exercise || exercise.kind !== 'load') throw Error('Choose a weighted exercise.');
    if (!bounded(numeric(weight), 0.001, 999.9) || !whole(numeric(reps), 1, 999)) throw Error('Enter a positive load and whole reps between 1 and 999.');
    if (deadline) validateDay(deadline, true);
    const id = goal?.id ?? newId();
    app.save([{ kind: 'goal', id, value: { id, exerciseId: exercise.id, weight: numeric(weight), unit, reps: numeric(reps), deadline: deadline || undefined } }]);
    onClose();
  }
  return <Sheet title={picking ? 'Choose a weighted exercise' : goal ? 'Edit lift goal' : 'New lift goal'} onClose={() => picking ? setPicking(false) : onClose()}>
    {picking ? <ExerciseList picking filter={ex => ex.kind === 'load'} onSelect={ex => { setExercise(ex); setPicking(false); }} /> : <>
      <Button label={exercise?.name ?? 'Choose exercise'} onPress={() => setPicking(true)} />
      <NumberField label={`Target weight (${unit})`} value={weight} onChangeText={setWeight} decimal />
      <UnitChips unit={unit} onChange={next => convertField(weight, unit, next, setUnit, setWeight, action.setError)} />
      <NumberField label="Minimum reps" value={reps} onChangeText={setReps} />
      <DayField label="Deadline (optional)" value={deadline} onChange={setDeadline} optional future />
      <ErrorNote message={action.error} />
      <Button label="Save goal" tone="primary" onPress={() => action.run(save)} />
      {goal ? <Button label="Delete goal" tone="danger" onPress={() => confirm('Delete goal?', 'The goal will be removed from your profile.', 'Delete goal', () =>
        action.run(() => { app.save([{ kind: 'goal', id: goal.id, value: null }]); onClose(); }))} /> : null}
    </>}
  </Sheet>;
}

function convertField(weight: string, unit: Unit, next: Unit, setUnit: (u: Unit) => void, setWeight: (w: string) => void, error: (s: string) => void) {
  if (unit === next) return;
  if (weight.trim()) {
    const result = convert(numeric(weight), unit, next);
    if (!bounded(result, 0.001, 999.9)) { error('The converted weight is outside the allowed range.'); return; }
    setWeight(String(Number(result.toFixed(4))));
  }
  setUnit(next);
  error('');
}

export function Bodyweight() {
  const app = useApp();
  const [edit, setEdit] = useState<Reading | 'new' | 'target'>();
  const points = [...app.readings].reverse().map(r => ({ id: r.id, date: r.date, value: convert(r.weight, r.unit, app.settings.unit), workouts: [] }));
  return <View style={s.column}>
    <T color={c.muted}>Bodyweight is optional and stored separately from your lifts.</T>
    <View style={s.wrap}><Button label="Log bodyweight" tone="primary" onPress={() => setEdit('new')} />
      <Button label={app.target ? 'Edit target' : 'Set target'} onPress={() => setEdit('target')} /></View>
    {app.target ? <View style={s.panel}><Kicker>TARGET</Kicker>
      <T kind="sub">{displayNumber(convert(app.target.weight, app.target.unit, app.settings.unit))} {app.settings.unit}</T>
      {app.target.date ? <T color={c.muted}>By {prettyDay(app.target.date)}</T> : null}</View> : null}
    <Trend points={points} unit={app.settings.unit} label="Bodyweight trend" sparse="Add two readings to see a trend."
      open={p => setEdit(app.readings.find(r => r.id === p.id))} />
    {edit ? <WeightEditor reading={typeof edit === 'object' ? edit : undefined} target={edit === 'target'}
      onClose={() => setEdit(undefined)} /> : null}
  </View>;
}

function WeightEditor({ reading, target, onClose }: { reading?: Reading; target: boolean; onClose: () => void }) {
  const app = useApp();
  const existing = target ? app.target : reading;
  const [weight, setWeight] = useState(existing?.weight.toString() ?? '');
  const [unit, setUnit] = useState(existing?.unit ?? app.settings.unit);
  const [date, setDate] = useState(existing?.date ?? (target ? '' : dateKey()));
  const action = useAction();
  function save() {
    if (!bounded(numeric(weight), 0.001, 999.9)) throw Error('Enter a positive weight up to 999.9.');
    if (!target || date) validateDay(date, target);
    if (target) {
      const value: WeightTarget = { id: 'weight-target', date: date || undefined, weight: numeric(weight), unit };
      app.save([{ kind: 'weightTarget', id: value.id, value }]);
    } else {
      const id = reading?.id ?? newId();
      app.save([{ kind: 'reading', id, value: { id, date, weight: numeric(weight), unit } }]);
    }
    onClose();
  }
  return <Sheet title={target ? 'Bodyweight target' : reading ? 'Edit reading' : 'Log bodyweight'} onClose={onClose}>
    <NumberField label={`Weight (${unit})`} value={weight} onChangeText={setWeight} decimal />
    <UnitChips unit={unit} onChange={next => convertField(weight, unit, next, setUnit, setWeight, action.setError)} />
    <DayField label={target ? 'Target date (optional)' : 'Reading date'} value={date} onChange={setDate} future={target} optional={target} />
    <ErrorNote message={action.error} />
    <Button label={target ? 'Save target' : 'Save reading'} tone="primary" onPress={() => action.run(save)} />
    {existing ? <Button label={target ? 'Delete target' : 'Delete reading'} tone="danger" onPress={() =>
      confirm(target ? 'Delete target?' : 'Delete reading?', 'This value will be removed from your bodyweight records.', 'Delete', () => action.run(() => {
        app.save([target ? { kind: 'weightTarget', id: existing.id, value: null } : { kind: 'reading', id: existing.id, value: null }]); onClose();
      }))} /> : null}
  </Sheet>;
}

export function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return <View style={{ ...s.spread, minHeight: 44 }}><T style={s.flex}>{label}</T>
    <Switch accessibilityLabel={label} value={value} onValueChange={onChange} trackColor={{ true: '#786240', false: c.rule }} /></View>;
}

export function ExportData() {
  const app = useApp();
  const [range, setRange] = useState('Last 30 days');
  const [from, setFrom] = useState(daysFrom(-29));
  const [to, setTo] = useState(dateKey());
  const [sets, setSets] = useState(true);
  const [reports, setReports] = useState(false);
  const [readings, setReadings] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState('');
  async function share(name: string) {
    if (busy) return;
    setBusy(name); setError('');
    let directory: Directory | undefined;
    try {
      const today = dateKey();
      const start = range === 'Custom' ? from : range === 'All time' ? earliestDate(app.finished, readings ? app.readings : []) : daysFrom(-29);
      const end = range === 'Custom' ? to : today;
      validateDay(start); validateDay(end);
      if (start > end) throw Error('Choose an end date on or after the start date.');
      if (!await Sharing.isAvailableAsync()) throw Error('System sharing is unavailable on this device.');
      const content = name === 'workout_sets.csv' ? exportSets(app.finished, app.exercise, start, end)
        : name === 'monthly_progress.csv' ? exportReports(app.finished, start, end) : exportReadings(app.readings, start, end);
      directory = new Directory(Paths.cache, 'formwork-export-' + newId());
      directory.create();
      const file = new File(directory, name);
      file.create();
      file.write(content);
      await Sharing.shareAsync(file.uri, { mimeType: 'text/csv', UTI: 'public.comma-separated-values-text' });
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Export failed.'); }
    finally { try { directory?.delete(); } catch {} setBusy(''); }
  }
  return <View style={s.column}>
    <T color={c.muted}>Generate CSV files from this journal. Choose a destination for each file in the system share sheet.</T>
    {app.queued.length || app.conflicts.length ? <Badge label="Export includes local changes awaiting sync" /> : null}
    <View style={s.wrap}>{['Last 30 days', 'All time', 'Custom'].map(p => <Chip key={p} label={p} selected={p === range} onPress={() => setRange(p)} />)}</View>
    {range === 'Custom' ? <View style={s.panel}><DayField label="From" value={from} onChange={setFrom} />
      <DayField label="Through" value={to} onChange={setTo} /></View> : null}
    <View style={s.panel}>
      <Toggle label="Workout sets" value={sets} onChange={setSets} />
      <Toggle label="Monthly reports" value={reports} onChange={setReports} />
      <Toggle label="Include bodyweight" value={readings} onChange={setReadings} />
    </View>
    <ErrorNote message={error} />
    {sets ? <Button label="Share workout_sets.csv" disabled={!!busy} onPress={() => void share('workout_sets.csv')} /> : null}
    {reports ? <Button label="Share monthly_progress.csv" disabled={!!busy} onPress={() => void share('monthly_progress.csv')} /> : null}
    {readings ? <Button label="Share bodyweight.csv" disabled={!!busy} onPress={() => void share('bodyweight.csv')} /> : null}
    {!sets && !reports && !readings ? <T color={c.muted}>Select at least one file to export.</T> : null}
  </View>;
}
