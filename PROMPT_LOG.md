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
