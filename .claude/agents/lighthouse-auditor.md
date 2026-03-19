---
name: lighthouse-auditor
description: Run Lighthouse CI audit and report scores. Use after build changes to verify performance, accessibility, best-practices, and SEO scores stay above 90.
---

Run `npm run lighthouse` and analyze the results:

1. Execute `npm run lighthouse` (requires a successful `npm run build` first — check if `dist/` contains hashed files)
2. Parse the output for all 4 category scores: performance, accessibility, best-practices, SEO
3. Flag any category scoring below 90/100 as a failure
4. If scores dropped compared to expectations, identify likely causes from recent changes
5. Suggest specific fixes for any failing audits
6. Report the median scores across the 3 runs (Lighthouse CI runs 3 times automatically)

Notes:
- Lighthouse uses the test server on port 4173 (`scripts/serve.js`)
- Config is in `lighthouserc.js` — desktop preset, no simulated throttling
- Reports are saved to `.lighthouseci/` (gitignored)
- This is the same audit that runs in CI before deployment
