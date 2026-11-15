# 商业化验证设计 v0.2 — 付费墙 / 定价实验 / 留存埋点

- 日期：2026-11-15
- 版本历史：v0.1（2026-11-12，PR #15）→ **v0.2（2026-11-15，本版：关闭独立复核 12 条发现）**
- Owner：lifeospm（产品）｜修订参与：lifeospsych（证据与自主性）｜独立复核：lifeosreview（记录见 `docs/08-research/Commercialization-Validation-Independent-Review-v0.1.md`，结论 PASS_WITH_CHANGES）
- 状态：**Draft — 待 Max 批准**（以 PR 批准为准）；实施与 G3 实验启动仍须 Max 明示批准
- 依据：G2-Decision-003（DQ 全 A + 5 条定位修正）｜Market-Research-AI-Life-OS-v0.1（商业基准，引用格式「附录 A 来源 n」（避免与文末 Sources 编号混淆））｜evidence-based-psychology-design 规范｜独立复核记录 v0.1（整改对照表见附录 D）
- 范围：只做三件事——**付费墙形态、定价实验、留存埋点**。不含计费系统实施、不含 POC-01 改版。
- 红线继承：无诊断声称（wellness 边界）｜隐私优先（本地优先/可导出/可删除）｜AI 候选须用户确认｜不制造羞耻、焦虑、依赖。

---

## 1. 留存设计：周 Review 仪式（核心行为机制）

### 1.1 问题与观察（事实/推断分离）

- USER_REPORT：Max 要求留存设计不得是打卡式（G2-Decision-003 修正 ①「周/月 Review 仪式留存」）。
- OBSERVATION：品类数据——订阅 App 留存 D1/D7/D30 中位约 25%/8%/4%，健康类 D30 约 3%（Market-Research 附录 A 来源 19、20）。
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

### 1.4 候选机制对比（拒绝事后合理化；证据等级拆分标注到构件）

| 机制 | 理论 | 证据等级 | 预期效果 | 边界/风险 | 结论 |
|---|---|---|---|---|---|
| ① 周 Review 仪式 + 实施意向（「当 X 时刻，我就 Y」式计划） | Implementation Intentions [1] / 自我监控反馈 [2] | **构件级**：实施意向 A/B [1]；自我监控 A [2]；**仪式整体 Level E** | 意图→行动转化提升 | 用户可自由设/不设时间；不设不惩罚 | **推荐** |
| ② 每日打卡 / 连续天数 streak | 外在强化 | C/D | 短期打开率↑ | 羞耻、reactance、依赖；与自主性冲突；健康类 D30 基准弱（附录 A 来源 19、20） | **REJECT** |
| ③ 推送提醒序列 | 提示线索（COM-B 自动动机） | D | 中性偏正 | 通知负担，guardrail 监控 | 辅助手段，非机制 |
| ④ onboarding 价值时刻前置（首周密集引导「首次五维回顾」） | 首因价值（产品假设） | E | 缩短「首日价值不足」窗口 | 引导过密即骚扰 | **组合辅助**：与①互补（解决 §1.1 INFERENCE 的价值累积问题），不替代仪式 |
| ⑤ 生命周期邮件序列 / 社交问责（伙伴可见） | 社会促进 | — | — | 邮件=骚扰边界；社交对比直接违反红线（§1.6） | **REJECT（排除理由留档）** |

辅助证据：自我监控与反馈对目标进展有正向作用（Harkin et al. 2016 元分析 [2]；**效应量未核实，本设计不引用具体数字**）。

### 1.5 交互翻译

`周日晚（用户自选或默认建议）→ 温和提醒（可关，≤1 次/周）→ Review 页呈现五维回顾 + AI 候选 1–3 条 → 用户确认/修改/忽略 → 记录采纳结果 → 月度沉淀为「本月一句」→ 全程可跳过、可关闭提醒、可退出`

### 1.6 自主性与伤害审查（evidence-based-psychology-design 第 6 步）

- 羞耻：无「你这周失败了」类文案；跳过周 Review 不产生任何负面标记。✅ 验收约束
- 焦虑/比较：无排行、无他人对比、无分数定性。✅
- 依赖：AI 建议可编辑/可拒绝/可反转；不把「听 AI 的」作为完成定义。✅
- 过度解读：稀疏数据时 AI 措辞降级为「基于少量记录，仅供参考」。✅ 待 POC-01 改版吸收
- 隐私：Review 内容不出端统计（见 §4.3）。✅
- 临床边界：无诊断声称红线继承；危机语言触发协议另行审批。✅

### 1.7 Evidence Card（摘要，完整字段见附录 A）

verdict：**PASS_WITH_CHANGES（独立复核后整改）** —— 「忽略也是合法参与」「提醒默认可关且 ≤1 次/周」「guardrail 一票否决（§4.5）」均已写入验收。未解假设（真实完成率/负担感）只能由 G3 真实用户实验解决；lifeosreview 复核关闭后方可实施（OQ-04 流程）。

---

## 2. 付费墙形态

### 2.1 候选对比

| 形态 | 转化数据 | 适配性 | 风险 |
|---|---|---|---|
| 硬付费墙（先付费后使用） | 35 天转化 12.11% vs freemium 2.18%（Market-Research 附录 A 来源 17，RevenueCat State of Subscription Apps **2025**） | 差：本产品价值需累积 | 口碑受损（niche 靠口碑） |
| Freemium 无限流 | 转化低（同上） | 中 | 收入不可持续 |
| **反向试用 7 天 + Freemium 限流（推荐，已批 DQ-04）** | 无直接基准（**Level E 产品假设**） | 好：试用期覆盖「首次周 Review」价值时刻 | 需实验验证 |

### 2.2 推荐方案：反向试用 7 天 + 限流（DQ-04 已批：采纳，2026-11-12）

**付费墙原则（v0.2 修正，响应 High-2）：卖分析与生成深度，不卖核心闭环、不卖「看自己的数据」。**

- **Free（永远可用）**：Capture 无限、五维 1–5 评估、**目标完整闭环（创建/查看/更新，Active ≤3，与 Product Core 一致）**、周 Review 每周 1 次（AI 候选 ≤1 条）、**自身全部数据只读可见、导出/删除永远免费**。
- **Pro（$12/月 或 $80/年，DQ-05 已批）**：AI 候选完整（≤3 条）、RAG 引用深析、历史趋势分析视图（图表/洞察）、月度仪式（生成「本月一句」沉淀）。
- **新用户**：注册即得 7 天完整 Pro。依据收窄（v0.2 修正，响应 Medium-1）：「一注册即获全额权益」类比 Nunes & Drèze 的 artificial advancement（赠予进度）[3]，**类比迁移 Level D**；「试用进度条可视化」为 **Level E 产品假设**（其真实进度反馈成分可弱引 [2]，不以 [3] 作为该设计要点的 Level B 支撑）。
- **到期/降级语义逐项对照（v0.2 新增，响应 High-2）**：

| 功能 | 试用/Pro 期间 | 降级后 Free |
|---|---|---|
| Capture / 五维评估 / 目标（≤3）/ 周 Review | 完整 | **完整不变**（核心闭环） |
| AI 候选 | ≤3 条 | ≤1 条 |
| RAG 引用深析 | 可用 | 停用；已生成的分析结论保留只读可导出 |
| 历史趋势分析视图 | 可用 | Pro 分析视图停用；**底层数据全部只读可见可导出**（可自行查看原始记录/评估/回顾历史） |
| 月度仪式/本月一句 | 可生成 | 已生成保留只读可导出；不生成新的 |
| 导出/删除 | 免费 | **免费（永远）** |

### 2.3 暗黑模式边界（硬约束，写入验收）

❌ 假倒计时 ❌ 虚假原价划线（划线价必须是真实月付×12） ❌ 取消流程故意复杂化 ❌ 试用到期数据当人质 ❌ **功能人质（v0.2 新增，响应 High-2）：不得以既有数据或既有目标的可见性/可编辑性胁迫转化——读自己的数据永远免费** ❌ 羞耻/恐惧文案。违反任一条即拒绝发布。

### 2.4 试用到期链路正向约束（v0.2 新增，响应 Medium-5）

- 到期前 **≥48h** 一封中性说明通知（告知将降级与保留内容，非稀缺/非恐惧文案）。
- 降级后促销/催付触达 **14 天内 ≤1 次**，且文案不随时间增强（无倒计时升级）。
- 所有商业化通知**可一键关闭**，关闭后仅保留账户/安全类通知。
- 以上三条为验收标准，违反即拒绝发布。

---

## 3. 定价实验

- 既定区间（DQ-03 已批）：**$8–15/月 + $60–100/年**。已批档位（DQ-05，2026-11-12）：**$12/月，$80/年（≈$6.7/月，划线锚定 $144/年，真实价）**。锚定机制证据：Tversky & Kahneman 1974 [4]（等级 B，定价域迁移中等，属 **Level E 产品假设**需实验）。
- 小样本现实：indie 流量下 A/B 检验功效不足是常态（Market-Research 附录 A 来源 18）。因此**分阶段、单变量**：
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
| **feedback_submitted（v0.2 新增，响应 Low-3）** | 用户提交反馈 | guardrail 人工编码 | 事件元数据（有无/时间/渠道）不含文本；**反馈文本默认仅本地**；仅 opt-in 明示同意后可匿名上送（不含 ID）供人工编码，90 天删除，删除可传播（对齐 INV-12） |
| export_data / delete_account | 隐私操作 | 隐私承诺履约监控 | — |

### 4.2 指标定义（v0.2 修正，响应 Low-4、Medium-2、Medium-3）

- **D1/D7/D30 留存（双轨披露）**：
  - **completed 轨（判定用）**：窗口内出现 capture_created 或 review_completed——**里程碑判定用本轨**（与首要行为指标一致）。
  - **opened 轨（参考用）**：窗口内出现任一核心事件（含 review_opened）——仅作趋势参考，不作判定。
- **周 Review 完成率**：当周完成 review_completed 的活跃用户占比。
- **指标口径声明**：全部留存/转化指标以 **opt-in 上报队列**为口径；已知偏差方向——愿意上报者偏高参与，故留存/转化**可能被高估**，仅作内部趋势对比，不外推全量用户。
- **用户受益直接测量（v0.2 新增）**：4 题 5 点自报微量表（自主感 / 胜任感 / 负担 / 信任），每 4 周 in-app 一次。**非标准化量表，仅供内部趋势监控（Level E 管理工具），不作研究级结论**；如需研究级结论须引入标准化量表并另行伦理审查。

### 4.3 隐私约束（与「隐私一级卖点」一致，G2-Decision-003 修正 ②）

1. 所有事件匿名聚合，**绝不含生活事件内容、五维值、建议文本**（feedback 文本例外通道见 §4.1，opt-in + 90 天删除）。
2. 统计默认本地；上传聚合统计需 opt-in，可随时撤回。
3. 云 LLM 处理边界与产品统计边界分离：分析请求不复用为行为统计。
4. 导出/删除始终免费可用（§2.2）。
5. **对外口径声明（v0.2 新增，响应 Low-5）**：「本地优先」指**数据存储与产品统计**（事件内容不出端、统计默认本地）；**AI 分析经云 LLM 处理**（内容仅在请求处理范围内）。营销表述不得暗示「全部处理不出端」。
6. **OQ-03 决策硬约束（v0.2 新增，响应 Medium-3）**：任何第三方统计方案必须支持「本地默认 + opt-in + 可撤回 + 不含内容文本」，否则排除；OQ-03 在此约束内再决策。

### 4.4 阈值与出处（v0.2 修正，响应 High-1：逐项标注来源与 Level）

| 阈值 | 数值 | 出处 | Level 标注 |
|---|---|---|---|
| D30（里程碑） | >10% | G2-Decision-003 既定 | 管理目标（Level E 管理值），非外部基准 |
| 周 Review 完成率 | >30% | 内部设定 | **Level E 管理值（无外部来源）** |
| D1 / D7 引导线 | 40% / 20% | 内部设定 | **Level E 管理值** |
| 试用→付费 | 8% | 内部设定 | **Level E 管理值** |

### 4.5 实验判定与停止规则（v0.2 新增，响应 High-1：可客观判定）

- **成功判定（单臂阈值式）**：G3 首批（≥50 用户、≥8 周）达到 §4.4 全部阈值**且** guardrail 无恶化 →「达到验证里程碑」。
- **设计自认（如实声明）**：单臂设计、无对照组；结论只能为「达到/未达到阈值」，**不作机制因果归因**；如需机制归因须另行设计对照实验并自认功效限制（不与 §3「功效不足」自相矛盾）。
- **停止/失败规则（guardrail 一票否决，量化）**：出现任一情形即判定实验失败/停止，**即使 D30/完成率达标**：
  1. 含羞耻/负担主题的反馈 ≥5 条**且**占反馈总量 ≥20%（人工编码，opt-in 通道）；
  2. 周账号删除率 > 首月基线 2 倍；
  3. 任一隐私事件发生；
  4. 退款率 > 5%（连续 2 个自然月）。
- 阈值数字均为 **Level E 管理值**（无外部基准），可在 M6 复盘时调整一次并留痕。

---

## 5. 验证里程碑与判定（G2-Decision-003 对齐）

- 既定里程碑：**12 个月内 $3–5K MRR 且 D30 > 10%**（completed 轨）。
- M6 预警线（内部管理值）：D30 < 5% → 预警提前复盘。
- 失败判定：M12 达不到既定里程碑 → 触发定位复盘（G2-Decision-003 已定）。
- guardrail 恶化触发 §4.5 停止规则，与商业里程碑无关、优先执行。

---

## 6. 决策与未决项

| 编号 | 事项 | 状态 |
|---|---|---|
| DQ-04 | 付费墙形态采纳（反向试用+限流） | **已批：采纳推荐（2026-11-12 Max 批准）** |
| DQ-05 | 定价档位（$12/月 + $80/年，划线 $144 真实锚定） | **已批：采纳（2026-11-12 Max 批准）**，Phase 0 后可调 |
| OQ-03 | 埋点第三方 vs 自建 | 未决，但已锁定硬约束（§4.3 第 6 条） |
| OQ-04 | lifeosreview 独立复核 | 复核完成（PASS_WITH_CHANGES，12 条发现）；**整改关闭复核进行中** |

---

## 附录 A：Evidence Card（周 Review 仪式，v0.2 修订版）

```yaml
feature_name: 周 Review 仪式（留存核心机制）
problem:
  user_report: ["Max：留存不得打卡式，改为周/月 Review 仪式"]
  observations: ["品类 D30 中位 ~4%、健康类 ~3%（Market-Research 附录 A 来源 19、20）"]
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
    evidence_level: "构件级：实施意向 A/B [1]；自我监控 A [2]；仪式整体 Level E"
    expected_effect: 意图→行动转化提升
    boundary_conditions: 时间自选、提醒可关、跳过无惩罚
    transfer_distance: 中（行为干预→消费级订阅产品）
    sources: ["[1]", "[2]", "[6]"]
  - mechanism: onboarding 价值时刻前置（组合辅助）
    theory: 首因价值（产品假设）
    evidence_level: E
    expected_effect: 缩短首日价值窗口
    boundary_conditions: 引导过密即骚扰
    transfer_distance: 未验证
    sources: []
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
  primary_metric: 周 Review 完成率；D30 completed 轨（G2-Decision-003 >10%）
  secondary_metrics: review_action_taken 占比、试用→付费、4 题自报微量表（Level E 管理工具）
  guardrail_metrics: "一票否决（§4.5）：羞耻/负担反馈 ≥5 条且 ≥20%、周删除率 > 基线 2 倍、隐私事件、退款率 >5%×2 月"
  qualitative_questions: ["Review 让你感觉被推进还是被审判？", "提醒时机合适吗？"]
  metric_caveat: 全部指标 opt-in 队列口径，可能高估，不外推全量
experiment:
  hypothesis: "单臂阈值式：G3 首批达到 §4.4 全部阈值且 guardrail 无恶化（无对照组，不作因果归因）"
  minimum_test: G3 首批 ≥50 用户、≥8 周
  success_threshold: "D30(completed)>10%｜完成率>30%｜试用→付费 8%（全部 Level E 管理值，出处见 §4.4）"
  stop_conditions: "§4.5 四条量化规则，guardrail 一票否决"
verdict:
  status: PASS_WITH_CHANGES（整改后待 lifeosreview 复核关闭）
  confidence: 中
  required_changes: ["见附录 D 整改对照表（v0.2 已全部落改）"]
  unresolved_assumptions: ["真实完成率", "负担感", "付费转化"]
  next_owner: lifeosreview（复核关闭）→ Max 终审 → G3 真实用户验证
```

---

## 附录 B：心理学依据与来源

证据分级按 evidence-based-psychology-design 规范（A=系统综述/元分析 … E=未验证产品假设）。付费墙与定价形态均为 **Level E 产品假设**，只能通过 §3 实验验证；不以心理学术语包装商业选择。

- 实施意向：Gollwitzer & Sheeran 2006 元分析 [1]——等级 A/B（构件）；迁移距离：中。
- 自我监控与目标进展：Harkin et al. 2016，Psychological Bulletin [2]——等级 A（构件）；**效应量未核实，不引用具体数字**。
- 试用赠予进度类比：Nunes & Drèze 2006 [3]——**类比迁移 Level D**（该研究对象为 artificial advancement；「进度条」为 Level E 产品假设，v0.2 修正）。
- 锚定效应：Tversky & Kahneman 1974 [4]——等级 B（基础发现稳，定价域迁移中等）。
- 习惯形成时程：Lally et al. 2010 [5]——等级 B/C；结论仅取「数周至数月、个体差异大」。
- 行为诊断框架 COM-B/BCW：Michie et al. 2011 [6]——等级 A（框架），附原文摘录核验（台账）。

商业基准均引自 Market-Research-AI-Life-OS-v0.1 附录 A 来源清单编号，不在本文重复出处。

## Sources

[1] https://www.sciencedirect.com/science/chapter/bookseries/pii/S0065260106380021 — Gollwitzer & Sheeran 2006 — Implementation Intentions and Goal Achievement: A Meta-Analysis
[2] https://pubmed.ncbi.nlm.nih.gov/26479070 — Harkin et al. 2016 — Does Monitoring Goal Progress Promote Goal Attainment? A Meta-Analysis (Psychological Bulletin)
[3] https://www.jstor.org/stable/10.1086/500480 — Nunes & Drèze 2006 — The Endowed Progress Effect (Journal of Consumer Research)
[4] https://www.science.org/doi/10.1126/science.185.4157.1124 — Tversky & Kahneman 1974 — Judgment under Uncertainty: Heuristics and Biases (Science)
[5] https://onlinelibrary.wiley.com/doi/abs/10.1002/ejsp.674 — Lally et al. 2010 — How are habits formed (European Journal of Social Psychology)
[6] https://link.springer.com/article/10.1186/1748-5908-6-42 — Michie et al. 2011 — The Behaviour Change Wheel / COM-B (Implementation Science)

---

## 附录 D：整改对照表（独立复核 12 条发现 → v0.2 落点）

| 发现 | 级别 | v0.2 落点 | 关闭标准满足情况 |
|---|---|---|---|
| High-1 实验判定不可客观执行 | 阻断 | §4.4 阈值出处表 + §4.5 单臂判定/量化停止规则 + 附录 A experiment 重写 | ✅ ①单臂阈值式假设 ②逐项 Level 标注 ③stop 量化 + guardrail 一票否决 |
| High-2 目标入 Pro 触碰核心闭环 | 阻断 | §2.2 付费墙原则 + Free 含目标完整闭环 + 降级语义对照表 + §2.3 功能人质禁令 | ✅ ①Free 保留目标最小集（实际给了完整闭环）②读写语义逐项对照 ③禁令增补 |
| Medium-1 endowed progress 迁移过度 | 主要 | §2.2 依据收窄（Level D 类比迁移；进度条 Level E）+ 附录 B 第 3 条 | ✅ |
| Medium-2 缺用户受益测量 | 主要 | §4.2 4 题微量表（标注 Level E 管理工具）+ §4.5 可判定裁决规则 | ✅ |
| Medium-3 opt-in 口径偏差 / OQ-03 未锁定 | 主要 | §4.2 口径声明与偏差方向 + §4.3 第 6 条 OQ-03 硬约束 | ✅ |
| Medium-4 机制对比不全 / 等级标注过粗 | 主要 | §1.4 增补④⑤（含排除理由）+ 证据等级拆分标注到构件 + 附录 A 同步 | ✅ |
| Medium-5 试用到期链路无正向约束 | 主要 | §2.4 三条验收级约束 | ✅ |
| Low-1 RevenueCat 年份误标 | 次要 | §2.1 改 2025 | ✅ |
| Low-2 引用定位含糊 | 次要 | 全文统一「附录 A 来源 n」写法 | ✅ |
| Low-3 feedback 事件缺位 | 次要 | §4.1 feedback_submitted 行（本地默认/opt-in/90 天删除） | ✅ |
| Low-4 留存口径错位 | 次要 | §4.2 双轨披露，里程碑用 completed 轨 | ✅ |
| Low-5 本地优先口径未说明 | 次要 | §4.3 第 5 条对外口径声明 | ✅ |
