// Calendar-date helpers. Workout dates are plain YYYY-MM-DD strings and never
// shift when the device timezone changes.

const pad = (n: number) => String(n).padStart(2, '0');

export function toDateString(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function todayLocal(now: Date = new Date()): string {
  return toDateString(now);
}

/** Parse YYYY-MM-DD into a UTC-midnight Date used only for arithmetic. */
export function parseDate(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export function formatUTC(d: Date): string {
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

export function addDays(s: string, days: number): string {
  const d = parseDate(s);
  d.setUTCDate(d.getUTCDate() + days);
  return formatUTC(d);
}

export function diffDays(a: string, b: string): number {
  return Math.round((parseDate(a).getTime() - parseDate(b).getTime()) / 86400000);
}

/** ISO weekday: 1 = Monday ... 7 = Sunday. */
export function isoWeekday(s: string): number {
  const w = parseDate(s).getUTCDay();
  return w === 0 ? 7 : w;
}

/** Weeks start Monday. */
export function mondayOf(s: string): string {
  return addDays(s, 1 - isoWeekday(s));
}

export function isValidDateString(s: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  return formatUTC(parseDate(s)) === s;
}

export function isFuture(s: string, today: string = todayLocal()): boolean {
  return s > today;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function formatDateLong(s: string): string {
  const d = parseDate(s);
  return `${DAYS[isoWeekday(s) - 1]}, ${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

export function formatDateShort(s: string): string {
  const d = parseDate(s);
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}`;
}

export function monthKey(s: string): string {
  return s.slice(0, 7);
}

export function monthLabel(key: string): string {
  const [y, m] = key.split('-').map(Number);
  return `${MONTHS_LONG[m - 1]} ${y}`;
}

export function monthStart(key: string): string {
  return `${key}-01`;
}

export function monthEnd(key: string): string {
  const [y, m] = key.split('-').map(Number);
  const last = new Date(Date.UTC(y, m, 0)).getUTCDate();
  return `${key}-${pad(last)}`;
}

export function previousMonthKey(key: string): string {
  const [y, m] = key.split('-').map(Number);
  return m === 1 ? `${y - 1}-12` : `${y}-${pad(m - 1)}`;
}

export function weekdayShort(i: number): string {
  return DAYS[i - 1];
}

export function formatDuration(seconds: number | null): string {
  if (seconds == null) return 'Not recorded';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h} h ${m} min`;
  if (m > 0) return `${m} min`;
  return `${seconds} s`;
}

export function formatClock(totalSeconds: number): string {
  const s = Math.max(0, Math.round(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return h > 0 ? `${h}:${pad(m)}:${pad(s % 60)}` : `${m}:${pad(s % 60)}`;
}

export function timezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone ?? 'UTC';
  } catch {
    return 'UTC';
  }
}
