import { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Routine, dateKey, phaseName, startWorkout, targetLabel } from './model';
import { useApp } from './state';
import { newId } from './repository';
import { Badge, Button, DayField, ErrorNote, Kicker, Sheet, T, c, s, useAction } from './ui';

export function Start({ routine, onClose }: { routine?: Routine; onClose: () => void }) {
  const app = useApp();
  const router = useRouter();
  const [date, setDate] = useState(dateKey());
  const action = useAction();
  const entries = routine?.entries.filter(e => !app.exercise(e.exerciseId)?.archived && !!app.exercise(e.exerciseId)) ?? [];
  const omitted = (routine?.entries.length ?? 0) - entries.length;
  function start() {
    if (app.active) throw Error('Resume or discard your active workout before starting another.');
    if (routine && !entries.some(e => e.phase === 'work')) throw Error('This routine needs an available working exercise.');
    const id = newId();
    app.save([{ kind: 'workout', id, value: startWorkout(id, date, entries, routine?.rest ?? 0, newId, routine?.name) }], null);
    onClose();
    router.push({ pathname: '/session/[id]', params: { id } });
  }
  return <Sheet title={routine?.name ?? 'Start a workout'} onClose={onClose}>
    <Kicker>{routine ? 'ROUTINE PREVIEW' : 'AD HOC WORKOUT'}</Kicker>
    <DayField label="Workout date" value={date} onChange={setDate} />
    {routine ? <View style={s.panel}>
      {routine.entries.map((plan, i) => <View key={i} style={s.column}>
        <T kind="label">{app.exercise(plan.exerciseId)?.name ?? 'Unavailable exercise'}</T>
        <T color={c.muted}>{phaseName[plan.phase]} · {plan.count ? `${plan.count} × ${targetLabel(plan.target)}` : 'Log as you go'}</T>
        {app.exercise(plan.exerciseId)?.archived ? <Badge label="Archived · skipped on start" /> : null}
        {i < routine.entries.length - 1 ? <View style={s.rule} /> : null}
      </View>)}
    </View> : <T color={c.muted}>Choose exercises as you train. Each set is saved on this device as soon as you confirm it.</T>}
    {omitted ? <T color={c.accent}>{omitted} unavailable {omitted === 1 ? 'exercise will be' : 'exercises will be'} skipped.</T> : null}
    <ErrorNote message={action.error} />
    {app.active ? <Button label="Resume active workout" tone="primary" onPress={() => {
      onClose(); router.push({ pathname: '/session/[id]', params: { id: app.active!.id } });
    }} /> : <Button label={omitted ? 'Skip unavailable and start' : 'Start workout'} tone="primary" onPress={() => action.run(start)} />}
  </Sheet>;
}
