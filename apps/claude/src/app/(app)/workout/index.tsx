import { router, useNavigation } from 'expo-router';
import { useEffect, useLayoutEffect, useState } from 'react';
import { Alert, Pressable, View } from 'react-native';
import { formatClock, formatDateLong, todayLocal } from '../../../domain/dates';
import { PHASE_LABEL, type Phase } from '../../../domain/types';
import { remainingOf, restSecondsFor } from '../../../device/rest';
import { setPickerTarget } from '../../../state/picker';
import { useLoad, useSession } from '../../../state/session';
import { useEntryActions } from '../../../ui/useEntryActions';
import { EntryCard } from '../../../ui/EntryCard';
import { plural } from '../../../ui/format';
import { Banner, Button, Card, DateField, Empty, IconButton, Loading, Row, Screen, Section, StatusPill, T } from '../../../ui/kit';
import { colors, radius, space } from '../../../ui/theme';

function useNow(ms = 1000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), ms);
    return () => clearInterval(t);
  }, [ms]);
  return now;
}

function RestBar() {
  const { rest, restState } = useSession();
  const now = useNow(500);
  useEffect(() => {
    if (restState?.state === 'running' && remainingOf(restState, now) === 0) void rest.markDoneIfElapsed();
  }, [now, restState, rest]);
  if (!restState) return null;
  const remaining = remainingOf(restState, now);
  const done = restState.state === 'done';
  const pct = restState.totalSeconds ? 1 - remaining / restState.totalSeconds : 1;
  return (
    <View style={{ backgroundColor: colors.surfaceRaised, borderRadius: radius.lg, padding: space.md, gap: space.sm, borderWidth: 1, borderColor: done ? colors.success : colors.accent }}
      accessibilityRole="timer" accessibilityLabel={done ? 'Rest complete' : `Rest ${restState.state === 'paused' ? 'paused' : ''}, ${formatClock(remaining)} remaining before ${restState.exercise}`}>
      <Row style={{ justifyContent: 'space-between', flexWrap: 'nowrap' }}>
        <View style={{ flexShrink: 1 }}>
          <T variant="caption" color={colors.muted} numberOfLines={1}>{done ? 'Rest complete' : restState.state === 'paused' ? 'Rest paused' : 'Resting'} · next {restState.exercise}</T>
          <T variant="title" tabular color={done ? colors.success : colors.accent}>{done ? 'Go' : formatClock(remaining)}</T>
        </View>
        <Row gap={2}>
          {!done ? (
            restState.state === 'paused' ? <IconButton icon="play.fill" label="Resume rest" onPress={() => void rest.resume()} fallback="▶" />
              : <IconButton icon="pause.fill" label="Pause rest" onPress={() => void rest.pause()} fallback="⏸" />
          ) : null}
          <IconButton icon="goforward.30" label="Add 30 seconds" onPress={() => void rest.extend(30)} fallback="+30" />
          <IconButton icon="xmark" label={done ? 'Dismiss rest' : 'Skip rest'} onPress={() => void rest.clear()} fallback="✕" />
        </Row>
      </Row>
      <View style={{ height: 4, borderRadius: 2, backgroundColor: colors.border }}>
        <View style={{ height: 4, borderRadius: 2, width: `${Math.max(0, Math.min(1, pct)) * 100}%`, backgroundColor: done ? colors.success : colors.accent }} />
      </View>
    </View>
  );
}

export default function ActiveWorkout() {
  const { repo, settings, rest, syncState } = useSession();
  const navigation = useNavigation();
  const [changingDate, setChangingDate] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const now = useNow(1000);
  const { data } = useLoad(async () => {
    const w = await repo.getActiveWorkout();
    if (!w) return { w: null } as const;
    const ex = await repo.exerciseMap();
    const prev = new Map(await Promise.all([...new Set(w.entries.map((e) => e.exerciseId))].map(async (id) => [id, await repo.previousPerformance(id, w.id)] as const)));
    return { w, ex, prev };
  }, [], ['active', 'finished', 'exercises']);
  const w = data?.w ?? null;

  const ea = useEntryActions(w, {
    afterComplete: async (setId) => {
      const fresh = await repo.getActiveWorkout();
      if (!fresh) return;
      const entry = fresh.entries.find((e) => e.sets.some((s) => s.id === setId));
      if (!entry) return;
      const seconds = restSecondsFor(fresh, entry.id);
      if (seconds) {
        const next = fresh.entries.find((e) => e.phase === 'work' && e.sets.some((s) => s.state === 'pending'));
        const name = (await repo.getExercise((next ?? entry).exerciseId))?.name ?? 'next set';
        await rest.start(fresh.id, setId, name, seconds);
      }
    },
    afterReopen: (setId) => rest.clearIfSource(setId),
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        w ? <IconButton icon="trash" label="Discard workout" color={colors.danger} onPress={discard} fallback="🗑" /> : null,
    });
  });

  useEffect(() => () => repo.clearUndo(), [repo]);

  if (!data) return <Loading />;
  if (!w)
    return (
      <Screen>
        <Empty title="No workout in progress" body="Start an empty workout or a routine from the Train tab." action={<Button title="Go to Train" onPress={() => router.replace('/')} />} />
      </Screen>
    );

  function discard() {
    Alert.alert('Discard this workout?', 'Every set recorded in it will be removed. This cannot be undone.', [
      { text: 'Keep logging', style: 'cancel' },
      { text: 'Discard', style: 'destructive', onPress: async () => { await repo.discardWorkout(w!.id); await rest.clear(); router.replace('/'); } },
    ]);
  }

  const finish = async () => {
    setError(null);
    const p = await repo.finishPreview(w.id);
    if (p.doneWorking === 0) {
      Alert.alert('Nothing to save yet', 'Record at least one working set before finishing. You can also discard this workout.', [
        { text: 'Continue logging', style: 'cancel' },
        { text: 'Discard workout', style: 'destructive', onPress: discard },
      ]);
      return;
    }
    const doFinish = async (confirm: boolean) => {
      try {
        const res = await repo.finishWorkout(w.id, confirm);
        await rest.clear();
        router.replace({ pathname: '/workout/summary', params: { id: w.id, dropped: res.droppedEntries.join('\n'), skipped: String(res.skippedWork), skippedPrep: String(res.skipped - res.skippedWork) } });
      } catch (e) {
        setError((e as Error).message);
      }
    };
    if (p.pendingPlanned > 0)
      Alert.alert('Finish with planned sets left?', `${[p.pendingPlannedWork ? plural(p.pendingPlannedWork, 'planned working set') : null, p.pendingPlanned - p.pendingPlannedWork ? plural(p.pendingPlanned - p.pendingPlannedWork, 'preparation step') : null].filter(Boolean).join(' and ')} will be saved as skipped. Only completed sets count toward your progress.`, [
        { text: 'Keep logging', style: 'cancel' },
        { text: 'Mark skipped and finish', onPress: () => doFinish(true) },
      ]);
    else await doFinish(false);
  };

  const addExercise = (phase: Phase) => {
    setPickerTarget(async (id) => { await repo.addEntry(w.id, id, phase); }, phase === 'work' ? 'Add exercise' : `Add ${PHASE_LABEL[phase].toLowerCase()}`);
    router.push('/picker');
  };

  const elapsed = Math.max(0, Math.round((now - new Date(w.startedAt).getTime()) / 1000));
  const phases: Phase[] = ['warmup', 'work', 'mobility'];
  const done = w.entries.filter((e) => e.phase === 'work').reduce((a, e) => a + e.sets.filter((s) => s.state === 'done').length, 0);
  const planned = w.entries.filter((e) => e.phase === 'work').reduce((a, e) => a + e.sets.filter((s) => s.targetReps != null || s.targetSeconds != null).length, 0);

  return (
    <Screen footer={<Button title="Finish workout" icon="flag.checkered" onPress={finish} testID="finish" />}>
      <Card>
        <Row style={{ justifyContent: 'space-between' }}>
          <View style={{ flexShrink: 1 }}>
            <T variant="h2" numberOfLines={1}>{w.routineName ?? 'Workout'}</T>
            <Pressable onPress={() => setChangingDate((c) => !c)} accessibilityRole="button" accessibilityLabel={`Workout date ${formatDateLong(w.workoutDate)}. Change date`} style={{ minHeight: 32, justifyContent: 'center' }}>
              <T variant="small" color={colors.accent}>{formatDateLong(w.workoutDate)} ✎</T>
            </Pressable>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            {w.workoutDate === todayLocal() && !w.backdated ? <T weight="700" accessibilityLabel={`Elapsed ${formatClock(elapsed)}`}>{formatClock(elapsed)}</T> : <T variant="caption" color={colors.muted}>Earlier date</T>}
            <T variant="caption" color={colors.muted}>{planned ? `${done} of ${planned} planned sets` : plural(done, 'set')}</T>
          </View>
        </Row>
        {changingDate ? <DateField label="Workout date (today or earlier)" value={w.workoutDate} onChange={async (d) => { try { await repo.setWorkoutDate(w.id, d); } catch (e) { setError((e as Error).message); } }} /> : null}
        <StatusPill status={syncState.status === 'device_only' ? 'device_only' : 'saved_on_device'} label="Every set is saved on this device as you record it" />
      </Card>
      <RestBar />
      {ea.undo ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.surfaceRaised, borderRadius: radius.md, padding: space.sm, paddingLeft: space.md }} accessibilityLiveRegion="polite">
          <T>{ea.undo.label}</T>
          <Button title="Undo" compact variant="ghost" onPress={ea.runUndo} />
        </View>
      ) : null}
      {error || ea.error ? <Banner tone="danger">{error ?? ea.error}</Banner> : null}
      {phases.map((phase) => {
        const entries = w.entries.filter((e) => e.phase === phase);
        if (!entries.length && phase !== 'work') return null;
        return (
          <Section key={phase} title={PHASE_LABEL[phase]}>
            {entries.map((e) => (
              <EntryCard key={e.id} workout={w} entry={e} exercise={data.ex!.get(e.exerciseId)} previous={data.prev!.get(e.exerciseId) ?? null} settings={settings}
                actions={ea.setActions} onAddSet={(input) => ea.addSet(e.id, input)} onEntryMenu={(c) => ea.entryMenu(e, c)} />
            ))}
            {phase === 'work' && entries.length === 0 ? <Empty title="No exercises yet" body="Add exercises in the order you train them." /> : null}
          </Section>
        );
      })}
      <Button title="Add exercise" variant="secondary" icon="plus.circle" onPress={() => addExercise('work')} testID="add-exercise" />
      <Row>
        <Button title="Add warm-up" variant="ghost" compact onPress={() => addExercise('warmup')} />
        <Button title="Add mobility" variant="ghost" compact onPress={() => addExercise('mobility')} />
      </Row>
    </Screen>
  );
}
