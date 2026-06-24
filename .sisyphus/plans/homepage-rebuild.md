# Homepage Rebuild: Keykey 首页完整实现

## TL;DR

> **Quick Summary**: Rebuild index.html to exactly match `doc/开发描述文档.md` — complete with collapsible overlay sidebar, online dictionary via OED CDN, user data export/import to `user_data/`, and the missing Module 2 (页面异常处理).
>
> **Deliverables**:
> - Overlay sidebar with default-collapsed state + edge trigger bar + mask
> - Module 2: 页面异常处理 card with "立即修复" button
> - OED CDN integration replacing dict.js (22K+ words with Chinese definitions + examples + word comparisons)
> - user_data export/import (localStorage + JSON file)
> - Bottom promo card in sidebar + theme toggle
> - Updated branding from "小明学英语" to Keykey
>
> **Estimated Effort**: Large (6-8 tasks across 3 waves)
> **Parallel Execution**: YES — 3 waves
> **Critical Path**: CSS foundation → Sidebar JS → OED integration → user_data → Polish

---

## Context

### Original Request
The user provided `doc/开发描述文档.md` — a complete development description for [keykey.cc/dash](keykey.cc/dash) style homepage. The current index.html partially implements the page but has key gaps:

1. Sidebar uses push-style expansion (should be overlay with mask)
2. Sidebar defaults to expanded (should default collapsed with edge trigger)
3. Missing Module 2 (页面异常处理 card)
4. Missing sidebar bottom promo card + theme toggle
5. Uses offline dict.js (8000 words, minimal data) — user wants online OED API
6. No user_data export/import mechanism

### Interview Summary
**Key Decisions**:
- **Sidebar**: Strictly follow document — default collapsed, overlay with mask, edge trigger bar, click mask/X to close
- **Dictionary source**: Replace dict.js with plumsun/open-english-dictionary via jsDelivr CDN (MIT license, 25K words, Chinese-English)
- **User data**: Store in localStorage + export/import to `user_data/` via JSON file download/upload
- **Module 2**: 页面异常处理 card with "立即修复" button that clears localStorage cache and reloads

**Research Findings**:
- plumsun/open-english-dictionary data format: `{ word, pronunciation, concise_definition, forms, definitions: [{pos, explanation_en, explanation_cn, example_en, example_cn}], comparison: [{word_to_compare, analysis}] }`
- jsDelivr CDN URL: `https://cdn.jsdelivr.net/gh/plumsun/open-english-dictionary@master/dictionary/{word}.json` — confirmed working
- MIT License — free for any use

---

## Work Objectives

### Core Objective
Rewrite index.html to be a pixel-perfect implementation of `doc/开发描述文档.md` with OED online dictionary and user_data export/import.

### Concrete Deliverables
- `index.html` — Complete single-file implementation
- `user_data/` directory — Target for export files, source for import files
- `dict.js` — **REMOVED** (replaced by OED CDN)
- `README.md` — Updated to reflect online dependency + user_data feature

### Definition of Done
- [ ] Sidebar defaults collapsed, edge trigger bar visible
- [ ] Click edge bar → sidebar slides open as overlay with mask
- [ ] Click mask or X → sidebar closes
- [ ] Search word → fetch from OED CDN → render two-column result
- [ ] All 7 nav items + 3 secondary nav items + bottom promo card present
- [ ] Module 2 (页面异常处理) card present with working "立即修复" button
- [ ] Export button → downloads JSON to user_data/ convention
- [ ] Import button → opens file picker, loads into localStorage
- [ ] Sun icon theme toggle works (light/dark mode)
- [ ] dict.js no longer referenced anywhere
- [ ] Branding updated to Keykey

### Must Have
- Overlay sidebar with exact interaction as described in doc Section 3
- OED CDN as search data source for all words
- user_data export/import with file save/open
- Module 2 page error handling card with working repair button
- Sidebar bottom promo card "看视频·学语言"

### Must NOT Have (Guardrails)
- No offline dict.js — completely removed
- No server-side components — pure single-file frontend
- No external npm packages — inline SVG icons only
- No CORS issues — CDN has proper CORS headers
- No broken existing features (speech, copy, two-column layout)

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed.

### Test Decision
- **Infrastructure exists**: NO (no test framework in project)
- **Automated tests**: None (agent-executed QA scenarios only)
- **Agent-Executed QA**: MANDATORY — every task includes detailed scenarios

### QA Policy
Every task includes agent-executed QA scenarios. Evidence saved to `.sisyphus/evidence/task-{N}-{scenario}.{ext}`.

- **UI verification**: Playwright browser automation — navigate, click, assert DOM state, screenshot
- **API verification**: Bash (curl) — fetch OED CDN, assert response shape
- **Functional verification**: tmux/interactive_bash — load page, interact, validate

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Foundation — CSS, HTML structure, utilities):
├── Task 1: Sidebar CSS overhaul (default collapse, overlay, mask, trigger bar)
├── Task 2: Module 2 页面异常处理 card (HTML + CSS)
├── Task 3: OED fetch utility (fetchWordData function)
├── Task 4: user_data export/import module (JS functions)
└── Task 5: Theme toggle CSS variables (light/dark mode)

Wave 2 (Core behavior — JS interactions, data flow):
├── Task 6: Sidebar JS (toggle, mask, close, edge trigger)
├── Task 7: Sidebar bottom promo card + complete nav HTML
├── Task 8: OED integration in performSearch() + result renderer
├── Task 9: user_data UI buttons + event handlers
└── Task 10: Theme toggle JS + localStorage persistence

Wave 3 (Polish — branding, cleanup, docs):
├── Task 11: Branding update (title tags, site name, favicon)
├── Task 12: Remove dict.js + RICH_DATA cleanup
└── Task 13: README update + final integration tests

Wave FINAL (Verification):
├── F1: Plan compliance audit (oracle)
├── F2: Code quality review (unspecified-high)
├── F3: Full QA scenario execution (unspecified-high + playwright)
└── F4: Scope fidelity check (deep)
```

---

## TODOs

- [x] 1. **Sidebar CSS Overhaul — default collapsed + overlay + mask + trigger bar**

  **What to do**:
  - Modify sidebar CSS to default to collapsed state (`width: 0` or collapased via class on load)
  - Add CSS for overlay mode: sidebar positioned fixed with `z-index: 200`, slides in from left
  - Add mask overlay: fixed full-screen semi-transparent (`rgba(0,0,0,0.3)`), hidden by default
  - Add edge trigger bar: a thin (4-6px) gray vertical bar fixed to left edge of viewport, only visible when sidebar is collapsed
  - Ensure smooth CSS transitions for sidebar slide + mask fade
  - CSS variables for sidebar-collapsed-width: 0 (not 64px — document says only edge bar when collapsed)
  - The edge trigger bar should be ~40px tall, vertically centered, with rounded ends

  **Must NOT do**:
  - Don't change the push-style main content margin (sidebar is now overlay, not push)
  - Don't remove existing navigation item styles (they'll be reused)
  - Don't break current .sidebar.collapsed rules — we're changing the interaction model

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: This is pure CSS/layout restructuring for precise visual behavior
  - **Skills**: [`playwright` for verification]
    - `playwright`: To verify sidebar states via browser automation

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 2, 3, 4, 5)
  - **Blocks**: Task 6 (Sidebar JS)
  - **Blocked By**: None (can start immediately)

  **References**:
  - `doc/开发描述文档.md:45-49` — "覆盖式展开（overlay）... 遮罩层" — exact interaction specs
  - `doc/开发描述文档.md:295-297` — "默认是折叠的，只在页面最左侧有一个小的灰色竖条" — edge trigger spec
  - `index.html:59-76` — Current sidebar CSS (needs modification)

  **Acceptance Criteria**:
  **QA Scenarios (MANDATORY):**
  ```
  Scenario: Sidebar default collapsed state
    Tool: Playwright
    Preconditions: Fresh page load
    Steps:
      1. Navigate to index.html
      2. Assert .sidebar has 'collapsed' class
      3. Assert sidebar width is 0 or collapsed (not visually expanded)
      4. Assert edge trigger bar is visible on the left edge
      5. Assert mask overlay is hidden (display:none or opacity:0)
    Expected Result: Sidebar starts collapsed with only trigger bar visible
    Evidence: .sisyphus/evidence/task-1-default-collapsed.png

  Scenario: Sidebar overlay expansion
    Tool: Playwright
    Preconditions: Sidebar in collapsed state
    Steps:
      1. Click the edge trigger bar
      2. Assert .sidebar no longer has 'collapsed' class
      3. Assert sidebar is visible (width > 0)
      4. Assert mask overlay is now visible (opacity > 0)
    Expected Result: Sidebar expands, mask appears
    Evidence: .sisyphus/evidence/task-1-overlay-expanded.png
  ```
  **Evidence to Capture:**
  - [ ] task-1-default-collapsed.png
  - [ ] task-1-overlay-expanded.png

  **Commit**: YES (group with Tasks 2-5)
  - Message: `refactor(sidebar): rebuild sidebar with overlay, default collapse, mask`
  - Files: `index.html`

- [x] 2. **Module 2: 页面异常处理 Card (HTML + CSS)**

  **What to do**:
  - Add new card after the search card in the main content area
  - Card structure:
    - White card container (same style as search card — `.search-card` styles)
    - Left-right layout:
      - Left: Title "页面异常处理" (bold, dark), subtitle "遇到白屏、旧版本资源或缓存异常时，可先清理本地资源缓存并刷新页面。" (gray small text)
      - Right: "立即修复" button with refresh/loop icon on the left, light gray background
  - Card should be slightly shorter than search card
  - Use existing CSS variables and card patterns (same border-radius, padding, shadow)

  **Must NOT do**:
  - Don't create new CSS if existing patterns work (reuse `.search-card`, create minimal new classes)
  - Don't add JS functionality yet (Task 9 handles the "立即修复" logic)
  - Don't change the search card above

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: HTML/CSS card component with specific layout
  - **Skills**: [`playwright` for verification]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 3, 4, 5)
  - **Blocks**: Task 9 (user_data/repair button handlers)
  - **Blocked By**: None

  **References**:
  - `doc/开发描述文档.md:147-168` — Full spec for Module 2 card
  - `index.html:1063-1099` — Existing search card structure (pattern to follow)
  - `index.html:500-603` — Existing card CSS patterns

  **Acceptance Criteria**:
  **QA Scenarios (MANDATORY):**
  ```
  Scenario: Module 2 card renders correctly
    Tool: Playwright
    Preconditions: Fresh page load
    Steps:
      1. Navigate to index.html
      2. Scroll down past search card
      3. Assert card exists (find text "页面异常处理")
      4. Assert "立即修复" button exists
      5. Assert refresh icon exists (SVG element)
      6. Assert card has same width as search card above
    Expected Result: Module 2 card is present with correct content
    Evidence: .sisyphus/evidence/task-2-module2-card.png
  ```
  **Evidence to Capture:**
  - [ ] task-2-module2-card.png

  **Commit**: YES (group with Tasks 1, 3-5)

- [x] 3. **OED Fetch Utility (fetchWordData function)**

  **What to do**:
  - Create a new `async function fetchWordData(word)` in the page's JavaScript
  - Function should:
    1. Normalize input (trim, lowercase)
    2. Fetch from `https://cdn.jsdelivr.net/gh/plumsun/open-english-dictionary@master/dictionary/${word}.json`
    3. On 404 → return `null` (word not found in OED)
    4. On network error → throw with user-friendly message
    5. On success → return parsed JSON
    6. Add a simple in-memory cache (`Map<string, object>`) to avoid repeated fetches for same word
  - Add `encodeURIComponent()` for safety
  - Add timeout (8s) via AbortController to prevent hanging on slow networks

  **Must NOT do**:
  - Don't modify any existing rendering code (renderer is Task 8)
  - Don't add UI error display here (caller handles it)
  - Don't import external libraries — pure vanilla JS

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Single self-contained async utility function
  - **Skills**: None needed

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2, 4, 5)
  - **Blocks**: Task 8 (OED integration)
  - **Blocked By**: None

  **References**:
  - Confirmed CDN URL pattern: `https://cdn.jsdelivr.net/gh/plumsun/open-english-dictionary@master/dictionary/{word}.json`
  - Verified data structure: `{ word, pronunciation, concise_definition, forms, definitions: [{pos, explanation_en, explanation_cn, example_en, example_cn}], comparison: [{word_to_compare, analysis}] }`
  - `index.html:1417-1438` — Current performSearch() flow (needs modification in Task 8)

  **Acceptance Criteria**:
  **QA Scenarios (MANDATORY):**
  ```
  Scenario: OED fetch for existing word
    Tool: Bash (curl)
    Preconditions: Internet connection
    Steps:
      1. curl -s "https://cdn.jsdelivr.net/gh/plumsun/open-english-dictionary@master/dictionary/hello.json"
      2. Parse JSON and assert: word === "hello", pronunciation exists, definitions array length > 0
      3. Assert first definition has: pos, explanation_en, explanation_cn, example_en, example_cn
    Expected Result: Full rich data returned for "hello"
    Evidence: .sisyphus/evidence/task-3-oed-hello.json

  Scenario: OED fetch for non-existent word
    Tool: Bash (curl)
    Preconditions: Internet connection
    Steps:
      1. curl -s -o /dev/null -w "%{http_code}" "https://cdn.jsdelivr.net/gh/plumsun/open-english-dictionary@master/dictionary/xyzunknown.json"
    Expected Result: HTTP 404
    Evidence: .sisyphus/evidence/task-3-oed-404.txt
  ```
  **Evidence to Capture:**
  - [ ] task-3-oed-hello.json
  - [ ] task-3-oed-404.txt

  **Commit**: YES (group with Tasks 1, 2, 4, 5)

- [x] 4. **user_data Export/Import Module**

  **What to do**:
  - Create JavaScript functions for data export/import:
    - `exportUserData()`: 
      1. Read all keys from localStorage that start with `keykey_` (or all localStorage data relevant to the app)
      2. Serialize to JSON
      3. Create a Blob and trigger download as `user_data/keykey-backup-{YYYY-MM-DD}.json`
      Note: Browser security doesn't allow writing to arbitrary paths — use download with suggested filename
    - `importUserData()`:
      1. Create a hidden `<input type="file" accept=".json">` element
      2. Trigger click to open file picker
      3. Read the uploaded JSON file
      4. Parse and write each key back to localStorage
      5. Show success message + reload page
    - Add helper `listUserDataKeys()` to namespace all app data under `keykey_` prefix
  - Add error handling for corrupted JSON files
  - Add confirmation dialog before import (overwrites existing data)

  **Must NOT do**:
  - Don't add UI buttons here (handled in Task 9)
  - Don't modify existing localStorage keys used by other parts of the app
  - Don't add any server-side components

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Well-understood pattern, self-contained utility functions
  - **Skills**: None needed

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2, 3, 5)
  - **Blocks**: Task 9 (user_data UI)
  - **Blocked By**: None

  **References**:
  - `user_data/` directory — target location (exists but empty)
  - `README.md` — existing export/import feature description (enhance to use user_data/ convention)
  - MDN: `Blob`, `URL.createObjectURL`, `<a>.download` for export
  - MDN: `<input type="file">` + `FileReader` for import

  **Acceptance Criteria**:
  **QA Scenarios (MANDATORY):**
  ```
  Scenario: Export triggers file download
    Tool: Playwright
    Preconditions: Page loaded, some data exists in localStorage
    Steps:
      1. Set localStorage item "keykey_test" = "test_value" via page.evaluate()
      2. Call exportUserData() directly
      3. Assert a download was triggered with filename matching "keykey-backup-*.json"
      4. Assert the downloaded file contains "keykey_test" and "test_value"
    Expected Result: JSON file downloaded with all keykey_ data
    Evidence: .sisyphus/evidence/task-4-export.txt

  Scenario: Import restores data
    Tool: Playwright
    Preconditions: Have a valid backup JSON file
    Steps:
      1. Clear localStorage
      2. Create a File object with test data
      3. Call importUserData() with the file
      4. Assert localStorage now contains the imported keys
    Expected Result: Data restored from file
    Evidence: .sisyphus/evidence/task-4-import.txt
  ```
  **Evidence to Capture:**
  - [ ] task-4-export.txt (download verification)
  - [ ] task-4-import.txt (import verification)

  **Commit**: YES (group with Tasks 1-3, 5)

- [x] 5. **Theme Toggle CSS Variables (Light/Dark Mode)**

  **What to do**:
  - Add CSS custom properties for dark mode under `[data-theme="dark"]` selector
  - Dark mode colors:
    - `--color-bg`: `#1a1a1a` (dark background)
    - `--color-sidebar`: `#222222`
    - `--color-card`: `#2a2a2a`
    - `--color-text-primary`: `#e8e8e8`
    - `--color-text-secondary`: `#aaaaaa`
    - `--color-text-tertiary`: `#777777`
    - `--color-divider`: `#333333`
    - `--color-hover`: `#333333`
    - `--color-active`: `#383838`
    - `--color-border`: `#404040`
    - `--color-accent`: `#e0e0e0`
    - `--shadow-card`: adjusted for dark mode
  - Ensure all existing CSS uses these variables (they already do — just need dark overrides)
  - Smooth transition for color changes (`transition: background var(--transition), color var(--transition)`)

  **Must NOT do**:
  - Don't add JS logic yet (handled in Task 10)
  - Don't change the HTML structure
  - Don't remove existing light mode variables

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: CSS-only addition, no logic changes
  - **Skills**: None needed

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1-4)
  - **Blocks**: Task 10 (theme toggle JS)
  - **Blocked By**: None

  **References**:
  - `index.html:17-35` — Existing CSS variables (pattern to follow for dark overrides)
  - `doc/开发描述文档.md:173-184` — Color palette documentation
  - `doc/开发描述文档.md:59` — Sun icon for theme toggle in sidebar

  **Acceptance Criteria**:
  **QA Scenarios (MANDATORY):**
  ```
  Scenario: Dark theme CSS variables apply correctly
    Tool: Playwright
    Preconditions: Page loaded
    Steps:
      1. Set `document.documentElement.setAttribute('data-theme', 'dark')` via page.evaluate()
      2. Assert background color of body changes (getComputedStyle)
      3. Assert card backgrounds are dark
      4. Assert text color changes to light
    Expected Result: All colors switch to dark palette
    Evidence: .sisyphus/evidence/task-5-dark-theme.png

  Scenario: Light theme restore
    Tool: Playwright
    Preconditions: Page in dark mode
    Steps:
      1. Remove `data-theme` attribute
      2. Assert colors return to light mode defaults
    Expected Result: Colors revert to light palette
    Evidence: .sisyphus/evidence/task-5-light-theme.png
  ```
  **Evidence to Capture:**
  - [ ] task-5-dark-theme.png
  - [ ] task-5-light-theme.png

  **Commit**: YES (group with Tasks 1-4)

---

## TODOs (Wave 2 — Core Behavior)

- [x] 6. **Sidebar JS: Overlay Behavior (toggle, mask, close)**

  **What to do**:
  - Rewrite sidebar toggle interaction:
    - On page load: sidebar starts with `collapsed` class (default collapsed)
    - Edge trigger bar click: remove `collapsed` class → sidebar slides in, mask fades in
    - Mask click: add `collapsed` class → sidebar slides out, mask fades out
    - X button in sidebar header: same as mask click
    - Ensure body scroll is disabled when sidebar is open (prevent background scrolling)
  - Edge trigger bar: add click event listener (create if not in HTML)
  - Update the existing toggle button (currently `sidebarToggle`) to work as X close button
  - Add keyboard support: `Escape` key closes sidebar when open
  - Add aria attributes for accessibility: `aria-expanded`, `aria-label`

  **Must NOT do**:
  - Don't change sidebar HTML structure (will be updated in Task 7 if needed)
  - Don't break existing nav item click handlers
  - Don't add overlay logic to main content margin (sidebar is overlay, not push)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Single-file JS interaction logic, well-understood pattern
  - **Skills**: [`playwright` for verification]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 7, 8, 9, 10)
  - **Blocks**: None
  - **Blocked By**: Task 1

  **References**:
  - `doc/开发描述文档.md:45-49` — "覆盖式展开（overlay）... 遮罩层" — overlay spec
  - `doc/开发描述文档.md:295-297` — "默认是折叠的" — default state spec
  - `index.html:1107-1122` — Current sidebar toggle JS (needs rewrite)
  - `index.html:59-76` — Current sidebar CSS (modified in Task 1)

  **Acceptance Criteria**:
  **QA Scenarios (MANDATORY):**
  ```
  Scenario: Edge trigger → open sidebar
    Tool: Playwright
    Preconditions: Page loaded, sidebar collapsed
    Steps:
      1. Find edge trigger bar (small vertical bar on left edge)
      2. Click it
      3. Assert sidebar does NOT have 'collapsed' class
      4. Assert mask overlay is visible (opacity > 0 or display: block)
    Expected Result: Sidebar opens with mask
    Evidence: .sisyphus/evidence/task-6-sidebar-open.png

  Scenario: Mask click → close sidebar
    Tool: Playwright
    Preconditions: Sidebar open
    Steps:
      1. Click the mask overlay (not the sidebar itself)
      2. Assert sidebar has 'collapsed' class
      3. Assert mask overlay is hidden
    Expected Result: Sidebar closes, mask disappears
    Evidence: .sisyphus/evidence/task-6-sidebar-close-mask.png

  Scenario: X button → close sidebar
    Tool: Playwright
    Preconditions: Sidebar open
    Steps:
      1. Click X button in sidebar header
      2. Assert sidebar has 'collapsed' class
    Expected Result: Sidebar closes via X button
    Evidence: .sisyphus/evidence/task-6-sidebar-close-x.png

  Scenario: Escape key → close sidebar
    Tool: Playwright
    Preconditions: Sidebar open
    Steps:
      1. Press Escape key
      2. Assert sidebar has 'collapsed' class
    Expected Result: Sidebar closes via keyboard
    Evidence: .sisyphus/evidence/task-6-sidebar-escape.txt
  ```
  **Evidence to Capture:**
  - [ ] task-6-sidebar-open.png
  - [ ] task-6-sidebar-close-mask.png
  - [ ] task-6-sidebar-close-x.png
  - [ ] task-6-sidebar-escape.txt

  **Commit**: YES (group with Task 7)
  - Message: `feat(sidebar): add overlay JS, bottom promo card, theme toggle`
  - Files: `index.html`

- [x] 7. **Sidebar: Bottom Promo Card + Complete Nav HTML**

  **What to do**:
  - Add bottom promo card to sidebar HTML:
    - Dashed border container
    - Left: chat bubble SVG icon
    - Title "看视频·学语言", subtitle "语境功能 公测启动"
    - Button "点此参与" with light gray background
  - Verify all navigation items match the doc exactly:
    - Main nav (7): 首页, 单词练习, 句子练习, 资源中心, 复习中心, 发音学习, 知识文章
    - Secondary nav (3, under divider): 学习统计, 个人中心, 共建计划
    - "首页" has `.active` class by default
  - Verify all SVG icons are present for each nav item
  - Ensure nav-text labels use proper formatting

  **Must NOT do**:
  - Don't change sidebar JS behavior (handled in Task 6)
  - Don't add actual navigation routing (single page, nav items are visual only for now)
  - Don't remove existing nav items that match the doc

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: HTML structure with specific visual components
  - **Skills**: [`playwright` for verification]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 6, 8, 9, 10)
  - **Blocks**: None
  - **Blocked By**: Task 1 (CSS structure)

  **References**:
  - `doc/开发描述文档.md:61-100` — Full nav menu structure
  - `doc/开发描述文档.md:93-100` — Bottom promo card spec
  - `index.html:1006-1055` — Current sidebar HTML (needs bottom card added)

  **Acceptance Criteria**:
  **QA Scenarios (MANDATORY):**
  ```
  Scenario: All nav items present
    Tool: Playwright
    Preconditions: Sidebar open
    Steps:
      1. Open sidebar
      2. Assert text "首页" exists and has active class
      3. Assert text "单词练习" exists
      4. Assert text "句子练习" exists
      5. Assert text "资源中心" exists
      6. Assert text "复习中心" exists
      7. Assert text "发音学习" exists
      8. Assert text "知识文章" exists
      9. Assert text "学习统计" exists
      10. Assert text "个人中心" exists
      11. Assert text "共建计划" exists
    Expected Result: All 10 nav items present
    Evidence: .sisyphus/evidence/task-7-all-nav-items.png

  Scenario: Bottom promo card
    Tool: Playwright
    Preconditions: Sidebar open
    Steps:
      1. Open sidebar
      2. Scroll to bottom of sidebar
      3. Assert "看视频·学语言" title exists
      4. Assert "语境功能 公测启动" subtitle exists
      5. Assert "点此参与" button exists
      6. Assert card has dashed border style
    Expected Result: Promo card present with all elements
    Evidence: .sisyphus/evidence/task-7-promo-card.png
  ```
  **Evidence to Capture:**
  - [ ] task-7-all-nav-items.png
  - [ ] task-7-promo-card.png

  **Commit**: YES (group with Task 6)

- [x] 8. **OED Integration in performSearch() + Result Renderer**

  **What to do**:
  - Modify `performSearch()` function:
    1. Remove RICH_DATA check (no hardcoded demo data)
    2. Remove DICT check (no dict.js offline dictionary)
    3. Call `fetchWordData(query)` instead
    4. While fetching: show loading state (animated skeleton or "查询中..." text)
    5. On success: call new `renderOEDResult(data)`
    6. On null (not found): show "未找到「{word}」的释义，请尝试其他单词"
    7. On error (network): show "网络不可用，请检查网络连接"
    8. Use in-memory cache Map (from Task 3) to avoid redundant fetches
  - Create `renderOEDResult(data)`:
    - Left column:
      - Word header: word + pronunciation (from OED's phonetic) + speaker + copy buttons
      - "词卡" tag badge
      - Definitions: iterate `data.definitions`, show `pos` + `explanation_cn` (Chinese meaning)
        - Optionally show `explanation_en` in lighter gray below as bonus
      - Section divider
      - If data has `forms` (e.g., plural): show word forms as a compact section title "词形变化"
    - Right column:
      - Section "近义辨析": iterate `data.comparison`, show `word_to_compare` + `analysis`
      - Section divider
      - Section "例句": extract `example_en` + `example_cn` from each definition into a flat list
    - The previous "词组搭配" section is replaced by word comparisons (OED has no collocations)
  - Ensure copy button includes all the new data fields
  - Ensure speaker button still works with SpeechSynthesis

  **Must NOT do**:
  - Don't remove the speaker/copy button functionality
  - Don't show English explanation as primary (Chinese is primary, English is bonus)
  - Don't remove the two-column layout structure

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Core functionality change — data flow rewrite + new renderer
  - **Skills**: [`playwright` for verification]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 6, 7, 9, 10)
  - **Blocks**: Task 11-12 (cleanup)
  - **Blocked By**: Task 3 (OED fetch utility)

  **References**:
  - `index.html:1417-1438` — Current performSearch() (needs rewrite)
  - `index.html:1220-1325` — Current renderRichResult() (pattern for new renderer)
  - `index.html:1330-1400` — Current renderDictResult() (pattern for basic renderer)
  - OED data shape: `{ word, pronunciation, definitions[{pos, explanation_en, explanation_cn, example_en, example_cn}], comparison[{word_to_compare, analysis}], forms{} }`

  **Acceptance Criteria**:
  **QA Scenarios (MANDATORY):**
  ```
  Scenario: OED result renders for "hello"
    Tool: Playwright
    Preconditions: Page loaded, OED fetch utility ready
    Steps:
      1. Type "hello" in search input
      2. Click search button
      3. Wait for result to load (loading state appears then resolves)
      4. Assert word "hello" displayed in word-text
      5. Assert pronunciation "huh·loh" displayed
      6. Assert definitions exist with POS + Chinese explanation
      7. Assert "近义辨析" section with "hi", "hey", "greetings"
      8. Assert example sentences with Chinese translations
    Expected Result: Full rich result from OED API
    Evidence: .sisyphus/evidence/task-8-hello-result.png

  Scenario: Unknown word shows error
    Tool: Playwright
    Preconditions: Page loaded
    Steps:
      1. Type "xyzunknown" in search input
      2. Click search button
      3. Wait for response
      4. Assert error message contains "未找到"
    Expected Result: "未找到" error for non-existent word
    Evidence: .sisyphus/evidence/task-8-not-found.png

  Scenario: Loading state visible during fetch
    Tool: Playwright
    Preconditions: Page loaded
    Steps:
      1. Type "computer" in search input
      2. Click search button
      3. Immediately after click, assert loading indicator visible (text or skeleton)
      4. Wait for result
      5. Assert loading indicator gone, result displayed
    Expected Result: Loading state shown during request
    Evidence: .sisyphus/evidence/task-8-loading-state.png

  Scenario: Speaker button works on OED result
    Tool: Playwright
    Preconditions: Result loaded for "hello"
    Steps:
      1. Click speaker button
      2. Assert speechSynthesis.speak was called (verify via page.evaluate)
    Expected Result: Speech synthesis triggered for "hello"
    Evidence: .sisyphus/evidence/task-8-speaker.txt
  ```
  **Evidence to Capture:**
  - [ ] task-8-hello-result.png
  - [ ] task-8-not-found.png
  - [ ] task-8-loading-state.png
  - [ ] task-8-speaker.txt

  **Commit**: YES
  - Message: `feat(search): integrate OED CDN, replace dict.js`
  - Files: `index.html`

- [x] 9. **user_data UI Buttons + Event Handlers**

  **What to do**:
  - Add data management UI:
    - "导出数据" button: triggers `exportUserData()` from Task 4
    - "导入数据" button: triggers `importUserData()` from Task 4
    - Wire "立即修复" button (from Module 2 card in Task 2):
      - Clear all `keykey_` prefixed items from localStorage
      - Show brief success toast
      - Reload page after 1 second
  - Add user confirmation dialogs:
    - Before import: "确认导入？将覆盖现有数据"
    - Before repair: "将清除所有本地数据并刷新页面，确认？"
  - Place export/import buttons within or near the 页面异常处理 card
  - Add a `<div id="toast">` element for brief notifications

  **Must NOT do**:
  - Don't remove existing functionality
  - Don't trigger import/export without user action
  - Don't add server-side components

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Button wiring + confirmation dialogs
  - **Skills**: [`playwright` for verification]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 6, 7, 8, 10)
  - **Blocks**: Task 13 (README update)
  - **Blocked By**: Task 2 (Module 2 HTML), Task 4 (export/import functions)

  **References**:
  - `doc/开发描述文档.md:147-168` — Module 2 with "立即修复" button
  - `README.md` — Existing data management description

  **Acceptance Criteria**:
  **QA Scenarios (MANDATORY):**
  ```
  Scenario: Export button triggers download
    Tool: Playwright
    Preconditions: Page loaded
    Steps:
      1. Set localStorage item via page.evaluate()
      2. Click "导出数据" button
      3. Assert download triggered with correct filename pattern
    Expected Result: JSON backup downloaded
    Evidence: .sisyphus/evidence/task-9-export.txt

  Scenario: "立即修复" clears data and reloads
    Tool: Playwright
    Preconditions: Some localStorage data exists
    Steps:
      1. Set keykey_ test items in localStorage
      2. Click "立即修复" button
      3. Accept confirmation dialog
      4. Assert localStorage has no keykey_ items
      5. Assert page reloads
    Expected Result: Data cleared, page refreshed
    Evidence: .sisyphus/evidence/task-9-repair.txt
  ```
  **Evidence to Capture:**
  - [ ] task-9-export.txt
  - [ ] task-9-repair.txt

  **Commit**: YES (group with Task 10)
  - Message: `feat(data): add user_data export/import + repair`
  - Files: `index.html`

- [x] 10. **Theme Toggle JS + localStorage Persistence**

  **What to do**:
  - Add click handler to the sun icon in sidebar header:
    - Toggle `data-theme` attribute on `<html>` element
    - Save preference to localStorage as `keykey_theme`
    - Update icon visual: sun ↔ moon (or use different icon to indicate state)
  - On page load: check localStorage for `keykey_theme` and apply saved theme
  - Ensure smooth color transition (CSS already handles this from Task 5)
  - Add visual feedback: subtle rotation animation on toggle

  **Must NOT do**:
  - Don't break the sidebar toggle behavior
  - Don't add complex animation
  - Don't store theme in cookie or server

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple toggle logic + localStorage persistence
  - **Skills**: [`playwright` for verification]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 6, 7, 8, 9)
  - **Blocks**: None
  - **Blocked By**: Task 5 (CSS variables)

  **References**:
  - `index.html:85-113` — Sidebar header HTML (sun icon location)
  - `doc/开发描述文档.md:58-59` — "太阳形状图标（用于明暗主题切换）"

  **Acceptance Criteria**:
  **QA Scenarios (MANDATORY):**
  ```
  Scenario: Sun icon toggles to dark mode
    Tool: Playwright
    Preconditions: Page loaded in light mode
    Steps:
      1. Click sun icon in sidebar header
      2. Assert document.documentElement has 'data-theme="dark"'
      3. Assert localStorage keykey_theme === "dark"
      4. Assert background colors are dark
    Expected Result: Theme switches to dark mode
    Evidence: .sisyphus/evidence/task-10-theme-toggle-dark.png

  Scenario: Theme persists on reload
    Tool: Playwright
    Preconditions: Dark mode set and saved to localStorage
    Steps:
      1. Reload page
      2. Assert document.documentElement has 'data-theme="dark"'
      3. Assert page renders in dark mode
    Expected Result: Dark mode persists across reloads
    Evidence: .sisyphus/evidence/task-10-theme-persist.png
  ```
  **Evidence to Capture:**
  - [ ] task-10-theme-toggle-dark.png
  - [ ] task-10-theme-persist.png

  **Commit**: YES (group with Task 9)

---

## TODOs (Wave 3 — Polish & Cleanup)

- [x] 11. **Branding Update (title tags, site name)**

  **What to do**:
  - Update `<title>` from "小明学英语 - 英语学习" to "Keykey - 学英语 一个就够"
  - Update any visible branding text in the page to match Keykey identity
  - Update sidebar brand section to show the Keykey logo/text as described in the doc:
    - "左侧：黑色多面体/几何图标 + 文字「keykey.cc」"
  - Ensure consistent naming throughout the page

  **Must NOT do**:
  - Don't change any functionality
  - Don't add external dependencies

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple text replacements
  - **Skills**: None needed

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 12, 13)
  - **Blocks**: None
  - **Blocked By**: None

  **References**:
  - `doc/开发描述文档.md:9` — Site name "Keykey"
  - `doc/开发描述文档.md:56-57` — Brand section description
  - `index.html:6` — Current title tag

  **Acceptance Criteria**:
  **QA Scenarios (MANDATORY):**
  ```
  Scenario: Title updated
    Tool: Playwright
    Preconditions: Page loaded
    Steps:
      1. Assert document.title contains "Keykey"
      2. Assert sidebar brand text shows keykey.cc
    Expected Result: Branding updated
    Evidence: .sisyphus/evidence/task-11-branding.png
  ```
  **Evidence to Capture:**
  - [ ] task-11-branding.png

  **Commit**: YES (group with Task 12)
  - Message: `chore: remove dict.js, update branding`
  - Files: `index.html`, `dict.js` (deleted)

- [x] 12. **Remove dict.js + RICH_DATA Cleanup**

  **What to do**:
  - Delete the `<script src="dict.js"></script>` tag from index.html
  - Delete the `dict.js` file from project root
  - Remove the entire `RICH_DATA` constant object (no longer needed — all words come from OED API)
  - Remove the `parseDictEntry()` function (was used for dict.js data format)
  - Remove the `renderDictResult()` function (was used for dict.js results)
  - Remove the `POS_PATTERNS` and `detectPos()` function (only used by dict.js parser)
  - Remove `window.DICT` reference in old performSearch
  - Verify no remaining references to dict.js, DICT, RICH_DATA, parseDictEntry, renderDictResult

  **Must NOT do**:
  - Don't remove `attachSpeaker()` (still needed)
  - Don't remove `renderOEDResult()` or `fetchWordData()` (the new functions)
  - Don't remove the two-column layout CSS

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Straightforward deletion of dead code
  - **Skills**: None needed

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 11, 13)
  - **Blocks**: None
  - **Blocked By**: Task 8 (OED integration must be complete first)

  **References**:
  - `index.html:1105` — `<script src="dict.js">` tag
  - `index.html:1127-1158` — RICH_DATA constant
  - `index.html:1170-1211` — parseDictEntry + detectPos + POS_PATTERNS
  - `index.html:1330-1400` — renderDictResult function

  **Acceptance Criteria**:
  **QA Scenarios (MANDATORY):**
  ```
  Scenario: No dict.js dependency
    Tool: Bash (grep)
    Preconditions: None
    Steps:
      1. grep "dict.js" index.html
      2. grep "RICH_DATA" index.html
      3. grep "parseDictEntry" index.html
    Expected Result: All three grep commands return no matches
    Evidence: .sisyphus/evidence/task-12-no-dictjs.txt

  Scenario: dict.js file deleted
    Tool: Bash (Test-Path)
    Preconditions: None
    Steps:
      1. Test-Path dict.js
    Expected Result: False (file does not exist)
    Evidence: .sisyphus/evidence/task-12-no-file.txt
  ```
  **Evidence to Capture:**
  - [ ] task-12-no-dictjs.txt
  - [ ] task-12-no-file.txt

  **Commit**: YES (group with Task 11)

- [x] 13. **README Update + Final Integration**

  **What to do**:
  - Update README.md:
    - Remove "完全离线可用" claim
    - Add "在线词典查询 — 基于 Open English Dictionary (MIT)，通过 CDN 获取 25,000+ 单词的丰富释义、例句和近义辨析"
    - Update "零外部依赖" → document jsDelivr CDN dependency
    - Add user_data section: "数据存储于浏览器 localStorage，支持一键导出到 user_data/ 目录备份迁移"
    - Update export/import documentation to reference user_data/ convention
    - Update title references from "小明学英语" to "Keykey"
  - Run final integration check: open page, search word, verify all features work together

  **Must NOT do**:
  - Don't change the feature description (just update data source and storage)
  - Don't remove the existing SRS algorithm documentation

  **Recommended Agent Profile**:
  - **Category**: `writing`
    - Reason: Documentation updates
  - **Skills**: None needed

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 11, 12)
  - **Blocks**: None
  - **Blocked By**: Tasks 8, 9 (OED + user_data must be working)

  **References**:
  - `README.md` — Current README (needs modifications)
  - `doc/开发描述文档.md` — Branding and product name

  **Acceptance Criteria**:
  **QA Scenarios (MANDATORY):**
  ```
  Scenario: README updated
    Tool: Bash (Select-String)
    Preconditions: None
    Steps:
      1. Select-String -Pattern "完全离线" README.md
      2. Select-String -Pattern "Keykey" README.md
      3. Select-String -Pattern "user_data" README.md
      4. Select-String -Pattern "Open English Dictionary" README.md
    Expected Result: "完全离线" NOT found; "Keykey", "user_data", "Open English Dictionary" found
    Evidence: .sisyphus/evidence/task-13-readme-check.txt
  ```
  **Evidence to Capture:**
  - [ ] task-13-readme-check.txt

  **Commit**: YES
  - Message: `docs: update README for online dependency + user_data`
  - Files: `README.md`

---

## Final Verification Wave

> 4 review agents run in PARALLEL. ALL must APPROVE. Present results to user and get explicit "okay" before completing.

- [x] F1. **Plan Compliance Audit** — `oracle`
  Read the plan end-to-end. For each "Must Have": verify implementation exists (read file, curl endpoint, run command). For each "Must NOT Have": search codebase for forbidden patterns — reject with file:line if found. Check evidence files exist in .sisyphus/evidence/. Compare deliverables against plan.
  Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [x] F2. **Code Quality Review** — `unspecified-high`
  Run lint checks on index.html. Review all changes for: commented-out code, console.log in prod, unused imports, over-abstraction, generic names. Check AI slop patterns.
  Output: `Build [PASS/FAIL] | Lint [PASS/FAIL] | Files [N clean/N issues] | VERDICT`

- [x] F3. **Full QA Execution** — `unspecified-high` (+ `playwright` skill)
  Start from clean state. Execute EVERY QA scenario from EVERY task — follow exact steps, capture evidence. Test cross-task integration. Test edge cases. Save to `.sisyphus/evidence/final-qa/`.
  Output: `Scenarios [N/N pass] | Integration [N/N] | Edge Cases [N tested] | VERDICT`

- [x] F4. **Scope Fidelity Check** — `deep`
  For each task: read "What to do", read actual diff (git log/diff). Verify 1:1 — everything in spec was built (no missing), nothing beyond spec was built (no creep). Check "Must NOT do" compliance.
  Output: `Tasks [N/N compliant] | Contamination [CLEAN/N issues] | VERDICT`

---

## Commit Strategy

- **Task 1-5**: `refactor(sidebar): rebuild sidebar with overlay, default collapse, mask`
- **Task 6-7**: `feat(sidebar): add overlay JS, bottom promo card, theme toggle`
- **Task 8**: `feat(search): integrate OED CDN, replace dict.js`
- **Task 9-10**: `feat(data): add user_data export/import + theme persistence`
- **Task 11-12**: `chore: remove dict.js, update branding`
- **Task 13**: `docs: update README for online dependency + user_data`

---

## Success Criteria

### Verification Commands
```bash
# Open index.html in browser
start index.html

# Verify no dict.js dependency
grep -r "dict.js" index.html  # Should return nothing

# Verify OED URL pattern in code
grep -r "jsdelivr.net/gh/plumsun" index.html  # Should find the fetch URL
```

### Final Checklist
- [ ] Sidebar: default collapsed → click edge bar → overlay expands with mask
- [ ] Module 2: 页面异常处理 card visible below search card
- [ ] Search "english" → rich result from OED (not RICH_DATA)
- [ ] Search "computer" → definitions + examples + comparison from OED
- [ ] Search "xyzunknown" → error message shown
- [ ] Export → user_data/english-study-backup-YYYY-MM-DD.json
- [ ] Import → recovers data from user_data/ backup file
- [ ] Sun icon toggles theme (light ↔ dark)
- [ ] Click mask → sidebar closes
- [ ] dict.js file deleted from project root
