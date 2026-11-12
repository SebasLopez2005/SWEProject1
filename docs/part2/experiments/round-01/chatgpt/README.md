# One Shot 1 · ChatGPT

**November 4, 2026 · Merged to `main` in PR #46.** The first run built Fitness & Workout Log from an empty app directory. The input was the student's brief and the frozen design at `9dc200da72010ef32dd43b7864c268d2bb058f28`, which covered 31 workout stories and 42 Mermaid diagrams. The generated app was saved as commit `86b9c83` and merged as `492476f`. Codex desktop reported the GPT-6 family. The exact model variant and settings were unavailable. [Student brief](USER_BRIEF.txt) · [Merged PR #46](https://github.com/SebasLopez2005/SWEProject1/pull/46)

## What changed

- **Workout logging.** Start or backdate a session, choose exercises, and log weighted, reps-only, or timed sets. Previous performance and prefilled values speed up entry. Finish a workout for a summary, or resume an unfinished one after relaunch.
- **History and progress.** Filter and correct finished workouts, review individual exercise history, and open the workouts behind chart values. Weighted volume uses load × reps. The app preserves the original weight and unit and can display kg or lb.
- **Exercises and templates.** Search a starter catalog for gym and home exercises, maintain private custom exercises, and save ordered exercise lists as templates. Templates carry exercise order and identity. Lifters enter each set during the workout.
- **Offline use and accounts.** Expo Router and React Native provide the interface. SQLite saves workouts on-device, and a durable queue uploads account changes to Supabase when the connection returns. A classroom demo can run locally without credentials. [App setup](../../../../../apps/chatgpt/README.md) · [Implementation decisions at the merged revision](https://github.com/SebasLopez2005/SWEProject1/blob/492476f9d584dcbc64a35432c7fe2a6fc2b094f7/apps/chatgpt/ASSUMPTIONS.md)

## What was verified

Seven Node tests passed with local Supabase, including Auth, access isolation, retries, and conflict handling. TypeScript, Expo Doctor (20/20), and the iOS production JavaScript export also passed. On an iPhone 17 Pro simulator running iOS 26.5, one XCTest covered set entry, force-close and resume, the finished summary, chart drill-down, and 200% text. A separate XCTest saved a workout during a local API outage and verified automatic upload after the gateway restarted. [Story-by-story evidence at the merged revision](https://github.com/SebasLopez2005/SWEProject1/blob/492476f9d584dcbc64a35432c7fe2a6fc2b094f7/apps/chatgpt/REQUIREMENTS.md)

At the end of the run, physical-device and full VoiceOver testing, hosted Supabase and TestFlight distribution, and an independent Claude comparison remained open.

[Next · One Shot 2](../../round-02/chatgpt/README.md)
