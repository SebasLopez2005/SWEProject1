import test from 'node:test';
import assert from 'node:assert/strict';
import {
  catalogById, convert, finishWorkout, startWorkout, setActual, pending, working, restAfter,
  remaining, validateActual, validateDay, validatePlan, Plan, dateKey, daysFrom, searchExercises, catalog,
} from '../src/model';
import { bestForGoal, csv, exercisePoints, exportSets, muscleScores, reportWindows, totals, weeklyPoints } from '../src/analytics';
import { demoSeed } from '../src/seed';

const bench = catalogById.get('catalog:Barbell_Bench_Press_-_Medium_Grip')!;
let seq = 0;
const id = () => 'test-' + seq++;
const plan: Plan = { exerciseId: bench.id, count: 4, phase: 'work', target: { reps: 12, rirMin: 1, rirMax: 3 }, rest: 90 };

test('planned targets survive actual changes and a finish requires explicit skips', () => {
  const workout = startWorkout(id(), '2026-01-07', [plan], 80, id, 'Upper');
  assert.equal(pending(workout), 4);
  assert.throws(() => finishWorkout(workout, true), /working set/);
  const entry = workout.entries[0];
  const updated = setActual(workout, entry.id, entry.sets[0].id, { at: 1000, unit: 'kg', weight: 60, reps: 11, rir: 2 }, 'load');
  assert.equal(pending(updated), 3);
  assert.equal(updated.entries[0].sets[0].target?.reps, 12);
  assert.equal(working(updated)[0].actual.reps, 11);
  assert.equal(working(workout).length, 0);
  assert.throws(() => finishWorkout(updated, false), /Confirm/);
  const finished = finishWorkout(updated, true);
  assert.equal(finished.entries[0].sets[1].state, 'skipped');
  assert.equal(totals([finished], 'kg').volume, 660);
});

test('validation enforces typed fields, explicit zero, RIR bounds and calendar dates', () => {
  assert.doesNotThrow(() => validateActual('load', { at: 1, weight: 0, unit: 'lb', reps: 1, rir: 0 }));
  assert.throws(() => validateActual('load', { at: 1, weight: 1000, unit: 'kg', reps: 1 }), /weight/);
  assert.throws(() => validateActual('reps', { at: 1, weight: 10, reps: 1 }), /reps only/);
  assert.throws(() => validateActual('time', { at: 1, seconds: 1.5 }), /whole seconds/);
  assert.throws(() => validatePlan({ ...plan, target: { reps: 12, rirMin: 3, rirMax: 1 } }, 'load'), /RIR/);
  assert.throws(() => validateDay('2026-02-30'), /today/);
  assert.throws(() => validateDay(daysFrom(1)), /today/);
  assert.doesNotThrow(() => validateDay('2024-02-29'));
});

test('rest respects entry override, zero and final planned set', () => {
  const workout = startWorkout(id(), '2026-01-07', [plan], 60, id, 'Upper');
  const e = workout.entries[0];
  const next = setActual(workout, e.id, e.sets[0].id, { at: 1000, unit: 'kg', weight: 60, reps: 11 }, 'load');
  const rest = restAfter(next, next.entries[0], e.sets[0].id, 1000)!;
  assert.equal(rest.deadline, 91000);
  assert.equal(remaining(rest, 2000), 89);
  assert.equal(remaining({ ...rest, deadline: undefined, remaining: 41 }, 999999), 41);
  assert.equal(restAfter(next, { ...next.entries[0], rest: 0 }, e.sets[0].id), null);
  assert.equal(restAfter(finishWorkout(next, true), next.entries[0], e.sets[0].id), null);
});

test('exercise library retains stable IDs and filters local metadata', () => {
  assert.equal(catalog.length, 876);
  assert.equal(new Set(catalog.map(e => e.id)).size, 876);
  assert.equal(searchExercises(catalog, '', [bench.id])[0].id, bench.id);
  assert.ok(searchExercises(catalog, 'BARBELL', [], false, 'barbell', '', 'chest').some(x => x.id === bench.id));
});

test('graphs and goal qualification use only finished working sets and preserve units', () => {
  const workout = startWorkout(id(), '2026-01-07', [{ ...plan, count: 2 }, { ...plan, phase: 'warmup', count: 1 }], 90, id, 'Upper');
  const [e, warmup] = workout.entries;
  const a = setActual(workout, e.id, e.sets[0].id, { at: 1000, unit: 'lb', weight: 230, reps: 3 }, 'load');
  const b = setActual(a, e.id, e.sets[1].id, { at: 1100, unit: 'kg', weight: 102.1, reps: 5 }, 'load');
  const c = setActual(b, warmup.id, warmup.sets[0].id, { at: 900, unit: 'lb', weight: 300, reps: 5 }, 'load');
  const finished = finishWorkout(c, true);
  assert.equal(working(finished).length, 2);
  assert.equal(working(finished)[1].actual.weight, 102.1);
  const result = bestForGoal({ id: id(), exerciseId: bench.id, unit: 'lb', weight: 225, reps: 5 }, [finished])!;
  assert.equal(result.set.id, e.sets[1].id);
  assert.ok(result.load >= 225);
  const points = exercisePoints([finished, c], bench, '2026-01-01', '2026-01-20', 'kg');
  assert.equal(points.length, 1);
  assert.ok(Math.abs(points[0].value - (convert(230, 'lb', 'kg') * 3 + 102.1 * 5)) < 0.000001);
  const weekly = weeklyPoints([finished], '2026-01-01', '2026-01-20', 'kg');
  assert.deepEqual(weekly.map(p => p.date), ['2025-12-29', '2026-01-05', '2026-01-12', '2026-01-19']);
  assert.equal(weekly[2].value, 0);
});

test('muscle scores deduplicate tags and exclude warm-ups and skipped sets', () => {
  const w = startWorkout(id(), '2026-01-07', [{ ...plan, count: 5 }, { ...plan, phase: 'warmup', count: 1 }], 90, id, 'Upper');
  const [work, warmup] = w.entries;
  const actual = { at: 1000, unit: 'kg', weight: 60, reps: 12 } as const;
  const prepared = setActual(w, warmup.id, warmup.sets[0].id, actual, 'load');
  const done = work.sets.slice(0, 4).reduce((session, row) => setActual(session, work.id, row.id, actual, 'load'), prepared);
  const { scores, unmapped } = muscleScores([finishWorkout(done, true)], () =>
    ({ ...bench, primary: ['chest', 'chest'], secondary: ['chest', 'shoulders', 'triceps'] }), '2026-01-01', '2026-01-20');
  assert.equal(unmapped, 0);
  assert.equal(scores.get('Chest')?.reduce((n, row) => n + row.amount, 0), 4);
  assert.equal(scores.get('Shoulders')?.reduce((n, row) => n + row.amount, 0), 2);
  assert.equal(scores.get('Triceps')?.reduce((n, row) => n + row.amount, 0), 2);
});

test('monthly windows compare equivalent calendar days across short months', () => {
  assert.deepEqual(reportWindows('2026-03', '2026-03-30'), {
    from: '2026-03-01', to: '2026-03-28', priorFrom: '2026-02-01', priorTo: '2026-02-28', partial: true,
  });
  assert.equal(reportWindows('2026-03', '2026-04-02').to, '2026-03-31');
});

test('CSV keeps planned and actual values and escapes user-entered text', () => {
  assert.equal(csv([['=HYPERLINK("x")', 'a,b', 'two\nlines', 0, null]]), "\"'=HYPERLINK(\"\"x\"\")\",\"a,b\",\"two\nlines\",0,\r\n");
  const w = startWorkout(id(), '2026-01-07', [plan], 90, id, 'Upper');
  const e = w.entries[0];
  const done = finishWorkout(setActual(w, e.id, e.sets[0].id, { at: 1000, unit: 'kg', weight: 60, reps: 11 }, 'load'), true);
  const file = exportSets([w, done], () => bench, '2026-01-01', '2026-02-01');
  assert.equal(file.trim().split('\r\n').length, 2);
  assert.match(file, /target_reps.*actual_reps/);
  assert.match(file, /,12,,,,1,3,11,,60,"kg",60,/);
});

test('demo data is internally consistent and includes all three exercise input types', () => {
  const data = demoSeed(id, dateKey());
  assert.equal(data.filter(x => x.kind === 'routine').length, 2);
  const workouts = data.flatMap(x => x.kind === 'workout' && x.value ? [x.value] : []);
  assert.equal(workouts.length, 6);
  for (const w of workouts) {
    assert.ok(w.date < dateKey());
    assert.ok(w.finished && w.finished > w.started);
    for (const { entry, actual } of working(w)) validateActual(catalogById.get(entry.exerciseId)!.kind, actual);
  }
});
