# Generation and diagram-iteration log

The three ChatGPT runs and both Claude Repwise runs are recorded below. Formwork's internal TestFlight build came from its separate phone release branch.

## Preparation D0

- Student selected Expo/TestFlight, then explicitly chose **Claude gym scope + Supabase**.
- Archived Part 1 without changing file content; selected the reviewed 31-story Word final.
- Initial design artifacts: context, architecture, navigation, data, module-class and per-story sequence models. Proposed rules cover local durability, typed sets, sync conflicts and units.
- Initial design PRs: [merged PR index and commit records](PR_HISTORY.md); #45 includes the revised requirements alignment.
- Runtime/demo validation: not yet possible; no generated app.

## Round records

| Round | Frozen design / merged PR | ChatGPT model + code commit | Claude model + code commit | Acceptance evidence / gaps | Decision |
| --- | --- | --- | --- | --- | --- |
| [1 · initial implementation](round-01/chatgpt/README.md) | `9dc200da72010ef32dd43b7864c268d2bb058f28`, through #45 | Codex, GPT-6 family. Commit `86b9c83` merged in [PR #46](https://github.com/SebasLopez2005/SWEProject1/pull/46). | [Claude One Shot 1](round-01/claude/README.md), [PR #47](https://github.com/SebasLopez2005/SWEProject1/pull/47) | [Story evidence](../../../apps/chatgpt/REQUIREMENTS.md) | Paired comparison pending. This invocation used the student brief. |
| [2 · interface revision](round-02/chatgpt/README.md) | Round 1 merge `492476f` + [UI-01–03](../design/ROUND_02_UI.md) | Codex, GPT-6 family. Interface revision in [apps/chatgpt](../../../apps/chatgpt/README.md), [PR #49](https://github.com/SebasLopez2005/SWEProject1/pull/49). | [Claude One Shot 2](round-02/claude/README.md), [PR #48](https://github.com/SebasLopez2005/SWEProject1/pull/48) | iOS build and workout UI test, bundle exports, palette contrast and local tests | Student requested an interface revision of the existing app. |
| 3 | November 8 planned-training working tree, based on `492476f` | Codex, GPT-6 family. [Formwork snapshot](../../../apps/formwork/README.md), imported from source tag `attempt-3-one-shot` at `b918cde`. | Pending | iPhone simulator and local Supabase validated. Student found per-set modal entry impractical (BL-06). | Preserve the generated output for assessment. Track phone release work separately. |

## Per-run evidence template

- Round, exact model ID/settings, date and owner:
- Design commit and merged diagram PR URL:
- Exact prompt artifact and response artifact:
- Generated app commit and clean output location:
- Dependency/runtime versions and backend environment:
- Commands executed and outputs:
- Acceptance results per FW story (pass/fail/not tested, with evidence):
- Native deployment/build/tester evidence:
- Reproducible failures, diagnosis and affected diagram:
- Proposed next diagram revision and PR rationale:
- Remaining backlog IDs:

Do not replace 'not tested' with 'pass' because code appears to exist.

## Initial baseline integration November 4

All initial PRs #2–#45 were merged in dependency order with individual scope comments. #45 carries the revised professor-feedback alignment. The [PR index](PR_HISTORY.md) records merge commits and superseded wording. This paragraph records the design-only state before the first implementation.

## ChatGPT local run, November 4, 2026

- Input was the [attached student brief](round-01/chatgpt/USER_BRIEF.txt), the student's pointer to the local checkout and [SWEProject1](https://github.com/SebasLopez2005/SWEProject1), and the checked-in requirements and diagrams at the baseline above. The [shared prompt template](../prompts/ONE_SHOT.md) informed stack and design constraints. The student brief was the actual invocation.
- Codex desktop, GPT-6 family. Exact model variant and settings were not surfaced in the session. Output generated from an empty app directory in a single autonomous turn.
- Local backend was the Docker-backed Supabase CLI 3.0.0 stack named `chatgpt`. Xcode 26.6, iOS 26.5 simulator, Expo SDK 58 and Node 26.3.0 were used for validation. See [setup](../../../apps/chatgpt/README.md) and [acceptance evidence](../../../apps/chatgpt/REQUIREMENTS.md).
- The app and test record were published in [PR #46](https://github.com/SebasLopez2005/SWEProject1/pull/46). Hosted deployment, paired comparison and TestFlight remain pending.

### Native validation

The iPhone 17 Pro iOS 26.5 demo XCTest and separate local Supabase API-outage XCTest passed. The latter registered a local account, saved while Kong was stopped, and observed Uploaded after restart. Screenshots of entry, summary, weekly chart and 200% Settings were reviewed. Source reports remaining native and distribution checks in `apps/chatgpt/REQUIREMENTS.md`.

## ChatGPT interface revision, November 8, 2026

- Input was the [student brief](round-02/chatgpt/USER_BRIEF.txt). This run revised the existing app from Round 1 merge `492476f9d584dcbc64a35432c7fe2a6fc2b094f7`. The [interface requirement](../design/ROUND_02_UI.md) records the new acceptance criteria.
- Codex desktop, GPT-6 family. Exact model variant and settings were unavailable. Expo SDK 58 with `expo-glass-effect` 58.0.5, Xcode 26.6 and iPhone 17 Pro simulator running iOS 26.5.
- TypeScript, dependency compatibility, Expo Doctor 20/20, the iOS simulator build, and iOS and Android JavaScript exports passed. Six local tests passed. The optional Supabase integration test was skipped during this interface revision.
- Key solid palette pairings measured between 6.95:1 and 15.42:1. Glass colors depend on the surface beneath them and were checked visually in the simulator.
- The iOS workout UI test passed after a scoped debug filter kept the native animation diagnostic from covering the tab bar. The test exercised glass actions, set entry, force-close/resume, summary, chart drill-down, and 200% text settings.
- The native Supabase outage test was skipped. Android verification covered JavaScript export. The Reduce Transparency setting and older iOS fallback still need device walkthroughs.

## Planned training requirements, November 8, 2026

The student put the next one-shot generation on hold and requested a plan-first workout workflow. The [requirements draft](../design/TRAINING_REQUIREMENTS_DRAFT.md) records TR-01–13, the catalog source, and research. The [updated diagram guide](../design/README.md) and [traceability matrix](../design/TRACEABILITY.md) map those requirements to the design. All 50 Mermaid diagrams rendered to SVG and PNG. See the [verification record](../design/VERIFICATION.md).

## ChatGPT Attempt 3 evaluation, November 9, 2026

- The student requested a fresh one-shot app based on the planned-training design. The output was Formwork in a separate Attempt 3 directory. The exact model variant was unavailable. The [imported Formwork app](../../../apps/formwork/README.md) matches source tag `attempt-3-one-shot` at `b918cde`, including its original requirements evidence.
- The assessed build ran on the iPhone 17 Pro simulator. It saved and recovered a planned set and paused rest after force-close, then synced a finished workout after a local API outage. Its TypeScript suite passed nine tests. Physical device and TestFlight checks were open.
- Student evaluation, FW-02 and TR-02: recording a set worked, but opening and saving a separate form for every set made the workflow too slow in practice. Expected behavior is a workout row with editable weight and reps and a checkmark that records actuals in place. The fields may start blank or show editable suggestions. See [BL-06](../BACKLOG.md#observed-after-attempt-3).
- Follow-up on the separate `phone-release` branch at `9f65c04`: the simulator edited the bench row to 11 reps and confirmed it with one tap. The 12-rep target stayed intact and rest started. TypeScript, 11 tests, the iOS bundle, and the EAS production profile check passed.
- Release status: [Formwork was created and linked in Expo](https://expo.dev/accounts/swiftlycrdev/projects/formwork-attempt-3). Supabase project creation awaits account authentication. EAS detected the app and its Live Activity extension and requested Apple Developer authentication to provision them. No TestFlight build has been submitted.

## Formwork hosted release, November 9, 2026

- Apple accepted both bundle registrations after the account holder resolved the agreement. EAS provisioned the app and Live Activity extension using the existing distribution certificate and their shared App Group.
- Created the [Formwork Supabase project](https://supabase.com/dashboard/project/lelqzaknhtpgidemdlgy) in US East Ohio on the Free plan. Applied both migrations and verified that a repeat dry run found no pending migrations. Disposable confirmed accounts passed hosted sign-in, workout write and pull, replay, account isolation, conflict, and tombstone checks. The test accounts were removed after verification. Expo production uses the hosted URL and publishable key.
- The signed [EAS build 1](https://expo.dev/accounts/swiftlycrdev/projects/formwork-attempt-3/builds/712d9ffb-478e-4bd4-aa9f-a4f82e0e04cc) for version 1.0 completed. Expo reused the team’s existing App Store Connect submission key. The [submission](https://expo.dev/accounts/swiftlycrdev/projects/formwork-attempt-3/submissions/bd61e458-447b-4308-b4c1-9fde26909cd3) targets [Formwork (c23fbc)](https://appstoreconnect.apple.com/apps/6832569257/testflight/ios), the name assigned because Formwork was taken. The account holder is in the automatic **Team (Expo)** internal group.
- Apple processed version 1.0 (build 1) as valid. Added it to **Team (Expo)** and verified that the group includes the build and Apple reports `IN_BETA_TESTING`. Physical iPhone installation remains a tester step.
