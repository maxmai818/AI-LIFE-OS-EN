# G0/G1 Amendment 002: The Five Life Dimensions and Layering of Current Focus Areas

- **Status**: Approved as Product Direction; pending merge into G1 drafts
- **Decision maker**: Max
- **Date**: 2026-09-01
- **Change type**: domain model correction
- **Affected documents**: Roadmap Review decision record, G1 Review Pack v0.1

## 1. Background

The G1 v0.1 draft treated "health, primary job, side project" as three Focus Areas, which risks mistaking the topics Max currently cares about for fixed life dimensions of the system. Max now clarifies: the system should still be designed around the Five Life Dimensions; health, primary job, and side project are current focus areas, and we need to analyze how they relate to and impact the Five Dimensions.

## 2. Formal decision

### 2.1 Fixed top-level life dimensions

The top-level Life Dimensions of AI Life OS are:

1. **Time**
2. **Health**
3. **Wealth**
4. **Relationship**
5. **Purpose**

The Five Life Dimensions are used for the Life Blueprint, long-term state observation, goal impact analysis, and periodic Review.

### 2.2 Current focus areas

Health, primary job, and side project belong to `Current Focus / Concern / Project`; they are not fixed dimensions. The first POC round focuses on:

- Health
- Primary job
- Side project

Current focus areas may change from phase to phase and should not modify the Five Life Dimensions themselves.

### 2.3 Many-to-many mapping

One Current Focus can relate to multiple Life Dimensions; one Life Dimension can also be impacted by multiple Current Focus areas. The mapping must allow:

- Primary impact dimension
- Secondary impact dimension
- Impact direction: positive, negative, mixed, or unknown
- Rationale for the association
- Data evidence
- User confirmation status

The POC initially does not enforce permanent weights or percentage allocations, to avoid manufacturing false precision.

## 3. Example mappings

### Health focus area

- Primary: Health
- Common associations: Time (sleep/exercise time), Purpose (identity and long-term life vision), Relationship (the impact of health on companionship and interaction), Wealth (medical care and work capacity)

### Primary job focus area

- Time: working hours, discretionary time, overtime
- Wealth: income and job security
- Purpose: growth, achievement, and meaning
- Relationship: colleagues, managers, family time
- Health: stress, sleep, and energy

### Side project focus area

- Wealth: revenue validation and asset building
- Purpose: creation, independence, and career transition
- Time: invested time and opportunity cost
- Health: fatigue and recovery
- Relationship: companionship time and support/conflict

These are candidate relationships, not fixed conclusions the system makes on the user's behalf. Actual mappings must be grounded in specific Goals, Captures, and user confirmation.

## 4. Revised domain model

```text
Life Dimension (the fixed Five Life Dimensions)
        ↕ many-to-many
Current Focus / Concern / Project (phase-level focus areas)
        ↓
Goal
        ↓
Metric / Action / Capture
```

A Capture can be associated with any of the following simultaneously:

- One or more Life Dimensions
- Zero or more Current Focus areas
- Zero or more Goals

## 5. Review view requirements

Review should support at least two complementary perspectives:

1. **By the Five Life Dimensions**: what evidence and changes currently exist for Time, Health, Wealth, Relationship, and Purpose.
2. **By current focus areas**: what progress health, primary job, and side project have each made, and how they impact the Five Life Dimensions.

The system may display a "focus area × life dimension" impact matrix, but where there is no evidence it must be marked unknown and must not be auto-filled.

## 6. Revision to previous decisions

This Amendment revises DEC-008 and the "domain model clarification" section in `Roadmap-Review-Decisions-v0.1.md`:

- Health, primary job, and side project are retained as the first-round current focus areas.
- The interpretation of them as top-level Focus Areas/Life Areas is revoked.
- The Five Life Dimensions are restored as the fixed top-level model.
- The current focus areas are associated with the Five Dimensions via many-to-many mapping.

## 7. Impact on G1/G2

- The Product & UX Spec gains a Five-Dimension Blueprint and a focus-area mapping flow.
- The Data Contract separates `LifeDimension` from `CurrentFocus` and adds a mapping entity.
- Capture AI output simultaneously proposes dimension candidates, focus-area candidates, and Goal candidates.
- Users can confirm or correct dimension associations.
- The Test Spec adds tests for multi-label mapping, cross-dimension impacts, and unknown relationships.
- No single Life Score is generated at this time.
- Coding still does not begin at this time.
