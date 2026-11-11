import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, View } from 'react-native';
import { goalProgress } from '../../../../domain/analytics';
import { formatDateLong, formatDateShort, todayLocal, addDays } from '../../../../domain/dates';
import type { LiftGoal, Unit } from '../../../../domain/types';
import { formatStoredWeight } from '../../../../domain/units';
import { setPickerTarget } from '../../../../state/picker';
import { useLoad, useSession } from '../../../../state/session';
import { Banner, Button, Card, DateField, Empty, Field, Loading, Row, Screen, Segmented, T } from '../../../../ui/kit';
import { colors, radius, space } from '../../../../ui/theme';

/** TR-09: goals for an exact weighted exercise; best qualifying set links to its workout. */
export default function Goals() {
  const { repo, settings } = useSession();
  const { data } = useLoad(async () => ({ goals: await repo.listGoals(), ws: await repo.finishedWorkouts(), ex: await repo.exerciseMap() }));
  const [edit, setEdit] = useState<Partial<LiftGoal> | null>(null);
  const [load, setLoad] = useState('');
  const [reps, setReps] = useState('5');
  const [unit, setUnit] = useState<Unit>(settings.unit);
  const [deadline, setDeadline] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  if (!data) return <Loading />;

  const open = (g?: LiftGoal) => {
    setError(null);
    setEdit(g ?? {});
    setLoad(g ? String(g.targetLoad) : '');
    setReps(g ? String(g.minReps) : '5');
    setUnit(g?.unit ?? settings.unit);
    setDeadline(g?.deadline ?? null);
  };
  const choose = () => {
    setPickerTarget((id) => setEdit((e) => ({ ...(e ?? {}), exerciseId: id })), 'Goal exercise');
    router.push('/picker');
  };
  const save = async () => {
    setError(null);
    try {
      if (!edit?.exerciseId) throw new Error('Choose an exercise.');
      await repo.saveGoal({ id: edit.id, exerciseId: edit.exerciseId, targetLoad: Number(load.replace(',', '.')), unit, minReps: Number(reps), deadline });
      setEdit(null);
    } catch (e) { setError((e as Error).message); }
  };

  return (
    <Screen>
      {edit ? (
        <Card>
          <T variant="h3">{edit.id ? 'Edit goal' : 'New goal'}</T>
          <Button title={edit.exerciseId ? `Exercise: ${data.ex.get(edit.exerciseId)?.name}` : 'Choose a weighted exercise'} variant="secondary" compact onPress={choose} />
          <Row style={{ alignItems: 'flex-start' }}>
            <View style={{ width: 130 }}><Field label={`Target load (${unit})`} value={load} onChangeText={setLoad} keyboardType="decimal-pad" /></View>
            <View style={{ width: 110 }}><Field label="Minimum reps" value={reps} onChangeText={setReps} keyboardType="number-pad" /></View>
          </Row>
          <Segmented label="Goal unit" value={unit} onChange={setUnit} options={[{ value: 'kg', label: 'kg' }, { value: 'lb', label: 'lb' }]} />
          {deadline ? <DateField label="Deadline" value={deadline} onChange={setDeadline} maxToday={false} minimum={todayLocal()} /> : null}
          <Button title={deadline ? 'Remove deadline' : 'Add a deadline (optional)'} compact variant="ghost" onPress={() => setDeadline(deadline ? null : addDays(todayLocal(), 56))} />
          {error ? <Banner tone="danger">{error}</Banner> : null}
          <Row>
            <Button title="Save goal" onPress={save} />
            <Button title="Cancel" variant="ghost" onPress={() => setEdit(null)} />
          </Row>
        </Card>
      ) : (
        <Button title="New goal" icon="plus" onPress={() => open()} />
      )}
      {data.goals.length === 0 && !edit ? <Empty title="No goals yet" body="For example: Bench Press 225 lb for 5 reps. Progress uses your best completed working set." /> : null}
      {data.goals.map((g) => {
        const p = goalProgress(g, data.ws);
        const ex = data.ex.get(g.exerciseId);
        return (
          <Card key={g.id}>
            <Row style={{ justifyContent: 'space-between' }}>
              <T variant="h3" style={{ flexShrink: 1 }}>{ex?.name ?? 'Exercise'}</T>
              <T weight="700" color={p.achieved ? colors.success : colors.muted}>{p.achieved ? 'Reached' : `${Math.round(p.fraction * 100)}%`}</T>
            </Row>
            <T color={colors.muted}>Goal: {formatStoredWeight(g.targetLoad, g.unit, settings.showEquivalent)} × {g.minReps}+ reps{g.deadline ? ` by ${formatDateLong(g.deadline)}` : ''}</T>
            <View style={{ height: 8, borderRadius: radius.pill, backgroundColor: colors.border }} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: Math.round(p.fraction * 100) }}>
              <View style={{ height: 8, borderRadius: radius.pill, width: `${p.fraction * 100}%`, backgroundColor: p.achieved ? colors.success : colors.accent }} />
            </View>
            {p.best ? (
              <Button title={`Best: ${formatStoredWeight(p.best.weight, p.best.unit, settings.showEquivalent)} × ${p.best.reps} on ${formatDateShort(p.best.date)} ›`} compact variant="ghost" onPress={() => router.push(`/workout/${p.best!.workoutId}`)} />
            ) : <T variant="small" color={colors.faint}>No completed working set with at least {g.minReps} reps yet.</T>}
            <Row style={{ gap: space.sm }}>
              <Button title="Edit" compact variant="secondary" onPress={() => open(g)} />
              <Button title="Delete" compact variant="danger" onPress={() => Alert.alert('Delete this goal?', ex?.name, [{ text: 'Cancel', style: 'cancel' }, { text: 'Delete', style: 'destructive', onPress: () => repo.deleteGoal(g.id) }])} />
            </Row>
          </Card>
        );
      })}
    </Screen>
  );
}
