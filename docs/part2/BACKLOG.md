# Backlog and hypothetical first sprint

Status: **provisional planning, before code generation**. All 31 selected stories remain in the design and one-shot target. Nothing is deferred merely to shrink the diagram set. The actual post-attempt backlog must be based on observed gaps; no failed implementation is claimed here.

## How to record remaining work after the final assessed round

Use a stable backlog ID, persona/task/benefit user story, affected FW IDs, observed failure and evidence, acceptance checks, dependencies, priority, estimate rationale and team review status. Split large cross-cutting work into independently demonstrable outcomes. Preserve the original FW IDs when a whole selected story remains missing. Infrastructure tasks should link to a user outcome rather than pretend to be personas.

The source 101 points are initial Part 1 estimates. Re-estimate remaining work against a common reference after evidence, using independent estimates, simultaneous reveal, discussion and agreement. Do not equate model line counts, points, elapsed generation time or story counts with measured team velocity.

## Candidate future stories - activate only if tests show these gaps

| ID | Candidate story | Evidence needed to activate | Acceptance / dependencies | Initial size rationale |
| --- | --- | --- | --- | --- |
| BL-01 | As Elena, I want my confirmed sets to survive restart so that losing signal or closing the app does not lose my workout. | Reproduced FW-07/FW-09 durability failure | Force-close restores exactly the acknowledged sets; failed local transaction is not acknowledged. Local schema/transaction path first. | 5: persistence and lifecycle; re-estimate after diagnosis |
| BL-02 | As Elena, I want a pending workout to upload once after reconnection so that my history is complete without duplicates. | Reproduced upload/retry/conflict failure in FW-09 | Lost-response retry produces one remote record; explicit conflict preserves both versions; owner isolation. Depends on BL-01 if active. | 8: cross-system protocol and uncertain gaps; split after diagnosis |
| BL-03 | As Tomas, I want entered kg/lb weights preserved and displayed consistently so that I can compare sessions across gyms. | Reproduced FW-10/30/31 conversion mismatch | Original unit/value unchanged; display examples and mixed-unit totals agree across views. | 5: several readers and shared conversion path |
| BL-04 | As Marcus, I want history and graphs to reflect corrections so that I can trust the progress I see. | Reproduced FW-17/18/20/22 stale-data failure | Edit/delete changes previous performance, history and chart/table from the same source; sync tombstones work. | 5: invalidation, aggregation and deletion paths |
| BL-05 | As Tomas, I want larger text without missing controls so that I can log and review comfortably. | Native FW-29 reflow/readability failure | Every critical screen works through 200% scale; chart values have text access. | 3: layout changes across known screens |

Add specific gaps for the other FW stories if observed; this table does not replace comprehensive coverage. External distribution prerequisites belong in deployment preparation unless an actual app defect prevents deployment.

## Hypothetical first sprint after this milestone

**Goal:** make a recorded offline workout dependable from local confirmation through later upload. If the observed backlog contains BL-01 and BL-02, select them first because every higher-level view relies on trustworthy data. Split BL-02 into (a) durable outbox/idempotent upload and (b) explicit conflict resolution if it cannot be demonstrated within a sprint. Acceptance remains end-to-end with a real device and test backend.

Use remaining capacity for BL-04 only after the recording/sync slice is dependable. Conversion and accessibility defects may be release blockers and should be reprioritized if evidence warrants. There is no measured team velocity or agreed sprint capacity; this is an ordered candidate selection, not a promise to complete 13 or 18 points. Replace candidates with the actual tested backlog before the final hand-in. These future fixes are not implemented during Part 2 after the allowed generation rounds.
