# BACKLOG

**Last Updated**: 2026-03-19 (TEST-007 completed)

Future ideas and improvements for the portfolio.

---

## Features

### ~~Theme Toggle~~ *(completed 2026-01-28, MP-003)*
- ~~Add dark/light mode switch~~
- ~~Persist preference in localStorage~~
- ~~Detect `prefers-color-scheme`~~
- ~~Animate theme transition~~

### ~~Project Filtering~~ *(completed 2026-01-28, LP-001)*
- ~~Filter projects by category~~
- ~~CSS-only solution preferred~~ (used JS for better UX)
- ~~Consider checkboxes or buttons~~ (buttons with toggle-to-reset)
- ~~Animate filter transitions~~ (opacity + scale with immediate layout reflow)

### ~~Scroll Animations~~ *(completed 2026-01-28, LP-002)*
- ~~Fade in sections on scroll~~
- ~~Use Intersection Observer~~
- ~~Respect `prefers-reduced-motion`~~
- ~~Keep animations subtle~~

### Project Detail Modal (2026-01-22)
- Click project card (outside links) to open centered overlay
- Extended description with project "story" (challenges, decisions, results)
- Screenshots and/or videos demonstrating functionality — *see "Media & Visual Content" section for media strategy*
- Requires:
  - [ ] Data structure decision (JSON file vs data attributes vs JS object)
  - [ ] Accessibility: focus trap, ESC to close, aria-modal, restore focus
  - [ ] Lazy-load media to maintain <200KB initial page load
  - [ ] Mobile-friendly modal UX
  - [ ] Clear visual hint that cards are clickable (hover state, "View details")

### Project Content Population (2026-01-27)
- **Depends on**: Project Detail Modal implementation
- Populate extended descriptions and media for each project
- For each project, add:
  - [ ] Extended description (challenges, decisions, lessons learned)
  - [ ] Screenshots demonstrating key features
  - [ ] Demo videos/GIFs where applicable
  - [ ] Technical highlights and architecture notes

### ~~Project Metadata Badges~~ *(completed 2026-01-29, FEAT-001)*
- ~~Add "last updated" date to project cards~~
- ~~Add "in development" indicator/icon for active projects~~
- ~~Shows portfolio is actively maintained (good signal for recruiters)~~
- ~~Dates stored as HTML data attributes + `<time>` elements~~
- ~~Visual design: subtle footer with border separator, pulse dot for active status~~

### Project Detail Pages
- Individual pages for major projects
- More detailed descriptions
- Screenshots and demos
- Technical deep-dives

### Blog Section
- Add blog/articles section
- Write about projects and learnings
- Could use separate static site generator
- Consider markdown-based posts with build step

**Planned Blog Posts:**

1. **My Claude Code Workflow** (Priority: First Post)
   - How I use Claude Code for development
   - Configuration setup (universal CLAUDE.md)
   - Workflow patterns and best practices
   - Real examples from this portfolio rebuild
   - Tips for effective AI-assisted development

2. **Building Industrial IoT Solutions**
   - Lessons from rule_indicators and lubrication monitoring
   - Hardware-software integration challenges
   - Wokwi simulation for development

3. **From Learning Projects to Production Code**
   - Journey from FreeCodeCamp to real applications
   - What tutorials don't teach you

### Contact Form
- Replace email link with form
- Use Formspree or similar service
- Add client-side validation
- Success/error states

---

## From LP-001: Project Filtering (2026-01-28)

### Filter Enhancements
- [ ] URL hash-based filtering — Allow shareable links like `#filter=backend`
- [x] ~~Filter count badges~~ *(completed 2026-02-04, FEAT-006)*
- [x] ~~Keyboard navigation~~ *(completed 2026-01-29, FEAT-002)*
- [x] ~~Enhanced filter animations~~ *(completed 2026-02-03, FEAT-003)*
- [x] ~~Fix toggle-to-reset tabindex desync~~ *(completed 2026-02-02, BUG-002)*

---

## Enhancements

### Visual

- [x] ~~Add project screenshots/thumbnails~~ *(completed 2026-01-27, MP-001)*
- [x] ~~Create custom favicon~~ *(completed 2026-01-26)*
- [ ] Add Open Graph image for social sharing
- [ ] Consider adding a profile photo
- [ ] Add subtle gradient backgrounds

### Performance

- [x] ~~Lazy load project images~~ *(completed 2026-01-27, MP-001)*
- [ ] Consider using `font-display: swap`
- [x] ~~Minify CSS for production~~ *(completed 2026-02-09, PERF-004)*
- [ ] Add service worker for offline support
- [x] ~~Self-host Google Fonts~~ *(completed 2026-01-29, PERF-001)*
- [x] ~~Bundle CSS files~~ *(completed 2026-02-03, PERF-003)*
- [x] ~~Add font preload hint~~ *(completed 2026-02-02, PERF-002)*

### SEO

- [x] ~~Add structured data (JSON-LD)~~ *(completed 2026-01-29, SEO-002)*
- [x] ~~Create sitemap.xml~~ *(completed 2026-01-29, SEO-001)*
- [x] ~~Add robots.txt~~ *(completed 2026-01-29, SEO-001)*
- [x] ~~Improve meta descriptions~~ *(completed 2026-02-04, SEO-004)*

### From SEO-002: JSON-LD structured data (2026-01-29)

- [ ] Add profile image for Person schema `image` property — Enables Knowledge Panel photo display (requires profile photo asset)
- [ ] Add additional schema types — Consider `ItemList` for projects or `BreadcrumbList` for future multi-page navigation

### From FEAT-001: Project Metadata Badges (2026-01-29)
**Origin**: docs/archive/plans/2026-01-29_feat-001-project-metadata-badges.md

- [ ] Auto-update dates from git history — Script or pre-commit hook to update `data-updated` and display text from last commit
- [ ] Additional status types — Add "Completed", "Archived", "Beta" variants when needed (new color variables per status)
- [ ] Date format localization — JavaScript to format dates based on user's locale

### From FEAT-002: Filter Keyboard Navigation (2026-01-29)
**Origin**: docs/archive/plans/2026-01-29_feat-002-filter-keyboard-nav.md

- [x] ~~Escape key to reset filter~~ *(completed 2026-02-03, FEAT-005)*
- [x] ~~Screen reader testing~~ *(completed 2026-02-04, A11Y-001)*

### From FEAT-005: Escape Key Reset Filter (2026-02-03)
**Origin**: FEAT-005 implementation

- [x] ~~Centralized reset function~~ *(completed 2026-02-10, QUALITY-001)*
- [ ] Keyboard shortcut documentation — Add visible hint or help tooltip showing Escape key resets filter (improves discoverability)

### From PERF-001: Self-host Google Fonts (2026-01-29)
**Origin**: docs/archive/plans/2026-01-29_perf-001-self-host-fonts.md

- [x] ~~Add font preload hint for inter-latin.woff2~~ *(completed 2026-02-02, PERF-002)*
- [x] ~~Update PROJECT.md external dependencies~~ *(completed 2026-02-05, DOCS-001)*

### From PERF-002: Font Preload Hint (2026-02-02)
**Origin**: docs/archive/plans/2026-02-02_perf-002-font-preload-hint.md

- [ ] Inline critical CSS — Inline above-the-fold styles in `<head>` and load full CSS asynchronously for faster first paint
- [x] ~~Monitor with Lighthouse CI~~ *(completed 2026-03-11, CHALLENGE-001 — `@lhci/cli` in CI pipeline, all categories >= 90)*

### From PERF-003: Bundle CSS Files (2026-02-03)
**Origin**: docs/planning/plans/2026-02-03_perf-003-bundle-css.md

- [x] ~~Add CSS minification with cssnano~~ *(completed 2026-02-09, PERF-004)*
- [x] ~~Add cache-busting with content hash~~ *(completed 2026-02-09, PERF-005)*

### From SEO-001: robots.txt & sitemap.xml (2026-01-29)
**Origin**: docs/archive/plans/2026-01-29_seo-001-robots-sitemap.md

- [x] ~~Automate sitemap lastmod updates~~ *(completed 2026-03-05, SEO-007 — build script `scripts/update-sitemap.js`)*
- [ ] Expand sitemap for future pages — Add entries when blog or project detail pages are created
- [x] ~~Google Search Console verification~~ *(completed 2026-02-04, SEO-003)*

### From SEO-003: Google Search Console Verification (2026-02-04)
**Origin**: docs/archive/plans/2026-02-04_seo-003-google-search-console.md

- [x] ~~Add Bing Webmaster Tools verification~~ *(completed 2026-02-10, SEO-005 — via GSC import, no meta tag needed)*

### Accessibility

- [x] ~~Improve focus indicators~~ *(completed 2026-02-05, A11Y-002)*
- [x] ~~Test with screen readers~~ *(completed 2026-02-04, A11Y-001)*
- [ ] Add aria-live regions for dynamic content

---

## From DOCS-001: Update PROJECT.md (2026-02-05)
**Origin**: docs/archive/plans/2026-02-05_docs-001-update-project-md.md

- [ ] PROJECT.md freshness validation — Pre-commit hook or CI check that warns when "Last Updated" date is >2 weeks old after code changes
- [ ] Automated external link inventory — Script that extracts external href values from HTML and compares against PROJECT.md External Services table

---

## From A11Y-002: Improve Focus Indicators (2026-02-05)
**Origin**: docs/archive/plans/2026-02-05_a11y-002-improve-focus-indicators.md

- [x] ~~Focus indicator transition animation~~ *(completed 2026-02-12, POLISH-001)*
- [ ] Focus-within for project cards — Add :focus-within highlighting on .project-card when internal links receive focus

---

## Internationalization (i18n)

### Multi-Language Support (2026-01-23)
- Add language toggle (EN/RU/UA and other popular languages)
- **Automatic language detection**:
  - [ ] Browser language (`navigator.language` / `navigator.languages`)
  - [ ] Geolocation-based detection (IP-based API or browser geolocation)
  - [ ] Accept-Language header (if server-side rendering added later)
  - [ ] Fallback chain: user preference → browser → geo → default (EN)
- **Language persistence**:
  - [ ] Store user choice in localStorage
  - [ ] Respect explicit user override vs auto-detection
- **Implementation approaches** (decide):
  - [ ] JSON translation files (scalable, separation of concerns)
  - [ ] HTML data attributes (simpler, no build step)
  - [ ] Multiple HTML pages per language (SEO benefits, more maintenance)
- **Considerations**:
  - [ ] Which languages to support initially? (EN, RU, UA, DE, ES, ZH?)
  - [ ] RTL support for future languages (Arabic, Hebrew)?
  - [ ] URL structure (`/en/`, `?lang=en`, or same URL with toggle)?
  - [ ] SEO: hreflang tags, separate sitemaps per language?

---

## Media & Visual Content

### Project Card Media Enhancements (2026-01-27)
- [ ] Add multiple project images to project cards (carousel/gallery)
- [ ] Add ability to embed project work videos in cards

### Project Media Strategy (2026-01-23)
- Add photos, screenshots, and videos demonstrating project work
- **Placement decision** (trade-offs to consider):
  1. **Main page only** — Greater visibility, but increases clutter
  2. **Project modal/detail page only** — Clean main page, but requires click to see
  3. **Hybrid approach** (recommended):
     - Main page: Single hero image/thumbnail per project (optional, subtle)
     - Modal/detail: Full gallery with multiple screenshots + video demos
- **Content types**:
  - [ ] Static screenshots (before/after, key features)
  - [ ] GIF animations (short interaction demos)
  - [ ] Video walkthroughs (embedded YouTube/Vimeo or self-hosted)
  - [ ] Live embedded demos (iframes for applicable projects)
- **Technical requirements**:
  - [ ] Lazy loading to maintain <200KB initial page load
  - [ ] Responsive images (srcset) for different screen sizes
  - [ ] Video poster images for instant visual
  - [ ] Consider CDN for media hosting (Cloudinary, imgix)
  - [ ] Optimize images (WebP format, compression)
- **Per-project media needs**:
  - [ ] Audit each project for best visual representation
  - [ ] Prioritize projects with visual/interactive output
  - [ ] IoT projects: circuit diagrams, Wokwi screenshots, demo videos
  - [ ] Web projects: responsive screenshots, interaction demos

---

## From BUG-001: Theme Button Overlap Fix (2026-02-02)
**Origin**: docs/archive/plans/2026-02-02_bug-001-theme-button-overlap.md

- [ ] CSS Grid 3-column nav centering — Switch `.nav` to `grid-template-columns: 1fr auto 1fr` if perfect centering becomes important after adding more header elements
- [ ] Hamburger menu at very narrow widths — Collapse nav to hamburger below 375px if more nav items are added in the future

---

## From BUG-002: Toggle-to-Reset Tabindex Desync (2026-02-02)
**Origin**: docs/archive/plans/2026-02-02_bug-002-tabindex-desync.md

- [x] ~~Centralize filter activation logic~~ *(completed 2026-02-10, QUALITY-002)*
- [x] ~~Automated accessibility regression tests~~ *(completed 2026-02-09, TEST-001)*

---

## From FEAT-003: Enhanced Filter Animations (2026-02-03)
**Origin**: docs/planning/plans/2026-02-03_feat-003-enhanced-filter-animations.md

- [x] ~~Playwright animation tests~~ *(completed 2026-02-09, TEST-001)*

---

## From BUG-003: Filter Animation Fix (2026-02-04)
**Origin**: BUG-003 implementation

- [x] ~~CSS specificity documentation~~ *(completed 2026-02-11, QUALITY-003)*
- [x] ~~Animation integration tests~~ *(completed 2026-02-09, TEST-001)*

---

## From FEAT-006: Filter Count Badges (2026-02-04)
**Origin**: docs/archive/plans/2026-02-04_feat-006-filter-count-badges.md

- [ ] Animated count transitions — Animate count change on "All" button to show visible vs total (e.g., "All (3/7)") during filtering
- [ ] Zero-count button dimming — Visually dim or disable filter buttons for categories with 0 projects

---

## From A11Y-001: Screen Reader Testing (2026-02-04)
**Origin**: docs/archive/plans/2026-02-04_a11y-001-screen-reader-testing.md

- [ ] Automated screen reader testing — Use `@testing-library/dom` with `aria-query` or Playwright accessibility assertions to catch ARIA regressions in CI
- [ ] Screen reader announcement logging — Add development mode that logs all live region updates to console for debugging accessibility issues without a screen reader
- [ ] Debounce live region announcements on rapid filter clicks — `announceFilterResults()` fires before `isAnimating` guard is set, so rapid clicks can queue overlapping screen reader announcements (code review finding, confidence 75/100)

---

## From PERF-004: CSS Minification with cssnano (2026-02-09)
**Origin**: docs/archive/plans/2026-02-09_perf-004-css-minification-cssnano.md

- [ ] Source maps for production builds — Add `--map` flag to build script for debugging minified CSS in production
- [x] ~~Build size reporting~~ *(completed 2026-02-25, PERF-008)*

---

## From SEO-004: Improve Meta Descriptions (2026-02-04)
**Origin**: docs/archive/plans/2026-02-04_seo-004-improve-meta-descriptions.md

- [ ] Track description character counts in CLAUDE.md — Add reference table of all description lengths to catch regressions when modified
- [x] Social card preview testing — Validate OG/Twitter card rendering using Facebook Debugger and Twitter Card Validator after deployment *(completed 2026-02-13, SEO-006)*

---

## From SEO-005: Bing Webmaster Tools Verification (2026-02-10)
**Origin**: docs/archive/plans/2026-02-10_seo-005-bing-webmaster-tools.md

- [ ] Monitor Bing indexing — Check Bing Webmaster Tools dashboard after 48 hours to verify site data is being processed and pages are indexed
- [ ] IndexNow protocol — Implement IndexNow API for instant Bing notification on content changes (reduces crawl delay for updates)

---

## From QUALITY-003: CSS Specificity Documentation (2026-02-11)
**Origin**: docs/archive/plans/2026-02-11_quality-003-css-specificity-documentation.md

- [ ] Stylelint rule for section ordering — Custom Stylelint rule to enforce filter animation selectors always appear after scroll animation selectors in components.css (tracks with TEST-003)
- [ ] CSS layers for explicit priority — Use `@layer scroll, filter` to replace cascade-order dependency with explicit layer priority when browser support allows
- [ ] Reformat compound selector in specificity table — The `.project-card.project-card--filtering-in.is-filtering` selector is split across two indented lines in the comment, which could visually resemble a descendant selector; reformat to single line for clarity (code review finding, confidence 50/100)

---

## From QUALITY-002: Centralize activateFilter() (2026-02-10)
**Origin**: docs/archive/plans/2026-02-10_quality-002-centralize-activate-filter.md

- [ ] Stabilize rapid-click timing tests — `rapid-clicks.spec.js:25` uses `page.waitForTimeout(duration * 0.3)` which is timing-sensitive across Firefox/WebKit; consider DOM state polling instead of percentage-based timing
- [ ] Unify resetFilter into activateFilter — `resetFilter()` could become `activateFilter("all", { manageFocus: true })` to further reduce duplication (current separation is clearer for distinct use cases)
- [ ] Simplify `applyHashFilter()` JSDoc — Comment describes implementation details (conditional focus, hash non-update) now delegated to `activateFilter()`; update to reference options rather than restate behavior (code review finding, confidence 62/100)

---

## From QUALITY-001: Centralize resetFilter() (2026-02-10)
**Origin**: docs/archive/plans/2026-02-10_quality-001-centralize-reset-filter.md

- [ ] Conditional focus in `resetFilter()` — Add optional `shouldFocus` parameter (default `true`) to prevent jarring focus jumps if function is ever called from system-initiated contexts like hash navigation (code review finding, confidence 25/100)

---

## From TEST-001: Playwright E2E Tests (2026-02-09)
**Origin**: TEST-001 implementation via feature-dev workflow

- [x] ~~axe-core integration~~ *(completed 2026-02-12, TEST-002)*
- [ ] Visual regression snapshots — Add Playwright screenshot comparison tests for filter animation visual states (exit, entrance, final) to catch CSS regressions
- [x] ~~Test server error handling~~ *(completed 2026-03-05, QUALITY-006 — `.on('error')` handler for EADDRINUSE, EACCES, generic)*
- [x] ~~Separate CI workflow jobs~~ *(completed 2026-02-24, CI-001)*

---

## From CI-001: Separate CI Workflow Jobs (2026-02-24)
**Origin**: CI-001 implementation

- [x] ~~Narrow Pages deploy artifact path~~ *(completed 2026-03-11, CI-002 — stages production files into `_site/` before upload)*
- [ ] Fix CLAUDE.md CI test command reference — Build System Pattern item 10 documents test job as running `npm test` but actual CI command is `npx playwright test --ignore-snapshots`; the `--ignore-snapshots` flag is functionally significant (code review finding, confidence 75/100)
- [ ] Update `playwright.config.js` CI comment — Line 26 says "CI builds CSS before running tests" but after CI-001 refactor, the test job downloads a pre-built artifact from the build job rather than building in the same job (code review finding, confidence 25/100)

---

## From TEST-002: Accessibility Regression Tests (2026-02-12)
**Origin**: docs/archive/plans/2026-02-12_test-002-accessibility-regression-tests.md

- [x] ~~Theme-specific axe scanning~~ *(completed 2026-02-17, TEST-004)*
- [x] ~~Reduced motion accessibility test~~ *(completed 2026-02-24, TEST-005)*

---

## From TEST-004: Theme-specific Axe Scanning (2026-02-17)
**Origin**: docs/archive/plans/2026-02-17_test-004-theme-specific-axe-scanning.md

- [ ] Read `--transition-base` from CSS in `setTheme()` — Replace hardcoded 400ms with CSS variable read (follows timing.js pattern for single source of truth)
- [ ] Extend theme testing to animation suite — `animation-states.spec.js` could verify filter animations render correctly in both themes
- [ ] Add `prefers-color-scheme` path testing — Current tests only exercise `data-theme` CSS path; the `@media (prefers-color-scheme)` fallback is untested
- [ ] `setTheme()` should persist to localStorage — Currently only sets `dataset.theme` without updating `localStorage.theme`, leaving the page's system-preference listener able to override the forced theme during tests (code review finding, confidence 75/100)
- [ ] Increase dark theme `--color-text-muted` contrast margin — Current `#8a8a8a` achieves only 4.60:1 against card background `#16213e` (0.10 above WCAG AA minimum); consider bumping to match light theme's comfortable margin pattern (code review finding, confidence 35/100)

---

## From PERF-005: Cache-Busting with Content Hash (2026-02-09)
**Origin**: docs/archive/plans/2026-02-09_perf-005-cache-busting-content-hash.md

- [x] ~~JS cache-busting~~ *(completed 2026-02-22, PERF-007)*
- [x] ~~Build size reporting~~ *(completed 2026-02-25, PERF-008)*

---

## From PERF-007: JS Cache-Busting (2026-02-22)
**Origin**: PERF-007 implementation

- [ ] Source maps for minified JS — Add terser `sourceMap` option for debugging minified JS in production (mirror CSS source map discussion from PERF-004)
- [x] ~~ESLint integration~~ *(completed 2026-03-12, QUALITY-007 — ESLint v9 flat config with three environment blocks)*
- [ ] Watch mode JS file sync — Currently watch mode references `js/main.js` directly; consider a file watcher that copies to `dist/main.js` on change for consistent `dist/` references across modes
- [ ] Restore post-write validation — Old `hash-css.js` had "Step 4: Validate final state" checking hashed file exists and HTML refs updated; `hash-assets.js` dropped this safety net (code review finding, confidence 75/100)
- [ ] Atomic CSS rename — `hash-assets.js` uses `unlinkSync` + `writeFileSync` for CSS instead of atomic `renameSync`; if `writeFileSync` throws after `unlinkSync`, source file is lost (code review finding, confidence 75/100)
- [ ] Update CLAUDE.md Overview Build Tools — Add terser to "Build Tools" line in project-description block: "PostCSS (CSS bundling), Critters (critical CSS inlining), terser (JS minification)" (code review finding, confidence 75/100)
- [ ] Update `npm run build` inline comment — CLAUDE.md Build Commands comment still says "Build CSS with cache-busting" but build now hashes both CSS and JS (code review finding, confidence 75/100)

---

## From POLISH-001: Focus Indicator Transition (2026-02-12)
**Origin**: docs/archive/plans/2026-02-12_polish-001-focus-indicator-transition.md

- [x] ~~Audit remaining `transition: all` usage~~ *(completed 2026-03-05, QUALITY-005 — zero occurrences found, all clean)*
- [ ] CSS custom property for focus transition timing — Add `--focus-transition-duration` to `variables.css` for independent control of focus animation speed (currently reuses `--transition-fast`)

---

## Bug Fixes

- [x] ~~Fix theme switch button overlapping other header buttons~~ *(completed 2026-02-02, BUG-001)*

---

## Technical Debt

- [ ] Add automated link checking
- [x] ~~Set up Lighthouse CI~~ *(completed 2026-03-11, CHALLENGE-001)*
- [ ] Create development build script
- [x] ~~Add CSS linting (Stylelint)~~ *(completed 2026-02-16, TEST-003)*

---

## Ideas from Portfolio Rebuild (2026-01-20)

_Extracted from implementation plan:_

- Add project screenshots/thumbnails
- Create dedicated project detail pages
- Add blog section
- Implement contact form
- Add resume PDF download

---

*Last updated: 2026-01-27*

---

## From SEO-006: Social Card Preview Testing (2026-02-13)
**Origin**: docs/archive/plans/2026-02-13_seo-006-social-card-preview-testing.md

- [x] ~~Automated OG validation in CI~~ *(completed 2026-03-12, TEST-006 — 30 Playwright tests validating OG, Twitter Card, Core SEO, JSON-LD, and cross-tag consistency)*
- [ ] Facebook Sharing Debugger validation — Use official Facebook tool (requires account) for authoritative cache-clear and preview validation

---

## From TEST-006: Automated OG Meta Tag Validation (2026-03-12)
**Origin**: docs/archive/plans/2026-03-12_test-006-og-meta-validation.md

- [ ] 404.html negative test — Add test verifying 404.html intentionally omits OG/Twitter/JSON-LD tags (catches accidental addition)
- [ ] OG image HTTP validation — Test that `og:image` URL returns HTTP 200 with correct Content-Type (requires network request in test)
- [ ] Add symmetric null guards in cross-tag consistency tests — Only OG values are guarded with `not.toBeNull()`; add matching guards for Twitter tag values to produce clearer error messages when a Twitter tag is missing (code review finding, confidence 65/100)
- [ ] Add JSON-LD script tag existence guard in `getGraph()` — `JSON.parse(null)` produces cryptic TypeError; add `expect(raw).toBeTruthy()` before parsing for clearer failure when script tag is missing (code review finding, confidence 62/100)
- [ ] Add `toBeDefined()` guards to Person/WebSite sub-tests — 5 Person tests and 1 WebSite test access `graph.find()` result without null guard; produces `TypeError` instead of clean assertion failure if schema type is removed (code review finding, confidence 45/100)
- [ ] Add `.first()` to JSON-LD locator in `getGraph()` — `page.locator('script[type="application/ld+json"]').textContent()` throws strict mode violation if a second LD+JSON tag is ever added; defensive `.first()` would produce clearer behavior (code review finding, confidence 35/100)

---

## From TEST-003: CSS Linting with Stylelint (2026-02-16)
**Origin**: docs/archive/plans/2026-02-16_test-003-css-linting-stylelint.md

- [ ] Add `stylelint-order` plugin — Enforce consistent CSS property ordering within declarations (requires team agreement on ordering convention)
- [x] ~~Pre-commit hook integration~~ *(completed 2026-02-17, QUALITY-004)*
- [ ] VS Code Stylelint extension — Document recommended Stylelint VS Code extension settings for real-time linting feedback during development

---

## From PERF-006: Inline Critical CSS (2026-02-16)
**Origin**: docs/planning/plans/2026-02-16_perf-006-inline-critical-css.md

- [ ] Reduce inline CSS size — index.html at 16.1 KB exceeds 14 KB TCP slow-start guideline. Investigate Critters config or manual exclusions to reduce critical CSS extraction scope.
- [ ] Upstream CSS custom property extraction — Critters doesn't extract `[data-theme=light]{--var:val}` blocks. Consider contributing fix or using PostCSS API for more precise extraction.
- [ ] Automated inline CSS size regression — Add build step or test that fails if inline CSS exceeds threshold (e.g., 20 KB) to prevent size creep over time.
- [ ] Add `.catch()` to top-level async call — `inlineCriticalCSS()` in `scripts/inline-css.js` is called without `.catch()` handler; function body has try-catch with `process.exit(1)` so low risk, but adding `.catch()` follows Node.js best practice for top-level async (code review finding, confidence 25/100)
- [ ] Robust CSS block matching regex — `css.match(/\[data-theme=light\]\{[^}]+\}/)` in `inline-css.js` could truncate if future CSS contains `}` inside data URIs; consider balanced-brace parsing or PostCSS API (code review finding, confidence 25/100)
- [ ] Handle multiple `<style>` tags — `inline-css.js` assumes single `<style>` tag for light theme injection and size validation; if Critters ever produces multiple blocks, injection targets wrong location (code review finding, confidence 25/100)

---

## From QUALITY-004: Pre-commit Hook with Husky (2026-02-17)
**Origin**: docs/archive/plans/2026-02-17_quality-004-pre-commit-hook-husky.md

- [x] ~~Extend lint-staged with ESLint~~ *(completed 2026-03-12, QUALITY-007 — `"*.js": "eslint --fix"` added to lint-staged)*
- [ ] Extend lint-staged with Prettier — Add `"*.html": "prettier --write"` when HTML formatting is adopted
- [ ] commitlint for conventional commits — Add `@commitlint/cli` with `commit-msg` husky hook to enforce conventional commit message format (feat:, fix:, docs:, etc.)

---

## From TEST-005: Reduced Motion Accessibility Test (2026-02-24)
**Origin**: TEST-005 implementation

- [ ] Hover state test for non-reduced-motion mode — Verify `.filter-btn:hover` styles don't visually conflict with `.filter-btn--active` styles in standard motion mode (the specificity fix ensures correctness, but no explicit hover-state test exists)
- [ ] Reduced motion + filter animation interruption — Test rapid filter clicks under reduced motion to verify instant state changes don't cause stale classes (combines rapid-clicks.spec.js scope with reduced motion)
- [ ] Scroll animation visibility under reduced motion — Verify `IntersectionObserver` early-exit path doesn't leave stale observers or prevent `.is-visible` from being set on dynamically-added content
- [ ] Fix specificity comment in `.filter-btn.filter-btn--active` — Comment claims `.filter-btn:hover` is `(0,1,1)` but it's actually `(0,2,0)` (class + pseudo-class); the double-class fix wins by cascade order, not higher specificity as documented (code review finding, confidence 75/100)

---

## From SEO-007: Automate Sitemap lastmod Updates (2026-03-05)
**Origin**: SEO-007 code review

- [ ] Targeted `fetch-depth` for build job — `fetch-depth: 0` clones full history but adds CI time; consider `fetch-depth: 2` or a calculated depth sufficient for `git log -- index.html` accuracy (code review finding, confidence 50/100)
- [ ] Named npm script for `update-sitemap` — Build sequence in CLAUDE.md lists `update-sitemap` alongside named scripts (`build:css`, `unhash`, etc.) but `package.json` uses inline `node scripts/update-sitemap.js &&`; adding a named script would match the established pattern
- [ ] CLAUDE.md build job artifact list inconsistency — "Build job" line still reads `(index.html, 404.html, dist/)` but "Artifact" line was updated to include `sitemap.xml`; both lines describe the same artifact contents

---

## From QUALITY-005: Audit Remaining transition:all Usage (2026-03-05)
**Origin**: docs/archive/plans/2026-03-05_quality-005-transition-all-audit.md

- [x] ~~Stylelint rule to prevent `transition: all`~~ *(completed 2026-03-12, QUALITY-008 — `declaration-property-value-disallowed-list` rule added for both `transition` and `transition-property`)*
- [x] ~~Document "no transition: all" convention~~ *(completed 2026-03-12, QUALITY-008 — added to CLAUDE.md CSS Linting section and Build System Pattern)*

---

## From QUALITY-008: Stylelint Rule to Prevent transition:all (2026-03-12)
**Origin**: QUALITY-008 implementation

- [ ] Redundant `.contact__link` transition — `components.css` line 279 transitions only `background-color`, but `main.css` theme group already covers `.contact__link` with `background-color + border-color + color + outline-color`; the component-level declaration may be redundant (code review finding)
- [ ] Case-insensitive transition regex — Current `/\ball\b/` is case-sensitive; `transition: All` would bypass. Mitigated by `value-keyword-case: "lower"` from `stylelint-config-standard`, but adding `/i` flag (`/\ball\b/i`) would provide defense-in-depth

---

## From PERF-008: Build Size Reporting (2026-02-25)
**Origin**: PERF-008 implementation

- [ ] Size trend history — Append build sizes to `docs/size-history.json` after each build for historical trend visibility (original task description goal: "visibility into asset growth over time")
- [ ] HTML size reporting — Add `index.html` and `404.html` to the size report (both contain ~16 KB and ~8 KB inlined critical CSS respectively); complements existing inline CSS warnings
- [ ] CI budget enforcement — Make the build fail (exit code 1) if gzip budgets are exceeded in CI, rather than just warning; keep soft warnings for local development
- [ ] Extract shared `HASH_LENGTH` constant — `report-sizes.js` and `hash-assets.js` both hardcode `HASH_LENGTH = 8` independently; extract to a shared `scripts/config.js` module to eliminate silent drift risk (code review finding, confidence 72/100)

---

## From CHALLENGE-001: Lighthouse CI in GitHub Actions (2026-03-11)
**Origin**: CHALLENGE-001 implementation

- [ ] Mobile Lighthouse preset option — Add `npm run lighthouse:mobile` script with `preset: "perf"` (mobile) for occasional mobile performance audits alongside the desktop CI gate
- [ ] Lighthouse score trend tracking — Log per-category scores to `docs/lighthouse-history.json` after each CI run for historical regression visibility (mirrors `size-history.json` idea from PERF-008)
- [ ] Explicit Chrome install in lighthouse CI job — Lighthouse job relies on pre-installed Chrome on `ubuntu-latest` runner; adding explicit `npx playwright install --with-deps chromium` or similar would make it resilient to runner image changes (code review finding, confidence 50/100)
- [ ] Fix `.gitignore` missing trailing newline — File lacks trailing newline after `.lighthouseci/` entry; pre-existing issue carried forward (code review finding, confidence 0/100)

---

## From CI-002: Narrow Pages Deploy Artifact Path (2026-03-11)
**Origin**: CI-002 implementation

- [ ] Skip checkout in deploy job — All static assets (fonts/, images/, favicon files, robots.txt, site.webmanifest, og-image.png, PWA icons) could be added to the build-output artifact in the build job, eliminating the checkout step in deploy entirely (checkout is the slowest step in the job)
- [ ] Validate staged `_site/` contents — Add a CI step after staging that asserts expected files exist before upload (e.g., index.html, 404.html, hashed dist/ files, fonts/) — catches accidental glob mismatches silently failing
- [ ] Update CLAUDE.md deploy step description to include `404.webp` — CLAUDE.md line 414 lists staged files as "HTML, favicon, OG image, manifest, robots.txt, sitemap.xml, dist/, fonts/, images/" but omits `404.webp`; surfaced during code review

---

## From QUALITY-007: ESLint Integration (2026-03-12)
**Origin**: docs/archive/plans/2026-03-12_quality-007-eslint.md

- [ ] Add `eslint-plugin-playwright` — Playwright-specific rules for test files (e.g., `no-conditional-in-test`, `prefer-web-first-assertions`)
- [ ] Add `no-console` rule for browser code — `warn` level for `js/**/*.js` to catch accidental console.log in production code
- [ ] Investigate flaky Firefox rapid-clicks test — `rapid-clicks.spec.js:25` intermittently fails on Firefox; timing-sensitive mid-exit animation assertion (pre-existing)

---

## From QUALITY-007 Code Review (2026-03-12)
**Origin**: PR #41 code review findings (confidence 75/100)

- [ ] Remove stale plan copy `docs/planning/plans/2026-03-12_quality-007-eslint.md` — archived version exists in `docs/archive/plans/`, the in-progress copy should have been deleted per task completion workflow (`mv`, not `cp`)
- [ ] Fix `9b.` numbering in CLAUDE.md Build System Pattern list — should use sequential integers (renumber items 10-12 to 11-13, insert new JS linting item as 10)
- [ ] Update deploy job description in CLAUDE.md — current text includes CI-002 staging details that were bundled into QUALITY-007 PR rather than committed separately

---

## CI: Upgrade GitHub Actions to Node.js 24 (2026-03-12)
**Origin**: CI deprecation warning observed in run #22980966380

- [ ] Upgrade all GitHub Actions to Node.js 24-compatible versions before June 2, 2026 deadline — affected actions: `actions/checkout@v4`, `actions/setup-node@v4`, `actions/upload-artifact@v4`, `actions/download-artifact@v4`, `actions/configure-pages@v4`, `actions/deploy-pages@v4`; check latest major versions for Node.js 24 support or set `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24=true` env var to opt in early

---

## Build Size Trend Enhancements (2026-03-18)
**Origin**: docs/archive/plans/2026-03-18_perf-009-build-size-trend-history.md

- [ ] Size trend visualization — CLI script to print text-based trend chart from `docs/size-history.json` (sparkline or percentage change)
- [ ] Budget trend alerts — warn when gzip sizes increase over N consecutive entries, catching gradual bloat before hard budget limit
- [ ] CI size comparison — compare current build sizes against last committed entry and annotate PRs with delta (e.g., "CSS +0.2 KB, JS -0.1 KB")

---

## From CHALLENGE-002: Project Detail Modal (2026-03-19)
**Origin**: CHALLENGE-002 implementation

- [x] Axe-core WCAG scan for modal — Add axe-core accessibility scanning to the modal tests (light and dark themes, modal-open state) to catch contrast and ARIA violations automatically *(completed 2026-03-19, TEST-007)*
- [x] ~~Populate remaining project cards with detail data~~ *(completed 2026-03-20, CONTENT-001)*
- [ ] Modal keyboard shortcut hint — Show a subtle "press ESC to close" hint in the modal footer for keyboard users who may not discover the shortcut
- [ ] Screenshot lazy-load placeholder — Add a skeleton/placeholder element shown while lazy-loaded screenshots are loading to improve perceived performance on slow connections
- [ ] Filter + modal hash coexistence — Investigate and test combined URL hash state (e.g., `#filter=backend&project=rating-bot`) so both filter and modal can be restored from a single shareable URL

---

## From TEST-007: Axe-core WCAG Scan for Modal (2026-03-19)
**Origin**: Code review of PR #46

- [ ] Reduced motion test efficiency — `modal/axe-scan.spec.js` reduced-motion `beforeEach` reassigns `mp` and calls `goto()` redundantly (outer `beforeEach` already does this); remove the double navigation to save ~1s per test
- [ ] Skip `waitForScrollAnimations()` under reduced motion — When `prefers-reduced-motion` is active, scroll animations are disabled and elements appear immediately at opacity 1; the 700ms wait is unnecessary (filter reduced-motion tests already skip it)
- [ ] Normalize axe-helper API — `checkAccessibility()` accepts `include` as a single CSS selector string but `exclude` as an array of strings; align both to accept the same type for consistency

---

## From CONTENT-001: Populate Remaining Project Cards (2026-03-20)
**Origin**: CONTENT-001 implementation

- [ ] Capture detail screenshots for 4 new projects — lubrication, hx711-scale, dropshipping, svg-processor all have `screenshots: []` in `data/projects.json`; need 2 detail screenshots each (matching existing projects' pattern)
- [ ] Verify dropshipping project description accuracy — Description references Next.js 14 App Router, BullMQ, Stripe, 249 unit tests based on repo README; should be validated against actual codebase state

---

## Notes

~~**GitHub Profile README**: Consider updating [GoodAlex223/GoodAlex223](https://github.com/GoodAlex223/GoodAlex223) repository README to mention AI-assisted development workflows.~~ **DONE** (2026-01-20) - Updated with professional overview, tech stack, featured projects, and AI-assisted development mention.
