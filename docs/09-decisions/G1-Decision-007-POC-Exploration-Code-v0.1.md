# G1 Decision 007 — POC 代码分支定性与处置 v0.1

- **状态**：已决定（Max，2026-10-08）
- **决策人**：Max；**记录**：Hermes（PM）
- **Gate**：G1 In Review；编码未授权；本文不授权任何实现工作

## 决定

1. `feat/poc-implementation` 分支及其迭代线（iteration-1 至 iteration-6）的 POC 代码定性为**探索性实验**：用于验证 v0.6 规格的可行性与 AI 迭代流程，**不作为正式实现继续**。
2. `feat/poc-implementation` 分支**废弃**：已打归档 tag `archive/poc-exploration-20261008` 保留历史后删除分支。
3. 正式实现在 **G2（设计基线）通过后**从 `main` 重新开始；探索代码不合并、不继承。

## 背景

- 该代码线在 G1/G2 未通过期间由代理自主迭代产出（见 `ITERATION-PLAN.md` 的 proxy 授权），与 AGENTS.md"未过 gate 不进入编码"存在治理张力。
- 本决定消除该张力：探索性实验豁免于编码禁令，但不获得实现地位。

## 待附带确认（G1 关闭决策包）

`feat/poc-iteration-1/4/6`、`poc/exploration` 是否同样归档删除，随 [G1-Closure-Decision-Packet-v0.1](../00-governance/G1-Closure-Decision-Packet-v0.1.md) 一并确认。

## 影响

- G2 之后的实现任务以 v0.6 规格为唯一基线，探索代码仅作参考素材，不作为验收对象。
- Roadmap 与 AGENTS.md 规则不变；本决定是范围/资产处置，不修改任何需求。
