# Product Core v0.1

- **Project**: AI Life OS
- **Document status**: Approved — G2 kernel baseline (Max, 2026-10-17)
- **SDLC phase**: G2 Design / Architecture
- **Product approver**: Max
- **Author**: Hermes (lifeospm organization, lifeosdesign session collaboration)
- **Date**: 2026-10-17
- **Upstream baselines**: `docs/02-requirements/POC-01-Product-UX-Spec-v0.6.md`, `docs/04-data-ai/Capture-Data-AI-Output-Contract-v0.6.md` (both Approved G1 baselines)
- **This change**: Max selected the "kernel/skin layering + self-use feedback feeds the kernel" route (2026-10-17); this file is that route's execution landing

---

## 1. What this document is

**The product kernel = the visual-style-independent core: data structures + business rules + the logic mainline.** Any style of interface must implement this kernel; changing style only swaps the skin and never alters the kernel. The "product core logic and value" that Max continuously distills is codified here — versioned and traceable.

Layering model:

```text
┌───────────────────────────────────────┐
│ Skin layer (Skin / style)             │  Visuals, layout, interaction style. Replaceable as a whole at any time
│   Three G2 prototypes = three candidate skins
├───────────────────────────────────────┤
│ Application layer (Flow / orchestration) │  State transitions and use-case orchestration of the four-step loop
├───────────────────────────────────────┤
│ Core layer (Core / this file)         │  Data structures + business invariants + the logic mainline
│   Never changes with style            │
└───────────────────────────────────────┘
```

## 2. Value mainline (one sentence)

**Capture real life behaviors with the lowest friction; AI helps you structure them and honestly labels uncertainty; Review gives only evidence-backed, zero-or-one actionable change — you run your own life with 5 minutes a day.**

Value pillars (distilled from the Vision and the v0.6 Spec):

1. **Verifiable**: every conclusion traces back to source-text evidence; with no evidence, say "I don't know".
2. **Correctable**: AI is a candidate, not an authority; user revisions are first-class citizens and the original AI value is retained.
3. **Non-intrusive**: no manufacturing of usage time, no forced suggestions, no total scores, no judgment.

## 3. Logic mainline (style-agnostic four-step loop)

```text
Capture ──▶ AI structuring ──▶ user confirmation/correction ──▶ Five-Dimension view / goals ──▶ Review ──┐
   ▲                                                                   │
   └───────────── ONE BIG CHANGE (zero or one) · feedback flow-back ◀──┘
```

Flow state machine (all skin implementations must be equivalent):

1. **Capture**: save the raw text → `saved`; AI processing `processing`; failure `failed` (raw text still intact).
2. **AI structuring**: produce candidate ExtractedItems + five-dimension impact candidates, all `proposed`, flagged `needs_confirmation`.
3. **User confirmation/correction**: item by item `confirmed | modified | rejected | later (unresolved)`; revisions go into UserRevision, with both values coexisting.
4. **Aggregation and Review**: only non-`unknown` impacts with `confirmed | modified` enter long-term analysis; Review is generated with per-statement_type labels; zero or one suggestion.

## 4. Core data structures (style-agnostic)

The full field contract is in `Capture-Data-AI-Output-Contract-v0.6.md` (Approved); only the kernel skeleton and semantics are codified here:

```text
User ── Profile ── LifeDimension (the fixed Five Life Dimensions)
  │                    time / health / wealth / relationship / purpose
  ├── Goal (max 3 Active; quantifiable or not)
  ├── Capture (raw_text never overwritten)
  │     └── ExtractionRun (model/prompt/Schema versions traceable)
  │           └── ExtractedItem (candidate facts, item_type 8-value enum)
  │                 ├── BehaviorDimensionImpact (five-dimension impact candidates)
  │                 └── UserRevision (confirm/modify/reject dual-value history)
  ├── Review ── ReviewStatement (6 types: fact / calculation / inference / theory / suggestion / limitation)
  │     ├── EvidenceReference (evidence chain, raw text replayable)
  │     ├── TheoryReference (verifiable scholar citations + applicability boundaries)
  │     └── Recommendation (zero or one)
  └── Feedback (Review feedback, including "no change needed this time")
```

Key semantics (kernel-level; no skin may distort them):

- Every valid behavior is logically assessed against **all five dimensions**; direction (positive/negative/mixed/neutral/unknown) and the 1–5 degree are **recorded independently**; the five dimensions are **non-zero-sum** (no summing, no ranking, no total score).
- For `mixed`, positive and negative degrees are stored in separate columns and may only express relative strength within the same behavior/dimension/time window/context version.
- `epistemic_type` distinguishes user fact / user impact / AI inference / deterministic calculation; confirmation only changes status, never `epistemic_type`.
- Theoretical citations never override personal facts.

## 5. Business invariants (INV, hard constraints for implementation acceptance)

| ID | Invariant | Source |
|---|---|---|
| INV-01 | Raw Capture text is never overwritten by AI or revisions; editing produces a new version | DP-002 |
| INV-02 | Calculations and Review prefer user-confirmed values over AI values; both values coexist and are traceable | DP-003 |
| INV-03 | No evidence = `unknown`; `neutral` comes only from explicit user statement or approved rules; "the source text didn't mention it" ≠ neutral | §3.8 constraint |
| INV-04 | Only non-unknown impacts with `confirmed | modified` enter long-term analysis | §3.8 constraint |
| INV-05 | Non-quantifiable goals output no pseudo-precise progress | §3.4 rule |
| INV-06 | Each Review's primary recommendation is zero or one; "no change needed" is a first-class option | 3.14 |
| INV-07 | Fact/calculation/inference/theory/suggestion/limitation must be presented with separate labels | DP-004 |
| INV-08 | AI processing is traceable: vendor, model, prompt version, Schema version | DP-005 |
| INV-09 | Data minimization: the user's full history is not sent by default | DP-006 |
| INV-10 | Data belongs to `user_id`; multi-account data is never mixed | DP-001 |
| INV-11 | Bulk acceptance is not the default path; item-by-item confirmation is the main path | UX red line |
| INV-12 | Deletion propagates: deleting a Capture/account has defined deletion/invalidation of derived data | DP-007 |

## 6. Kernel/skin change policy (how the core keeps being distilled)

| Change type | Classification | Process |
|---|---|---|
| Kernel change (data structures/invariants/mainline) | Direction-level decision | Decision packet → Max approval → this file's version is bumped |
| Skin change (visuals/layout/copy) | Execution detail | lifeosdesign changes it directly, logs a WORK-LOG entry, style decisions are written back to Design Language |
| Application-layer change (flow orchestration) | Depends on impact | Impacts invariants → decision packet; otherwise lifeosdev implements + lifeosqa accepts |

**Self-use feedback flow-back rules** ("no matter which style you try, you end up optimizing the same business logic"):

- Feedback = "the logic is wrong / a rule must change / the data structure is missing something" → **kernel change channel** — this is the main channel for Max to distill core value.
- Feedback = "looks bad / hard to use / can't find things" → **skin change channel**.
- If attribution can't be determined → lifeospm decides and records the rationale.

## 7. Relationship with skins (reskinning cost constraints)

- Skins may only fetch and write back data through the flow/data interfaces defined by the application layer, and must not set their own business rules (e.g., a skin must not invent a "total score", must not render unknown as 0).
- Reskinning = re-implement the skin layer + acceptance of INV-01–INV-12; the kernel and application layer are untouched.
- `docs/03-design/Design-Language-v1.0.md` is the style source for the skin layer; its boundary with this file: **Design Language governs what it looks like; Product Core governs what it is and why**.

## 8. Change log

| Date | Version | Change | Source |
|---|---|---|---|
| 2026-10-17 | v0.1 | Initial creation: kernel/skin layering, value and logic mainlines, data structure skeleton, 12 invariants, change and feedback flow-back policy | Max's route selection + v0.6 G1 baseline |
