#!/bin/bash
# AI Life OS 一键启动（本地自用）
cd "$(dirname "$0")"
# LLM 配置（若存在）：provider/base_url/model/api_key 全部来自本地 .env，永不进 git
if [ -f .env ]; then set -a; . ./.env; set +a; fi
[ -d .venv ] || python3 -m venv .venv
./.venv/bin/pip install -q -r requirements.txt
exec ./.venv/bin/python -m uvicorn server:app --host 0.0.0.0 --port 8787
