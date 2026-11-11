# Claude One Shot 1 — Repwise

- **Date:** November 11, 2026. Single autonomous Claude Code session (Claude Opus 5.5, model id `claude-opus-5-5`).
- **Input:** the student's one-shot brief, the design docs and all Mermaid diagrams in `docs/part2/design`, and the planned-training draft. `apps/chatgpt` was not opened.
- **Output:** [apps/claude](../../../../../apps/claude/README.md), branch `claude/repwise`.
- **Stack:** Expo SDK 58, React Native 0.88, TypeScript, Expo Router, expo-sqlite, Supabase (local CLI 3.1.0 stack `repwise-claude`), `expo-widgets` Live Activity.
- **Coverage and evidence:** [REQUIREMENTS.md](../../../../../apps/claude/REQUIREMENTS.md). 41 local tests and 9 backend integration tests passed; a native simulator build on iPhone 17 Pro (iOS 26.5) was exercised by hand.
- **Found and fixed during the session:** a route-guard crash before sign-in redirect; demo weights with two decimals that the server rejected; label, 200 % layout and finish-count wording issues.
- **Release status:** EAS project `@swiftlycrdev/repwise-claude` created. The first iOS build waits on an interactive Apple Developer sign-in to create provisioning profiles for the app and its widget extension. A hosted Supabase project was not created because the organization owner is at the free-plan limit of two active projects.
