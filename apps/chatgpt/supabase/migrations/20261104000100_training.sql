-- Private account roots plus relational children for validated exercise references.
create table public.catalog (
  id uuid primary key,
  name text not null,
  normalized_name text generated always as (lower(regexp_replace(name,'[[:space:]]','','g'))) stored unique,
  muscle text not null,
  exercise_type text not null check (exercise_type in ('weight_reps','reps_only','seconds'))
);
create table public.training_roots (
  owner_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('workout','exercise','template','settings')),
  id text not null,
  revision integer not null check (revision > 0),
  body jsonb not null,
  primary key (owner_id,kind,id),
  check (body->>'id' = id and body->>'kind' = kind)
);
create unique index one_active_workout on public.training_roots(owner_id)
  where kind='workout' and body->>'state'='active' and body->>'deleted' is null;
create unique index owner_exercise_name on public.training_roots
  (owner_id,lower(regexp_replace(body->>'name','[[:space:]]','','g'))) where kind='exercise';
create unique index owner_template_name on public.training_roots
  (owner_id,lower(body->>'name')) where kind='template' and body->>'deleted' is null;
create index owner_workout_date on public.training_roots(owner_id,(body->>'date') desc,id desc)
  where kind='workout' and body->>'state'='finished' and body->>'deleted' is null;
create table public.training_entries (
  owner_id uuid not null,
  kind text not null check (kind in ('workout','template')),
  root_id text not null,
  entry_id text not null,
  position integer not null check (position >= 0),
  exercise_id uuid not null,
  shared_exercise_id uuid references public.catalog(id),
  custom_exercise_id text,
  custom_kind text generated always as ('exercise') stored,
  primary key (owner_id,kind,root_id,entry_id),
  unique (owner_id,kind,root_id,position),
  foreign key (owner_id,kind,root_id) references public.training_roots(owner_id,kind,id) on delete cascade,
  foreign key (owner_id,custom_kind,custom_exercise_id) references public.training_roots(owner_id,kind,id) on delete cascade,
  check (num_nonnulls(shared_exercise_id,custom_exercise_id) = 1)
);
create index training_entry_exercise on public.training_entries(owner_id,exercise_id);
create table public.training_sets (
  owner_id uuid not null,
  kind text generated always as ('workout') stored,
  workout_id text not null,
  entry_id text not null,
  id uuid not null,
  position integer not null check (position >= 0),
  weight numeric check (weight between 0 and 999.9),
  unit text check (unit in ('kg','lb')),
  reps integer check (reps between 1 and 999),
  seconds bigint check (seconds between 1 and 9007199254740991),
  primary key (owner_id,workout_id,id),
  unique (owner_id,workout_id,entry_id,position),
  foreign key (owner_id,kind,workout_id,entry_id)
    references public.training_entries(owner_id,kind,root_id,entry_id) on delete cascade,
  check ((weight is null) = (unit is null) and num_nonnulls(reps,seconds) = 1 and (weight is null or reps is not null))
);
create table public.training_used (
  owner_id uuid not null references auth.users(id) on delete cascade,
  exercise_id uuid not null,
  primary key(owner_id,exercise_id)
);
create table public.training_receipts (
  owner_id uuid not null references auth.users(id) on delete cascade,
  operation_id uuid not null,
  request_hash bytea not null,
  revision integer not null,
  primary key(owner_id,operation_id)
);
create table public.training_changes (
  cursor bigint generated always as identity primary key,
  owner_id uuid not null references auth.users(id) on delete cascade,
  revision integer not null,
  body jsonb not null,
  used uuid[] not null
);
create index owner_training_changes on public.training_changes(owner_id,cursor);

alter table public.catalog enable row level security;
alter table public.training_roots enable row level security;
alter table public.training_entries enable row level security;
alter table public.training_sets enable row level security;
alter table public.training_used enable row level security;
alter table public.training_receipts enable row level security;
alter table public.training_changes enable row level security;
create policy catalog_read on public.catalog for select to authenticated using (true);
create policy own_training on public.training_roots for select to authenticated using (owner_id = (select auth.uid()));
create policy own_entries on public.training_entries for select to authenticated using (owner_id = (select auth.uid()));
create policy own_sets on public.training_sets for select to authenticated using (owner_id = (select auth.uid()));
revoke all on public.catalog, public.training_roots, public.training_entries, public.training_sets,
  public.training_used, public.training_receipts, public.training_changes from public,anon,authenticated;
grant select on public.catalog, public.training_roots, public.training_entries, public.training_sets to authenticated;

create function public.apply_mutation(p_operation uuid, p_base integer, p_root jsonb, p_timezone text, p_schema integer)
returns jsonb language plpgsql security definer set search_path = pg_catalog as $$
declare
  actor uuid := auth.uid();
  entity text := p_root->>'kind';
  target_id text := p_root->>'id';
  prior public.training_roots%rowtype;
  other_active public.training_roots%rowtype;
  existing public.training_receipts%rowtype;
  request_hash bytea;
  remote jsonb;
  problem text;
  next_revision integer;
  workout_day date;
  workout_started timestamptz;
  workout_finished timestamptz;
  entry jsonb;
  target_entry text;
  entry_pos integer;
  set_item jsonb;
  set_pos integer;
  ex_id uuid;
  ex_type text;
  is_archived boolean;
  is_shared boolean;
  previous_references jsonb;
  verified_source jsonb;
  name_key text;
  active_sets integer := 0;
  used_ids uuid[] := '{}';
  set_ids uuid[] := '{}';
  entry_ids uuid[] := '{}';
begin
  if actor is null then raise insufficient_privilege using message='Sign in before syncing.'; end if;
  if p_schema is distinct from 1 or p_operation is null or p_base is null or p_base < 0
    or jsonb_typeof(p_root) is distinct from 'object'
    or entity is null or entity not in ('exercise','workout','template','settings')
    or target_id is null or p_timezone is null
    or p_root ? 'ownerId' or p_root ? 'owner_id'
  then raise invalid_parameter_value using message='Invalid operation envelope.'; end if;
  if entity = 'settings' then
    if target_id <> 'preferences' then raise invalid_parameter_value using message='Invalid settings identity.'; end if;
  elsif target_id <> (target_id::uuid)::text then
    raise invalid_parameter_value using message='Invalid record identity.';
  end if;

  -- Serialize writes per owner so receipts, active uniqueness and feed order agree even across devices.
  perform pg_advisory_xact_lock(hashtextextended(actor::text,0));
  request_hash := sha256(convert_to(jsonb_build_array(p_base,p_root,p_timezone,p_schema)::text,'UTF8'));
  select * into existing from public.training_receipts where owner_id=actor and operation_id=p_operation;
  if found then
    if existing.request_hash <> request_hash then
      raise invalid_parameter_value using message='Operation identity was reused with different data.';
    end if;
    return jsonb_build_object('status','ok','revision',existing.revision);
  end if;
  select * into prior from public.training_roots r where r.owner_id=actor and r.kind=entity and r.id=target_id;
  if prior.revision is not null then remote := jsonb_build_object('root',prior.body,'revision',prior.revision); end if;
  if coalesce(prior.revision,0) <> p_base then
    return jsonb_build_object('status','conflict','reason','This record changed on another device.','remote',remote);
  end if;
  next_revision := p_base + 1;

  begin
    if p_root ? 'deleted' then
      if entity not in ('workout','template') or p_root->'deleted' <> 'true'::jsonb or prior.body is null then
        raise invalid_parameter_value using message='Only existing workouts and templates can be removed.';
      end if;
      p_root := prior.body || '{"deleted":true}'::jsonb;
    elsif prior.body ? 'deleted' then
      raise invalid_parameter_value using message='This record was removed. Use a new identity.';
    elsif entity = 'exercise' then
      if p_root - array['kind','id','name','muscle','type','archived'] <> '{}'::jsonb
        or jsonb_typeof(p_root->'name') is distinct from 'string'
        or length(p_root->>'name') not between 1 and 60 or btrim(p_root->>'name') <> p_root->>'name'
        or not coalesce(p_root->>'type' in ('weight_reps','reps_only','seconds'),false)
        or not coalesce(p_root->>'muscle' in ('Chest','Back','Legs','Shoulders','Arms','Core','Full body'),false)
        or jsonb_typeof(p_root->'archived') is distinct from 'boolean'
      then raise invalid_parameter_value using message='Enter a valid exercise name, type and muscle group.'; end if;
      name_key := lower(regexp_replace(p_root->>'name','[[:space:]]','','g'));
      if name_key='' or exists(select 1 from public.catalog where id=target_id::uuid or normalized_name=name_key)
        or exists(select 1 from public.training_roots r where owner_id=actor and kind='exercise' and id<>target_id
          and lower(regexp_replace(r.body->>'name','[[:space:]]','','g'))=name_key)
      then raise invalid_parameter_value using message='An exercise with that name already exists.'; end if;
      if prior.body->>'type' <> p_root->>'type' and exists(
        select 1 from public.training_used where owner_id=actor and exercise_id=target_id::uuid
      ) then raise invalid_parameter_value using message='Recorded sets lock this exercise type.'; end if;
    elsif entity = 'settings' then
      if p_root - array['kind','id','unit','equivalents','scale'] <> '{}'::jsonb
        or not coalesce(p_root->>'unit' in ('kg','lb'),false)
        or jsonb_typeof(p_root->'equivalents') is distinct from 'boolean'
        or jsonb_typeof(p_root->'scale') is distinct from 'number'
        or not coalesce((p_root->>'scale')::numeric in (1,1.25,1.5,1.75,2),false)
      then raise invalid_parameter_value using message='Invalid display preferences.'; end if;
    elsif entity = 'template' then
      if p_root - array['kind','id','name','exercises','workoutId','copyOf'] <> '{}'::jsonb
        or jsonb_typeof(p_root->'name') is distinct from 'string'
        or length(p_root->>'name') not between 1 and 60 or btrim(p_root->>'name') <> p_root->>'name'
        or jsonb_typeof(p_root->'exercises') is distinct from 'array' or jsonb_array_length(p_root->'exercises')=0
      then raise invalid_parameter_value using message='A template needs a name and at least one exercise.'; end if;
      if exists(select 1 from public.training_roots r where owner_id=actor and kind='template' and id<>target_id
        and body->>'deleted' is null and lower(body->>'name')=lower(p_root->>'name'))
      then raise invalid_parameter_value using message='A template with that name already exists.'; end if;
      previous_references := prior.body->'exercises';
      select jsonb_agg(e->'exerciseId') into verified_source
        from public.training_roots r cross join lateral jsonb_array_elements(r.body->'entries') e
        where r.owner_id=actor and r.kind='workout' and r.id=p_root->>'workoutId' and r.body->>'state'='finished';
      if p_root ? 'copyOf' then
        select coalesce(verified_source,'[]') || coalesce(r.body->'exercises','[]') into verified_source
          from public.training_roots r where r.owner_id=actor and r.kind='template' and r.id=p_root->>'copyOf';
      end if;
    else
      if p_root - array['kind','id','date','state','startedAt','finishedAt','duration','entries','templateId','copyOf'] <> '{}'::jsonb
        or coalesce(p_root->>'date','') !~ '^\d{4}-\d{2}-\d{2}$'
        or not coalesce(p_root->>'state' in ('active','finished'),false)
        or jsonb_typeof(p_root->'startedAt') is distinct from 'string'
        or jsonb_typeof(p_root->'entries') is distinct from 'array'
      then raise invalid_parameter_value using message='Invalid workout fields.'; end if;
      workout_day := (p_root->>'date')::date;
      if workout_day < date '1900-01-01' or workout_day > (statement_timestamp() at time zone p_timezone)::date
      then raise invalid_parameter_value using message='Choose today or an earlier workout date.'; end if;
      workout_started := (p_root->>'startedAt')::timestamptz;
      if not isfinite(workout_started) then
        raise invalid_parameter_value using message='Invalid workout start time.';
      end if;
      if p_root->>'state'='active' then
        if prior.body->>'state'='finished' or p_root ? 'finishedAt' or p_root ? 'duration' then
          raise invalid_parameter_value using message='A finished workout cannot be reopened as active.';
        end if;
        select * into other_active from public.training_roots r where r.owner_id=actor and r.kind='workout'
          and r.id<>target_id and r.body->>'state'='active' and r.body->>'deleted' is null;
        if found then
          return jsonb_build_object('status','conflict','reason','Another device has an active workout.','remote',remote,
            'blocker',jsonb_build_object('root',other_active.body,'revision',other_active.revision));
        end if;
      else
        workout_finished := (p_root->>'finishedAt')::timestamptz;
        if workout_finished is null or not isfinite(workout_started) or not isfinite(workout_finished)
          or workout_finished < workout_started
          or (p_root ? 'duration' and (jsonb_typeof(p_root->'duration') <> 'number'
            or coalesce(p_root->>'duration','') !~ '^\d+$' or (p_root->>'duration')::bigint > 9007199254740991))
        then raise invalid_parameter_value using message='Invalid workout duration.'; end if;
      end if;
      previous_references := prior.body->'entries';
      select r.body->'exercises' into verified_source from public.training_roots r
        where r.owner_id=actor and r.kind='template' and r.id=p_root->>'templateId';
      if p_root ? 'copyOf' then
        select coalesce(verified_source,'[]') || coalesce(jsonb_agg(e->'exerciseId'),'[]') into verified_source
          from public.training_roots r cross join lateral jsonb_array_elements(r.body->'entries') e
          where r.owner_id=actor and r.kind='workout' and r.id=p_root->>'copyOf';
      end if;
    end if;

    insert into public.training_roots values (actor,entity,target_id,next_revision,p_root)
      on conflict (owner_id,kind,id) do update set revision=excluded.revision,body=excluded.body;
    if entity in ('workout','template') then
      delete from public.training_entries where owner_id=actor and kind=entity and training_entries.root_id=target_id;
      if not (p_root ? 'deleted') then
        for entry,entry_pos in
          select x.value,(x.ordinality-1)::integer
          from jsonb_array_elements(case when entity='workout' then p_root->'entries' else p_root->'exercises' end)
          with ordinality as x(value,ordinality)
        loop
          if entity='workout' then
            if jsonb_typeof(entry) is distinct from 'object' or entry - array['id','exerciseId','sets'] <> '{}'::jsonb
              or jsonb_typeof(entry->'sets') is distinct from 'array'
              or jsonb_typeof(entry->'id') is distinct from 'string'
              or jsonb_typeof(entry->'exerciseId') is distinct from 'string'
            then raise invalid_parameter_value using message='Invalid workout entry.'; end if;
            target_entry := ((entry->>'id')::uuid)::text;
            if target_entry::uuid=any(entry_ids) then raise invalid_parameter_value using message='Repeated entry identity.'; end if;
            entry_ids := array_append(entry_ids,target_entry::uuid);
            ex_id := (entry->>'exerciseId')::uuid;
          else
            target_entry := entry_pos::text;
            ex_id := (entry #>> '{}')::uuid;
          end if;
          select exercise_type into ex_type from public.catalog where id=ex_id;
          is_shared := found;
          is_archived := false;
          if not is_shared then
            select body->>'type',(body->>'archived')::boolean into ex_type,is_archived from public.training_roots
              where owner_id=actor and kind='exercise' and id=ex_id::text;
            if not found then raise invalid_parameter_value using message='An exercise is missing or belongs to another account.'; end if;
          end if;
          if is_archived and not coalesce(verified_source ? ex_id::text,false) then
            if entity='template' and not coalesce(previous_references ? ex_id::text,false)
              or entity='workout' and not exists(select 1 from jsonb_array_elements(previous_references) prev
                where prev->>'id'=target_entry and prev->>'exerciseId'=ex_id::text)
                and not exists(
                  select 1 from public.training_changes ch
                  where ch.owner_id=actor and ch.body->>'kind'='workout' and ch.body->>'id'=target_id
                    and ch.body->'entries' @> jsonb_build_array(jsonb_build_object('id',target_entry,'exerciseId',ex_id))
                )
            then raise invalid_parameter_value using message='An exercise is archived and unavailable for this record.'; end if;
          end if;
          insert into public.training_entries(owner_id,kind,root_id,entry_id,position,exercise_id,shared_exercise_id,custom_exercise_id)
          values(actor,entity,target_id,target_entry,entry_pos,ex_id,
            case when is_shared then ex_id end,case when not is_shared then ex_id::text end);
          if entity='template' then continue; end if;
          if p_root->>'state'='finished' and jsonb_array_length(entry->'sets')=0 then
            raise invalid_parameter_value using message='Remove exercises with no sets before finishing.';
          end if;
          for set_item,set_pos in select x.value,(x.ordinality-1)::integer
            from jsonb_array_elements(entry->'sets') with ordinality as x(value,ordinality)
          loop
            if jsonb_typeof(set_item) is distinct from 'object' or jsonb_typeof(set_item->'id') is distinct from 'string'
              or (set_item->>'id')::uuid=any(set_ids)
              or (set_item->>'id')::uuid=any(entry_ids)
            then raise invalid_parameter_value using message='Invalid or repeated set identity.'; end if;
            set_ids := array_append(set_ids,(set_item->>'id')::uuid);
            if ex_type='seconds' then
              if set_item - array['id','seconds'] <> '{}'::jsonb
                or jsonb_typeof(set_item->'seconds') is distinct from 'number'
                or (set_item->>'seconds') !~ '^\d+$' or (set_item->>'seconds')::numeric not between 1 and 9007199254740991
              then raise invalid_parameter_value using message='Enter a positive whole number of seconds.'; end if;
            else
              if jsonb_typeof(set_item->'reps') is distinct from 'number'
                or (set_item->>'reps') !~ '^\d+$' or (set_item->>'reps')::numeric not between 1 and 999
              then raise invalid_parameter_value using message='Enter whole reps from 1 to 999.'; end if;
              if ex_type='weight_reps' then
                if set_item - array['id','reps','weight','unit'] <> '{}'::jsonb
                  or jsonb_typeof(set_item->'weight') is distinct from 'number'
                  or not coalesce(set_item->>'unit' in ('kg','lb'),false)
                  or (set_item->>'weight')::numeric not between 0 and 999.9
                then raise invalid_parameter_value using message='Enter a weight from 0 to 999.9 and select a unit.'; end if;
              elsif set_item - array['id','reps'] <> '{}'::jsonb then
                raise invalid_parameter_value using message='This exercise only records reps.';
              end if;
            end if;
            insert into public.training_sets(owner_id,workout_id,entry_id,id,position,weight,unit,reps,seconds)
            values (actor,target_id,target_entry,(set_item->>'id')::uuid,set_pos,(set_item->>'weight')::numeric,
              set_item->>'unit',(set_item->>'reps')::integer,(set_item->>'seconds')::bigint);
            active_sets := active_sets + 1;
          end loop;
          if jsonb_array_length(entry->'sets')>0 then
            insert into public.training_used values (actor,ex_id) on conflict do nothing;
            used_ids := array_append(used_ids,ex_id);
          end if;
        end loop;
        if entity='workout' and p_root->>'state'='finished' and active_sets=0 then
          raise invalid_parameter_value using message='A finished workout must contain at least one set.';
        end if;
        if entry_ids && set_ids then raise invalid_parameter_value using message='Entry and set identities must be distinct.'; end if;
      end if;
    end if;
    insert into public.training_changes(owner_id,revision,body,used) values (actor,next_revision,p_root,used_ids);
    insert into public.training_receipts values (actor,p_operation,request_hash,next_revision);
  exception
    when invalid_parameter_value then
      get stacked diagnostics problem = message_text;
      return jsonb_build_object('status','conflict','reason',problem,'remote',remote);
    when data_exception or integrity_constraint_violation then
      return jsonb_build_object('status','conflict','reason','The server rejected invalid fields or references.','remote',remote);
  end;
  return jsonb_build_object('status','ok','revision',next_revision);
end;
$$;

create function public.pull_changes(p_after bigint, p_high bigint default null)
returns jsonb language plpgsql security definer set search_path = pg_catalog as $$
declare
  actor uuid := auth.uid();
  high_water bigint;
  last_cursor bigint;
  page jsonb;
begin
  if actor is null then raise insufficient_privilege using message='Sign in before syncing.'; end if;
  if p_after is null or p_after<0 or p_high<p_after then
    raise invalid_parameter_value using message='Invalid feed cursor.';
  end if;
  select greatest(p_after,coalesce(max(cursor),0)) into high_water
    from public.training_changes where owner_id=actor;
  high_water := least(coalesce(p_high,high_water),high_water);
  select coalesce(jsonb_agg(jsonb_build_object('cursor',cursor,'root',body,'revision',revision,'used',used) order by cursor),'[]'),
    coalesce(max(cursor),high_water) into page,last_cursor
    from (select cursor,body,revision,used from public.training_changes
      where owner_id=actor and cursor>p_after and cursor<=high_water order by cursor limit 75) bounded;
  return jsonb_build_object('changes',page,'cursor',last_cursor,'highWater',high_water);
end;
$$;

revoke all on function public.apply_mutation(uuid,integer,jsonb,text,integer),public.pull_changes(bigint,bigint)
  from public,anon,authenticated;
grant execute on function public.apply_mutation(uuid,integer,jsonb,text,integer),public.pull_changes(bigint,bigint)
  to authenticated;
