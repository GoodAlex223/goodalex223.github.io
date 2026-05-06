# BACKLOG Validator Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Harden the BACKLOG Origin path validator with denylist detection, git-index reads, tightened pre-commit grep, npm script discoverability, and a CI gate that closes the `--no-verify` bypass.

**Architecture:** Rewrite `scripts/validate-backlog-paths.js` (32 → ~52 lines) to auto-detect read source (git index → working tree → silent skip) and check `**Origin**` lines against an extensible denylist. Add a single npm script entry that both the pre-commit hook (with tightened grep) and a new CI lint-job step invoke uniformly.

**Tech Stack:** CommonJS Node script, husky pre-commit hook (bash), npm script, GitHub Actions YAML.

**Spec:** [`docs/archive/specs/2026-05-06_backlog-validator-hardening-design.md`](../specs/2026-05-06_backlog-validator-hardening-design.md)

**Branch:** `chore/backlog-validator-hardening` (already created, spec already committed at 7b5f4ea)

**Verification approach:** Manual scenarios (no test infrastructure exists for `scripts/`, consistent with sibling gate scripts `check-links.js` and `check-assets.js`).

---

## File Structure

| File | Operation | Purpose |
|------|-----------|---------|
| `scripts/validate-backlog-paths.js` | Rewrite | Auto-detect read source, denylist detection, success/skip/failure output |
| `package.json` | Modify (1-line add) | `validate-backlog` npm script for discoverability |
| `.husky/pre-commit` | Modify (2-line edit) | Tighten grep regex; invoke via npm script |
| `.github/workflows/deploy.yml` | Modify (3-line add) | New step in `lint` job — closes `--no-verify` bypass |
| `CLAUDE.md` | Already modified, commit at end | Auto-memory updates from memory-updater (fold into final functional commit) |
| `docs/planning/WEEKLY.md` | Modify at completion | Tick 5 checkboxes for Wednesday group |
| `docs/planning/BACKLOG.md` | Modify at completion | Extract any improvements discovered during implementation |
| `docs/superpowers/plans/2026-05-06_backlog-validator-hardening.md` | Move at completion | Plan archive (this file) → `docs/archive/plans/` |

Each functional commit is independently shippable: after Task 1 the validator works manually; after Task 2 the hook uses it; after Task 3 CI enforces it. There is no broken intermediate state — the existing pre-commit hook still calls the rewritten validator directly between Task 1 and Task 2.

---

## Task 1: Rewrite validator + add npm script

**Files:**
- Modify (rewrite): `scripts/validate-backlog-paths.js`
- Modify: `package.json`

- [ ] **Step 1: Rewrite `scripts/validate-backlog-paths.js`**

Replace the entire file contents with:

```js
/**
 * Validates that BACKLOG.md Origin paths point to docs/archive/plans/,
 * not to active/working plan locations. Reads from git index when
 * available (canonical "what's about to be committed"), falling back to
 * the working tree. Exits 0 silently when BACKLOG.md is absent (e.g.,
 * staged for deletion). Invoked by pre-commit hook, npm script, and CI.
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

// Extend this list when a new forbidden Origin path pattern emerges.
// Origin lines must point to docs/archive/plans/ after task completion.
const FORBIDDEN_ORIGIN_PATHS = ['docs/planning/plans/', 'docs/superpowers/'];
const BACKLOG_REL_PATH = 'docs/planning/BACKLOG.md';

function readBacklog() {
  try {
    return execFileSync('git', ['show', `:${BACKLOG_REL_PATH}`], {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });
  } catch (_) {
    const fullPath = path.join(__dirname, '..', BACKLOG_REL_PATH);
    if (!fs.existsSync(fullPath)) return null;
    return fs.readFileSync(fullPath, 'utf8');
  }
}

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

if (violations.length > 0) {
  console.error('\x1b[31mBACKLOG Origin path validation failed:\x1b[0m\n');
  violations.forEach((v) => {
    console.error(`  Line ${v.line} [matched: ${v.matched}]: ${v.content}`);
  });
  console.error(
    `\n\x1b[33mOrigin paths must point to docs/archive/plans/, not any of: ${FORBIDDEN_ORIGIN_PATHS.join(', ')}\x1b[0m`
  );
  console.error(
    'Fix: Replace the forbidden path with the equivalent docs/archive/plans/... path in the Origin lines above.\n'
  );
  process.exit(1);
}

console.log('BACKLOG Origin paths: OK');
```

- [ ] **Step 2: Add `validate-backlog` npm script in `package.json`**

Insert one line after `"check-assets": "node scripts/check-assets.js",` and before `"prepare": "husky"`. The `scripts` block becomes:

```json
"check-links": "node scripts/check-links.js",
"check-assets": "node scripts/check-assets.js",
"validate-backlog": "node scripts/validate-backlog-paths.js",
"prepare": "husky"
```

- [ ] **Step 3: Verify happy path manually**

Run from repo root:
```
npm run validate-backlog
```
Expected stdout (single line):
```
BACKLOG Origin paths: OK
```
Expected exit code: 0.

Verify exit code (PowerShell):
```
echo $LASTEXITCODE
```
Or in bash:
```
echo $?
```

- [ ] **Step 4: Verify denylist catches `docs/planning/plans/` violation**

Temporarily append a fake violation line to `BACKLOG.md`:
```
echo "**Origin**: docs/planning/plans/2099-01-01_fake.md" >> docs/planning/BACKLOG.md
```
Run:
```
npm run validate-backlog
```
Expected: red error block listing the fake violation with `[matched: docs/planning/plans/]` annotation, exit code 1.

Revert:
```
git checkout docs/planning/BACKLOG.md
```

- [ ] **Step 5: Verify denylist catches `docs/superpowers/` violation**

Temporarily append:
```
echo "**Origin**: docs/superpowers/plans/2099-01-01_fake.md" >> docs/planning/BACKLOG.md
```
Run:
```
npm run validate-backlog
```
Expected: red error block with `[matched: docs/superpowers/]` annotation, exit code 1.

Revert:
```
git checkout docs/planning/BACKLOG.md
```

- [ ] **Step 6: Verify staged-deletion silent skip**

Stage a deletion of BACKLOG.md (DO NOT COMMIT):
```
git rm --cached docs/planning/BACKLOG.md
```
Run:
```
npm run validate-backlog
```
Expected stdout:
```
BACKLOG Origin paths: skipped (BACKLOG.md not present)
```
Expected exit code: 0.

Restore the staging:
```
git restore --staged docs/planning/BACKLOG.md
```

- [ ] **Step 7: Commit**

```
git add scripts/validate-backlog-paths.js package.json
git commit -m "feat: Rewrite BACKLOG validator with denylist + git-index read"
```

Expected: husky pre-commit hook runs, validator runs (because BACKLOG.md is NOT in this commit, the existing-old hook regex `'BACKLOG.md'` won't match either, hook skips validator). Commit succeeds.

---

## Task 2: Tighten pre-commit hook

**Files:**
- Modify: `.husky/pre-commit`

- [ ] **Step 1: Update `.husky/pre-commit`**

Replace the entire file contents with:
```bash
npx lint-staged || exit 1
if git diff --cached --name-only | grep -qE '(^|/)BACKLOG\.md$'; then
  npm run validate-backlog
fi
```

Two changes from the prior version:
1. `grep -q 'BACKLOG.md'` → `grep -qE '(^|/)BACKLOG\.md$'` (anchored basename, escaped literal dot)
2. `node scripts/validate-backlog-paths.js` → `npm run validate-backlog`

- [ ] **Step 2: Smoke-test the tightened regex in isolation**

In bash:
```bash
printf 'OLD_BACKLOG.md\nBACKLOG.md.bak\nfoo/BACKLOG.md\nBACKLOG.md\n' | grep -E '(^|/)BACKLOG\.md$'
```
Expected stdout (only two lines):
```
foo/BACKLOG.md
BACKLOG.md
```

- [ ] **Step 3: Verify hook fires when BACKLOG.md is staged**

Make a no-op edit (e.g., add and immediately remove a trailing newline) to BACKLOG.md and stage it:
```
echo "" >> docs/planning/BACKLOG.md
git add docs/planning/BACKLOG.md
```
Test the hook in dry-run mode by directly running its body:
```
git diff --cached --name-only | grep -qE '(^|/)BACKLOG\.md$' && npm run validate-backlog
```
Expected: `BACKLOG Origin paths: OK`, exit 0.

Unstage:
```
git restore --staged docs/planning/BACKLOG.md
git checkout docs/planning/BACKLOG.md
```

- [ ] **Step 4: Verify hook does NOT fire when BACKLOG.md is not staged**

```
git diff --cached --name-only | grep -qE '(^|/)BACKLOG\.md$' && npm run validate-backlog
```
Expected: no output (grep exits non-zero, validator does not run).

- [ ] **Step 5: Commit**

```
git add .husky/pre-commit
git commit -m "build: Tighten BACKLOG.md pre-commit grep + invoke via npm script"
```

Expected: husky pre-commit hook runs (BACKLOG.md not staged, validator skipped via tightened grep). Commit succeeds.

---

## Task 3: Add CI gate + fold in CLAUDE.md updates

**Files:**
- Modify: `.github/workflows/deploy.yml`
- Modify (already changed by memory-updater agent): `CLAUDE.md`

- [ ] **Step 1: Add validation step to `lint` job in `deploy.yml`**

In `.github/workflows/deploy.yml`, locate the `lint` job (around lines 18–39). After the existing `Lint JS` step (around line 39), add:

```yaml
      - name: Validate BACKLOG Origin paths
        run: npm run validate-backlog
```

The `lint` job's steps section becomes:
```yaml
      - name: Lint CSS
        run: npm run lint:css

      - name: Lint JS
        run: npm run lint:js

      - name: Validate BACKLOG Origin paths
        run: npm run validate-backlog
```

- [ ] **Step 2: Verify CLAUDE.md changes are still pending in the working tree**

Run:
```
git diff --stat CLAUDE.md
```
Expected: shows the auto-memory updates made earlier (build-commands, conventions, patterns sections). The diff should reflect the `validate-backlog` script entry, the tightened pre-commit description, and the expanded BACKLOG Origin Paths section.

If the diff is empty, the CLAUDE.md updates were lost — re-run the auto-memory update before proceeding.

- [ ] **Step 3: Verify YAML lint locally (optional smoke check)**

Confirm the file still parses as YAML by running:
```
node -e "console.log(require('js-yaml').load(require('fs').readFileSync('.github/workflows/deploy.yml','utf8')).jobs.lint.steps.length)"
```
This expects `js-yaml` to be installed; if not, skip this step. (The repo does not depend on it; CI itself will validate the YAML on push.)

Lighter alternative: visually verify indentation matches surrounding steps (6-space indent for `- name:`).

- [ ] **Step 4: Commit functional change + CLAUDE.md fold-in together**

```
git add .github/workflows/deploy.yml CLAUDE.md
git commit -m "ci: Gate deploy on BACKLOG validator + sync CLAUDE.md"
```

Expected: husky pre-commit hook runs (BACKLOG.md not staged, validator skipped). Commit succeeds.

---

## Task 4: End-to-end verification

**Files:** none modified

- [ ] **Step 1: Full happy-path run from clean state**

```
npm run validate-backlog
```
Expected: `BACKLOG Origin paths: OK`, exit 0.

- [ ] **Step 2: Real-commit hook test with BACKLOG edit**

Make a trivial real edit to BACKLOG.md (e.g., add a clarifying comment to an existing entry — DO NOT add a forbidden Origin):
```
git checkout -b _verify-temp
```
Edit BACKLOG.md to add a single space at end of any benign line, save, then:
```
git add docs/planning/BACKLOG.md
git commit -m "test: Verify validator hook integration"
```
Expected: husky runs lint-staged, then runs `npm run validate-backlog` (because BACKLOG.md matches the new grep), prints `BACKLOG Origin paths: OK`, commit succeeds.

Tear down the verification branch:
```
git checkout chore/backlog-validator-hardening
git branch -D _verify-temp
```

- [ ] **Step 3: Negative real-commit hook test**

```
git checkout -b _verify-temp-bad
```
Edit BACKLOG.md to add a fake forbidden Origin line at the end:
```
echo "" >> docs/planning/BACKLOG.md
echo "**Origin**: docs/superpowers/plans/2099-01-01_fake.md" >> docs/planning/BACKLOG.md
git add docs/planning/BACKLOG.md
git commit -m "test: Should be blocked by validator"
```
Expected: validator prints red violation block, commit is blocked, exit code non-zero.

Tear down:
```
git checkout docs/planning/BACKLOG.md
git checkout chore/backlog-validator-hardening
git branch -D _verify-temp-bad
```

- [ ] **Step 4: Confirm no extra files modified**

```
git status --short
```
Expected: only the pre-existing uncommitted files from main (`.claude/settings.json`, `docs/planning/WEEKLY.md`, `docs/size-history.json`, `sitemap.xml`) — no new modifications introduced by verification.

---

## Task 5: Task completion workflow

**Files:**
- Modify: `docs/planning/WEEKLY.md`
- Modify: `docs/planning/BACKLOG.md` (only if implementation surfaced new follow-ups)
- Move: `docs/superpowers/plans/2026-05-06_backlog-validator-hardening.md` → `docs/archive/plans/`
- Move (if not already in archive): `docs/superpowers/specs/2026-05-06_backlog-validator-hardening-design.md` → `docs/archive/specs/`
- Modify: `docs/planning/TODO.md` and `docs/planning/DONE.md` (if a TODO entry exists for this group)

- [ ] **Step 1: Tick the 5 Wednesday checkboxes in `docs/planning/WEEKLY.md`**

Locate lines ~70–74 in `docs/planning/WEEKLY.md`. Change each `- [ ]` to `- [x]`:
```
- [x] Extend regex to catch `docs/superpowers/` Origin paths *(2 SP, IMPORTANT)*
- [x] Read BACKLOG.md from git index + handle staged-deletion ENOENT *(3 SP)*
- [x] Tighten pre-commit grep pattern *(1 SP)*
- [x] Add `npm run validate-backlog` script *(<1 SP)*
- [x] Add success output to validator *(<1 SP)*
```

Also update the Summary Table row (around line 99). Change `⏳ Planned` to `✅ Done` for the BACKLOG Validator Hardening row.

- [ ] **Step 2: Archive the plan and spec**

```
git mv docs/superpowers/plans/2026-05-06_backlog-validator-hardening.md docs/archive/plans/
git mv docs/superpowers/specs/2026-05-06_backlog-validator-hardening-design.md docs/archive/specs/
```

After moving, update the `**Spec:**` reference inside the archived plan file to point to the new spec location:
- Old: `docs/superpowers/specs/2026-05-06_backlog-validator-hardening-design.md`
- New: `docs/archive/specs/2026-05-06_backlog-validator-hardening-design.md`

(Cross-reference fix is the same gotcha mentioned in BACKLOG.md line 779 — "Validate spec references after file moves".)

- [ ] **Step 3: Extract improvements to `docs/planning/BACKLOG.md` (if any)**

Per the task completion workflow, extract a minimum of 2 backlog items discovered during implementation. Candidates to consider:

- **Externalize `FORBIDDEN_ORIGIN_PATHS` to a config file** — currently inline in script; if the list grows beyond 3-4 entries, move to `.backlog-validator.json` for cleaner audit trail.
- **Unit-test the validator** — `scripts/` lacks test infra; if more script logic accretes, introduce node:test or vitest. Mirrors the existing technical-debt acknowledgement for `check-links.js` / `check-assets.js`.
- **Add `--working-tree` flag for explicit override** — current auto-detect is best-effort; if a user genuinely needs to validate WIP edits without staging, a flag would help. Confidence low until a real complaint surfaces.

Append entries to BACKLOG.md following the existing format. **Each `**Origin**:` line MUST reference `docs/archive/plans/2026-05-06_backlog-validator-hardening.md` (the archived path), NOT `docs/planning/plans/` or `docs/superpowers/` — the validator we just shipped will block any commit that gets this wrong.**

- [ ] **Step 4: Transition TODO → DONE if a TODO entry exists**

Check:
```
grep -n "BACKLOG Validator" docs/planning/TODO.md
```
If a matching entry exists, move it to `docs/planning/DONE.md` with: archived plan link, one-sentence summary, and key changes (4 files, 5 sub-items, 7 SP). If no matching entry exists (the work was tracked solely via WEEKLY.md), skip this step.

- [ ] **Step 5: Commit task-completion docs**

```
git add docs/planning/WEEKLY.md docs/archive/plans/ docs/archive/specs/ docs/superpowers/plans/ docs/superpowers/specs/
git add docs/planning/BACKLOG.md docs/planning/TODO.md docs/planning/DONE.md 2>/dev/null
git commit -m "docs: Archive BACKLOG Validator Hardening plan + transition WEEKLY"
```

Expected: husky runs validator (BACKLOG.md is staged), validator passes (archived path is correctly used), commit succeeds.

---

## Self-Review

**Spec coverage check:**

| Spec section | Implemented in |
|---|---|
| Validator rewrite (constants, readBacklog, validation loop, output) | Task 1, Step 1 |
| Pre-commit hook tightening (grep + npm script invocation) | Task 2, Step 1 |
| `package.json` script entry | Task 1, Step 2 |
| CI lint-job step | Task 3, Step 1 |
| Edge case: staged-deletion silent exit | Task 1, Step 6 + Task 4 (real hook context) |
| Edge case: false-positive grep | Task 2, Step 2 |
| Edge case: no-git environment | Covered by code (try/catch fall-back); not separately verified — would require running outside a git repo |
| Verification scenarios 1–8 | Task 1 (steps 3–6) + Task 2 (step 2) + Task 4 (steps 1–3) + CI: covered by Task 3 ship + observed on first push |

Verification scenario 8 (CI gate fires on bad Origin) is necessarily verified post-push. The plan does not include a deliberate "open a bad PR" step because that would pollute the PR queue; instead, we trust that the local hook negative test (Task 4 Step 3) exercises the same `npm run validate-backlog` invocation that CI uses.

**Placeholder scan:** No TBDs, TODOs, or vague "add error handling" placeholders. All commands, code, and expected outputs are concrete.

**Type / name consistency check:**
- `FORBIDDEN_ORIGIN_PATHS` referenced in: validator code, error message, CLAUDE.md, BACKLOG extract item — all match.
- `BACKLOG_REL_PATH` defined and used only in validator — internal.
- `npm run validate-backlog` name consistent across: package.json, .husky/pre-commit, deploy.yml, plan verification commands, CLAUDE.md.
- Grep regex `(^|/)BACKLOG\.md$` consistent between plan and CLAUDE.md.

No mismatches.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-05-06_backlog-validator-hardening.md`. Two execution options:

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration.

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints.

Which approach?
