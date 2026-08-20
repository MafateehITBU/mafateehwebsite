> **HISTORICAL / SUPERSEDED EVIDENCE**
>
> This document records production behavior observed **before** the latest remediation (18 Aug 2026) and is retained for audit/history purposes.
>
> It is **NOT** the authoritative source for the current production status.
>
> `/en/fake-slug` HTTP 200, `/ar` View Source `lang="en"`, and home-only canonical in this file are **historical**. Current production returns HTTP 404 for invalid locale slugs and serves per-route `lang`/`dir`/canonical in raw HTML.
>
> **Current production verification:** `closure-evidence/FINAL_PRODUCTION_VERIFICATION.md` and `closure-evidence/SEO_ROUTE_VERIFICATION.md`.

# Post-Deploy Production Test Results — 18 Aug 2026 09:44 UTC

After server deploy (deploy.sh + nginx reload). `git pull` failed (SSH key) but existing server code + reload applied several fixes.

## PASS (verified live)

| Issue | Test | Result |
|-------|------|--------|
| MAF-TECH-006 | https://mafateehgroup.com/ | **301** → www |
| MAF-TECH-048 | HSTS on /en/ | **Present** (max-age=31536000; preload) |
| MAF-TECH-049 | Security headers on /en/ | **All present** (nosniff, frame-options, referrer, permissions) |
| MAF-TECH-005/008 | /invalid-page-xyz at root | **404** |
| MAF-TECH-019 | logo-mafateeh.webp cache | **max-age=2592000** (30 days) |
| MAF-TECH-035 | /wp-admin, /.env | **404** |
| MAF-TECH-011 | All 3 blog posts EN+AR | **200** |

## PARTIAL (expected / one more deploy)

| Issue | Test | Result |
|-------|------|--------|
| MAF-TECH-036 | /ar/ View Source lang/dir | Still `lang="en"` in raw HTML — nginx sub_filter + index.html path script need latest git pull + website rebuild |
| MAF-TECH-005/008 | /en/fake-slug | **200** + client NotFound (normal SPA behaviour) |
| MAF-TECH-003 | /en/about canonical in View Source | Still home canonical in static HTML; per-route via JS after load |

## Still external

MAF-TECH-004, 020, 028, 031, 040 — Marketing/Legal/Cloudflare
