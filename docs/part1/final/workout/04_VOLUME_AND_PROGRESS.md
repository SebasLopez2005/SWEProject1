# Training Volume and Progress 1-pager

## PROBLEM

Sebastian wants to compare recorded bench-press volume without calculating totals manually. Valeria wants to understand how shortened sessions affect her training history. FitTrack shows exercise-specific volume over time and the contributing sets, while Carlos can consult a plain table instead of relying on a graph.

## ASSUMPTIONS

- Weighted volume sums recorded load multiplied by repetitions for the selected exercise.
- Bodyweight contribution is excluded. Volume describes logged training, not health, strength, or calories burned.

## FUNCTIONAL REQUIREMENTS

**FT-10.** As Sebastian, I want to view an exercise’s volume over time so that I can compare my recorded training.

- Group saved weighted sets by week for a chosen date range.

**FT-11.** As Valeria, I want to inspect the sets behind a total so that I can understand changes between weeks.

- Link totals to contributing sessions and reflect record corrections.

**FT-12.** As Carlos, I want to read volume values and explanations so that I can understand the comparison.

- Provide a labelled table and explain missing or excluded data.

## NON-FUNCTIONAL REQUIREMENTS

- Accuracy: Graphs, tables, and contributing records should agree.
- Accessibility: Meaning should not depend on color or graphs alone.
- Responsiveness: Progress views should respond smoothly during normal use.

## REQUIREMENTS SIZING

Initial story points; team review uses the shared estimation protocol.

| Story | Points | Rationale |
| --- | ---: | --- |
| FT-10 | 5 | Aggregation and graph presentation. |
| FT-11 | 5 | Connecting totals with source records. |
| FT-12 | 3 | Alternative presentation and explanations. |
| **Total** | **13** | |
