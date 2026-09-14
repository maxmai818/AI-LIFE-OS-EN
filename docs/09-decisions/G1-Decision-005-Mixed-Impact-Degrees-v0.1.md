# G1 Decision 005：Mixed 影响分别记录正负程度

- **状态**：Approved
- **决策人**：Max
- **批准日期**：2026-09-13
- **记录日期**：2026-09-13
- **适用范围**：POC-01 G1 产品需求、数据/AI 契约与测试验收
- **来源**：Max 选择方案 A，并说明分别记录可以更细致地复盘同一维度上的正向与负向影响；即使方向同为 `mixed`，行为时长等证据也可能使两侧程度不同。
- **关联决策**：`G1-Decision-004-Five-Dimension-Impact-Rules-v0.1.md`
- **优先级与局部取代**：本决定取代 Decision 004 第 28、74、84、104 行所表达的“`mixed` 程度结构待决/TBD”条款；Decision 004 的其他已批准规则继续有效。两份 Approved 记录冲突时，仅在 `mixed` 程度结构上以本决定为准。
- **批准边界**：本记录只批准 `mixed` 的程度结构，不批准 G1 整体，也不授权编码。

## 1. 已批准决定

### DEC-G1-005-01：Mixed 使用两个独立的 1–5 程度

当同一个行为或事件对同一个 Life Dimension 同时存在正向和负向影响时：

- `direction = mixed`
- 分别记录 `positive_degree` 与 `negative_degree`
- 两个程度各自使用整数 `1–5`：`1` 很弱、`2` 较弱、`3` 中等、`4` 较强、`5` 很强
- 每一侧必须分别有支持它的证据与理由
- 某一侧方向有依据但程度依据不足时，该侧程度允许为 `null` 并保持待确认

行为时长、频率、情境和用户 Blueprint/目标可以作为程度证据。例如，同为“熬夜工作”，持续时间不同可能使同一维度的正向与负向程度组合不同。

## 2. “相对比例”的解释边界

本决定将 Max 所说的“正向和负向的比例”落实为：**同一行为、同一维度内两个 1–5 程度所表达的相对强弱关系**。

它不引入百分比或 `proportion` 字段，也不要求两值合计为固定总数。系统不得自动把两值相减、相除、净额化或压缩成单一分数。若未来需要正式比例或净影响算法，必须另行评审并升级契约。

## 3. 数据语义摘要

```yaml
direction: mixed
degree: null
positive_degree:
  type: integer | null
  allowed: [1, 2, 3, 4, 5]
negative_degree:
  type: integer | null
  allowed: [1, 2, 3, 4, 5]
positive_evidence: required whenever direction is mixed
negative_evidence: required whenever direction is mixed
positive_status: proposed | confirmed | modified | rejected
negative_status: proposed | confirmed | modified | rejected
```

约束：

- `positive | negative` 继续使用原有单一 `degree`；两个 mixed 专用字段为空。
- `mixed` 的单一 `degree` 必须为空；使用 `positive_degree` 与 `negative_degree`。正负方向证据始终必填，即使某侧程度因证据不足为 `null`。
- 两侧分别保存理由、置信度和确认状态，以区分证据不足、用户清空程度与用户拒绝该侧。
- 用户只拒绝一侧方向时，有效方向转为另一侧的单方向；两侧均拒绝时整项不得进入长期分析。只清空某侧程度不否定该侧方向，仍可保持 `mixed`。每次转换均保留修订历史。
- `neutral | unknown` 的三个程度字段均为空。
- 正负程度只可在同一行为、同一维度、同一评估时间窗内作为相对强弱信息展示。
- 不得据此生成净影响、跨维度排名、Life Score 或因果结论。
- AI 提出的两侧程度仍是候选，只有用户确认或修改后才能进入长期分析。

## 4. UX 与验收要求

- Confirm 界面在 `mixed` 时同时展示正向和负向程度及各自依据。
- 用户可以分别修改、清空或拒绝两侧程度；不得强迫用户为证据不足的一侧选择数字。
- Review 可以描述“正向作用较强、负向消耗较弱”等相对关系，但必须保留上下文和认识论标签。
- Review 不得使用“净 +2”“60% 正向”等未经批准的派生表达。
- 测试必须覆盖：两侧程度不同、某侧程度证据不足、用户分别修改/清空/拒绝/重新确认两侧、方向转换、历史回放、跨时间窗拒绝比较，以及禁止净额化。

## 5. 仍未批准的事项

本决定不处理 ONE BIG CHANGE 是否允许为零个，也不关闭其他 G1 产品、数据、隐私、安全或试用范围问题。G1 继续保持 `In Review`，编码继续未授权。
