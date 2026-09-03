# GitHub 同步与分支策略 v0.1

**Status:** Active
**Scope:** AI Life OS 产品文档、Agent 规范与项目代码

## 1. 目标

GitHub 私有仓库是 AI Life OS 正式项目资产的远程副本和协作入口，便于在电脑和手机查看文档、代码、提交、评审与 CI 结果。

GitHub 不保存 Hermes 的运行状态，也不作为真实用户数据、密钥或运行数据库的备份位置。

## 2. 纳入版本控制

- 产品愿景、Roadmap、需求、UX、架构和决策文档
- 心理学 Evidence Card 与证据审查记录
- 脱敏后的测试规范和固定测试数据
- Agent 的 Skill 与角色规则源文件
- 未来应用、服务、共享包和自动化测试代码
- 数据库 Schema 与迁移脚本，但不包括真实数据库文件
- CI/CD 工作流、发布说明和不含凭据的部署配置

## 3. 禁止提交

- `.env`、API Key、Token、证书、私钥和部署凭据
- 用户日记、健康、财务、关系或其他真实私人数据
- 未脱敏的日志、会话转录和模型请求/响应转储
- SQLite/PostgreSQL 数据文件、缓存、锁文件和临时文件
- `~/.hermes/` 下的 Profile、Memory、Session、Kanban DB 与运行日志
- 构建产物、依赖目录和本机 IDE 配置

任何敏感数据一旦误提交，应立即停止推送/发布，撤销暴露的凭据，并清理 Git 历史；仅新增 `.gitignore` 不能消除已经进入历史的秘密。

## 4. 同步方式

不采用“每次文件变化即自动提交”。采用任务完成后的受控同步：

```text
Kanban 任务
→ 分支或 worktree
→ 修改并验证
→ 聚焦的 commit
→ push
→ Pull Request
→ 独立评审 + CI
→ 合并 main
```

需求和代码都按这个流程处理。未完成草稿可以推送到独立分支，但不得绕过评审直接进入 `main`。

## 5. 分支约定

- `docs/<topic>`：需求、研究和决策文档
- `feat/<topic>`：新功能
- `fix/<topic>`：缺陷修复
- `test/<topic>`：测试与评估
- `security/<topic>`：安全与隐私变更
- `ci/<topic>`：持续集成和发布流程

## 6. 自动化边界

允许自动执行：

- 验证后提交和推送任务分支
- 创建 Pull Request
- 运行格式、测试、构建和安全检查
- 根据明确缺陷在原分支修复并重新验证
- 部署到批准的 Staging 环境并执行 smoke test

必须人工批准：

- 合并改变产品范围、心理机制或敏感数据用途的需求
- 临床或健康效果声明
- 破坏性数据库迁移
- Production 部署
- 密钥、账单、域名和生产权限变更

## 7. 手机查看

优先查看：

- 仓库首页 `README.md`
- `docs/README.md`
- Pull Requests 与评审意见
- Actions/CI 结果
- Releases 和发布说明

Hermes Kanban 状态保留在本机运行系统中，不通过 GitHub 数据库文件同步。
