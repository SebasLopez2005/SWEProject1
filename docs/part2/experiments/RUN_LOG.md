# Generation and diagram-iteration log

Status as of November 4, 2026: **initial design stack merged; 0 app generations**. This preparation is not evidence of any implemented feature.

## Preparation D0

- Student selected Expo/TestFlight, then explicitly chose **Claude gym scope + Supabase**.
- Archived Part 1 without changing file content; selected the reviewed 31-story Word final.
- Initial design artifacts: context, architecture, navigation, data, module-class and per-story sequence models. Proposed rules cover local durability, typed sets, sync conflicts and units.
- Initial design PRs: [merged PR index and commit records](PR_HISTORY.md); #45 includes the revised requirements alignment.
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

## Initial baseline integration November 4

All initial PRs #2–#45 were merged in dependency order with individual scope comments. #45 carries the revised professor-feedback alignment. The [PR index](PR_HISTORY.md) records merge commits and superseded wording. Record the exact main commit supplied to both models before round 1; no application generation has run.
