# sidebar-pronunciation - Learnings

## 2026-06-24 - Session Complete (Final)

### Current state of index.html (1801 lines)
- CSS: `--sidebar-collapsed-width: 0`, sidebar is `position: fixed; z-index: 200`
- `.sidebar-mask` at lines 365-381 (CSS)
- `.edge-trigger` at lines 383-395 (CSS)
- HTML: edge-trigger at line 1105-1106, sidebar at 1111 with `class="sidebar collapsed"`, mask at 1301-1302
- Theme toggle inside `.sidebar-header` at line 1127-1139
- Toggle button at line 1140-1144 with `aria-expanded="false"`
- Nav items: 10 total with `data-page` attributes
- JS sidebar handlers at lines 1400-1428
- Nav click handler at lines 1430-1437 (just toggles active class)
- Main content: search card (1310-1346) + error card (1348-1384)
- Theme toggle at line 1450-1462 (rotation animation)

### Task 1 — Sidebar CSS Refactor (completed 2026-06-24)
- Changed `--sidebar-collapsed-width: 0` → `--sidebar-collapsed-width: 64px` in `:root`
- Converted `.sidebar` from `position: fixed; top: 0; left: 0; z-index: 200` → `position: relative`
- Removed entire Overlay CSS section (`.sidebar-mask`, `.edge-trigger`, `.sidebar:not(.collapsed) ~ .sidebar-mask`)
- Added new `.sidebar-footer` CSS block after `.sidebar-promo-btn:hover` with:
  - `.sidebar-footer`: flex row with border-top, padding, gap
  - `.sidebar.collapsed .sidebar-footer`: centered padding for collapsed state
  - `.theme-toggle-text`: 13px secondary text with collapse transition (opacity + width → 0)
  - `.sidebar.collapsed .theme-toggle-text`: hidden via opacity/width/overflow
- File went from 1801 → 1795 lines (removed ~31 lines overlay CSS, added ~28 lines footer CSS)
- No HTML or JS changes — Task 1 is CSS-only

### Key patterns
- All `innerHTML` for rendering
- `document.addEventListener('DOMContentLoaded', () => { ... })` wrapper
- CSS variables for theming via `:root` / `[data-theme="dark"]`
- Inline SVGs with `aria-hidden="true"`

### Summary of Changes (Final)
- **Sidebar layout**: Converted from overlay (`position: fixed`, `z-index: 200`) to push layout (`position: relative`)
- **Collapsed width**: Changed from 0 to 64px (icons only)
- **Overlay removed**: Deleted `.sidebar-mask` and `.edge-trigger` CSS, HTML, and JS handlers entirely
- **Theme toggle**: Moved from sidebar-header to new `.sidebar-footer` at bottom with "浅色模式" text
- **Sidebar default**: Now expanded by default (no more `collapsed` class on load)
- **Toggle behavior**: Rewritten — now toggles class (not just collapses), no body scroll lock
- **Page switching**: New `switchPage()` router function for all 10 nav items
- **Home page**: Restores search card + error card via stored `homePageHTML`
- **Placeholder pages**: 8 pages with nav icon + title + "该功能即将上线"
- **Pronunciation page**: Login prompt card with music note icon, "发音学习" title, description, login/register buttons
- **Search regression**: Events re-bound on home page return via switchPage

### QA results from Final Wave
- F1 Oracle: APPROVE (8/8 Must Have, 5/5 Must NOT Have)
- F2 Code Quality: APPROVE (Lint PASS)
- F3 Full QA: APPROVE (52/52 scenarios pass, 9 screenshots)
- F4 Scope Fidelity: APPROVE (4/4 Tasks compliant, contamination CLEAN)
