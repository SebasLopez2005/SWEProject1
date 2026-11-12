#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
testdir="$(mktemp -d /tmp/formwork-postgres.XXXXXX)"
stop() {
  pg_ctl -D "$testdir/db" -m immediate stop >/dev/null 2>&1 || true
}
trap stop EXIT
initdb -D "$testdir/db" -A trust --no-locale --encoding=UTF8 >"$testdir/init.log"
pg_ctl -D "$testdir/db" -l "$testdir/server.log" -o "-k $testdir -p 56329 -c listen_addresses=''" start >/dev/null
sql=(psql -X -v ON_ERROR_STOP=1 -h "$testdir" -p 56329 postgres)
"${sql[@]}" -q <<'SQL'
create schema auth;
create role anon;
create role authenticated;
create table auth.users (id uuid primary key);
create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
grant usage on schema auth to authenticated,anon;
SQL
for migration in supabase/migrations/*.sql; do
  "${sql[@]}" -q -f "$migration"
done
"${sql[@]}" -q -f tests/authorization.sql
echo "PostgreSQL migration, validation, idempotency, conflict and isolation tests passed."
