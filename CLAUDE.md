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
npm install            # Install dependencies
npm run lint           # Lint CSS + JS
npm run lint:css       # Lint CSS (lint:css:fix for auto-fix)
npm run lint:js        # Lint JS (lint:js:fix for auto-fix)
npm run build          # Production: sitemap → CSS → unhash → inline → hash → report-sizes
npm run watch          # Dev: restore inline CSS → unhash refs → PostCSS watch (unminified)
npm test               # E2E tests (headless Playwright)
npm run test:ui        # Tests with UI mode
npm run test:headed    # Tests with visible browser
npm run lighthouse     # Lighthouse CI audit (≥90/100 all categories)
npx serve              # Local server (or python -m http.server 8000)
```

**Build pipeline**: `update-sitemap` → `build:css` (PostCSS + cssnano) → `unhash` → `inline:css` (Critters critical CSS) → `hash:assets` (SHA-256 content hashes + terser JS minification) → `report-sizes` (budget: CSS gzip 20 KB, JS gzip 10 KB; appends to `docs/size-history.json`). Outputs `dist/style.[hash].css` and `dist/main.[hash].js`.

**CI/CD** (`.github/workflows/deploy.yml`): lint → build → (test + lighthouse in parallel) → deploy to GitHub Pages. All gates must pass.

<!-- END AUTO-MANAGED -->

<!-- AUTO-MANAGED: architecture -->
## Architecture

```
goodalex223/
├── index.html                    # Main portfolio page (single-page site)
├── 404.html                      # Custom 404 error page
├── css/
│   ├── main.css                  # Entry point (@import bundling + layout)
│   ├── variables.css             # Design tokens (colors, spacing, typography)
│   ├── reset.css, utilities.css  # Browser normalization + utility classes
│   ├── components.css            # UI components (cards, buttons, filter)
│   ├── modal.css                 # Project detail modal styles
│   └── form.css                  # Contact form styles
├── js/main.js                    # All client JS (theme, filter, scroll animations, modal, form)
├── data/projects.json            # Project detail data (lazy-fetched by modal)
├── dist/                         # Built CSS/JS with content hashes (generated, gitignored)
├── scripts/                      # Build utilities (hash-assets, inline-css, report-sizes, update-sitemap, serve)
├── tests/
│   ├── filter/                   # Filter system tests (9 spec files)
│   ├── modal/                    # Modal tests (6 spec files)
│   ├── form/                     # Contact form tests (4 spec files)
│   ├── seo/                      # SEO meta tag tests
│   ├── pages/                    # Page Object Models (FilterPage, ModalPage, FormPage)
│   └── utils/                    # Timing helpers + axe-core accessibility helper
├── docs/                         # Documentation, planning, archives
├── .github/workflows/deploy.yml  # CI/CD pipeline
├── lighthouserc.js               # Lighthouse CI config (≥90/100 threshold)
├── .stylelintrc.json             # CSS linting rules
├── eslint.config.js              # JS linting (3 environments: browser, Node CJS, Playwright ESM)
├── commitlint.config.js          # Conventional Commits (72-char header max)
└── playwright.config.js          # Test config (Chromium, Firefox, WebKit)
```

<!-- END AUTO-MANAGED -->

## MCP Servers

Config in `.mcp.json` (gitignored). Template: `.mcp.json.example`.

| Server | Purpose |
|--------|---------|
| memory | Persistent knowledge graph — session context, decisions |
| context7 | Up-to-date library docs (Playwright, PostCSS, etc.) |
| playwright | Browser automation — navigate, click, fill, screenshot |
| github | GitHub API — issues, PRs, file contents |
| firecrawl | Web scraping and crawling |
| chrome-devtools | DevTools: Lighthouse, performance traces, memory snapshots |

**Browser tool selection**: `npm test` for full suite, playwright MCP for ad-hoc inspection, chrome-devtools MCP for Lighthouse/performance profiling.

<!-- AUTO-MANAGED: conventions -->
## Code Conventions

### CSS
- **Naming**: BEM (`block__element--modifier`), state classes `is-*`, kebab-case variables/keyframes (enforced by Stylelint)
- **Linting** (`.stylelintrc.json`): BEM enforcement, modern color functions, `transition: all` banned (use explicit property lists)
- **Architecture**: `css/main.css` imports → PostCSS bundles → `dist/style.css`. Import order: fonts → variables → reset → utilities → components → modal → form → main
- **Breakpoints**: 37.5em (600px), 56.25em (900px), 75em (1200px) — mobile-first

### JS
- **Linting** (`eslint.config.js`): 3 environments — browser `js/` (`no-console: "error"`), Node CJS `scripts/`, Playwright ESM `tests/` (`prefer-web-first-assertions`, disabled for SEO tests)
- **Auto-fix**: lint-staged runs ESLint fix on commit via husky pre-commit hook

### Commits
- Conventional Commits via commitlint + husky `commit-msg` hook
- Types: `feat`, `fix`, `docs`, `chore`, `style`, `test`, `build`, `ci`, `perf`, `refactor`, `revert`
- Header: 72 chars max. Uppercase subjects allowed (`subject-case` disabled)

### Theme System
- `data-theme="light"|"dark"` on `<html>`, variables in `variables.css`
- Persisted in `localStorage.theme`, inline `<head>` script prevents FOUC
- System preference sync when no explicit choice saved

<!-- END AUTO-MANAGED -->

<!-- AUTO-MANAGED: patterns -->
## Key Patterns & Gotchas

### Project Cards — Date Sync (4 locations must agree)
When updating project dates, sync all 4: `data-updated` attr on `<article>`, `<time datetime="">` attr, `<time>` display text, `projects.json` `updated` field. Use last "meaningful commit" date (exclude metadata-only changes, dependency bumps, CI-only changes).

### Filter System
- Single-select with toggle-to-reset behavior, URL hash integration (`#filter=category`)
- **Animation choreography**: Exit (ALL visible cards fade) → layout settle → entrance (filtered cards fade in). `void card.offsetHeight` forces reflow between phases
- **CSS specificity**: Double-class selectors (`.project-card.project-card--filtering-out`) beat `[data-animate]`. Filter section placed AFTER scroll animations in `components.css` (cascade order matters — documented in inline comment block)
- **Eager state update**: `currentFilter` set at top of `filterProjects()` before animation starts (BUG-004 fix — prevents stale state in toggle-to-reset)
- `.is-visible` class after filter cleanup prevents `[data-animate]` from reverting to `opacity: 0`
- Roving tabindex on filter toolbar, `aria-pressed`, `aria-live="polite"` live region

### Modal Focus Management
- Focus to close button via `transitionend` event (filters `propertyName === 'visibility'`) — NOT `setTimeout`. Calling `focus()` on `visibility: hidden` element silently fails
- `tabindex="-1"` on `.project-modal__dialog` for WCAG focusable-content compliance
- Focus restores to `.project-card__details-btn` on close
- `data/` directory must be copied to `_site/` in deploy (required for `fetch("data/projects.json")` on GitHub Pages)

### Focus Accessibility
- Permanent transparent outline on `a`/`button` in `reset.css`; `:focus-visible` changes only `outline-color`
- **Gotcha**: Components with own `transition` declarations must include `outline-color` explicitly — CSS `transition` property replaces, not merges
- `.btn` excluded from `main.css` theme transition group (component-level transition takes precedence)
- High-contrast focus outline (`--focus-outline-color-high-contrast`) on colored backgrounds (primary buttons, active filter buttons)

### Contact Form
- Formspree submission (`fetch` POST with JSON, `action`+`method="POST"` as no-JS fallback)
- **Honeypot**: `_gotcha` field — if filled, silently show success without sending (don't reveal detection to bots)
- Hybrid HTML5 + Constraint Validation API for email (`validity.typeMismatch` — no custom regex)
- Blur validation per field; `validateForm()` on submit focuses first invalid field

### Testing
- Playwright E2E with Page Object Models (`FilterPage.js`, `ModalPage.js`, `FormPage.js`)
- Test server on port 4173 (`scripts/serve.js`), started automatically by Playwright `webServer` config
- `axe-core` WCAG 2.1 AA scanning in `axe-scan.spec.js` suites — tests both light and dark themes explicitly via `setTheme()`
- `waitForScrollAnimations()` (700ms) before axe scans prevents false color-contrast failures from opacity transitions
- After changing `tech[]` in `projects.json`, run tests — `techPillsCount` assertions in `modal/basic-modal.spec.js` may need updating

### Critical CSS Inlining
- Critters inlines above-fold CSS; full CSS loads async via `media="print" onload="this.media='all'"`
- **Gotcha**: Critters misses CSS custom property blocks — `inline-css.js` post-processes to inject `[data-theme="light"]` variable overrides
- `--restore` mode strips inline artifacts for watch mode development
- `cleanInlineArtifacts()` ensures idempotency

### SEO
- Google Search Console (meta tag verified) + Bing Webmaster (GSC import). Sitemaps submitted to both
- `robots.txt` blocks `/freecodecamp/`, `/frontendmentor/`, `/MDN/`, `/other/`, `/docs/`
- JSON-LD: `Person` + `WebSite` schemas in `@graph` array. Fragment IDs `#person`, `#website`
- Open Graph + Twitter Card meta tags. Validation checklist: `docs/SEO_TESTING.md`
- `sitemap.xml` `<lastmod>` auto-updated from git history on each build

### Adding New Projects
1. Add `<article class="project-card" data-category="..." data-project="id" data-updated="YYYY-MM">` to `index.html` — copy structure from existing card
2. Include: header (category badge + links), title, description, tech list, footer (time + optional status badge + optional details-btn with `aria-haspopup="dialog"`)
3. For modal support: add entry to `data/projects.json` keyed by `data-project` value, with `title`, `category`, `description[]`, `highlights[]`, `tech[]`, `links{}`, `screenshots[]`, `status`, `updated`

<!-- END AUTO-MANAGED -->

<!-- MANUAL -->
## Custom Notes

Add project-specific notes here. This section is never auto-modified by the memory system.

<!-- END MANUAL -->
