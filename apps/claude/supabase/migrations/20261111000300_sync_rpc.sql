-- Narrow RPC boundary. apply_mutation validates and atomically writes a whole
-- aggregate, its revision head, a receipt and a change-feed event. Clients can
-- never write tables directly. SECURITY DEFINER with a fixed search_path and an
-- explicit auth.uid() owner check; no owner id is accepted from the client.

create or replace function public._exercise_type(p_owner uuid, p_exercise uuid)
returns text language sql stable security definer set search_path = public, pg_temp as $$
  select coalesce(
    (select exercise_type from public.catalog_exercises where id = p_exercise),
    (select exercise_type from public.custom_exercises where id = p_exercise and owner_id = p_owner and deleted_at is null)
  );
$$;

create or replace function public._invalid(p_msg text) returns void language plpgsql as $$
begin
  raise exception using errcode = 'FW001', message = p_msg;
end $$;

create or replace function public._num(p jsonb, k text) returns numeric language sql immutable as $$
  select case when p ? k and jsonb_typeof(p -> k) = 'number' then (p ->> k)::numeric else null end;
$$;

create or replace function public._int(p jsonb, k text) returns int language plpgsql immutable as $$
declare v numeric := public._num(p, k);
begin
  if v is null then return null; end if;
  if v <> trunc(v) then perform public._invalid(k || ' must be a whole number'); end if;
  return v::int;
end $$;

-- ---------- per-kind writers (internal) ----------
create or replace function public._apply_workout(p_owner uuid, p_id uuid, p jsonb, p_tz text, p_deleted boolean)
returns void language plpgsql security definer set search_path = public, pg_temp as $$
declare
  v_date date;
  v_state text;
  e jsonb;
  s jsonb;
  v_type text;
  v_entry uuid;
  v_phase text;
  v_set_state text;
  v_weight numeric;
  v_unit text;
  v_reps int;
  v_seconds int;
  v_rir int;
  v_done_work int := 0;
begin
  if p_deleted then
    update public.workouts set deleted_at = now() where id = p_id and owner_id = p_owner;
    return;
  end if;
  begin
    v_date := (p ->> 'workoutDate')::date;
  exception when others then
    perform public._invalid('invalid workout date');
  end;
  if v_date is null then perform public._invalid('workout date is required'); end if;
  if v_date > (now() at time zone coalesce(nullif(p_tz, ''), 'UTC'))::date then
    perform public._invalid('future workout dates are not allowed');
  end if;
  v_state := p ->> 'state';
  if v_state not in ('active', 'finished') then perform public._invalid('invalid workout state'); end if;

  insert into public.workouts (id, owner_id, workout_date, state, started_at, finished_at, duration_seconds, routine_id, routine_name,
                               default_rest_seconds, backdated, submitted_timezone, deleted_at)
  values (p_id, p_owner, v_date, v_state, (p ->> 'startedAt')::timestamptz, (p ->> 'finishedAt')::timestamptz, public._int(p, 'durationSeconds'),
          (p ->> 'routineId')::uuid, left(p ->> 'routineName', 60), public._int(p, 'defaultRestSeconds'), coalesce((p ->> 'backdated')::boolean, false), p_tz, null)
  on conflict (id) do update set workout_date = excluded.workout_date, state = excluded.state, started_at = excluded.started_at,
    finished_at = excluded.finished_at, duration_seconds = excluded.duration_seconds, routine_id = excluded.routine_id,
    routine_name = excluded.routine_name, default_rest_seconds = excluded.default_rest_seconds, backdated = excluded.backdated,
    submitted_timezone = excluded.submitted_timezone, deleted_at = null
  where public.workouts.owner_id = p_owner;

  delete from public.workout_entries where workout_id = p_id;
  for e in select * from jsonb_array_elements(coalesce(p -> 'entries', '[]'::jsonb)) loop
    v_type := public._exercise_type(p_owner, (e ->> 'exerciseId')::uuid);
    if v_type is null then
      raise exception using errcode = 'FW002', message = 'missing_reference';
    end if;
    v_phase := e ->> 'phase';
    if v_phase not in ('warmup', 'work', 'mobility') then perform public._invalid('invalid phase'); end if;
    v_entry := (e ->> 'id')::uuid;
    insert into public.workout_entries (id, workout_id, exercise_id, position, phase, rest_mode, rest_seconds)
    values (v_entry, p_id, (e ->> 'exerciseId')::uuid, public._int(e, 'position'), v_phase, coalesce(e ->> 'restMode', 'inherit'), public._int(e, 'restSeconds'));
    for s in select * from jsonb_array_elements(coalesce(e -> 'sets', '[]'::jsonb)) loop
      v_set_state := s ->> 'state';
      v_weight := public._num(s, 'weight');
      v_unit := s ->> 'unit';
      v_reps := public._int(s, 'reps');
      v_seconds := public._int(s, 'seconds');
      v_rir := public._int(s, 'rir');
      if v_set_state = 'done' then
        -- typed actuals: only the fields that apply to the exercise type
        if v_type = 'weight_reps' then
          if v_weight is null or v_unit is null or v_reps is null then perform public._invalid('weighted sets need weight, unit and reps'); end if;
          if v_weight < 0 or v_weight > 999.9 or v_weight * 10 <> trunc(v_weight * 10) then perform public._invalid('weight must be 0 to 999.9 with one decimal'); end if;
          v_seconds := null;
        elsif v_type = 'reps' then
          if v_reps is null then perform public._invalid('reps are required'); end if;
          v_weight := null; v_unit := null; v_seconds := null;
        else
          if v_seconds is null or v_seconds < 1 then perform public._invalid('seconds must be at least 1'); end if;
          v_weight := null; v_unit := null; v_reps := null; v_rir := null;
        end if;
        if v_reps is not null and (v_reps < 1 or v_reps > 999) then perform public._invalid('reps must be 1 to 999'); end if;
        if v_phase = 'work' then v_done_work := v_done_work + 1; end if;
        update public.custom_exercises set ever_used = true where id = (e ->> 'exerciseId')::uuid and owner_id = p_owner;
      elsif v_set_state in ('pending', 'skipped') then
        v_weight := null; v_unit := null; v_reps := null; v_seconds := null; v_rir := null;
        if v_set_state = 'pending' and v_state = 'finished' then perform public._invalid('finished workouts cannot contain pending rows'); end if;
      else
        perform public._invalid('invalid set state');
      end if;
      insert into public.workout_sets (id, entry_id, position, state, target_reps, target_seconds, target_load, target_unit, target_rir_min, target_rir_max,
                                       weight, unit, reps, seconds, rir, completed_at)
      values ((s ->> 'id')::uuid, v_entry, public._int(s, 'position'), v_set_state, public._int(s, 'targetReps'), public._int(s, 'targetSeconds'),
              public._num(s, 'targetLoad'), s ->> 'targetUnit', public._int(s, 'targetRirMin'), public._int(s, 'targetRirMax'),
              v_weight, v_unit, v_reps, v_seconds, v_rir, (s ->> 'completedAt')::timestamptz);
    end loop;
  end loop;
  if v_state = 'finished' and v_done_work = 0 then
    perform public._invalid('a finished workout needs at least one completed working set');
  end if;
end $$;

create or replace function public._apply_exercise(p_owner uuid, p_id uuid, p jsonb, p_deleted boolean)
returns void language plpgsql security definer set search_path = public, pg_temp as $$
declare
  v_existing public.custom_exercises;
  v_name text := btrim(coalesce(p ->> 'name', ''));
  v_norm text;
begin
  if exists (select 1 from public.catalog_exercises where id = p_id) then perform public._invalid('catalog exercises are read-only'); end if;
  select * into v_existing from public.custom_exercises where id = p_id and owner_id = p_owner;
  if p_deleted then
    if v_existing.ever_used then perform public._invalid('used exercises cannot be deleted'); end if;
    update public.custom_exercises set deleted_at = now() where id = p_id and owner_id = p_owner;
    return;
  end if;
  if char_length(v_name) < 1 or char_length(v_name) > 60 then perform public._invalid('name must be 1 to 60 characters'); end if;
  v_norm := lower(regexp_replace(v_name, '\s+', '', 'g'));
  if exists (select 1 from public.catalog_exercises c where lower(regexp_replace(c.name, '\s+', '', 'g')) = v_norm) then
    raise exception using errcode = 'FW003', message = 'name_taken';
  end if;
  if v_existing.id is not null and v_existing.ever_used and v_existing.exercise_type <> (p ->> 'type') then
    raise exception using errcode = 'FW003', message = 'type_locked';
  end if;
  insert into public.custom_exercises (id, owner_id, name, normalized_name, exercise_type, equipment, primary_muscles, secondary_muscles, instructions, archived, deleted_at)
  values (p_id, p_owner, v_name, v_norm, p ->> 'type', coalesce(p ->> 'equipment', 'unknown'), coalesce(p -> 'primaryMuscles', '[]'),
          coalesce(p -> 'secondaryMuscles', '[]'), coalesce(p ->> 'instructions', ''), coalesce((p ->> 'archived')::boolean, false), null)
  on conflict (id) do update set name = excluded.name, normalized_name = excluded.normalized_name, exercise_type = excluded.exercise_type,
    equipment = excluded.equipment, primary_muscles = excluded.primary_muscles, secondary_muscles = excluded.secondary_muscles,
    instructions = excluded.instructions, archived = excluded.archived, deleted_at = null
  where public.custom_exercises.owner_id = p_owner;
end $$;

create or replace function public._apply_routine(p_owner uuid, p_id uuid, p jsonb, p_deleted boolean)
returns void language plpgsql security definer set search_path = public, pg_temp as $$
declare
  v_name text := btrim(coalesce(p ->> 'name', ''));
  e jsonb;
begin
  if p_deleted then
    update public.routines set deleted_at = now() where id = p_id and owner_id = p_owner;
    return;
  end if;
  if char_length(v_name) < 1 or char_length(v_name) > 60 then perform public._invalid('name must be 1 to 60 characters'); end if;
  insert into public.routines (id, owner_id, name, normalized_name, default_rest_seconds, deleted_at)
  values (p_id, p_owner, v_name, lower(v_name), public._int(p, 'defaultRestSeconds'), null)
  on conflict (id) do update set name = excluded.name, normalized_name = excluded.normalized_name,
    default_rest_seconds = excluded.default_rest_seconds, deleted_at = null
  where public.routines.owner_id = p_owner;
  delete from public.routine_entries where routine_id = p_id;
  for e in select * from jsonb_array_elements(coalesce(p -> 'entries', '[]'::jsonb)) loop
    if public._exercise_type(p_owner, (e ->> 'exerciseId')::uuid) is null then
      raise exception using errcode = 'FW002', message = 'missing_reference';
    end if;
    insert into public.routine_entries (id, routine_id, exercise_id, position, phase, target_sets, target_reps, target_seconds, target_load, target_unit,
                                        target_rir_min, target_rir_max, rest_mode, rest_seconds)
    values (coalesce((e ->> 'id')::uuid, gen_random_uuid()), p_id, (e ->> 'exerciseId')::uuid, public._int(e, 'position'), coalesce(e ->> 'phase', 'work'),
            public._int(e, 'targetSets'), public._int(e, 'targetReps'), public._int(e, 'targetSeconds'), public._num(e, 'targetLoad'), e ->> 'targetUnit',
            public._int(e, 'targetRirMin'), public._int(e, 'targetRirMax'), coalesce(e ->> 'restMode', 'inherit'), public._int(e, 'restSeconds'));
  end loop;
end $$;

create or replace function public._apply_misc(p_owner uuid, p_kind text, p_id text, p jsonb, p_deleted boolean)
returns void language plpgsql security definer set search_path = public, pg_temp as $$
begin
  if p_kind = 'settings' then
    insert into public.user_settings (owner_id, unit, unit_chosen, show_equivalent, text_scale)
    values (p_owner, p ->> 'unit', (p ->> 'unitChosen')::boolean, (p ->> 'showEquivalent')::boolean, public._num(p, 'textScale'))
    on conflict (owner_id) do update set unit = excluded.unit, unit_chosen = excluded.unit_chosen, show_equivalent = excluded.show_equivalent, text_scale = excluded.text_scale;
  elsif p_kind = 'reminder' then
    insert into public.reminder_preferences (owner_id, enabled, weekdays, local_time)
    values (p_owner, (p ->> 'enabled')::boolean, array(select jsonb_array_elements_text(p -> 'weekdays')::int), p ->> 'time')
    on conflict (owner_id) do update set enabled = excluded.enabled, weekdays = excluded.weekdays, local_time = excluded.local_time;
  elsif p_kind = 'goal' then
    if p_deleted then
      update public.lift_goals set deleted_at = now() where id = p_id::uuid and owner_id = p_owner;
      return;
    end if;
    if public._exercise_type(p_owner, (p ->> 'exerciseId')::uuid) is distinct from 'weight_reps' then
      if public._exercise_type(p_owner, (p ->> 'exerciseId')::uuid) is null then
        raise exception using errcode = 'FW002', message = 'missing_reference';
      end if;
      perform public._invalid('goals apply to weight-and-reps exercises');
    end if;
    insert into public.lift_goals (id, owner_id, exercise_id, target_load, unit, min_reps, deadline, created_at, deleted_at)
    values (p_id::uuid, p_owner, (p ->> 'exerciseId')::uuid, public._num(p, 'targetLoad'), p ->> 'unit', public._int(p, 'minReps'),
            (p ->> 'deadline')::date, coalesce((p ->> 'createdAt')::timestamptz, now()), null)
    on conflict (id) do update set exercise_id = excluded.exercise_id, target_load = excluded.target_load, unit = excluded.unit,
      min_reps = excluded.min_reps, deadline = excluded.deadline, deleted_at = null
    where public.lift_goals.owner_id = p_owner;
  elsif p_kind = 'bodyweight' then
    if p_deleted then
      update public.bodyweight_readings set deleted_at = now() where id = p_id::uuid and owner_id = p_owner;
      return;
    end if;
    insert into public.bodyweight_readings (id, owner_id, reading_date, entered_at, weight, unit, deleted_at)
    values (p_id::uuid, p_owner, (p ->> 'readingDate')::date, coalesce((p ->> 'enteredAt')::timestamptz, now()), public._num(p, 'weight'), p ->> 'unit', null)
    on conflict (id) do update set reading_date = excluded.reading_date, weight = excluded.weight, unit = excluded.unit, deleted_at = null
    where public.bodyweight_readings.owner_id = p_owner;
  elsif p_kind = 'bodyweight_target' then
    insert into public.bodyweight_targets (owner_id, weight, unit, target_date, deleted_at)
    values (p_owner, case when p_deleted then null else public._num(p, 'weight') end, case when p_deleted then null else p ->> 'unit' end,
            case when p_deleted then null else (p ->> 'targetDate')::date end, case when p_deleted then now() else null end)
    on conflict (owner_id) do update set weight = excluded.weight, unit = excluded.unit, target_date = excluded.target_date, deleted_at = excluded.deleted_at;
  else
    perform public._invalid('unknown aggregate kind');
  end if;
end $$;

-- ---------- public RPCs ----------
create or replace function public.apply_mutation(
  p_operation_id uuid, p_kind text, p_aggregate_id text, p_base_revision int, p_payload jsonb, p_payload_hash text,
  p_timezone text, p_schema_version int
) returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare
  v_owner uuid := auth.uid();
  v_receipt public.mutation_receipts;
  v_head public.aggregate_heads;
  v_deleted boolean := coalesce((p_payload ->> 'deleted')::boolean, false);
  v_rev int;
  v_constraint text;
  v_other jsonb;
begin
  if v_owner is null then
    raise exception using errcode = '28000', message = 'not authenticated';
  end if;
  if p_schema_version is distinct from 1 then
    return jsonb_build_object('status', 'rejected', 'reason', 'unsupported schema version');
  end if;
  if p_kind not in ('workout', 'exercise', 'routine', 'settings', 'reminder', 'goal', 'bodyweight', 'bodyweight_target') then
    return jsonb_build_object('status', 'rejected', 'reason', 'unknown aggregate kind');
  end if;
  if p_kind in ('settings', 'reminder', 'bodyweight_target') and p_aggregate_id <> p_kind || ':' || v_owner::text then
    return jsonb_build_object('status', 'rejected', 'reason', 'singleton id must belong to the signed-in owner');
  end if;

  -- Serialize this owner's mutations so change-feed cursors commit in order.
  perform pg_advisory_xact_lock(hashtextextended(v_owner::text, 0));

  select * into v_receipt from public.mutation_receipts where owner_id = v_owner and operation_id = p_operation_id;
  if found then
    if v_receipt.payload_hash = p_payload_hash and v_receipt.aggregate_id = p_aggregate_id then
      return jsonb_build_object('status', 'applied', 'revision', v_receipt.resulting_revision, 'duplicate', true);
    end if;
    return jsonb_build_object('status', 'rejected', 'reason', 'operation id reused with a different payload');
  end if;

  -- Another owner's record with this id cannot be touched.
  if p_kind in ('workout', 'exercise', 'routine', 'goal', 'bodyweight') and exists (
    select 1 from public.aggregate_heads where kind = p_kind and aggregate_id = p_aggregate_id and owner_id <> v_owner
  ) then
    return jsonb_build_object('status', 'rejected', 'reason', 'forbidden');
  end if;

  insert into public.aggregate_heads (owner_id, kind, aggregate_id) values (v_owner, p_kind, p_aggregate_id) on conflict do nothing;
  select * into v_head from public.aggregate_heads where owner_id = v_owner and kind = p_kind and aggregate_id = p_aggregate_id for update;

  if v_head.revision <> p_base_revision then
    return jsonb_build_object('status', 'conflict', 'reason', 'revision', 'revision', v_head.revision,
                              'remote', case when v_head.deleted then null else v_head.snapshot end);
  end if;

  begin
    if p_kind = 'workout' then
      perform public._apply_workout(v_owner, p_aggregate_id::uuid, p_payload, p_timezone, v_deleted);
    elsif p_kind = 'exercise' then
      perform public._apply_exercise(v_owner, p_aggregate_id::uuid, p_payload, v_deleted);
    elsif p_kind = 'routine' then
      perform public._apply_routine(v_owner, p_aggregate_id::uuid, p_payload, v_deleted);
    else
      perform public._apply_misc(v_owner, p_kind, p_aggregate_id, p_payload, v_deleted);
    end if;

    v_rev := v_head.revision + 1;
    update public.aggregate_heads set revision = v_rev, deleted = v_deleted, snapshot = case when v_deleted then null else p_payload end
    where owner_id = v_owner and kind = p_kind and aggregate_id = p_aggregate_id;
    update public.workouts set revision = v_rev where p_kind = 'workout' and id = p_aggregate_id::uuid and owner_id = v_owner;
    update public.custom_exercises set revision = v_rev where p_kind = 'exercise' and id = p_aggregate_id::uuid and owner_id = v_owner;
    update public.routines set revision = v_rev where p_kind = 'routine' and id = p_aggregate_id::uuid and owner_id = v_owner;
    insert into public.change_events (owner_id, kind, aggregate_id, revision, snapshot)
    values (v_owner, p_kind, p_aggregate_id, v_rev, case when v_deleted then null else p_payload end);
    insert into public.mutation_receipts (owner_id, operation_id, payload_hash, kind, aggregate_id, resulting_revision)
    values (v_owner, p_operation_id, p_payload_hash, p_kind, p_aggregate_id, v_rev);
    return jsonb_build_object('status', 'applied', 'revision', v_rev);
  exception
    when unique_violation then
      get stacked diagnostics v_constraint = constraint_name;
      if v_constraint = 'ux_one_active_workout' then
        select h.snapshot into v_other from public.aggregate_heads h join public.workouts w on w.id::text = h.aggregate_id
        where h.owner_id = v_owner and h.kind = 'workout' and w.owner_id = v_owner and w.state = 'active' and w.deleted_at is null limit 1;
        return jsonb_build_object('status', 'conflict', 'reason', 'active_workout', 'revision', v_head.revision, 'remote', v_other);
      end if;
      return jsonb_build_object('status', 'conflict', 'reason', 'name_taken', 'revision', v_head.revision,
                                'remote', case when v_head.deleted then null else v_head.snapshot end);
    when sqlstate 'FW002' then
      return jsonb_build_object('status', 'retry', 'reason', 'missing_reference');
    when sqlstate 'FW003' then
      return jsonb_build_object('status', 'conflict', 'reason', sqlerrm, 'revision', v_head.revision,
                                'remote', case when v_head.deleted then null else v_head.snapshot end);
    when sqlstate 'FW001' then
      return jsonb_build_object('status', 'rejected', 'reason', sqlerrm);
    when others then
      return jsonb_build_object('status', 'rejected', 'reason', sqlerrm);
  end;
end $$;

create or replace function public.pull_changes(p_since bigint, p_limit int default 200)
returns jsonb language plpgsql stable security definer set search_path = public, pg_temp as $$
declare
  v_owner uuid := auth.uid();
  v_high bigint;
  v_events jsonb;
  v_next bigint;
  v_limit int := least(greatest(coalesce(p_limit, 200), 1), 500);
begin
  if v_owner is null then
    raise exception using errcode = '28000', message = 'not authenticated';
  end if;
  select coalesce(max(cursor), 0) into v_high from public.change_events where owner_id = v_owner;
  with page as (
    select cursor, kind, aggregate_id, revision, snapshot from public.change_events
    where owner_id = v_owner and cursor > coalesce(p_since, 0) and cursor <= v_high
    order by cursor limit v_limit
  )
  select coalesce(jsonb_agg(jsonb_build_object('cursor', cursor, 'kind', kind, 'aggregateId', aggregate_id, 'revision', revision, 'snapshot', snapshot) order by cursor), '[]'::jsonb),
         coalesce(max(cursor), coalesce(p_since, 0))
  into v_events, v_next from page;
  return jsonb_build_object('events', v_events, 'nextCursor', v_next, 'hasMore', v_next < v_high);
end $$;

revoke all on function public._exercise_type(uuid, uuid) from public, anon, authenticated;
revoke all on function public._invalid(text) from public, anon, authenticated;
revoke all on function public._num(jsonb, text) from public, anon, authenticated;
revoke all on function public._int(jsonb, text) from public, anon, authenticated;
revoke all on function public._apply_workout(uuid, uuid, jsonb, text, boolean) from public, anon, authenticated;
revoke all on function public._apply_exercise(uuid, uuid, jsonb, boolean) from public, anon, authenticated;
revoke all on function public._apply_routine(uuid, uuid, jsonb, boolean) from public, anon, authenticated;
revoke all on function public._apply_misc(uuid, text, text, jsonb, boolean) from public, anon, authenticated;
revoke all on function public.apply_mutation(uuid, text, text, int, jsonb, text, text, int) from public, anon;
revoke all on function public.pull_changes(bigint, int) from public, anon;
grant execute on function public.apply_mutation(uuid, text, text, int, jsonb, text, text, int) to authenticated;
grant execute on function public.pull_changes(bigint, int) to authenticated;
