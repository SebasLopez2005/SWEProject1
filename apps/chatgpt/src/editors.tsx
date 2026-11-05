import { randomUUID } from 'expo-crypto';
import { useState } from 'react';
import { convert, isWeighted, muscles, parseSet, typeLabels, type Exercise, type ExerciseType, type TrainingSet, type Unit } from './domain';
import { useApp } from './session';
import { Button, Chip, Field, message, Notice, Row, Sheet, Txt } from './ui';

export function ExerciseForm({ initial, onDone, onClose }: { initial?: Exercise; onDone(exercise: Exercise): void; onClose(): void }) {
  const { model, save } = useApp();
  const [name, setName] = useState(initial?.name ?? '');
  const [muscle, setMuscle] = useState(initial?.muscle ?? 'Full body');
  const [type, setType] = useState<ExerciseType>(initial?.type ?? 'weight_reps');
  const [error, setError] = useState('');
  const locked = initial && model!.used.has(initial.id);
  return <Sheet title={initial ? 'Edit custom exercise' : 'New custom exercise'} onClose={onClose}>
    <Field label="Exercise name" placeholder="e.g. Paused Goblet Squat" autoCapitalize="words" defaultValue={name} onChangeText={setName} />
    <Txt variant="strong">Muscle group</Txt>
    <Row>{muscles.map(m => <Chip key={m} label={m} selected={muscle === m} onPress={() => setMuscle(m)} />)}</Row>
    <Txt variant="strong">Set type</Txt>
    {locked ? <Txt>{typeLabels[type]} · Locked after the first recorded set</Txt> :
      <Row>{(Object.keys(typeLabels) as ExerciseType[]).map(t => <Chip key={t} label={typeLabels[t]} selected={type === t} onPress={() => setType(t)} />)}</Row>}
    <Notice message={error} error />
    <Button label="Save exercise" onPress={() => {
      const exercise: Exercise = { kind: 'exercise', id: initial?.id ?? randomUUID(),
        archived: initial?.archived ?? false, name: name.trim(), muscle, type };
      try { save(exercise, initial); onDone(exercise); } catch (e) { setError('Not saved. ' + message(e)); }
    }} />
  </Sheet>;
}
export function SetForm({ exercise, existing, prefill, onSave, onClose }: {
  exercise: Exercise; existing?: TrainingSet; prefill?: TrainingSet; onSave(set: TrainingSet): void; onClose(): void;
}) {
  const { model } = useApp();
  const sample = existing ?? prefill;
  const preferred = model!.settings.unit;
  const initialUnit = existing && isWeighted(existing) ? existing.unit : preferred;
  const [unit, setUnit] = useState<Unit>(initialUnit);
  const [weight, setWeight] = useState(sample && isWeighted(sample)
    ? String(sample.unit === initialUnit ? sample.weight : Number(convert(sample.weight, sample.unit, initialUnit).toFixed(6))) : '');
  const [count, setCount] = useState(sample ? String('seconds' in sample ? sample.seconds : sample.reps) : '');
  const [error, setError] = useState('');
  const timed = exercise.type === 'seconds';
  const weighted = exercise.type === 'weight_reps';
  function switchUnit(to: Unit) {
    if (to === unit) return;
    if (weight.trim()) {
      const value = weight.trim().replace(',', '.');
      if (!/^(?:\d+(?:\.\d*)?|\.\d+)$/.test(value) || !Number.isFinite(Number(value))) {
        setError('Correct or clear the weight before converting.'); return;
      }
      setWeight(String(Number(convert(Number(value), unit, to).toFixed(6))));
    }
    setUnit(to);
    setError('');
  }
  return <Sheet title={existing ? 'Edit set' : 'Record set'} onClose={onClose}>
    <Txt variant="strong">{exercise.name}</Txt>
    {weighted && <>
      <Txt>Entry unit. Switching units converts the number. Review the result before saving.</Txt>
      <Row>{(['kg', 'lb'] as Unit[]).map(u => <Chip key={u} label={u} selected={unit === u} onPress={() => switchUnit(u)} />)}</Row>
      <Field key={unit} label={'Weight (' + unit + ')'} defaultValue={weight} onChangeText={setWeight} keyboardType="decimal-pad" placeholder="0–999.9" />
    </>}
    <Field label={timed ? 'Seconds' : 'Reps'} defaultValue={count} onChangeText={setCount} keyboardType="number-pad"
      placeholder={timed ? 'e.g. 30' : 'e.g. 10'} />
    <Notice message={error} error />
    <Button label="Save set" icon="checkmark" onPress={() => {
      try { onSave({ ...parseSet(exercise.type, weight, count, unit), id: existing?.id ?? randomUUID() }); }
      catch (e) { setError('Not saved. ' + message(e)); }
    }} />
  </Sheet>;
}
