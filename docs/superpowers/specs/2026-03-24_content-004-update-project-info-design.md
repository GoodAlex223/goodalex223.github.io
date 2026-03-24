# CONTENT-004: Update Project Information — Design Spec

**Date**: 2026-03-24
**Status**: Approved
**Branch**: `content/content-004-update-project-info`

## Problem

Portfolio project cards and modal data may have stale descriptions, incomplete tech stacks, inaccurate dates, and potentially dead external links. The TODO.md task calls for a full review and update of all 8 projects.

## Scope

### In Scope
- Verify `data-updated` dates against actual GitHub repo commit history
- Verify all external links are live (8 GitHub repos, 3 Wokwi sims, 2 Vercel demos)
- Update card descriptions to be more compelling (rewrite, not just fix)
- Expand card tech stacks to match `projects.json` (and update JSON if repo scan reveals more)
- Update `projects.json` descriptions/highlights if repo content is richer
- Flag dead links and status mismatches for user decision

### Out of Scope
- HTML structure or CSS changes
- Modal rendering logic (`js/main.js`)
- Screenshots in `projects.json`
- Project ordering in `index.html`
- Adding or removing projects

## Approach

GitHub API audit (Approach A) — use GitHub MCP to programmatically check each repo, then apply changes based on findings.

## Design

### Phase 1: Audit (Research Only — No File Changes)

#### 1.1 Date Check
For each of the 8 GitHub repos, use GitHub MCP `list_commits` to get the most recent commit date. Compare against current `data-updated` values in `index.html` and `projects.json`.

**Repos to check**:
| Project ID | Repository |
|---|---|
| rating-bot | GoodAlex223/rating_bot_showcase |
| rule-indicators | GoodAlex223/rule_indicators |
| lubrication | GoodAlex223/automatic_machine_lubrication |
| hx711-scale | GoodAlex223/8-HX711-to-NANO |
| dropshipping | GoodAlex223/dropshipping-test |
| media-viewer | GoodAlex223/media-viewer |
| svg-processor | GoodAlex223/svg_layer_processor |
| cleanspark | GoodAlex223/cleaning-test |

#### 1.2 Link Liveness
HTTP fetch all 13 external URLs. Record status codes and flag any non-200 responses.

**URLs to check**:
- 8 GitHub repo URLs
- 3 Wokwi simulation URLs
- 2 Vercel demo URLs

#### 1.3 Repo Content Scan
For each repo, read README and key config files (package.json, requirements.txt, platformio.ini, etc.) to verify:
- Tech stacks are accurate and complete
- Descriptions reflect actual project capabilities
- Any notable features not captured in current portfolio content

#### 1.4 Status Assessment
Compare "active/in-development" status badges against actual repo activity:
- Last commit date
- Recent activity patterns
- Whether project appears maintained or archived

#### 1.5 Audit Report
Present compiled findings to user:
- Date corrections needed (current → suggested)
- Dead/redirected links (flagged for user decision)
- Tech stack additions/corrections per project
- Status mismatches (flagged for user decision)
- Description improvement opportunities

**User reviews and decides on flagged items before proceeding.**

### Phase 2: Update (Apply Changes)

#### 2.1 Files Modified
- `index.html` — project card content (descriptions, tech lists, dates, statuses, links)
- `data/projects.json` — project detail data (descriptions, highlights, tech, dates, statuses, links)

#### 2.2 Per-Project Updates

For each of the 8 projects, update as needed:

1. **`data-updated` dates** — Sync across all 4 locations:
   - `index.html`: `data-updated` attribute on `<article>`
   - `index.html`: `<time datetime="">` attribute
   - `index.html`: `<time>` display text (e.g., "Updated Jan 2026")
   - `data/projects.json`: `updated` field

2. **Card descriptions** — Rewrite `<p class="project-card__description">` to highlight most impressive aspects. Keep 1-2 sentences, match existing card style.

3. **Card tech stacks** — Expand `<ul class="project-card__tech">` to include all key technologies from `projects.json`. If repo scan reveals tech not in JSON, add to both places.

4. **JSON content** — Update `projects.json` descriptions, highlights, and tech arrays if repo scan reveals richer content than currently captured.

5. **Links** — Handle dead links per user decision from audit report.

6. **Statuses** — Handle status changes per user decision from audit report.

#### 2.3 Constraints
- No HTML structure changes (classes, elements, layout)
- No CSS changes
- No JS logic changes
- Card descriptions stay at 1-2 sentences
- Tech stack items use existing naming conventions (e.g., "C++" not "CPP")

### Phase 3: Verification

#### 3.1 Cross-Reference Check
- Every `data-project` ID in `index.html` matches a key in `projects.json`
- Card tech items are subset of or equal to JSON tech arrays
- All 4 date locations agree per project

#### 3.2 Build
Run `npm run build` — CSS/JS pipeline must succeed.

#### 3.3 Tests
Run `npm test` — all Playwright suites must pass:
- `filter/` — project counts in filter buttons
- `modal/` — content rendering for all 8 projects
- `seo/` — meta tags unchanged

#### 3.4 Lighthouse
Run `npm run lighthouse` — all 4 categories must score >= 90.

#### 3.5 Visual Spot-Check
Open site locally and review each card and modal for content correctness.

## Success Criteria

1. All `data-updated` dates reflect actual last meaningful commit dates from GitHub
2. All external links verified live (or dead links handled per user decision)
3. Card descriptions rewritten to highlight strongest aspects of each project
4. Card tech stacks match `projects.json` (no missing key technologies)
5. `projects.json` updated where repo content is richer than current data
6. All tests pass, build succeeds, Lighthouse >= 90
7. Status mismatches resolved per user decision
