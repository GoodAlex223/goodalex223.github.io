# Weekly Plan

**Week of**: May 25 - 29, 2026
**Created**: 2026-05-24
**Sources**: ROADMAP.md, BACKLOG.md, TODO.md, DONE.md, git log (May 8 - May 24)

**Context**: Pivot from the four-sprint Quality & Hardening test-infra streak back toward content/feature work. The May 4-8 plan completed cleanly (31 SP), then PR #69 (validator hardening), PR #70 (Node 24 CI + docs), and PR #71 (scroll-animation deterministic polling — last week's challenge, merged today) shipped between sprints. CONTENT-005 (4 project detail screenshots) is the natural next clean candidate, paired with the long-pending `social-stats` showcase repo. The weekly challenge closes the 14-day-old `pull_request:` CI-trigger gap surfaced in PR #70's Task-5 review.

---

## Parallel Work

- Monitor Formspree spam dashboard — CHALLENGE-003 carry-forward (started ~Mar 21). 9+ weeks of data now; user-side reCAPTCHA v3 decision still pending.

---

## Task Groups

### 1. CONTENT-005 — Detail Screenshots for 4 Projects `[batch]` — Domain: Content/Visual — 13 SP *(IMPORTANT)*

Single portfolio PR. For each project: capture 2 detail screenshots, resize, convert PNG → webp, place under `images/<project>/`, update `data/projects.json[*].screenshots[]`, update any modal tests that hardcode screenshot counts. PORTFOLIO_REQUIREMENTS.md identifies these 4 gaps; existing projects' screenshot pairs are the visual reference.

- Capture detail screenshots for **lubrication** *(3 SP, IMPORTANT)* — Wokwi-based hardware project; reuse existing simulation setup
- Capture detail screenshots for **hx711-scale** *(3 SP, IMPORTANT)* — Wokwi-based hardware project; reuse existing simulation setup
- Capture detail screenshots for **dropshipping** *(3.5 SP, IMPORTANT)* — Next.js web project; needs fresh local run
- Capture detail screenshots for **svg-processor** *(3.5 SP, IMPORTANT)* — Python project; needs fresh local run

### 2. New Portfolio Project — `social-stats` Showcase `[batch]` — Domain: Content/JS — 6 SP *(IMPORTANT)*

Two-step: (a) create the showcase repo with curated content from the main `social-stats` repo, then (b) add a 9th project card to the portfolio. The portfolio PR depends on the showcase repo existing (card links to it).

- Create `social-stats` showcase repo with curated subset of main repo *(3 SP)* — external repo creation
- Add `social-stats` project card to `index.html` + `data/projects.json` with "In Development" status *(3 SP)* — bump `data-animate-delay` chain for the new card; update count-dependent tests (filter category counts, hardcoded `expectScreenshotsCount`)

### 3. External Repo Maintenance — Domain: Content/Docs — 5 SP

Two solo items in the same domain; both touch external repos so each ships as its own PR.

- Refresh `rating_bot_showcase` from main `rating_bot` repo *(2 SP)* — showcase is currently a single Jan 2026 commit; sync curated subset of recent work
- Fix `svg-processor` README *(3 SP)* — translate Russian → English (or add English section), correct CairoSVG → svglib library reference (matches actual code)

### 4. Weekly Challenge — `deploy.yml` `pull_request:` Trigger — Domain: CI/Build — 5 SP *(IMPORTANT)* 🏆

PR #70 Task-5 finding (confidence 70). Currently the `lint → build → check-links + test + lighthouse` pipeline runs only on push-to-main, so feature-branch pushes have no CI validation — PRs #65/66/68/69/70 all merged with `statusCheckRollup: 0`. Adding the `pull_request:` trigger closes this gap.

- Add `pull_request:` trigger to `.github/workflows/deploy.yml` covering open/synchronize events
- Verify the `deploy` job is properly guarded (`environment: github-pages` may suffice; otherwise add explicit branch filter so feature-branch CI runs do not deploy)
- Test by opening a no-op PR and confirming the full pipeline runs without deploy step firing

---

## Daily Schedule

### Monday — Hardware Screenshots (6 SP)

**CONTENT-005 batch — hardware projects** *(part 1 of 2-day batch)*
- [ ] Capture detail screenshots for lubrication *(3 SP, IMPORTANT)*
- [ ] Capture detail screenshots for hx711-scale *(3 SP, IMPORTANT)*

### Tuesday — Web/Python Screenshots + PR (7 SP)

**CONTENT-005 batch — web/Python projects + PR finalization** *(part 2 of 2-day batch — closes single CONTENT-005 PR)*
- [ ] Capture detail screenshots for dropshipping *(3.5 SP, IMPORTANT)*
- [ ] Capture detail screenshots for svg-processor *(3.5 SP, IMPORTANT)*
- [ ] Update modal/test count assertions if needed, open + merge CONTENT-005 PR

### Wednesday — `social-stats` Showcase (6 SP)

**New Portfolio Project — `social-stats` Showcase** `[batch]` — 6 SP
- [ ] Create `social-stats` showcase repo with curated content *(3 SP)*
- [ ] Add `social-stats` project card to portfolio (`index.html` + `data/projects.json` + tests) *(3 SP)*

### Thursday — External Repo Refresh (5 SP)

**External Repo Maintenance** — 5 SP *(two separate external-repo PRs)*
- [ ] Refresh `rating_bot_showcase` from main `rating_bot` repo *(2 SP)*
- [ ] Fix svg-processor README (English translation + svglib library reference) *(3 SP)*

### Friday — Weekly Challenge 🏆 (5 SP)

**Add `pull_request:` Trigger to `deploy.yml`** — 5 SP *(solo, IMPORTANT)*
- [ ] 🏆 Add `pull_request:` trigger + verify deploy-job guard against feature-branch deploys *(5 SP, IMPORTANT)*

---

## Summary Table

| Group | Domain | Tasks | Total SP | Day | Status |
|-------|--------|-------|----------|-----|--------|
| CONTENT-005 Detail Screenshots `[batch]` | Content/Visual | 4 | 13 | Mon-Tue | ⏳ Planned |
| New Portfolio Project — `social-stats` `[batch]` | Content/JS | 2 | 6 | Wed | ⏳ Planned |
| External Repo Maintenance | Content/Docs | 2 | 5 | Thu | ⏳ Planned |
| 🏆 `deploy.yml` `pull_request:` Trigger | CI/Build | 1 | 5 | Fri | ⏳ Planned |
| **Total** | | **9** | **29** | | |

---

## Notes

### Context
- **Velocity**: May 4-8 sprint completed 31 SP across 5 days (6.2 SP/day). This week targets 29 SP (5.8 SP/day) — slightly under prior-week velocity to leave headroom for external-repo content work, which has higher discovery overhead than infra changes.
- **No formal carry-forward**: PRs #69, #70, #71 all merged between sprints; their post-merge review follow-ups (small ROADMAP/CLAUDE.md drift, validator observability, modal-open polling helper) are intentionally deferred to a future Quality & Hardening sprint — this week's theme is content pivot.

### Weekly Challenge: `deploy.yml` `pull_request:` Trigger
**Type**: Important CI infrastructure gap closure.
**Why chosen**: PR #70 Task-5 review surfaced that the existing `lint → build → check-links + test + lighthouse` pipeline runs only on push-to-main. Feature branches have no PR-time CI validation today — past PRs #65, #66, #68, #69, #70 all merged with `statusCheckRollup: 0` because there were no checks to fail. Closing this gap means action-version bumps, workflow YAML changes, and any future CI-relevant edits get caught at PR-open time rather than at merge-and-pray. Listed in BACKLOG at confidence 70 (important CI gap). Naturally closes the Quality & Hardening phase as the content sprint takes over.

### Dependencies & Sequencing
- **Mon-Tue CONTENT-005 batch is contiguous**: 13 SP single PR splits across two days. If any project's screenshots can't be captured (project won't run / no working state), ship the PR with the 2-3 completed batches and queue the remainder as a follow-up. Do NOT commit `screenshots: []` for failed batches — leave the existing empty array unchanged.
- **Wed `social-stats` is sequenced within-day**: showcase repo creation MUST land before the portfolio card PR opens (the card links to the showcase repo). Plan for the showcase repo to be live by mid-day.
- **Thu external-repo work is decoupled**: `rating_bot_showcase` and `svg-processor` README are in separate external repos with separate PR cycles. Either can ship first; neither blocks the other.
- **Fri `pull_request:` trigger validation requires a test PR**: best validated by opening a small no-op PR (e.g., a docs typo fix) after the trigger lands and confirming all check jobs run while deploy does not.

### Risks
- **CONTENT-005 dropshipping local run** (Mon-Tue): Next.js + Stripe + BullMQ + Postgres — requires either Docker compose up or a deployed instance. If neither is available, capture screenshots from a hosted demo if one exists, otherwise defer this batch to a future sprint.
- **CONTENT-005 svg-processor local run** (Mon-Tue): Python with svglib; verify a working venv can be set up against the actual code (not the stale README's CairoSVG reference). Conversion-output screenshots may need sample SVG inputs.
- **`social-stats` card addition** (Wed): bumping from 8 → 9 project cards may break tests that hardcode counts. Pre-flight check: `grep -r "8" tests/ | grep -i "project\|card\|count"` before starting; expected places are `tests/filter/*.spec.js` (category counts) and any `expectScreenshotsCount`-style assertions.
- **`pull_request:` trigger deploy guard** (Fri): the current `environment: github-pages` constraint may or may not prevent feature-branch deploys depending on GitHub Pages environment protection rules. If it does NOT, add an explicit `if: github.ref == 'refs/heads/main'` guard to the deploy job. Verify with a test PR before merging.

### Transition Notes
- After this week, the natural next direction depends on Friday's challenge outcome. If `pull_request:` CI gating reveals existing latent issues in feature-branch state (failing tests that were never caught), the following sprint pivots to whatever surfaces. If clean, the next sprint can resume Quality & Hardening follow-ups (modal-open polling helper, validator observability `console.warn`, helper-constants drift guard) OR continue content with project-detail-page exploration (v2.0 ROADMAP item).
- 9-project portfolio (post `social-stats`) is the upper end of current grid density; if more projects land next, consider revisiting the v2.0 "individual project detail pages" exploration to relieve the modal-content overload.

---

## Previous Week Summary

### Week of May 4 - 8, 2026

**Focus**: Test stability investigations, asset checker polish, BACKLOG validator hardening, Node.js 24 GitHub Actions deadline, documentation refresh, deterministic scroll-animation polling.

| Task | Outcome |
|------|---------|
| Test Stability Investigations (PR #66) | Done — WebKit form-submission flake fixed via `mockFormspreeDeferred()`; Firefox tabindex flake marked NOT_REPRODUCING after 150 local + 80+ CI runs |
| Asset Checker Polish & PR #65 Follow-ups (PR #68) | Done — `realpathSync.native` case canonicalization, `dist/` preflight + stale-hash hint, JSON walk hardening, CI error wording, output-format alignment |
| BACKLOG Validator Hardening (PR #69) | Done — denylist extension (`docs/superpowers/`), git-index read with fallback, anchored regex, `npm run validate-backlog`, CI lint-job gate |
| CI Deadline & Docs (PR #70) | Done — 7 GitHub Actions bumped to Node 24-compatible majors before 2026-06-02 deadline, ROADMAP phase restructure, CLAUDE.md Shell Gotchas, `docs/superpowers/` cleanup |
| 🏆 Scroll Animation Deterministic Polling (PR #71) | Done — `waitForScrollAnimations(page)` helper with opacity polling + observer-threshold matching + filter-hidden skip + reduced-motion short-circuit; 15 POM sites migrated, 3 duplicates removed; `--repeat-each=5` cross-browser green |

**Velocity**: 31 SP across 5 working days (6.2 SP/day); 17 tasks completed including weekly challenge. Note: PR #69 actually merged 2026-05-08, PR #70 merged 2026-05-14, PR #71 merged 2026-05-24 — the May 4-8 *plan* completed but actual PR cadence stretched across 17 calendar days due to review cycles and challenge complexity.

**Key Learnings**:
- The `mockFormspreeDeferred()` deferred-promise pattern (release function holding response open until tested) is the canonical solution for fixed-timeout route mocks in submission tests — should be the template for any future `setTimeout`-in-`page.route` patterns.
- Firefox tabindex flake stayed green for 150+ instrumented local runs and 80+ CI runs — surfaced a separate observation: `page.evaluate()` checkpoint instrumentation adds ~10-20ms latency that can mask race-condition flakes (instrumented = green, bare = flaky). Heisenbug discipline: take only post-action checkpoints when investigating timing-sensitive failures.
- The scroll-animation polling helper went through 3 correctness iterations mid-execution (class-only → opacity polling → observer-threshold matching → filter-hidden skip), each caught by cross-browser testing. The lesson: helper completeness requires testing all consumer patterns, not just the originally-affected suite.
- Node 24 GitHub Actions bumps required no `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24` opt-in env var — all required actions had Node-24-compatible majors available.
- The `.github/workflows/deploy.yml` lack-of-`pull_request:`-trigger gap was discovered during PR #70 Task 5 final review; surfaced as BACKLOG follow-up (confidence 70). Closing it is this week's challenge.
