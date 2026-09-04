# AI Life OS

AI Life OS（AI 人生管理系统）项目工作区。

## 当前状态

- 当前阶段：Requirements & Design
- SDLC Gate：G0 已通过；G1 Review Pack 已提交评审
- 编码状态：尚未开始
- 当前基线：Roadmap v0.1 + Roadmap Review 决策记录 v0.1 + Amendments 001/002/003；G1 v0.3 三份文档尚未批准

## 远程协作与手机查看

本项目使用私有 GitHub 仓库保存正式产品文档、Agent 规范和未来代码。同步采用分支、Pull Request、独立评审与 CI，而不是实时自动提交。Hermes Kanban 数据库、运行日志、密钥和真实用户数据不进入 Git。

- 协作规则：[`AGENTS.md`](AGENTS.md)
- GitHub 同步策略：[`docs/00-governance/GitHub-Sync-and-Branching-Policy-v0.1.md`](docs/00-governance/GitHub-Sync-and-Branching-Policy-v0.1.md)
- Agent/Skill 可版本化源文件：[`agent-assets/`](agent-assets/)

## 项目目标

构建一个手机优先的响应式 Web 人生管理系统：采用“单人私密体验、支持多个独立用户”的模式。每位用户拥有独立账号和完全隔离的个人数据。系统以 Time、Health、Wealth、Relationship、Purpose 五大人生维度为固定顶层模型，将所有有效行为和事件按方向与影响比例或程度映射到五维，并基于个人事实、目标偏离和可追溯的 AI 解释帮助用户复盘。RAG 主要用于引用合法电子书、论文或可信资料中的学者、理论和来源，不预设为个人知识库。

核心闭环：

```text
Life Blueprint
→ Capture
→ AI 结构化与用户纠正
→ Goal Progress / Deviation
→ Today / Weekly Review
→ ONE BIG CHANGE
```

## 目录

| 路径 | 用途 |
|---|---|
| `docs/00-governance/` | Roadmap、项目章程、范围、Gate Review |
| `docs/01-discovery/` | 用户研究、JTBD、访谈和产品假设 |
| `docs/02-requirements/` | PRD、用户故事、验收条件和追溯矩阵 |
| `docs/03-architecture/` | 系统架构、ADR、接口和部署设计 |
| `docs/04-data-ai/` | 数据模型、Schema、计分、AI 行为与评估 |
| `docs/05-security-privacy/` | 隐私影响、安全威胁和数据治理 |
| `docs/06-testing/` | 测试战略、测试计划和质量报告 |
| `docs/07-release-operations/` | 发布、监控、回滚和运维文档 |
| `docs/08-research/` | 市场、竞品、RAG 和行为科学研究 |
| `docs/09-decisions/` | ADR 与重要产品决策记录 |
| `poc/` | POC 范围、验收和试验结果；通过 G2 前不放实现代码 |
| `presentations/` | 路演、评审和演示材料 |
| `assets/` | 图片、流程图及其他文档资源 |
| `archive/` | 已废弃或被替代的历史文档 |

## 当前主要文档

- [`docs/00-governance/AI-Life-OS-SDLC-Roadmap-v0.1.md`](docs/00-governance/AI-Life-OS-SDLC-Roadmap-v0.1.md)
- [`docs/09-decisions/Roadmap-Review-Decisions-v0.1.md`](docs/09-decisions/Roadmap-Review-Decisions-v0.1.md)（冲突时优先）
- [`docs/09-decisions/G0-Amendment-001-User-Scope-v0.1.md`](docs/09-decisions/G0-Amendment-001-User-Scope-v0.1.md)（修订 DEC-001）
- [`docs/09-decisions/G0-G1-Amendment-002-Life-Dimensions-v0.1.md`](docs/09-decisions/G0-G1-Amendment-002-Life-Dimensions-v0.1.md)（五维与当前关注点分层）
- [`docs/09-decisions/G0-G1-Amendment-003-Behavior-Dimension-Impact-v0.1.md`](docs/09-decisions/G0-G1-Amendment-003-Behavior-Dimension-Impact-v0.1.md)（移除临时关注点并采用五维行为影响模型）
- [`docs/02-requirements/POC-01-Product-UX-Spec-v0.3.md`](docs/02-requirements/POC-01-Product-UX-Spec-v0.3.md)（In Review）
- [`docs/04-data-ai/Capture-Data-AI-Output-Contract-v0.3.md`](docs/04-data-ai/Capture-Data-AI-Output-Contract-v0.3.md)（In Review）
- [`docs/06-testing/POC-01-Test-Acceptance-Spec-v0.3.md`](docs/06-testing/POC-01-Test-Acceptance-Spec-v0.3.md)（In Review）

## 文档约定

- 文件名使用清晰英文名称；正文可以使用中文。
- 正式文档使用 `v0.1`、`v0.2`、`v1.0` 等版本号。
- 评审通过的版本不得直接覆盖；新修改创建新版本或保留变更记录。
- 重要决策记录在 `docs/09-decisions/`。
- 未通过 G1/G2 评审前不进入编码。
