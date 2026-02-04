# TODO

Active tasks and backlog.

**Last Updated**: 2026-02-04 (SEO-004 completed)

---

## In Progress

_None currently_

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
