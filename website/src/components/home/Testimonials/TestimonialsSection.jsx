import { useEffect, useState } from 'react'
import api from '../../../axiosConfig.js'
import { useLanguage } from '../../../context/useLanguage.js'
import { getHomeContent } from '../../../content/index.js'
import { getApiErrorMessage } from '../../../utils/apiError.js'
import { TestimonialsMarquee } from './TestimonialsMarquee.jsx'

export function TestimonialsSection() {
  const { locale } = useLanguage()
  const { testimonials: copy } = getHomeContent(locale)
  const [testimonials, setTestimonials] = useState(/** @type {Array<Record<string, unknown>>} */ ([]))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(/** @type {string | null} */ (null))

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const res = await api.get('/public/testimonials')
        if (cancelled) return
        setTestimonials(Array.isArray(res.data) ? res.data : [])
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
    <section className="relative py-14 sm:py-16 lg:py-20" aria-labelledby="testimonials-heading">
      <div className="site-container text-center">
        <h2
          id="testimonials-heading"
          className="font-heading text-3xl font-bold text-white sm:text-4xl"
        >
          {copy.heading}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl font-body text-base leading-relaxed text-white/85 sm:text-lg">
          {copy.subtitle}
        </p>

        {loading ? (
          <p className="mt-10 font-body text-sm text-white/70">{copy.loading}</p>
        ) : null}

        {error ? (
          <p className="mt-10 font-body text-sm text-white/80" role="alert">
            {error}
          </p>
        ) : null}
      </div>

      {!loading && !error && testimonials.length > 0 ? (
        <TestimonialsMarquee testimonials={testimonials} locale={locale} />
      ) : null}
    </section>
  )
}
