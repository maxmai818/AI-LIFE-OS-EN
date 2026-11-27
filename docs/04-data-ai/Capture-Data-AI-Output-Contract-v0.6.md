# Capture Data + AI Output Contract v0.6

- **Project**: AI Life OS
- **Document status**: Approved — G1 requirements baseline (Max 2026-10-08, decision packet option A)
- **SDLC stage**: G1/G2 Requirements & Design
- **Product approver**: Max
- **Author**: Hermes
- **Date**: 2026-09-15
- **Related requirement**: `POC-01-Product-UX-Spec-v0.6.md`
- **Related decisions**: `G1-Decision-004-Five-Dimension-Impact-Rules-v0.1.md`, `G1-Decision-005-Mixed-Impact-Degrees-v0.1.md`
- **Implementation status**: Not started; this document is a logical contract, not code or database migrations

- **Changes in this version**: [Decision 006](../09-decisions/G1-Decision-006-Adaptive-Review-v0.1.md); [Delta Review](../08-research/G1-v0.6-Adaptive-Review-Delta-v0.1.md)
- **Coding authorization**: Not authorized; G1 is not approved as a whole; the author may not self-approve.

---

## 1. Purpose

This document defines the logical data contract for Capture from raw input, through AI extraction and user revisions, to Review evidence, and specifies how the AI must distinguish facts, speculation, theory references, and recommendations.

The goal is to guarantee:

1. Raw records are never lost or overwritten by the AI.
2. AI results can be verified, corrected, and replayed.
3. Deterministic computation is separated from generative interpretation.
4. Every Review fact can be traced back to personal evidence.
5. Data from multiple independent users is never mixed.
6. Theory references are verifiable and never override personal facts.

## 2. Core Data Principles

### DP-001: User ownership

Every user data object must belong to an explicit `user_id`. Every read, modification, export, deletion, and AI context build must first be scoped to the current user.

### DP-002: Raw data never overwritten

Capture raw text is stored independently. AI extraction, user revisions, and subsequent re-analysis all create separate versions or records and never modify the raw text.

### DP-003: User confirmation takes precedence

When the same field has both an AI value and a user-confirmed value, computation and Review use the user-confirmed value first.

### DP-004: Separation of facts and generated content

Structured facts, deterministic calculations, AI speculation, theory references, and recommendations are stored and displayed as distinct types.

### DP-005: Version traceability

Every AI processing run records at least: model provider, model identifier, Prompt version, Schema version, processing time, and status.

### DP-006: Data minimization

Send cloud models only the data needed to complete the current task. The user's full history must never be sent by default.

### DP-007: Deletion propagates

When a user deletes a Capture or their account, it must be defined how the derived extractions, Review evidence, and caches are deleted or invalidated.

## 3. Conceptual Data Model

```text
User
├── Profile
├── LifeDimension (fixed Five Life Dimensions)
├── Goal
├── Capture
│   ├── ExtractionRun
│   │   └── ExtractedItem
│   │       ├── BehaviorDimensionImpact
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

The authentication method is decided in G2 technical design. Even if the POC is only opened to Max, the owner concept must not be omitted from business data.

### 3.2 Profile

- `user_id`
- `display_name`
- `timezone`
- `locale`
- `ai_processing_consent`
- `created_at`
- `updated_at`

Timezone affects the resolution of time expressions such as "today", "last night", and "this week".

### 3.3 LifeDimension

Provides five fixed controlled dimension definitions:

- `time`: Time
- `health`: Health
- `wealth`: Wealth
- `relationship`: Relationship
- `purpose`: Purpose (meaning)

Logical fields:

- `id`
- `code`
- `name_zh`
- `name_en`
- `definition`
- `sort_order`
- `schema_version`

LifeDimension is a fixed top-level model of the product. User-specific Blueprint content about a dimension should be stored in the user's own Profile/Blueprint records, not by modifying the global dimension definitions.

### 3.4 Goal

- `id`
- `user_id`
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

Business rules: at most three active core Goals; non-quantifiable goals are allowed, but pseudo-precise progress is not output.

### 3.5 Capture

- `id`
- `user_id`
- `raw_text`
- `occurred_at_hint` (optional for the user)
- `timezone`
- `source`: fixed to `text` for the POC
- `status`: `saved | processing | needs_confirmation | confirmed | failed | deleted`
- `created_at`
- `updated_at`
- `deleted_at`

Rules:

- Once `raw_text` is saved, it must not be overwritten by an ExtractionRun.
- If the user deliberately edits the raw text, a new Capture or an explicit new version must be created; silent in-place edits are not allowed.
- When AI processing fails, the status is `failed`, but the Capture still exists.

### 3.6 ExtractionRun

Represents one processing run of one model over one Capture.

- `id`
- `user_id`
- `capture_id`
- `provider`
- `model_id`
- `prompt_version`
- `schema_version`
- `status`: `queued | running | succeeded | failed`
- `raw_model_response` (restricted storage; whether the full text is kept is pending privacy review)
- `error_category` (nullable)
- `started_at`
- `completed_at`

Re-analysis creates a new ExtractionRun and never overwrites an old Run.

### 3.7 ExtractedItem

Represents one candidate structured entry extracted by the AI from a Capture.

- `id`
- `user_id`
- `capture_id`
- `extraction_run_id`
- `item_type`
- `life_dimension_ids`
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
- `epistemic_type`: `user_reported_fact | user_reported_impact | ai_inferred_impact | deterministic_calculation`
- `evidence_span`
- `evidence_start` / `evidence_end` (if the technical implementation can provide them reliably)
- `ai_notes`

#### `item_type` initial enum

- `activity`: what was done
- `metric_observation`: measurable fact
- `goal_progress_event`: event related to goal progress
- `state_observation`: energy, mood, subjective state
- `constraint`: obstacle, burden, or limitation
- `achievement`: completion or result
- `plan`: future intent; must not be treated as a fact that already happened
- `unknown`: cannot be reliably classified

#### `status` initial enum

- `proposed`
- `confirmed`
- `modified`
- `rejected`
- `unresolved`

### 3.8 BehaviorDimensionImpact

Represents a candidate impact of one extracted behavior/event on one LifeDimension. Every valid behavior is logically assessed against all five dimensions; a dimension with no evidence is stored as `unknown`, and it is stored as `neutral` only when evidence shows there is no noticeable impact.

- `id`
- `user_id`
- `extracted_item_id`
- `life_dimension_id`
- `direction`: `positive | negative | mixed | neutral | unknown`
- `degree` (nullable integer; 1–5 when `positive | negative` with sufficient basis; empty for other directions)
- `positive_degree` (nullable integer; used only for `mixed`; 1–5 when the basis is sufficient)
- `negative_degree` (nullable integer; used only for `mixed`; 1–5 when the basis is sufficient)
- `rationale`
- `evidence_span`
- `positive_evidence_span` (basis for the positive direction of `mixed`; required when `mixed`, not omitted just because `positive_degree = null`)
- `negative_evidence_span` (basis for the negative direction of `mixed`; required when `mixed`, not omitted just because `negative_degree = null`)
- `positive_rationale` (positive rationale for `mixed`)
- `negative_rationale` (negative rationale for `mixed`)
- `positive_confidence` (positive confidence for `mixed`)
- `negative_confidence` (negative confidence for `mixed`)
- `positive_status`: `proposed | confirmed | modified | rejected`
- `negative_status`: `proposed | confirmed | modified | rejected`
- `assessment_window_start`
- `assessment_window_end`
- `blueprint_version_id` (nullable; empty when no Blueprint has been established)
- `goal_context_version_ids` (may be an empty array)
- `scale_anchor_version`
- `confidence`
- `status`: `proposed | confirmed | modified | rejected | unknown`
- `source`: `user | ai | rule`
- `epistemic_type`: `user_reported_fact | user_reported_impact | ai_inferred_impact | deterministic_calculation`
- `neutral_evidence_source` (required when `neutral`): `explicit_user_statement | approved_rule`
- `created_at`
- `updated_at`

Constraints:

- POC-01 uses a fixed `degree` 1–5 discrete scale; user customization is not allowed; this version does not define a `proportion` field.
- 1–5 is an ordered subjective impact estimate relative to the user's current Blueprint, goals, and assessment window — not an objective measurement; `1` very weak, `2` weak, `3` moderate, `4` strong, `5` very strong.
- When `direction = unknown | neutral`, all three degree fields must be empty; `positive | negative` use `degree`, and the two mixed-only fields are empty. When the direction has a basis but degree evidence is insufficient, the corresponding degree may be `null` and marked as pending confirmation.
- When `direction = mixed`, `degree = null`, with `positive_degree` and `negative_degree` used separately; the positive and negative directions must always each have their own evidence, rationale, confidence, and status. When degree evidence is insufficient, the corresponding degree may be `null`, but evidence supporting that side's direction remains required.
- The five dimension degrees are judged independently and are not required to sum to a fixed total, because multi-dimensional impact is not a zero-sum allocation.
- `unknown` and `neutral` must be distinguished: the former means insufficient information, the latter means there is evidence supporting no significant impact.
- `neutral` may only come from an explicit user statement or an approved deterministic rule; the AI must not interpret "not mentioned in the raw text" as neutral.
- AI candidates must not be treated as long-term established facts before user confirmation.
- Only non-`unknown` impacts with `confirmed | modified` may enter long-term trends, dimension state, and Review facts; `proposed | rejected` must not participate.
- `unknown` may be kept as a data limitation; users are not required to confirm it into a non-unknown value.
- User confirmation only changes `status`, never `epistemic_type`; even after confirmation, `ai_inferred_impact` remains a "user-endorsed AI inference", not a direct observation or a proven causal relationship.
- Degrees must not be compared, averaged, ranked, differenced across dimensions, or used alone to generate trends; trends must be based on approved rules with the same dimension, same semantics, and same time window.
- The two `mixed` degrees may only express relative strength within the same behavior, same dimension, same assessment window, and the same Blueprint/Goal/scale-anchor versions; they must not be subtracted, divided, netted, converted to percentages, or compressed into a single overall intensity. They must not be directly compared across behaviors, dimensions, time windows, or after context version changes.
- Clearing only one side's degree means that side's degree is unknown; it does not negate that side's direction, and `direction` may still be `mixed`. When one side's direction is rejected, the effective direction becomes the other side's `positive` or `negative`, and that side's effective degree is transferred into `degree`; when both sides are rejected, the whole entry's status is `rejected` and it must not enter long-term analysis. The original mixed candidate and every transition are preserved in the UserRevision history.

### 3.9 UserRevision

- `id`
- `user_id`
- `extracted_item_id`
- `field_name`
- `original_ai_value`
- `revised_value`
- `action`: `confirm | modify | reject`
- `reason` (nullable)
- `resulting_direction` (required on direction transitions)
- `created_at`

Computation uses the effective confirmed version, not the latest AI output directly.

### 3.10 Review

- `id`
- `user_id`
- `period_start`
- `period_end`
- `timezone`
- `status`: `draft | generated | reviewed | accepted | superseded`
- `generator_version`
- `created_at`

### 3.11 ReviewStatement

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

### 3.12 EvidenceReference

- `id`
- `user_id`
- `source_type`: `capture | extracted_item | goal | calculation | review`
- `source_id`
- `quote_or_summary`
- `occurred_at`
- `field_path` (nullable)
- `calculation_version` (when it is a calculation result)

### 3.13 TheoryReference

- `id`
- `source_type`: `book | paper | trusted_web | curated_note`
- `author_or_scholar`
- `theory_name`
- `title`
- `publisher_or_journal`
- `publication_date`
- `locator`: chapter, page number, DOI, or URL
- `quoted_text` (legitimate and necessary short quote, nullable)
- `paraphrase`
- `evidence_strength`
- `limitations`
- `verified_at`

Theory references do not belong to any one user's personal facts, but their use in a user's Review must be traceable.

### 3.14 Recommendation

- `id`
- `review_id`
- `user_id`
- `text`
- `rationale`
- `supporting_statement_ids`
- `status`: `proposed | accepted | modified | rejected`
- `user_modified_text` (nullable)

Each Review allows zero or one primary Recommendation; no recommendation is generated when there is no willingness or need to change.

## 4. Capture AI Output Contract

### 4.1 Input boundaries

The AI may receive:

- The current Capture's raw text
- The user's timezone and the current date
- The codes and definitions of the five fixed Life Dimensions
- The necessary fields of up to three Active Goals
- The approved Schema and behavioral instructions

By default it must not receive:

- The user's full Capture history
- Any other user's data
- Sensitive material unrelated to the current extraction
- Unapproved external document content

### 4.2 Logical output example

User input:

> Last night I worked until 2 a.m. rushing to finish a project, and today I'm exhausted, but I received 500 yuan in project payment.

The same Capture contains at least three events: "working until 2 a.m.", "next-day fatigue", and "receiving the project payment". The example shows only the first two to keep it short; real output must create a separate ExtractedItem for each and must not attribute the income's Wealth impact to the late-night behavior.

Suggested output (excerpt):

```json
{
  "schema_version": "capture-extraction-v0.5",
  "capture_language": "zh-CN",
  "items": [
    {
      "item_type": "activity",
      "occurred_at": "last night, resolved in the user's timezone",
      "metric_type": "project_work_late",
      "goal_links": [],
      "confidence": "high",
      "needs_confirmation": true,
      "epistemic_type": "user_reported_fact",
      "evidence_span": "Last night I worked until 2 a.m. rushing to finish a project",
      "dimension_impacts": [
        {
          "dimension": "time",
          "direction": "negative",
          "degree": null,
          "confidence": "medium",
          "epistemic_type": "ai_inferred_impact",
          "evidence_span": "worked until 2 a.m.",
          "rationale": "Candidate interpretation: may consume discretionary or rest time at night; the degree needs the user's judgment"
        },
        {
          "dimension": "health",
          "direction": "negative",
          "degree": null,
          "confidence": "medium",
          "epistemic_type": "ai_inferred_impact",
          "evidence_span": "worked until 2 a.m., today I'm exhausted",
          "rationale": "Candidate interpretation: late night and next-day fatigue co-occur, but proven causation is not claimed"
        },
        {
          "dimension": "wealth",
          "direction": "unknown",
          "degree": null,
          "confidence": "high",
          "epistemic_type": "ai_inferred_impact",
          "evidence_span": null,
          "rationale": "The late-night behavior itself has no independent evidence of a Wealth impact"
        },
        {
          "dimension": "relationship",
          "direction": "unknown",
          "degree": null,
          "confidence": "high",
          "epistemic_type": "ai_inferred_impact",
          "evidence_span": null,
          "rationale": "The raw text contains no Relationship-impact evidence"
        },
        {
          "dimension": "purpose",
          "direction": "unknown",
          "degree": null,
          "confidence": "high",
          "epistemic_type": "ai_inferred_impact",
          "evidence_span": null,
          "rationale": "No relationship between the project and the user's goals or meaning was provided"
        }
      ]
    },
    {
      "item_type": "metric_observation",
      "occurred_at": "today, resolved in the user's timezone",
      "metric_type": "income_received",
      "value": 500,
      "unit": "CNY",
      "goal_links": [],
      "confidence": "high",
      "needs_confirmation": true,
      "epistemic_type": "user_reported_fact",
      "evidence_span": "received 500 yuan in project payment",
      "dimension_impacts": [
        {
          "dimension": "wealth",
          "direction": "positive",
          "degree": null,
          "confidence": "high",
          "epistemic_type": "ai_inferred_impact",
          "evidence_span": "received 500 yuan in project payment",
          "rationale": "Candidate interpretation: recorded income usually supports the Wealth dimension; the specific degree needs confirmation against the user's baseline"
        },
        {
          "dimension": "time",
          "direction": "unknown",
          "degree": null,
          "confidence": "high",
          "epistemic_type": "ai_inferred_impact",
          "evidence_span": null,
          "rationale": "The income event itself has no evidence of a Time impact"
        },
        {
          "dimension": "health",
          "direction": "unknown",
          "degree": null,
          "confidence": "high",
          "epistemic_type": "ai_inferred_impact",
          "evidence_span": null,
          "rationale": "The income event itself has no evidence of a Health impact"
        },
        {
          "dimension": "relationship",
          "direction": "unknown",
          "degree": null,
          "confidence": "high",
          "epistemic_type": "ai_inferred_impact",
          "evidence_span": null,
          "rationale": "The raw text contains no Relationship-impact evidence"
        },
        {
          "dimension": "purpose",
          "direction": "unknown",
          "degree": null,
          "confidence": "high",
          "epistemic_type": "ai_inferred_impact",
          "evidence_span": null,
          "rationale": "No relationship between this income and the user's goals or meaning was provided"
        }
      ]
    }
  ],
  "unresolved": ["The fatigue state should be output as a separate ExtractedItem; this excerpt does not expand it"],
  "warnings": ["When the direction can be judged but degree evidence is insufficient, degree stays null, awaiting the user's choice of 1–5 or remaining undecided"]
}
```

Note: a real implementation must output machine-validatable time formats and create a separate ExtractedItem for every distinguishable behavior or event in a Capture. The 1–5 degree is an ordered subjective estimate confirmed by the user relative to their Blueprint, goals, and time window; when evidence is insufficient, numbers must not be generated just to fill the scale. Five-dimension impacts are not a zero-sum allocation and are not required to sum to a fixed total.

### 4.3 AI prohibitions

The AI must not:

- Extract "planned to exercise tomorrow" as having already exercised.
- Extract "did not exercise" as a positive exercise record.
- Arbitrarily quantify "very tired" into an exact score the user never defined.
- Infer income, weight, illness, or relationship facts that never appeared.
- Automatically link to the wrong goal just because the user mentioned "work".
- Omit uncertainty and force a classification.
- Substitute theoretical viewpoints for personal facts that do not exist in the Capture.

## 5. Time, Numeric Value, and Negation Rules

### 5.1 Time

- Interpret "today", "last night", and "this week" using the user's timezone.
- Preserve the original time expression.
- When the exact time cannot be determined, store a range or an uncertain state.
- Expressions crossing midnight require pending confirmation.
- The server timezone must not be substituted for the user's timezone.

### 5.2 Numeric values and units

- Extract numeric values and units from the raw text and standardize them.
- Preserve the original expression, e.g. "one hour".
- Standardized value, e.g. `60 minute`.
- Do not guess when the unit is unclear.
- When a corrective expression appears in the same record, take the last explicit correction as the candidate and prompt for confirmation.

### 5.3 Negation and incompleteness

The following semantics must be distinguished:

- Did it
- Did not do it
- Wanted to do it
- Planned to do it
- Did part of it
- Gave up
- Not sure whether it was done

Plans and intentions must not enter completed metrics.

## 6. Deterministic Calculation Contract

### 6.1 Goal Progress

Calculate only when the goal has a clear metric, unit, and valid confirmed data.

Calculation results must store or return:

- Input data references
- Formula or rule version
- Calculation time
- Output value
- Data coverage
- Data confidence status

### 6.2 Deviation

Deviation requires:

- An explicit goal
- A time range
- A planned baseline or expected cadence
- Enough data points

When conditions are missing, output `insufficient_data` instead of predicting a completion date.

### 6.3 No overall Life Score

POC-01 does not generate a single overall score. Allowed to display:

- Per-domain status
- Goal progress
- Trends
- Deviation
- Data confidence

## 7. Review AI Output Contract

### 7.1 Context before generation

The Review Generator receives only:

- The current user
- The specified period
- Confirmed or revised valid facts
- Deterministic calculation results
- Necessary goal information
- A small number of verified TheoryReferences
- Output behavioral specifications
- This session's user expressions, optional feedback, and scope-limited valid patterns (per the In Review proposal in Section 14; it does not automatically read the full history)

Unconfirmed candidates must be flagged separately and are not treated as facts by default.

Reviews are organized primarily around `dimension_view`, arranging the same body of evidence and behavior impacts by Time, Health, Wealth, Relationship, and Purpose. Goals, Projects, or other contexts may be used for filtering and interpretation but must not become fixed top-level dimensions. Impacts without evidence are output as `unknown` and must not be auto-filled for display completeness.

Impact mappings must retain `epistemic_type` in Reviews. Even when confirmed by the user, an AI inference may only be phrased as a "user-endorsed judgment" or "record-based speculation"; unless the record directly states it or an approved deterministic calculation exists, it must not be phrased as an objective fact or causal conclusion.

### 7.2 Output categories

#### A. Personal Fact

Format principle:

> Your records show…

Must have a personal EvidenceReference.

#### B. Deterministic Result

Format principle:

> Based on X confirmed records and rule version Y…

Must have inputs and calculation version.

#### C. Inference

Format principle:

> The existing data suggests … may be related, but is insufficient to prove a causal relationship.

Must cite supporting facts and state the uncertainty.

#### D. Theory Context

Format principle:

> Author/theory X proposes … This can serve as one interpretive perspective, but may not fully apply to your situation.

Must have a TheoryReference and boundary statement.

#### E. Recommendation

Format principle:

> Based on the above facts and limitations, this period you could try…

Must state its basis and must not impersonate facts or the original words of a theory.

### 7.3 Review prohibitions

- Claiming without evidence that the user has a certain personality, illness, or motive.
- Stating correlation as causation.
- Making major decisions for the user based on famous authorities' views.
- Providing high-certainty instructions in high-risk domains such as medical, legal, or investment matters.
- Hiding insufficient data.
- Citing unverifiable authors, book titles, papers, or page numbers.
- Generating multiple "most important recommendations" of equal priority at once.

## 8. Theory Reference Contract

Theory references in POC-01 use only a small amount of manually curated material; no large-scale ingestion is built.

Each citation must include at least:

1. Author or scholar
2. Theory name (if applicable)
3. Material title
4. Chapter, page number, DOI, or URL
5. Whether the viewpoint is a short quote or an AI paraphrase
6. Evidence strength or material type
7. Applicability boundaries, controversies, or uncertainties

Display order:

```text
What your records show
→ What the system can deterministically calculate
→ How it might be interpreted
→ Which theories provide perspectives
→ What to try as a recommendation
```

Theory must never be used in reverse to force an explanation of personal data.

## 9. Cloud LLM and Privacy Requirements

G2 must decide and record:

- Model provider and region
- Whether API data is used for training
- Request and response retention time
- Whether zero-retention or enterprise privacy options are supported
- Which sensitive fields must be removed or replaced
- Whether error logs include input/output
- How users withdraw AI-processing consent
- How re-review happens when switching model providers

POC default principles:

- Do not put other users' data into the current request.
- Do not send full histories unrelated to the task.
- Do not expose API keys on the client.
- Do not copy production personal data into development or test environments.
- Prefer synthetic data for regression testing.

## 10. Multi-User Isolation Contract

The following must be verified before private testing with friends:

1. All core entities have an explicit owner.
2. The server does not accept a client arbitrarily specifying someone else's `user_id`.
3. Queries are scoped to the current authenticated user by default.
4. Review context building includes only the current user's records.
5. Export includes only the current user's data.
6. Deletion affects only the current user.
7. Logs, caches, and background tasks carry and validate user boundaries.
8. Theory material may be shared, but personal citation relationships and Reviews still belong to the current user.

## 11. Schema Version and Compatibility

- The Capture structure stays at `capture-extraction-v0.5`; the new Review logical contract is proposed as `review-guidance-v0.6-proposal`; a document upgrade does not fabricate already-executed migrations.
- Changes in field meaning must bump the Schema version.
- Prompt changes bump the Prompt version independently.
- Model changes record the model identifier and are not equivalent to Schema changes.
- Old data must keep its original version and must not pretend to be generated by a new version.
- Whether to re-run old Captures must be triggered by an explicit task, keeping both old and new Runs.

## 12. G1/G2 Review Decision Items

On 2026-09-12, Max approved `G1-Decision-004-Five-Dimension-Impact-Rules-v0.1.md`. On 2026-09-13, Max also approved `G1-Decision-005-Mixed-Impact-Degrees-v0.1.md`: `mixed` records positive and negative 1–5 degrees separately, with per-side evidence and status, and prohibits proportioning or netting; Decision 005 partially supersedes the TBD clauses of Decision 004 on the mixed structure. The remaining items below continue under Review.

Max: please mark each item below as `Approve / Revise / Reject`:

1. Accept that "raw Captures do not allow silent edits"; edits should form a new version or new record?
2. Should the Five Life Dimensions be fixed as a controlled enum rather than freely added/removed by users?
3. Does the initial `item_type` enum cover behavior and event scenarios?
4. Should energy and mood use verbal levels, a 1–5 scale, or user-defined formats?
5. Should the cloud model's complete raw response be saved, or only the validated structured results?
6. Should users be allowed to request re-analysis of historical Captures?
7. After deleting a single Capture, should already-generated historical Reviews be deleted, marked as invalid evidence, or kept as snapshots?
8. What content and formats should the POC's data export include?
9. Should theory references accept three source types: books, papers, and trusted web pages?
10. Should theory references be required to have a working link, or are print-book page numbers acceptable too?
11. What data retention boundaries are acceptable for the cloud LLM?
12. Do users need a "do not send sensitive records to the AI" option?
13. Are the multi-user isolation conditions sufficient before private testing with friends?
14. What other data must be saved in the first version but is not yet defined in this document?
15. Closed by Decision 006: zero recommendations are allowed; the new guidance/feedback fields and lifecycle are in Section 14, still awaiting Max's review.

## 13. Approval Conditions

Only after the logical fields, AI type boundaries, privacy principles, and open items in this document have been reviewed by Max may they be converted into formal JSON Schemas, database tables, and interface contracts in subsequent technical design. Approval of this document does not authorize coding.


## 14. Review Guidance, Feedback, and Restricted Learning Contract (In Review proposal)

All new fields, enums, transitions, and deadlines in this section are for Max's review and are **not approved implementation details**. Basis: [Decision 006](../09-decisions/G1-Decision-006-Adaptive-Review-v0.1.md); corresponds to Product FR-COA-001–010 and Test COA-001–014. P6-02 has been conditionally confirmed at G1 as product principles: only explicitly confirmed long-term patterns may be used across Reviews; a single piece of feedback applies only to the current Review by default; users can view/correct/withdraw/delete; unconfirmed inferences never become long-term basis. Fields, retrieval/retention periods, caches, backups, physical deletion, and vendor parameters remain deferred to G2. The Capture, five-dimension, and mixed contracts are inherited unchanged; the Capture schema remains v0.5; the new logical schema is `review-guidance-v0.6-proposal`.

### 14.1 Logical objects and references

All personal objects have `id, user_id, created_at, revision_id`; associated objects must belong to the same authenticated user, and the server validates ownership and valid versions. The table below is a logical contract and does not require users to fill in a form. Capabilities such as feedback submission, modification, withdrawal, and explanation reads are only hypothetical logical requirements; no HTTP endpoints, database tables, or migrations are specified or claimed to be implemented.

| Object | Required fields / conditions | Semantics |
|---|---|---|
| ReviewGuidance | `review_id, generation_id, status, trigger, selected_guidance, directness, delivered_text, recommendation_ids, evidence_reference_ids, goal_context_version_ids, feedback_revision_ids, pattern_revision_ids, uncertainty, rationale_summary, policy_version, model_id, prompt_version, schema_version, context_manifest, supersedes_id` | The actually displayed result and policy are bound to the same Review; failures/cancellations are marked rather than pretending to have been displayed |
| ReviewFeedback | `review_id, target_type, target_id, target_revision_id, feedback_type, agreement, text, scope, status, supersedes_id` | Can point to a specific statement/guidance/recommendation/pattern; first attributed to its Review, then located to the object; factual corrections can link to a Capture revision without silently overwriting the original text |
| ConfirmedPattern | `content, epistemic_type, evidence_reference_ids, feedback_revision_ids, context_scope, assessment_window, goal_context_version_ids, status, confirmation_reference_id, uncertainty, supersedes_id` | A behavior/thinking pattern hypothesis, not a personality/clinical profile; the confirmation basis must trace back to the user's explicit expression |
| ContextManifest | `review_id, owner_id, selected_reference_revisions, purpose, scope, consent_version, retrieval_policy_version, built_at, unavailable_reference_ids` | Stores minimal references/versions and missing-item notes; does not additionally copy the entire history into prompts or a hidden chain of thought |

`selected_guidance` proposed enum: `listening | clarification | task_breakdown | direct_accountability | no_intervention`; only the primary approach actually adopted is recorded; re-selection adds a new guidance revision instead of overwriting the old record. `direct_accountability` may only be selected when the user explicitly requests direct accountability in this Review; historical feedback, historical preferences, or having accepted direct language in the past must not serve as authorization on their own.

`directness` proposal: `gentle | plain | direct | not_applicable`, not an intensity score or additive weight; `no_intervention` uses `not_applicable` and an empty recommendation array. Safety flows mark `status = safety_stopped` and do not pretend to be a normal coaching mode. `trigger = user_opened_review`; the user may retry manually; background tasks must not create new Review guidance.

`status` guidance proposal: `proposed | displayed | stopped | safety_stopped | failed | superseded | evidence_unavailable`. Only `displayed` may be described as displayed; guidance that never actually happened is not saved. `uncertainty` is explicit text/category (known_limits/insufficient/conflicting), not a pseudo-precise probability; `rationale_summary` only explains the selection basis and its limits and is not a raw hidden chain of thought.

ReviewGuidance and ContextManifest form an immutable decision snapshot at the time of the Review: they record the rule/model/Prompt versions and source revisions actually used, rather than only linking to changeable "current values". References point to immutable source revisions resolvable within the retention period; only the minimal authorized content needed for verification is kept, not the full history. Explanation reads use this recorded snapshot and do not re-guess the selection rationale when the user asks afterwards. When a user views feedback or patterns, only the current valid version, content, scope of applicability, status, and confirmation basis of their own objects are returned; objects in `withdrawn | rejected | needs_reconfirmation`, deleted, or `evidence_unavailable` must carry an explicit status and must not be displayed as valid patterns or decision context. Re-selection, feedback corrections, or policy updates add new revisions and associations; they never rewrite the original guidance and its then-basis; if there was no then-basis, it must be acknowledged as unverifiable rather than fabricated. Deletion/withdrawal and retention expiry still propagate per 14.4; snapshots do not constitute a permanent-retention exception.

### 14.2 Feedback typing, immediate effect, and revision

- `feedback_type`: `factual_correction | interpretation_disagreement | style_feedback | suggestion_acceptance | observed_outcome`. One message may be split into multiple entries sharing the same source reference; when ambiguous, mark for clarification instead of silently classifying it for the user as "accepted".
- `agreement = agree | disagree | null`, natural-language `text` may be empty; but once a piece of optional feedback is submitted, at least one of agreement/text/structured correction is present. Not giving feedback does not create agreement or negative feedback.
- `observed_outcome` must carry `outcome_window, evidence_reference_ids, epistemic_type`; user self-reported outcomes are marked as self-reported and are not treated as objective causal verification. Outcomes with no result record remain unknown; inaction is not inferred.
- `scope` defaults to the current Review/target object only; long-term scope must be explicitly confirmed by the user. Style feedback only adjusts expression; accepting a recommendation does not automatically update a Goal; committed changes must specify user behavior. The Review's `accepted` status only means accepting that version and does not prove accuracy or effectiveness.
- Factual corrections create a UserRevision; current interpretation/style feedback immediately supersedes the old basis or wording of this output. Stopping requires no reason and no prior confirmation of a long-term pattern; it cancels undisplayed results and forbids later outputs from continuing that guidance; if saving fails, this session still stops with an explicit notice that it was not saved, and cross-device persistence success must not be claimed.
- After successful persistence, reopening/retrying the same Review uses the effective feedback; a stop is only lifted when the user actively requests resumption. The current stop is not automatically treated as a permanent rule for all future situations.
- Each feedback revision stores `supersedes_id`; the latest effective user revision supersedes old values; history no longer enters decision context but can be viewed per the privacy policy. Concurrent conflicts are not overwritten by AI guesses; the conflict is preserved and the disputed guidance paused, with resolution left to the user as needed.

### 14.3 Pattern confirmation and "learning"

1. `proposed`: the AI may explicitly propose an evidence-backed contextual pattern in this Review; it cannot be retrieved as a long-term established fact.
2. `confirmed | modified`: only when the user explicitly endorses the pattern content and its applicable context in natural conversation (e.g. "Yes, that's right, only in this kind of task") can it be used in subsequent related Reviews; confirmation_reference_id points to that effective feedback. A generic "good", silence, or accepting a recommendation does not count as pattern confirmation.
3. `rejected | withdrawn`: immediately excluded from subsequent retrieval; the interpretation is not repeatedly pushed; history retention obeys the deletion policy and is not kept forever on traceability grounds.
4. `needs_reconfirmation`: when goal/context versions change, contradictory evidence appears, or the deadline expires, it must not continue to count as a valid long-term pattern. New judgments need fresh explicit confirmation; confirmation is not automatically prompted.

The statuses above are proposals. `epistemic_type = ai_inference` keeps its original type even after confirmation and is displayed as "user-endorsed inference"; raw self-reports and inferences must not be conflated. Persistent patterns may not be aggregated across users and must not include sensitive inferences about mental health, personality, illness, etc. that have not been approved for new purposes. The AI only performs restricted retrieval and adaptive expression; policy updates are reviewed separately. Feedback, ConfirmedPattern, ReviewGuidance, acceptance rates, consent rates, or usage data must not become inputs or outputs of model training, fine-tuning, online RL, cross-user aggregated learning, or automatic policy reward/weight updates; they may only be used for retrieval and rule selection within the confirmed same-user, context, and purpose scope.

### 14.3A Accessibility and fairness output boundaries

ReviewGuidance, ReviewFeedback, and ConfirmedPattern must not infer the user's motivation, cooperativeness, discipline, personality traits, or what kind of guidance suits them from Capture/feedback length, recording frequency, fluency of expression, ability to quantify, recommendation acceptance rate, or completion rate. Low-information, brief, non-quantified, intermittent, or assistive expressions are all valid input forms; the system must not use them to narrow `no_intervention`, review-only, reject, stop, correct, or withdraw paths, nor add follow-up questions as a condition for obtaining those paths. This is a G1 output and interaction semantic boundary; presentation, assistive technology, and status/interface implementation are left to G2.

### 14.4 Minimal context and retention/deletion proposals

**Boundaries first**: the Section 9 vendor/region/training-use/retention approvals are still open. The values below are only discussable conservative upper bounds, not user-approved preferences, production configuration, or legal commitments; before approval, only synthetic data is used for validation, with no real data connected. Current AI consent cannot be automatically extended to new sensitive inference purposes.

- Retrieval happens only during user-initiated Review, limited to the current user, the selected period, the current goal versions, and necessary confirmed data. For personal context outside the selected period, the proposal allows only the most recent 30 days, at most 3 still-valid context-matching confirmed patterns, and at most 5 corresponding valid feedback entries; corrections/stops in the current session are not truncated by these limits. When there is no match, other history is not fetched; when insufficient, state that it is unknown.
- Proposed patterns are retrievable for at most 30 days after confirmation; on expiry they become needs_reconfirmation rather than being auto-renewed forever. Feedback is scoped to the current session by default; only feedback explicitly confirmed as cross-Review applies enters the retrieval above. User scope reduction/withdrawal takes effect immediately.
- Raw Capture uses the existing pending retention policy and is not expanded because of the new "learning" in this version; new guidance, feedback, pattern bodies, and their revisions are proposed to be kept at most 90 days, or until the user deletes them earlier. On expiry, bodies and derived copies are deleted; history is not kept indefinitely. If Reviews are kept longer, deleted guidance/feedback only shows an unavailable status and the original text is not rebuilt; if users need longer retention, a separate review is required.
- Active context caches are used only for the current generation, at most 1 hour, and never reused across Reviews; they are invalidated immediately when termination, withdrawal, or deletion happens earlier. The POC does not build a personal vector memory store; future indexing needs separate review.
- When deleting a Capture/feedback/pattern/Review or withdrawing AI use, first stop new retrieval and block old content from continuing to display/generate; cascade to references, summaries, guidance, feedback revisions, and derived copies of patterns. Deletion must clear restorable personal content and must not merely detach IDs while keeping quote/text. The Review's lifecycle status stays unchanged; a separate `evidence_status = available | evidence_unavailable` is introduced, and related Reviews' evidence_status is marked evidence_unavailable; only the user may actively regenerate a new version using remaining permitted evidence.
- The proposed upper bound for physical purge of active storage is 24 hours; backups expire within at most 30 days and are not readable by AI or the product in the meantime. Restoring a backup must first replay deletion markers before opening access; minimal deletion markers contain only object ID/status/time of non-restorable content and are removed after backup purge. "Deletion complete" must not be displayed until the backend/vendor is confirmed capable of delivering it.
- Cloud requests do not train models, and vendor retention must have an approved explicit upper bound (the POC proposes zero retention); if the vendor does not support it, real-data processing is blocked and alternatives are reviewed separately — vendor retention is not accepted by default. Withdrawal only guarantees stopping future sends; already-sent requests must not be claimed as withdrawn; the vendor's purge status and limitations must be communicated.
- Export includes the current user's guidance/feedback/patterns still within lawful retention, valid and historical versions, evidence references/accessible bodies, scope, policy/model/Schema versions, and unavailability markers; it does not resurrect deleted data. It must not contain other users' data or a raw hidden chain of thought; theory material is exported only under lawful authorization.

### 14.5 Synthetic example (pending logical example, not real user data)

This example has no goals and no long-term patterns. feedback-demo-1 is synthetic feedback where the user explicitly said "review only, no recommendations needed" in the review-demo-1 session, with target type review; the feedback is saved and valid; EvidenceReference `evidence-feedback-demo-1` points with `source_type = feedback` to the `feedback-demo-1-r1` version of `feedback-demo-1`, so it is written into references. The example shows only a minimal field projection and does not show the common ID/time/revision wrappers; it does not pretend to be a complete JSON Schema.

```json
{
  "schema_version": "review-guidance-v0.6-proposal",
  "review_id": "review-demo-1",
  "user_id": "synthetic-user-a",
  "trigger": "user_opened_review",
  "status": "displayed",
  "selected_guidance": "no_intervention",
  "directness": "not_applicable",
  "delivered_text": "Sure, this time we'll just review, with no changes planned.",
  "recommendation_ids": [],
  "evidence_reference_ids": ["evidence-feedback-demo-1"],
  "goal_context_version_ids": [],
  "feedback_revision_ids": ["feedback-demo-1-r1"],
  "pattern_revision_ids": [],
  "uncertainty": "insufficient: not enough history to judge long-term patterns",
  "rationale_summary": "The user explicitly needed no recommendations this time; there is no basis for establishing a long-term preference.",
  "policy_version": "adaptive-review-v0.1-proposal",
  "model_id": "synthetic-not-executed",
  "prompt_version": "review-v0.6-proposal"
}
```

This section proposes adding `feedback | guidance | pattern | revision` to EvidenceReference's `source_type`, using the target ID plus the valid revision ID; feedback must not be treated as a Capture fact. Explanations display these sources and limitations on demand; rationale summaries do not disclose internal chain of thought.

### 14.6 Open items and gates

- **D6-01**: P6-02 has been conditionally confirmed at G1 on cross-Review scope and user-control principles; the fields, statuses, valid versions, conflicts, and pattern transitions in 14.1–14.3 are G2 design open items.
- **D6-02**: The retrieval upper bounds, 30/90-day retention proposals, 24-hour/30-day deletion paths, and vendor zero-retention suitability in 14.4 are all deferred to G2; it is explicit that these are new proposals and defaults are not passed off as authorizations.
- **D6-03**: Similarly a four-way choice: export and dependency-invalidation options; if decided together with the existing deletion question in Section 12, the partial supersession must be explicitly recorded, not silently closed.

Open real-data permissions, privacy risk acceptance owners, and vendor capabilities must be recorded at G2 (responsibility assigned and approved by Max); this version performs no data collection, migration, or model training.
