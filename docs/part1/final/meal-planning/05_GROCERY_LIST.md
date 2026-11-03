# Grocery List Generation 1-pager

## PROBLEM

Carlos plans several recipes but finds adding ingredient quantities by hand inconvenient. MealMap generates a list from his saved week, combining compatible ingredients. When he changes a portion, he refreshes the list and sees revised quantities so old check marks do not suggest he already has the new amount.

## ASSUMPTIONS

- Quantities come from the saved plan and its recipe portions.
- Combine matching ingredients only when units are compatible. Unspecified amounts remain labelled rather than invented.

## FUNCTIONAL REQUIREMENTS

**MM-13.** As Carlos, I want to generate a combined grocery list so that I can shop without manually adding ingredients.

- Scale recipe quantities and keep incompatible or qualitative amounts distinct.

**MM-14.** As Valeria, I want to refresh the list after plan changes so that I can shop from current quantities.

- Mark stale lists; preserve checks only for unchanged quantities.

**MM-15.** As Carlos, I want to check and uncheck items so that I can track what I have collected.

- Retain item state when reopening the same list.

## NON-FUNCTIONAL REQUIREMENTS

- Accuracy: Quantities should reflect the saved plan and compatible units.
- Usability: The list should be readable and easy to check while shopping.
- Reliability: Failed refreshes should retain the earlier list and explain its status.

## REQUIREMENTS SIZING

Initial story points; team review uses the shared estimation protocol.

| Story | Points | Rationale |
| --- | ---: | --- |
| MM-13 | 8 | Ingredient grouping and unit compatibility. |
| MM-14 | 3 | Plan-version and list-state updates. |
| MM-15 | 2 | Bounded persisted check-off state. |
| **Total** | **13** | |
