# TODO

Active tasks and backlog.

**Last Updated**: 2026-02-09 (TEST-001 completed)

---

## In Progress

_None currently_

---

## High Priority

### SEO-005: Bing Webmaster Tools verification
**Origin**: BACKLOG.md → From SEO-003: Google Search Console
**Category**: SEO & Polish
**Description**: Add Bing Webmaster Tools verification meta tag (similar to Google Search Console). Submit sitemap for Microsoft search coverage.
**Acceptance Criteria**:
- [ ] Bing verification meta tag added to `index.html`
- [ ] Ownership verified in Bing Webmaster Tools
- [ ] Sitemap submitted to Bing

### QUALITY-001: Centralize resetFilter() function
**Origin**: BACKLOG.md → From FEAT-005: Escape Key Reset Filter
**Category**: Code Quality
**Description**: Extract `resetFilter()` function in `js/main.js` to DRY up toggle-to-reset click handler and Escape key handler (both use same 4-line sequence).
**Acceptance Criteria**:
- [ ] Single `resetFilter()` function replaces duplicated logic
- [ ] Toggle-to-reset click handler uses `resetFilter()`
- [ ] Escape key handler uses `resetFilter()`
- [ ] All existing Playwright tests pass

---

## Medium Priority

### QUALITY-002: Centralize activateFilter() function
**Origin**: BACKLOG.md → From BUG-002: Toggle-to-Reset Tabindex Desync
**Category**: Code Quality
**Description**: Create single `activateFilter(button, category)` function to reduce risk of future desync between toggle-to-reset and normal click paths.
**Acceptance Criteria**:
- [ ] Single `activateFilter()` function encapsulates filter activation logic
- [ ] Both click paths (normal click, toggle-to-reset) use same function
- [ ] Tabindex and focus remain synced after all interactions
- [ ] All existing Playwright tests pass

### QUALITY-003: Add CSS specificity documentation
**Origin**: BACKLOG.md → From BUG-003: Filter Animation Fix
**Category**: Code Quality
**Description**: Add comment block in `components.css` explaining the specificity hierarchy between scroll and filter animation systems. Prevents future developers from reordering sections.
**Acceptance Criteria**:
- [ ] Comment block explains cascade order dependency
- [ ] Documents which selectors must come after which
- [ ] References the BUG-003 fix for context

### TEST-002: Accessibility regression tests
**Origin**: BACKLOG.md → From BUG-002 & A11Y-001
**Category**: Testing & Tooling
**Description**: Add Playwright accessibility assertions verifying focus/tabindex sync after all filter interactions. Use `@axe-core/playwright` for automated WCAG checks.
**Depends on**: TEST-001 (Playwright setup)
**Acceptance Criteria**:
- [ ] axe-core integrated with Playwright
- [ ] Tests verify roving tabindex pattern after filter clicks
- [ ] Tests verify focus management after toggle-to-reset
- [ ] Tests verify ARIA attributes update correctly
- [ ] Zero WCAG violations on page load

### POLISH-001: Focus indicator transition animation
**Origin**: BACKLOG.md → From A11Y-002: Improve Focus Indicators
**Category**: SEO & Polish
**Description**: Add subtle fade-in for focus outline appearance, respecting `prefers-reduced-motion`.
**Acceptance Criteria**:
- [ ] Focus outline fades in smoothly
- [ ] Animation disabled when `prefers-reduced-motion: reduce`
- [ ] Works on all interactive elements (links, buttons)
- [ ] No regression on existing focus visibility

### SEO-006: Social card preview testing
**Origin**: BACKLOG.md → From SEO-004: Improve Meta Descriptions
**Category**: SEO & Polish
**Description**: Validate OG/Twitter card rendering using Facebook Debugger and Twitter Card Validator. Document results and fix any issues.
**Acceptance Criteria**:
- [ ] Facebook Sharing Debugger shows correct title, description, image
- [ ] Twitter Card Validator shows correct large image card
- [ ] Any rendering issues fixed
- [ ] Results documented

---

## Low Priority (Stretch Goals)

### TEST-003: Add CSS linting with Stylelint
**Origin**: BACKLOG.md → Technical Debt
**Category**: Testing & Tooling
**Description**: Set up Stylelint for CSS quality enforcement. Add to pre-commit hooks or CI.
**Acceptance Criteria**:
- [ ] Stylelint installed and configured
- [ ] Rules match project conventions (BEM, custom properties)
- [ ] All existing CSS passes linting
- [ ] Integrated with build or CI

### PERF-006: Inline critical CSS
**Origin**: BACKLOG.md → From PERF-002: Font Preload Hint
**Category**: Performance
**Description**: Inline above-the-fold styles in `<head>` and load full CSS asynchronously for faster first paint.
**Acceptance Criteria**:
- [ ] Critical CSS extracted and inlined
- [ ] Full CSS loaded asynchronously
- [ ] No flash of unstyled content
- [ ] Lighthouse performance score maintained or improved

---

## Notes

- Portfolio rebuild completed 2026-01-20
- All core functionality working (v1.0 + most of v1.5)
- v1.1 polish complete: favicon, OG image, Lighthouse 100/100, links verified
- v1.5 features complete: theme toggle, filtering, scroll animations, 404 page
- Week of 2026-02-02: bug fixes, filter enhancements, performance, SEO, and accessibility (all complete)
- Week of 2026-02-09: performance, testing (TEST-001 complete), code quality, SEO & polish
- Tasks are organized by priority
- Completed tasks move to [DONE.md](DONE.md)
- Each significant task should have a plan document in `docs/planning/plans/`
