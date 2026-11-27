# POC-01 Test & Acceptance Spec v0.1

- **Project**: AI Life OS
- **Document Status**: Draft — Awaiting Max Review
- **SDLC Stage**: G1 Requirements / Acceptance Baseline
- **Final Acceptance Owner**: Max
- **Author**: Hermes
- **Date**: 2026-09-01
- **Related Documents**: `POC-01-Product-UX-Spec-v0.1.md`, `Capture-Data-AI-Output-Contract-v0.1.md`
- **Implementation Status**: Not started; this document defines the verification method and contains no test code

---

## 1. Purpose

This document defines POC-01's test scope, test data, acceptance method, and gate decision. The goal is not to paper over problems with a single average score, but to answer:

1. Are Captures saved reliably?
2. Does the AI correctly understand the key facts?
3. Are errors easy to spot and correct?
4. Is the Review faithful to personal evidence?
5. Are theory citations accurate, relevant, and verifiable?
6. Is the system more valuable than using a general-purpose chat model directly?
7. Before inviting friends, is personal data truly isolated?

## 2. Test Levels

### 2.1 Requirements Acceptance Testing

Verify the Must Have features and exception flows in the Product & UX Spec.

### 2.2 Deterministic Logic Testing

Verify:

- Raw Capture persistence
- User revisions
- Number and unit normalization
- Time parsing rules
- Goal Progress
- Data sufficiency checks for Deviation
- Export and deletion
- Multi-user ownership and isolation

Deterministic logic requires the same inputs and the same version to produce the same results.

### 2.3 AI Structuring Evaluation

Use a manually annotated Chinese Capture dataset to evaluate extraction quality, ambiguity handling, and user revision cost field by field.

### 2.4 Review Faithfulness Evaluation

Check each Review item for whether it:

- Has evidence
- Describes the evidence correctly
- Distinguishes facts from speculation
- Does not present correlation as causation
- Does not produce pseudo-precision conclusions
- Offers exactly one main recommendation

### 2.5 Theory Citation Evaluation

Verify that citations exist, faithfully express the original view, are relevant to the user's situation, and state their boundaries.

### 2.6 User Acceptance Testing (UAT)

Max completes the core flows using simulated data and real scenarios, and makes the final product judgment.

### 2.7 Pre-Friends-Private-Beta Isolation Testing

Not part of POC core value validation, but a mandatory release gate before friends use real data.

## 3. Test Environment and Data Principles

### 3.1 Environments

Future implementation must distinguish at least:

- Development: development and unit verification
- Test: simulated users and fixed evaluation sets
- POC: Max's acceptance environment

Whether to add a separate Production environment will be decided before productionization.

### 3.2 Data

- AI regression tests prefer artificially constructed and de-identified data.
- Max's real data must not be automatically copied to Development/Test.
- Test data must be version-tagged.
- Expected results for manual labeling must be confirmed by Max or by approved labeling rules.
- After a model, prompt, or schema change, re-run the same fixed dataset.

## 4. POC-01 Manually Annotated Dataset

### 4.1 Recommended Size

The first version builds 40–60 Captures, covering risks first rather than pursuing large-scale statistical significance. Expand later based on error types once a baseline is established.

### 4.2 Required Scenario Coverage

#### Single Fact

- Ran for 30 minutes today.
- Finished the primary-job report this morning.
- Worked two hours on the side project in the evening.

#### Multi-Dimension Mix

- Went to bed very late last night, had no energy at work today, but still finished the side project's homepage design.
- Worked overtime until 9 p.m. today, skipped exercise, then handled an hour of side-project client requests after getting home.

#### Time Expressions

- today, yesterday, last night, the day before yesterday
- this week, last week, the weekend
- 2 a.m.
- after midnight
- Vague expressions: "the past few days", "a while back"

#### Numbers and Units

- one hour, half an hour, 90 minutes
- walked 8,000 steps
- income of 500 yuan
- completed 2/3
- numbers without units

#### Negation, Plans, and Partial Completion

- No exercise today.
- Was going to work out, but didn't go in the end.
- Plan to write product for two hours tomorrow.
- The report is only half done.
- No progress on the side project today.

#### Corrections and Self-Contradictions

- Worked for an hour — no, about forty minutes.
- Went to bed at twelve yesterday — I mean twelve thirty this morning.
- Didn't work today — actually handled email for half an hour.

#### Mood and Energy

- Very tired today.
- Work is done, but my mood is mediocre.
- Good energy, though a bit anxious.

#### Goal Association

- Explicitly names the goal.
- Related to a goal but does not name it.
- Could relate to two goals at once.
- The goal cannot be reliably determined.

#### Indeterminate and Irrelevant Content

- Nice weather today.
- Felt weird lately.
- Maybe I should try harder in the future.
- Pure small talk with no life-management facts.

#### Sensitive Content

- Health symptoms but no diagnosis.
- Income or financial stress.
- Workplace conflict.
- Relationship emotions.

Sensitive-data tests should use simulated content to avoid putting real private data into the fixed regression set.

### 4.3 Per-Case Annotation Content

- `case_id`
- Raw Capture
- User timezone and reference date
- Acceptable `item_type`
- Expected Focus Area
- Expected time or acceptable range
- Expected number and unit
- Expected negation/plan/completion status
- Allowed Goal Link
- Fields that must remain pending confirmation
- Content that must not be inferred
- Acceptable variants
- Severe error definition

## 5. Severity Definitions

### Critical

- Data leaks across users.
- Raw Capture is lost or overwritten by AI.
- Deleting A's data affects B.
- AI records something that did not happen, was negated, or is only planned as a completed key fact.
- Review fabricates a seriously sensitive fact and presents it as a definitive conclusion.

### High

- A number or unit error makes goal progress clearly wrong.
- A time error puts the record in the wrong period.
- A user revision fails to take effect, or the wrong value reappears.
- A theory citation does not exist or is obviously fabricated.
- Review presents correlation as definite causation.

### Medium

- Wrong Focus Area or Goal Link that is easy to correct.
- Review recommendations are not relevant enough.
- Evidence citations exist but are not precisely located.

### Low

- Copy, ordering, minor formatting, or non-blocking usability issues.

The POC gate allows no leftover Critical items. Whether High items block is decided by Max based on risk and fixability, but must be explicitly recorded.

## 6. Functional Acceptance Test Cases

### CAP-001: Preserve the raw record when AI fails

**Given** the user enters valid text  
**When** the raw save succeeds but the AI API times out  
**Then** the Capture is still viewable, its status is failed or pending retry, and the text is neither lost nor duplicated.

Related: `FR-CAP-001`, `FR-CAP-002`, `FR-CAP-003`

### CAP-002: Empty input

**Given** the input is empty or whitespace-only  
**When** the user submits  
**Then** the system does not create a Capture and gives a clear prompt.

### AIX-001: Evidence span

**Given** the AI extracts "exercised for 60 minutes"  
**When** the user views the extraction result  
**Then** the source text span supporting the result is visible.

### AIX-002: User revision

**Given** the AI extracts 60 minutes  
**When** the user revises it to 40 minutes and saves  
**Then** viewing again shows 40 minutes, calculations use 40 minutes, and the AI's original value of 60 minutes is preserved.

### AIX-003: Rejecting a candidate

**Given** the AI wrongly extracts a fact  
**When** the user rejects it  
**Then** the candidate is excluded from calculations and from Review facts.

### AIX-004: Low-confidence content

**Given** the text is insufficient to determine the specific time or goal  
**When** the AI structures it  
**Then** the field is marked pending confirmation and does not automatically become a confirmed fact.

### REV-001: Facts are traceable

**Given** the Review claims three exercise sessions this period  
**When** the user opens the evidence  
**Then** it points to three valid Capture/structured records, with the correct period and user.

### REV-002: Insufficient data

**Given** there is only one sleep record  
**When** the system attempts to judge long-term trends  
**Then** it explicitly states that data is insufficient and outputs no precise trend or projected completion date.

### REV-003: Fact / speculation / theory / recommendation separation

**Given** the Review contains personal records, pattern explanations, and theory at once  
**When** the user views it  
**Then** the four kinds of content are distinguishable by label, copy, and source.

### REV-004: ONE BIG CHANGE

**Given** the Review finds multiple problems  
**When** generating recommendations  
**Then** there is exactly one main recommendation; other information must not be disguised as a same-level recommendation list.

### DAT-001: Export

**Given** the current user has Captures, extractions, revisions, and Reviews  
**When** the user exports all data  
**Then** the export is complete, readable, and contains only the current user's data.

### DAT-002: Deletion

**Given** the user confirms deletion of all data  
**When** deletion completes  
**Then** the user's data is deleted per the approved policy or enters a clearly defined recovery window, with no impact on other users.

## 7. AI Structuring Evaluation

### 7.1 Per-Field Evaluation

At minimum, report separately:

- `item_type`
- Focus Area
- Goal Link
- Time
- Number
- Unit
- Negation/plan/completion status
- Mood/energy
- `needs_confirmation`
- Evidence Span

Do not report only one overall accuracy rate.

### 7.2 Error Classification

- Missed extraction
- Spurious extraction
- Wrong classification
- Wrong time
- Wrong number
- Wrong unit
- Negation inversion
- Treating a plan as a fact
- Wrong goal association
- Unfounded inference
- Overconfidence
- Evidence span does not support the output

### 7.3 First-Round Baseline Principles

v0.1 does not arbitrarily preset a single pass threshold. The first round records:

- Per-field accuracy
- Number of Critical/High errors
- The share of items Max needs to revise
- Steps and time per revision
- Whether errors are concentrated and fixable via schema, prompt, or interaction

Once a baseline is formed, formal thresholds are approved in the next version.

### 7.4 Must-Pass Baselines

- The difference between negation, plan, and completed can be verified.
- User revisions persist 100% consistently.
- Critical data-integrity errors are zero.
- When data is insufficient, the system can output "don't know / cannot determine".

## 8. Review Faithfulness Evaluation

Score each ReviewStatement using the following:

### 8.1 Factual Support

- 2: The evidence directly and completely supports it.
- 1: Partial support, or wording slightly exceeds the evidence.
- 0: No evidence, contradictory evidence, or wrong user/period cited.

### 8.2 Correct Typing

- 2: Facts, calculations, speculation, theory, and recommendations are classified correctly.
- 1: Type is basically correct but wording is vague.
- 0: Speculation is presented as fact, or theory as personal fact.

### 8.3 Uncertainty

- 2: Limitations and evidence strength are stated explicitly.
- 1: Hedged wording but incomplete limitations.
- 0: Definitive conclusions despite insufficient data.

### 8.4 Actionability

- 2: The recommendation is specific, low-burden, and related to the facts and goals.
- 1: Relevant but too generic.
- 0: Irrelevant, not actionable, too risky, or induces unnecessary self-blame.

### 8.5 Severe Failures

Any of the following must be flagged separately:

- Fabricated personal facts
- Fabricated citations
- Wrong causation
- High-risk definitive recommendations
- Other users' data mixed in

## 9. Theory Citation Evaluation

Check each TheoryReference for:

1. Whether the author or scholar really exists.
2. Whether the source title is accurate.
3. Whether chapter, page, DOI, or URL is verifiable.
4. Whether the quote or paraphrase is faithful to the original meaning.
5. Whether it is relevant to the current personal facts.
6. Whether it states applicability boundaries, controversy, or evidence strength.
7. Whether it clearly marks this as a theoretical perspective, not Max's personal fact.
8. Whether it has legitimate access and usage rights.

Theory samples for POC-01 must be manually screened and reviewed. Citations that cannot be verified must not enter the acceptance sample.

## 10. Baseline Comparison Experiment

To verify product value, build two outputs from the same Capture data:

### Baseline A: General-purpose chat model

Hand a period of records directly to a general-purpose model for summarization, without structured confirmation, deterministic calculation, or an explicit Evidence Contract.

### Candidate B: AI Life OS POC

Generate the Review using confirmed structured facts, evidence, type boundaries, and the theory citation contract.

Max blind-evaluates both or minimizes preconception bias, comparing:

- Factual accuracy
- Traceability
- Personalization
- Theory citation quality
- Actionability of recommendations
- Trustworthiness
- Whether the next step is clearer

POC value is judged not by "longer text", but by being more trustworthy, clearer, and more actionable.

## 11. Multi-User Isolation Testing (Mandatory Before Friends' Private Beta)

Use at least two test accounts A and B:

### ISO-001: List isolation

A cannot see B's data in the Capture, Goal, or Review lists.

### ISO-002: Direct object access

Even if A obtains or guesses B's object IDs, A cannot read, modify, or delete them.

### ISO-003: AI context isolation

When generating extractions or Reviews for A, the request context contains none of B's personal content.

### ISO-004: Export isolation

A's export package contains no B data or identifiable metadata of B.

### ISO-005: Deletion isolation

Deleting A's Captures or account does not change B's data.

### ISO-006: Background job isolation

Retries, async processing, caches, and scheduled jobs maintain correct user boundaries.

### ISO-007: Logs and debugging tools

Routine logs do not directly expose A/B's full sensitive raw text; debug permissions and access have explicit boundaries.

Any isolation case failure blocks friends from using real data.

## 12. Privacy and Data Control Acceptance

- The user sees a clear explanation and consents before the first AI processing.
- Cloud model providers and data retention policies are recorded.
- The user can withdraw consent for subsequent AI processing.
- Export content and format match approved requirements.
- Deletion scope, recovery window, and derived-data handling match the approved policy.
- Development and test environments contain no unauthorized real data.
- API keys do not appear in clients or document samples.

## 13. Max UAT Scenarios

### UAT-01: First-time setup and logging a health event

Create a health goal, enter a Capture containing sleep, energy, and exercise, confirm and revise one field.

### UAT-02: Primary job and side project mixed record

Enter a record containing overtime, primary-job results, and side-project work at once; check multiple Areas and Goal Link.

### UAT-03: Negation and plans

Enter "No gym today, planning to go tomorrow" and confirm the system does not treat the plan as completed.

### UAT-04: Insufficient-data Review

Generate a Review from a few records and confirm the system states limits explicitly instead of inventing trends.

### UAT-05: Full-period Review

Use simulated period data and check that facts, calculations, speculation, theory, and recommendations are separated and traceable.

### UAT-06: Correction loop

Find an error, correct it, regenerate the Review, and confirm the error no longer appears as fact.

### UAT-07: Export and deletion

Export all personal data, checking readability and completeness; verify deletion on a dedicated test account.

## 14. POC Final Acceptance Questions

Answered by Max:

1. Am I willing to keep using it?
2. Are capture and confirmation low-friction enough?
3. Are the AI's errors easy to spot and correct?
4. Is the Review more trustworthy and helpful than a general-purpose chat model?
5. Does the Review make my next step clearer?
6. Does the system avoid unnecessary judgment, self-blame, and pseudo-precision?
7. Is ONE BIG CHANGE specific and actionable?
8. Do theory citations genuinely add understanding rather than decorate?
9. Am I willing to let friends use it after privacy isolation passes?
10. Which errors must be resolved before continuing?

## 15. Gate Decision

### GO

- All Critical acceptance items pass.
- Core data and evidence chains are reliable.
- Max considers the product worth continuing to use.
- Main issues are fixable through limited iteration.

### GO WITH CONDITIONS

- The core loop works, but there are explicit, controllable, registered High/Medium issues.
- Each condition has an owner, resolution criteria, and a follow-up gate.

### PIVOT

- Capture is valuable but Review is not.
- Review is valuable but the confirmation burden is too high.
- Theory citations add no value; RAG should be deferred.
- Goal progress/deviation is unsuitable for the current scenario; the model should be narrowed.

### STOP / REASSESS

- Raw data or user isolation cannot be reliably guaranteed.
- AI correction costs remain higher than manual logging.
- Review shows no perceivable improvement over a general-purpose chat model.
- The system increases stress or misleads, and design cannot mitigate it.

## 16. Requirements Traceability Matrix (Initial Version)

| Requirement | Primary Acceptance |
|---|---|
| FR-USR-001/002 | ISO-001~ISO-007 |
| FR-GOL-003/005 | Goal count and data-insufficiency rule tests |
| FR-CAP-001~005 | CAP-001, CAP-002, deletion tests |
| FR-AIX-001~006 | AIX-001~004, AI fixed evaluation set |
| FR-REV-001~008 | REV-001~004, faithfulness and theory citation evaluation |
| FR-DAT-001~004 | DAT-001, DAT-002, ISO-004/005 |
| NFR-TRC-001 | Review evidence-chain tests |
| NFR-AI-001/002 | Deterministic regression and unfounded-conclusion evaluation |

At the formal baseline, expand this so that every Must Requirement maps to at least one test case.

## 17. G1 Review Decision Items

Ask Max to mark each item below `Approve / Revise / Reject`:

1. Is 40–60 first-round manually annotated Captures appropriate?
2. May we use large amounts of simulated data instead of waiting for a fixed number of real usage days?
3. Is the Critical/High/Medium/Low severity scale reasonable?
4. Is it acceptable not to preset an overall accuracy threshold in the first round, and to establish a field baseline first?
5. Which field errors must be defined directly as Critical or High?
6. Is the Baseline A vs Candidate B comparison method fair?
7. Are the eight theory-citation checks sufficient?
8. Must all seven pre-friends-private-beta isolation tests pass?
9. How should data export and deletion be specifically accepted?
10. Do the seven UAT scenarios cover your main usage patterns?
11. Do GO / GO WITH CONDITIONS / PIVOT / STOP need other conditions added?
12. Would Max prefer to supply the first batch of simulated Captures himself, or have Hermes draft them and Max revise?

## 18. Approval Conditions

This document may become the POC-01 test and acceptance baseline after Max's review. Only when the Product & UX Spec, the Data + AI Contract, and this document are approved together may entry into the implementation phase be discussed.
