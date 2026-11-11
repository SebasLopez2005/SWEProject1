import { Stack, router, useSegments } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider, useApp } from '../state/session';
import { Banner, Button, Loading, Screen, T } from '../ui/kit';
import { colors } from '../ui/theme';

function Gate() {
  const { phase, session, settings, error } = useApp();
  const segments = useSegments();
  useEffect(() => {
    if (phase === 'loading' || phase === 'error') return;
    const atAuth = segments[0] === 'sign-in';
    const atOnboarding = (segments as string[]).includes('onboarding');
    if (phase === 'signed_out' && !atAuth) router.replace('/sign-in');
    else if (phase === 'ready' && session && !settings.unitChosen && !atOnboarding) router.replace('/onboarding');
    else if (phase === 'ready' && settings.unitChosen && (atAuth || atOnboarding)) router.replace('/');
  }, [phase, session, settings.unitChosen, segments]);

  useEffect(() => {
    // Reminder or rest notification taps open the matching workout entry point.
    const sub = Notifications.addNotificationResponseReceivedListener((r) => {
      const url = (r.notification.request.content.data as any)?.url;
      if (typeof url === 'string' && phase === 'ready') router.push(url as any);
    });
    return () => sub.remove();
  }, [phase]);

  if (phase === 'error')
    return (
      <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.canvas, paddingTop: 80 }]}>
        <Screen>
          <T variant="title">Something went wrong</T>
          <Banner tone="danger">{error}</Banner>
          <Button title="Sign in again" onPress={() => router.replace('/sign-in')} />
        </Screen>
      </View>
    );
  return null;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.canvas } }}>
          <Stack.Screen name="(app)" />
          <Stack.Screen name="sign-in" options={{ gestureEnabled: false }} />
        </Stack>
        <Gate />
        <BootOverlay />
      </AppProvider>
    </SafeAreaProvider>
  );
}

function BootOverlay() {
  const { phase } = useApp();
  if (phase !== 'loading') return null;
  return (
    <View style={StyleSheet.absoluteFill}>
      <Loading />
    </View>
  );
}
