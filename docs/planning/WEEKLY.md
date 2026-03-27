# Weekly Plan

**Week of**: March 30 - April 3, 2026
**Created**: 2026-03-27
**Sources**: ROADMAP.md, BACKLOG.md, TODO.md, DONE.md, git log (Mar 13-27)

**Context**: v1.1/v1.5 roadmap phases complete. Recent weeks focused on content population (CONTENT-001 through CONTENT-004), quality tooling (ESLint enhancements, commitlint), and the contact form challenge. This week shifts to debt cleanup, accessibility hardening, and test quality — areas where backlog items have accumulated from code reviews.

---

## Parallel Work

- Monitor Formspree spam dashboard (CHALLENGE-003 backlog: decide on reCAPTCHA v3 after 2-4 weeks)
- GitHub Actions Node.js 24 upgrade tracking (deadline: June 2, 2026)

---

## Daily Tasks

### Monday — Documentation Debt & Archive Cleanup (7 pts)

- [ ] **Consolidate `docs/superpowers/` into standard directory structure** — Move plan/spec files to `docs/archive/plans/` and `docs/archive/specs/`, update DONE.md references, update `docs/README.md` index *(IMPORTANT, 3 pts)*
- [ ] **Update `docs/archive/README.md` to index `specs/` subdirectory** — Created by BUG-004 PR but never documented *(IMPORTANT, 2 pts)*
- [ ] **Rename + move CONTENT-002 design spec** — Fix hyphen→underscore in filename, move from `archive/plans/` to `archive/specs/` *(1 pt)*
- [ ] **Archive CONTENT-003 design spec** — Move from `docs/superpowers/specs/` to `docs/archive/specs/` *(1 pt)*

### Tuesday — Contact Form Accessibility Hardening (6 pts)

- [ ] **Add focus management after form submission** — `showFormStatus()` hides form but doesn't move focus to status container; keyboard/screen reader users lose context *(IMPORTANT, 3 pts)*
- [ ] **Align form inputs with focus-visible pattern** — Use `outline-color` only in `:focus-visible` (not full `outline` shorthand), add base transparent outline per CLAUDE.md convention *(2 pts)*
- [ ] **Add `.contact-form__status` to theme transition group** — Smooth theme switching when status message is visible *(1 pt)*

### Wednesday — Code Quality & Lint Fixes (6 pts)

- [ ] **Fix lint-staged `*.js` glob bypassing ESLint ignores** — Direct filename passing may skip flat config `ignores` array for root config files; scope lint-staged to explicit directories *(IMPORTANT, 3 pts)*
- [ ] **Fix CLAUDE.md duplicate JS Linting descriptions** — Build System section and Code Conventions section have inconsistent ignores lists *(IMPORTANT, 2 pts)*
- [ ] **Update "Adding New Projects" template in CLAUDE.md** — Add `data-animate` and `data-animate-delay` attributes that every real card uses but template omits *(1 pt)*

### Thursday — Test Quality Improvements (6 pts)

- [ ] **Replace `page.evaluate` with web-first assertions in form tests** — Use `expect(locator).toBeFocused()` instead of `page.evaluate(() => document.activeElement.id)` in `validation.spec.js`; use imported `expect()` over `test.expect()` *(IMPORTANT, 3 pts)*
- [ ] **Reduced motion test efficiency** — Remove double navigation in `modal/axe-scan.spec.js`, skip `waitForScrollAnimations()` under reduced motion *(2 pts)*
- [ ] **Add `expectScreenshotsCount` to `rule-indicators` test** — Has 2 screenshots in JSON but `basic-modal.spec.js` omits the assertion *(1 pt)*

### Friday — Weekly Challenge (5 pts)

- [ ] 🏆 **Automated link checking in CI** — Script or CI step that verifies all project GitHub/demo/simulation URLs return HTTP 200 on each deploy *(CHALLENGE, 5 pts)*

**Why this challenge**: After CONTENT-002/003/004 added and updated many project links across 8 cards, there's no automated guard against link rot. This is a technical deep-dive that adds lasting CI value and directly protects recent content work.

---

## Summary Table

| Task | Priority | Day | Points | Status |
|------|----------|-----|--------|--------|
| Consolidate docs/superpowers/ | IMPORTANT | Mon | 3 | Planned |
| Update archive/README.md index | IMPORTANT | Mon | 2 | Planned |
| Rename + move CONTENT-002 spec | NICE TO HAVE | Mon | 1 | Planned |
| Archive CONTENT-003 spec | NICE TO HAVE | Mon | 1 | Planned |
| Form submission focus management | IMPORTANT | Tue | 3 | Planned |
| Form inputs focus-visible pattern | NICE TO HAVE | Tue | 2 | Planned |
| Form status theme transition | NICE TO HAVE | Tue | 1 | Planned |
| Fix lint-staged ESLint ignores | IMPORTANT | Wed | 3 | Planned |
| Fix CLAUDE.md duplicate lint docs | IMPORTANT | Wed | 2 | Planned |
| Update "Adding New Projects" template | NICE TO HAVE | Wed | 1 | Planned |
| Web-first assertions in form tests | IMPORTANT | Thu | 3 | Planned |
| Reduced motion test efficiency | NICE TO HAVE | Thu | 2 | Planned |
| Add rule-indicators screenshot assertion | NICE TO HAVE | Thu | 1 | Planned |
| 🏆 Automated link checking in CI | CHALLENGE | Fri | 5 | Planned |
| **Total** | | | **30** | |

---

## Notes

### Context
- **Velocity**: Last week completed 5 planned tasks + 3 content tasks (CONTENT-002/003/004) across 4 days. Targeting ~6 pts/day (30 pts/week) is conservative but realistic for tasks requiring careful code review alignment.
- **No carry-forward**: All previous week tasks complete. Clean slate.

### Dependencies
- Monday's archive cleanup is prerequisite-free — front-loaded to establish clean docs state before code changes.
- Tuesday's form a11y work builds on CHALLENGE-003 (contact form) completed last week.
- Wednesday's lint-staged fix should be tested by committing a root config file change.
- Friday's link checker needs network access in CI — verify GitHub Actions allows outbound HTTP.

### Risks
- **lint-staged ESLint ignores** (Wed): May require changes to `package.json` and testing across all three ESLint environments. If flat config ignores work differently than expected, may need deeper investigation.
- **Link checker in CI** (Fri): External URL availability is non-deterministic. Need retry logic or soft-fail strategy to avoid flaky CI.

### Transition Notes
- ROADMAP.md is stale (last updated Jan 2026) — all v1.5 items are complete. Consider updating ROADMAP.md to reflect current phase (Quality & Content) if time permits.
- BACKLOG.md is rich with code review findings — most are low-confidence and optional. This week prioritizes items with real user impact (a11y, lint correctness).

---

## Previous Week Summary

### Week of March 24-27, 2026

**Focus**: Modal a11y, content population, quality tooling, contact form

| Task | Outcome |
|------|---------|
| TEST-007: Axe-core WCAG scan for modal | Completed — axe-core scanning for modal in light/dark themes |
| CONTENT-001: Populate remaining project cards | Completed — all 8 projects have modal detail data |
| QUALITY-009: ESLint enhancements | Completed — eslint-plugin-playwright + no-console rule |
| QUALITY-010: commitlint | Completed — Conventional Commits enforcement via husky hook |
| CHALLENGE-003: Contact form | Completed — Formspree with validation, honeypot, a11y |
| CONTENT-002: Portfolio requirements | Completed — requirements document, PR #52 merged |
| CONTENT-003: Add CleanSpark | Completed — new project card + modal data, PR #53 merged |
| CONTENT-004: Update project info | Completed — all 8 cards audited and updated, PR #54 merged |

**Velocity**: 8 tasks completed in 4 working days. High throughput driven by content tasks being well-scoped.

**Key Learnings**:
- GitHub API audit approach (CONTENT-004) was efficient for bulk updates
- docs/superpowers/ directory created organically but diverged from standard docs/planning/ structure — needs consolidation
- Code review findings are accumulating in BACKLOG.md — this week addresses the highest-impact ones
