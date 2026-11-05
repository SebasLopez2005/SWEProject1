import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LogBox } from 'react-native';
import { SessionProvider, useApp } from '../src/session';
import { c } from '../src/ui';

// SDK 58 can dispatch this redundant dev action while the protected tab navigator mounts.
if (__DEV__) LogBox.ignoreLogs([/The action 'ROUTE_NAMES_CHANGED' with payload .*"index","history","progress","exercises","templates","settings".* was not handled by any navigator/]);

function Navigation() {
  const { owner, model } = useApp();
  return <>
    <StatusBar style="dark" />
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: c.bg } }}>
      <Stack.Protected guard={!owner || !model?.hasSettings}>
        <Stack.Screen name="welcome" />
      </Stack.Protected>
      <Stack.Protected guard={!!owner && !!model?.hasSettings}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="workout" />
        <Stack.Screen name="exercise" />
        <Stack.Screen name="template" />
      </Stack.Protected>
    </Stack>
  </>;
}
export default function Layout() {
  return <SessionProvider><Navigation /></SessionProvider>;
}
