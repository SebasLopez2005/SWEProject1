# Requirements traceability — Repwise (Claude)

Sources: `docs/part2/design/SELECTED_STORIES.md` (revised report text), `TRAINING_REQUIREMENTS_DRAFT.md`, `ROUND_02_UI.md`, `ROUND_02_CLAUDE.md` (One Shot 2), `SCOPE.md`, `CONTRACTS.md`, all Mermaid diagrams (`docs/part2/design/diagrams`), `BACKLOG.md` (BL-06).

**Evidence codes** (all run on Nov 11, 2026 unless stated):
- **U** — `tests/domain.test.ts` (pure rules)
- **R** — `tests/repository.test.ts`, `tests/sync.test.ts` (real SQLite via `node:sqlite`, same SQL as the device)
- **B** — `tests/backend.test.ts` against the local Supabase stack and the hosted `repwise-claude` project (9/9 passed on each)
- **S** — exercised by hand in the native development build on the iPhone 17 Pro simulator, iOS 26.5

**Status**: ✅ implemented and verified · 🟡 implemented, not verified end-to-end (reason given) · ⛔ blocked

## Original stories

| ID | Requirement (abridged) | Implementation | Verification | Status |
| --- | --- | --- | --- | --- |
| FW-01 | Start a workout dated now, add exercises from the library; no-set workout can only be discarded | `Repository.startWorkout/addEntry/discardWorkout`, `workout/start.tsx`, `workout/index.tsx` | R (start, second-active rejected, cannot finish empty, discard); S (start routine, add warm-up) | ✅ |
| FW-02 | Record set with prefill (previous set / latest set); weight 0–999.9, reps 1–999 | `suggestActual`, `validateActual`, inline `SetRowEditor` (BL-06) | U (limits, prefill); R; S (prefilled row recorded with one tap) | ✅ |
| FW-03 | Form asks only for fields of the exercise type | `SetRowEditor` per type; server re-validates | U; R (plank stores seconds, ignores weight); S (seconds-only warm-up row) | ✅ |
| FW-04 | Previous performance or "No previous record"; reflects edits/deletes | `previousPerformance`, `EntryCard` | R (edit/delete changes it); S ("Last time · Nov 5") | ✅ |
| FW-05 | Correct/remove set or entry with confirmation and immediate undo; renumber | `deleteSet/deleteEntry/undo`, `useEntryActions` | R (renumber, undo, expiry after another mutation) | 🟡 UI path not exercised in simulator |
| FW-06 | Finish summary: date, duration, exercises, sets, volume; dropped empty entries reported | `finishWorkout`, `workout/summary.tsx` | R; S (summary with planned vs completed, volume + lb equivalent, preparation separate) | ✅ |
| FW-07 | Survive app close/restart; offer resume or discard | Atomic SQLite writes; Train tab resume card | R (reopen DB file); S (force-quit → "Unfinished workout · Resume/Discard", set intact) | ✅ |
| FW-08 | Earlier date, no future dates; appears on that date | `validateWorkoutDate`, date picker `maximumDate`, `backdated` flag | R (future rejected; date kept; no duration) ; B (server rejects future dates) | ✅ |
| FW-09 | Offline logging, waiting/uploaded status, automatic upload | Outbox + `SyncCoordinator` (foreground, reconnect, post-edit, manual) | R (squash, retry same op id, rebase); B (offline→upload, other device pulls); S (cloud account showed Uploaded; refused change surfaced as Needs attention) | ✅ |
| FW-10 | Choose kg/lb at first use, change later; converts past displays | `onboarding.tsx`, Settings; stored values never rewritten | U; S (onboarding shown for new account/profile) | ✅ |
| FW-11 | Search by partial name, case-insensitive, muscle filter, last 10 recent first, no match → create | `searchExercises`, `ExerciseBrowser` | R | 🟡 search UI not exercised in simulator |
| FW-12 | Custom exercise: name 1–60, unique ignoring case/spaces (incl. catalog), owner-only | `createExercise`; server `_apply_exercise` + unique index + RLS | R; B (custom exercise uploaded and pulled) | ✅ |
| FW-13 | Rename (applies to history), archive/restore, type locked once used, used not deletable | `updateExercise/setArchived/deleteExercise`, `exercises/[id].tsx`; server `type_locked` | R | ✅ (UI not exercised) |
| FW-14 | Finished workouts list: date, ≤3 names "and N more", set count, own only, paging, empty state | `historyPage` (keyset on date,id), `(tabs)/history.tsx` | R (25 rows across 3 pages, no gaps); B (isolation); S (list) | ✅ |
| FW-15 | Open past workout: exercises in order, sets in user unit, date, duration, volume | `workout/[id].tsx` | S (Nov 2 lb session shows "170 lb (77.1 kg)", total converted) | ✅ |
| FW-16 | One exercise's history, newest first, from library and entry; archived viewable | `exerciseHistory`, `exercises/[id].tsx` | R (data); menu link wired | 🟡 UI not exercised |
| FW-17 | Edit finished workout (values, sets, entries, date); cannot edit to zero sets | Edit mode in `workout/[id].tsx`; `assertNotLastWorkingSet` | R; B (server rejects finished workout without completed set) | ✅ (UI edit not exercised) |
| FW-18 | Delete finished workout after confirmation naming date and set count | `deleteWorkout` (tombstone), Alert text | R (gone from previous performance); B (tombstone propagates to another device) | ✅ |
| FW-19 | Filter history by date range and/or exercise; clear; no-match message | `historyPage(filter)`, filter card | R | 🟡 UI not exercised |
| FW-20 | Per-exercise volume graph, one point per workout, axes with units/dates, <2 workouts message | `exerciseSeries`, `ProgressChart` line | U (points, warm-up/skips excluded, mixed units) | 🟡 line chart not opened in simulator |
| FW-21 | Choose period (4 wk / 12 wk / 1 yr / all) updating graph and text | `periodStart`, segmented control | U; S (12-week view) | ✅ |
| FW-22 | Weekly volume across weighted exercises, zero weeks, sentence comparing last two weeks | `weeklyVolume`, `weeklyComparisonSentence` | U (zero fill, agreement with per-exercise sum, no divide-by-zero); R (demo agreement); S | ✅ |
| FW-23 | Reps-only exercises graph total reps | `exerciseSeries` reps path | U | ✅ (UI not opened) |
| FW-24 | Select point → value and open workout; weekly point lists its workouts | Chart point + `ValueTable` → `/workout/[id]`, `/week/[start]` | Code path only | 🟡 not exercised |
| FW-25 | Save finished workout as named template, order kept, no sets (actuals only by choice) | `routineDraftFromWorkout`, `routine/[id]?fromWorkout` | R | ✅ (UI not exercised) |
| FW-26 | Start from template: exercises in order, archived marked/skippable, template unchanged | `startWorkout({routineId, skipExerciseIds})`, start screen | R; S (Upper A started with snapshot targets) | ✅ |
| FW-27 | Create/edit template: name, add via search, reorder, remove; finished workouts unchanged | `routine/[id].tsx`, `saveRoutine` | R (edits don't alter snapshots; duplicate name rejected) | ✅ (editor UI not exercised) |
| FW-28 | Delete template with confirmation naming it; workouts unchanged | `deleteRoutine` | R | ✅ |
| FW-29 | Text size up to 200 %, remembered, screens usable | `textScale` setting (synced), `T` component, wrapping layouts | S (200 % workout detail and muscle map reflow; pill overflow found and fixed) | ✅ |
| FW-30 | Show equivalent in other unit ("60 kg (132.3 lb)"), toggle | `formatStoredWeight`, Settings toggle | U; S | ✅ |
| FW-31 | Enter set in either unit; defaults to account unit; limits in entered unit; explicit convert | Row unit button → "Convert" / "Keep number" choice | U (limits in entered unit) | 🟡 unit switch dialog not exercised |

## Planned training requirements

| ID | Requirement (abridged) | Implementation | Verification | Status |
| --- | --- | --- | --- | --- |
| TR-01 | Routines with ordered exercises, set count, rep/time targets, optional load+unit, RIR range, rest; invalid ranges rejected; plan snapshotted | `validateTargets`, `routine/[id].tsx`, `startWorkout` snapshot | U (4×12 RIR 1–3 accepted; inverted range rejected); R (4 pending rows; later edits don't change sessions); S (start screen targets) | ✅ |
| TR-02 | Target vs actual inputs, Mark done, pending/done/skipped, undo, extra sets, finish confirms pending→skipped | Inline rows, `skipSet/reopenSet/addSet`, finish dialog | R (11 reps vs 12 target, skip, undo, confirmation, skipped); S (record, confirmation, summary "1 of 13 planned") | ✅ |
| TR-03 | Rest after working set when another remains; pause/resume/+time/skip; one timer; cleared on undo/finish/discard | `RestService` (absolute deadline persisted in SQLite), `RestBar` | S (countdown, controls, survives force-quit, cleared on finish) | ✅ (pause/+30 taps not individually verified) |
| TR-04 | Optional warm-up (general + lighter lift sets); edit/complete/skip; zero working volume | `generalWarmup`, `rampSets`, phase `warmup` | U (warm-up adds zero); S (warm-up row completed; summary "Preparation 1 done, 3 skipped") | ✅ |
| TR-05 | Mobility by exercise/area, instructions, editable targets, pre/post blocks, substitute | `mobilityFor`, area chips, `replaceEntryExercise` | S (post-workout shoulder mobility added) | 🟡 substitute not exercised |
| TR-06 | Offline catalog with names, equipment, categories, instructions, primary/secondary muscles; custom tags; stable IDs | Pinned Free Exercise DB (876, SHA-256 verified), UUIDv5 IDs, upsert-by-ID seeding | R (search by name/muscle/equipment/category); B (catalog seeded server-side) | ✅ |
| TR-07 | Front/back body map, bands, legend, exact totals, accessible list, region drill-down; 4 bench sets → chest 4.0, shoulders/triceps 2.0 | `muscleActivity`, `BodyMap`, `profile/muscles.tsx` | U (exact example, warm-up/skip zero, primary precedence, unmapped); S (map shading, 7-day period, 200 %) | ✅ |
| TR-08 | Monthly report, in-progress month, equal elapsed days, milestones, empty state | `monthlyReport`, `profile/report.tsx` | U (equal-elapsed comparison, milestone) | ✅ (UI not opened) |
| TR-09 | Lift goal: exact exercise, load+unit, min reps, deadline; best qualifying set links to workout | `goalProgress`, `profile/goals.tsx` | U (225 lb × 5: 230 × 3 fails, 102.1 kg × 5 meets); R | ✅ (UI not opened) |
| TR-10 | Export last 30 days / custom / all; choose files; bodyweight opt-in; share sheet; UTF-8 CSV, escaping, formula protection, original units | `csv.ts`, `profile/export.tsx` (expo-file-system + expo-sharing) | U (escaping, formula protection, one row per completed set, targets vs actuals) | 🟡 share sheet not exercised |
| TR-11 | Optional bodyweight: date, positive weight, kg/lb, edit/delete, trend, target | `profile/bodyweight.tsx`, repository | R (validation, original unit kept, edit/delete) | ✅ (UI not opened) |
| TR-12 | Opt-in reminders: days, time, master switch, rotating messages; cancel today's after a workout; replace on change; denied permission still usable | `planReminders`, `reconcileReminders` (on open/foreground/finish/settings) | U (weekday/time/completed-day planning) | 🟡 OS delivery needs a device |
| TR-13 | Live Activity rest countdown on Lock Screen; tap opens workout; rest-end alert | `RestActivity` (`expo-widgets`, SwiftUI `Text(timerInterval:)`), scheduled local notification | Native build compiled and linked the `ExpoWidgetsTarget`; S (notification permission requested on first rest) | 🟡 Lock Screen needs a physical iPhone |

## Interface and supporting flows

| ID | Requirement | Implementation | Verification | Status |
| --- | --- | --- | --- | --- |
| UI-01 | Graphite canvas, charcoal surfaces, champagne accents, light text; icon, tabs, charts, status bar, keyboard, date picker | `ui/theme.ts`, dark `userInterfaceStyle`, `keyboardAppearance="dark"`, `themeVariant="dark"`, generated icon | S (all screenshots) | ✅ |
| UI-02 | Liquid Glass on enabled actions when supported; solid fallback incl. Reduce Transparency | `Button` secondary variant (`expo-glass-effect`, `isReduceTransparencyEnabled`) | S (glass buttons on iOS 26.5) | ✅ (Reduce Transparency not toggled) |
| UI-03 | Minimum touch targets, text scaling, chart value list | 44 pt minimums, `ValueTable` | S | ✅ |
| UI-04 | Premium iOS-native density: compact type scale, large titles, native tab bar, grouped rows, tabular figures, 44 pt targets | `ui/theme.ts` type scale, `ui/kit.tsx` (Group, ListItem, Stat), `ui/nav.ts` large-title headers, `(tabs)/_layout.tsx` `NativeTabs` (Liquid Glass) | S (Train shows date, status, in-progress card, week stats and three routines without scrolling; a workout card shows four set rows) | 🟡 (200 % text not re-checked after the redesign) |
| UI-05 | Responsiveness: scoped reloads, only when visible; upload acks do not redraw data screens; search never blocks typing | `ChangeScope` events in `repository.ts`, focus-gated `useLoad(loader, deps, watch)` in `state/session.tsx`, `useDeferredValue` search | R (scoped events; ack emits only `sync`; finished cache kept while logging); S (recording a set updates in under 0.6 s with 27 workouts loaded) | ✅ |
| TR-07A | Anatomical male/female front/back figure; synced, remembered choice; tap a muscle for its breakdown; bands, legend, list unchanged | `ui/BodyMap.tsx` (`react-native-body-highlighter`, MIT), `settings.body_figure` (SQLite v2 + migration `…000500`), Profile / Settings / Muscles switches | R (body figure round-trips through settings and snapshot); B (9/9 on local and hosted after `…000500`); S (female figure heat map with selected-region outline) | ✅ |
| TR-06A | "How to perform": start/end photo loop with pause, numbered steps, muscles on the figure; offline steps; cached photos with offline fallback; reachable from library, picker and workout menu | `ui/FormGuide.tsx`, `form/[id].tsx` modal, catalog `media` (pinned revision), `expo-image` disk cache, entry menu → How to perform | R (catalog media seeded); S (Bench Press: photos alternate and pause, steps listed, chest primary on male and female figures) | 🟡 (offline fallback is coded but was not exercised with the network off) |
| BL-06 | Inline set rows recorded with one check-mark, plan target kept | `EntryCard` compact set table (SET · PREVIOUS · KG · REPS · RIR · ✓) | S (round 2: row recorded, rest started, target kept) | ✅ |
| SUP-01 | Email/password auth, offline reopen of known owner, isolated partition, safe sign-out | `auth/auth.ts`, per-owner SQLite file, sign-out warning | B (owner isolation); S (account created, onboarding, sync) | ✅ (sign-out flow not exercised) |
| SUP-02 | Preserve both versions; explicit resolution; no silent overwrite | `preserveConflict`, `resolveConflict`, `sync.tsx` | R (keep_remote); B (copy_local keeps server version, uploads copy); S ("Keep on this device only" on a server-refused record) | ✅ |
| D-SEC | Default-deny RLS, no direct table writes, SECURITY DEFINER RPCs with fixed search_path and auth.uid() | `20261111000100_schema.sql`, `20261111000300_sync_rpc.sql` | B (cross-owner read empty; hijack rejected `forbidden`; direct insert refused; change feed unreadable) | ✅ |
| D-IDEMP | Same operation id + payload → original receipt; different payload rejected | `mutation_receipts` | B | ✅ |

## Defects found during validation (fixed)

1. Tabs rendered before the auth redirect → crash "Not signed in". Fixed by moving session routes into a guarded `(app)` group.
2. Demo data produced 63.75 kg loads (two decimals); the server correctly refused them. Fixed the generator and made the import path validate; added a backend test that uploads the full demo dataset.
3. Field captions showed "Reps,", long preparation instructions, status pill overflow at 200 %, and finish dialog counted preparation as "planned sets". All fixed.
