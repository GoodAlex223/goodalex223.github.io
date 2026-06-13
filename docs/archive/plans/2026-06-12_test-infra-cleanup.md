# Test Infrastructure Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the remaining fixed-timeout smells in the Playwright test infra (ModalPage 300ms, url-hash 2×500ms), add automated guards for the timing.js↔production observer contract, and tie off PR #71 lineage/consistency debt.

**Architecture:** All polling primitives live in `tests/utils/timing.js` (existing pattern). A new generic `waitForOpacity(locator)` replaces fixed waits in `ModalPage`. The production IntersectionObserver config is mirrored by two exported constants, pinned by a new guard spec (`tests/utils/timing-guards.spec.js`) that captures the runtime constructor options via `addInitScript` — viable against the terser-minified `dist/` build the tests actually run.

**Tech Stack:** Playwright (`@playwright/test`), three browser projects (chromium/firefox/webkit), test server `scripts/serve.js` on port 4173 (auto-started by Playwright `webServer`; locally it runs `npm run build` first — first run is slow, then the server is reused).

**Spec:** `docs/archive/specs/2026-06-12_test-infra-cleanup-design.md` (commit fa3df6e). Branch: `test/infra-cleanup`.

**Worker context you need:**
- Tests run against the BUILT site (minified `dist/main.[hash].js`), not raw `js/main.js`.
- `npm run lint:js` lints tests under a Playwright ESM environment.
- Commit via the Bash tool using the heredoc form below — PowerShell `@'...'@` here-strings corrupt commit messages (known gotcha):

```bash
git commit -F - <<'EOF'
type: Subject line (max 72 chars)

Optional body.

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
EOF
```

---

## File Structure

| File | Action | Responsibility |
|------|--------|----------------|
| `tests/utils/timing.js` | Modify | All DOM-polling wait primitives + the exported observer mirror constants |
| `tests/utils/timing-guards.spec.js` | Create | Pins the two timing.js contracts (observer config mirror; filter-hidden class-skip) |
| `tests/pages/ModalPage.js` | Modify | Consume `waitForOpacity` in `expectOpen()` and `clickCard()` |
| `tests/modal/axe-scan.spec.js` | Modify | Reduced-motion `beforeEach` consistency call |
| `tests/form/axe-scan.spec.js` | Modify | Reduced-motion test-body consistency call |
| `tests/filter/axe-scan.spec.js` | Modify | Consistency call after reduced-motion `clickFilter()` |
| `tests/filter/reduced-motion.spec.js` | Modify | Same + new import |
| `tests/modal/url-hash.spec.js` | Modify | Deterministic waits in the two negative tests |
| `docs/planning/BACKLOG.md` | Modify | Mark 6 drained 🟤 items; add focus-gap entry (if probe confirms) |
| `docs/planning/WEEKLY.md` | Modify | Tick Group D checkboxes + summary row |

---

### Task 0: Preflight

**Files:** none

- [ ] **Step 0.1: Confirm branch and baseline**

Run:
```bash
git branch --show-current && git log --oneline -2 && npx playwright --version
```
Expected: branch `test/infra-cleanup`; top commit `fa3df6e docs(spec): Add Group D test-infra-cleanup design spec`; a Playwright version prints. Pre-existing unrelated working-tree changes (`.claude/settings.json`, untracked `.claude/auto-memory/*`) are expected — leave them unstaged in every commit.

---

### Task 1: Remove unused timing.js functions

**Files:**
- Modify: `tests/utils/timing.js:1-37`

- [ ] **Step 1.1: Verify zero callers (safety check)**

Run:
```bash
grep -rn "getAnimationDuration\|getStaggerDelay" tests/ js/ scripts/
```
Expected: matches ONLY in `tests/utils/timing.js` (the definitions themselves). If any other file matches, STOP — the BACKLOG claim is stale; report instead of deleting.

- [ ] **Step 1.2: Delete both functions and fix the file header**

In `tests/utils/timing.js`, replace lines 1-37 (the header comment through the end of `getStaggerDelay`) so the file starts:

```js
/**
 * Animation timing utilities for Playwright tests.
 */
import { expect } from "@playwright/test";


/**
 * Wait for the filter animation cycle to complete by polling DOM state.
```

(i.e. delete `getAnimationDuration` and `getStaggerDelay` entirely, and drop the header's "Reads durations from CSS custom properties (single source of truth)." line — nothing reads CSS custom properties after this deletion. `waitForAnimationComplete` and everything below stays untouched.)

- [ ] **Step 1.3: Lint**

Run: `npm run lint:js`
Expected: exit 0, no errors.

- [ ] **Step 1.4: Commit**

```bash
git add tests/utils/timing.js
git commit -F - <<'EOF'
test: Remove unused getAnimationDuration/getStaggerDelay helpers

Only consumer was waitForFilterAnimation(), removed in the Firefox &
Test Audit (PR #62). Zero callers remain (verified by grep). Drains
BACKLOG item "Remove unused getAnimationDuration() and getStaggerDelay()".

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
EOF
```

---

### Task 2: Export observer mirror constants + refactor waitForScrollAnimations

**Files:**
- Modify: `tests/utils/timing.js`

- [ ] **Step 2.1: Add the exported constants**

Insert between the `import` line and the `waitForAnimationComplete` JSDoc:

```js
/**
 * Mirror of the production IntersectionObserver config (js/main.js:585-586).
 * Single source for the scroll-animation drift contract:
 * waitForScrollAnimations() passes these into its page.evaluate, and
 * tests/utils/timing-guards.spec.js asserts they match the options object
 * the production page actually constructs at runtime. If either side
 * changes, the guard fails and both sides get updated together.
 */
export const SCROLL_OBSERVER_THRESHOLD = 0.1; // mirrors threshold: 0.1
export const SCROLL_OBSERVER_ROOT_MARGIN_BOTTOM = 50; // mirrors rootMargin "0px 0px -50px 0px"
```

(The guard spec referenced here is created in Task 3 — same PR, one task later.)

- [ ] **Step 2.2: Update the waitForScrollAnimations JSDoc**

Two JSDoc edits:

(a) Replace the second JSDoc line
`* Replaces the fixed-timeout waitForScrollAnimations() POM methods.`
with the stagger-budget lineage (BACKLOG nit, PR #71 review):

```js
 * Replaces the fixed-timeout waitForScrollAnimations() POM methods
 * (700ms = max hero stagger 150ms + 400ms opacity transition = 550ms
 * + buffer); polling subsumes that budget by observing completion
 * directly instead of estimating it.
```

(b) No other JSDoc paragraphs change.

- [ ] **Step 2.3: Refactor the evaluate body to consume the exported constants**

Replace the entire `await expect.poll(...)` block of `waitForScrollAnimations` (everything after the `if (reducedMotion) return;` line) with:

```js
  await expect
    .poll(
      async () =>
        page.evaluate(
          ({ threshold, rootMarginBottom }) => {
            // Mirror the production observer's trigger condition (see the
            // exported constants above) so the helper only waits on elements
            // the observer would actually fire for. Otherwise an element
            // that's geometrically in the viewport but below the threshold
            // (e.g., 8% visible after a focus-driven scroll on WebKit)
            // holds the poll open until the safety-net timeout.
            const effectiveBottom = window.innerHeight - rootMarginBottom;
            const elements = document.querySelectorAll("[data-animate]");
            for (const el of elements) {
              // Skip cards hidden by the filter system (position:absolute,
              // visibility:hidden — getBoundingClientRect returns a non-zero rect)
              if (el.classList.contains("project-card--hidden")) continue;
              const r = el.getBoundingClientRect();
              if (r.height === 0 || r.width === 0) continue;
              const visibleHeight = Math.max(
                0,
                Math.min(r.bottom, effectiveBottom) - Math.max(r.top, 0),
              );
              if (visibleHeight / r.height >= threshold) {
                const opacity = parseFloat(getComputedStyle(el).opacity);
                if (opacity < 1) return false;
              }
            }
            return true;
          },
          {
            threshold: SCROLL_OBSERVER_THRESHOLD,
            rootMarginBottom: SCROLL_OBSERVER_ROOT_MARGIN_BOTTOM,
          },
        ),
      { timeout },
    )
    .toBe(true);
```

Key deltas from the old body: the `const ROOT_MARGIN_BOTTOM = 50;` / `const THRESHOLD = 0.1;` in-closure declarations and the `DRIFT RISK: … no automated guard` comment are GONE — the constants now arrive as the evaluate argument, and drift is guarded by the spec file (Task 3).

- [ ] **Step 2.4: Verify the helper still works**

Run: `npx playwright test tests/filter/axe-scan.spec.js --project=chromium`
Expected: all tests PASS (this suite calls `waitForScrollAnimations` in every test). First local run builds the site first — allow a couple of minutes.

- [ ] **Step 2.5: Lint + commit**

Run: `npm run lint:js` — expected exit 0. Then:

```bash
git add tests/utils/timing.js
git commit -F - <<'EOF'
test: Export scroll-observer mirror constants from timing.js

SCROLL_OBSERVER_THRESHOLD / SCROLL_OBSERVER_ROOT_MARGIN_BOTTOM are now
module exports passed into the page.evaluate as an argument instead of
being re-declared inside the browser-side closure. Single-sources the
js/main.js observer contract so the Task-3 guard test can import the
same values. Also restores the lost FilterPage stagger-budget rationale
(700ms = 150ms stagger + 400ms transition + buffer) to the JSDoc.

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
EOF
```

---

### Task 3: Guard test — production observer config matches mirror constants

**Files:**
- Create: `tests/utils/timing-guards.spec.js`

- [ ] **Step 3.1: Create the spec file with the guard test**

Create `tests/utils/timing-guards.spec.js`:

```js
/**
 * Guard tests for the contracts in tests/utils/timing.js.
 *
 * These pin behavior that production code cannot enforce by import:
 * the mirror constants must equal the IntersectionObserver config the
 * page actually constructs, and waitForScrollAnimations must keep
 * skipping filter-hidden cards (which hold opacity 0 forever).
 */
import { test, expect } from "@playwright/test";
import { FilterPage } from "../pages/FilterPage.js";
import {
  SCROLL_OBSERVER_THRESHOLD,
  SCROLL_OBSERVER_ROOT_MARGIN_BOTTOM,
  waitForScrollAnimations,
} from "./timing.js";

test.describe("timing.js contract guards", () => {
  test("production IntersectionObserver config matches the mirror constants", async ({
    page,
  }) => {
    // Capture constructor options before any page JS runs. Intercepting the
    // runtime call (not parsing source) works against the terser-minified
    // dist/ build that the test server actually serves.
    await page.addInitScript(() => {
      window.__ioConfigs = [];
      const OriginalIO = window.IntersectionObserver;
      window.IntersectionObserver = class extends OriginalIO {
        constructor(callback, options) {
          super(callback, options);
          window.__ioConfigs.push(options);
        }
      };
    });

    // No reduced-motion emulation here: production skips observer setup
    // entirely under reduced motion (js/main.js initScrollAnimations
    // early-exit), so there would be nothing to capture.
    await page.goto("/");
    // JS-init signal — same condition the POMs' goto() waits on.
    await expect(page.locator(".filter-btn").first()).toContainText("(");
    // The observer is constructed inside a double requestAnimationFrame
    // after init, so capture is asynchronous — poll for it.
    await expect
      .poll(() => page.evaluate(() => window.__ioConfigs.length), {
        timeout: 5000,
      })
      .toBeGreaterThan(0);

    const configs = await page.evaluate(() => window.__ioConfigs);
    // Exactly one observer exists today. If this fails with 2+, someone
    // added another IntersectionObserver — decide which config the
    // timing.js helper mirrors and update this guard deliberately.
    expect(configs).toHaveLength(1);
    expect(configs[0].threshold).toBe(SCROLL_OBSERVER_THRESHOLD);
    expect(configs[0].rootMargin).toBe(
      `0px 0px -${SCROLL_OBSERVER_ROOT_MARGIN_BOTTOM}px 0px`,
    );
  });
});
```

- [ ] **Step 3.2: Run it — expect PASS (guard pins current correct state)**

Run: `npx playwright test tests/utils/timing-guards.spec.js`
Expected: 3 passed (one per browser project).

- [ ] **Step 3.3: Test the test (mutation check)**

In `tests/utils/timing.js`, temporarily change `SCROLL_OBSERVER_THRESHOLD = 0.1` to `= 0.2`.
Run: `npx playwright test tests/utils/timing-guards.spec.js --project=chromium`
Expected: 1 FAILED — `expect(configs[0].threshold).toBe(...)` reports `Expected: 0.2, Received: 0.1`.
Revert the constant to `0.1`. Re-run the same command. Expected: 1 passed.

- [ ] **Step 3.4: Lint + commit**

Run: `npm run lint:js` — expected exit 0. Then:

```bash
git add tests/utils/timing-guards.spec.js
git commit -F - <<'EOF'
test: Add observer-config guard for timing.js mirror constants

addInitScript wraps window.IntersectionObserver, records constructor
options, and the test asserts exactly one observer is created with
threshold/rootMargin equal to the constants timing.js exports. Closes
the documented DRIFT RISK (silent divergence from js/main.js:585-586).
Mutation-checked: changing the constant to 0.2 fails the test.

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
EOF
```

---

### Task 4: Regression test — waitForScrollAnimations with filter-hidden cards

**Files:**
- Modify: `tests/utils/timing-guards.spec.js`

- [ ] **Step 4.1: Append the regression test**

Inside the existing `test.describe("timing.js contract guards", () => { ... })` block, after the observer-config test, add:

```js
  test("waitForScrollAnimations resolves while filter-hidden cards are present", async ({
    page,
  }) => {
    const fp = new FilterPage(page);
    await fp.goto();
    // Hides 5 of 8 cards; clickFilter bundles waitForAnimationComplete.
    await fp.clickFilter("iot");
    await page.locator(".projects__grid").scrollIntoViewIfNeeded();

    // Precondition: at least one filter-hidden card overlaps the observer's
    // effective viewport by >= threshold AND is still un-animated
    // (opacity < 1). That is exactly the hang condition this test guards:
    // hidden cards never receive .is-visible (the observer skips them), so
    // without the class-skip in waitForScrollAnimations the poll would wait
    // on their opacity forever. If layout changes ever void this setup, the
    // test fails HERE (loudly) instead of silently passing.
    const hangCandidates = await page.evaluate(
      ({ threshold, rootMarginBottom }) => {
        const effectiveBottom = window.innerHeight - rootMarginBottom;
        const hidden = document.querySelectorAll(
          ".project-card--hidden[data-animate]",
        );
        let count = 0;
        for (const el of hidden) {
          const r = el.getBoundingClientRect();
          if (r.height === 0 || r.width === 0) continue;
          const visibleHeight = Math.max(
            0,
            Math.min(r.bottom, effectiveBottom) - Math.max(r.top, 0),
          );
          if (
            visibleHeight / r.height >= threshold &&
            parseFloat(getComputedStyle(el).opacity) < 1
          ) {
            count += 1;
          }
        }
        return count;
      },
      {
        threshold: SCROLL_OBSERVER_THRESHOLD,
        rootMarginBottom: SCROLL_OBSERVER_ROOT_MARGIN_BOTTOM,
      },
    );
    expect(hangCandidates).toBeGreaterThan(0);

    // Resolving without hitting the poll timeout IS the assertion.
    await waitForScrollAnimations(page);
  });
```

- [ ] **Step 4.2: Run it — expect PASS**

Run: `npx playwright test tests/utils/timing-guards.spec.js`
Expected: 6 passed (2 tests × 3 browsers).

If the precondition assert fails (`hangCandidates` = 0): the viewport/layout left no un-animated hidden card in view. Fix by removing the `scrollIntoViewIfNeeded` line first (the clickFilter auto-scroll position may already be correct), re-run; if still 0, investigate which cards are hidden+in-viewport via the evaluate before changing the approach. Do NOT delete the precondition.

- [ ] **Step 4.3: Test the test (mutation check)**

In `tests/utils/timing.js`, temporarily comment out the class-skip line in the evaluate body:

```js
            // if (el.classList.contains("project-card--hidden")) continue;
```

Run: `npx playwright test tests/utils/timing-guards.spec.js --project=chromium --grep "filter-hidden"`
Expected: 1 FAILED — the `expect.poll` inside `waitForScrollAnimations` times out after ~5s (`Timed out 5000ms waiting for expect(received).toBe(expected)`).
Revert the comment. Re-run the same command. Expected: 1 passed.

- [ ] **Step 4.4: Commit**

```bash
git add tests/utils/timing-guards.spec.js
git commit -F - <<'EOF'
test: Add filter-hidden regression test for waitForScrollAnimations

Applies the iot filter, asserts as a precondition that at least one
hidden card overlaps the effective viewport while still at opacity < 1
(the exact hang condition), then requires the helper to resolve. Guards
the class-skip behavior added in PR #71 Task 2. Mutation-checked:
removing the skip makes the helper time out and the test fail.

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
EOF
```

---

### Task 5: waitForOpacity helper + ModalPage refactor

**Files:**
- Modify: `tests/utils/timing.js` (append new export)
- Modify: `tests/pages/ModalPage.js:1-5` (import), `:60-78` (clickCard), `:112-119` (expectOpen)

- [ ] **Step 5.1: Add waitForOpacity to timing.js**

Append at the end of `tests/utils/timing.js`:

```js
/**
 * Wait for an element to be fully painted (computed opacity 1) by polling.
 *
 * Replaces fixed-timeout waits after opacity transitions. The failure mode
 * a fixed wait papered over: axe-core sampling mid-transition computes text
 * colors from the element's partial opacity, producing false color-contrast
 * failures (the documented reason ModalPage.expectOpen previously waited a
 * fixed 300ms for the modal's 250ms transition).
 *
 * No reduced-motion branch is needed: under prefers-reduced-motion the
 * relevant transitions are disabled (e.g. css/modal.css sets
 * transition: none on .project-modal), so opacity computes to 1 the moment
 * the state class is applied and the first poll tick passes.
 *
 * @param {import('@playwright/test').Locator} locator
 * @param {{ timeout?: number }} [options]
 */
export async function waitForOpacity(locator, { timeout = 5000 } = {}) {
  await expect
    .poll(() => locator.evaluate((el) => getComputedStyle(el).opacity), {
      timeout,
    })
    .toBe("1");
}
```

- [ ] **Step 5.2: Wire it into ModalPage**

In `tests/pages/ModalPage.js`:

(a) Add the import after the `@playwright/test` import (line 5):

```js
import { expect } from "@playwright/test";
import { waitForOpacity } from "../utils/timing.js";
```

(b) Replace `clickCard` (currently lines 61-78) with:

```js
  /** Click a project card body (avoiding links) to open modal */
  async clickCard(projectId) {
    const card = this.page.locator(`[data-project="${projectId}"]`);
    const title = card.locator(".project-card__title");
    // Scroll into view to trigger IntersectionObserver, then wait for card
    // to reach full opacity before clicking. Without this, Firefox clicks
    // at opacity:0 (before scroll animation completes) and the click handler
    // doesn't reliably fire. Polling computed opacity (not .is-visible class)
    // works for both normal mode (opacity via transition) and reduced-motion
    // mode (opacity via CSS override, no .is-visible needed).
    await title.scrollIntoViewIfNeeded();
    await waitForOpacity(card);
    await title.click();
    await this.expectOpen();
  }
```

(c) Replace `expectOpen` (currently lines 112-119) with:

```js
  async expectOpen() {
    await expect(this.modal).toHaveClass(/project-modal--open/);
    await expect(this.modal).not.toHaveAttribute("hidden", "");
    // Wait for the modal opacity transition (250ms) to complete by polling
    // computed opacity. Without this, axe-core scans mid-transition and
    // computes reduced text colors from the parent's partial opacity,
    // causing false contrast failures. Polling (vs. the old fixed 300ms)
    // is immune to browser timing variance.
    await waitForOpacity(this.modal);
  }
```

The `setTheme` 400ms wait at line ~225 stays — documented WebKit style-settle pattern, explicitly out of scope.

- [ ] **Step 5.3: Run the full modal suite on chromium**

Run: `npx playwright test tests/modal --project=chromium`
Expected: all PASS (every modal spec exercises `clickCard`/`expectOpen`; the reduced-motion spec exercises the instant-opacity path).

- [ ] **Step 5.4: Cross-browser spot check (the flake-sensitive engines)**

Run: `npx playwright test tests/modal --project=firefox --project=webkit`
Expected: all PASS.

- [ ] **Step 5.5: Lint + commit**

Run: `npm run lint:js` — expected exit 0. Then:

```bash
git add tests/utils/timing.js tests/pages/ModalPage.js
git commit -F - <<'EOF'
test: Replace ModalPage fixed 300ms wait with waitForOpacity polling

New generic waitForOpacity(locator) in timing.js polls computed opacity
to 1. expectOpen() uses it on the modal (250ms transition; was a fixed
300ms), and clickCard()'s hand-rolled opacity poll collapses into the
same helper. One primitive, both duplications gone; no reduced-motion
branch needed since transition:none yields opacity 1 on the first tick.

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
EOF
```

---

### Task 6: Reduced-motion consistency additions (4 one-line call sites)

**Files:**
- Modify: `tests/modal/axe-scan.spec.js:65-69`
- Modify: `tests/form/axe-scan.spec.js:55-59`
- Modify: `tests/filter/axe-scan.spec.js:121-128`
- Modify: `tests/filter/reduced-motion.spec.js:1-3, 73-82`

All four calls are runtime no-ops (reduced-motion short-circuit in `waitForScrollAnimations`); the value is structural uniformity — every suite's reduced-motion path mirrors its normal-motion path. Decision recorded in the spec: ADD the call (not comment the omission).

- [ ] **Step 6.1: modal/axe-scan.spec.js — reduced-motion beforeEach**

Replace (current lines 65-69):

```js
  test.describe("Reduced motion", () => {
    test.beforeEach(async () => {
      await mp.enableReducedMotion();
      await mp.goto();
    });
```

with:

```js
  test.describe("Reduced motion", () => {
    test.beforeEach(async ({ page }) => {
      await mp.enableReducedMotion();
      await mp.goto();
      await waitForScrollAnimations(page);
    });
```

(`waitForScrollAnimations` is already imported in this file, line 4.)

- [ ] **Step 6.2: form/axe-scan.spec.js — reduced-motion test body**

Replace (current lines 55-59):

```js
  test("passes axe scan with reduced motion", async ({ page }) => {
    await fp.enableReducedMotion();
    await fp.goto();
    await checkAccessibility(page);
  });
```

with:

```js
  test("passes axe scan with reduced motion", async ({ page }) => {
    await fp.enableReducedMotion();
    await fp.goto();
    await waitForScrollAnimations(page);
    await checkAccessibility(page);
  });
```

(already imported, line 4.)

- [ ] **Step 6.3: filter/axe-scan.spec.js — after reduced-motion clickFilter**

In the `Reduced motion` describe's "active filter passes WCAG 2.1 AA" test (current lines 121-128), add the call between `clickFilter` and the WebKit comment:

```js
    test("active filter passes WCAG 2.1 AA", async ({ page }) => {
      await fp.clickFilter("iot");
      await waitForScrollAnimations(page);
      // WebKit-Linux race: after `--active` class swap, axe color-contrast
      // briefly samples interpolated colors between the two affected buttons.
      // setTheme() pins data-theme + waits 400ms, letting style computation settle.
      await fp.setTheme("light");
      await checkAccessibility(page);
    });
```

(matches the light/dark sibling describes' clickFilter → waitForScrollAnimations → axe ordering; already imported, line 4.)

- [ ] **Step 6.4: filter/reduced-motion.spec.js — same edit + import**

(a) Add the import after line 3 (`axe-helper` import):

```js
import { checkAccessibility } from "../utils/axe-helper.js";
import { waitForScrollAnimations } from "../utils/timing.js";
```

(b) In "active filter passes WCAG 2.1 AA with reduced motion" (current lines 73-82), add the call after `clickFilter`:

```js
  test("active filter passes WCAG 2.1 AA with reduced motion", async ({
    page,
  }) => {
    await fp.clickFilter("iot");
    await waitForScrollAnimations(page);
    // WebKit-Linux race: after `--active` class swap, axe color-contrast
    // briefly samples interpolated colors between the two affected buttons.
    // setTheme() pins data-theme + waits 400ms, letting style computation settle.
    await fp.setTheme("light");
    await checkAccessibility(page);
  });
```

- [ ] **Step 6.5: Run the four touched suites on chromium**

Run: `npx playwright test tests/modal/axe-scan.spec.js tests/form/axe-scan.spec.js tests/filter/axe-scan.spec.js tests/filter/reduced-motion.spec.js --project=chromium`
Expected: all PASS.

- [ ] **Step 6.6: Lint + commit**

Run: `npm run lint:js` — expected exit 0. Then:

```bash
git add tests/modal/axe-scan.spec.js tests/form/axe-scan.spec.js tests/filter/axe-scan.spec.js tests/filter/reduced-motion.spec.js
git commit -F - <<'EOF'
test: Align reduced-motion suites with waitForScrollAnimations calls

Adds the call to the modal + form reduced-motion setups and after the
two reduced-motion clickFilter() sites in the filter suites. All four
are free no-ops (reduced-motion short-circuit); every suite's
reduced-motion path now structurally mirrors its normal-motion path.
Supersedes the planned comment-the-omission nit (add-the-call decision
recorded in the design spec).

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
EOF
```

---

### Task 7: Deterministic waits in url-hash negative tests

**Files:**
- Modify: `tests/modal/url-hash.spec.js:1-2, 39-52`

- [ ] **Step 7.1: Update imports**

Replace lines 1-2:

```js
import { test, expect } from "@playwright/test";
import { ModalPage } from "../pages/ModalPage.js";
import { waitForAnimationComplete } from "../utils/timing.js";
```

(`expect` is new — needed for the JS-init signal waits below.)

- [ ] **Step 7.2: Rewrite the two negative tests**

Replace (current lines 39-52):

```js
  test("does not open modal for invalid project hash", async ({ page }) => {
    await page.goto("/#project=nonexistent");
    // Wait for JS to initialize
    const mp2 = new ModalPage(page);
    await page.waitForTimeout(500);
    await mp2.expectClosed();
  });

  test("does not interfere with filter hash", async ({ page }) => {
    await page.goto("/#filter=backend");
    const mp2 = new ModalPage(page);
    await page.waitForTimeout(500);
    await mp2.expectClosed();
  });
```

with:

```js
  test("does not open modal for invalid project hash", async ({ page }) => {
    // The hash-open path fetches projects.json even for invalid IDs — the
    // ID is validated only AFTER the fetch (js/main.js fetches, then checks
    // data[projectId]). Waiting for that response to finish replaces the
    // old fixed 500ms with the actual causal chain: once the fetch is done
    // and init has completed, a modal that was going to open would be open.
    const responsePromise = page.waitForResponse((resp) =>
      resp.url().includes("data/projects.json"),
    );
    await page.goto("/#project=nonexistent");
    const response = await responsePromise;
    await response.finished();
    const mp2 = new ModalPage(page);
    // JS-init signal: filter button labels include counts once init completes.
    await expect(page.locator(".filter-btn").first()).toContainText("(");
    await mp2.expectClosed();
  });

  test("does not interfere with filter hash", async ({ page }) => {
    // No modal code runs for #filter= hashes (no projects.json fetch to
    // await). Wait for JS init, then for the hash-applied filter's
    // animation cycle (passes immediately if the initial application
    // doesn't animate), then assert the modal stayed closed.
    await page.goto("/#filter=backend");
    const mp2 = new ModalPage(page);
    await expect(page.locator(".filter-btn").first()).toContainText("(");
    await waitForAnimationComplete(page);
    await mp2.expectClosed();
  });
```

- [ ] **Step 7.3: Run the file on all three browsers**

Run: `npx playwright test tests/modal/url-hash.spec.js`
Expected: all PASS across chromium/firefox/webkit (8 tests × 3).

- [ ] **Step 7.4: Lint + commit**

Run: `npm run lint:js` — expected exit 0. Then:

```bash
git add tests/modal/url-hash.spec.js
git commit -F - <<'EOF'
test: Make url-hash negative tests deterministic (drop 500ms waits)

Invalid-hash test now awaits the projects.json response (registered
before goto — the hash path fetches before validating the ID) plus the
JS-init signal; filter-hash test awaits the init signal plus
waitForAnimationComplete. Faster than the blind 500ms and not vacuous
on a slow CI run where the fetch could outlive the old fixed wait.

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
EOF
```

---

### Task 8: Focus-gap probe + planning-doc bookkeeping

**Files:**
- Create (TEMPORARY, never committed): `tests/modal/zz-focus-gap-probe.spec.js`
- Modify: `docs/planning/BACKLOG.md`
- Modify: `docs/planning/WEEKLY.md`

- [ ] **Step 8.1: Write the throwaway probe**

Create `tests/modal/zz-focus-gap-probe.spec.js`:

```js
// TEMPORARY probe — DO NOT COMMIT. Verifies the suspected reduced-motion
// focus gap: css/modal.css sets transition:none under reduced motion, so
// the transitionend listener (js/main.js:886) that focuses the close
// button should never fire.
import { test, expect } from "@playwright/test";
import { ModalPage } from "../pages/ModalPage.js";

test("PROBE: close button focused after reduced-motion open", async ({
  page,
}) => {
  const mp = new ModalPage(page);
  await mp.enableReducedMotion();
  await mp.goto();
  await mp.clickCard("rating-bot");
  await expect(mp.closeButton).toBeFocused({ timeout: 3000 });
});
```

- [ ] **Step 8.2: Run the probe on two engines**

Run: `npx playwright test tests/modal/zz-focus-gap-probe.spec.js --project=chromium --project=firefox`
Expected (if the gap is real): 2 FAILED — `toBeFocused` times out; focus never reaches `[data-modal-close]`.
Record the actual outcome verbatim for the BACKLOG entry wording.

- [ ] **Step 8.3: Delete the probe**

Run: `rm tests/modal/zz-focus-gap-probe.spec.js`
Then `git status` — confirm it is gone and nothing else is unexpectedly staged.

- [ ] **Step 8.4: BACKLOG.md — file the focus gap (ONLY if Step 8.2 FAILED as predicted)**

In `docs/planning/BACKLOG.md`, find the first `### From` heading inside the 🟤 Auto-Generated section (currently `### From PR #73 Code Review (2026-06-11)`) and insert ABOVE it:

```markdown
### From Group D Test Infra Cleanup (2026-06-12)
**Origin**: docs/archive/plans/2026-06-12_test-infra-cleanup.md

- [ ] **Reduced-motion modal never moves focus to the close button** — under `prefers-reduced-motion: reduce`, `css/modal.css` (lines 424-428) sets `transition: none` on `.project-modal`, so the `transitionend` listener that focuses the close button (`js/main.js:886-894`, filters `propertyName === "visibility"`) never fires — keyboard focus stays outside the dialog when the modal opens. Verified empirically during Group D: a probe `toBeFocused` on `[data-modal-close]` timed out under reduced motion on Chromium + Firefox. Fix sketch: in `openModal()`, branch on `matchMedia("(prefers-reduced-motion: reduce)")` and focus synchronously (or via rAF) instead of waiting for `transitionend`. Production a11y gap (WCAG 2.4.3 focus order); deliberately not fixed in the Group D test-infra PR (scope decision in the design spec §3.6/§5). (Group D brainstorming discovery, confidence 70, production a11y)
```

If the probe PASSED instead (gap not real): do NOT add this entry; instead append a one-line note to this plan's Step 8.2 checkbox recording the pass, and mention it in the final report.

- [ ] **Step 8.5: BACKLOG.md — mark the 6 drained items done**

Mark each `- [ ]` → `- [x]` and append ` **[DONE 2026-06-12, Group D PR]**` at the end of the entry text. Locate each by its unique opening phrase:

1. `Preserve the deleted FilterPage stagger-budget rationale` (section *From PR #71 Post-Merge Review (2026-05-24)*)
2. `Automated guard for the helper's observer-mirrored constants` (section *From Scroll Animation Deterministic Polling (2026-05-17)*)
3. `Polling helper for modal-open state` (same section)
4. `Add \`waitForScrollAnimations(page)\` to form and modal reduced-motion` (same section)
5. `Targeted regression test for \`waitForScrollAnimations(page)\` after filter applied` (same section)
6. `Remove unused \`getAnimationDuration()\` and \`getStaggerDelay()\`` (section *From Firefox & Test Audit (2026-04-10)*)

- [ ] **Step 8.6: WEEKLY.md — tick Group D**

(a) In the Tuesday section (lines 78-82), tick all four boxes and append outcome notes:

```markdown
**Group D — Test Infrastructure Cleanup** `[batch]` — 🟤 — 6 SP *(meatiest code; front-loaded)*
- [x] `waitForModalOpen`/`waitForOpacity` polling helper → replace `ModalPage` `waitForTimeout(300)` *(3 SP)* — generic `waitForOpacity(locator)`; also absorbed `clickCard()`'s inline opacity poll
- [x] Automated guard test for observer-mirrored constants *(1 SP)* — runtime capture via `addInitScript`; constants exported from timing.js (single source)
- [x] Add `waitForScrollAnimations` to form + modal reduced-motion `beforeEach` *(1 SP)* — plus the 2 reduced-motion `clickFilter()` sites (add-the-call decision)
- [x] Lineage/cleanup nits (inline comment, stagger-budget JSDoc, remove unused timing fns) *(1 SP)* — inline comment superseded by add-the-call; JSDoc + removals done
- Scope extensions (approved in brainstorming 2026-06-12): url-hash 500ms deterministic waits; BACKLOG-313 filter-hidden regression test. New 🟤 filed: reduced-motion modal focus gap.
```

(Adjust the last sentence if Step 8.4 was skipped.)

(b) In the Summary Table, change the Group D row's Status cell from `⏳ Planned` to `✅ Done`.

- [ ] **Step 8.7: Commit (pre-commit BACKLOG validators will run — expect OK)**

```bash
git add docs/planning/BACKLOG.md docs/planning/WEEKLY.md
git commit -F - <<'EOF'
docs: Record Group D completion in WEEKLY/BACKLOG, file focus gap

Ticks the four Group D checkboxes + summary row, marks the six drained
backlog items done (305/310/311/312/313/410 by former line numbers),
and files the verified reduced-motion modal focus gap as a new
auto-generated entry.

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
EOF
```

Expected hook output: `BACKLOG Origin paths: OK` and the structure check passing.

---

### Task 9: Full validation sweep

**Files:** none (fixes only if failures surface)

- [ ] **Step 9.1: Full lint**

Run: `npm run lint`
Expected: CSS + JS both clean, exit 0.

- [ ] **Step 9.2: Full test matrix**

Run: `npm test`
Expected: 0 failures across chromium/firefox/webkit. Record the per-browser pass counts.

- [ ] **Step 9.3: Flake-confidence repeat run (PR #71 precedent)**

Run:
```bash
npx playwright test tests/utils/timing-guards.spec.js tests/modal tests/filter/axe-scan.spec.js tests/filter/reduced-motion.spec.js tests/form/axe-scan.spec.js --repeat-each=5
```
Expected: 0 failures. This is the long pole (~all touched suites × 5 × 3 browsers) — allow it to run to completion. Record totals.

- [ ] **Step 9.4: Report**

Summarize for the user: tasks completed, test totals from 9.2/9.3, probe outcome (8.2), and that the branch is ready for review/PR. Do NOT push or open a PR — that is a separate user-approved step (project convention).

---

## Out of Scope (do not "fix" these if noticed)

- `setTheme()` 400ms waits in all three POMs — documented WebKit style-settle pattern.
- The 50ms pre-delay in `waitForAnimationComplete` — documented, intentional.
- The reduced-motion focus gap in production JS — BACKLOG entry only (Task 8).
- CLAUDE.md edits — the affected bullets are in AUTO-MANAGED regions; post-merge auto-memory sync handles them.

## Spec Coverage Map

| Spec section | Task |
|---|---|
| §3.1 timing.js (removals, constants, refactor, JSDoc) | 1, 2, 5 |
| §3.2 ModalPage | 5 |
| §3.3 timing-guards.spec.js (both tests) | 3, 4 |
| §3.4 reduced-motion additions | 6 |
| §3.5 url-hash waits | 7 |
| §5 + §6 bookkeeping (probe, BACKLOG, WEEKLY) | 8 |
| §7 validation | per-task steps + 9 |
