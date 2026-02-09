const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const DIST_DIR = path.join(__dirname, '..', 'dist');
const CSS_SOURCE = path.join(DIST_DIR, 'style.css');
const HTML_FILES = [
  path.join(__dirname, '..', 'index.html'),
  path.join(__dirname, '..', '404.html')
];
const HASH_LENGTH = 8;
const CSS_REF_PATTERN = /dist\/style(?:\.[a-f0-9]{8})?\.css/g;

function updateHtmlReferences(replacement) {
  for (const htmlFile of HTML_FILES) {
    const content = fs.readFileSync(htmlFile, 'utf8');
    const updated = content.replace(CSS_REF_PATTERN, replacement);

    if (content === updated && !content.includes(replacement)) {
      console.error(`Error: No CSS reference found in ${path.basename(htmlFile)}`);
      process.exit(1);
    }

    if (content !== updated) {
      fs.writeFileSync(htmlFile, updated, 'utf8');
      console.log(`Updated: ${path.basename(htmlFile)}`);
    }
  }
}

// --unhash mode: restore HTML references to dist/style.css (for watch mode)
if (process.argv.includes('--unhash')) {
  updateHtmlReferences('dist/style.css');
  console.log('Unhashed HTML references for watch mode');
  process.exit(0);
}

// Step 1: Read built CSS and compute content hash
if (!fs.existsSync(CSS_SOURCE)) {
  console.error('Error: dist/style.css not found. Run build:css first.');
  process.exit(1);
}
const content = fs.readFileSync(CSS_SOURCE);
const hash = crypto.createHash('sha256').update(content).digest('hex').substring(0, HASH_LENGTH);

// Step 2: Clean old hashed files, rename to new hash
const newFilename = `style.${hash}.css`;
const newPath = path.join(DIST_DIR, newFilename);

const files = fs.readdirSync(DIST_DIR);
for (const file of files) {
  if (/^style\.[a-f0-9]{8}\.css$/.test(file) && file !== newFilename) {
    fs.unlinkSync(path.join(DIST_DIR, file));
    console.log(`Cleaned: dist/${file}`);
  }
}

fs.renameSync(CSS_SOURCE, newPath);
console.log(`Renamed: dist/style.css -> dist/${newFilename}`);

// Step 3: Update HTML files to reference hashed filename
updateHtmlReferences(`dist/${newFilename}`);

// Step 4: Validate final state
if (!fs.existsSync(newPath)) {
  console.error(`Error: ${newFilename} not found after rename`);
  process.exit(1);
}
for (const htmlFile of HTML_FILES) {
  const htmlContent = fs.readFileSync(htmlFile, 'utf8');
  if (!htmlContent.includes(`dist/${newFilename}`)) {
    console.error(`Error: ${path.basename(htmlFile)} does not reference ${newFilename}`);
    process.exit(1);
  }
}

console.log(`Cache-busting complete: ${newFilename}`);
