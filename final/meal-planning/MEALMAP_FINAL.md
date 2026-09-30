# MealMap — Recipe & Meal Planning Portal

Final ChatGPT specification for Project Milestone 1
Date: September 30, 2026 | Prompt reference: PROMPT_LOG.md, prompt 13.

## Product vision

**FOR** adults who want to develop healthier eating habits and support their personal fitness goals
**WHO** need help turning calorie and macronutrient targets into practical meals that fit their dietary preferences and activity level,
**THE** MealMap portal **IS A** nutrition-aware recipe discovery and weekly meal-planning application
**THAT** helps users establish adjustable nutrition targets using basic personal information and activity estimates, find suitable recipes, compare planned meals with their calorie and protein, carbohydrate, and fat goals, and generate a grocery list for the week.
**UNLIKE** using separate nutrition calculators, recipe collections, meal calendars, and shopping lists,
**OUR PRODUCT** connects personal nutrition goals with recipe portions, weekly meal plans, and grocery-list generation, helping users put their goals into everyday practice alongside their workout routine.

The individual meal planner is the assumed user and potential customer. The adoption value is turning personal nutrition targets into meals and shopping decisions with less manual coordination. Pricing, willingness to pay, and superiority over commercial alternatives remain unvalidated.

## Scope and writing basis

This specification covers optional body and energy estimates, user-controlled calorie and macro targets, recipe discovery, weekly meal planning, planned-nutrition comparisons, and grocery generation. MealMap and FitTrack have compatible audiences but remain separate assignment products. Shared accounts, automatic workout imports, calorie-burn estimates, food-consumption logging, grocery ordering, and automatic medical diet prescriptions are outside the prototype.

The vision follows Engineering Software Products Chapter 1, section 1.1; the fictional personas and scenarios follow Chapter 3, sections 3.1–3.2. The four portraits and their scenario drafts are preserved in the repository. The scenarios below are incorporated into the problem sections of the five initiative 1-pagers.

## Personas

These are fictional proto-personas, not research findings. Sebastian and Valeria reuse the workout portraits with proposed meal-planning details. Lucía and Carlos's meal needs are also assumptions for team review.

## Sebastian — 21, a recreational lifter planning around macro targets

Sebastian is a 21-year-old university student who has been weightlifting for about two years. He trains around classes and wants his meals to support his fitness routine. He cooks some meals at home but often chooses food at the last minute, making it difficult to tell whether his planned day matches his calorie and macronutrient targets. This is the same fictional Sebastian used in the FitTrack specification.

He is comfortable with phone applications and spreadsheets and understands basic calorie and macro terminology. He currently uses a separate calculator, recipe notes, and a shopping list. Changing a recipe portion means recalculating its nutrition and ingredients manually, so his meal calendar and shopping list often disagree.

MealMap would help Sebastian review an approximate energy starting point, enter or adjust his own calorie and protein, carbohydrate, and fat targets, and select recipe portions that fit his planned day. He would compare daily planned totals with his targets and generate the ingredients needed for the week. He does not expect a workout log to measure his exact calorie needs or the planner to guarantee a fitness outcome.

## Lucía — 24, a beginner learning to organize healthier meals

Lucía is a 24-year-old graduate student who recently began exercising regularly and wants a more consistent eating routine. She has a university degree but little experience planning meals or interpreting nutrition information. When busy, she repeats a few convenient meals and has trouble deciding what to prepare for the coming week.

Lucía uses messaging, university applications, and online shopping comfortably. Nutrition calculators confuse her because they display numbers without explaining whether they represent resting energy, daily energy, or a personal target. She knows her height and weight and can describe her activity level, but does not know how those inputs relate to meal planning.

MealMap would help Lucía understand separate BMI and energy estimates, review their inputs and limitations, and set adjustable planning targets. Clear serving information and plain explanations of protein, carbohydrates, and fat would help her choose recipes and arrange them into a weekly plan. She needs understandable starting information rather than an unexplained score or an automatically prescribed diet.

## Valeria — 29, a shift worker who prefers vegetarian meals

Valeria is a 29-year-old nurse with a university degree who trains recreationally and works rotating shifts. She prefers vegetarian meals and plans food ahead so she can bring meals to work. Her meal times change between shifts, and she needs a plan that can be rearranged without starting over. This is the same fictional Valeria represented in FitTrack.

She is comfortable with digital systems and uses her phone to collect recipes. However, searching separate recipe pages makes it difficult to compare portions and nutrition, and she sometimes discovers after planning that a recipe does not fit her vegetarian preference. Moving meals between days also makes her handwritten ingredient list unreliable.

MealMap would help Valeria filter tagged vegetarian recipes, inspect their ingredients and nutrition, and assign portions to dates and meal slots that fit her shifts. She would move or replace planned meals and see the daily totals and grocery list update. Dietary tags would guide discovery, while the ingredient details would let her check whether a recipe suits her preferences.

## Carlos — 46, a home cook who wants a straightforward plan and list

Carlos is a 46-year-old office administrator with vocational training who recently returned to the gym. He wants to organize his own meals alongside his exercise routine without managing several applications. He cooks at home and sometimes prepares multiple portions to eat on different days, but his shopping list often duplicates ingredients from separate recipes.

Carlos is comfortable with email and basic office software but is unfamiliar with nutrition dashboards. He uses paper recipes and a handwritten grocery list. Serving quantities can be unclear, and he finds manually adding ingredient amounts inconvenient. He is more interested in readable summaries and practical shopping information than complex charts.

MealMap would help Carlos inspect clearly labelled servings, place portions into his weekly plan, and produce a grocery list with matching ingredient quantities combined. He would check off items while shopping and consult a plain table of the day's planned calories and macros. He needs the list to follow his saved plan and explain changes when he edits the week's meals.

## Estimation and nutrition assumptions

- The prototype's optional estimates target adults aged 20–65 for general meal planning. This is a project scope choice, not a claim that the formulas are universally accurate in that range. Adolescents, pregnancy or breastfeeding, and medical nutrition management are outside the estimation scope. Users outside scope can use recipes and manually supplied targets without receiving these estimates.
- BMI = weight in kilograms / height in meters squared. Display the result to one decimal place, independently of energy estimates. BMI is a screening measure, not a diagnosis or direct body-fat measurement. Sources: [CDC: About BMI](https://www.cdc.gov/bmi/about/index.html) and [CDC: BMI FAQs](https://www.cdc.gov/bmi/faq/).
- Resting energy uses the simplified Mifflin–St Jeor equation: `10 × weight_kg + 6.25 × height_cm − 5 × age + coefficient`, where the published male coefficient is +5 and female coefficient is −161. Present the formula choice explicitly and allow users to skip it in favor of manual targets; do not infer it from a name or gender identity. Source: [Mifflin et al., 1990](https://pubmed.ncbi.nlm.nih.gov/2305711/).
- Daily energy is approximated as resting energy multiplied by a self-selected activity factor. Proposed prototype factors: low activity 1.2, light activity 1.375, moderate activity 1.55, high activity 1.725. Explain that these are coarse project assumptions requiring team validation; they are not coefficients established by the cited Mifflin paper. Activity labels describe overall routine, not exact workout volume.
- Display estimated daily energy as an approximate maintenance starting point, rounded to the nearest whole kcal. Do not automatically apply weight-loss deficits or weight-gain surpluses. BMI does not select calorie targets or macro ratios.
- Users set positive daily calorie targets and nonnegative protein, carbohydrate, and fat targets in grams. No universal macro ratio is prescribed. Targets are independent comparison values; recipe-provided calories remain the calorie source, so the interface does not demand exact equivalence between calories and gram targets. Review estimated information before explicitly accepting or editing a target.
- Recipe data comes from a small curated, permission-compatible catalog. Each recipe includes a source reference, dietary tags, defined serving yield, ingredients, units, calories, and protein/carbohydrate/fat grams. The team must select and verify that catalog before implementation; no live nutrition dataset has been imported here. Missing nutrition must be shown as unavailable, never silently treated as zero.
- Profile measurements, targets, and plans are private to the user. Only necessary inputs are retained. Account access is a shared infrastructure dependency and needs an implementation estimate before scheduling.

## Initiative coverage and traceability

| Initiative | Scenario basis | Stories | Points |
| --- | --- | --- | ---: |
| [Profile and nutrition targets](01_PROFILE_AND_TARGETS.md) | MM-SC-02 | MM-01–MM-03 | 13 |
| [Recipe discovery](02_RECIPE_DISCOVERY.md) | MM-SC-01, MM-SC-03 | MM-04–MM-06 | 11 |
| [Weekly meal planning](03_WEEKLY_MEAL_PLANNING.md) | MM-SC-01, MM-SC-03 | MM-07–MM-09 | 13 |
| [Planned nutrition comparison](04_NUTRITION_COMPARISON.md) | MM-SC-01, MM-SC-02 | MM-10–MM-12 | 11 |
| [Grocery list generation](05_GROCERY_LIST.md) | MM-SC-04 | MM-13–MM-15 | 13 |
| **Total** | | **15 stories** | **61** |

## Effort estimation protocol

Use story points on the scale 1, 2, 3, 5, 8, consistent with FitTrack. Points express relative effort, complexity, and uncertainty, not hours. MM-15, grocery check-off, is the 2-point reference: a bounded persisted state change with recovery behavior. Three points indicate moderate validation or retrieval; five points cover interacting operations or calculations; eight points indicate substantial uncertainty and a candidate for splitting.

Each teammate estimates independently, reveals estimates simultaneously, explains differences against the reference, discusses uncertainty, and re-estimates to agreement. Record agreed values and rationale, and re-estimate when assumptions change. These are initial AI estimates; no team agreement or velocity is claimed. Shared account infrastructure and catalog acquisition need separate planning estimates. The total is not a delivery schedule.

## AI interaction evidence and critique

[PROMPT_LOG.md](../../PROMPT_LOG.md) preserves user prompts and output summaries. Product vision Draft 01 emphasized convenience; user feedback redirected Draft 02 toward healthier lifestyles, adjustable macros, and basic estimates connected conceptually to workout habits. This package derives four personas, four scenarios, and five initiatives from that revised vision. Draft artifacts remain separate from the final files.

The user's nutrition-focused revision made the primary benefit more specific and motivated the estimator, target comparison, and nutrition-data requirements. ChatGPT preserved the original recipe search, weekly plan, and grocery requirements while adding those capabilities. Limitations are fictional user circumstances, unvalidated activity factors, no acquired recipe dataset, no customer testing, and effort estimates not reviewed by the team. The formula choices and detailed rules in this final version are proposed specification decisions, not findings from interviews.

This is the second ChatGPT product specification. The assignment still requires the teammate's two Claude specifications and an evidence-based comparison across actual outputs. No Claude output has been provided, so a model winner cannot be justified here.
