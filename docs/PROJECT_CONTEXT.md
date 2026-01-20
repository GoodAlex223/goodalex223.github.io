# Project Context

Decisions, patterns, and context for the portfolio project.

---

## Key Decisions

### 2026-01-20: Portfolio Rebuild

**Decision**: Complete rebuild of portfolio from scratch

**Context**: Original portfolio was an 879-line monolithic HTML file featuring MDN/FreeCodeCamp learning exercises. User has significant real-world projects that weren't showcased.

**Approach Chosen**:
- Vanilla HTML/CSS/JS (no frameworks)
- Dark theme with accent color
- Mobile-first responsive design
- Modular CSS architecture

**Alternatives Considered**:
1. Static site generator (11ty, Astro) - Rejected: adds complexity, user familiar with vanilla
2. React SPA - Rejected: overkill for static portfolio, demonstrates fundamentals better
3. Incremental fixes - Rejected: too much technical debt in original

**Rationale**: Vanilla approach demonstrates frontend fundamentals (important for job applications), keeps deployment simple (GitHub Pages), and has zero dependencies to maintain.

---

### 2026-01-20: Dark Theme Selection

**Decision**: Dark theme as default (no toggle initially)

**Context**: User preferred dark theme. Most developer portfolios use dark themes.

**Colors**:
- Background: `#0f0f23` (deep navy)
- Cards: `#16213e` (lighter navy)
- Accent: `#4fc3f7` (light blue)
- Text: `#e6e6e6` (off-white)

**Future**: Consider adding theme toggle with `prefers-color-scheme` detection.

---

### 2026-01-20: Project Categories

**Decision**: Four project categories with color coding

| Category | Color | Projects |
|----------|-------|----------|
| Backend | Green `#4caf50` | rating_bot |
| IoT | Orange `#ff9800` | rule_indicators, lubrication, HX711 |
| Web | Blue `#2196f3` | dropshipping, Frontend Mentor |
| Tools | Purple `#9c27b0` | svg_layer_processor |

**Rationale**: Shows breadth of skills while maintaining visual organization.

---

### 2026-01-20: Position Title

**Decision**: "Software Developer" instead of "Junior Developer"

**Context**: User has real production experience (Telegram bot with PostgreSQL, Redis, Docker, hexagonal architecture) plus hardware/IoT projects deployed on real machinery.

**Rationale**: "Junior" undersells actual capabilities. "Software Developer" is accurate and professional.

---

## Patterns

### CSS

- **BEM-like naming**: `.block__element--modifier`
- **CSS Custom Properties**: All design tokens in `:root`
- **Mobile-first**: Base styles for mobile, `min-width` queries for larger
- **Utility classes**: `.text-center`, `.container`, `.section`

### HTML

- **Semantic elements**: `<article>` for cards, `<section>` for page sections
- **Data attributes**: `data-category` for project filtering (future)
- **Inline SVG**: Icons embedded for styling and no external requests

### Accessibility

- Skip link as first focusable element
- `aria-label` on icon-only links
- Focus visible states
- Reduced motion support

---

## Lessons Learned

### 2026-01-20: Button Hover State

**Issue**: Primary button text disappeared on hover

**Cause**: `a:hover` in reset.css changed text color to accent, overriding button styles

**Fix**: Explicitly set `color` in `.btn--primary:hover`

**Learning**: When using global link styles, component hover states need explicit color declarations.

---

## Technical Debt

1. **No project images**: Cards are text-only; could add screenshots
2. **No filtering**: Project cards can't be filtered by category yet
3. **No theme toggle**: Dark theme only, no user preference
4. **Learning projects**: Still exist in subdirectories but not prominently featured

---

*Last updated: 2026-01-20*
