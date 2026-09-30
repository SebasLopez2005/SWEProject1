# Record Review and Correction 1-pager

Product: FitTrack | Version: Final ChatGPT specification | September 30, 2026

## PROBLEM

Carlos wants an organized record he can read before his next gym visit. His notebook is difficult to scan, and a dense graph would not help him locate the exact sets he completed. He opens a saved workout in FitTrack and reads a summary showing the date, exercises, weights, repetitions, and sets. While reviewing today's record, he notices that he entered the same set twice and removes the duplicate.

Sebastian also discovers an incorrect weight in one of his records. He edits the mistaken entry and checks that the summary reflects the corrected value. Both users retain control over their records, and later history and volume views use the corrected data. These situations extend FT-SC-01 and FT-SC-04.

## ASSUMPTIONS

- Workout creation and storage are supplied by the recording initiative; this initiative adds review and correction.
- Users may edit or remove sets in their own saved workouts. Retained sets must satisfy the recording validation rules.
- Removing the final set is prevented with a clear explanation; complete-session deletion is deferred.
- A removal requires confirmation and can be cancelled. Automatic detection of duplicate sets is not assumed because identical completed sets may be legitimate.
- Changes must persist and be reflected in later summaries and graphs.

## FUNCTIONAL REQUIREMENTS

### FT-04

- As Carlos, I want to read a clear summary of a selected workout so that I can check exactly what I recorded before my next visit.

- Show the session date, exercise names, ordered sets, load with units, and repetitions using text rather than requiring a graph.
- Present a meaningful empty or unavailable-record message instead of showing a blank summary.

### FT-05

- As Sebastian, I want to correct the weight or repetitions in a saved set so that my history and progress calculations reflect what I actually did.

- Validate edited values and preserve the original record if saving the change fails.
- After a successful change, refresh the summary and any dependent volume totals; the correction remains after reopening the session.

### FT-06

- As Carlos, I want to remove a mistakenly repeated set after confirming the removal so that my session contains only the sets I actually completed.

- Identify the selected set before confirmation; cancellation leaves the record unchanged.
- After confirmed removal succeeds, refresh the summary and dependent totals; prevent removing the final set and preserve data if removal fails.

## NON-FUNCTIONAL REQUIREMENTS

- Summary text must remain usable with browser text enlarged to 200%; controls must have descriptive labels and support keyboard operation.
- A failed edit or removal must not partially change the stored session; verify by reopening the record after a simulated failure.
- Owners alone can read, edit, or remove their sets, including through direct requests. No public sharing is included.

## REQUIREMENTS SIZING

Metric: **story points**, using the shared independent-estimate/discuss/re-estimate protocol in [FITTRACK_FINAL.md](FITTRACK_FINAL.md#effort-estimation-protocol). These are initial AI estimates for team review, not team-agreed commitments.

| Story | Points | Rationale |
| --- | ---: | --- |
| FT-04 | 3 | Requires retrieving structured data and presenting a readable summary with unavailable states. |
| FT-05 | 3 | Adds validated updates and consistency with dependent views using existing persistence. |
| FT-06 | 2 | Reference story: one bounded removal operation, confirmation, and reuse of existing refresh behavior. |
| **Total** | **8** | |
