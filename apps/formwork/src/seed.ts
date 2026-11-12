import { Change, Plan, Workout, catalogById, dateKey, daysFrom, startWorkout } from './model';

const bench = 'catalog:Barbell_Bench_Press_-_Medium_Grip';
const squat = 'catalog:Barbell_Squat';
const push = 'catalog:Pushups';
const plank = 'catalog:Plank';
const shoulder = 'catalog:Shoulder_Stretch';

export function demoSeed(id: () => string, today = dateKey()): Change[] {
  const upper: Plan[] = [
    { exerciseId: bench, phase: 'warmup', count: 1, target: { reps: 10, weight: 20, unit: 'kg' } },
    { exerciseId: bench, phase: 'work', count: 4, rest: 90, target: { reps: 12, weight: 60, unit: 'kg', rirMin: 1, rirMax: 3 } },
    { exerciseId: push, phase: 'work', count: 3, target: { reps: 10 } },
    { exerciseId: shoulder, phase: 'cooldown', count: 1, target: { seconds: 30 } },
  ];
  const lower: Plan[] = [
    { exerciseId: squat, phase: 'work', count: 4, target: { reps: 8, weight: 80, unit: 'kg', rirMin: 2, rirMax: 3 } },
    { exerciseId: plank, phase: 'work', count: 2, target: { seconds: 45 }, rest: 60 },
  ];
  const a = id(), b = id();
  const changes: Change[] = [
    { kind: 'routine', id: a, value: { id: a, name: 'Upper body', entries: upper, rest: 90 } },
    { kind: 'routine', id: b, value: { id: b, name: 'Lower body', entries: lower, rest: 120 } },
  ];
  for (const [index, offset] of [-26, -21, -15, -10, -6, -3].entries()) {
    const date = daysFrom(offset, today);
    const started = new Date(date + 'T17:30:00').getTime();
    const routine = index % 2 ? 'Lower body' : 'Upper body';
    const workout: Workout = startWorkout(id(), date, index % 2 ? lower : upper, 90, id, routine, started);
    workout.entries.forEach(entry => entry.sets.forEach((set, i) => {
      const kind = catalogById.get(entry.exerciseId)?.kind;
      set.state = 'done';
      const at = started + (i + 1) * 180000;
      set.actual = kind === 'time' ? { seconds: set.target?.seconds ?? 30, at } : {
        reps: (set.target?.reps ?? 10) - i % 2, at, rir: entry.phase === 'work' ? 2 : undefined,
        ...(kind === 'load' ? { weight: (set.target?.weight ?? 20) + (entry.phase === 'work' ? index * 1.25 : 0), unit: 'kg' } : {}),
      };
    }));
    workout.state = 'finished';
    workout.finished = started + (38 + index) * 60000;
    changes.push({ kind: 'workout', id: workout.id, value: workout });
  }
  const goal = id();
  changes.push({ kind: 'goal', id: goal, value: { id: goal, exerciseId: bench, weight: 70, unit: 'kg', reps: 10 } });
  [-23, -14, -7, -2].forEach((offset, i) => {
    const reading = id();
    changes.push({ kind: 'reading', id: reading, value: { id: reading, date: daysFrom(offset, today), weight: 79.4 + i * 0.2, unit: 'kg' } });
  });
  return changes;
}
