#!/usr/bin/env node
/**
 * Post-build: generate per-route index.html shells with crawler-visible SEO metadata.
 * Keeps React SPA + nginx; no SSR framework migration.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  LOCALES,
  STATIC_LOGICAL_PATHS,
  buildRouteDocumentMeta,
  injectDocumentMeta,
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

async function writeRouteHtml(baseHtml, locale, logicalPath, blog) {
  const meta = buildRouteDocumentMeta({ locale, logicalPath, blog })
  const html = injectDocumentMeta(baseHtml, meta)
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
  const blogs = await fetchPublishedBlogs()
  const written = []

  for (const locale of LOCALES) {
    for (const logicalPath of STATIC_LOGICAL_PATHS) {
      const url = await writeRouteHtml(baseHtml, locale, logicalPath, undefined)
      written.push(url)
    }
    for (const blog of blogs) {
      const logicalPath = `/blogs/${blog.slug}`
      const url = await writeRouteHtml(baseHtml, locale, logicalPath, blog)
      written.push(url)
    }
  }

  // Root index.html = English home (legacy/direct access)
  const enHomeMeta = buildRouteDocumentMeta({ locale: 'en', logicalPath: '/' })
  await writeFile(join(DIST, 'index.html'), injectDocumentMeta(baseHtml, enHomeMeta), 'utf8')

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
