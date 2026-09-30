# Profile and Nutrition Targets 1-pager

Product: MealMap | Version: Final ChatGPT specification | September 30, 2026
Scenario basis: MM-SC-02; personas are in MEALMAP_FINAL.md.

## PROBLEM

Lucía wants to start planning meals but does not understand the numbers shown by other nutrition calculators. She opens MealMap and enters her age, height, and weight, then reviews the optional BMI explanation. For an energy estimate, she supplies the additional formula inputs and selects a described activity level. She can see how the estimate was produced and that BMI is separate from calorie needs.

Lucía reviews the approximate energy starting point before choosing her planning targets. She enters calorie and macro values she wants to use, with plain unit labels and explanations, and saves them. If she later changes her activity level, MealMap shows the revised estimate without silently replacing her selected targets or existing meal plan. She remains in control of the assumptions used in her planning.

## ASSUMPTIONS

- Use the formula, eligibility boundaries, activity factors, and target rules documented in MEALMAP_FINAL.md; estimates are optional and do not diagnose nutritional needs.
- Age is an integer; height and weight are finite positive metric values. Technical input bounds are age 20–65 for estimates, height 100–250 cm, and weight 25–350 kg. These are prototype validation bounds, not healthy ranges. Out-of-range inputs receive an explanation and manual-target alternative.
- Missing formula inputs prevent energy calculation but do not prevent manual targets; BMI requires height and weight plus eligibility confirmation.
- Calories are entered in kcal/day, macro targets in grams/day. Reject nonfinite values, nonpositive calories, and negative macro targets.
- Users explicitly choose whether to adopt an estimated calorie value. Profile changes update estimates but never silently overwrite targets or plans.

## FUNCTIONAL REQUIREMENTS

### MM-01

- As Lucía, I want to enter and update the information used for optional estimates so that I can understand which assumptions affect the numbers.

- Collect only required inputs with explicit units and descriptions; show invalid or unsupported inputs beside the relevant field.
- Allow skipping the estimates and entering manual targets; retain valid input after a save failure.

### MM-02

- As Lucía, I want to see separate BMI and approximate daily energy results with their calculation inputs so that I can understand the numbers before using them in planning.

- Apply the documented equations and activity factor, showing units, selected formula variant, and separate results; do not use BMI to set calorie or macro targets.
- Show the limitations and eligibility rules; when inputs change, recalculate estimates without changing saved targets.

### MM-03

- As Sebastian, I want to save adjustable calorie and macro targets so that I can compare my planned meals with the values I choose.

- Accept manual targets or explicit adoption of an estimated calorie starting point, with protein, carbohydrate, and fat targets entered by the user.
- Persist validated targets; confirm before replacing existing targets and make later comparisons use the latest saved values.

## NON-FUNCTIONAL REQUIREMENTS

- Profile and targets must be accessible only to their owner through both interface and direct requests; do not include measurements in public URLs or routine diagnostic logs.
- For valid example inputs, calculation results must match the documented equations before display rounding; check both formula variants and activity factors.
- Form controls must have explicit labels, keyboard access, and inline errors that remain readable at 200% text enlargement.

## REQUIREMENTS SIZING

Metric: **story points**, using the independent-estimate/discuss/re-estimate protocol in [MEALMAP_FINAL.md](MEALMAP_FINAL.md#effort-estimation-protocol). Initial AI estimates require team review; they are not team commitments or measured implementation results.

| Story | Points | Rationale |
| --- | ---: | --- |
| MM-01 | 3 | Profile persistence and conditional validation reuse standard form behavior. |
| MM-02 | 5 | Multiple calculations, optional paths, eligibility checks, and understandable presentation. |
| MM-03 | 5 | Target persistence, explicit adoption and replacement, and dependent comparison behavior. |
| **Total** | **13** | |
