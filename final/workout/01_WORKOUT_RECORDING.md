# Workout Recording 1-pager

Product: FitTrack | Version: Final ChatGPT specification | September 30, 2026

## PROBLEM

Sebastian arrives at the gym between classes and wants to record his workout without repeatedly navigating through screens. His phone notes use inconsistent exercise names and sometimes omit sets, making later comparisons difficult. He opens FitTrack, chooses the exercises in his existing routine, and records the weight and repetitions after each completed set. He checks the session before saving it so the record reflects what he actually did.

Pepito is recording an instructor-provided routine for the first time. He understands how to use his phone but is still learning logging terminology. Plain labels and brief explanations help him enter each completed set and review the saved session at his next visit. Neither user needs to create a training program before recording a workout. These situations extend FT-SC-01 and FT-SC-02.

## ASSUMPTIONS

- Users have individual signed-in accounts; each record belongs to its creator. Account setup is a shared prototype dependency, not a coaching or instructor portal.
- A seeded catalog provides stable exercise identifiers and names; users select catalog entries rather than creating duplicate names. Custom exercises are deferred.
- Recording uses kilograms throughout this prototype. Repetitions are positive integers; load is a nonnegative decimal with up to two decimal places. Zero load may be recorded but is excluded from weighted volume.
- Each session has a user-selected local calendar date and at least one completed set. Past dates are allowed; future workout records are rejected.
- Users enter actual completed sets; instructor guidance and exercise technique remain external.

## FUNCTIONAL REQUIREMENTS

### FT-01

- As Pepito, I want to understand the fields used to record a set so that I can enter my workout correctly without already knowing every logging term.

- Label exercise, weight (kg), repetitions, and completed sets explicitly; make a brief explanation of a set and a repetition available at entry.
- Identify missing or invalid fields beside the relevant input, explain what to correct, and retain valid entries.

### FT-02

- As Sebastian, I want to record the exercises and sets I complete in a dated workout so that I can keep a consistent record without maintaining scattered notes.

- Select one or more catalog exercises and add completed sets with load and repetitions; preserve their recorded order.
- Permit multiple sets per exercise and multiple exercises per session; reject invalid values under the stated rules.

### FT-03

- As Pepito, I want to save my recorded workout and see that it was saved so that I can reliably review it during a later gym visit.

- Save only a valid, nonempty session; display success after persistence succeeds, with its date and recorded sets.
- On failure, retain current entries and offer retry; retrying the same save must not create a duplicate session.

## NON-FUNCTIONAL REQUIREMENTS

- Core entry controls must work without horizontal scrolling at viewport widths of 360–430 CSS pixels; interactive targets must be at least 44 by 44 CSS pixels.
- During a prototype check with 20 concurrent users, a save must report success or failure within 2 seconds for at least 95% of 100 attempts on a stable connection.
- Only the record owner may create or access their session data; verify access checks for a request using another user's identifier. These privacy rules apply to every initiative.

## REQUIREMENTS SIZING

Metric: **story points**, using the shared independent-estimate/discuss/re-estimate protocol in [FITTRACK_FINAL.md](FITTRACK_FINAL.md#effort-estimation-protocol). These are initial AI estimates for team review, not team-agreed commitments.

| Story | Points | Rationale |
| --- | ---: | --- |
| FT-01 | 3 | Includes beginner help and field-specific validation states beyond basic labels. |
| FT-02 | 5 | Combines catalog selection, repeatable set entry, and a structured session record. |
| FT-03 | 5 | Persistent storage, recovery behavior, and duplicate-save prevention add integration complexity. |
| **Total** | **13** | |
