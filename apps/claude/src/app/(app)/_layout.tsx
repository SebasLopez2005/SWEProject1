import { Redirect, Stack } from 'expo-router';
import { useApp } from '../../state/session';
import { Loading } from '../../ui/kit';
import { colors } from '../../ui/theme';

/** Every route in this group needs an opened owner partition. */
export default function AppLayout() {
  const { phase, session } = useApp();
  if (phase === 'signed_out') return <Redirect href="/sign-in" />;
  if (!session) return <Loading />;
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.canvas },
        headerTintColor: colors.accent,
        headerTitleStyle: { color: colors.text },
        contentStyle: { backgroundColor: colors.canvas },
        headerBackButtonDisplayMode: 'minimal',
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false, title: 'Back' }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="picker" options={{ presentation: 'modal', title: 'Choose exercise' }} />
      <Stack.Screen name="workout/index" options={{ title: 'Workout' }} />
      <Stack.Screen name="workout/start" options={{ title: 'Start workout' }} />
      <Stack.Screen name="workout/summary" options={{ title: 'Summary', headerBackVisible: false, gestureEnabled: false }} />
      <Stack.Screen name="workout/[id]" options={{ title: 'Workout' }} />
      <Stack.Screen name="exercises/index" options={{ title: 'Exercise library' }} />
      <Stack.Screen name="exercises/new" options={{ title: 'New exercise' }} />
      <Stack.Screen name="exercises/[id]" options={{ title: 'Exercise' }} />
      <Stack.Screen name="routine/[id]" options={{ title: 'Routine' }} />
      <Stack.Screen name="week/[start]" options={{ title: 'Week' }} />
      <Stack.Screen name="profile/muscles" options={{ title: 'Muscle activity' }} />
      <Stack.Screen name="profile/report" options={{ title: 'Monthly report' }} />
      <Stack.Screen name="profile/goals" options={{ title: 'Lift goals' }} />
      <Stack.Screen name="profile/bodyweight" options={{ title: 'Bodyweight' }} />
      <Stack.Screen name="profile/export" options={{ title: 'Export my data' }} />
      <Stack.Screen name="settings" options={{ title: 'Settings' }} />
      <Stack.Screen name="sync" options={{ title: 'Sync' }} />
    </Stack>
  );
}
