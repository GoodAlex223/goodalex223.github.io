# BACKLOG

**Last Updated**: 2026-02-02

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
- [ ] Minify CSS for production
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

- [ ] Centralized reset function — Extract `resetFilter()` function to DRY up toggle-to-reset click handler and Escape key handler (both use same 4-line sequence)
- [ ] Keyboard shortcut documentation — Add visible hint or help tooltip showing Escape key resets filter (improves discoverability)

### From PERF-001: Self-host Google Fonts (2026-01-29)
**Origin**: docs/archive/plans/2026-01-29_perf-001-self-host-fonts.md

- [x] ~~Add font preload hint for inter-latin.woff2~~ *(completed 2026-02-02, PERF-002)*
- [ ] Update PROJECT.md external dependencies — Remove Google Fonts CDN, document self-hosted fonts

### From PERF-002: Font Preload Hint (2026-02-02)
**Origin**: docs/archive/plans/2026-02-02_perf-002-font-preload-hint.md

- [ ] Inline critical CSS — Inline above-the-fold styles in `<head>` and load full CSS asynchronously for faster first paint
- [ ] Monitor with Lighthouse CI — Set up automated Lighthouse checks to catch performance regressions

### From PERF-003: Bundle CSS Files (2026-02-03)
**Origin**: docs/planning/plans/2026-02-03_perf-003-bundle-css.md

- [ ] Add CSS minification with cssnano — Reduces file size further for production
- [ ] Add cache-busting with content hash — Filename includes hash (e.g., `style.abc123.css`) for reliable cache invalidation

### From SEO-001: robots.txt & sitemap.xml (2026-01-29)
**Origin**: docs/archive/plans/2026-01-29_seo-001-robots-sitemap.md

- [ ] Automate sitemap lastmod updates — Pre-commit hook or script to update `sitemap.xml` lastmod from git history when `index.html` changes
- [ ] Expand sitemap for future pages — Add entries when blog or project detail pages are created
- [x] ~~Google Search Console verification~~ *(completed 2026-02-04, SEO-003)*

### From SEO-003: Google Search Console Verification (2026-02-04)
**Origin**: docs/archive/plans/2026-02-04_seo-003-google-search-console.md

- [ ] Add Bing Webmaster Tools verification — Similar meta tag for Microsoft search engine coverage

### Accessibility

- [ ] Improve focus indicators
- [ ] Test with screen readers
- [ ] Add aria-live regions for dynamic content

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

- [ ] Centralize filter activation logic — Single `activateFilter(button, category)` function to reduce risk of future desync between toggle-to-reset and normal click paths
- [ ] Automated accessibility regression tests — Playwright tests verifying focus/tabindex sync after all filter interactions

---

## From FEAT-003: Enhanced Filter Animations (2026-02-03)
**Origin**: docs/planning/plans/2026-02-03_feat-003-enhanced-filter-animations.md

- [ ] Playwright animation tests — Add tests verifying filter animation timing, visual states, and rapid click handling

---

## From BUG-003: Filter Animation Fix (2026-02-04)
**Origin**: BUG-003 implementation

- [ ] CSS specificity documentation — Add a comment block in components.css explaining the specificity hierarchy between scroll and filter animation systems (prevents future developers from reordering sections)
- [ ] Animation integration tests — Add Playwright tests that verify filter animations are visible (check computed opacity/transform during animation) to catch CSS specificity regressions

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

## From SEO-004: Improve Meta Descriptions (2026-02-04)
**Origin**: docs/archive/plans/2026-02-04_seo-004-improve-meta-descriptions.md

- [ ] Track description character counts in CLAUDE.md — Add reference table of all description lengths to catch regressions when modified
- [ ] Social card preview testing — Validate OG/Twitter card rendering using Facebook Debugger and Twitter Card Validator after deployment

---

## Bug Fixes

- [x] ~~Fix theme switch button overlapping other header buttons~~ *(completed 2026-02-02, BUG-001)*

---

## Technical Debt

- [ ] Add automated link checking
- [ ] Set up Lighthouse CI
- [ ] Create development build script
- [ ] Add CSS linting (Stylelint)

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

## Notes

~~**GitHub Profile README**: Consider updating [GoodAlex223/GoodAlex223](https://github.com/GoodAlex223/GoodAlex223) repository README to mention AI-assisted development workflows.~~ **DONE** (2026-01-20) - Updated with professional overview, tech stack, featured projects, and AI-assisted development mention.
