# Agent Assets

This directory stores the versionable source files of the AI Life OS multi-agent team, for review, mobile viewing, and rebuilding roles on other machines.

Contains:

- `skills/`: project-specific Skill source files
- `profiles/`: copies of each agent's `SOUL.md` role rules (lifeospm / lifeospsych / lifeosdesign / lifeosreview / lifeosdev / lifeosqa)
- `WORK-LOG.md`: virtual agent team work log (who, what was done, where the artifacts are, how it was verified)

Does not contain:

- Profile `.env`, `config.yaml`, memories, sessions, or authentication information
- Hermes Kanban database, lock files, and logs
- Any real user data

Runtime profiles live in Hermes's own profile directory; this is a reviewable configuration source, not a runtime state directory. When role rules change, update both the runtime files and this directory, and record the change through a Pull Request.