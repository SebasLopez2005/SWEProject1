# CS3365 - Fitness & Workout Log

Part 2 continues **Diego's final Claude Fitness & Workout specification**, with **31 stories (FW-01 through FW-31)**. Both code-generation models will use this same product scope. Expo / React Native is the mobile frontend; Supabase supplies authentication, the hosted API and PostgreSQL. SQLite supports offline work on the device. The intended iOS distribution is TestFlight.

**Status:** design draft v1, ready for team review. No application has been generated or deployed. No generation attempt has been consumed. The initial design is now published as [stacked draft PRs](docs/part2/experiments/PR_HISTORY.md), one per diagram; none has been merged.

## Start here

- [Part 2 design guide and diagram index](docs/part2/design/README.md)
- [Selected requirements and decisions](docs/part2/design/SCOPE.md)
- [Architecture and data contracts](docs/part2/design/CONTRACTS.md)
- [31-story traceability and acceptance checks](docs/part2/design/TRACEABILITY.md)
- [Assignment checklist and report draft](docs/part2/REPORT.md)
- [Two-model generation procedure](docs/part2/experiments/README.md)
- [Expo / TestFlight deployment plan](docs/part2/DEPLOYMENT.md)
- [Part 2 prompt log](docs/part2/PROMPT_LOG.md)

## Repository layout

```text
docs/
  part1/                 Original requirements, drafts, reviews and print files
    final/               All four final Word documents and separate prompt log
  part2/
    design/              Decisions, contracts, coverage and Mermaid sources
      diagrams/
        classes/         Detailed class model, divided into modules
        sequence/        One sequence per FW story, plus supporting flows
    experiments/         Generation rules, run records and comparison template
    prompts/             Shared prompt for the two coding models
    REPORT.md            Report draft; results remain unfilled until observed
    BACKLOG.md           Backlog method and hypothetical first sprint
apps/                    Reserved for independently generated model outputs
scripts/                 Design checks and local diagram rendering
```

The Part 1 files were relocated without changing their contents. [Archive manifest](docs/part1/ARCHIVE_MANIFEST.json) records original paths and hashes. Paths inside historical prompt text and binary documents are evidence of the original conversation and are not rewritten.

## Review diagrams

GitHub previews the Mermaid diagrams in the [design guide](docs/part2/design/README.md). Editable `.mmd` files are the source of truth; the guide's Mermaid blocks mirror them.

```sh
python3 scripts/check_design.py
# Optional local SVG rendering; Node.js and Chrome/Chromium are needed.
PUPPETEER_SKIP_DOWNLOAD=true npm ci
CHROME_PATH='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' npm run diagrams:render
```

Use a design pull request before the first generation. Later changes to behavior belong in diagrams and a new design PR, followed by full regeneration. See the experiment procedure before running either model. GitHub reports the repository as public (verified November 2, 2026). Confirm the instructor can follow the submitted repo/PR links.
