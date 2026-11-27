# G2 Decision 001: Kernel Baseline Approval and Design Baseline Selection

- **Date**: 2026-10-17
- **Decision maker**: Max (original reply: "#1, approved #2, 2 without annotations #3, 1")
- **Type**: milestone / direction decision
- **Status**: Decided

## Decision content

| # | Decision item | Decision |
|---|---|---|
| 1 | Product Core v0.1 approved as the G2 kernel baseline | **Approved** (2026-10-17) |
| 2 | G2 prototype selection | **Variant 2 "Conversational-Guided"**, no annotations (zero revision rounds) |
| 3 | Mobile access plan | **① Public demo repository** (free; the main repo stays private) |

## Implications

- The kernel (data structures + INV-01–12 invariants + the logic mainline) is now the G2 baseline; changes go through a decision packet (Product Core §6).
- The design baseline is frozen as Design Language v1.0 (the first skin = Variant 2's interaction philosophy); reskinning does not touch the kernel.
- The three prototype variants are archived in the public demo repository for mobile access, with pages noindex; real data always stays in the private main repo (Design Language v1.0 §5).

## Alternatives (not chosen)

1. Prototype: Variant 1 "Information-Dense" / Variant 3 "Card-List".
2. Mobile plan: ② GitHub Pro (paid) / ③ no hosting (conversation cards only).
