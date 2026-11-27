<div align="center">

<a href="https://42.193.174.212/demo/"><img src="https://img.shields.io/badge/%E2%96%B6_LIVE_DEMO-try_the_real_AI_now-2ea44f?style=for-the-badge" alt="Live demo — try the real AI now"></a>

### [▶ Variant 1 · Information-Dense](https://42.193.174.212/demo/v1/)

### [▶ Variant 2 · Conversational ★](https://42.193.174.212/demo/v2/)

### [▶ Variant 3 · Card-Stack](https://42.193.174.212/demo/v3/)

**▲ This banner is the demo entry point** — each link opens a live, interactive app with a real LLM inside (shared fictional demo data). &nbsp; [Open the demo picker →](https://42.193.174.212/demo/)

</div>

---

# Life OS — An AI-Powered Personal Life Operating System

**Capture → AI structuring & correction → Review**, across five core life dimensions.
A self-hosted, mobile-first web app (FastAPI + SQLite + PWA) built with a disciplined, evidence-based product process — from requirements v0.1 to v0.7, SDLC phase gates, formal decision records, and independent design reviews.

> Development history is fully preserved in this repository's commit log: **37 commits from 2026-09-04 to 2026-11-23**, including PR discussions, gate closures, and versioned spec iterations. (This repo is the full English translation of the original Chinese-language project.)

---

## ▶ Live demos (live · interactive · real AI)

The three UI style variants below are **live, interactive apps** deployed on my cloud server — each one calls a **real LLM API** (type a sentence and watch it get structured in real time), with a fixed bottom four-button shell and shared synthetic demo data:

| Variant | Style | Live link |
|---|---|---|
| **Variant 1** | Information-Dense dashboard | **[https://42.193.174.212/demo/v1/](https://42.193.174.212/demo/v1/)** |
| **Variant 2** *(chosen direction)* | Conversational · Guided | **[https://42.193.174.212/demo/v2/](https://42.193.174.212/demo/v2/)** |
| **Variant 3** | Card-Stack | **[https://42.193.174.212/demo/v3/](https://42.193.174.212/demo/v3/)** |

All three: [demo picker page](https://42.193.174.212/demo/) · The demos run on shared fictional accounts (anyone can explore them; AI calls are rate-limited; data may reset). HTTPS uses a trusted Let's Encrypt certificate (bare-IP, short-lived, auto-renewed) — the links open without warnings.

---


---

## Design thinking & business outline

> **Design thesis — measurement design *is* product design.** In life management the hard part is not logging; it is defining *what a valid observation is, what a number is allowed to mean, and what it must never be used for*. Get that wrong and the product manufactures false certainty. This project treats dimension and measurement governance as its core product asset — the part that creates durable business value.

### Managing dimensions: a closed, versioned ontology

- **Five Life Dimensions — a closed set**: Time · Health · Wealth · Relationship · Purpose. Habits, projects, a job, a side business, "current focus" — all of them are *views or context over the same five-dimension records*, never new top-level categories. The dimension table is deliberately closed and small: a stable measurement axis is a precondition for longitudinal insight (uncontrolled taxonomy growth destroys comparability — the classic data-warehouse lesson applied to personal data).
- **Goals provide context, not new axes** (≤ 3 active core goals). Non-quantifiable goals are allowed and are never forced into pseudo-precise progress bars.
- **Versioned measurement context**: every impact record carries its `blueprint_version_id`, `goal_context_version_ids`, `scale_anchor_version` and assessment window. A number is only interpretable in the context it was made in — so the system stores the context and forbids comparisons when the context changed.

### Managing measurement: rules that prevent self-deception

| Naive-design trap | Rule in this system |
|---|---|
| False precision | Impact uses a fixed **1–5 discrete ordinal scale** — explicitly *an ordered subjective estimate, not a measurement*. It is never averaged, ranked, netted, differenced across dimensions, or converted to percentages. |
| Missing data read as "no effect" | **`unknown` ≠ `neutral`**, enforced at schema level: `neutral` requires an explicit user statement or an approved deterministic rule; "not mentioned in the text" can never become `neutral`. |
| AI inference laundered into fact | `epistemic_type` (user-reported fact / user-reported impact / AI-inferred impact / deterministic calculation) is tracked *separately* from confirmation status. User confirmation changes status only — a confirmed AI inference stays "a user-endorsed inference", never a direct observation. |
| Zero-sum scoring | Impact allocation is **non-zero-sum**: one behavior can hit several dimensions hard at once; degrees are judged independently per dimension and never sum-normalized. |
| Metric gaming (Goodhart) | Success metrics are **observation-only: no thresholds, no composite scores** — reported as per-item distributions with missingness. Negative signals (felt judged/anxious/dependent; wanted something deleted) are counted separately, never netted against benefits. |
| Pseudo-precision on goals | No forced quantification; `mixed` impacts record positive and negative degrees separately but compute **no ratio and no net value**. |

### Trust & evidence loop

- AI proposes → user confirms / modifies / rejects → **only confirmed or modified records enter long-term trends, dimension state and Reviews**; rejected candidates never participate. Every Review statement traces back to the user's own records, and insufficient evidence is stated as "unknown" rather than smoothed over.
- Feature design itself is evidence-graded: core mechanisms (e.g. implementation intentions, self-regulation loops) are grounded in psychology / behavioral-science sources with explicit evidence levels, applicability boundaries and risks.

### Business outline

- **The validation question (POC-01)**: *can natural-language life logging be converted into trustworthy data at acceptable cost, and produce reviews that are more traceable and more helpful than just sending the log to a general-purpose chat model?* — **trust is the differentiator**, not feature count.
- **Jobs to be done**: ① low-friction capture ② correcting AI understanding ③ understanding periodic change ④ gaining theoretical perspectives.
- **Commercial red lines (locked as product law)**: the core loop (Capture / Confirm / Review / 0–3 goal tracking) is free forever — paid only adds, never subtracts; export & delete are always free and one tap away (no "feature-hostage" tactics); paywall outreach is frequency-capped.
- **Trust boundaries**: single-user and private by design; account isolation is verified before any expansion; AI candidates never silently become long-term facts.

Every claim above is enforced in approved specs and the actual data model, not just prose: [POC-01 Product & UX Spec v0.7](docs/02-requirements/POC-01-Product-UX-Spec-v0.7.md) · [Capture Data + AI Output Contract v0.7](docs/04-data-ai/Capture-Data-AI-Output-Contract-v0.7.md) · [Design Language v1.0](docs/03-design/Design-Language-v1.0.md)

---

## Why

Personal life data (habits, time, money, relationships, purpose) usually lives in scattered notes and trackers that can't talk to each other. Life OS treats every behavior/event as a first-class record and evaluates it against **five fixed top-level dimensions** — no arbitrary custom taxonomies, no single vanity "life score".

## Key design principles

| Principle | What it means |
|---|---|
| **Five Life Dimensions** | Time / Health / Wealth / Relationship / Purpose — the only fixed top-level model |
| **Non-zero-sum impact model** | Every behavior is evaluated per dimension with a *direction* and a discrete 1–5 *impact degree*, recorded independently |
| **Unknown ≠ Neutral** | No evidence → `unknown`; evidence of no meaningful impact → `neutral` — strictly separated |
| **Human-in-the-loop** | AI proposals only enter long-term analysis after explicit user confirmation or revision |
| **Evidence-based psychology** | Core features trace back to psychology/behavioral-science sources with explicit levels of evidence and applicability limits |
| **Privacy-first, free core** | Single-user private by design; the core loop is free forever; export/delete always free — no "feature hostage" tactics |
| **Kernel / skin layering** | A stable data-model kernel (invariants INV-01–12) with swappable UI "skins" (currently a conversational-guide skin) |

## The product (POC-01)

1. **Frictionless capture** — speak plain language ("感觉今天下午有点累，健身没那么拼"), one tap to confirm
2. **AI extraction & correction** — the AI fills structure and hard metrics; corrections are also plain language, with every original value preserved (`user_revisions`, INV-02)
3. **Five-dimension view** — each entry's impact shown per dimension (direction + degree), collapsible "how the AI broke it down"
4. **Adaptive Review** — zero-or-one suggestion per review, tuned to the user's actual situation; user feedback closes the loop
5. **PWA app shell** — home-screen install, full-screen launch, one-time onboarding, mobile-first feel

## Architecture

- **Backend** — Python 3 / FastAPI + SQLite (`app/server.py`, `db.py`, `llm.py`, `auth.py`); tables follow the Capture-Data-AI-Output-Contract spec; `X-User-Id` multi-account data isolation
- **AI layer** — any OpenAI-compatible LLM API (cloud), or a deterministic offline mock provider for keyless demos; retries, explicit failure surfacing, reasoning-token-aware output budgets
- **Frontend** — zero-framework vanilla JS/CSS PWA (`app/static/`), service-worker shell cache, five-dimension color-ring icons generated by a dependency-free script
- **Auth** — optional first-visit self-set password (PBKDF2 + HMAC-signed cookie), gate for cloud deployment
- **Tests** — pytest invariant suite (INV-01–12), GitHub Actions CI (app tests + repository safety guard)

## Engineering process (the part I care about most)

This project follows a full SDLC governance model unusual for a personal project:

- **Phase gates G0→G3** with explicit entry/exit criteria; no coding before requirements baseline; architecture changes require a *decision packet* approved before implementation
- **Formal decision records** — every product/architecture decision has a dated, versioned record (G0–G2 amendments, DQ-006 analytics decision, G2-Decision-001–003 positioning rulings)
- **Versioned specs** — requirements v0.1→v0.7, data contracts v0.1→v0.7, test/acceptance specs v0.1→v0.7, each iteration's diff preserved
- **Independent reviews** — privacy review, psychological-safety review, mixed-impact-model review, commercialization design review — each with findings tracked to closure
- **Virtual agent team** — a named 6-role AI team (product, psychology, design, review, dev, QA) with role charters (`agent-assets/profiles/*/SOUL.md`) and a transparent work log (`agent-assets/WORK-LOG.md`)
- **Market validation** — market research + commercialization validation design (paywall/pricing experiments/retention instrumentation) with commercial red lines fixed in the requirements baseline

## Development timeline

| Date | Milestone |
|---|---|
| 2026-09-04 | Repository established; CI safety guard; five-dimension impact modeling |
| 2026-09-13→30 | Impact rules approved; mixed impact degrees; adaptive Review requirements |
| 2026-10 | G1 closure decision packet; design language v0.1; virtual agent team; G2 prototypes |
| 2026-10-17 | G2-Decision-001: kernel baseline, design baseline (Variant 2), demo repo |
| 2026-10-24 | First "skin" v0.1 — self-usable product; market research v0.1 |
| 2026-10-25→11-12 | Product positioning amendment; commercialization validation design v0.1→v0.2 (independent review closed) |
| 2026-11-14 | Variant-2 design skin ported into product |
| 2026-11-17→18 | Frictionless capture v0.2; DQ-006 analytics; LLM setup wizard; POC-01 v0.7 baseline |
| 2026-11-18→23 | PWA app experience pack; product renamed to **Life OS**; app shell polish |

## Repository map

```
docs/
  00-governance/        SDLC roadmap, gate closure decision packets, protocols
  02-requirements/      POC-01 Product-UX-Spec v0.1–v0.7, commercialization design
  03-design/            Design Language v0.1–v1.0, 3 interactive HTML prototypes
  04-data-ai/           Capture-Data-AI-Output-Contract v0.1–v0.7
  05-technical-architecture/  Product Core v0.1 (kernel invariants INV-01–12)
  06-testing/           Test & Acceptance Spec v0.1–v0.7
  08-research/          Evidence cards, independent review plans/records, market research
  09-decisions/         All decision records & amendments (G0–G2, DQ-006…)
app/                    FastAPI + SQLite backend, PWA frontend, tests
agent-assets/           Virtual agent team charters, skills, work log
scripts/                Repo safety check, PWA icon generator
```

Full document register (every spec with version, status, SDLC stage and gate mapping): [`docs/README.md`](docs/README.md).

## Run it locally

```bash
cd app
python3 -m venv .venv && ./.venv/bin/pip install -r requirements.txt
export AI_LIFE_OS_LLM_PROVIDER=openai_compatible   # or "mock" for keyless demo
export AI_LIFE_OS_LLM_BASE_URL=https://api.example.com/v1
export AI_LIFE_OS_LLM_API_KEY=sk-...               # env only, never committed
export AI_LIFE_OS_LLM_MODEL=your-model
./.venv/bin/python -m uvicorn server:app --host 127.0.0.1 --port 8787
# open http://127.0.0.1:8787 (use --host 0.0.0.0 for same-LAN phone access)
# or simply: ./app/start.sh  (with a local .env)
```

Tests: `cd app && ./.venv/bin/python -m pytest tests/ -q` — invariant acceptance suite (INV-01–12).

## Provenance

This English repository is a complete translation of the original Chinese project (requirements, specs, decision records, code comments, and commit history), with deployment-specific secrets redacted. Commit dates, version numbers, and decision IDs are preserved exactly as recorded in the original development.
