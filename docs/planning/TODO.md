# TODO

Active tasks and backlog.

**Last Updated**: 2026-02-12 (TEST-002 completed)

---

## In Progress

_None currently_

---

## Medium Priority

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
