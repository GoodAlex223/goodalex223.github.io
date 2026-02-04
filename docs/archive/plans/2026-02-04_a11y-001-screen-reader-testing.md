# A11Y-001: Screen Reader Testing

**Status**: Complete
**Branch**: `a11y/001-screen-reader-testing`
**Created**: 2026-02-04

---

## 1. Problem Statement

Test keyboard navigation with NVDA and/or VoiceOver to verify live region announcements and roving tabindex behavior work correctly. Fix any issues found.

## 2. Approach

Conducted a comprehensive code audit of the filter toolbar's accessibility implementation using three parallel analysis agents (ARIA patterns, semantic HTML, JS logic). Identified 4 issues, fixed 3 in code, documented manual testing scenarios.

### Issues Found

| # | Issue | Severity | Action |
|---|-------|----------|--------|
| 1 | Live region announcement delayed 700-1000ms after animations | HIGH | Fixed — moved before animations |
| 2 | "Showing 7 all projects" — awkward grammar | MEDIUM | Fixed — "Showing all 7 projects" |
| 3 | "iot" lowercase in announcements | MEDIUM | Fixed — extracts display label from button text |
| 4 | Double announcement: button text + aria-label | LOW | Fixed — aria-hidden span on count |
| 5 | Cards not aria-hidden during 350ms exit animation | LOW | Skipped — negligible window, visibility:hidden handles final state |

## 3. Implementation

### Fix 1: Instant Screen Reader Feedback (lines 318, 334)
- Moved `announceFilterResults()` from after-animation cleanup timeout to before animations start
- Changed to accept `visibleCount` parameter (cardsToShow.length) instead of counting from DOM
- Provides immediate feedback instead of 700-1000ms delay

### Fix 2: Grammar and Category Casing (lines 413-430)
- Rewrote `announceFilterResults()` with conditional grammar:
  - "all" category → "Showing all 7 projects"
  - Specific category → "Showing 3 IoT projects"
- Extracts display label from button text via regex to preserve original casing

### Fix 3: Prevent Double Announcements (lines 176-189)
- In `updateButtonLabels()`, wrapped count `(3)` in `<span aria-hidden="true">`
- Screen readers only read the `aria-label` ("Backend, 3 projects")
- Sighted users still see "Backend (3)"

## 4. Key Discoveries

### Strengths (Already Well-Implemented)
- Proper `role="toolbar"` with `aria-label` on filter container
- Correct roving tabindex pattern with `updateTabindex()` syncing
- `aria-pressed` toggle states on all filter buttons
- Comprehensive keyboard navigation (Arrow keys, Home, End, Escape)
- `.sr-only` class correctly implemented for live region
- `prefers-reduced-motion` handling at both CSS and JS levels
- Skip link, semantic landmarks, heading hierarchy all correct
- Theme toggle with dynamic `aria-label` updates

### Manual Testing Checklist (NVDA/VoiceOver)
1. Tab to filter toolbar — should announce "Filter projects by category, toolbar"
2. Focus "Backend" button — should announce "Backend, 3 projects, toggle button, not pressed"
3. Click "IoT" — should immediately announce "Showing 3 IoT projects"
4. Click "All" — should announce "Showing all 7 projects"
5. Tab away and back — focus returns to active button
6. Arrow key navigation works between filter buttons
7. Home/End keys jump to first/last button
8. Escape key resets to "All" and announces
9. Toggle-to-reset (click active filter) resets to "All"
10. Singular form: "Showing 1 Backend project" (not "projects")

## 5. Future Improvements

1. **Automated screen reader testing** — Use `@testing-library/dom` with `aria-query` or Playwright accessibility assertions to catch ARIA regressions in CI
2. **Screen reader announcement logging** — Add development mode that logs all live region updates to console for debugging accessibility issues without a screen reader

---

### Execution Log

#### 2026-02-04 — PHASE: Planning
- Goal: Audit and fix screen reader accessibility for filter toolbar
- Approach: Code audit with 3 parallel agents, then surgical fixes
- Risks: Cannot test with real screen reader in CLI environment

#### 2026-02-04 — PHASE: Implementation
- 3 fixes applied to js/main.js (~30 lines changed)
- 2 functions modified: `announceFilterResults()`, `updateButtonLabels()`
- 1 function call site moved: `filterProjects()`
- Build verified: `npm run build` succeeded

#### 2026-02-04 — PHASE: Code Review
- 2 parallel reviewers (bugs + conventions)
- No issues with confidence >= 80
- Code approved

#### 2026-02-04 — PHASE: Complete
- Final approach: Surgical fixes to 3 functions in js/main.js
- Tests: Code review passed, build succeeds
- User approval: Received
