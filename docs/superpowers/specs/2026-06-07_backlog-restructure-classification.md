# BACKLOG.md Pass 1 Classification Artifact

**Spec:** [2026-06-07_backlog-restructure-design.md](./2026-06-07_backlog-restructure-design.md)
**Status:** Awaiting user audit before BACKLOG.md rewrite (Task 4)
**Generated:** 2026-06-07
**Source file:** `docs/planning/BACKLOG.md` at branch `chore/backlog-restructure` HEAD

## Purpose

One row per OPEN item in BACKLOG.md, classified into the 3 source sections defined in
the spec. **The user must audit this artifact before the Task 4 rewrite begins.** Push
back on misclassifications, request splits, flag dups, object to prunes.

## Classification rules (tie-breakers)

- 🔵 User-Flagged — user raised it: feature ideas, content tasks (screenshots, showcase
  repos, README fixes), UX changes, user-reported bugs.
- 🟡 Operational — time-sensitive ops/watch: post-deploy & CI checks, Lighthouse/size
  monitoring, Bing-index verification, Formspree spam watch, dependency/Actions deadlines.
- 🟤 Auto-Generated — Claude/automation surfaced: `(code review finding, confidence NN)`
  items, PR post-merge review, CLAUDE.md staleness, doc-hygiene, test robustness/backfill.
- 🔵-vs-🟡 tie: tooling the user explicitly wants → 🔵; pure monitoring/observation → 🟡.
- 🔵-vs-🟤 tie: visible content/feature impact → 🔵; internal code/test/doc hygiene → 🟤.

## Verification counts (pre-migration)

- Open items: 234
- Completed/struck items (to prune): 117
- Origin lines: 87
- Promotions (plain `-` → `- [ ]`): 3

## Classification table

| # | Current section (line) | Open item title | Proposed source | Proposed `### From …` sub-header | Keep `**Origin**`? | Notes |
|---|---|---|---|---|---|---|
| 1 | Project Detail Modal (29) | Data structure decision (JSON file vs data attributes vs JS object) | 🟤 | From Project Detail Modal (2026-01-22) | n/a | Modal shipped (CHALLENGE-002); these `Requires:` sub-items are now internal design follow-ups. ? possibly already satisfied by shipped JSON data file — flag for prune |
| 2 | Project Detail Modal (29) | Accessibility: focus trap, ESC to close, aria-modal, restore focus | 🟤 | From Project Detail Modal (2026-01-22) | n/a | Modal shipped; likely already done. ? candidate prune |
| 3 | Project Detail Modal (29) | Lazy-load media to maintain <200KB initial page load | 🟡 | From Project Detail Modal (2026-01-22) | n/a | Perf budget watch; modal shipped. ? candidate prune |
| 4 | Project Detail Modal (29) | Mobile-friendly modal UX | 🔵 | From Project Detail Modal (2026-01-22) | n/a | UX; modal shipped. ? candidate prune |
| 5 | Project Detail Modal (29) | Clear visual hint that cards are clickable (hover state, "View details") | 🔵 | From Project Detail Modal (2026-01-22) | n/a | UX; "View Details" buttons shipped. ? candidate prune |
| 6 | Project Content Population (40) | Extended description (challenges, decisions, lessons learned) | 🔵 | From Project Content Population (2026-01-27) | n/a | Content work |
| 7 | Project Content Population (40) | Screenshots demonstrating key features | 🔵 | From Project Content Population (2026-01-27) | n/a | Content; overlaps CONTENT-001/004 screenshot items [possible-dup-of: rows 159, 167] |
| 8 | Project Content Population (40) | Demo videos/GIFs where applicable | 🔵 | From Project Content Population (2026-01-27) | n/a | Content |
| 9 | Project Content Population (40) | Technical highlights and architecture notes | 🔵 | From Project Content Population (2026-01-27) | n/a | Content |
| 10 | Filter Enhancements (96) | URL hash-based filtering — shareable links like `#filter=backend` | 🔵 | From LP-001: Project Filtering (2026-01-28) | n/a | Feature; ? may already be shipped (filter hash integration exists) — verify |
| 11 | Enhancements › Visual (107) | Add Open Graph image for social sharing | 🔵 | From Enhancements: Visual | n/a | Feature/content; ? OG image may already exist (og-image.png) — verify |
| 12 | Enhancements › Visual (107) | Consider adding a profile photo | 🔵 | From Enhancements: Visual | n/a | Content |
| 13 | Enhancements › Visual (107) | Add subtle gradient backgrounds | 🔵 | From Enhancements: Visual | n/a | Visual feature |
| 14 | Enhancements › Performance (115) | Consider using `font-display: swap` | 🔵 | From Enhancements: Performance | n/a | Perf tooling the user wants |
| 15 | Enhancements › Performance (115) | Add service worker for offline support | 🔵 | From Enhancements: Performance | n/a | Feature |
| 16 | From SEO-002: JSON-LD (132) | Add profile image for Person schema `image` property | 🔵 | From SEO-002: JSON-LD structured data (2026-01-29) | n/a | Content (requires profile photo asset) |
| 17 | From SEO-002: JSON-LD (132) | Add additional schema types (ItemList / BreadcrumbList) | 🔵 | From SEO-002: JSON-LD structured data (2026-01-29) | n/a | Feature/SEO enhancement |
| 18 | From FEAT-001: Metadata Badges (137) | Auto-update dates from git history | 🔵 | From FEAT-001: Project Metadata Badges (2026-01-29) | yes | Tooling user explicitly wants (per spec Open Question default) |
| 19 | From FEAT-001: Metadata Badges (137) | Additional status types (Completed/Archived/Beta) | 🔵 | From FEAT-001: Project Metadata Badges (2026-01-29) | yes | Feature |
| 20 | From FEAT-001: Metadata Badges (137) | Date format localization | 🔵 | From FEAT-001: Project Metadata Badges (2026-01-29) | yes | Feature/i18n-adjacent |
| 21 | From FEAT-005: Escape Key Reset (150) | Keyboard shortcut documentation (hint/tooltip for Escape) | 🔵 | From FEAT-005: Escape Key Reset Filter (2026-02-03) | yes | UX discoverability |
| 22 | From PERF-002: Font Preload (162) | Inline critical CSS | 🟤 | From PERF-002: Font Preload Hint (2026-02-02) | yes | ? likely shipped (PERF-006 Inline Critical CSS done) — candidate prune; internal perf hygiene |
| 23 | From SEO-001: robots/sitemap (174) | Expand sitemap for future pages | 🔵 | From SEO-001: robots.txt & sitemap.xml (2026-01-29) | yes | Tied to blog/detail pages feature |
| 24 | From DOCS-001: Update PROJECT.md (194) | PROJECT.md freshness validation (pre-commit/CI warns on stale date) | 🟤 | From DOCS-001: Update PROJECT.md (2026-02-05) | yes | Doc-hygiene tooling |
| 25 | From DOCS-001: Update PROJECT.md (194) | Automated external link inventory script | 🟤 | From DOCS-001: Update PROJECT.md (2026-02-05) | yes | Doc-hygiene tooling [possible-dup-of: row 198 check-links] |
| 26 | From A11Y-002: Focus Indicators (202) | Focus-within for project cards | 🔵 | From A11Y-002: Improve Focus Indicators (2026-02-05) | yes | A11y UX feature |
| 27 | Multi-Language Support (212) | Browser language detection (`navigator.language`) | 🔵 | From Internationalization: Multi-Language Support (2026-01-23) | n/a | i18n feature |
| 28 | Multi-Language Support (212) | Geolocation-based detection (IP API or browser geo) | 🔵 | From Internationalization: Multi-Language Support (2026-01-23) | n/a | i18n feature |
| 29 | Multi-Language Support (212) | Accept-Language header (if SSR added later) | 🔵 | From Internationalization: Multi-Language Support (2026-01-23) | n/a | i18n feature |
| 30 | Multi-Language Support (212) | Fallback chain: user pref → browser → geo → default (EN) | 🔵 | From Internationalization: Multi-Language Support (2026-01-23) | n/a | i18n feature |
| 31 | Multi-Language Support (212) | Store user choice in localStorage | 🔵 | From Internationalization: Multi-Language Support (2026-01-23) | n/a | i18n feature |
| 32 | Multi-Language Support (212) | Respect explicit user override vs auto-detection | 🔵 | From Internationalization: Multi-Language Support (2026-01-23) | n/a | i18n feature |
| 33 | Multi-Language Support (212) | JSON translation files approach | 🔵 | From Internationalization: Multi-Language Support (2026-01-23) | n/a | i18n design decision |
| 34 | Multi-Language Support (212) | HTML data attributes approach | 🔵 | From Internationalization: Multi-Language Support (2026-01-23) | n/a | i18n design decision |
| 35 | Multi-Language Support (212) | Multiple HTML pages per language approach | 🔵 | From Internationalization: Multi-Language Support (2026-01-23) | n/a | i18n design decision |
| 36 | Multi-Language Support (212) | Which languages to support initially? | 🔵 | From Internationalization: Multi-Language Support (2026-01-23) | n/a | i18n design decision |
| 37 | Multi-Language Support (212) | RTL support for future languages? | 🔵 | From Internationalization: Multi-Language Support (2026-01-23) | n/a | i18n design decision |
| 38 | Multi-Language Support (212) | URL structure (`/en/`, `?lang=en`, or toggle)? | 🔵 | From Internationalization: Multi-Language Support (2026-01-23) | n/a | i18n design decision |
| 39 | Multi-Language Support (212) | SEO: hreflang tags, separate sitemaps per language? | 🔵 | From Internationalization: Multi-Language Support (2026-01-23) | n/a | i18n design decision |
| 40 | Project Card Media Enhancements (236) | Add multiple project images to cards (carousel/gallery) | 🔵 | From Media & Visual Content: Project Card Media Enhancements (2026-01-27) | n/a | Media feature |
| 41 | Project Card Media Enhancements (236) | Add ability to embed project work videos in cards | 🔵 | From Media & Visual Content: Project Card Media Enhancements (2026-01-27) | n/a | Media feature |
| 42 | Project Media Strategy (240) | Static screenshots (before/after, key features) | 🔵 | From Media & Visual Content: Project Media Strategy (2026-01-23) | n/a | Media content |
| 43 | Project Media Strategy (240) | GIF animations (short interaction demos) | 🔵 | From Media & Visual Content: Project Media Strategy (2026-01-23) | n/a | Media content |
| 44 | Project Media Strategy (240) | Video walkthroughs (embedded or self-hosted) | 🔵 | From Media & Visual Content: Project Media Strategy (2026-01-23) | n/a | Media content |
| 45 | Project Media Strategy (240) | Live embedded demos (iframes) | 🔵 | From Media & Visual Content: Project Media Strategy (2026-01-23) | n/a | Media feature |
| 46 | Project Media Strategy (240) | Lazy loading to maintain <200KB initial page load | 🟡 | From Media & Visual Content: Project Media Strategy (2026-01-23) | n/a | Perf budget watch [possible-dup-of: row 3] |
| 47 | Project Media Strategy (240) | Responsive images (srcset) for different screen sizes | 🔵 | From Media & Visual Content: Project Media Strategy (2026-01-23) | n/a | Media feature |
| 48 | Project Media Strategy (240) | Video poster images for instant visual | 🔵 | From Media & Visual Content: Project Media Strategy (2026-01-23) | n/a | Media feature |
| 49 | Project Media Strategy (240) | Consider CDN for media hosting (Cloudinary, imgix) | 🔵 | From Media & Visual Content: Project Media Strategy (2026-01-23) | n/a | Media infra decision |
| 50 | Project Media Strategy (240) | Optimize images (WebP format, compression) | 🔵 | From Media & Visual Content: Project Media Strategy (2026-01-23) | n/a | Media content/tooling |
| 51 | Project Media Strategy (240) | Audit each project for best visual representation | 🔵 | From Media & Visual Content: Project Media Strategy (2026-01-23) | n/a | Content audit |
| 52 | Project Media Strategy (240) | Prioritize projects with visual/interactive output | 🔵 | From Media & Visual Content: Project Media Strategy (2026-01-23) | n/a | Content planning |
| 53 | Project Media Strategy (240) | IoT projects: circuit diagrams, Wokwi screenshots, demo videos | 🔵 | From Media & Visual Content: Project Media Strategy (2026-01-23) | n/a | Content |
| 54 | Project Media Strategy (240) | Web projects: responsive screenshots, interaction demos | 🔵 | From Media & Visual Content: Project Media Strategy (2026-01-23) | n/a | Content |
| 55 | From BUG-001: Theme Button Overlap (267) | CSS Grid 3-column nav centering | 🔵 | From BUG-001: Theme Button Overlap Fix (2026-02-02) | yes | UX/layout deferred feature |
| 56 | From BUG-001: Theme Button Overlap (267) | Hamburger menu at very narrow widths | 🔵 | From BUG-001: Theme Button Overlap Fix (2026-02-02) | yes | UX/responsive feature |
| 57 | From FEAT-006: Filter Count Badges (298) | Animated count transitions (All "(3/7)") | 🔵 | From FEAT-006: Filter Count Badges (2026-02-04) | yes | UX feature |
| 58 | From FEAT-006: Filter Count Badges (298) | Zero-count button dimming | 🔵 | From FEAT-006: Filter Count Badges (2026-02-04) | yes | UX feature |
| 59 | From A11Y-001: Screen Reader (306) | Automated screen reader testing in CI | 🟤 | From A11Y-001: Screen Reader Testing (2026-02-04) | yes | Test backfill |
| 60 | From A11Y-001: Screen Reader (306) | Screen reader announcement logging (dev mode) | 🟤 | From A11Y-001: Screen Reader Testing (2026-02-04) | yes | Dev-tooling/test aid |
| 61 | From A11Y-001: Screen Reader (306) | Debounce live region announcements on rapid filter clicks (confidence 75/100) | 🟤 | From A11Y-001: Screen Reader Testing (2026-02-04) | yes | Code review finding [possible-dup-of: row 145] |
| 62 | From PERF-004: cssnano (315) | Source maps for production builds (`--map` flag) | 🟤 | From PERF-004: CSS Minification with cssnano (2026-02-09) | yes | Build tooling/dev aid |
| 63 | From SEO-004: Meta Descriptions (323) | Track description character counts in CLAUDE.md | 🟤 | From SEO-004: Improve Meta Descriptions (2026-02-04) | yes | Doc-hygiene |
| 64 | From SEO-005: Bing Webmaster (331) | Monitor Bing indexing (dashboard check after 48h) | 🟡 | From SEO-005: Bing Webmaster Tools Verification (2026-02-10) | yes | Monitoring/observation |
| 65 | From SEO-005: Bing Webmaster (331) | IndexNow protocol (instant Bing notification) | 🔵 | From SEO-005: Bing Webmaster Tools Verification (2026-02-10) | yes | Feature/tooling user wants |
| 66 | From QUALITY-003: CSS Specificity (339) | Stylelint rule for section ordering | 🟤 | From QUALITY-003: CSS Specificity Documentation (2026-02-11) | yes | Lint-tooling hygiene |
| 67 | From QUALITY-003: CSS Specificity (339) | CSS layers for explicit priority (`@layer scroll, filter`) | 🟤 | From QUALITY-003: CSS Specificity Documentation (2026-02-11) | yes | Internal CSS hygiene |
| 68 | From QUALITY-003: CSS Specificity (339) | Reformat compound selector in specificity table (confidence 50/100) | 🟤 | From QUALITY-003: CSS Specificity Documentation (2026-02-11) | yes | Code review finding |
| 69 | From QUALITY-002: activateFilter() (348) | Unify resetFilter into activateFilter | 🟤 | From QUALITY-002: Centralize activateFilter() (2026-02-10) | yes | Refactor [possible-dup-of: row 147] |
| 70 | From QUALITY-002: activateFilter() (348) | Simplify `applyHashFilter()` JSDoc (confidence 62/100) | 🟤 | From QUALITY-002: Centralize activateFilter() (2026-02-10) | yes | Code review finding |
| 71 | From QUALITY-001: resetFilter() (357) | Conditional focus in `resetFilter()` (`shouldFocus` param) (confidence 25/100) | 🟤 | From QUALITY-001: Centralize resetFilter() (2026-02-10) | yes | Code review finding |
| 72 | From TEST-001: Playwright E2E (364) | Visual regression snapshots for filter animation states | 🟤 | From TEST-001: Playwright E2E Tests (2026-02-09) | yes | Test backfill |
| 73 | From CI-001: CI Workflow Jobs (374) | Fix CLAUDE.md CI test command reference (confidence 75/100) | 🟤 | From CI-001: Separate CI Workflow Jobs (2026-02-24) | yes | Doc-hygiene/code review finding |
| 74 | From CI-001: CI Workflow Jobs (374) | Update `playwright.config.js` CI comment (confidence 25/100) | 🟤 | From CI-001: Separate CI Workflow Jobs (2026-02-24) | yes | Doc-hygiene/code review finding |
| 75 | From TEST-004: Axe Scanning (391) | Read `--transition-base` from CSS in `setTheme()` | 🟤 | From TEST-004: Theme-specific Axe Scanning (2026-02-17) | yes | Test hygiene |
| 76 | From TEST-004: Axe Scanning (391) | Extend theme testing to animation suite | 🟤 | From TEST-004: Theme-specific Axe Scanning (2026-02-17) | yes | Test backfill |
| 77 | From TEST-004: Axe Scanning (391) | Add `prefers-color-scheme` path testing | 🟤 | From TEST-004: Theme-specific Axe Scanning (2026-02-17) | yes | Test backfill |
| 78 | From TEST-004: Axe Scanning (391) | `setTheme()` should persist to localStorage (confidence 75/100) | 🟤 | From TEST-004: Theme-specific Axe Scanning (2026-02-17) | yes | Code review finding (test helper) |
| 79 | From TEST-004: Axe Scanning (391) | Increase dark theme `--color-text-muted` contrast margin (confidence 35/100) | 🟤 | From TEST-004: Theme-specific Axe Scanning (2026-02-17) | yes | Code review finding. ? a11y/visible impact could argue 🔵 |
| 80 | From PERF-007: JS Cache-Busting (410) | Source maps for minified JS | 🟤 | From PERF-007: JS Cache-Busting (2026-02-22) | yes | Build tooling/dev aid |
| 81 | From PERF-007: JS Cache-Busting (410) | Watch mode JS file sync (copy to dist/main.js) | 🟤 | From PERF-007: JS Cache-Busting (2026-02-22) | yes | Build/dev tooling |
| 82 | From PERF-007: JS Cache-Busting (410) | Restore post-write validation (confidence 75/100) | 🟤 | From PERF-007: JS Cache-Busting (2026-02-22) | yes | Code review finding |
| 83 | From PERF-007: JS Cache-Busting (410) | Atomic CSS rename (use `renameSync`) (confidence 75/100) | 🟤 | From PERF-007: JS Cache-Busting (2026-02-22) | yes | Code review finding |
| 84 | From PERF-007: JS Cache-Busting (410) | Update CLAUDE.md Overview Build Tools (terser) (confidence 75/100) | 🟤 | From PERF-007: JS Cache-Busting (2026-02-22) | yes | Doc-hygiene |
| 85 | From PERF-007: JS Cache-Busting (410) | Update `npm run build` inline comment (confidence 75/100) | 🟤 | From PERF-007: JS Cache-Busting (2026-02-22) | yes | Doc-hygiene |
| 86 | From POLISH-001: Focus Transition (423) | CSS custom property for focus transition timing | 🟤 | From POLISH-001: Focus Indicator Transition (2026-02-12) | yes | Internal CSS hygiene |
| 87 | Technical Debt (437) | Add automated link checking | 🔵 | From Technical Debt | n/a | ? Almost certainly DONE (check-links shipped 2026-04-05); candidate prune — verify |
| 88 | Technical Debt (437) | Create development build script | 🔵 | From Technical Debt | n/a | Tooling user wants (watch mode exists; ? may be satisfied — verify) |
| 89 | From SEO-006: Social Card Preview (462) | Facebook Sharing Debugger validation | 🟡 | From SEO-006: Social Card Preview Testing (2026-02-13) | yes | Manual validation/observation |
| 90 | From TEST-006: OG Meta Validation (470) | 404.html negative test (omits OG/Twitter/JSON-LD) | 🟤 | From TEST-006: Automated OG Meta Tag Validation (2026-03-12) | yes | Test backfill |
| 91 | From TEST-006: OG Meta Validation (470) | OG image HTTP validation (200 + Content-Type) | 🟤 | From TEST-006: Automated OG Meta Tag Validation (2026-03-12) | yes | Test backfill |
| 92 | From TEST-006: OG Meta Validation (470) | Add symmetric null guards in cross-tag tests (confidence 65/100) | 🟤 | From TEST-006: Automated OG Meta Tag Validation (2026-03-12) | yes | Code review finding |
| 93 | From TEST-006: OG Meta Validation (470) | Add JSON-LD script tag existence guard in `getGraph()` (confidence 62/100) | 🟤 | From TEST-006: Automated OG Meta Tag Validation (2026-03-12) | yes | Code review finding |
| 94 | From TEST-006: OG Meta Validation (470) | Add `toBeDefined()` guards to Person/WebSite sub-tests (confidence 45/100) | 🟤 | From TEST-006: Automated OG Meta Tag Validation (2026-03-12) | yes | Code review finding |
| 95 | From TEST-006: OG Meta Validation (470) | Add `.first()` to JSON-LD locator in `getGraph()` (confidence 35/100) | 🟤 | From TEST-006: Automated OG Meta Tag Validation (2026-03-12) | yes | Code review finding |
| 96 | From TEST-003: Stylelint (482) | Add `stylelint-order` plugin | 🟤 | From TEST-003: CSS Linting with Stylelint (2026-02-16) | yes | Lint-tooling hygiene |
| 97 | From TEST-003: Stylelint (482) | VS Code Stylelint extension docs | 🟤 | From TEST-003: CSS Linting with Stylelint (2026-02-16) | yes | Doc-hygiene/dev aid |
| 98 | From PERF-006: Inline Critical CSS (491) | Reduce inline CSS size (index.html >14 KB) | 🟤 | From PERF-006: Inline Critical CSS (2026-02-16) | yes | Internal perf hygiene. ? size budget could argue 🟡 |
| 99 | From PERF-006: Inline Critical CSS (491) | Upstream CSS custom property extraction | 🟤 | From PERF-006: Inline Critical CSS (2026-02-16) | yes | Internal tooling hygiene |
| 100 | From PERF-006: Inline Critical CSS (491) | Automated inline CSS size regression check | 🟤 | From PERF-006: Inline Critical CSS (2026-02-16) | yes | Test/build backfill [possible-dup-of: row 161] |
| 101 | From PERF-006: Inline Critical CSS (491) | Add `.catch()` to top-level async call (confidence 25/100) | 🟤 | From PERF-006: Inline Critical CSS (2026-02-16) | yes | Code review finding |
| 102 | From PERF-006: Inline Critical CSS (491) | Robust CSS block matching regex (confidence 25/100) | 🟤 | From PERF-006: Inline Critical CSS (2026-02-16) | yes | Code review finding |
| 103 | From PERF-006: Inline Critical CSS (491) | Handle multiple `<style>` tags (confidence 25/100) | 🟤 | From PERF-006: Inline Critical CSS (2026-02-16) | yes | Code review finding |
| 104 | From QUALITY-004: Husky (503) | Extend lint-staged with Prettier (`*.html`) | 🟤 | From QUALITY-004: Pre-commit Hook with Husky (2026-02-17) | yes | Tooling hygiene |
| 105 | From QUALITY-004: Husky (503) | commitlint for conventional commits | 🟤 | From QUALITY-004: Pre-commit Hook with Husky (2026-02-17) | yes | ? Likely DONE (commitlint shipped QUALITY-010) — candidate prune |
| 106 | From TEST-005: Reduced Motion (512) | Hover state test for non-reduced-motion mode | 🟤 | From TEST-005: Reduced Motion Accessibility Test (2026-02-24) | yes | Test backfill |
| 107 | From TEST-005: Reduced Motion (512) | Reduced motion + filter animation interruption test | 🟤 | From TEST-005: Reduced Motion Accessibility Test (2026-02-24) | yes | Test backfill |
| 108 | From TEST-005: Reduced Motion (512) | Scroll animation visibility under reduced motion test | 🟤 | From TEST-005: Reduced Motion Accessibility Test (2026-02-24) | yes | Test backfill |
| 109 | From TEST-005: Reduced Motion (512) | Fix specificity comment in `.filter-btn--active` (confidence 75/100) | 🟤 | From TEST-005: Reduced Motion Accessibility Test (2026-02-24) | yes | Code review finding |
| 110 | From SEO-007: Sitemap lastmod (522) | Targeted `fetch-depth` for build job (confidence 50/100) | 🟤 | From SEO-007: Automate Sitemap lastmod Updates (2026-03-05) | yes | Code review finding (CI) |
| 111 | From SEO-007: Sitemap lastmod (522) | Named npm script for `update-sitemap` | 🟤 | From SEO-007: Automate Sitemap lastmod Updates (2026-03-05) | yes | Tooling/consistency hygiene |
| 112 | From SEO-007: Sitemap lastmod (522) | CLAUDE.md build job artifact list inconsistency | 🟤 | From SEO-007: Automate Sitemap lastmod Updates (2026-03-05) | yes | Doc-hygiene |
| 113 | From QUALITY-008: Stylelint transition:all (539) | Redundant `.contact__link` transition (code review finding) | 🟤 | From QUALITY-008: Stylelint Rule to Prevent transition:all (2026-03-12) | yes | Code review finding |
| 114 | From QUALITY-008: Stylelint transition:all (539) | Case-insensitive transition regex (`/i` flag) | 🟤 | From QUALITY-008: Stylelint Rule to Prevent transition:all (2026-03-12) | yes | Lint-tooling hardening |
| 115 | From PERF-008: Build Size Reporting (547) | Size trend history (append to size-history.json) | 🟡 | From PERF-008: Build Size Reporting (2026-02-25) | yes | Monitoring. ? Likely DONE (size-history.json exists, PERF-009) — candidate prune |
| 116 | From PERF-008: Build Size Reporting (547) | HTML size reporting (index.html/404.html) | 🟡 | From PERF-008: Build Size Reporting (2026-02-25) | yes | Size monitoring |
| 117 | From PERF-008: Build Size Reporting (547) | CI budget enforcement (fail on gzip over budget) | 🟡 | From PERF-008: Build Size Reporting (2026-02-25) | yes | CI gate/monitoring |
| 118 | From PERF-008: Build Size Reporting (547) | Extract shared `HASH_LENGTH` constant (confidence 72/100) | 🟤 | From PERF-008: Build Size Reporting (2026-02-25) | yes | Code review finding |
| 119 | From CHALLENGE-001: Lighthouse CI (557) | Mobile Lighthouse preset option (`lighthouse:mobile`) | 🟡 | From CHALLENGE-001: Lighthouse CI in GitHub Actions (2026-03-11) | yes | Monitoring tooling |
| 120 | From CHALLENGE-001: Lighthouse CI (557) | Lighthouse score trend tracking (lighthouse-history.json) | 🟡 | From CHALLENGE-001: Lighthouse CI in GitHub Actions (2026-03-11) | yes | Monitoring |
| 121 | From CHALLENGE-001: Lighthouse CI (557) | Explicit Chrome install in lighthouse CI job (confidence 50/100) | 🟤 | From CHALLENGE-001: Lighthouse CI in GitHub Actions (2026-03-11) | yes | Code review finding (CI) |
| 122 | From CHALLENGE-001: Lighthouse CI (557) | Fix `.gitignore` missing trailing newline (confidence 0/100) | 🟤 | From CHALLENGE-001: Lighthouse CI in GitHub Actions (2026-03-11) | yes | Code review finding (confidence 0 — ? candidate prune) |
| 123 | From CI-002: Pages Deploy Artifact (567) | Skip checkout in deploy job (add static assets to artifact) | 🟤 | From CI-002: Narrow Pages Deploy Artifact Path (2026-03-11) | yes | CI optimization/hygiene |
| 124 | From CI-002: Pages Deploy Artifact (567) | Validate staged `_site/` contents | 🟤 | From CI-002: Narrow Pages Deploy Artifact Path (2026-03-11) | yes | CI hardening [possible-dup-of: row 226] |
| 125 | From CI-002: Pages Deploy Artifact (567) | Update CLAUDE.md deploy step to include `404.webp` | 🟤 | From CI-002: Narrow Pages Deploy Artifact Path (2026-03-11) | yes | Doc-hygiene |
| 126 | From QUALITY-007: ESLint (576) | Add `eslint-plugin-playwright` | 🟤 | From QUALITY-007: ESLint Integration (2026-03-12) | yes | Lint-tooling. ? Likely DONE (QUALITY-009 added it) — candidate prune |
| 127 | From QUALITY-007: ESLint (576) | Add `no-console` rule for browser code | 🟤 | From QUALITY-007: ESLint Integration (2026-03-12) | yes | Lint-tooling. ? Likely DONE (`no-console: error` in eslint config) — candidate prune |
| 128 | From QUALITY-007 Code Review (585) | Remove stale plan copy at `docs/planning/plans/2026-03-12_quality-007-eslint.md` | 🟤 | From QUALITY-007 Code Review (2026-03-12) | yes | Doc/archive hygiene |
| 129 | From QUALITY-007 Code Review (585) | Fix `9b.` numbering in CLAUDE.md Build System Pattern list | 🟤 | From QUALITY-007 Code Review (2026-03-12) | yes | Doc-hygiene. ? section may no longer exist — verify |
| 130 | From QUALITY-007 Code Review (585) | Update deploy job description in CLAUDE.md | 🟤 | From QUALITY-007 Code Review (2026-03-12) | yes | Doc-hygiene |
| 131 | Build Size Trend Enhancements (601) | Size trend visualization (CLI sparkline/% change) | 🟡 | From Build Size Trend Enhancements (2026-03-18) | yes | Monitoring tooling |
| 132 | Build Size Trend Enhancements (601) | Budget trend alerts (warn on N consecutive increases) | 🟡 | From Build Size Trend Enhancements (2026-03-18) | yes | Monitoring |
| 133 | Build Size Trend Enhancements (601) | CI size comparison (annotate PRs with delta) | 🟡 | From Build Size Trend Enhancements (2026-03-18) | yes | CI/monitoring |
| 134 | From CHALLENGE-002: Detail Modal (610) | Modal keyboard shortcut hint ("press ESC to close") | 🔵 | From CHALLENGE-002: Project Detail Modal (2026-03-19) | yes | UX feature |
| 135 | From CHALLENGE-002: Detail Modal (610) | Screenshot lazy-load placeholder (skeleton) | 🔵 | From CHALLENGE-002: Project Detail Modal (2026-03-19) | yes | UX feature [related: CONTENT-005 placeholder-WebP] |
| 136 | From CHALLENGE-002: Detail Modal (610) | Filter + modal hash coexistence | 🔵 | From CHALLENGE-002: Project Detail Modal (2026-03-19) | yes | Feature/UX |
| 137 | From TEST-007: Axe Modal (621) | Normalize axe-helper API (`include`/`exclude` types) | 🟤 | From TEST-007: Axe-core WCAG Scan for Modal (2026-03-19) | yes | Test hygiene |
| 138 | From CONTENT-001: Project Cards (630) | Capture detail screenshots for 4 new projects | 🔵 | From CONTENT-001: Populate Remaining Project Cards (2026-03-20) | yes | Content [possible-dup-of: row 167] |
| 139 | From CONTENT-001: Project Cards (630) | Verify dropshipping project description accuracy | 🔵 | From CONTENT-001: Populate Remaining Project Cards (2026-03-20) | yes | Content accuracy |
| 140 | From CONTENT-001: Project Cards (630) | Reconcile dropshipping card tech vs modal tech (confidence 50/100) | 🔵 | From CONTENT-001: Populate Remaining Project Cards (2026-03-20) | yes | Code review finding but content-visible → 🔵 per 🔵-vs-🟤 tie-breaker |
| 141 | From QUALITY-009: ESLint Enhancements (640) | `eslint-plugin-playwright` glob/member-expression limitation | 🟤 | From QUALITY-009: ESLint Enhancements (2026-03-20) | yes | Tooling note/doc |
| 142 | From QUALITY-009: ESLint Enhancements (640) | Pre-scan codebase for violations before estimating scope | 🟤 | From QUALITY-009: ESLint Enhancements (2026-03-20) | yes | Process/tooling note |
| 143 | From QUALITY-010: commitlint (656) | ESLint ignores for root CJS configs could use a glob | 🟤 | From QUALITY-010: commitlint for Conventional Commits (2026-03-21) | yes | Lint-tooling hygiene [possible-dup-of: rows 154, 209] |
| 144 | From QUALITY-010: commitlint (656) | Investigate memory-updater hook friction on rapid commits | 🟤 | From QUALITY-010: commitlint for Conventional Commits (2026-03-21) | yes | Tooling/process |
| 145 | From CHALLENGE-003: Contact Form (672) | Add reCAPTCHA v3 fallback if honeypot insufficient (monitor Formspree spam) | 🟡 | From CHALLENGE-003: Contact Form (2026-03-21) | yes | Spam watch/ops decision |
| 146 | From CHALLENGE-003: Contact Form (672) | Add character count indicator on message textarea | 🔵 | From CHALLENGE-003: Contact Form (2026-03-21) | yes | UX feature |
| 147 | From CHALLENGE-003: Contact Form (672) | Add form analytics (success rate, error frequency) | 🟡 | From CHALLENGE-003: Contact Form (2026-03-21) | yes | Observation/monitoring. ? could be 🔵 feature — flag |
| 148 | From CHALLENGE-003: Contact Form (672) | Pre-existing axe-scan flakiness in scroll animation timing | 🟤 | From CHALLENGE-003: Contact Form (2026-03-21) | yes | Test flake. ? Likely DONE (PR #71 deterministic polling) — candidate prune |
| 149 | From Contact Form A11Y Hardening (693) | Extend focus-visible pattern to other custom components | 🟤 | From Contact Form A11Y Hardening (2026-03-28) | yes | A11y/CSS hygiene audit |
| 150 | From BUG-004: Filter Race (710) | Debounce live region announcements on rapid filter clicks | 🟤 | From BUG-004: Filter Race Condition Fix (2026-03-22) | yes | A11y/code [possible-dup-of: row 61] |
| 151 | From BUG-004: Filter Race (710) | Unify `resetFilter()` into `activateFilter("all")` | 🟤 | From BUG-004: Filter Race Condition Fix (2026-03-22) | yes | Refactor [possible-dup-of: rows 69, 147] |
| 152 | From CONTENT-002: Portfolio Requirements (718) | Portfolio requirements linter (validate data-updated vs git) | 🔵 | From CONTENT-002: Portfolio Requirements (2026-03-22) | yes | Tooling user wants (spec Open Question default → 🔵) [possible-dup-of: row 164] |
| 153 | From CONTENT-003 Code Review (748) | Archive completed design spec content-003-cleaning-site to archive/specs | 🟤 | From CONTENT-003 Code Review (2026-03-24) | yes | Archive/doc hygiene |
| 154 | From CONTENT-003: CleanSpark (742) | Add `scripts/convert-screenshot.js` PNG→webp utility | 🔵 | From CONTENT-003: Add CleanSpark to Portfolio (2026-03-23) | yes | Tooling user wants for CONTENT tasks |
| 155 | From CONTENT-004: Update Project Info (754) | Capture project screenshots for modal data (4 projects) | 🔵 | From CONTENT-004: Update Project Information (2026-03-25) | yes | Content [possible-dup-of: rows 138, 167] |
| 156 | From CONTENT-004: Update Project Info (754) | Update rating_bot_showcase repo from main rating_bot repo | 🔵 | From CONTENT-004: Update Project Information (2026-03-25) | yes | Content/showcase repo |
| 157 | From CONTENT-004: Update Project Info (754) | Create showcase repo for social-stats + add portfolio card | 🔵 | From CONTENT-004: Update Project Information (2026-03-25) | yes | Content/new project |
| 158 | From CONTENT-004: Update Project Info (754) | Fix svg-processor README (CairoSVG vs svglib; Russian only) | 🔵 | From CONTENT-004: Update Project Information (2026-03-25) | yes | Content/README fix |
| 159 | From CONTENT-004: Update Project Info (754) | Translate svg-processor README to English | 🔵 | From CONTENT-004: Update Project Information (2026-03-25) | yes | Content/README translation |
| 160 | From Archive Cleanup (769) | Automate superpowers→archive consolidation on task completion | 🟤 | From Archive Cleanup (2026-03-27) | yes | Doc/archive hygiene tooling |
| 161 | From Archive Cleanup (769) | Enforce underscore naming convention for archive files (CI/hook) | 🟤 | From Archive Cleanup (2026-03-27) | yes | Doc-hygiene tooling [possible-dup-of: row 173] |
| 162 | From Archive Cleanup Code Review (775) | Add "Last Updated" header update to planning doc edit checklist | 🟤 | From Archive Cleanup Code Review (2026-03-27) | yes | Process/doc hygiene |
| 163 | From Archive Cleanup Code Review (775) | Validate spec references after file moves (grep superpowers/) | 🟤 | From Archive Cleanup Code Review (2026-03-27) | yes | Doc-hygiene tooling |
| 164 | From Code Quality & Lint Fixes (781) | Add remaining root config files to ESLint `ignores` array | 🟤 | From Code Quality & Lint Fixes (2026-04-03) | yes | Lint-tooling hygiene [possible-dup-of: rows 143, 209] |
| 165 | From Code Quality & Lint Fixes Code Review (787) | Consolidate redundant plan archive files | 🟤 | From Code Quality & Lint Fixes Code Review (2026-04-04) | yes | Doc/archive hygiene |
| 166 | From Automated Link Checking Code Review (810) | Add `cache: 'npm'` to `check-links` CI job setup-node | 🟤 | From Automated Link Checking Code Review (2026-04-07) | yes | CI hygiene [possible-dup-of: rows 169, 172] |
| 167 | From Automated Link Checking Code Review (810) | Add file-level JSDoc to `scripts/check-links.js` | 🟤 | From Automated Link Checking Code Review (2026-04-07) | yes | Doc-hygiene |
| 168 | From Form & A11Y Polish (816) | Audit dynamically-injected HTML for missing `aria-hidden` | 🟤 | From Form & A11Y Polish (2026-04-08) | yes | A11y/code audit |
| 169 | From Form & A11Y Polish (816) | Audit component-level transitions for missing `color` property | 🟤 | From Form & A11Y Polish (2026-04-08) | yes | CSS hygiene audit |
| 170 | From Form & A11Y Polish Code Review (822) | Add plan file naming validation to CI or pre-commit hook | 🟤 | From Form & A11Y Polish Code Review (2026-04-09) | yes | Doc-hygiene tooling [possible-dup-of: row 173] |
| 171 | From CI Hardening (829) | CI: Add `npm ci` to check-links job if external deps added | 🟤 | From CI Hardening (2026-04-09) | n/a | CI tooling note [possible-dup-of: rows 166, 172] |
| 172 | From CI Hardening (829) | ESLint: Consider glob pattern for root config ignores | 🟤 | From CI Hardening (2026-04-09) | n/a | Lint-tooling hygiene [possible-dup-of: rows 143, 164, 209] |
| 173 | From CI Hardening Code Review (834) | Cleanup: Remove duplicate plan from `docs/superpowers/plans/` | 🟤 | From CI Hardening Code Review (2026-04-10) | n/a | Doc/archive hygiene [possible-dup-of: row 177] |
| 174 | From CI Hardening Code Review (834) | CI: Remove `cache: 'npm'` from check-links until `npm ci` needed | 🟤 | From CI Hardening Code Review (2026-04-10) | n/a | CI tooling [possible-dup-of: row 166 — contradictory recommendation] |
| 175 | From Firefox & Test Audit (839) | Remove unused `getAnimationDuration()`/`getStaggerDelay()` | 🟤 | From Firefox & Test Audit (2026-04-10) | yes | Test/code hygiene |
| 176 | From Firefox & Test Audit (839) | Harden `filterProjects()` animation interruption (cancel timeouts) | 🟤 | From Firefox & Test Audit (2026-04-10) | yes | App-race fix surfaced by test review |
| 177 | From Firefox & Test Audit Code Review (845) | Cleanup: Remove duplicate plans/specs from `docs/superpowers/` | 🟤 | From Firefox & Test Audit Code Review (2026-04-11) | n/a | Doc/archive hygiene [possible-dup-of: rows 173, 165] |
| 178 | From Firefox & Test Audit Code Review (845) | Automate BACKLOG Origin path validation | 🟤 | From Firefox & Test Audit Code Review (2026-04-11) | n/a | Tooling. ? Likely DONE (validator shipped 2026-04-16) — candidate prune |
| 179 | From Test Robustness Code Review (856) | Add inline comment explaining omitted `waitForScrollAnimations()` (confidence 75/100) | 🟤 | From Test Robustness Code Review (2026-04-16) | n/a | Code review finding/test doc |
| 180 | From Code Quality batch (862) | Investigate pre-existing Firefox flaky test (NOT REPRODUCING) | 🟤 | From Code Quality batch (2026-04-16) | yes | Test stability watch [related: row 184] |
| 181 | From Code Quality batch (862) | Extend `validate-backlog-paths.js` to catch `docs/superpowers/` (confidence 75/100) | 🟤 | From Code Quality batch (2026-04-16) | yes | Tooling. ? Likely DONE (denylist shipped, PR #69) — candidate prune |
| 182 | From Code Quality batch (862) | Read BACKLOG.md from git index, not working tree (confidence 50/100) | 🟤 | From Code Quality batch (2026-04-16) | yes | Tooling. ? Likely DONE (git-index read shipped, PR #69) — candidate prune |
| 183 | From Code Quality batch (862) | Add `npm run validate-backlog` script | 🟤 | From Code Quality batch (2026-04-16) | yes | Tooling. ? Likely DONE (script exists) — candidate prune |
| 184 | From Code Quality batch (862) | Add success output to `validate-backlog-paths.js` | 🟤 | From Code Quality batch (2026-04-16) | yes | Tooling. ? Likely DONE (prints "OK") — candidate prune |
| 185 | From Code Quality batch Code Review (871) | Document shell gotcha: `&&` vs `if/fi` with grep exit code | 🟤 | From Code Quality batch Code Review (2026-04-16) | n/a | Doc-hygiene. ? Likely DONE (Shell Gotchas in CLAUDE.md, PR #70) — candidate prune |
| 186 | From PR #64 Code Review (875) | Tighten pre-commit grep pattern for BACKLOG.md detection (confidence 35/100) | 🟤 | From PR #64 Code Review (2026-04-19) | n/a | Code review finding. ? Likely DONE (anchored pattern in hook) — candidate prune |
| 187 | From PR #64 Code Review (875) | Handle staged deletion of BACKLOG.md in validator (confidence 75/100) | 🟤 | From PR #64 Code Review (2026-04-19) | n/a | Code review finding. ? Likely DONE (git-index handles deletion) — candidate prune |
| 188 | From Internal Asset Link Checking (882) | Extract shared HTML ref extractor to `scripts/lib/extract-refs.js` | 🟤 | From Internal Asset Link Checking (2026-04-20) | yes | Code-dedup hygiene |
| 189 | From Internal Asset Link Checking (882) | CSS `url()` ref scanning | 🟤 | From Internal Asset Link Checking (2026-04-20) | yes | Tooling extension |
| 190 | From Internal Asset Link Checking (882) | Orphan asset detection (informational) | 🟤 | From Internal Asset Link Checking (2026-04-20) | yes | Tooling extension |
| 191 | From Internal Asset Link Checking (882) | Per-segment `readdirSync` walk fallback in `assetExists()` | 🟤 | From Internal Asset Link Checking (2026-04-20) | yes | Contingency/code hygiene |
| 192 | From Internal Asset Link Checking (882) | Add file-level JSDoc and test coverage for `scripts/` | 🟤 | From Internal Asset Link Checking (2026-04-20) | yes | Test backfill/doc-hygiene |
| 193 | From Internal Asset Link Checking Code Review (891) | Implement the `dist/` preflight error message (confidence 90) | 🟤 | From Internal Asset Link Checking Code Review (2026-04-20) | n/a | Code review finding. ? Likely DONE (preflight shipped PR #68) — candidate prune |
| 194 | From Internal Asset Link Checking Code Review (891) | Improve generic "not found" error on CI (confidence 85) | 🟤 | From Internal Asset Link Checking Code Review (2026-04-20) | n/a | Code review finding. ? Likely DONE (CI wording, PR #68) — candidate prune |
| 195 | From Internal Asset Link Checking Code Review (891) | Document HTML-regex scope assumption (confidence 70) | 🟤 | From Internal Asset Link Checking Code Review (2026-04-20) | n/a | Code review finding. ? Likely DONE (JSDoc, PR #68) — candidate prune |
| 196 | From Internal Asset Link Checking Code Review (891) | Harden JSON walk against non-flat `projects` shape (confidence 80) | 🟤 | From Internal Asset Link Checking Code Review (2026-04-20) | n/a | Code review finding. ? Likely DONE (guard, PR #68) — candidate prune |
| 197 | From Internal Asset Link Checking Code Review (891) | Extend extractor to `<source>`, `<video poster>`, srcset | 🟤 | From Internal Asset Link Checking Code Review (2026-04-20) | n/a | Tooling extension |
| 198 | From PR #65 Review (899) | Tighten case-sensitivity check to cover directory segments (confidence 65) | 🟤 | From PR #65 Review (2026-04-28) | n/a | Code review finding. ? May be DONE (realpathSync.native, PR #68) — verify |
| 199 | From PR #65 Review (899) | Align output format between check-links.js and check-assets.js | 🟤 | From PR #65 Review (2026-04-28) | n/a | Code review finding. ? May be DONE (brackets format, PR #68) — verify |
| 200 | From Test Stability Investigations (904) | Document `page.evaluate` instrumentation Heisenbug gotcha (confidence 75/100) | 🟤 | From Test Stability Investigations (2026-04-28) | yes | Doc-hygiene/test note |
| 201 | From Test Stability Investigations (904) | Audit `setTimeout`-based route mocks across test suite | 🟤 | From Test Stability Investigations (2026-04-28) | yes | Test hygiene audit |
| 202 | From Test Stability Investigations (904) | Re-investigate Firefox tabindex flake if it recurs | 🟤 | From Test Stability Investigations (2026-04-28) | yes | Test stability watch [related: row 180] |
| 203 | From PR #66 Review (911) | Update stale `docs/superpowers/` cross-references in archived plan (confidence 35) | 🟤 | From PR #66 Review (2026-04-30) | n/a | Doc-hygiene/code review finding |
| 204 | From PR #66 Review (911) | Tighten `mockFormspreeDeferred()` JSDoc prose (confidence 10, nitpick) | 🟤 | From PR #66 Review (2026-04-30) | n/a | Code review finding/test doc |
| 205 | From PR #67: WebKit reduced-motion (916) | Identify root cause of WebKit-Linux reduced-motion axe race (confidence 60) | 🟤 | From PR #67: WebKit reduced-motion axe flake (2026-05-01) | yes | Test flake investigation |
| 206 | From PR #67: WebKit reduced-motion (916) | Audit other axe scans following class-toggle actions (confidence 55) | 🟤 | From PR #67: WebKit reduced-motion axe flake (2026-05-01) | yes | Test hygiene audit |
| 207 | From PR #67: WebKit reduced-motion (916) | Extract post-click axe-scan settle into shared helper (confidence 40) | 🟤 | From PR #67: WebKit reduced-motion axe flake (2026-05-01) | yes | Test code-dedup |
| 208 | From Asset Checker Polish Code Review (923) | Restyle stale-hash hint label tone (confidence 40) | 🟤 | From Asset Checker Polish Code Review (2026-05-03) | yes | Code review finding (styling) |
| 209 | From Asset Checker Polish Code Review (923) | Restructure the CLAUDE.md "Internal asset check" bullet (confidence 50) | 🟤 | From Asset Checker Polish Code Review (2026-05-03) | yes | Doc-hygiene |
| 210 | From Asset Checker Polish Code Review (923) | Tighten the stale-hint regex if ref shapes change (confidence 20) | 🟤 | From Asset Checker Polish Code Review (2026-05-03) | yes | Code review finding (latent) |
| 211 | From Asset Checker Polish Code Review (923) | Stale-hash hint stderr/stdout ordering (confidence 25) | 🟤 | From Asset Checker Polish Code Review (2026-05-03) | yes | Code review finding (observation) |
| 212 | From Asset Checker Polish Code Review (923) | Narrow stale-hash hint trigger to hash-bearing refs only (confidence 30) | 🟤 | From Asset Checker Polish Code Review (2026-05-03) | yes | Code review finding (latent) |
| 213 | From PR #68 Post-Merge Review (932) | Guard `checkDistPreflight()` against `dist` as non-directory (confidence 50) | 🟤 | From PR #68 Post-Merge Review (2026-05-05) | yes | Code review finding |
| 214 | From PR #68 Post-Merge Review (932) | Reconcile `checkDistPreflight()` JSDoc vs error message vocabulary (confidence 50) | 🟤 | From PR #68 Post-Merge Review (2026-05-05) | yes | Doc/code drift |
| 215 | From PR #68 Post-Merge Review (932) | Update `extractJsonRefs()` JSDoc to mention non-object guard (confidence 50) | 🟤 | From PR #68 Post-Merge Review (2026-05-05) | yes | Doc/code drift |
| 216 | From BACKLOG Validator Hardening (939) | Improve validator fix-guidance for spec-targeted violations (confidence 30, nitpick) | 🟤 | From BACKLOG Validator Hardening (2026-05-07) | yes | Code review finding |
| 217 | From BACKLOG Validator Hardening (939) | Track npm overhead per pre-commit invocation (confidence 85, ergonomics) | 🟡 | From BACKLOG Validator Hardening (2026-05-07) | yes | Perf/ergonomics observation. ? could be 🟤 — flag |
| 218 | From PR #69 Post-Merge Review (946) | Surface `console.warn` when `readBacklog()` falls back to working-tree (confidence 50, observability) | 🟤 | From PR #69 Post-Merge Review (2026-05-07) | n/a | Code review finding (observability) |
| 219 | From CI Deadline & Docs (950) | CLAUDE.md "Shell Gotchas" — inline `.husky/pre-commit` path (confidence 40) | 🟤 | From CI Deadline & Docs (2026-05-10) | yes | Doc-hygiene |
| 220 | From CI Deadline & Docs (950) | CLAUDE.md "Shell Gotchas" — reword "fresh repo" → "doesn't stage BACKLOG.md" (confidence 50) | 🟤 | From CI Deadline & Docs (2026-05-10) | yes | Doc-hygiene |
| 221 | From CI Deadline & Docs (950) | ROADMAP.md — annotate v1.5 parallel-development phase ladder (confidence 60) | 🟤 | From CI Deadline & Docs (2026-05-10) | yes | Doc-hygiene |
| 222 | From CI Deadline & Docs (950) | ROADMAP.md — remove duplicate "Last Updated" field (confidence 70) | 🟤 | From CI Deadline & Docs (2026-05-10) | yes | Doc-hygiene |
| 223 | From CI Deadline & Docs (950) | ROADMAP.md — align Quality & Hardening cross-link display-text (confidence 50) | 🟤 | From CI Deadline & Docs (2026-05-10) | yes | Doc-hygiene |
| 224 | From CI Deadline & Docs (950) | ROADMAP.md — document transition convention for in-progress phase header (confidence 40) | 🟤 | From CI Deadline & Docs (2026-05-10) | yes | Doc-hygiene |
| 225 | From CI Deadline & Docs (950) | BACKLOG.md observability item — update `@v4`→`@v6` parenthetical (confidence 60) | 🟤 | From CI Deadline & Docs (2026-05-10) | yes | Doc-hygiene (self-referential to row 218) |
| 226 | From CI Deadline & Docs (950) | `.github/workflows/deploy.yml` — add `pull_request:` trigger (confidence 70) | 🟡 | From CI Deadline & Docs (2026-05-10) | yes | CI gap/ops. ? could be 🟤 — flag; important CI gap |
| 227 | From PR #70 Post-Merge Review (963) | Plan-template "Spec/Plan" links should ship in archive-form (confidence 75) | 🟤 | From PR #70 Post-Merge Review (2026-05-14) | yes | Process/template hygiene |
| 228 | From PR #70 Post-Merge Review (963) | Commit messages should not assert past-tense fixes not applied (confidence 60) | 🟤 | From PR #70 Post-Merge Review (2026-05-14) | yes | Process discipline |
| 229 | From Scroll Animation Deterministic Polling (970) | Automated guard for helper's observer-mirrored constants (confidence 60) | 🟤 | From Scroll Animation Deterministic Polling (2026-05-17) | yes | Test observability backfill |
| 230 | From Scroll Animation Deterministic Polling (970) | Polling helper for modal-open state (`waitForModalOpen`) (confidence 65) | 🟤 | From Scroll Animation Deterministic Polling (2026-05-17) | yes | Test infra/flake reduction |
| 231 | From Scroll Animation Deterministic Polling (970) | Add `waitForScrollAnimations(page)` to form/modal reduced-motion beforeEach (confidence 50) | 🟤 | From Scroll Animation Deterministic Polling (2026-05-17) | yes | Test consistency polish |
| 232 | From Scroll Animation Deterministic Polling (970) | Targeted regression test for `waitForScrollAnimations()` after filter (confidence 50) | 🟤 | From Scroll Animation Deterministic Polling (2026-05-17) | yes | Test coverage |
| 233 | From PR #71 Post-Merge Review (979) | Preserve deleted FilterPage stagger-budget rationale in helper JSDoc (confidence 25) | 🟤 | From PR #71 Post-Merge Review (2026-05-24) | yes | Test doc lineage |
| 234 | Enhancements › Accessibility (186) | Add aria-live regions for dynamic content | 🔵 | From Enhancements: Accessibility | n/a | A11y feature. NOTE: in BACKLOG this checkbox sits at line 190 under `### Accessibility` (between the SEO-002 and DOCS-001 sections); listed last here only to keep prior row numbers stable — its proposed sub-header groups it with the other Enhancements rows. |

## Reconciliation note (read before auditing counts)

The baseline tool counts **234** `- [ ]` checkbox lines. Rows 1–234 above map 1:1 to all
234 of those checkbox lines (every checkbox line is distinct). The three lists are
**fully disjoint**: the 234 table rows are the existing `- [ ]` checkboxes; the 3
promotions below are net-new checkboxes created from plain `-` prose bullets; the 117
prune entries are completed/struck items. None overlap.

Row 234 ("Add aria-live regions") is shown last for numbering stability but belongs in
line order under `### Accessibility` (BACKLOG line 190); the Task 4 rewrite places it in
its proposed `From Enhancements: Accessibility` sub-header with the other Visual/Perf rows.

## Prune list (completed items dropped)

Grouped by current section. Each line is recoverable via git history + its `*(completed …)*` tag. Total: **117** completed/struck items.

- **Features** (7): Theme Toggle (4 sub-items, MP-003); Project Filtering (4 sub-items, LP-001); Scroll Animations (4 sub-items, LP-002); Project Metadata Badges (5 sub-items, FEAT-001) — *(note: these struck `### ~~Heading~~` blocks contain struck sub-bullets; counted as the struck line-items they contain)*. Shipped-prose to drop: Project Detail Modal description lines, Contact Form (CHALLENGE-003), Ideas-from-Rebuild completed bullets.
- **From LP-001: Project Filtering** (4): Filter count badges (FEAT-006); Keyboard navigation (FEAT-002); Enhanced filter animations (FEAT-003); Fix toggle-to-reset tabindex desync (BUG-002).
- **Enhancements › Visual** (2): Add project screenshots/thumbnails (MP-001); Create custom favicon.
- **Enhancements › Performance** (5): Lazy load project images (MP-001); Minify CSS (PERF-004); Self-host Google Fonts (PERF-001); Bundle CSS files (PERF-003); Add font preload hint (PERF-002).
- **Enhancements › SEO** (4): JSON-LD (SEO-002); sitemap.xml (SEO-001); robots.txt (SEO-001); Improve meta descriptions (SEO-004).
- **From FEAT-002: Filter Keyboard Navigation** (2): Escape key reset (FEAT-005); Screen reader testing (A11Y-001).
- **From FEAT-005: Escape Key Reset Filter** (1): Centralized reset function (QUALITY-001).
- **From PERF-001: Self-host Google Fonts** (2): Font preload hint (PERF-002); Update PROJECT.md external deps (DOCS-001).
- **From PERF-002: Font Preload Hint** (1): Monitor with Lighthouse CI (CHALLENGE-001).
- **From PERF-003: Bundle CSS Files** (2): CSS minification cssnano (PERF-004); Cache-busting content hash (PERF-005).
- **From SEO-001: robots.txt & sitemap.xml** (2): Automate sitemap lastmod (SEO-007); Google Search Console verification (SEO-003).
- **From SEO-003: Google Search Console** (1): Bing Webmaster Tools verification (SEO-005).
- **Enhancements › Accessibility** (2): Improve focus indicators (A11Y-002); Test with screen readers (A11Y-001).
- **From A11Y-002: Improve Focus Indicators** (1): Focus indicator transition animation (POLISH-001).
- **From BUG-002: Toggle-to-Reset Tabindex Desync** (2): Centralize filter activation (QUALITY-002); Automated a11y regression tests (TEST-001).
- **From FEAT-003: Enhanced Filter Animations** (1): Playwright animation tests (TEST-001).
- **From BUG-003: Filter Animation Fix** (2): CSS specificity documentation (QUALITY-003); Animation integration tests (TEST-001).
- **From SEO-004: Improve Meta Descriptions** (1): Social card preview testing (SEO-006).
- **From PERF-004: cssnano** (1): Build size reporting (PERF-008).
- **From TEST-001: Playwright E2E** (3): axe-core integration (TEST-002); Test server error handling (QUALITY-006); Separate CI workflow jobs (CI-001).
- **From CI-001: Separate CI Workflow Jobs** (1): Narrow Pages deploy artifact path (CI-002).
- **From TEST-002: Accessibility Regression Tests** (2): Theme-specific axe scanning (TEST-004); Reduced motion accessibility test (TEST-005).
- **From PERF-005: Cache-Busting** (2): JS cache-busting (PERF-007); Build size reporting (PERF-008).
- **From PERF-007: JS Cache-Busting** (1): ESLint integration (QUALITY-007).
- **From POLISH-001: Focus Indicator Transition** (1): Audit remaining `transition: all` usage (QUALITY-005).
- **Bug Fixes** (1): Fix theme switch button overlap (BUG-001).
- **Technical Debt** (2): Set up Lighthouse CI (CHALLENGE-001); Add CSS linting Stylelint (TEST-003).
- **Notes section in Features (Ideas from Portfolio Rebuild)** — see promotion list for disposition of plain bullets (4 dropped as completed/dup).
- **From SEO-006: Social Card Preview Testing** (1): Automated OG validation in CI (TEST-006).
- **From QUALITY-005: Audit transition:all** (2): Stylelint rule to prevent `transition: all` (QUALITY-008); Document "no transition: all" convention (QUALITY-008).
- **From QUALITY-007: ESLint Integration** (1): Investigate flaky Firefox rapid-clicks test (BUG-004).
- **From CI: Upgrade GitHub Actions to Node.js 24** (1): Upgrade all Actions to Node 24 (PR #70).
- **From CHALLENGE-002: Project Detail Modal** (2): Axe-core WCAG scan for modal (TEST-007); Populate remaining project cards (CONTENT-001).
- **From TEST-007: Axe-core WCAG Scan for Modal** (2): Reduced motion test efficiency; Skip `waitForScrollAnimations()` under reduced motion (both test-quality-improvements).
- **From CONTENT-001: Populate Remaining Project Cards** (1): Add `expectScreenshotsCount` to rule-indicators test.
- **From QUALITY-009 Code Review** (2): Consolidate `docs/superpowers/` into standard structure (archive-cleanup); Archive QUALITY-009 plan.
- **From QUALITY-010 Code Review** (2): CLAUDE.md duplicate JS Linting descriptions resolved; lint-staged `*.js` glob fix (code-lint-fixes).
- **From CHALLENGE-003 Code Review** (7): outline-color in `:focus-visible`; focus management after submission; CSS cascade conflict; web-first `toBeFocused()`; reduced-motion `fp.goto()`; SVG status icons; `.contact-form__status` theme group (all a11y/contact-form-hardening).
- **From Contact Form A11Y Hardening** (1): Firefox rapid-click filter tests flaky (resolved 2026-04-10).
- **From Contact Form A11Y Hardening Code Review** (3): `aria-hidden` on decorative SVGs; `color` in input transition; `test.expect()`→`expect()` migration.
- **From CONTENT-002: Portfolio Requirements** (1): Automated link checking in CI (challenge/automated-link-checking).
- **From CONTENT-002 Code Review** (2): Rename CONTENT-002 spec; Move CONTENT-002 spec to archive/specs.
- **From BUG-004 Code Review** (2): Update `docs/archive/README.md`; Update `filterProjects()` JSDoc.
- **From CONTENT-003: Add CleanSpark** (1): Audit test files for hardcoded project counts.
- **From CONTENT-003 Code Review** (1): Update "Adding New Projects" template in CLAUDE.md.
- **From CONTENT-004 Code Review** (2): Standardize task completion archive workflow; Audit existing `docs/superpowers/` for stale files.
- **From Code Quality & Lint Fixes** (1): Fix pre-existing flaky Firefox filter a11y test.
- **From Code Quality & Lint Fixes Code Review** (1): Automate BACKLOG Origin path validation.
- **From Test Quality Improvements** (2): Replace `page.evaluate` in modal a11y tests; Apply reduced-motion `waitForScrollAnimations()` optimization.
- **From Test Quality Improvements Code Review** (0 items — "No issues found" line; not a checkbox, dropped as section note).
- **From Automated Link Checking Challenge** (2): Add internal asset link checking; Replace `checkBatch` callback with direct `checkUrl`.
- **From Test Robustness** (2): Replace `waitForScrollAnimations()` with deterministic polling (PR #71); Investigate WebKit form submission flaky test (PR #66).
- **From PR #71 Post-Merge Review** (1): CLAUDE.md "Reduced-motion axe pattern" bullet contradiction (resolved 2026-05-24).
- **Notes** (1): GitHub Profile README struck/DONE bullet.

*(Per-section counts above sum to 117 struck/`[x]` line-items, matching the baseline completed count. The four struck `### ~~Heading~~` blocks in Features each contribute their struck sub-bullets to this total; the headings themselves are dropped with their blocks.)*

## Promotion list (plain `-` bullets promoted to `- [ ]`)

These are open work currently written as plain `-` prose bullets, promoted to real `- [ ]` items. They are **net-new checkboxes**, NOT part of the 234 baseline.

1. **Project Detail Pages** → 🔵 User-Flagged (under `### From Features: Project Detail Pages (2026-01-22)`). Body: individual pages for major projects, more detailed descriptions, screenshots/demos, technical deep-dives. Genuine open feature, distinct from the shipped modal. *(Consolidates the 4 plain sub-bullets at lines 56–60 into one actionable item.)*
2. **Blog Section** → 🔵 User-Flagged (under `### From Features: Blog Section`). Body: add blog/articles section; markdown-based posts with build step; planned first posts — (a) "My Claude Code Workflow", (b) "Building Industrial IoT Solutions", (c) "From Learning Projects to Production Code". Genuine open feature. *(Consolidates the 4 plain bullets + 3 "Planned Blog Posts" at lines 62–84 into one item with the post list in the body.)*
3. **Add resume PDF download** → 🔵 User-Flagged (under `### From Ideas from Portfolio Rebuild (2026-01-20)`). The only genuinely-open, non-duplicate plain bullet in that section.

**Plain bullets explicitly NOT promoted (dropped/superseded):**
- `## Features` › **Contact Form** (4 bullets: replace email link, Formspree, validation, success/error states) — **DROP**: shipped as CHALLENGE-003 (DONE.md line 355).
- `## Features` › **Project Detail Modal** prose description lines (click card, extended description, screenshots/videos) — **DROP**: modal shipped as CHALLENGE-002 (DONE.md line 421). The 5 `- [ ]` `Requires:` sub-items remain in the table (rows 1–5) flagged for prune-on-audit.
- `## Ideas from Portfolio Rebuild` — "Add project screenshots/thumbnails" (DROP: done MP-001); "Create dedicated project detail pages" (DROP: dup of promotion #1); "Add blog section" (DROP: dup of promotion #2); "Implement contact form" (DROP: done CHALLENGE-003).
- `## Internationalization` › Multi-Language Support sub-bullets — already `- [ ]` checkboxes (rows 27–39); **no promotion needed** (verified).
- `## Media & Visual Content` › Project Media Strategy prose intro ("Add photos, screenshots, and videos demonstrating project work", "Placement decision" trade-offs 1–3) — descriptive context for the `- [ ]` items (rows 42–54); not standalone actionable bullets; **no promotion**.

## Items per source (after classification)

Counts over the 234 table rows (the existing `- [ ]` checkboxes), per the "Proposed source" column. The 3 promotions below are all 🔵 and are net-new beyond the 234.

- 🔵 User-Flagged: 69 items (feature/content/UX/i18n/media rows — see "Proposed source" column)
- 🟡 Operational: 16 items (rows 3, 46, 64, 89, 115–117, 119–120, 131–133, 145, 147, 217, 226 — monitoring/CI-gate/ops)
- 🟤 Auto-Generated: 149 items (all code-review / PR-review / doc-hygiene / test-backfill rows)
- **Total: 69 + 16 + 149 = 234 == open-items baseline (234).**

**Authoritative reconciliation:** baseline open `- [ ]` = 234 (all in the table). Promotions = 3 (Project Detail Pages, Blog Section, resume PDF — all 🔵, all net-new). Prune = 117 completed/struck. The three lists are disjoint. **Open-work count after rewrite (before any audit-driven prune) = 234 + 3 promotions = 237.** The "?" prune-on-audit candidate rows are flagged for the user but are NOT pruned in this artifact (they remain in the 234).

> Per-source bucket counts above are groupings for the audit; the authoritative per-row classification is the "Proposed source" column. Final per-source totals are recomputed at Task 4 after the user resolves the prune-on-audit "?" rows and confirms the 3 promotions' buckets.

## Audit sign-off

- [ ] User reviewed and approved the classification (date: ___)
- [ ] Misclassifications / prune objections corrected
- [ ] "?" prune-on-audit candidates resolved (rows 1–5, 10, 11, 22, 87, 105, 115, 122, 126–127, 129, 148, 178, 181–187, 193–199)
- [ ] 3 promotions' source buckets confirmed (Project Detail Pages, Blog Section, resume PDF — all proposed 🔵)
- [ ] Source-totals (🔵 69 / 🟡 16 / 🟤 149) equal open-items baseline (234); promotions (3) tracked separately
