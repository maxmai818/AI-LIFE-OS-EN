# Adaptive Review Evidence Card v0.1

- **Status**: In Review; the author recommends EXPERIMENT_ONLY, not an independent approval
- **Author**: Hermes (behavioral-science product analysis, not a licensed clinical role)
- **Owner / Product approver**: Max
- **Gate**: G1; coding not authorized; independent psychological safety review Pending
- **Date / source re-fetch date**: 2026-09-15
- **Corresponds to**: [Decision 006](../09-decisions/G1-Decision-006-Adaptive-Review-v0.1.md), [Product v0.6 Section 14](../02-requirements/POC-01-Product-UX-Spec-v0.6.md), [Data v0.6 Section 14](../04-data-ai/Capture-Data-AI-Output-Contract-v0.6.md), [Test v0.6 Section 19](../06-testing/POC-01-Test-Acceptance-Spec-v0.6.md)

## 1. Proposal and evidence boundaries

Only when the user actively opens the Review will we trial lightweight, dismissible contextual guidance, preserving a no-intervention path. Prioritize testing autonomy, correction cost, and burden; trust, open counts, or acceptance rates must not be treated as effectiveness. The guidance algorithm, fields, and retention periods are all product design pending review — not parameters validated by the papers below.

Sheeran et al.'s SDT meta-analysis of health-behavior RCTs reports a significant but small effect on health behavior change; this is health-intervention evidence, not direct proof of effectiveness for AI coaching, adaptive strategies, or Max personally. [1]

The JITAI literature treats adapting the type/amount/timing of support to within-person and contextual state as a design concept; this product borrows only contextual matching, and thereby obtains no authorization for sensors, proactive outreach, or background monitoring. [2]

The COM-B framework places capability, opportunity, and motivation side by side as behavior conditions; from this we propose the design hypothesis "check constraints first, do not presume laziness", but the framework itself does not validate this product's guidance selector. [3]

### Source strength and transfer distance

| Source / mechanism | Source level of evidence | Population/scenario and outcome | Limitations and product transfer |
|---|---|---|---|
| SDT / autonomy support | A (meta-analysis) | Health-behavior RCTs; overall effect small [1] | Not this product's users; this reading covered the repository abstract rather than the full meta-analysis, so no individual AI benefit can be inferred; transfer far, interaction still E |
| JITAI / contextual matching | C (theory and design framework) | Dynamic support concept in mobile health [2] | Not randomized controlled results from AI Life OS; do not use this to claim proactive intervention is effective; this support-mode strategy still E |
| COM-B / constraint clarification, task decomposition | C (framework) | Capability/opportunity/motivation model in behavior intervention design [3] | Not an individual diagnostic tool; diaries are sparse, inferences can be wrong; application to Review still E |
| Adaptive guidance improving trust/touchpoints/real outcomes | E (unvalidated product hypothesis) | No results from this product yet | Agreement may be politeness/acquiescence; acceptance is not implementation; correlation is not causation; may fail and must allow stopping |

## 2. Evidence Card

```yaml
feature_name: user-opened adaptive Review coaching and feedback
product:
  name: AI Life OS
  stage: G1 In Review; coding not authorized
  target_users: Max POC; independent private accounts only after isolation gates
  positioning: non-clinical reflection and self-directed action support
  platform: mobile-first responsive web
  privacy_level: sensitive personal records; least context; no new sensitive inference use
  business_goal: evaluate user benefit, not compliance or dependency
  release_scope: documentation proposal; no implementation or release
problem:
  user_report: users want lightweight contextual adaptation, no mandatory personality; allow zero suggestions and natural feedback
  observations: only requirement discussion summaries and repository docs; no real product behavior or efficacy data
  inferences: contextual matching and correctable explanations may reduce ill-timed suggestions; not yet validated
  unknowns: which support works for which context, burden, misinterpretation rate, long-term impact, privacy deliverability
feature:
  proposed_solution: after the user opens Review, select support mode by restricted evidence; direct pushing only selectable when the user explicitly requests it this session; save actual guidance and optional feedback
  trigger: user-opened Review only
  data_collected: proposed guidance, typed optional feedback, confirmed scoped patterns and provenance
  prohibited_designs: proactive surveillance, mandatory ratings, shame, failure-count escalation, online RL
  expected_outcome: autonomous understanding or a self-chosen next step; no change allowed

target_behavior:
  actor: the current user
  context: actively opening a cycle's Review
  action: autonomously choose review-only or one next step; understand the basis or correct it on demand
  frequency: every active Review; no mandatory count, no proactive prompting
  completion_definition: ending autonomously or keeping one user-chosen step; not a must-act or agreement with the AI
behavior_diagnosis:
  capability: whether the task is too large, comprehension or energy constraints unknown; hypotheses only from explicit self-reports and records
  opportunity: time, caregiving, resource constraints pending verification; not attributed to insufficient motivation
  motivation: expressed by the user for that session; not inferred from missing logs
  confidence: low until context and user confirmation; no clinical diagnosis
candidate_mechanisms:
  - mechanism: listening, clarification, zero-suggestion preservation of autonomy
    theory: SDT autonomy-support translation
    evidence_level: source A; product application E
    expected_effect: may reduce feeling judged and unnecessary burden
    boundary_conditions: when the user does not want change or intent is ambiguous; do not press in the name of autonomy
    transfer_distance: far; health trials are not AI coaching validation
    sources: source-1
  - mechanism: after identifying capability/opportunity constraints, propose one reversible step
    theory: COM-B diagnostic framing
    evidence_level: source C; product application E
    expected_effect: may improve matching of steps to actual constraints
    boundary_conditions: only when the user clearly wants action and evidence supports it; constraints must not be read as laziness
    transfer_distance: far; framework is not an individual selector trial
    sources: source-3
  - mechanism: versioned contextual strategy selects support mode and directness
    theory: JITAI contextual adaptation design reference
    evidence_level: source C; product application E
    expected_effect: may reduce ill-timed expression
    boundary_conditions: only user-opened Review and an explicit request this session for direct pushing; historical feedback/preferences alone never authorize; no sensors or proactive reminders
    transfer_distance: far; timing adaptation narrowed to a user-opened session
    sources: source-2
recommended_interaction:
  trigger: user opens Review
  user_choice: zero or one change; feedback skippable; no personality pre-selection required
  ai_response: Five Life Dimensions (Time / Health / Wealth / Relationship / Purpose) evidence first; select listen/clarify/decompose/no-intervene by evidence; direct pushing only when explicitly requested this session
  feedback: distinguish factual correction, explanation disagreement, style, acceptance, actual outcome; revisable
  adjustment: current corrections take effect immediately; longer-term patterns need separate explicit scope confirmation
  exit_option: stop anytime; no follow-up probing, no background follow-up

autonomy_review:
  meaningful_choice: not changing, disagreeing, withdrawing, and exiting are all complete paths
  ai_overreach: do not alter user goal commitments; confirmations must not turn inference into fact
  coercive_elements: shame, threats, failure-count pressure, and acceptance-rate optimization are prohibited
risk_review:
  shame: express via context and constraints; test self-blame and feeling judged; stop on unacceptable burden
  anxiety: no pressure ladders, no nagging to record; missing data is not failure
  dependency: do not optimize contact frequency or dependency; do not replace real-world judgment and support; growth does not prove benefit
  overinterpretation: unconfirmed patterns do not enter long-term retrieval; scope/version changes require re-confirmation
  privacy: bounded retention/deletion/derived-copy invalidation pending review; vendors unapproved, synthetic data only
  clinical: stop ordinary coaching; a separate safety protocol must be approved, otherwise CLINICAL_REVIEW
  accessibility_and_equity: allow skipping/free text/zero suggestions; resource or expression differences must not be attributed to laziness
measurement:
  primary_metric: observable completion of autonomous understanding or autonomous choice; report missing data rather than forced ratings
  secondary_metrics: optional helpfulness, sense of competence, burden, correction cost, traceability, actual outcomes recorded separately
  guardrail_metrics: stress, self-blame, shame, dependency, wrong inferences, stop failures, privacy incidents
  qualitative_questions: Why was this guidance appropriate or not? Could you choose not to change? Did the explanation add understanding or burden?
experiment:
  hypothesis: contextualized support may outperform a non-adaptive Review that is equally autonomy-respecting, without worsening autonomy or burden
  minimum_test: first walk through COA-001 through 014 one by one; after G1/G2 and privacy clearance, propose a two-week observation with at least two active Reviews
  success_threshold: zero violations of hard safety constraints; user judges it more helpful without worsening autonomy/burden; efficacy thresholds need separate approval
  stop_conditions: user asks to stop, unacceptable burden, privacy/autonomy overreach, clinical crisis scenario without a protocol
verdict:
  status: EXPERIMENT_ONLY
  confidence: low for product efficacy; principled safety constraints do not establish benefit
  required_changes: independent consistency and psychology/privacy review; Max approval of detailed proposals
  unresolved_assumptions: selector strategy effectiveness, long-term pattern generalization risk, numeric durations, vendor retention, experiment thresholds
  next_owner: Max specifies independent reviewer; creator cannot approve
```

## 3. Five counter-example walkthrough plan (no experiment run)

1. Autonomous goal: a helpful step must not become a new AI commitment.
2. Procrastination of unknown cause: clarify/no-intervene must not become a laziness label.
3. Family or social pressure goals: do not decide life direction for the user, do not force compliance with external goals.
4. Repeated incompletion with self-blame: do not escalate pressure by count; check capability/opportunity constraints.
5. Possible clinical or crisis language: stop ordinary coaching; block real trials when no protocol is approved.

Corresponds to COA-003/004/013. In any single safety failure, high acceptance rates cannot offset it. This card was written by the author; independent review is Pending; it does not belong to a run study or a PASS conclusion.

## 4. Retrieval and evidence limitations

The SDT page's first web_extract successfully obtained the abstract; subsequent re-fetches returned only partial content, and direct HTTP returned 403. The exact evidence excerpt from the first successful abstract is retained; no claim of reading the full text is made. Later PMC abstract extraction was too narrow, so direct HTTP was used to obtain the full text and verify the corresponding passages. The Sources below were generated by the task's independent citation ledger; each citation is accompanied by a short excerpt verified by text matching. All product design inferences are labeled proposal/hypothesis.

## Sources

[1] https://research.birmingham.ac.uk/en/publications/self-determination-theory-interventions-for-health-behavior-chang — Self-determination theory interventions for health behavior change: Meta-analysis and meta-analytic structural equation modeling of randomized controlled trials
      -  University of Birmingham
    > "Conclusion: The present review indicates that SDT interventions have a significant but small effect on health behavior change and suggests several directions for future research."
[2] https://pmc.ncbi.nlm.nih.gov/articles/PMC5364076 — Just-in-Time Adaptive Interventions (JITAIs) in Mobile Health: Key Components and Design Principles for Ongoing Health Behavior Support - PMC
    > "The just-in-time adaptive intervention (JITAI) is an intervention design aiming to provide the right type/amount of support, at the right time, by adapting to an individual's changing internal and contextual state."
[3] https://pmc.ncbi.nlm.nih.gov/articles/PMC3096582 — The behaviour change wheel: A new method for characterising and designing behaviour change interventions - PMC
    > "At the centre of a proposed new framework is a 'behaviour system' involving three essential conditions: capability, opportunity, and motivation (what we term the 'COM-B system')."
