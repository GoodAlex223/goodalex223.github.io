# Test Robustness — Design Spec

**Date**: 2026-04-11
**Branch**: `quality/test-robustness`
**Effort**: 5 SP (3 SP + 2 SP)
**Origin**: WEEKLY.md Task 4, BACKLOG.md (Test Quality Improvements 2026-04-05)

---

## Goal

Improve test robustness by eliminating raw `page.evaluate` calls in modal accessibility tests and removing redundant `waitForScrollAnimations()` delays in reduced-motion axe-scan tests.

## Task 1: Replace `page.evaluate` in Modal Accessibility Tests (3 SP)

### Problem

Three `page.evaluate` calls in `tests/modal/accessibility.spec.js` bypass Playwright's auto-retry mechanism. These are in Chromium-only focus trap tests (lines 40, 51, 70).

### Changes

All changes are in `tests/modal/accessibility.spec.js`. No POM changes needed — these assertions are single-use within Chromium-only tests, so inline locator queries are appropriate.

#### Line 40 — Focusable element count

**Before**: `page.evaluate` queries `dialog.querySelectorAll(selector).length`

**After**: Use `mp.dialog.locator()` with the same selector, then `.count()`:
```js
const focusableSelector = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
const focusableCount = await mp.dialog.locator(focusableSelector).count();
```

#### Line 51 — Focus stays within dialog

**Before**: `page.evaluate` checks `dialog.contains(document.activeElement)` returns boolean

**After**: Assert the dialog contains a focused element:
```js
await expect(mp.dialog.locator(':focus')).toHaveCount(1);
```

This is a web-first assertion that auto-retries — more robust than a one-shot boolean check.

#### Line 70 — Last focusable element is a link

**Before**: `page.evaluate` gets `document.activeElement.tagName` and asserts it's `"a"`

**After**: Assert the focused element within the dialog is a link:
```js
await expect(mp.dialog.locator('a:focus')).toHaveCount(1);
```

Alternatively, assert the last link in the dialog is focused:
```js
await expect(mp.dialog.locator('a[href]').last()).toBeFocused();
```

The first option (count-based) is more resilient — it doesn't assume which specific link is last, only that the focused element is a link inside the dialog.

### Decision

Use `mp.dialog.locator('a:focus').toHaveCount(1)` for line 70 — it matches the original test's intent (verify focused element is a link) without assuming which link.

## Task 2: Reduced-Motion `waitForScrollAnimations()` Optimization (2 SP)

### Problem

`waitForScrollAnimations()` is a 700ms fixed timeout that waits for scroll-triggered CSS animations to settle. Under `prefers-reduced-motion: reduce`, these animations are disabled — the wait is pure overhead.

The modal axe-scan suite already skips this wait in its reduced-motion block (PR #58 pattern). The form and filter suites do not.

### Changes

#### `tests/form/axe-scan.spec.js`

The reduced-motion test (line 54-59) currently:
```js
test("passes axe scan with reduced motion", async ({ page }) => {
  await fp.enableReducedMotion();
  await fp.goto();
  await fp.waitForScrollAnimations();  // <-- remove this
  await checkAccessibility(page);
});
```

Remove `waitForScrollAnimations()` — animations are disabled under reduced motion.

#### `tests/filter/axe-scan.spec.js`

Currently has no reduced-motion tests. Add a `Reduced motion` describe block following the established pattern:

```js
test.describe("Reduced motion", () => {
  test.beforeEach(async () => {
    await fp.enableReducedMotion();
    await fp.goto();
  });

  test("initial page load passes WCAG 2.1 AA", async ({ page }) => {
    await checkAccessibility(page);
  });

  test("active filter passes WCAG 2.1 AA", async ({ page }) => {
    await fp.clickFilter("iot");
    await fp.waitForScrollAnimations();
    await checkAccessibility(page);
  });
});
```

Note: `waitForScrollAnimations()` after `clickFilter` is kept because filter animation settling may still matter even under reduced motion (the filter wait is for layout settling, not scroll animations). However, the outer `beforeEach` no longer calls it for initial page load.

**Correction**: Actually, `fp.waitForScrollAnimations()` after `clickFilter()` waits for the same 700ms scroll animation timeout. Under reduced motion, scroll animations are instant. But `clickFilter()` already calls `waitForAnimationComplete()` internally (which polls DOM state). So `waitForScrollAnimations()` after filter clicks in the reduced-motion block should also be omitted. The axe scan can run immediately after filter animation completes.

Final reduced-motion block for filter:
```js
test.describe("Reduced motion", () => {
  test.beforeEach(async () => {
    await fp.enableReducedMotion();
    await fp.goto();
  });

  test("initial page load passes WCAG 2.1 AA", async ({ page }) => {
    await checkAccessibility(page);
  });

  test("active filter passes WCAG 2.1 AA", async ({ page }) => {
    await fp.clickFilter("iot");
    await checkAccessibility(page);
  });
});
```

## Files Changed

| File | Change |
|------|--------|
| `tests/modal/accessibility.spec.js` | Replace 3 `page.evaluate` calls with locator-based assertions |
| `tests/form/axe-scan.spec.js` | Remove `waitForScrollAnimations()` from reduced-motion test |
| `tests/filter/axe-scan.spec.js` | Add reduced-motion describe block (2 tests, no scroll waits) |

## Testing

- `npm test` — all tests pass across Chromium, Firefox, WebKit
- Focus trap tests remain Chromium-only (existing `test.skip` guard)
- New filter reduced-motion tests run on all 3 browsers

## Out of Scope

- POM helper methods for focus trap assertions (single-use, no reuse benefit)
- Replacing `page.evaluate` in non-accessibility test files
- `waitForScrollAnimations()` optimization in non-axe-scan tests
