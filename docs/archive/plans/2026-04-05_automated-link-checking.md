# Automated Link Checking in CI — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a zero-dependency Node.js script that checks all external URLs from `index.html` and `data/projects.json`, with retry logic, and integrate it as a parallel CI job.

**Architecture:** A single `scripts/check-links.js` script extracts external URLs from two source files, deduplicates them, checks each via HEAD (with GET fallback), retries on transient failures, and exits non-zero on any broken link. CI runs it parallel with `build` after `lint`.

**Tech Stack:** Node.js 20 built-in `fetch()`, `fs`, `path`. No new npm dependencies.

**Spec:** `docs/archive/specs/2026-04-05_automated-link-checking-design.md`

---

## File Structure

| File | Action | Responsibility |
|------|--------|---------------|
| `scripts/check-links.js` | Create | URL extraction, link checking with retry, console output |
| `package.json` | Modify | Add `check-links` npm script |
| `.github/workflows/deploy.yml` | Modify | Add `check-links` job, update deploy `needs` |

---

### Task 1: Create `scripts/check-links.js` — URL Extraction

**Files:**
- Create: `scripts/check-links.js`

- [ ] **Step 1: Create the script with URL extraction logic**

```js
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const INDEX_PATH = path.join(ROOT, 'index.html');
const PROJECTS_PATH = path.join(ROOT, 'data', 'projects.json');

// ANSI colors
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
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
```

- [ ] **Step 2: Run the script to verify URL extraction works**

Run: `node scripts/check-links.js`

Expected: Output listing ~20 unique URLs with their source files. Should include GitHub repos, Wokwi simulations, Vercel demos, LinkedIn, Telegram, and Wokwi profile links.

- [ ] **Step 3: Commit**

```bash
git add scripts/check-links.js
git commit -m "feat: Add check-links script with URL extraction from HTML and JSON"
```

---

### Task 2: Add Link Checking Logic

**Files:**
- Modify: `scripts/check-links.js`

- [ ] **Step 1: Replace the placeholder `main()` with link checking logic**

Replace everything from `// Placeholder for Task 2` to the end of the file with:

```js
const TIMEOUT_MS = 10000;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;
const CONCURRENCY = 5;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function checkUrl(url) {
  // Try HEAD first
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      signal: AbortSignal.timeout(TIMEOUT_MS),
      redirect: 'follow',
    });
    if (response.ok) {
      return { url, ok: true, status: response.status };
    }
    // HEAD returned 403 or 405 — fall back to GET (method issue, not link issue)
    if (response.status === 403 || response.status === 405) {
      return checkUrlWithRetry(url, 'GET');
    }
    // Other 4xx — link is genuinely broken
    if (response.status >= 400 && response.status < 500) {
      return { url, ok: false, status: response.status };
    }
    // 5xx — retry with GET
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
```

- [ ] **Step 2: Run the script to verify all links pass**

Run: `node scripts/check-links.js`

Expected: All ~20 URLs show green checkmarks, exit code 0. This may take 10-20 seconds due to network requests.

- [ ] **Step 3: Verify failure mode — temporarily add a bad URL**

Add a line in `index.html` inside any `<div>` (e.g., after line 200):
```html
<a href="https://github.com/GoodAlex223/does-not-exist-12345">test</a>
```

Run: `node scripts/check-links.js`

Expected: The bad URL shows a red ✗ with 404 status, script exits with code 1.

**Remove the test line from `index.html` after verifying.**

- [ ] **Step 4: Commit**

```bash
git add scripts/check-links.js
git commit -m "feat: Add link checking logic with HEAD/GET fallback and retry"
```

---

### Task 3: Add npm Script

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Add the `check-links` script to package.json**

In the `"scripts"` object, after the `"lighthouse"` line, add:

```json
"check-links": "node scripts/check-links.js",
```

- [ ] **Step 2: Verify the npm script works**

Run: `npm run check-links`

Expected: Same output as `node scripts/check-links.js` — all links pass, exit code 0.

- [ ] **Step 3: Commit**

```bash
git add package.json
git commit -m "build: Add check-links npm script"
```

---

### Task 4: Add CI Job

**Files:**
- Modify: `.github/workflows/deploy.yml`

- [ ] **Step 1: Add the `check-links` job after the `build` job definition**

Insert this new job block after the `build` job (after line 73, before the `test` job):

```yaml
  check-links:
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Check external links
        run: npm run check-links
```

- [ ] **Step 2: Update the deploy job `needs` to include `check-links`**

Change the deploy job's `needs` line from:

```yaml
    needs: [build, test, lighthouse]
```

to:

```yaml
    needs: [build, test, lighthouse, check-links]
```

- [ ] **Step 3: Verify the YAML is valid**

Run: `node -e "const yaml = require('fs').readFileSync('.github/workflows/deploy.yml', 'utf8'); console.log('YAML length:', yaml.length, 'OK')"`

Manually verify structure: `lint` → `build` + `check-links` in parallel → `test` + `lighthouse` after build → `deploy` needs all four.

- [ ] **Step 4: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: Add check-links job parallel with build in deploy pipeline"
```

---

### Task 5: Run ESLint and Final Verification

**Files:**
- May modify: `scripts/check-links.js` (if lint issues found)

- [ ] **Step 1: Run ESLint on the new script**

Run: `npx eslint scripts/check-links.js`

Expected: No errors. The script is in the `scripts/` directory, so the Node CJS ESLint environment applies.

- [ ] **Step 2: Fix any lint issues if found**

If ESLint reports issues, fix them in `scripts/check-links.js`.

- [ ] **Step 3: Run the full lint suite**

Run: `npm run lint`

Expected: All CSS and JS linting passes with no errors.

- [ ] **Step 4: Run the full test suite**

Run: `npx playwright test --ignore-snapshots`

Expected: All existing tests pass. The new script doesn't affect Playwright tests.

- [ ] **Step 5: Run the link checker one final time**

Run: `npm run check-links`

Expected: All links pass, clean output.

- [ ] **Step 6: Commit any lint fixes if needed**

```bash
git add scripts/check-links.js
git commit -m "style: Fix lint issues in check-links script"
```

(Skip this step if no lint fixes were needed.)
