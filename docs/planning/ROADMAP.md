# ROADMAP

**Last Updated**: 2026-05-10

Long-term vision and phase timeline for the portfolio project.

---

## Vision

A clean, fast, accessible personal portfolio that showcases working software with the same care as the projects it links to. No frameworks, minimal dependencies, deliberate engineering throughout.

---

## Phase Timeline

### v1.0 — Launch (✅ Completed 2026-01-20)

Initial portfolio rebuild from scratch.
- 7 projects across 4 categories
- Responsive layout (mobile to desktop)
- Dark theme
- Accessible (WCAG 2.1 AA)
- Zero runtime dependencies

### v1.1 — Polish (✅ Completed 2026-02-10)

Performance, SEO, and link-quality groundwork.
- Favicon + Open Graph image
- Lighthouse 100/100 across Performance/Accessibility/Best Practices/SEO
- External link verification
- robots.txt + sitemap.xml + Google Search Console + Bing Webmaster
- Self-hosted fonts (no third-party CDN)

### v1.5 — Enhanced Features (✅ Completed 2026-03-21)

User-facing feature work.
- Theme toggle (dark/light, persists, no FOUC)
- Project category filtering with animation choreography
- Subtle scroll-reveal animations
- Custom 404 page
- Project Detail Modal (Weekly Challenge — lazy-fetched data, focus management, axe-clean)
- Contact Form (Weekly Challenge — Formspree, honeypot, full validation, accessible state machine)

> _Phase versions group feature themes, not a strict delivery sequence: several v1.5 features (theme toggle, filtering, scroll animations, the 404 page) were committed as early as 2026-01-28 — in parallel with v1.1 — while "Completed 2026-03-21" marks when the v1.5 theme's headline work (Project Detail Modal, Contact Form) shipped._

### Quality & Hardening (🔧 In Progress, since 2026-04)

<!-- Transition convention: when this phase closes, change the header from "🔧 In Progress, since 2026-04" to "✅ Completed YYYY-MM-DD" to match the v1.x phase entries above. -->

Test reliability, CI/CD robustness, code quality, automated link/asset checking, validator hardening, runtime modernization. See [WEEKLY.md](WEEKLY.md) for the current sprint and [DONE.md](DONE.md) for the historical record.

Active themes:
- Test infrastructure: deterministic DOM-state polling, browser-specific flake elimination
- CI: per-job Node version pinning, BACKLOG-validator gate, Node 24 action upgrade
- Documentation: PR-driven CLAUDE.md sync, archive discipline, per-task plan + spec pairs
- Reviewer rigor: confidence-rated findings, follow-ups extracted to BACKLOG

### v2.0 — Content Expansion (📋 Planned)

Larger content surfaces, scheduled after Quality & Hardening winds down.
- Individual project detail pages (deeper than the modal allows)
- Blog/articles section
- Multi-language support (EN/RU/UA)

---

## Ongoing

- Keep projects section updated with new work
- Update skills as they evolve
- Maintain documentation as code changes
- Regular accessibility audits (axe + manual)
- Performance monitoring (Lighthouse CI gate)

---

## Principles

1. **Simplicity**: No unnecessary complexity
2. **Performance**: Fast load times, minimal dependencies
3. **Accessibility**: Usable by everyone
4. **Maintainability**: Easy to update and extend
5. **Professionalism**: Clean, polished presentation
