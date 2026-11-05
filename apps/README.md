# Generated applications

No app code yet. The initial design stack is merged. Record its final baseline commit, then generate independent apps under `apps/chatgpt/` and `apps/claude/`. Each model receives the same design revision and prompt, without the other model's implementation.

Each output should own its Expo package, lockfile, EAS config, example environment file, Supabase migrations and generated tests. Keep Supabase schema, auth and seed data isolated per model/round so one run cannot change the other run's results. Generation snapshots and commit IDs are recorded in `docs/part2/experiments/`.
