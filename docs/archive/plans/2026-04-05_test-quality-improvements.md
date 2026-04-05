# Test Quality Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix 3 test quality issues: replace `page.evaluate` with web-first assertions, optimize reduced-motion test setup, add missing screenshot assertion.

**Architecture:** Pure test-file changes — no production code modified. Each task targets a specific test file with a specific anti-pattern fix.

**Tech Stack:** Playwright E2E tests, Page Object Models (FormPage, ModalPage)

---

## File Structure

| File | Action | Responsibility |
|------|--------|---------------|
| `tests/form/accessibility.spec.js` | Modify | Replace 4x `page.evaluate` focus checks with `toBeFocused()` |
| `tests/form/submission.spec.js` | Modify | Replace 2x `test.expect` with imported `expect` |
| `tests/modal/axe-scan.spec.js` | Modify | Remove redundant reduced-motion `beforeEach` setup |
| `tests/modal/basic-modal.spec.js` | Modify | Add `expectScreenshotsCount(2)` to rule-indicators test |

---

## Task 1: Replace `page.evaluate` focus checks in accessibility.spec.js

**Files:**
- Modify: `tests/form/accessibility.spec.js:55-77`

- [ ] **Step 1: Replace focus check in "focus moves to first invalid field on submit"**

Change lines 55-58 from:

```js
  test("focus moves to first invalid field on submit", async ({ page }) => {
    await fp.clickSubmit();
    const focusedId = await page.evaluate(() => document.activeElement.id);
    expect(focusedId).toBe("contact-name");
  });
```

To:

```js
  test("focus moves to first invalid field on submit", async () => {
    await fp.clickSubmit();
    await expect(fp.nameField).toBeFocused();
  });
```

- [ ] **Step 2: Replace focus check in "focus moves to second field when first is valid"**

Change lines 61-65 from:

```js
  test("focus moves to second field when first is valid", async ({ page }) => {
    await fp.fillName("Valid Name");
    await fp.clickSubmit();
    const focusedId = await page.evaluate(() => document.activeElement.id);
    expect(focusedId).toBe("contact-email");
  });
```

To:

```js
  test("focus moves to second field when first is valid", async () => {
    await fp.fillName("Valid Name");
    await fp.clickSubmit();
    await expect(fp.emailField).toBeFocused();
  });
```

- [ ] **Step 3: Replace focus checks in "form is keyboard navigable with Tab"**

Change lines 68-77 from:

```js
  test("form is keyboard navigable with Tab", async ({ page }) => {
    await fp.nameField.focus();
    await page.keyboard.press("Tab");
    const secondFocused = await page.evaluate(() => document.activeElement.id);
    expect(secondFocused).toBe("contact-email");

    await page.keyboard.press("Tab");
    const thirdFocused = await page.evaluate(() => document.activeElement.id);
    expect(thirdFocused).toBe("contact-message");
  });
```

To:

```js
  test("form is keyboard navigable with Tab", async () => {
    await fp.nameField.focus();
    await fp.page.keyboard.press("Tab");
    await expect(fp.emailField).toBeFocused();

    await fp.page.keyboard.press("Tab");
    await expect(fp.messageField).toBeFocused();
  });
```

Note: `page.keyboard` becomes `fp.page.keyboard` since we removed `{ page }` destructuring. The `fp` POM exposes `.page` for keyboard operations.

- [ ] **Step 4: Run tests to verify all 3 tests pass**

Run: `npx playwright test tests/form/accessibility.spec.js --reporter=list`
Expected: All 8 tests PASS across all browsers

- [ ] **Step 5: Run lint to verify no issues**

Run: `npm run lint:js`
Expected: No errors

- [ ] **Step 6: Commit**

```bash
git add tests/form/accessibility.spec.js
git commit -m "test: Replace page.evaluate with web-first toBeFocused()"
```

---

## Task 2: Fix `test.expect` → `expect` in submission.spec.js

**Files:**
- Modify: `tests/form/submission.spec.js:69,118`

- [ ] **Step 1: Replace `test.expect` on line 69**

In the "does not send request when honeypot is filled" test, change line 69 from:

```js
    test.expect(requestMade).toBe(false);
```

To:

```js
    expect(requestMade).toBe(false);
```

- [ ] **Step 2: Replace `test.expect` on line 118**

In the "does not submit when validation fails" test, change line 118 from:

```js
    test.expect(requestMade).toBe(false);
```

To:

```js
    expect(requestMade).toBe(false);
```

- [ ] **Step 3: Run tests to verify both tests pass**

Run: `npx playwright test tests/form/submission.spec.js --reporter=list`
Expected: All 8 tests PASS across all browsers

- [ ] **Step 4: Run lint to verify no issues**

Run: `npm run lint:js`
Expected: No errors

- [ ] **Step 5: Commit**

```bash
git add tests/form/submission.spec.js
git commit -m "test: Use imported expect() consistently in submission tests"
```

---

## Task 3: Optimize reduced-motion beforeEach in modal axe-scan

**Files:**
- Modify: `tests/modal/axe-scan.spec.js:64-69`

- [ ] **Step 1: Simplify reduced-motion beforeEach**

Change lines 64-69 from:

```js
  test.describe("Reduced motion", () => {
    test.beforeEach(async ({ page }) => {
      mp = new ModalPage(page);
      await mp.enableReducedMotion();
      await mp.goto();
      await mp.waitForScrollAnimations();
    });
```

To:

```js
  test.describe("Reduced motion", () => {
    test.beforeEach(async () => {
      await mp.enableReducedMotion();
      await mp.goto();
    });
```

Changes:
- Remove `{ page }` destructuring (no longer needed)
- Remove `mp = new ModalPage(page)` (reuse from outer `beforeEach`)
- Remove `mp.waitForScrollAnimations()` (animations disabled under reduced motion)
- Keep `mp.enableReducedMotion()` + `mp.goto()` (page must reload after media query emulation)

- [ ] **Step 2: Run tests to verify reduced-motion tests pass**

Run: `npx playwright test tests/modal/axe-scan.spec.js --reporter=list`
Expected: All tests PASS across all browsers. Reduced-motion tests should run ~700ms faster per test.

- [ ] **Step 3: Run lint to verify no issues**

Run: `npm run lint:js`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add tests/modal/axe-scan.spec.js
git commit -m "test: Remove redundant setup in reduced-motion axe-scan tests"
```

---

## Task 4: Add expectScreenshotsCount to rule-indicators test

**Files:**
- Modify: `tests/modal/basic-modal.spec.js:28-36`

- [ ] **Step 1: Add the missing assertion**

In the "displays correct content for rule-indicators" test, add `expectScreenshotsCount(2)` after line 35. The test block becomes:

```js
  test("displays correct content for rule-indicators", async () => {
    await mp.clickCard("rule-indicators");
    await mp.expectTitle("Industrial Rule Indicators");
    await mp.expectCategory("IoT");
    await mp.expectDescriptionCount(3);
    await mp.expectHighlightsCount(6);
    await mp.expectTechPillsCount(5);
    await mp.expectScreenshotsCount(2);
    await mp.expectLinksCount(2); // GitHub + Demo
  });
```

- [ ] **Step 2: Run tests to verify the test passes**

Run: `npx playwright test tests/modal/basic-modal.spec.js --reporter=list`
Expected: All tests PASS across all browsers

- [ ] **Step 3: Run lint to verify no issues**

Run: `npm run lint:js`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add tests/modal/basic-modal.spec.js
git commit -m "test: Add expectScreenshotsCount to rule-indicators modal test"
```

---

## Task 5: Full test suite verification

- [ ] **Step 1: Run full test suite**

Run: `npm test`
Expected: All tests PASS across Chromium, Firefox, WebKit

- [ ] **Step 2: Run full lint**

Run: `npm run lint`
Expected: No errors
