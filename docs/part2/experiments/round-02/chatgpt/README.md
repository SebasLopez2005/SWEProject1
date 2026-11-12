# One Shot 2 · ChatGPT

**November 8, 2026 · Interface revision of the original app.** The student asked for native Liquid Glass buttons and a darker, more premium look. The work revised the existing Expo app in `apps/chatgpt` from the One Shot 1 merge `492476f`. The revision is recorded under requirements UI-01–03. Codex desktop reported the GPT-6 family. The exact model variant and settings were unavailable. [Student brief](USER_BRIEF.txt) · [Interface requirements](../../../design/ROUND_02_UI.md)

## What changed from One Shot 1

| Area | One Shot 1 | One Shot 2 |
| --- | --- | --- |
| Color and layout | Light background, white cards, and green accents | Graphite background, charcoal cards, champagne accents, light text, and a new app icon |
| Action buttons | Solid buttons | Interactive native Liquid Glass for enabled actions on supported iOS builds. Solid controls are used when glass is unavailable or Reduce Transparency is enabled. Disabled and destructive actions have distinct styles. |
| Navigation and content | Standard tab styling and light system controls | Highlighted active tab, dark keyboard and iOS date picker, and a coordinated status bar, chart palette, and onboarding screen |
| Readability | Scalable content, accessible labels, and chart values available as text | Shared controls retain those features and their touch target sizes. Cards and inputs use solid surfaces. |

The changes were made in shared UI components and route styling. The existing workout, history, progress, exercise, template, settings, and onboarding routes still use the same workout and sync logic. [App setup](../../../../../apps/chatgpt/README.md)

## What was verified

TypeScript, Expo dependency checks, Expo Doctor (20/20), the iOS simulator build, iOS and Android JavaScript exports, and six local tests passed. The iPhone 17 Pro iOS 26.5 simulator test exercised the glass actions, set entry, force-close and resume, the finished summary, chart drill-down, and 200% text. Measured contrast for the sampled solid palette pairings ranged from 6.95:1 to 15.42:1. Glass contrast received a visual simulator review. [Run log](../../RUN_LOG.md#chatgpt-interface-revision-november-8-2026)

The local Supabase integration and native API-outage tests were skipped for this revision. The Android check covered the JavaScript export. Android device behavior, the older-iOS fallback, and the Reduce Transparency behavior still need native walkthroughs.

## Follow-up requirements and diagrams

Later on November 8, the student paused the next generation to define plan-first workouts. The design added routine prescriptions such as 4 × 12 at 1–3 reps in reserve, in-workout set completion, rest timers and iOS Lock Screen Live Activities, warm-up and mobility, a larger exercise catalog and muscle map, monthly reports, lift goals, CSV export, reminders, and optional bodyweight tracking. Those 13 requirements were mapped to seven sequence diagrams. [Training requirements](../../../design/TRAINING_REQUIREMENTS_DRAFT.md) · [Diagram traceability](../../../design/TRACEABILITY.md)

[Previous · One Shot 1](../../round-01/chatgpt/README.md)
