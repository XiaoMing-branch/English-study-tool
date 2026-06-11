# 嵌入式英语学习工具 — 架构与功能文档

## 项目概述

嵌入式英语学习工具是一个专为嵌入式软件工程师设计的英语词汇学习应用，以**单文件 SPA（Single Page Application）** 形式实现。所有代码内联在 `index.html` 中，无任何外部依赖，可通过 `file://` 协议直接在浏览器中离线运行。

- **技术栈**: 纯 HTML5 + CSS3 + Vanilla JavaScript (ES6+)
- **依赖**: 零外部依赖（无框架、无 npm 包、无 CDN）
- **运行方式**: 直接用浏览器打开 `index.html`，或通过任意 HTTP 服务器托管
- **数据存储**: 全部存储在浏览器 `localStorage` 中，完全离线可用
- **词库规模**: 内置 225 词嵌入式专业英语词汇，覆盖 10 个技术分类

---

## 文件结构

```
English-study-tool/
├── index.html          # 唯一源文件（内联 CSS + HTML + JS）
├── README.md           # 用户使用说明
├── data/               # 数据目录（备份文件、迁移数据存放处）
│   └── README.md       # 数据目录说明
└── doc/
    └── architecture.md # 本文档（技术架构说明）
```

`index.html` 内部分为三个区域：

| 区域 | 行号范围 | 内容 |
|------|----------|------|
| CSS | 7–219 | 内联样式表，包含 CSS 变量主题系统、布局、组件样式、响应式设计 |
| HTML | 220–444 | 静态页面结构（导航栏、6 个视图、设置面板、模态框、Toast） |
| JavaScript | 446–1842 | 全部应用逻辑（命名空间、数据层、SRS 引擎、UI、学习模式、初始化） |

---

## 命名空间架构

所有 JavaScript 代码组织在全局 `window.EST` 对象下，采用命名空间模式避免全局污染：

```
window.EST
├── VERSION: 1                    # 数据版本号，用于迁移
├── data                          # 数据层 — 词汇管理 + 持久化
│   ├── BUILTIN_VOCAB             # 内置词库（225 词）
│   ├── CATEGORIES                # 10 个词库分类定义
│   ├── _get(key) / _set(key,val) # localStorage 读写封装（含错误处理）
│   ├── loadVocab() / saveVocab() # 词汇数据存取
│   ├── loadState() / saveState() # SRS 学习状态存取
│   ├── loadSettings() / saveSettings() # 用户设置存取
│   ├── loadDaily() / saveDaily() # 每日学习记录存取
│   ├── getVersion()              # 版本号读取
│   ├── initVocab()               # 词汇初始化（首次运行写入 localStorage）
│   └── getWordById(id) / getCategoryName(catId)
├── srs                           # SRS 间隔重复引擎
│   ├── INTERVALS[]               # 5 级复习间隔（10min → 1h → 1d → 3d → 7d）
│   ├── GRADUATION_STREAK         # 毕业阈值（连续正确 3 次即毕业）
│   ├── computeQueue()            # 计算待复习队列（按优先级排序）
│   ├── getDueCount()             # 待复习数量
│   ├── getMasteryRate()          # 总体掌握率（0-100%）
│   ├── getLevelDistribution()    # 5 级分布统计
│   ├── updateLevel(id, correct)  # 根据答对/答错更新等级和下次复习时间
│   ├── getStreak()               # 连续学习天数
│   └── getTodayStats()           # 今日学习统计
├── ui                            # UI 交互层
│   ├── switchView(name)          # 视图切换（导航联动）
│   ├── toast(msg, type)          # Toast 消息提示
│   ├── showModal(html) / hideModal()  # 模态框
│   ├── refreshHome()             # 首页仪表盘数据刷新
│   ├── refreshStats()            # 统计面板渲染
│   ├── refreshVocabList()        # 词汇列表渲染（含搜索/过滤）
│   ├── showWordDetail(word,state)# 词汇详情弹窗
│   ├── applyTheme(theme)         # 主题切换
│   ├── applyFontSize(size)       # 字号调节
│   ├── openSettings() / saveSettingsFromForm()  # 设置面板
│   ├── exportData() / importData() / resetData() # 数据管理
│   └── completeFirstRun()        # 首次运行引导完成标记
├── modes                         # 学习模式
│   ├── flashcard{}               # 闪卡模式
│   ├── spelling{}                # 拼写模式
│   └── quiz{}                    # 测验模式
├── stats                         # 统计模块（预留，当前统计逻辑在 srs + ui 中）
└── utils                         # 工具函数
    ├── getNow() / formatDate() / todayStr()
    ├── debounce(fn, delay)
    ├── shuffle(arr) / randInt(min, max)
    └── escapeHtml(str)
```

---

## 数据流图

```
用户交互（DOM Event）
    │
    ▼
EST.ui.switchView(name)  ←── 导航标签 / 按钮点击
    │
    ├─→ 视图切换（.view.active 切换）
    ├─→ EST.modes.[mode].start()  ←── 进入学习模式
    │       │
    │       ├─→ EST.srs.computeQueue()  ←── 读取 State 计算复习队列
    │       ├─→ EST.data.getWordById()  ←── 读取 Vocab 获取词条详情
    │       └─→ DOM 渲染（innerHTML）   ←── 更新页面内容
    │
    ├─→ 用户答题
    │       │
    │       └─→ EST.srs.updateLevel(id, correct)
    │               │
    │               ├─→ 更新 State（等级/复习时间/统计）
    │               ├─→ EST.data.saveState()  → localStorage
    │               ├─→ EST.srs._recordDailyActivity()  → localStorage
    │               └─→ 触发下一题渲染
    │
    └─→ EST.ui.refreshHome() / refreshStats() / refreshVocabList()
            │
            └─→ 读取 localStorage → 更新 DOM 显示
```

**关键数据流**:
- **读取路径**: localStorage → `EST.data.load*()` → `EST.srs.*()` / `EST.ui.*()` → DOM
- **写入路径**: 用户操作 → `EST.srs.updateLevel()` → `EST.data.save*()` → localStorage
- **持久化**: 所有状态变更立即写入 localStorage，页面刷新不丢失数据

---

## 数据结构

### 词汇条目（Vocabulary Item）
```json
{
  "id": "pb001",
  "en": "variable",
  "cn": "变量",
  "cat": "programming-basics",
  "def": "程序中用于存储数据的命名存储位置",
  "ex": "int counter = 0;",
  "diff": 1
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | string | 唯一标识符，格式 `[分类缩写][序号]` |
| `en` | string | 英文单词 |
| `cn` | string | 中文释义 |
| `cat` | string | 所属分类 ID |
| `def` | string | 详细定义/说明 |
| `ex` | string | 代码示例 |
| `diff` | number | 难度等级 (1-3) |

### 学习状态（State Entry）
```json
{
  "level": 2,
  "nextReview": 1716638400000,
  "reviewCount": 5,
  "correctCount": 3,
  "incorrectCount": 2,
  "lastReview": 1716552000000,
  "streakCorrect": 1,
  "firstSeen": 1716465600000,
  "graduated": false
}
```

### localStorage Key 一览
| Key | 存储内容 | JSON 大小（估算） |
|-----|----------|-------------------|
| `est_vocabulary` | 当前词汇表（数组） | ~45KB |
| `est_state` | 学习状态（对象，key 为 wordId） | ~35KB |
| `est_settings` | 用户设置（对象） | ~300B |
| `est_daily` | 每日记录（对象，key 为日期） | 随使用增长 |
| `est_version` | 数据版本号（数字） | ~5B |

---

## SRS 间隔重复算法

### 5 级掌握模型

| 等级 | 含义 | 复习间隔 | 升级条件 |
|------|------|----------|----------|
| 0 | 完全不认识 | 10 分钟 | 答对 |
| 1 | 有点印象 | 1 小时 | 答对 |
| 2 | 认识但不会用 | 1 天 | 答对 |
| 3 | 基本掌握 | 3 天 | 答对 |
| 4 | 完全掌握 | 7 天 | 连续答对 3 次 → 毕业 |

### 复习队列优先级算法

```
priority = overdue_ms + (4 - level) * 3600000 + incorrectCount * 600000
```

- **overdue_ms**: 逾期时间（越久优先级越高）
- **等级因子**: 低等级单词获得额外优先级
- **错误因子**: 多次答错的单词获得额外优先级

### 闪卡模式自评逻辑

用户在翻转卡片后，自评掌握程度（0-4 级）。系统根据自评等级与原有等级的差距判断对错：

```javascript
correct = level >= oldState.level + 1 || (level === 4 && oldState.level === 4)
```

即：如果自评等级比原有等级高 1 级以上，或已在最高等级且自评也是最高等级，则视为答对。

---

## 功能模块说明

### 1. 闪卡模式 (`EST.modes.flashcard`)

**入口**: 导航栏「闪卡」标签 / 首页「开始复习」按钮

**工作流程**:
1. 调用 `EST.srs.computeQueue()` 获取待复习队列
2. 渲染闪卡：正面显示中文释义，背面显示英文单词
3. 点击卡片或按空格键翻转
4. 翻转后显示 5 级评级按钮（不认识 / 有印象 / 不会用 / 基本会 / 完全会）
5. 用户自评后系统调用 `EST.srs.updateLevel()` 更新学习状态
6. 自动进入下一张卡片，直到队列清空

**辅助功能**: 显示首字母提示（`fc-hint-btn`）、语音发音（`fc-speak-btn`）、跳过（`fc-skip-btn`）

**键盘快捷键**:
- `Space` — 翻转卡片
- `1`-`5` — 评级（翻转后可用，1=不认识，5=完全会）
- `Escape` — 关闭弹窗

---

### 2. 拼写模式 (`EST.modes.spelling`)

**入口**: 导航栏「拼写」标签

**工作流程**:
1. 优先使用 SRS 待复习队列，空队列时从全部词汇中抽取
2. 显示中文释义，用户输入英文单词
3. 提交后给出**字符级差异高亮**：正确字母标绿，错误字母标红
4. 答对进入下一题，答错显示正确答案后 2 秒自动跳转

**快捷键**: `Enter` — 提交答案

---

### 3. 测验模式 (`EST.modes.quiz`)

**入口**: 导航栏「测验」标签 → 点击「开始测验」

**题型混合**:
- **选择题·英译中**: 显示英文单词，从 4 个中文选项中选正确释义
- **选择题·中译英**: 显示中文释义，从 4 个英文选项中选正确单词
- **填空题**: 显示中文释义 + 首字母提示，输入英文单词

**工作流程**:
1. 从词库中随机抽取题目池，生成 10-20 道题（可在设置中调整）
2. 每题即时反馈对错
3. 完成后显示得分和正确率
4. **错题回顾**：列出所有答错的题目和正确答案
5. 「再来一次」按钮可重新生成新测验

---

### 4. 词汇浏览器 (`EST.ui.refreshVocabList`)

**入口**: 导航栏「词汇」标签 / 首页「学习新词」按钮

**功能**:
- **全文搜索**: 搜索英文、中文、定义
- **分类过滤**: 按 10 个技术分类筛选
- **等级过滤**: 按 5 级掌握程度筛选
- **点击查看详情**: 弹出模态框显示完整释义、代码示例、学习统计、下次复习时间

**词库分类**:
| ID | 名称 | 词数 |
|----|------|------|
| `programming-basics` | 编程基础概念 | 25 |
| `data-types` | 数据类型与变量 | 25 |
| `control-flow` | 控制流程 | 20 |
| `functions-modules` | 函数与模块化 | 20 |
| `memory-management` | 内存管理 | 25 |
| `embedded-hardware` | 嵌入式硬件 | 30 |
| `communication-protocols` | 通信协议 | 25 |
| `rtos` | 实时操作系统 | 20 |
| `debugging-testing` | 调试与测试 | 20 |
| `compilation-build` | 编译与构建 | 15 |

---

### 5. 学习统计 (`EST.ui.refreshStats`)

**入口**: 导航栏「统计」标签

**展示内容**:
- 仪表盘：待复习数、总体掌握率、连续学习天数、总词汇量
- 等级分布：5 级条形图（每级词数 + 百分比）
- **掌握率趋势**：过去 14 天的每日掌握率柱状图
- 最近学习记录：过去 14 天的每日复习词数和正确率

---

### 6. 设置面板

**入口**: 右上角齿轮图标 ⚙

**可配置项**:
| 设置项 | 默认值 | 说明 |
|--------|--------|------|
| 每日学习目标 | 20 | 5/10/15/20/30 词 |
| 复习方向 | 看中文→回忆英文 | 中文→英文 / 英文→中文 / 混合 |
| 主题 | 浅色 | 浅色 / 深色 |
| 字号 | 中 | 小 / 中 / 大 |
| 测验题目数量 | 10 | 5/10/15/20 题 |
| 自动发音 | 关闭 | 开关 |

---

### 7. 数据管理

| 功能 | 操作路径 |
|------|----------|
| **导出数据** | 设置 → 导出数据 → 保存 JSON 备份文件（优先使用系统文件选择器，回退到浏览器下载） |
| **导入数据** | 设置 → 导入数据 → 选择 JSON 文件（优先使用系统文件选择器，回退到浏览器上传） |
| **重置数据** | 设置 → 重置所有数据 → 确认 |

**数据目录机制**:
- 项目根目录下的 `data/` 用于存放备份文件，支持跨环境迁移
- 导出时默认建议保存到 `data/` 目录
- 复制整个项目文件夹即可完成数据迁移
- 使用本地 HTTP 服务器运行可获得更好的文件系统访问体验（File System Access API）

**导出 JSON 结构**:
```json
{
  "version": 1,
  "vocabulary": [...],
  "state": {...},
  "settings": {...},
  "daily": {...},
  "exportedAt": 1716638400000
}
```

---

## 技术栈与兼容性

| 技术 | 版本/特性 |
|------|-----------|
| HTML | HTML5（语义化标签） |
| CSS | CSS3（自定义属性、Flexbox、Grid、动画、媒体查询） |
| JavaScript | ES6+（箭头函数、模板字符串、解构、const/let） |
| 浏览器 API | `localStorage`、`SpeechSynthesis`、`FileReader`、`Blob`/`URL` |

**浏览器兼容性**: Chrome 80+ / Firefox 80+ / Edge 80+ / Safari 14+（所有支持 ES6 的现代浏览器）

**离线能力**: 完全离线可用。如需 PWA 安装到桌面，可添加 `manifest.json` 和 Service Worker。

---

## 首次运行流程

1. 用户打开 `index.html`
2. `DOMContentLoaded` 触发 → `EST.init()` 执行
3. 检查数据版本 → 加载设置并应用主题/字号
4. 调用 `EST.data.initVocab()`：
   - 尝试从 localStorage 加载词汇表
   - 若不存在（首次运行），从内置 `BUILTIN_VOCAB` 写入 localStorage（225 词）
   - 为所有词条初始化 SRS 学习状态
5. 绑定所有 UI 事件监听器（导航、按钮、搜索、键盘）
6. 刷新首页数据
7. 若为首次运行，弹出欢迎引导弹窗
8. 控制台输出 `EST initialized v1`
