# Claude Prompts

Prompts given to Claude for the Fitness & Workout Log App (CS3365), pasted as provided, in order.

---

## Prompt 1: First draft (initial product definition)

You are acting as a senior Product Manager and Requirements Engineering specialist helping me complete a college-level software engineering project for my CS3365 Engineering Systems / Software Products course.

Your role is NOT simply to generate generic software requirements. Act as a professional Product Manager conducting a requirements elicitation and analysis process. Be critical, systematic, realistic, and consistent throughout the entire deliverable.

I need you to help me develop ONE of the two product ideas for my project first. We will work on the second product only after I explicitly tell you to proceed.

The product we are working on NOW is:

**Fitness & Workout Log App**
A mobile-first application for logging daily workouts, tracking exercise sets, and viewing historical workout volume graphs.

The second product, which we will NOT work on yet, is:

**Recipe & Meal Planning Portal**
A searchable UI where users filter recipes by dietary tags, plan weekly meals, and automatically generate grocery lists.

Do NOT work on the Recipe & Meal Planning Portal unless I explicitly tell you to do so.

---

# 1. ACADEMIC CONTEXT

This is a college project focused on practicing requirements elicitation and analysis during the early stages of software product development.

The overall project objective is:

> Practice what would normally happen during a regular requirements elicitation and analysis phase during the development of a software product.

The assignment uses AI models as a "Product Manager simulator." The AI is expected to help generate product visions, personas, scenarios, user stories, assumptions, functional requirements, non-functional requirements, and sizing information.

However, I am responsible for reviewing and evaluating everything generated. Therefore, do not simply produce plausible-sounding requirements. Think carefully about whether each requirement actually follows good requirements-engineering practices.

---

# 2. REQUIRED BOOK

Use the following book as the primary conceptual reference for how product visions, personas, scenarios, and requirements should be developed:

Ian Sommerville, **Engineering Software Products**, 1st Edition, Pearson, 2019.

Official book website:

https://iansommerville.com/engineering-software-products/

In particular, I have been instructed to review **Chapter 3** carefully.

Your work should reflect the concepts and best practices from Chapter 3, especially regarding:

* Product vision
* Personas
* Scenarios
* Requirements
* User stories
* Stakeholders/users
* Assumptions
* Requirements elicitation
* Appropriate level of detail
* Avoiding vague or unnecessarily technical requirements
* Connecting user needs to product functionality

Do NOT invent quotations or page numbers from the book.

If you have access to the book/content, use it to guide your reasoning. If you do not have access to the full chapter, clearly distinguish established requirements-engineering principles from anything that you are inferring.

---

# 3. IMPORTANT: WE ARE ONLY GENERATING CLAUDE'S VERSION

The course assignment ultimately requires students to use two different AI models for the product definitions and compare their outputs.

For THIS iteration, however, I specifically want you to generate **only the Claude version**.

Do NOT:

* Pretend that another AI model generated anything.
* Invent a second model's output.
* Create a fake comparison between Claude and another model.
* Claim that your version is objectively better than another model.
* Manufacture results from a model you have not actually seen.

Instead, create a strong, internally consistent Claude-generated version that I can later compare against my teammate's output from another AI model.

Where the assignment asks for critique of models, structure the documentation so that it can later accommodate a comparison, but do not fabricate the other model's results.

---

# 4. ACT AS A PROJECT MANAGER

Throughout the process, behave like a professional Product Manager.

You should:

* Identify ambiguities.
* Make reasonable assumptions when information is missing.
* Explicitly document those assumptions.
* Avoid adding unnecessary features just because they sound interesting.
* Maintain traceability between the product vision, personas, scenarios, and functional requirements.
* Ensure that requirements actually solve the problems identified by the personas.
* Identify gaps or inconsistencies.
* Avoid scope creep.
* Keep the product realistic for a student prototype.
* Think about what would realistically be implemented in a prototype.
* Prioritize clarity over technical complexity.
* Use consistent terminology throughout the document.
* Make requirements specific enough to be useful later.
* Avoid requirements that are so vague that developers could interpret them in completely different ways.
* Avoid prematurely specifying implementation technologies unless technically necessary.

Think like the person responsible for ensuring that a development team could actually use these documents as the foundation for later implementation.

---

# 5. PRODUCT IDEA

## Fitness & Workout Log App

Initial concept:

> A mobile-first UI for logging daily workouts, tracking exercise sets, and viewing historical volume graphs.

You should develop this concept into a coherent product definition without changing its fundamental purpose.

The product should primarily focus on:

1. Recording workouts.
2. Recording exercises within workouts.
3. Recording sets and relevant exercise data.
4. Allowing users to review historical workout information.
5. Visualizing workout volume/history.
6. Making workout logging practical on a mobile device.

Do not turn it into an overly broad fitness platform.

For example, do NOT automatically add:

* Social media
* Trainer marketplaces
* Live coaching
* Nutrition tracking
* Medical advice
* Wearable-device ecosystems
* AI personal trainers
* Gym booking
* Supplement marketplaces
* Payments
* Complex community systems

unless there is a strong requirements-based reason to include something.

The goal is a focused workout logging product.

---

# 6. FIRST TASK: PRODUCT VISION

Create a strong Product Vision for the Fitness & Workout Log App.

The vision should clearly communicate:

* What the product is.
* Who it is for.
* What problem it addresses.
* Why the problem matters.
* What value the product provides.
* What the core user experience should accomplish.
* What differentiates the product concept.
* The general scope of the product.
* What the product is NOT intended to solve, when useful for controlling scope.

The product vision should be appropriate for a requirements document rather than marketing copy.

Do not make it excessively long.

After generating the initial vision, critically review it yourself.

Identify:

* Ambiguous statements.
* Overly broad statements.
* Unsupported assumptions.
* Missing users or needs.
* Scope problems.
* Statements that are not measurable or useful for subsequent requirements.

Then produce a refined/final version.

---

# 7. PRODUCT VISION DEVELOPMENT LOG

Because the assignment specifically requires a detailed log of AI interactions, document how the vision was developed.

Create a section called:

## AI INTERACTION / PRODUCT VISION DEVELOPMENT LOG

Since this is the first Claude iteration, document the reasoning process in a way that I can include in my assignment.

Include:

### Interaction 1 — Initial Product Vision

Explain what information was provided to the AI and what the resulting vision focused on.

### Self-Critique

Explain what weaknesses you identified in the initial vision.

### Iteration 2 — Refined Product Vision

Explain what changes were made and why.

### Final Evaluation

Explain why the final version is more useful as a foundation for personas, scenarios, and requirements.

IMPORTANT:

Do not falsely claim that these were separate real-world API conversations if they were not. Clearly label them as stages/iterations of the Claude-assisted development process.

Also create a compact table containing:

| Iteration | Purpose | Main Changes | Reason |
| --------- | ------- | ------------ | ------ |

This will help me document my AI interaction history for the final project.

---

# 8. PERSONAS

Based on the FINAL product vision, develop an appropriate set of personas.

Use principles from Sommerville Chapter 3 and good requirements-engineering practice.

Do not create personas merely by changing age, gender, or occupation.

Each persona should represent a meaningful user type with different:

* Goals
* Motivations
* Behaviors
* Experience levels
* Pain points
* Needs
* Expectations
* Relevant context of use
* Potential frustrations with existing solutions

Determine the appropriate number of personas yourself.

Do NOT create an excessive number simply to make the document look more complete.

For each persona include:

### Persona Name

A realistic descriptive name.

### Persona Type

For example, primary user, secondary user, etc., if appropriate.

### Background

Relevant context only.

### Goals

What this person is trying to accomplish.

### Motivations

Why the goals matter.

### Behaviors

How they currently approach the problem.

### Pain Points

Problems with their current process.

### Needs

What they need from the product.

### Technology / Usage Context

Relevant device or usage circumstances.

### Product Expectations

What they expect from the Fitness & Workout Log App.

### Representative Scenario

A short realistic scenario showing how the persona would use the product.

Make sure every persona has a purpose.

After creating the personas, perform a consistency check:

* Does every persona correspond to a plausible user?
* Are the personas meaningfully different?
* Are they directly connected to the product vision?
* Do they provide enough coverage for the requirements?
* Are any redundant?
* Are important user types missing?

If changes are needed, revise them.

---

# 9. PERSONA-TO-REQUIREMENT TRACEABILITY

Create a simple traceability table connecting personas to the problems and capabilities they require.

Use:

| Persona | Main Problem | Main Goal | Relevant Product Capabilities |
| ------- | ------------ | --------- | ----------------------------- |

This is important because later functional requirements must be derived from actual user needs rather than invented independently.

---

# 10. 1-PAGERS / EPICS

Create multiple 1-pagers for the Fitness & Workout Log App.

Do NOT force everything into one 1-pager.

Determine a logical set of epics/features that adequately covers the product vision and personas.

For example, possible areas might include:

* Workout creation/logging
* Exercise and set tracking
* Workout history
* Historical volume visualization
* Workout organization

But do not blindly use these categories. Determine the appropriate breakdown based on the product vision and personas.

Each 1-pager should represent a coherent feature/problem area.

The number of 1-pagers should be justified.

---

# 11. REQUIRED 1-PAGER TEMPLATE

For every 1-pager, use EXACTLY this overall structure:

# [Initiative Name] 1-pager

## PROBLEM

One to two paragraphs describing the initiative.

This should roughly correspond to what Sommerville refers to as a scenario/problem context.

The problem statement should:

* Describe the user's situation.
* Explain the problem or need.
* Describe the relevant context.
* Explain why the problem matters.
* Avoid jumping immediately into implementation.
* Avoid simply listing features.
* Be grounded in the relevant persona(s).

The problem should describe a real user problem rather than saying:

"The system needs a feature that..."

Instead explain the situation from the user's perspective.

---

## ASSUMPTIONS

Explicitly identify assumptions made because the product vision does not specify every detail.

Examples of areas that may require assumptions:

* Authentication
* User ownership of workout data
* Exercise naming
* Units
* Internet availability
* Historical data
* Mobile device usage
* Data persistence
* Whether users can edit/delete workouts
* Whether predefined exercises exist
* Whether users can create custom exercises

Only include assumptions that are actually relevant.

Do not invent unnecessary assumptions.

For each assumption, explain briefly why it is needed.

---

## FUNCTIONAL REQUIREMENTS

Write functional requirements primarily as user stories using:

> As a [persona], I want to [perform task] so that I can/in order to [description].

Each story should be:

* Specific.
* User-centered.
* Valuable.
* Understandable.
* Testable.
* Consistent with the persona.
* Consistent with the problem.
* Within product scope.

Do not write technical implementation instructions as user stories.

For each user story, include appropriate supporting details underneath.

For example:

* Acceptance-oriented details
* Business rules
* Constraints
* Relevant behavior
* Important edge cases

Do NOT automatically turn every detail into another user story.

---

# 12. FUNCTIONAL REQUIREMENT QUALITY CONTROL

After writing the functional requirements for each 1-pager, critically review them.

Check:

### Coverage

Does the set of stories actually solve the problem?

### Persona alignment

Can I identify which persona needs each story?

### Value

Does each story explain why the user needs it?

### Specificity

Could a development team understand what is expected?

### Testability

Could someone later determine whether the requirement was satisfied?

### Scope

Is the requirement actually part of this product?

### Redundancy

Are any stories duplicates?

### Dependencies

Does one story depend on another?

### Missing requirements

Is anything essential missing?

If problems are found, revise the requirements before presenting the final 1-pager.

---

# 13. NON-FUNCTIONAL REQUIREMENTS

For every 1-pager, identify relevant non-functional requirements.

Consider categories such as:

* Performance
* Availability
* Usability
* Security
* Privacy
* Reliability
* Data integrity
* Accessibility
* Compatibility
* Scalability

Do NOT add every category automatically.

Only include requirements that are relevant to the particular product/problem.

Whenever possible, make them reasonably measurable.

Avoid vague statements such as:

"The application should be fast."

Instead use something that can eventually be evaluated, such as an appropriate response-time expectation.

Because this is an early-stage requirements exercise, distinguish between:

* Explicit requirements
* Reasonable assumptions
* Proposed targets that would require validation

Do not pretend that arbitrary numerical values came directly from the assignment or book.

---

# 14. REQUIREMENTS SIZING

For each 1-pager, select ONE sizing metric/protocol.

Use a consistent approach across the stories.

A suitable approach may be story points if appropriate.

If you choose story points, clearly explain the scale and rationale.

For example, you might define:

* 1 = trivial
* 2 = very small
* 3 = small
* 5 = moderate
* 8 = complex
* 13 = very complex

However, do not blindly use this scale if another approach is more appropriate.

The important requirement is:

> Select one type of metric to assess effort and provide an initial estimate for each story. Explain the rationale for assigning each size.

For every functional story provide:

| Story ID | User Story | Size | Rationale |
| -------- | ---------- | ---: | --------- |

The rationale should consider factors such as:

* Complexity
* Number of UI states
* Data involved
* Validation
* Dependencies
* Uncertainty
* Integration
* Potential edge cases

Do NOT estimate time in hours unless there is a specific reason to do so.

Make clear that these are INITIAL estimates and may change after further requirements analysis.

---

# 15. REQUIREMENT TRACEABILITY MATRIX

After all 1-pagers, create a high-level traceability matrix showing:

| Product Vision Need | Persona | Problem / Scenario | 1-Pager | Functional Requirement IDs |
| ------------------- | ------- | ------------------ | ------- | -------------------------- |

This should demonstrate that the requirements are not disconnected from the original product vision.

Every major product need should lead to at least one relevant requirement.

Identify any gaps.

---

# 16. OVERALL CONSISTENCY AUDIT

Before presenting the final deliverable, act as a strict project manager reviewing your own work.

Perform an internal audit covering:

### Product Vision

* Is it clear?
* Is the scope controlled?
* Does it describe user value?

### Personas

* Are they realistic?
* Are they sufficiently detailed?
* Are they meaningfully different?
* Do they cover the important users?

### Scenarios / Problems

* Are they actual user problems?
* Are they grounded in personas?
* Do they provide enough context?

### Assumptions

* Are assumptions explicitly documented?
* Are there hidden assumptions that should be stated?

### Functional Requirements

* Are stories user-centered?
* Are they sufficiently specific?
* Are they testable?
* Is coverage sufficient?

### Non-Functional Requirements

* Are relevant quality attributes covered?
* Are statements measurable where practical?

### Sizing

* Is one consistent metric being used?
* Does each story have a rationale?
* Are estimates reasonable for relative effort?

### Consistency

* Are there contradictions?
* Does every story connect to a persona?
* Does every major requirement trace back to a problem?
* Are there features that appear without justification?

If you identify problems, FIX THEM before producing the final version.

---

# 17. DOCUMENT STRUCTURE

Organize the final Claude output in the following order:

# Fitness & Workout Log App — Claude Product Definition

## 1. Product Vision

### Initial Vision

### Vision Critique

### Refined / Final Vision

## 2. AI Interaction / Product Vision Development Log

Include the iteration table and explanation.

## 3. Personas

Include all personas.

## 4. Persona-to-Requirement Traceability

Include the table.

## 5. 1-Pagers / Epics

Include all 1-pagers.

For each:

### [Initiative Name] 1-pager

#### PROBLEM

#### ASSUMPTIONS

#### FUNCTIONAL REQUIREMENTS

#### NON-FUNCTIONAL REQUIREMENTS

#### REQUIREMENTS SIZING

## 6. Requirement Traceability Matrix

Include the complete matrix.

## 7. Project Manager Quality Audit

Include findings and corrections.

## 8. Open Questions / Items Requiring Human Validation

Identify things that I should personally review or confirm before submitting the assignment.

---

# 18. VERY IMPORTANT: DO NOT INVENT INFORMATION

You are assisting me, but I am responsible for the final submission.

Therefore:

* Clearly identify assumptions.
* Do not present assumptions as facts.
* Do not invent information from my professor.
* Do not invent requirements supposedly stated in the textbook.
* Do not fabricate user research.
* Do not claim that real users were interviewed.
* Do not claim that the product has validated market demand.
* Do not fabricate statistics.
* Do not fabricate AI interactions.
* Do not fabricate another model's output.
* Do not cite sources you did not actually consult.

If something requires human validation, explicitly mark it as:

**Requires Human Validation**

---

# 19. AVOID GENERIC AI OUTPUT

This is extremely important.

I do NOT want a generic list of obvious app features.

For example, avoid shallow statements such as:

* "Users can log workouts."
* "Users can view their history."
* "The application should be easy to use."

Instead, develop requirements from realistic user situations and explain the underlying user need.

The resulting work should look like a serious requirements-analysis artifact prepared by a Product Manager, not a generic AI-generated feature list.

---

# 20. ACADEMIC APPROPRIATENESS

This is a college assignment.

Use professional but understandable language.

Do not make the document unnecessarily corporate or filled with buzzwords.

Use terminology appropriate for:

* Software engineering
* Product management
* Requirements engineering
* Agile development
* User stories
* Personas
* Scenarios
* Functional requirements
* Non-functional requirements
* Relative sizing

The result should be something that could realistically be submitted as part of a university software engineering project after human review.

---

# 21. IMPORTANT DISTINCTION BETWEEN GENERATED CONTENT AND MY EVALUATION

At the end of the document, create a section specifically reserved for me:

# Student Evaluation of Claude's Output

Leave this section mostly blank except for a short set of prompts/questions that I can answer myself.

For example:

* What did Claude do well?
* What requirements or personas were particularly useful?
* What did Claude misunderstand?
* Which assumptions should be changed?
* Which requirements need clarification?
* Were the personas sufficiently specific?
* Were the scenarios appropriate?
* Was the sizing rationale reasonable?
* What would I change before submitting?
* Overall evaluation of Claude's contribution:

Do NOT answer these questions yourself.

This section is for MY evaluation of the AI output.

---

# 22. FINAL QUALITY STANDARD

Before giving me the final result, imagine that you are the Product Manager presenting this work to a software development team.

Ask yourself:

> "Could a development team understand the user problems, users, intended product behavior, and relative complexity well enough to begin the next requirements phase?"

If the answer is no, improve the document.

Also ask:

> "Can I trace the functional requirements back to actual user problems and personas?"

If the answer is no, revise the requirements.

And finally:

> "Does this demonstrate that the AI was used as a requirements/product-management assistant rather than blindly copied?"

If not, improve the documentation of iterations, critiques, assumptions, and validation points.

---

# 23. OUTPUT INSTRUCTIONS

Work ONLY on the **Fitness & Workout Log App**.

Do not discuss or generate the Recipe & Meal Planning Portal yet.

Produce the complete Claude version with:

1. Product vision
2. Vision iterations and critique
3. AI interaction log
4. Personas
5. Persona traceability
6. Multiple 1-pagers
7. Problem/scenario statements
8. Assumptions
9. Functional requirements/user stories
10. Non-functional requirements
11. Requirements sizing and rationale
12. Requirement traceability
13. Project Manager quality audit
14. Open questions requiring human validation
15. Blank student evaluation section

Use the assignment's 1-pager structure exactly where specified.

Be detailed enough for a college project, but avoid unnecessary filler.

Most importantly, maintain consistency across the entire document: the personas should drive the scenarios, the scenarios should drive the requirements, and the requirements should drive the sizing.

Do not move on to the second product until I explicitly instruct you to.

---

## Prompt 2: Final version (review and refinement)

I have now received your first complete draft for the **Fitness & Workout Log App** portion of my CS3365 Engineering Systems / Software Products project.

Your task now is to take that first draft and produce a **polished, academically strong, internally consistent final version**.

Do NOT simply rewrite the previous document with different wording. Act as a senior Product Manager and Requirements Engineering reviewer performing a formal quality review of your own previous work.

The goal is to identify weaknesses, inconsistencies, unnecessary assumptions, missing requirements, poorly written scenarios, weak personas, and sizing problems, then correct them.

I will use this revised version as the main Claude-generated version that I will later review myself and potentially compare with another student's/model's version.

IMPORTANT: We are STILL working ONLY on:

**Fitness & Workout Log App**

> Mobile-first UI for logging daily workouts, tracking exercise sets, and viewing historical volume graphs.

Do NOT work on the Recipe & Meal Planning Portal yet.

---

# 1. SOURCE MATERIAL

Use the first draft you already generated in this conversation as the starting point.

Also use the assignment requirements I previously provided and the following book as the conceptual reference:

Ian Sommerville, **Engineering Software Products**, 1st Edition, Pearson, 2019.

Official website:

https://iansommerville.com/engineering-software-products/

Pay particular attention to **Chapter 3**, especially the treatment of:

* Product visions
* Personas
* Scenarios
* Requirements
* User stories
* Requirements elicitation
* Assumptions
* User-centered product definition

Do not invent quotations, page numbers, or claims from the book.

---

# 2. YOUR ROLE IN THIS ITERATION

For this iteration, act simultaneously as:

1. Senior Product Manager
2. Requirements Engineer
3. Software Product reviewer
4. Academic-quality editor

Your job is to improve the first draft based on the assignment rubric.

Be critical.

Do not assume that everything in the first draft is correct simply because you generated it.

You should actively search for weaknesses.

---

# 3. FIRST: PERFORM A DETAILED REVIEW OF THE FIRST DRAFT

Before rewriting anything, internally evaluate the previous draft against the following criteria.

## A. Product Vision

Check:

* Is the vision clear?
* Does it identify the target users?
* Does it identify the core problem?
* Does it communicate user value?
* Is the scope appropriately constrained?
* Does it avoid becoming a generic "fitness app"?
* Does it provide a useful foundation for personas and requirements?
* Are any claims unsupported?
* Are there unnecessary features?

If weaknesses exist, correct them.

---

# 4. PERSONA REVIEW

Evaluate every persona from the first draft.

Ask:

* Is this a genuine user type?
* Does this persona have a distinct goal?
* Does this persona have meaningful behavioral differences from other personas?
* Is the persona sufficiently detailed?
* Is the persona actually useful for generating requirements?
* Are any personas redundant?
* Are important user types missing?
* Are the personas grounded in realistic usage scenarios?
* Does each persona connect directly to the product vision?

Do NOT create additional personas merely to increase the number.

The goal is an appropriate number of meaningful personas.

If a persona is unnecessary, merge or remove it.

If an important user type is missing, add it and explain why.

---

# 5. SCENARIO / PROBLEM REVIEW

This is especially important because the assignment rubric explicitly evaluates:

> Problem statements (1 per 1-pager)
>
> * Properly written scenarios
> * Sufficient coverage of requirements
> * Appropriate complement with respect to assumptions

Review every 1-pager's PROBLEM section.

Make sure each problem:

* Describes a user situation.
* Is connected to one or more personas.
* Explains the user's need/problem.
* Provides enough contextual detail.
* Explains why the problem matters.
* Does not simply describe a software feature.
* Does not prematurely prescribe a technical solution.
* Provides enough context for the functional requirements that follow.

A weak example would be:

> "Users need a way to record workouts."

A stronger scenario would explain the user's actual situation, difficulty, context, and desired outcome.

Improve every problem statement accordingly.

---

# 6. ASSUMPTION REVIEW

Review every assumption.

For each one ask:

* Is it actually necessary?
* Is it supported by the product concept?
* Is it clearly identified as an assumption?
* Does it affect the requirements?
* Is it unnecessarily restrictive?
* Is it accidentally being presented as a confirmed requirement?

Remove unnecessary assumptions.

Add important assumptions that were previously missing.

Make the assumptions directly relevant to the associated 1-pager.

---

# 7. FUNCTIONAL REQUIREMENT REVIEW

This is one of the most important parts of the revision.

Review EVERY functional requirement/user story.

Use the basic format:

> As a [persona], I want to [perform task] so that I can/in order to [description].

For every story check:

### User

Is a real persona identified?

### Action

Is the desired action clear?

### Value

Does the story explain why the user wants it?

### Specificity

Is the requirement sufficiently specific?

### Testability

Could a development team eventually determine whether it has been implemented correctly?

### Scope

Is it genuinely part of the Fitness & Workout Log App?

### Consistency

Does it match the problem and assumptions?

### Redundancy

Does another story already cover it?

### Completeness

Does the 1-pager cover the problem sufficiently?

Revise weak stories.

Do NOT make stories unnecessarily technical.

Do NOT turn implementation decisions into requirements unless they are genuinely required.

---

# 8. SUPPORTING DETAILS / ACCEPTANCE-ORIENTED DETAILS

Review the supporting details underneath each user story.

These details should clarify behavior without unnecessarily turning into implementation instructions.

Good details can address:

* Required information
* Validation
* User choices
* Editing
* Deletion
* Empty states
* Error cases
* Important business rules
* Relevant constraints

Make sure the details actually contribute to understanding the requirement.

Remove filler.

---

# 9. NON-FUNCTIONAL REQUIREMENT REVIEW

Review the non-functional requirements for every 1-pager.

Check whether the previous version:

* Included relevant quality attributes.
* Avoided irrelevant categories.
* Used measurable language where practical.
* Avoided vague statements.
* Clearly distinguished proposed targets from confirmed requirements.

Do not arbitrarily add numbers simply to make requirements appear technical.

For example, do not invent a performance requirement such as "response time must be under 1 second" unless there is a reasonable justification.

When numerical targets are proposed assumptions rather than established requirements, explicitly identify them as proposed targets requiring validation.

Consider relevant areas such as:

* Performance
* Usability
* Accessibility
* Security
* Privacy
* Reliability
* Data integrity
* Availability
* Compatibility

Only include categories relevant to the specific product.

---

# 10. REQUIREMENT SIZING REVIEW

The assignment specifically requires:

> Select one type of metric to assess effort and provide an initial estimate for each of the stories in the functional requirements. Explain the rationale to assign each size.

Review the sizing system from the first draft.

Use ONE consistent sizing method throughout the product.

If story points are used, make the scale explicit.

For each story provide:

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
* Amount of work involved

Do not confuse:

**User value**

with:

**Implementation effort**

The size should represent relative implementation effort/complexity, not how important the feature is.

Also check that the sizing is internally consistent.

For example, if two stories are similarly complex, they should not receive dramatically different sizes without an explanation.

---

# 11. TRACEABILITY REVIEW

This is extremely important.

Verify the following chain:

**Product Vision → Persona → Problem/Scenario → User Story → Size**

Every major requirement should be traceable backward to a user need.

Every major user need should result in relevant requirements.

Identify orphan requirements.

Identify user needs that are not covered.

If something does not fit logically, revise it.

---

# 12. SCOPE CONTROL

Review the entire document for scope creep.

The Fitness & Workout Log App is NOT intended to become a complete health/wellness ecosystem.

Remove or flag features that are not justified by the original product concept.

The core scope should remain centered around:

* Workout logging
* Exercise tracking
* Set tracking
* Historical workout information
* Workout volume/history visualization
* Practical mobile-first usage

Features outside this scope should require explicit justification.

---

# 13. CONSISTENCY CHECK

Perform a complete consistency audit.

Check that:

* Persona names are identical everywhere.
* Persona descriptions do not contradict their scenarios.
* Terminology is consistent.
* Feature names are consistent.
* Story IDs are unique.
* 1-pager names are consistent.
* Requirements are not duplicated across 1-pagers.
* Assumptions are not contradictory.
* Non-functional requirements do not conflict with functional requirements.
* Sizing uses one consistent method.
* Traceability tables accurately reflect the requirements.
* The final product scope remains coherent.

Fix every inconsistency you find.

---

# 14. IMPROVE THE PRODUCT VISION

Take the refined product vision from the first draft and perform one final editorial pass.

The final vision should be:

* Concise enough to be a vision.
* Specific enough to guide requirements.
* User-centered.
* Clear about the problem.
* Clear about the intended value.
* Appropriately scoped.
* Consistent with the personas and 1-pagers.

Do not turn it into a marketing slogan.

---

# 15. IMPROVE THE AI INTERACTION LOG

The assignment requires:

> Detailed log of AI interactions.

Since this is the SECOND iteration of the Claude work, update the interaction log to accurately represent:

### Iteration 1

Initial Claude-generated product vision and requirements.

### Iteration 2

Review, critique, refinement, and correction of the initial output.

For Iteration 2, document:

* What was reviewed.
* What weaknesses were identified.
* What changes were made.
* Why the changes were made.
* How the changes improved alignment with the assignment and Chapter 3 principles.

Do NOT fabricate exact conversation details that did not occur.

The log should be honest about what was actually done.

Create a table:

| Iteration | Purpose | Problems Identified | Changes Made | Expected Improvement |
| --------- | ------- | ------------------- | ------------ | -------------------- |

---

# 16. DO NOT COMPARE AGAINST ANOTHER MODEL

The final assignment will eventually involve another AI model, but I have NOT provided that model's output to you.

Therefore:

DO NOT:

* Invent a comparison.
* State that Claude performed better.
* State that another model performed worse.
* Create fictional output from another model.
* Rank models.
* Fabricate another model's strengths or weaknesses.

Instead, include a section:

## Comparison Pending

Explain that the Claude version has now been refined and is ready to be compared with the independently generated version from the second model.

Do not perform the comparison yourself.

---

# 17. FINAL DOCUMENT STRUCTURE

Now produce the polished version using this structure:

# Fitness & Workout Log App — Claude Final Version

## 1. Product Vision

### 1.1 Initial Vision

Briefly preserve the original version.

### 1.2 Critique of Initial Vision

Explain the important weaknesses.

### 1.3 Refined Product Vision

Present the improved final vision.

---

## 2. AI Interaction / Development Log

Document the first and second iterations.

Include the required table.

---

## 3. Personas

Present the final set of personas.

For every persona include:

* Persona name
* Persona type
* Background
* Goals
* Motivations
* Behaviors
* Pain points
* Needs
* Usage context
* Product expectations
* Representative scenario

---

## 4. Persona-to-Requirement Traceability

Use:

| Persona | Main Problem | Main Goal | Relevant Product Capabilities |
| ------- | ------------ | --------- | ----------------------------- |

---

# 5. 1-Pagers / Epics

Include all appropriate 1-pagers.

For EACH 1-pager use this exact structure:

# [Initiative Name] 1-pager

## PROBLEM

One to two strong paragraphs written as a realistic user problem/scenario.

## ASSUMPTIONS

List relevant assumptions and explain why they are necessary.

## FUNCTIONAL REQUIREMENTS

Use the required user-story format:

> As a [persona], I want to [perform task] so that I can/in order to [description].

Then include appropriate supporting details.

Assign unique story IDs such as:

* FW-01
* FW-02
* FW-03

Continue sequentially throughout the entire Fitness & Workout Log App.

## NON-FUNCTIONAL REQUIREMENTS

List relevant requirements.

Assign IDs if useful, such as:

* NFR-01
* NFR-02

## REQUIREMENTS SIZING

Use the selected metric and include:

| Story ID | User Story | Size | Rationale |
| -------- | ---------- | ---: | --------- |

---

# 6. Overall Requirement Traceability Matrix

Use:

| Vision Need | Persona | Problem / Scenario | 1-Pager | Story IDs |
| ----------- | ------- | ------------------ | ------- | --------- |

Check that every row is accurate.

---

# 7. Project Manager Quality Audit

Create a concise but meaningful audit.

Use categories:

### Product Vision

What was improved?

### Personas

What was improved?

### Scenarios

What was improved?

### Functional Requirements

What was improved?

### Non-Functional Requirements

What was improved?

### Sizing

What was improved?

### Traceability

What was improved?

### Remaining Risks

What still requires human review?

---

# 8. Open Questions / Human Validation

Create a section identifying decisions that I should personally review before submitting the work.

Separate them into:

### High Priority

Things that could materially affect the requirements.

### Medium Priority

Things that could improve the product definition but are not essential.

### Low Priority

Optional refinements.

Do not leave me with dozens of unnecessary questions.

Focus on decisions that genuinely require human judgment.

---

# 9. Comparison Pending

Briefly state that the refined Claude version is ready to be compared against the independent output generated using the second AI model.

Do not perform that comparison.

---

# 10. STUDENT EVALUATION OF CLAUDE

At the very end, create a section for me:

# Student Evaluation of Claude's Output

Leave the actual evaluation blank.

Provide only questions/prompts for me to answer:

* What did Claude do well?
* What did Claude do poorly?
* Which requirements were particularly useful?
* Which requirements need modification?
* Were the personas sufficiently specific?
* Were the scenarios realistic and appropriate?
* Were the assumptions reasonable?
* Was the sizing methodology appropriate?
* What would I change before submitting?
* What did I learn from using Claude?
* Overall evaluation:

Do NOT answer these questions for me.

---

# 11. IMPORTANT WRITING STANDARD

The final version should NOT sound like generic AI-generated text.

Avoid repetitive phrases such as:

* "The app should provide a seamless experience."
* "This will enhance user satisfaction."
* "Users can easily..."
* "The system should be user-friendly."

Unless these ideas are supported by concrete requirements, remove them.

Use precise requirements-engineering language.

The document should read like a serious university-level requirements artifact.

---

# 12. IMPORTANT ACADEMIC STANDARD

Remember that the professor will evaluate:

### Product vision

* Detailed AI interaction log
* Critique of different generated versions
* Quality of the vision

### Personas

* Sufficient detail
* Appropriate number
* Specificity

### Problem statements

* One per 1-pager
* Proper scenarios
* Requirement coverage
* Appropriate assumptions

### Functional requirements

* Book/class best practices
* Sufficient coverage

### Sizing

* Rationale
* Appropriate metric assignment protocol

Optimize the document specifically around these grading criteria.

---

# 13. FINAL SELF-REVIEW BEFORE OUTPUT

Before presenting the final document, perform one final internal review.

Ask:

1. Does every persona have a legitimate purpose?
2. Does every 1-pager solve a clearly stated user problem?
3. Does every functional requirement correspond to a persona?
4. Does every requirement provide user value?
5. Are the stories specific enough?
6. Are the requirements sufficiently complete?
7. Are assumptions clearly separated from requirements?
8. Are non-functional requirements relevant and reasonable?
9. Is sizing consistent and justified?
10. Can every requirement be traced back to the product vision?
11. Is there any unnecessary scope?
12. Are there contradictions?
13. Does the document follow the assignment's requested structure?
14. Does it reflect good Chapter 3 requirements-engineering practices?
15. Does it look like something a university student could realistically submit after reviewing it?

If the answer to any of these is no, correct the problem before producing the final version.

---

# 14. MOST IMPORTANT INSTRUCTION

Do NOT simply tell me what should be changed.

Actually make the changes.

I want the output to be the **fully revised and polished final Claude version**, not a critique followed by suggestions.

You may briefly explain the major improvements at the beginning, but the main output must be the complete revised document.

Do NOT work on the Recipe & Meal Planning Portal.

Do NOT fabricate the second AI model.

Do NOT fabricate user research.

Do NOT fabricate textbook quotations.

Do NOT invent information that is not supported by the product concept or clearly identified as an assumption.

Produce the polished final Fitness & Workout Log App document now.
