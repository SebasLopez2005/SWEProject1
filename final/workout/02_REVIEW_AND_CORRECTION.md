# Record Review and Correction 1-pager

## PROBLEM

Carlos wants to read his previous session without interpreting a graph and notices a duplicated set. Sebastian finds an incorrect weight in an older record. FitTrack lets them review a clear summary and correct mistakes so later history and progress views use accurate records.

## ASSUMPTIONS

- Users may correct their own saved records.
- A retained session contains completed sets. Removal requires confirmation.

## FUNCTIONAL REQUIREMENTS

**FT-04.** As Carlos, I want to read a simple workout summary so that I can check what I previously recorded.

- Show date, exercises, weights with units, repetitions, and sets.

**FT-05.** As Sebastian, I want to correct a saved set so that my history reflects my actual workout.

- Validate edits and update related summaries and totals.

**FT-06.** As Carlos, I want to remove a duplicate set so that my record contains only completed sets.

- Allow confirmation or cancellation; prevent an empty retained session.

## NON-FUNCTIONAL REQUIREMENTS

- Readability: Summaries should use clear labels and readable text.
- Integrity: Corrections should remain consistent across history and progress views.
- Reliability: Failed changes should preserve the existing saved record.

## REQUIREMENTS SIZING

Initial story points; team review uses the shared estimation protocol.

| Story | Points | Rationale |
| --- | ---: | --- |
| FT-04 | 3 | Record retrieval and readable summary. |
| FT-05 | 3 | Validated edits and consistent totals. |
| FT-06 | 2 | Bounded removal and confirmation. |
| **Total** | **8** | |
