# Weekly Meal Planning 1-pager

Product: MealMap | Version: Final ChatGPT specification | September 30, 2026
Scenario basis: MM-SC-03; personas are in MEALMAP_FINAL.md.

## PROBLEM

Valeria receives a new shift schedule after she has started planning the week. She searches MealMap with a vegetarian filter and inspects recipe ingredients and nutrition before adding them to her plan. She assigns recipes and portions to dates and meal slots, choosing meals she can take to work.

After a shift changes, Valeria moves one meal to another day and replaces another recipe. The planner updates both days' totals and generates grocery quantities from the revised saved plan. She does not have to copy ingredients between separate lists or assume that a recipe's tag guarantees it meets every dietary need.

## ASSUMPTIONS

- Plans belong to one user and represent intended meals, not confirmed intake. Shared household editing is deferred.
- A week runs Monday–Sunday in the user-selected local calendar; breakfast, lunch, dinner, and snack are organizational slots, not prescribed eating times.
- Multiple recipe entries per slot are permitted. Each entry has a recipe identifier, date, slot, and positive portion count under the discovery rules.
- Saved plans retain the recipe's serving and nutrition/ingredient version used when added, so later catalog changes do not silently change totals. Replacing an entry explicitly adopts current recipe data.
- No automatic meal selection or optimization is required. Profile changes do not rewrite a saved plan.

## FUNCTIONAL REQUIREMENTS

### MM-07

- As Sebastian, I want to assign recipes and portions to meals in a selected week so that I can turn nutrition targets into a practical plan.

- Add catalog recipes to a date and meal slot, preserving the selected portion count and recipe version.
- Save and reopen the week with the same entries; failed saves preserve the working plan and provide retry without duplicated entries.

### MM-08

- As Valeria, I want to move, replace, or remove planned meals so that I can adapt the week when my shifts change.

- Move an entry to another date or slot, replace its recipe/portion, or remove it after confirmation; allow cancellation.
- Refresh affected day totals and mark an already generated grocery list as needing refresh; a failed change retains the previous saved plan.

### MM-09

- As Carlos, I want to review and change the portions of a saved meal so that I can plan the amount I intend to prepare and eat.

- Show all week entries with recipe names, dates, slots, and portion counts; allow a validated portion update.
- Use the revised portion consistently in planned nutrition and grocery quantities; reject invalid portions without changing the saved entry.

## NON-FUNCTIONAL REQUIREMENTS

- Only owners may view or change plans, including by guessed plan identifiers.
- In a stable-connection check with 20 concurrent users and a week containing 100 entries, save/reopen must complete within 2 seconds for at least 95% of 100 operations.
- Failed operations must not produce a partially updated stored plan. Verify that moving an entry persists once and does not leave duplicate entries on both days.

## REQUIREMENTS SIZING

Metric: **story points**, using the independent-estimate/discuss/re-estimate protocol in [MEALMAP_FINAL.md](MEALMAP_FINAL.md#effort-estimation-protocol). Initial AI estimates require team review; they are not team commitments or measured implementation results.

| Story | Points | Rationale |
| --- | ---: | --- |
| MM-07 | 5 | Plan structure, recipe snapshots, and reliable persistence across several meal slots. |
| MM-08 | 5 | Coordinated editing and dependent totals/list-state updates. |
| MM-09 | 3 | Bounded portion update and consistency using existing planner calculations. |
| **Total** | **13** | |
