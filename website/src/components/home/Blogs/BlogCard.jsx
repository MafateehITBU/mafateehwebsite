import { Icon } from '@iconify/react'
import { Link } from 'react-router-dom'
import { useLocalizedPath } from '../../../hooks/useLocalizedPath.js'
import { formatBlogDate, getBlogLabels } from './blogLocale.js'

/**
 * @param {{
 *   blog: Record<string, unknown>,
 *   locale: 'en' | 'ar',
 *   readMoreLabel: string,
 *   minReadLabel: (minutes: number) => string,
 * }} props
 */
export function BlogCard({ blog, locale, readMoreLabel, minReadLabel }) {
  const localizedPath = useLocalizedPath()
  const { title, excerpt, categoryName, readTime } = getBlogLabels(locale, blog)
  const slug = String(blog.slug ?? '')
  const imageUrl = blog.featuredImageUrl
  const createdAt = formatBlogDate(String(blog.createdAt ?? ''), locale)
  const isRtl = locale === 'ar'

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl bg-card shadow-[0_2px_12px_rgba(0,0,0,0.08)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.35)]">
      <div className="relative overflow-hidden">
        {imageUrl ? (
          <img
            src={String(imageUrl)}
            alt=""
            className="aspect-[16/8] w-full object-cover transition-transform duration-300 ease-out group-hover:-translate-y-2"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div
            className="aspect-[16/8] w-full bg-foreground/5 transition-transform duration-300 ease-out group-hover:-translate-y-2 dark:bg-white/5"
            aria-hidden
          />
        )}
        {categoryName ? (
          <span
            className={[
              'absolute top-3 rounded-full bg-black/70 px-3 py-1 font-body text-sm font-medium text-white uppercase',
              isRtl ? 'end-3' : 'start-3',
            ].join(' ')}
          >
            {categoryName}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col px-5 py-3.5 sm:px-6 sm:py-4">
        {createdAt ? (
          <p className="font-body text-sm text-[#9ca3af] dark:text-gray-400">{createdAt}</p>
        ) : null}
        <h3 className="mt-1.5 font-heading text-lg font-bold leading-snug text-foreground transition-colors duration-200 hover:text-primary sm:text-xl">
          {title}
        </h3>
        {excerpt ? (
          <p className="mt-1.5 line-clamp-2 whitespace-pre-line font-body text-sm leading-relaxed text-foreground/80 dark:text-gray-400">
            {excerpt}
          </p>
        ) : null}

        <div className="mt-3 h-px w-full bg-line" aria-hidden />

        <div className="mt-3 flex items-center justify-between gap-3">
          <Link
            to={localizedPath(`/blogs/${slug}`)}
            className="inline-flex items-center gap-1.5 font-body text-sm font-medium text-primary transition-[gap] duration-300 ease-out group-hover:gap-3 dark:text-white"
          >
            {readMoreLabel}
            <Icon
              icon={isRtl ? 'solar:arrow-left-linear' : 'solar:arrow-right-linear'}
              className="h-4 w-4 shrink-0"
              aria-hidden
            />
          </Link>
          {readTime > 0 ? (
            <span className="shrink-0 font-body text-xs text-[#9ca3af] dark:text-gray-400 sm:text-sm">
              {minReadLabel(readTime)}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  )
}
