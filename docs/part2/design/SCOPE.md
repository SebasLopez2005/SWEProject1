# Selected scope and design decisions

Updated November 4, 2026. Revised requirements baseline; initial PR stack merged. This document records selected requirements and proposed design decisions.

The November 4 scope below is the historical baseline. The [planned training draft](TRAINING_REQUIREMENTS_DRAFT.md) records requested changes to routines, rest, analytics and bodyweight. Review that draft before freezing another generation.

## Selected product

The user explicitly selected **Claude gym scope + Supabase**. The authoritative requirements input is now [the revised report with professor feedback](source/Fitness_Workout_Log_App_Revised_v2.docx), adopted November 4, 2026. It supersedes [the earlier reviewed final](../../part1/final/07_Final_Reviewed_Claude_Product_Definition.docx) for this design. Older Claude drafts and the 12-story ChatGPT alternative do not define the selected scope. Working app name: **Fitness & Workout Log**. Its four proto-personas are the experienced lifter, beginner lifter, home trainer and returning lifter. The [v3 report](source/Fitness_Workout_Log_App_Revised_v3.docx), added November 11, 2026 after professor feedback, identifies them by role and description only; v2 used persona names. Stories, IDs and points are unchanged. All **31 stories / 101 initial story points** remain in design scope; the points are historical estimates, not a release commitment.

The problem is reliable, quick workout recording with consistent exercise identities, previous performance and understandable progress. Marcus needs efficient repeat routines; Priya needs approachable entry and previous sets; Elena needs offline logging and three exercise types; Tomás needs readable summaries and kg/lb conversion. The design includes logging, finish/resume, backdating, offline synchronization, exercise search/customization, history/correction, graphs, templates and settings.

Nutrition, coaching, generated training plans, wearables, social features, payments, rest timers and bodyweight measurement are outside scope. Timed exercises are recorded in seconds but are not graphed. Templates contain exercise lists only, never sets or prescribed loads.

## Technology decisions

| Decision | Basis and consequence |
| --- | --- |
| Expo + React Native + TypeScript, with Expo Router | User selected Expo and a mobile-first app. Routes and controller logic are separate. Compatible package versions are chosen and locked during generation. |
| Supabase Auth + Data API + PostgreSQL | User approved Supabase. Hosted auth and data services supply the backend; an extra Express server is unnecessary. PostgreSQL RPC functions enforce aggregate writes atomically. |
| Local SQLite as the runtime data source | Required by FW-07/FW-09. Every confirmed change is committed locally with an outbox operation before UI confirmation. No network round trip is needed to record a set. |
| Local-first repositories and explicit synchronization | Reads, summaries and graphs reflect local edits immediately. Reconnection and foreground events trigger sync. Conflicts preserve both versions rather than silently overwriting data. |
| iOS TestFlight, Android-compatible source | User selected TestFlight. Android remains in the selected specification, although only iOS distribution is requested. Device validation is reported honestly. |
| Two separate generation outputs | Both models implement the same Claude-defined scope; this compares coding models rather than changing product requirements between them. |

## Clarifications of open assumptions

These are proposed resolutions for the team to review before freezing v1. Their behavior is also present in diagram notes so it reaches the code generators.

- Sign-in uses email/password. First sign-in and account registration require a connection. A previously authenticated account can reopen its local data offline. Server authorization always checks the signed-in owner; cached access is not a bypass of cloud authorization.
- One active workout per account is the intended rule. Locally this is enforced immediately; competing offline devices can create a conflict when syncing. Both records are preserved for an explicit resolution.
- Offline operations use client-generated UUIDs, durable outbox records, operation receipts and optimistic server revisions. A conflict blocks only that aggregate's later operations; other independent records may sync.
- The app must be opened or active for automatic sync attempts. Background upload while iOS has suspended/terminated the app is not promised. Pending data remains saved until the next opportunity.
- Calendar workout dates are stored as `YYYY-MM-DD`, independent of UTC timestamps for creation/sync. Future dates are rejected on the device; the server also checks against the submitting device's declared timezone. Weeks start Monday. Changing device timezone does not shift saved workout dates.
- Weight is stored as the exact entered decimal and unit. Convert using the selected source's factor **1 kg = 2.20462 lb**. Aggregate unrounded converted values, then round only the displayed result to one decimal. Weight-based, reps-only and seconds-based sets remain distinct.
- The period options are 4 weeks, 12 weeks, 1 year and all time; these refine the source's '4 weeks to all time'. The finite windows include today. Weekly buckets use Monday dates and zero-fill missing weeks. If the previous week is zero, show the absolute difference rather than divide by zero. Partial weeks are labelled.
- Archived exercises keep stable identities and remain readable in old workouts/templates. Templates mark archived entries and offer skipping them; newly selected exercises must be active. A used custom exercise cannot change type. Custom names are compared ignoring case and spaces (revised A-EX-2), including against the shared seed catalog.
- Delete confirmation and immediate undo apply to in-progress sets/entries (FW-05). Undo restores a snapshot through another atomic mutation. Finished workout deletion is confirmed and has no user-facing undo, although sync needs a tombstone.
- Numeric capacity/speed proposals in the old Claude document are not release guarantees. High-level usability, readability, privacy, integrity, reliability and responsiveness govern this design. Functional text enlargement to 200% and the unit conversion rules remain explicit story behavior. Source-proposed form bounds are initially retained as validation choices, not scale promises.

## High-level quality expectations

Use clear labels, readable layouts, screen-reader labels and non-color explanations. Keep records private to their owner. Acknowledge recording only after durable local persistence; explain storage failures and upload status separately. History, previous performance, graphs and summaries must use the same current records. No recipe count, database capacity, concurrent-user count, response-time SLA or measured performance claim is introduced.

## Freeze boundary

Before the first generation, review the diagrams, resolve material disagreements and merge their PR. A wording change to a companion note must not become a hidden way to change the specification after that freeze: update the relevant diagrams and track the PR. Do not hand-patch generated app code to improve the assessed result.
