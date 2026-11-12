# Part 2 - High-level Design and MVP

**Draft report, November 2, 2026.** Team: Sebastian and Diego. Submission/presentation date in the supplied assignment: **November 12, 2026**. The implementation summaries below record the work completed after this draft was started.

## Cover: selection and problem

We selected the **Claude Fitness & Workout Log App**, one of the four Part 1 product/provider options. The [revised report with professor feedback](design/source/Fitness_Workout_Log_App_Revised_v2.docx) contains 31 stories across nine initiatives and four proto-personas. The other gym alternative and both meal-planning alternatives remain in the Part 1 archive.

People need a reliable workout record they can enter between sets, consult for previous performance and understand through history and volume graphs. The nine 1-pagers add important design consequences: typed sets for weight/reps, reps-only and timed exercises; offline local persistence; editable history; a stable exercise catalog; repeatable exercise lists; readable text; and mixed kg/lb input. This requires offline synchronization and consistent derived views, not only a set-entry form.

The user selected Expo for mobile development, TestFlight for iOS distribution, and Supabase for the hosted backend. The design uses SQLite for local confirmed data and an outbox for later cloud synchronization. [Scope and decisions](design/SCOPE.md) records proposed clarifications, including conflict handling and high-level quality requirements. Original Part 1 documents remain unchanged.

## Assignment checklist

| Required artifact | Location / current status |
| --- | --- |
| Selected option, problem and 1-pager comments | Cover above; selected source and stories linked in design |
| Context model and explanation | Diagram 01 in [design guide](design/README.md) |
| Architecture incl. frontend/backend/data/services | Diagram 02 in design guide |
| At least one sequence per story | 31 FW sequence diagrams, mapped in [traceability](design/TRACEABILITY.md) |
| Detailed classes incl. controllers and database handlers | Five class-model sheets in design guide; logical RPC handlers included |
| Diagrams in Mermaid with descriptions/justifications | `.mmd` sources and design guide; syntax/render verification required |
| PR history of design modifications | Initial stack #2–#45 merged; [PR history and merge records](experiments/PR_HISTORY.md) |
| Same design exercised with two coding models | ChatGPT and Claude outputs are recorded. A paired comparison using the same frozen input remains pending. |
| Detailed iterations, failures and diagram changes | [One Shot 1](experiments/round-01/chatgpt/README.md) · [One Shot 2](experiments/round-02/chatgpt/README.md) · [Run log](experiments/RUN_LOG.md) |
| Public GitHub pointers and instructor access | Remote is https://github.com/SebasLopez2005/SWEProject1 ; GitHub visibility verified PUBLIC on November 2, 2026; instructor link check pending |
| Prompts used for generation | [Shared prompt](prompts/ONE_SHOT.md) · [One Shot 1 brief](experiments/round-01/chatgpt/USER_BRIEF.txt) · [One Shot 2 brief](experiments/round-02/chatgpt/USER_BRIEF.txt) |
| Deployment | [TestFlight/Supabase plan](DEPLOYMENT.md) |
| Remaining backlog and hypothetical sprint | [Backlog](BACKLOG.md); observed implementation gaps added after runs |
| 10-minute presentation/demo | Outline below; live demo evidence pending |
| Individual teammate evaluations | Each student submits directly under assignment instructions; no email is sent by this repo workflow |

## Design artifacts and justification

The [design guide](design/README.md) contains every diagram inline, with its own description and design justification. [Architecture contracts](design/CONTRACTS.md) explain the protocol and [traceability](design/TRACEABILITY.md) connects each original story to its flow and acceptance check. Diagram sources, not screenshots, are the editable design artifacts.

## Iteration and model comparison

The initial design stack (#2–#45) covers the selected Claude Fitness & Workout Log requirements and includes the professor-feedback alignment in #45. The merged design at `9dc200d` served as the input for the initial implementation. [PR history](experiments/PR_HISTORY.md)

- **One Shot 1** built the first app and verified core workout flows on the iOS simulator, including saving offline and uploading to local Supabase after an outage. PR #46 merged the result. [One Shot 1 write-up](experiments/round-01/chatgpt/README.md)
- **One Shot 2** revised that app with a graphite and champagne palette and native iOS Liquid Glass controls. Simulator and bundle checks are recorded for the revision. [One Shot 2 write-up](experiments/round-02/chatgpt/README.md)

For every paired round, record the design commit, merged PR, exact model/version, exact prompt, generated code commit, commands, real test results, reproducible failures and deployment evidence. Both models use the same frozen design and clean independent output. Only diagram changes may improve behavior between rounds, followed by a fresh full generation. Use at most three paired generation rounds as the conservative team protocol. [Experiment procedure](experiments/README.md) explains the boundary between setup, assessment and diagram revisions.

## Presentation outline - 10 minutes

| Time | Content |
| --- | --- |
| 0:00-1:00 | Chosen product, four personas and why mobile/offline matter |
| 1:00-3:00 | Context, architecture, typed data and durable local-to-cloud path |
| 3:00-4:00 | One story sequence and the corresponding class/repository path |
| 4:00-7:00 | Real device demo: start, previous sets, typed entry, finish, history and progress; show offline resume and sync if working |
| 7:00-9:00 | Two-model evidence and diagram iterations; distinguish successful and missing behavior |
| 9:00-10:00 | Remaining backlog, proposed first sprint and limitations |

Before printing, replace planning placeholders with observed results, include legible rendered diagram pages and working PR/build links, and keep the final report honest about anything that remains incomplete. This Markdown report has not yet been formatted as the final printed Word/PDF hand-in.
