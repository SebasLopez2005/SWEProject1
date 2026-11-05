# Generation and diagram-iteration log

Status as of November 4, 2026: **initial design merged and the local ChatGPT implementation generated**. Independent Claude output and TestFlight distribution remain pending.

## Preparation D0

- Student selected Expo/TestFlight, then explicitly chose **Claude gym scope + Supabase**.
- Archived Part 1 without changing file content; selected the reviewed 31-story Word final.
- Initial design artifacts: context, architecture, navigation, data, module-class and per-story sequence models. Proposed rules cover local durability, typed sets, sync conflicts and units.
- Initial design PRs: [merged PR index and commit records](PR_HISTORY.md); #45 includes the revised requirements alignment.
- Runtime/demo validation: not yet possible; no generated app.

## Round records

| Round | Frozen design / merged PR | ChatGPT model + code commit | Claude model + code commit | Acceptance evidence / gaps | Decision |
| --- | --- | --- | --- | --- | --- |
| 1 candidate | `9dc200da72010ef32dd43b7864c268d2bb058f28`, through #45 | Codex, GPT-6 family. Local source under [apps/chatgpt](../../../apps/chatgpt/README.md). | Pending | [Story evidence](../../../apps/chatgpt/REQUIREMENTS.md) | Paired comparison pending. This invocation used the student brief. |
| 2 | Not run | Not run | Not run | None yet | Only if evidence justifies diagram revision |
| 3 | Not run | Not run | Not run | None yet | Final allowed paired round |

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
- The generated output and test record are local. No hosted project, comparison result, TestFlight link or published implementation commit exists for this run.

### Native validation

The iPhone 17 Pro iOS 26.5 demo XCTest and separate local Supabase API-outage XCTest passed. The latter registered a local account, saved while Kong was stopped, and observed Uploaded after restart. Screenshots of entry, summary, weekly chart and 200% Settings were reviewed. Source reports remaining native and distribution checks in `apps/chatgpt/REQUIREMENTS.md`.
