# Weekly Plan

**Week of**: April 13 - 17, 2026
**Created**: 2026-04-08
**Sources**: ROADMAP.md, BACKLOG.md, TODO.md, DONE.md, git log (Mar 25 - Apr 8)

**Context**: All v1.1/v1.5 roadmap items complete. Last two weeks delivered contact form a11y hardening, code quality fixes, test quality improvements, and automated link checking (PRs #56-#59). Backlog is rich with code review findings across a11y, testing, CI, and code quality domains. This week focuses on closing out accumulated debt from recent PRs and hardening the test/CI pipeline.

---

## Parallel Work

- Monitor Formspree spam dashboard (CHALLENGE-003 backlog: decide on reCAPTCHA v3 after 2-4 weeks — started ~Mar 21)
- GitHub Actions Node.js 24 upgrade tracking (deadline: June 2, 2026)

---

## Task Groups

### 1. Form & A11Y Polish `[batch]` — Domain: CSS/A11Y — 4 SP
- Add `aria-hidden="true"` to decorative SVGs in `showFormStatus()` *(1 SP)* — PR #56 review finding
- Add `color` to `.contact-form__input` component-level transition *(2 SP)* — PR #56 review finding, text snaps on theme switch
- Complete `test.expect()` → `expect()` migration in `submission.spec.js` *(1 SP)* — PR #56 review finding, lines 69 & 118

### 2. CI Hardening `[batch]` — Domain: CI/Build — 4 SP
- Add `cache: 'npm'` to `check-links` CI job's `setup-node` step *(1 SP)* — PR #59 review finding
- Add remaining root config files to ESLint `ignores` array *(2 SP)* — PR #57 backlog item
- Add file-level JSDoc comment to `scripts/check-links.js` *(1 SP)* — PR #59 review finding

### 3. Firefox & Test Audit `[batch]` — Domain: Testing — 5 SP
- Fix pre-existing flaky Firefox filter accessibility test *(3 SP)* — `aria-pressed` timing issue in Firefox, IMPORTANT
- Audit test files for hardcoded project counts *(2 SP)* — replace fragile literals with constants

### 4. Test Robustness `[batch]` — Domain: Testing — 5 SP
- Replace remaining `page.evaluate` calls in modal accessibility tests with web-first assertions *(3 SP)* — IMPORTANT, lines 40/51/70 in accessibility.spec.js
- Apply reduced-motion `waitForScrollAnimations()` optimization to form/filter axe-scan suites *(2 SP)* — extend pattern from PR #58

### 5. Code Quality `[batch]` — Domain: JS Logic — 5 SP
- Automate BACKLOG Origin path validation *(3 SP)* — IMPORTANT, same broken-origin-path bug recurred in PRs #51, #56, #57
- Replace `checkBatch` callback parameter with direct `checkUrl` call *(1 SP)* — unnecessary indirection
- Update `filterProjects()` JSDoc to document eager `currentFilter` update contract *(1 SP)* — BUG-004 review finding

### 6. Internal Asset Link Checking — Domain: Build/CI — 5 SP *(Weekly Challenge)*
- Extend `check-links.js` to verify local resources (images, fonts) referenced in HTML exist on disk *(5 SP)*

---

## Daily Schedule

### Monday — Form Polish & CI Cleanup (8 SP)

**Form & A11Y Polish** `[batch]` — 4 SP ✅
- [x] Add `aria-hidden="true"` to decorative SVGs in `showFormStatus()` *(1 SP)*
- [x] Add `color` to `.contact-form__input` component-level transition *(2 SP)*
- [x] Complete `test.expect()` → `expect()` migration in `submission.spec.js` *(1 SP — already done in prior commit)*

**CI Hardening** `[batch]` — 4 SP ✅
- [x] Add `cache: 'npm'` to `check-links` CI job's `setup-node` step *(1 SP)*
- [x] Add remaining root config files to ESLint `ignores` array *(2 SP)*
- [x] Add file-level JSDoc comment to `scripts/check-links.js` *(1 SP)*

### Tuesday — Test Stability (5 SP)

**Firefox & Test Audit** `[batch]` — 5 SP
- [ ] Fix pre-existing flaky Firefox filter accessibility test *(3 SP, IMPORTANT)*
- [ ] Audit test files for hardcoded project counts *(2 SP)*

### Wednesday — Test Modernization (5 SP)

**Test Robustness** `[batch]` — 5 SP
- [x] Replace remaining `page.evaluate` in modal accessibility tests *(3 SP, IMPORTANT)*
- [x] Apply reduced-motion `waitForScrollAnimations()` optimization to form/filter suites *(2 SP)*

### Thursday — Code Quality (5 SP)

**Code Quality** `[batch]` — 5 SP
- [ ] Automate BACKLOG Origin path validation *(3 SP, IMPORTANT)*
- [ ] Replace `checkBatch` callback with direct `checkUrl` call *(1 SP)*
- [ ] Update `filterProjects()` JSDoc for eager currentFilter *(1 SP)*

### Friday — Weekly Challenge (5 SP)

**Internal Asset Link Checking** — 5 SP
- [ ] 🏆 Extend `check-links.js` to verify local resources (images, fonts, CSS refs) exist on disk *(5 SP)*

---

## Summary Table

| Group | Domain | Tasks | Total SP | Day | Status |
|-------|--------|-------|----------|-----|--------|
| Form & A11Y Polish `[batch]` | CSS/A11Y | 3 | 4 | Mon | ✅ Done |
| CI Hardening `[batch]` | CI/Build | 3 | 4 | Mon | ✅ Done |
| Firefox & Test Audit `[batch]` | Testing | 2 | 5 | Tue | Planned |
| Test Robustness `[batch]` | Testing | 2 | 5 | Wed | ✅ Done |
| Code Quality `[batch]` | JS Logic | 3 | 5 | Thu | Planned |
| 🏆 Internal Asset Link Checking | Build/CI | 1 | 5 | Fri | Planned |
| **Total** | | **14** | **28** | | |

---

## Notes

### Context
- **Velocity**: Previous week completed 30 SP across 5 days (6 SP/day). Targeting 5.6 SP/day this week (28 SP total) — slightly conservative because Tuesday's Firefox flaky test is investigative.
- **No carry-forward**: All previous week tasks complete. Clean slate.

### Weekly Challenge: Internal Asset Link Checking
**Type**: Technical deep-dive extending recent work.
**Why chosen**: The automated link checker (PR #59) only validates external URLs. Broken local asset references (images, fonts) would only surface as visual regressions or Lighthouse failures. This extends a fresh, well-understood script with a complementary capability, adding lasting CI value with low architectural risk.

### Dependencies
- Monday's two batch groups are independent — can be developed as separate branches or combined.
- Tuesday's Firefox flaky test fix is investigative — if root cause is deeper than expected, the hardcoded counts audit can still proceed independently.
- Wednesday's test modernization builds on patterns established in PR #58 (test quality improvements).
- Thursday's BACKLOG path validation could be a pre-commit hook or CI script — design decision during implementation.

### Risks
- **Firefox flaky test** (Tue): Root cause unknown — could be animation timing, Playwright Firefox driver, or a genuine race condition. If investigation exceeds 3 SP, timebox and document findings for a future attempt.
- **Modal page.evaluate replacement** (Wed): Some `page.evaluate` calls query complex DOM state (focus trap counting, dialog containment). May need new POM helper methods rather than simple web-first assertion swaps.
- **BACKLOG path validation** (Thu): Need to decide between pre-commit hook (fast feedback but adds hook complexity) vs CI check (simpler but catches later). Pre-commit hook recommended given existing husky infrastructure.

### Transition Notes
- ROADMAP.md remains stale (last updated Jan 2026) — all v1.1/v1.5 items complete. Consider updating to reflect current "Quality & Hardening" phase after this week.
- After this week, the backlog of code review findings from PRs #51-#59 will be substantially cleared, enabling a shift toward new feature work or content tasks.

---

## Previous Week Summary

### Week of March 30 - April 7, 2026

**Focus**: Debt cleanup, accessibility hardening, test quality, CI link checking

| Task | Outcome |
|------|---------|
| Consolidate docs/superpowers/ | Done — archived to standard structure (PR #55) |
| Update archive/README.md index | Done — specs/ subdirectory indexed |
| Rename + move CONTENT-002 spec | Done |
| Archive CONTENT-003 spec | Done |
| Form submission focus management | Done — showFormStatus() focus flow (PR #56) |
| Form inputs focus-visible pattern | Done — transparent outline base + outline-color only |
| Form status theme transition | Done |
| Fix lint-staged ESLint ignores | Done — scoped to project directories (PR #57) |
| Fix CLAUDE.md duplicate lint docs | Done |
| Update "Adding New Projects" template | Done |
| Web-first assertions in form tests | Done — toBeFocused() replaces page.evaluate (PR #58) |
| Reduced motion test efficiency | Done — removed double nav in modal axe-scan |
| Add rule-indicators screenshot assertion | Done |
| 🏆 Automated link checking in CI | Done — HEAD/GET fallback, retry, LinkedIn skip (PR #59) |

**Velocity**: 30 SP completed in 5 working days (6 SP/day). All 14 tasks completed, including weekly challenge.

**Key Learnings**:
- Code review findings from each PR consistently generate 2-4 new backlog items — this is healthy but means the backlog grows even as it shrinks
- LinkedIn's HTTP 999 bot-blocking required a skip-list approach — documented as a gotcha in CLAUDE.md
- The reduced-motion test optimization pattern (skip waitForScrollAnimations) is applicable across all axe-scan suites — will extend this week
