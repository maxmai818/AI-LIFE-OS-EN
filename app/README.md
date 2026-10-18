# AI Life OS · 第一张皮 v0.1（G2 开发）

自用可用产品：Capture → AI 结构化 → 确认/纠正 → 五维视图 → Review（零或一建议）→ 反馈。
内核 = `docs/05-technical-architecture/Product-Core-v0.1.md`（INV-01～12）；皮肤 = 变体 2 对话引导型。

## 本地运行

```bash
cd app
python3 -m venv .venv && ./.venv/bin/pip install -r requirements.txt
# 云 LLM（OpenAI 兼容接口；密钥只放环境变量，永不入仓）
export AI_LIFE_OS_LLM_PROVIDER=openai_compatible
export AI_LIFE_OS_LLM_BASE_URL=https://api.example.com/v1
export AI_LIFE_OS_LLM_API_KEY=sk-...          # 勿写入任何文件
export AI_LIFE_OS_LLM_MODEL=your-model
./.venv/bin/python -m uvicorn server:app --host 127.0.0.1 --port 8787
# 打开 http://127.0.0.1:8787 （手机同局域网可换 --host 0.0.0.0）
```

无密钥试用：`AI_LIFE_OS_LLM_PROVIDER=mock`（确定性规则，不出网）。

## 测试（不变量验收）

```bash
cd app && ./.venv/bin/python -m pytest tests/ -q   # INV-01～12 相关 11 项
```

## 数据

SQLite（`app/data.db`，可用 `AI_LIFE_OS_DB` 指定路径；不入仓）。表结构对齐
Capture-Data-AI-Output-Contract v0.6；`X-User-Id` 头区分账号（默认 1），数据按 user_id 隔离。
