# 商业化验证设计 v0.1 — 付费墙 / 定价实验 / 留存埋点

- 日期：2026-11-09
- Owner：lifeospm（产品）｜证据审查：lifeospsych（循证心理与行为设计规范 v0.1.0）｜独立复核：lifeosreview（待办，见 OQ-04）
- 状态：**Approved v0.1**（2026-11-09 Max 飞书批复「批准」，随 PR #15 合并）
- 依据：G2-Decision-003（DQ 全 A + 5 条定位修正）｜Market-Research-AI-Life-OS-v0.1（数据与基准）｜evidence-based-psychology-design 规范（证据分级 + 自主性审查）
- 范围：只做三件事——**付费墙形态、定价实验、留存埋点**。不含计费系统实施、不含 POC-01 改版（各自另行立项）。
- 红线继承：无诊断声称（wellness 边界）｜隐私优先（本地优先/可导出/可删除）｜AI 候选须用户确认｜不制造羞耻、焦虑、依赖（G2-Decision-003 §定位修正）。

---

## 1. 留存设计：周 Review 仪式（核心行为机制）

### 1.1 问题与观察（事实/推断分离）

- USER_REPORT：Max 要求留存设计不得是打卡式（G2-Decision-003 修正 ①「周/月 Review 仪式留存」）。
- OBSERVATION：品类数据——订阅 App 留存 D1/D7/D30 中位约 25%/8%/4%，健康类 D30 约 3%（Market-Research 附录 19/20）；打卡式习惯类产品普遍陷入 streak 压力与流失循环。
- INFERENCE：五维复盘产品价值需累积（记录→结构化→回顾），首日留不住人的原因可能是「尚未积累可回顾内容」而非「缺乏提醒」。
- UNKNOWN：真实用户对周 Review 的完成率、负担感——上线前无法得知，只能实验验证（Level E）。

### 1.2 目标行为（可观察、可判定）

> 用户每周至少完成一次周 Review：打开 Review → 浏览五维回顾内容 → 对 1–3 条 AI 候选逐条**确认 / 修改 / 忽略**（三选一即算参与，忽略也是合法参与）。

### 1.3 COM-B 简诊（Michie et al. 2011 [6]）

| 维度 | 评估 | 依据 |
|---|---|---|
| 能力·心理 | 回顾需反思与认知负荷，稀疏记录时收益低 | INFERENCE，待验证 |
| 机会·物理 | 需要固定时间窗（如周末）；产品可提供时间建议 | 设计假设 |
| 动机·反思 | 用户认同复盘价值但易被日常挤掉（意图-行动缺口） | 实施意向文献 [1] |
| 动机·自动 | 无既有触发线索，需建立仪式线索 | 习惯形成需数周至数月 [5] |

### 1.4 候选机制对比（拒绝事后合理化）

| 机制 | 理论 | 证据等级 | 预期效果 | 边界/风险 | 结论 |
|---|---|---|---|---|---|
| ① 周 Review 仪式 + 实施意向（「当 X 时刻，我就 Y」式计划） | Implementation Intentions 元分析 [1] | A/B（元分析，跨域迁移中等） | 意图→行动转化提升 | 用户可自由设/不设时间；不设不惩罚 | **推荐** |
| ② 每日打卡 / 连续天数 streak | 习惯强化（外在） | C/D | 短期打开率↑ | 羞耻、reactance、依赖；与 SDT 自主性冲突；健康类 D30 基准弱 [Market-Research 19/20] | **REJECT**（G2-Decision-003 明令） |
| ③ 推送提醒序列 | 提示线索（COM-B 自动动机） | D | 中性偏正 | 通知负担，guardrail 监控 | 辅助手段，非机制 |

辅助证据：自我监控与反馈对目标进展有正向作用（Harkin et al. 2016 元分析 [2]，Psychological Bulletin；具体效应量见原文，本设计不引用未核实的数字）。

### 1.5 交互翻译

`周日晚（用户自选或默认建议）→ 温和提醒（可关）→ Review 页呈现五维回顾 + AI 候选 1–3 条 → 用户确认/修改/忽略 → 记录采纳结果 → 月度沉淀为「本月一句」→ 全程可跳过、可关闭提醒、可退出`

### 1.6 自主性与伤害审查（evidence-based-psychology-design 第 6 步）

- 羞耻：无「你这周失败了」类文案；跳过周 Review 不产生任何负面标记。✅ 设计约束
- 焦虑/比较：无排行、无他人对比、无分数定性（Life Score 不做单一总分——Product Core 既定）。✅
- 依赖：AI 建议可编辑/可拒绝/可反转；不把「听 AI 的」作为完成定义。✅
- 过度解读：稀疏数据时 AI 措辞降级为「基于少量记录，仅供参考」。✅ 待 POC-01 改版吸收
- 隐私：Review 内容不出端统计（见 §3）。✅
- 临床边界：无诊断声称红线继承；危机语言触发协议另行审批（既有红线）。✅

### 1.7 Evidence Card（摘要，完整字段见附录 A）

verdict: **PASS_WITH_CHANGES** —— 变更要求：① 明文写入「忽略也是合法参与」；② 提醒默认可关且 ≤1 次/周；③ 上线须带 §4 guardrail 指标。未解假设（真实完成率/负担感）只能由 G3 真实用户实验解决；**创建者不自批**，需 lifeosreview 独立复核（OQ-04）。

---

## 2. 付费墙形态

### 2.1 候选对比

| 形态 | 转化数据 | 适配性 | 风险 |
|---|---|---|---|
| 硬付费墙（先付费后使用） | 35 天转化 12.11% vs freemium 2.18%（Market-Research 附录 17，RevenueCat 2026 基准） | 差：本产品价值需累积，首日不足以支撑硬墙 | 口碑受损（niche 定位靠口碑，G2-Decision-003 修正 ⑤） |
| Freemium 无限流 | 转化低（同上） | 中 | 收入不可持续 |
| **反向试用 7 天 + Freemium 限流（推荐）** | 无直接基准（Level E 产品假设） | 好：试用期覆盖「首次周 Review」价值时刻 | 需实验验证 |

### 2.2 推荐方案：反向试用 7 天 + 限流（DQ-04 待批）

- **Free（永远可用）**：Capture 无限、五维 1–5 评估、周 Review 每周 1 次（AI 候选 ≤1 条）、**数据导出/删除永远免费**（隐私承诺不进付费墙，属 INV 级约定）。
- **Pro（$12/月 或 $80/年）**：历史趋势与月度仪式、AI 候选完整（≤3 条）、RAG 引用深析、目标追踪、月度沉淀回顾。
- **新用户**：注册即得 7 天 Pro 试用（endowed progress 进度可视化 [3]，证据等级 B，跨产品迁移中等——试用进度条设计）。
- **到期**：温和降级为 Free（保留全部数据、无锁死、无倒计时恐吓、一封说明邮件即可）。

### 2.3 暗黑模式边界（硬约束，写入验收）

❌ 假倒计时 ❌ 虚假原价划线（划线价必须是真实月付×12） ❌ 取消流程故意复杂化 ❌ 试用到期数据当人质 ❌ 羞耻/恐惧文案。违反任一条即拒绝发布。

---

## 3. 定价实验

- 既定区间（DQ-03 已批）：**$8–15/月 + $60–100/年**。建议档位：**$12/月，$80/年（≈$6.7/月，划线锚定 $144/年，真实价）**。锚定机制证据：Tversky & Kahneman 1974 [4]（等级 B，定价域迁移中等，属产品假设需实验）。
- 小样本现实：indie 流量下 A/B 检验功效不足是常态（Market-Research 附录 18：新订阅 App 首年中位收入极低）。因此**分阶段、单变量**：
  - **Phase 0（上线前）**：Van Westendorp 价格敏感度 4 问（waitlist/落地页），目标 N≥100，只定方向不定精确值。
  - **Phase 1（上线后 1–3 月）**：展示结构单变量测试——「年付锚定展示」对「仅月付展示」，指标：付费转化率、年付占比。
  - **Phase 2（有量后）**：$8/$12/$15 价格点序贯对比；样本不足时明确标注「观察性对比，不作因果结论」。
- 指标：曝光→付费转化、ARPU、退款率、试用→付费转化、年付占比。

---

## 4. 留存埋点

### 4.1 事件表（名称 / 触发 / 用途 / 隐私级别）

| 事件 | 触发 | 用途 | 隐私 |
|---|---|---|---|
| app_open | 打开 App | D1/D7/D30 | 仅匿名 ID + 时间 |
| capture_created | 提交一条记录 | 核心行为频次 | **不含内容文本** |
| ai_struct_confirmed / ai_struct_edited | 确认/修改 AI 结构化 | AI 质量 + 参与度 | 不含字段值 |
| five_dim_viewed | 打开五维视图 | 核心闭环完成 | — |
| review_opened / review_completed / review_action_taken | 周 Review 流程 | **首要行为指标** | 不含建议内容 |
| goal_created / goal_updated | 目标操作（≤3） | 目标功能健康度 | 不含目标内容 |
| paywall_viewed / trial_started / trial_converted / subscription_* | 商业化流程 | §3 指标 | — |
| export_data / delete_account | 隐私操作 | 隐私承诺履约监控 | — |

### 4.2 指标定义

- **D1/D7/D30 留存**：对应窗口内出现任一核心事件（capture_created / review_opened）。
- **周 Review 完成率**：当周完成 review_completed 的活跃用户占比。
- guardrail（伤害监控，engagement 不等于受益）：退款率、提醒关闭率、卸载/删除激增、用户反馈中的负担/羞耻词、隐私事件数。

### 4.3 隐私约束（与「隐私一级卖点」一致，G2-Decision-003 修正 ②）

1. 所有事件匿名聚合，**绝不含生活事件内容、五维值、建议文本**。
2. 统计默认本地；上传聚合统计需 opt-in，可随时撤回。
3. 云 LLM 处理边界与产品统计边界分离：分析请求不复用为行为统计。
4. 导出/删除始终免费可用（§2.2）。

### 4.4 阈值对照（G2-Decision-003）

- 既定里程碑：**12 个月内 $3–5K MRR 且 D30 > 10%**（品类中位 2–3 倍，属进取目标）。
- 内部引导线（管理目标，非外部基准，Level E）：D1 40% / D7 20% / 试用→付费 8%。
- 失败判定：M12 达不到既定里程碑 → 触发定位复盘（G2-Decision-003 已定）；M6 时若 D30 < 5% 预警提前复盘。

---

## 5. 未决项（待 Max）

| 编号 | 事项 | 建议 |
|---|---|---|
| DQ-04 | 付费墙形态采纳（§2.2 反向试用+限流） | **已批：采纳推荐（2026-11-09 Max 批准）** |
| DQ-05 | 定价档位（$12/月 + $80/年，划线 $144 真实锚定） | **已批：采纳（2026-11-09 Max 批准）**，Phase 0 后可调 |
| OQ-03 | 埋点走第三方统计 vs 自建聚合 | 倾向自建聚合（隐私卖点一致性），成本待评估 |
| OQ-04 | lifeosreview 独立复核本设计（证据规范要求创建者不自批） | 在 POC-01 改版前完成 |

---

## 附录 A：Evidence Card（周 Review 仪式）

```yaml
feature_name: 周 Review 仪式（留存核心机制）
problem:
  user_report: ["Max：留存不得打卡式，改为周/月 Review 仪式"]
  observations: ["品类 D30 中位 ~4%、健康类 ~3%（Market-Research 附录 19/20）"]
  inferences: ["留存瓶颈可能是价值累积节奏与意图-行动缺口，而非提醒不足"]
  unknowns: ["真实用户 Review 完成率、负担感"]
target_behavior:
  actor: 已注册用户
  context: 每周自选固定时间（默认建议周日晚）
  action: 打开 Review→浏览五维→对 1–3 条 AI 候选确认/修改/忽略
  frequency: 每周 1 次
  completion_definition: review_completed 事件（忽略也算合法参与）
behavior_diagnosis:
  capability: {psychological: 反思负荷高、稀疏记录收益低（中置信）}
  opportunity: {physical: 需时间窗，产品可建议（中置信）}
  motivation: {reflective: 认同价值但易被挤掉（高置信），automatic: 无线索（中置信）}
  confidence: 中（全部待真实用户校验）
candidate_mechanisms:
  - mechanism: 实施意向 + 自我监控反馈
    theory: Implementation Intentions [1] / 自我监控 [2] / COM-B [6]
    evidence_level: A/B
    expected_effect: 意图→行动转化提升
    boundary_conditions: 时间自选、提醒可关、跳过无惩罚
    transfer_distance: 中（行为干预→消费级订阅产品）
    sources: ["[1]", "[2]", "[6]"]
  - mechanism: 每日打卡/连续天数
    theory: 外在强化
    evidence_level: C/D
    expected_effect: 短期打开率↑
    boundary_conditions: 与自主性冲突、羞耻风险
    transfer_distance: 低（健康类基准弱）
    sources: ["Market-Research 附录 19/20"]
recommended_interaction:
  trigger: 用户自选时间的温和提醒（≤1 次/周，可关）
  user_choice: 确认/修改/忽略三选一，可整体跳过
  ai_response: 候选 ≤3 条（Free ≤1 条），可编辑可拒绝
  feedback: 记录采纳结果；月度沉淀「本月一句」
  adjustment: 提醒频率与时间用户可调
  exit_option: 关闭提醒/退出 Review 不产生负面标记
autonomy_review:
  meaningful_choice: 是（三选一 + 可跳过）
  ai_overreach: 无（候选须确认才进入长期分析）
  coercive_elements: 无（无 streak、无排名、无惩罚）
risk_review:
  shame: 无负面文案（验收约束）
  anxiety: 无对比无排行
  dependency: 不把「听 AI 的」作为完成定义
  overinterpretation: 稀疏数据措辞降级
  privacy: 事件不含内容（§4.3）
  clinical: 无诊断声称；危机协议另行审批
  accessibility_and_equity: 文案可读性与色弱适配入验收
measurement:
  primary_metric: 周 Review 完成率；D30（G2-Decision-003 阈值 >10%）
  secondary_metrics: review_action_taken 占比、试用→付费
  guardrail_metrics: 退款率、提醒关闭率、卸载/删除激增、负担/羞耻反馈、隐私事件
  qualitative_questions: ["Review 让你感觉被推进还是被审判？", "提醒时机合适吗？"]
experiment:
  hypothesis: 仪式化 Review 的 D30 高于无仪式对照
  minimum_test: G3 首批 ≥50 用户、≥8 周
  success_threshold: D30>10% 且完成率>30% 且 guardrail 无恶化
  stop_conditions: 羞耻/负担反馈集中出现；隐私事件
verdict:
  status: PASS_WITH_CHANGES
  confidence: 中
  required_changes: ["忽略也是合法参与写入验收", "提醒默认可关", "guardrail 必须随发布采集"]
  unresolved_assumptions: ["真实完成率", "负担感", "付费转化"]
  next_owner: lifeosreview（独立复核，OQ-04）→ G3 真实用户验证
```

---

## 附录 B：心理学依据与来源

证据分级按 evidence-based-psychology-design 规范（A=系统综述/元分析 … E=未验证产品假设）。本设计的付费墙与定价形态均为 **Level E 产品假设**，只能通过 §3 实验验证；不以心理学术语包装商业选择。

- 实施意向：Gollwitzer & Sheeran 2006 元分析 [1]——等级 A/B；迁移距离：中。
- 自我监控与目标进展：Harkin et al. 2016，Psychological Bulletin [2]——等级 A；**效应量未核实，本设计不引用具体数字**。
- 试用进度与 endowed progress：Nunes & Drèze 2006 [3]——等级 B；迁移距离：中。
- 锚定效应：Tversky & Kahneman 1974 [4]——等级 B（基础发现稳，定价域迁移中等）。
- 习惯形成时程：Lally et al. 2010 [5]——等级 B/C；结论仅取「数周至数月、个体差异大」。
- 行为诊断框架 COM-B/BCW：Michie et al. 2011 [6]——等级 A（框架），已附原文摘录核验。

商业基准（转化、留存、收入分布）均引自 Market-Research-AI-Life-OS-v0.1 附录编号，不在本文重复出处。

## Sources

[1] https://www.sciencedirect.com/science/chapter/bookseries/pii/S0065260106380021 — Gollwitzer & Sheeran 2006 — Implementation Intentions and Goal Achievement: A Meta-Analysis
[2] https://pubmed.ncbi.nlm.nih.gov/26479070 — Harkin et al. 2016 — Does Monitoring Goal Progress Promote Goal Attainment? A Meta-Analysis (Psychological Bulletin)
[3] https://www.jstor.org/stable/10.1086/500480 — Nunes & Drèze 2006 — The Endowed Progress Effect (Journal of Consumer Research)
[4] https://www.science.org/doi/10.1126/science.185.4157.1124 — Tversky & Kahneman 1974 — Judgment under Uncertainty: Heuristics and Biases (Science)
[5] https://onlinelibrary.wiley.com/doi/abs/10.1002/ejsp.674 — Lally et al. 2010 — How are habits formed (European Journal of Social Psychology)
[6] https://link.springer.com/article/10.1186/1748-5908-6-42 — Michie et al. 2011 — The Behaviour Change Wheel / COM-B (Implementation Science)
