# TODO

**Last Updated**: 2026-01-29

Active tasks for the portfolio project.

---

## In Progress

_None currently_

---

## Today (2026-01-29) — SEO & Performance Polish

### SEO-001: Add robots.txt and sitemap.xml
- **Priority**: High
- **Estimate**: Small
- **Description**: Create `robots.txt` allowing all crawlers and `sitemap.xml` listing all public pages (`index.html`, `404.html`). Essential for proper search engine indexing.
- **Acceptance Criteria**:
  - [ ] `robots.txt` at root with `Sitemap:` directive
  - [ ] `sitemap.xml` at root with correct URLs and `lastmod` dates
  - [ ] Validate with Google's robots.txt tester format

### SEO-002: Add JSON-LD structured data
- **Priority**: High
- **Estimate**: Small
- **Description**: Add JSON-LD `<script>` to `index.html` with `Person` and `WebSite` schema types. Improves search result appearance with rich snippets (name, job title, social links).
- **Acceptance Criteria**:
  - [ ] JSON-LD script in `<head>` of `index.html`
  - [ ] `Person` schema with name, jobTitle, url, sameAs (GitHub, LinkedIn)
  - [ ] `WebSite` schema with name and url
  - [ ] Validates at schema.org/validator or Google Rich Results Test

### PERF-001: Self-host Google Fonts
- **Priority**: Medium
- **Estimate**: Small
- **Description**: Download Inter font files and serve locally instead of loading from Google Fonts CDN. Eliminates external dependency, improves First Contentful Paint, and removes privacy concerns. Identified in HP-002 Lighthouse audit (2026-01-26).
- **Origin**: BACKLOG.md — HP-002 Lighthouse audit improvement
- **Acceptance Criteria**:
  - [ ] Inter font files (woff2) downloaded to `fonts/` directory
  - [ ] `@font-face` declarations in CSS with `font-display: swap`
  - [ ] Google Fonts `<link>` tags removed from `index.html` and `404.html`
  - [ ] Preconnect hints removed (no longer needed)
  - [ ] Visual parity with current font rendering

---

## Tomorrow (2026-01-30) — Feature Enhancements

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
