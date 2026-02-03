# PROJECT.md

Project-specific configuration for the portfolio website.

**Last Updated**: 2026-02-03

---

## Project Overview

Personal portfolio website showcasing software development projects. Built with HTML, CSS, and JavaScript for simplicity, performance, and demonstrating frontend fundamentals.

### Tech Stack

| Component | Technology |
|-----------|------------|
| Markup | HTML5 |
| Styling | CSS3 (Custom Properties, Grid, Flexbox) |
| JavaScript | ES6+ |
| Build Tools | PostCSS (CSS bundling via postcss-import) |
| Hosting | GitHub Pages (via GitHub Actions) |
| Fonts | Inter (self-hosted WOFF2) |

---

## Project Structure

| Component | Location | Purpose |
|-----------|----------|---------|
| Entry Point | `index.html` | Main portfolio page |
| CSS Source | `css/` | Modular CSS architecture (source files) |
| CSS Output | `dist/style.css` | Bundled CSS (built, gitignored) |
| Scripts | `js/main.js` | Theme toggle, filtering, animations |
| Fonts | `fonts/` | Self-hosted Inter WOFF2 files |
| Build Config | `package.json`, `postcss.config.js` | PostCSS build configuration |
| CI/CD | `.github/workflows/deploy.yml` | GitHub Actions deployment |
| Projects | `frontendmentor/`, `freecodecamp/`, `MDN/` | Learning projects |
| Docs | `docs/` | Documentation |

---

## Commands

### Setup

```bash
# Install dependencies (required once)
npm install
```

### Development

```bash
# Build CSS (bundles css/*.css → dist/style.css)
npm run build

# Watch mode (auto-rebuild on CSS changes)
npm run watch

# Start local server (Python)
python -m http.server 8000

# Start local server (Node)
npx serve

# Open in browser
open http://localhost:8000
```

### Deployment

```bash
# Deploy to GitHub Pages (via GitHub Actions)
# Push to main triggers: npm ci → npm run build → deploy
git add .
git commit -m "Update portfolio"
git push origin main
```

**Note**: `dist/` is gitignored. CSS is built by GitHub Actions during deployment.

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

Source files in `css/` are bundled by PostCSS into `dist/style.css`:

| File | Purpose |
|------|---------|
| `main.css` | Entry point, imports other files, layout styles |
| `fonts.css` | @font-face declarations for Inter |
| `variables.css` | Design tokens (colors, spacing, typography) |
| `reset.css` | Browser normalization |
| `utilities.css` | Reusable utility classes |
| `components.css` | UI components (cards, buttons) |

**Build**: `npm run build` bundles all `@import` statements into single file.

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

Fonts are self-hosted in `fonts/` directory (no external CDN):

| File | Purpose |
|------|---------|
| `inter-latin.woff2` | Inter font (Latin subset) |
| `inter-latin-ext.woff2` | Inter font (Latin Extended subset) |

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

| Environment | URL | Trigger |
|-------------|-----|---------|
| Production | goodalex223.github.io | Push to `main` (via GitHub Actions) |
| Local Dev | localhost:8000 | Manual (`npm run build` + server) |

### CI/CD Pipeline

GitHub Actions workflow (`.github/workflows/deploy.yml`):
1. Checkout code
2. Setup Node.js 20
3. `npm ci` (install dependencies)
4. `npm run build` (bundle CSS)
5. Deploy to GitHub Pages

### Pre-deployment Checklist

- [ ] All links working
- [ ] Responsive design tested (375px, 768px, 1920px)
- [ ] No console errors
- [ ] CSS builds without errors (`npm run build`)
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
