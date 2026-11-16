#!/bin/bash
# AI Life OS · LLM 配置向导
# 密钥隐藏输入，只写入本地 .env（权限 600），永不进 git / 不出现在屏幕。
cd "$(dirname "$0")"

echo "── AI Life OS · 配上 LLM ──"
echo "选服务（直接回车 = 1）："
echo "  1) 小米 MiMo（api.xiaomimimo.com）"
echo "  2) DeepSeek（api.deepseek.com）"
echo "  3) Kimi / Moonshot（api.moonshot.cn）"
echo "  4) 智谱 GLM（open.bigmodel.cn/api/paas/v4）"
echo "  5) 自定义 OpenAI 兼容服务"
read -r -p "编号 [1]: " CHOICE
CHOICE=${CHOICE:-1}
case "$CHOICE" in
  1) PROV=xiaomi;   BASE=https://api.xiaomimimo.com/v1;        MODEL=mimo-v2.6-pro ;;
  2) PROV=deepseek; BASE=https://api.deepseek.com/v1;          MODEL=deepseek-chat ;;
  3) PROV=kimi;     BASE=https://api.moonshot.cn/v1;           MODEL=moonshot-v1-8k ;;
  4) PROV=zhipu;    BASE=https://open.bigmodel.cn/api/paas/v4; MODEL=glm-4-flash ;;
  5) read -r -p "服务商标识（自定名字）: " PROV
     read -r -p "base_url（以 /v1 结尾）: " BASE
     read -r -p "模型名: " MODEL ;;
  *) echo "无效选项"; exit 1 ;;
esac

read -r -p "模型名 [$MODEL]: " M2; MODEL=${M2:-$MODEL}
echo -n "粘贴 API Key（输入不显示，回车结束）: "
read -r -s KEY; echo
if [ -z "$KEY" ]; then echo "没有输入 Key，取消。"; exit 1; fi

cat > .env <<EOF
AI_LIFE_OS_LLM_PROVIDER=$PROV
AI_LIFE_OS_LLM_BASE_URL=$BASE
AI_LIFE_OS_LLM_MODEL=$MODEL
AI_LIFE_OS_LLM_API_KEY=$KEY
EOF
chmod 600 .env
unset KEY

echo "已写入 app/.env（权限 600，已在 .gitignore 保护中）。正在连通性测试…"
set -a; . ./.env; set +a
./.venv/bin/python - <<'PY'
import json, os, urllib.request
base = os.environ["AI_LIFE_OS_LLM_BASE_URL"].rstrip("/")
req = urllib.request.Request(
    base + "/chat/completions",
    data=json.dumps({"model": os.environ["AI_LIFE_OS_LLM_MODEL"],
                     "messages": [{"role": "user", "content": "回复两个字：你好"}],
                     "max_tokens": 10}).encode(),
    headers={"Content-Type": "application/json",
             "Authorization": "Bearer " + os.environ["AI_LIFE_OS_LLM_API_KEY"]})
try:
    r = json.load(urllib.request.urlopen(req, timeout=30))
    print("✅ 连通成功，模型回复:", r["choices"][0]["message"]["content"][:20])
except Exception as e:
    print("❌ 测试失败:", e)
    raise SystemExit(1)
PY
if [ $? -eq 0 ]; then
  echo "完成！运行 ./start.sh 重启即生效（AI 整理/纠错都会走真模型）。"
fi
