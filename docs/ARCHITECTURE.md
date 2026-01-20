# Architecture

Technical architecture of the portfolio website.

---

## Overview

A static portfolio website built with vanilla HTML, CSS, and JavaScript. No build tools, no frameworks - just clean, modern web technologies.

```
┌─────────────────────────────────────┐
│           index.html                │
│  ┌─────────────────────────────┐    │
│  │   Header (sticky nav)       │    │
│  ├─────────────────────────────┤    │
│  │   Hero Section              │    │
│  ├─────────────────────────────┤    │
│  │   About Section             │    │
│  ├─────────────────────────────┤    │
│  │   Projects Grid             │    │
│  ├─────────────────────────────┤    │
│  │   Skills Grid               │    │
│  ├─────────────────────────────┤    │
│  │   Contact Section           │    │
│  ├─────────────────────────────┤    │
│  │   Footer                    │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

---

## CSS Architecture

### File Structure

```
css/
├── variables.css    # Design tokens
├── reset.css        # Browser normalization
├── utilities.css    # Utility classes
├── components.css   # Reusable components
└── main.css         # Layout + imports
```

### Import Order (main.css)

```css
@import "variables.css";  /* 1. Design tokens first */
@import "reset.css";      /* 2. Reset browser styles */
@import "utilities.css";  /* 3. Utility classes */
@import "components.css"; /* 4. Component styles */
/* 5. Layout styles in main.css itself */
```

### Design Tokens (variables.css)

| Category | Examples |
|----------|----------|
| Colors | `--color-bg-primary`, `--color-accent` |
| Typography | `--font-size-base`, `--font-weight-bold` |
| Spacing | `--space-1` through `--space-12` |
| Layout | `--container-max`, `--container-padding` |
| Effects | `--shadow-card`, `--transition-base` |
| Z-index | `--z-sticky`, `--z-modal` |

### Naming Convention

**BEM-like pattern:**
```
.block__element--modifier

Examples:
.project-card
.project-card__title
.project-card__tech
.btn--primary
.btn--secondary
```

---

## HTML Structure

### Semantic Elements

| Element | Usage |
|---------|-------|
| `<header>` | Site header with navigation |
| `<nav>` | Main navigation |
| `<main>` | Primary content |
| `<section>` | Each content section (hero, about, projects, etc.) |
| `<article>` | Project cards |
| `<footer>` | Site footer |

### Accessibility Features

1. **Skip Link**: First focusable element, jumps to main content
2. **ARIA Labels**: On icon-only links
3. **Focus States**: Visible outline on all interactive elements
4. **Reduced Motion**: Respects `prefers-reduced-motion`

---

## Responsive Design

### Breakpoints

| Name | Width | Columns |
|------|-------|---------|
| Mobile | 0-599px | 1 |
| Tablet | 600px+ | 2 |
| Desktop | 900px+ | 3-4 |
| Large | 1200px+ | Max width |

### Mobile-First Approach

```css
/* Base: Mobile */
.projects__grid {
  display: grid;
  gap: var(--space-5);
}

/* Tablet */
@media (min-width: 37.5em) {
  .projects__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop */
@media (min-width: 56.25em) {
  .projects__grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

---

## Components

### Project Card

```html
<article class="project-card" data-category="backend">
  <div class="project-card__header">
    <span class="project-card__category">Backend</span>
    <div class="project-card__links">
      <!-- GitHub, Wokwi, Demo links -->
    </div>
  </div>
  <h3 class="project-card__title">Project Name</h3>
  <p class="project-card__description">Description</p>
  <ul class="project-card__tech">
    <li>Tech 1</li>
    <li>Tech 2</li>
  </ul>
</article>
```

### Skill Group

```html
<div class="skill-group">
  <h3 class="skill-group__title">Category</h3>
  <ul class="skill-group__list">
    <li>Skill 1</li>
    <li>Skill 2</li>
  </ul>
</div>
```

---

## Icons

All icons are inline SVG for:
- No external requests
- CSS styling (stroke color from `currentColor`)
- Accessibility (aria-labels)

### Icon Set

| Icon | Usage |
|------|-------|
| GitHub (octocat path) | Repository links |
| External link | Demo/live site links |
| Play (polygon) | Wokwi simulation links |
| Lock | Private repository indicator |
| Email, LinkedIn, Telegram | Contact links |

---

## Performance Considerations

1. **No Framework**: Zero JavaScript bundle overhead
2. **System Fonts Fallback**: `Inter` with system font stack
3. **Inline SVG**: No icon font or sprite requests
4. **CSS Variables**: Single source of truth, efficient updates
5. **Minimal JS**: Only dynamic year update

---

## Future Considerations

- **Theme Toggle**: Add dark/light mode switch
- **Project Filters**: CSS-only or minimal JS filtering
- **Animations**: Intersection Observer for scroll animations
- **Performance**: Consider lazy loading for project images

---

*Last updated: 2026-01-20*
