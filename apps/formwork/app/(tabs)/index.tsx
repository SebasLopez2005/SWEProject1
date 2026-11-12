import { useState } from 'react';
import { View } from 'react-native';
import { ArrowUpRight, Dumbbell, LibraryBig, Play, Plus } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useApp } from '../../src/state';
import { Badge, Button, Empty, ErrorNote, Item, Kicker, Page, T, c, confirm, s, useAction } from '../../src/ui';
import { Routine, daysFrom, prettyDay, working } from '../../src/model';
import { RoutineEditor, RoutineTile, UnitChips } from '../../src/Routines';
import { Start } from '../../src/Start';
import { totals } from '../../src/analytics';

export default function Today() {
  const app = useApp();
  const router = useRouter();
  const [start, setStart] = useState<Routine | 'blank'>();
  const [editing, setEditing] = useState<Routine | 'new'>();
  const action = useAction();
  const current = app.active;
  const recent = app.finished.filter(w => w.date >= daysFrom(-6));
  const week = totals(recent, app.settings.unit);
  const label = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
  const open = (id: string) => router.push({ pathname: '/session/[id]', params: { id } });

  return <Page>
    <View style={s.spread}>
      <View style={[s.row, s.flex]}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 2, padding: 7, borderRadius: 7, backgroundColor: '#393125' }} accessibilityElementsHidden>
          {[6, 10, 15].map(height => <View key={height} style={{ width: 4, height, borderRadius: 1, backgroundColor: c.accent }} />)}
        </View>
        <Kicker>FORMWORK</Kicker>
      </View>
      <Badge label={app.account?.demo ? 'LOCAL DEMO' : app.online ? 'ACCOUNT' : 'OFFLINE'} color={app.online ? c.green : c.accent} />
    </View>

    <View style={{ gap: 7, paddingTop: 7 }}>
      <Kicker color={c.muted}>{label}</Kicker>
      <T kind="hero" accessibilityRole="header">Training journal</T>
      <T color={c.muted}>Pick a routine or log a session as you go.</T>
    </View>

    <View style={[s.panel, { padding: 19, gap: 14, backgroundColor: '#262a21', borderColor: '#414838' }]}>
      <View style={s.spread}>
        <Kicker color={c.green}>{current ? 'SESSION IN PROGRESS' : 'TODAY’S WORKOUT'}</Kicker>
        <Dumbbell size={24} color={c.green} />
      </View>
      <View style={{ gap: 6 }}>
        <T kind="title">{current ? current.routine ?? 'Ad hoc workout' : 'Ready to lift?'}</T>
        <T color={c.muted}>{current ? `${working(current).length} working ${working(current).length === 1 ? 'set' : 'sets'} saved · ${prettyDay(current.date)}` : 'Add sets as you go, or start from one of your routines below.'}</T>
      </View>
      {current ? <>
        <Button label="Resume workout" tone="primary" icon={<Play size={18} color={c.ink} />} onPress={() => open(current.id)} />
        <Button label="Discard workout" compact tone="danger" onPress={() => confirm('Discard this workout?', 'The active session and its sets will be removed.', 'Discard', () =>
          action.run(() => app.save([{ kind: 'workout', id: current.id, value: null }], null)))} />
      </> : <Button label="Start ad hoc workout" testID="start-ad-hoc" tone="primary" icon={<Plus size={19} color={c.ink} />} onPress={() => setStart('blank')} />}
    </View>
    <ErrorNote message={action.error} />
    {!app.settings.chosen && !app.account?.demo ? <View style={s.panel}><T kind="label">Choose your display unit</T>
      <T kind="small" color={c.muted}>You can still enter individual sets in either unit.</T>
      <UnitChips unit={app.settings.unit} onChange={unit => action.run(() => app.save([{ kind: 'settings', id: 'settings', value: { ...app.settings, chosen: true, unit } }]))} />
    </View> : null}

    <View style={[s.panel, { gap: 12 }]}>
      <View style={s.spread}><Kicker>LAST 7 DAYS</Kicker><ArrowUpRight size={17} color={c.accent} /></View>
      <View style={s.wrap}>
        {[['Sessions', week.sessions], ['Working sets', week.sets]].map(([name, value]) => <View key={name}
          style={{ flexGrow: 1, flexBasis: 120, backgroundColor: c.raised, borderRadius: 14, padding: 12, gap: 3 }}>
          <T kind="metric">{value}</T><T kind="small" color={c.muted}>{name}</T>
        </View>)}
      </View>
    </View>

    <View style={s.spread}><T kind="sub" style={s.flex} accessibilityRole="header">Your routines</T>
      <Button label="View all" tone="quiet" compact onPress={() => router.push('/routines')} /></View>
    {app.routines.length ? app.routines.slice(0, 2).map(routine =>
      <RoutineTile key={routine.id} routine={routine} onPress={() => setEditing(routine)} onStart={() => setStart(routine)} />) : <>
      <Empty title="No routines yet" detail="Save a set of exercises and targets to repeat next time." />
      <Button label="Create routine" onPress={() => setEditing('new')} />
    </>}
    <View style={s.panel}><Item title="Exercise library" subtitle={`${app.exercises.length} offline movements`} onPress={() => router.push('/library')}
      lead={<LibraryBig color={c.accent} size={21} />} /></View>
    {start ? <Start routine={start === 'blank' ? undefined : start} onClose={() => setStart(undefined)} /> : null}
    {editing ? <RoutineEditor routine={editing === 'new' ? undefined : editing} onClose={() => setEditing(undefined)} /> : null}
  </Page>;
}
