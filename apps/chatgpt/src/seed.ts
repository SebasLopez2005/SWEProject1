import catalog from './catalog.json';
import { dateKey, shiftDate, type Exercise, type Root, type TrainingSet, type Workout } from './domain';

export const library = catalog as Exercise[];

export function demoRecords(id: () => string): Root[] {
  const [bench, , pushup, squat, legPress, calf] = library;
  const plank = library.find(e => e.name === 'Plank')!;
  const row = library.find(e => e.name === 'Seated Cable Row')!;
  const today = dateKey();
  const custom: Exercise = { id: id(), kind: 'exercise', name: 'Paused Goblet Squat',
    muscle: 'Legs', type: 'weight_reps', archived: false };
  const workouts: Workout[] = [30, 24, 17, 11, 5, 2].map((days, i) => {
    const date = shiftDate(today, -days);
    const weighted = (weight: number, unit: 'kg' | 'lb' = 'kg'): TrainingSet[] =>
      [10, 9, 8].map(reps => ({ id: id(), weight, unit, reps }));
    const entries: [Exercise, TrainingSet[]][] = i % 2 === 0
      ? [[squat, weighted(62.5 + i * 2.5)], [legPress, weighted(100 + i * 5)], [custom, weighted(22)]]
      : [[bench, weighted(105 + i * 5, 'lb')], [row, weighted(25 + i * 2.5)],
        [pushup, [12 + i, 10 + i].map(reps => ({ id: id(), reps }))],
        [plank, [{ id: id(), seconds: 35 + i * 5 }]]];
    return { kind: 'workout', id: id(), state: 'finished', date, startedAt: date + 'T17:00:00Z',
      finishedAt: date + 'T17:42:00Z', duration: 2520,
      entries: entries.map(([exercise, sets]) => ({ id: id(), exerciseId: exercise.id, sets })) };
  });
  return [custom, ...workouts,
    { kind: 'template', id: id(), name: 'Leg Day', exercises: [squat.id, legPress.id, calf.id] },
    { kind: 'template', id: id(), name: 'Home Basics', exercises: [pushup.id, plank.id, custom.id] }];
}
