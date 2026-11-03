# Profile and Nutrition Targets 1-pager

## PROBLEM

Lucía finds nutrition calculators confusing. MealMap helps her review basic personal information, separate BMI from energy estimates, and understand the results before choosing targets. Sebastian can enter or adjust his own calorie and macro targets so meal planning follows the values he chooses.

## ASSUMPTIONS

- Estimates support adult general-wellness planning and are optional.
- BMI and energy estimates are separate; formulas and activity assumptions must be documented. Targets remain user-controlled.

## FUNCTIONAL REQUIREMENTS

**MM-01.** As Lucía, I want to enter information for optional estimates so that I understand which inputs affect the results.

- Use explicit units and allow manual targets without estimates.

**MM-02.** As Lucía, I want to review BMI and energy estimates separately so that I can interpret them before planning.

- Explain their inputs and limitations; do not derive targets from BMI.

**MM-03.** As Sebastian, I want to save adjustable calorie and macro targets so that I can compare meals with my goals.

- Require explicit adoption or editing; profile changes must not silently replace targets.

## NON-FUNCTIONAL REQUIREMENTS

- Privacy: Personal measurements and targets should remain private.
- Clarity: Estimates should be presented as approximate information.
- Usability: Labels and errors should be understandable without nutrition expertise.

## REQUIREMENTS SIZING

Initial story points; team review uses the shared estimation protocol.

| Story | Points | Rationale |
| --- | ---: | --- |
| MM-01 | 3 | Optional profile entry and validation. |
| MM-02 | 5 | Distinct estimates and understandable results. |
| MM-03 | 5 | Target saving and controlled replacement. |
| **Total** | **13** | |
