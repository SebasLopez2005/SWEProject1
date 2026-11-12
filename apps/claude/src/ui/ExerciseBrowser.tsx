// Shared exercise search (FW-11, TR-06): case-insensitive substring search that
// updates as you type, muscle/equipment/category filters, recent first, and
// a create-custom offer when nothing matches.
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import type { Exercise } from '../domain/types';
import { EXERCISE_TYPE_LABEL } from '../domain/types';
import { MUSCLE_LABEL } from '../domain/preparation';
import { useLoad, useSession } from '../state/session';
import { Button, Chip, Empty, Field, Row, T } from './kit';
import { colors, space } from './theme';

const CATEGORIES = ['strength', 'stretching', 'plyometrics', 'cardio', 'powerlifting', 'olympic weightlifting', 'strongman', 'custom'];
const EQUIPMENT = ['barbell', 'dumbbell', 'body only', 'cable', 'machine', 'kettlebells', 'bands', 'medicine ball', 'exercise ball', 'foam roll', 'e-z curl bar', 'other', 'unknown'];

export function ExerciseBrowser({ onPick, includeArchived = false, header }: { onPick: (e: Exercise) => void; includeArchived?: boolean; header?: React.ReactNode }) {
  const { repo } = useSession();
  const [text, setText] = useState('');
  const [muscle, setMuscle] = useState<string | null>(null);
  const [equipment, setEquipment] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const { data } = useLoad(() => repo.searchExercises(text, { muscle, equipment, category }, includeArchived), [text, muscle, equipment, category, includeArchived]);

  const items = useMemo(() => {
    if (!data) return [];
    const recentIds = new Set(data.recent.map((e) => e.id));
    const rows: ({ kind: 'header'; title: string } | { kind: 'ex'; e: Exercise })[] = [];
    if (data.recent.length) {
      rows.push({ kind: 'header', title: 'Recent' });
      data.recent.forEach((e) => rows.push({ kind: 'ex', e }));
      rows.push({ kind: 'header', title: 'All exercises' });
    }
    data.results.filter((e) => !recentIds.has(e.id)).forEach((e) => rows.push({ kind: 'ex', e }));
    return rows;
  }, [data]);

  const filterCount = [muscle, equipment, category].filter(Boolean).length;

  return (
    <FlatList
      style={{ flex: 1, backgroundColor: colors.canvas }}
      contentContainerStyle={{ padding: space.lg, gap: space.xs, paddingBottom: 60 }}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      automaticallyAdjustKeyboardInsets
      data={items}
      initialNumToRender={20}
      keyExtractor={(r, i) => (r.kind === 'ex' ? r.e.id : `h${i}`)}
      ListHeaderComponent={
        <View style={{ gap: space.sm, marginBottom: space.sm }}>
          {header}
          <Field label="Search exercises" value={text} onChangeText={setText} placeholder="e.g. bench, curl, plank" autoCorrect={false} clearButtonMode="while-editing" returnKeyType="search" />
          <Row style={{ justifyContent: 'space-between' }}>
            <Button title={`Filters${filterCount ? ` (${filterCount})` : ''}`} compact variant="ghost" icon="line.3.horizontal.decrease.circle" onPress={() => setShowFilters((s) => !s)} />
            {filterCount ? <Button title="Clear filters" compact variant="ghost" onPress={() => { setMuscle(null); setEquipment(null); setCategory(null); }} /> : null}
          </Row>
          {showFilters ? (
            <View style={{ gap: space.sm }}>
              <T variant="small" color={colors.muted} weight="600">Muscle</T>
              <Row>{Object.entries(MUSCLE_LABEL).map(([k, v]) => <Chip key={k} label={v} selected={muscle === k} onPress={() => setMuscle(muscle === k ? null : k)} accessibilityLabel={`Muscle filter ${v}`} />)}</Row>
              <T variant="small" color={colors.muted} weight="600">Equipment</T>
              <Row>{EQUIPMENT.map((k) => <Chip key={k} label={k} selected={equipment === k} onPress={() => setEquipment(equipment === k ? null : k)} accessibilityLabel={`Equipment filter ${k}`} />)}</Row>
              <T variant="small" color={colors.muted} weight="600">Category</T>
              <Row>{CATEGORIES.map((k) => <Chip key={k} label={k} selected={category === k} onPress={() => setCategory(category === k ? null : k)} accessibilityLabel={`Category filter ${k}`} />)}</Row>
            </View>
          ) : null}
          {data ? <T variant="caption" color={colors.faint}>{data.results.length} matches</T> : null}
        </View>
      }
      ListEmptyComponent={
        data ? (
          <Empty title="No matching exercise" body={text ? `Nothing matches “${text}”.` : 'No exercises match these filters.'}
            action={<Button title={text ? `Create “${text.trim()}”` : 'Create a custom exercise'} variant="secondary" onPress={() => router.push({ pathname: '/exercises/new', params: { name: text.trim() } })} />} />
        ) : undefined
      }
      renderItem={({ item }) =>
        item.kind === 'header' ? (
          <T variant="small" weight="700" color={colors.muted} style={{ marginTop: space.sm, textTransform: 'uppercase' }}>{item.title}</T>
        ) : (
          <Pressable onPress={() => onPick(item.e)} accessibilityRole="button" accessibilityLabel={`${item.e.name}, ${EXERCISE_TYPE_LABEL[item.e.type]}${item.e.archived ? ', archived' : ''}`}
            style={({ pressed }) => [{ minHeight: 52, paddingVertical: space.sm, paddingHorizontal: space.md, borderRadius: 12, backgroundColor: pressed ? colors.surfaceRaised : colors.surface, gap: 2 }]}>
            <T weight="600">{item.e.name}{item.e.ownerId ? '  ·  yours' : ''}</T>
            <T variant="caption" color={colors.muted}>
              {EXERCISE_TYPE_LABEL[item.e.type]} · {item.e.equipment} · {item.e.primaryMuscles.map((m) => MUSCLE_LABEL[m] ?? m).join(', ') || 'no muscle tags'}{item.e.archived ? ' · archived' : ''}
            </T>
          </Pressable>
        )
      }
      ListFooterComponent={data && data.results.length > 0 ? (
        <Button title="Create a custom exercise" variant="ghost" onPress={() => router.push({ pathname: '/exercises/new', params: { name: text.trim() } })} />
      ) : undefined}
    />
  );
}
