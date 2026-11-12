import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useLayoutEffect } from 'react';
import type { BodyFigure } from '../../../domain/types';
import { EXERCISE_TYPE_LABEL } from '../../../domain/types';
import { useLoad, useSession } from '../../../state/session';
import { FormGuide } from '../../../ui/FormGuide';
import { Button, Empty, Loading, Row, Screen, Segmented, T } from '../../../ui/kit';
import { colors } from '../../../ui/theme';

/** TR-06A: how to perform one exercise (from the library, picker or workout). */
export default function HowToPerform() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { repo, settings } = useSession();
  const navigation = useNavigation();
  const { data } = useLoad(() => repo.getExercise(id), [id], ['exercises']);
  useLayoutEffect(() => navigation.setOptions({ title: data?.name ?? 'How to perform', headerRight: () => <Button title="Done" variant="ghost" compact onPress={() => router.back()} /> }), [navigation, data?.name]);
  if (data === undefined) return <Loading />;
  if (!data) return <Screen><Empty title="Exercise not found" body="It may have been deleted." /></Screen>;
  return (
    <Screen>
      <Row style={{ justifyContent: 'space-between' }}>
        <T variant="small" color={colors.muted}>{EXERCISE_TYPE_LABEL[data.type]} · {data.equipment}</T>
      </Row>
      <Segmented label="Body figure" value={settings.bodyFigure} onChange={(f: BodyFigure) => repo.updateSettings({ bodyFigure: f })}
        options={[{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }]} />
      <FormGuide exercise={data} figure={settings.bodyFigure} />
      <Button title="Exercise history" variant="secondary" icon="clock.arrow.circlepath" onPress={() => { router.back(); router.push(`/exercises/${data.id}`); }} />
    </Screen>
  );
}
