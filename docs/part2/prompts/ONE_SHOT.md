# Shared one-shot generation prompt

**Template only - not submitted to a coding model yet.** Before use, resolve the uppercase placeholders and archive the exact filled prompt per model/round. Give both models the same content and frozen design commit. Only MODEL_LABEL and the isolated output/environment identifiers differ.

```text
Implement the Fitness & Workout Log mobile app from the design at DESIGN_COMMIT.
This is ROUND_NUMBER for MODEL_LABEL. Generate the complete application in
OUTPUT_DIRECTORY, starting from an empty implementation. Do not read another
model's app, an earlier generated implementation, or generated-code solutions.

Use docs/part2/design/README.md and every .mmd source in its diagrams directory.
The selected product is Diego's reviewed Claude Fitness & Workout scope: all
31 FW stories, not the 12-story ChatGPT alternative. SELECTED_STORIES.md and
docs/part2/design/source/Fitness_Workout_Log_App_Revised_v2.docx are requirement
context; this revised report supersedes the archived Part 1 final. SCOPE.md,
CONTRACTS.md and TRACEABILITY.md explain the models; do not invent extra scope.

Generate an Expo React Native TypeScript application with Expo Router,
expo-sqlite local persistence and a Supabase hosted backend. Implement the
screens, controllers, services, repository boundaries, domain types,
presenters and database/RPC responsibilities in the class and sequence models.
Equivalent idiomatic hooks/modules are acceptable; preserve the responsibilities.

Follow every story diagram, including offline durable writes, resume,
immutable outbox/idempotent upload, owner isolation, safe conflict resolution,
typed exercise sets, templates, correction/deletion, graphs, settings and unit
conversion. Do not substitute in-memory storage or mock successful uploads.
All confirmed writes must survive process restart. Graphs and previous
performance must reflect local edits. Use stable exercise identities.

Generate local SQLite migrations, Supabase migrations/constraints/RLS/RPC
functions and a small realistic seed catalog without claiming a fixed catalog
size. Include .env.example with public configuration placeholders only, a
lockfile with compatible Expo dependencies, and EAS production build/submit
configuration for eventual iOS TestFlight distribution. Never include private
keys, real tokens, passwords or fabricated service identifiers.

Include tests for actual domain/integration risks: typed-set validation,
durable save/resume, transaction rollback, duplicate retry, conflict
preservation, owner isolation, template independence, date buckets,
unit round-trip display and graph/source agreement. Explain manual native
checks for text scaling, keyboard, offline lifecycle and deployment.
Run the checks you can during this single autonomous generation invocation.
Do not deploy, create accounts, buy services or send messages.

Preserve high-level quality requirements; do not invent capacity or timing
promises. Follow the design's explicit functional validation rules and
accessibility behaviors. Android-compatible source is expected; iOS is the
requested distribution target.

Deliver all app/backend/config/test files, a runnable README with exact setup
commands, checks actually executed, and known limitations. Mark external
configuration or device checks not performed; do not claim they passed.
Do not modify the supplied diagrams or design artifacts. If a model is
ambiguous, state the assumption you used in the generated output so the team
can consider a later diagram revision. Do not reduce story coverage silently.
```

Before invoking, record actual available model/version, runtime, output path and backend environment in the run log. The user has asked to finish diagram preparation before executing this prompt.
