# G0/G1 Amendment 002：五大人生维度与当前关注点分层

- **状态**：Approved as Product Direction; pending merge into G1 drafts
- **决策人**：Max
- **日期**：2026-09-01
- **变更类型**：领域模型纠正
- **影响文档**：Roadmap Review 决策记录、G1 Review Pack v0.1

## 1. 背景

G1 v0.1 草案将“健康、主业工作、副业”作为三个 Focus Area，容易把 Max 当前关心的主题误当成系统固定的人生维度。Max 现明确：系统仍应按五大人生维度设计；健康、主业和副业是当前关注点，需要分析它们如何关联并影响五大维度。

## 2. 正式决定

### 2.1 固定顶层人生维度

AI Life OS 的顶层 Life Dimension 为：

1. **Time（时间）**
2. **Health（健康）**
3. **Wealth（财富）**
4. **Relationship（关系）**
5. **Purpose（目的/意义）**

五大维度用于 Life Blueprint、长期状态观察、目标影响分析和周期 Review。

### 2.2 当前关注点

健康、主业工作、副业属于 `Current Focus / Concern / Project`，不是固定维度。POC 首轮关注：

- 健康
- 主业工作
- 副业

当前关注点可以随阶段改变，不应修改五大维度本身。

### 2.3 多对多映射

一个 Current Focus 可关联多个 Life Dimension；一个 Life Dimension 也可被多个 Current Focus 影响。映射必须允许：

- 主要影响维度
- 次要影响维度
- 影响方向：正向、负向、混合或未知
- 关联理由
- 数据证据
- 用户确认状态

POC 初始不强制永久权重或百分比分配，以免制造伪精确。

## 3. 示例映射

### 健康关注点

- 主要：Health
- 常见关联：Time（睡眠/运动时间）、Purpose（身份与长期生活愿景）、Relationship（健康对陪伴和互动的影响）、Wealth（医疗和工作能力）

### 主业工作关注点

- Time：工作时长、可支配时间、加班
- Wealth：收入和职业安全
- Purpose：成长、成就与意义
- Relationship：同事、管理者、家庭时间
- Health：压力、睡眠和精力

### 副业关注点

- Wealth：收入验证与资产积累
- Purpose：创造、独立性和职业转型
- Time：投入和机会成本
- Health：疲劳与恢复
- Relationship：陪伴时间和支持/冲突

这些是候选关系，不是系统替用户作出的固定结论。实际映射需结合具体 Goal、Capture 和用户确认。

## 4. 修订后的领域模型

```text
Life Dimension（固定五维）
        ↕ 多对多
Current Focus / Concern / Project（阶段关注点）
        ↓
Goal
        ↓
Metric / Action / Capture
```

Capture 可同时关联：

- 一个或多个 Life Dimension
- 零个或多个 Current Focus
- 零个或多个 Goal

## 5. Review 视图要求

Review 至少应支持两个互补视角：

1. **按五大维度**：Time、Health、Wealth、Relationship、Purpose 当前有什么证据和变化。
2. **按当前关注点**：健康、主业、副业分别取得什么进展，并如何影响五大维度。

系统可展示“关注点 × 人生维度”的影响矩阵，但无证据时必须标记未知，不得自动填满。

## 6. 对原决策的修订

本 Amendment 修订 `Roadmap-Review-Decisions-v0.1.md` 中 DEC-008 及“领域模型澄清”部分：

- 保留健康、主业、副业为首轮当前关注点。
- 撤销将它们作为顶层 Focus Area/Life Area 的解释。
- 恢复五大人生维度为固定顶层模型。
- 采用当前关注点与五维多对多关联。

## 7. 对 G1/G2 的影响

- Product & UX Spec 增加五维 Blueprint 和关注点映射流程。
- Data Contract 分离 `LifeDimension` 与 `CurrentFocus`，增加映射实体。
- Capture AI 输出同时给出维度候选、关注点候选和 Goal 候选。
- 用户可确认或纠正维度关联。
- Test Spec 增加多标签映射、跨维度影响及未知关系测试。
- 当前仍不生成单一 Life Score。
- 当前仍不开始编码。
