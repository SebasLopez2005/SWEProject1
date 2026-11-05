import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { test } from 'node:test';
import {
  convert, dateKey, defaults, display, exerciseSets, filterHistory, finishWorkout, graph, newWorkout, parseSet, previous,
  searchExercises, validDate, validateSet, weightLabel, type Workout,
} from '../src/domain';
import { library } from '../src/seed';
import { Store } from '../src/store';
import { nodeSqlite } from './sqlite';

test('typed fields are exclusive and numeric bounds are enforced', () => {
  assert.deepEqual(parseSet('weight_reps', '999.9', '999', 'lb'), { weight: 999.9, reps: 999, unit: 'lb' });
  assert.deepEqual(parseSet('weight_reps', '0', '1', 'kg'), { weight: 0, reps: 1, unit: 'kg' });
  assert.deepEqual(parseSet('reps_only', '', '10', 'kg'), { reps: 10 });
  assert.deepEqual(parseSet('seconds', '', '31', 'kg'), { seconds: 31 });
  for (const invalid of ['', 'Infinity', '1e2', '-1', '1000']) {
    assert.throws(() => parseSet('weight_reps', invalid, '5', 'kg'));
  }
  for (const invalid of ['', '0', '1.5', '1000', '1e2']) {
    assert.throws(() => parseSet('reps_only', '', invalid, 'kg'));
  }
  assert.throws(() => validateSet({ reps: 8, unit: 'kg' } as never, 'reps_only'));
  assert.throws(() => validateSet({ reps: 8, seconds: 30 } as never, 'seconds'));
});

test('units convert for display and chart totals without mutating inputs', () => {
  const source = { id: randomUUID(), weight: 100, unit: 'kg' as const, reps: 3 };
  assert.equal(weightLabel(source.weight, source.unit, { ...defaults, unit: 'lb' }), '220.5 lb (100 kg)');
  assert.equal(display(convert(45, 'lb', 'kg')), '20.4');
  assert.equal(convert(convert(source.weight, source.unit, 'lb'), 'lb', 'kg'), 100);
  assert.equal(source.weight, 100);
  assert.equal(source.unit, 'kg');
});

test('calendar date validation, mixed-unit volume, Monday gaps and reps-only series', () => {
  const now = '2026-11-04';
  assert.equal(validDate('2026-11-05', now), false);
  assert.equal(validDate('2026-02-30', now), false);
  assert.equal(validDate('2024-02-29', now), true);
  const weighted = library[0];
  const reps = library[2];
  const timed = library.find(x => x.name === 'Plank')!;
  function workout(date: string): Workout {
    const w = newWorkout(randomUUID, date, [weighted.id, reps.id, timed.id]);
    w.entries[0].sets = [{ id: randomUUID(), weight: 50, unit: 'kg', reps: 2 },
      { id: randomUUID(), weight: 22.0462, unit: 'lb', reps: 4 }];
    w.entries[1].sets = [{ id: randomUUID(), reps: 11 }];
    w.entries[2].sets = [{ id: randomUUID(), seconds: 45 }];
    return finishWorkout(w);
  }
  const a = workout('2026-10-18');
  const b = workout('2026-11-03');
  const series = graph([b, a], '4 weeks', 'kg', undefined, now);
  assert.deepEqual(series.map(p => p.value), [0, 140, 0, 0, 140]);
  assert.deepEqual(series.at(-1)?.workoutIds, [b.id]);
  assert.equal(series.at(-1)?.date, '2026-11-02');
  assert.equal(series.at(-1)?.partial, true);
  assert.equal(graph([b, a], '4 weeks', 'kg', reps, now)[0].value, 11);
  assert.equal(graph([b, a], '4 weeks', 'kg', timed, now).length, 0);
  assert.equal(graph([], 'All time', 'kg', undefined, now).length, 0);
  assert.deepEqual(filterHistory([b, a], '2026-10-18', '2026-10-18', reps.id), [a]);
  assert.equal(previous([b, a], reps.id)?.id, b.id);
  b.entries[1].sets = [];
  assert.equal(previous([b, a], reps.id)?.id, a.id);
  assert.equal(exerciseSets(a, reps.id)[0].id, a.entries[1].sets[0].id);
});

test('names, search, archive and stable identity work from the SQLite model', () => {
  const { db, close } = nodeSqlite(':memory:');
  const store = new Store(db, randomUUID);
  const custom = { ...library[0], shared: undefined, id: randomUUID(), name: 'My Press' };
  store.save(custom);
  assert.throws(() => store.save({ ...custom, id: randomUUID(), name: 'myPRESS' }), /already exists/);
  assert.throws(() => store.save({ ...custom, id: randomUUID(), name: ' BarbellBenchPress '.trim() }), /already exists/);
  assert.deepEqual(searchExercises(store.model(), 'y p', 'Chest').map(e => e.id), [custom.id]);
  const active = newWorkout(randomUUID, dateKey(), [custom.id]);
  assert.throws(() => finishWorkout(active), /at least one set/);
  active.entries[0].sets = [{ id: randomUUID(), weight: 10, unit: 'kg', reps: 7 }];
  store.save(active);
  assert.throws(() => store.save(newWorkout(randomUUID, dateKey())), /active workout/);
  const done = finishWorkout(active);
  store.save(done, active);
  assert.throws(() => store.save({ ...done, entries: [] }, done), /at least one set/);
  const renamed = { ...custom, name: 'Home Press', archived: true };
  store.save(renamed, store.get('exercise', custom.id)!.root);
  assert.equal(store.model().workouts[0].entries[0].exerciseId, custom.id);
  assert.equal(searchExercises(store.model(), 'Home Press').length, 0);
  assert.equal(searchExercises(store.model(), 'Home Press', '', true)[0].id, custom.id);
  assert.throws(() => store.save({ ...renamed, type: 'reps_only' }, renamed), /locked/);
  const template = { kind: 'template' as const, id: randomUUID(), name: 'Home', exercises: [custom.id], workoutId: done.id };
  store.save(template, undefined, new Set([custom.id]));
  store.save({ ...template, deleted: true }, template);
  assert.deepEqual(store.model().workouts, [done]);
  close();
});
