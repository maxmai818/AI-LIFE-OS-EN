# Capture Data + AI Output Contract v0.2

- **项目**：AI Life OS
- **文档状态**：Draft — Awaiting Max Review
- **SDLC 阶段**：G1/G2 Requirements & Design Baseline
- **产品批准人**：Max
- **作者**：Hermes
- **日期**：2026-09-01
- **关联需求**：`POC-01-Product-UX-Spec-v0.2.md`
- **实现状态**：未开始；本文是逻辑契约，不是代码或数据库迁移

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

## 3. 概念数据模型

```text
User
├── Profile
├── LifeDimension（固定五维）
├── CurrentFocus（阶段关注点）
│   └── FocusDimensionLink（多对多关联）
├── Goal
├── Capture
│   ├── ExtractionRun
│   │   └── ExtractedItem
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

LifeDimension 是产品固定顶层模型，不因用户当前关注点而变化。用户对维度的 Blueprint 内容应保存在用户专属的 Profile/Blueprint 记录中，而不是修改全局维度定义。

### 3.4 CurrentFocus

阶段性关注点或项目主题。POC 默认：健康、主业工作、副业。

- `id`
- `user_id`
- `name`
- `description`
- `status`: `active | paused | completed | archived`
- `start_date`（可空）
- `end_date`（可空）
- `sort_order`
- `created_at`
- `updated_at`

当前关注点可以随阶段改变，不替代 LifeDimension。

### 3.5 FocusDimensionLink

表示 CurrentFocus 与 LifeDimension 的多对多关联：

- `id`
- `user_id`
- `current_focus_id`
- `life_dimension_id`
- `role`: `primary | secondary | contextual`
- `impact_direction`: `positive | negative | mixed | unknown`
- `rationale`
- `evidence_reference_ids`
- `status`: `proposed | confirmed | modified | rejected`
- `source`: `user | ai`
- `created_at`
- `updated_at`

POC 不强制保存永久百分比权重。AI 提出的关联在用户确认前不得作为确定事实。

### 3.6 Goal

- `id`
- `user_id`
- `current_focus_id`（可空）
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

### 3.7 Capture

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

### 3.8 ExtractionRun

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

### 3.9 ExtractedItem

代表 AI 从 Capture 中提取的一条候选结构化内容。

- `id`
- `user_id`
- `capture_id`
- `extraction_run_id`
- `item_type`
- `life_dimension_ids`
- `current_focus_ids`
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

### 3.10 UserRevision

- `id`
- `user_id`
- `extracted_item_id`
- `field_name`
- `original_ai_value`
- `revised_value`
- `action`: `confirm | modify | reject`
- `reason`（可空）
- `created_at`

计算使用有效确认版本，而不是直接使用最新 AI 输出。

### 3.11 Review

- `id`
- `user_id`
- `period_start`
- `period_end`
- `timezone`
- `status`: `draft | generated | reviewed | accepted | superseded`
- `generator_version`
- `created_at`

### 3.12 ReviewStatement

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

### 3.13 EvidenceReference

- `id`
- `user_id`
- `source_type`: `capture | extracted_item | goal | calculation | review`
- `source_id`
- `quote_or_summary`
- `occurred_at`
- `field_path`（可空）
- `calculation_version`（计算结果时）

### 3.14 TheoryReference

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

### 3.15 Recommendation

- `id`
- `review_id`
- `user_id`
- `text`
- `rationale`
- `supporting_statement_ids`
- `status`: `proposed | accepted | modified | rejected`
- `user_modified_text`（可空）

每个 Review 最多一个主 Recommendation。

## 4. Capture AI 输出契约

### 4.1 输入边界

AI 可接收：

- 当前 Capture 原始文本
- 用户时区和当前日期
- 固定五大 Life Dimension 的代码和定义
- 当前 Active Current Focus（首轮为健康、主业、副业）
- 最多三个 Active Goal 的必要字段
- 经批准的 Schema 和行为说明

默认不得接收：

- 用户全部历史 Capture
- 其他用户任何数据
- 与当前提取无关的敏感资料
- 未经批准的外部文档内容

### 4.2 逻辑输出示例

用户输入：

> 昨晚两点才睡，今天特别累，不过晚上还是去健身了一个小时，副业产品也做了两个小时。

建议输出：

```json
{
  "schema_version": "capture-extraction-v0.2",
  "capture_language": "zh-CN",
  "items": [
    {
      "item_type": "metric_observation",
      "life_dimensions": ["health", "time"],
      "current_focuses": ["健康"],
      "occurred_at": "根据用户时区解析的昨晚",
      "metric_type": "bedtime",
      "value": "02:00",
      "unit": "local_time",
      "qualitative_state": null,
      "goal_links": [],
      "confidence": "high",
      "needs_confirmation": false,
      "evidence_span": "昨晚两点才睡"
    },
    {
      "item_type": "state_observation",
      "life_dimensions": ["health"],
      "current_focuses": ["健康"],
      "occurred_at": "今天",
      "metric_type": "energy",
      "value": null,
      "unit": null,
      "qualitative_state": "very_low",
      "goal_links": [],
      "confidence": "high",
      "needs_confirmation": false,
      "evidence_span": "今天特别累"
    },
    {
      "item_type": "metric_observation",
      "life_dimensions": ["health", "time"],
      "current_focuses": ["健康"],
      "occurred_at": "今天晚上",
      "metric_type": "exercise_duration",
      "value": 60,
      "unit": "minute",
      "qualitative_state": null,
      "goal_links": [],
      "confidence": "high",
      "needs_confirmation": false,
      "evidence_span": "健身了一个小时"
    },
    {
      "item_type": "goal_progress_event",
      "life_dimensions": ["time", "purpose", "wealth"],
      "current_focuses": ["副业"],
      "occurred_at": "今天",
      "metric_type": "focused_work_duration",
      "value": 120,
      "unit": "minute",
      "qualitative_state": null,
      "goal_links": ["候选副业目标 ID"],
      "confidence": "medium",
      "needs_confirmation": true,
      "evidence_span": "副业产品也做了两个小时"
    }
  ],
  "unresolved": [],
  "warnings": []
}
```

说明：真实实现必须输出机器可校验的时间格式；上例用自然语言展示待 G2 决定的时间解析规则。

上例中的跨维度关联是 AI 候选：例如副业投入可能同时关联 Time、Purpose 和 Wealth，但在用户确认前不应成为长期映射事实。

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

未确认候选必须单独标识，默认不作为事实。

Review 应能按两种视角组织同一批证据：

- `dimension_view`：Time、Health、Wealth、Relationship、Purpose。
- `focus_view`：健康、主业、副业等当前关注点及其跨维度影响。

没有证据的关联输出 `unknown` 或省略，不得为展示完整而自动补齐。

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

- 当前草案版本：`capture-extraction-v0.2`。
- 字段含义变化必须升级 Schema 版本。
- Prompt 变化独立升级 Prompt 版本。
- 模型变化记录模型标识，不等同于 Schema 变化。
- 旧数据需要保留原版本，不能假装由新版本生成。
- 是否重跑旧 Capture 必须由明确任务触发，并保留新旧 Run。

## 12. G1/G2 Review 决策项

请 Max 对以下项目标记 `Approve / Revise / Reject`：

1. 是否接受“原始 Capture 不允许无痕编辑”；编辑应形成新版本或新记录？
2. 五大 Life Dimension 是否应固定为受控枚举，而不是用户自由增删？
3. Current Focus 与五维关联是否应由用户明确确认后才进入长期分析？
4. POC 是否接受不设置固定百分比权重，只记录主要/次要、方向、理由和证据？
5. `item_type` 初始枚举是否覆盖五维和当前关注点场景？
6. 精力和情绪应使用文字等级、1–5 分，还是由用户自定义？
7. 未确认的 AI 候选是否完全排除在 Review 事实之外？
8. 是否需要保存云端模型的完整原始响应，还是只保存校验后的结构化结果？
9. 是否允许用户要求重新分析历史 Capture？
10. 删除单条 Capture 后，已经生成的历史 Review 应删除、标记证据失效，还是保留快照？
11. POC 的数据导出应包含哪些内容和格式？
12. 理论引用是否接受书籍、论文和可信网页三类来源？
13. 是否要求理论引用必须能打开链接，还是纸质书页码也可接受？
14. 云端 LLM 可接受的数据保留边界是什么？
15. 用户是否需要一个“敏感记录不发送给 AI”的选项？
16. 朋友私测前的多用户隔离条件是否充分？
17. 还有哪些数据必须在第一版保存，但本文尚未定义？

## 13. 批准条件

本文中的逻辑字段、AI 类型边界、隐私原则和未决项经 Max Review 后，才可以在后续技术设计中转换为正式 JSON Schema、数据库表和接口契约。本文批准不授权编码。