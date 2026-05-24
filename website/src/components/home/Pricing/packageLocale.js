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
 *   shortDescription?: string | null,
 *   shortDescriptionAr?: string | null,
 *   privileges?: string[] | null,
 *   privilegesAr?: string[] | null,
 * }} pkg
 */
export function getPackageLabels(locale, pkg) {
  const privileges =
    locale === 'ar' && Array.isArray(pkg.privilegesAr) && pkg.privilegesAr.length > 0
      ? pkg.privilegesAr
      : pkg.privileges ?? []

  return {
    name: pickLocalized(locale, pkg.name, pkg.nameAr),
    shortDescription: pickLocalized(locale, pkg.shortDescription, pkg.shortDescriptionAr),
    privileges: privileges.map((p) => String(p).trim()).filter(Boolean),
  }
}
