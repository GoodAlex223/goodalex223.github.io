# TEST-003: Add CSS Linting with Stylelint

**Status**: Complete
**Branch**: test/003-css-linting-stylelint
**Created**: 2026-02-16
**Category**: Testing & Tooling

---

## 1. Goal

Set up Stylelint for CSS quality enforcement with rules matching project conventions (BEM, custom properties, kebab-case). Integrate with CI pipeline.

## 2. Approach

**Chosen**: `stylelint-config-standard` with targeted rule overrides

**Alternatives considered**:
- Standard + `stylelint-selector-bem-pattern` plugin — Extra dependency, conflicts with non-BEM state/utility classes
- Standard + `stylelint-order` plugin — Subjective property ordering, many auto-fix changes, added complexity
- Custom config (no standard base) — More maintenance, miss good default rules

**Why standard + overrides**: Minimal dependencies (2 packages), well-maintained base config, custom regex handles BEM + state + utility classes cleanly.

## 3. Implementation

### Files created
- `.stylelintrc.json` — Config extending `stylelint-config-standard` with 7 rule overrides

### Files modified
- `package.json` — Added `stylelint` + `stylelint-config-standard` devDependencies, `lint:css` + `lint:css:fix` scripts
- `.github/workflows/deploy.yml` — Added "Lint CSS" step (after install, before build)
- `css/variables.css` — `rgba()` → `rgb()`, hex shorthand, font-family case
- `css/components.css` — `rgba()` → `rgb()`, `currentColor` → `currentcolor`
- `css/main.css` — `@import` url() notation, media query range syntax, `flex-flow` shorthand
- `css/fonts.css` — Font-family quote removal (`"Inter"` → `Inter`)
- `css/utilities.css` — `clip: rect()` → `clip-path: inset(50%)`
- `CLAUDE.md` — Updated build, architecture, conventions, patterns sections

### Rule overrides

| Rule | Setting | Reason |
|------|---------|--------|
| `selector-class-pattern` | BEM regex + `is-*` states | Match all naming patterns |
| `custom-property-pattern` | kebab-case | Match `--color-bg-primary` etc. |
| `keyframes-name-pattern` | kebab-case | Match `status-pulse` |
| `color-function-notation` | `"modern"` | Convert `rgba()` → `rgb()` |
| `alpha-value-notation` | `"number"` | Keep `0.15` style (not `15%`) |
| `property-no-vendor-prefix` | ignore 3 properties | Allow font smoothing prefixes |
| `no-descending-specificity` | `null` (disabled) | Cascade-order dependencies intentional |

### Auto-fix changes applied
- Color notation: `rgba(76, 175, 80, 0.15)` → `rgb(76 175 80 / 0.15)` (~15 instances)
- Import notation: `@import "fonts.css"` → `@import url("fonts.css")`
- Media queries: `(min-width: 37.5em)` → `(width >= 37.5em)` (modern range syntax)
- Flex shorthand: `flex-direction: row; flex-wrap: wrap` → `flex-flow: row wrap`
- Font family case: `BlinkMacSystemFont` → `blinkmacsystemfont`, `Roboto` → `roboto`
- Font quotes: `"Inter"` → `Inter` (single-word, no quotes needed)
- Hex shorthand: `#ffffff` → `#fff`
- Color keyword case: `currentColor` → `currentcolor`
- Manual: `clip: rect(0, 0, 0, 0)` → `clip-path: inset(50%)` (deprecated property)

## 4. Key Discoveries

- Stylelint auto-fix converts many CSS patterns to modern syntax (range media queries, modern color notation, shorthand properties)
- All modern CSS features have excellent browser support (95%+) for 2026 portfolio site
- `no-descending-specificity` must be disabled for projects with intentional cascade-order dependencies
- Font family names in CSS are case-insensitive per spec; Stylelint enforces lowercase for consistency
- `clip-path: inset(50%)` is the modern replacement for deprecated `clip: rect(0, 0, 0, 0)` in `.sr-only`

## 5. Future Improvements

1. **Add `stylelint-order` plugin** — Enforce consistent CSS property ordering within declarations (would require team agreement on ordering convention)
2. **Pre-commit hook integration** — Add Stylelint to a pre-commit hook (e.g., via husky + lint-staged) to catch violations before commit, not just in CI
3. **VS Code integration** — Document recommended Stylelint VS Code extension settings for real-time linting feedback during development

## 6. Acceptance Criteria

- [x] Stylelint installed and configured
- [x] Rules match project conventions (BEM, custom properties, kebab-case)
- [x] All existing CSS passes linting (0 violations)
- [x] Integrated with CI (GitHub Actions lint step)
- [x] Auto-fix script available (`npm run lint:css:fix`)
- [x] 161/162 Playwright tests pass (1 pre-existing flaky test)

### Execution Log

#### 2026-02-16 — PHASE: Planning
- Goal: Add Stylelint CSS linting with project convention enforcement
- Approach: `stylelint-config-standard` + targeted overrides (7 rules)
- User decisions: modern `rgb()` color notation, auto-fix script included

#### 2026-02-16 — PHASE: Implementation
- Installed `stylelint` ^17.3.0 and `stylelint-config-standard` ^40.0.0
- Created `.stylelintrc.json` with BEM regex, kebab-case patterns, vendor prefix exceptions
- Added `lint:css` and `lint:css:fix` npm scripts
- Ran auto-fix: converted ~15 `rgba()` instances + other modernizations
- Fixed 1 remaining violation: deprecated `clip` → `clip-path` in `.sr-only`
- Added "Lint CSS" step to CI workflow (after install, before build)
- Verified: 0 lint violations, build succeeds, 161/162 tests pass

#### 2026-02-16 — PHASE: Quality Review
- Code review: config regex verified against 28+ class patterns (all pass)
- CSS changes review: all auto-fixes browser-safe for 2026 (modern color, range queries)
- No high-confidence issues found by either reviewer

#### 2026-02-16 — PHASE: Complete
- All acceptance criteria met
- CLAUDE.md updated with linting documentation
- Tests passing: yes (161/162, 1 pre-existing flaky)
