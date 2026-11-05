# Generation and diagram-iteration log

Status as of November 2, 2026: **design draft only; 0 app generations**. This preparation is not evidence of any implemented feature.

## Preparation D0

- Student selected Expo/TestFlight, then explicitly chose **Claude gym scope + Supabase**.
- Archived Part 1 without changing file content; selected the reviewed 31-story Word final.
- Drafted context, architecture, navigation, data, module-class and per-story sequence models. Added explicit local durability, typed-set, sync-conflict and unit rules to resolve open assumptions.
- Initial design PRs: [stacked draft PR index](PR_HISTORY.md); no merge commit yet.
- Runtime/demo validation: not yet possible; no generated app.

## Round records

| Round | Frozen design / merged PR | ChatGPT model + code commit | Claude model + code commit | Acceptance evidence / gaps | Decision |
| --- | --- | --- | --- | --- | --- |
| 1 | Not run | Not run | Not run | None yet | Pending team design review |
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
