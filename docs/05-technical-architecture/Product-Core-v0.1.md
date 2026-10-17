# Product Core（产品内核）v0.1

- **项目**：AI Life OS
- **文档状态**：Draft — 待 Max 批准后成为 G2 内核基线
- **SDLC 阶段**：G2 Design / Architecture
- **产品批准人**：Max
- **作者**：Hermes（lifeospm 组织，lifeosdesign 会话协作）
- **日期**：2026-10-17
- **上游基线**：`docs/02-requirements/POC-01-Product-UX-Spec-v0.6.md`、`docs/04-data-ai/Capture-Data-AI-Output-Contract-v0.6.md`（均为 Approved G1 基线）
- **本次变更**：Max 选定「内核/皮肤分层 + 自用反馈喂内核」路线（2026-10-17）；本文件是该路线的执行落地

---

## 1. 这份文档是什么

**产品内核 = 与视觉风格无关的核心：数据结构 + 业务规则 + 逻辑主线。** 任何风格的界面都必须实现这份内核；换风格只换皮肤，永不改内核。Max 持续提炼的"产品核心逻辑和价值"就固化在这里，版本化、可追溯。

分层模型：

```text
┌───────────────────────────────────────┐
│ 皮肤层（Skin / 风格）                  │  视觉、布局、交互风格。可随时整体替换
│   三个 G2 原型 = 三张候选皮            │
├───────────────────────────────────────┤
│ 应用层（Flow / 流程编排）              │  四步闭环的状态流转与用例编排
├───────────────────────────────────────┤
│ 内核层（Core / 本文件）                │  数据结构 + 业务不变量 + 逻辑主线
│   永不随风格变化                       │
└───────────────────────────────────────┘
```

## 2. 价值主线（一句话）

**用最低摩擦记录真实的人生行为，AI 帮你结构化并诚实标注不确定，复盘只给证据支持的、零或一个可执行改变——你用每天 5 分钟经营自己的人生。**

价值支点（提炼自 Vision 与 v0.6 Spec）：

1. **可核验**：每条结论可回溯原文证据；无证据说"不知道"。
2. **可纠正**：AI 是候选不是权威，用户修订是一等公民且保留 AI 原值。
3. **不打扰**：不制造使用时长、不强塞建议、不打总分、不评判。

## 3. 逻辑主线（风格无关的四步闭环）

```text
Capture ──▶ AI 结构化 ──▶ 用户确认/纠正 ──▶ 五维视图/目标 ──▶ Review ──┐
   ▲                                                                   │
   └───────────── ONE BIG CHANGE（零或一）· 反馈回流 ◀─────────────────┘
```

流程状态机（各皮实现必须等价）：

1. **Capture**：保存原文 → `saved`；AI 处理 `processing`；失败 `failed`（原文仍在）。
2. **AI 结构化**：产出候选 ExtractedItem + 五维影响候选，全部 `proposed`，标 `needs_confirmation`。
3. **用户确认/纠正**：逐项 `confirmed | modified | rejected | 稍后(unresolved)`；修订入 UserRevision，双值并存。
4. **汇总与 Review**：仅 `confirmed | modified` 的非 `unknown` 影响进入长期分析；Review 按 statement_type 分标生成；建议零或一。

## 4. 核心数据结构（风格无关）

完整字段契约见 `Capture-Data-AI-Output-Contract-v0.6.md`（Approved），此处只固化内核骨架与语义：

```text
User ── Profile ── LifeDimension(固定五维)
  │                    time / health / wealth / relationship / purpose
  ├── Goal（Active 最多 3；可量化与否均可）
  ├── Capture（raw_text 永不覆盖）
  │     └── ExtractionRun（模型/提示词/Schema 版本可追溯）
  │           └── ExtractedItem（候选事实，item_type 8 类枚举）
  │                 ├── BehaviorDimensionImpact（五维影响候选）
  │                 └── UserRevision（confirm/modify/reject 双值历史）
  ├── Review ── ReviewStatement（6 类：事实/计算/推断/理论/建议/局限）
  │     ├── EvidenceReference（证据链，可回放原文）
  │     ├── TheoryReference（可核验学者引用 + 适用边界）
  │     └── Recommendation（零或一）
  └── Feedback（Review 反馈，含"本次不需要改变"）
```

关键语义（内核级，任何皮肤不得歪曲）：

- 每个有效行为逻辑上评估**全部五维**；方向（positive/negative/mixed/neutral/unknown）与 1–5 程度**独立记录**；五维**非零和**（不求和、不排名、不打总分）。
- `mixed` 正负程度分列，只可在同一行为/维度/时间窗/上下文版本内表达相对强弱。
- `epistemic_type` 区分用户事实 / 用户影响 / AI 推断 / 确定性计算；确认只改 status，不改 epistemic_type。
- 理论引用永远不压过个人事实。

## 5. 业务不变量（INV，实现验收的硬约束）

| 编号 | 不变量 | 来源 |
|---|---|---|
| INV-01 | 原始 Capture 文本永不被 AI 或修订覆盖；编辑产生新版本 | DP-002 |
| INV-02 | 计算与 Review 使用用户确认值优先于 AI 值；双值并存可追溯 | DP-003 |
| INV-03 | 无证据 = `unknown`；`neutral` 仅来自用户明示或批准规则；"原文没提"≠中性 | 3.8 约束 |
| INV-04 | 仅 `confirmed | modified` 的非 unknown 影响进入长期分析 | 3.8 约束 |
| INV-05 | 不可量化目标不输出伪精确进度 | 3.4 规则 |
| INV-06 | 每个 Review 的主建议为零或一个；"不需要改变"是一等选项 | 3.14 |
| INV-07 | 事实/计算/推断/理论/建议/局限必须分标呈现 | DP-004 |
| INV-08 | AI 处理可追溯：供应商、模型、Prompt 版本、Schema 版本 | DP-005 |
| INV-09 | 最少数据原则：不默认发送用户全部历史 | DP-006 |
| INV-10 | 数据归属 `user_id`，多账号数据不混合 | DP-001 |
| INV-11 | 批量接受不是默认路径；逐项确认为主路径 | UX 红线 |
| INV-12 | 删除可传播：删 Capture/账户时派生数据的删除/失效有定义 | DP-007 |

## 6. 内核/皮肤变更政策（怎么持续提炼核心）

| 改动类型 | 判定 | 流程 |
|---|---|---|
| 内核变更（数据结构/不变量/主线） | 方向类决策 | 决策包 → Max 批准 → 本文件升版本 |
| 皮肤变更（视觉/布局/文案） | 执行细节 | lifeosdesign 直接改，记 WORK-LOG，风格决定回写 Design Language |
| 应用层变更（流程编排） | 视影响定 | 影响不变量 → 决策包；否则 lifeosdev 实现 + lifeosqa 验收 |

**自用反馈回流规则**（"不管用哪种风格试用，最后都在优化同一个业务逻辑"）：

- 反馈 = "逻辑不对 / 规则要改 / 数据结构缺东西" → **内核变更通道**，这是 Max 提炼核心价值的主通道。
- 反馈 = "不好看 / 不好用 / 找不到" → **皮肤变更通道**。
- 判定不了归属 → lifeospm 判定并记录理由。

## 7. 与皮肤的关系（换风格成本约束）

- 皮肤只允许通过应用层定义的流程/数据接口取数与回写，不得自设业务规则（例如皮肤不得自创"总分"、不得把 unknown 渲染成 0）。
- 换皮肤 = 重新实现皮肤层 + 验收 INV-01～INV-12，内核与应用层不动。
- `docs/03-design/Design-Language-v0.1.md` 是皮肤层的样式来源；它与本文件的边界：**Design Language 管长什么样，Product Core 管是什么和为什么**。

## 8. 变更记录

| 日期 | 版本 | 变更 | 来源 |
|---|---|---|---|
| 2026-10-17 | v0.1 | 初建：内核/皮肤分层、价值与逻辑主线、数据结构骨架、12 条不变量、变更与反馈回流政策 | Max 路线选择 + v0.6 G1 基线 |
