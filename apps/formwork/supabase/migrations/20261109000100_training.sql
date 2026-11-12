create schema formwork_private;
revoke all on schema formwork_private from public;

create table formwork_private.catalog (id text primary key, name_key text not null, kind text not null check(kind in ('load','reps','time')));
create index catalog_name on formwork_private.catalog(name_key);

create table public.training_records (
  owner uuid not null references auth.users(id) on delete cascade,
  kind text not null check(kind in ('workout','exercise','routine','settings','goal','reading','weightTarget')),
  id text not null,
  revision integer not null check(revision > 0),
  value jsonb,
  primary key(owner, kind, id)
);
alter table public.training_records enable row level security;
revoke all on public.training_records from public, anon, authenticated;
grant select on public.training_records to authenticated;
create policy read_own_training on public.training_records for select to authenticated using ((select auth.uid()) = owner);
create unique index one_active_training on public.training_records(owner)
  where kind='workout' and value->>'state'='active';
create unique index unique_routine_name on public.training_records(owner,lower(btrim(value->>'name')))
  where kind='routine' and value is not null;
create unique index unique_exercise_name on public.training_records(owner,lower(regexp_replace(value->>'name','[[:space:]]','','g')))
  where kind='exercise' and value is not null;
create table formwork_private.exercise_uses (
  owner uuid not null references auth.users(id) on delete cascade, id text not null, primary key(owner,id)
);
create table formwork_private.receipts (
  owner uuid not null references auth.users(id) on delete cascade, operation uuid not null, hash bytea not null,
  revision integer not null, primary key(owner,operation)
);
create table formwork_private.feed (
  cursor bigint generated always as identity primary key, owner uuid not null references auth.users(id) on delete cascade,
  kind text not null, id text not null, revision integer not null, value jsonb
);
create index owner_feed on formwork_private.feed(owner,cursor);

create function formwork_private.require(p_ok boolean,p_message text) returns void
language plpgsql set search_path=pg_catalog as $$
begin
  if p_ok is distinct from true then raise exception '%', p_message using errcode='22023'; end if;
end;
$$;

create function formwork_private.number_in(j jsonb, lo numeric, hi numeric, integer_only boolean default false) returns boolean
language sql immutable set search_path=pg_catalog as $$
  select case when jsonb_typeof(j)='number' then
    (j::text::numeric between lo and hi) and (not integer_only or trunc(j::text::numeric)=j::text::numeric)
    else false end
$$;

create function formwork_private.day_valid(s text, future boolean, zone text) returns boolean
language plpgsql stable set search_path=pg_catalog as $$
begin
  if s is null or s !~ '^\d{4}-\d{2}-\d{2}$' then return false; end if;
  return s::date is not null and (future or s::date <= (now() at time zone zone)::date);
exception when datetime_field_overflow or invalid_datetime_format then return false;
end;
$$;

create function formwork_private.exercise_kind(p_owner uuid,p_id text) returns text
language sql stable set search_path=pg_catalog as $$
  select coalesce(
    (select kind from formwork_private.catalog where id=p_id),
    (select value->>'kind' from public.training_records where owner=p_owner and kind='exercise' and id=p_id)
  )
$$;

create function formwork_private.validate_target(j jsonb,k text) returns void
language plpgsql set search_path=pg_catalog as $$
begin
  perform formwork_private.require(jsonb_typeof(j)='object','Invalid set target.');
  if k='time' then
    perform formwork_private.require(formwork_private.number_in(j->'seconds',1,86400,true)
      and not (j ?| array['reps','weight','unit','rirMin','rirMax']), 'Invalid timed target.');
  else
    perform formwork_private.require(formwork_private.number_in(j->'reps',1,999,true) and not (j ? 'seconds'), 'Invalid rep target.');
    if j ? 'weight' or j ? 'unit' then
      perform formwork_private.require(k='load' and formwork_private.number_in(j->'weight',0,999.9)
        and j->>'unit' in ('kg','lb'), 'Invalid target weight.');
    end if;
    if j ? 'rirMin' or j ? 'rirMax' then
      perform formwork_private.require(formwork_private.number_in(j->'rirMin',0,20,true)
        and formwork_private.number_in(j->'rirMax',0,20,true)
        and (j->>'rirMin')::numeric <= (j->>'rirMax')::numeric, 'Invalid target RIR range.');
    end if;
  end if;
end;
$$;

create function formwork_private.validate_actual(j jsonb,k text) returns void
language plpgsql set search_path=pg_catalog as $$
begin
  perform formwork_private.require(jsonb_typeof(j)='object' and formwork_private.number_in(j->'at',0,253402300799999,true),'Invalid result timestamp.');
  if k='time' then
    perform formwork_private.require(formwork_private.number_in(j->'seconds',1,86400,true)
      and not (j ?| array['weight','unit','reps','rir']), 'Invalid timed result.');
  else
    perform formwork_private.require(formwork_private.number_in(j->'reps',1,999,true) and not (j ? 'seconds')
      and (not (j ? 'rir') or formwork_private.number_in(j->'rir',0,20,true)), 'Invalid reps or RIR.');
    perform formwork_private.require(
      (k='load' and formwork_private.number_in(j->'weight',0,999.9) and j->>'unit' in ('kg','lb'))
      or (k='reps' and not (j ?| array['weight','unit'])), 'Invalid actual weight.');
  end if;
end;
$$;

create function public.apply_mutation(p_operation uuid,p_kind text,p_id text,p_base integer,p_value jsonb,p_zone text,p_schema integer)
returns jsonb language plpgsql security definer set search_path=pg_catalog as $$
declare
  u uuid := auth.uid();
  previous public.training_records%rowtype;
  prior formwork_private.receipts%rowtype;
  fingerprint bytea;
  v jsonb := nullif(p_value,'null'::jsonb);
  entry jsonb; row_data jsonb; element jsonb; k text; ref text; state text; label text; used_refs text[] := '{}';
  working_sets int := 0; current_revision int;
begin
  if u is null then raise insufficient_privilege using message='Sign in to sync.'; end if;
  perform formwork_private.require(p_schema=1 and p_operation is not null and p_base>=0
    and p_kind in ('workout','exercise','routine','settings','goal','reading','weightTarget')
    and exists(select 1 from pg_timezone_names where name=p_zone), 'Unsupported operation or time zone.');
  perform formwork_private.require(case p_kind when 'settings' then p_id='settings'
    when 'weightTarget' then p_id='weight-target'
    else p_id ~ '^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$' end, 'Invalid record ID.');
  perform pg_advisory_xact_lock(hashtextextended(u::text,133));
  fingerprint := sha256(convert_to(jsonb_build_array(p_kind,p_id,p_base,v,p_zone,p_schema)::text,'UTF8'));
  select * into prior from formwork_private.receipts where owner=u and operation=p_operation;
  if found then
    perform formwork_private.require(prior.hash=fingerprint,'Operation ID reused with different content.');
    return jsonb_build_object('status','ok','revision',prior.revision);
  end if;
  select * into previous from public.training_records where owner=u and kind=p_kind and id=p_id;
  current_revision := coalesce(previous.revision,0);
  if current_revision<>p_base then
    return jsonb_build_object('status','conflict','revision',current_revision,'value',previous.value,'reason','A newer version exists online.');
  end if;
  if v is null then
    perform formwork_private.require(p_kind not in ('exercise','settings'),'Archive the exercise or update settings.');
  else
    perform formwork_private.require(jsonb_typeof(v)='object' and v->>'id'=p_id and octet_length(v::text)<=1048576,'Invalid record payload.');
    if p_kind in ('exercise','routine') then
      label := btrim(v->>'name');
      perform formwork_private.require(jsonb_typeof(v->'name')='string' and char_length(label) between 1 and 60, 'Enter a name of 1 to 60 characters.');
      if p_kind='exercise' then
        label := lower(regexp_replace(label,'[[:space:]]','','g'));
        perform formwork_private.require(length(label)>0 and v->>'kind' in ('load','reps','time') and v->'custom'='true'::jsonb
          and jsonb_typeof(v->'primary')='array' and jsonb_typeof(v->'secondary')='array'
          and jsonb_typeof(v->'instructions')='array' and jsonb_typeof(v->'equipment')='string'
          and jsonb_typeof(v->'category')='string', 'Invalid custom exercise.');
        for element in select jsonb_array_elements((v->'primary') || (v->'secondary') || (v->'instructions')) loop
          perform formwork_private.require(jsonb_typeof(element)='string','Exercise metadata must be text.');
        end loop;
        if exists(select 1 from formwork_private.catalog where name_key=label)
          or exists(select 1 from public.training_records where owner=u and kind='exercise' and id<>p_id
            and lower(regexp_replace(value->>'name','[[:space:]]','','g'))=label)
          or (previous.value->>'kind' <> v->>'kind' and exists(select 1 from formwork_private.exercise_uses where owner=u and id=p_id)) then
          return jsonb_build_object('status','conflict','revision',current_revision,'value',previous.value,'reason','Exercise name or recorded type conflicts.');
        end if;
      elsif exists(select 1 from public.training_records where owner=u and kind='routine' and id<>p_id and lower(btrim(value->>'name'))=lower(label)) then
        return jsonb_build_object('status','conflict','revision',current_revision,'value',previous.value,'reason','Another routine uses that name.');
      end if;
    end if;
    if p_kind in ('workout','routine') then
      perform formwork_private.require(formwork_private.number_in(v->'rest',0,1800,true)
        and jsonb_typeof(v->'entries')='array' and jsonb_array_length(v->'entries')<=100,'Invalid exercise list or default rest.');
      if p_kind='workout' then
        state := v->>'state';
        perform formwork_private.require(state in ('active','finished') and formwork_private.day_valid(v->>'date',false,p_zone)
          and formwork_private.number_in(v->'started',0,253402300799999,true),'Invalid workout date or state.');
        if state='finished' then
          perform formwork_private.require(formwork_private.number_in(v->'finished',(v->>'started')::numeric,253402300799999,true),'Invalid finish timestamp.');
        elsif exists(select 1 from public.training_records where owner=u and kind='workout' and id<>p_id and value->>'state'='active') then
          return jsonb_build_object('status','conflict','revision',current_revision,'value',previous.value,'reason','Another workout is active online.');
        end if;
        perform formwork_private.require(previous.value->>'state' is distinct from 'finished' or state='finished','Finished workouts cannot be reopened.');
      end if;
      for entry in select jsonb_array_elements(v->'entries') loop
        ref := entry->>'exerciseId';
        k := formwork_private.exercise_kind(u,ref);
        perform formwork_private.require(k is not null and entry->>'phase' in ('work','warmup','prep','cooldown')
          and (not (entry ? 'rest') or formwork_private.number_in(entry->'rest',0,1800,true)),'Unknown exercise, phase, or rest rule.');
        if p_kind='routine' then
          perform formwork_private.require(formwork_private.number_in(entry->'count',0,30,true)
            and ((entry->>'count'='0') = (not (entry ? 'target'))), 'Invalid plan set count.');
          if entry ? 'target' then perform formwork_private.validate_target(entry->'target',k); end if;
        else
          perform formwork_private.require(jsonb_typeof(entry->'sets')='array' and jsonb_array_length(entry->'sets')<=200
            and coalesce(length(entry->>'id'),0)>0,'Invalid workout entry.');
          for row_data in select jsonb_array_elements(entry->'sets') loop
            perform formwork_private.require(coalesce(length(row_data->>'id'),0)>0
              and row_data->>'state' in ('pending','done','skipped')
              and (state='active' or row_data->>'state'<>'pending'), 'Invalid set state.');
            if row_data ? 'target' then perform formwork_private.validate_target(row_data->'target',k); end if;
            if row_data->>'state'='done' then
              perform formwork_private.validate_actual(row_data->'actual',k);
              if entry->>'phase'='work' then working_sets := working_sets + 1; end if;
              used_refs := array_append(used_refs,ref);
            else
              perform formwork_private.require(not (row_data ? 'actual'),'Only a completed set can have actuals.');
            end if;
          end loop;
        end if;
      end loop;
      perform formwork_private.require(p_kind<>'workout' or state<>'finished' or working_sets>0,'Complete a working set before finishing.');
      if p_kind='workout' then
        perform formwork_private.require((select count(*)=count(distinct e->>'id') from jsonb_array_elements(v->'entries') e)
          and (select count(*)=count(distinct s->>'id') from jsonb_array_elements(v->'entries') e cross join jsonb_array_elements(e->'sets') s),
          'Duplicate exercise entry or set IDs.');
      end if;
    elsif p_kind='settings' then
      perform formwork_private.require(v->>'unit' in ('kg','lb') and formwork_private.number_in(v->'scale',1,2)
        and jsonb_typeof(v->'both')='boolean' and jsonb_typeof(v->'chosen')='boolean'
        and jsonb_typeof(v->'reminders')='boolean' and jsonb_typeof(v->'restAlerts')='boolean'
        and formwork_private.number_in(v->'hour',0,23,true) and formwork_private.number_in(v->'minute',0,59,true)
        and jsonb_typeof(v->'weekdays')='array' and jsonb_array_length(v->'weekdays')<=7, 'Invalid preferences.');
      for element in select jsonb_array_elements(v->'weekdays') loop
        perform formwork_private.require(formwork_private.number_in(element,0,6,true),'Invalid weekday.');
      end loop;
    elsif p_kind in ('goal','reading','weightTarget') then
      perform formwork_private.require(formwork_private.number_in(v->'weight',0.001,999.9)
        and v->>'unit' in ('kg','lb'),'Invalid weight.');
      if p_kind='goal' then
        perform formwork_private.require(formwork_private.exercise_kind(u,v->>'exerciseId')='load'
          and formwork_private.number_in(v->'reps',1,999,true)
          and (not (v ? 'deadline') or formwork_private.day_valid(v->>'deadline',true,p_zone)), 'Invalid lift goal.');
      elsif p_kind='reading' or v ? 'date' then
        perform formwork_private.require(formwork_private.day_valid(v->>'date',p_kind='weightTarget',p_zone),'Invalid bodyweight date.');
      end if;
    end if;
  end if;
  current_revision := current_revision+1;
  insert into public.training_records values(u,p_kind,p_id,current_revision,v)
    on conflict(owner,kind,id) do update set revision=excluded.revision,value=excluded.value;
  insert into formwork_private.exercise_uses select u, x from unnest(used_refs) x where x not like 'catalog:%' on conflict do nothing;
  insert into formwork_private.feed(owner,kind,id,revision,value) values(u,p_kind,p_id,current_revision,v);
  insert into formwork_private.receipts values(u,p_operation,fingerprint,current_revision);
  return jsonb_build_object('status','ok','revision',current_revision);
end;
$$;

create function public.pull_changes(p_after bigint,p_ceiling bigint default null) returns jsonb
language plpgsql security definer set search_path=pg_catalog as $$
declare
  u uuid := auth.uid();
  ceiling bigint;
begin
  if u is null then raise insufficient_privilege using message='Sign in to sync.'; end if;
  perform formwork_private.require(p_after>=0 and (p_ceiling is null or p_ceiling>=p_after),'Invalid change cursor.');
  ceiling := coalesce(p_ceiling,(select max(cursor) from formwork_private.feed where owner=u),p_after);
  return jsonb_build_object('ceiling',ceiling,'rows',(
    select coalesce(jsonb_agg(to_jsonb(changes) order by cursor),'[]'::jsonb) from (
      select cursor,kind,id,revision,value from formwork_private.feed
        where owner=u and cursor>p_after and cursor<=ceiling order by cursor limit 100
    ) changes
  ));
end;
$$;

revoke all on function public.apply_mutation(uuid,text,text,integer,jsonb,text,integer) from public, anon, authenticated;
revoke all on function public.pull_changes(bigint,bigint) from public, anon, authenticated;
grant execute on function public.apply_mutation(uuid,text,text,integer,jsonb,text,integer) to authenticated;
grant execute on function public.pull_changes(bigint,bigint) to authenticated;
