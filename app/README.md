# AI Life OS · First Skin v0.1 (G2 development)

A self-usable product: Capture → AI structuring → confirm/correct → Five Life Dimensions view → Review (zero or one suggestion) → feedback.
Kernel = `docs/05-technical-architecture/Product-Core-v0.1.md` (INV-01–12); skin = Variant 2 conversational-guided.

## Run locally

```bash
cd app
python3 -m venv .venv && ./.venv/bin/pip install -r requirements.txt
# Cloud LLM (OpenAI-compatible API; keep the key in env vars only, never in the repo)
export AI_LIFE_OS_LLM_PROVIDER=openai_compatible
export AI_LIFE_OS_LLM_BASE_URL=https://api.example.com/v1
export AI_LIFE_OS_LLM_API_KEY=sk-...          # never write it into any file
export AI_LIFE_OS_LLM_MODEL=your-model
./.venv/bin/python -m uvicorn server:app --host 127.0.0.1 --port 8787
# Open http://127.0.0.1:8787 (use --host 0.0.0.0 for phone access on the same LAN)
```

Try without a key: `AI_LIFE_OS_LLM_PROVIDER=mock` (deterministic rules, no network calls).

## Tests (invariant acceptance)

```bash
cd app && ./.venv/bin/python -m pytest tests/ -q   # 11 tests covering INV-01–12
```

## Data

SQLite (`app/data.db`, path overridable with `AI_LIFE_OS_DB`; not committed to the repo). Table schema aligned with
Capture-Data-AI-Output-Contract v0.6; the `X-User-Id` header separates accounts (default 1), and data is isolated per user_id.