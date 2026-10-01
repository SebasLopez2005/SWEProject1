# Workout Recording 1-pager

## PROBLEM

Sebastian logs exercises between sets but loses details in scattered phone notes. Pepito is new to tracking and needs understandable fields. FitTrack lets them select exercises, record completed sets, and save a dated session they can review later.

## ASSUMPTIONS

- Users record their own completed workouts; coaching remains external.
- Exercises use consistent names. A session contains its date, exercises, weights with units, and repetitions.

## FUNCTIONAL REQUIREMENTS

**FT-01.** As Pepito, I want to understand the set-entry fields so that I can record workouts correctly.

- Use plain labels and explain missing or invalid entries.

**FT-02.** As Sebastian, I want to record exercises and completed sets so that I can keep an organized workout record.

- Support multiple exercises and sets in one dated session.

**FT-03.** As Pepito, I want to save and review my session so that I can use it at my next visit.

- Confirm saving; retain entries after failure without duplicating the workout.

## NON-FUNCTIONAL REQUIREMENTS

- Usability: Entry should be clear and convenient on a phone.
- Reliability: Saving should preserve recorded data and explain failures.
- Privacy: Workout records should be accessible only to their owner.

## REQUIREMENTS SIZING

Initial story points; team review uses the shared estimation protocol.

| Story | Points | Rationale |
| --- | ---: | --- |
| FT-01 | 3 | Logging help and validation. |
| FT-02 | 5 | Exercise selection and repeated set entry. |
| FT-03 | 5 | Storage and failed-save recovery. |
| **Total** | **13** | |
