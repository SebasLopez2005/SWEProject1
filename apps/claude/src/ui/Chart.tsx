// Accessible SVG charts: labelled axes with units and dates, selectable points,
// plus a plain-text value list built from the same data.
import { useState } from 'react';
import { Pressable, View, useWindowDimensions } from 'react-native';
import Svg, { Circle, G, Line, Path, Rect, Text as SvgText } from 'react-native-svg';
import { formatDateShort } from '../domain/dates';
import { round1 } from '../domain/units';
import { Card, T, useScale } from './kit';
import { colors, space } from './theme';

export interface ChartPoint {
  id: string;
  date: string;
  value: number;
  label: string;
  partial?: boolean;
}

function niceMax(v: number) {
  if (v <= 0) return 1;
  const exp = Math.pow(10, Math.floor(Math.log10(v)));
  const n = v / exp;
  const step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10;
  return step * exp;
}

export function ProgressChart({ points, kind, yAxisLabel, onOpen, openLabel }: { points: ChartPoint[]; kind: 'line' | 'bar'; yAxisLabel: string; onOpen: (p: ChartPoint) => void; openLabel: string }) {
  const { width: winW } = useWindowDimensions();
  const scale = useScale();
  const [sel, setSel] = useState<ChartPoint | null>(null);
  const width = Math.min(winW - space.lg * 2 - space.lg * 2, 680);
  const height = 210;
  const fs = 10.5 * Math.min(scale, 1.4);
  const padL = 46 * Math.min(scale, 1.4);
  const padB = 28 * Math.min(scale, 1.3);
  const padT = 12;
  const padR = 10;
  const max = niceMax(Math.max(...points.map((p) => p.value), 0));
  const iw = width - padL - padR;
  const ih = height - padT - padB;
  const x = (i: number) => padL + (points.length <= 1 ? iw / 2 : (i / (points.length - 1)) * iw);
  const y = (v: number) => padT + ih - (v / max) * ih;
  const ticks = [0, max / 2, max];
  const labelEvery = Math.max(1, Math.ceil(points.length / 5));
  const barW = Math.max(4, Math.min(28, (iw / Math.max(points.length, 1)) * 0.6));
  const bx = (i: number) => padL + (iw / Math.max(points.length, 1)) * (i + 0.5);

  return (
    <View style={{ gap: space.sm }}>
      <T variant="caption" color={colors.muted}>{yAxisLabel}</T>
      <View accessible={false} importantForAccessibility="no-hide-descendants">
        <Svg width={width} height={height}>
          {ticks.map((t) => (
            <G key={t}>
              <Line x1={padL} x2={width - padR} y1={y(t)} y2={y(t)} stroke={colors.border} strokeWidth={1} />
              <SvgText x={padL - 6} y={y(t) + 4} fill={colors.muted} fontSize={fs} textAnchor="end">{round1(t)}</SvgText>
            </G>
          ))}
          {kind === 'line' && points.length > 1 && (
            <Path d={points.map((p, i) => `${i ? 'L' : 'M'}${x(i)},${y(p.value)}`).join(' ')} stroke={colors.accent} strokeWidth={2.5} fill="none" />
          )}
          {points.map((p, i) =>
            kind === 'line' ? (
              <G key={p.id}>
                <Circle cx={x(i)} cy={y(p.value)} r={sel?.id === p.id ? 7 : 5} fill={sel?.id === p.id ? colors.text : colors.accent} />
                <Circle cx={x(i)} cy={y(p.value)} r={18} fill="transparent" onPress={() => setSel(p)} />
              </G>
            ) : (
              <G key={p.id}>
                <Rect x={bx(i) - barW / 2} y={y(p.value)} width={barW} height={Math.max(1, padT + ih - y(p.value))} rx={3}
                  fill={sel?.id === p.id ? colors.text : p.partial ? colors.heat[2] : colors.accent} />
                <Rect x={bx(i) - iw / points.length / 2} y={padT} width={iw / points.length} height={ih} fill="transparent" onPress={() => setSel(p)} />
              </G>
            ),
          )}
          {points.map((p, i) =>
            i % labelEvery === 0 || i === points.length - 1 ? (
              <SvgText key={`l${p.id}`} x={kind === 'line' ? x(i) : bx(i)} y={height - 8} fill={colors.muted} fontSize={fs} textAnchor="middle">
                {formatDateShort(p.date)}
              </SvgText>
            ) : null,
          )}
        </Svg>
      </View>
      {sel ? (
        <Card style={{ backgroundColor: colors.surfaceRaised }}>
          <T weight="600">{formatDateShort(sel.date)}{sel.partial ? ' (in progress)' : ''}: {sel.label}</T>
          <Pressable onPress={() => onOpen(sel)} accessibilityRole="button" style={{ minHeight: 44, justifyContent: 'center' }}>
            <T color={colors.accent} weight="600">{openLabel} ›</T>
          </Pressable>
        </Card>
      ) : (
        <T variant="caption" color={colors.faint}>Tap a point to see its value, or use the list below.</T>
      )}
    </View>
  );
}

/** Plain-text alternative: same values, same drill-down. */
export function ValueTable({ points, onOpen, header }: { points: ChartPoint[]; onOpen: (p: ChartPoint) => void; header: string }) {
  return (
    <View style={{ gap: 2 }}>
      <T variant="small" color={colors.muted} weight="600">{header}</T>
      {[...points].reverse().map((p) => (
        <Pressable key={p.id} onPress={() => onOpen(p)} accessibilityRole="button" accessibilityLabel={`${formatDateShort(p.date)}${p.partial ? ', in progress' : ''}: ${p.label}`}
          style={({ pressed }) => [{ flexDirection: 'row', justifyContent: 'space-between', minHeight: 44, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.border, gap: space.sm }, pressed && { opacity: 0.6 }]}>
          <T color={colors.muted}>{formatDateShort(p.date)}{p.partial ? ' (in progress)' : ''}</T>
          <T weight="600">{p.label} ›</T>
        </Pressable>
      ))}
    </View>
  );
}
