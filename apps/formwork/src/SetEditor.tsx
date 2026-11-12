import { useEffect, useState } from 'react';
import { Alert, View } from 'react-native';
import { Actual, Exercise, Settings, SetRow, Unit, bounded, convert, displayNumber, numeric, targetLabel, validateActual, whole } from './model';
import { clock } from './device';
import { UnitChips } from './Routines';
import { Button, ErrorNote, Kicker, NumberField, Sheet, T, c, s, useAction } from './ui';

export function SetEditor({ exercise, row, suggested, settings, movementTimer, onSave, onClose }: {
  exercise: Exercise; row?: SetRow; suggested?: Actual; settings: Settings;
  movementTimer?: boolean; onSave: (actual: Actual) => void; onClose: () => void;
}) {
  const initial = row?.actual ?? suggested;
  const target = row?.target;
  const from = row?.actual?.unit ?? target?.unit ?? initial?.unit ?? settings.unit;
  const [unit, setUnit] = useState<Unit>(row?.actual?.unit ?? settings.unit);
  const initialLoad = row?.actual?.weight ?? target?.weight ?? initial?.weight;
  const [load, setLoad] = useState(initialLoad == null ? '' : String(Number(convert(initialLoad, from, row?.actual?.unit ?? settings.unit).toFixed(4))));
  const [quantity, setQuantity] = useState(String(row?.actual?.seconds ?? row?.actual?.reps ?? target?.seconds ?? target?.reps
    ?? initial?.seconds ?? initial?.reps ?? ''));
  const [rir, setRir] = useState(row?.actual?.rir?.toString() ?? '');
  const action = useAction();
  const [timer, setTimer] = useState<{ deadline: number; seconds: number }>();
  useEffect(() => {
    if (!timer?.deadline || !timer.seconds) return;
    const tick = setInterval(() => {
      setTimer(current => current ? { ...current, seconds: Math.max(0, Math.ceil((current.deadline - Date.now()) / 1000)) } : undefined);
    }, 250);
    return () => clearInterval(tick);
  }, [timer?.deadline, timer?.seconds === 0]);

  function startTimer() {
    const seconds = numeric(quantity);
    if (!whole(seconds, 1, 86400)) throw Error('Enter whole seconds between 1 and 86,400 to start the timer.');
    setTimer({ seconds, deadline: Date.now() + seconds * 1000 });
  }
  function save() {
    const actual: Actual = {
      at: row?.actual?.at ?? Date.now(),
      ...(exercise.kind === 'time' ? { seconds: numeric(quantity) } : {
        reps: numeric(quantity), ...(rir.trim() ? { rir: numeric(rir) } : {}),
        ...(exercise.kind === 'load' ? { unit, weight: numeric(load) } : {}),
      }),
    };
    validateActual(exercise.kind, actual);
    onSave(actual);
  }
  function changeUnit(next: Unit) {
    if (next === unit) return;
    if (!load.trim()) { setUnit(next); return; }
    const converted = convert(numeric(load), unit, next);
    if (!bounded(converted, 0, 999.9)) { action.setError('The converted load is outside the allowed range. Clear the field to enter a new value.'); return; }
    Alert.alert('Convert entered weight?', `${load} ${unit} → ${displayNumber(converted)} ${next}`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Convert', onPress: () => { setLoad(String(Number(converted.toFixed(4)))); setUnit(next); action.setError(''); } },
    ]);
  }
  return <Sheet title={row?.actual ? 'Edit set' : 'Record set'} onClose={onClose}>
    <T kind="sub">{exercise.name}</T>
    {target ? <View style={s.panel}><Kicker>PLANNED TARGET</Kicker><T>{targetLabel(target)}</T></View> : null}
    <Kicker>ACTUAL PERFORMANCE</Kicker>
    {exercise.kind === 'load' ? <>
      <NumberField label={`Weight (${unit})`} value={load} onChangeText={setLoad} decimal />
      <UnitChips unit={unit} onChange={changeUnit} />
    </> : null}
    <NumberField label={exercise.kind === 'time' ? 'Seconds' : 'Reps'} value={quantity} onChangeText={setQuantity} />
    {exercise.kind === 'time' && movementTimer ? <View style={s.panel}>
      <Kicker>MOVEMENT TIMER</Kicker>
      {timer ? <T kind="sub">{timer.seconds ? clock(timer.seconds) : 'Time complete'}</T> : null}
      <Button label={timer?.seconds ? 'Stop timer' : 'Start movement timer'} compact
        onPress={() => timer?.seconds ? setTimer(undefined) : action.run(startTimer)} />
    </View> : null}
    {exercise.kind !== 'time' ? <NumberField label="Actual RIR (optional)" value={rir} onChangeText={setRir} /> : null}
    {!row?.actual ? <T kind="small" color={c.muted}>Review the suggested values before marking this set done.</T> : null}
    <ErrorNote message={action.error} />
    <Button label={row?.actual ? 'Save changes' : 'Mark done'} tone="primary" onPress={() => action.run(save)} />
  </Sheet>;
}
