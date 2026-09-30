# Training Volume and Progress 1-pager

Product: FitTrack | Version: Final ChatGPT specification | September 30, 2026

## PROBLEM

At the end of the week, Sebastian wants to compare his bench-press training over the past month. His old notes would require him to calculate totals manually. He selects the exercise and date range in FitTrack and views its weekly recorded volume. He opens the sets contributing to a higher total and notices that the week included an additional session, rather than assuming that the higher graph value means better performance in every workout.

Valeria uses the same view to understand how shortened sessions affect her records around rotating shifts. Carlos can read the values in a simple table and consult an explanation of volume before interpreting the graph. Each user can connect the summary to actual saved sets. These situations extend FT-SC-01 and FT-SC-03 and Carlos's need for understandable summaries.

## ASSUMPTIONS

- For this prototype, recorded weighted volume is the sum of load in kilograms multiplied by completed repetitions for eligible sets of the selected exercise. Its display unit is kg-repetitions.
- The metric uses entered load as recorded; it does not infer body weight, multiply loads for equipment or limbs, or convert volume into calories burned.
- Zero-load sets remain visible in history but do not contribute to weighted volume. The display explains that bodyweight work is not captured by this metric.
- Comparisons concern the same exercise identifier. Volume is not a diagnosis, a strength score, or evidence of equivalent effort across different exercises.
- Weekly buckets run Monday–Sunday using session dates. Range endpoints are inclusive; partial weeks are labelled, and empty weeks inside the range show zero recorded volume.
- No automatic coaching, nutrition integration, or training recommendations are included.

## FUNCTIONAL REQUIREMENTS

### FT-10

- As Sebastian, I want to see weekly recorded volume for a selected exercise and date range so that I can compare my logged training without calculating every total manually.

- Calculate eligible set totals using the stated definition and aggregate into labelled weekly buckets.
- Show an exercise-specific graph with units, partial-week labels, and zero weeks; distinguish a range with no eligible data from missing or failed data.

### FT-11

- As Valeria, I want to inspect the sets contributing to a weekly volume total so that I can understand how shortened or additional sessions affect the graph.

- Selecting a week shows contributing dates, sets, loads, repetitions, and their volume contributions, with access to session summaries.
- Use the same range boundaries and set eligibility as the graph; saved edits or removals update both the total and contributing records.

### FT-12

- As Carlos, I want to read volume values and a plain explanation alongside the graph so that I can understand my recorded training without relying only on a visual chart.

- Provide a text table of the same weekly values and units displayed in the graph, with an explanation of the calculation.
- Explain that zero means no recorded eligible weighted volume and that the measure excludes bodyweight contribution; avoid presenting it as proof of health or strength improvement.

## NON-FUNCTIONAL REQUIREMENTS

- With the history workload of 200 sessions of up to 50 sets per account, a graph and corresponding table must display within 2 seconds for at least 95% of 100 stable-connection requests with 20 concurrent users.
- Graph, table, and contributing-record totals must agree using unrounded stored values; display volume to two decimal places without rounding individual sets before aggregation.
- Do not use color alone to convey values. Provide labelled axes, units, and a keyboard-accessible table and week-selection control.
- In validation, include a zero-load set, an empty week, a partial week, an edited set, and a removed set; each must follow the documented calculation rules.

## REQUIREMENTS SIZING

Metric: **story points**, using the shared independent-estimate/discuss/re-estimate protocol in [FITTRACK_FINAL.md](FITTRACK_FINAL.md#effort-estimation-protocol). These are initial AI estimates for team review, not team-agreed commitments.

| Story | Points | Rationale |
| --- | ---: | --- |
| FT-10 | 5 | Combines deterministic aggregation, date boundaries, and a graph with multiple display states. |
| FT-11 | 5 | Links aggregates to source records and handles consistency after changes across initiatives. |
| FT-12 | 3 | Alternative presentation and understandable interpretation require consistent states and content. |
| **Total** | **13** | |
