import { useEffect, useMemo, useState } from 'react'
import api from '../../../axiosConfig.js'
import { useLanguage } from '../../../context/useLanguage.js'
import { getHomeContent } from '../../../content/index.js'
import { getApiErrorMessage } from '../../../utils/apiError.js'
import { PortfolioCard } from './PortfolioCard.jsx'
import { PortfolioCategoryTabs } from './PortfolioCategoryTabs.jsx'
import { PortfolioEmptyState } from './PortfolioEmptyState.jsx'

const INITIAL_VISIBLE = 6
const LOAD_MORE_STEP = 3

export function PortfolioSection() {
  const { locale } = useLanguage()
  const { portfolio: copy } = getHomeContent(locale)
  const [categories, setCategories] = useState(/** @type {Array<{ id: string, name: string, nameAr?: string | null }>} */ ([]))
  const [portfolios, setPortfolios] = useState(/** @type {Array<Record<string, unknown>>} */ ([]))
  const [activeCategoryId, setActiveCategoryId] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(/** @type {string | null} */ (null))
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE)
  const [revealFromIndex, setRevealFromIndex] = useState(INITIAL_VISIBLE)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const [catRes, portRes] = await Promise.all([
          api.get('/public/portfolio-categories'),
          api.get('/public/portfolios'),
        ])
        if (cancelled) return
        setCategories(Array.isArray(catRes.data) ? catRes.data : [])
        setPortfolios(Array.isArray(portRes.data) ? portRes.data : [])
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

  const filteredPortfolios = useMemo(() => {
    if (activeCategoryId === 'all') return portfolios
    return portfolios.filter((p) => p.categoryId === activeCategoryId)
  }, [portfolios, activeCategoryId])

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE)
    setRevealFromIndex(INITIAL_VISIBLE)
  }, [activeCategoryId])

  const visiblePortfolios = useMemo(
    () => filteredPortfolios.slice(0, visibleCount),
    [filteredPortfolios, visibleCount],
  )

  const canShowMore =
    filteredPortfolios.length > INITIAL_VISIBLE && visibleCount < filteredPortfolios.length

  function handleShowMore() {
    setRevealFromIndex(visibleCount)
    setVisibleCount((count) =>
      Math.min(count + LOAD_MORE_STEP, filteredPortfolios.length),
    )
  }

  return (
    <section className="section-solid py-14 sm:py-16 lg:py-20" aria-labelledby="portfolio-heading">
      <div className="site-container" data-aos="fade-up">
        <h2
          id="portfolio-heading"
          className="text-center font-heading text-3xl font-bold text-foreground sm:text-4xl"
        >
          {copy.heading}
        </h2>

        {!loading && !error && categories.length > 0 ? (
          <div className="mt-8 sm:mt-10">
            <PortfolioCategoryTabs
              categories={categories}
              activeId={activeCategoryId}
              allLabel={copy.allCategories}
              locale={locale}
              onSelect={setActiveCategoryId}
            />
          </div>
        ) : null}

        <div className="mt-10 sm:mt-12">
          {loading ? (
            <p className="text-center font-body text-foreground/70">{copy.loading}</p>
          ) : null}

          {error ? (
            <p className="text-center font-body text-red-600 dark:text-red-400" role="alert">
              {error}
            </p>
          ) : null}

          {!loading && !error && filteredPortfolios.length === 0 ? (
            <PortfolioEmptyState message={copy.empty} />
          ) : null}

          {!loading && !error && filteredPortfolios.length > 0 ? (
            <>
              <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-7 lg:grid-cols-3 lg:gap-8">
                {visiblePortfolios.map((item, index) => {
                  const shouldReveal = index >= revealFromIndex
                  return (
                    <li
                      key={String(item.id)}
                      className={shouldReveal ? 'portfolio-card-reveal' : undefined}
                      style={
                        shouldReveal
                          ? { animationDelay: `${(index - revealFromIndex) * 0.08}s` }
                          : undefined
                      }
                    >
                      <PortfolioCard item={item} locale={locale} />
                    </li>
                  )
                })}
              </ul>
              {canShowMore ? (
                <div className="portfolio-show-more-in mt-10 flex justify-center sm:mt-12">
                  <button
                    type="button"
                    onClick={handleShowMore}
                    className="cursor-pointer rounded-lg border-2 border-primary bg-transparent px-8 py-2.5 font-body text-sm font-semibold text-primary transition-colors duration-200 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-foreground"
                  >
                    {copy.showMore}
                  </button>
                </div>
              ) : null}
            </>
          ) : null}
        </div>
      </div>
    </section>
  )
}
