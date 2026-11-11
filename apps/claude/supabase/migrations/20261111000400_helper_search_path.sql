-- Pin search_path on the remaining helper functions (Supabase security advisor 0011).
alter function public._invalid(text) set search_path = public, pg_temp;
alter function public._num(jsonb, text) set search_path = public, pg_temp;
alter function public._int(jsonb, text) set search_path = public, pg_temp;
