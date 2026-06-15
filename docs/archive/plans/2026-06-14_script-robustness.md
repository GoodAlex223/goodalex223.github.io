# Script Robustness & Observability Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Harden two CI scripts (`check-assets.js`, `validate-backlog-paths.js`) against edge cases and make a silent degradation observable, without changing either script's happy-path behavior.

**Architecture:** Six small edits across two standalone Node CJS scripts. No new modules, no signature changes. There is **no unit-test harness for `scripts/`** in this repo — verification is manual reproduction (a stray-file fixture, a non-git temp dir, and an isolated git fixture repo), consistent with how these scripts have always been validated.

**Tech Stack:** Node.js (CommonJS), `fs`, `child_process.execFileSync`, Git Bash for repro commands, ESLint (Node CJS environment).

**Spec:** [docs/archive/specs/2026-06-14_script-robustness-design.md](../specs/2026-06-14_script-robustness-design.md)

---

## File Structure

- Modify: `scripts/check-assets.js` — Edits A (YELLOW const), B+C (dist preflight guard + wording), D (`extractJsonRefs` JSDoc), E (hint color). Tasks 1–2.
- Modify: `scripts/validate-backlog-paths.js` — Edits F (fallback warn), G (spec-targeted guidance). Tasks 3–4.

No files created. No documentation touched (Edit G preserves the documented `[matched: <path>]` substring verbatim).

**Pre-flight (run once before Task 1):** confirm starting point is clean.

Run: `git rev-parse --abbrev-ref HEAD`
Expected: `chore/script-robustness`

---

### Task 1: `check-assets.js` — dist preflight non-directory guard + wording (Edits B, C)

**Files:**
- Modify: `scripts/check-assets.js:131-144` (`checkDistPreflight`)

- [ ] **Step 1: Demonstrate the current bug (stray `dist` file → raw ENOTDIR)**

This removes any built `dist/` and creates a stray *file* named `dist`. Before the fix, the preflight throws an unhandled `ENOTDIR` stack trace instead of the clean message.

Run:
```bash
rm -rf dist && touch dist && node scripts/check-assets.js; echo "exit: $?"; rm -f dist
```
Expected (BEFORE fix): a Node stack trace containing `ENOTDIR: not a directory, scandir` from `fs.readdirSync`, NOT the clean "run npm run build" message.

- [ ] **Step 2: Apply the guard + wording reconcile**

In `scripts/check-assets.js`, replace the entire `checkDistPreflight` block (JSDoc + function, lines 131–144):

```js
/**
 * Fast-fails when dist/ is missing or empty (the common "forgot npm run build"
 * case). Avoids printing one generic ✗ per dist/ ref. Returns nothing; calls
 * process.exit(1) on failure.
 */
function checkDistPreflight() {
  const distDir = path.join(ROOT, 'dist');
  if (!fs.existsSync(distDir) || fs.readdirSync(distDir).length === 0) {
    console.error(
      `Error: ${RED}dist/ missing or incomplete${RESET} — run \`npm run build\` first.`
    );
    process.exit(1);
  }
}
```

with:

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

- [ ] **Step 3: Verify the three failure modes now print the clean message**

Run (stray file → non-directory):
```bash
rm -rf dist && touch dist && node scripts/check-assets.js; echo "exit: $?"; rm -f dist
```
Expected: `Error: dist/ missing or empty — run \`npm run build\` first.` and `exit: 1`. No stack trace.

Run (missing dist):
```bash
rm -rf dist && node scripts/check-assets.js; echo "exit: $?"
```
Expected: same clean `dist/ missing or empty` message, `exit: 1`.

Run (empty dist):
```bash
rm -rf dist && mkdir dist && node scripts/check-assets.js; echo "exit: $?"; rmdir dist
```
Expected: same clean `dist/ missing or empty` message, `exit: 1`.

- [ ] **Step 4: Verify the happy path still passes (regression)**

Run:
```bash
npm run build && npm run check-assets; echo "exit: $?"
```
Expected: build completes, then `Checking N internal asset references...` followed by all `✓` lines, `Results: N passed, 0 failed`, `exit: 0`.

- [ ] **Step 5: Lint**

Run: `npm run lint:js`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add scripts/check-assets.js
git commit -m "fix(check-assets): guard dist preflight against non-directory dist"
```

---

### Task 2: `check-assets.js` — hint color + JSDoc nits (Edits A, E, D)

**Files:**
- Modify: `scripts/check-assets.js:20-23` (color constants), `:73-76` (`extractJsonRefs` JSDoc), `:194` (hint color)

- [ ] **Step 1: Add the YELLOW constant (Edit A)**

Replace:
```js
// Color constants for reporting
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const RESET = '\x1b[0m';
```
with:
```js
// Color constants for reporting
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';
```

- [ ] **Step 2: Recolor the stale-hash hint label (Edit E)**

Replace (the single line inside the hint `console.error`):
```js
          `\n  ${RED}Hint:${RESET} dist/ may be stale — run \`npm run build\` to refresh hashed assets.\n`
```
with:
```js
          `\n  ${YELLOW}Hint:${RESET} dist/ may be stale — run \`npm run build\` to refresh hashed assets.\n`
```

- [ ] **Step 3: Update the `extractJsonRefs` JSDoc (Edit D)**

Replace:
```js
/**
 * Extracts screenshot src paths from data/projects.json.
 * Walks projects[*].screenshots[].src. Skips excluded refs.
 */
```
with:
```js
/**
 * Extracts screenshot src paths from data/projects.json.
 * Walks projects[*].screenshots[].src. Skips non-object projects[*] entries
 * (defensive against malformed JSON) and excluded refs.
 */
```

- [ ] **Step 4: Verify the hint renders yellow when triggered**

This builds, then deletes the hashed CSS file so its `dist/...` ref fails and the hint fires. Confirm the `Hint:` label is yellow (`\x1b[33m`) while the `✗` error line stays red, then restore.

Run:
```bash
npm run build >/dev/null 2>&1 && rm -f dist/style.*.css && node scripts/check-assets.js; echo "exit: $?"; npm run build >/dev/null 2>&1
```
Expected: a `Hint: dist/ may be stale …` line rendered in yellow, at least one red `✗ dist/style.<hash>.css` line, `Results: … failed`, `exit: 1`. (The final rebuild restores `dist/`.)

If inspecting raw escape codes is easier, run:
```bash
node -e "const Y='\x1b[33m',R='\x1b[0m'; console.error(\`  \${Y}Hint:\${R} sample\`)"
```
Expected: `Hint:` printed in yellow.

- [ ] **Step 5: Verify happy path + lint (regression)**

Run:
```bash
npm run check-assets; echo "exit: $?" && npm run lint:js
```
Expected: `Results: N passed, 0 failed`, `exit: 0`, lint clean (the `YELLOW` constant is now used, so no `no-unused-vars`).

- [ ] **Step 6: Commit**

```bash
git add scripts/check-assets.js
git commit -m "style(check-assets): recolor stale-hash hint to yellow; doc guards"
```

---

### Task 3: `validate-backlog-paths.js` — observability warn on working-tree fallback (Edit F)

**Files:**
- Modify: `scripts/validate-backlog-paths.js:44-49` (inner catch of `readBacklog`)

- [ ] **Step 1: Demonstrate the silent fallback (no warning today)**

Running the script from a directory that is **not** a git repo makes both `git show` and `git rev-parse` fail, hitting the inner catch (working-tree read). Today this is silent.

Run:
```bash
TMP=$(mktemp -d); ( cd "$TMP" && node "$(pwd -P)/scripts/validate-backlog-paths.js" 2>&1 ); echo "---"; ( cd "$TMP" && node "$OLDPWD/scripts/validate-backlog-paths.js" 2>&1 ); rm -rf "$TMP"
```
If that subshell pathing is awkward, use an absolute path explicitly:
```bash
REPO="$(pwd -P)"; TMP=$(mktemp -d); ( cd "$TMP" && node "$REPO/scripts/validate-backlog-paths.js" 2>&1 ); echo "exit: $?"; rm -rf "$TMP"
```
Expected (BEFORE fix): only `BACKLOG Origin paths: OK` (the real repo BACKLOG is read via the working-tree fallback), with **no** warning line.

- [ ] **Step 2: Add the `console.warn` (Edit F)**

Replace:
```js
    } catch {
      // git not available — read from working tree.
      const fullPath = path.join(__dirname, '..', BACKLOG_REL_PATH);
      if (!fs.existsSync(fullPath)) return null;
      return fs.readFileSync(fullPath, 'utf8');
    }
```
with:
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

- [ ] **Step 3: Verify the warn now fires on the fallback path**

Run:
```bash
REPO="$(pwd -P)"; TMP=$(mktemp -d); ( cd "$TMP" && node "$REPO/scripts/validate-backlog-paths.js" 2>&1 ); echo "exit: $?"; rm -rf "$TMP"
```
Expected: `validate-backlog-paths: git unavailable; falling back to working-tree read.` on stderr, followed by `BACKLOG Origin paths: OK`, `exit: 0`.

- [ ] **Step 4: Verify the normal in-repo path stays silent (regression)**

Run: `npm run validate-backlog`
Expected: `BACKLOG Origin paths: OK` with **no** warning line (in-repo, reads the git index — the warn must NOT fire here).

- [ ] **Step 5: Lint**

Run: `npm run lint:js`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add scripts/validate-backlog-paths.js
git commit -m "feat(validate-backlog): warn when falling back to working-tree read"
```

---

### Task 4: `validate-backlog-paths.js` — spec-targeted fix-guidance (Edit G)

**Files:**
- Modify: `scripts/validate-backlog-paths.js` — violation-collection loop (`content.split('\n').forEach`) and the `if (violations.length > 0)` reporting block.

- [ ] **Step 1: Build an isolated git fixture that demonstrates the old generic guidance**

This creates a throwaway git repo with two forbidden Origin lines — one in a `specs/` subtree, one in a `plans/` subtree — and stages them so the script reads them from the index.

Run:
```bash
REPO="$(pwd -P)"; TMP=$(mktemp -d); mkdir -p "$TMP/docs/planning" "$TMP/scripts"; cp "$REPO/scripts/validate-backlog-paths.js" "$TMP/scripts/"; printf '**Origin**: docs/superpowers/specs/2026-06-07_foo.md\n**Origin**: docs/planning/plans/2026-06-07_bar.md\n' > "$TMP/docs/planning/BACKLOG.md"; ( cd "$TMP" && git init -q && git add -A && node scripts/validate-backlog-paths.js; echo "exit: $?" ); rm -rf "$TMP"
```
Expected (BEFORE fix): two violation lines in the form `Line N [matched: <path>]: **Origin**: …` and a generic `Fix: Replace the forbidden path with the equivalent docs/archive/plans/... path` message (no `→ use` annotation, no `archive/specs/`), `exit: 1`.

- [ ] **Step 2: Add subtree detection to the violation loop**

Replace:
```js
content.split('\n').forEach((line, index) => {
  if (!/^\s*(?:[-*+]\s+)?\*\*Origin\*\*/.test(line)) return;
  const matched = FORBIDDEN_ORIGIN_PATHS.find((p) => line.includes(p));
  if (matched) {
    violations.push({ line: index + 1, content: line.trim(), matched });
  }
});
```
with:
```js
content.split('\n').forEach((line, index) => {
  if (!/^\s*(?:[-*+]\s+)?\*\*Origin\*\*/.test(line)) return;
  const matched = FORBIDDEN_ORIGIN_PATHS.find((p) => line.includes(p));
  if (matched) {
    // Spec-staged Origins (…/specs/…) should retarget docs/archive/specs/;
    // everything else docs/archive/plans/. Detect from the forbidden subtree.
    const afterPrefix = line.slice(line.indexOf(matched) + matched.length);
    const suggested = afterPrefix.startsWith('specs/')
      ? 'docs/archive/specs/'
      : 'docs/archive/plans/';
    violations.push({ line: index + 1, content: line.trim(), matched, suggested });
  }
});
```

- [ ] **Step 3: Surface the per-violation suggestion in the report**

Replace:
```js
  violations.forEach((v) => {
    console.error(`  Line ${v.line} [matched: ${v.matched}]: ${v.content}`);
  });
  console.error(
    `\n\x1b[33mOrigin paths must point to docs/archive/plans/, not any of: ${FORBIDDEN_ORIGIN_PATHS.join(', ')}\x1b[0m`
  );
  console.error(
    'Fix: Replace the forbidden path with the equivalent docs/archive/plans/... path in the Origin lines above.\n'
  );
```
with:
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

- [ ] **Step 4: Verify the fixture now shows subtree-correct guidance**

Run (same fixture as Step 1):
```bash
REPO="$(pwd -P)"; TMP=$(mktemp -d); mkdir -p "$TMP/docs/planning" "$TMP/scripts"; cp "$REPO/scripts/validate-backlog-paths.js" "$TMP/scripts/"; printf '**Origin**: docs/superpowers/specs/2026-06-07_foo.md\n**Origin**: docs/planning/plans/2026-06-07_bar.md\n' > "$TMP/docs/planning/BACKLOG.md"; ( cd "$TMP" && git init -q && git add -A && node scripts/validate-backlog-paths.js; echo "exit: $?" ); rm -rf "$TMP"
```
Expected:
```
  Line 1 [matched: docs/superpowers/] → use docs/archive/specs/: **Origin**: docs/superpowers/specs/2026-06-07_foo.md
  Line 2 [matched: docs/planning/plans/] → use docs/archive/plans/: **Origin**: docs/planning/plans/2026-06-07_bar.md
```
plus the broadened summary line mentioning `docs/archive/specs/`, `exit: 1`. Confirm `[matched: docs/superpowers/]` still appears **verbatim** (CLAUDE.md doc-accuracy guarantee).

- [ ] **Step 5: Verify the real backlog still passes (regression)**

Run: `npm run validate-backlog`
Expected: `BACKLOG Origin paths: OK` (no violations in the real BACKLOG, so the new code path is dormant).

- [ ] **Step 6: Lint + commit**

```bash
npm run lint:js
git add scripts/validate-backlog-paths.js
git commit -m "fix(validate-backlog): suggest archive/specs for spec-subtree violations"
```
Expected: lint clean, commit succeeds.

---

### Task 5: Full regression gate (no commit)

**Files:** none — verification only.

- [ ] **Step 1: Run every gate that CI runs for these scripts**

Run:
```bash
npm run lint && npm run build && npm run check-assets && npm run validate-backlog && npm run check-backlog-structure
```
Expected: lint clean; build completes; `check-assets` → `Results: N passed, 0 failed`; `validate-backlog` → `BACKLOG Origin paths: OK`; `check-backlog-structure` → OK. All exit 0.

- [ ] **Step 2: Confirm the commit series is clean**

Run: `git log --oneline main..HEAD`
Expected: four commits — the dist guard fix, the hint/JSDoc style commit, the fallback-warn feat, and the spec-subtree fix — atop the spec-doc commit `ce7cb9c`.

- [ ] **Step 3: Hand off**

Invoke **superpowers:finishing-a-development-branch** to choose how to integrate (PR vs merge). Then run the project task-completion workflow (EXTRACT → ARCHIVE → TRANSITION → COMMIT → MEMORY), tick the Wednesday Group C checkboxes in WEEKLY.md, and move the task TODO → DONE.

---

## Self-Review

**1. Spec coverage** — every spec edit maps to a task:
- Edit A (YELLOW const) → Task 2 Step 1.
- Edit B (non-dir guard) → Task 1 Step 2.
- Edit C (wording reconcile) → Task 1 Step 2 (folded; "incomplete" → "missing or empty" in both JSDoc and message).
- Edit D (`extractJsonRefs` JSDoc) → Task 2 Step 3.
- Edit E (hint color) → Task 2 Step 2.
- Edit F (fallback warn) → Task 3 Step 2.
- Edit G (spec-targeted guidance) → Task 4 Steps 2–3.
- Verification plan items 1–5 → Tasks 1–4 verify steps + Task 5 gate.
No gaps.

**2. Placeholder scan** — no TBD/TODO; every code step shows full before/after; every command has expected output. Clean.

**3. Type/name consistency** — `checkDistPreflight`, `isEmpty`, `YELLOW`, `afterPrefix`, `suggested`, `matched`, `violations` used consistently across tasks. The Edit G object shape `{ line, content, matched, suggested }` defined in Task 4 Step 2 matches its consumer in Task 4 Step 3. The `[matched: <path>]` substring is preserved verbatim per the spec's no-doc-drift guarantee.

**Note on line numbers:** all edits are matched by exact `old_string` content, so the +3-line shift from Task 3 (Edit F) before Task 4 (Edit G) does not affect correctness — line numbers in headers are pre-edit references only.
