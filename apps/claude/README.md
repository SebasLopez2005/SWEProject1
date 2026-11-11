# Repwise — Fitness & Workout Log (Claude implementation)

Independent Claude implementation of the CS3365 Fitness & Workout Log design (31 FW stories + TR-01–13 planned training). Expo SDK 58 · React Native 0.88 · TypeScript · Expo Router · expo-sqlite (offline-first) · Supabase (Auth + Postgres RLS + RPC) · iOS Live Activity via `expo-widgets`.

- Requirements traceability: [REQUIREMENTS.md](REQUIREMENTS.md)
- Decisions and documentation conflicts: [ASSUMPTIONS.md](ASSUMPTIONS.md)
- 10-minute professor walkthrough: [DEMO.md](DEMO.md)

## Architecture

```text
src/app/            Expo Router screens. (app)/ is guarded: it only renders with an opened owner partition.
src/domain/         Pure rules: types, validation, units, dates, analytics (graphs, muscle map, reports, goals), CSV, warm-up/mobility, reminder planning.
src/data/           SQLite schema/migrations, pinned catalog seeding, owner-scoped Repository (atomic mutation + outbox), demo seeder.
src/sync/           SyncGateway (Supabase RPC) + SyncCoordinator (push outbox, pull change feed, conflict preservation).
src/auth/           Supabase email/password auth, offline reopen, gated device-only profile.
src/device/         Rest timer (absolute deadline), local notifications, reminders, iOS Live Activity.
src/ui/             Theme, accessible components, charts, body map, inline set editor.
supabase/           config.toml + migrations: schema/RLS, generated catalog seed, apply_mutation/pull_changes RPCs.
tests/              Vitest: domain, repository on real SQLite (node:sqlite), sync protocol, backend integration.
scripts/            build-catalog.mjs (pinned Free Exercise DB → app + SQL seed), make-icon.py.
```

Every confirmed change is one SQLite transaction that writes the aggregate **and** an immutable outbox snapshot; the UI only confirms after commit. Sync uploads one operation per aggregate with a stable operation id and base revision; the server deduplicates by receipt, rejects stale revisions as conflicts (both versions preserved for an explicit choice), and publishes an owner-scoped change feed.

## Prerequisites

- macOS with Xcode 26+ and an iOS 26 simulator; Node 22+ (validated with Node 26.3); CocoaPods (`brew install cocoapods`)
- Docker Desktop (only for the local Supabase backend)

## Install

```bash
cd apps/claude
npm ci
```

`.npmrc` sets `legacy-peer-deps=true` because `@expo/ui` pulls `react-dom@19.3.1` while Expo SDK 58 pins `react@19.3.0`.

## Run the backend locally (optional but recommended)

```bash
npx supabase@3.1.0 start
```

Uses project id `repwise-claude` on ports 57321 (API) / 57322 (DB) so it does not collide with other local stacks. Migrations (schema, 876-exercise catalog, RPCs) apply automatically. `npx supabase@3.1.0 status` prints the local publishable key.

Create `.env.local` from `.env.example`:

```bash
cp .env.example .env.local
```

then set `EXPO_PUBLIC_SUPABASE_URL=http://127.0.0.1:57321` and `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<publishable key from supabase status>`. Leave the URL as the placeholder to run without a backend (device-only profile).

## Run the app on the iOS simulator

```bash
npx expo run:ios --device "iPhone 17 Pro"
```

If `pod install` fails with an encoding error, run `export LANG=en_US.UTF-8` first. Afterwards `npx expo start --dev-client` is enough.

Demo access: create any account (local Supabase has email confirmation off), or tap **Continue on this device only**. Then Profile → Settings → **Load demo data**. See [DEMO.md](DEMO.md).

## Checks

```bash
npm run typecheck
```

```bash
npx eslint src tests
```

```bash
npm test
```

```bash
SUPABASE_TEST_URL=http://127.0.0.1:57321 SUPABASE_TEST_PUBLISHABLE_KEY=<publishable key> npx vitest run tests/backend.test.ts
```

The backend suite creates throwaway users on the **local** stack and checks offline upload, lost-response retry idempotency, operation-id reuse rejection, conflict preservation and resolution, owner isolation (RLS + RPC + no direct writes), tombstones, custom-exercise dependency ordering, server-side validation, the one-active-workout rule and full demo-data upload.

## Enable cloud sync for a hosted build

1. Create a Supabase project (free plan is sufficient). Apply migrations: `npx supabase@3.1.0 link --project-ref <ref>` then `npx supabase@3.1.0 db push`.
2. In Auth settings decide on email confirmation (the app handles "check your inbox").
3. Add EAS environment variables for the `production` environment: `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (publishable key only — never the secret/service-role key).
4. Rebuild. Without these variables the build runs in device-only mode, clearly labelled.

## Build and ship to TestFlight

EAS project: `@swiftlycrdev/repwise-claude` (created). The first build needs an interactive Apple Developer sign-in to create provisioning profiles for the app **and** its `ExpoWidgetsTarget` (Live Activity) extension:

```bash
npx eas-cli@latest build --platform ios --profile production
```

```bash
npx eas-cli@latest submit --platform ios --latest
```

Then add yourself to an internal TestFlight group in App Store Connect.

## Known limitations

- Live Activity / Lock Screen countdown and notification delivery need a physical iPhone to verify; the simulator build compiles and links the widget extension.
- Sync runs while the app is active (launch, foreground, reconnect, after edits). No background upload when iOS suspends the app (by design, `SCOPE.md`).
- Exports share one CSV per share-sheet action (expo-sharing shares a single file).
