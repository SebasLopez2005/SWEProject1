import { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { CalendarDays } from 'lucide-react-native';
import { useApp } from '../../src/state';
import { Exercise, confirmed, prettyDay } from '../../src/model';
import { ExerciseList } from '../../src/ExercisePicker';
import { Badge, Button, DayField, Empty, ErrorNote, Header, Item, Page, Sheet, T, c, s } from '../../src/ui';

export default function History() {
  const app = useApp();
  const router = useRouter();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [exercise, setExercise] = useState<Exercise>();
  const [picking, setPicking] = useState(false);
  const [filters, setFilters] = useState(false);
  const [limit, setLimit] = useState(15);
  const invalid = !!(from && to && from > to);
  const visible = invalid ? [] : app.finished.filter(w =>
    (!from || w.date >= from) && (!to || w.date <= to) && (!exercise || w.entries.some(e => e.exerciseId === exercise.id)));
  return <Page onNearEnd={visible.length > limit ? () => setLimit(n => n + 15) : undefined}>
    <Header eyebrow="TRAINING RECORD" title="History" subtitle="Review your finished sessions and correct recorded sets." />
    <View style={s.wrap}>
      <Button label={filters ? 'Hide filters' : 'Filter history'} onPress={() => setFilters(!filters)} />
      {from || to || exercise ? <Button label="Clear filters" tone="quiet" onPress={() => { setFrom(''); setTo(''); setExercise(undefined); setLimit(15); }} /> : null}
    </View>
    {filters ? <View style={s.panel}>
      <DayField label="From" value={from} onChange={v => { setFrom(v); setLimit(15); }} optional />
      <DayField label="Through" value={to} onChange={v => { setTo(v); setLimit(15); }} optional />
      <Button label={exercise?.name ?? 'Choose exercise'} onPress={() => setPicking(true)} />
      <ErrorNote message={invalid ? 'Choose an end date on or after the start date.' : ''} />
    </View> : null}
    <T color={c.muted}>{visible.length} {visible.length === 1 ? 'workout' : 'workouts'}</T>
    {visible.length ? visible.slice(0, limit).map(w => {
      const names = [...new Set(w.entries.filter(e => e.sets.some(row => row.state === 'done')).map(e => app.exercise(e.exerciseId)?.name ?? 'Unavailable exercise'))];
      return <View key={w.id} style={s.panel}>
        <Item title={prettyDay(w.date)} subtitle={names.slice(0, 3).join(' · ') + (names.length > 3 ? ` and ${names.length - 3} more` : '')}
          onPress={() => router.push({ pathname: '/session/[id]', params: { id: w.id } })} lead={<CalendarDays color={c.accent} size={22} />} />
        <View style={s.wrap}><Badge label={`${confirmed(w).length} sets`} /><Badge label={app.statusFor(w.id)} color={c.green} /></View>
      </View>;
    }) : <Empty title={app.finished.length ? 'No matching workouts' : 'Your log is empty'} detail={app.finished.length
      ? 'Clear filters or try a wider date range.' : 'Finish a session on the Workout tab to start building your history.'} />}
    {visible.length > limit ? <Button label="Load older workouts" onPress={() => setLimit(n => n + 15)} /> : null}
    {picking ? <Sheet title="Filter by exercise" onClose={() => setPicking(false)}>
      <ExerciseList onSelect={e => { setExercise(e); setPicking(false); setLimit(15); }} />
    </Sheet> : null}
  </Page>;
}
