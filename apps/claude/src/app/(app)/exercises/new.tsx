import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { EXERCISE_TYPE_LABEL, type ExerciseType } from '../../../domain/types';
import { MUSCLE_LABEL } from '../../../domain/preparation';
import { useSession } from '../../../state/session';
import { Banner, Button, Chip, Field, Row, Screen, Section, Segmented, T } from '../../../ui/kit';
import { colors } from '../../../ui/theme';

/** FW-12 / TR-06: custom exercise with a name, logging type and optional muscle tags. */
export default function NewExercise() {
  const params = useLocalSearchParams<{ name?: string }>();
  const { repo } = useSession();
  const [name, setName] = useState(params.name ?? '');
  const [type, setType] = useState<ExerciseType>('weight_reps');
  const [primary, setPrimary] = useState<string[]>([]);
  const [secondary, setSecondary] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const toggle = (list: string[], set: (v: string[]) => void, m: string) => set(list.includes(m) ? list.filter((x) => x !== m) : [...list, m]);

  return (
    <Screen footer={<Button title="Create exercise" onPress={async () => {
      setError(null);
      try {
        const ex = await repo.createExercise({ name, type, primaryMuscles: primary, secondaryMuscles: secondary.filter((m) => !primary.includes(m)) });
        router.replace(`/exercises/${ex.id}`);
      } catch (e) { setError((e as Error).message); }
    }} />}>
      <Field label="Name" value={name} onChangeText={setName} maxLength={60} placeholder="e.g. Towel Row" hint={`${name.trim().length}/60 · must not match an existing exercise (ignoring case and spaces)`} />
      <T variant="small" color={colors.muted} weight="600">What do you record?</T>
      <Segmented label="Exercise type" value={type} onChange={setType} options={(Object.keys(EXERCISE_TYPE_LABEL) as ExerciseType[]).map((t) => ({ value: t, label: EXERCISE_TYPE_LABEL[t] }))} />
      <T variant="caption" color={colors.faint}>The type locks once a set uses this exercise.</T>
      <Section title="Primary muscles (optional)">
        <Row>{Object.entries(MUSCLE_LABEL).map(([k, v]) => <Chip key={k} label={v} selected={primary.includes(k)} onPress={() => toggle(primary, setPrimary, k)} accessibilityLabel={`Primary muscle ${v}`} />)}</Row>
      </Section>
      <Section title="Secondary muscles (optional)">
        <Row>{Object.entries(MUSCLE_LABEL).filter(([k]) => !primary.includes(k)).map(([k, v]) => <Chip key={k} label={v} selected={secondary.includes(k)} onPress={() => toggle(secondary, setSecondary, k)} accessibilityLabel={`Secondary muscle ${v}`} />)}</Row>
      </Section>
      <T variant="caption" color={colors.faint}>Only you can see your custom exercises.</T>
      {error ? <Banner tone="danger">{error}</Banner> : null}
    </Screen>
  );
}
