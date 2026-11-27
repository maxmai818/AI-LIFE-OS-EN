# Commercialization Validation Design v0.2 — Paywall / Pricing Experiments / Retention Analytics Instrumentation

- **Date**: 2026-11-15 (v0.2; v0.1 2026-11-12)
- **Version history**: v0.1 (2026-11-12, PR #15) → **v0.2 (2026-11-15, this version: closes 12 independent-review findings)**
- **Owner**: lifeospm (product) | **Evidence review**: lifeospsych (evidence-based psychology and behavioral design spec v0.1.0) | **Independent review record v0.1** (remediation table in Appendix D)
- **Status**: **Draft — pending Max approval** (PR approval governs); implementation and G3 experiment launch still require explicit Max approval.
- **Basis**: G2-Decision-003 (all DQ answered A + 5 positioning corrections) | Market-Research-AI-Life-OS-v0.1 (business benchmarks; citation format "Appendix A source n" (to avoid confusion with the Sources numbering at the end of the document)) | evidence-based-psychology-design spec (evidence grading + autonomy review)
- **Scope**: Only three things — **paywall form, pricing experiments, retention analytics instrumentation**. Excludes billing system implementation and POC-01 revamp (each to be scoped separately).
- **Inherited red lines**: No diagnostic claims (wellness boundary) | Privacy first (local-first / exportable / deletable) | AI candidates must be user-confirmed | No manufacturing shame, anxiety, or dependence (G2-Decision-003 §positioning corrections).

## 1. Retention design: Weekly Review ritual (core behavioral mechanism)

### 1.1 Problem and observations (facts/inferences separated)

- **USER_REPORT**: Max requires that retention design must not be check-in/streak-style (G2-Decision-003 correction ① "weekly/monthly Review ritual retention").
- **OBSERVATION**: Category data — subscription app retention D1/D7/D30 medians ~25%/8%/4%, health category D30 ~3% (Appendix A sources 19, 20); check-in-style habit products generally fall into streak-pressure and churn cycles.
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

### 1.4 Candidate mechanism comparison (rejecting post-hoc rationalization; evidence levels broken down to components)

| Mechanism | Theory | Level of evidence | Expected effect | Boundary/risk | Conclusion |
|---|---|---|---|---|---|
| ① Weekly Review ritual + implementation intentions ("When it's X, I will Y" style plans) | Implementation Intentions meta-analysis [1] | A/B (meta-analysis, moderate cross-domain transfer) | Improved intention→action conversion | Users free to set or not set a time; no penalty for not setting | **Recommended** |
| ② Daily check-in / streak | Habit reinforcement (extrinsic) | C/D | Short-term open rate ↑ | Shame, reactance, dependence; conflicts with SDT autonomy; weak health-category D30 benchmark [Appendix A sources 19, 20] | **REJECT** (explicitly ordered by G2-Decision-003) |
| ③ Push reminder sequence | Prompt cues (COM-B automatic motivation) | D | Neutral to slightly positive | Notification burden, guardrail monitoring | Auxiliary means, not a mechanism |
| ④ Front-loading onboarding value moments (intensive first-week guidance toward the "first five-dimension review") | Primacy value (product hypothesis) | E | Shortens the "insufficient day-one value" window | Over-dense guidance becomes harassment | **Combinatorial support**: complements ① (addresses the value-accumulation problem in §1.1 INFERENCE); does not replace the ritual |
| ⑤ Lifecycle email sequence / social accountability (partner-visible) | Social facilitation | — | — | Email = harassment boundary; social comparison directly violates red lines (§1.6) | **REJECT (exclusion rationale on record)** |

**Supporting evidence**: Self-monitoring and feedback have a positive effect on goal progress (Harkin et al. 2016 meta-analysis [2], Psychological Bulletin; see original for effect sizes — this design does not cite unverified numbers).

### 1.5 Interaction translation

`Sunday evening (user-chosen or default suggestion) → gentle reminder (can be turned off) → Review page shows five-dimension review + 1–3 AI candidates → user confirms/modifies/ignores → adoption result recorded → monthly distilled into "One Line of the Month" → skippable throughout, reminders can be turned off, can exit at any time`

### 1.6 Autonomy and harm review (evidence-based-psychology-design step 6)

- Shame: no "You failed this week" style copy; skipping the weekly Review produces no negative marking. ✅ Acceptance constraint
- Anxiety/comparison: no leaderboards, no comparison with others, no score-based qualitative labeling (Life Score does not produce a single total score — established in Product Core). ✅
- Dependence: AI suggestions editable/rejectable/reversible; "following the AI" is not the definition of completion. ✅
- Over-interpretation: With sparse data, AI wording downgrades to "Based on a small number of records, for reference only". ✅ Absorbed into POC-01 revamp
- Privacy: Review content does not leave the device for statistics (see §4.3). ✅
- Clinical boundary: No-diagnostic-claims red line inherited; crisis language triggers protocol for separate approval (existing red line). ✅

### 1.7 Evidence Card (summary; full fields in Appendix A)

**Verdict: `PASS_WITH_CHANGES` (remediated after independent review)** — "ignoring is also valid participation", "reminders off by default and ≤1 per week", and "guardrail one-vote veto (§4.5)" have all been written into acceptance. Unresolved assumptions (real completion rate / burden) can only be resolved by G3 real-user experiments; implementation only after lifeosreview closes the review (OQ-04 process).

## 2. Paywall form

### 2.1 Candidate comparison

| Form | Conversion data | Fit | Risk |
|---|---|---|---|
| Hard paywall (pay before use) | 35-day conversion 12.11% vs freemium 2.18% (Appendix A sources 17, 20; RevenueCat 2025 benchmark) | Poor: this product's value needs to accumulate; day one cannot support a hard wall | Word-of-mouth damage (niche positioning relies on word of mouth, G2-Decision-003 correction ⑤) |
| Freemium unlimited | Low conversion (same as above) | Medium | Revenue unsustainable |
| **Reverse trial 7 days + freemium metering (recommended)** | No direct benchmark (Level E product hypothesis) | Good: trial covers the "first weekly Review" value moment | Needs experimental validation |

### 2.2 Recommended: reverse trial 7 days + metering (DQ-04 adopted)

**Paywall principle (responds to High-2): sell analysis and generation depth; do not sell the core loop, do not sell "seeing your own data"** — goals fall on the boundary and are placed on the Free side (see the comparison table below).

- **Free (always available)**: Unlimited Capture, five-dimension 1–5 assessment, goal tracking (≤3, full loop: create/edit/pause/archive + progress view), 1 weekly Review per week (AI candidates ≤1), **data export/delete and reading your own data always free** (privacy promise not behind paywall; an INV-level commitment).
- **Pro ($12/month or $80/year)**: Historical trend analysis views, full AI candidates (≤3), retrieval-augmented generation (RAG) citation deep-dives, monthly ritual (generates a "One Line of the Month" distillation).
- **New users**: Get a 7-day Pro trial on signup. **Evidence-basis narrowing (responds to Medium-1)**: endowed progress is only a **Level D analogy** (paid-subscription amount accumulation study, out-of-domain transfer — Appendix B item 3); the progress-bar design itself is a **Level E product hypothesis**, not a validity endorsement.
- **On expiry**: Gentle downgrade to Free (all data retained, no locking, no countdown scare tactics, one explanatory email suffices); specific read/write semantics are itemized in the downgrade table below.

**Downgrade semantics comparison (mandatory item-by-item check before launch)**:

| Feature | During trial/Pro | Free after downgrade |
|---|---|---|
| Capture / five-dimension assessment / goals (≤3) / weekly Review | Full | **Fully unchanged** (core loop) |
| AI candidates | ≤3 | ≤1 |
| RAG citation deep-dives | Available | Disabled; previously generated analysis conclusions retained read-only and exportable |
| Historical trend analysis views | Available | Pro analysis views disabled; **all underlying data read-only visible and exportable** (you can view your own raw records/assessments/review history) |
| Monthly ritual / One Line of the Month | Can generate | Previously generated retained read-only and exportable; no new ones generated |
| Export/delete | Free | **Free (always)** |

### 2.3 Dark-pattern boundaries (hard constraints, written into acceptance)

❌ Fake countdowns ❌ Fake original-price strikethroughs (strikethrough price must be the real monthly price ×12) ❌ Deliberately complicated cancellation flows ❌ **Feature-hostage prohibition (responds to High-2): holding data hostage via paywall / limits on export or delete — permanently prohibited** ❌ Shame/fear copy. **Violating any one blocks release.**

### 2.4 Trial-expiry flow positive constraints (new in v0.2, responds to Medium-5)

- ≥48h before expiry: one neutral explanatory notification (explains what will be downgraded and what is retained; no scarcity/fear copy).
- Post-downgrade promotional/payment-chasing outreach ≤1 time within 14 days, and copy does not intensify over time (no countdown escalation).
- All commercialization notifications can be turned off with one tap; after turning off, only account/security notifications remain.
- The above three are acceptance criteria; violations block release.

## 3. Pricing experiments

- Established range (DQ-03 approved): **$8–15/month + $60–100/year**. Recommended tiers: **$12/month, $80/year (≈$6.7/month, strikethrough anchor $144/year, a real price)**. Anchoring mechanism evidence: Tversky & Kahneman 1974 [4] (level B, moderate transfer to pricing domain; a product hypothesis requiring experiment).
- Small-sample reality: under indie traffic, insufficient A/B statistical power is the norm (Appendix A source 18: median first-year revenue for new subscription apps is extremely low). Therefore **phased, single-variable**:
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
| `feedback_submitted` | User feedback submitted | Benefit/feedback monitoring | No content text; local by default, opt-in to upload, auto-deleted after 90 days |
| `trial_started` / `paywall_viewed` / `subscription_started` / `subscription_cancelled` | Commercialization flow | §3 metrics | — |
| `export_requested` / `delete_requested` | Privacy operations | Privacy-promise fulfillment monitoring | — |

### 4.2 Metric definitions

- **D1/D7/D30 retention (dual-track disclosure)**:
  - **completed track (for judgment)**: `capture_created` or `review_completed` within the window — **milestone judgment uses this track** (consistent with the primary behavioral metric).
  - **opened track (for reference)**: any core event within the window (including `review_opened`) — trend reference only, not used for judgment.
- **Weekly Review completion rate**: Share of active users with `review_completed` that week.
- **Metric-definition statement (responds to Medium-3)**: All retention/conversion metrics use the **opt-in reporting queue** as their basis; known bias direction — those willing to report skew toward higher engagement, so retention/conversion **may be overestimated**; for internal trend comparison only, not extrapolated to all users.
- **Direct measurement of user benefit (new in v0.2)**: 4-item 5-point self-report micro-scale (autonomy / competence / burden / trust), in-app once every 4 weeks. **Not a standardized scale; for internal trend monitoring only (Level E management tool), not for research-grade conclusions**; research-grade conclusions would require a standardized scale and separate ethics review.
- **Guardrail (harm monitoring; engagement ≠ benefit)**: Refund rate, reminder-off rate, uninstall/delete spikes, burden/shame words in user feedback, privacy incident count.

### 4.3 Privacy constraints (consistent with "privacy as a tier-one selling point", G2-Decision-003 correction ②)

1. All events anonymously aggregated, **never containing life-event content, five-dimension values, or suggestion text**.
2. Statistics local by default; uploading aggregated statistics requires opt-in, revocable at any time.
3. Cloud LLM processing boundary and product statistics boundary are separated: analytics requests are not reused as behavioral statistics.
4. Export/delete always freely available (§2.2).
5. **External-facing framing statement (new in v0.2, responds to Low-5)**: "Local-first" refers to **data storage and product statistics** (event content does not leave the device; statistics local by default); **AI analysis is processed by cloud LLMs** (content only within the scope of request processing). Marketing language must not imply "all processing stays on-device".
6. **OQ-03 decision hard constraint (new in v0.2, responds to Medium-3)**: any third-party analytics solution must support "local by default + opt-in + revocable + no content text", otherwise it is excluded; OQ-03 is decided within this constraint.

### 4.4 Threshold comparison (G2-Decision-003) + level labeling (responds to High-1)

| Threshold | Value | Source | Level label |
|---|---|---|---|
| D30 (milestone) | >10% | Established in G2-Decision-003 | Management target (Level E management value), not an external benchmark |
| Weekly Review completion rate | >30% | Set internally | **Level E management value (no external source)** |
| D1 / D7 guide lines | 40% / 20% | Set internally | **Level E management value** |
| Trial→paid | 8% | Set internally | **Level E management value** |

### 4.5 Experiment judgment and stop rules (new in v0.2, responds to High-1: objectively decidable)

- **Success judgment (single-arm threshold style)**: The G3 first cohort (≥50 users, ≥8 weeks) meets all §4.4 thresholds **and** no guardrail deterioration → "validation milestone reached".
- **Design self-acknowledgment (honest statement)**: Single-arm design, no control group; conclusions can only be "threshold met/not met", **no causal attribution of mechanisms**; mechanism attribution would require a separately designed control experiment and acknowledgment of power limits (not contradicting §3's "insufficient power").
- **Stop/failure rules (guardrail one-vote veto, quantified)**: Any of the following judges the experiment failed/stopped, **even if D30/completion targets are met**:
  1. Feedback containing shame/burden themes ≥5 items **and** ≥20% of total feedback (manual coding, opt-in channel);
  2. Weekly account-deletion rate > 2× the first-month baseline;
  3. Any privacy incident occurs;
  4. Refund rate > 5% (2 consecutive calendar months).
- All threshold numbers are **Level E management values** (no external benchmarks), adjustable once at the M6 review with a recorded trail.

## 5. Validation milestones and judgment (aligned with G2-Decision-003)

- Established milestone: **$3–5K MRR within 12 months and D30 > 10%** (completed track).
- M6 warning line (internal management value): D30 < 5% → early-warning review.
- Failure judgment: Failing the established milestone by M12 → triggers a positioning review (set in G2-Decision-003).
- Guardrail deterioration triggers §4.5 stop rules; independent of commercial milestones and executed with priority.

## 6. Decisions and open items

| ID | Item | Status |
|---|---|---|
| DQ-04 | Paywall form adoption (reverse trial + metering) | **Approved: adopt recommendation (Max approved 2026-11-12)** |
| DQ-05 | Pricing tiers ($12/month + $80/year, strikethrough $144 real anchor) | **Approved: adopted (Max approved 2026-11-12)**, adjustable after Phase 0 |
| OQ-03 | Third-party vs self-built instrumentation | Unresolved, but hard constraint locked (§4.3 item 6) |
| OQ-04 | lifeosreview independent review | Review complete (PASS_WITH_CHANGES, 12 findings); **remediation closure review in progress** |

---

## Appendix A: Evidence Card (weekly Review ritual)

```yaml
feature_name: Weekly Review ritual (core retention mechanism)
problem:
  user_report: ["Max: retention must not be check-in style; use weekly/monthly Review rituals"]
  observations: ["Category D30 median ~4%, health category ~3% (Appendix A sources 19, 20)"]
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
    evidence_level: "component-level: implementation intentions A/B [1]; self-monitoring A [2]; the ritual as a whole Level E"
    expected_effect: improved intention→action conversion
    boundary_conditions: time self-chosen, reminders can be turned off, no penalty for skipping
    transfer_distance: medium (behavioral intervention → consumer subscription product)
    sources: ["[1]", "[2]", "[6]"]
  - mechanism: front-loading onboarding value moments (combinatorial support)
    theory: primacy value (product hypothesis)
    evidence_level: E
    expected_effect: shortens the day-one value gap window
    boundary_conditions: over-dense guidance becomes harassment
    transfer_distance: unverified
    sources: ["product hypothesis"]
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
  primary_metric: weekly Review completion rate; D30 completed track (G2-Decision-003 >10%)
  secondary_metrics: review_action_taken share, trial→paid, 4-item self-report micro-scale (Level E management tool)
  guardrail_metrics: "one-vote veto (§4.5): shame/burden feedback ≥5 items and ≥20%, weekly deletion rate > 2× baseline, privacy incidents, refund rate >5% for 2 months"
  metric_caveat: all metrics on an opt-in queue basis; may overestimate; not extrapolated to all users
  qualitative_questions: ["Does the Review make you feel nudged forward or judged?", "Is the reminder timing right?"]
experiment:
  hypothesis: "single-arm threshold style: the G3 first cohort meets all §4.4 thresholds and no guardrail deterioration (no control group, no causal attribution)"
  minimum_test: G3 first cohort ≥50 users, ≥8 weeks
  success_threshold: "D30(completed)>10% | completion rate>30% | trial→paid 8% (all Level E management values; sources in §4.4)"
  stop_conditions: "§4.5 four quantified rules; guardrail one-vote veto"
verdict:
  status: PASS_WITH_CHANGES (after remediation, pending lifeosreview review closure)
  confidence: medium
  required_changes: ["See Appendix D remediation table (all applied in v0.2)"]
  unresolved_assumptions: ["Real completion rate", "Burden", "Paid conversion"]
  next_owner: lifeosreview (review closure) → Max final review → G3 real-user validation
```

## Appendix B: Psychology basis and sources

- **Self-monitoring and feedback**: Consistent positive effect on goal progress (Harkin et al. 2016, Psychological Bulletin [2]; this design does not cite unverified effect sizes).
- **Implementation intentions**: Medium-to-large improvement in goal progress across multiple domains (meta-analyses [1]); ideal basis for weekly Review ritualization.
- **Endowed progress (Medium-1 correction)**: "Progress visualization + endowed progress" in trial/paywall design (Nunes & Dreze 2006 [3], level B) — used for the trial progress bar only, **as a Level D out-of-domain analogy** (paid-subscription amount accumulation study); **not** for self-management progress, and not as a validity endorsement for any POC feature.
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

## Appendix D: Independent review remediation cross-reference table

| Finding | Severity | v0.2 location | Closure criteria satisfaction |
|---|---|---|---|
| High-1 experiment judgment not objectively executable | Blocking | §4.4 threshold-sources table + §4.5 single-arm judgment / quantified stop rules + Appendix A experiment rewritten | ✅ ① single-arm threshold-style hypothesis ② per-item Level labeling ③ quantified stop + guardrail one-vote veto |
| High-2 putting goals in Pro touches the core loop | Blocking | §2.2 paywall principle + Free includes full goal loop + downgrade semantics comparison table + §2.3 feature-hostage prohibition | ✅ ① Free retains the minimal goal set (in fact the full loop) ② read/write semantics compared item by item ③ prohibition added |
| Medium-1 endowed progress transfer overstated | Major | §2.2 basis narrowed (Level D analogical transfer; progress bar Level E) + Appendix B item 3 | ✅ |
| Medium-2 missing user-benefit measurement | Major | §4.2 4-item micro-scale (labeled Level E management tool) + §4.5 decidable verdict rules | ✅ |
| Medium-3 opt-in sampling bias / OQ-03 unlocked | Major | §4.2 metric-definition statement and bias direction + §4.3 item 6 OQ-03 hard constraint | ✅ |
| Medium-4 mechanism comparison incomplete / evidence grading too coarse | Major | §1.4 additions ④⑤ (with exclusion rationale) + evidence grading broken down to components + Appendix A synced | ✅ |
| Medium-5 trial-expiry flow has no positive constraints | Major | §2.4 three acceptance-level constraints | ✅ |
| Low-1 RevenueCat year mislabeled | Minor | §2.1 changed to 2025 | ✅ |
| Low-2 citation locations ambiguous | Minor | Unified "Appendix A source n" notation throughout | ✅ |
| Low-3 feedback event missing | Minor | §4.1 feedback_submitted row (local by default / opt-in / 90-day deletion) | ✅ |
| Low-4 retention metric misalignment | Minor | §4.2 dual-track disclosure; milestone uses the completed track | ✅ |
| Low-5 local-first framing not explained | Minor | §4.3 item 5 external-facing framing statement | ✅ |
