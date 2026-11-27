# G1 Decision 006: Autonomous, Lightweight Adaptive Review and Feedback

- **Status**: principle-confirmation record; v0.6 details were merged into the requirements baseline with the G1 closure (Max, 2026-10-08)
- **Product owner / principle decision maker / final approver**: Max
- **Author**: Hermes
- **Record date**: 2026-09-15; dates of individual verbal confirmations are not to be inferred from this record
- **Gate**: G1 closed on 2026-10-08 (tag `G1-baseline`); coding is not authorized before G2 passes
- **Source**: summary of Max's follow-up discussion provided in this delegation, plus the explicit "OK, proceed to the next step". This is a requirements-source summary, not a new record of user behavior, a verbatim interview archive, or experimental results.
- **Related decisions**: [Decision 004](G1-Decision-004-Five-Dimension-Impact-Rules-v0.1.md), [Decision 005](G1-Decision-005-Mixed-Impact-Degrees-v0.1.md)

## 1. Confirmed principles (this section only)

### DEC-G1-006-01: Autonomy and scope

ONE BIG CHANGE allows zero or one; when there is no willingness to change, no need to change, or insufficient evidence, suggestions are not forced. The POC provides guidance only when the user actively opens Review — no proactive reminders, scheduled pushes, or background monitoring. This closes the v0.5 question of "whether zero is allowed", without changing the approved Five-Dimension and mixed rules.

### DEC-G1-006-02: Adaptive, not a mandatory coach persona

The explicit later choice supersedes the earlier "user picks one of three styles": no persona selection or extensive setup is required. The AI selects listening, clarification, task breakdown, direct accountability, or non-intervention based on current evidence and context, and adjusts its level of directness. It must not automatically increase pressure based on failure counts; absence of logs is not failure, and constraints are not laziness. The AI adjusts how it expresses and supports, and does not unilaterally modify the user's goals or commitments. Long-term behavior/thinking-pattern judgments require user confirmation; endorsement does not turn an inference into an objective fact.

### DEC-G1-006-02A: Additional authorization conditions for direct accountability

**Max chose `Approved with conditions` on 2026-09-15**: `direct_accountability` may be used only when the user explicitly requests it in the current Review. Historical feedback, historical preferences, or having accepted direct expression in the past must not by themselves authorize direct accountability this time; an in-session stop, refusal, or "don't want to change" takes precedence over historical information. This condition only closes the direct-accountability boundary of P6-01; it does not signify approval of matters beyond P6-02, P6-03, G1 as a whole, G2, coding, or merging.

### DEC-G1-006-02B: Explicit confirmation and user control for cross-Review use

**Max chose `Approved with conditions` on 2026-09-15**: only long-term patterns whose content and applicable context the user has explicitly confirmed may be used as restricted context in subsequent related Reviews. A single piece of feedback by default applies only to the current Review; users must be able to view, correct, revoke, and delete feedback or confirmed patterns. Unconfirmed AI inferences, one-off feedback, silence, or accepting a single suggestion must not automatically become long-term basis. Specific logical fields, retrieval quantity/duration, storage, caching, backup, physical deletion, and vendor retention parameters move to G2 decisions and verification. This condition only closes the product principle of P6-02; it does not signify approval of P6-03, G1 as a whole, G2, coding, or merging.

### DEC-G1-006-03: Explanation and feedback fold into the same Review

Each Review saves the guidance/directness level actually used, the evidence sources actually used, goal and feedback references, uncertainties, a summary of the choice rationale, and the rule/model/prompt versions. An immutable snapshot of the decision as of the Review and the minimally necessary context, along with revision history, is retained; later changes to feedback, sources, or versions must not rewrite the basis at that time, and retention remains subject to user deletion and privacy scope. The rationale is a verifiable summary of the decision basis; it must not be fabricated after the fact, and no hidden chain of thought is saved or requested. Explanations are collapsed by default; users can ask "why this guidance" on demand. Agree/disagree and natural-language feedback are optional and revisable; completing a Review does not require a rating.

Fact corrections, explanation disagreements, style feedback, suggestion acceptance, and actual outcomes are handled separately. Agreement does not equal accepting the suggestion, acceptance does not equal being actually helpful or completed, nor is it causal proof. Current corrections/stop requests take effect immediately; a single local feedback must not be automatically generalized into a permanent preference. User goals, commitments, and long-term personal pattern judgments all require user confirmation; persistent patterns can be confirmed through natural conversation without a settings panel.

### DEC-G1-006-04: User interest and boundaries

Change is not driven through coercion, shame, or dependency optimization; evaluation should be based on alignment with user goals, actual helpfulness, autonomy, and burden — not compliance rate, agreement rate, or engagement. The value of trust, touchpoints, and continued use is an unvalidated product hypothesis. All support modes share safety boundaries and are not exempted based on level of directness.

Feedback should be saved and used for adaptation within contextual boundaries; only long-term patterns whose content and applicable context the user has explicitly confirmed may be used across Reviews, while a single piece of feedback by default applies only to the current Review, and users can view, correct, revoke, and delete. Unconfirmed inferences, one-off feedback, silence, or accepting a single suggestion must not form long-term basis. "Continuous learning" refers only to permitted contextual memory/retrieval and rule use; it does not authorize model training, fine-tuning, or secret psychological profiling. Retrieval is limited to the same user's valid, confirmed data and contextual feedback that is necessary and authorized within the goal/time scope; it does not automatically read all history or expand into new data uses. Specific fields, retrieval quantity/duration, storage, caching, backup, physical deletion, and vendor parameters move to G2; this decision does not automatically approve any new use of sensitive inferences.

### DEC-G1-006-05: POC minimum acceptance and safety-blocking principles

**Max chose `Approved with conditions` on 2026-09-15**: the POC must validate five minimum principles: users can correct the AI; AI conclusions are traceable to user records; "I don't know" is explicitly stated when evidence is insufficient; users can stop or refuse suggestions; the system must not use data across users. Specific test counts, observation periods, scenario coverage, comparison methods, effect thresholds, and experimental designs move to G2/G3 decisions. This condition only closes the G1 acceptance principles of P6-03; it does not mean any feature has been implemented, tests have been run, or the POC has passed, nor does it signify approval of G1 as a whole, G2, coding, or merging.

## 2. Design proposals still In Review

The following are details Hermes proposed for acceptability; except for the conditional product principles P6-01, P6-02, and P6-03 explicitly recorded in this decision, none belong to the confirmed principles above:

- Conservative, explainable, versioned policy tables; cold-start/conflict/missing-evidence fallbacks, no fine-tuning or online RL.
- Logical fields and transitions for guidance enumeration, directness labels, feedback types/statuses, pattern scope, confirmation, and revocation.
- Context retrieval windows and quantity caps, evidence-expiry handling, save/delete durations, cache and backup upper bounds.
- Controlled experiments, observation time, metrics, thresholds, severity, and stop policies.

This content can only be approved after review by Max; passing independent review does not substitute for product approval.

## 3. Versions and priority

- v0.6 Product/Data/Test supersedes the v0.5 review drafts; v0.5 only changes status to Superseded, with the body retained.
- Decision 005 Section 5 "zero suggestions unaddressed" is a historical boundary and is not retroactively amended; that question is closed by these principles.
- Decision 004/005's full five-dimension assessment, non-zero-sum, fixed ordinal 1–5, per-side evidence/confidence/status, null/rejection distinctions, revision history, context versions, and the ban on proportions/netting-out all remain in force.
- Life Score, Goal Progress, and Deviation/Gap remain separate; adaptive guidance does not read degree differences to manufacture pressure scores.

## 4. Review deliverables

1. [Product v0.6](../02-requirements/POC-01-Product-UX-Spec-v0.6.md) Section 14: review the guidance and fallback proposals first.
2. [Data v0.6](../04-data-ai/Capture-Data-AI-Output-Contract-v0.6.md) Section 14: then review data and lifecycle.
3. [Test v0.6](../06-testing/POC-01-Test-Acceptance-Spec-v0.6.md) Section 19: finally review validation and stop criteria.
4. [Delta / review status](../08-research/G1-v0.6-Adaptive-Review-Delta-v0.1.md), [Evidence Card](../08-research/Adaptive-Review-Evidence-Card-v0.1.md).

G1 as a whole, G2, coding, release, and merging are not authorized by this record.
