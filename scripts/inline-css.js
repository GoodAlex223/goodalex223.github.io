const fs = require('fs');
const path = require('path');

const HTML_FILES = [
  path.join(__dirname, '..', 'index.html'),
  path.join(__dirname, '..', '404.html')
];

// Shared cleanup: remove all critters artifacts from HTML
// Idempotent — safe to run on HTML that was never inlined
function cleanInlineArtifacts(html) {
  // Remove critters-injected <style> tags in <head>
  const headEnd = html.indexOf('</head>');
  if (headEnd !== -1) {
    const head = html.substring(0, headEnd);
    const rest = html.substring(headEnd);
    html = head.replace(/<style>[\s\S]*?<\/style>\s*/g, '') + rest;
  }

  // Remove critters container marker and temporary data-theme attribute
  html = html.replace(/ data-critters-container/g, '');
  html = html.replace(/ data-theme="light"/g, '');

  // Restore async link to normal (remove media="print" onload="...")
  html = html.replace(
    /<link rel="stylesheet" href="(dist\/style[^"]*\.css)" media="print" onload="[^"]*"\s*\/?>/g,
    '<link rel="stylesheet" href="$1" />'
  );

  // Remove <noscript> stylesheet fallback (handles links with extra attributes)
  html = html.replace(
    /\s*<noscript><link rel="stylesheet" href="dist\/style[^"]*\.css"[^>]*><\/noscript>/g,
    ''
  );

  return html;
}

// --restore mode: remove inline CSS and restore normal <link> (for watch mode)
if (process.argv.includes('--restore')) {
  let anyModified = false;

  for (const htmlFile of HTML_FILES) {
    const original = fs.readFileSync(htmlFile, 'utf8');
    const html = cleanInlineArtifacts(original);

    if (html !== original) {
      fs.writeFileSync(htmlFile, html, 'utf8');
      console.log(`Restored: ${path.basename(htmlFile)}`);
      anyModified = true;
    }
  }

  if (!anyModified) {
    console.log('Nothing to restore');
  }
  process.exit(0);
}

// Normal mode: inline critical CSS using critters
const Critters = require('critters');

async function inlineCriticalCSS() {
  const critters = new Critters({
    path: path.join(__dirname, '..'),
    publicPath: '',
    preload: 'media',
    noscriptFallback: true,
    inlineFonts: true,
    fonts: false,
    pruneSource: false,
    mergeStylesheets: false,
    compress: true,
    keyframes: 'critical',
    logLevel: 'warn',
    external: true,
    inlineThreshold: 0,
  });

  // Read built CSS for light theme variable injection
  const cssPath = path.join(__dirname, '..', 'dist', 'style.css');
  if (!fs.existsSync(cssPath)) {
    console.error('Error: dist/style.css not found. Run build:css first.');
    process.exit(1);
  }
  const css = fs.readFileSync(cssPath, 'utf8');
  const lightThemeVars = css.match(/\[data-theme=light\]\{[^}]+\}/);

  for (const htmlFile of HTML_FILES) {
    const raw = fs.readFileSync(htmlFile, 'utf8');

    // Clean any leftover artifacts from previous builds (idempotency)
    const html = cleanInlineArtifacts(raw);

    // Temporarily add data-theme="light" to <html> so critters includes
    // [data-theme="light"] selectors (attribute is set dynamically by JS,
    // not present in static HTML)
    const htmlForProcessing = html.replace(
      '<html lang="en">',
      '<html lang="en" data-theme="light">'
    );

    try {
      let final = await critters.process(htmlForProcessing);

      // Remove critters container marker attribute
      final = final.replace(/ data-critters-container/g, '');

      // Restore original <html> tag (remove temporary data-theme)
      final = final.replace(/ data-theme="light"/g, '');

      // Fix noscript fallback: critters copies media/onload attributes
      // into the noscript link, making it print-only for non-JS users
      final = final.replace(
        /<noscript><link rel="stylesheet" href="([^"]*)"[^>]*><\/noscript>/g,
        '<noscript><link rel="stylesheet" href="$1"></noscript>'
      );

      // Inject [data-theme="light"] variable overrides if critters omitted
      // them. CSS custom properties alone don't trigger critical CSS
      // extraction since they don't directly affect element rendering.
      if (lightThemeVars && !/\[data-theme=light\]\{--/.test(final)) {
        final = final.replace('</style>', lightThemeVars[0] + '</style>');
      }

      fs.writeFileSync(htmlFile, final, 'utf8');

      // Validate and log inline CSS size
      const styleMatch = final.match(/<style>([\s\S]*?)<\/style>/);
      if (!styleMatch) {
        console.warn(`  Warning: No <style> tag in ${path.basename(htmlFile)} — Critters may have failed`);
      } else {
        const size = Buffer.byteLength(styleMatch[1], 'utf8');
        console.log(`Inlined: ${path.basename(htmlFile)} (${(size / 1024).toFixed(1)} KB critical CSS)`);
        if (size > 14 * 1024) {
          console.warn(`  Warning: exceeds 14KB threshold`);
        }
      }
    } catch (error) {
      console.error(`Error processing ${path.basename(htmlFile)}:`, error.message);
      process.exit(1);
    }
  }

  console.log('Critical CSS inlining complete');
}

inlineCriticalCSS();
