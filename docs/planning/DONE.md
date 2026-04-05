# DONE

**Last Updated**: 2026-04-05 (Test Quality Improvements completed)

Completed tasks for the portfolio project.

---

## 2026-04-05

### Test Quality Improvements

**Plan**: [docs/archive/plans/2026-04-05_test-quality-improvements.md](../archive/plans/2026-04-05_test-quality-improvements.md)
**Spec**: [docs/archive/specs/2026-04-05_test-quality-improvements-design.md](../archive/specs/2026-04-05_test-quality-improvements-design.md)
**Summary**: Fixed 3 test quality issues — replaced `page.evaluate` with web-first assertions, optimized reduced-motion test setup, added missing screenshot assertion.
**Key Changes**:
- Replaced 4 `page.evaluate(() => document.activeElement.id)` with `expect(locator).toBeFocused()` in `accessibility.spec.js`
- Fixed 2 `test.expect()` → `expect()` for consistency in `submission.spec.js`
- Removed redundant `ModalPage` re-creation and `waitForScrollAnimations()` in reduced-motion `beforeEach` of `modal/axe-scan.spec.js`
- Added `expectScreenshotsCount(2)` to rule-indicators test in `basic-modal.spec.js`
**Resolved BACKLOG items**: 3 items (reduced-motion efficiency ×2, expectScreenshotsCount)

---

## 2026-04-03

### Code Quality & Lint Fixes

**Plan**: [docs/archive/plans/2026-04-03_code-quality-lint-fixes.md](../archive/plans/2026-04-03_code-quality-lint-fixes.md)
**Summary**: Fixed lint-staged JS glob bypassing ESLint ignores; verified and marked 2 backlog items as already-resolved.
**Key Changes**:
- Scoped lint-staged from `"*.js"` to `"{js,scripts,tests}/**/*.js"` — prevents root config files from being passed to ESLint during pre-commit
- Confirmed CLAUDE.md duplicate JS linting descriptions already consolidated (Build System section removed)
- Confirmed "Adding New Projects" template already includes `data-animate` attributes
**Spawned Tasks**: 2 items added to BACKLOG.md (flaky Firefox filter test, ESLint ignores for root configs)

---

## 2026-03-28

### Contact Form Accessibility Hardening

**Plan**: [docs/archive/plans/2026-03-27_a11y-contact-form-hardening.md](../archive/plans/2026-03-27_a11y-contact-form-hardening.md)
**Spec**: [docs/archive/specs/2026-03-27_contact-form-a11y-hardening-design.md](../archive/specs/2026-03-27_contact-form-a11y-hardening-design.md)
**Summary**: Fixed 7 accessibility and quality issues in the contact form — 3 WEEKLY items (6 pts) + 4 BACKLOG items from CHALLENGE-003 code review.
**Key Changes**:
- Added focus management: `showFormStatus()` focuses action button, `resetForm()` focuses first field
- Aligned form input focus-visible pattern with reset.css convention (base transparent outline + outline-color only)
- Fixed CSS cascade conflict: removed `.contact-form__input` from theme transition group, added `.contact-form__status`
- Replaced Unicode status icons (✓/✗) with inline SVG (stroke-based checkmark/X)
- Replaced `page.evaluate` focus check with web-first `toBeFocused()` assertion + 2 new focus tests
- Fixed reduced-motion axe test to use POM `goto()` instead of direct `page.goto()`
**Spawned Tasks**: 2 items added to BACKLOG.md (Firefox rapid-click flakiness, extend focus-visible pattern to other components)

---

## 2026-03-27

### Archive Cleanup: Documentation Debt & Archive Cleanup

**Plan**: [docs/archive/plans/2026-03-27_archive-cleanup.md](../archive/plans/2026-03-27_archive-cleanup.md)
**Summary**: Consolidated `docs/superpowers/` into the standard `docs/archive/` directory structure. Cleaned up accumulated documentation debt from prior task completions.
**Key Changes**:
- Deleted 4 duplicate files from `docs/superpowers/` (already existed in archive)
- Archived 4 unique files from `docs/superpowers/` to `docs/archive/` (with underscore naming fix)
- Moved 3 misplaced design specs from `archive/plans/` to `archive/specs/`
- Updated stale spec references in 8 archived plan files
- Added `specs/` directory to `docs/archive/README.md` index
- Added `.gitkeep` files to preserve empty `docs/superpowers/` structure
**Spawned Tasks**: 2 items added to BACKLOG.md (automate consolidation, enforce naming convention)

---

## 2026-03-25

### CONTENT-004: Update Project Information

**Plan**: [docs/archive/plans/2026-03-24_content-004-update-project-info.md](../archive/plans/2026-03-24_content-004-update-project-info.md)
**Summary**: Full audit and update of all 8 portfolio projects against their GitHub repos. Updated descriptions, tech stacks, dates, and modal data based on GitHub API findings.
**Key Changes**:
- Audited all 8 repos via GitHub API for commit dates, tech stacks, and README content
- Rewrote card descriptions to highlight strongest aspects of each project
- Expanded card tech stacks to match `projects.json` (all 8 projects had missing items)
- Updated `data-updated` dates to reflect actual last meaningful commits
- Fixed svg-processor tech stack: CairoSVG → svglib (code uses svglib, not CairoSVG)
- Updated dropshipping tech stack with 3 additional technologies (Next.js, PostgreSQL, Stripe)
- Updated modal test assertions for changed `techPillsCount` values
- Verified all external links live, flagged status mismatches for user review
**Spawned Tasks**: 5 items added to BACKLOG.md (screenshots, rating_bot showcase update, social-stats showcase, svg-processor README fixes)

---

## 2026-03-23

### CONTENT-003: Add CleanSpark to Portfolio

**Plan**: [docs/archive/plans/2026-03-23_content-003-cleaning-site.md](../archive/plans/2026-03-23_content-003-cleaning-site.md)
**Summary**: Added CleanSpark (multi-theme cleaning business website) as the 8th portfolio project card with full modal detail data, 5 theme screenshots, and repo rename fix.
**Key Changes**:
- Renamed GitHub repo `clening-test` → `cleaning-test` via API
- Added project card to `index.html` (Web category, Tier 3 speed build)
- Added modal data to `data/projects.json` (3 descriptions, 6 highlights, 5 screenshots)
- Created 6 webp images (1 thumbnail + 5 modal screenshots, one per theme)
- Updated test constants (`FilterPage.js`, `ModalPage.js`) and fixed hardcoded count in accessibility test
- Updated `PORTFOLIO_REQUIREMENTS.md` audit table and `CLAUDE.md` project counts
**Spawned Tasks**: 2 items added to BACKLOG.md

---

## 2026-03-22

### CONTENT-002: Define Project Portfolio Requirements

**Plan**: [docs/archive/plans/2026-03-22_content-002-portfolio-requirements.md](../archive/plans/2026-03-22_content-002-portfolio-requirements.md)
**Summary**: Created tiered quality standard for portfolio projects (Tier 1: Production, Tier 2: Hardware, Tier 3: Utilities/Speed Builds) with per-tier requirements and audit checklist.
**Key Changes**:
- Created `docs/PORTFOLIO_REQUIREMENTS.md` as the quality reference
- Defined 3 project tiers with scaled requirements
- Created audit checklist for existing and new projects
- Indexed in `docs/README.md`
**Spawned Tasks**: 2 items added to BACKLOG.md

### BUG-004: Filter Toggle-to-Reset Race Condition on Rapid Clicks

**Plan**: [docs/archive/plans/2026-03-22-bug-004-filter-race-condition.md](../archive/plans/2026-03-22-bug-004-filter-race-condition.md)
**Summary**: Fixed race condition where `currentFilter` was stale during animation, causing toggle-to-reset to misroute rapid clicks. Moved `currentFilter` update to the start of `filterProjects()` (eager update), simplified `activateFilter` guard, and made rapid-click tests deterministic.
**Key Changes**:
- `js/main.js` — Moved `currentFilter = category` to top of `filterProjects()`, removed 3 redundant assignments, simplified `activateFilter` guard (removed `!isAnimating` escape hatch)
- `tests/filter/rapid-clicks.spec.js` — Double-click test now asserts deterministic toggle-to-reset; mid-exit test uses DOM state polling instead of timing-based wait
- `tests/filter/toggle-behavior.spec.js` — Added test for toggle-to-reset during animation (core BUG-004 scenario)
**Spawned Tasks**: 2 items added to BACKLOG.md, 2 existing items marked resolved

---

## 2026-03-21

### CHALLENGE-003: Contact Form

**Plan**: [docs/archive/plans/2026-03-21_challenge-003-contact-form.md](../archive/plans/2026-03-21_challenge-003-contact-form.md)
**Summary**: Added accessible contact form replacing the email mailto link, with Formspree integration, hybrid client-side validation, inline success/error feedback, and honeypot spam protection. Full Playwright test suite (102 tests across 3 browsers).
**Key Changes**:
- `css/variables.css` — Added `--color-error`, `--color-error-bg`, `--color-success`, `--color-success-bg` design tokens (dark + light themes)
- `css/form.css` — New form stylesheet with BEM naming, validation states, status messages, reduced-motion support
- `css/main.css` — Added `@import url("form.css")`, added `.contact-form__input` to theme transition group
- `index.html` — Replaced email `<li>` with `<form>` + status container; kept 4 social links
- `js/main.js` — Added `initContactForm()` + 6 supporting functions (validation, submission, status, reset)
- `tests/pages/FormPage.js` — New Page Object Model with Formspree mocking
- `tests/form/` — 4 test suites: validation, submission, accessibility, axe-scan (WCAG 2.1 AA)
- `eslint.config.js` — Added 11 FormPage assertion methods to `expect-expect`
**Spawned Tasks**: 4 items added to BACKLOG.md

### QUALITY-010: commitlint for Conventional Commits

**Plan**: [docs/archive/plans/2026-03-21_quality-010-commitlint.md](../archive/plans/2026-03-21_quality-010-commitlint.md)
**Summary**: Added commitlint with `@commitlint/config-conventional` to enforce Conventional Commits format on all commit messages via a husky `commit-msg` hook. Configured 72-char header limit and disabled `subject-case` to preserve existing uppercase subject style. Also added `commitlint.config.js` to ESLint ignores.
**Key Changes**:
- `package.json` — Added `@commitlint/cli` and `@commitlint/config-conventional` devDependencies
- `commitlint.config.js` — New config extending conventional preset with 72-char header limit and `subject-case: [0]`
- `.husky/commit-msg` — New hook running `npx --no -- commitlint --edit $1`
- `eslint.config.js` — Added `commitlint.config.js` to ignores (root CJS file)
- `CLAUDE.md` — Documented commitlint config, hook, and conventions
**Spawned Tasks**: 2 items added to BACKLOG.md (ESLint glob for root configs, memory-updater hook friction)

---

## 2026-03-20

### QUALITY-009: ESLint Enhancements (Playwright plugin + no-console)

**Plan**: [docs/archive/plans/2026-03-20_quality-009-eslint-enhancements.md](../archive/plans/2026-03-20_quality-009-eslint-enhancements.md)
**Summary**: Added `eslint-plugin-playwright` with `flat/recommended` preset for test-specific linting and `no-console: "error"` for browser code. Configured two-entry flat config pattern, 27 POM assertion methods in `assertFunctionNames`, SEO file exception for cross-tag comparisons, and disabled `no-wait-for-timeout`/`no-skipped-test` rules for intentional patterns.
**Key Changes**:
- `package.json` — Added `eslint-plugin-playwright` devDependency
- `eslint.config.js` — Playwright plugin (two-entry pattern + SEO override), `no-console: "error"` for browser code, POM assertion methods config
- `CLAUDE.md` — ESLint v9 → v10 across all references, documented new rules and plugin
**Spawned Tasks**: 2 items added to BACKLOG.md (assertFunctionNames glob limitation, pre-scan process improvement)

### CONTENT-001: Populate Remaining Project Cards with Detail Data

**Plan**: No plan file (implemented via feature-dev workflow)
**Summary**: Added project detail modal data for all 4 remaining portfolio cards (lubrication, hx711-scale, dropshipping, svg-processor). Each entry includes 3-paragraph descriptions, 6 highlights, tech stack, and links. Added `data-project` attributes and "View Details" buttons to all cards in `index.html`. Screenshots left empty for future capture.
**Key Changes**:
- `data/projects.json` — 4 new entries with descriptions, highlights, tech, links (screenshots: [])
- `index.html` — `data-project` attributes and "View Details" buttons on 4 cards
- `tests/pages/ModalPage.js` — `PROJECTS_WITH_DETAILS` expanded from 3 to 7
- `tests/modal/basic-modal.spec.js` — 4 new content count assertion tests
**Spawned Tasks**: 2 items added to BACKLOG.md (detail screenshots, dropshipping description review)

---

## 2026-03-19

### TEST-007: Axe-core WCAG Scan for Modal

**Plan**: No plan file (followed existing `axe-scan.spec.js` pattern from filter tests)
**Summary**: Added axe-core WCAG 2.1 AA accessibility scanning to the modal test suite. Scans modal-open state for each of 3 projects individually, plus explicit light theme, dark theme, and reduced-motion variants. Scan scoped to `#project-modal` to avoid false-positive contrast violations from semi-transparent backdrop.
**Key Changes**:
- `tests/modal/axe-scan.spec.js` — New test file: 3 projects × 4 variants (default, light, dark, reduced-motion)
- `tests/pages/ModalPage.js` — Added `setTheme()` and `waitForScrollAnimations()` helpers
- `tests/utils/axe-helper.js` — Added `include`/`exclude` scoping support
**Spawned Tasks**: Review improvements added to BACKLOG.md

### CHALLENGE-002: Project Detail Modal

**Plan**: No plan file (implemented from BACKLOG.md task description)
**Summary**: Implemented a full project detail modal overlay that opens when clicking a project card, displaying extended descriptions, technical highlights, tech stack pills, screenshot gallery, and external links. Three projects are fully populated (rating_bot, Industrial Rule Indicators, Media Viewer).
**Key Changes**:
- `css/modal.css` — New modal CSS with open/close transitions, focus styles, responsive layout, reduced-motion support
- `css/main.css` — Imports modal.css
- `js/main.js` — `initProjectModal()` with lazy JSON fetch, safe DOM rendering, focus trap, backdrop/ESC close, URL hash integration, scroll lock, focus restoration
- `data/projects.json` — Project detail data for 3 projects (descriptions, highlights, tech, screenshots, links)
- `index.html` — Modal container element, "View Details" buttons on clickable cards, data-project attributes
- `.github/workflows/deploy.yml` — Copy `data/` directory to `_site/` in deploy job
- `tests/modal/` — 45 new Playwright tests across 5 spec files (basic-modal, close-modal, accessibility, url-hash, reduced-motion)
- `tests/pages/ModalPage.js` — Page Object Model for modal system
**Spawned Tasks**: 5 items added to BACKLOG.md

---

## 2026-03-18

### PERF-009: Build Size Trend History

**Plan**: [docs/archive/plans/2026-03-18_perf-009-build-size-trend-history.md](docs/archive/plans/2026-03-18_perf-009-build-size-trend-history.md)
**Summary**: Added build size trend tracking to `report-sizes.js`. Each `npm run build` appends a timestamped entry with raw and gzip sizes for CSS and JS to `docs/size-history.json`, providing historical visibility into asset growth.
**Key Changes**:
- Extended `scripts/report-sizes.js` with `appendSizeHistory()` function
- Created `docs/size-history.json` (committed, updated by local builds)
- Updated CLAUDE.md build system documentation
**Spawned Tasks**: 3 items added to BACKLOG.md (trend visualization, budget trend alerts, CI size comparison)

---

## 2026-03-12

### QUALITY-008: Stylelint Rule to Prevent `transition: all`

**Plan**: [docs/archive/plans/2026-03-12_quality-008-stylelint-transition-all.md](docs/archive/plans/2026-03-12_quality-008-stylelint-transition-all.md)
**Summary**: Added Stylelint `declaration-property-value-disallowed-list` rule blocking `transition: all` and `transition-property: all` with word-boundary regex. Preventive guard — zero existing violations. Documented convention in CLAUDE.md.
**Key Changes**:
- `.stylelintrc.json` — New `declaration-property-value-disallowed-list` rule with custom error message
- `CLAUDE.md` — Documented rule in CSS Linting section and Build System Pattern
**Spawned Tasks**: 2 items added to BACKLOG.md

### TEST-006: Automated OG Meta Tag Validation

**Plan**: [docs/archive/plans/2026-03-12_test-006-og-meta-validation.md](docs/archive/plans/2026-03-12_test-006-og-meta-validation.md)
**Summary**: Added 30 Playwright tests validating all OG/Twitter meta tags, core SEO tags, JSON-LD structured data, and cross-tag consistency in index.html. Catches regressions when HTML meta tags are modified.
**Key Changes**:
- `tests/seo/meta-tags.spec.js` — New test file with 5 test groups (Open Graph, Twitter Card, Core SEO, JSON-LD, Cross-tag Consistency)
- `CLAUDE.md` — Updated architecture, testing pattern, and build commands sections
**Spawned Tasks**: 2 items added to BACKLOG.md

### QUALITY-007: ESLint Integration for JavaScript

**Plan**: [docs/archive/plans/2026-03-12_quality-007-eslint.md](docs/archive/plans/2026-03-12_quality-007-eslint.md)
**Summary**: Added ESLint v9 flat config with three environment blocks (browser ES6+, Node.js CJS, Playwright ESM). Rules: `eslint:recommended` + `no-var` + `prefer-const`. Integrated into CI, lint-staged, and combined `npm run lint` script.
**Key Changes**:
- `eslint.config.js` — New ESLint v9 flat config with per-directory sourceType and globals
- `package.json` — Added `lint:js`, `lint:js:fix`, `lint` scripts + `*.js` lint-staged entry
- `.github/workflows/deploy.yml` — Added `Lint JS` step to lint job
- `js/main.js` — Fixed unused catch bindings (`catch(e)` → `catch`)
- Test files — Removed unused imports and parameters (3 files)
**Spawned Tasks**: 3 items added to BACKLOG.md

---

## 2026-03-11

### CI-002: Narrow Pages Deploy Artifact Path

**Plan**: N/A (implemented via feature-dev workflow)
**Summary**: Replaced `upload-pages-artifact path: '.'` (full repo checkout) with a staging step that copies only production assets into `_site/` before upload. Source files, tests, docs, and learning projects are now excluded from deployment.
**Key Changes**:
- `.github/workflows/deploy.yml` — New "Stage production files" step in deploy job; `upload-pages-artifact` now uses `path: '_site'`
**Spawned Tasks**: 2 items added to BACKLOG.md

---

### CHALLENGE-001: Lighthouse CI in GitHub Actions

**Plan**: N/A (implemented via feature-dev workflow)
**Summary**: Added Lighthouse CI as a new parallel job in the GitHub Actions pipeline. Runs 3 audits against the local test server (desktop preset), asserts all 4 categories >= 90/100, and gates deployment alongside Playwright tests. Site scores 100/100 on all categories.
**Key Changes**:
- `lighthouserc.js` — New LHCI config (3 runs, desktop preset, `startServerCommand`, per-category thresholds)
- `.github/workflows/deploy.yml` — New `lighthouse` job (needs: build, parallel to test, gates deploy)
- `package.json` — Added `@lhci/cli` devDependency and `npm run lighthouse` script
- `.gitignore` — Added `.lighthouseci/`
- `CLAUDE.md` — Documented Lighthouse CI pattern, updated build system and architecture sections
**Spawned Tasks**: 2 items added to BACKLOG.md

---

## 2026-03-05

### QUALITY-006: Test Server Error Handling

**Plan**: N/A (implemented via feature-dev workflow)
**Summary**: Added `.on('error')` handler to `scripts/serve.js` for clear, actionable error messages on server startup failures. Handles EADDRINUSE (port in use), EACCES (permission denied), and generic errors with `process.exit(1)`, consistent with other build scripts.
**Key Changes**:
- `scripts/serve.js` — chained `.on('error')` handler after `.listen()` (lines 56-72)
- CLAUDE.md — documented 404 handling and error handling in Testing Pattern section
**Spawned Tasks**: 0 items

### QUALITY-005: Audit Remaining transition:all Usage

**Plan**: [docs/archive/plans/2026-03-05_quality-005-transition-all-audit.md](docs/archive/plans/2026-03-05_quality-005-transition-all-audit.md)
**Summary**: Audited all CSS source files for `transition: all` declarations. Found zero occurrences — POLISH-001 had already fixed all instances (`.btn` and `.project-card__link`). Confirmed with full Playwright test suite (198/198 passed). No code changes needed.
**Key Changes**:
- Verification-only audit: no CSS source files contain `transition: all`
- All 15+ transition declarations use explicit property lists
**Spawned Tasks**: 2 items added to BACKLOG.md (Stylelint rule for prevention, convention documentation)

### SEO-007: Automate Sitemap lastmod Updates

**Plan**: N/A (implemented via feature-dev workflow)
**Summary**: Added `scripts/update-sitemap.js` as the first step of `npm run build`. Reads last git commit date for `index.html` via `git log -1 --format=%aI` and updates `<lastmod>` in `sitemap.xml`. Falls back to HEAD commit date for shallow clones. Idempotent — skips write if date unchanged. Added `sitemap.xml` to CI build artifact for proper deployment.
**Key Changes**:
- New `scripts/update-sitemap.js` — git-driven sitemap lastmod updater
- `package.json` `build` script prepended with `node scripts/update-sitemap.js &&`
- `.github/workflows/deploy.yml` — added `sitemap.xml` to build-output artifact
**Spawned Tasks**: 0 items

---

## 2026-02-25

### PERF-008: Build Size Reporting

**Plan**: N/A (implemented via feature-dev workflow)
**Summary**: Added `scripts/report-sizes.js` as the final step of `npm run build`. Prints an aligned table of CSS and JS asset sizes: raw, minified (JS source → dist), and gzip. Enforces gzip size budgets (CSS: 20 KB, JS: 10 KB) with warnings. Zero new dependencies — uses Node built-in `zlib.gzipSync()`.
**Key Changes**:
- New `scripts/report-sizes.js` — globs `dist/` for hashed files, reports sizes with budget warnings
- `package.json` `build` script appended with `&& node scripts/report-sizes.js`
**Spawned Tasks**: 3 items added to BACKLOG.md

---

## 2026-02-24

### TEST-005: Reduced Motion Accessibility Test

**Plan**: N/A (implemented via feature-dev workflow)
**Summary**: Added 8 Playwright tests verifying page accessibility under `prefers-reduced-motion: reduce` — element visibility, filter functionality (category filter, toggle-to-reset, URL hash), and WCAG 2.1 AA axe scans across both themes. Discovered and fixed hover specificity bug (`.filter-btn--active` → `.filter-btn.filter-btn--active`) and two dark theme category badge contrast violations (`--color-category-web`, `--color-category-tools`).
**Key Changes**:
- New test file `tests/filter/reduced-motion.spec.js` with 8 tests
- CSS hover specificity fix: double-class selector (0,2,0) beats `:hover` (0,1,1)
- Dark theme `--color-category-web`: `#2196f3` → `#42a5f5` (contrast 4.05:1 → passes 4.5:1)
- Dark theme `--color-category-tools`: `#9c27b0` → `#ce93d8` (contrast 2.31:1 → passes 4.5:1)
- Regenerated inline critical CSS in index.html and 404.html
**Spawned Tasks**: 3 items added to BACKLOG.md

---

### CI-001: Separate CI Workflow Jobs

**Plan**: N/A (implemented via feature-dev workflow)
**Summary**: Split the monolithic `build-and-test` GitHub Actions job into 4 separate jobs (lint → build → test → deploy) with artifact passing between jobs. Tests gate deployment, Pages artifact no longer includes `node_modules/`. Updated `upload-pages-artifact` from v3 to v4.
**Key Changes**:
- Split `build-and-test` into `lint`, `build`, `test`, `deploy` jobs
- Build uploads small overlay artifact (index.html, 404.html, dist/) with 1-day retention
- Test job: checkout + npm ci + download build artifact overlay
- Deploy job: checkout + download build artifact + configure-pages + upload-pages-artifact + deploy-pages
- Deploy gated by both build and test (`needs: [build, test]`)
- Moved `configure-pages` + `upload-pages-artifact` to deploy job (no `node_modules/` in Pages artifact)
- Bumped `upload-pages-artifact` from `@v3` to `@v4`
**Spawned Tasks**: 0 items added to BACKLOG.md

---

## 2026-02-22

### PERF-007: JS Cache-busting for main.js

**Plan**: N/A (implemented via feature-dev workflow)
**Summary**: Extended the build system to apply content-hash cache-busting to `js/main.js`, matching the existing CSS pattern. Replaced `hash-css.js` with a config-driven `hash-assets.js` that handles both CSS and JS assets. Added terser minification for JS (72% size reduction: 19,990 → 5,692 bytes).
**Key Changes**:
- Created `scripts/hash-assets.js` with config-driven ASSETS array (replaces `hash-css.js`)
- Deleted `scripts/hash-css.js` (superseded)
- Added terser devDependency for JS minification before hashing
- Updated npm scripts: `hash:css` → `hash:assets`
- JS output: `dist/main.[hash].js` (content-hashed, minified)
- Watch mode unhashes JS to `js/main.js` (source), CSS to `dist/style.css`
- Updated CLAUDE.md (6 sections) with new script name and JS hashing documentation
**Spawned Tasks**: 3 items added to BACKLOG.md (JS source maps, ESLint integration, watch mode JS sync)

---

## 2026-02-17

### TEST-004: Theme-specific Axe Scanning

**Plan**: [docs/archive/plans/2026-02-17_test-004-theme-specific-axe-scanning.md](../archive/plans/2026-02-17_test-004-theme-specific-axe-scanning.md)
**Summary**: Added explicit light and dark theme WCAG 2.1 AA scanning to axe-scan.spec.js. Tests immediately caught a real dark theme contrast violation (`--color-text-muted: #6b6b6b` → fixed to `#8a8a8a`). Also revealed existing tests ran in light theme all along (Playwright defaults colorScheme to 'light').
**Key Changes**:
- Added `setTheme(theme)` to FilterPage POM (sets data-theme, waits 400ms for transitions)
- Added nested Light/Dark theme describes with 4 new tests (page load + active IoT filter)
- Fixed dark theme `--color-text-muted` from `#6b6b6b` to `#8a8a8a` for WCAG AA compliance (~5.9:1 contrast)
- Test suite grew from 162 to 174 tests (12 new: 4 themes × 3 browsers)
**Spawned Tasks**: 3 items added to BACKLOG.md (CSS variable timing, animation theme tests, prefers-color-scheme path)

### QUALITY-004: Pre-commit Hook with Husky + lint-staged

**Plan**: [docs/archive/plans/2026-02-17_quality-004-pre-commit-hook-husky.md](../archive/plans/2026-02-17_quality-004-pre-commit-hook-husky.md)
**Summary**: Added Husky v9 pre-commit hook with lint-staged to run Stylelint --fix on staged CSS files before each commit. Lint failures block the commit. CI skips hook installation via HUSKY=0 env variable.
**Key Changes**:
- Installed `husky` (^9.1.7) and `lint-staged` (^16.2.7) as devDependencies
- Added `"prepare": "husky"` script and `"lint-staged"` config in package.json
- Created `.husky/pre-commit` hook calling `npx lint-staged`
- Added `HUSKY: 0` env to CI workflow `npm ci` step
**Spawned Tasks**: 2 items added to BACKLOG.md (extend lint-staged with more linters, commitlint)

---

## 2026-02-16

### PERF-006: Inline Critical CSS

**Plan**: [docs/planning/plans/2026-02-16_perf-006-inline-critical-css.md](plans/2026-02-16_perf-006-inline-critical-css.md)
**Summary**: Implemented critical CSS inlining using Google's Critters library. Above-fold styles extracted and inlined in `<style>` tags, full CSS loaded asynchronously via `media="print" onload` pattern. Includes noscript fallback, light theme variable injection, and idempotent restore mode for development.
**Key Changes**:
- Created `scripts/inline-css.js` with Critters wrapper, post-processing fixes, and `--restore` mode
- Updated `package.json` build pipeline: `build:css` -> `unhash` -> `inline:css` -> `hash:css`
- Added `critters` as devDependency
- Both `index.html` and `404.html` now have inline critical CSS (~16 KB and ~8 KB respectively)
- Updated CLAUDE.md with critical CSS inlining patterns and build system documentation
**Spawned Tasks**: 3 items added to BACKLOG.md (reduce inline size, upstream CSS variable extraction, automated size regression)

---

### TEST-003: Add CSS Linting with Stylelint

**Plan**: [docs/archive/plans/2026-02-16_test-003-css-linting-stylelint.md](docs/archive/plans/2026-02-16_test-003-css-linting-stylelint.md)
**Summary**: Set up Stylelint with stylelint-config-standard for CSS quality enforcement. BEM naming, kebab-case custom properties, modern color notation enforced. Integrated with CI pipeline (lint → build → test → deploy).
**Key Changes**:
- Added `.stylelintrc.json` with 7 rule overrides matching project conventions
- Added `lint:css` and `lint:css:fix` npm scripts
- Added "Lint CSS" step to GitHub Actions CI workflow
- Auto-fixed all CSS to modern notation (rgb(), range media queries, shorthand)
- Replaced deprecated `clip` with `clip-path` in `.sr-only`
**Spawned Tasks**: 3 items added to BACKLOG.md (stylelint-order, pre-commit hook, VS Code extension)

---

## 2026-02-13

### Social Card Preview Testing (SEO-006)

**Plan**: [docs/archive/plans/2026-02-13_seo-006-social-card-preview-testing.md](../archive/plans/2026-02-13_seo-006-social-card-preview-testing.md)
**Summary**: Validated OG/Twitter card rendering across 5 social platforms (Facebook, X, LinkedIn, Discord, WhatsApp) using programmatic validation and opengraph.xyz visual previews. All 16 meta tag checks passed. Added missing `twitter:image:alt` for accessibility. Created reusable `docs/SEO_TESTING.md` checklist.
**Key Changes**:
- Added `twitter:image:alt` meta tag to `index.html`
- Created `docs/SEO_TESTING.md` (reusable validation checklist)
- Captured preview screenshots for all 5 platforms in `docs/screenshots/`
**Spawned Tasks**: 2 items added to BACKLOG.md (automated OG CI validation, Facebook Debugger validation)

---

## 2026-02-12

### Focus Indicator Transition Animation (POLISH-001)

**Plan**: [docs/archive/plans/2026-02-12_polish-001-focus-indicator-transition.md](../archive/plans/2026-02-12_polish-001-focus-indicator-transition.md)
**Summary**: Added subtle 150ms fade-in/out for focus outlines on all interactive elements (links, buttons) using `outline-color` transition from transparent. Fixed `transition: all` on `.btn` and `.project-card__link` with explicit property lists.
**Key Changes**:
- Set permanent transparent outline on all `a`/`button` in `reset.css` with `outline-color` transition
- Added `outline-color` to transitions for `.btn`, `.project-card__link`, `.theme-toggle`, `.filter-btn`
- Fixed `transition: all` on `.btn` and `.project-card__link` (replaced with explicit properties)
- Removed `.btn` from `main.css` theme transition group (cascade conflict fix)
**Spawned Tasks**: 2 items added to BACKLOG.md (audit `transition: all`, focus transition CSS variable)

---

### Accessibility Regression Tests (TEST-002)

**Plan**: [docs/planning/plans/2026-02-12_test-002-accessibility-regression-tests.md](plans/2026-02-12_test-002-accessibility-regression-tests.md)
**Summary**: Added automated WCAG 2.1 AA accessibility scanning to Playwright test suite using `@axe-core/playwright`. Created 8 tests covering page load and all interaction states (filter clicks, keyboard nav, URL hash, toggle-to-reset). Fixed 4 light-theme color contrast violations discovered during testing.
**Key Changes**:
- Created `tests/utils/axe-helper.js` with `checkAccessibility(page, options)` utility
- Created `tests/filter/axe-scan.spec.js` with 8 tests (24 total across 3 browsers)
- Added `waitForScrollAnimations()` to FilterPage POM to prevent false positives
- Fixed WCAG AA contrast: `--color-text-muted`, `--color-category-backend`, `--color-status-active`, `--color-category-iot`
**Spawned Tasks**: 2 items added to BACKLOG.md (theme-specific scanning, reduced motion test)

---

## 2026-02-11

### Add CSS Specificity Documentation (QUALITY-003)

**Plan**: [docs/archive/plans/2026-02-11_quality-003-css-specificity-documentation.md](../archive/plans/2026-02-11_quality-003-css-specificity-documentation.md)
**Summary**: Added comprehensive specificity hierarchy documentation to the filter animations header comment in `components.css`. Documents all 9 scroll/filter animation selectors with their specificity values, explains the cascade order dependency, and references BUG-003.
**Key Changes**:
- Replaced 4-line header comment with 22-line documentation block including specificity table
- Documents 6 selectors sharing (0,2,0) specificity and why cascade order matters
- Includes "DO NOT REORDER" warning with BUG-003 reference
**Spawned Tasks**: 2 items added to BACKLOG.md (Stylelint section ordering rule, CSS layers for explicit priority)

---

## 2026-02-10

### Centralize activateFilter() Function (QUALITY-002)

**Plan**: [docs/archive/plans/2026-02-10_quality-002-centralize-activate-filter.md](../archive/plans/2026-02-10_quality-002-centralize-activate-filter.md)
**Summary**: Created centralized `activateFilter(category, options)` function in `js/main.js` to DRY up duplicated filter activation logic from click handler and `applyHashFilter()`. Uses options object pattern for explicit control over hash updates and conditional focus.
**Key Changes**:
- Added `activateFilter()` function with options object (`shouldUpdateHash`, `conditionalFocus`)
- Simplified click handler from 3 lines to 1 call
- Simplified `applyHashFilter()` from 12 lines to 2 calls
- Guard clause with `!isAnimating` check to handle stale `currentFilter` during rapid clicks
**Spawned Tasks**: 2 items added to BACKLOG.md (stabilize rapid-click tests, unify resetFilter)

---

### Centralize resetFilter() Function (QUALITY-001)

**Plan**: [docs/archive/plans/2026-02-10_quality-001-centralize-reset-filter.md](../archive/plans/2026-02-10_quality-001-centralize-reset-filter.md)
**Summary**: Extracted `resetFilter()` function in `js/main.js` to DRY up duplicated 4-line reset sequence from toggle-to-reset click handler and Escape key handler. Function includes internal guard clause (`if (currentFilter === "all") return`).
**Key Changes**:
- Added `resetFilter()` function (lines 432-442) with internal guard
- Simplified toggle-to-reset click handler (1 call instead of 4)
- Simplified Escape key handler (1 call instead of guard + 4)
**Spawned Tasks**: 0 new items (QUALITY-002 already in TODO.md)

---

### Bing Webmaster Tools Verification (SEO-005)

**Plan**: [docs/archive/plans/2026-02-10_seo-005-bing-webmaster-tools.md](../archive/plans/2026-02-10_seo-005-bing-webmaster-tools.md)
**Summary**: Verified site ownership in Bing Webmaster Tools via Google Search Console import (auto-verification, no meta tag needed). Submitted sitemap for Microsoft search coverage.
**Key Changes**:
- Site verified via GSC import (no code changes to `index.html`)
- Sitemap submitted to Bing (status: Processing, 1 URL discovered)
- Documentation updates only (CLAUDE.md, TODO/DONE/BACKLOG)
**Spawned Tasks**: 2 items added to BACKLOG.md (monitor Bing indexing, IndexNow protocol)

---

## 2026-02-09

### Add Playwright E2E Tests for Filter Animations (TEST-001)

**Plan**: N/A (implemented via feature-dev workflow)
**Summary**: Added comprehensive Playwright e2e test suite covering 46 tests across 3 browsers (Chromium, Firefox, WebKit) — 138 total. Tests cover basic filtering, toggle behavior, URL hash integration, animation states, keyboard navigation, accessibility (ARIA), and rapid click handling. Includes Page Object Model, CSS variable-based timing utilities, custom static server, and CI integration gating deployment.
**Key Changes**:
- Created 7 spec files in `tests/filter/` covering all filter interactions
- Created `tests/pages/FilterPage.js` (Page Object Model) and `tests/utils/timing.js`
- Created `scripts/serve.js` custom static server on port 4173
- Updated `deploy.yml` to run tests before deployment (build-and-test single job)
- Added `@playwright/test` devDep and test scripts to `package.json`
**Spawned Tasks**: 2 items added to BACKLOG.md (axe-core integration, visual regression snapshots)

---

### Add Cache-Busting with Content Hash (PERF-005)

**Plan**: [docs/archive/plans/2026-02-09_perf-005-cache-busting-content-hash.md](../archive/plans/2026-02-09_perf-005-cache-busting-content-hash.md)
**Summary**: Added post-build Node.js script that generates content-hashed CSS filenames (e.g., `style.8795488a.css`) for reliable browser cache invalidation. Zero new npm dependencies — uses Node.js built-ins (fs, crypto, path). Watch mode unhashes references automatically.
**Key Changes**:
- scripts/hash-css.js: SHA-256 hash, rename, HTML ref update, cleanup, validation
- package.json: Split build into `build:css` + `hash:css` pipeline; watch unhashes first
- index.html + 404.html: CSS reference updated to hashed filename
- CLAUDE.md: Updated build-commands, architecture, patterns sections
**Spawned Tasks**: 2 items added to BACKLOG.md (JS cache-busting, build size reporting)

---

### Add CSS Minification with cssnano (PERF-004)

**Plan**: [docs/archive/plans/2026-02-09_perf-004-css-minification-cssnano.md](../archive/plans/2026-02-09_perf-004-css-minification-cssnano.md)
**Summary**: Added cssnano to PostCSS build pipeline for production CSS minification. File size reduced from 27,223 to 19,177 bytes (29.6% smaller). Watch mode stays unminified for development debugging.
**Key Changes**:
- postcss.config.js: Function export with conditional cssnano via `ctx.env === 'production'`
- package.json: Added `--env production` to build script, added cssnano ^7.1.2 dependency
- CLAUDE.md: Updated 3 build documentation sections with minification info
**Spawned Tasks**: 2 items added to BACKLOG.md (source maps for production, build size reporting)

---

## 2026-02-05

### Update PROJECT.md (DOCS-001)

**Plan**: [docs/archive/plans/2026-02-05_docs-001-update-project-md.md](../archive/plans/2026-02-05_docs-001-update-project-md.md)
**Summary**: Comprehensive audit and update of PROJECT.md against actual codebase. Fixed 4 discrepancies, expanded 4 incomplete sections, added 3 new sections (SEO, PWA, Data Attributes).
**Key Changes**:
- Added 404.html, SEO files, PWA manifest to Project Structure
- Added Data Attributes table (7 attributes), SEO Configuration section, PWA & Favicon section
- Replaced External Links with External Services (added Telegram, GSC; removed Frontend Mentor)
- Expanded Accessibility Requirements (5 → 8), CI/CD Pipeline (5 → 7 steps), Pre-deployment Checklist (6 → 11)
**Spawned Tasks**: 2 items added to BACKLOG.md (PROJECT.md freshness validation, automated link inventory)

---

### Improve Focus Indicators (A11Y-002)

**Plan**: [docs/archive/plans/2026-02-05_a11y-002-improve-focus-indicators.md](../archive/plans/2026-02-05_a11y-002-improve-focus-indicators.md)
**Summary**: Added centralized focus CSS custom properties, fixed WCAG contrast failures on colored backgrounds (active filter buttons, primary buttons), and added explicit `:focus-visible` rules for all interactive elements.
**Key Changes**:
- Added 4 focus CSS variables (`--focus-outline-width`, `--focus-outline-offset`, `--focus-outline-color`, `--focus-outline-color-high-contrast`)
- Added high-contrast focus outlines for `.btn--primary` and `.filter-btn--active` (white in dark theme, dark in light theme)
- Added explicit `:focus-visible` for `.project-card__link`, `.contact__link`, and `button` baseline
- Replaced hardcoded `2px` values with CSS variables across 3 files
**Spawned Tasks**: 2 items added to BACKLOG.md (focus transition animation, focus-within for project cards)

---

## 2026-02-04

### Screen Reader Testing (A11Y-001)

**Plan**: [docs/archive/plans/2026-02-04_a11y-001-screen-reader-testing.md](../archive/plans/2026-02-04_a11y-001-screen-reader-testing.md)
**Summary**: Audited filter toolbar accessibility and fixed 3 screen reader issues: delayed live region announcements (moved before animations), awkward grammar in "all" category, lowercase category names, and double button announcements.
**Key Changes**:
- Moved `announceFilterResults()` before animations for instant feedback (was 700-1000ms delayed)
- Fixed grammar: "Showing all 7 projects" (was "Showing 7 all projects")
- Fixed casing: "Showing 3 IoT projects" (was "iot")
- Wrapped button count in `aria-hidden` span to prevent double announcement
**Spawned Tasks**: 2 items added to BACKLOG.md (automated screen reader testing, announcement logging)

---

### Improve Meta Descriptions (SEO-004)

**Plan**: [docs/archive/plans/2026-02-04_seo-004-improve-meta-descriptions.md](../archive/plans/2026-02-04_seo-004-improve-meta-descriptions.md)
**Summary**: Optimized all 5 description fields across the portfolio site for better search CTR. Meta description expanded from 98 to 160 chars with keywords and availability CTA. Also fixed site.webmanifest placeholder values.
**Key Changes**:
- Meta description: 98→160 chars with Python/Arduino/TypeScript keywords + "Available for new opportunities"
- OG/Twitter descriptions: rewritten with "explore real-world projects" CTA (153 chars)
- JSON-LD Person description: added tech specifics + opportunity signal (148 chars)
- 404 meta description: 45→102 chars with portfolio redirect context
- Fixed site.webmanifest "MyWebSite"/"MySite" → "Alexey Minakov | Software Developer"/"AM Portfolio"
**Spawned Tasks**: 2 items added to BACKLOG.md (description char count tracking, social card preview testing)

---

### Google Search Console Verification (SEO-003)

**Plan**: [docs/archive/plans/2026-02-04_seo-003-google-search-console.md](../archive/plans/2026-02-04_seo-003-google-search-console.md)
**Summary**: Added Google Search Console verification meta tag to `index.html` using URL prefix property method. Updated `sitemap.xml` lastmod date to reflect recent changes.
**Key Changes**:
- Added `<meta name="google-site-verification">` to `index.html` `<head>` (after `theme-color`)
- Updated `sitemap.xml` `<lastmod>` from `2026-01-28` to `2026-02-04`
**Spawned Tasks**: 1 item added to BACKLOG.md (Bing Webmaster Tools verification)

---

### Filter Count Badges (FEAT-006)

**Plan**: [docs/archive/plans/2026-02-04_feat-006-filter-count-badges.md](../archive/plans/2026-02-04_feat-006-filter-count-badges.md)
**Summary**: Added project count badges to filter buttons showing number of projects per category (e.g., "Backend (1)", "IoT (3)", "All (7)"). Counts calculated from DOM at page load, with clean `aria-label` for screen readers.
**Key Changes**:
- Added `calculateCategoryCounts()` and `updateButtonLabels()` functions in `js/main.js`
- Inline parentheses format preserves original button casing ("IoT" not "Iot")
- Screen reader labels: "Backend, 1 project" (singular/plural handled)
**Spawned Tasks**: 2 items added to BACKLOG.md (animated count transitions, zero-count button dimming)

---

### Fix Filter Animation Failures (BUG-003)

**Plan**: N/A (iterative debugging, no formal plan document)
**Summary**: Fixed three compounding root causes that made filter animations invisible or intermittent: CSS cascade order conflict between scroll and filter animation systems, missing `transition: none` on entrance start state, and parallel entrance/exit causing CSS columns layout thrashing. Also fixed cards below viewport fold disappearing after animation cleanup.
**Key Changes**:
- Reordered CSS sections: filter animations after scroll animations (cascade order fix)
- Added `transition: none` to `.project-card--filtering-in` start state
- Sequenced entrance after exit in JS (replaced parallel with sequential)
- Replaced double rAF with forced reflow (`offsetHeight`)
- Added `is-visible` class in cleanup to prevent scroll animation state loss
- Changed filter behavior: all visible cards exit, then target cards enter
**Spawned Tasks**: 2 items added to BACKLOG.md (CSS specificity documentation, animation integration tests)

---

## 2026-02-03

### Escape Key to Reset Filter (FEAT-005)

**Plan**: N/A (simple feature, no plan document)
**Summary**: Added Escape key handler to reset project filter to "all" when pressed while a filter button has focus. Follows existing roving tabindex keyboard navigation pattern.
**Key Changes**:
- Added `case "Escape"` to keyboard navigation switch in `js/main.js` (lines 419-428)
- Guard clause: only resets if `currentFilter !== "all"`
- Reuses existing functions: `setActiveButton()`, `allButton.focus()`, `filterProjects()`, `updateHash()`
- Live region announces results automatically via `filterProjects()`
**Spawned Tasks**: 2 items added to BACKLOG.md (centralized reset function, keyboard shortcut documentation)

---

### URL Hash-Based Filtering (FEAT-004)

**Plan**: N/A (implemented via PR workflow)
**Summary**: Added shareable filter links with URL hash integration (`#filter=backend`, etc.). Filter state persists in URL, browser back/forward navigation works, and focus management respects user context.
**Key Changes**:
- Added `getCategoryFromHash()`, `updateHash()`, `applyHashFilter()` functions in `js/main.js`
- URL hash updates when filter is clicked, removed when reset to "all"
- `popstate` event listener syncs filter with browser navigation
- Conditional focus: only moves focus to active button if user was already in filter toolbar (prevents jarring focus jumps on page load)
- Updated CLAUDE.md with URL Hash Integration pattern documentation
**Spawned Tasks**: None

---

### Enhanced Filter Animations (FEAT-003)

**Plan**: [docs/planning/plans/2026-02-03_feat-003-enhanced-filter-animations.md](plans/2026-02-03_feat-003-enhanced-filter-animations.md)
**Summary**: Added staggered fade + scale animations for project card filtering. Cards now smoothly animate when appearing/disappearing with 350ms duration and 30ms stagger delay between cards. Respects prefers-reduced-motion.
**Key Changes**:
- Added CSS animation classes (filtering-out, filtering-in, is-filtering)
- Added CSS variables for animation timing in variables.css
- Refactored filterProjects() with 4-phase animation orchestration
- Handles rapid clicks gracefully (cancels pending animations)
- Screen reader announcements delayed until animation completes
**Spawned Tasks**: 1 item added to BACKLOG.md (Playwright animation tests)

---

### Bundle CSS Files (PERF-003)

**Plan**: [docs/planning/plans/2026-02-03_perf-003-bundle-css.md](plans/2026-02-03_perf-003-bundle-css.md)
**Summary**: Added PostCSS build system to bundle 6 modular CSS files (using @import) into a single `dist/style.css` for production. Reduces HTTP requests from 6 to 1. GitHub Actions CI/CD workflow handles building and deploying.
**Key Changes**:
- Created `package.json` with PostCSS dependencies and build scripts
- Created `postcss.config.js` with postcss-import plugin
- Created `.github/workflows/deploy.yml` for CI/CD
- Updated HTML files to reference `dist/style.css`
- Added `dist/`, `node_modules/` to `.gitignore`
**Spawned Tasks**: 2 items added to BACKLOG.md (CSS minification, cache-busting)

---

## 2026-02-02

### Add Font Preload Hints (PERF-002)

**Plan**: [docs/archive/plans/2026-02-02_perf-002-font-preload-hint.md](../archive/plans/2026-02-02_perf-002-font-preload-hint.md)
**Summary**: Added `<link rel="preload">` for both Inter WOFF2 font files (latin and latin-ext) in `index.html` and `404.html` to start font downloads earlier in the critical rendering path, reducing FOUT and improving LCP.
**Key Changes**:
- Added two `<link rel="preload">` tags in `<head>` of both `index.html` and `404.html`
- Placed early in `<head>` (after favicons) for maximum benefit
- Includes `crossorigin` attribute (required per spec for font preloads)
**Spawned Tasks**: 2 items added to BACKLOG.md (inline critical CSS, Lighthouse CI)

---

### Fix Toggle-to-Reset Tabindex Desync (BUG-002)

**Plan**: [docs/archive/plans/2026-02-02_bug-002-tabindex-desync.md](../archive/plans/2026-02-02_bug-002-tabindex-desync.md)
**Summary**: Fixed focus/tabindex desync when clicking an active filter to reset to "All". Added `allButton.focus()` after `setActiveButton(allButton)` in the toggle-to-reset click handler to keep focus in sync with the roving tabindex state.
**Key Changes**:
- Added `allButton.focus()` at `js/main.js:200` in the toggle-to-reset branch
**Spawned Tasks**: 2 items added to BACKLOG.md (centralize filter activation, accessibility regression tests)

---

### Fix Theme Button Overlapping Header on Mobile (BUG-001)

**Plan**: [docs/archive/plans/2026-02-02_bug-001-theme-button-overlap.md](../archive/plans/2026-02-02_bug-001-theme-button-overlap.md)
**Summary**: Fixed theme toggle button overlapping navigation links on mobile by changing nav from absolute-positioned toggle to flexbox layout with toggle in normal document flow.
**Key Changes**:
- Changed `.nav` from `position: relative` to `display: flex; align-items: center`
- Changed `.theme-toggle` from `position: absolute` to `position: relative; flex-shrink: 0` (in-flow)
- Reduced `.nav__list` gap on mobile (`--space-3`), restored at tablet breakpoint (`--space-6`)
**Spawned Tasks**: 2 items added to BACKLOG.md (CSS Grid centering, hamburger menu)

---

## 2026-01-29

### Filter Keyboard Navigation (FEAT-002)

**Plan**: [docs/archive/plans/2026-01-29_feat-002-filter-keyboard-nav.md](../archive/plans/2026-01-29_feat-002-filter-keyboard-nav.md)
**Summary**: Added WAI-ARIA roving tabindex keyboard navigation to project filter buttons. Arrow keys move focus between filters, Home/End jump to first/last, Enter/Space activates. Live region announces filter results to screen readers.
**Key Changes**:
- Changed filter container from `role="group"` to `role="toolbar"` with roving tabindex
- Added `updateTabindex()`, `announceFilterResults()`, and keydown handler to `initProjectFilter()`
- Added `#filter-status` live region with `aria-live="polite"` for screen reader announcements
- No CSS changes needed (existing `:focus-visible` and `.sr-only` styles reused)
**Spawned Tasks**: 2 items added to BACKLOG.md (Escape key reset, screen reader testing)

---

### Project Metadata Badges (FEAT-001)

**Plan**: [docs/archive/plans/2026-01-29_feat-001-project-metadata-badges.md](../archive/plans/2026-01-29_feat-001-project-metadata-badges.md)
**Summary**: Added "last updated" dates and "In Development" status badges to all 7 project cards. Semantic HTML (`<footer>`, `<time>`), dedicated status color variables, CSS pulse animation on status dot, theme-aware transitions.
**Key Changes**:
- Added `--color-status-active` / `--color-status-active-bg` design tokens (3 theme contexts)
- Added `.project-card__footer`, `.project-card__status`, `.project-card__status-dot` CSS components
- Added `<footer>` metadata markup to all 7 project cards (3 active, 4 date-only)
- Updated CLAUDE.md with new patterns and "Adding New Projects" template
**Spawned Tasks**: 3 items added to BACKLOG.md (auto-update dates, additional statuses, date localization)

---

### Self-host Google Fonts (PERF-001)

**Plan**: [docs/archive/plans/2026-01-29_perf-001-self-host-fonts.md](../archive/plans/2026-01-29_perf-001-self-host-fonts.md)
**Summary**: Replaced Google Fonts CDN dependency with self-hosted Inter variable font files (woff2). Eliminates 3 external HTTP requests, improves FCP, and removes privacy concerns.
**Key Changes**:
- Downloaded Inter variable font (Latin + Latin Extended subsets) to `fonts/` directory
- Created `css/fonts.css` with @font-face declarations using unicode-range subsetting
- Removed Google Fonts `<link>` tags from `index.html` and `404.html`
- Added `@import "fonts.css"` as first import in `css/main.css`
**Spawned Tasks**: 2 items added to BACKLOG.md (font preload hint, update PROJECT.md dependencies)

---

### Add JSON-LD structured data (SEO-002)

**Plan**: N/A (implemented via feature-dev workflow)
**Summary**: Added JSON-LD structured data to `index.html` with `Person` and `WebSite` schema types in a single `@graph`. Improves search engine understanding with rich snippets (name, job title, social links, skills).
**Key Changes**:
- Added `<script type="application/ld+json">` in `<head>` with `@graph` containing Person + WebSite schemas
- Person schema: name, jobTitle, url, email, description, sameAs (GitHub, LinkedIn, Telegram, Wokwi), knowsAbout (10 key skills)
- WebSite schema: name, url, cross-referenced to Person via `author` using `@id`
- Placed after canonical URL, before theme initialization script
**Spawned Tasks**: 2 items added to BACKLOG.md (profile image for Person schema, additional schema types)

---

### Add robots.txt and sitemap.xml (SEO-001)

**Plan**: [docs/archive/plans/2026-01-29_seo-001-robots-sitemap.md](../archive/plans/2026-01-29_seo-001-robots-sitemap.md)
**Summary**: Created `robots.txt` and `sitemap.xml` at project root for proper search engine indexing. robots.txt allows main site crawling while blocking learning project directories; sitemap.xml lists homepage with git-derived lastmod date.
**Key Changes**:
- Created `robots.txt` with crawler rules (allow main site, block `/freecodecamp/`, `/frontendmentor/`, `/MDN/`, `/other/`, `/docs/`)
- Created `sitemap.xml` with homepage entry (lastmod: 2026-01-28, changefreq: monthly, priority: 1.0)
- Sitemap directive in robots.txt points to sitemap.xml
**Spawned Tasks**: 3 items added to BACKLOG.md (automate lastmod, expand sitemap, Google Search Console)

---

## 2026-01-28

### Create 404 Page (LP-003)

**Task Reference**: TODO.md LP-003
**Plan Document**: None (implemented via feature-dev workflow)

**Implementation**:
Custom 404 error page for GitHub Pages with animated GIF, matching site design, and theme support.

**Key Changes**:
- Created `404.html` with full header navigation and theme toggle
- Added `.error-page` CSS component styles in `components.css`
- Included user-provided animated GIF from Tenor (`404.gif`)
- Reuses `main.js` for DRY theme toggle and copyright year

**Files Changed**:
- `404.html` - New custom 404 error page
- `css/components.css` - Added `.error-page` component styles (lines 416-462)
- `404.gif` - User-provided animated GIF

**Acceptance Criteria Met**:
- [x] 404.html created matching site design
- [x] Navigation back to home page
- [x] Theme toggle functional (shares settings with main site)

**Technical Decisions**:
- **Reuse main.js**: Chosen over inline JS for DRY principle (theme toggle code shared)
- **Full header**: Includes navigation links prefixed with `/#` to navigate to home sections
- **Responsive typography**: `clamp(4rem, 15vw, 8rem)` for 404 title

**Lessons Learned**:
- Python `http.server` doesn't support custom 404 pages (use `npx serve` or test directly)
- GitHub Pages automatically serves `404.html` for missing URLs
- Navigation links from 404 to home sections need `/#` prefix (e.g., `/#projects`)

**Follow-up Tasks**: None

---

### Scroll Animations (LP-002)

**Task Reference**: TODO.md LP-002
**Plan Document**: None (implemented via worker2 branch)

**Implementation**:
Added progressive reveal animations using Intersection Observer with data-attribute based configuration.

**Key Changes**:
- Elements marked with `data-animate` attribute fade+slide up when entering viewport
- Stagger effect via `data-animate-delay="N"` attribute (milliseconds)
- CSS transitions (not keyframes) for smoother performance
- Combined transition declarations preserve theme transitions on cards/skills
- Double `requestAnimationFrame` ensures initial hidden state paints before observing

**Files Changed**:
- `index.html` - Added `data-animate` and `data-animate-delay` attributes to animated elements
- `css/components.css` - Animation styles with `[data-animate]` selectors
- `js/main.js` - `initScrollAnimations()` and `setupAnimationObserver()` functions
- `CLAUDE.md` - Scroll animation pattern documentation

**Acceptance Criteria Met**:
- [x] Intersection Observer implemented
- [x] Animations respect `prefers-reduced-motion`
- [x] Animations are subtle and professional

**Technical Decisions**:
- **Data attributes over classes**: More explicit in HTML, configurable delays per element
- **CSS transitions over keyframes**: Simpler, works better with existing theme transitions
- **Combined transition declarations**: Preserves theme color transitions on `.project-card` and `.skill-group`

**Lessons Learned**:
- Data-attribute approach (`data-animate`) makes animation configuration visible in HTML
- Double `requestAnimationFrame` needed to ensure browser paints hidden state before observing
- Elements with existing transitions need combined declarations to preserve all properties

**Follow-up Tasks**: None

---

### Project Filtering by Category (LP-001)

**Task Reference**: TODO.md LP-001
**Plan Document**: None (hybrid implementation from worker branches)

**Implementation**:
Added client-side project filtering with category buttons, smooth animations, and immediate layout reflow.

**Key Changes**:
- Created filter button UI with category-colored active states
- Implemented JavaScript filtering with toggle-to-reset behavior (clicking active filter resets to "All")
- Hidden cards use `position: absolute` for immediate layout reflow (visible cards fill gaps)
- Added `aria-pressed` attributes and `role="group"` for accessibility
- Smooth opacity + scale transition for visual feedback

**Files Changed**:
- `index.html` - Filter buttons UI with data-filter attributes
- `css/components.css` - Filter button styles, category colors, hidden card state
- `js/main.js` - `initProjectFilter()` function with helper methods
- `CLAUDE.md` - Project filtering pattern documentation

**Acceptance Criteria Met**:
- [x] Category filter UI implemented
- [x] Projects filter correctly
- [x] Smooth transition animation

**Technical Decisions**:
- **JavaScript over CSS-only**: Enables toggle-to-reset UX and `aria-pressed` updates
- **Immediate layout reflow**: Hidden cards use `position: absolute` (vs `display: none` delay)
- **Category-colored buttons**: Active state matches category badge color (backend=cyan, iot=green, web=purple, tools=orange)

**Lessons Learned**:
- `position: absolute; visibility: hidden` removes element from flow while allowing opacity transition
- Toggle-to-reset pattern (clicking active filter resets to "All") improves discoverability
- `aria-pressed` on toggle buttons improves screen reader experience

**Follow-up Tasks**: 3 improvements added to BACKLOG.md (URL hash filtering, count badges, keyboard navigation)

---

### Theme Toggle - Light/Dark Mode (MP-003)

**Task Reference**: TODO.md MP-003
**Plan Document**: [docs/planning/plans/2026-01-28_theme-toggle.md](plans/2026-01-28_theme-toggle.md)

**Implementation**:
Added light/dark theme toggle with system preference detection, localStorage persistence, and smooth transitions.

**Key Changes**:
- Created light theme color variables in `css/variables.css`
- Added `.theme-toggle` component with animated sun/moon icons
- Implemented theme switching JavaScript with error handling
- Added inline head script to prevent flash of wrong theme
- Progressive enhancement: CSS fallback for no-JS users

**Files Changed**:
- `css/variables.css` - Light theme color variables
- `css/components.css` - Theme toggle button styles
- `css/main.css` - Nav positioning and theme transitions
- `js/main.js` - Theme toggle logic
- `index.html` - Button HTML and inline script
- `CLAUDE.md` - Theme system documentation

**Acceptance Criteria Met**:
- [x] Theme toggle UI implemented
- [x] Preference saved to localStorage
- [x] Respects `prefers-color-scheme`

**Commits**:
- `11dcf26` - feat: Add theme toggle with light/dark mode support

**Lessons Learned**:
- Inline `<head>` script essential to prevent FOUC
- `data-theme` attribute pattern scales well for future themes
- localStorage must be wrapped in try-catch for private browsing

**Follow-up Tasks**:
- Consider dynamic `<meta name="theme-color">` update
- Consider three-way toggle (light/dark/auto)

---

### Add og:image for Social Sharing (MP-002)

**Task Reference**: TODO.md MP-002
**Plan Document**: None (straightforward task)

**Implementation**:
Added Open Graph and Twitter Card meta tags with custom social preview image.

**Key Changes**:
- Created 1200×630px OG image matching site design (SVG source + PNG)
- Added `og:image`, `og:image:width`, `og:image:height`, `og:image:alt` meta tags
- Added Twitter Card meta tags (`summary_large_image`)
- Extended og:title to 56 characters (optimal: 50-60)
- Extended og:description to 138 characters (optimal: 110-160)
- Added CTA button "View Projects →" to image

**Files Changed**:
- `index.html` - Added OG and Twitter Card meta tags
- `og-image.png` - Social preview image
- `og-image.svg` - Source file for future edits

**Acceptance Criteria Met**:
- [x] OG image designed and created
- [x] Meta tags added to index.html
- [x] Social sharing preview works correctly

**Commits**:
- `7d611f5` - Initial OG/Twitter meta tags + image
- `9cb9047` - Improved meta tags + CTA button

**Lessons Learned**:
- Open Graph is the universal standard (Facebook, LinkedIn, WhatsApp, Discord)
- Twitter has its own format but falls back to OG tags
- Optimal title: 50-60 chars, description: 110-160 chars
- SVG source files allow easy future edits

**Follow-up Tasks**: None

---

## 2026-01-27

### Add Project Screenshots (MP-001)

**Task Reference**: TODO.md MP-001
**Plan Document**: None (plan removed after completion)

**Implementation**:
Added thumbnail images to all 7 project cards using a masonry-style CSS columns layout.

**Key Changes**:
- Created `images/projects/` directory with 7 WebP screenshots
- Added `.project-card__thumbnail` CSS component with hover zoom effect
- Converted projects grid from CSS Grid to CSS Columns (masonry layout)
- All images use lazy loading for performance
- Removed Frontend Mentor card (insufficient content to showcase)

**Screenshots Added**:
- rating-bot.webp (phone mockup)
- rule-indicators.webp
- lubrication.webp
- hx711-scale.webp
- dropshipping.webp
- media-viewer.webp
- svg-processor.webp

**Technical Decisions**:
- **Layout**: CSS Columns masonry (not CSS Grid) for flexible card heights
- **Image sizing**: Natural height (`height: auto`) instead of fixed 16:9 aspect ratio
- **Phone mockups**: Used for mobile app screenshots (Telegram bot)

**Acceptance Criteria Met**:
- [x] Screenshots captured for each project
- [x] Images optimized for web (WebP format)
- [x] Project cards updated with thumbnails
- [x] Lazy loading implemented
- [x] Responsive layout maintained

**Lessons Learned**:
- CSS Columns work better than Grid for cards with variable heights
- Phone mockup generators (Shots.so) are effective for mobile app screenshots
- Natural image sizing preserves content visibility better than forced aspect ratios

**Follow-up Tasks**: None

---

## 2026-01-26

### Format dropshipping-test Repository (HP-004)

**Task Reference**: TODO.md HP-004
**Plan Document**: None (repository formatting task)

**Implementation**:
Formatted dropshipping-test repository with comprehensive documentation and added project card to portfolio as "E-commerce Prototype".

**Key Changes**:
- Repository formatted with README.md, PROJECT.md, docs/ structure
- Full Next.js 14+ codebase with TypeScript
- Complete documentation (architecture, API, database schema)
- Code quality tools configured (Prettier, ESLint, Husky)
- Project card added to portfolio (Backend category)

**Acceptance Criteria Met**:
- [x] Repository has content and documentation
- [x] Decide if ready to showcase on portfolio (Yes - added)

**Project Details**:
- **Category**: Backend
- **Tech Stack**: Next.js 14, TypeScript, Prisma, PostgreSQL, Stripe, Tailwind CSS
- **Features**: Product management, Stripe payments, admin panel, supplier integrations
- **Live Demo**: https://dropshipping-test.vercel.app
- **Repository**: https://github.com/GoodAlex223/dropshipping-test

**Follow-up Tasks**: None

---

### Format media-viewer Repository (HP-003)

**Task Reference**: TODO.md HP-003
**Plan Document**: None (repository formatting task)

**Implementation**:
Formatted media-viewer repository with documentation structure and made it public. Added project card to portfolio.

**Key Changes**:
- Repository formatted with README, CLAUDE.md, PROJECT.md, docs structure
- Repository made public on GitHub
- Project card added to portfolio (Tools category)

**Acceptance Criteria Met**:
- [x] Repository formatted and documented
- [x] Repository made public
- [x] Project card added to portfolio

**Project Details**:
- **Category**: Tools
- **Tech Stack**: Electron, JavaScript, ML (online logistic regression)
- **Features**: Media browsing/rating, ML preference learning, visual similarity sorting (perceptual hashing + VP-Tree)

**Follow-up Tasks**: None

---

### Run Lighthouse Audit (HP-002)

**Task Reference**: TODO.md HP-002
**Plan Document**: [docs/archive/plans/2026-01-26_lighthouse-audit.md](../archive/plans/2026-01-26_lighthouse-audit.md)

**Implementation**:
Ran Lighthouse audit via Chrome DevTools on https://goodalex223.github.io (Mobile simulation).

**Results**:
- Performance: 100/100
- Accessibility: 100/100
- Best Practices: 100/100
- SEO: 100/100

**Core Web Vitals**:
- First Contentful Paint: 1.6s
- Largest Contentful Paint: 1.6s
- Total Blocking Time: 0ms
- Cumulative Layout Shift: 0
- Speed Index: 1.6s

**Acceptance Criteria Met**:
- [x] Lighthouse Performance score > 90 (Actual: 100)
- [x] Lighthouse Accessibility score > 90 (Actual: 100)
- [x] Fix any critical issues found (None found)
- [x] Document results

**Lessons Learned**:
- Minimal JavaScript (7 lines) results in zero blocking time
- Proper HTML structure achieves perfect accessibility
- CSS @import chain does not significantly impact performance for small sites

**Follow-up Tasks**: 2 improvements added to BACKLOG.md (self-host fonts, bundle CSS)

---

### Test All External Links (HP-001)

**Task Reference**: TODO.md HP-001
**Plan Document**: None (verification task)

**Implementation**:
Tested all 16 external links in portfolio for accessibility and correctness.

**Results**:
- GitHub repository links: 7/7 working
- Wokwi simulation links: 4/4 working
- Vercel demo link: 1/1 working
- Other external links: 4/4 working (LinkedIn, Frontend Mentor, Telegram, GitHub Pages)

**Acceptance Criteria Met**:
- [x] All GitHub repository links accessible
- [x] All Wokwi simulation links load correctly
- [x] All Vercel demo links work
- [x] No broken 404 links

**Lessons Learned**:
- LinkedIn returns 999 status to automated requests (bot protection) but link format is valid
- All project simulation links correctly point to matching Wokwi projects

**Follow-up Tasks**: None

---

### Add Favicon

**Task Reference**: ROADMAP.md v1.1
**Plan Document**: None (straightforward task)

**Implementation**:
Created adaptive favicon with full browser support, auto-switching colors based on user's theme preference.

**Key Changes**:
- Created adaptive SVG favicon (dark bg for light theme, light bg for dark theme)
- Generated favicon.ico, favicon-96x96.png, apple-touch-icon.png
- Added site.webmanifest + PWA icons
- Updated index.html with proper favicon link tags

**Lessons Learned**:
- SVG favicons with `prefers-color-scheme` media queries provide adaptive theming

**Follow-up Tasks**: None

---

## 2026-01-20

### Portfolio Rebuild

**Task Reference**: Initial project setup
**Plan Document**: None (major rebuild)

**Implementation**:
Complete rebuild of portfolio website from monolithic HTML to modern, modular architecture.

**Key Changes**:
- Created modular CSS architecture (variables, reset, utilities, components, main)
- Built responsive project cards with category badges
- Added 7 projects across 4 categories (Backend, IoT, Web, Tools)
- Implemented dark theme with accent colors
- Added accessibility features (skip link, focus states, reduced motion)
- Updated position from "Junior" to "Software Developer"

**Files Changed**:
- `index.html` - Complete rewrite
- `css/` - New directory with 5 CSS files
- `js/main.js` - New file
- `README.md` - Updated for portfolio
- `PROJECT.md` - Created
- `docs/` - Created documentation structure

**Removed**:
- Old monolithic `style.css`
- `imgs/` directory (using inline SVG now)
- `TODO.md` and `TODO/` (old files)
- `README-template.md` (Frontend Mentor template)

**Lessons Learned**:
- Modular CSS architecture improves maintainability
- BEM-like naming provides clear component boundaries

**Follow-up Tasks**: Theme toggle, project filtering (added to BACKLOG.md)

---

### IoT Projects Enhancement

**Task Reference**: Portfolio Rebuild sub-task
**Plan Document**: None

**Implementation**:
Added rule_indicators project and Wokwi simulation links.

**Key Changes**:
- Added Industrial Rule Indicators as featured IoT project
- Added Wokwi simulation links to all IoT projects
- Updated HX711 project to NANO version with Wokwi link

**Lessons Learned**:
- Wokwi simulation links add credibility to hardware projects

**Follow-up Tasks**: None

---

### Documentation Setup

**Task Reference**: Portfolio Rebuild sub-task
**Plan Document**: None

**Implementation**:
Created full documentation structure per CLAUDE.md requirements.

**Files Created**:
- `docs/README.md` - Documentation index
- `docs/ARCHITECTURE.md` - Technical architecture
- `docs/PROJECT_CONTEXT.md` - Decisions and patterns
- `docs/MANUAL_TESTING.md` - Testing scenarios
- `docs/planning/TODO.md` - Active tasks
- `docs/planning/DONE.md` - Completed tasks
- `docs/planning/BACKLOG.md` - Future ideas
- `docs/planning/ROADMAP.md` - Long-term vision

**Lessons Learned**:
- Comprehensive documentation structure aids project maintenance

**Follow-up Tasks**: None
