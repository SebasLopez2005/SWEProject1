import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { muscleActivity, muscleBand, MUSCLE_BANDS } from '../../../../domain/analytics';
import { addDays, formatDateLong, formatDateShort, todayLocal } from '../../../../domain/dates';
import { MUSCLE_LABEL } from '../../../../domain/preparation';
import type { BodyFigure } from '../../../../domain/types';
import { useLoad, useSession } from '../../../../state/session';
import { BodyMap } from '../../../../ui/BodyMap';
import { Banner, Button, Card, DateField, Loading, Row, Screen, Section, Segmented, T } from '../../../../ui/kit';
import { colors, space } from '../../../../ui/theme';

/** TR-07: estimated training volume by region with exact totals and contributing sets. */
export default function Muscles() {
  const { repo, settings } = useSession();
  const params = useLocalSearchParams<{ region?: string }>();
  const today = todayLocal();
  const [period, setPeriod] = useState<'7' | '30' | 'custom'>('7');
  const [from, setFrom] = useState(addDays(today, -13));
  const [to, setTo] = useState(today);
  const [selected, setSelected] = useState<string | null>(params.region ?? null);
  const { data } = useLoad(async () => ({ ws: await repo.finishedWorkouts(), ex: await repo.exerciseMap() }), [], ['finished', 'exercises']);
  if (!data) return <Loading />;
  const start = period === '7' ? addDays(today, -6) : period === '30' ? addDays(today, -29) : from;
  const end = period === 'custom' ? to : today;
  const act = muscleActivity(data.ws, data.ex, start, end);
  const scores = new Map([...act.regions].map(([k, v]) => [k, v.score]));
  const list = Object.keys(MUSCLE_LABEL).map((k) => ({ k, score: scores.get(k) ?? 0 })).sort((a, b) => b.score - a.score || a.k.localeCompare(b.k));
  const sel = selected ? act.regions.get(selected) : null;
  const byExercise = new Map<string, { sets: number; credit: number; workouts: Set<string> }>();
  for (const c of sel?.contributions ?? []) {
    const e = byExercise.get(c.exerciseId) ?? { sets: 0, credit: 0, workouts: new Set<string>() };
    e.sets += 1; e.credit += c.credit; e.workouts.add(c.workoutId);
    byExercise.set(c.exerciseId, e);
  }

  return (
    <Screen>
      <Segmented label="Period" value={period} onChange={setPeriod} options={[{ value: '7', label: 'Last 7 days' }, { value: '30', label: 'Last 30 days' }, { value: 'custom', label: 'Custom' }]} />
      {period === 'custom' ? (
        <Card>
          <DateField label="From" value={from} onChange={setFrom} />
          <DateField label="To" value={to} onChange={setTo} minimum={from} />
        </Card>
      ) : null}
      <T variant="small" color={colors.muted}>{formatDateShort(start)} – {formatDateShort(end)} · {act.totalSets} completed working sets</T>
      <Card>
        <Segmented label="Body figure" value={settings.bodyFigure} onChange={(f: BodyFigure) => repo.updateSettings({ bodyFigure: f })}
          options={[{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }]} />
        <BodyMap scores={scores} selected={selected} onSelect={setSelected} figure={settings.bodyFigure} />
        <T variant="caption" color={colors.faint} center>Tap a muscle to see what trained it.</T>
      </Card>
      <Banner tone="info">Estimated training volume by region, from your set logs and the exercise catalog’s muscle tags. It is not a measurement of muscle activation.</Banner>
      {act.unmappedSets ? <T variant="small" color={colors.warning}>{act.unmappedSets} sets used exercises without muscle tags and are not shown.</T> : null}
      {sel && selected ? (
        <Section title={`${MUSCLE_LABEL[selected]} · ${sel.score.toFixed(1)} set-equivalents`} action={<Button title="Close" compact variant="ghost" onPress={() => setSelected(null)} />}>
          {[...byExercise].map(([exId, v]) => (
            <Card key={exId}>
              <T weight="600">{data.ex.get(exId)?.name ?? 'Exercise'}</T>
              <T variant="small" color={colors.muted}>{v.sets} sets → {v.credit.toFixed(1)} set-equivalents</T>
              <Row>
                {[...v.workouts].map((wid) => {
                  const w = data.ws.find((x) => x.id === wid);
                  return <Button key={wid} title={w ? formatDateShort(w.workoutDate) : 'Workout'} compact variant="ghost" accessibilityLabel={`Open workout on ${w ? formatDateLong(w.workoutDate) : ''}`} onPress={() => router.push(`/workout/${wid}`)} />;
                })}
              </Row>
            </Card>
          ))}
        </Section>
      ) : null}
      <Section title="All regions">
        {list.map(({ k, score }) => (
          <Pressable key={k} onPress={() => setSelected(k)} accessibilityRole="button" accessibilityLabel={`${MUSCLE_LABEL[k]}: ${score.toFixed(1)} set-equivalents, band ${MUSCLE_BANDS[muscleBand(score)].label}`}
            style={({ pressed }) => [{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', minHeight: 44, borderBottomWidth: 1, borderBottomColor: colors.border, gap: space.sm }, pressed && { opacity: 0.6 }]}>
            <Row gap={space.sm}>
              <View style={{ width: 14, height: 14, borderRadius: 3, backgroundColor: muscleBand(score) ? colors.heat[muscleBand(score)] : 'transparent', borderWidth: 1, borderColor: colors.accent }} />
              <T>{MUSCLE_LABEL[k]}</T>
            </Row>
            <T weight="600">{score.toFixed(1)} ›</T>
          </Pressable>
        ))}
      </Section>
    </Screen>
  );
}
