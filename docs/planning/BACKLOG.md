# BACKLOG

Future ideas and improvements for the portfolio.

---

## Features

### Theme Toggle
- Add dark/light mode switch
- Persist preference in localStorage
- Detect `prefers-color-scheme`
- Animate theme transition

### Project Filtering
- Filter projects by category
- CSS-only solution preferred
- Consider checkboxes or buttons
- Animate filter transitions

### Scroll Animations
- Fade in sections on scroll
- Use Intersection Observer
- Respect `prefers-reduced-motion`
- Keep animations subtle

### Project Detail Modal (2026-01-22)
- Click project card (outside links) to open centered overlay
- Extended description with project "story" (challenges, decisions, results)
- Screenshots and/or videos demonstrating functionality
- Requires:
  - [ ] Data structure decision (JSON file vs data attributes vs JS object)
  - [ ] Accessibility: focus trap, ESC to close, aria-modal, restore focus
  - [ ] Lazy-load media to maintain <200KB initial page load
  - [ ] Mobile-friendly modal UX
  - [ ] Clear visual hint that cards are clickable (hover state, "View details")

### Project Metadata Badges (2026-01-22)
- Add "last updated" date to project cards
- Add "in development" indicator/icon for active projects
- Shows portfolio is actively maintained (good signal for recruiters)
- Requires:
  - [ ] Decide where to store dates (HTML data attributes, JSON, etc.)
  - [ ] Visual design for badges (subtle, doesn't clutter cards)
  - [ ] Maintenance process to keep dates current

### Project Detail Pages
- Individual pages for major projects
- More detailed descriptions
- Screenshots and demos
- Technical deep-dives

### Blog Section
- Add blog/articles section
- Write about projects and learnings
- Could use separate static site generator
- Consider markdown-based posts with build step

**Planned Blog Posts:**

1. **My Claude Code Workflow** (Priority: First Post)
   - How I use Claude Code for development
   - Configuration setup (universal CLAUDE.md)
   - Workflow patterns and best practices
   - Real examples from this portfolio rebuild
   - Tips for effective AI-assisted development

2. **Building Industrial IoT Solutions**
   - Lessons from rule_indicators and lubrication monitoring
   - Hardware-software integration challenges
   - Wokwi simulation for development

3. **From Learning Projects to Production Code**
   - Journey from FreeCodeCamp to real applications
   - What tutorials don't teach you

### Contact Form
- Replace email link with form
- Use Formspree or similar service
- Add client-side validation
- Success/error states

---

## Enhancements

### Visual

- [ ] Add project screenshots/thumbnails
- [ ] Create custom favicon
- [ ] Add Open Graph image for social sharing
- [ ] Consider adding a profile photo
- [ ] Add subtle gradient backgrounds

### Performance

- [ ] Lazy load project images (when added)
- [ ] Consider using `font-display: swap`
- [ ] Minify CSS for production
- [ ] Add service worker for offline support

### SEO

- [ ] Add structured data (JSON-LD)
- [ ] Create sitemap.xml
- [ ] Add robots.txt
- [ ] Improve meta descriptions

### Accessibility

- [ ] Add language toggle (EN/RU/UA)
- [ ] Improve focus indicators
- [ ] Test with screen readers
- [ ] Add aria-live regions for dynamic content

---

## Technical Debt

- [ ] Add automated link checking
- [ ] Set up Lighthouse CI
- [ ] Create development build script
- [ ] Add CSS linting (Stylelint)

---

## Ideas from Portfolio Rebuild (2026-01-20)

_Extracted from implementation plan:_

- Add project screenshots/thumbnails
- Create dedicated project detail pages
- Add blog section
- Implement contact form
- Add resume PDF download

---

*Last updated: 2026-01-22*

---

## Notes

~~**GitHub Profile README**: Consider updating [GoodAlex223/GoodAlex223](https://github.com/GoodAlex223/GoodAlex223) repository README to mention AI-assisted development workflows.~~ **DONE** (2026-01-20) - Updated with professional overview, tech stack, featured projects, and AI-assisted development mention.
