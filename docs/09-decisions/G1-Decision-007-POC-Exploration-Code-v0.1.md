# G1 Decision 007 — POC Code Branch Classification and Disposition v0.1

- **Status**: Decided (Max, 2026-10-08)
- **Decision maker**: Max; **Recorded by**: Hermes (PM)
- **Gate**: G1 In Review; coding not authorized; this document authorizes no implementation work

## Decision

1. The POC code on the `feat/poc-implementation` branch and its iteration line (iteration-1 through iteration-6) is classified as **exploratory experiment**: used to validate the feasibility of the v0.6 specs and the AI iteration process, **not continued as formal implementation**.
2. The `feat/poc-implementation` branch is **deprecated**: after the archive tag `archive/poc-exploration-20261008` has preserved the history, the branch is deleted.
3. Formal implementation **starts fresh from `main` after G2 (design baseline) passes**; the exploration code is neither merged nor inherited.

## Background

- This code line was produced by autonomous agent iteration while G1/G2 had not passed (see the proxy authorization in `ITERATION-PLAN.md`), creating governance tension with AGENTS.md's "no coding before passing the gate".
- This decision resolves that tension: exploratory experiments are exempt from the coding ban, but do not obtain implementation status.

## Pending accompanying confirmation (G1 Closure Decision Packet)

Whether `feat/poc-iteration-1/4/6` and `poc/exploration` are likewise archived and deleted will be confirmed together with the [G1-Closure-Decision-Packet-v0.1](../00-governance/G1-Closure-Decision-Packet-v0.1.md).

## Impact

- Implementation tasks after G2 use the v0.6 specs as the sole baseline; the exploration code serves only as reference material and is not an acceptance target.
- The Roadmap and AGENTS.md rules are unchanged; this decision is an asset/scope disposition and modifies no requirements.
