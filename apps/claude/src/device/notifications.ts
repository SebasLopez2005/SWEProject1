import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

let configured = false;

export function configureNotifications() {
  if (configured) return;
  configured = true;
  Notifications.setNotificationHandler({
    handleNotification: async (n) => {
      const kind = (n.request.content.data as any)?.kind;
      // In the foreground the rest countdown is already visible in the app.
      const show = kind !== 'rest';
      return { shouldShowBanner: show, shouldShowList: show, shouldPlaySound: kind === 'rest', shouldSetBadge: false };
    },
  });
}

export async function notificationPermission(request: boolean): Promise<'granted' | 'denied' | 'undetermined'> {
  try {
    const current = await Notifications.getPermissionsAsync();
    if (current.granted || current.ios?.status === 3 /* PROVISIONAL */) return 'granted';
    if (!request || !current.canAskAgain) return current.status === 'undetermined' ? 'undetermined' : 'denied';
    const res = await Notifications.requestPermissionsAsync({ ios: { allowAlert: true, allowSound: true, allowBadge: false } });
    return res.granted ? 'granted' : 'denied';
  } catch {
    return 'denied';
  }
}

export async function scheduleAt(date: Date, title: string, body: string, data: Record<string, string>): Promise<string | null> {
  try {
    return await Notifications.scheduleNotificationAsync({
      content: { title, body, data, sound: Platform.OS === 'ios' ? 'default' : undefined },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date },
    });
  } catch {
    return null;
  }
}

export async function cancel(id: string | null | undefined) {
  if (!id) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(id);
  } catch {
    /* already delivered or removed */
  }
}
