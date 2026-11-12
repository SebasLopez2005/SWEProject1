-- Claude round 2 (TR-07A): synced male/female body figure display preference.
alter table public.user_settings add column if not exists body_figure text not null default 'male'
  check (body_figure in ('male', 'female'));

create or replace function public._apply_misc(p_owner uuid, p_kind text, p_id text, p jsonb, p_deleted boolean)
returns void language plpgsql security definer set search_path = public, pg_temp as $$
begin
  if p_kind = 'settings' then
    insert into public.user_settings (owner_id, unit, unit_chosen, show_equivalent, text_scale, body_figure)
    values (p_owner, p ->> 'unit', (p ->> 'unitChosen')::boolean, (p ->> 'showEquivalent')::boolean, public._num(p, 'textScale'),
            coalesce(p ->> 'bodyFigure', 'male'))
    on conflict (owner_id) do update set unit = excluded.unit, unit_chosen = excluded.unit_chosen, show_equivalent = excluded.show_equivalent,
      text_scale = excluded.text_scale, body_figure = excluded.body_figure;
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

revoke all on function public._apply_misc(uuid, text, text, jsonb, boolean) from public, anon, authenticated;
