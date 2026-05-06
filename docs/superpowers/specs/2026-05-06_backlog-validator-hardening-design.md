# BACKLOG Validator Hardening — Design

**Date**: 2026-05-06
**Branch**: `chore/backlog-validator-hardening`
**Group**: Wednesday — BACKLOG Validator Hardening (7 SP, batch)
**Origin**: `docs/planning/WEEKLY.md` lines 67–74

---

## Problem

The `scripts/validate-backlog-paths.js` pre-commit gate, introduced in PR #57 (Code Quality & Lint Fixes, 2026-04-16), prevents `BACKLOG.md` `**Origin**:` lines from referencing the active-plans directory `docs/planning/plans/`. Origin lines must point to the archive at `docs/archive/plans/` after task completion, since plans move there during the Archive step of the task-completion workflow.

Five gaps have surfaced through subsequent PR reviews and operational use:

1. **Recurring miss on `docs/superpowers/`** *(PR #62, PR #64 reviews — confidence 75)* — The same broken-origin-path bug class now recurs with `docs/superpowers/` references (a duplicate plans/specs location pending cleanup). The validator's substring check against a single hard-coded path misses the new pattern.

2. **Working-tree vs. index drift** *(PR #64 review — confidence 50)* — `fs.readFileSync(BACKLOG_PATH)` reads the working tree, not the git index. If staged and unstaged changes coexist in `BACKLOG.md`, the validator inspects content that is not what is about to be committed.

3. **Staged-deletion crashes the hook** *(PR #64 review — confidence 75)* — When `BACKLOG.md` is staged for deletion, the existing `fs.readFileSync` throws `ENOENT` and aborts the commit with an unhelpful stack trace.

4. **Loose pre-commit grep pattern** *(PR #64 review — confidence 35)* — `.husky/pre-commit` uses `grep -q 'BACKLOG.md'` with an unescaped `.` (regex wildcard) and no anchor, so it would match hypothetical paths like `OLD_BACKLOG.md` or `BACKLOG.md.bak`. Harmless today; not robust.

5. **No standalone discoverability** *(2026-04-16 backlog)* — The validator can only run via the pre-commit hook. There is no `npm run validate-backlog` script, and CI does not run the validator independently — `git commit --no-verify` followed by `git push` ships unchecked.

6. **Silent on success** *(2026-04-16 backlog)* — Other gate scripts (`check-links`, `check-assets`) print summaries. The validator exits 0 with no output, providing no positive confirmation that it ran.

---

## Goal

Harden the validator and its surrounding hook + CI plumbing so that:

- The same forbidden-origin-path bug class cannot recur for any known-bad path.
- Validation always inspects what is actually about to be committed.
- The validator is invokable as a discoverable npm script and runs in CI as a deploy gate, closing the `--no-verify` bypass.
- Edge cases (staged deletion, loose grep, silent success) all behave predictably.

Out of scope: structural rewrites of the validator (no parser, no AST), externalizing the forbidden-path list to a config file, or generalizing to other validators.

---

## Approach

Five coordinated changes to three files. Per design discussion, the chosen approaches across decision points:

| Decision | Chosen | Rejected |
|---|---|---|
| Read source | **Auto-detect** — try git index, fall back to working tree, exit 0 silently if both missing | Explicit `--source=...` flag; always-index |
| Detection | **Denylist** — array of forbidden substrings checked against `**Origin**` lines | Allowlist (must contain `docs/archive/`) — would generate ~10+ false positives against legitimate symbolic Origins like `FEAT-005 implementation`, `BUG-003 implementation`, `SEO-007 code review` |
| CI scope | **Belt-and-suspenders** — `npm run validate-backlog` discoverable script + new step in `lint` job | Developer-ergonomics-only (no CI step) — leaves `--no-verify` bypass open |
| CI placement | **Step in existing `lint` job** | Standalone job — wastes ~30s of CI setup per run for one ~50ms script |

---

## Changes

### 1. `scripts/validate-backlog-paths.js` — rewrite (~50 lines)

**Constants**:
```js
// Extend this list when a new forbidden Origin path pattern emerges.
// Origin lines must point to docs/archive/plans/ after task completion.
const FORBIDDEN_ORIGIN_PATHS = ['docs/planning/plans/', 'docs/superpowers/'];
const BACKLOG_REL_PATH = 'docs/planning/BACKLOG.md';
```

**Read-source helper** (auto-detect with three-state return):
```js
function readBacklog() {
  try {
    return execFileSync('git', ['show', `:${BACKLOG_REL_PATH}`], {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe']  // suppress git stderr noise on miss
    });
  } catch (_) {
    // Not in index: staged-deletion, no-git environment, or manual run
    // with unstaged BACKLOG.md. Fall back to working tree.
    const fullPath = path.join(__dirname, '..', BACKLOG_REL_PATH);
    if (!fs.existsSync(fullPath)) return null;
    return fs.readFileSync(fullPath, 'utf8');
  }
}
```

**Validation loop** (denylist):
```js
const content = readBacklog();
if (content === null) {
  console.log('BACKLOG Origin paths: skipped (BACKLOG.md not present)');
  process.exit(0);
}

const violations = [];
content.split('\n').forEach((line, index) => {
  if (!line.includes('**Origin**')) return;
  const matched = FORBIDDEN_ORIGIN_PATHS.find((p) => line.includes(p));
  if (matched) {
    violations.push({ line: index + 1, content: line.trim(), matched });
  }
});
```

**Output** (mirroring `check-links` / `check-assets` style):
- Success: `console.log('BACKLOG Origin paths: OK')`, exit 0
- Skip: `console.log('BACKLOG Origin paths: skipped (BACKLOG.md not present)')`, exit 0
- Failure: red error block listing each violation with `[matched: <path>]` annotation, yellow guidance block listing all forbidden paths and the canonical fix (`docs/archive/plans/`), exit 1

### 2. `.husky/pre-commit` — two surgical edits

```diff
 npx lint-staged || exit 1
-if git diff --cached --name-only | grep -q 'BACKLOG.md'; then
-  node scripts/validate-backlog-paths.js
+if git diff --cached --name-only | grep -qE '(^|/)BACKLOG\.md$'; then
+  npm run validate-backlog
 fi
```

- Tighter regex anchored to basename (`(^|/)` start, `\.md$` end with escaped literal dot).
- Invocation goes through npm script for single-source-of-truth.

### 3. `package.json` — add one script line

Insert `"validate-backlog"` between `"check-links"` and `"lighthouse"` (alphabetized within the gate-script cluster):
```json
"check-assets": "node scripts/check-assets.js",
"check-links": "node scripts/check-links.js",
"validate-backlog": "node scripts/validate-backlog-paths.js",
"lighthouse": "lhci autorun",
```

### 4. `.github/workflows/deploy.yml` — add one CI step

Append to the `lint` job, after "Lint JS":
```yaml
      - name: Validate BACKLOG Origin paths
        run: npm run validate-backlog
```

After fresh `actions/checkout@v4`, the index reflects HEAD content, so `git show :docs/planning/BACKLOG.md` succeeds in CI just as it does in pre-commit.

---

## Edge cases

| Case | Behavior |
|---|---|
| BACKLOG.md staged (modify or add) | Validate index content via `git show :path` |
| BACKLOG.md staged for deletion | `git show` fails → fall back → working tree gone → exit 0 with "skipped" message |
| `npm run validate-backlog` with unstaged BACKLOG.md edits | Validates *index* content (= HEAD content if nothing staged), NOT working-tree WIP. User must `git add docs/planning/BACKLOG.md` first to validate new edits. Acceptable trade-off: mirrors how lint-staged works; primary use is CI / debugging where staged or HEAD content is what matters |
| `npm run validate-backlog` outside a git repo | `git show` fails → fall back → working tree present → validate working tree |
| `git` binary not available | `execFileSync` throws → fall back to working tree (same as no-git path) |
| `--no-verify` bypass at commit time | CI `lint` job catches the violation and blocks deploy |
| New forbidden Origin path emerges in future | One-line edit: append to `FORBIDDEN_ORIGIN_PATHS` array |

---

## Verification

No automated test suite for `scripts/` exists today (consistent with `check-links.js`, `check-assets.js`). Verification is manual, performed against the working branch:

1. **Happy path**: `npm run validate-backlog` on a clean BACKLOG → prints `BACKLOG Origin paths: OK`, exit 0.
2. **`docs/planning/plans/` violation**: temporarily add a forbidden Origin line, run script → reports violation with `[matched: docs/planning/plans/]` annotation, exit 1. Revert.
3. **`docs/superpowers/` violation**: same, with new forbidden path → reports violation with `[matched: docs/superpowers/]`, exit 1. Revert.
4. **Pre-commit hook trigger**: stage a BACKLOG.md edit (clean), commit → hook runs validator, prints OK, commit succeeds.
5. **Pre-commit hook negative**: stage a BACKLOG.md edit with bad Origin, commit → hook runs validator, prints failure, commit blocked.
6. **Tightened grep**: smoke-test the regex in isolation against false-positive candidates:
   ```bash
   printf 'OLD_BACKLOG.md\nBACKLOG.md.bak\nfoo/BACKLOG.md\nBACKLOG.md\n' \
     | grep -E '(^|/)BACKLOG\.md$'
   # Expected output: only "foo/BACKLOG.md" and "BACKLOG.md"
   ```
7. **Staged deletion**: `git rm docs/planning/BACKLOG.md`, commit → validator prints "skipped" message, commit succeeds. Restore via `git restore --staged --worktree`.
8. **CI gate**: open PR with intentional bad Origin → CI `lint` job fails before `build` runs.

---

## Risks & mitigations

| Risk | Mitigation |
|---|---|
| `git show` performance overhead per pre-commit (~30ms vs. `fs.readFileSync` ~5ms) | Negligible in practice; pre-commit hook already runs lint-staged (~seconds) |
| `execFileSync` swallows stderr — may hide real git errors during fallback | Acceptable: any `git show` failure (real or transient) gracefully falls back to working tree, which is the safer default |
| Future Origin lines using new bad path (e.g., `docs/wip/`) | Documented in `FORBIDDEN_ORIGIN_PATHS` constant location with comment hinting at extensibility; one-line edit on next discovery |
| CI step adds ~50ms to `lint` job | Negligible; `lint` job already takes ~30s |

---

## Files touched

- `scripts/validate-backlog-paths.js` — rewrite (32 → ~50 lines)
- `.husky/pre-commit` — 2-line diff
- `package.json` — 1-line addition
- `.github/workflows/deploy.yml` — 2-line addition

Total: 4 files, ~25 net new lines.
