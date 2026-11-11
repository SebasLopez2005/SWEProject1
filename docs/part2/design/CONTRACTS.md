# Architecture and implementation contracts

These contracts accompany the Mermaid model and the [planned training requirements](TRAINING_REQUIREMENTS_DRAFT.md). The indexed diagram sources describe the design for the next generation.

## Modules and ownership

The mobile runtime contains routes/components, UI controllers (hooks are acceptable), domain services, local repository ports, SQLite implementations, presentation/aggregation utilities and synchronization. Controllers handle screen state; services enforce domain rules; repositories own transactions and queries. Supabase is the hosted backend, with Auth, an authenticated Data API, transactional RPC handlers, RLS, owner-scoped rows and an append-only change feed. EAS Build/Submit and App Store Connect are distribution infrastructure, not part of workout request handling.

The class model is split into UI/auth, domain, persistence/sync, presentation and sync-record sheets for readability. Repeated class names identify the same type. Remote handler classes describe logical PostgreSQL function responsibilities; they do not require a second TypeScript server or pretend that SQL is an object-oriented runtime.

## Local transaction and sync protocol

1. On sign-in/bootstrap, load the owner-specific SQLite partition, bundled seed library, settings and sync checkpoint. On first connection fetch the authenticated cloud snapshot. Never merge one account's database into another account.
2. Each mutation uses one SQLite transaction: validate current state, write the full aggregate and children, allocate a durable `operationId`, and append an immutable outbox snapshot with `baseRevision`, local sequence, schema version and timezone. A confirmation follows commit only. Storage failure rolls back and leaves the editor values available for retry. A confirmed set must survive force-close.
3. Queue roots include workouts, custom exercises, routines, settings, lift goals, bodyweight readings and targets, and reminder preferences. Sync custom exercises before routines, workouts and goals that reference them. Persist countdowns and OS request IDs in local device state outside the queue. Only one operation per aggregate is in flight. Later mutations keep immutable snapshots, rather than modifying a payload already sent.
4. `SyncCoordinator` responds to authenticated foreground, reconnect and manual retry, and resumes bounded attempts while active. `SyncGateway.applyMutation` calls authenticated `apply_mutation`. That handler checks schema, owner, references, input types, invariants, expected revision and operation receipt, locks the affected root, and atomically applies all children, records a new revision/change event and stores a receipt.
5. The same `(ownerId, operationId)` with the same payload returns the original receipt even if the response was lost. Reuse with a different payload is rejected. A retry never creates another workout. After an acknowledgement, SQLite removes that outbox row and rebases the next local operation onto the returned server revision. If newer local changes exist, acknowledgements must not replace them with an older snapshot.
6. `pull_changes` reads an ordered, owner-scoped change feed with a monotonic server cursor, bounded by a transactionally chosen high-water mark. Capture deletions as tombstones. Apply a page and advance its checkpoint in a single local transaction. Clean local aggregates accept remote snapshots; dirty ones are preserved and compared against their base revision.
7. Revision/name/type/active-workout conflicts save the remote snapshot alongside the local one and show `needs attention`. No automatic last-write-wins. For a workout, offer keep remote or keep local as a new UUID copy; the source/current remote record stays intact. If both are active, resolve/finish/discard the local active record explicitly before another becomes active. For other owner records, require an explicit reviewed choice or rebase. Preserve stable references and revalidate fields. Unsynced dependent records wait until resolution.
8. Temporary network/server failures keep the outbox pending and retry while active. Expired credentials pause upload and request sign-in; they do not erase local work. Unauthorized/invalid operations are surfaced separately from network failures. Sign-out/account switching is blocked until pending/conflicting work is synced or deliberately discarded after an explicit warning; do not silently lose it. Clear in-memory state, auth tokens and the outgoing account’s scheduled device effects on successful sign-out.

A user sees distinct **saved on this device**, **waiting to upload**, **uploaded**, **needs sign-in**, **needs attention** and **not saved** states. Connectivity alone never implies upload success. Destructive account reset and guaranteed OS-background sync are outside the current scope.

## Storage and authorization

The [workout model](diagrams/04-data-model.mmd) and [training data model](diagrams/05-training-data.mmd) show logical records and their ownership. Outbox, conflict, checkpoint and device effect records stay in SQLite. Shared seeded exercises are readable to signed-in users and immutable in the app; custom exercises are owner-scoped. Each owned remote root includes owner UUID, revision and optional tombstone. Children inherit ownership through enforced foreign keys, never client-supplied trust. Default-deny access, RLS for direct reads and owner-checked RPC execute privileges enforce isolation. Revoke direct table insert/update/delete privileges from mobile roles so they cannot bypass aggregate validation. The narrow mutation RPC may use SECURITY DEFINER with a fixed search path, explicit authenticated-owner checks, no public/anonymous execute grant and no trust in a supplied owner ID. Internal child/receipt/feed tables are not directly writable by clients. Public/publishable project configuration may be in the client; secret/service-role keys must never be in it.

Workout records carry a calendar date, start and finish timestamps, state and ordered entries that reference stable exercise IDs. Starting from a routine snapshots set targets, phases and rest rules in the session. Routine edits or deletion affect future starts. Older templates open as ordered exercise lists with empty entries. Older confirmed sets are treated as done working sets with unspecified targets and RIR.

A used exercise type is immutable on local and server writes. Set `ever_used` monotonically in the set completion transaction. A done row has valid typed actuals and a pending or skipped row has none. Ad hoc finish requires at least one recorded set and drops empty entries. Planned finish requires a completed working set and explicit confirmation before turning any pending rows into skips. For a finished session, reject removing the last qualifying set and offer confirmed workout deletion instead. Discarding a synced active workout writes a tombstone.

Recommended indexes follow reads rather than speculative size promises: owner/workout date + ID, active-workout uniqueness, entry exercise ID, set entry ID, normalized custom name, normalized template name, outbox local sequence and owner/change sequence. Paginate history with `(workoutDate, id)` so equal dates do not cause skips. Database migrations, constraints, RLS, RPC functions and realistic seed examples must be generated along with the app.

## Domain validation

- No empty exercise/template name; initially retain the source proposal of 1-60 characters. Custom exercise name normalization removes spaces and case-folds (revised A-EX-2); enforce against shared names as well as the owner's custom names. Template names are unique per owner ignoring case.
- Weighted sets use a finite load from 0 through 999.9 in the entered unit and 1 through 999 whole reps. Reps-only sets use reps and timed sets use whole seconds of at least 1. Rep-based working sets may record optional actual RIR. Validate the target range independently from the actual result.
- For an ad hoc set, suggest values from the previous set in the entry or latest completed working set for the exercise. For a planned row, show the target separately from suggested actuals. Require confirmation before saving. Convert the suggested load if the entry unit changes and preserve the source value.
- Exercise search combines case-insensitive names with optional muscle, equipment and category filters. With no search text, show up to 10 recent exercises first. Import the pinned catalog metadata by stable ID and keep categories separate from logging types.
- Finish records elapsed duration when available and commits the new workout state and outbox atomically. Reports and charts use the selected workout date, including for backdated sessions.

## Presentation contracts

Unit conversion uses 2.20462, with division for lb-to-kg and multiplication for kg-to-lb. Never rewrite stored weight/unit on display preference changes. Display both primary and equivalent units on weighted rows, previous-performance views and summaries unless equivalent display is off. A form's explicit unit toggle changes the interpretation only through an explicit convert-and-confirm interaction, not silent relabelling of an existing number.

Graph points use completed working sets from finished workouts. Weekly overall volume uses weighted sets converted to the current display unit. Report reps-only and timed work separately from weighted volume. Empty/one-point states are explained; zero-volume weekly buckets exist only within the selected span. All time starts at the earliest finished workout, or displays empty if none exists. Accessible tables, point labels and text summaries use the same data as the chart. Point selection opens its workout, or the contributing workouts for a week.

`SettingsController` updates preferred unit, show-equivalent toggle and a persistent text scale up to 200%. UI reflows using scroll/wrapping and screen-reader labels. List/detail/entry/chart labels remain available at larger sizes; graph numbers also have a plain-text alternative. A local data-change event invalidates all derived views and refreshes previous-performance prefill when next requested.

Monthly reports, lift goals and muscle scores derive from the same current owner records. Corrections, deletions and synced changes invalidate them. Exports read an owner-scoped local snapshot, retain original units and separate targets from actuals. The user chooses the files and destination through the system share sheet.

## Device effects

Starting a routine snapshots its workout rest default. An entry can inherit that default, use its own duration or turn automatic rest off. After a working set commits, start rest if another working set remains and the rule permits it. Keep one device-local timer with an absolute deadline when running and remaining time when paused. Reconcile alerts and Live Activities on relaunch. Cancel them when the triggering set is undone or the session is finished or discarded. Platform permissions determine which optional effects can run.

Reminder preferences can sync. Each device checks its permission and current workout dates before replacing its pending requests. When it learns about a completed workout, it cancels that day’s outstanding reminder.

## Public technology references

Verified during design on November 2, 2026; select exact compatible dependency versions at generation time.

- [Expo with Supabase](https://docs.expo.dev/guides/using-supabase/): supported frontend/backend integration.
- [Expo SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/): local persistence API.
- [Supabase React Native authentication](https://supabase.com/docs/guides/auth/quickstarts/react-native): auth/session lifecycle; follow current SDK guidance for persistence and app state.
- [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security): database ownership enforcement.
- [PostgreSQL functions in Supabase](https://supabase.com/docs/guides/database/functions): RPC boundary for atomic aggregate writes.
- [Expo Router](https://docs.expo.dev/router/introduction/): mobile route structure.
- [Expo TestFlight guide](https://docs.expo.dev/submit/testflight/): build/submission and tester distribution.
