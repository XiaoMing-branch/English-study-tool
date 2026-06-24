# Keykey — Agent Guide

## Overview

[Keykey](file:///D:/Users/18065/Desktop/ming/English-study-tool/README.md) is a pure frontend English vocabulary learning tool for embedded engineers. Single-file SPA — no build step, no dependencies, no server.

- **File**: `index.html` (~1800 lines, everything in one file)
- **Data**: All in `localStorage` (keys prefixed `keykey_`)
- **Dictionary**: OED CDN (`https://cdn.jsdelivr.net/gh/plumsun/open-english-dictionary@master/dictionary/{word}.json`) — requires internet
- **Pronunciation**: Web Speech API (`SpeechSynthesisUtterance`)
- **Theming**: CSS custom properties, toggled via `[data-theme="dark"]` on `<html>`, preference in `localStorage`

## How to run

Any of these works:
```
# Just open the file
start index.html

# Or serve locally
python -m http.server 8080
# http://localhost:8080
```

No `npm install`, no build, no watchers.

## Architecture

### File layout

```
index.html          ← the entire app (HTML + CSS + JS)
README.md           ← user-facing docs
user_data/          ← export target directory (empty, convention only)
doc/                ← reference docs
```

### Code organization (in index.html)

| Lines | Section |
|-------|---------|
| `1-6` | HTML head, `<title>Keykey` |
| `7-1100` | CSS (~1094 lines): Reset, Layout, Sidebar, Nav, Search, Error card, Toast, media queries |
| `1102-1391` | HTML: Sidebar (brand + 10 nav items + promo card) + Main content (search card + error card + toast) |
| `1393-1800` | JS (all inside `DOMContentLoaded`): Sidebar JS, theme toggle, OED fetch, search, export/import/repair |

### What works vs what's placeholder

The sidebar has 10 nav items with `data-page` attributes, but clicking them only toggles `.active` class — **no actual page switching is implemented**. The app currently has:

- **Working**: Sidebar (overlay collapse/expand), OED dictionary search, data export/import/repair, theme toggle
- **Placeholder (link only)**: 单词练习, 句子练习, 资源中心, 复习中心, 发音学习, 知识文章, 学习统计, 个人中心, 共建计划

### Key CSS patterns

- Design tokens via `:root` / `[data-theme="dark"]` CSS variables
- Sidebar: fixed overlay, `width: var(--sidebar-width)` / `collapsed` class sets `width: 0`
- Nav items: flex row with 16px icon + label, `border-radius: var(--radius-nav)`
- Cards: `background: var(--color-card)`, `border-radius: var(--radius-card)`, `box-shadow: var(--shadow-card)`
- Smooth transitions: `transition: background var(--transition), ...`

### Key JS patterns

- Everything inside `document.addEventListener('DOMContentLoaded', () => { ... })`
- `innerHTML` assignment for rendering (search result, error messages)
- `fetchWordData()` with 8s AbortController timeout + in-memory `Map` cache
- `renderOEDResult()` generates two-column HTML via template literals
- `exportUserData()` / `importUserData()` for `user_data/` backup convention
- `showToast()` for transient notifications (auto-hides after 3s)
- Nav items: `forEach` with `e.preventDefault()` + `.active` class toggle
- Guardian `if (btn)` checks around DOM element access (dynamic content)

### localStorage schema

All keys start with `keykey_`:
- `keykey_theme` — `"light"` | `"dark"`
- Other `keykey_*` keys managed by the app's learning features

### OED CDN data shape

```json
{
  "word": "hello",
  "pronunciation": "huh·loh",
  "definitions": [
    {
      "pos": "interjection",
      "explanation_en": "used as a greeting",
      "explanation_cn": "问候语",
      "example_en": "Hello, how are you?",
      "example_cn": "你好，你怎么样？"
    }
  ],
  "comparison": [
    { "word_to_compare": "hi", "analysis": "more casual than hello" }
  ],
  "forms": { "plural": "hellos" }
}
```

## Engineering conventions

| Aspect | Convention |
|--------|-----------|
| Indentation | 2 spaces |
| CSS naming | kebab-case classes (`.search-card`, `.word-text`), `--var-name` tokens |
| JS naming | `camelCase` functions and variables |
| JS strings | Template literals (backticks) for HTML |
| Icons | Inline SVGs with `aria-hidden="true"` |
| ID prefix | `sidebar`, `search`, `*Btn`, `*Input` descriptive prefixes |

## What to NOT do

- No external npm packages — use inline SVGs and vanilla JS only
- No server-side code — pure frontend
- No `dict.js` — everything goes through OED CDN
- No force-push rewrite — branch `scheme-two` has upstream tracking

## Known quirks

- The `doc/开发描述文档.md` is the source-of-truth design spec for the homepage
- `.sisyphus/` contains execution artifacts (plans, notepads) — not app code
- No .gitignore — temporary test artifacts (`.playwright-mcp/`, `.sisyphus/evidence/`, `.sisyphus/run-continuation/`) should be kept out of commits
