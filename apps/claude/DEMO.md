# Repwise demo walkthrough (about 10 minutes)

Professor-facing script covering the major stories. Story IDs are in brackets. Every screen also works with system text size enlarged.

## 0. Get in

- **TestFlight / no backend:** tap **Continue on this device only**. Nothing is uploaded; this is labelled on every status pill.
- **With cloud (local Supabase or a hosted project):** create an account (any email + 8-character password). Use a second account to check isolation.
- First launch asks **kg or lb** [FW-10]. Choose kg.
- Profile → Settings → **Load demo data**. Adds 3 routines, ~27 finished workouts over 9 weeks (one hotel-gym session logged in lb), 2 lift goals, weekly bodyweight readings.

## 1. Planned training (Marcus — experienced lifter)

1. Train → **Upper A** → start screen shows targets (4 × 8 reps · 70 kg · RIR 1–3) [TR-01, FW-26]. Toggle **General warm-up**, **Ramp-up sets** and **Mobility after → Shoulders** [TR-04, TR-05]. Start.
2. Warm-up rows: mark one done, skip one with the row's number menu [TR-04]. Note "Counts as preparation: no working volume".
3. Bench row 1: the fields are prefilled from last time; change reps to **7**, add RIR **2**, tap ✓ [FW-02, TR-02, BL-06]. "Target: 70 kg … 8 reps" stays unchanged. A rest countdown starts [TR-03]: pause, +30, resume, skip.
4. Tap the **kg** button on a row → choose **Convert** (shows lb) [FW-31]. Rows display "60 kg (132.3 lb)" [FW-30].
5. Row menu → **Delete set** → confirm → **Undo** [FW-05]. Numbers renumber.
6. Entry ⋯ → **How to perform**: the start/end photos alternate (pause button), numbered steps, muscles worked on the figure [TR-06A]. Then entry ⋯ → **Exercise history** [FW-16]; back. Note "Last time · date" line [FW-04].
7. **Finish workout** → "N planned sets will be saved as skipped" → confirm [TR-02]. Summary shows date, duration, exercises, sets x of y planned, volume with equivalent, preparation counted separately [FW-06]. **Save as routine** → toggle "use results as targets" → Save [FW-25].

## 2. Interruptions and offline (Elena — home trainer)

1. Train → **Start empty workout** → **Add exercise** → search `push` (case-insensitive, matches anywhere, recent first) [FW-11]. Pick Pushups — the form asks reps only [FW-03]. Add **Plank** — seconds only.
2. Search `towel row` → no match → **Create "towel row"** → type *Reps only*, tag Lats [FW-12, TR-06].
3. Record a set, then **force-quit** the app (swipe up) and reopen. Train shows **Unfinished workout · Resume / Discard** with the set intact [FW-07].
4. (Cloud account) Turn on Airplane Mode, record and finish: status shows **Waiting to upload**; turn it off and reopen → **Uploaded** [FW-09]. Settings → Sync status shows counts and conflicts.
5. Train → **Log an earlier workout** → future dates are greyed out; pick 3 days ago [FW-08]. It appears in History on that date with "Duration: Not recorded".

## 3. History and corrections (Priya — beginner)

1. History: rows show date, up to three names "and N more", set count, upload state; scroll loads older [FW-14]. **Filter** by date range and/or exercise; clear; no-match message [FW-19].
2. Open a workout [FW-15] → **Edit** → change a weight, add a set, change the date; try deleting the last set → refused with "delete the workout instead" [FW-17].
3. **Delete workout** → confirmation names the date and set count → gone from History, graphs and previous performance [FW-18].
4. Library: open your custom exercise → **Rename** (history updates) → **Archive** (hidden from search, history kept) → **Restore** [FW-13]. Type is locked once used.

## 4. Progress (Tomás — returning lifter)

1. Progress → **Weekly volume**: one bar per Monday week, zero weeks included, sentence comparing the last two weeks [FW-22]. Period: 4 weeks / 12 weeks / 1 year / All time [FW-21]. Tap a bar → "List this week's workouts" [FW-24].
2. **One exercise** → Bench Press: line of volume per workout with axis units and dates [FW-20]; tap a point → **Open the workout** [FW-24]. Pushups shows "Total reps per workout" [FW-23]; Plank says timed exercises are not graphed. The value list under each chart is the accessible alternative.
3. Profile → **Muscle activity**: anatomical front/back figure, legend, exact list; tap Chest to see contributing exercises and sets with workout links [TR-07]. Switch **Male / Female**; the choice is remembered and synced [TR-07A].
4. **Monthly report**: current month "in progress" compared over equal elapsed days, milestones [TR-08].
5. **Lift goals**: Bench 225 lb × 5 shows best qualifying set and opens it [TR-09].
6. **Bodyweight**: log a reading in lb; trend shows in kg; edit/delete [TR-11].
7. **Export my data**: last 30 days default; choose files; bodyweight only when switched on; **Create files** → **Share** each CSV via the share sheet [TR-10].
8. Settings → **Text size 200 %** — revisit the workout and History: content wraps, nothing is cut off [FW-29]. Toggle **Show the other unit** [FW-30]; switch to **lb** — past weights display converted, stored values unchanged [FW-10].
9. Settings → **Workout reminders** → pick days and time; finishing a workout that day cancels that day's reminder [TR-12].

## 5. Lock Screen (physical iPhone)

Start a rest, lock the phone: the Live Activity counts down on the Lock Screen and Dynamic Island; tapping it opens the workout; the rest-end alert fires if notifications are allowed [TR-13]. (The simulator shows the in-app countdown; Live Activity rendering needs a device.)

## 6. Two accounts / two devices (cloud only)

- Account B cannot see account A's workouts (server RLS + owner checks) [owner isolation].
- Edit the same finished workout on two devices offline; sync both: the second shows **Needs attention** with both versions; choose **Keep both** [SUP-02].
