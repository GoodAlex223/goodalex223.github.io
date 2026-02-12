# POLISH-001: Focus Indicator Transition Animation

**Status**: Complete
**Date**: 2026-02-12
**Branch**: `polish/001-focus-indicator-transition`
**Origin**: BACKLOG.md from A11Y-002: Improve Focus Indicators

---

## 1. Problem Statement

Focus outlines on interactive elements (links, buttons) appear/disappear instantly. Adding a subtle fade-in/out transition makes the focus indicator feel more polished without sacrificing accessibility.

**Acceptance Criteria**:
- [x] Focus outline fades in smoothly on all interactive elements
- [x] Animation disabled when `prefers-reduced-motion: reduce`
- [x] Works on all interactive elements (links, buttons)
- [x] No regression on existing focus visibility

---

## 2. Approach

**Chosen: Centralized in reset.css (Approach A)**

Set permanent transparent outlines on all `a` and `button` elements in `reset.css`, then transition `outline-color` from transparent to visible on `:focus-visible`. Components with their own `transition` declarations add `outline-color var(--transition-fast)` to their transition list.

**Technique**: CSS `outline` can't transition from "none" to a value — the trick is to always have the outline present but transparent, then transition only `outline-color`.

**Timing**: `--transition-fast` (150ms) matches existing hover transitions.

**Skip link excluded**: Skip link is accessibility-critical and must appear instantly (uses `:focus` not `:focus-visible`).

**Also fixed**: `.btn` and `.project-card__link` `transition: all` replaced with explicit property lists (prevents unintended side effects).

---

## 3. Files Modified

| File | Changes |
|------|---------|
| `css/reset.css` | Added permanent transparent outline + `outline-color` transition to `a` and `button`; simplified `:focus-visible` to just `outline-color` |
| `css/components.css` | Added `outline-color` to transitions for `.btn`, `.project-card__link`, `.theme-toggle`, `.filter-btn`; simplified 4 component `:focus-visible` rules; fixed `transition: all` on `.btn` and `.project-card__link` |
| `css/main.css` | Added `outline-color var(--transition-fast)` to theme transition group; removed `.btn` from group (cascade conflict) |
| `CLAUDE.md` | Added focus transition documentation to Focus Accessibility section |
| `index.html`, `404.html` | Updated cache-busting CSS hash (build artifact) |

---

## 4. Key Decisions

1. **Centralized approach** — Base focus transition in `reset.css` covers all `a`/`button` globally, reducing duplication
2. **150ms timing** — Matches `--transition-fast` used for hover transitions across the site
3. **Skip link excluded** — Accessibility-critical element must appear instantly
4. **`transition: all` cleanup** — Replaced on `.btn` and `.project-card__link` with explicit property lists to prevent unintended side effects
5. **`.btn` removed from main.css theme group** — Component-level transition now has all needed properties; theme group was overriding and losing `transform` for hover

---

## 5. Future Improvements

1. **Focus-within for project cards** — Add `:focus-within` highlighting on `.project-card` when internal links receive focus (already in BACKLOG.md from A11Y-002)
2. **Audit remaining `transition: all` usage** — Search codebase for other `transition: all` declarations that could cause similar unintended side effects
3. **CSS custom property for focus transition timing** — Could add `--focus-transition-duration` to `variables.css` for independent control of focus animation speed (currently reuses `--transition-fast`)

---

## 6. Test Results

- **162/162 Playwright tests passing** across Chromium, Firefox, WebKit
- **Build**: `npm run build` succeeds (PostCSS bundle + cssnano minification + cache-busting hash)
- **Prefers-reduced-motion**: Global rule in `main.css` sets `transition-duration: 0.01ms !important` which automatically kills focus transitions

---

### Execution Log

#### 2026-02-12 — PHASE: Discovery
- Read TODO.md for POLISH-001 acceptance criteria
- Identified task as CSS-only change with no JS modifications needed

#### 2026-02-12 — PHASE: Codebase Exploration
- Launched 2 code-explorer agents: focus CSS analysis + animation/transition patterns
- Found all focus styles centralized via CSS variables in variables.css
- Found base focus in reset.css with no transition, `.btn` uses `transition: all` (technical debt)
- Found global `prefers-reduced-motion` already kills all transitions

#### 2026-02-12 — PHASE: Clarifying Questions
- Skip link transition? Decision: No (accessibility-critical)
- Fix `.btn` transition:all? User chose: "Fix it (Recommended)"
- Timing? Decision: `--transition-fast` (150ms)

#### 2026-02-12 — PHASE: Architecture Design
- Presented 3 approaches: centralized (reset.css), per-component, CSS variable
- User approved Approach A (centralized in reset.css)

#### 2026-02-12 — PHASE: Implementation
- Edited reset.css, components.css, main.css
- Built successfully, all 162 tests pass

#### 2026-02-12 — PHASE: Quality Review
- Code reviewer found 5 issues; 2 false positives, 1 valid (`.btn` cascade conflict), 2 pre-existing
- Fixed `.btn` cascade conflict by removing from main.css theme transitions group
- Rebuilt and retested — all tests pass

#### 2026-02-12 — PHASE: Complete
- All tests passing across 3 browsers
- CLAUDE.md updated with focus transition documentation
- Plan document created
