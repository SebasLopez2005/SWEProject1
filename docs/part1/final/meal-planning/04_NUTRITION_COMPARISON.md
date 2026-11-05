# Planned Nutrition Comparison 1-pager

## PROBLEM

Sebastian wants to see whether planned recipes fit his chosen calorie and macro targets without calculating every serving manually. MealMap shows daily totals and the meals contributing to them. Lucía can read explanations that distinguish estimates, chosen targets, and planned food from actual intake.

## ASSUMPTIONS

- Totals use recipe nutrition scaled to planned portions.
- Missing nutrition makes the affected total incomplete; an unplanned day does not mean zero intake.

## FUNCTIONAL REQUIREMENTS

**MM-10.** As Sebastian, I want to compare daily totals with my targets so that I can identify differences in my plan.

- Show calories and macro totals; explain absent targets or incomplete data.

**MM-11.** As Sebastian, I want to see totals after changing a meal so that I can evaluate alternatives.

- Refresh affected days and show contributing meal entries.

**MM-12.** As Lucía, I want to read explanations of the comparison so that I can interpret it correctly.

- Use plain labels and distinguish planned totals from consumed food.

## NON-FUNCTIONAL REQUIREMENTS

- Accuracy: Totals should agree with the underlying portions and recipe data.
- Transparency: Incomplete information should remain visible.
- Accessibility: Comparisons should be readable without relying on color.

## REQUIREMENTS SIZING

Initial story points; team review uses the shared estimation protocol.

| Story | Points | Rationale |
| --- | ---: | --- |
| MM-10 | 5 | Aggregation and comparison states. |
| MM-11 | 3 | Updating totals from plan changes. |
| MM-12 | 3 | Understandable comparison presentation. |
| **Total** | **11** | |
