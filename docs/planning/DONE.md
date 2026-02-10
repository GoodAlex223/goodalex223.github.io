# DONE

**Last Updated**: 2026-02-10 (SEO-005 completed)

Completed tasks for the portfolio project.

---

## 2026-02-10

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
