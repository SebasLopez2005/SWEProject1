# Assumptions and documentation conflicts

Consequential decisions made while implementing the design autonomously. Each names the source and the chosen interpretation so the team can review it in a later diagram revision.

## Product and scope

| # | Topic | Source / conflict | Decision |
| --- | --- | --- | --- |
| A-1 | Scope | `ONE_SHOT.md` names 31 FW stories; `TRAINING_REQUIREMENTS_DRAFT.md` (TR-01–13), the updated diagrams and `CONTRACTS.md` add planned training. `SCOPE.md` (older) lists rest timers and bodyweight as out of scope. | The newer diagrams + contracts win (they explicitly supersede the Nov 4 baseline). All 31 FW stories and TR-01–13 are implemented. |
| A-2 | Independence | `experiments/README.md`: a model must not read another model's generated app. | `apps/chatgpt` was never opened. Only design docs, diagrams and the revised report text in `SELECTED_STORIES.md` were used. |
| A-3 | App name | No name mandated ("working name Fitness & Workout Log"). User asked for a Claude-chosen name. | **Repwise**. Bundle id `com.swiftlycr.repwise.claude`, Expo slug `repwise-claude`. |
| A-4 | Roles | One actor type (lifter personas). No admin/coach role in any story. | Single role. "Roles" in the demo = the four personas and two accounts/devices for isolation and conflict checks. |
| A-5 | Interface | `ROUND_02_UI.md` (dark, champagne, Liquid Glass) was written for the ChatGPT revision but the training draft says to retain it. | Dark graphite/champagne theme; secondary actions use native Liquid Glass when available and not under Reduce Transparency, else solid. Primary actions are solid champagne for guaranteed contrast. |
| A-6 | Set entry UX | BL-06 (observed): per-set modal was too slow. | Inline editable row with suggestions prefilled, recorded by one check-mark tap; plan target shown separately and never overwritten. |

## Data and rules

| # | Topic | Decision |
| --- | --- | --- |
| D-1 | Identity of catalog exercises | Free Exercise DB (pinned revision `f00c92c`, SHA-256 verified at build) mapped to **UUIDv5** from the source id, so IDs are stable across catalog refreshes and identical on device and server. |
| D-2 | Logging type for catalog rows | Derived: stretching/cardio/foam-roll/hold-type names → seconds; body-only/bands/exercise-ball → reps only; everything else → weight and reps. 600 / 124 / 152 split. Categories remain separate from logging type. |
| D-3 | Unit conversion | 1 kg = 2.20462 lb; stored weight/unit never rewritten; aggregate unrounded, round display to 0.1. Goal comparison compares at the 0.1 display resolution so 102.1 kg (225.09 lb) meets 225 lb (TR-09 example). |
| D-4 | Weight input precision | Weights accept at most one decimal (0.1 resolution) to match the 999.9 limit and `numeric(5,1)` storage. |
| D-5 | RIR | Optional whole number 0–10 for rep-based work; target ranges validated independently of actuals. |
| D-6 | Sets / rest limits | Planned sets 1–20, rest 5–1800 s (not specified in sources; chosen as reasonable validation, not capacity promises). Default ad hoc rest 90 s. |
| D-7 | Rest start rule | Rest starts after a completed **working** set when the entry rule allows it and, for planned sessions, another pending working row remains; ad hoc sessions always offer rest (you can skip). |
| D-8 | Finishing | ≥1 completed working set required. Planned pending rows become `skipped` only after explicit confirmation. Blank ad hoc rows are removed; exercises left with no rows are dropped and named in the summary (FW-06). |
| D-9 | Backdated workouts | `backdated = true` when the date differs from today at start; finish stores no duration ("do not invent backdated duration"). |
| D-10 | Finished-workout edits | Edits save immediately (no draft). Removing the last completed working set is refused with "delete the workout instead" (FW-17). New sets on a finished workout require values. |
| D-11 | Undo | One undo token for set/entry deletion during a workout or edit; it expires after any other mutation, navigation away, or 10 s. Finished-workout deletion has no undo (FW-18). |
| D-12 | Warm-up / mobility content | Generated from the catalog: general cardio (Rope Jumping etc.), 40/60/80 % ramp sets for the first weighted lift, and catalog stretches scored by muscle overlap. Copy describes preparation and avoids injury claims. |
| D-13 | Muscle map | Regions = the 17 catalog muscle tags. Primary 1.0, secondary 0.5, primary precedence, bands 0 / <3 / 3–<6 / 6–<10 / ≥10; untagged sets reported as "unmapped". |
| D-14 | Monthly milestones | "Lift milestone" = a new heaviest completed working set for a weighted exercise within the month that beats all earlier records. |
| D-15 | Recent exercises | "Last 10 used" is tracked by `last_used_at` per exercise on this device's partition. |

## Sync and accounts

| # | Topic | Decision |
| --- | --- | --- |
| S-1 | Partitioning | One SQLite file per owner (`repwise-<ownerId>.db`). Accounts never share a local database. |
| S-2 | Outbox squash | Operations that were **never attempted** and are superseded by a later snapshot of the same aggregate are removed before sending; any attempted op is resent with the same operation id (idempotency preserved). |
| S-3 | Server revisions | A per-owner `aggregate_heads` table holds the revision and last snapshot of every root; mutations are serialized per owner with an advisory lock so change-feed cursors commit in order. |
| S-4 | Conflict choices | Workout: keep cloud, or keep both (local saved as a new UUID). Other records: keep cloud or keep mine (explicit rebase). Non-revision conflicts (active workout elsewhere, name taken, type locked) and server rejections: retry after fixing, or keep on this device only. No automatic last-write-wins. |
| S-5 | Sign-out with pending work | Contract says block or explicit discard. Implemented: block with explanation, offering "Review sync" or "Sign out anyway" — the pending work is **kept** in that account's partition and uploads on next sign-in (safer than discarding). |
| S-6 | Device-only profile | When `EXPO_PUBLIC_ENABLE_DEVICE_PROFILES=true`, "Continue on this device only" creates a local owner that never uploads; labelled everywhere. It is a guest mode, not an auth bypass: it has no server access. |
| S-7 | Reminder horizon | Reminders are scheduled one request per eligible date for the next 14 days and reconciled on open/foreground/finish/settings change. |
| S-8 | Live Activity | Implemented with `expo-widgets` + `@expo/ui` SwiftUI `Text(timerInterval:)`, which counts down from the absolute deadline while the app is suspended. A paused rest shows the frozen remaining time. |

## Not done / environment-limited

- **Hosted Supabase project**: created after the student confirmed it in chat (Free plan, $0/month) and paused SwiftlyCR to stay within the free limit. Email confirmation is off for the demo.
- Background upload while iOS has suspended/terminated the app is not promised (per `SCOPE.md`).

## Round 2 (One Shot 2)

| # | Topic | Decision |
| --- | --- | --- |
| R2-1 | Process | The student asked to update the diagrams and "one shot the thing again". Following the ChatGPT Round 2 precedent, Round 2 revises the Claude app in place on branch `claude/one-shot-2`; Round 1 is preserved by tag `claude-one-shot-1`. |
| R2-2 | Body figure | `react-native-body-highlighter` (MIT). Its figures have no separate abductor region, so hip abductors shade the gluteal region. Lats and middle back share the upper-back region, shaded by the larger score; the list keeps every tag separate. |
| R2-3 | Form media | Pinned Free Exercise DB photos (start and end positions) load on demand and cache; they are not bundled. A looping two-frame demonstration stands in for video. Reduce Motion starts it paused. |
| R2-4 | Responsiveness | Each mutation records which data it touched (active workout, finished history, exercises, routines, settings, profile, sync). Screens reload only for their scopes and only while visible; upload acknowledgements no longer trigger data reloads. |
| R2-5 | Unit switch | The kg/lb switch moved from each row to the exercise card's weight column header. Every set still stores the unit it was entered in, and switching with typed values asks to convert or keep the numbers (FW-31). |
