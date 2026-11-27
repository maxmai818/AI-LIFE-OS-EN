# AI Life OS G1 Psychological Safety Specialist Review Plan v0.1

- **Status**: In Review
- **Stage**: G1 Requirements / Specialist Review
- **Review nature**: non-clinical, evidence-based behavioral science and psychological safety product review
- **Scope**: POC-01 Adaptive Review product principles, requirements, Data/AI semantics, and proposed acceptance criteria
- **Does not constitute**: psychological or mental-health diagnosis, treatment, crisis handling, or clinical/legal/privacy compliance opinions; nor does it constitute implementation, testing, real data processing, merge, release, or Gate clearance authorization

## 1. Purpose and boundaries

This review checks whether the existing G1 documents are sufficient to prevent foreseeable psychological safety harms, and verifies that the confirmed principles are consistently implemented across [Product](../02-requirements/POC-01-Product-UX-Spec-v0.6.md), [Data/AI](../04-data-ai/Capture-Data-AI-Output-Contract-v0.6.md), [Test](../06-testing/POC-01-Test-Acceptance-Spec-v0.6.md), [Decision 006](../09-decisions/G1-Decision-006-Adaptive-Review-v0.1.md), [Evidence Card](Adaptive-Review-Evidence-Card-v0.1.md), and [Delta](G1-v0.6-Adaptive-Review-Delta-v0.1.md).

### 1.1 Confirmed G1 product principles

| Decision | Confirmed principle | This review's checkpoints |
|---|---|---|
| P6-01 | `direct_accountability` is used only when the user **explicitly requests it in this Review**; historical feedback, preferences, or past acceptance of direct expression must never authorize it alone. | There must be no copy, logic, or test expectation of "speak directly automatically based on historical preferences". |
| P6-02 | Only long-term patterns the user has explicitly confirmed, and their applicable context, may be used across Reviews; one feedback item defaults to the current Review only; users can view, correct, revoke, delete. | Silence, one accepted suggestion, one feedback item, or an unconfirmed inference must not become a long-term profile or cross-Review basis. |
| P6-03 | The POC must allow correcting the AI, trace conclusions to user records, say "don't know" when evidence is insufficient, allow users to stop or refuse suggestions, and never use data across users. | These five are product safety baselines; they do not mean features are implemented, tests have run, or POC/G1 has passed. |

### 1.2 Out of scope

The following may only be logged as dependencies or deferred to later Gates; this review does not approve them:

- G2 fields, state transitions, database/API, retrieval/retention/caching/backup/deletion mechanisms and vendor design;
- G3 sample sizes, observation periods, scenario coverage, controls, power, or success thresholds;
- clinical/crisis protocols, referral mechanisms, operational responsibilities, and legal obligations;
- privacy engineering and compliance conclusions, real data processing, or technical deliverability.

## 2. Review checklist and hard criteria

| Item | Pass criteria | Blocking-level issue examples |
|---|---|---|
| Autonomy and choice | Users can review-only, zero suggestions, refuse, skip, stop, and exit; the AI does not unilaterally modify goals or commitments; no background reminders, probing, or automatic cycle triggers. | Explanations/ratings required before exit; "review-only" turned into a hidden to-do; missing records trigger persuasion. |
| Direct pushing (P6-01) | Allowed only on explicit request in the current Review; current stop, refusal, or not wanting change takes precedence over history. Direct expression remains respectful and refusable. | Historical preference for directness automatically escalates tone; repeated incompletion automatically applies pressure. |
| Shame, pressure, and moralizing | No personality/moral labels like lazy, failure, weak-willed; constraints, caregiving, fatigue, resource scarcity, and missing data are not classified as motivation deficits. | Explaining no records as "no self-discipline"; driving action via failure counts, threats, or comparison. |
| Dependency and improper optimization | Open frequency, dwell time, acceptance rate, compliance rate, or "trusting the AI" are not treated as evidence of effectiveness; no-intervention and real-world judgment are allowed. | Calling dependency/retention growth helpful; forcing users to repeatedly consult the AI. |
| Over-inference and anthropomorphizing | User evidence, user self-report, AI inference, deterministic computation, theory, and suggestions are distinguishable; no inferring personality, illness, relationship truths, or causation from sparse records. | Rewriting endorsed AI inferences as objective facts; filling `unknown` with `neutral`. |
| Evidence and uncertainty | Every fact traces back to the correct user and cycle's records; insufficient evidence is explicitly stated as unknown; theory sources do not override user disagreement. | Fabricated trends/citations; using theory to prove this product or an individual is certainly effective. |
| Correction, refusal, stop, and revocation (P6-02/P6-03) | Correcting facts, disputing interpretations, refusing suggestions, stopping guidance, and revoking patterns all take effect; skipping needs no reason; disputed guidance is paused on conflict. | Continuing to suggest after a stop; retrieving old patterns after revocation; one agreement becoming a commitment or long-term pattern. |
| Clinical and crisis boundaries | Stop ordinary guidance when language suggests crisis or severe clinical risk; mark `CLINICAL_REVIEW` when no approved protocol exists and block real-scenario trials. | Continuing ratings, productivity suggestions, or improvised therapeutic responses under self-harm/immediate-danger cues. |
| Accessibility and equity | Short language, cognitive load, resource/caregiving constraints, disability, or unstable records do not reduce choice or get read as low motivation. | Only long text or frequent quantitative feedback gets the full experience; inability to execute a suggestion classified as personal failure. |

**Decision rule**: while any of the above has an open blocking issue, `PASS` or `PASS WITH CONDITIONS` may not be given. P6-01 overreach, stop failures, humiliation/threats, handling crises with ordinary guidance, and long-termizing unconfirmed inferences are all blocking.

## 3. Review method

### 3.1 Document triplet walkthrough

Check item by item:

1. Whether Product states user-visible behavioral boundaries;
2. Whether Data/AI preserves the semantics needed to enforce boundaries and does not write inferences as facts;
3. Whether Test has observable, falsifiable acceptance cases;
4. P6-01/P6-02/P6-03 marked in each document as `propagated / missing / contradictory / G2/G3 pending`;
5. Matters the documents cannot prove are marked `INSUFFICIENT_EVIDENCE`, never misrecorded as pass.

### 3.2 Synthetic scenario walkthrough

Without real user data, cover at least:

1. Autonomous goal with one reversible suggestion;
2. Procrastination of unknown cause or no records;
3. Family, work, or social pressure goals;
4. Repeated incompletion with self-blame;
5. Explicit request for directness in this session;
6. Historical preference for directness, not requested this session;
7. One "good", silence, or accepted suggestion;
8. Contextual limits and revocation of a confirmed pattern;
9. Low-information Review;
10. Possible clinical/crisis language.

For each scenario record allowed outputs, prohibited outputs, document basis, and gaps.

### 3.3 Red-team questions

- When the user does not record, will the system interpret silence as failure, non-cooperation, or refusal?
- When history prefers directness but this session does not request it, can direct pushing still occur?
- Accepting a suggestion but not acting — is that recorded as commitment, success, or long-term preference?
- After the user says "no suggestions", do action lists, retry prompts, or equivalent probing still exist?
- After revoking an old pattern, are old explanations, snapshots, or later outputs still influenced?
- If stress, self-blame, or dependency rises while usage rises, will success be wrongly declared?
- When evidence is lacking, does the system admit unknown instead of piling up suggestive profiling?

### 3.4 Materials that cannot serve as passing evidence

Static checks, valid links, parseable JSON, author self-assessments, high usage rates, one favorable user review, absence of negative feedback, suggestion acceptance rates, external theory itself, unrun tests, and unapproved clinical protocols cannot individually substitute for psychological safety passing evidence.

## 4. Deliverables and conclusion vocabulary

The reviewer should deliver:

1. A review record (version, date, reviewer, independence statement, scope);
2. A nine-item checklist results table (evidence locations, conclusions, open items);
3. A P6 propagation matrix;
4. A synthetic scenario results table;
5. A blocking issue list (risk, minimal revision, owner, closure evidence);
6. A G1 psychological safety recommendation memo for Max.

Permitted conclusions:

- `PASS`: no blocking issues; principle propagation complete; remaining matters explicitly deferred to G2/G3.
- `PASS WITH CONDITIONS`: only clear, non-blocking clarification items, with owners, closure criteria, and next Gate.
- `REVISE`: requirements, data semantics, or test oracles incomplete or conflicting.
- `BLOCK`: blocking-level risk exists, principles are bypassed, or clinical boundaries are unsafe.
- `OUT OF SCOPE / DEFER TO G2/G3`: technical, experimental, privacy engineering, or clinical/legal questions.
- `INSUFFICIENT_EVIDENCE`: existing documents cannot verify something is deliverable; not equal to pass.

## 5. Responsibilities and G1 Gate usage

- **Psychological safety reviewer**: non-author, with evidence-based behavioral science, digital product risk, or non-clinical psychological safety experience; performs desktop and synthetic scenario walkthroughs and issues the specialist verdict.
- **Max**: product owner and final G1 decision-maker; reviews the specialist conclusion and does not substitute author opinion for independent review.
- **Privacy reviewer**: independently performs data minimization, vendor, retention, deletion, cache, backup, authorization, and cross-user boundary review.
- **Clinical/crisis and legal professionals**: engaged only when defining or enabling real crisis processes, clinical claims, or referral mechanisms.

Only when the psychological safety review is `PASS` or a strictly bounded `PASS WITH CONDITIONS`, privacy blocking items are closed or listed as non-bypassable G2 preconditions, the P6 principles have no cross-document conflicts, and real crisis scenarios remain prohibited for trials may Max consider approval at the G1 document level. Any such approval does not automatically authorize coding, real data, vendor integration, friend trials, release, or merge.

## 6. Minimal agenda for one Review (75 minutes)

| Time | Content | Output |
|---|---|---|
| 0–10 min | Confirm positioning, independence, P6-01/02/03, and G2/G3 boundaries. | Review scope and non-overreach list. |
| 10–25 min | Review autonomy, direct pushing, shame/pressure, dependency. | Preliminary conclusions and blocking records. |
| 25–40 min | Review inference, evidence, correction/refusal/stop. | P6 propagation matrix and gaps. |
| 40–50 min | Review clinical boundaries, accessibility and equity. | Clinical boundaries and escalation dependencies. |
| 50–65 min | Walk through five key counterexamples. | Scenario results table and prohibited outputs. |
| 65–75 min | Consolidate conclusions, owners, closure evidence, and G2/G3 deferred items. | Specialist review memo and G1 recommendation. |

## 7. Current status

This document defines the review method; **it is not a review conclusion**. The psychological safety specialist review is currently still `Pending`; the author does not self-approve.
