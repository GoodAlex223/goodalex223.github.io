# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

<!-- AUTO-MANAGED: project-description -->
## Overview

**Personal Portfolio Website** for Alexey Minakov — a static site showcasing software development projects, built with vanilla HTML, CSS, and JavaScript.

- **Live Site**: [goodalex223.github.io](https://goodalex223.github.io)
- **Tech Stack**: HTML5, CSS3 (Custom Properties, Grid, Flexbox), Vanilla ES6+
- **Hosting**: GitHub Pages (auto-deploys on push to `main`)

<!-- END AUTO-MANAGED -->

<!-- AUTO-MANAGED: build-commands -->
## Build & Development Commands

```bash
# Start local server (Python)
python -m http.server 8000

# Start local server (Node)
npx serve
```

**Deployment**: Automatic via GitHub Pages on push to `main` branch.

<!-- END AUTO-MANAGED -->

<!-- AUTO-MANAGED: architecture -->
## Architecture

```
goodalex223/
├── index.html              # Main portfolio page (single-page site)
├── robots.txt              # Search engine crawler rules
├── sitemap.xml             # XML sitemap for search engines
├── css/
│   ├── main.css            # Entry point, imports + layout styles
│   ├── variables.css       # Design tokens (colors, spacing, typography)
│   ├── reset.css           # Browser normalization
│   ├── utilities.css       # Reusable utility classes
│   └── components.css      # UI components (cards, buttons, links)
├── js/
│   └── main.js             # Theme toggle, project filtering, scroll animations, copyright year
├── docs/                   # Project documentation
├── freecodecamp/           # Learning projects (FreeCodeCamp)
├── frontendmentor/         # Learning projects (Frontend Mentor)
├── MDN/                    # Learning projects (MDN tutorials)
└── other/                  # Miscellaneous experiments
```

**Key Files**:
- [index.html](index.html) — Main portfolio page
- [css/main.css](css/main.css) — CSS entry point (uses `@import`)
- [css/variables.css](css/variables.css) — Design tokens
- [robots.txt](robots.txt) — Search engine crawler directives
- [sitemap.xml](sitemap.xml) — Site structure for SEO
- [PROJECT.md](PROJECT.md) — Project configuration

<!-- END AUTO-MANAGED -->

<!-- AUTO-MANAGED: conventions -->
## Code Conventions

### CSS Naming
| Element | Convention | Example |
|---------|------------|---------|
| Classes | BEM-like | `.project-card__title`, `.btn--primary` |
| Variables | kebab-case | `--color-accent`, `--space-4` |
| Data attributes | kebab-case | `data-category="backend"`, `data-animate`, `data-animate-delay="50"` |

### CSS Architecture
CSS uses `@import` in `main.css` to compose modular files:
1. `variables.css` — Design tokens
2. `reset.css` — Browser normalization
3. `utilities.css` — Utility classes
4. `components.css` — UI components
5. `main.css` — Layout and section styles

### HTML Structure
- Semantic elements: `<article>`, `<section>`, `<nav>`, `<header>`, `<footer>`
- Skip link for accessibility
- Inline SVG icons for styling flexibility

### Theme System
- **Data attribute**: `data-theme="light"` or `data-theme="dark"` on `<html>`
- **Theme variables**: Defined in `variables.css` with fallback to `prefers-color-scheme`
- **Persistence**: User preference stored in `localStorage.theme`
- **Initialization**: Inline script in `<head>` prevents FOUC (Flash of Unstyled Content)
- **Dynamic meta**: Updates `theme-color` meta tag for mobile browser chrome
- **System sync**: Listens for system preference changes when no explicit user choice

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
- **Buttons**: `.btn` base class with `--primary` and `--secondary` modifiers
- **Filter Buttons**: `.filter-btn` for project filtering
  - Active state: `.filter-btn--active` with category-colored backgrounds
  - Category colors match project card badges (backend, iot, web, tools)
  - ARIA attributes: `aria-pressed` for screen readers
  - Single-select with toggle-to-reset behavior (clicking active filter resets to "all")
- **Theme Toggle**: `.theme-toggle` button with icon transitions (sun/moon)
  - Icons swap via opacity/transform based on `[data-theme]` attribute
  - Updates `aria-label` dynamically for accessibility
- **Accessibility**: `prefers-reduced-motion` media query, focus visible states, ARIA labels

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
Client-side category filtering with immediate layout reflow:
1. **Filter Buttons**: `.filter-btn` with `data-filter` attribute (all, backend, iot, web, tools)
2. **Active State**: Single-select with `.filter-btn--active` class, category-colored backgrounds
3. **Animation**: Immediate reflow with smooth transitions
   - Hidden cards: `.project-card--hidden` uses `position: absolute` + `visibility: hidden`
   - Removes hidden cards from layout flow immediately (visible cards fill gaps)
   - Smooth opacity + scale transition for visual feedback
4. **Toggle Behavior**: Clicking active category filter resets to "all"
5. **Accessibility**: `aria-pressed` attributes, `role="group"` on filter container

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

### SEO Configuration
**robots.txt**: Controls search engine crawling
- Allows all crawlers to index main site (`Allow: /`)
- Blocks learning project directories: `/freecodecamp/`, `/frontendmentor/`, `/MDN/`, `/other/`, `/docs/`
- References sitemap location: `https://goodalex223.github.io/sitemap.xml`

**sitemap.xml**: XML sitemap for search engines
- Lists homepage with monthly update frequency
- Priority: 1.0 (highest)
- Last modified: 2026-01-28

**Meta tags** (in `index.html`):
- Open Graph: `og:image`, `og:title`, `og:description`
- Twitter Card: `twitter:card="summary_large_image"`
- Structured data for rich social previews

### Adding New Projects
Add project card to `index.html` projects section:
```html
<article class="project-card" data-category="backend">
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
</article>
```

<!-- END AUTO-MANAGED -->

<!-- MANUAL -->
## Custom Notes

Add project-specific notes here. This section is never auto-modified by the memory system.

<!-- END MANUAL -->
