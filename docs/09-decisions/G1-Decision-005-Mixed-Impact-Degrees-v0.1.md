# G1 Decision 005: Mixed Impacts Record Positive and Negative Degrees Separately

- **Status**: Approved
- **Decision maker**: Max
- **Approval date**: 2026-09-13
- **Record date**: 2026-09-13
- **Scope**: POC-01 G1 product requirements, data/AI contracts, and test acceptance
- **Source**: Max chose Option A, explaining that recording separately allows a more granular review of positive and negative impacts on the same dimension; even when the direction is `mixed`, evidence such as behavior duration may make the two degrees differ.
- **Related decision**: `G1-Decision-004-Five-Dimension-Impact-Rules-v0.1.md`
- **Priority and partial supersession**: this decision supersedes the "`mixed` degree structure pending/TBD" clause expressed on lines 28, 74, 84, and 104 of Decision 004; all other approved rules of Decision 004 remain in force. Where the two Approved records conflict, this decision prevails solely on the `mixed` degree structure.
- **Approval boundary**: this record approves only the `mixed` degree structure; it does not approve G1 as a whole and does not authorize coding.

## 1. Approved decisions

### DEC-G1-005-01: Mixed uses two independent 1–5 degrees

When the same behavior or event has both positive and negative impacts on the same Life Dimension:

- `direction = mixed`
- Record `positive_degree` and `negative_degree` separately
- Each degree uses integers `1–5`: `1` very weak, `2` relatively weak, `3` moderate, `4` relatively strong, `5` very strong
- Each side must have its own supporting evidence and rationale
- When a side's direction is grounded but evidence for its degree is insufficient, that side's degree may be `null` and remain pending confirmation

Behavior duration, frequency, context, and the user's Blueprint/goals may serve as degree evidence. For example, for the same "working late at night", differing durations may produce different combinations of positive and negative degrees on the same dimension.

## 2. Interpretive boundary of "relative proportion"

This decision implements what Max called "the proportion of positive and negative" as: **the relative strength relation expressed by two 1–5 degrees within the same behavior and the same dimension**.

It introduces no percentage or `proportion` field, nor does it require the two values to sum to a fixed total. The system must not automatically subtract, divide, net out, or compress the two values into a single score. If a formal proportion or net-impact algorithm is needed in the future, it must be separately reviewed and the contract upgraded.

## 3. Data semantics summary

```yaml
direction: mixed
degree: null
positive_degree:
  type: integer | null
  allowed: [1, 2, 3, 4, 5]
negative_degree:
  type: integer | null
  allowed: [1, 2, 3, 4, 5]
positive_evidence: required whenever direction is mixed
negative_evidence: required whenever direction is mixed
positive_status: proposed | confirmed | modified | rejected
negative_status: proposed | confirmed | modified | rejected
```

Constraints:

- `positive | negative` continue to use the existing single `degree`; the two mixed-specific fields are empty.
- For `mixed`, the single `degree` must be empty; use `positive_degree` and `negative_degree`. Evidence for both positive and negative directions is always required, even when one side's degree is `null` due to insufficient evidence.
- Rationale, confidence, and confirmation status are saved separately for each side, to distinguish insufficient evidence from the user clearing a degree and the user rejecting that side.
- When the user rejects only one side's direction, the effective direction becomes the single direction of the other side; when both sides are rejected, the whole item must not enter long-term analysis. Clearing one side's degree alone does not negate that side's direction, and `mixed` may be retained. Every transition keeps a revision history.
- For `neutral | unknown`, all three degree fields are empty.
- Positive and negative degrees may only be displayed as relative-strength information within the same behavior, same dimension, and same assessment time window.
- They must not be used to derive net impact, cross-dimension rankings, Life Score, or causal conclusions.
- The two AI-proposed degrees are still candidates and can only enter long-term analysis after the user confirms or modifies them.

## 4. UX and acceptance requirements

- When `mixed`, the Confirm interface shows both the positive and negative degrees along with their respective grounds.
- Users can separately modify, clear, or reject either side's degree; users must not be forced to pick a number for a side with insufficient evidence.
- Review may describe relative relations such as "positive effect is stronger, negative drain is weaker", but must retain context and epistemic labels.
- Review must not use unapproved derived expressions such as "net +2" or "60% positive".
- Tests must cover: differing degrees on the two sides, insufficient degree evidence on one side, the user separately modifying/clearing/rejecting/re-confirming each side, direction transitions, history replay, refusing cross-time-window comparisons, and the prohibition on netting out.

## 5. Items still not approved

This decision does not address whether ONE BIG CHANGE may be zero, nor does it close other G1 product, data, privacy, security, or trial-scope questions. G1 remains `In Review`, and coding remains unauthorized.
