import { useEffect, useState } from 'react'
import api from '../../../axiosConfig.js'
import { useLanguage } from '../../../context/useLanguage.js'
import { getHomeContent } from '../../../content/index.js'
import { getApiErrorMessage } from '../../../utils/apiError.js'
import { PartnersMarquee } from './PartnersMarquee.jsx'

export function PartnersSection() {
  const { locale } = useLanguage()
  const { partners: copy } = getHomeContent(locale)
  const [partners, setPartners] = useState(
    /** @type {Array<{ id: string, name: string, logoUrl?: string | null }>} */ ([]),
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(/** @type {string | null} */ (null))

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const res = await api.get('/public/partners')
        if (cancelled) return
        setPartners(Array.isArray(res.data) ? res.data : [])
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
    <section className="relative py-14 sm:py-16 lg:py-20" aria-labelledby="partners-heading">
      <div className="site-container text-center">
        <h2
          id="partners-heading"
          className="mx-auto max-w-4xl font-heading text-2xl font-bold leading-snug text-white sm:text-3xl lg:text-4xl"
        >
          {copy.heading}
        </h2>

        {loading ? (
          <p className="mt-10 font-body text-sm text-white/70">{copy.loading}</p>
        ) : null}

        {error ? (
          <p className="mt-10 font-body text-sm text-white/80" role="alert">
            {error}
          </p>
        ) : null}
      </div>

      {!loading && !error && partners.length > 0 ? (
        <PartnersMarquee partners={partners} />
      ) : null}
    </section>
  )
}
