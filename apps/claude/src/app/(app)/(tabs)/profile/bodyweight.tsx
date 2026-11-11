import { useState } from 'react';
import { Alert, View } from 'react-native';
import { addDays, formatDateLong, todayLocal } from '../../../../domain/dates';
import type { BodyweightReading, Unit } from '../../../../domain/types';
import { convert, formatStoredWeight, round1 } from '../../../../domain/units';
import { useLoad, useSession } from '../../../../state/session';
import { ProgressChart, type ChartPoint } from '../../../../ui/Chart';
import { Banner, Button, Card, DateField, Empty, Field, Loading, Row, Screen, Section, Segmented, T } from '../../../../ui/kit';
import { colors } from '../../../../ui/theme';

/** TR-11: optional bodyweight readings (original unit kept), trend chart and target. */
export default function Bodyweight() {
  const { repo, settings } = useSession();
  const { data } = useLoad(async () => ({ list: await repo.listBodyweight(), target: await repo.getBodyweightTarget() }));
  const [edit, setEdit] = useState<Partial<BodyweightReading> | null>(null);
  const [weight, setWeight] = useState('');
  const [unit, setUnit] = useState<Unit>(settings.unit);
  const [date, setDate] = useState(todayLocal());
  const [tWeight, setTWeight] = useState('');
  const [tDate, setTDate] = useState<string | null>(null);
  const [editingTarget, setEditingTarget] = useState(false);
  const [error, setError] = useState<string | null>(null);
  if (!data) return <Loading />;

  const open = (r?: BodyweightReading) => {
    setError(null);
    setEdit(r ?? {});
    setWeight(r ? String(r.weight) : '');
    setUnit(r?.unit ?? settings.unit);
    setDate(r?.readingDate ?? todayLocal());
  };
  const save = async () => {
    setError(null);
    try {
      await repo.saveBodyweight({ id: edit?.id, readingDate: date, weight: Number(weight.replace(',', '.')), unit });
      setEdit(null);
    } catch (e) { setError((e as Error).message); }
  };
  const points: ChartPoint[] = data.list.map((r) => ({ id: r.id, date: r.readingDate, value: convert(r.weight, r.unit, settings.unit), label: `${round1(convert(r.weight, r.unit, settings.unit))} ${settings.unit}` }));

  return (
    <Screen>
      <Banner tone="info">Bodyweight is optional and kept separate from lift weights. You can use every other feature without it.</Banner>
      {edit ? (
        <Card>
          <T variant="h3">{edit.id ? 'Edit reading' : 'New reading'}</T>
          <DateField label="Date" value={date} onChange={setDate} />
          <Row style={{ alignItems: 'flex-end' }}>
            <View style={{ width: 140 }}><Field label={`Weight (${unit})`} value={weight} onChangeText={setWeight} keyboardType="decimal-pad" /></View>
            <View style={{ flex: 1, minWidth: 140 }}><Segmented label="Unit" value={unit} onChange={setUnit} options={[{ value: 'kg', label: 'kg' }, { value: 'lb', label: 'lb' }]} /></View>
          </Row>
          {error ? <Banner tone="danger">{error}</Banner> : null}
          <Row><Button title="Save reading" onPress={save} /><Button title="Cancel" variant="ghost" onPress={() => setEdit(null)} /></Row>
        </Card>
      ) : <Button title="Log bodyweight" icon="plus" onPress={() => open()} />}

      <Section title="Target (optional)">
        <Card>
          {editingTarget ? (
            <>
              <Row style={{ alignItems: 'flex-end' }}>
                <View style={{ width: 140 }}><Field label={`Target (${unit})`} value={tWeight} onChangeText={setTWeight} keyboardType="decimal-pad" /></View>
                <View style={{ flex: 1, minWidth: 140 }}><Segmented label="Target unit" value={unit} onChange={setUnit} options={[{ value: 'kg', label: 'kg' }, { value: 'lb', label: 'lb' }]} /></View>
              </Row>
              {tDate ? <DateField label="Target date" value={tDate} onChange={setTDate} maxToday={false} minimum={todayLocal()} /> : null}
              <Button title={tDate ? 'Remove target date' : 'Add a target date'} compact variant="ghost" onPress={() => setTDate(tDate ? null : addDays(todayLocal(), 90))} />
              {error ? <Banner tone="danger">{error}</Banner> : null}
              <Row>
                <Button title="Save target" compact onPress={async () => { setError(null); try { await repo.saveBodyweightTarget({ weight: Number(tWeight.replace(',', '.')), unit, targetDate: tDate }); setEditingTarget(false); } catch (e) { setError((e as Error).message); } }} />
                <Button title="Cancel" compact variant="ghost" onPress={() => setEditingTarget(false)} />
              </Row>
            </>
          ) : data.target ? (
            <>
              <T>{formatStoredWeight(data.target.weight, data.target.unit, settings.showEquivalent)}{data.target.targetDate ? ` by ${formatDateLong(data.target.targetDate)}` : ''}</T>
              <Row>
                <Button title="Edit target" compact variant="secondary" onPress={() => { setTWeight(String(data.target!.weight)); setUnit(data.target!.unit); setTDate(data.target!.targetDate); setEditingTarget(true); }} />
                <Button title="Clear target" compact variant="ghost" onPress={() => repo.saveBodyweightTarget(null)} />
              </Row>
            </>
          ) : <Button title="Set a target" compact variant="secondary" onPress={() => { setTWeight(''); setTDate(null); setEditingTarget(true); }} />}
        </Card>
      </Section>

      {data.list.length >= 2 ? (
        <Card>
          <T variant="h3">Trend ({settings.unit})</T>
          <ProgressChart kind="line" points={points} yAxisLabel={`Bodyweight (${settings.unit}), converted for display; originals unchanged`} onOpen={(p) => open(data.list.find((r) => r.id === p.id))} openLabel="Edit this reading" />
          {data.target ? <T variant="small" color={colors.muted}>Target: {round1(convert(data.target.weight, data.target.unit, settings.unit))} {settings.unit}</T> : null}
        </Card>
      ) : data.list.length ? <T color={colors.faint}>Log one more reading to see a trend.</T> : <Empty title="No readings" body="Log your first bodyweight reading to start a trend." />}

      <Section title="Readings">
        {[...data.list].reverse().map((r) => (
          <Card key={r.id}>
            <Row style={{ justifyContent: 'space-between' }}>
              <T weight="600">{formatDateLong(r.readingDate)}</T>
              <T>{formatStoredWeight(r.weight, r.unit, settings.showEquivalent)}</T>
            </Row>
            <Row>
              <Button title="Edit" compact variant="ghost" onPress={() => open(r)} />
              <Button title="Delete" compact variant="ghost" onPress={() => Alert.alert('Delete this reading?', `${formatStoredWeight(r.weight, r.unit, false)} on ${formatDateLong(r.readingDate)}`, [{ text: 'Cancel', style: 'cancel' }, { text: 'Delete', style: 'destructive', onPress: () => repo.deleteBodyweight(r.id) }])} />
            </Row>
          </Card>
        ))}
      </Section>
    </Screen>
  );
}
