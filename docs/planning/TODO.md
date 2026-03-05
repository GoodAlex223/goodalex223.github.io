# TODO

Active tasks and backlog.

**Last Updated**: 2026-03-05 (QUALITY-005 completed)

---

## In Progress

_None currently_

## Recently Completed

- **QUALITY-005**: Audit Remaining transition:all Usage → moved to [DONE.md](DONE.md)
- **SEO-007**: Automate Sitemap lastmod Updates → moved to [DONE.md](DONE.md)

---

## High Priority

_None currently_

---

## Medium Priority

_None currently_

---

## Low Priority (Stretch Goals)

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
