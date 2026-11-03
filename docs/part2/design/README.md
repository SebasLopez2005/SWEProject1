# Fitness & Workout Log - Mermaid design guide

**Draft v1, November 2, 2026.** Selected scope: Claude gym final, all 31 FW stories.
Proposed stack: Expo / React Native, local SQLite and Supabase. Intended iOS
distribution: TestFlight. This is design, not generated implementation evidence.

Review [scope](SCOPE.md), [contracts](CONTRACTS.md) and
[story coverage](TRACEABILITY.md) alongside these diagrams.

## Reading order

Start with context and architecture, then navigation/data, the five class-model
sheets and the story sequences. The two supporting sequences explain account
bootstrap and conflict resolution. Class sheets form one modular class model;
repeated names mean the same logical type. Every diagram has a description and
justification below. There are 42 Mermaid sources: 4 top-level, 5 class sheets,
31 story sequences and 2 supporting sequences.

The `.mmd` sources are authoritative. Run `python3 scripts/check_design.py --sync`
after editing them to update the mirrored Mermaid blocks below, then render.
GitHub can preview these blocks. Local SVG output is generated under `rendered/`
and ignored by Git; retain source/PR history as assignment evidence.

## Review before generation

- Confirm that all 31 stories match the selected Claude final.
- Review conflict handling, Monday weeks, offline account access and archive rules.
- Review screen flow and large-text behavior with both teammates.
- Confirm Apple Developer access and the instructor's acceptance of TestFlight.
- Merge the initial diagram PR before invoking either coding model.

No generation has run and no PR/deployment link has been fabricated. See the
[report](../REPORT.md) and [experiment protocol](../experiments/README.md).

## Diagram contents

- [Context and functional modules](diagrams/01-context.mmd)
- [Runtime architecture and distribution](diagrams/02-architecture.mmd)
- [Screen navigation](diagrams/03-navigation.mmd)
- [Persistent entity relationships](diagrams/04-data-model.mmd)
- [Class model: controllers and account access](diagrams/classes/01-ui-and-auth.mmd)
- [Class model: domain entities and services](diagrams/classes/02-domain.mmd)
- [Class model: repositories and backend handlers](diagrams/classes/03-persistence-and-sync.mmd)
- [Class model: conversion, progress and readability](diagrams/classes/04-presentation.mmd)
- [Class model: synchronization records](diagrams/classes/05-sync-records.mmd)
- [Supporting sequence: authentication and bootstrap](diagrams/sequence/SUP-01-auth-and-bootstrap.mmd)
- [Supporting sequence: reviewed conflict resolution](diagrams/sequence/SUP-02-conflict-resolution.mmd)
- [FW-01: Start a workout, add exercises](diagrams/sequence/FW-01.mmd)
- [FW-02: Record a set with prefill](diagrams/sequence/FW-02.mmd)
- [FW-03: Set form matches exercise type](diagrams/sequence/FW-03.mmd)
- [FW-04: See previous performance](diagrams/sequence/FW-04.mmd)
- [FW-05: Correct or remove a set or entry](diagrams/sequence/FW-05.mmd)
- [FW-06: Finish workout, see summary](diagrams/sequence/FW-06.mmd)
- [FW-07: Resume an unfinished workout](diagrams/sequence/FW-07.mmd)
- [FW-08: Record a workout on an earlier date](diagrams/sequence/FW-08.mmd)
- [FW-09: Log offline, upload later](diagrams/sequence/FW-09.mmd)
- [FW-10: Choose kg or lb](diagrams/sequence/FW-10.mmd)
- [FW-11: Find an exercise; recent first](diagrams/sequence/FW-11.mmd)
- [FW-12: Create a custom exercise](diagrams/sequence/FW-12.mmd)
- [FW-13: Rename or archive a custom exercise](diagrams/sequence/FW-13.mmd)
- [FW-14: List finished workouts](diagrams/sequence/FW-14.mmd)
- [FW-15: Open a past workout](diagrams/sequence/FW-15.mmd)
- [FW-16: History of one exercise](diagrams/sequence/FW-16.mmd)
- [FW-17: Edit a finished workout](diagrams/sequence/FW-17.mmd)
- [FW-18: Delete a finished workout](diagrams/sequence/FW-18.mmd)
- [FW-19: Filter history](diagrams/sequence/FW-19.mmd)
- [FW-20: Per-exercise volume graph](diagrams/sequence/FW-20.mmd)
- [FW-21: Choose the period](diagrams/sequence/FW-21.mmd)
- [FW-22: Overall weekly volume graph](diagrams/sequence/FW-22.mmd)
- [FW-23: Reps-only total reps graph](diagrams/sequence/FW-23.mmd)
- [FW-24: Select a point, open workout](diagrams/sequence/FW-24.mmd)
- [FW-25: Save workout as template](diagrams/sequence/FW-25.mmd)
- [FW-26: Start workout from template](diagrams/sequence/FW-26.mmd)
- [FW-27: Create and edit a template](diagrams/sequence/FW-27.mmd)
- [FW-28: Delete a template](diagrams/sequence/FW-28.mmd)
- [FW-29: Larger text size](diagrams/sequence/FW-29.mmd)
- [FW-30: See both units](diagrams/sequence/FW-30.mmd)
- [FW-31: Enter a set in either unit](diagrams/sequence/FW-31.mmd)

## Context and functional modules

Shows the four user situations, functional modules, account/data services and the mobile distribution boundary.

**Design value:** Makes product responsibilities explicit without confusing TestFlight with a runtime workout service.

[Edit Mermaid source](diagrams/01-context.mmd)

```mermaid
flowchart TB
    User["Marcus / Priya / Elena / Tomas"]
    subgraph System["Fitness and Workout Log - system boundary"]
      Log["Recording and resume"]
      Library["Exercise library"]
      History["History and correction"]
      Progress["Volume and reps progress"]
      Templates["Reusable exercise lists"]
      Settings["Units and readability"]
      Data["Local-first persistence and sync"]
      Identity["Account access"]
    end
    User --> Log & Library & History & Progress & Templates & Settings
    Log --> Library & Templates & Data
    History --> Data
    Progress --> Data
    Library --> Data
    Templates --> Data
    Settings --> Data
    Identity --> Data
    Identity --> Auth["Supabase Auth"]
    Data --> Cloud["Supabase hosted data services"]
    User --> Identity
    Instructor["Instructor / beta tester"] --> TF["TestFlight distribution"]
    TF -. "installs mobile app; no workout traffic" .-> System
```

## Runtime architecture and distribution

Separates device UI/controllers, local repositories/SQLite/outbox and hosted Supabase Auth/API/PostgreSQL. EAS and TestFlight are a separate build path.

**Design value:** Explains why confirming a set is local and why the API still needs owner checks, idempotency and atomic writes.

[Edit Mermaid source](diagrams/02-architecture.mmd)

```mermaid
flowchart LR
    subgraph Phone["iOS / Android - Expo React Native runtime"]
      direction TB
      UI["Expo Router screens and accessible components"]
      C["Feature UI controllers"]
      S["Domain services and validation"]
      P["Presenters: unit conversion, text scale, volume aggregation"]
      Repo["Owner-scoped local repository ports"]
      SQL["expo-sqlite: workouts, catalog, templates, settings"]
      Queue["SQLite outbox, conflicts and sync checkpoint"]
      Sync["SyncCoordinator + SyncGateway"]
      Auth["AuthService + session storage adapter"]
      Lifecycle["Foreground and reconnect events"]
      UI --> C
      C --> S & P & Auth
      S --> Repo
      P --> Repo
      Repo --> SQL
      Repo --> Queue
      C --> Sync
      Lifecycle --> Sync
      Sync --> Queue & SQL
      Sync --> Auth
      Note["Confirm only after local transaction commits.
Network loss keeps work saved and pending.
Sign-out must resolve or explicitly discard pending work."]
      Note -.-> Repo
    end
    subgraph Backend["Supabase hosted backend"]
      direction TB
      SA["Auth service"]
      API["JWT-authenticated Data API and RPC endpoints"]
      RPC["apply_mutation / pull_changes
Owner checks, revisions, validation, transactions"]
      PG["PostgreSQL: normalized entities + RLS"]
      Receipts["Operation receipts and ordered change feed"]
      API --> RPC
      RPC --> PG & Receipts
      API --> PG
    end
    Auth -->|"HTTPS: email/password + session refresh"| SA
    Sync -->|"HTTPS: snapshots, operation IDs, revisions"| API
    subgraph Distribution["Build and distribution - outside request runtime"]
      direction TB
      Git["GitHub design PRs and independent generated outputs"]
      EAS["EAS Build and Submit"]
      ASC["App Store Connect / TestFlight"]
      Git --> EAS --> ASC
    end
    ASC -. "signed app installation" .-> Phone
```

## Screen navigation

Maps launch, authentication, resume, main areas, typed entry, summary, history drill-down, templates and sync review.

**Design value:** Gives both coding models the same reachable screen flows; no story should exist only as an isolated service method.

[Edit Mermaid source](diagrams/03-navigation.mmd)

```mermaid
flowchart TD
    Launch["Launch: restore session and owner database"] --> Authenticated{"Previously authenticated?"}
    Authenticated -->|No| SignIn["Sign in / register online"]
    SignIn --> Tabs["Tabs: Workout / History / Progress / Exercises / Templates / Settings"]
    Authenticated -->|Yes| Resume{"Active workout exists?"}
    Resume -->|Yes| Choice["Resume or confirm discard"]
    Resume -->|No| Tabs
    Choice --> Active["Active workout: previous sets, typed entry, unit toggle, edit/undo"]
    Tabs --> Start["Start empty or from template; today or earlier"] --> Active
    Active --> Finish{"Any completed sets?"}
    Finish -->|No| Active
    Finish -->|Yes| Summary["Finish: plain summary + local/cloud status"]
    Summary --> SaveTemplate["Save exercise list as template"]
    Tabs --> History["Paged history; date and exercise filters"]
    History --> Detail["Workout detail"]
    Detail --> Edit["Edit finished workout / confirm delete"]
    Tabs --> Exercises["Search + muscle filter; recent first"]
    Exercises --> Custom["Create / rename / archive / restore custom exercise"]
    Exercises --> ExerciseHistory["Exercise history incl. archived"]
    Detail --> ExerciseHistory
    Tabs --> Progress["Exercise or weekly chart + text/table; choose period"]
    Progress --> Point["Select point or accessible row"]
    Point --> Detail
    Point --> Week["Contributing workouts for week"] --> Detail
    Tabs --> Templates["Create/edit/reorder/delete lists; start workout"]
    Templates --> Start
    Tabs --> Settings["kg/lb, equivalent toggle, text scale up to 200%, sync/sign-out"]
    Settings --> Sync["Pending / uploaded / needs sign-in / conflict review"]
    Sync --> Resolve["Preserve both versions; explicitly resolve"]
```

## Persistent entity relationships

Models workout/entry/set records, stable exercises, independent template lists, settings and local/server synchronization records.

**Design value:** Prevents list templates from accidentally copying sets, preserves entered units, and makes deletion/deduplication data explicit.

[Edit Mermaid source](diagrams/04-data-model.mmd)

```mermaid
erDiagram
    ACCOUNT ||--o{ WORKOUT : owns
    ACCOUNT ||--o{ EXERCISE : owns_custom
    ACCOUNT ||--o{ TEMPLATE : owns
    ACCOUNT ||--|| USER_SETTINGS : prefers
    WORKOUT ||--o{ WORKOUT_ENTRY : orders
    WORKOUT_ENTRY ||--o{ EXERCISE_SET : contains
    EXERCISE ||--o{ WORKOUT_ENTRY : identifies
    TEMPLATE ||--o{ TEMPLATE_ENTRY : orders
    EXERCISE ||--o{ TEMPLATE_ENTRY : references
    ACCOUNT ||--o{ OUTBOX_OPERATION : local_queue
    ACCOUNT ||--o{ SYNC_CONFLICT : local_preservation
    ACCOUNT ||--|| SYNC_CHECKPOINT : local_cursor
    ACCOUNT ||--o{ MUTATION_RECEIPT : server_deduplication
    ACCOUNT ||--o{ CHANGE_EVENT : server_pull_feed
    ACCOUNT { uuid id PK }
    WORKOUT {
      uuid id PK
      uuid owner_id FK
      date workout_date
      string state
      datetime started_at
      datetime finished_at
      int revision
      datetime deleted_at
    }
    WORKOUT_ENTRY {
      uuid id PK
      uuid workout_id FK
      uuid exercise_id FK
      int position
    }
    EXERCISE_SET {
      uuid id PK
      uuid entry_id FK
      int position
      decimal entered_weight
      string entered_unit
      int reps
      int seconds
    }
    EXERCISE {
      uuid id PK
      uuid owner_id FK "null for shared seed"
      string name
      string normalized_name
      string exercise_type
      string muscle_group
      boolean archived
      boolean ever_used
      int revision
    }
    TEMPLATE {
      uuid id PK
      uuid owner_id FK
      string name
      string normalized_name
      int revision
      datetime deleted_at
    }
    TEMPLATE_ENTRY {
      uuid id PK
      uuid template_id FK
      uuid exercise_id FK
      int position
    }
    USER_SETTINGS {
      uuid owner_id PK
      string preferred_unit
      boolean show_equivalent
      decimal text_scale
      int revision
    }
    OUTBOX_OPERATION {
      uuid operation_id PK
      uuid owner_id FK
      uuid aggregate_id
      string aggregate_kind
      int local_sequence
      int base_revision
      string immutable_payload
      string payload_hash
      string timezone
      int schema_version
    }
    SYNC_CONFLICT {
      uuid id PK
      uuid owner_id FK
      uuid aggregate_id
      string local_snapshot
      string remote_snapshot
      string reason
    }
    SYNC_CHECKPOINT {
      uuid owner_id PK
      bigint last_cursor
    }
    MUTATION_RECEIPT {
      uuid operation_id PK "paired with owner"
      uuid owner_id FK
      string payload_hash
      int resulting_revision
    }
    CHANGE_EVENT {
      bigint cursor PK
      uuid owner_id FK
      uuid aggregate_id
      string aggregate_kind
      int revision
      string snapshot_or_tombstone
    }
```

## Class model: controllers and account access

Defines each feature controller, auth gateway/session storage and bootstrap responsibilities. Routes/components delegate to these logical controllers.

**Design value:** Connects user actions to domain operations while keeping Supabase details out of screen code.

[Edit Mermaid source](diagrams/classes/01-ui-and-auth.mmd)

```mermaid
classDiagram
    direction LR
    class AuthController {
      +bootstrap()
      +signIn(email, password)
      +register(email, password)
      +signOut()
    }
    class AuthService {
      +restoreSession()
      +requireOwner() UUID
      +signIn(email, password)
      +signOutIfSafe()
    }
    class AuthGateway {
      <<interface>>
      +restore()
      +signIn(email, password)
      +register(email, password)
      +refresh()
      +signOut()
    }
    class SupabaseAuthGateway {
      +restore()
      +signIn(email, password)
      +register(email, password)
      +refresh()
      +signOut()
    }
    class SessionStorageAdapter {
      +getItem(key)
      +setItem(key, value)
      +removeItem(key)
    }
    class WorkoutController {
      +start(date)
      +addExercise(id)
      +showPrevious(id)
      +recordSet(input)
      +editOrRemove(target)
      +undo(token)
      +finish()
      +resumeOrDiscard()
    }
    class ExerciseController {
      +search(text, muscle)
      +create(input)
      +renameOrArchive(id)
      +restore(id)
    }
    class HistoryController {
      +list(filter, cursor)
      +open(id)
      +exerciseHistory(id)
      +edit(id, patch)
      +deleteConfirmed(id)
    }
    class ProgressController {
      +load(metric, period)
      +selectPoint(id)
    }
    class TemplateController {
      +saveWorkoutList(workoutId, name)
      +createOrEdit(input)
      +start(id)
      +deleteConfirmed(id)
    }
    class SettingsController {
      +chooseUnit(unit)
      +toggleEquivalent(enabled)
      +setTextScale(scale)
    }
    class SyncController {
      +status()
      +retry()
      +reviewConflict(id)
      +resolve(id, choice)
    }
    class AppBootstrap {
      +openOwnerPartition()
      +seedCatalog()
      +loadSettings()
      +offerResume()
      +startSyncTriggers()
    }
    AuthController --> AuthService
    AuthService --> AuthGateway
    SupabaseAuthGateway ..|> AuthGateway
    SupabaseAuthGateway --> SessionStorageAdapter
    AuthService --> SyncCoordinator : pending-work guard
    AuthController --> AppBootstrap
    WorkoutController --> WorkoutService
    ExerciseController --> ExerciseService
    HistoryController --> HistoryService
    ProgressController --> ProgressService
    TemplateController --> TemplateService
    SettingsController --> SettingsService
    SyncController --> SyncCoordinator
    AppBootstrap --> LocalDatabase
    AppBootstrap --> AuthService
    note for AuthService "First sign-in needs network. Cached account can work offline. No<br/>account mixing."
```

## Class model: domain entities and services

Defines typed workout records, exercise/template/settings entities, validation, service operations and enum values.

**Design value:** Makes exercise-type rules, active/finished states, stable identity and template independence implementable rather than implicit.

[Edit Mermaid source](diagrams/classes/02-domain.mmd)

```mermaid
classDiagram
    direction TB
    class Workout {
      +UUID id
      +UUID ownerId
      +Date workoutDate
      +WorkoutState state
      +DateTime startedAt
      +DateTime finishedAt
      +int revision
      +WorkoutEntry[] entries
      +finish()
      +validate()
    }
    class WorkoutEntry {
      +UUID id
      +UUID exerciseId
      +int position
      +ExerciseSet[] sets
    }
    class ExerciseSet {
      +UUID id
      +int position
      +Decimal enteredWeight
      +WeightUnit enteredUnit
      +int reps
      +int seconds
    }
    class Exercise {
      +UUID id
      +UUID ownerId
      +String name
      +String normalizedName
      +ExerciseType type
      +String muscleGroup
      +bool archived
      +bool everUsed
      +int revision
    }
    class Template {
      +UUID id
      +UUID ownerId
      +String name
      +TemplateEntry[] entries
      +int revision
    }
    class TemplateEntry {
      +UUID exerciseId
      +int position
    }
    class UserSettings {
      +WeightUnit preferredUnit
      +bool showEquivalent
      +Decimal textScale
      +int revision
    }
    class WorkoutService {
      +start(date)
      +addExercise(id)
      +prefill(entryId)
      +recordSet(input)
      +mutateActive(patch)
      +undo(token)
      +finish()
      +resume()
      +discard()
    }
    class ExerciseService {
      +search(text, muscle)
      +create(input)
      +rename(id, name)
      +archiveOrRestore(id)
    }
    class HistoryService {
      +list(filter, cursor)
      +getWorkout(id)
      +latestPerformance(exerciseId)
      +exerciseHistory(id)
      +editFinished(id, patch)
      +deleteWorkout(id)
    }
    class TemplateService {
      +fromWorkout(id, name)
      +save(input)
      +startWorkout(id)
      +delete(id)
    }
    class SettingsService {
      +load()
      +update(patch)
    }
    class ProgressService {
      +exerciseSeries(id, period)
      +weeklySeries(period)
      +contributingWorkouts(point)
    }
    class InputValidator {
      +validateDate(date, timezone)
      +validateTypedSet(input, exercise)
      +validateName(name)
      +normalizeName(name)
    }
    class UndoToken {
      +UUID workoutId
      +Workout priorSnapshot
      +bool available
    }
    Workout "1" *-- "0..*" WorkoutEntry
    WorkoutEntry "1" *-- "0..*" ExerciseSet
    WorkoutEntry --> Exercise
    Template "1" *-- "1..*" TemplateEntry
    TemplateEntry --> Exercise
    WorkoutService --> InputValidator
    WorkoutService --> UndoToken
    WorkoutService --> WorkoutRepository
    WorkoutService --> ExerciseRepository
    WorkoutService --> HistoryService
    ExerciseService --> InputValidator
    ExerciseService --> ExerciseRepository
    HistoryService --> InputValidator
    HistoryService --> WorkoutRepository
    TemplateService --> TemplateRepository
    TemplateService --> ExerciseRepository
    TemplateService --> WorkoutService
    SettingsService --> SettingsRepository
    ProgressService --> WorkoutRepository
    ProgressService --> VolumeCalculator
    note for Exercise "Stable ID. Types: weight_reps, reps_only, seconds. Shared seed<br/>immutable; custom type locks after use."
    note for ExerciseSet "Preserve original decimal and kg/lb unit. Reps-only has no weight;<br/>timed has seconds only."
    note for Workout "One active per owner; finished requires a set. Date never future.<br/>Confirm mutations after SQLite commit."
    class WorkoutState {
      <<enumeration>>
      in_progress
      finished
    }
    class ExerciseType {
      <<enumeration>>
      weight_reps
      reps_only
      seconds
    }
    class WeightUnit {
      <<enumeration>>
      kg
      lb
    }
    Workout --> WorkoutState
    Exercise --> ExerciseType
    ExerciseSet --> WeightUnit
    WorkoutService --> UnitConverter
```

## Class model: repositories and backend handlers

Defines repository ports, SQLite adapters, transactions, sync coordination/gateway and logical PostgreSQL handlers.

**Design value:** Supplies the database-handler and API-controller responsibilities required by the assignment and supports failure recovery.

[Edit Mermaid source](diagrams/classes/03-persistence-and-sync.mmd)

```mermaid
classDiagram
    direction TB
    class WorkoutRepository {
      <<interface>>
      +active()
      +get(id)
      +list(filter, cursor)
      +latestPerformance(exerciseId)
      +mutateAndEnqueue(snapshot)
      +deleteAndEnqueue(id)
    }
    class ExerciseRepository {
      <<interface>>
      +search(text, muscle)
      +get(id)
      +mutateAndEnqueue(snapshot)
    }
    class TemplateRepository {
      <<interface>>
      +list()
      +get(id)
      +mutateAndEnqueue(snapshot)
      +deleteAndEnqueue(id)
    }
    class SettingsRepository {
      <<interface>>
      +get()
      +mutateAndEnqueue(snapshot)
    }
    class SqliteRepositories {
      +ownerId
      +read(query)
      +mutateAndEnqueue(snapshot)
      +deleteAndEnqueue(id)
    }
    class LocalDatabase {
      +openForOwner(ownerId)
      +migrate()
      +transaction(work)
      +emitChanged()
    }
    class OutboxOperation {
      +UUID operationId
      +UUID aggregateId
      +String aggregateKind
      +int localSequence
      +int baseRevision
      +String immutablePayload
      +String payloadHash
      +String timezone
      +int schemaVersion
    }
    class SyncStore {
      +nextReadyOperation()
      +ackAndRebase(receipt)
      +applyPageAndCheckpoint(page)
      +preserveConflict(local, remote)
      +resolveConflict(id, choice)
    }
    class SyncCoordinator {
      +onForegroundOrReconnect()
      +sync()
      +retry()
      +status()
      +resolve(id, choice)
      +hasPendingOrConflicts()
    }
    class SyncGateway {
      <<interface>>
      +applyMutation(operation)
      +pullChanges(cursor)
    }
    class SupabaseSyncGateway {
      +applyMutation(operation)
      +pullChanges(cursor)
    }
    class MutationHandler {
      +apply_mutation(operation, jwt)
      +validateOwnerAndReferences()
      +checkReceiptAndRevision()
      +commitAggregateAndReceipt()
    }
    class ChangeFeedHandler {
      +pull_changes(cursor, jwt)
      +ownerScopedPageAtHighWater()
    }
    class RemoteDatabase {
      +transaction(work)
      +enforceRLS()
      +lockAggregate()
    }
    SqliteRepositories ..|> WorkoutRepository
    SqliteRepositories ..|> ExerciseRepository
    SqliteRepositories ..|> TemplateRepository
    SqliteRepositories ..|> SettingsRepository
    SqliteRepositories --> LocalDatabase
    LocalDatabase --> OutboxOperation
    SyncCoordinator --> SyncStore
    SyncStore --> LocalDatabase
    SyncCoordinator --> SyncGateway
    SupabaseSyncGateway ..|> SyncGateway
    SupabaseSyncGateway --> MutationHandler : authenticated RPC
    SupabaseSyncGateway --> ChangeFeedHandler : authenticated RPC
    MutationHandler --> RemoteDatabase
    ChangeFeedHandler --> RemoteDatabase
    note for MutationHandler "Logical PostgreSQL RPC handler. RLS reads; direct table writes<br/>blocked. Owner-checked narrow RPC, receipt dedupe, revision validation<br/>and child writes in one transaction."
    note for SyncStore "Local changes plus immutable outbox are atomic. Acks must not<br/>overwrite newer local edits."
    note for SyncCoordinator "Custom exercise dependencies first. Conflict preserves both versions;<br/>retry is idempotent. No guaranteed OS-background uploads."
```

## Class model: conversion, progress and readability

Defines shared unit conversion, volume/reps aggregation, periods/points, summaries, chart tables and text-scale presentation.

**Design value:** Ensures graphs and plain summaries use the same numbers, and display conversion never corrupts originals.

[Edit Mermaid source](diagrams/classes/04-presentation.mmd)

```mermaid
classDiagram
    direction LR
    class UnitConverter {
      +convert(value, from, to) Decimal
      +formatPrimaryAndEquivalent(set, settings) String
      +convertPrefill(value, from, to) Decimal
    }
    class VolumeCalculator {
      +weightedVolume(sets, unit) Decimal
      +totalReps(sets) int
      +perWorkoutSeries(workouts, exercise, unit)
      +weeklySeries(workouts, period, unit)
    }
    class Period {
      +String preset
      +Date startInclusive
      +Date endInclusive
      +mondayBuckets()
    }
    class ProgressPoint {
      +String id
      +Date date
      +Decimal value
      +UUID[] workoutIds
      +String metricUnit
    }
    class WorkoutPresenter {
      +summary(workout, settings)
      +typedSetRows(entry, settings)
      +syncLabel(state)
    }
    class ChartPresenter {
      +chart(series)
      +accessibleTable(series)
      +comparisonText(series)
      +emptyOrSparseMessage(series)
    }
    class ReadabilityPresenter {
      +applyTextScale(settings)
      +accessibleLabels()
      +reflowLayout()
    }
    ProgressService --> VolumeCalculator
    ProgressService --> Period
    VolumeCalculator --> UnitConverter
    VolumeCalculator --> ProgressPoint
    ChartPresenter --> ProgressPoint
    WorkoutPresenter --> UnitConverter
    WorkoutPresenter --> VolumeCalculator
    WorkoutController --> WorkoutPresenter
    HistoryController --> WorkoutPresenter
    ProgressController --> ChartPresenter
    SettingsController --> ReadabilityPresenter
    note for UnitConverter "1 kg = 2.20462 lb. Convert before summing; round only display to one<br/>decimal. Never rewrite entered values."
    note for VolumeCalculator "Finished nondeleted workouts only. Reps-only uses reps; seconds<br/>excluded. Weekly buckets start Monday and include empty weeks."
    note for ReadabilityPresenter "Persistent scale through 200 percent. Wrap and scroll without missing<br/>controls; support OS accessibility."
```

## Class model: synchronization records

Details operation snapshots, preserved conflicts, checkpoints, remote receipts and ordered change events.

**Design value:** Makes duplicate prevention, resumable pull and conflict preservation concrete types with durable fields.

[Edit Mermaid source](diagrams/classes/05-sync-records.mmd)

```mermaid
classDiagram
    direction TB
    class OutboxOperation {
      +UUID operationId
      +UUID ownerId
      +UUID aggregateId
      +String aggregateKind
      +int localSequence
      +int baseRevision
      +String immutablePayload
      +String payloadHash
      +String timezone
      +int schemaVersion
    }
    class SyncConflict {
      +UUID id
      +UUID ownerId
      +UUID aggregateId
      +String localSnapshot
      +String remoteSnapshot
      +String reason
    }
    class SyncCheckpoint {
      +UUID ownerId
      +BigInt lastCursor
    }
    class MutationReceipt {
      +UUID operationId
      +UUID ownerId
      +String payloadHash
      +int resultingRevision
    }
    class ChangeEvent {
      +BigInt cursor
      +UUID ownerId
      +UUID aggregateId
      +String aggregateKind
      +int revision
      +String snapshotOrTombstone
    }
    class SyncStore {
      +nextReadyOperation()
      +ackAndRebase(receipt)
      +preserveConflict(local, remote)
      +applyPageAndCheckpoint(page)
    }
    class MutationHandler {
      +apply_mutation(operation, jwt)
    }
    class ChangeFeedHandler {
      +pull_changes(cursor, jwt)
    }
    SyncStore --> OutboxOperation
    SyncStore --> SyncConflict
    SyncStore --> SyncCheckpoint
    SyncStore --> MutationReceipt
    SyncStore --> ChangeEvent
    MutationHandler --> OutboxOperation
    MutationHandler --> MutationReceipt
    MutationHandler --> ChangeEvent
    ChangeFeedHandler --> ChangeEvent
    note for MutationReceipt "Server uniqueness is ownerId plus operationId. Same payload retries<br/>return original result; different payload is rejected."
    note for ChangeEvent "Server ordered feed includes tombstones. Pull captures a high-water<br/>cursor; local page and checkpoint commit together."
```

## Supporting sequence: authentication and bootstrap

Shows first online sign-in, offline reopening of a known account, owner-partition initialization and sign-out safeguards.

**Design value:** Fills the selected specification's sign-in assumption without silently mixing account data or dropping pending work.

[Edit Mermaid source](diagrams/sequence/SUP-01-auth-and-bootstrap.mmd)

```mermaid
sequenceDiagram
    title Supporting flow: authentication and local isolation
    actor U as User
    participant C as AuthController
    participant A as AuthService
    participant G as SupabaseAuthGateway
    participant B as AppBootstrap
    participant D as LocalDatabase
    participant S as SyncCoordinator
    U->>C: Launch / sign in
    C->>A: restoreSession or signIn
    A->>G: Restore cached identity -  refresh online if possible
    alt First sign-in without connection
      G-->>C: Explain connection required -  no data from another owner
    else Authenticated or previously authenticated offline
      G-->>A: Owner ID and session state
      A->>B: Bootstrap this owner
      B->>D: Open isolated partition -  migrate -  seed -  load settings
      B-->>C: Main UI and offer resume
      B->>S: Start authenticated foreground/reconnect triggers
    end
    U->>C: Sign out / change account
    C->>A: signOutIfSafe()
    A->>S: hasPendingOrConflicts()
    alt Pending or conflicting work
      S-->>C: Block -  sync/resolve or explicitly confirm discard
    else Safe or explicit informed discard
      A->>G: Clear session
      C->>D: Close partition -  clear in-memory records
      C-->>U: Sign-in screen
    end
```

## Supporting sequence: reviewed conflict resolution

Shows presentation of preserved local/remote versions and explicit, validated resolution.

**Design value:** Resolves the source's undefined two-device-offline rule without a silent last-write-wins overwrite.

[Edit Mermaid source](diagrams/sequence/SUP-02-conflict-resolution.mmd)

```mermaid
sequenceDiagram
    title Supporting flow: preserve and explicitly resolve a sync conflict
    actor U as User
    participant C as SyncController
    participant S as SyncCoordinator
    participant R as SyncStore
    participant D as LocalDatabase
    U->>C: Open needs-attention record
    C->>R: Read preserved local and remote snapshots
    R-->>C: Both versions and conflict reason
    C-->>U: Review -  choose explicit resolution
    alt Workout: keep local as independent copy
      C->>S: resolve(id, copyLocal)
      S->>D: Transaction: preserve remote, copy local to new UUID, enqueue copy
      Note over S,D: If both active, require finish/discard of local active first. No silent loss or two active workouts.
    else Keep remote / reviewed rebase of catalog-template-settings
      C->>S: resolve(id, reviewedChoice)
      S->>D: Transaction: validate references/name/type -  apply reviewed choice and requeue if needed
    end
    D-->>S: Local commit -  clear conflict only after successful resolution
    S->>R: Unblock or explicitly rebase dependent operations
    S-->>C: Updated state -  continue sync
    Note over C,D: Cancel preserves conflict and both snapshots. Never drop pending dependent workout/template references.
```

## FW-01: Start a workout, add exercises

As Marcus, I want to start a workout and add exercises as I go, so that I can log in the order I actually train. The flow identifies its UI controller, domain service and data boundary.

**Design value:** Specifies active-workout uniqueness and ordered exercise entry before logging.

[Edit Mermaid source](diagrams/sequence/FW-01.mmd)

```mermaid
sequenceDiagram
    title FW-01: Start a workout, add exercises
    actor U as Marcus
    participant C as WorkoutController
    participant S as WorkoutService
    participant R as WorkoutRepository
    U->>C: Start workout for today
    C->>S: start(today)
    S->>R: active()
    R-->>S: Existing active or none
    alt Existing active
     S-->>C: Offer resume or confirmed discard
    else None
     S->>R: mutateAndEnqueue(new active UUID)
     R-->>S: Local commit
     S-->>C: Active workout
     U->>C: Select active exercise from library
     C->>S: addExercise(exerciseId)
     S->>R: mutateAndEnqueue(ordered empty entry)
     R-->>C: Committed -  entry ready
    end
    Note over S,R: One active workout per owner -  date today or past. Empty active workout may be discarded, never finished.
```

## FW-02: Record a set with prefill

As Marcus, I want to record a set by entering weight and reps, prefilled from my previous set, so that I can log between sets without losing rest time. The flow identifies its UI controller, domain service and data boundary.

**Design value:** Makes prefill precedence and durable confirmation explicit for the central recording interaction.

[Edit Mermaid source](diagrams/sequence/FW-02.mmd)

```mermaid
sequenceDiagram
    title FW-02: Record a set with prefill
    actor U as Marcus
    participant C as WorkoutController
    participant S as WorkoutService
    participant R as WorkoutRepository
    U->>C: Open next weighted set
    C->>S: prefill(entryId)
    S->>R: Current entry and latest finished performance
    R-->>S: Prior set or no history
    S-->>C: Prefill current-entry last set -  else latest finished set
    U->>C: Confirm weight, unit and reps
    C->>S: recordSet(input)
    alt Invalid input
     S-->>C: Explain field -  keep input
    else Valid typed set
     S->>R: mutateAndEnqueue(workout with appended set)
     R-->>S: Commit or storage error
     S-->>C: Confirm after commit -  else keep input and show not saved
    end
    Note over C,S: Source validation choices: weight 0..999.9 entered-unit -  integer reps 1..999. No guessed load if history empty.
```

## FW-03: Set form matches exercise type

As Elena, I want the set form to ask only for what applies to the exercise, so that I am not forced to enter a weight for push-ups or planks. The flow identifies its UI controller, domain service and data boundary.

**Design value:** Prevents irrelevant weight/repetition fields from leaking into other exercise types.

[Edit Mermaid source](diagrams/sequence/FW-03.mmd)

```mermaid
sequenceDiagram
    title FW-03: Set form matches exercise type
    actor U as Elena
    participant C as WorkoutController
    participant S as WorkoutService
    participant R as ExerciseRepository
    U->>C: Select an exercise
    C->>S: Read exercise type
    S->>R: get(exerciseId)
    R-->>S: weight_reps, reps_only or seconds
    S-->>C: Matching field schema
    alt weight_reps
     C-->>U: Weight + kg/lb + reps
    else reps_only
     C-->>U: Reps only
    else seconds
     C-->>U: Whole seconds only
    end
    U->>C: Record set
    C->>S: recordSet(typed input)
    Note over C,S: Reject irrelevant fields -  require positive whole reps/seconds. Confirm via atomic WorkoutRepository mutation as FW-02.
```

## FW-04: See previous performance

As Priya, I want to see what I did the last time I performed an exercise while I log it, so that I can choose today’s weight instead of guessing. The flow identifies its UI controller, domain service and data boundary.

**Design value:** Defines which prior session is shown and how local corrections affect it.

[Edit Mermaid source](diagrams/sequence/FW-04.mmd)

```mermaid
sequenceDiagram
    title FW-04: See previous performance
    actor U as Priya
    participant C as WorkoutController
    participant S as HistoryService
    participant R as WorkoutRepository
    U->>C: Add exercise while logging
    C->>S: latestPerformance(exerciseId)
    S->>R: Latest finished nondeleted workout containing exercise
    R-->>S: Date and ordered typed sets, or none
    S-->>C: Current sets with original units
    C-->>U: Previous date and formatted sets -  else No previous record
    Note over S,R: Read current local records, including offline edits/deletions. Exclude active workout. UnitConverter supplies primary and equivalent values.
```

## FW-05: Correct or remove a set or entry

As Marcus, I want to correct or remove a set, or remove an entry, during a workout, so that one mistaken tap does not corrupt my history. The flow identifies its UI controller, domain service and data boundary.

**Design value:** Preserves correction, confirmation and immediate undo behavior without renumbering corruption.

[Edit Mermaid source](diagrams/sequence/FW-05.mmd)

```mermaid
sequenceDiagram
    title FW-05: Correct or remove a set or entry
    actor U as Marcus
    participant C as WorkoutController
    participant S as WorkoutService
    participant R as WorkoutRepository
    U->>C: Edit set or remove set/entry
    alt Remove
     C-->>U: Confirm removal
     U->>C: Confirm or cancel
    end
    opt Confirmed removal or valid edit
     C->>S: mutateActive(patch)
     S->>S: Validate -  capture prior snapshot in UndoToken
     S->>R: mutateAndEnqueue(edited workout -  renumber positions)
     R-->>S: Local commit
     S-->>C: Updated sets and immediate undo option
     opt User selects immediate undo
      C->>S: undo(token)
      S->>R: mutateAndEnqueue(restored snapshot)
      R-->>C: Committed restored record
     end
    end
    Note over C,S: Cancel changes nothing. Undo expires on subsequent mutation/navigation -  sync preserves operation order.
```

## FW-06: Finish workout, see summary

As Tomás, I want to finish a workout and see a short, plain summary, so that I know it is saved and can read what I did. The flow identifies its UI controller, domain service and data boundary.

**Design value:** Distinguishes a locally saved finish from a successfully uploaded record.

[Edit Mermaid source](diagrams/sequence/FW-06.mmd)

```mermaid
sequenceDiagram
    title FW-06: Finish workout, see summary
    actor U as Tomas
    participant C as WorkoutController
    participant S as WorkoutService
    participant R as WorkoutRepository
    U->>C: Finish workout
    C->>S: finish()
    S->>S: Drop empty entries -  validate remaining sets
    alt No sets remain
     S-->>C: Explain -  continue recording or discard
    else At least one set
     S->>R: mutateAndEnqueue(finished workout + finish timestamp)
     R-->>S: Local commit
     S-->>C: Finished workout and dropped-entry notice
     C-->>U: Plain date, duration if known, exercises, sets, volume and sync status
    end
    Note over C,R: A summary means saved locally -  uploaded is shown only after cloud receipt. Timed/reps-only values remain distinct from weighted volume.
```

## FW-07: Resume an unfinished workout

As Priya, I want my unfinished workout to still be there if I switch apps or my phone locks, so that an interruption does not cost me the session. The flow identifies its UI controller, domain service and data boundary.

**Design value:** Requires actual process-restart persistence rather than an in-memory resume flag.

[Edit Mermaid source](diagrams/sequence/FW-07.mmd)

```mermaid
sequenceDiagram
    title FW-07: Resume an unfinished workout
    actor U as Priya
    participant C as WorkoutController
    participant S as WorkoutService
    participant R as WorkoutRepository
    U->>C: Relaunch after phone lock / process restart
    C->>S: resume()
    S->>R: active() in restored owner partition
    R-->>S: Durable active workout or none
    alt Active exists
     S-->>C: Offer resume or discard
     U->>C: Choose resume
     C-->>U: Restore ordered entries and confirmed sets
     opt User instead confirms discard
      C->>S: discard()
      S->>R: deleteAndEnqueue(active id)
      R-->>C: Local commit -  no active session
     end
    else None
     C-->>U: Start workout screen
    end
    Note over S,R: Every confirmed set and its outbox were committed together before the original UI confirmation.
```

## FW-08: Record a workout on an earlier date

As Elena, I want to record a workout I already did by choosing an earlier date, so that I can catch up when I could not use my phone during the session. The flow identifies its UI controller, domain service and data boundary.

**Design value:** Separates a training calendar date from timestamps so delayed logging is graphed correctly.

[Edit Mermaid source](diagrams/sequence/FW-08.mmd)

```mermaid
sequenceDiagram
    title FW-08: Record a workout on an earlier date
    actor U as Elena
    participant C as WorkoutController
    participant S as WorkoutService
    participant R as WorkoutRepository
    U->>C: Start or edit workout with earlier calendar date
    C->>S: Validate selected YYYY-MM-DD in device timezone
    alt Future date
     S-->>C: Explain -  preserve existing date
    else Today or earlier
     S->>R: mutateAndEnqueue(workout with selected date)
     R-->>S: Local commit
     S-->>C: Date accepted
     C-->>U: History and graphs use selected date, not upload time
    end
    Note over S,R: Preserve calendar date across timezones. Creation/finish timestamps are separate -  do not invent backdated duration.
```

## FW-09: Log offline, upload later

As Elena, I want to log a workout when I have no connection and have it uploaded later, so that I never lose a session because of my signal. The flow identifies its UI controller, domain service and data boundary.

**Design value:** Models the highest-risk cross-system path, including retries, receipts, conflicts and pull checkpoints.

[Edit Mermaid source](diagrams/sequence/FW-09.mmd)

```mermaid
sequenceDiagram
    title FW-09: Log offline, upload later
    actor U as Elena
    participant C as SyncController
    participant S as SyncCoordinator
    participant R as SyncStore
    participant G as SupabaseSyncGateway
    participant H as MutationHandler / ChangeFeedHandler
    participant DB as RemoteDatabase
    U->>C: Log while offline
    Note over U,R: Logging services atomically persist local records plus immutable OutboxOperation. UI shows saved on device / waiting.
    C->>S: onForegroundOrReconnect()
    S->>R: nextReadyOperation() in dependency and per-root order
    R-->>S: Snapshot, UUID, owner, base revision, hash
    S->>G: applyMutation(operation, authenticated session)
    G->>H: apply_mutation
    alt Receipt exists with same payload
     H-->>G: Original receipt
    else Revision or name/type/active-state conflict
     H-->>G: Conflict with remote snapshot
    else Valid authorized mutation
     H->>DB: Transaction: validate, lock root, write children, receipt + change feed
     DB-->>H: New revision
     H-->>G: Receipt
    end
    G-->>S: Receipt, conflict, auth error or retryable failure
    alt Receipt
     S->>R: ackAndRebase -  never overwrite newer local edits
    else Conflict
     S->>R: preserveConflict(local, remote) -  block this root
     S-->>C: Needs attention -  explicit reviewed resolution
    else Offline / expired auth
     S-->>C: Keep queue -  waiting or needs sign-in
    end
    S->>G: pullChanges(checkpoint)
    G->>H: pull_changes at server high-water cursor
    H->>DB: Owner-scoped ordered changes including tombstones
    DB-->>H: Page and next cursor
    H-->>G: Authorized change page
    G-->>S: Page and next cursor
    S->>R: Apply page + checkpoint atomically -  preserve dirty conflicts
    Note over S,R: Retries use same operation ID -  conflict never silently overwrites. Sync runs while active, not guaranteed after OS termination.
    Note over H,DB: Block direct client table writes. Narrow RPC uses fixed search path and explicit authenticated owner checks -  receipt/feed changes commit with the root.
```

## FW-10: Choose kg or lb

As Priya, I want to choose whether weights are shown in kg or lb, so that entries match the plates and machines I use. The flow identifies its UI controller, domain service and data boundary.

**Design value:** Keeps account display preferences separate from immutable entered measurements.

[Edit Mermaid source](diagrams/sequence/FW-10.mmd)

```mermaid
sequenceDiagram
    title FW-10: Choose kg or lb
    actor U as Priya
    participant C as SettingsController
    participant S as SettingsService
    participant R as SettingsRepository
    U->>C: Choose kg or lb on first use or settings
    C->>S: update(preferredUnit)
    S->>R: mutateAndEnqueue(settings)
    R-->>S: Local commit
    S-->>C: New display preference
    C-->>U: Entry, history, summaries and graphs rerender in preferred unit
    Note over C,R: Stored set weight/unit never changes. Convert unrounded values before aggregation -  display one decimal.
```

## FW-11: Find an exercise; recent first

As Priya, I want to find an exercise by typing part of its name or filtering by muscle group, with recent ones first, so that I can add the right exercise without knowing its exact name. The flow identifies its UI controller, domain service and data boundary.

**Design value:** Makes combined search/filter and offline recent ordering consistent for both implementations.

[Edit Mermaid source](diagrams/sequence/FW-11.mmd)

```mermaid
sequenceDiagram
    title FW-11: Find an exercise -  recent first
    actor U as Priya
    participant C as ExerciseController
    participant S as ExerciseService
    participant R as ExerciseRepository
    U->>C: Type part of name and optionally select muscle group
    C->>S: search(text, muscle)
    S->>R: Search shared + own active exercises locally
    R-->>S: Case-insensitive substring plus muscle matches
    S-->>C: Results -  with empty text recent exercises first
    alt No matches
     C-->>U: No match -  offer create custom exercise
    else Matches
     C-->>U: Select exercise by stable ID
    end
    Note over S,R: Search works offline using bundled/cached catalog. Shared seed count is unspecified. Source default is up to 10 recent items first.
```

## FW-12: Create a custom exercise

As Elena, I want to create my own exercise with a name and a type, so that I can log home and unusual movements the library lacks. The flow identifies its UI controller, domain service and data boundary.

**Design value:** Specifies private custom exercise creation, name conflicts and eventual type locking.

[Edit Mermaid source](diagrams/sequence/FW-12.mmd)

```mermaid
sequenceDiagram
    title FW-12: Create a custom exercise
    actor U as Elena
    participant C as ExerciseController
    participant S as ExerciseService
    participant R as ExerciseRepository
    U->>C: Name, type and muscle group for custom exercise
    C->>S: create(input)
    S->>S: Validate name -  normalize case and whitespace
    S->>R: Check name against shared and own custom catalog
    alt Duplicate or invalid
     S-->>C: Explain and retain form
    else Unique
     S->>R: mutateAndEnqueue(new owned exercise UUID)
     R-->>S: Local commit
     S-->>C: Exercise available offline
    end
    Note over S,R: Nonempty name up to source-proposed 60 chars. Type becomes immutable after any set references it. Sync uploads exercise before dependent workout/template.
```

## FW-13: Rename or archive a custom exercise

As Marcus, I want to rename or archive a custom exercise, so that I can tidy my library without losing history. The flow identifies its UI controller, domain service and data boundary.

**Design value:** Keeps rename/archive changes attached to stable exercise identities and historical sets.

[Edit Mermaid source](diagrams/sequence/FW-13.mmd)

```mermaid
sequenceDiagram
    title FW-13: Rename or archive a custom exercise
    actor U as Marcus
    participant C as ExerciseController
    participant S as ExerciseService
    participant R as ExerciseRepository
    U->>C: Rename, archive or restore custom exercise
    C->>S: rename / archiveOrRestore(id)
    S->>R: Read owner and shared/custom state
    alt Shared exercise or name invalid/duplicate
     S-->>C: Reject -  preserve existing exercise
    else Own custom exercise
     S->>R: mutateAndEnqueue(same ID, changed name/archive flag)
     R-->>S: Local commit
     S-->>C: Search refreshed -  history and graphs resolve current name
    end
    Note over S,R: Archive hides picker entry but preserves sets and template references. Restore is available. Used exercises cannot be deleted or change type.
```

## FW-14: List finished workouts

As Tomás, I want to see a list of my finished workouts with dates, exercises and number of sets, so that I can quickly check when and what I trained. The flow identifies its UI controller, domain service and data boundary.

**Design value:** Defines an accessible paged list with stable ordering and an honest empty state.

[Edit Mermaid source](diagrams/sequence/FW-14.mmd)

```mermaid
sequenceDiagram
    title FW-14: List finished workouts
    actor U as Tomas
    participant C as HistoryController
    participant S as HistoryService
    participant R as WorkoutRepository
    U->>C: Open history / scroll for older rows
    C->>S: list(filter, cursor)
    S->>R: Finished nondeleted workouts ordered date DESC, ID DESC
    R-->>S: Page and stable next cursor
    S-->>C: Date, first three exercise names, and N more, set count
    alt Empty history
     C-->>U: Explain how to log first workout
    else Rows exist
     C-->>U: Readable dated list using saved text scale
    end
    Note over C,R: Include locally finished pending uploads. Pagination uses date plus ID -  source three-name row layout is a display rule, not a capacity promise.
```

## FW-15: Open a past workout

As Marcus, I want to open a past workout and see every exercise and set as recorded, so that I can plan a repeat or check what I did. The flow identifies its UI controller, domain service and data boundary.

**Design value:** Provides complete, current records without forcing users through graphs.

[Edit Mermaid source](diagrams/sequence/FW-15.mmd)

```mermaid
sequenceDiagram
    title FW-15: Open a past workout
    actor U as Marcus
    participant C as HistoryController
    participant S as HistoryService
    participant R as WorkoutRepository
    U->>C: Open past workout ID
    C->>S: getWorkout(id)
    S->>R: Owner-scoped finished nondeleted workout with entries/sets
    alt Not found or deleted
     R-->>C: Explain and return to list
    else Found
     R-->>S: Current snapshot
     S-->>C: Ordered exercises and typed sets
     C-->>U: Date, duration if known, total volume, units and plain summary
    end
    Note over C,S: WorkoutPresenter uses current unit/text preferences -  original weights remain intact. Unsynced edits are visible immediately.
```

## FW-16: History of one exercise

As Marcus, I want to see every time I performed one exercise, with the sets from each session, so that I can follow one lift in numbers. The flow identifies its UI controller, domain service and data boundary.

**Design value:** Makes exercise-level history reachable and robust to renaming/archiving.

[Edit Mermaid source](diagrams/sequence/FW-16.mmd)

```mermaid
sequenceDiagram
    title FW-16: History of one exercise
    actor U as Marcus
    participant C as HistoryController
    participant S as HistoryService
    participant R as WorkoutRepository
    U->>C: Open exercise history from library or workout entry
    C->>S: exerciseHistory(stable exerciseId)
    S->>R: Finished workouts containing exercise, newest first
    R-->>S: Dates and matching typed sets
    S-->>C: Exercise-specific history or empty result
    C-->>U: Readable values in preferred units with equivalents if enabled
    Note over S,R: Archived exercise remains readable. Renaming keeps the same ID -  edits and deletion change this query immediately.
```

## FW-17: Edit a finished workout

As Elena, I want to edit a finished workout, so that I can fix mistakes I notice later. The flow identifies its UI controller, domain service and data boundary.

**Design value:** Carries all original validation rules into finished-record correction and derived views.

[Edit Mermaid source](diagrams/sequence/FW-17.mmd)

```mermaid
sequenceDiagram
    title FW-17: Edit a finished workout
    actor U as Elena
    participant C as HistoryController
    participant S as HistoryService
    participant R as WorkoutRepository
    U->>C: Edit finished workout date / entries / sets
    C->>S: editFinished(id, patch)
    S->>S: Apply typed-set rules, nonfuture date, at least one set
    alt Invalid or empty result
     S-->>C: Explain -  keep saved version and editor input
    else Valid
     S->>R: mutateAndEnqueue(updated full snapshot)
     R-->>S: Local commit
     S-->>C: Updated summary
     C-->>U: History, previous performance and graphs reflect edit
    end
    Note over S,R: Works offline -  local data event invalidates derived views. Later upload uses expected revision, with explicit conflict if remote changed.
```

## FW-18: Delete a finished workout

As Elena, I want to delete a finished workout after confirming, so that accidental or test entries do not distort my history and graphs. The flow identifies its UI controller, domain service and data boundary.

**Design value:** Explains both user-visible permanent deletion and internal synchronization tombstones.

[Edit Mermaid source](diagrams/sequence/FW-18.mmd)

```mermaid
sequenceDiagram
    title FW-18: Delete a finished workout
    actor U as Elena
    participant C as HistoryController
    participant S as HistoryService
    participant R as WorkoutRepository
    U->>C: Delete finished workout
    C-->>U: Confirm workout date and set count
    alt Cancel
     C-->>U: Keep workout unchanged
    else Confirm
     C->>S: deleteWorkout(id)
     S->>R: deleteAndEnqueue(tombstone)
     R-->>S: Local commit
     S-->>C: Deleted locally -  upload pending if offline
     C-->>U: Remove from history, previous performance and all graphs
    end
    Note over S,R: No user-facing recycle bin. Keep sync tombstone so cloud deletion propagates and cannot be resurrected by a stale pull.
```

## FW-19: Filter history

As Priya, I want to narrow my history to a date range or to one exercise, so that I can find a specific period or lift without scrolling. The flow identifies its UI controller, domain service and data boundary.

**Design value:** Prevents date and exercise filters from accidentally replacing each other.

[Edit Mermaid source](diagrams/sequence/FW-19.mmd)

```mermaid
sequenceDiagram
    title FW-19: Filter history
    actor U as Priya
    participant C as HistoryController
    participant S as HistoryService
    participant R as WorkoutRepository
    U->>C: Select date range and/or exercise
    C->>S: list(combined filter, reset cursor)
    alt Reversed or invalid date range
     S-->>C: Explain -  do not issue invalid query
    else Valid
     S->>R: Finished workouts matching both optional filters
     R-->>S: Paged rows or none
     S-->>C: Results or no-matches message
    end
    U->>C: Clear filters
    C->>S: list(empty filter, reset cursor)
    Note over C,R: Exercise comparison uses stable ID. Dates inclusive. Filters compose, not replace each other.
```

## FW-20: Per-exercise volume graph

As Marcus, I want to see a graph of my total volume for one exercise over time, so that I can tell whether I am lifting more than before. The flow identifies its UI controller, domain service and data boundary.

**Design value:** Ties exercise chart points directly to converted source sets and workout IDs.

[Edit Mermaid source](diagrams/sequence/FW-20.mmd)

```mermaid
sequenceDiagram
    title FW-20: Per-exercise volume graph
    actor U as Marcus
    participant C as ProgressController
    participant S as ProgressService
    participant R as WorkoutRepository
    participant V as VolumeCalculator
    U->>C: Open weighted exercise graph
    C->>S: exerciseSeries(exerciseId, period)
    S->>R: Current finished workouts and matching weighted sets
    R-->>S: Entered weights, units, reps and dates
    S->>V: Convert unrounded weights -  sum weight times reps per workout
    V-->>S: Points with workout IDs and metric unit
    S-->>C: Series and source references
    C-->>U: Dated unit-labelled chart + accessible table + explanation
    Note over C,V: Fewer than two workouts shows sparse-data message. Do not infer strength or health. Timed exercises have no graph.
```

## FW-21: Choose the period

As Marcus, I want to choose the period shown on a graph, so that I can compare recent weeks with the longer trend. The flow identifies its UI controller, domain service and data boundary.

**Design value:** Keeps chart, table and explanation synchronized when period controls change.

[Edit Mermaid source](diagrams/sequence/FW-21.mmd)

```mermaid
sequenceDiagram
    title FW-21: Choose the period
    actor U as Marcus
    participant C as ProgressController
    participant S as ProgressService
    participant R as WorkoutRepository
    participant V as VolumeCalculator
    U->>C: Choose 4 weeks, 12 weeks, 1 year or all time
    C->>S: Recompute current metric for selected Period
    S->>R: Filter by saved workout date, inclusive endpoints
    R-->>S: Matching current workouts
    S->>V: Reaggregate metric and weekly zero buckets if applicable
    V-->>S: New series and text-summary values
    S-->>C: Replace chart, accessible table and summary together
    Note over C,S: All-time begins at earliest finished workout. Empty account shows empty state. Date choice applies to every graph type.
```

## FW-22: Overall weekly volume graph

As Priya, I want to see my total volume per week across all weight-based exercises, so that I can tell whether I am training more overall. The flow identifies its UI controller, domain service and data boundary.

**Design value:** Defines weekly bucketing, zero weeks and the zero-denominator comparison case.

[Edit Mermaid source](diagrams/sequence/FW-22.mmd)

```mermaid
sequenceDiagram
    title FW-22: Overall weekly volume graph
    actor U as Priya
    participant C as ProgressController
    participant S as ProgressService
    participant R as WorkoutRepository
    participant V as VolumeCalculator
    U->>C: Open overall weekly volume
    C->>S: weeklySeries(period)
    S->>R: Finished weighted sets in date range
    R-->>S: Records and dates
    S->>V: Convert to preferred unit -  sum weight times reps by Monday-start week
    V-->>S: Weekly points including zero weeks and source workout IDs
    S-->>C: Points and latest-two-week comparison values
    C-->>U: Chart + table + plain sentence -  label partial weeks
    Note over C,V: Reps-only and timed sets excluded. Previous week zero uses absolute difference, never division by zero.
```

## FW-23: Reps-only total reps graph

As Elena, I want to see my total reps per workout for a reps-only exercise, so that I can follow progress on bodyweight exercises. The flow identifies its UI controller, domain service and data boundary.

**Design value:** Avoids assigning weighted volume or kilograms to reps-only exercises.

[Edit Mermaid source](diagrams/sequence/FW-23.mmd)

```mermaid
sequenceDiagram
    title FW-23: Reps-only total reps graph
    actor U as Elena
    participant C as ProgressController
    participant S as ProgressService
    participant R as WorkoutRepository
    participant V as VolumeCalculator
    U->>C: Open reps-only exercise progress
    C->>S: exerciseSeries(exerciseId, period)
    S->>R: Finished matching reps-only sets
    R-->>S: Date, workout ID and reps
    S->>V: Sum reps per workout
    V-->>S: Reps series
    S-->>C: Points with metric Total reps
    C-->>U: Chart + accessible table and empty/sparse explanation
    Note over C,V: Do not convert reps into weighted volume. Seconds-based exercises are recorded but not graphed.
```

## FW-24: Select a point, open workout

As Marcus, I want to select a point on a graph to see its date and value and open that workout, so that I can understand an unusually high or low session. The flow identifies its UI controller, domain service and data boundary.

**Design value:** Preserves the link from a chart/table point to the actual contributing records.

[Edit Mermaid source](diagrams/sequence/FW-24.mmd)

```mermaid
sequenceDiagram
    title FW-24: Select a point, open workout
    actor U as Marcus
    participant C as ProgressController
    participant S as ProgressService
    participant R as WorkoutRepository
    U->>C: Select chart point or equivalent table row
    C->>S: contributingWorkouts(pointId)
    S->>R: Resolve current nondeleted workout IDs behind point
    R-->>S: Contributing records
    S-->>C: Date/value and source records
    alt Exercise point
     C-->>U: Open workout detail
    else Weekly point with workouts
     C-->>U: List contributing workouts -  choose one to open
    else Empty week / removed source
     C-->>U: Explain no contributing workout -  refresh series
    end
    Note over C,S: Accessible table selection supports same drill-down. Do not route by displayed date alone.
```

## FW-25: Save workout as template

As Elena, I want to save the exercises of a finished workout as a named template, so that I can start my usual routine again without re-entering it. The flow identifies its UI controller, domain service and data boundary.

**Design value:** Makes templates independent exercise lists rather than copies of performed sets.

[Edit Mermaid source](diagrams/sequence/FW-25.mmd)

```mermaid
sequenceDiagram
    title FW-25: Save workout as template
    actor U as Elena
    participant C as TemplateController
    participant S as TemplateService
    participant R as TemplateRepository
    participant W as HistoryService
    U->>C: Save finished workout as named template
    C->>S: fromWorkout(workoutId, name)
    S->>W: getWorkout(workoutId)
    W-->>S: Ordered finished workout entries
    S->>R: Check normalized template name uniqueness
    alt Invalid or duplicate name
     S-->>C: Explain -  preserve name input
    else Valid
     S->>R: mutateAndEnqueue(new template with ordered exercise IDs only)
     R-->>S: Local commit
     S-->>C: Template saved, upload pending if offline
    end
    Note over S,R: Nonempty name up to source-proposed 60 chars. No sets, weights or reps copied -  source workout remains independent.
```

## FW-26: Start workout from template

As Marcus, I want to start a workout from a template, so that its exercises are already in the workout when I begin. The flow identifies its UI controller, domain service and data boundary.

**Design value:** Defines archived exercise handling and avoids copying prescribed loads into a workout.

[Edit Mermaid source](diagrams/sequence/FW-26.mmd)

```mermaid
sequenceDiagram
    title FW-26: Start workout from template
    actor U as Marcus
    participant C as TemplateController
    participant S as TemplateService
    participant R as TemplateRepository
    participant W as WorkoutService
    U->>C: Start workout from template
    C->>S: startWorkout(templateId)
    S->>R: get(templateId) and resolve exercises
    R-->>S: Ordered IDs with archive flags
    S-->>C: Mark archived exercises and offer skip
    U->>C: Confirm selection
    S->>W: start(today) -  add selected active exercises in order
    W-->>S: New active workout committed via local transaction/outbox
    S-->>C: Empty typed entries -  previous performance available
    Note over C,S: Template unchanged. Existing active workout triggers resume/discard. No load/reps prescription copied from template.
```

## FW-27: Create and edit a template

As Priya, I want to create and edit a template by choosing exercises myself, so that I can set up my plan at home before going to the gym. The flow identifies its UI controller, domain service and data boundary.

**Design value:** Captures name validation, ordering and independent template edits.

[Edit Mermaid source](diagrams/sequence/FW-27.mmd)

```mermaid
sequenceDiagram
    title FW-27: Create and edit a template
    actor U as Priya
    participant C as TemplateController
    participant S as TemplateService
    participant R as TemplateRepository
    U->>C: Create or edit named template
    C-->>U: Search exercise library, add, reorder, remove
    U->>C: Save ordered list
    C->>S: save(name, ordered exerciseIds)
    S->>S: Validate name, unique per owner, nonempty exercise list
    S->>R: mutateAndEnqueue(template snapshot)
    R-->>S: Local commit or validation/storage failure
    S-->>C: Saved after commit -  else explain and keep editor
    Note over C,R: Renaming/reordering changes this template only, not previous workouts. Archived references stay marked -  new selections must be active.
```

## FW-28: Delete a template

As Marcus, I want to delete a template, so that I can retire routines I no longer use. The flow identifies its UI controller, domain service and data boundary.

**Design value:** Ensures deleting a saved routine never deletes workouts started from it.

[Edit Mermaid source](diagrams/sequence/FW-28.mmd)

```mermaid
sequenceDiagram
    title FW-28: Delete a template
    actor U as Marcus
    participant C as TemplateController
    participant S as TemplateService
    participant R as TemplateRepository
    U->>C: Delete a saved template
    C-->>U: Confirmation with template name
    alt Cancel
     C-->>U: Template unchanged
    else Confirm
     C->>S: delete(templateId)
     S->>R: deleteAndEnqueue(template tombstone)
     R-->>S: Local commit
     S-->>C: Template removed from list
    end
    Note over S,R: Existing active and finished workouts are independent and unchanged. Tombstone uploads through the same durable queue.
```

## FW-29: Larger text size

As Tomás, I want to make the text larger, so that I can read my workouts and summaries without straining. The flow identifies its UI controller, domain service and data boundary.

**Design value:** Makes large text a persistent app-wide presentation behavior.

[Edit Mermaid source](diagrams/sequence/FW-29.mmd)

```mermaid
sequenceDiagram
    title FW-29: Larger text size
    actor U as Tomas
    participant C as SettingsController
    participant S as SettingsService
    participant R as SettingsRepository
    participant P as ReadabilityPresenter
    U->>C: Choose larger text up to 200 percent
    C->>S: update(textScale)
    S->>R: mutateAndEnqueue(settings)
    R-->>S: Local commit
    S-->>C: Persistent preference
    C->>P: applyTextScale and reflowLayout
    P-->>U: Readable entry, history, summary, template and settings controls
    Note over C,P: Wrap/scroll without losing content. Provide plain labels, screen-reader labels and text/table chart alternatives. Restore preference at launch.
```

## FW-30: See both units

As Tomás, I want to see each weight with its equivalent in the other unit, so that I know how much to load when a gym’s plates use a different unit. The flow identifies its UI controller, domain service and data boundary.

**Design value:** Uses one conversion/formatting path for every equivalent weight display.

[Edit Mermaid source](diagrams/sequence/FW-30.mmd)

```mermaid
sequenceDiagram
    title FW-30: See both units
    actor U as Tomas
    participant C as SettingsController
    participant S as SettingsService
    participant R as SettingsRepository
    participant P as UnitConverter
    U->>C: Enable or disable equivalent weight display
    C->>S: update(showEquivalent)
    S->>R: mutateAndEnqueue(settings)
    R-->>S: Local commit
    S-->>C: Updated presentation preference
    C->>P: formatPrimaryAndEquivalent(set, settings)
    P-->>U: For example 60 kg (132.3 lb), or primary value only
    Note over C,P: Weighted set rows, previous performance and summaries use same formatter. Factor 2.20462 -  display one decimal -  no stored value changes.
```

## FW-31: Enter a set in either unit

As Tomás, I want to enter a set in either kg or lb, so that I can log what the plates say without converting. The flow identifies its UI controller, domain service and data boundary.

**Design value:** Prevents a unit switch from silently reinterpreting a number without conversion.

[Edit Mermaid source](diagrams/sequence/FW-31.mmd)

```mermaid
sequenceDiagram
    title FW-31: Enter a set in either unit
    actor U as Tomas
    participant C as WorkoutController
    participant S as WorkoutService
    participant R as WorkoutRepository
    participant P as UnitConverter
    U->>C: Open weighted-set form
    C-->>U: Unit defaults to preferred account unit
    U->>C: Choose kg or lb and enter value
    opt Switch unit after entering a value
     C->>P: convertPrefill(value, old unit, new unit)
     P-->>C: Converted value -  explicit confirmation, no silent relabel
    end
    C->>S: recordSet(enteredWeight, enteredUnit, reps)
    S->>S: Validate bounds in entered unit and typed fields
    S->>R: mutateAndEnqueue(set with original decimal and unit)
    R-->>S: Local commit
    S-->>C: Confirm set
    C-->>U: Preferred-unit value plus optional equivalent
    Note over S,R: Prefill converts when source unit differs. History/graphs convert at read time. Switching display preference never rewrites originals.
```
