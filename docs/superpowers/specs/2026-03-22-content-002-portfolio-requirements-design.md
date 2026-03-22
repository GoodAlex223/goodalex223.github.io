# CONTENT-002: Define Project Portfolio Requirements

**Date**: 2026-03-22
**Status**: Draft
**Branch**: `content/content-002-portfolio-requirements`

## Context

The portfolio at goodalex223.github.io showcases 7 projects across 4 categories (Backend, IoT, Web, Tools). There are no documented criteria for what qualifies a project to appear on the portfolio. As new projects are added (e.g., CONTENT-003 cleaning site), a clear quality standard is needed so that every showcased project reinforces trust with the target audience.

## Target Audience

**Primary**: Freelance clients evaluating whether to hire for a project.
**Secondary**: Hiring managers and technical leads assessing experience depth.

Freelance clients ask: "Can this person build something like what I need?" They care about **working demos, clear outcomes, and recognizable tech stacks** more than architectural elegance.

## Design Decisions

### Tiered Requirements

Projects are classified into three tiers with requirements scaled to what matters for each type. A one-size-fits-all checklist would either be too strict for hardware projects or too lax for production apps.

### "In Development" Projects Are Welcome

Projects marked "In Development" can appear on the portfolio. They signal active growth and ongoing work. The key constraint: any demo or link must work end-to-end even if the project isn't feature-complete.

### Speed Build Exception

Rapid prototypes built under time constraints (e.g., "MVP in one week") are allowed as a Tier 3 subcategory. The speed itself is the selling point. The description must clearly state the timeframe as a positive signal, not an excuse for low quality.

## Project Tiers

### Tier 1 — Production / Full-Stack

Projects with real users, deployment infrastructure, or significant scope. These are flagship portfolio pieces that demonstrate end-to-end delivery capability.

**Current projects**: rating_bot, dropshipping (e-commerce prototype)

**Criteria for classification**: Has a backend with database, runs in production or has a deployed URL, involves multiple integrated systems (e.g., API + frontend + database + CI/CD).

### Tier 2 — Hardware / Embedded

Physical-world projects — Arduino, sensors, industrial deployments. Judged differently because clients can't clone and run them. The real demo is often a simulation or photo of deployed hardware.

**Current projects**: rule-indicators, lubrication, hx711-scale

**Criteria for classification**: Involves physical hardware, microcontrollers, or sensor systems. Typically deployed on real devices or simulated via Wokwi.

### Tier 3 — Utilities & Speed Builds

Smaller tools, CLI utilities, desktop applications, or rapid prototypes. The value is practical problem-solving, speed of delivery, or niche expertise.

**Current projects**: media-viewer, svg-processor, (future: cleaning site)

**Criteria for classification**: Single-purpose tool, CLI, desktop app, or a project explicitly built as a rapid prototype. Scope is narrower than Tier 1.

**Tier mobility**: A project can move up if it matures. For example, media-viewer could become Tier 1 if it ships downloadable releases with polished UX. Tier assignment is based on current state, not aspirations.

## Requirements Per Tier

### Tier 1 — Production / Full-Stack

| Area | Requirement |
|------|-------------|
| **README** | Full: description, screenshots, tech stack, setup instructions, architecture overview |
| **Live Demo** | Required — deployed URL that a client can visit and interact with |
| **Code Quality** | Clean structure, consistent patterns, no obvious hacks or dead code |
| **Modal Data** | Complete: description, highlights, tech pills, links, at least 1 screenshot |
| **Status** | "In Development" is fine, but the demo must work end-to-end |

### Tier 2 — Hardware / Embedded

| Area | Requirement |
|------|-------------|
| **README** | Description, hardware requirements, wiring diagram or schematic reference, photos of real deployment if available |
| **Live Demo** | Wokwi simulation strongly preferred; if not possible, README photos/video showing the real hardware in action |
| **Code Quality** | Clear code comments (hardware context matters more than architecture), readable pin mappings and configuration |
| **Modal Data** | Complete: description, highlights, tech pills, links, at least 1 screenshot (simulation or real hardware) |
| **Status** | "Completed" expected — hardware projects are typically point-in-time deliveries |

### Tier 3 — Utilities & Speed Builds

| Area | Requirement |
|------|-------------|
| **README** | Description, usage examples with clear input/output, installation steps |
| **Live Demo** | Nice to have, not required — GitHub repo with good README is acceptable |
| **Code Quality** | Functional and readable; speed builds get a pass on polish but shouldn't have broken or embarrassing code |
| **Modal Data** | At minimum: description, tech pills, GitHub link. Screenshots optional for CLI tools |
| **Status** | Any — "In Development" or "Completed" both fine |
| **Speed Build Label** | If the project is a rapid prototype, the description must mention the timeframe (e.g., "MVP built in one week") as a positive signal |

### Universal Requirements (All Tiers)

These apply to every project regardless of tier:

1. **GitHub repo link must be live and accessible** — no 404s, no private repos
2. **All external links must work** — demo URLs, simulation links, documentation references
3. **Portfolio card description must be accurate** — reflects current project state, not outdated aspirations
4. **`data-updated` date must reflect actual last meaningful update** — not the date it was added to the portfolio
5. **Project must demonstrate a relevant skill** — should be recognizable to the freelance target audience as something they might need built

## Audit Checklist

Use this checklist when evaluating whether a project meets portfolio requirements. This is the tool for CONTENT-004 (Update Project Information) and for vetting new projects (e.g., CONTENT-003).

### Per-Project Audit

For each project, check:

- [ ] **Tier assigned** — Which tier does this project belong to?
- [ ] **GitHub repo accessible** — Link returns 200, repo is public
- [ ] **README meets tier standard** — See tier-specific README requirements above
- [ ] **Demo/simulation works** — Visit the link, verify it loads and functions
- [ ] **Code quality acceptable** — Quick scan: no obvious dead code, broken files, or embarrassing hacks
- [ ] **Modal data complete** — Description, highlights, tech pills, links present per tier requirements
- [ ] **Screenshots populated** — Per tier requirements (required for Tier 1 & 2, optional for Tier 3 CLI tools)
- [ ] **Card description accurate** — Matches current project reality
- [ ] **`data-updated` date correct** — Reflects last meaningful change
- [ ] **All external links live** — Every URL in the card, modal, and README works

### Adding a New Project

Before adding a project to the portfolio:

1. Assign a tier based on classification criteria
2. Run the per-project audit checklist against that tier's requirements
3. Fix any gaps before the project goes live on the portfolio
4. If the project is a speed build, ensure the timeframe is mentioned in the description

## Current Portfolio Audit Summary

Snapshot of where each project stands against these requirements (detailed audit is CONTENT-004 scope):

| Project | Tier | Demo | Modal Screenshots | Known Gaps |
|---------|------|------|-------------------|------------|
| rating_bot | 1 | Showcase repo only (no live URL) | 2 | Verify README quality; no interactive demo |
| dropshipping | 1 | Vercel link exists | 0 | Need screenshots; verify demo works; verify README |
| rule-indicators | 2 | Wokwi simulation | 2 | Verify README has hardware context |
| lubrication | 2 | Wokwi simulation | 0 | Need screenshots; verify README |
| hx711-scale | 2 | Wokwi simulation | 0 | Need screenshots; verify README |
| media-viewer | 3 | GitHub only | 2 | No live demo (acceptable for Tier 3) |
| svg-processor | 3 | GitHub only | 0 | Screenshots optional (CLI tool); verify README |

**Note**: This summary is a starting point. The actual audit (visiting repos, testing links, reading READMEs) is CONTENT-004's scope. This document defines *what to check* and *what the pass criteria are*.

## Deliverable

A single document (`docs/PORTFOLIO_REQUIREMENTS.md`) containing:
- Target audience definition
- Tier definitions with classification criteria
- Requirements per tier (tables)
- Universal requirements
- Audit checklist for existing and new projects
- Current audit summary snapshot

This document becomes the quality standard referenced by CONTENT-003 (Add Cleaning Site), CONTENT-004 (Update Project Information), and any future content tasks.

## Out of Scope

- Actually performing the full audit (CONTENT-004)
- Adding the cleaning site (CONTENT-003)
- Fixing any gaps found in the audit summary
- Screenshot capture for projects missing them
- README rewrites for external repos
