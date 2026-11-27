# Max CEO Decision Protocol v0.1

- **Status**: In effect (confirmed by Max, 2026-10-08)
- **Objective**: Max engages CEO-style — ≤5 minutes daily, ≤15 minutes weekly; everything else is carried by the agent team.

## 1. Decision Tiers

| Tier | Scope | Handling |
|---|---|---|
| Max retains | Direction choices (prototype/feature trade-offs), irreversible or high-risk items (privacy model, finalizing data structures, external releases, real data, crisis scenarios), milestone acceptance (G0–G6 gates) | One-page decision packet; Max replies with an option |
| Agent default | Execution details, document formatting, version progression, checks and fixes, task breakdown | Approved by default + recorded in `docs/09-decisions/`; Max may overturn afterward |
| Escalation conditions | Scope changes, reserved decisions being touched, pending-decision queue > 3 items | Only then may Max be interrupted; execution issues never escalate |

## 2. Decision Packet Format (Mandatory)

Anything requiring a Max decision must be compressed into one page:

1. **What is being decided** (one sentence)
2. **Recommended option + rationale** (≤ 5 lines)
3. **Differences from the previous version / status quo** (a small table or bullet points)
4. **Irreversible risk** (explicitly "low / medium / high")
5. **Alternatives** (including "send back for revision")

Appendix: the list of automatic actions after approval (Max needs no second confirmation). Substandard decision packets are sent back by lifeospm for a redo; throwing the full text up the chain is not an acceptable substitute.

## 3. Cadence

- **Daily ≤ 5 minutes**: review the "pending-decision queue" (one line per item) and reply item by item with the option number.
- **Weekly ≤ 15 minutes**: automatic weekly report (progress, decision log, next week's milestones) + course calibration; discuss direction only, no detail reviews.

## 4. Prototype Decision Flow (Applies from G2 Onward)

AI produces **3 differentiated clickable HTML prototypes** in parallel (each with a one-line positioning statement + a trade-off table) → Max selects one and annotates → revision rounds **≤ 2** → frozen as the design baseline → development begins. Optional: after finalization, import into Figma via html.to.design for refinement; the AI reads back design tokens and design specs through the Figma connector to generate code.

## 5. Guardrails

- As per AGENTS.md: creators do not approve their own work; irreversible operations (releases, destructive migrations, sensitive-data uses, clinical claims) require Max's explicit approval.
- Default approval under delegation is not a pass for high-risk items; violations immediately revoke the corresponding agent's default permissions.
- Changes to this protocol require Max's approval (via a decision packet).
