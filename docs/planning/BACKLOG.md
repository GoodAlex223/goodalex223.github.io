# Backlog

Future ideas and improvements for the portfolio.

**Last Updated**: 2026-06-10 (Cleanup Week #1 — verify-and-prune drain)

**Active tasks**: See [TODO.md](TODO.md)
**Completed work**: See [DONE.md](DONE.md)
**Design spec**: See [docs/archive/specs/2026-06-07_backlog-restructure-design.md](../archive/specs/2026-06-07_backlog-restructure-design.md)

---

## 📌 Process Rules (READ BEFORE PROPOSING WORK)

This file is split into three source sections. Weekly planning MUST respect the quotas
below. The split exists because user-flagged feature/content work was systematically
crowded out by auto-generated PR-review follow-ups (root cause: BACKLOG had no source
concept; the weekly-planning prompt selected on priority + domain only).

### Source sections (in priority order for weekly picks)
- 🔵 User-Flagged Ideas — user-raised: feature ideas, content tasks (screenshots,
  showcase repos, README fixes), UX changes, user-reported bugs. Default home for any
  item the user explicitly raised.
- 🟡 Operational & Observation Items — time-sensitive ops/watches: post-deploy & CI
  checks, Lighthouse/size-budget monitoring, Bing-index verification, Formspree spam
  watch, dependency/GitHub-Actions deadline items. NOT feature work.
- 🟤 Auto-Generated Tech Debt — Claude/automation-surfaced: code-review findings,
  PR post-merge review, CLAUDE.md staleness, doc-hygiene sweeps, test robustness/
  backfill, plan-archival debt.

### Quotas (hard rules for weekly planning)
- ≥50% of weekly SP from 🔵 User-Flagged
- ≤25% of weekly SP from 🟡 Operational
- ≤1 group per week (batch OR solo) from 🟤 Auto-Generated, AND total auto-generated
  SP ≤25% of weekly SP. PR-review items accumulate; they are NOT spread across the week.
- Cleanup Week cadence: every ~3 weeks (or when 🟤 grows beyond ~20 SP pending),
  schedule a dedicated Cleanup Week that inverts the quota — note in WEEKLY.md header.
- Quota Check subsection mandatory in every WEEKLY.md Notes section.

### Intake rules (when adding NEW entries)
- User mentions it → 🔵 User-Flagged under `### From <event> (YYYY-MM-DD)`
- PR post-merge review / code-review finding → 🟤 Auto-Generated under
  `### From PR #N … review (YYYY-MM-DD)`
- Post-deploy / observation / monitoring → 🟡 Operational
- If unsure, ask before adding — default-to-🔵 if user-raised, default-to-🟤 if
  Claude-surfaced
- One entry per concrete actionable item; do NOT merge entries on intake even if they
  look similar — explicit `[possible-dup-of: ...]` tag instead

### Origin convention (portfolio-specific — validator-enforced)
- Any section migrated from a completed plan keeps its
  `**Origin**: docs/archive/plans/<file>` line. `scripts/validate-backlog-paths.js`
  (pre-commit + CI lint) forbids `docs/planning/plans/` and `docs/superpowers/` Origin
  paths — always reference the archived plan.

### Cross-references
- Active tasks: TODO.md
- Completed work: DONE.md
- Weekly plan: WEEKLY.md (must include Quota Check)
- Roadmap/milestones: ROADMAP.md

---

## 🔵 User-Flagged Ideas

### From CONTENT-004: Update Project Information (2026-03-25)
**Origin**: docs/archive/plans/2026-03-24_content-004-update-project-info.md

- [ ] Capture project screenshots for modal data (dropshipping, lubrication, hx711-scale, svg-processor) — PORTFOLIO_REQUIREMENTS.md identifies these gaps
- [ ] Update rating_bot_showcase repo from main rating_bot repo — showcase is stale (single initial commit from Jan 2026)
- [ ] Create showcase repo for [social-stats](https://github.com/GoodAlex223/social-stats) and add as new portfolio project card with "In Development" status
- [ ] Fix svg-processor README — references CairoSVG but code uses svglib; README is in Russian only
- [ ] Translate svg-processor README to English (or add English section)

### From CONTENT-003: Add CleanSpark to Portfolio (2026-03-23)
**Origin**: docs/archive/plans/2026-03-23_content-003-cleaning-site.md

- [ ] Add a `scripts/convert-screenshot.js` utility for PNG→webp conversion with resize — currently ad-hoc via `sharp` install; would streamline future CONTENT tasks

### From CONTENT-002: Portfolio Requirements (2026-03-22)
**Origin**: docs/archive/plans/2026-03-22_content-002-portfolio-requirements.md

- [ ] Portfolio requirements linter — script that validates `data-updated` dates against git history

### From CHALLENGE-003: Contact Form (2026-03-21)
**Origin**: docs/archive/plans/2026-03-21_challenge-003-contact-form.md

- [ ] Add character count indicator on message textarea (e.g., "42/2000") — improves UX for the 2000-char maxlength constraint

### From CONTENT-001: Populate Remaining Project Cards (2026-03-20)
**Origin**: CONTENT-001 implementation

- [ ] Capture detail screenshots for 4 new projects — lubrication, hx711-scale, dropshipping, svg-processor all have `screenshots: []` in `data/projects.json`; need 2 detail screenshots each (matching existing projects' pattern)
- [ ] Verify dropshipping project description accuracy — Description references Next.js 14 App Router, BullMQ, Stripe, 249 unit tests based on repo README; should be validated against actual codebase state
- [ ] Reconcile dropshipping card tech vs modal tech — Card shows `TypeScript, React, Docker, Vercel` (4 items) but `data/projects.json` has `TypeScript, Next.js, React, PostgreSQL, Stripe, Docker` (6 items); `Vercel` absent from JSON, `Next.js`/`PostgreSQL`/`Stripe` absent from card (code review finding, confidence 50/100)

### From CHALLENGE-002: Project Detail Modal (2026-03-19)
**Origin**: CHALLENGE-002 implementation

- [ ] Modal keyboard shortcut hint — Show a subtle "press ESC to close" hint in the modal footer for keyboard users who may not discover the shortcut
- [ ] Screenshot lazy-load placeholder — Add a skeleton/placeholder element shown while lazy-loaded screenshots are loading to improve perceived performance on slow connections
- [ ] Filter + modal hash coexistence — Investigate and test combined URL hash state (e.g., `#filter=backend&project=rating-bot`) so both filter and modal can be restored from a single shareable URL

### From SEO-005: Bing Webmaster Tools Verification (2026-02-10)
**Origin**: docs/archive/plans/2026-02-10_seo-005-bing-webmaster-tools.md

- [ ] IndexNow protocol — Implement IndexNow API for instant Bing notification on content changes (reduces crawl delay for updates)

### From A11Y-002: Improve Focus Indicators (2026-02-05)
**Origin**: docs/archive/plans/2026-02-05_a11y-002-improve-focus-indicators.md

- [ ] Focus-within for project cards — Add :focus-within highlighting on .project-card when internal links receive focus

### From FEAT-006: Filter Count Badges (2026-02-04)
**Origin**: docs/archive/plans/2026-02-04_feat-006-filter-count-badges.md

- [ ] Animated count transitions — Animate count change on "All" button to show visible vs total (e.g., "All (3/7)") during filtering
- [ ] Zero-count button dimming — Visually dim or disable filter buttons for categories with 0 projects

### From FEAT-005: Escape Key Reset Filter (2026-02-03)
**Origin**: FEAT-005 implementation

- [ ] Keyboard shortcut documentation — Add visible hint or help tooltip showing Escape key resets filter (improves discoverability)

### From BUG-001: Theme Button Overlap Fix (2026-02-02)
**Origin**: docs/archive/plans/2026-02-02_bug-001-theme-button-overlap.md

- [ ] CSS Grid 3-column nav centering — Switch `.nav` to `grid-template-columns: 1fr auto 1fr` if perfect centering becomes important after adding more header elements
- [ ] Hamburger menu at very narrow widths — Collapse nav to hamburger below 375px if more nav items are added in the future

### From SEO-002: JSON-LD structured data (2026-01-29)

- [ ] Add profile image for Person schema `image` property — Enables Knowledge Panel photo display (requires profile photo asset)
- [ ] Add additional schema types — Consider `ItemList` for projects or `BreadcrumbList` for future multi-page navigation

### From FEAT-001: Project Metadata Badges (2026-01-29)
**Origin**: docs/archive/plans/2026-01-29_feat-001-project-metadata-badges.md

- [ ] Auto-update dates from git history — Script or pre-commit hook to update `data-updated` and display text from last commit
- [ ] Additional status types — Add "Completed", "Archived", "Beta" variants when needed (new color variables per status)
- [ ] Date format localization — JavaScript to format dates based on user's locale

### From SEO-001: robots.txt & sitemap.xml (2026-01-29)
**Origin**: docs/archive/plans/2026-01-29_seo-001-robots-sitemap.md

- [ ] Expand sitemap for future pages — Add entries when blog or project detail pages are created

### From Project Content Population (2026-01-27)

  - [ ] Extended description (challenges, decisions, lessons learned)
  - [ ] Screenshots demonstrating key features
  - [ ] Demo videos/GIFs where applicable
  - [ ] Technical highlights and architecture notes

### From Media & Visual Content: Project Card Media Enhancements (2026-01-27)

- [ ] Add multiple project images to project cards (carousel/gallery)
- [ ] Add ability to embed project work videos in cards

### From Internationalization: Multi-Language Support (2026-01-23)

  - [ ] Browser language (`navigator.language` / `navigator.languages`)
  - [ ] Geolocation-based detection (IP-based API or browser geolocation)
  - [ ] Accept-Language header (if server-side rendering added later)
  - [ ] Fallback chain: user preference → browser → geo → default (EN)
  - [ ] Store user choice in localStorage
  - [ ] Respect explicit user override vs auto-detection
  - [ ] JSON translation files (scalable, separation of concerns)
  - [ ] HTML data attributes (simpler, no build step)
  - [ ] Multiple HTML pages per language (SEO benefits, more maintenance)
  - [ ] Which languages to support initially? (EN, RU, UA, DE, ES, ZH?)
  - [ ] RTL support for future languages (Arabic, Hebrew)?
  - [ ] URL structure (`/en/`, `?lang=en`, or same URL with toggle)?
  - [ ] SEO: hreflang tags, separate sitemaps per language?

### From Media & Visual Content: Project Media Strategy (2026-01-23)

  - [ ] Static screenshots (before/after, key features)
  - [ ] GIF animations (short interaction demos)
  - [ ] Video walkthroughs (embedded YouTube/Vimeo or self-hosted)
  - [ ] Live embedded demos (iframes for applicable projects)
  - [ ] Responsive images (srcset) for different screen sizes
  - [ ] Video poster images for instant visual
  - [ ] Consider CDN for media hosting (Cloudinary, imgix)
  - [ ] Optimize images (WebP format, compression)
  - [ ] Audit each project for best visual representation
  - [ ] Prioritize projects with visual/interactive output
  - [ ] IoT projects: circuit diagrams, Wokwi screenshots, demo videos
  - [ ] Web projects: responsive screenshots, interaction demos

### From Features: Project Detail Pages (2026-01-22)

- [ ] Project Detail Pages — Individual pages for major projects: more detailed descriptions, screenshots and demos, technical deep-dives (distinct from the shipped modal)

### From Features: Blog Section

- [ ] Blog Section — Add a blog/articles section (markdown-based posts with a build step). Planned first posts: (a) "My Claude Code Workflow", (b) "Building Industrial IoT Solutions", (c) "From Learning Projects to Production Code"

### From Ideas from Portfolio Rebuild (2026-01-20)

- [ ] Add resume PDF download

### From Enhancements: Visual

- [ ] Consider adding a profile photo
- [ ] Add subtle gradient backgrounds

### From Enhancements: Performance

- [ ] Consider using `font-display: swap`
- [ ] Add service worker for offline support

### From Enhancements: Accessibility

- [ ] Add aria-live regions for dynamic content

### From Technical Debt

- [ ] Create development build script

---

## 🟡 Operational & Observation Items

### From CI Deadline & Docs (2026-05-10)
**Origin**: docs/archive/plans/2026-05-09_ci-deadline-docs.md

- [ ] `.github/workflows/deploy.yml` — add a `pull_request:` trigger so the `lint → build → check-links + test + lighthouse` pipeline runs on PR open/update, not just on push-to-main. Discovered during PR #70 Task 5: feature-branch pushes do not trigger CI today; merge-time is the only gate. Past PRs (#65, #66, #68, #69, #70) all had `statusCheckRollup: 0`. Adding the trigger would mean PR-time validation of action-bump risk and a tighter feedback loop on workflow YAML changes. Note: the `deploy` job should remain guarded so it does not deploy from feature branches (current `environment: github-pages` may suffice; verify). (PR #70 Task 5 process gap, confidence 70, important CI gap)

### From BACKLOG Validator Hardening (2026-05-07)
**Origin**: docs/archive/plans/2026-05-06_backlog-validator-hardening.md

- [ ] Track npm overhead per pre-commit invocation — `npm run validate-backlog` adds ~300-500ms over `node scripts/validate-backlog-paths.js` direct call. Acceptable trade-off for single-source-of-truth, but if pre-commit slowness becomes user-perceivable, switch the hook to direct node invocation while keeping `npm run` for manual + CI use. (PR #69 review observation, confidence 85, ergonomics)

### From CHALLENGE-003: Contact Form (2026-03-21)
**Origin**: docs/archive/plans/2026-03-21_challenge-003-contact-form.md

- [ ] Add reCAPTCHA v3 as fallback if honeypot proves insufficient — monitor Formspree spam dashboard for 2-4 weeks before deciding
- [ ] Add form analytics (submission success rate, field error frequency) — helps understand conversion funnel

### From Build Size Trend Enhancements (2026-03-18)
**Origin**: docs/archive/plans/2026-03-18_perf-009-build-size-trend-history.md

- [ ] Size trend visualization — CLI script to print text-based trend chart from `docs/size-history.json` (sparkline or percentage change)
- [ ] Budget trend alerts — warn when gzip sizes increase over N consecutive entries, catching gradual bloat before hard budget limit
- [ ] CI size comparison — compare current build sizes against last committed entry and annotate PRs with delta (e.g., "CSS +0.2 KB, JS -0.1 KB")

### From CHALLENGE-001: Lighthouse CI in GitHub Actions (2026-03-11)
**Origin**: CHALLENGE-001 implementation

- [ ] Mobile Lighthouse preset option — Add `npm run lighthouse:mobile` script with `preset: "perf"` (mobile) for occasional mobile performance audits alongside the desktop CI gate
- [ ] Lighthouse score trend tracking — Log per-category scores to `docs/lighthouse-history.json` after each CI run for historical regression visibility (mirrors `size-history.json` idea from PERF-008)

### From PERF-008: Build Size Reporting (2026-02-25)
**Origin**: PERF-008 implementation

- [ ] HTML size reporting — Add `index.html` and `404.html` to the size report (both contain ~16 KB and ~8 KB inlined critical CSS respectively); complements existing inline CSS warnings
- [ ] CI budget enforcement — Make the build fail (exit code 1) if gzip budgets are exceeded in CI, rather than just warning; keep soft warnings for local development

### From SEO-006: Social Card Preview Testing (2026-02-13)
**Origin**: docs/archive/plans/2026-02-13_seo-006-social-card-preview-testing.md

- [ ] Facebook Sharing Debugger validation — Use official Facebook tool (requires account) for authoritative cache-clear and preview validation

### From SEO-005: Bing Webmaster Tools Verification (2026-02-10)
**Origin**: docs/archive/plans/2026-02-10_seo-005-bing-webmaster-tools.md

- [ ] Monitor Bing indexing — Check Bing Webmaster Tools dashboard after 48 hours to verify site data is being processed and pages are indexed

### From Media & Visual Content: Project Media Strategy (2026-01-23)

  - [ ] Lazy loading to maintain <200KB initial page load

---

## 🟤 Auto-Generated Tech Debt

### From PR #73 Code Review (2026-06-11)
**Origin**: docs/archive/plans/2026-06-10_backlog-drain-cleanup-week.md

- [ ] Stale `docs/superpowers/specs/` display text in the new archived plan — the Spec link in `docs/archive/plans/2026-06-10_backlog-drain-cleanup-week.md` shows label text `docs/superpowers/specs/2026-06-10_backlog-drain-cleanup-week-design.md` while its relative href `../specs/...` correctly resolves to `docs/archive/specs/`. Link works; only the visible label is stale. Same recurring pattern as the restructure-docs entry below; fold into the Group E "Archived-Doc Dead-Link Cleanup" pass. [possible-dup-of: Update stale `docs/superpowers/` cross-references inside the archived restructure docs] (PR #73 code review, confidence 50, doc lineage)
- [ ] WEEKLY.md summary-table title truncation — the Group A row in the Summary Table reads "Backlog Drain & Cleanup Bootstrapping" while every other reference (Task Groups header, daily schedule, DONE.md, BACKLOG.md, cleanup-week-log.md) uses "Cleanup-Week Bootstrapping". Intra-document naming nit, no functional impact. (PR #73 code review, confidence 25, doc consistency)
- [ ] `cleanup-week-log.md` denominator imprecision — the Trigger line cites "~63% of the 234-item open backlog" where the restructure total was 237 (234 was the pre-promotion baseline); the percentage is accurate either way. Same 234/237/240 ambiguity already tracked in the PR #72 DONE.md undercount item below — resolve together. [possible-dup-of: DONE.md no-loss claim undercounts] (PR #73 code review, confidence 25, doc accuracy)

### From Backlog Drain & Cleanup-Week Bootstrapping (2026-06-10)
**Origin**: docs/archive/plans/2026-06-10_backlog-drain-cleanup-week.md

- [ ] Resolve the Cleanup-Week trigger units (SP-based vs item-count) at the ~2026-06-30 recalibration — BACKLOG 📌 Process Rules says "~20 SP pending" but the 🟤 bucket is tracked by item count. Cleanup Week #1 logged this as an open calibration question; decide and update the rule after 2–3 normal weeks of data. See [cleanup-week-log.md](cleanup-week-log.md). (Cleanup Week #1 follow-up, confidence 70)
- [ ] Prevent prune-on-audit backlog re-accumulation — 22 of the 24 🟤 pruned in Cleanup Week #1 were already-shipped PR-review follow-ups never checked off (the lag that grew the bucket to ~149). Add a task-completion / finishing-a-development-branch step that checks off or prunes the BACKLOG item(s) a PR resolves as it ships, so the audit backlog doesn't refill between Cleanup Weeks. (Cleanup Week #1 follow-up, confidence 65)

### From PR #72 Code Review (2026-06-09)
**Origin**: docs/archive/plans/2026-06-07_backlog-restructure.md

- [ ] CLAUDE.md drift after the `check-backlog-structure` guard shipped — the Pre-commit hook bullet (line 112) still says the hook "conditionally runs `npm run validate-backlog` only" when it now runs both `validate-backlog` and `check-backlog-structure` (each with `|| exit 1`); the Build & Development Commands block (line 33) and the `scripts/` architecture line (line 60) omit `check-backlog-structure`/`check-backlog-structure.js`. All three sites sit inside `<!-- AUTO-MANAGED -->` regions, so route the fix through the auto-memory sync (`/auto-memory:sync`) rather than a hand-edit the next sync would clobber. (PR #72 code review, confidence 50, doc drift)
- [ ] DONE.md no-loss claim undercounts — the Backlog Restructure entry (line 19) states "234 baseline ∪ 3 promotions = 237; zero dropped, zero extra", but the restructure also added 3 net-new 🟤 follow-up items (the "From Backlog Restructure (2026-06-08)" section), so the final open-item count is ~240 and "zero extra" is inaccurate. The migration was lossless for pre-existing items; only the summary's "zero extra" wording is off. Historical-log accuracy nit, no functional impact. (PR #72 code review, confidence 50, doc accuracy)

### From Backlog Restructure (2026-06-08)
**Origin**: docs/archive/plans/2026-06-07_backlog-restructure.md

- [ ] **Update stale `docs/superpowers/` cross-references inside the archived restructure docs** — the archived plan (`docs/archive/plans/2026-06-07_backlog-restructure.md`) and design spec (`docs/archive/specs/2026-06-07_backlog-restructure-design.md`) still contain internal links, bash commands, and PR/commit-message templates pointing at the pre-archive `docs/superpowers/specs|plans/` paths. Dead links in historical docs, no functional impact (validator only checks BACKLOG `**Origin**` lines). Same recurring pattern noted in the PR #66 post-merge review for the test-stability plan. (restructure follow-up, confidence 35, doc lineage)

### From PR #71 Post-Merge Review (2026-05-24)
**Origin**: docs/archive/plans/2026-05-16_scroll-animation-deterministic-polling.md

- [x] Preserve the deleted FilterPage stagger-budget rationale in the new helper's JSDoc — pre-PR `tests/pages/FilterPage.js` had `// Hero elements stagger up to 150ms + 400ms transition = 550ms; add buffer` explaining the 700ms magic number. Opacity polling subsumes the magic number, but the underlying constraint (max-stagger + transition budget) is no longer captured anywhere in `tests/utils/timing.js`. Add a one-line note in the helper's JSDoc explaining why polling subsumes the stagger budget. (PR #71 post-merge review, confidence 25, doc lineage) **[DONE 2026-06-12, Group D PR]**

### From Scroll Animation Deterministic Polling (2026-05-17)
**Origin**: docs/archive/plans/2026-05-16_scroll-animation-deterministic-polling.md

- [x] Automated guard for the helper's observer-mirrored constants — `tests/utils/timing.js` hard-codes `ROOT_MARGIN_BOTTOM = 50` and `THRESHOLD = 0.1` to mirror `js/main.js:585-586`. The current DRIFT RISK comment documents this as a manual contract; a one-line test that reads the production observer config via `page.evaluate()` and asserts the helper's constants match would close the silent-drift hazard. (final review, confidence 60, observability) **[DONE 2026-06-12, Group D PR — `tests/utils/timing-guards.spec.js` runtime IntersectionObserver intercept]**
- [x] Polling helper for modal-open state — `tests/pages/ModalPage.js:118` (`expectOpen`) still uses `waitForTimeout(300)` to wait for modal opacity transition, the same class of fixed-timeout smell this PR addressed for scroll animations. A `waitForModalOpen(page)` polling helper (or generic `waitForOpacity(page, selector)` utility) would close the last fixed-timeout in the test infrastructure. (final review, confidence 65, test-flake reduction theme) **[DONE 2026-06-12, Group D PR — generic `waitForOpacity(locator)`; also absorbed `clickCard()`'s inline poll]**
- [x] Add `waitForScrollAnimations(page)` to form and modal reduced-motion `beforeEach` blocks for consistency — spec scope only required restoring the filter line-108 call. The form (`tests/form/axe-scan.spec.js:55-59`) and modal (`tests/modal/axe-scan.spec.js:64-76`) reduced-motion variants still omit the helper. With the reduced-motion short-circuit, adding the call is free and aligns all three suites. (Task 4 / final review, confidence 50, consistency polish) **[DONE 2026-06-12, Group D PR — also added after the 2 reduced-motion `clickFilter()` sites]**
- [x] Targeted regression test for `waitForScrollAnimations(page)` after filter applied — no test currently asserts the helper resolves correctly when filter-hidden cards exist in the DOM (the bug fixed in Task 2). A one-liner negative test that applies a filter and asserts the helper does not timeout would close the observability gap on the class-skip behavior. (Task 2 code review, confidence 50, test coverage) **[DONE 2026-06-12, Group D PR — `tests/utils/timing-guards.spec.js`, with a precondition asserting the hang condition is genuinely present]**

### From PR #70 Post-Merge Review (2026-05-14)
**Origin**: docs/archive/plans/2026-05-09_ci-deadline-docs.md

- [ ] Plan-template "Spec / Plan" links should ship in archive-form, not `docs/superpowers/...` — PR #70's body shipped with broken markdown links pointing to `docs/superpowers/specs/2026-05-09-ci-deadline-docs-design.md` and `docs/superpowers/plans/2026-05-09-ci-deadline-docs.md` (both wrong path prefix and wrong date format — actuals use underscored dates at `docs/archive/`). The archived plan's Task 6.1 PR-body template carries the same dead links forward as a frozen historical record. Manual fix applied via `gh api PATCH .../pulls/70` post-merge. Improvement: writing-plans skill template generation should emit `Spec / Plan` links using the final archived path form (underscored dates, `docs/archive/<specs|plans>/` prefix) so the live PR body and the archived plan both ship clean. (PR #70 post-merge review, confidence 75, process/template)
- [ ] Commit messages should not assert past-tense fixes that were not actually applied — `c51c549`'s message stated "the live PR body was already corrected via `gh pr edit`" but the body was still broken at post-merge review time (corrected ~10 minutes later via `gh api PATCH`). Two recovery patterns: (a) write external-state corrections as TODO/follow-up in the commit body rather than past-tense statements of fact; (b) verify the external state matches the claim before pushing the commit. Low-grade truth drift in the commit log compounds and weakens it as a debugging source over time. (PR #70 post-merge review, confidence 60, process discipline)

### From CI Deadline & Docs (2026-05-10)
**Origin**: docs/archive/plans/2026-05-09_ci-deadline-docs.md

- [ ] CLAUDE.md "Shell Gotchas" — tighten `Triggered by` reference to inline the file path `.husky/pre-commit` rather than leaving it parenthetical-only in the cross-linked Pre-commit bullet. A reader who lands on the gotcha via a "shell"/"grep" search vector without reading the Commits subsection won't have a concrete example. (PR #70 Task 2 review, confidence 40, minor wording polish)
- [ ] CLAUDE.md "Shell Gotchas" — replace "On a fresh repo or unstaged-file commit" with "On any commit that doesn't stage BACKLOG.md". The current wording leads with the edge case rather than the common case (any everyday commit where BACKLOG.md isn't part of the staged set would have triggered the bad-pattern bug). (PR #70 Task 2 review, confidence 50, accuracy)
- [ ] ROADMAP.md — annotate v1.5's "Completed 2026-03-21" with a "developed in parallel with v1.1" parenthetical, or restructure the phase-ladder to acknowledge that v1.5 commits (theme toggle, filter, scroll animations, 404 — all 2026-01-28) predate later v1.1 items (Bing Webmaster Tools, 2026-02-10). The current sequential framing is inherited from the original ROADMAP and the phase rewrite preserved rather than fixed it. (PR #70 Task 3 review, confidence 60, important structural drift)
- [ ] ROADMAP.md — remove duplicate "Last Updated" field. Header bold `**Last Updated**: 2026-05-10` (line 3) and trailing italic `*Last updated: 2026-05-10*` (line 84) both maintained; sibling docs (DONE.md, WEEKLY.md) use only the header form. Doubles the chance of stale-date bug on next update. (PR #70 Task 3 review, confidence 70, low risk)
- [ ] ROADMAP.md — align Quality & Hardening cross-link display-text with DONE.md convention. Current `[docs/planning/WEEKLY.md](WEEKLY.md)` uses full-path display + abbreviated relative href, inconsistent with DONE.md's `[docs/archive/specs/<file>](../archive/specs/<file>)` (full path in both positions). Cosmetic; either `[WEEKLY.md](WEEKLY.md)` or `[docs/planning/WEEKLY.md](../planning/WEEKLY.md)` would be consistent. (PR #70 Task 3 review, confidence 50, polish)
- [ ] ROADMAP.md — document transition convention for the in-progress phase header. "🔧 In Progress, since 2026-04" will read oddly if not updated to "✅ Completed YYYY-MM-DD" when Quality & Hardening closes. Either inline a comment or note the next-maintainer step in a tracking file. (PR #70 Task 3 review, confidence 40, forward-looking)
- [ ] BACKLOG.md observability item — update parenthetical at line 948 from `actions/checkout@v4` → `actions/checkout@v6` to match the post-PR-#70 state. Behavioral observation (lint job uses default full clone) is unchanged. (PR #70 Task 4 final review, confidence 60, doc accuracy — already partially addressed in this same PR's CI Deadline & Docs follow-up)

### From BACKLOG Validator Hardening (2026-05-07)
**Origin**: docs/archive/plans/2026-05-06_backlog-validator-hardening.md

- [ ] Improve validator fix-guidance for spec-targeted violations — error message at `scripts/validate-backlog-paths.js:70` says "Replace the forbidden path with the equivalent docs/archive/plans/... path" but spec violations should target `docs/archive/specs/`. Detect whether the violation line points to a `plans/` or `specs/` subtree and emit appropriate guidance. (PR #69 review finding, confidence 30, nitpick)

### From PR #69 Post-Merge Review (2026-05-07)

- [ ] Surface a `console.warn` when `readBacklog()` falls back to working-tree read — `scripts/validate-backlog-paths.js:35-46` documents in a code comment that a future sparse-checkout or blob-filter mode in CI would cause `git show` to fail and silently fall back to the working-tree read. Today this never triggers (lint job uses `actions/checkout@v6`), but the silent-degradation hazard exists purely as documentation. Emitting `console.warn('readBacklog: git show failed; using working tree')` on the inner-catch path would make the degradation observable in CI logs and align with the repo's pattern of explicit feedback (link checker LinkedIn skips, asset checker preflight). (PR #69 review observation, confidence 50, observability)

### From PR #68 Post-Merge Review (2026-05-05)
**Origin**: docs/archive/plans/2026-05-02_asset-checker-polish.md

- [ ] Guard `checkDistPreflight()` against `dist` existing as a non-directory — `scripts/check-assets.js:138` calls `fs.readdirSync(distDir)` after a bare `fs.existsSync()` check. If a stray file named `dist` (no trailing slash) is present at repo root (e.g., from `touch dist` or a broken build tool), `readdirSync` throws `ENOTDIR` with a raw stack trace instead of the clean "run `npm run build` first" message the function was designed to emit. The pre-existing `assetExists()` (line 119) already wraps `realpathSync.native` in try/catch — apply the same defensive pattern here, or check `fs.statSync(distDir).isDirectory()` before reading. (confidence 50, low likelihood but breaks the contract of the function's docstring)
- [ ] Reconcile `checkDistPreflight()` JSDoc vs error message vocabulary — `scripts/check-assets.js:131-134` JSDoc says "Fast-fails when dist/ is missing or empty," but the printed error at line 140 says "dist/ missing or incomplete." The word "incomplete" in the message overstates what the preflight actually checks (it does NOT detect partial/stale `dist/` — that case falls through to the stale-hash hint). Either change the message to "missing or empty" to match the JSDoc, or add a note in the JSDoc explaining the broader user-facing wording. (confidence 50, vocabulary drift, no functional impact)
- [ ] Update `extractJsonRefs()` JSDoc to mention the non-object guard — `scripts/check-assets.js:73-76` JSDoc reads "Walks projects[*].screenshots[].src. Skips excluded refs." but the function body now also skips entries where `typeof project !== 'object' || project === null` (line 81, added in PR #68). Either expand the JSDoc to "...also skips non-object projects[*] entries" or accept the omission as a defensive-only detail. (confidence 50, doc/code drift)

### From Asset Checker Polish Code Review (2026-05-03)
**Origin**: docs/archive/plans/2026-05-02_asset-checker-polish.md

- [ ] Restyle the stale-hash hint label so the tone matches "helpful nudge" — `scripts/check-assets.js:194` prints the `Hint:` label in `RED`, which reads as an error declaration rather than the nudge the spec intended. Preflight `dist/ missing or incomplete` correctly uses red because it is an error, but the stale-hash hint is recoverable diagnostic context. Consider plain text for the `Hint:` label, or a dim/yellow ANSI escape if a new color constant is acceptable. Subjective styling; no behavior impact. (confidence 40)
- [ ] Restructure the CLAUDE.md "Internal asset check" bullet — six iterative additions across PR #65 + PR #68 turned the bullet into a 260+ word single sentence covering scanning sources, case-check mechanism, exclusions, dist preflight, stale-hash hint, HTML-regex scope, and JSON guard. Splitting into sub-bullets under a single heading (or promoting to its own sub-section) would improve scannability without changing content. (confidence 50)
- [ ] Tighten the stale-hint regex if ref shapes change — `/^\/?dist\//` accepts both leading-slash and no-slash forms. Current HTML always emits no-slash refs (`dist/style.HASH.css`), so the `\/?` half is currently unused. Harmless and forward-compatible, but if the build pipeline ever switches to absolute refs, drop the optional half (or document why both are kept). (confidence 20, observation)
- [ ] Stale-hash hint (stderr) immediately precedes the ✗ ref line (stdout) — if a future CI captures streams separately, their relative ordering is not guaranteed by Node, and the hint could appear out of position relative to the broken ref it explains. Low risk on GitHub Actions (timestamps merge the two), but the in-context diagnostic value depends on ordering. Consider routing both lines to the same stream, or moving the hint to a post-loop summary block where ordering doesn't matter. (confidence 25, observation)
- [ ] Narrow the stale-hash hint trigger to hash-bearing refs only — current `/^\/?dist\//` regex fires on ANY failing `dist/` ref, but the hint message specifically mentions "stale hashed assets." A future non-hashed `dist/` ref (e.g., `dist/robots.txt`, `dist/manifest.json`) that fails for some other reason would display a misleading "may be stale" hint. None today; tighten the regex to `/\.[a-f0-9]{6,}\.[a-z]+$/` (or similar hash-pattern check) only if such refs are added. (confidence 30, latent gap)

### From PR #67: WebKit reduced-motion axe flake (2026-05-01)
**Origin**: PR #67 — `tests/filter/reduced-motion.spec.js:73`, `tests/filter/axe-scan.spec.js:120`

- [ ] Identify root cause of WebKit-Linux + reduced-motion + active-filter axe color-contrast race — PR #67 mitigated the consistent-fail by adding `setTheme("light")` (which pins `data-theme` and waits 400ms), but the underlying race wasn't isolated. Open questions: is the 400ms wait the actual fix or does pinning `data-theme` matter? Does WebKit honor `transition-duration: 0.01ms !important` for in-flight transitions triggered during a class swap? Reproducing requires Linux WebKit (didn't repro on Windows WebKit 10/10 locally). If a future regression appears, instrument with `getComputedStyle()` snapshots before/after `clickFilter()` to confirm where colors are sampled mid-transition. (confidence 60)
- [ ] Audit other axe scans that follow class-toggle actions for the same race — the WebKit race surfaced because the test scans IMMEDIATELY after `clickFilter()` swaps `--active` between two buttons. Other suites that scan after a state-changing user action (modal open/close, theme toggle, form submit) could exhibit the same pattern under reduced motion on WebKit. Quick audit: grep `tests/**/*.spec.js` for `checkAccessibility` calls preceded by a state-changing helper and verify each has either a settle wait or doesn't toggle `transition`-bearing classes. (confidence 55)
- [ ] Consider extracting the post-click axe-scan settle into a shared helper — the `setTheme("light")` workaround is in two places now (`reduced-motion.spec.js:73` and `axe-scan.spec.js:120`), each with the same explanatory comment. If the audit above finds more cases, factor into `tests/utils/axe-helper.js` (e.g., `checkAccessibilityAfterToggle(page, options)` that ensures style settle before scanning). Premature today (only 2 callsites); revisit if pattern repeats. (confidence 40)

### From PR #66 Review (2026-04-30)

- [ ] Update stale `docs/superpowers/` cross-references in archived plan — `docs/archive/plans/2026-04-28_test-stability-investigations.md` lines 11 and 581-582 reference `docs/superpowers/specs/...` and `docs/superpowers/plans/...` paths that no longer exist (artifacts went to `docs/archive/specs/` and `docs/archive/plans/`). Pre-commit `validate-backlog-paths.js` only checks BACKLOG `**Origin**:` lines, so these slipped through. Dead links in archived doc, no functional impact. (confidence 35)
- [ ] Tighten `mockFormspreeDeferred()` JSDoc prose — `tests/pages/FormPage.js` description says the release function "resolves the response," but the `@returns` tag in the same block says "call to send the response." `route.fulfill()` is what actually sends the response; resolving the internal promise just unblocks the handler. Align the prose with the more precise `@returns` wording. (confidence 10, nitpick)

### From Test Stability Investigations (2026-04-28)
**Origin**: docs/archive/plans/2026-04-28_test-stability-investigations.md

- [ ] Document `page.evaluate` instrumentation Heisenbug gotcha — pre-action `page.evaluate()` checkpoints add ~10–20ms latency per call, which can mask race-condition flakes (instrumented runs go green while bare runs flake). When investigating future timing-sensitive flakes, take only post-action checkpoints, or add equivalent `page.evaluate` no-ops to non-instrumented runs to measure the timing shift. Surfaced during PR #66 Firefox tabindex investigation where 150 instrumented runs were all green; cause-and-effect with the masking hypothesis was not isolated but the risk is real and worth documenting for next time. (code review finding, confidence 75/100)
- [ ] Audit `setTimeout`-based route mocks across the test suite — `mockFormspreeDeferred()` was added during PR #66 to replace one fixed-timeout race in submission.spec.js. Other test files may have similar patterns (e.g., `setTimeout` in `page.route` callbacks) that would benefit from the same deferred-promise control. Quick audit: `grep -rn 'setTimeout.*resolve' tests/` to find candidates; migrate any that assert intermediate states.
- [ ] Re-investigate Firefox tabindex flake if it recurs — BACKLOG entry above (originally 2026-04-16) was marked NOT_REPRODUCING after 150 local runs + 80+ CI runs. Reversal trigger: if the test fails on any future CI run, re-open with the failure trace. Instrumentation pattern preserved on `test/stability-investigations` branch (commit `1fbc0bf` adds, `d2201ff` removes) for fast re-instrumentation.

### From Internal Asset Link Checking (2026-04-20)
**Origin**: docs/archive/plans/2026-04-20_internal-asset-link-checking.md

- [ ] Extract shared HTML ref extractor to `scripts/lib/extract-refs.js` — `check-links.js` and `check-assets.js` both run `href=`/`src=` regex on HTML with slightly different exclusion filters. If their extraction logic diverges or duplicates more, factor into a shared module.
- [ ] CSS `url(...)` scanning — current checker covers HTML + JSON only. No CSS `url()` refs exist today (fonts are HTML-preloaded), but adding CSS scanning would catch future background-image or `@font-face` regressions.
- [ ] Orphan asset detection — a secondary, informational check for files on disk in `images/`, `fonts/`, etc. that are NOT referenced anywhere. Would require scanning the webmanifest, meta tags, and possibly README to avoid false positives; keep as non-blocking warning rather than exit-1 gate.
- [ ] Per-segment `readdirSync` walk fallback in `assetExists()` — reserved as a contingency if `realpathSync.native()` case-canonicalization behavior drifts on macOS or Windows in a future Node release. Today (post PR for asset-checker polish) `assetExists()` uses canonical-path comparison via `fs.realpathSync.native()` for case detection; if that ever stops returning on-disk casing, fall back to walking each path segment via `readdirSync` with per-directory memoization (keeps call count at ~5 vs. ~30 naive). Not needed today; reopen with the Node-version trace and a failing wrong-cased ref if reproduced.
- [ ] Add file-level JSDoc and test coverage for `scripts/` — no scripts/ module has automated tests today. A `scripts/__tests__/` directory with small unit tests for `isExcludedRef()`, `resolveRef()`, and `assetExists()` would catch regressions in the exclusion filter without requiring the full repo state.

### From Internal Asset Link Checking Code Review (2026-04-20)

- [ ] Extend extractor to `<source src>`, `<video poster>`, `link imagesrcset`, `img srcset` — not needed today (no video, no responsive images), but document the limitation in the script header or queue for follow-up as assets evolve. *(audited 2026-06-10: still open — extractor not extended; no `<source>`/`poster`/`srcset` refs exist yet)*

### From Test Robustness Code Review (2026-04-16)

- [ ] Add inline comment explaining omitted `waitForScrollAnimations()` after `clickFilter()` in reduced-motion filter axe-scan test — Light/Dark theme equivalent tests both retain the wait after `clickFilter("iot")`; the reduced-motion test correctly omits it (animations are instant) but lacks an explanatory comment. The existing block comment only covers the `beforeEach` omission, not the post-`clickFilter` case (code review finding, confidence 75/100)

### From Code Quality batch (2026-04-16)
**Origin**: docs/archive/plans/2026-04-16_code-quality.md

- [ ] Investigate pre-existing Firefox flaky test `tests/filter/accessibility.spec.js:44` — *(investigated 2026-04-28: NOT REPRODUCING.)* Original symptom: "tabindex updates when filter changes" fails intermittently on Firefox with received tabindex="0" instead of "-1". Investigation: ran 150 local Firefox iterations (`--repeat-each=50` then `--repeat-each=100`) with diagnostic instrumentation (per-button tabindex attribute + IDL property + active class + aria-pressed at four checkpoints, attached to trace via `test.info().attach()`) — all 150 green; searched 80+ recent CI workflow runs back to 2026-03-19 — zero failures of this test on any engine. Conclusion: flake is currently stale, possibly resolved by `waitForAnimationComplete` DOM polling shipped in PR #62 (2026-04-10) covering an adjacent code path. Reversal trigger: re-open if the test fails on any future CI run. Instrumentation pattern is preserved on the `test/stability-investigations` branch (commit `1fbc0bf` adds, `d2201ff` removes) for fast re-instrumentation if needed.

### From Firefox & Test Audit Code Review (2026-04-11)

- [ ] **Cleanup: Remove duplicate plans/specs from `docs/superpowers/`** — `docs/superpowers/plans/2026-04-10_firefox-test-audit.md` and `docs/superpowers/specs/2026-04-10_firefox-test-audit-design.md` duplicate archived copies in `docs/archive/plans/`. Extends existing CI Hardening backlog item — batch-remove all `docs/superpowers/` duplicates in one pass

### From CI Hardening Code Review (2026-04-10)

- [ ] **Cleanup: Remove duplicate plan from `docs/superpowers/plans/`** — After archiving to `docs/archive/plans/`, the working copy at `docs/superpowers/plans/2026-04-09_ci-hardening.md` was not removed. CLAUDE.md specifies plans archive to `docs/archive/plans/` as the single source of truth. Check if prior tasks also left duplicates in `docs/superpowers/plans/`.
- [ ] **CI: Remove `cache: 'npm'` from check-links job until `npm ci` is needed** — The cache adds overhead (key computation, lookup) with zero benefit since there's no `npm ci` step. Re-add when external dependencies are introduced. (Overlaps with existing backlog item above but recommends removal rather than future addition.)

### From Firefox & Test Audit (2026-04-10)
**Origin**: docs/archive/plans/2026-04-10_firefox-test-audit-plan.md

- [x] Remove unused `getAnimationDuration()` and `getStaggerDelay()` from `tests/utils/timing.js` — these were only used by the now-removed `waitForFilterAnimation()`. No callers remain. Keep only if future tests need to read CSS custom property timing values **[DONE 2026-06-12, Group D PR]**
- [ ] Harden `filterProjects()` animation interruption — the `toPass()` retry wrapper in `rapid-clicks.spec.js:22` masks a genuine app-level race: when a second filter click fires during exit animation, overlapping `setTimeout` cleanup callbacks can briefly produce wrong visible card counts on Firefox. Consider cancelling all pending animation timeouts at the top of `filterProjects()` before starting new animation

### From Form & A11Y Polish Code Review (2026-04-09)
**Origin**: PR #60 code review

- [ ] Add plan file naming validation to CI or pre-commit hook — the `YYYY-MM-DD_task-name.md` underscore convention has been violated in PRs #51, #54, #56, #57, #59, and #60 despite repeated code review flags; a script check would catch this automatically

### From CI Hardening (2026-04-09)

- [ ] **CI: Add `npm ci` to check-links job if external dependencies are added** — Currently the check-links script uses only Node built-ins, so `npm ci` is skipped. The `cache: 'npm'` was added for consistency. If the script ever gains external dependencies (e.g., a URL parsing library), add `npm ci` to the job.
- [ ] **ESLint: Consider glob pattern for root config ignores** — Currently all 5 root config files are individually listed in the `ignores` array (`eslint.config.js`, `commitlint.config.js`, `lighthouserc.js`, `playwright.config.js`, `postcss.config.js`). A glob like `"*.config.js"` plus `"lighthouserc.js"` would be more maintainable if more root configs are added, but risks accidentally ignoring legitimate source files.

### From Form & A11Y Polish (2026-04-08)
**Origin**: docs/archive/plans/2026-04-08_form-a11y-polish.md

- [ ] Audit all dynamically-injected HTML for missing `aria-hidden` on decorative elements — the `showFormStatus()` SVGs were found missing during code review; other dynamic injection sites (modal, filter) should be proactively audited
- [ ] Audit component-level transitions for missing `color` property — `.contact-form__input` omitted `color` causing text snap on theme switch; other components with their own `transition` declarations may have the same gap

### From Automated Link Checking Code Review (2026-04-07)
**Origin**: Code review of PR #59

- [ ] Add `cache: 'npm'` to `check-links` CI job's `setup-node` step — all other jobs include it for faster dependency caching; `check-links` is the only job that omits it
- [ ] Add file-level JSDoc comment to `scripts/check-links.js` — all other scripts in `scripts/` follow the convention of a JSDoc header describing purpose and behavior

### From Code Quality & Lint Fixes Code Review (2026-04-04)
**Origin**: Code review of PR #57

- [ ] Consolidate redundant plan archive files — task completion workflow sometimes produces two plan files for one task (e.g., `*_task-name.md` + `*_task-name-plan.md`). Consider standardizing on a single file per task or documenting when two are appropriate

### From Code Quality & Lint Fixes (2026-04-03)
**Origin**: docs/archive/plans/2026-04-03_code-quality-lint-fixes.md

- [ ] Add remaining root config files to ESLint `ignores` array — `postcss.config.js`, `playwright.config.js`, and `lighthouserc.js` are not in `eslint.config.js` ignores; while lint-staged is now scoped, direct `npx eslint .` would still try to lint them

### From Contact Form A11Y Hardening (2026-03-28)
**Origin**: docs/archive/plans/2026-03-27_a11y-contact-form-hardening.md

- [ ] Extend focus-visible pattern to other custom components — modal close button, filter buttons, and any future interactive components should be audited for the same base-transparent-outline + outline-color-only pattern

### From Archive Cleanup (2026-03-27)
**Origin**: docs/archive/plans/2026-03-27_archive-cleanup.md

- [ ] Automate superpowers→archive consolidation on task completion — add a checklist step or script to the finishing-a-development-branch workflow that verifies `docs/superpowers/` contains no files already present in `docs/archive/`
- [ ] Enforce underscore naming convention for archive files — add a CI check or pre-commit hook that validates all files in `docs/archive/` use `YYYY-MM-DD_` prefix (not `YYYY-MM-DD-`)

### From Archive Cleanup Code Review (2026-03-27)
**Origin**: Code review of PR #55

- [ ] Add "Last Updated" header update to planning doc edit checklist — BACKLOG.md header was missed despite marking 5 items complete and adding a new section; DONE.md and TODO.md were updated but BACKLOG.md was not. Consider a pre-merge check or adding it to the finishing-a-development-branch workflow
- [ ] Validate spec references after file moves — plan file's own `**Spec:**` line pointed to old `docs/superpowers/specs/` path after spec was moved to `docs/archive/specs/` in same PR. A grep for `superpowers/` in modified files could catch this

### From CONTENT-003 Code Review (2026-03-24)
**Origin**: Code review of PR #53

- [ ] Archive completed design spec `docs/superpowers/specs/2026-03-23_content-003-cleaning-site-design.md` to `docs/archive/specs/` — completed task specs should follow the archive precedent set by BUG-004 (`docs/archive/specs/`), not remain in `docs/superpowers/specs/` ("planned features")

### From BUG-004: Filter Race Condition Fix (2026-03-22)
**Origin**: docs/archive/plans/2026-03-22-bug-004-filter-race-condition.md

- [ ] Debounce live region announcements on rapid filter clicks — `announceFilterResults()` fires eagerly before animation, so rapid clicks queue overlapping screen reader announcements (pre-existing, noted in A11Y-001 backlog)
- [ ] Unify `resetFilter()` into `activateFilter("all")` — with eager `currentFilter`, the separate `resetFilter()` function is even more redundant; could become `activateFilter("all", { manageFocus: true })` (pre-existing QUALITY-002 backlog item, now simpler to implement)

### From QUALITY-010: commitlint for Conventional Commits (2026-03-21)
**Origin**: docs/archive/plans/2026-03-21_quality-010-commitlint.md

- [ ] ESLint ignores for root CJS configs could use a glob pattern — Currently manually listing each root config (`eslint.config.js`, `commitlint.config.js`). If more root CJS configs are added, a glob like `*.config.js` would be cleaner.
- [ ] Investigate memory-updater hook friction on rapid commits — Hook triggers on every commit attempt even when CLAUDE.md is already up to date, causing significant friction during multi-step implementations.

### From QUALITY-009: ESLint Enhancements (2026-03-20)
**Origin**: QUALITY-009 implementation

- [ ] `eslint-plugin-playwright` `assertFunctionNames` glob patterns don't match member expressions — `expect*` doesn't match `fp.expectSomething()`. Explicit list is the only working approach. Document this limitation if the plugin adds glob support for member expressions in future versions.
- [ ] Future lint rule additions: scan codebase for actual violations before estimating scope — QUALITY-009 spec predicted "zero or minimal" but found 81 violations (70 expect-expect + 11 warnings). Pre-scan with `npx eslint --rule '{"rule": "error"}' "glob"` catches this before planning.

### From TEST-007: Axe-core WCAG Scan for Modal (2026-03-19)
**Origin**: Code review of PR #46

- [ ] Normalize axe-helper API — `checkAccessibility()` accepts `include` as a single CSS selector string but `exclude` as an array of strings; align both to accept the same type for consistency

### From TEST-006: Automated OG Meta Tag Validation (2026-03-12)
**Origin**: docs/archive/plans/2026-03-12_test-006-og-meta-validation.md

- [ ] 404.html negative test — Add test verifying 404.html intentionally omits OG/Twitter/JSON-LD tags (catches accidental addition)
- [ ] OG image HTTP validation — Test that `og:image` URL returns HTTP 200 with correct Content-Type (requires network request in test)
- [ ] Add symmetric null guards in cross-tag consistency tests — Only OG values are guarded with `not.toBeNull()`; add matching guards for Twitter tag values to produce clearer error messages when a Twitter tag is missing (code review finding, confidence 65/100)
- [ ] Add JSON-LD script tag existence guard in `getGraph()` — `JSON.parse(null)` produces cryptic TypeError; add `expect(raw).toBeTruthy()` before parsing for clearer failure when script tag is missing (code review finding, confidence 62/100)
- [ ] Add `toBeDefined()` guards to Person/WebSite sub-tests — 5 Person tests and 1 WebSite test access `graph.find()` result without null guard; produces `TypeError` instead of clean assertion failure if schema type is removed (code review finding, confidence 45/100)
- [ ] Add `.first()` to JSON-LD locator in `getGraph()` — `page.locator('script[type="application/ld+json"]').textContent()` throws strict mode violation if a second LD+JSON tag is ever added; defensive `.first()` would produce clearer behavior (code review finding, confidence 35/100)

### From QUALITY-008: Stylelint Rule to Prevent transition:all (2026-03-12)
**Origin**: QUALITY-008 implementation

- [ ] Redundant `.contact__link` transition — `components.css` line 279 transitions only `background-color`, but `main.css` theme group already covers `.contact__link` with `background-color + border-color + color + outline-color`; the component-level declaration may be redundant (code review finding)
- [ ] Case-insensitive transition regex — Current `/\ball\b/` is case-sensitive; `transition: All` would bypass. Mitigated by `value-keyword-case: "lower"` from `stylelint-config-standard`, but adding `/i` flag (`/\ball\b/i`) would provide defense-in-depth

### From QUALITY-007 Code Review (2026-03-12)
**Origin**: PR #41 code review findings (confidence 75/100)

- [ ] Remove stale plan copy `docs/planning/plans/2026-03-12_quality-007-eslint.md` — archived version exists in `docs/archive/plans/`, the in-progress copy should have been deleted per task completion workflow (`mv`, not `cp`)
- [ ] Update deploy job description in CLAUDE.md — current text includes CI-002 staging details that were bundled into QUALITY-007 PR rather than committed separately

### From CHALLENGE-001: Lighthouse CI in GitHub Actions (2026-03-11)
**Origin**: CHALLENGE-001 implementation

- [ ] Explicit Chrome install in lighthouse CI job — Lighthouse job relies on pre-installed Chrome on `ubuntu-latest` runner; adding explicit `npx playwright install --with-deps chromium` or similar would make it resilient to runner image changes (code review finding, confidence 50/100)
- [ ] Fix `.gitignore` missing trailing newline — File lacks trailing newline after `.lighthouseci/` entry; pre-existing issue carried forward (code review finding, confidence 0/100) *(audited 2026-06-10: still open — xxd confirms file ends at 0x2f with no trailing newline byte)*

### From CI-002: Narrow Pages Deploy Artifact Path (2026-03-11)
**Origin**: CI-002 implementation

- [ ] Skip checkout in deploy job — All static assets (fonts/, images/, favicon files, robots.txt, site.webmanifest, og-image.png, PWA icons) could be added to the build-output artifact in the build job, eliminating the checkout step in deploy entirely (checkout is the slowest step in the job)
- [ ] Validate staged `_site/` contents — Add a CI step after staging that asserts expected files exist before upload (e.g., index.html, 404.html, hashed dist/ files, fonts/) — catches accidental glob mismatches silently failing
- [ ] Update CLAUDE.md deploy step description to include `404.webp` — CLAUDE.md line 414 lists staged files as "HTML, favicon, OG image, manifest, robots.txt, sitemap.xml, dist/, fonts/, images/" but omits `404.webp`; surfaced during code review

### From SEO-007: Automate Sitemap lastmod Updates (2026-03-05)
**Origin**: SEO-007 code review

- [ ] Targeted `fetch-depth` for build job — `fetch-depth: 0` clones full history but adds CI time; consider `fetch-depth: 2` or a calculated depth sufficient for `git log -- index.html` accuracy (code review finding, confidence 50/100)
- [ ] Named npm script for `update-sitemap` — Build sequence in CLAUDE.md lists `update-sitemap` alongside named scripts (`build:css`, `unhash`, etc.) but `package.json` uses inline `node scripts/update-sitemap.js &&`; adding a named script would match the established pattern
- [ ] CLAUDE.md build job artifact list inconsistency — "Build job" line still reads `(index.html, 404.html, dist/)` but "Artifact" line was updated to include `sitemap.xml`; both lines describe the same artifact contents

### From PERF-008: Build Size Reporting (2026-02-25)
**Origin**: PERF-008 implementation

- [ ] Extract shared `HASH_LENGTH` constant — `report-sizes.js` and `hash-assets.js` both hardcode `HASH_LENGTH = 8` independently; extract to a shared `scripts/config.js` module to eliminate silent drift risk (code review finding, confidence 72/100)

### From CI-001: Separate CI Workflow Jobs (2026-02-24)
**Origin**: CI-001 implementation

- [ ] Fix CLAUDE.md CI test command reference — Build System Pattern item 10 documents test job as running `npm test` but actual CI command is `npx playwright test --ignore-snapshots`; the `--ignore-snapshots` flag is functionally significant (code review finding, confidence 75/100)
- [ ] Update `playwright.config.js` CI comment — Line 26 says "CI builds CSS before running tests" but after CI-001 refactor, the test job downloads a pre-built artifact from the build job rather than building in the same job (code review finding, confidence 25/100)

### From TEST-005: Reduced Motion Accessibility Test (2026-02-24)
**Origin**: TEST-005 implementation

- [ ] Hover state test for non-reduced-motion mode — Verify `.filter-btn:hover` styles don't visually conflict with `.filter-btn--active` styles in standard motion mode (the specificity fix ensures correctness, but no explicit hover-state test exists)
- [ ] Reduced motion + filter animation interruption — Test rapid filter clicks under reduced motion to verify instant state changes don't cause stale classes (combines rapid-clicks.spec.js scope with reduced motion)
- [ ] Scroll animation visibility under reduced motion — Verify `IntersectionObserver` early-exit path doesn't leave stale observers or prevent `.is-visible` from being set on dynamically-added content
- [ ] Fix specificity comment in `.filter-btn.filter-btn--active` — Comment claims `.filter-btn:hover` is `(0,1,1)` but it's actually `(0,2,0)` (class + pseudo-class); the double-class fix wins by cascade order, not higher specificity as documented (code review finding, confidence 75/100)

### From PERF-007: JS Cache-Busting (2026-02-22)
**Origin**: PERF-007 implementation

- [ ] Source maps for minified JS — Add terser `sourceMap` option for debugging minified JS in production (mirror CSS source map discussion from PERF-004)
- [ ] Watch mode JS file sync — Currently watch mode references `js/main.js` directly; consider a file watcher that copies to `dist/main.js` on change for consistent `dist/` references across modes
- [ ] Restore post-write validation — Old `hash-css.js` had "Step 4: Validate final state" checking hashed file exists and HTML refs updated; `hash-assets.js` dropped this safety net (code review finding, confidence 75/100)
- [ ] Atomic CSS rename — `hash-assets.js` uses `unlinkSync` + `writeFileSync` for CSS instead of atomic `renameSync`; if `writeFileSync` throws after `unlinkSync`, source file is lost (code review finding, confidence 75/100)
- [ ] Update CLAUDE.md Overview Build Tools — Add terser to "Build Tools" line in project-description block: "PostCSS (CSS bundling), Critters (critical CSS inlining), terser (JS minification)" (code review finding, confidence 75/100)
- [ ] Update `npm run build` inline comment — CLAUDE.md Build Commands comment still says "Build CSS with cache-busting" but build now hashes both CSS and JS (code review finding, confidence 75/100)

### From TEST-004: Theme-specific Axe Scanning (2026-02-17)
**Origin**: docs/archive/plans/2026-02-17_test-004-theme-specific-axe-scanning.md

- [ ] Read `--transition-base` from CSS in `setTheme()` — Replace hardcoded 400ms with CSS variable read (follows timing.js pattern for single source of truth)
- [ ] Extend theme testing to animation suite — `animation-states.spec.js` could verify filter animations render correctly in both themes
- [ ] Add `prefers-color-scheme` path testing — Current tests only exercise `data-theme` CSS path; the `@media (prefers-color-scheme)` fallback is untested
- [ ] `setTheme()` should persist to localStorage — Currently only sets `dataset.theme` without updating `localStorage.theme`, leaving the page's system-preference listener able to override the forced theme during tests (code review finding, confidence 75/100)
- [ ] Increase dark theme `--color-text-muted` contrast margin — Current `#8a8a8a` achieves only 4.60:1 against card background `#16213e` (0.10 above WCAG AA minimum); consider bumping to match light theme's comfortable margin pattern (code review finding, confidence 35/100)

### From QUALITY-004: Pre-commit Hook with Husky (2026-02-17)
**Origin**: docs/archive/plans/2026-02-17_quality-004-pre-commit-hook-husky.md

- [ ] Extend lint-staged with Prettier — Add `"*.html": "prettier --write"` when HTML formatting is adopted

### From TEST-003: CSS Linting with Stylelint (2026-02-16)
**Origin**: docs/archive/plans/2026-02-16_test-003-css-linting-stylelint.md

- [ ] Add `stylelint-order` plugin — Enforce consistent CSS property ordering within declarations (requires team agreement on ordering convention)
- [ ] VS Code Stylelint extension — Document recommended Stylelint VS Code extension settings for real-time linting feedback during development

### From PERF-006: Inline Critical CSS (2026-02-16)
**Origin**: docs/archive/plans/2026-02-16_perf-006-inline-critical-css.md

- [ ] Reduce inline CSS size — index.html at 16.1 KB exceeds 14 KB TCP slow-start guideline. Investigate Critters config or manual exclusions to reduce critical CSS extraction scope.
- [ ] Upstream CSS custom property extraction — Critters doesn't extract `[data-theme=light]{--var:val}` blocks. Consider contributing fix or using PostCSS API for more precise extraction.
- [ ] Automated inline CSS size regression — Add build step or test that fails if inline CSS exceeds threshold (e.g., 20 KB) to prevent size creep over time.
- [ ] Add `.catch()` to top-level async call — `inlineCriticalCSS()` in `scripts/inline-css.js` is called without `.catch()` handler; function body has try-catch with `process.exit(1)` so low risk, but adding `.catch()` follows Node.js best practice for top-level async (code review finding, confidence 25/100)
- [ ] Robust CSS block matching regex — `css.match(/\[data-theme=light\]\{[^}]+\}/)` in `inline-css.js` could truncate if future CSS contains `}` inside data URIs; consider balanced-brace parsing or PostCSS API (code review finding, confidence 25/100)
- [ ] Handle multiple `<style>` tags — `inline-css.js` assumes single `<style>` tag for light theme injection and size validation; if Critters ever produces multiple blocks, injection targets wrong location (code review finding, confidence 25/100)

### From POLISH-001: Focus Indicator Transition (2026-02-12)
**Origin**: docs/archive/plans/2026-02-12_polish-001-focus-indicator-transition.md

- [ ] CSS custom property for focus transition timing — Add `--focus-transition-duration` to `variables.css` for independent control of focus animation speed (currently reuses `--transition-fast`)

### From QUALITY-003: CSS Specificity Documentation (2026-02-11)
**Origin**: docs/archive/plans/2026-02-11_quality-003-css-specificity-documentation.md

- [ ] Stylelint rule for section ordering — Custom Stylelint rule to enforce filter animation selectors always appear after scroll animation selectors in components.css (tracks with TEST-003)
- [ ] CSS layers for explicit priority — Use `@layer scroll, filter` to replace cascade-order dependency with explicit layer priority when browser support allows
- [ ] Reformat compound selector in specificity table — The `.project-card.project-card--filtering-in.is-filtering` selector is split across two indented lines in the comment, which could visually resemble a descendant selector; reformat to single line for clarity (code review finding, confidence 50/100)

### From QUALITY-002: Centralize activateFilter() (2026-02-10)
**Origin**: docs/archive/plans/2026-02-10_quality-002-centralize-activate-filter.md

- [ ] Unify resetFilter into activateFilter — `resetFilter()` could become `activateFilter("all", { manageFocus: true })` to further reduce duplication (current separation is clearer for distinct use cases)
- [ ] Simplify `applyHashFilter()` JSDoc — Comment describes implementation details (conditional focus, hash non-update) now delegated to `activateFilter()`; update to reference options rather than restate behavior (code review finding, confidence 62/100)

### From QUALITY-001: Centralize resetFilter() (2026-02-10)
**Origin**: docs/archive/plans/2026-02-10_quality-001-centralize-reset-filter.md

- [ ] Conditional focus in `resetFilter()` — Add optional `shouldFocus` parameter (default `true`) to prevent jarring focus jumps if function is ever called from system-initiated contexts like hash navigation (code review finding, confidence 25/100)

### From PERF-004: CSS Minification with cssnano (2026-02-09)
**Origin**: docs/archive/plans/2026-02-09_perf-004-css-minification-cssnano.md

- [ ] Source maps for production builds — Add `--map` flag to build script for debugging minified CSS in production

### From TEST-001: Playwright E2E Tests (2026-02-09)
**Origin**: TEST-001 implementation via feature-dev workflow

- [ ] Visual regression snapshots — Add Playwright screenshot comparison tests for filter animation visual states (exit, entrance, final) to catch CSS regressions

### From DOCS-001: Update PROJECT.md (2026-02-05)
**Origin**: docs/archive/plans/2026-02-05_docs-001-update-project-md.md

- [ ] PROJECT.md freshness validation — Pre-commit hook or CI check that warns when "Last Updated" date is >2 weeks old after code changes
- [ ] Automated external link inventory — Script that extracts external href values from HTML and compares against PROJECT.md External Services table

### From A11Y-001: Screen Reader Testing (2026-02-04)
**Origin**: docs/archive/plans/2026-02-04_a11y-001-screen-reader-testing.md

- [ ] Automated screen reader testing — Use `@testing-library/dom` with `aria-query` or Playwright accessibility assertions to catch ARIA regressions in CI
- [ ] Screen reader announcement logging — Add development mode that logs all live region updates to console for debugging accessibility issues without a screen reader
- [ ] Debounce live region announcements on rapid filter clicks — `announceFilterResults()` fires before `isAnimating` guard is set, so rapid clicks can queue overlapping screen reader announcements (code review finding, confidence 75/100)

### From SEO-004: Improve Meta Descriptions (2026-02-04)
**Origin**: docs/archive/plans/2026-02-04_seo-004-improve-meta-descriptions.md

- [ ] Track description character counts in CLAUDE.md — Add reference table of all description lengths to catch regressions when modified


