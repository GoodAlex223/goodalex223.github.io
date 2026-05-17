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
npm run check-links       # Check all external links in index.html + projects.json (HEAD→GET fallback, 3 retries)
npm run check-assets      # Check all internal asset refs in HTML + projects.json exist on disk (requires `npm run build` first)
npm run validate-backlog  # Validate BACKLOG.md Origin paths (reads git index; prints OK/skipped/violations)
npx serve              # Local server (or python -m http.server 8000)
```

**Build pipeline**: `update-sitemap` → `build:css` (PostCSS + cssnano) → `unhash` → `inline:css` (Critters critical CSS) → `hash:assets` (SHA-256 content hashes + terser JS minification) → `report-sizes` (budget: CSS gzip 20 KB, JS gzip 10 KB; appends to `docs/size-history.json`). Outputs `dist/style.[hash].css` and `dist/main.[hash].js`.

**CI/CD** (`.github/workflows/deploy.yml`): lint (CSS + JS + validate-backlog) → build → (check-links + test + lighthouse in parallel) → deploy to GitHub Pages. The `check-links` job runs both the external URL checker and the internal asset checker after downloading the build artifact. All gates must pass.

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
├── scripts/                      # Build utilities (hash-assets, inline-css, report-sizes, update-sitemap, serve, check-links, check-assets, validate-backlog-paths)
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
- **Ignores**: `dist/**`, `node_modules/**`, `eslint.config.js`, `commitlint.config.js`, `lighthouserc.js`, `playwright.config.js`, `postcss.config.js` — root config files outside the 3 environments are excluded to prevent false-positive `no-undef` errors
- **Auto-fix**: lint-staged runs ESLint fix on commit via husky pre-commit hook; scoped to `{js,scripts,tests}/**/*.js` (root config files are excluded)

### Commits
- Conventional Commits via commitlint + husky `commit-msg` hook
- Types: `feat`, `fix`, `docs`, `chore`, `style`, `test`, `build`, `ci`, `perf`, `refactor`, `revert`
- Header: 72 chars max. Uppercase subjects allowed (`subject-case` disabled)
- **Pre-commit hook** (`.husky/pre-commit`): runs `npx lint-staged || exit 1`, then conditionally runs `npm run validate-backlog` only when `BACKLOG.md` is staged. Uses `if/fi` (not `&&`) to prevent grep's non-zero exit from aborting commits when `BACKLOG.md` is not staged (see "Shell Gotchas" for the general pattern). Grep pattern is `-qE '(^|/)BACKLOG\.md$'` (anchored basename, escaped dot — avoids false matches on `OLD_BACKLOG.md` etc.)
- **Pre-commit BACKLOG validation**: `scripts/validate-backlog-paths.js` runs when `BACKLOG.md` is staged — reads git index via `git show :path`. If `git show` fails and we are inside a git repo, treats file as absent (skip — handles staged deletion and `git rm --cached`); only falls back to working-tree read when git is entirely unavailable. Blocks commits if any `**Origin**` line (column 0 or with optional `-`/`*`/`+` bullet) contains a path in `FORBIDDEN_ORIGIN_PATHS` denylist: `['docs/planning/plans/', 'docs/superpowers/']`. Detection regex `/^\s*(?:[-*+]\s+)?\*\*Origin\*\*/` is anchored to line start — inline backtick mentions of `**Origin**:` mid-line do not false-positive. Other mentions of forbidden paths on non-`**Origin**` lines are allowed. Also runs as `npm run validate-backlog` and in CI `lint` job (closes `--no-verify` bypass)

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
- Permanent transparent outline in base rule; `:focus-visible` changes only `outline-color` — applies to `a`/`button` (`reset.css`) and `.contact-form__input` (`form.css`)
- **Gotcha**: Components with own `transition` declarations must include `outline-color` explicitly — CSS `transition` property replaces, not merges
- **Gotcha**: Components with own `transition` declarations must also include `color` if they display text — omitting it causes text to snap on theme switch while borders/background animate (`.contact-form__input` and `.btn` both include `color` in their component-level transitions)
- `.btn` excluded from `main.css` theme transition group (component-level transition takes precedence)
- High-contrast focus outline (`--focus-outline-color-high-contrast`) on colored backgrounds (primary buttons, active filter buttons)

### Contact Form
- Formspree submission (`fetch` POST with JSON, `action`+`method="POST"` as no-JS fallback)
- **Honeypot**: DOM field `#contact-phone` (`_gotcha` Formspree name) — if filled, silently show success without sending (don't reveal detection to bots)
- Hybrid HTML5 + Constraint Validation API for email (`validity.typeMismatch` — no custom regex)
- **Validation rules**: name ≥ 2 chars, message ≥ 10 chars; blur validation only fires after prior interaction (empty-field blur does NOT show error); submit validates all fields regardless
- `validateForm()` on submit focuses first invalid field; sets `aria-invalid="true"` + `.contact-form__input--invalid` class
- **Submission state machine**: form visible → loading (submit disabled, spinner `.contact-form__submit-loading` shown) → form hidden, `#contact-form-status` shown. Success: "Send another message" (resets form, focuses `#contact-name`). Error: "Try again" (resets form). Focus moves to `.contact-form__status-action` automatically after submission
- Status icons (success/error) are inline SVGs injected via `icon.innerHTML` in `showFormStatus()` — not Unicode characters. SVGs use `stroke="currentColor"` to inherit color from modifier classes and `aria-hidden="true"` to hide from screen readers (consistent with all other inline SVGs in the codebase)

### Testing
- Playwright E2E with Page Object Models (`FilterPage.js`, `ModalPage.js`, `FormPage.js`)
- Test server on port 4173 (`scripts/serve.js`), started automatically by Playwright `webServer` config
- `axe-core` WCAG 2.1 AA scanning in `axe-scan.spec.js` suites — tests light, dark, and reduced-motion explicitly. Modal suite scopes scans to `#project-modal` (`MODAL_SCOPE`) to avoid false positives from semi-transparent backdrop altering perceived contrast of background cards
- **Scroll animation wait**: use `waitForScrollAnimations(page)` from `tests/utils/timing.js` — polls DOM until every `[data-animate]` element whose visible fraction meets the production IntersectionObserver threshold (`threshold: 0.1` + `rootMargin: "0px 0px -50px 0px"` from `js/main.js:583-587`) has computed opacity 1, capturing both `.is-visible` class addition AND the 400ms opacity transition (class-only polling let axe-core sample mid-transition colors on WebKit; opacity polling without the threshold-match let sub-threshold elements like a focus-scrolled `contact__intro` hang the poll because the observer would never fire for them). Short-circuits instantly under reduced motion (no-op — CSS sets opacity:1 unconditionally there anyway). Filter-hidden cards (`.project-card--hidden` → `visibility: hidden; position: absolute`) are skipped via explicit class check mirroring `js/main.js:595`. Zero-dimension elements are skipped to prevent div-by-zero in the ratio. Used in outer `beforeEach` of filter, modal, and form axe-scan suites. Replaces `fp.waitForScrollAnimations()` / `mp.waitForScrollAnimations()` POM methods (700ms fixed timeout) for suite-level setup
- **Filter animation wait**: use `waitForAnimationComplete(page)` from `tests/utils/timing.js` — polls DOM for absence of `.project-card--filtering-out`, `.project-card--filtering-in`, `.project-card.is-filtering` classes (default 5s timeout). Uses 50ms initial delay to let click handler setTimeout callbacks fire before polling. Immune to browser timing variance, eliminates Firefox flaky failures. Do NOT use fixed timeouts for filter animations. Filter axe-scan keyboard nav test uses `waitForAnimationComplete(page)` then `waitForScrollAnimations(page)` (animation completes first, then scroll animations settle)
- **Rapid-click filter testing**: `fp.clickFilterNoWait(category)` clicks without waiting (used to test mid-animation state); `fp.rapidClickFilters(categories[])` clicks sequentially then waits once. Mid-animation interruption test (`rapid-clicks.spec.js`) wraps assertions in `expect(async () => {...}).toPass({ timeout: 10000 })` to handle Firefox timing variance where overlapping animation cleanup callbacks briefly produce wrong counts
- **Reduced-motion axe pattern**: outer `beforeEach` runs first (creates POM, `goto()`, `waitForScrollAnimations(page)` from timing.js); inner reduced-motion `beforeEach` calls `enableReducedMotion()` then `goto()` to reload with the media query active — no re-creation of POM or second `waitForScrollAnimations()` needed
- **WebKit axe color-contrast flake (reduced-motion + active filter)**: after `fp.clickFilter()` under reduced motion, call `fp.setTheme("light")` before `checkAccessibility()`. WebKit races: axe samples interpolated colors during the `--active` class swap on filter buttons. `setTheme()` sets `data-theme` on `<html>` and waits 400ms for style computation to settle, eliminating false-positive color-contrast failures. Applied in `tests/filter/axe-scan.spec.js` (Reduced motion describe) and `tests/filter/reduced-motion.spec.js`
- After changing `tech[]` in `projects.json`, run tests — `techPillsCount` assertions in `modal/basic-modal.spec.js` may need updating
- **FormPage POM** (`tests/pages/FormPage.js`): use `mockFormspreeSuccess()`, `mockFormspreeError(statusCode)`, `mockFormspreeNetworkError()` to intercept Formspree requests in form tests. Use `mockFormspreeDeferred()` for loading-state tests — returns a `releaseRoute` function that holds the response open until called, enabling unbounded-time assertions on loading UI without fixed timeouts (avoids WebKit flakiness where click→assert overhead exceeds a fixed delay). Always call `releaseRoute()` before any assertion that waits on the response, or the test will hang until Playwright's per-test timeout. `goto()` waits for filter button counts to confirm JS is initialized (cross-component dependency)
- **Form axe-scan suite** (`tests/form/axe-scan.spec.js`): 7 WCAG states — default, validation errors, success, error, light theme, dark theme, reduced motion. Uses a flat structure (single outer `beforeEach` with `fp.goto()` + `waitForScrollAnimations(page)`); reduced-motion test calls `enableReducedMotion()` then `fp.goto()` inline in the test body — no inner `beforeEach`, no extra `waitForScrollAnimations(page)` after `goto()` (animations are instant under reduced motion). All tests use `fp.goto()` (not `fp.page.goto()`) to ensure consistent JS-initialized state

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

### Link Checkers (`scripts/check-links.js` + `scripts/check-assets.js`)
- Extracts external URLs from `index.html` (`href="https://..."`) and `data/projects.json` (`links{}` values), deduplicates, checks concurrently (5 at a time)
- **HEAD→GET fallback**: tries HEAD first; falls back to GET on any non-OK HEAD response (many servers mishandle HEAD — e.g., Wokwi returns 404 for HEAD but 200 for GET)
- **Retry logic**: 3 attempts with 2s delay between retries before marking a URL as broken
- **LinkedIn skip-list**: LinkedIn returns HTTP 999 for all bots regardless of URL validity — these URLs are skipped with a warning, not treated as failures
- **User-Agent header**: required for Wokwi (blocks bare `fetch()` requests)
- **Internal asset check** (`scripts/check-assets.js`, `npm run check-assets`): scans `index.html`, `404.html`, and `data/projects.json` for `href`/`src` attributes and `screenshots[].src` values, resolves each against the repo root, and verifies existence via `fs.existsSync` + a `realpathSync.native()` full-path case check (catches both basename and directory-segment case mismatches on macOS/Windows; on Linux wrong-cased refs already fail `existsSync`). Excludes: external URLs (`http(s)://`, `//`), `mailto:`/`tel:`, `data:` URIs, in-page anchors (`#foo`), and homepage-nav (`/`, `/#foo`). Requires `npm run build` to have run first so hashed `dist/` refs exist on disk. **dist/ preflight**: `checkDistPreflight()` runs before processing refs — exits immediately with "dist/ missing or incomplete — run `npm run build` first" if `dist/` is absent or empty; if a `dist/` ref fails despite the preflight, a one-time inline hint "dist/ may be stale — run `npm run build` to refresh hashed assets" is shown. **HTML regex scope**: `extractHtmlRefs()` matches `href=`/`src=` across all raw HTML text, including inside `<script>` blocks and JSON-LD payloads — today the repo has no false positives (verified PR #65), but a future JSON-LD addition with `href`/`src` keys could need a stricter parser. **JSON guard**: `extractJsonRefs()` skips non-object values in `projects.json` before checking for `screenshots[]`.
- **CI job**: the `check-links` workflow job runs both checkers sequentially after `build` completes. Downloads the `build-output` artifact so internal-asset resolution sees the same hashed `dist/` files the deploy step will ship.
- Exits non-zero on any broken link or missing asset; CI gates deploy behind both checks

### BACKLOG Origin Paths
- `**Origin**` lines in `BACKLOG.md` must reference `docs/archive/plans/` (completed plan archive). Two forbidden path prefixes enforced by denylist in `scripts/validate-backlog-paths.js`: `docs/planning/plans/` (active plans) and `docs/superpowers/` (Superpowers-skill staging directory — never a canonical Origin target)
- Validator reads git index (`git show :path`) to inspect staged content, not working-tree WIP. If `git show` fails and the repo is a git repo, the file is absent from index (staged for deletion or `git rm --cached`) — treated as absent (skip). Falls back to working-tree read only when git is entirely unavailable. Detection regex: `/^\s*(?:[-*+]\s+)?\*\*Origin\*\*/` — matches lines that start with `**Origin**` (after optional whitespace and optional bullet prefix `-`, `*`, or `+`); inline mentions of `**Origin**` mid-line are ignored
- Runs three ways: pre-commit hook (when `BACKLOG.md` is staged), `npm run validate-backlog` (standalone/debug), and CI `lint` job step (closes `--no-verify` bypass). Prints `BACKLOG Origin paths: OK` on success, `skipped` message if absent, red violation block with `[matched: <path>]` annotation on failure
- To add a new forbidden path: append to `FORBIDDEN_ORIGIN_PATHS` array in `scripts/validate-backlog-paths.js`
- When extracting improvements to BACKLOG after task completion, always reference the archived path (plan moves to `docs/archive/plans/` during the Archive step of task completion workflow)

### Shell Gotchas

- **Conditional grep + `&&` aborts the chain on no-match**: When a pre-commit hook or CI step uses `grep ... && some-action`, the `&&` short-circuits on grep's exit code 1 (no matches found). On a fresh repo or unstaged-file commit, this *blocks every commit*, not just ones that should trigger the action. Fix: use `if grep ...; then ...; fi` so a no-match exit is treated as "skip", not "fail". Triggered by `.husky/pre-commit` validate-backlog conditional. See the Pre-commit hook bullet under "Commits" for the concrete pattern.

### Adding New Projects
1. Add `<article class="project-card" data-category="..." data-project="id" data-updated="YYYY-MM" data-animate data-animate-delay="NNN">` to `index.html` — copy structure from existing card. Increment `data-animate-delay` by 50ms per card (100, 150, 200, …)
2. Include: header (category badge + links), title, description, tech list, footer (time + optional status badge + optional details-btn with `aria-haspopup="dialog"`)
3. For modal support: add entry to `data/projects.json` keyed by `data-project` value, with `title`, `category`, `description[]`, `highlights[]`, `tech[]`, `links{}`, `screenshots[]`, `status`, `updated`

<!-- END AUTO-MANAGED -->

<!-- MANUAL -->
## Custom Notes

Add project-specific notes here. This section is never auto-modified by the memory system.

<!-- END MANUAL -->
