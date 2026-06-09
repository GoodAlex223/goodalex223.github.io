# Weekly Plan

> 🧹 **CLEANUP WEEK** — quota inverted (≥50% SP from 🟤 Auto-Generated). First Cleanup Week under the new source-split BACKLOG. See Quota Check.

**Week of**: June 8 - 12, 2026
**Created**: 2026-06-09
**Sources**: ROADMAP.md, BACKLOG.md (📌 Process Rules + 🔵/🟡/🟤 buckets), TODO.md, DONE.md, git log (May 24 - Jun 9). _MILESTONES.md and GOALS.md referenced by the planning template do not exist in this project — only ROADMAP.md; priorities drawn from ROADMAP + BACKLOG._

**Context**: First weekly plan under the source-split BACKLOG shipped by PR #72 (merged 2026-06-09). The 🟤 Auto-Generated bucket holds ~149 items (~63% of the backlog) — far over the ~20-SP Cleanup-Week trigger — so both the restructure follow-up and TODO.md "High Priority" call for declaring this a Cleanup Week to start draining it before the ≥50% 🔵 quota can be met sustainably. This week inverts the quota and drains 🟤 tech debt in five domain-batched PRs, anchored by a prune-on-audit pass (🏆) that shrinks the bucket directly. The un-executed May 25-29 content plan (CONTENT-005 screenshots, social-stats, external-repo work) was superseded by the restructure; those tasks already live in 🔵 BACKLOG and are deferred to the next normal/content week.

---

## Parallel Work

- Monitor Formspree spam dashboard — CHALLENGE-003 carry-forward (started ~Mar 21). 🟡 Operational watch; user-side reCAPTCHA v3 decision still pending. No SP (passive).

---

## Task Groups

All five groups draw from 🟤 Auto-Generated Tech Debt (Cleanup-Week focus). The normal ≤1-🟤-group cap is intentionally lifted for the Cleanup Week — draining 🟤 is the week's purpose.

### A. Backlog Drain & Cleanup-Week Bootstrapping — 🟤 — 5 SP *(IMPORTANT)* 🏆

The Cleanup-Week centerpiece: directly shrink the 🟤 bucket and put the Cleanup-Week machinery on a real footing. Run **first** — the prune pass identifies already-shipped items, which de-risks the rest of the week (avoids re-doing work the audit may mark done).

- 🏆 Verify-and-prune the ~25 "prune-on-audit candidates" — cross-check each `- [ ]` item that looks already-shipped (PERF-006 inline critical CSS, "Add automated link checking" in Technical Debt, QUALITY-010 commitlint, validator/asset-checker items from PRs #68/#69, the scroll-animation flake closed by PR #71) against DONE.md + git history; mark genuinely-done items complete and prune *(3 SP, conf 80)*
- Calibrate the Cleanup-Week threshold and formally record this as the first Cleanup Week — revisit whether ~20 SP is the right trigger; log start state (~149 🟤 items) for the 2-3-week recalibration window *(2 SP, conf 70)*

### B. Documentation Accuracy Sweep `[batch]` — 🟤 — 7 SP — Domain: Docs

One PR. ROADMAP/DONE hand-edits plus CLAUDE.md AUTO-MANAGED-region fixes routed through `/auto-memory:sync` (hand-edits there would be clobbered on next sync).

- ROADMAP.md — remove duplicate "Last Updated" field (header line 3 + trailing italic line 84) *(1 SP, conf 70)*
- ROADMAP.md — annotate v1.5 "Completed 2026-03-21" with parallel-development note / fix the phase-ladder drift where v1.5 commits predate later v1.1 items *(2 SP, conf 60, structural)*
- ROADMAP.md — align Quality & Hardening cross-link display-text with DONE.md convention; document the transition convention for the "🔧 In Progress" phase header *(2 SP, conf 40-50)*
- DONE.md — fix the "zero extra" undercount in the Backlog Restructure entry (restructure added 3 net-new 🟤 follow-ups; final open count ~240, not 237) *(1 SP, conf 50)*
- CLAUDE.md AUTO-MANAGED sync via `/auto-memory:sync` — `check-backlog-structure` guard drift at 3 sites (Pre-commit bullet, Build Commands block, scripts/ architecture line); BACKLOG line-948 `checkout@v4`→`@v6`; Shell Gotchas wording ("On a fresh repo" → "On any commit that doesn't stage BACKLOG.md", inline `.husky/pre-commit` path) *(1 SP, conf 40-60)*

### C. Script Robustness & Observability `[batch]` — 🟤 — 5 SP — Domain: CI/Build (scripts/)

One PR. Small defensive hardening across `check-assets.js` and `validate-backlog-paths.js`.

- `check-assets.js` — guard `checkDistPreflight()` against `dist` existing as a non-directory (`statSync().isDirectory()` before `readdirSync`, mirroring `assetExists()` try/catch) *(1 SP, conf 50)*
- `check-assets.js` — reconcile `checkDistPreflight()` JSDoc ("missing or empty") vs error message ("missing or incomplete") wording drift *(1 SP, conf 50)*
- `check-assets.js` — update `extractJsonRefs()` JSDoc to mention the non-object guard; restyle the stale-hash `Hint:` label out of RED (it's a nudge, not an error) *(1 SP, conf 40-50)*
- `validate-backlog-paths.js` — emit `console.warn` when `readBacklog()` falls back to working-tree read (silent-degradation hazard); make fix-guidance detect `plans/` vs `specs/` violation subtree *(2 SP, conf 30-50)*

### D. Test Infrastructure Cleanup `[batch]` — 🟤 — 6 SP — Domain: Testing

One PR. Closes the last fixed-timeout smell in the test infra (the recurring flake-reduction theme) plus small drift/lineage fixes.

- `waitForModalOpen(page)` / generic `waitForOpacity(page, selector)` polling helper in `tests/utils/timing.js` — replaces `ModalPage.js:118` `waitForTimeout(300)`, the last fixed-timeout in the suite *(3 SP, conf 65)*
- Automated guard test for the helper's observer-mirrored constants — `page.evaluate()` reads the production observer config and asserts `THRESHOLD`/`ROOT_MARGIN_BOTTOM` in `timing.js` match `js/main.js` *(1 SP, conf 60)*
- Add `waitForScrollAnimations(page)` to form + modal reduced-motion `beforeEach` blocks for cross-suite consistency (free under reduced-motion short-circuit) *(1 SP, conf 50)*
- Lineage/cleanup nits: inline comment for the omitted `waitForScrollAnimations` after `clickFilter()` in the reduced-motion filter test; preserve the deleted FilterPage stagger-budget rationale in the helper JSDoc; remove unused `getAnimationDuration()`/`getStaggerDelay()` from `timing.js` *(1 SP, conf 25-75)*

### E. Archived-Doc Dead-Link Cleanup `[batch]` — 🟤 — 3 SP — Domain: Docs

One PR. Recurring `docs/superpowers/` dead links in archived/frozen docs + the upstream template fix that stops them recurring.

- Update stale `docs/superpowers/` cross-refs inside the archived restructure plan + design spec (`docs/archive/plans|specs/2026-06-07_*`) *(1 SP, conf 35)*
- Update stale `docs/superpowers/` cross-refs in the archived test-stability plan (`docs/archive/plans/2026-04-28_test-stability-investigations.md` lines 11, 581-582) *(1 SP, conf 35)*
- writing-plans skill template should emit `Spec / Plan` links in final archived form (underscored dates, `docs/archive/<specs|plans>/`) so live PR bodies and archived plans both ship clean *(1 SP, conf 75, process/template)*

---

## Daily Schedule

### Monday — Backlog Drain 🏆 (5 SP)

**Group A — Backlog Drain & Cleanup-Week Bootstrapping** — 🟤 — 5 SP *(run first; de-risks the week)*
- [ ] 🏆 Verify-and-prune the ~25 prune-on-audit candidates against DONE.md + git *(3 SP)*
- [ ] Calibrate Cleanup-Week threshold + formally record this as the first Cleanup Week *(2 SP)*

### Tuesday — Test Infrastructure (6 SP)

**Group D — Test Infrastructure Cleanup** `[batch]` — 🟤 — 6 SP *(meatiest code; front-loaded)*
- [ ] `waitForModalOpen`/`waitForOpacity` polling helper → replace `ModalPage` `waitForTimeout(300)` *(3 SP)*
- [ ] Automated guard test for observer-mirrored constants *(1 SP)*
- [ ] Add `waitForScrollAnimations` to form + modal reduced-motion `beforeEach` *(1 SP)*
- [ ] Lineage/cleanup nits (inline comment, stagger-budget JSDoc, remove unused timing fns) *(1 SP)*

### Wednesday — Script Robustness (5 SP)

**Group C — Script Robustness & Observability** `[batch]` — 🟤 — 5 SP
- [ ] `check-assets.js` — non-directory `dist` guard *(1 SP)*
- [ ] `check-assets.js` — JSDoc vs error wording reconcile *(1 SP)*
- [ ] `check-assets.js` — `extractJsonRefs` JSDoc + stale-hash hint color *(1 SP)*
- [ ] `validate-backlog-paths.js` — working-tree fallback `console.warn` + spec-targeted fix-guidance *(2 SP)*

### Thursday — Documentation Accuracy (7 SP)

**Group B — Documentation Accuracy Sweep** `[batch]` — 🟤 — 7 SP
- [ ] ROADMAP.md — remove duplicate "Last Updated" *(1 SP)*
- [ ] ROADMAP.md — v1.5 parallel-development / phase-ladder drift annotation *(2 SP)*
- [ ] ROADMAP.md — cross-link display-text + in-progress-phase transition convention *(2 SP)*
- [ ] DONE.md — fix "zero extra" undercount *(1 SP)*
- [ ] CLAUDE.md AUTO-MANAGED sync via `/auto-memory:sync` (check-backlog-structure drift + checkout@v6 + Shell Gotchas wording) *(1 SP)*

### Friday — Dead-Link Cleanup (3 SP)

**Group E — Archived-Doc Dead-Link Cleanup** `[batch]` — 🟤 — 3 SP *(light day — buffer/overflow for the week)*
- [ ] Stale `docs/superpowers/` cross-refs in archived restructure plan + spec *(1 SP)*
- [ ] Stale `docs/superpowers/` cross-refs in archived test-stability plan *(1 SP)*
- [ ] writing-plans template → archive-form Spec/Plan links *(1 SP)*

---

## Summary Table

| Group | Domain | Source | Tasks | Total SP | Day | Status |
|-------|--------|--------|-------|----------|-----|--------|
| A. Backlog Drain & Cleanup Bootstrapping 🏆 | Planning/Docs | 🟤 Auto | 2 | 5 | Mon | ⏳ Planned |
| D. Test Infrastructure Cleanup `[batch]` | Testing | 🟤 Auto | 4 | 6 | Tue | ⏳ Planned |
| C. Script Robustness & Observability `[batch]` | CI/Build | 🟤 Auto | 4 | 5 | Wed | ⏳ Planned |
| B. Documentation Accuracy Sweep `[batch]` | Docs | 🟤 Auto | 5 | 7 | Thu | ⏳ Planned |
| E. Archived-Doc Dead-Link Cleanup `[batch]` | Docs | 🟤 Auto | 3 | 3 | Fri | ⏳ Planned |
| **Total** | | | **18** | **26** | | |

---

## Notes

### Quota Check

- 🔵 User-Flagged SP: 0 / 26 (0%) — normal ≥50% rule **inverted** for this Cleanup Week (by design)
- 🟡 Operational SP: 0 / 26 (0%) — ✅ ≤25%
- 🟤 Auto-Generated SP: 26 / 26 (100%) — ✅ Cleanup-Week inverted quota requires ≥50% 🟤; ≤1-group cap **lifted** (5 groups) as Cleanup-Week intent
- Cleanup Week status: **active**
- Last Cleanup Week: **never** (this is the first)
- Compliance: ✅ all Cleanup-Week quotas met — 100% 🟤 satisfies the inverted ≥50% 🟤 rule; the lifted group cap and 0% 🔵 are the documented Cleanup-Week inversion, not a deviation

### Why a Cleanup Week (and why now)

The source-split BACKLOG (PR #72) was built specifically so 🟤 tech debt could be drained deliberately instead of crowding out 🔵 feature work. The restructure exposed that ~63% of the backlog is 🟤 (~149 items). The restructure follow-up and TODO.md both state the first plan under the new rules should be a Cleanup Week. Running it now (a) validates the Cleanup-Week machinery end-to-end on real work, (b) shrinks the bucket so future weeks can sustainably hit ≥50% 🔵, and (c) starts the 2-3-week data window for recalibrating the ~20-SP trigger (Group A).

### Weekly Challenge: Verify-and-Prune the Backlog (Group A)

**Type**: Auto-generated correctness item — permitted as the challenge **only in Cleanup Weeks** (per template). 
**Why chosen**: Highest-confidence 🟤 item (80) and the highest-leverage one this week — it directly reduces the bucket count and feeds the threshold-calibration task. Done first, it also prevents wasted effort: if the audit marks items in Groups B-E already-shipped, they drop out before execution. It is the most on-theme possible challenge for the inaugural Cleanup Week.

### Deferred from May 25-29 (un-executed content plan)

The May 25-29 plan never ran (June 7-9 went to the Backlog Restructure). Its tasks remain tracked in BACKLOG and are **deferred to the next normal/content week** — no migration needed:
- CONTENT-005 detail screenshots (4 projects) — 🔵 User-Flagged. The 2 hardware projects (lubrication, hx711-scale) were started and **remain stashed** at `stash@{0}` on `content/content-005-hardware-screenshots` (restore with `git checkout content/content-005-hardware-screenshots && git stash pop`).
- `social-stats` showcase + 9th project card — 🔵 User-Flagged.
- `rating_bot_showcase` refresh, svg-processor README fix — 🔵 User-Flagged.
- `deploy.yml` `pull_request:` trigger — 🟡 Operational (important CI gap, conf 70). **Recommended centerpiece for the next normal week.**

### Dependencies & Sequencing

- **Group A runs Monday, first.** The prune-on-audit pass may mark items in Groups B-E already-complete — finishing it before the batch PRs avoids re-doing shipped work.
- **Group B's CLAUDE.md items must go through `/auto-memory:sync`**, not hand-edits — all three drift sites sit in `<!-- AUTO-MANAGED -->` regions that the next sync would clobber. ROADMAP/DONE edits in the same group are normal hand-edits; sequence the sync so it doesn't conflict.
- Groups C, D, E are mutually independent — order is flexible; scheduled by descending code-risk (D test code → C scripts → docs).
- Each group ships as one branch / one PR / one review cycle.

### Risks

- **Cleanup-Week timing**: this is a mid-week re-plan (created Tue Jun 9 after the Mon-Tue restructure wrap). The 26-SP / 5-day schedule assumes a fresh Mon-Fri; realistically Mon-Tue cleanup execution compresses. Friday is deliberately light (3 SP) as a buffer; if the week compresses, Group E (lowest-confidence, 35) is the first to defer.
- **Group A prune scope creep**: cross-checking ~25 items against DONE.md + git can balloon. Time-box to the candidate list in the restructure classification artifact sign-off section; anything ambiguous stays `- [ ]` with a note rather than a guessed prune.
- **`/auto-memory:sync` regenerating more than intended** (Group B): review the sync diff before committing — AUTO-MANAGED regeneration can touch adjacent lines.
- **Low-confidence items (conf ≤35)** in Groups C/E may be judged not-worth-doing on inspection; that's an acceptable Cleanup-Week outcome — mark "won't-do" with rationale rather than forcing a change.

### Transition Notes

- After this Cleanup Week, the next week should be a **normal content week** — pick up the deferred 🔵 CONTENT-005 (restore the stash) + `social-stats`, with the 🟡 `deploy.yml` `pull_request:` trigger as a strong challenge candidate.
- Re-run the Quota Check next week against the **post-drain** 🟤 count from Group A to confirm ≥50% 🔵 is now sustainably achievable.
- Record the actual SP drained and the recalibrated Cleanup-Week threshold (Group A) in next week's "Previous Week Summary".

---

## Previous Week Summary

### Week of May 25 - 29, 2026 — PLANNED, NOT EXECUTED

The May 25-29 content-pivot plan (CONTENT-005 screenshots, `social-stats` showcase, external-repo maintenance, `deploy.yml` `pull_request:` challenge — 29 SP) **did not run**. The intervening effort (Jun 7-9) went to the **Backlog Restructure** (PR #72, merged 2026-06-09): source-split BACKLOG with 📌 Process Rules + 🔵/🟡/🟤 buckets and hard weekly SP quotas, a new `scripts/check-backlog-structure.js` guard (husky + CI), and a `CLAUDE.md` Backlog Intake Rules section. The un-executed content tasks remain in 🔵 BACKLOG (see "Deferred from May 25-29" above); the 2 hardware-screenshot batches remain stashed at `stash@{0}`.

### Week of May 4 - 8, 2026

Completed 31 SP across 5 days (6.2 SP/day) — Test Stability (PR #66), Asset Checker Polish (PR #68), BACKLOG Validator Hardening (PR #69), CI Deadline & Docs (PR #70), and the 🏆 Scroll Animation Deterministic Polling challenge (PR #71). Full detail in git history and prior WEEKLY.md revisions. This was the close of the sustained Quality & Hardening test-infra streak; the Cleanup Week above continues draining that streak's accumulated review follow-ups.
