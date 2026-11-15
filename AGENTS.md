# AI Life OS Repository Rules

## Project state

- **Project state**: G2 development is active (gate approved by Max 2026-10-17, G2-Decision-002). Implementation lives in `app/` (first skin v0.1); Product Core invariants (`docs/05-technical-architecture/Product-Core-v0.1.md` INV-01~12) are acceptance criteria for all code changes.

## Source of truth

- Product and governance decisions live under `docs/`.
- Approved requirements are immutable baselines; revise with a new version or an explicit amendment.
- Preserve the distinction between Life Score, Goal Progress, and Deviation/Gap.
- Raw user Capture is evidence. AI-derived structure is an inference until confirmed and must retain provenance, confidence, model/schema version, and correction history.
- Psychology-grounded features require an Evidence Card and independent review before implementation.

## Agent workflow

- `lifeospm` decomposes and routes durable Kanban tasks.
- `lifeospsych` designs psychology-grounded requirements.
- `lifeosdesign` owns prototypes, UI language, and style consistency; its memory source is `docs/03-design/Design-Language-v1.0.md`, read before every design task and updated after every user annotation.
- `lifeosreview` independently reviews requirements and may request changes.
- `lifeosdev` implements only approved requirements in a branch/worktree.
- `lifeosqa` verifies acceptance criteria and may deploy to staging only.
- Every completed task is recorded in `agent-assets/WORK-LOG.md` (role, task, input, artifact, verification, status).
- A creator never approves their own work.
- Technology-stack and architecture baselines require a decision packet confirmed by Max **before** implementation.
- Production deployment, destructive migrations, new sensitive-data uses, and clinical claims require explicit human approval.

## Git workflow

- Never commit directly to `main` for product changes after bootstrap.
- Use `docs/`, `feat/`, `fix/`, `test/`, `security/`, or `ci/` branch prefixes.
- Each task produces a focused commit and Pull Request.
- Run applicable tests before push and record exact results.
- Merge only after independent review and required CI checks pass.
- Never commit secrets, `.env` files, real user records, runtime databases, Hermes state, logs containing sensitive content, or deployment credentials.

## Writing conventions

- Filenames use clear English names; document bodies may be Chinese.
- Use version suffixes such as `v0.1`, `v0.2`, and `v1.0` for formal documents.
- Record material decisions in `docs/09-decisions/`.
- State facts, calculations, inferences, hypotheses, and recommendations separately.
