/**
 * Single source of truth for public route SEO metadata (build-time HTML + runtime SeoProvider).
 * Used by scripts/generate-route-html.mjs after Vite build — no SSR framework migration.
 */
import { PAGE_COPY } from '../content/pages.js'
import { HOME_CONTENT } from '../content/home.js'
import { getCookiePolicyContent } from '../content/cookiePolicy.js'
import { getAccessibilityStatementContent } from '../content/accessibilityStatement.js'

export const SITE_ORIGIN = 'https://www.mafateehgroup.com'
export const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/logo-mafateeh.png`
export const LOCALES = ['en', 'ar']

/** Logical paths (no locale prefix) matching App.jsx static routes. */
export const STATIC_LOGICAL_PATHS = [
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
  '/accessibility',
]

const PAGE_KEY_BY_PATH = {
  '/about': 'about',
  '/it-solutions': 'it',
  '/digital-marketing': 'marketing',
  '/branding': 'branding',
  '/packages': 'packages',
  '/blogs': 'blogs',
  '/contact': 'contact',
  '/privacy-policy': 'privacy',
}

const TERMS_COPY = {
  en: {
    title: 'Terms & Conditions',
    subtitle: 'Terms governing use of the Mafateeh Group website and services.',
    pageName: 'Terms & Conditions',
  },
  ar: {
    title: 'الشروط والأحكام',
    subtitle: 'الشروط التي تحكم استخدام موقع وخدمات مجموعة مفاتيح.',
    pageName: 'الشروط والأحكام',
  },
}

/** @param {string} logicalPath */
export function isKnownLogicalPath(logicalPath) {
  if (STATIC_LOGICAL_PATHS.includes(logicalPath)) return true
  if (logicalPath.startsWith('/blogs/') && logicalPath.length > '/blogs/'.length) return true
  return false
}

/** @param {string} logicalPath @param {'en'|'ar'} locale */
function pageLabelFromPath(logicalPath, locale) {
  const lang = locale === 'ar' ? 'ar' : 'en'
  if (logicalPath === '/') return lang === 'ar' ? 'الرئيسية' : 'Home'
  const key = PAGE_KEY_BY_PATH[logicalPath]
  if (key && PAGE_COPY[key]?.[lang]) return PAGE_COPY[key][lang].pageName
  if (logicalPath === '/cookie-policy') {
    return getCookiePolicyContent(lang).title ?? 'Cookie Policy'
  }
  if (logicalPath === '/accessibility') {
    return getAccessibilityStatementContent(lang).title ?? 'Accessibility'
  }
  if (logicalPath === '/terms-and-conditions') {
    return TERMS_COPY[lang].pageName
  }
  if (logicalPath.startsWith('/blogs/')) return lang === 'ar' ? 'مقال' : 'Blog Post'
  return 'Page'
}

/**
 * @param {object} opts
 * @param {'en'|'ar'} opts.locale
 * @param {string} opts.logicalPath
 * @param {{ slug?: string, title?: string, titleAr?: string, featuredImageUrl?: string | null }} [opts.blog]
 */
export function buildRouteDocumentMeta({ locale, logicalPath, blog }) {
  const lang = locale === 'ar' ? 'ar' : 'en'
  const canonicalPath =
    logicalPath === '/' ? `/${locale}/` : `/${locale}${logicalPath}`
  const canonicalUrl = `${SITE_ORIGIN}${canonicalPath}`
  const hreflangEn = `${SITE_ORIGIN}${logicalPath === '/' ? '/en/' : `/en${logicalPath}`}`
  const hreflangAr = `${SITE_ORIGIN}${logicalPath === '/' ? '/ar/' : `/ar${logicalPath}`}`

  let title = 'Mafateeh Group'
  let description =
    lang === 'ar'
      ? 'مجموعة مفاتيح — حلول تقنية المعلومات والتسويق الرقمي والهوية البصرية.'
      : 'Mafateeh Group — IT, digital marketing, and branding solutions.'

  if (logicalPath === '/') {
    title = 'Mafateeh Group'
    description = HOME_CONTENT[lang].hero.subtitle
  } else if (logicalPath.startsWith('/blogs/') && blog) {
    const blogTitle = lang === 'ar' ? blog.titleAr || blog.title : blog.title
    title = `${blogTitle} | Mafateeh Group`
    description = String(blogTitle).slice(0, 160)
  } else {
    const pageKey = PAGE_KEY_BY_PATH[logicalPath]
    if (pageKey && PAGE_COPY[pageKey]?.[lang]) {
      title = `${PAGE_COPY[pageKey][lang].title} | Mafateeh Group`
      description = PAGE_COPY[pageKey][lang].subtitle
    } else if (logicalPath === '/cookie-policy') {
      const copy = getCookiePolicyContent(lang)
      title = `${copy.title} | Mafateeh Group`
      description =
        lang === 'ar'
          ? 'سياسة ملفات تعريف الارتباط لموقع مجموعة مفاتيح.'
          : 'Cookie policy for the Mafateeh Group website.'
    } else if (logicalPath === '/accessibility') {
      const copy = getAccessibilityStatementContent(lang)
      title = `${copy.title} | Mafateeh Group`
      description =
        lang === 'ar'
          ? 'بيان إمكانية الوصول لموقع مجموعة مفاتيح.'
          : 'Accessibility statement for the Mafateeh Group website.'
    } else if (logicalPath === '/terms-and-conditions') {
      title = `${TERMS_COPY[lang].title} | Mafateeh Group`
      description = TERMS_COPY[lang].subtitle
    }
  }

  const ogImage =
    blog?.featuredImageUrl && String(blog.featuredImageUrl).trim()
      ? String(blog.featuredImageUrl).trim()
      : DEFAULT_OG_IMAGE

  const jsonLd = buildJsonLdBlocks({ locale, logicalPath, canonicalUrl, title, description, blog, ogImage })

  return {
    lang: locale,
    dir: locale === 'ar' ? 'rtl' : 'ltr',
    title,
    description,
    canonicalUrl,
    hreflangEn,
    hreflangAr,
    ogImage,
    ogType: logicalPath.startsWith('/blogs/') ? 'article' : 'website',
    ogLocale: locale === 'ar' ? 'ar_JO' : 'en_US',
    robots: 'index, follow',
    jsonLd,
  }
}

function buildJsonLdBlocks({ locale, logicalPath, canonicalUrl, title, description, blog, ogImage }) {
  const blocks = []
  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_ORIGIN}/#organization`,
    name: 'Mafateeh Group',
    alternateName: ['Mafateeh', 'Mafateeh IT & Media Solutions'],
    url: SITE_ORIGIN,
    logo: DEFAULT_OG_IMAGE,
    foundingDate: '2018',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Wahib Al Afyouni St.',
      addressLocality: 'Amman',
      addressCountry: 'JO',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+962-7-7060-9728',
      email: 'info@mafateehgroup.com',
      contactType: 'customer service',
    },
  }
  blocks.push(organization)

  if (logicalPath === '/') {
    blocks.push({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${SITE_ORIGIN}/#website`,
      url: SITE_ORIGIN,
      name: 'Mafateeh Group',
      publisher: { '@id': `${SITE_ORIGIN}/#organization` },
      inLanguage: ['en', 'ar'],
    })
  }

  const homeUrl = `${SITE_ORIGIN}/${locale}/`
  const crumbs = [
    {
      '@type': 'ListItem',
      position: 1,
      name: locale === 'ar' ? 'الرئيسية' : 'Home',
      item: homeUrl,
    },
  ]
  if (logicalPath !== '/') {
    crumbs.push({
      '@type': 'ListItem',
      position: 2,
      name: pageLabelFromPath(logicalPath, locale),
      item: canonicalUrl,
    })
  }
  blocks.push({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs,
  })

  if (logicalPath.startsWith('/blogs/') && blog?.slug) {
    blocks.push({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: title.replace(/ \| Mafateeh Group$/, ''),
      description,
      url: canonicalUrl,
      image: ogImage,
      inLanguage: locale === 'ar' ? 'ar' : 'en',
      publisher: { '@id': `${SITE_ORIGIN}/#organization` },
      mainEntityOfPage: canonicalUrl,
      identifier: blog.slug,
    })
  }

  return blocks
}

/** @param {string} html @param {ReturnType<typeof buildRouteDocumentMeta>} meta */
export function injectDocumentMeta(html, meta) {
  let out = html
  out = out.replace(/<html lang="[^"]*">/, `<html lang="${meta.lang}" dir="${meta.dir}">`)
  out = out.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(meta.title)}</title>`)
  out = replaceMetaContent(out, 'name', 'description', meta.description)
  out = replaceLinkHref(out, 'canonical', meta.canonicalUrl)
  out = replaceLinkHref(out, 'alternate', meta.hreflangEn, 'en')
  out = replaceLinkHref(out, 'alternate', meta.hreflangAr, 'ar')
  out = replaceLinkHref(out, 'alternate', meta.hreflangEn, 'x-default')
  out = replaceMetaContent(out, 'property', 'og:type', meta.ogType)
  out = replaceMetaContent(out, 'property', 'og:site_name', 'Mafateeh Group')
  out = replaceMetaContent(out, 'property', 'og:title', meta.title)
  out = replaceMetaContent(out, 'property', 'og:description', meta.description)
  out = replaceMetaContent(out, 'property', 'og:url', meta.canonicalUrl)
  out = replaceMetaContent(out, 'property', 'og:image', meta.ogImage)
  out = replaceMetaContent(out, 'property', 'og:locale', meta.ogLocale)
  out = replaceMetaContent(out, 'name', 'twitter:card', 'summary_large_image')
  out = replaceMetaContent(out, 'name', 'twitter:title', meta.title)
  out = replaceMetaContent(out, 'name', 'twitter:description', meta.description)
  out = replaceMetaContent(out, 'name', 'twitter:image', meta.ogImage)
  out = replaceMetaContent(out, 'name', 'robots', meta.robots)

  const jsonLdHtml = meta.jsonLd
    .map(
      (block) =>
        `<script type="application/ld+json">\n${JSON.stringify(block, null, 2)}\n    </script>`,
    )
    .join('\n    ')
  out = out.replace(
    /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
    jsonLdHtml,
  )

  // Remove duplicate JSON-LD blocks if base template had extras after first replace
  const ldScripts = out.match(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g) || []
  if (ldScripts.length > meta.jsonLd.length) {
    const keep = ldScripts.slice(0, meta.jsonLd.length).join('\n    ')
    out = out.replace(
      /(<script type="application\/ld\+json">[\s\S]*?<\/script>\s*)+/,
      `${keep}\n    `,
    )
  }

  return out
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function replaceMetaContent(html, attr, key, content) {
  const re = new RegExp(`<meta ${attr}="${key}" content="[^"]*"\\s*/>`, 'i')
  if (re.test(html)) {
    return html.replace(re, `<meta ${attr}="${key}" content="${escapeHtml(content)}" />`)
  }
  return html.replace('</head>', `    <meta ${attr}="${key}" content="${escapeHtml(content)}" />\n  </head>`)
}

function replaceLinkHref(html, rel, href, hreflang) {
  const hreflangAttr = hreflang ? ` hreflang="${hreflang}"` : ''
  const re = hreflang
    ? new RegExp(`<link rel="${rel}" hreflang="${hreflang}" href="[^"]*"\\s*/>`, 'i')
    : new RegExp(`<link rel="${rel}" href="[^"]*"\\s*/>`, 'i')
  const tag = `<link rel="${rel}"${hreflangAttr} href="${href}" />`
  if (re.test(html)) return html.replace(re, tag)
  return html.replace('</head>', `    ${tag}\n  </head>`)
}
