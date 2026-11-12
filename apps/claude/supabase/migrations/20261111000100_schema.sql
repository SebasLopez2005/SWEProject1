-- Repwise (Claude implementation) hosted schema.
-- Owner-scoped normalized tables, default-deny RLS for direct reads, no direct
-- client writes, and two narrow RPCs: apply_mutation and pull_changes.

create extension if not exists pgcrypto;

-- ---------- shared catalog ----------
create table public.catalog_exercises (
  id uuid primary key,
  name text not null,
  exercise_type text not null check (exercise_type in ('weight_reps', 'reps', 'seconds')),
  source_id text not null
);

-- ---------- owner records ----------
create table public.custom_exercises (
  id uuid primary key,
  owner_id uuid not null references auth.users (id) on delete cascade,
  name text not null check (char_length(btrim(name)) between 1 and 60),
  normalized_name text not null,
  exercise_type text not null check (exercise_type in ('weight_reps', 'reps', 'seconds')),
  equipment text not null default 'unknown',
  primary_muscles jsonb not null default '[]',
  secondary_muscles jsonb not null default '[]',
  instructions text not null default '',
  archived boolean not null default false,
  ever_used boolean not null default false,
  revision int not null default 1,
  deleted_at timestamptz
);
create unique index ux_custom_ex_name on public.custom_exercises (owner_id, normalized_name) where deleted_at is null;

create table public.routines (
  id uuid primary key,
  owner_id uuid not null references auth.users (id) on delete cascade,
  name text not null check (char_length(btrim(name)) between 1 and 60),
  normalized_name text not null,
  default_rest_seconds int check (default_rest_seconds between 5 and 1800),
  revision int not null default 1,
  deleted_at timestamptz
);
create unique index ux_routine_name on public.routines (owner_id, normalized_name) where deleted_at is null;

create table public.routine_entries (
  id uuid primary key,
  routine_id uuid not null references public.routines (id) on delete cascade,
  exercise_id uuid not null,
  position int not null,
  phase text not null check (phase in ('warmup', 'work', 'mobility')),
  target_sets int check (target_sets between 1 and 20),
  target_reps int check (target_reps between 1 and 999),
  target_seconds int check (target_seconds >= 1),
  target_load numeric(5, 1) check (target_load between 0 and 999.9),
  target_unit text check (target_unit in ('kg', 'lb')),
  target_rir_min int check (target_rir_min between 0 and 10),
  target_rir_max int check (target_rir_max between 0 and 10),
  rest_mode text not null default 'inherit' check (rest_mode in ('inherit', 'duration', 'off')),
  rest_seconds int check (rest_seconds between 5 and 1800),
  check (target_rir_min is null or target_rir_max is null or target_rir_min <= target_rir_max)
);
create index ix_routine_entries on public.routine_entries (routine_id, position);

create table public.workouts (
  id uuid primary key,
  owner_id uuid not null references auth.users (id) on delete cascade,
  workout_date date not null,
  state text not null check (state in ('active', 'finished')),
  started_at timestamptz not null,
  finished_at timestamptz,
  duration_seconds int check (duration_seconds >= 0),
  routine_id uuid,
  routine_name text,
  default_rest_seconds int,
  backdated boolean not null default false,
  submitted_timezone text,
  revision int not null default 1,
  deleted_at timestamptz
);
create index ix_workouts_owner_date on public.workouts (owner_id, workout_date desc, id desc);
create unique index ux_one_active_workout on public.workouts (owner_id) where state = 'active' and deleted_at is null;

create table public.workout_entries (
  id uuid primary key,
  workout_id uuid not null references public.workouts (id) on delete cascade,
  exercise_id uuid not null,
  position int not null,
  phase text not null check (phase in ('warmup', 'work', 'mobility')),
  rest_mode text not null default 'inherit' check (rest_mode in ('inherit', 'duration', 'off')),
  rest_seconds int
);
create index ix_entries_workout on public.workout_entries (workout_id, position);
create index ix_entries_exercise on public.workout_entries (exercise_id);

create table public.workout_sets (
  id uuid primary key,
  entry_id uuid not null references public.workout_entries (id) on delete cascade,
  position int not null,
  state text not null check (state in ('pending', 'done', 'skipped')),
  target_reps int, target_seconds int, target_load numeric(5, 1), target_unit text,
  target_rir_min int, target_rir_max int,
  weight numeric(5, 1) check (weight between 0 and 999.9),
  unit text check (unit in ('kg', 'lb')),
  reps int check (reps between 1 and 999),
  seconds int check (seconds >= 1),
  rir int check (rir between 0 and 10),
  completed_at timestamptz,
  -- a pending or skipped row carries no actuals
  check (state = 'done' or (weight is null and reps is null and seconds is null and rir is null))
);
create index ix_sets_entry on public.workout_sets (entry_id, position);

create table public.user_settings (
  owner_id uuid primary key references auth.users (id) on delete cascade,
  unit text not null check (unit in ('kg', 'lb')),
  unit_chosen boolean not null,
  show_equivalent boolean not null,
  text_scale numeric(3, 2) not null check (text_scale between 1 and 2),
  revision int not null default 1
);

create table public.reminder_preferences (
  owner_id uuid primary key references auth.users (id) on delete cascade,
  enabled boolean not null,
  weekdays int[] not null,
  local_time text not null check (local_time ~ '^([01][0-9]|2[0-3]):[0-5][0-9]$'),
  revision int not null default 1
);

create table public.lift_goals (
  id uuid primary key,
  owner_id uuid not null references auth.users (id) on delete cascade,
  exercise_id uuid not null,
  target_load numeric(5, 1) not null check (target_load > 0 and target_load <= 999.9),
  unit text not null check (unit in ('kg', 'lb')),
  min_reps int not null check (min_reps between 1 and 999),
  deadline date,
  created_at timestamptz not null,
  revision int not null default 1,
  deleted_at timestamptz
);

create table public.bodyweight_readings (
  id uuid primary key,
  owner_id uuid not null references auth.users (id) on delete cascade,
  reading_date date not null,
  entered_at timestamptz not null,
  weight numeric(5, 1) not null check (weight > 0 and weight <= 999.9),
  unit text not null check (unit in ('kg', 'lb')),
  revision int not null default 1,
  deleted_at timestamptz
);

create table public.bodyweight_targets (
  owner_id uuid primary key references auth.users (id) on delete cascade,
  weight numeric(5, 1) check (weight > 0 and weight <= 999.9),
  unit text check (unit in ('kg', 'lb')),
  target_date date,
  revision int not null default 1,
  deleted_at timestamptz
);

-- ---------- sync bookkeeping (not client writable) ----------
create table public.aggregate_heads (
  owner_id uuid not null references auth.users (id) on delete cascade,
  kind text not null,
  aggregate_id text not null,
  revision int not null default 0,
  deleted boolean not null default false,
  snapshot jsonb,
  primary key (owner_id, kind, aggregate_id)
);

create table public.mutation_receipts (
  owner_id uuid not null references auth.users (id) on delete cascade,
  operation_id uuid not null,
  payload_hash text not null,
  kind text not null,
  aggregate_id text not null,
  resulting_revision int not null,
  created_at timestamptz not null default now(),
  primary key (owner_id, operation_id)
);

create table public.change_events (
  cursor bigserial primary key,
  owner_id uuid not null references auth.users (id) on delete cascade,
  kind text not null,
  aggregate_id text not null,
  revision int not null,
  snapshot jsonb, -- null = tombstone
  created_at timestamptz not null default now()
);
create index ix_change_events_owner on public.change_events (owner_id, cursor);

-- ---------- privileges: default deny, owner-only reads, no direct writes ----------
alter table public.catalog_exercises enable row level security;
alter table public.custom_exercises enable row level security;
alter table public.routines enable row level security;
alter table public.routine_entries enable row level security;
alter table public.workouts enable row level security;
alter table public.workout_entries enable row level security;
alter table public.workout_sets enable row level security;
alter table public.user_settings enable row level security;
alter table public.reminder_preferences enable row level security;
alter table public.lift_goals enable row level security;
alter table public.bodyweight_readings enable row level security;
alter table public.bodyweight_targets enable row level security;
alter table public.aggregate_heads enable row level security;
alter table public.mutation_receipts enable row level security;
alter table public.change_events enable row level security;

revoke all on all tables in schema public from anon, authenticated;
revoke all on all sequences in schema public from anon, authenticated;
grant select on public.catalog_exercises, public.custom_exercises, public.routines, public.routine_entries, public.workouts,
  public.workout_entries, public.workout_sets, public.user_settings, public.reminder_preferences, public.lift_goals,
  public.bodyweight_readings, public.bodyweight_targets to authenticated;

create policy catalog_read on public.catalog_exercises for select to authenticated using (true);
create policy own_read on public.custom_exercises for select to authenticated using (owner_id = (select auth.uid()));
create policy own_read on public.routines for select to authenticated using (owner_id = (select auth.uid()));
create policy own_read on public.routine_entries for select to authenticated
  using (exists (select 1 from public.routines r where r.id = routine_id and r.owner_id = (select auth.uid())));
create policy own_read on public.workouts for select to authenticated using (owner_id = (select auth.uid()));
create policy own_read on public.workout_entries for select to authenticated
  using (exists (select 1 from public.workouts w where w.id = workout_id and w.owner_id = (select auth.uid())));
create policy own_read on public.workout_sets for select to authenticated
  using (exists (select 1 from public.workout_entries e join public.workouts w on w.id = e.workout_id
                 where e.id = entry_id and w.owner_id = (select auth.uid())));
create policy own_read on public.user_settings for select to authenticated using (owner_id = (select auth.uid()));
create policy own_read on public.reminder_preferences for select to authenticated using (owner_id = (select auth.uid()));
create policy own_read on public.lift_goals for select to authenticated using (owner_id = (select auth.uid()));
create policy own_read on public.bodyweight_readings for select to authenticated using (owner_id = (select auth.uid()));
create policy own_read on public.bodyweight_targets for select to authenticated using (owner_id = (select auth.uid()));
-- aggregate_heads, mutation_receipts and change_events have no client policies at all.
