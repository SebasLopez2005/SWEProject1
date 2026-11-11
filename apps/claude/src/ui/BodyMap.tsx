// TR-07A: anatomical front/back body figure (male or female) from
// react-native-body-highlighter (MIT). Catalog muscle tags map to figure
// regions; deeper champagne = more estimated working-set volume. The legend
// and exact-value list next to it carry the same information without colour.
import { memo, useMemo } from 'react';
import { View, useWindowDimensions } from 'react-native';
import Body, { type ExtendedBodyPart, type Slug } from 'react-native-body-highlighter';
import { MUSCLE_BANDS, muscleBand } from '../domain/analytics';
import type { BodyFigure } from '../domain/types';
import { Row, T } from './kit';
import { colors, space } from './theme';

/** Catalog muscle tag → figure regions. */
export const SLUGS_FOR_MUSCLE: Record<string, Slug[]> = {
  abdominals: ['abs', 'obliques'],
  abductors: ['abductors'],
  adductors: ['adductors'],
  biceps: ['biceps'],
  calves: ['calves'],
  chest: ['chest'],
  forearms: ['forearm'],
  glutes: ['gluteal'],
  hamstrings: ['hamstring'],
  lats: ['upper-back'],
  'lower back': ['lower-back'],
  'middle back': ['upper-back'],
  neck: ['neck'],
  quadriceps: ['quadriceps'],
  shoulders: ['deltoids'],
  traps: ['trapezius'],
  triceps: ['triceps'],
};

const NEUTRAL: Slug[] = ['hair', 'head', 'hands', 'feet', 'knees', 'ankles', 'tibialis'];

/** Figure region tapped → catalog muscles it represents. */
export function musclesForSlug(slug: Slug | undefined): string[] {
  if (!slug) return [];
  return Object.entries(SLUGS_FOR_MUSCLE).filter(([, s]) => s.includes(slug)).map(([m]) => m);
}

function partsFromScores(scores: Map<string, number>, selected: string | null): ExtendedBodyPart[] {
  const bySlug = new Map<Slug, number>();
  for (const [muscle, score] of scores) {
    for (const slug of SLUGS_FOR_MUSCLE[muscle] ?? []) bySlug.set(slug, Math.max(bySlug.get(slug) ?? 0, score)); // shared regions use the larger score
  }
  const selectedSlugs = new Set(selected ? SLUGS_FOR_MUSCLE[selected] ?? [] : []);
  const parts: ExtendedBodyPart[] = NEUTRAL.map((slug) => ({ slug, styles: { fill: colors.figureSkin } }));
  const allSlugs = new Set<Slug>([...bySlug.keys(), ...selectedSlugs]);
  for (const slug of allSlugs) {
    const band = muscleBand(bySlug.get(slug) ?? 0);
    parts.push({
      slug,
      styles: {
        fill: band === 0 ? colors.figureBase : colors.heat[band],
        stroke: selectedSlugs.has(slug) ? colors.text : undefined,
        strokeWidth: selectedSlugs.has(slug) ? 3 : undefined,
      },
    });
  }
  return parts;
}

function Figure({ figure, side, parts, scale, onPress }: { figure: BodyFigure; side: 'front' | 'back'; parts: ExtendedBodyPart[]; scale: number; onPress?: (slug: Slug | undefined) => void }) {
  return (
    <View style={{ alignItems: 'center' }}>
      <Body
        data={parts}
        gender={figure}
        side={side}
        scale={scale}
        border={colors.border}
        defaultFill={colors.figureBase}
        onBodyPartPress={onPress ? (p) => onPress(p.slug) : undefined}
      />
      <T variant="caption" color={colors.faint}>{side === 'front' ? 'Front' : 'Back'}</T>
    </View>
  );
}

/** Heat map of estimated working-set volume (TR-07 / TR-07A). */
export const BodyMap = memo(function BodyMap({ scores, selected, onSelect, figure, compact }: { scores: Map<string, number>; selected: string | null; onSelect: (muscle: string) => void; figure: BodyFigure; compact?: boolean }) {
  const { width } = useWindowDimensions();
  const scale = Math.min((width - space.lg * 4) / 2 / 200, compact ? 0.7 : 0.85);
  const parts = useMemo(() => partsFromScores(scores, selected), [scores, selected]);
  const press = (slug: Slug | undefined) => {
    const candidates = musclesForSlug(slug);
    if (!candidates.length) return;
    const best = candidates.reduce((a, b) => ((scores.get(b) ?? 0) > (scores.get(a) ?? 0) ? b : a));
    onSelect(best);
  };
  return (
    <View style={{ gap: space.sm }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around' }} accessible={false} importantForAccessibility="no-hide-descendants">
        <Figure figure={figure} side="front" parts={parts} scale={scale} onPress={press} />
        <Figure figure={figure} side="back" parts={parts} scale={scale} onPress={press} />
      </View>
      {!compact ? (
        <Row gap={space.md} style={{ justifyContent: 'center' }}>
          {MUSCLE_BANDS.map((b, i) => (
            <Row key={b.label} gap={4}>
              <View style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: i === 0 ? colors.figureBase : colors.heat[i], borderWidth: i === 0 ? 1 : 0, borderColor: colors.border }} />
              <T variant="caption" color={colors.muted}>{b.label}</T>
            </Row>
          ))}
        </Row>
      ) : null}
    </View>
  );
});

/** TR-06A: muscles an exercise works, primary in champagne and secondary dimmer. */
export const MusclesWorked = memo(function MusclesWorked({ primary, secondary, figure }: { primary: string[]; secondary: string[]; figure: BodyFigure }) {
  const { width } = useWindowDimensions();
  const scale = Math.min((width - space.lg * 4) / 2 / 200, 0.62);
  const parts = useMemo(() => {
    const out: ExtendedBodyPart[] = NEUTRAL.map((slug) => ({ slug, styles: { fill: colors.figureSkin } }));
    const seen = new Set<Slug>();
    for (const m of primary) for (const slug of SLUGS_FOR_MUSCLE[m] ?? []) if (!seen.has(slug)) { seen.add(slug); out.push({ slug, styles: { fill: colors.accent } }); }
    for (const m of secondary) for (const slug of SLUGS_FOR_MUSCLE[m] ?? []) if (!seen.has(slug)) { seen.add(slug); out.push({ slug, styles: { fill: colors.heat[2] } }); }
    return out;
  }, [primary, secondary]);
  return (
    <View style={{ gap: space.sm }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around' }} accessible={false} importantForAccessibility="no-hide-descendants">
        <Figure figure={figure} side="front" parts={parts} scale={scale} />
        <Figure figure={figure} side="back" parts={parts} scale={scale} />
      </View>
      <Row gap={space.md} style={{ justifyContent: 'center' }}>
        <Row gap={4}><View style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: colors.accent }} /><T variant="caption" color={colors.muted}>Primary</T></Row>
        <Row gap={4}><View style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: colors.heat[2] }} /><T variant="caption" color={colors.muted}>Secondary</T></Row>
      </Row>
    </View>
  );
});
