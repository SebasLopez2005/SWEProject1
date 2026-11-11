import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Switch, View } from 'react-native';
import { addDays, todayLocal } from '../../../domain/dates';
import { BODY_AREAS, generalWarmup, mobilityFor, rampSets, type PrepStep } from '../../../domain/preparation';
import { DomainError } from '../../../domain/types';
import { useLoad, useSession } from '../../../state/session';
import { formatTarget, plural } from '../../../ui/format';
import { Banner, Button, Card, Chip, DateField, Row, Screen, Section, T } from '../../../ui/kit';
import { colors, space } from '../../../ui/theme';

export default function StartWorkout() {
  const { mode, routineId } = useLocalSearchParams<{ mode?: string; routineId?: string }>();
  const { repo, settings } = useSession();
  const [date, setDate] = useState(mode === 'earlier' ? addDays(todayLocal(), -1) : todayLocal());
  const [skipped, setSkipped] = useState<Set<string>>(new Set());
  const [useWarmup, setUseWarmup] = useState(false);
  const [useRamp, setUseRamp] = useState(false);
  const [preArea, setPreArea] = useState<string | null>(null);
  const [postArea, setPostArea] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data } = useLoad(async () => {
    const ex = await repo.exerciseMap();
    const routine = routineId ? await repo.getRoutine(routineId) : null;
    return { ex, routine };
  }, [routineId]);

  const all = useMemo(() => (data ? [...data.ex.values()] : []), [data]);
  const routine = data?.routine ?? null;
  const firstWeighted = routine?.entries.find((e) => data?.ex.get(e.exerciseId)?.type === 'weight_reps');

  const prep = useMemo((): PrepStep[] => {
    if (!data) return [];
    const steps: PrepStep[] = [];
    if (useWarmup) { const g = generalWarmup(all); if (g) steps.push(g); }
    if (useRamp && firstWeighted) { const r = rampSets(data.ex.get(firstWeighted.exerciseId)!, firstWeighted.targetLoad, firstWeighted.targetUnit ?? settings.unit); if (r) steps.push(r); }
    const area = (id: string | null) => BODY_AREAS.find((a) => a.id === id)?.regions ?? [];
    if (preArea) steps.push(...mobilityFor(area(preArea), all, 2, 'warmup'));
    if (postArea) steps.push(...mobilityFor(area(postArea), all, 3, 'mobility'));
    return steps;
  }, [data, all, useWarmup, useRamp, preArea, postArea, firstWeighted, settings.unit]);

  const start = async () => {
    setError(null);
    try {
      await repo.startWorkout({ date, routineId: routine?.id ?? null, skipExerciseIds: [...skipped], prep });
      router.replace('/workout');
    } catch (e) {
      setError(e instanceof DomainError ? e.message : `Could not start: ${(e as Error).message}`);
    }
  };

  return (
    <Screen footer={<Button title={routine ? `Start ${routine.name}` : 'Start workout'} icon="play.fill" onPress={start} testID="confirm-start" />}>
      <DateField label="Workout date (today or earlier)" value={date} onChange={setDate} />
      {date !== todayLocal() ? <Banner tone="info">This workout will appear in history and graphs on the date you chose. Duration is not recorded for earlier dates.</Banner> : null}

      {routine ? (
        <Section title={`${routine.name} · ${plural(routine.entries.length, 'exercise')}`}>
          {routine.entries.map((e) => {
            const exercise = data?.ex.get(e.exerciseId);
            const isSkipped = skipped.has(e.exerciseId);
            const target = formatTarget({ targetReps: e.targetReps, targetSeconds: e.targetSeconds, targetLoad: e.targetLoad, targetUnit: e.targetUnit, targetRirMin: e.targetRirMin, targetRirMax: e.targetRirMax }, settings.showEquivalent);
            return (
              <Card key={e.id} style={isSkipped ? { opacity: 0.55 } : undefined}>
                <Row style={{ justifyContent: 'space-between' }}>
                  <T weight="600" style={{ flexShrink: 1 }}>{exercise?.name ?? 'Unknown exercise'}</T>
                  {exercise?.archived ? <T variant="caption" color={colors.warning}>ARCHIVED</T> : null}
                </Row>
                <T variant="small" color={colors.muted}>
                  {e.targetSets ? `${e.targetSets} × ${target ?? ''}` : 'No planned sets — add sets as you go'}
                </T>
                {exercise?.archived ? (
                  <Row style={{ justifyContent: 'space-between' }}>
                    <T variant="small">Skip this archived exercise</T>
                    <Switch value={isSkipped} accessibilityLabel={`Skip ${exercise.name}`} trackColor={{ true: colors.accent }}
                      onValueChange={(v) => setSkipped((s) => { const n = new Set(s); if (v) n.add(e.exerciseId); else n.delete(e.exerciseId); return n; })} />
                  </Row>
                ) : null}
              </Card>
            );
          })}
          <T variant="caption" color={colors.faint}>Starting copies these targets into today’s session. Editing the routine later will not change this workout.</T>
        </Section>
      ) : null}

      <Section title="Optional preparation">
        <Card>
          <Row style={{ justifyContent: 'space-between' }}>
            <View style={{ flex: 1 }}><T weight="600">General warm-up</T><T variant="small" color={colors.muted}>About 5 minutes of easy cardio to raise your heart rate.</T></View>
            <Switch value={useWarmup} onValueChange={setUseWarmup} accessibilityLabel="General warm-up" trackColor={{ true: colors.accent }} />
          </Row>
          {firstWeighted ? (
            <Row style={{ justifyContent: 'space-between' }}>
              <View style={{ flex: 1 }}><T weight="600">Ramp-up sets</T><T variant="small" color={colors.muted}>Three lighter sets of {data?.ex.get(firstWeighted.exerciseId)?.name} before your working sets.</T></View>
              <Switch value={useRamp} onValueChange={setUseRamp} accessibilityLabel="Ramp-up sets" trackColor={{ true: colors.accent }} />
            </Row>
          ) : null}
          <T weight="600">Mobility before lifting</T>
          <Row>{BODY_AREAS.map((a) => <Chip key={a.id} label={a.label} selected={preArea === a.id} onPress={() => setPreArea(preArea === a.id ? null : a.id)} accessibilityLabel={`Mobility before lifting: ${a.label}`} />)}</Row>
          <T weight="600">Mobility after the workout</T>
          <Row>{BODY_AREAS.map((a) => <Chip key={a.id} label={a.label} selected={postArea === a.id} onPress={() => setPostArea(postArea === a.id ? null : a.id)} accessibilityLabel={`Mobility after workout: ${a.label}`} />)}</Row>
          {prep.length ? (
            <View style={{ gap: space.xs }}>
              {prep.map((p, i) => (
                <T key={i} variant="small" color={colors.muted}>• {p.phase === 'mobility' ? 'After' : 'Before'}: {data?.ex.get(p.exerciseId)?.name} — {p.reason}</T>
              ))}
            </View>
          ) : null}
          <T variant="caption" color={colors.faint}>Preparation is logged separately and adds nothing to working volume, muscle scores or goals. You can edit, skip or substitute each step in the workout.</T>
        </Card>
      </Section>
      {error ? <Banner tone="danger">{error}</Banner> : null}
    </Screen>
  );
}
