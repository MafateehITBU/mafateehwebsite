# CURRENT PRODUCTION VERIFICATION — 20 Aug 2026

Authoritative status table: `FINAL_PRODUCTION_VERIFICATION.md`.

**MAF-TECH-022 remains PARTIALLY VERIFIED.** Latest PageSpeed Mobile (20 Aug 2026): Performance 75, **LCP ~4.8s** (target ≤2.5s). Older lab figures (~77 / LCP 3.9s) in this file are historical.

## Why your SEO curl looked empty

`/en/about` (no trailing slash) returned **301** to `http://.../en/about/`.

`curl` **without `-L`** prints the tiny 301 HTML — it has **no** canonical tags, so `grep` printed nothing.

### Correct commands (copy/paste)

```bat
curl -sL https://www.mafateehgroup.com/en/about | findstr /i "canonical og:url lang="
curl -sL https://www.mafateehgroup.com/ar/about | findstr /i "lang=\"ar\" dir=\"rtl\""
```

Or use trailing slash (200 directly):

```bat
curl -s https://www.mafateehgroup.com/en/about/ | findstr /i "canonical og:url lang="
curl -s https://www.mafateehgroup.com/ar/about/ | findstr /i "lang=\"ar\" dir=\"rtl\""
```

## 404 evidence (already PASS)

```bat
curl -s -o NUL -w "fake-slug=%{http_code}\n" https://www.mafateehgroup.com/en/fake-slug
curl -s -o NUL -w "random=%{http_code}\n" https://www.mafateehgroup.com/ar/random-test-page
```

Expected: `404` for both.

## Save evidence files for the report

```bat
mkdir C:\Users\lenovo\Desktop\mafateeh-evidence
curl -s -o NUL -w "en-fake=%{http_code}\n" https://www.mafateehgroup.com/en/fake-slug > C:\Users\lenovo\Desktop\mafateeh-evidence\404.txt
curl -s -o NUL -w "ar-random=%{http_code}\n" https://www.mafateehgroup.com/ar/random-test-page >> C:\Users\lenovo\Desktop\mafateeh-evidence\404.txt
curl -sL https://www.mafateehgroup.com/en/about/ > C:\Users\lenovo\Desktop\mafateeh-evidence\en-about.html
curl -sL https://www.mafateehgroup.com/ar/about/ > C:\Users\lenovo\Desktop\mafateeh-evidence\ar-about.html
```

Screenshots for Word report:
1. Terminal showing both 404 lines
2. Open `en-about.html` in Notepad → show `canonical` + `og:url`
3. Open `ar-about.html` → show `lang="ar" dir="rtl"`
4. PageSpeed Insights mobile report PDF/screenshot for `/en/`

## PageSpeed / LCP

**Current (20 Aug 2026, Attachment E2):** Performance **75**, **LCP ~4.8s** — still PARTIAL.

Historical lab (pre-redirect-fix, SUPERSEDED): Performance ~77, LCP 3.9s (target ≤2.5s).

HTTP trailing-slash redirect was leaking `Location: http://...` which hurts SEO and lab LCP.
Fix is in nginx (`absolute_redirect off` + try_files order + reverse-proxy `proxy_redirect`).

After next deploy, re-test:
https://pagespeed.web.dev/analysis?url=https://www.mafateehgroup.com/en/&form_factor=mobile

Wait until scores finish loading (not “No Data”).
