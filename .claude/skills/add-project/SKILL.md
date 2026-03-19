---
name: add-project
description: Add a new project card to the portfolio with optional modal detail data. Use when user wants to add a project, create a project card, or add portfolio content.
---

Guide the user through adding a new project to the portfolio:

## Required Information

Ask for (if not provided):
- **Project name** — title for the card
- **Category** — one of: backend, iot, web, tools
- **Description** — short summary for the card
- **Tech stack** — list of technologies used
- **Links** — GitHub repo URL, live demo URL, etc.
- **Updated date** — month/year (format: YYYY-MM)
- **Status** — active (in development) or omit for completed projects

## Implementation Steps

1. Add `<article class="project-card">` to `index.html` in the projects section, following the exact HTML pattern documented in CLAUDE.md under "Adding New Projects"
2. Set `data-category`, `data-updated`, and optionally `data-status="active"` attributes
3. If user wants modal details (rich project page):
   - Add `data-project="<id>"` attribute to the card
   - Add a `<button class="project-card__details-btn" aria-haspopup="dialog">` to the card footer
   - Add matching entry to `data/projects.json` with: `title`, `category`, `description[]`, `highlights[]`, `tech[]`, `links{}`, `screenshots[]`, `status`, `updated`
4. Run `npm run build` to verify the build succeeds
5. Run `npm test` to verify filter counts and other tests still pass
6. If tests fail due to updated category counts, update `CATEGORY_COUNTS` in `tests/pages/FilterPage.js`

## Notes

- The `data-animate` attribute on the card enables scroll-in animations
- Cards are laid out in CSS columns — order in HTML matters for visual layout
- Category filter button counts update automatically from DOM on page load
- Project card thumbnails are optional — add `<img class="project-card__thumbnail">` if available
