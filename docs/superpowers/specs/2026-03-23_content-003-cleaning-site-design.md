# CONTENT-003: Add CleanSpark to Portfolio

**Status**: Approved
**Date**: 2026-03-23
**Tier**: 3 (Speed Build) — but description highlights impressive scope

## Overview

Add the CleanSpark cleaning business website as a new portfolio project card with full modal detail data. The project is frozen (completed) and framed as a speed build: "Full MVP delivered in one week."

CleanSpark is a multi-theme cleaning business website built with Astro 5, TypeScript, and Tailwind CSS 4. It features 5 radically different design themes with real-time switching, 962 automated tests, and WCAG 2.1 AA accessibility compliance. Deployed on Vercel.

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Category | Web | Alongside dropshipping; SSR website with deployment |
| Tier | 3 (Speed Build) with scope callout | Built in one week, but description highlights impressive quality/scope |
| Project ID | `cleanspark` | Matches the project's actual name |
| Status | Completed (no `data-status`) | Frozen per TODO; `status: null` in JSON |
| Thumbnail | Bold Spark theme | Most visually distinctive at card size |
| Modal screenshots | All 5 themes | Core differentiator; justified having more than other projects |
| Repo rename | `clening-test` -> `cleaning-test` | Fix typo via GitHub API |

## Section 1: Card HTML

New `<article class="project-card">` in `index.html`, placed after `svg-processor` (8th card).

**Attributes**:
- `data-category="web"`
- `data-project="cleanspark"`
- `data-updated="2026-03"`
- `data-animate data-animate-delay="450"` (increments by 50 from last card)
- No `data-status="active"` (project is frozen/completed)

**Card content**:
- Title: "CleanSpark"
- Description: "Multi-theme cleaning business website with 5 complete design systems. Full MVP delivered in one week."
- Tech pills: Astro, TypeScript, Tailwind CSS (3 most recognizable)
- Links: GitHub (`cleaning-test` repo) + demo (`cleanspark-virid.vercel.app`)
- Footer: `<time datetime="2026-03">Updated Mar 2026</time>` + View Details button
- Thumbnail: `images/projects/cleanspark.webp` (Bold Spark theme, 640x360)

## Section 2: Modal Data (`projects.json`)

Key `"cleanspark"` added to `data/projects.json`:

**Description** (3 paragraphs):
1. What it is + 5 themes explanation + speed-build signal ("Full MVP delivered in one week")
2. Theme-by-theme breakdown (Minimal Zen, Bold Spark, Trust Shield, Bubbly Clean, Noir Luxe) + real-time switching with SSR
3. Architecture (islands) + testing story (962 tests, 4 browsers) + WCAG compliance

**Highlights** (6 items):
1. 5 complete design themes with unique layouts, animations, and typography
2. Real-time theme switching with SSR and cookie persistence
3. 962 automated tests across 4 browsers (Vitest + Playwright)
4. WCAG 2.1 AA accessibility verified across all 30 theme/page combinations
5. Islands architecture — static HTML by default, JS only where needed
6. Full MVP delivered in one week

**Tech pills** (modal, expanded): Astro, TypeScript, Tailwind CSS, Playwright, Vitest, Vercel

**Links**: GitHub (`cleaning-test`) + demo (`cleanspark-virid.vercel.app`)

**Screenshots** (5): One per theme with descriptive alt text.

**Status**: `null` (completed/frozen)

## Section 3: Images

| File | Source | Notes |
|------|--------|-------|
| `images/projects/cleanspark.webp` | Bold Spark home (`public/images/screenshots/bold-home.png`) | 640x360 webp, card thumbnail |
| `images/projects/cleanspark-minimal.webp` | `public/images/screenshots/minimal-home.png` | webp, modal |
| `images/projects/cleanspark-bold.webp` | `public/images/screenshots/bold-home.png` | webp, modal |
| `images/projects/cleanspark-trust.webp` | `public/images/screenshots/trust-home.png` | webp, modal |
| `images/projects/cleanspark-bubbly.webp` | `public/images/screenshots/bubbly-home.png` | webp, modal |
| `images/projects/cleanspark-noir.webp` | `public/images/screenshots/noir-home.png` | webp, modal |

Source images are PNGs in the CleanSpark repo. Convert to webp. Thumbnail cropped/resized to 640x360. Modal screenshots are full-width (modal handles responsive sizing).

## Section 4: Repo Rename

Rename GitHub repo `clening-test` -> `cleaning-test` via GitHub API. GitHub auto-creates a redirect from the old URL.

## Section 5: Side Effects

| Area | Change | Manual? |
|------|--------|---------|
| Filter button counts | Web: 1 -> 2 | No (JS calculates dynamically) |
| `tests/pages/FilterPage.js` | `CATEGORY_COUNTS.web`: 1 -> 2, total 7 -> 8 | Yes |
| `docs/PORTFOLIO_REQUIREMENTS.md` | Add CleanSpark to Tier 3 in audit table | Yes |
| `CLAUDE.md` | Update architecture section if needed | Check |

## Out of Scope

- Polish or fixes to the CleanSpark repo itself (frozen)
- Creating composite/collage images
- Updating other project cards (that's CONTENT-004)
