# Professor walkthrough

Open the app in development with the Supabase environment variables unset. Choose **Open classroom demo**, then **Kilograms (kg)**. The demo starts with six completed workouts, two exercise templates, and one used custom exercise. The four personas share the same permissions.

| Time | Persona and steps | Expected result |
| --- | --- | --- |
| 0:00–1:30 | **Marcus, experienced lifter.** In **Templates**, open **Leg Day** and start it. Record a Barbell Squat set using the prefilled weight and reps. Remove that set, confirm, and choose **Undo removal**. | The template supplies the exercise order. The form uses the latest saved squat set. Undo restores the original set. |
| 1:30–3:00 | **Priya, beginner.** Search for “row” under **Add exercise**. Read **Previous** above the set form. Finish with any unused exercise still present. In **History**, filter by exercise and open the finished workout. | Matching catalog items appear as you type. The previous date and sets are visible. The summary explains any empty entries dropped. |
| 3:00–4:30 | **Elena, home trainer.** Start **Home Basics**. Record push-ups and a plank. Force-close and reopen the app. Resume, finish, and save the exercise list as a new template. | The two forms request reps and seconds respectively. Confirmed sets survive reopening. The new template lists exercises in order. |
| 4:30–6:00 | **Tomás, returning lifter.** In **Settings**, select pounds, enable both units, and set text size to 200%. Open a past workout. Try entering a new weighted set in kilograms and check the summary. | The same records display in the selected unit with their equivalent. The entry retains its chosen unit. Content wraps and remains scrollable. |
| 6:00–7:30 | Open **Progress**, change the period, select a weekly chart value, and open a contributing workout. Select **Push-up** for a Total reps chart. Edit a completed workout and revisit the graph. | Graphs, values and drill-down use the same saved sets. The correction appears when the graph is reopened. |

## Live sync demonstration

Use the [local Supabase setup](README.md#local-supabase) and create two test accounts using local-only email addresses and passwords you choose. Use the same account on two simulators to demonstrate syncing. A second account on either simulator should start with an empty private history. The predefined catalog is shared.

After initial sign-in, stop the local API gateway with `docker stop supabase_kong_chatgpt` while leaving Metro and Postgres running. Record and finish a workout, then check its waiting status. Restart the gateway with `docker start supabase_kong_chatgpt`. Leave the app in the foreground and wait for it to report **Uploaded**. Open the same account on the second simulator to see the record. Keep classroom demo and cloud mode separate by restarting Metro when changing environment configuration.
