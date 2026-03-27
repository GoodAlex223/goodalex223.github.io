# BUG-004: Filter Toggle-to-Reset Race Condition — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the race condition where `currentFilter` is stale during animation, causing toggle-to-reset to misroute clicks on rapid interactions.

**Architecture:** Move `currentFilter = category` from the cleanup timeout (end of animation, ~910ms) to the start of `filterProjects()` (before animation begins). Simplify the `activateFilter` guard and add animation cancellation to `resetFilter()`. Update tests to assert deterministic behavior.

**Tech Stack:** Vanilla JS (no framework), Playwright E2E tests

**Spec:** `docs/archive/specs/2026-03-22_bug-004-filter-race-condition-design.md`

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `js/main.js` | Modify lines 265-466 | Eager `currentFilter` update, guard simplification |
| `tests/filter/rapid-clicks.spec.js` | Modify tests #2 and #3 | Deterministic assertions, DOM polling |
| `tests/filter/toggle-behavior.spec.js` | Add 1 test | Rapid toggle-to-reset during animation |

---

## Task 1: Eager `currentFilter` Update in `filterProjects()`

**Files:**
- Modify: `js/main.js:265-389`

The core fix. Move `currentFilter = category` to the top of `filterProjects()`, consolidating the three existing assignment sites (lines 298, 310, 383) into one.

- [ ] **Step 1: Add `currentFilter = category` at top of `filterProjects()`**

In `js/main.js`, add the eager update right after `cancelFilterAnimations()` (line 271):

```javascript
function filterProjects(category) {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Cancel any pending animations from rapid clicks
    cancelFilterAnimations();

    // Update filter state immediately (before animation) so toggle-to-reset
    // and activateFilter guard always see the intended filter, not stale state
    currentFilter = category;
```

- [ ] **Step 2: Remove redundant `currentFilter` assignments**

Remove `currentFilter = category;` from:
- Line 298 (early return when nothing to animate)
- Line 310 (reduced motion path)
- Line 383 (cleanup timeout)

After removal, the early return block (lines 296-300) becomes:

```javascript
    // Nothing to animate (e.g., clicking the already-active filter)
    if (cardsToHide.length === 0 && cardsToShow.length === 0) {
      return;
    }
```

The reduced motion block (lines 302-313) becomes:

```javascript
    // Skip animations if user prefers reduced motion
    if (prefersReducedMotion) {
      projectCards.forEach((card) => {
        const cardCategory = card.dataset.category;
        const shouldShow = category === "all" || cardCategory === category;
        card.classList.toggle("project-card--hidden", !shouldShow);
      });
      announceFilterResults(category, cardsToShow.length);
      return;
    }
```

The cleanup timeout (lines 374-385) becomes:

```javascript
      const cleanupTimeout = setTimeout(() => {
        cardsToShow.forEach((card) => {
          card.classList.remove("project-card--filtering-in", "is-filtering");
          card.classList.add("is-visible");
        });

        isAnimating = false;
      }, totalEntranceTime);
```

- [ ] **Step 3: Run existing tests to verify no regressions**

Run: `npx playwright test tests/filter/ --reporter=line`
Expected: All tests pass (the either/or test in rapid-clicks still passes since "all" is one of the accepted values).

- [ ] **Step 4: Commit**

```bash
git add js/main.js
git commit -m "fix: Move currentFilter update to start of filterProjects()

Eliminates stale state during animation that caused toggle-to-reset
race condition on rapid clicks. currentFilter now reflects user intent
immediately, not after animation completes (~910ms later)."
```

---

## Task 2: Simplify `activateFilter` Guard

**Files:**
- Modify: `js/main.js:437-466`

With eager `currentFilter`, the `!isAnimating` escape hatch is no longer needed.

- [ ] **Step 1: Simplify the guard and update JSDoc**

Change `activateFilter` (lines 437-466) from:

```javascript
  /**
   * Activate a specific category filter.
   * No-op if already showing the requested category (unless mid-animation,
   * where currentFilter may be stale from cancelled animation cleanup).
   * @param {string} category - Category to activate
   * @param {Object} [options] - Configuration options
   * @param {boolean} [options.shouldUpdateHash=true] - Whether to update URL hash
   * @param {boolean} [options.conditionalFocus=false] - Move focus only if already in toolbar
   */
  function activateFilter(category, { shouldUpdateHash = true, conditionalFocus = false } = {}) {
    if (category === currentFilter && !isAnimating) return;
```

To:

```javascript
  /**
   * Activate a specific category filter.
   * No-op if already showing the requested category.
   * @param {string} category - Category to activate
   * @param {Object} [options] - Configuration options
   * @param {boolean} [options.shouldUpdateHash=true] - Whether to update URL hash
   * @param {boolean} [options.conditionalFocus=false] - Move focus only if already in toolbar
   */
  function activateFilter(category, { shouldUpdateHash = true, conditionalFocus = false } = {}) {
    if (category === currentFilter) return;
```

- [ ] **Step 2: Run existing tests**

Run: `npx playwright test tests/filter/ --reporter=line`
Expected: All tests pass.

- [ ] **Step 3: Commit**

```bash
git add js/main.js
git commit -m "refactor: Simplify activateFilter guard

Remove !isAnimating escape hatch — no longer needed since
currentFilter is updated eagerly before animation starts."
```

---

## Task 3: Add `isAnimating` Guard to `resetFilter()`

**Files:**
- Modify: `js/main.js:425-435`

Currently `resetFilter()` has no animation guard. If called during animation, it should cancel the ongoing animation first (which `filterProjects()` already does via `cancelFilterAnimations()`). However, the early-exit guard `if (currentFilter === "all") return;` needs to work correctly with eager updates.

- [ ] **Step 1: Verify `resetFilter()` works correctly with eager update**

With eager `currentFilter`, when toggle-to-reset fires during an animation:
1. Click "IoT" → `currentFilter = "iot"` (eager), animation starts
2. Click "IoT" again → `filter === currentFilter` ("iot" === "iot") is true → `resetFilter()` called
3. `resetFilter()` checks `currentFilter === "all"` → false → proceeds
4. Calls `filterProjects("all")` → cancels IoT animation, sets `currentFilter = "all"`, starts "all" animation

This is correct. `resetFilter()` already works because `filterProjects()` calls `cancelFilterAnimations()` internally. No code change needed for `resetFilter()` itself.

- [ ] **Step 2: Run full filter test suite to confirm**

Run: `npx playwright test tests/filter/ --reporter=line`
Expected: All tests pass.

- [ ] **Step 3: Skip commit (no code change)**

No changes needed — `resetFilter()` is already safe with the eager update from Task 1.

---

## Task 4: Update `rapid-clicks.spec.js` Test #3 — Deterministic Toggle-to-Reset

**Files:**
- Modify: `tests/filter/rapid-clicks.spec.js:42-53`

The double-click test currently accepts both outcomes. With the fix, toggle-to-reset is deterministic.

- [ ] **Step 1: Write the updated test**

Replace test #3 (lines 42-53) with:

```javascript
  test("rapid double-click on same filter triggers toggle-to-reset", async () => {
    // First click activates filter, second click triggers toggle-to-reset
    // With eager currentFilter update, this is deterministic: always resets to "all"
    await fp.clickFilterNoWait("iot");
    await fp.button("iot").click();
    await waitForFilterAnimation(fp.page);

    await fp.expectNoAnimationClasses();
    await fp.expectVisibleCardCount(CATEGORY_COUNTS.all);
    await fp.expectActiveFilter("all");
    await fp.expectUrlHash("");
  });
```

- [ ] **Step 2: Run the updated test**

Run: `npx playwright test tests/filter/rapid-clicks.spec.js --reporter=line`
Expected: All 4 tests pass, including the now-deterministic test #3.

- [ ] **Step 3: Commit**

```bash
git add tests/filter/rapid-clicks.spec.js
git commit -m "test: Assert deterministic toggle-to-reset on rapid double-click

Previously accepted either filter-active or reset-to-all. With eager
currentFilter update, double-click always triggers toggle-to-reset."
```

---

## Task 5: Update `rapid-clicks.spec.js` Test #2 — DOM State Polling

**Files:**
- Modify: `tests/filter/rapid-clicks.spec.js:25-40`

Replace timing-based `waitForTimeout(duration * 0.3)` with DOM state polling. Wait for `.project-card--filtering-out` class to appear, confirming the exit animation has started.

- [ ] **Step 1: Write the updated test**

Replace test #2 (lines 25-40) with:

```javascript
  test("interrupting animation mid-exit reaches correct state", async () => {
    // Start backend filter (don't wait for animation to complete)
    await fp.clickFilterNoWait("backend");
    // Wait for exit animation to actually start (DOM state, not timing)
    await expect(fp.exitingCards.first()).toBeVisible();
    // Interrupt with a different filter
    await fp.clickFilterNoWait("iot");

    await waitForFilterAnimation(fp.page);

    // Second click should win
    await fp.expectVisibleCardCount(CATEGORY_COUNTS.iot);
    await fp.expectAllVisibleCardsAreCategory("iot");
  });
```

- [ ] **Step 2: Remove unused `getAnimationDuration` import if no longer needed**

Check if `getAnimationDuration` is still used in the file. If test #2 was the only consumer, remove it from the import:

```javascript
import { waitForFilterAnimation } from "../utils/timing.js";
```

If other tests in the file still use it, keep both imports.

- [ ] **Step 3: Run the updated test**

Run: `npx playwright test tests/filter/rapid-clicks.spec.js --reporter=line`
Expected: All 4 tests pass. Test #2 should be stable across Chromium, Firefox, and WebKit.

- [ ] **Step 4: Run across all browsers explicitly**

Run: `npx playwright test tests/filter/rapid-clicks.spec.js --reporter=line --project=chromium --project=firefox --project=webkit`
Expected: All pass — the DOM polling approach eliminates Firefox timing flakiness.

- [ ] **Step 5: Commit**

```bash
git add tests/filter/rapid-clicks.spec.js
git commit -m "test: Replace timing-based wait with DOM state polling

Mid-exit interrupt test now waits for .project-card--filtering-out
class instead of waitForTimeout(duration * 0.3). Fixes Firefox
flakiness from BACKLOG (rapid-click timing sensitivity)."
```

---

## Task 6: Add Rapid Toggle-to-Reset Test to `toggle-behavior.spec.js`

**Files:**
- Modify: `tests/filter/toggle-behavior.spec.js`

Add a test that verifies toggle-to-reset works when the second click happens during the first click's animation (the core BUG-004 scenario).

- [ ] **Step 1: Write the new test**

Add after the existing "toggle-to-reset moves focus to All button" test (line 34):

```javascript
  test("toggle-to-reset works during animation", async () => {
    // Click IoT without waiting for animation to complete
    await fp.clickFilterNoWait("iot");
    // Immediately click IoT again (toggle-to-reset during animation)
    await fp.clickFilter("iot");

    // Should have reset to "all" even though first animation was in progress
    await fp.expectVisibleCardCount(CATEGORY_COUNTS.all);
    await fp.expectActiveFilter("all");
    await fp.expectUrlHash("");
  });
```

- [ ] **Step 2: Add missing imports**

The file currently imports `FilterPage` and `CATEGORY_COUNTS`. Verify these are sufficient (they are — `clickFilter` waits for animation, `clickFilterNoWait` does not).

- [ ] **Step 3: Run the toggle behavior tests**

Run: `npx playwright test tests/filter/toggle-behavior.spec.js --reporter=line`
Expected: All 4 tests pass (3 existing + 1 new).

- [ ] **Step 4: Commit**

```bash
git add tests/filter/toggle-behavior.spec.js
git commit -m "test: Add rapid toggle-to-reset during animation test

Verifies BUG-004 fix: clicking same filter during its animation
correctly triggers toggle-to-reset instead of being misrouted."
```

---

## Task 7: Full Test Suite Verification

**Files:** None (verification only)

- [ ] **Step 1: Run the full filter test suite**

Run: `npx playwright test tests/filter/ --reporter=line`
Expected: All filter tests pass.

- [ ] **Step 2: Run the full project test suite**

Run: `npx playwright test --reporter=line`
Expected: All tests pass (filter, modal, form, SEO).

- [ ] **Step 3: Run lint**

Run: `npm run lint`
Expected: No lint errors.

- [ ] **Step 4: Run build**

Run: `npm run build`
Expected: Build succeeds, no size budget warnings.

- [ ] **Step 5: Run Lighthouse**

Run: `npm run lighthouse`
Expected: All 4 categories >= 90.
