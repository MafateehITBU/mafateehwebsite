import { useEffect, useState } from 'react'
import api from '../../axiosConfig.js'
import { getBlogPostContent } from '../../content/blogPost.js'
import { BlogNewsletterCard } from './BlogNewsletterCard.jsx'
import { MostReadBlogRow } from './MostReadBlogRow.jsx'

/**
 * @param {{
 *   locale: 'en' | 'ar',
 *   currentSlug?: string,
 * }} props
 */
export function BlogPostSidebar({ locale, currentSlug }) {
  const copy = getBlogPostContent(locale)
  const isRtl = locale === 'ar'
  const [mostRead, setMostRead] = useState(/** @type {Array<Record<string, unknown>>} */ ([]))

  useEffect(() => {
    let cancelled = false
    api
      .get('/public/blogs/most-read')
      .then((res) => {
        if (cancelled) return
        const rows = Array.isArray(res.data) ? res.data : []
        setMostRead(rows)
      })
      .catch(() => {
        if (!cancelled) setMostRead([])
      })
    return () => {
      cancelled = true
    }
  }, [])

  const items = mostRead.filter((item) => String(item.slug ?? '') !== (currentSlug ?? ''))

  return (
    <aside
      className="flex flex-col gap-6 lg:sticky lg:top-20 lg:max-h-[calc(100dvh-5rem)] lg:self-start lg:overflow-y-auto lg:gap-8 xl:top-24"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <section className="blog-post-card-shadow rounded-xl bg-card px-5 py-5 sm:px-6 sm:py-6">
        <h2 className="font-heading text-lg font-bold text-foreground sm:text-xl">
          {copy.mostRead}
        </h2>
        {items.length > 0 ? (
          <ul className="mt-1">
            {items.map((item) => (
              <MostReadBlogRow
                key={String(item.id)}
                item={item}
                locale={locale}
                readCountLabel={copy.readCount}
              />
            ))}
          </ul>
        ) : (
          <p className="mt-4 font-body text-sm text-foreground/60">—</p>
        )}
      </section>

      <BlogNewsletterCard copy={copy} locale={locale} />
    </aside>
  )
}
