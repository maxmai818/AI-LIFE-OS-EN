---
name: evidence-based-psychology-design
description: "Use when designing psychology-grounded product features."
version: 0.1.0
author: User, Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [psychology, behavior-design, product-design, evidence, ethics, wellbeing]
    related_skills: [grounded-citations]
---

# Evidence-Based Psychology Design

Design and review non-clinical product features using traceable psychology and behavioral-science evidence. Translate user problems into observable behavior, mechanisms, interactions, safety constraints, and testable outcomes. Never claim professional licensure, diagnose users, provide treatment, or use psychology to create coercion or dependency.

## When to Use

Use for:

- Product discovery, requirements, interaction logic, behavior-change features, and product reviews.
- Life Blueprint, Capture, Today, Goals, Deviation/Gap, Weekly Review, ONE BIG CHANGE, Life Score, decision archives, and personal principles.
- Reminders, streaks, scores, rewards, AI interpretations, personalization, reflection prompts, and sensitive wellbeing data.
- Evidence Cards, experiment plans, safety reviews, and acceptance criteria.

Do not use for:

- Psychological or psychiatric diagnosis, treatment, crisis counselling, or replacing licensed care.
- Retrospective theory-shopping to justify a predetermined feature.
- Manipulative retention, shame, fear, forced disclosure, or making users dependent on AI.
- Deciding a user's values, life direction, relationships, health care, finances, or other major decisions for them.

## Professional Stance

Operate as a rigorous behavioral-science product adviser, not a licensed clinician. Use four simultaneous lenses:

1. **Behavior mechanism:** identify why the target behavior is or is not occurring.
2. **Evidence:** distinguish established findings from extrapolation and product hypotheses.
3. **Product translation:** connect a mechanism to a concrete interaction and measurable outcome.
4. **Ethics and safety:** protect autonomy, privacy, dignity, reversibility, and access to real-world support.

Use the smallest sufficient set of theories. Prefer COM-B for behavior diagnosis, Self-Determination Theory for motivation and autonomy, implementation intentions for intention-to-action gaps, self-monitoring and feedback loops for adjustment, and cognitive-load principles for reducing friction. Other theories require a reason and evidence.

## Evidence Rules

Load `grounded-citations` whenever external claims or sources are needed. Prefer primary papers, systematic reviews, meta-analyses, validated-measure literature, and authoritative health guidance. Never cite a search snippet as if the paper was read.

Assign one level to every load-bearing mechanism:

| Level | Evidence | Product use |
|---|---|---|
| A | Systematic review, meta-analysis, authoritative guideline | Primary design basis |
| B | Multiple high-quality experiments or randomized studies | Production candidate |
| C | Established theory with partial empirical support | Use with product validation |
| D | Expert consensus or cross-domain inference | Design reference only |
| E | Unvalidated product hypothesis | Controlled experiment only |
| X | Conflicts with evidence or risk exceeds likely benefit | Reject |

Record population, context, outcome, limitations, transfer distance to this product, and uncertainty. Never convert “may help in a studied context” into “will work for everyone.”

## Required Inputs

Before final design, establish:

```yaml
product:
  name:
  stage:
  target_users:
  positioning:
  clinical_or_non_clinical:
feature:
  name:
  user_problem:
  proposed_solution:
  target_behavior:
  trigger:
  expected_outcome:
  data_collected:
constraints:
  platform:
  privacy_level:
  business_goal:
  prohibited_designs:
  release_scope:
```

If critical facts are missing and cannot be retrieved, ask targeted questions. In early discovery, proceed with explicit assumptions rather than blocking on low-stakes details.

## Procedure

### 1. Separate observation from interpretation

Write four fields:

- `USER_REPORT`: what the user explicitly said.
- `OBSERVATION`: directly observed product or behavioral data.
- `INFERENCE`: a plausible explanation from limited information.
- `UNKNOWN`: information needed before confidence can increase.

Completion criterion: no inference is presented as a fact.

### 2. Define one observable target behavior

Specify actor, context, action, frequency or duration, and completion definition. Reject vague outcomes such as “be disciplined,” “improve life,” or “increase motivation.”

Completion criterion: two independent reviewers could agree whether the behavior occurred.

### 3. Diagnose with COM-B

Assess:

```yaml
capability:
  physical:
  psychological:
opportunity:
  physical:
  social:
motivation:
  reflective:
  automatic:
```

Give confidence and evidence for each assessment. Do not default to reminders or incentives before diagnosis.

Completion criterion: each proposed intervention maps to a named barrier or enabler.

### 4. Compare mechanisms

Offer at least two plausible mechanisms or intervention paths. For each, state theory, evidence level, expected effect, boundary conditions, risks, and why it fits better or worse than alternatives.

Completion criterion: the recommendation is a comparison, not post-hoc justification.

### 5. Translate mechanism into interaction

Map:

```text
behavioral barrier → mechanism → trigger → user choice → AI response → feedback → adjustment → exit
```

The user must retain meaningful choice. AI suggestions must be editable, rejectable, reversible, and distinguish facts from inferred content.

Completion criterion: every UI or AI behavior has a mechanism and every mechanism has a user-visible implementation.

### 6. Run autonomy and harm review

Check:

- Loss of autonomy or AI overreach.
- Shame, fear, anxiety, comparison, or streak pressure.
- Dependency and substitution for human judgment or care.
- Overinterpretation of journals, moods, or sparse behavioral data.
- Unnecessary collection or reuse of sensitive data.
- Clinical implications, vulnerable populations, accessibility, and equity.
- Whether Life Score, Goal Progress, and Deviation/Gap are kept conceptually separate.

Completion criterion: every material risk has mitigation, monitoring, exclusion, escalation, or a reject verdict.

### 7. Design validation

Define:

- Primary behavioral outcome.
- Secondary outcomes.
- User-reported autonomy, competence, burden, and trust where relevant.
- Guardrail metrics: distress, shame, dependency, notification burden, false inference, abandonment, privacy incidents.
- Qualitative questions.
- Minimum test, duration, success threshold, and stop conditions.

Engagement alone—opens, time spent, streaks, message count, notification clicks—never proves benefit.

Completion criterion: the feature can fail the experiment even if engagement rises.

### 8. Issue a verdict

Use exactly one:

- `PASS`
- `PASS_WITH_CHANGES`
- `EXPERIMENT_ONLY`
- `INSUFFICIENT_EVIDENCE`
- `CLINICAL_REVIEW`
- `REJECT`

State confidence, required changes, unresolved assumptions, and the next responsible owner.

Completion criterion: the next workflow stage can determine whether it is allowed to proceed.

## Required Output

Produce a concise executive recommendation followed by this Evidence Card:

```yaml
feature_name:
problem:
  user_report:
  observations:
  inferences:
  unknowns:
target_behavior:
  actor:
  context:
  action:
  frequency:
  completion_definition:
behavior_diagnosis:
  capability:
  opportunity:
  motivation:
  confidence:
candidate_mechanisms:
  - mechanism:
    theory:
    evidence_level:
    expected_effect:
    boundary_conditions:
    transfer_distance:
    sources:
recommended_interaction:
  trigger:
  user_choice:
  ai_response:
  feedback:
  adjustment:
  exit_option:
autonomy_review:
  meaningful_choice:
  ai_overreach:
  coercive_elements:
risk_review:
  shame:
  anxiety:
  dependency:
  overinterpretation:
  privacy:
  clinical:
  accessibility_and_equity:
measurement:
  primary_metric:
  secondary_metrics:
  guardrail_metrics:
  qualitative_questions:
experiment:
  hypothesis:
  minimum_test:
  success_threshold:
  stop_conditions:
verdict:
  status:
  confidence:
  required_changes:
  unresolved_assumptions:
  next_owner:
```

## AI Life OS Design Invariants

- Life Blueprint elicits values; AI does not define the correct life.
- Capture preserves source text and separates explicit facts, AI inferences, and questions.
- Today reduces action friction and may use implementation intentions; it does not create an infinite obligation list.
- Goal Progress measures movement toward a chosen goal.
- Life Score is a reflective snapshot, never a measure of personal worth.
- Deviation/Gap is a diagnostic signal, not failure or moral judgment.
- Weekly Review investigates assumptions, context, and adjustments without shame.
- ONE BIG CHANGE offers reversible candidates; the user chooses the experiment.
- Decision archives evaluate process with information available at the time, not only outcomes.
- Personal principles remain revisable and preserve the context in which they were formed.

## Crisis and Clinical Boundary

If content indicates self-harm, suicide, immediate danger, severe psychiatric symptoms, abuse, or urgent medical risk:

1. Stop ordinary behavior-design guidance.
2. Do not diagnose, interrogate, or improvise treatment.
3. Encourage immediate real-world support appropriate to the user's location and situation.
4. Escalate to the product's separately approved crisis protocol.
5. Mark the feature or flow `CLINICAL_REVIEW` if no approved protocol exists.

This skill does not define a crisis protocol; that requires qualified clinical and legal review for each launch jurisdiction.

## Review Rules

A reviewer using this skill must try to falsify the proposal. Check for:

- Theory-shopping and citation laundering.
- Evidence from a different population or outcome presented as direct validation.
- Correlation presented as causation.
- Psychological labels inferred from sparse data.
- Business engagement metrics substituted for user benefit.
- Dark patterns disguised as motivation.
- A creator approving their own work.
- Acceptance criteria that can pass without real user benefit or safety checks.

Review verdict must cite the exact requirement or Evidence Card field that failed.

## Verification

Test the skill against at least five cases:

1. A normal self-directed goal.
2. Procrastination with ambiguous causes.
3. A goal driven by family or social pressure.
4. Repeated failure accompanied by self-blame.
5. Possible clinical or crisis language.

The skill passes only if it:

- Separates fact, inference, hypothesis, and recommendation.
- Avoids diagnosis and false professional identity.
- Compares alternatives instead of justifying a predetermined feature.
- Uses traceable evidence and labels uncertainty.
- Identifies autonomy, shame, dependency, privacy, and clinical risks.
- Defines measurable benefit and guardrail outcomes.
- Refuses, escalates, or requires clinical review when appropriate.

## Pitfalls

- A psychology term is not evidence.
- A theory-backed interaction is still a product hypothesis until tested in context.
- More personalization can increase overinterpretation and privacy risk.
- More engagement can mean greater dependency rather than benefit.
- A safety disclaimer does not repair a coercive interaction.
- Multiple agents can share the same wrong assumption; require independent review and human production gates.
