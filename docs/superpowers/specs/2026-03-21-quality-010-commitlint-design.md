# QUALITY-010: commitlint for Conventional Commits

**Date**: 2026-03-21
**Status**: Approved
**Origin**: [BACKLOG.md — QUALITY-004 spawned tasks](../../planning/BACKLOG.md#from-quality-004-pre-commit-hook-with-husky-2026-02-17)

## Problem

The project follows Conventional Commits by convention, but nothing enforces it. A typo or forgotten prefix silently breaks the pattern. Adding automated enforcement prevents drift and keeps the commit history machine-parseable for future tooling (changelogs, release automation).

## Decision Summary

- Use `@commitlint/config-conventional` preset as-is (all standard types allowed)
- Override `header-max-length` to 72 characters (classic git recommendation)
- Header-only enforcement — no body line-length rules
- Dedicated JS config file (`commitlint.config.js`) matching existing project patterns

## Dependencies

| Package | Purpose |
|---------|---------|
| `@commitlint/cli` | Commit message linter CLI |
| `@commitlint/config-conventional` | Standard Conventional Commits preset |

## Configuration

### `commitlint.config.js` (new file, project root)

```js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Classic git recommendation: 72-char headers for clean git log output
    'header-max-length': [2, 'always', 72],
  },
};
```

**Enforced rules (from preset):**
- Valid type prefix: `feat`, `fix`, `docs`, `chore`, `style`, `test`, `build`, `ci`, `perf`, `refactor`, `revert`
- Optional scope in parentheses: `type(scope): subject`
- Lowercase subject, no trailing period
- 72-char max header length (overridden from default 100)

**Not enforced:**
- Body/footer line length — URLs, bullet lists, and code snippets make strict wrapping impractical
- Scope restrictions — any scope is valid

### `.husky/commit-msg` (new file)

```sh
npx --no -- commitlint --edit $1
```

Runs commitlint against the commit message on every `git commit`. Rejects non-conforming messages before the commit is created.

## Files Changed

| File | Action | Description |
|------|--------|-------------|
| `package.json` | Modified | Add `@commitlint/cli` and `@commitlint/config-conventional` to devDependencies |
| `commitlint.config.js` | New | commitlint configuration extending conventional preset |
| `.husky/commit-msg` | New | Husky hook running commitlint on commit messages |

## What This Does NOT Change

- **Existing `pre-commit` hook** — lint-staged continues to run unchanged
- **CI pipeline** — commitlint is local-only; CI commits come from merges that already passed the hook
- **Existing commit history** — no retroactive enforcement
- **Merge commits** — `@commitlint/config-conventional` ignores merge commits by default

## CLAUDE.md Updates

- Add commitlint to the build tools mention in Overview
- Add commitlint config to Architecture tree
- Document the commit-msg hook and Conventional Commits enforcement in Code Conventions
- Add `commitlint.config.js` to Key Files list

## Verification Plan

1. **Valid message passes**: `git commit --allow-empty -m "test: verify commitlint hook"` — should succeed
2. **Invalid type fails**: `git commit --allow-empty -m "bad message"` — should be rejected
3. **Over-length header fails**: a commit message header exceeding 72 characters — should be rejected
4. **Scoped message passes**: `git commit --allow-empty -m "feat(lint): add commitlint"` — should succeed
5. **Existing pre-commit hook still works**: lint-staged runs before commit-msg hook

## Design Rationale

### Why `@commitlint/config-conventional` as-is (not restricted types)?
The project already uses `feat`, `fix`, `docs`, `chore`, `style`, `test`. The preset adds `build`, `ci`, `perf`, `refactor`, `revert` — all legitimate types the project will likely use. Restricting types adds maintenance burden with no benefit.

### Why 72-char header limit?
Classic git recommendation. The project's existing commits are 50-80 chars. 72 keeps headers readable in `git log --oneline` and terminal views while allowing enough room for scoped types like `feat(lint): description`.

### Why header-only enforcement?
The body is for context and reasoning — enforcing line wraps there is impractical (URLs, code snippets, bullet lists) and modern tools handle display wrapping.

### Why JS config file?
Matches existing project patterns (`eslint.config.js`, `postcss.config.js`, `lighthouserc.js`). JS format allows inline comments for rationale.
