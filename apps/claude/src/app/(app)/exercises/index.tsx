import { router } from 'expo-router';
import { ExerciseBrowser } from '../../../ui/ExerciseBrowser';
import { Button } from '../../../ui/kit';

export default function Library() {
  return (
    <ExerciseBrowser
      includeArchived
      header={<Button title="New custom exercise" icon="plus" variant="secondary" onPress={() => router.push('/exercises/new')} />}
      onPick={(e) => router.push(`/exercises/${e.id}`)}
    />
  );
}
