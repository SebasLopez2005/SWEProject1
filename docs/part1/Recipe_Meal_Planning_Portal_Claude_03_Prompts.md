# Claude Prompts — Recipe & Meal Planning Portal

Prompts given to Claude for the Recipe & Meal Planning Portal (CS3365), pasted as provided, in order.
The Sommerville Chapter 3 text was also attached to Prompt 1 as reference material; it is not reproduced here.

---

## Prompt 1 — Initial product definition (produced the first draft)

I am now ready to begin the SECOND product for my CS3365 Engineering Systems / Software Products college project.

For this stage, I want you to act as a **senior Product Manager and Requirements Engineering specialist** and help me develop the complete initial product definition for the following product:

# Recipe & Meal Planning Portal

> A searchable UI where users filter recipes by dietary tags, plan weekly meals, and automatically generate grocery lists.

This is a separate product from the Fitness & Workout Log App we previously worked on.

IMPORTANT:

* Start the requirements analysis for this product independently.
* Do NOT copy personas, assumptions, requirements, scenarios, or features from the Fitness & Workout Log App unless they are genuinely applicable and you explicitly justify why.
* Do NOT work on the Fitness & Workout Log App anymore unless I explicitly ask you to.
* This is the INITIAL Claude version for the Recipe & Meal Planning Portal.
* Do not generate or pretend to have generated the other AI model's version.
* The second AI model will be handled independently by another teammate.
* Do not compare Claude against the other model because you have not seen its output.

The purpose of this prompt is to generate a strong first version that I can later ask you to critically review and polish in a separate iteration.

---

# 1. ACADEMIC CONTEXT

This is a college project for my CS3365 Engineering Systems / Software Products course.

The project is intended to simulate the requirements elicitation and analysis process that takes place during the early stages of software product development.

The assignment specifically asks students to use AI models as a type of **Product Manager simulator** to help generate and refine:

* Product visions
* Personas
* Scenarios
* Problem statements
* Assumptions
* Functional requirements
* Non-functional requirements
* User stories
* Requirements sizing

Students are responsible for critically reviewing the AI-generated material rather than blindly accepting it.

Therefore, you should behave as a professional Product Manager and requirements engineer, while clearly identifying assumptions and areas requiring human validation.

---

# 2. REQUIRED REFERENCE

The main conceptual reference is:

Ian Sommerville, **Engineering Software Products**, 1st Edition, Pearson, 2019.

Official website:

https://iansommerville.com/engineering-software-products/

I have specifically been instructed to review **Chapter 3** carefully.

Use Chapter 3 principles to guide the development of:

* Product visions
* Personas
* Scenarios
* User requirements
* User stories
* Requirements elicitation
* Assumptions
* Requirements analysis

Do not invent quotations, page numbers, or textbook claims.

If you do not have access to the complete chapter, rely on established requirements-engineering principles and clearly distinguish them from assumptions.

---

# 3. PRODUCT IDEA

The product idea provided by the assignment is:

## Recipe & Meal Planning Portal

> Searchable UI where users filter recipes by dietary tags, plan weekly meals, and auto-generate grocery lists.

This should be treated as the foundation of the product.

The core product should revolve around three connected activities:

1. Discovering/searching recipes.
2. Planning meals for a week.
3. Generating a grocery/shopping list from the planned meals.

The product should have a clear relationship between these three areas.

For example:

**Recipes → Meal Plan → Grocery List**

However, do not assume that every possible recipe or nutrition feature belongs in the product.

---

# 4. SCOPE CONTROL

Keep the product focused.

Do NOT automatically turn it into a complete nutrition, health, restaurant, or social-media platform.

Unless strongly justified by the product vision, do NOT introduce features such as:

* Calorie tracking
* Medical dietary advice
* Personalized medical nutrition plans
* Social media feeds
* Recipe influencer profiles
* Restaurant ordering
* Grocery delivery
* Payment processing
* AI nutritionist
* Medical recommendations
* Fitness tracking
* Exercise tracking
* Complex nutrition coaching

The product should primarily support:

### Recipe discovery

Finding recipes and filtering them according to relevant dietary characteristics.

### Meal planning

Organizing recipes into a weekly meal plan.

### Grocery-list generation

Automatically creating a shopping list based on the planned recipes.

Additional functionality may be introduced if it is necessary to support these core capabilities, but avoid scope creep.

---

# 5. ACT AS A PRODUCT MANAGER

Do not simply generate a generic list of features.

Act as if you are responsible for defining the product requirements before a software development team begins implementation.

You should:

* Identify realistic users.
* Identify their problems.
* Identify their goals.
* Identify relevant scenarios.
* Make reasonable assumptions.
* Explicitly document assumptions.
* Maintain traceability between problems and requirements.
* Avoid unnecessary features.
* Control scope.
* Identify ambiguities.
* Ensure functional requirements solve actual user problems.
* Ensure personas are meaningful rather than superficial.
* Ensure scenarios provide enough context.
* Ensure requirements are specific and testable.
* Consider realistic edge cases.
* Distinguish confirmed requirements from assumptions and proposed decisions.

Think like a professional Product Manager preparing the product definition for a development team.

---

# 6. FIRST TASK — PRODUCT VISION

Create an initial Product Vision for the Recipe & Meal Planning Portal.

The vision should clearly explain:

* What the product is.
* Who it is intended for.
* What problem it addresses.
* Why that problem matters.
* What value the product provides.
* How users interact with the product at a high level.
* What makes the product useful.
* What the core product scope is.
* What the product is explicitly NOT intended to solve, where useful for controlling scope.

The vision should be appropriate for an academic requirements document.

Do not write it like an advertising slogan.

Do not make unsupported claims about market demand.

Do not invent statistics or user research.

---

# 7. PRODUCT VISION REVIEW

After creating the initial vision, critically review it.

Look for:

* Ambiguous language.
* Excessive scope.
* Missing user needs.
* Unsupported assumptions.
* Features disguised as vision statements.
* Lack of clear user value.
* Poor connection between recipes, meal planning, and grocery lists.

Then provide an improved version.

Do NOT wait for me to tell you what is wrong.

Act as your own Product Manager reviewer.

---

# 8. AI INTERACTION / DEVELOPMENT LOG

The assignment requires a detailed record of AI interactions.

For this first version, create a section documenting the development of the product vision.

Because this is the initial Claude iteration, document the process honestly.

Use:

### Iteration 1 — Initial Product Vision

Explain what information was provided and what the initial vision focused on.

### Initial Critique

Explain the weaknesses identified in the initial version.

### Iteration 2 — Refined Product Vision

Present the improved version and explain what changed.

IMPORTANT:

Do not falsely claim that these were separate real-world conversations if they were not.

Describe them as stages of the AI-assisted development process.

Include this table:

| Iteration | Purpose | Main Changes | Reason |
| --------- | ------- | ------------ | ------ |

---

# 9. PERSONAS

Based on the final/refined product vision, create an appropriate set of personas.

Use principles from Sommerville Chapter 3 and good requirements-engineering practice.

Do not create personas simply by changing:

* Age
* Gender
* Occupation

Each persona should represent a meaningful user type with relevant differences in:

* Goals
* Motivations
* Behaviors
* Meal-planning habits
* Cooking habits
* Problems
* Dietary needs/preferences
* Time constraints
* Shopping habits
* Technology usage
* Expectations from the product

Determine the appropriate number of personas yourself.

Do not create too many.

Every persona must have a reason for existing.

---

# 10. PERSONA FORMAT

For each persona include:

## Persona Name

Use a realistic descriptive name.

## Persona Type

For example:

* Primary user
* Secondary user

Use these classifications only where meaningful.

## Background

Relevant context about the person.

## Goals

What they are trying to accomplish.

## Motivations

Why those goals matter.

## Behaviors

How they currently search for recipes, plan meals, and shop for ingredients.

## Pain Points

What makes their current process difficult.

## Needs

What they need from the product.

## Usage Context

When, where, and how they are likely to use the portal.

## Product Expectations

What they expect the product to help them accomplish.

## Representative Scenario

Give a short realistic scenario demonstrating how the persona would use the product.

---

# 11. PERSONA QUALITY REVIEW

After creating the personas, perform a review.

Check:

* Are they genuinely different?
* Are they realistic?
* Are they useful for requirements elicitation?
* Are they sufficiently detailed?
* Are any redundant?
* Are important user types missing?
* Do they collectively cover the product vision?

If necessary, revise the personas.

Do not simply keep every persona you initially generated.

---

# 12. PERSONA-TO-REQUIREMENT TRACEABILITY

Create:

| Persona | Main Problem | Main Goal | Relevant Product Capabilities |
| ------- | ------------ | --------- | ----------------------------- |

This should show how the personas connect to the product's functionality.

---

# 13. 1-PAGERS / EPICS

Create multiple 1-pagers for the Recipe & Meal Planning Portal.

Do NOT force the entire product into one 1-pager.

Identify a logical breakdown into feature/problem areas.

The likely areas may include:

* Recipe discovery and filtering
* Recipe details and selection
* Weekly meal planning
* Grocery-list generation
* Grocery-list organization

However, do not blindly use these categories.

Determine the appropriate 1-pagers based on the actual product vision and personas.

The 1-pagers should collectively provide sufficient coverage of the product.

---

# 14. REQUIRED 1-PAGER TEMPLATE

For every 1-pager use the following structure:

# [Initiative Name] 1-pager

## PROBLEM

One to two paragraphs describing the initiative.

This should roughly correspond to what Sommerville refers to as a scenario/problem context.

The problem statement should:

* Be grounded in one or more personas.
* Describe the user's situation.
* Explain the problem.
* Explain why the problem matters.
* Provide enough context to understand the need.
* Avoid simply describing a feature.
* Avoid prematurely specifying technical implementation.

The problem should describe what the user is trying to accomplish and what prevents them from doing so efficiently.

---

## ASSUMPTIONS

Identify assumptions necessary to complement the product vision.

Potential areas may include:

* Recipe data
* Dietary tags
* Ingredient representation
* Serving sizes
* Units
* Ingredient quantities
* Meal types
* Days of the week
* Grocery-list behavior
* Recipe availability
* User accounts
* Saving recipes
* Editing meal plans
* Ingredient aggregation
* Duplicate ingredients
* Unit conversion

Only include assumptions that are actually relevant.

For every important assumption, briefly explain why it is necessary.

Do not present assumptions as confirmed requirements.

---

# 15. FUNCTIONAL REQUIREMENTS

Write functional requirements using the required user-story format:

> As a [persona], I want to [perform task] so that I can/in order to [description].

Each story should:

* Identify a persona.
* Describe a clear action.
* Describe the user's value.
* Be specific.
* Be testable.
* Be relevant to the problem.
* Stay within product scope.

Assign unique story IDs across the entire product:

* RP-01
* RP-02
* RP-03
* etc.

Do not restart numbering for each 1-pager.

---

# 16. SUPPORTING DETAILS

Under each user story, include appropriate supporting details.

These may include:

* Required information
* Business rules
* Validation
* User interactions
* Important edge cases
* Empty states
* Editing behavior
* Deletion behavior
* Relevant constraints

Do not turn every detail into a separate user story.

Do not include unnecessary technical implementation instructions.

---

# 17. EXAMPLES OF AREAS TO CONSIDER

Use these as areas for analysis, NOT as mandatory features.

### Recipe Discovery

Consider:

* Search
* Dietary filtering
* Recipe categories
* Ingredients
* Preparation time
* Servings
* Recipe details

### Meal Planning

Consider:

* Weekly structure
* Breakfast/lunch/dinner or other meal types
* Adding recipes to specific days
* Replacing meals
* Removing meals
* Reviewing the weekly plan

### Grocery Lists

Consider:

* Generating a list from planned recipes.
* Combining ingredients.
* Handling duplicate ingredients.
* Organizing items.
* Marking items as obtained.
* Adjusting the list if the meal plan changes.

Only include functionality justified by actual user needs.

---

# 18. FUNCTIONAL REQUIREMENT QUALITY CONTROL

After creating the functional requirements, critically review them.

Evaluate:

### Coverage

Do the stories adequately solve the problem?

### Persona alignment

Does every story correspond to a legitimate user?

### User value

Does every story explain why the user needs it?

### Specificity

Is the requirement clear enough for a development team?

### Testability

Could the requirement eventually be verified?

### Scope

Is the requirement genuinely part of the product?

### Redundancy

Are any stories duplicates?

### Dependencies

Are dependencies between stories apparent?

### Missing requirements

Is anything essential missing?

Revise the requirements if needed.

---

# 19. NON-FUNCTIONAL REQUIREMENTS

For each 1-pager, identify relevant non-functional requirements.

Consider, where appropriate:

* Performance
* Usability
* Accessibility
* Security
* Privacy
* Reliability
* Availability
* Data integrity
* Compatibility

Do not automatically include every category.

Requirements should be reasonably measurable where practical.

Avoid vague statements such as:

> "The portal should be easy to use."

Instead define an appropriate measurable expectation where justified.

Do not invent arbitrary numerical targets simply to appear technical.

If a value is a proposed target rather than an established requirement, clearly identify it as requiring validation.

---

# 20. REQUIREMENTS SIZING

The assignment requires:

> Select one type of metric to assess effort and provide an initial estimate for each of the stories in the functional requirements. Explain the rationale to assign each size.

Choose ONE consistent sizing methodology.

Story points may be appropriate.

If using story points, clearly define the scale.

For example:

* 1 = trivial
* 2 = very small
* 3 = small
* 5 = moderate
* 8 = complex
* 13 = very complex

But use your judgment regarding whether this is the most appropriate approach.

For every functional requirement include:

| Story ID | User Story | Size | Rationale |
| -------- | ---------- | ---: | --------- |

The rationale should consider:

* Complexity
* UI complexity
* Data handling
* Validation
* Dependencies
* Uncertainty
* Edge cases
* Integration
* Relative implementation effort

Do not confuse user importance with development effort.

The sizing should represent relative effort/complexity.

Make clear that these are initial estimates and may change during later requirements analysis.

---

# 21. REQUIREMENT TRACEABILITY

After all 1-pagers, create:

| Product Vision Need | Persona | Problem / Scenario | 1-Pager | Functional Requirement IDs |
| ------------------- | ------- | ------------------ | ------- | -------------------------- |

Ensure that:

**Vision → Persona → Problem → Requirement**

forms a coherent chain.

Identify any gaps.

---

# 22. OVERALL PROJECT MANAGER QUALITY AUDIT

Before finalizing the document, review your own work as a strict Product Manager.

### Product Vision

* Clear?
* User-centered?
* Appropriate scope?
* Connected to the product concept?

### Personas

* Realistic?
* Specific?
* Meaningfully different?
* Sufficient coverage?

### Problems / Scenarios

* Real user problems?
* Enough context?
* Connected to personas?
* Appropriate assumptions?

### Functional Requirements

* User-centered?
* Specific?
* Testable?
* Complete?
* No unnecessary implementation detail?

### Non-Functional Requirements

* Relevant?
* Reasonably measurable?
* No arbitrary claims?

### Sizing

* One consistent metric?
* Every story sized?
* Rationale provided?
* Reasonable relative estimates?

### Traceability

* Every major requirement connected to a user need?
* No orphan requirements?
* No unexplained features?

If problems are identified, correct them before producing the final output.

---

# 23. OPEN QUESTIONS / HUMAN VALIDATION

At the end, identify a concise list of things that I should personally validate.

Examples might include:

* Whether users need accounts.
* Which dietary tags should initially be supported.
* Whether ingredient quantities should automatically scale with serving size.
* How ingredient units should be normalized.
* Whether grocery-list items should be grouped by category.
* Whether users can create their own recipes.
* Whether recipes are provided by an existing dataset or manually entered.

Only include questions that actually affect the requirements.

Separate them into:

### High Priority

### Medium Priority

### Low Priority

Do not overwhelm me with unnecessary questions.

---

# 24. STUDENT EVALUATION SECTION

At the end, create:

# Student Evaluation of Claude's Output

Leave the actual answers blank.

Give me prompts I can evaluate later, such as:

* What did Claude do well?
* What did Claude misunderstand?
* Which personas were most useful?
* Which requirements need revision?
* Were the scenarios sufficiently detailed?
* Were assumptions appropriate?
* Was the sizing rationale reasonable?
* What would I change before submission?
* What did I learn from using Claude?
* Overall evaluation:

Do NOT answer these questions for me.

---

# 25. DOCUMENT STRUCTURE

The final output should follow this structure:

# Recipe & Meal Planning Portal — Claude Initial Product Definition

## 1. Product Vision

### Initial Vision

### Vision Critique

### Refined Product Vision

## 2. AI Interaction / Product Vision Development Log

Include the iteration table.

## 3. Personas

Include all final personas.

## 4. Persona-to-Requirement Traceability

Include the table.

## 5. 1-Pagers / Epics

Include all appropriate 1-pagers using the required format.

## 6. Overall Requirement Traceability Matrix

Include the table.

## 7. Project Manager Quality Audit

Include findings and corrections.

## 8. Open Questions / Human Validation

Include only important unresolved decisions.

## 9. Student Evaluation of Claude's Output

Leave this for me.

---

# 26. WRITING QUALITY

The final output should be appropriate for a university software engineering project.

Avoid generic AI language such as:

* "seamless experience"
* "revolutionary"
* "innovative platform"
* "enhance user satisfaction"
* "user-friendly"
* "streamline everything"

unless there is a specific requirement behind the statement.

Prefer concrete requirements-engineering language.

Do not write marketing copy.

---

# 27. DO NOT INVENT INFORMATION

I am responsible for reviewing the final document.

Therefore:

* Do not fabricate user research.
* Do not invent statistics.
* Do not claim that users were interviewed.
* Do not fabricate textbook quotations.
* Do not fabricate sources.
* Do not claim that another AI generated content you have not seen.
* Do not present assumptions as facts.
* Do not invent requirements supposedly provided by my professor.
* Do not make unsupported claims about the market.

When something requires validation, label it:

**Requires Human Validation**

---

# 28. IMPORTANT: THIS IS THE FIRST VERSION

This is the INITIAL Claude version of the Recipe & Meal Planning Portal.

Do not attempt to create a fictional second-model comparison.

Do not claim this is the final version.

The next stage will be a separate prompt where I will ask you to review and polish this version, similar to how we refined the Fitness & Workout Log App.

For now, focus on producing a strong, complete first version that gives us enough material to critique later.

---

# 29. FINAL QUALITY TEST

Before presenting the document, ask yourself:

> Can a software development team understand who the users are, what problems they experience, what the product is intended to accomplish, and what functionality is required?

Then ask:

> Can every functional requirement be traced to a user problem and persona?

Then ask:

> Does the product remain focused on recipe discovery, weekly meal planning, and grocery-list generation?

Then ask:

> Does this document demonstrate actual requirements analysis rather than simply listing application features?

If any answer is no, improve the document before presenting it.

---

# 30. FINAL INSTRUCTION

Produce the complete INITIAL Claude version of the:

**Recipe & Meal Planning Portal**

Include:

1. Product vision
2. Vision critique
3. Refined product vision
4. AI interaction/development log
5. Personas
6. Persona-to-requirement traceability
7. Multiple 1-pagers
8. Problem/scenario statements
9. Assumptions
10. Functional requirements/user stories
11. Supporting requirement details
12. Non-functional requirements
13. Requirements sizing and rationale
14. Overall requirement traceability matrix
15. Project Manager quality audit
16. Open questions/human validation
17. Student evaluation section

Use the assignment's required 1-pager format.

Maintain consistency across the entire document:

**Product Vision → Personas → Problems/Scenarios → Assumptions → Functional Requirements → Non-Functional Requirements → Sizing → Traceability**

Do not work on the Fitness & Workout Log App.

Do not generate the second AI model's version.

Do not fabricate information.

Produce the complete initial product definition now.


---

## Prompt 2 — Critical review and final version (produced the final version)

I have now received your initial complete draft for the **Recipe & Meal Planning Portal** portion of my CS3365 Engineering Systems / Software Products project.

Your task now is to take that initial draft and produce a **fully revised, polished, academically strong final Claude version**.

Do NOT simply rewrite the previous document with different wording.

Instead, act as a **senior Product Manager and Requirements Engineering specialist conducting a formal quality review of your own previous work**.

Your job is to identify weaknesses, inconsistencies, missing requirements, unnecessary scope, weak scenarios, weak personas, unclear assumptions, poor user stories, and questionable sizing decisions, and then actually FIX those problems.

The final result should be a complete revised document, not merely a critique.

We are working ONLY on:

# Recipe & Meal Planning Portal

> A searchable UI where users filter recipes by dietary tags, plan weekly meals, and automatically generate grocery lists.

Do NOT return to the Fitness & Workout Log App unless I explicitly ask you to.

---

# 1. ACADEMIC REFERENCE

Use the following as the primary conceptual reference:

Ian Sommerville, **Engineering Software Products**, 1st Edition, Pearson, 2019.

Official website:

https://iansommerville.com/engineering-software-products/

Pay particular attention to **Chapter 3**, especially principles related to:

* Product vision
* Personas
* Scenarios
* User requirements
* User stories
* Requirements elicitation
* Requirements analysis
* Assumptions
* User-centered specification

Do not invent quotations, page numbers, or claims from the book.

If you do not have access to the complete chapter, use established requirements-engineering principles and do not pretend otherwise.

---

# 2. THE ASSIGNMENT RUBRIC

The final version must specifically address the following grading criteria:

## Product vision statements

* Detailed log of AI interactions
* Critique of different generated versions
* Strong and well-documented product vision

## Personas

* Sufficient level of detail
* Appropriate number of personas
* Specific and meaningful personas

## Problem statements

* One problem/scenario per 1-pager
* Properly written scenarios
* Sufficient coverage of requirements
* Appropriate assumptions

## Functional requirements

* Written according to class and book best practices
* Sufficient coverage of the problem

## Sizing

* Rationale provided
* Appropriate metric assignment protocol

Optimize the final document specifically against these criteria.

---

# 3. REVIEW THE INITIAL VERSION CRITICALLY

Before producing the revised document, perform a complete internal review of the initial Claude version.

Do NOT assume that the previous version was correct.

Look specifically for:

* Generic AI-generated language
* Unnecessary features
* Scope creep
* Weak personas
* Redundant personas
* Problems that are actually feature descriptions
* Functional requirements that do not solve a stated problem
* Requirements without a clear persona
* Requirements without clear user value
* Requirements that are too vague
* Requirements that are overly technical
* Missing edge cases
* Missing assumptions
* Contradictory assumptions
* Poorly defined grocery-list behavior
* Poor relationship between meal planning and grocery generation
* Inconsistent terminology
* Requirements that do not belong in the product
* Inconsistent sizing
* Missing traceability

Then correct those issues in the final version.

---

# 4. PRODUCT SCOPE REVIEW

The product should remain focused on three interconnected core activities:

### 1. Recipe Discovery

Users search and filter available recipes according to relevant criteria such as dietary tags.

### 2. Weekly Meal Planning

Users select recipes and organize them into a weekly meal plan.

### 3. Grocery List Generation

The system derives a grocery list from the selected meal plan.

The core relationship should be:

**Recipes → Meal Plan → Grocery List**

Review the initial version carefully to make sure this relationship is logically represented throughout the document.

For example:

If a user adds a recipe to Monday dinner, the requirements should logically explain how that recipe contributes to the grocery list.

If the user changes or removes a meal, consider whether the grocery list should change accordingly.

If multiple planned recipes require the same ingredient, consider whether the requirements should explain how those ingredients are represented or combined.

Do not automatically add every possible feature.

---

# 5. SCOPE CONTROL

Remove or flag functionality that is not justified by the product concept.

The product should NOT automatically become:

* A calorie tracker
* A medical nutrition system
* A health diagnosis system
* A fitness application
* A restaurant ordering platform
* A grocery delivery service
* A social network
* A payment platform
* A professional nutritionist service
* A complex AI nutrition coach

Additional features may remain only if they are genuinely necessary to support the core product and are clearly justified.

If the previous draft included unnecessary functionality, remove it.

---

# 6. PRODUCT VISION REVIEW

Review the original and refined product vision from the first iteration.

Check whether the vision:

* Clearly identifies the product.
* Clearly identifies its users.
* Explains the problem.
* Explains the value.
* Establishes appropriate scope.
* Connects recipe discovery, meal planning, and grocery generation.
* Provides a useful foundation for personas.
* Provides a useful foundation for later requirements.
* Avoids marketing language.
* Avoids unsupported claims.

Then create an improved final vision.

The final vision should be concise enough to function as a product vision while being specific enough to guide requirements.

---

# 7. VISION ITERATION DOCUMENTATION

The assignment requires documentation of AI interactions.

Update the interaction history to accurately reflect the two Claude stages.

Use:

### Iteration 1 — Initial Claude Product Definition

Briefly explain the initial product vision and requirements-generation process.

### Iteration 2 — Critical Review and Refinement

Explain:

* What weaknesses were identified.
* What was changed.
* Why it was changed.
* How the revised version improves the requirements.

Create:

| Iteration | Purpose | Problems Identified | Changes Made | Expected Improvement |
| --------- | ------- | ------------------- | ------------ | -------------------- |

IMPORTANT:

Do not fabricate exact interactions that did not occur.

Describe the iterations accurately as stages of the Claude-assisted development process.

---

# 8. PERSONA REVIEW

Review every persona from the initial version.

For each persona ask:

### Is this actually a meaningful user type?

A persona should not exist merely because it represents a different age or occupation.

### Does this persona have a distinct problem?

### Does this persona have different goals or behaviors?

### Does this persona generate different requirements?

### Does the persona help explain why the product exists?

### Does the persona represent a realistic user of this product?

### Is the persona unnecessarily detailed?

### Is the persona redundant with another persona?

If two personas have essentially identical needs and behaviors, consider combining them.

If an important user group is missing, add it only if justified.

Do not increase the number of personas simply to make the document appear more sophisticated.

---

# 9. PERSONA FORMAT

For every final persona, use:

## Persona Name

## Persona Type

## Background

## Goals

## Motivations

## Behaviors

## Pain Points

## Needs

## Usage Context

## Product Expectations

## Representative Scenario

The scenario should demonstrate how that specific persona would realistically use the Recipe & Meal Planning Portal.

---

# 10. PERSONA QUALITY CHECK

After revising the personas, verify:

* Every persona connects to the product vision.
* Every persona has a meaningful problem.
* Every persona contributes to requirements.
* Personas are not redundant.
* The set provides sufficient coverage.
* The personas are specific enough to drive requirements.

If a persona does not contribute meaningfully to requirements, revise or remove it.

---

# 11. PERSONA-TO-REQUIREMENT TRACEABILITY

Update the following table:

| Persona | Main Problem | Main Goal | Relevant Product Capabilities |
| ------- | ------------ | --------- | ----------------------------- |

Make sure it reflects the FINAL version rather than simply copying the previous table.

---

# 12. REVIEW EVERY 1-PAGER

This is one of the most important parts of the revision.

For every 1-pager, review all sections:

* Problem
* Assumptions
* Functional Requirements
* Non-Functional Requirements
* Sizing

Do not assume the existing 1-pagers are properly divided.

If two 1-pagers overlap heavily, reconsider the breakdown.

If an important product problem is not represented, add a 1-pager.

The final set should provide sufficient coverage without unnecessary fragmentation.

---

# 13. PROBLEM / SCENARIO REVIEW

The assignment specifically evaluates:

> Problem statements (1 per 1-pager)
>
> * Properly written scenarios
> * Sufficient coverage
> * Appropriate assumptions

Therefore, rewrite the PROBLEM section of every 1-pager where necessary.

Each problem should:

* Be written from the user's perspective.
* Identify a realistic situation.
* Explain what the user is trying to accomplish.
* Explain the difficulty/problem.
* Explain why the problem matters.
* Provide enough context.
* Connect directly to the relevant persona.
* Lead naturally into the requirements.

Avoid statements such as:

> "The system needs to allow users to..."

That describes a solution rather than a user problem.

Instead, describe the user's actual situation and need.

---

# 14. ASSUMPTION REVIEW

Review all assumptions.

For every assumption ask:

* Is it necessary?
* Does it affect the requirements?
* Is it clearly labeled as an assumption?
* Is it reasonable?
* Is it consistent with the rest of the product?
* Is it accidentally being treated as a confirmed requirement?

Pay particular attention to:

### Recipe Data

Where do recipes conceptually come from?

Do not invent a specific external database unless required.

### Dietary Tags

What does "dietary tag" mean at this level?

Potential examples might include vegetarian, vegan, gluten-free, dairy-free, etc., but do not claim these are officially required unless appropriately treated as an assumption/proposed scope.

### Ingredients

How are ingredients represented?

### Quantities and Units

How are ingredient quantities represented?

### Serving Sizes

Does a recipe have a number of servings?

Does meal planning affect quantities?

### Grocery Lists

How are duplicate ingredients handled?

### Meal Planning

What counts as a meal?

Breakfast, lunch, dinner, snacks, or another structure?

These are important because they can significantly affect later requirements.

---

# 15. FUNCTIONAL REQUIREMENT REVIEW

Review EVERY user story.

The required format is:

> As a [persona], I want to [perform task] so that I can/in order to [description].

For every story check:

### Persona

Is the user actually identifiable?

### Action

Is the task clear?

### Value

Is the reason for the task meaningful?

### Specificity

Is the story specific enough?

### Testability

Could the requirement eventually be verified?

### Relevance

Does it solve the problem described in the 1-pager?

### Scope

Does it belong to the Recipe & Meal Planning Portal?

### Redundancy

Does another story already cover it?

### Dependencies

Does it depend on another story?

### Completeness

Does the set of stories adequately cover the problem?

Revise weak stories rather than merely commenting on them.

---

# 16. PAY SPECIAL ATTENTION TO GROCERY-LIST REQUIREMENTS

The grocery-list functionality is a key part of this product and should be specified carefully.

Review whether the requirements adequately address the relationship between recipes and grocery items.

Consider, where relevant:

* Multiple recipes using the same ingredient.
* Ingredient quantities.
* Units.
* Serving sizes.
* Adding/removing meals from the plan.
* Updating the grocery list after meal-plan changes.
* Checking off grocery items.
* Organizing items.
* Empty grocery lists.
* Recipes with ingredients that are difficult to aggregate.

Do NOT automatically implement all of these.

Determine which ones are appropriate requirements versus assumptions or future considerations.

---

# 17. MEAL-PLANNING REQUIREMENTS

Review whether the requirements adequately describe the weekly planning experience.

Consider:

* Selecting a recipe.
* Assigning it to a day.
* Assigning it to a meal.
* Replacing a meal.
* Removing a meal.
* Reviewing the weekly plan.
* Handling an incomplete plan.
* Updating the grocery list when the plan changes.

Again, only include functionality justified by the product scope.

---

# 18. RECIPE DISCOVERY REQUIREMENTS

Review whether users can realistically find the recipes they need.

Consider:

* Search.
* Dietary filters.
* Other useful filters if justified.
* Recipe details.
* Ingredient information.
* Preparation information.
* Servings.
* Selecting a recipe for meal planning.

Avoid turning the product into a massive recipe marketplace.

---

# 19. SUPPORTING DETAILS

Review the supporting details beneath each user story.

They should clarify:

* Expected behavior.
* Validation.
* Business rules.
* Important edge cases.
* User interactions.
* Relevant constraints.

Remove details that are simply implementation instructions.

Do not add technical architecture unless it is genuinely a requirement.

---

# 20. NON-FUNCTIONAL REQUIREMENT REVIEW

Review every non-functional requirement.

Only include relevant quality attributes such as:

* Performance
* Usability
* Accessibility
* Security
* Privacy
* Reliability
* Data integrity
* Availability
* Compatibility

Avoid generic statements.

For example:

Instead of:

> "The application should be fast."

Use a measurable expectation only when there is a reasonable basis for it.

Clearly distinguish:

**Confirmed requirement**

from:

**Proposed target requiring validation**

Do not invent arbitrary performance numbers.

---

# 21. REQUIREMENTS SIZING REVIEW

Use ONE consistent sizing methodology across the entire product.

If using story points, define the scale clearly.

For every functional requirement provide:

| Story ID | User Story | Size | Rationale |
| -------- | ---------- | ---: | --------- |

The rationale should reflect relative implementation effort and complexity.

Consider:

* UI complexity
* Data processing
* Validation
* Dependencies
* Edge cases
* Uncertainty
* Business rules
* Interactions with other product components

Do NOT size based on user importance.

Do NOT estimate hours unless specifically justified.

Ensure that similarly complex stories have reasonably similar sizes.

---

# 22. TRACEABILITY REVIEW

Update the complete traceability chain:

**Product Vision → Persona → Problem → Requirement → Size**

Create:

| Product Vision Need | Persona | Problem / Scenario | 1-Pager | Functional Requirement IDs |
| ------------------- | ------- | ------------------ | ------- | -------------------------- |

Check for:

### Orphan requirements

Requirements that cannot be traced to a user problem.

### Missing requirements

Important user needs that have no corresponding requirement.

### Unsupported features

Features that appear without being justified by the vision or personas.

### Broken relationships

Stories that do not solve the problem described in their 1-pager.

Fix all issues you identify.

---

# 23. SCOPE AND CONSISTENCY AUDIT

Perform a complete product-level audit.

Check:

### Terminology

Use the same terms throughout.

For example, decide whether the product uses:

* "meal plan"
* "weekly meal plan"
* "grocery list"
* "shopping list"

and use terminology consistently.

### Personas

Names and characteristics must remain consistent.

### Recipes

Recipe concepts should remain consistent.

### Meal Planning

The weekly planning model must be consistent.

### Grocery Lists

The generation/update rules must be consistent.

### Requirements

IDs must be unique.

### Sizing

The same metric must be used throughout.

### Assumptions

No assumptions should contradict one another.

### Scope

No unexplained features should appear.

Fix inconsistencies rather than merely mentioning them.

---

# 24. FINAL PRODUCT MANAGER AUDIT

Before presenting the final version, conduct a strict review.

## Product Vision

* Is it clear?
* Is it user-centered?
* Is the scope controlled?
* Does it establish the foundation for requirements?

## Personas

* Are they realistic?
* Are they meaningful?
* Are they sufficiently detailed?
* Are they non-redundant?
* Do they provide sufficient coverage?

## Scenarios

* Are they actual user situations?
* Do they provide enough context?
* Are they connected to personas?
* Do they naturally lead to the requirements?

## Assumptions

* Are assumptions explicit?
* Are they necessary?
* Are they reasonable?
* Are they clearly separated from requirements?

## Functional Requirements

* Are they user-centered?
* Are they specific?
* Are they testable?
* Do they provide sufficient coverage?
* Do they avoid unnecessary technical details?

## Non-Functional Requirements

* Are they relevant?
* Are they measurable where practical?
* Are proposed targets clearly identified?

## Sizing

* Is one metric used consistently?
* Does every story have a size?
* Does every size have a rationale?
* Are the relative estimates reasonable?

## Traceability

* Can every requirement be traced back to a user need?
* Are there missing requirements?
* Are there orphan requirements?

If any answer is unsatisfactory, revise the document before presenting it.

---

# 25. AI INTERACTION LOG

The assignment requires a detailed log of AI interactions.

Update the log so that it now reflects TWO Claude stages:

### Stage 1

Initial Recipe & Meal Planning Portal generation.

### Stage 2

Critical review and refinement.

Use the table:

| Stage | Purpose | Problems Identified | Changes Made | Expected Improvement |
| ----- | ------- | ------------------- | ------------ | -------------------- |

Do not fabricate exact prompts or interactions that did not occur.

---

# 26. SECOND MODEL COMPARISON

Do NOT compare Claude against another model.

The other model's output has not been provided to you.

Do not:

* Invent its output.
* Guess what it generated.
* Rank the models.
* Claim Claude performed better.
* Claim another model performed worse.

Instead include:

## Comparison Pending

State that the refined Claude version is ready to be compared against the independently generated output from the second AI model.

Do not perform that comparison.

---

# 27. FINAL DOCUMENT STRUCTURE

Produce the final revised document in exactly this general structure:

# Recipe & Meal Planning Portal — Claude Final Version

## 1. Product Vision

### 1.1 Initial Vision

### 1.2 Critique of Initial Vision

### 1.3 Refined / Final Product Vision

---

## 2. AI Interaction / Development Log

Include the two-stage table.

---

## 3. Personas

Include the final personas.

---

## 4. Persona-to-Requirement Traceability

Include the required table.

---

## 5. 1-Pagers / Epics

Include every final 1-pager.

For EACH one use:

# [Initiative Name] 1-pager

## PROBLEM

## ASSUMPTIONS

## FUNCTIONAL REQUIREMENTS

## NON-FUNCTIONAL REQUIREMENTS

## REQUIREMENTS SIZING

---

## 6. Overall Requirement Traceability Matrix

Include the complete table.

---

## 7. Project Manager Quality Audit

Explain the major corrections and improvements made.

---

## 8. Open Questions / Human Validation

Separate into:

### High Priority

### Medium Priority

### Low Priority

Only include genuinely important decisions.

---

## 9. Comparison Pending

Do not perform the comparison.

---

## 10. Student Evaluation of Claude's Output

Leave the actual evaluation for me.

Include only prompts/questions such as:

* What did Claude do well?
* What did Claude misunderstand?
* Which personas were most useful?
* Which requirements need modification?
* Were the scenarios appropriate?
* Were the assumptions reasonable?
* Was the sizing methodology appropriate?
* What would I change before submission?
* What did I learn from using Claude?
* Overall evaluation:

Do not answer these questions yourself.

---

# 28. WRITING QUALITY

The final document should look like a serious university-level requirements artifact.

Avoid generic AI language such as:

* "seamless experience"
* "revolutionary"
* "innovative platform"
* "enhance user satisfaction"
* "user-friendly"
* "streamline the entire process"

unless the statement is supported by a concrete requirement.

Prefer precise, concrete requirements-engineering language.

Do not write marketing copy.

---

# 29. DO NOT INVENT INFORMATION

Do not:

* Fabricate user interviews.
* Fabricate user research.
* Invent statistics.
* Invent textbook quotations.
* Invent sources.
* Invent market research.
* Claim that another AI model generated content you have not seen.
* Present assumptions as established facts.
* Claim that requirements were validated by real users.

If something requires human confirmation, label it:

**Requires Human Validation**

---

# 30. IMPORTANT: ACTUALLY MAKE THE CHANGES

Do NOT respond with a list such as:

> "Here are the areas I recommend improving..."

I need you to actually perform the improvements.

The main output must be the **complete revised final document**.

You may briefly summarize the most important improvements before the document, but the complete polished artifact is the priority.

---

# 31. FINAL SELF-TEST

Before giving me the final document, internally ask:

1. Does the product vision clearly define the problem and value?
2. Are the personas meaningful and non-redundant?
3. Does every 1-pager describe a genuine user problem?
4. Are assumptions explicitly identified?
5. Does every functional requirement correspond to a persona?
6. Does every story provide clear user value?
7. Are the requirements sufficiently specific and testable?
8. Does recipe discovery logically connect to meal planning?
9. Does meal planning logically connect to grocery-list generation?
10. Are grocery-list edge cases appropriately addressed?
11. Are non-functional requirements relevant?
12. Is sizing consistent and justified?
13. Can requirements be traced back to the product vision?
14. Is there unnecessary scope?
15. Are there contradictions?
16. Does the document satisfy the assignment rubric?
17. Does the result look like a requirements artifact rather than generic AI output?

If any answer is no, correct the problem before producing the final document.

---

# 32. FINAL INSTRUCTION

Produce the **fully revised and polished final Claude version** of the:

**Recipe & Meal Planning Portal**

The final version must include:

1. Product vision
2. Initial vision
3. Vision critique
4. Refined final vision
5. AI interaction/development log
6. Final personas
7. Persona traceability
8. Multiple appropriate 1-pagers
9. Problem/scenario statements
10. Assumptions
11. Functional requirements/user stories
12. Supporting requirement details
13. Non-functional requirements
14. Requirements sizing and rationale
15. Complete traceability matrix
16. Project Manager quality audit
17. Open questions/human validation
18. Comparison-pending section
19. Student evaluation section

Maintain the complete chain:

**Product Vision → Personas → Problems/Scenarios → Assumptions → Functional Requirements → Non-Functional Requirements → Sizing → Traceability**

Do NOT work on the Fitness & Workout Log App.

Do NOT fabricate the second AI model's output.

Do NOT invent research or textbook material.

Actually make the improvements rather than merely recommending them.

Produce the complete polished final document now.


---

## Prompt 3 — Follow-up message sent with Prompt 2 (1-pager length and sizing)

Also make the 1 pagers maximum 1 page and a half, it should include all detailed information but directly. Following the stated template and with all the information needed, including a short description and explanation of the sizing pero 1 pager.
