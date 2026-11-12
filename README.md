# Fitness and Workout Log

CS3365 project by Sebastian and Diego. A mobile workout log for recording sets, reviewing previous performance, and tracking training volume.

[One Shot 1](docs/part2/experiments/round-01/chatgpt/README.md) built the initial workout log and merged in PR #46. [One Shot 2](docs/part2/experiments/round-02/chatgpt/README.md) revised its interface with a dark palette and native Liquid Glass. The design covers 31 original stories and 13 planned training requirements across 50 Mermaid diagrams. [One Shot 3](apps/formwork/README.md) generated Formwork from the planned-training design. The [run log](docs/part2/experiments/RUN_LOG.md) also records the independent Claude builds.

## Project documents

| Area | Start here | Contents |
| --- | --- | --- |
| Revised requirements | [Source report v3](docs/part2/design/source/Fitness_Workout_Log_App_Revised_v3.docx) | Final revision after professor feedback: personas identified by role, not name. [v2](docs/part2/design/source/Fitness_Workout_Log_App_Revised_v2.docx) is kept as the input used for the generation rounds. |
| Design | [Diagram guide](docs/part2/design/README.md) | Context, architecture, navigation, data, classes and story sequences |
| Requirements coverage | [Traceability](docs/part2/design/TRACEABILITY.md) | Original story checks and planned training coverage |
| Scope and behavior | [Decisions](docs/part2/design/SCOPE.md) · [Contracts](docs/part2/design/CONTRACTS.md) | Product boundary and implementation rules |
| Revision review | [Report alignment](docs/part2/design/REVISED_REPORT_REVIEW.md) | Corrections and remaining design proposals |
| Assignment | [Part 2 report](docs/part2/REPORT.md) · [Backlog](docs/part2/BACKLOG.md) | Deliverables, presentation and future work |
| Generation evidence | [Procedure](docs/part2/experiments/README.md) · [Run log](docs/part2/experiments/RUN_LOG.md) | Generation procedure and recorded runs |
| Review history | [PR index](docs/part2/experiments/PR_HISTORY.md) | Individual PRs, merge commits and superseded wording |
| Deployment | [Deployment plan](docs/part2/DEPLOYMENT.md) | Expo, Supabase and TestFlight setup |
| Part 1 | [Archive](docs/part1/README.md) | Original requirements, reviews, finals and prompt records |

## Repository layout

```text
apps/                    Independent implementation folders
docs/
  part1/                 Original Part 1 archive
    final/               Final Word documents and standalone prompt log
  part2/
    design/
      source/            Revised requirements report
      diagrams/
        classes/         Five class-model sheets
        sequence/        31 story sequences, two supporting flows and seven training sequences
      README.md          All 50 diagrams with explanations
    experiments/         PR history, model procedure and result records
    prompts/             Shared application-generation prompt
    REPORT.md            Assignment report draft
    BACKLOG.md           Remaining work and hypothetical sprint
scripts/                 Design checks and diagram rendering
```

The Part 1 archive preserves its original contents. Its [manifest](docs/part1/ARCHIVE_MANIFEST.json) records original paths and SHA-256 hashes. The later revised report is retained separately under the active design source folder.

## Review and validate

GitHub previews all Mermaid blocks in the [diagram guide](docs/part2/design/README.md). The `.mmd` sources are authoritative; synchronize the guide after diagram changes.

```sh
python3 scripts/check_design.py --sync
python3 scripts/check_design.py

# Optional local rendering requires Node.js and Chrome or Chromium.
PUPPETEER_SKIP_DOWNLOAD=true npm ci
CHROME_PATH='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' npm run diagrams:render
```

The design checks validate source parity, coverage, mirrors, links and archive integrity. Rendering validates Mermaid syntax; neither proves app behavior. See [verification](docs/part2/design/VERIFICATION.md).

## Next milestone

Use the [app setup](apps/chatgpt/README.md) to launch the workout log on the iOS simulator or run local Supabase. See the [run log](docs/part2/experiments/RUN_LOG.md) for evidence from both models.
