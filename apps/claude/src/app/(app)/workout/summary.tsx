import { router, useLocalSearchParams } from 'expo-router';
import { useSession, useLoad } from '../../../state/session';
import { Banner, Button, Loading, Screen, StatusPill, T } from '../../../ui/kit';
import { WorkoutSummaryCard } from '../../../ui/WorkoutSummaryCard';
import { colors } from '../../../ui/theme';

/** FW-06: plain summary after finishing; confirms the save and shows upload state. */
export default function Summary() {
  const { id, dropped, skipped, skippedPrep } = useLocalSearchParams<{ id: string; dropped?: string; skipped?: string; skippedPrep?: string }>();
  const { repo, settings, syncState } = useSession();
  const { data } = useLoad(async () => ({ w: await repo.getWorkout(id), ex: await repo.exerciseMap(), pending: await repo.isAggregatePending(id) }), [id]);
  if (!data) return <Loading />;
  if (!data.w) return <Screen><Banner tone="warning">This workout no longer exists.</Banner><Button title="Done" onPress={() => router.replace('/')} /></Screen>;
  const droppedNames = (dropped ?? '').split('\n').filter(Boolean);
  const status = syncState.status === 'device_only' ? 'device_only' : data.pending ? (syncState.status === 'needs_sign_in' ? 'needs_sign_in' : 'waiting') : 'uploaded';
  return (
    <Screen footer={<Button title="Done" onPress={() => router.replace('/')} testID="summary-done" />}>
      <T variant="title" color={colors.success}>Workout saved</T>
      <StatusPill status={status} />
      <WorkoutSummaryCard w={data.w} ex={data.ex} settings={settings} />
      {droppedNames.length ? <Banner tone="info">Removed because they had no sets: {droppedNames.join(', ')}.</Banner> : null}
      {Number(skipped) > 0 || Number(skippedPrep) > 0 ? <Banner tone="info">Saved as skipped: {[Number(skipped) ? `${skipped} planned working sets` : null, Number(skippedPrep) ? `${skippedPrep} preparation steps` : null].filter(Boolean).join(' and ')}.</Banner> : null}
      <Button title="View full workout" variant="secondary" onPress={() => router.push(`/workout/${id}`)} />
      <Button title="Save as routine" variant="secondary" icon="square.and.arrow.down" onPress={() => router.push({ pathname: '/routine/[id]', params: { id: 'new', fromWorkout: id } })} />
    </Screen>
  );
}
