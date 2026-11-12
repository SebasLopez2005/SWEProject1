import React, { useState } from 'react';
import { Pressable, View, useWindowDimensions } from 'react-native';
import Svg, { Circle, Line, Polyline, Text as SvgText } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { Point } from './analytics';
import { displayNumber, prettyDay } from './model';
import { Empty, Item, Kicker, Sheet, T, c, s } from './ui';

export function Trend({ points, unit, label, sparse = 'Log at least two workouts for this exercise in the selected period.', open }: {
  points: Point[]; unit: string; label: string; sparse?: string; open?: (point: Point) => void;
}) {
  const { width } = useWindowDimensions();
  const [show, setShow] = useState(false);
  const [selected, setSelected] = useState<string>();
  const graphWidth = Math.min(width - 78, 650);
  const graphHeight = 155;
  const max = Math.max(1, ...points.map(p => p.value));
  const coords = points.map((p, i) => ({
    point: p,
    x: 8 + (graphWidth - 16) * (points.length === 1 ? 0.5 : i / (points.length - 1)),
    y: graphHeight - 11 - (graphHeight - 26) * p.value / max,
  }));
  const focus = points.find(p => p.id === selected) ?? points.at(-1);
  const visible = show ? [...points].reverse() : [...points].reverse().slice(0, 6);
  const pointLabel = (p: Point) => `${displayNumber(p.value)} ${unit}`;
  function select(p: Point) { setSelected(p.id); open?.(p); }
  if (points.length === 0) return <Empty title="No chart values" detail={sparse} />;
  return <View style={s.panel}>
    <Kicker>{label}</Kicker>
    {focus ? <View style={s.column}><T kind="metric">{displayNumber(focus.value)}</T>
      <T kind="small" color={c.muted}>{unit} · {prettyDay(focus.date)}</T></View> : null}
    {points.length < 2 ? <T color={c.muted}>{sparse}</T> :
      <Svg width={graphWidth} height={graphHeight} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        {[15, graphHeight / 2, graphHeight - 11].map(y => <Line key={y} x1={8} x2={graphWidth - 8} y1={y} y2={y} stroke={c.rule} strokeDasharray="4 5" />)}
        <Polyline points={coords.map(({ x, y }) => x + ',' + y).join(' ')} fill="none" stroke={c.accent} strokeWidth={2.5} strokeLinejoin="round" />
        {coords.map(({ point, x, y }) => <React.Fragment key={point.id}>
          <Circle cx={x} cy={y} r={point.id === focus?.id ? 5 : 3.2} fill={point.id === focus?.id ? c.ink : c.accent} />
          {points.length <= 24 ? <Circle cx={x} cy={y} r={Math.min(22, Math.max(8, graphWidth / points.length / 2))} fill="transparent" onPress={() => select(point)} /> : null}
        </React.Fragment>)}
        <SvgText x={9} y={12} fontSize={10} fill={c.muted}>{displayNumber(max)}</SvgText>
      </Svg>}
    {points.length >= 2 ? <View style={s.spread}><T kind="tiny" color={c.muted} style={s.flex}>{prettyDay(points[0].date)}</T>
      <T kind="tiny" color={c.muted} style={[s.flex, { textAlign: 'right' }]}>{prettyDay(points[points.length - 1].date)}</T></View> : null}
    <View style={s.rule} />
    <Kicker color={c.muted}>EXACT VALUES</Kicker>
    {visible.map(p => <Item key={p.id} title={prettyDay(p.date)} subtitle={pointLabel(p)} onPress={() => select(p)} />)}
    {points.length > 6 ? <Pressable accessibilityRole="button" onPress={() => setShow(!show)} style={{ minHeight: 44, justifyContent: 'center' }}>
      <T color={c.accent}>{show ? 'Show recent values' : 'Show all ' + points.length + ' values'}</T>
    </Pressable> : null}
  </View>;
}

export function PointWorkouts({ point, onClose }: { point: Point; onClose: () => void }) {
  const router = useRouter();
  return <Sheet title={'Week of ' + prettyDay(point.date)} onClose={onClose}>
    {point.workouts.length ? point.workouts.map(w => <View key={w.id} style={s.panel}>
      <Item title={w.routine ?? 'Ad hoc workout'} subtitle={prettyDay(w.date)} onPress={() => {
        onClose(); router.push({ pathname: '/session/[id]', params: { id: w.id } });
      }} />
    </View>) : <Empty title="No workouts this week" detail="This week contributes zero volume." />}
  </Sheet>;
}
