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
// Origin lines must point to docs/archive/plans/ (or docs/archive/specs/
// for specs) after task completion. The docs/superpowers/ entry is
// intentionally broad: it covers both docs/superpowers/plans/ and
// docs/superpowers/specs/, both of which are pending consolidation into
// docs/archive/.
const FORBIDDEN_ORIGIN_PATHS = ['docs/planning/plans/', 'docs/superpowers/'];
const BACKLOG_REL_PATH = 'docs/planning/BACKLOG.md';

function readBacklog() {
  try {
    return execFileSync('git', ['show', `:${BACKLOG_REL_PATH}`], {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });
  } catch {
    // git show failed — determine whether we're in a git repo.
    // If we are, the file is absent from the index (staged for deletion or
    // never staged). Treat as absent (skip). If git is unavailable entirely,
    // fall back to the working-tree file.
    try {
      execFileSync('git', ['rev-parse', '--is-inside-work-tree'], {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe'],
      });
      // Inside a git repo but file not in index — skip.
      return null;
    } catch {
      // git not available — read from working tree.
      const fullPath = path.join(__dirname, '..', BACKLOG_REL_PATH);
      if (!fs.existsSync(fullPath)) return null;
      return fs.readFileSync(fullPath, 'utf8');
    }
  }
}

const content = readBacklog();
if (content === null) {
  console.log('BACKLOG Origin paths: skipped (BACKLOG.md not present)');
  process.exit(0);
}

const violations = [];
content.split('\n').forEach((line, index) => {
  if (!/^\s*(?:[-*+]\s+)?\*\*Origin\*\*/.test(line)) return;
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
