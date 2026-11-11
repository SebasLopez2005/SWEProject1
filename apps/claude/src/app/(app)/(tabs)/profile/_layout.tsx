import { Stack } from 'expo-router';
import { largeTitleOptions, pushedOptions } from '../../../../ui/nav';

export default function Layout() {
  return (
    <Stack screenOptions={pushedOptions}>
      <Stack.Screen name="index" options={{ ...largeTitleOptions, title: 'Profile' }} />
      <Stack.Screen name="muscles" options={{ title: 'Muscle activity' }} />
      <Stack.Screen name="report" options={{ title: 'Monthly report' }} />
      <Stack.Screen name="goals" options={{ title: 'Lift goals' }} />
      <Stack.Screen name="bodyweight" options={{ title: 'Bodyweight' }} />
      <Stack.Screen name="export" options={{ title: 'Export my data' }} />
    </Stack>
  );
}
