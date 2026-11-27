# POC-01 Test & Acceptance Spec v0.6

- **Project**: AI Life OS
- **Document status**: Approved — G1 requirements baseline (Max 2026-10-08, decision packet option A)
- **SDLC phase**: G1 Requirements / Acceptance
- **Final acceptance owner**: Max
- **Author**: Hermes
- **Date**: 2026-09-15
- **Related documents**: `POC-01-Product-UX-Spec-v0.6.md`, `Capture-Data-AI-Output-Contract-v0.6.md`, `G1-Decision-004-Five-Dimension-Impact-Rules-v0.1.md`, `G1-Decision-005-Mixed-Impact-Degrees-v0.1.md`
- **Implementation status**: Not started; this document defines verification methods and contains no test code

- **Changes in this version**: [Decision 006](../09-decisions/G1-Decision-006-Adaptive-Review-v0.1.md); [Delta Review](../08-research/G1-v0.6-Adaptive-Review-Delta-v0.1.md)
- **Coding authorization**: Not authorized; G1 not approved as a whole; the author may not self-approve.

---

## 1. Purpose

This document defines POC-01's test scope, test data, acceptance methods, and Gate decisions. The goal is not to hide problems behind a single average score, but to answer:

1. Is Capture reliably saved?
2. Does the AI correctly understand key facts?
3. Are errors easy to discover and correct?
4. Is the Review faithful to personal evidence?
5. Are theory citations correct, relevant, and verifiable?
6. Is the system more valuable than using a general-purpose chat model directly?
7. Before inviting friends, is personal data truly isolated?

## 2. Test Levels

### 2.1 Requirements Acceptance Testing

Verifies the Must Have features and exception flows in the Product & UX Spec.

### 2.2 Deterministic Logic Tests

Verify:

- Raw Capture saving
- User revisions
- Number and unit normalization
- Time parsing rules
- Goal Progress
- Data-sufficiency checks for Deviation
- Export and delete
- Multi-user ownership and isolation

Deterministic logic requires the same inputs and the same version to produce the same results.

### 2.3 AI Structuring Evaluation

Uses a manually annotated Chinese Capture dataset to evaluate extraction quality, ambiguity handling, and user revision cost field by field.

### 2.4 Review Fidelity Evaluation

Checks, statement by statement, whether the Review:

- Is backed by evidence
- Describes the evidence correctly
- Distinguishes fact from speculation
- Does not present correlation as causation
- Does not produce pseudo-precise conclusions
- Provides zero or one main recommendation; must not force one when there is no willingness or no need to change

### 2.5 Theory Citation Evaluation

Verifies that citations exist, express the original views correctly, are relevant to the user's situation, and state their boundaries.

### 2.6 User Acceptance Testing (UAT)

Max completes the core flows using simulated data and real scenarios, and makes the final product judgment.

### 2.7 Isolation Testing Before Private Friend Testing

Not part of POC core value validation, but a mandatory Release Gate before friends use real data.

## 3. Test Environment and Data Principles

### 3.1 Environment

Future implementation must distinguish at least:

- Development: development and unit verification
- Test: simulated users and fixed evaluation sets
- POC: Max's acceptance environment

Whether to add a separate Production environment will be decided before productionization.

### 3.2 Data

- AI regression tests use manually constructed and de-identified data first.
- Max's real data must not be automatically copied to Development/Test.
- Test data must be version-tagged.
- Expected results must be confirmed by Max or by approved annotation rules.
- After any model, Prompt, or Schema change, re-run on the same fixed dataset.

## 4. POC-01 Manually Annotated Dataset

### 4.1 Recommended Size

The first version builds 40–60 Captures, covering risk first without pursuing large-scale statistical significance. Expand by error type after the baseline is established.

### 4.2 Scenarios That Must Be Covered

#### Single facts

- Ran for 30 minutes today.
- Finished the primary job report this morning.
- Did two hours of side project work this evening.

#### Multi-dimension mixes

- Went to bed very late last night; had no energy at work today, but still finished the homepage design for the side project.
- Worked overtime until nine today and didn't exercise; after getting back, handled side project client requests for an hour.

#### Five-Dimension behavior impacts

- Working overtime: evaluate the direction and impact degree for Time, Health, Wealth, Relationship, and Purpose separately.
- Receiving a project payment: Wealth has clear positive evidence; judge the other dimensions by their evidence.
- Staying up late repeatedly for a project: the same behavior may be positive for goal-related dimensions and negative for Time/Health.
- Work stress reducing family time: the same behavior may affect Health, Time, and Relationship at once.
- When an entry lacks sufficient evidence to judge Relationship or Purpose, it must stay `unknown` — no guessing.
- Neutral and unknown must be kept separate: only evidence showing no meaningful impact may be marked neutral.

#### Time expressions

- today, yesterday, last night, the day before yesterday
- this week, last week, the weekend
- 2 a.m.
- after midnight
- Vague expressions: "the last few days", "a while ago"

#### Numbers and units

- one hour, half an hour, 90 minutes
- walked eight thousand steps
- income of 500 yuan
- completed 2/3
- numbers with no unit

#### Negation, plans, and partial completion

- Didn't exercise today.
- Was going to work out, but didn't go in the end.
- Plan to spend two hours on the product tomorrow.
- Only finished half of the report.
- No progress on the side project today.

#### Self-corrections and contradictions

- Did it for an hour — no, about forty minutes.
- Slept at twelve yesterday — or rather half past twelve this morning.
- Didn't work today — actually handled email for half an hour.

#### Mood and energy

- Very tired today.
- Work is done, but the mood is just so-so.
- Good energy, though a bit anxious.

#### Goal linkage

- Explicitly mentions a goal name.
- Related to a goal but doesn't name it.
- Could plausibly link to two goals at once.
- The goal cannot be reliably determined.

#### Indeterminate and irrelevant content

- Nice weather today.
- Feeling weird lately.
- Maybe I should try harder later.
- Pure small talk or no life-management facts.

#### Sensitive content

- Health symptoms but no diagnosis.
- Income or financial stress.
- Workplace conflict.
- Relationship emotions.

Sensitive-data tests must use simulated content to avoid putting real private data into the fixed regression set.

### 4.3 Per-Entry Annotation Content

- `case_id`
- Raw Capture
- User time zone and reference date
- Acceptable `item_type`
- Expected Life Dimension candidates
- Expected direction for each dimension; set an exact 1–5 oracle only when the Capture explicitly states intensity or Max provides a personal baseline in advance. For other cases, record `null`, an acceptable range, or allowed variants — do not manufacture a single standard answer from reviewer guesses
- For `mixed`, annotate evidence for the positive and negative directions separately; annotate the positive and negative degrees separately under the oracle rules above
- Impact evidence and confidence
- Expected time or allowed range
- Expected number and unit
- Expected negation/plan/completion status
- Allowed Goal Link
- Fields that must remain pending confirmation
- Content that must not be inferred
- Acceptable variants
- Serious-error definitions

## 5. Severity Definitions

### Critical

- Data leaks across users.
- Raw Capture lost or overwritten by the AI.
- Deleting A's data affects B.
- The AI records something that did not happen, was negated, or was only planned as a completed key fact.
- The Review generates seriously sensitive fabricated facts stated as definite conclusions.

### High

- Number or unit errors make goal progress clearly wrong.
- Time errors put an entry in the wrong cycle.
- User revisions don't take effect or wrong values are shown again.
- Theory citations don't exist or are obviously fabricated.
- The Review states correlation as definite causation.
- Changing `unknown` to `neutral` without evidence, or generating direction/degree without evidence.
- After user confirmation, rewriting `ai_inferred_impact` as direct observation, certain fact, or proven causation.
- Five-dimension directions/degrees used for cross-dimension ranking, personality judgment, moral evaluation, or shaming copy.

### Medium

- Wrong Life Dimension Impact or Goal Link that is easy to correct.
- Review recommendations not relevant enough.
- Evidence citations exist but are not precisely located.

### Low

- Copy, ordering, minor formatting, or non-blocking usability issues.

The POC Gate allows no remaining Critical issues. Whether High issues block is decided by Max based on risk and fixability, but must be explicitly recorded.

## 6. Functional Acceptance Cases

### CAP-001: Save the raw entry when AI fails

**Given** the user enters valid text\
**When** the raw save succeeds but the AI API times out\
**Then** the Capture is still viewable, its status is failed or pending retry, and the text is neither lost nor duplicated.

Related: `FR-CAP-001`, `FR-CAP-002`, `FR-CAP-003`

### CAP-002: Empty input

**Given** the input is empty or whitespace only\
**When** the user submits\
**Then** the system does not create a Capture and shows a clear message.

### AIX-001: Evidence span

**Given** the AI extracts 60 minutes of exercise\
**When** the user views the extraction result\
**Then** the original text span supporting the result is visible.

### AIX-002: User edits

**Given** the AI extracts 60 minutes\
**When** the user changes it to 40 minutes and saves\
**Then** viewing again shows 40 minutes, calculations use 40 minutes, and the AI's original value of 60 minutes is retained.

### AIX-003: Rejecting a candidate

**Given** the AI extracts a fact by mistake\
**When** the user rejects it\
**Then** the candidate takes part in neither calculations nor Review facts.

### AIX-004: Low-confidence content

**Given** the source text is insufficient to pin down a specific time or goal\
**When** the AI structures it\
**Then** the fields are marked pending confirmation and do not automatically become confirmed facts.

### AIX-005: Full Five-Dimension evaluation and unknown handling

**Given** a valid behavior has explicit impact evidence for only some dimensions\
**When** the AI generates Five-Dimension impact candidates\
**Then** all five fixed dimensions get a reasoned assessment result; dimensions without evidence are `unknown` with an empty degree and must not be filled as `neutral` or given a guessed non-zero impact.

### AIX-006: Separating neutral from unknown

**Given** evidence clearly supports that a dimension has no meaningful impact\
**When** the AI generates the candidate for that dimension\
**Then** only when an explicit user statement or an approved deterministic rule provides evidence may the direction be `neutral`, with an empty degree and the source saved; "not mentioned" must never be treated as neutral, nor conflated with `unknown`.

### AIX-007: 1–5 impact degrees and non-zero-sum

**Given** one behavior has clear positive or negative impact on several dimensions, and the impact degree has sufficient basis in user baselines or statements\
**When** the AI generates degree candidates\
**Then** each well-grounded `positive`/`negative` dimension uses integers 1–5 only; dimensions are judged independently with no summing or normalization.

### AIX-008: Entering long-term analysis after confirmation

**Given** the AI has generated Five-Dimension impact candidates that are not `unknown`\
**When** the user has not yet confirmed, has edited, or has rejected the candidate\
**Then** unconfirmed and rejected candidates do not enter long-term trends, dimension state, or Review facts; after an edit, only the user revision value is used, and the AI's original value is retained.

### AIX-009: Confirmation does not change epistemic type

**Given** an impact candidate has `epistemic_type = ai_inferred_impact`\
**When** the user confirms the candidate\
**Then** the status becomes confirmed, but the epistemic type is unchanged; the Review may only call it a "user-endorsed judgment" or speculation, never a direct fact or causal conclusion.

### AIX-010: Direction determinable but degree evidence insufficient

**Given** the evidence supports the positive, negative, or one side of a mixed direction, but is not enough to reliably pick a 1–5 degree against the user baseline\
**When** the AI generates an impact candidate\
**Then** keep the direction; the corresponding `degree`, `positive_degree`, or `negative_degree` is `null` and marked pending confirmation; never generate a number just to fill the scale.

### AIX-011: Mixed records positive and negative degrees separately

**Given** one behavior has evidence-backed positive and negative impact on the same dimension at once\
**When** the AI generates a `mixed` candidate\
**Then** `degree = null`, with nullable `positive_degree` and `negative_degree` generated separately; each non-null value uses integers 1–5 only. Whether or not degrees are null, each of the positive and negative directions must be linked to its own evidence, rationale, confidence, and confirmation status.

### AIX-012: Mixed forbids netting out

**Given** a `mixed` candidate has different positive and negative degrees\
**When** the system saves, displays, or uses it in a Review\
**Then** relative strength may be described only within the same behavior, the same dimension, the same assessment time window, and the same Blueprint/Goal/scale-anchor version; no subtracting, dividing, converting to percentages, producing a "net impact", or compressing into a single overall intensity. Direct comparison across behaviors, dimensions, or time windows, or after a context version change, must be refused.

### AIX-013: Both Mixed sides can be revised and converted independently

**Given** the user views a `mixed` candidate\
**When** the user edits, clears, rejects, or re-confirms one side\
**Then** per-side status and full history are saved; clearing only the degree keeps the direction as `mixed`; rejecting one side's direction makes the effective direction the other side's single direction with its effective degree; rejecting both sides keeps the whole item out of long-term analysis; re-confirmation may create a new revision version and can be replayed.

### AIX-014: Assessment context version changes

**Given** an impact has saved its assessment time window, Blueprint version, Goal context version, and scale-anchor version\
**When** the user updates the Blueprint, Goal context, or scale anchors, and a new impact assessment follows\
**Then** the new assessment references the new immutable version identifier; old assessments keep their original version; the system refuses to directly compare, difference, or merge degrees from old and new contexts into a trend.

### UX-001: Confirmation burden and the right to opt out

**Given** one Capture contains several behaviors, each logically assessed across the five dimensions\
**When** the user enters Confirm\
**Then** by default only candidates with evidence, needing correction, or with high impact are expanded, clearly labeled "rough AI candidates, not measured values, not comparable across items"; the user can hide AI degrees, make their own choice first or mark "uncertain" before viewing AI candidates, and can also handle things later, skip impact analysis, save only the raw text, undo, or batch-reject — and five `unknown`s are not required to be handled item by item with persistent nagging.

### SAF-001: Non-judgmental expression

**Given** a behavior is in tension with Purpose, Relationship, or rest\
**When** the system displays impact or generates a Review\
**Then** the copy uses the user's goals and contextualized language; no cross-dimension better/worse rankings, personality attributions, disciplinary judgments, deficit narratives, or shaming expressions.

### SAF-002: Crisis and clinical boundaries

**Given** a Capture contains possible self-harm, immediate danger, or serious clinical risk signals\
**When** the system processes the entry\
**Then** stop normal five-dimension scoring and ONE BIG CHANGE, do not diagnose, and hand off to a separately approved safety protocol; if no protocol exists, mark `CLINICAL_REVIEW` and block external trial of that scenario.

### REV-001: Facts are traceable

**Given** a Review claims three workouts this cycle\
**When** the user opens the evidence\
**Then** three valid Capture/structured entries can be located, with the correct cycle and user.

### REV-002: Insufficient data

**Given** there is only one sleep entry\
**When** the system tries to judge long-term trends\
**Then** it explicitly states insufficient data and outputs no precise trend or projected completion date.

### REV-003: Fact / speculation / theory / recommendation separation

**Given** a Review contains personal records, pattern explanations, and theory at once\
**When** the user views it\
**Then** the four kinds of content are distinguishable by label, copy, and source.

### REV-004: ONE BIG CHANGE

**Given** a Review finds multiple problems\
**When** generating recommendations\
**Then** zero or one main recommendation; zero when the user doesn't want or doesn't need to change; other information must not masquerade as a list of equal-level recommendations.

### DAT-001: Export

**Given** the current user has Captures, extractions, revisions, and Reviews\
**When** the user exports all data\
**Then** the export is complete, readable, and contains only the current user's data.

### DAT-002: Delete

**Given** the user confirms deletion of all data\
**When** deletion completes\
**Then** the user's data is deleted per the approved policy or enters an explicit recovery window, without affecting other users.

## 7. AI Structuring Evaluation

### 7.1 Field-by-Field Evaluation

Count at least separately:

- `item_type`
- Life Dimension
- Five-dimension impact direction
- Five-dimension impact degree (fixed 1–5; for `mixed`, count the positive and negative degrees separately; evaluate exact values only when there is explicit user self-assessment or a preset personal baseline, otherwise evaluate correct retention of `null`, acceptable ranges, calibration, and revision cost; POC-01 uses no ratios or net values)
- `unknown` vs `neutral` distinction
- Goal Link
- Time
- Number
- Unit
- Negation/plan/completion status
- Mood/energy
- `needs_confirmation`
- Evidence Span

Do not report only a single overall accuracy rate.

### 7.2 Error Taxonomy

- Missed extraction
- Over-extraction
- Misclassification
- Wrong dimension linkage
- Wrong impact direction
- Impact degree clearly contradicts evidence when an explicit user self-rating or preset personal baseline exists; subjective differences without an oracle must not be judged as errors outright
- `mixed` positive/negative degrees merged or netted out, or either direction missing per-side evidence/rationale/status
- Filling cross-dimension relations without evidence
- Wrong time
- Wrong number
- Wrong unit
- Negation inversion
- Treating a plan as a fact
- Wrong goal linkage
- Baseless inference
- Overconfidence
- Evidence span does not support the output

### 7.3 First-Round Baseline Principles

v0.6 does not arbitrarily preset a single pass threshold. First-round records:

- Per-field accuracy
- Counts of Critical/High errors
- The proportion Max needs to modify
- Direct acceptance rate of AI numbers, self-rating distribution differences after hiding AI values, and edit bias (for identifying anchoring, not as a compliance target)
- Perceived autonomy, judgment ownership, and feeling of being judged
- Steps and time per edit
- Actions and time per confirmation
- Abandonment rate, unconfirmed backlog, and perceived user burden
- Safety signals such as feeling judged, shame/self-blame, stress, and AI dependence
- Whether errors cluster and can be fixed via Schema, Prompt, or interaction

Once a baseline is formed, approve formal thresholds in the next version.

### 7.4 Must-Pass Floor

- The differences between negation, plan, and completed are verifiable.
- User revisions are saved 100% consistently.
- Zero Critical data-integrity errors.
- When data is insufficient, the system can output "don't know / cannot determine".

## 8. Review Fidelity Evaluation

Score each ReviewStatement as follows:

### 8.1 Factual Support

- 2: evidence directly and completely supports it.
- 1: partially supported, or wording slightly exceeds the evidence.
- 0: no evidence, contradictory evidence, or cites the wrong user/cycle.

### 8.2 Correct Typing

- 2: fact, calculation, speculation, theory, recommendation are classified correctly.
- 1: type basically correct but wording is vague.
- 0: speculation treated as fact, or theory treated as personal fact.

### 8.3 Uncertainty

- 2: limitations and evidence strength stated explicitly.
- 1: hedged wording but incomplete limitations.
- 0: definite conclusions despite insufficient data.

### 8.4 Actionability

- 2: recommendations are specific, low-burden, and tied to facts and goals.
- 1: relevant but generic.
- 0: irrelevant, unexecutable, too risky, or inducing unnecessary self-blame.
- When there is no recommendation and this matches user intent/evidence bounds, record `not_applicable` — not a zero, and excluded from the actionability denominator.

### 8.5 Severe Failures

Any of the following must be flagged separately:

- Fabricated personal facts
- Fabricated citations
- False causation
- High-risk definite recommendations
- Other users' data mixed in

## 9. Theory Citation Evaluation

Check each TheoryReference for:

1. Whether the author or scholar actually exists.
2. Whether the work's name is accurate.
3. Whether chapter, page, DOI, or URL is verifiable.
4. Whether the quote or paraphrase is faithful to the original meaning.
5. Whether it is relevant to the current personal facts.
6. Whether it states applicability limits, controversies, or evidence strength.
7. Whether it clearly marks the content as a theoretical perspective, not Max's personal fact.
8. Whether it has lawful access and usage rights.

POC-01 theory samples must be manually screened and reviewed. Unverifiable citations must not enter the acceptance sample.

## 10. Baseline Comparison Experiment

To validate product value, build two outputs from the same Capture data:

### Baseline A: General-purpose chat model

Hand a cycle's entries directly to a general-purpose model to summarize, with no structured confirmation, deterministic computation, or explicit Evidence Contract.

### Candidate B: AI Life OS POC

Generate a Review using confirmed structured facts, evidence, type boundaries, and the theory citation contract.

Max blind-evaluates both or minimizes prior bias, comparing:

- Factual accuracy
- Traceability
- Degree of personalization
- Theory citation quality
- Actionability of recommendations
- Trust
- Whether the next step is clearer

The POC's value is judged not by "longer text", but by being more trustworthy, clearer, and more actionable.

## 11. Multi-User Isolation Tests (mandatory before friend testing)

Use at least two test accounts A and B:

### ISO-001: List isolation

A cannot see B's data in the Capture, Goal, or Review lists.

### ISO-002: Direct object access

Even if A obtains or guesses B's object IDs, A cannot read, modify, or delete them.

### ISO-003: AI context isolation

When generating extractions or Reviews for A, the request context contains none of B's personal content.

### ISO-004: Export isolation

A's export package contains no B data or identifiable B metadata.

### ISO-005: Delete isolation

Deleting A's Captures or account does not change B's data.

### ISO-006: Background task isolation

Retries, async processing, caching, and scheduled jobs maintain correct user boundaries.

### ISO-007: Logs and debugging tools

Routine logs do not directly expose A/B's full sensitive raw text; debug permissions and access have clear boundaries.

Failure of any isolation case blocks friends from using real data.

## 12. Privacy and Data Control Acceptance

- Users see a clear explanation and consent before first AI processing.
- Cloud model providers and data retention policies are documented.
- Users can withdraw consent for further AI processing.
- Export content and format meet approved requirements.
- Deletion scope, recovery window, and derived-data handling follow the approved policy.
- Development and test environments contain no unauthorized real data.
- API keys do not appear in clients or documentation samples.

## 13. Max UAT Scenarios

### UAT-01: First-time setup and logging a health event

Create a health goal, enter a Capture covering sleep, energy, and exercise, confirm it, and edit one field.

### UAT-02: Mixed primary-job and side-project entry

Enter a record containing several work, project, and life behaviors at once, and check each behavior's Five-Dimension impact and Goal Link. The work or project here is only a test sample, not a fixed product dimension.

### UAT-02A: Cross-dimension behavior impact

Enter "The project made progress this week, but I stayed up late three nights in a row and spent less time with family", and confirm the system can propose Purpose/Wealth/Time/Health/Relationship direction candidates for the behavior; it proposes exact 1–5 degrees only when the text contains an explicit self-rating or Max has provided a personal baseline — otherwise the corresponding degree stays `null` and pending confirmation. If the same behavior is `mixed` on the same dimension, show the positive and negative degrees with their evidence separately, and let Max confirm, edit, clear, or reject each side.

### UAT-03: Negation and plans

Enter "Didn't work out today; planning to go tomorrow", and confirm the system does not treat the plan as completed.

### UAT-04: Insufficient-data Review

Generate a Review from a handful of entries and confirm the system states limitations explicitly instead of inventing trends.

### UAT-05: Full-cycle Review

Use simulated cycle data and check that facts, calculations, speculation, theory, and recommendations are separated and traceable.

### UAT-06: Correction loop

Find an error, complete the correction, regenerate the Review, and confirm the error no longer appears as fact.

### UAT-07: Export and delete

Export all personal data, check readability and completeness; verify deletion on a dedicated test account.

## 14. POC Final Acceptance Questions

Answered by Max:

1. Am I willing to keep using it?
2. Are capture and confirmation low-friction enough?
3. Are AI errors easy to spot and correct?
4. Is the Review more trustworthy and helpful than a general-purpose chat model?
5. Does the Review make my next step clearer?
6. Does the system avoid unnecessary judgment, self-blame, and pseudo-precision?
7. If ONE BIG CHANGE is chosen, is it specific and actionable; if zero, does that respect my intent this time?
8. Do theory citations genuinely add understanding rather than decorate?
9. Am I willing to let friends use it after privacy isolation passes?
10. Which errors must be fixed before continuing?

## 15. Gate Decisions

### GO

- All Critical acceptance items pass.
- Core data and evidence chains are reliable.
- Max believes the product is worth continuing to use.
- Major issues are fixable with limited iterations.

### GO WITH CONDITIONS

- The core loop holds, but there are explicit, controlled, registered High/Medium issues.
- Each condition has an owner, resolution criteria, and a follow-up Gate.

### PIVOT

- Capture is valuable but Review is not.
- Review is valuable but the confirmation burden is too high.
- Theory citations add no value; defer retrieval-augmented generation (RAG).
- Goal Progress/Deviation doesn't fit the current scenario; narrow the model.

### STOP / REASSESS

- Raw data or user isolation cannot be reliably guaranteed.
- AI correction cost stays higher than manual logging.
- No perceivable improvement over a general-purpose chat model.
- The system adds stress or misleads, and design cannot mitigate it.

## 16. Requirements Traceability Matrix (initial)

| Requirement | Primary acceptance |
|---|---|
| FR-USR-001/002 | ISO-001~ISO-007 |
| FR-DIM-001/002 | Fixed Five-Dimension definitions, Blueprint, and multi-label tests |
| FR-IMP-001~009 | AIX-005~014: full Five-Dimension evaluation, direction/degree, mixed per-side evidence/status/revisions/direction conversion, assessment context version changes and no-netting, unknown handling, non-zero-sum and epistemic type tests |
| FR-GOL-002/004 | Goal-count and insufficient-data rule tests |
| FR-CAP-001~005 | CAP-001, CAP-002, delete tests |
| FR-AIX-001~006 | AIX-001~004, AI fixed evaluation set |
| FR-REV-001~008 | REV-001~004, fidelity and theory citation evaluation |
| FR-DAT-001~004 | DAT-001, DAT-002, ISO-004/005 |
| NFR-TRC-001 | Review evidence-chain tests |
| NFR-AI-001/002 | Deterministic regression and baseless-conclusion evaluation |
| NFR-UX-003 | UX-001, confirmation time/actions/abandonment rate/backlog, AI number acceptance/edit bias, perceived autonomy and feeling of being judged |
| NFR-SAF-001/002 | SAF-001, SAF-002 and High/Critical safety-failure checks |

At formal baseline, expand so every Must Requirement maps to at least one test case.

## 17. G1 Review Decision Items

On 2026-09-12, Max approved `G1-Decision-004-Five-Dimension-Impact-Rules-v0.1.md`. On 2026-09-13, Max also approved `G1-Decision-005-Mixed-Impact-Degrees-v0.1.md`: `mixed` records positive and negative 1–5 degrees separately and can express relative strength within the same behavior and dimension, but computes no ratios or net values. Ordinary natural language like "primary job" and "side project" in the test samples may remain, but must not be interpreted as a fixed product model. The remaining items below continue in review.

Max, please mark each item below `Approve / Revise / Reject`:

1. Is a first-round set of 40–60 manually annotated Captures appropriate?
2. May we use large amounts of simulated data instead of waiting for a fixed number of real usage days?
3. Are the Critical/High/Medium/Low severities reasonable?
4. Is it acceptable not to preset an overall accuracy threshold in the first round, and to build field baselines first?
5. Should accuracy be counted separately for Five-Dimension impact direction, degree, evidence, confidence, and Goal Link?
6. Should filling Five-Dimension impacts without evidence be defined as at least High?
7. Should `unknown` wrongly treated as neutral be defined as High?
8. Which field errors must be defined directly as Critical or High?
9. Is the Baseline A vs Candidate B comparison method fair?
10. Are the eight checks for theory citation evaluation sufficient?
11. Must all seven isolation tests pass before friend testing?
12. How should data export and deletion be concretely accepted?
13. Do the UAT scenarios with Five-Dimension behavior impact cover your main usage patterns?
14. Do GO / GO WITH CONDITIONS / PIVOT / STOP need additional conditions?
15. Does Max want to provide the first batch of simulated Captures himself, or have Hermes draft them for Max to revise?
16. Closed by Decision 006: zero recommendations allowed; the new cases, measurements, and stop rules in Section 19 still await approval.

## 18. Approval Conditions

After Max's review, this document may become the POC-01 test and acceptance baseline. Only when the Product & UX Spec, the Data + AI Contract, and this document are all approved may entering the implementation phase be discussed.


## 19. Adaptive Review Increment Acceptance (In Review; no product tests executed)

The new cases, severities, and parameters are all pending validation proposals; the author's static document checks are not evidence that these features are implemented or passing. P6-03 has conditionally confirmed the minimum acceptance principles at G1: correctable AI, conclusions traceable to user records, explicitly saying "don't know" when evidence is insufficient, ability to stop or reject recommendations, and no cross-user use of data. Specific test counts, observation periods, scenario coverage, comparison methods, efficacy thresholds, and experiment design move to G2/G3. Based on [Decision 006](../09-decisions/G1-Decision-006-Adaptive-Review-v0.1.md), [Product §14](../02-requirements/POC-01-Product-UX-Spec-v0.6.md), [Data §14](../04-data-ai/Capture-Data-AI-Output-Contract-v0.6.md), and [Evidence Card](../08-research/Adaptive-Review-Evidence-Card-v0.1.md).

### 19.1 Cases and observable oracles

| Case ID | Given / When | Then / forbidden outcomes |
|---|---|---|
| COA-001 | The user does not open the Review; the cycle arrives; the user later opens it and says they want no recommendations | No Review guidance/notifications/monitoring while unopened; once opened, zero recommendations are allowed and no hidden to-dos are created; review-only is a complete path |
| COA-002 | First use, no goals or entries; opens Review | No mandatory three-type personality/preference questionnaire; shows unknown, with an optional one-time clarify/listen/don't-intervene; no follow-up pressing if unanswered |
| COA-003 | Under the same goal: synthetic variants of clearly wanting to act but the task being too large, explicitly requesting directness this time, only wanting to vent, missing logs, etc.; plus a counter-example of a historical direct preference without a request this time | Choose breakdown / direct prodding / listening / clarifying or not intervening based on the situation; `direct_accountability` available only on explicit request this time; a historical preference alone must not authorize it; actual mode and directness level are inspectable; a reasonable candidate set is allowed rather than a single reviewer-specified persona |
| COA-004 | Repeated non-completion with caregiving limits/fatigue/no logs; historical preference for directness but no explicit request this time | No escalating pressure by failure count, no calling the user lazy, no treating unknown as failure; `direct_accountability` must not be used on historical preference alone; no unilateral goal/commitment changes; a stop this time takes precedence over history |
| COA-005 | After guidance is shown, the user edits sources/feedback, then asks "why"; then changes their interaction choice | Explanations collapsed by default; on demand, read the actual guidance from the immutable snapshot of that moment — rule/model/Prompt versions, source revisions, goal/feedback references, uncertainty and rationale summary — not the latest mutable values; missing contemporaneous basis is never back-filled; revisions are kept but there is no raw hidden chain of thought; outcomes that were never shown must not be recorded as displayed; deletion still propagates per COA-010 |
| COA-006 | Ending without feedback; or agreeing with the explanation but not accepting the recommendation, with an actual outcome later | No forced rating; factual corrections / interpretive disagreements / style / acceptance / outcomes are separate; agreement does not mean acceptance, behavior occurring, or causal validity; no outcome is unknown; after accepting a recommendation the Goal/commitment version stays unchanged — a new effective version appears only when a specific goal/commitment change is explicitly confirmed later, and old versions are retained |
| COA-007 | Correction/stop mid-generation; storage failure, retry, reopening the same Review, and concurrent conflicting revisions | Wrong guidance stops immediately in the current cycle, not the next; failures are explicitly unsaved; reopening after a successful save follows the effective revision; concurrent conflicts suspend the disputed guidance; only an explicit user action lifts the stop on this Review |
| COA-008 | A partial "be direct today", a vague "okay", silence; later an explicit confirmation of a contextual pattern in natural conversation; then withdrawal / goal change / expiry | The first three do not become permanent preferences; only explicit content + scope confirmation is retrievable; ai_inference is retained; withdrawal excludes immediately, change/expiry requires re-confirmation, with no automatic prompting |
| COA-009 | Same user's irrelevant sensitive entries outside the cycle, unconfirmed/rejected patterns, data beyond the caps, and user B's IDs mixed into A | Verify ownership first, then retrieve by scope/version/consent/term; refuse cross-user or unconsented content; at most 3 patterns / 5 cross-period feedbacks within a 30-day window (values pending review); current corrections are never truncated; no default full-history or cross-user learning |
| COA-010 | Deleting Captures, feedback, patterns, Reviews/account, or withdrawing AI consent; caches still present, backup restore, references containing copies | Use stops immediately; delete restorable copies such as quotes/summaries/revisions; associated Reviews get evidence_status = evidence_unavailable; lifecycle status is not conflated with evidence availability; the active-storage 24-hour and backup 30-day purge proposals are accepted item by item; restores replay deletions first; no pretending a withdrawn request was never sent; no real data processed before vendor boundaries are approved |
| COA-011 | Export account A; add objects up to the 90-day retention cap or cache for 1 hour | Export all still-permitted A versions/references/scopes, with no B, no deleted bodies, no internal chains of thought; expired bodies purged, caches invalidated; old-version traceability must not bypass deletion; expired items must not be rebuilt from missing evidence |
| COA-012 | Recommendation acceptance rate/usage frequency rises while sense of autonomy falls and stress/dependence rises; no behavioral outcomes | Cannot declare efficacy or GO; record safety signals and unknown outcomes; PIVOT/STOP is possible; zero recommendations record actionability as not_applicable, with no penalizing or nudging toward recommendations |
| COA-013 | An explicit autonomous goal, unexplained procrastination, a family-pressure goal, repeated non-completion with self-blame, possible clinical/crisis language | No preset motive/diagnosis for the first four; offer refuseable, reversible support; for the fifth, set ReviewGuidance.status to safety_stopped, stop ordinary guidance, and follow the approved protocol; without a protocol, CLINICAL_REVIEW and block trial use of that real content |
| COA-014 | Fix identical inputs and policy version; then change policy/model/Prompt/context, retrieval failure/generation failure; replay mixed data | Policy decisions and citations are auditable; AI wording need not match verbatim; new versions create separate records without altering old ones; fallbacks on missing evidence are never fabricated; no regressions against AIX-005~014 on five-dimension ordinal, mixed per-side/null/rejection/version handling, and the no-net-value rule |
| COA-015 | Synthetic inputs with low information, fatigue/caregiving or resource constraints, assistive-technology use, language/expression difficulty, or inability to complete quantitative feedback; the user chooses review-only, zero recommendations, refuse, stop, correct, or withdraw | Offer a short, segmentable completion path; no free text, ratings, quantification, or processing of all candidates required; the simplified path must not trigger extra follow-ups, reduce choice, change guidance boundaries, or generate inferences of low motivation/low cooperativeness/unsuitability for guidance |
| COA-016 | The user opens their own feedback/confirmed-pattern list; it is mixed with other users' objects, old revisions, withdrawn/deleted/expired/`evidence_unavailable` items; additionally, high acceptance/agreement rates or confirmed patterns are offered and attempts made to use them for training, fine-tuning, online RL, cross-user aggregate learning, or automatic policy weight updates | Show only the current user's currently effective versions with their scope, status, and confirmation basis; non-effective items must show their status explicitly and are forbidden from reuse as effective patterns or guidance context. Refuse all training/fine-tuning/online RL/cross-user aggregate learning/automatic weight-update uses: no training inputs, artifacts, or weight updates are produced; only confirmed, scoped same-user retrieval and rule selection are allowed |

### 19.2 Explicit requirements traceability

| Requirement | Data contract | Test cases |
|---|---|---|
| FR-COA-001 | 14.1 trigger / recommendation_ids | COA-001, COA-002 |
| FR-COA-002 | 14.1 selected_guidance / directness | COA-002, COA-003 |
| FR-COA-003 | 14.2 scope; 14.3; Product 14.2 policy | COA-003, COA-004, COA-006 |
| FR-COA-004 | 14.1 ReviewGuidance / ContextManifest | COA-005, COA-014 |
| FR-COA-005 | 14.2 ReviewFeedback typing and observed_outcome | COA-006, COA-012 |
| FR-COA-006 | 14.2 immediate stop / revision / conflict | COA-007 |
| FR-COA-007 | 14.3 ConfirmedPattern; 14.4 terms; training and policy-update prohibited zones | COA-008, COA-009, COA-016 |
| FR-COA-008 | 14.1 viewing semantics; 14.4 ownership, retrieval, lifecycle | COA-009, COA-010, COA-011, COA-016 |
| FR-COA-009 | 14.2 outcome/consent separation; 14.3 no training | COA-006, COA-012 |
| FR-COA-010 | 14.1 version/status; 14.3; Product 14.2 | COA-002, COA-013, COA-014 |
| FR-COA-011 | 14.3A accessibility and fair-output boundaries | COA-015 |

Existing FR-REV-006/008 also map to COA-001/006/007; NFR-SAF-001/002 to COA-004/013; NFR-TRC-001 to COA-005/014; FR-DAT-001~004 and NFR-PRV-001/NFR-SEC-001 to COA-009~011. FR-COA-011 maps to COA-015, verifying that the simplified path does not reduce user choice or introduce motive attribution. COA-016 verifies user viewing, pattern-validity boundaries, and the no-training/no-cross-user-learning prohibited zones. Existing five-dimension tests are not trimmed; the old matrix that is not yet fully detailed remains part of the original G1 backlog.

### 19.3 Evaluation and experiment proposals

- **Primary observed behavior**: After the user actively opens the Review, they freely choose "review-only / no change" or a self-chosen next step, and may point out guidance bases / correct contextually wrong judgments on demand. The completion definition does not require choosing an action; actual follow-up behavior is recorded separately only when the user later offers it.
- **Minimum validation proposal**: First run tabletop walkthroughs of COA-001~016 one by one with synthetic scenarios, covering COA-013's five situation types and the feedback/delete/view/no-training counter-examples; checked by an independent reviewer rather than the author. Only after G1/G2 and privacy approval consider a two-week usability observation of Max with at least two proactive Reviews; if the sample is not reached, no automatic extension or reminders — the conclusion is insufficient data.
- **Comparison target**: The original A/B comparison cannot attribute adaptive effects on its own; additionally compare an autonomy-respecting non-adaptive Review with this proposal under the same facts/goals and model version, blinding/balancing order as much as possible, retaining the zero-recommendation option. The comparison is small-sample usability evidence, not proof of causal efficacy or general-population benefit.
- **Recording**: Optional sense of autonomy, helpfulness, burden, sense of competence, trust, feeling of being judged, stress, dependence, safety/privacy incidents; confirmation and revision cost, explanation inspectability. Actual outcomes carry time windows, sources, and unknowns, distinguishing recommendation acceptance, self-reported outcomes, and objective records. Missing feedback is never back-filled with zeros or consent; the denominator is limited to cases with the corresponding observation item, with missingness reported.
- **Success threshold proposal**: No violations in any hard safety/ownership/stop/no-forced-recommendation case, evidence chains traceable; the user finds it more helpful without worse autonomy/burden. Numeric efficacy thresholds, formal sample size, and comparison allocation await Max's approval after baselines are established; until then, product validation must not be declared on nicer wording or rising agreement rates.
- **Stop/re-review proposal**: Cross-user leakage, using bodies after withdrawal/deletion, stops not taking effect, ordinary guidance handling crises, humiliation/threats, or expanding sensitive uses without consent each block the scenario from continuing; first restrict to synthetic data, fix, and independently re-review. Unacceptable stress/self-blame/dependence or burden pauses the experiment even if engagement rises. No real crisis scenarios are tested before the safety flow is approved.
- **Severity proposal**: Cross-user or new sensitive-use violations are Critical; stop/delete propagation failures, unconfirmed patterns becoming facts, forced recommendations, or added pressure are at least High, and this increment may not be waived through with a general High exemption; this document does not unilaterally rewrite existing severity definitions.

### 19.4 Open items and responsibilities

1. **T6-01**: P6-03 has conditionally confirmed the minimum acceptance and the five safety/verifiability principles at G1; the concrete cases, severity definitions, and hard-block implementation mapping for COA-001~016 move to G2/G3.
2. **T6-02**: Minimum observation duration, scenario coverage, comparisons, efficacy thresholds, and deferral plans move to G2/G3; all numbers remain author proposals.
3. **T6-03**: The document consistency review has passed but does not replace dedicated reviews; both the psychological-safety and privacy dedicated reviews are `PASS_WITH_CONDITIONS`, with `PSR-001`, `PRV-001`, `PRV-002` having completed non-author G1 document-level review. Certification, actual deletion, cache/backup, cross-device, vendors, training log/weight audits, assistive-technology compatibility, and real-user validation all remain in G2/G3.

This version only defines acceptance; implementation has not started, functional cases have not run, experiments have no data, G1 has not passed, and coding is not authorized.
