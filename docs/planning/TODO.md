# TODO

Active tasks and backlog.

**Last Updated**: 2026-02-02

---

## In Progress

_None currently_

---

## High Priority

### [BUG-001] - Fix theme switch button overlapping header buttons on mobile
**Priority**: High
**Dependencies**: None
**Origin**: BACKLOG.md (Bug Fixes)

**Description**: Theme toggle button overlaps other header buttons on mobile viewport. Reported on both the main page and the 404 page.

**Acceptance Criteria**:
- [ ] Theme toggle does not overlap nav buttons on mobile (main page)
- [ ] Theme toggle does not overlap nav buttons on mobile (404 page)
- [ ] Layout remains correct on all breakpoints (mobile, tablet, desktop)

---

### [BUG-002] - Fix toggle-to-reset tabindex desync
**Priority**: High
**Dependencies**: None
**Origin**: BACKLOG.md (Filter Enhancements)

**Description**: When clicking an active filter to reset to "All", browser focus stays on the clicked button (`tabindex="-1"`) while "All" gets `tabindex="0"`, breaking the roving tabindex pattern. Fix: add `allButton.focus()` after `setActiveButton(allButton)` in the toggle-to-reset handler.

**Acceptance Criteria**:
- [ ] Focus moves to "All" button when active filter is clicked to reset
- [ ] Roving tabindex state stays in sync with focused element
- [ ] Keyboard navigation continues to work after toggle-to-reset

---

## Medium Priority

### [PERF-002] - Add font preload hint
**Priority**: Medium
**Dependencies**: None
**Origin**: BACKLOG.md (From PERF-001)

**Description**: Add `<link rel="preload">` for `inter-latin.woff2` to start font download earlier in the critical rendering path.

**Acceptance Criteria**:
- [ ] Preload link added to `index.html` and `404.html`
- [ ] Font loads earlier in waterfall (verify in DevTools Network tab)
- [ ] No duplicate font downloads

---

### [PERF-003] - Bundle CSS files
**Priority**: Medium
**Dependencies**: None
**Origin**: BACKLOG.md (Performance, from HP-002 Lighthouse audit)

**Description**: Replace the `@import` chain in `main.css` with a single bundled CSS file for production. Reduces HTTP requests and eliminates render-blocking import cascade.

**Acceptance Criteria**:
- [ ] Single CSS file serves all styles in production
- [ ] Build script or process documented
- [ ] No visual regressions across all pages
- [ ] Development workflow preserved (modular files still editable)

---

### [FEAT-003] - Enhanced filter animations
**Priority**: Medium
**Dependencies**: None
**Origin**: BACKLOG.md (Filter Enhancements)

**Description**: Add richer animations for project cards during filtering — appearance, disappearance, movement, and other transitions beyond the current opacity + scale.

**Acceptance Criteria**:
- [ ] Cards animate smoothly when appearing/disappearing
- [ ] Animation respects `prefers-reduced-motion`
- [ ] No layout jank during transitions
- [ ] Performance stays smooth on mobile

---

### [FEAT-004] - URL hash-based filtering
**Priority**: Medium
**Dependencies**: None
**Origin**: BACKLOG.md (Filter Enhancements)

**Description**: Allow shareable filter links like `#filter=backend`. Apply filter on page load from URL hash, and update hash when filter changes.

**Acceptance Criteria**:
- [ ] URL hash updates when filter is selected
- [ ] Page loads with correct filter applied from URL hash
- [ ] Browser back/forward navigates filter states
- [ ] Hash is removed or set to `#filter=all` when filter is reset

---

### [FEAT-005] - Escape key to reset filter
**Priority**: Medium
**Dependencies**: None
**Origin**: BACKLOG.md (From FEAT-002)

**Description**: Add Escape key handler to reset filter to "All" from any focused filter button.

**Acceptance Criteria**:
- [ ] Pressing Escape while a filter button is focused resets to "All"
- [ ] Focus moves to "All" button after reset
- [ ] Live region announces the reset

---

### [FEAT-006] - Filter count badges
**Priority**: Medium
**Dependencies**: None
**Origin**: BACKLOG.md (Filter Enhancements)

**Description**: Show the number of projects per category on each filter button (e.g., "Backend (2)").

**Acceptance Criteria**:
- [ ] Each filter button displays project count
- [ ] Counts are accurate and update if cards are added/removed
- [ ] Badge styling is subtle and doesn't clutter the UI

---

### [SEO-003] - Google Search Console verification
**Priority**: Medium
**Dependencies**: None
**Origin**: BACKLOG.md (From SEO-001)

**Description**: Verify site ownership in Google Search Console and submit `sitemap.xml` for faster indexing and crawl monitoring.

**Acceptance Criteria**:
- [ ] Site verified in Google Search Console
- [ ] Sitemap submitted and accepted
- [ ] No crawl errors reported

---

### [SEO-004] - Improve meta descriptions
**Priority**: Medium
**Dependencies**: None
**Origin**: BACKLOG.md (SEO)

**Description**: Review and optimize meta description content for better click-through rates in search results.

**Acceptance Criteria**:
- [ ] Meta description is 150-160 characters
- [ ] Contains primary keywords naturally
- [ ] Includes a call-to-action or value proposition

---

## Low Priority

### [A11Y-001] - Screen reader testing
**Priority**: Low
**Dependencies**: None
**Origin**: BACKLOG.md (From FEAT-002)

**Description**: Test keyboard navigation with NVDA and/or VoiceOver to verify live region announcements and roving tabindex behavior work correctly.

**Acceptance Criteria**:
- [ ] Filter toolbar announced correctly by screen reader
- [ ] Live region announces filter results after selection
- [ ] Roving tabindex navigates as expected
- [ ] Document findings and any fixes applied

---

### [A11Y-002] - Improve focus indicators
**Priority**: Low
**Dependencies**: None
**Origin**: BACKLOG.md (Accessibility)

**Description**: Review and enhance `:focus-visible` styles across all interactive elements for better visibility.

**Acceptance Criteria**:
- [ ] All interactive elements have visible focus indicators
- [ ] Focus indicators meet WCAG 2.1 contrast requirements
- [ ] Consistent focus style across components

---

### [DOCS-001] - Update PROJECT.md external dependencies
**Priority**: Low
**Dependencies**: None
**Origin**: BACKLOG.md (From PERF-001)

**Description**: Remove Google Fonts CDN from documented dependencies, document self-hosted fonts in `fonts/` directory.

**Acceptance Criteria**:
- [ ] PROJECT.md no longer references Google Fonts CDN
- [ ] Self-hosted font setup documented
- [ ] Any other stale dependency references updated

---

## Notes

- Portfolio rebuild completed 2026-01-20
- All core functionality working (v1.0 + most of v1.5)
- v1.1 polish complete: favicon, OG image, Lighthouse 100/100, links verified
- v1.5 features complete: theme toggle, filtering, scroll animations, 404 page
- Week of 2026-02-02: bug fixes, filter enhancements, performance, SEO, and accessibility
- Tasks are organized by priority
- Completed tasks move to [DONE.md](DONE.md)
- Each significant task should have a plan document in `docs/planning/plans/`
