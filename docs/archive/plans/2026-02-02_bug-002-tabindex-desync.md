# BUG-002: Fix Toggle-to-Reset Tabindex Desync

**Status**: Complete
**Priority**: High
**Created**: 2026-02-02
**Completed**: 2026-02-02
**Branch**: `fix/002-tabindex-desync`

---

## 1. Problem Statement

When clicking an active filter button to reset to "All", the `setActiveButton()` function moves `tabindex="0"` to the "All" button, but browser focus stays on the clicked button (which now has `tabindex="-1"`). This breaks the roving tabindex pattern — the focused element and the element with `tabindex="0"` are out of sync.

## 2. Root Cause

In the toggle-to-reset branch of the click handler (`js/main.js:198-201`), `setActiveButton(allButton)` updates the DOM (tabindex, classes, aria-pressed) but no `focus()` call follows. The keyboard navigation handler already had the correct pattern (`updateTabindex(target); target.focus()`), but the click handler was missing it.

## 3. Solution

Added `allButton.focus()` after `setActiveButton(allButton)` in the toggle-to-reset click handler. This mirrors the existing pattern from keyboard navigation.

**Change**: 1 line added to `js/main.js:200`

```javascript
// Toggle-to-reset: clicking active filter resets to "all"
if (filter === currentFilter && filter !== "all") {
  setActiveButton(allButton);
  allButton.focus();           // <-- Added: sync focus with tabindex
  filterProjects("all");
  announceFilterResults("all");
}
```

## 4. Testing

All tests passed via Playwright automation:

| Test | Scenario | Result |
|------|----------|--------|
| 1 | Toggle-to-reset moves focus to All | PASSED |
| 2 | ArrowRight works after toggle-to-reset | PASSED |
| 3 | Tab out + Shift+Tab back lands on All | PASSED |
| 4 | Normal click flow unaffected | PASSED |
| 5 | All self-click edge case (no-op) | PASSED |

Verified with `document.activeElement` and tabindex inspection via JS evaluation.

## 5. Key Discoveries

- The bug only affected the toggle-to-reset path (clicking an active non-All filter)
- Normal clicks and keyboard navigation were unaffected
- The fix follows the same pattern already established in keyboard navigation

## 6. Future Improvements

1. **Centralize focus management** — Consider a single `activateFilter(button, category)` function that handles `setActiveButton`, `focus`, `filterProjects`, and `announceFilterResults` in one call, reducing the risk of future desync bugs between the toggle-to-reset and normal click paths.

2. **Add automated accessibility regression tests** — Playwright tests verifying focus/tabindex sync after all filter interactions would catch similar desync bugs early. The manual test scenarios from this fix could serve as test specs.

### Execution Log

#### 2026-02-02 — PHASE: Planning
- Goal understood: Fix focus/tabindex desync in toggle-to-reset handler
- Approach chosen: Add allButton.focus() after setActiveButton(allButton)
- Risks identified: None (surgical 1-line fix)

#### 2026-02-02 — PHASE: Implementation
- Step completed: Added allButton.focus() at js/main.js:200
- Deviation from plan: No
- Unexpected discovery: None

#### 2026-02-02 — PHASE: Sub-Item Complete
- Sub-item: Code fix applied
- **Results obtained**: Focus now syncs with tabindex after toggle-to-reset
- **Lessons learned**: Click handlers that change tabindex must also move focus
- **Problems encountered**: None
- **Improvements identified**: Centralize filter activation logic
- **Technical debt noted**: Two similar code paths (toggle-to-reset vs normal click) that could be unified
- **Related code needing changes**: None

#### 2026-02-02 — PHASE: Testing
- All 5 Playwright tests passed
- Focus, tabindex, aria-pressed, and live region all verified

#### 2026-02-02 — PHASE: Complete
- Final approach: 1-line allButton.focus() addition
- Tests passing: Yes (all 5 Playwright scenarios)
- User approval: Received
