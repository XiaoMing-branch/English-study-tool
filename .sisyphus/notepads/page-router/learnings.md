# Page Router Implementation - Learnings

## Summary
Implemented full page switching infrastructure for all 10 nav items in index.html.

## Changes Made

### CSS (inserted before `.main` block)
- `.placeholder-page` + `.placeholder-card` — centered card layout for "即将上线" pages
- `.pronunciation-page` + `.pronunciation-card` — login prompt card with music icon
- `.pronunciation-icon-wrap` — circular background for music icon (light/dark variants)
- `.pronunciation-btn` — primary/secondary button styles

### JS (Page Router)
- `pageContent` / `homePageHTML` — stores original home page HTML for restore
- `switchPage(pageName)` — manages nav active state + page rendering + search re-binding
- `renderPronunciationPage()` — renders centered login prompt card
- `renderPlaceholderPage(pageName)` — renders 8 placeholder cards with nav-specific icon
- `getNavIcon(pageName)` — extracts SVG HTML from nav item's `.nav-icon`
- Nav click handler — delegates to `switchPage()` via `data-page` attribute

### Key Technical Details
1. **searchResult must be `let`** — Since `switchPage` replaces `.main-content` innerHTML, the old `searchResult` DOM reference becomes stale. Changed `const` to `let` and reassign it when returning to home.
2. **Search event re-binding** — Home page search input/submit/header-btn elements are recreated on each home page restore. Event listeners must be re-attached in `switchPage('home')`.
3. **Nav active state** — Explicitly remove `.active` from all nav items, then add to target, in `switchPage()` ensures consistency.
4. **CSS placement** — Placeholder/pronunciation CSS must be before `.main` block to avoid specificity issues. Inserted right after sidebar-footer CSS.
