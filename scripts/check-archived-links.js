/**
 * Validates that archived docs (docs/archive/**) contain no dead navigational
 * pointers to docs/superpowers/. Plans and specs are authored in
 * docs/superpowers/<plans|specs>/ then archived to docs/archive/<plans|specs>/;
 * their internal Spec:/Plan:/Pass 1:/Design spec: pointers must be retargeted to
 * the archived location during archival. This guard catches the ones that slip
 * through and prevents recurrence. Reads the working tree (a directory scan; the
 * pre-commit conditional only fires when docs/archive/ files are staged, so the
 * on-disk content it reads is what is about to be committed). Invoked by the
 * pre-commit hook, the npm script, and CI.
 *
 * Spec: docs/archive/specs/2026-06-17_archived-doc-dead-links-design.md
 */

const fs = require('fs');
const path = require('path');

const ARCHIVE_REL_DIR = 'docs/archive';
const FORBIDDEN = 'docs/superpowers/';

// Files exempt from the check: genuinely-historical docs whose docs/superpowers/
// references document the superpowers -> archive migration itself and must not
// be rewritten. Repo-relative, POSIX-style paths. Add a file here only when its
// superpowers refs are genuinely historical, not stale navigational pointers.
const ALLOWED_FILES = ['docs/archive/plans/2026-03-27_archive-cleanup.md'];

// A navigational pointer line: a Spec:/Plan:/Pass 1...:/Design spec: label at the
// start of the line (after optional blockquote, bullet, and ** markup). Command
// text (git add ..., ls ...), prose, table cells, and denylist literals do not
// start with such a label and are therefore left untouched.
const NAV_POINTER =
  /^\s*(?:>\s*)?(?:[-*]\s*)?(?:\*\*)?(?:Spec|Plan|Pass 1[^:]*|Design spec)(?:\*\*)?\s*:/;

function listMarkdownFiles(dir) {
  const out = [];
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return out; // dir missing or unreadable — caller handles "skipped"
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...listMarkdownFiles(full));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      out.push(full);
    }
  }
  return out;
}

const repoRoot = path.join(__dirname, '..');
const archiveDir = path.join(repoRoot, ARCHIVE_REL_DIR);

if (!fs.existsSync(archiveDir)) {
  console.log('Archived-doc links: skipped (docs/archive/ not present)');
  process.exit(0);
}

const violations = [];
for (const file of listMarkdownFiles(archiveDir)) {
  const relPath = path.relative(repoRoot, file).split(path.sep).join('/');
  if (ALLOWED_FILES.includes(relPath)) continue;
  const content = fs.readFileSync(file, 'utf8');
  content.split('\n').forEach((line, index) => {
    if (NAV_POINTER.test(line) && line.includes(FORBIDDEN)) {
      violations.push({ file: relPath, line: index + 1, content: line.trim() });
    }
  });
}

if (violations.length > 0) {
  console.error('\x1b[31mArchived-doc dead-link validation failed:\x1b[0m\n');
  violations.forEach((v) => {
    console.error(`  ${v.file}:${v.line} — ${v.content}`);
  });
  console.error(
    `\n\x1b[33mArchived docs must not point navigational links (Spec:/Plan:/Pass 1:/Design spec:) at ${FORBIDDEN}\x1b[0m`
  );
  console.error(
    'Fix: retarget each to docs/archive/specs/ (specs) or docs/archive/plans/ (plans) with an underscore date.\n'
  );
  process.exit(1);
}

console.log('Archived-doc links: OK');
