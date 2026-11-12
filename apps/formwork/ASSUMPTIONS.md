# Assumptions and scope decisions

- The November 8 planned-training draft and its seven new sequence diagrams take precedence where they extend the 31-story revised baseline. For example, exercise-only templates remain valid and a routine can also hold prescribed set targets. The earlier report's four personas share one lifter authorization role.
- The supplied design tree had working changes beyond Git HEAD `492476f9d584dcbc64a35432c7fe2a6fc2b094f7`. This run uses the visible design documents and revised source report as its input. Earlier generated app code, packages, assets, tests, and writable backend data were excluded.
- SQLite and PostgreSQL use JSON aggregates for ordered children and logical relationships. The RPC validates stable references and record shapes in the same transaction as revision and feed writes. This differs from the design's proposed physically normalized child tables.
- Catalog IDs use the pinned upstream IDs with a `catalog:` prefix. This fresh SQLite partition and backend do not import data from prior attempts. Logging type is derived from equipment, category, and common timed names. Users can create a custom movement if the catalog classification does not match how they record it.
- Reminder schedules cover a rolling 28-day window and renew on foreground. Alerts and Live Activities depend on OS support and permission. The in-app timer uses a saved deadline or saved paused duration.
- Lift goal deadlines are displayed as planning dates. A qualifying set uses its exact variant, minimum reps, and original load converted to the goal unit.
- Export offers one system share sheet per selected CSV file. Temporary files are removed after the share sheet returns.
- App settings allow text scaling up to 200%. iOS system font scaling also applies to ordinary text. The simulator was the available iOS device for this run.
