import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import type { HistoryRow } from '../../../../data/repository';
import { addDays, formatDateLong, formatDuration, todayLocal } from '../../../../domain/dates';
import { setPickerTarget } from '../../../../state/picker';
import { useApp, useSession } from '../../../../state/session';
import { namesWithMore, plural } from '../../../../ui/format';
import { Banner, Button, Screen, Card, DateField, Empty, Row, StatusPill, T } from '../../../../ui/kit';
import { colors, radius, space } from '../../../../ui/theme';

/** FW-14 list with keyset paging; FW-19 combinable date-range and exercise filters. */
export default function History() {
  const { repo, syncState } = useSession();
  const { versions } = useApp();
  const dataKey = `${versions.finished}.${versions.exercises}.${versions.sync}`;
  const [rows, setRows] = useState<HistoryRow[]>([]);
  const [next, setNext] = useState<{ date: string; id: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [from, setFrom] = useState<string | null>(null);
  const [to, setTo] = useState<string | null>(null);
  const [exercise, setExercise] = useState<{ id: string; name: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const filtered = !!(from || to || exercise);

  const load = useCallback(async () => {
    try {
      const page = await repo.historyPage({ from, to, exerciseId: exercise?.id }, null, 20);
      setRows(page.rows);
      setNext(page.next);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [repo, from, to, exercise]);

  // State is set only after the async page read resolves (reload on filter or data-change events).
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void load(); }, [load, dataKey]);

  const more = async () => {
    if (!next || loading) return;
    setLoading(true);
    const page = await repo.historyPage({ from, to, exerciseId: exercise?.id }, next, 20);
    setRows((r) => [...r, ...page.rows]);
    setNext(page.next);
    setLoading(false);
  };

  const pickExercise = () => {
    setPickerTarget(async (id) => setExercise({ id, name: (await repo.getExercise(id))?.name ?? 'Exercise' }), 'Filter by exercise', true);
    router.push('/picker');
  };

  return (
    <Screen>
        <View style={{ gap: space.sm }}>
          <Row style={{ justifyContent: 'space-between' }}>
            <Button title={filtered ? 'Filters (on)' : 'Filter'} compact variant="ghost" icon="line.3.horizontal.decrease.circle" onPress={() => setShowFilters((s) => !s)} />
            {filtered ? <Button title="Clear filters" compact variant="ghost" onPress={() => { setFrom(null); setTo(null); setExercise(null); }} /> : null}
          </Row>
          {showFilters ? (
            <Card>
              <Row>
                <Button title={from ? 'Change start' : 'Set start date'} compact variant="secondary" onPress={() => setFrom(from ?? addDays(todayLocal(), -30))} />
                <Button title={to ? 'Change end' : 'Set end date'} compact variant="secondary" onPress={() => setTo(to ?? todayLocal())} />
              </Row>
              {from ? <DateField label="From" value={from} onChange={setFrom} /> : null}
              {to ? <DateField label="To" value={to} onChange={setTo} minimum={from ?? undefined} /> : null}
              <Button title={exercise ? `Exercise: ${exercise.name}` : 'Choose an exercise'} compact variant="secondary" onPress={pickExercise} />
              {exercise ? <Button title="Remove exercise filter" compact variant="ghost" onPress={() => setExercise(null)} /> : null}
            </Card>
          ) : null}
          {from && to && from > to ? <Banner tone="warning">The start date is after the end date.</Banner> : null}
          {error ? <Banner tone="danger">{error}</Banner> : null}
        </View>
      {rows.length === 0 ? (
        loading ? <ActivityIndicator color={colors.accent} /> : filtered ? (
          <Empty title="No matching workouts" body="No finished workouts match these filters." action={<Button title="Clear filters" variant="secondary" onPress={() => { setFrom(null); setTo(null); setExercise(null); }} />} />
        ) : (
          <Empty title="No workouts yet" body="Finish a workout on the Train tab and it will appear here. You can also log an earlier session." action={<Button title="Go to Train" variant="secondary" onPress={() => router.navigate('/')} />} />
        )
      ) : null}
      {rows.map((item) => (
        <Pressable key={item.id} onPress={() => router.push(`/workout/${item.id}`)} accessibilityRole="button"
          accessibilityLabel={`${formatDateLong(item.workoutDate)}, ${namesWithMore(item.exerciseNames)}, ${plural(item.setCount, 'set')}`}
          style={({ pressed }) => [{ backgroundColor: pressed ? colors.surfacePressed : colors.surface, borderRadius: radius.lg, paddingVertical: space.md, paddingHorizontal: space.lg, gap: 3 }]}>
          <Row style={{ justifyContent: 'space-between', flexWrap: 'nowrap' }}>
            <T weight="600">{formatDateLong(item.workoutDate)}</T>
            <T variant="small" color={colors.muted} tabular>{plural(item.setCount, 'set')}</T>
          </Row>
          <T variant="small" color={colors.muted} numberOfLines={2}>{namesWithMore(item.exerciseNames) || 'No exercises'}</T>
          <Row style={{ justifyContent: 'space-between', flexWrap: 'nowrap' }}>
            <T variant="caption" color={colors.faint}>{item.routineName ?? 'Ad hoc'} · {formatDuration(item.durationSeconds)}</T>
            {syncState.status !== 'device_only' && item.pendingUpload ? <StatusPill status="waiting" short /> : null}
          </Row>
        </Pressable>
      ))}
      {next ? (
        loading ? <ActivityIndicator color={colors.accent} /> : <Button title="Show older workouts" variant="ghost" compact onPress={() => void more()} />
      ) : null}
    </Screen>
  );
}
