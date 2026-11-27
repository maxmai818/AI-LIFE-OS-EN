# Commercialization Validation Design v0.1 — Paywall / Pricing Experiments / Retention Analytics Instrumentation

- **Date**: 2026-11-12
- **Owner**: lifeospm (product) | **Evidence review**: lifeospsych (evidence-based psychology and behavioral design spec v0.1.0) | **Independent review**: lifeosreview (pending, see OQ-04)
- **Status**: **Approved v0.1** (Max approved via Feishu "Approved" on 2026-11-12; merged with PR #15)
- **Basis**: G2-Decision-003 (all DQ answered A + 5 positioning corrections) | Market-Research-AI-Life-OS-v0.1 (data and benchmarks) | evidence-based-psychology-design spec (evidence grading + autonomy review)
- **Scope**: Only three things — **paywall form, pricing experiments, retention analytics instrumentation**. Excludes billing system implementation and POC-01 revamp (each to be scoped separately).
- **Inherited red lines**: No diagnostic claims (wellness boundary) | Privacy first (local-first / exportable / deletable) | AI candidates must be user-confirmed | No manufacturing shame, anxiety, or dependence (G2-Decision-003 §positioning corrections).

## 1. Retention design: Weekly Review ritual (core behavioral mechanism)

### 1.1 Problem and observations (facts/inferences separated)

- **USER_REPORT**: Max requires that retention design must not be check-in/streak-style (G2-Decision-003 correction ① "weekly/monthly Review ritual retention").
- **OBSERVATION**: Category data — subscription app retention D1/D7/D30 medians ~25%/8%/4%, health category D30 ~3% (Market-Research Appendix 19/20); check-in-style habit products generally fall into streak-pressure and churn cycles.
- **INFERENCE**: The value of a five-dimension review product needs to accumulate (capture → structuring → review); the reason day-one retention fails may be "not yet enough content to review" rather than "lack of reminders".
- **UNKNOWN**: Real users' weekly Review completion rate and burden — unknowable before launch, can only be validated experimentally (Level E).

### 1.2 Target behavior (observable, decidable):

> Complete at least one weekly Review per week: open Review → browse the five-dimension review content → **confirm / modify / ignore** each of 1–3 AI candidates (any of the three counts as participation; ignoring is also valid participation).

### 1.3 COM-B quick diagnosis (Michie et al. 2011 [6])

| Dimension | Assessment | Basis |
|---|---|---|
| Capability · Psychological | Review requires reflection and cognitive load; benefits are low with sparse records | INFERENCE, to be validated |
| Opportunity · Physical | Needs a fixed time window (e.g., weekend); the product can suggest times | Design assumption |
| Motivation · Reflective | Users endorse the value of review but it is easily crowded out by daily life (intention–action gap) | Implementation intentions literature [1] |
| Motivation · Automatic | No existing trigger cues; ritual cues need to be established | Habit formation takes weeks to months [5] |

### 1.4 Candidate mechanism comparison (rejecting post-hoc rationalization)

| Mechanism | Theory | Level of evidence | Expected effect | Boundary/risk | Conclusion |
|---|---|---|---|---|---|
| ① Weekly Review ritual + implementation intentions ("When it's X, I will Y" style plans) | Implementation Intentions meta-analysis [1] | A/B (meta-analysis, moderate cross-domain transfer) | Improved intention→action conversion | Users free to set or not set a time; no penalty for not setting | **Recommended** |
| ② Daily check-in / streak | Habit reinforcement (extrinsic) | C/D | Short-term open rate ↑ | Shame, reactance, dependence; conflicts with SDT autonomy; weak health-category D30 benchmark [Market-Research 19/20] | **REJECT** (explicitly ordered by G2-Decision-003) |
| ③ Push reminder sequence | Prompt cues (COM-B automatic motivation) | D | Neutral to slightly positive | Notification burden, guardrail monitoring | Auxiliary means, not a mechanism |

**Supporting evidence**: Self-monitoring and feedback have a positive effect on goal progress (Harkin et al. 2016 meta-analysis [2], Psychological Bulletin; see original for effect sizes — this design does not cite unverified numbers).

### 1.5 Interaction translation

`Sunday evening (user-chosen or default suggestion) → gentle reminder (can be turned off) → Review page shows five-dimension review + 1–3 AI candidates → user confirms/modifies/ignores → adoption result recorded → monthly distilled into "One Line of the Month" → skippable throughout, reminders can be turned off, can exit at any time`

### 1.6 Autonomy and harm review (evidence-based-psychology-design step 6)

- Shame: no "You failed this week" style copy; skipping the weekly Review produces no negative marking. ✅ Design constraint
- Anxiety/comparison: no leaderboards, no comparison with others, no score-based qualitative labeling (Life Score does not produce a single total score — established in Product Core). ✅
- Dependence: AI suggestions editable/rejectable/reversible; "following the AI" is not the definition of completion. ✅
- Over-interpretation: With sparse data, AI wording downgrades to "Based on a small number of records, for reference only". ✅ Pending absorption into POC-01 revamp
- Privacy: Review content does not leave the device for statistics (see §3). ✅
- Clinical boundary: No-diagnostic-claims red line inherited; crisis language triggers protocol for separate approval (existing red line). ✅

### 1.7 Evidence Card (summary; full fields in Appendix A)

**Verdict: `PASS_WITH_CHANGES`** — Required changes: ① explicitly write "ignoring is also valid participation" into acceptance; ② reminders off by default and ≤1 per week; ③ launch must include §4 guardrail metrics. Unresolved assumptions (real completion rate / burden) can only be resolved by G3 real-user experiments; **the creator does not self-approve**; requires lifeosreview independent review (OQ-04).

## 2. Paywall form

### 2.1 Candidate comparison

| Form | Conversion data | Fit | Risk |
|---|---|---|---|
| Hard paywall (pay before use) | 35-day conversion 12.11% vs freemium 2.18% (Market-Research Appendix 17, RevenueCat 2026 benchmark) | Poor: this product's value needs to accumulate; day one cannot support a hard wall | Word-of-mouth damage (niche positioning relies on word of mouth, G2-Decision-003 correction ⑤) |
| Freemium unlimited | Low conversion (same as above) | Medium | Revenue unsustainable |
| **Reverse trial 7 days + freemium metering (recommended)** | No direct benchmark (Level E product hypothesis) | Good: trial covers the "first weekly Review" value moment | Needs experimental validation |

### 2.2 Recommended: reverse trial 7 days + metering (DQ-04 pending)

- **Free (always available)**: Unlimited Capture, five-dimension 1–5 assessment, 1 weekly Review per week (AI candidates ≤1), **data export/delete always free** (privacy promise not behind paywall; an INV-level commitment).
- **Pro ($12/month or $80/year)**: Historical trends and monthly ritual, full AI candidates (≤3), retrieval-augmented generation (RAG) citation deep-dives, goal tracking, monthly distillation review.
- **New users**: Get a 7-day Pro trial on signup (endowed progress progress visualization [3], level of evidence B, moderate cross-product transfer — trial progress-bar design).
- **On expiry**: Gentle downgrade to Free (all data retained, no locking, no countdown scare tactics, one explanatory email suffices).

### 2.3 Dark-pattern boundaries (hard constraints, written into acceptance)

❌ Fake countdowns ❌ Fake original-price strikethroughs (strikethrough price must be the real monthly price ×12) ❌ Deliberately complicated cancellation flows ❌ Holding trial-expiry data hostage ❌ Shame/fear copy. **Violating any one blocks release.**

## 3. Pricing experiments

- Established range (DQ-03 approved): **$8–15/month + $60–100/year**. Recommended tiers: **$12/month, $80/year (≈$6.7/month, strikethrough anchor $144/year, a real price)**. Anchoring mechanism evidence: Tversky & Kahneman 1974 [4] (level B, moderate transfer to pricing domain; a product hypothesis requiring experiment).
- Small-sample reality: under indie traffic, insufficient A/B statistical power is the norm (Market-Research Appendix 18: median first-year revenue for new subscription apps is extremely low). Therefore **phased, single-variable**:
  - **Phase 0 (pre-launch)**: Van Westendorp price-sensitivity 4 questions (waitlist/landing page), target N≥100, sets direction only, not precise values.
  - **Phase 1 (1–3 months post-launch)**: Display-structure single-variable test — "annual anchor display" vs "monthly-only display"; metrics: paid conversion rate, annual share.
  - **Phase 2 (once volume exists)**: Sequential comparison of $8/$12/$15 price points; when samples are insufficient, explicitly label "observational comparison, no causal conclusions".
- Metrics: Exposure→paid conversion, ARPU, refund rate, trial→paid conversion, annual share.

## 4. Retention analytics instrumentation

### 4.1 Event table (name / trigger / purpose / privacy level)

| Event name | Trigger | Purpose | Privacy |
|---|---|---|---|
| `app_open` | App opened | D1/D7/D30 | Anonymous ID + timestamp only |
| `capture_created` | A record submitted | Core behavior frequency | **No content text** |
| `ai_structuring_confirmed` | AI structuring confirmed/edited | AI quality + engagement | No field values |
| `dimension_view_opened` | Five-dimension view opened | Core loop completion | — |
| `review_opened` | Weekly Review flow | Review participation | No suggestion content |
| `review_action_taken` | confirm/modify/ignore | **Primary behavioral metric** | No suggestion content |
| `goal_set` / `goal_progress` | Goal operations (≤3) | Goal feature health | No goal content |
| `trial_started` / `paywall_viewed` / `subscription_started` / `subscription_cancelled` | Commercialization flow | §3 metrics | — |
| `export_requested` / `delete_requested` | Privacy operations | Privacy-promise fulfillment monitoring | — |

### 4.2 Metric definitions

- **D1/D7/D30 retention**: Any core event (`capture_created` / `review_opened`) within the corresponding window.
- **Weekly Review completion rate**: Share of active users with `review_completed` that week.
- **Guardrail (harm monitoring; engagement ≠ benefit)**: Refund rate, reminder-off rate, uninstall/delete spikes, burden/shame words in user feedback, privacy incident count.

### 4.3 Privacy constraints (consistent with "privacy as a tier-one selling point", G2-Decision-003 correction ②)

1. All events anonymously aggregated, **never containing life-event content, five-dimension values, or suggestion text**.
2. Statistics local by default; uploading aggregated statistics requires opt-in, revocable at any time.
3. Cloud LLM processing boundary and product statistics boundary are separated: analytics requests are not reused as behavioral statistics.
4. Export/delete always freely available (§2.2).

### 4.4 Threshold comparison (G2-Decision-003)

- Established milestone: **$3–5K MRR within 12 months and D30 > 10%** (2–3× the category median; an ambitious goal).
- Internal guide lines (management targets, not external benchmarks, Level E): D1 40% / D7 20% / trial→paid 8%.
- Failure criteria: Failing to reach the established milestone by M12 → triggers a positioning review (already set in G2-Decision-003); if D30 < 5% at M6, early-warning review.

## 5. Open items (pending Max)

| ID | Item | Recommendation |
|---|---|---|
| DQ-04 | Paywall form adoption (§2.2 reverse trial + metering) | **Approved: adopt recommendation (Max approved 2026-11-12)** |
| DQ-05 | Pricing tiers ($12/month + $80/year, strikethrough $144 real anchor) | **Approved: adopted (Max approved 2026-11-12)**, adjustable after Phase 0 |
| OQ-03 | Instrumentation via third-party analytics vs self-built aggregation | Prefer self-built aggregation (consistency with privacy selling point); cost to be assessed |
| OQ-04 | lifeosreview independent review of this design (evidence spec requires creator not self-approve) | Complete before POC-01 revamp |

---

## Appendix A: Evidence Card (weekly Review ritual)

```yaml
feature_name: Weekly Review ritual (core retention mechanism)
problem:
  user_report: ["Max: retention must not be check-in style; use weekly/monthly Review rituals"]
  observations: ["Category D30 median ~4%, health category ~3% (Market-Research Appendix 19/20)"]
  inferences: ["The retention bottleneck may be the value-accumulation pace and the intention–action gap, not insufficient reminders"]
  unknowns: ["Real users' Review completion rate, burden"]
target_behavior:
  actor: registered users
  context: a self-chosen fixed time each week (default suggestion: Sunday evening)
  action: open Review → browse five dimensions → confirm/modify/ignore 1–3 AI candidates
  frequency: once per week
  completion_definition: review_completed event (ignoring also counts as valid participation)
behavior_diagnosis:
  capability: {psychological: high reflection load, low benefit with sparse records (medium confidence)}
  opportunity: {physical: needs a time window; the product can suggest one (medium confidence)}
  motivation: {reflective: endorses the value but easily crowded out (high confidence), automatic: no cues (medium confidence)}
  confidence: medium (all pending real-user validation)
candidate_mechanisms:
  - mechanism: implementation intentions + self-monitoring feedback
    theory: Implementation Intentions [1] / self-monitoring [2] / COM-B [6]
    evidence_level: A/B
    expected_effect: improved intention→action conversion
    boundary_conditions: time self-chosen, reminders can be turned off, no penalty for skipping
    transfer_distance: medium (behavioral intervention → consumer subscription product)
    sources: ["[1]", "[2]", "[6]"]
  - mechanism: daily check-in / streak
    theory: extrinsic reinforcement
    evidence_level: C/D
    expected_effect: short-term open rate ↑
    boundary_conditions: conflicts with autonomy; shame risk
    transfer_distance: low (weak health-category benchmarks)
    sources: ["Market-Research Appendix 19/20"]
recommended_interaction:
  trigger: gentle reminder at a user-chosen time (≤1 per week, can be turned off)
  user_choice: three-way choice confirm/modify/ignore; skippable entirely
  ai_response: up to ≤3 candidates (Free ≤1), editable and rejectable
  feedback: record adoption results; monthly distillation "One Line of the Month"
  adjustment: reminder frequency and time user-adjustable
  exit_option: turning off reminders / exiting Review produces no negative marking
autonomy_review:
  meaningful_choice: yes (three-way choice + skippable)
  ai_overreach: none (candidates must be confirmed before entering long-term analysis)
  coercive_elements: none (no streaks, no rankings, no penalties)
risk_review:
  shame: no negative copy (acceptance constraint)
  anxiety: no comparisons, no leaderboards
  dependency: "following the AI" is not the definition of completion
  overinterpretation: wording downgraded for sparse data
  privacy: events contain no content (§4.3)
  clinical: no diagnostic claims; crisis protocol approved separately
  accessibility_and_equity: copy readability and color-vision-deficiency adaptation included in acceptance
measurement:
  primary_metric: weekly Review completion rate; D30 (G2-Decision-003 threshold >10%)
  secondary_metrics: review_action_taken share, trial→paid
  guardrail_metrics: refund rate, reminder-off rate, uninstall/delete spikes, burden/shame feedback, privacy incidents
  qualitative_questions: ["Does the Review make you feel nudged forward or judged?", "Is the reminder timing right?"]
experiment:
  hypothesis: D30 of ritualized Review is higher than a no-ritual control
  minimum_test: G3 first cohort ≥50 users, ≥8 weeks
  success_threshold: D30>10% and completion rate>30% and no guardrail deterioration
  stop_conditions: concentrated shame/burden feedback; privacy incidents
verdict:
  status: PASS_WITH_CHANGES
  confidence: medium
  required_changes: ["Write 'ignoring is also valid participation' into acceptance", "Reminders off by default", "Guardrails must be collected from launch"]
  unresolved_assumptions: ["Real completion rate", "Burden", "Paid conversion"]
  next_owner: lifeosreview (independent review, OQ-04) → G3 real-user validation
```

## Appendix B: Psychology basis and sources

- **Self-monitoring and feedback**: Consistent positive effect on goal progress (Harkin et al. 2016, Psychological Bulletin [2]; this design does not cite unverified effect sizes).
- **Implementation intentions**: Medium-to-large improvement in goal progress across multiple domains (meta-analyses [1]); ideal basis for weekly Review ritualization.
- **Endowed progress**: "Progress visualization + endowed progress" in trial/paywall design (Nunes & Dreze 2006 [3], level B) — used for the trial progress bar, **not** for self-management progress (avoiding cross-domain overgeneralization).
- **Anchoring effect**: Tversky & Kahneman 1974 [4], level B — used for annual pricing anchor, requiring a product hypothesis experiment.
- **Habit formation duration**: Lally et al. 2010 [5] — automaticity takes weeks to months; do not force "form in 21 days" claims.
- **COM-B diagnosis framework**: Michie et al. 2011 [6] — used for behavioral diagnosis and mechanism selection.

## Sources

[1] Gollwitzer & Sheeran (2006). *Implementation Intentions and Goal Achievement: A Meta‐analysis of Effects and Processes*. **Advances in Experimental Social Psychology**, 38, 69–119. (DOI: 10.1016/S0065-2601(06)38002-1)

[2] Harkin et al. (2016). *Does monitoring goal progress promote goal attainment? A meta-analysis of the evidence*. **Psychological Bulletin**, 142(2), 198–229. (DOI: 10.1037/bul0000025)

[3] Nunes & Dreze (2006). *The Endowed Progress Effect: How Artificial Advancement Increases Effort*. **Journal of Consumer Research**, 32(4), 504–512. (DOI: 10.1086/500480)

[4] Tversky & Kahneman (1974). *Judgment under Uncertainty: Heuristics and Biases*. **Science**, 185(4157), 1124–1131. (DOI: 10.1126/science.185.4157.1124)

[5] Lally et al. (2010). *How are habits formed: Modelling habit formation in the real world*. **European Journal of Social Psychology**, 40(6), 998–1009. (DOI: 10.1002/ejsp.674)

[6] Michie, van Stralen & West (2011). *The behaviour change wheel: A new method for characterising and designing behaviour change interventions*. **Implementation Science**, 6, 42. (DOI: 10.1186/1748-5908-6-42)
