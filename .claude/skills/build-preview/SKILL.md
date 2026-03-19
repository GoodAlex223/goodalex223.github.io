---
name: build-preview
description: Run full production build pipeline, report sizes, and optionally start local server for preview. Use when user wants to build, check build output, or preview the site locally.
---

Run the full production build pipeline and report results:

1. Run `npm run build` and capture all output
2. Show the size report output (CSS and JS raw + gzip sizes)
3. If any size budget is exceeded, highlight the warning
4. If user asks to preview, start `npx serve` or `python -m http.server 8000`
5. If build fails, diagnose the error and suggest fixes
6. After successful build, mention that `npm test` and `npm run lighthouse` can verify the build
