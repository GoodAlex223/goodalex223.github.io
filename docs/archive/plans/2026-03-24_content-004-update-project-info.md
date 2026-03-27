# CONTENT-004: Update Project Information — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Audit all 8 portfolio projects against their GitHub repos and update card descriptions, tech stacks, dates, and modal data to reflect current reality.

**Architecture:** Three-phase approach — (1) GitHub API audit to gather ground truth, (2) apply updates to `index.html` and `data/projects.json` based on audit findings and user decisions, (3) verify with build/test/lighthouse. Phase 1 produces a report; user reviews before Phase 2 begins.

**Tech Stack:** GitHub MCP (repo data), WebFetch (link liveness), Playwright (tests), Lighthouse CI

**Spec:** `docs/archive/specs/2026-03-24_content-004-update-project-info-design.md`
**Quality Standards:** `docs/PORTFOLIO_REQUIREMENTS.md`

---

## File Map

| File | Action | Purpose |
|------|--------|---------|
| `index.html` | Modify | Update card descriptions, tech lists, dates, statuses |
| `data/projects.json` | Modify | Update descriptions, highlights, tech arrays, dates |
| `tests/modal/basic-modal.spec.js` | Modify | Update `techPillsCount` assertions if tech arrays change; add cleanspark content test |

---

## Phase 1: Audit (Research Only)

### Task 1: Audit GitHub Repos — Dates and Content

Use GitHub MCP `list_commits` and `get_file_contents` to check each repo. For each of the 8 repos, gather:
- Last meaningful commit date (exclude: dependency bumps, CI-only, metadata edits)
- README content (for description/highlight improvements)
- Key config files for tech stack verification

**Repos:**

| Project ID | Repository | Config Files to Check |
|---|---|---|
| rating-bot | GoodAlex223/rating_bot_showcase | `requirements.txt`, `pyproject.toml`, `Dockerfile` |
| rule-indicators | GoodAlex223/rule_indicators | `platformio.ini`, `*.ino` |
| lubrication | GoodAlex223/automatic_machine_lubrication | `platformio.ini`, `*.ino` |
| hx711-scale | GoodAlex223/8-HX711-to-NANO | `platformio.ini`, `*.ino` |
| dropshipping | GoodAlex223/dropshipping-test | `package.json`, `tsconfig.json` |
| media-viewer | GoodAlex223/media-viewer | `package.json` |
| svg-processor | GoodAlex223/svg_layer_processor | `requirements.txt`, `pyproject.toml` |
| cleanspark | GoodAlex223/cleaning-test | `package.json`, `tsconfig.json` |

**Note:** CleanSpark was added to portfolio on 2026-03-24 (CONTENT-003). Its data is fresh — quick verification only.

- [ ] **Step 1: Fetch commit history for all 8 repos**

Use GitHub MCP `list_commits` for each repo (can be parallelized — up to 4 concurrent agents). For each repo, get the 10 most recent commits and identify the last meaningful commit (not a dep bump, CI change, or metadata edit).

Record: `{repo, lastMeaningfulCommitDate, commitMessage, currentPortfolioDate, dateMatchesPortfolio}`

- [ ] **Step 2: Read README for each repo**

Use GitHub MCP `get_file_contents` to read `README.md` from each repo. Extract:
- Project description and capabilities
- Features/highlights not captured in current portfolio
- Tech stack mentions

- [ ] **Step 3: Read config files for tech stack verification**

For each repo, read the relevant config files (see table above) via GitHub MCP. Extract actual dependencies and technologies used. Compare against current `projects.json` tech arrays.

- [ ] **Step 4: Record findings per project**

For each project, compile:
- Date: current vs actual (YYYY-MM format)
- Tech: items in repo but missing from JSON and/or card
- Description: opportunities to improve card text based on README
- Highlights: new highlights discovered from README

### Task 2: Check Link Liveness

Verify all external URLs return HTTP 200.

- [ ] **Step 1: Fetch all external project URLs**

Read current URLs from `index.html` and `data/projects.json`. The complete list:

**GitHub repos (8):**
- https://github.com/GoodAlex223/rating_bot_showcase
- https://github.com/GoodAlex223/rule_indicators
- https://github.com/GoodAlex223/automatic_machine_lubrication
- https://github.com/GoodAlex223/8-HX711-to-NANO
- https://github.com/GoodAlex223/dropshipping-test
- https://github.com/GoodAlex223/media-viewer
- https://github.com/GoodAlex223/svg_layer_processor
- https://github.com/GoodAlex223/cleaning-test

**Wokwi simulations (3):**
- https://wokwi.com/projects/385460530654015489 (rule-indicators)
- https://wokwi.com/projects/425883091765424129 (lubrication)
- https://wokwi.com/projects/412452836213719041 (hx711-scale)

**Vercel demos (2):**
- https://dropshipping-test.vercel.app (dropshipping)
- https://cleanspark-virid.vercel.app (cleanspark)

- [ ] **Step 2: HTTP fetch each URL**

Use WebFetch for each URL. Record status code and any redirects. Flag any non-200 responses.

### Task 3: Assess Project Statuses

- [ ] **Step 1: Compare active statuses against repo activity**

Current "active" projects (3): rating-bot, dropshipping, media-viewer.
Current "no status" projects (5): rule-indicators, lubrication, hx711-scale, svg-processor, cleanspark.

For each "active" project, check:
- When was the last commit? (from Task 1 data)
- Does the repo appear maintained or dormant?

For each "no status" project, check:
- Is there recent activity that suggests it should be marked active?

Record findings for user decision.

### Task 4: Compile and Present Audit Report

- [ ] **Step 1: Build structured audit report**

Compile all findings from Tasks 1-3 into a single report. Format:

```markdown
## Audit Report

### Date Corrections
| Project | Current | Suggested | Source Commit |
|---------|---------|-----------|---------------|

### Dead/Redirected Links (USER DECISION NEEDED)
| URL | Status | Project |
|-----|--------|---------|

### Tech Stack Updates
| Project | Current Card Tech | Add to Card | Add to JSON |
|---------|------------------|-------------|-------------|

### Description Improvements
| Project | Current Card Description | Suggested Rewrite | Why |
|---------|------------------------|-------------------|-----|

### Status Mismatches (USER DECISION NEEDED)
| Project | Current Status | Last Commit | Recommendation |
|---------|---------------|-------------|----------------|

### PORTFOLIO_REQUIREMENTS.md Gaps
| Project | Tier | Gap | Notes |
|---------|------|-----|-------|

Verify tier assignments per PORTFOLIO_REQUIREMENTS.md:
- Tier 1 (Production): rating-bot, dropshipping
- Tier 2 (Hardware): rule-indicators, lubrication, hx711-scale
- Tier 3 (Utilities): media-viewer, svg-processor, cleanspark

Confirm each project meets its tier's requirements. Confirm cleanspark has speed build labeling ("Full MVP delivered in one week").
```

- [ ] **Step 2: Present report to user and wait for decisions**

Present the compiled report. User must decide on:
1. Dead links: remove, replace, or keep
2. Status changes: update or leave as-is
3. Approve suggested description rewrites
4. Approve tech stack additions

**CHECKPOINT: Do NOT proceed to Phase 2 until user has reviewed and approved.**

---

## Phase 2: Apply Updates

**Note:** Skip projects where the audit found no changes needed (e.g., cleanspark if its fresh data from CONTENT-003 is accurate). Only modify files that actually change.

### Task 5: Update `index.html` Project Cards

Apply user-approved changes to each project card in `index.html`.

**Files:**
- Modify: `index.html` (project cards section, roughly lines 350-650)

**Current known tech stack gaps (card missing vs JSON):**

| Project | Missing from Card |
|---------|------------------|
| rating-bot | Prometheus, Grafana |
| rule-indicators | 7-Segment Display |
| lubrication | EEPROM |
| hx711-scale | EEPROM |
| dropshipping | Next.js, PostgreSQL, Stripe (note: card has `Vercel` which is missing from JSON — add to JSON in Task 6) |
| media-viewer | Node.js |
| svg-processor | PyPDF2 |
| cleanspark | Playwright, Vitest, Vercel |

- [ ] **Step 1: Update rating-bot card**

Update in `index.html`:
1. `data-updated` attribute → new date from audit (if changed)
2. `<time datetime="">` attribute → match `data-updated`
3. `<time>` display text → match (e.g., "Updated Mar 2026")
4. `<p class="project-card__description">` → rewrite based on audit findings
5. `<ul class="project-card__tech">` → add Prometheus, Grafana (plus any audit discoveries)

- [ ] **Step 2: Update rule-indicators card**

Same pattern: dates, description, tech list (add 7-Segment Display + audit discoveries).

- [ ] **Step 3: Update lubrication card**

Same pattern: dates, description, tech list (add EEPROM + audit discoveries).

- [ ] **Step 4: Update hx711-scale card**

Same pattern: dates, description, tech list (add EEPROM + audit discoveries).

- [ ] **Step 5: Update dropshipping card**

Same pattern: dates, description, tech list (add Next.js, PostgreSQL, Stripe + audit discoveries).

- [ ] **Step 6: Update media-viewer card**

Same pattern: dates, description, tech list (add Node.js + audit discoveries).

- [ ] **Step 7: Update svg-processor card**

Same pattern: dates, description, tech list (add PyPDF2 + audit discoveries).

- [ ] **Step 8: Update cleanspark card**

Same pattern: dates, description, tech list (add Playwright, Vitest, Vercel + audit discoveries). Quick pass only — data is fresh from CONTENT-003.

- [ ] **Step 9: Commit index.html changes**

```bash
git add index.html
git commit -m "content: Update project card descriptions, tech stacks, and dates

- Rewrite card descriptions to highlight strongest aspects
- Sync tech stacks with projects.json (add missing technologies)
- Update data-updated dates from GitHub commit history
- [Status changes if any]

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

### Task 6: Update `data/projects.json`

Apply user-approved changes to project detail data.

**Files:**
- Modify: `data/projects.json`

- [ ] **Step 1: Update dates in projects.json**

For each project where the date changed, update the `"updated"` field to match the new `data-updated` value.

- [ ] **Step 2: Update tech arrays in projects.json**

For each project where the audit discovered new technologies not in the JSON, add them to the `"tech"` array. Also add any items that were on the card but missing from JSON.

- [ ] **Step 3: Update descriptions and highlights in projects.json**

If the audit found richer content from repo READMEs, update `"description"` and `"highlights"` arrays.

- [ ] **Step 4: Update statuses in projects.json**

If user approved status changes, update `"status"` fields (e.g., `"In Development"` → `null` or vice versa).

- [ ] **Step 5: Handle dead links in projects.json**

If user decided to remove or replace dead links, update `"links"` objects accordingly.

- [ ] **Step 6: Commit projects.json changes**

```bash
git add data/projects.json
git commit -m "content: Update project detail data (descriptions, tech, dates)

- Update tech arrays with technologies discovered from repo audit
- Refresh descriptions and highlights from README content
- Sync dates with GitHub commit history
- [Link/status changes if any]

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

### Task 7: Update Test Assertions

**Files:**
- Modify: `tests/modal/basic-modal.spec.js`

- [ ] **Step 1: Calculate new techPillsCount for each project**

After updating `data/projects.json`, count the `tech` array length for each project. Compare against current test assertions:

| Project | Current Test Count | Current JSON Tech Array (pre-audit) |
|---------|-------------------|--------------------------------------|
| rating-bot | 6 | `["Python", "PostgreSQL", "Redis", "Docker", "Prometheus", "Grafana"]` |
| rule-indicators | 5 | `["C++", "Arduino", "RTC", "DS18B20", "7-Segment Display"]` |
| lubrication | 4 | `["C++", "Arduino", "EEPROM", "Sensors"]` |
| hx711-scale | 5 | `["C++", "HX711", "Arduino", "EEPROM", "Serial"]` |
| dropshipping | 6 | `["TypeScript", "Next.js", "React", "PostgreSQL", "Stripe", "Docker"]` |
| media-viewer | 4 | `["Electron", "JavaScript", "ML", "Node.js"]` |
| svg-processor | 4 | `["Python", "CairoSVG", "ReportLab", "PyPDF2"]` |

**Note:** These are pre-audit values. The audit may discover additional technologies — update counts accordingly after Phase 2 changes are applied.

If any tech arrays gained new items (from audit discoveries beyond the known gaps), update the count.

- [ ] **Step 2: Add cleanspark content test**

CleanSpark is in `PROJECTS_WITH_DETAILS` but has no content assertion test. Add one:

```javascript
test("displays correct content for cleanspark", async () => {
  await mp.clickCard("cleanspark");
  await mp.expectTitle("CleanSpark");
  await mp.expectCategory("Web");
  await mp.expectDescriptionCount(3);
  await mp.expectHighlightsCount(6);
  await mp.expectTechPillsCount(N); // N = final tech array length
  await mp.expectScreenshotsCount(5);
  await mp.expectLinksCount(2); // GitHub + Demo
});
```

- [ ] **Step 3: Update any changed techPillsCount values**

If any project's tech array length changed (beyond what was already in JSON), update the corresponding `expectTechPillsCount(N)` assertion.

- [ ] **Step 4: Run tests to verify assertions are correct**

```bash
npm test -- --grep "Basic Modal"
```

Expected: All tests PASS (including new cleanspark test).

- [ ] **Step 5: Commit test updates**

```bash
git add tests/modal/basic-modal.spec.js
git commit -m "test: Update modal content assertions for CONTENT-004

- Add cleanspark content test (was missing)
- Update techPillsCount for projects with expanded tech arrays

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Phase 3: Verification

### Task 8: Build and Full Test Suite

- [ ] **Step 1: Run full build**

```bash
npm run build
```

Expected: Build succeeds. Check size report output — no budget warnings.

- [ ] **Step 2: Run full test suite**

```bash
npm test
```

Expected: All suites pass (filter, modal, form, seo).

Key suites to watch:
- `filter/` — project counts in filter buttons (unchanged, but verify)
- `modal/basic-modal.spec.js` — content assertions for all 8 projects
- `modal/axe-scan.spec.js` — WCAG scans for all 8 modals
- `seo/meta-tags.spec.js` — meta tags unchanged

- [ ] **Step 3: Run Lighthouse CI**

```bash
npm run lighthouse
```

Expected: All 4 categories >= 90.

### Task 9: Cross-Reference Verification

- [ ] **Step 1: Verify date consistency across all 4 locations**

For each project, confirm these all match:
1. `index.html` `data-updated="YYYY-MM"`
2. `index.html` `<time datetime="YYYY-MM">`
3. `index.html` display text (e.g., "Updated Jan 2026")
4. `data/projects.json` `"updated"` field

- [ ] **Step 2: Verify tech stack consistency**

For each project, confirm card tech items are a subset of (or equal to) JSON tech array.

- [ ] **Step 3: Verify all data-project IDs match projects.json keys**

Check that every `data-project` value in `index.html` has a matching key in `projects.json`.

- [ ] **Step 4: Visual spot-check**

Start the local server (`npx serve` or `python -m http.server 8000`) and visually review:
- Each project card renders correctly (description, tech pills, dates, status badges)
- Each project modal opens and displays correct content
- No layout issues from expanded tech lists

This can be done via the Playwright MCP browser for systematic screenshots, or manually.

### Task 10: Final Commit and Summary

- [ ] **Step 1: Verify all changes are committed**

```bash
git status
git log --oneline -5
```

Expected: Clean working directory. 3 commits on branch (index.html, projects.json, tests).

- [ ] **Step 2: Present completion summary to user**

Summarize what changed:
- How many dates corrected
- How many tech items added (per project)
- Description rewrites applied
- Dead links handled
- Status changes applied
- Test assertions updated
- Build/test/lighthouse results
