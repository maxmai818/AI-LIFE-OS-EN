# Capture Data + AI Output Contract v0.2

- **Project**: AI Life OS
- **Document Status**: Draft — Awaiting Max Review
- **SDLC Phase**: G1/G2 Requirements & Design Baseline
- **Product Approver**: Max
- **Author**: Hermes
- **Date**: 2026-09-01
- **Related Requirement**: `POC-01-Product-UX-Spec-v0.2.md`
- **Implementation Status**: Not started; this document is a logical contract, not code or a database migration

---

## 1. Purpose

This document defines the logical data contract for Capture — from raw input, through AI extraction and user revisions, to Review evidence — and specifies how the AI must distinguish facts, inferences, theory references, and recommendations.

The goal is to guarantee:

1. Raw records are never lost or overwritten by the AI.
2. AI results can be verified, corrected, and replayed.
3. Deterministic calculations are separated from generative interpretation.
4. Every Review fact can be traced back to personal evidence.
5. Data from multiple independent users never mixes.
6. Theory references are verifiable and never overshadow personal facts.

## 2. Core Data Principles

### DP-001: User Ownership

Every user data object must belong to an explicit `user_id`. Any read, modification, export, deletion, or AI context construction must first be scoped to the current user.

### DP-002: Raw Data Is Never Overwritten

Capture raw text is stored independently. AI extraction, user revisions, and subsequent re-analysis all create separate versions or records; they never modify the raw text.

### DP-003: User Confirmation Takes Precedence

When a field has both an AI value and a user-confirmed value, calculations and Review use the user-confirmed value first.

### DP-004: Separation of Facts from Generated Content

Structured facts, deterministic calculations, AI inferences, theory references, and recommendations are stored and displayed as different types.

### DP-005: Version Traceability

Every AI processing pass records at least: model provider, model ID, Prompt version, Schema version, processing time, and status.

### DP-006: Data Minimization

Only send cloud models the data needed to complete the current task. Never send the user's full history by default.

### DP-007: Deletion Propagation

When a user deletes a Capture or their account, the behavior of how derived extractions, Review evidence, and caches are deleted or invalidated must be defined.

## 3. Conceptual Data Model

```text
User
├── Profile
├── LifeDimension (fixed Five Life Dimensions)
├── CurrentFocus (phase-based focus)
│   └── FocusDimensionLink (many-to-many association)
├── Goal
├── Capture
│   ├── ExtractionRun
│   │   └── ExtractedItem
│   │       └── UserRevision
│   └── EvidenceReference
├── Review
│   ├── ReviewStatement
│   ├── TheoryReference
│   └── Recommendation
└── Feedback
```

### 3.1 User

Represents an independent private account and data owner.

Minimal logical fields:

- `id`
- `status`
- `created_at`
- `deleted_at`

The authentication method is decided in the G2 technical design. Even if the POC is open only to Max, the owner concept must not be omitted from business data.

### 3.2 Profile

- `user_id`
- `display_name`
- `timezone`
- `locale`
- `ai_processing_consent`
- `created_at`
- `updated_at`

The timezone affects the resolution of time expressions such as "today", "last night", and "this week".

### 3.3 LifeDimension

Provides exactly five controlled dimension definitions:

- `time`: Time
- `health`: Health
- `wealth`: Wealth
- `relationship`: Relationship
- `purpose`: Purpose

Logical fields:

- `id`
- `code`
- `name_zh`
- `name_en`
- `definition`
- `sort_order`
- `schema_version`

LifeDimension is the product's fixed top-level model and does not change with the user's current focuses. A user's Blueprint content for a dimension should be stored in user-specific Profile/Blueprint records, not by modifying the global dimension definition.

### 3.4 CurrentFocus

A phase-based focus or project theme. POC defaults: health, primary job, side project.

- `id`
- `user_id`
- `name`
- `description`
- `status`: `active | paused | completed | archived`
- `start_date` (nullable)
- `end_date` (nullable)
- `sort_order`
- `created_at`
- `updated_at`

Current focuses can change from phase to phase and do not replace LifeDimension.

### 3.5 FocusDimensionLink

Represents the many-to-many association between CurrentFocus and LifeDimension:

- `id`
- `user_id`
- `current_focus_id`
- `life_dimension_id`
- `role`: `primary | secondary | contextual`
- `impact_direction`: `positive | negative | mixed | unknown`
- `rationale`
- `evidence_reference_ids`
- `status`: `proposed | confirmed | modified | rejected`
- `source`: `user | ai`
- `created_at`
- `updated_at`

POC does not mandate storing permanent percentage weights. AI-proposed associations must not be treated as established facts before user confirmation.

### 3.6 Goal

- `id`
- `user_id`
- `current_focus_id` (nullable)
- `life_dimension_ids`
- `title`
- `why`
- `status`: `active | paused | completed | archived`
- `metric_definition` (nullable)
- `current_value` (nullable)
- `target_value` (nullable)
- `unit` (nullable)
- `start_date` (nullable)
- `target_date` (nullable)
- `created_at`
- `updated_at`

Business rules: at most three Active core goals; non-quantifiable goals are allowed, but no pseudo-precise progress is output.

### 3.7 Capture

- `id`
- `user_id`
- `raw_text`
- `occurred_at_hint` (user-optional)
- `timezone`
- `source`: fixed to `text` in POC
- `status`: `saved | processing | needs_confirmation | confirmed | failed | deleted`
- `created_at`
- `updated_at`
- `deleted_at`

Rules:

- Once saved, `raw_text` must not be overwritten by an ExtractionRun.
- If the user actively edits the raw text, a new Capture or an explicit new version must be created; traceless modification is not allowed.
- When AI processing fails, the status is `failed`, but the Capture still exists.

### 3.8 ExtractionRun

Represents one processing pass of one model over one Capture.

- `id`
- `user_id`
- `capture_id`
- `provider`
- `model_id`
- `prompt_version`
- `schema_version`
- `status`: `queued | running | succeeded | failed`
- `raw_model_response` (restricted storage; whether to keep the full text awaits privacy review)
- `error_category` (nullable)
- `started_at`
- `completed_at`

Re-analysis creates a new ExtractionRun; it does not overwrite an old Run.

### 3.9 ExtractedItem

Represents one candidate structured content item extracted by the AI from a Capture.

- `id`
- `user_id`
- `capture_id`
- `extraction_run_id`
- `item_type`
- `life_dimension_ids`
- `current_focus_ids`
- `goal_ids`
- `occurred_at`
- `metric_type`
- `value`
- `unit`
- `qualitative_state`
- `sentiment`
- `energy_level`
- `status`
- `confidence`
- `needs_confirmation`
- `evidence_span`
- `evidence_start` / `evidence_end` (if the technical implementation can provide them reliably)
- `ai_notes`

#### Initial `item_type` enum

- `activity`: what was done
- `metric_observation`: measurable fact
- `goal_progress_event`: event related to goal progress
- `state_observation`: energy, mood, subjective state
- `constraint`: obstacle, burden, or limitation
- `achievement`: completion or result
- `plan`: future intent; must not be treated as a fact that already happened
- `unknown`: cannot be reliably classified

#### Initial `status` enum

- `proposed`
- `confirmed`
- `modified`
- `rejected`
- `unresolved`

### 3.10 UserRevision

- `id`
- `user_id`
- `extracted_item_id`
- `field_name`
- `original_ai_value`
- `revised_value`
- `action`: `confirm | modify | reject`
- `reason` (nullable)
- `created_at`

Calculations use the effective confirmed version, not the latest AI output directly.

### 3.11 Review

- `id`
- `user_id`
- `period_start`
- `period_end`
- `timezone`
- `status`: `draft | generated | reviewed | accepted | superseded`
- `generator_version`
- `created_at`

### 3.12 ReviewStatement

A Review is not stored as one indivisible long text; it is split at least logically into:

- `id`
- `review_id`
- `user_id`
- `statement_type`
- `text`
- `confidence`
- `evidence_reference_ids`
- `theory_reference_ids`
- `display_order`

`statement_type`:

- `personal_fact`
- `deterministic_result`
- `inference`
- `theory_context`
- `recommendation`
- `data_limitation`

### 3.13 EvidenceReference

- `id`
- `user_id`
- `source_type`: `capture | extracted_item | goal | calculation | review`
- `source_id`
- `quote_or_summary`
- `occurred_at`
- `field_path` (nullable)
- `calculation_version` (for calculation results)

### 3.14 TheoryReference

- `id`
- `source_type`: `book | paper | trusted_web | curated_note`
- `author_or_scholar`
- `theory_name`
- `title`
- `publisher_or_journal`
- `publication_date`
- `locator`: chapter, page, DOI, or URL
- `quoted_text` (a lawful and necessary short quotation, nullable)
- `paraphrase`
- `evidence_strength`
- `limitations`
- `verified_at`

Theory references do not belong to any user's personal facts, but a user's Review usage of them must be traceable.

### 3.15 Recommendation

- `id`
- `review_id`
- `user_id`
- `text`
- `rationale`
- `supporting_statement_ids`
- `status`: `proposed | accepted | modified | rejected`
- `user_modified_text` (nullable)

Each Review has at most one primary Recommendation.

## 4. Capture AI Output Contract

### 4.1 Input Boundaries

The AI may receive:

- The current Capture's raw text
- The user's timezone and the current date
- The codes and definitions of the fixed Five Life Dimensions
- The currently Active Current Focus (first round: health, primary job, side project)
- The necessary fields of up to three Active Goals
- The approved Schema and behavioral instructions

By default the AI must not receive:

- The user's full Capture history
- Any data from other users
- Sensitive material unrelated to the current extraction
- Content from unapproved external documents

### 4.2 Sample Logical Output

User input:

> Didn't go to bed until 2 a.m. last night, feeling especially tired today, but still went to the gym for an hour in the evening, and worked two hours on my side-project product.

Suggested output:

```json
{
  "schema_version": "capture-extraction-v0.2",
  "capture_language": "zh-CN",
  "items": [
    {
      "item_type": "metric_observation",
      "life_dimensions": ["health", "time"],
      "current_focuses": ["health"],
      "occurred_at": "last night, resolved in the user's timezone",
      "metric_type": "bedtime",
      "value": "02:00",
      "unit": "local_time",
      "qualitative_state": null,
      "goal_links": [],
      "confidence": "high",
      "needs_confirmation": false,
      "evidence_span": "didn't go to bed until 2 a.m. last night"
    },
    {
      "item_type": "state_observation",
      "life_dimensions": ["health"],
      "current_focuses": ["health"],
      "occurred_at": "today",
      "metric_type": "energy",
      "value": null,
      "unit": null,
      "qualitative_state": "very_low",
      "goal_links": [],
      "confidence": "high",
      "needs_confirmation": false,
      "evidence_span": "especially tired today"
    },
    {
      "item_type": "metric_observation",
      "life_dimensions": ["health", "time"],
      "current_focuses": ["health"],
      "occurred_at": "this evening",
      "metric_type": "exercise_duration",
      "value": 60,
      "unit": "minute",
      "qualitative_state": null,
      "goal_links": [],
      "confidence": "high",
      "needs_confirmation": false,
      "evidence_span": "went to the gym for an hour"
    },
    {
      "item_type": "goal_progress_event",
      "life_dimensions": ["time", "purpose", "wealth"],
      "current_focuses": ["side project"],
      "occurred_at": "today",
      "metric_type": "focused_work_duration",
      "value": 120,
      "unit": "minute",
      "qualitative_state": null,
      "goal_links": ["candidate side-project goal ID"],
      "confidence": "medium",
      "needs_confirmation": true,
      "evidence_span": "worked two hours on my side-project product"
    }
  ],
  "unresolved": [],
  "warnings": []
}
```

Note: real implementations must output machine-validatable time formats; the example above uses natural language to illustrate the time resolution rules pending G2 decision.

The cross-dimension associations in the example above are AI candidates: for example, side-project effort may relate to Time, Purpose, and Wealth at the same time, but must not become long-term mapping facts before user confirmation.

### 4.3 AI Prohibited Behaviors

The AI must not:

- Extract "planning to exercise tomorrow" as having already exercised.
- Extract "did not exercise" as a positive exercise record.
- Unilaterally quantify "very tired" as an exact score the user never defined.
- Infer income, weight, illness, or relationship facts that do not appear in the text.
- Automatically link to the wrong goal just because the user mentioned "work".
- Omit uncertainty and force a classification.
- Substitute theoretical claims for personal facts that do not exist in the Capture.

## 5. Time, Numeric Value, and Negation Rules

### 5.1 Time

- Interpret "today", "last night", and "this week" using the user's timezone.
- Preserve the original time expression.
- When the exact time cannot be determined, store a range or an undetermined state.
- Cross-midnight expressions require confirmation.
- The server timezone must never be substituted for the user's timezone.

### 5.2 Numbers and Units

- Numbers and units are extracted from the raw text and standardized.
- Preserve the original expression, e.g. "one hour".
- Standardized values, e.g. `60 minute`.
- Never guess when the unit is unclear.
- When a correcting expression appears in the same record, take the last explicit correction as the candidate and prompt for confirmation.

### 5.3 Negation and Incompletion

The following semantics must be distinguished:

- Did it
- Did not do it
- Wanted to do it
- Planned to do it
- Did part of it
- Gave it up
- Unsure whether it was done

Plans and intentions must not enter completed metrics.

## 6. Deterministic Calculation Contract

### 6.1 Goal Progress

Computed only when the goal has a clear metric, unit, and valid confirmed data.

Calculation results must store or return:

- Input data references
- Formula or rule version
- Calculation time
- Output value
- Data coverage range
- Data confidence state

### 6.2 Deviation

Deviation requires:

- A clear goal
- A time range
- A planned baseline or expected cadence
- Sufficient data points

When conditions are missing, output `insufficient_data` instead of predicting a completion date.

### 6.3 No Overall Life Score

POC-01 does not produce a single overall score. Allowed displays:

- Per-dimension state
- Goal progress
- Trends
- Deviations
- Data confidence

## 7. Review AI Output Contract

### 7.1 Context Before Generation

The Review Generator receives only:

- The current user
- The specified period
- Confirmed or revised effective facts
- Deterministic calculation results
- Necessary goal information
- A small number of verified TheoryReferences
- Output behavior specifications

Unconfirmed candidates must be marked separately and are not treated as facts by default.

A Review must be able to organize the same set of evidence from two perspectives:

- `dimension_view`: Time, Health, Wealth, Relationship, Purpose.
- `focus_view`: current focuses such as health, primary job, and side project, and their cross-dimension impacts.

Associations without evidence are output as `unknown` or omitted; they must not be auto-filled just to make the display look complete.

### 7.2 Output Categories

#### A. Personal Fact

Format principle:

> Your records show …

Must have a personal EvidenceReference.

#### B. Deterministic Result

Format principle:

> Based on X confirmed records and rule version Y …

Must have inputs and a calculation version.

#### C. Inference

Format principle:

> Existing data suggests … may be related, but is not sufficient to establish causation.

Must cite supporting facts and state the uncertainty.

#### D. Theory Context

Format principle:

> A certain author/theory proposes … this can serve as one interpretive lens, but may not fully apply to your situation.

Must have a TheoryReference and boundary statements.

#### E. Recommendation

Format principle:

> Based on the facts and limitations above, this period you could try …

Must state its basis, and must not pose as fact or as a verbatim theory quote.

### 7.3 Review Prohibited Behaviors

- Claiming, without evidence, that the user has a certain personality, illness, or motivation.
- Stating correlation as causation.
- Making major decisions for the user based on authority opinions.
- Providing high-risk definitive instructions in medicine, law, investment, etc.
- Hiding insufficient data.
- Citing unverifiable authors, titles, papers, or page numbers.
- Generating multiple equally-prioritized "top recommendations" at once.

## 8. Theory Reference Contract

Theory references in POC-01 use only a small set of manually curated material; no large-scale ingestion is built.

Each citation contains at least:

1. Author or scholar
2. Theory name (if applicable)
3. Material title
4. Chapter, page, DOI, or URL
5. Whether the viewpoint is a short quotation or an AI paraphrase
6. Level of evidence or material type
7. Applicability boundaries, controversies, or uncertainties

Display order:

```text
What your records show
→ What the system can deterministically calculate
→ How it might be interpreted
→ Which theories offer perspectives
→ What is suggested to try
```

The reverse — forcing theory onto personal data — is not allowed.

## 9. Cloud LLM and Privacy Requirements

G2 must decide and record:

- Model provider and region
- Whether API data is used for training
- Request and response retention period
- Whether zero-retention or enterprise privacy options are supported
- Which sensitive fields must be removed or replaced
- Whether error logs include input/output
- How users withdraw AI processing consent
- How to re-review when switching model providers

POC default principles:

- Do not put other users' data into the current request.
- Do not send full history irrelevant to the task.
- Do not expose API keys on the client.
- Do not copy production personal data into development or test environments.
- Prefer simulated data for regression testing.

## 10. Multi-User Isolation Contract

Before private testing with friends, the following must be verified:

1. All core entities have a clear owner.
2. The server does not accept a client arbitrarily specifying someone else's `user_id`.
3. Queries are scoped to the current authenticated user by default.
4. Review context construction includes only the current user's records.
5. Exports include only the current user's data.
6. Deletion affects only the current user.
7. Logs, caches, and background jobs carry and enforce user boundaries.
8. Theory material may be shared, but personal citation relationships and Reviews still belong to the current user.

## 11. Schema Versioning and Compatibility

- Current draft version: `capture-extraction-v0.2`.
- Changes to field meaning must bump the Schema version.
- Prompt changes bump the Prompt version independently.
- Model changes record the model ID; they are not equivalent to Schema changes.
- Old data must retain its original version and must not pretend to be generated by the new version.
- Re-running old Captures must be triggered by an explicit task, and both old and new Runs are retained.

## 12. G1/G2 Review Decision Items

Have Max mark each item below as `Approve / Revise / Reject`:

1. Do you accept "raw Captures must not allow traceless edits", with edits forming a new version or new record?
2. Should the Five Life Dimensions be fixed as a controlled enum rather than freely user-added or user-removed?
3. Should associations between Current Focus and the Five Life Dimensions enter long-term analysis only after explicit user confirmation?
4. Does POC accept not setting fixed percentage weights, recording only primary/secondary, direction, rationale, and evidence?
5. Does the initial `item_type` enum cover the Five Life Dimensions and current-focus scenarios?
6. Should energy and mood use verbal levels, a 1–5 score, or user-defined values?
7. Should unconfirmed AI candidates be entirely excluded from Review facts?
8. Should the cloud model's complete raw response be stored, or only the validated structured result?
9. May users request re-analysis of historical Captures?
10. After deleting a single Capture, should already-generated historical Reviews be deleted, have their evidence marked invalid, or keep a snapshot?
11. What content and format should the POC data export include?
12. Are books, papers, and trusted web pages the three accepted source types for theory references?
13. Must theory references have openable links, or are printed-book page numbers also acceptable?
14. What data-retention boundary is acceptable for cloud LLMs?
15. Do users need a "sensitive records are not sent to the AI" option?
16. Are the multi-user isolation conditions before private testing with friends sufficient?
17. What other data must be saved in the first version but is not yet defined in this document?

## 13. Approval Conditions

Only after Max reviews the logical fields, AI type boundaries, privacy principles, and open items in this document may they be converted into formal JSON Schemas, database tables, and interface contracts in subsequent technical design. Approval of this document does not authorize coding.