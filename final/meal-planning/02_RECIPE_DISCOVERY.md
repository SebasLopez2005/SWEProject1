# Recipe Discovery 1-pager

Product: MealMap | Version: Final ChatGPT specification | September 30, 2026
Scenario basis: MM-SC-03; personas are in MEALMAP_FINAL.md.

## PROBLEM

Valeria receives a new shift schedule after she has started planning the week. She searches MealMap with a vegetarian filter and inspects recipe ingredients and nutrition before adding them to her plan. She assigns recipes and portions to dates and meal slots, choosing meals she can take to work.

After a shift changes, Valeria moves one meal to another day and replaces another recipe. The planner updates both days' totals and generates grocery quantities from the revised saved plan. She does not have to copy ingredients between separate lists or assume that a recipe's tag guarantees it meets every dietary need.

## ASSUMPTIONS

- Use the curated catalog and provenance requirements in MEALMAP_FINAL.md. User-submitted recipes and live external search are deferred.
- Search matches recipe titles without case sensitivity. Multiple selected dietary tags use AND semantics: a result must have every selected tag.
- Recipe ingredients and nutrition are defined per catalog serving; the base recipe yield determines ingredient quantities per serving.
- Tags are discovery aids, not guarantees of medical suitability or allergen safety. Ingredient details remain visible.
- Nutrition comparisons require a clear indication of which nutrition fields are missing.

## FUNCTIONAL REQUIREMENTS

### MM-04

- As Valeria, I want to search recipe names and filter by dietary tags so that I can find options that fit my meal preferences.

- Combine a title query with all selected tags and let the user clear filters.
- Show matching recipe names and serving information; explain when no recipes match instead of silently removing filters.

### MM-05

- As Carlos, I want to inspect a recipe’s servings, ingredients, nutrition, and source so that I can decide whether it fits my plan and understand its quantities.

- Show base yield, ingredients with quantities and units, preparation instructions, nutrition per serving, and provenance reference.
- Label missing nutrition as unavailable; never substitute zero or imply a dietary tag verifies suitability.

### MM-06

- As Sebastian, I want to preview the nutrition and ingredients for a selected portion so that I can compare a practical amount before adding it to my plan.

- Accept positive portion counts in quarter-serving increments up to 20 servings, a technical prototype limit; scale known values by portion count.
- Display units and missing-data indicators and pass the selected recipe and portion to the planner only when the user chooses to add it.

## NON-FUNCTIONAL REQUIREMENTS

- With a catalog of 500 recipes and 20 concurrent users, search results must display within 2 seconds for at least 95% of 100 requests on a stable connection.
- Search, filters, and recipe details must work without horizontal scrolling at viewport widths of 360–430 CSS pixels.
- Every catalog recipe must retain its source reference and serving basis; verify missing-data labels for a recipe with an absent macro field.

## REQUIREMENTS SIZING

Metric: **story points**, using the independent-estimate/discuss/re-estimate protocol in [MEALMAP_FINAL.md](MEALMAP_FINAL.md#effort-estimation-protocol). Initial AI estimates require team review; they are not team commitments or measured implementation results.

| Story | Points | Rationale |
| --- | ---: | --- |
| MM-04 | 3 | Combined filtering and empty states over a bounded catalog. |
| MM-05 | 3 | Structured recipe presentation with source and incomplete-data states. |
| MM-06 | 5 | Consistent scaling of ingredients and nutrition plus a handoff to planning. |
| **Total** | **11** | |
