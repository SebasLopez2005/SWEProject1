# Selected revised fitness stories

Verbatim story paragraphs and acceptance details from [the revised report](source/Fitness_Workout_Log_App_Revised_v2.docx), reviewed November 4, 2026. All 31 stories and 101 original points remain in scope. Numeric proposals retain their source status. See SCOPE.md for additional design decisions.

## FW-01 - Start a workout, add exercises

As an experienced lifter, I want to start a workout and add exercises as I go, so that I can log in the order I actually train.

Starts dated now; exercises come from the library (FW-11); a workout with no sets cannot be finished, only discarded.

Original estimate: 3 story points.

## FW-02 - Record a set with prefill

As an experienced lifter, I want to record a set by entering weight and reps, prefilled from my previous set, so that I can log between sets without losing rest time.

A new set copies the previous one; the first copies the latest set of that exercise. Proposed limits: weight 0 to 999.9, reps 1 to 999.

Original estimate: 5 story points.

## FW-03 - Set form matches exercise type

As a home trainer, I want the set form to ask only for what applies to the exercise, so that I am not forced to enter a weight for push-ups or planks.

Weight and reps, reps only, or seconds (whole number, at least 1), according to the exercise type (FW-12).

Original estimate: 3 story points.

## FW-04 - See previous performance

As a beginner lifter, I want to see what I did the last time I performed an exercise while I log it, so that I can choose today’s weight instead of guessing.

Shows the date and sets, or “No previous record”; uses only the user’s own workouts; reflects later edits and deletions (FW-17, FW-18).

Original estimate: 3 story points.

## FW-05 - Correct or remove a set or entry

As an experienced lifter, I want to correct or remove a set, or remove an entry, during a workout, so that one mistaken tap does not corrupt my history.

Edits use the FW-02 validation; deleting asks for confirmation and can be undone at once; set numbers update.

Original estimate: 3 story points.

## FW-06 - Finish workout, see summary

As a returning lifter, I want to finish a workout and see a short, plain summary, so that I know it is saved and can read what I did.

Summary: date, duration, exercises, sets and total volume; entries without sets are dropped and the user is told; the workout appears in history (FW-14).

Original estimate: 3 story points.

## FW-07 - Resume an unfinished workout

As a beginner lifter, I want my unfinished workout to still be there if I switch apps or my phone locks, so that an interruption does not cost me the session.

Sets survive closing or restarting the app; reopening offers to resume or discard.

Original estimate: 3 story points.

## FW-08 - Record a workout on an earlier date

As a home trainer, I want to record a workout I already did by choosing an earlier date, so that I can catch up when I could not use my phone during the session.

Future dates cannot be chosen; it appears in history and graphs on that date.

Original estimate: 2 story points.

## FW-09 - Log offline, upload later

As a home trainer, I want to log a workout when I have no connection and have it uploaded later, so that I never lose a session because of my signal.

Logging, library and templates work offline; the user sees whether a workout is waiting or uploaded; upload is automatic.

Original estimate: 8 story points.

## FW-10 - Choose kg or lb

As a beginner lifter, I want to choose whether weights are shown in kg or lb, so that entries match the plates and machines I use.

Chosen at first use, changeable in settings; converts displayed weights, including past ones.

Original estimate: 2 story points.

## FW-11 - Find an exercise; recent first

As a beginner lifter, I want to find an exercise by typing part of its name or filtering by muscle group, with recent ones first, so that I can add the right exercise without knowing its exact name.

The library ships with predefined common gym and home exercises, and the user’s own are added to it; search ignores case, matches anywhere and updates as the user types; with no text, the last 10 used (proposed) come first; no match offers FW-12.

Original estimate: 3 story points.

## FW-12 - Create a custom exercise

As a home trainer, I want to create my own exercise with a name and a type, so that I can log home and unusual movements the library lacks.

Name 1 to 60 characters (proposed), unique under A-EX-2; the type is locked once a set uses it; only its creator can see the exercise.

Original estimate: 3 story points.

## FW-13 - Rename or archive a custom exercise

As an experienced lifter, I want to rename or archive a custom exercise, so that I can tidy my library without losing history.

A rename applies to past workouts and graphs; archiving hides it from search, keeps its sets and can be undone; used exercises cannot be deleted.

Original estimate: 3 story points.

## FW-14 - List finished workouts

As a returning lifter, I want to see a list of my finished workouts with dates, exercises and number of sets, so that I can quickly check when and what I trained.

Each row shows the date, up to three exercise names (“and N more”) and the set count; only the user’s own workouts are listed; older ones load on scroll; an empty history explains how to log.

Original estimate: 3 story points.

## FW-15 - Open a past workout

As an experienced lifter, I want to open a past workout and see every exercise and set as recorded, so that I can plan a repeat or check what I did.

Shows exercises in order, sets in the user’s unit, date, duration (if recorded) and total volume.

Original estimate: 2 story points.

## FW-16 - History of one exercise

As an experienced lifter, I want to see every time I performed one exercise, with the sets from each session, so that I can follow one lift in numbers.

Reachable from the library and from a workout entry; newest first; archived exercises can still be viewed.

Original estimate: 3 story points.

## FW-17 - Edit a finished workout

As a home trainer, I want to edit a finished workout, so that I can fix mistakes I notice later.

Set values, sets and entries, and the date can change, with FW-02 and FW-03 validation; a workout cannot be edited to have no sets (delete it instead).

Original estimate: 5 story points.

## FW-18 - Delete a finished workout

As a home trainer, I want to delete a finished workout after confirming, so that accidental or test entries do not distort my history and graphs.

The confirmation names the date and set count; the workout then disappears from history, previous performance and graphs.

Original estimate: 2 story points.

## FW-19 - Filter history

As a beginner lifter, I want to narrow my history to a date range or to one exercise, so that I can find a specific period or lift without scrolling.

Date range and exercise can be combined and cleared; no matches shows a message.

Original estimate: 3 story points.

## FW-20 - Per-exercise volume graph

As an experienced lifter, I want to see a graph of my total volume for one exercise over time, so that I can tell whether I am lifting more than before.

One point per workout; axes show units and dates; fewer than two workouts shows a message.

Original estimate: 5 story points.

## FW-21 - Choose the period

As an experienced lifter, I want to choose the period shown on a graph, so that I can compare recent weeks with the longer trend.

Periods as in A-GRA-3; changing it updates the graph and its text summary (all graphs).

Original estimate: 2 story points.

## FW-22 - Overall weekly volume graph

As a beginner lifter, I want to see my total volume per week across all weight-based exercises, so that I can tell whether I am training more overall.

One value per calendar week, zero if empty; a sentence compares the latest two weeks.

Original estimate: 3 story points.

## FW-23 - Reps-only total reps graph

As a home trainer, I want to see my total reps per workout for a reps-only exercise, so that I can follow progress on bodyweight exercises.

Same graph as FW-20; the vertical axis reads “Total reps”.

Original estimate: 2 story points.

## FW-24 - Select a point, open workout

As an experienced lifter, I want to select a point on a graph to see its date and value and open that workout, so that I can understand an unusually high or low session.

Shows the value and opens the workout (FW-15); a weekly point lists its workouts.

Original estimate: 3 story points.

## FW-25 - Save workout as template

As a home trainer, I want to save the exercises of a finished workout as a named template, so that I can start my usual routine again without re-entering it.

Name 1 to 60 characters (proposed), unique; exercises saved in the order performed, without sets.

Original estimate: 3 story points.

## FW-26 - Start workout from template

As an experienced lifter, I want to start a workout from a template, so that its exercises are already in the workout when I begin.

Exercises appear in order with no sets; archived ones are marked and can be skipped; the template is unchanged.

Original estimate: 3 story points.

## FW-27 - Create and edit a template

As a beginner lifter, I want to create and edit a template by choosing exercises myself, so that I can set up my plan at home before going to the gym.

Name it, add exercises via FW-11 search, reorder, remove; finished workouts are unchanged.

Original estimate: 5 story points.

## FW-28 - Delete a template

As an experienced lifter, I want to delete a template, so that I can retire routines I no longer use.

The confirmation names the template; finished workouts started from it are unchanged.

Original estimate: 2 story points.

## FW-29 - Larger text size

As a returning lifter, I want to make the text larger, so that I can read my workouts and summaries without straining.

A setting offers larger text sizes up to 200%; screens stay usable without losing content, and the choice is remembered.

Original estimate: 3 story points.

## FW-30 - See both units

As a returning lifter, I want to see each weight with its equivalent in the other unit, so that I know how much to load when a gym’s plates use a different unit.

Set rows and previous performance show both, for example “60 kg (132.3 lb)”; a setting turns the equivalent on or off.

Original estimate: 3 story points.

## FW-31 - Enter a set in either unit

As a returning lifter, I want to enter a set in either kg or lb, so that I can log what the plates say without converting.

The set form offers a unit switch that defaults to the account unit; the set keeps the unit entered; weight limits apply in the unit entered.

Original estimate: 5 story points.
