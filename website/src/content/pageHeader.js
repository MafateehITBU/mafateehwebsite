/**
 * Shared breadcrumb label for `PageHeader` ("Home" / "الرئيسية").
 * Page-specific titles live in `content/pages.js` (or page-local content).
 */

/** @typedef {{ home: string }} PageHeaderLocaleContent */

/** @type {Record<'en' | 'ar', PageHeaderLocaleContent>} */
export const PAGE_HEADER_CONTENT = {
  en: {
    home: 'Home',
  },
  ar: {
    home: 'الرئيسية',
  },
}

/** @param {'en' | 'ar'} locale */
export function getPageHeaderContent(locale) {
  const key = locale === 'ar' ? 'ar' : 'en'
  return PAGE_HEADER_CONTENT[key] ?? PAGE_HEADER_CONTENT.en
}
