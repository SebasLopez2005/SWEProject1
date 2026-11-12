import { router } from 'expo-router';
import { Alert, View } from 'react-native';
import { summarizeWorkout } from '../../../../domain/analytics';
import { formatDateLong, formatDateShort, mondayOf, todayLocal } from '../../../../domain/dates';
import { formatAggregate } from '../../../../domain/units';
import { useLoad, useSession } from '../../../../state/session';
import { plural } from '../../../../ui/format';
import { Button, Card, Group, ListItem, Loading, Row, Screen, Stat, StatusPill, T } from '../../../../ui/kit';
import { colors, space } from '../../../../ui/theme';

/** Train tab: resume-or-discard (FW-07), start ad hoc / earlier date / routine (FW-01, FW-08, FW-26). */
export default function Train() {
  const { repo, syncState, settings, rest } = useSession();
  const { data } = useLoad(async () => {
    const [active, routines, ex, finished] = await Promise.all([repo.getActiveWorkout(), repo.listRoutines(), repo.exerciseMap(), repo.finishedWorkouts()]);
    return { active, routines, ex, finished };
  }, [], ['active', 'finished', 'routines', 'exercises']);
  if (!data) return <Loading />;
  const { active, routines, ex, finished } = data;
  const today = todayLocal();
  const weekStart = mondayOf(today);
  const thisWeek = finished.filter((w) => w.workoutDate >= weekStart && w.workoutDate <= today);
  const weekVolume = thisWeek.reduce((a, w) => a + summarizeWorkout(w, ex, settings.unit).volume, 0);
  const weekSets = thisWeek.reduce((a, w) => a + summarizeWorkout(w, ex, settings.unit).workingSets, 0);
  const last = finished[0];

  const discard = () =>
    Alert.alert('Discard workout?', 'All sets in the unfinished workout will be removed. This cannot be undone.', [
      { text: 'Keep it', style: 'cancel' },
      { text: 'Discard', style: 'destructive', onPress: async () => { await repo.discardWorkout(active!.id); await rest.clear(); } },
    ]);

  const activeSummary = active ? summarizeWorkout(active, ex, settings.unit) : null;
  const plannedLeft = active ? active.entries.filter((e) => e.phase === 'work').reduce((a, e) => a + e.sets.filter((s) => s.state === 'pending').length, 0) : 0;

  return (
    <Screen>
      <Row style={{ justifyContent: 'space-between' }}>
        <T variant="small" color={colors.muted}>{formatDateLong(today)}</T>
        <StatusPill status={syncState.status} short />
      </Row>

      {active ? (
        <Card style={{ borderWidth: 1, borderColor: colors.accent }} accessibilityLabel="Unfinished workout">
          <Row style={{ justifyContent: 'space-between' }}>
            <T variant="caption" weight="700" color={colors.accent} style={{ letterSpacing: 0.6 }}>IN PROGRESS</T>
            <T variant="caption" color={colors.muted}>{formatDateShort(active.workoutDate)}</T>
          </Row>
          <T variant="h2">{active.routineName ?? 'Workout'}</T>
          <T variant="small" color={colors.muted}>
            {plural(activeSummary!.workingSets, 'set')} done{plannedLeft ? ` · ${plannedLeft} planned left` : ''} · saved on this device
          </T>
          <Row style={{ marginTop: space.xs, flexWrap: 'nowrap' }}>
            <Button title="Resume" icon="play.fill" onPress={() => router.push('/workout')} style={{ flex: 1 }} testID="resume" />
            <Button title="Discard" variant="danger" onPress={discard} style={{ flex: 0.6 }} />
          </Row>
        </Card>
      ) : (
        <View style={{ gap: space.sm }}>
          <Button title="Start empty workout" icon="plus" onPress={() => router.push({ pathname: '/workout/start', params: { mode: 'adhoc' } })} testID="start-empty" />
          <Button title="Log an earlier workout" variant="secondary" icon="calendar.badge.clock" onPress={() => router.push({ pathname: '/workout/start', params: { mode: 'earlier' } })} />
        </View>
      )}

      <Card>
        <Row style={{ flexWrap: 'nowrap' }}>
          <Stat label="This week" value={String(thisWeek.length)} sub={plural(thisWeek.length, 'session')} />
          <Stat label="Sets" value={String(weekSets)} sub="working" />
          <Stat label="Volume" value={formatAggregate(weekVolume, settings.unit, false)} sub={`since ${formatDateShort(weekStart)}`} />
        </Row>
      </Card>

      <Group header="Routines" footer={active ? 'Finish or discard the unfinished workout to start another.' : undefined}>
        {routines.length === 0 ? (
          <ListItem title="Create your first routine" subtitle="Plan exercises, sets and targets once" icon="plus" onPress={() => router.push('/routine/new')} />
        ) : null}
        {routines.map((r) => (
          <ListItem
            key={r.id}
            title={r.name}
            subtitle={r.entries.map((e) => ex.get(e.exerciseId)?.name ?? 'Unknown').join(' · ')}
            value={plural(r.entries.length, 'exercise')}
            icon="dumbbell.fill"
            onPress={active ? undefined : () => router.push({ pathname: '/workout/start', params: { mode: 'routine', routineId: r.id } })}
            accessibilityLabel={`Start ${r.name}`}
          />
        ))}
        {routines.length ? <ListItem title="New routine" icon="plus" onPress={() => router.push('/routine/new')} /> : null}
      </Group>

      <Group header="Library">
        <ListItem title="Exercise library" subtitle={`${ex.size} exercises · how to perform each one`} icon="books.vertical.fill" onPress={() => router.push('/exercises')} />
        {last ? (
          <ListItem title="Last workout" subtitle={`${formatDateLong(last.workoutDate)} · ${summarizeWorkout(last, ex, settings.unit).exerciseNames.slice(0, 3).join(', ')}`}
            icon="clock.arrow.circlepath" onPress={() => router.push(`/workout/${last.id}`)} />
        ) : null}
      </Group>
    </Screen>
  );
}
