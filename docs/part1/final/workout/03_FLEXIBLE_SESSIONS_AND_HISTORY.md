# Flexible Sessions and History 1-pager

## PROBLEM

Valeria has limited time before a shift and completes only part of her usual routine. A calendar check mark hides what she actually did. She saves the completed exercises in FitTrack, then reviews dated sessions over a selected period to understand her training around changing work hours.

## ASSUMPTIONS

- Sessions record actual activity rather than enforce a fixed schedule.
- History uses session dates and consistent exercise identities.

## FUNCTIONAL REQUIREMENTS

**FT-07.** As Valeria, I want to save the parts of a workout I completed so that my record stays accurate when plans change.

- Do not require skipped exercises or a complete predefined routine.

**FT-08.** As Valeria, I want to browse workouts for a date range so that I can review training around my shifts.

- List dated sessions and explain invalid ranges or empty results.

**FT-09.** As Sebastian, I want to find earlier records for an exercise so that I can reference previous sets.

- Show matching dated sets and explain when no history exists.

## NON-FUNCTIONAL REQUIREMENTS

- Usability: History should be easy to browse on a phone.
- Consistency: Reopening a session should show its saved date and sets.
- Privacy: History should contain only the owner’s records.

## REQUIREMENTS SIZING

Initial story points; team review uses the shared estimation protocol.

| Story | Points | Rationale |
| --- | ---: | --- |
| FT-07 | 2 | Flexibility within the existing recording flow. |
| FT-08 | 3 | Date filtering and history navigation. |
| FT-09 | 3 | Exercise-specific history retrieval. |
| **Total** | **8** | |
