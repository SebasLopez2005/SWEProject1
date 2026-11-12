import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useLayoutEffect, useState } from 'react';
import { Alert, Switch, View } from 'react-native';
import type { RoutineInput } from '../../../data/repository';
import { DomainError, type Exercise, type Phase, type RestMode, type Unit } from '../../../domain/types';
import { setPickerTarget } from '../../../state/picker';
import { useSession } from '../../../state/session';
import { Banner, Button, Card, Field, IconButton, Loading, Row, Screen, Section, Segmented, T } from '../../../ui/kit';
import { colors, space } from '../../../ui/theme';

type Draft = {
  key: string;
  exerciseId: string;
  phase: Phase;
  planned: boolean;
  sets: string;
  reps: string;
  seconds: string;
  load: string;
  unit: Unit;
  rirMin: string;
  rirMax: string;
  restMode: RestMode;
  rest: string;
};

const num = (s: string) => (s.trim() === '' ? null : Number(s.replace(',', '.')));
let keySeq = 0;

/** FW-25 save-as (reviewed), FW-27 create/edit/reorder/remove, FW-28 delete, TR-01 targets. */
export default function RoutineEditor() {
  const { id, fromWorkout } = useLocalSearchParams<{ id: string; fromWorkout?: string }>();
  const isNew = id === 'new';
  const { repo, settings } = useSession();
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [rest, setRest] = useState('');
  const [rows, setRows] = useState<Draft[]>([]);
  const [exMap, setExMap] = useState<Map<string, Exercise> | null>(null);
  const [copyActuals, setCopyActuals] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const toDraft = (e: RoutineInput['entries'][number]): Draft => ({
    key: `k${keySeq++}`, exerciseId: e.exerciseId, phase: e.phase, planned: e.targetSets != null, sets: e.targetSets != null ? String(e.targetSets) : '3',
    reps: e.targetReps != null ? String(e.targetReps) : '', seconds: e.targetSeconds != null ? String(e.targetSeconds) : '',
    load: e.targetLoad != null ? String(e.targetLoad) : '', unit: e.targetUnit ?? settings.unit, rirMin: e.targetRirMin != null ? String(e.targetRirMin) : '',
    rirMax: e.targetRirMax != null ? String(e.targetRirMax) : '', restMode: e.restMode, rest: e.restSeconds != null ? String(e.restSeconds) : '',
  });

  useEffect(() => {
    (async () => {
      setExMap(await repo.exerciseMap());
      if (!isNew) {
        const r = await repo.getRoutine(id);
        if (!r) return setError('This routine no longer exists.');
        setName(r.name);
        setRest(r.defaultRestSeconds != null ? String(r.defaultRestSeconds) : '');
        setRows(r.entries.map(toDraft));
      } else if (fromWorkout) {
        const d = await repo.routineDraftFromWorkout(fromWorkout, copyActuals);
        setName((n) => n || d.name);
        setRest(d.defaultRestSeconds != null ? String(d.defaultRestSeconds) : '');
        setRows(d.entries.map(toDraft));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, fromWorkout, copyActuals]);

  useLayoutEffect(() => navigation.setOptions({ title: isNew ? (fromWorkout ? 'Save as routine' : 'New routine') : 'Edit routine' }), [navigation, isNew, fromWorkout]);

  const update = (key: string, patch: Partial<Draft>) => setRows((rs) => rs.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  const move = (i: number, d: -1 | 1) => setRows((rs) => { const n = [...rs]; const j = i + d; if (j < 0 || j >= n.length) return rs; [n[i], n[j]] = [n[j], n[i]]; return n; });

  const add = () => {
    setPickerTarget(async (exerciseId) => {
      const ex = await repo.getExercise(exerciseId);
      setRows((rs) => [...rs, { key: `k${keySeq++}`, exerciseId, phase: ex?.category === 'stretching' ? 'mobility' : 'work', planned: true, sets: '3', reps: ex?.type === 'seconds' ? '' : '10', seconds: ex?.type === 'seconds' ? '30' : '', load: '', unit: settings.unit, rirMin: '', rirMax: '', restMode: 'inherit', rest: '' }]);
    }, 'Add to routine');
    router.push('/picker');
  };

  const save = async () => {
    setError(null);
    try {
      const entries: RoutineInput['entries'] = rows.map((r) => {
        const type = exMap?.get(r.exerciseId)?.type;
        return {
          exerciseId: r.exerciseId, phase: r.phase, targetSets: r.planned ? num(r.sets) : null,
          targetReps: r.planned && type !== 'seconds' ? num(r.reps) : null, targetSeconds: r.planned && type === 'seconds' ? num(r.seconds) : null,
          targetLoad: r.planned && type === 'weight_reps' ? num(r.load) : null, targetUnit: r.planned && type === 'weight_reps' && r.load.trim() ? r.unit : null,
          targetRirMin: r.planned && type !== 'seconds' ? num(r.rirMin) : null, targetRirMax: r.planned && type !== 'seconds' ? num(r.rirMax) : null,
          restMode: r.restMode, restSeconds: r.restMode === 'duration' ? num(r.rest) : null,
        };
      });
      for (const e of entries) for (const v of [e.targetSets, e.targetReps, e.targetSeconds, e.targetLoad, e.targetRirMin, e.targetRirMax, e.restSeconds])
        if (v != null && Number.isNaN(v)) throw new DomainError('Targets must be numbers.');
      const restN = num(rest);
      if (restN != null && Number.isNaN(restN)) throw new DomainError('Default rest must be a number of seconds.');
      await repo.saveRoutine({ id: isNew ? undefined : id, name, defaultRestSeconds: restN, entries });
      setSaved(true);
      router.back();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const del = () =>
    Alert.alert(`Delete “${name}”?`, 'Finished workouts started from this routine are not changed.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete routine', style: 'destructive', onPress: async () => { await repo.deleteRoutine(id); router.back(); } },
    ]);

  if (!exMap) return <Loading />;
  void saved;
  return (
    <Screen footer={<Button title="Save routine" onPress={save} testID="save-routine" />}>
      <Field label="Routine name" value={name} onChangeText={setName} maxLength={60} placeholder="e.g. Upper A" hint={`${name.trim().length}/60 characters`} />
      <Field label="Default rest between sets (seconds, optional)" value={rest} onChangeText={setRest} keyboardType="number-pad" placeholder="90" hint="Used when an exercise inherits the workout default." />
      {fromWorkout ? (
        <Card>
          <Row style={{ justifyContent: 'space-between' }}>
            <View style={{ flex: 1 }}>
              <T weight="600">Use this workout’s results as targets</T>
              <T variant="small" color={colors.muted}>Off: saves exercises in the order performed, without sets. On: copies set count, last reps and load as targets.</T>
            </View>
            <Switch value={copyActuals} onValueChange={setCopyActuals} accessibilityLabel="Use this workout's results as targets" trackColor={{ true: colors.accent }} />
          </Row>
        </Card>
      ) : null}
      {error ? <Banner tone="danger">{error}</Banner> : null}
      <Section title="Exercises">
        {rows.length === 0 ? <T color={colors.faint}>No exercises yet. Add them in the order you train.</T> : null}
        {rows.map((r, i) => {
          const ex = exMap.get(r.exerciseId);
          const type = ex?.type ?? 'weight_reps';
          return (
            <Card key={r.key}>
              <Row style={{ justifyContent: 'space-between', flexWrap: 'nowrap' }}>
                <View style={{ flex: 1 }}>
                  <T variant="h3">{i + 1}. {ex?.name ?? 'Unknown exercise'}</T>
                  {ex?.archived ? <T variant="caption" color={colors.warning}>Archived — kept, but cannot be newly added</T> : null}
                </View>
                <IconButton icon="arrow.up" label={`Move ${ex?.name} up`} onPress={() => move(i, -1)} disabled={i === 0} fallback="↑" />
                <IconButton icon="arrow.down" label={`Move ${ex?.name} down`} onPress={() => move(i, 1)} disabled={i === rows.length - 1} fallback="↓" />
                <IconButton icon="minus.circle" label={`Remove ${ex?.name}`} color={colors.danger} onPress={() => setRows((rs) => rs.filter((x) => x.key !== r.key))} fallback="−" />
              </Row>
              <Segmented label={`Phase for ${ex?.name}`} value={r.phase} onChange={(phase) => update(r.key, { phase })} options={[{ value: 'warmup', label: 'Warm-up' }, { value: 'work', label: 'Working' }, { value: 'mobility', label: 'Mobility' }]} />
              <Row style={{ justifyContent: 'space-between' }}>
                <T>Planned sets and targets</T>
                <Switch value={r.planned} onValueChange={(planned) => update(r.key, { planned })} accessibilityLabel={`Planned sets for ${ex?.name}`} trackColor={{ true: colors.accent }} />
              </Row>
              {r.planned ? (
                <View style={{ gap: space.sm }}>
                  <Row style={{ alignItems: 'flex-start' }}>
                    <View style={{ width: 80 }}><Field label="Sets" value={r.sets} onChangeText={(sets) => update(r.key, { sets })} keyboardType="number-pad" /></View>
                    {type === 'seconds' ? (
                      <View style={{ width: 110 }}><Field label="Seconds" value={r.seconds} onChangeText={(seconds) => update(r.key, { seconds })} keyboardType="number-pad" /></View>
                    ) : (
                      <View style={{ width: 80 }}><Field label="Reps" value={r.reps} onChangeText={(reps) => update(r.key, { reps })} keyboardType="number-pad" /></View>
                    )}
                    {type === 'weight_reps' ? (
                      <View style={{ width: 110 }}><Field label={`Load (${r.unit}, optional)`} value={r.load} onChangeText={(load) => update(r.key, { load })} keyboardType="decimal-pad" /></View>
                    ) : null}
                  </Row>
                  {type === 'weight_reps' ? <Segmented label="Load unit" value={r.unit} onChange={(unit) => update(r.key, { unit })} options={[{ value: 'kg', label: 'kg' }, { value: 'lb', label: 'lb' }]} /> : null}
                  {type !== 'seconds' ? (
                    <Row style={{ alignItems: 'flex-start' }}>
                      <View style={{ width: 120 }}><Field label="Target RIR min" value={r.rirMin} onChangeText={(rirMin) => update(r.key, { rirMin })} keyboardType="number-pad" placeholder="opt." /></View>
                      <View style={{ width: 120 }}><Field label="Target RIR max" value={r.rirMax} onChangeText={(rirMax) => update(r.key, { rirMax })} keyboardType="number-pad" placeholder="opt." /></View>
                    </Row>
                  ) : null}
                  <T variant="caption" color={colors.faint}>RIR (reps in reserve) is how many more reps you think you could have done.</T>
                </View>
              ) : <T variant="small" color={colors.faint}>Exercise only: sets are added during the workout.</T>}
              {r.phase === 'work' ? (
                <>
                  <Segmented label={`Rest for ${ex?.name}`} value={r.restMode} onChange={(restMode) => update(r.key, { restMode })} options={[{ value: 'inherit', label: 'Default rest' }, { value: 'duration', label: 'Custom' }, { value: 'off', label: 'No rest timer' }]} />
                  {r.restMode === 'duration' ? <Field label="Rest seconds" value={r.rest} onChangeText={(v) => update(r.key, { rest: v })} keyboardType="number-pad" /> : null}
                </>
              ) : null}
            </Card>
          );
        })}
        <Button title="Add exercise" variant="secondary" icon="plus.circle" onPress={add} />
      </Section>
      <T variant="caption" color={colors.faint}>Changes apply to future workouts only. Workouts already started or finished keep their own copy.</T>
      {!isNew ? <Button title="Delete routine" variant="danger" icon="trash" onPress={del} /> : null}
    </Screen>
  );
}
