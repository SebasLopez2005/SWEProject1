# Fitness & Workout Log App — Claude Product Definition

Sep 28, 2026 · @Diego Bonilla

This is the Claude-generated requirements definition for the Fitness & Workout Log App only; the Recipe & Meal Planning Portal is intentionally not covered.

## 1. Product Vision

**Note on sources.** I do not have the text of Sommerville's *Engineering Software Products* in this session. The concepts used here (product vision, personas, scenarios, user stories, features) are the standard ones from that chapter's subject area as I know them; no quotations or page numbers are given. Anything that is my own inference is labelled as an assumption.

### Initial Vision

The Fitness & Workout Log App is a mobile app that helps people who train regularly to log their workouts, track exercises and sets, and view their progress over time through graphs. It makes fitness tracking easy and motivating, so users can stay consistent, see improvement and reach their goals. Unlike other apps, it is simple, fast and works for everyone from beginners to advanced athletes.

### Vision Critique

| # | Problem in the initial vision | Why it matters for later requirements |
| --- | --- | --- |
| 1 | "Easy and motivating" and "simple, fast" are not measurable and would let developers interpret them in any way. | Non-functional requirements cannot be derived from adjectives. |
| 2 | "Everyone from beginners to advanced athletes" is overly broad and hides real differences in what each group needs. | Personas need distinct needs; "everyone" gives no design guidance. |
| 3 | The core problem is never stated. Why do current tools (paper, notes apps, spreadsheets) fail? | Scenarios must describe a problem, not just a product. |
| 4 | "Reach their goals" implies goal setting, which is outside the concept (log, track, view history). | Invites scope creep into goals, plans and coaching. |
| 5 | "Unlike other apps" is an unsupported claim; no competitor comparison exists. | Would need market research (**Requires Human Validation**). |
| 6 | Context of use is missing: logging happens mid-workout, one-handed, between sets, possibly with no signal. | This is the strongest driver of the usability and reliability requirements. |
| 7 | "Motivating" is left undefined; the concept only supports motivation through visible progress. | Must be tied to a concrete capability (historical volume graphs). |
| 8 | No statement of what the product will not do. | Nutrition, social, coaching and wearables are common assumptions users bring. |

### Refined / Final Vision

**For** people who lift weights or do strength and bodyweight training on a regular schedule and currently record sessions on paper, in a notes app or in a spreadsheet, **the Fitness & Workout Log App is** a mobile-first workout log **that** lets them record each workout, exercise and set in a few taps between sets, and then review their past sessions and see how their training volume changes over time.

**The problem it addresses.** Recording a workout mid-session is awkward with general-purpose tools: entries are typed in inconsistent formats, last session's numbers are hard to find at the moment they are needed, and turning old notes into a picture of progress means manual effort that most people never do. As a result, people guess their next weights and cannot tell whether they are improving.

**Core experience.** During a workout, the user records sets quickly with the previous performance visible. Afterwards, the user can look back through history and see volume graphs per exercise and overall.

**Value.** Accurate, consistent training records; less guesswork when choosing weights; a visible view of progress that supports consistency.

**Differentiating concept (an assumption, not a validated market claim).** A narrow focus on fast in-workout entry and on historical review of one's own data, rather than a broad fitness platform.

**Scope.** Logging workouts, exercises and sets; an exercise library with custom exercises; workout history with correction; volume graphs; reusable workout lists. Reasonable for a student prototype.

**Explicitly not intended to solve.** Nutrition tracking, social features, coaching or trainer marketplaces, medical or injury advice, AI-generated plans, wearable integration, payments, and goal-setting or program design.

**Vision-level needs used for traceability later**

1. N1: Log sets quickly during a workout on a phone.
2. N2: See previous performance when deciding today's weights.
3. N3: Keep exercise records consistent and comparable over time.
4. N4: Review past workouts.
5. N5: See training volume over time.
6. N6: Repeat regular routines without rebuilding them.
7. N7: Never lose logged data, including when there is no signal.
8. N8: Fix mistakes in recorded data.
9. N9: Use the units the user trains in (kg or lb).

## 2. AI Interaction / Product Vision Development Log

**Honesty note.** The stages below are stages of one Claude-assisted development process, produced within a single response to your prompt. They were not separate real-world conversations or API calls. The comparison with another model is not included and is left for you to add.

| Iteration | Purpose | Main Changes | Reason |
| --- | --- | --- | --- |
| 1. Initial Product Vision | Turn the one-line concept into a first vision from your prompt only. | Produced a short marketing-style paragraph covering what, who, and value. | Baseline to critique; shows what an unreviewed AI answer looks like. |
| Self-Critique | Test the vision against your prompt's checklist (ambiguity, breadth, assumptions, scope, measurability). | Found eight weaknesses (unmeasurable adjectives, "everyone", no problem statement, goals scope creep, unsupported "unlike other apps", no context of use, undefined "motivating", no exclusions). | A vision that cannot be tested cannot drive personas or requirements. |
| 2. Refined Product Vision | Fix each weakness so the vision can anchor later work. | Named target users and current tools, stated the problem, added the mid-workout context, replaced adjectives with concrete capabilities, added an explicit out-of-scope list, labelled the differentiator as an assumption, and derived nine numbered needs (N1 to N9). | Numbered needs allow later traceability from requirements back to the vision. |
| Final Evaluation | Check that the refined vision supports personas, scenarios and requirements. | Confirmed each of N1 to N9 is reachable from at least one persona and 1-pager (see the traceability matrix). | Ensures the vision is a working foundation, not decoration. |

### Interaction 1 — Initial Product Vision

**Information provided to the AI:** the one-line product concept (mobile-first UI for logging workouts, tracking sets, viewing historical volume graphs), the Sommerville reference, the instruction to keep the product focused, and the list of features not to add. **Result:** a short, generic vision that described a pleasant fitness app but said little about the actual user problem or the situation in which logging happens.

### Self-Critique

The initial vision read like marketing copy. It used adjectives no one could test, tried to cover every fitness level at once, and quietly added goal-setting. It also made a competitive claim without evidence and never mentioned that users log on their feet between sets, sometimes without signal. The full list is in Section 1.

### Iteration 2 — Refined Product Vision

The refinement rewrote the vision in a for/who/the product/that structure, added the problem and the core experience, limited the scope to five feature areas, wrote an explicit exclusion list, and produced nine numbered needs. Each change answers a specific critique item, so the reason for each change can be defended in your write-up.

### Final Evaluation

The final vision is a better foundation because it (1) says who the users are and what they use today, which the personas build on; (2) states a real problem, which the scenario-style problem statements in each 1-pager build on; (3) fixes the context of use, which is the source of the usability, reliability and data-integrity requirements; and (4) provides numbered needs that the traceability matrix links to stories. The differentiator remains an assumption and needs your judgment (**Requires Human Validation**).

## 3. Personas

**Important.** These personas are fictional composites created to represent plausible user types. They are not based on interviews or user research, and no real users were consulted (**Requires Human Validation**). Three personas were chosen because the vision has three genuinely different usage situations: data-driven progression, learning while training, and training with constrained equipment and connectivity.

### Persona 1: Marcus Reyes

**Persona type:** Primary user.

**Background:** 29, software tester, trains at a commercial gym five days a week and has lifted for six years. Follows a push/pull/legs split.

**Goals:** Add weight or reps to his main lifts every few weeks, and know whether he is really progressing.

**Motivations:** Progress he can prove with numbers keeps him consistent; stalling without noticing frustrates him.

**Behaviors:** Logs each set in a notes app on his phone. Rests 90 to 180 seconds between sets and logs in that window. Once a month he copies numbers into a spreadsheet to make a chart, and often skips it.

**Pain points:** Names of exercises drift ("bench", "Bench Press", "BB bench"), so history cannot be compared. He forgets last week's numbers and scrolls through old notes at the rack. Retyping the same six exercises each session is tedious.

**Needs:** Very fast set entry, previous performance in view, consistent exercise names, reusable workout lists, and volume graphs per exercise.

**Technology / usage context:** Own phone, one-handed, sometimes with chalky hands. Gym basement has patchy signal.

**Product expectations:** Logging must not cost him rest time. The history must be trustworthy enough to make training decisions.

**Representative scenario:** Marcus opens the app before leg day and starts his saved "Legs" workout. At the squat rack, the app shows last week's sets (100 kg x 5, 100 kg x 5, 95 kg x 6). He performs a set, taps to log it with the weight already filled in, and adjusts only the reps. After the session he finishes the workout, then opens the squat graph to check if his weekly volume is trending upward.

### Persona 2: Priya Nair

**Persona type:** Primary user (different needs from Marcus).

**Background:** 24, graduate student, started going to the university gym three months ago after a long break. Follows a three-day beginner plan she found online.

**Goals:** Build a regular habit, learn the exercises in her plan, and decide how much weight to use next time.

**Motivations:** Wants reassurance that she is improving and that the effort is paying off; worried about quitting.

**Behaviors:** Photographs the plan sheet, uses paper or memory to track weights, often forgets what she lifted last time. Tends to use lighter weights than she could handle because she does not know her previous numbers.

**Pain points:** Unfamiliar exercise names, a cluttered interface intimidates her, and she doubts whether she is doing "enough". Spreadsheets feel like too much.

**Needs:** A simple flow with little jargon, previous performance shown while logging, easy exercise search, and a simple progress view that needs no fitness knowledge to read. Uses kilograms.

**Technology / usage context:** Phone only. Reliable campus Wi-Fi. Uses the app briefly between sets, sometimes distracted.

**Product expectations:** It should feel approachable, forgive mistakes, and make progress visible without setup.

**Representative scenario:** Priya arrives for her Day 2 workout, taps "Start workout", searches "row", and selects "Seated cable row" from the results. The app shows "Last time: 30 kg x 10, 30 kg x 10, 30 kg x 8". She decides to try 32.5 kg, logs three sets, and finishes. The summary shows total sets and volume. Later in the week, she opens the overall weekly volume graph to see whether she is training more than last month.

### Persona 3: Elena Okafor

**Persona type:** Secondary user (constraint-driven).

**Background:** 36, nurse working rotating shifts, trains at home in a basement with dumbbells, a bench and her bodyweight, three or four times a week at irregular times.

**Goals:** Keep a consistent routine despite shifts, and track her push-ups, planks and dumbbell work with the same rigor as a gym-goer.

**Motivations:** Health and stress relief; keeping momentum matters more than heavy loads.

**Behaviors:** Follows the same short routine most sessions, adds occasional new exercises, and sometimes logs after the workout because her hands are busy. Has tried apps that assume every set has a weight.

**Pain points:** Timed and bodyweight exercises are not supported well, custom exercises are missing, mobile signal in the basement is unreliable, and she has lost a whole session's notes once when an app failed to save.

**Needs:** Custom exercises of different types (weighted, reps-only, timed), the ability to log without a connection and to log a session afterwards, one-action repeat of her usual routine, and the ability to correct entries.

**Technology / usage context:** Phone on a shelf or floor, no reliable signal, picks up the phone with one hand between sets.

**Product expectations:** Nothing she logs should be lost. She should not have to fill in values that do not apply to her exercise.

**Representative scenario:** After a night shift, Elena starts "Repeat last workout" in her basement with no signal. The app opens with her usual exercises. She logs push-ups as reps only and a plank as seconds. She adds a new custom exercise, "Farmer carry", of the timed type. She finishes; the workout is saved on the device and later syncs when she is upstairs on Wi-Fi.

### Persona Consistency Check

| Check | Result |
| --- | --- |
| Plausible users? | Yes. Each corresponds to a realistic gym or home exerciser. This is a judgment, not research. |
| Meaningfully different? | Yes. They differ in experience (6 years vs 3 months vs mixed), what they log (weights vs unfamiliar exercises vs bodyweight and timed), and context (gym with patchy signal, campus Wi-Fi, no signal at home). |
| Connected to the vision? | Yes. Each maps to needs N1 to N9 (see Section 4). |
| Enough coverage? | Yes for the five feature areas. Gaps: users with injuries or medical needs, and users following coach-written programs with prescribed loads (both out of scope by design). |
| Redundant? | No. Removing any persona would remove a distinct set of requirements: Marcus drives speed, recall and graphs; Priya drives search and simplicity; Elena drives exercise types, offline and repeat. |
| Missing types? | A fourth persona (a coach or trainer) was considered and rejected because coaching is explicitly out of scope. |

## 4. Persona-to-Requirement Traceability

| Persona | Main Problem | Main Goal | Relevant Product Capabilities |
| --- | --- | --- | --- |
| Marcus Reyes | Slow, inconsistent note-taking mid-workout; cannot see whether he is progressing without manual spreadsheet work. | Prove and continue progressive overload on main lifts. | Fast set entry with prefilled values; previous performance while logging; consistent exercise library; recently used exercises; reusable workout lists; per-exercise volume graphs with time ranges; drill-down from graph to workout; correction of history. |
| Priya Nair | Forgets previous weights and does not know exercise names; feels unsure she is improving. | Build a habit and pick sensible weights. | Exercise search and filter; previous performance shown while logging; workout summary; simple overall weekly volume graph; kg/lb choice; history list; forgiving edit and delete; empty states for new users. |
| Elena Okafor | Apps assume every set has a weight; no signal at home; lost a session once. | Keep a routine with home, bodyweight and timed exercises without losing data. | Custom exercises of three types; offline logging with later sync; resume of in-progress workouts; logging afterwards with a past date; one-action repeat of last workout; reps-only progress graph; edit completed workouts. |

## 5. 1-Pagers / Epics

**Why five 1-pagers.** The vision has five areas that can be argued about independently, each grounded in a different combination of personas: (1) recording a workout, (2) choosing and maintaining exercises, (3) reviewing and correcting past workouts, (4) seeing volume over time, and (5) not rebuilding the same workout repeatedly. A single 1-pager would mix unrelated problems; more than five would split areas that share one user problem. Sign-in and account management is deliberately **not** a 1-pager: it is not part of the vision's core value and is handled as an assumption (see Open Questions).

**Terminology used throughout.** *Workout* = one training session on one date. *Exercise* = a named movement in the library. *Workout entry* = an exercise performed within a workout. *Set* = one recorded bout inside a workout entry. *Volume* = the sum of weight x reps over sets of weight-and-reps exercises. *Template* = a named, saved list of exercises used to start workouts.

**Sizing metric (used in all five 1-pagers).** Story points on a modified Fibonacci scale, chosen because they express relative effort and uncertainty without pretending to predict hours. All sizes are **initial estimates** and may change after further analysis.

| Points | Meaning |
| --: | --- |
| 1 | Trivial: single UI state, no new data, no meaningful edge cases. |
| 2 | Very small: one screen or control, simple validation, one data field. |
| 3 | Small: a few UI states, standard validation, depends on existing data. |
| 5 | Moderate: several screens or states, notable rules or edge cases, or non-trivial data handling. |
| 8 | Complex: cross-cutting behavior, real uncertainty, or synchronization concerns. |
| 13 | Very complex: would normally be split further (none used here). |

**Non-functional target labels.** Each NFR is marked **\[Explicit\]** (stated in your assignment or prompt), **\[Assumption\]** (reasonable but unconfirmed) or **\[Proposed target\]** (a number I chose; needs validation). No numbers came from the assignment or the book.

## 5.1 Workout Session Logging 1-pager

### PROBLEM

Marcus is between sets at the squat rack with 90 seconds of rest. He wants to record the set he just finished, but his notes app asks him to type the exercise name again, format the numbers by hand, and scroll back to see what he did last week. By the time he has finished typing, he is late for his next set, so he often skips writing anything and reconstructs the session from memory afterwards, which produces gaps and errors.

Priya has the opposite difficulty: she does not remember what she lifted last time, so she picks weights by guesswork, usually too light. Elena logs in a basement with no signal and has lost a full session once because an app failed to save it. All three need the act of recording a set to be quick, resilient and informed by earlier sessions, or they stop recording, and the history that gives the product its value never exists.

### ASSUMPTIONS

| ID | Assumption | Why it is needed |
| --- | --- | --- |
| A-WL1 | A workout is one session with a date and time, containing an ordered list of workout entries, each with an ordered list of sets. | Fixes the terminology every later story depends on. |
| A-WL2 | Each exercise has one of three types: weight and reps, reps only, or duration in seconds. | Elena's push-ups and planks cannot be recorded with a weight field; the vision says workout logging, not barbell logging only. |
| A-WL3 | The user chooses one weight unit (kg or lb) that applies to the whole account. Changing it converts displayed values but does not alter what was recorded. | Marcus (lb) and Priya (kg) need different units; a per-set unit would complicate graphs. **Requires Human Validation.** |
| A-WL4 | Data belongs to one signed-in user. How the user signs in is outside these 1-pagers; a simple account is assumed for the prototype. | Data must persist and be private; authentication is not core to the vision. **Requires Human Validation.** |
| A-WL5 | Workouts may be logged live or afterwards for a chosen past date, but not for a future date. | Elena sometimes logs after the workout; future dates would corrupt history. |
| A-WL6 | The app should still work when there is no connection, with data uploaded later. | Elena's and Marcus's usual environment; a hard assumption of this product's context of use. **Requires Human Validation** (increases cost). |
| A-WL7 | Rest timers, set types such as warm-up or drop-set, notes per workout and photos are excluded from the prototype. | Not required by the vision; keeps scope controlled. |

### FUNCTIONAL REQUIREMENTS

**WL-1.** As **Marcus**, I want to start a new workout and add exercises to it as I go, so that I can log in the order I actually train instead of filling out a fixed form.

- Starting a workout sets its date and time to now. Only one workout can be in progress at a time.
- Exercises are added from the exercise library (see EX-1 and EX-3) and appear in the order added.
- A workout with no sets cannot be finished; the user may discard it instead.
- Edge case: adding the same exercise twice in one workout is allowed (for example, a second bench press block).

**WL-2.** As **Marcus**, I want to record a set by entering weight and reps with a numeric keypad, so that I can log between sets without losing rest time.

- For a new set, weight and reps are prefilled with the values from the previous set of the same exercise in this workout; the user changes only what differs.
- Recording a set whose values equal the prefilled ones takes no more than 3 taps (see NFR-WL2).
- Validation: weight from 0 to 999.9 in the chosen unit with at most 1 decimal place; reps a whole number from 1 to 999; invalid entries show a message and are not saved.
- The set appears in the workout entry immediately and is numbered in order.

**WL-3.** As **Priya**, I want to see what I did the last time I performed this exercise while I am logging it, so that I can choose today's weight instead of guessing.

- Shows the date and all sets of the most recent completed workout that includes the same exercise.
- If none exists, shows "No previous record" instead of empty space.
- Reflects edits made to past workouts (see HI-4).
- Dependency: uses data from completed workouts (WL-7).

**WL-4.** As **Elena**, I want the set form to match the type of exercise, so that I do not have to enter a weight for push-ups or planks.

- Weight and reps type: weight and reps. Reps only type: reps. Duration type: seconds (whole number from 1 to 86,400).
- The type is set on the exercise (see EX-2), not on each set.
- Previous-performance display (WL-3) uses the same fields.

**WL-5.** As **Marcus**, I want to correct or remove a set, or remove an exercise, during the workout, so that one mis-tap does not corrupt my history.

- Tapping a set opens it for editing; changes save when confirmed.
- Deleting a set or a workout entry requires a single confirmation that can be undone for at least 5 seconds (proposed).
- Set numbers renumber after deletion.

**WL-6.** As **Elena**, I want to log a workout when I have no connection and have it saved and uploaded later, so that I never lose a session because of my signal.

- Everything needed to log (library, previous performance, in-progress workout) is available with no connection.
- Sets are saved on the device at the moment they are entered.
- When the connection returns, the workout is uploaded automatically without user action, and the user can see whether it is waiting or uploaded.
- Edge case: the same account used on two devices; the rule for conflicting edits is an **open question**.

**WL-7.** As **Priya**, I want to finish a workout and see a short summary, so that I know it was saved and can see what I accomplished.

- Summary shows date, duration (start to finish), number of exercises, number of sets, and total volume for weight-and-reps exercises.
- After finishing, the workout appears in history (HI-1) and is used by WL-3.
- Empty exercises (no sets) are dropped from the workout on finish, with the user told.

**WL-8.** As **Priya**, I want my unfinished workout to still be there if I switch apps or my phone locks, so that being interrupted does not cost me my session.

- All sets entered so far are kept when the app is closed, backgrounded, or the phone restarts.
- Reopening the app offers to resume the in-progress workout.
- If a workout has been in progress for more than 12 hours, the app asks whether to finish or discard it (proposed).

**WL-9.** As **Elena**, I want to log a workout that I already did by choosing a past date, so that I can catch up after forgetting my phone.

- Date picker allows any past date up to today; future dates are not selectable.
- Backdated workouts appear in history and graphs at the chosen date.

**WL-10.** As **Priya**, I want to choose whether weights are in kg or lb, so that entries match the plates I actually use.

- Set at first use; changeable later in settings.
- Changing the unit converts displayed weights; stored values are not altered by repeated switching (see A-WL3).

**Quality control review.** *Coverage:* the stories cover start, record, correct, recall, finish, interrupt, offline and units. *Persona alignment:* each story names one persona; every persona has at least two. *Value:* each story has a "so that". *Redundancy:* WL-9 and WL-1 both create workouts, but backdating has distinct rules, so they are kept separate. *Dependencies:* WL-3 depends on WL-7 and EX-1; WL-6 constrains how WL-2 and WL-8 store data. *Missing item found and fixed:* units had no home, so WL-10 was added.

### NON-FUNCTIONAL REQUIREMENTS

| ID | Category | Requirement | Type |
| --- | --- | --- | --- |
| NFR-WL1 | Data integrity | Every set is saved on the device at the moment it is entered; after a forced app close, no more than the set being typed may be lost. | Proposed target |
| NFR-WL2 | Usability | Repeating the previous set requires at most 3 taps; the main logging controls have a touch target of at least 44 x 44 points. | Proposed target |
| NFR-WL3 | Performance | A logged set appears in the workout within 300 ms of confirmation on a mid-range phone. | Proposed target |
| NFR-WL4 | Reliability | Sets logged offline are uploaded within 60 seconds of the connection returning, with no duplicates. | Proposed target |
| NFR-WL5 | Accessibility | Text and controls meet a 4.5:1 contrast ratio so they are readable in bright gym lighting. | Assumption (aligned with WCAG AA) |
| NFR-WL6 | Privacy | A user's workout data is visible only to that user. | Assumption |
| NFR-WL7 | Compatibility | Works on current versions of iOS and Android phones with screens at least 360 px wide. | Assumption (target platforms **Require Human Validation**) |

### REQUIREMENTS SIZING

Metric: story points (scale in Section 5). Initial estimates only.

| Story ID | User Story | Size | Rationale |
| --- | --- | --: | --- |
| WL-1 | Start workout and add exercises | 3 | A few UI states and one-workout-at-a-time rule; depends on the library. |
| WL-2 | Record a set with keypad | 5 | Central interaction; prefilling, numeric validation and 3-tap target need careful UI design. |
| WL-3 | See previous performance | 3 | Needs a lookup of the most recent workout with the exercise and an empty state. |
| WL-4 | Set form matches exercise type | 3 | Three field variants and their validation. |
| WL-5 | Correct or remove set or exercise | 3 | Edit and delete states, undo, renumbering. |
| WL-6 | Log offline, upload later | 8 | Local storage, sync, duplicate avoidance, and conflict uncertainty. Highest risk in this 1-pager. |
| WL-7 | Finish and see summary | 3 | Summary calculation, empty-exercise handling, workout becomes history. |
| WL-8 | Resume interrupted workout | 3 | Persistence across app lifecycle; timeout prompt. |
| WL-9 | Log workout on a past date | 2 | Date picker with limits; reuses the logging flow. |
| WL-10 | Choose kg or lb | 2 | One setting, display conversion, rounding edge cases. |

**Total: 35 points.**

## 5.2 Exercise Library 1-pager

### PROBLEM

Marcus's notes contain "bench", "Bench Press" and "BB bench" for the same lift. When he tries to see how his bench press has changed, the entries do not line up, so the comparison he wanted is impossible without cleaning the data by hand. Priya has a different version of the problem: her plan sheet says "cable row" and "seated row", she is not sure they are the same, and she does not know what to type. Elena trains with movements that most exercise lists do not contain, such as farmer carries, and gives up on apps that will not let her add them.

If the same exercise can appear under many names, history and graphs cannot be trusted. The product therefore needs one consistent set of exercises that users choose from, that they can extend, and that stays stable when they tidy it up.

### ASSUMPTIONS

| ID | Assumption | Why it is needed |
| --- | --- | --- |
| A-EX1 | The app ships with a predefined library of common exercises (at least 50 in the prototype; the exact list is a content decision). | Priya should not need to invent names. The number is a **Proposed target**. |
| A-EX2 | Each exercise has a name, a type (weight and reps, reps only, or duration) and one muscle group used only for filtering. | Type drives the set form (WL-4); muscle group helps beginners find exercises. Muscle-group analysis is out of scope. |
| A-EX3 | Predefined exercises cannot be edited or deleted; custom exercises belong to one user and are visible only to that user. | Keeps the shared library stable and private data private. |
| A-EX4 | Exercise names are unique per user, ignoring upper or lower case and surrounding spaces, across predefined and custom exercises. | Prevents the duplicate-name problem that motivates this 1-pager. |
| A-EX5 | Exercise instructions, images and videos are not included. | Would be a content project of its own; Priya's need for exercise names is met by search and filtering. |

### FUNCTIONAL REQUIREMENTS

**EX-1.** As **Priya**, I want to search the exercise library by part of a name and filter it by muscle group, so that I can find an exercise even when I only know part of its name or which muscle I want to train.

- Search is case-insensitive and matches anywhere in the name; results update as the user types.
- Muscle-group filter can be combined with search; a clear control resets both.
- No results shows a message and an option to create a custom exercise (EX-2).

**EX-2.** As **Elena**, I want to create my own exercise with a name and a type, so that I can log home and unusual movements the library does not have.

- Name is required, 1 to 60 characters, and unique per A-EX4; a duplicate shows the existing exercise instead of creating a copy.
- Type is chosen at creation (weight and reps, reps only, duration). It cannot be changed after the first set has been logged, because that would invalidate recorded sets.
- The new exercise can be added to the current workout immediately.

**EX-3.** As **Marcus**, I want my recently used exercises shown first when I add an exercise, so that I do not have to search for the same lifts every session.

- Shows the 10 most recently used exercises above the full library (proposed number).
- A new user with no history sees the full library only.

**EX-4.** As **Marcus**, I want to rename or archive a custom exercise, so that I can tidy my library without losing history.

- Renaming applies everywhere the exercise appears, including past workouts and graphs; uniqueness (A-EX4) still applies.
- Archiving hides the exercise from selection and search but keeps all past sets and graphs.
- Archived exercises can be restored. Exercises with history cannot be permanently deleted in the prototype.

**Quality control review.** *Coverage:* find, create, reuse, maintain. *Persona alignment:* Priya (EX-1), Elena (EX-2), Marcus (EX-3, EX-4). *Scope:* instructions, videos and muscle-group analytics were deliberately left out (A-EX5). *Dependencies:* EX-2 feeds WL-4; EX-4 affects TM stories (archived exercises in templates). *Missing item checked:* Priya's "what is this exercise" need is handled by search and filtering only; a description feature was rejected as scope creep.

### NON-FUNCTIONAL REQUIREMENTS

| ID | Category | Requirement | Type |
| --- | --- | --- | --- |
| NFR-EX1 | Performance | Search results appear within 500 ms of each keystroke for up to 500 exercises. | Proposed target |
| NFR-EX2 | Data integrity | Each exercise has a stable identity so renaming never disconnects it from its recorded sets. | Explicit need (consistent records, N3) |
| NFR-EX3 | Privacy | Custom exercises are visible only to their creator. | Assumption |
| NFR-EX4 | Usability | A first-time user can add an exercise to a workout in no more than 4 taps from starting a workout, without leaving the workout screen. | Proposed target |
| NFR-EX5 | Accessibility | Search field and filter controls have text labels and work with screen-reader labels. | Assumption |

### REQUIREMENTS SIZING

Metric: story points (scale in Section 5). Initial estimates only.

| Story ID | User Story | Size | Rationale |
| --- | --- | --: | --- |
| EX-1 | Search and filter the library | 3 | Live search, filter combination and empty state; needs the seeded library. |
| EX-2 | Create custom exercise | 3 | Validation, uniqueness rule, type lock after first use. |
| EX-3 | Recently used exercises first | 2 | Simple ordered list from existing data. |
| EX-4 | Rename or archive custom exercise | 3 | Rename propagation, archive and restore states, effects on history. |

**Total: 11 points.**

## 5.3 Workout History & Review 1-pager

### PROBLEM

A month after a heavy leg day, Marcus wants to know what he squatted and how many sets he did, because he is deciding whether to repeat that session or vary it. In his notes app he has to scroll through weeks of unstructured text to find it. Priya wants to check whether she has actually trained three times a week since she started, and Elena has just noticed that last Tuesday's workout has a typo that recorded 300 kg instead of 30 kg on a dumbbell press, which now makes any graph she looks at meaningless.

A log is only useful if past sessions can be found, read as they were recorded, and fixed when they are wrong. Without that, users either stop trusting the data or stop recording it.

### ASSUMPTIONS

| ID | Assumption | Why it is needed |
| --- | --- | --- |
| A-HI1 | Completed workouts are kept until the user deletes them; the prototype does not expire data. | Graphs and comparisons need long histories. |
| A-HI2 | The history is ordered by workout date and time, newest first. | Users look for recent sessions first. |
| A-HI3 | Completed workouts can be edited, including their date (not to a future date). | Elena's typo scenario; also supports WL-9. |
| A-HI4 | Deleting a workout is permanent after one confirmation; there is no recycle bin in the prototype. | Keeps scope small; the risk is accepted. **Requires Human Validation.** |
| A-HI5 | A user may have on the order of 1,000 workouts (about three years at five per week); this is a sizing assumption for performance targets. | Needed to make the performance requirement measurable. |
| A-HI6 | A calendar view, notes and sharing of workouts are not included. | Priya's consistency need is met by a dated list and date filtering. |

### FUNCTIONAL REQUIREMENTS

**HI-1.** As **Priya**, I want to see a list of my completed workouts with their dates, exercise names and set counts, so that I can quickly check when and what I trained.

- Each row shows the date, the names of up to the first 3 exercises (with "and N more" if there are more), and the total number of sets.
- List loads in pages; older workouts load as the user scrolls.
- A new user with no workouts sees a message explaining how to log the first one.

**HI-2.** As **Marcus**, I want to open a past workout and see every exercise and set exactly as recorded, so that I can plan a repeat or check what I did.

- Shows exercise names in workout order, and each set with weight, reps or seconds in the user's unit.
- Shows date, duration, and total volume (as defined in Section 5).

**HI-3.** As **Marcus**, I want to see every time I have performed one exercise, with the sets of each session, so that I can follow one lift over time in numbers.

- Available from an exercise in the library and from a workout entry.
- Sessions are listed newest first, each with date and sets.
- Archived exercises remain viewable.

**HI-4.** As **Elena**, I want to edit a completed workout, so that I can fix mistakes I only notice later.

- Editable: set values, adding or removing sets and exercises, and the workout date.
- Same validation as WL-2 and WL-4.
- Saved changes update previous-performance display (WL-3), history and graphs (VG stories).
- Edge case: editing a workout to be empty is not allowed; the user must delete it instead.

**HI-5.** As **Elena**, I want to delete a completed workout after confirming, so that accidental or test entries do not distort my history and graphs.

- Confirmation states the workout date and number of sets.
- After deletion, the workout is removed from history and from all graph values.

**HI-6.** As **Priya**, I want to filter my history by date range or by exercise, so that I can find a specific period or lift without scrolling.

- Date range and exercise filter can be used together; a clear control resets both.
- No matches shows a message rather than an empty screen.

**Quality control review.** *Coverage:* find, read, follow one lift, correct, remove, narrow. *Persona alignment:* Priya (HI-1, HI-6), Marcus (HI-2, HI-3), Elena (HI-4, HI-5). *Redundancy:* HI-3 shows numbers per exercise, while VG-1 shows a graph; they answer different questions and are kept separate. *Dependencies:* HI-1 depends on WL-7; HI-4 and HI-5 must update graph values and WL-3. *Missing item checked:* a consistency indicator (calendar or streak) was considered for Priya and rejected as scope creep; HI-1 and HI-6 meet the need.

### NON-FUNCTIONAL REQUIREMENTS

| ID | Category | Requirement | Type |
| --- | --- | --- | --- |
| NFR-HI1 | Performance | The first page of history appears within 2 seconds on a typical mobile connection for an account with 1,000 workouts. | Proposed target |
| NFR-HI2 | Data integrity | After an edit or delete, history, previous performance and graphs reflect the change the next time they are viewed, with no manual refresh. | Assumption |
| NFR-HI3 | Data integrity | Past workouts are displayed exactly as recorded; weights are converted only for display when the unit changes. | Assumption |
| NFR-HI4 | Usability | A mistaken delete is prevented by a confirmation step that names the workout. | Assumption |
| NFR-HI5 | Reliability | Edits made offline follow the same offline and upload behavior as WL-6. | Assumption |
| NFR-HI6 | Privacy | A user can only see and change their own workouts. | Assumption |

### REQUIREMENTS SIZING

Metric: story points (scale in Section 5). Initial estimates only.

| Story ID | User Story | Size | Rationale |
| --- | --- | --: | --- |
| HI-1 | Chronological list of workouts | 3 | Paged list, summary row formatting, empty state. |
| HI-2 | Open a past workout | 2 | Read-only screen over existing data. |
| HI-3 | History of one exercise | 3 | Cross-workout query and a new screen; archived exercises. |
| HI-4 | Edit a completed workout | 5 | Reuses logging validation but adds many edit states and must update dependent views. |
| HI-5 | Delete a completed workout | 2 | Confirmation and removal; effects on graphs verified in testing. |
| HI-6 | Filter by date or exercise | 3 | Two filters, combination behavior, empty result. |

**Total: 18 points.**

## 5.4 Volume Progress Graphs 1-pager

### PROBLEM

Marcus wants to know whether his total squat volume has been rising over the last three months. To find out, he copies numbers from his notes into a spreadsheet, multiplies weight by reps by hand and builds a chart, which takes long enough that he only does it a few times a year. Priya has no interest in exercise-specific analysis; she just wants to know whether she is doing more overall than she was a month ago, since that is what keeps her going. Elena tracks push-ups, where there is no weight at all, and wants to see her total reps rise.

Progress is the main thing that keeps these users returning, but it is invisible when the data sits in flat records. The product needs to turn what users have already logged into a picture they can read at a glance, without extra work, and it must be honest: the graph must match the numbers they entered.

### ASSUMPTIONS

| ID | Assumption | Why it is needed |
| --- | --- | --- |
| A-VG1 | Volume of a session for one exercise = sum of (weight x reps) over its sets, for weight-and-reps exercises. For reps-only exercises the metric is total reps. | The vision says "volume" but does not define it; this is the common definition for strength training. **Requires Human Validation.** |
| A-VG2 | Duration exercises are recorded and shown in history but are not graphed in the prototype. | Time-based progress needs a different metric; cutting it controls scope. |
| A-VG3 | All sets count equally; warm-up sets are not distinguished (see A-WL7). | Set types are excluded from the prototype. The effect on accuracy of volume is an **open question**. |
| A-VG4 | The per-exercise graph has one point per workout that includes that exercise; the overall graph has one point per calendar week (Monday to Sunday, by the user's local date). | Gives two useful levels of detail without a large set of options. Week definition is an assumption. |
| A-VG5 | Available time ranges: 4 weeks, 3 months, 6 months, 1 year, all time. | Covers short-term and long-term comparison; the specific ranges are a **Proposed target**. |
| A-VG6 | The overall weekly graph adds up volume of weight-and-reps exercises only. Reps-only and duration exercises are excluded because their units differ. | Prevents adding kilograms to reps. |
| A-VG7 | Graphs use the account's weight unit and stay consistent when logs are edited or deleted (HI-4, HI-5). | Trust in the data. |

### FUNCTIONAL REQUIREMENTS

**VG-1.** As **Marcus**, I want to see a graph of my total volume for one exercise over time, with one point per workout, so that I can tell whether I am lifting more than before.

- The user selects an exercise (weight-and-reps type); the graph plots session volume by workout date.
- Axes are labelled with units and dates.
- The value shown for each point equals the sum of weight x reps of the sets recorded on that date.

**VG-2.** As **Marcus**, I want to choose the time period shown, so that I can compare recent weeks with the longer trend.

- Options in A-VG5; the last selection is remembered during the session.
- Changing the period updates the graph and any summary text.

**VG-3.** As **Priya**, I want to see my total volume per week across all weight-based exercises, so that I can tell whether my overall training is increasing without choosing an exercise.

- One value per calendar week within the selected period; weeks with no workouts show zero.
- Uses the same time ranges as VG-2.
- Text under the chart states how the latest week compares with the previous week.

**VG-4.** As **Elena**, I want to see my total reps per workout for a reps-only exercise, so that I can see progress on bodyweight exercises.

- Selectable for reps-only exercises with the same period options.
- Y axis is labelled "Total reps".

**VG-5.** As **Marcus**, I want to select a point on a graph and see its date and value, and open that workout, so that I can understand why a session was unusually high or low.

- Selecting a point shows the exact date and value.
- An action opens the related workout (HI-2); for weekly points it lists that week's workouts.

**VG-6.** As **Priya**, I want a clear message when there is not enough data to draw a graph, so that I am not confused by a blank screen.

- Fewer than 2 data points shows a message stating how many workouts are needed and how to log one.

**Quality control review.** *Coverage:* per-exercise graph, overall graph, period, reps-only, drill-down, empty state. *Persona alignment:* Marcus (VG-1, VG-2, VG-5), Priya (VG-3, VG-6), Elena (VG-4). *Redundancy:* VG-1 and VG-4 share a screen, but the metric and validation differ; they are kept as separate stories because they are sized and tested differently. *Dependencies:* VG-5 depends on HI-2; all graphs depend on WL-7 and HI-4 and HI-5 for correctness. *Scope:* pie charts, muscle-group breakdowns, one-rep-max estimates and goals were not added. *Missing item checked:* a text alternative for charts is covered in the NFRs below.

### NON-FUNCTIONAL REQUIREMENTS

| ID | Category | Requirement | Type |
| --- | --- | --- | --- |
| NFR-VG1 | Performance | A graph renders within 2 seconds for an account with 1,000 workouts on a mid-range phone. | Proposed target |
| NFR-VG2 | Accuracy | Every graphed value equals the value recomputed from the logged sets for the same period, with 100% agreement on test data. | Assumption (testable) |
| NFR-VG3 | Accessibility | Information is not conveyed by color alone, and every graph has a text summary (latest value, number of points, change from first to last). | Assumption (aligned with WCAG) |
| NFR-VG4 | Usability | Graphs are legible without horizontal scrolling on screens 360 px wide. | Assumption |
| NFR-VG5 | Compatibility | Graphs are available on the same phones as the rest of the app (NFR-WL7). | Assumption |

### REQUIREMENTS SIZING

Metric: story points (scale in Section 5). Initial estimates only.

| Story ID | User Story | Size | Rationale |
| --- | --- | --: | --- |
| VG-1 | Per-exercise volume graph | 5 | First chart: aggregation, axes, unit handling, sparse data, and accuracy testing. |
| VG-2 | Choose time period | 2 | Control and filtering of the same data. |
| VG-3 | Overall weekly volume | 5 | Weekly grouping across exercises, zero weeks, comparison text; definition risk (A-VG1, A-VG6). |
| VG-4 | Reps-only total reps graph | 2 | Reuses VG-1 with a different metric. |
| VG-5 | Select point and open workout | 3 | Interaction on chart and navigation; weekly-point variant. |
| VG-6 | Not-enough-data message | 1 | Single state. |

**Total: 18 points.**

## 5.5 Repeatable Workouts 1-pager

### PROBLEM

Marcus trains a push, pull and legs split, so every Monday he adds the same six exercises to a new workout before he can log a single set. Priya follows a three-day beginner plan, and she wants to arrive at the gym, tap one thing and see Day 2's exercises in the right order instead of hunting for each one. Elena follows the same short routine most of the time and does not want to maintain a set of saved plans; she wants to repeat what she did last time.

Setting up a session by hand costs time at the start of every workout and creates a chance to skip or misname an exercise, which undermines the consistent records the rest of the product depends on. Reusing a known list of exercises removes that friction. This 1-pager covers only reusing exercise lists; it does not prescribe weights, reps or programs, which would be coaching and are out of scope.

### ASSUMPTIONS

| ID | Assumption | Why it is needed |
| --- | --- | --- |
| A-TM1 | A template is a named, ordered list of exercises with no prescribed sets, weights or reps. | Keeps this within logging; prescribing loads is program design and out of scope. |
| A-TM2 | Starting a workout from a template creates an ordinary workout containing those exercises with no sets. Previous performance comes from WL-3, not from the template. | Avoids a second source of weight and rep data. |
| A-TM3 | Templates are private to the user, and their names are unique per user (ignoring case). | Consistent with exercise naming (A-EX4). |
| A-TM4 | If an exercise in a template is later archived, it stays in the template but is marked as archived, and the user chooses to keep or skip it when starting. | Avoids silently breaking saved routines (see EX-4). |
| A-TM5 | The prototype supports at least 20 templates per user and 30 exercises per template. | Gives testable limits; **Proposed target**. |

### FUNCTIONAL REQUIREMENTS

**TM-1.** As **Marcus**, I want to save the exercises from a workout I have completed as a named template, so that I do not have to rebuild my usual sessions.

- Available from a completed workout; the user provides a name (1 to 60 characters, unique per A-TM3).
- Exercises are saved in the order they were performed; the sets themselves are not saved.

**TM-2.** As **Marcus**, I want to start a workout from a template, so that its exercises are already in the workout when I begin.

- The new workout contains the template's exercises in order and no sets.
- Archived exercises are flagged, and the user can keep or skip each one (A-TM4).
- Exercises can still be added or removed in the new workout without changing the template.

**TM-3.** As **Priya**, I want to create and edit a template by picking exercises myself, so that I can set up my plan at home before I go to the gym.

- The user can name the template, add exercises using the library search (EX-1), reorder them, and remove them.
- Editing a template does not change workouts already completed.

**TM-4.** As **Elena**, I want to repeat my most recent workout in one action, so that I can rerun my usual routine without managing templates.

- Creates a new workout with the exercises of the most recent completed workout and no sets.
- If no completed workout exists, the action is not offered.

**TM-5.** As **Marcus**, I want to delete a template without affecting my past workouts, so that I can retire routines I no longer use.

- Requires confirmation naming the template.
- Completed workouts started from that template are unchanged.

**Quality control review.** *Coverage:* create from history, create from scratch, use, repeat, delete. *Persona alignment:* Marcus (TM-1, TM-2, TM-5), Priya (TM-3), Elena (TM-4). *Redundancy:* TM-4 overlaps with TM-1 and TM-2 (both can produce the same result), but it removes the naming and saving steps Elena wants to avoid; it is marked as the first candidate to cut if scope must shrink. *Dependencies:* TM-1 needs WL-7; TM-3 needs EX-1; TM-2 and TM-4 use WL-1's workout creation. *Scope:* sharing templates, prescribed weights and program schedules were not added.

### NON-FUNCTIONAL REQUIREMENTS

| ID | Category | Requirement | Type |
| --- | --- | --- | --- |
| NFR-TM1 | Performance | Starting a workout from a template or repeating the last workout takes no more than 1 second to show the workout screen. | Proposed target |
| NFR-TM2 | Usability | Starting a workout from a template takes no more than 3 taps from the home screen. | Proposed target |
| NFR-TM3 | Data integrity | Templates are independent of workouts: editing or deleting one never changes the other. | Assumption |
| NFR-TM4 | Reliability | Templates and repeat-last-workout are available without a connection, consistent with WL-6. | Assumption |
| NFR-TM5 | Privacy | Templates are visible only to their owner. | Assumption |

### REQUIREMENTS SIZING

Metric: story points (scale in Section 5). Initial estimates only.

| Story ID | User Story | Size | Rationale |
| --- | --- | --- | --- |
| TM-1 | Save workout as template | 3 | Naming rule, ordered copy of exercises, one new data type. |
| TM-2 | Start workout from template | 3 | Uses workout creation; archived-exercise handling adds states. |
| TM-3 | Create and edit template | 5 | Several screens: name, add, reorder, remove; reuse of library search. |
| TM-4 | Repeat last workout | 2 | Reuses existing data and WL-1; one action. |
| TM-5 | Delete template | 2 | Confirmation and removal; independence from past workouts. |

**Total: 15 points.**

**Grand total across all five 1-pagers: 97 points** (35 + 11 + 18 + 18 + 15). This is an initial relative size, not a schedule.

## 6. Requirement Traceability Matrix

| Product Vision Need | Persona | Problem / Scenario | 1-Pager | Functional Requirement IDs |
| --- | --- | --- | --- | --- |
| N1: Log sets quickly during a workout on a phone | Marcus, Priya | Marcus loses rest time typing notes between sets; Priya is unsure and distracted. | 5.1 Workout Session Logging | WL-1, WL-2, WL-4, WL-7 |
| N2: See previous performance when choosing weights | Priya, Marcus | Priya guesses weights; Marcus scrolls old notes at the rack. | 5.1 Workout Session Logging; 5.3 Workout History & Review | WL-3, HI-2, HI-3 |
| N3: Keep exercise records consistent and comparable | Marcus, Elena, Priya | "bench" vs "Bench Press"; unusual home exercises; unfamiliar names. | 5.2 Exercise Library | EX-1, EX-2, EX-3, EX-4, WL-4 |
| N4: Review past workouts | Priya, Marcus | Checking consistency; recalling last month's leg day. | 5.3 Workout History & Review | HI-1, HI-2, HI-3, HI-6 |
| N5: See training volume over time | Marcus, Priya, Elena | Manual spreadsheet charting; overall progress; bodyweight progress. | 5.4 Volume Progress Graphs | VG-1, VG-2, VG-3, VG-4, VG-5, VG-6 |
| N6: Repeat regular routines without rebuilding them | Marcus, Priya, Elena | Re-adding six exercises each session; following a fixed plan; rerunning a routine. | 5.5 Repeatable Workouts | TM-1, TM-2, TM-3, TM-4, TM-5 |
| N7: Never lose logged data, including with no signal | Elena, Marcus | Session lost once; basement gym with patchy signal; interrupted phone. | 5.1 Workout Session Logging | WL-6, WL-8, WL-9 |
| N8: Fix mistakes in recorded data | Elena, Marcus | Typo of 300 kg instead of 30 kg; mis-tapped set. | 5.1, 5.2, 5.3 | WL-5, HI-4, HI-5, EX-4 |
| N9: Use the units the user trains in | Priya, Marcus | Priya uses kg; Marcus uses lb. | 5.1 Workout Session Logging | WL-10 |

**Gap check.** Every need N1 to N9 leads to at least one story, and every story is listed in at least one row: WL-1 to WL-10, EX-1 to EX-4, HI-1 to HI-6, VG-1 to VG-6, TM-1 to TM-5 (31 stories). **Gaps and thin spots:** N7 relies on one 8-point story (WL-6) and the offline assumption; sign-in has no story by design; no story covers exporting data, which no persona asked for.

## 7. Project Manager Quality Audit

This is a self-review by the same model that wrote the document, so it is biased toward its own work; treat it as a checklist for your own review, not as independent verification.

| Area | Finding | Correction or status |
| --- | --- | --- |
| Product vision | Initial version was unmeasurable and too broad (Section 1). | Rewrote; added exclusions and nine numbered needs. The differentiating claim remains an assumption. |
| Personas | Three personas with distinct goals, contexts and pain points. Not based on research. | Kept three; each drives at least one unique group of stories. Flagged for human validation. |
| Scenarios / problems | Early drafts of the problem statements began with the feature. | Rewrote each to start from a persona's situation, with a concrete moment (rest between sets, typo in a past workout). |
| Assumptions | Hidden assumptions found: kg/lb, exercise types, definition of volume, offline use, sign-in, warm-up sets. | Each is now a numbered assumption with a reason. WL-10 (units) was added because units had no story. |
| Functional requirements | Several stories described screens instead of user goals; some lacked limits. | Rewrote as goal-based stories; added validation ranges and edge cases. Stories remain at a level developers can ask questions about, not a UI specification. |
| Testability | "Quickly" and "easily" appeared in early drafts. | Replaced with tap counts, response times and explicit rules; all numbers are labelled **Proposed target**. |
| Non-functional requirements | Only relevant categories included per 1-pager; no scalability or availability targets. | Deliberate: a single-user prototype does not justify them. Reconsider if the product grows. |
| Sizing | One metric (story points) used everywhere, with a shared scale and a rationale per story. | Highest uncertainty is WL-6 (8). No story is 13. Sizes were assigned relative to each other by one author and have not been calibrated with a team. |
| Consistency | Terminology fixed in Section 5 (workout, exercise, workout entry, set, volume, template). Every story names a persona and appears in the matrix. | One overlap kept on purpose: TM-4 vs TM-1 and TM-2, flagged as first to cut. |
| Scope | Nutrition, social, coaching, wearables, payments, exercise instructions, notes, calendars and goal setting all excluded. | Recorded in the vision and in assumptions where they arose. |

**Remaining weaknesses (not fixable without your input).** (1) Conflict handling for the same account on two devices is undefined. (2) The volume definition ignores warm-up sets. (3) Story sizes assume a team that has not been chosen. (4) Persona details are invented for illustration. (5) No prioritization (MVP cut line) is given; a natural cut line would be WL-1 to WL-3, WL-5, WL-7, EX-1, EX-2, HI-1, HI-2, VG-1, VG-2, but that is my suggestion, not a requirement.

**Final quality questions.** *Could a development team begin the next phase from this?* Yes for the concepts and data terms; some rules (units, sync conflicts, sign-in) need decisions first. *Are stories traceable to problems and personas?* Yes (Sections 4 and 6). *Does it show the AI as an assistant rather than a source to copy blindly?* It documents critique, assumptions and validation points, but the strongest evidence would be your own review notes in the last section.

## 8. Open Questions / Items Requiring Human Validation

**Requires Human Validation:**

1. **Course requirements.** Check that this structure (vision, personas, 1-pagers with the exact template, sizing, traceability) matches your professor's rubric, and that the number of personas and 1-pagers is acceptable. I have not seen the rubric.
2. **Sommerville Chapter 3.** Compare the persona and scenario style with the book. I did not have its text and made no quotations or page citations.
3. **Personas.** All details are invented. Decide whether to keep, rename, or replace them, and note in your write-up that they are not from real users.
4. **Differentiator.** "Narrow focus on fast entry and review" is an assumption; no competitor analysis was done.
5. **Volume definition (A-VG1, A-VG3, A-VG6).** Confirm that weight x reps, ignoring warm-ups, is acceptable.
6. **Offline logging (A-WL6, WL-6).** Confirm you want this in the prototype scope; it is the largest story (8 points).
7. **Sign-in and accounts (A-WL4).** Decide whether the prototype needs accounts or only local storage on one device; this changes WL-6 and NFR-WL6.
8. **Unit handling (A-WL3).** Confirm one unit for the whole account.
9. **Permanent deletion (A-HI4).** Confirm there is no recycle bin.
10. **Numeric targets.** Every number labelled *Proposed target* (taps, milliseconds, 1,000 workouts, 50 exercises, 12 hours, 5-second undo) is my choice and needs your validation.
11. **Story sizes.** Adjust to your team's experience; consider a planning-poker session with your teammates.
12. **Second device conflict rule.** What should happen if the same account edits a workout on two devices while offline?
13. **MVP cut line.** Decide what is essential for the prototype.
14. **Comparison with the other model.** Nothing here is based on another model's output. Add your comparison yourself once you have your teammate's version.

## Student Evaluation of Claude's Output

*Reserved for your own answers. Claude has intentionally left every prompt blank.*

1. What did Claude do well?
2. What requirements or personas were particularly useful?
3. What did Claude misunderstand?
4. Which assumptions should be changed?
5. Which requirements need clarification?
6. Were the personas sufficiently specific?
7. Were the scenarios appropriate?
8. Was the sizing rationale reasonable?
9. What would I change before submitting?
10. Overall evaluation of Claude's contribution:
