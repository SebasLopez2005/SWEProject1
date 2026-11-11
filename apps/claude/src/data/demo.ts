// Realistic demonstration data for a professor walkthrough. It is written
// through the same repository (and outbox) as user data, so it uploads like
// any other record when cloud sync is configured.
import { addDays, todayLocal } from '../domain/dates';
import type { Exercise, SetRow, Unit, Workout } from '../domain/types';
import type { Repository } from './repository';

const NAMES = {
  bench: 'Barbell Bench Press - Medium Grip',
  row: 'Bent Over Barbell Row',
  ohp: 'Standing Military Press',
  pullup: 'Pullups',
  squat: 'Barbell Squat',
  rdl: 'Romanian Deadlift',
  plank: 'Plank',
  pushup: 'Pushups',
  lunge: 'Bodyweight Walking Lunge',
  curl: 'Dumbbell Bicep Curl',
};

export async function seedDemoData(repo: Repository, uuid: () => string): Promise<{ workouts: number }> {
  const all = [...(await repo.exercises()).values()];
  const find = (name: string): Exercise => {
    const e = all.find((x) => x.name === name) ?? all.find((x) => x.name.toLowerCase().includes(name.toLowerCase().split(' ')[0]) && x.ownerId == null);
    if (!e) throw new Error(`Demo exercise missing: ${name}`);
    return e;
  };
  const ex = Object.fromEntries(Object.entries(NAMES).map(([k, n]) => [k, find(n)])) as Record<keyof typeof NAMES, Exercise>;

  const existing = await repo.listRoutines();
  const have = new Set(existing.map((r) => r.name.toLowerCase()));
  const w = (exerciseId: string, sets: number, reps: number | null, load: number | null, unit: Unit | null, rir: [number, number] | null, seconds: number | null = null) => ({
    exerciseId, phase: 'work' as const, targetSets: sets, targetReps: reps, targetSeconds: seconds, targetLoad: load, targetUnit: load != null ? unit : null,
    targetRirMin: rir?.[0] ?? null, targetRirMax: rir?.[1] ?? null, restMode: 'inherit' as const, restSeconds: null,
  });
  if (!have.has('upper a'))
    await repo.saveRoutine({ name: 'Upper A', defaultRestSeconds: 120, entries: [
      w(ex.bench.id, 4, 8, 70, 'kg', [1, 3]), w(ex.row.id, 3, 10, 60, 'kg', [1, 2]), w(ex.ohp.id, 3, 8, 40, 'kg', [1, 3]), w(ex.pullup.id, 3, 8, null, null, [0, 2]),
    ] });
  if (!have.has('lower a'))
    await repo.saveRoutine({ name: 'Lower A', defaultRestSeconds: 150, entries: [
      w(ex.squat.id, 4, 6, 90, 'kg', [1, 3]), w(ex.rdl.id, 3, 8, 70, 'kg', [2, 3]), w(ex.plank.id, 3, null, null, null, null, 45),
    ] });
  if (!have.has('home bodyweight'))
    await repo.saveRoutine({ name: 'Home Bodyweight', defaultRestSeconds: 60, entries: [
      w(ex.pushup.id, 3, 15, null, null, null), w(ex.lunge.id, 3, 12, null, null, null), w(ex.plank.id, 3, null, null, null, null, 40),
    ] });

  const today = todayLocal();
  let count = 0;
  const mkSet = (entryId: string, pos: number, p: Partial<SetRow>): SetRow => ({
    id: uuid(), entryId, position: pos, state: 'done', targetReps: null, targetSeconds: null, targetLoad: null, targetUnit: null, targetRirMin: null, targetRirMax: null,
    weight: null, unit: null, reps: null, seconds: null, rir: null, completedAt: null, ...p,
  });
  // 8 weeks, three sessions per week: upper (Mon), lower (Wed), home or upper-in-lb (Fri).
  for (let week = 8; week >= 0; week--) {
    for (const [dayOffset, kind] of [[0, 'upper'], [2, 'lower'], [4, 'home']] as const) {
      const date = addDays(today, -(week * 7) - (6 - dayOffset));
      if (date > today) continue;
      const progress = 8 - week; // 0..8
      const id = uuid();
      const started = new Date(`${date}T17:30:00`);
      const entries: Workout['entries'] = [];
      const add = (exercise: Exercise, sets: Partial<SetRow>[], targets?: Partial<SetRow>) => {
        const entryId = uuid();
        entries.push({ id: entryId, workoutId: id, exerciseId: exercise.id, position: entries.length + 1, phase: 'work', restMode: 'inherit', restSeconds: null,
          sets: sets.map((s, i) => mkSet(entryId, i + 1, { ...targets, ...s, completedAt: new Date(started.getTime() + (entries.length * 10 + i * 3) * 60000).toISOString() })) });
      };
      if (kind === 'upper') {
        const b = 62.5 + Math.floor(progress / 2) * 2.5; // plate-friendly 2.5 kg jumps
        add(ex.bench, [8, 8, 7, 6].map((r, i) => ({ weight: b, unit: 'kg', reps: r, rir: i < 2 ? 2 : 1 })), { targetReps: 8, targetLoad: 70, targetUnit: 'kg', targetRirMin: 1, targetRirMax: 3 });
        add(ex.row, [10, 10, 9].map((r) => ({ weight: 55 + progress, unit: 'kg', reps: r })));
        add(ex.pullup, [8, 7, 6].map((r) => ({ reps: Math.min(12, r + Math.floor(progress / 3)) })));
      } else if (kind === 'lower') {
        add(ex.squat, [6, 6, 6, 5].map((r) => ({ weight: 80 + progress * 2.5, unit: 'kg', reps: r, rir: 2 })));
        add(ex.rdl, [8, 8, 8].map((r) => ({ weight: 60 + progress * 2.5, unit: 'kg', reps: r })));
        add(ex.plank, [45, 45, 40].map((s) => ({ seconds: s + progress * 5 })));
      } else if (week % 2 === 0) {
        add(ex.pushup, [15, 14, 12].map((r) => ({ reps: r + progress })));
        add(ex.lunge, [12, 12, 12].map((r) => ({ reps: r })));
        add(ex.plank, [40, 40].map((s) => ({ seconds: s + progress * 3 })));
      } else {
        // A hotel-gym session logged in pounds to show mixed-unit totals.
        add(ex.bench, [8, 8, 8].map((r) => ({ weight: 135 + progress * 5, unit: 'lb', reps: r })));
        add(ex.curl, [10, 10, 10].map((r) => ({ weight: 25, unit: 'lb', reps: r })));
      }
      const duration = 45 * 60 + (progress % 3) * 300;
      await repo.importFinishedWorkout({
        id, workoutDate: date, state: 'finished', startedAt: started.toISOString(), finishedAt: new Date(started.getTime() + duration * 1000).toISOString(),
        durationSeconds: duration, routineId: null, routineName: kind === 'upper' ? 'Upper A' : kind === 'lower' ? 'Lower A' : week % 2 === 0 ? 'Home Bodyweight' : null,
        defaultRestSeconds: null, backdated: false, entries,
      });
      count++;
    }
  }
  if ((await repo.listGoals()).length === 0) {
    await repo.saveGoal({ exerciseId: ex.bench.id, targetLoad: 225, unit: 'lb', minReps: 5, deadline: addDays(today, 60) });
    await repo.saveGoal({ exerciseId: ex.squat.id, targetLoad: 100, unit: 'kg', minReps: 5, deadline: null });
  }
  if ((await repo.listBodyweight()).length === 0) {
    for (let i = 8; i >= 0; i--) await repo.saveBodyweight({ readingDate: addDays(today, -i * 7), weight: Math.round((82.4 - i * 0.25 + (i % 2) * 0.3) * 10) / 10, unit: 'kg' });
    await repo.saveBodyweightTarget({ weight: 80, unit: 'kg', targetDate: addDays(today, 90) });
  }
  return { workouts: count };
}
