import * as Crypto from 'expo-crypto';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Switch, View } from 'react-native';
import { cloudHost } from '../../auth/config';
import { CATALOG_RELEASE } from '../../data/catalog';
import { seedDemoData } from '../../data/demo';
import { weekdayShort } from '../../domain/dates';
import type { Unit } from '../../domain/types';
import { reconcileReminders, type ReminderStatus } from '../../device/reminders';
import { useApp, useSession } from '../../state/session';
import { Banner, Button, Card, Chip, Field, Row, Screen, Section, Segmented, StatusPill, T } from '../../ui/kit';
import { colors, space } from '../../ui/theme';

const SCALES = [1, 1.25, 1.5, 1.75, 2];

/** FW-10, FW-29, FW-30, TR-12, account and sync. */
export default function SettingsScreen() {
  const { repo, settings, identity, syncState } = useSession();
  const { signOut } = useApp();
  const [reminder, setReminder] = useState<{ enabled: boolean; weekdays: number[]; time: string } | null>(null);
  const [reminderStatus, setReminderStatus] = useState<ReminderStatus | null>(null);
  const [time, setTime] = useState('18:00');
  const [error, setError] = useState<string | null>(null);
  const [demo, setDemo] = useState<string | null>(null);

  useEffect(() => {
    void repo.getReminder().then((r) => { setReminder(r); setTime(r.time); });
  }, [repo]);

  const saveReminder = async (patch: Partial<{ enabled: boolean; weekdays: number[]; time: string }>) => {
    if (!reminder) return;
    const next = { ...reminder, ...patch };
    setError(null);
    try {
      await repo.updateReminder(next);
      setReminder(next);
      setReminderStatus(await reconcileReminders(repo, next.enabled));
    } catch (e) { setError((e as Error).message); }
  };

  const doSignOut = async () => {
    const c = await repo.outboxCounts();
    const pending = c.pending + c.blocked + c.conflicts;
    if (identity.kind === 'device') {
      return Alert.alert('Leave this device-only profile?', 'Your data stays on this device and returns when you choose “Continue on this device only” again.', [
        { text: 'Cancel', style: 'cancel' }, { text: 'Leave', onPress: () => void signOut() },
      ]);
    }
    if (pending > 0) {
      return Alert.alert('Work has not been uploaded', `${pending} change(s) are still only on this device. Sync first, or sign out anyway — the changes stay saved on this device under this account and upload after you sign in again.`, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Review sync', onPress: () => router.push('/sync') },
        { text: 'Sign out anyway', style: 'destructive', onPress: () => void signOut() },
      ]);
    }
    Alert.alert('Sign out?', 'You will need a connection to sign in again.', [{ text: 'Cancel', style: 'cancel' }, { text: 'Sign out', onPress: () => void signOut() }]);
  };

  return (
    <Screen>
      <Section title="Units">
        <Card>
          <Segmented label="Weight unit" value={settings.unit} onChange={(u: Unit) => repo.updateSettings({ unit: u })} options={[{ value: 'kg', label: 'Kilograms (kg)' }, { value: 'lb', label: 'Pounds (lb)' }]} />
          <T variant="small" color={colors.muted}>Totals and graphs use this unit. Each set keeps the unit it was entered in; nothing stored is rewritten.</T>
          <Row style={{ justifyContent: 'space-between', flexWrap: 'nowrap' }}>
            <View style={{ flex: 1 }}>
              <T weight="600">Show the other unit too</T>
              <T variant="small" color={colors.muted}>{settings.showEquivalent ? 'e.g. 60 kg (132.3 lb)' : 'e.g. 60 kg'}</T>
            </View>
            <Switch value={settings.showEquivalent} onValueChange={(v) => repo.updateSettings({ showEquivalent: v })} accessibilityLabel="Show equivalent weight in the other unit" trackColor={{ true: colors.accent }} />
          </Row>
        </Card>
      </Section>

      <Section title="Text size">
        <Card>
          <Row>{SCALES.map((s) => <Chip key={s} label={`${Math.round(s * 100)}%`} selected={settings.textScale === s} onPress={() => repo.updateSettings({ textScale: s })} accessibilityLabel={`Text size ${Math.round(s * 100)} percent`} />)}</Row>
          <T>Preview: Bench Press · 60 kg × 8</T>
          <T variant="caption" color={colors.faint}>Remembered on this device and synced with your account. The system Dynamic Type setting also applies.</T>
        </Card>
      </Section>

      <Section title="Workout reminders">
        <Card>
          <Row style={{ justifyContent: 'space-between' }}>
            <T weight="600">Remind me to train</T>
            <Switch value={!!reminder?.enabled} onValueChange={(v) => saveReminder({ enabled: v })} accessibilityLabel="Workout reminders" trackColor={{ true: colors.accent }} />
          </Row>
          {reminder?.enabled ? (
            <>
              <Row>{[1, 2, 3, 4, 5, 6, 7].map((d) => (
                <Chip key={d} label={weekdayShort(d)} selected={reminder.weekdays.includes(d)} accessibilityLabel={`Remind on ${weekdayShort(d)}`}
                  onPress={() => saveReminder({ weekdays: reminder.weekdays.includes(d) ? reminder.weekdays.filter((x) => x !== d) : [...reminder.weekdays, d] })} />
              ))}</Row>
              <Row style={{ alignItems: 'flex-end' }}>
                <View style={{ width: 120 }}><Field label="Time (24 h)" value={time} onChangeText={setTime} placeholder="18:00" keyboardType="numbers-and-punctuation" maxLength={5} /></View>
                <Button title="Save time" compact variant="secondary" onPress={() => saveReminder({ time })} />
              </Row>
              <T variant="caption" color={colors.faint}>No reminder is sent on a day you have already finished a workout.</T>
            </>
          ) : <T variant="small" color={colors.muted}>Off. Logging works the same either way.</T>}
          {reminderStatus === 'permission_denied' ? <Banner tone="warning">Notifications are turned off for Repwise in iOS Settings, so reminders cannot be delivered. Everything else keeps working.</Banner> : null}
          {reminderStatus === 'scheduled' ? <T variant="small" color={colors.success}>Reminders scheduled.</T> : null}
          {error ? <Banner tone="danger">{error}</Banner> : null}
        </Card>
      </Section>

      <Section title="Account and sync">
        <Card>
          <T weight="600">{identity.kind === 'cloud' ? identity.email : 'Device-only profile (no cloud account)'}</T>
          {identity.kind === 'cloud' ? <T variant="small" color={colors.muted}>Server: {cloudHost()}</T> : <T variant="small" color={colors.muted}>Data is never uploaded or backed up from this profile.</T>}
          <StatusPill status={syncState.status} />
          <Button title="Sync status and conflicts" variant="secondary" onPress={() => router.push('/sync')} />
          <Button title={identity.kind === 'cloud' ? 'Sign out' : 'Leave device-only profile'} variant="ghost" onPress={doSignOut} />
        </Card>
      </Section>

      <Section title="Demonstration">
        <Card>
          <T variant="small" color={colors.muted}>Adds three routines, about nine weeks of realistic workouts (including one in pounds), two lift goals and bodyweight readings to this account so every screen has data.</T>
          <Button title="Load demo data" variant="secondary" onPress={async () => {
            setDemo('Adding demo data…');
            try { const r = await seedDemoData(repo, () => Crypto.randomUUID()); setDemo(`Added ${r.workouts} workouts, routines, goals and bodyweight.`); }
            catch (e) { setDemo(`Could not add demo data: ${(e as Error).message}`); }
          }} />
          {demo ? <T variant="small" color={colors.muted}>{demo}</T> : null}
        </Card>
      </Section>

      <Section title="About">
        <Card>
          <T variant="small" color={colors.muted}>Exercise catalog: Free Exercise DB ({CATALOG_RELEASE.license}), revision {CATALOG_RELEASE.sourceRevision.slice(0, 7)}. Muscle tags come from that catalog.</T>
          <T variant="small" color={colors.muted}>Repwise — CS3365 Fitness &amp; Workout Log, Claude implementation.</T>
        </Card>
      </Section>
      <View style={{ height: space.lg }} />
    </Screen>
  );
}
