const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const { minify } = require('terser');

const ROOT = path.join(__dirname, '..');
const DIST_DIR = path.join(ROOT, 'dist');
const HTML_FILES = [
  path.join(ROOT, 'index.html'),
  path.join(ROOT, '404.html'),
];
const HASH_LENGTH = 8;

// Asset configurations: each describes a hashable asset
const ASSETS = [
  {
    name: 'CSS',
    source: path.join(DIST_DIR, 'style.css'),
    basename: 'style.css',
    refPattern: /dist\/style(?:\.[a-f0-9]{8})?\.css/g,
    plainRef: 'dist/style.css',
    transform: null,
  },
  {
    name: 'JS',
    source: path.join(ROOT, 'js', 'main.js'),
    basename: 'main.js',
    refPattern: /(?:js|dist)\/main(?:\.[a-f0-9]{8})?\.js/g,
    plainRef: 'js/main.js',
    transform: async (content) => {
      const result = await minify(content.toString('utf8'), {
        compress: true,
        mangle: true,
        sourceMap: false,
      });
      if (!result.code) {
        throw new Error('Terser produced no output for js/main.js');
      }
      return Buffer.from(result.code, 'utf8');
    },
  },
];

function computeHash(content) {
  return crypto
    .createHash('sha256')
    .update(content)
    .digest('hex')
    .substring(0, HASH_LENGTH);
}

function updateHtmlRefs(refPattern, replacement) {
  for (const htmlFile of HTML_FILES) {
    const content = fs.readFileSync(htmlFile, 'utf8');
    const updated = content.replace(refPattern, replacement);

    if (content === updated && !content.includes(replacement)) {
      console.error(
        `Error: No reference matching ${refPattern} found in ${path.basename(htmlFile)}`
      );
      process.exit(1);
    }

    if (content !== updated) {
      fs.writeFileSync(htmlFile, updated, 'utf8');
      console.log(`Updated: ${path.basename(htmlFile)}`);
    }
  }
}

// --unhash mode: restore all HTML references for watch mode
if (process.argv.includes('--unhash')) {
  for (const asset of ASSETS) {
    updateHtmlRefs(asset.refPattern, asset.plainRef);
  }
  console.log('Unhashed HTML references for watch mode');
  process.exit(0);
}

async function hashAsset(asset) {
  if (!fs.existsSync(asset.source)) {
    console.error(`Error: ${path.relative(ROOT, asset.source)} not found.`);
    process.exit(1);
  }

  // Read source content
  let content = fs.readFileSync(asset.source);

  // Apply optional transform (e.g., terser minification for JS)
  if (asset.transform) {
    content = await asset.transform(content);
  }

  // Compute hash and build new filename
  const hash = computeHash(content);
  const ext = path.extname(asset.basename);
  const stem = path.basename(asset.basename, ext);
  const newFilename = `${stem}.${hash}${ext}`;
  const newPath = path.join(DIST_DIR, newFilename);

  // Clean old hashed files from dist/
  const stalePattern = new RegExp(
    `^${stem}\\.[a-f0-9]{${HASH_LENGTH}}\\${ext}$`
  );
  const files = fs.readdirSync(DIST_DIR);
  for (const file of files) {
    if (stalePattern.test(file) && file !== newFilename) {
      fs.unlinkSync(path.join(DIST_DIR, file));
      console.log(`Cleaned: dist/${file}`);
    }
  }

  // Write hashed file to dist/
  // For CSS: source is in dist/ (PostCSS output), so rename in place
  // For JS: source is in js/, so write new file to dist/
  const sourceInDist = path.dirname(asset.source) === DIST_DIR;
  if (sourceInDist) {
    fs.unlinkSync(asset.source);
    fs.writeFileSync(newPath, content);
    console.log(
      `Renamed: dist/${path.basename(asset.source)} -> dist/${newFilename}`
    );
  } else {
    fs.writeFileSync(newPath, content);
    console.log(`Written: dist/${newFilename}`);
  }

  // Update HTML references
  updateHtmlRefs(asset.refPattern, `dist/${newFilename}`);

  console.log(`Cache-busting complete: ${newFilename}`);
}

async function main() {
  for (const asset of ASSETS) {
    await hashAsset(asset);
  }
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
