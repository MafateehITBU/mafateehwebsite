# Closure Evidence Package — Mafateeh Website

**Date:** 2026-08-20  
**Stack:** PERN (PostgreSQL, Express, React, Node) — **not** migrated to Next.js/SSR

## Authoritative current status

| File | Role |
|------|------|
| **`FINAL_PRODUCTION_VERIFICATION.md`** | **Current** production verification + status table (use this) |
| **`SEO_ROUTE_VERIFICATION.md`** | How route HTML shells + nginx 404 were implemented/tested |
| **`images/`** | Current screenshots (B1 404, G1 canonical/OG, G3 lang/dir, E2 PageSpeed LCP 4.8s) |

Excel register (must match): **VERIFIED 36 | PARTIALLY VERIFIED 1 (MAF-TECH-022) | REJECTED 2 (012, 052) | PENDING EXTERNAL 6 | TOTAL 45**

## Historical / superseded (audit only — not current)

These files correctly described production **before** the 20 Aug route-shell + 404 remediation. They are retained on purpose.

| File | Why superseded |
|------|----------------|
| `FINAL_PRODUCTION_VERIFICATION.txt` | 18 Aug; Arabic `lang=en` shell; `/en/fake-slug` 200 |
| `POST_DEPLOY_RESULTS.md` | 18 Aug; same SPA limitations |
| `PRODUCTION_TEST_RESULTS.md` | 18 Aug pre/post deploy gap analysis |
| `http-route-tests.txt` | Invalid locale slugs HTTP 200 |
| `prod-header-route-matrix.txt` | 18 Aug header capture |
| `host-redirect-matrix.txt` | 18 Aug redirect capture |
| `MAFATEEH_Developer_Action_and_Closure_Report.txt` | 17 Aug QA brief |
| `MAFATEEH_Developer_Final_Corrections.txt` | 18 Aug QA brief |

## Other still-valid technical logs

| File | Issues |
|------|--------|
| `build-output.txt` | 013, 018, 023, 025 |
| `fonts-self-hosted.txt` | 047 |
| `logo-size.txt` | 042 |
| `blog-url-verification.txt` | 011 |
| `security-headers-matrix.txt` | 048, 049 |
| `CURRENT_CURL_AND_PSI_GUIDE.md` | How to re-test with `curl.exe` / PageSpeed |

## Pending external (not IT Dev alone)

- **004** GSC indexing — Marketing  
- **020** Cloudflare HIT proof — Dev + Cloudflare  
- **026** GSC mobile parity — Marketing  
- **028** official social URLs — Marketing  
- **031** Legal T&C — Legal  
- **040** GA4 Realtime — Marketing  

## Rejected (do not relabel VERIFIED)

- **012**, **052** — SSR/stack migration rejected; rejection ≠ “condition eliminated”
