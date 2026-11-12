# Repwise — Fitness & Workout Log (Claude implementation)

Independent Claude implementation of the CS3365 Fitness & Workout Log design (31 FW stories + TR-01–13 planned training). Expo SDK 58 · React Native 0.88 · TypeScript · Expo Router · expo-sqlite (offline-first) · Supabase (Auth + Postgres RLS + RPC) · iOS Live Activity via `expo-widgets`.

- Requirements traceability: [REQUIREMENTS.md](REQUIREMENTS.md)
- Decisions and documentation conflicts: [ASSUMPTIONS.md](ASSUMPTIONS.md)
- 10-minute professor walkthrough: [DEMO.md](DEMO.md)
- One Shot 2 record and screenshots: [round-02/claude](../../docs/part2/experiments/round-02/claude/README.md)

## One Shot 2 changes

- **Look and density (UI-04):** compact iOS type scale, native large-title headers, the native iOS 26 tab bar (Liquid Glass, minimizes on scroll), grouped list rows, and a compact set table (SET · PREVIOUS · KG · REPS · RIR · ✓).
- **Responsiveness (UI-05):** the repository emits scoped change events (`active`, `finished`, `exercises`, `routines`, `settings`, `profile`, `sync`). Screens reload only for the scopes they read and only while focused; upload acknowledgements emit `sync` only. Recording a set no longer reloads History, Progress or the muscle map.
- **Body figure (TR-07A):** anatomical male/female front and back figures from `react-native-body-highlighter` (MIT). The choice is a synced setting (Settings, Profile and the muscle screen).
- **How to perform (TR-06A):** every exercise has a guide with a start/end photo loop from the pinned Free Exercise DB revision (cached with `expo-image`), numbered steps that work offline, and muscles worked on the figure. Open it from the library (ⓘ), the picker, or an exercise's menu during a workout.

## Architecture

```text
src/app/            Expo Router screens. (app)/ is guarded: it only renders with an opened owner partition.
src/domain/         Pure rules: types, validation, units, dates, analytics (graphs, muscle map, reports, goals), CSV, warm-up/mobility, reminder planning.
src/data/           SQLite schema/migrations, pinned catalog seeding, owner-scoped Repository (atomic mutation + outbox), demo seeder.
src/sync/           SyncGateway (Supabase RPC) + SyncCoordinator (push outbox, pull change feed, conflict preservation).
src/auth/           Supabase email/password auth, offline reopen, gated device-only profile.
src/device/         Rest timer (absolute deadline), local notifications, reminders, iOS Live Activity.
src/ui/             Theme, compact component kit, charts, anatomical body figure, form guide, set table.
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

## Hosted backend (configured)

- Supabase project **repwise-claude** (`chazdxtlttcotisfoopd`, us-east-2, Free plan). All five migrations are applied (`npx supabase@3.1.0 db push --remote`); a dry run reports it up to date.
- Email confirmation is **off** for the classroom demo, so a professor can create an account instantly. For real users, turn it back on and configure SMTP (the app already shows "check your inbox").
- EAS `production` environment variables: `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (publishable key only; never the secret key).
- The backend suite also passes against the hosted project (9/9 on Nov 11, 2026); its disposable accounts were deleted afterwards. Run it again with `SUPABASE_TEST_EMAIL_DOMAIN=<real domain>` because hosted Auth rejects `example.*` addresses.
- Security advisor: helper `search_path` warnings fixed by migration `…000400`. The remaining notices are intentional: internal tables have RLS with no client policies (deny all), and `apply_mutation` / `pull_changes` are the two SECURITY DEFINER entry points the design calls for.
- To free the slot the org owner's 2-project free limit required, the **SwiftlyCR** project was paused at the owner's request (data kept; restore it from the Supabase dashboard).

## Build and ship to TestFlight

EAS project: `@swiftlycrdev/repwise-claude`. The first build needs an interactive Apple Developer sign-in to create provisioning profiles for the app **and** its `ExpoWidgetsTarget` (Live Activity) extension. One command builds and submits:

```bash
npx eas-cli@latest build --platform ios --profile production --auto-submit
```

Answer **Yes** to logging in to your Apple account, sign in, pick your team, and accept the defaults to generate the distribution profiles (the existing distribution certificate can be reused). After the build (about 15–25 minutes) EAS submits it to App Store Connect, which creates the app record. Apple then processes it (5–30 minutes). In App Store Connect → the app → TestFlight, add the build to your internal group (for example **Team (Expo)**), then install it from the TestFlight app on your iPhone.

## Known limitations

- Live Activity / Lock Screen countdown and notification delivery need a physical iPhone to verify; the simulator build compiles and links the widget extension.
- Sync runs while the app is active (launch, foreground, reconnect, after edits). No background upload when iOS suspends the app (by design, `SCOPE.md`).
- Exports share one CSV per share-sheet action (expo-sharing shares a single file).
