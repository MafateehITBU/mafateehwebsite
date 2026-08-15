import { Link } from 'react-router-dom'
import { useLocalizedPath } from '../../hooks/useLocalizedPath.js'
import { optimizedImageUrl } from '../../utils/optimizedImageUrl.js'
import { formatBlogDate, pickLocalized } from '../home/Blogs/blogLocale.js'

/**
 * @param {{
 *   item: Record<string, unknown>,
 *   locale: 'en' | 'ar',
 *   readCountLabel: (count: number) => string,
 * }} props
 */
export function MostReadBlogRow({ item, locale, readCountLabel }) {
  const localizedPath = useLocalizedPath()
  const slug = String(item.slug ?? '')
  const title = pickLocalized(locale, item.title, item.titleAr)
  const imageUrl = item.img
  const createdAt = formatBlogDate(String(item.createdAt ?? ''), locale)
  const readCount = typeof item.readCount === 'number' ? item.readCount : 0

  return (
    <li>
      <Link
        to={localizedPath(`/blogs/${slug}`)}
        className="group flex gap-3 py-4 transition-colors sm:gap-4"
      >
        {imageUrl ? (
          <img
            src={optimizedImageUrl(imageUrl, { width: 240 })}
            alt=""
            className="h-16 w-20 shrink-0 rounded-lg object-cover sm:h-[4.5rem] sm:w-[5.5rem]"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div
            className="h-16 w-20 shrink-0 rounded-lg bg-foreground/5 dark:bg-white/5 sm:h-[4.5rem] sm:w-[5.5rem]"
            aria-hidden
          />
        )}
        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <h3 className="line-clamp-2 font-heading text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-primary dark:group-hover:text-secondary sm:text-base">
            {title}
          </h3>
          <div className="mt-1.5 flex items-center justify-between gap-2 font-body text-xs text-foreground/55 sm:text-sm">
            {createdAt ? <span>{createdAt}</span> : <span />}
            <span className="shrink-0 tabular-nums">{readCountLabel(readCount)}</span>
          </div>
        </div>
      </Link>
      <span className="block h-px w-full bg-line" aria-hidden />
    </li>
  )
}
