#!/bin/bash
# AI Life OS · LLM setup wizard
# The API key is entered hidden and written only to the local .env (mode 600); it never enters git and never appears on screen.
cd "$(dirname "$0")"

echo "── AI Life OS · set up LLM ──"
echo "Pick a service (just press Enter = 1):"
echo "  1) Xiaomi MiMo (api.xiaomimimo.com)"
echo "  2) DeepSeek (api.deepseek.com)"
echo "  3) Kimi / Moonshot (api.moonshot.cn)"
echo "  4) Zhipu GLM (open.bigmodel.cn/api/paas/v4)"
echo "  5) Custom OpenAI-compatible service"
read -r -p "Choice [1]: " CHOICE
CHOICE=${CHOICE:-1}
case "$CHOICE" in
  1) PROV=xiaomi;   BASE=https://api.xiaomimimo.com/v1;        MODEL=mimo-v2.6-pro ;;
  2) PROV=deepseek; BASE=https://api.deepseek.com/v1;          MODEL=deepseek-chat ;;
  3) PROV=kimi;     BASE=https://api.moonshot.cn/v1;           MODEL=moonshot-v1-8k ;;
  4) PROV=zhipu;    BASE=https://open.bigmodel.cn/api/paas/v4; MODEL=glm-4-flash ;;
  5) read -r -p "Provider id (your own name): " PROV
     read -r -p "base_url (ending in /v1): " BASE
     read -r -p "Model name: " MODEL ;;
  *) echo "Invalid option"; exit 1 ;;
esac

read -r -p "Model name [$MODEL]: " M2; MODEL=${M2:-$MODEL}
echo -n "Paste the API Key (input hidden, press Enter when done): "
read -r -s KEY; echo
if [ -z "$KEY" ]; then echo "No key entered, cancelled."; exit 1; fi

cat > .env <<EOF
AI_LIFE_OS_LLM_PROVIDER=$PROV
AI_LIFE_OS_LLM_BASE_URL=$BASE
AI_LIFE_OS_LLM_MODEL=$MODEL
AI_LIFE_OS_LLM_API_KEY=$KEY
EOF
chmod 600 .env
unset KEY

echo "Written to app/.env (mode 600, already protected by .gitignore). Testing connectivity…"
set -a; . ./.env; set +a
./.venv/bin/python - <<'PY'
import json, os, urllib.request
base = os.environ["AI_LIFE_OS_LLM_BASE_URL"].rstrip("/")
req = urllib.request.Request(
    base + "/chat/completions",
    data=json.dumps({"model": os.environ["AI_LIFE_OS_LLM_MODEL"],
                     "messages": [{"role": "user", "content": "Reply with the word: hello"}],
                     "max_tokens": 10}).encode(),
    headers={"Content-Type": "application/json",
             "Authorization": "Bearer " + os.environ["AI_LIFE_OS_LLM_API_KEY"]})
try:
    r = json.load(urllib.request.urlopen(req, timeout=30))
    print("✅ Connected, model replied:", r["choices"][0]["message"]["content"][:20])
except Exception as e:
    print("❌ Test failed:", e)
    raise SystemExit(1)
PY
if [ $? -eq 0 ]; then
  echo "Done! Run ./start.sh to restart and apply (AI organizing/correction will use the real model)."
fi
