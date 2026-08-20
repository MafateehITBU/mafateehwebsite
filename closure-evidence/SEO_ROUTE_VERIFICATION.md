# SEO Route Verification — Build-Time HTML Shells (PERN stack preserved)

**Date:** 20 August 2026  
**Role:** Current method + acceptance checks. Status table lives in `FINAL_PRODUCTION_VERIFICATION.md` (authoritative).

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

## Issues addressed (current status)

| Issue | Current status | Production proof |
|-------|----------------|------------------|
| MAF-TECH-003 | FULLY VERIFIED | canonical in raw `/en/about/` and `/ar/about/` (G1) |
| MAF-TECH-005/008 | FULLY VERIFIED | `/en/fake-slug` and `/ar/random-test-page` HTTP **404** (B1) |
| MAF-TECH-017 | FULLY VERIFIED | og/twitter in raw HTML (G1) |
| MAF-TECH-027 | FULLY VERIFIED | JSON-LD in raw HTML (G2) |
| MAF-TECH-036/038 | FULLY VERIFIED | `lang="ar" dir="rtl"` / `lang="en" dir="ltr"` (G3) |
| MAF-TECH-022 | **PARTIALLY VERIFIED** | PageSpeed Mobile 20 Aug: LCP **~4.8s** (target ≤2.5s). E2-1.png |

## Historical vs current

- **Historical (Aug 18 — SUPERSEDED files):** SPA fallback HTTP 200 for invalid slugs; metadata often client-only; Arabic shell `lang="en"`.
- **Current (Aug 20):** Build-time HTML shells + strict nginx routing. See `FINAL_PRODUCTION_VERIFICATION.md`.

## Lighthouse mobile (MAF-TECH-022)

**Do not mark FULLY VERIFIED.** Latest production lab (20 Aug 2026): Performance **75**, LCP **~4.8 seconds**. Target remains LCP ≤ 2.5s.
