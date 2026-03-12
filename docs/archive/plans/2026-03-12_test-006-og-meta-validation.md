# TEST-006: Automated OG Meta Tag Validation

**Status**: Complete
**Created**: 2026-03-12
**Source**: BACKLOG.md → From SEO-006

---

## Goal

Add Playwright test that validates all 16 OG/Twitter meta tags plus JSON-LD structured data are present and correctly formatted in `index.html`. Catches regressions when HTML is modified.

## Approach

Single test file `tests/seo/meta-tags.spec.js` with exact value assertions against an `EXPECTED` constants object. No Page Object Model (single file, static content checks). JSON-LD parsed per-test via `getGraph()` helper for isolation under `fullyParallel: true`.

## Implementation

### Files Created
- `tests/seo/meta-tags.spec.js` — 30 tests across 5 groups

### Test Structure
1. **Open Graph** (8 tests): og:title, og:description, og:type, og:url, og:image, og:image:width, og:image:height, og:image:alt
2. **Twitter Card** (5 tests): twitter:card, twitter:title, twitter:description, twitter:image, twitter:image:alt
3. **Core SEO** (3 tests): page title, meta description, canonical link
4. **JSON-LD Structured Data** (9 tests): @context, Person schema (6 fields), WebSite schema (2 checks)
5. **Cross-tag Consistency** (5 tests): OG ↔ Twitter parity + OG URL ↔ canonical

### Key Decisions
- **No POM**: Single test file with static content checks doesn't warrant a page object
- **`EXPECTED` constants at top**: Single source of truth, easy to update when content changes
- **`getGraph()` helper**: Parses JSON-LD per-test for isolation (avoids shared mutable state)
- **`graph.find()` by `@type`**: Resilient to JSON-LD array reordering
- **Null guards on cross-tag tests**: Prevents false passes if both tags accidentally removed
- **New `tests/seo/` directory**: Clean separation from filter tests

### Quality Review Fixes
1. Replaced shared mutable `graph` variable with per-test `getGraph()` helper
2. Moved `@context` assertion from `beforeEach` to its own named test
3. Added `not.toBeNull()` guards in cross-tag consistency tests

## Results
- 30/30 tests passing
- 96/96 total suite passing (no regressions)
- ESLint clean
- Pre-commit hooks passing

---

## Section 5: Future Improvements

1. **404.html negative test**: Add test verifying 404.html intentionally omits OG/Twitter/JSON-LD tags (catches accidental addition)
2. **OG image HTTP validation**: Test that `og:image` URL returns HTTP 200 with correct Content-Type (requires network request in test)

---

## Execution Log

#### 2026-03-12 — PHASE: Planning
- Goal understood: Automated regression tests for 16+ SEO meta tags
- Approach chosen: Single spec file with exact value assertions, no POM
- Risks identified: Shared state under parallel execution, false passes on missing tags

#### 2026-03-12 — PHASE: Implementation
- Created `tests/seo/meta-tags.spec.js` with 29 tests (later 30 after review)
- All tests passing on first run
- ESLint clean without config changes

#### 2026-03-12 — PHASE: Quality Review
- Code review identified 3 issues (shared state, hidden assertion, null safety)
- All 3 fixed, tests re-verified (30/30 passing)

#### 2026-03-12 — PHASE: Complete
- Final approach: Single file, 5 test groups, exact values + consistency checks
- Tests passing: Yes (30/30, 96/96 total)
- User approval: Received

#### 2026-03-12 — PHASE: Task Completion Documentation
- **Step 1 EXTRACT**: 2 improvements → BACKLOG.md
- **Step 2 ARCHIVE**: Plan moved to docs/archive/plans/
- **Step 3 TRANSITION**: Task moved TODO.md → DONE.md
- **Step 4 COMMIT**: Documentation commit
- **Step 5 MEMORY**: CLAUDE.md updated (architecture, testing pattern, build commands)
