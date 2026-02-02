# BUG-001: Fix Theme Switch Button Overlapping Header on Mobile

**Status**: Complete
**Created**: 2026-02-02
**Branch**: `fix/001-theme-button-overlap`

---

## 1. Objective

Fix the theme toggle button overlapping navigation links on mobile viewports. Affects both `index.html` and `404.html`.

## 2. Approach

**Chosen**: Flexbox nav layout — put theme toggle in normal document flow.

**Alternatives Considered**:
1. **Flexbox nav (chosen)** — Change `.nav` to flex container, remove absolute positioning from toggle. Toggle reserves its own space naturally. Pros: robust, no overlap possible, simple. Cons: nav links slightly off-center (shifted left by half toggle width — negligible).
2. **CSS Grid 3-column** — `grid-template-columns: 1fr auto 1fr` for true centering with toggle on right. Pros: perfect centering. Cons: more complex, empty grid column, overkill for this case.
3. **Padding hack** — Add `padding-right` to `.nav__list` to reserve toggle space. Pros: minimal change. Cons: fragile, asymmetric centering, breaks if toggle size changes.

**Rationale**: Flexbox is the simplest and most robust solution. The slight centering offset (~1rem out of 1200px on desktop) is imperceptible. On mobile, having the toggle in normal flow is the correct behavior.

## 3. Implementation

### CSS Changes (css/main.css)
- `.nav`: Changed from `position: relative` to `display: flex; align-items: center`
- `.nav__list`: Added `flex: 1; min-width: 0`, reduced base gap from `--space-6` to `--space-3`
- Tablet breakpoint (37.5em): Added `.nav__list { gap: var(--space-6); }` to restore wider gap

### CSS Changes (css/components.css)
- `.theme-toggle`: Removed `position: absolute; right: var(--container-padding); top: 50%; transform: translateY(-50%)`
- `.theme-toggle`: Added `position: relative; flex-shrink: 0; margin-left: var(--space-2)`
- `position: relative` retained because child `.theme-toggle__icon` elements use `position: absolute` for sun/moon icon stacking

### No HTML Changes Required
Both `index.html` and `404.html` share the same header markup and CSS files. The CSS-only fix applies to both pages automatically.

## 4. Key Discoveries

- The original `position: absolute` approach for the theme toggle was a layout shortcut that worked on desktop but broke on narrow viewports
- Nav links at mobile widths (~375px) with 2rem gaps total ~335px — exceeding available space after the toggle reserves ~48px
- Putting the toggle in normal flex flow eliminates overlap by design, regardless of viewport width
- `position: relative` is required on `.theme-toggle` even after removing `position: absolute`, because child icon SVGs use `position: absolute` for the swap animation

## 5. Future Improvements

1. **Consider true centering with CSS Grid** — If perfect nav centering becomes important (e.g., after adding more header elements), switch `.nav` to `grid-template-columns: 1fr auto 1fr` with the toggle in column 3
2. **Hamburger menu at very narrow widths** — If more nav items are added in the future, consider collapsing to a hamburger menu below 375px to handle extreme widths gracefully
3. **Nav link wrapping** — Adding `flex-wrap: wrap` to `.nav__list` would handle edge cases below 320px, but current traffic data shows <1% at that width

### Execution Log

#### 2026-02-02 — PHASE: Planning
- Goal understood: Fix theme toggle overlapping nav links on mobile
- Approach chosen: Flexbox nav layout (toggle in normal flow)
- Risks identified: Slight off-centering of nav links (accepted as negligible)

#### 2026-02-02 — PHASE: Implementation
- Step completed: All 3 CSS changes applied
- Deviation from plan: No
- Unexpected discovery: `position: relative` needed on toggle for icon absolute positioning

#### 2026-02-02 — PHASE: Sub-Item Complete
- Sub-item: CSS layout fix for nav + toggle
- **Results obtained**: Toggle no longer overlaps nav at any viewport width >= 375px
- **Lessons learned**: Absolute positioning for layout convenience creates fragile mobile layouts; flex/grid is always more robust
- **Problems encountered**: None
- **Improvements identified**: CSS Grid 3-column for true centering if needed later
- **Technical debt noted**: None
- **Related code needing changes**: None

#### 2026-02-02 — PHASE: Complete
- Final approach: Flexbox nav with toggle in normal flow
- Tests passing: N/A (static site, visual verification)
- User approval: Received
