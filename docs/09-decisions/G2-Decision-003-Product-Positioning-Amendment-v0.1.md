# G2 Decision 003: Product Positioning Amendment (Three Rulings After Market Research)

- **Date**: 2026-11-09
- **Decision maker**: Max (original reply: "DQ-01: A DQ-02: A DQ-03: A")
- **Type**: product positioning decision (commercial framing / market priority / pricing)
- **Status**: Decided
- **Basis**: `docs/08-research/Market-Research-AI-Life-OS-v0.1.md` (market research v0.1, PR #13, §8 decision points)

## Decision content

Market research conclusion: the product is worth building, but only a "small and beautiful" route is viable (the indie line has revenue exemplars in Heptabase / Daylio, while venture-style growth does not hold: the category is winner-take-all, and the overall wellness market was -6.2% in 2025). On this basis Max issued three rulings:

| Decision point | Ruling | Content |
|---|---|---|
| DQ-01 commercial framing | **A** | Indie line: a standalone product line with a business target of $10K–$200K MRR (monthly recurring revenue); no venture-style growth |
| DQ-02 market priority | **A** | Chinese-English bilingual in parallel |
| DQ-03 pricing | **A** | $8–15/month + $60–100/yearly plan |

## Product positioning corrections (from market research §7, landed as constraints)

1. **Retention centers on a "weekly/monthly Review ritual"**, not a daily check-in style design (category D30 retention is about 3%; check-in style products basically die within 30 days).
2. **Privacy (local-first / exportable / deletable) is elevated to a top-tier selling point** (payment-validated: Daylio earns roughly $100K/month on local privacy).
3. **Red line: no diagnostic claims.** The product boundary is wellness / self-reflection; no diagnosis or treatment claims for depression, anxiety, or similar conditions (FDA General Wellness boundary — an order-of-magnitude difference in compliance cost).
4. **Validation milestones (verifiable)**: reach $3–5K MRR and D30 retention >10% within 12 months of launch (2–3× the category median); missing the target triggers a positioning review.
5. **Growth method**: word-of-mouth niche, no burning money on paid acquisition (given a consumer-subscription CAC payback baseline of 1–3 months, ad-driven growth is not viable).

## Impact on existing baselines

- The existing invariants INV-01–12 and the Product Core v0.1 kernel are **unchanged**; this decision only adds product positioning and commercialization constraints.
- Subsequent new versions of the POC-01 Product & UX Spec absorb the above corrections (retention ritual, privacy selling point, no-diagnosis red line).
- Commercialization validation design (paywall form, pricing experiments, retention analytics instrumentation) is a follow-up work item, to be approved separately.

## Open items

- **OQ-01**: lack of quantitative data on Chinese consumer willingness to pay (research R5, [unverified]) — placed in the backlog, supplementary research after work is initiated.
- **OQ-02**: paywall form (hard paywall vs freemium rate limiting) to be decided during the commercialization validation design stage (research baseline: hard-wall conversion 12.11% vs freemium 2.18%, on a 35-day basis).

## Irreversible boundary

Production deployment, real payment/billing integration, and new uses of sensitive data still require Max's explicit approval.
