# Fitness and Workout Log

CS3365 project by Sebastian and Diego. A mobile workout log for recording sets, reviewing previous performance, and tracking training volume.

**Current status:** the initial design PR stack (#2–#45) is merged. The revised report with professor feedback is the requirements baseline: **31 stories, 101 original story points, and 42 Mermaid diagrams**. No application generation or deployment has run.

## Project documents

| Area | Start here | Contents |
| --- | --- | --- |
| Revised requirements | [Source report](docs/part2/design/source/Fitness_Workout_Log_App_Revised_v2.docx) | Professor-reviewed fitness specification |
| Design | [Diagram guide](docs/part2/design/README.md) | Context, architecture, navigation, data, classes and story sequences |
| Requirements coverage | [Traceability](docs/part2/design/TRACEABILITY.md) | All 31 stories and unexecuted acceptance checks |
| Scope and behavior | [Decisions](docs/part2/design/SCOPE.md) · [Contracts](docs/part2/design/CONTRACTS.md) | Product boundary and implementation rules |
| Revision review | [Report alignment](docs/part2/design/REVISED_REPORT_REVIEW.md) | Corrections and remaining design proposals |
| Assignment | [Part 2 report](docs/part2/REPORT.md) · [Backlog](docs/part2/BACKLOG.md) | Deliverables, presentation and future work |
| Generation evidence | [Procedure](docs/part2/experiments/README.md) · [Run log](docs/part2/experiments/RUN_LOG.md) | Two independent model outputs; no runs yet |
| Review history | [PR index](docs/part2/experiments/PR_HISTORY.md) | Individual PRs, merge commits and superseded wording |
| Deployment | [Deployment plan](docs/part2/DEPLOYMENT.md) | Expo, Supabase and TestFlight; not deployed |
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
        sequence/        31 story sequences and two supporting flows
      README.md          All 42 diagrams with explanations
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

Use the [app setup](apps/chatgpt/README.md) to launch the iOS simulator or run local Supabase. The [generation log](docs/part2/experiments/RUN_LOG.md) separates this implementation from the independent Claude output and eventual TestFlight distribution.
