# G1 Decision 004: Five-Dimension Behavior Impact Rules

- **Status**: Approved
- **Decision maker**: Max
- **Approval date**: 2026-09-12
- **Record date**: 2026-09-12
- **Scope**: POC-01 G1 product requirements, data/AI contracts, and test acceptance
- **Source**: Max's explicit reply in a project session: "All five items agreed; proceed with the recommended plan."
- **Related documents**: `G0-G1-Amendment-003-Behavior-Dimension-Impact-v0.1.md`, G1 Review Pack v0.3
- **Approval boundary**: this record approves the five model rules below; it is not equivalent to overall approval of the three G1 documents, does not pass the G1 Gate, and does not authorize coding.

## 1. Approved decisions

### DEC-G1-004-01: All five dimensions enter logical assessment

Every valid behavior or event is logically assessed for its impact on the following five fixed dimensions:

1. Time
2. Health
3. Wealth
4. Relationship
5. Purpose

"Logically assessed" does not mean a non-zero impact must be generated. A dimension without sufficient evidence must be saved or displayed as `unknown` — it must not be guessed, filled in, or omitted as if it were a known fact.

### DEC-G1-004-02: POC uses 1–5 discrete impact degrees

When the direction is `positive` or `negative` and sufficient evidence exists, the POC uses integers `1–5` to represent impact degree; the degree structure for `mixed` remains pending G1 Review:

- `1`: very weak
- `2`: relatively weak
- `3`: moderate
- `4`: relatively strong
- `5`: very strong

The degree represents an ordered subjective impact estimate of the behavior on a single dimension; it does not represent objective measurement, life-dimension state, goal progress, or a value judgment. Degree is empty for `unknown` and `neutral`; it may also be empty when the direction is determinable but evidence for the degree is insufficient — numbers must not be generated just to fill the scale.

### DEC-G1-004-03: Five-dimension impacts are not a zero-sum allocation

Degrees for the five dimensions are judged separately and are not required to sum to 100% or any fixed total. The same behavior can strongly impact multiple dimensions at once.

The POC does not use `proportion` as a formal impact value. If a proportional model is introduced in the future, it must be separately reviewed and the contract version upgraded.

### DEC-G1-004-04: Distinguish unknown from neutral

- `unknown`: insufficient evidence to reliably judge direction or degree; `degree = null`.
- `neutral`: sufficient evidence supports "no significant impact"; `degree = null`. It is distinguished from `unknown` via the direction field.

`neutral` is not a default value. `unknown` must be used when evidence is lacking.

### DEC-G1-004-05: Entry into long-term analysis only after user confirmation

All AI-generated non-`unknown` five-dimension impacts are candidates. Only after the user confirms or modifies them may the impacts enter:

- Long-term analysis sourced from "user-confirmed impact judgments"
- The user-judgment layer of dimension state
- Explanatory context for Goal Progress / Deviation; unless separate deterministic rules say otherwise, they are not inputs to numeric calculations
- Review content explicitly labeled as "user-endorsed judgment" or speculation

Unconfirmed candidates may be shown in the Confirm interface, but must not be described as user facts. User confirmation only changes the confirmation status; it does not change the epistemic type of the fact, inference, or calculation. Rejected candidates must not participate in subsequent analysis. `unknown` may be retained as a data limitation; users are not required to force a value.

## 2. Data semantics summary

```yaml
dimension: time | health | wealth | relationship | purpose
direction: positive | negative | mixed | neutral | unknown
degree:
  type: integer | null
  allowed: [1, 2, 3, 4, 5]
  rules:
    unknown: null
    neutral: null
    positive_or_negative: 1..5
    mixed: TBD (must not net out positive and negative impacts with a single number)
confidence: low | medium | high
status: proposed | confirmed | modified | rejected | unknown
```

Constraints:

- When `direction = unknown`, `degree = null`.
- When `direction = neutral`, `degree = null`; the distinction from `unknown` is preserved in `direction` and the evidence.
- When `direction ∈ {positive, negative}`, `degree ∈ {1,2,3,4,5}`.
- The degree structure for `mixed` is not included in this five-item approval and remains an open G1 decision; until decided, positive and negative impacts must not be netted out with a single number.
- The five `degree` values are not summed, nor converted into a single Life Score.
- `confidence` expresses how certain a candidate judgment is; it does not equal impact degree.

## 3. UX and copy constraints

- The Confirm interface shows five-dimension candidates per behavior, allowing per-dimension confirm, modify, reject, or keep-as-unknown.
- Direction and degree must be separately visible; a single opaque score must not be shown alone.
- The system must not imply that `5` is "good" and `1` is "bad"; good/bad is expressed by direction, and degree only expresses strength.
- Review must distinguish facts, AI speculation, theoretical perspectives, and suggestions.
- Deviation/Gap is a diagnostic signal, not a failure or moral judgment.
- ONE BIG CHANGE is a suggestion that can be rejected or modified — not a command.

## 4. Acceptance requirements

Verify at minimum:

1. Every valid behavior has assessment results for all five dimensions.
2. Dimensions without evidence output `unknown + null`, not a neutral or speculative value.
3. Where evidence shows no significant impact, `neutral + null` may be output, retaining the evidence supporting that judgment.
4. Well-evidenced positive or negative impacts use only integer degrees 1–5; the degree structure for `mixed` stays pending.
5. The five dimension degrees are not summed or normalized.
6. Unconfirmed candidates do not enter long-term analysis or Review facts.
7. User-modified values take precedence over the original AI candidates, while the full traceability record is retained.

## 5. Items still not approved

This decision does not address the following G1/G2 open questions:

- Final page and navigation structure
- POC login and registration scope
- Export format
- Deletion and recovery policy
- Whether full raw responses from cloud models are stored
- AI-skip option for sensitive Captures
- Timing of the friends' private beta
- Cloud LLM vendor, region, and retention policy
- Overall baseline status of the three G1 documents

These items remain `In Review` and should be decided individually in subsequent Reviews.
