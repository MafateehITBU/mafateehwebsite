/**
 * @param {'en' | 'ar'} locale
 * @param {string | null | undefined} en
 * @param {string | null | undefined} ar
 */
export function pickLocalized(locale, en, ar) {
  if (locale === 'ar' && ar && String(ar).trim()) return ar
  return en ?? ''
}

/**
 * @param {'en' | 'ar'} locale
 * @param {{ name: string, nameAr?: string | null }} category
 */
export function getCategoryLabel(locale, category) {
  if (!category) return ''
  return pickLocalized(locale, category.name, category.nameAr)
}

/**
 * @param {'en' | 'ar'} locale
 * @param {{ title: string, titleAr?: string | null, shortDescription?: string | null, shortDescriptionAr?: string | null, category?: { name: string, nameAr?: string | null } | null }} item
 */
export function getPortfolioLabels(locale, item) {
  return {
    title: pickLocalized(locale, item.title, item.titleAr),
    shortDescription: pickLocalized(locale, item.shortDescription, item.shortDescriptionAr),
    categoryName: getCategoryLabel(locale, item.category),
  }
}
