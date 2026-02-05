# PROJECT.md

Project-specific configuration for the portfolio website.

**Last Updated**: 2026-02-05

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
| Error Page | `404.html` | Custom 404 error page |
| CSS Source | `css/` | Modular CSS architecture (source files) |
| CSS Output | `dist/style.css` | Bundled CSS (built, gitignored) |
| Scripts | `js/main.js` | Theme toggle, filtering, animations |
| Fonts | `fonts/` | Self-hosted Inter WOFF2 files |
| Build Config | `package.json`, `postcss.config.js` | PostCSS build configuration |
| CI/CD | `.github/workflows/deploy.yml` | GitHub Actions deployment |
| SEO | `robots.txt`, `sitemap.xml` | Search engine configuration |
| PWA | `site.webmanifest` | Progressive Web App manifest |
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
| 1 | Critical | Contact info, external links, SEO metadata | Verify all links work |
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
| CSS Classes | BEM-like | `.project-card__title`, `.btn--primary` |
| CSS Variables | kebab-case | `--color-accent`, `--space-4` |
| Data attributes | kebab-case | `data-category="backend"`, `data-animate` |

### Data Attributes

| Attribute | Used On | Purpose |
|-----------|---------|---------|
| `data-theme` | `<html>` | Current theme (`"light"` or `"dark"`) |
| `data-category` | `.project-card` | Project category for filtering and styling |
| `data-filter` | `.filter-btn` | Filter button target category |
| `data-animate` | Various elements | Marks element for scroll-triggered animation |
| `data-animate-delay` | Various elements | Stagger delay in milliseconds (e.g., `"50"`) |
| `data-updated` | `.project-card` | Last update date (e.g., `"2026-01"`) |
| `data-status` | `.project-card` | Project status (e.g., `"active"`) |

### Code Patterns

For detailed documentation of all design patterns (theme system, filtering, scroll animations, accessibility, performance), see the "Detected Patterns" section in [CLAUDE.md](CLAUDE.md).

---

## External Dependencies

### Fonts

Fonts are self-hosted in `fonts/` directory (no external CDN):

| File | Purpose |
|------|---------|
| `inter-latin.woff2` | Inter font (Latin subset) |
| `inter-latin-ext.woff2` | Inter font (Latin Extended subset) |

### External Services

| Service | Purpose | Used In |
|---------|---------|---------|
| GitHub | Project repositories, profile | Project cards, contact |
| LinkedIn | Professional profile | Contact section |
| Telegram | Contact channel | Contact section |
| Wokwi | Arduino simulations, maker profile | Project cards, contact |
| Vercel | Live demo hosting | Project cards |
| Google Search Console | Search indexing and insights | `<meta>` verification tag |

---

## SEO Configuration

| File | Purpose |
|------|---------|
| `robots.txt` | Allows indexing of main site, blocks learning project directories |
| `sitemap.xml` | Homepage URL with monthly update frequency |
| JSON-LD | `Person` + `WebSite` structured data in `index.html` `<head>` |
| Open Graph | `og:title`, `og:description`, `og:image` (1200x630) for social sharing |
| Twitter Card | `summary_large_image` card type |
| Canonical URL | `<link rel="canonical">` pointing to production URL |
| Google Search Console | HTML meta tag verification |

---

## PWA & Favicon Configuration

| File | Purpose |
|------|---------|
| `site.webmanifest` | App name, maskable icons (192x192, 512x512), standalone display |
| `favicon.svg` | Vector favicon (scalable) |
| `favicon-96x96.png` | Standard PNG favicon |
| `favicon.ico` | Legacy fallback |
| `apple-touch-icon.png` | iOS home screen icon (180x180) |

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
- Focus visible states on all interactive elements (theme-aware, high-contrast on colored backgrounds)
- Reduced motion support (`prefers-reduced-motion`)
- Sufficient color contrast (WCAG AA)
- Semantic HTML structure
- ARIA live regions for dynamic content (filter results)
- Roving tabindex and keyboard navigation (Arrow keys, Home, End, Escape)
- Screen reader optimized labels (`aria-label`, `aria-pressed`, `aria-hidden`)

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
| Production | https://goodalex223.github.io | Push to `main` (via GitHub Actions) |
| Local Dev | http://localhost:8000 | Manual (`npm run build` + server) |

### CI/CD Pipeline

GitHub Actions workflow (`.github/workflows/deploy.yml`) — two-job pipeline:

**Build job:**
1. Checkout code
2. Setup Node.js 20 (with npm cache)
3. `npm ci` (install dependencies)
4. `npm run build` (bundle CSS)
5. Configure GitHub Pages
6. Upload build artifact

**Deploy job** (runs after build):
7. Deploy artifact to GitHub Pages

### Pre-deployment Checklist

- [ ] CSS builds without errors (`npm run build`)
- [ ] All links working
- [ ] Responsive design tested (375px, 768px, 1920px)
- [ ] No console errors
- [ ] Theme toggle works (light/dark, persists on reload)
- [ ] Filter buttons work (all categories, URL hash, back/forward)
- [ ] Keyboard navigation works (Tab, Arrow keys, Escape on filters)
- [ ] Scroll animations trigger on viewport entry
- [ ] Favicons display correctly
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
