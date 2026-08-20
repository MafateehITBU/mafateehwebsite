# Final Production Verification — current (authoritative)

**Date:** 20 August 2026  
**Site:** https://www.mafateehgroup.com  
**Stack (unchanged):** PostgreSQL + Express.js + React.js + Node.js (PERN)  
**Not in scope:** Next.js / SSR framework migration

This is the **current** production verification report.

Historical files (`PRODUCTION_TEST_RESULTS.md`, `POST_DEPLOY_RESULTS.md`, `FINAL_PRODUCTION_VERIFICATION.txt`, 18 Aug curl matrices) are **SUPERSEDED** for current status. They are retained for audit only.

Related method notes: `SEO_ROUTE_VERIFICATION.md`  
Screenshots: `closure-evidence/images/` (B1, G1, G2, G3, E2)

## Architecture actually in production

- Express/Node API + React SPA + PostgreSQL
- Build-time per-route HTML shells (`website/scripts/generate-route-html.mjs` + `website/src/seo/routeMeta.js`)
- nginx serves only generated `dist/{locale}/{path}/index.html`; unknown locale paths return **HTTP 404** (no SPA fallback)
- Route-aware canonical, hreflang, Open Graph, Twitter, JSON-LD, `lang`, and `dir` in **raw HTML**
- Language toggle continues to switch `/en` ↔ `/ar` URLs at runtime

## SEO / routing issues (raw HTML + HTTP, not “code exists”)

| Issue | Current Status | Evidence | Notes |
| ----- | -------------- | -------- | ----- |
| MAF-TECH-003 | FULLY VERIFIED | `images/G1-1.png`, `G1-2.png`; curl.exe View Source of `/en/about/` and `/ar/about/` | Per-route `rel=canonical` in initial HTML |
| MAF-TECH-005 | FULLY VERIFIED | `images/B1-1.png`; curl.exe `fake=404` | `/en/fake-slug` → **HTTP 404** |
| MAF-TECH-008 | FULLY VERIFIED | `images/B1-1.png`; curl.exe `random=404` | `/ar/random-test-page` → **HTTP 404** |
| MAF-TECH-017 | FULLY VERIFIED | `images/G1-1.png`, `G1-2.png` | Route-specific `og:*` and `twitter:*` in initial HTML |
| MAF-TECH-022 | PARTIALLY VERIFIED | `images/E2-1.png` PageSpeed Mobile 20 Aug 2026 | Performance 75; **LCP ~4.8s** vs target **≤2.5s**. Not VERIFIED. |
| MAF-TECH-027 | FULLY VERIFIED | `images/G2-1.png`, `G2-2.png`; JSON-LD in raw about HTML | Organization (+ WebSite/Breadcrumb/BlogPosting on applicable routes) |
| MAF-TECH-036 | FULLY VERIFIED | `images/G3-1.png`, `G3-2.png`; `/ar/about/` raw HTML | `html lang="ar" dir="rtl"` |
| MAF-TECH-038 | FULLY VERIFIED | `images/G3-1.png`; `/en/about/` raw HTML | `html lang="en" dir="ltr"` |
| MAF-TECH-012 | REJECTED | Business/technical decision; G1 shows shells but empty React root remains | Remediation option rejected; **not** equivalent to eliminating CSR |
| MAF-TECH-052 | REJECTED | Same decision; PERN retained | Remediation option rejected; debt reduced inside SPA, not eliminated by SSR |
| MAF-TECH-004 | PENDING EXTERNAL | — | Marketing: Google Search Console indexing proof |
| MAF-TECH-020 | PENDING EXTERNAL | — | Cloudflare cache rules + HIT proof |
| MAF-TECH-026 | PENDING EXTERNAL | — | Marketing: GSC mobile-first indexing parity |
| MAF-TECH-028 | PENDING EXTERNAL | — | Marketing: official social URLs for `sameAs` |
| MAF-TECH-031 | PENDING EXTERNAL | — | Legal: approved Terms & Conditions content |
| MAF-TECH-040 | PENDING EXTERNAL | — | Marketing: GA4 Realtime after cookie consent |

## Register totals (must match Excel Verify Tracker)

| Status | Count | IDs |
| ------ | ----- | --- |
| VERIFIED (PRODUCTION) | **36** | All other register items not listed as 022 / 012 / 052 / pending |
| PARTIALLY VERIFIED | **1** | MAF-TECH-022 |
| REJECTED | **2** | MAF-TECH-012, MAF-TECH-052 |
| PENDING EXTERNAL | **6** | 004, 020, 026, 028, 031, 040 |
| **TOTAL** | **45** | |

Do **not** mark MAF-TECH-022 VERIFIED until a new production PageSpeed/Lighthouse mobile run shows **LCP ≤ 2.5 seconds**.

## Production commands used (Windows: `curl.exe`)

```bat
curl.exe -sL "https://www.mafateehgroup.com/en/about/" | findstr /i "canonical og:url lang="
curl.exe -sL "https://www.mafateehgroup.com/ar/about/" | findstr /i "lang= dir= canonical"
curl.exe -s -o NUL -w "fake=%{http_code}\n" "https://www.mafateehgroup.com/en/fake-slug"
curl.exe -s -o NUL -w "random=%{http_code}\n" "https://www.mafateehgroup.com/ar/random-test-page"
```

Observed 20 Aug 2026: English `lang="en" dir="ltr"`; Arabic `lang="ar" dir="rtl"`; both 404 tests returned **404**.
