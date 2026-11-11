// TR-12: opt-in reminders. One request per eligible local date (next 14 days),
// skipping dates that already have a finished workout. Reconciled on launch,
// after recording a workout, on schedule changes and after a synced completion.
import type { Repository } from '../data/repository';
import { planReminders } from '../domain/reminderPlan';
import { cancel, notificationPermission, scheduleAt } from './notifications';

export { planReminders };

const KEY = 'reminder_requests';
export type ReminderStatus = 'off' | 'scheduled' | 'permission_denied';

export async function reconcileReminders(repo: Repository, requestPermission = false): Promise<ReminderStatus> {
  const pref = await repo.getReminder();
  const existing = (await repo.getDeviceState<{ id: string; date: string }[]>(KEY)) ?? [];
  for (const r of existing) await cancel(r.id);
  await repo.setDeviceState(KEY, []);
  if (!pref.enabled) return 'off';
  const perm = await notificationPermission(requestPermission);
  if (perm !== 'granted') return 'permission_denied';
  const finished = await repo.finishedWorkouts();
  const plan = planReminders({ enabled: true, weekdays: pref.weekdays, time: pref.time, now: new Date(), completedDates: new Set(finished.map((w) => w.workoutDate)) });
  const ids: { id: string; date: string }[] = [];
  for (const p of plan) {
    const id = await scheduleAt(p.at, 'Workout reminder', p.message, { kind: 'reminder', url: '/' });
    if (id) ids.push({ id, date: p.date });
  }
  await repo.setDeviceState(KEY, ids);
  return 'scheduled';
}

export async function cancelAllReminders(repo: Repository) {
  const existing = (await repo.getDeviceState<{ id: string; date: string }[]>(KEY)) ?? [];
  for (const r of existing) await cancel(r.id);
  await repo.setDeviceState(KEY, []);
}
