import { useEffect, useState } from 'react'
import api from '../../../axiosConfig.js'
import { useLanguage } from '../../../context/useLanguage.js'
import { getHomeContent } from '../../../content/index.js'
import { getApiErrorMessage } from '../../../utils/apiError.js'
import { PricingCarousel } from './PricingCarousel.jsx'

export function PricingSection() {
  const { locale } = useLanguage()
  const { pricing: copy } = getHomeContent(locale)
  const [packages, setPackages] = useState(/** @type {Array<Record<string, unknown>>} */ ([]))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(/** @type {string | null} */ (null))

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const res = await api.get('/public/packages')
        if (cancelled) return
        setPackages(Array.isArray(res.data) ? res.data : [])
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
  }, [])

  return (
    <section className="section-solid py-14 sm:py-16 lg:py-20" aria-labelledby="pricing-heading">
      <div className="site-container">
        <h2
          id="pricing-heading"
          className="text-center font-heading text-3xl font-bold text-foreground sm:text-4xl"
        >
          {copy.heading}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center font-body text-base leading-relaxed text-foreground/75 dark:text-gray-400 sm:text-lg">
          {copy.subtitle}
        </p>

        {loading ? (
          <p className="mt-10 font-body text-foreground/70">{copy.loading}</p>
        ) : null}

        {error ? (
          <p className="mt-10 font-body text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
        ) : null}

        {!loading && !error && packages.length > 0 ? (
          <PricingCarousel
            packages={packages}
            locale={locale}
            requestQuoteLabel={copy.requestQuote}
            prevLabel={copy.prev}
            nextLabel={copy.next}
          />
        ) : null}
      </div>
    </section>
  )
}
