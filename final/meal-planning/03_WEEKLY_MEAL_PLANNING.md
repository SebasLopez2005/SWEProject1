# Weekly Meal Planning 1-pager

## PROBLEM

Valeria’s shift schedule changes after she plans meals. She needs to rearrange recipes without rewriting her calendar and shopping list. MealMap lets her assign portions to the week, move or replace meals, and save an updated plan that supports consistent nutrition totals and grocery quantities.

## ASSUMPTIONS

- Plans describe intended meals rather than food actually consumed.
- Each entry identifies a recipe, date, meal slot, and portion. Plan changes should update dependent information.

## FUNCTIONAL REQUIREMENTS

**MM-07.** As Sebastian, I want to assign recipes and portions to a week so that I can organize meals around my goals.

- Save dated meal entries and reopen the same plan.

**MM-08.** As Valeria, I want to move, replace, or remove meals so that I can adapt to changing shifts.

- Confirm destructive changes and refresh affected totals and list status.

**MM-09.** As Carlos, I want to adjust a planned meal’s portions so that I can prepare the intended amount.

- Use valid portions consistently in nutrition and grocery quantities.

## NON-FUNCTIONAL REQUIREMENTS

- Reliability: Saved plans should remain available when users return.
- Integrity: Failed changes should not leave a partially updated plan.
- Privacy: Plans should be accessible only to their owner.

## REQUIREMENTS SIZING

Initial story points; team review uses the shared estimation protocol.

| Story | Points | Rationale |
| --- | ---: | --- |
| MM-07 | 5 | Weekly plan structure and persistence. |
| MM-08 | 5 | Plan editing and dependent updates. |
| MM-09 | 3 | Portion editing and consistent scaling. |
| **Total** | **13** | |
