# G1 Decision 004：五维行为影响规则

- **状态**：Approved
- **决策人**：Max
- **批准日期**：2026-09-12
- **记录日期**：2026-09-12
- **适用范围**：POC-01 G1 产品需求、数据/AI 契约与测试验收
- **来源**：Max 在项目会话中明确回复“五项全部同意，按推荐方案推进。”
- **关联文档**：`G0-G1-Amendment-003-Behavior-Dimension-Impact-v0.1.md`、G1 Review Pack v0.3
- **批准边界**：本记录批准下列五项模型规则，不等同于三份 G1 文档整体批准，不通过 G1 Gate，也不授权编码。

## 1. 已批准决定

### DEC-G1-004-01：全部五维均进入逻辑评估

每个有效行为或事件都逻辑上评估其对以下五个固定维度的影响：

1. Time
2. Health
3. Wealth
4. Relationship
5. Purpose

“逻辑上评估”不表示必须生成非零影响。没有足够证据的维度必须保存或展示为 `unknown`，不得猜测、补齐或省略成已知事实。

### DEC-G1-004-02：POC 使用 1–5 离散影响程度

当方向为 `positive` 或 `negative` 且存在足够证据时，POC 使用整数 `1–5` 表示影响程度；`mixed` 的程度结构仍待 G1 Review：

- `1`：很弱
- `2`：较弱
- `3`：中等
- `4`：较强
- `5`：很强

程度表示该行为对单个维度的有序主观影响估计，不代表客观测量、人生维度状态、目标进度或价值判断。`unknown` 和 `neutral` 的程度为空；方向可判断但程度证据不足时也允许为空，不得为了填满量表而生成数字。

### DEC-G1-004-03：五维影响不是零和分配

五个维度的程度分别判断，不要求合计为 100% 或固定总数。同一行为可以同时对多个维度产生较强影响。

POC 不使用 `proportion` 作为正式影响值。若未来引入比例模型，必须另行评审并升级契约版本。

### DEC-G1-004-04：区分 unknown 与 neutral

- `unknown`：证据不足，无法可靠判断方向或程度；`degree = null`。
- `neutral`：有足够证据支持“没有明显影响”；`degree = null`。它通过方向字段与 `unknown` 区分。

`neutral` 不是默认值。缺少证据时必须使用 `unknown`。

### DEC-G1-004-05：用户确认后才进入长期分析

AI 生成的非 `unknown` 五维影响均为候选。只有用户执行确认或修改后，影响才能进入：

- 以“用户确认的影响判断”为来源的长期分析
- 维度状态中的用户判断层
- Goal Progress / Deviation 的解释上下文；除非另有确定性规则，不作为数值计算输入
- Review 中明确标注为“用户认可的判断”或推测的内容

未确认候选可以在 Confirm 界面展示，但不得被描述为用户事实。用户确认只改变确认状态，不改变其事实、推断或计算的认识论类型。被拒绝候选不得参与后续分析。`unknown` 可保留为数据局限，不要求用户强行赋值。

## 2. 数据语义摘要

```yaml
dimension: time | health | wealth | relationship | purpose
direction: positive | negative | mixed | neutral | unknown
degree:
  type: integer | null
  allowed: [1, 2, 3, 4, 5]
  rules:
    unknown: null
    neutral: null
    positive_or_negative: 1..5
    mixed: TBD（不得用单一数字净额化正负影响）
confidence: low | medium | high
status: proposed | confirmed | modified | rejected | unknown
```

约束：

- `direction = unknown` 时，`degree = null`。
- `direction = neutral` 时，`degree = null`；与 `unknown` 的区别保存在 `direction` 和证据中。
- `direction ∈ {positive, negative}` 时，`degree ∈ {1,2,3,4,5}`。
- `mixed` 的程度结构未包含在本次五项批准中，继续作为 G1 开放决策；决定前不得用单一数字净额化正负影响。
- 五个 `degree` 不求和，也不转化为单一 Life Score。
- `confidence` 表示候选判断的确定程度，不等于影响程度。

## 3. UX 与文案约束

- Confirm 界面按行为展示五维候选，允许逐维确认、修改、拒绝或保留未知。
- 方向和程度必须分别可见；不得仅显示一个不透明分数。
- 系统不得暗示 `5` 是“好”、`1` 是“差”；好坏由方向表达，程度只表示强弱。
- Review 必须区分事实、AI 推测、理论视角和建议。
- Deviation/Gap 是诊断信号，不是失败或道德评价。
- ONE BIG CHANGE 是可拒绝、可修改的建议，不是命令。

## 4. 验收要求

至少验证：

1. 每个有效行为均有五个维度评估结果。
2. 无证据维度输出 `unknown + null`，而不是中性或推测值。
3. 有证据表明无明显影响时可以输出 `neutral + null`，并保留支持该判断的证据。
4. 依据充分的正向或负向影响只使用 1–5 整数程度；`mixed` 的程度结构保持待决。
5. 五维程度不执行求和或归一化。
6. 未确认候选不进入长期分析和 Review 事实。
7. 用户修改值优先于 AI 原始候选，同时保留完整追溯记录。

## 5. 仍未批准的事项

本决定不处理以下 G1/G2 开放问题：

- 页面和导航最终结构
- POC 登录与注册范围
- 导出格式
- 删除与恢复策略
- 云端模型完整原始响应是否保存
- 敏感 Capture 的 AI 跳过选项
- 朋友私测时间点
- 云端 LLM 供应商、地区及保留政策
- G1 三份文档的整体基线状态

这些事项继续保持 `In Review`，应在后续 Review 中单独决定。
