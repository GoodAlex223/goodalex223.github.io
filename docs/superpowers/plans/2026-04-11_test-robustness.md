# Test Robustness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace raw `page.evaluate` calls in modal accessibility tests with locator-based assertions and remove redundant `waitForScrollAnimations()` in reduced-motion axe-scan suites.

**Architecture:** Three isolated file changes — modal accessibility tests get web-first assertions, form axe-scan drops a redundant wait, filter axe-scan gains a reduced-motion block. No POM changes needed.

**Tech Stack:** Playwright (locators, web-first assertions), axe-core

---

## Task 1: Replace `page.evaluate` for focusable count (accessibility.spec.js line 40-44)

**Files:**
- Modify: `tests/modal/accessibility.spec.js:40-44`

- [ ] **Step 1: Replace `page.evaluate` with locator `.count()`**

In `tests/modal/accessibility.spec.js`, replace the focusable count evaluate block inside the "focus trap: Tab keeps focus within modal dialog" test.

Replace this (lines 40-44):
```js
    const focusableCount = await page.evaluate(() => {
      const dialog = document.querySelector(".project-modal__dialog");
      const selector = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
      return dialog.querySelectorAll(selector).length;
    });
```

With:
```js
    const focusableSelector = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const focusableCount = await mp.dialog.locator(focusableSelector).count();
```

- [ ] **Step 2: Run the focus trap Tab test to verify it passes**

Run: `npx playwright test tests/modal/accessibility.spec.js -g "focus trap: Tab keeps focus" --project=chromium`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add tests/modal/accessibility.spec.js
git commit -m "test: Replace page.evaluate for focusable count with locator"
```

---

## Task 2: Replace `page.evaluate` for focus-in-dialog check (accessibility.spec.js line 51-54)

**Files:**
- Modify: `tests/modal/accessibility.spec.js:51-54`

- [ ] **Step 1: Replace `page.evaluate` with web-first assertion**

In the same "focus trap: Tab keeps focus within modal dialog" test, replace the focus containment check inside the `for` loop.

Replace this (lines 51-55):
```js
      const isInDialog = await page.evaluate(() => {
        const dialog = document.querySelector(".project-modal__dialog");
        return dialog && dialog.contains(document.activeElement);
      });
      expect(isInDialog).toBe(true);
```

With:
```js
      await expect(mp.dialog.locator(':focus')).toHaveCount(1);
```

This is a web-first assertion that auto-retries — more robust than a one-shot boolean check.

- [ ] **Step 2: Remove unused `page` destructure if now unused**

After both replacements in this test (Task 1 + Task 2), check the test function signature. The test still uses `page` for `mp.pressTab()` indirectly via the POM, but `page` is destructured in the test signature `async ({ page, browserName })`. Since `page` is no longer used directly in the test body (only through `mp`), it can stay — Playwright requires it for the fixture. No change needed.

- [ ] **Step 3: Run the focus trap Tab test to verify it passes**

Run: `npx playwright test tests/modal/accessibility.spec.js -g "focus trap: Tab keeps focus" --project=chromium`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add tests/modal/accessibility.spec.js
git commit -m "test: Replace page.evaluate for focus containment with web-first assertion"
```

---

## Task 3: Replace `page.evaluate` for last-focusable tag check (accessibility.spec.js line 70-73)

**Files:**
- Modify: `tests/modal/accessibility.spec.js:70-74`

- [ ] **Step 1: Replace `page.evaluate` with locator assertion**

In the "focus trap: Shift+Tab wraps from first to last" test, replace the tag name check.

Replace this (lines 70-74):
```js
    const lastFocusableTag = await page.evaluate(() => {
      const el = document.activeElement;
      return el ? el.tagName.toLowerCase() : null;
    });
    expect(lastFocusableTag).toBe("a");
```

With:
```js
    await expect(mp.dialog.locator('a:focus')).toHaveCount(1);
```

This verifies the focused element is a link inside the dialog — matches the original intent without assuming which specific link.

- [ ] **Step 2: Run the Shift+Tab test to verify it passes**

Run: `npx playwright test tests/modal/accessibility.spec.js -g "Shift.Tab wraps" --project=chromium`
Expected: PASS

- [ ] **Step 3: Run all modal accessibility tests together**

Run: `npx playwright test tests/modal/accessibility.spec.js --project=chromium`
Expected: All tests PASS

- [ ] **Step 4: Commit**

```bash
git add tests/modal/accessibility.spec.js
git commit -m "test: Replace page.evaluate for last-focusable check with locator assertion"
```

---

## Task 4: Remove redundant `waitForScrollAnimations()` from form axe-scan reduced-motion test

**Files:**
- Modify: `tests/form/axe-scan.spec.js:54-59`

- [ ] **Step 1: Remove `waitForScrollAnimations()` from the reduced-motion test**

In `tests/form/axe-scan.spec.js`, the reduced-motion test (lines 54-59) currently calls `waitForScrollAnimations()` after `goto()` under reduced motion. Remove it.

Replace this (lines 54-59):
```js
  test("passes axe scan with reduced motion", async ({ page }) => {
    await fp.enableReducedMotion();
    await fp.goto();
    await fp.waitForScrollAnimations();
    await checkAccessibility(page);
  });
```

With:
```js
  test("passes axe scan with reduced motion", async ({ page }) => {
    await fp.enableReducedMotion();
    await fp.goto();
    await checkAccessibility(page);
  });
```

- [ ] **Step 2: Run the form axe-scan reduced-motion test**

Run: `npx playwright test tests/form/axe-scan.spec.js -g "reduced motion"`
Expected: PASS on all 3 browsers

- [ ] **Step 3: Run all form axe-scan tests together**

Run: `npx playwright test tests/form/axe-scan.spec.js`
Expected: All tests PASS (7 tests x 3 browsers = 21 total)

- [ ] **Step 4: Commit**

```bash
git add tests/form/axe-scan.spec.js
git commit -m "test: Remove redundant waitForScrollAnimations in form reduced-motion axe scan"
```

---

## Task 5: Add reduced-motion tests to filter axe-scan suite

**Files:**
- Modify: `tests/filter/axe-scan.spec.js` (add block before closing `});`)

- [ ] **Step 1: Add reduced-motion describe block**

In `tests/filter/axe-scan.spec.js`, add a `Reduced motion` describe block after the "Dark theme" block (after line 104, before the final `});` on line 105). This follows the established pattern from modal and form suites.

Add before the final `});`:
```js

  // ── Reduced motion WCAG AA scans ──────────────────────────────────────
  // Verify page remains accessible with prefers-reduced-motion enabled.
  // No waitForScrollAnimations() — animations are disabled under reduced motion.

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

Note: No `waitForScrollAnimations()` in `beforeEach` (animations disabled) and no `waitForScrollAnimations()` after `clickFilter()` (`clickFilter` already calls `waitForAnimationComplete()` internally via DOM polling).

- [ ] **Step 2: Run the new reduced-motion tests**

Run: `npx playwright test tests/filter/axe-scan.spec.js -g "Reduced motion"`
Expected: PASS on all 3 browsers (2 tests x 3 browsers = 6 total)

- [ ] **Step 3: Run all filter axe-scan tests together**

Run: `npx playwright test tests/filter/axe-scan.spec.js`
Expected: All tests PASS (10 tests x 3 browsers = 30 total — 8 existing + 2 new)

- [ ] **Step 4: Commit**

```bash
git add tests/filter/axe-scan.spec.js
git commit -m "test: Add reduced-motion WCAG scans to filter axe-scan suite"
```

---

## Task 6: Full test suite verification

- [ ] **Step 1: Run the complete test suite**

Run: `npm test`
Expected: All tests pass across Chromium, Firefox, WebKit. No regressions.

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: No lint errors.
