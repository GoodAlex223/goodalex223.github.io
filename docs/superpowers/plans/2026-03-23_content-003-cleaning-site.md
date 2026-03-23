# CONTENT-003: Add CleanSpark to Portfolio — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the CleanSpark cleaning business website as a new portfolio project card with modal detail data, screenshots, and repo rename.

**Architecture:** Add HTML card to `index.html` (matching existing card pattern), add JSON entry to `data/projects.json`, download and convert 6 screenshots from the CleanSpark repo, rename the GitHub repo from `clening-test` to `cleaning-test`, update test constants and docs.

**Tech Stack:** HTML, JSON, GitHub API (repo rename), image conversion (PNG → webp)

**Spec:** `docs/superpowers/specs/2026-03-23_content-003-cleaning-site-design.md`

---

## Task 1: Rename GitHub Repository

**Files:**
- None (GitHub API operation)

- [ ] **Step 1: Rename repo via GitHub API**

Use the GitHub MCP `update` or REST API to rename `clening-test` → `cleaning-test`:

```
Owner: GoodAlex223
Repo: clening-test
New name: cleaning-test
```

- [ ] **Step 2: Verify rename succeeded**

Confirm the repo is accessible at `https://github.com/GoodAlex223/cleaning-test` and the old URL redirects.

- [ ] **Step 3: Commit checkpoint** — no files changed, just verify.

---

## Task 2: Download and Convert Screenshots

**Files:**
- Create: `images/projects/cleanspark.webp` (thumbnail, 640x360)
- Create: `images/projects/cleanspark-minimal.webp` (modal)
- Create: `images/projects/cleanspark-bold.webp` (modal)
- Create: `images/projects/cleanspark-trust.webp` (modal)
- Create: `images/projects/cleanspark-bubbly.webp` (modal)
- Create: `images/projects/cleanspark-noir.webp` (modal)

**Dependency:** Task 1 (repo rename) must be verified complete before downloading, since URLs reference the renamed repo. GitHub creates a redirect from the old name as a fallback.

Source images are in the CleanSpark repo at `public/images/screenshots/`:
- `minimal-home.png`
- `bold-home.png`
- `trust-home.png`
- `bubbly-home.png`
- `noir-home.png`

- [ ] **Step 1: Download all 5 PNGs from the CleanSpark repo**

Download raw files from GitHub:
```bash
cd c:/Users/alexm/Projects/HTML/goodalex223/images/projects
curl -L -O "https://raw.githubusercontent.com/GoodAlex223/cleaning-test/main/public/images/screenshots/minimal-home.png"
curl -L -O "https://raw.githubusercontent.com/GoodAlex223/cleaning-test/main/public/images/screenshots/bold-home.png"
curl -L -O "https://raw.githubusercontent.com/GoodAlex223/cleaning-test/main/public/images/screenshots/trust-home.png"
curl -L -O "https://raw.githubusercontent.com/GoodAlex223/cleaning-test/main/public/images/screenshots/bubbly-home.png"
curl -L -O "https://raw.githubusercontent.com/GoodAlex223/cleaning-test/main/public/images/screenshots/noir-home.png"
```

- [ ] **Step 2: Convert PNGs to webp for modal screenshots**

Use a tool available on the system (e.g., `cwebp`, `magick`, or `sharp` via Node) to convert:
```bash
# Example with cwebp (if available), or use sharp/imagemagick:
cwebp minimal-home.png -o cleanspark-minimal.webp -q 80
cwebp bold-home.png -o cleanspark-bold.webp -q 80
cwebp trust-home.png -o cleanspark-trust.webp -q 80
cwebp bubbly-home.png -o cleanspark-bubbly.webp -q 80
cwebp noir-home.png -o cleanspark-noir.webp -q 80
```

If `cwebp` is not available, use a Node.js one-liner with `sharp`:
```bash
npx sharp-cli --input bold-home.png --output cleanspark-bold.webp --format webp --quality 80
```

Or write a quick Node script using `sharp` (already a transitive dep via Critters/Playwright).

- [ ] **Step 3: Create thumbnail (640x360) from Bold Spark screenshot**

Resize `bold-home.png` to 640x360 and convert to webp:
```bash
# Example with sharp or imagemagick:
magick bold-home.png -resize 640x360^ -gravity center -extent 640x360 cleanspark.webp
```

Or use a Node script with sharp:
```js
const sharp = require('sharp');
sharp('bold-home.png').resize(640, 360, { fit: 'cover' }).webp({ quality: 80 }).toFile('cleanspark.webp');
```

- [ ] **Step 4: Clean up source PNGs**

```bash
rm minimal-home.png bold-home.png trust-home.png bubbly-home.png noir-home.png
```

- [ ] **Step 5: Verify all 6 webp files exist**

```bash
ls -la c:/Users/alexm/Projects/HTML/goodalex223/images/projects/cleanspark*.webp
```

Expected: 6 files (cleanspark.webp + 5 theme variants).

- [ ] **Step 6: Commit**

```bash
git add images/projects/cleanspark*.webp
git commit -m "feat: Add CleanSpark project screenshots

Thumbnail (Bold Spark, 640x360) + 5 modal screenshots (one per theme).
Converted from PNG source in CleanSpark repo."
```

---

## Task 3: Add Project Card to `index.html`

**Files:**
- Modify: `index.html:488` (after svg-processor card closing `</article>`, before `</div>` grid close)

- [ ] **Step 1: Add CleanSpark card HTML**

Insert after line 488 (`</article>` closing svg-processor) and before line 490 (`</div>` closing projects grid):

```html
            <!-- cleanspark -->
            <article class="project-card" data-category="web" data-project="cleanspark" data-updated="2026-03" data-animate data-animate-delay="450">
              <div class="project-card__thumbnail">
                <img src="images/projects/cleanspark.webp" alt="CleanSpark Bold Spark theme with vibrant geometric design" loading="lazy" width="640" height="360">
              </div>
              <div class="project-card__header">
                <span class="project-card__category">Web</span>
                <div class="project-card__links">
                  <a href="https://github.com/GoodAlex223/cleaning-test" class="project-card__link" target="_blank" rel="noopener noreferrer" aria-label="View source on GitHub">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                    </svg>
                  </a>
                  <a href="https://cleanspark-virid.vercel.app" class="project-card__link" target="_blank" rel="noopener noreferrer" aria-label="View live demo">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                      <polyline points="15 3 21 3 21 9"/>
                      <line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                  </a>
                </div>
              </div>
              <h3 class="project-card__title">CleanSpark</h3>
              <p class="project-card__description">
                Multi-theme cleaning business website with 5 complete design
                systems. Full MVP delivered in one week.
              </p>
              <ul class="project-card__tech">
                <li>Astro</li>
                <li>TypeScript</li>
                <li>Tailwind CSS</li>
              </ul>
              <footer class="project-card__footer">
                <time class="project-card__updated" datetime="2026-03">Updated Mar 2026</time>
                <button class="project-card__details-btn" aria-haspopup="dialog">
                  View Details
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </button>
              </footer>
            </article>
```

- [ ] **Step 2: Verify card renders locally**

```bash
npm run build
```

Open in browser, confirm card appears in project grid with correct thumbnail, category badge, links, and footer.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: Add CleanSpark project card to portfolio

Web category, Tier 3 speed build. Includes thumbnail, GitHub + demo
links, and View Details button for modal."
```

---

## Task 4: Add Modal Data to `projects.json`

**Files:**
- Modify: `data/projects.json` (add `"cleanspark"` key at end of object)

- [ ] **Step 1: Add CleanSpark entry to projects.json**

Add a trailing comma after the `svg-processor` entry's closing `}` (line 200), then insert the new entry before the final closing `}` of the JSON object:

```json
  "cleanspark": {
    "title": "CleanSpark",
    "category": "Web",
    "description": [
      "A multi-theme cleaning business website built with Astro 5, TypeScript, and Tailwind CSS 4. Features 5 radically different design themes \u2014 not CSS variable swaps, but complete layout systems with unique component structures, animations, typography, and UX patterns. Full MVP delivered in one week.",
      "Each theme is a self-contained design system: Minimal Zen (warm neutrals, Apple-like simplicity), Bold Spark (vibrant geometric energy), Trust Shield (corporate professionalism), Bubbly Clean (playful pastels), and Noir Luxe (dark luxury elegance). Themes switch in real time with cookie-based persistence and server-side rendering.",
      "Built with Astro\u2019s islands architecture \u2014 static HTML by default, JavaScript only for interactive components. Includes 962 automated tests (78 unit + 218 E2E across 4 browsers), WCAG 2.1 AA accessibility compliance verified with axe-core across all 30 theme/page combinations."
    ],
    "highlights": [
      "5 complete design themes with unique layouts, animations, and typography",
      "Real-time theme switching with SSR and cookie persistence",
      "962 automated tests across 4 browsers (Vitest + Playwright)",
      "WCAG 2.1 AA accessibility verified across all 30 theme/page combinations",
      "Islands architecture \u2014 static HTML by default, JS only where needed",
      "Full MVP delivered in one week"
    ],
    "tech": ["Astro", "TypeScript", "Tailwind CSS", "Playwright", "Vitest", "Vercel"],
    "links": {
      "github": "https://github.com/GoodAlex223/cleaning-test",
      "demo": "https://cleanspark-virid.vercel.app"
    },
    "screenshots": [
      {
        "src": "images/projects/cleanspark-minimal.webp",
        "alt": "Minimal Zen theme \u2014 warm neutrals with generous whitespace"
      },
      {
        "src": "images/projects/cleanspark-bold.webp",
        "alt": "Bold Spark theme \u2014 vibrant orange with geometric CSS art"
      },
      {
        "src": "images/projects/cleanspark-trust.webp",
        "alt": "Trust Shield theme \u2014 corporate navy with serif typography"
      },
      {
        "src": "images/projects/cleanspark-bubbly.webp",
        "alt": "Bubbly Clean theme \u2014 pastel purple with floating bubble decorations"
      },
      {
        "src": "images/projects/cleanspark-noir.webp",
        "alt": "Noir Luxe theme \u2014 black and gold luxury aesthetic"
      }
    ],
    "status": null,
    "updated": "Mar 2026"
  }
```

- [ ] **Step 2: Validate JSON**

```bash
node -e "JSON.parse(require('fs').readFileSync('data/projects.json','utf8')); console.log('Valid JSON')"
```

Expected: `Valid JSON`

- [ ] **Step 3: Verify modal opens locally**

Open site in browser, click CleanSpark card → modal should open with title, description, highlights, tech pills, 5 screenshots, and links.

- [ ] **Step 4: Commit**

```bash
git add data/projects.json
git commit -m "feat: Add CleanSpark modal detail data

Description, highlights, tech pills, 5 theme screenshots, GitHub and
demo links. Status: completed, Tier 3 speed build."
```

---

## Task 5: Update Test Constants

**Files:**
- Modify: `tests/pages/FilterPage.js:9-15` (CATEGORY_COUNTS)
- Modify: `tests/pages/ModalPage.js:8-16` (PROJECTS_WITH_DETAILS)

- [ ] **Step 1: Update FilterPage.js CATEGORY_COUNTS**

In `tests/pages/FilterPage.js`, change:

```js
export const CATEGORY_COUNTS = {
  all: 7,
  backend: 1,
  iot: 3,
  web: 1,
  tools: 2,
};
```

To:

```js
export const CATEGORY_COUNTS = {
  all: 8,
  backend: 1,
  iot: 3,
  web: 2,
  tools: 2,
};
```

- [ ] **Step 2: Update ModalPage.js PROJECTS_WITH_DETAILS**

In `tests/pages/ModalPage.js`, change:

```js
export const PROJECTS_WITH_DETAILS = [
  "rating-bot",
  "rule-indicators",
  "media-viewer",
  "lubrication",
  "hx711-scale",
  "dropshipping",
  "svg-processor",
];
```

To:

```js
export const PROJECTS_WITH_DETAILS = [
  "rating-bot",
  "rule-indicators",
  "media-viewer",
  "lubrication",
  "hx711-scale",
  "dropshipping",
  "svg-processor",
  "cleanspark",
];
```

- [ ] **Step 3: Run the full test suite**

```bash
npm test
```

Expected: All tests pass. Filter tests see 8 total cards (web: 2). Modal tests iterate over 8 projects including cleanspark.

- [ ] **Step 4: Commit**

```bash
git add tests/pages/FilterPage.js tests/pages/ModalPage.js
git commit -m "test: Update test constants for CleanSpark project

FilterPage: all 7→8, web 1→2
ModalPage: add cleanspark to PROJECTS_WITH_DETAILS"
```

---

## Task 6: Update Documentation

**Files:**
- Modify: `docs/PORTFOLIO_REQUIREMENTS.md:110-118` (audit table)

- [ ] **Step 1: Add CleanSpark to audit summary table**

In `docs/PORTFOLIO_REQUIREMENTS.md`, add a new row to the audit table after `svg-processor`:

```markdown
| cleanspark | 3 | Vercel live demo | 5 | Speed build; verify README meets Tier 3 bar |
```

The full table becomes:

```markdown
| Project | Tier | Demo | Screenshots | Known Gaps |
|---------|------|------|-------------|------------|
| rating_bot | 1 | Showcase repo (no live URL) | 2 | Verify README quality; no traditional demo — CONTENT-004 must resolve via alternative (video/screenshots/showcase docs) |
| dropshipping | 1 | Vercel link exists | 0 | Need screenshots; verify demo works; verify README |
| rule-indicators | 2 | Wokwi simulation | 2 | Verify README has hardware context |
| lubrication | 2 | Wokwi simulation | 0 | Need screenshots; verify README |
| hx711-scale | 2 | Wokwi simulation | 0 | Need screenshots; verify README |
| media-viewer | 3 | GitHub only | 2 | Acceptable for Tier 3 |
| svg-processor | 3 | GitHub only | 0 | Optional for CLI; verify README |
| cleanspark | 3 | Vercel live demo | 5 | Speed build; verify README meets Tier 3 bar |
```

- [ ] **Step 2: Update snapshot date**

Change `Snapshot as of 2026-03-22` to `Snapshot as of 2026-03-23`.

- [ ] **Step 3: Update CLAUDE.md**

In `CLAUDE.md`, find the `ModalPage.js` description under "Testing Pattern" that references `PROJECTS_WITH_DETAILS` with "all 7 project IDs". Update to "all 8 project IDs" and add `"cleanspark"` to the inline list.

- [ ] **Step 4: Commit**

```bash
git add docs/PORTFOLIO_REQUIREMENTS.md CLAUDE.md
git commit -m "docs: Add CleanSpark to portfolio audit table and update CLAUDE.md

Tier 3 speed build with Vercel demo and 5 screenshots.
Update PROJECTS_WITH_DETAILS count from 7 to 8 in CLAUDE.md."
```

---

## Task 7: Build, Test, and Verify

- [ ] **Step 1: Run full build**

```bash
npm run build
```

Expected: Build succeeds, no size budget warnings.

- [ ] **Step 2: Run full test suite**

```bash
npm test
```

Expected: All tests pass (filter counts, modal for all 8 projects, axe scans).

- [ ] **Step 3: Run Lighthouse**

```bash
npm run lighthouse
```

Expected: All 4 categories ≥ 90/100.

- [ ] **Step 4: Manual verification**

Open local server and verify:
1. CleanSpark card appears in grid with thumbnail
2. "Web" filter shows 2 cards (dropshipping + cleanspark)
3. Clicking card opens modal with all content
4. All 5 theme screenshots render in modal
5. GitHub link goes to `cleaning-test` repo
6. Demo link goes to `cleanspark-virid.vercel.app`
7. Filter count shows correct number
