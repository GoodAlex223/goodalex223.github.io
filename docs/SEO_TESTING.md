# SEO Testing Checklist

Reusable checklist for validating social card previews and SEO meta tags after changes.

**Last validated**: 2026-02-13
**Tool used**: [opengraph.xyz](https://www.opengraph.xyz)

---

## Pre-Flight Checks

Before testing, ensure:
- [ ] Changes are deployed to production (GitHub Pages)
- [ ] GitHub Actions workflow completed successfully
- [ ] Site is accessible at https://goodalex223.github.io

## 1. Meta Tag Validation

### Required OG Tags (og protocol spec)
- [ ] `og:title` — Present, 50-60 characters recommended
- [ ] `og:type` — Present, value "website"
- [ ] `og:image` — Absolute URL (not relative)
- [ ] `og:url` — Canonical URL of the page

### Recommended OG Tags
- [ ] `og:description` — Present, 110-160 characters recommended
- [ ] `og:image:width` — 1200 (minimum for high-res displays)
- [ ] `og:image:height` — 630 (standard OG ratio)
- [ ] `og:image:alt` — Descriptive alt text

### Twitter Card Tags
- [ ] `twitter:card` — "summary_large_image"
- [ ] `twitter:title` — Matches or similar to og:title
- [ ] `twitter:description` — Matches or similar to og:description
- [ ] `twitter:image` — Absolute URL (same as og:image)
- [ ] `twitter:image:alt` — Descriptive alt text

### Other SEO Tags
- [ ] `<title>` — Present and descriptive
- [ ] `<meta name="description">` — Present, 150-160 characters
- [ ] `<link rel="canonical">` — Present with correct URL
- [ ] JSON-LD structured data — Valid (test at https://validator.schema.org)

## 2. OG Image Verification

- [ ] Image URL returns HTTP 200
- [ ] Content-Type is `image/png` or `image/jpeg`
- [ ] Dimensions: minimum 1200x630 pixels
- [ ] File size: under 8MB (Facebook limit), ideally under 100KB
- [ ] Aspect ratio: ~1.91:1

## 3. Visual Preview Testing

Test URL: `https://www.opengraph.xyz/url/https%3A%2F%2Fgoodalex223.github.io`

### Platform Checks
- [ ] **Facebook** — Image renders, title shows, domain displays
- [ ] **X/Twitter** — Large image card, title visible, domain shows
- [ ] **LinkedIn** — Image thumbnail, title visible, domain shows
- [ ] **Discord** — Title (colored), description text, image renders
- [ ] **WhatsApp** — Image, title, description, domain all visible

### Optional (requires accounts)
- [ ] **Facebook Sharing Debugger** — https://developers.facebook.com/tools/debug/
  - Clears Facebook's OG cache and shows authoritative preview
- [ ] **LinkedIn Post Inspector** — https://www.linkedin.com/post-inspector/
  - Clears LinkedIn's OG cache

## 4. Structured Data Validation

- [ ] Test at https://validator.schema.org — No errors
- [ ] Test at https://search.google.com/test/rich-results — No errors
- [ ] Person schema: name, jobTitle, url, sameAs links
- [ ] WebSite schema: name, url, author reference

## 5. Save Evidence

Save screenshots to `docs/screenshots/`:
- `og-facebook-preview.png`
- `og-twitter-preview.png`
- `og-linkedin-preview.png`
- `og-discord-preview.png`
- `og-whatsapp-preview.png`
- `og-opengraph-xyz-full.png` (full page)

---

## When to Re-Test

Run this checklist after:
- Changing any `<meta>` tags in `<head>`
- Updating the OG image (`og-image.png`)
- Changing the site title or description
- Modifying JSON-LD structured data
- Changing the canonical URL or domain
