# GitHub Sync and Branching Policy v0.1

**Status:** Active
**Scope:** AI Life OS product documents, agent specifications, and project code

## 1. Objective

The GitHub private repository is the remote copy and collaboration entry point for AI Life OS's official project assets, making it easy to view documents, code, commits, reviews, and CI results on a computer or phone.

GitHub does not hold Hermes runtime state, nor does it serve as a backup location for real user data, secrets, or running databases.

## 2. Included in Version Control

- Product vision, roadmap, requirements, UX, architecture, and decision documents
- Psychology Evidence Cards and evidence review records
- Redacted test specifications and fixed test data
- Agent skill and role rule source files
- Future application, service, shared package, and automated test code
- Database schema and migration scripts, but not actual database files
- CI/CD workflows, release notes, and deployment configs without credentials

## 3. Prohibited from Commits

- `.env` files, API keys, tokens, certificates, private keys, and deployment credentials
- User journals, health, finance, relationship, or other real private data
- Unredacted logs, session transcripts, and model request/response dumps
- SQLite/PostgreSQL data files, caches, lock files, and temporary files
- Profiles, Memory, Session, Kanban DB, and runtime logs under `~/.hermes/`
- Build artifacts, dependency directories, and local IDE configuration

If any sensitive data is committed by mistake, stop pushing/releasing immediately, revoke the exposed credentials, and purge the Git history; adding a `.gitignore` alone does not remove secrets that have already entered history.

## 4. Sync Approach

Do not use "auto-commit on every file change". Use controlled sync after task completion:

```text
Kanban task
→ branch or worktree
→ modify and verify
→ focused commit
→ push
→ Pull Request
→ independent review + CI
→ merge into `main`
```

Both requirements and code follow this process. Unfinished drafts may be pushed to their own branches, but must never bypass review to enter `main`.

## 5. Branch Conventions

- `docs/<topic>`: requirements, research, and decision documents
- `feat/<topic>`: new features
- `fix/<topic>`: bug fixes
- `test/<topic>`: testing and evaluation
- `security/<topic>`: security and privacy changes
- `ci/<topic>`: continuous integration and release processes

## 6. Automation Boundaries

Automated execution allowed:

- Commit and push task branches after verification
- Open Pull Requests
- Run formatting, tests, builds, and security checks
- Fix and re-verify on the original branch for identified defects
- Deploy to an approved Staging environment and run smoke tests

Requires human approval:

- Merging requirements that change product scope, psychological mechanisms, or sensitive data usage
- Clinical or health effect claims
- Destructive database migrations
- Production deployments
- Secret, billing, domain, and production permission changes

## 7. Viewing on Mobile

Check first:

- The repository home `README.md`
- `docs/README.md`
- Pull Requests and review comments
- Actions/CI results
- Releases and release notes

Hermes Kanban state stays in the local runtime system and is not synced through GitHub database files.
