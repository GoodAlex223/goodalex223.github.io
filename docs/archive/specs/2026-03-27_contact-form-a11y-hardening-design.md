# Contact Form Accessibility Hardening — Design Spec

**Date**: 2026-03-27
**Branch**: `a11y/contact-form-hardening`
**Points**: 6 (WEEKLY) + 4 related BACKLOG items
**Source**: WEEKLY.md (Tuesday task) + BACKLOG.md (CHALLENGE-003 code review items)

## Scope

7 items organized into 3 implementation layers (CSS first, JS second, tests last).

### Layer 1: CSS Alignment

**1a. Align form inputs with focus-visible pattern** (WEEKLY, 2 pts)

Problem: `.contact-form__input:focus-visible` in `form.css:56-60` sets full `outline` shorthand, breaking the established pattern where `reset.css` provides a permanent transparent outline and `:focus-visible` only changes `outline-color`.

Fix:
- Add base transparent outline to `.contact-form__input`:
  ```css
  outline: var(--focus-outline-width) solid transparent;
  outline-offset: var(--focus-outline-offset);
  ```
- Change `:focus-visible` to only set `outline-color`:
  ```css
  .contact-form__input:focus-visible {
    border-color: var(--color-accent);
    outline-color: var(--focus-outline-color);
  }
  ```
- Same for `--invalid:focus-visible` — only `outline-color: var(--color-error)`.

Files: `css/form.css`

**1b. Resolve CSS cascade conflict** (BACKLOG)

Problem: `.contact-form__input` is in the theme transition group (`main.css:18`) which sets `outline-color var(--transition-fast)`. The component already declares its own `transition` in `form.css:46-49` including `outline-color`. CSS `transition` replaces, not merges — causing a cascade conflict.

Fix: Remove `.contact-form__input` from the theme transition group in `main.css`. The component-level transition in `form.css` already covers `outline-color`, `border-color`, and `background-color` — all properties that need smooth theme switching. Follows the `.btn` exclusion precedent documented in CLAUDE.md.

Files: `css/main.css`

**1c. Add `.contact-form__status` to theme transition group** (WEEKLY, 1 pt)

Problem: Theme switch while status message is visible causes a jarring snap — no smooth transition on the status container.

Fix: Add `.contact-form__status` to the theme transition group selector list in `main.css`. The status container currently only has `opacity` transition for show/hide — theme transitions (`background-color`, `border-color`, `color`, `outline-color`) will be handled by the group rule.

Files: `css/main.css`

### Layer 2: JS Focus Management + SVG Icons

**2a. Add focus management after form submission** (WEEKLY, 3 pts)

Problem: `showFormStatus()` in `main.js:1277-1295` hides the form and shows the status container but never moves focus. Keyboard and screen reader users lose context.

Fix — `showFormStatus()`:
- After `statusContainer.hidden = false`, call `actionButton.focus()`.
- The action button ("Send another message" / "Try again") is the primary interactive element and the most useful focus target.
- The container already has `role="alert"`, so screen readers announce it automatically regardless of focus position.
- No `tabindex="-1"` needed on the container — the button is already natively focusable.

Fix — `resetForm()`:
- After `form.hidden = false`, call `form.querySelector(".contact-form__input").focus()` to restore focus to the first field.

Files: `js/main.js`

**2b. Replace Unicode status icons with inline SVG** (BACKLOG)

Problem: `main.js:1285` uses `textContent = "✓"` / `"✗"` — Unicode characters that render inconsistently across platforms. The codebase convention is inline SVG icons.

Fix:
- Replace `icon.textContent` with `icon.innerHTML` setting minimal inline SVGs (single `<path>` each).
- Success: checkmark SVG. Error: X SVG. Both sized to fill the `3rem x 3rem` container.
- Remove `font-size: var(--font-size-xl)` from `.contact-form__status-icon` CSS (no longer text).
- Add `fill: currentColor` to SVGs so they inherit the existing success/error color styling.
- Parent element already has `aria-hidden="true"`, so SVGs are properly hidden from assistive tech.

Files: `js/main.js`, `css/form.css`

### Layer 3: Test Quality Improvements

**3a. Use web-first focus assertion in validation test** (BACKLOG)

Problem: `validation.spec.js:22-23` uses `page.evaluate(() => document.activeElement.id)` + `test.expect()` instead of Playwright's web-first assertions.

Fix:
```js
// Before
const focused = await page.evaluate(() => document.activeElement.id);
test.expect(focused).toBe("contact-name");

// After
await expect(fp.nameField).toBeFocused();
```

Also add a new test verifying focus moves to the action button after form submission (validating the Layer 2 focus management fix).

Files: `tests/form/validation.spec.js`

**3b. Use POM `goto()` in reduced-motion axe test** (BACKLOG)

Problem: `axe-scan.spec.js:56` uses `fp.page.goto("/")` directly, bypassing the POM's `goto()` method which includes a readiness assertion (waits for filter button labels to load).

Fix:
```js
// Before
await fp.enableReducedMotion();
await fp.page.goto("/");

// After
await fp.enableReducedMotion();
await fp.goto();
```

`enableReducedMotion()` sets emulation before navigation, so `goto()` navigates with reduced motion already active.

Files: `tests/form/axe-scan.spec.js`

## Architecture Decisions

- **Focus target = action button, not container**: `role="alert"` handles SR announcement; button gives keyboard users an immediate action. Matches modal pattern (focus to close button).
- **Remove input from theme group, not add overrides**: Follows `.btn` exclusion precedent. Simpler and avoids specificity issues.
- **SVG via `innerHTML`**: Keeps icons in JS where the logic already lives. No need for external SVG sprite or separate files for 2 small icons.
- **Layer ordering (CSS → JS → Tests)**: CSS focus pattern must be correct before testing focus behavior. Tests validate everything, so they come last.

## Files Changed

| File | Changes |
|------|---------|
| `css/form.css` | Base transparent outline on inputs, `:focus-visible` outline-color only, remove `font-size` from status icon |
| `css/main.css` | Remove `.contact-form__input` from theme group, add `.contact-form__status` |
| `js/main.js` | Focus management in `showFormStatus()` and `resetForm()`, SVG icons |
| `tests/form/validation.spec.js` | Web-first `toBeFocused()` assertion, new focus-after-submission test |
| `tests/form/axe-scan.spec.js` | Use `fp.goto()` in reduced-motion test |

## Out of Scope

- reCAPTCHA v3 (monitoring period not yet elapsed)
- Character count indicator on textarea (UX enhancement, not a11y)
- Form analytics (separate concern)
- Axe scan timing flakiness (separate investigation)
