# Planned Nutrition Comparison 1-pager

Product: MealMap | Version: Final ChatGPT specification | September 30, 2026
Scenario basis: MM-SC-01; personas are in MEALMAP_FINAL.md.

## PROBLEM

Sebastian is planning meals before shopping for a week of classes and gym visits. His recipe notes and separate nutrition calculator make it difficult to see whether his chosen portions fit his targets. He opens MealMap, reviews an approximate energy estimate, and enters his chosen daily calorie and macro targets. He searches recipes, inspects nutrition per serving, and adds portions to the week's meal slots.

When one day's planned protein is below his target, Sebastian compares another recipe and adjusts his selections. MealMap recalculates that day's planned totals and the weekly grocery quantities. He saves a plan he can review alongside his workout routine, understanding that planned nutrition is not a record of what he actually ate and that no workout calories have been automatically added.

## ASSUMPTIONS

- Each recipe entry contributes its per-serving calories and macro grams multiplied by its planned portion count.
- Sum unrounded values and display whole kcal and macro grams to one decimal place. Do not derive recipe calories from macro grams.
- Comparisons use the latest saved user targets; target changes do not replace recipe entries. Targets need not exist to display planned totals.
- When any planned entry lacks a nutrient, mark that day's nutrient total incomplete and present known subtotal only; do not present a full target comparison for that nutrient.
- A day with no planned recipes is labelled unplanned rather than scored as nutritional failure. A zero macro target permits an absolute difference, not a percentage calculation.

## FUNCTIONAL REQUIREMENTS

### MM-10

- As Sebastian, I want to see daily planned calorie and macro totals against my saved targets so that I can identify where my meal plan differs from my goals.

- For each planned day, show calories, protein, carbohydrate, and fat totals and signed differences from corresponding saved targets.
- Without targets, show totals and a prompt to set targets; with incomplete data, label affected subtotals and suppress misleading full comparisons.

### MM-11

- As Sebastian, I want to see nutrition totals update after changing a meal or portion so that I can evaluate alternatives without recalculating by hand.

- Reflect additions, removals, moves, replacements, and portion changes in every affected day after the change succeeds.
- Show which meal entries contribute to a selected day’s totals so the values can be inspected.

### MM-12

- As Lucía, I want to read plain explanations of targets and planned totals so that I can interpret the comparison without confusing it with actual intake.

- Provide unit-labelled text tables and explain calorie and macro fields; distinguish an estimate, chosen target, planned total, and recorded intake.
- Explain incomplete nutrition data and unplanned days without assuming zero intake or promising a health outcome.

## NON-FUNCTIONAL REQUIREMENTS

- Following a successful saved-plan update, displayed totals must refresh within 1 second in at least 95% of 100 stable-connection checks with a 100-entry week.
- Displayed totals must match independent calculations from stored serving values within final display rounding; include fractional portions, a move between dates, a zero target, and missing nutrition in validation.
- Comparisons must remain understandable without color and expose the same values in a keyboard-accessible text table.

## REQUIREMENTS SIZING

Metric: **story points**, using the independent-estimate/discuss/re-estimate protocol in [MEALMAP_FINAL.md](MEALMAP_FINAL.md#effort-estimation-protocol). Initial AI estimates require team review; they are not team commitments or measured implementation results.

| Story | Points | Rationale |
| --- | ---: | --- |
| MM-10 | 5 | Aggregation, target retrieval, and several missing-data and zero-target states. |
| MM-11 | 3 | Reuses defined aggregation while connecting planner changes and source entries. |
| MM-12 | 3 | Accessible comparison presentation and consistent explanations across states. |
| **Total** | **11** | |
