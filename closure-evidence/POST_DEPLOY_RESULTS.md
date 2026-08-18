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
