import { Stack } from 'expo-router';
import { largeTitleOptions, pushedOptions } from '../../../../ui/nav';

export default function Layout() {
  return (
    <Stack screenOptions={pushedOptions}>
      <Stack.Screen name="index" options={{ ...largeTitleOptions, title: 'Routines' }} />
    </Stack>
  );
}
