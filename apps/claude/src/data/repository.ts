// Owner-scoped local repository. Each owner has an isolated SQLite file.
// Every confirmed mutation runs in ONE transaction that writes the aggregate
// and appends an immutable outbox snapshot; the UI confirms only after commit.
import { previousPerformance, type ExerciseMap } from '../domain/analytics';
import { isFuture, timezone, todayLocal } from '../domain/dates';
import {
  DomainError, KIND_PRIORITY, type AggregateKind, type BodyweightReading, type BodyweightTarget, type Exercise, type ExerciseType,
  type LiftGoal, type Phase, type ReminderPreference, type RestMode, type Routine, type RoutineEntry, type SetRow, type Settings,
  type Unit, type Workout, type WorkoutEntry,
} from '../domain/types';
import {
  normalizeName, validateActual, validateBodyweight, validateGoal, validateName, validateReminder, validateRestSeconds, validateTargets,
  validateWorkoutDate, type ActualInput,
} from '../domain/validation';
import { SCHEMA_VERSION, type DB, type Param } from './db';

export interface RepoDeps {
  uuid: () => string;
  sha256: (s: string) => Promise<string>;
  now?: () => Date;
}

type Row = Record<string, any>;

export interface OutboxOp {
  seq: number;
  operationId: string;
  kind: AggregateKind;
  aggregateId: string;
  baseRevision: number;
  payload: string;
  payloadHash: string;
  timezone: string;
  schemaVersion: number;
  attempts: number;
  status: 'pending' | 'blocked';
  lastError: string | null;
}

export interface ConflictRecord {
  id: string;
  kind: AggregateKind;
  aggregateId: string;
  localSnapshot: any;
  remoteSnapshot: any | null;
  remoteRevision: number;
  reason: string;
  createdAt: string;
}

export interface ChangeEvent {
  cursor: number;
  kind: AggregateKind;
  aggregateId: string;
  revision: number;
  snapshot: any | null; // null = tombstone
}

export interface HistoryFilter {
  from?: string | null;
  to?: string | null;
  exerciseId?: string | null;
}

export interface HistoryRow {
  id: string;
  workoutDate: string;
  exerciseNames: string[];
  setCount: number;
  durationSeconds: number | null;
  routineName: string | null;
  pendingUpload: boolean;
}

export interface UndoToken {
  id: string;
  label: string;
  workoutId: string;
  entry: WorkoutEntry;
  version: number;
}

export interface StartOptions {
  date: string;
  routineId?: string | null;
  skipExerciseIds?: string[];
  prep?: { exerciseId: string; phase: Phase; sets: { targetReps: number | null; targetSeconds: number | null; targetLoad: number | null; targetUnit: Unit | null }[] }[];
}

export interface RoutineInput {
  id?: string;
  name: string;
  defaultRestSeconds: number | null;
  entries: Omit<RoutineEntry, 'id' | 'routineId' | 'position'>[];
}

const bool = (v: any) => v === 1 || v === true;
const json = <T>(s: string | null, fallback: T): T => {
  if (!s) return fallback;
  try {
    return JSON.parse(s) as T;
  } catch {
    return fallback;
  }
};

function mapExercise(r: Row): Exercise {
  return {
    id: r.id, ownerId: r.owner_id ?? null, name: r.name, normalizedName: r.normalized_name, type: r.type, category: r.category,
    equipment: r.equipment, primaryMuscles: json(r.primary_muscles, []), secondaryMuscles: json(r.secondary_muscles, []),
    instructions: r.instructions ?? '', sourceId: r.source_id ?? null, archived: bool(r.archived), everUsed: bool(r.ever_used), revision: r.revision,
  };
}

function mapSet(r: Row): SetRow {
  return {
    id: r.id, entryId: r.entry_id, position: r.position, state: r.state, targetReps: r.target_reps, targetSeconds: r.target_seconds,
    targetLoad: r.target_load, targetUnit: r.target_unit, targetRirMin: r.target_rir_min, targetRirMax: r.target_rir_max,
    weight: r.weight, unit: r.unit, reps: r.reps, seconds: r.seconds, rir: r.rir, completedAt: r.completed_at,
  };
}

function mapWorkout(r: Row, entries: WorkoutEntry[]): Workout {
  return {
    id: r.id, workoutDate: r.workout_date, state: r.state, startedAt: r.started_at, finishedAt: r.finished_at, durationSeconds: r.duration_seconds,
    routineId: r.routine_id, routineName: r.routine_name, defaultRestSeconds: r.default_rest_seconds, backdated: bool(r.backdated),
    revision: r.revision, entries,
  };
}

const SET_COLS = 'id, entry_id, position, state, target_reps, target_seconds, target_load, target_unit, target_rir_min, target_rir_max, weight, unit, reps, seconds, rir, completed_at';

export class Repository {
  private exCache: Map<string, Exercise> | null = null;
  private finishedCache: Workout[] | null = null;
  private listeners = new Set<() => void>();
  private undoTokens = new Map<string, UndoToken>();
  version = 0;

  constructor(public readonly db: DB, public readonly ownerId: string, private deps: RepoDeps) {}

  // ---------- change events ----------
  subscribe(fn: () => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private changed() {
    this.version += 1;
    this.exCache = null;
    this.finishedCache = null;
    for (const fn of this.listeners) fn();
  }

  private now() {
    return (this.deps.now?.() ?? new Date());
  }
  private nowIso() {
    return this.now().toISOString();
  }
  private today() {
    return todayLocal(this.now());
  }

  /** Run a mutation atomically; emit change event only after commit. */
  private async mutate<T>(fn: () => Promise<T>): Promise<T> {
    const out = await this.db.tx(fn);
    this.changed();
    return out;
  }

  // ---------- outbox ----------
  private async revisionOf(kind: AggregateKind, id: string): Promise<number> {
    const table = { exercise: 'exercises', routine: 'routines', workout: 'workouts', goal: 'goals', bodyweight: 'bodyweight', settings: 'settings', reminder: 'reminder', bodyweight_target: 'bodyweight_target' }[kind];
    const key = kind === 'settings' || kind === 'reminder' || kind === 'bodyweight_target' ? 1 : id;
    const r = await this.db.first<{ revision: number }>(`SELECT revision FROM ${table} WHERE id = ?`, [key]);
    return r?.revision ?? 0;
  }

  /** Must be called inside a transaction, after the aggregate rows are written. */
  private async enqueue(kind: AggregateKind, id: string): Promise<void> {
    const snapshot = await this.snapshot(kind, id);
    const payload = JSON.stringify(snapshot);
    const hash = await this.deps.sha256(`${kind}|${id}|${payload}`);
    const base = await this.revisionOf(kind, id);
    await this.db.run(
      'INSERT INTO outbox (operation_id, kind, aggregate_id, base_revision, payload, payload_hash, timezone, schema_version, created_at) VALUES (?,?,?,?,?,?,?,?,?)',
      [this.deps.uuid(), kind, id, base, payload, hash, timezone(), SCHEMA_VERSION, this.nowIso()],
    );
  }

  singletonId(kind: 'settings' | 'reminder' | 'bodyweight_target'): string {
    return `${kind}:${this.ownerId}`;
  }

  /** Full aggregate snapshot used for upload and conflict preservation. */
  async snapshot(kind: AggregateKind, id: string): Promise<any> {
    switch (kind) {
      case 'workout': {
        const w = await this.getWorkout(id, true);
        if (!w || (await this.isDeleted('workouts', id))) return { deleted: true };
        const { revision: _r, ...rest } = w;
        return rest;
      }
      case 'exercise': {
        const r = await this.db.first<Row>('SELECT * FROM exercises WHERE id = ?', [id]);
        if (!r || r.archived === 2) return { deleted: true };
        const e = mapExercise(r);
        return { id: e.id, name: e.name, type: e.type, primaryMuscles: e.primaryMuscles, secondaryMuscles: e.secondaryMuscles, archived: e.archived, equipment: e.equipment, instructions: e.instructions };
      }
      case 'routine': {
        const r = await this.getRoutine(id, true);
        if (!r || (await this.isDeleted('routines', id))) return { deleted: true };
        const { revision: _r, updatedAt: _u, normalizedName: _n, ...rest } = r;
        return rest;
      }
      case 'settings': {
        const s = await this.getSettings();
        return { unit: s.unit, unitChosen: s.unitChosen, showEquivalent: s.showEquivalent, textScale: s.textScale };
      }
      case 'reminder': {
        const p = await this.getReminder();
        return { enabled: p.enabled, weekdays: p.weekdays, time: p.time };
      }
      case 'goal': {
        const r = await this.db.first<Row>('SELECT * FROM goals WHERE id = ?', [id]);
        if (!r || r.deleted) return { deleted: true };
        return { id: r.id, exerciseId: r.exercise_id, targetLoad: r.target_load, unit: r.unit, minReps: r.min_reps, deadline: r.deadline, createdAt: r.created_at };
      }
      case 'bodyweight': {
        const r = await this.db.first<Row>('SELECT * FROM bodyweight WHERE id = ?', [id]);
        if (!r || r.deleted) return { deleted: true };
        return { id: r.id, readingDate: r.reading_date, enteredAt: r.entered_at, weight: r.weight, unit: r.unit };
      }
      case 'bodyweight_target': {
        const r = await this.db.first<Row>('SELECT * FROM bodyweight_target WHERE id = 1');
        if (!r || r.deleted) return { deleted: true };
        return { weight: r.weight, unit: r.unit, targetDate: r.target_date };
      }
    }
  }

  private async isDeleted(table: string, id: string) {
    const r = await this.db.first<{ deleted: number }>(`SELECT deleted FROM ${table} WHERE id = ?`, [id]);
    return !r || r.deleted === 1;
  }

  // ---------- exercises ----------
  async exercises(): Promise<Map<string, Exercise>> {
    if (this.exCache) return this.exCache;
    const rows = await this.db.all<Row>('SELECT * FROM exercises WHERE archived < 2');
    const m = new Map<string, Exercise>();
    for (const r of rows) m.set(r.id, mapExercise(r));
    this.exCache = m;
    return m;
  }

  async getExercise(id: string): Promise<Exercise | null> {
    return (await this.exercises()).get(id) ?? null;
  }

  async recentExerciseIds(limit = 10): Promise<string[]> {
    const rows = await this.db.all<{ id: string }>('SELECT id FROM exercises WHERE last_used_at IS NOT NULL AND archived = 0 ORDER BY last_used_at DESC LIMIT ?', [limit]);
    return rows.map((r) => r.id);
  }

  /** FW-11 / TR-06: case-insensitive substring search with optional filters; recent first when empty. */
  async searchExercises(text: string, filters: { muscle?: string | null; equipment?: string | null; category?: string | null } = {}, includeArchived = false): Promise<{ recent: Exercise[]; results: Exercise[] }> {
    const all = [...(await this.exercises()).values()];
    const q = text.trim().toLocaleLowerCase('en-US');
    const match = (e: Exercise) =>
      (includeArchived || !e.archived) &&
      (!q || e.name.toLocaleLowerCase('en-US').includes(q)) &&
      (!filters.muscle || e.primaryMuscles.includes(filters.muscle) || e.secondaryMuscles.includes(filters.muscle)) &&
      (!filters.equipment || e.equipment === filters.equipment) &&
      (!filters.category || e.category === filters.category);
    const results = all.filter(match).sort((a, b) => {
      if (q) {
        const ap = a.name.toLocaleLowerCase('en-US').startsWith(q) ? 0 : 1;
        const bp = b.name.toLocaleLowerCase('en-US').startsWith(q) ? 0 : 1;
        if (ap !== bp) return ap - bp;
      }
      return a.name.localeCompare(b.name);
    });
    let recent: Exercise[] = [];
    if (!q) {
      const ids = await this.recentExerciseIds(10);
      const byId = new Map(results.map((e) => [e.id, e]));
      recent = ids.map((id) => byId.get(id)).filter((e): e is Exercise => !!e);
    }
    return { recent, results };
  }

  private async assertUniqueExerciseName(name: string, exceptId?: string) {
    const n = normalizeName(name);
    const clash = await this.db.first<{ name: string }>('SELECT name FROM exercises WHERE normalized_name = ? AND archived < 2 AND id <> ?', [n, exceptId ?? '']);
    if (clash) throw new DomainError(`“${clash.name}” already exists in the library.`, 'name');
  }

  async createExercise(input: { name: string; type: ExerciseType; primaryMuscles?: string[]; secondaryMuscles?: string[]; equipment?: string }): Promise<Exercise> {
    const err = validateName(input.name);
    if (err) throw new DomainError(err, 'name');
    const id = this.deps.uuid();
    const name = input.name.trim();
    await this.mutate(async () => {
      await this.assertUniqueExerciseName(name);
      const prim = [...new Set(input.primaryMuscles ?? [])];
      const sec = [...new Set(input.secondaryMuscles ?? [])].filter((m) => !prim.includes(m));
      await this.db.run(
        `INSERT INTO exercises (id, owner_id, name, normalized_name, type, category, equipment, primary_muscles, secondary_muscles, instructions)
         VALUES (?, ?, ?, ?, ?, 'custom', ?, ?, ?, '')`,
        [id, this.ownerId, name, normalizeName(name), input.type, input.equipment ?? 'unknown', JSON.stringify(prim), JSON.stringify(sec)],
      );
      await this.enqueue('exercise', id);
    });
    return (await this.getExercise(id))!;
  }

  private async ownCustom(id: string): Promise<Row> {
    const r = await this.db.first<Row>('SELECT * FROM exercises WHERE id = ? AND archived < 2', [id]);
    if (!r) throw new DomainError('Exercise not found.');
    if (r.owner_id == null) throw new DomainError('Library exercises cannot be changed. Create your own exercise instead.');
    return r;
  }

  async exerciseIsUsed(id: string): Promise<boolean> {
    const r = await this.db.first<{ n: number }>(
      `SELECT COUNT(*) AS n FROM sets s JOIN entries e ON e.id = s.entry_id JOIN workouts w ON w.id = e.workout_id
       WHERE e.exercise_id = ? AND w.deleted = 0 AND s.state = 'done'`,
      [id],
    );
    const ever = await this.db.first<{ ever_used: number }>('SELECT ever_used FROM exercises WHERE id = ?', [id]);
    return (r?.n ?? 0) > 0 || bool(ever?.ever_used);
  }

  async updateExercise(id: string, patch: { name?: string; type?: ExerciseType; primaryMuscles?: string[]; secondaryMuscles?: string[] }): Promise<void> {
    await this.mutate(async () => {
      const r = await this.ownCustom(id);
      if (patch.name != null) {
        const err = validateName(patch.name);
        if (err) throw new DomainError(err, 'name');
        await this.assertUniqueExerciseName(patch.name.trim(), id);
        await this.db.run('UPDATE exercises SET name = ?, normalized_name = ? WHERE id = ?', [patch.name.trim(), normalizeName(patch.name), id]);
      }
      if (patch.type != null && patch.type !== r.type) {
        if (await this.exerciseIsUsed(id)) throw new DomainError('The type is locked because sets already use this exercise.', 'type');
        await this.db.run('UPDATE exercises SET type = ? WHERE id = ?', [patch.type, id]);
      }
      if (patch.primaryMuscles || patch.secondaryMuscles) {
        const prim = [...new Set(patch.primaryMuscles ?? json<string[]>(r.primary_muscles, []))];
        const sec = [...new Set(patch.secondaryMuscles ?? json<string[]>(r.secondary_muscles, []))].filter((m) => !prim.includes(m));
        await this.db.run('UPDATE exercises SET primary_muscles = ?, secondary_muscles = ? WHERE id = ?', [JSON.stringify(prim), JSON.stringify(sec), id]);
      }
      await this.enqueue('exercise', id);
    });
  }

  /** FW-13: archive hides from search, keeps sets; restore undoes it. */
  async setArchived(id: string, archived: boolean): Promise<void> {
    await this.mutate(async () => {
      await this.ownCustom(id);
      await this.db.run('UPDATE exercises SET archived = ? WHERE id = ?', [archived ? 1 : 0, id]);
      await this.enqueue('exercise', id);
    });
  }

  /** Only an unused, unreferenced custom exercise can be deleted. */
  async deleteExercise(id: string): Promise<void> {
    await this.mutate(async () => {
      await this.ownCustom(id);
      if (await this.exerciseIsUsed(id)) throw new DomainError('Used exercises cannot be deleted. Archive it instead.');
      const refs = await this.db.first<{ n: number }>(
        `SELECT (SELECT COUNT(*) FROM entries e JOIN workouts w ON w.id = e.workout_id WHERE e.exercise_id = ? AND w.deleted = 0)
              + (SELECT COUNT(*) FROM routine_entries re JOIN routines r ON r.id = re.routine_id WHERE re.exercise_id = ? AND r.deleted = 0)
              + (SELECT COUNT(*) FROM goals WHERE exercise_id = ? AND deleted = 0) AS n`,
        [id, id, id],
      );
      if ((refs?.n ?? 0) > 0) throw new DomainError('This exercise is in a workout, routine or goal. Archive it instead.');
      await this.db.run('UPDATE exercises SET archived = 2 WHERE id = ?', [id]);
      await this.enqueue('exercise', id);
    });
  }

  // ---------- workouts: reads ----------
  private async loadEntries(workoutIds: string[]): Promise<Map<string, WorkoutEntry[]>> {
    const out = new Map<string, WorkoutEntry[]>();
    if (!workoutIds.length) return out;
    for (let i = 0; i < workoutIds.length; i += 400) {
      const ids = workoutIds.slice(i, i + 400);
      const ph = ids.map(() => '?').join(',');
      const entries = await this.db.all<Row>(`SELECT * FROM entries WHERE workout_id IN (${ph}) ORDER BY workout_id, position`, ids);
      const entryIds = entries.map((e) => e.id);
      const sets = new Map<string, SetRow[]>();
      for (let j = 0; j < entryIds.length; j += 400) {
        const eids = entryIds.slice(j, j + 400);
        const rows = await this.db.all<Row>(`SELECT ${SET_COLS} FROM sets WHERE entry_id IN (${eids.map(() => '?').join(',')}) ORDER BY entry_id, position`, eids);
        for (const r of rows) {
          const list = sets.get(r.entry_id) ?? [];
          list.push(mapSet(r));
          sets.set(r.entry_id, list);
        }
      }
      for (const e of entries) {
        const list = out.get(e.workout_id) ?? [];
        list.push({ id: e.id, workoutId: e.workout_id, exerciseId: e.exercise_id, position: e.position, phase: e.phase, restMode: e.rest_mode, restSeconds: e.rest_seconds, sets: sets.get(e.id) ?? [] });
        out.set(e.workout_id, list);
      }
    }
    return out;
  }

  async getWorkout(id: string, includeDeleted = false): Promise<Workout | null> {
    const r = await this.db.first<Row>(`SELECT * FROM workouts WHERE id = ? ${includeDeleted ? '' : 'AND deleted = 0'}`, [id]);
    if (!r) return null;
    const entries = await this.loadEntries([id]);
    return mapWorkout(r, entries.get(id) ?? []);
  }

  async getActiveWorkout(): Promise<Workout | null> {
    const r = await this.db.first<{ id: string }>("SELECT id FROM workouts WHERE state = 'active' AND deleted = 0");
    return r ? this.getWorkout(r.id) : null;
  }

  /** All finished, non-deleted workouts: the single source for analytics. */
  async finishedWorkouts(): Promise<Workout[]> {
    if (this.finishedCache) return this.finishedCache;
    const rows = await this.db.all<Row>("SELECT * FROM workouts WHERE state = 'finished' AND deleted = 0 ORDER BY workout_date DESC, id DESC");
    const entries = await this.loadEntries(rows.map((r) => r.id));
    this.finishedCache = rows.map((r) => mapWorkout(r, entries.get(r.id) ?? []));
    return this.finishedCache;
  }

  async previousPerformance(exerciseId: string, excludeWorkoutId?: string) {
    return previousPerformance(await this.finishedWorkouts(), exerciseId, excludeWorkoutId);
  }

  /** FW-14 / FW-19: keyset pagination on (workout_date, id). */
  async historyPage(filter: HistoryFilter, cursor: { date: string; id: string } | null, limit = 20): Promise<{ rows: HistoryRow[]; next: { date: string; id: string } | null }> {
    const where = ["w.state = 'finished'", 'w.deleted = 0'];
    const params: Param[] = [];
    if (filter.from) { where.push('w.workout_date >= ?'); params.push(filter.from); }
    if (filter.to) { where.push('w.workout_date <= ?'); params.push(filter.to); }
    if (filter.exerciseId) {
      where.push("EXISTS (SELECT 1 FROM entries e JOIN sets s ON s.entry_id = e.id WHERE e.workout_id = w.id AND e.exercise_id = ? AND s.state = 'done')");
      params.push(filter.exerciseId);
    }
    if (cursor) { where.push('(w.workout_date < ? OR (w.workout_date = ? AND w.id < ?))'); params.push(cursor.date, cursor.date, cursor.id); }
    const rows = await this.db.all<Row>(
      `SELECT w.* FROM workouts w WHERE ${where.join(' AND ')} ORDER BY w.workout_date DESC, w.id DESC LIMIT ?`,
      [...params, limit + 1],
    );
    const page = rows.slice(0, limit);
    const ex = await this.exercises();
    const entries = await this.loadEntries(page.map((r) => r.id));
    const pending = await this.db.all<{ aggregate_id: string }>("SELECT DISTINCT aggregate_id FROM outbox WHERE kind = 'workout'");
    const pendingSet = new Set(pending.map((p) => p.aggregate_id));
    const out: HistoryRow[] = page.map((r) => {
      const es = (entries.get(r.id) ?? []).filter((e) => e.sets.some((s) => s.state === 'done'));
      return {
        id: r.id, workoutDate: r.workout_date, durationSeconds: r.duration_seconds, routineName: r.routine_name,
        exerciseNames: es.filter((e) => e.phase === 'work').map((e) => ex.get(e.exerciseId)?.name ?? 'Unknown exercise'),
        setCount: es.filter((e) => e.phase === 'work').reduce((a, e) => a + e.sets.filter((s) => s.state === 'done').length, 0),
        pendingUpload: pendingSet.has(r.id),
      };
    });
    const last = page[page.length - 1];
    return { rows: out, next: rows.length > limit && last ? { date: last.workout_date, id: last.id } : null };
  }

  /** FW-16: every finished workout containing the exercise, newest first. */
  async exerciseHistory(exerciseId: string): Promise<{ workoutId: string; date: string; sets: SetRow[]; phase: Phase }[]> {
    const ws = await this.finishedWorkouts();
    const out: { workoutId: string; date: string; sets: SetRow[]; phase: Phase }[] = [];
    for (const w of ws) {
      for (const e of w.entries) {
        if (e.exerciseId !== exerciseId) continue;
        const done = e.sets.filter((s) => s.state === 'done');
        if (done.length) out.push({ workoutId: w.id, date: w.workoutDate, sets: done, phase: e.phase });
      }
    }
    return out;
  }

  async exerciseMap(): Promise<ExerciseMap> {
    return this.exercises();
  }

  // ---------- workouts: mutations ----------
  private async markUsed(exerciseId: string) {
    await this.db.run('UPDATE exercises SET last_used_at = ? WHERE id = ?', [this.nowIso(), exerciseId]);
  }

  private async insertEntry(workoutId: string, exerciseId: string, position: number, phase: Phase, restMode: RestMode = 'inherit', restSeconds: number | null = null) {
    const id = this.deps.uuid();
    await this.db.run('INSERT INTO entries (id, workout_id, exercise_id, position, phase, rest_mode, rest_seconds) VALUES (?,?,?,?,?,?,?)', [id, workoutId, exerciseId, position, phase, restMode, restSeconds]);
    return id;
  }

  private async insertSet(entryId: string, position: number, t: Partial<SetRow> = {}) {
    const id = t.id ?? this.deps.uuid();
    await this.db.run(
      `INSERT INTO sets (${SET_COLS}) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [id, entryId, position, t.state ?? 'pending', t.targetReps ?? null, t.targetSeconds ?? null, t.targetLoad ?? null, t.targetUnit ?? null,
        t.targetRirMin ?? null, t.targetRirMax ?? null, t.weight ?? null, t.unit ?? null, t.reps ?? null, t.seconds ?? null, t.rir ?? null, t.completedAt ?? null],
    );
    return id;
  }

  /** FW-01 / FW-08 / FW-26 / TR-01: start ad hoc or from a routine snapshot. */
  async startWorkout(opts: StartOptions): Promise<Workout> {
    const dateErr = validateWorkoutDate(opts.date, this.today());
    if (dateErr) throw new DomainError(dateErr, 'date');
    const id = this.deps.uuid();
    await this.mutate(async () => {
      if (await this.db.first("SELECT id FROM workouts WHERE state = 'active' AND deleted = 0"))
        throw new DomainError('A workout is already in progress. Resume or discard it first.');
      let routine: Routine | null = null;
      if (opts.routineId) {
        routine = await this.getRoutine(opts.routineId);
        if (!routine) throw new DomainError('That routine no longer exists.');
      }
      const now = this.nowIso();
      await this.db.run(
        'INSERT INTO workouts (id, workout_date, state, started_at, routine_id, routine_name, default_rest_seconds, backdated) VALUES (?,?,?,?,?,?,?,?)',
        [id, opts.date, 'active', now, routine?.id ?? null, routine?.name ?? null, routine?.defaultRestSeconds ?? null, opts.date !== this.today() ? 1 : 0],
      );
      let pos = 1;
      const ex = await this.exercises();
      for (const p of opts.prep ?? []) {
        if (p.phase !== 'warmup') continue;
        const eid = await this.insertEntry(id, p.exerciseId, pos++, 'warmup', 'off');
        let sp = 1;
        for (const s of p.sets) await this.insertSet(eid, sp++, s);
      }
      for (const re of routine?.entries ?? []) {
        if (opts.skipExerciseIds?.includes(re.exerciseId)) continue;
        if (!ex.get(re.exerciseId)) continue;
        const eid = await this.insertEntry(id, re.exerciseId, pos++, re.phase, re.restMode, re.restSeconds);
        for (let i = 1; i <= (re.targetSets ?? 0); i++) {
          await this.insertSet(eid, i, {
            targetReps: re.targetReps, targetSeconds: re.targetSeconds, targetLoad: re.targetLoad, targetUnit: re.targetUnit,
            targetRirMin: re.targetRirMin, targetRirMax: re.targetRirMax,
          });
        }
      }
      for (const p of opts.prep ?? []) {
        if (p.phase !== 'mobility') continue;
        const eid = await this.insertEntry(id, p.exerciseId, pos++, 'mobility', 'off');
        let sp = 1;
        for (const s of p.sets) await this.insertSet(eid, sp++, s);
      }
      await this.enqueue('workout', id);
    });
    return (await this.getWorkout(id))!;
  }

  private async workoutOfEntry(entryId: string): Promise<{ workoutId: string; state: string; exerciseId: string; phase: Phase }> {
    const r = await this.db.first<Row>('SELECT e.workout_id, w.state, e.exercise_id, e.phase FROM entries e JOIN workouts w ON w.id = e.workout_id WHERE e.id = ? AND w.deleted = 0', [entryId]);
    if (!r) throw new DomainError('That exercise entry no longer exists.');
    return { workoutId: r.workout_id, state: r.state, exerciseId: r.exercise_id, phase: r.phase };
  }

  private async setContext(setId: string) {
    const r = await this.db.first<Row>(
      `SELECT s.*, e.workout_id, e.exercise_id, e.phase, w.state AS workout_state FROM sets s JOIN entries e ON e.id = s.entry_id JOIN workouts w ON w.id = e.workout_id
       WHERE s.id = ? AND w.deleted = 0`,
      [setId],
    );
    if (!r) throw new DomainError('That set no longer exists.');
    const ex = await this.getExercise(r.exercise_id);
    if (!ex) throw new DomainError('Exercise not found.');
    return { row: r, set: mapSet(r), exercise: ex, workoutId: r.workout_id as string, phase: r.phase as Phase, workoutState: r.workout_state as string };
  }

  async addEntry(workoutId: string, exerciseId: string, phase: Phase = 'work'): Promise<string> {
    const ex = await this.getExercise(exerciseId);
    if (!ex) throw new DomainError('Exercise not found.');
    if (ex.archived) throw new DomainError('Archived exercises cannot be added. Restore it first.');
    let entryId = '';
    await this.mutate(async () => {
      const w = await this.db.first<Row>('SELECT * FROM workouts WHERE id = ? AND deleted = 0', [workoutId]);
      if (!w) throw new DomainError('Workout not found.');
      const pos = await this.db.first<{ p: number }>('SELECT COALESCE(MAX(position), 0) + 1 AS p FROM entries WHERE workout_id = ?', [workoutId]);
      entryId = await this.insertEntry(workoutId, exerciseId, pos?.p ?? 1, phase);
      if (w.state === 'active' && phase === 'work') await this.insertSet(entryId, 1, {}); // first row ready for entry
      await this.markUsed(exerciseId);
      await this.enqueue('workout', workoutId);
    });
    return entryId;
  }

  /** Add an extra row. On a finished workout an actual result is required. */
  async addSet(entryId: string, actual?: ActualInput): Promise<string> {
    let setId = '';
    await this.mutate(async () => {
      const ctx = await this.workoutOfEntry(entryId);
      const pos = await this.db.first<{ p: number }>('SELECT COALESCE(MAX(position), 0) + 1 AS p FROM sets WHERE entry_id = ?', [entryId]);
      if (ctx.state === 'finished' || actual) {
        const ex = await this.getExercise(ctx.exerciseId);
        const v = validateActual(ex!.type, actual ?? {});
        if (!v.ok) throw new DomainError(Object.values(v.errors)[0]!, Object.keys(v.errors)[0]);
        setId = await this.insertSet(entryId, pos?.p ?? 1, { state: 'done', ...v.value, completedAt: this.nowIso() });
        await this.db.run('UPDATE exercises SET ever_used = 1 WHERE id = ?', [ctx.exerciseId]);
      } else {
        setId = await this.insertSet(entryId, pos?.p ?? 1, {});
      }
      await this.enqueue('workout', ctx.workoutId);
    });
    return setId;
  }

  /** FW-02 / TR-02: confirm actuals for an existing row (pending or done). Duplicate completion updates, never duplicates. */
  async completeSet(setId: string, input: ActualInput): Promise<SetRow> {
    const ctx = await this.setContext(setId);
    const v = validateActual(ctx.exercise.type, input);
    if (!v.ok) {
      const [field, msg] = Object.entries(v.errors)[0]!;
      throw new DomainError(msg!, field);
    }
    await this.mutate(async () => {
      await this.db.run(
        "UPDATE sets SET state = 'done', weight = ?, unit = ?, reps = ?, seconds = ?, rir = ?, completed_at = COALESCE(completed_at, ?) WHERE id = ?",
        [v.value.weight, v.value.unit, v.value.reps, v.value.seconds, v.value.rir, this.nowIso(), setId],
      );
      await this.db.run('UPDATE exercises SET ever_used = 1 WHERE id = ?', [ctx.exercise.id]);
      await this.markUsed(ctx.exercise.id);
      await this.enqueue('workout', ctx.workoutId);
    });
    const after = await this.setContext(setId);
    return after.set;
  }

  async skipSet(setId: string): Promise<void> {
    const ctx = await this.setContext(setId);
    if (ctx.workoutState === 'finished' && ctx.set.state === 'done') await this.assertNotLastWorkingSet(ctx.workoutId, setId);
    await this.mutate(async () => {
      await this.db.run("UPDATE sets SET state = 'skipped', weight = NULL, unit = NULL, reps = NULL, seconds = NULL, rir = NULL, completed_at = NULL WHERE id = ?", [setId]);
      await this.enqueue('workout', ctx.workoutId);
    });
  }

  /** Undo a completion or skip: the row returns to pending with no actuals. */
  async reopenSet(setId: string): Promise<void> {
    const ctx = await this.setContext(setId);
    if (ctx.workoutState === 'finished') throw new DomainError('Finished workouts cannot have pending sets. Edit or delete the set instead.');
    await this.mutate(async () => {
      await this.db.run("UPDATE sets SET state = 'pending', weight = NULL, unit = NULL, reps = NULL, seconds = NULL, rir = NULL, completed_at = NULL WHERE id = ?", [setId]);
      await this.enqueue('workout', ctx.workoutId);
    });
  }

  private async assertNotLastWorkingSet(workoutId: string, removingSetId?: string, removingEntryId?: string) {
    const w = await this.db.first<Row>('SELECT state FROM workouts WHERE id = ?', [workoutId]);
    if (w?.state !== 'finished') return;
    const r = await this.db.first<{ n: number }>(
      `SELECT COUNT(*) AS n FROM sets s JOIN entries e ON e.id = s.entry_id
       WHERE e.workout_id = ? AND e.phase = 'work' AND s.state = 'done' AND s.id <> ? AND e.id <> ?`,
      [workoutId, removingSetId ?? '', removingEntryId ?? ''],
    );
    if ((r?.n ?? 0) === 0) throw new DomainError('A finished workout needs at least one set. Delete the workout instead.');
  }

  private async entrySnapshot(entryId: string): Promise<WorkoutEntry> {
    const e = await this.db.first<Row>('SELECT * FROM entries WHERE id = ?', [entryId]);
    if (!e) throw new DomainError('Entry not found.');
    const sets = (await this.db.all<Row>(`SELECT ${SET_COLS} FROM sets WHERE entry_id = ? ORDER BY position`, [entryId])).map(mapSet);
    return { id: e.id, workoutId: e.workout_id, exerciseId: e.exercise_id, position: e.position, phase: e.phase, restMode: e.rest_mode, restSeconds: e.rest_seconds, sets };
  }

  private async renumber(entryId: string) {
    const rows = await this.db.all<{ id: string }>('SELECT id FROM sets WHERE entry_id = ? ORDER BY position', [entryId]);
    let i = 1;
    for (const r of rows) await this.db.run('UPDATE sets SET position = ? WHERE id = ?', [i++, r.id]);
  }

  private makeUndo(label: string, workoutId: string, entry: WorkoutEntry): UndoToken {
    this.undoTokens.clear(); // undo expires after another mutation
    const t: UndoToken = { id: this.deps.uuid(), label, workoutId, entry, version: this.version + 1 };
    this.undoTokens.set(t.id, t);
    return t;
  }

  /** FW-05 / FW-17: delete a set after confirmation; returns an immediate undo token. */
  async deleteSet(setId: string): Promise<UndoToken> {
    const ctx = await this.setContext(setId);
    if (ctx.set.state === 'done') await this.assertNotLastWorkingSet(ctx.workoutId, setId);
    const before = await this.entrySnapshot(ctx.set.entryId);
    const token = this.makeUndo(`Set ${ctx.set.position} deleted`, ctx.workoutId, before);
    await this.mutate(async () => {
      await this.db.run('DELETE FROM sets WHERE id = ?', [setId]);
      await this.renumber(ctx.set.entryId);
      await this.enqueue('workout', ctx.workoutId);
    });
    return token;
  }

  async deleteEntry(entryId: string): Promise<UndoToken> {
    const ctx = await this.workoutOfEntry(entryId);
    await this.assertNotLastWorkingSet(ctx.workoutId, undefined, entryId);
    const before = await this.entrySnapshot(entryId);
    const ex = await this.getExercise(before.exerciseId);
    const token = this.makeUndo(`${ex?.name ?? 'Exercise'} removed`, ctx.workoutId, before);
    await this.mutate(async () => {
      await this.db.run('DELETE FROM entries WHERE id = ?', [entryId]);
      await this.enqueue('workout', ctx.workoutId);
    });
    return token;
  }

  /** Restore the snapshot through another atomic mutation, only if nothing else changed since. */
  async undo(tokenId: string): Promise<void> {
    const t = this.undoTokens.get(tokenId);
    if (!t || t.version !== this.version) throw new DomainError('Undo is no longer available.');
    this.undoTokens.clear();
    await this.mutate(async () => {
      const exists = await this.db.first('SELECT id FROM entries WHERE id = ?', [t.entry.id]);
      if (exists) await this.db.run('DELETE FROM sets WHERE entry_id = ?', [t.entry.id]);
      else
        await this.db.run('INSERT INTO entries (id, workout_id, exercise_id, position, phase, rest_mode, rest_seconds) VALUES (?,?,?,?,?,?,?)', [
          t.entry.id, t.workoutId, t.entry.exerciseId, t.entry.position, t.entry.phase, t.entry.restMode, t.entry.restSeconds,
        ]);
      for (const s of t.entry.sets) await this.insertSet(t.entry.id, s.position, s);
      await this.enqueue('workout', t.workoutId);
    });
  }

  clearUndo() {
    this.undoTokens.clear();
  }

  /** TR-05: substitute a preparation step (or any entry without completed sets) with another exercise. */
  async replaceEntryExercise(entryId: string, exerciseId: string): Promise<void> {
    const ctx = await this.workoutOfEntry(entryId);
    const ex = await this.getExercise(exerciseId);
    if (!ex || ex.archived) throw new DomainError('Choose an active exercise.');
    const done = await this.db.first<{ n: number }>("SELECT COUNT(*) AS n FROM sets WHERE entry_id = ? AND state = 'done'", [entryId]);
    if ((done?.n ?? 0) > 0) throw new DomainError('This entry already has completed sets. Add the other exercise separately.');
    await this.mutate(async () => {
      await this.db.run('UPDATE entries SET exercise_id = ? WHERE id = ?', [exerciseId, entryId]);
      if (ex.type === 'seconds') await this.db.run('UPDATE sets SET target_reps = NULL, target_load = NULL, target_unit = NULL, target_seconds = COALESCE(target_seconds, 30) WHERE entry_id = ?', [entryId]);
      else await this.db.run('UPDATE sets SET target_seconds = NULL, target_reps = COALESCE(target_reps, 10) WHERE entry_id = ?', [entryId]);
      if (ex.type !== 'weight_reps') await this.db.run('UPDATE sets SET target_load = NULL, target_unit = NULL WHERE entry_id = ?', [entryId]);
      await this.markUsed(exerciseId);
      await this.enqueue('workout', ctx.workoutId);
    });
  }

  async setEntryRest(entryId: string, mode: RestMode, seconds: number | null): Promise<void> {
    const err = mode === 'duration' ? validateRestSeconds(seconds) ?? (seconds == null ? 'Enter a rest duration.' : null) : null;
    if (err) throw new DomainError(err);
    const ctx = await this.workoutOfEntry(entryId);
    await this.mutate(async () => {
      await this.db.run('UPDATE entries SET rest_mode = ?, rest_seconds = ? WHERE id = ?', [mode, mode === 'duration' ? seconds : null, entryId]);
      await this.enqueue('workout', ctx.workoutId);
    });
  }

  async setDefaultRest(workoutId: string, seconds: number | null): Promise<void> {
    const err = validateRestSeconds(seconds);
    if (err) throw new DomainError(err);
    await this.mutate(async () => {
      await this.db.run('UPDATE workouts SET default_rest_seconds = ? WHERE id = ?', [seconds, workoutId]);
      await this.enqueue('workout', workoutId);
    });
  }

  /** FW-08 / FW-17: change the calendar date (today or earlier). */
  async setWorkoutDate(workoutId: string, date: string): Promise<void> {
    const err = validateWorkoutDate(date, this.today());
    if (err) throw new DomainError(err, 'date');
    await this.mutate(async () => {
      const w = await this.db.first<Row>('SELECT * FROM workouts WHERE id = ? AND deleted = 0', [workoutId]);
      if (!w) throw new DomainError('Workout not found.');
      const backdated = w.state === 'active' ? (date !== this.today() ? 1 : 0) : w.backdated;
      await this.db.run('UPDATE workouts SET workout_date = ?, backdated = ? WHERE id = ?', [date, backdated, workoutId]);
      await this.enqueue('workout', workoutId);
    });
  }

  async finishPreview(workoutId: string): Promise<{ doneWorking: number; pendingPlanned: number; pendingPlannedWork: number; pendingAdhoc: number; emptyEntries: string[] }> {
    const w = await this.getWorkout(workoutId);
    if (!w) throw new DomainError('Workout not found.');
    const ex = await this.exercises();
    let doneWorking = 0, pendingPlanned = 0, pendingPlannedWork = 0, pendingAdhoc = 0;
    const emptyEntries: string[] = [];
    for (const e of w.entries) {
      for (const s of e.sets) {
        if (e.phase === 'work' && s.state === 'done') doneWorking++;
        if (s.state === 'pending') {
          if (s.targetReps != null || s.targetSeconds != null) {
            pendingPlanned++;
            if (e.phase === 'work') pendingPlannedWork++;
          }
          else pendingAdhoc++;
        }
      }
      const kept = e.sets.filter((s) => s.state !== 'pending' || s.targetReps != null || s.targetSeconds != null);
      if (kept.length === 0) emptyEntries.push(ex.get(e.exerciseId)?.name ?? 'Unknown exercise');
    }
    return { doneWorking, pendingPlanned, pendingPlannedWork, pendingAdhoc, emptyEntries };
  }

  /**
   * FW-06 / TR-02: finish. Needs >= 1 completed working set. Planned pending
   * rows become skipped only with explicit confirmation; blank ad hoc rows
   * and entries left without sets are dropped and reported.
   */
  async finishWorkout(workoutId: string, confirmSkipPending: boolean): Promise<{ droppedEntries: string[]; skipped: number; skippedWork: number }> {
    const preview = await this.finishPreview(workoutId);
    if (preview.doneWorking === 0) throw new DomainError('Record at least one working set before finishing, or discard the workout.');
    if (preview.pendingPlanned > 0 && !confirmSkipPending) throw new DomainError('CONFIRM_PENDING');
    await this.mutate(async () => {
      const w = await this.db.first<Row>("SELECT * FROM workouts WHERE id = ? AND state = 'active' AND deleted = 0", [workoutId]);
      if (!w) throw new DomainError('This workout is not in progress.');
      await this.db.run(
        `DELETE FROM sets WHERE state = 'pending' AND target_reps IS NULL AND target_seconds IS NULL AND entry_id IN (SELECT id FROM entries WHERE workout_id = ?)`,
        [workoutId],
      );
      await this.db.run("UPDATE sets SET state = 'skipped' WHERE state = 'pending' AND entry_id IN (SELECT id FROM entries WHERE workout_id = ?)", [workoutId]);
      await this.db.run('DELETE FROM entries WHERE workout_id = ? AND NOT EXISTS (SELECT 1 FROM sets WHERE sets.entry_id = entries.id)', [workoutId]);
      const entries = await this.db.all<{ id: string }>('SELECT id FROM entries WHERE workout_id = ? ORDER BY position', [workoutId]);
      let i = 1;
      for (const e of entries) {
        await this.db.run('UPDATE entries SET position = ? WHERE id = ?', [i++, e.id]);
        await this.renumber(e.id);
      }
      const finished = this.now();
      const duration = w.backdated ? null : Math.max(0, Math.round((finished.getTime() - new Date(w.started_at).getTime()) / 1000));
      await this.db.run("UPDATE workouts SET state = 'finished', finished_at = ?, duration_seconds = ? WHERE id = ?", [finished.toISOString(), duration, workoutId]);
      await this.enqueue('workout', workoutId);
    });
    this.clearUndo();
    return { droppedEntries: preview.emptyEntries, skipped: preview.pendingPlanned, skippedWork: preview.pendingPlannedWork };
  }

  /** FW-01 / FW-07: discard the active workout (tombstone so a synced copy is removed too). */
  async discardWorkout(workoutId: string): Promise<void> {
    await this.mutate(async () => {
      await this.db.run("UPDATE workouts SET deleted = 1 WHERE id = ? AND state = 'active'", [workoutId]);
      await this.enqueue('workout', workoutId);
    });
    this.clearUndo();
  }

  /** FW-18: delete a finished workout after confirmation. No user undo; sync tombstone. */
  async deleteWorkout(workoutId: string): Promise<void> {
    await this.mutate(async () => {
      await this.db.run('UPDATE workouts SET deleted = 1 WHERE id = ?', [workoutId]);
      await this.enqueue('workout', workoutId);
    });
  }

  /**
   * Demo seeding only: write a complete, already-valid finished workout
   * aggregate and its outbox snapshot in one transaction.
   */
  async importFinishedWorkout(snap: Omit<Workout, 'revision'>): Promise<void> {
    if (snap.state !== 'finished') throw new DomainError('Only finished workouts can be imported.');
    if (isFuture(snap.workoutDate, this.today())) throw new DomainError('Future dates cannot be imported.');
    const ex = await this.exercises();
    for (const e of snap.entries)
      for (const s of e.sets) {
        if (s.state !== 'done') continue;
        const type = ex.get(e.exerciseId)?.type;
        if (!type) throw new DomainError('Unknown exercise in import.');
        const v = validateActual(type, { weight: s.weight != null ? String(s.weight) : undefined, unit: s.unit ?? undefined, reps: s.reps != null ? String(s.reps) : undefined, seconds: s.seconds != null ? String(s.seconds) : undefined, rir: s.rir != null ? String(s.rir) : undefined });
        if (!v.ok) throw new DomainError(`Invalid imported set: ${Object.values(v.errors)[0]}`);
      }
    await this.mutate(async () => {
      await this.applyRemoteSnapshot('workout', snap.id, snap, 0);
      for (const e of snap.entries) await this.markUsed(e.exerciseId);
      await this.enqueue('workout', snap.id);
    });
  }

  // ---------- routines ----------
  async listRoutines(): Promise<Routine[]> {
    const rows = await this.db.all<Row>('SELECT * FROM routines WHERE deleted = 0 ORDER BY name COLLATE NOCASE');
    const out: Routine[] = [];
    for (const r of rows) out.push((await this.getRoutine(r.id))!);
    return out;
  }

  async getRoutine(id: string, includeDeleted = false): Promise<Routine | null> {
    const r = await this.db.first<Row>(`SELECT * FROM routines WHERE id = ? ${includeDeleted ? '' : 'AND deleted = 0'}`, [id]);
    if (!r) return null;
    const entries = await this.db.all<Row>('SELECT * FROM routine_entries WHERE routine_id = ? ORDER BY position', [id]);
    return {
      id: r.id, name: r.name, normalizedName: r.normalized_name, defaultRestSeconds: r.default_rest_seconds, revision: r.revision, updatedAt: r.updated_at,
      entries: entries.map((e) => ({
        id: e.id, routineId: e.routine_id, exerciseId: e.exercise_id, position: e.position, phase: e.phase, targetSets: e.target_sets, targetReps: e.target_reps,
        targetSeconds: e.target_seconds, targetLoad: e.target_load, targetUnit: e.target_unit, targetRirMin: e.target_rir_min, targetRirMax: e.target_rir_max,
        restMode: e.rest_mode, restSeconds: e.rest_seconds,
      })),
    };
  }

  /** FW-25 / FW-27 / TR-01: create or edit a routine. Finished workouts keep their snapshots. */
  async saveRoutine(input: RoutineInput): Promise<string> {
    const nameErr = validateName(input.name, 'Routine name');
    if (nameErr) throw new DomainError(nameErr, 'name');
    const restErr = validateRestSeconds(input.defaultRestSeconds);
    if (restErr) throw new DomainError(restErr, 'rest');
    if (input.entries.length === 0) throw new DomainError('Add at least one exercise.');
    const ex = await this.exercises();
    const existing = input.id ? await this.getRoutine(input.id) : null;
    const previouslyIncluded = new Set(existing?.entries.map((e) => e.exerciseId) ?? []);
    input.entries.forEach((e, i) => {
      const exercise = ex.get(e.exerciseId);
      if (!exercise) throw new DomainError(`Exercise ${i + 1} no longer exists.`);
      if (exercise.archived && !previouslyIncluded.has(e.exerciseId)) throw new DomainError(`${exercise.name} is archived. Restore it before adding it.`);
      const err = validateTargets(exercise.type, e);
      if (err) throw new DomainError(`${exercise.name}: ${err}`);
    });
    const id = input.id ?? this.deps.uuid();
    const name = input.name.trim();
    const norm = name.toLocaleLowerCase('en-US');
    await this.mutate(async () => {
      const clash = await this.db.first<Row>('SELECT name FROM routines WHERE normalized_name = ? AND deleted = 0 AND id <> ?', [norm, id]);
      if (clash) throw new DomainError(`A routine named “${clash.name}” already exists.`, 'name');
      if (input.id) {
        await this.db.run('UPDATE routines SET name = ?, normalized_name = ?, default_rest_seconds = ?, updated_at = ? WHERE id = ? AND deleted = 0', [name, norm, input.defaultRestSeconds, this.nowIso(), id]);
        await this.db.run('DELETE FROM routine_entries WHERE routine_id = ?', [id]);
      } else {
        await this.db.run('INSERT INTO routines (id, name, normalized_name, default_rest_seconds, updated_at) VALUES (?,?,?,?,?)', [id, name, norm, input.defaultRestSeconds, this.nowIso()]);
      }
      let pos = 1;
      for (const e of input.entries) {
        await this.db.run(
          `INSERT INTO routine_entries (id, routine_id, exercise_id, position, phase, target_sets, target_reps, target_seconds, target_load, target_unit, target_rir_min, target_rir_max, rest_mode, rest_seconds)
           VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
          [this.deps.uuid(), id, e.exerciseId, pos++, e.phase, e.targetSets, e.targetReps, e.targetSeconds, e.targetLoad, e.targetLoad != null ? e.targetUnit : null,
            e.targetRirMin, e.targetRirMax, e.restMode, e.restMode === 'duration' ? e.restSeconds : null],
        );
      }
      await this.enqueue('routine', id);
    });
    return id;
  }

  async deleteRoutine(id: string): Promise<void> {
    await this.mutate(async () => {
      await this.db.run('UPDATE routines SET deleted = 1 WHERE id = ?', [id]);
      await this.enqueue('routine', id);
    });
  }

  /** FW-25: a reviewable routine draft from a finished workout. Actuals become targets only by explicit choice. */
  async routineDraftFromWorkout(workoutId: string, copyActuals: boolean): Promise<RoutineInput> {
    const w = await this.getWorkout(workoutId);
    if (!w) throw new DomainError('Workout not found.');
    const ex = await this.exercises();
    const entries: RoutineInput['entries'] = [];
    for (const e of w.entries) {
      if (e.phase !== 'work') continue;
      const done = e.sets.filter((s) => s.state === 'done');
      if (!done.length) continue;
      const exercise = ex.get(e.exerciseId);
      const last = done[done.length - 1];
      entries.push({
        exerciseId: e.exerciseId, phase: 'work',
        targetSets: copyActuals ? done.length : null,
        targetReps: copyActuals && exercise?.type !== 'seconds' ? last.reps : null,
        targetSeconds: copyActuals && exercise?.type === 'seconds' ? last.seconds : null,
        targetLoad: copyActuals && exercise?.type === 'weight_reps' ? last.weight : null,
        targetUnit: copyActuals && exercise?.type === 'weight_reps' ? last.unit : null,
        targetRirMin: null, targetRirMax: null,
        restMode: e.restMode, restSeconds: e.restSeconds,
      });
    }
    return { name: w.routineName ? `${w.routineName} copy` : 'My routine', defaultRestSeconds: w.defaultRestSeconds, entries };
  }

  // ---------- settings ----------
  async getSettings(): Promise<Settings> {
    const r = (await this.db.first<Row>('SELECT * FROM settings WHERE id = 1'))!;
    return { unit: r.unit, unitChosen: bool(r.unit_chosen), showEquivalent: bool(r.show_equivalent), textScale: r.text_scale, revision: r.revision };
  }

  async updateSettings(patch: Partial<Pick<Settings, 'unit' | 'showEquivalent' | 'textScale' | 'unitChosen'>>): Promise<void> {
    if (patch.textScale != null && (patch.textScale < 1 || patch.textScale > 2)) throw new DomainError('Text size must be between 100% and 200%.');
    await this.mutate(async () => {
      const s = await this.getSettings();
      await this.db.run('UPDATE settings SET unit = ?, unit_chosen = ?, show_equivalent = ?, text_scale = ? WHERE id = 1', [
        patch.unit ?? s.unit, (patch.unitChosen ?? s.unitChosen) ? 1 : 0, (patch.showEquivalent ?? s.showEquivalent) ? 1 : 0, patch.textScale ?? s.textScale,
      ]);
      await this.enqueue('settings', this.singletonId('settings'));
    });
  }

  async getReminder(): Promise<ReminderPreference> {
    const r = (await this.db.first<Row>('SELECT * FROM reminder WHERE id = 1'))!;
    return { enabled: bool(r.enabled), weekdays: json<number[]>(r.weekdays, []), time: r.time, revision: r.revision };
  }

  async updateReminder(p: { enabled: boolean; weekdays: number[]; time: string }): Promise<void> {
    const err = validateReminder(p.weekdays, p.time);
    if (err) throw new DomainError(err);
    await this.mutate(async () => {
      await this.db.run('UPDATE reminder SET enabled = ?, weekdays = ?, time = ? WHERE id = 1', [p.enabled ? 1 : 0, JSON.stringify([...new Set(p.weekdays)].sort()), p.time]);
      await this.enqueue('reminder', this.singletonId('reminder'));
    });
  }

  // ---------- goals ----------
  async listGoals(): Promise<LiftGoal[]> {
    const rows = await this.db.all<Row>('SELECT * FROM goals WHERE deleted = 0 ORDER BY created_at');
    return rows.map((r) => ({ id: r.id, exerciseId: r.exercise_id, targetLoad: r.target_load, unit: r.unit, minReps: r.min_reps, deadline: r.deadline, revision: r.revision, createdAt: r.created_at }));
  }

  async saveGoal(input: { id?: string; exerciseId: string; targetLoad: number; unit: Unit; minReps: number; deadline: string | null }): Promise<string> {
    const err = validateGoal(input.targetLoad, input.minReps, input.deadline);
    if (err) throw new DomainError(err);
    const ex = await this.getExercise(input.exerciseId);
    if (!ex) throw new DomainError('Choose an exercise.');
    if (ex.type !== 'weight_reps') throw new DomainError('Goals apply to weight-and-reps exercises.');
    const id = input.id ?? this.deps.uuid();
    await this.mutate(async () => {
      if (input.id) await this.db.run('UPDATE goals SET exercise_id = ?, target_load = ?, unit = ?, min_reps = ?, deadline = ? WHERE id = ?', [input.exerciseId, input.targetLoad, input.unit, input.minReps, input.deadline, id]);
      else await this.db.run('INSERT INTO goals (id, exercise_id, target_load, unit, min_reps, deadline, created_at) VALUES (?,?,?,?,?,?,?)', [id, input.exerciseId, input.targetLoad, input.unit, input.minReps, input.deadline, this.nowIso()]);
      await this.enqueue('goal', id);
    });
    return id;
  }

  async deleteGoal(id: string): Promise<void> {
    await this.mutate(async () => {
      await this.db.run('UPDATE goals SET deleted = 1 WHERE id = ?', [id]);
      await this.enqueue('goal', id);
    });
  }

  // ---------- bodyweight ----------
  async listBodyweight(): Promise<BodyweightReading[]> {
    const rows = await this.db.all<Row>('SELECT * FROM bodyweight WHERE deleted = 0 ORDER BY reading_date, entered_at');
    return rows.map((r) => ({ id: r.id, readingDate: r.reading_date, enteredAt: r.entered_at, weight: r.weight, unit: r.unit, revision: r.revision }));
  }

  async saveBodyweight(input: { id?: string; readingDate: string; weight: number; unit: Unit }): Promise<string> {
    const err = validateBodyweight(input.weight, input.readingDate, this.today());
    if (err) throw new DomainError(err);
    const id = input.id ?? this.deps.uuid();
    await this.mutate(async () => {
      if (input.id) await this.db.run('UPDATE bodyweight SET reading_date = ?, weight = ?, unit = ? WHERE id = ?', [input.readingDate, input.weight, input.unit, id]);
      else await this.db.run('INSERT INTO bodyweight (id, reading_date, entered_at, weight, unit) VALUES (?,?,?,?,?)', [id, input.readingDate, this.nowIso(), input.weight, input.unit]);
      await this.enqueue('bodyweight', id);
    });
    return id;
  }

  async deleteBodyweight(id: string): Promise<void> {
    await this.mutate(async () => {
      await this.db.run('UPDATE bodyweight SET deleted = 1 WHERE id = ?', [id]);
      await this.enqueue('bodyweight', id);
    });
  }

  async getBodyweightTarget(): Promise<BodyweightTarget | null> {
    const r = await this.db.first<Row>('SELECT * FROM bodyweight_target WHERE id = 1');
    if (!r || r.deleted) return null;
    return { weight: r.weight, unit: r.unit, targetDate: r.target_date, revision: r.revision };
  }

  async saveBodyweightTarget(t: { weight: number; unit: Unit; targetDate: string | null } | null): Promise<void> {
    if (t) {
      const err = validateBodyweight(t.weight, this.today(), this.today());
      if (err) throw new DomainError(err);
      if (t.targetDate && !isFuture(t.targetDate, this.today()) && t.targetDate !== this.today()) throw new DomainError('Target date should be today or later.');
    }
    await this.mutate(async () => {
      if (t) await this.db.run('UPDATE bodyweight_target SET weight = ?, unit = ?, target_date = ?, deleted = 0 WHERE id = 1', [t.weight, t.unit, t.targetDate]);
      else await this.db.run('UPDATE bodyweight_target SET deleted = 1 WHERE id = 1');
      await this.enqueue('bodyweight_target', this.singletonId('bodyweight_target'));
    });
  }

  // ---------- device-local state (never synced) ----------
  async getDeviceState<T>(key: string): Promise<T | null> {
    const r = await this.db.first<{ value: string }>('SELECT value FROM device_state WHERE key = ?', [key]);
    return r ? json<T | null>(r.value, null) : null;
  }

  async setDeviceState(key: string, value: unknown): Promise<void> {
    if (value == null) await this.db.run('DELETE FROM device_state WHERE key = ?', [key]);
    else await this.db.run('INSERT OR REPLACE INTO device_state (key, value) VALUES (?, ?)', [key, JSON.stringify(value)]);
  }

  // ---------- sync store ----------
  private mapOp(r: Row): OutboxOp {
    return {
      seq: r.seq, operationId: r.operation_id, kind: r.kind, aggregateId: r.aggregate_id, baseRevision: r.base_revision, payload: r.payload,
      payloadHash: r.payload_hash, timezone: r.timezone, schemaVersion: r.schema_version, attempts: r.attempts, status: r.status, lastError: r.last_error,
    };
  }

  async pendingOps(): Promise<OutboxOp[]> {
    return (await this.db.all<Row>('SELECT * FROM outbox ORDER BY seq')).map((r) => this.mapOp(r));
  }

  async outboxCounts(): Promise<{ pending: number; blocked: number; conflicts: number }> {
    const r = await this.db.first<Row>("SELECT SUM(status = 'pending') AS p, SUM(status = 'blocked') AS b FROM outbox");
    const c = await this.db.first<Row>('SELECT COUNT(*) AS n FROM conflicts');
    return { pending: r?.p ?? 0, blocked: r?.b ?? 0, conflicts: c?.n ?? 0 };
  }

  async isAggregatePending(id: string): Promise<boolean> {
    return !!(await this.db.first('SELECT seq FROM outbox WHERE aggregate_id = ? LIMIT 1', [id]));
  }

  /**
   * Next operation to send: lowest sequence among non-blocked aggregates,
   * honoring kind priority so referenced exercises upload first. Operations
   * that were never attempted and are superseded by a later snapshot of the
   * same aggregate are squashed (they were never sent, so no receipt exists).
   */
  async nextReadyOp(skip: Set<string> = new Set()): Promise<OutboxOp | null> {
    const rows = await this.db.all<Row>("SELECT * FROM outbox WHERE status = 'pending' ORDER BY seq");
    const firstPerAgg = new Map<string, Row>();
    for (const r of rows) if (!firstPerAgg.has(r.aggregate_id) && !skip.has(r.aggregate_id)) firstPerAgg.set(r.aggregate_id, r);
    const candidates = [...firstPerAgg.values()].sort((a, b) => KIND_PRIORITY[a.kind as AggregateKind] - KIND_PRIORITY[b.kind as AggregateKind] || a.seq - b.seq);
    const head = candidates[0];
    if (!head) return null;
    if (head.attempts === 0) {
      const later = await this.db.first<Row>('SELECT * FROM outbox WHERE aggregate_id = ? AND seq > ? ORDER BY seq DESC LIMIT 1', [head.aggregate_id, head.seq]);
      if (later) {
        await this.db.tx(async () => {
          await this.db.run('DELETE FROM outbox WHERE aggregate_id = ? AND seq < ? AND attempts = 0', [head.aggregate_id, later.seq]);
        });
        const remaining = await this.db.first<Row>('SELECT * FROM outbox WHERE aggregate_id = ? ORDER BY seq LIMIT 1', [head.aggregate_id]);
        return remaining ? this.mapOp(remaining) : null;
      }
    }
    return this.mapOp(head);
  }

  async markAttempt(seq: number, error: string | null): Promise<void> {
    await this.db.run('UPDATE outbox SET attempts = attempts + 1, last_error = ? WHERE seq = ?', [error, seq]);
  }

  /** Receipt: drop the op, record the server revision and rebase later ops. Never overwrite newer local edits. */
  async ack(op: OutboxOp, revision: number): Promise<void> {
    await this.db.tx(async () => {
      await this.db.run('DELETE FROM outbox WHERE seq = ?', [op.seq]);
      await this.setLocalRevision(op.kind, op.aggregateId, revision);
      await this.db.run('UPDATE outbox SET base_revision = ? WHERE aggregate_id = ?', [revision, op.aggregateId]);
      const deleted = JSON.parse(op.payload)?.deleted === true;
      if (deleted && !(await this.isAggregatePending(op.aggregateId))) await this.purgeTombstoned(op.kind, op.aggregateId);
    });
    this.changed();
  }

  private async setLocalRevision(kind: AggregateKind, id: string, revision: number) {
    const map: Record<AggregateKind, [string, any]> = {
      exercise: ['exercises', id], routine: ['routines', id], workout: ['workouts', id], goal: ['goals', id], bodyweight: ['bodyweight', id],
      settings: ['settings', 1], reminder: ['reminder', 1], bodyweight_target: ['bodyweight_target', 1],
    };
    const [table, key] = map[kind];
    await this.db.run(`UPDATE ${table} SET revision = ? WHERE id = ?`, [revision, key]);
  }

  private async purgeTombstoned(kind: AggregateKind, id: string) {
    // Keep tombstoned rows (deleted = 1) so stale pulls cannot resurrect them; nothing else to purge locally.
    void kind;
    void id;
  }

  /** Preserve both versions; block only this aggregate's later operations. */
  async preserveConflict(op: OutboxOp, remote: any | null, remoteRevision: number, reason: string): Promise<void> {
    await this.db.tx(async () => {
      const latest = await this.db.first<Row>('SELECT payload FROM outbox WHERE aggregate_id = ? ORDER BY seq DESC LIMIT 1', [op.aggregateId]);
      await this.db.run(
        'INSERT OR REPLACE INTO conflicts (id, kind, aggregate_id, local_snapshot, remote_snapshot, remote_revision, reason, created_at) VALUES (?,?,?,?,?,?,?,?)',
        [this.deps.uuid(), op.kind, op.aggregateId, latest?.payload ?? op.payload, remote == null ? null : JSON.stringify(remote), remoteRevision, reason, this.nowIso()],
      );
      await this.db.run("UPDATE outbox SET status = 'blocked' WHERE aggregate_id = ?", [op.aggregateId]);
    });
    this.changed();
  }

  async listConflicts(): Promise<ConflictRecord[]> {
    const rows = await this.db.all<Row>('SELECT * FROM conflicts ORDER BY created_at');
    return rows.map((r) => ({ id: r.id, kind: r.kind, aggregateId: r.aggregate_id, localSnapshot: json(r.local_snapshot, null), remoteSnapshot: json(r.remote_snapshot, null), remoteRevision: r.remote_revision, reason: r.reason, createdAt: r.created_at }));
  }

  /**
   * Explicit resolution:
   *  - keep_remote: apply the cloud version locally and drop local pending ops.
   *  - keep_local: rebase local ops on the remote revision (non-workout records), so they overwrite after review.
   *  - copy_local: (workouts) keep the cloud version intact and save the local one as a new workout UUID.
   */
  async resolveConflict(aggregateId: string, choice: 'keep_remote' | 'keep_local' | 'copy_local' | 'retry' | 'drop_upload'): Promise<void> {
    const c = (await this.listConflicts()).find((x) => x.aggregateId === aggregateId);
    if (!c) throw new DomainError('Conflict not found.');
    if (choice === 'retry' || choice === 'drop_upload') {
      // retry: unblock after the user fixed the cause (e.g. renamed, or finished the other device's workout).
      // drop_upload: keep the record on this device but stop trying to upload these operations.
      await this.db.tx(async () => {
        if (choice === 'retry') await this.db.run("UPDATE outbox SET status = 'pending' WHERE aggregate_id = ?", [aggregateId]);
        else await this.db.run('DELETE FROM outbox WHERE aggregate_id = ?', [aggregateId]);
        await this.db.run('DELETE FROM conflicts WHERE aggregate_id = ?', [aggregateId]);
      });
      this.changed();
      return;
    }
    if (choice === 'copy_local' && c.kind !== 'workout') throw new DomainError('Copies are available for workouts only.');
    if (choice === 'keep_local' && c.kind === 'workout') throw new DomainError('For workouts, keep the cloud version or save yours as a copy.');
    if (choice === 'copy_local' && c.localSnapshot?.state === 'active' && c.remoteSnapshot?.state === 'active')
      throw new DomainError('Both versions are in progress. Finish or discard the cloud workout on the other device first, or keep the cloud version.');
    await this.db.tx(async () => {
      if (choice === 'keep_local') {
        await this.db.run("UPDATE outbox SET status = 'pending', base_revision = ? WHERE aggregate_id = ?", [c.remoteRevision, aggregateId]);
        await this.setLocalRevision(c.kind, aggregateId, c.remoteRevision);
      } else {
        await this.db.run('DELETE FROM outbox WHERE aggregate_id = ?', [aggregateId]);
        await this.applyRemoteSnapshot(c.kind, aggregateId, c.remoteSnapshot, c.remoteRevision);
        if (choice === 'copy_local' && c.localSnapshot && !c.localSnapshot.deleted) {
          const copy = this.recloneWorkout(c.localSnapshot);
          await this.applyRemoteSnapshot('workout', copy.id, copy, 0);
          await this.enqueue('workout', copy.id);
        }
      }
      await this.db.run('DELETE FROM conflicts WHERE aggregate_id = ?', [aggregateId]);
    });
    this.changed();
  }

  private recloneWorkout(snap: any): any {
    return {
      ...snap,
      id: this.deps.uuid(),
      entries: (snap.entries ?? []).map((e: any) => {
        const entryId = this.deps.uuid();
        return { ...e, id: entryId, sets: (e.sets ?? []).map((s: any) => ({ ...s, id: this.deps.uuid(), entryId })) };
      }),
    };
  }

  /** Discard everything not yet uploaded (explicit, warned action before sign-out). */
  async discardUnsynced(): Promise<void> {
    await this.db.tx(async () => {
      await this.db.run('DELETE FROM outbox');
      await this.db.run('DELETE FROM conflicts');
    });
    this.changed();
  }

  async getCursor(): Promise<number> {
    const r = await this.db.first<{ value: string }>("SELECT value FROM meta WHERE key = 'sync_cursor'");
    return r ? Number(r.value) : 0;
  }

  /** Apply a pulled page and advance the checkpoint in one transaction. Dirty aggregates are left for push-time conflict detection. */
  async applyPulledPage(events: ChangeEvent[], nextCursor: number): Promise<number> {
    let applied = 0;
    await this.db.tx(async () => {
      for (const ev of events) {
        if (await this.isAggregatePending(ev.aggregateId)) continue;
        if (await this.db.first('SELECT id FROM conflicts WHERE aggregate_id = ?', [ev.aggregateId])) continue;
        const local = await this.revisionOf(ev.kind, ev.aggregateId);
        if (ev.revision <= local) continue;
        await this.applyRemoteSnapshot(ev.kind, ev.aggregateId, ev.snapshot, ev.revision);
        applied++;
      }
      await this.db.run("INSERT OR REPLACE INTO meta (key, value) VALUES ('sync_cursor', ?)", [String(nextCursor)]);
    });
    if (applied) this.changed();
    return applied;
  }

  /** Write a server snapshot into local tables (inside a transaction). */
  async applyRemoteSnapshot(kind: AggregateKind, id: string, snap: any | null, revision: number): Promise<void> {
    const deleted = snap == null || snap.deleted === true;
    switch (kind) {
      case 'workout': {
        if (deleted) {
          await this.db.run('UPDATE workouts SET deleted = 1, revision = ? WHERE id = ?', [revision, id]);
          return;
        }
        if (snap.state === 'active') {
          // Respect local one-active rule: a remote active workout cannot displace a different local active one.
          const other = await this.db.first<Row>("SELECT id FROM workouts WHERE state = 'active' AND deleted = 0 AND id <> ?", [id]);
          if (other) return;
        }
        await this.db.run('DELETE FROM entries WHERE workout_id = ?', [id]);
        await this.db.run(
          `INSERT INTO workouts (id, workout_date, state, started_at, finished_at, duration_seconds, routine_id, routine_name, default_rest_seconds, backdated, revision, deleted)
           VALUES (?,?,?,?,?,?,?,?,?,?,?,0)
           ON CONFLICT(id) DO UPDATE SET workout_date = excluded.workout_date, state = excluded.state, started_at = excluded.started_at, finished_at = excluded.finished_at,
             duration_seconds = excluded.duration_seconds, routine_id = excluded.routine_id, routine_name = excluded.routine_name,
             default_rest_seconds = excluded.default_rest_seconds, backdated = excluded.backdated, revision = excluded.revision, deleted = 0`,
          [id, snap.workoutDate, snap.state, snap.startedAt, snap.finishedAt ?? null, snap.durationSeconds ?? null, snap.routineId ?? null, snap.routineName ?? null,
            snap.defaultRestSeconds ?? null, snap.backdated ? 1 : 0, revision],
        );
        for (const e of snap.entries ?? []) {
          await this.ensureExerciseStub(e.exerciseId);
          await this.db.run('INSERT INTO entries (id, workout_id, exercise_id, position, phase, rest_mode, rest_seconds) VALUES (?,?,?,?,?,?,?)', [e.id, id, e.exerciseId, e.position, e.phase, e.restMode ?? 'inherit', e.restSeconds ?? null]);
          for (const s of e.sets ?? []) await this.insertSet(e.id, s.position, s);
          if ((e.sets ?? []).some((s: any) => s.state === 'done')) await this.db.run('UPDATE exercises SET ever_used = 1 WHERE id = ?', [e.exerciseId]);
        }
        return;
      }
      case 'exercise': {
        if (deleted) {
          await this.db.run('UPDATE exercises SET archived = 2, revision = ? WHERE id = ? AND owner_id IS NOT NULL', [revision, id]);
          return;
        }
        await this.db.run(
          `INSERT INTO exercises (id, owner_id, name, normalized_name, type, category, equipment, primary_muscles, secondary_muscles, instructions, archived, revision)
           VALUES (?,?,?,?,?,'custom',?,?,?,?,?,?)
           ON CONFLICT(id) DO UPDATE SET name = excluded.name, normalized_name = excluded.normalized_name, type = excluded.type, equipment = excluded.equipment,
             primary_muscles = excluded.primary_muscles, secondary_muscles = excluded.secondary_muscles, archived = excluded.archived, revision = excluded.revision, owner_id = excluded.owner_id`,
          [id, this.ownerId, snap.name, normalizeName(snap.name), snap.type, snap.equipment ?? 'unknown', JSON.stringify(snap.primaryMuscles ?? []), JSON.stringify(snap.secondaryMuscles ?? []), snap.instructions ?? '', snap.archived ? 1 : 0, revision],
        );
        return;
      }
      case 'routine': {
        if (deleted) {
          await this.db.run('UPDATE routines SET deleted = 1, revision = ? WHERE id = ?', [revision, id]);
          return;
        }
        await this.db.run('DELETE FROM routine_entries WHERE routine_id = ?', [id]);
        await this.db.run(
          `INSERT INTO routines (id, name, normalized_name, default_rest_seconds, revision, updated_at, deleted) VALUES (?,?,?,?,?,?,0)
           ON CONFLICT(id) DO UPDATE SET name = excluded.name, normalized_name = excluded.normalized_name, default_rest_seconds = excluded.default_rest_seconds,
             revision = excluded.revision, updated_at = excluded.updated_at, deleted = 0`,
          [id, snap.name, String(snap.name).toLocaleLowerCase('en-US'), snap.defaultRestSeconds ?? null, revision, this.nowIso()],
        );
        for (const e of snap.entries ?? []) {
          await this.ensureExerciseStub(e.exerciseId);
          await this.db.run(
            `INSERT INTO routine_entries (id, routine_id, exercise_id, position, phase, target_sets, target_reps, target_seconds, target_load, target_unit, target_rir_min, target_rir_max, rest_mode, rest_seconds)
             VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
            [e.id ?? this.deps.uuid(), id, e.exerciseId, e.position, e.phase ?? 'work', e.targetSets ?? null, e.targetReps ?? null, e.targetSeconds ?? null, e.targetLoad ?? null, e.targetUnit ?? null, e.targetRirMin ?? null, e.targetRirMax ?? null, e.restMode ?? 'inherit', e.restSeconds ?? null],
          );
        }
        return;
      }
      case 'settings':
        if (!deleted) await this.db.run('UPDATE settings SET unit = ?, unit_chosen = ?, show_equivalent = ?, text_scale = ?, revision = ? WHERE id = 1', [snap.unit, snap.unitChosen ? 1 : 0, snap.showEquivalent ? 1 : 0, snap.textScale, revision]);
        return;
      case 'reminder':
        if (!deleted) await this.db.run('UPDATE reminder SET enabled = ?, weekdays = ?, time = ?, revision = ? WHERE id = 1', [snap.enabled ? 1 : 0, JSON.stringify(snap.weekdays ?? []), snap.time, revision]);
        return;
      case 'goal':
        if (deleted) await this.db.run('UPDATE goals SET deleted = 1, revision = ? WHERE id = ?', [revision, id]);
        else {
          await this.ensureExerciseStub(snap.exerciseId);
          await this.db.run(
            `INSERT INTO goals (id, exercise_id, target_load, unit, min_reps, deadline, created_at, revision, deleted) VALUES (?,?,?,?,?,?,?,?,0)
             ON CONFLICT(id) DO UPDATE SET exercise_id = excluded.exercise_id, target_load = excluded.target_load, unit = excluded.unit, min_reps = excluded.min_reps, deadline = excluded.deadline, revision = excluded.revision, deleted = 0`,
            [id, snap.exerciseId, snap.targetLoad, snap.unit, snap.minReps, snap.deadline ?? null, snap.createdAt ?? this.nowIso(), revision],
          );
        }
        return;
      case 'bodyweight':
        if (deleted) await this.db.run('UPDATE bodyweight SET deleted = 1, revision = ? WHERE id = ?', [revision, id]);
        else
          await this.db.run(
            `INSERT INTO bodyweight (id, reading_date, entered_at, weight, unit, revision, deleted) VALUES (?,?,?,?,?,?,0)
             ON CONFLICT(id) DO UPDATE SET reading_date = excluded.reading_date, weight = excluded.weight, unit = excluded.unit, revision = excluded.revision, deleted = 0`,
            [id, snap.readingDate, snap.enteredAt ?? this.nowIso(), snap.weight, snap.unit, revision],
          );
        return;
      case 'bodyweight_target':
        if (deleted) await this.db.run('UPDATE bodyweight_target SET deleted = 1, revision = ? WHERE id = 1', [revision]);
        else await this.db.run('UPDATE bodyweight_target SET weight = ?, unit = ?, target_date = ?, deleted = 0, revision = ? WHERE id = 1', [snap.weight, snap.unit, snap.targetDate ?? null, revision]);
        return;
    }
  }

  /** A pulled record may reference a custom exercise that arrives later in the same page. */
  private async ensureExerciseStub(exerciseId: string) {
    const r = await this.db.first('SELECT id FROM exercises WHERE id = ?', [exerciseId]);
    if (!r) {
      await this.db.run(
        "INSERT INTO exercises (id, owner_id, name, normalized_name, type, category) VALUES (?, ?, ?, ?, 'weight_reps', 'custom')",
        [exerciseId, this.ownerId, 'Syncing exercise…', `__stub_${exerciseId}`],
      );
    }
  }

  /** Counts for the profile and export pending-sync indicator. */
  async hasUnsyncedWork(): Promise<boolean> {
    const c = await this.outboxCounts();
    return c.pending + c.blocked + c.conflicts > 0;
  }
}
