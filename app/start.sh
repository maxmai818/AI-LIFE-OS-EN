#!/bin/bash
# AI Life OS one-click startup (for personal use)
cd "$(dirname "$0")"
# LLM configuration (if present): provider/base_url/model/api_key all come from the local .env, never in git
if [ -f .env ]; then set -a; . ./.env; set +a; fi
[ -d .venv ] || python3 -m venv .venv
./.venv/bin/pip install -q -r requirements.txt
exec ./.venv/bin/python -m uvicorn server:app --host 0.0.0.0 --port 8787
