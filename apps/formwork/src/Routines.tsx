import { useState } from 'react';
import { View } from 'react-native';
import { ArrowDown, ArrowUp, BookOpen, Plus, Trash2 } from 'lucide-react-native';
import { Exercise, Phase, Plan, Routine, Unit, bounded, kindName, numeric, phaseName, targetLabel, validateName, validatePlan, whole } from './model';
import { useApp } from './state';
import { newId } from './repository';
import { ExerciseList } from './ExercisePicker';
import { Badge, Button, Chip, ErrorNote, Field, IconButton, Kicker, NumberField, Sheet, T, c, confirm, s, useAction } from './ui';

export function RoutineEditor({ routine, onClose, onSave }: { routine?: Routine; onClose: () => void; onSave?: (r: Routine) => void }) {
  const app = useApp();
  const [name, setName] = useState(routine?.name ?? '');
  const [rest, setRest] = useState(String(routine?.rest ?? 90));
  const [entries, setEntries] = useState(routine?.entries ?? []);
  const [picking, setPicking] = useState(false);
  const [edit, setEdit] = useState<{ exercise: Exercise; index: number }>();
  const action = useAction();
  const reorder = (index: number, delta: number) => setEntries(current => {
    const next = [...current];
    [next[index], next[index + delta]] = [next[index + delta], next[index]];
    return next;
  });
  function save() {
    validateName(name, app.routines.some(r => r.id !== routine?.id && r.name.trim().toLowerCase() === name.trim().toLowerCase()), 'routine');
    if (!entries.length) throw Error('Add at least one exercise to the routine.');
    if (!whole(numeric(rest), 0, 1800)) throw Error('Default rest must be between 0 and 1,800 seconds.');
    for (const plan of entries) {
      const exercise = app.exercise(plan.exerciseId);
      if (!exercise) throw Error('An exercise is missing. Remove it before saving.');
      validatePlan(plan, exercise.kind);
    }
    const id = routine?.id ?? newId();
    const result = { id, name: name.trim(), rest: numeric(rest), entries };
    app.save([{ id, kind: 'routine', value: result }]);
    onSave?.(result);
    onClose();
  }
  return <Sheet title={picking ? 'Add an exercise' : edit ? 'Set targets' : routine && app.routines.some(r => r.id === routine.id) ? 'Edit routine' : 'New routine'}
    onClose={() => picking ? setPicking(false) : edit ? setEdit(undefined) : onClose()}>
    {picking ? <ExerciseList picking onSelect={exercise => { setPicking(false); setEdit({ exercise, index: entries.length }); }} />
      : edit ? <PlanEditor exercise={edit.exercise} plan={entries[edit.index]} preferred={app.settings.unit}
        onSave={plan => { setEntries(current => current.map((p, i) => i === edit.index ? plan : p).concat(edit.index === current.length ? [plan] : [])); setEdit(undefined); }} />
      : <>
        <Field label="Routine name" value={name} onChangeText={setName} placeholder="e.g. Upper body" maxLength={61} />
        <NumberField label="Default rest in seconds · 0 to disable" value={rest} onChangeText={setRest} />
        <Kicker>EXERCISE ORDER</Kicker>
        {entries.map((plan, index) => {
          const exercise = app.exercise(plan.exerciseId);
          return <View style={s.panel} key={index}>
            <View style={s.spread}><T kind="label" style={s.flex}>{index + 1}. {exercise?.name ?? 'Unavailable exercise'}</T>
              {exercise?.archived ? <Badge label="Archived" /> : null}</View>
            <T color={c.muted}>{phaseName[plan.phase]} · {plan.count ? `${plan.count} sets · ${targetLabel(plan.target)}` : 'Exercise only'}</T>
            <View style={s.wrap}>
              {exercise ? <Button label="Edit targets" compact onPress={() => setEdit({ exercise, index })} /> : null}
              {index > 0 ? <IconButton label="Move exercise up" onPress={() => reorder(index, -1)}><ArrowUp color={c.accent} size={18} /></IconButton> : null}
              {index < entries.length - 1 ? <IconButton label="Move exercise down" onPress={() => reorder(index, 1)}><ArrowDown color={c.accent} size={18} /></IconButton> : null}
              <IconButton label="Remove exercise from routine" onPress={() => setEntries(xs => xs.filter((_, i) => i !== index))}><Trash2 color={c.danger} size={18} /></IconButton>
            </View>
          </View>;
        })}
        <Button label="Add exercise" icon={<Plus color={c.accent} size={17} />} onPress={() => setPicking(true)} />
        <ErrorNote message={action.error} />
        <Button label="Save routine" tone="primary" onPress={() => action.run(save)} />
        {routine && app.routines.some(r => r.id === routine.id) ? <Button label="Delete routine" tone="danger" onPress={() =>
          confirm('Delete ' + routine.name + '?', 'Past workouts and their saved targets are kept.', 'Delete routine', () => action.run(() => {
            app.save([{ kind: 'routine', id: routine.id, value: null }]); onClose();
          }))} /> : null}
      </>}
  </Sheet>;
}

export function PlanEditor({ exercise, plan, preferred, onSave }: { exercise: Exercise; plan?: Plan; preferred: Unit; onSave: (plan: Plan) => void }) {
  const [phase, setPhase] = useState<Phase>(plan?.phase ?? (exercise.category === 'stretching' ? 'prep' : 'work'));
  const [count, setCount] = useState(String(plan?.count ?? 3));
  const [quantity, setQuantity] = useState(String(plan?.target?.seconds ?? plan?.target?.reps ?? (exercise.kind === 'time' ? 30 : 10)));
  const [load, setLoad] = useState(plan?.target?.weight?.toString() ?? '');
  const [unit, setUnit] = useState<Unit>(plan?.target?.unit ?? preferred);
  const [rirMin, setRirMin] = useState(plan?.target?.rirMin?.toString() ?? '');
  const [rirMax, setRirMax] = useState(plan?.target?.rirMax?.toString() ?? '');
  const [rest, setRest] = useState(plan?.rest?.toString() ?? '');
  const action = useAction();
  function save() {
    const n = numeric(count);
    const target = n === 0 ? undefined : {
      ...(exercise.kind === 'time' ? { seconds: numeric(quantity) } : { reps: numeric(quantity) }),
      ...(exercise.kind === 'load' && load.trim() ? { weight: numeric(load), unit } : {}),
      ...(exercise.kind !== 'time' && (rirMin.trim() || rirMax.trim()) ? { rirMin: numeric(rirMin), rirMax: numeric(rirMax) } : {}),
    };
    const value = { exerciseId: exercise.id, phase, count: n, target, rest: rest.trim() ? numeric(rest) : undefined };
    validatePlan(value, exercise.kind);
    onSave(value);
  }
  return <View style={s.column}>
    <T kind="sub">{exercise.name}</T><T color={c.muted}>{kindName[exercise.kind]}</T>
    {exercise.instructions.length && exercise.category === 'stretching' ? <View style={s.panel}>{exercise.instructions.map((step, i) => <T key={i}>{step}</T>)}</View> : null}
    <Kicker>BLOCK</Kicker>
    <View style={s.wrap}>{(Object.keys(phaseName) as Phase[]).map(key => <Chip key={key} label={phaseName[key]} selected={phase === key} onPress={() => setPhase(key)} />)}</View>
    <NumberField label="Set count · 0 for exercise only" value={count} onChangeText={setCount} />
    {count !== '0' ? <>
      <NumberField label={exercise.kind === 'time' ? 'Target seconds' : 'Target reps'} value={quantity} onChangeText={setQuantity} />
      {exercise.kind === 'load' ? <>
        <NumberField label="Target load (optional)" decimal value={load} onChangeText={setLoad} />
        <UnitChips unit={unit} onChange={next => { if (!load.trim() || next === unit) setUnit(next); else {
          const factor = next === 'lb' ? 2.20462 : 1 / 2.20462;
          const n = numeric(load) * factor;
          if (bounded(n, 0, 999.9)) { setLoad(String(Math.round(n * 1000) / 1000)); setUnit(next); }
          else action.setError('The converted target is outside the allowed range.');
        } }} />
      </> : null}
      {exercise.kind !== 'time' ? <>
        <NumberField label="Target RIR lower bound (optional)" value={rirMin} onChangeText={setRirMin} />
        <NumberField label="Target RIR upper bound (optional)" value={rirMax} onChangeText={setRirMax} />
        <T kind="small" color={c.muted}>RIR is the number of reps you could still do after the set.</T>
      </> : null}
    </> : null}
    {phase === 'work' ? <NumberField label="Rest seconds · blank inherits, 0 disables" value={rest} onChangeText={setRest} /> : null}
    <ErrorNote message={action.error} />
    <Button label="Save targets" tone="primary" onPress={() => action.run(save)} />
  </View>;
}

export function UnitChips({ unit, onChange }: { unit: Unit; onChange: (unit: Unit) => void }) {
  return <View style={s.wrap}>{(['kg', 'lb'] as const).map(value => <Chip key={value} label={value} selected={unit === value} onPress={() => onChange(value)} />)}</View>;
}
export function RoutineTile({ routine, onPress, onStart }: { routine: Routine; onPress: () => void; onStart?: () => void }) {
  const work = routine.entries.filter(e => e.phase === 'work');
  const sets = work.reduce((sum, e) => sum + e.count, 0);
  return <View style={s.panel}>
    <View style={s.row}><View style={{ padding: 10, borderRadius: 12, backgroundColor: '#393125' }}><BookOpen size={20} color={c.accent} /></View>
      <View style={s.flex}><T kind="label">{routine.name}</T>
        <T kind="small" color={c.muted}>{work.length} exercises · {sets ? sets + ' planned sets' : 'Exercise list'}</T></View></View>
    <View style={s.wrap}>
      {onStart ? <Button compact label="Start routine" onPress={onStart} /> : null}
      <Button compact label="Edit routine" tone={onStart ? 'quiet' : 'secondary'} onPress={onPress} />
    </View>
  </View>;
}
