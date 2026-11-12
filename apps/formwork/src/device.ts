import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Rest, Settings, Workout, dateKey, daysFrom, parseDay, remaining } from './model';

export const clock = (s: number) => Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
const prefix = 'formwork3-';
const restKey = prefix + 'rest';
let deviceQueue = Promise.resolve();
const enqueue = (operation: () => Promise<void>) => {
  deviceQueue = deviceQueue.catch(() => {}).then(operation);
  return deviceQueue;
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: true, shouldSetBadge: false }),
});

export async function permission() {
  const status = await Notifications.requestPermissionsAsync();
  return status.granted || status.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;
}

async function updateActivity(rest: Rest | null) {
  if (Platform.OS !== 'ios') return;
  try {
    const activity = (await import('./live')).default;
    const instances = activity.getInstances();
    if (!rest || remaining(rest) <= 0) {
      await Promise.all(instances.map(instance => instance.end('immediate')));
      return;
    }
    const now = Date.now();
    const props = { from: now, end: rest.deadline ?? now + 1000, paused: rest.deadline ? '' : clock(remaining(rest)) };
    if (instances[0]) await instances[0].update(props);
    else activity.start(props, 'formwork3://session/' + rest.workoutId);
    await Promise.all(instances.slice(1).map(instance => instance.end('immediate')));
  } catch {
    // ActivityKit availability and permission are device-specific.
  }
}

export function reconcileRest(rest: Rest | null, alert: boolean) {
  return enqueue(async () => {
    await updateActivity(rest);
    await Notifications.cancelScheduledNotificationAsync(restKey);
    if (!rest?.deadline || rest.deadline <= Date.now() || !alert) return;
    const granted = await Notifications.getPermissionsAsync();
    if (!granted.granted) return;
    await Notifications.scheduleNotificationAsync({
      identifier: restKey,
      content: { title: 'Rest complete', body: 'Ready for your next set?', sound: 'default', data: { workoutId: rest.workoutId } },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: new Date(rest.deadline) },
    });
  });
}

const messages = ['Have you trained today?', 'Short on time? Start with one planned lift.', 'Log the set that moves you closer to your goal.'];
export function reconcileReminders(settings: Settings | null, workouts: Workout[]) {
  return enqueue(async () => {
    const keys = (await Notifications.getAllScheduledNotificationsAsync()).filter(x => x.identifier.startsWith(prefix + 'remind-'));
    const desired = new Map<string, Date>();
    const granted = settings?.reminders ? await Notifications.getPermissionsAsync() : null;
    if (settings?.reminders && granted?.granted) {
      for (let offset = 0; offset < 28; offset++) {
        const key = daysFrom(offset);
        const date = parseDay(key);
        date.setHours(settings.hour, settings.minute, 0, 0);
        if (date.getTime() <= Date.now() || !settings.weekdays.includes(date.getDay()) ||
          workouts.some(w => w.date === key && w.state === 'finished')) continue;
        desired.set(prefix + 'remind-' + key, date);
      }
    }
    for (const existing of keys) {
      const date = desired.get(existing.identifier);
      if (date && Number(existing.content.data?.scheduledAt) === date.getTime()) desired.delete(existing.identifier);
      else await Notifications.cancelScheduledNotificationAsync(existing.identifier);
    }
    for (const [identifier, date] of desired) {
      const index = Math.round(Date.parse(dateKey(date)) / 86400000) % messages.length;
      await Notifications.scheduleNotificationAsync({
        identifier,
        content: { title: 'Formwork', body: messages[index], sound: 'default', data: { workout: true, scheduledAt: date.getTime() } },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date },
      });
    }
  });
}
