# Interview Demo Build Spec v0.1 (three live interactive skins)

Goal: three live demos at `/demo/v1/` `​/demo/v2/` `/demo/v3/` on the production host, each a
different visual variant of the same working product, backed by the real API + real LLM,
isolated synthetic users (shared fictional demo data, rate-limited). English only. Audience:
interviewers clicking a link from the README.

## API contract (source of truth: `app/server.py`)

Base URL per variant: **`/demo-api/v1`** (v1 skin), **`/demo-api/v2`**, **`/demo-api/v3`**.
Same-origin, JSON, **no auth headers** — the server pins the synthetic user from the URL.
All errors are `{"detail": "..."}` with 4xx/5xx status. 429 = demo rate-limited (graceful message).

| Call | Body | Response |
|---|---|---|
| `POST /captures` | `{"raw_text": "..."}` | `{"id": N, "status": "saved"}` |
| `POST /captures/{id}/extract` | – | `{"capture_id", "run_id", "item_ids": [...]}` (real LLM, 2–20 s) |
| `GET /captures/{id}/items` | – | `{"items": [item...]}` |
| `GET /captures?limit=30` | – | `{"captures": [{"id","raw_text","captured_at","status"}]}` |
| `GET /pending` | – | `{"items": [item...]}` (status proposed/unresolved) |
| `POST /items/{id}/confirm` `/reject` `/later` | – | `{"ok", "item_id", "status"}` |
| `POST /items/{id}/correct` | `{"feedback": "plain language"}` | `{"item_id", "changed": [{target_type, field_name, old, new}], "revision_id"}` (real LLM; `changed` may be empty) |
| `GET /dimensions` | – | `{"dimensions": [{"key","qualitative","avg_degree","evidence":[{"dimension_key","direction","degree","item_id","text_value"}]}], "note"}` |
| `POST /reviews/generate` | `{"review_type":"daily\|weekly\|monthly\|onboarding\|scenario","period_days":N}` | `{"review_id", "statements": N, "recommendation": true\|false}` (real LLM, several s) |
| `GET /reviews/{id}` | – | `{"review": {...}, "statements": [{id, statement_type, text, uncertain_points (JSON string or null), theory: [{author, source_title, year, citation, assumption_boundary}]}], "recommendations": [{id, text, reason, status, unknowns, target_dimension_keys}]}` |
| `POST /reviews/{id}/feedback` | `{"changed": true\|false, "feedback_text": "..."}` | `{"review_id","feedback"}` |
| `POST /recommendations/{rec_id}/status` | `{"status": "accepted\|rejected\|modified\|completed\|proposed"}` | `{"id","status"}` |
| `GET /goals` | – | `{"goals": [...]}` |
| `POST /goals` | `{"title","dimension_keys":["time",...],"measurable":true,"metric","horizon"}` | `{"id","status"}` |
| `POST /goals/{id}/status` | `{"status": "active\|paused\|completed\|draft"}` | `{"ok"}` |
| `POST /impacts/{id}/revise` | `{"direction": "positive\|negative\|mixed\|neutral\|unknown", "degree": 1-5, "note"}` | `{"impact_id", ...}` |
| `POST /items/{id}/revise` | `{"field_name": "text_value\|item_date\|quantity\|unit\|normalized_value", "corrected_value"}` | `{"item_id", ...}` |

item = `{id, item_type, text_value, normalized_value, quantity, unit, item_date, confidence,
ai_reason, status, needs_confirmation, created_at, impacts: [{id, dimension_key, direction,
degree_positive, degree_negative, degree, confidence, evaluation_mode, note}], revisions: [...]}`

Dimension keys are fixed five: `time, health, wealth, relationship, purpose`.
`direction`: `positive | negative | mixed | neutral | unknown`; `degree` 1–5 (mixed uses
`degree_positive`/`degree_negative`). **Unknown ≠ Neutral**: unknown = no evidence yet
(render "No evidence / unknown"), neutral = evidence of no clear effect (render "No clear
effect", cite the note).

## Product rules (kernel invariants — non-negotiable)

- The user's raw sentence is never rewritten — show it verbatim ("Your own words").
- No Life Score, no totals; the five dimensions are non-zero-sum — never net them against
  each other or rank the user.
- AI output is provisional until confirmed — "AI thinks this" tone; user can correct in
  plain language; corrections are recorded as revisions (shown as "edited").
- Max 3 active goals (INV-10).
- Calm, non-judgmental English microcopy. No gamification: no streaks, badges, scores,
  confetti, leaderboards, "you failed" phrasing.
- Theory citations must show author · work · year **with** applicability/assumption
  boundary ("applies when …").
- Review generates **zero or one** "big change" recommendation (`recommendation: true` ⇒
  exactly one such card; never stack nagging suggestions).

## UI requirements (all three variants)

- Mobile-first at 375px; on desktop it goes full-width with a max content column (~720px),
  no fake phone frame. No horizontal scroll at 320px.
- **Fixed bottom tab bar with exactly 4 buttons: Capture · Five Dimensions · Review · Me** —
  always visible (position: fixed; bottom: 0) while content scrolls behind it.
- **Capture tab** = conversation stream: user bubble (their raw sentence) + AI result card
  (extracted items, each with its five-dimension impact chips: direction + 1–5 degree dots).
  Composer fixed above the tab bar: text input + send button + 2–4 example chips that fill
  the input. Send flow: `POST /captures` → `POST /captures/{id}/extract` →
  `GET /captures/{id}/items` → render result card. Show a typing/loading state during the
  LLM call; on failure keep the raw text and offer retry.
- Result card actions: **"Yes, that's right"** (confirm all pending items of that capture),
  **"Not quite"** (reveals per-item plain-language correction input → `POST /items/{id}/correct`,
  re-render changed fields marked "edited"), per item: "Leave for later", "Delete item".
- History: earlier captures loaded via `GET /captures` on first render, each expandable to
  its items (`GET /captures/{id}/items`). Pending items surface at top ("Awaiting
  confirmation") with confirm/reject.
- **Five Dimensions tab**: `GET /dimensions` — one card per dimension: verdict label
  (`qualitative`), average degree dots, up to 3 evidence quotes (with item text), and an
  explicit note "X behaviors have no evidence yet — unknown, not neutral". Footer line:
  the five dimensions are non-zero-sum; there is no overall score.
- **Review tab**: period picker (Today 1 / This week 7 / This month 30 days), three modes
  ("Walk me through it" = guided, "Facts only", "No review for now" — the third simply
  shows the calm "no reminders" note). Generate → loading → `GET /reviews/{id}`:
  statements tagged by kind (Confirmed fact / Calculated / Speculation / Theory /
  Suggestion / Limitation), theory citations with assumption boundary, uncertain points as
  a list, and **at most one** BIG CHANGE card with Accept / Edit / Not this one
  (`POST /recommendations/{rec_id}/status`). After the review: match chips ("This matches"
  / "This doesn't match") + optional note → `POST /reviews/{id}/feedback`, thank-you note.
- **Me tab**: goals list + "Add a goal" (title, dimension chips, metric, horizon; max 3
  active — disable the add button at 3), goal status actions, a short privacy/export
  paragraph (data = one SQLite file, exportable/deletable), and a demo disclaimer line:
  interview demo with fictional shared data that may reset.
- Every view has: loading state, empty state ("Nothing yet — jot one sentence below"),
  error state with retry. Never fake progress (no fake percentages; a simple honest
  spinner/typing dots during LLM calls is fine).
- Accessibility floor: 44px tap targets, aria-labels on icon-only buttons, visible focus,
  `lang="en"`.

## Tech constraints

- Vanilla JS + CSS, **no frameworks, no CDN, no external fonts** (system font stack).
  No build step. Three files only: `index.html`, `skin.css`, `skin.js`.
- Escape every piece of user/LLM text before `innerHTML` (write an `esc()` helper and use it
  everywhere). Use `localStorage` only for UI state (active tab), never for secrets.
- Test procedure before you finish: from `app/`, run
  `AI_LIFE_OS_LLM_PROVIDER=mock AI_LIFE_OS_DB=/tmp/<your-variant>-test.db ../.venv/bin/python -m uvicorn server:app --port 89xx`
  then `curl` your demo API base end-to-end (capture → extract → items → confirm) and
  `curl http://127.0.0.1:89xx/demo/<variant>/` for 200 + correct asset URLs; run
  `node --check skin.js`. Clean up your server process afterwards. The synthetic demo user
  starts with fictional seed history (5–6 captures) so the Dimensions/Review tabs are full
  on first load.

## Design identity

Visual identity comes from the variant's English mock:
`docs/03-design/prototypes/variant-{N}/index.html` (single-file mock with fake data —
read it for palette, typography, card shapes, spacing personality). Replace its fake data
and dead interactions with the real flow above; the conversational skeleton (composer +
bottom 4-tab bar) follows `app/static/` (the approved variant-2 product skin). The result
must look like its own designed variant, not a reskinned copy of variant 2.
