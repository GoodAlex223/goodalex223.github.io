# Scroll-Animation Deterministic Polling Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the 700ms fixed-timeout `waitForScrollAnimations()` helper (currently duplicated 3x across Page Object Models) with a single viewport-aware DOM polling helper in `tests/utils/timing.js`, and migrate all 17 axe-scan call sites.

**Architecture:** New exported function `waitForScrollAnimations(page, { timeout })` in `tests/utils/timing.js`. Short-circuits under `prefers-reduced-motion: reduce`. Otherwise polls `expect.poll()` until every `[data-animate]:not(.is-visible)` element is either outside the viewport or has zero width (filter-hidden via `display: none`). Mirrors the existing `waitForAnimationComplete()` pattern. Call sites switch from `fp.waitForScrollAnimations()` to `waitForScrollAnimations(page)` with a top-of-file import. The three POM methods are deleted.

**Tech Stack:** Playwright (`@playwright/test` v1.x), ESM imports, plain JS. No production code changes.

**Spec:** `docs/superpowers/specs/2026-05-16_scroll-animation-deterministic-polling-design.md`

---

## File Structure

**Modified files:**
- `tests/utils/timing.js` — add `waitForScrollAnimations()` export (joins `getAnimationDuration`, `getStaggerDelay`, `waitForAnimationComplete`)
- `tests/pages/FilterPage.js` — delete `waitForScrollAnimations()` method
- `tests/pages/ModalPage.js` — delete `waitForScrollAnimations()` method
- `tests/pages/FormPage.js` — delete `waitForScrollAnimations()` method
- `tests/filter/axe-scan.spec.js` — migrate 10 call sites + restore line-108 omitted call, remove stale comment
- `tests/modal/axe-scan.spec.js` — migrate 1 call site
- `tests/form/axe-scan.spec.js` — migrate 4 call sites

**Files unchanged:** `js/main.js`, all CSS, `index.html`, all production assets, all non-axe-scan test files.

---

## Task 1: Add `waitForScrollAnimations()` helper and validate against one call site

**Files:**
- Modify: `tests/utils/timing.js` (add export at end of file)
- Modify: `tests/filter/axe-scan.spec.js:4` (add import) and `tests/filter/axe-scan.spec.js:12` (swap call)

**Why a single call site first?** Vertical-slice validation. If the helper has a bug, we discover it before touching 16 other call sites.

- [ ] **Step 1: Read current `tests/utils/timing.js`**

Run: `cat tests/utils/timing.js`

Expected: file currently exports `getAnimationDuration`, `getStaggerDelay`, `waitForAnimationComplete`. `expect` already imported from `@playwright/test` on line 5.

- [ ] **Step 2: Add `waitForScrollAnimations()` to `tests/utils/timing.js`**

> **Amendment (2026-05-16, post-initial-validation):** The original spec proposed polling on `[data-animate]:not(.is-visible)`. WebKit cross-browser smoke testing revealed that the class is added at the *start* of a 400ms opacity transition, and axe-core color-contrast sampling mid-transition produces flaky failures. The helper below polls computed opacity instead, which captures the full settle.

Append this function to the end of the file (after `waitForAnimationComplete`):

```js
/**
 * Wait for scroll-in animations to settle by polling DOM state.
 * Replaces the fixed-timeout waitForScrollAnimations() POM methods.
 *
 * Resolves when every [data-animate] element currently in the viewport has
 * computed opacity 1 (fully painted). Polling on the .is-visible class
 * alone is insufficient: the class triggers a 400ms opacity transition
 * (see css/components.css:449-455), and axe-core sampling mid-transition
 * produces false color-contrast failures on WebKit. Polling on computed
 * opacity catches both class addition AND transition completion.
 * Below-fold elements are skipped — they legitimately have not been
 * observed by IntersectionObserver yet.
 *
 * Short-circuits under prefers-reduced-motion: reduce — js/main.js never
 * sets up the observer in that case, and CSS in the reduced-motion media
 * query applies opacity: 1 unconditionally to [data-animate], so polling
 * would resolve on the first tick anyway. The early return makes the
 * intent explicit and saves a round-trip.
 *
 * Filter-hidden cards (.project-card--hidden) are skipped via an explicit
 * class check matching the observer-side skip in js/main.js:595. The
 * class uses visibility: hidden + position: absolute (not display: none),
 * so getBoundingClientRect returns a non-zero rect — the class check is
 * the canonical signal. The r.width > 0 rect guard remains as
 * defense-in-depth for any future zero-width [data-animate] element.
 *
 * @param {import('@playwright/test').Page} page
 * @param {{ timeout?: number }} [options]
 */
export async function waitForScrollAnimations(page, { timeout = 5000 } = {}) {
  const reducedMotion = await page.evaluate(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  if (reducedMotion) return;

  await expect
    .poll(
      async () =>
        page.evaluate(() => {
          const ROOT_MARGIN_BOTTOM = 50;
          const THRESHOLD = 0.1;
          const effectiveBottom = window.innerHeight - ROOT_MARGIN_BOTTOM;
          const elements = document.querySelectorAll("[data-animate]");
          for (const el of elements) {
            if (el.classList.contains("project-card--hidden")) continue;
            const r = el.getBoundingClientRect();
            if (r.height === 0 || r.width === 0) continue;
            const visibleHeight = Math.max(
              0,
              Math.min(r.bottom, effectiveBottom) - Math.max(r.top, 0),
            );
            if (visibleHeight / r.height >= THRESHOLD) {
              const opacity = parseFloat(getComputedStyle(el).opacity);
              if (opacity < 1) return false;
            }
          }
          return true;
        }),
      { timeout },
    )
    .toBe(true);
}
```

- [ ] **Step 3: Lint the modified utility**

Run: `npm run lint:js`

Expected: PASS with no new errors. (Existing config in `eslint.config.js` covers `tests/` with Playwright ESM rules.)

- [ ] **Step 4: Add import to `tests/filter/axe-scan.spec.js`**

Find line 4:
```js
import { waitForAnimationComplete } from "../utils/timing.js";
```

Replace with:
```js
import { waitForAnimationComplete, waitForScrollAnimations } from "../utils/timing.js";
```

- [ ] **Step 5: Migrate the first call site (line 12, inside outer `beforeEach`)**

Find:
```js
    await fp.waitForScrollAnimations();
```
on line 12 (inside the outer `test.beforeEach`).

Replace with:
```js
    await waitForScrollAnimations(page);
```

Note: `page` is already available in the `beforeEach({ page })` destructure on line 9. No other change needed there.

- [ ] **Step 6: Verify the single migrated test still passes (Chromium)**

Run: `npx playwright test tests/filter/axe-scan.spec.js --project=chromium -g "initial page load passes WCAG 2.1 AA"`

Expected: PASS. This exercises the new helper end-to-end against one axe scan.

- [ ] **Step 7: Verify cross-browser**

Run: `npx playwright test tests/filter/axe-scan.spec.js --project=firefox -g "initial page load passes WCAG 2.1 AA"`
Run: `npx playwright test tests/filter/axe-scan.spec.js --project=webkit -g "initial page load passes WCAG 2.1 AA"`

Expected: PASS on both. Confirms helper works on all three engines before bulk migration.

- [ ] **Step 8: Commit**

```bash
git add tests/utils/timing.js tests/filter/axe-scan.spec.js
git commit -m "test: Add deterministic waitForScrollAnimations polling helper

Adds viewport-aware DOM polling utility to tests/utils/timing.js
that replaces fixed 700ms timeouts in scroll-animation waits.
Migrates first filter axe-scan call site as vertical-slice
validation across Chromium/Firefox/WebKit before bulk migration."
```

---

## Task 2: Migrate remaining filter axe-scan call sites + restore line-108 reduced-motion call

**Files:**
- Modify: `tests/filter/axe-scan.spec.js` (9 remaining call sites + line-108 fix)

**Why batched:** All changes are in the same file with the same transformation pattern. Single commit keeps the diff coherent.

- [ ] **Step 1: Identify remaining call sites**

Run: `grep -n "waitForScrollAnimations" tests/filter/axe-scan.spec.js`

Expected: 9 lines remaining matching `fp.waitForScrollAnimations()` (after Task 1 removed line 12). Approximate line numbers from a clean working copy: 21, 27, 33, 39, 46, 57, 65, 85, 101. Also line 108: comment-only.

- [ ] **Step 2: Replace all `fp.waitForScrollAnimations()` calls**

For each of the 9 remaining matches, replace `await fp.waitForScrollAnimations();` with `await waitForScrollAnimations(page);`. Each surrounding `test.beforeEach` or `test()` already destructures `{ page }`.

Recommended approach in PowerShell:

```powershell
(Get-Content tests/filter/axe-scan.spec.js -Raw) -replace 'await fp\.waitForScrollAnimations\(\);', 'await waitForScrollAnimations(page);' | Set-Content tests/filter/axe-scan.spec.js
```

Or use the `Edit` tool with `replace_all: true` on the literal string `await fp.waitForScrollAnimations();` → `await waitForScrollAnimations(page);`.

Verify all replaced:

Run: `grep -n "fp.waitForScrollAnimations" tests/filter/axe-scan.spec.js`

Expected: no matches.

- [ ] **Step 3: Restore the omitted reduced-motion call and remove stale comment (around line 108)**

Find this block (lines ~106-114):
```js
  // ── Reduced motion WCAG AA scans ──────────────────────────────────────
  // Verify page remains accessible with prefers-reduced-motion enabled.
  // No waitForScrollAnimations() — animations are disabled under reduced motion.

  test.describe("Reduced motion", () => {
    test.beforeEach(async () => {
      await fp.enableReducedMotion();
      await fp.goto();
    });
```

Replace with:
```js
  // ── Reduced motion WCAG AA scans ──────────────────────────────────────
  // Verify page remains accessible with prefers-reduced-motion enabled.
  // waitForScrollAnimations() short-circuits under reduced motion (free).

  test.describe("Reduced motion", () => {
    test.beforeEach(async ({ page }) => {
      await fp.enableReducedMotion();
      await fp.goto();
      await waitForScrollAnimations(page);
    });
```

Note the two changes inside the block: (1) added `{ page }` to the `beforeEach` destructure, (2) added the `await waitForScrollAnimations(page);` call after `fp.goto()`. The comment text is also updated to reflect the new reality.

- [ ] **Step 4: Run the full filter axe-scan suite (Chromium)**

Run: `npx playwright test tests/filter/axe-scan.spec.js --project=chromium`

Expected: PASS on all tests in the suite (currently 11+ tests across the file).

- [ ] **Step 5: Cross-browser**

Run: `npx playwright test tests/filter/axe-scan.spec.js --project=firefox`
Run: `npx playwright test tests/filter/axe-scan.spec.js --project=webkit`

Expected: PASS on both.

- [ ] **Step 6: Commit**

```bash
git add tests/filter/axe-scan.spec.js
git commit -m "test: Migrate filter axe-scan suite to waitForScrollAnimations(page)

Replaces remaining 9 fp.waitForScrollAnimations() calls with the
central helper. Restores the reduced-motion test's wait (now free
via the helper's short-circuit) and updates the rationale comment."
```

---

## Task 3: Migrate modal axe-scan call site

**Files:**
- Modify: `tests/modal/axe-scan.spec.js` (1 call site)

- [ ] **Step 1: Add import**

Find line 3:
```js
import { checkAccessibility } from "../utils/axe-helper.js";
```

Insert a new line after it:
```js
import { waitForScrollAnimations } from "../utils/timing.js";
```

Resulting top of file:
```js
import { test } from "@playwright/test";
import { ModalPage, PROJECTS_WITH_DETAILS } from "../pages/ModalPage.js";
import { checkAccessibility } from "../utils/axe-helper.js";
import { waitForScrollAnimations } from "../utils/timing.js";
```

- [ ] **Step 2: Migrate the call site (line 17)**

Find:
```js
  test.beforeEach(async ({ page }) => {
    mp = new ModalPage(page);
    await mp.goto();
    await mp.waitForScrollAnimations();
  });
```

Replace with:
```js
  test.beforeEach(async ({ page }) => {
    mp = new ModalPage(page);
    await mp.goto();
    await waitForScrollAnimations(page);
  });
```

Verify no remaining `mp.waitForScrollAnimations` references:

Run: `grep -n "waitForScrollAnimations" tests/modal/axe-scan.spec.js`

Expected: 1 match — the new `await waitForScrollAnimations(page);` line.

- [ ] **Step 3: Run modal axe-scan suite (Chromium)**

Run: `npx playwright test tests/modal/axe-scan.spec.js --project=chromium`

Expected: PASS.

- [ ] **Step 4: Cross-browser**

Run: `npx playwright test tests/modal/axe-scan.spec.js --project=firefox`
Run: `npx playwright test tests/modal/axe-scan.spec.js --project=webkit`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add tests/modal/axe-scan.spec.js
git commit -m "test: Migrate modal axe-scan to waitForScrollAnimations(page)

Single-site migration to the central deterministic helper."
```

---

## Task 4: Migrate form axe-scan call sites

**Files:**
- Modify: `tests/form/axe-scan.spec.js` (4 call sites)

- [ ] **Step 1: Add import**

Find line 3:
```js
import { checkAccessibility } from "../utils/axe-helper.js";
```

Insert a new line after it:
```js
import { waitForScrollAnimations } from "../utils/timing.js";
```

- [ ] **Step 2: Replace all `fp.waitForScrollAnimations()` calls**

PowerShell:
```powershell
(Get-Content tests/form/axe-scan.spec.js -Raw) -replace 'await fp\.waitForScrollAnimations\(\);', 'await waitForScrollAnimations(page);' | Set-Content tests/form/axe-scan.spec.js
```

Or use `Edit` tool with `replace_all: true`: `await fp.waitForScrollAnimations();` → `await waitForScrollAnimations(page);`.

**Scope note:** The reduced-motion test (lines 54-58) intentionally does NOT call `waitForScrollAnimations()` — this is documented in CLAUDE.md as an intentional omission ("animations are instant under reduced motion"). The spec scope only requires restoring the *filter* line-108 call. Leave the form reduced-motion test unchanged here; a future consistency follow-up can address it.

Verify:

Run: `grep -n "fp.waitForScrollAnimations" tests/form/axe-scan.spec.js`

Expected: no matches.

- [ ] **Step 3: Confirm the helper is used and old calls are gone**

Run: `grep -n "waitForScrollAnimations" tests/form/axe-scan.spec.js`

Expected: 4 matches, each `await waitForScrollAnimations(page);` plus the import line (5 total).

- [ ] **Step 4: Run form axe-scan suite (Chromium)**

Run: `npx playwright test tests/form/axe-scan.spec.js --project=chromium`

Expected: PASS.

- [ ] **Step 5: Cross-browser**

Run: `npx playwright test tests/form/axe-scan.spec.js --project=firefox`
Run: `npx playwright test tests/form/axe-scan.spec.js --project=webkit`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add tests/form/axe-scan.spec.js
git commit -m "test: Migrate form axe-scan to waitForScrollAnimations(page)

Replaces 4 fp.waitForScrollAnimations() calls with the central
deterministic helper."
```

---

## Task 5: Delete POM duplicate methods

**Files:**
- Modify: `tests/pages/FilterPage.js` (delete lines 53-57)
- Modify: `tests/pages/ModalPage.js` (delete lines 228-231)
- Modify: `tests/pages/FormPage.js` (delete lines 204-207)

**Why last:** All call sites have been migrated. Deleting the methods now is safe.

- [ ] **Step 1: Confirm no remaining callers**

Run: `grep -rn "\.waitForScrollAnimations\b" tests/`

Expected: no matches (the POM dotted form is gone). The only matches should be the new `waitForScrollAnimations(page)` call form, which doesn't have a leading `.`.

If any match appears, STOP and migrate the missed call site first (treat as Task 2/3/4 extension).

- [ ] **Step 2: Delete the FilterPage method**

In `tests/pages/FilterPage.js`, find:
```js
  /** Wait for initial scroll-in animations to settle (hero + visible sections) */
  async waitForScrollAnimations() {
    // Hero elements stagger up to 150ms + 400ms transition = 550ms; add buffer
    await this.page.waitForTimeout(700);
  }

```

Delete the entire block including the blank line after the closing brace. Verify the next method (`async gotoWithHash(category)`) follows directly after `async goto()`'s closing brace.

- [ ] **Step 3: Delete the ModalPage method**

In `tests/pages/ModalPage.js`, find:
```js
  /** Wait for initial scroll-in animations to settle */
  async waitForScrollAnimations() {
    await this.page.waitForTimeout(700);
  }
}
```

Delete the comment + method, leaving only the closing `}` of the class:
```js
}
```

- [ ] **Step 4: Delete the FormPage method**

In `tests/pages/FormPage.js`, find:
```js
  async waitForScrollAnimations() {
    // Wait for scroll-in animations to settle (prevents false axe failures)
    await this.page.waitForTimeout(700);
  }
}
```

Delete the method, leaving only the closing `}` of the class:
```js
}
```

- [ ] **Step 5: Lint**

Run: `npm run lint`

Expected: PASS. No "unused method" warnings (these methods are public and weren't called from inside the POMs). No unused imports.

- [ ] **Step 6: Run full Playwright suite to confirm nothing else relied on these methods**

Run: `npx playwright test --project=chromium`

Expected: ALL tests PASS. (Full suite. If any non-axe-scan spec was secretly calling `fp.waitForScrollAnimations()` or similar, it will fail here and we'll know to migrate.)

- [ ] **Step 7: Cross-browser full-suite**

Run: `npx playwright test --project=firefox`
Run: `npx playwright test --project=webkit`

Expected: ALL tests PASS on both.

- [ ] **Step 8: Commit**

```bash
git add tests/pages/FilterPage.js tests/pages/ModalPage.js tests/pages/FormPage.js
git commit -m "refactor: Remove duplicated waitForScrollAnimations POM methods

All 17 call sites now use waitForScrollAnimations(page) from
tests/utils/timing.js. The POM-attached versions (3 identical
copies) are no longer referenced and are removed."
```

---

## Task 6: Final cross-browser repeat-each stress verification

**Why:** The whole point of this change is flake reduction. Reusing the `--repeat-each=5` bar from PR #62 (which validated `waitForAnimationComplete()`) confirms the new helper actually reduces flakiness rather than just shifting it.

- [ ] **Step 1: Run the three migrated axe-scan suites under repeat-each=5 (Chromium)**

Run: `npx playwright test tests/filter/axe-scan.spec.js tests/modal/axe-scan.spec.js tests/form/axe-scan.spec.js --project=chromium --repeat-each=5`

Expected: 100% PASS.

- [ ] **Step 2: Same under Firefox**

Run: `npx playwright test tests/filter/axe-scan.spec.js tests/modal/axe-scan.spec.js tests/form/axe-scan.spec.js --project=firefox --repeat-each=5`

Expected: 100% PASS. (Firefox was historically the most flake-prone engine for filter timing; clean repeat-each here is the strongest signal of success.)

- [ ] **Step 3: Same under WebKit**

Run: `npx playwright test tests/filter/axe-scan.spec.js tests/modal/axe-scan.spec.js tests/form/axe-scan.spec.js --project=webkit --repeat-each=5`

Expected: 100% PASS.

- [ ] **Step 4: Confirm zero changes to production code**

Run: `git diff main -- js/ css/ index.html 404.html data/`

Expected: empty output (no production-asset diffs).

- [ ] **Step 5: Confirm POM duplication is gone**

Run: `grep -rn "waitForScrollAnimations" tests/pages/`

Expected: no matches.

Run: `grep -c "waitForScrollAnimations" tests/utils/timing.js`

Expected: at least 2 (function definition line + JSDoc reference).

- [ ] **Step 6: Lint final**

Run: `npm run lint`

Expected: PASS.

- [ ] **Step 7: Build smoke**

Run: `npm run build`

Expected: PASS. (Doesn't touch test files but confirms the broader pipeline is healthy.)

- [ ] **Step 8: No commit needed for Task 6**

This task is verification only. If any step fails, stop and diagnose — do not paper over with retries or `--retries=3` flags. The whole point is determinism.

---

## Self-review checklist (run BEFORE handing off)

After all tasks pass:
- [ ] Spec acceptance criteria satisfied (8 items in spec under "Acceptance criteria").
- [ ] `git log challenge/scroll-animation-deterministic-polling ^main` shows 5 commits + 1 doc commit (the spec from brainstorming), no fixup commits.
- [ ] No `it.only`, `test.only`, `test.skip`, or `console.log` left in modified files.
- [ ] Branch is ahead of `main` and ready for `gh pr create`.
