# Production Test Results — 18 Aug 2026

**Site tested:** https://www.mafateehgroup.com  
**Test run by:** IT Dev (automated curl + API checks)

---

## CRITICAL FINDING — Deploy Required Before Full Closure

Production is **missing the HTTPS reverse-proxy config**. The file `deploy/nginx/conf.d/https.conf` existed only as a template and was **never deployed** (folder had only `.gitkeep`).

**This is why these tests FAIL right now:**
- MAF-TECH-006 — `https://mafateehgroup.com/` returns **200** instead of 301 → www
- MAF-TECH-048 — **No HSTS** header on `/en/`
- MAF-TECH-049 — **No security headers** on normal HTML pages

**Fix committed:** `deploy/nginx/conf.d/https.conf` + website nginx updates.

### Deploy on VPS (one time, ~5 min)

SSH into the server and run:

```bash
cd /opt/mafateehwebsite
git pull origin main
bash deploy/scripts/deploy.sh
docker compose -f deploy/docker-compose.prod.yml exec reverse-proxy nginx -s reload
```

Then tell dev team — we re-run production tests automatically.

---

## Test Results (Current Production — Before Latest Deploy)

### PASS — No action needed

| Issue | Test | Result |
|-------|------|--------|
| MAF-TECH-001 | /robots.txt | 200, valid text |
| MAF-TECH-002 | /sitemap.xml | 200, valid XML |
| MAF-TECH-009 | /blog | 301 → blogs |
| MAF-TECH-010 | /en/contact | 200 |
| MAF-TECH-011 | All 3 blog posts EN+AR | 200 (see blog-url-verification.txt) |
| MAF-TECH-013 | Code splitting | Confirmed in build |
| MAF-TECH-018 | Initial JS gzip total | ~128 KB (< 500 KB target) |
| MAF-TECH-021 | /assets/ immutable cache | Configured |
| MAF-TECH-025 | Mobile initial payload measured | See initial-js-summary.txt |
| MAF-TECH-035 | /wp-admin, /.env, /admin | 404 |
| MAF-TECH-039 | No gtag in raw HTML | PASS (by design) |
| MAF-TECH-041 | Contact form exists | PASS |
| MAF-TECH-042 | Logo under 50 KB | PASS |
| MAF-TECH-045 | favicon MIME | PASS |
| MAF-TECH-047 | Self-hosted fonts | PASS |

### PARTIAL — Fixed in code, needs deploy + re-test

| Issue | Current prod | After deploy (expected) |
|-------|--------------|-------------------------|
| MAF-TECH-005 | Invalid root URL → 200 | Invalid root URL → **404** |
| MAF-TECH-006 | Apex HTTPS → 200 | Apex HTTPS → **301 www** |
| MAF-TECH-008 | Random root path → 200 | Random root path → **404** |
| MAF-TECH-019 | Images cache 7 days | Images cache **30 days** |
| MAF-TECH-036 | /ar raw HTML lang=en | /ar raw HTML **lang=ar dir=rtl** |
| MAF-TECH-048 | No HSTS | **HSTS present** |
| MAF-TECH-049 | No security headers on HTML | **Headers present** |

### PARTIAL — SPA limitation (document honestly)

| Issue | Status | Notes |
|-------|--------|-------|
| MAF-TECH-003 | Partial | Home page has static canonical; inner routes set canonical via JS after load |
| MAF-TECH-012 | Partial | Raw HTML has empty `<div id="root">` — React CSR; mitigations in place |
| MAF-TECH-017 | Partial | OG tags in raw HTML for home; route-specific tags via JS |
| MAF-TECH-027 | Partial | Organization JSON-LD in raw HTML; dynamic schema via JS |
| MAF-TECH-052 | Partial | No SSR migration; performance debt reduced |

**/en/fake-slug** still returns 200 (SPA shows NotFound page) — this is normal for React apps unless SSR or server-side slug validation is added.

### Performance (Lighthouse files in repo)

| Device | Performance | LCP | Notes |
|--------|-------------|-----|-------|
| Desktop | ~95 | ~0.8s | PASS |
| Mobile | ~77 | ~3.9s | Improved; target <2.5s may need CDN + third-party tuning |

Files: `desktop.json`, `mobile.json`

### PENDING EXTERNAL — Marketing / Legal / Cloudflare

| Issue | Owner | Action |
|-------|-------|--------|
| MAF-TECH-004 | Marketing | GSC access + sitemap submission |
| MAF-TECH-020 | Dev + CF admin | Cloudflare cache rules + HIT proof |
| MAF-TECH-028 | Marketing | Official social URLs in admin |
| MAF-TECH-031 | Legal | Approve T&C text in dashboard |
| MAF-TECH-040 | Marketing | GA4 realtime after cookie accept |
| MAF-TECH-030 | Dev + Marketing | Screen recording: no gtag before consent |

---

## Evidence Files

- `host-redirect-matrix.txt`
- `security-headers-matrix.txt`
- `http-route-tests.txt`
- `blog-url-verification.txt`
- `initial-js-summary.txt`
- `build-output.txt`

---

## After Deploy — Re-test Checklist

Run these and confirm PASS:

```bash
curl -I https://mafateehgroup.com/          # expect 301 → www
curl -I https://www.mafateehgroup.com/en/   # expect HSTS + security headers
curl -o /dev/null -s -w "%{http_code}\n" https://www.mafateehgroup.com/invalid-page-xyz  # expect 404
curl -s https://www.mafateehgroup.com/ar/ | grep 'lang="ar"'  # expect match
```

When all pass → update Excel statuses to VERIFIED / PARTIALLY VERIFIED as appropriate → submit to QA.
