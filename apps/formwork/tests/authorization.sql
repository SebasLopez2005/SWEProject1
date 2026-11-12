insert into auth.users values ('10000000-0000-4000-8000-000000000001'), ('10000000-0000-4000-8000-000000000002');
create function pg_temp.assert_true(value boolean, message text) returns void language plpgsql as $$
begin if value is distinct from true then raise exception '%',message; end if; end
$$;
set role anon;
do $$
begin
  perform public.pull_changes(0);
  raise exception 'Anonymous role accessed feed';
exception when insufficient_privilege then null;
end $$;
reset role;
set role authenticated;
set request.jwt.claim.sub='10000000-0000-4000-8000-000000000001';
do $$
declare
  op uuid := '20000000-0000-4000-8000-000000000001';
  id text := '30000000-0000-4000-8000-000000000001';
  duplicate_id text := '30000000-0000-4000-8000-000000000002';
  result jsonb;
  body jsonb;
begin
  body := jsonb_build_object('id',id,'date',current_date::text,'rest',90,'state','active','started',1000,'entries','[]'::jsonb);
  result := public.apply_mutation(op,'workout',id,0,body,'UTC',1);
  perform pg_temp.assert_true(result->>'status'='ok' and result->>'revision'='1','Initial write failed');
  perform pg_temp.assert_true(public.apply_mutation(op,'workout',id,0,body,'UTC',1)=result,'Retry changed the receipt');
  begin
    perform public.apply_mutation(op,'workout',id,0,body || '{"rest":91}','UTC',1);
    raise exception 'Mismatched retry was accepted';
  exception when invalid_parameter_value then null;
  end;
  perform pg_temp.assert_true(public.apply_mutation(gen_random_uuid(),'workout',id,0,body,'UTC',1)->>'status'='conflict','Stale revision overwrote data');
  perform pg_temp.assert_true(public.apply_mutation(gen_random_uuid(),'workout',duplicate_id,0,body || jsonb_build_object('id',duplicate_id),'UTC',1)->>'status'='conflict','A second active workout was accepted');
  begin
    perform public.apply_mutation(gen_random_uuid(),'workout',id,1,body || '{"state":"finished","finished":1001}','UTC',1);
    raise exception 'Empty workout was finished';
  exception when invalid_parameter_value then null;
  end;
  begin
    update public.training_records set value=null;
    raise exception 'Direct record write succeeded';
  exception when insufficient_privilege then null;
  end;
  begin
    perform public.apply_mutation(gen_random_uuid(),'workout',id,1,body || '{"date":"2099-02-01"}','UTC',1);
    raise exception 'Future date accepted';
  exception when invalid_parameter_value then null;
  end;
  body := body || '{
    "state":"finished","finished":3000,
    "entries":[{"id":"e","exerciseId":"catalog:Barbell_Bench_Press_-_Medium_Grip","phase":"work",
      "sets":[{"id":"s","state":"done","target":{"reps":12},"actual":{"weight":60,"unit":"kg","reps":11,"at":2000}}]}]
  }';
  perform pg_temp.assert_true(public.apply_mutation(gen_random_uuid(),'workout',id,1,body,'UTC',1)->>'revision'='2','Valid set not saved');
  perform pg_temp.assert_true(jsonb_array_length(public.pull_changes(0)->'rows')=2,'Retry or rejected operation added a feed event');
  perform pg_temp.assert_true((select value->>'state'='finished' from public.training_records where kind='workout'),'Record not visible to its owner');
end $$;
set request.jwt.claim.sub='10000000-0000-4000-8000-000000000002';
select pg_temp.assert_true((select count(*)=0 from public.training_records),'RLS leaked another owner');
select pg_temp.assert_true(jsonb_array_length(public.pull_changes(0)->'rows')=0,'Feed leaked another owner');
select pg_temp.assert_true(public.apply_mutation(gen_random_uuid(),'workout','30000000-0000-4000-8000-000000000001',2,null,'UTC',1)->>'status'='conflict','Cross-owner revision accepted');
reset role;
select pg_temp.assert_true((select count(*)=876 from formwork_private.catalog),'Catalog migration is incomplete');
