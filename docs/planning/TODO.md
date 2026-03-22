# TODO

Active tasks and backlog.

**Last Updated**: 2026-03-22 (BUG-004 completed)

---

## In Progress

_None currently_

## Recently Completed

- **BUG-004**: Filter Toggle-to-Reset Race Condition → moved to [DONE.md](DONE.md)
- **CHALLENGE-003**: Contact Form → moved to [DONE.md](DONE.md)
- **CHALLENGE-002**: Project Detail Modal → moved to [DONE.md](DONE.md)
- **QUALITY-008**: Stylelint Rule to Prevent `transition: all` → moved to [DONE.md](DONE.md)
- **TEST-006**: Automated OG Meta Tag Validation → moved to [DONE.md](DONE.md)
- **QUALITY-007**: ESLint Integration for JavaScript → moved to [DONE.md](DONE.md)
- **CHALLENGE-001**: Lighthouse CI in GitHub Actions → moved to [DONE.md](DONE.md)
- **QUALITY-006**: Test Server Error Handling → moved to [DONE.md](DONE.md)

---

## Week of 2026-03-24

### Mon — ~~TEST-007: Axe-core WCAG Scan for Modal~~ → moved to [DONE.md](DONE.md)

### Tue — ~~CONTENT-001: Populate Remaining Project Cards with Detail Data~~ → moved to [DONE.md](DONE.md)

### Wed — ~~QUALITY-009: ESLint Enhancements (Playwright plugin + no-console)~~ → moved to [DONE.md](DONE.md)

### Thu — ~~QUALITY-010: commitlint for Conventional Commits~~ → moved to [DONE.md](DONE.md)

### Fri — ~~CHALLENGE-003: Contact Form~~ → moved to [DONE.md](DONE.md)

---

## High Priority

_None currently_

---

## Medium Priority

### CONTENT-002: Define Project Portfolio Requirements
- Write clear criteria/rules for what qualifies a project to be showcased on the portfolio
- Audit all existing projects against the requirements
- All completed projects (no longer in active development) must be polished to near-production quality before showcasing
  - Review READMEs, documentation, code quality
  - Ensure demos/live links work
  - Fix any obvious rough edges

### CONTENT-003: Add Cleaning Site to Portfolio
- Add the cleaning site project as a new portfolio card
- Freeze its development (mark as completed)
- Note in the description that the entire MVP was built in one week (no polish or fixes applied)
- Add appropriate `data-project` entry in `data/projects.json` with detail data

### CONTENT-004: Update Project Information
- Review and update descriptions, tech stacks, links, and metadata for all existing project cards
- Ensure `data-updated` dates are accurate
- Verify all external links (GitHub repos, demos, simulations) are still live

---

## Low Priority (Stretch Goals)

---

## Weekly Challenge

### ~~CHALLENGE-003: Contact Form~~ (Completed 2026-03-21) → moved to [DONE.md](DONE.md)

---

## Notes

- Portfolio rebuild completed 2026-01-20
- All core functionality working (v1.0 + most of v1.5)
- v1.1 polish complete: favicon, OG image, Lighthouse 100/100, links verified
- v1.5 features complete: theme toggle, filtering, scroll animations, 404 page
- Week of 2026-02-02: bug fixes, filter enhancements, performance, SEO, and accessibility (all complete)
- Week of 2026-02-09: performance, testing, code quality, SEO & polish (all 12 tasks complete)
- Week of 2026-02-17: CI/CD improvements, deeper test coverage, asset pipeline, Lighthouse CI challenge
- Week of 2026-03-17: CI deploy cleanup, JS linting, OG validation, Stylelint guard, size tracking + Project Detail Modal challenge (all complete)
- Week of 2026-03-24: Modal a11y hardening, project content population, ESLint enhancements, commitlint, Contact Form challenge
- Tasks are organized by priority
- Completed tasks move to [DONE.md](DONE.md)
- Each significant task should have a plan document in `docs/planning/plans/`
