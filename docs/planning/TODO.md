# TODO

**Last Updated**: 2026-01-29

Active tasks for the portfolio project.

---

## In Progress

_None currently_

---

## Next — Feature Enhancements

### FEAT-001: Project Metadata Badges
- **Priority**: Medium
- **Estimate**: Medium
- **Description**: Add "last updated" date and "in development" status indicator to project cards. Shows portfolio is actively maintained — good signal for recruiters. Dates stored as `data-updated` attributes on card elements.
- **Origin**: BACKLOG.md — Project Metadata Badges
- **Acceptance Criteria**:
  - [ ] Each project card shows last updated date (subtle, bottom of card)
  - [ ] Active projects show "In Development" badge/indicator
  - [ ] Dates stored in HTML `data-updated` attributes
  - [ ] Visual design is subtle and doesn't clutter cards
  - [ ] Responsive — works on mobile and desktop
  - [ ] Respects theme (light/dark colors)

### FEAT-002: Filter keyboard navigation
- **Priority**: Low
- **Estimate**: Small
- **Description**: Add keyboard navigation to project filter buttons. Arrow Left/Right to move between filters, Enter/Space to activate. Improves accessibility for keyboard-only users.
- **Origin**: BACKLOG.md — Filter Enhancements (LP-001)
- **Acceptance Criteria**:
  - [ ] Arrow Left/Right moves focus between filter buttons
  - [ ] Enter/Space activates the focused filter
  - [ ] Focus wraps around (last → first, first → last)
  - [ ] `tabindex` and `aria-` attributes properly set
  - [ ] Visual focus indicator visible on active button

---

## Notes

- Portfolio rebuild completed 2026-01-20
- All core functionality working (v1.0 + most of v1.5)
- v1.1 polish complete: favicon, OG image, Lighthouse 100/100, links verified
- v1.5 features complete: theme toggle, filtering, scroll animations, 404 page
- Focus now on SEO, performance, and feature enhancements
