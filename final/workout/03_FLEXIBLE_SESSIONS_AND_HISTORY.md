# Flexible Sessions and History 1-pager

Product: FitTrack | Version: Final ChatGPT specification | September 30, 2026

## PROBLEM

Valeria visits the gym before a nursing shift but has less time than expected and finds equipment occupied. She performs an alternative exercise she already knows and leaves before finishing her usual routine. A check mark on her calendar would conceal those changes. In FitTrack, she saves only the exercises and sets she actually completed, without supplying entries for exercises she skipped.

After two weeks of rotating shifts, Valeria selects that period in her history and reviews the dated sessions. She opens the shortened workout to understand how it differs from her longer sessions. The record reflects her actual activity even when she trains on different days, rather than marking her against a fixed calendar schedule. This situation extends FT-SC-03.

## ASSUMPTIONS

- Sessions are records of performed activity, not instances of an enforced schedule or prescribed program.
- The recording initiative already provides arbitrary selections of exercises and sets. No separate partial-session status or automatic substitution suggestion is required.
- History filters use the session's local calendar date, with inclusive start and end dates; the date range cannot be reversed.
- Multiple sessions on the same day are permitted and remain separate records.
- A user may search exercise-specific history by its stable catalog identifier; renamed display text does not merge unrelated exercises.

## FUNCTIONAL REQUIREMENTS

### FT-07

- As Valeria, I want to save only the exercises and sets I actually completed so that my record remains accurate when I shorten or change a workout.

- Do not require completion of a predefined routine or entries for skipped exercises before saving a nonempty session.
- Include shortened sessions in history without labelling a missing calendar day as a failed workout.

### FT-08

- As Valeria, I want to browse my sessions within a chosen date range so that I can review my training around changing work shifts.

- List matching sessions newest date first and distinguish separate sessions on the same date; selecting one opens its summary.
- Include both range endpoints; explain invalid ranges and show a clear message when no sessions match.

### FT-09

- As Sebastian, I want to find my previous records for a particular exercise so that I can reference my earlier sets before repeating that exercise.

- Select a catalog exercise and show its dated sets and loads from saved sessions, newest first.
- If the exercise has no recorded history, explain that no previous sets are available; do not invent a starting load.

## NON-FUNCTIONAL REQUIREMENTS

- With 200 sessions of up to 50 sets each per account and 20 concurrent users, history requests must render within 2 seconds for at least 95% of 100 stable-connection requests.
- Preserve the selected filter when returning from a session summary to its history list.
- History displays only the signed-in owner's records. Reopening a saved session must reproduce its persisted date and set values.

## REQUIREMENTS SIZING

Metric: **story points**, using the shared independent-estimate/discuss/re-estimate protocol in [FITTRACK_FINAL.md](FITTRACK_FINAL.md#effort-estimation-protocol). These are initial AI estimates for team review, not team-agreed commitments.

| Story | Points | Rationale |
| --- | ---: | --- |
| FT-07 | 2 | Small behavioral constraint on the existing recording flow; does not duplicate set-entry implementation. |
| FT-08 | 3 | Date filtering and history navigation with boundary and empty states. |
| FT-09 | 3 | Exercise-specific retrieval reuses saved data but needs grouping and a distinct history view. |
| **Total** | **8** | |
