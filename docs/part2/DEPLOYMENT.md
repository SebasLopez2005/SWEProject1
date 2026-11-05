# Expo, Supabase and TestFlight deployment plan

Status: planned, not executed. This plan supports the user's chosen distribution method; it does not consume a generation attempt or create external resources.

## Target environments

- **Device:** Expo React Native app with Expo Router, SQLite, auth-session persistence and native chart support. iOS is the delivery target; source should remain Android-compatible under the chosen Part 1 scope.
- **Hosted backend:** separate Supabase environments for independent model runs, with generated migrations/RLS/RPC/seed data. Models must not share a writable backend during comparison.
- **Build/distribution:** EAS Build makes a signed iOS store build; EAS Submit sends it to App Store Connect/TestFlight. This is distinct from launching Metro or Expo Go.

## Prerequisites before the first beta

1. Confirm an Expo/EAS account and a paid Apple Developer membership are available. Agree on who owns the Apple app record, bundle identifier and EAS project.
2. Create/link the correct Supabase environment after generation; apply the generated migrations, grants and RLS. Verify two test accounts cannot read/change each other's records. Keep separate test accounts for peer evaluation.
3. Configure the generated `.env.example` values. Expo public configuration includes only the Supabase URL and publishable client key. Private service-role keys and Apple signing credentials never go in the repo or mobile bundle.
4. Set email confirmation and mobile redirect behavior deliberately in Supabase. If confirmation is enabled, handle the pending-confirmation state. Test actual sign-in/session restoration on the target device; no secret demo bypass.
5. Configure the generated app's EAS project ID, unique bundle identifier, version/build number and App Store Connect app record. Exact SDK/dependency versions are chosen together at generation and locked.
6. Run generated type checks/tests, Expo checks and a native release smoke test. A web preview cannot establish SQLite lifecycle, native keyboard, text scaling or TestFlight behavior.

## Intended build path

Run from the chosen generated app folder after its generated EAS configuration has been reviewed:

```sh
npx eas-cli build --platform ios --profile production
npx eas-cli submit --platform ios --profile production
```

A TestFlight build uses store distribution. EAS internal/ad hoc distribution is a different path and should not be substituted without recording the change. The command versions and build IDs actually used belong in the run record. App Store Connect processing happens after upload; uploaded does not yet mean available to a tester.

Internal TestFlight testers belong to the App Store Connect team. External testers, including an instructor outside that team, need a testing group and may require Beta App Review. Arrange access early. Do not grant team/admin access merely to bypass external review.

## Classroom access

The assignment names deployment on a service such as Vercel/Railway. A hosted Supabase backend plus an installed TestFlight beta is the proposed mobile equivalent, but instructor acceptance has not been verified. Ask the instructor to confirm this delivery format before relying on it. If a public web demo is required, design it explicitly before generation rather than adding it secretly afterward; Expo SQLite on web has additional WASM and header requirements.

A screen recording and prepared data can support the presentation if internet or Apple processing is unavailable, but label them as recordings; do not claim they replace a required deployed working app.

## Beta acceptance evidence

Record the app/code/design commit, model/round, EAS build link, TestFlight version/build, backend environment, tester access and device/OS. Demonstrate sign-in isolation, airplane-mode recording, force-close/resume, automatic foreground reconnect upload, no duplicate after retry, edit/delete refresh, template independence, mixed-unit accuracy and text scaling. Record failures in the backlog rather than hand-patching the assessed generated app.

References checked November 2, 2026: [Expo TestFlight](https://docs.expo.dev/submit/testflight/), [Supabase integration](https://docs.expo.dev/guides/using-supabase/), [Expo SQLite web requirements](https://docs.expo.dev/versions/latest/sdk/sqlite/).
