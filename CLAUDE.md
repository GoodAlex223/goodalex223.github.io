# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

<!-- AUTO-MANAGED: project-description -->
## Overview

**Personal Portfolio Website** for Alexey Minakov — a static site showcasing software development projects.

- **Live Site**: [goodalex223.github.io](https://goodalex223.github.io)
- **Tech Stack**: HTML5, CSS3 (Custom Properties, Grid, Flexbox), ES6+
- **Build Tools**: PostCSS (CSS bundling), Critters (critical CSS inlining)
- **Hosting**: GitHub Pages (deploys via GitHub Actions)

<!-- END AUTO-MANAGED -->

<!-- AUTO-MANAGED: build-commands -->
## Build & Development Commands

```bash
# Install dependencies
npm install

# Lint CSS (check for style violations)
npm run lint:css

# Lint CSS and auto-fix issues
npm run lint:css:fix

# Build CSS with cache-busting (bundles + minifies + content hash)
npm run build

# Build CSS and watch for changes (unminified, no hashing)
npm run watch

# Run end-to-end tests (headless)
npm test

# Run tests with UI mode
npm run test:ui

# Run tests with visible browser
npm run test:headed

# Start local server (Python)
python -m http.server 8000

# Start local server (Node)
npx serve
```

**Build System**: PostCSS with `postcss-import` plugin bundles modular CSS files, then cssnano minifies (production only). Production builds (`npm run build`) run: `build:css` → `unhash` → `inline:css` → `hash:assets`. This generates content-hashed filenames (`dist/style.[hash].css`, `dist/main.[hash].js`) with critical CSS inlined in HTML. JS is minified by terser during the hash step. Watch mode (`npm run watch`) outputs unminified `dist/style.css` for debugging (restores HTML to non-inlined state).

**Critical CSS Inlining**: `scripts/inline-css.js` uses Google's Critters library to extract above-the-fold CSS and inline it in `<style>` tags in `<head>`. Full CSS loads asynchronously via `media="print" onload="this.media='all'"` pattern. Includes `<noscript>` fallback for non-JS users, light theme variable injection, and `--restore` mode for development. Applied to both `index.html` and `404.html`.

**Cache-Busting**: `scripts/hash-assets.js` computes SHA-256 hashes of built CSS and JS, renames files to `style.[hash].css` and `main.[hash].js` in `dist/`, and updates HTML references in `index.html` and `404.html`. JS is minified by terser before hashing. Watch mode unhashes references for easier development.

**Testing**: Playwright end-to-end tests validate filter functionality, animations, accessibility, keyboard navigation, and URL hash integration. Test server (`scripts/serve.js`) runs on port 4173. Tests use Page Object Model pattern (`FilterPage.js`) and timing utilities that read CSS custom properties.

**CSS Linting**: Stylelint validates CSS code style and conventions. Configured via `.stylelintrc.json` with BEM naming enforcement, kebab-case for custom properties, and modern color notation. Linting runs locally (`npm run lint:css`) and in CI pipeline before build.

**Deployment**: Automatic via GitHub Actions on push to `main` branch. Workflow runs lint → build → test → deploy sequence. Linting and tests must pass before deployment proceeds.

<!-- END AUTO-MANAGED -->

<!-- AUTO-MANAGED: architecture -->
## Architecture

```
goodalex223/
├── index.html              # Main portfolio page (single-page site)
├── 404.html                # Custom 404 error page
├── robots.txt              # Search engine crawler rules
├── sitemap.xml             # XML sitemap for search engines
├── site.webmanifest        # PWA manifest (app name, icons, theme colors)
├── package.json            # NPM dependencies and build scripts
├── postcss.config.js       # PostCSS configuration (postcss-import plugin)
├── .stylelintrc.json       # Stylelint configuration (CSS linting rules)
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions CI/CD pipeline
├── css/
│   ├── main.css            # Entry point, imports + layout styles
│   ├── fonts.css           # @font-face declarations for Inter
│   ├── variables.css       # Design tokens (colors, spacing, typography)
│   ├── reset.css           # Browser normalization
│   ├── utilities.css       # Reusable utility classes
│   └── components.css      # UI components (cards, buttons, links)
├── dist/
│   ├── style.[hash].css    # Built CSS with content hash (generated, not committed)
│   └── main.[hash].js      # Minified JS with content hash (generated, not committed)
├── scripts/
│   ├── hash-assets.js      # Cache-busting: minify JS (terser), hash CSS+JS, update HTML refs
│   ├── inline-css.js       # Critical CSS inlining via Critters (--restore for dev mode)
│   └── serve.js            # Minimal static file server for Playwright tests (port 4173)
├── js/
│   └── main.js             # Theme toggle, project filtering, scroll animations, copyright year
├── tests/
│   ├── filter/             # Filter functionality test suites
│   │   ├── basic-filtering.spec.js    # Category filtering validation
│   │   ├── toggle-behavior.spec.js    # Toggle-to-reset behavior
│   │   ├── url-hash.spec.js           # URL hash integration
│   │   ├── animation-states.spec.js   # Animation choreography
│   │   ├── keyboard-nav.spec.js       # Keyboard navigation (roving tabindex)
│   │   ├── accessibility.spec.js      # ARIA attributes, live regions
│   │   ├── rapid-clicks.spec.js       # Rapid interaction handling
│   │   └── axe-scan.spec.js           # WCAG 2.1 AA accessibility scanning (axe-core)
│   ├── pages/
│   │   └── FilterPage.js   # Page Object Model for filter system
│   └── utils/
│       ├── timing.js       # Animation timing utilities (reads CSS variables)
│       └── axe-helper.js   # Accessibility testing utilities (axe-core integration)
├── fonts/
│   ├── inter-latin.woff2     # Self-hosted Inter font (Latin subset)
│   └── inter-latin-ext.woff2 # Self-hosted Inter font (Latin Extended subset)
├── docs/                   # Project documentation
├── freecodecamp/           # Learning projects (FreeCodeCamp)
├── frontendmentor/         # Learning projects (Frontend Mentor)
├── MDN/                    # Learning projects (MDN tutorials)
└── other/                  # Miscellaneous experiments
```

**Key Files**:
- [index.html](index.html) — Main portfolio page (loads `dist/style.[hash].css`)
- [css/main.css](css/main.css) — CSS source entry point (uses `@import`)
- [css/variables.css](css/variables.css) — Design tokens
- [package.json](package.json) — Build scripts (`npm run build`, `npm run watch`, `npm test`)
- [postcss.config.js](postcss.config.js) — PostCSS build configuration
- [playwright.config.js](playwright.config.js) — Playwright test configuration
- [scripts/hash-assets.js](scripts/hash-assets.js) — Cache-busting: minify JS + hash CSS/JS
- [scripts/inline-css.js](scripts/inline-css.js) — Critical CSS inlining (Critters wrapper)
- [scripts/serve.js](scripts/serve.js) — Test server (port 4173)
- [.stylelintrc.json](.stylelintrc.json) — CSS linting configuration
- [.github/workflows/deploy.yml](.github/workflows/deploy.yml) — CI/CD deployment workflow (lint → build → test → deploy)
- [tests/pages/FilterPage.js](tests/pages/FilterPage.js) — Page Object Model for tests
- [docs/SEO_TESTING.md](docs/SEO_TESTING.md) — Social card & SEO validation checklist
- [robots.txt](robots.txt) — Search engine crawler directives
- [sitemap.xml](sitemap.xml) — Site structure for SEO
- [site.webmanifest](site.webmanifest) — PWA manifest (app name, icons, theme colors)
- [PROJECT.md](PROJECT.md) — Project configuration

<!-- END AUTO-MANAGED -->

<!-- AUTO-MANAGED: conventions -->
## Code Conventions

### CSS Naming
| Element | Convention | Example |
|---------|------------|---------|
| Classes | BEM-like (enforced by Stylelint) | `.project-card__title`, `.btn--primary` |
| Variables | kebab-case (enforced by Stylelint) | `--color-accent`, `--space-4` |
| Keyframes | kebab-case (enforced by Stylelint) | `@keyframes fade-in` |
| Data attributes | kebab-case | `data-category="backend"`, `data-animate`, `data-animate-delay="50"`, `data-updated="2026-01"`, `data-status="active"` |

**CSS Linting**: Stylelint enforces naming conventions and code quality via `.stylelintrc.json`:
- BEM naming pattern: `block__element--modifier` or state classes `is-*`
- Custom properties must be kebab-case
- Modern color functions (`rgb()`, `hsl()`) with numeric alpha values
- Allows specific vendor prefixes: `-webkit-font-smoothing`, `-moz-osx-font-smoothing`, `-webkit-text-size-adjust`
- Ignores `dist/` directory (generated files)

### CSS Architecture
CSS source files use `@import` in `css/main.css`, bundled by PostCSS into `dist/style.css`:
1. `fonts.css` — @font-face declarations for Inter
2. `variables.css` — Design tokens
3. `reset.css` — Browser normalization
4. `utilities.css` — Utility classes
5. `components.css` — UI components
6. `main.css` — Layout and section styles

**Build Process**: PostCSS with `postcss-import` plugin resolves all `@import` statements, then cssnano minifies in production builds (`--env production`). Outputs single bundled file to `dist/style.css`. HTML files reference the built file, not source files.

### HTML Structure
- Semantic elements: `<article>`, `<section>`, `<nav>`, `<header>`, `<footer>`
- Skip link for accessibility
- Inline SVG icons for styling flexibility
- **Favicon configuration**: Multi-format favicon setup in `<head>`
  - PNG: `favicon-96x96.png` (96x96, standard)
  - SVG: `favicon.svg` (vector, scalable)
  - ICO: `favicon.ico` (legacy fallback)
  - Apple: `apple-touch-icon.png` (180x180, iOS home screen)
  - Manifest: `<link rel="manifest" href="/site.webmanifest">` (PWA icons)
  - Applied to both `index.html` and `404.html`
- **PWA Manifest** (`site.webmanifest`):
  - App name: "Alexey Minakov | Software Developer"
  - Short name: "AM Portfolio"
  - Maskable icons: 192x192 and 512x512 PNG
  - Theme/background colors: `#ffffff` (light theme)
  - Display mode: `standalone` (app-like experience)
- **Font preloading**: `<link rel="preload">` for critical fonts (Inter variants) in `<head>`
  - Preloads `fonts/inter-latin.woff2` and `fonts/inter-latin-ext.woff2`
  - Uses `type="font/woff2"` and `crossorigin` attribute
  - Reduces render-blocking and improves LCP (Largest Contentful Paint)
- **Search engine verification**: Google Search Console and Bing Webmaster Tools configured
  - `<meta name="google-site-verification" content="6ADLbi4pyMeQya11o0tJUq0Bb6ydv4GnJw1oLICjY0M" />`
  - Bing verified via GSC import (no separate meta tag — auto-verified)
  - Sitemaps submitted to both Google and Bing

### Theme System
- **Data attribute**: `data-theme="light"` or `data-theme="dark"` on `<html>`
- **Theme variables**: Defined in `variables.css` with fallback to `prefers-color-scheme`
- **Persistence**: User preference stored in `localStorage.theme`
- **Initialization**: Inline script in `<head>` prevents FOUC (Flash of Unstyled Content)
- **Dynamic meta**: Updates `theme-color` meta tag for mobile browser chrome
- **System sync**: Listens for system preference changes when no explicit user choice

### Focus Accessibility
Standardized focus indicators for WCAG 2.4.7 compliance:
- **CSS Variables**: `--focus-outline-width` (2px), `--focus-outline-offset` (2px), `--focus-outline-color`, `--focus-outline-color-high-contrast`
- **Theme-aware colors**: Light theme uses dark outline (`rgba(15, 15, 35, 0.9)`), dark theme uses light outline (`rgba(255, 255, 255, 0.9)`)
- **Standard focus**: Applied to all links and buttons via `reset.css`
- **High-contrast focus**: Applied to elements with colored backgrounds (primary buttons, active filter buttons)
  - Ensures sufficient contrast when background is accent color
  - Uses `--focus-outline-color-high-contrast` variable
- **Focus transition**: Subtle 150ms fade-in/fade-out for focus outlines
  - Base: permanent transparent outline on all `a` and `button` elements in `reset.css`
  - Transition: `outline-color var(--transition-fast)` added to base and all component transitions
  - `:focus-visible` rules change only `outline-color` (not full `outline` shorthand)
  - Components with own `transition` declarations include `outline-color` explicitly (CSS `transition` property replaces, not merges)
  - `.btn` uses explicit transition properties (not `transition: all`) to prevent unintended side effects
  - `.btn` excluded from `main.css` theme transition group — component-level transition takes precedence
  - Disabled automatically by `prefers-reduced-motion: reduce` global rule in `main.css`
- **Skip link**: Uses `:focus` (not `:focus-visible`) for positioning to work with all focus types

### Color Contrast (WCAG AA)
All text colors meet WCAG 2.1 Level AA contrast requirements (4.5:1 for normal text, 3:1 for large text):
- **Light theme fixes** (discovered via axe-core testing):
  - `--color-text-muted`: `#5c636a` (was `#868e96`) — muted text on light backgrounds
  - `--color-category-backend`: `#256b28` (was `#2e7d32`) — backend badge text
  - `--color-status-active`: `#256b28` (was `#2e7d32`) — active status indicator text
  - `--color-category-iot`: `#b94000` (was `#e65100`) — IoT badge text + active button background
- **Dark theme fix**: `--color-text-muted`: `#8a8a8a` (was `#6b6b6b`) — muted text on dark backgrounds
- **Validation**: All color pairs tested via automated axe-core scanning in `axe-scan.spec.js` — both light and dark themes tested explicitly via `fp.setTheme()`
- **Testing note**: Axe-scan suite explicitly sets `data-theme` for both light and dark before scanning; avoids relying on browser default theme which would miss cross-theme violations

<!-- END AUTO-MANAGED -->

<!-- AUTO-MANAGED: patterns -->
## Detected Patterns

### Responsive Design
- **Mobile-first**: Base styles for mobile, `min-width` media queries for larger screens
- **Breakpoints**: 37.5em (600px), 56.25em (900px), 75em (1200px)

### Component Patterns
- **Project Cards**: Use `data-category` attribute for styling (backend, iot, web, tools)
  - Support thumbnails: `.project-card__thumbnail` with hover scale effect
  - Missing images handled gracefully with `display: none`
  - Filterable via category with fade-then-reflow animation
  - **Metadata footer**: `.project-card__footer` with last-updated date and optional status badge
    - Dates use `<time datetime="YYYY-MM">` for semantics, stored as `data-updated` on card
    - Active projects use `data-status="active"` with pulsing dot indicator
    - Status badge: `.project-card__status` with `.project-card__status-dot` (CSS pulse animation)
    - Footer uses explicit `margin-top: var(--space-4)` spacing (card is flex column, but `auto` margins don't work in CSS columns layout)
    - Status colors: `--color-status-active` / `--color-status-active-bg` (theme-aware)
- **Buttons**: `.btn` base class with `--primary` and `--secondary` modifiers
  - Primary buttons use high-contrast focus outline (colored background requires stronger contrast)
- **Filter Buttons**: `.filter-btn` for project filtering
  - Active state: `.filter-btn--active` with category-colored backgrounds
  - Active buttons use high-contrast focus outline (colored background requires stronger contrast)
  - Category colors match project card badges (backend, iot, web, tools)
  - **Project counts**: Dynamic counts injected into button labels (e.g., "Backend (3)")
    - Calculated on init via `calculateCategoryCounts()` and `updateButtonLabels()`
    - Preserves original casing (e.g., "IoT" not "iot")
    - Count wrapped in `<span aria-hidden="true">` to prevent double announcement
    - Screen readers read only the `aria-label` ("Backend, 3 projects")
  - ARIA attributes: `aria-pressed` for screen readers, `role="toolbar"` on container
  - Single-select with toggle-to-reset behavior (clicking active filter resets to "all")
  - **Roving tabindex**: Only one button has `tabindex="0"` at a time (WCAG pattern)
  - **Keyboard navigation**: Arrow keys, Home, End to navigate filter buttons
  - **Live region**: `#filter-status` with `aria-live="polite"` announces filter results to screen readers
    - Announced immediately before animations (not delayed until after)
    - Grammar: "Showing all 7 projects" or "Showing 3 IoT projects" (preserves button text casing)
- **Theme Toggle**: `.theme-toggle` button with icon transitions (sun/moon)
  - Icons swap via opacity/transform based on `[data-theme]` attribute
  - Updates `aria-label` dynamically for accessibility
- **Accessibility**:
  - `prefers-reduced-motion` media query for animation control
  - Standardized focus indicators on all interactive elements (links, buttons)
  - High-contrast focus outlines on colored backgrounds
  - ARIA labels for screen reader support
  - Screen reader-only content: `.sr-only` utility class (uses `clip-path: inset(50%)` for modern browser support)

### Theme System Pattern
Light/dark theme implementation:
1. **CSS Variables**: Dual color schemes in `variables.css`
2. **System Preference**: Fallback to `@media (prefers-color-scheme: light)`
3. **User Override**: `localStorage.theme` persists explicit choice
4. **FOUC Prevention**: Inline `<script>` in `<head>` (before CSS) applies theme immediately
5. **Toggle Button**: `.theme-toggle` in header with smooth icon transitions
6. **Mobile Chrome**: Dynamic `theme-color` meta updates match current theme
7. **System Sync**: Auto-switches theme when system preference changes (no saved preference)

### Project Filtering Pattern
Client-side category filtering with subtle staggered animations:
1. **Filter Buttons**: `.filter-btn` with `data-filter` attribute (all, backend, iot, web, tools)
2. **Active State**: Single-select with `.filter-btn--active` class, category-colored backgrounds
3. **Animation**: Subtle fade + scale with stagger
   - **Exit animation**: `.project-card.project-card--filtering-out`
     - ALL visible cards exit first (including cards that remain visible after filter)
     - Fade out + subtle scale down (0.92)
     - Purpose: Prevents CSS columns layout jump when cards instantly appear during reflow
   - **Entrance animation**: `.project-card.project-card--filtering-in` → `.is-filtering`
     - Start: opacity 0, scale 0.92, translateY(12px), `transition: none` (prevents [data-animate] from animating setup state)
     - End: opacity 1, scale 1, translateY(0)
     - Triggered after exit completes and layout settles
   - **Timing**: 350ms duration, 30ms stagger delay, cubic-bezier(0.16, 1, 0.3, 1) easing
   - **CSS Variables**: `--filter-animation-duration`, `--filter-stagger-delay`, `--filter-easing` in `variables.css`
   - **Final state**: `.project-card--hidden` uses `position: absolute` + `visibility: hidden` (removes from layout)
   - **Reduced motion**: Animations disabled when `prefers-reduced-motion: reduce` is active
   - **CSS Specificity**: Filter selectors use double class (`.project-card.project-card--filtering-out`) to beat attribute selector `[data-animate]`
   - **CSS Cascade Order**: Filter animations section placed AFTER scroll animations in `components.css` (equal-specificity selectors win by cascade order)
   - **CSS Specificity Documentation**: Inline comment block in `components.css` documents specificity hierarchy between scroll and filter animation systems (prevents future reordering issues)
   - **Choreography**: Exit → layout settle → entrance (prevents layout thrashing in CSS columns)
   - **Forced Reflow**: `void card.offsetHeight` forces style recalc before entrance (cleaner than double rAF)
   - **State Preservation**: `.is-visible` class added after filter cleanup prevents [data-animate] from reverting to opacity: 0
   - **Animation Guard**: Skip animation if no cards need visibility change (prevents unnecessary work)
4. **Toggle Behavior**: Clicking active category filter resets to "all"
5. **URL Hash Integration**: Shareable filter links with browser history support
   - **URL Format**: `#filter=backend`, `#filter=iot`, `#filter=web`, `#filter=tools`
   - **Clean URLs**: Hash removed when filter is "all" (default state)
   - **Validation**: Invalid category hashes fallback to "all" (regex: `/^#filter=([a-z]+)$/`)
   - **Browser Navigation**: Back/forward buttons work via `popstate` event listener
   - **Page Load**: Initial filter applied from hash on page load
   - **History API**: Uses `history.pushState()` for navigation without page reload
   - **Implementation**: `activateFilter()`, `resetFilter()`, `getCategoryFromHash()`, `updateHash()`, `applyHashFilter()` functions
   - **Focus behavior**: Only moves focus to active button if user is already navigating toolbar (prevents jarring focus jumps on page load/browser navigation)
6. **Accessibility**: WCAG-compliant keyboard and screen reader support
   - `aria-pressed` attributes for button state
   - `role="toolbar"` on filter container
   - **Roving tabindex pattern**: Only one button has `tabindex="0"`, others `tabindex="-1"`
   - **Keyboard navigation**: Arrow keys (left/right/up/down) cycle through buttons, Home/End jump to first/last, Escape resets to "all"
   - **Live region**: `#filter-status` with `aria-live="polite"` announces results immediately before animations
     - Grammar: "Showing all 7 projects" (all) or "Showing 3 IoT projects" (specific category)
     - Display label extracted from button text to preserve casing (e.g., "IoT" not "iot")
     - Count passed as parameter (`cardsToShow.length`) — what WILL be visible, not current DOM state
   - **Focus management**: `setActiveButton()` calls `updateTabindex()` to sync tabindex with active state; toggle-to-reset explicitly moves focus to "all" button
   - **Escape key reset**: Pressing Escape while filter button has focus resets to "all" (guard clause: only if `currentFilter !== "all"`)

### Scroll Animation Pattern
Progressive reveal animations using Intersection Observer:
1. **HTML Markup**: Add `data-animate` attribute to elements that should animate on scroll
   - Optional stagger: `data-animate-delay="50"` (milliseconds)
2. **CSS States**:
   - Base state: `[data-animate]` with `opacity: 0` and `translateY(24px)`
   - Visible state: `.is-visible` class added when element enters viewport
   - Smooth cubic-bezier transition (400ms)
   - **Specificity handling**: Elements with existing transitions (`.project-card`, `.skill-group`) use combined transition declarations to preserve both theme transitions (background-color, border-color, color) and scroll animation transitions (opacity, transform)
3. **JavaScript**:
   - `IntersectionObserver` with 10% threshold, triggers 50px before viewport
   - Double `requestAnimationFrame` ensures initial hidden state paints before observing
   - Skips elements with `.project-card--hidden` (filtered out)
   - Unobserves after animation for performance
4. **Accessibility**: `@media (prefers-reduced-motion: reduce)` shows elements immediately without animation
5. **Usage**: Applied to hero elements, section titles, project cards, skill groups, contact links

### Build System Pattern
**PostCSS CSS Bundling with Critical CSS Inlining and Cache-Busting**: Modular CSS development with production bundling, critical CSS inlining, minification, and content-hashed filenames
1. **Source**: Modular CSS files in `css/` directory with `@import` statements; JS in `js/main.js`
2. **Build Tool**: PostCSS with `postcss-import` plugin and `cssnano` (production only); terser for JS minification
3. **Output**: Content-hashed files at `dist/style.[hash].css` and `dist/main.[hash].js` (8-char SHA-256 hash)
4. **Minification**: CSS via cssnano (`--env production` flag in `postcss.config.js`); JS via terser (inline in `hash-assets.js`)
5. **Cache-Busting**: `scripts/hash-assets.js` post-build script (config-driven, handles CSS and JS)
   - CSS: reads `dist/style.css`, renames to `dist/style.[hash].css`
   - JS: reads `js/main.js`, minifies with terser, writes to `dist/main.[hash].js`
   - Updates HTML references in `index.html` and `404.html` via per-asset regex patterns
   - Cleans old hashed files from `dist/`
   - `--unhash` mode restores plain refs for watch mode (CSS → `dist/style.css`, JS → `js/main.js`)
6. **Critical CSS Inlining**: `scripts/inline-css.js` using Google's Critters
   - Extracts above-fold CSS and inlines in `<style>` tags in `<head>`
   - Full CSS loaded async via `media="print" onload="this.media='all'"` pattern
   - `<noscript>` fallback for non-JS users (clean link, no async attributes)
   - Post-processing fixes: noscript attributes, `data-critters-container` removal, `data-theme="light"` cleanup
   - Injects `[data-theme="light"]` variable overrides (critters misses CSS custom property blocks)
   - `--restore` mode removes all inline artifacts for development
   - Shared `cleanInlineArtifacts()` function ensures idempotency
   - Validates CSS file exists before processing, warns if critters produces no output
7. **Commands**:
   - `npm run build` — Production: `build:css` → `unhash` → `inline:css` → `hash:assets`
   - `npm run watch` — Development: restore inline CSS → unhash refs → PostCSS watch (unminified, no hashing)
8. **Watch Mode**: `--restore` removes inline CSS artifacts, `--unhash` restores `dist/style.css` and `js/main.js` references
9. **CSS Linting**: Stylelint validates CSS code quality and conventions
   - Configuration: `.stylelintrc.json` extends `stylelint-config-standard`
   - Enforces BEM naming, kebab-case for custom properties and keyframes
   - Requires modern color functions with numeric alpha values
   - Runs in CI before build step to catch style violations early
10. **CI/CD**: GitHub Actions workflow with lint → build → test → deploy sequence
    - Workflow: `.github/workflows/deploy.yml`
    - Build job: Node.js setup → `npm ci` → `npm run lint:css` → `npm run build` → artifact upload
    - Test job: Install Playwright browsers → `npm test` → report upload
    - Deploy job: Deploy to GitHub Pages (only if linting and tests pass)
    - Concurrency: Single pages deployment group, cancels in-progress runs
11. **HTML References**: Both `index.html` and `404.html` have inline `<style>` with critical CSS plus async `<link>` to `dist/style.[hash].css` (production) or normal `<link>` to `dist/style.css` (watch mode). JS: `<script src="dist/main.[hash].js">` (production) or `<script src="js/main.js">` (watch mode)
12. **Git Ignore**: `dist/`, `test-results/`, `playwright-report/` excluded from version control

### Testing Pattern
**Playwright End-to-End Tests**: Comprehensive test suite validating interactive features
1. **Framework**: Playwright with multi-browser testing (Chromium, Firefox, WebKit)
2. **Test Server**: Custom static server (`scripts/serve.js`) on port 4173
   - Serves project root with proper MIME types
   - Handles SPA routing (serves `index.html` for `/`)
   - Started automatically by Playwright via `webServer` config
3. **Page Object Model**: `FilterPage.js` encapsulates filter system interactions
   - Centralized locators for toolbar, buttons, cards, animation states
   - Helper methods: `clickFilter()`, `expectVisibleCardCount()`, `getActiveFilterCategory()`, `waitForScrollAnimations()`
   - Media & theme helpers: `enableReducedMotion()`, `setTheme(theme)` — `setTheme()` sets `data-theme` on `<html>` via `page.evaluate()` and waits 400ms for CSS transitions to settle
   - Category counts stored as constants (`CATEGORY_COUNTS`) for assertions
   - `waitForScrollAnimations()` waits 700ms for scroll-in animations to settle (prevents false axe-core failures)
4. **Timing Utilities**: `timing.js` reads animation durations from CSS custom properties
   - `getAnimationDuration()` — Reads `--filter-animation-duration` from `:root`
   - `waitForFilterAnimation()` — Calculates full animation cycle (exit + entrance + stagger + buffer)
   - Single source of truth: CSS variables, not hardcoded values
5. **Accessibility Testing**: `axe-helper.js` provides WCAG compliance scanning using `@axe-core/playwright`
   - `checkAccessibility(page, options)` — Runs axe scan on current page state
   - Configured for WCAG 2.1 Level A and AA tags by default
   - Supports custom tags and selector exclusions via options object
   - Formats violation reports with impact level, help text, node HTML, and helpUrl
   - Used in `axe-scan.spec.js` to verify zero violations across all interaction states
6. **Test Coverage**:
   - **basic-filtering.spec.js**: Category filtering, card visibility, URL hash updates
   - **toggle-behavior.spec.js**: Toggle-to-reset, sequential filter changes
   - **url-hash.spec.js**: Page load with hash, browser navigation, invalid hashes
   - **animation-states.spec.js**: Exit/entrance choreography, stagger delays, cleanup
   - **keyboard-nav.spec.js**: Arrow keys, Home/End, Escape, roving tabindex, focus management
   - **accessibility.spec.js**: ARIA attributes (`aria-pressed`, `role`, `aria-live`), live region announcements
   - **rapid-clicks.spec.js**: Race conditions, animation interruption, state consistency
   - **axe-scan.spec.js**: WCAG 2.1 AA compliance scanning (page load, all filters, toggle-to-reset, keyboard nav, URL hash, explicit light theme, explicit dark theme)
7. **CI Integration**: Tests run after build job, before deployment
   - `forbidOnly: true` in CI prevents `.only()` commits
   - 2 retries for flaky tests in CI
   - Sequential workers in CI (`workers: 1`) for stability
   - GitHub reporter for CI annotations
   - Test reports uploaded as artifacts (7-day retention)
8. **Local Development**:
   - `npm test` — Headless execution
   - `npm run test:ui` — Interactive UI mode
   - `npm run test:headed` — Visible browser debugging
   - Reuses existing dev server if running
9. **Accessibility Regression Testing**: Automated WCAG 2.1 AA scanning prevents accessibility violations
   - Uses `@axe-core/playwright` for comprehensive accessibility audits
   - Scans page on load and after every interaction state (filter changes, keyboard nav, URL hash)
   - Explicitly tests both light and dark themes via `fp.setTheme()` to catch cross-theme color-contrast regressions
   - Waits for scroll animations to settle (700ms) to prevent false color-contrast failures from opacity transitions
   - Discovered and fixed 4 light-theme + 1 dark-theme color contrast violations (muted text, category badges, status indicators)

### Performance Optimization Pattern
**Self-hosted fonts**: Replaced Google Fonts CDN with local font files
- **Location**: `fonts/` directory with WOFF2 files (Inter font, Latin and Latin Extended subsets)
- **Benefits**: Eliminates external DNS lookup, reduces latency, improves privacy
- **Preloading**: Critical fonts preloaded in `<head>` with `<link rel="preload">`
  - `fonts/inter-latin.woff2` — Base Latin character set
  - `fonts/inter-latin-ext.woff2` — Extended Latin characters
  - Uses `type="font/woff2"` and `crossorigin` for proper CORS handling
- **Applied to**: Both `index.html` and `404.html` for consistent performance

**Critical CSS inlining**: Above-fold styles inlined in `<head>` to eliminate render-blocking CSS
- **Tool**: Google's Critters library (`scripts/inline-css.js`)
- **Strategy**: Static HTML analysis extracts CSS rules matching elements in the document
- **Async loading**: Full CSS bundle loads via `media="print" onload="this.media='all'"` pattern
- **Fallback**: `<noscript>` tag loads full CSS synchronously for non-JS users
- **Theme handling**: Temporarily adds `data-theme="light"` during processing so critters includes light theme selectors; post-processes to inject `[data-theme="light"]` variable overrides that critters misses (CSS custom properties don't trigger critical extraction)
- **Size**: index.html ~16 KB inline CSS, 404.html ~8 KB inline CSS (14 KB TCP slow-start guideline noted)
- **Idempotency**: `cleanInlineArtifacts()` shared function removes all critters artifacts before re-processing
- **Development**: `--restore` mode strips inline CSS for watch mode debugging

### SEO Configuration
**robots.txt**: Controls search engine crawling
- Allows all crawlers to index main site (`Allow: /`)
- Blocks learning project directories: `/freecodecamp/`, `/frontendmentor/`, `/MDN/`, `/other/`, `/docs/`
- References sitemap location: `https://goodalex223.github.io/sitemap.xml`

**sitemap.xml**: XML sitemap for search engines
- Lists homepage with monthly update frequency
- Priority: 1.0 (highest)
- Last modified: 2026-02-04
- Submitted to both Google Search Console and Bing Webmaster Tools

**Search engine tools**:
- **Google Search Console**: Verified via HTML meta tag (`google-site-verification`). Sitemap submitted Feb 4, 2026.
- **Bing Webmaster Tools**: Verified via GSC import (auto-verification, no separate meta tag). Sitemap imported Feb 10, 2026.

**Meta descriptions**: Optimized for search CTR and social sharing (150-160 chars)
- **Primary meta** (`index.html`): "Software developer Alexey Minakov — backend systems, IoT/hardware, and web projects built with Python, Arduino, and TypeScript. Available for new opportunities." (160 chars)
  - Includes primary keywords (Python, Arduino, TypeScript, backend, IoT, web)
  - Call-to-action: "Available for new opportunities"
- **OG/Twitter** (`index.html`): "Backend systems, IoT solutions, and web apps built with Python, Arduino, and TypeScript. Explore real-world projects from a developer open to new roles." (153 chars)
  - Action-oriented for social sharing ("Explore")
  - Shorter for card previews
- **JSON-LD Person description** (`index.html`): "Software developer specializing in Python backend systems, Arduino-based IoT solutions, and TypeScript web applications. Open to new opportunities." (148 chars)
  - Factual, machine-readable
  - Signals availability
- **404 page** (`404.html`): "Page not found. Visit Alexey Minakov's portfolio to explore backend, IoT, and web development projects." (102 chars)
  - Brief with redirect context

**Open Graph & Twitter Card** (in `index.html`):
- **Required tags**: `og:title`, `og:type`, `og:image`, `og:url`
- **Recommended tags**: `og:description`, `og:image:width`, `og:image:height`, `og:image:alt`
- **Twitter tags**: `twitter:card="summary_large_image"`, `twitter:image:alt`
- **Image spec**: 1200x630px, alt text "Alexey Minakov - Software Developer"
- **Validation** (2026-02-13): All 16 meta tags present and correct via programmatic checks
- **Platform testing**: Validated via opengraph.xyz across 5 platforms (Facebook, X, LinkedIn, Discord, WhatsApp)
- **Testing checklist**: `docs/SEO_TESTING.md` — reusable validation workflow for future changes

**JSON-LD Structured Data** (in `index.html` `<head>`):
- Single `<script type="application/ld+json">` with `@graph` array
- `Person` schema: name, jobTitle, url, email, description, sameAs (4 profiles), knowsAbout (10 skills)
- `WebSite` schema: name, url, cross-referenced to Person via `author` using `@id`
- Fragment identifiers: `#person` and `#website` for same-page entity references
- Placement: after `<link rel="canonical">`, before theme initialization script

### Adding New Projects
Add project card to `index.html` projects section:
```html
<article class="project-card" data-category="backend" data-updated="2026-01" data-status="active">
  <div class="project-card__header">
    <span class="project-card__category">Backend</span>
    <div class="project-card__links">
      <a href="..." class="project-card__link"><!-- GitHub SVG --></a>
    </div>
  </div>
  <h3 class="project-card__title">Project Name</h3>
  <p class="project-card__description">Description</p>
  <ul class="project-card__tech">
    <li>Python</li>
    <li>FastAPI</li>
  </ul>
  <footer class="project-card__footer">
    <time class="project-card__updated" datetime="2026-01">Updated Jan 2026</time>
    <!-- Optional: only for active projects -->
    <span class="project-card__status" aria-label="Project status: In Development">
      <span class="project-card__status-dot" aria-hidden="true"></span>
      In Development
    </span>
  </footer>
</article>
```

<!-- END AUTO-MANAGED -->

<!-- MANUAL -->
## Custom Notes

Add project-specific notes here. This section is never auto-modified by the memory system.

<!-- END MANUAL -->
