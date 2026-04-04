# Code Quality & Lint Fixes

**Task**: Wednesday items from WEEKLY.md (Week of March 30 - April 3, 2026)
**Branch**: `quality/code-lint-fixes`
**Points**: 6 (3 IMPORTANT + 2 IMPORTANT + 1 NICE TO HAVE)
**Created**: 2026-04-03

---

## Items

### 1. Fix lint-staged `*.js` glob bypassing ESLint ignores (IMPORTANT, 3 pts)

**Problem**: lint-staged config in `package.json` uses `"*.js": "eslint --fix"` which matches any staged `.js` file, including root config files (`postcss.config.js`, `playwright.config.js`, `commitlint.config.js`, `eslint.config.js`). lint-staged passes filenames directly to ESLint, bypassing flat config's `ignores` array for files not explicitly listed. Only `eslint.config.js` and `commitlint.config.js` are in the ignores array — `postcss.config.js` and `playwright.config.js` are unprotected.

**Origin**: BACKLOG.md — From QUALITY-010 Code Review (PR #49)

**Solution**: Replace broad `"*.js"` glob with directory-scoped `"{js,scripts,tests}/**/*.js"`, matching the same 3 directories used by `npm run lint:js`.

**Change**:
```json
// Before
"lint-staged": {
  "*.css": "stylelint --fix",
  "*.js": "eslint --fix"
}

// After
"lint-staged": {
  "*.css": "stylelint --fix",
  "{js,scripts,tests}/**/*.js": "eslint --fix"
}
```

**Why this approach over alternatives**:
- Adding root configs to ESLint `ignores` is fragile (each new root config needs manual entry)
- `--ignore-pattern` CLI flag has inconsistent behavior with flat config
- Directory scoping mirrors `npm run lint:js` exactly and requires no maintenance

**Verification**:
- Stage a root config file → lint-staged should skip it
- Stage a file in `js/` → lint-staged should run ESLint on it

### 2. Fix CLAUDE.md duplicate JS Linting descriptions (IMPORTANT, 2 pts)

**Status**: Already fixed. The backlog item (BACKLOG.md line 667) described inconsistent ignores lists between a "Build System section" and "Code Conventions section". The Build System section no longer exists in CLAUDE.md — only one JS linting description remains at line 101 in the Code Conventions section. No action needed beyond marking the backlog item as complete.

### 3. Update "Adding New Projects" template in CLAUDE.md (1 pt)

**Status**: Already fixed. The backlog item (BACKLOG.md line 751) said the template omitted `data-animate` and `data-animate-delay` attributes. The current template at CLAUDE.md line 176 already includes `data-animate data-animate-delay="NNN"`. No action needed beyond marking the backlog item as complete.

---

## Files to Change

| File | Change |
|------|--------|
| `package.json` | Update lint-staged JS glob from `"*.js"` to `"{js,scripts,tests}/**/*.js"` |
| `docs/planning/BACKLOG.md` | Mark items #2 and #3 as already-fixed with strikethrough + note |

## What's NOT Changing

- ESLint config (`eslint.config.js`) — ignores array stays as-is for direct `npx eslint` invocations
- CSS lint-staged glob — `"*.css"` is fine, Stylelint config handles scoping
- No new dependencies

---

## Progress

- [x] Fix lint-staged glob in `package.json`
- [x] Verify fix works (stage root config + lintable file)
- [x] Mark backlog items as complete
- [x] Update WEEKLY.md task checkboxes
