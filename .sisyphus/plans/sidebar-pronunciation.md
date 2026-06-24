# Sidebar Refactor + 发音学习 Page

## TL;DR

> **Quick Summary**: Convert sidebar from overlay+collapsed to push+expanded per corrected doc spec, add page switching for all 10 nav items, implement 发音学习 login prompt card and 8 placeholder pages.
>
> **Deliverables**:
> - Sidebar: push layout, default expanded, collapsed=icons only (~64px), no mask/edge-trigger
> - Theme toggle: moved from header to sidebar bottom, adds "浅色模式" text
> - Page switching: clicking any nav item renders its page (home, pronunciation, or placeholder)
> - 发音学习 page: centered login prompt card with music icon, description, login/register buttons
> - 8 placeholder pages: centered card with nav icon + title + "即将上线" message
>
> **Estimated Effort**: Medium (4 tasks, sequential — all modify index.html)
> **Parallel Execution**: Sequential (single file)
> **Critical Path**: CSS → HTML+JS → Page Infra → Pronunciation Page

---

## Context

### Original Request
User adjusted `doc/开发描述文档.md` with two updates:
1. **Sidebar corrected**: Was overlay+collapsed, should be push+expanded (always occupies left space, no mask, toggle at top-right)
2. **发音学习 page added**: New section 十 with login prompt card design

### Interview Summary
**Key Decisions**:
- All 10 nav items get page switching (not just 发音学习 + 首页)
- Bottom promo card + theme toggle content stays, only layout changes
- Music icon: Prometheus selects (match existing inline SVG style)
- Collapse state: NOT persisted — default expanded on every load
- Sidebar: default expanded, toggle to ~64px (icons only, text+promo hidden)
- Theme toggle: moves to sidebar bottom per doc spec, adds "浅色模式" text when expanded

### Current State (pre-existing)
- Sidebar: `position: fixed`, `z-index: 200`, overlay with mask (`#sidebarMask`), edge trigger (`#edgeTrigger`)
- Default: `collapsed` class applied → `width: 0`
- Theme toggle: in sidebar header (next to brand and toggle button)
- Nav items: click only toggles `.active` class — no page switching
- Main content: always shows search card + error card

---

## Work Objectives

### Core Objective
Rebuild sidebar to push+expanded layout and implement page switching for all nav items.

### Concrete Deliverables
- `index.html` — All changes

### Must Have
- Sidebar uses push layout (not overlay) — main content auto-adjusts via flex
- Sidebar defaults expanded (~240px)
- Click toggle button → collapse to ~64px (icons only, text+promo hidden)
- No mask overlay, no edge trigger, no Escape key close
- Clicking nav item switches page content in main area
- 发音学习 shows login prompt card (centered, music icon, login/register buttons)
- Other 8 nav items show placeholder card
- Theme toggle at sidebar bottom with "浅色模式" text (hidden when collapsed)

### Must NOT Have (Guardrails)
- No overlay behavior — sidebar is push layout only
- No localStorage persistence for collapse state
- No actual login/register functionality — buttons are visual only
- No server-side code — pure frontend
- No external npm packages or CDN icon libraries — use inline SVGs

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed.

### Test Decision
- **Infrastructure exists**: NO
- **Automated tests**: None (agent-executed QA scenarios only)
- **Agent-Executed QA**: MANDATORY — every task includes detailed scenarios with Playwright

---

## Execution Strategy

### Sequential Execution (all tasks modify index.html)

```
Wave 1 (sequential — same file):
├── Task 1: Sidebar CSS refactor (push layout, collapsed=64px, remove mask/edge styles)
├── Task 2: Sidebar HTML + JS restructure (remove overlay elements, rewrite toggle, move theme)
├── Task 3: Page switching infra + 8 placeholder pages (switchPage function, nav binding)
└── Task 4: 发音学习 login prompt card (CSS + render function)

Wave FINAL:
├── F1: Plan compliance audit (oracle)
├── F2: Code quality review (unspecified-high)
├── F3: Full QA execution (unspecified-high + playwright)
└── F4: Scope fidelity check (deep)
```

---

## TODOs

- [x] 1. **Sidebar CSS Refactor — Push Layout + Collapsed State**

  **What to do**:
  - Change `.sidebar` from `position: fixed` to `position: relative` (push layout)
  - Remove `z-index: 200` from `.sidebar` (no longer an overlay)
  - Change `.sidebar.collapsed` width from `0` to `--sidebar-collapsed-width: 64px`
  - Define `--sidebar-collapsed-width: 64px` in `:root` as a CSS variable
  - Remove entire `.sidebar-mask` CSS block (lines 365-381)
  - Remove entire `.edge-trigger` CSS block (lines 383-395)
  - Remove `.sidebar:not(.collapsed) ~ .sidebar-mask` rule
  - Add `.sidebar:not(.collapsed)` to ensure default styles are for expanded
  - Keep all existing collapsed behaviors for nav-text, brand-name, nav-section-label, promo-card (they work — just need width to be 64px not 0)
  - Remove body `overflow: hidden` transition (no overlay lock needed)
  - Add `.sidebar-footer` CSS for theme toggle at bottom:
    - Positioned at bottom of sidebar, `margin-top: auto`
    - Flex row with sun icon + "浅色模式" text (text hidden when collapsed)
    - Collapsed: `opacity: 0; width: 0; overflow: hidden` for the text span
  - Verify `.main` and `.main-content` work correctly with push layout (flex already handles this since `.app` is `display: flex`)

  **Must NOT do**:
  - Don't change nav-item, brand, promo-card content or structure
  - Don't remove existing CSS variables from `:root`
  - Don't change the `.main` flex:1 behavior (already correct for push)
  - Don't modify any HTML or JS (that's Task 2)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Pure CSS layout restructuring for sidebar push-to-collapsed behavior
  - **Skills**: [`playwright` for verification]

  **References**:
  - `index.html:75-92` — Current `.sidebar` and `.sidebar.collapsed` CSS
  - `index.html:365-395` — Current `.sidebar-mask` and `.edge-trigger` CSS (to remove)
  - `index.html:17-34` — `:root` CSS variables (add `--sidebar-collapsed-width`)
  - `doc/开发描述文档.md:28-36` — Sidebar push layout spec
  - `doc/开发描述文档.md:73-77` — Theme toggle position spec (bottom)

  **Acceptance Criteria**:
  **QA Scenarios (MANDATORY):**
  ```
  Scenario: Sidebar renders in expanded state by default
    Tool: Playwright
    Preconditions: Fresh page load
    Steps:
      1. Navigate to index.html
      2. Assert .sidebar does NOT have 'collapsed' class
      3. Assert .sidebar width > 200px (expanded)
      4. Assert brand-name text is visible (opacity > 0)
      5. Assert no .sidebar-mask element exists in DOM
      6. Assert no .edge-trigger element exists in DOM
    Expected Result: Sidebar starts expanded with text visible, no overlay elements
    Evidence: .sisyphus/evidence/task-1-default-expanded.png

  Scenario: Sidebar collapses to ~64px with toggle
    Tool: Playwright
    Preconditions: Sidebar expanded
    Steps:
      1. Add 'collapsed' class to .sidebar via page.evaluate
      2. Assert .sidebar width < 100px (collapsed to ~64px)
      3. Assert brand-name text is hidden (opacity: 0)
      4. Assert nav-text elements are hidden
    Expected Result: Sidebar narrows, text hidden, icons visible
    Evidence: .sisyphus/evidence/task-1-collapsed.png
  ```

  **Commit**: YES
  - Message: `refactor(sidebar): convert to push layout, collapsed width 64px, remove overlay CSS`
  - Files: `index.html`

- [x] 2. **Sidebar HTML + JS Restructure — Remove Overlay, Rewrite Toggle, Move Theme**

  **What to do**:
  **HTML changes:**
  - Remove `<div class="edge-trigger" id="edgeTrigger">` entirely (was line 1105-1106)
  - Remove `<div class="sidebar-mask" id="sidebarMask">` entirely (was line 1301-1302)
  - Remove `class="collapsed"` from `<aside class="sidebar collapsed" id="sidebar">` → becomes `<aside class="sidebar" id="sidebar">`
  - Move theme toggle button from `.sidebar-header` to new `.sidebar-footer` at bottom of sidebar:
    - Create `<div class="sidebar-footer">` after `</nav>` and before promo card
    - Move the theme toggle `<button>` there
    - Add `<span class="theme-toggle-text">浅色模式</span>` after the sun icon SVG
    - The text span should be hidden when sidebar is collapsed
  - Update `aria-expanded` on toggle button to `"true"` (default expanded)
  - Update `aria-label` on toggle button: expanded → "折叠侧边栏"

  **JS changes — rewrite sidebar toggle:**
  - Remove `edgeTrigger` variable declaration
  - Remove `sidebarMask` variable declaration
  - Rewrite `setSidebarCollapsed(collapsed)`:
    - Only toggle the `collapsed` class on sidebar
    - Update `aria-expanded` on toggle button
    - No body scroll lock
  - Remove `edgeTrigger.addEventListener('click', ...)` block
  - Remove `sidebarMask.addEventListener('click', ...)` block
  - Remove `document.addEventListener('keydown', ...)` Escape handler block
  - Toggle button click handler stays (just calls `setSidebarCollapsed` toggling class)
  - Add theme toggle text visibility: when collapsed, `.theme-toggle-text` gets `display: none` (this can be CSS handled)

  **Must NOT do**:
  - Don't change nav items, promo card, or search/error card HTML
  - Don't change theme toggle click handler (already works)
  - Don't remove `setSidebarCollapsed()` function (rewrite, don't remove)
  - Don't touch any CSS (that's Task 1)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: HTML structure changes + JS interaction logic
  - **Skills**: [`playwright` for verification]

  **References**:
  - `index.html:1105-1106` — Edge trigger HTML (to remove)
  - `index.html:1301-1302` — Mask HTML (to remove)
  - `index.html:1111` — Sidebar element (remove `collapsed` class)
  - `index.html:1127-1139` — Theme toggle in header (to move)
  - `index.html:1282-1297` — Promo card (after this, add sidebar-footer)
  - `index.html:1395-1398` — Current sidebar JS declarations
  - `index.html:1400-1428` — Current toggle/mask/edge/Escape handlers
  - `doc/开发描述文档.md:73-77` — Theme toggle position

  **Acceptance Criteria**:
  **QA Scenarios (MANDATORY):**
  ```
  Scenario: Toggle button expands/collapses sidebar
    Tool: Playwright
    Preconditions: Page loaded, sidebar expanded
    Steps:
      1. Assert sidebar does NOT have 'collapsed' class
      2. Click .sidebar-toggle button
      3. Assert sidebar has 'collapsed' class
      4. Click .sidebar-toggle button again
      5. Assert sidebar does NOT have 'collapsed' class
    Expected Result: Toggle correctly switches between expanded and collapsed
    Evidence: .sisyphus/evidence/task-2-toggle-behavior.png

  Scenario: Theme toggle at bottom with text
    Tool: Playwright
    Preconditions: Page loaded
    Steps:
      1. Assert .sidebar-footer exists in DOM
      2. Assert #themeToggle is inside .sidebar-footer
      3. Assert "浅色模式" text is visible when sidebar expanded
      4. Collapse sidebar
      5. Assert "浅色模式" text is hidden
    Expected Result: Theme toggle at bottom, text shows/hides with collapse
    Evidence: .sisyphus/evidence/task-2-theme-bottom.png

  Scenario: No overlay elements
    Tool: Playwright
    Preconditions: Page loaded
    Steps:
      1. Assert #sidebarMask does NOT exist in DOM
      2. Assert #edgeTrigger does NOT exist in DOM
      3. Assert sidebar is not fixed position — main content is beside it, not behind
    Expected Result: No overlay elements, sidebar uses push layout
    Evidence: .sisyphus/evidence/task-2-no-overlay.png
  ```

  **Commit**: YES
  - Message: `refactor(sidebar): remove overlay HTML/JS, move theme toggle to bottom`
  - Files: `index.html`

- [x] 3. **Page Switching Infrastructure + 8 Placeholder Pages**

  **What to do**:
  **JS changes — page switching infrastructure:**
  - Store a reference to the page container: `const pageContent = document.querySelector('.main-content')`
  - Save the home page HTML template: `const homePageHTML = pageContent.innerHTML` (captures search card + error card)
  - Create `function switchPage(pageName) { ... }`:
    - Update nav `.active` class (remove from all, add to target)
    - Based on pageName:
      - `'home'` → restore `homePageHTML`
      - `'pronunciation'` → render pronunciation page (delegated to Task 4)
      - Others → render placeholder page
  - Rewrite nav item click handler:
    - Current: just toggles `.active` class
    - New: `item.addEventListener('click', (e) => { e.preventDefault(); switchPage(item.dataset.page); })`

  **Placeholder page design** (for all 8 non-home, non-pronunciation pages):
  - Centered card with:
    - Same nav icon as sidebar (reuse SVG from nav item)
    - Page title (e.g., "单词练习")
    - Subtitle: "该功能即将上线" in gray text
  - Create `function renderPlaceholderPage(pageName, iconSvg, title) { ... }`
    - Accepts page identifier, copies the nav icon SVG, and renders placeholder card
  - For each of the 8 pages, determine correct icon SVG to display:
    - 单词练习 → keyboard icon
    - 句子练习 → graduation cap icon
    - 资源中心 → folder icon
    - 复习中心 → document icon + badge
    - 知识文章 → A+check icon
    - 学习统计 → bar chart icon
    - 个人中心 → person icon
    - 共建计划 → two people icon
  - Include a `.placeholder-icon` CSS class for the enlarged icon in the card

  **CSS additions:**
  - `.placeholder-page`: centering container, `display: flex; align-items: center; justify-content: center; min-height: 60vh`
  - `.placeholder-card`: white card, text-align center, padding, rounded corners, subtle border/shadow
  - `.placeholder-icon svg`: larger size (~48px), color: var(--color-text-tertiary)
  - `.placeholder-title`: large bold text
  - `.placeholder-subtitle`: gray text

  **Must NOT do**:
  - Don't modify existing search card or error card HTML
  - Don't remove the existing nav items
  - Don't break the sidebar toggle behavior

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Core behavioral change — page routing infrastructure + 8 page renderers
  - **Skills**: [`playwright` for verification]

  **References**:
  - `index.html:1310-1385` — Current main-content HTML (home page template)
  - `index.html:1430-1437` — Current nav click handler (needs rewrite)
  - `index.html:1154-1280` — All nav items with SVGs
  - `doc/开发描述文档.md:43-54` — Nav menu spec

  **Acceptance Criteria**:
  **QA Scenarios (MANDATORY):**
  ```
  Scenario: Click home / pronunciation / other nav items
    Tool: Playwright
    Preconditions: Page loaded
    Steps:
      1. Click "发音学习" nav item
      2. Assert page content changes (no longer shows search card)
      3. Assert "发音学习" nav item has .active class
      4. Click "首页" nav item
      5. Assert search card is visible again
      6. Assert "首页" nav item has .active class
      7. Click "单词练习" nav item
      8. Assert placeholder card visible with title "单词练习"
    Expected Result: Each nav item switches page content correctly
    Evidence: .sisyphus/evidence/task-3-page-switching.png

  Scenario: All 8 placeholder pages render
    Tool: Playwright
    Preconditions: Page loaded
    Steps:
      1. Click each of the 8 non-home, non-pronunciation nav items
      2. For each: assert placeholder card shows correct title
      3. Assert "该功能即将上线" subtitle is visible
    Expected Result: All 8 placeholder pages render correctly
    Evidence: .sisyphus/evidence/task-3-placeholders.png
  ```

  **Commit**: YES
  - Message: `feat(nav): add page switching for all 10 nav items + 8 placeholder pages`
  - Files: `index.html`

- [x] 4. **发音学习 Login Prompt Card**

  **What to do**:
  **Register in switchPage():**
  - Add `case 'pronunciation': renderPronunciationPage(); break;` to `switchPage()`

  **Create `renderPronunciationPage()` function:**
  - Render centered card with:
    - Outer container: `.pronunciation-page` (flex centering)
    - Card: `.pronunciation-card`
    - Icon area: circular light gray background (~68px diameter), with double-note music SVG icon (black, linear style)
    - Title: "发音学习" (large bold, centered)
    - Description text (two lines): "登录后即可使用新概念英语在线点读和音标学习功能，支持双语对照、逐句播放、跟读练习和视频讲解"
    - Two buttons side by side:
      - "登录" button: black background, white text, rounded (primary style)
      - "注册" button: white background, black border, black text (secondary style)
    - Buttons do nothing (placeholder for actual login/register)

  **Music note SVG icon**: Design a simple double-note linear icon:
  ```svg
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M9 18V5l12-2v13"/>
    <circle cx="6" cy="18" r="3"/>
    <circle cx="15" cy="16" r="3"/>
    <path d="M9 5l12-2"/>
  </svg>
  ```

  **CSS additions:**
  - `.pronunciation-page`: `display: flex; align-items: center; justify-content: center; min-height: 70vh`
  - `.pronunciation-card`: white bg, border-radius, box-shadow (more prominent than search card), padding, max-width: 460px, text-align: center
  - `.pronunciation-icon-wrap`: circular bg, 68px diameter, flex center
  - `.pronunciation-icon svg`: 32px, black
  - `.pronunciation-title`: large bold, margin
  - `.pronunciation-desc`: gray text, max-width, line-height
  - `.pronunciation-actions`: flex row, gap, justify center, margin-top
  - `.pronunciation-btn`: shared button styles (padding, border-radius, font)
  - `.pronunciation-btn.primary`: black bg, white text
  - `.pronunciation-btn.secondary`: white bg, black border, black text

  **Must NOT do**:
  - Don't add actual login/register logic — buttons are visual only
  - Don't modify the sidebar HTML
  - Don't break existing search/error card functionality
  - Don't add external dependencies

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: UI component with detailed visual specification
  - **Skills**: [`playwright` for verification]

  **References**:
  - `doc/开发描述文档.md:412-466` — Full pronunciation page spec (Section 十)
  - `doc/开发描述文档.md:433-462` — Card content structure (icon, title, desc, buttons)

  **Acceptance Criteria**:
  **QA Scenarios (MANDATORY):**
  ```
  Scenario: Pronunciation page renders correctly
    Tool: Playwright
    Preconditions: Page loaded
    Steps:
      1. Click "发音学习" nav item
      2. Assert .pronunciation-card is visible
      3. Assert "发音学习" title is present
      4. Assert description text contains "新概念英语"
      5. Assert "登录" button exists with black background
      6. Assert "注册" button exists with border
      7. Assert music note SVG icon is present inside circular background
    Expected Result: Login prompt card renders with all elements
    Evidence: .sisyphus/evidence/task-4-pronunciation-card.png

  Scenario: Return to home restores search card
    Tool: Playwright
    Preconditions: Pronunciation page showing
    Steps:
      1. Click "首页" nav item
      2. Assert search card is visible again
      3. Assert search input exists
    Expected Result: Home page restores correctly
    Evidence: .sisyphus/evidence/task-4-return-home.png
  ```

  **Commit**: YES
  - Message: `feat(page): add 发音学习 login prompt card with music icon and buttons`
  - Files: `index.html`

---

## Final Verification Wave

> 4 review agents run in PARALLEL. ALL must APPROVE. Present results to user.

- [x] F1. **Plan Compliance Audit** — `oracle`
  Read the plan end-to-end. For each "Must Have": verify implementation exists. For each "Must NOT Have": search for forbidden patterns.
  Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [x] F2. **Code Quality Review** — `unspecified-high`
  Run lint checks. Review for: commented-out code, console.log, AI slop, unused variables.
  Output: `Lint [PASS/FAIL] | Files [N clean/N issues] | VERDICT`

- [x] F3. **Full QA Execution** — `unspecified-high` (+ `playwright`)
  Execute EVERY QA scenario from all 4 tasks. Test cross-task integration. Save to `.sisyphus/evidence/final-qa/`.
  Output: `Scenarios [N/N pass] | Integration [N/N] | VERDICT`

- [x] F4. **Scope Fidelity Check** — `deep`
  Read each task's spec vs actual diff. Verify 1:1 match. Check "Must NOT do" compliance.
  Output: `Tasks [N/N compliant] | Contamination [CLEAN/N issues] | VERDICT`

---

## Commit Strategy

- **Task 1**: `refactor(sidebar): convert to push layout, collapsed width 64px, remove overlay CSS`
- **Task 2**: `refactor(sidebar): remove overlay HTML/JS, move theme toggle to bottom`
- **Task 3**: `feat(nav): add page switching for all 10 nav items + 8 placeholder pages`
- **Task 4**: `feat(page): add 发音学习 login prompt card with music icon and buttons`

---

## Success Criteria

### Final Checklist
- [x] Sidebar defaults expanded (~240px), push layout, no mask/edge-trigger
- [x] Click toggle → sidebar narrows to ~64px (icons only, text hidden)
- [x] Theme toggle at sidebar bottom, "浅色模式" text visible when expanded
- [x] Click 首页 → search card + error card
- [x] Click 发音学习 → login prompt card with music icon + buttons
- [x] Click any other nav → placeholder card with icon + "即将上线"
- [x] No overlay elements exist in DOM
- [x] All nav items switch pages correctly
