// TR-07 front/back body diagram. Deeper champagne = more estimated working-set
// volume. Zero regions show an outline only. The legend and the exact-value list
// next to it carry the same information without relying on colour.
import { View } from 'react-native';
import Svg, { Circle, Ellipse, G, Polygon, Rect, Text as SvgText } from 'react-native-svg';
import { MUSCLE_BANDS, muscleBand } from '../domain/analytics';
import { T, Row } from './kit';
import { colors, space } from './theme';

type Shape =
  | { t: 'e'; cx: number; cy: number; rx: number; ry: number }
  | { t: 'r'; x: number; y: number; w: number; h: number }
  | { t: 'p'; points: string };

const FRONT: Record<string, Shape[]> = {
  neck: [{ t: 'r', x: 54, y: 33, w: 12, h: 9 }],
  shoulders: [{ t: 'e', cx: 36, cy: 50, rx: 11, ry: 9 }, { t: 'e', cx: 84, cy: 50, rx: 11, ry: 9 }],
  chest: [{ t: 'r', x: 45, y: 45, w: 14, h: 20 }, { t: 'r', x: 61, y: 45, w: 14, h: 20 }],
  biceps: [{ t: 'e', cx: 29, cy: 73, rx: 6, ry: 13 }, { t: 'e', cx: 91, cy: 73, rx: 6, ry: 13 }],
  forearms: [{ t: 'e', cx: 25, cy: 102, rx: 5, ry: 14 }, { t: 'e', cx: 95, cy: 102, rx: 5, ry: 14 }],
  abdominals: [{ t: 'r', x: 49, y: 68, w: 22, h: 38 }],
  abductors: [{ t: 'e', cx: 41, cy: 114, rx: 5, ry: 9 }, { t: 'e', cx: 79, cy: 114, rx: 5, ry: 9 }],
  adductors: [{ t: 'e', cx: 55, cy: 130, rx: 4, ry: 14 }, { t: 'e', cx: 65, cy: 130, rx: 4, ry: 14 }],
  quadriceps: [{ t: 'e', cx: 46, cy: 145, rx: 8, ry: 25 }, { t: 'e', cx: 74, cy: 145, rx: 8, ry: 25 }],
  calves: [{ t: 'e', cx: 46, cy: 200, rx: 6, ry: 19 }, { t: 'e', cx: 74, cy: 200, rx: 6, ry: 19 }],
};

const BACK: Record<string, Shape[]> = {
  traps: [{ t: 'p', points: '46,40 74,40 60,64' }],
  shoulders: [{ t: 'e', cx: 36, cy: 50, rx: 11, ry: 9 }, { t: 'e', cx: 84, cy: 50, rx: 11, ry: 9 }],
  'middle back': [{ t: 'r', x: 52, y: 64, w: 16, h: 18 }],
  lats: [{ t: 'e', cx: 43, cy: 76, rx: 7, ry: 16 }, { t: 'e', cx: 77, cy: 76, rx: 7, ry: 16 }],
  'lower back': [{ t: 'r', x: 51, y: 86, w: 18, h: 16 }],
  triceps: [{ t: 'e', cx: 29, cy: 73, rx: 6, ry: 13 }, { t: 'e', cx: 91, cy: 73, rx: 6, ry: 13 }],
  forearms: [{ t: 'e', cx: 25, cy: 102, rx: 5, ry: 14 }, { t: 'e', cx: 95, cy: 102, rx: 5, ry: 14 }],
  glutes: [{ t: 'e', cx: 51, cy: 114, rx: 9, ry: 10 }, { t: 'e', cx: 69, cy: 114, rx: 9, ry: 10 }],
  hamstrings: [{ t: 'e', cx: 46, cy: 148, rx: 8, ry: 22 }, { t: 'e', cx: 74, cy: 148, rx: 8, ry: 22 }],
  calves: [{ t: 'e', cx: 46, cy: 200, rx: 7, ry: 19 }, { t: 'e', cx: 74, cy: 200, rx: 7, ry: 19 }],
};

function Figure({ title, regions, scores, selected, onSelect }: { title: string; regions: Record<string, Shape[]>; scores: Map<string, number>; selected: string | null; onSelect: (r: string) => void }) {
  return (
    <View style={{ alignItems: 'center', flex: 1 }}>
      <Svg width={140} height={250} viewBox="0 0 120 230">
        <Circle cx={60} cy={20} r={13} fill="none" stroke={colors.border} strokeWidth={1.5} />
        {Object.entries(regions).map(([region, shapes]) => {
          const band = muscleBand(scores.get(region) ?? 0);
          const fill = band === 0 ? 'transparent' : colors.heat[band];
          const stroke = selected === region ? colors.text : band === 0 ? colors.faint : colors.accent;
          return (
            <G key={region} onPress={() => onSelect(region)}>
              {shapes.map((s, i) =>
                s.t === 'e' ? <Ellipse key={i} cx={s.cx} cy={s.cy} rx={s.rx} ry={s.ry} fill={fill} stroke={stroke} strokeWidth={selected === region ? 2 : 1} />
                  : s.t === 'r' ? <Rect key={i} x={s.x} y={s.y} width={s.w} height={s.h} rx={4} fill={fill} stroke={stroke} strokeWidth={selected === region ? 2 : 1} />
                    : <Polygon key={i} points={s.points} fill={fill} stroke={stroke} strokeWidth={selected === region ? 2 : 1} />,
              )}
            </G>
          );
        })}
        <SvgText x={60} y={228} fill={colors.muted} fontSize={10} textAnchor="middle">{title}</SvgText>
      </Svg>
    </View>
  );
}

export function BodyMap({ scores, selected, onSelect }: { scores: Map<string, number>; selected: string | null; onSelect: (r: string) => void }) {
  return (
    <View style={{ gap: space.sm }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around' }} accessible={false} importantForAccessibility="no-hide-descendants">
        <Figure title="Front" regions={FRONT} scores={scores} selected={selected} onSelect={onSelect} />
        <Figure title="Back" regions={BACK} scores={scores} selected={selected} onSelect={onSelect} />
      </View>
      <Row gap={space.md} style={{ justifyContent: 'center' }}>
        {MUSCLE_BANDS.map((b, i) => (
          <Row key={b.label} gap={4}>
            <View style={{ width: 14, height: 14, borderRadius: 3, backgroundColor: i === 0 ? 'transparent' : colors.heat[i], borderWidth: 1, borderColor: i === 0 ? colors.faint : colors.accent }} />
            <T variant="caption" color={colors.muted}>{b.label}</T>
          </Row>
        ))}
      </Row>
      <T variant="caption" color={colors.faint} center>Set-equivalents: each completed working set adds 1.0 to its primary muscles and 0.5 to secondary muscles.</T>
    </View>
  );
}
