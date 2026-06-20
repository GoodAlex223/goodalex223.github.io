# Weekly Plan

**Week of**: June 22 - 26, 2026
**Created**: 2026-06-18
**Sources**: ROADMAP.md, BACKLOG.md (📌 Process Rules + 🔵/🟡/🟤 buckets), TODO.md, DONE.md, git log (Jun 4 - Jun 18), prior WEEKLY.md. _MILESTONES.md, GOALS.md, and REVIEW-QUEUE.md referenced by the planning template do not exist in this project — priorities drawn from ROADMAP + BACKLOG; REVIEW-QUEUE.md will be created on the first Weekly Reviews run (see Group F)._

**Context**: First **normal content week** after Cleanup Week #1 (June 8-12, all 5 groups A-E shipped via PRs #73-#77). This week executes the pivot the prior plan's transition note called for — back to 🔵 user-flagged **content** after the long Quality & Hardening streak. Centerpiece: fill the four projects with detail screenshots (restoring the stashed hardware-project WIP) and add a 9th project (`social-stats`) as the 🏆 challenge. Rounded out with the deferred 🟡 `deploy.yml` PR-trigger CI gap and the one accumulated 🟤 group (PR #77 review follow-ups). This re-confirms the source-split BACKLOG works as intended: with the 🟤 bucket drained, a normal week now sustainably clears the ≥50% 🔵 quota (75% this week).

---

## Parallel Work

- **Monitor Formspree spam dashboard** — CHALLENGE-003 carry-forward (started ~Mar 21). 🟡 Operational watch; user-side reCAPTCHA v3 decision still pending. No SP (passive).
- **Bing indexing spot-check** — SEO-005 carry-forward; glance at Bing Webmaster Tools for index coverage. 🟡 Operational, passive. No SP.

---

## Task Groups

Normal-week quota in force: ≤1 group from 🟤 Auto-Generated (Group E only), 🟤 + 🟡 each ≤25% of weekly SP, 🔵 ≥50%. The Weekly Reviews batch (Group F) is ⚪ Overhead and excluded from the quota denominator.

### A. Project Screenshots & Conversion Utility `[batch]` — 🔵 — 7 SP — Domain: Content/Build *(IMPORTANT)*

One PR. Fills the four `"screenshots": []` gaps in `data/projects.json` (lines 123/148/173/197 — dropshipping, lubrication, hx711-scale, svg-processor) with 2 detail screenshots each, matching the existing projects' pattern. Build the conversion tool **first**, then capture/process all four. Restores the stashed hardware-project WIP rather than redoing it.

- Add `scripts/convert-screenshot.js` PNG→webp utility (resize + compress) — replaces the ad-hoc `sharp` install used in CONTENT-003; reused for all four projects below *(2 SP, 🔵 from CONTENT-003)*
- Restore + finish the 2 stashed hardware projects (lubrication, hx711-scale): `git checkout content/content-005-hardware-screenshots && git stash pop` (stash@{0}), then wire `screenshots[]` into `projects.json` *(2 SP, 🔵 from CONTENT-005/CONTENT-001)*
- Capture + wire dropshipping + svg-processor detail screenshots *(3 SP, 🔵 from CONTENT-005/CONTENT-001)*

> Gotchas: run `npm run build && npm run check-assets` after wiring — the asset checker gates new `screenshots[].src` refs. No card-date change needed unless a project's "meaningful commit" date moved (see Date-Sync gotcha).

### B. social-stats Showcase + 9th Project Card 🏆 — 🔵 — 5 SP — Domain: Content *(solo)*

The weekly challenge. Strategic feature: expands the portfolio from 8 → 9 projects and exercises the "In Development" status path. Use the **`add-project` skill** (handles the card + modal entry + the per-card invariants).

- Create/refresh a public showcase repo for [social-stats](https://github.com/GoodAlex223) suitable for portfolio linking *(2 SP)*
- Add the 9th project card (index.html) + `data/projects.json` modal entry with `status: "In Development"` — increment `data-animate-delay` by 50ms from the last card; sync the date across all 4 locations *(3 SP)*

### C. Dropshipping Content Accuracy `[batch]` — 🔵 — 3 SP — Domain: Content

One PR. Two CONTENT-001 accuracy items on the dropshipping entry. Edits the `description`/`tech` fields (distinct from Group A's `screenshots[]` field on the same entry) — sequence **after** Group A merges (or rebase) to avoid a `projects.json` conflict.

- Verify dropshipping description accuracy vs the actual repo (Next.js 14 App Router, BullMQ, Stripe, 249 unit-test claims) *(2 SP, 🔵)*
- Reconcile dropshipping card tech vs modal tech — card shows 4 (`TypeScript, React, Docker, Vercel`); JSON has 6 (`…Next.js, PostgreSQL, Stripe…`, no `Vercel`); pick one canonical set *(1 SP, 🔵, code-review finding conf 50)*

### D. deploy.yml PR Trigger — 🟡 — 3 SP — Domain: CI/Build *(solo, risk-heavy → front-load)*

The deferred operational CI gap (conf 70, important). Solo PR — CI-workflow edits have deploy blast radius, so isolate and run first.

- Add a `pull_request:` trigger so `lint → build → check-links + test + lighthouse` runs on PR open/update (today merge-time is the only gate — PRs #65/#66/#68/#69/#70 all had `statusCheckRollup: 0`) *(3 SP, 🟡 from CI Deadline & Docs)*

> Guard the `deploy` job so it never deploys from a feature branch — verify the existing `environment: github-pages` gate suffices; add a branch condition if not.

### E. PR #77 Review Follow-ups `[batch]` — 🟤 — 2 SP — Domain: Scripts/Docs

The single permitted 🟤 group this week. Both items are PR #77 code-review follow-ups (accumulated, not spread). The LINK_HREF fix-recipe was already corrected in BACKLOG (commit `00a8e87`).

- Fix `LINK_HREF` in `scripts/check-archived-links.js` to exclude external URLs via negative lookahead `/\]\((?!https?:)[^)]*superpowers\//` (keeps both local dead forms — `docs/superpowers/…` and relative `../superpowers/…`; do NOT anchor to `docs/superpowers/`, which drops the relative form) *(1 SP, 🟤 conf 50, latent correctness)*
- Reword the CLAUDE.md "Archived-Doc Link Hygiene" intro so its scope matches the code (all three detection forms, not just nav-pointer lines) *(1 SP, 🟤 conf 50, doc consistency)*

### F. Weekly Reviews `[batch]` — ⚪ Overhead — 4 SP — Domain: Research

Recurring exempt overhead (excluded from the quota denominator). Read [REVIEW-QUEUE.md](REVIEW-QUEUE.md) first — it does not exist yet, so this first run **creates it** (Reviewed logs + Next-up parking per category). On any `adopt` verdict, file a 🟤 Auto-Generated BACKLOG entry.

- **Plugins (2 SP)** — review two independent tops: best not-yet-reviewed plugin from the official Claude plugin store, and separately the best from the wider internet; log each with its `source:`
- **Claude best-practices (1 SP)** — top not-yet-reviewed practice for Claude / Claude Code / Claude Design / Cowork
- **Non-Claude AI best-practices (1 SP)** — same, for AI models/tools other than Claude

---

## Daily Schedule

### Monday — CI Gate + Screenshot Tooling (5 SP)

**Group D — deploy.yml PR Trigger** — 🟡 — 3 SP *(run first; CI blast radius)*
- [x] Add `pull_request:` trigger to `.github/workflows/deploy.yml`; verify/guard the deploy job against feature-branch deploys *(3 SP)* — PR [#78](https://github.com/GoodAlex223/goodalex223.github.io/pull/78), verified green (gate ran, `deploy` skipped), pending merge

**Group A (part 1) — Conversion Utility** — 🔵 — 2 SP
- [ ] Add `scripts/convert-screenshot.js` PNG→webp utility (resize + compress) *(2 SP)*

### Tuesday — Project Screenshots (5 SP)

**Group A (part 2-3) — Screenshots for 4 projects** `[batch]` — 🔵 — 5 SP
- [ ] Restore stash@{0} on `content/content-005-hardware-screenshots`; wire lubrication + hx711-scale `screenshots[]` *(2 SP)*
- [ ] Capture + wire dropshipping + svg-processor detail screenshots; `npm run build && npm run check-assets` *(3 SP)*

### Wednesday — New Project: social-stats 🏆 (5 SP)

**Group B — social-stats Showcase + 9th Card** 🏆 — 🔵 — 5 SP
- [ ] Create/refresh public showcase repo for social-stats *(2 SP)*
- [ ] Add 9th project card + modal entry (`status: "In Development"`, via `add-project` skill; sync 4 date locations, +50ms animate-delay) *(3 SP)*

### Thursday — Content Accuracy + Review Follow-ups (5 SP)

**Group C — Dropshipping Content Accuracy** `[batch]` — 🔵 — 3 SP *(sequence after Group A merges)*
- [ ] Verify dropshipping description vs repo (Next.js 14, BullMQ, Stripe, 249 tests) *(2 SP)*
- [ ] Reconcile dropshipping card tech (4) vs modal tech (6) to one canonical set *(1 SP)*

**Group E — PR #77 Review Follow-ups** `[batch]` — 🟤 — 2 SP
- [ ] `LINK_HREF` negative-lookahead fix in `check-archived-links.js` (excludes external URLs, keeps relative `../superpowers/`) *(1 SP)*
- [ ] Reword CLAUDE.md "Archived-Doc Link Hygiene" intro to cover all three detection forms *(1 SP)*

### Friday — Weekly Reviews (4 SP, buffer day)

**Group F — Weekly Reviews** `[batch]` — ⚪ Overhead — 4 SP *(low-risk; also buffer for any Mon-Thu overflow)*
- [ ] Plugins: official store top + wider-internet top (log each with `source:`) *(2 SP)*
- [ ] Claude best-practices: top not-yet-reviewed *(1 SP)*
- [ ] Non-Claude AI best-practices: top not-yet-reviewed *(1 SP)*

---

## Summary Table

| Group | Domain | Source | Tasks | Total SP | Day | Status |
|-------|--------|--------|-------|----------|-----|--------|
| A. Project Screenshots & Conversion Utility `[batch]` | Content/Build | 🔵 User | 3 | 7 | Mon-Tue | ⬜ Planned |
| B. social-stats Showcase + 9th Card 🏆 | Content | 🔵 User | 2 | 5 | Wed | ⬜ Planned |
| C. Dropshipping Content Accuracy `[batch]` | Content | 🔵 User | 2 | 3 | Thu | ⬜ Planned |
| D. deploy.yml PR Trigger | CI/Build | 🟡 Ops | 1 | 3 | Mon | 🔄 PR #78 (verified, pending merge) |
| E. PR #77 Review Follow-ups `[batch]` | Scripts/Docs | 🟤 Auto | 2 | 2 | Thu | ⬜ Planned |
| F. Weekly Reviews `[batch]` | Research | ⚪ Overhead | 3 | 4 | Fri | ⬜ Planned |
| **Total** | | | **13** | **24** | | |

---

## Notes

### Quota Check

Denominator **Y = 24 − 4 (⚪ Overhead Weekly Reviews) = 20 SP**. Percentages computed over Y.

- 🔵 User-Flagged SP: **15 / 20 (75%)** — ✅ ≥50%
- 🟡 Operational SP: **3 / 20 (15%)** — ✅ ≤25%
- 🟤 Auto-Generated SP: **2 / 20 (10%)** — ✅ ≤25% AND ✅ exactly 1 group (Group E)
- Cleanup Week status: **normal** (not due — see below)
- Last Cleanup Week: **2026-06-08** (Cleanup Week #1, June 8-12)
- Compliance: **✅ all quotas met.** No deviation; abundant 🔵 content available, so no shortfall justification needed. Weekly Reviews (4 SP) excluded from the denominator per the exempt-overhead rule.

### Why a normal week (not Cleanup)

Cleanup Week #1 closed only ~2 weeks ago and drained the 🟤 bucket of its already-shipped backlog. The cadence is every ~3 weeks (next ~early July), and the SP-vs-item-count trigger recalibration is itself deferred to ~2026-06-30 (see the 🟤 "Resolve the Cleanup-Week trigger units" item + [cleanup-week-log.md](cleanup-week-log.md)). This week is the prior plan's explicitly-planned normal content week.

### Weekly Challenge: social-stats Showcase + 9th Project Card (Group B)

**Type**: 🔵 User-Flagged strategic feature — the default challenge source for a normal week.
**Why chosen**: It is the most strategic 🔵 item available — it grows the portfolio's project surface (8 → 9), requires a net-new public showcase repo, and exercises the "In Development" status path, aligning with the ROADMAP's v2.0 Content Expansion direction. The prior plan floated the 🟡 `deploy.yml` PR-trigger as a challenge candidate, but the Weekly-Challenge rule defaults the 🏆 to 🔵 (auto/ops items only qualify in Cleanup Weeks), so `deploy.yml` ships as the normal Monday 🟡 task and the strategic 🔵 new-project is the stretch.
**Risk/fallback**: showcase-repo creation depends on social-stats having presentable content; if it is not yet shippable, the card can still ship with `status: "In Development"` linking the existing repo, deferring the showcase polish.

### Dependencies & Sequencing

- **Group D (deploy.yml) runs Monday, first and isolated** — CI-workflow edits have deploy blast radius; keep it out of the content PRs.
- **Group A before Group C** — both edit the dropshipping `projects.json` entry (A the `screenshots[]` field, C the `description`/`tech` fields). Merge A first or rebase C to avoid a same-entry conflict.
- **Group A internal order**: build `convert-screenshot.js` (Mon) before capturing screenshots (Tue) — the tool processes all four projects.
- **Stash restore (Group A)**: the hardware-project WIP is `stash@{0}` on `content/content-005-hardware-screenshots`. Restore with `git checkout content/content-005-hardware-screenshots && git stash pop` — do not start the hardware screenshots from scratch.
- **Group F (Weekly Reviews)** reads/creates [REVIEW-QUEUE.md](REVIEW-QUEUE.md); independent of all other groups; scheduled late per the exempt-overhead rule.
- Each group ships as one branch / one PR / one review cycle (Group A spans a Mon-Tue contiguous block as a single PR).

### Risks

- **External-dependency uncertainty**: screenshot capture (live apps / Wokwi / running the dropshipping app) and showcase-repo creation are fiddlier than pure-code SP suggest. The week is loaded to **24 SP (~4.8/day), below recent velocity** (May 4-8: 31 SP; Cleanup Week: 26 SP), and Friday is buffer — if Mon-Thu overflow, Group F or Group E (lowest stakes) slip first.
- **Asset-checker gate**: new `screenshots[].src` refs must exist on disk post-build — always run `npm run build && npm run check-assets` before opening Group A's PR, or CI fails at merge.
- **deploy.yml feature-branch deploy**: adding `pull_request:` must not let the `deploy` job run off a feature branch — verify the environment guard explicitly.
- **Stash age**: `stash@{0}` predates the backlog-restructure; expect to reconcile it against the current `projects.json` structure when popping.

### Transition Notes

- **Deferred 🔵 content** (still tracked, not this week — keeps all PRs in the portfolio repo): `rating_bot_showcase` refresh + svg-processor README fixes (CairoSVG→svglib correction, EN translation) are **external-repo** work with a different workflow; pull them into a later content week.
- After this week, re-run the Quota Check against the live bucket counts; with 🟤 drained, normal weeks should keep clearing ≥50% 🔵 comfortably.
- The ~2026-06-30 Cleanup-Week-trigger recalibration (SP vs item-count) is approaching — fold it into next week's planning notes.
- **Missing planning docs** (MILESTONES.md, GOALS.md, REVIEW-QUEUE.md) are parked in [TODO.md](TODO.md) High Priority for a future weekly plan (candidate: June 29-Jul 3). REVIEW-QUEUE.md may be auto-bootstrapped by this week's Group F; the TODO task then formalizes it and focuses on the genuinely-missing MILESTONES + GOALS.
- Older stashes `stash@{1}`/`stash@{2}` (test-stability prep) remain dormant; not needed this week.

---

## Previous Week Summary

### Week of June 8 - 12, 2026 — 🧹 CLEANUP WEEK #1 (✅ COMPLETE)

The first Cleanup Week under the source-split BACKLOG. Inverted quota (100% 🟤) across five domain-batched groups, all shipped: **A** Backlog Drain & Cleanup-Week Bootstrapping 🏆 (pruned 31 verified-done items; established [cleanup-week-log.md](cleanup-week-log.md); PR #73), **D** Test Infrastructure Cleanup (generic `waitForOpacity`, runtime observer-constant guard test, deterministic url-hash negatives; PR #74), **C** Script Robustness & Observability (6 defensive edits across `check-assets.js` + `validate-backlog-paths.js`; PR #75), **B** Documentation Accuracy Sweep (verify-first ROADMAP/DONE pass, 9 🟤 resolved; PR #76), **E** Archived-Doc Dead-Link Cleanup (20 nav-pointers across 9 archived plans retargeted + new `scripts/check-archived-links.js` guard; PR #77). Planning + execution ran June 8-12; the PR review/merge cycle (#73-#77) spanned June 11-18. ~26 SP planned. All post-merge deploys green. Each PR's `/code-review` posted "No issues found"; sub-threshold follow-ups captured to BACKLOG 🟤 (the two open PR #77 items are scheduled this week as Group E).

### Week of May 25 - 29, 2026 — PLANNED, NOT EXECUTED

The May 25-29 content-pivot plan (CONTENT-005 screenshots, `social-stats` showcase, external-repo maintenance, `deploy.yml` challenge — 29 SP) did not run; the intervening effort (Jun 7-9) went to the Backlog Restructure (PR #72). Its content tasks are picked up **this week** (June 22-26, Groups A/B) and via the deferred-content note above.

### Week of May 4 - 8, 2026

Completed 31 SP across 5 days (6.2 SP/day) — Test Stability (PR #66), Asset Checker Polish (PR #68), BACKLOG Validator Hardening (PR #69), CI Deadline & Docs (PR #70), and the 🏆 Scroll Animation Deterministic Polling challenge (PR #71). Close of the sustained Quality & Hardening test-infra streak.
