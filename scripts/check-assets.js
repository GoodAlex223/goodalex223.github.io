/**
 * Validates that internal asset references in index.html, 404.html, and
 * data/projects.json resolve to files that exist on disk.
 *
 * Complements scripts/check-links.js (external HTTP URL check). Together they
 * form the CI "check-links" gate that blocks broken references before deploy.
 *
 * Exits non-zero on any missing asset. Requires `npm run build` to have run
 * first so that hashed dist/ references are present.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const INDEX_PATH = path.join(ROOT, 'index.html');
const NOT_FOUND_PATH = path.join(ROOT, '404.html');
const PROJECTS_PATH = path.join(ROOT, 'data', 'projects.json');

// Color constants for reporting
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const RESET = '\x1b[0m';

/**
 * Returns true for refs that are not internal asset paths we can check on disk:
 *   - External URLs (http://, https://, protocol-relative //)
 *   - mailto: and tel: schemes
 *   - data: URIs
 *   - In-page anchors (#foo) and root/homepage-nav (/ and /#foo)
 *   - Empty strings
 */
function isExcludedRef(ref) {
  if (!ref) return true;
  if (/^(https?:)?\/\//.test(ref)) return true;
  if (ref.startsWith('mailto:')) return true;
  if (ref.startsWith('tel:')) return true;
  if (ref.startsWith('data:')) return true;
  if (ref.startsWith('#')) return true;

  // Strip ?query and #fragment to see if only "/" or "" remains (homepage nav)
  const withoutQuery = ref.split('?')[0].split('#')[0];
  if (withoutQuery === '' || withoutQuery === '/') return true;

  return false;
}

/**
 * Extracts href= and src= attribute values from an HTML file.
 *
 * Note: this regex extracts any `href=` / `src=` attribute-shaped string in
 * the raw HTML, including matches inside <script> blocks, JSON-LD payloads
 * (<script type="application/ld+json">), and HTML comments. Today the repo
 * has no such bypasses (verified during PR #65 review), but a future JSON-LD
 * addition could need a stricter parser.
 *
 * Returns an array of { ref, source } objects. Excluded refs are filtered out.
 */
function extractHtmlRefs(filePath, sourceLabel) {
  const html = fs.readFileSync(filePath, 'utf8');
  const pattern = /(?:href|src)="([^"]+)"/g;
  const refs = [];
  let match;
  while ((match = pattern.exec(html)) !== null) {
    const ref = match[1];
    if (!isExcludedRef(ref)) {
      refs.push({ ref, source: sourceLabel });
    }
  }
  return refs;
}

/**
 * Extracts screenshot src paths from data/projects.json.
 * Walks projects[*].screenshots[].src. Skips excluded refs.
 */
function extractJsonRefs() {
  const projects = JSON.parse(fs.readFileSync(PROJECTS_PATH, 'utf8'));
  const refs = [];
  for (const project of Object.values(projects)) {
    if (typeof project !== 'object' || project === null) continue;
    if (!Array.isArray(project.screenshots)) continue;
    for (const screenshot of project.screenshots) {
      const ref = screenshot && screenshot.src;
      if (typeof ref === 'string' && !isExcludedRef(ref)) {
        refs.push({ ref, source: 'data/projects.json' });
      }
    }
  }
  return refs;
}

/**
 * Resolves an internal asset ref to an absolute path from the repo root.
 * Strips query strings and fragments. Leading "/" is treated as repo-root-absolute
 * (matches GitHub Pages behavior for this site).
 */
function resolveRef(ref) {
  const clean = ref.split('?')[0].split('#')[0];
  const relative = clean.startsWith('/') ? clean.slice(1) : clean;
  return path.join(ROOT, relative);
}

/**
 * Returns true if the file exists at the requested case.
 *
 * On case-insensitive filesystems (macOS default, Windows), the requested
 * casing must match the on-disk casing exactly — otherwise the ref would fail
 * on Linux CI. This is enforced by canonicalizing via realpathSync.native()
 * (which returns the on-disk casing on macOS via realpath(3) and on Windows
 * via GetFinalPathNameByHandle) and comparing to the originally requested
 * absolute path. On Linux, wrong-cased refs already fail fs.existsSync, so
 * realpath is defensive.
 *
 * Assumption: realpathSync.native case-canonicalization on macOS/Windows is
 * empirically reliable but not docs-guaranteed by Node. If a future Node
 * release changes this behavior, fall back to a per-segment readdirSync walk
 * (see BACKLOG: Memoize readdirSync per-directory in assetExists).
 */
function assetExists(absolutePath) {
  if (!fs.existsSync(absolutePath)) return false;
  try {
    const canonical = fs.realpathSync.native(absolutePath);
    return canonical === absolutePath;
  } catch {
    return false;
  }
}

function main() {
  for (const src of [INDEX_PATH, NOT_FOUND_PATH, PROJECTS_PATH]) {
    if (!fs.existsSync(src)) {
      console.error(
        `Error: ${path.relative(ROOT, src)} not found. ` +
        `Run from project root, and ensure \`npm run build\` completed and any CI artifacts downloaded.`
      );
      process.exit(1);
    }
  }

  const allRefs = [
    ...extractHtmlRefs(INDEX_PATH, 'index.html'),
    ...extractHtmlRefs(NOT_FOUND_PATH, '404.html'),
    ...extractJsonRefs(),
  ];

  const refSources = new Map();
  for (const { ref, source } of allRefs) {
    if (!refSources.has(ref)) refSources.set(ref, new Set());
    refSources.get(ref).add(source);
  }

  console.log(`Checking ${refSources.size} internal asset references...\n`);

  const results = [];
  for (const [ref, sources] of refSources) {
    const absolutePath = resolveRef(ref);
    const ok = assetExists(absolutePath);
    results.push({ ref, sources: [...sources], ok });
  }

  // Sort: OK first, broken at the bottom for visibility
  results.sort((a, b) => Number(b.ok) - Number(a.ok));

  let passed = 0;
  let failed = 0;
  for (const result of results) {
    const sourceList = result.sources.join(', ');
    if (result.ok) {
      console.log(`  ${GREEN}\u2713${RESET} ${result.ref} [${sourceList}]`);
      passed++;
    } else {
      console.log(`  ${RED}\u2717${RESET} ${result.ref} [${sourceList}]`);
      failed++;
    }
  }

  console.log(`\nResults: ${passed} passed, ${failed} failed`);

  if (failed > 0) {
    process.exit(1);
  }
}

main();
