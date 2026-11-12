# Requirements and verification

The input was the supplied design tree at its November 8 working revision, the revised source report and the dark interface brief. FW IDs come from the 31-story revised baseline. TR IDs come from the planned-training draft and its sequence diagrams. The four personas share owner-scoped lifter permissions. See [ASSUMPTIONS.md](ASSUMPTIONS.md) for design decisions.

## Revised workout baseline

| ID and story | Implementation | Status and actual evidence |
| --- | --- | --- |
| FW-01 · Start a workout, add exercises | Start, date and exercise picker | **Implemented and verified.** Simulator started Upper body and an ad hoc session, selected Pushups offline, and finished. TypeScript and SQL tested empty finish. |
| FW-02 · Record a set with prefill | Typed SetEditor, prior actual lookup and suggestions | **Implemented and verified.** Simulator reviewed 60 kg × 12 and confirmed 60 kg × 11. Prior-set fallback is implemented. |
| FW-03 · Set form matches exercise type | Load, reps and time forms and trusted validation | **Implemented and verified.** TypeScript validated all three input types; SQL accepted a valid weighted actual. Native weighted and reps-only forms exercised. |
| FW-04 · See previous performance | Previous performance from local history | **Implemented and verified.** Simulator showed bench history in the active session. Corrections feed the same query. |
| FW-05 · Correct or remove a set or entry | Edit, confirmation and 15-second undo in session | **Implemented but unverified.** Model validation and UI built; removal and undo still need simulator coverage. |
| FW-06 · Finish workout, see summary | Finish transaction and summary | **Implemented and verified.** Simulator confirmed eight pending rows to skip and displayed one set and volume 660. SQL rejects a finished workout without working sets. |
| FW-07 · Resume an unfinished workout | SQLite persistence and Workout resume/discard | **Implemented and verified.** Force-closed, relaunched and resumed the session with the set and paused rest intact. |
| FW-08 · Record a workout on an earlier date | Native date selector, calendar strings and future-date checks | **Implemented but partly verified.** TypeScript and SQL rejected future dates. Native earlier-date selection needs coverage. |
| FW-09 · Log offline, upload later | SQLite outbox, Supabase RPC, change feed and sync status | **Implemented and verified.** iOS saved and finished a workout with the local API stopped, then changed from Waiting to upload to Uploaded after the API resumed. Settings showed zero pending operations. Local API checked retries, RLS and tombstones. |
| FW-10 · Choose kg or lb | Initial unit chooser and persistent settings | **Implemented and verified.** Simulator switched kg/lb and viewed Settings. Model tested mixed-unit conversion. |
| FW-11 · Find an exercise; recent first | Pinned offline catalog and search/filter/recent rank | **Implemented and verified.** Catalog checksum and 876 unique IDs verified. Unit test exercised case-insensitive search and filters. |
| FW-12 · Create a custom exercise | Custom Exercise editor and owner scope | **Implemented but unverified.** Trusted validation and owner scope implemented. Custom exercise journey still needs device coverage. |
| FW-13 · Rename or archive a custom exercise | Edit, archive and restore custom exercise | **Implemented but unverified.** Stable identity and usage type locking implemented. Archive and restore still need device coverage. |
| FW-14 · List finished workouts | Owner-scoped History, summaries and incremental pagination | **Implemented but partly verified.** API isolation verified. Native list filtering and pagination still need coverage. |
| FW-15 · Open a past workout | Finished session detail and totals | **Implemented and verified.** Simulator displayed finished date, exercise entries, actuals, and volume in both units. |
| FW-16 · History of one exercise | Exercise detail with historical actuals | **Implemented but unverified.** Route from library and session entry implemented; complete exercise history journey still needs device coverage. |
| FW-17 · Edit a finished workout | Finished workout correction and immutable minimum set rule | **Implemented but partly verified.** SQL rejects empty finished snapshot. Native historical edit still needs coverage. |
| FW-18 · Delete a finished workout | Confirmed delete with tombstone and shared derivations | **Implemented but partly verified.** Local Supabase API accepted deletion and returned its tombstone. Native deletion still needs coverage. |
| FW-19 · Filter history | Composable calendar and exercise filters | **Implemented but unverified.** History filters implemented; their combined native journey still needs coverage. |
| FW-20 · Per-exercise volume graph | Exercise graph and sparse state | **Implemented but partly verified.** TypeScript checked exercise grouping and mixed-unit aggregation; specific native exercise graph still needs coverage. |
| FW-21 · Choose the period | Period controls and derived data | **Implemented but partly verified.** Simulator showed period controls and default 4-week exact values. Other period selections still need device coverage. |
| FW-22 · Overall weekly volume graph | Monday weekly graph and week-over-week comparison | **Implemented and verified.** TypeScript checked Monday boundaries and zero-filled weeks. Simulator displayed weekly graph and values. |
| FW-23 · Reps-only total reps graph | Reps-only graph and timed-only history | **Implemented but unverified.** Calculation and chart states implemented. A reps-only native graph still needs coverage. |
| FW-24 · Select a point, open workout | Graph point and accessible exact-value drill-down | **Implemented and verified.** Simulator selected 660 kg × reps and opened its week with the underlying Upper body workout. |
| FW-25 · Save workout as template | Save as routine with optional explicit actual targets | **Implemented but unverified.** Routine review opens with existing plans or exercise-only rows. Save-from-workout native path still needs coverage. |
| FW-26 · Start workout from template | Start from routine with snapshot and archived entry handling | **Implemented but partly verified.** Simulator previewed and started a routine; immutable target checked. Archived and exercise-only variants still need device coverage. |
| FW-27 · Create and edit a template | Create/edit/reorder/remove routine entries | **Implemented but unverified.** Editor and validation implemented. New routine and reordering still need device coverage. |
| FW-28 · Delete a template | Confirmed routine delete and independent snapshots | **Implemented but partly verified.** Independent snapshots are tested in the model. Native delete path still needs coverage. |
| FW-29 · Larger text size | Persistent 100–200% text scale and wrapping | **Implemented but partly verified.** Simulator displayed Settings at 200% and controls remained readable. All-screen/VoiceOver coverage remains open. |
| FW-30 · See both units | Primary and equivalent load formatter | **Implemented and verified.** Simulator showed 60 kg (132.3 lb) and both volume units. Equivalent switch is implemented. |
| FW-31 · Enter a set in either unit | Per-set units and explicit conversion confirmation | **Implemented but partly verified.** Model tested original mixed units. Native conversion confirmation still needs coverage. |

## Planned training and visual scope

| ID | Implementation | Status and actual evidence |
| --- | --- | --- |
| TR-01 | Ordered routine plans with phases, counts, load, unit, RIR bounds and rest. Sessions copy targets. | **Implemented but partly verified.** Seeded Upper body was started on the simulator. TypeScript rejected an inverted RIR range. Editing a routine after start still needs native coverage. |
| TR-02 | Pending/done/skipped rows, target and actual fields, extra sets, skip/undo and explicit finish confirmation. | **Implemented but partly verified.** Simulator recorded 11 reps and RIR 2 with a 12-rep target, then finished with eight skipped. Explicit undo and additional set paths still need device coverage. |
| TR-03 | Device-local rest deadlines, pause/resume, add time and skip. Rest is invalidated by its source or session. | **Implemented but partly verified.** Native timer started and survived relaunch while paused. TypeScript tested override and expiration behavior. |
| TR-04 | General and lift-specific warm-up entries with separate result accounting. | **Implemented but partly verified.** Seeded warm-up displayed as its own block. Tests excluded preparation from volume, goals and muscle scores. |
| TR-05 | Searchable mobility movements, instructions, editable prep/cooldown targets, movement countdown and timed recording. | **Implemented but unverified.** Physical or simulator walkthrough of the optional prep/cooldown path remains. |
| TR-06 | Pinned catalog, stable IDs, filters, custom tags and local instructions. | **Implemented and verified.** Checksum, 876 IDs, catalog SQL migration and search tests passed. Existing-attempt ID migration is outside this isolated build. |
| TR-07 | Front/back body map, bands, unmapped count, exact values and session drill-down. | **Implemented but partly verified.** TypeScript checked chest 4.0, shoulders 2.0 and triceps 2.0 with deduplication and phase exclusion. iPhone simulator displayed regional values and opened the Chest set-by-set contribution list. |
| TR-08 | Calendar-month report, comparison of equal elapsed days, counts, volume and lift highlights. | **Implemented but partly verified.** TypeScript tested short-month and historical windows. Native drill-down needs coverage. |
| TR-09 | Weighted exercise goals with minimum reps and optional target date. | **Implemented but partly verified.** TypeScript rejected the 230 lb × 3 result for a 225 lb × 5 goal and selected 102.1 kg × 5. Native goal editing needs coverage. |
| TR-10 | Offline CSV for sets and monthly reports, separate opt-in bodyweight, date options and native share. | **Implemented and verified for workout export.** Simulator opened the share sheet. Python parsed 46 rows with unique set IDs and distinct targets and actuals. Bodyweight remained off by default. Other files are implemented and still need native share checks. |
| TR-11 | Optional kg/lb readings, trend and weight target with edit/delete. | **Implemented but unverified.** Seeded readings and screens are available. Mixed-unit reading edits and export need device coverage. |
| TR-12 | Opt-in local reminders by weekday/time, rotation, notification routing and completed-date suppression. | **Implemented but unverified.** Native scheduling and cancellation acceptance still need device checks. |
| TR-13 | Expo Widgets Live Activity and Dynamic Island deadline, deep link and optional rest-end alert. | **Implemented but partly verified.** Widget extension compiled and embedded in native app. In-app timer was exercised. Physical Lock Screen and permission behavior remain unverified. |
| UI-01 | Graphite and charcoal UI with champagne accents, icon, dark controls and chart styling. | **Implemented and verified.** Inspected rendered welcome, Workout, set entry, progress and settings on iPhone 17 Pro. |
| UI-02 | Interactive Liquid Glass action controls with solid states and Reduce Transparency fallback. | **Implemented but partly verified.** Glass rendered on iOS 26.5. Reduce Transparency fallback was not exercised. |
| UI-03 | Required training/navigation flows, scrollable forms, labelled controls and exact chart values. | **Implemented but partly verified.** Simulator accessibility tree exposed tab, form and chart value controls. Android and VoiceOver workflows were not run. |
| SUP-01 | Email/password Supabase Auth, secure session storage and owner-specific local data. | **Implemented but partly verified.** iOS signed into a disposable local account. API verified that two separate accounts cannot read each other’s workout or feed. |
| SUP-02 | Conflict snapshots, expected revisions, resolution and copy preserving set IDs within the source record. | **Implemented but partly verified.** SQL and API detected stale writes. Multi-device UI conflict resolution still needs coverage. |
| DIST-01 (derived) | Native iOS simulator, widget extension, and EAS profiles for TestFlight. | **Simulator verified. TestFlight blocked.** Apple team, app record and signed profiles are required for distribution. |

## Verification run

- Native iOS 26.5 build and app installation passed on iPhone 17 Pro using Xcode 26.6, including the widget extension.
- A clean npm ci from the lockfile, TypeScript strict and unused-symbol checks, nine TypeScript tests, Expo dependency compatibility, and iOS bundle export passed.
- An isolated PostgreSQL cluster applied both migrations and passed role, validation, duplicate retry and stale revision checks.
- Local Supabase started on port 56321 and passed signup, authenticated RPC, isolation, replay and tombstone checks. The iOS simulator exercised local sign-in and automatic upload after an API outage.
- Simulator checks covered the planned-to-actual flow, paused rest across relaunch, skip confirmation, finished totals, chart drill-down, muscle contribution detail, Settings at 200% and workout CSV sharing.
- Physical iPhone Lock Screen and permission behavior, TestFlight signing and distribution, Android, VoiceOver and full device acceptance coverage remain open.
- The Expo SDK 56 dependency audit reported 17 advisory paths. npm’s high-severity fixes require an SDK or Router major-version upgrade, which is outside the verified build.
