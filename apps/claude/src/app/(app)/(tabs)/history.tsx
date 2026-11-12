import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';
import type { HistoryRow } from '../../../data/repository';
import { addDays, formatDateLong, formatDuration, todayLocal } from '../../../domain/dates';
import { setPickerTarget } from '../../../state/picker';
import { useApp, useSession } from '../../../state/session';
import { namesWithMore, plural } from '../../../ui/format';
import { Banner, Button, Card, DateField, Empty, Row, StatusPill, T } from '../../../ui/kit';
import { colors, space } from '../../../ui/theme';

/** FW-14 list with keyset paging; FW-19 combinable date-range and exercise filters. */
export default function History() {
  const { repo, syncState } = useSession();
  const { version } = useApp();
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
  useEffect(() => { void load(); }, [load, version]);

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
    <FlatList
      style={{ flex: 1, backgroundColor: colors.canvas }}
      contentContainerStyle={{ padding: space.lg, gap: space.sm, paddingBottom: 40 }}
      data={rows}
      keyExtractor={(r) => r.id}
      onEndReached={more}
      onEndReachedThreshold={0.4}
      ListHeaderComponent={
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
      }
      ListEmptyComponent={
        loading ? <ActivityIndicator color={colors.accent} /> : filtered ? (
          <Empty title="No matching workouts" body="No finished workouts match these filters." action={<Button title="Clear filters" variant="secondary" onPress={() => { setFrom(null); setTo(null); setExercise(null); }} />} />
        ) : (
          <Empty title="No workouts yet" body="Finish a workout on the Train tab and it will appear here. You can also log an earlier session." action={<Button title="Go to Train" variant="secondary" onPress={() => router.navigate('/')} />} />
        )
      }
      renderItem={({ item }) => (
        <Card onPress={() => router.push(`/workout/${item.id}`)} accessibilityLabel={`${formatDateLong(item.workoutDate)}, ${namesWithMore(item.exerciseNames)}, ${plural(item.setCount, 'set')}`}>
          <Row style={{ justifyContent: 'space-between' }}>
            <T weight="700">{formatDateLong(item.workoutDate)}</T>
            <T variant="small" color={colors.muted}>{plural(item.setCount, 'set')}</T>
          </Row>
          <T color={colors.muted}>{namesWithMore(item.exerciseNames) || 'No exercises'}</T>
          <Row style={{ justifyContent: 'space-between' }}>
            <T variant="caption" color={colors.faint}>{item.routineName ?? 'Ad hoc'} · {formatDuration(item.durationSeconds)}</T>
            {syncState.status !== 'device_only' ? <StatusPill status={item.pendingUpload ? 'waiting' : 'uploaded'} /> : null}
          </Row>
        </Card>
      )}
      ListFooterComponent={next ? <ActivityIndicator color={colors.accent} /> : undefined}
    />
  );
}
