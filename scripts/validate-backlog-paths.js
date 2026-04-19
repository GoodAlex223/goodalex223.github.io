/**
 * Validates that BACKLOG.md Origin paths point to docs/archive/plans/,
 * not docs/planning/plans/. Run by pre-commit hook when BACKLOG.md is staged.
 * Exits non-zero on violation (blocks commit).
 */

const fs = require('fs');
const path = require('path');

const BACKLOG_PATH = path.join(__dirname, '..', 'docs', 'planning', 'BACKLOG.md');

const lines = fs.readFileSync(BACKLOG_PATH, 'utf8').split('\n');
const violations = [];

lines.forEach((line, index) => {
  if (line.includes('**Origin**') && line.includes('docs/planning/plans/')) {
    violations.push({ line: index + 1, content: line.trim() });
  }
});

if (violations.length > 0) {
  console.error('\x1b[31mBACKLOG Origin path validation failed:\x1b[0m\n');
  violations.forEach((v) => {
    console.error(`  Line ${v.line}: ${v.content}`);
  });
  console.error(
    '\n\x1b[33mOrigin paths must point to docs/archive/plans/, not docs/planning/plans/.\x1b[0m'
  );
  console.error('Fix: Replace "docs/planning/plans/" with "docs/archive/plans/" in the Origin lines above.\n');
  process.exit(1);
}
