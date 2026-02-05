# A11Y-002: Improve Focus Indicators

**Status**: Complete
**Priority**: Low
**Branch**: `a11y/002-improve-focus-indicators`
**Created**: 2026-02-05

---

## 1. Goal

Review and enhance `:focus-visible` styles across all interactive elements for better visibility, WCAG 2.1 AA compliance, and consistency.

## 2. Approach

**Chosen**: Outline with offset + adaptive high-contrast colors via CSS custom properties.

**Alternatives Considered**:
1. Box-shadow ring — More visual weight, follows border-radius, but more CSS complexity
2. Double ring (outline + shadow) — Maximum contrast but thicker visual
3. Keep as-is — Fails WCAG on colored backgrounds

**Why this approach**: Minimal CSS changes, keeps existing visual style, fixes contrast issues with new theme-aware high-contrast color variable.

## 3. Implementation

### Files Changed

| File | Changes |
|------|---------|
| `css/variables.css` | Added 4 focus CSS custom properties to all 3 theme blocks |
| `css/reset.css` | Combined `a:focus-visible, button:focus-visible` baseline using variables |
| `css/components.css` | Updated 2 existing + added 4 new `:focus-visible` rules |
| `css/utilities.css` | Added comment explaining skip link `:focus` usage |
| `CLAUDE.md` | Added Focus Accessibility section, updated component patterns |

### CSS Variables Added

| Variable | Dark Theme | Light Theme |
|----------|-----------|-------------|
| `--focus-outline-width` | `2px` | (inherited) |
| `--focus-outline-offset` | `2px` | (inherited) |
| `--focus-outline-color` | `var(--color-accent)` | (inherited) |
| `--focus-outline-color-high-contrast` | `rgba(255,255,255,0.9)` | `rgba(15,15,35,0.9)` |

### Focus Rules Summary

| Element | Rule | Color |
|---------|------|-------|
| `a` (all links) | Global baseline | Accent |
| `button` (all buttons) | Global baseline | Accent |
| `.theme-toggle` | Component | Accent |
| `.filter-btn` | Component | Accent |
| `.filter-btn--active` | High-contrast override | White/dark |
| `.btn--primary` | High-contrast override | White/dark |
| `.project-card__link` | Explicit | Accent |
| `.contact__link` | Explicit | Accent |

## 4. Key Discoveries

- Active filter buttons with category-colored backgrounds had ~1:1 contrast ratio with accent outline (FAILS WCAG 3:1 requirement)
- Primary buttons (`.btn--primary`) also had accent-on-accent contrast issue
- `button` element reset removed border/bg but had no explicit focus style (relied on browser default)
- All 3 existing focus rules used identical hardcoded `2px` values — good candidate for CSS variables

## 5. Future Improvements

1. **Focus indicator transition animation** — Add subtle fade-in for focus outline appearance (respecting `prefers-reduced-motion`). Currently appears instantly which works but could be smoother.
2. **Focus-within for project cards** — Add `:focus-within` highlighting on `.project-card` when internal links receive focus, making it clearer which card the user is interacting with.

---

### Execution Log

#### 2026-02-05 — PHASE: Planning
- Goal: Improve focus indicators for WCAG 2.1 AA compliance
- Approach: Outline with offset + adaptive high-contrast colors
- Risks: Specificity conflicts, theme transition interference

#### 2026-02-05 — PHASE: Implementation
- Added focus CSS variables to variables.css (all 3 theme blocks)
- Updated global baseline in reset.css (combined a + button selector)
- Updated component focus styles in components.css (6 rules)
- Added skip link comment in utilities.css
- Build verified: `npm run build` successful

#### 2026-02-05 — PHASE: Code Review
- 2 review agents ran in parallel (bugs/correctness + conventions/DRY)
- Fixed: Combined `a:focus-visible, button:focus-visible` selectors (DRY)
- Fixed: Added skip link `:focus` comment
- Dismissed: Nav link spacing concern (false positive — outline follows element boundary)
- Dismissed: Light theme DRY concern (both blocks required for different scenarios)

#### 2026-02-05 — PHASE: Complete
- Commit: 16e16e2 on a11y/002-improve-focus-indicators
- All acceptance criteria met
- User approval: pending
