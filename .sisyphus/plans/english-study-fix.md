# 英语学习工具：交互修复 + 代码审计 + 文档

## TL;DR

> **Quick Summary**: 修复导致整个 JavaScript 脚本无法执行的 `const` 重复声明语法错误（SyntaxError），全面审计 1832 行单文件代码并修复潜在问题，创建项目架构文档和功能说明，补全 README。
> 
> **Deliverables**:
> - 修复后的 `index.html`（JS 完全正常运行）
> - `doc/architecture.md`（代码架构 + 功能模块 + 技术栈文档）
> - `README.md`（功能特性 + 使用说明 + 本地运行 + 数据管理）
> 
> **Estimated Effort**: Short
> **Parallel Execution**: YES - 2 waves
> **Critical Path**: Task 1 (修复) → Task 2 (审计) → Task 3+4 (文档, 可并行)

---

## Context

### Original Request
用户开发的嵌入式英语学习工具网页存在严重交互失效：所有导航栏切换、按钮点击、设置入口均无响应，但 UI 框架正常渲染。无控制台报错。需要排查修复，并创建项目文档和补充 README。

### Interview Summary
**Key Discussions**:
- 用户确认需要**全面审计 + 修复**（不仅是修一个 bug，还要排查其他潜在问题）
- doc/ 文档需包含：代码架构说明 + 功能模块说明 + 技术栈和依赖
- README 需包含：功能特性列表 + 使用说明 + 本地运行指南 + 数据管理说明

**Research Findings**:
- **根因**: `index.html` L1799 的 `const settings = EST.data.loadSettings();` 与 L1722 声明冲突，导致 SyntaxError: "Identifier 'settings' has already been declared"。语法错误使整个 `<script>` 标签内 JS 完全不执行
- **架构**: 1832 行单文件 SPA，内联 CSS + HTML + JS，全局 `EST` 命名空间，5 个子模块
- **词库**: 225 词嵌入式专业英语，10 个分类，内置在代码中
- **SRS 算法**: 5 级间隔重复（10分钟→1小时→1天→3天→7天）
- **学习模式**: 闪卡、拼写、测验（选择+填空）
- **存储**: 仅使用 localStorage，完全离线

### Metis Review
Metis/Oracle 当前不可用（API key 问题）。Prometheus 基于对全部 1832 行代码的完整审计执行自我分析。

---

## Work Objectives

### Core Objective
修复 `const` 重复声明导致的 SyntaxError，使所有 JavaScript 功能恢复正常；完成代码质量审计；创建项目文档。

### Concrete Deliverables
- `index.html` - 修复后的单文件应用，所有交互正常
- `doc/architecture.md` - 项目架构与功能文档
- `README.md` - 功能说明与使用指南

### Definition of Done
- [x] `index.html` 在浏览器中打开后，导航栏可切换视图
- [x] "开始复习" 按钮可跳转到闪卡模式
- [x] "学习新词" 按钮可跳转到词汇浏览器
- [x] 设置齿轮图标可弹出设置面板
- [x] 控制台无 JS 错误
- [x] `doc/architecture.md` 存在且内容完整
- [x] `README.md` 存在且有实质内容

### Must Have
- 修复 `const settings` 重复声明（L1799）
- 审查并修复代码审计中发现的任何可触发运行时错误的逻辑问题
- `doc/architecture.md` 包含架构、功能、技术栈说明
- `README.md` 包含功能、使用、运行、数据管理说明

### Must NOT Have (Guardrails)
- 不新增任何功能特性
- 不引入任何外部依赖（保持零依赖）
- 不修改 UI 样式和布局
- 不改变数据结构（保持 localStorage 兼容）
- 不添加测试框架或构建工具
- 不在 doc/ 中放置计划文件——计划在 `.sisyphus/plans/`

---

## Verification Strategy (MANDATORY)

> **ZERO HUMAN INTERVENTION** - ALL verification is agent-executed.

### Test Decision
- **Infrastructure exists**: NO
- **Automated tests**: NO
- **Agent-Executed QA**: YES - 使用 Playwright 验证页面交互功能

### QA Policy
Every task MUST include agent-executed QA scenarios.
Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

- **Frontend/UI**: 使用 Playwright — 导航、交互、断言 DOM、截图
- **File Content**: 使用 Bash — 检查文件存在、内容匹配

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately - 修复 + 审计):
├── Task 1: 修复 const 重复声明 SyntaxError [quick]
└── Task 2: 全面代码审计 + 修复潜在问题 [quick]

Wave 2 (After Wave 1 - 文档, MAX PARALLEL):
├── Task 3: 创建 doc/architecture.md [writing]
└── Task 4: 更新 README.md [writing]

Wave FINAL (After ALL tasks):
├── Task F1: Playwright QA 验证 [visual-engineering]
└── Task F2: 文件完整性检查 [quick]
```

Critical Path: Task 1 → Task 2 → (Task 3 || Task 4) → F1, F2
Max Concurrent: 2 (Wave 1, Wave 2)

---

## TODOs

- [x] 1. 修复 const 重复声明 SyntaxError（L1799）

  **What to do**:
  - 在 `index.html` 中找到第 1799 行的 `const settings = EST.data.loadSettings();`
  - 删除 `const` 关键字，改为 `const _settings = EST.data.loadSettings();` 或直接复用 L1722 的 `settings` 变量（推荐后者，直接用 `if(!settings.firstRunComplete)` 替换第 1800 行）
  - 确认 L1722 的 `const settings` 在作用域内可达 L1799 位置
  - 验证修复后整个 JS 脚本可正常执行

  **Must NOT do**:
  - 不要重构 `EST.init()` 函数的整体结构
  - 不要修改 L1722 的 `const settings` 声明位置

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 单行修复，明确位置，无复杂逻辑
  - **Skills**: `[]`
  - **Skills Evaluated but Omitted**: None

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 1 (sequential, must complete before Task 2)
  - **Blocks**: Task 2
  - **Blocked By**: None

  **References** (CRITICAL):
  - `index.html:1714-1830` - EST.init() 完整函数，需要理解 settings 变量的作用域
  - `index.html:1722` - `const settings = EST.data.loadSettings();` 第一次声明
  - `index.html:1798-1800` - `// First-run welcome` 段，包含重复声明
  - `index.html:1822-1826` - `EST.ui.completeFirstRun()` 函数，理解 firstRunComplete 逻辑

  **Acceptance Criteria**:
  - [ ] `index.html` 中不再有任何 `const` 标识符重复声明的语法错误
  - [ ] 在浏览器中打开 `index.html`，控制台出现 `EST initialized v1` 日志
  - [ ] 页面底部首页统计数据不再是纯 0（应显示 225 总词数）

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: JS 脚本正常初始化
    Tool: Playwright
    Preconditions: localStorage 已清空（首次运行模拟）
    Steps:
      1. 导航到 file:// 路径下的 index.html
      2. 等待页面加载完成（waitForLoadState 'domcontentloaded'）
      3. 检查控制台日志：page.on('console', msg => ...) 捕获
      4. 断言 console 中出现 'EST initialized v1'
    Expected Result: 控制台日志中包含 'EST initialized v1'，无 SyntaxError
    Failure Indicators: 控制台出现 SyntaxError 或没有任何 EST 相关日志
    Evidence: .sisyphus/evidence/task-1-init-success.png

  Scenario: 首页数据正确加载（非零值）
    Tool: Playwright
    Preconditions: 首次运行，localStorage 清空
    Steps:
      1. 导航到 index.html
      2. 等待 #stat-due 元素可见
      3. 读取 #stat-due 文本内容
      4. 读取 #stat-mastery 文本内容
    Expected Result: stat-due 和 stat-mastery 有数值（即使为 0 也是合法的首次运行状态），关键是元素文本不是空白
    Evidence: .sisyphus/evidence/task-1-home-stats.png
  ```

  **Evidence to Capture**:
  - [ ] `task-1-init-success.png` - 首页截图，显示正常渲染 + 数值
  - [ ] `task-1-home-stats.png` - 控制台截图或日志

  **Commit**: YES (独立提交)
  - Message: `fix: resolve const redeclaration SyntaxError blocking all JS execution`
  - Files: `index.html`
  - Pre-commit: `git diff --check`

- [x] 2. 全面代码审计 + 修复潜在问题

  **What to do**:
  审读全部 1832 行代码，识别并修复以下类别的问题：

  **A. 逻辑缺陷**（可能导致运行时错误）:
  - 检查 `EST.data.initVocab()` 中 L805 `vocab.forEach()` — 确保 `vocab` 始终为数组
  - 检查 `EST.srs.updateLevel()` 中 L880-909 — 验证 `state[wordId]` 的 null 保护已到位（L882 已有检查）
  - 检查 quiz `generateQuestion()` L1433 — 当 pool 极小时 distractor 生成逻辑是否会产生重复选项

  **B. 事件处理问题**:
  - L1741 设置面板背景点击处理 — 检查是否需要 `e.stopPropagation()` 防止误触发
  - L1230 flashcard 翻牌 — 确认 `this.flipped` 标志在 rapid clicks 时不会竞态
  - L1786 键盘快捷键 — 确认 Space 键在闪卡模式下不会与页面滚动冲突（已 `e.preventDefault()`）

  **C. 错误处理增强**:
  - L1260 `speak()` — 为 `SpeechSynthesisUtterance` 添加 try/catch（某些浏览器可能抛出）
  - 考虑在 `EST.init()` 顶部添加全局 `window.onerror` 用于捕获未处理异常

  **D. 代码卫生**:
  - 检查是否有未使用的变量或重复代码
  - 确认所有 `innerHTML` 赋值使用了 `EST.utils.escapeHtml()`（防止 XSS，即使当前无外部输入）
  - 验证 localStorage key 命名一致性

  **Must NOT do**:
  - 不要重构或改变任何公共 API 签名
  - 不要添加不必要的注释（代码已足够清晰）
  - 不要引入任何新依赖或构建步骤

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 代码审读 + 针对性小修复，改动点分散但每个都很小
  - **Skills**: `[]`
  - **Skills Evaluated but Omitted**: None

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 1 (必须在 Task 1 之后，因为需要 JS 可执行才能验证修复)
  - **Blocks**: Task 3, Task 4（文档任务需要知道最终代码状态）
  - **Blocked By**: Task 1

  **References** (CRITICAL):
  - `index.html:446-1830` - 全部 JS 代码范围
  - `index.html:796-826` - `EST.data.initVocab()` 词汇初始化
  - `index.html:831-954` - SRS 引擎完整实现
  - `index.html:1167-1296` - Flashcard 模式
  - `index.html:1298-1401` - Spelling 模式
  - `index.html:1403-1600` - Quiz 模式
  - `index.html:1714-1830` - 初始化和事件绑定

  **Acceptance Criteria**:
  - [ ] 审计报告列出所有发现的问题及修复/不修复理由
  - [ ] 任何实际修复均有对应的代码变更
  - [ ] 修复后所有 QA 场景（见 Task 1）仍然通过

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: 审计后闪卡模式正常工作
    Tool: Playwright
    Preconditions: 首次运行，localStorage 清空
    Steps:
      1. 导航到 index.html
      2. 点击导航栏 "闪卡" 标签 (selector: .nav-tab[data-view="flashcard"])
      3. 等待 #flashcard-content 更新
      4. 点击 flashcard 元素 (#flashcard-el) 翻转卡片
      5. 断言 card 有 .flipped class
    Expected Result: 卡片翻转显示英文单词，评级按钮可见
    Evidence: .sisyphus/evidence/task-2-flashcard-flip.png

  Scenario: 审计后设置面板可正常打开和关闭
    Tool: Playwright
    Preconditions: 首次运行
    Steps:
      1. 导航到 index.html
      2. 点击设置按钮 (#btn-settings)
      3. 断言设置面板 (.modal-overlay.active #settings-content) 可见
      4. 点击 "关闭" 按钮 (#btn-settings-close)
      5. 断言设置面板不可见 (.modal-overlay:not(.active))
    Expected Result: 设置面板正常弹出和关闭，无错误
    Evidence: .sisyphus/evidence/task-2-settings-panel.png

  Scenario: 审计后拼写模式正常渲染
    Tool: Playwright
    Preconditions: 首次运行
    Steps:
      1. 导航到 index.html
      2. 点击导航栏 "词汇" 标签，确认词汇列表出现（数据已初始化）
      3. 点击导航栏 "拼写" 标签
      4. 断言拼写输入框 (#spell-input) 存在且为 enabled
    Expected Result: 拼写模式有输入框可用（即使队列为空也可能显示空状态）
    Evidence: .sisyphus/evidence/task-2-spelling-ready.png
  ```

  **Evidence to Capture**:
  - [ ] `task-2-audit-report.txt` - 审计发现和修复记录
  - [ ] `task-2-flashcard-flip.png` - 闪卡翻转截图
  - [ ] `task-2-settings-panel.png` - 设置面板截图
  - [ ] `task-2-spelling-ready.png` - 拼写模式截图

  **Commit**: YES (独立提交)
  - Message: `fix: code audit - error handling, edge case guards, code hygiene`
  - Files: `index.html`
  - Pre-commit: `git diff --check`

- [x] 3. 创建 doc/architecture.md — 代码架构与功能文档

  **What to do**:
  创建 `doc/architecture.md` 文件，包含以下三部分：

  **Part 1 — 代码架构说明**:
  - 项目概述：单文件 SPA，无外部依赖，通过 file:// 协议离线运行
  - 文件结构：`index.html` 包含内联 CSS + HTML + JS 三部分
  - 命名空间架构：`window.EST` → 6 个子模块（`data`, `srs`, `ui`, `modes`, `stats`, `utils`）
  - 每个子模块的职责描述和关键函数
  - 数据流图（文字描述）：DOM事件 → EST.ui.switchView → 各 mode.start → 更新 DOM / 调用 EST.srs → 写 localStorage

  **Part 2 — 功能模块说明**:
  - **闪卡模式** (`EST.modes.flashcard`): 工作原理、翻牌机制、5 级自评、空格键快捷键
  - **拼写模式** (`EST.modes.spelling`): 输入校验、字符级别差异高亮、Enter 快捷提交
  - **测验模式** (`EST.modes.quiz`): 选择题（中→英 / 英→中）+ 填空题混合、错题回顾
  - **词汇浏览器** (`EST.ui.refreshVocabList`): 搜索、分类/等级过滤、点击查看详情
  - **统计面板** (`EST.ui.refreshStats`): 等级分布条形图、学习日历
  - **设置面板**: 每日目标、复习方向、主题、字号、测验数量、自动发音
  - **数据管理**: 导入/导出 JSON、重置

  **Part 3 — 技术栈和依赖**:
  - 纯 HTML5 + CSS3 + Vanilla JavaScript (ES6+)
  - 无框架、无构建工具、无 npm 依赖
  - 浏览器 API: localStorage、SpeechSynthesis、FileReader、Blob/URL
  - 兼容性：所有现代浏览器（Chrome/Firefox/Edge/Safari）
  - 离线 PWA 能力（通过 Service Worker 可进一步实现）

  **Must NOT do**:
  - 不要抄袭 README 内容——doc 侧重技术架构，README 侧重用户面向
  - 不要包含任何实现代码片段（除非是架构示意）
  - 不要超过 500 行

  **Recommended Agent Profile**:
  - **Category**: `writing`
    - Reason: 纯文档编写任务，基于已审计完毕的代码生成
  - **Skills**: `[]`
  - **Skills Evaluated but Omitted**: None

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (与 Task 4 同时执行)
  - **Blocks**: None
  - **Blocked By**: Task 2（需要审计完成后确认最终代码状态）

  **References** (CRITICAL):
  - `index.html:446-1830` - 完整 JS 代码，作为文档的源码参考
  - `index.html:1-43` - CSS 变量定义（主题系统）
  - `index.html:536-781` - 内置词库数据结构
  - `index.html:831-954` - SRS 算法实现

  **Acceptance Criteria**:
  - [ ] 文件存在于 `doc/architecture.md`
  - [ ] 包含代码架构、功能模块、技术栈三个主要章节
  - [ ] 每个章节有实质性内容（非空段落）

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: 文档文件存在且包含关键内容
    Tool: Bash (grep)
    Preconditions: Task 2 已完成
    Steps:
      1. Test-Path -LiteralPath "doc/architecture.md" → 返回 True
      2. Select-String -Path "doc/architecture.md" -Pattern "EST" → 返回匹配行
      3. Select-String -Path "doc/architecture.md" -Pattern "SRS" → 返回匹配行
      4. Select-String -Path "doc/architecture.md" -Pattern "闪卡" → 返回匹配行
    Expected Result: 文件存在，包含 EST、SRS、闪卡等关键术语
    Failure Indicators: 文件不存在或关键术语缺失
    Evidence: .sisyphus/evidence/task-3-doc-exists.txt
  ```

  **Evidence to Capture**:
  - [ ] `task-3-doc-exists.txt` - grep 搜索结果

  **Commit**: NO（与 Task 4 合并提交）

- [x] 4. 更新 README.md — 功能说明与使用指南

  **What to do**:
  重写 `README.md`（当前为空文件），包含以下四部分：

  **Part 1 — 功能特性列表**:
  - 🏠 学习概览仪表盘（待复习/今日已学/连续天数/掌握率）
  - 📚 225 词嵌入式专业英语词库（10 个分类）
  - 🔄 闪卡模式 — 间隔重复（SRS），看中文回忆英文，自评掌握度
  - ✍️ 拼写模式 — 根据释义输入单词，字符级差异高亮
  - 📝 测验模式 — 选择题+填空题混合，错题回顾
  - 🔍 词汇浏览器 — 全文搜索、分类/等级过滤
  - 📊 学习统计 — 等级分布、学习日历、掌握率趋势
  - ⚙️ 丰富设置 — 每日目标、主题切换、字号调节
  - 📦 数据导入/导出 — JSON 格式备份还原
  - 🔒 完全离线 — 数据存储在本地浏览器，无需网络

  **Part 2 — 使用说明**:
  - 闪卡模式：选择导航栏「闪卡」→ 看中文释义 → 点击卡片或按空格翻转 → 自评 1-5 级
  - 拼写模式：选择「拼写」→ 看中文释义 → 输入英文 → 提交（Enter 键）
  - 测验模式：选择「测验」→ 点击「开始测验」→ 选择题 + 填空题 → 查看得分和错题
  - 词汇浏览：选择「词汇」→ 搜索或筛选 → 点击单词查看详情
  - 键盘快捷键：Space 翻牌 | 1-5 评级 | Escape 关闭弹窗

  **Part 3 — 本地运行指南**:
  - 方法 1（推荐）：用任意浏览器直接打开 `index.html`（file:// 协议）
  - 方法 2：用 VS Code Live Server 或其他本地 HTTP 服务器
  - 注意：首次打开需等待词库初始化（会自动存入 localStorage）

  **Part 4 — 数据管理说明**:
  - 数据位置：浏览器 localStorage
  - 导出：设置 → 导出数据 → 下载 JSON 文件
  - 导入：设置 → 导入数据 → 选择 JSON 文件
  - 重置：设置 → 重置所有数据 → 确认 → 页面刷新
  - 备份建议：定期导出 JSON 文件以防浏览器数据丢失

  **Must NOT do**:
  - 不要包含 emoji 以外的装饰性图标（保持简洁）
  - 不要超过 150 行
  - 不要包含代码示例（README 是用户文档，不是技术文档）

  **Recommended Agent Profile**:
  - **Category**: `writing`
    - Reason: 纯文档编写任务，面向最终用户的 README
  - **Skills**: `[]`
  - **Skills Evaluated but Omitted**: None

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (与 Task 3 同时执行)
  - **Blocks**: None
  - **Blocked By**: Task 2（需要审计完成后确认功能完整性）

  **References** (CRITICAL):
  - `index.html:1-1832` - 完整源码，了解所有功能以准确描述
  - `index.html:222-369` - HTML 结构（导航、视图布局）
  - `index.html:1167-1600` - 学习模式实现

  **Acceptance Criteria**:
  - [ ] `README.md` 不再是空文件（非 0 字节）
  - [ ] 包含功能特性、使用说明、运行指南、数据管理四个章节标题
  - [ ] 每个章节有至少 3 行实质性内容

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: README 文件非空且包含关键章节
    Tool: Bash (grep)
    Preconditions: Task 2 已完成
    Steps:
      1. (Get-Item "README.md").Length → 非 0
      2. Select-String -Path "README.md" -Pattern "功能特性" → 返回匹配行
      3. Select-String -Path "README.md" -Pattern "使用说明" → 返回匹配行
      4. Select-String -Path "README.md" -Pattern "运行" → 返回匹配行
    Expected Result: 文件 > 0 字节，包含所有必需章节
    Failure Indicators: 文件空或缺少关键章节
    Evidence: .sisyphus/evidence/task-4-readme-exists.txt
  ```

  **Evidence to Capture**:
  - [ ] `task-4-readme-exists.txt` - grep 搜索结果

  **Commit**: YES（与 Task 3 合并提交）
  - Message: `docs: add architecture documentation and update README`
  - Files: `doc/architecture.md`, `README.md`

---

## Final Verification Wave (MANDATORY — after ALL implementation tasks)

> 2 个验证任务并行运行。ALL must APPROVE.

- [x] F1. **Playwright 端到端 QA** — `visual-engineering` (+ `playwright` skill)
  从零开始完整验证所有交互功能：
  1. 导航到 index.html（首次运行状态）
  2. 检查首页数据渲染（非空数值）
  3. 点击每个导航标签（闪卡/拼写/测验/词汇/统计），验证视图正确切换
  4. 点击"开始复习"按钮 → 验证跳转到闪卡视图
  5. 点击"学习新词"按钮 → 验证跳转到词汇视图
  6. 点击设置齿轮 → 验证设置面板弹出 → 关闭面板
  7. 检查控制台无错误
  8. 截图保存到 `.sisyphus/evidence/final-qa/`
  Output: `Scenarios [N/N pass] | Console Errors [0] | VERDICT: APPROVE/REJECT`

- [x] F2. **文件完整性检查** — `quick`
  1. 验证 `index.html` 存在且大小 > 50KB（确保修复后未丢失内容）
  2. 验证 `doc/architecture.md` 存在且 > 500 字节
  3. 验证 `README.md` 存在且 > 500 字节
  4. 运行 `git diff --stat` 确认改动范围合理
  5. 检查 `doc/` 目录不包含计划文件（计划在 `.sisyphus/plans/`）
  Output: `index.html [PASS/FAIL] | doc/ [PASS/FAIL] | README [PASS/FAIL] | VERDICT`

---

## Commit Strategy

- **Commit 1** (Task 1): `fix: resolve const redeclaration SyntaxError blocking all JS execution` — `index.html`
- **Commit 2** (Task 2): `fix: code audit - error handling, edge case guards, code hygiene` — `index.html`
- **Commit 3** (Task 3+4): `docs: add architecture documentation and update README` — `doc/architecture.md`, `README.md`

---

## Success Criteria

### Verification Commands
```powershell
# 文件完整性检查
Get-Item index.html | Select-Object Length
Get-Item doc/architecture.md | Select-Object Length
Get-Item README.md | Select-Object Length

# Git 状态检查
git diff --stat
```

### Final Checklist
- [x] index.html 在浏览器中无 JS 错误，所有交互正常
- [x] 导航栏 6 个标签均可切换
- [x] "开始复习" 和 "学习新词" 按钮可跳转
- [x] 设置面板可打开/关闭/保存
- [x] doc/architecture.md 包含架构、功能、技术栈说明
- [x] README.md 包含功能、使用、运行、数据管理说明
