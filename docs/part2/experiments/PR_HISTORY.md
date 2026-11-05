# Initial design pull-request history

Published November 3, 2026 at the student's request: one diagram per PR. Originally published as stacked draft PRs, one per diagram. On November 4, 2026, all 44 PRs (#2–#45) were commented on and merged in dependency order into main at the repository owner's request. Bases were changed to main immediately before merging. Original dependency branches remain recorded below; merge commits preserve the individual history. No app generation has run.

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

Opening a draft PR does not consume a generation round. These initial PRs are now merged as one baseline assembly. Their merges do not establish the instructor's interpretation of generation-after-merge; do not interpret 42 initial diagram proposals as 42 generation rounds. The assessed workflow still permits at most three paired rounds under the documented conservative protocol.

## November 4 integration record

PR #45 includes commit `bf4cc11`, aligning the entire design with the revised professor-reviewed report. Earlier diagrams remain meaningful initial artifacts; their persona-name wording and the specific FW-04/FW-11/FW-12/FW-14, navigation and template behavior are superseded where described in the [alignment review](../design/REVISED_REPORT_REVIEW.md). Each PR has a coverage comment. No PR was silently discarded as moot.

| PR | Result | Merge commit |
| --- | --- | --- |
| [#2](https://github.com/SebasLopez2005/SWEProject1/pull/2) | Merged | [`8446747d`](https://github.com/SebasLopez2005/SWEProject1/commit/8446747d97e6a535d38c86b8a580e4742c0bcc85) |
| [#3](https://github.com/SebasLopez2005/SWEProject1/pull/3) | Merged | [`a4ee06e6`](https://github.com/SebasLopez2005/SWEProject1/commit/a4ee06e64355aebf38771f474731d20a9a9c162d) |
| [#4](https://github.com/SebasLopez2005/SWEProject1/pull/4) | Merged | [`4943b945`](https://github.com/SebasLopez2005/SWEProject1/commit/4943b94526e37e4b73d0f74c6ff640ab15b92ba8) |
| [#5](https://github.com/SebasLopez2005/SWEProject1/pull/5) | Merged | [`d6ddab85`](https://github.com/SebasLopez2005/SWEProject1/commit/d6ddab85c071b95fc34b2e6d4a1c07a32f1e01ee) |
| [#6](https://github.com/SebasLopez2005/SWEProject1/pull/6) | Merged | [`edb2a26a`](https://github.com/SebasLopez2005/SWEProject1/commit/edb2a26ac24d02fe6b0492c5a5156163caa5c95b) |
| [#7](https://github.com/SebasLopez2005/SWEProject1/pull/7) | Merged | [`70d913b3`](https://github.com/SebasLopez2005/SWEProject1/commit/70d913b3b3a33f7a8e6a044e0ee42df8bf356033) |
| [#8](https://github.com/SebasLopez2005/SWEProject1/pull/8) | Merged | [`d4108e61`](https://github.com/SebasLopez2005/SWEProject1/commit/d4108e613eed877c894a33074e2abc01552bbf05) |
| [#9](https://github.com/SebasLopez2005/SWEProject1/pull/9) | Merged | [`a5144de6`](https://github.com/SebasLopez2005/SWEProject1/commit/a5144de6c0234bce14b775bb20f84252325da57c) |
| [#10](https://github.com/SebasLopez2005/SWEProject1/pull/10) | Merged | [`b190d1ad`](https://github.com/SebasLopez2005/SWEProject1/commit/b190d1ada414f8ce6621454cee19f2b42fe7c2a2) |
| [#11](https://github.com/SebasLopez2005/SWEProject1/pull/11) | Merged | [`8f949a03`](https://github.com/SebasLopez2005/SWEProject1/commit/8f949a030d3c557e54fb9b2b0ac0ea5432e8a2be) |
| [#12](https://github.com/SebasLopez2005/SWEProject1/pull/12) | Merged | [`f7caf87a`](https://github.com/SebasLopez2005/SWEProject1/commit/f7caf87a56640154b783d2bc1a8f3e2fb5eefca5) |
| [#13](https://github.com/SebasLopez2005/SWEProject1/pull/13) | Merged | [`cc5cde1d`](https://github.com/SebasLopez2005/SWEProject1/commit/cc5cde1daa9f640f2aeb77d6cd38435bdb6ea17c) |
| [#14](https://github.com/SebasLopez2005/SWEProject1/pull/14) | Merged | [`0718d546`](https://github.com/SebasLopez2005/SWEProject1/commit/0718d5467edc749ad516bdfdfe7d033c5cbfc9b7) |
| [#15](https://github.com/SebasLopez2005/SWEProject1/pull/15) | Merged | [`5e440d0f`](https://github.com/SebasLopez2005/SWEProject1/commit/5e440d0fb811eade2727aafb8d49a7f6e4d7dcc0) |
| [#16](https://github.com/SebasLopez2005/SWEProject1/pull/16) | Merged | [`25ba71c8`](https://github.com/SebasLopez2005/SWEProject1/commit/25ba71c84dc03d6016ad12aca7cd3e14b952e1cc) |
| [#17](https://github.com/SebasLopez2005/SWEProject1/pull/17) | Merged | [`cea1acba`](https://github.com/SebasLopez2005/SWEProject1/commit/cea1acba315495ad1197fba0472dee5872b7d3b6) |
| [#18](https://github.com/SebasLopez2005/SWEProject1/pull/18) | Merged | [`d1cf7b62`](https://github.com/SebasLopez2005/SWEProject1/commit/d1cf7b6253490d40a79d1d1ac7a9d7ee2ca7d00d) |
| [#19](https://github.com/SebasLopez2005/SWEProject1/pull/19) | Merged | [`e732d0d9`](https://github.com/SebasLopez2005/SWEProject1/commit/e732d0d96316f41fb3a224d0ab6d72ac3d5c68ce) |
| [#20](https://github.com/SebasLopez2005/SWEProject1/pull/20) | Merged | [`2c9d8837`](https://github.com/SebasLopez2005/SWEProject1/commit/2c9d883724e014120cc5df7ae9d7056acdb3a4b4) |
| [#21](https://github.com/SebasLopez2005/SWEProject1/pull/21) | Merged | [`daa66c01`](https://github.com/SebasLopez2005/SWEProject1/commit/daa66c012781d6b9c9f5c47f774a1db0b2c51d37) |
| [#22](https://github.com/SebasLopez2005/SWEProject1/pull/22) | Merged | [`b422630a`](https://github.com/SebasLopez2005/SWEProject1/commit/b422630a0f912c6931d81488549eb31ade03a281) |
| [#23](https://github.com/SebasLopez2005/SWEProject1/pull/23) | Merged | [`ba3d41bc`](https://github.com/SebasLopez2005/SWEProject1/commit/ba3d41bc7a3862f35f7774c7399aa4840aff98c1) |
| [#24](https://github.com/SebasLopez2005/SWEProject1/pull/24) | Merged | [`7fe60e9c`](https://github.com/SebasLopez2005/SWEProject1/commit/7fe60e9c5fcd66dca04297c85fae9e90991589c9) |
| [#25](https://github.com/SebasLopez2005/SWEProject1/pull/25) | Merged | [`a7bd60aa`](https://github.com/SebasLopez2005/SWEProject1/commit/a7bd60aab15abc140bf2713b71063e44df5a86c2) |
| [#26](https://github.com/SebasLopez2005/SWEProject1/pull/26) | Merged | [`645a31e7`](https://github.com/SebasLopez2005/SWEProject1/commit/645a31e7aa08d7fc80e465ddbb196da3a0349a48) |
| [#27](https://github.com/SebasLopez2005/SWEProject1/pull/27) | Merged | [`9dfabffb`](https://github.com/SebasLopez2005/SWEProject1/commit/9dfabffbf986516fb6b85bc7e79685eb27981ccf) |
| [#28](https://github.com/SebasLopez2005/SWEProject1/pull/28) | Merged | [`523c2b34`](https://github.com/SebasLopez2005/SWEProject1/commit/523c2b34ab75c0be666a10c4d33f2cd77895dd04) |
| [#29](https://github.com/SebasLopez2005/SWEProject1/pull/29) | Merged | [`feb25b7f`](https://github.com/SebasLopez2005/SWEProject1/commit/feb25b7faa0fb0f0a49367967fa019837ebf79a2) |
| [#30](https://github.com/SebasLopez2005/SWEProject1/pull/30) | Merged | [`3ecade74`](https://github.com/SebasLopez2005/SWEProject1/commit/3ecade74b5fa2a78033664a6efd8db414443f7e1) |
| [#31](https://github.com/SebasLopez2005/SWEProject1/pull/31) | Merged | [`50e79a7c`](https://github.com/SebasLopez2005/SWEProject1/commit/50e79a7cc4a98e2a6fa70983da99520d11c6063b) |
| [#32](https://github.com/SebasLopez2005/SWEProject1/pull/32) | Merged | [`e86045bb`](https://github.com/SebasLopez2005/SWEProject1/commit/e86045bb451e2a856e6288deaa262c8df9f3aebf) |
| [#33](https://github.com/SebasLopez2005/SWEProject1/pull/33) | Merged | [`4b1fac3d`](https://github.com/SebasLopez2005/SWEProject1/commit/4b1fac3d85cbbcf30307432cd94e8424e3d8d8f9) |
| [#34](https://github.com/SebasLopez2005/SWEProject1/pull/34) | Merged | [`d2dc909e`](https://github.com/SebasLopez2005/SWEProject1/commit/d2dc909e69b188a6076e5e743c86998eeb17183c) |
| [#35](https://github.com/SebasLopez2005/SWEProject1/pull/35) | Merged | [`c590f9f5`](https://github.com/SebasLopez2005/SWEProject1/commit/c590f9f54fd56243e49996dbf52146468fc5bea0) |
| [#36](https://github.com/SebasLopez2005/SWEProject1/pull/36) | Merged | [`d246b5ff`](https://github.com/SebasLopez2005/SWEProject1/commit/d246b5ff6cf866261b5ef5a7f737b951f13cb94b) |
| [#37](https://github.com/SebasLopez2005/SWEProject1/pull/37) | Merged | [`076dca02`](https://github.com/SebasLopez2005/SWEProject1/commit/076dca02f08f7e2845ffc20cdc15670b8d595970) |
| [#38](https://github.com/SebasLopez2005/SWEProject1/pull/38) | Merged | [`cefd73b2`](https://github.com/SebasLopez2005/SWEProject1/commit/cefd73b2856b38f1c10c94eb1cec2eed18c48293) |
| [#39](https://github.com/SebasLopez2005/SWEProject1/pull/39) | Merged | [`a4f602ac`](https://github.com/SebasLopez2005/SWEProject1/commit/a4f602ac64e613c14b86e7be78f649349ed45896) |
| [#40](https://github.com/SebasLopez2005/SWEProject1/pull/40) | Merged | [`8004be7c`](https://github.com/SebasLopez2005/SWEProject1/commit/8004be7cc05d242e7e5407efa36d22897f89c6dc) |
| [#41](https://github.com/SebasLopez2005/SWEProject1/pull/41) | Merged | [`4ae6f20b`](https://github.com/SebasLopez2005/SWEProject1/commit/4ae6f20bf456d1692ccd9ee841272536db55fb42) |
| [#42](https://github.com/SebasLopez2005/SWEProject1/pull/42) | Merged | [`0ec4631b`](https://github.com/SebasLopez2005/SWEProject1/commit/0ec4631b67561b8ebef23a3c99cc3f0f57544947) |
| [#43](https://github.com/SebasLopez2005/SWEProject1/pull/43) | Merged | [`9ffb9ad8`](https://github.com/SebasLopez2005/SWEProject1/commit/9ffb9ad8833fcd9b52a48c89351433c3218d2384) |
| [#44](https://github.com/SebasLopez2005/SWEProject1/pull/44) | Merged | [`75e23c82`](https://github.com/SebasLopez2005/SWEProject1/commit/75e23c820585c882cf5925a9ae9e20de5171479c) |
| [#45](https://github.com/SebasLopez2005/SWEProject1/pull/45) | Merged | [`c0892b28`](https://github.com/SebasLopez2005/SWEProject1/commit/c0892b28453de35495d1d885c364fe1571671c87) |
