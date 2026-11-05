# Fitness & Workout Log

An iOS-first workout journal for logging weighted, reps-only, and timed sets, revisiting past performance, correcting records, reusing exercise lists, and comparing training volume. Confirmed changes are saved to SQLite before cloud sync.

See [DEMO.md](DEMO.md) for the four persona walkthroughs, [REQUIREMENTS.md](REQUIREMENTS.md) for acceptance evidence, and [ASSUMPTIONS.md](ASSUMPTIONS.md) for design decisions.

## Classroom demo on macOS

Use Xcode with an installed iOS simulator runtime, CocoaPods, and an even-numbered Node LTS release that meets `package.json`'s engine range. The demo requires no Supabase account, Apple Developer membership, or credentials.

```sh
cd "$HOME/SWEProject1/SWEProject1/apps/chatgpt"
npm ci
open -a Simulator
npm start -- --localhost
```

Leave Metro running. Boot one simulator in Simulator and run this in another terminal from the same directory.

```sh
npm run ios
```

If several simulators are booted, run `xcrun simctl list devices booted` and pass the intended UUID to `npm run ios -- DEVICE_UUID`. Choose **Open classroom demo**. Leave both Supabase variables unset for this mode.

## Local Supabase

With Docker running, start the local backend from this directory. This profile includes the database, Auth, and REST API. It skips services unused by the app.

```sh
npx --yes supabase@3.0.0 start -x studio,imgproxy,storage-api,realtime,edge-runtime,logflare,vector,postgres-meta,supavisor
npx --yes supabase@3.0.0 migration up
npx --yes supabase@3.0.0 status
cp .env.example .env
```

Set `EXPO_PUBLIC_SUPABASE_URL` to the local API URL (usually `http://127.0.0.1:54321` on the iOS simulator). Set `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` to the **publishable** key from the local status output. Restart Metro, reopen the app, and choose **Create an account**. Local Auth has email confirmation disabled. Use your own throwaway test addresses and passwords. Test accounts in the integration suite are generated when it runs.

The shared exercise catalog is installed by a migration. Each new account has an empty personal log. In the local stack, keys and users are only for local development. For a physical device, use a reachable backend over HTTPS.

## Verification commands

```sh
npm run typecheck
npm test
npx expo install --check
npx --yes expo-doctor
```

To exercise real Auth, REST/RPC, RLS, and two-device reconciliation, keep the local stack running. Pass the public test configuration from your environment.

```sh
TEST_SUPABASE_URL=http://127.0.0.1:54321 \
TEST_SUPABASE_KEY=YOUR_LOCAL_PUBLISHABLE_KEY npm test
```

For native UI tests, use a dedicated iOS simulator with Metro running in classroom demo mode. The tests add demo records. Install the `xcodeproj` Ruby gem (available with Homebrew CocoaPods) and run `npm run test:ios`. The script creates a test target in the generated iOS project and uses XCTest. Use an empty demo or one with 100% text at the start. The test discards an existing unfinished demo session before starting its own.

To test the iOS client through a real local API outage, leave the local Supabase stack running, stop Metro on port 8081, and run `npm run test:ios:cloud` on a dedicated simulator with no active cloud sign-in. The script starts Metro against loopback, registers a disposable account, stops and restarts the local API gateway, and checks waiting and uploaded states.

## Hosted setup and TestFlight

1. Create or select an isolated Supabase project. Link its CLI and apply `supabase/migrations` with `npx supabase db push`. Choose the hosted email confirmation policy and verify registration/sign-in using test addresses. Never place a secret or service-role key in Expo configuration.
2. Supply the hosted API URL and publishable key to the production EAS environment. Set a team-owned bundle identifier and App Store Connect record. Use the corresponding Expo/EAS project and Apple Developer signing credentials.
3. With the EAS project linked and external distribution authorized, use `npx eas-cli build --platform ios --profile production` and then `npx eas-cli submit --platform ios --profile production`. Add the instructor to an approved external beta group if applicable. Review the resulting build on a physical iPhone.

No third-party services are required for the classroom demo. Hosted Supabase is needed for remote accounts and sync. EAS and App Store Connect are used for TestFlight distribution. The app has no separate mail integration.
