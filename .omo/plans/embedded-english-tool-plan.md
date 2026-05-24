# 嵌入式软件英语学习工具 — 完整开发计划

## 一、项目概述

**定位**：纯前端、单文件、零依赖的嵌入式软件专业英语学习网页工具  
**用户**：完全不会英语的嵌入式软件工程师（中国用户）  
**运行方式**：本地浏览器直接打开 HTML 文件，完全离线可用  
**核心方法**：间隔重复系统(SRS) + 主动回忆法(Active Recall)

---

## 二、技术架构

### 2.1 文件结构
```
index.html          — 唯一文件，包含全部 HTML/CSS/JS
├── <style>         — 全部 CSS（CSS 自定义属性主题系统）
├── <body>          — DOM 结构（导航 + 多视图面板）
└── <script>        — 全部 JS 逻辑（模块化 IIFE 组织）
```

### 2.2 技术选型
| 层面 | 方案 | 理由 |
|------|------|------|
| 框架 | 无（Vanilla JS） | 零依赖要求 |
| 样式 | CSS Grid + Flexbox + 自定义属性 | 现代布局，主题切换 |
| 持久化 | `localStorage` | 浏览器原生，离线可用 |
| 图表 | 纯 CSS + Canvas | 零依赖，轻量 |
| 动画 | CSS transition + requestAnimationFrame | 原生高性能 |
| 字体 | 系统默认中文字体 + monospace | 零外部资源 |

### 2.3 内部模块划分（JS 命名空间）
```javascript
const EST = {
  data:    {},  // 数据层：词汇库、学习状态 CRUD
  srs:     {},  // SRS 算法引擎
  ui:      {},  // UI 渲染与交互
  modes:   {},  // 各学习模式逻辑
  stats:   {},  // 统计计算
  utils:   {},  // 工具函数
};
```

### 2.4 数据流
```
词汇数据(硬编码) ──→ localStorage 初始化
                         │
用户操作 ──→ UI 层 ──→ 模式逻辑 ──→ SRS 引擎 ──→ 学习状态更新
                                           │
                                     localStorage 持久化
                                           │
                         统计计算 ←── 学习状态读取 ←── Dashboard
```

---

## 三、数据模型

### 3.1 词汇条目 (Vocabulary)
localStorage key: `est_vocabulary`

```javascript
{
  id: "var-001",                    // 唯一标识
  en: "variable",                   // 英文单词
  cn: "变量",                        // 中文释义
  category: "data-types",           // 分类ID
  definition: "A named storage location in memory that can hold a value",
  example: "int counter = 0;",      // 代码示例
  difficulty: 1,                    // 难度 1-3
  partOfSpeech: "noun",             // 词性
  relatedWords: ["constant", "type"] // 关联词汇ID
}
```

### 3.2 学习状态 (Learning State)
localStorage key: `est_state`

```javascript
{
  "var-001": {
    level: 3,                       // 掌握程度 0-4
    nextReview: 1716566400000,      // 下次复习时间戳(ms)
    reviewCount: 12,                // 总复习次数
    correctCount: 10,               // 正确次数
    incorrectCount: 2,              // 错误次数
    lastReview: 1716480000000,      // 上次复习时间戳
    streakCorrect: 5,               // 连续正确次数
    firstSeen: 1716000000000,       // 首次见到时间戳
    graduated: false                // 是否已毕业(不再主动推送)
  }
}
```

### 3.3 用户设置 (Settings)
localStorage key: `est_settings`

```javascript
{
  dailyGoal: 20,                    // 每日学习目标(单词数)
  reviewDirection: "cn-to-en",      // "cn-to-en" | "en-to-cn" | "mixed"
  theme: "light",                   // "light" | "dark" | "auto"
  fontSize: "medium",               // "small" | "medium" | "large"
  quizQuestionCount: 10,            // 测验题目数量
  autoPlayAudio: false,             // 自动发音
  firstRunComplete: false           // 首次引导是否完成
}
```

### 3.4 每日记录 (Daily Log)
localStorage key: `est_daily`

```javascript
{
  "2024-05-24": {
    wordsReviewed: 15,
    wordsLearned: 5,               // 新学单词数
    correctRate: 0.87,             // 正确率
    timeSpentMinutes: 12,
    longestStreak: 8
  }
}
```

---

## 四、SRS 算法设计

### 4.1 掌握等级与复习间隔

| 等级 | 名称 | 含义 | 复习间隔 |
|------|------|------|----------|
| 0 | 完全不认识 | 从未见过或完全忘记 | 10 分钟 |
| 1 | 有点印象 | 见过但记不住 | 1 小时 |
| 2 | 认识但不会用 | 能认出但写不出或用不对 | 1 天 |
| 3 | 基本掌握 | 能正确拼写和使用 | 3 天 |
| 4 | 完全掌握 | 熟练运用 | 7 天 → 14 天 → 30 天 → 毕业 |

### 4.2 状态转换规则

```
操作：用户自评/拼写正确/测验正确
─────────────────────────────────
当前等级 → 正确 → 升1级（最高4级）
当前等级 → 错误 → 降1级（最低0级）

特殊情况：
- 等级4连续正确3次 → 标记为"已毕业"，不再主动推送
- 等级0连续错误3次 → 标记为"困难词汇"，降低推送优先级
- 首次遇见 → 默认等级0，nextReview = now
```

### 4.3 复习队列计算（每次页面加载时执行）

```javascript
function computeReviewQueue() {
  const now = Date.now();
  const state = loadState();
  const queue = [];

  for (const [wordId, s] of Object.entries(state)) {
    if (s.graduated) continue;
    if (s.nextReview <= now) {
      queue.push({
        wordId,
        level: s.level,
        overdue: now - s.nextReview,  // 过期时长(ms)
        priority: computePriority(s)   // 排序优先级
      });
    }
  }

  // 优先级排序：过期越久 > 等级越低 > 错误越多
  queue.sort((a, b) => b.priority - a.priority);
  return queue;
}
```

### 4.4 边界情况处理

| 场景 | 处理方式 |
|------|----------|
| 首次运行，无任何数据 | 初始化词汇库，所有单词 level=0，nextReview=now |
| 用户关闭页面，错过复习 | 下次打开时，`nextReview <= now` 自动进入队列 |
| 所有单词已毕业 | 提示用户可重置或导入新词汇 |
| 时区变化 | 使用 `Date.now()` 绝对时间戳，不受时区影响 |
| localStorage 已满 | 提示用户导出数据，清理旧日志 |
| 午夜边界(1天间隔) | 使用精确时间戳而非日期，避免午夜歧义 |

---

## 五、功能模块详细设计

### 5.1 导航结构

```
┌────────────────────────────────────────────┐
│  🏠 首页  │  📚 学习  │  ✍️ 拼写  │  📝 测验  │  📊 统计  │  ⚙️ 设置  │
├────────────────────────────────────────────┤
│                                            │
│              当前视图内容区                  │
│                                            │
└────────────────────────────────────────────┘
```

### 5.2 首页 (Dashboard)
- 今日待复习单词数（大数字醒目显示）
- 今日已学习进度（环形进度条，纯CSS）
- 连续学习天数（streak）
- 总体掌握率
- 快速开始按钮（直接进入复习队列）

### 5.3 闪卡模式 (Flash Card)

**流程**：
1. 从复习队列取单词
2. 显示中文释义 + 词性 + 分类标签
3. 用户尝试回忆英文单词
4. 点击卡片/按空格 → 翻转显示英文单词 + 音标 + 例句
5. 用户自评掌握程度 → 5个按钮（对应5个等级）
6. SRS 引擎更新状态 → 下一个单词

**交互细节**：
- 卡片翻转用 CSS 3D transform（performance 好）
- 键盘快捷键：空格=翻转，1-5=评级
- 显示当前队列进度（如"第 3/15 个"）
- 单词可点击发音（Web Speech API，无网络也可用）
- 查看提示按钮（显示首字母）

### 5.4 拼写模式 (Spelling)

**流程**：
1. 显示中文释义
2. 显示输入框 + 字符数提示（如"___ ___ ___ ___ ___ ___ ___ ___"(8字母)）
3. 用户输入英文单词
4. 实时逐字母验证（可选，设置中开启）
5. 提交后：
   - 正确 → 绿色动画 + 显示例句 + SRS升级
   - 错误 → 红色高亮错误位置 + 显示正确答案 + SRS降级

**交互细节**：
- 支持"显示首字母"提示（消耗"提示次数"）
- 支持"跳过"按钮（不更新SRS状态，放入队列末尾）
- 错误时高亮差异字母
- 正确时播放成功音效（Web Audio API 生成简单音效）

### 5.5 测验模式 (Quiz)

**题型混合**：

1. **选择题（看英选中）**：显示英文单词，4个中文选项
2. **选择题（看中选英）**：显示中文释义，4个英文选项
3. **填空题（首字母提示）**：显示中文 + 首字母，如 "变量: v_______"
4. **填空题（乱序字母）**：显示中文 + 打乱的字母，如 "变量: aabceilrv"

**流程**：
1. 每次测验 N 道题（默认10，可在设置调整）
2. 题型随机混合
3. 答完一题立即显示对错 + 正确答案
4. 全部完成后显示得分和错题回顾
5. 错题自动加入复习队列（level 设为当前等级-1）

**交互细节**：
- 干扰项从同分类词汇中随机选取
- 每题有时间限制（可选，默认关闭）
- 显示进度条（已完成/总数）
- 错题可立即重做

### 5.6 词汇浏览器 (Vocabulary)

- 按分类树形展示
- 搜索（中英文模糊匹配）
- 筛选：按掌握程度、难度、分类
- 每个单词显示：英文、中文、音标、等级徽章、下次复习时间
- 单词详情弹窗：完整定义、例句、关联词汇、学习历史

### 5.7 设置面板

| 设置项 | 选项 | 默认值 |
|--------|------|--------|
| 每日学习目标 | 5/10/15/20/30/自定义 | 20 |
| 复习方向 | 看中忆英 / 看英忆中 / 混合 | 看中忆英 |
| 主题 | 浅色 / 深色 / 跟随系统 | 浅色 |
| 字号 | 小 / 中 / 大 | 中 |
| 测验题数 | 5/10/15/20 | 10 |
| 自动发音 | 开 / 关 | 关 |
| 数据导出 | 按钮 | - |
| 数据导入 | 按钮 | - |
| 重置所有数据 | 按钮（需二次确认） | - |

---

## 六、UI/UX 设计规范

### 6.1 设计原则（面向零英语用户）

1. **全中文界面**：所有按钮、标签、提示、说明均为中文
2. **大字设计**：英文单词使用 28-36px 大字体，清晰可辨
3. **色彩编码**：掌握等级用颜色区分（红→橙→黄→绿→蓝）
4. **减少认知负荷**：每次只展示一个单词，避免信息过载
5. **即时反馈**：每次操作后立即显示结果，无延迟
6. **防误操作**：重要操作（重置数据等）需要二次确认
7. **渐进式引导**：首次使用时显示功能引导

### 6.2 色彩系统

```css
:root {
  /* 掌握等级颜色 */
  --level-0: #e74c3c;  /* 红 - 完全不认识 */
  --level-1: #e67e22;  /* 橙 - 有点印象 */
  --level-2: #f1c40f;  /* 黄 - 认识但不会用 */
  --level-3: #2ecc71;  /* 绿 - 基本掌握 */
  --level-4: #3498db;  /* 蓝 - 完全掌握 */

  /* 主题色 */
  --primary: #2563eb;
  --success: #16a34a;
  --danger: #dc2626;
  --warning: #f59e0b;
  --bg: #ffffff;
  --text: #1e293b;
  --border: #e2e8f0;
}
```

### 6.3 布局原则

- 最大宽度 800px，居中显示（桌面端）
- 移动端全宽自适应
- 卡片式设计，圆角 12px，阴影柔和
- 底部固定导航栏（移动端）

### 6.4 动画规范

- 卡片翻转：0.4s ease-in-out
- 等级变化：0.3s background-color transition
- 正确/错误反馈：0.2s 缩放 + 颜色闪烁
- 页面切换：0.2s opacity fade

---

## 七、词汇内容规划

### 7.1 分类体系与初始词汇量

| 分类ID | 分类名称 | 计划词汇量 | 示例 |
|--------|----------|-----------|------|
| `programming-basics` | 编程基础概念 | 25 | variable, function, loop, condition, array |
| `data-types` | 数据类型与变量 | 25 | integer, float, string, boolean, pointer |
| `control-flow` | 控制流程 | 20 | if-else, switch, while, for, break, return |
| `functions-modules` | 函数与模块化 | 20 | parameter, argument, return value, header file |
| `memory-management` | 内存管理 | 25 | stack, heap, malloc, free, buffer, overflow |
| `embedded-hardware` | 嵌入式硬件 | 30 | microcontroller, GPIO, ADC, PWM, register, interrupt |
| `communication-protocols` | 通信协议 | 25 | UART, SPI, I2C, CAN, baud rate, parity |
| `rtos` | 实时操作系统 | 20 | task, semaphore, mutex, scheduler, priority |
| `debugging-testing` | 调试与测试 | 20 | breakpoint, watchdog, trace, assertion, log |
| `compilation-build` | 编译与构建 | 15 | compiler, linker, makefile, toolchain, cross-compile |

**总计：~225 个词汇**，每条约 200 bytes → 约 45KB，远低于 5MB 限制。

### 7.2 词汇条目示例

```javascript
{
  id: "mem-003",
  en: "buffer",
  cn: "缓冲区",
  category: "memory-management",
  definition: "A temporary storage area in memory used to hold data while it is being transferred",
  example: "char buffer[256]; // declare a 256-byte buffer",
  difficulty: 1,
  partOfSpeech: "noun",
  relatedWords: ["mem-006", "mem-008"]
}
```

---

## 八、实现阶段划分

### Phase 1：骨架搭建（预计工作量：核心）
- [ ] HTML 主体结构（导航 + 视图容器）
- [ ] CSS 全局样式 + 主题变量系统
- [ ] JS 模块命名空间 `EST`
- [ ] `localStorage` 读写封装（`EST.data`）
- [ ] 视图切换路由系统
- [ ] 移动端响应式布局

### Phase 2：词汇数据层
- [ ] 全部 ~225 个嵌入式词汇数据（硬编码在 JS 中）
- [ ] 首次运行初始化逻辑（检测 `est_vocabulary` 是否存在）
- [ ] 词汇浏览器 UI（分类树 + 搜索 + 筛选）
- [ ] 词汇详情弹窗

### Phase 3：SRS 引擎
- [ ] 学习状态初始化（新单词默认 level=0）
- [ ] 复习队列计算（`EST.srs.computeQueue()`）
- [ ] 等级升降逻辑（`EST.srs.updateLevel()`）
- [ ] 下次复习时间计算（`EST.srs.scheduleNext()`）
- [ ] 毕业判定逻辑
- [ ] 边界情况：全部毕业、首次运行、数据损坏

### Phase 4：闪卡模式
- [ ] 卡片 UI（正面中文 + 翻转动画）
- [ ] 5 级自评按钮
- [ ] 键盘快捷键（空格翻转，1-5 评级）
- [ ] 进度显示
- [ ] Web Speech API 发音
- [ ] 提示功能（显示首字母）

### Phase 5：拼写模式
- [ ] 输入框 UI + 字符数提示
- [ ] 提交验证逻辑
- [ ] 正确/错误动画反馈
- [ ] 错误位置高亮
- [ ] 提示系统（首字母、跳过）
- [ ] 与 SRS 引擎联动

### Phase 6：测验模式
- [ ] 选择题生成（干扰项算法）
- [ ] 填空题生成（首字母/乱序字母）
- [ ] 题型随机混合
- [ ] 逐题即时反馈
- [ ] 测验总结（得分+错题回顾）
- [ ] 错题一键重做
- [ ] 与 SRS 引擎联动

### Phase 7：统计面板
- [ ] 今日数据摘要（复习数、正确率、耗时）
- [ ] 连续学习天数（streak）
- [ ] 掌握等级分布（CSS 柱状图）
- [ ] 每日学习热力图（最近30天）
- [ ] 分类掌握进度

### Phase 8：设置与数据管理
- [ ] 设置面板 UI
- [ ] 所有设置项读写
- [ ] 数据导出（JSON 文件下载）
- [ ] 数据导入（JSON 文件上传）
- [ ] 重置确认 + 执行
- [ ] 主题切换（浅色/深色/自动）

### Phase 9：首次引导与收尾
- [ ] 首次使用引导流程（3-4 步简单说明）
- [ ] 空状态占位图（各面板暂无数据时）
- [ ] loading 状态处理
- [ ] 错误状态处理（localStorage 不可用等）
- [ ] 浏览器兼容性检查
- [ ] 最终 CSS polish（过渡动画、微交互）

---

## 九、关键技术决策

### 9.1 localStorage 键名设计
```
est_vocabulary   — 词汇库 (JSON array)
est_state        — 学习状态 (JSON object, keyed by wordId)
est_settings     — 用户设置 (JSON object)
est_daily        — 每日记录 (JSON object, keyed by date string)
est_version      — 数据版本号 (用于未来升级迁移)
```

### 9.2 数据版本管理
```javascript
const DATA_VERSION = 1;
// 检测版本不匹配时执行迁移逻辑
// 未来若增加字段，通过版本号触发数据迁移
```

### 9.3 Web Speech API 使用策略
```javascript
// 检测支持，不支持则隐藏发音按钮
if ('speechSynthesis' in window) {
  // 使用英语语音
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = 'en-US';
  utterance.rate = 0.8; // 稍慢，适合学习
  speechSynthesis.speak(utterance);
}
```

### 9.4 性能优化
- 视图懒渲染：仅渲染当前活动视图
- 复习队列计算缓存（仅在状态变更后重算）
- DOM 批量更新（使用 DocumentFragment）
- 事件委托（避免大量独立事件监听器）
- CSS `will-change` 用于翻转动画

---

## 十、风险与缓解措施

| 风险 | 概率 | 影响 | 缓解措施 |
|------|------|------|----------|
| localStorage 被清空 | 低 | 高 | 提供导出功能，定期提示用户备份 |
| localStorage 容量不足(5MB) | 低 | 中 | 词汇数据约45KB+状态约20KB，总量可控；旧日志可清理 |
| 浏览器不支持某些CSS特性 | 低 | 低 | 使用广泛支持的CSS特性，添加@supports降级 |
| Web Speech API 不可用 | 中 | 低 | 降级隐藏发音按钮，不影响核心功能 |
| 移动端键盘遮挡输入框 | 中 | 中 | 使用 `visualViewport` API 调整布局 |
| 用户忘记备份导致数据丢失 | 中 | 高 | 每次学习结束后提示备份 |
| 中文编码问题 | 低 | 高 | HTML 声明 `<meta charset="UTF-8">` |

---

## 十一、验收标准

- [ ] HTML 文件可脱离网络在浏览器中完整运行
- [ ] 所有 225 个嵌入式词汇正确加载
- [ ] SRS 算法正确实现等级升降和复习排期
- [ ] 闪卡模式可正常翻转、评级
- [ ] 拼写模式可正常输入、验证、纠错
- [ ] 测验模式可正常出题、评分、回顾
- [ ] 统计面板数据正确
- [ ] 数据导出/导入正常工作
- [ ] 主题切换正常
- [ ] 移动端布局正常（375px 宽度）
- [ ] 深色主题无对比度问题
- [ ] 首次引导流程完整
- [ ] 所有空状态有合理占位提示

---

## 十二、交付物

1. **`index.html`** — 完整可运行的单文件应用
2. **使用说明书** — 中文，面向零英语用户
3. **交接文档** — 技术架构说明，便于后续维护
