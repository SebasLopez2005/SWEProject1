// Shared exercise search (FW-11, TR-06): case-insensitive substring search that
// updates as you type (deferred so typing never blocks), muscle/equipment/
// category filters, recent first, a create-custom offer when nothing matches,
// and a "How to perform" button on every row (TR-06A).
import { router } from 'expo-router';
import { useDeferredValue, useMemo, useState } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import type { Exercise } from '../domain/types';
import { EXERCISE_TYPE_LABEL } from '../domain/types';
import { MUSCLE_LABEL } from '../domain/preparation';
import { useLoad, useSession } from '../state/session';
import { Button, Chip, Empty, Field, IconButton, Row, SectionLabel, T } from './kit';
import { colors, radius, space } from './theme';

const CATEGORIES = ['strength', 'stretching', 'plyometrics', 'cardio', 'powerlifting', 'olympic weightlifting', 'strongman', 'custom'];
const EQUIPMENT = ['barbell', 'dumbbell', 'body only', 'cable', 'machine', 'kettlebells', 'bands', 'medicine ball', 'exercise ball', 'foam roll', 'e-z curl bar', 'other', 'unknown'];

type Item = { kind: 'header'; title: string } | { kind: 'ex'; e: Exercise; first: boolean; last: boolean };

export function ExerciseBrowser({ onPick, includeArchived = false, header }: { onPick: (e: Exercise) => void; includeArchived?: boolean; header?: React.ReactNode }) {
  const { repo } = useSession();
  const [text, setText] = useState('');
  const query = useDeferredValue(text);
  const [muscle, setMuscle] = useState<string | null>(null);
  const [equipment, setEquipment] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const { data } = useLoad(() => repo.searchExercises(query, { muscle, equipment, category }, includeArchived), [query, muscle, equipment, category, includeArchived], ['exercises']);

  const items = useMemo(() => {
    if (!data) return [] as Item[];
    const recentIds = new Set(data.recent.map((e) => e.id));
    const rows: Item[] = [];
    const push = (list: Exercise[], title: string) => {
      if (!list.length) return;
      rows.push({ kind: 'header', title });
      list.forEach((e, i) => rows.push({ kind: 'ex', e, first: i === 0, last: i === list.length - 1 }));
    };
    push(data.recent, 'Recent');
    push(data.results.filter((e) => !recentIds.has(e.id)), data.recent.length ? 'All exercises' : `${data.results.length} exercises`);
    return rows;
  }, [data]);

  const filterCount = [muscle, equipment, category].filter(Boolean).length;

  return (
    <FlatList
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1, backgroundColor: colors.canvas }}
      contentContainerStyle={{ paddingHorizontal: space.lg, paddingBottom: 60 }}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      automaticallyAdjustKeyboardInsets
      data={items}
      initialNumToRender={18}
      windowSize={9}
      keyExtractor={(r, i) => (r.kind === 'ex' ? r.e.id : `h${i}`)}
      ListHeaderComponent={
        <View style={{ gap: space.sm, marginBottom: space.sm, paddingTop: space.sm }}>
          {header}
          <Field label="Search" value={text} onChangeText={setText} placeholder="Bench, curl, plank…" autoCorrect={false} clearButtonMode="while-editing" returnKeyType="search" />
          <Row style={{ justifyContent: 'space-between' }}>
            <Button title={`Filters${filterCount ? ` · ${filterCount}` : ''}`} compact variant="secondary" icon="line.3.horizontal.decrease" onPress={() => setShowFilters((s) => !s)} />
            {filterCount ? <Button title="Clear" compact variant="ghost" onPress={() => { setMuscle(null); setEquipment(null); setCategory(null); }} /> : null}
          </Row>
          {showFilters ? (
            <View style={{ gap: space.sm }}>
              <SectionLabel>Muscle</SectionLabel>
              <Row gap={6}>{Object.entries(MUSCLE_LABEL).map(([k, v]) => <Chip key={k} label={v} selected={muscle === k} onPress={() => setMuscle(muscle === k ? null : k)} accessibilityLabel={`Muscle filter ${v}`} />)}</Row>
              <SectionLabel>Equipment</SectionLabel>
              <Row gap={6}>{EQUIPMENT.map((k) => <Chip key={k} label={k} selected={equipment === k} onPress={() => setEquipment(equipment === k ? null : k)} accessibilityLabel={`Equipment filter ${k}`} />)}</Row>
              <SectionLabel>Category</SectionLabel>
              <Row gap={6}>{CATEGORIES.map((k) => <Chip key={k} label={k} selected={category === k} onPress={() => setCategory(category === k ? null : k)} accessibilityLabel={`Category filter ${k}`} />)}</Row>
            </View>
          ) : null}
        </View>
      }
      ListEmptyComponent={
        data ? (
          <Empty title="No matching exercise" body={text ? `Nothing matches “${text}”.` : 'No exercises match these filters.'} icon="magnifyingglass"
            action={<Button title={text ? `Create “${text.trim()}”` : 'Create a custom exercise'} variant="secondary" compact onPress={() => router.push({ pathname: '/exercises/new', params: { name: text.trim() } })} />} />
        ) : undefined
      }
      renderItem={({ item }) =>
        item.kind === 'header' ? (
          <View style={{ marginTop: space.md, marginBottom: 6 }}><SectionLabel>{item.title}</SectionLabel></View>
        ) : (
          <View style={[{ backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center' },
            item.first && { borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg }, item.last && { borderBottomLeftRadius: radius.lg, borderBottomRightRadius: radius.lg },
            !item.first && { borderTopWidth: 0.5, borderTopColor: colors.separator }]}>
            <Pressable onPress={() => onPick(item.e)} accessibilityRole="button" accessibilityLabel={`${item.e.name}, ${EXERCISE_TYPE_LABEL[item.e.type]}${item.e.archived ? ', archived' : ''}`}
              style={({ pressed }) => [{ flex: 1, minHeight: 50, paddingVertical: 8, paddingLeft: space.lg, gap: 1, justifyContent: 'center' }, pressed && { opacity: 0.6 }]}>
              <T weight="500" numberOfLines={1}>{item.e.name}{item.e.ownerId ? '  ·  yours' : ''}</T>
              <T variant="caption" color={colors.muted} numberOfLines={1}>
                {item.e.primaryMuscles.map((m) => MUSCLE_LABEL[m] ?? m).join(', ') || 'No muscle tags'} · {item.e.equipment}{item.e.archived ? ' · archived' : ''}
              </T>
            </Pressable>
            <IconButton icon="info.circle" label={`How to perform ${item.e.name}`} onPress={() => router.push({ pathname: '/form/[id]', params: { id: item.e.id } })} color={colors.accent} fallback="i" />
            <View style={{ width: 6 }} />
          </View>
        )
      }
      ListFooterComponent={data && data.results.length > 0 ? (
        <View style={{ marginTop: space.md }}><Button title="Create a custom exercise" variant="ghost" compact icon="plus" onPress={() => router.push({ pathname: '/exercises/new', params: { name: text.trim() } })} /></View>
      ) : undefined}
    />
  );
}


