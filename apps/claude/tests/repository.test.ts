import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { todayLocal, addDays } from '../src/domain/dates';
import { BENCH, PLANK, PUSHUPS, exId, makeRepo } from './helpers';

describe('workout lifecycle (FW-01..07, TR-02)', () => {
  it('starts, records typed sets, prevents a second active workout and finishes with a summary', async () => {
    const repo = await makeRepo();
    const w = await repo.startWorkout({ date: todayLocal() });
    await expect(repo.startWorkout({ date: todayLocal() })).rejects.toThrow(/already in progress/);
    const bench = await exId(repo, BENCH);
    const plank = await exId(repo, PLANK);
    const e1 = await repo.addEntry(w.id, bench);
    const e2 = await repo.addEntry(w.id, plank);
    let cur = (await repo.getActiveWorkout())!;
    const row = cur.entries.find((e) => e.id === e1)!.sets[0];
    await expect(repo.completeSet(row.id, { weight: '1000', unit: 'kg', reps: '5' })).rejects.toThrow(/Weight must be/);
    await repo.completeSet(row.id, { weight: '60', unit: 'kg', reps: '8', rir: '2' });
    const plankRow = cur.entries.find((e) => e.id === e2)!.sets[0];
    await repo.completeSet(plankRow.id, { seconds: '45', weight: '20', unit: 'kg' });
    cur = (await repo.getActiveWorkout())!;
    const p = cur.entries.find((e) => e.id === e2)!.sets[0];
    expect(p).toMatchObject({ state: 'done', seconds: 45, weight: null });
    const res = await repo.finishWorkout(w.id, false);
    expect(res.droppedEntries).toEqual([]);
    expect(await repo.getActiveWorkout()).toBeNull();
    const hist = await repo.historyPage({}, null);
    expect(hist.rows).toHaveLength(1);
    expect(hist.rows[0].setCount).toBe(2);
  });

  it('cannot finish with no sets; can discard', async () => {
    const repo = await makeRepo();
    const w = await repo.startWorkout({ date: todayLocal() });
    await repo.addEntry(w.id, await exId(repo, BENCH));
    await expect(repo.finishWorkout(w.id, true)).rejects.toThrow(/at least one working set/);
    await repo.discardWorkout(w.id);
    expect(await repo.getActiveWorkout()).toBeNull();
    expect((await repo.historyPage({}, null)).rows).toHaveLength(0);
  });

  it('rejects future dates and records backdated workouts on their date without duration', async () => {
    const repo = await makeRepo();
    await expect(repo.startWorkout({ date: addDays(todayLocal(), 1) })).rejects.toThrow(/Future/);
    const date = addDays(todayLocal(), -3);
    const w = await repo.startWorkout({ date });
    const e = await repo.addEntry(w.id, await exId(repo, PUSHUPS));
    const row = (await repo.getWorkout(w.id))!.entries.find((x) => x.id === e)!.sets[0];
    await repo.completeSet(row.id, { reps: '20' });
    await repo.finishWorkout(w.id, false);
    const done = (await repo.getWorkout(w.id))!;
    expect(done.workoutDate).toBe(date);
    expect(done.durationSeconds).toBeNull();
  });

  it('delete a set with undo, renumbering positions; undo expires after another mutation', async () => {
    const repo = await makeRepo();
    const w = await repo.startWorkout({ date: todayLocal() });
    const bench = await exId(repo, BENCH);
    const e = await repo.addEntry(w.id, bench);
    const s1 = (await repo.getWorkout(w.id))!.entries[0].sets[0].id;
    await repo.completeSet(s1, { weight: '60', unit: 'kg', reps: '8' });
    const s2 = await repo.addSet(e);
    await repo.completeSet(s2, { weight: '62.5', unit: 'kg', reps: '6' });
    const s3 = await repo.addSet(e);
    await repo.completeSet(s3, { weight: '65', unit: 'kg', reps: '4' });
    const token = await repo.deleteSet(s2);
    let sets = (await repo.getWorkout(w.id))!.entries[0].sets;
    expect(sets.map((s) => [s.position, s.weight])).toEqual([[1, 60], [2, 65]]);
    await repo.undo(token.id);
    sets = (await repo.getWorkout(w.id))!.entries[0].sets;
    expect(sets.map((s) => [s.position, s.weight])).toEqual([[1, 60], [2, 62.5], [3, 65]]);
    const t2 = await repo.deleteSet(s3);
    await repo.addSet(e);
    await expect(repo.undo(t2.id)).rejects.toThrow(/no longer available/);
  });

  it('planned session: targets stay, skip/undo, pending rows require confirmation and become skipped', async () => {
    const repo = await makeRepo();
    const bench = await exId(repo, BENCH);
    const rid = await repo.saveRoutine({
      name: 'Push A', defaultRestSeconds: 120,
      entries: [{ exerciseId: bench, phase: 'work', targetSets: 4, targetReps: 12, targetSeconds: null, targetLoad: 60, targetUnit: 'kg', targetRirMin: 1, targetRirMax: 3, restMode: 'inherit', restSeconds: null }],
    });
    const w = await repo.startWorkout({ date: todayLocal(), routineId: rid });
    const rows = w.entries[0].sets;
    expect(rows).toHaveLength(4);
    expect(rows.every((r) => r.state === 'pending' && r.targetReps === 12)).toBe(true);
    await repo.completeSet(rows[0].id, { weight: '60', unit: 'kg', reps: '11', rir: '2' });
    await repo.completeSet(rows[0].id, { weight: '60', unit: 'kg', reps: '11', rir: '2' }); // duplicate tap
    await repo.skipSet(rows[1].id);
    await repo.reopenSet(rows[1].id);
    let cur = (await repo.getWorkout(w.id))!;
    expect(cur.entries[0].sets).toHaveLength(4);
    expect(cur.entries[0].sets[0]).toMatchObject({ reps: 11, targetReps: 12, rir: 2 });
    expect(cur.entries[0].sets[1].state).toBe('pending');
    await expect(repo.finishWorkout(w.id, false)).rejects.toThrow('CONFIRM_PENDING');
    const r = await repo.finishWorkout(w.id, true);
    expect(r.skipped).toBe(3);
    cur = (await repo.getWorkout(w.id))!;
    expect(cur.entries[0].sets.map((s) => s.state)).toEqual(['done', 'skipped', 'skipped', 'skipped']);
    // Routine edits do not change the finished snapshot (TR-01, FW-27).
    const routine = (await repo.getRoutine(rid))!;
    await repo.saveRoutine({ id: rid, name: 'Push A', defaultRestSeconds: 90, entries: [{ ...routine.entries[0], targetSets: 2, targetReps: 5 }] });
    expect((await repo.getWorkout(w.id))!.entries[0].sets[0].targetReps).toBe(12);
    // Deleting the routine leaves finished workouts unchanged (FW-28).
    await repo.deleteRoutine(rid);
    expect((await repo.getWorkout(w.id))!.routineName).toBe('Push A');
  });

  it('finished workout cannot be edited to have no sets', async () => {
    const repo = await makeRepo();
    const w = await repo.startWorkout({ date: todayLocal() });
    const e = await repo.addEntry(w.id, await exId(repo, BENCH));
    const s = (await repo.getWorkout(w.id))!.entries[0].sets[0].id;
    await repo.completeSet(s, { weight: '60', unit: 'kg', reps: '8' });
    await repo.finishWorkout(w.id, false);
    await expect(repo.deleteSet(s)).rejects.toThrow(/Delete the workout instead/);
    await expect(repo.deleteEntry(e)).rejects.toThrow(/Delete the workout instead/);
    await repo.completeSet(s, { weight: '135', unit: 'lb', reps: '8' });
    expect((await repo.getWorkout(w.id))!.entries[0].sets[0]).toMatchObject({ weight: 135, unit: 'lb' });
  });

  it('previous performance reflects edits and deletions (FW-04, FW-17, FW-18)', async () => {
    const repo = await makeRepo();
    const bench = await exId(repo, BENCH);
    expect(await repo.previousPerformance(bench)).toBeNull();
    const mk = async (date: string, weight: string) => {
      const w = await repo.startWorkout({ date });
      await repo.addEntry(w.id, bench);
      const s = (await repo.getWorkout(w.id))!.entries[0].sets[0].id;
      await repo.completeSet(s, { weight, unit: 'kg', reps: '5' });
      await repo.finishWorkout(w.id, false);
      return { w: w.id, s };
    };
    await mk(addDays(todayLocal(), -7), '80');
    const b = await mk(addDays(todayLocal(), -2), '85');
    expect((await repo.previousPerformance(bench))!.sets[0].weight).toBe(85);
    await repo.completeSet(b.s, { weight: '87.5', unit: 'kg', reps: '5' });
    expect((await repo.previousPerformance(bench))!.sets[0].weight).toBe(87.5);
    await repo.deleteWorkout(b.w);
    expect((await repo.previousPerformance(bench))!.sets[0].weight).toBe(80);
  });
});

describe('durability (FW-07, FW-09)', () => {
  it('confirmed sets survive a process restart (reopen the same database file)', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'fwl-'));
    const path = join(dir, 'owner.db');
    const repo1 = await makeRepo({ path });
    const w = await repo1.startWorkout({ date: todayLocal() });
    await repo1.addEntry(w.id, await exId(repo1, BENCH));
    const s = (await repo1.getWorkout(w.id))!.entries[0].sets[0].id;
    await repo1.completeSet(s, { weight: '70', unit: 'kg', reps: '6' });
    await repo1.db.close();
    const repo2 = await makeRepo({ path });
    const active = await repo2.getActiveWorkout();
    expect(active?.id).toBe(w.id);
    expect(active?.entries[0].sets[0]).toMatchObject({ state: 'done', weight: 70, reps: 6 });
    expect((await repo2.outboxCounts()).pending).toBeGreaterThan(0);
  });

  it('a failed write rolls back the set AND its outbox row; nothing is acknowledged', async () => {
    const repo = await makeRepo({ failOn: /INSERT INTO outbox/ });
    const w = await repo.startWorkout({ date: todayLocal() });
    await repo.addEntry(w.id, await exId(repo, BENCH));
    const s = (await repo.getWorkout(w.id))!.entries[0].sets[0].id;
    const before = (await repo.pendingOps()).length;
    (globalThis as any).__fail = true;
    await expect(repo.completeSet(s, { weight: '70', unit: 'kg', reps: '6' })).rejects.toThrow(/disk I\/O/);
    (globalThis as any).__fail = false;
    expect((await repo.getWorkout(w.id))!.entries[0].sets[0].state).toBe('pending');
    expect((await repo.pendingOps()).length).toBe(before);
  });
});

describe('exercises (FW-11..13, TR-06)', () => {
  it('search ignores case, matches anywhere, filters by muscle/equipment and lists recent first', async () => {
    const repo = await makeRepo();
    const r = await repo.searchExercises('BENCH press');
    expect(r.results.some((e) => e.name === BENCH)).toBe(true);
    const byMuscle = await repo.searchExercises('', { muscle: 'hamstrings', equipment: 'barbell' });
    expect(byMuscle.results.length).toBeGreaterThan(0);
    expect(byMuscle.results.every((e) => e.equipment === 'barbell')).toBe(true);
    const stretches = await repo.searchExercises('', { category: 'stretching' });
    expect(stretches.results.length).toBeGreaterThan(50);
    const w = await repo.startWorkout({ date: todayLocal() });
    await repo.addEntry(w.id, await exId(repo, PUSHUPS));
    expect((await repo.searchExercises('')).recent[0].name).toBe(PUSHUPS);
  });

  it('custom names are unique ignoring case/spaces incl. the catalog; type locks after use; archive hides and restores', async () => {
    const repo = await makeRepo();
    // 'push ups' and 'PUSHUPS' both normalize to the catalog's 'Pushups'.
    await expect(repo.createExercise({ name: 'push ups', type: 'reps' })).rejects.toThrow(/already exists/);
    await expect(repo.createExercise({ name: 'PUSHUPS', type: 'reps' })).rejects.toThrow(/already exists/);
    await repo.createExercise({ name: 'Wall Sit', type: 'seconds' });
    await expect(repo.createExercise({ name: 'wallsit', type: 'seconds' })).rejects.toThrow(/already exists/);
    await expect(repo.createExercise({ name: 'x'.repeat(61), type: 'reps' })).rejects.toThrow(/60/);
    const ex = await repo.createExercise({ name: 'Towel Row', type: 'reps', primaryMuscles: ['lats'] });
    await repo.updateExercise(ex.id, { type: 'seconds' });
    await repo.updateExercise(ex.id, { type: 'reps' });
    const w = await repo.startWorkout({ date: todayLocal() });
    await repo.addEntry(w.id, ex.id);
    const s = (await repo.getWorkout(w.id))!.entries[0].sets[0].id;
    await repo.completeSet(s, { reps: '10' });
    await expect(repo.updateExercise(ex.id, { type: 'seconds' })).rejects.toThrow(/locked/);
    await expect(repo.deleteExercise(ex.id)).rejects.toThrow(/cannot be deleted/);
    await repo.updateExercise(ex.id, { name: 'Door Towel Row' });
    expect((await repo.getWorkout(w.id))!.entries[0].exerciseId).toBe(ex.id);
    await repo.setArchived(ex.id, true);
    expect((await repo.searchExercises('door towel')).results).toHaveLength(0);
    expect((await repo.searchExercises('door towel', {}, true)).results).toHaveLength(1);
    await repo.setArchived(ex.id, false);
    expect((await repo.searchExercises('door towel')).results).toHaveLength(1);
  });
});

describe('history pagination and filters (FW-14, FW-19)', () => {
  it('pages by (date, id) without skipping equal dates and composes filters', async () => {
    const repo = await makeRepo();
    const bench = await exId(repo, BENCH);
    const push = await exId(repo, PUSHUPS);
    for (let i = 0; i < 25; i++) {
      const w = await repo.startWorkout({ date: addDays(todayLocal(), -Math.floor(i / 3)) });
      const exercise = i % 2 ? bench : push;
      await repo.addEntry(w.id, exercise);
      const s = (await repo.getWorkout(w.id))!.entries[0].sets[0].id;
      await repo.completeSet(s, i % 2 ? { weight: '50', unit: 'kg', reps: '5' } : { reps: '10' });
      await repo.finishWorkout(w.id, false);
    }
    const p1 = await repo.historyPage({}, null, 10);
    const p2 = await repo.historyPage({}, p1.next, 10);
    const p3 = await repo.historyPage({}, p2.next, 10);
    const ids = [...p1.rows, ...p2.rows, ...p3.rows].map((r) => r.id);
    expect(new Set(ids).size).toBe(25);
    expect(p3.next).toBeNull();
    const filtered = await repo.historyPage({ exerciseId: bench, from: addDays(todayLocal(), -2), to: todayLocal() }, null, 50);
    expect(filtered.rows.length).toBeGreaterThan(0);
    expect(filtered.rows.every((r) => r.exerciseNames.includes(BENCH))).toBe(true);
    const none = await repo.historyPage({ from: addDays(todayLocal(), -400), to: addDays(todayLocal(), -300) }, null);
    expect(none.rows).toHaveLength(0);
  });
});

describe('routines from workouts, goals and bodyweight (FW-25, TR-09, TR-11)', () => {
  it('save-as-routine keeps order without sets unless actuals are explicitly copied', async () => {
    const repo = await makeRepo();
    const bench = await exId(repo, BENCH);
    const push = await exId(repo, PUSHUPS);
    const w = await repo.startWorkout({ date: todayLocal() });
    await repo.addEntry(w.id, push);
    await repo.addEntry(w.id, bench);
    const cur = (await repo.getWorkout(w.id))!;
    await repo.completeSet(cur.entries[0].sets[0].id, { reps: '15' });
    await repo.completeSet(cur.entries[1].sets[0].id, { weight: '60', unit: 'kg', reps: '8' });
    await repo.finishWorkout(w.id, false);
    const plain = await repo.routineDraftFromWorkout(w.id, false);
    expect(plain.entries.map((e) => [e.exerciseId, e.targetSets])).toEqual([[push, null], [bench, null]]);
    const copied = await repo.routineDraftFromWorkout(w.id, true);
    expect(copied.entries[1]).toMatchObject({ targetSets: 1, targetReps: 8, targetLoad: 60, targetUnit: 'kg' });
    const id = await repo.saveRoutine({ ...plain, name: 'From workout' });
    await expect(repo.saveRoutine({ ...plain, name: 'from WORKOUT' })).rejects.toThrow(/already exists/);
    const legacy = await repo.startWorkout({ date: todayLocal(), routineId: id });
    expect(legacy.entries.every((e) => e.sets.length === 0)).toBe(true); // no invented targets
  });

  it('goals validate the exercise type; bodyweight keeps original units and supports edit/delete', async () => {
    const repo = await makeRepo();
    await expect(repo.saveGoal({ exerciseId: await exId(repo, PUSHUPS), targetLoad: 10, unit: 'kg', minReps: 5, deadline: null })).rejects.toThrow(/weight-and-reps/);
    const g = await repo.saveGoal({ exerciseId: await exId(repo, BENCH), targetLoad: 225, unit: 'lb', minReps: 5, deadline: null });
    expect((await repo.listGoals())[0]).toMatchObject({ id: g, targetLoad: 225, unit: 'lb' });
    await expect(repo.saveBodyweight({ readingDate: addDays(todayLocal(), 1), weight: 80, unit: 'kg' })).rejects.toThrow(/future/);
    await expect(repo.saveBodyweight({ readingDate: todayLocal(), weight: 0, unit: 'kg' })).rejects.toThrow(/greater than 0/);
    const r = await repo.saveBodyweight({ readingDate: todayLocal(), weight: 176.4, unit: 'lb' });
    await repo.saveBodyweight({ id: r, readingDate: todayLocal(), weight: 176.0, unit: 'lb' });
    expect((await repo.listBodyweight())[0]).toMatchObject({ weight: 176, unit: 'lb' });
    await repo.deleteBodyweight(r);
    expect(await repo.listBodyweight()).toEqual([]);
  });
});

describe('round 2: scoped change events and body figure (UI-05, TR-07A)', () => {
  it('recording a set in the active workout does not invalidate finished history; finishing does', async () => {
    const repo = await makeRepo();
    const seen: string[][] = [];
    repo.subscribe((s) => seen.push([...s].sort()));
    const w = await repo.startWorkout({ date: todayLocal() });
    await repo.addEntry(w.id, await exId(repo, BENCH));
    const before = await repo.finishedWorkouts();
    const s = (await repo.getWorkout(w.id))!.entries[0].sets[0].id;
    seen.length = 0;
    await repo.completeSet(s, { weight: '60', unit: 'kg', reps: '5' });
    expect(seen).toEqual([['active']]);
    expect(await repo.finishedWorkouts()).toBe(before); // cache kept: no history reload while logging
    seen.length = 0;
    await repo.finishWorkout(w.id, false);
    expect(seen).toEqual([['finished']]);
    expect((await repo.finishedWorkouts()).length).toBe(1);
  });

  it('upload acknowledgements only signal sync, never a data reload', async () => {
    const repo = await makeRepo();
    await repo.saveBodyweight({ readingDate: todayLocal(), weight: 80, unit: 'kg' });
    const op = (await repo.nextReadyOp())!;
    const seen: string[][] = [];
    repo.subscribe((s) => seen.push([...s]));
    await repo.ack(op, 1);
    expect(seen).toEqual([['sync']]);
  });

  it('body figure is a synced setting that survives in the snapshot', async () => {
    const repo = await makeRepo();
    expect((await repo.getSettings()).bodyFigure).toBe('male');
    await repo.updateSettings({ bodyFigure: 'female' });
    expect((await repo.getSettings()).bodyFigure).toBe('female');
    expect(await repo.snapshot('settings', repo.singletonId('settings'))).toMatchObject({ bodyFigure: 'female' });
    const ex = (await repo.exerciseMap()).get(await exId(repo, BENCH))!;
    expect(ex.media).toEqual(['Barbell_Bench_Press_-_Medium_Grip/0.jpg', 'Barbell_Bench_Press_-_Medium_Grip/1.jpg']);
  });
});
