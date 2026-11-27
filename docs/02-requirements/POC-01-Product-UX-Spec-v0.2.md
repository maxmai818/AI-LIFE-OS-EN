# POC-01 Product & UX Spec v0.2

- **Project**: AI Life OS
- **Document Status**: Draft — Awaiting Max Review
- **SDLC Stage**: G1 Requirements Baseline
- **Product Owner / Approver**: Max
- **Author**: Hermes
- **Date**: 2026-09-01
- **Related Decisions**: `Roadmap-Review-Decisions-v0.1.md`, `G0-Amendment-001-User-Scope-v0.1.md`, `G0-G1-Amendment-002-Life-Dimensions-v0.1.md`
- **Implementation Status**: Not started; this document does not authorize coding

---

## 1. Document Purpose

This document defines the product scope, user experience, functional requirements, and acceptance boundaries of POC-01. Once approved through review, it becomes the product requirements baseline for POC-01; data fields, AI outputs, and test details are defined separately by the accompanying Contract and Test Spec.

## 2. Product Definition

AI Life OS is a mobile-first responsive web life management system. Users record their lives in natural language, and the system turns those records into personal facts that can be confirmed, corrected, and computed — and generates periodic reviews that can trace back to the original evidence.

### 2.1 First Closed Loop

```text
Set focus areas and goals
→ Enter a Capture
→ AI extracts structured content
→ User confirms/corrects
→ Save trusted facts
→ Produce a periodic Review
→ Deliver ONE BIG CHANGE
```

### 2.2 Questions POC-01 Must Validate

> Can natural-language life records be converted into trusted data at an acceptable cost, and produce reviews that are more traceable and more helpful than simply sending the records to a general-purpose chat model?

### 2.3 Target Users

- POC-01's primary validation user: Max.
- The system experience is single-user and private, but the data model must not be hard-coded to a single user.
- After the core loop passes and account isolation is validated, a small number of friends may be invited to use their own separate accounts.
- No social, sharing, or collaboration features are designed at this stage.

## 3. Jobs-to-be-Done

### JTBD-01: Low-friction capture

When something happens during the day related to my current focus or the Five Life Dimensions, I want to record it quickly in a paragraph of natural language instead of filling out complex forms, so that the system retains reviewable facts — and understands that the same event may affect multiple dimensions of life.

### JTBD-02: Correct AI understanding

When AI classifies and extracts from my records, I want to see where it drew its conclusions from and be able to correct them quickly, so that bad data does not enter long-term analysis.

### JTBD-03: Understand changes over a period

When I look back over a stretch of time, I want to see what happened, which goals progressed or deviated, what the evidence is, and what is most worth changing next.

### JTBD-04: Gain theoretical perspectives

When the system explains my situation with theory, I want to see the author, the theory, the material, and verifiable sources — with clear separation between personal facts, AI speculation, theoretical viewpoints, and recommendations.

## 4. POC Scope

### 4.1 Must Have

1. Mobile-first responsive web experience.
2. A simplified Life Blueprint that always includes the Five Life Dimensions: Time / Health / Wealth / Relationship / Purpose.
3. At most three concurrent core goals.
4. Text Capture.
5. The raw Capture is stored permanently and independently, never overwritten by AI output.
6. AI extracts structured content and displays evidence snippets from the original text.
7. The user can confirm, edit, or delete extraction results item by item.
8. Both the AI's original extracted values and the user's revisions are saved.
9. Reviews are generated per period.
10. Reviews clearly distinguish facts, speculation, theoretical citations, and recommendations.
11. Every Review fact can trace back to a Capture or structured record.
12. Only one ONE BIG CHANGE is given.
13. When data is insufficient, the system explicitly states that it cannot conclude.
14. Users can export and delete all of their own data.

### 4.2 Should Have

1. Capture history list.
2. Review history list.
3. Simple progress and trends linked to goals.
4. User feedback on Review accuracy, helpfulness, and actionability.
5. A small set of manually curated, verifiable theoretical citation samples.
6. Re-processing is allowed after an AI failure, but the raw Capture is not saved twice.

### 4.3 Could Have

1. Capture tag filtering.
2. Simple trend charts.
3. Goal pause and resume.
4. Collapsing/expanding evidence within Reviews.
5. Quickly generating period samples from simulated historical data.

### 4.4 Won't Have (POC-01)

- A single 0–100 Life Score
- Voice, images, bills, OCR, or document uploads
- Bulk e-book import
- Complex vector retrieval pipelines
- Apple Health, bank, or calendar sync
- Communities, friends, leaderboards, shared goals, or shared records
- Multi-agent
- Automatic execution of external tasks
- Payments and subscriptions
- Official public registration and scaled operations

## 5. Life Dimensions, Current Focus, and Goal Model

POC-01 uses the fixed Five Life Dimensions, while treating stage-specific concerns as a separate layer:

```text
Life Dimension (the fixed Five Dimensions)
        ↕ many-to-many
Current Focus / Concern / Project (stage-specific focus)
        ↓
Goal
        ↓
Metric / Action / Capture
```

### 5.1 The Fixed Five Life Dimensions

1. **Time**: control over time, free time, Deep Work, screen time, and low-value time.
2. **Health**: sleep, exercise, diet, weight, energy, and physical condition.
3. **Wealth**: income, assets, liabilities, spending, and long-term financial goals.
4. **Relationship**: partner, family, friends, colleagues, and relationship quality.
5. **Purpose**: life direction, identity, growth, creation, and long-term vision.

The Five Dimensions are used for the Life Blueprint, long-term state observation, goal impact analysis, and Reviews. The POC does not generate a five-dimension aggregate score or a single Life Score.

### 5.2 First-round Current Focuses

1. **Health**: health matters that currently need focused improvement or maintenance.
2. **Primary Job**: current professional responsibilities, outcomes, capability growth, workload, and satisfaction.
3. **Side Project**: current side-project investment, milestones, revenue validation, and opportunity cost.

Current Focuses can change from stage to stage and do not replace the fixed Five Dimensions.

### 5.3 Many-to-many Associations

- A health focus is usually associated primarily with Health, but may also affect Time, Purpose, Relationship, and Wealth.
- The primary job may simultaneously affect Time, Wealth, Purpose, Relationship, and Health.
- A side project may simultaneously affect Wealth, Purpose, Time, Health, and Relationship.
- These are only candidate associations; the system must not preset them as fixed conclusions. Specific mappings must combine Goals, Captures, and user confirmation.
- The POC does not mandate permanent weights or percentage allocations. Primary/secondary, impact direction, rationale, evidence, and confirmation status may be recorded first.

### 5.4 Rules

- One Current Focus can link to multiple Life Dimensions; one Life Dimension can be affected by multiple Current Focuses.
- One Capture can link to multiple Life Dimensions, multiple Current Focuses, and multiple Goals.
- One Goal can belong to one Current Focus and link to one or more Life Dimensions.
- AI may propose association candidates, but the user can confirm, modify, or reject them.
- No more than three core goals in Active status at the same time.
- The POC does not force all goals to be quantified; non-quantifiable goals must not generate pseudo-precise progress.

## 6. Information Architecture

POC-01 recommends five main pages:

1. **Setup**: the five-dimension Life Blueprint, Current Focuses, goals, and basic preferences.
2. **Capture**: enter records, view AI processing status.
3. **Confirm**: confirm or correct extraction results item by item.
4. **Review**: view periodic facts, deviations, theory, and recommendations.
5. **History & Settings**: history, export, deletion, and privacy settings.

The POC may design Capture and Confirm as consecutive states of the same page; five separate routes are not required.

## 7. Core User Flows

### 7.1 First-time Setup

```text
Enter the system
→ Read the privacy and AI boundary explanations
→ View the Five Life Dimensions and fill in the simplified Blueprint
→ Set Current Focuses (first round: Health, Primary Job, Side Project)
→ Create 0–3 core goals
→ Confirm setup
→ Enter Capture
```

#### Acceptance Requirements

- The user can skip goal fields they cannot answer yet.
- The system must not require creating a Life Score.
- The system must warn that a cloud LLM may process Capture content.
- Capture can begin even if goal setup is incomplete.

### 7.2 Create a Capture

```text
Open Capture
→ Enter natural language
→ Click save and analyze
→ Raw text is saved immediately
→ AI processes asynchronously
→ Enter Confirm
```

#### Acceptance Requirements

- Empty input cannot be submitted.
- An AI service failure does not affect raw Capture storage.
- A single submission must not create duplicate raw records due to retries.
- The user can see that save success and AI processing status are two distinct states.

### 7.3 Confirm and Correct

```text
Show the raw text
→ Show structured extraction items
→ Each item shows an evidence snippet and a confidence/pending-confirmation status
→ The user confirms, edits, or deletes
→ Save as the user-confirmed version
```

#### Acceptance Requirements

- The user can act item by item; they need not accept all results at once.
- After editing, viewing again must show the same value the user saved.
- Deleted AI extraction items do not participate in Reviews as facts.
- Uncertain content may remain "unconfirmed" and must not default to fact.

### 7.4 Generate a Review

```text
Select or reach a period
→ The system reads that user's confirmed facts for that period
→ Computes determinable progress/trends/deviations
→ Builds the evidence set
→ Optionally retrieves a small amount of theoretical material
→ AI generates the Review
→ The user views and gives feedback
```

A Review always contains:

1. **What happened**: confirmed facts.
2. **Progress and deviations**: only content that is computable or well supported by records.
3. **Possible patterns**: explicitly marked as speculation.
4. **Theoretical perspectives**: author, theory, material, and sources; applicability boundaries stated.
5. **ONE BIG CHANGE**: one recommendation.
6. **Insufficient data**: what information is missing and which conclusions cannot be drawn.
7. **Evidence**: Capture/record references supporting the facts and analysis.

A Review also provides two complementary perspectives:

- **By the Five Dimensions**: what evidence and changes currently exist for Time, Health, Wealth, Relationship, and Purpose.
- **By Current Focus**: what progress exists for Health, Primary Job, and Side Project respectively, and how it may affect the Five Dimensions.

Associations without evidence must be marked as unknown; no guessing to fill out the matrix.

### 7.5 Review Feedback

The user can:

- Mark "Accurate / Inaccurate";
- Mark "Helpful / Not helpful";
- Mark "Grounded / Ungrounded";
- Accept, modify, or reject the ONE BIG CHANGE;
- Fill in free-text feedback.

## 8. Functional Requirements

### 8.1 Users and Data Ownership

- **FR-USR-001**: All personal data must belong to a defined user.
- **FR-USR-002**: Users can only read, modify, export, or delete their own data.
- **FR-USR-003**: The POC may be limited to Max's use, but the implementation must not depend on a hard-coded single user.
- **FR-USR-004**: Account identity and data isolation acceptance must be completed before private testing with friends.

### 8.2 Life Dimensions, Current Focus, and Goals

- **FR-DIM-001**: The system always provides the Five Life Dimensions: Time, Health, Wealth, Relationship, Purpose.
- **FR-DIM-002**: Users can fill in a simplified Life Blueprint for the Five Dimensions, but may temporarily leave fields blank.
- **FR-FOC-001**: Users can create, edit, pause, and archive Current Focuses; the POC defaults to Health, Primary Job, Side Project.
- **FR-FOC-002**: A Current Focus can establish user-confirmable associations with multiple Life Dimensions.
- **FR-FOC-003**: The system may propose cross-dimension impact candidates, but must not auto-confirm them without evidence.
- **FR-GOL-001**: Users can create, edit, pause, and archive goals.
- **FR-GOL-002**: No more than three Active core goals.
- **FR-GOL-003**: A goal must at least contain a title; Why, metrics, current value, target value, and dates are optional.
- **FR-GOL-004**: No pseudo-precise Progress or Deviation is displayed when data is insufficient.

### 8.3 Capture

- **FR-CAP-001**: The user can save a non-empty text Capture.
- **FR-CAP-002**: The raw text, creation time, and owner must be saved.
- **FR-CAP-003**: The raw Capture is not lost when AI fails or times out.
- **FR-CAP-004**: The user can view the Capture's processing status.
- **FR-CAP-005**: The user can delete their own Captures; the impact of deletion must be clearly prompted.

### 8.4 AI Structuring and Correction

- **FR-AIX-001**: AI output must conform to the approved structured Contract.
- **FR-AIX-002**: Every extraction item must include original-text evidence or be explicitly marked "no direct evidence".
- **FR-AIX-003**: The system saves the model, prompt, and schema versions.
- **FR-AIX-004**: The user can confirm, edit, or delete extraction items.
- **FR-AIX-005**: User revisions must not overwrite the AI's original output.
- **FR-AIX-006**: Low-confidence or ambiguous information must be marked as pending confirmation.

### 8.5 Review

- **FR-REV-001**: The user can generate or view a Review for a period.
- **FR-REV-002**: Facts in a Review must cite personal records.
- **FR-REV-003**: Speculation must be visually and semantically distinguished from facts.
- **FR-REV-004**: Theoretical citations must include verifiable sources.
- **FR-REV-005**: Recommendations must not masquerade as facts or as the original words of a theory.
- **FR-REV-006**: Each Review has at most one primary recommendation, the ONE BIG CHANGE.
- **FR-REV-007**: Limitations are explicitly listed when data is insufficient.
- **FR-REV-008**: The user can submit Review feedback.

### 8.6 Data Control

- **FR-DAT-001**: The user can export all of their own data.
- **FR-DAT-002**: The user can delete all of their own data.
- **FR-DAT-003**: Export and deletion must not affect other users.
- **FR-DAT-004**: Before deletion, show the scope and an irreversibility warning.

## 9. Non-functional Requirements Summary

- **NFR-PRV-001**: Cloud LLM usage and data retention policies must be defined at G2.
- **NFR-SEC-001**: All server-side data queries must be constrained by user ownership.
- **NFR-SEC-002**: Logs must not record full sensitive Captures by default.
- **NFR-REL-001**: Raw data writes must still succeed when AI is unavailable.
- **NFR-TRC-001**: The full chain Capture → extraction → revision → Review → Evidence is traceable.
- **NFR-AI-001**: The same deterministic computation version and inputs must produce the same result.
- **NFR-AI-002**: AI must not fabricate user facts without a source.
- **NFR-UX-001**: Phone portrait orientation is the primary interaction environment.
- **NFR-UX-002**: Recording and confirmation actions should minimize form-filling; establish a baseline for time costs first instead of presetting arbitrary thresholds.

## 10. Key Empty and Exception States

Must be defined and demonstrated in the G2 prototype:

1. No goals yet.
2. No Captures yet.
3. Capture saved but AI still processing.
4. AI extraction failed.
5. AI found no extractable facts.
6. All extracted content is pending confirmation.
7. Review has insufficient data.
8. Theoretical material is unavailable or citations cannot be verified.
9. Export in progress or failed.
10. Delete confirmation and delete completion.

## 11. Success Criteria

### Must Be Satisfied

- Raw Captures are not overwritten.
- User revisions are saved and displayed consistently on re-view.
- Values, units, times, negations, and goal associations can be verified item by item.
- Review facts can trace back to evidence.
- Facts, speculation, theoretical citations, and recommendations are clearly separated.
- No pseudo-precise conclusions are generated when data is insufficient.
- Users can export and delete personal data.

### Final Judged by Max

1. Would you keep using it?
2. Is the Review more trustworthy and more helpful than a general-purpose chat model?
3. Does the system make your next step clearer, rather than creating burden or self-blame?
4. Are errors easy to spot and correct?
5. Do theoretical citations genuinely improve understanding and quality of action?

## 12. G1 Review Decision Items

Please mark each item below with `Approve / Revise / Reject`:

1. Are POC-01's first closed loop and goals accurate?
2. Are the Chinese and English names and definitions of the Five Dimensions accurate?
3. Are Health, Primary Job, and Side Project accurate as changeable Current Focuses?
4. Do you accept that Focuses and the Five Dimensions use many-to-many associations, without fixed percentage weights for now?
5. Are five pages enough, and are there any entry points that must be added?
6. Is the Must/Should/Could/Won't split reasonable?
7. Do you accept the rule that goals may lack quantification fields?
8. Does the Review "dual-perspective" structure match your expectations?
9. Should ONE BIG CHANGE always be limited to exactly one?
10. Does the POC stage need real sign-up/login, or should it first use a restricted Max account?
11. What format is needed for data export: JSON, CSV, Markdown, or all of them?
12. Is deletion immediate and permanent, or should a short recovery window be provided?
13. Should private testing with friends begin after the POC passes, or in the mid-to-late POC phase?
14. What other Must Have items are not covered by this document?

## 13. Gate Conditions

This document must pass Max Review, and all blocking comments must be closed before it can be marked `Approved` or `Approved with Conditions`. Approval of this document does not authorize coding; the Data + AI Contract and the Test + Acceptance Spec must also be approved in parallel.
