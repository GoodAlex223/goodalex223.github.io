const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const SITEMAP = path.join(ROOT, 'sitemap.xml');

function main() {
  if (!fs.existsSync(SITEMAP)) {
    console.error('Error: sitemap.xml not found at project root.');
    process.exit(1);
  }

  let rawDate;
  try {
    rawDate = execSync('git log -1 --format=%aI -- index.html', {
      cwd: ROOT,
      encoding: 'utf8',
    }).trim();
  } catch {
    console.error('Error: git command failed. Is git installed?');
    process.exit(1);
  }

  if (!rawDate) {
    // Shallow clone: index.html not in fetched commits — fall back to HEAD date
    try {
      rawDate = execSync('git log -1 --format=%aI', {
        cwd: ROOT,
        encoding: 'utf8',
      }).trim();
    } catch {
      // ignore — rawDate stays empty
    }
  }

  if (!rawDate) {
    console.warn(
      'Warning: Could not determine last commit date. Skipping sitemap update.'
    );
    process.exit(0);
  }

  // %aI produces ISO 8601 strict: "2026-02-04T15:30:00+02:00"
  const newDate = rawDate.slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(newDate)) {
    console.error(`Error: Unexpected date format from git: "${rawDate}"`);
    process.exit(1);
  }

  const content = fs.readFileSync(SITEMAP, 'utf8');
  const updated = content.replace(
    /<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/,
    `<lastmod>${newDate}</lastmod>`
  );

  if (updated === content) {
    console.log(`Sitemap lastmod already up to date: ${newDate}`);
    return;
  }

  fs.writeFileSync(SITEMAP, updated, 'utf8');
  console.log(`Updated sitemap.xml lastmod: ${newDate}`);
}

main();
