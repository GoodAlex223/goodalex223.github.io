# Automated Link Checking in CI

**Date**: 2026-04-05
**Task**: CHALLENGE — Weekly Challenge (WEEKLY.md Friday)
**Branch**: `challenge/automated-link-checking`
**Approach**: Custom Node.js script (zero dependencies)

---

## Overview

A `scripts/check-links.js` script that extracts all external URLs from `index.html` and `data/projects.json`, verifies each returns HTTP 200-399, and fails CI on broken links. Runs as a parallel CI job alongside test and lighthouse, with an `npm run check-links` script for local use.

**Why**: After CONTENT-002/003/004 added and updated many project links across 8 cards, there's no automated guard against link rot. This adds lasting CI value and directly protects recent content work.

---

## URL Extraction

The script reads two source files and extracts all external (`https://`) URLs:

1. **`index.html`** — regex match all `href="https://..."` attributes. Captures project card links, social links (GitHub profile, LinkedIn, Telegram, Wokwi profile).
2. **`data/projects.json`** — parse JSON, walk all `links` objects (`github`, `demo`) and extract URL values.

URLs are deduplicated (some appear in both sources). Each URL is tagged with its source file(s) for clear error reporting. Expected: ~20 unique URLs.

---

## Link Checking Logic

For each unique URL:

1. **HEAD request first** — lightweight check that the URL responds. Timeout: 10 seconds.
2. **Fallback to GET** — some servers (Wokwi, Vercel) reject HEAD or return 405/403. If HEAD returns 405 or 403, re-request with GET. This is a method fallback, not a retry — it doesn't count toward the retry limit.
3. **Retry logic** — up to 3 attempts per URL (after method fallback if applicable), with 2-second delay between retries. Retries apply to network errors and 5xx responses only. 4xx responses (like 404) fail immediately — no point retrying.
4. **Concurrency** — check 5 URLs in parallel via `Promise` batching. Fast enough for ~20 URLs without hammering any single host.
5. **Success criteria** — HTTP 200-399 is a pass. 400+ is a fail. Network errors are a fail.

---

## Output & Exit Codes

Console output with ANSI colors (matching `report-sizes.js` style):

```
Checking 20 links...

  ✓ https://github.com/GoodAlex223/rating_bot_showcase (200)
  ✓ https://wokwi.com/projects/385460530654015489 (200)
  ✗ https://dropshipping-test.vercel.app (404) [index.html, projects.json]
  ...

Results: 19 passed, 1 failed
```

Exit codes:
- `0` — all links OK
- `1` — one or more broken links (CI fails)

No JSON output file — just console. Matches how `lint:css` and `lint:js` work.

---

## CI Integration

### npm script

```json
"check-links": "node scripts/check-links.js"
```

### deploy.yml

New `check-links` job that needs only `lint` (not `build`), running parallel with `build`:

```
lint → build ──→ test ──────────→ deploy
  ├──→ check-links ─────────────→ ↗
  └──→ (build) ──→ lighthouse ──→ ↗
```

The job is minimal — just checkout + Node setup + `npm run check-links`. No `npm ci` needed since the script uses only Node built-ins (`fetch`, `fs`, `path`). Deploy job updates to need: `[build, test, lighthouse, check-links]`.

### Job definition

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

---

## Testing Strategy

No Playwright E2E tests — this is a build script, matching the pattern of other `scripts/` files.

Validation:
1. Run `npm run check-links` locally to verify all ~20 URLs pass
2. Verify CI job passes in the PR pipeline
3. Manually test failure mode: temporarily add a known-bad URL, confirm non-zero exit and clear output, then revert

ESLint: Script lives in `scripts/`, already covered by the Node CJS environment — no config changes needed.

---

## Files Changed

| File | Change |
|------|--------|
| `scripts/check-links.js` | New — link checker script (~80-120 lines) |
| `package.json` | Add `check-links` npm script |
| `.github/workflows/deploy.yml` | Add `check-links` job parallel with `build`, add to deploy `needs` |

---

## Decisions

- **Zero dependencies**: Uses Node 20 built-in `fetch()` instead of adding `linkinator` or similar packages
- **HEAD-then-GET fallback**: Handles servers that reject HEAD requests without wasting bandwidth on full GET for well-behaved servers
- **Parallel with build, not after**: The script doesn't need build artifacts — just source files — so it starts earlier in the pipeline
- **Hard fail after retry**: Broken links block deploy. Transient failures handled by 3 retries with 2s delay. Truly broken links stop shipping.
- **All external URLs**: Includes social/profile links, not just project links. Small incremental cost for broader coverage.
