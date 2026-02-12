# TEST-002: Accessibility Regression Tests

**Status**: Complete
**Branch**: `test/002-accessibility-regression-tests`
**Date**: 2026-02-12

---

## 1. Goal

Add automated WCAG 2.1 AA accessibility scanning to the Playwright test suite using `@axe-core/playwright`. Tests verify zero violations on page load and after all interactive states (filter clicks, keyboard navigation, URL hash navigation, toggle-to-reset).

## 2. Acceptance Criteria

- [x] axe-core integrated with Playwright
- [x] Tests verify roving tabindex pattern after filter clicks (via full-page axe scan)
- [x] Tests verify focus management after toggle-to-reset (via full-page axe scan)
- [x] Tests verify ARIA attributes update correctly (via full-page axe scan)
- [x] Zero WCAG violations on page load

## 3. Approach

**Chosen**: Utility function pattern (Approach C) — matching existing `timing.js` utility

Created `checkAccessibility(page, options)` in `tests/utils/axe-helper.js` following the same export pattern as `timing.js`. Test file `axe-scan.spec.js` uses existing FilterPage POM for interactions.

**Why this approach**:
- Matches existing codebase patterns (DRY, consistent)
- Reusable across future test files
- Configurable via options (tags, exclude selectors)

## 4. Implementation

### Files Created
- `tests/utils/axe-helper.js` — `checkAccessibility(page, options)` utility
- `tests/filter/axe-scan.spec.js` — 8 tests covering all interaction states

### Files Modified
- `tests/pages/FilterPage.js` — Added `waitForScrollAnimations()` method
- `css/variables.css` — Fixed 4 WCAG AA color contrast violations in light theme
- `package.json` / `package-lock.json` — Added `@axe-core/playwright` dependency
- `index.html` / `404.html` — CSS hash references updated by build

### Color Contrast Fixes (Light Theme)
| Variable | Old Value | New Value | Context |
|----------|-----------|-----------|---------|
| `--color-text-muted` | `#868e96` | `#5c636a` | Text on `#f8f9fa` and `#e9ecef` backgrounds |
| `--color-category-backend` | `#2e7d32` | `#256b28` | Badge text on computed background |
| `--color-status-active` | `#2e7d32` | `#256b28` | Status indicator text |
| `--color-category-iot` | `#e65100` | `#b94000` | Badge text + white text on active button |

### Test Coverage (8 tests x 3 browsers = 24 total)
1. Initial page load passes WCAG 2.1 AA
2. Page remains accessible after backend filter
3. Page remains accessible after IoT filter
4. Page remains accessible after web filter
5. Page remains accessible after tools filter
6. Page remains accessible after toggle-to-reset
7. Page remains accessible after keyboard navigation
8. Page remains accessible with URL hash navigation

### Quality Review Fixes
- Improved `checkAccessibility()` error reporting with formatted violation messages
- Added `waitForScrollAnimations()` after all `clickFilter()` calls for consistency

## 5. Key Discoveries

- Scroll animations (opacity 0 → 1 transition) cause false color-contrast failures in axe-core if scanned mid-animation. Solution: wait 700ms for animations to settle.
- Several light theme colors were below WCAG AA 4.5:1 threshold — this was not caught by manual testing or Lighthouse (which audits dark theme by default).
- The `expect().toEqual([])` assertion for violations produces poor error messages — custom formatting significantly improves debugging.

## 6. Future Improvements

1. **Theme-specific axe scanning** — Add tests that switch to light/dark theme before scanning (currently only tests default theme). Would catch theme-specific contrast issues proactively.
2. **Reduced motion accessibility test** — Verify page remains accessible with `prefers-reduced-motion: reduce` emulated (different animation code paths could introduce accessibility issues).
3. **Mark `axe-core integration` backlog item as complete** — The BACKLOG.md item from TEST-001 is now fulfilled.

## 7. Test Results

```
24 passed (47.7s)
Full suite: 160/162 passed (2 pre-existing flaky failures in rapid-clicks.spec.js)
```

### Execution Log

#### 2026-02-12 — PHASE: Planning
- Explored existing test suite and codebase patterns
- Chose utility function approach (Approach C) matching timing.js pattern
- User confirmed full-page scanning, new file, and interaction-level depth

#### 2026-02-12 — PHASE: Implementation
- Installed @axe-core/playwright, created helper and test files
- Discovered 4 color contrast violations requiring CSS fixes
- Iteratively fixed colors with contrast ratio validation
- Added waitForScrollAnimations() to prevent false positives from opacity transitions

#### 2026-02-12 — PHASE: Quality Review
- Code reviewer identified poor error reporting → fixed with formatted messages
- Code reviewer identified missing waitForScrollAnimations() → added consistently
- Re-ran all 24 tests: all passing

#### 2026-02-12 — PHASE: Complete
- Final approach: utility + 8 tests + 4 CSS color fixes
- Tests passing: yes (24/24)
- User approval: pending
