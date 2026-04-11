# Firefox & Test Audit — Design Spec

**Date**: 2026-04-10
**Branch**: `chore/firefox-test-audit`
**Status**: Design approved

---

## Problem

Two Firefox-specific flaky test failures exist in the filter test suite:

1. **`tests/filter/accessibility.spec.js:28`** — "aria-pressed updates when filter changes" intermittently fails on Firefox. After clicking a filter, the ARIA attribute assertion fires before Firefox has settled the DOM state.

2. **`tests/filter/rapid-clicks.spec.js`** — Multiple tests pass inconsistently on Firefox due to animation timing sensitivity. The `setTimeout`-based animation choreography in `filterProjects()` (exit → settle → entrance) has timing variance across browser engines.

Additionally, a backlog item requests auditing test files for hardcoded project counts.

## Root Cause

The current `waitForFilterAnimation()` in `tests/utils/timing.js` calculates a fixed timeout:

```
totalTime = duration * 2 + stagger * maxCards + buffer  // ~1210ms
```

This is a best-guess timer. Firefox's event loop and CSS transition timing differ from Chromium/WebKit — the fixed wait sometimes expires before Firefox finishes its animation cycle, causing assertions to hit mid-transition state.

## Solution: DOM State Polling

Replace fixed-timeout waits with Playwright web-first assertions that poll for actual DOM state — specifically, wait until all animation CSS classes are removed.

### New Function: `waitForAnimationComplete()`

**File**: `tests/utils/timing.js`

```js
import { expect } from "@playwright/test";

export async function waitForAnimationComplete(page, { timeout = 5000 } = {}) {
  await expect(page.locator('.project-card--filtering-out')).toHaveCount(0, { timeout });
  await expect(page.locator('.project-card--filtering-in')).toHaveCount(0, { timeout });
  await expect(page.locator('.project-card.is-filtering')).toHaveCount(0, { timeout });
}
```

- Requires `expect` import from `@playwright/test` (added to `timing.js`)
- Uses Playwright's auto-retrying `toHaveCount()` — polls DOM until condition is met or timeout
- Exits as soon as animations complete (faster on fast machines)
- 5s ceiling prevents infinite hangs on bugs
- Browser-agnostic: works identically on Chromium, Firefox, WebKit

### Migration

**`tests/utils/timing.js`**:
- Add `waitForAnimationComplete()` (new export)
- Remove `waitForFilterAnimation()` (all callers migrated)
- Keep `getAnimationDuration()` and `getStaggerDelay()` (standalone utilities)

**`tests/pages/FilterPage.js`**:
- `clickFilter()` — replace `waitForFilterAnimation()` with `waitForAnimationComplete()`
- `rapidClickFilters()` — same replacement
- `gotoWithHash()` — same replacement
- Update import statement

**`tests/filter/rapid-clicks.spec.js`**:
- Replace 3 direct `waitForFilterAnimation(fp.page)` calls with `waitForAnimationComplete(fp.page)`
- Update import statement

### Files NOT Changed

- `tests/filter/accessibility.spec.js` — calls `fp.clickFilter()` which goes through the POM; fix flows through automatically
- `js/main.js` — no application code changes
- All other test files that use `fp.clickFilter()` — benefit automatically

## Hardcoded Project Counts Audit

### Findings

- **Filter tests**: All clean. Every count assertion uses `CATEGORY_COUNTS` from `FilterPage.js`.
- **Modal tests** (`basic-modal.spec.js`): 39 per-project content assertions (descriptions, highlights, techPills, screenshots, links). These are intentionally specific — they verify exact project data from `projects.json`, not global project counts. They don't break when adding a new project, only when editing existing project content. Already documented in CLAUDE.md.
- **SEO tests**: OG image dimensions (`1200x630`) — configuration values, not project counts.

### Decision

No code changes for the audit. The original issue (using `7` instead of `CATEGORY_COUNTS.all`) was already fixed. Remaining literals are intentionally specific content assertions. Close the backlog item as resolved.

## Backlog Items Resolved

1. "Fix pre-existing flaky Firefox filter accessibility test" (from Code Quality & Lint Fixes, 2026-04-03)
2. "Firefox rapid-click filter tests are flaky" (from Contact Form A11Y Hardening, 2026-03-28)
3. "Audit test files for hardcoded project counts" (from CONTENT-003, 2026-03-23)

## Testing Strategy

- Run full test suite across all 3 browsers (Chromium, Firefox, WebKit)
- Specifically confirm `accessibility.spec.js:28` and all `rapid-clicks.spec.js` tests pass on Firefox
- Run Firefox tests multiple times (3+ runs) to validate flakiness is resolved
- No new tests — existing tests are the ones being stabilized

## Change Surface

| File | Change |
|------|--------|
| `tests/utils/timing.js` | Add `waitForAnimationComplete()`, remove `waitForFilterAnimation()` |
| `tests/pages/FilterPage.js` | Migrate 3 methods to new wait function |
| `tests/filter/rapid-clicks.spec.js` | Migrate 3 direct calls to new wait function |
