# SEO Route Verification — Build-Time HTML Shells (PERN stack preserved)

**Date:** 20 August 2026  
**Approach:** Post-build Node script generates per-route `index.html` under `dist/{locale}/{path}/`.  
nginx serves only pre-generated shells; invalid locale paths return **HTTP 404** (no SPA fallback).

## Architecture (unchanged)

- PostgreSQL + Express (API) + React (SPA) + Node (build tooling)
- **No** Next.js / SSR framework migration

## Implementation files

| File | Purpose |
|------|---------|
| `website/src/seo/routeMeta.js` | Shared route metadata + JSON-LD |
| `website/scripts/generate-route-html.mjs` | Post-build HTML generator |
| `website/scripts/verify-seo-routes.mjs` | curl-style acceptance tests |
| `website/nginx.default.conf` | Strict `try_files … =404` for `/en` and `/ar` |

## Local build verification

```bash
cd website
npm run build
# Inspect generated shells:
head -30 dist/en/about/index.html
head -5 dist/ar/contact/index.html
# Must show route-specific canonical, lang, dir, OG, JSON-LD
```

## Production verification (after deploy)

```bash
cd website
npm run verify:seo -- https://www.mafateehgroup.com
```

Manual curl checks:

```bash
# Valid → 200 + correct canonical in raw HTML
curl -s https://www.mafateehgroup.com/en/about | grep -E 'canonical|lang=|og:url'
curl -s https://www.mafateehgroup.com/ar/about | grep -E 'lang="ar"|dir="rtl"'

# Invalid → 404 (not 200)
curl -s -o /dev/null -w "%{http_code}\n" https://www.mafateehgroup.com/en/fake-slug
curl -s -o /dev/null -w "%{http_code}\n" https://www.mafateehgroup.com/ar/random-test-page
```

## Issues addressed

| Issue | Fix |
|-------|-----|
| MAF-TECH-003 | Per-route canonical in initial HTML |
| MAF-TECH-005/008 | nginx 404 for unknown locale paths |
| MAF-TECH-017 | Per-route OG/Twitter in initial HTML |
| MAF-TECH-027 | Organization + WebSite + Breadcrumb + BlogPosting JSON-LD in HTML |
| MAF-TECH-036/038 | `lang` + `dir` in initial HTML per locale |
| MAF-TECH-022 | Font subset, mobile ParticleField removed, existing LCP preload retained |

## Historical vs current

- **Historical (Aug 18):** SPA fallback returned HTTP 200 for invalid slugs; metadata client-only.
- **Current (Aug 20):** Build-time HTML shells + strict nginx routing.

## Lighthouse mobile (MAF-TECH-022)

Re-run PageSpeed Insights on `/en/` after deploy. Record FCP, LCP, CLS, INP, TBT in `mobile.json`.

**Target:** LCP ≤ 2.5s — verify on production; do not mark FULLY VERIFIED until measured post-deploy.
