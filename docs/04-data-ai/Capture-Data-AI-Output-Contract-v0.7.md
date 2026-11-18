# Capture Data + AI Output Contract v0.7

- **项目**：AI Life OS
- **文档状态**：Approved — v0.7 需求基线（Max 2026-11-17 飞书批复「批准」，PR #29）；v0.6 转为历史基线（`G1-baseline`）
- **SDLC 阶段**：G1/G2 Requirements & Design
- **产品批准人**：Max
- **作者**：Hermes
- **日期**：2026-11-17（v0.7）；v0.6 原稿 2026-09-15
- **关联需求**：`POC-01-Product-UX-Spec-v0.7.md`
- **关联决策**：`G1-Decision-004-Five-Dimension-Impact-Rules-v0.1.md`、`G1-Decision-005-Mixed-Impact-Degrees-v0.1.md`
- **实现状态**：部分实现（PR #20/#22/#25）；本文是逻辑契约，不是代码或数据库迁移

- **本次变更（v0.7）**：变更清单 1–8（Max 2026-11-17 批准）：新增 DP-008 统计埋点最小化（DQ-006）、DP-009 核心闭环不可锁（DQ-04/05）、§9 埋点管道边界、§14 自适应 Review 数据契约固化。v0.6 变更史：[Decision 006](../09-decisions/G1-Decision-006-Adaptive-Review-v0.1.md)；[Delta Review](../08-research/G1-v0.6-Adaptive-Review-Delta-v0.1.md)
- **编码授权**：未授权；G1 未整体批准；作者不得自批。

---

## 1. 目的

本文定义 Capture 从原始输入、AI 提取、用户修订到 Review 证据的逻辑数据契约，并规定 AI 如何区分事实、推测、理论引用和建议。

目标是保证：

1. 原始记录不丢失、不被 AI 覆盖。
2. AI 结果可以核验、纠正和回放。
3. 确定性计算与生成式解释分离。
4. 每条 Review 事实能回到个人证据。
5. 多个独立用户的数据不会混合。
6. 理论引用可以核验且不压过个人事实。

## 2. 核心数据原则

### DP-001：用户所有权

每个用户数据对象必须归属于明确 `user_id`。任何读取、修改、导出、删除和 AI 上下文构建都必须先限定当前用户。

### DP-002：原始数据不可覆盖

Capture 原始文本独立保存。AI 提取、用户修订和后续重新分析均创建独立版本或记录，不修改原始文本。

### DP-003：用户确认优先

同一字段存在 AI 值和用户确认值时，计算和 Review 优先使用用户确认值。

### DP-004：事实与生成内容分离

结构化事实、确定性计算、AI 推测、理论引用和建议使用不同类型保存和展示。

### DP-005：版本可追溯

每次 AI 处理至少记录：模型供应商、模型标识、Prompt 版本、Schema 版本、处理时间和状态。

### DP-006：最少数据原则

只向云端模型发送完成当前任务所需的数据。不得默认发送用户全部历史。

### DP-007：删除可传播

用户删除 Capture 或账户时，需要定义其派生提取、Review 证据和缓存如何删除或失效。

### DP-008：统计与埋点最小化（v0.7 新增，DQ-006）

产品分析事件为匿名聚合（匿名 ID + 事件名 + 时间 + 必要元数据），**绝不含内容文本**；统计默认仅本地保存；上传聚合统计必须独立 opt-in、可随时撤回；opt-in 率与撤回率单列管理；不接入第三方分析 SDK，不建跨用户画像。

### DP-009：核心闭环不可锁（v0.7 新增）

读自己的数据、导出、删除、Capture/Confirm/Review/0–3 目标核心闭环永归 Free；付费只增益、不减损（「功能人质」禁令）。功能分级配置必须可被守卫测试校验。

## 3. 概念数据模型

```text
User
├── Profile
├── LifeDimension（固定五维）
├── Goal
├── Capture
│   ├── ExtractionRun
│   │   └── ExtractedItem
│   │       ├── BehaviorDimensionImpact
│   │       └── UserRevision
│   └── EvidenceReference
├── Review
│   ├── ReviewStatement
│   ├── TheoryReference
│   └── Recommendation
└── Feedback
```

### 3.1 User

代表独立私密账号和数据所有者。

最小逻辑字段：

- `id`
- `status`
- `created_at`
- `deleted_at`

身份认证方式在 G2 技术设计中决定。POC 即使只开放给 Max，也不得在业务数据中省略所有者概念。

### 3.2 Profile

- `user_id`
- `display_name`
- `timezone`
- `locale`
- `ai_processing_consent`
- `created_at`
- `updated_at`

时区影响“今天、昨晚、本周”等时间表达的解析。

### 3.3 LifeDimension

固定提供五条受控维度定义：

- `time`：Time（时间）
- `health`：Health（健康）
- `wealth`：Wealth（财富）
- `relationship`：Relationship（关系）
- `purpose`：Purpose（目的/意义）

逻辑字段：

- `id`
- `code`
- `name_zh`
- `name_en`
- `definition`
- `sort_order`
- `schema_version`

LifeDimension 是产品固定顶层模型。用户对维度的 Blueprint 内容应保存在用户专属的 Profile/Blueprint 记录中，而不是修改全局维度定义。

### 3.4 Goal

- `id`
- `user_id`
- `life_dimension_ids`
- `title`
- `why`
- `status`: `active | paused | completed | archived`
- `metric_definition`（可空）
- `current_value`（可空）
- `target_value`（可空）
- `unit`（可空）
- `start_date`（可空）
- `target_date`（可空）
- `created_at`
- `updated_at`

业务规则：Active 核心目标最多三个；不可量化目标允许存在，但不输出伪精确进度。

### 3.5 Capture

- `id`
- `user_id`
- `raw_text`
- `occurred_at_hint`（用户可选）
- `timezone`
- `source`: POC 固定为 `text`
- `status`: `saved | processing | needs_confirmation | confirmed | failed | deleted`
- `created_at`
- `updated_at`
- `deleted_at`

规则：

- `raw_text` 保存后不得被 ExtractionRun 覆盖。
- 若用户主动编辑原始文本，应创建新 Capture 或显式的新版本，不能无痕修改。
- AI 处理失败时状态为 `failed`，但 Capture 仍存在。

### 3.6 ExtractionRun

代表某个模型对某条 Capture 的一次处理。

- `id`
- `user_id`
- `capture_id`
- `provider`
- `model_id`
- `prompt_version`
- `schema_version`
- `status`: `queued | running | succeeded | failed`
- `raw_model_response`（受限存储；是否保存全文待隐私评审）
- `error_category`（可空）
- `started_at`
- `completed_at`

重新分析创建新的 ExtractionRun，不覆盖旧 Run。

### 3.7 ExtractedItem

代表 AI 从 Capture 中提取的一条候选结构化内容。

- `id`
- `user_id`
- `capture_id`
- `extraction_run_id`
- `item_type`
- `life_dimension_ids`
- `goal_ids`
- `occurred_at`
- `metric_type`
- `value`
- `unit`
- `qualitative_state`
- `sentiment`
- `energy_level`
- `status`
- `confidence`
- `needs_confirmation`
- `epistemic_type`: `user_reported_fact | user_reported_impact | ai_inferred_impact | deterministic_calculation`
- `evidence_span`
- `evidence_start` / `evidence_end`（如技术实现可稳定提供）
- `ai_notes`

#### `item_type` 初始枚举

- `activity`：做了什么
- `metric_observation`：可测量事实
- `goal_progress_event`：与目标进展有关的事件
- `state_observation`：精力、情绪、主观状态
- `constraint`：障碍、负担或限制
- `achievement`：完成或成果
- `plan`：未来意图；不得当作已发生事实
- `unknown`：无法可靠分类

#### `status` 初始枚举

- `proposed`
- `confirmed`
- `modified`
- `rejected`
- `unresolved`

### 3.8 BehaviorDimensionImpact

表示一个已提取行为/事件对一个 LifeDimension 的影响候选。每个有效行为逻辑上评估全部五维；无证据的维度保存为 `unknown`，有证据表明没有明显影响时才保存为 `neutral`。

- `id`
- `user_id`
- `extracted_item_id`
- `life_dimension_id`
- `direction`: `positive | negative | mixed | neutral | unknown`
- `degree`（可空整数；`positive | negative` 且依据充分时为 1–5；其他方向为空）
- `positive_degree`（可空整数；仅 `mixed` 使用，依据充分时为 1–5）
- `negative_degree`（可空整数；仅 `mixed` 使用，依据充分时为 1–5）
- `rationale`
- `evidence_span`
- `positive_evidence_span`（`mixed` 正向方向依据；`mixed` 时必填，不因 `positive_degree = null` 而省略）
- `negative_evidence_span`（`mixed` 负向方向依据；`mixed` 时必填，不因 `negative_degree = null` 而省略）
- `positive_rationale`（`mixed` 正向理由）
- `negative_rationale`（`mixed` 负向理由）
- `positive_confidence`（`mixed` 正向置信度）
- `negative_confidence`（`mixed` 负向置信度）
- `positive_status`: `proposed | confirmed | modified | rejected`
- `negative_status`: `proposed | confirmed | modified | rejected`
- `assessment_window_start`
- `assessment_window_end`
- `blueprint_version_id`（可空；未建立 Blueprint 时为空）
- `goal_context_version_ids`（可为空数组）
- `scale_anchor_version`
- `confidence`
- `status`: `proposed | confirmed | modified | rejected | unknown`
- `source`: `user | ai | rule`
- `epistemic_type`: `user_reported_fact | user_reported_impact | ai_inferred_impact | deterministic_calculation`
- `neutral_evidence_source`（`neutral` 时必填）：`explicit_user_statement | approved_rule`
- `created_at`
- `updated_at`

约束：

- POC-01 使用固定的 `degree` 1–5 离散量表，不允许用户自定义；本版本不定义 `proportion` 字段。
- 1–5 是相对于当前用户 Blueprint、目标和评估时间窗的有序主观影响估计，不是客观测量值；`1` 很弱、`2` 较弱、`3` 中等、`4` 较强、`5` 很强。
- `direction = unknown | neutral` 时三个程度字段必须为空；`positive | negative` 使用 `degree`，两个 mixed 专用字段为空。方向有依据但程度依据不足时允许对应程度为 `null` 并标记待确认。
- `direction = mixed` 时 `degree = null`，分别使用 `positive_degree` 与 `negative_degree`；正负方向必须始终分别有证据、理由、置信度和状态。程度证据不足时对应 degree 可为 `null`，但支持该侧方向成立的证据仍必填。
- 五维程度独立判断，不要求合计为固定总数，因为多维影响不是零和分配。
- `unknown` 与 `neutral` 必须区分：前者表示无足够信息，后者表示有证据支持没有显著影响。
- `neutral` 仅允许来自用户明确陈述或经批准的确定性规则；AI 不得把“原文没有提到”解释为中性。
- AI 候选在用户确认前不得作为长期确定事实。
- 只有 `confirmed | modified` 的非 `unknown` 影响可进入长期趋势、维度状态及 Review 事实；`proposed | rejected` 不得参与。
- `unknown` 可作为数据局限保留，不要求用户确认成非未知值。
- 用户确认只改变 `status`，不得改变 `epistemic_type`；`ai_inferred_impact` 经确认后仍是“用户认可的 AI 推断”，不是直接观察或已证实因果关系。
- 程度不得跨维度比较、平均、排名、求差或单独用于生成趋势；趋势必须基于经批准的同维度、同语义、同时间窗规则。
- `mixed` 的两个程度只可在同一行为、同一维度、同一评估时间窗和相同 Blueprint/Goal/量表锚点版本内表达相对强弱；不得相减、相除、净额化、转成百分比或压缩为单一总体强度。跨行为、跨维度、跨时间窗或上下文版本变化后不得直接比较。
- 只清空某侧程度表示程度未知，不否定该侧方向，`direction` 仍可为 `mixed`。拒绝某一侧方向时，有效方向转为另一侧的 `positive` 或 `negative`，并将该侧有效程度转入 `degree`；两侧均拒绝时整项状态为 `rejected`，不得进入长期分析。原始 mixed 候选与每次转换保留在 UserRevision 历史中。

### 3.9 UserRevision

- `id`
- `user_id`
- `extracted_item_id`
- `field_name`
- `original_ai_value`
- `revised_value`
- `action`: `confirm | modify | reject`
- `reason`（可空）
- `resulting_direction`（方向转换时必填）
- `created_at`

计算使用有效确认版本，而不是直接使用最新 AI 输出。

### 3.10 Review

- `id`
- `user_id`
- `period_start`
- `period_end`
- `timezone`
- `status`: `draft | generated | reviewed | accepted | superseded`
- `generator_version`
- `created_at`

### 3.11 ReviewStatement

Review 不保存为一个不可分解的长文本；至少在逻辑上拆分为：

- `id`
- `review_id`
- `user_id`
- `statement_type`
- `text`
- `confidence`
- `evidence_reference_ids`
- `theory_reference_ids`
- `display_order`

`statement_type`：

- `personal_fact`
- `deterministic_result`
- `inference`
- `theory_context`
- `recommendation`
- `data_limitation`

### 3.12 EvidenceReference

- `id`
- `user_id`
- `source_type`: `capture | extracted_item | goal | calculation | review`
- `source_id`
- `quote_or_summary`
- `occurred_at`
- `field_path`（可空）
- `calculation_version`（计算结果时）

### 3.13 TheoryReference

- `id`
- `source_type`: `book | paper | trusted_web | curated_note`
- `author_or_scholar`
- `theory_name`
- `title`
- `publisher_or_journal`
- `publication_date`
- `locator`: 章节、页码、DOI 或 URL
- `quoted_text`（合法且必要的短引用，可空）
- `paraphrase`
- `evidence_strength`
- `limitations`
- `verified_at`

理论引用不属于某个用户的个人事实，但用户 Review 对它的使用必须可追溯。

### 3.14 Recommendation

- `id`
- `review_id`
- `user_id`
- `text`
- `rationale`
- `supporting_statement_ids`
- `status`: `proposed | accepted | modified | rejected`
- `user_modified_text`（可空）

每个 Review 允许零个或一个主 Recommendation；无意愿或无需改变时不生成建议。

## 4. Capture AI 输出契约

### 4.1 输入边界

AI 可接收：

- 当前 Capture 原始文本
- 用户时区和当前日期
- 固定五大 Life Dimension 的代码和定义
- 最多三个 Active Goal 的必要字段
- 经批准的 Schema 和行为说明

默认不得接收：

- 用户全部历史 Capture
- 其他用户任何数据
- 与当前提取无关的敏感资料
- 未经批准的外部文档内容

### 4.2 逻辑输出示例

用户输入：

> 昨晚为了赶完一个项目工作到两点，今天特别累，不过收到了 500 元项目款。

同一 Capture 至少包含“工作到两点”“次日疲劳”和“收到项目款”三个事件。示例为控制长度展示前两个；真实输出必须分别建立 ExtractedItem，不能把收入的 Wealth 影响归到熬夜行为上。

建议输出（节选）：

```json
{
  "schema_version": "capture-extraction-v0.5",
  "capture_language": "zh-CN",
  "items": [
    {
      "item_type": "activity",
      "occurred_at": "根据用户时区解析的昨晚",
      "metric_type": "project_work_late",
      "goal_links": [],
      "confidence": "high",
      "needs_confirmation": true,
      "epistemic_type": "user_reported_fact",
      "evidence_span": "昨晚为了赶完一个项目工作到两点",
      "dimension_impacts": [
        {
          "dimension": "time",
          "direction": "negative",
          "degree": null,
          "confidence": "medium",
          "epistemic_type": "ai_inferred_impact",
          "evidence_span": "工作到两点",
          "rationale": "候选解释：可能消耗夜间可支配或休息时间，程度需用户判断"
        },
        {
          "dimension": "health",
          "direction": "negative",
          "degree": null,
          "confidence": "medium",
          "epistemic_type": "ai_inferred_impact",
          "evidence_span": "工作到两点，今天特别累",
          "rationale": "候选解释：晚睡与次日疲劳同时出现，但不声称已证实因果"
        },
        {
          "dimension": "wealth",
          "direction": "unknown",
          "degree": null,
          "confidence": "high",
          "epistemic_type": "ai_inferred_impact",
          "evidence_span": null,
          "rationale": "该熬夜行为本身没有独立的财富影响证据"
        },
        {
          "dimension": "relationship",
          "direction": "unknown",
          "degree": null,
          "confidence": "high",
          "epistemic_type": "ai_inferred_impact",
          "evidence_span": null,
          "rationale": "原文没有关系影响证据"
        },
        {
          "dimension": "purpose",
          "direction": "unknown",
          "degree": null,
          "confidence": "high",
          "epistemic_type": "ai_inferred_impact",
          "evidence_span": null,
          "rationale": "未提供项目与用户目标或意义的关系"
        }
      ]
    },
    {
      "item_type": "metric_observation",
      "occurred_at": "根据用户时区解析的今天",
      "metric_type": "income_received",
      "value": 500,
      "unit": "CNY",
      "goal_links": [],
      "confidence": "high",
      "needs_confirmation": true,
      "epistemic_type": "user_reported_fact",
      "evidence_span": "收到了 500 元项目款",
      "dimension_impacts": [
        {
          "dimension": "wealth",
          "direction": "positive",
          "degree": null,
          "confidence": "high",
          "epistemic_type": "ai_inferred_impact",
          "evidence_span": "收到了 500 元项目款",
          "rationale": "候选解释：已记录收入通常支持财富维度，具体程度需结合用户基线确认"
        },
        {
          "dimension": "time",
          "direction": "unknown",
          "degree": null,
          "confidence": "high",
          "epistemic_type": "ai_inferred_impact",
          "evidence_span": null,
          "rationale": "收入事件本身没有时间影响证据"
        },
        {
          "dimension": "health",
          "direction": "unknown",
          "degree": null,
          "confidence": "high",
          "epistemic_type": "ai_inferred_impact",
          "evidence_span": null,
          "rationale": "收入事件本身没有健康影响证据"
        },
        {
          "dimension": "relationship",
          "direction": "unknown",
          "degree": null,
          "confidence": "high",
          "epistemic_type": "ai_inferred_impact",
          "evidence_span": null,
          "rationale": "原文没有关系影响证据"
        },
        {
          "dimension": "purpose",
          "direction": "unknown",
          "degree": null,
          "confidence": "high",
          "epistemic_type": "ai_inferred_impact",
          "evidence_span": null,
          "rationale": "未提供该收入与用户目标或意义的关系"
        }
      ]
    }
  ],
  "unresolved": ["疲劳状态应作为独立 ExtractedItem 输出；本节为节选未展开"],
  "warnings": ["方向可判断但程度证据不足时，degree 保持 null，等待用户选择 1–5 或保留未定"]
}
```

说明：真实实现必须输出机器可校验的时间格式，并为 Capture 中每个可区分行为或事件建立独立 ExtractedItem。1–5 程度是用户相对其 Blueprint、目标和时间窗确认的有序主观估计；证据不足时不得为了填满量表而生成数字。五维影响不是零和分配，不要求数值合计为固定总数。

### 4.3 AI 禁止行为

AI 不得：

- 将“计划明天运动”提取为已经运动。
- 将“没运动”提取为正向运动记录。
- 将“很累”擅自量化为未经用户定义的精确分数。
- 推断未出现的收入、体重、疾病或关系事实。
- 因为用户提到“工作”而自动关联错误目标。
- 省略不确定性并强行分类。
- 用理论观点替代 Capture 中不存在的个人事实。

## 5. 时间、数值和否定规则

### 5.1 时间

- 使用用户时区解释“今天、昨晚、本周”。
- 保留原始时间表达。
- 无法确定具体时间时保存范围或不确定状态。
- 跨午夜表达需要待确认。
- 不得根据服务器时区替代用户时区。

### 5.2 数值与单位

- 数值和单位从原文提取并标准化。
- 保留原始表达，例如“一小时”。
- 标准化值例如 `60 minute`。
- 单位不明确时不得猜测。
- 同一条记录出现修正表达时，以最后明确修正为候选，并提示确认。

### 5.3 否定和未完成

以下语义必须区分：

- 做了
- 没做
- 想做
- 计划做
- 做了一部分
- 放弃了
- 不确定是否做过

计划和意图不能进入已完成指标。

## 6. 确定性计算契约

### 6.1 Goal Progress

只有当目标具有清晰指标、单位和有效确认数据时才计算。

计算结果必须保存或返回：

- 输入数据引用
- 公式或规则版本
- 计算时间
- 输出值
- 数据覆盖范围
- 数据置信状态

### 6.2 Deviation

Deviation 需要：

- 明确目标
- 时间范围
- 计划基线或期望节奏
- 足够的数据点

缺少条件时输出 `insufficient_data`，而不是预测完成日期。

### 6.3 不做总 Life Score

POC-01 不生成单一总分。允许展示：

- 分领域状态
- 目标进度
- 趋势
- 偏离
- 数据置信度

## 7. Review AI 输出契约

### 7.1 生成前上下文

Review Generator 只接收：

- 当前用户
- 指定周期
- 已确认或已修订的有效事实
- 确定性计算结果
- 必要的目标信息
- 经核验的少量 TheoryReference
- 输出行为规范
- 本次用户表达、可选反馈与有范围限制的有效模式（按第 14 节 In Review 提案，不自动读取全部历史）

未确认候选必须单独标识，默认不作为事实。

Review 以 `dimension_view` 为主，按 Time、Health、Wealth、Relationship、Purpose 组织同一批证据和行为影响。Goal、Project 或其他上下文可用于过滤和解释，但不得成为固定顶层维度。没有证据的影响输出 `unknown`，不得为展示完整而自动补齐。

影响映射在 Review 中必须保留 `epistemic_type`。AI 推断即使经用户确认，也只能表述为“用户认可的判断”或“基于记录的推测”；除非记录直接陈述或存在批准的确定性计算，否则不得表述为客观事实或因果结论。

### 7.2 输出类别

#### A. Personal Fact

格式原则：

> 你的记录显示……

必须有个人 EvidenceReference。

#### B. Deterministic Result

格式原则：

> 根据已确认的 X 条记录和规则版本 Y……

必须有输入与计算版本。

#### C. Inference

格式原则：

> 现有数据提示……可能相关，但不足以证明因果关系。

必须引用支持事实，并说明不确定性。

#### D. Theory Context

格式原则：

> 某作者/理论提出……这可以作为一种解释视角，但未必完全适用于你的情况。

必须有 TheoryReference 和边界说明。

#### E. Recommendation

格式原则：

> 基于上述事实和限制，本周期可以尝试……

必须说明依据，不得冒充事实或理论原话。

### 7.3 Review 禁止行为

- 无证据声称用户有某种人格、疾病或动机。
- 将相关性表述为因果关系。
- 用名家观点替用户作重大决定。
- 提供医疗、法律、投资等高风险确定性指令。
- 隐藏资料不足。
- 引用无法核验的作者、书名、论文或页码。
- 一次生成多个同等优先级的“最重要建议”。

## 8. 理论引用契约

理论引用在 POC-01 只使用少量人工筛选资料，不建设大规模 ingestion。

每次引用至少包含：

1. 作者或学者
2. 理论名称（如适用）
3. 资料名称
4. 章节、页码、DOI 或 URL
5. 观点是短引用还是 AI 转述
6. 证据强度或资料类型
7. 适用边界、争议或不确定性

显示顺序：

```text
你的记录显示什么
→ 系统可确定计算什么
→ 可能如何解释
→ 哪些理论提供视角
→ 建议尝试什么
```

不得反过来用理论强行解释个人数据。

## 9. 云端 LLM 与隐私要求

G2 必须决定并记录：

- 模型供应商和地区
- API 数据是否用于训练
- 请求和响应保留时间
- 是否支持零保留或企业隐私选项
- 哪些敏感字段需要移除或替换
- 错误日志是否包含输入/输出
- 用户如何撤回 AI 处理同意
- 更换模型供应商时如何重新评审

POC 默认原则：

- 不将其他用户数据放入当前请求。
- 不发送与任务无关的完整历史。
- 不在客户端暴露 API 密钥。
- 不把生产个人数据复制到开发或测试环境。
- 模拟数据优先用于回归测试。
- （v0.7，DQ-006）埋点不接入第三方分析 SDK；统计上传走独立 opt-in 管道，不与云端 AI 处理同意捆绑；撤回只保证停止未来发送。

## 10. 多用户隔离契约

朋友私测前必须验证：

1. 所有核心实体有明确所有者。
2. 服务端不接受客户端任意指定他人 `user_id`。
3. 查询默认限定当前认证用户。
4. Review 上下文构建只包含当前用户记录。
5. 导出只包含当前用户数据。
6. 删除只影响当前用户。
7. 日志、缓存和后台任务携带并校验用户边界。
8. 理论资料可以共享，但个人引用关系和 Review 仍归属于当前用户。

## 11. Schema 版本与兼容性

- Capture 结构保持 `capture-extraction-v0.5`；新增 Review 逻辑契约提议为 `review-guidance-v0.7`，文档升级不伪造已执行迁移。
- 字段含义变化必须升级 Schema 版本。
- Prompt 变化独立升级 Prompt 版本。
- 模型变化记录模型标识，不等同于 Schema 变化。
- 旧数据需要保留原版本，不能假装由新版本生成。
- 是否重跑旧 Capture 必须由明确任务触发，并保留新旧 Run。

## 12. G1/G2 Review 决策项

2026-09-12，Max 已批准 `G1-Decision-004-Five-Dimension-Impact-Rules-v0.1.md`。2026-09-13，Max 又批准 `G1-Decision-005-Mixed-Impact-Degrees-v0.1.md`：`mixed` 分别记录正向与负向 1–5 程度、分侧证据与状态，并禁止比例化或净额化；Decision 005 在 mixed 结构上局部取代 Decision 004 的 TBD 条款。以下其余项目继续 Review。

请 Max 对以下项目标记 `Approve / Revise / Reject`：

1. 是否接受“原始 Capture 不允许无痕编辑”；编辑应形成新版本或新记录？
2. 五大 Life Dimension 是否应固定为受控枚举，而不是用户自由增删？
3. `item_type` 初始枚举是否覆盖行为与事件场景？
4. 精力和情绪应使用文字等级、1–5 分，还是由用户自定义？
5. 是否需要保存云端模型的完整原始响应，还是只保存校验后的结构化结果？
6. 是否允许用户要求重新分析历史 Capture？
7. 删除单条 Capture 后，已经生成的历史 Review 应删除、标记证据失效，还是保留快照？
8. POC 的数据导出应包含哪些内容和格式？
9. 理论引用是否接受书籍、论文和可信网页三类来源？
10. 是否要求理论引用必须能打开链接，还是纸质书页码也可接受？
11. 云端 LLM 可接受的数据保留边界是什么？
12. 用户是否需要一个“敏感记录不发送给 AI”的选项？
13. 朋友私测前的多用户隔离条件是否充分？
14. 还有哪些数据必须在第一版保存，但本文尚未定义？
15. 已由 Decision 006 关闭：允许零个建议；新指导/反馈字段与生命周期见第 14 节，仍待 Max 评审。

## 13. 批准条件

本文中的逻辑字段、AI 类型边界、隐私原则和未决项经 Max Review 后，才可以在后续技术设计中转换为正式 JSON Schema、数据库表和接口契约。本文批准不授权编码。


## 14. Review 指导、反馈与受限学习契约（v0.7 起数据契约固化；实现细节仍待 G2 批准）

v0.7 依据 G1-Decision-006 与心理安全/隐私专项复核关闭项，将本节逻辑 schema 与验收语义正式固化；**字段落库、接口与保留参数仍需 G2 批准，不是已批准实现细节**。依据 [Decision 006](../09-decisions/G1-Decision-006-Adaptive-Review-v0.1.md)；对应 Product FR-COA-001～010 与 Test COA-001～014。P6-02 已在 G1 附条件确认产品原则：仅明确确认的长期模式可跨 Review 使用、一次反馈默认仅当前 Review、用户可查看/纠正/撤销/删除；未确认推断不成为长期依据。字段、检索/保留期限、缓存、备份、物理删除及供应商参数仍移至 G2。Capture、五维和 mixed 契约原样继承，Capture schema 仍为 v0.5；新增逻辑 schema 为 `review-guidance-v0.7`。

### 14.1 逻辑对象与引用

所有个人对象均有 `id, user_id, created_at, revision_id`；关联对象必须同一认证用户，服务端校验所有权和有效版本。下表是逻辑契约，不要求用户填表。反馈提交、修改、撤回、解释读取等能力仅为假设的逻辑需求；不指定或声称已实现 HTTP endpoints、数据库表或迁移。

| 对象 | 必要字段 / 条件 | 语义 |
|---|---|---|
| ReviewGuidance | `review_id, generation_id, status, trigger, selected_guidance, directness, delivered_text, recommendation_ids, evidence_reference_ids, goal_context_version_ids, feedback_revision_ids, pattern_revision_ids, uncertainty, rationale_summary, policy_version, model_id, prompt_version, schema_version, context_manifest, supersedes_id` | 实际展示结果与策略绑定到同一 Review；失败/取消标记而非冒充已展示 |
| ReviewFeedback | `review_id, target_type, target_id, target_revision_id, feedback_type, agreement, text, scope, status, supersedes_id` | 可指向某条 statement/guidance/recommendation/pattern；先归到所属 Review，再定位对象；事实纠正可链接 Capture 修订，不无痕覆盖原文 |
| ConfirmedPattern | `content, epistemic_type, evidence_reference_ids, feedback_revision_ids, context_scope, assessment_window, goal_context_version_ids, status, confirmation_reference_id, uncertainty, supersedes_id` | 行为/思维模式假设，不是人格/临床画像；确认依据必须可回到用户明确表达 |
| ContextManifest | `review_id, owner_id, selected_reference_revisions, purpose, scope, consent_version, retrieval_policy_version, built_at, unavailable_reference_ids` | 保存最少引用/版本与缺失说明；不另外复制整份历史提示词或隐藏思维链 |

`selected_guidance` 提案枚举：`listening | clarification | task_breakdown | direct_accountability | no_intervention`；只记录实际采用的主要方式，若重选则新增 guidance 修订，不覆写旧记录。`direct_accountability` 只有在用户本次 Review 明确请求直接督促时才可被选用；历史反馈、历史偏好或过去接受过直接表达不得单独作为授权。

`directness` 提案：`gentle | plain | direct | not_applicable`，不是强度分数或可相加权重；`no_intervention` 使用 `not_applicable` 且建议数组为空。安全流程标记 `status = safety_stopped`，不冒充普通教练模式。`trigger = user_opened_review`；用户可主动重试，后台任务不得新建 Review 指导。

`status` 指导提案：`proposed | displayed | stopped | safety_stopped | failed | superseded | evidence_unavailable`。仅 `displayed` 可描述为已展示；不保存没有实际发生的指导。`uncertainty` 为明确文字/类别（known_limits/insufficient/conflicting），不是伪精确概率；`rationale_summary` 只说明选择依据及限制，不是 raw hidden chain of thought。

ReviewGuidance 与 ContextManifest 构成 Review 当时的不可变决策快照：记录实际使用的规则/模型/Prompt 版本与来源修订，而不是只链接会变化的“当前值”。引用指向保留期内可解析的不可变来源修订；仅保留核验所需的最小授权内容，不复制全历史。解释读取使用此已记录快照，不在用户事后询问时重新猜测选择理由。用户查看反馈或模式时，只返回其本人对象的当前有效版本、内容、适用范围、状态和确认依据；`withdrawn | rejected | needs_reconfirmation`、已删除或 `evidence_unavailable` 的对象必须带明示状态，且不得作为有效模式或决策上下文展示。改选、反馈纠正或策略更新新增修订及关联，不回写原指导与当时依据；无当时依据须承认不可核验，不补造。删除/撤回与保留到期仍按 14.4 传播，快照不构成永久保留例外。

### 14.2 反馈分型、立即生效与修订

- `feedback_type`：`factual_correction | interpretation_disagreement | style_feedback | suggestion_acceptance | observed_outcome`。一次消息可拆成多个条目并保留同一来源引用；不明确时标记待澄清，不默默替用户分类成“接受”。
- `agreement = agree | disagree | null`，自然语言 `text` 可空；但一条可选反馈一旦提交，agreement/text/结构化纠正至少有一种内容。未反馈不创建同意或负反馈。
- `observed_outcome` 必须带 `outcome_window, evidence_reference_ids, epistemic_type`；用户自报的结果标为自报，不当作客观因果验证。没有结果记录保持 unknown，不推断未行动。
- `scope` 默认仅当前 Review/目标对象；长期范围必须用户明确确认。风格反馈只调整表达；建议接受不自动更新 Goal，承诺修改须明确用户行为。Review 的 `accepted` 状态仅表示接受该版本，不证明准确或有效。
- 事实纠正创建 UserRevision；当前解释/风格反馈立即覆盖本次输出的旧依据或表达。停止无需填写原因或先确认长期模式；取消未展示结果，禁止后续输出继续该指导；保存失败则本次仍停止，显式提示未保存，不能宣称跨设备持久化成功。
- 持久化成功后，同一 Review 重新打开/重试使用有效反馈；停止只在用户主动请求恢复时撤销。不自动把当前停止当作未来所有情境的永久规则。
- 每次反馈修订保存 `supersedes_id`，有效最新用户修订取代旧值；历史不再进入决策上下文但可依隐私策略查看。并发冲突不以 AI 猜测覆盖，保留冲突并暂停有争议指导，要求用户按需解决。

### 14.3 模式的确认与“学习”

1. `proposed`：AI 可在本次 Review 明确提出有依据的情境模式，不能作为长期已知事实被检索。
2. `confirmed | modified`：用户在自然对话中明确认可模式内容与适用情境（例如“对，只在这种任务里如此”）才可用于后续相关 Review；confirmation_reference_id 指向这段有效反馈。不把泛泛“好”、沉默或接受建议当成模式确认。
3. `rejected | withdrawn`：立即排除后续检索，不再重复灌输该解释；历史保留服从删除策略，不以可追溯为由永久保存。
4. `needs_reconfirmation`：目标/情境版本变化、相矛盾证据或期限到期时不得继续当有效长期模式。新判断需要新的明确确认；不自动催促确认。

以上状态为提案。`epistemic_type = ai_inference` 经确认仍保持原类型，并显示“用户认可的推断”；原始自报与推断不得混淆。持久模式不允许跨用户汇总，不包含未经新用途批准的心理健康、人格、疾病等敏感推断。AI 仅受限检索与适应表达，策略更新另行审查。反馈、ConfirmedPattern、ReviewGuidance、接受率、同意率或使用数据不得成为模型训练、微调、在线 RL、跨用户汇总学习或自动策略奖励/权重更新的输入或产物；仅可按已确认的同用户、情境与目的范围用于检索和规则选择。

### 14.3A 无障碍与公平输出边界

ReviewGuidance、ReviewFeedback 与 ConfirmedPattern 不得以 Capture/反馈长度、记录频率、表达流畅度、量化能力、建议接受率或完成率推断用户的动机、合作度、纪律性、人格特征或适合何种指导。低信息、简短、非量化、间断或辅助性表达均是有效输入形态；系统不得以此收窄 `no_intervention`、只回顾、拒绝、停止、纠正或撤回路径，也不得追加追问作为获得这些路径的条件。此为 G1 输出与交互语义边界；呈现、辅助技术与状态/接口实现留 G2。

### 14.4 最少上下文与保留/删除提案

**边界先行**：当前第 9 节供应商/地区/训练用途/保留批准仍未关闭。下列数值只是可讨论的保守上界，不是用户已批准偏好、上线配置或法定承诺；未批准前只用合成数据验证，不接入真实数据。当前 AI 同意不能自动扩展为新敏感推断用途。

- 检索只在用户主动 Review 发生，限当前用户、所选周期、当前目标版本及必要已确认数据。所选周期之外的个人上下文，提议仅允许最近 30 天、至多 3 条仍有效且情境匹配的已确认模式及至多 5 条对应有效反馈；当次纠正/停止不受该数量上限截断。无匹配不补采其他历史；不足即说明不知道。
- 模式提议在确认后最多 30 天可用于检索；到期变为 needs_reconfirmation 而非自动永久续期。反馈默认本次范围；只有明确确认跨 Review 适用的反馈才进入上述检索。用户缩小范围/撤回即生效。
- 原始 Capture 使用已有待审保留政策，不因本次新增“学习”扩大；新增指导、反馈、模式正文及其修订提议最多保存 90 天，或用户更早删除。到期删除正文和派生副本，不无限期保留历史。若 Review 保存更久，已删除指导/反馈仅显示不可用状态，不重建原文；若用户需更长保留，另行评审。
- 活动上下文缓存仅本次生成使用、最长 1 小时且不跨 Review 复用；终止、撤回或删除更早发生时立即失效。POC 不建立个人向量记忆库；未来索引需另审。
- 删除 Capture/反馈/模式/Review 或撤回 AI 使用时，首先停止新检索并阻止旧内容继续展示/生成；联动引用、摘要、指导、反馈修订及模式的派生副本。删除应清除可还原个人内容，不能仅断开 ID 而保留 quote/text。Review 的生命周期 status 不变；另设 `evidence_status = available | evidence_unavailable`，相关 Review 的 evidence_status 标记为 evidence_unavailable；只允许用户主动用剩余获许可证据重新生成新版本。
- 提议活动存储物理清除上界 24 小时；备份最多 30 天过期且期间不可供 AI 或产品读取。恢复备份必须先重放删除标记再开放访问；最小删除标记只含不可还原内容的对象 ID/状态/时间，备份清除后移除。未确认后端/供应商可兑现前不可显示“永久删除完成”。
- 云端请求不训练模型，供应商保留需有批准的明确上界（POC 提议零保留）；供应商不支持则阻止真实数据处理、另审替代，不默认接受其保留。撤回仅保证停止未来发送，不能谎称已撤回发出的请求；告知供应商清除状态和限制。
- 导出包含当前用户仍在合法保留期内的指导/反馈/模式、有效与历史版本、证据引用/可访问正文、作用域、策略/模型/Schema 版本及不可用标记，不复活已删除数据。不得含其他用户或 raw hidden chain of thought；理论资料仅按合法授权导出。

### 14.5 合成示例（待审逻辑示例，非真实用户数据）

此例无目标与长期模式。feedback-demo-1 是用户在 review-demo-1 当次明确“只回顾，不需要建议”的合成反馈，目标类型为 review；反馈已保存且有效；EvidenceReference `evidence-feedback-demo-1` 以 `source_type = feedback` 指向 `feedback-demo-1` 的 `feedback-demo-1-r1` 版本，故写入 references。示例仅展示最小字段投影，未示出通用 ID/时间/修订包装，不冒充完整 JSON Schema。

```json
{
  "schema_version": "review-guidance-v0.7",
  "review_id": "review-demo-1",
  "user_id": "synthetic-user-a",
  "trigger": "user_opened_review",
  "status": "displayed",
  "selected_guidance": "no_intervention",
  "directness": "not_applicable",
  "delivered_text": "可以，这次只回顾，不安排改变。",
  "recommendation_ids": [],
  "evidence_reference_ids": ["evidence-feedback-demo-1"],
  "goal_context_version_ids": [],
  "feedback_revision_ids": ["feedback-demo-1-r1"],
  "pattern_revision_ids": [],
  "uncertainty": "insufficient: 没有足够历史判断长期模式",
  "rationale_summary": "用户当次明确无需建议；没有依据建立长期偏好。",
  "policy_version": "adaptive-review-v0.1-proposal",
  "model_id": "synthetic-not-executed",
  "prompt_version": "review-v0.7"
}
```

本节提议 EvidenceReference 的 `source_type` 增加 `feedback | guidance | pattern | revision`，使用目标 ID 加有效 revision ID；不能把 feedback 当成 Capture 事实。解释按需展示这些来源与局限，理由摘要不披露内部思维链。

### 14.6 待决与门禁

- **D6-01**：P6-02 已在 G1 附条件确认跨 Review 作用域与用户控制原则；14.1～14.3 的字段、状态、有效版本、冲突和模式转换是 G2 设计待决项。
- **D6-02**：14.4 的检索上界、30/90 天保留提案、24 小时/30 天删除路径及供应商零保留适配性均移至 G2；明确这是新提案，不将默认值冒充授权。
- **D6-03**：同样四选一：导出和依赖失效方案；若与第 12 节既有删除问题一起决定，须显式记录局部取代，不能默默关闭。

未决真实数据权限、隐私风险接受人与供应商能力须在 G2 记录（责任归 Max 指定并批准）；此版不执行任何数据收集、迁移或模型训练。
