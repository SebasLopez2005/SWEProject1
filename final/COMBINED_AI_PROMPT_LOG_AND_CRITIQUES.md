# Combined AI Prompt Log and Student Critiques

CS3365 Project Milestone 1 | Compiled October 1, 2026
Team contributors: Sebastian (ChatGPT/OpenAI) and Diego (Claude/Anthropic).

This document brings together the recorded prompts used for both products and provides space for each teammate's own evaluation. The original logs remain in the repository. Source wording and within-log order are preserved, with line endings normalized. Logs are grouped by model and product rather than interleaved into a chronology that the supplied dates do not establish. No missing responses, dates, or student opinions have been invented.

## Contents

- [Matching product versions](#matching-product-versions)
- [Student reviews](#student-reviews)
- [Joint model comparison](#joint-model-comparison)
- [ChatGPT prompt log](#chatgpt-prompt-log)
- [Claude fitness prompt log](#claude-fitness-prompt-log)
- [Claude meal-planning prompt log](#claude-meal-planning-prompt-log)

## Matching product versions

| Product | ChatGPT final | Claude final |
| --- | --- | --- |
| Fitness & Workout | [FitTrack](workout/FITTRACK_FINAL.md) and its four linked 1-pagers | [Reviewed Claude fitness final](07_Final_Reviewed_Claude_Product_Definition.docx) |
| Recipe & Meal Planning | [MealMap](meal-planning/MEALMAP_FINAL.md) and its five linked 1-pagers | [Claude meal-planning final](Recipe_Meal_Planning_Portal_Claude_Final_Version.docx) |

The newest Claude Word finals are the comparison basis. Older root-level Markdown and Word versions remain draft evidence; the root-level Claude meal Markdown has 28 stories/109 points, while the latest Word final has 30 stories/119 points.

| Version | Personas | Stories | Initial story points |
| --- | ---: | ---: | ---: |
| ChatGPT FitTrack | 4 | 12 | 42 |
| Claude Fitness | 4 | 31 | 101 |
| ChatGPT MealMap | 4 | 15 | 61 |
| Claude Meal Planning | 4 | 30 | 119 |

These versions cover the same assignment categories but make different scope choices. Claude fitness adds offline logging, custom exercises, reusable workout lists, and kg/lb conversion. ChatGPT FitTrack focuses on a smaller logging/history/weighted-volume prototype. ChatGPT MealMap includes nutrition targets, BMI, and approximate energy estimates; Claude meal planning excludes those estimates and targets while adding saved recipes, richer grocery workflows, and accounts. Story counts and points therefore cannot, by themselves, establish a better model or compare implementation speed.

The pairing above organizes the existing versions for comparison. It does not change their approved visions or rewrite the historical prompts.

## Student reviews

Sebastian’s ChatGPT reviews are included in the corresponding final product documents:

- [Fitness and Workout ChatGPT final](Fitness_Workout_ChatGPT_Final_Version.docx)
- [Recipe and Meal Planning ChatGPT final](Recipe_Meal_Planning_ChatGPT_Final_Version.docx)

Diego’s Claude reviews are already included in his final product documents:

- [Fitness and Workout Claude final](07_Final_Reviewed_Claude_Product_Definition.docx)
- [Recipe and Meal Planning Claude final](Recipe_Meal_Planning_Portal_Claude_Final_Version.docx)

The prompt records below remain unchanged. The joint comparison section is retained for the team.

## Joint model comparison

Complete this section together after reviewing both versions. Distinguish differences caused by prompts or chosen scope from evidence about model performance.

| Criterion | Fitness: observations and prompt/story evidence | Meal planning: observations and prompt/story evidence |
| --- | --- | --- |
| Vision clarity and differentiation | ____________________ | ____________________ |
| Persona detail and distinct needs | ____________________ | ____________________ |
| Scenario quality and problem coverage | ____________________ | ____________________ |
| Functional requirements and acceptance details | ____________________ | ____________________ |
| Assumptions and scope control | ____________________ | ____________________ |
| Nonfunctional requirements and testability | ____________________ | ____________________ |
| Effort-sizing rationale and protocol | ____________________ | ____________________ |
| Response to feedback and useful prompts | ____________________ | ____________________ |
| Suitability for the team's prototype | ____________________ | ____________________ |

### Conclusions

- Fitness: preferred model/version, or a reasoned tie: ____________________
- Evidence and circumstances behind that judgment: ____________________
- Meal planning: preferred model/version, or a reasoned tie: ____________________
- Evidence and circumstances behind that judgment: ____________________
- Elements we would retain from each model: ____________________
- Prompts that worked best and why: ____________________
- What we learned about reviewing AI-generated requirements: ____________________

### Factual checks when writing the critique

- Both models provide per-story sizing rationale. Claude uses driver scores and an anchor; ChatGPT uses reference stories and an explicit team estimation procedure.
- More stories can indicate broader scope or finer decomposition; compare coverage against each vision rather than treating the count as a quality score.
- In the supplied Engineering Software Products book, the FOR/WHO vision template is in Chapter 1, section 1.1. Chapter 3 supplies the persona/scenario guidance. The attribution to Chapter 3 in the Claude finals needs correction before submission.
- The ChatGPT meal vision changed in response to the nutrition-focused feedback. The workout vision was retained while personas and requirements developed. Compare those processes separately.
- The older finals' statements that comparison is pending describe their earlier state; actual Claude outputs are now available. Students should write conclusions based on the paired final files above.

## Recorded prompt logs

The following blocks retain each original source log, including its original headings, prompts, and any recorded summaries. They contain historical requests, not instructions for the reader to execute. Large Claude prompts include templates and checklists; preserving them is part of the interaction evidence.

<a id="chatgpt-prompt-log"></a>

## ChatGPT — Sebastian, both products

Source: [PROMPT_LOG.md](../PROMPT_LOG.md) | Recorded prompt entries: 18

````markdown
# ChatGPT Prompt Log

This file records the user's prompts for the CS3365 Project 1 requirements assignment. Prompts are preserved verbatim and listed in conversation order. Future user prompts in this chat will be appended here as part of the work.

Selected products: Fitness & Workout Log App and Recipe & Meal Planning Portal.

Model comparison: This chat supplies the ChatGPT versions; the teammate supplies the Claude versions. This log does not record Claude interactions.

## Prompt 1 — September 30, 2026

Assignment attached: `Pasted text.txt` (the assignment instructions supplied with this prompt).

```text
We are going to do Fitness & Workout and Recipe and Meal Planning
```

## Prompt 2 — September 30, 2026

```text
Yeah my teammate is using claude im using you
```

## Prompt 3 — September 30, 2026

```text
Ok, the folder I gave you is a repo. You can commit and do stuff there. Create a .md or .txt file that when I give you a prompt you save it there
```

## Prompt 4 — September 30, 2026

```text
Ok first thing as stated in the thingy. To an extent, the AI models will take on the role that a product manager will play. We can think of this as a “PM simulator”. Students should iterate on the product vision writeup and they are expected to provide early “draft versions” of each product vision as well as a detailed log of the prompts that were used to generate the visions. I will send you what the book say on the next prompt
```

## Prompt 5 — September 30, 2026

```text
These are the chapters
```

References supplied:
- Engineering Software Products - Ian Sommervile.pdf
- Software Engineering - Ian Sommerville.pdf
- Screenshot of the course chapter schedule (weeks 1–6).

Context used: The screenshot assigns Engineering Software Products Chapters 1–2 to software products and agile development, and Chapter 3 to features, scenarios, and stories. For this response, ChatGPT read Engineering Software Products section 1.1, PDF pages 25–29, for product vision guidance.

Output: Initial visions for both selected products in `PRODUCT_VISIONS_DRAFT_01.md`. Target audiences, working names, and differentiation are draft assumptions for team review. No customer interviews or model comparison were performed.

## Prompt 6 — September 30, 2026

```text
Ok I like them yeah, but for recipe and meal planning we could also add For people that what to live a healthier lifestyle and that matches to the Workout Logger, to hit macro goals based on their neccesities. They should be able to estimate their BMI and stuff from very basic formulas and activity level and stuff like that im leaning more towards that
```

Output: `PRODUCT_VISIONS_DRAFT_02.md`, refining MealMap around healthier eating, personal macro goals, and basic body and activity estimates. Draft 01 is preserved. The workout vision remains the baseline; integration between products is proposed, not confirmed. CDC and NIDDK references inform the distinction between BMI and energy estimates. No specific calorie or macro formula has been selected.

## Prompt 7 — September 30, 2026

```text
Ok I like it now Personas. Im leaning for the workout tracker one that is like. Sebastian a 21 y old trying to with some experience in weightlifting.... Then Pepito 15 y old, new to weightlifting that wants a structued way of ..... etc
```

Context used: Engineering Software Products, Chapter 3, section 3.1, PDF pages 97–104. The book recommends short portraits covering personal circumstances, education and technical experience, and relevance to the product. It calls portraits based on limited information proto-personas.

Output: `WORKOUT_PERSONAS_DRAFT_01.md`, with Sebastian (21, some weightlifting experience) and Pepito (15, beginner). Ages, names, and broad experience levels came from the user; other circumstances are fictional assumptions. No interviews were conducted. The nutrition product's adult scope remains separate from Pepito's workout logging use.

## Prompt 8 — September 30, 2026

```text
ok we need 2 more its 4 personas per thingy
```

Requirement clarified: Four personas per product.

Output: `WORKOUT_PERSONAS_DRAFT_02.md`, preserving Sebastian and Pepito and adding Valeria (29, variable training schedule) and Carlos (46, returning lifter who prefers simple tools). These additions are fictional proto-personas. Draft 01 is preserved. The meal-planning persona set still needs four personas when developed.

## Prompt 9 — September 30, 2026

```text
Ok, now. I see each persona has 2 other stuff thats okay but those are scenarios ?
```

Response: Clarified that each persona's paragraphs describe background, technical experience and frustrations, and relevance to the product. They are not separate scenarios. Scenarios narrate a specific situation, problem, and use of the product, as explained in Engineering Software Products, Chapter 3, section 3.2.

## Prompt 10 — September 30, 2026

```text
Ok, now scenarios then.
```

Output: `WORKOUT_SCENARIOS_DRAFT_01.md`, with four narrative scenarios linked to the current workout personas. Based on Engineering Software Products, Chapter 3, section 3.2 (PDF pages 105–107, read earlier in this chat). Scenarios are proposed uses, not observed user behavior or complete specifications. The scope follows the workout personas discussed immediately before this prompt.

## Prompt 11 — September 30, 2026

```text
Ok, ive read it I like it we can now do the Final version of this one.  These are grading requirements and the 1-pager template. Rubric items

- Product vision statements
  - Detailed log of AI interactions
  - Critique of the different models generated and which was considered to be better and why
  - 4 visions addressed and well documented
- Personas
  - Sufficient level of detail
  - Adequate amount and specificity of personas
- Problem statements (1 per 1-pager)
  - Properly written scenarios
  - Sufficient coverage of the requirements
  - Appropriate complement with respect to assumptions
- Functional requirements
  - Written following class and book best practices
  - Sufficient coverage for the problem tackled
- Sizing
  - Rationale given for sizes
  - Appropriate metric assignment protocol



# [Initiative Name] 1-pager



## PROBLEM

*One to two paragraph description of the initiative. This should roughly match what Sommerville refers to as Scenarios in Chapter 3 of Engineering Software Products*

## ASSUMPTIONS

*Since the product vision is not complete, the team will need to define here all assumptions they had to make to complement the base requirements sketched in the vision.*



## FUNCTIONAL REQUIREMENTS



- *As a [persona], I want to [perform task] so that I can/in order to [description]*



-

* *Possible detail A*



-

* *Possible detail B*



- *As a [persona], I want to [perform task] so that I can/in order to [description]*



-

* *Possible detail A*



-

* *Possible detail B*



- *As a [persona], I want to [perform task] so that I can/in order to [description]*



-

* *Possible detail A*



-

* *Possible detail B*



## NON-FUNCTIONAL REQUIREMENTS

*E.g. SLAs, performance, security levels*



## REQUIREMENTS SIZING

*Select one type of metric to assess effort and provide an initial estimate for each of the stories in the functional requirements. Explain the rational to assign each size*
```

Output: Final ChatGPT workout specification in `final/workout/FITTRACK_FINAL.md` plus four initiative 1-pagers, containing the approved vision, four personas, scenario-based problems, assumptions, 12 user stories with acceptance details, nonfunctional requirements, and per-story sizing rationale. Initial estimate: 42 story points. The protocol requires independent team estimation followed by discussion and re-estimation; these numbers are not claimed to be team-agreed.

Finalization choices introduced by ChatGPT: kilograms as the prototype load unit; stable catalog exercise identities; owner-only record access; inclusive local-date filtering; weighted volume defined as entered load times repetitions, excluding bodyweight contribution; Monday–Sunday buckets; explicit failure and correction behavior. These are documented assumptions for team review, not research findings. Performance targets are proposed requirements, not measured results.

Rubric limits: This completes one model/product specification. MealMap and the Claude versions are separate work. No Claude output has been supplied, so the final model comparison and winner cannot yet be supported. The final file includes a grounded critique of the ChatGPT process and identifies the missing cross-model evidence. Draft files are preserved.

## Prompt 12 — September 30, 2026

```text
Ok perfect, push
```

Action requested: Commit and push the specification, preserved drafts, and interaction log to the repository remote.

## Prompt 13 — September 30, 2026

```text
Ok now lets follow the same steps we did for the FitTrack, for the Meal Planning
```

Output: `MEAL_PLANNING_PERSONAS_DRAFT_01.md` (four proto-personas), `MEAL_PLANNING_SCENARIOS_DRAFT_01.md` (four narratives), and `final/meal-planning/MEALMAP_FINAL.md` with five accompanying initiative 1-pagers. The previously approved meal vision is reused. These new personas, scenarios, and detailed assumptions are proposed for user review; they have not been approved through separate iteration turns.

Personas: Sebastian (21, macro-focused recreational lifter), Lucía (24, beginner needing understandable estimates), Valeria (29, vegetarian shift worker), and Carlos (46, practical home cook). Reusing adult workout characters creates compatible audiences without assuming data integration.

Specification decisions: Optional estimates scoped to ages 20–65; metric BMI and simplified Mifflin–St Jeor resting-energy equation; proposed activity factors explicitly labelled unvalidated project assumptions; manual adjustable macros and no automatic deficit/surplus; curated recipes with provenance and missing-data indicators; fractional servings; versioned plans; ingredient-identity and compatible-unit grocery aggregation. Technical input limits are validation assumptions, not healthy ranges.

Sources checked: CDC About BMI and BMI FAQs; Mifflin et al. (1990), PubMed record https://pubmed.ncbi.nlm.nih.gov/2305711/. The Mifflin paper supports the resting-energy equation, not the activity multipliers, calorie targets, or macro prescriptions. Source links are included in the final specification.

Initial sizing: 15 stories, 61 story points, with per-story rationale and the same team-estimation protocol as FitTrack. Performance targets are proposed acceptance requirements, not measurements. Claude comparison still awaits actual teammate outputs. No files were pushed in this turn.

## Prompt 14 — September 30, 2026

```text
ok push I like it and see is feasible
```

User approved the MealMap package and considered it feasible. Action requested: Commit and push the MealMap specification, persona and scenario drafts, and updated prompt log. This approval does not establish measured implementation feasibility or team-agreed story-point estimates.

## Prompt 15 — October 1, 2026

```text
Ok diego told me he pushed a few stuff, check it out
```

Action: Fetched and fast-forwarded the local repository to `958bd13`, incorporating five newer commits and 16 added/updated files. Inspected the Markdown versions, prompt logs, and text/tables from the latest final Claude Word files. No Diego files were changed. Word page layout was not verified.

Findings: The newest Claude fitness final has four personas, 31 stories, and 101 points; the meal final has four personas, 30 stories, and 119 points. Both include comparison and student evaluation sections. Root-level Markdown meal final is an earlier 28-story/109-point version, so it must not be confused with the latest Word final. Comparisons need corrections: Claude does have estimation anchors; ChatGPT includes per-story sizing rationale; story counts reflect differing scope and granularity rather than directly establishing quality. The FOR/WHO vision template is attributed to Chapter 3 in the Claude files but appears in Chapter 1, section 1.1 of the supplied book. Claude meal planning intentionally excludes BMI, energy estimates, and macro targets, unlike the approved ChatGPT nutrition-focused vision.

## Prompt 16 — October 1, 2026

```text
ok lets just match them, and grab his prompt log and mine and make a single .md file. Alongisde that. Add a section for us to add comments about our critiques for Claude and Chat
```

Output: `final/COMBINED_AI_PROMPT_LOG_AND_CRITIQUES.md`, consolidating all three existing logs, mapping the four final model/product versions, and adding blank critique sections for Sebastian and Diego plus a joint comparison section. Source wording and order are retained; line endings are normalized. Claude dates are not inferred. The user clarified that “match” means organize the versions for comparison while keeping each model’s scope.

## Prompt 17 — October 1, 2026

Clarification question: By “match them,” do you mean organize the ChatGPT and Claude versions together for comparison, or also change our product requirements to match Diego’s scope?

```text
Organize them for comparison; keep each model’s scope
```

Action: Retained both model scopes and updated the combined log with this clarification. Blank student critique fields remain unfilled.

## Prompt 18 — October 1, 2026

```text
ok wait im seeing that for Non Functional requirements you are already stating like 500 recipies and stuff like that. Like no remove those. We dont need to make promises or state stuff that isnt there yet. Just high level stuff. And also the one pagers are max 1.5 pages these are absolutely huge
```

Output: Revised both ChatGPT product specifications and all nine initiative sources. Removed numeric nonfunctional performance, capacity, workload, and pixel targets; retained high-level usability, reliability, integrity, and privacy requirements. Shortened each initiative to one problem paragraph, concise assumptions and story details, and a compact sizing table. Preserved story IDs, estimates, and the student's reviews. Regenerated the two final Word files using Diego's formatting and checked their print layout. Earlier numeric targets in historical logs remain evidence of the prior version, not current requirements.
````

<a id="claude-fitness-prompt-log"></a>

## Claude — Diego, Fitness & Workout

Source: [03_Claude_Prompts.md](../03_Claude_Prompts.md) | Recorded prompt entries: 6

````markdown
# Claude Prompts

Prompts given to Claude for the Fitness & Workout Log App (CS3365), pasted as provided, in order.

---

## Prompt 1: First draft (initial product definition)

You are acting as a senior Product Manager and Requirements Engineering specialist helping me complete a college-level software engineering project for my CS3365 Engineering Systems / Software Products course.

Your role is NOT simply to generate generic software requirements. Act as a professional Product Manager conducting a requirements elicitation and analysis process. Be critical, systematic, realistic, and consistent throughout the entire deliverable.

I need you to help me develop ONE of the two product ideas for my project first. We will work on the second product only after I explicitly tell you to proceed.

The product we are working on NOW is:

**Fitness & Workout Log App**
A mobile-first application for logging daily workouts, tracking exercise sets, and viewing historical workout volume graphs.

The second product, which we will NOT work on yet, is:

**Recipe & Meal Planning Portal**
A searchable UI where users filter recipes by dietary tags, plan weekly meals, and automatically generate grocery lists.

Do NOT work on the Recipe & Meal Planning Portal unless I explicitly tell you to do so.

---

# 1. ACADEMIC CONTEXT

This is a college project focused on practicing requirements elicitation and analysis during the early stages of software product development.

The overall project objective is:

> Practice what would normally happen during a regular requirements elicitation and analysis phase during the development of a software product.

The assignment uses AI models as a "Product Manager simulator." The AI is expected to help generate product visions, personas, scenarios, user stories, assumptions, functional requirements, non-functional requirements, and sizing information.

However, I am responsible for reviewing and evaluating everything generated. Therefore, do not simply produce plausible-sounding requirements. Think carefully about whether each requirement actually follows good requirements-engineering practices.

---

# 2. REQUIRED BOOK

Use the following book as the primary conceptual reference for how product visions, personas, scenarios, and requirements should be developed:

Ian Sommerville, **Engineering Software Products**, 1st Edition, Pearson, 2019.

Official book website:

https://iansommerville.com/engineering-software-products/

In particular, I have been instructed to review **Chapter 3** carefully.

Your work should reflect the concepts and best practices from Chapter 3, especially regarding:

* Product vision
* Personas
* Scenarios
* Requirements
* User stories
* Stakeholders/users
* Assumptions
* Requirements elicitation
* Appropriate level of detail
* Avoiding vague or unnecessarily technical requirements
* Connecting user needs to product functionality

Do NOT invent quotations or page numbers from the book.

If you have access to the book/content, use it to guide your reasoning. If you do not have access to the full chapter, clearly distinguish established requirements-engineering principles from anything that you are inferring.

---

# 3. IMPORTANT: WE ARE ONLY GENERATING CLAUDE'S VERSION

The course assignment ultimately requires students to use two different AI models for the product definitions and compare their outputs.

For THIS iteration, however, I specifically want you to generate **only the Claude version**.

Do NOT:

* Pretend that another AI model generated anything.
* Invent a second model's output.
* Create a fake comparison between Claude and another model.
* Claim that your version is objectively better than another model.
* Manufacture results from a model you have not actually seen.

Instead, create a strong, internally consistent Claude-generated version that I can later compare against my teammate's output from another AI model.

Where the assignment asks for critique of models, structure the documentation so that it can later accommodate a comparison, but do not fabricate the other model's results.

---

# 4. ACT AS A PROJECT MANAGER

Throughout the process, behave like a professional Product Manager.

You should:

* Identify ambiguities.
* Make reasonable assumptions when information is missing.
* Explicitly document those assumptions.
* Avoid adding unnecessary features just because they sound interesting.
* Maintain traceability between the product vision, personas, scenarios, and functional requirements.
* Ensure that requirements actually solve the problems identified by the personas.
* Identify gaps or inconsistencies.
* Avoid scope creep.
* Keep the product realistic for a student prototype.
* Think about what would realistically be implemented in a prototype.
* Prioritize clarity over technical complexity.
* Use consistent terminology throughout the document.
* Make requirements specific enough to be useful later.
* Avoid requirements that are so vague that developers could interpret them in completely different ways.
* Avoid prematurely specifying implementation technologies unless technically necessary.

Think like the person responsible for ensuring that a development team could actually use these documents as the foundation for later implementation.

---

# 5. PRODUCT IDEA

## Fitness & Workout Log App

Initial concept:

> A mobile-first UI for logging daily workouts, tracking exercise sets, and viewing historical volume graphs.

You should develop this concept into a coherent product definition without changing its fundamental purpose.

The product should primarily focus on:

1. Recording workouts.
2. Recording exercises within workouts.
3. Recording sets and relevant exercise data.
4. Allowing users to review historical workout information.
5. Visualizing workout volume/history.
6. Making workout logging practical on a mobile device.

Do not turn it into an overly broad fitness platform.

For example, do NOT automatically add:

* Social media
* Trainer marketplaces
* Live coaching
* Nutrition tracking
* Medical advice
* Wearable-device ecosystems
* AI personal trainers
* Gym booking
* Supplement marketplaces
* Payments
* Complex community systems

unless there is a strong requirements-based reason to include something.

The goal is a focused workout logging product.

---

# 6. FIRST TASK: PRODUCT VISION

Create a strong Product Vision for the Fitness & Workout Log App.

The vision should clearly communicate:

* What the product is.
* Who it is for.
* What problem it addresses.
* Why the problem matters.
* What value the product provides.
* What the core user experience should accomplish.
* What differentiates the product concept.
* The general scope of the product.
* What the product is NOT intended to solve, when useful for controlling scope.

The product vision should be appropriate for a requirements document rather than marketing copy.

Do not make it excessively long.

After generating the initial vision, critically review it yourself.

Identify:

* Ambiguous statements.
* Overly broad statements.
* Unsupported assumptions.
* Missing users or needs.
* Scope problems.
* Statements that are not measurable or useful for subsequent requirements.

Then produce a refined/final version.

---

# 7. PRODUCT VISION DEVELOPMENT LOG

Because the assignment specifically requires a detailed log of AI interactions, document how the vision was developed.

Create a section called:

## AI INTERACTION / PRODUCT VISION DEVELOPMENT LOG

Since this is the first Claude iteration, document the reasoning process in a way that I can include in my assignment.

Include:

### Interaction 1 — Initial Product Vision

Explain what information was provided to the AI and what the resulting vision focused on.

### Self-Critique

Explain what weaknesses you identified in the initial vision.

### Iteration 2 — Refined Product Vision

Explain what changes were made and why.

### Final Evaluation

Explain why the final version is more useful as a foundation for personas, scenarios, and requirements.

IMPORTANT:

Do not falsely claim that these were separate real-world API conversations if they were not. Clearly label them as stages/iterations of the Claude-assisted development process.

Also create a compact table containing:

| Iteration | Purpose | Main Changes | Reason |
| --------- | ------- | ------------ | ------ |

This will help me document my AI interaction history for the final project.

---

# 8. PERSONAS

Based on the FINAL product vision, develop an appropriate set of personas.

Use principles from Sommerville Chapter 3 and good requirements-engineering practice.

Do not create personas merely by changing age, gender, or occupation.

Each persona should represent a meaningful user type with different:

* Goals
* Motivations
* Behaviors
* Experience levels
* Pain points
* Needs
* Expectations
* Relevant context of use
* Potential frustrations with existing solutions

Determine the appropriate number of personas yourself.

Do NOT create an excessive number simply to make the document look more complete.

For each persona include:

### Persona Name

A realistic descriptive name.

### Persona Type

For example, primary user, secondary user, etc., if appropriate.

### Background

Relevant context only.

### Goals

What this person is trying to accomplish.

### Motivations

Why the goals matter.

### Behaviors

How they currently approach the problem.

### Pain Points

Problems with their current process.

### Needs

What they need from the product.

### Technology / Usage Context

Relevant device or usage circumstances.

### Product Expectations

What they expect from the Fitness & Workout Log App.

### Representative Scenario

A short realistic scenario showing how the persona would use the product.

Make sure every persona has a purpose.

After creating the personas, perform a consistency check:

* Does every persona correspond to a plausible user?
* Are the personas meaningfully different?
* Are they directly connected to the product vision?
* Do they provide enough coverage for the requirements?
* Are any redundant?
* Are important user types missing?

If changes are needed, revise them.

---

# 9. PERSONA-TO-REQUIREMENT TRACEABILITY

Create a simple traceability table connecting personas to the problems and capabilities they require.

Use:

| Persona | Main Problem | Main Goal | Relevant Product Capabilities |
| ------- | ------------ | --------- | ----------------------------- |

This is important because later functional requirements must be derived from actual user needs rather than invented independently.

---

# 10. 1-PAGERS / EPICS

Create multiple 1-pagers for the Fitness & Workout Log App.

Do NOT force everything into one 1-pager.

Determine a logical set of epics/features that adequately covers the product vision and personas.

For example, possible areas might include:

* Workout creation/logging
* Exercise and set tracking
* Workout history
* Historical volume visualization
* Workout organization

But do not blindly use these categories. Determine the appropriate breakdown based on the product vision and personas.

Each 1-pager should represent a coherent feature/problem area.

The number of 1-pagers should be justified.

---

# 11. REQUIRED 1-PAGER TEMPLATE

For every 1-pager, use EXACTLY this overall structure:

# [Initiative Name] 1-pager

## PROBLEM

One to two paragraphs describing the initiative.

This should roughly correspond to what Sommerville refers to as a scenario/problem context.

The problem statement should:

* Describe the user's situation.
* Explain the problem or need.
* Describe the relevant context.
* Explain why the problem matters.
* Avoid jumping immediately into implementation.
* Avoid simply listing features.
* Be grounded in the relevant persona(s).

The problem should describe a real user problem rather than saying:

"The system needs a feature that..."

Instead explain the situation from the user's perspective.

---

## ASSUMPTIONS

Explicitly identify assumptions made because the product vision does not specify every detail.

Examples of areas that may require assumptions:

* Authentication
* User ownership of workout data
* Exercise naming
* Units
* Internet availability
* Historical data
* Mobile device usage
* Data persistence
* Whether users can edit/delete workouts
* Whether predefined exercises exist
* Whether users can create custom exercises

Only include assumptions that are actually relevant.

Do not invent unnecessary assumptions.

For each assumption, explain briefly why it is needed.

---

## FUNCTIONAL REQUIREMENTS

Write functional requirements primarily as user stories using:

> As a [persona], I want to [perform task] so that I can/in order to [description].

Each story should be:

* Specific.
* User-centered.
* Valuable.
* Understandable.
* Testable.
* Consistent with the persona.
* Consistent with the problem.
* Within product scope.

Do not write technical implementation instructions as user stories.

For each user story, include appropriate supporting details underneath.

For example:

* Acceptance-oriented details
* Business rules
* Constraints
* Relevant behavior
* Important edge cases

Do NOT automatically turn every detail into another user story.

---

# 12. FUNCTIONAL REQUIREMENT QUALITY CONTROL

After writing the functional requirements for each 1-pager, critically review them.

Check:

### Coverage

Does the set of stories actually solve the problem?

### Persona alignment

Can I identify which persona needs each story?

### Value

Does each story explain why the user needs it?

### Specificity

Could a development team understand what is expected?

### Testability

Could someone later determine whether the requirement was satisfied?

### Scope

Is the requirement actually part of this product?

### Redundancy

Are any stories duplicates?

### Dependencies

Does one story depend on another?

### Missing requirements

Is anything essential missing?

If problems are found, revise the requirements before presenting the final 1-pager.

---

# 13. NON-FUNCTIONAL REQUIREMENTS

For every 1-pager, identify relevant non-functional requirements.

Consider categories such as:

* Performance
* Availability
* Usability
* Security
* Privacy
* Reliability
* Data integrity
* Accessibility
* Compatibility
* Scalability

Do NOT add every category automatically.

Only include requirements that are relevant to the particular product/problem.

Whenever possible, make them reasonably measurable.

Avoid vague statements such as:

"The application should be fast."

Instead use something that can eventually be evaluated, such as an appropriate response-time expectation.

Because this is an early-stage requirements exercise, distinguish between:

* Explicit requirements
* Reasonable assumptions
* Proposed targets that would require validation

Do not pretend that arbitrary numerical values came directly from the assignment or book.

---

# 14. REQUIREMENTS SIZING

For each 1-pager, select ONE sizing metric/protocol.

Use a consistent approach across the stories.

A suitable approach may be story points if appropriate.

If you choose story points, clearly explain the scale and rationale.

For example, you might define:

* 1 = trivial
* 2 = very small
* 3 = small
* 5 = moderate
* 8 = complex
* 13 = very complex

However, do not blindly use this scale if another approach is more appropriate.

The important requirement is:

> Select one type of metric to assess effort and provide an initial estimate for each story. Explain the rationale for assigning each size.

For every functional story provide:

| Story ID | User Story | Size | Rationale |
| -------- | ---------- | ---: | --------- |

The rationale should consider factors such as:

* Complexity
* Number of UI states
* Data involved
* Validation
* Dependencies
* Uncertainty
* Integration
* Potential edge cases

Do NOT estimate time in hours unless there is a specific reason to do so.

Make clear that these are INITIAL estimates and may change after further requirements analysis.

---

# 15. REQUIREMENT TRACEABILITY MATRIX

After all 1-pagers, create a high-level traceability matrix showing:

| Product Vision Need | Persona | Problem / Scenario | 1-Pager | Functional Requirement IDs |
| ------------------- | ------- | ------------------ | ------- | -------------------------- |

This should demonstrate that the requirements are not disconnected from the original product vision.

Every major product need should lead to at least one relevant requirement.

Identify any gaps.

---

# 16. OVERALL CONSISTENCY AUDIT

Before presenting the final deliverable, act as a strict project manager reviewing your own work.

Perform an internal audit covering:

### Product Vision

* Is it clear?
* Is the scope controlled?
* Does it describe user value?

### Personas

* Are they realistic?
* Are they sufficiently detailed?
* Are they meaningfully different?
* Do they cover the important users?

### Scenarios / Problems

* Are they actual user problems?
* Are they grounded in personas?
* Do they provide enough context?

### Assumptions

* Are assumptions explicitly documented?
* Are there hidden assumptions that should be stated?

### Functional Requirements

* Are stories user-centered?
* Are they sufficiently specific?
* Are they testable?
* Is coverage sufficient?

### Non-Functional Requirements

* Are relevant quality attributes covered?
* Are statements measurable where practical?

### Sizing

* Is one consistent metric being used?
* Does each story have a rationale?
* Are estimates reasonable for relative effort?

### Consistency

* Are there contradictions?
* Does every story connect to a persona?
* Does every major requirement trace back to a problem?
* Are there features that appear without justification?

If you identify problems, FIX THEM before producing the final version.

---

# 17. DOCUMENT STRUCTURE

Organize the final Claude output in the following order:

# Fitness & Workout Log App — Claude Product Definition

## 1. Product Vision

### Initial Vision

### Vision Critique

### Refined / Final Vision

## 2. AI Interaction / Product Vision Development Log

Include the iteration table and explanation.

## 3. Personas

Include all personas.

## 4. Persona-to-Requirement Traceability

Include the table.

## 5. 1-Pagers / Epics

Include all 1-pagers.

For each:

### [Initiative Name] 1-pager

#### PROBLEM

#### ASSUMPTIONS

#### FUNCTIONAL REQUIREMENTS

#### NON-FUNCTIONAL REQUIREMENTS

#### REQUIREMENTS SIZING

## 6. Requirement Traceability Matrix

Include the complete matrix.

## 7. Project Manager Quality Audit

Include findings and corrections.

## 8. Open Questions / Items Requiring Human Validation

Identify things that I should personally review or confirm before submitting the assignment.

---

# 18. VERY IMPORTANT: DO NOT INVENT INFORMATION

You are assisting me, but I am responsible for the final submission.

Therefore:

* Clearly identify assumptions.
* Do not present assumptions as facts.
* Do not invent information from my professor.
* Do not invent requirements supposedly stated in the textbook.
* Do not fabricate user research.
* Do not claim that real users were interviewed.
* Do not claim that the product has validated market demand.
* Do not fabricate statistics.
* Do not fabricate AI interactions.
* Do not fabricate another model's output.
* Do not cite sources you did not actually consult.

If something requires human validation, explicitly mark it as:

**Requires Human Validation**

---

# 19. AVOID GENERIC AI OUTPUT

This is extremely important.

I do NOT want a generic list of obvious app features.

For example, avoid shallow statements such as:

* "Users can log workouts."
* "Users can view their history."
* "The application should be easy to use."

Instead, develop requirements from realistic user situations and explain the underlying user need.

The resulting work should look like a serious requirements-analysis artifact prepared by a Product Manager, not a generic AI-generated feature list.

---

# 20. ACADEMIC APPROPRIATENESS

This is a college assignment.

Use professional but understandable language.

Do not make the document unnecessarily corporate or filled with buzzwords.

Use terminology appropriate for:

* Software engineering
* Product management
* Requirements engineering
* Agile development
* User stories
* Personas
* Scenarios
* Functional requirements
* Non-functional requirements
* Relative sizing

The result should be something that could realistically be submitted as part of a university software engineering project after human review.

---

# 21. IMPORTANT DISTINCTION BETWEEN GENERATED CONTENT AND MY EVALUATION

At the end of the document, create a section specifically reserved for me:

# Student Evaluation of Claude's Output

Leave this section mostly blank except for a short set of prompts/questions that I can answer myself.

For example:

* What did Claude do well?
* What requirements or personas were particularly useful?
* What did Claude misunderstand?
* Which assumptions should be changed?
* Which requirements need clarification?
* Were the personas sufficiently specific?
* Were the scenarios appropriate?
* Was the sizing rationale reasonable?
* What would I change before submitting?
* Overall evaluation of Claude's contribution:

Do NOT answer these questions yourself.

This section is for MY evaluation of the AI output.

---

# 22. FINAL QUALITY STANDARD

Before giving me the final result, imagine that you are the Product Manager presenting this work to a software development team.

Ask yourself:

> "Could a development team understand the user problems, users, intended product behavior, and relative complexity well enough to begin the next requirements phase?"

If the answer is no, improve the document.

Also ask:

> "Can I trace the functional requirements back to actual user problems and personas?"

If the answer is no, revise the requirements.

And finally:

> "Does this demonstrate that the AI was used as a requirements/product-management assistant rather than blindly copied?"

If not, improve the documentation of iterations, critiques, assumptions, and validation points.

---

# 23. OUTPUT INSTRUCTIONS

Work ONLY on the **Fitness & Workout Log App**.

Do not discuss or generate the Recipe & Meal Planning Portal yet.

Produce the complete Claude version with:

1. Product vision
2. Vision iterations and critique
3. AI interaction log
4. Personas
5. Persona traceability
6. Multiple 1-pagers
7. Problem/scenario statements
8. Assumptions
9. Functional requirements/user stories
10. Non-functional requirements
11. Requirements sizing and rationale
12. Requirement traceability
13. Project Manager quality audit
14. Open questions requiring human validation
15. Blank student evaluation section

Use the assignment's 1-pager structure exactly where specified.

Be detailed enough for a college project, but avoid unnecessary filler.

Most importantly, maintain consistency across the entire document: the personas should drive the scenarios, the scenarios should drive the requirements, and the requirements should drive the sizing.

Do not move on to the second product until I explicitly instruct you to.

---

## Prompt 2: Final version (review and refinement)

I have now received your first complete draft for the **Fitness & Workout Log App** portion of my CS3365 Engineering Systems / Software Products project.

Your task now is to take that first draft and produce a **polished, academically strong, internally consistent final version**.

Do NOT simply rewrite the previous document with different wording. Act as a senior Product Manager and Requirements Engineering reviewer performing a formal quality review of your own previous work.

The goal is to identify weaknesses, inconsistencies, unnecessary assumptions, missing requirements, poorly written scenarios, weak personas, and sizing problems, then correct them.

I will use this revised version as the main Claude-generated version that I will later review myself and potentially compare with another student's/model's version.

IMPORTANT: We are STILL working ONLY on:

**Fitness & Workout Log App**

> Mobile-first UI for logging daily workouts, tracking exercise sets, and viewing historical volume graphs.

Do NOT work on the Recipe & Meal Planning Portal yet.

---

# 1. SOURCE MATERIAL

Use the first draft you already generated in this conversation as the starting point.

Also use the assignment requirements I previously provided and the following book as the conceptual reference:

Ian Sommerville, **Engineering Software Products**, 1st Edition, Pearson, 2019.

Official website:

https://iansommerville.com/engineering-software-products/

Pay particular attention to **Chapter 3**, especially the treatment of:

* Product visions
* Personas
* Scenarios
* Requirements
* User stories
* Requirements elicitation
* Assumptions
* User-centered product definition

Do not invent quotations, page numbers, or claims from the book.

---

# 2. YOUR ROLE IN THIS ITERATION

For this iteration, act simultaneously as:

1. Senior Product Manager
2. Requirements Engineer
3. Software Product reviewer
4. Academic-quality editor

Your job is to improve the first draft based on the assignment rubric.

Be critical.

Do not assume that everything in the first draft is correct simply because you generated it.

You should actively search for weaknesses.

---

# 3. FIRST: PERFORM A DETAILED REVIEW OF THE FIRST DRAFT

Before rewriting anything, internally evaluate the previous draft against the following criteria.

## A. Product Vision

Check:

* Is the vision clear?
* Does it identify the target users?
* Does it identify the core problem?
* Does it communicate user value?
* Is the scope appropriately constrained?
* Does it avoid becoming a generic "fitness app"?
* Does it provide a useful foundation for personas and requirements?
* Are any claims unsupported?
* Are there unnecessary features?

If weaknesses exist, correct them.

---

# 4. PERSONA REVIEW

Evaluate every persona from the first draft.

Ask:

* Is this a genuine user type?
* Does this persona have a distinct goal?
* Does this persona have meaningful behavioral differences from other personas?
* Is the persona sufficiently detailed?
* Is the persona actually useful for generating requirements?
* Are any personas redundant?
* Are important user types missing?
* Are the personas grounded in realistic usage scenarios?
* Does each persona connect directly to the product vision?

Do NOT create additional personas merely to increase the number.

The goal is an appropriate number of meaningful personas.

If a persona is unnecessary, merge or remove it.

If an important user type is missing, add it and explain why.

---

# 5. SCENARIO / PROBLEM REVIEW

This is especially important because the assignment rubric explicitly evaluates:

> Problem statements (1 per 1-pager)
>
> * Properly written scenarios
> * Sufficient coverage of requirements
> * Appropriate complement with respect to assumptions

Review every 1-pager's PROBLEM section.

Make sure each problem:

* Describes a user situation.
* Is connected to one or more personas.
* Explains the user's need/problem.
* Provides enough contextual detail.
* Explains why the problem matters.
* Does not simply describe a software feature.
* Does not prematurely prescribe a technical solution.
* Provides enough context for the functional requirements that follow.

A weak example would be:

> "Users need a way to record workouts."

A stronger scenario would explain the user's actual situation, difficulty, context, and desired outcome.

Improve every problem statement accordingly.

---

# 6. ASSUMPTION REVIEW

Review every assumption.

For each one ask:

* Is it actually necessary?
* Is it supported by the product concept?
* Is it clearly identified as an assumption?
* Does it affect the requirements?
* Is it unnecessarily restrictive?
* Is it accidentally being presented as a confirmed requirement?

Remove unnecessary assumptions.

Add important assumptions that were previously missing.

Make the assumptions directly relevant to the associated 1-pager.

---

# 7. FUNCTIONAL REQUIREMENT REVIEW

This is one of the most important parts of the revision.

Review EVERY functional requirement/user story.

Use the basic format:

> As a [persona], I want to [perform task] so that I can/in order to [description].

For every story check:

### User

Is a real persona identified?

### Action

Is the desired action clear?

### Value

Does the story explain why the user wants it?

### Specificity

Is the requirement sufficiently specific?

### Testability

Could a development team eventually determine whether it has been implemented correctly?

### Scope

Is it genuinely part of the Fitness & Workout Log App?

### Consistency

Does it match the problem and assumptions?

### Redundancy

Does another story already cover it?

### Completeness

Does the 1-pager cover the problem sufficiently?

Revise weak stories.

Do NOT make stories unnecessarily technical.

Do NOT turn implementation decisions into requirements unless they are genuinely required.

---

# 8. SUPPORTING DETAILS / ACCEPTANCE-ORIENTED DETAILS

Review the supporting details underneath each user story.

These details should clarify behavior without unnecessarily turning into implementation instructions.

Good details can address:

* Required information
* Validation
* User choices
* Editing
* Deletion
* Empty states
* Error cases
* Important business rules
* Relevant constraints

Make sure the details actually contribute to understanding the requirement.

Remove filler.

---

# 9. NON-FUNCTIONAL REQUIREMENT REVIEW

Review the non-functional requirements for every 1-pager.

Check whether the previous version:

* Included relevant quality attributes.
* Avoided irrelevant categories.
* Used measurable language where practical.
* Avoided vague statements.
* Clearly distinguished proposed targets from confirmed requirements.

Do not arbitrarily add numbers simply to make requirements appear technical.

For example, do not invent a performance requirement such as "response time must be under 1 second" unless there is a reasonable justification.

When numerical targets are proposed assumptions rather than established requirements, explicitly identify them as proposed targets requiring validation.

Consider relevant areas such as:

* Performance
* Usability
* Accessibility
* Security
* Privacy
* Reliability
* Data integrity
* Availability
* Compatibility

Only include categories relevant to the specific product.

---

# 10. REQUIREMENT SIZING REVIEW

The assignment specifically requires:

> Select one type of metric to assess effort and provide an initial estimate for each of the stories in the functional requirements. Explain the rationale to assign each size.

Review the sizing system from the first draft.

Use ONE consistent sizing method throughout the product.

If story points are used, make the scale explicit.

For each story provide:

| Story ID | User Story | Size | Rationale |
| -------- | ---------- | ---: | --------- |

The rationale should consider:

* Complexity
* UI complexity
* Data handling
* Validation
* Dependencies
* Uncertainty
* Edge cases
* Integration
* Amount of work involved

Do not confuse:

**User value**

with:

**Implementation effort**

The size should represent relative implementation effort/complexity, not how important the feature is.

Also check that the sizing is internally consistent.

For example, if two stories are similarly complex, they should not receive dramatically different sizes without an explanation.

---

# 11. TRACEABILITY REVIEW

This is extremely important.

Verify the following chain:

**Product Vision → Persona → Problem/Scenario → User Story → Size**

Every major requirement should be traceable backward to a user need.

Every major user need should result in relevant requirements.

Identify orphan requirements.

Identify user needs that are not covered.

If something does not fit logically, revise it.

---

# 12. SCOPE CONTROL

Review the entire document for scope creep.

The Fitness & Workout Log App is NOT intended to become a complete health/wellness ecosystem.

Remove or flag features that are not justified by the original product concept.

The core scope should remain centered around:

* Workout logging
* Exercise tracking
* Set tracking
* Historical workout information
* Workout volume/history visualization
* Practical mobile-first usage

Features outside this scope should require explicit justification.

---

# 13. CONSISTENCY CHECK

Perform a complete consistency audit.

Check that:

* Persona names are identical everywhere.
* Persona descriptions do not contradict their scenarios.
* Terminology is consistent.
* Feature names are consistent.
* Story IDs are unique.
* 1-pager names are consistent.
* Requirements are not duplicated across 1-pagers.
* Assumptions are not contradictory.
* Non-functional requirements do not conflict with functional requirements.
* Sizing uses one consistent method.
* Traceability tables accurately reflect the requirements.
* The final product scope remains coherent.

Fix every inconsistency you find.

---

# 14. IMPROVE THE PRODUCT VISION

Take the refined product vision from the first draft and perform one final editorial pass.

The final vision should be:

* Concise enough to be a vision.
* Specific enough to guide requirements.
* User-centered.
* Clear about the problem.
* Clear about the intended value.
* Appropriately scoped.
* Consistent with the personas and 1-pagers.

Do not turn it into a marketing slogan.

---

# 15. IMPROVE THE AI INTERACTION LOG

The assignment requires:

> Detailed log of AI interactions.

Since this is the SECOND iteration of the Claude work, update the interaction log to accurately represent:

### Iteration 1

Initial Claude-generated product vision and requirements.

### Iteration 2

Review, critique, refinement, and correction of the initial output.

For Iteration 2, document:

* What was reviewed.
* What weaknesses were identified.
* What changes were made.
* Why the changes were made.
* How the changes improved alignment with the assignment and Chapter 3 principles.

Do NOT fabricate exact conversation details that did not occur.

The log should be honest about what was actually done.

Create a table:

| Iteration | Purpose | Problems Identified | Changes Made | Expected Improvement |
| --------- | ------- | ------------------- | ------------ | -------------------- |

---

# 16. DO NOT COMPARE AGAINST ANOTHER MODEL

The final assignment will eventually involve another AI model, but I have NOT provided that model's output to you.

Therefore:

DO NOT:

* Invent a comparison.
* State that Claude performed better.
* State that another model performed worse.
* Create fictional output from another model.
* Rank models.
* Fabricate another model's strengths or weaknesses.

Instead, include a section:

## Comparison Pending

Explain that the Claude version has now been refined and is ready to be compared with the independently generated version from the second model.

Do not perform the comparison yourself.

---

# 17. FINAL DOCUMENT STRUCTURE

Now produce the polished version using this structure:

# Fitness & Workout Log App — Claude Final Version

## 1. Product Vision

### 1.1 Initial Vision

Briefly preserve the original version.

### 1.2 Critique of Initial Vision

Explain the important weaknesses.

### 1.3 Refined Product Vision

Present the improved final vision.

---

## 2. AI Interaction / Development Log

Document the first and second iterations.

Include the required table.

---

## 3. Personas

Present the final set of personas.

For every persona include:

* Persona name
* Persona type
* Background
* Goals
* Motivations
* Behaviors
* Pain points
* Needs
* Usage context
* Product expectations
* Representative scenario

---

## 4. Persona-to-Requirement Traceability

Use:

| Persona | Main Problem | Main Goal | Relevant Product Capabilities |
| ------- | ------------ | --------- | ----------------------------- |

---

# 5. 1-Pagers / Epics

Include all appropriate 1-pagers.

For EACH 1-pager use this exact structure:

# [Initiative Name] 1-pager

## PROBLEM

One to two strong paragraphs written as a realistic user problem/scenario.

## ASSUMPTIONS

List relevant assumptions and explain why they are necessary.

## FUNCTIONAL REQUIREMENTS

Use the required user-story format:

> As a [persona], I want to [perform task] so that I can/in order to [description].

Then include appropriate supporting details.

Assign unique story IDs such as:

* FW-01
* FW-02
* FW-03

Continue sequentially throughout the entire Fitness & Workout Log App.

## NON-FUNCTIONAL REQUIREMENTS

List relevant requirements.

Assign IDs if useful, such as:

* NFR-01
* NFR-02

## REQUIREMENTS SIZING

Use the selected metric and include:

| Story ID | User Story | Size | Rationale |
| -------- | ---------- | ---: | --------- |

---

# 6. Overall Requirement Traceability Matrix

Use:

| Vision Need | Persona | Problem / Scenario | 1-Pager | Story IDs |
| ----------- | ------- | ------------------ | ------- | --------- |

Check that every row is accurate.

---

# 7. Project Manager Quality Audit

Create a concise but meaningful audit.

Use categories:

### Product Vision

What was improved?

### Personas

What was improved?

### Scenarios

What was improved?

### Functional Requirements

What was improved?

### Non-Functional Requirements

What was improved?

### Sizing

What was improved?

### Traceability

What was improved?

### Remaining Risks

What still requires human review?

---

# 8. Open Questions / Human Validation

Create a section identifying decisions that I should personally review before submitting the work.

Separate them into:

### High Priority

Things that could materially affect the requirements.

### Medium Priority

Things that could improve the product definition but are not essential.

### Low Priority

Optional refinements.

Do not leave me with dozens of unnecessary questions.

Focus on decisions that genuinely require human judgment.

---

# 9. Comparison Pending

Briefly state that the refined Claude version is ready to be compared against the independent output generated using the second AI model.

Do not perform that comparison.

---

# 10. STUDENT EVALUATION OF CLAUDE

At the very end, create a section for me:

# Student Evaluation of Claude's Output

Leave the actual evaluation blank.

Provide only questions/prompts for me to answer:

* What did Claude do well?
* What did Claude do poorly?
* Which requirements were particularly useful?
* Which requirements need modification?
* Were the personas sufficiently specific?
* Were the scenarios realistic and appropriate?
* Were the assumptions reasonable?
* Was the sizing methodology appropriate?
* What would I change before submitting?
* What did I learn from using Claude?
* Overall evaluation:

Do NOT answer these questions for me.

---

# 11. IMPORTANT WRITING STANDARD

The final version should NOT sound like generic AI-generated text.

Avoid repetitive phrases such as:

* "The app should provide a seamless experience."
* "This will enhance user satisfaction."
* "Users can easily..."
* "The system should be user-friendly."

Unless these ideas are supported by concrete requirements, remove them.

Use precise requirements-engineering language.

The document should read like a serious university-level requirements artifact.

---

# 12. IMPORTANT ACADEMIC STANDARD

Remember that the professor will evaluate:

### Product vision

* Detailed AI interaction log
* Critique of different generated versions
* Quality of the vision

### Personas

* Sufficient detail
* Appropriate number
* Specificity

### Problem statements

* One per 1-pager
* Proper scenarios
* Requirement coverage
* Appropriate assumptions

### Functional requirements

* Book/class best practices
* Sufficient coverage

### Sizing

* Rationale
* Appropriate metric assignment protocol

Optimize the document specifically around these grading criteria.

---

# 13. FINAL SELF-REVIEW BEFORE OUTPUT

Before presenting the final document, perform one final internal review.

Ask:

1. Does every persona have a legitimate purpose?
2. Does every 1-pager solve a clearly stated user problem?
3. Does every functional requirement correspond to a persona?
4. Does every requirement provide user value?
5. Are the stories specific enough?
6. Are the requirements sufficiently complete?
7. Are assumptions clearly separated from requirements?
8. Are non-functional requirements relevant and reasonable?
9. Is sizing consistent and justified?
10. Can every requirement be traced back to the product vision?
11. Is there any unnecessary scope?
12. Are there contradictions?
13. Does the document follow the assignment's requested structure?
14. Does it reflect good Chapter 3 requirements-engineering practices?
15. Does it look like something a university student could realistically submit after reviewing it?

If the answer to any of these is no, correct the problem before producing the final version.

---

# 14. MOST IMPORTANT INSTRUCTION

Do NOT simply tell me what should be changed.

Actually make the changes.

I want the output to be the **fully revised and polished final Claude version**, not a critique followed by suggestions.

You may briefly explain the major improvements at the beginning, but the main output must be the complete revised document.

Do NOT work on the Recipe & Meal Planning Portal.

Do NOT fabricate the second AI model.

Do NOT fabricate user research.

Do NOT fabricate textbook quotations.

Do NOT invent information that is not supported by the product concept or clearly identified as an assumption.

Produce the polished final Fitness & Workout Log App document now.

---

## Prompt 3: Concise 1-pagers

```text
I need you to create another version of the document, the 1 pagers are very long and that cant be that way. The 1 pagers should be at most a page and a half currently they are 4 pages. The template to follow is the same one: [Initiative Name] 1-pager PROBLEM One to two paragraph description of the initiative. This should roughly match what Sommerville refers to as Scenarios in Chapter 3 of Engineering Software Products ASSUMPTIONS Since the product vision is not complete, the team will need to define here all assumptions they had to make to complement the base requirements sketched in the vision. FUNCTIONAL REQUIREMENTS * As a [persona], I want to [perform task] so that I can/in order to [description] * Possible detail A * Possible detail B (repeated for 3 stories) NON-FUNCTIONAL REQUIREMENTS E.g. SLAs, performance, security levels REQUIREMENTS SIZING Select one type of metric to assess effort and provide an initial estimate for each of the stories in the functional requirements. Explain the rational to assign each size ///// but it shuld be more narrowed down with the complete description of the requirments with details but more to the point. One pagers should be easy to read and follow and a base for the rest of the project. Also give a short description at the end of why you assigned that sizing.
```

---

## Prompt 4: Four visions and four personas (options)

```text
i need 4 product visions and 4 personas as requested in the rubric. The last persona could be about what options give me several options so i can choose.
```

---

## Prompt 5: Rubric check and fourth persona (Tomás)

The user pasted the project overview and rubric (not reproduced here) together with the following instruction.

```text
In the following message I will give you the rubric and instructions so you can check it where it says specificly 4 visions and 4 personas. So review it, make those changes and add: the following persona could work as the fourth one: Tomás Vargas, 46, returning lifter. He is an office administrator who uses a paper notebook and rarely installs apps. His handwriting is hard to read, and he wants large text and simple summaries.he adds a type of user the other three don't cover (low tech comfort, readability). ///// Also add this prompt into the prompts document for the fitness app in the repo and give me this new verson with the 4th persona.
```

---

## Prompt 6: Weight-unit tracking for the fourth persona

The user attached the current Word version of the document (with their own edits) and wrote:

```text
continue with the following version you should also add in the 4th persona the trackability of weights since in different gyms they use kg or lbs so sometimes the fourth persona gets confused and doesnt know what his actual weight he needs due to the conversion between kg and lbs so that should also be part of it. Add this in the following version and put this prompt in the prompt document for fitness. Replace the one in the repo about prompts with the new one and add this version of the document.
```
````

<a id="claude-meal-planning-prompt-log"></a>

## Claude — Diego, Recipe & Meal Planning

Source: [Recipe_Meal_Planning_Portal_Claude_03_Prompts.md](../Recipe_Meal_Planning_Portal_Claude_03_Prompts.md) | Recorded prompt entries: 3

```markdown
# Claude Prompts — Recipe & Meal Planning Portal

Prompts given to Claude for the Recipe & Meal Planning Portal (CS3365), pasted as provided, in order.
The Sommerville Chapter 3 text was also attached to Prompt 1 as reference material; it is not reproduced here.

---

## Prompt 1 — Initial product definition (produced the first draft)

I am now ready to begin the SECOND product for my CS3365 Engineering Systems / Software Products college project.

For this stage, I want you to act as a **senior Product Manager and Requirements Engineering specialist** and help me develop the complete initial product definition for the following product:

# Recipe & Meal Planning Portal

> A searchable UI where users filter recipes by dietary tags, plan weekly meals, and automatically generate grocery lists.

This is a separate product from the Fitness & Workout Log App we previously worked on.

IMPORTANT:

* Start the requirements analysis for this product independently.
* Do NOT copy personas, assumptions, requirements, scenarios, or features from the Fitness & Workout Log App unless they are genuinely applicable and you explicitly justify why.
* Do NOT work on the Fitness & Workout Log App anymore unless I explicitly ask you to.
* This is the INITIAL Claude version for the Recipe & Meal Planning Portal.
* Do not generate or pretend to have generated the other AI model's version.
* The second AI model will be handled independently by another teammate.
* Do not compare Claude against the other model because you have not seen its output.

The purpose of this prompt is to generate a strong first version that I can later ask you to critically review and polish in a separate iteration.

---

# 1. ACADEMIC CONTEXT

This is a college project for my CS3365 Engineering Systems / Software Products course.

The project is intended to simulate the requirements elicitation and analysis process that takes place during the early stages of software product development.

The assignment specifically asks students to use AI models as a type of **Product Manager simulator** to help generate and refine:

* Product visions
* Personas
* Scenarios
* Problem statements
* Assumptions
* Functional requirements
* Non-functional requirements
* User stories
* Requirements sizing

Students are responsible for critically reviewing the AI-generated material rather than blindly accepting it.

Therefore, you should behave as a professional Product Manager and requirements engineer, while clearly identifying assumptions and areas requiring human validation.

---

# 2. REQUIRED REFERENCE

The main conceptual reference is:

Ian Sommerville, **Engineering Software Products**, 1st Edition, Pearson, 2019.

Official website:

https://iansommerville.com/engineering-software-products/

I have specifically been instructed to review **Chapter 3** carefully.

Use Chapter 3 principles to guide the development of:

* Product visions
* Personas
* Scenarios
* User requirements
* User stories
* Requirements elicitation
* Assumptions
* Requirements analysis

Do not invent quotations, page numbers, or textbook claims.

If you do not have access to the complete chapter, rely on established requirements-engineering principles and clearly distinguish them from assumptions.

---

# 3. PRODUCT IDEA

The product idea provided by the assignment is:

## Recipe & Meal Planning Portal

> Searchable UI where users filter recipes by dietary tags, plan weekly meals, and auto-generate grocery lists.

This should be treated as the foundation of the product.

The core product should revolve around three connected activities:

1. Discovering/searching recipes.
2. Planning meals for a week.
3. Generating a grocery/shopping list from the planned meals.

The product should have a clear relationship between these three areas.

For example:

**Recipes → Meal Plan → Grocery List**

However, do not assume that every possible recipe or nutrition feature belongs in the product.

---

# 4. SCOPE CONTROL

Keep the product focused.

Do NOT automatically turn it into a complete nutrition, health, restaurant, or social-media platform.

Unless strongly justified by the product vision, do NOT introduce features such as:

* Calorie tracking
* Medical dietary advice
* Personalized medical nutrition plans
* Social media feeds
* Recipe influencer profiles
* Restaurant ordering
* Grocery delivery
* Payment processing
* AI nutritionist
* Medical recommendations
* Fitness tracking
* Exercise tracking
* Complex nutrition coaching

The product should primarily support:

### Recipe discovery

Finding recipes and filtering them according to relevant dietary characteristics.

### Meal planning

Organizing recipes into a weekly meal plan.

### Grocery-list generation

Automatically creating a shopping list based on the planned recipes.

Additional functionality may be introduced if it is necessary to support these core capabilities, but avoid scope creep.

---

# 5. ACT AS A PRODUCT MANAGER

Do not simply generate a generic list of features.

Act as if you are responsible for defining the product requirements before a software development team begins implementation.

You should:

* Identify realistic users.
* Identify their problems.
* Identify their goals.
* Identify relevant scenarios.
* Make reasonable assumptions.
* Explicitly document assumptions.
* Maintain traceability between problems and requirements.
* Avoid unnecessary features.
* Control scope.
* Identify ambiguities.
* Ensure functional requirements solve actual user problems.
* Ensure personas are meaningful rather than superficial.
* Ensure scenarios provide enough context.
* Ensure requirements are specific and testable.
* Consider realistic edge cases.
* Distinguish confirmed requirements from assumptions and proposed decisions.

Think like a professional Product Manager preparing the product definition for a development team.

---

# 6. FIRST TASK — PRODUCT VISION

Create an initial Product Vision for the Recipe & Meal Planning Portal.

The vision should clearly explain:

* What the product is.
* Who it is intended for.
* What problem it addresses.
* Why that problem matters.
* What value the product provides.
* How users interact with the product at a high level.
* What makes the product useful.
* What the core product scope is.
* What the product is explicitly NOT intended to solve, where useful for controlling scope.

The vision should be appropriate for an academic requirements document.

Do not write it like an advertising slogan.

Do not make unsupported claims about market demand.

Do not invent statistics or user research.

---

# 7. PRODUCT VISION REVIEW

After creating the initial vision, critically review it.

Look for:

* Ambiguous language.
* Excessive scope.
* Missing user needs.
* Unsupported assumptions.
* Features disguised as vision statements.
* Lack of clear user value.
* Poor connection between recipes, meal planning, and grocery lists.

Then provide an improved version.

Do NOT wait for me to tell you what is wrong.

Act as your own Product Manager reviewer.

---

# 8. AI INTERACTION / DEVELOPMENT LOG

The assignment requires a detailed record of AI interactions.

For this first version, create a section documenting the development of the product vision.

Because this is the initial Claude iteration, document the process honestly.

Use:

### Iteration 1 — Initial Product Vision

Explain what information was provided and what the initial vision focused on.

### Initial Critique

Explain the weaknesses identified in the initial version.

### Iteration 2 — Refined Product Vision

Present the improved version and explain what changed.

IMPORTANT:

Do not falsely claim that these were separate real-world conversations if they were not.

Describe them as stages of the AI-assisted development process.

Include this table:

| Iteration | Purpose | Main Changes | Reason |
| --------- | ------- | ------------ | ------ |

---

# 9. PERSONAS

Based on the final/refined product vision, create an appropriate set of personas.

Use principles from Sommerville Chapter 3 and good requirements-engineering practice.

Do not create personas simply by changing:

* Age
* Gender
* Occupation

Each persona should represent a meaningful user type with relevant differences in:

* Goals
* Motivations
* Behaviors
* Meal-planning habits
* Cooking habits
* Problems
* Dietary needs/preferences
* Time constraints
* Shopping habits
* Technology usage
* Expectations from the product

Determine the appropriate number of personas yourself.

Do not create too many.

Every persona must have a reason for existing.

---

# 10. PERSONA FORMAT

For each persona include:

## Persona Name

Use a realistic descriptive name.

## Persona Type

For example:

* Primary user
* Secondary user

Use these classifications only where meaningful.

## Background

Relevant context about the person.

## Goals

What they are trying to accomplish.

## Motivations

Why those goals matter.

## Behaviors

How they currently search for recipes, plan meals, and shop for ingredients.

## Pain Points

What makes their current process difficult.

## Needs

What they need from the product.

## Usage Context

When, where, and how they are likely to use the portal.

## Product Expectations

What they expect the product to help them accomplish.

## Representative Scenario

Give a short realistic scenario demonstrating how the persona would use the product.

---

# 11. PERSONA QUALITY REVIEW

After creating the personas, perform a review.

Check:

* Are they genuinely different?
* Are they realistic?
* Are they useful for requirements elicitation?
* Are they sufficiently detailed?
* Are any redundant?
* Are important user types missing?
* Do they collectively cover the product vision?

If necessary, revise the personas.

Do not simply keep every persona you initially generated.

---

# 12. PERSONA-TO-REQUIREMENT TRACEABILITY

Create:

| Persona | Main Problem | Main Goal | Relevant Product Capabilities |
| ------- | ------------ | --------- | ----------------------------- |

This should show how the personas connect to the product's functionality.

---

# 13. 1-PAGERS / EPICS

Create multiple 1-pagers for the Recipe & Meal Planning Portal.

Do NOT force the entire product into one 1-pager.

Identify a logical breakdown into feature/problem areas.

The likely areas may include:

* Recipe discovery and filtering
* Recipe details and selection
* Weekly meal planning
* Grocery-list generation
* Grocery-list organization

However, do not blindly use these categories.

Determine the appropriate 1-pagers based on the actual product vision and personas.

The 1-pagers should collectively provide sufficient coverage of the product.

---

# 14. REQUIRED 1-PAGER TEMPLATE

For every 1-pager use the following structure:

# [Initiative Name] 1-pager

## PROBLEM

One to two paragraphs describing the initiative.

This should roughly correspond to what Sommerville refers to as a scenario/problem context.

The problem statement should:

* Be grounded in one or more personas.
* Describe the user's situation.
* Explain the problem.
* Explain why the problem matters.
* Provide enough context to understand the need.
* Avoid simply describing a feature.
* Avoid prematurely specifying technical implementation.

The problem should describe what the user is trying to accomplish and what prevents them from doing so efficiently.

---

## ASSUMPTIONS

Identify assumptions necessary to complement the product vision.

Potential areas may include:

* Recipe data
* Dietary tags
* Ingredient representation
* Serving sizes
* Units
* Ingredient quantities
* Meal types
* Days of the week
* Grocery-list behavior
* Recipe availability
* User accounts
* Saving recipes
* Editing meal plans
* Ingredient aggregation
* Duplicate ingredients
* Unit conversion

Only include assumptions that are actually relevant.

For every important assumption, briefly explain why it is necessary.

Do not present assumptions as confirmed requirements.

---

# 15. FUNCTIONAL REQUIREMENTS

Write functional requirements using the required user-story format:

> As a [persona], I want to [perform task] so that I can/in order to [description].

Each story should:

* Identify a persona.
* Describe a clear action.
* Describe the user's value.
* Be specific.
* Be testable.
* Be relevant to the problem.
* Stay within product scope.

Assign unique story IDs across the entire product:

* RP-01
* RP-02
* RP-03
* etc.

Do not restart numbering for each 1-pager.

---

# 16. SUPPORTING DETAILS

Under each user story, include appropriate supporting details.

These may include:

* Required information
* Business rules
* Validation
* User interactions
* Important edge cases
* Empty states
* Editing behavior
* Deletion behavior
* Relevant constraints

Do not turn every detail into a separate user story.

Do not include unnecessary technical implementation instructions.

---

# 17. EXAMPLES OF AREAS TO CONSIDER

Use these as areas for analysis, NOT as mandatory features.

### Recipe Discovery

Consider:

* Search
* Dietary filtering
* Recipe categories
* Ingredients
* Preparation time
* Servings
* Recipe details

### Meal Planning

Consider:

* Weekly structure
* Breakfast/lunch/dinner or other meal types
* Adding recipes to specific days
* Replacing meals
* Removing meals
* Reviewing the weekly plan

### Grocery Lists

Consider:

* Generating a list from planned recipes.
* Combining ingredients.
* Handling duplicate ingredients.
* Organizing items.
* Marking items as obtained.
* Adjusting the list if the meal plan changes.

Only include functionality justified by actual user needs.

---

# 18. FUNCTIONAL REQUIREMENT QUALITY CONTROL

After creating the functional requirements, critically review them.

Evaluate:

### Coverage

Do the stories adequately solve the problem?

### Persona alignment

Does every story correspond to a legitimate user?

### User value

Does every story explain why the user needs it?

### Specificity

Is the requirement clear enough for a development team?

### Testability

Could the requirement eventually be verified?

### Scope

Is the requirement genuinely part of the product?

### Redundancy

Are any stories duplicates?

### Dependencies

Are dependencies between stories apparent?

### Missing requirements

Is anything essential missing?

Revise the requirements if needed.

---

# 19. NON-FUNCTIONAL REQUIREMENTS

For each 1-pager, identify relevant non-functional requirements.

Consider, where appropriate:

* Performance
* Usability
* Accessibility
* Security
* Privacy
* Reliability
* Availability
* Data integrity
* Compatibility

Do not automatically include every category.

Requirements should be reasonably measurable where practical.

Avoid vague statements such as:

> "The portal should be easy to use."

Instead define an appropriate measurable expectation where justified.

Do not invent arbitrary numerical targets simply to appear technical.

If a value is a proposed target rather than an established requirement, clearly identify it as requiring validation.

---

# 20. REQUIREMENTS SIZING

The assignment requires:

> Select one type of metric to assess effort and provide an initial estimate for each of the stories in the functional requirements. Explain the rationale to assign each size.

Choose ONE consistent sizing methodology.

Story points may be appropriate.

If using story points, clearly define the scale.

For example:

* 1 = trivial
* 2 = very small
* 3 = small
* 5 = moderate
* 8 = complex
* 13 = very complex

But use your judgment regarding whether this is the most appropriate approach.

For every functional requirement include:

| Story ID | User Story | Size | Rationale |
| -------- | ---------- | ---: | --------- |

The rationale should consider:

* Complexity
* UI complexity
* Data handling
* Validation
* Dependencies
* Uncertainty
* Edge cases
* Integration
* Relative implementation effort

Do not confuse user importance with development effort.

The sizing should represent relative effort/complexity.

Make clear that these are initial estimates and may change during later requirements analysis.

---

# 21. REQUIREMENT TRACEABILITY

After all 1-pagers, create:

| Product Vision Need | Persona | Problem / Scenario | 1-Pager | Functional Requirement IDs |
| ------------------- | ------- | ------------------ | ------- | -------------------------- |

Ensure that:

**Vision → Persona → Problem → Requirement**

forms a coherent chain.

Identify any gaps.

---

# 22. OVERALL PROJECT MANAGER QUALITY AUDIT

Before finalizing the document, review your own work as a strict Product Manager.

### Product Vision

* Clear?
* User-centered?
* Appropriate scope?
* Connected to the product concept?

### Personas

* Realistic?
* Specific?
* Meaningfully different?
* Sufficient coverage?

### Problems / Scenarios

* Real user problems?
* Enough context?
* Connected to personas?
* Appropriate assumptions?

### Functional Requirements

* User-centered?
* Specific?
* Testable?
* Complete?
* No unnecessary implementation detail?

### Non-Functional Requirements

* Relevant?
* Reasonably measurable?
* No arbitrary claims?

### Sizing

* One consistent metric?
* Every story sized?
* Rationale provided?
* Reasonable relative estimates?

### Traceability

* Every major requirement connected to a user need?
* No orphan requirements?
* No unexplained features?

If problems are identified, correct them before producing the final output.

---

# 23. OPEN QUESTIONS / HUMAN VALIDATION

At the end, identify a concise list of things that I should personally validate.

Examples might include:

* Whether users need accounts.
* Which dietary tags should initially be supported.
* Whether ingredient quantities should automatically scale with serving size.
* How ingredient units should be normalized.
* Whether grocery-list items should be grouped by category.
* Whether users can create their own recipes.
* Whether recipes are provided by an existing dataset or manually entered.

Only include questions that actually affect the requirements.

Separate them into:

### High Priority

### Medium Priority

### Low Priority

Do not overwhelm me with unnecessary questions.

---

# 24. STUDENT EVALUATION SECTION

At the end, create:

# Student Evaluation of Claude's Output

Leave the actual answers blank.

Give me prompts I can evaluate later, such as:

* What did Claude do well?
* What did Claude misunderstand?
* Which personas were most useful?
* Which requirements need revision?
* Were the scenarios sufficiently detailed?
* Were assumptions appropriate?
* Was the sizing rationale reasonable?
* What would I change before submission?
* What did I learn from using Claude?
* Overall evaluation:

Do NOT answer these questions for me.

---

# 25. DOCUMENT STRUCTURE

The final output should follow this structure:

# Recipe & Meal Planning Portal — Claude Initial Product Definition

## 1. Product Vision

### Initial Vision

### Vision Critique

### Refined Product Vision

## 2. AI Interaction / Product Vision Development Log

Include the iteration table.

## 3. Personas

Include all final personas.

## 4. Persona-to-Requirement Traceability

Include the table.

## 5. 1-Pagers / Epics

Include all appropriate 1-pagers using the required format.

## 6. Overall Requirement Traceability Matrix

Include the table.

## 7. Project Manager Quality Audit

Include findings and corrections.

## 8. Open Questions / Human Validation

Include only important unresolved decisions.

## 9. Student Evaluation of Claude's Output

Leave this for me.

---

# 26. WRITING QUALITY

The final output should be appropriate for a university software engineering project.

Avoid generic AI language such as:

* "seamless experience"
* "revolutionary"
* "innovative platform"
* "enhance user satisfaction"
* "user-friendly"
* "streamline everything"

unless there is a specific requirement behind the statement.

Prefer concrete requirements-engineering language.

Do not write marketing copy.

---

# 27. DO NOT INVENT INFORMATION

I am responsible for reviewing the final document.

Therefore:

* Do not fabricate user research.
* Do not invent statistics.
* Do not claim that users were interviewed.
* Do not fabricate textbook quotations.
* Do not fabricate sources.
* Do not claim that another AI generated content you have not seen.
* Do not present assumptions as facts.
* Do not invent requirements supposedly provided by my professor.
* Do not make unsupported claims about the market.

When something requires validation, label it:

**Requires Human Validation**

---

# 28. IMPORTANT: THIS IS THE FIRST VERSION

This is the INITIAL Claude version of the Recipe & Meal Planning Portal.

Do not attempt to create a fictional second-model comparison.

Do not claim this is the final version.

The next stage will be a separate prompt where I will ask you to review and polish this version, similar to how we refined the Fitness & Workout Log App.

For now, focus on producing a strong, complete first version that gives us enough material to critique later.

---

# 29. FINAL QUALITY TEST

Before presenting the document, ask yourself:

> Can a software development team understand who the users are, what problems they experience, what the product is intended to accomplish, and what functionality is required?

Then ask:

> Can every functional requirement be traced to a user problem and persona?

Then ask:

> Does the product remain focused on recipe discovery, weekly meal planning, and grocery-list generation?

Then ask:

> Does this document demonstrate actual requirements analysis rather than simply listing application features?

If any answer is no, improve the document before presenting it.

---

# 30. FINAL INSTRUCTION

Produce the complete INITIAL Claude version of the:

**Recipe & Meal Planning Portal**

Include:

1. Product vision
2. Vision critique
3. Refined product vision
4. AI interaction/development log
5. Personas
6. Persona-to-requirement traceability
7. Multiple 1-pagers
8. Problem/scenario statements
9. Assumptions
10. Functional requirements/user stories
11. Supporting requirement details
12. Non-functional requirements
13. Requirements sizing and rationale
14. Overall requirement traceability matrix
15. Project Manager quality audit
16. Open questions/human validation
17. Student evaluation section

Use the assignment's required 1-pager format.

Maintain consistency across the entire document:

**Product Vision → Personas → Problems/Scenarios → Assumptions → Functional Requirements → Non-Functional Requirements → Sizing → Traceability**

Do not work on the Fitness & Workout Log App.

Do not generate the second AI model's version.

Do not fabricate information.

Produce the complete initial product definition now.


---

## Prompt 2 — Critical review and final version (produced the final version)

I have now received your initial complete draft for the **Recipe & Meal Planning Portal** portion of my CS3365 Engineering Systems / Software Products project.

Your task now is to take that initial draft and produce a **fully revised, polished, academically strong final Claude version**.

Do NOT simply rewrite the previous document with different wording.

Instead, act as a **senior Product Manager and Requirements Engineering specialist conducting a formal quality review of your own previous work**.

Your job is to identify weaknesses, inconsistencies, missing requirements, unnecessary scope, weak scenarios, weak personas, unclear assumptions, poor user stories, and questionable sizing decisions, and then actually FIX those problems.

The final result should be a complete revised document, not merely a critique.

We are working ONLY on:

# Recipe & Meal Planning Portal

> A searchable UI where users filter recipes by dietary tags, plan weekly meals, and automatically generate grocery lists.

Do NOT return to the Fitness & Workout Log App unless I explicitly ask you to.

---

# 1. ACADEMIC REFERENCE

Use the following as the primary conceptual reference:

Ian Sommerville, **Engineering Software Products**, 1st Edition, Pearson, 2019.

Official website:

https://iansommerville.com/engineering-software-products/

Pay particular attention to **Chapter 3**, especially principles related to:

* Product vision
* Personas
* Scenarios
* User requirements
* User stories
* Requirements elicitation
* Requirements analysis
* Assumptions
* User-centered specification

Do not invent quotations, page numbers, or claims from the book.

If you do not have access to the complete chapter, use established requirements-engineering principles and do not pretend otherwise.

---

# 2. THE ASSIGNMENT RUBRIC

The final version must specifically address the following grading criteria:

## Product vision statements

* Detailed log of AI interactions
* Critique of different generated versions
* Strong and well-documented product vision

## Personas

* Sufficient level of detail
* Appropriate number of personas
* Specific and meaningful personas

## Problem statements

* One problem/scenario per 1-pager
* Properly written scenarios
* Sufficient coverage of requirements
* Appropriate assumptions

## Functional requirements

* Written according to class and book best practices
* Sufficient coverage of the problem

## Sizing

* Rationale provided
* Appropriate metric assignment protocol

Optimize the final document specifically against these criteria.

---

# 3. REVIEW THE INITIAL VERSION CRITICALLY

Before producing the revised document, perform a complete internal review of the initial Claude version.

Do NOT assume that the previous version was correct.

Look specifically for:

* Generic AI-generated language
* Unnecessary features
* Scope creep
* Weak personas
* Redundant personas
* Problems that are actually feature descriptions
* Functional requirements that do not solve a stated problem
* Requirements without a clear persona
* Requirements without clear user value
* Requirements that are too vague
* Requirements that are overly technical
* Missing edge cases
* Missing assumptions
* Contradictory assumptions
* Poorly defined grocery-list behavior
* Poor relationship between meal planning and grocery generation
* Inconsistent terminology
* Requirements that do not belong in the product
* Inconsistent sizing
* Missing traceability

Then correct those issues in the final version.

---

# 4. PRODUCT SCOPE REVIEW

The product should remain focused on three interconnected core activities:

### 1. Recipe Discovery

Users search and filter available recipes according to relevant criteria such as dietary tags.

### 2. Weekly Meal Planning

Users select recipes and organize them into a weekly meal plan.

### 3. Grocery List Generation

The system derives a grocery list from the selected meal plan.

The core relationship should be:

**Recipes → Meal Plan → Grocery List**

Review the initial version carefully to make sure this relationship is logically represented throughout the document.

For example:

If a user adds a recipe to Monday dinner, the requirements should logically explain how that recipe contributes to the grocery list.

If the user changes or removes a meal, consider whether the grocery list should change accordingly.

If multiple planned recipes require the same ingredient, consider whether the requirements should explain how those ingredients are represented or combined.

Do not automatically add every possible feature.

---

# 5. SCOPE CONTROL

Remove or flag functionality that is not justified by the product concept.

The product should NOT automatically become:

* A calorie tracker
* A medical nutrition system
* A health diagnosis system
* A fitness application
* A restaurant ordering platform
* A grocery delivery service
* A social network
* A payment platform
* A professional nutritionist service
* A complex AI nutrition coach

Additional features may remain only if they are genuinely necessary to support the core product and are clearly justified.

If the previous draft included unnecessary functionality, remove it.

---

# 6. PRODUCT VISION REVIEW

Review the original and refined product vision from the first iteration.

Check whether the vision:

* Clearly identifies the product.
* Clearly identifies its users.
* Explains the problem.
* Explains the value.
* Establishes appropriate scope.
* Connects recipe discovery, meal planning, and grocery generation.
* Provides a useful foundation for personas.
* Provides a useful foundation for later requirements.
* Avoids marketing language.
* Avoids unsupported claims.

Then create an improved final vision.

The final vision should be concise enough to function as a product vision while being specific enough to guide requirements.

---

# 7. VISION ITERATION DOCUMENTATION

The assignment requires documentation of AI interactions.

Update the interaction history to accurately reflect the two Claude stages.

Use:

### Iteration 1 — Initial Claude Product Definition

Briefly explain the initial product vision and requirements-generation process.

### Iteration 2 — Critical Review and Refinement

Explain:

* What weaknesses were identified.
* What was changed.
* Why it was changed.
* How the revised version improves the requirements.

Create:

| Iteration | Purpose | Problems Identified | Changes Made | Expected Improvement |
| --------- | ------- | ------------------- | ------------ | -------------------- |

IMPORTANT:

Do not fabricate exact interactions that did not occur.

Describe the iterations accurately as stages of the Claude-assisted development process.

---

# 8. PERSONA REVIEW

Review every persona from the initial version.

For each persona ask:

### Is this actually a meaningful user type?

A persona should not exist merely because it represents a different age or occupation.

### Does this persona have a distinct problem?

### Does this persona have different goals or behaviors?

### Does this persona generate different requirements?

### Does the persona help explain why the product exists?

### Does the persona represent a realistic user of this product?

### Is the persona unnecessarily detailed?

### Is the persona redundant with another persona?

If two personas have essentially identical needs and behaviors, consider combining them.

If an important user group is missing, add it only if justified.

Do not increase the number of personas simply to make the document appear more sophisticated.

---

# 9. PERSONA FORMAT

For every final persona, use:

## Persona Name

## Persona Type

## Background

## Goals

## Motivations

## Behaviors

## Pain Points

## Needs

## Usage Context

## Product Expectations

## Representative Scenario

The scenario should demonstrate how that specific persona would realistically use the Recipe & Meal Planning Portal.

---

# 10. PERSONA QUALITY CHECK

After revising the personas, verify:

* Every persona connects to the product vision.
* Every persona has a meaningful problem.
* Every persona contributes to requirements.
* Personas are not redundant.
* The set provides sufficient coverage.
* The personas are specific enough to drive requirements.

If a persona does not contribute meaningfully to requirements, revise or remove it.

---

# 11. PERSONA-TO-REQUIREMENT TRACEABILITY

Update the following table:

| Persona | Main Problem | Main Goal | Relevant Product Capabilities |
| ------- | ------------ | --------- | ----------------------------- |

Make sure it reflects the FINAL version rather than simply copying the previous table.

---

# 12. REVIEW EVERY 1-PAGER

This is one of the most important parts of the revision.

For every 1-pager, review all sections:

* Problem
* Assumptions
* Functional Requirements
* Non-Functional Requirements
* Sizing

Do not assume the existing 1-pagers are properly divided.

If two 1-pagers overlap heavily, reconsider the breakdown.

If an important product problem is not represented, add a 1-pager.

The final set should provide sufficient coverage without unnecessary fragmentation.

---

# 13. PROBLEM / SCENARIO REVIEW

The assignment specifically evaluates:

> Problem statements (1 per 1-pager)
>
> * Properly written scenarios
> * Sufficient coverage
> * Appropriate assumptions

Therefore, rewrite the PROBLEM section of every 1-pager where necessary.

Each problem should:

* Be written from the user's perspective.
* Identify a realistic situation.
* Explain what the user is trying to accomplish.
* Explain the difficulty/problem.
* Explain why the problem matters.
* Provide enough context.
* Connect directly to the relevant persona.
* Lead naturally into the requirements.

Avoid statements such as:

> "The system needs to allow users to..."

That describes a solution rather than a user problem.

Instead, describe the user's actual situation and need.

---

# 14. ASSUMPTION REVIEW

Review all assumptions.

For every assumption ask:

* Is it necessary?
* Does it affect the requirements?
* Is it clearly labeled as an assumption?
* Is it reasonable?
* Is it consistent with the rest of the product?
* Is it accidentally being treated as a confirmed requirement?

Pay particular attention to:

### Recipe Data

Where do recipes conceptually come from?

Do not invent a specific external database unless required.

### Dietary Tags

What does "dietary tag" mean at this level?

Potential examples might include vegetarian, vegan, gluten-free, dairy-free, etc., but do not claim these are officially required unless appropriately treated as an assumption/proposed scope.

### Ingredients

How are ingredients represented?

### Quantities and Units

How are ingredient quantities represented?

### Serving Sizes

Does a recipe have a number of servings?

Does meal planning affect quantities?

### Grocery Lists

How are duplicate ingredients handled?

### Meal Planning

What counts as a meal?

Breakfast, lunch, dinner, snacks, or another structure?

These are important because they can significantly affect later requirements.

---

# 15. FUNCTIONAL REQUIREMENT REVIEW

Review EVERY user story.

The required format is:

> As a [persona], I want to [perform task] so that I can/in order to [description].

For every story check:

### Persona

Is the user actually identifiable?

### Action

Is the task clear?

### Value

Is the reason for the task meaningful?

### Specificity

Is the story specific enough?

### Testability

Could the requirement eventually be verified?

### Relevance

Does it solve the problem described in the 1-pager?

### Scope

Does it belong to the Recipe & Meal Planning Portal?

### Redundancy

Does another story already cover it?

### Dependencies

Does it depend on another story?

### Completeness

Does the set of stories adequately cover the problem?

Revise weak stories rather than merely commenting on them.

---

# 16. PAY SPECIAL ATTENTION TO GROCERY-LIST REQUIREMENTS

The grocery-list functionality is a key part of this product and should be specified carefully.

Review whether the requirements adequately address the relationship between recipes and grocery items.

Consider, where relevant:

* Multiple recipes using the same ingredient.
* Ingredient quantities.
* Units.
* Serving sizes.
* Adding/removing meals from the plan.
* Updating the grocery list after meal-plan changes.
* Checking off grocery items.
* Organizing items.
* Empty grocery lists.
* Recipes with ingredients that are difficult to aggregate.

Do NOT automatically implement all of these.

Determine which ones are appropriate requirements versus assumptions or future considerations.

---

# 17. MEAL-PLANNING REQUIREMENTS

Review whether the requirements adequately describe the weekly planning experience.

Consider:

* Selecting a recipe.
* Assigning it to a day.
* Assigning it to a meal.
* Replacing a meal.
* Removing a meal.
* Reviewing the weekly plan.
* Handling an incomplete plan.
* Updating the grocery list when the plan changes.

Again, only include functionality justified by the product scope.

---

# 18. RECIPE DISCOVERY REQUIREMENTS

Review whether users can realistically find the recipes they need.

Consider:

* Search.
* Dietary filters.
* Other useful filters if justified.
* Recipe details.
* Ingredient information.
* Preparation information.
* Servings.
* Selecting a recipe for meal planning.

Avoid turning the product into a massive recipe marketplace.

---

# 19. SUPPORTING DETAILS

Review the supporting details beneath each user story.

They should clarify:

* Expected behavior.
* Validation.
* Business rules.
* Important edge cases.
* User interactions.
* Relevant constraints.

Remove details that are simply implementation instructions.

Do not add technical architecture unless it is genuinely a requirement.

---

# 20. NON-FUNCTIONAL REQUIREMENT REVIEW

Review every non-functional requirement.

Only include relevant quality attributes such as:

* Performance
* Usability
* Accessibility
* Security
* Privacy
* Reliability
* Data integrity
* Availability
* Compatibility

Avoid generic statements.

For example:

Instead of:

> "The application should be fast."

Use a measurable expectation only when there is a reasonable basis for it.

Clearly distinguish:

**Confirmed requirement**

from:

**Proposed target requiring validation**

Do not invent arbitrary performance numbers.

---

# 21. REQUIREMENTS SIZING REVIEW

Use ONE consistent sizing methodology across the entire product.

If using story points, define the scale clearly.

For every functional requirement provide:

| Story ID | User Story | Size | Rationale |
| -------- | ---------- | ---: | --------- |

The rationale should reflect relative implementation effort and complexity.

Consider:

* UI complexity
* Data processing
* Validation
* Dependencies
* Edge cases
* Uncertainty
* Business rules
* Interactions with other product components

Do NOT size based on user importance.

Do NOT estimate hours unless specifically justified.

Ensure that similarly complex stories have reasonably similar sizes.

---

# 22. TRACEABILITY REVIEW

Update the complete traceability chain:

**Product Vision → Persona → Problem → Requirement → Size**

Create:

| Product Vision Need | Persona | Problem / Scenario | 1-Pager | Functional Requirement IDs |
| ------------------- | ------- | ------------------ | ------- | -------------------------- |

Check for:

### Orphan requirements

Requirements that cannot be traced to a user problem.

### Missing requirements

Important user needs that have no corresponding requirement.

### Unsupported features

Features that appear without being justified by the vision or personas.

### Broken relationships

Stories that do not solve the problem described in their 1-pager.

Fix all issues you identify.

---

# 23. SCOPE AND CONSISTENCY AUDIT

Perform a complete product-level audit.

Check:

### Terminology

Use the same terms throughout.

For example, decide whether the product uses:

* "meal plan"
* "weekly meal plan"
* "grocery list"
* "shopping list"

and use terminology consistently.

### Personas

Names and characteristics must remain consistent.

### Recipes

Recipe concepts should remain consistent.

### Meal Planning

The weekly planning model must be consistent.

### Grocery Lists

The generation/update rules must be consistent.

### Requirements

IDs must be unique.

### Sizing

The same metric must be used throughout.

### Assumptions

No assumptions should contradict one another.

### Scope

No unexplained features should appear.

Fix inconsistencies rather than merely mentioning them.

---

# 24. FINAL PRODUCT MANAGER AUDIT

Before presenting the final version, conduct a strict review.

## Product Vision

* Is it clear?
* Is it user-centered?
* Is the scope controlled?
* Does it establish the foundation for requirements?

## Personas

* Are they realistic?
* Are they meaningful?
* Are they sufficiently detailed?
* Are they non-redundant?
* Do they provide sufficient coverage?

## Scenarios

* Are they actual user situations?
* Do they provide enough context?
* Are they connected to personas?
* Do they naturally lead to the requirements?

## Assumptions

* Are assumptions explicit?
* Are they necessary?
* Are they reasonable?
* Are they clearly separated from requirements?

## Functional Requirements

* Are they user-centered?
* Are they specific?
* Are they testable?
* Do they provide sufficient coverage?
* Do they avoid unnecessary technical details?

## Non-Functional Requirements

* Are they relevant?
* Are they measurable where practical?
* Are proposed targets clearly identified?

## Sizing

* Is one metric used consistently?
* Does every story have a size?
* Does every size have a rationale?
* Are the relative estimates reasonable?

## Traceability

* Can every requirement be traced back to a user need?
* Are there missing requirements?
* Are there orphan requirements?

If any answer is unsatisfactory, revise the document before presenting it.

---

# 25. AI INTERACTION LOG

The assignment requires a detailed log of AI interactions.

Update the log so that it now reflects TWO Claude stages:

### Stage 1

Initial Recipe & Meal Planning Portal generation.

### Stage 2

Critical review and refinement.

Use the table:

| Stage | Purpose | Problems Identified | Changes Made | Expected Improvement |
| ----- | ------- | ------------------- | ------------ | -------------------- |

Do not fabricate exact prompts or interactions that did not occur.

---

# 26. SECOND MODEL COMPARISON

Do NOT compare Claude against another model.

The other model's output has not been provided to you.

Do not:

* Invent its output.
* Guess what it generated.
* Rank the models.
* Claim Claude performed better.
* Claim another model performed worse.

Instead include:

## Comparison Pending

State that the refined Claude version is ready to be compared against the independently generated output from the second AI model.

Do not perform that comparison.

---

# 27. FINAL DOCUMENT STRUCTURE

Produce the final revised document in exactly this general structure:

# Recipe & Meal Planning Portal — Claude Final Version

## 1. Product Vision

### 1.1 Initial Vision

### 1.2 Critique of Initial Vision

### 1.3 Refined / Final Product Vision

---

## 2. AI Interaction / Development Log

Include the two-stage table.

---

## 3. Personas

Include the final personas.

---

## 4. Persona-to-Requirement Traceability

Include the required table.

---

## 5. 1-Pagers / Epics

Include every final 1-pager.

For EACH one use:

# [Initiative Name] 1-pager

## PROBLEM

## ASSUMPTIONS

## FUNCTIONAL REQUIREMENTS

## NON-FUNCTIONAL REQUIREMENTS

## REQUIREMENTS SIZING

---

## 6. Overall Requirement Traceability Matrix

Include the complete table.

---

## 7. Project Manager Quality Audit

Explain the major corrections and improvements made.

---

## 8. Open Questions / Human Validation

Separate into:

### High Priority

### Medium Priority

### Low Priority

Only include genuinely important decisions.

---

## 9. Comparison Pending

Do not perform the comparison.

---

## 10. Student Evaluation of Claude's Output

Leave the actual evaluation for me.

Include only prompts/questions such as:

* What did Claude do well?
* What did Claude misunderstand?
* Which personas were most useful?
* Which requirements need modification?
* Were the scenarios appropriate?
* Were the assumptions reasonable?
* Was the sizing methodology appropriate?
* What would I change before submission?
* What did I learn from using Claude?
* Overall evaluation:

Do not answer these questions yourself.

---

# 28. WRITING QUALITY

The final document should look like a serious university-level requirements artifact.

Avoid generic AI language such as:

* "seamless experience"
* "revolutionary"
* "innovative platform"
* "enhance user satisfaction"
* "user-friendly"
* "streamline the entire process"

unless the statement is supported by a concrete requirement.

Prefer precise, concrete requirements-engineering language.

Do not write marketing copy.

---

# 29. DO NOT INVENT INFORMATION

Do not:

* Fabricate user interviews.
* Fabricate user research.
* Invent statistics.
* Invent textbook quotations.
* Invent sources.
* Invent market research.
* Claim that another AI model generated content you have not seen.
* Present assumptions as established facts.
* Claim that requirements were validated by real users.

If something requires human confirmation, label it:

**Requires Human Validation**

---

# 30. IMPORTANT: ACTUALLY MAKE THE CHANGES

Do NOT respond with a list such as:

> "Here are the areas I recommend improving..."

I need you to actually perform the improvements.

The main output must be the **complete revised final document**.

You may briefly summarize the most important improvements before the document, but the complete polished artifact is the priority.

---

# 31. FINAL SELF-TEST

Before giving me the final document, internally ask:

1. Does the product vision clearly define the problem and value?
2. Are the personas meaningful and non-redundant?
3. Does every 1-pager describe a genuine user problem?
4. Are assumptions explicitly identified?
5. Does every functional requirement correspond to a persona?
6. Does every story provide clear user value?
7. Are the requirements sufficiently specific and testable?
8. Does recipe discovery logically connect to meal planning?
9. Does meal planning logically connect to grocery-list generation?
10. Are grocery-list edge cases appropriately addressed?
11. Are non-functional requirements relevant?
12. Is sizing consistent and justified?
13. Can requirements be traced back to the product vision?
14. Is there unnecessary scope?
15. Are there contradictions?
16. Does the document satisfy the assignment rubric?
17. Does the result look like a requirements artifact rather than generic AI output?

If any answer is no, correct the problem before producing the final document.

---

# 32. FINAL INSTRUCTION

Produce the **fully revised and polished final Claude version** of the:

**Recipe & Meal Planning Portal**

The final version must include:

1. Product vision
2. Initial vision
3. Vision critique
4. Refined final vision
5. AI interaction/development log
6. Final personas
7. Persona traceability
8. Multiple appropriate 1-pagers
9. Problem/scenario statements
10. Assumptions
11. Functional requirements/user stories
12. Supporting requirement details
13. Non-functional requirements
14. Requirements sizing and rationale
15. Complete traceability matrix
16. Project Manager quality audit
17. Open questions/human validation
18. Comparison-pending section
19. Student evaluation section

Maintain the complete chain:

**Product Vision → Personas → Problems/Scenarios → Assumptions → Functional Requirements → Non-Functional Requirements → Sizing → Traceability**

Do NOT work on the Fitness & Workout Log App.

Do NOT fabricate the second AI model's output.

Do NOT invent research or textbook material.

Actually make the improvements rather than merely recommending them.

Produce the complete polished final document now.


---

## Prompt 3 — Follow-up message sent with Prompt 2 (1-pager length and sizing)

Also make the 1 pagers maximum 1 page and a half, it should include all detailed information but directly. Following the stated template and with all the information needed, including a short description and explanation of the sizing pero 1 pager.
```

