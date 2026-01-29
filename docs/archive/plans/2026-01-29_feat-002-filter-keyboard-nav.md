# FEAT-002: Filter Keyboard Navigation

**Status**: Complete
**Created**: 2026-01-29
**Branch**: `feat/002-filter-keyboard-nav`

---

## 1. Objective

Add keyboard navigation to project filter buttons using the WAI-ARIA roving tabindex toolbar pattern. Improves accessibility for keyboard-only users and screen reader users.

## 2. Approach

**Chosen**: Minimal approach — all changes inside existing `initProjectFilter()` function.

**Alternatives Considered**:
1. **Minimal (chosen)** — Add helpers inside existing function. ~57 lines. Consistent with codebase patterns.
2. **Clean Architecture** — Generic `initRovingTabindex()` utility + composition layer. ~150 lines. Reusable but premature for single use case.

**Rationale**: Only one toolbar-like component exists. Generic utility would be premature abstraction. Approach B required polluting global scope with `window.filterProjects`.

## 3. Implementation

### HTML Changes (index.html)
- Changed `role="group"` → `role="toolbar"` on filter container
- Added `tabindex="0"` to active button, `tabindex="-1"` to inactive buttons
- Added live region `<div class="sr-only" role="status" aria-live="polite" aria-atomic="true" id="filter-status">`

### JavaScript Changes (js/main.js)
- Added `updateTabindex(focusedButton)` — manages roving tabindex
- Added `announceFilterResults(category)` — announces filter results via live region
- Enhanced `setActiveButton()` — calls `updateTabindex()` to sync roving tabindex
- Added `announceFilterResults()` calls to click handler
- Added keydown event handler: ArrowLeft/Right/Up/Down, Home/End with wrap-around

### CSS Changes
- None needed — `.sr-only` and `.filter-btn:focus-visible` already existed

## 4. Key Discoveries

- Native `<button>` elements fire click events on Enter/Space — no custom activation handler needed
- `querySelectorAll` returns elements in document order, making index-based navigation reliable
- Existing `.sr-only` class in utilities.css was already available for the live region

## 5. Future Improvements

1. **Escape key to reset filter** — Add Escape key handler to reset to "All" from any focused button (quick UX enhancement)
2. **Screen reader testing** — Test with NVDA/VoiceOver to verify live region announcements and roving tabindex behavior in real assistive technology
3. **URL hash-based filtering with keyboard** — When URL hash filtering is implemented (BACKLOG item), ensure keyboard navigation syncs with URL state

### Execution Log

#### 2026-01-29 — PHASE: Planning
- Explored codebase with 2 agents (filter implementation + keyboard/a11y patterns)
- Read all key files: main.js, index.html, components.css, utilities.css
- Clarified 3 design decisions with user (roving tabindex, Home/End, live region)

#### 2026-01-29 — PHASE: Architecture
- Designed 2 approaches (minimal vs clean architecture)
- User chose minimal approach
- Decision: role="toolbar" over role="group" for semantic keyboard nav signaling

#### 2026-01-29 — PHASE: Implementation
- Added tabindex attributes and role="toolbar" to HTML
- Added live region div with sr-only class
- Added 3 JS functions + keydown handler inside initProjectFilter()

#### 2026-01-29 — PHASE: Review
- 3 code reviewers (simplicity, bugs, conventions/a11y)
- No critical issues found
- Minor findings (toggle-to-reset tabindex, ArrowUp/Down on horizontal toolbar) assessed as acceptable

#### 2026-01-29 — PHASE: Complete
- All acceptance criteria met
- No CSS changes required
- User approved
