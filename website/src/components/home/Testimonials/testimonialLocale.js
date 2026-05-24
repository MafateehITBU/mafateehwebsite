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
 * @param {{
 *   name: string,
 *   nameAr?: string | null,
 *   position?: string | null,
 *   positionAr?: string | null,
 *   content?: string | null,
 *   contentAr?: string | null,
 *   imageUrl?: string | null,
 *   rate?: number | null,
 * }} item
 */
export function getTestimonialLabels(locale, item) {
  return {
    name: pickLocalized(locale, item.name, item.nameAr),
    position: pickLocalized(locale, item.position, item.positionAr),
    content: pickLocalized(locale, item.content, item.contentAr),
    imageUrl: item.imageUrl ?? null,
    rate: typeof item.rate === 'number' ? item.rate : 0,
  }
}
