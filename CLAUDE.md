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
├── css/
│   ├── main.css            # Entry point, imports + layout styles
│   ├── variables.css       # Design tokens (colors, spacing, typography)
│   ├── reset.css           # Browser normalization
│   ├── utilities.css       # Reusable utility classes
│   └── components.css      # UI components (cards, buttons, links)
├── js/
│   └── main.js             # Theme toggle, project filtering, scroll animations, dynamic copyright year
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
- [PROJECT.md](PROJECT.md) — Project configuration

<!-- END AUTO-MANAGED -->

<!-- AUTO-MANAGED: conventions -->
## Code Conventions

### CSS Naming
| Element | Convention | Example |
|---------|------------|---------|
| Classes | BEM-like | `.project-card__title`, `.btn--primary` |
| Variables | kebab-case | `--color-accent`, `--space-4` |
| Data attributes | kebab-case | `data-category="backend"` |

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
Progressive enhancement with Intersection Observer:
1. **Classes**: `.scroll-animate` for elements to animate, `.is-visible` when in viewport
2. **Staggered Delays**: `.scroll-animate--delay-1` through `--delay-4` (0ms, 75ms, 150ms, 225ms)
3. **Animation**: Fade-in with translateY(20px → 0) on scroll into view
4. **Targets**: Section titles, about content, project cards, skill groups, contact links
5. **Accessibility**: Respects `prefers-reduced-motion` (shows all immediately if enabled)
6. **Performance**: Uses Intersection Observer, unobserves after animation, double rAF for render timing
7. **Graceful Degradation**: Elements visible by default if JS fails or in print/reduced-motion mode

**SEO & Social Sharing**:
- Open Graph meta tags with `og:image`, `og:title`, `og:description`
- Twitter Card support with `twitter:card="summary_large_image"`
- Structured data for rich previews on social platforms

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
