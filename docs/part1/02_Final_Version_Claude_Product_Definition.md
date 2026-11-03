# Fitness & Workout Log App — Claude Final Version

Sep 28, 2026 · @Diego Bonilla

This is the revised second iteration of the Claude-generated definition for the Fitness & Workout Log App only. Its main changes: personas and scenarios reworked against Sommerville's Chapter 3, features pruned using its feature-creep questions (28 stories, down from 31), arbitrary numeric targets removed, and sizing recalibrated.

## 1. Product Vision

**Basis and limits.** The Chapter 3 text you provided is used as the conceptual reference; it is paraphrased, never quoted. Where I go beyond it, the item is labelled an assumption. No user research was done and no real users were consulted.

### 1.1 Initial Vision

The Fitness & Workout Log App is a mobile app that helps people who train regularly to log their workouts, track exercises and sets, and view their progress over time through graphs. It makes fitness tracking easy and motivating, so users can stay consistent, see improvement and reach their goals. Unlike other apps, it is simple, fast and works for everyone from beginners to advanced athletes.

### 1.2 Critique of Initial Vision

| # | Weakness | Consequence for requirements |
| --- | --- | --- |
| 1 | "Easy", "motivating", "simple, fast" cannot be tested. | Non-functional requirements cannot be derived from adjectives. |
| 2 | "Everyone from beginners to advanced athletes" hides real differences between users. | Personas need distinct needs; a target of "everyone" gives no design guidance. |
| 3 | The problem is never stated: why do paper, notes apps and spreadsheets fall short? | A scenario needs a problem that existing tools do not handle well. |
| 4 | "Reach their goals" implies goal setting, which is outside the concept of log, track and view. | Invites feature creep (goals, plans, coaching). |
| 5 | "Unlike other apps" is unsupported; no comparison was made. | An unverified claim (**Requires Human Validation**). |
| 6 | The context of use is missing: logging happens between sets, on a phone, sometimes without signal. | This context drives the usability, reliability and data-integrity requirements. |
| 7 | No statement of what the product will not do. | Users and developers may assume nutrition, social or coaching features. |

### 1.3 Refined Product Vision

The vision follows the FOR / WHO / THE / THAT / UNLIKE form that the chapter uses for its own example vision. "UNLIKE" names general categories of tools only; no specific competitors were analysed.

**FOR** people who do strength or bodyweight training on a regular schedule, **WHO** currently record sessions on paper, in a notes app or in a spreadsheet, **THE** Fitness & Workout Log App **is** a mobile-first workout log **THAT** lets them record each exercise and set between sets, see what they did last time while they train, and review how their training volume changes over time. **UNLIKE** general-purpose notes and spreadsheets, which leave exercise names, layouts and calculations to the user, **OUR** product keeps consistent exercise records and turns them into per-exercise and overall volume graphs without extra work.

**The problem.** Recording a workout mid-session with general-purpose tools is slow and error-prone: names are typed inconsistently, last session's numbers are hard to find when they are needed, and turning old entries into a picture of progress takes manual effort that most people never spend. As a result, people guess their next weights and cannot tell whether they are improving.

**Why it matters.** Visible progress and reliable records are what keep regular exercisers consistent; losing or distrusting the record removes the reason to log.

**Scope.** Logging workouts, exercises and sets; an exercise library with user-defined exercises; workout history with correction; volume graphs; reusable workout lists; kg or lb units.

**Out of scope (deliberate).** Nutrition, social features, coaching or trainer marketplaces, medical or injury advice, generated training plans, wearable integration, payments, goal setting, rest timers, set types such as warm-up, and exercise instructions or videos.

**Vision needs.** These are used for traceability in Section 6.

| ID | Need |
| --- | --- |
| N1 | Record sets quickly on a phone during a workout. |
| N2 | See previous performance when choosing today's weights. |
| N3 | Keep exercise records consistent and comparable over time. |
| N4 | Review past workouts. |
| N5 | See training volume over time. |
| N6 | Start familiar workouts without rebuilding them. |
| N7 | Keep every logged set safe, including without a connection. |
| N8 | Correct mistakes in recorded data. |
| N9 | Enter and view weights in the unit the user trains in. |

**Editorial changes from the first draft.** The differentiating claim was rewritten as a contrast with general tool categories rather than a market claim; "Explicitly not intended" was folded into the scope list; rest timers and set types were added to the exclusions so they cannot creep in through assumptions.

## 2. AI Interaction / Development Log

**Honesty note.** Iteration 1 was the first response to your original prompt; Iteration 2 is this response to your second prompt, which supplied Chapter 3 and asked for a formal review. Within each iteration the drafting and self-review happened inside a single response. No other model's output was used.

| Iteration | Purpose | Problems Identified | Changes Made | Expected Improvement |
| --- | --- | --- | --- | --- |
| 1. Initial Claude output | Produce vision, personas, five 1-pagers, sizing, traceability and audit from your first prompt. Written without the Chapter 3 text. | (Found later, in Iteration 2.) See below. | A complete first draft: 3 personas, 5 1-pagers, 31 stories (97 points). | A working baseline to review. |
| 2. Review and refinement | Formal review of Iteration 1 against your rubric and the Chapter 3 text; produce the polished version. | Personas framed around "goals" and "motivations" without the persona aspects the chapter names; scenarios did not include what existing tools cannot handle; feature creep (TM-4, EX-3, VG-6); arbitrary numeric targets; inconsistent sizing (VG-1 and VG-3 both 5 despite reuse); story IDs by prefix rather than sequential; some problem statements hinted at solutions. | Rewrote personas as proto-personas; rewrote all five problem statements as narrative scenarios; pruned to 28 stories; removed or labelled numeric targets and consolidated NFRs; re-sized stories on one scale; renumbered FW-01 to FW-28 and NFR-01 to NFR-13; rebuilt traceability. | Closer alignment with the rubric (personas, scenarios, coverage, sizing) and with the chapter's guidance on personas, scenarios, stories and feature creep. |

### Iteration 1: Initial Claude output

**What was provided:** the original prompt with the product idea, assignment context, required structure, and scope limits. **Result:** a complete draft with a vision refined once, three personas (Marcus, Priya, Elena), five 1-pagers, 31 stories totalling 97 story points, and a self-audit. The Chapter 3 text was not available, so the draft leaned on general requirements-engineering knowledge.

### Iteration 2: Review, critique, refinement

**What was reviewed.** The full first draft, the Chapter 3 text you pasted, and your second prompt's checklist.

**Weaknesses found, with their Chapter 3 basis.**

1. **Personas.** The chapter says a persona should paint a picture of a type of user, covering personal circumstances, job, education and technical skill, and why the person might want the product. It also argues that "goals" are hard to pin down and that it is more useful to explain why the software might help and give examples of what the person would do. The draft had separate Goals and Motivations headings and no technical-skill statement. The chapter also says personas built with little user information are proto-personas; the draft did not say so. **Fix:** added education and technical skill to each Background, expressed goals as what the person wants to do with the product, labelled all three as proto-personas, and kept your requested headings.
2. **Scenarios.** The chapter describes a scenario as a narrative with an objective, the persona, what is involved, problems existing tools cannot readily address, and optionally one way the problem might be tackled; it says rationale disrupts the flow and belongs in stories. Draft problem statements were good on situation but weak on what existing tools cannot do, and two drifted into solutions. **Fix:** rewrote each problem as a short narrative that names the persona, the objective, what is involved, and what today's tools fail to handle, without prescribing a design.
3. **Feature creep.** The chapter's four questions ask whether a feature adds anything new, whether it can extend an existing feature, whether most users need it, and whether it is general or very specific. **Fix:** removed the "repeat last workout" story (an alternative route to what template start already provides); merged "recently used exercises" into the search story; converted the "not enough data" story into a detail of the graph stories.
4. **Stories.** Each story keeps the "so that" clause your assignment requires, although the chapter treats rationale as optional. Some details described screens rather than behavior. **Fix:** tightened details; removed the 12-hour resume rule, the 5-second undo, and template and exercise count limits, which were not supported by any persona need.
5. **Non-functional requirements.** Several numbers (300 ms, 500 ms, 2 s, 50 exercises) were arbitrary. **Fix:** consolidated into 13 non-functional requirements, each labelled as derived from a need, an assumption, or a proposed target requiring validation; only numbers with a stated reason remain.
6. **Sizing.** VG-3 (overall weekly graph) received 5 points like VG-1 although it reuses the chart built in VG-1; total also changed after pruning. **Fix:** re-sized on one scale, added the explicit rule that size measures effort and not value, and noted dependencies that affect estimates.
7. **Traceability and consistency.** Traceability referred to removed stories and to Elena's "repeat last workout" need. **Fix:** Elena's scenario now uses a saved template; all tables were rebuilt from the final story list.
8. **Known limitation.** The chapter suggests roughly three or four scenarios per persona. This document gives one representative scenario per persona plus one problem scenario per 1-pager (eight scenarios in total). That follows your assignment but is below the chapter's suggestion; more scenarios would be a good next step.

**How the changes help.** The persona, scenario and story sections now follow the chapter's definitions, the scope is tighter, and the numbers that remain can be defended or are marked for validation.

## 3. Personas

**Status: proto-personas.** These are imagined users written from general knowledge of how people train, not from interviews or surveys. In the chapter's terms they are proto-personas: better than none, but less reliable than personas built from user studies (**Requires Human Validation**). Three are used because the vision has three distinct usage situations; the chapter advises no more than five and warns that many overlapping personas make a coherent design harder. Goals are written as what the person wants to do with the product, following the chapter's advice, and every persona states education and technical skill.

### Persona 1: Marcus Reyes

**Persona type:** Primary user; experienced lifter.

**Background:** Age 29, software tester who trains at a commercial gym five days a week and has lifted for six years. Holds a bachelor's degree, is comfortable with apps and spreadsheets, and follows a push, pull and legs split.

**Goals:** Add weight or reps to his main lifts every few weeks and check whether his training volume on a lift is really rising.

**Motivations:** Progress he can verify keeps him consistent; unnoticed stalls frustrate him. The product would be useful because it removes the manual spreadsheet work he now does.

**Behaviors:** Logs each set in a notes app during rest periods of roughly one to three minutes. Retypes the same six exercises at the start of each session. Occasionally copies numbers into a spreadsheet to draw a chart.

**Pain points:** Exercise names drift ("bench", "Bench Press", "BB bench"), so history does not line up. He scrolls through old notes at the rack to find last week's numbers. Mobile signal in the gym basement is patchy.

**Needs:** Fast entry of sets with previous values in view, consistent exercise names, a reusable list of exercises for each training day, and volume graphs per exercise.

**Usage context:** Own phone, one hand, sometimes chalky hands, between sets.

**Product expectations:** Logging must not use up his rest time, and the history must be reliable enough to plan training from.

**Representative scenario:** *Leg day.* Marcus wants to log today's leg session without losing rest time and to see whether his squat volume is rising. At the gym he starts his saved "Legs" list, so squat, leg press and calf raise are already in the workout. At the rack the app shows last week's squat sets, so he knows to aim for 102.5 kg. After each set he adjusts only the reps because the weight is already filled in. In his notes app this would mean retyping the exercises, scrolling for last week's numbers, and later rebuilding the picture by hand. After the session he finishes the workout and opens the squat graph for the last three months.

### Persona 2: Priya Nair

**Persona type:** Primary user; beginner.

**Background:** Age 24, graduate student who started using the university gym three months ago after a long break. Has no training qualifications, uses her phone confidently for everyday tasks but not for data tools, and follows a three-day beginner plan found online. Uses kilograms.

**Goals:** Keep a regular habit, learn the exercises in her plan, and choose weights she can increase gradually.

**Motivations:** Wants evidence that the effort is paying off so she does not quit. The product would help by showing what she did last time and how her overall training changes.

**Behaviors:** Photographs the plan sheet and relies on memory for weights. Often forgets what she lifted and picks light weights to be safe.

**Pain points:** Unfamiliar exercise names, cluttered or technical apps that intimidate her, and doubt about whether she is doing "enough".

**Needs:** Simple flow with little jargon, exercise search, previous performance while logging, a summary after each workout, and a progress view that needs no fitness knowledge to read.

**Usage context:** Phone only, reliable campus Wi-Fi, quick glances between sets while distracted.

**Product expectations:** Approachable, forgiving of mistakes, and useful from the first session with no setup.

**Representative scenario:** *Day 2 workout.* Priya wants to log her plan's Day 2 session and to pick the right weight for each exercise. She starts a workout and searches "row" to find the exact exercise name in the library. The app shows "last time: 30 kg for 10, 10 and 8 reps", so she tries 32.5 kg instead of guessing. She logs three sets, finishes, and sees how many sets and how much total volume she completed. On her paper plan she had no way to compare with last week. Later in the week she opens the weekly volume graph to check whether she is doing more than last month.

### Persona 3: Elena Okafor

**Persona type:** Secondary user; home trainer with constraints.

**Background:** Age 36, nurse on rotating shifts. Has a nursing degree and moderate technical skill. Trains at home in a basement with dumbbells, a bench and her bodyweight, three or four times a week at irregular hours.

**Goals:** Keep her routine going despite shifts and record push-ups, planks and dumbbell work as reliably as a gym-goer would.

**Motivations:** Health and stress relief; consistency matters more to her than heavy loads. The product would help because it accepts exercises that most apps ignore and does not lose her data.

**Behaviors:** Repeats the same short routine most sessions, adds an occasional new exercise, and sometimes logs after the workout because her hands are busy.

**Pain points:** Apps that assume every set has a weight, no way to add her own exercises, no signal in the basement, and one lost session when an app failed to save.

**Needs:** Custom exercises that can be weight-based, reps-only or timed; logging without a connection; logging a session afterwards; saving her routine once and starting it again; correcting entries.

**Usage context:** Phone on a shelf or on the floor, no reliable signal, one hand between sets.

**Product expectations:** Nothing she records is lost, and she is never asked for information that does not apply to her exercise.

**Representative scenario:** *Home routine after a night shift.* Elena wants to record her usual routine without signal and without losing anything. In the basement she starts her saved "Home routine" list. She logs push-ups as reps only and a plank in seconds, and adds a new exercise, "Farmer carry", as a timed exercise. She finishes the workout; it is stored on her phone and appears in her history. Later, upstairs on Wi-Fi, the workout is uploaded without her doing anything. Other apps she tried required a weight for every set and failed when the signal dropped.

### Persona Consistency Check

| Question | Result |
| --- | --- |
| Genuine user types? | Yes, as plausible types. Not validated with real users. |
| Distinct goals and behaviors? | Yes. Marcus logs heavy lifts fast and analyzes; Priya needs discovery and reassurance; Elena needs exercise variety, offline and reliability. |
| Detailed enough to generate requirements? | Yes. Each persona is the sole or lead actor for at least four stories (see Section 4). |
| Redundant? | No. Removing any persona removes a distinct set of stories. |
| Missing types? | A coach or trainer was considered and rejected: coaching is out of scope. A user recovering from injury is excluded because medical guidance is out of scope. |
| Connected to the vision? | Each maps to needs N1 to N9 (Section 6). |
| Change from first draft | Elena no longer uses "repeat last workout" (a removed story); she saves her routine once and starts it as a saved list. Education and technical skill were added to each background. |

## 4. Persona-to-Requirement Traceability

| Persona | Main Problem | Main Goal | Relevant Product Capabilities |
| --- | --- | --- | --- |
| Marcus Reyes | Note-taking between sets is slow and inconsistent, so he loses rest time and cannot compare sessions or see trends without spreadsheet work. | Verify that his training volume on main lifts is rising. | Fast set entry with prefilled values (FW-02); starting a saved list (FW-26); correction during a workout (FW-05); exercise rename and archive (FW-13); past workout and per-exercise history (FW-15, FW-16); per-exercise volume graph, period choice and drill-down (FW-20, FW-21, FW-24); template deletion (FW-28). |
| Priya Nair | She forgets what she lifted and does not know exercise names, so she guesses weights and doubts her progress. | Keep a habit and increase weights gradually. | Exercise search (FW-11); previous performance while logging (FW-04); workout summary and resuming an interrupted workout (FW-06, FW-07); kg or lb (FW-10); history list and filter (FW-14, FW-19); overall weekly volume graph (FW-22); building a saved list at home (FW-27). |
| Elena Okafor | Apps assume weights, lack custom exercises and lose data without signal. | Keep a home routine going without losing data. | Set form matching exercise type (FW-03); logging after the fact (FW-08); offline logging (FW-09); custom exercises (FW-12); editing and deleting completed workouts (FW-17, FW-18); reps-only graph (FW-23); saving a routine once (FW-25). |

## 5. 1-Pagers / Epics

**Why five 1-pagers.** Each covers a problem that can be understood on its own and draws on a different combination of personas: (1) recording a workout, (2) choosing and maintaining exercises, (3) finding and correcting past workouts, (4) seeing volume over time, and (5) starting familiar workouts. In the chapter's terms each 1-pager is an epic that is broken into stories. Merging any two would mix unrelated problems; splitting further would separate stories that share one problem. Sign-in is not a 1-pager: it is not part of the vision's core value and is handled as an assumption.

**Features and stories.** Following the chapter, stories were derived from the scenarios, then checked for missing needs (for example editing and deleting) and for the chapter's four feature-creep questions: does it add something new, could it extend an existing feature, would most users use it, is it general or very specific.

**Terminology used throughout.** *Workout* is one training session on one date. *Exercise* is a named movement in the library. *Workout entry* is an exercise performed within a workout. *Set* is one recorded bout inside a workout entry. *Volume* is the sum of weight times reps over the sets of a weight-and-reps exercise. *Template* is a named, saved list of exercises used to start workouts.

**Sizing metric (one metric for all 1-pagers).** Story points on a modified Fibonacci scale. A size expresses relative implementation effort, considering complexity, screens and states, data handling, validation, dependencies, uncertainty and edge cases. It does not express importance or user value. All sizes are **initial estimates** and may change after further requirements analysis. When two stories have similar effort, they carry similar sizes; where they differ, the rationale says why.

| Points | Meaning |
| --: | --- |
| 1 | Trivial: one state, no new data, no meaningful edge cases. |
| 2 | Very small: one control or screen, simple validation, reuses existing behavior. |
| 3 | Small: a few states, standard validation, depends on existing data. |
| 5 | Moderate: several screens or states, notable rules, or new data handling. |
| 8 | Complex: cross-cutting behavior, synchronization, or high uncertainty. |

**Labels on non-functional requirements.** **\[Derived\]** follows directly from a vision need or persona. **\[Assumption\]** is a reasonable choice not confirmed by anyone. **\[Proposed target\]** is a number I chose and it requires validation. No numeric value came from the assignment or the book. Non-functional requirements that apply to several 1-pagers are stated once and referenced later, so nothing is duplicated.

## 5.1 Workout Logging 1-pager

### PROBLEM

Marcus wants to record a workout while it happens, so that his history reflects what he really lifted. At the squat rack he has roughly ninety seconds between sets. In his notes app he has to type the exercise name again, format the numbers himself and scroll back to find last week's weights; by the time he finishes he is late for the next set, so he often writes nothing and reconstructs the session from memory afterwards, with gaps and errors. Priya has the same objective but a different difficulty: she does not remember what she lifted last time and picks light weights to be safe. Elena wants the same reliable record from her basement, where there is no signal; other apps she tried asked for a weight on every set, including push-ups, and one lost a whole session when it failed to save.

Notes apps and paper handle none of this: they do not know what a set is, do not show earlier sessions at the moment they matter, and give no protection when the phone locks, the app closes or the connection drops. The stakes are high because the log is the raw material for every other feature of the product; if recording is too slow or too fragile, people stop recording, and the history that would show their progress never exists.

### ASSUMPTIONS

| ID | Assumption | Why it is needed |
| --- | --- | --- |
| A-LOG-1 | A workout has a date and time and contains an ordered list of workout entries, each with an ordered list of sets. | Defines the terms every later story relies on. |
| A-LOG-2 | Each exercise has one of three types: weight and reps, reps only, or duration in seconds. | Elena's push-ups and planks cannot be recorded with a weight field; the type belongs to the exercise, not to each set. |
| A-LOG-3 | One weight unit (kg or lb) applies to the whole account. | Marcus and Priya use different units; a per-set unit would complicate history and graphs. |
| A-LOG-4 | Data belongs to one user; how the user signs in is outside these 1-pagers. | Data must persist and be private, but sign-in is not part of the vision's core value. **Requires Human Validation.** |
| A-LOG-5 | A workout may be dated today or any earlier day, but not a future day. | Elena logs some sessions afterwards; future dates would corrupt history. |
| A-LOG-6 | The product must work without a connection, with data uploaded later. | Elena's and Marcus's normal environment. This raises cost sharply. **Requires Human Validation.** |
| A-LOG-7 | At most one workout is in progress at a time. | Simplifies resuming and finishing; matches how people train. |

### FUNCTIONAL REQUIREMENTS

**FW-01.** As **Marcus**, I want to start a new workout and add exercises to it as I go, so that I can log in the order I actually train.

- Starting a workout sets its date and time to now.
- Exercises are chosen from the exercise library (FW-11) and appear in the order added; the same exercise may be added more than once.
- A workout with no sets cannot be finished; the user may discard an in-progress workout after confirming.

**FW-02.** As **Marcus**, I want to record a set by entering weight and reps, with values prefilled from my previous set, so that I can log between sets without losing rest time.

- A new set is prefilled with the values of the previous set in the same workout entry; the first set of an entry is prefilled from the most recent recorded set of that exercise, if any.
- Entry uses a numeric keypad. Proposed limits: weight from 0 to 999.9 with at most one decimal place, reps a whole number from 1 to 999. Invalid input shows a message and nothing is saved.
- The confirmed set appears in the workout immediately, numbered in order.

**FW-03.** As **Elena**, I want the set form to ask only for information that applies to the exercise, so that I am not forced to enter a weight for push-ups or planks.

- Weight-and-reps exercises ask for weight and reps; reps-only exercises ask for reps; duration exercises ask for seconds (a whole number of at least 1).
- The form is determined by the exercise's type (FW-12), and previous performance (FW-04) is shown in the same fields.

**FW-04.** As **Priya**, I want to see what I did the last time I performed an exercise while I am logging it, so that I can choose today's weight instead of guessing.

- Shows the date and all sets from the most recent completed workout that includes the exercise; if none exists, shows "No previous record".
- Reflects later edits and deletions of past workouts (FW-17, FW-18).

**FW-05.** As **Marcus**, I want to correct or remove a set, or remove a workout entry, during a workout, so that one mistaken tap does not corrupt my history.

- Selecting a set allows its values to be changed under the same validation as FW-02.
- Deleting a set or entry asks for confirmation and can be undone immediately afterward; set numbers update.

**FW-06.** As **Priya**, I want to finish a workout and see a short summary, so that I know it is saved and can see what I accomplished.

- Summary shows date, duration, number of exercises, number of sets, and total volume of weight-and-reps exercises.
- Entries without sets are dropped on finishing, and the user is told.
- A finished workout appears in history (FW-14) and in previous performance (FW-04).

**FW-07.** As **Priya**, I want my unfinished workout to still be there if I switch apps or my phone locks, so that an interruption does not cost me the session.

- Sets entered so far are kept when the app is closed, sent to the background, or the phone restarts.
- When the app is reopened with an unfinished workout, it offers to resume or discard it.

**FW-08.** As **Elena**, I want to record a workout I already did by choosing an earlier date, so that I can catch up when I could not use my phone during the session.

- The date cannot be in the future (A-LOG-5); the workout appears in history and graphs on the chosen date.
- Duration is not recorded for such workouts, so the summary omits it.

**FW-09.** As **Elena**, I want to log a workout when I have no connection and have it uploaded later, so that I never lose a session because of my signal.

- Logging, the exercise library, previous performance and saved templates work without a connection.
- The user can see whether a workout is waiting to upload or already uploaded; upload happens automatically once a connection returns.
- The rule for the same account edited on two devices while offline is not defined (see Section 8).

**FW-10.** As **Priya**, I want to choose whether weights are in kg or lb, so that entries match the plates and machines I use.

- Chosen at first use and changeable in settings.
- Changing the unit converts displayed weights, including past workouts (NFR-08).

**Quality review.** *Coverage:* start, record, adapt to type, recall, correct, finish, interrupt, after the fact, offline, units. *Personas:* Marcus FW-01, FW-02, FW-05; Priya FW-04, FW-06, FW-07, FW-10; Elena FW-03, FW-08, FW-09. *Redundancy check:* FW-08 and FW-01 both create workouts, but backdating serves a distinct need (Elena logs after the fact) and follows a different rule (no duration). *Dependencies:* FW-01 needs FW-11; FW-04 needs FW-06; FW-03 needs FW-12; FW-09 constrains how FW-02 and FW-07 store data.

### NON-FUNCTIONAL REQUIREMENTS

| ID | Category | Requirement | Label |
| --- | --- | --- | --- |
| NFR-01 | Data integrity | Every confirmed set is retained after the app closes, the phone locks or restarts, or the connection is lost; no confirmed set is lost in testing. | Derived (N7; Elena's lost session) |
| NFR-02 | Usability | Recording a set with the prefilled values takes no more than 3 taps. Chosen because rest periods are short; to be checked in usability testing. | Proposed target |
| NFR-03 | Usability, accessibility | Logging controls have touch targets of at least 44 x 44 points, and text has a contrast ratio of at least 4.5:1, for one-handed use in bright light. | Assumption (common platform and WCAG AA guidance) |
| NFR-04 | Performance | Common interactions (confirming a set, searching, opening a screen) respond visibly within 1 second; the first history screen or a graph appears within 3 seconds for an account with about 1,000 workouts (roughly three years at five per week) on a mid-range phone. Applies to all 1-pagers. | Proposed target |
| NFR-05 | Reliability | Data recorded without a connection is uploaded automatically when a connection returns, without loss or duplication. No time limit is set. | Assumption |
| NFR-06 | Privacy | A user's workouts, custom exercises and templates can be viewed and changed only by that user. Applies to all 1-pagers. | Assumption |
| NFR-07 | Compatibility | Usable on current iOS and Android phones with a screen width of at least 360 px; the platform choice is not decided. | Assumption (**Requires Human Validation**) |
| NFR-08 | Data integrity | Changing the unit affects display only; switching between kg and lb repeatedly returns the originally entered numbers. | Derived (N9) |

### REQUIREMENTS SIZING

Metric: story points (scale in Section 5), initial estimates only. Size reflects effort, not importance.

| Story ID | User Story | Size | Rationale |
| --- | --- | --: | --- |
| FW-01 | Start a workout and add exercises | 3 | A few states (start, add, discard); depends on the library picker (FW-11). |
| FW-02 | Record a set with prefilled values | 5 | Central interaction: prefill rules, numeric validation, immediate display, and the 3-tap target require careful design. |
| FW-03 | Set form matches exercise type | 3 | Three form variants with separate validation; reuses FW-02's set flow. |
| FW-04 | See previous performance | 3 | Lookup of the latest workout with the exercise, empty state, and consistency with edits. |
| FW-05 | Correct or remove a set or entry | 3 | Edit and delete states, confirmation, undo, renumbering. |
| FW-06 | Finish a workout and see a summary | 3 | Summary calculations, empty-entry handling, workout becomes history. |
| FW-07 | Resume an unfinished workout | 3 | Persistence across app lifecycle and a resume-or-discard prompt. |
| FW-08 | Record a workout on an earlier date | 2 | Date selection with a limit; reuses the logging flow. |
| FW-09 | Log without a connection and upload later | 8 | Local storage, automatic upload, duplicate avoidance, status display, and undefined conflict rule; the highest uncertainty in the product. |
| FW-10 | Choose kg or lb | 2 | One setting; display conversion and rounding edge cases. |

**Total: 35 points.**

## 5.2 Exercise Library 1-pager

### PROBLEM

Marcus wants to compare his bench press across months. His notes contain "bench", "Bench Press" and "BB bench" for the same lift, so when he tries to line the entries up he first has to clean them by hand, and he usually gives up. Priya is standing at a cable machine with a plan sheet that says "seated row"; she does not know whether that is the same as the "cable row" she saw online, and she does not know what to type. Elena trains with movements such as farmer carries that general exercise lists do not contain, and she has abandoned apps that would not let her add them.

Notes apps treat an exercise as free text, so nothing stops the same lift from appearing under many names, and nothing helps a beginner find the right name. This matters because history, previous performance and graphs are only as trustworthy as the exercise names beneath them: if one lift is scattered across five spellings, every comparison of it is wrong or impossible.

### ASSUMPTIONS

| ID | Assumption | Why it is needed |
| --- | --- | --- |
| A-EX-1 | The product includes a predefined library of common gym and home exercises. The exact list is a content decision. | Priya should not have to invent names; the size of the list is not specified by the vision. |
| A-EX-2 | Each exercise has a name, a type (A-LOG-2) and one muscle group used only for filtering. | Type drives the set form (FW-03); the muscle group helps a beginner locate an exercise. Muscle-group analysis is out of scope. |
| A-EX-3 | Predefined exercises cannot be edited or removed; custom exercises belong to the user who created them. | Keeps shared names stable and private additions private (NFR-06). |
| A-EX-4 | Exercise names are unique per user, ignoring upper or lower case and surrounding spaces, across predefined and custom exercises. | Prevents the duplicate-name problem this 1-pager addresses. |

### FUNCTIONAL REQUIREMENTS

**FW-11.** As **Priya**, I want to find an exercise by typing part of its name or filtering by muscle group, and to see my recently used exercises first, so that I can add the right exercise to a workout without knowing its exact name.

- Search ignores upper or lower case and matches anywhere in the name; results update as the user types.
- The muscle-group filter can be combined with search; a clear control resets both.
- With no search text, recently used exercises are listed first (proposed: the 10 most recent), followed by the full library. A new user sees only the library.
- With no matches, a message offers to create a custom exercise (FW-12).

**FW-12.** As **Elena**, I want to create my own exercise with a name and a type, so that I can log home and unusual movements the library does not include.

- The name is required, 1 to 60 characters (proposed), and unique under A-EX-4; if it duplicates an existing exercise, the existing one is shown instead of creating a copy.
- The type (weight and reps, reps only, or duration) is chosen at creation and cannot be changed once a set has been logged with the exercise.
- A new exercise can be added to the current workout immediately.

**FW-13.** As **Marcus**, I want to rename or archive a custom exercise, so that I can tidy my library without losing my history.

- Renaming applies everywhere the exercise appears, including past workouts and graphs, and must still be unique.
- Archiving hides the exercise from search and selection but keeps all recorded sets and graphs; an archived exercise can be restored.
- An exercise that has recorded sets cannot be permanently deleted.

**Quality review.** *Coverage:* find, create, maintain. *Personas:* Priya FW-11, Elena FW-12, Marcus FW-13. *Feature-creep check:* "recently used first" was a separate story in the first draft, but it only changes how the same picker is ordered, so it was merged into FW-11. Exercise instructions and videos were considered for Priya and rejected as out of scope. *Dependencies:* FW-12's type feeds FW-03; archived exercises affect templates (FW-26).

### NON-FUNCTIONAL REQUIREMENTS

| ID | Category | Requirement | Label |
| --- | --- | --- | --- |
| NFR-09 | Data integrity | Each exercise keeps a stable identity, so renaming or archiving never separates it from its recorded sets. | Derived (N3) |

NFR-04 (responsiveness of search) and NFR-06 (privacy of custom exercises) also apply. No other category is relevant to this 1-pager.

### REQUIREMENTS SIZING

Metric: story points (scale in Section 5), initial estimates only. Size reflects effort, not importance.

| Story ID | User Story | Size | Rationale |
| --- | --- | --: | --- |
| FW-11 | Find an exercise by search and filter, recent first | 3 | Live search, combined filter, ordering rule and an empty state; depends on the seeded library. |
| FW-12 | Create a custom exercise | 3 | Validation, uniqueness check, type lock after first use. |
| FW-13 | Rename or archive a custom exercise | 3 | Rename propagation to history, archive and restore states, protection of exercises with history. |

**Total: 9 points.**

## 5.3 Workout History 1-pager

### PROBLEM

A month after a heavy leg day, Marcus wants to know what he squatted and how many sets he did, because he is deciding whether to repeat that session or change it. His notes app holds weeks of unstructured text, so he scrolls and squints for a few minutes and settles for a guess. Priya wants to check whether she has really trained three times a week since she started, and she has no quick way to see which days she went. Elena has just noticed that last Tuesday's dumbbell press was recorded as 300 kg instead of 30 kg; in her notes she can retype the line, but she does not trust anything she looks at afterwards.

General-purpose tools keep past sessions but do not help find them, do not show them the way they were recorded, and give no assurance that a correction changes everything that depends on it. This matters because a log has value only if past sessions can be found and read, and if errors can be fixed; otherwise people stop trusting the data or stop recording it.

### ASSUMPTIONS

| ID | Assumption | Why it is needed |
| --- | --- | --- |
| A-HIS-1 | Finished workouts are kept until the user deletes them; the product does not expire data. | Graphs and comparisons need long histories. |
| A-HIS-2 | History is ordered by workout date and time, newest first. | People look for recent sessions first. |
| A-HIS-3 | A finished workout may be edited, including its date (never to a future date). | Elena's typo scenario; consistent with A-LOG-5. |
| A-HIS-4 | Deleting a workout is permanent after one confirmation; there is no recycle bin. | Keeps scope small; the risk is accepted. **Requires Human Validation.** |
| A-HIS-5 | A calendar view, workout notes and sharing are not included. | Priya's need to see when she trained is met by a dated list and date filter; the rest was not requested by any persona. |

### FUNCTIONAL REQUIREMENTS

**FW-14.** As **Priya**, I want to see a list of my finished workouts with their dates, exercises and number of sets, so that I can quickly check when and what I trained.

- Each row shows the date, the names of up to the first three exercises (with "and N more" if there are more), and the total number of sets.
- Older workouts load as the user scrolls.
- A user with no workouts sees a message that explains how to log the first one.

**FW-15.** As **Marcus**, I want to open a past workout and see every exercise and set exactly as recorded, so that I can plan a repeat or check what I did.

- Shows exercises in workout order and each set's weight, reps or seconds in the user's unit.
- Shows date, duration (if recorded) and total volume.

**FW-16.** As **Marcus**, I want to see every time I performed one exercise, with the sets from each session, so that I can follow one lift in numbers.

- Available from the exercise library and from a workout entry.
- Sessions are listed newest first with date and sets; archived exercises can still be viewed.

**FW-17.** As **Elena**, I want to edit a finished workout, so that I can fix mistakes I notice later.

- Editable items: set values, adding or removing sets and entries, and the workout date.
- Uses the same validation as FW-02 and FW-03.
- A workout cannot be edited to contain no sets; the user must delete it instead.

**FW-18.** As **Elena**, I want to delete a finished workout after confirming, so that accidental or test entries do not distort my history and graphs.

- Confirmation names the workout's date and number of sets.
- After deletion the workout no longer appears in history, previous performance or graphs.

**FW-19.** As **Priya**, I want to narrow my history to a date range or to one exercise, so that I can find a specific period or lift without scrolling.

- Date range and exercise can be combined; a clear control resets both.
- No matches shows a message.

**Quality review.** *Coverage:* find, read, follow one lift, correct, remove, narrow. *Personas:* Priya FW-14, FW-19; Marcus FW-15, FW-16; Elena FW-17, FW-18. *Feature-creep check:* FW-16 (numbers per exercise) and the per-exercise graph FW-20 answer different questions, so both stay; a calendar or streak indicator for Priya was rejected because FW-14 and FW-19 already show when she trained. *Dependencies:* FW-14 needs FW-06; FW-17 and FW-18 must update FW-04 and the graphs (NFR-10).

### NON-FUNCTIONAL REQUIREMENTS

| ID | Category | Requirement | Label |
| --- | --- | --- | --- |
| NFR-10 | Data integrity | After a workout is edited or deleted, history, previous performance and graphs show the change the next time they are viewed, with no manual refresh. | Derived (N8) |

NFR-04 (history loading time), NFR-05 (edits made offline), and NFR-06 (privacy) also apply.

### REQUIREMENTS SIZING

Metric: story points (scale in Section 5), initial estimates only. Size reflects effort, not importance.

| Story ID | User Story | Size | Rationale |
| --- | --- | --: | --- |
| FW-14 | List finished workouts | 3 | Paged list, row summary, empty state. |
| FW-15 | Open a past workout | 2 | Read-only screen over existing data. |
| FW-16 | History of one exercise | 3 | Query across workouts, a new screen, and archived exercises. |
| FW-17 | Edit a finished workout | 5 | Reuses logging validation but adds many edit states and must keep dependent views consistent. |
| FW-18 | Delete a finished workout | 2 | Confirmation and removal; effects on other views are covered by NFR-10 testing. |
| FW-19 | Filter history | 3 | Two filters, combined use, empty result. |

**Total: 18 points.**

## 5.4 Volume Progress Graphs 1-pager

### PROBLEM

Marcus wants to know whether his total squat volume has risen over the last three months. To find out, he copies numbers from his notes into a spreadsheet, multiplies weight by reps for every set and builds a chart, which takes long enough that he does it only a few times a year. Priya does not want exercise-by-exercise analysis; she wants to know whether she is doing more overall than a month ago, because that is what keeps her coming back. Elena's main exercise is push-ups, which have no weight, so the calculation Marcus does by hand does not even apply to her, and she wants to see her total reps rise instead.

Flat records hide progress. Spreadsheets can show it, but only for users who build and maintain the calculation, and any typing error silently changes the picture. This matters because visible progress is the main reason these users keep logging; if the picture is missing or cannot be trusted, the log becomes a chore with no payoff.

### ASSUMPTIONS

| ID | Assumption | Why it is needed |
| --- | --- | --- |
| A-GRA-1 | For a weight-and-reps exercise, session volume is the sum of weight times reps over its sets. For a reps-only exercise, the measure is total reps. | The vision says "volume" without defining it; this is the common strength-training definition. **Requires Human Validation.** |
| A-GRA-2 | Duration exercises are recorded and shown in history but are not graphed. | Time-based progress needs a different measure; excluding it controls scope. |
| A-GRA-3 | All sets count equally, because set types such as warm-up are excluded. | Effect on volume accuracy is an open question (Section 8). |
| A-GRA-4 | A per-exercise graph has one point per workout containing that exercise. The overall graph has one point per calendar week (Monday to Sunday, local dates). | Provides detail at two levels without many options; the week definition is a choice. |
| A-GRA-5 | Available periods: 4 weeks, 3 months, 6 months, 1 year, all time. | Covers short-term and long-term comparison; the specific periods are a choice. |
| A-GRA-6 | The overall weekly graph adds only weight-and-reps exercises. | Prevents adding kilograms to reps or seconds. |

### FUNCTIONAL REQUIREMENTS

**FW-20.** As **Marcus**, I want to see a graph of my total volume for one exercise over time, one point per workout, so that I can tell whether I am lifting more than before.

- The user selects a weight-and-reps exercise; the graph plots session volume by workout date, with labelled axes and units.
- Each value equals the sum of weight times reps for that day's sets of the exercise.
- With fewer than two workouts of the exercise, a message states that more workouts are needed and how to log one, instead of a blank chart.

**FW-21.** As **Marcus**, I want to choose the period shown on a graph, so that I can compare recent weeks with the longer trend.

- Periods are those in A-GRA-5; changing the period updates the graph and its text summary.
- Applies to the graphs in FW-20, FW-22 and FW-23.

**FW-22.** As **Priya**, I want to see my total volume for each week across all my weight-based exercises, so that I can tell whether I am training more overall without choosing an exercise.

- One value per calendar week in the selected period; weeks with no workouts show zero.
- A sentence under the graph compares the latest week with the previous week.
- Follows A-GRA-6, and the same not-enough-data message as FW-20 applies.

**FW-23.** As **Elena**, I want to see my total reps per workout for a reps-only exercise, so that I can follow progress on bodyweight exercises.

- Available for reps-only exercises; the vertical axis is labelled "Total reps".

**FW-24.** As **Marcus**, I want to select a point on a graph to see its date and value and open that workout, so that I can understand an unusually high or low session.

- The selected point shows its exact date and value; an action opens the workout (FW-15).
- For a weekly point, the action lists that week's workouts.

**Quality review.** *Coverage:* per-exercise graph, period, overall graph, reps-only graph, drill-down. *Personas:* Marcus FW-20, FW-21, FW-24; Priya FW-22; Elena FW-23. *Feature-creep check:* the first draft's separate "not enough data" story was reduced to a detail because it is one state of FW-20 and FW-22, not a distinct user need; pie charts, muscle-group breakdowns, estimated one-rep maximum and goals were not added. FW-23 stays separate from FW-20 because it serves a different persona and measure. *Dependencies:* all graphs depend on FW-06, FW-17 and FW-18 for correct data; FW-24 depends on FW-15.

### NON-FUNCTIONAL REQUIREMENTS

| ID | Category | Requirement | Label |
| --- | --- | --- | --- |
| NFR-11 | Accuracy | Every graphed value equals the value recomputed from the logged sets for the same period; agreement is 100% on test data. | Derived (N5; trust in the record) |
| NFR-12 | Accessibility, usability | Graphs do not rely on color alone, include a text summary (latest value and change over the shown period), and are legible on a screen 360 px wide without horizontal scrolling. | Assumption (WCAG guidance) |

NFR-04 (graph display time) and NFR-07 (compatibility) also apply.

### REQUIREMENTS SIZING

Metric: story points (scale in Section 5), initial estimates only. Size reflects effort, not importance.

| Story ID | User Story | Size | Rationale |
| --- | --- | --: | --- |
| FW-20 | Per-exercise volume graph | 5 | First chart in the product: aggregation, axes, units, sparse-data state, and accuracy testing. |
| FW-21 | Choose the period | 2 | One control filtering data already used by the graphs. |
| FW-22 | Overall weekly volume graph | 3 | Reuses the chart from FW-20; new weekly grouping across exercises, zero weeks and comparison text. Assumes FW-20 is built first. |
| FW-23 | Reps-only total reps graph | 2 | Same chart as FW-20 with a different measure and label. |
| FW-24 | Select a point and open the workout | 3 | Chart interaction and navigation, plus the weekly variant. |

**Total: 15 points.**

## 5.5 Repeatable Workouts 1-pager

### PROBLEM

Marcus trains on a push, pull and legs split, so every Monday he sets up the same six exercises before he can log a single set. It costs him a few minutes of the time he wanted for warming up, and on busy days he skips an exercise because re-entering it feels like too much work. Priya follows a three-day beginner plan, and each time she arrives at the gym she has to remember or look up the exercises for that day's session and enter them one by one. Elena repeats one short home routine almost every session and does not want to keep re-entering it, or to manage a collection of plans.

Notes apps let people copy and paste an old workout, but the copy is a block of text that has to be edited and that carries last time's numbers into the new entry, where they can be mistaken for today's. Setting up by hand also gives people a chance to misname or forget an exercise, which weakens the consistent records the rest of the product depends on. This 1-pager deals only with starting familiar workouts; it does not cover prescribing weights, reps or programs, which would be coaching and are out of scope.

### ASSUMPTIONS

| ID | Assumption | Why it is needed |
| --- | --- | --- |
| A-TEM-1 | A template is a named, ordered list of exercises with no prescribed sets, weights or reps. | Keeps this within logging; prescribing loads would be program design. |
| A-TEM-2 | A workout started from a template is an ordinary workout that contains the template's exercises and no sets. Earlier numbers come from previous performance (FW-04), not from the template. | Avoids a second source of weight and rep data. |
| A-TEM-3 | Template names are unique per user, ignoring case. | Consistent with exercise names (A-EX-4). |
| A-TEM-4 | If an exercise in a template is later archived, it stays in the template, marked as archived. | Avoids silently breaking saved routines (FW-13). |

### FUNCTIONAL REQUIREMENTS

**FW-25.** As **Elena**, I want to save the exercises of a finished workout as a named template, so that I can start my usual routine again without re-entering it.

- Available from a finished workout; the name is required, 1 to 60 characters (proposed), and unique under A-TEM-3.
- Exercises are saved in the order performed; sets are not saved.

**FW-26.** As **Marcus**, I want to start a workout from a template, so that its exercises are already in the workout when I begin.

- The new workout contains the template's exercises in order, with no sets.
- Archived exercises are marked, and the user can keep or skip each one.
- Exercises can still be added or removed in the new workout without changing the template.

**FW-27.** As **Priya**, I want to create and edit a template by choosing exercises myself, so that I can set up my plan at home before going to the gym.

- The user names the template, adds exercises using the search from FW-11, reorders them and removes them.
- Editing a template does not change finished workouts.

**FW-28.** As **Marcus**, I want to delete a template, so that I can retire routines I no longer use.

- Confirmation names the template.
- Finished workouts that were started from it are unchanged.

**Quality review.** *Coverage:* create from history, create from scratch, start, delete. *Personas:* Elena FW-25; Marcus FW-26, FW-28; Priya FW-27. *Feature-creep check:* the first draft's "repeat my last workout" story was removed, because it is only another way of starting a familiar workout that FW-25 and FW-26 already provide; sharing templates and prescribed loads were not added. *Dependencies:* FW-25 needs FW-06; FW-27 needs FW-11; FW-26 uses FW-01.

### NON-FUNCTIONAL REQUIREMENTS

| ID | Category | Requirement | Label |
| --- | --- | --- | --- |
| NFR-13 | Data integrity | Templates and finished workouts are independent: editing or deleting a template never changes a finished workout, and the reverse. | Derived (N3, N6) |

NFR-04 (responsiveness), NFR-05 (templates usable without a connection), and NFR-06 (privacy) also apply.

### REQUIREMENTS SIZING

Metric: story points (scale in Section 5), initial estimates only. Size reflects effort, not importance.

| Story ID | User Story | Size | Rationale |
| --- | --- | --: | --- |
| FW-25 | Save a finished workout as a template | 3 | New data type, naming rule and an ordered copy of exercises. |
| FW-26 | Start a workout from a template | 3 | Reuses workout creation (FW-01); archived-exercise handling adds states. |
| FW-27 | Create and edit a template | 5 | Several screens (name, add, reorder, remove) and reuse of the exercise search. |
| FW-28 | Delete a template | 2 | Confirmation and removal; independence from workouts. |

**Total: 13 points.**

**Grand total across the five 1-pagers: 90 points** (35 + 9 + 18 + 15 + 13) for 28 stories. This is a relative measure of size, not a schedule.

## 6. Overall Requirement Traceability Matrix

| Vision Need | Persona | Problem / Scenario | 1-Pager | Story IDs |
| --- | --- | --- | --- | --- |
| N1: Record sets quickly on a phone | Marcus, Priya, Elena | Marcus's rest time is lost to typing; Priya is distracted between sets; Elena sometimes logs afterwards. Scenarios: Leg day; Day 2 workout. | 5.1 Workout Logging | FW-01, FW-02, FW-03, FW-05, FW-06, FW-08 |
| N2: See previous performance | Priya, Marcus | Priya guesses her weights; Marcus scrolls old notes. Scenarios: Day 2 workout; Leg day. | 5.1 Workout Logging; 5.3 Workout History | FW-04, FW-15, FW-16 |
| N3: Keep exercise records consistent | Marcus, Priya, Elena | "bench" versus "Bench Press"; unknown names; exercises no list contains. | 5.2 Exercise Library (and 5.1) | FW-11, FW-12, FW-13, FW-03 |
| N4: Review past workouts | Priya, Marcus | Checking consistency; recalling last month's leg day. | 5.3 Workout History | FW-14, FW-15, FW-16, FW-19 |
| N5: See training volume over time | Marcus, Priya, Elena | Manual spreadsheet charting; overall progress; bodyweight progress. | 5.4 Volume Progress Graphs | FW-20, FW-21, FW-22, FW-23, FW-24 |
| N6: Start familiar workouts without rebuilding them | Marcus, Priya, Elena | Re-entering six exercises each session; following a fixed plan; rerunning one routine. Scenario: Home routine. | 5.5 Repeatable Workouts | FW-25, FW-26, FW-27, FW-28 |
| N7: Keep every logged set safe, including without a connection | Elena, Priya, Marcus | Lost session; no signal in the basement; interrupted phone. Scenario: Home routine. | 5.1 Workout Logging | FW-07, FW-09 |
| N8: Correct mistakes | Elena, Marcus | 300 kg typed instead of 30 kg; mistaken tap during a set. | 5.1 Workout Logging; 5.3 Workout History | FW-05, FW-17, FW-18 |
| N9: Use the unit the user trains in | Priya, Marcus | Priya uses kg, Marcus lb. | 5.1 Workout Logging | FW-10 |

**Stories per persona (lead actor).** Marcus 11 (FW-01, 02, 05, 13, 15, 16, 20, 21, 24, 26, 28); Priya 9 (FW-04, 06, 07, 10, 11, 14, 19, 22, 27); Elena 8 (FW-03, 08, 09, 12, 17, 18, 23, 25). Total 28.

**Effort by 1-pager.** 5.1 Workout Logging: 35 points (10 stories). 5.2 Exercise Library: 9 (3). 5.3 Workout History: 18 (6). 5.4 Volume Progress Graphs: 15 (5). 5.5 Repeatable Workouts: 13 (4). Total 90.

**Chain check (Vision to Persona to Problem to Story to Size).** All nine needs lead to at least one story, and each of the 28 stories appears in at least one row, so there are no orphan stories. Thin spots: N7 rests on FW-09, which depends on assumption A-LOG-6; N2 depends on the accuracy of edits (NFR-10). No story exists for sign-in or data export by design.

## 7. Project Manager Quality Audit

This is a self-review by the model that wrote the document, so it is biased toward its own work. Use it as a checklist for your own review, not as independent verification.

### Product Vision

Improved: rewritten in the FOR / WHO / THE / THAT / UNLIKE form; the problem, why it matters, scope and out-of-scope list are explicit; nine numbered needs give traceability. The "unlike other apps" claim now contrasts categories of tools only. Not solved: no competitor analysis exists.

### Personas

Improved: each persona now states education and technical skill, goals are written as what the person wants to do, and all three are labelled proto-personas per the chapter. Elena's need for one-action repeat was replaced by saving a routine once. Three personas retained; each leads at least eight stories.

### Scenarios

Improved: every problem statement is a narrative that names personas, the objective, what is involved and what current tools cannot do, without prescribing a design; rationale was moved into stories. Persona scenarios avoid embedded rationale. Limitation: eight scenarios in total, fewer than the chapter's suggestion of three or four per persona.

### Functional Requirements

Improved: 31 stories became 28 after applying the chapter's feature-creep questions (repeat-last-workout removed; recently-used merged into search; not-enough-data reduced to a detail). IDs are unique and sequential (FW-01 to FW-28). Details were trimmed to rules, validation, edge cases and empty states. Limits that no persona needed were removed.

### Non-Functional Requirements

Improved: 13 requirements (NFR-01 to NFR-13) replaced a larger set with repeated and arbitrary figures. Shared requirements are stated once and referenced. Each carries a label (derived, assumption, proposed target). Numbers that remain are 3 taps, 44 points, 4.5:1 contrast, 1 second, 3 seconds and 1,000 workouts; each has a stated reason and needs validation.

### Sizing

Improved: one metric (story points) and one written scale; the definition now states that size is effort, not value. FW-22 was reduced from 5 to 3 because it reuses the chart from FW-20. Similar stories carry similar sizes (for example FW-18 and FW-15 at 2; FW-14, FW-16 and FW-19 at 3). Totals: 90 points for 28 stories. Estimates have not been calibrated by a team.

### Traceability

Improved: persona table and matrix were rebuilt from the final story list; all nine needs map to stories and all 28 stories map to a need, so there are no orphans. Story counts per persona and effort per 1-pager were added.

### Consistency checks performed

Persona names are identical everywhere (Marcus Reyes, Priya Nair, Elena Okafor). Terminology follows the definitions in Section 5. Assumption IDs are prefixed per 1-pager and none contradict each other. Persona scenarios match the stories they exercise (for example Elena's saved "Home routine" corresponds to FW-25 and FW-26). Non-functional requirements do not conflict with functional ones: offline use (NFR-05) is supported by FW-09; NFR-04 covers all screens.

### Remaining Risks

1. Personas and scenarios are invented and unvalidated.
2. Offline logging (FW-09, 8 points, about 9% of the total) may exceed a student prototype's scope.
3. The volume definition ignores warm-up sets.
4. Sync conflicts between devices are undefined.
5. Numeric targets and story sizes are proposals.
6. Fewer scenarios than the chapter suggests.
7. A section-by-section review of whether this format fits your instructor's rubric is still needed.

## 8. Open Questions / Human Validation

These are the decisions that need your judgment. Items marked **Requires Human Validation** elsewhere in the document are collected here.

### High Priority

1. **Offline logging (A-LOG-6, FW-09).** Keep it in the prototype, or reduce to saving on the device only? Dropping full sync would remove the largest story and change NFR-05.
2. **Sign-in and accounts (A-LOG-4).** Does the prototype need accounts, or only storage on one phone? This changes FW-09, NFR-05 and NFR-06.
3. **Definition of volume (A-GRA-1, A-GRA-3).** Is weight times reps, counting all sets equally, acceptable for your class?
4. **Proto-persona validation.** The chapter says personas built on little information are weaker; a short informal chat with two or three gym-goers would let you confirm or change Marcus, Priya and Elena. Record what you did in your write-up.

### Medium Priority

5. **Platform (NFR-07).** Native mobile app or mobile web? Nothing in the vision decides this.
6. **Permanent deletion (A-HIS-4).** Is it acceptable that deleting a workout cannot be undone later?
7. **Two-device conflicts (FW-09).** Decide the rule, or state that only one device per account is supported.
8. **Numeric targets.** Review NFR-02 (3 taps), NFR-04 (1 s and 3 s, 1,000 workouts), and proposed limits (weight and reps ranges, 60-character names, 10 recent exercises).
9. **Story sizes.** Adjust after discussing with your teammates; a shared estimation round would give more defensible numbers.

### Low Priority

10. **Scenario count.** Add more scenarios per persona if your instructor expects the chapter's three or four.
11. **Small design choices.** Week starting Monday (A-GRA-4), the listed graph periods (A-GRA-5), and the muscle-group filter (A-EX-2).
12. **Format fit.** Confirm the 1-pager and story format matches your instructor's rubric; I have not seen it.

## 9. Comparison Pending

This Claude version has been reviewed and refined and is ready to be compared with the independently generated version from the second AI model. No comparison has been made here, and nothing in this document relies on or describes the other model's output.

## 10. Student Evaluation of Claude's Output

*Reserved for your own answers. Claude has intentionally left every prompt blank.*

1. What did Claude do well?
2. What did Claude do poorly?
3. Which requirements were particularly useful?
4. Which requirements need modification?
5. Were the personas sufficiently specific?
6. Were the scenarios realistic and appropriate?
7. Were the assumptions reasonable?
8. Was the sizing methodology appropriate?
9. What would I change before submitting?
10. What did I learn from using Claude?
11. Overall evaluation:
