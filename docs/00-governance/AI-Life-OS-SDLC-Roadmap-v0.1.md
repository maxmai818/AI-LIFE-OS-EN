# AI Life OS SDLC Roadmap and First POC Plan

> **For Hermes:** This document is for product and project planning only. Do not enter the coding phase until the requirements, design, and POC exit criteria have been reviewed and approved by the user.

**Goal:** Based on risk-driven development, phase reviews, and traceable deliverables, advance AI Life OS from a product idea to a verifiable POC, MVP, private beta, and official release.

**Architecture:** The system will ultimately consist of a life fact ledger, personal semantic memory, an external knowledge base, a deterministic metrics/deviation engine, and an evidence-backed AI interpretation layer. The first POC validates only the core loop of "natural capture → structuring → user correction → trend/deviation calculation → evidence-based periodic review" — no full Mini Program, large-scale retrieval-augmented generation (RAG), or multi-agent systems up front.

**Initial delivery form:** For the POC, a single-user responsive web prototype is recommended; the MVP will then use a WeChat Mini Program as the primary client. This validates the product kernel first, and avoids mistaking WeChat login, review, authorization, and release processes for core product validation.

---

## 1. Product North Star and Boundaries

### 1.1 Product Mission

Help users answer four long-term questions:

1. What kind of person do I want to become?
2. Where am I actually spending my time and energy?
3. Am I approaching or deviating from my goals?
4. What is the single most worthwhile thing to change next?

### 1.2 Core Loop

```text
Life Blueprint
    ↓
Capture (natural-language logging)
    ↓
AI structuring + user confirmation/correction
    ↓
Structured facts and personal memory
    ↓
Goal progress, trend, and deviation calculation
    ↓
Today / Weekly Review
    ↓
ONE BIG CHANGE
    ↓
Actions and feedback for the next cycle
```

### 1.3 Design Principles

1. **Facts over opinions**: structured data and the user's original records take precedence over model speculation.
2. **Algorithms compute, retrieval finds, AI explains**.
3. **Personal evidence over external knowledge**: the user's history outranks general theories from books.
4. **Traceability**: important conclusions must lead back to the original records, metrics, or sources.
5. **Correctability**: users can fix the AI's extraction, with the original values and revision history preserved.
6. **No over-quantification**: Life Score, Goal Progress, and Deviation/Gap are kept explicitly separate.
7. **Few but effective**: recommendations focus on ONE BIG CHANGE, not a pile of twenty suggestions.
8. **No major decisions on the user's behalf**: the system provides evidence, contradictions, and options; it does not act as the judge of the user's life.
9. **Privacy protected by default**: minimal collection, explicit purposes, exportable, deletable.
10. **YAGNI**: V1 does not add complex infrastructure ahead of time for imagined futures.

### 1.4 Explicitly Out of Scope for V1

- Bank account synchronization and full financial systems
- Apple Health and smartwatch sync
- Community, leaderboards, and friend features
- Large-scale e-book import
- Multi-agent orchestration
- Automated browser operation and external task execution
- Smart home / ambient automation
- AI making "good person / bad person" judgments about people in the user's relationships
- Black-box, unexplainable single life scores

---

## 2. SDLC Management Framework

### 2.1 Lifecycle Phases

```text
Initiation / Discovery
→ Requirements Analysis
→ Solution & Architecture Design
→ POC
→ MVP Development
→ System Validation
→ User Acceptance / Private Beta
→ Release
→ Operations & Continuous Improvement
```

Every phase has inputs, deliverables, reviewers, and exit criteria. Completing a phase does not automatically grant entry to the next one; the corresponding Gate Review must be passed.

### 2.2 Stage Gates

| Gate | Review Content | Pass Criteria |
|---|---|---|
| G0: Concept Confirmation | Vision, target users, core problem | Clearly states "for whom, solving what problem", and is not a feature list |
| G1: Requirements Baseline | PRD, user journeys, scope, non-functional requirements | Must/Should/Could/Won't confirmed; key terms unambiguous |
| G2: Design Baseline | Data model, AI behavior, privacy, security, prototypes | Key flows work end to end; data is traceable; risks have control plans |
| G3: POC Exit | Technical feasibility, data quality, user value | POC acceptance metrics reach thresholds; decide continue / adjust / stop |
| G4: MVP Release Readiness | Features, testing, monitoring, rollback, privacy | No blocking defects; UAT passed; release checklist signed |
| G5: Private Beta Exit | Retention, usage quality, recommendation effectiveness | Preset product metrics met; major risks controllable |
| G6: General Release | Stability, compliance, support capability | SLO, data governance, user support, and incident response readiness complete |

### 2.3 Requirements Traceability

It is recommended to assign each requirement a unique ID, for example:

- `FR-CAP-001`: the user can input a passage of natural-language life logging
- `FR-STR-001`: the system saves the raw input and the structured extraction results
- `FR-REV-001`: conclusions in the weekly report are traceable to evidence
- `NFR-PRV-001`: the user can delete all of their own data
- `AI-SAF-001`: definite conclusions must not be generated when evidence is insufficient

Every requirement must be linked through:

```text
Requirement → Design → Implementation Task → Test Case → Acceptance Result → Release Version
```

### 2.4 Change Control

- Requirements that pass review form the Baseline.
- New ideas go into the Product Backlog; they are not inserted directly into the current iteration.
- Changes affecting scope, the data model, privacy, or delivery timelines require a Change Request.
- Each Change Request must state at least: reason, benefit, cost, risk, affected requirements, and whether anything else will be deferred.
- Maintain a Won't Do List in every phase to prevent scope creep.

---

## 3. Product Roadmap Overview

> Timings are initial estimates only. A formal project schedule is established after the requirements and design reviews.

| Phase | Suggested Duration | Core Objective | Primary Gate |
|---|---:|---|---|
| Phase 0: Product Discovery | 1–2 weeks | Confirm users, problem, value hypotheses, and scope | G0 |
| Phase 1: Requirements & Design | 2–3 weeks | Establish the PRD, data dictionary, AI behavior specification, and prototypes | G1, G2 |
| Phase 2: POC-01 Capture-to-Review | 2–4 weeks | Validate the vertical loop from natural capture to evidence-based review | G3 |
| Phase 3: MVP Build | 6–10 weeks | Build a WeChat Mini Program MVP that real users can use continuously | G4 |
| Phase 4: Private Beta | 4–8 weeks | Validate usage habits, recommendation value, trust, and retention | G5 |
| Phase 5: V1 Launch | 6–8 weeks | Stable release, data governance, operations, and support | G6 |
| Phase 6: Memory & RAG Expansion | 8–12 weeks | Decision archive, principle library, personal semantic memory, a small amount of knowledge material | Independent review |
| Phase 7: Life Flywheel | Ongoing | Cross-dimension correlation, upstream variable identification, personalized experiments | Model governance review |
| Phase 8: Agent Capability | Long term | Authorized planning and limited execution | Security/permission special review |

---

## 4. Phase 0: Product Discovery

### 4.1 Objective

Compress the grand "life operating system" into a verifiable product hypothesis, avoiding validation of the wrong problem first.

### 4.2 Key Activities

1. Define the first target user personas.
2. Describe core scenarios using Jobs-to-be-Done.
3. Interview 5–8 potential users to validate real pain points around capture, review, and recommendations.
4. Map existing alternatives: to-do apps, habit apps, journals, Notion, ChatGPT, health/finance tools.
5. Build a hypothesis list and prioritize it by risk.
6. Define what product success and failure each mean.

### 4.3 Initial Product Hypotheses

- H1: Users are willing to spend no more than 60 seconds a day logging their life.
- H2: AI can reliably convert natural language into structured facts the user accepts.
- H3: Evidence-backed periodic reviews are more trusted and more valuable than generic AI advice.
- H4: Giving one key change is easier to act on than a long list of suggestions.
- H5: Users are willing to keep logging because the system understands them better over time.

### 4.4 Deliverables

- Product Vision
- Lean Canvas
- Target users and JTBD
- User interview notes and insights
- Problem statement and value proposition
- Hypothesis/risk register
- Initial product KPIs
- G0 review record

### 4.5 G0 Exit Criteria

- The target user, core pain point, and product value can be described in one sentence.
- At least one high-frequency, genuinely existing usage scenario is confirmed.
- The first POC addresses the highest-risk hypothesis, not the most attractive feature.
- The user agrees to the V1 Won't Do List.

---

## 5. Phase 1: Requirements & Design

### 5.1 Product Requirements Workflow

1. Write the V1 PRD.
2. Define the complete user journeys for Life Blueprint, Capture, Goal, and Review.
3. Establish functional requirements, non-functional requirements, and AI-specific requirements.
4. Define permissions, data retention, export, and deletion rules.
5. Establish a glossary to avoid mixing up "goal, metric, task, event, status, score, deviation".
6. Produce low-fidelity prototypes and run usability reviews.

### 5.2 Data Design Workflow

Define the conceptual model first rather than jumping straight to tables:

- User / Profile
- Life Area
- Blueprint
- Goal
- Metric Definition
- Capture
- Extracted Observation
- Event
- Action / Task
- Daily Metric
- Goal Progress
- Deviation
- Review
- Recommendation
- Evidence Reference
- User Correction
- Decision (keep as a concept for now)
- Principle (keep as a concept for now)

Key principles:

- Raw Capture is never overwritten by AI results.
- AI extraction results carry model version, schema version, and confidence.
- User revisions form separate versions and audit records.
- Score results store the calculation version and an input snapshot.
- AI conclusions store evidence references and allow replay.

### 5.3 Scoring and Deviation Design Workflow

Define these separately:

1. **Life State / Dimension Status**: the state over a period of time.
2. **Goal Progress**: the completion ratio or stage of a goal.
3. **Deviation**: the projected deviation from plan given the current trend.
4. **Data Confidence**: whether the data is sufficient to support a judgment.

Before the POC, do not commit to a permanent 0–100 Life Score formula. First validate whether per-dimension status, goal progress, trends, and evidence are useful; then decide whether a total score is needed at all.

### 5.4 AI Behavior Specification

The AI must:

- Distinguish facts, correlations, speculation, and recommendations.
- Prefer citing the user's own data.
- Provide evidence for key conclusions.
- State explicitly when evidence is insufficient.
- Never fabricate user experiences, numbers, or causal relationships.
- Never make definite high-risk judgments on medical, legal, or investment matters.
- Never decide major matters such as breakups or resignations on the user's behalf.
- Produce outputs that the user can correct and give feedback on.

### 5.5 Privacy and Security Design

- Data classification: identity information, health, finance, relationships, emotions, general records.
- Data minimization principle.
- Encryption in transit and at rest requirements.
- Environment isolation and least privilege.
- Data export and complete deletion.
- Model provider data use and retention policies.
- Log redaction.
- Prompt injection and malicious document protection (RAG phase).
- Threat model for sensitive data leaks and account takeover scenarios.

### 5.6 Deliverables

- V1 PRD
- User Journey / User Flow
- MoSCoW scope table
- Conceptual Data Model
- Data dictionary and event schema draft
- Life Score/Progress/Deviation design notes
- AI Behavior Specification
- Non-functional requirements (NFR)
- Privacy Impact Assessment
- Threat Model
- Low-fidelity interactive prototype
- Acceptance Criteria
- Requirements Traceability Matrix
- G1/G2 review records

---

## 6. First POC: POC-01 Capture-to-Review

### 6.1 Why This POC First

The biggest unknown risk right now is not "whether the Mini Program can be built", nor "whether a vector database can be deployed", but:

> Can a passage of natural-language life logging from a user reliably become trustworthy, correctable, computable data, and ultimately produce an evidence-based, genuinely useful review?

If this loop does not hold, even connecting hundreds of books, building a beautiful UI, or adding agents will not produce an effective product.

### 6.2 POC Objectives

Validate the following technical and product hypotheses:

1. Natural-language Capture can reliably extract core life events and metrics.
2. Users can confirm and correct extraction results at low cost.
3. Structured data can deterministically compute goal progress and deviation.
4. AI can generate concise, useful periodic reviews grounded in real evidence.
5. Users can distinguish system facts, speculation, and recommendations, and are willing to trust this way of expressing them.

### 6.3 POC Users and Time Frame

- Start with a single user, expanding to at most 3–5 internal test users.
- Validate extraction quality with a batch of prepared, manually annotated test statements.
- Then conduct at least 7 days of real usage; ideally 14 days.
- A small amount of historical records may be imported to round out weekly report samples, but must be marked as imported data.

### 6.4 POC Feature Scope

#### A. Simplified Life Blueprint

- All Five Life Dimensions can describe a vision.
- Choose at most 3 current focus goals.
- Each goal contains: Why, metric, current value, target value, target date, action system.

#### B. Text Capture

- The user inputs a passage of natural language.
- The raw text and timestamp are saved.
- No voice, images, bills, or OCR in the POC for now.

#### C. AI Structuring

The recommended minimal output includes:

- `life_area`
- `event_type`
- `metric_type`
- `value`
- `unit`
- `occurred_at`
- `sentiment/mood`
- `energy`
- `goal_links`
- `confidence`
- `evidence_span` (the span in the original text supporting this field)
- `needs_confirmation`

#### D. User Confirmation and Correction

- Display the AI-extracted structured results.
- The user can confirm, edit, or delete individual extraction results.
- Preserve both the original extracted values and the user-revised values.
- Revision data enters an evaluation set for later improvements to Prompts/Schema.

#### E. Goal Progress and Deviation

- Deterministic calculations only for measurable goals.
- Show current progress, target time, and a simple trend.
- When data is insufficient, show "Cannot determine for now"; never generate pseudo-precise numbers.
- The POC does not generate a permanent single Life Score.

#### F. Periodic Review

The output is fixed as:

1. What happened this period (facts)
2. Which areas improved (facts + evidence)
3. Which goals may be deviating (calculation + evidence)
4. Possible contributing factors (explicitly labeled as speculation)
5. ONE BIG CHANGE (one recommendation)
6. The list of records supporting the above conclusions
7. Insufficient-data statement

#### G. Feedback

- Users rate the review: accuracy, helpfulness, trustworthiness.
- Users can flag "inaccurate", "unfounded", or "recommendation not actionable".
- Users can accept, modify, or reject the ONE BIG CHANGE.

### 6.5 Explicitly Out of Scope for the POC

- WeChat login and official Mini Program release
- Voice, photos, bills, and document uploads
- External book RAG
- Full decision archive UI
- Full personal principle library UI
- Multi-user collaboration
- Notification system
- Payments and subscriptions
- Total Life Score ranking
- Automatic cross-dimension causal inference
- Automatic task execution

### 6.6 POC Recommended Logical Architecture

```text
Responsive single-user UI
        ↓
Capture / Blueprint / Review API
        ↓
Raw data and structured-fact storage
        ↓
AI Structured Output service
        ↓
User corrections and audit records
        ↓
Deterministic Progress / Deviation calculation
        ↓
Evidence Builder
        ↓
AI Weekly Review Generator
        ↓
User feedback and evaluation records
```

The POC may skip a standalone vector database for now. The weekly report first queries recent records by user, date, goal, and dimension. Only after POC-01 proves the core loop holds does POC-02 validate personal semantic memory and hybrid retrieval.

### 6.7 POC Test Dataset

Build at least 40–60 manually annotated Chinese Captures, covering:

- One sentence containing one event
- One sentence containing multiple dimensions
- Vague time references: "last night", "this afternoon", "this week"
- Missing numeric values
- Negation: "I didn't exercise today"
- Correction: "not one hour, forty minutes"
- A mix of subjective emotion and objective facts
- Related to a goal but without naming the goal
- Irrelevant chit-chat
- Sensitive health, finance, and relationship content
- Self-contradictory or indeterminable content

Each test data item includes the manually expected structure and acceptable variants.

### 6.8 POC Acceptance Metrics

#### AI Structuring Quality

- Target accuracy on key fact fields: ≥ 85%.
- Numeric values, units, and negation semantics must have no high-risk errors.
- Low-confidence or ambiguous inputs should trigger confirmation, not guessing.
- After user revision, the saved and displayed results must be 100% consistent.

#### Calculation Correctness

- Goal Progress and Deviation must be 100% reproducible on the standard test data.
- The same inputs and the same algorithm version must produce the same calculation results.
- No pseudo-precise deviation may be output when data is insufficient.

#### Review Trustworthiness

- Every important factual conclusion has at least one Evidence Reference.
- The test set must contain no seriously unfounded facts.
- Speculation must be marked with wording such as "possible", "correlated", or "existing data suggests".
- Users can go from a conclusion back to the original Capture.

#### User Experience

- Target median time for daily capture: ≤ 60 seconds.
- Target median time for structured confirmation/correction: ≤ 30 seconds.
- Target average review accuracy rating: ≥ 4/5.
- Target average review helpfulness rating: ≥ 4/5.
- At least half of ONE BIG CHANGEs are accepted or accepted after modification.

#### System Quality

- Raw records, extraction results, revisions, and algorithm versions are all traceable.
- A single user can export all POC data.
- A single user can delete all POC data.
- Errors must never be swallowed silently; diagnosable logs are required, and logs must not leak full sensitive content.

### 6.9 POC Exit Decision

#### GO

- Core acceptance metrics reach or approach their targets.
- Users find the review more trustworthy and useful than an ordinary chat summary.
- The main problems can be fixed via Prompts, Schema, interaction, or rules.

#### PIVOT

- Capture is valuable but scoring/deviation is not: build an AI journal and review product first.
- The review is valuable but daily capture is too burdensome: change the input method or lower the frequency.
- AI extraction quality is insufficient: narrow the supported metrics and scenarios.
- Users reject a "life score": keep trends, status, and deviation, without a total score.

#### STOP / REASSESS

- Users are unwilling to keep logging.
- AI correction costs more than manual entry.
- Evidence-based reviews still cannot produce perceivable value.
- Privacy risks cannot be reasonably controlled within the target cost.

### 6.10 POC Deliverables

- POC Scope Statement
- POC Requirements
- Data Schema v0.1
- Manually annotated test set and annotation guidelines
- Progress/Deviation rules v0.1
- AI Prompt/Output Contract v0.1
- Test plan and test report
- AI Evaluation Report
- User trial logs and interview results
- Risk register update
- POC Exit Report
- G3 decision record

---

## 7. POC-02: Personal Memory Retrieval (only after POC-01 passes)

### 7.1 Objective

Validate whether personal semantic memory and hybrid retrieval meaningfully improve answer quality — not to use retrieval-augmented generation (RAG) for its own sake.

### 7.2 Scope

- Index only the user's own Captures, journal entries, and weekly reviews.
- Support questions like: "When has a similar situation appeared before?"
- Structured filtering: user, date, life dimension, goal.
- Semantic retrieval: similar experiences and expressions.
- The user's recent data takes priority.
- Outputs include references to the original records.

### 7.3 Not Included Yet

- Hundreds of e-books
- Automated OCR pipelines
- Self-trained embedding models
- Complex multi-route agent retrieval

### 7.4 Success Criteria

Compared against a "recent records only" baseline, semantic retrieval shows significant improvement in human evaluation on:

- Relevance
- Evidence coverage
- Degree of personalization
- User trust

If there is no significant improvement, vector retrieval is not promoted to a core dependency.

---

## 8. Phase 3: MVP Build

### 8.1 MVP Objective

Productize the validated POC core loop into a WeChat Mini Program that a small number of real users can use continuously.

### 8.2 MVP Features

- Registration, login, and user isolation
- Life Blueprint
- Text and voice Capture
- AI structuring confirmation
- Today
- Up to 3 core Goals
- Goal Progress / Deviation
- Weekly Review
- ONE BIG CHANGE
- Basic Ask Life (personal records)
- User feedback
- Data export and deletion
- Auditing, error handling, and basic monitoring

### 8.3 Engineering and Quality Requirements

- Separate environments: Development / Test / Production
- Database migration and rollback strategy
- CI checks
- Unit, integration, contract, and end-to-end tests
- Regression tests on the AI fixed evaluation set
- Schema and Prompt versioning
- Privacy and security review
- Backup and restore drills
- Release and rollback Runbook

### 8.4 G4 Release Criteria

- All Must Have requirements pass acceptance.
- No unresolved P0/P1 defects.
- AI regression evaluation is no lower than the POC baseline.
- Data export, deletion, restore, and isolation verified.
- Monitoring, alerting, rollback, and incident response readiness complete.

---

## 9. Phase 4: Private Beta

### 9.1 Target Users

Aim for 20–50 seed users willing to log continuously and give feedback, rather than chasing large-scale user acquisition.

### 9.2 Key Validations

- Whether users understand the product's value on day one
- Whether Capture is low-friction enough
- Whether users correct the AI
- Whether the weekly report becomes something to look forward to
- Whether ONE BIG CHANGEs get acted on
- Whether more logging genuinely yields more accurate recommendations
- Whether privacy concerns hinder usage

### 9.3 Candidate Product Metrics

- Percentage completing the Blueprint on day one
- Percentage Capturing on at least 4 days in week one
- Weekly report open rate
- Weekly report evidence click-through rate
- Recommendation accept / modify / reject ratios
- Week 2 and week 4 retention
- User revision rate and how it changes over time
- Rate of reported unfounded conclusions
- Frequency of users asking questions on their own initiative

Do not treat DAU as the sole core metric. A better North Star candidate is:

> The number of active users who complete the "capture → review → accept/modify the next action" loop each week.

---

## 10. Phases 5–8: Subsequent Evolution

### Phase 5: V1 Launch

- Performance and stability optimization
- User help and support processes
- Privacy policy and terms of service
- Subscription/business model validation (if needed)
- Operational metrics and incident response

### Phase 6: Memory & RAG Expansion

- Decision archive
- Decision due-date reviews
- Personal principle library
- Reading notes import
- A small amount of licensed material import
- SQL + vector hybrid retrieval
- Citation, source, and permission governance
- Document prompt-injection protection

### Phase 7: Life Flywheel

- Cross-dimension correlation analysis
- Upstream variable identification
- Personalized behavioral experiments
- Separating baseline from trend
- Counterfactual and causal wording governance

Note: the system may only report correlations first; causal claims are prohibited without rigorous experimental design.

### Phase 8: Agent Capability

- Goal Planner
- Research Assistant
- Plan Decomposer
- Review Agent
- Limited execution authorized item by item by the user

Every automated execution capability must have: a permission scope, preview, confirmation, audit, and revocation or remediation mechanisms.

---

## 11. Testing and Validation Strategy

### 11.1 Traditional Software Testing

- Unit tests: rules, calculations, validation, permissions
- Integration tests: database, model API, task scheduling
- Contract tests: AI Structured Output Schema
- End-to-end tests: Blueprint → Capture → Review
- Security tests: privilege escalation, data isolation, sensitive logs
- Recovery tests: backup, migration, rollback
- Performance tests: Capture and Review response times

### 11.2 AI-Specific Evaluation

- Field extraction accuracy
- Numeric value and negation semantics accuracy
- Evidence faithfulness
- Unfounded-conclusion rate
- Uncertainty expression
- Recommendation actionability
- Safety in sensitive scenarios
- Regression before/after Prompt/model changes

### 11.3 User Validation

- Task-based usability testing
- 7–14 day Diary Study
- Weekly report interviews
- Follow-ups on recommendation acceptance/execution
- Distinguishing how users feel "understood" versus "judged"

---

## 12. Risk Register (Initial Version)

| Risk | Impact | Initial Mitigation |
|---|---|---|
| Users unwilling to keep logging | The core data flywheel cannot form | POC measures input time and willingness to continue |
| AI extraction errors | Data pollution and damaged trust | Source-text evidence, confidence, user confirmation, regression set |
| A single Life Score causes stress or misleads | Product harm and churn | No total score in the POC; separate status/progress/deviation |
| AI states correlation as causation | Wrong recommendations | AI behavior specification, wording classification, human evaluation |
| Review recommendations are generic | No product differentiation | Mandate citing personal facts; give only ONE BIG CHANGE |
| Sensitive life data leaks | High-severity security/trust risk | Data minimization, isolation, encryption, deletion, redacted logs |
| RAG scope creep | Delays the core loop | Keep RAG in POC-02 and Phase 6 |
| E-book copyright issues | Legal and business risk | Only handle licensed, private material; never distribute full texts externally |
| Model upgrades cause behavior drift | Uncontrollable quality | Version models/Prompts/Schema and use a fixed evaluation set |
| Users treat the AI as the judge of major decisions | Potential harm | Show evidence and options; never give definitive life verdicts |

---

## 13. Project Governance and Cadence

### 13.1 Recommended Meeting/Review Cadence

- Weekly Product Review: scope, user feedback, priorities
- Weekly Delivery Review: progress, dependencies, risks, defects
- Gate Review at the end of every phase
- Every model or Prompt change triggers an AI Evaluation Review
- Every new capability involving sensitive data triggers a Privacy/Security Review

### 13.2 Decision Records

Important design decisions are recorded with an ADR/Decision Log:

- Problem
- Options
- Choice
- Rationale
- Trade-offs
- Follow-up review date

The first decisions to record include:

1. The POC uses Web rather than a WeChat Mini Program.
2. The POC does not establish a permanent total Life Score.
3. POC-01 does not bring in external book RAG.
4. Personal raw records can never be overwritten by AI output.
5. AI conclusions must be traceable to evidence.

---

## 14. Key Decisions Requiring the User's Review

Before entering Phase 0/1, please confirm or amend the following:

1. **First target users**: build for yourself first, or target a clearly defined user group from the start?
2. **POC client**: acceptable to do responsive Web first, rather than a WeChat Mini Program directly?
3. **POC duration**: acceptable to require at least 7 days of real usage validation?
4. **Number of goals**: agree that the POC works on at most 3 core goals simultaneously?
5. **Life total score**: agree that the POC does not offer a permanent 0–100 total Life Score for now?
6. **First POC scope**: agree to validate Capture-to-Review first, with RAG deferred to the second POC?
7. **Data handling**: accept that the POC may call cloud LLM APIs, or require personal data to be fully local?
8. **Focus dimensions**: all Five Life Dimensions are open for capture, but should 2–3 dimensions be chosen first for quantifiable validation?
9. **Success criteria**: are the thresholds for accuracy, helpfulness, and capture burden reasonable?
10. **Project roles**: who is responsible for product decisions, requirements approval, privacy risk acceptance, and final acceptance, respectively?

---

## 15. Next Steps After Review (Still No Coding)

Once the Roadmap review passes, the next round produces only the following design documents:

1. Product Vision v1
2. Target Users and JTBD v1
3. POC-01 Scope Statement
4. POC-01 PRD
5. Glossary
6. Conceptual Data Model
7. Capture Structured Output Schema v0.1
8. AI Behavior Specification v0.1
9. POC Test Plan and annotation guidelines
10. Requirements Traceability Matrix

Only after the above documents pass the G1/G2 Review will development tasks be broken down, a code repository be created, the tech stack be decided, and implementation begin.

---

## 16. Roadmap Review Checklist

- [ ] Product mission and target users are clear
- [ ] The Roadmap is driven by the core problem, not feature count
- [ ] The POC validates the highest-risk hypothesis
- [ ] Life Score, Progress, and Deviation are separated
- [ ] RAG has not crowded out the first POC
- [ ] AI conclusions are traceable and correctable
- [ ] Privacy and security start at the design phase
- [ ] Every phase has explicit deliverables and exit criteria
- [ ] MVP and Won't Do List boundaries are clear
- [ ] No coding started before the review
