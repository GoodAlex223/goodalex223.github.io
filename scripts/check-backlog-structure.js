/**
 * Validates that docs/planning/BACKLOG.md retains the 4 required top-level
 * headers: the pinned 📌 Process Rules section plus the 3 source sections
 * (🔵 User-Flagged / 🟡 Operational / 🟤 Auto-Generated). The source-split is
 * load-bearing for weekly planning — accidental deletion of a header (or an
 * emoji typo) would silently break source-quota enforcement. Reads from the
 * git index when available (canonical "what's about to be committed"); falls
 * back to the working tree. An optional path argument overrides both (used for
 * standalone checks and tests). Invoked by pre-commit hook, npm script, and CI.
 *
 * Spec: docs/archive/specs/2026-06-07_backlog-restructure-design.md
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const BACKLOG_REL_PATH = 'docs/planning/BACKLOG.md';

const REQUIRED_HEADERS = [
  '## 📌 Process Rules (READ BEFORE PROPOSING WORK)',
  '## 🔵 User-Flagged Ideas',
  '## 🟡 Operational & Observation Items',
  '## 🟤 Auto-Generated Tech Debt',
];

function readBacklog(argPath) {
  if (argPath) {
    if (!fs.existsSync(argPath)) return null;
    return fs.readFileSync(argPath, 'utf8');
  }
  // Default: read the staged content from the git index (matches
  // validate-backlog-paths.js). Falls back to working tree if git is absent.
  try {
    return execFileSync('git', ['show', `:${BACKLOG_REL_PATH}`], {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });
  } catch {
    try {
      execFileSync('git', ['rev-parse', '--is-inside-work-tree'], {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe'],
      });
      // Inside a git repo but file not in index — skip.
      return null;
    } catch {
      const fullPath = path.join(__dirname, '..', BACKLOG_REL_PATH);
      if (!fs.existsSync(fullPath)) return null;
      return fs.readFileSync(fullPath, 'utf8');
    }
  }
}

const content = readBacklog(process.argv[2]);
if (content === null) {
  console.log('BACKLOG structure: skipped (BACKLOG.md not present)');
  process.exit(0);
}

const missing = REQUIRED_HEADERS.filter((h) => !content.includes(h));

if (missing.length > 0) {
  console.error('\x1b[31mBACKLOG structure validation failed — missing required headers:\x1b[0m\n');
  missing.forEach((h) => console.error(`  - ${h}`));
  console.error(
    '\n\x1b[33mThe source-split (📌 Process Rules + 🔵/🟡/🟤) is load-bearing for weekly planning. Restore the missing header(s).\x1b[0m\n'
  );
  process.exit(1);
}

console.log('BACKLOG structure: OK');
