# Formwork

Formwork is the independent Attempt 3 implementation of the Fitness & Workout Log school project. It uses Expo SDK 56, React Native, TypeScript, Expo Router, local SQLite, and Supabase Auth and PostgreSQL. The interface uses a dark graphite and champagne palette with native Liquid Glass on supported iOS devices.

## Run the iPhone simulator demo

Install Node 22.13 or newer, Xcode with an iOS simulator runtime, and CocoaPods. Boot one iPhone simulator in Xcode, then run these commands from this directory.

```sh
npm ci
EXPO_PUBLIC_ENABLE_DEMO=1 ./scripts/ios.sh
```

Tap **Open demo journal**. The seeded workspace has two routines, six finished sessions, three set types, a lift goal, and four bodyweight readings. Demo access requires a development bundle and the explicit flag. It uses its own SQLite owner and never syncs. Expo Go lacks the Live Activity extension. [Expo Widgets documentation](https://docs.expo.dev/versions/v56.0.0/sdk/widgets/)

The script uses a temporary directory if the workspace path has spaces. The React Native 0.85 CocoaPods helper failed to construct a local prebuilt-artifact URL with spaces during verification. It also points prebuilt artifact downloads directly to the React Native Maven endpoint. Pass `--device <simulator-UUID>` if more than one simulator is booted. If the app is already installed, launch Metro from this directory with the following command and press **i** to open the installed development client.

```sh
EXPO_PUBLIC_ENABLE_DEMO=1 npx expo start --dev-client --localhost
```

## Run the account and sync flow locally

Start Docker. The supplied Supabase configuration uses project ID `formwork-attempt3` and ports 56320–56324. The CLI installs both migrations. This backend can run alongside the other attempts.

```sh
npm ci
npx --yes supabase@3.0.0 start
cp .env.example .env.local
npx --yes supabase@3.0.0 status
```

Set `EXPO_PUBLIC_SUPABASE_URL` in `.env.local` to the printed project API URL and set `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` to the public client key. On the simulator the local API is `http://127.0.0.1:56321`. Keep private keys out of the client. Restart Metro after changing its environment. Start the simulator build as above, with the demo flag omitted for the account-only flow.

Register two distinct local test accounts of your choice. The local stack enables immediate email/password sign-up. On a hosted project with confirmation enabled, confirm by email and return to sign in. Every account has the same lifter permissions and a separate journal. See [DEMO.md](DEMO.md) for the owner-isolation exercise. Supabase owns password and session handling. [Supabase React Native Auth](https://supabase.com/docs/guides/auth/quickstarts/react-native)

## Verification

```sh
npm run typecheck
npm test
npm run bundle:ios
npx expo install --check
./scripts/test-postgres.sh
```

The PostgreSQL test needs `initdb`, `pg_ctl` and `psql`. It starts a temporary Unix-socket-only PostgreSQL cluster and executes the real migrations under simulated authenticated and anonymous PostgreSQL roles. The optional `node scripts/test-supabase.mjs` check uses `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` from the environment to exercise signup and the actual API on the local stack. Run it with `node --env-file=.env.local scripts/test-supabase.mjs`. It creates two synthetic accounts on the local backend.

## Data and distribution

SQLite stores full aggregate snapshots in owner partitions. A transaction commits the new snapshot, immutable outbox payload, and any updated local timer together. The authenticated Supabase API checks ownership, typed fields, references, expected revisions and operation receipts. Its pull feed includes tombstones. Profile → Settings shows upload state and conflict review. Timer deadlines and OS notification requests stay device-local.

The offline catalog is built from 876 records at Free Exercise DB commit `f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5`. The import script checks the source checksum, derives the logging type and retains stable upstream IDs. Only metadata is bundled. [Pinned catalog](https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5) · [Unlicense](data/LICENSE-Free-Exercise-DB.md)

For TestFlight, link an EAS project, apply the migrations to a separate Supabase project and configure the two public environment variables. Register the main and widget bundle IDs and their app group with the signing team. Once App Store Connect and signing are configured, run `eas build --platform ios --profile production` and `eas submit --platform ios --profile production`. TestFlight distribution needs Apple Developer access and an App Store Connect app record. Physical iPhone checks include Live Activity background behavior and notifications. The simulator demo needs no paid credentials.

[Requirements and evidence](REQUIREMENTS.md) · [Assumptions](ASSUMPTIONS.md) · [Demo walkthrough](DEMO.md)
