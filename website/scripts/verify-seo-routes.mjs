#!/usr/bin/env node
/**
 * Verify SEO/routing acceptance criteria (local preview or production).
 * Usage: node scripts/verify-seo-routes.mjs [BASE_URL]
 * Example: node scripts/verify-seo-routes.mjs http://127.0.0.1:4173
 *          node scripts/verify-seo-routes.mjs https://www.mafateehgroup.com
 */
const BASE = (process.argv[2] || process.env.SEO_VERIFY_BASE || 'http://127.0.0.1:4173').replace(/\/$/, '')

const VALID = [
  '/en/',
  '/en/about',
  '/en/about/',
  '/en/contact',
  '/en/blogs',
  '/en/it-solutions',
  '/en/digital-marketing',
  '/en/branding',
  '/en/packages',
  '/ar/',
  '/ar/about',
  '/ar/contact',
  '/ar/blogs',
  '/ar/it-solutions',
]

const INVALID = [
  '/en/fake-slug',
  '/en/random-test-page',
  '/ar/fake-slug',
  '/ar/random-test-page',
]

/** @param {string} path */
async function fetchPath(path) {
  const res = await fetch(`${BASE}${path}`, {
    redirect: 'follow',
    headers: { 'User-Agent': 'mafateeh-seo-verify/1.0' },
  })
  const html = res.headers.get('content-type')?.includes('text/html')
    ? await res.text()
    : ''
  return { status: res.status, html, finalUrl: res.url }
}

function extract(html, re) {
  const m = html.match(re)
  return m ? m[1] : null
}

function verifyHtml(path, html, locale) {
  const errors = []
  const lang = extract(html, /<html lang="([^"]+)"/i)
  const dir = extract(html, /<html[^>]*\sdir="([^"]+)"/i)
  const canonical = extract(html, /<link rel="canonical" href="([^"]+)"/i)
  const title = extract(html, /<title>([^<]*)<\/title>/i)
  const ogTitle = extract(html, /<meta property="og:title" content="([^"]+)"/i)
  const ogUrl = extract(html, /<meta property="og:url" content="([^"]+)"/i)
  const jsonLdCount = (html.match(/application\/ld\+json/gi) || []).length

  const expectLang = locale
  const expectDir = locale === 'ar' ? 'rtl' : 'ltr'
  const expectCanonical = `${BASE}${path.endsWith('/') ? path : path}`

  if (lang !== expectLang) errors.push(`lang expected ${expectLang}, got ${lang}`)
  if (dir !== expectDir) errors.push(`dir expected ${expectDir}, got ${dir}`)
  if (!canonical?.includes(path.replace(/\/$/, '') || path)) {
    errors.push(`canonical mismatch: ${canonical}`)
  }
  if (!title) errors.push('missing title')
  if (!ogTitle) errors.push('missing og:title')
  if (!ogUrl) errors.push('missing og:url')
  if (jsonLdCount < 2) errors.push(`expected JSON-LD blocks, found ${jsonLdCount}`)

  return errors
}

async function main() {
  console.log(`SEO verify base: ${BASE}\n`)
  let failed = 0

  for (const path of VALID) {
    const locale = path.startsWith('/ar') ? 'ar' : 'en'
    const { status, html } = await fetchPath(path)
    const htmlErrors = status === 200 ? verifyHtml(path, html, locale) : [`HTTP ${status}`]
    const ok = status === 200 && htmlErrors.length === 0
    console.log(`${ok ? 'PASS' : 'FAIL'} ${path} → ${status}${htmlErrors.length ? ` (${htmlErrors.join('; ')})` : ''}`)
    if (!ok) failed += 1
  }

  for (const path of INVALID) {
    const res = await fetch(`${BASE}${path}`, {
      redirect: 'manual',
      headers: { 'User-Agent': 'mafateeh-seo-verify/1.0' },
    })
    const ok = res.status === 404
    console.log(`${ok ? 'PASS' : 'FAIL'} ${path} → ${res.status} (expected 404)`)
    if (!ok) failed += 1
  }

  console.log(`\n${failed === 0 ? 'ALL CHECKS PASSED' : `${failed} CHECK(S) FAILED`}`)
  process.exit(failed === 0 ? 0 : 1)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
