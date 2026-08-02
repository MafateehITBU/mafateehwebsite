import { useEffect, useState } from 'react'
import api from '../axiosConfig.js'

const SEO_ENDPOINT = '/public/seo'
const GTAG_SCRIPT_ATTR = 'data-mafateeh-gtag'
const META_ATTR = 'data-mafateeh-seo'

/**
 * Accepts a raw Google Tag ID, or extracts one from a pasted gtag snippet.
 * Examples: "AW-17883232925", "G-XXXX", or full <!-- Google tag --> HTML.
 * @param {unknown} raw
 * @returns {string | null}
 */
export function normalizeGoogleTagId(raw) {
  const value = String(raw ?? '').trim()
  if (!value) return null
  if (/^(AW|G|GT|UA)-[\w-]+$/i.test(value)) return value
  const fromSnippet = value.match(/\b((?:AW|G|GT|UA)-[\w-]+)\b/i)
  return fromSnippet ? fromSnippet[1] : value.slice(0, 200)
}

/**
 * @param {string} name
 * @param {string} content
 * @param {'name' | 'property'} attr
 */
function upsertMeta(attr, name, content) {
  const selector = `meta[${attr}="${name}"][${META_ATTR}]`
  let el = document.head.querySelector(selector)
  if (!content) {
    el?.remove()
    return
  }
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    el.setAttribute(META_ATTR, 'true')
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

/**
 * Injects Google Ads / Analytics gtag when SEO.googleTagId is set in the dashboard.
 * Also applies meta title, description, keywords, and OG image from SEO settings.
 */
export function SeoProvider({ children }) {
  const [seo, setSeo] = useState(/** @type {Record<string, unknown> | null} */ (null))

  useEffect(() => {
    let cancelled = false
    api
      .get(SEO_ENDPOINT)
      .then((res) => {
        if (!cancelled) setSeo(res.data && typeof res.data === 'object' ? res.data : null)
      })
      .catch(() => {
        if (!cancelled) setSeo(null)
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!seo) return undefined

    const tagId = normalizeGoogleTagId(seo.googleTagId)
    const metaTitle = String(seo.metaTitle ?? '').trim()
    const metaDescription = String(seo.metaDescription ?? '').trim()
    const metaKeywords = String(seo.metaKeywords ?? '').trim()
    const ogImageUrl = String(seo.ogImageUrl ?? '').trim()

    if (metaTitle) {
      document.title = metaTitle
    }

    upsertMeta('name', 'description', metaDescription)
    upsertMeta('name', 'keywords', metaKeywords)
    upsertMeta('property', 'og:title', metaTitle)
    upsertMeta('property', 'og:description', metaDescription)
    upsertMeta('property', 'og:image', ogImageUrl)

    document
      .querySelectorAll(`script[${GTAG_SCRIPT_ATTR}]`)
      .forEach((el) => el.remove())

    if (!tagId) return undefined

    window.dataLayer = window.dataLayer || []
    // Avoid redefining gtag on remounts
    if (typeof window.gtag !== 'function') {
      window.gtag = function gtag() {
        // eslint-disable-next-line prefer-rest-params
        window.dataLayer.push(arguments)
      }
    }
    window.gtag('js', new Date())
    window.gtag('config', tagId)

    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(tagId)}`
    script.setAttribute(GTAG_SCRIPT_ATTR, tagId)
    document.head.appendChild(script)

    return () => {
      document
        .querySelectorAll(`script[${GTAG_SCRIPT_ATTR}]`)
        .forEach((el) => el.remove())
    }
  }, [seo])

  return children
}
