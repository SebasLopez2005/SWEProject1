import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useLayoutEffect, useState } from 'react';
import { Alert, View } from 'react-native';
import { summarizeWorkout } from '../../../domain/analytics';
import { formatDateLong } from '../../../domain/dates';
import { PHASE_LABEL } from '../../../domain/types';
import { setPickerTarget } from '../../../state/picker';
import { useLoad, useSession } from '../../../state/session';
import { EntryCard } from '../../../ui/EntryCard';
import { formatActual, plural } from '../../../ui/format';
import { Banner, Button, Card, DateField, Empty, Loading, Row, Screen, StatusPill, T } from '../../../ui/kit';
import { colors, radius, space } from '../../../ui/theme';
import { useEntryActions } from '../../../ui/useEntryActions';
import { WorkoutSummaryCard } from '../../../ui/WorkoutSummaryCard';

/** FW-15 open, FW-17 edit, FW-18 delete, FW-25 save as routine. */
export default function WorkoutDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { repo, settings, syncState } = useSession();
  const navigation = useNavigation();
  const [editing, setEditing] = useState(false);
  const { data } = useLoad(async () => {
    const w = await repo.getWorkout(id);
    if (!w) return { w: null } as const;
    const ex = await repo.exerciseMap();
    const prev = new Map(await Promise.all([...new Set(w.entries.map((e) => e.exerciseId))].map(async (x) => [x, await repo.previousPerformance(x, w.id)] as const)));
    return { w, ex, prev, pending: await repo.isAggregatePending(w.id) };
  }, [id]);
  const w = data?.w ?? null;
  const ea = useEntryActions(w);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: editing ? 'Edit workout' : 'Workout',
      headerRight: () => (w && w.state === 'finished' ? <Button title={editing ? 'Done' : 'Edit'} compact variant="ghost" onPress={() => { setEditing((e) => !e); repo.clearUndo(); }} /> : null),
    });
  });

  if (!data) return <Loading />;
  if (!w) return <Screen><Empty title="Workout not found" body="It may have been deleted." action={<Button title="Back to history" onPress={() => router.back()} />} /></Screen>;
  if (w.state === 'active') return <Screen><Banner tone="info">This workout is still in progress.</Banner><Button title="Open active workout" onPress={() => router.replace('/workout')} /></Screen>;

  const s = summarizeWorkout(w, data.ex!, settings.unit);
  const del = () =>
    Alert.alert(`Delete the workout on ${formatDateLong(w.workoutDate)}?`, `Its ${plural(s.workingSets, 'set')} will be removed from history, previous performance and graphs. This cannot be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete workout', style: 'destructive', onPress: async () => { await repo.deleteWorkout(w.id); router.back(); } },
    ]);

  return (
    <Screen>
      <StatusPill status={syncState.status === 'device_only' ? 'device_only' : data.pending ? 'waiting' : 'uploaded'} />
      {editing ? (
        <>
          <Banner tone="info">Changes save as you make them. A finished workout must keep at least one set — delete the workout instead.</Banner>
          <DateField label="Workout date" value={w.workoutDate} onChange={(d) => void repo.setWorkoutDate(w.id, d).catch((e) => ea.setError(e.message))} />
          {ea.undo ? (
            <Row style={{ justifyContent: 'space-between', backgroundColor: colors.surfaceRaised, borderRadius: radius.md, padding: space.sm }}>
              <T>{ea.undo.label}</T>
              <Button title="Undo" compact variant="ghost" onPress={ea.runUndo} />
            </Row>
          ) : null}
          {ea.error ? <Banner tone="danger">{ea.error}</Banner> : null}
          {w.entries.map((e) => (
            <EntryCard key={e.id} workout={w} entry={e} exercise={data.ex!.get(e.exerciseId)} previous={data.prev!.get(e.exerciseId) ?? null} settings={settings}
              actions={ea.setActions} onAddSet={(input) => ea.addSet(e.id, input)} onEntryMenu={(c) => ea.entryMenu(e, c)} />
          ))}
          <Button title="Add exercise" variant="secondary" icon="plus.circle" onPress={() => {
            setPickerTarget(async (exId) => { await repo.addEntry(w.id, exId); }, 'Add exercise');
            router.push('/picker');
          }} />
          <T variant="caption" color={colors.faint}>A newly added exercise needs at least one recorded set; empty exercises are not shown in history.</T>
        </>
      ) : (
        <>
          <WorkoutSummaryCard w={w} ex={data.ex!} settings={settings} />
          {w.entries.map((e) => {
            const exercise = data.ex!.get(e.exerciseId);
            return (
              <Card key={e.id} onPress={() => router.push(`/exercises/${e.exerciseId}`)} accessibilityLabel={`${exercise?.name}. Open exercise history`}>
                <Row style={{ justifyContent: 'space-between' }}>
                  <T variant="h3" style={{ flexShrink: 1 }}>{exercise?.name ?? 'Unknown exercise'}</T>
                  {e.phase !== 'work' ? <T variant="caption" color={colors.muted}>{PHASE_LABEL[e.phase]}</T> : null}
                </Row>
                {e.sets.map((st) => (
                  <View key={st.id} style={{ flexDirection: 'row', gap: space.md }}>
                    <T color={colors.muted} style={{ width: 22 }}>{st.position}</T>
                    <T color={st.state === 'skipped' ? colors.faint : colors.text} style={{ flex: 1 }}>{st.state === 'skipped' ? 'Skipped' : formatActual(st, exercise?.type, settings.showEquivalent)}</T>
                  </View>
                ))}
              </Card>
            );
          })}
          <Button title="Save as routine" variant="secondary" icon="square.and.arrow.down" onPress={() => router.push({ pathname: '/routine/[id]', params: { id: 'new', fromWorkout: w.id } })} />
          <Button title="Delete workout" variant="danger" icon="trash" onPress={del} />
        </>
      )}
    </Screen>
  );
}
