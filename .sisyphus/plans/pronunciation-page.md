# Plan: 发音学习页面完整实现

## TL;DR

> **Quick Summary**: 替换当前 `renderPronunciationPage()` 的登录提示卡片，实现完整的发音学习功能页面，包含在线点读（新概念英语4册课程网格 + 听力资源占位）和音标学习（26字母发音、48国际音标表、音标学习含视频）两大模块。
>
> **Deliverables**:
> - `index.html` — 新增 ~500-700 行 CSS + JS 代码
>
> **Estimated Effort**: **Large** (5 tasks)
> **Execution Strategy**: Sequential (single-file SPA, all changes in one file)
> **Branch**: `scheme-two`

---

## Context

### Original Request
用户更新了 `doc/开发描述文档.md`，新增 Section 9.5（发音学习功能详细描述）和 Section 10（发音学习页面详细描述）。需要将当前发音学习页面的登录提示卡片替换为完整功能页面。

### Interview Summary
**Key Discussions**:
- **数据来源**: 硬编码 JS 对象（骨架 UI 优先，后续接入 API）
- **NCE 音频**: Web Speech API 朗读课文文本（无版权问题）
- **IPA 发音**: Vocabulary.com CDN MP3 音频
- **跟读练习**: ❌ 本次不包含（明确 OUT of scope）
- **课程卡片点击**: Toast "功能开发中"
- **展开行为**: 独立展开（非手风琴）
- **测试**: 无单元测试，仅 Agent QA 场景验证

**Research Findings**:
- **IPA 音频 CDN**: Vocabulary.com 提供免费音标 MP3 — `https://cdn.vocabulary.com/media/dictionary/ipa/{type}/{symbol}.mp3`（type: consonants/vowels/diphthongs）
- **NCE Book1**: 144课 → 72卡片（每两课配对）；Book2: 96课→48卡；Book3: 60课→30卡；Book4: 48课→24卡
- **现有代码**: `renderPronunciationPage()` 在 lines 1588-1609，CSS 在 lines 432-523
- **现有音频模式**: Web Speech API (`SpeechSynthesisUtterance`) via `attachSpeaker()` helper

### Metis Review
**Identified Gaps** (addressed):
- **跟读练习**: 明确标记为 OUT of scope
- **课程卡片点击行为**: 确认 Toast placeholder
- **NCE 音频来源**: Web Speech API 方案
- **事件重绑定**: 需在 switchPage('pronunciation') 时重绑定

---

## Work Objectives

### Core Objective
替换当前 `renderPronunciationPage()` 的登录提示卡片，实现完整的发音学习功能页面。

### Concrete Deliverables
- 发音学习页面完整 UI（CSS + HTML 结构 + JS 渲染逻辑）
- 顶部标签切换（在线点读 / 音标学习）
- 在线点读模块（新概念英语4册课程网格 + 听力资源占位网格）
- 音标学习模块（26字母发音 + 48音标表 + 音标学习含视频展开列表）
- IPA 音标音频播放（Vocabulary.com CDN + Web Speech API 降级）
- 深色模式适配

### Definition of Done
- [ ] 点击「发音学习」导航项 → 渲染完整发音学习页面（非登录卡片）
- [ ] 顶部 在线点读/音标学习 标签切换正常
- [ ] 新概念英语4册课程卡片网格正常渲染（72+48+30+24=174卡）
- [ ] 音标学习3个子模块全部正常渲染
- [ ] 切回首页再回到发音页面 → 状态恢复，事件正常
- [ ] 深色模式下所有元素可见
- [ ] 控制台无 JS 错误

### Must Have
- 替换 `renderPronunciationPage()` 和所有 `.pronunciation-*` CSS
- 所有子标签切换在 `renderPronunciationPage()` 内部控制
- `switchPage('pronunciation')` 接口不变
- 使用现有 CSS 变量系统 (`--color-card`, `--color-text-primary` 等)
- 音频播放防重叠（cancel 模式）
- Toast 通知而非 console.log

### Must NOT Have (Guardrails)
- 不实现跟读练习/录音/评分功能
- 不包含真实 NCE 音频文件
- 不包含真实视频内容（灰色文字占位）
- 不修改首页、侧边栏、主题切换、OED 搜索功能
- 不添加新的 `keykey_*` localStorage 键
- 不添加 npm 包或外部依赖
- 不修改 switchPage() 以外的页面路由逻辑

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.

### Test Decision
- **Automated tests**: None (pure UI pages)
- **Agent QA**: YES — Playwright QA scenarios for all tasks
- **Evidence**: `.sisyphus/evidence/task-{N}-{scenario-slug}.png`

### QA Policy
Every task MUST include agent-executed QA scenarios. Scenarios verify:
- **Tab switching**: Click tab → assert active class + visible content
- **Grid rendering**: Assert correct card count per volume
- **Audio playback**: Click phoneme → assert no error
- **Dark mode**: Toggle theme → assert visible elements
- **Navigation**: Home→Pronunciation→Home → assert no breakage

---

## Execution Strategy

### Parallel Execution Waves

> This is a single-file SPA — all changes go into `index.html`.
> Tasks are sequential with some parallelization within waves.

```
Wave 1 (Foundation):
├── T1: CSS for all pronunciation page components [visual-engineering]
└── T2: JS data objects (NCE courses, 26 letters, 48 phonemes, learning data) [quick]

Wave 2 (Page Structure + All Content Modules):
├── T3: Audio utilities + page structure + top tab navigation [visual-engineering]
├── T4: 在线点读 + 听力资源 module rendering [unspecified-high]
└── T5: 音标学习 rendering (26字母 + 48音标 + 含视频) [unspecified-high]

Wave 3 (Integration — depends on T4 & T5):
├── T6: Integration — switchPage update + old code cleanup [quick]

Wave FINAL (Verification):
├── F1: Plan Compliance Audit (oracle)
├── F2: Code Quality Review (unspecified-high)
├── F3: Full QA Execution (unspecified-high + playwright)
└── F4: Scope Fidelity Check (deep)
```

---

## TODOs

- [ ] 1. **CSS — 发音学习页面所有组件样式**

  **What to do**:
  - 替换现有 `.pronunciation-*` CSS（lines 432-523）为全新样式
  - 新增样式包含：
    - `.pronunciation-page` — 主容器
    - `.pronunciation-top-tabs` — 顶部标签导航（在线点读/音标学习）
    - `.pronunciation-tab` — 标签按钮样式
    - `.pronunciation-tab.active` — 激活态：黑色加粗，底部下划线
    - `.pronunciation-content` — 内容区域
    - `.pronunciation-section` — 模块容器（在线点读、音标学习）
    - `.pronunciation-sub-tabs` — 二级标签栏（右上角排列）
    - `.pronunciation-sub-tab` — 二级标签样式
    - `.pronunciation-sub-tab.active` — 二级标签激活态
    - `.pronunciation-volume-selector` — 册数选择器行
    - `.pronunciation-volume-btn` — 册数按钮样式
    - `.pronunciation-volume-btn.active` — 激活状态
    - `.pronunciation-grid` — 3列网格布局
    - `.pronunciation-card` — 课程卡片样式（白色背景，圆角，淡边框，hover 灰色背景）
    - `.pronunciation-card-title` — 卡片标题 "第X&Y课"
    - `.pronunciation-card-subtitle` — 卡片副标题（英文）
    - `.letter-card` — 字母卡片（上白下彩）
    - `.letter-card-top` — 上半部分（大写+小写字母）
    - `.letter-card-bottom` — 下半部分（彩色条 + 音标）
    - `.phoneme-category` — 音标分类标题
    - `.phoneme-grid` — 音标网格（teal 卡片）
    - `.phoneme-card` — 音标卡片（青绿色背景，白色文字，圆角）
    - `.phoneme-learning-item` — 音标学习项目（列表布局）
    - `.phoneme-learning-expand` — 展开区域（视频占位）
    - `.pronunciation-hint` — 提示文字样式
    - `.pronunciation-copyright` — 版权说明样式（浅蓝背景）
  - 所有样式使用 `var(--color-*)` CSS 变量
  - 深色模式适配：`[data-theme="dark"]` 覆盖
  - 颜色区分：26字母下半部分的彩色条使用不同颜色（按字母顺序渐变或预定义色板）
  - 确保 IPA 符号在系统字体下正确渲染（font-family 包含支持 IPA 的字体）

  **Must NOT do**:
  - 不要添加动画/过渡效果（保持极简风格）
  - 不要添加移动端媒体查询
  - 不要修改现有非发音学习的 CSS

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: 纯 CSS 样式编写，需与现有设计系统保持一致
  - **Skills**: None needed
  - **Skills Evaluated but Omitted**:
    - None

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with T2)
  - **Blocks**: T3, T4, T5, T6
  - **Blocked By**: None

  **References**:
  - `index.html:7-1100` — 现有 CSS 样式（参考设计模式、变量命名、颜色系统）
  - `index.html:432-523` — 旧 pronunciation CSS（将被替换，确认引用关系）
  - `index.html:109-113` — `:root` / `[data-theme="dark"]` CSS 变量定义
  - 设计规范：Section 10 of `doc/开发描述文档.md`

  **Acceptance Criteria**:
  - [ ] 所有新 CSS 使用 `var(--color-*)` 变量
  - [ ] 深色模式 `[data-theme="dark"]` 覆盖齐备
  - [ ] 旧 `.pronunciation-*` CSS 被完全替换（无残留）
  - [ ] 无其他文件引用旧的 pronunciation CSS class

  **QA Scenarios**:
  ```
  Scenario: CSS 变量一致性检查
    Tool: Bash (grep)
    Steps:
      1. grep -c "var(--color-" for new pronunciation CSS (should use variables, not hardcoded colors)
      2. grep old `.pronunciation-btn`, `.pronunciation-icon-wrap` classes (should be removed)
    Expected Result: New CSS uses variables, old classes removed
    Evidence: .sisyphus/evidence/task-1-css-vars.txt

  Scenario: 深色模式样式存在
    Tool: Bash (grep)
    Steps:
      1. grep "\[data-theme=\"dark\"\]" for pronunciation section in CSS
    Expected Result: At least 3 dark-mode overrides found
    Evidence: .sisyphus/evidence/task-1-dark-mode.txt
  ```

  **Commit**: YES
  - Message: `style(pronunciation): add all pronunciation page component CSS`
  - Files: `index.html`

---

- [ ] 2. **JS 数据层 — 所有发音学习数据对象**

  **What to do**:
  - 创建以下 JS 常量（在 `DOMContentLoaded` 内或之前）：
    1. `NCE_COURSES` — 新概念英语4册课程数据
       - 结构：`{ book1: { id: 1, title: '第一册', lessons: [...] }, book2: {...}, ... }`
       - 每册包含 lessons 数组，每两课为一个 entry：
         `{ lessonStart: 1, lessonEnd: 2, startTitle: 'Excuse me!', endTitle: 'Is this your...?' }`
       - Book1: 72 entries (L1&2 到 L143&144)
       - Book2: 48 entries (L1&2 到 L95&96)
       - Book3: 30 entries (L1&2 到 L59&60)
       - Book4: 24 entries (L1&2 到 L47&48)
       - 使用 Web Search 获取完整课程标题数据
    2. `LETTER_DATA` — 26个英文字母数据
       - 结构：`[{ letter: 'a', upper: 'A', lower: 'a', phonetic: '/eɪ/', color: '#...' }, ...]`
       - 每个字母有独特颜色（色板：28种不同色调）
       - phonetic 使用通用美式音标
    3. `PHONEME_DATA` — 48个国际音标数据
       - 按分类组织：vowels（单元音/双元音）, consonants（鼻音/浊辅音等）
       - 结构：`{ category: '单元音', items: [{ symbol: 'i:', audioType: 'vowels', audioFile: 'i:', example: 'see' }, ...] }`
       - audioType 映射到 Vocabulary.com CDN URL 结构
       - 分类严格按文档描述：前元音、中元音、后元音、开合双元音、集中双元音、鼻音、浊辅音等
    4. `PHONEME_LEARNING_DATA` — 音标学习（含视频）数据
       - 同 PHONEME_DATA 结构但包含 videoPlaceholder: true
    5. `PLACEHOLDER_LISTENING_DATA` — 听力资源占位数据
       - 简单数组，8-12 个占位条目

  **Must NOT do**:
  - 不要添加 localStorage 存储
  - 不要添加 API 调用（所有数据硬编码）

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 纯数据录入工作，无需 UI 渲染
  - **Skills**: None needed

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with T1)
  - **Blocks**: T4, T5
  - **Blocked By**: None

  **References**:
  - `doc/开发描述文档.md:Section 10` — 数据结构和分类说明
  - `https://cdn.vocabulary.com/media/dictionary/ipa/` — IPA 音频 CDN（参考 URL 结构）
  - Web Search: 新概念英语 Books 2-4 完整课程标题（实施时搜索整理）

  **Acceptance Criteria**:
  - [ ] NCE_COURSES 包含全部 4 册，每册卡片数正确（72+48+30+24=174）
  - [ ] LETTER_DATA 包含全部 26 个字母及音标
  - [ ] PHONEME_DATA 按文档分类组织
  - [ ] 所有数据对象在 `renderPronunciationPage()` 中可访问
  - [ ] 数据无语法错误（JS 引擎可解析）

  **QA Scenarios**:
  ```
  Scenario: NCE 数据完整性
    Tool: Bash (node -e "eval(...)")
    Steps:
      1. Check NCE_COURSES.book1.lessons.length === 72
      2. Check NCE_COURSES.book2.lessons.length === 48
      3. Check NCE_COURSES.book3.lessons.length === 30
      4. Check NCE_COURSES.book4.lessons.length === 24
    Expected Result: All lengths correct
    Evidence: .sisyphus/evidence/task-2-nce-count.txt

  Scenario: 字母数据完整性
    Tool: Bash (node -e "eval(...)")
    Steps:
      1. Check LETTER_DATA.length === 26
      2. Check each entry has upper, lower, phonetic, color
    Expected Result: 26 entries with all fields
    Evidence: .sisyphus/evidence/task-2-letter-count.txt
  ```

  **Commit**: YES
  - Message: `feat(pronunciation): add hardcoded data for NCE courses, letters, phonemes`
  - Files: `index.html`

---

- [ ] 3. **音频工具 + 页面结构 + 顶部标签导航**

  **What to do**:
  - 创建音频播放工具函数：
    1. `playPhonemeAudio(symbol, type)` — 使用 `Audio()` 播放 Vocabulary.com CDN MP3
       - URL 模式: `https://cdn.vocabulary.com/media/dictionary/ipa/${type}/${symbol}.mp3`
       - 错误处理：CDN 404 时静默降级（不 break UI）
       - 防重叠：播放前调用 `cancelAllAudio()`
    2. `speakText(text)` — 使用 `SpeechSynthesisUtterance` 朗读文本
       - 用于字母发音和 NCE 课文
       - 防重叠：播放前调用 `speechSynthesis.cancel()`
    3. `cancelAllAudio()` — 停止所有正在播放的音频
  - 重写 `renderPronunciationPage()`:
    - 移除登录卡片 HTML
    - 创建页面主结构：
      ```
      <div class="pronunciation-page">
        <div class="pronunciation-top-tabs">
          <button class="pronunciation-tab active" data-ptab="online-reading">在线点读</button>
          <button class="pronunciation-tab" data-ptab="phonetics">音标学习</button>
        </div>
        <div class="pronunciation-content">
          <!-- content rendered by sub-modules -->
        </div>
      </div>
      ```
    - 绑定顶部标签点击事件
    - 默认显示「在线点读」内容
    - 内部路由：通过 `data-ptab` 属性控制显示哪个模块
    - 页面初次渲染后调用 `renderOnlineReading()`

  **Must NOT do**:
  - 不要修改 `switchPage()` 的 'pronunciation' case
  - 不要创建外部文件（所有代码在 index.html 内）

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: 页面结构布局 + 交互（标签切换）+ 音频整合
  - **Skills**: None needed

  **Parallelization**:
  - **Can Run In Parallel**: NO (depends on T1 CSS)
  - **Blocked By**: T1
  - **Blocks**: T4, T5

  **References**:
  - `index.html:1547-1586` — `switchPage()` 函数（接口参考）
  - `index.html:1921` — `attachSpeaker()` 现有音频模式
  - `doc/开发描述文档.md:Section 10.2-10.3` — 页面结构描述
  - `https://cdn.vocabulary.com/media/dictionary/ipa/` — IPA 音频 CDN

  **Acceptance Criteria**:
  - [ ] `renderPronunciationPage()` 渲染页面结构（非登录卡片）
  - [ ] 顶部两个标签存在：在线点读、音标学习
  - [ ] 点击标签切换内容区域
  - [ ] 默认显示在线点读内容
  - [ ] `cancelAllAudio()` 工作正常
  - [ ] Vocabulary.com 404 不导致页面崩溃

  **QA Scenarios**:
  ```
  Scenario: 顶部标签切换
    Tool: Playwright
    Preconditions: 导航到发音学习页面
    Steps:
      1. Wait for page load
      2. Assert `.pronunciation-top-tabs` contains exactly 2 tabs
      3. Click first tab "在线点读"
      4. Assert `.pronunciation-tab.active` has text "在线点读"
      5. Click second tab "音标学习"
      6. Assert `.pronunciation-tab.active` has text "音标学习"
    Expected Result: Tab switching works correctly
    Evidence: .sisyphus/evidence/task-3-tab-switch.png

  Scenario: 音频错误不崩溃
    Tool: Playwright
    Steps:
      1. Navigate to pronunciation page
      2. Call playPhonemeAudio('nonexistent', 'consonants')
      3. Assert no console.error (page error)
    Expected Result: Silent failure, no page crash
    Evidence: .sisyphus/evidence/task-3-audio-error.txt
  ```

  **Commit**: YES
  - Message: `feat(pronunciation): add audio utilities, page structure, top tab navigation`
  - Files: `index.html`

---

- [ ] 4. **在线点读 + 听力资源模块渲染**

  **What to do**:
  - 创建 `renderOnlineReading(container)` 函数：
    - 渲染二级标签栏：新概念英语（默认激活）、听力资源
    - 渲染内容区域
  - 创建 `renderNCEReading(container)` 函数：
    - 渲染册数选择器：一册/二册/三册/四册（右上角排列）
    - 渲染 3列课程卡片网格
    - 根据选择的书册渲染对应课程卡片
    - 卡片结构：
      ```
      <div class="pronunciation-card">
        <div class="pronunciation-card-title">第1&2课</div>
        <div class="pronunciation-card-subtitle">Excuse Me</div>
      </div>
      ```
    - 卡片点击 → `showToast('该课程功能正在开发中')`
    - 绑定册数切换事件 → 重新渲染网格
  - 创建 `renderListeningResources(container)` 函数：
    - 同 3列卡片网格布局
    - 使用 PLACEHOLDER_LISTENING_DATA 渲染占位卡片
    - 卡片标题显示占位名称
  - 绑定二级标签切换事件（内部路由）

  **Must NOT do**:
  - 不要实现真正的课程学习页面
  - 不要实现课文音频播放（后续再实现）
  - 不要添加分页或搜索功能

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: 中等复杂度的渲染逻辑 + 交互 + 数据绑定
  - **Skills**: None needed

  **Parallelization**:
  - **Can Run In Parallel**: YES (with T5)
  - **Parallel Group**: Wave 2 (with T3, T5)
  - **Blocked By**: T1, T2, T3
  - **Blocks**: T6

  **References**:
  - `doc/开发描述文档.md:Section 10.3.2` — 在线点读模块描述
  - `index.html` NCE_COURSES 数据对象（T2 添加）
  - `index.html` `renderPlaceholderPage()` 模式（卡片+图标+标题 参考）

  **Acceptance Criteria**:
  - [ ] 二级标签「新概念英语」「听力资源」可切换
  - [ ] 册数选择器4个按钮可点击切换
  - [ ] 默认显示一册（72个课程卡片）
  - [ ] 3列网格布局，卡片显示正确
  - [ ] 点击卡片显示 Toast "功能开发中"
  - [ ] 听力资源显示占位网格

  **QA Scenarios**:
  ```
  Scenario: 新概念英语册数切换
    Tool: Playwright
    Preconditions: 发音学习页面 → 在线点读 → 新概念英语
    Steps:
      1. Assert `.pronunciation-grid` contains 72 cards (一册: 144/2)
      2. Click "二册" button
      3. Assert grid now has 48 cards
      4. Click "三册" → assert 30 cards
      5. Click "四册" → assert 24 cards
    Expected Result: Card count changes with volume selection
    Evidence: .sisyphus/evidence/task-4-volume-switch.png

  Scenario: 课程卡片点击 → Toast
    Tool: Playwright
    Steps:
      1. Click first course card
      2. Assert `.toast` element visible with text containing "功能开发中"
    Expected Result: Toast appears
    Evidence: .sisyphus/evidence/task-4-card-click.png
  ```

  **Commit**: YES
  - Message: `feat(pronunciation): add 在线点读 + 听力资源 module rendering`
  - Files: `index.html`

---

- [ ] 5. **音标学习模块渲染（26字母 + 48音标 + 含视频）**

  **What to do**:
  - 创建 `renderPhonetics(container)` 函数：
    - 渲染二级标签栏（右上角排列）：
      1. 26个英文字母发音（默认激活）
      2. 48个英语国际音标发音表
      3. 音标学习（含视频）
  - 创建 `renderLetterPhonetics(container)` 函数：
    - 提示文字：「点击字母收听发音」
    - 3列网格布局
    - 每个字母卡片结构：
      ```
      <div class="letter-card" style="--card-color: #ff6b6b">
        <div class="letter-card-top">Aa</div>
        <div class="letter-card-bottom">/eɪ/</div>
      </div>
      ```
    - 每个字母不同背景色（使用预定义色板）
    - 点击字母 → `speakText(letter)` 播放发音
    - 底部版权说明区域
  - 创建 `renderPhonemeTable(container)` 函数：
    - 提示文字：「点击音标收听发音」
    - 按分类渲染：元音（单元音/双元音）、辅音（鼻音/浊辅音等）
    - 每个分类有标题和 teal 卡片网格
    - 音标卡片样式：青绿色背景，白色 IPA 符号，圆角
    - 点击音标 → `playPhonemeAudio(symbol, type)` 播放
  - 创建 `renderPhonemeLearning(container)` 函数：
    - 提示文字：「点击展开查看视频讲解和单词例子」
    - 列表布局，每个项目：
      - 左侧：teal 方形图标 + 白色音标符号
      - 中间：标题行（"/i:/ 音标学习"）+ 副标题行（"点击展开查看视频和例子"）
      - 右侧：「展开」文字按钮
    - 点击「展开」→ 下方显示展开区域（灰色文字占位：「视频讲解内容加载中」）
    - 独立展开（点击 A 展开时不影响 B 的状态）
  - 绑定二级标签切换事件

  **Must NOT do**:
  - 不要添加录音功能
  - 不要添加真实视频内容
  - 不要实现字母发音之外的复杂音频功能

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: 3个独立子模块，各有不同的布局和交互逻辑
  - **Skills**: None needed

  **Parallelization**:
  - **Can Run In Parallel**: YES (with T4)
  - **Parallel Group**: Wave 2 (with T3, T4)
  - **Blocked By**: T1, T2, T3
  - **Blocks**: T6

  **References**:
  - `doc/开发描述文档.md:Section 10.3.3` — 音标学习模块详细描述
  - `index.html` LETTER_DATA, PHONEME_DATA 对象（T2 添加）
  - `index.html` 音频工具函数（T3 添加）

  **Acceptance Criteria**:
  - [ ] 3个二级标签可切换
  - [ ] 26字母显示3列网格，每个字母有独特颜色
  - [ ] 点击字母播放发音（Web Speech API）
  - [ ] 48音标按分类显示（元音/辅音分组）
  - [ ] 音标卡片为 teal 背景
  - [ ] 音标学习（含视频）列表可展开/收起
  - [ ] 展开互不影响（独立模式）
  - [ ] 展开区域显示灰色占位文字

  **QA Scenarios**:
  ```
  Scenario: 26字母渲染
    Tool: Playwright
    Steps:
      1. Click "音标学习" top tab
      2. Assert ".letter-card" count === 26
      3. Assert first card shows "Aa" and "/eɪ/"
    Expected Result: 26 letter cards rendered
    Evidence: .sisyphus/evidence/task-5-letters.png

  Scenario: 48音标表格渲染
    Tool: Playwright
    Steps:
      1. Click "48个英语国际音标发音表" secondary tab
      2. Assert phoneme category headers visible (前元音, 中元音, etc.)
      3. Assert `.phoneme-card` elements have teal background
    Expected Result: Phoneme table with categories
    Evidence: .sisyphus/evidence/task-5-phonemes.png

  Scenario: 音标学习展开/收起
    Tool: Playwright
    Steps:
      1. Click "音标学习（含视频）" secondary tab
      2. Click first item's "展开" button
      3. Assert first item's expand area visible
      4. Click second item's "展开" button
      5. Assert first item STILL visible and second also visible (independent mode)
    Expected Result: Independent expand works
    Evidence: .sisyphus/evidence/task-5-expand.png
  ```

  **Commit**: YES
  - Message: `feat(pronunciation): add 音标学习 modules (26 letters, 48 phonemes, learning)`
  - Files: `index.html`

---

- [ ] 6. **整合 — switchPage 更新 + 旧代码清理 + 事件重绑定**

  **What to do**:
  - 验证 `switchPage('pronunciation')` case 正确调用新 `renderPronunciationPage()`
  - 添加事件重绑定逻辑：当从其他页面切回 pronunciation 时，重新绑定子标签事件
    - 在 `switchPage()` 的 `case 'pronunciation'` 中添加重绑定
    - 或者确保 `renderPronunciationPage()` 每次调用都重新绑定
  - 确认旧 CSS 已被完全替换（检查是否有残留的 `.pronunciation-btn`, `.pronunciation-icon-wrap` 等）
  - 确认旧 JS `renderPronunciationPage()` 已被替换
  - 全局检查：确保没有任何其他代码引用旧的 pronunciation class
  - 添加 Toast 通知工具函数的检查（确保 `showToast` 可用）
  - 验证首页切换回来后的功能正常：
    - OED 搜索框可输入
    - 提交查询工作正常
    - 主题切换正常
    - 侧边栏折叠正常

  **Must NOT do**:
  - 不要修改 switchPage() 中其他页面的处理逻辑
  - 不要修改首页 HTML、CSS 或 JS

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 清理和验证工作，复杂度低
  - **Skills**: None needed

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Blocked By**: T4, T5
  - **Blocks**: None (final task before verification)

  **References**:
  - `index.html:1547-1586` — `switchPage()` 函数
  - `index.html:1567-1585` — 搜索事件重绑定模式（参考）
  - `index.html:1588-1609` — 旧 `renderPronunciationPage()`
  - `index.html:432-523` — 旧 CSS

  **Acceptance Criteria**:
  - [ ] `switchPage('pronunciation')` 调用新函数
  - [ ] 从其他页面切回发音页面 → 子标签可正常点击
  - [ ] 旧 CSS class 无残留
  - [ ] 旧 JS 函数无残留
  - [ ] 首页功能不受影响

  **QA Scenarios**:
  ```
  Scenario: 导航完整性
    Tool: Playwright
    Steps:
      1. Start at home page
      2. Click "发音学习" nav item → assert pronunciation page renders
      3. Toggle between 在线点读 and 音标学习 tabs
      4. Click "首页" nav item → assert home page works (search input present)
      5. Click "发音学习" again → assert pronunciation page still works
    Expected Result: Full navigation cycle works
    Evidence: .sisyphus/evidence/task-6-navigation.png

  Scenario: 旧代码无残留
    Tool: Bash (grep)
    Steps:
      1. grep -n "pronunciation-btn\|pronunciation-icon-wrap\|pronunciation-actions" index.html
    Expected Result: No matches (all old classes removed)
    Evidence: .sisyphus/evidence/task-6-cleanup.txt
  ```

  **Commit**: YES
  - Message: `chore(pronunciation): integrate with switchPage, remove old code, rebind events`
  - Files: `index.html`

---

## Final Verification Wave

- [ ] F1. **Plan Compliance Audit** — `oracle`
  Read the plan end-to-end. For each "Must Have": verify implementation exists. For each "Must NOT Have": search for forbidden patterns (recording, localStorage, external packages, etc.).
  Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [ ] F2. **Code Quality Review** — `unspecified-high`
  Run lint checks. Review for: commented-out code, console.log, AI slop, unused variables, dark mode compliance.
  Output: `Lint [PASS/FAIL] | Files [N clean/N issues] | VERDICT`

- [ ] F3. **Full QA Execution** — `unspecified-high` (+ `playwright`)
  Execute EVERY QA scenario from all 6 tasks. Test cross-task integration (tab switching, navigation cycle). Test edge cases: empty state, rapid clicking, audio errors. Save to `.sisyphus/evidence/final-qa/`.
  Output: `Scenarios [N/N pass] | Integration [N/N] | Edge Cases [N tested] | VERDICT`

- [ ] F4. **Scope Fidelity Check** — `deep`
  Read each task's spec vs actual diff. Verify 1:1 match. Check "Must NOT do" compliance. Detect cross-task contamination (one task touching other task's modules).
  Output: `Tasks [N/N compliant] | Contamination [CLEAN/N issues] | VERDICT`

---

## Commit Strategy

- **Task 1**: `style(pronunciation): add all pronunciation page component CSS`
- **Task 2**: `feat(pronunciation): add hardcoded data for NCE courses, letters, phonemes`
- **Task 3**: `feat(pronunciation): add audio utilities, page structure, top tab navigation`
- **Task 4**: `feat(pronunciation): add 在线点读 + 听力资源 module rendering`
- **Task 5**: `feat(pronunciation): add 音标学习 modules (26 letters, 48 phonemes, learning)`
- **Task 6**: `chore(pronunciation): integrate with switchPage, remove old code, rebind events`

---

## Success Criteria

### Verification Commands
```bash
# Check file length
python -c "print(len(open('index.html').read().splitlines()))"

# Check old code removed
grep -c "pronunciation-btn\|pronunciation-icon-wrap\|pronunciation-actions" index.html || echo "0 (clean)"

# Check no console errors in browser
# (Playwright QA handles this)
```

### Final Checklist
- [ ] All "Must Have" items present (6 items)
- [ ] All "Must NOT Have" items absent (8 items)
- [ ] 发音学习页面替换登录卡片
- [ ] 顶部标签切换正常
- [ ] 在线点读 + 听力资源渲染正常
- [ ] 音标学习3个子模块渲染正常
- [ ] 音频播放不崩溃
- [ ] 深色模式适配
- [ ] 导航往返正常
- [ ] 旧代码无残留
