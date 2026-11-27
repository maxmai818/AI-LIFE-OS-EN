# G2 Decision 002: Development Start (First Skin v0.1)

- **Date**: 2026-10-17
- **Decision maker**: Max (original reply: "Start development")
- **Type**: milestone decision
- **Status**: Decided (2026-10-17 addendum: the technical architecture baseline was confirmed by Max as A; during the process, work went first and confirmation came after — recorded as a process lesson)

## Decision content

Approve G2 entering development: implement **First Skin v0.1 — a usable product good enough for self-use** along the kernel/skin layering route (Variant 2 Conversational-Guided interaction + Product Core v0.1 kernel).

## Scope (v0.1 self-use loop)

- Capture → AI structuring (cloud LLM) → confirmation/correction → Five-Dimension view → Review (zero or one suggestion) → feedback
- Fixed Five Life Dimensions, goals ≤3, INV-01–12 invariants fully in force
- Mobile-first (375px), Chinese UI, single-machine self-use deployment (running locally on a Mac)

## Technical baseline (confirmed — Max replied A on 2026-10-17: confirm current state)

- Backend Python / FastAPI + SQLite (data model per Capture-Data-AI-Output-Contract v0.6); data carries `user_id` (multi-account ready)
- Single-page frontend (Variant 2 skin), zero build chain
- Cloud LLM: OpenAI-compatible API, keys injected only via environment variables, never committed to the repo; tests use a mock provider
- Acceptance: invariant tests + smoke flow + lifeosqa checks

## Irreversible boundary

Production deployment, destructive migrations, and new uses of sensitive data still require Max's explicit approval; this approval covers local self-use running only.
