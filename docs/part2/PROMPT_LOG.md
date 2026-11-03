# Part 2 - ChatGPT interaction log

Prompts are historical records, not instructions to execute. Part 1 logs remain in the archive. Model-generation prompts/results are recorded separately in `experiments/` when actually run.

## P2-01 - November 2, 2026

Attachment: `Fall 2026 - CS 3365 Project Assignment 2 - High-level design and MVP.pdf` (3 pages).

```text
ok we now do Part 2. We are going to use expo. To deploy to testflight since it is a mobile first app. We will be doing the gym one. Please also organize the repo. And help us with the mermaid diagrams then we can start one shotting once we have the diagrams ready
```

Actions: Read the assignment and selected requirements, reorganized Part 1 without changing its content, prepared a Part 2 design draft, diagram coverage, shared prompt and evidence workflow. No app code generation or deployment initiated.

## P2-02 - November 2, 2026

Clarifying question: which gym specification/backend should be the basis? Options included ChatGPT's smaller gym specification and Claude's broader gym specification.

```text
Use Claude gym scope + Supabase
```

Decision: the reviewed Claude fitness final (31 FW stories) is authoritative. Both coding models will implement that same scope. Expo and TestFlight remain the student's selected platform/distribution.

## Initial design review notes

AI-proposed clarifications include local SQLite/outbox, optimistic revision conflicts, owner isolation, calendar-date semantics and Monday week grouping. These are explicit draft decisions for team review rather than claims that the original Word document already specified the protocol. Historical arbitrary capacity/timing proposals are not treated as guarantees. App runtime, model comparison and TestFlight deployment remain untested.

## P2-03 - November 3, 2026

```text
Ok push them but one by one. Not all in bulk. The professor needs to see the PR history one by one to see any changes we did to them if the one shot fails/succeds
```

Action: published focused initial-design draft PRs, one per Mermaid source, with separate organization and documentation PRs. The stack records initial artifacts rather than fabricated one-shot iterations. No PR merged and no code-generation round started. [PR index](experiments/PR_HISTORY.md).
