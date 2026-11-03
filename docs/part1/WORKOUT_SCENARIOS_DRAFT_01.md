# Fitness & Workout Log App — Scenarios, Draft 01

Date: September 30, 2026
AI model: ChatGPT (OpenAI)
Vision reference: PRODUCT_VISIONS_DRAFT_02.md, Fitness & Workout Log App.
Persona reference: WORKOUT_PERSONAS_DRAFT_02.md.
Prompt reference: PROMPT_LOG.md, prompt 10.

## Basis and status

These fictional scenarios follow Ian Sommerville's Engineering Software Products, Chapter 3, section 3.2 (PDF pages 105–107). Each describes a particular situation, the persona's problem, an activity using the proposed product, and its outcome. They provide narrative material for later 1-pagers; they do not replace the assumptions, functional requirements, nonfunctional requirements, or sizing those documents need.

## FT-SC-01 — Sebastian records a workout and compares his progress

Sebastian arrives at the gym for a chest workout between classes. He wants to review his previous bench-press performance before starting, but his old phone notes contain inconsistent exercise names and incomplete set records. He opens FitTrack, selects the bench-press exercise, and finds the weights and repetitions recorded during his previous session. Using that record as a reference, he follows his existing routine and logs the weight and repetitions after each completed set. Before saving the session, he notices that he entered one weight incorrectly and corrects it.

At the end of the week, Sebastian reviews the bench-press volume graph for the past month and opens the records behind it. He sees that a week with higher recorded volume also included an additional bench-press session, so he avoids assuming that the graph alone means he performed better in each workout. The consistent exercise history helps him compare his training without searching through scattered notes or calculating every total himself.

## FT-SC-02 — Pepito records an instructor-provided routine

Pepito goes to the gym with an older family member for one of his first weightlifting sessions. His instructor has already explained a simple routine, but Pepito finds it difficult to remember which sets he has completed and is unsure how to record them. He opens FitTrack and selects the exercise named in his routine. When he encounters the repetitions and sets terminology, he reads a brief explanation of the logging fields. After completing each set under the instructor's guidance, he enters the repetitions and weight he actually used. He repeats this for the remaining exercises and checks the session summary before saving it.

At his next gym visit, Pepito opens that saved session and can tell his instructor exactly what he recorded instead of trying to remember it. His instructor remains responsible for explaining the routine and any changes to it. FitTrack gives Pepito a structured record that he can understand and revisit without requiring him to design a training program or interpret advanced graphs before he can start logging.

## FT-SC-03 — Valeria keeps an accurate record of a shortened workout

Valeria has time for a short gym visit before a nursing shift. She intends to follow her usual routine, but a piece of equipment is occupied and she has less time than expected. She performs an alternative exercise she already knows and leaves before completing the rest of the routine. Her existing calendar would only show that she visited the gym, hiding the difference between this session and a full workout. In FitTrack, she records the exercises and sets she actually completed and saves the shortened session without having to enter exercises she did not perform.

After two weeks of rotating shifts, Valeria reviews her dated workout history and volume graphs for that period. She opens the shortened session when comparing it with her other workouts, which helps her understand why her recorded volume varies. The log represents her actual activity even though her sessions happen on different days and do not always follow the same sequence. She uses that information to organize her next gym visit around her schedule.

## FT-SC-04 — Carlos reviews and corrects a session using a simple summary

Carlos arrives at the gym with the routine his instructor provided. Before starting, he wants to check his last session, but the handwriting in his notebook is difficult to read. Having started using FitTrack at his previous visit, he opens the dated workout history and selects that session. A readable summary lists the exercises, weights, repetitions, and sets, allowing him to find the information he needs without interpreting a graph. He follows his routine and uses the clearly labeled entry fields to record today's completed sets.

When Carlos reviews the session before saving it, he notices that he recorded the same set twice. He removes the duplicate and checks that the summary now matches the workout he completed. At his next visit, the corrected record is available in his history. The straightforward summary and ability to fix mistakes make the digital log practical for him while he becomes more comfortable with the application.

## Assumptions to carry into the 1-pagers

- All four scenarios assume the user can access their own workout records; account access and privacy details remain to be specified.
- Exercises have consistent identifiers or names so records for the same exercise can be retrieved and compared.
- Users record completed sets, including weight and repetitions, and can correct or remove mistaken entries.
- A session can be saved with only the exercises actually performed; no fixed schedule or complete predefined routine is required.
- Graphs summarize recorded training volume and allow the user to consult the underlying records. The precise volume definition, supported exercise types, units, and date grouping require later specification.
- Instructors and existing routines are external context. Instructor accounts, automatic coaching, and nutrition integration are not assumed by these scenarios.

## Coverage for later requirements

| Scenario | Persona | Main requirements it motivates |
| --- | --- | --- |
| FT-SC-01 | Sebastian | Exercise history, set logging, editing, volume graphs, access to underlying records |
| FT-SC-02 | Pepito | Plain logging terminology, structured set entry, session review |
| FT-SC-03 | Valeria | Flexible session contents, dated history, period-based volume review |
| FT-SC-04 | Carlos | Readable summaries, simple navigation, removal of duplicate entries |

Several scenarios share features. Later 1-pagers can group related requirements rather than assuming a separate feature document is needed for every persona. Preserve this initial draft when revising the scenarios.
