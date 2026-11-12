# Professor walkthrough

## Five-minute simulator demo

1. Tap **Open demo journal**. Open **Routines**, then start **Upper body**. The preview includes a bench warm-up, four planned working sets of 12, push-ups, and a cooldown. Keep today's date or choose an earlier date.
2. In the working bench block, tap **Enter actuals**. Change the suggested reps from 12 to 11, enter actual RIR 2, and tap **Mark done**. The target stays at 12. Pause the rest timer, add 15 seconds, then resume.
3. Force-close and relaunch the development client. Open the demo again and tap **Resume workout**. The completed set is still present. Use **Set options** to skip a row or undo completion. Finish and confirm that remaining pending rows will be skipped.
4. Open **History**, choose the new session, and use **Edit workout** to correct the set. Open its exercise to see previous performance. In **Progress**, pick a period and tap an exact chart value to drill into the underlying session or week.
5. Open **Profile**. Select a region in **Muscle activity**, open a lift highlight in **Monthly report**, then inspect the seeded **Lift goals**. Open **Export my data** and share a CSV to Files if desired. Bodyweight is a separate opt-in export.
6. In **Settings**, switch from kg to lb and increase text size. The original entered load stays with the set. Under **Exercise library**, search by a muscle or equipment, then create, rename, archive, and restore a custom exercise.

## Personas and ownership

Experienced lifters can reuse plans. Beginners can consult previous performance and movement instructions. Home trainers can use reps-only and timed sets offline. Returning lifters can enlarge text and show both weight units. These personas all use the same owner permissions.

With the local Supabase stack running, create accounts A and B. As A, start a workout and log a set while the API is unreachable. Reconnect and use **Profile → Settings → Retry sync** if needed. Wait until the queue is empty. Sign out, sign in as B, and confirm A's workout is absent. Return to A and verify it is present. Use disposable classroom data for this exercise.
