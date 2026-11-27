# G0/G1 Amendment 003: Remove Temporary Focus Areas and Adopt the Five-Dimension Behavior Impact Model

- **Status**: Approved as Product Direction
- **Decision maker**: Max
- **Date**: 2026-09-01
- **Supplementary approval date**: 2026-09-05
- **Supplementary approval scope**: full five-dimension assessment, separation of `unknown`/`neutral`, non-zero-sum, 1–5 impact degree scale, entry into long-term analysis only after user confirmation
- **Change type**: project background and domain model correction
- **Affected documents**: project README, Amendment 002, G1 Review Pack v0.2

## 1. Background

"Health, primary job, side project" were temporary answers given during project initiation to understand Max's current situation; they are not the product's fixed scope, default focus areas, or project background. Previously writing these three into the README, POC default configuration, and the Current Focus model was over-fixation.

## 2. Formal decision

1. The project's fixed top-level model consists only of the Five Life Dimensions:
   - Time
   - Health
   - Wealth
   - Relationship
   - Purpose
2. Health, primary job, and side project are not hard-coded in the project background, README, or POC default configuration.
3. The user's work, projects, health matters, family activities, learning, spending, rest, etc. all belong to behaviors, events, goals, or context — they are not new top-level dimensions.
4. All valid behaviors/events should have their impact on the Five Dimensions assessed, expressed as a discrete degree of 1–5.
5. Impact must include direction, degree, evidence, confidence, and user confirmation status.
6. A dimension without supporting evidence should be `unknown` and must not be guessed; `neutral` is only used where evidence shows no significant impact.
7. A single behavior can simultaneously produce impacts of different directions and degrees across multiple dimensions.
8. The POC does not generate a single aggregate Life Score; five-dimension impacts are used only for per-dimension observation, trends, and Review.

## 3. Revised core model

```text
Life Blueprint (the Five Life Dimensions)
        ↓
Goal / Project / Context
        ↓
Behavior / Event / Capture
        ↓
BehaviorDimensionImpact × 5
        ↓
Per-dimension facts, trends, deviations, and Review
```

`CurrentFocus` may exist in the future as an optional user tag or view, but it is not a required POC entity and must not be pre-populated with health, primary job, or side project.

## 4. Five-dimension impact vector

Each valid behavior/event logically produces one five-dimension impact vector:

```text
Time          direction + degree(1–5) + confidence + evidence
Health        direction + degree(1–5) + confidence + evidence
Wealth        direction + degree(1–5) + confidence + evidence
Relationship  direction + degree(1–5) + confidence + evidence
Purpose       direction + degree(1–5) + confidence + evidence
```

Direction can be: `positive | negative | mixed | neutral | unknown`.

POC-01 uses a 1–5 discrete degree scale: `1` means very weak, `2` relatively weak, `3` moderate, `4` relatively strong, `5` very strong. Direction and degree are stored separately; degree is empty for `unknown` or `neutral`. The five degrees are not required to sum to a fixed total, because one behavior can strongly impact multiple dimensions at once. Proportion fields are not used in POC-01.

## 5. Example (illustrates the model only; not a fixed business background)

Behavior: "Stayed up late three consecutive nights to finish a project, and received a payment."

Possible candidate impacts:

- Time: negative or mixed — consumes rest and free time.
- Health: negative — consecutive late nights.
- Wealth: positive — received income.
- Relationship: unknown — no relationship-related evidence.
- Purpose: positive or unknown — can only be judged if the project relates to the user's goals/meaning.

All of the above are candidates and must be determined through raw evidence, user goals, and user confirmation.

## 6. Revision to Amendment 002

The following content in Amendment 002 is superseded by this Amendment:

- "Health, primary job, and side project are the POC's default Current Focus areas."
- The wording "the POC sets no proportions or degrees for now".

Retained: the Five Dimensions are fixed, behaviors can span dimensions, and no guessing without evidence.

## 7. Requirements for G1 documents

- The Product & UX Spec removes the three default focus areas.
- The Data Contract uses `BehaviorDimensionImpact` as the core many-to-many relationship from behavior to the Five Dimensions.
- Capture AI output provides five-dimension impact candidates for each behavior.
- The Confirm UX lets users adjust direction and degree.
- Review is organized primarily by the Five Life Dimensions and no longer requires organization by health/primary job/side project.
- The Test Spec separately verifies five-dimension impact direction, degree, evidence, confidence, and unknown handling.
- All documents are upgraded to new versions with the old versions kept in history.

## 8. Supplementary approval record (2026-09-05)

Max approved the following five items:

1. All valid behaviors are logically assessed against all five dimensions; dimensions without evidence are `unknown`.
2. `unknown` and `neutral` are stored and displayed separately.
3. Five-dimension impacts are not a zero-sum allocation; degrees are not required to sum to a fixed total.
4. POC-01 impact degrees use 1–5 discrete levels; user-defined scales are not allowed.
5. AI only produces candidate impacts; they enter long-term analysis only after the user confirms or modifies them.

Ordinary natural-language sample phrases in test statements such as "primary job" and "side project" may be retained; they do not constitute product dimensions, default focus areas, or a fixed business background.
