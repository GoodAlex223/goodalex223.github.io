# TODO

Active tasks and backlog.

**Last Updated**: 2026-02-24 (TEST-005 completed)

---

## In Progress

_None currently_

## Recently Completed

- **TEST-005**: Reduced Motion Accessibility Test → moved to [DONE.md](DONE.md)
- **CI-001**: Separate CI Workflow Jobs → moved to [DONE.md](DONE.md)
- **PERF-007**: JS Cache-busting for main.js → moved to [DONE.md](DONE.md)
- **TEST-004**: Theme-specific Axe Scanning → moved to [DONE.md](DONE.md)

---

## High Priority

_None currently_

---

## Medium Priority

### PERF-008: Build Size Reporting
**Source**: BACKLOG.md (from PERF-004, PERF-005)
**Description**: Add post-build script that logs before/after file sizes for CSS and JS assets. Provides visibility into asset growth over time. Consider gzip-size for transfer size reporting.
**Acceptance Criteria**:
- [ ] Build output shows file sizes (raw and gzip)
- [ ] CSS and JS sizes both reported
- [ ] Runs automatically after `npm run build`
- [ ] Clear, readable output format

### SEO-007: Automate Sitemap lastmod Updates
**Source**: BACKLOG.md (from SEO-001)
**Description**: Add a pre-build script or git hook that updates `sitemap.xml` `<lastmod>` date from git history when `index.html` changes. Currently requires manual updates.
**Acceptance Criteria**:
- [ ] `<lastmod>` automatically reflects last `index.html` change date
- [ ] Runs as part of build or pre-commit
- [ ] Only updates if date actually changed
- [ ] Works in CI environment

---

## Low Priority (Stretch Goals)

### QUALITY-005: Audit Remaining transition:all Usage
**Source**: BACKLOG.md (from POLISH-001)
**Description**: Search codebase for `transition: all` declarations that could cause unintended side effects (`.btn` and `.project-card__link` were already fixed in POLISH-001). Replace with explicit property lists.
**Acceptance Criteria**:
- [ ] No `transition: all` remains in CSS source files
- [ ] Each transition explicitly lists animated properties
- [ ] Existing behavior preserved (visual regression check)

### QUALITY-006: Test Server Error Handling
**Source**: BACKLOG.md (from TEST-001, code review finding 75/100)
**Description**: Add `.on('error')` handler to `scripts/serve.js` `.listen()` call. Currently, if port 4173 is in use, the error message is unclear.
**Acceptance Criteria**:
- [ ] Clear error message when port is already in use
- [ ] Suggests action (kill process or use different port)
- [ ] Handles EADDRINUSE and other common errors

---

## Weekly Challenge

### CHALLENGE-001: Lighthouse CI in GitHub Actions
**Source**: BACKLOG.md (from PERF-002), ROADMAP.md "Ongoing: Performance monitoring"
**Description**: Set up automated Lighthouse checks in the CI pipeline using `@lhci/cli`. Runs after deployment and alerts if performance scores drop below budget thresholds. Builds on last week's build tooling focus.
**Acceptance Criteria**:
- [ ] Lighthouse CI runs on every push to main
- [ ] Performance budget: all scores >= 90
- [ ] Results visible in PR checks or CI output
- [ ] Alerts on score regression

---

## Notes

- Portfolio rebuild completed 2026-01-20
- All core functionality working (v1.0 + most of v1.5)
- v1.1 polish complete: favicon, OG image, Lighthouse 100/100, links verified
- v1.5 features complete: theme toggle, filtering, scroll animations, 404 page
- Week of 2026-02-02: bug fixes, filter enhancements, performance, SEO, and accessibility (all complete)
- Week of 2026-02-09: performance, testing, code quality, SEO & polish (all 12 tasks complete)
- Week of 2026-02-17: CI/CD improvements, deeper test coverage, asset pipeline, Lighthouse CI challenge
- Tasks are organized by priority
- Completed tasks move to [DONE.md](DONE.md)
- Each significant task should have a plan document in `docs/planning/plans/`
