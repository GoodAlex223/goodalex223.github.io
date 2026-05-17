# Design: Replace `waitForScrollAnimations()` with Deterministic Polling

**Date**: 2026-05-16
**Status**: Approved (brainstorming complete)
**Source task**: `docs/planning/WEEKLY.md` — Friday Weekly Challenge, 5 SP
**Origin backlog entry**: `docs/archive/plans/2026-04-11_test-robustness.md`
**Branch**: `challenge/scroll-animation-deterministic-polling`

---

## Problem

`waitForScrollAnimations()` is a fixed-700ms timeout helper duplicated across three Playwright Page Object Models:

- `tests/pages/FilterPage.js:53-57`
- `tests/pages/ModalPage.js:228-231`
- `tests/pages/FormPage.js:204-207`

All three implementations are identical: `await this.page.waitForTimeout(700);`. The comment in `FilterPage` explains the magic number: "Hero elements stagger up to 150ms + 400ms transition = 550ms; add buffer."

The helper has three problems:

1. **Fragile across browsers** — Fixed timeouts cannot adapt to system load. Slow CI agents or cold-start browsers occasionally produce false axe-scan color-contrast failures because animations are mid-transition when scanned.
2. **Wasted time under reduced motion** — Under `prefers-reduced-motion: reduce`, `js/main.js:563` never sets up the IntersectionObserver, so `.is-visible` is never added. The 700ms wait is pure dead time in reduced-motion tests (3 axe-scan suites currently affected).
3. **Triplicated** — Three identical method bodies in three POMs; future divergence is possible.

A polling pattern equivalent to `waitForAnimationComplete()` (in `tests/utils/timing.js`, used for filter animations since PR #62) closes out the test-flake reduction theme that has run through the past four sprints.

## Goals

- Replace the 700ms fixed timeout with a DOM-state poll that resolves as soon as in-viewport scroll animations have settled.
- Consolidate into a single utility in `tests/utils/timing.js`, removing the three POM duplicates.
- Short-circuit under `prefers-reduced-motion: reduce` so reduced-motion tests don't pay the 700ms tax.
- Migrate all ~17 call sites in this PR to avoid leaving an inconsistent state.
- Zero production code changes (no edits to `js/main.js`, CSS, or HTML).

## Non-goals

1. Replacing `setTheme()`'s `waitForTimeout(400)` — different concern (CSS transition settling, not animation completion).
2. Changing `getAnimationDuration()` / `getStaggerDelay()` — filter-specific, not used by scroll animations.
3. Modifying `js/main.js` scroll-animation logic — helper observes existing production behavior; no `.is-animating` marker class or custom event needed.
4. Renaming `is-visible` — class name is a CSS concern; helper polls whatever exists.
5. Adding reduced-motion handling to other timing helpers — `waitForAnimationComplete()` doesn't have the same dead-time issue.

## Design

### Helper API and location

Single exported function in `tests/utils/timing.js`, joining the existing utilities.

**Amendment (2026-05-16, post-Task-1 discovery):** Initial vertical-slice validation revealed that polling on `[data-animate]:not(.is-visible)` is insufficient — the `.is-visible` class triggers a 400ms opacity transition (see `css/components.css:449-455`), and axe-core color-contrast sampling mid-transition produces flaky failures on WebKit. The corrected helper polls computed opacity directly, which captures both class addition AND transition completion. Under reduced motion, CSS sets `opacity: 1` unconditionally for `[data-animate]` (line 476-479), so the polling check would also resolve immediately — but the explicit `matchMedia` short-circuit is kept for efficiency and self-documentation.

```js
/**
 * Wait for scroll-in animations to settle by polling DOM state.
 * Replaces fixed-timeout waitForScrollAnimations() POM methods.
 *
 * Resolves when every [data-animate] element currently in the viewport has
 * computed opacity 1 (fully painted). Polling on the .is-visible class alone
 * is insufficient: the class triggers a 400ms opacity transition (see
 * css/components.css:449-455), and axe-core sampling mid-transition produces
 * false color-contrast failures on WebKit. Polling on computed opacity
 * catches both the class addition AND the transition completion. Below-fold
 * elements are skipped — they legitimately have not been observed by
 * IntersectionObserver yet.
 *
 * Short-circuits under prefers-reduced-motion: reduce — js/main.js never
 * sets up the observer in that case, and CSS in the reduced-motion media
 * query applies opacity: 1 unconditionally to [data-animate], so polling
 * would resolve on the first tick anyway. The early return makes the intent
 * explicit and saves a round-trip.
 *
 * Filter-hidden cards (.project-card--hidden) are skipped via an explicit
 * class check matching the observer-side skip in js/main.js:595. The class
 * uses visibility: hidden + position: absolute (not display: none), so
 * getBoundingClientRect returns a non-zero rect — the class check is the
 * canonical signal. The r.width > 0 rect guard remains as defense-in-depth
 * for any future zero-width [data-animate] element.
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
          // Mirror the production IntersectionObserver config in
          // js/main.js:583-587 so the helper only waits on elements the
          // observer would actually fire for.
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

### Call-site syntax migration

Before:
```js
await fp.waitForScrollAnimations();
```

After (matches the existing `waitForAnimationComplete(page)` pattern already imported in `FilterPage.js:61,69`):
```js
import { waitForScrollAnimations } from "../utils/timing.js";
// ...
await waitForScrollAnimations(page);
```

### Files modified

| File | Change |
|------|--------|
| `tests/utils/timing.js` | Add `waitForScrollAnimations(page, { timeout })` export |
| `tests/pages/FilterPage.js` | Delete `waitForScrollAnimations()` method (lines 53-57) |
| `tests/pages/ModalPage.js` | Delete `waitForScrollAnimations()` method (lines 228-231) |
| `tests/pages/FormPage.js` | Delete `waitForScrollAnimations()` method (lines 204-207) |

### Call sites updated (17)

| Spec file | Lines | Change |
|-----------|-------|--------|
| `tests/filter/axe-scan.spec.js` | 12, 21, 27, 33, 39, 46, 57, 65, 85, 101 | `fp.waitForScrollAnimations()` → `waitForScrollAnimations(page)`; add import |
| `tests/modal/axe-scan.spec.js` | 17 | `mp.waitForScrollAnimations()` → `waitForScrollAnimations(page)`; add import |
| `tests/form/axe-scan.spec.js` | 13, 22, 31, 40 | `fp.waitForScrollAnimations()` → `waitForScrollAnimations(page)`; add import |

### Comment-anchored call site

`tests/filter/axe-scan.spec.js:108` currently has:
> `// No waitForScrollAnimations() — animations are disabled under reduced motion.`

With the new helper auto-detecting reduced motion via `matchMedia`, the omission becomes a small optimization rather than a correctness requirement. Decision: **add the call back and remove the comment** for consistency with other axe-scan suites; the short-circuit makes it free.

## Correctness reasoning

Behavior under each material case:

| Case | Resolution |
|------|------------|
| All `[data-animate]` already at opacity 1 (page already settled) | Every in-viewport element passes the `opacity < 1` check → returns `true` on first poll tick. |
| Above-fold element delayed by `data-animate-delay` (e.g., hero last child at 150ms) | Observer fires, schedules `setTimeout(150ms)`. Before the setTimeout: element has `opacity: 0` (initial state) → poll returns `false`. After class added: opacity transitions over 400ms → during this window opacity is < 1 → poll returns `false`. Once transition ends: `opacity === 1` → poll returns `true`. |
| Below-fold elements (bottom project cards on small viewport) | Visible fraction is 0 → fails `>= THRESHOLD` check → skipped → don't block the poll. Correct because IntersectionObserver legitimately hasn't fired for them yet. |
| **Partially visible elements below the observer's threshold** (e.g., `contact__intro` 8% visible after WebKit's focus-driven scroll) | Visible fraction < 0.1 → fails threshold check → skipped. Without this, the helper would hang indefinitely because the observer never fires for sub-threshold elements (Task 4 root cause). |
| Test scrolls before calling helper (e.g., form axe-scan scrolls to form) | `getBoundingClientRect()` reflects post-scroll position → newly in-viewport elements correctly hold the poll. |
| Filtered-out cards (`.project-card--hidden` → `visibility: hidden; position: absolute`) | Explicit `el.classList.contains("project-card--hidden")` check skips them at the top of the loop. The class is the canonical signal — `getBoundingClientRect` returns a non-zero rect for `visibility: hidden`, so the rect guard alone would not catch this case. Matches the same class-based skip in `js/main.js:595`. |
| Reduced motion enabled | Short-circuits before polling. Even without the short-circuit, CSS sets `opacity: 1` unconditionally under reduced motion → poll would resolve on tick 1 anyway. |
| Helper called immediately after `goto()`, observer hasn't fired yet | Poll iterates until observer fires, setTimeouts run, classes added, and transitions complete. Bounded by 5000ms safety net. |
| Modal open with backdrop | Background `[data-animate]` elements still have valid rects. Poll waits for them to settle — correct for axe-scan validity since the backdrop is semi-transparent. |
| **WebKit axe color-contrast sampling during transition** | Poll holds open until full opacity is reached, so axe never samples interpolated mid-transition colors. This is the case that motivated the opacity-based check (discovered during Task 1 vertical-slice validation). |

## Verification plan

### 1. Cross-browser local verification (mandatory pre-commit)

```bash
npx playwright test tests/filter/axe-scan.spec.js --project=chromium
npx playwright test tests/filter/axe-scan.spec.js --project=firefox
npx playwright test tests/filter/axe-scan.spec.js --project=webkit
npx playwright test tests/modal/axe-scan.spec.js
npx playwright test tests/form/axe-scan.spec.js
```

All three browsers green per suite.

### 2. Repeat-each stress test (flake-regression gate)

```bash
npx playwright test tests/filter/axe-scan.spec.js tests/modal/axe-scan.spec.js tests/form/axe-scan.spec.js --repeat-each=5
```

Target: 100% pass. Same bar PR #62 used to validate `waitForAnimationComplete()` for filter animations.

### 3. Timing sanity check (manual, one-off)

Instrument one filter axe-scan test with `console.time`/`console.timeEnd` around the helper call. Run under normal motion and reduced motion.

- Normal motion: ≤ 700ms (typically far less — settles when observer + setTimeouts complete).
- Reduced motion: ≤ ~20ms (single `page.evaluate` round-trip).

Confirms the short-circuit works. Not committed.

### 4. CI pipeline (gates merge)

- `npm run lint` — no new lint errors.
- Full Playwright suite across Chromium/Firefox/WebKit.
- Lighthouse CI ≥90/100 (unaffected by test-only changes, but gate runs anyway).

### 5. Blast-radius confirmation

Helper reads `[data-animate]`, `.is-visible`, and `matchMedia` — all already present in `js/main.js`. Zero changes to production code.

### 6. Rollback story

Revert is purely test-side: restore the 3 POM methods, swap call-site imports back. No data, schema, or CSS to roll back.

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| A `[data-animate]` element legitimately stays in-viewport without `.is-visible` (production bug) | Low — would already be visible to users | 5000ms safety-net causes `expect.poll` to fail loudly, surfacing the bug rather than masking it. |
| `getBoundingClientRect()` cost on 29 elements × N poll ticks | Negligible (microseconds; Playwright's poll cadence is ~100ms) | Not optimizing pre-emptively. |
| `r.width > 0` guard skips a legitimate zero-width element | None today | Documented in helper JSDoc. |
| Test toggles reduced motion mid-session | Helper re-checks every call, so works correctly | No mitigation needed — design already handles it. |
| Cross-browser `matchMedia` divergence under reduced motion | Same query used in `js/main.js:560` for production gating; any divergence would already manifest | No mitigation needed. |
| Scope creep — non-axe-scan call sites surface | Possible if any test outside axe-scan suites uses the POM method | Grep was exhaustive (17 results, all in axe-scan suites). If ≤3 new sites surface mid-implementation, batch them in this PR; otherwise queue follow-up. |

## Out of scope

1. Replacing `setTheme()` `waitForTimeout(400)` — different concern.
2. Changing `getAnimationDuration()` / `getStaggerDelay()` — filter-specific.
3. Modifying `js/main.js` scroll-animation logic — no `.is-animating` class or custom event needed.
4. Renaming `is-visible` — CSS concern.
5. Reduced-motion handling in other helpers — `waitForAnimationComplete()` doesn't have the same dead-time issue.

## Acceptance criteria

- [ ] `tests/utils/timing.js` exports `waitForScrollAnimations(page, { timeout })` matching the API in this spec.
- [ ] All three POM `waitForScrollAnimations()` methods deleted.
- [ ] All 17 call sites migrated to `waitForScrollAnimations(page)` with imports added.
- [ ] `tests/filter/axe-scan.spec.js:108` reduced-motion call restored and stale comment removed.
- [ ] All Playwright suites pass cross-browser (Chromium, Firefox, WebKit).
- [ ] `--repeat-each=5` stress run is 100% green for the three modified spec files.
- [ ] `npm run lint` clean.
- [ ] Zero changes to `js/main.js`, `css/`, or `index.html`.
