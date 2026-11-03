# Fitness & Workout Log App — Claude Final Version (Concise 1-Pagers)

Sep 30, 2026 · @Diego Bonilla

Fourth iteration of the Claude-generated definition for the Fitness & Workout Log App only. It has four personas (Tomás Vargas is new) and 29 stories (FW-01 to FW-29, 93 story points); the 1-pagers stay within about a page and a half each. Product overview, personas, 1-pagers and sizing follow the project template.

## 1. Product Vision

**Basis and limits.** The Chapter 3 text you provided is the conceptual reference; it is paraphrased, never quoted. Anything beyond it is labelled an assumption. No user research was done and no real users were consulted. This section is carried over from the previous final version; the only change is need N10 and the matching scope item, added for the fourth persona.

### 1.1 Initial Vision

The Fitness & Workout Log App is a mobile app that helps people who train regularly to log their workouts, track exercises and sets, and view their progress over time through graphs. It makes fitness tracking easy and motivating, so users can stay consistent, see improvement and reach their goals. Unlike other apps, it is simple, fast and works for everyone from beginners to advanced athletes.

### 1.2 Critique of Initial Vision

| # | Weakness | Consequence for requirements |
| --- | --- | --- |
| 1 | "Easy", "motivating", "simple, fast" cannot be tested. | Non-functional requirements cannot be derived from adjectives. |
| 2 | "Everyone from beginners to advanced athletes" hides real differences between users. | Personas need distinct needs; "everyone" gives no design guidance. |
| 3 | The problem is never stated: why do paper, notes apps and spreadsheets fall short? | A scenario needs a problem that existing tools do not handle well. |
| 4 | "Reach their goals" implies goal setting, which is outside log, track and view. | Invites feature creep (goals, plans, coaching). |
| 5 | "Unlike other apps" is unsupported; no comparison was made. | An unverified claim (**Requires Human Validation**). |
| 6 | The context of use is missing: logging happens between sets, on a phone, sometimes without signal. | This context drives the usability, reliability and data-integrity requirements. |
| 7 | No statement of what the product will not do. | Users and developers may assume nutrition, social or coaching features. |

### 1.3 Refined Product Vision

The vision follows the FOR / WHO / THE / THAT / UNLIKE form used in Chapter 3. "UNLIKE" names general categories of tools only; no competitors were analysed.

**FOR** people who do strength or bodyweight training on a regular schedule, **WHO** currently record sessions on paper, in a notes app or in a spreadsheet, **THE** Fitness & Workout Log App **is** a mobile-first workout log **THAT** lets them record each exercise and set between sets, see what they did last time while they train, and review how their training volume changes over time. **UNLIKE** general-purpose notes and spreadsheets, which leave exercise names, layouts and calculations to the user, **OUR** product keeps consistent exercise records and turns them into per-exercise and overall volume graphs without extra work.

**The problem.** Recording a workout mid-session with general-purpose tools is slow and error-prone: names are typed inconsistently, last session's numbers are hard to find when needed, and turning old entries into a picture of progress takes manual effort most people never spend. People guess their next weights and cannot tell whether they are improving.

**Why it matters.** Visible progress and reliable records keep regular exercisers consistent; losing or distrusting the record removes the reason to log.

**Scope.** Logging workouts, exercises and sets; an exercise library with user-defined exercises; workout history with correction; volume graphs; reusable workout lists; kg or lb units; adjustable text size and plain summaries.

**Out of scope (deliberate).** Nutrition, social features, coaching or trainer marketplaces, medical or injury advice, generated training plans, wearable integration, payments, goal setting, rest timers, set types such as warm-up, and exercise instructions or videos.

**Vision needs** (used for traceability):

| ID | Need |
| --- | --- |
| N1 | Record sets quickly on a phone. |
| N2 | See previous performance when choosing today's weights. |
| N3 | Keep exercise records consistent and comparable over time. |
| N4 | Review past workouts. |
| N5 | See training volume over time. |
| N6 | Start familiar workouts without rebuilding them. |
| N7 | Keep every logged set safe, including without a connection. |
| N8 | Correct mistakes in recorded data. |
| N9 | Enter and view weights in the unit the user trains in. |
| N10 | Read and use the app comfortably: large text and plain summaries. |

## 2. AI Interaction / Development Log

**Honesty note.** Each iteration below is one Claude response to one of your prompts; drafting and self-review happened inside that response. Iteration 3 answers your feedback message about 1-pager length; Iteration 4 adds the fourth persona. No other model's output was used.

| Iteration | Purpose | Problems Identified | Changes Made | Expected Improvement |
| --- | --- | --- | --- | --- |
| 1. Initial Claude output | Produce vision, personas, 1-pagers, sizing, traceability and audit from your first prompt, without the Chapter 3 text. | Found in Iteration 2 (below). | Complete first draft: 3 personas, 5 1-pagers, 31 stories (97 points). | A baseline to review. |
| 2. Review and refinement | Formal review against your rubric and the Chapter 3 text. | Personas lacked education and technical skill; problem statements did not say what current tools cannot do; feature creep; arbitrary numeric targets; inconsistent sizing; non-sequential IDs. | Proto-personas; narrative problem statements; 28 stories (FW-01 to FW-28); 13 NFRs with labels; re-sized stories (90 points). | Closer to the rubric and to Chapter 3. |
| 3. Concise 1-pagers | Respond to your feedback: 1-pagers ran about four pages; the limit is a page and a half, and they must be easy to follow. | Verbose problem statements and assumption tables; four to six detail bullets per story; quality-review paragraphs inside each 1-pager; epics of up to ten stories that could not fit; in my first shortened pass the 1-pagers were still 2 to 3 pages when measured in a PDF export. | Kept all 28 stories, IDs and sizes; split the epics into eight 1-pagers (three to five stories each); cut each to a short problem, two to four assumptions, one detail per story, two to four NFRs and a sizing table with a short rationale plus a closing note on why the sizes were assigned. Moved quality reviews to Section 7. Corrected an error in the previous version (see Section 7). | 1-pagers that can be read in a few minutes and used as a base for the rest of the project. |
| 4. Fourth persona | Respond to the project rubric (four personas) and your choice of Tomás Vargas, a returning lifter with low tech comfort. | Three personas did not cover low technical comfort or readability; no story had readability as its goal. | Added persona Tomás (Section 3) with scenario; added need N10 and one story, FW-29 (adjustable text size, 3 points); reassigned FW-06 and FW-14 to Tomás; added NFR-14; counts are now 29 stories and 93 points. | A persona set that covers experienced, beginner, offline and low-tech users, each traced to stories. |

### Iteration 3 in detail

**What was reviewed.** The previous final version's five 1-pagers against your template and your limit of a page and a half.

**What changed.** Each problem statement is one short paragraph (persona, situation, what today's tools cannot do). Assumptions dropped to two to four lines. Stories keep the "As a ... I want ... so that ..." form with one detail line. Only the relevant non-functional requirements are listed. Sizing is a table with a short rationale per story plus a closing note on why the sizes were assigned. The five 1-pagers became eight, with story IDs unchanged. Assumption IDs were renumbered where assumptions were merged (for example, the two graph-period assumptions are now A-GRA-3, and the sign-in assumption is now A-LOG-3).

**What did not change.** The vision, personas, story wording, sizes (90 points) and the vision-need links.

**Limits.** Fewer details per story means some edge cases now live only in assumptions or were dropped from the detail lines; the earlier versions remain available if you want them back. Page counts are in Section 7.

### Iteration 4 in detail

**What changed.** Tomás Vargas (46, office administrator, paper notebook) was added with the details you gave: low tech comfort, hard-to-read handwriting, wants large text and simple summaries. His other details (education, routine, scenario) are my assumptions. He is the lead actor of FW-06 (summary), FW-14 (history list) and the new FW-29 (text size); the first two were reassigned from Priya, and the sizes did not change. Sections 4, 6 and 7 were updated.

**What did not change.** The other personas, all other stories, IDs and sizes.

**Limits.** Three stories is thin coverage for a persona; readability is mostly a quality of the whole app, so it is also captured as NFR-14. **Requires Human Validation.**

## 3. Personas

**Status: proto-personas.** These are imagined users written from general knowledge of how people train, not from interviews or surveys. In Chapter 3's terms they are proto-personas: better than none, less reliable than personas built from user studies (**Requires Human Validation**). Four are used because the vision has four distinct usage situations: experienced, beginner, offline home training, and low technical comfort. Tomás was added in the fourth iteration; the other three are carried over unchanged.

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

### Persona 4: Tomás Vargas

**Persona type:** Secondary user; returning lifter with low technical comfort.

**Background:** Age 46, office administrator with vocational training. Lifted recreationally years ago and returned to training recently. Uses email, messaging and office software comfortably but rarely installs phone apps. Follows a routine given by a gym instructor.

**Goals:** Keep a regular routine, see what he did last session before starting the next, and know that his record is complete.

**Motivations:** Wants a record he can read and trust; he stopped training before partly because he lost track of what he had done. The product would help by replacing a notebook he cannot always read.

**Behaviors:** Writes weights and reps in a paper notebook after each set. Flips back through several pages to find last time. Avoids apps that look crowded.

**Pain points:** His handwriting becomes hard to read, finding the last entry of one exercise takes minutes, small text on a phone is hard for him to read, and dense graphs or abbreviations make an app feel harder than paper.

**Needs:** Large, readable text; simple labelled controls; a plain summary of each workout and of past sessions; a history he can reach in few taps; graphs that never replace the underlying records.

**Usage context:** Own phone at the gym, sometimes without glasses on, two or three times a week.

**Product expectations:** Easier than his notebook from the first session, with nothing hidden in menus.

**Representative scenario:** *Back at the gym.* Tomás wants to see his last session before starting today's routine, because he cannot read his own notebook entry. He raises the text size once in settings. He opens his history, sees his sessions as a short list with dates, and opens the last one to read a plain summary of each exercise and its sets. He logs today's sets with the weights already filled in and finishes the workout, which shows a short summary in the same large text. In his notebook this meant flipping through pages and guessing at handwriting.

### Persona Consistency Check

| Question | Result |
| --- | --- |
| Genuine user types? | Yes, as plausible types. Not validated with real users. |
| Distinct goals and behaviors? | Yes. Marcus logs heavy lifts fast and analyzes; Priya needs discovery and reassurance; Elena needs exercise variety, offline and reliability; Tomás needs readability and simplicity. |
| Detailed enough to generate requirements? | Yes. Each persona is the lead actor for at least three stories; Tomás has the fewest (Section 4). |
| Redundant? | No. Removing any persona removes a distinct set of stories. |
| Missing types? | A coach or trainer was rejected (coaching is out of scope); a user recovering from injury is excluded (medical guidance is out of scope). |
| Connected to the vision? | Each maps to needs N1 to N10 (Section 6). |

## 4. Persona-to-Requirement Traceability

| Persona | Main Problem | Main Goal | Relevant Product Capabilities |
| --- | --- | --- | --- |
| Marcus Reyes | Note-taking between sets is slow and inconsistent, so he loses rest time and cannot compare sessions or see trends without spreadsheet work. | Verify that his training volume on main lifts is rising. | Fast set entry with prefilled values (FW-02); starting a saved list (FW-26); correction during a workout (FW-05); exercise rename and archive (FW-13); past workout and per-exercise history (FW-15, FW-16); per-exercise graph, period choice and drill-down (FW-20, FW-21, FW-24); template deletion (FW-28). |
| Priya Nair | She forgets what she lifted and does not know exercise names, so she guesses weights and doubts her progress. | Keep a habit and increase weights gradually. | Exercise search (FW-11); previous performance while logging (FW-04); resuming an interrupted workout (FW-07); kg or lb (FW-10); history filter (FW-19); overall weekly volume graph (FW-22); building a saved list at home (FW-27). |
| Elena Okafor | Apps assume weights, lack custom exercises and lose data without signal. | Keep a home routine going without losing data. | Set form matching exercise type (FW-03); logging after the fact (FW-08); offline logging (FW-09); custom exercises (FW-12); editing and deleting finished workouts (FW-17, FW-18); reps-only graph (FW-23); saving a routine once (FW-25). |
| Tomás Vargas | Handwritten notes are hard to read and slow to search; small text and dense screens put him off apps. | Know what he did last time and trust that his record is complete. | Plain workout summary (FW-06); readable history list (FW-14); adjustable text size (FW-29). |

## 5. 1-Pagers / Epics

**Why eight 1-pagers.** Each covers one problem that can be read on its own and holds three to five stories: (5.1) recording a workout, (5.2) reviewing and finishing it, (5.3) keeping data safe and in the right unit, (5.4) choosing and maintaining exercises, (5.5) browsing past workouts, (5.6) correcting and filtering them, (5.7) seeing volume over time, (5.8) starting familiar workouts. The previous version had five 1-pagers of up to ten stories; the longest could not fit in a page and a half. Story IDs did not change. Sign-in is not a 1-pager: it is outside the vision's core value and is handled as an assumption (A-LOG-3).

**Terms.** *Workout*: one training session on one date. *Exercise*: a named movement in the library. *Workout entry*: an exercise performed within a workout. *Set*: one recorded bout in an entry. *Volume*: weight times reps summed over the sets of a weight-and-reps exercise. *Template*: a named, saved list of exercises.

**Sizing metric (same for all 1-pagers).** Story points, a relative measure of implementation effort (complexity, screens and states, data, validation, dependencies, uncertainty, edge cases), never of importance. Sizes are **initial estimates** and may change after more analysis.

| Points | Meaning |
| --: | --- |
| 1 | Trivial: one state, no new data. |
| 2 | Very small: one control or screen, reuses existing behavior. |
| 3 | Small: a few states, standard validation, depends on existing data. |
| 5 | Moderate: several screens or states, notable rules or new data handling. |
| 8 | Complex: cross-cutting behavior, synchronization or high uncertainty. |

**NFR labels.** **\[Derived\]** follows from a vision need or persona. **\[Assumption\]** is a reasonable, unconfirmed choice. **\[Proposed target\]** is a number I chose and it requires validation. No number comes from the assignment or the book.

## 5.1 Logging a Workout 1-pager

### PROBLEM

Marcus has about ninety seconds between squat sets. In his notes app he retypes the exercise and scrolls for last week's weights, so he often writes nothing and rebuilds the session from memory. Elena needs push-ups and planks recorded without a weight field. Notes do not know what a set is or adapt to the exercise, and when recording is slow, people stop.

### ASSUMPTIONS

- **A-LOG-1:** A workout has a date and ordered entries (an exercise and its sets); one workout is in progress at a time.
- **A-LOG-2:** Each exercise has a type: weight and reps, reps only, or seconds.
- **A-LOG-3:** Data belongs to one signed-in user; how they sign in is out of scope. **Requires Human Validation.**

### FUNCTIONAL REQUIREMENTS

**FW-01.** As **Marcus**, I want to start a workout and add exercises as I go, so that I can log in the order I actually train.

- Starts dated now; exercises come from the library (FW-11); a workout with no sets cannot be finished, only discarded.

**FW-02.** As **Marcus**, I want to record a set by entering weight and reps, prefilled from my previous set, so that I can log between sets without losing rest time.

- A new set copies the previous one; the first copies the latest set of that exercise. Proposed limits: weight 0 to 999.9, reps 1 to 999.

**FW-03.** As **Elena**, I want the set form to ask only for what applies to the exercise, so that I am not forced to enter a weight for push-ups or planks.

- Weight and reps, reps only, or seconds (whole number, at least 1), according to the exercise type (FW-12).

### NON-FUNCTIONAL REQUIREMENTS

- **NFR-02 Usability** \[Proposed target\]: recording a set with prefilled values takes at most 3 taps.
- **NFR-03 Accessibility** \[Assumption\]: touch targets of at least 44 x 44 points; text contrast of at least 4.5:1.
- **NFR-04 Performance** \[Proposed target\]: a confirmed set appears within 1 second on a mid-range phone.

### REQUIREMENTS SIZING

| Story ID | User Story | Size | Why |
| --- | --- | --: | --- |
| FW-01 | Start a workout, add exercises | 3 | A few states; depends on the exercise picker. |
| FW-02 | Record a set with prefill | 5 | Central interaction: prefill rules, validation, tap target. |
| FW-03 | Set form matches exercise type | 3 | Three form variants; reuses FW-02. |

**Total: 11 points.** **Why these sizes:** FW-02 is 5 because the other stories build on it and its prefill, validation and 3-tap target need design iteration. FW-01 and FW-03 are 3: a few states on existing data, no storage or sync.

## 5.2 Reviewing and Finishing a Workout 1-pager

### PROBLEM

At the bench, Priya cannot remember what she lifted last time, so she guesses a weight. Marcus taps the wrong set mid-workout and cannot fix it without corrupting his history. At the end, Tomás, who has only used a paper notebook, is not sure the session was saved. Notes apps show no earlier numbers when they matter and give no confirmation.

### ASSUMPTIONS

- **A-REV-1:** "Previous performance" means the sets of the latest finished workout that contains the exercise.
- **A-REV-2:** Deleting a set or entry can be undone only immediately afterwards.
- **A-REV-3:** The summary reports volume as weight times reps summed over weight-and-reps sets (see A-GRA-1).

### FUNCTIONAL REQUIREMENTS

**FW-04.** As **Priya**, I want to see what I did the last time I performed an exercise while I log it, so that I can choose today's weight instead of guessing.

- Shows the date and sets, or "No previous record"; reflects later edits and deletions (FW-17, FW-18).

**FW-05.** As **Marcus**, I want to correct or remove a set, or remove an entry, during a workout, so that one mistaken tap does not corrupt my history.

- Edits use the FW-02 validation; deleting asks for confirmation and can be undone at once; set numbers update.

**FW-06.** As **Tomás**, I want to finish a workout and see a short, plain summary, so that I know it is saved and can read what I did.

- Summary: date, duration, exercises, sets and total volume; entries without sets are dropped and the user is told; the workout appears in history (FW-14).

### NON-FUNCTIONAL REQUIREMENTS

- **NFR-06 Privacy** \[Assumption\]: a user sees and changes only their own workouts.
- **NFR-04 Performance** \[Proposed target\]: the summary appears within 1 second of finishing.
- Also applies: NFR-02 and NFR-03 (5.1).

### REQUIREMENTS SIZING

| Story ID | User Story | Size | Why |
| --- | --- | --: | --- |
| FW-04 | See previous performance | 3 | Lookup of latest matching workout; empty state; must follow edits. |
| FW-05 | Correct or remove a set or entry | 3 | Edit, delete, confirm, undo and renumbering states. |
| FW-06 | Finish workout, see summary | 3 | Summary calculations and empty-entry handling. |

**Total: 9 points.** **Why these sizes:** all three are 3: each adds a few states or one lookup over existing data. FW-04 is the riskiest because it must follow later edits. None is 5: no new storage or flow.

## 5.3 Reliability and Units 1-pager

### PROBLEM

Elena trains in her basement after a night shift, with no signal. An app once lost a whole session, so she went back to paper; some days she wants to enter the session afterwards. Priya's plan and gym machines use kilograms, and when a call locks her phone mid-workout she does not know if her sets survived.

### ASSUMPTIONS

- **A-REL-1:** The product works without a connection and uploads data later. *Why:* Elena's normal environment; it raises cost noticeably. **Requires Human Validation.**
- **A-REL-2:** One weight unit (kg or lb) applies to the whole account; changing it affects display only.
- **A-REL-3:** A workout may be dated today or earlier, never in the future.
- **A-REL-4:** The rule for one account edited on two devices offline is undefined (Section 8).

### FUNCTIONAL REQUIREMENTS

**FW-07.** As **Priya**, I want my unfinished workout to still be there if I switch apps or my phone locks, so that an interruption does not cost me the session.

- Sets survive closing or restarting the app; reopening offers to resume or discard.

**FW-08.** As **Elena**, I want to record a workout I already did by choosing an earlier date, so that I can catch up when I could not use my phone during the session.

- Future dates cannot be chosen; it appears in history and graphs on that date.

**FW-09.** As **Elena**, I want to log a workout when I have no connection and have it uploaded later, so that I never lose a session because of my signal.

- Logging, library and templates work offline; the user sees whether a workout is waiting or uploaded; upload is automatic.

**FW-10.** As **Priya**, I want to choose whether weights are in kg or lb, so that entries match the plates and machines I use.

- Chosen at first use, changeable in settings; converts displayed weights, including past ones.

### NON-FUNCTIONAL REQUIREMENTS

- **NFR-01 Data integrity** \[Derived, N7\]: every confirmed set survives closing, locking, restart or lost signal.
- **NFR-05 Reliability** \[Assumption\]: offline data uploads without loss or duplication.
- **NFR-07 Compatibility** \[Assumption, **Requires Human Validation**\]: current iOS and Android phones, at least 360 px wide.
- **NFR-08 Data integrity** \[Derived, N9\]: switching kg and lb returns the numbers originally entered.

### REQUIREMENTS SIZING

| Story ID | User Story | Size | Why |
| --- | --- | --: | --- |
| FW-07 | Resume an unfinished workout | 3 | Persistence across app lifecycle; resume prompt. |
| FW-08 | Record a workout on an earlier date | 2 | One date control with one limit; reuses logging. |
| FW-09 | Log offline, upload later | 8 | Local storage, sync, duplicate avoidance, status, undefined conflicts. |
| FW-10 | Choose kg or lb | 2 | One setting with display conversion and rounding. |

**Total: 15 points.** **Why these sizes:** FW-09 is the only 8: it touches every logging story, needs synchronization and has the most uncertainty (A-REL-4). FW-07 is 3: lifecycle handling, no network. FW-08 and FW-10 are 2: one control with simple rules.

## 5.4 Exercise Library 1-pager

### PROBLEM

Marcus cannot compare his bench press across months because his notes say "bench", "Bench Press" and "BB bench" for one lift. Priya's plan says "seated row" and she does not know what to type. Elena does movements, such as farmer carries, that general lists lack. Free text cannot keep names consistent.

### ASSUMPTIONS

- **A-EX-1:** The product ships a predefined library of common gym and home exercises.
- **A-EX-2:** An exercise has a name, a type (A-LOG-2) and one muscle group used for filtering. Predefined exercises cannot be edited; custom ones belong to their creator.
- **A-EX-3:** Names are unique per user, ignoring case and spaces, across predefined and custom exercises.

### FUNCTIONAL REQUIREMENTS

**FW-11.** As **Priya**, I want to find an exercise by typing part of its name or filtering by muscle group, with recent ones first, so that I can add the right exercise without knowing its exact name.

- Search ignores case, matches anywhere and updates as the user types; with no text, the last 10 used (proposed) come first; no match offers FW-12.

**FW-12.** As **Elena**, I want to create my own exercise with a name and a type, so that I can log home and unusual movements the library lacks.

- Name 1 to 60 characters (proposed), unique under A-EX-3; the type is locked once a set uses it.

**FW-13.** As **Marcus**, I want to rename or archive a custom exercise, so that I can tidy my library without losing history.

- A rename applies to past workouts and graphs; archiving hides it from search, keeps its sets and can be undone; used exercises cannot be deleted.

### NON-FUNCTIONAL REQUIREMENTS

- **NFR-09 Data integrity** \[Derived, N3\]: each exercise has a stable identity, so renaming or archiving never separates it from its sets.
- **NFR-04 Performance** \[Proposed target\]: search results update within 1 second of each keystroke.
- **NFR-06 Privacy** \[Assumption\]: custom exercises are visible only to their creator.

### REQUIREMENTS SIZING

| Story ID | User Story | Size | Why |
| --- | --- | --: | --- |
| FW-11 | Find an exercise; recent first | 3 | Live search, combined filter, ordering, empty state; needs seeded library. |
| FW-12 | Create a custom exercise | 3 | Validation, uniqueness check, type lock. |
| FW-13 | Rename or archive a custom exercise | 3 | Rename must reach history; archive and restore states. |

**Total: 9 points.** **Why these sizes:** all three are 3: a few states and one or two rules over existing data. FW-13 is the riskiest because a rename must reach history and graphs. None is 5: no new flow or sync.

## 5.5 Browsing Workout History 1-pager

### PROBLEM

A month after a heavy leg day, Marcus wants to know what he squatted and how many sets he did. His notes are weeks of unstructured text, so he scrolls and settles for a guess. Tomás cannot read his own handwriting when he looks for last session, and small text on a phone makes it worse. Notes give no list of sessions and no way to follow one exercise.

### ASSUMPTIONS

- **A-HIS-1:** Finished workouts are kept until the user deletes them and listed by date, newest first.
- **A-HIS-2:** Calendar view, workout notes and sharing are not included.

### FUNCTIONAL REQUIREMENTS

**FW-14.** As **Tomás**, I want to see a list of my finished workouts with dates, exercises and number of sets, so that I can quickly check when and what I trained.

- Each row shows the date, up to three exercise names ("and N more") and the set count; older ones load on scroll; an empty history explains how to log.

**FW-15.** As **Marcus**, I want to open a past workout and see every exercise and set as recorded, so that I can plan a repeat or check what I did.

- Shows exercises in order, sets in the user's unit, date, duration (if recorded) and total volume.

**FW-16.** As **Marcus**, I want to see every time I performed one exercise, with the sets from each session, so that I can follow one lift in numbers.

- Reachable from the library and from a workout entry; newest first; archived exercises can still be viewed.

**FW-29.** As **Tomás**, I want to make the text larger, so that I can read my workouts and summaries without straining.

- A setting offers larger text sizes up to 200%; screens stay usable without losing content, and the choice is remembered.

### NON-FUNCTIONAL REQUIREMENTS

- **NFR-14 Readability** \[Assumption\]: text enlarged to 200% loses no content or function; summaries use plain labels and no abbreviations.
- **NFR-04 Performance** \[Proposed target\]: the first history screen appears within 3 seconds for about 1,000 workouts (roughly three years at five a week).
- **NFR-06 Privacy** \[Assumption\]: a user sees only their own workouts.

### REQUIREMENTS SIZING

| Story ID | User Story | Size | Why |
| --- | --- | --: | --- |
| FW-14 | List finished workouts | 3 | Paged list, row summary, empty state. |
| FW-15 | Open a past workout | 2 | Read-only screen over existing data. |
| FW-16 | History of one exercise | 3 | Cross-workout query and a new screen. |
| FW-29 | Larger text size | 3 | A setting that must reflow every screen; many states to check. |

**Total: 11 points.** **Why these sizes:** FW-15 is 2: one read-only screen. FW-29 is 3: one setting, but every screen must reflow at larger sizes. FW-14 and FW-16 are 3: each adds a list or query with an empty state. None is 5: nothing here writes or syncs data.

## 5.6 Correcting and Filtering History 1-pager

### PROBLEM

Elena noticed that last Tuesday's dumbbell press was saved as 300 kg instead of 30 kg, which ruins her totals, and her old app could not change a finished workout. Accidental sessions also clutter her history. Priya, with months of entries, wants to see just one period or one lift without scrolling.

### ASSUMPTIONS

- **A-HIS-3:** A finished workout can be edited, including its date (never to a future date).
- **A-HIS-4:** Deleting a workout is permanent after one confirmation; there is no recycle bin. **Requires Human Validation.**

### FUNCTIONAL REQUIREMENTS

**FW-17.** As **Elena**, I want to edit a finished workout, so that I can fix mistakes I notice later.

- Set values, sets and entries, and the date can change, with FW-02 and FW-03 validation; a workout cannot be edited to have no sets (delete it instead).

**FW-18.** As **Elena**, I want to delete a finished workout after confirming, so that accidental or test entries do not distort my history and graphs.

- The confirmation names the date and set count; the workout then disappears from history, previous performance and graphs.

**FW-19.** As **Priya**, I want to narrow my history to a date range or to one exercise, so that I can find a specific period or lift without scrolling.

- Date range and exercise can be combined and cleared; no matches shows a message.

### NON-FUNCTIONAL REQUIREMENTS

- **NFR-10 Data integrity** \[Derived, N8\]: after an edit or deletion, history, previous performance and graphs show the change when next viewed, with no manual refresh.
- **NFR-05 Reliability** \[Assumption\]: edits made offline follow the same upload rule as FW-09.

### REQUIREMENTS SIZING

| Story ID | User Story | Size | Why |
| --- | --- | --: | --- |
| FW-17 | Edit a finished workout | 5 | Reopens every logging rule; must keep other views consistent. |
| FW-18 | Delete a finished workout | 2 | Confirmation and removal; dependent views covered by NFR-10. |
| FW-19 | Filter history | 3 | Two filters, combined use, empty result. |

**Total: 10 points.** **Why these sizes:** FW-17 is 5: editing reopens every validation rule and must update other views. FW-18 is 2: one confirmation. FW-19 is 3: two filters and an empty state.

## 5.7 Volume Progress Graphs 1-pager

### PROBLEM

Marcus wants to know whether his squat volume has risen over three months. Today he copies numbers into a spreadsheet, multiplies weight by reps for every set and builds a chart, so he does it a few times a year. Priya wants to know if she does more overall than last month; Elena wants bodyweight progress in reps.

### ASSUMPTIONS

- **A-GRA-1:** Volume of a weight-and-reps exercise is weight times reps summed over its sets; for reps-only exercises the measure is total reps. *Why:* the vision says "volume" without defining it. **Requires Human Validation.**
- **A-GRA-2:** Duration exercises are recorded but not graphed; all sets count equally (no warm-up distinction). Impact is an open question (Section 8).
- **A-GRA-3:** A per-exercise graph has one point per workout; the overall graph has one point per calendar week of weight-based exercises. Periods: 4 weeks to all time.

### FUNCTIONAL REQUIREMENTS

**FW-20.** As **Marcus**, I want to see a graph of my total volume for one exercise over time, so that I can tell whether I am lifting more than before.

- One point per workout; axes show units and dates; fewer than two workouts shows a message.

**FW-21.** As **Marcus**, I want to choose the period shown on a graph, so that I can compare recent weeks with the longer trend.

- Periods as in A-GRA-3; changing it updates the graph and its text summary (all graphs).

**FW-22.** As **Priya**, I want to see my total volume per week across all weight-based exercises, so that I can tell whether I am training more overall.

- One value per calendar week, zero if empty; a sentence compares the latest two weeks.

**FW-23.** As **Elena**, I want to see my total reps per workout for a reps-only exercise, so that I can follow progress on bodyweight exercises.

- Same graph as FW-20; the vertical axis reads "Total reps".

**FW-24.** As **Marcus**, I want to select a point on a graph to see its date and value and open that workout, so that I can understand an unusually high or low session.

- Shows the value and opens the workout (FW-15); a weekly point lists its workouts.

### NON-FUNCTIONAL REQUIREMENTS

- **NFR-11 Accuracy** \[Derived, N5\]: every graphed value equals the value recomputed from the logged sets.
- **NFR-12 Accessibility** \[Assumption\]: no reliance on color alone; includes a text summary; legible at 360 px.
- **NFR-04 Performance** \[Proposed target\]: a graph appears within 3 seconds for about 1,000 workouts.

### REQUIREMENTS SIZING

| Story ID | User Story | Size | Why |
| --- | --- | --: | --- |
| FW-20 | Per-exercise volume graph | 5 | First chart: aggregation, axes, sparse data, accuracy tests. |
| FW-21 | Choose the period | 2 | One control over data the graphs use. |
| FW-22 | Overall weekly volume graph | 3 | Reuses chart; weekly grouping, zero weeks, comparison text. |
| FW-23 | Reps-only total reps graph | 2 | Same chart, different measure and label. |
| FW-24 | Select a point, open workout | 3 | Chart interaction and navigation; weekly variant. |

**Total: 15 points.** **Why these sizes:** FW-20 is 5: it builds the first chart and its aggregation. Reusing stories are smaller: FW-22 is 3 (weekly grouping), FW-23 is 2 (new measure). This assumes FW-20 is built first.

## 5.8 Repeatable Workouts 1-pager

### PROBLEM

Marcus trains a push, pull and legs split, so every Monday he enters the same six exercises before logging a set, and on busy days skips one. Priya follows a three-day plan and looks up that day's exercises each time. Elena repeats one short home routine. Notes apps start every session from a blank page.

### ASSUMPTIONS

- **A-TEM-1:** A template is a named, ordered list of exercises with no sets, weights or reps.
- **A-TEM-2:** A workout started from a template is an ordinary workout; earlier numbers come from FW-04.
- **A-TEM-3:** Template names are unique per user, ignoring case; an exercise archived later stays in the template, marked.

### FUNCTIONAL REQUIREMENTS

**FW-25.** As **Elena**, I want to save the exercises of a finished workout as a named template, so that I can start my usual routine again without re-entering it.

- Name 1 to 60 characters (proposed), unique; exercises saved in the order performed, without sets.

**FW-26.** As **Marcus**, I want to start a workout from a template, so that its exercises are already in the workout when I begin.

- Exercises appear in order with no sets; archived ones are marked and can be skipped; the template is unchanged.

**FW-27.** As **Priya**, I want to create and edit a template by choosing exercises myself, so that I can set up my plan at home before going to the gym.

- Name it, add exercises via FW-11 search, reorder, remove; finished workouts are unchanged.

**FW-28.** As **Marcus**, I want to delete a template, so that I can retire routines I no longer use.

- The confirmation names the template; finished workouts started from it are unchanged.

### NON-FUNCTIONAL REQUIREMENTS

- **NFR-13 Data integrity** \[Derived, N3 and N6\]: templates and finished workouts are independent; changing one never changes the other.
- **NFR-05 Reliability** \[Assumption\]: templates work offline, consistent with FW-09.
- **NFR-04 Performance** \[Proposed target\]: starting from a template shows the workout screen within 1 second.

### REQUIREMENTS SIZING

| Story ID | User Story | Size | Why |
| --- | --- | --: | --- |
| FW-25 | Save workout as template | 3 | New data type, naming rule, ordered copy. |
| FW-26 | Start workout from template | 3 | Reuses FW-01; archived-exercise states. |
| FW-27 | Create and edit a template | 5 | Small editor: name, add, reorder, remove across screens. |
| FW-28 | Delete a template | 2 | Confirmation and removal; independence from workouts. |

**Total: 13 points.** **Why these sizes:** FW-27 is 5: a small editor with four actions across screens. FW-25 and FW-26 are 3: a new data type or archived-exercise states. FW-28 is 2: one confirmation.

## 6. Overall Requirement Traceability Matrix

| Vision Need | Persona | Problem / Scenario | 1-Pager | Story IDs |
| --- | --- | --- | --- | --- |
| N1: Record sets quickly on a phone | Marcus, Priya, Elena, Tomás | Marcus's rest time lost to typing; Priya distracted between sets; Elena logs some sessions afterwards. Scenarios: Leg day; Day 2 workout. | 5.1 Logging; 5.2 Review and Finish; 5.3 Reliability | FW-01, FW-02, FW-03, FW-05, FW-06, FW-08 |
| N2: See previous performance | Priya, Marcus | Priya guesses her weights; Marcus scrolls old notes. | 5.2 Review and Finish; 5.5 Browsing History | FW-04, FW-15, FW-16 |
| N3: Keep exercise records consistent | Marcus, Priya, Elena | "bench" versus "Bench Press"; unknown names; exercises no list contains. | 5.4 Exercise Library (and 5.1) | FW-11, FW-12, FW-13, FW-03 |
| N4: Review past workouts | Tomás, Priya, Marcus | Reading last session without handwriting; recalling last month's leg day. | 5.5 Browsing History; 5.6 Correcting and Filtering | FW-14, FW-15, FW-16, FW-19 |
| N5: See training volume over time | Marcus, Priya, Elena | Manual spreadsheet charting; overall progress; bodyweight progress. | 5.7 Volume Progress Graphs | FW-20, FW-21, FW-22, FW-23, FW-24 |
| N6: Start familiar workouts without rebuilding them | Marcus, Priya, Elena | Re-entering six exercises each session; following a plan; rerunning one routine. Scenario: Home routine. | 5.8 Repeatable Workouts | FW-25, FW-26, FW-27, FW-28 |
| N7: Keep every logged set safe, including without a connection | Elena, Priya | Lost session; no signal in the basement; a call locks the phone. Scenario: Home routine. | 5.3 Reliability and Units | FW-07, FW-09 |
| N8: Correct mistakes | Elena, Marcus | 300 kg typed instead of 30 kg; a mistaken tap during a set. | 5.2 Review and Finish; 5.6 Correcting and Filtering | FW-05, FW-17, FW-18 |
| N9: Use the unit the user trains in | Priya | Her plan and gym machines are in kg. | 5.3 Reliability and Units | FW-10 |
| N10: Read and use the app comfortably | Tomás | Cannot read his notebook; small text. Scenario: Back at the gym. | 5.2 Review and Finish; 5.5 Browsing History | FW-06, FW-14, FW-29 |

**Stories per persona (lead actor).** Marcus 11 (FW-01, 02, 05, 13, 15, 16, 20, 21, 24, 26, 28); Priya 7 (FW-04, 07, 10, 11, 19, 22, 27); Elena 8 (FW-03, 08, 09, 12, 17, 18, 23, 25); Tomás 3 (FW-06, 14, 29). Total 29.

**Effort by 1-pager (story points).**

| 1-Pager | Stories | Points |
| --- | --: | --: |
| 5.1 Logging a Workout | 3 | 11 |
| 5.2 Reviewing and Finishing | 3 | 9 |
| 5.3 Reliability and Units | 4 | 15 |
| 5.4 Exercise Library | 3 | 9 |
| 5.5 Browsing History | 4 | 11 |
| 5.6 Correcting and Filtering | 3 | 10 |
| 5.7 Volume Progress Graphs | 5 | 15 |
| 5.8 Repeatable Workouts | 4 | 13 |
| **Total** | **29** | **93** |

**Chain check.** All ten needs lead to at least one story and each of the 29 stories appears in at least one row, so there are no orphan stories. Thin spots: N7 rests on FW-09, which depends on assumption A-REL-1; N2 depends on edits reaching previous performance (NFR-10). No story exists for sign-in or data export, by design.

## 7. Project Manager Quality Audit

**How length was measured.** The document was converted to a Word file (Calibri 11 pt, US Letter, 1-inch margins) and then to PDF, and each 1-pager's span was read from the page layout. The same method gave about 4.2 pages for the old Workout Logging 1-pager, which matches the roughly four pages you reported. Your own editor may differ slightly (**Requires Human Validation**).

| 1-Pager | Stories | Points | Measured length |
| --- | --: | --: | --: |
| 5.1 Logging a Workout | 3 | 11 | about 1.1 pages |
| 5.2 Reviewing and Finishing | 3 | 9 | about 1.1 pages |
| 5.3 Reliability and Units | 4 | 15 | about 1.3 pages |
| 5.4 Exercise Library | 3 | 9 | about 1.2 pages |
| 5.5 Browsing History | 4 | 11 | about 1.3 pages |
| 5.6 Correcting and Filtering | 3 | 10 | about 1.0 page |
| 5.7 Volume Progress Graphs | 5 | 15 | about 1.4 pages (the longest) |
| 5.8 Repeatable Workouts | 4 | 13 | about 1.2 pages |

**Checks.**

| Check | Result |
| --- | --- |
| Every 1-pager at most a page and a half | Yes, in the measured layout; the longest is 5.7 at about 1.4 pages. |
| Template followed (PROBLEM, ASSUMPTIONS, FUNCTIONAL, NON-FUNCTIONAL, SIZING) | Yes. Each has a short sizing rationale per story and a closing note on why the sizes were assigned. |
| Stories, IDs and sizes unchanged | FW-01 to FW-28 keep their IDs and sizes (90 points); FW-29 is new (3 points), total 93. FW-06 and FW-14 changed lead persona. |
| Every story traced to a persona and a vision need | Yes (Sections 4 and 6). |
| Four personas, each with a scenario and stories | Yes: Marcus 11, Priya 7, Elena 8, Tomás 3. Tomás is the thinnest. |
| Feature creep | None added. Sign-in, accounts, goals and sharing stay out of scope. |

**Issues found and fixed in this version.**

1. The previous version linked need N9 (units) to Marcus, but his scenario uses kilograms; N9 is now linked to Priya only.
2. Assumption IDs were renumbered where assumptions were merged (see Section 2); the fourth persona changed the story counts (see Section 2); references in Section 8 were updated.
3. Detail lines were reduced to one per story. Edge cases that used to be separate bullets (for example, the one-decimal weight rule and the confirmation text on delete) are now only in the story detail or were dropped. Restore them from the previous version if your instructor expects them.

**Remaining risks.** The offline story (FW-09, 8 points) is still the largest uncertainty. Numeric targets and limits are proposals. Sizes are initial estimates and have not been checked with a team. All items are in Section 8.

## 8. Open Questions / Human Validation

Decisions that need your judgment; items marked **Requires Human Validation** elsewhere are collected here.

### High Priority

1. **Offline logging (A-REL-1, FW-09).** Keep it in the prototype, or reduce it to saving on the device only? Dropping full synchronization removes the largest story and changes NFR-05.
2. **Sign-in and accounts (A-LOG-3).** Does the prototype need accounts, or only storage on one phone? This changes FW-09, NFR-05 and NFR-06.
3. **Definition of volume (A-GRA-1, A-GRA-2).** Is weight times reps, counting all sets equally, acceptable for your class?
4. **Proto-persona validation.** Chapter 3 says personas built on little information are weaker; a short informal chat with two or three gym-goers would let you confirm or change Marcus, Priya and Elena. Record what you did in your write-up.
5. **Page length.** Section 7 reports page counts from a rendered PDF. Re-check in your own export; 5.7 has the least margin.

### Medium Priority

6. **Platform (NFR-07).** Native mobile app or mobile web? The vision does not decide.
7. **Permanent deletion (A-HIS-4).** Is it acceptable that a deleted workout cannot be recovered?
8. **Two-device conflicts (A-REL-4).** Decide a rule, or state that only one device per account is supported.
9. **Numeric targets.** Review NFR-02 (3 taps), NFR-04 (1 s and 3 s, 1,000 workouts) and the proposed limits (weight and reps ranges, 60-character names, 10 recent exercises).
10. **Story sizes.** Adjust after discussing with your teammates; a shared estimation round gives more defensible numbers.

### Low Priority

11. **Scenario count.** Add more scenarios per persona if your instructor expects the chapter's three or four.
12. **Small design choices.** Week starting Monday and the listed graph periods (A-GRA-3), and the muscle-group filter (A-EX-2).
13. **Format fit.** Confirm the 1-pager format matches your instructor's rubric; I have not seen it.

## 9. Comparison Pending

This Claude version has been reviewed and refined three times and is ready to be compared with the independently generated version from the second AI model. No comparison has been made here, and nothing in this document relies on or describes the other model's output.

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
