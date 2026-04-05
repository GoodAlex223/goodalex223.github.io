const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const INDEX_PATH = path.join(ROOT, 'index.html');
const PROJECTS_PATH = path.join(ROOT, 'data', 'projects.json');

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const RESET = '\x1b[0m';

function extractUrls() {
  const urlSources = new Map(); // url -> Set of source files

  if (!fs.existsSync(INDEX_PATH)) {
    console.error('Error: index.html not found. Run from project root.');
    process.exit(1);
  }
  if (!fs.existsSync(PROJECTS_PATH)) {
    console.error('Error: data/projects.json not found. Run from project root.');
    process.exit(1);
  }

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

const TIMEOUT_MS = 10000;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;
const CONCURRENCY = 5;
const HEADERS = { 'User-Agent': 'Mozilla/5.0 (compatible; PortfolioLinkChecker/1.0)' };

// Domains that block automated requests regardless of headers
const SKIP_DOMAINS = ['www.linkedin.com'];

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function checkUrl(url) {
  // Skip domains known to block automated requests
  const hostname = new URL(url).hostname;
  if (SKIP_DOMAINS.includes(hostname)) {
    return { url, ok: true, status: 'skipped' };
  }

  // Try HEAD first
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      headers: HEADERS,
      signal: AbortSignal.timeout(TIMEOUT_MS),
      redirect: 'follow',
    });
    if (response.ok) {
      return { url, ok: true, status: response.status };
    }
    // HEAD failed — fall back to GET (many servers mishandle HEAD)
    return checkUrlWithRetry(url, 'GET');
  } catch {
    // Network error on HEAD — retry with GET
    return checkUrlWithRetry(url, 'GET');
  }
}

async function checkUrlWithRetry(url, method) {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(url, {
        method,
        headers: HEADERS,
        signal: AbortSignal.timeout(TIMEOUT_MS),
        redirect: 'follow',
      });
      if (response.ok) {
        return { url, ok: true, status: response.status };
      }
      // 4xx — no point retrying
      if (response.status >= 400 && response.status < 500) {
        return { url, ok: false, status: response.status };
      }
      // 5xx — retry after delay
      if (attempt < MAX_RETRIES) {
        await delay(RETRY_DELAY_MS);
      }
    } catch {
      // Network error — retry after delay
      if (attempt < MAX_RETRIES) {
        await delay(RETRY_DELAY_MS);
      }
    }
  }
  return { url, ok: false, status: 'network error' };
}

async function checkBatch(urls, checkFn) {
  const results = [];
  for (let i = 0; i < urls.length; i += CONCURRENCY) {
    const batch = urls.slice(i, i + CONCURRENCY);
    const batchResults = await Promise.all(batch.map(checkFn));
    results.push(...batchResults);
  }
  return results;
}

async function main() {
  const urlSources = extractUrls();
  const urls = [...urlSources.keys()];

  console.log(`Checking ${urls.length} links...\n`);

  const results = await checkBatch(urls, checkUrl);

  let passed = 0;
  let failed = 0;

  for (const result of results) {
    const sources = [...urlSources.get(result.url)].join(', ');
    if (result.ok) {
      console.log(`  ${GREEN}✓${RESET} ${result.url} (${result.status})`);
      passed++;
    } else {
      console.log(`  ${RED}✗${RESET} ${result.url} (${result.status}) [${sources}]`);
      failed++;
    }
  }

  console.log(`\nResults: ${passed} passed, ${failed} failed`);

  if (failed > 0) {
    process.exit(1);
  }
}

main();
