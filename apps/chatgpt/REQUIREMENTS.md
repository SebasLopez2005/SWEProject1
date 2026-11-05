# Requirements and verification

Baseline `9dc200da72010ef32dd43b7864c268d2bb058f28`. The [revised report](../../docs/part2/design/source/Fitness_Workout_Log_App_Revised_v2.docx), [31 stories](../../docs/part2/design/SELECTED_STORIES.md), and [42 diagrams](../../docs/part2/design/README.md) define the scope. See [ASSUMPTIONS.md](ASSUMPTIONS.md) for interpretation.

The four personas are experienced lifter (Marcus), beginner lifter (Priya), home trainer (Elena), and returning lifter (Tomás). Each has the same account permissions and can access only their own mutable data. Authenticated accounts share a read-only starter catalog. The instructor is a demo or beta tester.

**V** means implemented and verified at the named test level. **U** means implemented with the listed acceptance check still unverified. **B** means blocked by external setup or authorization. Domain checks and local API integration do not establish native UI or production deployment behavior.

| ID | Acceptance and implementation | Status and evidence |
| --- | --- | --- |
| FW-01 | Start on today's date, add ordered library entries, and disallow finishing with zero sets. Workout dashboard and editor. | V · Native start/add flow, SQLite active uniqueness and domain rejection of empty finish. |
| FW-02 | Prefill from the latest entry set or the latest matching finished session. Retain valid 0–999.9 weight and whole 1–999 reps. Set editor. | V · Domain bounds and SQLite rollback/reopen. Native smoke test verified prefill and recorded the set. |
| FW-03 | Weighted, reps-only, or seconds controls and exclusive stored fields. Set editor and RPC. | V · Domain typed validation and real RPC rollback. |
| FW-04 | Previous date and sets or an empty message. Current account only, with updates after corrections. Workout editor and history queries. | V · Previous-session query checks and actual API account isolation. |
| FW-05 | Edit or confirm removal of sets and entries, renumber, and allow immediate undo. Workout editor. | U · Archive restore and ordered snapshots verified through the API. Native confirmation and immediate undo still need a walkthrough. |
| FW-06 | Finish with at least one set, drop empty entries, explain the removal, and show date, duration, exercise/set count and volume. Workout editor/summary. | V · Domain finish rules and SQLite/remote completed records. Empty-entry notice needs a native walkthrough. |
| FW-07 | Reopen an unfinished workout and resume or explicitly discard. SQLite and Workout dashboard. | V · Database closed/reopened with confirmed set and outbox intact. Native app force-close, relaunch and exact set resume passed. |
| FW-08 | Earlier date selection, no future dates, and preserved dates in history/graphs. Native date field and domain. | V · Calendar validation and bucketing verified. Native date picker interaction still needs a walkthrough. |
| FW-09 | Local logging, catalog and templates with a durable queue, explicit status, and automatic upload when reachable. SQLite, sync coordinator and Supabase RPC. | V · Real local Supabase Auth, replay after lost response, rollback, conflict, RLS, and replica reconciliation. Native local-API stop/restart passed with waiting and uploaded status. Hosted and physical-device airplane-mode checks are unverified. |
| FW-10 | First-use choice and later kg/lb switch without changing entered weights. Welcome and Settings. | V · Conversion, round trip, and persistent settings through SQLite and Supabase. |
| FW-11 | Bundled gym and home catalog, substring/muscle search, recent items, and custom fallback. Exercise picker and library. | V · Domain search, archive exclusion, and use of the same stable seed IDs in SQL and SQLite. |
| FW-12 | Valid custom name, whitespace/case uniqueness, private ownership, type locked once used. Exercise form, repository and RPC. | V · SQLite and authenticated PostgREST checks include duplicate, type lock and foreign reference rejection. |
| FW-13 | Rename with stable history and archive/restore without losing sets. Exercise detail. | V · SQLite rename preserves references, archive removes picker results, and API preserves archived template entries. Native archive/restore sequence unverified. |
| FW-14 | Private paged history shows date, up to three names and a set count. History tab. | V · Local date ordering and actual account isolation. Native scrolling beyond the first 20 rows unverified. |
| FW-15 | Workout detail shows ordered exercises, sets, date, duration when available, and converted volume. Workout summary. | V · Domain totals and remote set projection. |
| FW-16 | Exercise history from library or workout, newest first, including archived records. Exercise detail. | V · Domain queries and archive reference retention. Both native navigation entry points unverified. |
| FW-17 | Correct date, entries and set fields with validation. Keep at least one set. Workout correction draft and atomic save. | V · Empty correction rejected. Real Supabase date correction, validation rollback and two-device conflict copy verified. |
| FW-18 | Confirm removal with date and set count, then remove from current history and propagate tombstone. Workout summary. | V · Real Supabase tombstone removed the original from the peer and preserved its independent copy. Native confirmation unverified. |
| FW-19 | Inclusive dates and exercise compose, clear, and show invalid/no matches states. History filter. | V · Domain combined filtering checked. Native filter/reset interactions unverified. |
| FW-20 | One weighted volume point per workout. Date/unit axes and a sparse-data message. Progress tab. | V · Date and mixed-unit graph calculations checked. Native weekly chart, value table and workout drill-down passed. Exercise chart and sparse-state walkthrough pending. |
| FW-21 | 4 weeks, 12 weeks, 1 year and all time update graph and text. Progress tab. | U · Finite window and all-time empty behavior tested in domain. Switching every preset in native UI unverified. |
| FW-22 | Monday weekly buckets include zeros and comparison copy. Progress tab. | V · Mixed-unit totals, Monday dates, zero gaps, partial weeks and contributor IDs verified. |
| FW-23 | Reps-only chart sums reps and labels its axis Total reps. Timed exercises have no graph. Progress tab. | V · Reps-only and timed calculations checked. Native chart label walkthrough pending. |
| FW-24 | A chart point or text row shows its value and contributing workout links. Progress drill-down. | V · Graph identity checks and native weekly value-to-workout drill-down passed. |
| FW-25 | Save completed workout as a uniquely named list of ordered exercise IDs with no sets. Summary and template editor. | V · SQLite exercise-only template and source workout independence checked. Native creation from summary unverified. |
| FW-26 | Start from a template without copied sets, warn for archived items, and allow skipping. Template detail and workout editor. | V · Real Supabase starts an archived template, persists skip/restore, and retains the template independently. Native template start unverified. |
| FW-27 | Create/rename/reorder/remove template exercises via library search. Template editor. | U · SQLite persistence, duplicate-name boundary and independent template shape implemented. Native reorder/remove not yet exercised. |
| FW-28 | Confirm deletion naming the template, without deleting workouts. Template detail and RPC tombstone. | V · SQLite and live API confirm template removal leaves workouts intact. Native confirmation unverified. |
| FW-29 | 100–200% text settings persist, wrap and scroll, with screen-reader labels and chart table. Settings and shared components. | V · Persistence verified on two real local sessions. Native Settings at 200%, scrolling back to 100%, and screenshot review passed. Full-screen and VoiceOver audits remain unverified. |
| FW-30 | Optional equivalent weights beside primary values in sets and previous performance. Shared formatter. | V · Exact reported display examples and toggle state persistence. |
| FW-31 | Preferred unit on new weighted form. Explicit switch converts input, validates in chosen unit, and stores that unit. Set editor. | V · Unit-specific bounds, normalized database rows and native kg-to-lb form switching verified. |

## Diagram-only and quality checks

| ID | Requirement and evidence |
| --- | --- |
| SUP-01 | Supabase email/password, SecureStore, owner-specific SQLite files, first-use preferences and offline restore. Auth and RLS verified against two local accounts. Native local account registration passed. Hosted email confirmation and expired-token recovery on device are unverified. Sign-out prompts before discarding pending local changes. |
| SUP-02 | Atomic local mutation/outbox, versioned immutable payloads, receipts, per-account ordered feed, conflicts and explicit review. Real API retries, stale revisions, tombstones, conflicting active workouts and copy resolution passed. Native conflict UI walkthrough unverified. |
| DER-01 | Separate route, domain, presentation, repository, auth and sync responsibilities. Expo Router and SQLite are app runtime. Supabase projections, RLS and RPC protect cloud records. TypeScript, Expo Doctor, migration and local API checks passed. |
| DER-02 | Seed data and reproducible development, including no-credential demo, local Auth/RPC and EAS profiles. Demo status stays local. Hosted distribution is **B** pending a team Supabase project, EAS project, Apple signing and authorization to submit. |
| NFR-01, 05 | Durable SQLite reopen, rollback, no duplicate receipt, automatic retries and reconciliation. iOS simulator passed process restart and a real local API outage with eventual upload. Full physical-device offline acceptance is unverified. |
| NFR-02, 03 | Two action taps for prefilled recording. Buttons and chips have minimum 44-point touch targets. Chart table provides full-sized alternatives to small visual markers. Main palette uses high-contrast foregrounds. Full VoiceOver/touch audit is unverified. |
| NFR-04, 07 | Performance targets are proposals. No timing benchmark is claimed. iOS simulator is the exercised target. Physical iPhone and Android device checks remain unverified. |
| NFR-08, 09, 10, 11, 13, 15 | Domain and API tests cover original weight/unit retention, stable IDs, consistent previous/volume reads, graph source and units, template independence, and one-decimal conversion. |
| NFR-12, 14 | Accessible text rows, labels, and 100–200% reflow. Settings screenshots at 200% were inspected and the native test returned to 100%. Full review across screens, 360-point widths and VoiceOver remains unverified. Tab captions use a fixed size and retain accessible names. NFR-06 was withdrawn in the revised report. |

## Checks and known limits

- The repository design checker passed all 31 stories, 42 diagrams, and 41 archived files. This is design integrity evidence.
- A clean `npm ci`, TypeScript, Expo dependency check, Expo Doctor (20/20), and iOS production JavaScript export passed.
- Seven Node tests passed with a local Supabase stack, including Auth, PostgREST, RLS and RPC integration. Migrations were applied to a clean local database.
- npm audit reported five moderate findings in Expo CLI/fingerprint dependencies and zero high or critical findings on SDK 58.
- Hosted Supabase, external TestFlight installation, and the independent Claude output were outside this implementation run. This run does not establish a paired generation comparison.

## Native evidence

Xcode 26.6 and the iPhone 17 Pro iOS 26.5 simulator were used.

- The demo XCTest passed onboarding, exercise search, weighted prefill, kg/lb form switching, durable save, force-close/reopen/resume, finish summary, weekly progress, text-row drill-down, and 200%/100% settings.
- The cloud XCTest passed registration with disposable local Supabase Auth, a reps-only workout while the local API gateway was stopped, waiting status, and automatic uploaded status after gateway restart.
- UI review covered welcome, set entry, finished summary, weekly chart and enlarged Settings screenshots. Full VoiceOver, all destructive confirmations, 360-point layouts and the entire template editing journey still need native walkthroughs.
- Early native test failures exposed decorative icon labels, secure password autofill resetting typed input, and the SDK 58 router development overlay. Controls have explicit labels, manual password entry uses autofill-off fields, and the scoped overlay workaround is recorded in ASSUMPTIONS.md. API outage tests recovered and reran after these changes.
