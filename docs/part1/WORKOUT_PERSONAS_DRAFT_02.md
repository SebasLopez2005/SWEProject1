# Fitness & Workout Log App — Personas, Draft 02

Date: September 30, 2026
AI model: ChatGPT (OpenAI)
Vision reference: PRODUCT_VISIONS_DRAFT_02.md, Fitness & Workout Log App.
Prompt reference: PROMPT_LOG.md, prompts 7–8.

## Basis and status

These are proto-personas: fictional portraits based on the user's suggestions and the product vision, rather than verified user research. Sebastian and Pepito’s names, ages, and broad weightlifting experience levels were supplied by the user. Valeria and Carlos, and all remaining details, are fictional assumptions for team review. Sebastian is a fictional persona, not a claim about the student's personal circumstances.

Following Ian Sommerville's Engineering Software Products, Chapter 3, section 3.1 (PDF pages 97–104), each portrait describes personal circumstances, education and technical experience, and why the product would be useful. Four personas cover beginners, recreational lifters with experience, users with variable training schedules, and returning lifters with limited interest in technology. Draft 01 is preserved; this revision adds Valeria and Carlos in response to the requirement for four personas per product.

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

## Implications for later requirements

Sebastian motivates efficient set entry, consistent exercise identification, editable records, exercise history, and volume comparisons. Pepito motivates understandable terminology and a clear recording flow that works without advanced training knowledge. Valeria motivates flexible records of completed sessions and date-based history rather than assumptions about fixed schedules. Carlos motivates readable controls, plain summaries, and graphs that do not replace access to the underlying records. All four need the same core workout log; these personas do not establish a need for a coaching platform or automatically generated training programs.

Pepito fits the workout vision's beginner audience, which did not specify an adult age restriction. MealMap's current estimates and nutrition-target scope, however, is for adults. Pepito's inclusion here does not extend adult BMI interpretation or calorie and macro estimates to a 15-year-old. Any future shared account or nutrition integration needs to respect that scope difference.

## Items to validate with the team or potential users

- Whether Sebastian's existing routine and logging frustrations reflect the intended experienced users.
- Whether Pepito's instructor-provided routine and terminology difficulties reflect intended beginners.
- Whether Valeria’s variable schedule and Carlos’s preference for simple tools reflect additional intended users.
- Whether all four users can find their previous exercise records and record a session without unnecessary effort.

Preserve this draft when revising the personas. Later scenarios and stories should reference these names so their connection to the user types remains clear.
