# Portfolio Requirements

Quality standard for projects showcased on [goodalex223.github.io](https://goodalex223.github.io).

## Target Audience

**Primary**: Freelance clients evaluating whether to hire for a project.
**Secondary**: Hiring managers and technical leads assessing experience depth.

Freelance clients ask: "Can this person build something like what I need?" They care about working demos, clear outcomes, and recognizable tech stacks.

## Project Tiers

Tiers are orthogonal to portfolio categories (Backend, IoT, Web, Tools). Categories describe the technology domain; tiers describe the quality bar.

### Tier 1 — Production / Full-Stack

Projects with real users, deployment infrastructure, or significant scope. Flagship portfolio pieces.

**Classification**: Has a backend with database, runs in production or has a deployed URL, involves multiple integrated systems (e.g., API + frontend + database + CI/CD).

**Current projects**: rating_bot, dropshipping

### Tier 2 — Hardware / Embedded

Physical-world projects — Arduino, sensors, industrial deployments.

**Classification**: Involves physical hardware, microcontrollers, or sensor systems. Typically deployed on real devices or simulated via Wokwi.

**Current projects**: rule-indicators, lubrication, hx711-scale

### Tier 3 — Utilities & Speed Builds

Smaller tools, CLI utilities, desktop applications, or rapid prototypes.

**Classification**: Single-purpose tool, CLI, desktop app, or a project explicitly built as a rapid prototype. Scope is narrower than Tier 1.

**Current projects**: media-viewer, svg-processor

**Tier mobility**: A project can move up if it matures. Tier assignment is based on current state, not aspirations.

## Requirements

### Tier 1 — Production / Full-Stack

| Area | Requirement |
|------|-------------|
| **README** | Full: description, screenshots, tech stack, setup instructions, architecture overview |
| **Live Demo** | Required — deployed URL a client can visit. For bot/CLI projects: video/GIF demo, screenshots of interaction flow, or showcase repo with thorough documentation are acceptable alternatives. |
| **Code Quality** | Clean structure, consistent patterns, no obvious hacks or dead code. Surface-level scan (5-10 min per repo). |
| **Modal Data** | Complete: description, highlights, tech pills, links, at least 1 screenshot |
| **Status** | "In Development" is fine, but the demo must work end-to-end |

### Tier 2 — Hardware / Embedded

| Area | Requirement |
|------|-------------|
| **README** | Description, hardware requirements, wiring diagram or schematic reference, photos of real deployment if available |
| **Live Demo** | Wokwi simulation strongly preferred; otherwise README photos/video of real hardware |
| **Code Quality** | Clear code comments, readable pin mappings and configuration. Surface-level scan (5-10 min per repo). |
| **Modal Data** | Complete: description, highlights, tech pills, links, at least 1 screenshot (simulation or real hardware) |
| **Status** | "Completed" expected |

### Tier 3 — Utilities & Speed Builds

| Area | Requirement |
|------|-------------|
| **README** | Description, usage examples with clear input/output, installation steps |
| **Live Demo** | Nice to have, not required — GitHub repo with good README is acceptable |
| **Code Quality** | Functional and readable; speed builds get a pass on polish but must not have broken or embarrassing code. Surface-level scan (5-10 min per repo). |
| **Modal Data** | At minimum: description, tech pills, GitHub link. Screenshots optional for CLI tools. |
| **Status** | Any |
| **Speed Build** | If rapid prototype, description must mention timeframe as a positive signal (e.g., "Full MVP delivered in one week"). No apologetic language. Must still meet all other Tier 3 requirements. |

### Universal Requirements (All Tiers)

1. **GitHub repo accessible** — no 404s, no private repos
2. **All external links work** — demo URLs, simulation links, documentation references
3. **Card description accurate** — reflects current project state
4. **`data-updated` date correct** — last commit that changed project behavior or content (not portfolio metadata edits)
5. **Demonstrates a relevant skill** — recognizable to the freelance audience

## Audit Checklist

### Per-Project Audit

- [ ] Tier assigned
- [ ] GitHub repo accessible (link returns 200, repo is public)
- [ ] README meets tier standard
- [ ] Demo/simulation works (visit link, verify it loads and functions)
- [ ] Code quality acceptable (5-10 min surface scan: no obvious dead code, broken files, or embarrassing hacks)
- [ ] Modal data complete per tier requirements
- [ ] Screenshots populated per tier requirements
- [ ] Card description accurate
- [ ] `data-updated` date correct
- [ ] All external links live
- [ ] Speed build labeled (Tier 3 only — if rapid prototype, description mentions timeframe)

### Adding a New Project

1. Assign a tier based on classification criteria
2. Run the per-project audit checklist against that tier's requirements
3. Fix any gaps before the project goes live
4. If speed build, ensure timeframe is in the description

## Current Audit Summary

Snapshot as of 2026-03-23 (detailed audit is CONTENT-004 scope):

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

## "In Development" Projects

Projects marked "In Development" are welcome on the portfolio — they signal active growth. The constraint: any demo or link must work end-to-end even if the project isn't feature-complete.

## Maintenance

Re-audit all projects quarterly or when a project's status changes.
