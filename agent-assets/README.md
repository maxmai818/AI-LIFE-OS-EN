# Agent Assets

这里保存 AI Life OS 多 Agent 团队的可版本化源文件，便于审查、手机查看和在其他机器重建角色。

包含：

- `skills/`：项目专用 Skill 源文件
- `profiles/`：各 Agent 的 `SOUL.md` 角色规则副本

不包含：

- Profile 的 `.env`、`config.yaml`、记忆、会话或认证信息
- Hermes Kanban 数据库、锁文件和日志
- 任何真实用户数据

运行时 Profile 位于 Hermes 自己的 Profile 目录；此处是可审查的配置源，不是运行状态目录。修改角色规则时，应同步更新运行时文件与本目录，并通过 Pull Request 记录变更。
