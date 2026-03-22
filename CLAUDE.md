# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

<!-- AUTO-MANAGED: project-description -->
## Overview

**Personal Portfolio Website** for Alexey Minakov — a static site showcasing software development projects.

- **Live Site**: [goodalex223.github.io](https://goodalex223.github.io)
- **Tech Stack**: HTML5, CSS3 (Custom Properties, Grid, Flexbox), ES6+
- **Build Tools**: PostCSS (CSS bundling), Critters (critical CSS inlining), terser (JS minification), commitlint (Conventional Commits enforcement)
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

# Lint JS (check for violations)
npm run lint:js

# Lint JS and auto-fix issues
npm run lint:js:fix

# Lint both CSS and JS
npm run lint

# Build CSS and JS with cache-busting (bundles + minifies + content hashes)
npm run build

# Build CSS and watch for changes (unminified, no hashing)
npm run watch

# Run end-to-end tests (headless)
npm test

# Run tests with UI mode
npm run test:ui

# Run tests with visible browser
npm run test:headed

# Run Lighthouse CI audit (performance, accessibility, best-practices, SEO)
npm run lighthouse

# Start local server (Python)
python -m http.server 8000

# Start local server (Node)
npx serve

# Run Playwright tests directly (alternative to npm test)
npx playwright test

# Open Playwright test report
npx playwright show-report
```

**Build System**: PostCSS with `postcss-import` plugin bundles modular CSS files, then cssnano minifies (production only). Production builds (`npm run build`) run: `update-sitemap` → `build:css` → `unhash` → `inline:css` → `hash:assets` → `report-sizes`. This generates content-hashed filenames (`dist/style.[hash].css`, `dist/main.[hash].js`) with critical CSS inlined in HTML. JS is minified by terser during the hash step. Watch mode (`npm run watch`) outputs unminified `dist/style.css` for debugging (restores HTML to non-inlined state).

**Sitemap Auto-Update**: `scripts/update-sitemap.js` runs as the first step of `npm run build`. Reads the last git commit date for `index.html` via `git log -1 --format=%aI` and updates the `<lastmod>` field in `sitemap.xml`. Falls back to HEAD commit date for shallow clones. Exits gracefully (warning only) if no git date is available; exits with error if `sitemap.xml` is missing.

**Build Size Reporting**: `scripts/report-sizes.js` runs as the final step of `npm run build`. Reports raw and gzip sizes for CSS (`dist/style.[hash].css`) and JS (`js/main.js` → `dist/main.[hash].js` showing src → min → gzip). Enforces size budgets: CSS gzip 20 KB, JS gzip 10 KB — prints a warning if either is exceeded. Exits with error if `dist/` is missing or hashed files are not found. After reporting, appends a timestamped entry (ISO 8601) with raw and gzip sizes for CSS and JS to `docs/size-history.json` for historical trend tracking. The history file is committed to the repo; CI builds update it but don't commit (local builds commit manually). Gracefully handles missing or malformed history file.

**Critical CSS Inlining**: `scripts/inline-css.js` uses Google's Critters library to extract above-the-fold CSS and inline it in `<style>` tags in `<head>`. Full CSS loads asynchronously via `media="print" onload="this.media='all'"` pattern. Includes `<noscript>` fallback for non-JS users, light theme variable injection, and `--restore` mode for development. Applied to both `index.html` and `404.html`.

**Cache-Busting**: `scripts/hash-assets.js` computes SHA-256 hashes of built CSS and JS, renames files to `style.[hash].css` and `main.[hash].js` in `dist/`, and updates HTML references in `index.html` and `404.html`. JS is minified by terser before hashing. Watch mode unhashes references for easier development.

**Testing**: Playwright end-to-end tests validate filter functionality, animations, accessibility, keyboard navigation, URL hash integration, SEO meta tags (Open Graph, Twitter Card, JSON-LD), project detail modal behavior, and contact form submission. Test server (`scripts/serve.js`) runs on port 4173. Tests use Page Object Model pattern (`FilterPage.js`, `ModalPage.js`, `FormPage.js`) and timing utilities that read CSS custom properties.

**CSS Linting**: Stylelint validates CSS code style and conventions. Configured via `.stylelintrc.json` with BEM naming enforcement, kebab-case for custom properties, and modern color notation. Linting runs locally (`npm run lint:css`) and in CI pipeline before build.

**JS Linting**: ESLint v10 flat config (`eslint.config.js`) validates JavaScript across three environments: browser ES6+ (`js/**/*.js`), Node.js CommonJS (`scripts/**/*.js`), and Playwright ESM tests (`tests/**/*.js`). Rules: `eslint:recommended` + `no-var` + `prefer-const` + `no-console: "error"` (browser code only). Playwright tests use `eslint-plugin-playwright` with `flat/recommended` preset + `prefer-web-first-assertions: "error"` (disabled for `tests/seo/**` cross-tag comparisons). Ignores: `dist/**`, `node_modules/**`, `eslint.config.js`, `commitlint.config.js`. Runs locally (`npm run lint:js`) and in CI before build. Auto-fixes on commit via lint-staged.

**Commit Message Linting**: commitlint validates commit message format via Conventional Commits specification. Configured in `commitlint.config.js` with `@commitlint/config-conventional` preset, enforcing `<type>(<scope>): <subject>` format with 72-character header limit (classic git recommendation for clean `git log` output). Subject case rule disabled (`subject-case: [0]`) — uppercase subjects allowed (e.g. `"docs: Add ..."` not `"docs: add ..."`). Integrated via husky v9 `commit-msg` hook (`.husky/commit-msg`), runs on every commit attempt. Hook is invoked via `npx --no -- commitlint --edit $1` (no shebang, husky v9 shell-agnostic pattern).

**Lighthouse CI**: `npm run lighthouse` runs `lhci autorun` using `lighthouserc.js`. Audits 3 times against the local test server (desktop preset, `throttlingMethod: "provided"`), takes the median, and fails if any category (performance, accessibility, best-practices, seo) drops below 90/100. Reports saved to `.lighthouseci/` (gitignored).

**Deployment**: Automatic via GitHub Actions on push to `main` branch. Workflow runs lint (CSS + JS) → build → (test + lighthouse in parallel) → deploy. Linting, tests, and Lighthouse audit must all pass before deployment proceeds.

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
├── lighthouserc.js         # Lighthouse CI configuration (≥90/100 all categories, desktop preset)
├── .stylelintrc.json       # Stylelint configuration (CSS linting rules)
├── eslint.config.js        # ESLint v10 flat config (browser/Node CJS/Node ESM environments)
├── commitlint.config.js    # commitlint config (Conventional Commits, 72-char header limit)
├── .mcp.json.example       # MCP server config template (memory, context7, playwright, github, firecrawl)
├── .husky/
│   ├── pre-commit          # Git hook: runs lint-staged on staged files
│   └── commit-msg          # Git hook: runs commitlint to validate commit message format
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions CI/CD pipeline
├── css/
│   ├── main.css            # Entry point, imports + layout styles
│   ├── fonts.css           # @font-face declarations for Inter
│   ├── variables.css       # Design tokens (colors, spacing, typography)
│   ├── reset.css           # Browser normalization
│   ├── utilities.css       # Reusable utility classes
│   ├── components.css      # UI components (cards, buttons, links)
│   ├── modal.css           # Project detail modal styles (overlay, dialog, transitions)
│   └── form.css            # Contact form styles (fields, validation states, status messages)
├── data/
│   └── projects.json       # Project detail data (descriptions, highlights, tech, screenshots, links)
├── dist/
│   ├── style.[hash].css    # Built CSS with content hash (generated, not committed)
│   └── main.[hash].js      # Minified JS with content hash (generated, not committed)
├── scripts/
│   ├── hash-assets.js      # Cache-busting: minify JS (terser), hash CSS+JS, update HTML refs
│   ├── inline-css.js       # Critical CSS inlining via Critters (--restore for dev mode)
│   ├── report-sizes.js     # Build size report: raw + gzip sizes, budget warnings, size history tracking
│   ├── serve.js            # Minimal static file server for Playwright tests (port 4173)
│   └── update-sitemap.js   # Auto-update sitemap.xml lastmod from git history (runs first in build)
├── js/
│   └── main.js             # Theme toggle, project filtering, scroll animations, project modal, contact form, copyright year
├── tests/
│   ├── filter/             # Filter functionality test suites
│   │   ├── basic-filtering.spec.js    # Category filtering validation
│   │   ├── toggle-behavior.spec.js    # Toggle-to-reset behavior
│   │   ├── url-hash.spec.js           # URL hash integration
│   │   ├── animation-states.spec.js   # Animation choreography
│   │   ├── keyboard-nav.spec.js       # Keyboard navigation (roving tabindex)
│   │   ├── accessibility.spec.js      # ARIA attributes, live regions
│   │   ├── rapid-clicks.spec.js       # Rapid interaction handling, deterministic toggle-to-reset on rapid double-click
│   │   ├── axe-scan.spec.js           # WCAG 2.1 AA accessibility scanning (axe-core)
│   │   └── reduced-motion.spec.js     # Reduced motion: visibility, filter function, WCAG scans
│   ├── modal/
│   │   ├── basic-modal.spec.js    # Modal open, content rendering, scroll lock
│   │   ├── close-modal.spec.js    # Close via button, ESC, backdrop; focus restore
│   │   ├── accessibility.spec.js  # ARIA attributes, focus trap, details button
│   │   ├── url-hash.spec.js       # URL hash (#project=id), browser navigation
│   │   ├── reduced-motion.spec.js # Modal with prefers-reduced-motion
│   │   └── axe-scan.spec.js       # WCAG 2.1 AA accessibility scanning (axe-core), scoped to modal element
│   ├── form/
│   │   ├── validation.spec.js     # Field validation: required, email format, minlength, maxlength, blur
│   │   ├── submission.spec.js     # Submission: success/error mock, loading state, honeypot, actions
│   │   ├── accessibility.spec.js  # ARIA attributes, label associations, focus management, keyboard
│   │   └── axe-scan.spec.js       # WCAG 2.1 AA scanning: default, errors, success, light, dark, reduced-motion
│   ├── seo/
│   │   └── meta-tags.spec.js  # SEO meta tag validation (OG, Twitter Card, JSON-LD, canonical)
│   ├── pages/
│   │   ├── FilterPage.js   # Page Object Model for filter system
│   │   ├── ModalPage.js    # Page Object Model for project detail modal
│   │   └── FormPage.js     # Page Object Model for contact form
│   └── utils/
│       ├── timing.js       # Animation timing utilities (reads CSS variables)
│       └── axe-helper.js   # Accessibility testing utilities (axe-core integration; supports include/exclude scoping)
├── images/
│   └── projects/           # Project detail screenshots (webp, lazy-loaded in modal)
├── fonts/
│   ├── inter-latin.woff2     # Self-hosted Inter font (Latin subset)
│   └── inter-latin-ext.woff2 # Self-hosted Inter font (Latin Extended subset)
├── docs/                   # Project documentation
│   ├── PORTFOLIO_REQUIREMENTS.md  # Project quality standards and audit checklist by tier
│   └── superpowers/        # Agentic workflow plans and design specs
│       ├── plans/          # Implementation plans (CHALLENGE-*, QUALITY-*, etc.)
│       └── specs/          # Design/spec documents for planned features
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
- [scripts/report-sizes.js](scripts/report-sizes.js) — Build size report: raw + gzip sizes, budget enforcement, size history tracking (`docs/size-history.json`)
- [scripts/update-sitemap.js](scripts/update-sitemap.js) — Sitemap lastmod auto-updater (git-driven, first step of build)
- [scripts/serve.js](scripts/serve.js) — Test server (port 4173)
- [.stylelintrc.json](.stylelintrc.json) — CSS linting configuration
- [eslint.config.js](eslint.config.js) — ESLint v10 flat config (three environment blocks: browser, Node CJS, Playwright ESM)
- [commitlint.config.js](commitlint.config.js) — commitlint config: extends `@commitlint/config-conventional`, overrides `header-max-length` to 72
- [.mcp.json.example](.mcp.json.example) — MCP server config template (copy to `.mcp.json`, configure memory/context7/playwright/github/firecrawl servers)
- [lighthouserc.js](lighthouserc.js) — Lighthouse CI config: 3 runs, desktop preset, ≥90 threshold for all 4 categories
- [.github/workflows/deploy.yml](.github/workflows/deploy.yml) — CI/CD deployment workflow (lint → build → test + lighthouse → deploy)
- [tests/pages/FilterPage.js](tests/pages/FilterPage.js) — Page Object Model for filter system tests
- [tests/pages/ModalPage.js](tests/pages/ModalPage.js) — Page Object Model for project detail modal tests
- [tests/pages/FormPage.js](tests/pages/FormPage.js) — Page Object Model for contact form tests
- [data/projects.json](data/projects.json) — Project detail data (lazy-fetched by modal JS)
- [css/modal.css](css/modal.css) — Project detail modal styles
- [css/form.css](css/form.css) — Contact form styles (fields, validation states, status messages)
- [docs/PORTFOLIO_REQUIREMENTS.md](docs/PORTFOLIO_REQUIREMENTS.md) — Project quality standards: 3 tiers (Production, Hardware, Utilities), per-tier requirements, audit checklist, current project gap snapshot
- [docs/SEO_TESTING.md](docs/SEO_TESTING.md) — Social card & SEO validation checklist
- [docs/size-history.json](docs/size-history.json) — Build size trend history (appended by `report-sizes.js` on each build)
- [docs/learning-backlog.md](docs/learning-backlog.md) — Learning topics captured from development sessions (explored further after task completion)
- [robots.txt](robots.txt) — Search engine crawler directives
- [sitemap.xml](sitemap.xml) — Site structure for SEO
- [site.webmanifest](site.webmanifest) — PWA manifest (app name, icons, theme colors)
- [PROJECT.md](PROJECT.md) — Project configuration

<!-- END AUTO-MANAGED -->

## MCP Servers

MCP server config lives in `.mcp.json` (gitignored). Use `.mcp.json.example` as the template.

| Server | Source | Purpose |
|--------|--------|---------|
| memory | `.mcp.json` — `@modelcontextprotocol/server-memory` | Persistent knowledge graph — session context, decisions, project state |
| context7 | `.mcp.json` — `@upstash/context7-mcp` | Up-to-date library docs — resolves package IDs and queries docs for Playwright, PostCSS, etc. |
| playwright | `.mcp.json` — `@playwright/mcp@latest` | Browser automation — navigate pages, click, fill forms, take screenshots, inspect DOM |
| github | `.mcp.json` — `@modelcontextprotocol/server-github` | GitHub API — create issues/PRs, read file contents, search code (requires `GITHUB_PERSONAL_ACCESS_TOKEN`) |
| firecrawl | `.mcp.json` — `firecrawl-mcp` | Web scraping and crawling — fetch pages, search the web, extract structured data (requires `FIRECRAWL_API_KEY`) |
| chrome-devtools | Claude Code plugin — `chrome-devtools-mcp@claude-plugins-official` | DevTools-level browser access: Lighthouse audit, performance traces, memory heap snapshots, device emulation, attach to existing Chrome tab |

**When to use each browser tool**:
- `npm test` — run the full Playwright test suite (CI-equivalent, all specs)
- playwright MCP — ad-hoc browser interaction: inspect live state, debug a scenario, verify a fix visually without writing a test
- chrome-devtools MCP — DevTools-specific tasks: quick Lighthouse audit during development, performance profiling (CPU flame chart), memory leak investigation, or inspecting an existing Chrome tab (e.g. live GitHub Pages site)

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
- `transition: all` and `transition-property: all` disallowed — use explicit property lists (e.g. `transition: background-color 0.2s, color 0.2s`) to prevent unintended side effects
- Allows specific vendor prefixes: `-webkit-font-smoothing`, `-moz-osx-font-smoothing`, `-webkit-text-size-adjust`
- Ignores `dist/` directory (generated files)

**JS Linting**: ESLint v10 flat config (`eslint.config.js`) enforces code quality across three environments:
- `js/**/*.js` — browser ES6+ script (`sourceType: "script"`, browser globals); `no-console: "error"` prevents accidental console usage in production
- `scripts/**/*.js` — Node.js CommonJS build utilities (`sourceType: "commonjs"`, node globals)
- `tests/**/*.js` — Playwright test files (`sourceType: "module"`, node + browser globals — browser globals needed for `page.evaluate()` callbacks); uses `eslint-plugin-playwright` `flat/recommended` preset with two-entry pattern (preset + overrides); `prefer-web-first-assertions: "error"` (disabled for `tests/seo/**` cross-tag comparisons); `no-skipped-test: "off"` (browser-specific `test.skip()` in modal/accessibility); `no-wait-for-timeout: "off"` (CSS animation timing waits in POM helpers); `expect-expect` configured with alphabetically-sorted POM assertion method names in `assertFunctionNames` (covers FilterPage, ModalPage, FormPage, and `checkAccessibility`)
- Rules: `eslint:recommended` + `no-var: error` + `prefer-const: error`
- lint-staged: `*.js` files auto-fixed on commit via husky
- Ignores: `dist/**`, `node_modules/**`, `eslint.config.js`, `commitlint.config.js`

**Commit Message Linting**: commitlint enforces Conventional Commits on every `git commit` via `.husky/commit-msg`:
- Config: `commitlint.config.js` extends `@commitlint/config-conventional`
- Valid types: `feat`, `fix`, `docs`, `chore`, `style`, `test`, `build`, `ci`, `perf`, `refactor`, `revert`
- Optional scope: `type(scope): subject`
- Header max length: 72 characters (overrides preset default of 100)
- Subject case rule disabled (`subject-case: [0]`) — uppercase subjects allowed (e.g. `"docs: Add ..."` not `"docs: add ..."`)
- Body/footer line length not enforced
- Merge commits ignored by default
- Packages: `@commitlint/cli`, `@commitlint/config-conventional`
- Hook is invoked via `npx --no -- commitlint --edit $1` (no shebang, husky v9 shell-agnostic pattern)

### CSS Architecture
CSS source files use `@import` in `css/main.css`, bundled by PostCSS into `dist/style.css`:
1. `fonts.css` — @font-face declarations for Inter
2. `variables.css` — Design tokens
3. `reset.css` — Browser normalization
4. `utilities.css` — Utility classes
5. `components.css` — UI components
6. `modal.css` — Project detail modal (overlay, dialog, animations)
7. `form.css` — Contact form (fields, validation states, status messages)
8. `main.css` — Layout and section styles

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
- **Dark theme fixes**:
  - `--color-text-muted`: `#8a8a8a` (was `#6b6b6b`) — muted text on dark backgrounds
  - `--color-category-web`: `#42a5f5` (was `#2196f3`) — adjusted for dark card backgrounds + semi-transparent badges
  - `--color-category-tools`: `#ce93d8` (was `#9c27b0`) — adjusted for dark card backgrounds + semi-transparent badges
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
  - Active state: `.filter-btn.filter-btn--active` with category-colored backgrounds (double-class selector beats `.filter-btn:hover` specificity — 0,2,0 vs 0,1,1; prevents hover from overriding active text/background)
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

### Project Detail Modal Pattern
**Accessible overlay modal for rich project storytelling**: Lazy-fetched JSON data, focus trap, URL hash integration
1. **Data Source**: `data/projects.json` — flat object keyed by project ID, containing `title`, `category`, `description[]`, `highlights[]`, `tech[]`, `links{}`, `screenshots[]`, `status`, `updated`
2. **HTML Markup**: Project cards with `data-project="<id>"` attribute make cards clickable; "View Details" `<button class="project-card__details-btn" aria-haspopup="dialog">` provides keyboard-accessible entry point. Modal container: `<div id="project-modal" class="project-modal" role="dialog" aria-modal="true" hidden>`; inner dialog div: `<div class="project-modal__dialog" tabindex="-1">` — `tabindex="-1"` required for WCAG focusable-content compliance (makes dialog container programmatically focusable)
3. **JS Initialization**: `initProjectModal()` in `js/main.js`
   - `fetchProjectData()` — lazy fetch + cache of `data/projects.json`; called on first modal open
   - `renderModalContent()` — safe DOM construction (no `innerHTML` for data, only static SVG icons)
   - `openModal(projectId)` — fetch data → render → show → focus close button → push URL hash
   - `closeModal()` — hide → restore focus to trigger element → clear URL hash → clear DOM after transition
   - Card click: excludes `<a>` and `.project-card__details-btn` clicks (handled separately)
   - Details button click: `stopPropagation()` prevents double-firing card click handler
4. **Focus Management**:
   - Dialog container: `tabindex="-1"` on `.project-modal__dialog` satisfies WCAG focusable-content requirement (container is programmatically focusable without entering tab order)
   - Opens: focus moves to close button via `setTimeout(300ms)` — must exceed CSS `visibility` transition (250ms); calling `focus()` on a `visibility: hidden` element silently fails
   - Trap: `trapFocus()` cycles Tab/Shift+Tab through `a[href], button:not([disabled]), [tabindex]:not([-1])` within dialog
   - Closes: `triggerElement.focus()` restores focus to `.project-card__details-btn` that opened modal
5. **URL Hash Integration**: `#project=<id>` format — `pushState` on open, `pushState` (clean URL) on close; `popstate` listener handles browser back/forward; page load applies hash on init
6. **Accessibility**: `role="dialog"`, `aria-modal="true"`, `aria-labelledby="project-modal-title"`, ESC to close, backdrop click to close, `aria-haspopup="dialog"` on trigger buttons
7. **Scroll Lock**: `document.body.classList.add("modal-open")` + `body.modal-open { overflow: hidden }` in `modal.css`
8. **Lazy Screenshots**: `img.loading = "lazy"` with explicit `width` and `height` attributes to prevent layout shift
9. **CSS**: `css/modal.css` — `--modal-animation-duration: 250ms`, `visibility: hidden / opacity: 0` base state, `.project-modal--open` activates; `prefers-reduced-motion` sets `transition: none`
10. **Deploy**: `data/` directory copied to `_site/` in GitHub Actions deploy job (required for `fetch("data/projects.json")` to work on GitHub Pages)

### Contact Form Pattern
**Accessible contact form with Formspree submission**: Replaces mailto link, hybrid validation, inline status feedback
1. **Placement**: Replaces email `<li>` in contact section; sits above social links `<ul class="contact__links">`
2. **Fields**: Name (required, minlength 2, maxlength 100), Email (required), Message (required, minlength 10, maxlength 2000); all use `autocomplete` attributes
3. **Spam Protection**: Honeypot field `_gotcha` (hidden via `position: absolute; left: -9999px; opacity: 0`); hidden with `aria-hidden="true"` + `tabindex="-1"` on wrapper; if filled, silently shows success without sending (don't reveal detection to bots)
4. **Submission**: `fetch()` POST to `https://formspree.io/f/{FORM_ID}` with `Content-Type: application/json` and `Accept: application/json`; standard `action`+`method="POST"` on `<form>` as no-JS fallback
5. **Validation**: Hybrid HTML5 + custom JS via Constraint Validation API (`input.validity.typeMismatch` for email — no custom regex); blur validation on each field; full `validateForm()` on submit; focuses first invalid field on failure
6. **Feedback**: Inline replacement — form fades out, `#contact-form-status` fades in with success/error message + action button ("Send another" / "Try again")
7. **JS Functions** in `js/main.js`: `initContactForm()`, `validateField()`, `showFieldError()`, `clearFieldError()`, `validateForm()`, `showFormStatus()`, `resetForm()` (submit logic is inline in `initContactForm()`'s `submit` event handler)
8. **CSS** in `css/form.css`:
   - BEM: `.contact-form`, `.contact-form__field`, `.contact-form__label`, `.contact-form__input`, `.contact-form__input--textarea`, `.contact-form__input--invalid`, `.contact-form__error`, `.contact-form__submit`, `.contact-form__submit-text`, `.contact-form__submit-loading`, `.contact-form__status`, `.contact-form__status-icon`, `.contact-form__status-message`, `.contact-form__status-action`
   - New design tokens in `variables.css`: `--color-error` (#ef5350 dark / #c62828 light), `--color-error-bg`; `--color-success` (alias `--color-status-active`), `--color-success-bg`
   - Responsive: max-width 32rem at 37.5em+ breakpoint, single column at all widths
   - `.contact-form__input` added to theme transition group in `main.css`
   - `prefers-reduced-motion`: form fade transition set to `none`
9. **Accessibility**: `aria-invalid="true"` + `aria-describedby` on each input linking to its error `<p>`; error elements use `role="alert"` + `aria-live="polite"`; status container uses `role="alert"` + `aria-live="polite"`; button disabled + loading text announced during submission
10. **Testing** in `tests/form/` — Formspree mocked in `FormPage.js` via `page.route("**/formspree.io/f/*", ...)`:
    - `FormPage.js` POM: `fillName()`, `fillEmail()`, `fillMessage()`, `fillAllFields()`, `clickSubmit()`, `clickStatusAction()`, `blurField()`, `mockFormspreeSuccess()`, `mockFormspreeError()`, `mockFormspreeNetworkError()`, `expectFieldError()`, `expectNoFieldError()`, `expectFieldInvalid()`, `expectFieldValid()`, `expectFormVisible()`, `expectFormHidden()`, `expectSuccess()`, `expectError()`, `expectSubmitDisabled()`, `expectSubmitEnabled()`, `expectLoadingState()`, `enableReducedMotion()`, `setTheme()`, `waitForScrollAnimations()`
    - `validation.spec.js` — required, email format, minlength, maxlength, blur validation, focus on first error
    - `submission.spec.js` — success mock, error mock, loading state, honeypot silent-succeed, "Send another"/"Try again"
    - `accessibility.spec.js` — ARIA, label associations, focus management, keyboard navigation
    - `axe-scan.spec.js` — WCAG 2.1 AA: default state, errors visible, success state, light theme, dark theme, reduced-motion

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
   - `npm run build` — Production: `update-sitemap` → `build:css` → `unhash` → `inline:css` → `hash:assets` → `report-sizes`
   - `npm run watch` — Development: restore inline CSS → unhash refs → PostCSS watch (unminified, no hashing)
8. **Watch Mode**: `--restore` removes inline CSS artifacts, `--unhash` restores `dist/style.css` and `js/main.js` references
9. **CSS Linting**: Stylelint validates CSS code quality and conventions
   - Configuration: `.stylelintrc.json` extends `stylelint-config-standard`
   - Enforces BEM naming, kebab-case for custom properties and keyframes
   - Requires modern color functions with numeric alpha values
   - Bans `transition: all` / `transition-property: all` — enforces explicit property transition lists to prevent unintended side effects
   - Runs in CI before build step to catch style violations early
10. **JS Linting**: ESLint v10 flat config validates JavaScript across all environments
   - Configuration: `eslint.config.js` (CJS format, three environment blocks + Playwright plugin)
   - Rules: `eslint:recommended`, `no-var`, `prefer-const`, `no-console: "error"` (browser code)
   - Playwright tests: `eslint-plugin-playwright` `flat/recommended` + `prefer-web-first-assertions` (SEO tests exempted)
   - lint-staged auto-fixes `*.js` on commit; CI runs `npm run lint:js` before build
11. **CI/CD**: GitHub Actions workflow with 5 separate jobs: lint → build → (test + lighthouse in parallel) → deploy
    - Workflow: `.github/workflows/deploy.yml`
    - Lint job: `npm ci` → `npm run lint:css` → `npm run lint:js` (gates build)
    - Build job: `npm ci` → `npm run build` → upload build-output artifact (`index.html`, `404.html`, `sitemap.xml`, `dist/`)
    - Test job: checkout → `npm ci` → download build-output overlay → Playwright install → `npx playwright test --ignore-snapshots` → upload `playwright-report` artifact (7-day retention)
    - Lighthouse job: checkout → `npm ci` → download build-output overlay → `npm run lighthouse` → upload `lighthouse-report` artifact (`.lighthouseci/`, 7-day retention)
    - Deploy job: checkout → download build-output overlay → stage production files into `_site/` (copies HTML, 404.webp, favicon, OG image, manifest, robots.txt, sitemap.xml, data/, dist/, fonts/, images/) → configure-pages → upload-pages-artifact (`_site`) → deploy-pages (only if build, test, and lighthouse all pass)
    - Artifact: `build-output` (1-day retention) passes built HTML + `sitemap.xml` + `dist/` between jobs
    - Concurrency: Single pages deployment group, cancels in-progress runs
12. **HTML References**: Both `index.html` and `404.html` have inline `<style>` with critical CSS plus async `<link>` to `dist/style.[hash].css` (production) or normal `<link>` to `dist/style.css` (watch mode). JS: `<script src="dist/main.[hash].js">` (production) or `<script src="js/main.js">` (watch mode)
13. **Git Ignore**: `dist/`, `test-results/`, `playwright-report/`, `.lighthouseci/` excluded from version control

### Testing Pattern
**Playwright End-to-End Tests**: Comprehensive test suite validating interactive features
1. **Framework**: Playwright with multi-browser testing (Chromium, Firefox, WebKit)
2. **Test Server**: Custom static server (`scripts/serve.js`) on port 4173
   - Serves project root with proper MIME types
   - Handles SPA routing (serves `index.html` for `/`)
   - Serves custom `404.html` on missing files (matches GitHub Pages behavior)
   - Error handling: `EADDRINUSE` (port in use), `EACCES` (permission denied), generic — all print descriptive messages and `process.exit(1)`
   - Started automatically by Playwright via `webServer` config
3. **Page Object Models**:
   - `FormPage.js` — encapsulates contact form interactions
     - Navigation: `goto()` — navigates to `/`, waits for filter button counts to confirm JS init
     - Actions: `fillName()`, `fillEmail()`, `fillMessage()`, `fillAllFields({name, email, message})`, `clickSubmit()`, `clickStatusAction()`, `blurField(field)`
     - Formspree mocking: `mockFormspreeSuccess()`, `mockFormspreeError(statusCode=500)`, `mockFormspreeNetworkError()` — all use `page.route("**/formspree.io/f/*", ...)`
     - Assertions: `expectFieldError()`, `expectNoFieldError()`, `expectFieldInvalid()`, `expectFieldValid()`, `expectFormVisible()`, `expectFormHidden()`, `expectSuccess()`, `expectError()`, `expectSubmitDisabled()`, `expectSubmitEnabled()`, `expectLoadingState()`
       - Default success message: `"Thanks! I'll get back to you soon."` / error: `"Something went wrong. Please try again."`
       - Status action texts: `"Send another message"` (success) / `"Try again"` (error)
     - Media & theme helpers: `enableReducedMotion()`, `setTheme(theme)` (sets `data-theme` + waits 400ms), `waitForScrollAnimations()` (700ms)
   - `FilterPage.js` — encapsulates filter system interactions
     - Centralized locators for toolbar, buttons, cards, animation states
     - Helper methods: `clickFilter()`, `clickFilterNoWait()`, `expectVisibleCardCount()`, `expectNoAnimationClasses()`, `expectAllVisibleCardsAreCategory()`, `getActiveFilterCategory()`, `waitForScrollAnimations()`
       - `clickFilterNoWait()` — clicks without waiting for animation (use for reduced-motion tests and mid-animation state checks)
     - Media & theme helpers: `enableReducedMotion()`, `setTheme(theme)` — `setTheme()` sets `data-theme` on `<html>` via `page.evaluate()` and waits 400ms for CSS transitions to settle
     - Category counts stored as constants (`CATEGORY_COUNTS`) for assertions
     - `waitForScrollAnimations()` waits 700ms for scroll-in animations to settle (prevents false axe-core failures)
   - `ModalPage.js` — encapsulates project detail modal interactions
     - `PROJECTS_WITH_DETAILS` constant: all 7 project IDs (`"rating-bot"`, `"rule-indicators"`, `"media-viewer"`, `"lubrication"`, `"hx711-scale"`, `"dropshipping"`, `"svg-processor"`)
     - Navigation: `goto()`, `gotoWithProjectHash(projectId)`
     - Actions: `clickCard()` (scrolls into view + polls computed opacity === "1" before clicking — Firefox cross-browser fix for scroll animation timing), `clickClose()`, `pressEscape()`, `clickBackdrop()`
     - Assertions: `expectOpen/Closed/Title/Category()`, `expectDescriptionCount/HighlightsCount/TechPillsCount/ScreenshotsCount/LinksCount()`, `expectScrollLocked/Unlocked()`, `expectFocusOnClose()` (close button focused on open), `expectDetailsBtnFocused(projectId)` (details-btn refocused after close), `expectAriaModal()`, `expectAriaLabelledBy()`, `expectUrlHash()`
       - `expectOpen()` waits 300ms after class/attribute check to let opacity transition (250ms) complete — prevents axe-core false color-contrast failures from mid-transition partial opacity
     - Media & theme helpers: `enableReducedMotion()`, `setTheme(theme)`, `waitForScrollAnimations()`
4. **Timing Utilities**: `timing.js` reads animation durations from CSS custom properties
   - `getAnimationDuration()` — Reads `--filter-animation-duration` from `:root`
   - `waitForFilterAnimation()` — Calculates full animation cycle (exit + entrance + stagger + buffer)
   - Single source of truth: CSS variables, not hardcoded values
5. **Accessibility Testing**: `axe-helper.js` provides WCAG compliance scanning using `@axe-core/playwright`
   - `checkAccessibility(page, options)` — Runs axe scan on current page state
   - Configured for WCAG 2.1 Level A and AA tags by default
   - Supports `options.include` (CSS selector to scope scan), `options.exclude` (selectors to exclude), `options.tags` (custom axe tag list)
   - Formats violation reports with impact level, help text, node HTML, and helpUrl
   - Used in filter, modal, and form `axe-scan.spec.js` suites to verify zero violations across all interaction states
6. **Test Coverage**:
   - **filter/basic-filtering.spec.js**: Category filtering, card visibility, URL hash updates
   - **filter/toggle-behavior.spec.js**: Toggle-to-reset, sequential filter changes
   - **filter/url-hash.spec.js**: Page load with hash, browser navigation, invalid hashes
   - **filter/animation-states.spec.js**: Exit/entrance choreography, stagger delays, cleanup
   - **filter/keyboard-nav.spec.js**: Arrow keys, Home/End, Escape, roving tabindex, focus management
   - **filter/accessibility.spec.js**: ARIA attributes (`aria-pressed`, `role`, `aria-live`), live region announcements
   - **filter/rapid-clicks.spec.js**: Race conditions, animation interruption, state consistency
   - **filter/axe-scan.spec.js**: WCAG 2.1 AA compliance scanning (page load, all filters, toggle-to-reset, keyboard nav, URL hash, explicit light theme, explicit dark theme)
   - **filter/reduced-motion.spec.js**: Reduced motion accessibility — element visibility (`[data-animate]` at opacity 1), filter function without animations, toggle-to-reset, URL hash, WCAG 2.1 AA scans (page load, active filter, light theme, dark theme); `enableReducedMotion()` called BEFORE `goto()` so CSS media query is active at page load
   - **modal/basic-modal.spec.js**: Modal open by card click, content rendering for all 7 projects, scroll lock/unlock
   - **modal/close-modal.spec.js**: Close via button, ESC key, backdrop click; focus restores to `.project-card__details-btn`
   - **modal/accessibility.spec.js**: ARIA attrs (`role=dialog`, `aria-modal`, `aria-labelledby`), focus on open, focus trap Tab/Shift+Tab (Chromium only — browser quirks), `aria-haspopup=dialog` on trigger buttons
   - **modal/url-hash.spec.js**: Hash updates on open (`#project=id`), removed on close, page load with hash, invalid hash ignored, coexists with `#filter=` hash, browser back closes modal
   - **modal/reduced-motion.spec.js**: Modal open/close/content with `prefers-reduced-motion` active
   - **modal/axe-scan.spec.js**: WCAG 2.1 AA scanning for modal open state — each of 7 projects individually (different content structures), explicit light theme, explicit dark theme, reduced-motion; scan scoped to `#project-modal` via `MODAL_SCOPE` to avoid false-positive contrast violations from semi-transparent backdrop on background elements
   - **seo/meta-tags.spec.js**: SEO meta tag validation — Open Graph (8 tags), Twitter Card (5 tags), core SEO (title, description, canonical), JSON-LD structured data (Person + WebSite schemas), and cross-tag consistency checks; uses `EXPECTED` constants object as single source of truth; direct locators via `ogMeta()`/`namedMeta()` helpers (no Page Object Model)
   - **form/validation.spec.js**: Required field errors, email format, minlength/maxlength, blur validation, focus moves to first invalid field on submit
   - **form/submission.spec.js**: Formspree mocked via `page.route()`; success path, error path, loading state, honeypot silent-succeed, "Send another"/"Try again" actions
   - **form/accessibility.spec.js**: ARIA attributes, label associations, focus management on validation failure, keyboard navigation
   - **form/axe-scan.spec.js**: WCAG 2.1 AA scanning — default state (full page), errors/success/error states (scoped to `#contact` via `FORM_SCOPE`), explicit light theme, explicit dark theme, reduced-motion (fresh `page.goto()` after `enableReducedMotion()`)
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
   - Filter suite: scans page on load and after every interaction state (filter changes, keyboard nav, URL hash)
   - Modal suite: scans modal open state for each project (7 projects × 4 variants: default, light, dark, reduced-motion); scan scoped to `#project-modal` to avoid false positives from semi-transparent backdrop
   - Explicitly tests both light and dark themes via `setTheme()` to catch cross-theme color-contrast regressions
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
- **Size**: index.html ~26 KB inline CSS, 404.html ~8 KB inline CSS (contact form CSS included after challenge-003; 14 KB TCP slow-start guideline exceeded — monitor Lighthouse performance score)
- **Idempotency**: `cleanInlineArtifacts()` shared function removes all critters artifacts before re-processing
- **Development**: `--restore` mode strips inline CSS for watch mode debugging

### Lighthouse CI Pattern
**Automated performance and quality gate**: `@lhci/cli` audits the built site on every CI run
- **Config**: `lighthouserc.js` — 3 runs, median score used
- **Thresholds**: All 4 categories must score ≥90/100: performance, accessibility, best-practices, seo
- **Server**: Reuses `scripts/serve.js` on port 4173 (same server as Playwright tests)
- **Preset**: Desktop with `throttlingMethod: "provided"` (disables simulated CPU/network throttle for stable CI scores)
- **Chrome flags**: `--no-sandbox --disable-gpu` for headless runners
- **Output**: `.lighthouseci/` directory (gitignored), uploaded as `lighthouse-report` artifact in CI
- **CI gate**: Deploy job blocked until lighthouse job passes (`needs: [build, test, lighthouse]`)
- **Local run**: `npm run lighthouse` (requires built `dist/` and runs its own server)

### SEO Configuration
**robots.txt**: Controls search engine crawling
- Allows all crawlers to index main site (`Allow: /`)
- Blocks learning project directories: `/freecodecamp/`, `/frontendmentor/`, `/MDN/`, `/other/`, `/docs/`
- References sitemap location: `https://goodalex223.github.io/sitemap.xml`

**sitemap.xml**: XML sitemap for search engines
- Lists homepage with monthly update frequency
- Priority: 1.0 (highest)
- `<lastmod>` auto-updated from git history on every `npm run build` (via `scripts/update-sitemap.js`)
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
<article class="project-card" data-category="backend" data-project="my-project-id" data-updated="2026-01" data-status="active">
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
    <!-- Optional: only if project detail data exists in data/projects.json -->
    <button class="project-card__details-btn" aria-haspopup="dialog">
      View Details
      <!-- chevron SVG -->
    </button>
  </footer>
</article>
```

**For modal support**: also add a matching entry to `data/projects.json` keyed by `data-project` value, with `title`, `category`, `description[]`, `highlights[]`, `tech[]`, `links{}`, `screenshots[]`, `status`, `updated` fields.

<!-- END AUTO-MANAGED -->

<!-- MANUAL -->
## Custom Notes

Add project-specific notes here. This section is never auto-modified by the memory system.

<!-- END MANUAL -->
