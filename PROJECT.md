# PROJECT.md

Project-specific configuration for the portfolio website.

**Last Updated**: 2026-01-20

---

## Project Overview

Personal portfolio website showcasing software development projects. Built with vanilla HTML, CSS, and JavaScript for simplicity, performance, and demonstrating frontend fundamentals.

### Tech Stack

| Component | Technology |
|-----------|------------|
| Markup | HTML5 |
| Styling | CSS3 (Custom Properties, Grid, Flexbox) |
| JavaScript | Vanilla ES6+ |
| Hosting | GitHub Pages |
| Fonts | Inter (Google Fonts) |

---

## Project Structure

| Component | Location | Purpose |
|-----------|----------|---------|
| Entry Point | `index.html` | Main portfolio page |
| Styles | `css/` | Modular CSS architecture |
| Scripts | `js/main.js` | Dynamic year, future enhancements |
| Projects | `frontendmentor/`, `freecodecamp/`, `MDN/` | Learning projects |
| Docs | `docs/` | Documentation |

---

## Commands

### Development

```bash
# Start local server (Python)
python -m http.server 8000

# Start local server (Node)
npx serve

# Open in browser
open http://localhost:8000
```

### Deployment

```bash
# Deploy to GitHub Pages (automatic on push to main)
git add .
git commit -m "Update portfolio"
git push origin main
```

---

## Critical Systems (Tier Classification)

| Tier | Description | Examples | Modification Rules |
|------|-------------|----------|-------------------|
| 1 | Critical | Contact info, external links | Verify all links work |
| 2 | Important | Project descriptions | Ensure accuracy |
| 3 | Standard | Styling, layout | Standard workflow |
| 4 | Low-risk | Comments, documentation | Proceed with normal care |

---

## Project-Specific Conventions

### CSS Architecture

| File | Purpose |
|------|---------|
| `variables.css` | Design tokens (colors, spacing, typography) |
| `reset.css` | Browser normalization |
| `utilities.css` | Reusable utility classes |
| `components.css` | UI components (cards, buttons) |
| `main.css` | Layout, responsive styles |

### Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| CSS Classes | BEM-like | `.project-card__title` |
| CSS Variables | kebab-case | `--color-accent` |
| Data attributes | kebab-case | `data-category="iot"` |

### Code Patterns

- **Mobile-first**: Base styles for mobile, `min-width` media queries for larger screens
- **CSS Custom Properties**: All colors, spacing, typography as variables
- **Semantic HTML**: Use `<article>`, `<section>`, `<nav>` appropriately
- **Inline SVG**: Icons embedded in HTML for styling flexibility

---

## External Dependencies

### Fonts

| Service | Purpose | URL |
|---------|---------|-----|
| Google Fonts | Inter font family | fonts.googleapis.com |

### External Links

| Destination | Purpose |
|-------------|---------|
| GitHub | Project repositories |
| LinkedIn | Professional profile |
| Wokwi | Arduino simulations |
| Frontend Mentor | Challenge profile |
| Vercel | Live demos |

---

## Browser Support

| Browser | Minimum Version |
|---------|-----------------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |

---

## Accessibility Requirements

- Skip link for keyboard navigation
- Focus visible states on all interactive elements
- Reduced motion support (`prefers-reduced-motion`)
- Sufficient color contrast (WCAG AA)
- Semantic HTML structure

---

## Performance Targets

| Metric | Target |
|--------|--------|
| First Contentful Paint | < 1.5s |
| Largest Contentful Paint | < 2.5s |
| Total Page Size | < 200KB |
| Lighthouse Performance | > 90 |
| Lighthouse Accessibility | > 90 |

---

## Deployment

### Environments

| Environment | URL | Branch |
|-------------|-----|--------|
| Production | goodalex223.github.io | main |
| Local Dev | localhost:8000 | any |

### Pre-deployment Checklist

- [ ] All links working
- [ ] Responsive design tested (375px, 768px, 1920px)
- [ ] No console errors
- [ ] HTML validates (W3C)
- [ ] Lighthouse score > 90

---

## Contact / Ownership

| Role | Contact |
|------|---------|
| Maintainer | Alexey Minakov (@GoodAlex223) |

---

*For universal Claude Code rules, see [CLAUDE.md](.claude/CLAUDE.md).*
*For documentation index, see [docs/README.md](docs/README.md).*
