# Recipe & Meal Planning Portal — Claude Final Version

**Course:** CS3365 Engineering Systems / Software Products · **Product:** Recipe & Meal Planning Portal (Product 2)
**Status:** Final Claude version (Stage 2 of 2). Student review and second-model comparison are pending.
**Reference:** Sommerville, *Engineering Software Products* (2019), Chapter 3, used by paraphrase only (no quotations or page numbers). Where a point comes from general requirements-engineering practice or from my own judgement rather than the chapter, it is stated as an assumption.
**Labels:** **Requires Human Validation** (RHV) marks a proposed decision, assumed fact, or proposed number. No user research, interviews or statistics were used; all personas are proto-personas.
**Terminology used throughout:** *recipe collection*, *saved recipes*, *meal plan* (one calendar week), *meal slot* (one day + one meal type), *grocery list* (derived from one meal plan).

---

## 1. Product Vision

### 1.1 Initial Vision

**Stage 1, first draft:**

> The Recipe & Meal Planning Portal is an innovative web platform that helps people eat better and save time. Users can search thousands of recipes, filter them by dietary needs, plan their meals for the week, and automatically get a complete grocery list. It makes meal planning easy for everyone and helps users stay healthy, reduce food waste, and save money.

**Stage 1, refined version (summary):** a web application where users find recipes, place them in a weekly meal plan, and generate a grocery list; intended for home cooks; with a problem statement, a four-point value list, a seven-step interaction outline, and in-scope/out-of-scope lists (about 300 words).

### 1.2 Critique of Initial Vision

| # | Weakness (first draft) | Weakness (Stage 1 refined version) |
|---|---|---|
| 1 | Marketing wording ("innovative", "easy for everyone") with no testable meaning | Too long: it mixed vision, scope and interaction steps, so it worked as a mini-specification rather than a vision |
| 2 | Implied health outcomes ("eat better", "stay healthy") that the scope excludes | Value points were written as features ("duplicate ingredients combined"), not as user value |
| 3 | Unsupported savings claims and an invented recipe count ("thousands") | "People who cook at home" was too broad; the personas show narrower groups with different needs |
| 4 | "Dietary needs" ambiguous: could be read as medical filtering | No statement of how the product differs from how people plan meals today |
| 5 | Recipes, plan and list listed side by side without saying how they connect | Accounts appeared in scope without a stated user need |
| 6 | No non-goals, no description of use | The rule "the meal plan determines the grocery list, and servings flow through" was implicit, not stated |

### 1.3 Refined / Final Product Vision

**FOR** people who cook at home and plan their own meals for a week (individuals, couples, families, flatmates) **WHO** repeatedly spend effort finding recipes that fit their dietary restrictions and time limits, deciding what to cook on which day, and writing a correct shopping list by hand, **THE** Recipe & Meal Planning Portal is a web application **THAT** lets users filter a recipe collection by dietary tag, place recipes into a weekly meal plan, and receive a grocery list calculated from that plan and kept consistent with it. **UNLIKE** recipe sites and note or spreadsheet tools, where recipes, plans and shopping lists are kept separately (**RHV**: no competitor analysis was performed), **OUR PRODUCT** treats them as one connected data set: recipes feed the meal plan, and the meal plan determines the grocery list.

*(Sentence pattern follows the vision template Sommerville uses in his iLearn example.)*

**Core chain: Recipes → Meal Plan → Grocery List.** Adding a recipe to Monday dinner adds its ingredients, scaled to that meal slot's servings, to the grocery list. Changing or removing the meal changes the list. Identical ingredients across meals are combined when their quantities can be added correctly.

**Value to users**
1. They narrow recipes by the criteria they actually decide on (dietary tag, meal type, time, ingredients to avoid).
2. They see the whole week's meals in one place and change them without re-entering anything else.
3. They get one grocery list whose quantities follow from the meal plan and its servings, so they stop copying and adding ingredients by hand.

**In scope:** recipe search and filtering; recipe details and servings; saved recipes; weekly meal planning; grocery-list generation, use and maintenance; minimal accounts so data persists (**RHV**).
**Out of scope:** calorie or nutrient tracking; medical or allergen-safety advice or verification; personalised nutrition plans; social features; user-created recipes; grocery ordering, delivery or payment; restaurant or fitness features; AI-generated recipes or coaching.
**Limitation:** dietary tags are labels in the recipe data. The portal filters on them; it does not certify them.

---

## 2. AI Interaction / Development Log

These are stages of one Claude-assisted process, not separate recorded conversations. Prompts are described, not reproduced.

### Iteration 1 — Initial Claude Product Definition

Input: the assignment's one-line product idea, the three core activities, a scope-control list, the Sommerville Chapter 3 text, and a request for vision, personas, 1-pagers, stories, NFRs, sizing and traceability. Claude wrote a first vision, critiqued it, refined it, then produced four personas, six 1-pagers, 30 stories (RP-01 to RP-30, 108 points) and a consolidated sizing table.

### Iteration 2 — Critical Review and Refinement

Input: the Stage 1 draft, a formal-review brief, the assignment rubric, and a follow-up request that each 1-pager be at most one and a half pages and carry its own sizing. Claude reviewed its own draft against the rubric, then rewrote it. Main findings: the grocery-list refresh rule was complex and partly contradictory; several stories overlapped; assumptions were scattered and in places inconsistent; NFR numbers were mixed with firmer statements; sizing had no explicit assignment protocol; and the 1-pagers were too long. Section 7 lists each correction.

| Stage | Purpose | Problems Identified | Changes Made | Expected Improvement |
|---|---|---|---|---|
| 1a. Initial vision | First statement of the product | Marketing language, implied health claims, invented content size, no non-goals, no link between recipes/plan/list | Rewrote as a scoped vision with a problem statement and non-goals | A vision that personas and requirements can be derived from |
| 1b. Product definition | Personas, 1-pagers, stories, NFRs, sizing | Not yet reviewed | Produced 4 personas, 6 1-pagers, 30 stories, 108 points | A complete first version to critique |
| 2a. Review of vision | Check vision against rubric | Too long and feature-like; no differentiation; accounts unjustified | Rewrote in the FOR/WHO/THE/THAT/UNLIKE pattern; stated the plan-drives-list rule | Shorter, testable vision |
| 2b. Review of personas | Check for redundancy and coverage | Persona types not justified; Helen carried four unrelated needs; thin technical-skill detail (a Chapter 3 aspect) | Sharpened each persona's distinct problem; reclassified Tomás and Helen as Secondary; added technical skill | Each persona drives different stories |
| 2c. Review of 1-pagers | Check problems, assumptions, coverage | Problems read as feature lists; shared assumptions repeated or inconsistent; page length | Rewrote problems as narrative scenarios; added product-wide assumptions G1–G7; compressed each 1-pager | Problems lead naturally to stories; consistent assumptions |
| 2d. Review of stories | Check value, testability, scope, redundancy | Overlapping stories; contradictory list-refresh rules; quantity editing conflicted with auto-sync | Merged 30 stories into 28; replaced "out-of-date flag + refresh" with automatic sync; replaced quantity editing with "already have" | Unambiguous grocery-list behavior |
| 2e. Review of NFRs and sizing | Remove arbitrary claims; make sizing systematic | Numbers presented without a label; no sizing protocol; sizing only in one table | Labelled each NFR Core or Proposed; defined a driver-based protocol; added sizing to every 1-pager | Defensible, consistent estimates |
| 2f. Traceability and audit | Close gaps | Weak links for two stories; unlisted gaps | Rebuilt matrix with points; documented gaps and exclusions | Complete chain vision → size |

---

## 3. Personas

**Method (Chapter 3).** Each persona gives personal context, relevance to the product, and technical skill. The assignment template also asks for Goals; Chapter 3 doubts that "goals" are well defined, so Goals here are concrete tasks and Motivations explain why the product matters. All details are assumptions (**RHV**): checking them with 3–5 real people per group would be the next step.

**Review decisions**

| Persona | Decision | Reason |
|---|---|---|
| Marcus Reyes | Keep, Primary | Only persona with a hard restriction, household scale and mid-week changes |
| Priya Nair | Keep, Primary | Precision needs: multi-tag filters, repeated meals, combining ingredients and units. Absorbs Stage 1's "weekend meal-prepper" |
| Tomás Herrera | Keep, Secondary (was unlabelled) | Distinct shopping-time use: phone, already-have items, extra items. His discovery needs overlap with Marcus's, so he is not Primary |
| Helen Okafor | Keep, Secondary | Distinct accessibility, repeat-week, print and data-control needs. Trimmed to those four |
| Recipe administrator | Not added | Recipe collection is assumed to be supplied (G1); recorded as an open question |

### 3.1 Marcus Reyes

**Persona Type:** Primary user

**Background:** 38, project coordinator; lives with his partner and two children (7 and 10). Degree-educated, uses a smartphone and laptop daily, little patience for setup. His daughter has a doctor-diagnosed nut allergy, so the household treats "nut-free" as non-negotiable. The family shops once a week at one supermarket.

**Goals:** Choose Monday–Friday dinners in one sitting; pick meals the whole family accepts; end with one grocery list sized for four people (sometimes five).

**Motivations:** Weekday evenings are tight. If dinner is undecided by 5 pm the family orders takeaway, and a forgotten ingredient means another trip.

**Behaviors:** Collects ideas in bookmarks, screenshots and family chats. Plans on Sunday, types a list into a notes app, scales quantities in his head, and does not notice that three recipes all need onions.

**Pain Points:** Screening recipes for nuts by hand; recipes written for the wrong number of servings; duplicate ingredients; a list that goes stale when Wednesday's dinner changes.

**Needs:** Tag and ingredient filtering; the full ingredient list to verify for himself; servings scaling; a whole-week view; one grocery list that follows the meal plan.

**Usage Context:** Sunday evening on a laptop at home; phone in the supermarket; occasionally a mid-week phone swap of a meal.

**Product Expectations:** Filters that behave predictably; a recipe into a day in a few steps; list quantities he can trust. He knows tags are not an allergen guarantee and will still read labels.

**Representative Scenario:** On Sunday Marcus filters for dinner, nut-free and under 45 minutes. He opens a chicken-and-rice recipe written for 2 servings, reads the full ingredient list, sets 5 servings, and adds it to Tuesday dinner (signing in when asked). He fills Monday–Friday, then generates the grocery list. Onions from three recipes are one line; expanding it shows which dinners need them. On Wednesday he replaces Thursday's recipe with a simpler one. The list updates by itself and the items he already marked stay marked.

### 3.2 Priya Nair

**Persona Type:** Primary user

**Background:** 27, software tester, lives alone. Vegetarian by conviction; avoids gluten by choice (not diagnosed, so she treats tags as preferences). Very comfortable with technology; plans on a laptop. Cooks one or two large batches on Sunday.

**Goals:** Find vegetarian, gluten-free recipes without wading through unsuitable ones; plan batch-cooked meals; get an accurate combined list so she buys only what she needs.

**Motivations:** Wants variety without spending Sunday searching. Living alone, she buys small quantities, so list errors waste money and food.

**Behaviors:** Searches several recipe sites using each site's own filters, copies ingredients into a spreadsheet, adds up quantities by hand including unit conversions, and eats the same dish on several days.

**Pain Points:** Filters that differ by site; combining several dietary tags; a disliked ingredient (mushrooms) hidden in results; mixed units for one ingredient; re-entering the same meal for each day.

**Needs:** Multi-tag filtering; ingredient exclusion; one recipe into several meal slots; correct combined totals across compatible units; saved recipes.

**Usage Context:** Saturday or Sunday on a laptop; occasionally on her phone during the week.

**Product Expectations:** Predictable filter logic (every selected tag must match) and totals she can verify.

**Representative Scenario:** Priya selects vegetarian and gluten-free and excludes mushrooms, then saves three recipes. In one action she adds a lentil curry to Monday, Tuesday and Wednesday lunch at 1 serving each. In the grocery list, lentils appear once with the total for three servings, and coconut milk from two recipes (200 ml and 1 cup) is one line in a single unit. She expands it to check where it came from.

### 3.3 Tomás Herrera

**Persona Type:** Secondary user

**Background:** 21, university student sharing a flat with two others; cooks 4–5 dinners a week on a small budget in a small kitchen. Very comfortable with technology, phone-first. Not a confident cook. No dietary restrictions.

**Goals:** Find quick, simple recipes with few ingredients; follow a grocery list efficiently in the shop; avoid buying what is already in the cupboard.

**Motivations:** Money and time are limited; buying a full pack for one recipe feels wasteful.

**Behaviors:** Takes ideas from video and social posts, keeps a rough list in his phone, shops on the way home, and forgets what is already at home.

**Pain Points:** Long ingredient lists; unclear total time; an unorganised list that sends him back through the same aisles; non-recipe items on a separate list.

**Needs:** Meal-type and time filters; a result summary showing time and ingredient count; a list grouped by shop section; "already have", check-off and own items; phone-friendly layout.

**Usage Context:** Phone, on the bus or between classes for planning; in the shop for the list.

**Product Expectations:** Quick browsing on a small screen; a list usable one-handed.

**Representative Scenario:** Tomás filters dinners under 30 minutes and adds four recipes to his meal plan. The grocery list is grouped by category. Rice and olive oil are already at home, so he marks them "already have". He adds washing-up liquid as his own item and ticks items off as he shops.

### 3.4 Helen Okafor

**Persona Type:** Secondary user

**Background:** 66, retired librarian; cooks for herself and her husband (he avoids dairy by preference). Uses a laptop and tablet for email and video calls, is cautious about creating accounts, and finds small targets hard because of mild arthritis. Prefers paper lists.

**Goals:** Plan four or five dinners a week; reuse a familiar routine; carry a printed list; read instructions comfortably.

**Motivations:** She likes routine and dislikes redoing the same choices or losing work.

**Behaviors:** Cooks from recipe cards and cookbooks, writes lists by hand, occasionally searches the web for a dairy-free recipe.

**Pain Points:** Small, low-contrast text; unclear buttons; fear of irreversible actions; work lost on refresh; lists that print badly.

**Needs:** Readable layout and large targets; copying last week's plan; confirmation before removing; a clean print layout; an account she can delete.

**Usage Context:** Kitchen table on a laptop or tablet; prints the list.

**Product Expectations:** Nothing disappears unexpectedly; controls have clear text labels.

**Representative Scenario:** Helen signs in, copies last week's meal plan to next week, and replaces two dinners with dairy-free recipes found by filtering. When she removes a meal she is asked to confirm. She prints the grocery list without the "already have" items.

### 3.5 Persona Quality Check

| Check | Result |
|---|---|
| Connected to the vision? | Yes: each uses recipes, the meal plan and the grocery list |
| Distinct problem and behavior? | Marcus: restriction + family scale + change. Priya: precision + batch. Tomás: phone shopping. Helen: accessibility + repetition + print + data control |
| Contribute to requirements? | Each is the persona on at least four stories (Marcus 10, Priya 6, Tomás 6, Helen 6) |
| Redundant? | No after the merge of the Stage 1 fifth persona into Priya |
| Coverage? | Discovery, planning, list generation, shop use, persistence. Missing user: recipe administrator (out of scope by assumption G1) |
| Number | Four, within Chapter 3's guidance of at most about five |

---

## 4. Persona-to-Requirement Traceability

| Persona | Main Problem | Main Goal | Relevant Product Capabilities |
| ------- | ------------ | --------- | ----------------------------- |
| Marcus Reyes (Primary) | Screening recipes for a nut allergy by hand; rescaling for household size; a list that stops matching the plan after a change | A one-sitting weekday plan and a correct grocery list for his household | Tag and ingredient-exclusion filters (RP-02, RP-04); servings scaling (RP-08); weekly plan (RP-11, RP-12, RP-14); generation, sources and automatic sync (RP-17, RP-21, RP-25) |
| Priya Nair (Primary) | Inconsistent filters; manually adding ingredients and units across recipes | Compliant recipes, batch planning, accurate combined list | Multi-tag filter and exclusion (RP-02, RP-04); saved recipes (RP-09, RP-10); multi-slot add (RP-13); combining and unit conversion (RP-18, RP-19) |
| Tomás Herrera (Secondary) | Complicated recipes; disorganised list; buying what he already has | Quick plan and a list he can follow in the shop | Meal-type/time filters and result summary (RP-03, RP-05); grouped list (RP-20); check-off, already-have, own items (RP-22, RP-23, RP-24) |
| Helen Okafor (Secondary) | Hard-to-read pages; redoing similar weeks; fear of losing work; paper preference | A repeatable, readable plan and a printed list she controls | Filter recovery (RP-06); move/remove with confirmation (RP-15); copy week (RP-16); print (RP-26); account and deletion (RP-27, RP-28) |

---

## 5. 1-Pagers / Epics

**5.0 Conventions used by all 1-pagers**

**Breakdown.** Six initiatives follow the chain Recipes → Meal Plan → Grocery List plus persistence: **A** Recipe Discovery and Filtering; **B** Recipe Details, Servings and Saved Recipes; **C** Weekly Meal Planning; **D** Grocery-List Generation; **E** Grocery-List Use and Maintenance; **F** Accounts and Data Persistence. D (what the list contains) and E (how it is used and kept current) are separate because they have different problems and rules.

**Product-wide assumptions** (all **RHV**; 1-pagers cite them by ID)

| ID | Assumption | Why it is needed |
|---|---|---|
| G1 | The recipe collection is supplied with the product and is read-only for users; no specific external database is assumed | Decides whether recipe entry and moderation exist |
| G2 | A recipe has: title, meal type(s), total time, default servings, dietary tags, ingredient list, numbered steps | Filtering and list generation depend on structured data |
| G3 | An ingredient entry has a canonical name, an optional numeric quantity, a unit (g, kg, ml, l, tsp, tbsp, cup, count) and a category | Needed to combine ingredients and group the list |
| G4 | Dietary tags are labels supplied with recipe data (initial set: vegetarian, vegan, gluten-free, dairy-free, nut-free); they are not verified or medical | Prevents implying allergen safety |
| G5 | A meal plan is one calendar week (Monday–Sunday) with four meal types (breakfast, lunch, dinner, snack). A meal slot holds at most one recipe and its own servings; slots may be empty | Defines the planning model and what "meal" means |
| G6 | Searching and viewing recipes need no account; saved recipes, meal plans and grocery lists need one | Persistence requires an identity |
| G7 | A grocery list belongs to one meal plan and is derived from it | Keeps the Recipes → Plan → List chain unambiguous |

**Format.** Stories follow "As a [persona], I want to … so that I can …". **NFR labels:** *Core* = follows directly from the vision or a story rule, no invented number; *Proposed* = numeric target or standard suggested by Claude, **RHV**.

**Sizing protocol (one metric: story points).** Each story is rated 0 (low), 1 (medium) or 2 (high) on five drivers: **U** UI complexity, **R** rules and data processing, **E** validation and edge cases, **D** dependencies on other stories or components, **X** uncertainty from open assumptions. The sum **S** maps to points: S = 0 → 1; S = 1–2 → 2; S = 3–4 → 3; S = 5–6 → 5; S ≥ 7 → 8. Anchor: RP-01 (keyword search), S = 3, 3 points. A story that would be 13 must be split (none were). Sizes measure relative effort, not importance, and are initial estimates that may change after the open questions in Section 8 are answered.


# Recipe Discovery and Filtering 1-pager

## PROBLEM

Every Sunday Marcus wants a handful of weekday dinners that are nut-free (his daughter has a diagnosed allergy) and ready in under 45 minutes. Priya needs vegetarian, gluten-free recipes without mushrooms, and Tomás needs dinners under 30 minutes. Today each of them searches several recipe sites with different filters and checks every candidate by hand; combining restrictions is unreliable and a search that returns nothing gives no hint which filter to relax. This is the first cost of every weekly plan, and for Marcus a missed ingredient means starting again. They need to narrow one recipe collection by the criteria they actually decide on, predictably, and see enough in each result to choose without opening it.

## ASSUMPTIONS

- Relies on G1 (curated read-only collection), G2 (recipe record), G3 (canonical ingredient names), G4 (tags are labels).
- **A1** Several selected tags combine with AND, because users with restrictions expect every restriction to hold.
- **A2** Search matches recipe titles and ingredient names, case-insensitive; relevance ranking is not defined. This is the simplest testable search.
- **A3** Ingredient exclusion matches canonical names, not free text; its reliability depends on data quality.
- **A4** The time filter uses total time; a recipe without a time is excluded when a time filter is active.
- **A5** Time options (for example 15, 30, 45, 60 minutes) and the default sort order are proposals.

## FUNCTIONAL REQUIREMENTS

**RP-01** As **Marcus**, I want to search recipes by keyword so that I can find candidates for a meal without browsing the whole collection.
*Rules:* matches title and ingredient names (A2); blank search shows all recipes; leading and trailing spaces are ignored; special characters cause no error; no match shows the RP-06 empty state.

**RP-02** As **Priya**, I want to filter recipes by one or more dietary tags so that I only see recipes labelled as matching my diet.
*Rules:* all selected tags must be present (A1); combines with search and other filters; selected tags are visibly marked; a notice states that tags are labels, not medical or allergen guarantees (wording **RHV**).

**RP-03** As **Tomás**, I want to filter recipes by meal type and maximum total time so that I only see meals that fit the meal slot and the time I have.
*Rules:* meal types are multi-select and a recipe matches if it has any selected type; time chosen from predefined options (A5); missing time per A4.

**RP-04** As **Marcus**, I want to exclude recipes that contain named ingredients so that I do not have to open each recipe to check for ingredients my household avoids.
*Rules:* names are chosen from the known ingredient list with suggestions while typing; excluded names appear as removable items; unknown names are rejected with a message; exclusion is a convenience, not an allergen guarantee.

**RP-05** As **Tomás**, I want each result to show title, total time, default servings, dietary tags and ingredient count so that I can compare recipes without opening each one.
*Rules:* results can be sorted by name or time (default **RHV**); long result sets are paged or loaded in batches; each result opens the recipe (RP-07) and offers "add to meal plan" (RP-12).

**RP-06** As **Helen**, I want to see my active filters, remove them one at a time or all at once, and get a clear message when nothing matches so that I can recover from an over-narrow search without starting over.
*Rules:* active filters are listed with "Clear all"; the empty state says no recipe matches and suggests removing a filter; filters are kept when returning from a recipe.

## NON-FUNCTIONAL REQUIREMENTS

| ID | Category | Requirement | Label |
|---|---|---|---|
| NFR-A1 | Data integrity | Results never include a recipe that lacks a selected tag, exceeds the selected time, or contains an excluded ingredient, as recorded in the recipe data | Core |
| NFR-A2 | Accessibility | Search, filters and results are usable by keyboard alone with visible focus; text contrast meets WCAG 2.1 AA | Proposed |
| NFR-A3 | Usability | At 360 px viewport width all filters are usable without horizontal scrolling (Tomás is phone-first) | Proposed |

## REQUIREMENTS SIZING

Story points per Section 5.0. This 1-pager totals **20 points** across six stories: mostly UI and filter logic over one data set. RP-04 is largest because it needs an ingredient vocabulary and depends on data quality.

| Story ID | User Story | Size | Rationale |
| -------- | ---------- | ---: | --------- |
| RP-01 | Search by keyword | 3 | U1 R1 E1 D0 X0 (S=3). Anchor story: search box over two fields, few edge cases |
| RP-02 | Filter by dietary tags | 3 | U1 R1 E0 D1 X0 (S=3). Multi-select with AND rule; must combine with search |
| RP-03 | Filter by meal type and time | 3 | U1 R1 E1 D1 X0 (S=4). Two filters, missing-time rule, combines with others |
| RP-04 | Exclude ingredients | 5 | U2 R1 E1 D1 X1 (S=6). Autocomplete and removable items; relies on ingredient data quality |
| RP-05 | Result summary and sort | 3 | U1 R1 E1 D0 X0 (S=3). Display of existing fields, sorting, paging, placeholder |
| RP-06 | Active filters and empty state | 3 | U1 R0 E1 D1 X0 (S=3). State display across filters RP-02 to RP-04 |


# Recipe Details, Servings and Saved Recipes 1-pager

## PROBLEM

Marcus has found a chicken-and-rice recipe, but it is written for two servings and his household needs five. He rescales in his head and once under-bought the chicken. Before committing it to the week he also wants to read the whole ingredient list himself, because his daughter has a nut allergy. Priya and Helen keep returning to the same few recipes and re-search for them each week. The quantities chosen here flow into the meal plan and then the grocery list, so a scaling error becomes a shopping error. They need a complete, readable recipe whose quantities can be shown for the number of people actually eating, and a short list of recipes they reuse.

## ASSUMPTIONS

- Relies on G2, G3, G4 and G6 (saving needs an account).
- **B1** Quantities scale linearly: scaled = stored × chosen servings ÷ default servings.
- **B2** Ingredients with no quantity (for example "salt to taste") are not scaled.
- **B3** Servings are whole numbers from 1 to 12 (limit **RHV**).
- **B4** Scaled amounts are rounded for display (fractions such as ½ and ¼; whole items by rule); the rounding rules are **RHV**.
- **B5** Servings set on the recipe page are a preview. Adding the recipe to a meal slot (RP-12) copies the chosen servings into that slot; the slot then holds its own servings (G5).
- **B6** Total time does not change with servings (simplest rule).

## FUNCTIONAL REQUIREMENTS

**RP-07** As **Marcus**, I want to open a recipe and see its ingredients with quantities, numbered steps, default servings, total time, meal types and dietary tags so that I can decide whether to cook it and check the ingredients myself.
*Rules:* shows quantity, unit and name per ingredient; shows the tag notice from RP-02; offers "Add to meal plan" (RP-12) and "Save" (RP-09); a link to a recipe no longer in the collection shows a "no longer available" message.

**RP-08** As **Marcus**, I want to change the number of servings on a recipe and see all ingredient quantities recalculated so that I know what to buy and cook for my household.
*Rules:* whole numbers within B3, other values rejected with a message; quantities per B1 and B4; unscaled items (B2) unchanged and labelled; a reset returns to the default servings; the chosen number pre-fills the add-to-plan action (B5).

**RP-09** As **Priya**, I want to save and unsave a recipe so that I can find it again quickly when planning.
*Rules:* a single action toggles the state, visible in results and on the recipe page; a signed-out user is asked to sign in and returned to the same recipe (RP-27); unsaving does not remove the recipe from any meal plan.

**RP-10** As **Priya**, I want to view my saved recipes and search and filter them with the same controls so that I can plan from recipes I already trust.
*Rules:* reuses RP-01 to RP-04 within the saved set; empty state explains how to save a recipe; a saved recipe that has left the collection is shown as unavailable and can be removed.

## NON-FUNCTIONAL REQUIREMENTS

| ID | Category | Requirement | Label |
|---|---|---|---|
| NFR-B1 | Data integrity | A scaled quantity follows B1 and is identical wherever it appears (recipe page, meal plan, grocery list) | Core |
| NFR-B2 | Privacy | Saved recipes are visible only to their owner | Core |
| NFR-B3 | Usability | The recipe page stays readable at 200% browser zoom without loss of content or horizontal scrolling (Helen) | Proposed |
| NFR-B4 | Performance | Quantities update within 300 ms of a servings change for 95% of changes | Proposed |

## REQUIREMENTS SIZING

This 1-pager totals **12 points** across four stories. RP-08 dominates because scaling and rounding rules affect every later quantity and are not yet decided (B4). The others are display or toggle work that depends on existing components.

| Story ID | User Story | Size | Rationale |
| -------- | ---------- | ---: | --------- |
| RP-07 | View recipe details | 2 | U1 R0 E1 D0 X0 (S=2). Read-only display; one missing-recipe edge case |
| RP-08 | Change servings | 5 | U1 R2 E2 D0 X1 (S=6). Scaling, rounding, unscalable items, validation; rules still open |
| RP-09 | Save and unsave recipe | 2 | U0 R0 E1 D1 X0 (S=2). Toggle with persistence; sign-in redirect; depends on RP-27 |
| RP-10 | View and filter saved recipes | 3 | U1 R0 E1 D1 X0 (S=3). Reuses filter components on a smaller set; unavailable-recipe case |


# Weekly Meal Planning 1-pager

## PROBLEM

Marcus wants Monday to Friday dinners settled in one sitting. Priya wants the same lentil curry for three lunches. Helen wants next week to look much like this one. Today their plan lives in a notes app, spreadsheet or on paper, apart from the recipes, so each change means editing the plan and then remembering to fix the shopping list. With no view of the whole week, gaps and repeated dishes show up only on Wednesday evening. The meal plan is the source of the grocery list, so an unreliable plan means a wrong list or abandoned planning. They need to place recipes into specific days and meals with the right servings, see the week at once, and adjust it without redoing other work.

## ASSUMPTIONS

- Relies on G5 (week, four meal types, one recipe per slot, servings per slot), G6 (account needed) and G7.
- **C1** Meal plans can be created and edited for the current and future weeks; past weeks are view-only (**RHV**). The week starts on Monday (**RHV**).
- **C2** A meal slot's servings default to the number chosen on the recipe page (B5), otherwise the recipe default, and can be edited.
- **C3** An incomplete meal plan is valid: empty slots are not an error and add nothing to the grocery list. The same recipe may fill several slots, each with its own servings.
- **C4** A planned recipe that later leaves the collection is shown as unavailable and ignored by the grocery list, with a warning.

## FUNCTIONAL REQUIREMENTS

**RP-11** As **Marcus**, I want to view a weekly meal plan showing each day and meal type so that I can check the whole week at a glance.
*Rules:* seven days by four meal types; each filled slot shows recipe title, servings and tags; empty slots are visibly distinct and offer "add"; previous/next week navigation, current week by default; selecting a filled slot opens the recipe; a week with no plan shows an empty grid, not an error.

**RP-12** As **Marcus**, I want to add a recipe to a chosen day and meal type, with servings, from the search results or the recipe page so that I can build the plan while browsing.
*Rules:* choose week, day, meal type and servings (C2); an occupied slot asks whether to replace the existing recipe or cancel; adding to a past week is blocked with a message (C1); a signed-out user is asked to sign in and returned to this action; the recipe's ingredients, scaled to the slot's servings, enter the week's grocery list (RP-17, RP-25).

**RP-13** As **Priya**, I want to add one recipe to several meal slots in a single action so that I can plan batch-cooked meals without repeating the add step.
*Rules:* select several day and meal-type slots; servings set per slot or for all; occupied slots are listed and not overwritten without confirmation.

**RP-14** As **Marcus**, I want to change the servings of a planned meal so that the plan reflects how many people will eat that meal.
*Rules:* same range and validation as RP-08; the slot and the grocery list quantities update (RP-25).

**RP-15** As **Helen**, I want to move or remove a planned meal so that I can correct mistakes and adapt the plan when my week changes.
*Rules:* removing asks for confirmation; moving to an empty slot is direct; moving onto an occupied slot asks to swap, replace or cancel; a removed meal's ingredients leave the grocery list (RP-25).

**RP-16** As **Helen**, I want to copy a week's meal plan into another week so that I can reuse a routine without rebuilding it.
*Rules:* choose source and target week; if the target has meals, choose keep existing, replace or cancel; copied meals keep recipe and servings; unavailable recipes are skipped and listed.

## NON-FUNCTIONAL REQUIREMENTS

| ID | Category | Requirement | Label |
|---|---|---|---|
| NFR-C1 | Reliability | A confirmed meal-plan change persists after page refresh, sign-out and sign-in, or use on another device | Core |
| NFR-C2 | Accessibility | The plan can be operated by keyboard; every slot has a text label with day and meal type, not colour alone | Proposed |
| NFR-C3 | Usability | At 360 px width the plan is usable without horizontal scrolling | Proposed |

## REQUIREMENTS SIZING

This 1-pager totals **23 points** across six stories. RP-11 and RP-12 are largest (main planning screen, slot data model); RP-16 adds week-date logic and merge conflicts; RP-14 is small because it reuses RP-08 validation.

| Story ID | User Story | Size | Rationale |
| -------- | ---------- | ---: | --------- |
| RP-11 | View weekly meal plan | 5 | U2 R1 E1 D1 X0 (S=5). New main screen, week navigation, small-screen layout, persistence |
| RP-12 | Add recipe to a meal slot | 5 | U1 R1 E2 D1 X0 (S=5). Two entry points; occupied, past-week and unavailable cases |
| RP-13 | Add one recipe to several slots | 3 | U1 R1 E1 D1 X0 (S=4). Multi-select; per-slot servings; conflict handling |
| RP-14 | Change servings of a planned meal | 2 | U0 R1 E0 D1 X0 (S=2). Reuses RP-08 validation; passes change to list |
| RP-15 | Move or remove a planned meal | 3 | U1 R1 E1 D1 X0 (S=4). Confirmation; swap or replace on conflict |
| RP-16 | Copy a week's meal plan | 5 | U1 R1 E2 D1 X0 (S=5). Date mapping, merge or replace, skipped recipes |


# Grocery-List Generation 1-pager

## PROBLEM

After planning, Marcus has five recipes at four or five servings each, and Priya has a lentil curry planned three times. To shop, they open each recipe, copy its ingredients, add up "2 onions" and "1 onion" by hand, convert cups to millilitres and rescale for their servings. Items get missed or counted twice, and the mistake is found in the shop or halfway through cooking. This copying is the most repetitive step of the weekly routine and the one where planning effort pays off or is lost. They need a grocery list produced directly from the meal plan that they can trust: complete, correctly totalled, organised for shopping, and explainable.

## ASSUMPTIONS

- Relies on G3, G5 and G7.
- **D1** A grocery list is created by the user for one meal plan, from its filled meal slots. Afterwards it follows the plan automatically (RP-25). Whether sync should instead be manual is an open question (**RHV**).
- **D2** Each filled slot contributes its recipe's ingredients scaled to the slot's servings (B1); a recipe in three slots contributes three times.
- **D3** Ingredient lines are combined only when the canonical name matches and the units are the same kind (mass, volume or count).
- **D4** Conversion happens only within a kind, using fixed factors; supported units are g, kg, ml, l, tsp, tbsp, cup, count (metric and US cups; **RHV**). Conversion across kinds (cups of flour to grams) is a future consideration.
- **D5** Ingredients without a quantity ("salt to taste") and quantities that cannot be combined stay on separate lines.
- **D6** Each ingredient has a category; uncategorised items go under "Other" (category list **RHV**).

## FUNCTIONAL REQUIREMENTS

**RP-17** As **Marcus**, I want to generate a grocery list from a week's meal plan so that I do not have to copy ingredients from each recipe by hand.
*Rules:* includes every ingredient of every recipe in filled slots, scaled per D2; each line shows name, quantity and unit; an empty meal plan shows a message and creates no list; unavailable recipes (C4) are skipped with a warning naming them; if a list already exists for that week it is opened, not duplicated.

**RP-18** As **Priya**, I want identical ingredients from different recipes and slots combined into one line so that I see a single total for each thing I need to buy.
*Rules:* per D3; 2 onions + 1 onion = 3 onions; a recipe in three slots is counted three times at each slot's servings; the same ingredient in incompatible kinds (1 onion, 100 g onion) stays on separate lines, never forced into one number; no-quantity ingredients appear once.

**RP-19** As **Priya**, I want quantities of the same ingredient in compatible units, such as ml and cups, converted and added so that I do not have to convert measurements myself.
*Rules:* factors per D4; the total is shown in one unit chosen by a documented rule (for example 1200 g as 1.2 kg; **RHV**); unsupported units stay separate; rounding never understates the need (**RHV**).

**RP-20** As **Tomás**, I want the grocery list grouped by category so that I can shop section by section.
*Rules:* fixed, documented category order; items alphabetical within a category; empty categories hidden.

**RP-21** As **Marcus**, I want to see which recipes and meal slots an item comes from so that I can judge whether I really need to buy it.
*Rules:* an item can be expanded to show recipe names with day and meal; a user-added item shows "added by me" (RP-24).

## NON-FUNCTIONAL REQUIREMENTS

| ID | Category | Requirement | Label |
|---|---|---|---|
| NFR-D1 | Data integrity | Each quantity equals the sum of the scaled quantities of matching recipe ingredients after conversion; none omitted, none counted twice. Checked against test meal plans with hand-calculated totals | Core |
| NFR-D2 | Data integrity | Quantities of incompatible kinds are never merged into one number | Core |
| NFR-D3 | Reliability | If generation fails the user sees an error, the meal plan is unchanged, and no partial list is shown as complete | Core |

## REQUIREMENTS SIZING

This 1-pager totals **27 points** and carries the most effort and risk. RP-17 and RP-18 traverse the whole meal plan and rely on ingredient data quality (D3, G3). RP-19 is smaller (fixed conversion table). RP-20 and RP-21 are mostly display work that depends on category data and on keeping source links when combining.

| Story ID | User Story | Size | Rationale |
| -------- | ---------- | ---: | --------- |
| RP-17 | Generate grocery list from meal plan | 8 | U1 R2 E2 D2 X1 (S=8). Traverses plan, scales, handles empty and unavailable cases; foundation for RP-18 to RP-26 |
| RP-18 | Combine identical ingredients | 8 | U0 R2 E2 D1 X2 (S=7). Matching rules; mixed-kind and no-quantity cases; data-quality risk |
| RP-19 | Convert compatible units | 5 | U0 R2 E1 D1 X1 (S=5). Fixed factors, display-unit and rounding rules still open |
| RP-20 | Group by category | 3 | U1 R0 E1 D1 X1 (S=4). Grouped display; depends on category data |
| RP-21 | Show item sources | 3 | U1 R1 E0 D1 X0 (S=3). Expandable row; combining must keep links to sources |


# Grocery-List Use and Maintenance 1-pager

## PROBLEM

In the supermarket Tomás has his phone in one hand. He already has rice and olive oil, and he also needs washing-up liquid, which is in no recipe. On Wednesday Marcus swaps Thursday's dinner and wants the list to match, without losing the items he already ticked. Helen prints her list for her handbag. If the list cannot record what is in the trolley, cannot account for what is already at home, cannot take non-recipe items, falls out of step with the meal plan, or prints badly, users return to a hand-written list and the meal plan stops being relied on. They need a grocery list that works while shopping, stays correct when the plan changes, and can be taken on paper.

## ASSUMPTIONS

- Relies on D1 to D6 (generation rules) and G7.
- **E1** Each item has a state: to buy, obtained, or already have. State is stored per ingredient and unit.
- **E2** After generation the list is kept in step with the meal plan automatically; the user never needs to regenerate (**RHV**: alternative is a manual refresh).
- **E3** If an obtained item's required quantity later increases, it returns to "to buy" with a note; if it decreases, its state is kept. "Already have" is kept in both cases (**RHV**).
- **E4** An ingredient that leaves the meal plan disappears from the list and its state is discarded. Items the user added (RP-24) are never changed by plan changes.
- **E5** Quantities of generated items cannot be edited by the user; "already have" covers the need. This keeps the list consistent with the meal plan under E2.
- **E6** Use in the shop needs a connection; offline use is not required in this version (**RHV**). Printing uses the browser's print function.

## FUNCTIONAL REQUIREMENTS

**RP-22** As **Tomás**, I want to mark items as obtained and unmark them so that I can see what is left to buy while I shop.
*Rules:* one tap toggles; obtained items look different and are labelled in text, not colour alone, and move below items still to buy within their category; a count of remaining items is shown; state persists across refresh and devices.

**RP-23** As **Tomás**, I want to mark an item as "already have" so that the list shows only what I still need to buy.
*Rules:* the item moves to a collapsible "Already have" section and is not counted as remaining; it can be moved back; the state is kept when quantities change (E3).

**RP-24** As **Tomás**, I want to add my own items to the grocery list so that one list covers everything I buy.
*Rules:* name required (blank rejected); quantity, unit and category optional (default category "Other"); can be edited and deleted; unaffected by plan changes (E4); a name matching a generated item is allowed.

**RP-25** As **Marcus**, I want the grocery list to update when I add, replace, move, remove or re-serve a planned meal so that a mid-week change does not make me rebuild the list.
*Rules:* totals and items follow the meal plan after any change (RP-12 to RP-16); item states follow E1 and E3; user-added items are untouched; if the meal plan becomes empty, generated items are removed, user-added items remain, and a message explains why.

**RP-26** As **Helen**, I want to print the grocery list so that I can take it shopping without a screen.
*Rules:* print layout shows item, quantity, unit and a tick box, grouped by category; navigation and controls are hidden; the user chooses whether obtained and "already have" items are included; text is legible at normal print size.

## NON-FUNCTIONAL REQUIREMENTS

| ID | Category | Requirement | Label |
|---|---|---|---|
| NFR-E1 | Data integrity | Automatic updates never delete or alter a user-added item and never change item states except as E3 specifies | Core |
| NFR-E2 | Reliability | Item states and user-added items persist across refresh and across devices on the same account | Core |
| NFR-E3 | Usability | Tick and "already have" controls are at least 44 × 44 CSS pixels on touch screens | Proposed |
| NFR-E4 | Accessibility | Item state is available to screen readers as text, not colour alone | Proposed |

## REQUIREMENTS SIZING

This 1-pager totals **19 points**. RP-25 is tied for the largest story in the product: it combines the plan-change hooks from C, the generation rules from D and the still-open state rules E1 and E3. RP-22 is a single stored toggle; RP-23, RP-24 and RP-26 are moderate UI or output work.

| Story ID | User Story | Size | Rationale |
| -------- | ---------- | ---: | --------- |
| RP-22 | Mark items obtained | 2 | U1 R0 E0 D1 X0 (S=2). Stored toggle with count and ordering |
| RP-23 | Mark item "already have" | 3 | U1 R1 E1 D1 X0 (S=4). Collapsible section, state per ingredient, kept on quantity change |
| RP-24 | Add own items | 3 | U1 R1 E1 D0 X0 (S=3). Form with validation; mixed with generated items |
| RP-25 | List follows plan changes | 8 | U0 R2 E2 D2 X2 (S=8). Recalculation with state preservation; hooks from RP-12 to RP-16; E1 and E3 open |
| RP-26 | Print grocery list | 3 | U1 R0 E1 D0 X1 (S=3). Print layout; cross-browser differences |


# Accounts and Data Persistence 1-pager

## PROBLEM

Helen opens her meal plan on her laptop on Sunday and prints the list. Marcus builds his plan on a laptop and checks the grocery list on his phone in the supermarket. Priya wants her saved recipes to be there next week. If these live only in one browser session they disappear when a tab closes or the device changes, and weekly reuse, which the product depends on, fails. At the same time Helen is cautious about creating accounts and about what is stored about her. They need their recipes, plans and lists to persist across sessions and devices with as little personal data as possible, and a way to remove it all.

## ASSUMPTIONS

- Relies on G6 (recipes can be browsed without an account; saved recipes, meal plans and grocery lists need one).
- **F1** Users register with an email address and password. Sommerville's example suggests asking whether a requested login method hides a general need (not having yet another credential); whether to allow third-party sign-in is open (**RHV**).
- **F2** Stored personal data is limited to email, hashed credentials, saved recipes, meal plans and grocery lists; no health data is collected.
- **F3** Password reset by email is part of RP-27.
- **F4** Deleting an account permanently deletes all of its data.
- **F5** Work started while signed out is not stored; the user is asked to sign in at the action that needs an account and then continues it (**RHV**).

## FUNCTIONAL REQUIREMENTS

**RP-27** As **Helen**, I want to create an account and sign in and out so that my saved recipes, meal plans and grocery lists are there when I return or use another device.
*Rules:* registration needs an email and a password (format and password rules **RHV**); a duplicate email is rejected; sign-in errors do not reveal whether an email is registered; password reset by email (F3); sign-out is available on every page; after sign-in the user returns to the action that required it (F5).

**RP-28** As **Helen**, I want to delete my account and all my data so that I stay in control of my personal information.
*Rules:* a confirmation states what will be deleted (account, saved recipes, meal plans, grocery lists); afterwards the user is signed out and the old credentials no longer work; the recipe collection is unaffected.

## NON-FUNCTIONAL REQUIREMENTS

| ID | Category | Requirement | Label |
|---|---|---|---|
| NFR-F1 | Security | Passwords are stored only as salted hashes made with a recognised password-hashing algorithm, never in plain text or in logs | Core |
| NFR-F2 | Security | All communication between browser and server uses HTTPS | Core |
| NFR-F3 | Privacy | Only the data listed in F2 is collected, none is shared with third parties, and saved recipes, meal plans and grocery lists are visible only to their owner | Core |
| NFR-F4 | Reliability / availability | No numeric recovery or availability target is set for this course-project version | **RHV** |

## REQUIREMENTS SIZING

This 1-pager totals **8 points** across two stories. RP-27 is moderate because it is standard but security-sensitive; its main uncertainty is whether third-party sign-in is added. RP-28 is small in logic but touches every data type, so it depends on all other stories.

| Story ID | User Story | Size | Rationale |
| -------- | ---------- | ---: | --------- |
| RP-27 | Create account, sign in and out | 5 | U1 R1 E2 D0 X1 (S=5). Validation, reset flow, session handling, return to action; sign-in method open |
| RP-28 | Delete account and data | 3 | U0 R1 E1 D2 X0 (S=4). Cascade deletion across all stored data, confirmation, sign-out |


**Sizing summary:** A 20 · B 12 · C 23 · D 27 · E 19 · F 8 = **109 story points** across **28 stories** (RP-01 to RP-28). These are relative estimates and not a schedule.

---

## 6. Overall Requirement Traceability Matrix

| Product Vision Need | Persona | Problem / Scenario | 1-Pager | Functional Requirement IDs | Points |
| --- | --- | --- | --- | --- | ---: |
| Find recipes by dietary tag, meal type, time and ingredients to avoid | Marcus, Priya, Tomás | Screening by hand across sites with inconsistent filters | A. Recipe Discovery and Filtering | RP-01, RP-02, RP-03, RP-04, RP-05 | 17 |
| Recover from an over-narrow search | Helen | Dead-end results with no way back | A | RP-06 | 3 |
| Understand a recipe and scale it to the household | Marcus | Rescaling by hand; needs to read all ingredients | B. Recipe Details, Servings and Saved Recipes | RP-07, RP-08 | 7 |
| Reuse recipes already trusted | Priya, Helen | Re-searching the same recipes each week | B | RP-09, RP-10 | 5 |
| Build the weekly meal plan from recipes | Marcus, Tomás | Plan kept apart from recipes; hard to build in one sitting | C. Weekly Meal Planning | RP-11, RP-12, RP-14 | 12 |
| Plan repeated and batch meals | Priya, Helen | Re-entering the same meal or routine | C | RP-13, RP-16 | 8 |
| Correct and adapt the plan | Helen | Mistakes, changing weeks, fear of irreversible actions | C | RP-15 | 3 |
| Produce a grocery list from the meal plan | Marcus | Copying ingredients by hand | D. Grocery-List Generation | RP-17 | 8 |
| Get correct combined quantities | Priya | Adding items and converting units by hand | D | RP-18, RP-19 | 13 |
| Make the list usable and explainable | Tomás, Marcus | Disorganised list; cannot tell where an item comes from | D | RP-20, RP-21 | 6 |
| Use the list while shopping | Tomás | Cannot track progress, skip items at home or add extras | E. Grocery-List Use and Maintenance | RP-22, RP-23, RP-24 | 8 |
| Keep the list consistent with the meal plan | Marcus | Plan changes mid-week, list goes stale | E | RP-25 | 8 |
| Take the list on paper | Helen | Prefers a printed list | E | RP-26 | 3 |
| Keep recipes, plans and lists across sessions and devices | Helen, Marcus, Priya | Work lost between sessions and devices | F. Accounts and Data Persistence | RP-27 | 5 |
| Control personal data | Helen | Wary of accounts and stored data | F | RP-28 | 3 |

**Checks.** Orphan stories: none (all 28 appear). Persona coverage by story: Marcus RP-01, 04, 07, 08, 11, 12, 14, 17, 21, 25; Priya RP-02, 09, 10, 13, 18, 19; Tomás RP-03, 05, 20, 22, 23, 24; Helen RP-06, 15, 16, 26, 27, 28. Points sum to 109.
**Gaps recorded, not filled (scope control):** recipe authoring and moderation (G1); allergen-safety guarantees (excluded); offline use (E6); conversion across unit kinds (D4); pantry tracking beyond a single list (see RP-23); sharing a grocery list with other household members (not requested by any persona, a possible later extension).

---

## 7. Project Manager Quality Audit

### 7.1 Major corrections

| # | Problem found in Stage 1 | Correction in this version |
|---|---|---|
| 1 | 1-pagers too long and sizing held in a separate table | Each 1-pager is compressed and ends with its own sizing section (description, table, rationale). Rendered in the attached Word file (Calibri 10 pt, tables 8.5 pt, 0.7 in margins) each is between 1.3 and 1.45 pages; other layouts may differ slightly |
| 2 | List behavior contradicted itself: "flag out of date, then refresh" (old RP-27) while preserving ticks and removals | One model: the list follows the meal plan automatically (D1, E2, RP-25), with explicit state rules E1, E3, E4 |
| 3 | Quantity editing and item removal (old RP-26) could diverge from the meal plan | Replaced by "already have" (RP-23); generated quantities are not user-editable (E5) |
| 4 | Overlapping stories: overview vs. view (old RP-17/RP-11); replace vs. add (old RP-14/RP-12); remove vs. move | Merged: overview into RP-11; replace into RP-12; 30 stories became 28 |
| 5 | Assumptions scattered, repeated and in one case inconsistent (accounts and saving) | Product-wide G1–G7 plus assumptions local to each 1-pager; F5 and RP-12/RP-27 now define the sign-in-then-continue behavior |
| 6 | Problem sections partly read as feature descriptions | Each rewritten as a user situation with persona, objective, current approach and consequence |
| 7 | NFR numbers mixed with firmer statements | Every NFR is labelled Core or Proposed; no number is presented as established |
| 8 | Sizing had no stated protocol and an unused 13 | Five-driver protocol with an anchor and an S-to-points mapping; every rationale shows its ratings |
| 9 | Inconsistent terms (favourites/saved, plan/meal plan, list/grocery list) | One vocabulary defined at the top and used throughout |
| 10 | Tag safety and allergy handling implicit | Tags are labels (G4); notice in RP-02 and RP-07; exclusion stated as convenience (RP-04) |
| 11 | Persona labels and overlap unexplained | Review table in Section 3; Tomás and Helen reclassified Secondary |
| 12 | Initial plan did not say what happens with an incomplete or empty plan | C3, RP-17 and RP-25 specify empty slots, empty plans and removed recipes |

### 7.2 Audit by area

| Area | Result | Notes and remaining limits |
|---|---|---|
| Product vision | Pass | Concise, user-centred, scoped; plan-drives-list rule explicit. The "UNLIKE" claim is unverified (**RHV**) |
| Personas | Pass with limits | Four distinct proto-personas, each on at least four stories. Not validated with real users (**RHV**) |
| Scenarios | Pass with limits | One problem scenario per 1-pager and one representative scenario per persona; each persona appears in two to five 1-pagers. Chapter 3 suggests several scenarios per persona, which the 1-pager format limits |
| Assumptions | Pass | Explicit, justified, labelled **RHV**; checked for contradictions |
| Functional requirements | Pass | Persona, action and value in every story; supporting rules are behavior, not implementation |
| Non-functional requirements | Pass | Relevant per 1-pager; Proposed numbers flagged for validation |
| Sizing | Pass | One metric, every story sized, protocol shown, similar stories similar sizes. Estimates not calibrated by a team |
| Traceability | Pass | Vision → persona → problem → story → points; no orphans |
| Scope | Pass | Only accounts sit outside the three core activities, justified by persistence |
| Invented content | Pass | No research, statistics, quotations or other-model output claimed |

---

## 8. Open Questions / Human Validation

### High Priority
1. **Recipe data source (G1, G3).** Existing dataset or manual entry? It sets the ingredient structure, tag accuracy, collection size and whether an administrator role exists.
2. **Accounts versus local storage (G6, F1).** Affects RP-09, RP-10, RP-27, RP-28 and the privacy NFRs.
3. **Grocery list model (D1, E2, E3).** Automatic sync as written, or manual refresh? How are obtained and "already have" states handled when quantities change?
4. **Ingredient identity and units (G3, D3, D4).** Canonical names, unit system (metric, US, both) and conversion rules decide whether RP-18 and RP-19 are reliable.
5. **Dietary tag set and notice wording (G4, RP-02).** Which tags, and how the portal states that they are labels, given needs like Marcus's allergy.

### Medium Priority
6. Servings range, rounding and fraction display (B3, B4).
7. Plan structure: week start, whether snacks are needed, past weeks read-only (G5, C1).
8. Grocery categories and their order (D6, RP-20).
9. Phone use in the shop and offline need (E6).
10. Persona validation with 3–5 real people per group.

### Low Priority
11. Confirm or replace the Proposed numeric targets and the accessibility level (all Proposed NFRs).
12. Result sort order and time-filter options (A5).
13. Browser support list.
14. Third-party sign-in (F1).

---

## 9. Comparison Pending

The refined Claude version is ready to be compared with the independently generated output from the second AI model. No comparison has been made, because that output has not been provided.

---

## 10. Student Evaluation of Claude's Output

*(Leave blank — to be completed by the student.)*

**What did Claude do well?**


**What did Claude misunderstand?**


**Which personas were most useful?**


**Which requirements need modification?**


**Were the scenarios appropriate?**


**Were the assumptions reasonable?**


**Was the sizing methodology appropriate?**


**What would I change before submission?**


**What did I learn from using Claude?**


**Overall evaluation:**

