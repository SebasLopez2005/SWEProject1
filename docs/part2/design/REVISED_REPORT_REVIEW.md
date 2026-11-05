# Revised report alignment review

Reviewed November 4, 2026 against [Fitness Workout Log App Revised v2](source/Fitness_Workout_Log_App_Revised_v2.docx). The supplied DOCX contains no embedded diagram images; this review covers the 42 Mermaid sources in this repository. The original report and archived Part 1 files are unchanged.

## Findings and corrections

| Revised requirement | Finding and correction |
| --- | --- |
| Roles replace names in requirements | Updated all 31 story sequences and the context diagram to experienced lifter, beginner lifter, home trainer and returning lifter. Persona profiles remain valid. Re-extracted all story paragraphs and details into stories.json and SELECTED_STORIES.md. |
| Privacy is functional behavior | FW-04 now explicitly queries only the user's own workouts; FW-12 explicitly returns an exercise visible only to its creator; FW-14 explicitly queries only the user's own history. Owner-scoped storage and backend authorization were already modeled. NFR-06 remains withdrawn, with no renumbering. |
| Predefined exercise library belongs to FW-11 | Added its requirement for common gym/home exercises and the user's custom exercises directly to the FW-11 diagram. The seed/bootstrap architecture already supported it. |
| Exercise assumptions renumbered | Preserved revised A-EX-1 (exercise properties, immutable predefined library, custom ownership) and A-EX-2 (name uniqueness). Updated extracted FW-12 detail and diagram reference to A-EX-2. Clarified name comparison ignores case and spaces rather than only collapsing spaces. |
| Archived template references may be skipped | FW-26 previously added only active exercises after selection, silently dropping retained archived references. It now adds retained references in order with archived ones marked, allowing the user to skip them as the report specifies. |
| Resume or discard unfinished workout | Added the missing confirmed-discard branch to navigation. Resume still opens the active workout. |

## Requirements already represented

Logging and typed validation, prefill, immediate undo, finish/drop-empty behavior, restart persistence, earlier dates, offline upload, stable exercise identity, correction/deletion propagation, history filters, weighted/reps graphs, duration exclusion, independent exercise-list templates, per-set entered units, conversion without rewriting stored data, and persistent text enlargement through 200% already have diagram coverage. The revised report retains all 31 stories and 101 points; it does not add product capabilities.

The critique rewrite changes the rationale for the product. It does not require a new screen, entity or sequence. The diagrams continue to support the resulting needs N1 through N10.

## Source requirements versus design proposals

The report leaves two-device conflict resolution undefined (A-REL-3) and puts sign-in mechanics outside its story scope (A-LOG-3). Email/password, Supabase/SQLite, explicit conflict review, Monday-start weeks, exact intermediate graph periods, foreground sync limits and unit-switch confirmation remain additional design decisions described in SCOPE.md. They must not be presented as professor requirements or as resolutions supplied by the revised report.

The source still labels performance/usability thresholds as proposals or assumptions. These include three-tap prefilled recording; one-second set, summary, search and template-start targets; three-second history/graphs around 1,000 workouts; 44-point targets; 4.5:1 text contrast; 360-pixel layout; and one-decimal conversion accuracy. Existing SCOPE.md treats numeric speed/capacity proposals as historical targets rather than release guarantees. This is an explicit design qualification, not full adoption of every source NFR. NFR-09 and NFR-13 remain unchanged in the source despite its note that they may merit later classification review.

## Verification

The design checker now compares every story and acceptance-detail paragraph directly with the retained revised DOCX, in addition to checking 31 IDs, 101 points, 42 indexed diagrams, class participants, mirrored guide, links and archived-file integrity. Mermaid rendering checks syntax separately; neither check proves application behavior or measured quality targets.
