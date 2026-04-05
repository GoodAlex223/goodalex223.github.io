const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const INDEX_PATH = path.join(ROOT, 'index.html');
const PROJECTS_PATH = path.join(ROOT, 'data', 'projects.json');

// ANSI colors (used in Task 2 for pass/fail output)
// eslint-disable-next-line no-unused-vars
const GREEN = '\x1b[32m';
// eslint-disable-next-line no-unused-vars
const RED = '\x1b[31m';
// eslint-disable-next-line no-unused-vars
const RESET = '\x1b[0m';

function extractUrls() {
  const urlSources = new Map(); // url -> Set of source files

  // Extract from index.html
  const html = fs.readFileSync(INDEX_PATH, 'utf8');
  const hrefPattern = /href="(https?:\/\/[^"]+)"/g;
  let match;
  while ((match = hrefPattern.exec(html)) !== null) {
    const url = match[1];
    if (!urlSources.has(url)) {
      urlSources.set(url, new Set());
    }
    urlSources.get(url).add('index.html');
  }

  // Extract from projects.json
  const projects = JSON.parse(fs.readFileSync(PROJECTS_PATH, 'utf8'));
  for (const project of Object.values(projects)) {
    if (project.links) {
      for (const url of Object.values(project.links)) {
        if (typeof url === 'string' && url.startsWith('http')) {
          if (!urlSources.has(url)) {
            urlSources.set(url, new Set());
          }
          urlSources.get(url).add('projects.json');
        }
      }
    }
  }

  return urlSources;
}

// Placeholder for Task 2
async function main() {
  const urlSources = extractUrls();
  console.log(`Found ${urlSources.size} unique URLs:`);
  for (const [url, sources] of urlSources) {
    console.log(`  ${url} [${[...sources].join(', ')}]`);
  }
}

main();
