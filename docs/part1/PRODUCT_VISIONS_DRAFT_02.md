# Product Visions — Draft 02

Date: September 30, 2026
AI model: ChatGPT (OpenAI)
Status: Revised draft for team review.
Prompt reference: PROMPT_LOG.md, prompt 6.
Writing basis: Engineering Software Products, Chapter 1, section 1.1.
Previous version: PRODUCT_VISIONS_DRAFT_01.md (preserved).

## 1. Fitness & Workout Log App

**FOR** beginner and intermediate strength-training participants
**WHO** need a convenient way to record workouts and understand their progress,
**THE** FitTrack application **IS A** mobile-first workout log
**THAT** lets users record daily workouts and exercise sets, review previous sessions, and see historical training volume so they can make informed decisions about their next workout.
**UNLIKE** keeping workout notes in a notebook or general-purpose notes application,
**OUR PRODUCT** connects structured workout records with exercise-specific history and volume graphs, reducing the effort needed to compare performance over time.

The workout vision is carried forward from Draft 01. Its audience overlaps with the revised meal-planning audience: people who want to support their fitness habits with nutrition planning. Automatic data exchange between the products remains a proposed extension.

## 2. Recipe & Meal Planning Portal

### Revised vision statement

**FOR** adults who want to develop healthier eating habits and support their personal fitness goals
**WHO** need help turning calorie and macronutrient targets into practical meals that fit their dietary preferences and activity level,
**THE** MealMap portal **IS A** nutrition-aware recipe discovery and weekly meal-planning application
**THAT** helps users establish adjustable nutrition targets using basic personal information and activity estimates, find suitable recipes, compare planned meals with their calorie and protein, carbohydrate, and fat goals, and generate a grocery list for the week.
**UNLIKE** using separate nutrition calculators, recipe collections, meal calendars, and shopping lists,
**OUR PRODUCT** connects personal nutrition goals with recipe portions, weekly meal plans, and grocery-list generation, helping users put their goals into everyday practice alongside their workout routine.

### Value to the user and customer

The individual meal planner is the assumed user and potential customer. The core value is translating a personal nutrition goal into meals and shopping decisions with less manual calculation. The application supports planning toward goals; it does not guarantee health or fitness outcomes. Pricing and willingness to pay remain unvalidated.

### Proposed capabilities derived from the vision

- A basic profile records information needed by the selected estimation method, such as age, height, weight, and self-reported activity level.
- An optional BMI calculation provides a separate informational body-size measure based on height and weight.
- A documented energy-estimation method uses appropriate profile inputs and activity level to provide an approximate calorie starting point.
- Users can review and adjust calorie and macronutrient targets, including entering targets they already use.
- Recipe search retains dietary tags and adds calorie and macronutrient information per serving.
- Users select recipes and portions for weekly meals and compare daily planned nutrition totals with their targets.
- The grocery list reflects recipe ingredients and the planned portions.

These capabilities are a direction for later requirements, not a finalized formula specification or implementation design.

### Assumptions and calculation boundaries

- The initial prototype targets adults planning their own meals for general wellness and fitness.
- BMI and energy needs are separate calculations. Activity level is relevant to energy estimation; it is not an input to BMI. BMI is a screening measure rather than a diagnosis or a direct measurement of body fat. See [CDC: Adult BMI Calculator](https://www.cdc.gov/bmi/adult-calculator/index.html) and [CDC: BMI FAQs](https://www.cdc.gov/bmi/faq/).
- Calorie estimates are approximate starting points. Personalized calorie and physical-activity planning is an established tool category; see [NIDDK: Body Weight Planner](https://www.niddk.nih.gov/health-information/weight-management/body-weight-planner?dkrd=bwplanner.niddk.nih.gov). That source does not specify the simple formula this prototype will use.
- BMI alone will not determine calorie or macro targets. The estimation equation, activity factors, macro-setting approach, supported inputs, and validation rules need to be selected and documented in later requirements.
- Recipe nutrition data must have a known source and scale with servings. Planned nutrition totals describe the plan, not confirmed food consumption.
- Dietary preferences and nutrition estimates do not establish medical suitability or verified allergen safety.
- FitTrack and MealMap remain separate assignment products with compatible audiences. Sharing profiles or workout data requires an explicit later scope decision. Logged strength-training volume will not be treated as a direct measure of calories burned.
- MealMap and FitTrack remain temporary names. Other Draft 01 scope assumptions, such as excluding grocery delivery and wearable integrations, remain in effect.

## Revision rationale

User feedback accepted the initial visions but redirected the meal-planning product toward healthier lifestyles and macro goals relevant to workout participants. Draft 02 therefore changes its primary value from organizing meals to connecting nutrition goals with executable meal plans, while retaining recipe filtering, weekly planning, and grocery lists required by the assignment.

Basic BMI and activity-based estimates are introduced as supporting capabilities. Their exact methods remain open so the vision does not prematurely choose formulas or equate BMI with individual nutrition needs. This revision reflects user feedback and source checks, not customer interviews or a comparison with Claude.
