import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useState } from 'react';
import { Switch, View } from 'react-native';
import { bodyweightCsv, monthlyCsv, workoutSetsCsv } from '../../../../domain/csv';
import { addDays, formatDateLong, todayLocal } from '../../../../domain/dates';
import { useLoad, useSession } from '../../../../state/session';
import { Banner, Button, Card, DateField, Loading, Row, Screen, Section, Segmented, T } from '../../../../ui/kit';
import { colors } from '../../../../ui/theme';

type Built = { name: string; uri: string; rows: number };

/** TR-10: offline CSV export of the owner's local snapshot through the system share sheet. */
export default function ExportData() {
  const { repo, settings, syncState } = useSession();
  const today = todayLocal();
  const [range, setRange] = useState<'30' | 'custom' | 'all'>('30');
  const [from, setFrom] = useState(addDays(today, -29));
  const [to, setTo] = useState(today);
  const [sets, setSets] = useState(true);
  const [monthly, setMonthly] = useState(true);
  const [bw, setBw] = useState(false);
  const [built, setBuilt] = useState<Built[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [shared, setShared] = useState<string | null>(null);
  const { data } = useLoad(async () => ({ ws: await repo.finishedWorkouts(), ex: await repo.exerciseMap(), bw: await repo.listBodyweight(), unsynced: await repo.hasUnsyncedWork() }));
  if (!data) return <Loading />;
  const r = { from: range === 'all' ? null : range === '30' ? addDays(today, -29) : from, to: range === 'custom' ? to : today };

  const preview = {
    sets: sets ? workoutSetsCsv(data.ws, data.ex, r) : null,
    monthly: monthly ? monthlyCsv(data.ws, data.ex, r, settings.unit, today) : null,
    bw: bw ? bodyweightCsv(data.bw, r) : null,
  };

  const build = async () => {
    setError(null);
    setShared(null);
    try {
      if (!sets && !monthly && !bw) throw new Error('Choose at least one file.');
      if (r.from && r.from > r.to) throw new Error('The start date is after the end date.');
      const stamp = `${r.from ?? 'all'}_to_${r.to}`;
      const out: Built[] = [];
      const write = (base: string, content: string, rows: number) => {
        const f = new File(Paths.cache, `repwise_${base}_${stamp}.csv`);
        if (f.exists) f.delete();
        f.create();
        f.write('﻿' + content); // UTF-8 BOM so spreadsheets detect the encoding
        out.push({ name: `${base}.csv`, uri: f.uri, rows });
      };
      if (preview.sets) write('workout_sets', preview.sets.csv, preview.sets.rows);
      if (preview.monthly) write('monthly_progress', preview.monthly.csv, preview.monthly.rows);
      if (preview.bw) write('bodyweight', preview.bw.csv, preview.bw.rows);
      setBuilt(out);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const share = async (b: Built) => {
    if (!(await Sharing.isAvailableAsync())) return setError('Sharing is not available on this device.');
    await Sharing.shareAsync(b.uri, { mimeType: 'text/csv', UTI: 'public.comma-separated-values-text', dialogTitle: b.name });
    setShared(b.name);
  };

  return (
    <Screen>
      <T color={colors.muted}>Create CSV files from the data on this device. Nothing leaves your phone unless you choose a destination in the share sheet.</T>
      <Segmented label="Date range" value={range} onChange={(v) => { setRange(v); setBuilt(null); }} options={[{ value: '30', label: 'Last 30 days' }, { value: 'custom', label: 'Custom' }, { value: 'all', label: 'All time' }]} />
      {range === 'custom' ? (
        <Card>
          <DateField label="From" value={from} onChange={(d) => { setFrom(d); setBuilt(null); }} />
          <DateField label="To" value={to} onChange={(d) => { setTo(d); setBuilt(null); }} minimum={from} />
        </Card>
      ) : null}
      <Section title="Files">
        <Card>
          {[
            { label: 'Workout sets', hint: 'One row per completed set: targets and actuals in separate columns, original units kept.', v: sets, set: setSets, p: preview.sets },
            { label: 'Monthly summaries', hint: 'One row per month with date bounds and partial-period flag.', v: monthly, set: setMonthly, p: preview.monthly },
            { label: 'Bodyweight (optional)', hint: 'Included only if you turn this on.', v: bw, set: setBw, p: preview.bw },
          ].map((o) => (
            <Row key={o.label} style={{ justifyContent: 'space-between', flexWrap: 'nowrap' }}>
              <View style={{ flex: 1 }}>
                <T weight="600">{o.label}{o.p ? ` · ${o.p.rows} rows` : ''}</T>
                <T variant="small" color={colors.muted}>{o.hint}</T>
              </View>
              <Switch value={o.v} onValueChange={(v) => { o.set(v); setBuilt(null); }} accessibilityLabel={o.label} trackColor={{ true: colors.accent }} />
            </Row>
          ))}
        </Card>
      </Section>
      <T variant="small" color={colors.muted}>Range: {r.from ? formatDateLong(r.from) : 'first workout'} – {formatDateLong(r.to)}</T>
      {data.unsynced && syncState.status !== 'device_only' ? <Banner tone="warning">Some changes are still waiting to upload. The export uses everything on this device, including those changes; other devices may not have them yet.</Banner> : null}
      {error ? <Banner tone="danger">{error}</Banner> : null}
      {!built ? <Button title="Create files" icon="doc.badge.plus" onPress={build} /> : (
        <Card>
          <T variant="h3">Files ready</T>
          {built.map((b) => (
            <Row key={b.name} style={{ justifyContent: 'space-between' }}>
              <T style={{ flexShrink: 1 }}>{b.name} · {b.rows} rows</T>
              <Button title="Share" compact variant="secondary" icon="square.and.arrow.up" onPress={() => share(b)} accessibilityLabel={`Share ${b.name}`} />
            </Row>
          ))}
          {shared ? <T variant="small" color={colors.muted}>The share sheet closed for {shared}. If you cancelled, nothing was sent.</T> : null}
          <Button title="Start over" compact variant="ghost" onPress={() => setBuilt(null)} />
        </Card>
      )}
    </Screen>
  );
}
