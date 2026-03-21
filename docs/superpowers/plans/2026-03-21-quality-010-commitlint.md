# QUALITY-010: commitlint for Conventional Commits — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add commitlint with `@commitlint/config-conventional` to enforce Conventional Commits format on all commit messages via a husky `commit-msg` hook.

**Architecture:** Two npm packages (`@commitlint/cli`, `@commitlint/config-conventional`), one CJS config file at project root extending the conventional preset with a 72-char header limit and disabled `subject-case`, and one husky hook file that runs commitlint on the commit message.

**Tech Stack:** commitlint, husky v9

**Spec:** `docs/superpowers/specs/2026-03-21-quality-010-commitlint-design.md`

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `package.json` | Modify | Add two devDependencies |
| `commitlint.config.js` | Create | commitlint configuration (extends conventional preset, overrides) |
| `.husky/commit-msg` | Create | Husky hook that runs commitlint against commit message |

---

### Task 1: Install Dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install commitlint packages**

```bash
npm install --save-dev @commitlint/cli @commitlint/config-conventional
```

- [ ] **Step 2: Verify installation**

```bash
npx commitlint --version
```

Expected: Prints a version number (e.g., `19.x.x`), no errors.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: Add commitlint dependencies"
```

---

### Task 2: Create Configuration File

**Files:**
- Create: `commitlint.config.js`

- [ ] **Step 1: Create `commitlint.config.js` in project root**

```js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Classic git recommendation: 72-char headers for clean git log output
    'header-max-length': [2, 'always', 72],
    // Preserve existing uppercase subject style (e.g., "docs: Add ..." not "docs: add ...")
    'subject-case': [0],
  },
};
```

- [ ] **Step 2: Verify config loads correctly**

```bash
echo "test: verify commitlint config" | npx commitlint
```

Expected: No errors, exits 0.

- [ ] **Step 3: Verify invalid message is rejected**

```bash
echo "bad message without type" | npx commitlint
```

Expected: Non-zero exit code with error about subject format.

- [ ] **Step 4: Verify 72-char header limit**

```bash
echo "feat: This is an intentionally long commit message that exceeds seventy-two characters in length" | npx commitlint
```

Expected: Non-zero exit code with error about `header-max-length`.

- [ ] **Step 5: Verify uppercase subject is allowed**

```bash
echo "feat: Add new feature with uppercase" | npx commitlint
```

Expected: No errors, exits 0.

- [ ] **Step 6: Verify scoped message passes**

```bash
echo "feat(lint): Add commitlint config" | npx commitlint
```

Expected: No errors, exits 0.

- [ ] **Step 7: Commit**

```bash
git add commitlint.config.js
git commit -m "feat(lint): Add commitlint config for Conventional Commits"
```

---

### Task 3: Create Husky commit-msg Hook

**Files:**
- Create: `.husky/commit-msg`

- [ ] **Step 1: Create `.husky/commit-msg` hook file**

```sh
npx --no -- commitlint --edit $1
```

Note: This file must NOT have a shebang line — husky v9 handles shell execution. The `--no` flag prevents npx from prompting to install. The `$1` argument is the path to the commit message temp file, provided by git.

- [ ] **Step 2: Verify hook works — valid message**

```bash
git commit --allow-empty -m "test: Verify commitlint hook"
```

Expected: Commit succeeds (lint-staged runs first with no staged files warning, then commitlint passes).

- [ ] **Step 3: Verify hook works — invalid message**

```bash
git commit --allow-empty -m "bad message"
```

Expected: Commit is rejected. Error output mentions invalid type or subject format.

- [ ] **Step 4: Verify existing pre-commit hook still works**

Create a temporary file with a lint error, stage it, and attempt to commit:

```bash
echo "var x = 1;" > /tmp/test-lint.js
cp /tmp/test-lint.js js/test-lint-temp.js
git add js/test-lint-temp.js
git commit -m "test: Should fail lint-staged"
```

Expected: Commit fails at the pre-commit (lint-staged) stage — ESLint catches `var` (should be `const`). Clean up:

```bash
git checkout -- js/test-lint-temp.js 2>/dev/null; rm -f js/test-lint-temp.js; git reset HEAD js/test-lint-temp.js 2>/dev/null
```

- [ ] **Step 5: Clean up verification commits**

Reset the empty test commit from Step 2:

```bash
git reset HEAD~1
```

- [ ] **Step 6: Commit the hook file**

```bash
git add .husky/commit-msg
git commit -m "feat(lint): Add commit-msg husky hook for commitlint"
```

---

### Task 4: Update CLAUDE.md Documentation

**Files:**
- Modify: `CLAUDE.md` (project root)

The auto-memory system has already added commitlint to CLAUDE.md in these sections: Overview (build tools), Architecture tree, Key Files, and Code Conventions. **Verify** these are present and accurate — if so, no manual edits are needed.

- [ ] **Step 1: Verify CLAUDE.md already has commitlint documentation**

Check for these four items:
1. Overview line mentions `commitlint (Conventional Commits enforcement)`
2. Architecture tree includes `commitlint.config.js` entry
3. Key Files lists `commitlint.config.js`
4. Code Conventions has a "Commit Message Linting" section

If all four are present and accurate, skip to Step 3. If any are missing or incorrect, proceed to Step 2.

- [ ] **Step 2: (Conditional) Add missing CLAUDE.md sections**

Only if Step 1 found gaps. Add the missing documentation matching the style of existing entries (e.g., ESLint, Stylelint sections).

- [ ] **Step 3: Commit (if changes were made)**

```bash
git add CLAUDE.md
git commit -m "docs: Update CLAUDE.md with commitlint documentation"
```

---

### Task 5: Final Verification

- [ ] **Step 1: Run full verification suite from spec**

Test each case from the spec's Verification Plan:

```bash
# 1. Valid message
git commit --allow-empty -m "test: Verify commitlint hook"

# 2. Invalid type (should FAIL)
git commit --allow-empty -m "bad message"

# 3. Over-length header (should FAIL)
git commit --allow-empty -m "feat: This is an intentionally long commit message that exceeds seventy-two characters in total length"

# 4. Scoped message
git commit --allow-empty -m "feat(lint): Add commitlint"

# 5. Uppercase subject
git commit --allow-empty -m "feat: Add new feature"
```

Expected: Cases 1, 4, 5 succeed. Cases 2, 3 are rejected by commitlint.

- [ ] **Step 2: Clean up verification commits**

Reset the 3 successful empty commits:

```bash
git reset HEAD~3
```

- [ ] **Step 3: Verify git log looks clean**

```bash
git log --oneline -5
```

Expected: Last commits are the ones from Tasks 1-4 (no empty test commits remain).
