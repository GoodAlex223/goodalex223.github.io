# BACKLOG

**Last Updated**: 2026-01-29

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
- [ ] Filter count badges — Show number of projects per category on buttons
- [x] ~~Keyboard navigation~~ *(completed 2026-01-29, FEAT-002)*
- [ ] Enhanced filter animations — Add animations for project cards during filtering (appearance, disappearance, movement, and other transitions)
- [ ] Fix toggle-to-reset tabindex desync — When clicking an active filter to reset to "All", browser focus stays on the clicked button (`tabindex="-1"`) while "All" gets `tabindex="0"`, breaking the roving tabindex pattern. Fix: add `allButton.focus()` after `setActiveButton(allButton)` in the toggle-to-reset handler

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
- [ ] Bundle CSS files — Replace @import chain with single bundled CSS file for production (from HP-002 Lighthouse audit, 2026-01-26)
- [ ] Add font preload hint — `<link rel="preload">` for inter-latin.woff2 to start download earlier in critical path (from PERF-001, 2026-01-29)

### SEO

- [x] ~~Add structured data (JSON-LD)~~ *(completed 2026-01-29, SEO-002)*
- [x] ~~Create sitemap.xml~~ *(completed 2026-01-29, SEO-001)*
- [x] ~~Add robots.txt~~ *(completed 2026-01-29, SEO-001)*
- [ ] Improve meta descriptions

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

- [ ] Escape key to reset filter — Add Escape key handler to reset to "All" from any focused filter button
- [ ] Screen reader testing — Test keyboard navigation with NVDA/VoiceOver to verify live region announcements and roving tabindex behavior

### From PERF-001: Self-host Google Fonts (2026-01-29)
**Origin**: docs/archive/plans/2026-01-29_perf-001-self-host-fonts.md

- [ ] Add font preload hint for inter-latin.woff2 — Start font download earlier in critical rendering path
- [ ] Update PROJECT.md external dependencies — Remove Google Fonts CDN, document self-hosted fonts

### From SEO-001: robots.txt & sitemap.xml (2026-01-29)
**Origin**: docs/archive/plans/2026-01-29_seo-001-robots-sitemap.md

- [ ] Automate sitemap lastmod updates — Pre-commit hook or script to update `sitemap.xml` lastmod from git history when `index.html` changes
- [ ] Expand sitemap for future pages — Add entries when blog or project detail pages are created
- [ ] Google Search Console verification — Submit sitemap.xml for faster indexing and crawl monitoring

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

## Bug Fixes

- [ ] Fix theme switch button overlapping other header buttons — Occurs on both the main page and the 404 page; discovered on mobile (phone)

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
