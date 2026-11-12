import { Alert } from 'react-native';
import type { ConflictRecord } from '../../data/repository';
import { formatDateLong } from '../../domain/dates';
import { SYNC_STATUS_LABEL } from '../../domain/types';
import { useLoad, useSession } from '../../state/session';
import { Banner, Button, Card, Empty, KeyValue, Loading, Row, Screen, Section, StatusPill, T } from '../../ui/kit';
import { colors } from '../../ui/theme';

const KIND_LABEL: Record<string, string> = { workout: 'Workout', exercise: 'Custom exercise', routine: 'Routine', settings: 'Settings', reminder: 'Reminder schedule', goal: 'Lift goal', bodyweight: 'Bodyweight reading', bodyweight_target: 'Bodyweight target' };

function describe(snap: any, kind: string): string {
  if (!snap) return 'Deleted or not on the server';
  if (kind === 'workout') {
    const sets = (snap.entries ?? []).reduce((a: number, e: any) => a + (e.sets ?? []).filter((s: any) => s.state === 'done').length, 0);
    return `${snap.workoutDate ? formatDateLong(snap.workoutDate) : ''} · ${snap.state} · ${sets} sets`;
  }
  return snap.name ?? JSON.stringify(snap).slice(0, 80);
}

const REASON: Record<string, string> = {
  revision: 'Changed on another device after this one last synced.',
  active_workout: 'Another device already has a workout in progress.',
  name_taken: 'The name is already used by another of your records.',
  type_locked: 'The exercise type cannot change because sets use it.',
};

/** FW-09 status, SUP-02 explicit conflict resolution. */
export default function SyncScreen() {
  const { repo, sync, syncState } = useSession();
  const { data } = useLoad(async () => ({ counts: await repo.outboxCounts(), conflicts: await repo.listConflicts() }));
  if (!data) return <Loading />;

  const resolve = (c: ConflictRecord, choice: Parameters<typeof repo.resolveConflict>[1], warn?: string) => {
    const go = async () => {
      try { await repo.resolveConflict(c.aggregateId, choice); void sync.syncNow(); }
      catch (e) { Alert.alert('Not resolved', (e as Error).message); }
    };
    if (warn) Alert.alert('Are you sure?', warn, [{ text: 'Cancel', style: 'cancel' }, { text: 'Continue', style: 'destructive', onPress: go }]);
    else void go();
  };

  return (
    <Screen>
      <Card>
        <StatusPill status={syncState.status} />
        <KeyValue k="Waiting to upload" v={String(data.counts.pending + data.counts.blocked)} />
        <KeyValue k="Needs attention" v={String(data.counts.conflicts)} />
        <KeyValue k="Last successful sync" v={syncState.lastSyncAt ? new Date(syncState.lastSyncAt).toLocaleString() : 'Not yet'} />
        {syncState.lastError ? <Banner tone="warning">{syncState.lastError}</Banner> : null}
        {syncState.status === 'device_only' ? <Banner tone="info">{SYNC_STATUS_LABEL.device_only}. Nothing is uploaded from this profile.</Banner> : (
          <Button title={syncState.running ? 'Syncing…' : 'Sync now'} loading={syncState.running} onPress={() => sync.syncNow()} />
        )}
        <T variant="caption" color={colors.faint}>Sync runs when the app opens, returns to the foreground, reconnects or after you save a change. It does not run while iOS has suspended the app; your work stays saved on this device until then.</T>
      </Card>
      <Section title="Needs attention">
        {data.conflicts.length === 0 ? <Empty title="Nothing to resolve" body="Both versions are always kept when a record changes in two places, until you choose." /> : null}
        {data.conflicts.map((c) => (
          <Card key={c.id}>
            <T variant="h3">{KIND_LABEL[c.kind] ?? c.kind}</T>
            <T variant="small" color={colors.warning}>{c.reason.startsWith('rejected') ? `The server refused this change: ${c.reason.slice(10)}` : REASON[c.reason] ?? c.reason}</T>
            <KeyValue k="This device" v={describe(c.localSnapshot, c.kind)} />
            <KeyValue k="Cloud" v={describe(c.remoteSnapshot, c.kind)} />
            <Row>
              {c.reason === 'revision' && c.kind === 'workout' ? (
                <>
                  <Button title="Keep cloud version" compact variant="secondary" onPress={() => resolve(c, 'keep_remote', 'This device’s version of the workout will be replaced by the cloud version.')} />
                  <Button title="Keep both (save mine as a copy)" compact variant="secondary" onPress={() => resolve(c, 'copy_local')} />
                </>
              ) : null}
              {c.reason === 'revision' && c.kind !== 'workout' ? (
                <>
                  <Button title="Keep cloud version" compact variant="secondary" onPress={() => resolve(c, 'keep_remote', 'This device’s changes to this record will be replaced.')} />
                  <Button title="Keep mine" compact variant="secondary" onPress={() => resolve(c, 'keep_local', 'Your version will replace the cloud version on every device.')} />
                </>
              ) : null}
              {c.reason !== 'revision' ? (
                <>
                  <Button title="Retry upload" compact variant="secondary" onPress={() => resolve(c, 'retry')} />
                  <Button title="Keep on this device only" compact variant="ghost" onPress={() => resolve(c, 'drop_upload', 'This change will stay on this device and will not be uploaded.')} />
                </>
              ) : null}
            </Row>
            {c.reason === 'active_workout' ? <T variant="caption" color={colors.faint}>Finish or discard the workout on the other device (or finish this one), then retry.</T> : null}
            {c.reason === 'name_taken' ? <T variant="caption" color={colors.faint}>Rename your record on this device, then retry.</T> : null}
          </Card>
        ))}
      </Section>
    </Screen>
  );
}
