import { router, useLocalSearchParams } from 'expo-router';
import { summarizeWorkout } from '../../../domain/analytics';
import { addDays, formatDateLong, formatDateShort } from '../../../domain/dates';
import { formatAggregate } from '../../../domain/units';
import { useLoad, useSession } from '../../../state/session';
import { plural } from '../../../ui/format';
import { Card, Empty, Loading, Screen, T } from '../../../ui/kit';
import { colors } from '../../../ui/theme';

/** FW-24: a weekly point lists its workouts. */
export default function Week() {
  const { start } = useLocalSearchParams<{ start: string }>();
  const { repo, settings } = useSession();
  const { data } = useLoad(async () => ({ ws: await repo.finishedWorkouts(), ex: await repo.exerciseMap() }), [start]);
  if (!data) return <Loading />;
  const end = addDays(start, 6);
  const list = data.ws.filter((w) => w.workoutDate >= start && w.workoutDate <= end);
  return (
    <Screen>
      <T variant="title">Week of {formatDateShort(start)}</T>
      {list.length === 0 ? <Empty title="No workouts this week" body="This week's volume is zero." /> : null}
      {list.map((w) => {
        const s = summarizeWorkout(w, data.ex, settings.unit);
        return (
          <Card key={w.id} onPress={() => router.push(`/workout/${w.id}`)} accessibilityLabel={`${formatDateLong(w.workoutDate)}, volume ${formatAggregate(s.volume, settings.unit, false)}`}>
            <T weight="700">{formatDateLong(w.workoutDate)}</T>
            <T color={colors.muted}>{s.exerciseNames.join(', ')}</T>
            <T variant="small">{plural(s.workingSets, 'set')} · {formatAggregate(s.volume, settings.unit, settings.showEquivalent)}</T>
          </Card>
        );
      })}
    </Screen>
  );
}
