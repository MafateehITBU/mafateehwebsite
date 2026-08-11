/** @typedef {'en' | 'ar'} Locale */

export const LOCALES = /** @type {const} */ (['en', 'ar'])
export const DEFAULT_LOCALE = /** @type {Locale} */ ('en')

/** @param {string} pathname */
export function stripLocalePrefix(pathname) {
  const match = pathname.match(/^\/(en|ar)(?=\/|$)/)
  if (!match) return pathname || '/'
  const rest = pathname.slice(match[0].length) || '/'
  return rest.startsWith('/') ? rest : `/${rest}`
}

/** @param {string} pathname @returns {Locale | null} */
export function getLocaleFromPath(pathname) {
  const match = pathname.match(/^\/(en|ar)(?=\/|$)/)
  if (!match) return null
  return /** @type {Locale} */ (match[1])
}

/**
 * @param {string} path Logical path e.g. `/about`, `/`, `/blogs/foo`
 * @param {Locale} locale
 */
export function localizedPath(path, locale) {
  const logical = stripLocalePrefix(path || '/')
  const normalized = logical === '/' ? '' : logical
  return `/${locale}${normalized}`
}

/** @param {string} pathname */
export function isLocalePath(pathname) {
  return /^\/(en|ar)(?=\/|$)/.test(pathname)
}
