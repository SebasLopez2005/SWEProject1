import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useLayoutEffect, useState } from 'react';
import { Alert, View } from 'react-native';
import { formatDateLong } from '../../../domain/dates';
import { MUSCLE_LABEL } from '../../../domain/preparation';
import { EXERCISE_TYPE_LABEL, PHASE_LABEL, type ExerciseType } from '../../../domain/types';
import { useLoad, useSession } from '../../../state/session';
import { formatActual } from '../../../ui/format';
import { Banner, Button, Card, Empty, Field, Loading, Row, Screen, Section, Segmented, T } from '../../../ui/kit';
import { colors, space } from '../../../ui/theme';

/** FW-16 exercise history (also for archived), TR-06 details, FW-13 rename/archive/restore. */
export default function ExerciseDetail() {
  const { id } = useLocalSearchParams<{ id: string; tab?: string }>();
  const { repo, settings } = useSession();
  const navigation = useNavigation();
  const [renaming, setRenaming] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { data } = useLoad(async () => ({ ex: await repo.getExercise(id), history: await repo.exerciseHistory(id), used: await repo.exerciseIsUsed(id) }), [id]);
  useLayoutEffect(() => navigation.setOptions({ title: data?.ex?.name ?? 'Exercise' }), [navigation, data?.ex?.name]);
  if (!data) return <Loading />;
  const ex = data.ex;
  if (!ex) return <Screen><Empty title="Exercise not found" body="It may have been deleted." /></Screen>;
  const own = ex.ownerId != null;
  const guard = async (fn: () => Promise<void>) => { setError(null); try { await fn(); } catch (e) { setError((e as Error).message); } };

  return (
    <Screen>
      <Card>
        <T variant="h2">{ex.name}</T>
        {ex.archived ? <Banner tone="warning">Archived: hidden from search and pickers. History is kept.</Banner> : null}
        <T color={colors.muted}>{EXERCISE_TYPE_LABEL[ex.type]} · {ex.equipment} · {ex.category}{own ? ' · your exercise' : ''}</T>
        <T variant="small">Primary: {ex.primaryMuscles.map((m) => MUSCLE_LABEL[m] ?? m).join(', ') || 'none tagged'}</T>
        <T variant="small" color={colors.muted}>Secondary: {ex.secondaryMuscles.map((m) => MUSCLE_LABEL[m] ?? m).join(', ') || 'none listed'}</T>
      </Card>
      {ex.instructions ? (
        <Section title="Instructions">
          <Card>{ex.instructions.split('\n').map((line, i) => <T key={i} variant="small">{i + 1}. {line}</T>)}</Card>
        </Section>
      ) : null}
      {ex.type !== 'seconds' && data.history.length ? (
        <Button title="Graph this exercise" variant="secondary" icon="chart.xyaxis.line" onPress={() => router.navigate({ pathname: '/progress', params: { exerciseId: ex.id } })} />
      ) : null}
      {own ? (
        <Section title="Manage">
          <Card>
            {renaming != null ? (
              <>
                <Field label="New name" value={renaming} onChangeText={setRenaming} maxLength={60} />
                <Row>
                  <Button title="Save name" compact onPress={() => guard(async () => { await repo.updateExercise(ex.id, { name: renaming }); setRenaming(null); })} />
                  <Button title="Cancel" compact variant="ghost" onPress={() => setRenaming(null)} />
                </Row>
                <T variant="caption" color={colors.faint}>Renaming updates past workouts and graphs; the exercise keeps its identity.</T>
              </>
            ) : <Button title="Rename" compact variant="secondary" onPress={() => setRenaming(ex.name)} />}
            {data.used ? <T variant="small" color={colors.faint}>Type: {EXERCISE_TYPE_LABEL[ex.type]} (locked because sets use it)</T> : (
              <Segmented label="Exercise type" value={ex.type} onChange={(t: ExerciseType) => guard(() => repo.updateExercise(ex.id, { type: t }))}
                options={(Object.keys(EXERCISE_TYPE_LABEL) as ExerciseType[]).map((t) => ({ value: t, label: EXERCISE_TYPE_LABEL[t] }))} />
            )}
            <Button title={ex.archived ? 'Restore to library' : 'Archive'} compact variant="secondary" onPress={() => guard(() => repo.setArchived(ex.id, !ex.archived))} />
            {!data.used ? (
              <Button title="Delete exercise" compact variant="danger" onPress={() => Alert.alert(`Delete “${ex.name}”?`, 'It has never been used. This cannot be undone.', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => guard(async () => { await repo.deleteExercise(ex.id); router.back(); }) },
              ])} />
            ) : <T variant="caption" color={colors.faint}>Used exercises cannot be deleted; archive it instead.</T>}
            {error ? <Banner tone="danger">{error}</Banner> : null}
          </Card>
        </Section>
      ) : null}
      <Section title={`History (${data.history.length})`}>
        {data.history.length === 0 ? <T color={colors.faint}>You have not logged this exercise yet.</T> : null}
        {data.history.map((h) => (
          <Card key={`${h.workoutId}-${h.phase}`} onPress={() => router.push(`/workout/${h.workoutId}`)} accessibilityLabel={`${formatDateLong(h.date)}: ${h.sets.map((s) => formatActual(s, ex.type, settings.showEquivalent)).join(', ')}`}>
            <Row style={{ justifyContent: 'space-between' }}>
              <T weight="600">{formatDateLong(h.date)}</T>
              {h.phase !== 'work' ? <T variant="caption" color={colors.muted}>{PHASE_LABEL[h.phase]}</T> : null}
            </Row>
            <View style={{ gap: space.xs }}>
              {h.sets.map((s) => <T key={s.id} variant="small" color={colors.muted}>{s.position}. {formatActual(s, ex.type, settings.showEquivalent)}</T>)}
            </View>
          </Card>
        ))}
      </Section>
    </Screen>
  );
}
