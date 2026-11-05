# Recipe & Meal Planning Portal — Claude Initial Product Definition

**Course:** CS3365 Engineering Systems / Software Products
**Product:** Recipe & Meal Planning Portal (Product 2)
**Version:** Claude — Initial (v1). This is a first draft intended for later critical review and polish.
**Reference framework:** Sommerville, *Engineering Software Products* (2019), Chapter 3 (personas, scenarios, user stories, feature identification). No quotations or page numbers are used; ideas from the chapter are paraphrased, and everything else is labelled as general requirements-engineering practice or as an assumption.

**Conventions used in this document**

- **Requires Human Validation** marks anything that is a proposed decision, assumed fact, or proposed numeric target rather than an established requirement.
- All personas are **proto-personas**: they are based on the development team's understanding, not on interviews or surveys. No user research was performed and none is claimed.
- Story IDs (RP-xx) are unique across the whole document. Non-functional requirements use IDs of the form NFR-x.n, where x is the 1-pager letter.

---

## 1. Product Vision

### Initial Vision

> The Recipe & Meal Planning Portal is an innovative web platform that helps people eat better and save time. Users can search thousands of recipes, filter them by dietary needs, plan their meals for the week, and automatically get a complete grocery list. It makes meal planning easy for everyone and helps users stay healthy, reduce food waste, and save money.

### Vision Critique

The initial vision was reviewed as if by an independent Product Manager. Findings:

| # | Weakness | Why it is a problem |
|---|----------|--------------------|
| 1 | "Innovative platform", "easy for everyone" | Marketing language with no testable meaning. "Everyone" is not a target user. |
| 2 | "Eat better", "stay healthy" | Implies a nutrition/health outcome. The product has no basis to guarantee this and the scope rules exclude health advice. |
| 3 | "Reduce food waste, save money" | Unsupported claims. They may be side effects for some users but nothing in the product scope directly delivers them. |
| 4 | "Thousands of recipes" | Invents a content size. The recipe source is undecided (**Requires Human Validation**). |
| 5 | "Dietary needs" | Ambiguous. It could be read as medical dietary needs. The product only supports *filtering by tags*, not verifying suitability. |
| 6 | Recipes, plan and list are listed side by side | The vision does not say how they connect. The chain Recipes → Plan → List is the core of the product and is not stated. |
| 7 | No explicit non-goals | Nothing prevents scope creep into nutrition, delivery or social features. |
| 8 | No user interaction described | A development team cannot tell how a user moves through the product. |

### Refined Product Vision

**Product.** The Recipe & Meal Planning Portal is a web application in which a user finds recipes, places chosen recipes into a weekly meal plan, and generates a grocery list from that plan. The recipe search, the weekly plan and the grocery list share one data model, so the plan is built from recipes and the list is calculated from the plan.

**Intended users.** People who cook at home and plan their own meals or those of a small household: individuals, couples, families and shared households. They differ in dietary preferences and restrictions, cooking time, household size and confidence with technology.

**Problem.** Planning a week of meals currently involves several disconnected steps: finding recipes that fit dietary preferences and time limits, deciding where each meal goes in the week, and then copying ingredients out of each recipe into a shopping list by hand, merging duplicates and adjusting quantities for different servings. This is repetitive and error-prone, and mistakes surface only at the shop (a missing ingredient) or at the stove.

**Why it matters.** Meal planning is a recurring weekly task. Time lost in copying and reconciling ingredients, and errors in doing so, are repeated every week. People with dietary restrictions have the additional burden of repeatedly discarding unsuitable recipes.

**Value.**
1. Users can narrow recipes by dietary tag, meal type, time and excluded ingredients, instead of scanning unfiltered lists.
2. Users can see a week's meals in one place and change them easily.
3. Users get a consolidated grocery list generated from the plan, scaled to the servings they chose, with duplicate ingredients combined where quantities can safely be combined.
4. The list stays consistent with the plan when the plan changes.

**High-level interaction.** The user (1) searches and filters recipes, (2) opens a recipe to review its ingredients and servings, (3) assigns it to a day and meal slot in the weekly plan, (4) repeats until the plan is complete, (5) generates a grocery list, (6) uses the list while shopping by checking items off, and (7) returns later to adjust the plan and refresh the list.

**Core scope (in).** Recipe search and filtering; recipe detail viewing; saving favourite recipes; weekly meal planning; grocery-list generation, grouping, and use; minimal account support so plans persist (**Requires Human Validation**).

**Explicitly out of scope.** Calorie or nutrient tracking; medical or therapeutic dietary advice or verification that a recipe is safe for a medical condition; personalised nutrition plans; social feeds or sharing; user-generated recipe publishing; grocery delivery, ordering or payment; restaurant features; fitness features; AI-generated recipes or coaching.

**Important limitation.** Dietary tags are labels attached to recipes in the recipe data. The portal displays and filters on them; it does not certify them. Users with allergies or medical conditions remain responsible for checking ingredients (**Requires Human Validation** for exact disclaimer wording).

*Chapter 3 alignment:* the vision is written from the users' situation, avoids listing features as vision statements, and separates a small set of coherent capabilities (search/filter, plan, list) so that features can be derived from scenarios and stories rather than added opportunistically. The out-of-scope list is a deliberate guard against feature creep.

---

## 2. AI Interaction / Product Vision Development Log

This log describes stages of one AI-assisted drafting process within a single response. They are not separate real-world conversations.

### Iteration 1 — Initial Product Vision

**Information provided:** the assignment's one-line product idea; the three core activities (discover, plan, generate list); a scope-control list excluding nutrition, health, social, delivery, payment and fitness features; instructions to avoid invented research and statistics; Sommerville Chapter 3 as the conceptual reference.
**Focus of the draft:** a short, benefit-oriented statement of what the product does.

### Initial Critique

The draft leaned on promotional wording, implied health outcomes and food-waste/cost savings that the scope does not support, invented a recipe-count, left "dietary needs" ambiguous, and did not describe how recipes, plans and lists connect or what is out of scope (see the critique table in Section 1).

### Iteration 2 — Refined Product Vision

The refined vision (Section 1) replaces claims with a problem statement, names the user group in terms of behaviour, states the Recipes → Plan → List chain explicitly, frames dietary tags as filter labels rather than health guidance, adds an interaction outline, and adds explicit in-scope and out-of-scope lists.

| Iteration | Purpose | Main Changes | Reason |
| --------- | ------- | ------------ | ------ |
| 1 — Initial Product Vision | Produce a first statement of the product from the assignment description | Short benefit-focused paragraph; mentions search, dietary filters, weekly plan, grocery list | Provides a baseline to critique |
| Initial Critique | Act as own PM reviewer | Identified 8 weaknesses: marketing language, implied health claims, unsupported savings claims, invented content size, ambiguous "dietary needs", unclear connection between the three activities, no non-goals, no interaction description | Vision must be testable, scoped and free of unsupported claims |
| 2 — Refined Product Vision | Produce a vision usable as the base for personas and requirements | Added problem/why-it-matters, value list, high-level interaction, in/out of scope, tag limitation, explicit chain Recipes → Plan → List | Gives requirements work a stable, scoped foundation |
| Persona review (Section 3) | Check that personas cover the refined vision | Started with five candidate personas, merged one, kept four | Sommerville advises few personas with non-overlapping needs |
| Story review (Section 5) | Check stories for coverage, redundancy, testability | Merged overlapping filter stories, added stories for list refresh after plan change and for account deletion, removed a proposed "grocery price estimate" idea | Coverage gaps and scope creep |

---

## 3. Personas

**Method note.** Following Chapter 3, personas are imagined but realistic user types, each covering personal context, relevance to the product and technical confidence. The assignment template also requires "Goals"; Sommerville cautions that "goals" are vague and prefers explaining why the software is useful and what the user might do with it. To satisfy both, each Goals entry below is written as concrete things the person wants to accomplish, and Motivations explains why. All details are assumptions (**Requires Human Validation** against real users, e.g. informal conversations with classmates, family or friends).

**Initial candidate set (before review):** Marcus (busy parent), Priya (dietary-restricted professional), Tomás (budget student), Helen (low-confidence, print-oriented user), and a fifth, "Jamal, weekend meal-prepper". Jamal was merged into Priya during the review (see Section 3.6).

### 3.1 Marcus Reyes

**Persona Type:** Primary user

**Background:** Marcus, 38, is a project coordinator who lives with his partner and two children (ages 7 and 10). He is comfortable with smartphones and web apps but has little patience for setup. One child has a nut allergy diagnosed by a doctor; the family treats "nut-free" as a hard requirement for every meal. The family shops once a week at one supermarket.

**Goals:** Decide dinners for Monday–Friday in one sitting; choose meals the whole family will eat; end up with one shopping list for the whole week that is right for four people.

**Motivations:** Weekday evenings are tight. If he has not decided what to cook by 5 pm, the family defaults to takeaway. A forgotten ingredient means an extra trip.

**Behaviors:** Collects recipe ideas in bookmarks, screenshots and family group chats. Plans loosely on Sunday, types a shopping list into a notes app, and often forgets that two recipes both need onions. He scales quantities in his head for four servings.

**Pain Points:** Filtering out nut-containing recipes manually; recipes written for 2 or 6 servings; duplicate ingredients across recipes; a list that goes out of date when Wednesday's dinner changes.

**Needs:** Reliable dietary filtering by tag; servings that scale; a single weekly plan view; a consolidated list scaled to servings; ability to edit the plan and refresh the list.

**Usage Context:** Sunday evening at home on a laptop for planning; in the supermarket on a phone for the list; occasionally midweek on the phone to swap a meal.

**Product Expectations:** To see only recipes tagged as nut-free when he asks for them, to be able to place a recipe into a day in a few steps, and to trust the list quantities. (He will still read labels himself; the portal is not a safety guarantee.)

**Representative Scenario:** On Sunday Marcus filters for *dinner*, *nut-free* and *under 45 minutes*. He opens a chicken-and-rice recipe, changes servings from 4 to 5 because his brother is visiting, and adds it to Tuesday dinner. He fills Monday–Friday the same way, then generates a grocery list. Onions from three recipes appear as one line item. On Wednesday a child is sick and he swaps Thursday's recipe for a simpler one; the list updates and the items he had already checked off remain checked.

### 3.2 Priya Nair

**Persona Type:** Primary user

**Background:** Priya, 27, is a software tester who lives alone. She is vegetarian and also avoids gluten by choice after finding that it disagrees with her (not a medically diagnosed condition, so she treats tags as preferences). She is highly comfortable with technology and cooks on Sunday to prepare lunches for the week.

**Goals:** Find vegetarian, gluten-free recipes without wading through unsuitable results; plan a small number of recipes and assign the same recipe to several days; generate a compact list without buying more than needed.

**Motivations:** She wants variety without spending Sunday searching. Recipes that turn out not to fit her diet waste her time.

**Behaviors:** Searches on general recipe websites, then applies each site's own filters, which vary widely. She copies ingredients into a spreadsheet and manually adds up quantities. She cooks one large batch and eats it for several days.

**Pain Points:** Inconsistent filters across sites; combining multiple dietary tags; recipes with a hidden unwanted ingredient; manually summing "1 cup" and "250 ml" of the same item.

**Needs:** Combining several dietary tags with clear behavior; excluding ingredients; assigning one recipe to multiple slots; correct summing of ingredients across units.

**Usage Context:** Saturday or Sunday on a laptop; sometimes on her phone during the week.

**Product Expectations:** Predictable filters (all selected tags must match), an exclude-ingredient option, and a list that correctly merges the same ingredient across recipes.

**Representative Scenario:** Priya selects the tags *vegetarian* and *gluten-free* and excludes *mushrooms*. She saves three recipes as favourites. She assigns a lentil curry to Monday, Tuesday and Wednesday lunch with 1 serving each. The generated list shows lentils as one line with the total for three servings, and a note that "coconut milk" appears in two recipes with different units (ml and cups), which the portal converts and combines.

### 3.3 Tomás Herrera

**Persona Type:** Primary user

**Background:** Tomás, 21, is a university student sharing a flat with two others. He cooks 4–5 dinners a week and has a small grocery budget and a small kitchen. He is very comfortable with technology but is not a confident cook, so recipes with many steps or specialty ingredients put him off. He has no dietary restrictions.

**Goals:** Find quick, simple recipes; keep the number of ingredients low; reuse ingredients across the week; get a list he can quickly follow in the shop.

**Motivations:** Money and time are limited; buying a full bunch of an ingredient for a single recipe feels wasteful.

**Behaviors:** Uses video sites and social posts for ideas, writes a rough list in his phone, and often buys the same items again because he forgot what he already had.

**Pain Points:** Long ingredient lists; not knowing total time; buying items that were already at home; a shopping list that is disorganised so he walks the shop repeatedly.

**Needs:** Time filtering; visible ingredient count/preparation time in the results; ability to remove items from the list that he already has; list grouped by section of the shop.

**Usage Context:** On his phone, on the bus or between classes, planning; in the shop with the list.

**Product Expectations:** Fast, mobile-friendly browsing; a list where he can delete or check items easily.

**Representative Scenario:** Tomás filters *dinner* under 30 minutes, adds four recipes, and generates the list. It is grouped by category (produce, dairy, pantry, and so on). He already has rice and olive oil, so he removes those two lines. At the shop he checks off items on his phone as he goes. He also adds "washing-up liquid" as a manual item.

### 3.4 Helen Okafor

**Persona Type:** Secondary user

**Background:** Helen, 66, is a retired librarian who cooks for herself and her husband. She has a laptop and a smartphone and uses them for email and video calls, but she is cautious about creating accounts and gets frustrated with small text and cluttered screens. She prefers printed lists to take shopping. She has mild arthritis, which makes fine tapping difficult. Her husband avoids dairy by preference.

**Goals:** Plan a few dinners a week; carry a printed list; see recipe instructions in readable text.

**Motivations:** She likes routine. She plans similar weeks repeatedly and dislikes re-entering the same choices.

**Behaviors:** Uses recipe cards and cookbooks; writes lists by hand; occasionally searches the web for a dairy-free recipe.

**Pain Points:** Small fonts and low-contrast pages; unclear buttons; losing work when a page refreshes; not being able to print cleanly.

**Needs:** Readable layout and clear controls; ability to copy last week's plan; a print-friendly list; simple, forgiving flows with confirmation before deleting.

**Usage Context:** At the kitchen table on a laptop or tablet; prints the list.

**Product Expectations:** Clear labels, large tap targets, and no surprise loss of her plan.

**Representative Scenario:** Helen signs in, opens last week's plan, and copies it to next week. She replaces two dinners with dairy-free recipes she finds by filtering. She generates the list, prints it, and keeps the printout in her handbag.

### 3.5 Persona Quality Review

| Check | Finding | Action |
|-------|---------|--------|
| Genuinely different? | Yes. They differ in household size (4, 1, ~3 sharing, 2), dietary role (hard requirement, personal preference, none, partner preference), device (laptop, laptop, phone, tablet + print), and technology confidence. | None |
| Realistic? | Yes, but all are assumptions (proto-personas). | Labelled **Requires Human Validation** |
| Useful for elicitation? | Each generates distinct requirements: Marcus → scaling, hard-exclusion filtering, plan edits; Priya → multi-tag logic, unit merging, multi-slot assignment; Tomás → time filter, list grouping, mobile, item removal; Helen → accessibility, print, plan copy, forgiving deletes. | None |
| Sufficiently detailed? | Adequate for a first draft, with short, readable descriptions as Chapter 3 recommends. | None |
| Redundant? | The initial fifth persona, Jamal (weekend meal-prepper), overlapped almost entirely with Priya (batch cooking, multi-slot assignment). | Merged into Priya |
| Missing users? | A **content administrator** who maintains recipe data is not represented. Recipe data source is unresolved. | Noted as a gap; treated as out of scope for this document and listed in Open Questions |
| Coverage of vision? | Cover discovery, planning and list generation, and range of households. | None |

**Number of personas:** four (within the Chapter 3 guidance of not needing more than about five).

---

## 4. Persona-to-Requirement Traceability

| Persona | Main Problem | Main Goal | Relevant Product Capabilities |
| ------- | ------------ | --------- | ----------------------------- |
| Marcus Reyes (Primary) | Filtering unsuitable recipes by hand; scaling for family size; list going stale when plan changes | A correct one-week family plan and one shopping list | Dietary tag filter, meal type filter, servings scaling, weekly plan editing, list generation and refresh |
| Priya Nair (Primary) | Inconsistent dietary filters; manually summing ingredients across recipes and units | Compliant recipes, batch planning, accurate combined list | Multi-tag filtering, ingredient exclusion, multi-slot assignment, ingredient aggregation and unit conversion |
| Tomás Herrera (Primary) | Complicated recipes, wasted purchases, disorganised list, phone-based use | Quick, simple plan and a shop-friendly list | Time filter, results summary, list grouping, item removal, manual items, check-off, mobile use |
| Helen Okafor (Secondary) | Hard-to-read pages, re-doing repeated weeks, need for paper list | Repeatable, readable planning and printed list | Copy previous week, print-friendly list, accessible layout, confirmation before delete, account/data persistence |

---

## 5. 1-Pagers / Epics

**Breakdown rationale.** Six initiatives follow the Recipes → Plan → List chain plus the supporting data needs:

- **A** Recipe Discovery and Filtering
- **B** Recipe Details, Servings and Saved Recipes
- **C** Weekly Meal Planning
- **D** Grocery-List Generation
- **E** Grocery-List Use and Maintenance
- **F** Accounts and Data Persistence

Grocery-list generation (D) is separated from list use (E) because generation depends on data rules (aggregation, units), whereas use concerns interaction (checking, editing, printing). Account handling (F) is kept small and depends on an unresolved decision.

**Cross-1-pager notes**

- **Personas referenced:** Marcus (M), Priya (P), Tomás (T), Helen (H).
- **Story format:** As a [persona], I want to [task] so that I can/in order to [value].
- **Sizing:** story points, defined in Section 5.7.
- **Chapter 3 feature checks applied:** each story should be independent, coherent (one thing) and relevant to a persona. Stories that failed these checks in review were merged or dropped (see Section 5.8).

---

# Recipe Discovery and Filtering 1-pager

## PROBLEM

Marcus needs nut-free dinners, Priya needs vegetarian gluten-free dishes, and Tomás needs meals that take under half an hour. Today each of them opens several sources and applies whatever inconsistent filters each site offers, or scans unfiltered lists and discards unsuitable recipes by hand. When Marcus misses a nut-containing ingredient, the recipe has to be found again and discarded, and for a household with an allergy this is a stressful, repetitive check.

The portal must let users narrow a recipe collection using the characteristics they actually decide on (dietary tag, meal type, time, ingredients to avoid) in a predictable way, and show enough in each result to decide whether to open it. The problem matters because discovery is the first step of every weekly plan; poor filtering wastes the time the portal is meant to save, and unpredictable filtering erodes trust.

## ASSUMPTIONS

| # | Assumption | Why it is needed |
|---|------------|------------------|
| A1 | Recipes come from a fixed, curated collection loaded by the product team; users cannot add recipes in this version. **Requires Human Validation** | Determines whether import, moderation and editing features exist. |
| A2 | Each recipe has: title, description, meal type(s), total time, default servings, dietary tags, a structured ingredient list, and steps. | Filtering and list generation both depend on structured data. |
| A3 | Initial dietary tag set: vegetarian, vegan, gluten-free, dairy-free, nut-free. Others may be added. **Requires Human Validation** | Filters need a defined vocabulary. |
| A4 | Tags are supplied with the recipe data and are labels, not verified safety statements. | Prevents the portal from implying medical assurance. |
| A5 | Selecting multiple tags means the recipe must have **all** selected tags (AND). | Users with restrictions expect every restriction to be met. |
| A6 | Meal types: breakfast, lunch, dinner, snack. A recipe can have more than one. | Needed for filtering and meal-plan slots. |
| A7 | "Total time" is preparation plus cooking time as recorded in the recipe. | A consistent value for the time filter. |
| A8 | Ingredient exclusion matches on the recipe's structured ingredient names, not on free text. | Free-text matching would be unreliable and hard to test. |
| A9 | Search is a text match against recipe title and ingredient names. | Simplest search that meets the need. Ranking behavior is not defined. |

## FUNCTIONAL REQUIREMENTS

**RP-01** — As **Marcus**, I want to search recipes by keyword so that I can quickly find candidates for a meal without browsing the whole collection.
- Input: text of at least 1 character; matches title and ingredient names, case-insensitive.
- Results update on submit (or after typing, design choice).
- Empty query shows the default browse list.
- Edge cases: leading/trailing spaces ignored; special characters do not cause errors; very long input is truncated or rejected with a message.

**RP-02** — As **Priya**, I want to filter recipes by one or more dietary tags so that I only see recipes labelled as matching my diet.
- Multiple tags combine with AND (A5).
- Selected tags are visibly indicated.
- Filter works together with search and other filters.
- Edge case: a combination with no matches shows the empty state from RP-06.
- The interface shows a short notice that tags are labels, not medical guarantees (wording **Requires Human Validation**).

**RP-03** — As **Tomás**, I want to filter recipes by meal type and maximum total time so that I only see meals that fit the slot and the time I have.
- Meal type: single or multiple selection.
- Time: selectable maximum from predefined options (options **Requires Human Validation**).
- Edge case: recipes with missing time data are excluded from time-filtered results (assumed) and this is a data-quality rule.

**RP-04** — As **Marcus**, I want to exclude recipes that contain specific ingredients so that I do not have to inspect each recipe for ingredients my family avoids.
- User enters ingredient names; the interface suggests names from the ingredient vocabulary.
- Excluded ingredients shown as removable chips.
- Matching per A8.
- Edge case: an ingredient not in any recipe is accepted and has no effect, or the user is told there are no such recipes (design choice).

**RP-05** — As **Tomás**, I want each search result to show title, total time, servings, dietary tags and number of ingredients so that I can compare recipes without opening each one.
- Results shown as a scrollable list or grid, paginated or loaded incrementally.
- A default sort order is defined (**Requires Human Validation**); optional sort by time.
- Edge case: missing image shows a neutral placeholder.

**RP-06** — As **Helen**, I want to see which filters are active, remove them individually or clear them all, and see a clear message when nothing matches so that I am never left with a blank screen and can recover easily.
- Active filters displayed together with a "Clear all" control.
- Empty state states that no recipes match and suggests removing a filter, naming the most restrictive one where determinable.
- Filters persist while navigating to a recipe and back.

## NON-FUNCTIONAL REQUIREMENTS

| ID | Category | Requirement | Status |
|----|----------|-------------|--------|
| NFR-A1 | Performance | Search and filter results are displayed within 2 seconds for 95% of queries on a typical broadband connection with the initial recipe collection. | Proposed target — **Requires Human Validation** |
| NFR-A2 | Usability | On a 360 px-wide viewport, all filters are reachable and usable without horizontal scrolling. | Testable; threshold width is a proposal |
| NFR-A3 | Accessibility | Filters and results can be operated by keyboard only, with visible focus, and meet WCAG 2.1 AA contrast for text. | Proposed standard — **Requires Human Validation** |
| NFR-A4 | Data integrity | The filtered results never include a recipe that lacks a selected tag or contains an excluded ingredient, as recorded in the recipe data. | Testable against the data |
| NFR-A5 | Compatibility | Works in the current and previous major versions of Chrome, Firefox, Safari and Edge. | Proposed — **Requires Human Validation** |

---

# Recipe Details, Servings and Saved Recipes 1-pager

## PROBLEM

Before committing a recipe to the week, Marcus needs to know exactly what it requires and whether it works for his household. Recipes are written for a fixed number of servings, and he currently rescales by hand, which is error-prone: he once bought half the chicken needed. Priya wants to keep a shortlist of recipes she uses repeatedly so she does not have to search for them each week, and Helen wants to reuse recipes she has liked.

The portal must give a complete, readable view of a recipe with quantities that can be scaled to the number of people cooking, and let users keep a personal set of saved recipes. This matters because the servings the user chooses drive the quantities on the grocery list; incorrect scaling produces incorrect shopping lists.

## ASSUMPTIONS

| # | Assumption | Why it is needed |
|---|------------|------------------|
| B1 | Ingredient quantities are stored as a number plus unit (or "count" for items like eggs) and scale linearly with servings. | Defines scaling behavior and keeps it testable. |
| B2 | Some ingredients cannot be meaningfully scaled (e.g. "salt to taste"); these are stored without a quantity and are not scaled. | Prevents nonsensical numbers. |
| B3 | Servings can be set to whole numbers from 1 to a maximum (initially 12). **Requires Human Validation** | Prevents invalid values. |
| B4 | Fractions are displayed in a readable form (e.g. 1½) with rounding rules for counts (e.g. 1.5 eggs). **Requires Human Validation** | Scaling can create awkward quantities. |
| B5 | Cooking time does not change when servings change. | Simplest rule; real cooking times may vary. |
| B6 | Saving a recipe requires a signed-in user (see 1-pager F). **Requires Human Validation** | Saved recipes must persist per user. |

## FUNCTIONAL REQUIREMENTS

**RP-07** — As **Marcus**, I want to open a recipe and see its ingredients with quantities, steps, default servings, total time, meal types and dietary tags so that I can decide whether to cook it.
- Ingredients list quantity, unit and name in the recipe's stored order.
- Steps are numbered.
- Actions available from this view: adjust servings (RP-08), save (RP-09), add to plan (RP-12).
- Edge cases: recipe removed from the collection after being planned or saved (see RP-12, RP-10 details); recipe with missing image.

**RP-08** — As **Marcus**, I want to change the number of servings on a recipe and see the ingredient quantities recalculated so that I can cook the right amount for my household.
- Valid range per B3; invalid input is rejected with a message.
- Quantities scale linearly (B1); unscalable items (B2) remain unchanged and are labelled accordingly.
- The chosen servings can be carried into the meal plan (RP-12).
- Edge cases: rounding per B4; returning to default servings.

**RP-09** — As **Priya**, I want to save a recipe to my favourites so that I can find it again quickly when planning.
- A single action toggles saved/unsaved; state visible in results and detail view.
- Requires sign-in; a signed-out user is prompted to sign in and returned to the same recipe.
- Removing a recipe from favourites does not affect meal plans that already contain it.

**RP-10** — As **Priya**, I want to view my saved recipes and filter them with the same filters as the main search so that I can plan from recipes I already trust.
- Reuses RP-02–RP-04 filters within the saved set.
- Empty state: message explaining how to save recipes.
- Edge case: a saved recipe that has been removed from the collection is shown as unavailable and can be removed from favourites.

## NON-FUNCTIONAL REQUIREMENTS

| ID | Category | Requirement | Status |
|----|----------|-------------|--------|
| NFR-B1 | Data integrity | Scaled quantity = stored quantity × (selected servings ÷ default servings), calculated consistently, and displayed with the rounding rule in B4. | Testable once B4 is decided |
| NFR-B2 | Performance | Recalculating quantities after a servings change is displayed within 300 ms in 95% of cases. | Proposed target — **Requires Human Validation** |
| NFR-B3 | Usability | Recipe text is legible at default browser zoom of 100% and does not require zooming; layout remains usable at 200% zoom. | Testable |
| NFR-B4 | Privacy | A user's saved recipes are visible only to that user. | Testable |
| NFR-B5 | Accessibility | Servings control is operable by keyboard and screen reader with a labelled value. | Proposed standard — **Requires Human Validation** |

---

# Weekly Meal Planning 1-pager

## PROBLEM

Marcus wants to fill Monday–Friday dinners, Priya wants to eat the same recipe on three lunches, and Helen wants next week to look much like this week. Today they keep the plan in a notes app, a spreadsheet or on paper, separate from where recipes were found. Changing one meal means editing the plan and remembering to change the shopping list separately. If the plan is not visible as a whole, it is easy to schedule several heavy meals in a row or leave a day empty by accident.

The portal must let users place recipes in specific day and meal slots, choose servings per slot, and see the whole week at a glance, with simple ways to replace, move and remove meals. This matters because the plan is the source of truth for the grocery list; if it is awkward to maintain, users will abandon it and the list will be wrong.

## ASSUMPTIONS

| # | Assumption | Why it is needed |
|---|------------|------------------|
| C1 | A plan covers one calendar week, Monday–Sunday, with slots for breakfast, lunch, dinner and snack. **Requires Human Validation** (week start day, whether snacks are needed) | Defines the planning grid. |
| C2 | Each slot holds at most one recipe in this version. | Keeps planning and list generation simple. Side dishes are a possible later extension. |
| C3 | A user has at most one plan per calendar week. | Avoids ambiguity about which plan generates the list. |
| C4 | Plan slots store the recipe and a planned-servings number, defaulting to the recipe's default servings or the last servings the user chose in RP-08. | The servings must be per-slot because households eat differently on different days. |
| C5 | Plans can be created for the current week and future weeks; past weeks are viewable but not edited. **Requires Human Validation** | Keeps history simple. |
| C6 | Users can leave any slot empty; empty slots are not an error. | Most users will not plan every meal. |
| C7 | Plans persist for signed-in users (1-pager F). | A weekly plan is only useful if it is still there later. |

## FUNCTIONAL REQUIREMENTS

**RP-11** — As **Marcus**, I want to open a weekly plan for a chosen week showing days and meal slots so that I have one place to organise the week's meals.
- Shows seven days and four meal types per C1; current week is the default.
- User can move to previous/next weeks.
- Empty slots are visibly empty with an "add" action.
- Edge case: a week with no plan shows an empty grid, not an error.

**RP-12** — As **Marcus**, I want to add a recipe to a specific day and meal slot, with the number of servings, from the search results or the recipe detail page so that I can build the plan while browsing.
- User picks week, day and meal type; servings default per C4 and can be edited.
- If the slot is already occupied, the user is asked whether to replace the existing meal (leads to RP-14).
- Confirmation is shown after adding.
- Edge cases: adding to a past week is blocked with a message (C5); recipe removed from collection after being planned is shown as unavailable and excluded from list generation with a warning.

**RP-13** — As **Marcus**, I want to change the servings for a planned meal so that the plan reflects how many people will eat that meal.
- Same valid range as RP-08.
- Change is reflected in the plan view.
- If a grocery list has been generated, the list is flagged as out of date (RP-27).

**RP-14** — As **Tomás**, I want to replace the recipe in a planned slot with a different recipe so that I can change my mind without re-entering the rest of the plan.
- Replacement reachable from the slot and from search (via RP-12).
- Servings default to the new recipe's default or are kept from the old slot (rule to be decided, **Requires Human Validation**).
- Old recipe is not deleted from the collection or favourites.

**RP-15** — As **Helen**, I want to remove a meal from a slot, or move it to another slot, so that I can correct mistakes and adapt the plan when my week changes.
- Remove requires a single confirmation, or offers an undo (design choice).
- Move to an occupied slot asks whether to swap or replace.
- List flagged out of date if applicable (RP-27).

**RP-16** — As **Priya**, I want to assign the same recipe to several slots at once so that I can plan batch-cooked meals without repeating the add action.
- User selects multiple day/meal slots when adding.
- Servings per slot is set individually or applied to all.
- Occupied slots are not silently overwritten.
- Each slot afterwards behaves independently.

**RP-17** — As **Helen**, I want to review my whole week at a glance, including the recipe name, servings and dietary tags in each slot, so that I can check the plan is complete and suitable before shopping.
- Overview shows each slot's recipe title, servings and tags.
- Days or slots with no meal are visually distinct.
- Selecting a recipe in the overview opens its details.

**RP-18** — As **Helen**, I want to copy a previous week's plan into a future week so that I can reuse a routine without rebuilding it.
- User picks source week and target week; if the target has meals the user must choose to merge, replace or cancel.
- Copied meals keep recipe and servings.
- Recipes no longer in the collection are skipped, with a message listing them.

## NON-FUNCTIONAL REQUIREMENTS

| ID | Category | Requirement | Status |
|----|----------|-------------|--------|
| NFR-C1 | Performance | Adding, replacing or removing a meal is reflected in the plan view within 1 second in 95% of cases. | Proposed target — **Requires Human Validation** |
| NFR-C2 | Reliability / Data integrity | A confirmed plan change is not lost after page refresh, sign-out/sign-in, or switching device. | Testable |
| NFR-C3 | Usability | A user can add a meal from the recipe detail page to a slot in no more than 4 interactions (clicks/taps), excluding servings changes. | Testable; the number is a proposal — **Requires Human Validation** |
| NFR-C4 | Accessibility | Plan grid is operable by keyboard; every slot has a text label that includes day and meal type, not colour alone. | Proposed standard |
| NFR-C5 | Usability | On a 360 px viewport, the plan is usable without horizontal page scrolling (e.g. by day-by-day view). | Testable |

---

# Grocery-List Generation 1-pager

## PROBLEM

After planning, Marcus has five recipes for four to five servings each, and Priya has three recipes with one recipe repeated three times. To shop, they open each recipe and copy ingredients into a list, add up "2 onions" and "1 onion" by hand, convert between "1 cup" and "240 ml", and scale everything for servings. Mistakes happen: an ingredient is missed or under-bought, or the same ingredient appears three times on the list. This is the most repetitive step in the process and the one where errors are found at the worst time, in the shop or mid-recipe.

The portal must generate a grocery list directly from the weekly plan, using each planned meal's servings, combining the same ingredient across recipes where quantities can be combined correctly, and never producing a wrong total by combining incompatible quantities. This matters because the list is the main output of the portal and is only useful if users can trust it.

## ASSUMPTIONS

| # | Assumption | Why it is needed |
|---|------------|------------------|
| D1 | The list is generated for one plan week at a time. | Matches C3. |
| D2 | Ingredients are identified by a canonical ingredient name in the recipe data (e.g. "onion"), not by free text. | Reliable duplicate detection. Data quality risk. **Requires Human Validation** |
| D3 | Quantities are combined only when the ingredient name matches **and** units are of the same kind (mass with mass, volume with volume, or count with count). Otherwise items are listed separately. | Converting between kinds (e.g. cups of flour to grams) needs ingredient-specific data and is out of scope. |
| D4 | Supported units at first: g, kg, ml, l, tsp, tbsp, cup, and count. Conversions use fixed standard factors. **Requires Human Validation** (which measurement systems to support, US vs metric) | Defines what "convertible" means. |
| D5 | Combined quantities are shown in a sensible unit (e.g. 1200 g displayed as 1.2 kg). Display rules are **Requires Human Validation**. | Readability. |
| D6 | Unscaled ingredients without quantity (e.g. "salt to taste") appear once per ingredient, without a quantity. | Avoids inventing numbers. |
| D7 | The portal does not know what the user already has at home; pantry tracking is out of scope. | Scope control. Users remove items manually (RP-26). |
| D8 | The same recipe planned in several slots contributes its ingredients once per slot at that slot's servings. | Matches how batch cooking is planned. |
| D9 | Each ingredient in the recipe data has a category (produce, dairy, etc.) for grouping. **Requires Human Validation** | Needed for RP-22. |

## FUNCTIONAL REQUIREMENTS

**RP-19** — As **Marcus**, I want to generate a grocery list from my weekly plan so that I do not have to copy ingredients from each recipe by hand.
- Includes every ingredient from every planned recipe in the selected week, quantities scaled to each slot's servings.
- Each item shows name, quantity and unit.
- If the plan is empty, the user is told there are no planned meals and no list is produced.
- If some recipes are unavailable (removed), the list is generated for the rest and a warning names the missing ones.
- One current list per week (D1); regenerating is handled by RP-27.

**RP-20** — As **Priya**, I want identical ingredients from different recipes and slots combined into one line so that I see a single total for each thing I need to buy.
- Combining follows D2, D3 and D8.
- Example: 2 onions + 1 onion = 3 onions; 250 g rice + 250 g rice = 500 g rice.
- Different-kind quantities for the same ingredient are shown as separate lines (e.g. "1 onion" and "100 g onion").
- Edge case: same ingredient with no quantity in one recipe and a quantity in another is shown as a single line with the total plus a note (**Requires Human Validation** on presentation).

**RP-21** — As **Priya**, I want quantities of the same ingredient in compatible units (such as ml and cups) converted and combined so that I do not have to convert measurements myself.
- Conversion factors per D4; result unit per D5.
- Conversion is shown in a way the user can verify (e.g. total in a single unit).
- Edge case: unsupported or unknown unit is not converted and remains as its own line.
- Rounding rules are defined so that totals are not understated (round up to a practical increment — **Requires Human Validation**).

**RP-22** — As **Tomás**, I want the list grouped by category (for example produce, dairy, pantry) so that I can shop through the store section by section.
- Groups use the category on the ingredient (D9); items without a category go under "Other".
- Group order is fixed and documented; items within a group are sorted alphabetically.
- Empty groups are not shown.

**RP-23** — As **Marcus**, I want to see which planned recipes an item comes from so that I can decide whether to remove or adjust it.
- Each combined item can show its source recipes and days.
- Available without leaving the list (e.g. expandable line).
- Edge case: a manually added item shows "added by me".

## NON-FUNCTIONAL REQUIREMENTS

| ID | Category | Requirement | Status |
|----|----------|-------------|--------|
| NFR-D1 | Data integrity | For any plan, each list quantity equals the sum of the scaled quantities of the corresponding recipe ingredients (after unit conversion), with no omitted ingredient and no ingredient counted twice. | Testable using test plans with known totals |
| NFR-D2 | Data integrity | The system never combines quantities of incompatible unit kinds into a single number (D3). | Testable |
| NFR-D3 | Performance | A list for a full week (up to 28 planned meals) is generated and displayed within 3 seconds in 95% of cases. | Proposed target — **Requires Human Validation** |
| NFR-D4 | Reliability | If list generation fails, the user sees a clear error and the plan is unchanged; no partial list is presented as complete. | Testable |
| NFR-D5 | Privacy | Lists are visible only to the owning user. | Testable |

---

# Grocery-List Use and Maintenance 1-pager

## PROBLEM

Tomás uses his list on his phone in the shop while walking around with a bag in one hand; Helen prints hers; Marcus revises his midweek when a dinner is swapped. Once a list exists, it is used in situations where attention is split, the connection may be poor, and the list must reflect what has already been done: items bought, items the user already has at home, extra non-recipe items (washing-up liquid, milk). If regenerating the list after a plan change wipes out what the user already checked off, or if there is no way to take items off the list, users will go back to writing their own lists.

The portal must support the actual use of the list — marking items, adding and removing items, keeping the list in line with the plan, and outputting it in a form that works in the shop or on paper. This matters because a list that is generated correctly but cannot be used comfortably in the shop will not replace the user's existing habit.

## ASSUMPTIONS

| # | Assumption | Why it is needed |
|---|------------|------------------|
| E1 | A list belongs to one plan week and holds two kinds of item: generated items and manual items. | Enables regeneration without losing manual entries. |
| E2 | Each item has a state: to-buy or obtained. | Minimal state for shopping. |
| E3 | When the list is regenerated, obtained state and manual items are preserved for items that still appear; user-removed generated items stay removed unless their quantity changes. **Requires Human Validation** | This is the hardest rule in the product; must be decided explicitly. |
| E4 | The list is usable on a phone browser; offline use is not required in this version. **Requires Human Validation** | Shops may have poor coverage. |
| E5 | Printing uses the browser's print function with a print-specific layout. | Avoids building a separate output system. |
| E6 | Users edit quantities by typing numbers; edited quantities are flagged as user-modified. | Keeps the meaning of "generated" clear. |

## FUNCTIONAL REQUIREMENTS

**RP-24** — As **Tomás**, I want to mark items as obtained and unmark them so that I can see what is left to buy while I shop.
- Single tap/click toggles state; obtained items are visually distinct (not by colour alone) and may move to the bottom of their group.
- A count of remaining items is shown.
- State persists if the page is refreshed.

**RP-25** — As **Tomás**, I want to add my own items to the list so that I can put non-recipe things on the same list.
- Free-text name required; quantity and unit optional.
- Manual items appear in a group (e.g. "Other") or in a category the user selects.
- Manual items can be edited and removed.
- Validation: empty names rejected; duplicates of generated items allowed but flagged (**Requires Human Validation**).

**RP-26** — As **Tomás**, I want to remove an item or change its quantity so that the list reflects what I already have at home.
- Removal of a generated item is confirmed or undoable.
- Quantity edit accepts positive numbers only.
- Edited/removed generated items are marked so the user knows the list differs from the plan.
- Edge case: removing all items leaves an empty state, not an error.

**RP-27** — As **Marcus**, I want the list to be flagged as out of date when the plan changes and to be able to refresh it without losing what I have already checked off or added so that a midweek plan change does not force me to start over.
- Out-of-date indicator appears after any change to the plan for that week (RP-12 to RP-18).
- Refresh applies rule E3; user can see a summary of changes (items added, changed, removed) before or after applying (design choice, **Requires Human Validation**).
- Edge case: refresh when the plan is now empty asks for confirmation before removing generated items.
- Depends on RP-19, RP-20, RP-24, RP-25.

**RP-28** — As **Helen**, I want to print the list or view it in a plain, large-text layout so that I can take it shopping without a screen.
- Print layout shows item, quantity, unit, checkbox; hides navigation and controls.
- Fits within a reasonable number of pages; groups do not split awkwardly (best effort).
- Obtained items are included or excluded by user choice.

## NON-FUNCTIONAL REQUIREMENTS

| ID | Category | Requirement | Status |
|----|----------|-------------|--------|
| NFR-E1 | Usability | Toggle targets are at least 44 × 44 CSS pixels on touch devices. | Proposed standard (common mobile guideline) — **Requires Human Validation** |
| NFR-E2 | Reliability | Checked/unchecked state and manual items are saved so that they persist after refresh or reopening on another device. | Testable |
| NFR-E3 | Performance | Toggling an item updates on screen within 300 ms in 95% of cases on a mid-range phone with normal connectivity. | Proposed target — **Requires Human Validation** |
| NFR-E4 | Accessibility | List controls have text labels readable by screen readers; obtained state is conveyed in text as well as visually. | Proposed standard |
| NFR-E5 | Data integrity | A list refresh never deletes a manual item and never silently changes a user-modified quantity. | Testable |

---

# Accounts and Data Persistence 1-pager

## PROBLEM

Helen wants to open last week's plan on her laptop and print it; Marcus starts a plan on his laptop and checks the list on his phone in the shop; Priya wants her favourites there next week. If plans, favourites and lists are held only in one browser session, work is lost when the tab is closed or the device changes, and the weekly repeat use that the product depends on will not happen. At the same time, Helen is wary of creating accounts, and collecting personal data creates privacy obligations.

The portal must keep users' saved recipes, plans and lists available across sessions and devices with as little personal data as possible, and give users a way to remove their data. This matters because persistence is a precondition for the plan and list being useful, but the amount of personal data collected should not exceed what that requires.

## ASSUMPTIONS

| # | Assumption | Why it is needed |
|---|------------|------------------|
| F1 | Users register with an email and password. Third-party sign-in (e.g. Google) is possible but not decided. **Requires Human Validation** | Chapter 3's example suggests checking whether a stated login mechanism reflects a broader need (not having to remember yet another credential). |
| F2 | Browsing and filtering recipes does not require an account; saving, planning and lists do. **Requires Human Validation** (alternative: local browser storage with no account) | Lowers the barrier to trying the product. |
| F3 | Personal data stored is limited to email, credentials (hashed), saved recipes, plans, lists. No health data is collected. | Data minimisation. |
| F4 | Password reset by email is needed. | Users forget passwords; needed for persistence to be usable. Only mentioned as a rule under RP-29, not a separate story. |
| F5 | Deleting an account deletes all associated data. | Simple privacy rule. |

## FUNCTIONAL REQUIREMENTS

**RP-29** — As **Helen**, I want to create an account and sign in so that my saved recipes, plans and lists are still there when I come back or use another device.
- Registration requires email and password; validation of email format and password rules (rules **Requires Human Validation**).
- Duplicate email is rejected with a non-revealing message where practical.
- Sign-in error messages do not reveal whether the email exists (assumed security rule).
- Password reset by email (F4).
- Sign-out available on every page.
- If the user was building a plan before signing in, work is not lost (**Requires Human Validation** how).

**RP-30** — As **Helen**, I want to delete my account and all my data so that I remain in control of my personal information.
- Confirmation step that states what will be deleted.
- Deletion covers account, favourites, plans and lists (F5).
- After deletion, the user is signed out and cannot sign in with the old credentials.
- Recipe data is unaffected.

## NON-FUNCTIONAL REQUIREMENTS

| ID | Category | Requirement | Status |
|----|----------|-------------|--------|
| NFR-F1 | Security | Passwords are stored only as salted hashes produced by a recognised password-hashing algorithm; never in plain text or logs. | Testable by review |
| NFR-F2 | Security | All traffic between browser and server uses HTTPS. | Testable |
| NFR-F3 | Privacy | Only data listed in F3 is collected; no data is shared with third parties. | Testable by review; **Requires Human Validation** if analytics are added |
| NFR-F4 | Reliability | Saved data is not lost in normal operation; the recovery objective (how much data loss is acceptable) is set after validation. | **Requires Human Validation** — no numeric target proposed |
| NFR-F5 | Availability | Availability target is not set in this version; the product is assumed to be a course-project deployment. | **Requires Human Validation** |

---

### 5.7 Requirements Sizing

**Metric chosen:** Story points (relative effort/complexity, not importance). Story points fit user stories, allow relative comparison without pretending to be precise in hours, and are easy to revise later.

**Scale (modified Fibonacci):**

| Points | Meaning |
|-------:|---------|
| 1 | Trivial: single UI element or rule, no new data |
| 2 | Very small: simple UI plus simple logic, few edge cases |
| 3 | Small: moderate UI and logic, some validation |
| 5 | Moderate: several components or rules, multiple edge cases |
| 8 | Complex: significant logic or data dependencies, high uncertainty |
| 13 | Very complex: would normally be split further |

**Reference story:** RP-01 (keyword search) is the anchor at **3**; other stories are sized relative to it.

**These are initial estimates.** They rest on unvalidated assumptions (especially A1, D2, E3, F2) and may change when those decisions are made. The estimates cover design, implementation and basic testing of the story, not deployment or data entry for recipes.

| Story ID | User Story | Size | Rationale |
| -------- | ---------- | ---: | --------- |
| RP-01 | Marcus: search recipes by keyword | 3 | Anchor story. Simple UI; search across title and ingredient names; a few edge cases (empty, special characters). Data structure already assumed. |
| RP-02 | Priya: filter by dietary tags (AND) | 3 | Simple multi-select UI; logic is straightforward; must combine with search and other filters; the tag-disclaimer text is trivial. |
| RP-03 | Tomás: filter by meal type and max time | 3 | Two filters with predefined options; combines with others; missing-data rule. Comparable to RP-02 with slightly more UI. |
| RP-04 | Marcus: exclude ingredients | 5 | Needs an ingredient vocabulary/autocomplete, chip UI, and exclusion logic dependent on data quality (A8). More uncertainty than plain tag filters. |
| RP-05 | Tomás: result cards with summary data | 3 | Presentation of existing fields plus placeholder image, default sort and pagination; moderate UI, no complex logic. |
| RP-06 | Helen: active filters, clear, empty state | 3 | UI state management across all filters and empty-state messaging; depends on RP-02–RP-04 but logic is limited. |
| RP-07 | Marcus: recipe detail view | 2 | Read-only display of stored data with links to other actions. Edge cases (removed recipe) are small. |
| RP-08 | Marcus: change servings, recalculate | 5 | Scaling with rounding/fraction display rules (B4), unscalable items (B2), validation; correctness is critical because the list depends on it. |
| RP-09 | Priya: save favourite | 2 | Simple toggle with persistence; depends on account (RP-29). Sign-in redirect adds a small edge case. |
| RP-10 | Priya: view/filter saved recipes | 3 | Reuses filter components on a smaller data set; unavailable-recipe edge case; empty state. |
| RP-11 | Marcus: open weekly plan grid | 5 | New primary screen; week navigation, responsive layout (day-by-day on mobile), empty states; persistence design. |
| RP-12 | Marcus: add recipe to slot with servings | 5 | Interaction from two entry points, slot selection, occupied-slot handling, past-week blocking, servings default rule; touches plan data model. |
| RP-13 | Marcus: change servings for planned meal | 2 | Reuses RP-08 validation; updates plan slot; triggers out-of-date flag (small dependency on RP-27). |
| RP-14 | Tomás: replace planned recipe | 2 | Mostly reuses RP-12 flow with a replace path; small rule for servings. |
| RP-15 | Helen: remove or move a meal | 3 | Remove is trivial, but move introduces slot-conflict handling (swap/replace) and confirmation/undo. |
| RP-16 | Priya: assign one recipe to multiple slots | 3 | Multi-select UI and per-slot servings; conflict handling for occupied slots. Builds on RP-12. |
| RP-17 | Helen: weekly overview | 2 | Presentation of plan data already loaded by RP-11; mainly layout and visual distinction of empty slots. May be merged with RP-11 in design (see review). |
| RP-18 | Helen: copy previous week | 5 | Merge/replace/cancel conflict handling, skipping removed recipes with reporting; date logic across weeks. |
| RP-19 | Marcus: generate list from plan | 8 | Core capability. Traverses the plan, scales each ingredient, handles missing recipes and empty plan, data model for lists; highest correctness risk; all later list stories depend on it. |
| RP-20 | Priya: combine identical ingredients | 8 | Depends on canonical ingredient identity (D2) and data quality; rules for mixed units, missing quantities; heavy testing needed; high uncertainty. |
| RP-21 | Priya: unit conversion | 5 | Fixed conversion table and rounding/display rules; edge cases for unknown units; more contained than RP-20 but requires careful test data. |
| RP-22 | Tomás: group by category | 3 | Requires a category on each ingredient (data dependency D9) plus grouped display; low logic complexity. |
| RP-23 | Marcus: see item sources | 3 | Requires that aggregation keeps a link to sources (a data design consequence of RP-20); UI is an expandable row. |
| RP-24 | Tomás: mark obtained | 2 | Simple state toggle with persistence; small UI considerations for touch. |
| RP-25 | Tomás: add manual item | 3 | Form with validation, category choice, persistence and mixing with generated items. |
| RP-26 | Tomás: remove/edit item | 3 | Edit/remove with undo/confirmation, marking modified items; interacts with E3 rules. |
| RP-27 | Marcus: out-of-date flag and refresh | 8 | Hardest business rule (E3): preserving checked state, manual items and removals while regenerating; change summary; needs the plan-change hooks from RP-12–RP-18; high uncertainty. |
| RP-28 | Helen: print/large-text list | 3 | Print stylesheet and layout; no data logic; cross-browser print differences add a little uncertainty. |
| RP-29 | Helen: account creation and sign-in | 5 | Standard but security-sensitive: validation, hashing, reset email, session handling. Effort depends on whether a third-party sign-in is used (uncertain). |
| RP-30 | Helen: delete account and data | 3 | Cascade deletion across data types, confirmation, sign-out; testing that nothing remains. |

**Total: 108 story points** across 30 stories (RP-01 to RP-30). Sizes by 1-pager: A = 20, B = 12, C = 22, D = 27, E = 19, F = 8. (These are relative estimates only; a total does not imply a schedule.)

### 5.8 Functional Requirement Quality Control (self-review)

| Check | Finding | Correction made |
|-------|---------|-----------------|
| **Coverage** | Vision chain (find → plan → list) is covered end to end, including refresh after plan change and use of the list. | None needed |
| **Persona alignment** | Every story names one of the four personas. Distribution: Marcus 9, Priya 7, Tomás 8, Helen 6 (approx.). Helen is used for the persistence and accessibility-related stories. | Balanced by assigning stories to the persona whose scenario motivates them |
| **User value** | Every story has a "so that" clause. | Rewrote two stories that stated a mechanism instead of a value (RP-05, RP-17) |
| **Specificity** | Supporting details give rules, validation and edge cases. Several rules are still open decisions (marked). | Marked as Requires Human Validation instead of inventing values |
| **Testability** | Stories avoid negatives and vague words. RP-06's "never left with a blank screen" was reworded into concrete behavior (empty state). | Reworded |
| **Scope** | Rejected during review: *price estimate for the list*, *pantry inventory*, *nutrition summary of the week*, *share plan with family*, *recipe ratings*. These fail the Chapter 3 test of being relevant and coherent within the core vision. | Not included |
| **Redundancy** | Initial draft had separate stories for meal-type filter and time filter, and for "view plan" and "review plan". | Merged filters into RP-03. RP-17 kept because it adds content (tags, servings, empty-slot cue) beyond RP-11, but flagged as a merge candidate |
| **Dependencies** | RP-09/10 → RP-29; RP-12 → RP-07/RP-11; RP-13–RP-18 → RP-12; RP-19 → RP-11/12; RP-20 → RP-19; RP-21 → RP-20; RP-22 → RP-19; RP-23 → RP-20; RP-24–RP-28 → RP-19; RP-27 → RP-12–RP-18, RP-24, RP-25. | Documented here |
| **Missing requirements** | Discovered gaps: list refresh after plan change (added RP-27), account deletion (RP-30), out-of-date indicator (in RP-13/15/27). Not addressed: recipe data management (out of scope; Open Questions), password recovery as a separate story (included as a rule in RP-29). | Added |

**Dependency summary**

```
RP-29 (accounts) ─┬─> RP-09 → RP-10
                  └─> persistence for RP-11..RP-28
RP-07 → RP-08 → RP-12 → RP-13, RP-14, RP-15, RP-16, RP-18
RP-11 → RP-12, RP-17
RP-12/plan → RP-19 → RP-20 → RP-21, RP-23
RP-19 → RP-22, RP-24, RP-25, RP-26, RP-28
RP-12..RP-18 + RP-24 + RP-25 → RP-27
```

---

## 6. Overall Requirement Traceability Matrix

| Product Vision Need | Persona | Problem / Scenario | 1-Pager | Functional Requirement IDs |
| ------------------- | ------- | ------------------ | ------- | -------------------------- |
| Narrow recipes by dietary tag, meal type, time, excluded ingredients | Marcus, Priya, Tomás | Filtering unsuitable recipes by hand across sources; inconsistent filters | A. Recipe Discovery and Filtering | RP-01, RP-02, RP-03, RP-04, RP-05, RP-06 |
| Recover from over-restrictive filters | Helen | Blank or confusing results; hard to undo filters | A | RP-06 |
| Review a recipe and scale it to the servings needed | Marcus | Manually rescaling quantities; unclear recipe requirements | B. Recipe Details, Servings and Saved Recipes | RP-07, RP-08 |
| Keep recipes for reuse | Priya, Helen | Searching again each week | B | RP-09, RP-10 |
| Place recipes into a weekly plan | Marcus, Tomás | Plan kept separately from recipes; hard to build in one sitting | C. Weekly Meal Planning | RP-11, RP-12, RP-13, RP-14 |
| Edit and reorganise the plan | Helen, Tomás | Mistakes and changing weeks; fear of losing work | C | RP-14, RP-15 |
| Support batch cooking and repeated routines | Priya, Helen | Repeating entry; rebuilding similar weeks | C | RP-16, RP-18 |
| See the whole week and check completeness | Helen, Marcus | No overview; gaps unnoticed | C | RP-17 |
| Generate a grocery list from the plan | Marcus | Manual copying of ingredients; errors found in the shop | D. Grocery-List Generation | RP-19 |
| Combine duplicate ingredients and units correctly | Priya, Marcus | Manual summing; wrong totals; unit mismatches | D | RP-20, RP-21 |
| Make the list usable in the shop | Tomás | Disorganised lists; walking the shop repeatedly | D | RP-22 |
| Understand where an item comes from | Marcus | Cannot decide whether to remove an item | D | RP-23 |
| Track progress while shopping; adapt list to reality | Tomás | Forgetting what has been bought; items already at home; non-recipe items | E. Grocery-List Use and Maintenance | RP-24, RP-25, RP-26 |
| Keep the list consistent with a changing plan | Marcus | Plan changes midweek; list goes stale | E | RP-27 (with RP-13, RP-15) |
| Paper/large-text output | Helen | Prefers printed list; small text | E | RP-28 |
| Keep saved recipes, plans and lists across sessions/devices | Helen, Marcus | Losing work; using multiple devices | F. Accounts and Data Persistence | RP-29 |
| Control over personal data | Helen | Reluctance to create accounts; privacy | F | RP-30 |

**Gaps identified**

1. **Recipe data supply.** No persona represents the people who create and maintain recipe data, so there are no stories for it. Dietary tag accuracy (NFR-A4) is only as good as this data. Recorded as a High Priority open question.
2. **Ingredient exclusion for allergies.** Marcus's nut-free need is served by filtering (RP-02, RP-04) but the product does not and must not guarantee allergen safety. The disclaimer wording is unresolved.
3. **Offline shopping use (Tomás).** Not covered (assumption E4).
4. **No-account use.** Whether browsing/planning can happen without an account (F2) is unresolved and affects RP-09–RP-29.

---

## 7. Project Manager Quality Audit

| Area | Question | Finding | Correction / Status |
|------|----------|---------|---------------------|
| **Product Vision** | Clear? User-centred? Scoped? Connected to the product idea? | Yes; states problem, user group, chain Recipes → Plan → List, and non-goals. | Corrected in refinement (Section 1) |
| **Personas** | Realistic, specific, different, sufficient? | Four distinct proto-personas, one merged. All are unvalidated assumptions. Sommerville's caution about "goals" is handled by writing concrete goals with motivations. | Flagged for validation |
| **Problems / Scenarios** | Real problems? Context? Linked to personas? | Each 1-pager names personas and situations. Scenarios are narrative, following Chapter 3's recommendation for early-stage narrative rather than structured scenarios. Number of scenarios: one per persona (Chapter 3 suggests roughly three or four per persona; the assignment format requires one problem per 1-pager, so persona scenarios here are shorter than a full scenario set). | **Known limitation.** More scenarios per persona could be added in the polish iteration |
| **Assumptions** | Appropriate and necessary? | Assumptions explain why each is needed. Some (D2 ingredient canonical names, E3 refresh rule, F2 accounts) strongly affect design. | Marked Requires Human Validation |
| **Functional Requirements** | User-centred, specific, testable, complete, no implementation detail? | 30 stories with supporting details. A few include UI wording (e.g. chips, expandable rows) that leans toward design; kept as "examples" and can be relaxed. RP-17 and RP-11 may be merged. | Noted for polish |
| **Non-Functional Requirements** | Relevant and measurable, no arbitrary claims? | NFRs are per 1-pager and categorised. Numeric targets (2 s, 300 ms, 3 s, 44 px, 360 px) are **proposals only**, not established requirements. NFR-F4/F5 deliberately have no number. | Labelled |
| **Sizing** | One metric, all sized, rationale? | Story points, 30/30 sized, rationale given, anchored to RP-01. | OK. Sizes to be revisited after open questions are answered |
| **Traceability** | Every requirement linked to a need? Orphans? | All 30 stories appear in the matrix and in the persona table. No orphan stories found. RP-17 and RP-23 are the weakest links to a stated pain point. | Kept with justification |
| **Scope** | Does the product stay focused on discovery, planning and list generation? | Yes. Accounts (F) is the only supporting area outside the three core activities and is justified by persistence. | OK |
| **Evidence** | Any invented research or statistics? | None. All numbers are labelled as proposals; no market claims. | OK |

**Final quality test**

- *Can a development team understand who the users are, their problems, the product purpose and the required functionality?* Yes, subject to the open questions.
- *Can every functional requirement be traced to a user problem and persona?* Yes (Section 6).
- *Does the product remain focused on recipe discovery, weekly meal planning and grocery-list generation?* Yes; excluded items are listed and the rejected ideas are recorded in 5.8.
- *Does the document show requirements analysis rather than a feature list?* It shows derivation (vision → persona → problem → story), assumption analysis, dependency analysis and scope rejection. Weaknesses remain (unvalidated personas, few scenarios per persona), and these are recorded rather than hidden.

---

## 8. Open Questions / Human Validation

### High Priority

1. **Recipe data source.** Will recipes come from an existing dataset, or be manually entered by the team? This determines the ingredient structure (D2), the tag accuracy (NFR-A4), the recipe count, and whether a content-maintenance role exists (a missing persona).
2. **Do users need accounts?** Accounts (F1, F2) versus local browser storage. This affects RP-09, RP-10, RP-29, RP-30, sizing, and the privacy NFRs.
3. **Ingredient identity and quantity model.** Are ingredients stored with canonical names, quantity, unit and category? Without this, RP-19–RP-23 cannot be built reliably.
4. **List refresh rule (E3).** What exactly happens to checked, removed, edited and manual items when the plan changes and the list is regenerated?
5. **Dietary tag set and disclaimer wording.** Which tags are supported initially (A3), and what does the interface say about their reliability, given cases like Marcus's allergy?

### Medium Priority

6. **Unit systems and conversion.** Metric only, US customary only, or both (D4)? Rounding and display rules (D5, RP-21)?
7. **Servings scaling rules.** Range of servings (B3), rounding of counts and fractions (B4).
8. **Plan structure.** Week start day, whether snacks are needed, one recipe per slot (C1, C2), and whether past weeks are read-only (C5).
9. **Grocery categories.** Fixed category list and ordering (D9, RP-22).
10. **Target devices.** Is phone use in the shop a primary target? Is offline access needed (E4)?

### Low Priority

11. **Numeric NFR targets.** Confirm or replace the proposed values (2 s, 300 ms, 3 s, 44 px, 360 px) and the accessibility level (WCAG 2.1 AA).
12. **Default sort order** for results (RP-05) and the time-filter options (RP-03).
13. **Browser support list** (NFR-A5).
14. **Third-party sign-in** (F1) if accounts are kept.
15. **Persona validation.** Informal conversations with 3–5 real people from the target groups, to check whether the four proto-personas resemble real users.

---

## 9. Student Evaluation of Claude's Output

*(Leave blank — to be completed by the student.)*

**What did Claude do well?**


**What did Claude misunderstand?**


**Which personas were most useful, and which were least useful? Why?**


**Were the scenarios sufficiently detailed?**


**Were the assumptions appropriate? Which assumptions would you change or reject?**


**Which requirements need revision (missing, redundant, untestable, out of scope)?**


**Were the non-functional requirements appropriate and measurable? Which targets need validation?**


**Was the sizing rationale reasonable? Which sizes would you change, and why?**


**Was the traceability between vision, personas, problems and requirements convincing?**


**What would you change before submission?**


**What did I learn from using Claude as a Product Manager simulator?**


**Overall evaluation:**

