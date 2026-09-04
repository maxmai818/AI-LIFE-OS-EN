# G0/G1 Amendment 003：移除临时关注点并采用五维行为影响模型

- **状态**：Approved as Product Direction
- **决策人**：Max
- **日期**：2026-09-01
- **变更类型**：项目背景与领域模型纠正
- **影响文档**：项目 README、Amendment 002、G1 Review Pack v0.2

## 1. 背景

“健康、主业工作、副业”是立项阶段用于了解 Max 当前情况的临时回答，不是产品固定范围、默认关注点或项目背景。此前将三者写入 README、POC 默认配置和 Current Focus 模型，属于过度固化。

## 2. 正式决定

1. 项目固定顶层模型只有五大基本维度：
   - Time（时间）
   - Health（健康）
   - Wealth（财富）
   - Relationship（关系）
   - Purpose（目的/意义）
2. 不在项目背景、README 或 POC 默认配置中写死健康、主业、副业。
3. 用户的工作、项目、健康事项、家庭活动、学习、消费、休息等都属于行为、事件、目标或上下文，不是新的顶层维度。
4. 所有有效行为/事件都应评估其对五大维度的影响，并以比例或影响程度表示。
5. 影响需要包含方向、程度、证据、置信度和用户确认状态。
6. 没有证据支持的维度应为 `unknown` 或明确的中性/零值，不得猜测。
7. 一个行为可以同时对多个维度产生不同方向和程度的影响。
8. POC 不生成单一总 Life Score；五维影响只用于分维度观察、趋势和 Review。

## 3. 修订后的核心模型

```text
Life Blueprint（五大维度）
        ↓
Goal / Project / Context
        ↓
Behavior / Event / Capture
        ↓
BehaviorDimensionImpact × 5
        ↓
按维度的事实、趋势、偏离与 Review
```

`CurrentFocus` 可以作为未来可选的用户标签或视图，但不是 POC 必需实体，也不得预置健康、主业、副业。

## 4. 五维影响向量

每个有效行为/事件逻辑上产生一个五维影响向量：

```text
Time          direction + degree/proportion + confidence + evidence
Health        direction + degree/proportion + confidence + evidence
Wealth        direction + degree/proportion + confidence + evidence
Relationship  direction + degree/proportion + confidence + evidence
Purpose       direction + degree/proportion + confidence + evidence
```

方向可为：`positive | negative | mixed | neutral | unknown`。

“比例”是否要求总和为 100%，以及“程度”采用何种量表，留给 G1/G2 Review 决定。初步原则是不把多维影响误当成零和分配：一个行为可以同时强烈影响多个维度。

## 5. 示例（仅说明模型，不作为固定业务背景）

行为：“为了完成一个项目连续熬夜三天，并获得一笔收入。”

可能的候选影响：

- Time：负向或混合——占用休息和自由时间。
- Health：负向——连续熬夜。
- Wealth：正向——获得收入。
- Relationship：未知——没有关系方面证据。
- Purpose：正向或未知——只有在项目与用户目标/意义有关时才能判断。

以上均为候选，需通过原始证据、用户目标和用户确认确定。

## 6. 对 Amendment 002 的修订

Amendment 002 中以下内容被本 Amendment 取代：

- “健康、主业、副业是 POC 默认 Current Focus”。
- “POC 暂不设置比例或程度”的表述。

保留：五大维度固定、行为可跨维度、无证据不得猜测。

## 7. 对 G1 文档的要求

- Product & UX Spec 移除三个默认关注点。
- Data Contract 以 `BehaviorDimensionImpact` 作为行为到五维的核心多对多关系。
- Capture AI 输出对每个行为提供五维影响候选。
- Confirm UX 允许用户调整方向和程度。
- Review 主要按五大维度组织，不再要求按健康/主业/副业组织。
- Test Spec 分别验证五维影响方向、程度、证据、置信度和未知处理。
- 所有文档升级新版本并保留旧版历史。
