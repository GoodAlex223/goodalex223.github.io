# Firefox & Test Audit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminate Firefox flaky filter tests by replacing fixed-timeout waits with DOM state polling, and close out the hardcoded project counts audit.

**Architecture:** Add `waitForAnimationComplete()` to `tests/utils/timing.js` that uses Playwright web-first assertions to poll for animation class removal. Migrate all callers of `waitForFilterAnimation()` (POM + 3 spec files) to the new function, then remove the old one.

**Tech Stack:** Playwright (web-first assertions), ES modules

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `tests/utils/timing.js` | Modify | Add `waitForAnimationComplete()`, remove `waitForFilterAnimation()` |
| `tests/pages/FilterPage.js` | Modify | Migrate 3 POM methods to new wait function |
| `tests/filter/rapid-clicks.spec.js` | Modify | Migrate 2 direct calls |
| `tests/filter/url-hash.spec.js` | Modify | Migrate 3 direct calls |
| `tests/filter/keyboard-nav.spec.js` | Modify | Migrate 1 direct call |
| `tests/filter/axe-scan.spec.js` | Modify | Migrate 1 direct call |

---

### Task 1: Add `waitForAnimationComplete()` to timing.js

**Files:**
- Modify: `tests/utils/timing.js:1-50`

- [ ] **Step 1: Add `expect` import and new function**

At the top of `tests/utils/timing.js`, add the `expect` import. Then add the new function after the existing `waitForFilterAnimation`:

```js
import { expect } from "@playwright/test";
```

Add this function after `waitForFilterAnimation()` (after line 49):

```js
/**
 * Wait for the filter animation cycle to complete by polling DOM state.
 * Replaces fixed-timeout waitForFilterAnimation() — immune to browser
 * timing variance (Firefox flaky test fix).
 * @param {import('@playwright/test').Page} page
 * @param {{ timeout?: number }} [options]
 */
export async function waitForAnimationComplete(page, { timeout = 5000 } = {}) {
  await expect(page.locator(".project-card--filtering-out")).toHaveCount(0, {
    timeout,
  });
  await expect(page.locator(".project-card--filtering-in")).toHaveCount(0, {
    timeout,
  });
  await expect(page.locator(".project-card.is-filtering")).toHaveCount(0, {
    timeout,
  });
}
```

- [ ] **Step 2: Verify lint passes**

Run: `npx eslint tests/utils/timing.js`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add tests/utils/timing.js
git commit -m "test: Add waitForAnimationComplete() DOM polling function"
```

---

### Task 2: Migrate FilterPage.js POM to new wait function

**Files:**
- Modify: `tests/pages/FilterPage.js:6,61,69,82`

- [ ] **Step 1: Update import**

Change line 6 from:

```js
import { waitForFilterAnimation } from "../utils/timing.js";
```

to:

```js
import { waitForAnimationComplete } from "../utils/timing.js";
```

- [ ] **Step 2: Update `gotoWithHash()` (line 61)**

Change:

```js
    await waitForFilterAnimation(this.page);
```

to:

```js
    await waitForAnimationComplete(this.page);
```

- [ ] **Step 3: Update `clickFilter()` (line 69)**

Change:

```js
    await waitForFilterAnimation(this.page);
```

to:

```js
    await waitForAnimationComplete(this.page);
```

- [ ] **Step 4: Update `rapidClickFilters()` (line 82)**

Change:

```js
    await waitForFilterAnimation(this.page);
```

to:

```js
    await waitForAnimationComplete(this.page);
```

- [ ] **Step 5: Verify lint passes**

Run: `npx eslint tests/pages/FilterPage.js`
Expected: No errors

- [ ] **Step 6: Run filter tests on Chromium to verify no regression**

Run: `npx playwright test tests/filter/ --project=chromium`
Expected: All filter tests pass

- [ ] **Step 7: Commit**

```bash
git add tests/pages/FilterPage.js
git commit -m "test: Migrate FilterPage POM to waitForAnimationComplete"
```

---

### Task 3: Migrate rapid-clicks.spec.js

**Files:**
- Modify: `tests/filter/rapid-clicks.spec.js:3,30,42`

- [ ] **Step 1: Update import (line 3)**

Change:

```js
import { waitForFilterAnimation } from "../utils/timing.js";
```

to:

```js
import { waitForAnimationComplete } from "../utils/timing.js";
```

- [ ] **Step 2: Update "interrupting animation" test (line 30)**

Change:

```js
    await waitForFilterAnimation(fp.page);
```

to:

```js
    await waitForAnimationComplete(fp.page);
```

- [ ] **Step 3: Update "double-click toggle" test (line 42)**

Change:

```js
    await waitForFilterAnimation(fp.page);
```

to:

```js
    await waitForAnimationComplete(fp.page);
```

- [ ] **Step 4: Run rapid-clicks tests on all browsers**

Run: `npx playwright test tests/filter/rapid-clicks.spec.js`
Expected: All 4 tests pass on Chromium, Firefox, and WebKit

- [ ] **Step 5: Commit**

```bash
git add tests/filter/rapid-clicks.spec.js
git commit -m "test: Migrate rapid-clicks.spec.js to waitForAnimationComplete"
```

---

### Task 4: Migrate url-hash.spec.js

**Files:**
- Modify: `tests/filter/url-hash.spec.js:3,49,62,65`

- [ ] **Step 1: Update import (line 3)**

Change:

```js
import { waitForFilterAnimation } from "../utils/timing.js";
```

to:

```js
import { waitForAnimationComplete } from "../utils/timing.js";
```

- [ ] **Step 2: Update "browser back" test (line 49)**

Change:

```js
    await waitForFilterAnimation(page);
```

to:

```js
    await waitForAnimationComplete(page);
```

- [ ] **Step 3: Update "browser forward" test (lines 62, 65)**

Change both occurrences:

```js
    await waitForFilterAnimation(page);
```

to:

```js
    await waitForAnimationComplete(page);
```

- [ ] **Step 4: Run url-hash tests on all browsers**

Run: `npx playwright test tests/filter/url-hash.spec.js`
Expected: All 6 tests pass on Chromium, Firefox, and WebKit

- [ ] **Step 5: Commit**

```bash
git add tests/filter/url-hash.spec.js
git commit -m "test: Migrate url-hash.spec.js to waitForAnimationComplete"
```

---

### Task 5: Migrate keyboard-nav.spec.js and axe-scan.spec.js

**Files:**
- Modify: `tests/filter/keyboard-nav.spec.js:3,63`
- Modify: `tests/filter/axe-scan.spec.js:4,56`

- [ ] **Step 1: Update keyboard-nav.spec.js import (line 3)**

Change:

```js
import { waitForFilterAnimation } from "../utils/timing.js";
```

to:

```js
import { waitForAnimationComplete } from "../utils/timing.js";
```

- [ ] **Step 2: Update "Escape resets filter" test (line 63)**

Change:

```js
    await waitForFilterAnimation(page);
```

to:

```js
    await waitForAnimationComplete(page);
```

- [ ] **Step 3: Update axe-scan.spec.js import (line 4)**

Change:

```js
import { waitForFilterAnimation } from "../utils/timing.js";
```

to:

```js
import { waitForAnimationComplete } from "../utils/timing.js";
```

- [ ] **Step 4: Update "keyboard navigation" axe test (line 56)**

Change:

```js
    await waitForFilterAnimation(page);
```

to:

```js
    await waitForAnimationComplete(page);
```

- [ ] **Step 5: Run both test files on all browsers**

Run: `npx playwright test tests/filter/keyboard-nav.spec.js tests/filter/axe-scan.spec.js`
Expected: All tests pass on Chromium, Firefox, and WebKit

- [ ] **Step 6: Commit**

```bash
git add tests/filter/keyboard-nav.spec.js tests/filter/axe-scan.spec.js
git commit -m "test: Migrate keyboard-nav and axe-scan to waitForAnimationComplete"
```

---

### Task 6: Remove old `waitForFilterAnimation()` and verify

**Files:**
- Modify: `tests/utils/timing.js`

- [ ] **Step 1: Verify no remaining callers**

Run: `grep -r "waitForFilterAnimation" tests/`
Expected: No results (only archive docs should reference it)

- [ ] **Step 2: Remove `waitForFilterAnimation()` from timing.js**

Remove the entire function (lines 43-49 of the original file):

```js
export async function waitForFilterAnimation(page) {
  const duration = await getAnimationDuration(page);
  const stagger = await getStaggerDelay(page);
  const maxCards = 7;
  const buffer = 300;
  const totalTime = duration * 2 + stagger * maxCards + buffer;
  await page.waitForTimeout(totalTime);
}
```

Also remove its JSDoc comment block (lines 38-42).

- [ ] **Step 3: Verify lint passes**

Run: `npx eslint tests/utils/timing.js`
Expected: No errors

- [ ] **Step 4: Run full filter test suite on all browsers**

Run: `npx playwright test tests/filter/`
Expected: All filter tests pass on Chromium, Firefox, and WebKit

- [ ] **Step 5: Commit**

```bash
git add tests/utils/timing.js
git commit -m "test: Remove deprecated waitForFilterAnimation"
```

---

### Task 7: Firefox stability verification

- [ ] **Step 1: Run Firefox filter tests 3 times**

Run each separately and verify all pass:

```bash
npx playwright test tests/filter/ --project=firefox
npx playwright test tests/filter/ --project=firefox
npx playwright test tests/filter/ --project=firefox
```

Expected: All 3 runs pass with zero failures. Pay special attention to:
- `accessibility.spec.js` > "aria-pressed updates when filter changes"
- `rapid-clicks.spec.js` > all 4 tests

- [ ] **Step 2: Run full test suite**

Run: `npm test`
Expected: All tests pass across all 3 browsers (Chromium, Firefox, WebKit)

- [ ] **Step 3: Run lint**

Run: `npm run lint`
Expected: No errors

---

### Task 8: Documentation — close backlog items

**Files:**
- Modify: `docs/planning/BACKLOG.md`

- [ ] **Step 1: Mark Firefox filter accessibility backlog item as done**

In the "From Code Quality & Lint Fixes (2026-04-03)" section, change:

```markdown
- [ ] Fix pre-existing flaky Firefox filter accessibility test — `tests/filter/accessibility.spec.js:28` (`aria-pressed updates when filter changes`) intermittently fails in Firefox only; likely a timing issue with filter button state updates
```

to:

```markdown
- [x] ~~Fix pre-existing flaky Firefox filter accessibility test~~ *(resolved 2026-04-10, replaced waitForFilterAnimation fixed timeout with waitForAnimationComplete DOM polling)*
```

- [ ] **Step 2: Mark Firefox rapid-click backlog item as done**

In the "From Contact Form A11Y Hardening (2026-03-28)" section, change:

```markdown
- [ ] Firefox rapid-click filter tests are flaky — `rapid-clicks.spec.js` passes inconsistently on Firefox due to animation timing sensitivity. Consider `toPass()` retry wrapper or increased timeouts for Firefox specifically
```

to:

```markdown
- [x] ~~Firefox rapid-click filter tests are flaky~~ *(resolved 2026-04-10, replaced waitForFilterAnimation fixed timeout with waitForAnimationComplete DOM polling)*
```

- [ ] **Step 3: Mark hardcoded project counts backlog item as done**

In the "From CONTENT-003: Add CleanSpark to Portfolio (2026-03-23)" section, change:

```markdown
- [ ] Audit test files for hardcoded project counts — accessibility.spec.js had "7" instead of using `CATEGORY_COUNTS.all`; other tests may have similar fragile literals
```

to:

```markdown
- [x] ~~Audit test files for hardcoded project counts~~ *(resolved 2026-04-10, audit confirmed: filter tests use CATEGORY_COUNTS throughout; modal basic-modal.spec.js has per-project content assertions that are intentionally specific, not global counts)*
```

- [ ] **Step 4: Commit**

```bash
git add docs/planning/BACKLOG.md
git commit -m "docs: Close Firefox flaky tests and hardcoded counts backlog items"
```
