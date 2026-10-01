# FitTrack — Fitness & Workout Log App

Final ChatGPT specification for Project Milestone 1
Date: September 30, 2026

## Product vision

**FOR** beginner and intermediate strength-training participants
**WHO** need a convenient way to record workouts and understand their progress,
**THE** FitTrack application **IS A** mobile-first workout log
**THAT** lets users record daily workouts and exercise sets, review previous sessions, and see historical training volume so they can make informed decisions about their next workout.
**UNLIKE** keeping workout notes in a notebook or general-purpose notes application,
**OUR PRODUCT** connects structured workout records with exercise-specific history and volume graphs, reducing the effort needed to compare performance over time.

Individual exercisers are the intended users and assumed potential customers. Their reason to adopt FitTrack is convenient logging during workouts and clear access to previous performance afterward. Pricing and willingness to pay have not been validated. The comparison describes a manual alternative, not verified superiority over existing commercial applications.

## Scope and specification basis

The prototype covers recorded strength-training sessions, set entry and correction, exercise-specific history, and historical volume graphs. It serves users with different training experience and technical confidence. MealMap is a separate product idea; nutrition estimates and automatic data exchange are outside this specification.

The vision follows Ian Sommerville, Engineering Software Products, Chapter 1, section 1.1 (supplied PDF pages 25–29). Personas and scenarios follow Chapter 3, sections 3.1–3.2 (PDF pages 97–107). User stories use the assignment's required persona/task/benefit format. Four accompanying 1-pagers group the requirements by initiative rather than treating every persona as a separate product.

## Personas

These four fictional proto-personas are based on user suggestions and team assumptions, not interviews. Sebastian and Pepito's names, ages, and broad experience were supplied by the user; all other details are proposed portraits. Sebastian does not establish facts about the student sharing his name.

## Sebastian — 21, a recreational lifter with some experience

Sebastian is a 21-year-old university student who has been weightlifting for about two years. He usually trains three or four times a week, fitting gym visits around classes and assignments. He understands common exercises, sets, repetitions, and training volume, and follows a routine he already knows. However, when his schedule changes, he sometimes misses sessions or changes the order of exercises, making it difficult to compare one week with another.

Sebastian is comfortable using smartphone applications, university software, and spreadsheets, but does not want to maintain a spreadsheet during a workout. He currently records weights and repetitions in his phone's notes application. These notes are inconsistent: some entries omit a set, and others use different exercise names. Before repeating an exercise, he often scrolls through several entries to find his previous performance. He would stop using a tracker if recording each set involved too many screens or interrupted his workout.

FitTrack would be useful to Sebastian because it could keep each session's exercises and sets in a consistent format, let him correct recording mistakes, and make his previous exercise records easy to find. He would use exercise-specific history and volume graphs to compare his logged training over time rather than manually calculate totals. He is also interested in meal planning that supports his fitness routine, making him a potential adult user of MealMap; that interest does not assume the products already exchange data.

## Pepito — 15, a beginner who needs a structured record

Pepito is a 15-year-old high-school student who recently started weightlifting. He visits the gym twice a week with an older family member and follows a simple routine explained by a qualified instructor. He is still learning exercise names and the difference between sets and repetitions. Without a consistent record, he sometimes forgets which exercises he completed or what weight he used in his previous session.

Pepito uses a smartphone regularly for messaging, schoolwork, and videos, but has never used a workout tracker. Familiarity with phone applications does not mean he understands training terminology or volume graphs. He currently relies on memory and occasional notes, which makes it hard to describe his workouts when his instructor asks. A screen filled with unexplained metrics would confuse him, and being asked to create a training program from scratch would be a barrier to getting started.

FitTrack would be useful to Pepito as a clear, structured place to record the exercises, weights, repetitions, and sets from the routine he has already been given. He would benefit from plain labels, brief explanations of logging terms, and an easy way to review earlier sessions. His initial use would focus on remembering what he did and building a consistent logging habit; the application would record his training rather than prescribe exercise technique, a new routine, or automatic weight increases.

## Valeria — 29, a recreational lifter with an unpredictable schedule

Valeria is a 29-year-old nurse with a university degree who has been lifting weights for about a year. Her rotating shifts mean that she cannot always train on the same days or spend the same amount of time at the gym. She follows a familiar routine, but sometimes completes only part of a session or substitutes an exercise when equipment is unavailable. A fixed weekly schedule does not accurately describe what she actually manages to do.

Valeria is comfortable using smartphone applications and digital systems at work. She currently checks off gym visits on a calendar and occasionally writes down exercise details, but those records do not distinguish a full workout from a shortened one. When looking back, she has difficulty remembering which sets she completed and whether a change in weekly volume reflects fewer sessions or different exercises. She needs recording to remain practical even when her workout differs from what she intended.

FitTrack would be useful to Valeria because she could record the exercises and sets she actually completed, keep shortened sessions in her history, and review activity over a selected period. She would use dated workout records and volume graphs to understand patterns around her changing schedule. Her interest is in an accurate record of her own training, so an application that treats a missed calendar day as a failed workout would not fit her circumstances.

## Carlos — 46, a returning lifter who prefers simple tools

Carlos is a 46-year-old office administrator with vocational training who recently returned to weightlifting after several years away. He previously trained recreationally and remembers basic exercise terminology, but considers himself a beginner again when it comes to establishing a consistent routine. He attends the gym two or three times a week and follows a routine provided by an instructor. He records his sessions in a small notebook so he can remember what he did before his next visit.

Carlos uses email, messaging, and office software comfortably, but rarely installs new phone applications and has little experience interpreting fitness dashboards. His handwritten entries sometimes become difficult to read, and finding the last record of a particular exercise means flipping through several pages. He is willing to try a phone-based log if the text is readable, the controls are clearly labeled, and he can find his saved workouts without navigating several menus. Dense graphs and unexplained abbreviations would make the application feel harder than his notebook.

FitTrack would be useful to Carlos as an organized replacement for his paper records. He would primarily enter weights, repetitions, and sets, then review a straightforward summary of his previous session before starting another. As he becomes comfortable with the application, he might use clearly explained volume graphs alongside the underlying records. His experience helps the team consider users who understand the workout itself but need a simpler introduction to the digital tracking tools.

## Traceability and accompanying 1-pagers

| Initiative | Scenario basis | Principal personas | Story IDs |
| --- | --- | --- | --- |
| [Workout recording](01_WORKOUT_RECORDING.md) | FT-SC-01 and FT-SC-02 | Sebastian, Pepito | FT-01–FT-03 |
| [Record review and correction](02_REVIEW_AND_CORRECTION.md) | FT-SC-01 and FT-SC-04 | Carlos, Sebastian | FT-04–FT-06 |
| [Flexible sessions and history](03_FLEXIBLE_SESSIONS_AND_HISTORY.md) | FT-SC-03 | Valeria | FT-07–FT-09 |
| [Training volume and progress](04_VOLUME_AND_PROGRESS.md) | FT-SC-01 and FT-SC-03 | Sebastian, Valeria, Carlos | FT-10–FT-12 |

Together these initiatives cover logging daily workouts and exercise sets, reviewing history, and viewing historical volume graphs. Beginner-friendly terminology and readable summaries support Pepito and Carlos across those features.

## Effort estimation protocol

All 1-pagers use **story points** on the scale **1, 2, 3, 5, 8**. Points represent relative effort, complexity, and uncertainty; they are not hours or a delivery promise. Initial estimates assume a small student team building one responsive application with a conventional persistence layer and a seeded exercise catalog. Infrastructure work must be considered separately in milestone planning; it is not silently counted as zero.

The reference story is FT-06 (remove one confirmed duplicate set), sized at 2 points: a bounded change to an existing record with confirmation and refreshed totals. A 1-point story is simpler presentation work; 3 points covers moderate validation or retrieval; 5 points covers several related operations; 8 points indicates substantial integration or uncertainty and should be considered for splitting. Shared recording and persistence work is counted in FT-02/FT-03, not charged again in each later story.

Before implementation, each team member estimates each story independently, reveals their estimate simultaneously, and explains differences against the reference story. The team discusses unknowns, re-estimates, and records the agreed value and rationale. The values here are AI-proposed initial estimates; no team estimation meeting has occurred. Re-estimate when assumptions or scope change, retaining the prior value and explanation.

| Initiative | Initial story points |
| --- | ---: |
| Workout recording | 13 |
| Record review and correction | 8 |
| Flexible sessions and history | 8 |
| Training volume and progress | 13 |
| **Total** | **42** |

The total is a backlog estimate, not a schedule. No sprint velocity has been measured.

## AI interaction evidence and review

[PROMPT_LOG.md](../../PROMPT_LOG.md) records the prompts and response summaries. Earlier visions, personas, and scenarios remain as draft evidence. User feedback supplied the initial persona concepts, clarified that four were required, and approved the scenarios. A later review requested high-level nonfunctional requirements and shorter 1-pagers; the current version reflects that correction.

ChatGPT initially provided only two workout personas. The revised set adds distinct scheduling and technology needs. Iteration connected those portraits to scenarios and stories. Remaining limitations include fictional circumstances, no customer testing, and initial estimates requiring team review.

This is the ChatGPT workout specification. Both Claude versions are now in the final folder. The combined prompt log pairs all four versions for a comparison that accounts for different scope choices.

## Student Evaluation of ChatGPT

Reviewer: Sebastian. The following comments reflect his supplied feedback, edited for clarity.

- **What worked well, with an example:** ChatGPT understood the project requirements, kept a prompt log in the repository, and worked through product decisions with me. We developed the vision, personas, scenarios, and final requirements step by step, preserving the drafts as we went.
- **What needed correction or was missing:** I had to clarify that we needed four personas per product. The first workout persona draft included only two, and ChatGPT added the other two after my correction.
- **Which prompt or feedback improved the output, and how:** I believe the starting instructions were the most useful: the project description, what I needed to produce, and the book references I supplied afterward. Those inputs established the expectations for the work. My later feedback helped refine individual decisions, including the required number of personas.
- **Were the vision, personas, scenarios, and stories consistent?** Yes. I found the documents consistent, and the later requirements followed the direction we had developed together.
- **Were the assumptions, nonfunctional requirements, and sizes justified?** I liked the assumptions, and the nonfunctional requirements and story sizes made sense to me.
- **Overall judgment and remaining concerns:** I believe ChatGPT was a great option for this project. Its main strength was understanding the requirements and iterating with me on the decisions we needed to make. The persona count was the correction I identified.
