import { randomUUID } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { seedDemoData } from '../src/data/demo';
import type { OutboxOp } from '../src/data/repository';
import { exerciseSeries, weeklyVolume } from '../src/domain/analytics';
import { addDays, todayLocal } from '../src/domain/dates';
import { planReminders } from '../src/domain/reminderPlan';
import { SyncCoordinator } from '../src/sync/coordinator';
import { NetworkError, type MutationResult, type SyncGateway } from '../src/sync/gateway';
import { BENCH, exId, makeRepo } from './helpers';

/** In-memory server double implementing the receipt/revision protocol. */
class FakeServer implements SyncGateway {
  heads = new Map<string, { revision: number; snapshot: any }>();
  receipts = new Map<string, { hash: string; revision: number }>();
  feed: { cursor: number; kind: any; aggregateId: string; revision: number; snapshot: any }[] = [];
  sent: OutboxOp[] = [];
  offline = false;
  async applyMutation(op: OutboxOp): Promise<MutationResult> {
    if (this.offline) throw new NetworkError('offline');
    this.sent.push(op);
    const r = this.receipts.get(op.operationId);
    if (r) return r.hash === op.payloadHash ? { status: 'applied', revision: r.revision, duplicate: true } : { status: 'rejected', reason: 'reused' };
    const head = this.heads.get(op.aggregateId) ?? { revision: 0, snapshot: null };
    if (head.revision !== op.baseRevision) return { status: 'conflict', reason: 'revision', revision: head.revision, remote: head.snapshot };
    const payload = JSON.parse(op.payload);
    const next = { revision: head.revision + 1, snapshot: payload.deleted ? null : payload };
    this.heads.set(op.aggregateId, next);
    this.receipts.set(op.operationId, { hash: op.payloadHash, revision: next.revision });
    this.feed.push({ cursor: this.feed.length + 1, kind: op.kind, aggregateId: op.aggregateId, revision: next.revision, snapshot: next.snapshot });
    return { status: 'applied', revision: next.revision };
  }
  async pullChanges(since: number) {
    if (this.offline) throw new NetworkError('offline');
    const events = this.feed.filter((e) => e.cursor > since);
    return { events, nextCursor: events.length ? events[events.length - 1].cursor : since, hasMore: false };
  }
}

describe('outbox protocol', () => {
  it('squashes never-sent snapshots of one aggregate but resends an attempted operation unchanged', async () => {
    const repo = await makeRepo({ ownerId: randomUUID() });
    const server = new FakeServer();
    const sync = new SyncCoordinator(repo, server);
    const w = await repo.startWorkout({ date: todayLocal() });
    await repo.addEntry(w.id, await exId(repo, BENCH));
    const s = (await repo.getWorkout(w.id))!.entries[0].sets[0].id;
    await repo.completeSet(s, { weight: '60', unit: 'kg', reps: '5' });
    expect((await repo.pendingOps()).length).toBe(3);
    server.offline = true;
    await sync.syncNow(); // first op attempted, fails
    server.offline = false;
    const attempted = (await repo.pendingOps()).find((o) => o.attempts > 0)!;
    await sync.syncNow();
    expect(server.sent[0].operationId).toBe(attempted.operationId); // the attempted op is resent with the same id
    expect(server.sent).toHaveLength(1); // earlier never-sent snapshots were squashed into the latest
    expect(JSON.parse(server.sent[0].payload).entries[0].sets[0].weight).toBe(60);
    expect(sync.state.status).toBe('uploaded');
    await repo.completeSet(s, { weight: '62.5', unit: 'kg', reps: '5' });
    await sync.syncNow();
    expect(server.sent[1].baseRevision).toBe(1); // rebased on the acknowledged revision
    expect(server.heads.get(w.id)!.snapshot.entries[0].sets[0].weight).toBe(62.5);
  });

  it('uploads a referenced custom exercise before the workout that uses it', async () => {
    const repo = await makeRepo({ ownerId: randomUUID() });
    const server = new FakeServer();
    const w = await repo.startWorkout({ date: todayLocal() });
    const ex = await repo.createExercise({ name: 'Garage Sled Drag', type: 'seconds' });
    await repo.addEntry(w.id, ex.id);
    await new SyncCoordinator(repo, server).syncNow();
    expect(server.sent.map((o) => o.kind)).toEqual(['exercise', 'workout']);
  });

  it('pulled changes never overwrite a record with pending local edits', async () => {
    const repo = await makeRepo({ ownerId: randomUUID() });
    const w = await repo.startWorkout({ date: todayLocal() });
    await repo.addEntry(w.id, await exId(repo, BENCH));
    const remote = { ...(await repo.snapshot('workout', w.id)), workoutDate: addDays(todayLocal(), -1) };
    const applied = await repo.applyPulledPage([{ cursor: 5, kind: 'workout', aggregateId: w.id, revision: 3, snapshot: remote }], 5);
    expect(applied).toBe(0);
    expect((await repo.getWorkout(w.id))!.workoutDate).toBe(todayLocal());
    expect(await repo.getCursor()).toBe(5);
  });

  it('a conflict blocks only that aggregate; keep_remote applies the cloud copy explicitly', async () => {
    const repo = await makeRepo({ ownerId: randomUUID() });
    const server = new FakeServer();
    const sync = new SyncCoordinator(repo, server);
    const g = await repo.saveGoal({ exerciseId: await exId(repo, BENCH), targetLoad: 100, unit: 'kg', minReps: 5, deadline: null });
    server.heads.set(g, { revision: 4, snapshot: { id: g, exerciseId: await exId(repo, BENCH), targetLoad: 110, unit: 'kg', minReps: 3, deadline: null } });
    await repo.saveBodyweight({ readingDate: todayLocal(), weight: 80, unit: 'kg' });
    await sync.syncNow();
    expect(sync.state.status).toBe('needs_attention');
    expect((await repo.outboxCounts()).blocked).toBe(1);
    expect(server.sent.some((o) => o.kind === 'bodyweight')).toBe(true); // independent record still synced
    await repo.resolveConflict(g, 'keep_remote');
    expect((await repo.listGoals())[0]).toMatchObject({ targetLoad: 110, minReps: 3 });
    await sync.syncNow();
    expect(sync.state.status).toBe('uploaded');
  });
});

describe('demo data and source agreement', () => {
  it('seeds realistic data; weekly totals equal the sum of per-exercise points', async () => {
    const repo = await makeRepo({ ownerId: randomUUID() });
    const r = await seedDemoData(repo, () => randomUUID());
    expect(r.workouts).toBeGreaterThan(20);
    expect((await repo.listRoutines()).map((x) => x.name).sort()).toEqual(['Home Bodyweight', 'Lower A', 'Upper A']);
    const ws = await repo.finishedWorkouts();
    const ex = await repo.exerciseMap();
    const weighted = [...ex.values()].filter((e) => e.type === 'weight_reps' && ws.some((w) => w.entries.some((en) => en.exerciseId === e.id)));
    const weekly = weeklyVolume(ws, ex, 'all', 'kg').reduce((a, b) => a + b.value, 0);
    const perExercise = weighted.reduce((a, e) => a + exerciseSeries(ws, e, 'all', 'kg').reduce((s, p) => s + p.value, 0), 0);
    expect(weekly).toBeCloseTo(perExercise, 6);
    await seedDemoData(repo, () => randomUUID()); // idempotent for routines/goals
    expect((await repo.listRoutines()).length).toBe(3);
    expect((await repo.listGoals()).length).toBe(2);
  });
});

describe('reminder planning (TR-12)', () => {
  it('one reminder per chosen weekday, skipping completed dates and past times', () => {
    const now = new Date(2026, 10, 11, 12, 0); // Wed Nov 11 2026, noon local
    const plan = planReminders({ enabled: true, weekdays: [3, 5], time: '18:00', now, completedDates: new Set(['2026-11-13']) });
    expect(plan[0].date).toBe('2026-11-11'); // today, later this evening
    expect(plan.map((p) => p.date)).not.toContain('2026-11-13'); // already trained that day
    expect(new Set(plan.map((p) => p.date)).size).toBe(plan.length);
    expect(planReminders({ enabled: true, weekdays: [3], time: '09:00', now, completedDates: new Set() })[0].date).toBe('2026-11-18');
    expect(planReminders({ enabled: false, weekdays: [3], time: '18:00', now, completedDates: new Set() })).toEqual([]);
  });
});
