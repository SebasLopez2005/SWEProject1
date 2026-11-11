import { router } from 'expo-router';
import { useLoad, useSession } from '../../../../state/session';
import { formatTarget, plural } from '../../../../ui/format';
import { Button, Card, Empty, Loading, Row, Screen, T } from '../../../../ui/kit';
import { colors } from '../../../../ui/theme';

/** FW-27 / TR-01: routines (templates) list. */
export default function Routines() {
  const { repo, settings } = useSession();
  const { data } = useLoad(async () => ({ routines: await repo.listRoutines(), ex: await repo.exerciseMap(), active: await repo.getActiveWorkout() }));
  if (!data) return <Loading />;
  return (
    <Screen>
      <Button title="New routine" icon="plus" onPress={() => router.push('/routine/new')} />
      {data.routines.length === 0 ? (
        <Empty title="No routines yet" body="Create one by choosing exercises and targets, or save a finished workout as a routine." />
      ) : null}
      {data.routines.map((r) => (
        <Card key={r.id} onPress={() => router.push(`/routine/${r.id}`)} accessibilityLabel={`${r.name}, ${plural(r.entries.length, 'exercise')}. Edit`}>
          <Row style={{ justifyContent: 'space-between' }}>
            <T variant="h3" style={{ flexShrink: 1 }}>{r.name}</T>
            <T variant="small" color={colors.muted}>{plural(r.entries.length, 'exercise')}</T>
          </Row>
          {r.entries.slice(0, 6).map((e) => {
            const x = data.ex.get(e.exerciseId);
            const t = formatTarget({ ...e }, settings.showEquivalent);
            return (
              <T key={e.id} variant="small" color={x?.archived ? colors.warning : colors.muted}>
                {x?.name ?? 'Unknown'}{x?.archived ? ' (archived)' : ''}{e.targetSets ? ` — ${e.targetSets} × ${t ?? ''}` : ''}
              </T>
            );
          })}
          {r.entries.length > 6 ? <T variant="caption" color={colors.faint}>and {r.entries.length - 6} more</T> : null}
          {!data.active ? <Button title="Start" compact variant="secondary" onPress={() => router.push({ pathname: '/workout/start', params: { mode: 'routine', routineId: r.id } })} /> : null}
        </Card>
      ))}
    </Screen>
  );
}
