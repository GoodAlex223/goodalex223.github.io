# TODO

Active tasks and backlog.

**Last Updated**: 2026-03-11 (Week of March 17-21 planned)

---

## In Progress

_None currently_

## Recently Completed

- **CHALLENGE-001**: Lighthouse CI in GitHub Actions → moved to [DONE.md](DONE.md)
- **QUALITY-006**: Test Server Error Handling → moved to [DONE.md](DONE.md)
- **QUALITY-005**: Audit Remaining transition:all Usage → moved to [DONE.md](DONE.md)

---

## High Priority

### CI-002: Narrow Pages Deploy Artifact Path
**Source**: BACKLOG.md → From CI-001
**Goal**: Deploy only production files (`index.html`, `404.html`, `dist/`, `fonts/`, `favicon*`, `robots.txt`, `sitemap.xml`, `site.webmanifest`, images) instead of entire repo checkout. Currently `upload-pages-artifact` uses `path: '.'` which deploys source CSS, JS, scripts, tests, docs, and learning projects.
**Day**: Monday March 17

### QUALITY-007: ESLint Integration for JavaScript
**Source**: BACKLOG.md → From PERF-007
**Goal**: Add ESLint for JS linting in pre-commit hook (lint-staged) and CI pipeline, matching how Stylelint validates CSS. Configure for the project's ES6+ vanilla JS patterns.
**Day**: Tuesday March 18

---

## Medium Priority

### TEST-006: Automated OG Meta Tag Validation
**Source**: BACKLOG.md → From SEO-006
**Goal**: Add Playwright test that validates all 16 OG/Twitter meta tags are present and correctly formatted. Catches regressions when HTML is modified.
**Day**: Wednesday March 19

### QUALITY-008: Stylelint Rule to Prevent `transition: all`
**Source**: BACKLOG.md → From QUALITY-005
**Goal**: Add `declaration-property-value-disallowed-list` rule for `transition: all` to `.stylelintrc.json`. Also document "no transition: all" convention in CLAUDE.md CSS conventions section. Quick quality guard based on completed audit.
**Day**: Thursday March 20

---

## Low Priority (Stretch Goals)

### PERF-009: Build Size Trend History
**Source**: BACKLOG.md → From PERF-008
**Goal**: Append build sizes (raw + gzip for CSS and JS) to `docs/size-history.json` after each build. Provides historical trend visibility for asset growth over time. Integrate into `report-sizes.js` post-build step.
**Day**: Friday March 21

---

## Weekly Challenge

### CHALLENGE-002: Project Detail Modal
**Source**: BACKLOG.md → Features → Project Detail Modal
**Goal**: Click a project card (outside of links) to open a centered overlay modal with extended project description, technical highlights, and screenshots. Key requirements:
- Accessible: focus trap, ESC to close, `aria-modal`, restore focus on close
- Mobile-friendly responsive design
- Lazy-load media to maintain fast initial load
- Clear visual hint that cards are clickable (hover state, cursor)
- Data structure decision: JSON file vs data attributes vs JS object
- Start with 1-2 projects populated, others can be added incrementally

This is a **v2.0 feature** that advances the portfolio toward richer project storytelling — a significant step beyond the current card-only view.
**Span**: Across the week alongside daily tasks

---

## Notes

- Portfolio rebuild completed 2026-01-20
- All core functionality working (v1.0 + most of v1.5)
- v1.1 polish complete: favicon, OG image, Lighthouse 100/100, links verified
- v1.5 features complete: theme toggle, filtering, scroll animations, 404 page
- Week of 2026-02-02: bug fixes, filter enhancements, performance, SEO, and accessibility (all complete)
- Week of 2026-02-09: performance, testing, code quality, SEO & polish (all 12 tasks complete)
- Week of 2026-02-17: CI/CD improvements, deeper test coverage, asset pipeline, Lighthouse CI challenge
- Week of 2026-03-17: CI deploy cleanup, JS linting, OG validation, Stylelint guard, size tracking + Project Detail Modal challenge
- Tasks are organized by priority
- Completed tasks move to [DONE.md](DONE.md)
- Each significant task should have a plan document in `docs/planning/plans/`
