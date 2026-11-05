# Two-model generation and evidence protocol

This follows the supplied Part 2 assignment. Generated app code must not be manually repaired for the assessed one-shot result. Diagram revisions are the mechanism for improving a result, and each merged design PR must be followed by a full generation. The user asked to prepare the diagrams first; no coding model has been run yet.

## Before round 1

1. Review all 31 story flows, five class sheets, top-level diagrams and proposed decisions. Run `python3 scripts/check_design.py` and render the Mermaid sources. Freeze the shared prompt and review the initial [stacked diagram PRs](PR_HISTORY.md).
2. Verify repository visibility and instructor access. Record the initial merged design PR and exact Git commit. Initial draft PRs are now published and indexed in PR_HISTORY.md; none is merged.
3. Choose actual coding models/versions. Sebastian uses ChatGPT and Diego uses Claude, but record exact IDs/settings actually used; do not infer them from the product-specification provider names.
4. Select an empty output per model and isolate its backend/build identity. Neither model reads the other's generated app or previous generated implementation.

## Initial PR stack

The student requested one PR per diagram. These initial draft PRs separate the already-authored baseline for review; they are not generation-driven revisions. Keep them unmerged until the baseline review and the assignment's generation-after-merge handling are settled. Later actual outcome-driven diagram revisions must link their generation evidence.

## Each paired round

Use the same design commit, prompt, requirement context, package/environment constraints and acceptance checklist for both models. Keep a maximum of **three paired rounds** so each model receives at most three complete generation attempts. This is the team's conservative interpretation of the assignment limit; confirm any different counting rule with the instructor before exceeding it.

The model may autonomously create files, install dependencies, run checks and self-correct during its one continuous generation invocation. After it returns, freeze that output for assessment. Do not use iterative human follow-up repair prompts against generated code, copy fixes from the other model, or edit app code to make tests pass. If the instructor defines one-shot more strictly, follow that interpretation and record it.

Record exact submitted prompt and response, model identifier/settings, design/code commit, environment and backend IDs, and commands with outputs. Credentials are configured by the environment owner; that setup must not smuggle in behavior or code repairs. Label genuine infrastructure failures separately from generated-code failures without inventing successful app tests.

Run the common [traceability acceptance checklist](../design/TRACEABILITY.md). Compare actual coverage, failure handling, offline recovery, unit accuracy, ownership, maintainability and native deployability. No performance numbers or completion percentages should be reported without measured evidence and a denominator.

## If a round fails

1. Reproduce and record each gap against its story or contract. Preserve the generated commit and test evidence.
2. Create a design branch such as `codex/part2-diagrams-round-2`. Edit only the relevant Mermaid model to clarify the behavior; update its mirrored guide and describe the rationale/evidence in the PR. Update companion explanation/logs for traceability, without using them as hidden new requirements.
3. Merge the reviewed PR. From the new diagram commit, ask both models for a **fresh full app** in independent clean outputs. Do not tell one model to patch its previous app.
4. Preserve prior rounds through Git commits/tags/branches and log links; do not silently overwrite the only copy of evidence.

After round 3, stop the assessed regeneration loop. Put outstanding implementation stories into the future backlog and select a hypothetical first sprint; those backlog fixes are not implemented during this milestone.

## Record structure

Use `round-01/chatgpt/`, `round-01/claude/`, etc. under this directory for exact prompts and concise result evidence. Never save tokens, passwords or signing credentials in logs. The [run log](RUN_LOG.md) is the index. The [comparison template](COMPARISON.md) remains unfilled until both results exist.
