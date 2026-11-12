import { describe, expect, it } from 'vitest';
import { goalProgress, monthlyReport, muscleActivity, muscleBand, exerciseSeries, weeklyVolume, weeklyComparisonSentence, suggestActual } from '../src/domain/analytics';
import { csvCell, workoutSetsCsv } from '../src/domain/csv';
import { addDays, isoWeekday, mondayOf } from '../src/domain/dates';
import type { Exercise, LiftGoal, SetRow, Workout } from '../src/domain/types';
import { convert, formatStoredWeight } from '../src/domain/units';
import { normalizeName, validateActual, validateTargets } from '../src/domain/validation';

const ex = (id: string, type: Exercise['type'], pm: string[] = [], sm: string[] = []): Exercise => ({
  id, ownerId: null, name: id, normalizedName: id, type, category: 'strength', equipment: 'barbell', primaryMuscles: pm, secondaryMuscles: sm,
  instructions: '', sourceId: null, archived: false, everUsed: true, revision: 0,
});

let n = 0;
const set = (p: Partial<SetRow>): SetRow => ({
  id: `s${++n}`, entryId: 'e', position: 1, state: 'done', targetReps: null, targetSeconds: null, targetLoad: null, targetUnit: null, targetRirMin: null,
  targetRirMax: null, weight: null, unit: null, reps: null, seconds: null, rir: null, completedAt: null, ...p,
});

const workout = (id: string, date: string, entries: { exerciseId: string; phase?: 'work' | 'warmup' | 'mobility'; sets: SetRow[] }[]): Workout => ({
  id, workoutDate: date, state: 'finished', startedAt: `${date}T10:00:00.000Z`, finishedAt: `${date}T11:00:00.000Z`, durationSeconds: 3600, routineId: null,
  routineName: null, defaultRestSeconds: null, backdated: false, revision: 0,
  entries: entries.map((e, i) => ({ id: `${id}-e${i}`, workoutId: id, exerciseId: e.exerciseId, position: i + 1, phase: e.phase ?? 'work', restMode: 'inherit', restSeconds: null, sets: e.sets })),
});

describe('typed set validation (FW-02, FW-03, FW-31)', () => {
  it('accepts weight 0..999.9 and reps 1..999 in the entered unit', () => {
    expect(validateActual('weight_reps', { weight: '0', unit: 'kg', reps: '1' }).ok).toBe(true);
    expect(validateActual('weight_reps', { weight: '999.9', unit: 'lb', reps: '999' }).ok).toBe(true);
    const bad = validateActual('weight_reps', { weight: '1000', unit: 'kg', reps: '0' });
    expect(bad.ok).toBe(false);
    if (!bad.ok) expect(Object.keys(bad.errors).sort()).toEqual(['reps', 'weight']);
    expect(validateActual('weight_reps', { weight: '60.25', unit: 'kg', reps: '5' }).ok).toBe(false);
    expect(validateActual('weight_reps', { weight: '-1', unit: 'kg', reps: '5' }).ok).toBe(false);
    expect(validateActual('weight_reps', { weight: '', unit: 'kg', reps: '5' }).ok).toBe(false);
  });
  it('reps-only ignores weight; seconds require a whole number >= 1', () => {
    const r = validateActual('reps', { weight: '50', unit: 'kg', reps: '12' });
    expect(r.ok && r.value.weight).toBe(null);
    expect(validateActual('seconds', { seconds: '0' }).ok).toBe(false);
    expect(validateActual('seconds', { seconds: '1.5' }).ok).toBe(false);
    const s = validateActual('seconds', { seconds: '45', reps: '3' });
    expect(s.ok && s.value).toMatchObject({ seconds: 45, reps: null });
  });
  it('optional actual RIR on rep-based work, explicit zero is recorded', () => {
    const r = validateActual('weight_reps', { weight: '60', unit: 'kg', reps: '11', rir: '0' });
    expect(r.ok && r.value.rir).toBe(0);
    expect(validateActual('reps', { reps: '5', rir: '11' }).ok).toBe(false);
  });
});

describe('routine targets (TR-01)', () => {
  const base = { targetSets: 4, targetReps: 12, targetSeconds: null, targetLoad: 60, targetUnit: 'kg' as const, targetRirMin: 1, targetRirMax: 3, restMode: 'duration' as const, restSeconds: 120 };
  it('accepts 4 x 12 RIR 1-3 with rest', () => expect(validateTargets('weight_reps', base)).toBeNull());
  it('rejects inverted RIR range and bad rest', () => {
    expect(validateTargets('weight_reps', { ...base, targetRirMin: 3, targetRirMax: 1 })).toMatch(/cannot exceed/);
    expect(validateTargets('weight_reps', { ...base, restSeconds: 2 })).toMatch(/Rest/);
    expect(validateTargets('reps', { ...base })).toMatch(/load/);
  });
  it('legacy exercise-only entries have no targets', () => expect(validateTargets('weight_reps', { ...base, targetSets: null })).toBeNull());
});

describe('units (FW-10, FW-30)', () => {
  it('uses 2.20462 and displays one decimal with the equivalent', () => {
    expect(formatStoredWeight(60, 'kg', true)).toBe('60 kg (132.3 lb)');
    expect(formatStoredWeight(60, 'kg', false)).toBe('60 kg');
    expect(formatStoredWeight(135, 'lb', true)).toBe('135 lb (61.2 kg)');
  });
  it('round-trips without drift and aggregates unrounded', () => {
    expect(convert(convert(102.1, 'kg', 'lb'), 'lb', 'kg')).toBeCloseTo(102.1, 10);
    const total = convert(45, 'lb', 'kg') * 10 + 20 * 10; // mixed units into kg
    expect(total).toBeCloseTo(404.1166, 3);
  });
  it('custom names compare ignoring case and spaces', () => expect(normalizeName('  Wall  Sit ')).toBe(normalizeName('wallsit')));
});

describe('date buckets and graphs (FW-20..24)', () => {
  const bench = ex('bench', 'weight_reps', ['chest'], ['shoulders', 'triceps']);
  const push = ex('push', 'reps', ['chest']);
  const map = new Map([[bench.id, bench], [push.id, push]]);
  const today = '2026-11-11'; // Wednesday
  const ws = [
    workout('w1', '2026-10-20', [{ exerciseId: 'bench', sets: [set({ weight: 60, unit: 'kg', reps: 10 }), set({ weight: 60, unit: 'kg', reps: 8 })] }]),
    workout('w2', '2026-11-03', [{ exerciseId: 'bench', sets: [set({ weight: 135, unit: 'lb', reps: 10 })] }, { exerciseId: 'push', sets: [set({ reps: 20 }), set({ reps: 15 })] }]),
    workout('w3', '2026-11-10', [{ exerciseId: 'bench', sets: [set({ weight: 65, unit: 'kg', reps: 10 }), set({ state: 'skipped' })] }, { exerciseId: 'bench', phase: 'warmup', sets: [set({ weight: 20, unit: 'kg', reps: 10 })] }]),
  ];
  it('weeks start Monday', () => {
    expect(isoWeekday('2026-11-09')).toBe(1);
    expect(mondayOf(today)).toBe('2026-11-09');
  });
  it('one point per workout; warm-up and skipped rows excluded; mixed units converted', () => {
    const pts = exerciseSeries(ws, bench, '4w', 'kg', today);
    expect(pts.map((p) => p.workoutId)).toEqual(['w1', 'w2', 'w3']);
    expect(pts[0].value).toBe(1080);
    expect(pts[1].value).toBeCloseTo((135 / 2.20462) * 10, 6);
    expect(pts[2].value).toBe(650);
  });
  it('reps-only graph sums reps; timed has no graph', () => {
    expect(exerciseSeries(ws, push, 'all', 'kg', today)[0].value).toBe(35);
    expect(exerciseSeries(ws, ex('plank', 'seconds'), 'all', 'kg', today)).toEqual([]);
  });
  it('weekly volume zero-fills empty weeks and agrees with per-exercise data', () => {
    const b = weeklyVolume(ws, map, '4w', 'kg', today);
    expect(b[0].weekStart).toBe(mondayOf(addDays(today, -27)));
    expect(b.find((x) => x.weekStart === '2026-10-26')?.value).toBe(0);
    const sumWeekly = b.reduce((a, x) => a + x.value, 0);
    const sumPoints = exerciseSeries(ws, bench, '4w', 'kg', today).reduce((a, p) => a + p.value, 0);
    expect(sumWeekly).toBeCloseTo(sumPoints, 9);
    expect(b[b.length - 1].partial).toBe(true);
  });
  it('comparison with a zero previous week uses the absolute difference', () => {
    const s = weeklyComparisonSentence([{ weekStart: '2026-11-02', value: 0, workoutIds: [], partial: false }, { weekStart: '2026-11-09', value: 500, workoutIds: [], partial: true }], 'kg');
    expect(s).toMatch(/up 500 kg from zero/);
    expect(s).not.toMatch(/Infinity|NaN/);
  });
  it('first set copies the latest set of the exercise; later sets copy the previous set', () => {
    const entry = { id: 'e', workoutId: 'x', exerciseId: 'bench', position: 1, phase: 'work' as const, restMode: 'inherit' as const, restSeconds: null,
      sets: [set({ position: 1, state: 'pending' })] };
    const prev = { workoutId: 'w3', date: '2026-11-10', sets: [set({ weight: 135, unit: 'lb', reps: 8 })] };
    const sug = suggestActual(entry, entry.sets[0], prev, 'kg');
    expect(sug.weight).toBe(61.2);
    expect(sug.reps).toBe(8);
  });
});

describe('muscle activity (TR-07)', () => {
  const bench = ex('bench', 'weight_reps', ['chest'], ['shoulders', 'triceps']);
  const map = new Map([[bench.id, bench]]);
  it('four completed bench sets credit chest 4.0 and shoulders/triceps 2.0; warm-up and skipped add zero', () => {
    const w = workout('w', '2026-11-10', [
      { exerciseId: 'bench', sets: [1, 2, 3, 4].map(() => set({ weight: 60, unit: 'kg', reps: 8 })).concat(set({ state: 'skipped' })) },
      { exerciseId: 'bench', phase: 'warmup', sets: [set({ weight: 20, unit: 'kg', reps: 10 })] },
    ]);
    const a = muscleActivity([w], map, '2026-11-04', '2026-11-10');
    expect(a.regions.get('chest')?.score).toBe(4);
    expect(a.regions.get('shoulders')?.score).toBe(2);
    expect(a.regions.get('triceps')?.score).toBe(2);
    expect(muscleBand(4)).toBe(2);
    expect(muscleBand(0)).toBe(0);
  });
  it('primary takes precedence over a duplicate secondary tag; untagged sets are counted as unmapped', () => {
    const odd = ex('odd', 'weight_reps', ['chest'], ['chest']);
    const none = ex('none', 'reps');
    const a = muscleActivity([workout('w', '2026-11-10', [{ exerciseId: 'odd', sets: [set({ weight: 1, unit: 'kg', reps: 1 })] }, { exerciseId: 'none', sets: [set({ reps: 5 })] }])], new Map([[odd.id, odd], [none.id, none]]), '2026-11-01', '2026-11-30');
    expect(a.regions.get('chest')?.score).toBe(1);
    expect(a.unmappedSets).toBe(1);
  });
});

describe('monthly report (TR-08) and goals (TR-09)', () => {
  const bench = ex('bench', 'weight_reps', ['chest']);
  const map = new Map([[bench.id, bench]]);
  it('compares equal elapsed days for an in-progress month', () => {
    const ws = [
      workout('a', '2026-10-05', [{ exerciseId: 'bench', sets: [set({ weight: 100, unit: 'kg', reps: 5 })] }]),
      workout('b', '2026-10-20', [{ exerciseId: 'bench', sets: [set({ weight: 100, unit: 'kg', reps: 5 })] }]),
      workout('c', '2026-11-03', [{ exerciseId: 'bench', sets: [set({ weight: 105, unit: 'kg', reps: 5 })] }]),
    ];
    const r = monthlyReport(ws, map, '2026-11', 'kg', '2026-11-11');
    expect(r.inProgress).toBe(true);
    expect(r.comparedDays).toBe(11);
    expect(r.current.sessions).toBe(1);
    expect(r.previous.sessions).toBe(1); // Oct 20 is outside the first 11 days
    expect(r.milestones[0]).toMatchObject({ workoutId: 'c', weight: 105 });
  });
  it('225 lb x 5 goal: 230 lb x 3 does not meet it, 102.1 kg x 5 does', () => {
    const goal: LiftGoal = { id: 'g', exerciseId: 'bench', targetLoad: 225, unit: 'lb', minReps: 5, deadline: null, revision: 0, createdAt: '' };
    const w1 = workout('w1', '2026-11-01', [{ exerciseId: 'bench', sets: [set({ weight: 230, unit: 'lb', reps: 3 })] }]);
    expect(goalProgress(goal, [w1]).achieved).toBe(false);
    expect(goalProgress(goal, [w1]).best).toBeNull();
    const w2 = workout('w2', '2026-11-05', [{ exerciseId: 'bench', sets: [set({ weight: 102.1, unit: 'kg', reps: 5 })] }]);
    const p = goalProgress(goal, [w1, w2]);
    expect(p.achieved).toBe(true);
    expect(p.best?.workoutId).toBe('w2');
  });
});

describe('CSV export (TR-10)', () => {
  it('escapes quotes, commas and newlines and protects formulas in user text', () => {
    expect(csvCell('a,b')).toBe('"a,b"');
    expect(csvCell('say "hi"')).toBe('"say ""hi"""');
    expect(csvCell('=SUM(A1)', true)).toBe("'=SUM(A1)");
    expect(csvCell(null)).toBe('');
  });
  it('one row per completed set, original units preserved, targets distinct from actuals', () => {
    const bench = ex('bench', 'weight_reps');
    const w = workout('w', '2026-11-10', [{ exerciseId: 'bench', sets: [set({ weight: 135, unit: 'lb', reps: 11, targetReps: 12, rir: 2 }), set({ state: 'skipped', targetReps: 12 })] }]);
    const { csv, rows } = workoutSetsCsv([w], new Map([[bench.id, bench]]), { from: '2026-11-01', to: '2026-11-30' });
    expect(rows).toBe(1);
    const line = csv.split('\r\n')[1].split(',');
    expect(line[10]).toBe('12'); // planned reps
    expect(line[16]).toBe('11'); // actual reps
    expect(line[18]).toBe('135');
    expect(line[19]).toBe('lb');
    expect(line[20]).toBe('61.2');
  });
});
