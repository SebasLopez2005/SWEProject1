import { randomUUID } from 'expo-crypto';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { allSets, dateKey, display, finished, formatDate, newWorkout, setCount, volume } from '../../src/domain';
import { useApp } from '../../src/session';
import { Button, Card, c, confirm, DateField, Icon, Item, message, Notice, Page, Row, Sheet, SyncLabel, Txt } from '../../src/ui';

export default function WorkoutHome() {
  const router = useRouter();
  const { model, owner, save } = useApp();
  const [choosing, setChoosing] = useState(false);
  const [date, setDate] = useState(dateKey());
  const [error, setError] = useState('');
  const active = model!.workouts.find(w => w.state === 'active');
  const completed = finished(model!.workouts);
  const last = completed[0];
  const open = (id: string) => router.push({ pathname: '/workout', params: { id } });
  function start(on: string) {
    try {
      setError('');
      const workout = newWorkout(randomUUID, on);
      save(workout);
      setChoosing(false);
      open(workout.id);
    } catch (e) { setError('Not saved. ' + message(e)); }
  }
  return <Page kicker="FITNESS & WORKOUT LOG" title="Workout" subtitle={formatDate(dateKey())}>
    <Notice message={!choosing ? error : ''} error />
    <Card dark>
      <Row between>
        <Icon name="flash" color={c.accent} size={28} />
        <Txt variant="label" color={c.accent}>{owner?.demo ? 'CLASSROOM DEMO' : 'TRAINING LOG'}</Txt>
      </Row>
      <Txt variant="display" color={c.surface}>{active ? 'Pick up where you left off.' : 'Ready to train?'}</Txt>
      <Txt color={c.onDark}>{active
        ? formatDate(active.date) + ' · ' + setCount(active) + ' recorded sets'
        : 'Start a session, add an exercise, and record your first set.'}</Txt>
      <Button label={active ? 'Resume workout' : 'Start workout'} icon={active ? 'play' : 'add'}
        onPress={() => active ? open(active.id) : start(dateKey())} />
    </Card>
    {active ? <Button label="Discard unfinished workout" tone="danger" onPress={() =>
      confirm('Discard this workout?', 'The unfinished workout and its recorded sets will be removed.', 'Discard', () => {
        try { save({ ...active, deleted: true }, active); setError(''); } catch (e) { setError(message(e)); }
      })} /> : <>
      <Item title="Use a template" detail="Start with a saved exercise list" icon="layers-outline"
        onPress={() => router.navigate('/templates')} />
      <Item title="Log an earlier workout" detail="Choose the date you trained" icon="calendar-outline"
        onPress={() => { setError(''); setDate(dateKey()); setChoosing(true); }} />
    </>}
    {last && <>
      <Txt variant="label" color={c.green}>LAST SESSION</Txt>
      <Item title={formatDate(last.date)} detail={setCount(last) + ' sets · ' +
        display(volume(allSets(last), model!.settings.unit)) + ' ' + model!.settings.unit + ' total volume'}
        icon="checkmark-circle-outline" onPress={() => open(last.id)} />
      <SyncLabel root={last} />
    </>}
    {choosing && <Sheet title="Log an earlier workout" onClose={() => { setError(''); setChoosing(false); }}>
      <DateField label="Workout date" value={date} onChange={setDate} />
      <Notice message={error} error />
      <Button label="Start on this date" onPress={() => start(date)} />
    </Sheet>}
  </Page>;
}
