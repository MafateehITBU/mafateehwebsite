# Cloudflare cache setup for mafateehgroup.com

Origin nginx now sends `Cache-Control` and `CDN-Cache-Control` headers. Apply these **Cache Rules** in the Cloudflare dashboard (Caching → Cache Rules):

## Rule 1 — Cache static assets (recommended)
- **When:** URI Path starts with `/assets/`
- **Then:** Cache eligibility = Eligible for cache, Edge TTL = Respect origin

## Rule 2 — Cache public images
- **When:** URI Path matches regex `\.(png|webp|svg|ico)$`
- **Then:** Cache eligibility = Eligible for cache, Edge TTL = 7 days

## Rule 3 — Bypass HTML / SPA shell
- **When:** URI Path equals `/index.html` OR URI Path does not contain a file extension
- **Then:** Cache eligibility = Bypass cache

## Optional — API / dashboard (if proxied through same zone)
Bypass cache for `dashboard.mafateehgroup.com` and `api.mafateehgroup.com`.

## Verify after deploy
```bash
curl -I https://www.mafateehgroup.com/assets/index-*.js
# Expect: cf-cache-status: HIT (after 2nd request) and Cache-Control: immutable

curl -I https://www.mafateehgroup.com/en/about
# Expect: cf-cache-status: DYNAMIC or BYPASS (HTML)
```

## API automation (optional)
If you have a Cloudflare API token with **Zone → Cache Rules → Edit**, set:
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ZONE_ID`

Then run: `bash deploy/cloudflare/apply-cache-rules.sh`
