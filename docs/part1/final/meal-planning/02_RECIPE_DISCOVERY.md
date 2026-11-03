# Recipe Discovery 1-pager

## PROBLEM

Valeria searches for vegetarian recipes but has to open separate pages to compare ingredients and nutrition. MealMap lets her search recipe names and dietary tags, inspect serving information, and preview portions. Sebastian uses the same information to choose recipes for his nutrition-focused plan.

## ASSUMPTIONS

- Recipe data includes serving quantities, dietary tags, ingredients, and available nutrition. Its source must be identified.
- Tags assist discovery; they do not guarantee medical suitability or allergen safety.

## FUNCTIONAL REQUIREMENTS

**MM-04.** As Valeria, I want to search recipes and dietary tags so that I can find suitable options.

- Combine search and selected tags; explain empty results.

**MM-05.** As Carlos, I want to inspect recipe details and nutrition so that I can decide whether to use it.

- Show ingredients, servings, instructions, source, and missing-data labels.

**MM-06.** As Sebastian, I want to preview a recipe portion so that I can compare practical meal quantities.

- Scale available nutrition and ingredients to the chosen portion.

## NON-FUNCTIONAL REQUIREMENTS

- Responsiveness: Searching and filtering should feel smooth during normal use.
- Readability: Recipe details should be clear on phones and larger screens.
- Integrity: Missing nutrition should be distinguished from a zero value.

## REQUIREMENTS SIZING

Initial story points; team review uses the shared estimation protocol.

| Story | Points | Rationale |
| --- | ---: | --- |
| MM-04 | 3 | Combined search and filter behavior. |
| MM-05 | 3 | Structured recipe details. |
| MM-06 | 5 | Serving-based scaling across recipe data. |
| **Total** | **11** | |
