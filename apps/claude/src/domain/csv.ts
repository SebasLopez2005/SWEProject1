// TR-10 export: versioned UTF-8 CSV with RFC 4180 escaping and spreadsheet
// formula protection for user-entered text.
import { monthlyReport, type ExerciseMap } from './analytics';
import { addDays, monthKey } from './dates';
import type { BodyweightReading, Routine, Unit, Workout } from './types';
import { convert, round1 } from './units';

export const EXPORT_SCHEMA_VERSION = '1';

export function csvCell(v: string | number | null | undefined, userText = false): string {
  if (v == null) return '';
  let s = typeof v === 'number' ? String(v) : v;
  if (userText && /^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  if (/[",\n\r]/.test(s)) s = `"${s.replace(/"/g, '""')}"`;
  return s;
}

function row(cells: string[]): string {
  return cells.join(',');
}

export interface ExportRange {
  from: string | null; // null = all time
  to: string;
}

export const WORKOUT_SET_COLUMNS = [
  'schema_version', 'workout_date', 'workout_id', 'routine_id', 'routine_name', 'exercise_id', 'exercise_name', 'exercise_type',
  'phase', 'set_number', 'planned_reps', 'planned_seconds', 'planned_load', 'planned_unit', 'target_rir_min', 'target_rir_max',
  'actual_reps', 'actual_seconds', 'actual_load', 'actual_unit', 'normalized_load_kg', 'actual_rir', 'completed_at',
];

export function workoutSetsCsv(workouts: Workout[], ex: ExerciseMap, range: ExportRange): { csv: string; rows: number } {
  const lines = [row(WORKOUT_SET_COLUMNS)];
  let n = 0;
  const sorted = [...workouts].sort((a, b) => `${a.workoutDate}|${a.startedAt}`.localeCompare(`${b.workoutDate}|${b.startedAt}`));
  for (const w of sorted) {
    if (w.state !== 'finished') continue;
    if (range.from && w.workoutDate < range.from) continue;
    if (w.workoutDate > range.to) continue;
    for (const e of w.entries) {
      const exercise = ex.get(e.exerciseId);
      for (const s of e.sets) {
        if (s.state !== 'done') continue;
        n += 1;
        lines.push(row([
          EXPORT_SCHEMA_VERSION, w.workoutDate, w.id, csvCell(w.routineId), csvCell(w.routineName, true), e.exerciseId,
          csvCell(exercise?.name ?? 'Unknown exercise', true), csvCell(exercise?.type), e.phase, String(s.position),
          csvCell(s.targetReps), csvCell(s.targetSeconds), csvCell(s.targetLoad), csvCell(s.targetUnit), csvCell(s.targetRirMin), csvCell(s.targetRirMax),
          csvCell(s.reps), csvCell(s.seconds), csvCell(s.weight), csvCell(s.unit),
          s.weight != null && s.unit ? round1(convert(s.weight, s.unit, 'kg')) : '', csvCell(s.rir), csvCell(s.completedAt),
        ]));
      }
    }
  }
  return { csv: lines.join('\r\n') + '\r\n', rows: n };
}

export function monthlyCsv(workouts: Workout[], ex: ExerciseMap, range: ExportRange, unit: Unit, today: string): { csv: string; rows: number } {
  const lines = [row(['schema_version', 'month', 'period_start', 'period_end', 'partial', 'sessions', 'working_sets', `weighted_volume_${unit}`, 'reps_only_total', 'timed_seconds_total'])];
  const from = range.from ?? workouts.filter((w) => w.state === 'finished').reduce<string | null>((m, w) => (m == null || w.workoutDate < m ? w.workoutDate : m), null);
  if (!from) return { csv: lines.join('\r\n') + '\r\n', rows: 0 };
  let n = 0;
  for (let key = monthKey(from); key <= monthKey(range.to); key = monthKey(addDays(`${key}-28`, 7))) {
    const r = monthlyReport(workouts, ex, key, unit, today);
    // Clip to the export range.
    const start = r.current.from < from ? from : r.current.from;
    const end = r.current.to > range.to ? range.to : r.current.to;
    const partial = r.inProgress || start !== r.current.from || end !== r.current.to;
    const clipped = partial && !r.inProgress ? monthlyStatsBetween(workouts, ex, start, end, unit) : r.current;
    lines.push(row([EXPORT_SCHEMA_VERSION, key, start, end, partial ? 'true' : 'false', String(clipped.sessions), String(clipped.workingSets), round1(clipped.volume), String(clipped.totalReps), String(clipped.totalSeconds)]));
    n += 1;
  }
  return { csv: lines.join('\r\n') + '\r\n', rows: n };
}

function monthlyStatsBetween(workouts: Workout[], ex: ExerciseMap, from: string, to: string, unit: Unit) {
  const fake = workouts.filter((w) => w.workoutDate >= from && w.workoutDate <= to);
  const r = monthlyReport(fake, ex, monthKey(from), unit, '9999-12-31');
  return r.current;
}

export function bodyweightCsv(readings: BodyweightReading[], range: ExportRange): { csv: string; rows: number } {
  const lines = [row(['schema_version', 'reading_date', 'reading_id', 'weight', 'unit', 'normalized_kg', 'entered_at'])];
  let n = 0;
  for (const r of [...readings].sort((a, b) => a.readingDate.localeCompare(b.readingDate))) {
    if (range.from && r.readingDate < range.from) continue;
    if (r.readingDate > range.to) continue;
    n += 1;
    lines.push(row([EXPORT_SCHEMA_VERSION, r.readingDate, r.id, String(r.weight), r.unit, round1(convert(r.weight, r.unit, 'kg')), r.enteredAt]));
  }
  return { csv: lines.join('\r\n') + '\r\n', rows: n };
}

export function routineNames(routines: Routine[]): string[] {
  return routines.map((r) => r.name);
}
