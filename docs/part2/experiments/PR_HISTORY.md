# Initial design pull-request history

Published November 3, 2026 at the student's request: one diagram per PR. These are stacked **draft** PRs. Each PR is based on the previous branch, so its diff shows only its own addition. GitHub's base field identifies that dependency. Nothing has been merged and no app generation has run.

The source design was prepared locally in commit `8d2e633` on November 2. Splitting that draft into review PRs is an organization step, not evidence of historical product iterations or a successful/failed one-shot. Part 1 files are unchanged relocations.

| Order | Artifact | Pull request | Depends on branch | Commit |
| --- | --- | --- | --- | --- |
| 00 | Part 2 setup: archive Part 1 and organize the repository | [PR #2](https://github.com/SebasLopez2005/SWEProject1/pull/2) | `main` | `172247c` |
| 01 | Design 01: Context and functional modules | [PR #3](https://github.com/SebasLopez2005/SWEProject1/pull/3) | `codex/p2-00-repo-organization` | `315b8bd` |
| 02 | Design 02: Runtime architecture and distribution | [PR #4](https://github.com/SebasLopez2005/SWEProject1/pull/4) | `codex/p2-01-01-context` | `8e17dab` |
| 03 | Design 03: Screen navigation | [PR #5](https://github.com/SebasLopez2005/SWEProject1/pull/5) | `codex/p2-02-02-architecture` | `95dae5a` |
| 04 | Design 04: Persistent entity relationships | [PR #6](https://github.com/SebasLopez2005/SWEProject1/pull/6) | `codex/p2-03-03-navigation` | `bb3e295` |
| 05 | Design 05: Class model: controllers and account access | [PR #7](https://github.com/SebasLopez2005/SWEProject1/pull/7) | `codex/p2-04-04-data-model` | `be62e16` |
| 06 | Design 06: Class model: domain entities and services | [PR #8](https://github.com/SebasLopez2005/SWEProject1/pull/8) | `codex/p2-05-classes-01-ui-and-auth` | `a6ec401` |
| 07 | Design 07: Class model: repositories and backend handlers | [PR #9](https://github.com/SebasLopez2005/SWEProject1/pull/9) | `codex/p2-06-classes-02-domain` | `1e2d522` |
| 08 | Design 08: Class model: conversion, progress and readability | [PR #10](https://github.com/SebasLopez2005/SWEProject1/pull/10) | `codex/p2-07-classes-03-persistence-and-sync` | `77d578a` |
| 09 | Design 09: Class model: synchronization records | [PR #11](https://github.com/SebasLopez2005/SWEProject1/pull/11) | `codex/p2-08-classes-04-presentation` | `6c31caf` |
| 10 | Design 10: Supporting sequence: authentication and bootstrap | [PR #12](https://github.com/SebasLopez2005/SWEProject1/pull/12) | `codex/p2-09-classes-05-sync-records` | `508f35b` |
| 11 | Design 11: Supporting sequence: reviewed conflict resolution | [PR #13](https://github.com/SebasLopez2005/SWEProject1/pull/13) | `codex/p2-10-sequence-sup-01-auth-and-bootstrap` | `7d07f09` |
| 12 | Design 12: FW-01: Start a workout, add exercises | [PR #14](https://github.com/SebasLopez2005/SWEProject1/pull/14) | `codex/p2-11-sequence-sup-02-conflict-resolution` | `b13f2b7` |
| 13 | Design 13: FW-02: Record a set with prefill | [PR #15](https://github.com/SebasLopez2005/SWEProject1/pull/15) | `codex/p2-12-sequence-fw-01` | `59ce073` |
| 14 | Design 14: FW-03: Set form matches exercise type | [PR #16](https://github.com/SebasLopez2005/SWEProject1/pull/16) | `codex/p2-13-sequence-fw-02` | `c6feb7f` |
| 15 | Design 15: FW-04: See previous performance | [PR #17](https://github.com/SebasLopez2005/SWEProject1/pull/17) | `codex/p2-14-sequence-fw-03` | `2c699bd` |
| 16 | Design 16: FW-05: Correct or remove a set or entry | [PR #18](https://github.com/SebasLopez2005/SWEProject1/pull/18) | `codex/p2-15-sequence-fw-04` | `f70fd8e` |
| 17 | Design 17: FW-06: Finish workout, see summary | [PR #19](https://github.com/SebasLopez2005/SWEProject1/pull/19) | `codex/p2-16-sequence-fw-05` | `74eb34b` |
| 18 | Design 18: FW-07: Resume an unfinished workout | [PR #20](https://github.com/SebasLopez2005/SWEProject1/pull/20) | `codex/p2-17-sequence-fw-06` | `f9b9407` |
| 19 | Design 19: FW-08: Record a workout on an earlier date | [PR #21](https://github.com/SebasLopez2005/SWEProject1/pull/21) | `codex/p2-18-sequence-fw-07` | `4309238` |
| 20 | Design 20: FW-09: Log offline, upload later | [PR #22](https://github.com/SebasLopez2005/SWEProject1/pull/22) | `codex/p2-19-sequence-fw-08` | `26670dc` |
| 21 | Design 21: FW-10: Choose kg or lb | [PR #23](https://github.com/SebasLopez2005/SWEProject1/pull/23) | `codex/p2-20-sequence-fw-09` | `2d71967` |
| 22 | Design 22: FW-11: Find an exercise; recent first | [PR #24](https://github.com/SebasLopez2005/SWEProject1/pull/24) | `codex/p2-21-sequence-fw-10` | `25fd1dc` |
| 23 | Design 23: FW-12: Create a custom exercise | [PR #25](https://github.com/SebasLopez2005/SWEProject1/pull/25) | `codex/p2-22-sequence-fw-11` | `4e91110` |
| 24 | Design 24: FW-13: Rename or archive a custom exercise | [PR #26](https://github.com/SebasLopez2005/SWEProject1/pull/26) | `codex/p2-23-sequence-fw-12` | `ee3b025` |
| 25 | Design 25: FW-14: List finished workouts | [PR #27](https://github.com/SebasLopez2005/SWEProject1/pull/27) | `codex/p2-24-sequence-fw-13` | `e640235` |
| 26 | Design 26: FW-15: Open a past workout | [PR #28](https://github.com/SebasLopez2005/SWEProject1/pull/28) | `codex/p2-25-sequence-fw-14` | `c3887e9` |
| 27 | Design 27: FW-16: History of one exercise | [PR #29](https://github.com/SebasLopez2005/SWEProject1/pull/29) | `codex/p2-26-sequence-fw-15` | `7d12f0c` |
| 28 | Design 28: FW-17: Edit a finished workout | [PR #30](https://github.com/SebasLopez2005/SWEProject1/pull/30) | `codex/p2-27-sequence-fw-16` | `444b70b` |
| 29 | Design 29: FW-18: Delete a finished workout | [PR #31](https://github.com/SebasLopez2005/SWEProject1/pull/31) | `codex/p2-28-sequence-fw-17` | `7667c71` |
| 30 | Design 30: FW-19: Filter history | [PR #32](https://github.com/SebasLopez2005/SWEProject1/pull/32) | `codex/p2-29-sequence-fw-18` | `94b0ff3` |
| 31 | Design 31: FW-20: Per-exercise volume graph | [PR #33](https://github.com/SebasLopez2005/SWEProject1/pull/33) | `codex/p2-30-sequence-fw-19` | `e619f23` |
| 32 | Design 32: FW-21: Choose the period | [PR #34](https://github.com/SebasLopez2005/SWEProject1/pull/34) | `codex/p2-31-sequence-fw-20` | `0b1c48d` |
| 33 | Design 33: FW-22: Overall weekly volume graph | [PR #35](https://github.com/SebasLopez2005/SWEProject1/pull/35) | `codex/p2-32-sequence-fw-21` | `c252e84` |
| 34 | Design 34: FW-23: Reps-only total reps graph | [PR #36](https://github.com/SebasLopez2005/SWEProject1/pull/36) | `codex/p2-33-sequence-fw-22` | `6b560ca` |
| 35 | Design 35: FW-24: Select a point, open workout | [PR #37](https://github.com/SebasLopez2005/SWEProject1/pull/37) | `codex/p2-34-sequence-fw-23` | `817c678` |
| 36 | Design 36: FW-25: Save workout as template | [PR #38](https://github.com/SebasLopez2005/SWEProject1/pull/38) | `codex/p2-35-sequence-fw-24` | `f7b1fe1` |
| 37 | Design 37: FW-26: Start workout from template | [PR #39](https://github.com/SebasLopez2005/SWEProject1/pull/39) | `codex/p2-36-sequence-fw-25` | `0826678` |
| 38 | Design 38: FW-27: Create and edit a template | [PR #40](https://github.com/SebasLopez2005/SWEProject1/pull/40) | `codex/p2-37-sequence-fw-26` | `0fd643f` |
| 39 | Design 39: FW-28: Delete a template | [PR #41](https://github.com/SebasLopez2005/SWEProject1/pull/41) | `codex/p2-38-sequence-fw-27` | `19a24f6` |
| 40 | Design 40: FW-29: Larger text size | [PR #42](https://github.com/SebasLopez2005/SWEProject1/pull/42) | `codex/p2-39-sequence-fw-28` | `f54615e` |
| 41 | Design 41: FW-30: See both units | [PR #43](https://github.com/SebasLopez2005/SWEProject1/pull/43) | `codex/p2-40-sequence-fw-29` | `9c624d2` |
| 42 | Design 42: FW-31: Enter a set in either unit | [PR #44](https://github.com/SebasLopez2005/SWEProject1/pull/44) | `codex/p2-41-sequence-fw-30` | `a511656` |
| 43 | Part 2 documentation: coverage, generation protocol and PR index | [PR #45](https://github.com/SebasLopez2005/SWEProject1/pull/45) | `codex/p2-42-sequence-fw-31` | `028222a` |

## How to record a real one-shot iteration

Keep both models on the same frozen design commit. After an actual run, record the exact model/round, app commit, tests, success/failure evidence and affected FW story. A later revision PR should change the relevant diagram and mirrored explanation, link that evidence, and state why the change addresses the failure. A success is recorded as observed evidence, not an invented diagram change.

Opening a draft PR does not consume a generation round. These initial PRs are intentionally unmerged. Before merging the initial stack, agree how its assembly satisfies the assignment's generation-after-merge requirement; do not interpret 42 initial diagram proposals as 42 generation rounds. The assessed workflow still permits at most three paired rounds under the documented conservative protocol.
