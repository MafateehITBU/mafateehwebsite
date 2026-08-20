#!/usr/bin/env node
/**
 * Post-build: generate per-route index.html shells with crawler-visible SEO metadata.
 * Keeps React SPA + nginx; no SSR framework migration.
 */
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  LOCALES,
  STATIC_LOGICAL_PATHS,
  buildRouteDocumentMeta,
  injectDocumentMeta,
  injectStaticHero,
} from '../src/seo/routeMeta.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DIST = join(__dirname, '..', 'dist')
const API_BASE = process.env.VITE_API_BASE_URL || 'https://api.mafateehgroup.com/api'

const FALLBACK_BLOG_SLUGS = [
  'the-biggest-threat-to-any-business-isn-t-competition-it-s-the-chaos-you-can-t-see',
  'most-lost-sales-start-with-a-poor-digital-experience',
  'is-your-marketing-a-revenue-engine-or-just-noise',
]

async function fetchPublishedBlogs() {
  try {
    const res = await fetch(`${API_BASE}/public/blogs`, {
      signal: AbortSignal.timeout(15000),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const rows = await res.json()
    if (!Array.isArray(rows) || rows.length === 0) throw new Error('empty')
    return rows.filter((b) => b?.slug && b?.published !== false)
  } catch (err) {
    console.warn(`Blog API unavailable (${err.message}); using fallback slugs.`)
    return FALLBACK_BLOG_SLUGS.map((slug) => ({ slug, title: slug, titleAr: slug }))
  }
}

async function loadFontPreloads() {
  const assetsDir = join(DIST, 'assets')
  let files = []
  try {
    files = await readdir(assetsDir)
  } catch {
    return ''
  }
  const mont700 = files.find((f) => /montserrat-latin-700.*\.woff2$/i.test(f))
  const roboto400 = files.find((f) => /roboto-latin-400.*\.woff2$/i.test(f))
  return [
    mont700 &&
      `<link rel="preload" href="/assets/${mont700}" as="font" type="font/woff2" crossorigin />`,
    roboto400 &&
      `<link rel="preload" href="/assets/${roboto400}" as="font" type="font/woff2" crossorigin />`,
  ]
    .filter(Boolean)
    .join('\n    ')
}

/** Home: static hero + no competing preloads. Inner routes: drop decor preload; preload fonts. */
function tunePerfHints(html, isHome, fontPreloads) {
  let out = html.replace(/\s*<link rel="preload" as="image"[^>]*decor-hand[^>]*\/?>\s*/gi, '\n')
  if (!isHome && fontPreloads && !out.includes('montserrat-latin-700')) {
    out = out.replace('</head>', `    ${fontPreloads}\n  </head>`)
  }
  return out
}

async function writeRouteHtml(baseHtml, locale, logicalPath, blog, fontPreloads) {
  const meta = buildRouteDocumentMeta({ locale, logicalPath, blog })
  const isHome = logicalPath === '/'
  let html = injectDocumentMeta(baseHtml, meta)
  if (isHome) html = injectStaticHero(html, locale)
  html = tunePerfHints(html, isHome, fontPreloads)
  const segments =
    logicalPath === '/'
      ? [locale]
      : [locale, ...logicalPath.slice(1).split('/')]
  const outDir = join(DIST, ...segments)
  await mkdir(outDir, { recursive: true })
  await writeFile(join(outDir, 'index.html'), html, 'utf8')
  return logicalPath === '/' ? `/${locale}/` : `/${locale}${logicalPath}`
}

async function main() {
  const baseHtml = await readFile(join(DIST, 'index.html'), 'utf8')
  const fontPreloads = await loadFontPreloads()
  const blogs = await fetchPublishedBlogs()
  const written = []

  for (const locale of LOCALES) {
    for (const logicalPath of STATIC_LOGICAL_PATHS) {
      const url = await writeRouteHtml(baseHtml, locale, logicalPath, undefined, fontPreloads)
      written.push(url)
    }
    for (const blog of blogs) {
      const logicalPath = `/blogs/${blog.slug}`
      const url = await writeRouteHtml(baseHtml, locale, logicalPath, blog, fontPreloads)
      written.push(url)
    }
  }

  const enHomeMeta = buildRouteDocumentMeta({ locale: 'en', logicalPath: '/' })
  let rootHtml = injectDocumentMeta(baseHtml, enHomeMeta)
  rootHtml = injectStaticHero(rootHtml, 'en')
  rootHtml = tunePerfHints(rootHtml, true, fontPreloads)
  await writeFile(join(DIST, 'index.html'), rootHtml, 'utf8')

  await writeFile(
    join(DIST, 'valid-routes.json'),
    JSON.stringify({ generatedAt: new Date().toISOString(), routes: written.sort() }, null, 2),
    'utf8',
  )

  console.log(`Generated ${written.length} route HTML shells (+ root index.html).`)
  console.log(`Blog posts included: ${blogs.length}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
