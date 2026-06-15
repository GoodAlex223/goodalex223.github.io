# Design: Script Robustness & Observability (Cleanup Week #1, Group C)

**Date**: 2026-06-14
**Branch**: `chore/script-robustness`
**Source**: WEEKLY.md Group C (🟤 Auto-Generated, 5 SP, Domain: CI/Build); BACKLOG.md lines 345, 349, 354–356, 361
**Status**: Approved — ready for implementation plan

## Summary

Small defensive-hardening and observability batch across two CI scripts:
`scripts/check-assets.js` and `scripts/validate-backlog-paths.js`. Six edits,
two files, one PR. **No happy-path behavior change** to either script — only
edge-case robustness, observability, and doc/wording corrections. Every item
traces to a prior PR-review finding already triaged into BACKLOG.

There is no unit-test harness for `scripts/` in this repo (verified: no
`scripts/**/*.test.js`, no `tests/**/*scripts*`). These scripts have always been
validated manually + in CI. Verification here is manual reproduction (see
Verification Plan), consistent with that convention. Adding a test harness is
explicitly out of scope.

## Scope Decisions (confirmed in brainstorming)

- **Item 4b (spec-targeted fix-guidance, conf 30)** — **INCLUDED.** Although
  WEEKLY.md flags ≤35-confidence Cleanup-Week items as legitimate won't-do
  candidates, this one is small, self-contained, and fixes a genuine
  misdirection (the message tells you to use `docs/archive/plans/` even for a
  `docs/superpowers/specs/` Origin). Keeps Group C at the planned 5 SP.
- **Item 3b (hint color, conf 40)** — **YELLOW (new constant).** Matches the
  `\x1b[33m` advisory-text convention already used in
  `validate-backlog-paths.js` and `check-backlog-structure.js`.

## File 1 — `scripts/check-assets.js`

### Edit A — Add YELLOW color constant (lines 20–23)
Add `const YELLOW = '\x1b[33m';` alongside the existing GREEN/RED/RESET block.

### Edit B — `checkDistPreflight()` non-directory guard (lines 131–144)
Replace the `!existsSync || readdirSync(...).length === 0` pattern with a single
try/catch around `readdirSync`. `readdirSync` throws `ENOENT` (missing) **and**
`ENOTDIR` (a stray *file* named `dist`); one catch covers all three failure
modes (missing / non-directory / empty), and the `existsSync` call becomes
redundant and is removed.

```js
/**
 * Fast-fails when dist/ is missing or empty (the common "forgot npm run build"
 * case). A `dist` that exists but is not a directory (e.g., a stray file) is
 * treated as missing. Avoids printing one generic ✗ per dist/ ref. Returns
 * nothing; calls process.exit(1) on failure.
 */
function checkDistPreflight() {
  const distDir = path.join(ROOT, 'dist');
  let isEmpty = true;
  try {
    // readdirSync throws ENOENT (missing) or ENOTDIR (dist is a file) — both
    // mean "no usable dist/", same as an empty directory.
    isEmpty = fs.readdirSync(distDir).length === 0;
  } catch {
    isEmpty = true;
  }
  if (isEmpty) {
    console.error(
      `Error: ${RED}dist/ missing or empty${RESET} — run \`npm run build\` first.`
    );
    process.exit(1);
  }
}
```

*Rejected alternative:* a separate `fs.statSync(distDir).isDirectory()` check
before `readdirSync`. Works, but adds a syscall and a branch where a single
try/catch is cleaner and directly mirrors the existing `assetExists()` pattern.

### Edit C — Reconcile JSDoc vs error wording (folded into Edit B)
Both the JSDoc and the printed error now say **"missing or empty"**. The word
**"incomplete"** is dropped — it overstated what the preflight checks (it never
detected partial/stale `dist/`; that case falls through to the stale-hash hint).
The JSDoc adds a sentence noting a non-directory `dist` is treated as missing.

### Edit D — `extractJsonRefs()` JSDoc non-object guard (lines 73–76)
Expand the JSDoc to mention the guard added in PR #68:

> Walks `projects[*].screenshots[].src`. Skips non-object `projects[*]` entries
> (defensive against malformed JSON) and excluded refs.

### Edit E — Stale-hash hint color out of RED (line 194)
`${RED}Hint:${RESET}` → `${YELLOW}Hint:${RESET}`. The preflight error stays RED
(it is an error); the recoverable stale-hash hint becomes YELLOW (advisory).

## File 2 — `scripts/validate-backlog-paths.js`

### Edit F — Observability warn on working-tree fallback (inner catch, lines 44–49)
Emit a `console.warn` (→ stderr) **only** in the inner catch — reached when both
`git show` and `git rev-parse --is-inside-work-tree` fail, i.e. git is entirely
unavailable. The normal "git show failed but we are inside a repo → skip" path
stays silent (expected, not degradation).

```js
    } catch {
      // git not available — read from working tree.
      console.warn(
        'validate-backlog-paths: git unavailable; falling back to working-tree read.'
      );
      const fullPath = path.join(__dirname, '..', BACKLOG_REL_PATH);
      if (!fs.existsSync(fullPath)) return null;
      return fs.readFileSync(fullPath, 'utf8');
    }
```

### Edit G — Spec-targeted fix-guidance (violation loop + summary, lines 60–78)
For each violation, detect whether the path's subtree is `specs/` and suggest
`docs/archive/specs/`, else `docs/archive/plans/`. **The documented
`[matched: <path>]` substring is preserved verbatim** — the suggestion is
appended *after* the closing bracket, so the CLAUDE.md "BACKLOG Origin Paths"
description (which references the `[matched: <path>]` annotation) stays accurate
and **this PR touches no documentation files.**

```js
  if (matched) {
    const afterPrefix = line.slice(line.indexOf(matched) + matched.length);
    const suggested = afterPrefix.startsWith('specs/')
      ? 'docs/archive/specs/'
      : 'docs/archive/plans/';
    violations.push({ line: index + 1, content: line.trim(), matched, suggested });
  }
```
```js
  violations.forEach((v) => {
    console.error(`  Line ${v.line} [matched: ${v.matched}] → use ${v.suggested}: ${v.content}`);
  });
  console.error(
    `\n\x1b[33mOrigin paths must point to docs/archive/plans/ (or docs/archive/specs/ for specs), not any of: ${FORBIDDEN_ORIGIN_PATHS.join(', ')}\x1b[0m`
  );
  console.error(
    'Fix: Replace each forbidden path with the suggested docs/archive/... path shown above.\n'
  );
```

Detection table (matched = the forbidden prefix found by `FORBIDDEN_ORIGIN_PATHS.find`):

| Origin path in line | matched prefix | afterPrefix | suggested |
|---|---|---|---|
| `docs/superpowers/specs/x.md` | `docs/superpowers/` | `specs/x.md` | `docs/archive/specs/` |
| `docs/superpowers/plans/x.md` | `docs/superpowers/` | `plans/x.md` | `docs/archive/plans/` |
| `docs/planning/plans/x.md` | `docs/planning/plans/` | `x.md` | `docs/archive/plans/` |

Correct for every forbidden-path / subtree combination.

## Verification Plan (manual — no test harness)

1. **Happy paths / regression gate**:
   - `npm run lint` (eslint covers `scripts/`).
   - `npm run build` → `npm run check-assets` (preflight passes, all refs ✓).
   - `npm run validate-backlog` + `npm run check-backlog-structure` (both OK).
2. **Edit B/C** — scratch repro in a temp dir containing a *file* named `dist`:
   confirm the preflight logic reports a clean "dist/ missing or empty" message
   with no `ENOTDIR` stack trace. Also confirm the empty-directory case.
3. **Edit E** — trigger the stale-hash hint with a bogus failing `dist/` ref;
   confirm `Hint:` renders in yellow (`\x1b[33m`), error stays red.
4. **Edit F** — run the `readBacklog` fallback in a non-git temp dir; confirm the
   warn fires on stderr and the working-tree read still returns content.
5. **Edit G** — BACKLOG fixtures with `docs/superpowers/specs/…` and
   `docs/planning/plans/…` Origin lines; confirm output shows
   `→ use docs/archive/specs/` and `→ use docs/archive/plans/` respectively, and
   that `[matched: <path>]` still appears verbatim.

## Out of Scope

- Any unit-test harness for `scripts/` (repo convention is manual + CI).
- Any CLAUDE.md / documentation edits (Edit G is designed to avoid doc drift;
  CLAUDE.md doc-accuracy work is Group B / Thursday).
- The other open `check-assets.js` stale-hash observations (BACKLOG lines
  363–365: regex tightening, stream-ordering, hash-pattern narrowing) — separate
  low-confidence items, not in this batch.

## Risks

- **Low blast radius**: all edits are edge-case / cosmetic / doc; happy paths
  unchanged. Primary risk is a typo in an error string — covered by manual repro.
- **Edit G output-format change**: mitigated by preserving the documented
  `[matched: <path>]` substring verbatim (additive suffix only).
```
