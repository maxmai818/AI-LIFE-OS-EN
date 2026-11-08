# AI Life OS 市场调研报告 v0.1

**Status:** Draft — 待 Max 批准（批准前不作为 G2/G3 阶段决策依据）
**Version:** 0.1 · 2026-11-05
**Owner:** lifeospm（产品）
**问题:** AI Life OS（生活记录 + AI 五维评估 + 循证心理学建议）能不能做、赚不赚钱
**方法:** 三镜头调研（竞品格局 / 市场规模与趋势 / 变现经济学），26 个可查来源，逐句引用见附录 A
**上一版本:** 无（首版）

---

## 0. 阅读提示

- 数字分两种口径：**公司披露/财报**（可信）与**第三方估算**（Appfigures / Sensor Tower / Latka / Business of Apps / 各聚合站，误差可达 2–5 倍，全文标注「估算」）。
- 分析机构的 TAM（Total Addressable Market，总可服务市场）口径互相矛盾且普遍偏大，全文与「真实消费者支出」（App 商店口径）分开呈现。

## 1. 结论（直答两问）

### 1.1 能不能做？——能，但只能按「小而美」做；不成立的是风险投资式增长生意

需求侧真实存在：AI 陪伴/教练类 App 2025 上半年收入 $8200 万、全年预计超 $1.2 亿，下载量同比 +88%[1]；心理健康 App 市场 2025 年约 $82 亿、预测 CAGR 17.4%[14]；资本正密集投 AI 生活教练种子轮（如 Tomo $500 万、Bain Capital Ventures 领投）[26]。「生活事件 → 多维影响评估 → 循证心理学建议」的闭环产品没有像样的直接对标玩家（见 §3），私密、单人、本地优先是已被验证的付费卖点（Daylio 靠本地隐私做到约 $10 万/月[3]）。

### 1.2 赚不赚钱？——B2C 订阅能赚钱养活产品，但赢家通吃、大盘在萎缩

- 品类收入 top 10% 的 App 拿走 89% 的收入[1]；新订阅 App 首年收入 top 5% 为 $8,888，底部 25% 不超过 $19[18]。
- 头部在缩水：Calm 2025 年约 $2.1 亿、同比 -24%（2022 年峰值 $3.55 亿，估算）[7]；Headspace 2026 年 8 月被 Sword Health 以 $2–3 亿收购（2021 年合并估值 $30 亿）[8]；BetterHelp Q2 2026 收入 $2.126 亿、同比 -12%[25]。
- indie（独立开发者）路线有真实样板：Heptabase 约 $1.2M ARR、两年做到七位数收入（估算）[11][13]；Daylio 约 $10 万/月[3]；Bearable 约 $9 万/月（估算）[4]。

### 1.3 一句话定位

**值得做，前提是定位为高价值个人工具（$8–15/月、私密、循证），商业目标定在 $10K–$200K MRR（月经常性收入）的独立产品线，而不是 $100M 大生意。**

## 2. 市场：报告口径 vs 真实消费者支出（关键陷阱）

| 口径 | 数字 | 来源 |
|---|---|---|
| 心理健康 App（分析机构） | $82 亿（2025）→ $409 亿（2035），CAGR 17.4% | GMInsights[14] |
| AI companion（分析机构） | $368 亿（2025）→ $3180 亿（2033），CAGR 31% | Grand View Research[15] |
| 习惯追踪 App（分析机构） | $13.2 亿（2026）→ $47 亿（2035），CAGR 15.18% | 360ResearchReports[16] |
| **AI 陪伴 App 真实消费者支出** | **~$1.2 亿（2025 全年预计）**，337 个活跃 App | Appfigures via TechCrunch[1] |
| **Wellness App 真实消费者支出** | **$8.48 亿（2025），同比 -6.2%** | Business of Apps[5] |

同一细分市场不同机构口径相差可达一个数量级（习惯追踪类各家从 $2.8 亿到 $130 亿都有）[16]。**结论：别被 TAM 幻觉误导；真实可服务市场是「愿为自我提升订阅付费」的一小撮人，且 wellness 大盘 2025 年是负增长的。**

## 3. 竞品格局与空缺

| 品类 | 代表产品（定价） | 现状与信号 |
|---|---|---|
| 量化自我/生活记录 | Exist.io（$6.99/月）[2]、Gyroscope、Welltory | 只做记录 + 数据相关性，无方向评估/心理学干预；都很小（Exist 为该品类先驱仍属小生意）[2] |
| AI 陪伴/聊天 | Character.AI、Replika | 用时长巨大但变现差、法律风险高。Character.AI 2026-10 申请 Chapter 11 破产，迪士尼 $2000 万接盘 IP[9]；Replika 年收入估算约 $1400 万（2024）[10]。**娱乐陪伴 ≠ 教练** |
| 习惯/目标/生产力 | Daylio（约 $10 万/月[3]）、Bearable（约 $9 万/月[4]）、Habitica、Sunsama | 单点工具，无跨域整合 |
| 冥想/心理健康 | Calm（约 $2.1 亿、-24%）[7]、Headspace（约 $1.4 亿，被贱卖）[6][8]、BetterHelp（连续下滑）[25] | 内容库 + 治疗撮合，无个性化生活分析；行业收入 2025 年 -6.2%[5] |
| AI 生活教练（新兴） | Tomo（$500 万种子）[26] 等 | 2025–2026 密集种子轮，尚无跑通规模化变现者 |

**空缺与差异化：**
1. 「生活事件 → 五维影响评估 → 循证心理学建议」的闭环没有直接对标；
2. 私密、单人、无社交、本地优先是有付费验证的卖点[3]；
3. 五维模型（Time/Health/Wealth/Relationship/Purpose）无同构竞品——既是差异化，也意味着市场教育成本自负。

## 4. 变现经济学（决定赚钱概率的数字）

| 指标 | 基准 | 来源 |
|---|---|---|
| 下载→付费转化 | 12.11%（硬付费墙）vs 2.18%（freemium，35 天口径） | RevenueCat 2025[17] |
| 留存（品类死穴） | 健康健身类 D30 ≈ 3%[20]；全类中位 D1/D7/D30 = 25%/8%/4%[19] | UXCam / Fitness Refined |
| LTV/CAC（单位经济） | 目标 ≥3x，CAC 回本 1–3 个月 | 行业基准[21] |
| AI 推理成本 | 文本为主 $0.09–$2/DAU/月（重度语音最高 ~$18）[22]；功率用户约 $9.4/月（对照 $29 定价占 32%）[23] | Inworld / llmcosts |
| 定价带 | 同类 $6.99/月（Exist）[2] 至 $20+/月（生产力类）；建议 $8–15/月或 $60–100/年 | — |

- **留存必须按「周/月 Review 仪式」设计**（与 POC 的 Review 环节天然契合），每日打卡式设计基本死于 30 天[19][20]。
- $10–15/月定价下 AI 成本毛利健康，推理成本不是风险点[22][23]。
- 硬付费墙转化高但要求极强的首因价值；freemium 转化 2.18% 意味着免费层必须严格限流[17]。

## 5. 监管与隐私

- **FDA 2026 年 1 月更新 General Wellness 指南**：不做疾病诊断/治疗声称的低风险产品不按医疗器械监管[24]。产品必须守住「wellness / 自我反思」边界，绝不做抑郁焦虑诊断——这条决定合规成本一个数量级的差异。
- 个人生活数据 + 云 LLM 属敏感数据处理（个保法/GDPR）；隐私架构（本地优先、可导出、可删除）应直接做成卖点。
- Character.AI 的青少年安全诉讼是 AI 陪伴类责任边界的前车之鉴[9]；心理建议需保留人工确认与安全兜底（与既有「AI 候选须经用户确认」不变量一致）。

## 6. 风险清单

| # | 风险 | 依据 | 缓解方向 |
|---|---|---|---|
| R1 | 留存：D30 约 3% 是品类级死因 | [19][20] | Review 仪式化留存；月度回顾推送 |
| R2 | 赢家通吃：top 10% = 89% 收入 | [1] | 不买量、口碑 niche；避开大众健身赛道 |
| R3 | ChatGPT 免费替代 | 产品同质化常识 | 五维结构化数据 + 长期记忆 + 循证引用是护城河 |
| R4 | 心理建议责任边界 | Character.AI 诉讼[9] | 无诊断声称、用户确认门、危机资源兜底 |
| R5 | 中国 C 端订阅付费意愿弱于欧美 | 经验判断，未找到可靠定量数据 [unverified] | 双语并行、定价分层；立项后补调研 |

## 7. 建议与验证里程碑

1. **形态**：premium 独立产品，走 Heptabase 路线[11][13]（小团队、口碑、不烧钱买量；CAC 回本 1–3 个月基准下投放型增长不可行[21]）。
2. **验证里程碑（可核验）**：上线 12 个月内达成 **$3–5K MRR 且 D30 留存 >10%**（品类中位的 2–3 倍[19][20]）即算方向验证成功；达不到则触发定位复盘。
3. **产品侧立即可执行的结论**：留存设计以 Review 为核心（本报告 §4）；隐私（本地优先/可删除）升格为一级卖点；全程无诊断声称（§5）。

## 8. 待 Max 决策 / 未决项

| # | 决策点 | 选项 | 影响 |
|---|---|---|---|
| DQ-01 | 商业目标口径 | A. indie 线（$10K–$200K MRR）/ B. 风投线（需换打法） | 决定是否做增长预算与团队编制 |
| DQ-02 | 中国 vs 全球市场优先级 | 双语并行 / 先英文 / 先中文 | R5 缺定量数据，需立项后补付费意愿调研 |
| DQ-03 | 定价带 | $8–15/月 或 $60–100/年（本报告建议） | 决定付费墙策略（硬墙 vs freemium） |

---

## 附录 A：来源清单

[1] https://techcrunch.com/2025/08/12/ai-companion-apps-on-track-to-pull-in-120m-in-2025 — TechCrunch: AI companion apps $120M 2025（Appfigures 数据）
[2] https://exist.io — Exist.io 官网定价
[3] https://tasu.ai/library/daylio — Daylio teardown $100K/mo（估算）
[4] https://peekly.app/apps/5786f4a2-3f33-43e0-ae3f-114a5f240c4d — Bearable 收入估算（Peekly）
[5] https://businessofapps.com/data/wellness-app-market — Wellness apps 2025 $848M（-6.2%）
[6] https://www.businessofapps.com/data/headspace-statistics — Headspace 统计（估算）
[7] https://whobrands.com/companies/calm — Calm 收入估算
[8] https://appwinners.eu/guides/calm-vs-headspace-business-case-study — Calm vs Headspace（Sword Health 收购）
[9] https://cnbc.com/amp/2026/10/13/character-ai-chapter-11-disney-bid.html — Character.AI 破产
[10] https://whatsthebigdata.com/estimated-revenue-of-ai-girlfriend-apps-statistics — AI 陪伴应用收入估算
[11] https://getlatka.com/companies/heptabase.com — Heptabase 收入估算（Latka）
[13] https://www.indiehackers.com/post/tech/hitting-a-7-figure-arr-within-two-years-by-focusing-on-quality-and-letting-the-product-speak-for-itself-bHvRpjj7xxXs71R3TR4I — Heptabase 7-figure ARR
[14] https://gminsights.com/industry-analysis/mental-health-apps-market — 心理健康 App 市场规模
[15] https://www.grandviewresearch.com/industry-analysis/ai-companion-market-report — AI companion 市场规模
[16] https://360researchreports.com/market-reports/habit-tracking-app-market-211454 — 习惯追踪 App 市场规模
[17] https://www.rocketshiphq.com/revenuecat-state-of-subscription-apps-2025-summary — RevenueCat 2025 基准摘要
[18] https://revenuecat.com/pdf/state-of-subscription-apps-2025.pdf — RevenueCat State of Subscription Apps 2025
[19] https://uxcam.com/blog/mobile-app-retention-benchmarks — App 留存基准
[20] https://barchart.com/story/news/3807355/fitness-refined-releases-2026-report-on-why-fitness-app-users-quit — Fitness App 留存 3% D30
[21] https://gtmsauce.com/episodes/2024-12-23-using-subscription-app-benchmarks-to-make-better-growth — LTV/CAC 基准
[22] https://inworld.ai/resources/unit-economics-of-consumer-ai-apps — 消费 AI 应用单位经济
[23] https://llmcosts.dev/tools/llm-cost-per-customer-calculator — LLM 每客户成本
[24] https://www.fda.gov/regulatory-information/search-fda-guidance-documents/general-wellness-policy-low-risk-devices?source=govdelivery&type=click — FDA General Wellness 2026
[25] https://s21.q4cdn.com/672268105/files/doc_financials/2026/q2/TDOC-2Q-2026-Earnings-Press-Release.pdf — Teladoc/BetterHelp Q2 2026
[26] https://citybiz.co/article/866836/tomo-secures-5m-to-advance-ai-based-personal-coaching — Tomo $5M 融资

（编号沿用调研台账；[12] 为重复条目未引用。）

## 附录 B：数据口径与可信度说明

- **公司披露/财报**：[25]（Teladoc 财报 PDF）、[2][24]（官网/官方文件）。
- **第三方估算（误差 2–5 倍）**：[3][4][5][6][7][10][11][13][20] 及各聚合站；同指标跨源分歧时已并列呈现（如 Calm：whobrands 估算 $2.1 亿(2025) 与 Latka 估算 $5.96 亿(2024) 相差数倍，本文采用与 Business of Apps 口径一致的 $2.1 亿）。
- **行业基准报告**：[14][15][16][17][18][19][21][22][23]；引用时注明机构与年份。
- **未找到可靠定量数据**：中国 C 端订阅付费意愿（R5，标注 [unverified]）；Gyroscope / Welltory 营收。
- 本报告不构成投资建议；「赚不赚钱」判断基于 2025–2026 公开数据，市场变化快，建议 G3 阶段用真实用户数据替换全部估算口径。
