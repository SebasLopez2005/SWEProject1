import { Stack } from 'expo-router';
import { DarkTheme, ThemeProvider } from 'expo-router/react-navigation';
import { StatusBar } from 'expo-status-bar';
import { LogBox } from 'react-native';
import { SessionProvider, useApp } from '../src/session';
import { c, GlassControlsProvider } from '../src/ui';

// Keep SDK 58 navigation and native animation diagnostics in Metro without blocking tabs in the demo.
if (__DEV__) LogBox.ignoreLogs([
  /The action 'ROUTE_NAMES_CHANGED' with payload .*"index","history","progress","exercises","templates","settings".* was not handled by any navigator/,
  'Sending `onAnimatedValueUpdate` with no listeners registered.',
]);

const theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: c.bg,
    border: c.line,
    card: c.surface,
    primary: c.accent,
    text: c.text,
  },
};

function Navigation() {
  const { owner, model } = useApp();
  return <>
    <StatusBar style="light" />
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
  return <ThemeProvider value={theme}>
    <GlassControlsProvider>
      <SessionProvider><Navigation /></SessionProvider>
    </GlassControlsProvider>
  </ThemeProvider>;
}
