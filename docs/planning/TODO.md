# TODO

Active tasks and backlog.

**Last Updated**: 2026-06-16 (Documentation Accuracy Sweep — Cleanup Week #1 Group B)

---

## In Progress

_None currently_

## Recently Completed

- **Documentation Accuracy Sweep** (Cleanup Week #1, Group B): verify-first docs pass — 3 `ROADMAP.md` edits (duplicate "Last Updated" footer removed; v1.5/v1.1 parallel-development footnote; bare-name cross-links + in-progress→completed transition comment) plus 4 items closed without edit (5a `check-backlog-structure` already synced via `687940a`; 5b Shell Gotchas reword sync-owned + accurate; 5c checkout@v4→v6 target obsolete after Group A prune; DONE "zero extra" verified correct in scope). 9 🟤 BACKLOG items resolved (5 done / 3 won't-do / 1 obsolete) + 2 follow-ups extracted. CLAUDE.md AUTO-MANAGED regions intentionally untouched. → moved to [DONE.md](DONE.md)
- **Script Robustness & Observability** (Cleanup Week #1, Group C): 6 defensive/observability edits across 2 CI scripts — `check-assets.js` dist-preflight non-directory guard (`readdirSync` try/catch) + "missing or empty" wording reconcile + `extractJsonRefs` JSDoc + stale-hash hint recolored RED→YELLOW; `validate-backlog-paths.js` working-tree-fallback `console.warn` + per-violation spec-vs-plans subtree fix-guidance. No happy-path change; manual-reproduction verification (no `scripts/` test harness); all 5 CI gates green. → moved to [DONE.md](DONE.md)
- **Test Infrastructure Cleanup** (Cleanup Week #1, Group D): drained the last fixed-timeout smells from the Playwright suite — generic `waitForOpacity(locator)` replacing `ModalPage`'s 300ms wait + inline poll, deterministic url-hash negative tests (Promise.all `waitForResponse` + JS-init signal), exported `SCROLL_OBSERVER_*` constants with a runtime-intercept guard test + a filter-hidden regression test, reduced-motion consistency calls, and removal of unused timing fns. Investigated and disproved the hypothesized reduced-motion modal focus gap. → moved to [DONE.md](DONE.md)
- **Backlog Restructure**: source-split `BACKLOG.md` (📌 Process Rules + 🔵 User-Flagged / 🟡 Operational / 🟤 Auto-Generated) with weekly SP quotas; lossless-for-open migration (234→237 open items, 117 completed pruned); `CLAUDE.md` Backlog Intake Rules section; new `scripts/check-backlog-structure.js` guard wired into husky + CI → moved to [DONE.md](DONE.md)
- **CI Deadline & Docs**: 4-deliverable PR #70 closing the 2026-06-02 Node 24 GitHub Actions deprecation deadline (7 action references bumped: checkout v4→v6, setup-node v4→v6, upload-artifact v4→v7, download-artifact v4→v8, configure-pages v4→v6, upload-pages-artifact v4→v5, deploy-pages v4→v5; `include-hidden-files: true` for lighthouse upload) plus ROADMAP phase restructure, CLAUDE.md Shell Gotchas elevation, and `docs/superpowers/` cleanup → moved to [DONE.md](DONE.md)
- **BACKLOG Validator Hardening**: 5-item hardening of `scripts/validate-backlog-paths.js` — denylist extension to `docs/superpowers/`, git-index read with two-level fallback, anchored detection regex (incl. bullet-prefixed Origin support), `npm run validate-backlog` script, CI lint-job gate closing `--no-verify` bypass → moved to [DONE.md](DONE.md)
- **Asset Checker Polish & PR #65 Follow-ups**: 6-item polish PR — `realpathSync.native` case canonicalization, hybrid `dist/` preflight + stale-hash hint, JSON walk hardening, CI error wording, brackets output format, HTML-regex JSDoc → moved to [DONE.md](DONE.md)
- **Test Stability Investigations**: WebKit loading-state flake resolved via new `mockFormspreeDeferred()` FormPage helper; Firefox tabindex flake investigated and marked NOT_REPRODUCING (150 local + 80+ CI runs all green) → moved to [DONE.md](DONE.md)
- **Internal Asset Link Checking** 🏆 (Weekly Challenge): new `scripts/check-assets.js` + CI integration — verifies internal asset refs exist on disk → moved to [DONE.md](DONE.md)
- **Code Quality**: BACKLOG Origin path validator + pre-commit hook, checkBatch inline refactor, filterProjects JSDoc eager-update contract → moved to [DONE.md](DONE.md)
- **Test Robustness**: Locator-based assertions for modal a11y, reduced-motion axe-scan optimization → moved to [DONE.md](DONE.md)
- **Firefox & Test Audit**: DOM polling filter waits, Firefox flaky test fix, hardcoded counts audit → moved to [DONE.md](DONE.md)
- **CI Hardening**: npm cache consistency, ESLint root config ignores, check-links JSDoc → moved to [DONE.md](DONE.md)
- **Form & A11Y Polish**: SVG aria-hidden fix, input color transition, backlog cleanup → moved to [DONE.md](DONE.md)
- **Automated Link Checking**: CI link checker script with HEAD/GET fallback, retry, User-Agent, LinkedIn skip-list → moved to [DONE.md](DONE.md)
- **Test Quality Improvements**: web-first assertions, reduced-motion efficiency, missing screenshot assertion → moved to [DONE.md](DONE.md)
- **Code Quality & Lint Fixes**: lint-staged glob fix + backlog cleanup → moved to [DONE.md](DONE.md)
- **Archive Cleanup**: Documentation Debt & Archive Cleanup → moved to [DONE.md](DONE.md)
- **CONTENT-004**: Update Project Information → moved to [DONE.md](DONE.md)
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

**Backlog Restructure — post-merge follow-ups** (out-of-repo; see [docs/archive/specs/2026-06-07_backlog-restructure-design.md](../archive/specs/2026-06-07_backlog-restructure-design.md) §5–6):

- [ ] Verify the local weekly-planning prompt against the 8-item checklist (spec §5) — add the 📌-Process-Rules-first instruction, 4 source/quota rules, carry-forward origin-quota rule, 🏆-defaults-to-🔵, `Source` summary column, mandatory `### Quota Check` subsection, and Cleanup-Week header awareness. Paste the prompt and I'll diff it.
- [ ] Run the first weekly plan under the new rules and confirm `### Quota Check` shows ✅ (🔵 ≥ 50%). Given the 🟤 bucket holds ~149 items, this will likely need to be declared a Cleanup Week — see the 🟤 "Calibrate the Cleanup-Week threshold" BACKLOG item.

---

## Medium Priority

### ~~CONTENT-003: Add Cleaning Site to Portfolio~~ → moved to [DONE.md](DONE.md)

### ~~CONTENT-004: Update Project Information~~ → moved to [DONE.md](DONE.md)

---

## Low Priority (Stretch Goals)

---

## Weekly Challenge

### ~~Automated Link Checking in CI~~ (Completed 2026-04-05) → moved to [DONE.md](DONE.md)

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
