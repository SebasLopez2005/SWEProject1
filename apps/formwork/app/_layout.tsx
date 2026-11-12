import { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import { AppProvider, useApp } from '../src/state';
import { Welcome } from '../src/Welcome';
import { c, UIEnvironment } from '../src/ui';

function Routes() {
  const app = useApp();
  const router = useRouter();
  useEffect(() => {
    if (!app.account) return;
    const handle = (response: Notifications.NotificationResponse) => {
      const data = response.notification.request.content.data ?? {};
      if (typeof data.workoutId === 'string') router.push({ pathname: '/session/[id]', params: { id: data.workoutId } });
      else if (data.workout) router.replace('/');
      void Notifications.clearLastNotificationResponseAsync();
    };
    const last = Notifications.getLastNotificationResponse();
    if (last) handle(last);
    const listener = Notifications.addNotificationResponseReceivedListener(handle);
    return () => listener.remove();
  }, [app.account, router]);
  return <UIEnvironment scale={app.settings.scale}>
    <StatusBar style="light" />
    {app.account ? <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: c.bg } }} /> : <Welcome />}
  </UIEnvironment>;
}
export default function Layout() {
  return <AppProvider><Routes /></AppProvider>;
}
