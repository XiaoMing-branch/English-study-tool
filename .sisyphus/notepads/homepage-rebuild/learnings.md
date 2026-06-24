# Learnings

## Sidebar Structure

- Sidebar is `<aside class="sidebar collapsed" id="sidebar">` at line ~975
- Contains: sidebar-header (brand + toggle), sidebar-nav (nav items), sidebar-promo (bottom card), all inside `<aside>`
- Nav items are 10 total: 7 main (首页, 单词练习, 句子练习, 资源中心, 复习中心, 发音学习, 知识文章) + 3 secondary (学习统计, 个人中心, 共建计划)
- `<div class="nav-divider">` separates main and secondary sections
- Section labels: "导航" for main, "更多" for secondary
- "首页" has `.active` class
- Bottom promo card `.sidebar-promo` sits outside `<nav>` but inside `<aside>`, before `</aside>`

## Promo Card Design

- Dashed border container (1.5px dashed var(--color-border))
- Chat bubble SVG icon (28x28, currentColor)
- Title: "看视频·学语言" (13px, font-weight 600)
- Subtitle: "语境功能 公测启动" (11px, color-text-tertiary)
- Button "点此参与" with background var(--color-active), border-radius 8px
- Collapsed sidebar hides promo with opacity:0, pointer-events:none, max-height:0
- All styles use design tokens (CSS variables) — no hardcoded visual values

## CSS Variables Used in Sidebar
- `--color-sidebar`: sidebar background
- `--color-text-primary/secondary/tertiary`: text colors
- `--color-hover`: hover state background
- `--color-active`: active/highlight background
- `--color-border`: border colors
- `--color-divider`: divider line color
- `--radius-card`, `--radius-nav`: border radius tokens
- `--transition`: transition timing
- `--sidebar-width`: 240px
- `--sidebar-collapsed-width`: 0

## Wave 1, Task 4 — User data export/import module

- The section immediately after `// UI refs` lines was `// OED cache & fetch`, not `// Dictionary helpers`. Always re-verify file content before editing.
- `localStorage.setItem()` in a `forEach` callback triggers biome lint rule `useIterableCallbackReturn`. Use a block body `{ ... }` instead of an expression body to silence it.
- The three functions were placed at lines 1182-1239, between `// UI refs` and `// OED cache & fetch` sections.
- `noUnusedVariables` warnings for `exportUserData` and `importUserData` are expected — UI buttons will be added in Task 9.

## 2026-06-24 — Task 5: Dark Mode CSS Variables

- Inserted `[data-theme="dark"]` block immediately after the `:root` block (line 35 → line 37-50)
- Dark mode overrides 11 color variables + `--shadow-card`, leaving all other CSS intact
- Added `transition: background var(--transition), color var(--transition), border-color var(--transition)` to the `html, body` selector for smooth theme switching
- No component CSS changes needed — all components already use `var(--color-*)` references
- No JS logic added — theme toggle activation belongs in Task 10

## 2026-06-24 — Task 2: Module 2 Error Handling Card

- Inserted `.error-card` CSS at line 552 (after `.search-header-btn:hover`, before `/* ---- Search input ---- */`)
- Card reuses same card tokens: `background: var(--color-card)`, `border: 1px solid var(--color-border)`, `border-radius: var(--radius-card)`, `box-shadow: var(--shadow-card)`
- Reduced vertical padding to `20px 32px` (vs search-card's `28px 32px`) to make it slightly shorter
- Added `margin-top: 20px` for spacing from search-card
- Left-right layout achieved with `display: flex; align-items: center; justify-content: space-between` on `.error-card`
- Left side: `<h3>` heading + `<p>` subtitle in a wrapper `<div>`
- Right side: `.error-card-btn` with refresh SVG icon (loop arrows) + text "立即修复"
- Button styled with `background: var(--color-active)`, `padding: 8px 16px`, `border-radius: 8px`, `font-family: inherit`, `cursor: pointer`
- No JS functionality added — button is just static HTML/CSS (Task 9 handles logic)

## Task 3 �� fetchWordData (OED Fetch Utility)

- Function placed inside DOMContentLoaded block, between export/import module and Dictionary helpers section
- CDN returns **403** (not 404) for missing words on jsdelivr �� handled both 403 and 404 as "not found"
- In-memory cache (wordCache Map) prevents redundant fetches; null results are NOT cached to allow retries
- AbortController with 8000ms timeout prevents hanging
- encodeURIComponent ensures safe URL construction
- All non-ok/non-4xx statuses throw with Chinese network error message
- Evidence collected: task-3-oed-hello.json (full data), task-3-oed-404.txt (status 403)

## Task 6 �� Sidebar JS: Overlay Behavior

- Added aria-expanded='false' to sidebarToggle button in HTML
- Created setSidebarCollapsed() helper function to centralize open/close logic
- toggleBtn click �� closes sidebar (adds collapsed class), aria-expanded='false', unlocks body scroll
- edgeTrigger click �� opens sidebar (removes collapsed class), aria-expanded='true', locks body scroll
- sidebarMask click �� closes sidebar (adds collapsed class), aria-expanded='false', unlocks body scroll
- Escape key �� closes sidebar if open, same as mask/toggle click
- Body scroll lock: overflow='hidden' when open, overflow='' when closed
- Used e parameter for event (consistent with existing nav items handler)

## 2026-06-24 — Task 9: user_data UI Buttons + Event Handlers

- Added `id="exportDataBtn"`, `id="importDataBtn"`, `id="repairBtn"` to buttons in the error card
- Wrapped right-side buttons in `<div class="error-card-actions">` with flex layout to accommodate three buttons
- "导出数据" button calls existing `exportUserData()` (no confirmation needed)
- "导入数据" button calls existing `importUserData()` (which has its own `confirm()` dialog)
- "立即修复" button shows `confirm('将清除所有本地数据并刷新页面，确认？')`, clears all `keykey_*` localStorage keys, shows toast, reloads after 1s
- Added `<div id="toast" class="toast">` fixed-position notification (bottom center, z-index: 9999, auto-hides after 3s)
- Toast CSS uses same design tokens as cards: `--color-card`, `--color-border`, `--radius-card`
- `showToast()` helper function updates `toast.textContent` and toggles `display` block/none
- Guardian `if (btn)` checks around all three button handlers since elements might not exist
- Used `forEach` with block body `{ }` to avoid biome `useIterableCallbackReturn` lint error
## 2026-06-24 — Task 8: OED Integration in performSearch() + Result Renderer

- Replaced performSearch() body: removed RICH_DATA/window.DICT checks, now calls fetchWordData(query) with Promise chain
- Loading state: searchResult.innerHTML text shown before fetch
- Success: calls new renderOEDResult(data) which renders two-column layout with word-header, definitions, forms (left) and comparisons, examples (right)
- Not found: showError with Chinese not-found message
- Network error: showError with Chinese network error message
- Copy button collects word + pronunciation + definitions + comparisons + examples via clipboard API
- Speaker button uses attachSpeaker(btn, data.word) (SpeechSynthesis)
- Added CSS: .def-meaning-en (secondary color, smaller text), .forms-list, .form-item, .form-key, .form-val (flex layout for word forms)
- noUnusedVariables warnings for RICH_DATA, renderRichResult, renderDictResult are expected — will be removed in Task 12
- Pronunciation from OED uses format like "huh·loh" (not /ˈɪŋɡlɪʃ/ phonetic symbols)
- renderOEDResult placed between renderDictResult and Shared helpers section

## Task 12 — dict.js + RICH_DATA Cleanup

- Removed `<script src="dict.js"></script>` tag (was line 1393) — the dict.js file is now deleted
- Removed `const RICH_DATA = { ... }` object (~30 lines) — the old demo data for "english" word
- Removed `const POS_PATTERNS` array + `function detectPos()` — old part-of-speech detection helpers
- Removed `function parseDictEntry()` — old entry parser used by renderDictResult
- Removed `function renderRichResult()` — old rich renderer for RICH_DATA (dead code, no callers)
- Removed `function renderDictResult()` — old basic renderer used before OED integration
- Code flow is now clean: themeToggle → UI refs → export/import → OED cache/fetch → showError → renderOEDResult → performSearch → shared helpers → event handlers
- lsp_diagnostics shows zero errors and zero noUnusedVariables warnings related to removed symbols
- Deleted dict.js from project root (confirmed with Test-Path returning False)

## Task 13 — README Update

- Title updated from "嵌入式英语学习工具" to "Keykey"
- Removed all "完全离线" claims from subtitle and feature list
- Added OED online dictionary bullet (line 18) and subtitle description (line 3)
- Updated "零外部依赖" to "在线词典数据 — 通过 jsDelivr CDN 获取 Open English Dictionary 数据"
- Updated data management section: export filename uses `user_data/keykey-backup-{YYYY-MM-DD}.json`
- Added `user_data/` naming convention note to data storage location section
## F1 Plan Compliance Audit - 2026-06-24
- All 13 tasks verified: Must Have [13/13], Must NOT Have [13/13], Final Checklist [10/10]
- dict.js deleted, no RICH_DATA/DICT/parseDictEntry/renderDictResult/POS_PATTERNS/detectPos remnants
- Branding fully updated (title, brand name, no 小明学英语)
- OED CDN URL confirmed at index.html:1548
- Evidence gap: only 2/30+ evidence files present; final-qa/ dir empty
- VERDICT: APPROVE (core implementation), CONDITIONAL (evidence needs separate pass)
