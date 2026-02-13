# SEO-006: Social Card Preview Testing

**Status**: Complete
**Branch**: `seo/006-social-card-preview-testing`
**Created**: 2026-02-13
**Origin**: BACKLOG.md -> From SEO-004: Improve Meta Descriptions

---

## 1. Goal

Validate OG/Twitter card rendering across social platforms using both programmatic validation and visual preview tools. Document results and fix any issues.

## 2. Approach

**Hybrid validation** (Approach C):
1. **Programmatic**: Playwright fetches live site, extracts all meta tags, validates against OG protocol spec, verifies image URL
2. **Visual**: opengraph.xyz previews for Facebook, X/Twitter, LinkedIn, Discord, WhatsApp
3. **Documentation**: Plan file + reusable `docs/SEO_TESTING.md` checklist

## 3. Implementation

### 3.1 Programmatic Validation Results

**OG Protocol Required Tags**:
| Tag | Present | Value |
|-----|---------|-------|
| `og:title` | YES | "Alexey Minakov \| Software Developer - Backend, IoT & Web" (57 chars) |
| `og:type` | YES | "website" |
| `og:image` | YES | "https://goodalex223.github.io/og-image.png" |
| `og:url` | YES | "https://goodalex223.github.io" |

**OG Protocol Recommended Tags**:
| Tag | Present | Value |
|-----|---------|-------|
| `og:description` | YES | 153 chars, within 110-160 recommended range |
| `og:image:width` | YES | 1200 |
| `og:image:height` | YES | 630 |
| `og:image:alt` | YES | "Alexey Minakov - Software Developer" |

**Twitter Card Tags**:
| Tag | Present | Value |
|-----|---------|-------|
| `twitter:card` | YES | "summary_large_image" |
| `twitter:title` | YES | Matches og:title |
| `twitter:description` | YES | Matches og:description |
| `twitter:image` | YES | Matches og:image |
| `twitter:image:alt` | ADDED | "Alexey Minakov - Software Developer" (was missing) |

**OG Image Verification**:
| Property | Value |
|----------|-------|
| HTTP Status | 200 OK |
| Content-Type | image/png |
| Dimensions | 1200 x 630px |
| File Size | 49 KB |
| Aspect Ratio | 1.90:1 |
| Meets OG Spec (>=1200x630) | YES |
| Meets Twitter Spec (>=300x157) | YES |

**Other SEO Tags**:
| Tag | Status |
|-----|--------|
| `<title>` | Present |
| `<meta name="description">` | Present (160 chars) |
| `<link rel="canonical">` | Present |
| JSON-LD (Person + WebSite) | Valid |

### 3.2 Visual Validation Results (opengraph.xyz)

Screenshots saved to `docs/screenshots/`:

| Platform | Screenshot | Image | Title | Description | Domain |
|----------|-----------|-------|-------|-------------|--------|
| Facebook | `og-facebook-preview.png` | PASS | PASS | Hidden (by design) | PASS |
| X/Twitter | `og-twitter-preview.png` | PASS | PASS | Hidden (by design) | PASS |
| LinkedIn | `og-linkedin-preview.png` | PASS | PASS | Hidden (by design) | PASS |
| Discord | `og-discord-preview.png` | PASS | PASS | PASS | Hidden |
| WhatsApp | `og-whatsapp-preview.png` | PASS | PASS | PASS | PASS |

Full page screenshot: `og-opengraph-xyz-full.png`

**opengraph.xyz Advisory** (non-blocking):
- "Missing a call-to-action in your image" — Marketing suggestion only. Image already contains "View Projects ->" button.

### 3.3 Issue Found and Fixed

**Missing `twitter:image:alt`**:
- **Impact**: Accessibility — screen readers on X/Twitter can't describe the image
- **Fix**: Added `<meta name="twitter:image:alt" content="Alexey Minakov - Software Developer" />` to index.html
- **Value**: Matches existing `og:image:alt`

## 4. Key Discoveries

1. All required and recommended OG/Twitter meta tags were already present and correctly configured
2. The OG image renders correctly across all 5 tested platforms (Facebook, X, LinkedIn, Discord, WhatsApp)
3. Title character count (57) is within Facebook's recommended 50-60 range
4. Description character count (153) is within recommended 110-160 range
5. Only technical gap was missing `twitter:image:alt` (accessibility enhancement)

## 5. Future Improvements

1. **Automated OG validation in CI** — Add a Playwright test that fetches the deployed site and validates all OG/Twitter meta tags are present and correctly formatted. Could run post-deploy or as a separate scheduled workflow.
2. **Facebook Sharing Debugger validation** — When a Facebook account is available, use the official Facebook Sharing Debugger (developers.facebook.com/tools/debug/) for authoritative cache-clear and validation. opengraph.xyz is a good proxy but Facebook's own tool is definitive.

---

### Execution Log

#### 2026-02-13 — PHASE: Planning
- Goal understood: Validate social card previews across platforms
- Approach chosen: Hybrid (programmatic + visual via opengraph.xyz)
- Risks identified: Third-party tool availability, Facebook requiring login

#### 2026-02-13 — PHASE: Implementation
- Programmatic validation: All 16 meta tag checks PASS
- OG image verification: 200 OK, correct dimensions and format
- Visual validation: All 5 platform previews render correctly
- Issue found: Missing `twitter:image:alt` tag

#### 2026-02-13 — PHASE: Sub-Item Complete
- Sub-item: Programmatic meta tag validation
- **Results obtained**: All required/recommended OG and Twitter tags present and valid
- **Lessons learned**: OG protocol has 4 required + 4 recommended tags; Twitter inherits from OG but has own alt tag
- **Problems encountered**: None
- **Improvements identified**: Could automate this validation in CI
- **Technical debt noted**: None
- **Related code needing changes**: None

#### 2026-02-13 — PHASE: Sub-Item Complete
- Sub-item: Visual platform preview validation
- **Results obtained**: All 5 platforms render image, title, and metadata correctly
- **Lessons learned**: Different platforms show different subsets of metadata (e.g., Facebook hides description, Discord hides domain)
- **Problems encountered**: Twitter Card Validator deprecated in 2022; used opengraph.xyz as alternative
- **Improvements identified**: Facebook Sharing Debugger would be more authoritative but requires login
- **Technical debt noted**: None
- **Related code needing changes**: None

#### 2026-02-13 — PHASE: Sub-Item Complete
- Sub-item: Fix twitter:image:alt
- **Results obtained**: Added accessibility alt text for OG image on X/Twitter
- **Lessons learned**: twitter:image:alt is separate from og:image:alt — platforms don't always share alt tags
- **Problems encountered**: None
- **Improvements identified**: None
- **Technical debt noted**: None
- **Related code needing changes**: None
