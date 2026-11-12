import { Redirect, Stack } from 'expo-router';
import { useApp } from '../../state/session';
import { Loading } from '../../ui/kit';
import { pushedOptions } from '../../ui/nav';

/** Every route in this group needs an opened owner partition. */
export default function AppLayout() {
  const { phase, session } = useApp();
  if (phase === 'signed_out') return <Redirect href="/sign-in" />;
  if (!session) return <Loading />;
  return (
    <Stack screenOptions={pushedOptions}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false, title: 'Back' }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="picker" options={{ presentation: 'modal', title: 'Choose exercise' }} />
      <Stack.Screen name="workout/index" options={{ title: 'Workout' }} />
      <Stack.Screen name="workout/start" options={{ title: 'Start workout' }} />
      <Stack.Screen name="workout/summary" options={{ title: 'Workout saved', headerBackVisible: false, gestureEnabled: false }} />
      <Stack.Screen name="workout/[id]" options={{ title: 'Workout' }} />
      <Stack.Screen name="exercises/index" options={{ title: 'Exercise library' }} />
      <Stack.Screen name="exercises/new" options={{ title: 'New exercise' }} />
      <Stack.Screen name="exercises/[id]" options={{ title: 'Exercise' }} />
      <Stack.Screen name="routine/[id]" options={{ title: 'Routine' }} />
      <Stack.Screen name="week/[start]" options={{ title: 'Week' }} />
      <Stack.Screen name="settings" options={{ title: 'Settings' }} />
      <Stack.Screen name="sync" options={{ title: 'Sync' }} />
      <Stack.Screen name="form/[id]" options={{ presentation: 'modal', title: 'How to perform' }} />
    </Stack>
  );
}
