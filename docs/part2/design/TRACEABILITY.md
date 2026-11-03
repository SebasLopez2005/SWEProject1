# Story-to-design coverage and acceptance checklist

Selected input: the reviewed Claude fitness final, **31 FW stories / 101 original points**. No app exists yet: every acceptance check is **not run**. Story text and original detail are preserved in [SELECTED_STORIES.md](SELECTED_STORIES.md).

| Story | Capability | Sequence | Controller / service | Original points |
| --- | --- | --- | --- | ---: |
| FW-01 | Start a workout, add exercises | [Flow](diagrams/sequence/FW-01.mmd) | WorkoutController / WorkoutService | 3 |
| FW-02 | Record a set with prefill | [Flow](diagrams/sequence/FW-02.mmd) | WorkoutController / WorkoutService | 5 |
| FW-03 | Set form matches exercise type | [Flow](diagrams/sequence/FW-03.mmd) | WorkoutController / WorkoutService | 3 |
| FW-04 | See previous performance | [Flow](diagrams/sequence/FW-04.mmd) | WorkoutController / HistoryService | 3 |
| FW-05 | Correct or remove a set or entry | [Flow](diagrams/sequence/FW-05.mmd) | WorkoutController / WorkoutService | 3 |
| FW-06 | Finish workout, see summary | [Flow](diagrams/sequence/FW-06.mmd) | WorkoutController / WorkoutService | 3 |
| FW-07 | Resume an unfinished workout | [Flow](diagrams/sequence/FW-07.mmd) | WorkoutController / WorkoutService | 3 |
| FW-08 | Record a workout on an earlier date | [Flow](diagrams/sequence/FW-08.mmd) | WorkoutController / WorkoutService | 2 |
| FW-09 | Log offline, upload later | [Flow](diagrams/sequence/FW-09.mmd) | SyncController / SyncCoordinator | 8 |
| FW-10 | Choose kg or lb | [Flow](diagrams/sequence/FW-10.mmd) | SettingsController / SettingsService | 2 |
| FW-11 | Find an exercise; recent first | [Flow](diagrams/sequence/FW-11.mmd) | ExerciseController / ExerciseService | 3 |
| FW-12 | Create a custom exercise | [Flow](diagrams/sequence/FW-12.mmd) | ExerciseController / ExerciseService | 3 |
| FW-13 | Rename or archive a custom exercise | [Flow](diagrams/sequence/FW-13.mmd) | ExerciseController / ExerciseService | 3 |
| FW-14 | List finished workouts | [Flow](diagrams/sequence/FW-14.mmd) | HistoryController / HistoryService | 3 |
| FW-15 | Open a past workout | [Flow](diagrams/sequence/FW-15.mmd) | HistoryController / HistoryService | 2 |
| FW-16 | History of one exercise | [Flow](diagrams/sequence/FW-16.mmd) | HistoryController / HistoryService | 3 |
| FW-17 | Edit a finished workout | [Flow](diagrams/sequence/FW-17.mmd) | HistoryController / HistoryService | 5 |
| FW-18 | Delete a finished workout | [Flow](diagrams/sequence/FW-18.mmd) | HistoryController / HistoryService | 2 |
| FW-19 | Filter history | [Flow](diagrams/sequence/FW-19.mmd) | HistoryController / HistoryService | 3 |
| FW-20 | Per-exercise volume graph | [Flow](diagrams/sequence/FW-20.mmd) | ProgressController / ProgressService | 5 |
| FW-21 | Choose the period | [Flow](diagrams/sequence/FW-21.mmd) | ProgressController / ProgressService | 2 |
| FW-22 | Overall weekly volume graph | [Flow](diagrams/sequence/FW-22.mmd) | ProgressController / ProgressService | 3 |
| FW-23 | Reps-only total reps graph | [Flow](diagrams/sequence/FW-23.mmd) | ProgressController / ProgressService | 2 |
| FW-24 | Select a point, open workout | [Flow](diagrams/sequence/FW-24.mmd) | ProgressController / ProgressService | 3 |
| FW-25 | Save workout as template | [Flow](diagrams/sequence/FW-25.mmd) | TemplateController / TemplateService | 3 |
| FW-26 | Start workout from template | [Flow](diagrams/sequence/FW-26.mmd) | TemplateController / TemplateService | 3 |
| FW-27 | Create and edit a template | [Flow](diagrams/sequence/FW-27.mmd) | TemplateController / TemplateService | 5 |
| FW-28 | Delete a template | [Flow](diagrams/sequence/FW-28.mmd) | TemplateController / TemplateService | 2 |
| FW-29 | Larger text size | [Flow](diagrams/sequence/FW-29.mmd) | SettingsController / SettingsService | 3 |
| FW-30 | See both units | [Flow](diagrams/sequence/FW-30.mmd) | SettingsController / SettingsService | 3 |
| FW-31 | Enter a set in either unit | [Flow](diagrams/sequence/FW-31.mmd) | WorkoutController / WorkoutService | 5 |

## Per-story checks

Use the following as the same checklist for both models. Record pass/fail/not tested and concrete evidence per run; expected behavior is not evidence.

### FW-01 - Start a workout, add exercises

Expected: Starts dated now; exercises come from the library (FW-11); a workout with no sets cannot be finished, only discarded.

Design check: Specifies active-workout uniqueness and ordered exercise entry before logging.

Status: not run.

### FW-02 - Record a set with prefill

Expected: A new set copies the previous one; the first copies the latest set of that exercise. Proposed limits: weight 0 to 999.9, reps 1 to 999.

Design check: Makes prefill precedence and durable confirmation explicit for the central recording interaction.

Status: not run.

### FW-03 - Set form matches exercise type

Expected: Weight and reps, reps only, or seconds (whole number, at least 1), according to the exercise type (FW-12).

Design check: Prevents irrelevant weight/repetition fields from leaking into other exercise types.

Status: not run.

### FW-04 - See previous performance

Expected: Shows the date and sets, or “No previous record”; reflects later edits and deletions (FW-17, FW-18).

Design check: Defines which prior session is shown and how local corrections affect it.

Status: not run.

### FW-05 - Correct or remove a set or entry

Expected: Edits use the FW-02 validation; deleting asks for confirmation and can be undone at once; set numbers update.

Design check: Preserves correction, confirmation and immediate undo behavior without renumbering corruption.

Status: not run.

### FW-06 - Finish workout, see summary

Expected: Summary: date, duration, exercises, sets and total volume; entries without sets are dropped and the user is told; the workout appears in history (FW-14).

Design check: Distinguishes a locally saved finish from a successfully uploaded record.

Status: not run.

### FW-07 - Resume an unfinished workout

Expected: Sets survive closing or restarting the app; reopening offers to resume or discard.

Design check: Requires actual process-restart persistence rather than an in-memory resume flag.

Status: not run.

### FW-08 - Record a workout on an earlier date

Expected: Future dates cannot be chosen; it appears in history and graphs on that date.

Design check: Separates a training calendar date from timestamps so delayed logging is graphed correctly.

Status: not run.

### FW-09 - Log offline, upload later

Expected: Logging, library and templates work offline; the user sees whether a workout is waiting or uploaded; upload is automatic.

Design check: Models the highest-risk cross-system path, including retries, receipts, conflicts and pull checkpoints.

Status: not run.

### FW-10 - Choose kg or lb

Expected: Chosen at first use, changeable in settings; converts displayed weights, including past ones.

Design check: Keeps account display preferences separate from immutable entered measurements.

Status: not run.

### FW-11 - Find an exercise; recent first

Expected: Search ignores case, matches anywhere and updates as the user types; with no text, the last 10 used (proposed) come first; no match offers FW-12.

Design check: Makes combined search/filter and offline recent ordering consistent for both implementations.

Status: not run.

### FW-12 - Create a custom exercise

Expected: Name 1 to 60 characters (proposed), unique under A-EX-3; the type is locked once a set uses it.

Design check: Specifies private custom exercise creation, name conflicts and eventual type locking.

Status: not run.

### FW-13 - Rename or archive a custom exercise

Expected: A rename applies to past workouts and graphs; archiving hides it from search, keeps its sets and can be undone; used exercises cannot be deleted.

Design check: Keeps rename/archive changes attached to stable exercise identities and historical sets.

Status: not run.

### FW-14 - List finished workouts

Expected: Each row shows the date, up to three exercise names (“and N more”) and the set count; older ones load on scroll; an empty history explains how to log.

Design check: Defines an accessible paged list with stable ordering and an honest empty state.

Status: not run.

### FW-15 - Open a past workout

Expected: Shows exercises in order, sets in the user’s unit, date, duration (if recorded) and total volume.

Design check: Provides complete, current records without forcing users through graphs.

Status: not run.

### FW-16 - History of one exercise

Expected: Reachable from the library and from a workout entry; newest first; archived exercises can still be viewed.

Design check: Makes exercise-level history reachable and robust to renaming/archiving.

Status: not run.

### FW-17 - Edit a finished workout

Expected: Set values, sets and entries, and the date can change, with FW-02 and FW-03 validation; a workout cannot be edited to have no sets (delete it instead).

Design check: Carries all original validation rules into finished-record correction and derived views.

Status: not run.

### FW-18 - Delete a finished workout

Expected: The confirmation names the date and set count; the workout then disappears from history, previous performance and graphs.

Design check: Explains both user-visible permanent deletion and internal synchronization tombstones.

Status: not run.

### FW-19 - Filter history

Expected: Date range and exercise can be combined and cleared; no matches shows a message.

Design check: Prevents date and exercise filters from accidentally replacing each other.

Status: not run.

### FW-20 - Per-exercise volume graph

Expected: One point per workout; axes show units and dates; fewer than two workouts shows a message.

Design check: Ties exercise chart points directly to converted source sets and workout IDs.

Status: not run.

### FW-21 - Choose the period

Expected: Periods as in A-GRA-3; changing it updates the graph and its text summary (all graphs).

Design check: Keeps chart, table and explanation synchronized when period controls change.

Status: not run.

### FW-22 - Overall weekly volume graph

Expected: One value per calendar week, zero if empty; a sentence compares the latest two weeks.

Design check: Defines weekly bucketing, zero weeks and the zero-denominator comparison case.

Status: not run.

### FW-23 - Reps-only total reps graph

Expected: Same graph as FW-20; the vertical axis reads “Total reps”.

Design check: Avoids assigning weighted volume or kilograms to reps-only exercises.

Status: not run.

### FW-24 - Select a point, open workout

Expected: Shows the value and opens the workout (FW-15); a weekly point lists its workouts.

Design check: Preserves the link from a chart/table point to the actual contributing records.

Status: not run.

### FW-25 - Save workout as template

Expected: Name 1 to 60 characters (proposed), unique; exercises saved in the order performed, without sets.

Design check: Makes templates independent exercise lists rather than copies of performed sets.

Status: not run.

### FW-26 - Start workout from template

Expected: Exercises appear in order with no sets; archived ones are marked and can be skipped; the template is unchanged.

Design check: Defines archived exercise handling and avoids copying prescribed loads into a workout.

Status: not run.

### FW-27 - Create and edit a template

Expected: Name it, add exercises via FW-11 search, reorder, remove; finished workouts are unchanged.

Design check: Captures name validation, ordering and independent template edits.

Status: not run.

### FW-28 - Delete a template

Expected: The confirmation names the template; finished workouts started from it are unchanged.

Design check: Ensures deleting a saved routine never deletes workouts started from it.

Status: not run.

### FW-29 - Larger text size

Expected: A setting offers larger text sizes up to 200%; screens stay usable without losing content, and the choice is remembered.

Design check: Makes large text a persistent app-wide presentation behavior.

Status: not run.

### FW-30 - See both units

Expected: Set rows and previous performance show both, for example “60 kg (132.3 lb)”; a setting turns the equivalent on or off.

Design check: Uses one conversion/formatting path for every equivalent weight display.

Status: not run.

### FW-31 - Enter a set in either unit

Expected: The set form offers a unit switch that defaults to the account unit; the set keeps the unit entered; weight limits apply in the unit entered.

Design check: Prevents a unit switch from silently reinterpreting a number without conversion.

Status: not run.

## Cross-cutting failure and integration checks

| Area | Required evidence |
| --- | --- |
| Local durability | Confirm a set, force-close app, relaunch; exact set restored. Simulate transaction failure; editor retained and no false confirmation. |
| Offline scope | With cached account/catalog/templates, airplane-mode start, typed sets, finish, history, template operations and corrections work from SQLite. First sign-in clearly needs network. |
| Upload reliability | Reconnect in foreground: operation uploads automatically. Lose response and retry same ID: one remote aggregate, no duplicate. Persist queue across restart. |
| Conflicts | Edit same root on two devices/offline partitions; both snapshots preserved, one root paused, explicit resolution and dependent operations handled. Custom-name/type conflicts are visible. |
| Ownership | Two real accounts cannot query/mutate each other's custom catalog, workouts, templates or change feed through API/RPC; no service-role client key. Partition/session cleanup verified. |
| Identity | Rename and archive retain old set references, and templates mark archived entries. A used exercise cannot change type. |
| Derived data | Edit/delete finished records; previous performance, history, chart/table and totals change together on next viewing, even before upload. |
| Units | 100 kg displays 220.5 lb; 45 lb displays 20.4 kg with selected factor. Mixed-unit totals convert before summing; repeated preference switching never rewrites stored inputs. |
| Dates/graphs | Backdated session uses selected date; Monday buckets, empty weeks, all-time empty state, single-point state, previous-week zero and partial week labels behave as modeled. |
| Readability | On a native device, use enlarged text through 200%; all controls remain reachable, rows/labels readable, graphs have text/table access. |
| Deployment | App builds with generated configuration, connects to its own backend, and installs through the recorded TestFlight build. Untested Android support is reported as untested. |

High-level nonfunctional expectations are evaluated through these observed behaviors, not invented capacity or response-time promises.
