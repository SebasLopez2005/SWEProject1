import { addDays, isoWeekday, todayLocal } from './dates';
import { REMINDER_MESSAGES } from './preparation';

export const HORIZON_DAYS = 14;

export interface ReminderPlan {
  date: string;
  at: Date;
  message: string;
}

/** Pure planner, unit-tested: which local dates get a reminder. */
export function planReminders(opts: { enabled: boolean; weekdays: number[]; time: string; now: Date; completedDates: Set<string> }): ReminderPlan[] {
  if (!opts.enabled || opts.weekdays.length === 0) return [];
  const [hh, mm] = opts.time.split(':').map(Number);
  const today = todayLocal(opts.now);
  const out: ReminderPlan[] = [];
  for (let i = 0; i < HORIZON_DAYS; i++) {
    const date = addDays(today, i);
    if (!opts.weekdays.includes(isoWeekday(date))) continue;
    if (opts.completedDates.has(date)) continue;
    const [y, m, d] = date.split('-').map(Number);
    const at = new Date(y, m - 1, d, hh, mm, 0, 0);
    if (at.getTime() <= opts.now.getTime()) continue;
    const idx = (y * 372 + m * 31 + d) % REMINDER_MESSAGES.length;
    out.push({ date, at, message: REMINDER_MESSAGES[idx] });
  }
  return out;
}

