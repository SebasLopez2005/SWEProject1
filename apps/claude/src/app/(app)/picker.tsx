import { router, useNavigation } from 'expo-router';
import { useLayoutEffect, useState } from 'react';
import { clearPickerTarget, pickerTarget } from '../../state/picker';
import { Banner } from '../../ui/kit';
import { ExerciseBrowser } from '../../ui/ExerciseBrowser';

export default function Picker() {
  const target = pickerTarget();
  const navigation = useNavigation();
  const [error, setError] = useState<string | null>(null);
  useLayoutEffect(() => navigation.setOptions({ title: target?.title ?? 'Choose exercise' }), [navigation, target?.title]);
  return (
    <ExerciseBrowser
      includeArchived={target?.allowArchived}
      header={error ? <Banner tone="danger">{error}</Banner> : null}
      onPick={async (e) => {
        if (!target) return router.back();
        try {
          await target.fn(e.id);
          clearPickerTarget();
          router.back();
        } catch (err) {
          setError((err as Error).message);
        }
      }}
    />
  );
}
