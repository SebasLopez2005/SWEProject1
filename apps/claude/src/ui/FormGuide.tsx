// TR-06A: "How to perform" — a looping start/end form demonstration from the
// pinned catalog photos (loaded on demand, cached), numbered text steps that
// work offline, and the muscles worked on the selected body figure.
import { Image } from 'expo-image';
import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Pressable, View } from 'react-native';
import { mediaUrls } from '../data/catalog';
import { MUSCLE_LABEL } from '../domain/preparation';
import type { BodyFigure, Exercise } from '../domain/types';
import { MusclesWorked } from './BodyMap';
import { Card, Icon, Row, T } from './kit';
import { colors, radius, space } from './theme';

const FRAME_MS = 1100;

export function FormDemo({ exercise }: { exercise: Exercise }) {
  const urls = mediaUrls(exercise.media);
  const [playing, setPlaying] = useState(true);
  const [frame, setFrame] = useState(0);
  const [failed, setFailed] = useState(false);
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Respect Reduce Motion: show a still start position until the lifter presses play.
    AccessibilityInfo.isReduceMotionEnabled().then((r) => r && setPlaying(false)).catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!playing || urls.length < 2) return;
    const t = setInterval(() => setFrame((f) => (f + 1) % urls.length), FRAME_MS);
    return () => clearInterval(t);
  }, [playing, urls.length]);

  useEffect(() => {
    Animated.timing(fade, { toValue: frame, duration: 260, useNativeDriver: true }).start();
  }, [frame, fade]);

  if (!urls.length) {
    return (
      <Card>
        <Row gap={space.sm}><Icon name="figure.strengthtraining.traditional" size={16} color={colors.faint} /><T variant="small" color={colors.muted}>No photo demonstration for this exercise. Follow the steps below.</T></Row>
      </Card>
    );
  }
  if (failed) {
    return (
      <Card>
        <Row gap={space.sm}><Icon name="wifi.slash" size={16} color={colors.faint} /><T variant="small" color={colors.muted}>The photo demonstration needs a connection the first time. Steps and muscles below work offline.</T></Row>
      </Card>
    );
  }
  const label = frame === 0 ? 'Start position' : 'End position';
  return (
    <View style={{ borderRadius: radius.lg, overflow: 'hidden', backgroundColor: '#fff' }} accessible accessibilityRole="image"
      accessibilityLabel={`Form demonstration for ${exercise.name}, ${label}. ${playing ? 'Playing' : 'Paused'}.`}>
      <View style={{ aspectRatio: 1.45 }}>
        {urls.slice(0, 2).map((u, i) => (
          <Animated.View key={u} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: i === 0 ? fade.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }) : fade }}>
            <Image source={{ uri: u }} style={{ flex: 1 }} contentFit="contain" cachePolicy="disk" transition={0} onError={() => setFailed(true)} accessibilityIgnoresInvertColors />
          </Animated.View>
        ))}
      </View>
      <View style={{ position: 'absolute', left: 10, bottom: 10, right: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ backgroundColor: 'rgba(14,14,16,0.78)', borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4 }}>
          <T variant="caption" weight="600">{label}</T>
        </View>
        <Pressable onPress={() => setPlaying((p) => !p)} accessibilityRole="button" accessibilityLabel={playing ? 'Pause demonstration' : 'Play demonstration'} hitSlop={8}
          style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(14,14,16,0.78)', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={playing ? 'pause.fill' : 'play.fill'} size={14} />
        </Pressable>
      </View>
    </View>
  );
}

export function FormSteps({ exercise }: { exercise: Exercise }) {
  const steps = exercise.instructions.split('\n').map((s) => s.trim()).filter(Boolean);
  if (!steps.length) return <T variant="small" color={colors.muted}>No written steps for this exercise. Custom exercises use your own notes.</T>;
  return (
    <View style={{ gap: space.sm }}>
      {steps.map((s, i) => (
        <Row key={i} gap={space.md} style={{ alignItems: 'flex-start', flexWrap: 'nowrap' }}>
          <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center', marginTop: 1 }}>
            <T variant="caption" weight="700" color={colors.accent} tabular>{i + 1}</T>
          </View>
          <T variant="small" style={{ flex: 1 }}>{s}</T>
        </Row>
      ))}
    </View>
  );
}

export function FormGuide({ exercise, figure }: { exercise: Exercise; figure: BodyFigure }) {
  const muscles = [...exercise.primaryMuscles.map((m) => MUSCLE_LABEL[m] ?? m), ...exercise.secondaryMuscles.map((m) => `${MUSCLE_LABEL[m] ?? m} (secondary)`)];
  return (
    <View style={{ gap: space.md }}>
      <FormDemo exercise={exercise} />
      <Card>
        <T variant="h3">Muscles worked</T>
        {exercise.primaryMuscles.length || exercise.secondaryMuscles.length ? (
          <>
            <MusclesWorked primary={exercise.primaryMuscles} secondary={exercise.secondaryMuscles} figure={figure} />
            <T variant="small" color={colors.muted}>{muscles.join(' · ')}</T>
          </>
        ) : <T variant="small" color={colors.muted}>No muscles are tagged for this exercise.</T>}
      </Card>
      <Card>
        <T variant="h3">How to perform</T>
        <FormSteps exercise={exercise} />
        <T variant="caption" color={colors.faint}>Move within a comfortable range and stop if something hurts. Photos and steps: Free Exercise DB (Unlicense).</T>
      </Card>
    </View>
  );
}
