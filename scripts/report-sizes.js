const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const ROOT = path.join(__dirname, '..');
const DIST_DIR = path.join(ROOT, 'dist');
const HISTORY_FILE = path.join(ROOT, 'docs', 'size-history.json');

// Gzip size budgets (bytes)
const BUDGETS = {
  CSS: 20 * 1024,
  JS: 10 * 1024,
};

// Must match HASH_LENGTH in scripts/hash-assets.js
const HASH_LENGTH = 8;

function formatKB(bytes) {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

function gzipSize(buffer) {
  return zlib.gzipSync(buffer).length;
}

function findHashedFile(stem, ext) {
  const pattern = new RegExp(`^${stem}\\.[a-f0-9]{${HASH_LENGTH}}\\${ext}$`);
  const files = fs.readdirSync(DIST_DIR);
  const match = files.find((f) => pattern.test(f));
  if (!match) {
    console.error(`Error: No hashed file found matching ${stem}.[hash]${ext} in dist/`);
    process.exit(1);
  }
  return match;
}

function main() {
  if (!fs.existsSync(DIST_DIR)) {
    console.error('Error: dist/ directory not found. Run npm run build first.');
    process.exit(1);
  }

  const cssFilename = findHashedFile('style', '.css');
  const jsFilename = findHashedFile('main', '.js');

  const cssContent = fs.readFileSync(path.join(DIST_DIR, cssFilename));
  const jsMinContent = fs.readFileSync(path.join(DIST_DIR, jsFilename));
  const jsSourcePath = path.join(ROOT, 'js', 'main.js');

  if (!fs.existsSync(jsSourcePath)) {
    console.error('Error: js/main.js not found.');
    process.exit(1);
  }
  const jsSourceContent = fs.readFileSync(jsSourcePath);

  const cssRaw = cssContent.length;
  const cssGz = gzipSize(cssContent);

  const jsSrc = jsSourceContent.length;
  const jsMin = jsMinContent.length;
  const jsGz = gzipSize(jsMinContent);

  const cssFileLabel = `dist/${cssFilename}`;
  const jsFileLabel = `js/main.js \u2192 dist/${jsFilename}`;
  const colWidth = Math.max(cssFileLabel.length, jsFileLabel.length);

  console.log('Build size report:');
  console.log(
    `  CSS  ${cssFileLabel.padEnd(colWidth)}   ${formatKB(cssRaw)} raw \u2192 ${formatKB(cssGz)} gzip`
  );
  if (cssGz > BUDGETS.CSS) {
    console.warn(`  Warning: CSS gzip (${formatKB(cssGz)}) exceeds ${formatKB(BUDGETS.CSS)} budget`);
  }

  console.log(
    `  JS   ${jsFileLabel.padEnd(colWidth)}   ${formatKB(jsSrc)} src \u2192 ${formatKB(jsMin)} min \u2192 ${formatKB(jsGz)} gzip`
  );
  if (jsGz > BUDGETS.JS) {
    console.warn(`  Warning: JS gzip (${formatKB(jsGz)}) exceeds ${formatKB(BUDGETS.JS)} budget`);
  }

  console.log('Build size reporting complete');

  appendSizeHistory(cssRaw, cssGz, jsSrc, jsMin, jsGz);
}

function appendSizeHistory(cssRaw, cssGzip, jsSrc, jsMin, jsGzip) {
  let history = [];

  if (fs.existsSync(HISTORY_FILE)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
      if (!Array.isArray(parsed)) {
        console.warn('Warning: size-history.json is not an array, starting fresh.');
      } else {
        history = parsed;
      }
    } catch {
      console.warn('Warning: Could not parse size-history.json, starting fresh.');
      history = [];
    }
  }

  const entry = {
    timestamp: new Date().toISOString(),
    css: { raw: cssRaw, gzip: cssGzip },
    js: { src: jsSrc, min: jsMin, gzip: jsGzip },
  };

  history.push(entry);
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2) + '\n');
  console.log(`Size history updated (${history.length} entries in docs/size-history.json)`);
}

main();
