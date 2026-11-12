import { useState } from 'react';
import { View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { permission } from './device';
import { Settings as Preferences, Root } from './model';
import type { Conflict } from './repository';
import { useApp } from './state';
import { Toggle } from './ProfileData';
import { UnitChips } from './Routines';
import { Badge, Button, Chip, ErrorNote, Item, Kicker, Sheet, T, c, confirm, s, useAction } from './ui';

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function Settings() {
  const app = useApp();
  const [detail, setDetail] = useState<Conflict>();
  const [clockOpen, setClockOpen] = useState(false);
  const [working, setWorking] = useState(false);
  const action = useAction();
  const value = app.settings;
  const time = new Date(); time.setHours(value.hour, value.minute, 0, 0);
  const update = (patch: Partial<Preferences>) => action.run(() => app.save([{ kind: 'settings', id: 'settings', value: { ...value, ...patch } }]));
  async function toggleAlert(key: 'reminders' | 'restAlerts', enabled: boolean) {
    if (!enabled) { update({ [key]: false }); return; }
    setWorking(true);
    try {
      if (!await permission()) { action.setError('Notifications are disabled. You can enable them in system Settings.'); return; }
      update({ [key]: true });
    } catch (error) { action.setError(error instanceof Error ? error.message : 'Could not check notification permission.'); }
    finally { setWorking(false); }
  }
  async function leave() {
    setWorking(true);
    try { await app.signOut(); }
    catch (error) { action.setError(error instanceof Error ? error.message : 'Could not sign out.'); }
    finally { setWorking(false); }
  }
  return <View style={s.column}>
    <View style={s.panel}>
      <Kicker>DISPLAY</Kicker>
      <T kind="label">Preferred weight unit</T>
      <UnitChips unit={value.unit} onChange={unit => update({ unit, chosen: true })} />
      <Toggle label="Show equivalent weight" value={value.both} onChange={both => update({ both })} />
      <T kind="label">Journal text size</T>
      <View style={s.wrap}>{[1, 1.25, 1.5, 2].map(scale => <Chip label={Math.round(scale * 100) + '%'} key={scale}
        selected={value.scale === scale} onPress={() => update({ scale })} />)}</View>
    </View>
    <View style={s.panel}>
      <Kicker>DEVICE ALERTS</Kicker>
      <Toggle label="Rest-end alert" value={value.restAlerts} onChange={v => { if (!working) void toggleAlert('restAlerts', v); }} />
      <Toggle label="Workout reminders" value={value.reminders} onChange={v => { if (!working) void toggleAlert('reminders', v); }} />
      {value.reminders ? <>
        <T kind="small" color={c.muted}>Choose days and a local time. Completing a workout cancels the reminder for that date.</T>
        <View style={s.wrap}>{weekdays.map((day, index) => <Chip key={day} label={day} selected={value.weekdays.includes(index)}
          onPress={() => update({ weekdays: value.weekdays.includes(index) ? value.weekdays.filter(d => d !== index) : [...value.weekdays, index] })} />)}</View>
        <Button label={time.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })} onPress={() => setClockOpen(!clockOpen)} />
        {clockOpen ? <DateTimePicker accessibilityLabel="Reminder time" value={time} themeVariant="dark" mode="time"
          display="spinner" onChange={(event, next) => {
            if (next && event.type !== 'dismissed') update({ hour: next.getHours(), minute: next.getMinutes() });
          }} /> : null}
      </> : null}
    </View>
    <View style={s.panel}>
      <Kicker>{app.account?.demo ? 'DEMO DATA' : 'ACCOUNT SYNC'}</Kicker>
      <T>{app.account?.email}</T>
      {app.account?.demo ? <T color={c.muted}>The sample records are stored on this device in a separate workspace.</T> : <>
        <View style={s.wrap}>
          <Badge label={app.conflicts.length ? 'Needs attention' : app.queued.length ? 'Waiting to upload' : app.syncState.state} color={c.green} />
          <Badge label={`${app.queued.length} pending operations`} />
        </View>
        {app.syncState.detail ? <T color={c.muted}>{app.syncState.detail}</T> : null}
        <Button label="Retry sync" onPress={app.sync} />
        {app.conflicts.map(conflict => <Item key={conflict.kind + conflict.id} title={`Review ${conflict.kind} conflict`} subtitle={conflict.reason} onPress={() => setDetail(conflict)} />)}
      </>}
      <ErrorNote message={action.error} />
      <Button label={app.account?.demo ? 'Close demo journal' : 'Sign out'} tone="danger" disabled={working} onPress={() => void leave()} />
    </View>
    {detail ? <ConflictEditor conflict={detail} close={() => setDetail(undefined)} /> : null}
  </View>;
}

function ConflictEditor({ conflict, close }: { conflict: Conflict; close: () => void }) {
  const app = useApp();
  const action = useAction();
  const local = app.queued.filter(x => x.kind === conflict.kind && x.id === conflict.id).at(-1)?.value;
  function resolve(which: 'remote' | 'local' | 'copy') {
    action.run(() => { app.resolve(conflict, which); close(); });
  }
  const describe = (raw: string | null | undefined) => {
    if (!raw) return 'No saved version';
    const obj = JSON.parse(raw) as Partial<Root['workout'] & Root['exercise'] & Root['routine']>;
    return [obj.name ?? obj.routine, obj.date, obj.state, obj.entries ? obj.entries.length + ' exercise entries' : null].filter(Boolean).join(' · ') || conflict.kind;
  };
  return <Sheet title="Review sync conflict" onClose={close}>
    <T>{conflict.reason}</T>
    <View style={s.panel}><Kicker>ON THIS DEVICE</Kicker><T>{describe(local)}</T>{local ? <T kind="small" selectable>{JSON.stringify(JSON.parse(local), null, 2)}</T> : null}</View>
    <View style={s.panel}><Kicker>ONLINE VERSION</Kicker><T>{describe(conflict.remote)}</T>
      {conflict.remote ? <T kind="small" selectable>{JSON.stringify(JSON.parse(conflict.remote), null, 2)}</T> : null}</View>
    <ErrorNote message={action.error} />
    <Button label="Keep online version" onPress={() => confirm('Use the online version?', 'Local changes to this record will be replaced.', 'Keep online', () => resolve('remote'))} />
    {conflict.kind === 'workout' && local ? <Button label="Keep local as a separate workout" onPress={() => resolve('copy')} />
      : local ? <Button label="Retry with local version" onPress={() => resolve('local')} /> : null}
  </Sheet>;
}
