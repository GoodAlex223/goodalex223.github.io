# Test Quality Improvements — Design Spec

**Date**: 2026-04-05
**Points**: 6 (3 + 2 + 1)
**Branch**: `quality/test-quality-improvements`
**Approach**: A (Minimal — fix exactly what WEEKLY specifies)

---

## Overview

Three discrete test quality fixes addressing known anti-patterns: non-web-first assertions, redundant test setup, and a missing assertion.

---

## Changes

### 1. Replace `page.evaluate` with web-first assertions (3 pts, IMPORTANT)

**File**: `tests/form/accessibility.spec.js`

Four `page.evaluate(() => document.activeElement.id)` calls replaced with Playwright web-first `expect(locator).toBeFocused()`:

| Test | Line(s) | Before | After |
|------|---------|--------|-------|
| "focus moves to first invalid field on submit" | 55-58 | `page.evaluate` + `expect(id).toBe("contact-name")` | `expect(fp.nameField).toBeFocused()` |
| "focus moves to second field when first is valid" | 61-65 | `page.evaluate` + `expect(id).toBe("contact-email")` | `expect(fp.emailField).toBeFocused()` |
| "form is keyboard navigable with Tab" (1st check) | 70-72 | `page.evaluate` + `expect(id).toBe("contact-email")` | `expect(fp.emailField).toBeFocused()` |
| "form is keyboard navigable with Tab" (2nd check) | 74-76 | `page.evaluate` + `expect(id).toBe("contact-message")` | `expect(fp.messageField).toBeFocused()` |

Side effect: `{ page }` destructuring removed from test callbacks where no longer needed.

**File**: `tests/form/submission.spec.js`

Two `test.expect(requestMade).toBe(false)` calls (lines 69, 118) changed to `expect(requestMade).toBe(false)` for consistency with the rest of the file. The file already imports `expect` from `@playwright/test`. Functionally identical (non-retrying boolean check on a local variable).

### 2. Reduced motion test efficiency (2 pts)

**File**: `tests/modal/axe-scan.spec.js`

The reduced-motion `test.describe` block's `beforeEach` (lines 65-69) currently:
1. Re-creates `mp = new ModalPage(page)` — redundant, outer `beforeEach` already does this
2. Calls `mp.goto()` — needed (page must reload after `enableReducedMotion()`)
3. Calls `mp.waitForScrollAnimations()` — unnecessary, animations are disabled under reduced motion

**Change**:
- Remove `mp = new ModalPage(page)` (reuse outer)
- Remove `{ page }` destructuring (no longer needed)
- Keep `mp.enableReducedMotion()` + `mp.goto()`
- Remove `mp.waitForScrollAnimations()` (saves ~700ms per test)

### 3. Add `expectScreenshotsCount` to rule-indicators test (1 pt)

**File**: `tests/modal/basic-modal.spec.js`

The rule-indicators content test (line 28-36) is missing `expectScreenshotsCount(2)`. The project has 2 screenshots in `data/projects.json`. All other project content tests include this assertion.

**Change**: Add `await mp.expectScreenshotsCount(2);` after line 35 (after `expectTechPillsCount`).

---

## Files Modified

| File | Changes |
|------|---------|
| `tests/form/accessibility.spec.js` | 4x `page.evaluate` → `toBeFocused()`, remove `{ page }` destructuring |
| `tests/form/submission.spec.js` | 2x `test.expect` → `expect` |
| `tests/modal/axe-scan.spec.js` | Remove redundant setup in reduced-motion `beforeEach` |
| `tests/modal/basic-modal.spec.js` | Add `expectScreenshotsCount(2)` to rule-indicators |

## Verification

- `npm test` — all tests pass across Chromium, Firefox, WebKit
- `npm run lint:js` — no lint errors introduced
