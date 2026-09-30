# Grocery List Generation 1-pager

Product: MealMap | Version: Final ChatGPT specification | September 30, 2026
Scenario basis: MM-SC-04; personas are in MEALMAP_FINAL.md.

## PROBLEM

Carlos plans several home-cooked meals and wants to buy the right ingredient amounts without adding them manually. He chooses recipe portions for the week and opens the grocery list generated from his saved plan. Matching ingredients with compatible units are combined, while incompatible quantities remain separate. The list labels amounts and units clearly.

Carlos checks off items as he shops. Before finishing, he changes the servings of one planned meal, then regenerates the list. MealMap tells him which quantities changed and resets affected items to unchecked so an old check mark does not imply he has enough of the new amount. The list stays connected to his plan instead of becoming a stale copy.

## ASSUMPTIONS

- Generate quantities from the selected saved week, using recipe ingredient amounts per catalog serving multiplied by planned portions.
- Combine lines only when ingredient identity and preparation form match. Convert grams and kilograms to grams, and milliliters and liters to milliliters. Keep count units separate from mass and volume; do not assume a density or piece weight.
- Ingredients without numeric quantities, such as “to taste,” remain labelled qualitative lines rather than invented totals.
- Grocery lists represent full planned ingredient needs; pantry subtraction, package-size optimization, prices, delivery, and manual extra items are deferred.
- Generated lists record the plan version. Editing a plan marks the list stale until regeneration. During regeneration, preserve checked state only for unchanged ingredient identities, units, and quantities; changed or new lines become unchecked and removed lines disappear.

## FUNCTIONAL REQUIREMENTS

### MM-13

- As Carlos, I want to generate a combined ingredient list for my saved week so that I can shop without manually adding quantities from each recipe.

- Scale recipe quantities by planned portions and group compatible ingredients using the documented conversion rules.
- Display ingredient names, required quantities, units, and qualitative lines; show a clear empty-plan message and do not create invented quantities.

### MM-14

- As Valeria, I want to refresh my grocery list after editing the meal plan so that I can shop from quantities that match my current plan.

- Indicate when the saved list is stale and regenerate from the current saved week only after user action.
- Show changed quantities and apply the check-state preservation rules; failure retains the prior list and its stale indication.

### MM-15

- As Carlos, I want to check and uncheck grocery items so that I can keep track of what I have collected while shopping.

- Persist each line’s checked state so reopening the same list retains it.
- If the update fails, retain the prior stored state and explain the failure; regeneration uses the documented preservation rules.

## NON-FUNCTIONAL REQUIREMENTS

- With 100 planned entries and up to 20 ingredient lines per entry, generation must complete within 2 seconds for at least 95% of 100 requests on a stable connection with 20 concurrent users.
- Verify quantities with independently calculated examples covering fractional servings, kg-to-g conversion, incompatible units, qualitative amounts, and changed plan versions.
- Lists are private to their owner. Shopping controls must be labelled and have touch targets of at least 44 by 44 CSS pixels.

## REQUIREMENTS SIZING

Metric: **story points**, using the independent-estimate/discuss/re-estimate protocol in [MEALMAP_FINAL.md](MEALMAP_FINAL.md#effort-estimation-protocol). Initial AI estimates require team review; they are not team commitments or measured implementation results.

| Story | Points | Rationale |
| --- | ---: | --- |
| MM-13 | 8 | Aggregation, canonical ingredient identity, unit conversion, qualitative data, and consistency create substantial uncertainty; consider splitting in implementation planning. |
| MM-14 | 3 | Version comparison and deterministic regeneration reuse the aggregation engine. |
| MM-15 | 2 | Reference story: bounded state update with persistence and failure feedback. |
| **Total** | **13** | |
