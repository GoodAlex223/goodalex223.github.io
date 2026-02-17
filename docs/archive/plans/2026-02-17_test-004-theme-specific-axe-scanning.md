# TEST-004: Theme-specific Axe Scanning

**Status**: Complete
**Created**: 2026-02-17
**Branch**: `test/004-theme-specific-axe-scanning`
**Source**: BACKLOG.md (from TEST-002)

---

## 1. Problem Statement

The existing axe-scan test suite (8 tests) only runs accessibility scans in the browser's default theme. Playwright defaults `colorScheme` to `'light'`, meaning the existing tests never exercised the dark theme at all. During TEST-002, 4 light-theme color contrast violations were discovered and fixed — but dark theme was never explicitly tested, leaving potential violations undetected.

## 2. Approach

**Architecture**: Nested `test.describe` blocks within the existing `axe-scan.spec.js`, with theme-specific `beforeEach` hooks that call `fp.setTheme()`.

**Decisions**:
- `setTheme(theme)` added to FilterPage POM (follows `enableReducedMotion()` pattern)
- Theme switching via `page.evaluate()` to set `data-theme` attribute directly
- 2 states per theme: initial page load + active IoT filter (essential coverage)
- 400ms wait for CSS transitions to settle (250ms base + 150ms buffer)
- IoT filter chosen for active state test (3 cards, most colored elements, was one of the original 4 violations)

**Alternatives considered**:
1. Inline helper function in spec file — simpler but not reusable
2. Parameterized `for...of` loop — DRY but sibling describes duplicate setup
3. Nested describes with POM method (chosen) — clean hierarchy, inherits outer beforeEach

## 3. Implementation

### Files Modified

| File | Change |
|------|--------|
| `tests/filter/axe-scan.spec.js` | +37 lines: nested Light/Dark theme describe blocks with 4 new tests |
| `tests/pages/FilterPage.js` | +13 lines: `setTheme(theme)` method in Media & Theme helpers section |
| `css/variables.css` | 1 line: dark theme `--color-text-muted` `#6b6b6b` → `#8a8a8a` |
| `index.html` | Updated by build (inline CSS + hash) |
| `404.html` | Updated by build (inline CSS + hash) |
| `CLAUDE.md` | Updated with dark theme fix, setTheme docs, test coverage notes |

### Bug Found and Fixed

Dark theme `--color-text-muted: #6b6b6b` had only 3.54:1 contrast against `--color-bg-primary: #0f0f23` (WCAG AA requires 4.5:1). Fixed to `#8a8a8a` (~5.9:1 contrast). Affected elements: footer copyright text.

## 4. Key Discoveries

1. **Playwright defaults to light colorScheme** — the existing 8 tests were running in light theme all along, not dark as previously assumed
2. **Dark theme had an undetected contrast violation** — `--color-text-muted: #6b6b6b` on `#0f0f23` (3.54:1) failed WCAG AA
3. **Theme-specific tests are essential** — without them, an entire theme's color palette goes untested
4. **Nested describes inherit outer beforeEach** — clean pattern for adding scoped test setup

## 5. Future Improvements

1. **Read `--transition-base` from CSS** instead of hardcoding 400ms in `setTheme()` — follows the `timing.js` pattern of reading CSS custom properties as single source of truth (currently works fine but coupling to a magic number)
2. **Extend theme testing to other test suites** — `animation-states.spec.js` could verify filter animations render correctly in both themes (different background colors could affect perceived animation quality)
3. **Add `prefers-color-scheme` path testing** — current tests only exercise the `data-theme` CSS path; the `@media (prefers-color-scheme: light) :root:not([data-theme="dark"])` fallback path is untested

### Execution Log

#### 2026-02-17 — PHASE: Planning
- Explored codebase: theme system, axe-scan tests, FilterPage POM, axe-helper
- Identified 3 architecture approaches, recommended nested describes with POM method
- User confirmed: essential states only, page.evaluate for switching, Approach B

#### 2026-02-17 — PHASE: Implementation
- Added `setTheme()` to FilterPage POM
- Added nested Light/Dark theme describes to axe-scan.spec.js
- First test run: dark theme tests FAILED (real violation found!)
- Fixed `--color-text-muted` from `#6b6b6b` to `#8a8a8a`
- Rebuilt CSS, all 36 axe-scan tests pass
- Full suite: 174 tests pass, zero regressions

#### 2026-02-17 — PHASE: Quality Review
- Code review identified 2 issues >= 80 confidence
- aria-label stale after setTheme: skipped (axe doesn't validate semantic label accuracy)
- 300ms timeout thin for CI: fixed to 400ms
- All tests confirmed passing after fix

#### 2026-02-17 — PHASE: Complete
- Final approach: Nested describes with POM setTheme(), 400ms transition wait
- Tests passing: yes (174/174)
- User approval: received
