import { router } from 'expo-router';
import { Alert, View } from 'react-native';
import { summarizeWorkout } from '../../../domain/analytics';
import { formatDateLong, todayLocal } from '../../../domain/dates';
import { useLoad, useSession } from '../../../state/session';
import { plural } from '../../../ui/format';
import { Banner, Button, Card, Empty, Row, Screen, Section, StatusPill, T } from '../../../ui/kit';
import { colors, space } from '../../../ui/theme';

/** Train tab: resume-or-discard (FW-07), start ad hoc / earlier date / routine (FW-01, FW-08, FW-26). */
export default function Train() {
  const { repo, syncState, settings, rest } = useSession();
  const { data } = useLoad(async () => {
    const [active, routines, ex, finished] = await Promise.all([repo.getActiveWorkout(), repo.listRoutines(), repo.exerciseMap(), repo.finishedWorkouts()]);
    return { active, routines, ex, finished };
  });
  const active = data?.active;
  const lastDone = data?.finished[0];

  const discard = () =>
    Alert.alert('Discard workout?', 'All sets in the unfinished workout will be removed. This cannot be undone.', [
      { text: 'Keep it', style: 'cancel' },
      { text: 'Discard', style: 'destructive', onPress: async () => { await repo.discardWorkout(active!.id); await rest.clear(); } },
    ]);

  return (
    <Screen>
      <Row style={{ justifyContent: 'space-between' }}>
        <T variant="title">{formatDateLong(todayLocal())}</T>
        <StatusPill status={syncState.status} />
      </Row>
      {active ? (
        <Card accessibilityLabel="Unfinished workout">
          <T variant="h2">Unfinished workout</T>
          <T color={colors.muted}>
            {active.routineName ?? 'Ad hoc workout'} · {formatDateLong(active.workoutDate)} · {plural(summarizeWorkout(active, data!.ex, settings.unit).workingSets, 'set')} recorded
          </T>
          <Banner tone="info">Your sets are saved on this device. Resume where you left off, or discard it.</Banner>
          <Button title="Resume workout" icon="play.fill" onPress={() => router.push('/workout')} testID="resume" />
          <Button title="Discard workout" variant="danger" onPress={discard} />
        </Card>
      ) : (
        <>
          <Button title="Start empty workout" icon="plus" onPress={() => router.push({ pathname: '/workout/start', params: { mode: 'adhoc' } })} testID="start-empty" />
          <Button title="Log an earlier workout" variant="secondary" icon="calendar.badge.clock" onPress={() => router.push({ pathname: '/workout/start', params: { mode: 'earlier' } })} />
        </>
      )}

      <Section title="Start a routine" action={<Button title="New" compact variant="ghost" onPress={() => router.push('/routine/new')} />}>
        {data && data.routines.length === 0 ? (
          <Empty title="No routines yet" body="Plan exercises, sets and targets once, then start them in one tap." action={<Button title="Create a routine" variant="secondary" onPress={() => router.push('/routine/new')} />} />
        ) : null}
        {data?.routines.map((r) => (
          <Card key={r.id} onPress={active ? undefined : () => router.push({ pathname: '/workout/start', params: { mode: 'routine', routineId: r.id } })}
            accessibilityLabel={`Start ${r.name}`} accessibilityHint={active ? undefined : 'Opens the start screen for this routine'}>
            <Row style={{ justifyContent: 'space-between' }}>
              <T variant="h3" style={{ flexShrink: 1 }}>{r.name}</T>
              {!active && <T color={colors.accent} weight="600">Start ›</T>}
            </Row>
            <T variant="small" color={colors.muted} numberOfLines={2}>
              {r.entries.map((e) => data.ex.get(e.exerciseId)?.name ?? 'Unknown').join(' · ')}
            </T>
          </Card>
        ))}
        {active && data && data.routines.length > 0 ? <T variant="caption" color={colors.faint}>Finish or discard the unfinished workout to start another.</T> : null}
      </Section>

      <Section title="Library">
        <Card onPress={() => router.push('/exercises')} accessibilityLabel="Exercise library">
          <T variant="h3">Exercise library</T>
          <T variant="small" color={colors.muted}>Search {data ? data.ex.size : '…'} exercises offline by name, muscle, equipment or category, and add your own.</T>
        </Card>
      </Section>

      {lastDone ? (
        <Section title="Last workout">
          <Card onPress={() => router.push(`/workout/${lastDone.id}`)} accessibilityLabel={`Last workout on ${formatDateLong(lastDone.workoutDate)}`}>
            <T weight="600">{formatDateLong(lastDone.workoutDate)}</T>
            <T variant="small" color={colors.muted}>{summarizeWorkout(lastDone, data!.ex, settings.unit).exerciseNames.join(', ')}</T>
          </Card>
        </Section>
      ) : null}
      <View style={{ height: space.lg }} />
    </Screen>
  );
}
