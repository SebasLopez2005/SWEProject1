import { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Circle, Path } from 'react-native-svg';
import { muscleRegions, muscleScores } from './analytics';
import { actualLabel, dateKey, daysFrom, displayNumber, prettyDay } from './model';
import { useApp } from './state';
import { Chip, DayField, Empty, ErrorNote, Item, Kicker, Sheet, T, c, s } from './ui';

const shades = ['#292c24', '#555745', '#78674b', '#9f7950', '#c39458'];
const color = (n: number) => shades[n === 0 ? 0 : n < 3 ? 1 : n < 6 ? 2 : n < 10 ? 3 : 4];
const shared = [
  ['Neck', 'M43 28 L57 28 L60 38 L40 38Z'],
  ['Shoulders', 'M38 37 L26 41 L20 56 L30 61 L38 52Z M62 37 L74 41 L80 56 L70 61 L62 52Z'],
  ['Forearms', 'M16 81 L25 84 L19 111 L10 114Z M84 81 L75 84 L81 111 L90 114Z'],
  ['Hips', 'M34 91 L44 100 L40 118 L31 112Z M66 91 L56 100 L60 118 L69 112Z'],
  ['Calves', 'M34 147 L46 150 L43 186 L36 191 L32 171Z M66 147 L54 150 L57 186 L64 191 L68 171Z'],
] as const;
const front = [
  ['Chest', 'M39 39 L49 42 L49 62 L35 57Z M61 39 L51 42 L51 62 L65 57Z'],
  ['Core', 'M38 60 L50 65 L62 60 L65 88 L56 99 L44 99 L35 88Z'],
  ['Biceps', 'M20 58 L30 63 L25 82 L16 79Z M80 58 L70 63 L75 82 L84 79Z'],
  ['Quads', 'M31 114 L42 119 L49 107 L46 147 L34 145 L29 126Z M69 114 L58 119 L51 107 L54 147 L66 145 L71 126Z'],
] as const;
const back = [
  ['Back', 'M39 39 L50 42 L61 39 L66 58 L62 75 L65 89 L50 95 L35 89 L38 75 L34 58Z'],
  ['Triceps', 'M20 58 L30 63 L25 82 L16 79Z M80 58 L70 63 L75 82 L84 79Z'],
  ['Glutes', 'M40 94 L49 97 L49 111 L42 119 L35 112Z M60 94 L51 97 L51 111 L58 119 L65 112Z'],
  ['Hamstrings', 'M31 114 L42 121 L49 114 L46 147 L34 145 L29 126Z M69 114 L58 121 L51 114 L54 147 L66 145 L71 126Z'],
] as const;

export function MuscleMap() {
  const app = useApp();
  const router = useRouter();
  const [period, setPeriod] = useState('7 days');
  const [from, setFrom] = useState(daysFrom(-6));
  const [to, setTo] = useState(dateKey());
  const [region, setRegion] = useState<string>();
  const start = period === 'Custom' ? from : daysFrom(period === '7 days' ? -6 : -29);
  const end = period === 'Custom' ? to : dateKey();
  const { scores, unmapped } = muscleScores(app.finished, app.exercise, start, end);
  const values = (name: string) => (scores.get(name) ?? []).reduce((total, row) => total + row.amount, 0);
  const credits = region ? scores.get(region) ?? [] : [];
  return <View style={s.column}>
    <View style={s.panel}>
      <Kicker>ESTIMATED TRAINING VOLUME</Kicker>
      <T kind="sub">Muscle activity</T>
      <T color={c.muted}>A completed working set credits 1.0 to primary and 0.5 to secondary muscle regions.</T>
      <View style={s.wrap}>{['7 days', '30 days', 'Custom'].map(x => <Chip key={x} label={x} selected={period === x} onPress={() => setPeriod(x)} />)}</View>
      {period === 'Custom' ? <>
        <DayField label="From" value={from} onChange={setFrom} />
        <DayField label="Through" value={to} onChange={setTo} />
        <ErrorNote message={from > to ? 'Choose an end date on or after the start date.' : ''} />
      </> : null}
      <View style={{ ...s.wrap, justifyContent: 'space-evenly' }}>
        {[['Front', front], ['Back', back]].map(([label, paths]) => <View key={String(label)} style={{ alignItems: 'center', gap: 3 }}>
          <Svg width={111} height={214} viewBox="0 0 100 200" accessibilityElementsHidden>
            <Circle cx={50} cy={18} r={10} fill={c.raised} stroke={c.rule} />
            {[...shared, ...(paths as typeof front)].map(([name, d]) => <Path key={name} d={d} fill={color(values(name))}
              stroke={region === name ? c.ink : '#777366'} strokeWidth={1} onPress={() => setRegion(name)} />)}
          </Svg><Kicker color={c.muted}>{label}</Kicker>
        </View>)}
      </View>
      <View style={s.wrap}>{['0', '<3', '3–<6', '6–<10', '10+'].map((label, i) => <View key={label} style={s.row}>
        <View style={{ width: 13, height: 13, borderRadius: 3, backgroundColor: shades[i], borderWidth: 1, borderColor: '#777366' }} /><T kind="tiny">{label}</T>
      </View>)}</View>
      <T kind="small" color={c.muted}>{unmapped} working {unmapped === 1 ? 'set' : 'sets'} without mapped muscles.</T>
    </View>
    <View style={s.panel}>
      <Kicker>SET-EQUIVALENTS BY REGION</Kicker>
      {muscleRegions.map(name => <Item key={name} title={name} subtitle={values(name).toFixed(1) + ' set-equivalents'} onPress={() => setRegion(name)} />)}
    </View>
    {region ? <Sheet title={region} onClose={() => setRegion(undefined)}>
      <T kind="sub">{displayNumber(values(region))} set-equivalents</T>
      {credits.length ? credits.map(credit => {
        const actual = credit.workout.entries.flatMap(e => e.sets).find(row => row.id === credit.setId)?.actual;
        return <View key={credit.setId} style={s.panel}><Item title={app.exercise(credit.exercise)?.name ?? 'Exercise'}
          subtitle={`${prettyDay(credit.workout.date)} · ${credit.amount.toFixed(1)} · ${actual ? actualLabel(actual, app.settings) : ''}`}
          onPress={() => { setRegion(undefined); router.push({ pathname: '/session/[id]', params: { id: credit.workout.id, setId: credit.setId } }); }} /></View>;
      }) : <Empty title="No credited sets" detail="There is no recorded work for this region in the selected period." />}
    </Sheet> : null}
  </View>;
}
