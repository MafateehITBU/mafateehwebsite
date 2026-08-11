import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import api from '../axiosConfig.js'
import { readCookieConsent } from '../components/common/CookieConsent.jsx'
import { localizedPath, stripLocalePrefix } from '../utils/localePath.js'
import { useLanguage } from './useLanguage.js'
import { useStaticInfo } from './StaticInfoContext.jsx'

const SEO_ENDPOINT = '/public/seo'
const SITE_ORIGIN = 'https://www.mafateehgroup.com'
const GTAG_SCRIPT_ATTR = 'data-mafateeh-gtag'
const META_ATTR = 'data-mafateeh-seo'
const LINK_ATTR = 'data-mafateeh-seo-link'
const JSONLD_ATTR = 'data-mafateeh-jsonld'

/**
 * Accepts a raw Google Tag ID, or extracts one from a pasted gtag snippet.
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
 * @param {'name' | 'property'} attr
 * @param {string} key
 * @param {string} content
 */
function upsertMeta(attr, key, content) {
  const selector = `meta[${attr}="${key}"][${META_ATTR}]`
  let el = document.head.querySelector(selector)
  if (!content) {
    el?.remove()
    return
  }
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    el.setAttribute(META_ATTR, 'true')
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

/**
 * @param {string} rel
 * @param {string} href
 * @param {Record<string, string>} [extra]
 */
function upsertLink(rel, href, extra = {}) {
  const hreflang = extra.hreflang
  const selector = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"][${LINK_ATTR}]`
    : `link[rel="${rel}"][${LINK_ATTR}]:not([hreflang])`
  let el = document.head.querySelector(selector)
  if (!href) {
    el?.remove()
    return
  }
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    el.setAttribute(LINK_ATTR, 'true')
    if (hreflang) el.setAttribute('hreflang', hreflang)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
  for (const [k, v] of Object.entries(extra)) {
    if (k !== 'hreflang') el.setAttribute(k, v)
  }
}

/** @param {string} id @param {string | null} href @param {string} hreflang */
function upsertHreflang(id, href, hreflang) {
  const selector = `link[rel="alternate"][hreflang="${hreflang}"][${LINK_ATTR}="${id}"]`
  let el = document.head.querySelector(selector)
  if (!href) {
    el?.remove()
    return
  }
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'alternate')
    el.setAttribute('hreflang', hreflang)
    el.setAttribute(LINK_ATTR, id)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

/**
 * @param {string} id
 * @param {Record<string, unknown> | null} data
 */
function upsertJsonLd(id, data) {
  const selector = `script[type="application/ld+json"][${JSONLD_ATTR}="${id}"]`
  let el = document.head.querySelector(selector)
  if (!data) {
    el?.remove()
    return
  }
  if (!el) {
    el = document.createElement('script')
    el.setAttribute('type', 'application/ld+json')
    el.setAttribute(JSONLD_ATTR, id)
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(data)
}

const KNOWN_PATHS = new Set([
  '/',
  '/about',
  '/it-solutions',
  '/digital-marketing',
  '/branding',
  '/packages',
  '/blogs',
  '/contact',
  '/privacy-policy',
  '/terms-and-conditions',
  '/cookie-policy',
])

/** @param {string} pathname */
function isKnownPath(pathname) {
  if (KNOWN_PATHS.has(pathname)) return true
  if (pathname.startsWith('/blogs/') && pathname.length > '/blogs/'.length) return true
  return false
}

/** @param {string} pathname */
function pageLabelFromPath(pathname) {
  const map = {
    '/': 'Home',
    '/about': 'About Us',
    '/it-solutions': 'IT Solutions',
    '/digital-marketing': 'Digital Marketing',
    '/branding': 'Branding',
    '/packages': 'Packages',
    '/blogs': 'Blogs',
    '/contact': 'Contact Us',
    '/privacy-policy': 'Privacy Policy',
    '/terms-and-conditions': 'Terms & Conditions',
    '/cookie-policy': 'Cookie Policy',
  }
  if (map[pathname]) return map[pathname]
  if (pathname.startsWith('/blogs/')) return 'Blog Post'
  return 'Page'
}

/**
 * Route-aware SEO: canonical, OG/Twitter, JSON-LD, gtag + dashboard SEO fields.
 * Note: tags injected client-side; full crawler visibility still needs SSR/prerender (MAF-TECH-012).
 */
export function SeoProvider({ children }) {
  const location = useLocation()
  const { locale } = useLanguage()
  const { staticInfo } = useStaticInfo()
  const [seo, setSeo] = useState(/** @type {Record<string, unknown> | null} */ (null))
  const [analyticsAllowed, setAnalyticsAllowed] = useState(
    () => readCookieConsent() === 'accepted',
  )

  const pathname = location.pathname.endsWith('/') && location.pathname !== '/'
    ? location.pathname.slice(0, -1)
    : location.pathname
  const logicalPath = stripLocalePrefix(pathname)
  const canonicalUrl = `${SITE_ORIGIN}${pathname === '/' ? '/' : pathname}`

  useEffect(() => {
    const onConsent = (event) => {
      setAnalyticsAllowed(event.detail === 'accepted')
    }
    window.addEventListener('mafateeh-cookie-consent', onConsent)
    return () => window.removeEventListener('mafateeh-cookie-consent', onConsent)
  }, [])

  const socialSameAs = useMemo(() => {
    const links = staticInfo?.socialLinks?.map((l) => l.url).filter(Boolean) ?? []
    return links
  }, [staticInfo])

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
    const tagId = normalizeGoogleTagId(seo?.googleTagId)
    const metaTitle =
      String(seo?.metaTitle ?? '').trim() ||
      (logicalPath === '/'
        ? 'Mafateeh Group'
        : `${pageLabelFromPath(logicalPath)} | Mafateeh Group`)
    const metaDescription = String(seo?.metaDescription ?? '').trim()
    const metaKeywords = String(seo?.metaKeywords ?? '').trim()
    const ogImageUrl =
      String(seo?.ogImageUrl ?? '').trim() || `${SITE_ORIGIN}/logo-mafateeh.png`

    const known = isKnownPath(logicalPath)
    document.title = known
      ? metaTitle
      : `Page Not Found | Mafateeh Group`

    upsertLink('canonical', known ? canonicalUrl : `${SITE_ORIGIN}${localizedPath('/', locale)}`)
    upsertHreflang('en', known ? `${SITE_ORIGIN}${localizedPath(logicalPath, 'en')}` : `${SITE_ORIGIN}/en`, 'en')
    upsertHreflang('ar', known ? `${SITE_ORIGIN}${localizedPath(logicalPath, 'ar')}` : `${SITE_ORIGIN}/ar`, 'ar')
    upsertHreflang('x-default', known ? `${SITE_ORIGIN}${localizedPath(logicalPath, 'en')}` : `${SITE_ORIGIN}/en`, 'x-default')
    upsertLink('manifest', '/site.webmanifest')

    // Soft-404 mitigation for SPA (HTTP status still 200 without SSR)
    upsertMeta('name', 'robots', known ? 'index, follow' : 'noindex, follow')

    upsertMeta('name', 'description', known ? metaDescription : 'The page you requested was not found.')
    upsertMeta('name', 'keywords', metaKeywords)
    upsertMeta('property', 'og:type', 'website')
    upsertMeta('property', 'og:site_name', 'Mafateeh Group')
    upsertMeta('property', 'og:url', known ? canonicalUrl : `${SITE_ORIGIN}/`)
    upsertMeta('property', 'og:title', known ? metaTitle : 'Page Not Found | Mafateeh Group')
    upsertMeta('property', 'og:description', known ? metaDescription : 'The page you requested was not found.')
    upsertMeta('property', 'og:image', ogImageUrl)
    upsertMeta('property', 'og:locale', locale === 'ar' ? 'ar_JO' : 'en_US')
    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertMeta('name', 'twitter:title', known ? metaTitle : 'Page Not Found | Mafateeh Group')
    upsertMeta('name', 'twitter:description', known ? metaDescription : 'The page you requested was not found.')
    upsertMeta('name', 'twitter:image', ogImageUrl)

    if (!known) {
      upsertJsonLd('organization', null)
      upsertJsonLd('website', null)
      upsertJsonLd('breadcrumb', null)
    } else {
      const organization = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': `${SITE_ORIGIN}/#organization`,
        name: 'Mafateeh Group',
        alternateName: ['Mafateeh', 'Mafateeh IT & Media Solutions'],
        url: SITE_ORIGIN,
        logo: `${SITE_ORIGIN}/logo-mafateeh.png`,
        foundingDate: '2018',
        address: {
          '@type': 'PostalAddress',
          streetAddress: staticInfo?.address || 'Wahib Al Afyouni St.',
          addressLocality: 'Amman',
          addressCountry: 'JO',
        },
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: staticInfo?.phoneNumber || '+962-7-7060-9728',
          email: staticInfo?.email || 'info@mafateehgroup.com',
          contactType: 'customer service',
        },
        ...(socialSameAs.length > 0 ? { sameAs: socialSameAs } : {}),
      }
      upsertJsonLd('organization', organization)

      if (logicalPath === '/') {
        upsertJsonLd('website', {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          '@id': `${SITE_ORIGIN}/#website`,
          url: SITE_ORIGIN,
          name: 'Mafateeh Group',
          publisher: { '@id': `${SITE_ORIGIN}/#organization` },
          inLanguage: ['en', 'ar'],
        })
      } else {
        upsertJsonLd('website', null)
      }

      const crumbs = [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `${SITE_ORIGIN}/`,
        },
      ]
      if (logicalPath !== '/') {
        crumbs.push({
          '@type': 'ListItem',
          position: 2,
          name: pageLabelFromPath(logicalPath),
          item: canonicalUrl,
        })
      }
      upsertJsonLd('breadcrumb', {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: crumbs,
      })
    }

    document
      .querySelectorAll(`script[${GTAG_SCRIPT_ATTR}]`)
      .forEach((el) => el.remove())

    if (!tagId || !analyticsAllowed) return undefined

    window.dataLayer = window.dataLayer || []
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
  }, [seo, pathname, logicalPath, canonicalUrl, locale, staticInfo, socialSameAs, analyticsAllowed])

  return children
}
