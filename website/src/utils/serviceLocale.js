/**
 * Helpers for `/public/services` items (admin-managed, bilingual fields).
 *
 * - `filterServicesByCategory` — keeps rows where `category.slug` matches (e.g. "it")
 * - Sort is oldest → newest by `createdAt` (change comparator to reverse)
 * - `getServiceLabels` — picks title/titleAr, description/descriptionAr, icon
 */

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
 * @param {Record<string, unknown>} item
 * @param {'en' | 'ar'} locale
 */
export function getServiceLabels(item, locale) {
  return {
    title: pickLocalized(locale, item.title, item.titleAr),
    description: pickLocalized(locale, item.description, item.descriptionAr),
    icon: typeof item.icon === 'string' ? item.icon : 'mdi:star-outline',
  }
}

/**
 * @param {Array<Record<string, unknown>>} services
 * @param {string} categorySlug
 */
export function filterServicesByCategory(services, categorySlug) {
  return services
    .filter((item) => {
      const category = /** @type {{ slug?: string } | undefined} */ (item.category)
      return category?.slug === categorySlug
    })
    .sort((a, b) => {
      const aTime = new Date(String(a.createdAt ?? 0)).getTime()
      const bTime = new Date(String(b.createdAt ?? 0)).getTime()
      return aTime - bTime
    })
}
