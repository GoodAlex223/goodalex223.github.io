# Test Infrastructure Cleanup — Design Spec

**Date**: 2026-06-12
**Task**: Cleanup Week #1, Group D — Test Infrastructure Cleanup (`[batch]`, 🟤, 6 SP, Domain: Testing)
**Branch**: `test/infra-cleanup`
**Sources**: WEEKLY.md Tuesday schedule; BACKLOG.md 🟤 items (lines 305, 310, 311, 312, 313, 410 as of f3206c7)
**Status**: Approved (design walkthrough 2026-06-12)

---

## 1. Goal

Close the remaining fixed-timeout smells in the Playwright test infrastructure and tie off
lineage/consistency debt left by PR #71 (scroll-animation deterministic polling). After this
PR, the only fixed waits remaining in `tests/` are the three documented-intentional ones:
`setTheme()` 400ms WebKit style-settle (×3 POMs) and the 50ms pre-delay inside
`waitForAnimationComplete()`.

## 2. Scope

Six items. Items 1–4 are the planned WEEKLY Group D set; items 5–6 are approved scope
extensions (decided during brainstorming, 2026-06-12).

| # | Item | SP | Origin |
|---|------|----|--------|
| 1 | Generic `waitForOpacity(locator)` helper; replace `ModalPage.expectOpen()` `waitForTimeout(300)` and `clickCard()` inline opacity poll | 3 | BACKLOG line 311 |
| 2 | Automated guard test for observer-mirrored constants | 1 | BACKLOG line 310 |
| 3 | `waitForScrollAnimations(page)` in form + modal reduced-motion setup | 1 | BACKLOG line 312 |
| 4 | Lineage nits: add-the-call after `clickFilter()` at 2 reduced-motion sites; stagger-budget JSDoc; remove unused `getAnimationDuration()`/`getStaggerDelay()` | 1 | BACKLOG lines 305, 410; PR #71 review |
| 5 | *(extension)* Replace 2× `waitForTimeout(500)` in `tests/modal/url-hash.spec.js` with deterministic waits | — | Discovered during exploration |
| 6 | *(extension)* Targeted regression test: `waitForScrollAnimations` resolves with filter-hidden cards present | — | BACKLOG line 313 |

### Decisions recorded

- **Scope**: extend with items 5 and 6 (user-approved; both small and on-theme — item 5 makes
  the "last fixed-timeout" claim true, item 6 drains one more 🟤 item).
- **Nit 4a**: ADD `waitForScrollAnimations(page)` after `clickFilter()` at both reduced-motion
  sites rather than commenting the omission — matches the light/dark sibling describes and
  item 3's structural-consistency rationale. (WEEKLY had planned a comment; superseded.)
- **Helper shape**: Approach A — generic locator-based `waitForOpacity(locator)` in
  `tests/utils/timing.js`. Rejected: B (modal-specific `waitForModalOpen(page)` — leaks
  `#project-modal` selector out of the POM, leaves `clickCard` duplication), C (inline poll in
  `expectOpen` only — no reusable infrastructure).
- **Guard mechanism**: runtime capture via `addInitScript` wrapping `window.IntersectionObserver`.
  Forced by constraints: tests run against the terser-minified `dist/main.[hash].js` build
  (playwright.config.js webServer runs `npm run build` locally; CI serves the build artifact),
  so source-text parsing breaks; exposing config on `window` from production code ships test
  scaffolding to users.

## 3. Design

### 3.1 `tests/utils/timing.js`

**Remove** `getAnimationDuration()` and `getStaggerDelay()` (zero callers — verified by grep;
only the removed `waitForFilterAnimation()` ever used them). Update the file header: drop the
"Reads durations from CSS custom properties (single source of truth)" line, since nothing
reads CSS properties afterward.

**Add mirror-constant exports** (single source for the production-observer contract):

```js
// Mirror the production IntersectionObserver config (js/main.js:585-586).
// Guarded by tests/utils/timing-guards.spec.js — if either side changes,
// that test fails and both sides get updated together.
export const SCROLL_OBSERVER_THRESHOLD = 0.1;
export const SCROLL_OBSERVER_ROOT_MARGIN_BOTTOM = 50;
```

**Refactor `waitForScrollAnimations`**: pass the constants into `page.evaluate` as an argument
(`{ threshold, rootMarginBottom }`) instead of re-declaring them inside the browser-side
closure. Replace the `DRIFT RISK … no automated guard` comment with a pointer to the guard
test. Add the lost stagger-budget lineage to the JSDoc (nit 4b):

> Replaces the fixed 700ms POM waits (max hero stagger 150ms + 400ms opacity transition
> = 550ms + buffer); polling subsumes that budget by observing completion directly.

**Add `waitForOpacity`**:

```js
export async function waitForOpacity(locator, { timeout = 5000 } = {}) {
  await expect
    .poll(() => locator.evaluate((el) => getComputedStyle(el).opacity), { timeout })
    .toBe("1");
}
```

JSDoc must cover: (a) axe-core sampling mid-transition computes false contrast values from
partial opacity — the documented reason for the old fixed 300ms; (b) under
`prefers-reduced-motion` the modal CSS sets `transition: none` (css/modal.css:424-428), so
opacity computes to 1 immediately and the first poll tick passes — no `matchMedia` branch
needed, one code path serves both modes.

### 3.2 `tests/pages/ModalPage.js`

- Import `waitForOpacity` from `../utils/timing.js`.
- `expectOpen()` (line 118): replace `await this.page.waitForTimeout(300)` with
  `await waitForOpacity(this.modal)`. Keep the explanatory comment, reworded to describe
  polling (waits for the 250ms opacity transition to complete; immune to timing variance).
- `clickCard()` (lines 71-75): replace the hand-rolled `expect.poll` on card opacity with
  `await waitForOpacity(card)`. Keep the Firefox click-at-opacity-0 rationale comment.

### 3.3 `tests/utils/timing-guards.spec.js` (new file, 2 tests)

Both tests guard `timing.js` contracts — co-located with the module they protect.

**Test 1 — observer-config guard** (item 2):

1. `page.addInitScript` wraps `window.IntersectionObserver` in a subclass that pushes every
   constructor `options` object onto `window.__ioConfigs`.
2. `goto("/")`, wait for the JS-init signal (`.filter-btn` first contains "(").
3. `expect.poll` until `window.__ioConfigs.length > 0` — the observer is constructed inside a
   double-`requestAnimationFrame` after init, so capture is async.
4. Assert: exactly **1** config captured (a future second observer fails loudly and forces a
   conscious update); `threshold` equals `SCROLL_OBSERVER_THRESHOLD`; `rootMargin` equals
   the template `0px 0px -<SCROLL_OBSERVER_ROOT_MARGIN_BOTTOM>px 0px`.

No reduced-motion emulation — production skips observer setup under reduced motion
(js/main.js:560-563), so there would be nothing to capture.

**Test 2 — filter-hidden regression** (item 6, BACKLOG line 313):

1. `FilterPage.goto()`; `clickFilter("iot")` (bundles `waitForAnimationComplete`).
2. **Precondition assert**: ≥1 `.project-card--hidden` card overlaps the observer's effective
   viewport by ≥ threshold, computed with the same exported constants and the same
   visible-fraction math as the helper. This guarantees the class-skip branch is genuinely
   exercised and keeps the test honest if page layout changes. The test scrolls the projects
   grid into view before the precondition assert so the overlap holds deterministically at
   any viewport size.
3. `await waitForScrollAnimations(page)` — resolving without timeout IS the assertion
   (pre-fix behavior: hidden in-viewport cards held opacity 0 forever → poll hung to timeout).

### 3.4 Reduced-motion consistency additions (item 3 + nit 4a)

| File | Site | Edit |
|------|------|------|
| `tests/modal/axe-scan.spec.js` (~line 68) | reduced-motion `beforeEach` | add `await waitForScrollAnimations(page);` after `mp.goto()`; add `page` to the `beforeEach` signature |
| `tests/form/axe-scan.spec.js` (~line 57) | reduced-motion test body | add the call after `fp.goto()` (import already present) |
| `tests/filter/axe-scan.spec.js` (~line 122) | after `clickFilter("iot")` | add the call before `setTheme("light")` |
| `tests/filter/reduced-motion.spec.js` (~line 76) | after `clickFilter("iot")` | same; add the `timing.js` import to this file |

All four are runtime no-ops (reduced-motion short-circuit). Value is structural uniformity:
every suite's reduced-motion path mirrors its normal-motion path. Existing WebKit/`setTheme`
comments stay untouched.

### 3.5 `tests/modal/url-hash.spec.js` deterministic waits (item 5)

- **"does not open modal for invalid project hash"**: register
  `page.waitForResponse(…data/projects.json…)` BEFORE `goto("/#project=nonexistent")` (the
  hash-open path fetches projects.json even for invalid IDs — js/main.js fetches first,
  checks `data[projectId]` after, line 855). Then `await response.finished()`, wait for the
  JS-init signal, then `expectClosed()`. Strictly better than the old 500ms on both axes:
  faster, and not vacuous on a slow CI run where the fetch outlives 500ms.
- **"does not interfere with filter hash"**: no modal code runs for `#filter=` hashes (no
  fetch to await). Wait for the JS-init signal, then `waitForAnimationComplete(page)` (covers
  a possible hash-applied filter animation; passes immediately if none), then `expectClosed()`.
  Import `waitForAnimationComplete` in this file.

### 3.6 Out of scope (explicit)

- `setTheme()` 400ms waits (ModalPage:225, FormPage:201, FilterPage:184) — documented
  WebKit style-computation settle pattern; intentional.
- 50ms pre-delay in `waitForAnimationComplete` (timing.js:55) — documented, intentional.
- Fixing the reduced-motion modal focus gap in production code (see §5) — filed to BACKLOG
  instead; a production-JS fix does not belong in a test-infra batch PR.

## 4. Failure modes

- `waitForOpacity` timeout → clear `expect.poll` failure naming the locator.
- Guard-test mismatch → expected-vs-actual constant values in the failure output; the fix is
  to update both sides of the contract deliberately.
- `toHaveLength(1)` failure → a second IntersectionObserver was introduced; updater must
  decide which config the helper mirrors.
- Regression-test timeout → the class-skip behavior in `waitForScrollAnimations` regressed.

## 5. Discovered production issue (filed, not fixed)

Under `prefers-reduced-motion: reduce`, css/modal.css:424-428 sets `transition: none` on
`.project-modal`, so `transitionend` never fires — and the close-button focus handler
(js/main.js:886-894, which waits for `propertyName === "visibility"`) never runs. Keyboard
focus likely never moves into the modal for reduced-motion users. To be verified empirically
during implementation, then filed as a new 🟤 BACKLOG entry under
`### From Group D Test Infra Cleanup (2026-06-12)` with conservative wording.

## 6. Bookkeeping

- **BACKLOG.md**: mark complete/prune items at lines 305, 310, 311, 312, 313, 410 (six 🟤
  drained); add the §5 production-gap entry (Claude-surfaced → 🟤 per intake rules).
- **CLAUDE.md**: NO hand-edits — affected bullets (form axe-scan "no extra
  waitForScrollAnimations", timing.js function inventory, reduced-motion patterns) live in the
  AUTO-MANAGED patterns region; the auto-memory hook resyncs post-merge (precedent: PRs #71,
  #73), with Thursday Group B's `/auto-memory:sync` as backstop.
- **WEEKLY.md**: tick Group D checkboxes with outcome notes.
- Plan archives to `docs/archive/plans/`, this spec to `docs/archive/specs/`, at task
  completion (filename already in final underscored form).

## 7. Validation

1. `npm run lint` — new spec file and edits under the Playwright ESM environment.
2. Full `npm test` — Chromium, Firefox, WebKit.
3. Flake confidence (PR #71 precedent): `--repeat-each=5` across the touched suites
   (`tests/modal/`, `tests/utils/timing-guards.spec.js`, `tests/filter/axe-scan.spec.js`,
   `tests/filter/reduced-motion.spec.js`, `tests/form/axe-scan.spec.js`), all 3 browsers.
4. **Test the test**: temporarily mutate `SCROLL_OBSERVER_THRESHOLD` → guard test must fail;
   revert. Temporarily remove the `--hidden` class-skip in the helper → regression test must
   fail; revert. (Run on Chromium only; cross-browser adds nothing for a mutation check.)
5. Verify the §5 focus gap empirically before wording its BACKLOG entry.

Delivery: one PR from `test/infra-cleanup`; conventional commits (`test:` for test code,
`docs:` for planning files); standard review + task-completion workflow (EXTRACT → ARCHIVE →
TRANSITION → COMMIT → MEMORY).
