# Plan: Theme Toggle (MP-003)

**Created**: 2026-01-28
**Status**: Complete
**Task Reference**: TODO.md MP-003

---

## 1. Objective

Add a light/dark theme toggle to the portfolio website that:
- Respects system preference (`prefers-color-scheme`) as default
- Persists user choice in localStorage
- Provides smooth color transitions
- Uses an icon button (sun/moon) positioned on the right edge of the header

---

## 2. Requirements

### Functional
- [x] Theme toggle button in header (right edge)
- [x] Toggle between light and dark themes
- [x] Respect system preference as default
- [x] Persist user choice in localStorage
- [x] Listen for system preference changes

### Non-Functional
- [x] Smooth color transitions (~250ms)
- [x] No flash of wrong theme on page load
- [x] Graceful handling of private browsing (localStorage blocked)
- [x] Accessible (keyboard, screen reader support)

---

## 3. Architecture Decision

**Chosen Approach**: Data Attribute Theme Switching with CSS Custom Properties

### Rationale
- Uses `data-theme` attribute on `<html>` element
- Single source of truth for theme state
- CSS custom properties cascade naturally
- Progressive enhancement (CSS fallback for no-JS users)
- Inline head script prevents flash of unstyled content

### Alternatives Considered

| Approach | Pros | Cons | Verdict |
|----------|------|------|---------|
| Class toggle (`.dark-mode`) | Simple | Doesn't scale to 3+ themes | Rejected |
| Data attribute (chosen) | Clean, extensible, semantic | Slightly more CSS | **Selected** |
| CSS file swap | Total isolation | HTTP overhead, FOUC | Rejected |

---

## 4. Implementation

### Files Modified

| File | Changes |
|------|---------|
| `css/variables.css` | Added light theme color variables (+56 lines) |
| `css/components.css` | Added `.theme-toggle` button styles (+78 lines) |
| `css/main.css` | Added `.nav` positioning and theme transitions (+20 lines) |
| `js/main.js` | Added theme toggle initialization and handlers (+96 lines) |
| `index.html` | Added inline script and theme toggle button HTML (+56 lines) |
| `CLAUDE.md` | Updated with theme system documentation |

### Key Implementation Details

1. **CSS Variables**: Light theme defined in both `[data-theme="light"]` selector and `@media (prefers-color-scheme: light)` for progressive enhancement

2. **Inline Head Script**: Prevents flash by applying theme before CSS loads:
   ```javascript
   var theme = saved || (prefersDark ? "dark" : "light");
   document.documentElement.dataset.theme = theme;
   ```

3. **Error Handling**: localStorage wrapped in try-catch for private browsing compatibility

4. **Icon Animation**: Sun/moon icons swap via CSS opacity and rotation transitions

---

## 5. Key Discoveries

### Technical Insights
- Inline `<head>` script is essential to prevent FOUC (Flash of Unstyled Content)
- CSS `@media (prefers-color-scheme)` provides no-JS fallback
- `data-theme` attribute pattern scales well for future themes

### Patterns Established
- Theme variables defined in `variables.css` with clear naming
- Component uses absolute positioning within relatively-positioned `.nav`
- localStorage error handling pattern for private browsing

---

## 6. Future Improvements

1. **Dynamic `<meta name="theme-color">`**: Update browser chrome color when theme changes
2. **Three-way toggle**: Add "auto" option (follows system, explicitly chosen)
3. **Reduce CSS duplication**: Consider CSS preprocessor to generate both theme blocks from single source

---

## 7. Testing Checklist

- [x] Toggle button appears in header
- [x] Clicking toggles between themes
- [x] Theme persists across page reloads
- [x] System preference respected on first visit
- [x] Smooth color transitions
- [x] Icons animate correctly
- [x] Keyboard accessible (Tab + Enter)
- [x] Works in private browsing (graceful degradation)

---

## 8. Execution Log

### 2026-01-28 — Planning
- Requirements confirmed with user
- Architecture approach selected (Pragmatic Balance)
- 3 approaches analyzed, user chose recommended option

### 2026-01-28 — Implementation
- CSS foundation added (variables.css, components.css, main.css)
- HTML button and inline script added (index.html)
- JavaScript logic added (main.js)

### 2026-01-28 — Quality Review
- Code reviewers identified 3 critical issues:
  1. Inline script logic error (fixed)
  2. localStorage exception handling (fixed)
  3. Button size inconsistency (fixed: 2.25rem → 2rem)

### 2026-01-28 — Complete
- All acceptance criteria met
- Code committed: `11dcf26`
- CLAUDE.md updated with theme system documentation

---

## 9. Commits

- `11dcf26` - feat: Add theme toggle with light/dark mode support

---

*Plan completed: 2026-01-28*
