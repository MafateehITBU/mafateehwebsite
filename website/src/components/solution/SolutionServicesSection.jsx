import { useEffect, useState } from 'react'
import api from '../../axiosConfig.js'
import { useLanguage } from '../../context/useLanguage.js'
import { getSolutionPageContent } from '../../content/solutionPages.js'
import { filterServicesByCategory, getServiceLabels } from '../../utils/serviceLocale.js'
import { getApiErrorMessage } from '../../utils/apiError.js'
import { SolutionServicesGrid } from './SolutionServicesGrid.jsx'

/**
 * Section 1 — solid background, service cards from API.
 *
 * EDIT:
 * - Heading text → `solutionPages.js` → `[pageKey].servicesHeading`
 * - Which services appear → `categorySlug` prop (must match API `category.slug`)
 * - Card layout / alignment → `SolutionServicesGrid.jsx` + `ServiceCard` align="start"
 * - API URL → `GET /public/services` below (via `axiosConfig`)
 */

/**
 * @param {{
 *   pageKey: 'it' | 'marketing' | 'branding',
 *   categorySlug: string,
 * }} props
 */
export function SolutionServicesSection({ pageKey, categorySlug }) {
  const { locale } = useLanguage()
  const copy = getSolutionPageContent(pageKey, locale)
  const [items, setItems] = useState(
    /** @type {Array<{ id: string, icon: string, title: string, description: string }>} */ ([]),
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(/** @type {string | null} */ (null))

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const res = await api.get('/public/services')
        if (cancelled) return
        const raw = Array.isArray(res.data) ? res.data : []
        const filtered = filterServicesByCategory(raw, categorySlug)
        setItems(
          filtered.map((row) => {
            const labels = getServiceLabels(row, locale)
            return {
              id: String(row.id),
              icon: labels.icon,
              title: labels.title,
              description: labels.description,
            }
          }),
        )
      } catch (err) {
        if (!cancelled) setError(getApiErrorMessage(err))
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [categorySlug, locale])

  if (!copy) return null

  const isRtl = locale === 'ar'

  return (
    <section
      className="section-solid py-14 sm:py-16 lg:py-20"
      aria-labelledby="solution-services-heading"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="site-container">
        <h2
          id="solution-services-heading"
          className="text-start font-heading text-3xl font-bold text-foreground sm:text-4xl"
        >
          {copy.servicesHeading}
        </h2>

        {loading ? (
          <p className="mt-10 text-start font-body text-foreground/70">
            {locale === 'ar' ? 'جاري التحميل…' : 'Loading services…'}
          </p>
        ) : null}

        {error ? (
          <p className="mt-10 text-start font-body text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
        ) : null}

        {!loading && !error ? <SolutionServicesGrid items={items} /> : null}

        {!loading && !error && items.length === 0 ? (
          <p className="mt-10 text-start font-body text-foreground/70">
            {locale === 'ar' ? 'لا توجد خدمات متاحة حالياً.' : 'No services available yet.'}
          </p>
        ) : null}
      </div>
    </section>
  )
}
