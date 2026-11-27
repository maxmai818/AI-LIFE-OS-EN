# POC-01 Product & UX Spec v0.7

- **Project**: AI Life OS
- **Document status**: Approved — v0.7 requirements baseline (Max approved via Feishu "Approved", 2026-11-17, PR #29); v0.6 becomes the historical baseline (`G1-baseline`)
- **SDLC stage**: G1 Requirements
- **Product owner / approver**: Max
- **Author**: Hermes
- **Date**: 2026-11-17 (v0.7); v0.6 original 2026-09-15
- **Related decisions**: `Roadmap-Review-Decisions-v0.1.md`, `G0-Amendment-001-User-Scope-v0.1.md`, `G0-G1-Amendment-002-Life-Dimensions-v0.1.md`, `G0-G1-Amendment-003-Behavior-Dimension-Impact-v0.1.md`, `G1-Decision-004-Five-Dimension-Impact-Rules-v0.1.md`, `G1-Decision-005-Mixed-Impact-Degrees-v0.1.md`
- **Implementation status**: Partially implemented (frictionless capture v0.2 / variant 2 design skin / LLM one-click setup wizard, PR #20/#22/#25); this document authorizes no new coding

- **Changes in this version (v0.7)**: Change list 1–8 (Max approved 2026-11-17): commercial boundary red lines into Won't Have (DQ-04/05 + Commercialization Validation v0.2), trial/outreach semantics, behavioral design evidence framing (independent review findings Medium-1/4), benefit micro-scale and guardrails, DQ-006 analytics instrumentation framing, write-back of built features (PR #20/#22/#25), Adaptive Review increment closure, RTM/success-criteria refresh. v0.6 change history: [Decision 006](../09-decisions/G1-Decision-006-Adaptive-Review-v0.1.md); [Delta Review](../08-research/G1-v0.6-Adaptive-Review-Delta-v0.1.md)
- **Coding authorization**: Not authorized; G1 not approved as a whole; the author may not self-approve.

---

## 1. Document purpose

This document defines the product scope, user experience, functional requirements, and acceptance boundaries of POC-01. Once review passes, it becomes the product requirements baseline for POC-01; data fields, AI outputs, and test details are defined separately by the accompanying Contract and Test Spec.

## 2. Product definition

AI Life OS is a mobile-first responsive web life-management system. Users record their lives in natural language; the system turns those records into confirmable, correctable, computable personal facts, and generates periodic reviews that trace back to the original evidence.

### 2.1 The first closed loop

```text
Set the five-dimension Life Blueprint and goals
→ Enter a Capture
→ AI extracts structured content
→ User confirms/corrects
→ Trusted facts saved
→ Periodic Review formed
→ User freely chooses zero or one ONE BIG CHANGE
```

### 2.2 The question POC-01 must validate

> Can natural-language life logging be converted into trustworthy data at acceptable cost, and produce reviews that are more traceable and more helpful than just sending the log to a general-purpose chat model?

### 2.3 Target users

- POC-01's primary validation user: Max.
- The system experience is single-user and private, but the data model must not be hard-coded to a single user.
- After the core loop passes and account isolation is verified, a small number of friends may be invited to use separate accounts.
- No social, sharing, or collaboration features are designed at this stage.

## 3. Jobs-to-be-Done

### JTBD-01: Low-friction capture

When something worth recording happens during the day, I want to capture it quickly in a paragraph of natural language instead of filling out complex forms, so the system preserves reviewable facts and understands that the same behavior may affect the Five Life Dimensions in different directions and degrees.

### JTBD-02: Correcting AI understanding

When the AI classifies and extracts from my records, I want to see where it drew its conclusions from and be able to correct it quickly, so wrong data does not enter long-term analysis.

### JTBD-03: Understanding periodic change

When I look back over a period, I want to see what happened, which goals progressed or deviated, what the evidence is, and what is most worth changing next.

### JTBD-04: Gaining theoretical perspectives

When the system explains my situation through theory, I want to see the author, theory, material, and verifiable sources, and a clear separation between personal facts, AI speculation, theoretical viewpoints, and suggestions.

## 4. POC scope

### 4.1 Must Have

1. Mobile-first responsive web experience.
2. Simplified Life Blueprint, always containing the Five Life Dimensions: Time / Health / Wealth / Relationship / Purpose.
3. At most three concurrent core goals.
4. Text Capture.
5. The raw Capture is stored independently and never overwritten by AI; retention follows user deletion and approved retention policies, and does not imply permanent retention.
6. AI extracts structured content and displays source evidence snippets.
7. The user confirms, edits, or deletes extracted results item by item.
8. Both the AI's original extracted values and the user's revisions are saved.
9. Reviews are generated only after the user actively opens Review, for the selected period.
10. Reviews clearly separate facts, speculation, theoretical citations, and suggestions.
11. Every Review fact can be traced back to a Capture or structured record.
12. ONE BIG CHANGE is zero or one; when the user has no desire to change, no change is needed, or evidence is insufficient, no suggestion is forced.
13. When data is insufficient, explicitly state that no judgment can be made.
14. Users can export and delete all of their own data.
15. Lightweight adaptive guidance, optional feedback, instant correction/stop, and on-demand explanation (FR-COA-001–010).

### 4.2 Should Have

1. Capture history list.
2. Review history list.
3. Simple progress and trends tied to goals.
4. An optional extended feedback view for Reviews (basic feedback, correction, and stop are Must).
5. A small set of manually curated, verifiable theoretical citation samples.
6. AI failures allow reprocessing, without duplicating the saved raw Capture.

### 4.3 Could Have

1. Capture tag filtering.
2. Simple trend charts.
3. Goal pause and resume.
4. Collapse/expand of evidence within Reviews.
5. Quickly forming periodic samples with simulated historical data.

### 4.4 Won't Have (POC-01)

- A single 0–100 Life Score
- Voice, images, bills, OCR, or document upload
- Bulk ebook import
- Complex vector retrieval pipelines
- Apple Health, bank, or calendar sync
- Community, friends, leaderboards, shared goals, or shared records
- Multiple agents
- Proactive reminders, scheduled pushes, background monitoring, and period-triggered automatic Reviews
- Mandatory three-coach personas, complex preference settings, model fine-tuning, or online reinforcement learning
- Automatic execution of external tasks
- Payments and subscriptions
- Formal public registration and scaled operations
- (v0.7 forward-looking red line) Locking the core loop (Capture/Confirm/Review/0–3 core goal tracking) behind a paywall after commercialization — the core loop stays free forever; paid only adds, never subtracts
- (v0.7 forward-looking red line) Charging fees / imposing limits / retention walls on export or delete — export and delete are always free and one tap away (feature-hostage prohibition)
- (v0.7 forward-looking red line) Paywall-related outreach exceeding frequency caps (≤1 expiry notice + ≤2 reminders, ≥3 days apart, never interrupting input)

## 5. Five-dimension and behavior impact model

POC-01 uses the fixed Five Life Dimensions and maps the user's goals, projects, behaviors, and events onto the five dimensions:

```text
Life Blueprint (fixed five dimensions)
        ↓
Goal / Project / Context
        ↓
Behavior / Event / Capture
        ↓
Behavior Dimension Impact × 5
```

### 5.1 The fixed Five Life Dimensions

1. **Time**: control over time, free time, Deep Work, screen time, and low-value time.
2. **Health**: sleep, exercise, diet, weight, energy, and physical condition.
3. **Wealth**: income, assets, liabilities, spending, and long-term financial goals.
4. **Relationship**: partner, family, friends, colleagues, and relationship quality.
5. **Purpose (meaning)**: life direction, identity, growth, creativity, and long-term vision.

The five dimensions are used for the Life Blueprint, long-term state observation, goal impact analysis, and Review. The POC does not generate a five-dimension aggregate score or a single Life Score.

### 5.2 Behavior impact vector

Every valid behavior or event should be assessed for its impact on the five dimensions:

- Impact direction: positive, negative, mixed, neutral, or unknown.
- Impact degree: a fixed 1–5 discrete scale; `1` is very weak, `5` is very strong. `positive`/`negative` use a single `degree`; `mixed` uses `positive_degree` and `negative_degree` separately; for `unknown` or `neutral` the degree is null, and the direction field distinguishes the two.
- Evidence: from the raw Capture, goals, or verifiable calculations.
- Confidence: how certain the AI is about the mapping.
- Confirmation status: candidate, confirmed, modified, rejected, or unknown.
- Epistemic type: user-reported fact, user-reported impact, AI-inferred impact, or deterministic calculation. User confirmation only changes the confirmation status; it does not turn an inference into objective fact.

Five-dimension impact allocation is non-zero-sum. One behavior can strongly affect several dimensions at once; each dimension's 1–5 degree is judged independently and is not required to sum to a fixed total.

### 5.3 Rules

- All valid behaviors/events enter five-dimension impact assessment.
- One Capture may contain multiple behaviors; each behavior produces its own five-dimension impact candidates.
- A Goal or Project can provide context for a behavior, but is not a new top-level dimension.
- The AI may propose direction and degree; the user may confirm, modify, or reject.
- A dimension without evidence must be `unknown`; `neutral` may only be marked when evidence supports "no noticeable impact" — never guess.
- Non-`unknown` impacts produced by the AI are only candidates until confirmed or modified, and must not enter long-term trends, dimension states, or Review facts; rejected candidates must not participate in analysis.
- `unknown` may be kept as a data limitation; the user is not forced to choose a direction or degree.
- 1–5 is an ordered subjective impact estimate made by the user relative to their Blueprint, goals, and assessment time window — not a measurement. It must not be compared across dimensions, averaged, ranked, or directly interpreted as a trend. The two `mixed` degrees can express relative strength within the same behavior, same dimension, and same time window, but must not be subtracted, divided, netted off, or converted to percentages.
- If the direction has a basis but the degree has no reliable basis, the corresponding `degree`, `positive_degree`, or `negative_degree` may be `null` and confirmation requested; a number must not be filled in just to satisfy the scale.
- If `Current Focus` is ever needed, it may only exist as an optional user label or view; it is not a fixed POC model and no specific content is pre-provisioned.
- No more than three core goals in Active status at the same time.
- The POC does not force all goals to be quantified; non-quantifiable goals must not generate pseudo-precise progress.

## 6. Information architecture

POC-01 proposes five main pages:

1. **Setup**: five-dimension Life Blueprint, goals, and basic preferences.
2. **Capture**: enter records, view AI processing status.
3. **Confirm**: confirm or correct extracted results item by item.
4. **Review**: view periodic facts, deviations, theory, and suggestions.
5. **History & Settings**: history, export, delete, and privacy settings.

The POC may design Capture and Confirm as consecutive states of the same page; five separate routes are not required.

## 7. Core user flows

### 7.1 First-time setup

```text
Enter the system
→ Read the privacy and AI boundary explanation
→ View the Five Life Dimensions and fill in the simplified Blueprint
→ Create 0–3 core goals
→ Confirm settings
→ Enter Capture
```

#### Acceptance requirements

- The user can skip goal fields they cannot answer for now.
- The system must not require creating a Life Score.
- The system must warn that a cloud LLM may process Capture content.
- Capture can begin before goal setup is complete.

### 7.2 Creating a Capture

```text
Open Capture
→ Enter natural language
→ Click save and analyze
→ Raw text saved immediately
→ AI processes asynchronously
→ Enter Confirm
```

#### Acceptance requirements

- Empty input cannot be submitted.
- AI service failure must not affect saving the raw Capture.
- The same submission must not produce duplicate raw records due to retries.
- The user can see that save success and AI processing status are two distinct states.

### 7.3 Confirm and correct

```text
Show raw text
→ Show structured extraction entries
→ Each entry shows an evidence snippet and confidence/pending-confirmation status
→ User confirms, edits, or deletes
→ Saved as the user-confirmed version
```

#### Acceptance requirements

- The user can act entry by entry; they need not accept everything at once.
- After editing, viewing again must match the user's saved value.
- Deleted AI extraction entries do not participate in Review as facts.
- Uncertain content may remain "unconfirmed" and must not default to fact.
- By default, only candidates with evidence, needing correction, or possibly high-impact are expanded; "high impact" only signals an AI rough candidate and must not induce acceptance through authoritative copy or visual emphasis. The user may hide AI degrees first, choose degrees themselves or "unsure", and view AI candidates on demand; the five `unknown` entries need not be processed one by one and must not be nagged.
- The user can choose "Handle later", "Skip this impact analysis", "Save original text only", undo, or bulk-reject; they can also confirm facts without confirming impact interpretations.
- Bulk accept must not serve as an inducing default primary action, and must clearly show what will enter long-term analysis.

### 7.4 Generating a Review

```text
The user actively opens Review and selects a period (not triggered by the period arriving)
→ The system reads that user's confirmed facts for that period
→ Computes determinable progress/trends/deviations
→ Builds the evidence set
→ Optionally retrieves a small amount of theoretical material
→ AI generates the Review
→ User views and gives feedback
```

A Review always contains:

1. **What happened**: confirmed facts.
2. **Progress and deviations**: only what is computable or well supported by records.
3. **Possible patterns**: explicitly marked as speculation.
4. **Theoretical perspectives**: author, theory, material, and sources; applicability boundaries explained.
5. **ONE BIG CHANGE**: zero or one suggestion; "no change needed" or "review only" is allowed.
6. **Insufficient data**: which information is missing and which conclusions cannot be drawn.
7. **Evidence**: Capture/record references supporting the facts and analysis.

The Review is organized primarily by the five dimensions Time, Health, Wealth, Relationship, Purpose, and explains the direction and degree of this period's behaviors on each dimension. Goals or Projects can serve as filtering and interpretation context, but do not replace the five-dimension structure. Impacts without evidence must be marked as unknown; they must not be guessed to fill a matrix.

Display copy prioritizes user-contextualized language such as "supports / depletes" and "aligned with current goals / in tension". The system must not define what counts as "a meaningful life" or "a good relationship", and must not generate cross-dimension quality rankings, personality attributions, discipline judgments, or deficit narratives. AI inferences confirmed by the user must still be displayed as "user-endorsed judgment" and must not be rewritten as proven causal facts.

### 7.5 Review feedback

The user can complete a Review without rating; agreement/disagreement, natural-language correction, or stop are available on demand — see Section 14. The user can:

- Mark "Accurate / Inaccurate";
- Mark "Helpful / Not helpful";
- Mark "Well-grounded / Not grounded";
- Accept, modify, or reject the ONE BIG CHANGE;
- Fill in free-text feedback.

### v0.7 increment: frictionless capture as the default form and commercialization semantics (forward-looking lock-in)

- **Frictionless capture is the default form** (built in PR #22): users type in plain language, the AI produces structured candidates and highlights hard indicators (values/units/time/negations), and one tap confirms and saves; precise per-field entry is demoted to an advanced option, with the entry point preserved. Confirmation time / action count / abandonment rate enter the observation metrics.
- **7-day reverse-trial semantics** (DQ-04/05; the POC implements no payments, it only locks in behavioral boundaries): all features available during the trial; on expiry, automatic downgrade to Free, with read/write downgrade semantics compared item by item against Commercialization-Validation-Design v0.2 Appendix A; downgrade deletes no data, locks no reads, and locks no export/delete.
- **Expiry outreach caps**: ≤1 expiry notice + ≤2 reminders, ≥3 days apart, never interrupting ongoing input, respecting stop preferences.

## 8. Functional requirements

### 8.1 Users and data ownership

- **FR-USR-001**: All personal data must belong to a defined user.
- **FR-USR-002**: Users can only read, modify, export, or delete their own data.
- **FR-USR-003**: The POC may be restricted to Max, but the implementation must not rely on a hard-coded single user.
- **FR-USR-004**: Account identity and data-isolation acceptance must be completed before any friend's private test.

### 8.2 Life Dimension, behavior impact, and goals

- **FR-DIM-001**: The system always provides the five Life Dimensions: Time, Health, Wealth, Relationship, Purpose.
- **FR-DIM-002**: Users can fill in a simplified Life Blueprint for the five dimensions, but may leave items blank for now.
- **FR-IMP-001**: The system produces five-dimension impact candidates for every valid behavior/event.
- **FR-IMP-002**: Each dimension impact includes direction, a nullable 1–5 degree, evidence, confidence, and confirmation status; `positive`/`negative` use `degree`, `mixed` uses separate `positive_degree` and `negative_degree`; the degree is null for `unknown`/`neutral` or when evidence for the degree is insufficient; POC-01 uses no ratio fields.
- **FR-IMP-003**: Users can confirm, modify, reject, or leave unknown.
- **FR-IMP-004**: Without evidence it must be `unknown`; `neutral` may only be marked when the user explicitly states it or an approved deterministic rule provides evidence.
- **FR-IMP-005**: Non-`unknown` impacts proposed by the AI may enter long-term analysis only after the user confirms or modifies them; rejected items must not participate in analysis.
- **FR-IMP-006**: Degrees for the five dimensions are judged independently; no summation, normalization, averaging, cross-dimension ranking, or composite Life Score is performed.
- **FR-IMP-007**: Confirmation status and epistemic type must be kept separate; user confirmation must not turn an AI inference into a direct observation or deterministic fact.
- **FR-IMP-008**: The positive and negative degrees of `mixed` must be recorded separately, with evidence, rationale, confidence, and confirmation status saved and modifiable separately per side; when one side is rejected, the effective direction becomes the other side's single direction, and when both sides are rejected the whole entry does not enter long-term analysis; clearing only one side's degree does not negate that side's direction. No net value, ratio, or single overall strength may be computed.
- **FR-IMP-009**: Each impact assessment must save the assessment time window and the Blueprint, Goal context, and scale-anchor versions used; degrees must not be directly compared across behaviors, dimensions, time windows, or after context-version changes.
- **FR-GOL-001**: Users can create, edit, pause, and archive goals.
- **FR-GOL-002**: No more than three Active core goals.
- **FR-GOL-003**: A goal contains at least a title; Why, metrics, current value, target value, and dates are optional.
- **FR-GOL-004**: With insufficient data, no pseudo-precise Progress or Deviation is displayed.

### 8.3 Capture

- **FR-CAP-001**: Users can save a non-empty text Capture.
- **FR-CAP-002**: The raw text, creation time, and owner must be saved.
- **FR-CAP-003**: The raw Capture is not lost on AI failure or timeout.
- **FR-CAP-004**: Users can view a Capture's processing status.
- **FR-CAP-005**: Users can delete their own Captures; the impact of deletion must be clearly indicated.

### 8.4 AI structuring and correction

- **FR-AIX-001**: AI output must conform to the approved structured Contract.
- **FR-AIX-002**: Every extraction entry must contain source-text evidence or be explicitly marked "no direct evidence".
- **FR-AIX-003**: The system saves model, Prompt, and Schema versions.
- **FR-AIX-004**: Users can confirm, edit, or delete extraction entries.
- **FR-AIX-005**: User revisions must not overwrite the AI's original output.
- **FR-AIX-006**: Low-confidence or ambiguous information must be marked pending confirmation.

### 8.5 Review

- **FR-REV-001**: Users can generate or view a Review for a period.
- **FR-REV-002**: Facts in a Review must cite personal records.
- **FR-REV-003**: Speculation must be visually and semantically distinguished from facts.
- **FR-REV-004**: Theoretical citations must include verifiable sources.
- **FR-REV-005**: Suggestions must not masquerade as facts or as the original words of a theory.
- **FR-REV-006**: Each Review allows zero or one main suggestion, ONE BIG CHANGE; when the user does not want to change or no change is needed, no suggestion is forced.
- **FR-REV-007**: With insufficient data, limitations are explicitly listed.
- **FR-REV-008**: Users can submit Review feedback.

### 8.6 Data control

- **FR-DAT-001**: Users can export all of their own data.
- **FR-DAT-002**: Users can delete all of their own data.
- **FR-DAT-003**: Export and delete must not affect other users.
- **FR-DAT-004**: Before deletion, show the scope and an irreversibility warning.

### v0.7 new functional requirements

- **FR-CAP-006**: Frictionless capture is the default Capture path (speak plainly → one-tap confirm → hard indicators go to AI); precise entry is an advanced option.
- **FR-COM-001**: The core loop (Capture/Confirm/Review/0–3 goal tracking) stays free forever; paid only adds, never subtracts.
- **FR-COM-002**: Export, delete, and reading one's own data are always free and one tap away, with no retention walls or manual delays.
- **FR-COM-003**: Payment-related outreach respects frequency caps (≤1+≤2, ≥3 days apart, no interrupting input).

## 9. Non-functional requirements summary

- **NFR-PRV-001**: Cloud LLM usage and data retention policies must be defined at G2.
- **NFR-SEC-001**: All server-side data queries must be constrained by user ownership.
- **NFR-SEC-002**: Logs must not record full sensitive Captures by default.
- **NFR-REL-001**: When AI is unavailable, raw data writes still succeed.
- **NFR-TRC-001**: The full chain Capture → extraction → revision → Review → Evidence is traceable.
- **NFR-AI-001**: The same deterministic computation version and inputs must produce the same result.
- **NFR-AI-002**: The AI must not generate user facts without a source.
- **NFR-UX-001**: Portrait mobile is the primary interaction environment.
- **NFR-UX-002**: Recording and confirmation operations should minimize field entry; concrete time costs get a baseline first, without arbitrary preset thresholds.
- **NFR-UX-003**: The POC must measure per-confirmation time, action counts, abandonment rate, unconfirmed backlog, AI value acceptance/modification bias, perceived autonomy, and feeling of being judged; when burden or anchoring effects persist above the user's acceptable range, the interaction design must be simplified or stopped.
- **NFR-SAF-001**: Five-dimension directions and degrees must not be used for moral judgment, personality judgment, cross-dimension ranking, or manufacturing shame and self-blame.
- **NFR-SAF-002**: When possible crisis or clinical content appears, the system stops ordinary five-dimension impact suggestions, does not diagnose, and transfers to a separately approved safety flow; until that flow is approved, friends must not be invited to handle such real content.

## 10. Key empty and error states

Must be defined and shown in the G2 prototype:

1. No goals yet.
2. No Captures yet.
3. Capture saved but AI still processing.
4. AI extraction failed.
5. AI found no extractable facts.
6. All extracted content pending confirmation.
7. Review data insufficient.
8. Theoretical material unavailable or citations unverifiable.
9. Export in progress or failed.
10. Delete confirmation and delete completion.

## 11. Success criteria

### Must be satisfied

- The raw Capture is not overwritten.
- Saved user revisions match what is shown again.
- Values, units, time, negations, and goal associations are verifiable entry by entry.
- Review facts trace back to evidence.
- Facts, speculation, theoretical citations, and suggestions are clearly separated.
- With insufficient data, no pseudo-precise conclusions are generated.
- Users can export and delete their personal data.

### Final judgment by Max

1. Would you keep using it?
2. Is the Review more trustworthy and more helpful than a general-purpose chat model?
3. Does the system make your next step clearer, rather than creating burden or self-blame?
4. Are errors easy to spot and correct?
5. Do the theoretical citations genuinely improve understanding and action quality?

### Observation metrics (v0.7; observation only, no thresholds, no composite scores)

Benefit 4 items (5-point ordinal; report distribution and missingness per item):

1. Was this Review helpful to you?
2. Did it make clearer what you should do next?
3. Is the burden it puts on you sustainable?
4. Did it affect one small thing you actually did this week?

Burden/safety 2 items (negative values counted separately):

5. Was there any point this week where you felt judged, anxious, or dependent?
6. Is there anything you would like to delete or wish had not been recorded?

## 12. G1 Review decision items

On 2026-09-12, Max approved `G1-Decision-004-Five-Dimension-Impact-Rules-v0.1.md`. On 2026-09-13, Max also approved `G1-Decision-005-Mixed-Impact-Degrees-v0.1.md`: `mixed` records positive and negative 1–5 degrees separately, to express relative strength within the same behavior and dimension, but computes no ratio or net value. The remaining items below continue in review.

Please mark each item `Approve / Revise / Reject`:

1. Are POC-01's first closed loop and goals accurate?
2. Are the Chinese and English names and definitions of the five dimensions accurate?
3. Are five pages enough; are there any entry points that must be added?
4. Is the Must/Should/Could/Won't split reasonable?
5. Is the rule that goals may lack quantification fields acceptable?
6. Does organizing the Review primarily by the five dimensions match expectations?
7. Closed by Decision 006: ONE BIG CHANGE is zero or one; no re-vote.
8. Does the POC stage need real sign-up/login, or start with a restricted Max account?
9. What format is needed for data export: JSON, CSV, Markdown, or all?
10. Is deletion immediate and permanent, or is there a short recovery window?
11. Should friend private testing start after the POC passes, or in the mid-to-late POC?
12. What other Must Haves are not covered by this document?
13. Please review the new details item by item per Section 14; the zero-suggestion principle is confirmed.

## 13. Gate conditions

This document must undergo Max's review, with all blocking comments closed, before it can be marked `Approved` or `Approved with Conditions`. Approval of this document does not authorize coding; the Data + AI Contract and the Test + Acceptance Spec must be approved in parallel.

## 14. Adaptive Review increment

**Authorization layering**: Section 1 of Decision 006 is principles Max has confirmed; this section turns those principles into reviewable requirements. Fields, labels, policy priorities, scope, and experiment parameters were In Review proposals in v0.6; **v0.7 formally fixes the data-contract and acceptance portions per G1-Decision-006 and the psychological-safety/privacy special independent review (PASS_WITH_CONDITIONS closure items)**, and the wording "no product testing has been executed" is retained — formalization does not equal implementation or passing tests. The five-dimension section is unchanged. [Data Section 14](../04-data-ai/Capture-Data-AI-Output-Contract-v0.7.md) and [Test Section 19](../06-testing/POC-01-Test-Acceptance-Spec-v0.7.md) are the companion documents.

### 14.1 New Must requirements and user experience

- **FR-COA-001**: Reviews are generated only when the user actively opens/requests them; no proactive reminders, on-schedule auto-generation, background monitoring, or cross-session follow-up questioning. ONE BIG CHANGE is zero or one; "don't want to change", "no suggestions needed", and "review only" are respected immediately and never swapped for hidden to-dos.
- **FR-COA-002**: No mandatory coach personas or three fixed styles; the AI chooses its support mode and directness based on current evidence, allowing listening, clarifying, breaking things down, direct accountability, or non-intervention. The UI adds no long-term preference-configuration burden.
- **FR-COA-003**: The choice is based on current willingness, goal/commitment versions, capability/opportunity/constraints, confirmed and context-relevant patterns, and feedback — not failure counts. Unknown/no-log must not be treated as failure; contextual constraints must not be read as laziness. Goals or commitments must not be changed unilaterally, and no pressure via shame/threats.
- **FR-COA-004**: Each Review saves the guidance and directness actually shown, rule/model/Prompt versions, the evidence/goals/feedback actually used, uncertainties, and a summary of the choice rationale, and retains an immutable minimal-necessary context snapshot and revision history from that time. Collapsed by default; users can ask "why this guidance"; no hidden chain-of-thought, internal step-by-step reasoning, or back-filled rationales are saved; later changes in basis must not rewrite history, and snapshots must not bypass privacy deletion.
- **FR-COA-005**: Users can skip feedback, and can also agree/disagree or modify feedback in natural language. Fact corrections, interpretation disagreements, style feedback, suggestion acceptance, and actual outcomes are expressed separately; "agreement" cannot be treated as validity or causal proof.
- **FR-COA-006**: A current correction, rejection, or stop immediately affects subsequent output; no waiting for retraining, the next Review, or a permanent-preference confirmation. When saving fails, stopped guidance still must not continue; state clearly that feedback is not yet persisted, allow the user to retry actively, and never auto-nag.
- **FR-COA-007**: Learning is restricted use of contextual evidence, never automatic model training. Long-term patterns must have their content and applicable contexts explicitly confirmed; confirmation in natural conversation is sufficient and can be modified/withdrawn; local feedback, silence, or accepting one suggestion cannot become a permanent preference or personality label. An AI inference remains an inference even when confirmed. Feedback, confirmed patterns, and Reviews must not be used for model training, fine-tuning, online RL, cross-user aggregate learning, or automatic policy-weight updates based on agreement/acceptance rates.
- **FR-COA-008**: Feedback, guidance, patterns, citations, and derived data belong to the current user; users can view the content, applicable scope, status, and confirmation basis of their feedback and confirmed patterns, and are provided export, deletion, withdrawal of AI use, and restricted context retrieval. Views show only the current user's valid versions; withdrawn, deleted, expired, or baseless content must not be shown as valid patterns or reused for guidance. Deletion/withdrawal must not be bypassed by historical snapshots, caches, indexes, or newly generated text; precise retention proposals are in Data and authorize no new sensitive uses.
- **FR-COA-009**: The evaluation target is autonomous understanding or a self-chosen next step plus burden/safety — not compliance rate, agreement rate, usage frequency, or dependence; growing trust is not proof of effectiveness either.
- **FR-COA-010**: Each interaction uses a versioned conservative policy; on cold start and conflicts, admit not knowing, offer low-burden clarification, or do not intervene; crisis/clinical signals prioritize stopping ordinary guidance and comply with NFR-SAF-002, and unapproved safety protocols must not be self-completed by the policy table.
- **FR-COA-011**: Reviews and feedback must offer a short, segmentable, low-cognitive-load completion path; users can complete review-only, zero-suggestion, rejection, stop, correction, or withdrawal without writing free text, giving quantitative ratings, or processing all candidates. Caregiving, resource constraints, disability, fatigue, language/expression differences, and irregular logging must not reduce these options or be interpreted as low motivation, low cooperation, or unsuitability for guidance.

### 14.2 Conservative policy table (POC proposal, not an approved algorithm)

"Learning" means only: at the user's active Review, read permitted and relevant current evidence / valid revisions / confirmed patterns, select and record an explainable policy; updates to the policy itself require version review and regression, never automatic online optimization from satisfaction. The model handles expression and candidate explanation, not secret changes to policy weights. No fine-tuning, online RL, or failure-count thresholds are needed.

| Priority constraint / context | Candidate interaction | Directness proposal | Insufficient evidence & exit |
|---|---|---|---|
| Clinical/crisis risk | Stop ordinary guidance, enter approved safety flow | N/A | Without a protocol, CLINICAL_REVIEW; no self-diagnosis |
| Explicit stop, does not want to change, no suggestions wanted | Non-intervention or review-only | No guidance | Do not counter the wish with goal deviation; zero suggestions |
| Currently just wants to express, no problem-solving intent | Listening and reflecting back | Gentle | No pressure to say more; end any time |
| Vague goals, missing records, conflicting feedback, cold start, or user affected by fatigue, caregiving, resources, disability, language/expression limits | One optional brief clarification, review-only, or non-intervention | Gentle | Do not turn missing data or expression ability into failure/low motivation; no answer → no follow-up; simplified paths must not reduce zero-suggestion, stop, or correction rights |
| User wants to act and evidence points to a task too large / capability or opportunity limits | Propose breaking off one reversible step | Plain-spoken | Do not replace the original goal; only user choice makes it a commitment |
| Explicitly wants directness this time, supported by current goal and obstacle evidence | Directly point out the specific gap / next-step options | Direct but respectful | No forcing via failure counts, moral labels, humiliation, or commands |

The order in the table is the In Review priority proposal. Current explicit feedback takes precedence over historical patterns; on inconsistency, keep the conflict and fall back — never automatically "compromise and push". A history of preferring directness does not mean directness every time, and never overrides a stop for the current session.

### 14.3 Lightweight flow and failure states

User opens Review → sees five-dimension evidence/limits → receives listening/clarification/guidance/zero suggestions per context → may collapse explanations, give feedback, or end directly. No need to pick a style, rate, or confirm a pattern before finishing.

No records: state what is unknown; review-only or end. No goals: do not fabricate goals or demand goal creation first. Evidence invalid / retrieval or generation failure: do not pass off stale basis as new guidance; show limitations, user may retry. Current feedback reverses: stop the original policy immediately; a new display generates a revision record. Exit: stop this session's guidance with no background follow-up; regenerating the same Review remains bound by existing stop/revisions unless the user actively requests resumed guidance. A new period only adopts permitted valid context; one piece of local feedback neither automatically bans nor prefers all future styles.

### 14.4 Max decision status (do not reopen confirmed principles)

1. **P6-01**: **Approved with conditions (Max, 2026-09-15)**: Accepts the 14.2 conservative policy and the cold-start/conflict/in-session direct-accountability boundaries; `direct_accountability` may be triggered only by the user's explicit request in the current Review; historical feedback, historical preferences, or past acceptance of direct expression must never alone authorize direct accountability this time.
2. **P6-02**: **Approved with conditions (Max, 2026-09-15)**: Only long-term patterns whose content and applicable context the user has explicitly confirmed may be used across Reviews; one piece of feedback applies to the current Review only by default; users can view, correct, revoke, and delete. Unconfirmed AI inferences, one-off feedback, silence, or accepting one suggestion must not automatically form a long-term basis. Fields, retrieval/retention periods, caching, backups, physical deletion, and vendor parameters move to G2.
3. **P6-03**: **Approved with conditions (Max, 2026-09-15)**: The POC minimum acceptance is: the AI is correctable, conclusions trace back to user records, insufficient evidence explicitly says "don't know", suggestions can be stopped or rejected, and data must not be used across users. Test counts, observation periods, scenario coverage, comparison methods, effect thresholds, and experiment design move to G2/G3; this does not represent implementation, test runs, POC passage, or coding authorization.

Independent consistency and psychological-safety reviews are still pending; Max's product approval and G1/G2 authorization are not replaced by the author or tool checks.

### 14.5 Behavioral design evidence framing (new in v0.7)

- Copy and documentation for any behavioral design mechanism in the product must state its level of evidence and transfer distance; **"proven by research" or other causal endorsements must not be written**.
- Progress feedback (endowed progress) is only a **Level D analogy** (paid-subscription amount accumulation study, out-of-domain transfer) and must not serve as validity endorsement for POC features.
- Mechanism comparisons must include: ① progress visualization ② loss aversion/price locking ③ endowment/trial ④ social norms and identity ⑤ implementation intentions (bookkeeping-style commitment); the mechanism as a whole is labeled **Level E (product mechanism, pending G3 validation)**.
- Product-side validation uses single-arm threshold-based judgment: self-acknowledged with no control group and no causal attribution; thresholds are item-level Level E management values.
