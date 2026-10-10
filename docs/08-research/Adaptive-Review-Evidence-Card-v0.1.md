# Adaptive Review Evidence Card v0.1

- **状态**：In Review；作者建议 EXPERIMENT_ONLY，非独立批准
- **作者**：Hermes（行为科学产品分析，不是持证临床身份）
- **负责人 / 产品批准人**：Max
- **Gate**：G1；编码未授权；独立心理安全评审 Pending
- **日期 / 来源重取日期**：2026-09-15
- **对应**：[Decision 006](../09-decisions/G1-Decision-006-Adaptive-Review-v0.1.md)、[Product v0.6 第 14 节](../02-requirements/POC-01-Product-UX-Spec-v0.6.md)、[Data v0.6 第 14 节](../04-data-ai/Capture-Data-AI-Output-Contract-v0.6.md)、[Test v0.6 第 19 节](../06-testing/POC-01-Test-Acceptance-Spec-v0.6.md)

## 1. 建议与证据边界

只在用户主动打开 Review 时试验轻量、可拒绝的情境指导，保留不干预路径。优先检验自主性、纠错成本和负担，不能把信任、打开次数或接受率视为有效性。指导算法、字段和保留期限全部是待审产品设计，不是以下论文验证的参数。

Sheeran 等的 SDT 健康行为 RCT 元分析报告显著但较小的健康行为改变效应；这是健康干预证据，不是 AI 教练、自适应策略或 Max 个人有效性的直接证明。[1]

JITAI 文献将随个人内部与情境状态变化调整支持类型/数量/时间作为设计概念；本产品仅借鉴情境匹配，不因此获得传感器、主动触达或后台监控授权。[2]

COM-B 框架把能力、机会和动机并列为行为条件；据此提出“先核查限制、不预设懒惰”的设计假设，但框架本身没有验证本产品的指导选择器。[3]

### 来源强度与迁移距离

| 来源 / 机制 | 源证据级别 | 人群/场景与结果 | 限制与产品迁移 |
|---|---|---|---|
| SDT / 自主支持 | A（元分析） | 健康行为 RCT；总体效应小 [1] | 非本产品用户；本次读到仓库摘要而非完整元分析，不能推出 AI 个体收益；迁移远，交互仍 E |
| JITAI / 情境匹配 | C（理论与设计框架） | 移动健康的动态支持概念 [2] | 非 AI Life OS 随机对照结果；不借此声称主动介入有效；本次支持方式策略仍 E |
| COM-B / 障碍澄清、任务拆解 | C（框架） | 行为干预设计中的能力/机会/动机模型 [3] | 不是个人诊断工具；日记稀疏，推断可错；对 Review 的应用仍 E |
| 自适应指导改善信任/触点/真实结果 | E（未验证产品假设） | 尚无本产品结果 | 同意可能是礼貌/迎合，接受不是实施，相关不是因果；可失败且应允许停止 |

## 2. Evidence Card

```yaml
feature_name: user-opened adaptive Review coaching and feedback
product:
  name: AI Life OS
  stage: G1 In Review; coding not authorized
  target_users: Max POC; independent private accounts only after isolation gates
  positioning: non-clinical reflection and self-directed action support
  platform: mobile-first responsive web
  privacy_level: sensitive personal records; least context; no new sensitive inference use
  business_goal: evaluate user benefit, not compliance or dependency
  release_scope: documentation proposal; no implementation or release
problem:
  user_report: 用户希望轻量情境适应，不要必选人格；允许零建议和自然反馈
  observations: 只有需求讨论摘要和仓库文档；无真实产品行为或效力数据
  inferences: 情境匹配与可纠错解释可能减少不合时宜建议；尚未验证
  unknowns: 哪种支持对何种情境有效、负担、误解率、长期影响、隐私可兑现性
feature:
  proposed_solution: 用户打开 Review 后按受限证据选择支持方式；直接督促仅在用户本次明确请求时可选；保存实际指导及可选反馈
  trigger: user-opened Review only
  data_collected: proposed guidance, typed optional feedback, confirmed scoped patterns and provenance
  prohibited_designs: proactive surveillance, mandatory ratings, shame, failure-count escalation, online RL
  expected_outcome: 自主理解或自选下一步，允许不改变

target_behavior:
  actor: 当前用户
  context: 主动打开一个周期的 Review
  action: 自主选择仅回顾或一个下一步，可按需理解依据或纠正
  frequency: 每次主动 Review；不设必达次数、不主动催促
  completion_definition: 自主结束或保留一个用户选择的步骤；不是必须行动或同意 AI
behavior_diagnosis:
  capability: 任务是否过大、理解或精力限制未知；只按明确自报和记录提出假设
  opportunity: 时间、照护、资源等限制待核验；不归因为动机不足
  motivation: 当次改变意愿由用户表达，不凭缺失日志推断
  confidence: low until context and user confirmation; no clinical diagnosis
candidate_mechanisms:
  - mechanism: 倾听、澄清、零建议保留自主
    theory: SDT autonomy-support translation
    evidence_level: source A; product application E
    expected_effect: 可能减少评判感和不必要负担
    boundary_conditions: 用户不想改变或意图含糊时；不强行以自主之名追问
    transfer_distance: far; health trials are not AI coaching validation
    sources: source-1
  - mechanism: 识别能力/机会限制后提议一个可逆步骤
    theory: COM-B diagnostic framing
    evidence_level: source C; product application E
    expected_effect: 可能改善步骤与实际约束的匹配
    boundary_conditions: 用户明确想行动且证据支持；不得把限制解释为懒惰
    transfer_distance: far; framework is not an individual selector trial
    sources: source-3
  - mechanism: 版本化情境策略选择支持方式与直接程度
    theory: JITAI contextual adaptation design reference
    evidence_level: source C; product application E
    expected_effect: 可能减少不合时宜表达
    boundary_conditions: 仅用户主动 Review 且本次明确请求直接督促；历史反馈/偏好不得单独授权；不使用传感器或主动提醒
    transfer_distance: far; timing adaptation narrowed to a user-opened session
    sources: source-2
recommended_interaction:
  trigger: 用户打开 Review
  user_choice: 零或一个改变；反馈可跳过；无需先选人格
  ai_response: 五维证据先行；按证据选择倾听/澄清/拆解/不干预，只有用户本次明确请求时才可直接督促
  feedback: 区分事实纠正、解释分歧、风格、接受、实际结果；可修订
  adjustment: 当前纠正立即生效；长期模式另需明确范围确认
  exit_option: 随时停止；不追问、不后台跟进

autonomy_review:
  meaningful_choice: 不改变、不同意、撤回和退出均是完整路径
  ai_overreach: 不改用户目标承诺；确认不将推断变成事实
  coercive_elements: 禁止羞耻、威胁、失败次数加压、同意率优化
risk_review:
  shame: 以情境和障碍表达；测试自责与被评判感，出现不可接受负担即停
  anxiety: 不显示压力阶梯、不催促记录；缺失不等于失败
  dependency: 不优化接触频次或依赖，不替代现实判断与支持；增长不证明效益
  overinterpretation: 未确认模式不入长期检索，范围/版本变化重新确认
  privacy: 有界保留/删除/派生副本失效待审；供应商未批仅合成数据
  clinical: 停止普通指导；另行批准安全协议，无协议则 CLINICAL_REVIEW
  accessibility_and_equity: 允许跳过/自由文本/零建议，不将资源或表达差异归因为懒惰
measurement:
  primary_metric: 自主理解或自主选择的可观察完成情况，报告缺失而非强制评分
  secondary_metrics: 可选帮助程度、能力感、负担、纠错成本、可追溯性、实际结果单独记录
  guardrail_metrics: 压力、自责、羞耻、依赖、错误推断、停止失效、隐私事件
  qualitative_questions: 为什么这种指导合适或不合适？能否选择不改变？解释增加理解还是负担？
experiment:
  hypothesis: 情境化支持可能优于同样尊重自主的非自适应 Review，且不恶化自主感与负担
  minimum_test: 先逐条走查 COA-001至014；获 G1/G2与隐私许可后提议两周至少两次主动Review观察
  success_threshold: 安全硬约束零违例；用户认为更有帮助且不恶化自主/负担；效力阈值需另批
  stop_conditions: 用户要求停止、不可接受负担、隐私/自主越界、无协议的临床危机场景
verdict:
  status: EXPERIMENT_ONLY
  confidence: low for product efficacy; principled safety constraints do not establish benefit
  required_changes: independent consistency and psychology/privacy review; Max approval of detailed proposals
  unresolved_assumptions: 选择策略有效性、长期模式泛化风险、数值期限、供应商保留、实验阈值
  next_owner: Max specifies independent reviewer; creator cannot approve
```

## 3. 五类反证走查计划（未执行实验）

1. 自主目标：步骤帮助不能变成 AI 新承诺。
2. 原因不明的拖延：澄清/不干预不能变成懒惰标签。
3. 家庭或社会压力目标：不替用户决定人生方向，不强迫服从外部目标。
4. 反复未完成伴自责：不按次数升级压力，检查能力/机会约束。
5. 可能临床或危机语言：停止普通指导，未批准协议时阻断真实试用。

对应 COA-003/004/013。任何一例安全失败，都不能被高接受率抵销。此卡由作者编写，独立审查 Pending，不属于已运行研究或 PASS 结论。

## 4. 检索与证据限制

SDT 页面首次 web_extract 成功取得摘要；后续重取仅部分内容，直接 HTTP 返回 403。保留首次成功摘要的精确证据摘录，不声称读过全文。PMC 后续摘要提取过窄，改用直接 HTTP 获取全文并核对相应段落。以下 Sources 由任务独立 citation ledger 生成；每个引用附经文本匹配的短摘录。所有产品设计推论均标为提案/假设。

## Sources

[1] https://research.birmingham.ac.uk/en/publications/self-determination-theory-interventions-for-health-behavior-chang — Self-determination theory interventions for health behavior change: Meta-analysis and meta-analytic structural equation modeling of randomized controlled trials
      -  University of Birmingham
    > "Conclusion: The present review indicates that SDT interventions have a significant but small effect on health behavior change and suggests several directions for future research."
[2] https://pmc.ncbi.nlm.nih.gov/articles/PMC5364076 — Just-in-Time Adaptive Interventions (JITAIs) in Mobile Health: Key Components and Design Principles for Ongoing Health Behavior Support - PMC
    > "The just-in-time adaptive intervention (JITAI) is an intervention design aiming to provide the right type/amount of support, at the right time, by adapting to an individual’s changing internal and contextual state."
[3] https://pmc.ncbi.nlm.nih.gov/articles/PMC3096582 — The behaviour change wheel: A new method for characterising and designing behaviour change interventions - PMC
    > "At the centre of a proposed new framework is a 'behaviour system' involving three essential conditions: capability, opportunity, and motivation (what we term the 'COM-B system')."
