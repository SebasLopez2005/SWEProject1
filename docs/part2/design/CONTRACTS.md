# Architecture and implementation contracts

These explanations accompany the diagram model. The `.mmd` sources carry the behavioral rules used to generate code; if these notes and a diagram disagree, fix the diagram before generation.

## Modules and ownership

The mobile runtime contains routes/components, UI controllers (hooks are acceptable), domain services, local repository ports, SQLite implementations, presentation/aggregation utilities and synchronization. Controllers handle screen state; services enforce domain rules; repositories own transactions and queries. Supabase is the hosted backend, with Auth, an authenticated Data API, transactional RPC handlers, RLS, owner-scoped rows and an append-only change feed. EAS Build/Submit and App Store Connect are distribution infrastructure, not part of workout request handling.

The class model is split into UI/auth, domain, persistence/sync, presentation and sync-record sheets for readability. Repeated class names identify the same type. Remote handler classes describe logical PostgreSQL function responsibilities; they do not require a second TypeScript server or pretend that SQL is an object-oriented runtime.

## Local transaction and sync protocol

1. On sign-in/bootstrap, load the owner-specific SQLite partition, bundled seed library, settings and sync checkpoint. On first connection fetch the authenticated cloud snapshot. Never merge one account's database into another account.
2. Each mutation uses one SQLite transaction: validate current state, write the full aggregate and children, allocate a durable `operationId`, and append an immutable outbox snapshot with `baseRevision`, local sequence, schema version and timezone. A confirmation follows commit only. Storage failure rolls back and leaves the editor values available for retry. A confirmed set must survive force-close.
3. Queue roots are `Workout`, custom `Exercise`, `Template` and `UserSettings`. Sync dependencies first (custom exercises before workouts/templates that reference them). Only one operation per aggregate is in flight. Later mutations keep immutable snapshots, rather than modifying a payload already sent.
4. `SyncCoordinator` responds to authenticated foreground, reconnect and manual retry, and resumes bounded attempts while active. `SyncGateway.applyMutation` calls authenticated `apply_mutation`. That handler checks schema, owner, references, input types, invariants, expected revision and operation receipt, locks the affected root, and atomically applies all children, records a new revision/change event and stores a receipt.
5. The same `(ownerId, operationId)` with the same payload returns the original receipt even if the response was lost. Reuse with a different payload is rejected. A retry never creates another workout. After an acknowledgement, SQLite removes that outbox row and rebases the next local operation onto the returned server revision. If newer local changes exist, acknowledgements must not replace them with an older snapshot.
6. `pull_changes` reads an ordered, owner-scoped change feed with a monotonic server cursor, bounded by a transactionally chosen high-water mark. Capture deletions as tombstones. Apply a page and advance its checkpoint in a single local transaction. Clean local aggregates accept remote snapshots; dirty ones are preserved and compared against their base revision.
7. Revision/name/type/active-workout conflicts save the remote snapshot alongside the local one and show `needs attention`. No automatic last-write-wins. For a workout, offer keep remote or keep local as a new UUID copy; the source/current remote record stays intact. If both are active, resolve/finish/discard the local active record explicitly before another becomes active. For an exercise/template/settings conflict, require an explicit reviewed choice/rebase; preserve stable references and revalidate names/types. Unsynced dependent records wait until resolution.
8. Temporary network/server failures keep the outbox pending and retry while active. Expired credentials pause upload and request sign-in; they do not erase local work. Unauthorized/invalid operations are surfaced separately from network failures. Sign-out/account switching is blocked until pending/conflicting work is synced or deliberately discarded after an explicit warning; do not silently lose it. Clear in-memory state and auth tokens on successful sign-out.

A user sees distinct **saved on this device**, **waiting to upload**, **uploaded**, **needs sign-in**, **needs attention** and **not saved** states. Connectivity alone never implies upload success. Destructive account reset and guaranteed OS-background sync are outside the current scope.

## Storage and authorization

The entity diagram describes both logical local records and their remote equivalents. Local-only outbox/conflict/checkpoint rows are never public API tables. Shared seeded exercises are readable to signed-in users and immutable in the app; custom exercises are owner-scoped. Each owned remote root includes owner UUID, revision and optional tombstone. Children inherit ownership through enforced foreign keys, never client-supplied trust. Default-deny access, RLS for direct reads and owner-checked RPC execute privileges enforce isolation. Revoke direct table insert/update/delete privileges from mobile roles so they cannot bypass aggregate validation. The narrow mutation RPC may use SECURITY DEFINER with a fixed search path, explicit authenticated-owner checks, no public/anonymous execute grant and no trust in a supplied owner ID. Internal child/receipt/feed tables are not directly writable by clients. Public/publishable project configuration may be in the client; secret/service-role keys must never be in it.

Workout rows contain workout date, started/finished timestamps, state and ordered entries. An entry points to a stable exercise ID and has ordered typed sets. A used exercise type is immutable on both local and server writes. Mark `ever_used` monotonically within the set-creation transaction; stale sync payloads cannot reset it. Completed workouts require at least one set and contain no empty entries. In-progress workouts may contain empty entries. Removing the last set of a finished workout is rejected; use confirmed workout deletion instead. Discarding an active workout writes a tombstone if it has already synced.

Recommended indexes follow reads rather than speculative size promises: owner/workout date + ID, active-workout uniqueness, entry exercise ID, set entry ID, normalized custom name, normalized template name, outbox local sequence and owner/change sequence. Paginate history with `(workoutDate, id)` so equal dates do not cause skips. Database migrations, constraints, RLS, RPC functions and realistic seed examples must be generated along with the app.

## Domain validation

- No empty exercise/template name; initially retain the source proposal of 1-60 characters. Custom exercise name normalization trims/collapses whitespace and case-folds; enforce against shared names as well as the owner's custom names. Template names are unique per owner ignoring case.
- Weighted sets: finite decimal weight from 0 through 999.9 in the entered unit, whole reps from 1 through 999. Reps-only: reps only. Timed: whole seconds at least 1. Disallow irrelevant fields rather than summing them accidentally. These source-proposed bounds can be changed by a reviewed diagram revision.
- A new set copies the previous set in that entry. If none exists, use the latest finished set for the exercise. If prefill must change unit, convert the value before applying it, without changing its source record. An empty history produces an unfilled form, never a guessed training recommendation.
- Exercise search combines case-insensitive substring and muscle filters. With no text, show up to the source-proposed 10 recent exercises first; do not infer that the library contains any promised number of exercises.
- Finishing drops empty entries with an explanation, requires a remaining set, records elapsed duration if available, and commits the finish and outbox atomically. Backdated sessions use their selected workout date for history/graphs; duration may be absent rather than invented.

## Presentation contracts

Unit conversion uses 2.20462, with division for lb-to-kg and multiplication for kg-to-lb. Never rewrite stored weight/unit on display preference changes. Display both primary and equivalent units on weighted rows, previous-performance views and summaries unless equivalent display is off. A form's explicit unit toggle changes the interpretation only through an explicit convert-and-confirm interaction, not silent relabelling of an existing number.

Graph points for weighted and reps-only exercises correspond to a finished workout. Weekly overall volume includes only weighted sets converted to the current display unit. Timed sets are recorded and summarized in seconds but excluded from volume charts. Empty/one-point states are explained; zero-volume weekly buckets exist only within the selected span. All time starts at the earliest finished workout, or displays empty if none exists. Accessible tables, point labels and text summaries use the same data as the chart. Point selection opens its workout, or the contributing workouts for a week.

`SettingsController` updates preferred unit, show-equivalent toggle and a persistent text scale up to 200%. UI reflows using scroll/wrapping and screen-reader labels. List/detail/entry/chart labels remain available at larger sizes; graph numbers also have a plain-text alternative. A local data-change event invalidates all derived views and refreshes previous-performance prefill when next requested.

## Public technology references

Verified during design on November 2, 2026; select exact compatible dependency versions at generation time.

- [Expo with Supabase](https://docs.expo.dev/guides/using-supabase/): supported frontend/backend integration.
- [Expo SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/): local persistence API.
- [Supabase React Native authentication](https://supabase.com/docs/guides/auth/quickstarts/react-native): auth/session lifecycle; follow current SDK guidance for persistence and app state.
- [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security): database ownership enforcement.
- [PostgreSQL functions in Supabase](https://supabase.com/docs/guides/database/functions): RPC boundary for atomic aggregate writes.
- [Expo Router](https://docs.expo.dev/router/introduction/): mobile route structure.
- [Expo TestFlight guide](https://docs.expo.dev/submit/testflight/): build/submission and tester distribution.
