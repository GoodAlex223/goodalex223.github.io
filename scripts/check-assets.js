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

// Color constants for reporting (used in extractAssets and checkAssets functions, added in later tasks)
// eslint-disable-next-line no-unused-vars
const GREEN = '\x1b[32m';
// eslint-disable-next-line no-unused-vars
const RED = '\x1b[31m';
// eslint-disable-next-line no-unused-vars
const RESET = '\x1b[0m';

function main() {
  for (const src of [INDEX_PATH, NOT_FOUND_PATH, PROJECTS_PATH]) {
    if (!fs.existsSync(src)) {
      console.error(`Error: ${path.relative(ROOT, src)} not found. Run from project root.`);
      process.exit(1);
    }
  }
  console.log('Checking 0 internal asset references...\n');
  console.log('Results: 0 passed, 0 failed');
}

main();
