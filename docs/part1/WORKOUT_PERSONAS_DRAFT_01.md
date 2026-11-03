# Fitness & Workout Log App — Personas, Draft 01

Date: September 30, 2026
AI model: ChatGPT (OpenAI)
Vision reference: PRODUCT_VISIONS_DRAFT_02.md, Fitness & Workout Log App.
Prompt reference: PROMPT_LOG.md, prompt 7.

## Basis and status

These are proto-personas: fictional portraits based on the user's suggestions and the product vision, rather than verified user research. Names, ages, and broad weightlifting experience levels were supplied by the user; the remaining details are draft assumptions for team review. Sebastian is a fictional persona, not a claim about the student's personal circumstances.

Following Ian Sommerville's Engineering Software Products, Chapter 3, section 3.1 (PDF pages 97–104), each portrait describes personal circumstances, education and technical experience, and why the product would be useful. Two personas cover the initial distinction between a beginner who needs understandable structure and a more experienced lifter who needs efficient records and progress comparisons.

## Sebastian — 21, a recreational lifter with some experience

Sebastian is a 21-year-old university student who has been weightlifting for about two years. He usually trains three or four times a week, fitting gym visits around classes and assignments. He understands common exercises, sets, repetitions, and training volume, and follows a routine he already knows. However, when his schedule changes, he sometimes misses sessions or changes the order of exercises, making it difficult to compare one week with another.

Sebastian is comfortable using smartphone applications, university software, and spreadsheets, but does not want to maintain a spreadsheet during a workout. He currently records weights and repetitions in his phone's notes application. These notes are inconsistent: some entries omit a set, and others use different exercise names. Before repeating an exercise, he often scrolls through several entries to find his previous performance. He would stop using a tracker if recording each set involved too many screens or interrupted his workout.

FitTrack would be useful to Sebastian because it could keep each session's exercises and sets in a consistent format, let him correct recording mistakes, and make his previous exercise records easy to find. He would use exercise-specific history and volume graphs to compare his logged training over time rather than manually calculate totals. He is also interested in meal planning that supports his fitness routine, making him a potential adult user of MealMap; that interest does not assume the products already exchange data.

## Pepito — 15, a beginner who needs a structured record

Pepito is a 15-year-old high-school student who recently started weightlifting. He visits the gym twice a week with an older family member and follows a simple routine explained by a qualified instructor. He is still learning exercise names and the difference between sets and repetitions. Without a consistent record, he sometimes forgets which exercises he completed or what weight he used in his previous session.

Pepito uses a smartphone regularly for messaging, schoolwork, and videos, but has never used a workout tracker. Familiarity with phone applications does not mean he understands training terminology or volume graphs. He currently relies on memory and occasional notes, which makes it hard to describe his workouts when his instructor asks. A screen filled with unexplained metrics would confuse him, and being asked to create a training program from scratch would be a barrier to getting started.

FitTrack would be useful to Pepito as a clear, structured place to record the exercises, weights, repetitions, and sets from the routine he has already been given. He would benefit from plain labels, brief explanations of logging terms, and an easy way to review earlier sessions. His initial use would focus on remembering what he did and building a consistent logging habit; the application would record his training rather than prescribe exercise technique, a new routine, or automatic weight increases.

## Implications for later requirements

Sebastian motivates efficient set entry, consistent exercise identification, editable records, exercise history, and volume comparisons. Pepito motivates understandable terminology and a clear recording flow that works without advanced training knowledge. Both need the same core workout log; neither persona establishes a need for a coaching platform or automatically generated training programs.

Pepito fits the workout vision's beginner audience, which did not specify an adult age restriction. MealMap's current estimates and nutrition-target scope, however, is for adults. Pepito's inclusion here does not extend adult BMI interpretation or calorie and macro estimates to a 15-year-old. Any future shared account or nutrition integration needs to respect that scope difference.

## Items to validate with the team or potential users

- Whether Sebastian's existing routine and logging frustrations reflect the intended experienced users.
- Whether Pepito's instructor-provided routine and terminology difficulties reflect intended beginners.
- Whether both users can find their previous exercise records and record a session without unnecessary effort.

Preserve this draft when revising the personas. Later scenarios and stories should reference these names so their connection to the user types remains clear.
