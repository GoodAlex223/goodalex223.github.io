# Code Quality & Lint Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix lint-staged JS glob to stop matching root config files, and mark two already-resolved backlog items as complete.

**Architecture:** Single config change in `package.json` to scope lint-staged ESLint to the 3 directories that contain lintable JS (`js/`, `scripts/`, `tests/`). Documentation cleanup in `BACKLOG.md` and `WEEKLY.md`.

**Tech Stack:** lint-staged, ESLint (flat config), husky

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `package.json` | Modify line 25 | lint-staged JS glob |
| `docs/planning/BACKLOG.md` | Modify lines 667-668, 751 | Mark 3 items as resolved |
| `docs/planning/WEEKLY.md` | Modify lines 35-37 | Check off Wednesday tasks |
| `docs/planning/plans/2026-04-03_code-quality-lint-fixes.md` | Modify | Update progress checkboxes |

---

### Task 1: Fix lint-staged JS glob in package.json

**Files:**
- Modify: `package.json:25`

- [ ] **Step 1: Update the lint-staged glob**

In `package.json`, change line 25 from:

```json
    "*.js": "eslint --fix"
```

to:

```json
    "{js,scripts,tests}/**/*.js": "eslint --fix"
```

- [ ] **Step 2: Verify lint runs correctly on lintable files**

Run the full lint command to confirm ESLint still finds and lints all intended files:

```bash
npm run lint:js
```

Expected: exits 0 with no errors (same as before the change).

- [ ] **Step 3: Verify lint-staged skips root config files**

Stage a root config file and run lint-staged in dry-run mode:

```bash
git stash
git add postcss.config.js
npx lint-staged --diff="HEAD" --verbose 2>&1 | head -20
git restore --staged postcss.config.js
git stash pop
```

Expected: lint-staged output should show no matching tasks for `postcss.config.js` (no ESLint run triggered).

- [ ] **Step 4: Verify lint-staged processes JS files in target directories**

Stage a file in `js/` and verify lint-staged picks it up:

```bash
echo "" >> js/main.js
git add js/main.js
npx lint-staged --diff="HEAD" --verbose 2>&1 | head -20
git restore --staged js/main.js
git checkout -- js/main.js
```

Expected: lint-staged output shows ESLint running on `js/main.js`.

- [ ] **Step 5: Commit**

```bash
git add package.json
git commit -m "fix: Scope lint-staged JS glob to project directories

Replace broad '*.js' glob with '{js,scripts,tests}/**/*.js' to prevent
root config files (postcss.config.js, playwright.config.js) from being
passed to ESLint during pre-commit."
```

---

### Task 2: Mark resolved backlog items

**Files:**
- Modify: `docs/planning/BACKLOG.md:667-668, 751`

- [ ] **Step 1: Mark QUALITY-010 backlog items as resolved**

In `docs/planning/BACKLOG.md`, replace lines 667-668:

```markdown
- [ ] CLAUDE.md has duplicate JS Linting descriptions with inconsistent ignores lists — Build System section lists `eslint.config.js` and `commitlint.config.js` in ignores, but Code Conventions section still says `Ignores: dist/**, node_modules/**`. Sync both sections or consolidate into one.
- [ ] lint-staged `*.js` glob bypasses ESLint ignores for root config files — `"*.js": "eslint --fix"` passes files directly to ESLint by filename, which may not respect the `ignores` array in flat config. Pre-existing for `eslint.config.js`, now also affects `commitlint.config.js`. Consider using a negated glob in lint-staged (e.g., `"*.js": "eslint --fix --ignore-pattern commitlint.config.js"`) or switching to `"js/**/*.js scripts/**/*.js tests/**/*.js"` to scope lint-staged explicitly.
```

with:

```markdown
- [x] ~~CLAUDE.md has duplicate JS Linting descriptions with inconsistent ignores lists~~ *(resolved — Build System section no longer exists in CLAUDE.md; only one JS linting description remains in Code Conventions section)*
- [x] ~~lint-staged `*.js` glob bypasses ESLint ignores for root config files~~ *(fixed 2026-04-03, quality/code-lint-fixes — scoped lint-staged to `{js,scripts,tests}/**/*.js`)*
```

- [ ] **Step 2: Mark CONTENT-003 backlog item as resolved**

In `docs/planning/BACKLOG.md`, replace line 751:

```markdown
- [ ] Update "Adding New Projects" template in CLAUDE.md to include `data-animate` and `data-animate-delay` attributes — every real project card uses them but the template omits them, which could mislead future additions
```

with:

```markdown
- [x] ~~Update "Adding New Projects" template in CLAUDE.md to include `data-animate` and `data-animate-delay` attributes~~ *(resolved — template already includes `data-animate data-animate-delay="NNN"` as of current CLAUDE.md)*
```

- [ ] **Step 3: Check off Wednesday tasks in WEEKLY.md**

In `docs/planning/WEEKLY.md`, replace lines 35-37:

```markdown
- [ ] **Fix lint-staged `*.js` glob bypassing ESLint ignores** — Direct filename passing may skip flat config `ignores` array for root config files; scope lint-staged to explicit directories *(IMPORTANT, 3 pts)*
- [ ] **Fix CLAUDE.md duplicate JS Linting descriptions** — Build System section and Code Conventions section have inconsistent ignores lists *(IMPORTANT, 2 pts)*
- [ ] **Update "Adding New Projects" template in CLAUDE.md** — Add `data-animate` and `data-animate-delay` attributes that every real card uses but template omits *(1 pt)*
```

with:

```markdown
- [x] **Fix lint-staged `*.js` glob bypassing ESLint ignores** — Direct filename passing may skip flat config `ignores` array for root config files; scope lint-staged to explicit directories *(IMPORTANT, 3 pts)*
- [x] **Fix CLAUDE.md duplicate JS Linting descriptions** — Build System section and Code Conventions section have inconsistent ignores lists *(IMPORTANT, 2 pts)*
- [x] **Update "Adding New Projects" template in CLAUDE.md** — Add `data-animate` and `data-animate-delay` attributes that every real card uses but template omits *(1 pt)*
```

Also update the summary table (lines 64-66) statuses from `Planned` to `Done`.

- [ ] **Step 4: Update plan progress checkboxes**

In `docs/planning/plans/2026-04-03_code-quality-lint-fixes.md`, check off all 4 progress items.

- [ ] **Step 5: Commit**

```bash
git add docs/planning/BACKLOG.md docs/planning/WEEKLY.md docs/planning/plans/2026-04-03_code-quality-lint-fixes.md
git commit -m "docs: Mark resolved backlog items and update weekly progress

Two BACKLOG items were already fixed (CLAUDE.md duplicate lint docs,
Adding New Projects template). Third item (lint-staged glob) fixed in
previous commit."
```

---

### Task 3: Run full test suite

- [ ] **Step 1: Run tests**

```bash
npm test
```

Expected: All tests pass. The `package.json` change only affects pre-commit behavior, not test execution.

- [ ] **Step 2: Run lint**

```bash
npm run lint
```

Expected: exits 0, no errors.
