# MealMap — Scenarios, Draft 01

Date: September 30, 2026 | AI model: ChatGPT (OpenAI)
Persona reference: MEAL_PLANNING_PERSONAS_DRAFT_01.md.
Prompt reference: PROMPT_LOG.md, prompt 13.

These proposed narratives follow Engineering Software Products, Chapter 3, section 3.2 (PDF pages 105–107). They describe situations, problems, product use, and outcomes; they are not observed customer behavior. Calculation methods, activity factors, nutrition data, and grocery aggregation require explicit assumptions in the accompanying specification.

## MM-SC-01 — Sebastian turns macro targets into a meal plan

Sebastian is planning meals before shopping for a week of classes and gym visits. His recipe notes and separate nutrition calculator make it difficult to see whether his chosen portions fit his targets. He opens MealMap, reviews an approximate energy estimate, and enters his chosen daily calorie and macro targets. He searches recipes, inspects nutrition per serving, and adds portions to the week's meal slots.

When one day's planned protein is below his target, Sebastian compares another recipe and adjusts his selections. MealMap recalculates that day's planned totals and the weekly grocery quantities. He saves a plan he can review alongside his workout routine, understanding that planned nutrition is not a record of what he actually ate and that no workout calories have been automatically added.

## MM-SC-02 — Lucía understands estimates before selecting targets

Lucía wants to start planning meals but does not understand the numbers shown by other nutrition calculators. She opens MealMap and enters her age, height, and weight, then reviews the optional BMI explanation. For an energy estimate, she supplies the additional formula inputs and selects a described activity level. She can see how the estimate was produced and that BMI is separate from calorie needs.

Lucía reviews the approximate energy starting point before choosing her planning targets. She enters calorie and macro values she wants to use, with plain unit labels and explanations, and saves them. If she later changes her activity level, MealMap shows the revised estimate without silently replacing her selected targets or existing meal plan. She remains in control of the assumptions used in her planning.

## MM-SC-03 — Valeria rearranges vegetarian meals around shifts

Valeria receives a new shift schedule after she has started planning the week. She searches MealMap with a vegetarian filter and inspects recipe ingredients and nutrition before adding them to her plan. She assigns recipes and portions to dates and meal slots, choosing meals she can take to work.

After a shift changes, Valeria moves one meal to another day and replaces another recipe. The planner updates both days' totals and generates grocery quantities from the revised saved plan. She does not have to copy ingredients between separate lists or assume that a recipe's tag guarantees it meets every dietary need.

## MM-SC-04 — Carlos shops from an aggregated ingredient list

Carlos plans several home-cooked meals and wants to buy the right ingredient amounts without adding them manually. He chooses recipe portions for the week and opens the grocery list generated from his saved plan. Matching ingredients with compatible units are combined, while incompatible quantities remain separate. The list labels amounts and units clearly.

Carlos checks off items as he shops. Before finishing, he changes the servings of one planned meal, then regenerates the list. MealMap tells him which quantities changed and resets affected items to unchecked so an old check mark does not imply he has enough of the new amount. The list stays connected to his plan instead of becoming a stale copy.
