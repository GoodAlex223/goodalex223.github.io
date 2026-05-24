# Weekly Plan

**Week of**: May 4 - 8, 2026
**Created**: 2026-04-28
**Sources**: ROADMAP.md, BACKLOG.md, TODO.md, DONE.md, git log (Apr 11 - Apr 28)

**Context**: All v1.1/v1.5 roadmap items remain complete. The April 13-17 sprint cleared 28 SP across 6 batch groups, and PR #65 (Internal Asset Link Checking) merged today brought 6 fresh review follow-ups. Backlog now leans toward asset-checker polish, BACKLOG-validator hardening, test stability investigations, and the looming Node.js 24 GitHub Actions deadline (June 2, 2026). Continuing the "Quality & Hardening" phase.

---

## Parallel Work

- Monitor Formspree spam dashboard — CHALLENGE-003 backlog item (started ~Mar 21). 5+ weeks of data now available; user-side decision pending on whether reCAPTCHA v3 is needed.

---

## Task Groups

### 1. Test Stability Investigations — Domain: Testing — 5 SP *(solo, IMPORTANT)*
- Investigate pre-existing Firefox flaky test `tests/filter/accessibility.spec.js:44` "tabindex updates when filter changes" *(3 SP, IMPORTANT)* — Apr 16 review finding; recurs after the Apr 10 rapid-clicks fix used a different pattern
- Investigate pre-existing WebKit form submission flaky test `tests/form/submission.spec.js:36` "shows loading state during submission" *(2 SP)* — Apr 11 backlog item; intermittent `toBeHidden()` timeout

### 2. Asset Checker Polish & PR #65 Follow-ups `[batch]` — Domain: Build/CI — 7 SP
- Tighten case-sensitivity check to cover directory segments in `assetExists()` *(3 SP, IMPORTANT)* — PR #65 review finding (confidence 65); current basename-only check overstates Linux parity claim in JSDoc header
- Implement `dist/` preflight error message in `scripts/check-assets.js` *(1 SP, IMPORTANT)* — PR #65 review finding (confidence 90); spec promised this targeted message but generic ✗ ships today
- Harden JSON walk against non-flat `projects` shape *(1 SP)* — PR #65 review finding (confidence 80); add typeof guard before `project.screenshots`
- Improve generic "not found" error message on CI failure *(1 SP)* — PR #65 review finding (confidence 85); current "Run from project root" is misleading on CI
- Align output format between `check-links.js` (brackets) and `check-assets.js` (parens) *(1 SP)* — PR #65 review finding; consistent CI output

### 3. BACKLOG Validator Hardening `[batch]` — Domain: JS Logic — 7 SP
- Extend `validate-backlog-paths.js` to catch `docs/superpowers/` Origin paths *(2 SP, IMPORTANT)* — PR #62/PR #64 review finding (confidence 75); same broken-origin-path bug now recurs with `docs/superpowers/` references
- Read BACKLOG.md from git index (`git show :path`) and handle staged-deletion ENOENT *(3 SP)* — combines PR #64 reviews (confidence 50 + 75); single fix via `git show :docs/planning/BACKLOG.md` solves both
- Tighten pre-commit grep pattern to `grep -qE '(^|/)BACKLOG\.md$'` *(1 SP)* — PR #64 review finding (confidence 35); avoid hypothetical `OLD_BACKLOG.md` matches
- Add `npm run validate-backlog` script *(<1 SP)* — Apr 16 backlog; mirrors `npm run check-links` discoverability
- Add success output `console.log('BACKLOG Origin paths: OK')` *(<1 SP)* — Apr 16 backlog; consistency with other gate scripts

### 4. Node.js 24 GitHub Actions Upgrade — Domain: CI/Build — 3 SP *(solo, IMPORTANT)*
- Upgrade all GitHub Actions to Node.js 24-compatible versions before June 2, 2026 deadline — `actions/checkout@v4`, `actions/setup-node@v4`, `actions/upload-artifact@v4`, `actions/download-artifact@v4`, `actions/configure-pages@v4`, `actions/deploy-pages@v4`. Verify each major version's Node 24 support; otherwise set `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24=true` opt-in env var

### 5. Documentation Refresh `[batch]` — Domain: Docs — 4 SP
- Update ROADMAP.md to reflect current "Quality & Hardening" phase *(2 SP)* — last updated 2026-01-26; all v1.0/v1.1/v1.5 items complete; flagged in previous WEEKLY transition notes
- Document shell gotcha (`&&` vs `if/fi` with `grep` exit code) in CLAUDE.md *(1 SP)* — Apr 16 review finding; prevent recurrence of pre-commit hook trap
- Cleanup: remove duplicate plans/specs from `docs/superpowers/` *(1 SP)* — recurring item from PR #61, #62, #63 reviews; one-pass cleanup of all stragglers

### 6. Replace `waitForScrollAnimations()` with Deterministic Polling — Domain: Testing — 5 SP *(Weekly Challenge 🏆)*
- Replace 700ms fixed-timeout `waitForScrollAnimations()` with DOM-state polling (mirrors `waitForAnimationComplete()` pattern from PR #62) — used in ~20 test locations across all suites; eliminates browser-timing variance and a recurring source of axe-scan flakes

---

## Daily Schedule

### Monday — Test Flake Investigations (5 SP)

**Test Stability Investigations** — 5 SP *(solo, IMPORTANT)*
- [x] Investigate Firefox `accessibility.spec.js:44` flake *(3 SP, IMPORTANT)*
- [x] Investigate WebKit `submission.spec.js:36` flake *(2 SP)*

### Tuesday — Asset Checker Polish (7 SP)

**Asset Checker Polish & PR #65 Follow-ups** `[batch]` — 7 SP
- [x] Tighten case-sensitivity check to cover directory segments *(3 SP, IMPORTANT)*
- [x] Implement `dist/` preflight error message *(1 SP, IMPORTANT)*
- [x] Harden JSON walk against non-flat `projects` shape *(1 SP)*
- [x] Improve generic "not found" error message on CI *(1 SP)*
- [x] Align output format between `check-links.js` and `check-assets.js` *(1 SP)*

### Wednesday — BACKLOG Validator Hardening (7 SP)

**BACKLOG Validator Hardening** `[batch]` — 7 SP
- [x] Extend regex to catch `docs/superpowers/` Origin paths *(2 SP, IMPORTANT)*
- [x] Read BACKLOG.md from git index + handle staged-deletion ENOENT *(3 SP)*
- [x] Tighten pre-commit grep pattern *(1 SP)*
- [x] Add `npm run validate-backlog` script *(<1 SP)*
- [x] Add success output to validator *(<1 SP)*

### Thursday — CI Deadline & Docs (7 SP)

**Node.js 24 GitHub Actions Upgrade** — 3 SP *(solo, IMPORTANT)*
- [x] Upgrade all GitHub Actions to Node.js 24-compatible versions *(3 SP, IMPORTANT)*

**Documentation Refresh** `[batch]` — 4 SP
- [x] Update ROADMAP.md to reflect "Quality & Hardening" phase *(2 SP)*
- [x] Document `&&` vs `if/fi` shell gotcha in CLAUDE.md *(1 SP)*
- [x] Remove duplicate plans/specs from `docs/superpowers/` *(1 SP)*

### Friday — Weekly Challenge (5 SP)

**Replace `waitForScrollAnimations()` with Deterministic Polling** — 5 SP
- [x] 🏆 Replace 700ms fixed-timeout helper with DOM-state polling across ~20 test locations *(5 SP, IMPORTANT — completed 2026-05-17)*

---

## Summary Table

| Group | Domain | Tasks | Total SP | Day | Status |
|-------|--------|-------|----------|-----|--------|
| Test Stability Investigations | Testing | 2 | 5 | Mon | ⏳ Planned |
| Asset Checker Polish & PR #65 Follow-ups `[batch]` | Build/CI | 5 | 7 | Tue | ⏳ Planned |
| BACKLOG Validator Hardening `[batch]` | JS Logic | 5 | 7 | Wed | ✅ Done |
| Node.js 24 GitHub Actions Upgrade | CI/Build | 1 | 3 | Thu | ✅ Done |
| Documentation Refresh `[batch]` | Docs | 3 | 4 | Thu | ✅ Done |
| 🏆 Replace `waitForScrollAnimations()` | Testing | 1 | 5 | Fri | ✅ Done |
| **Total** | | **17** | **31** | | |

---

## Notes

### Context
- **Velocity**: April 13-17 sprint completed 28 SP across 5 days (5.6 SP/day). This week targets 31 SP (6.2 SP/day) — slightly above prior-week velocity but matches the longer-term 6 SP/day baseline.
- **No carry-forward**: All April 13-17 tasks complete (PRs #60-#65 all merged). Clean slate.
- **Fresh backlog inflow**: PR #65 merged today added 6 review follow-ups; 5 of them batched into Tuesday's Asset Checker Polish group.

### Weekly Challenge: Replace `waitForScrollAnimations()` with Deterministic Polling
**Type**: Technical deep-dive extending recent test infrastructure work.
**Why chosen**: The 700ms fixed-timeout helper is the last remaining piece of timing-based test waits — `waitForFilterAnimation()` was already replaced with `waitForAnimationComplete()` in PR #62, eliminating Firefox flakes. Extending the same DOM-polling pattern to scroll animations would close out the test-flake reduction theme that has run through the past four sprints, with ~20 call sites benefiting. Listed in the Apr 11 backlog with a note about ~20 test locations and was implicitly suggested by April's series of reduced-motion optimizations.

### Dependencies & Sequencing
- **Monday's flake investigations are timeboxed to 5 SP**: if either test's root cause exceeds budget, document findings and defer the fix. Do not rabbit-hole — the goal is diagnosis with a fix proposal, not a guaranteed fix this week.
- **Tuesday's case-sensitivity work is the riskiest implementation item** (3 SP, cross-platform path-segment walking); attempt early in the day. The four 1 SP polish items can ship as a partial PR if directory-walking expands scope.
- **Wednesday's `git show :path` switch resolves two backlog items together**: switching from `fs.readFileSync` to `git show :docs/planning/BACKLOG.md` simultaneously fixes the working-tree-vs-staged-content drift and the staged-deletion ENOENT trap. Choose this over individual fixes.
- **Thursday combines the deadline-driven Node.js 24 upgrade with low-risk doc work**: total 7 SP, but the docs batch is splittable if Node.js 24 verification reveals incompatibilities.
- **Friday's challenge depends on Wednesday's BACKLOG-validator work being merged**: not technically blocking, but cleaner to land sequential validator changes before opening a 20-file test refactor.

### Risks
- **Firefox `accessibility.spec.js:44` flake** (Mon): root cause may be deeper than the rapid-clicks fix from Apr 10 — tabindex update fires inside an animation step that Firefox may schedule differently. If investigation exceeds 3 SP, document and defer.
- **WebKit `submission.spec.js:36` flake** (Mon): historically WebKit has had bespoke timing differences for visibility transitions — solution may be a WebKit-specific guard rather than a generic fix.
- **Cross-platform path-segment walking** (Tue): Linux is case-sensitive, macOS is case-insensitive (HFS+/APFS default), Windows is case-insensitive. Walking each segment via `fs.readdirSync` per directory level should give Linux-equivalent behavior on any host but adds complexity over the current basename check.
- **Node.js 24 action versions** (Thu): if any required action does not yet have a Node 24-compatible major release, fall back to the `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24=true` env var as a stopgap and queue an upgrade follow-up for when the major release ships.
- **`waitForScrollAnimations()` replacement scope** (Fri): ~20 call sites is the count from the backlog note; actual usage may be wider once `tests/utils/timing.js` is grep'd. If scope blows past 5 SP, ship the helper + 5-10 highest-impact suites and queue the remainder.

### Transition Notes
- The April series of PRs (#60-#65) has thoroughly cleared accumulated review debt; the May 4-8 plan is the first sprint where roughly half the work originates from outside that review-debt stream (Node.js deadline + ROADMAP refresh + scroll-animation challenge).
- After this week, the natural pivot is back toward content/feature work: `CONTENT-005` (capture detail screenshots for 4 projects) and showcase-repo work for `social-stats` are the next clean candidates.
- ROADMAP.md will get its first content update since January after Thursday's docs batch — sets context for the post-hardening phase.

---

## Previous Week Summary

### Week of April 13 - 17, 2026

**Focus**: Form polish, CI hardening, test stability (Firefox/WebKit), code quality, internal-asset link checking

| Task | Outcome |
|------|---------|
| Form & A11Y Polish (PR #60) | Done — SVG `aria-hidden`, input `color` transition, test migration |
| CI Hardening (PR #61) | Done — `cache: 'npm'`, ESLint root-config ignores, JSDoc header |
| Firefox & Test Audit (PR #62) | Done — DOM polling waits, Firefox rapid-clicks fix, hardcoded counts audit |
| Test Robustness (PR #63) | Done — locator-based modal a11y assertions, reduced-motion axe-scan optimization |
| Code Quality batch (PR #64) | Done — BACKLOG Origin path validator, `checkBatch` inline, `filterProjects` JSDoc |
| 🏆 Internal Asset Link Checking (PR #65) | Done — `scripts/check-assets.js` + CI integration; merged 2026-04-28 |

**Velocity**: 28 SP across 5 working days (5.6 SP/day). All 14 tasks completed including weekly challenge.

**Key Learnings**:
- The `waitForAnimationComplete()` DOM-polling pattern eliminated Firefox rapid-clicks flakes — same approach now extends to scroll animations as this week's challenge.
- Pre-commit hooks need `if/fi`, not `&&`, when conditional grep is involved — failing grep exit code (1) blocks all commits otherwise. Documented in CLAUDE.md as a gotcha; this week's docs batch elevates it.
- BACKLOG-Origin-path bug recurs across PRs even with the new validator (it only catches `docs/planning/plans/`, not `docs/superpowers/`); regex extension batched into Wednesday's group.
- PR #65 review surfaced 6 follow-ups despite the new code-review skills — the Linux-CI claim in `assetExists()` JSDoc was overstated, motivating Tuesday's case-sensitivity work.
