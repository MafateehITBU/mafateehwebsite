import { MultilineText } from '../../common/MultilineText.jsx'
import { getPortfolioLabels } from './portfolioLocale.js'

/**
 * @param {{ item: Record<string, unknown>, locale: 'en' | 'ar' }} props
 */
export function PortfolioCard({ item, locale }) {
  const { title, shortDescription, categoryName } = getPortfolioLabels(locale, item)
  const imageUrl = item.featuredImageUrl
  const link = typeof item.link === 'string' && item.link.trim() ? item.link.trim() : null

  const inner = (
    <>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={title}
          className="aspect-[16/10] w-full object-cover"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div
          className="aspect-[16/10] w-full bg-foreground/5 dark:bg-white/5"
          aria-hidden
        />
      )}
      <div className="flex flex-col gap-1.5 px-4 py-4 sm:px-5 sm:py-5">
        <h3 className="font-heading text-base font-semibold text-foreground sm:text-lg">{title}</h3>
        {categoryName ? (
          <p className="font-body text-sm font-medium text-primary dark:text-secondary">
            {categoryName}
          </p>
        ) : null}
        {shortDescription ? (
          <MultilineText
            as="p"
            className="font-body text-sm leading-relaxed text-foreground/75 dark:text-gray-400"
          >
            {shortDescription}
          </MultilineText>
        ) : null}
      </div>
    </>
  )

  const className = [
    'group flex h-full flex-col overflow-hidden rounded-lg bg-card',
    'shadow-[0_2px_10px_rgba(0,0,0,0.06)]',
    'transition-[transform,box-shadow] duration-300 ease-out',
    'hover:-translate-y-1 hover:shadow-[0_10px_28px_rgba(0,0,0,0.12)]',
    'motion-reduce:transition-none motion-reduce:hover:translate-y-0',
    'dark:shadow-[0_2px_16px_rgba(0,0,0,0.35)] dark:hover:shadow-[0_10px_32px_rgba(0,0,0,0.45)]',
  ].join(' ')

  if (link) {
    return (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {inner}
      </a>
    )
  }

  return <article className={className}>{inner}</article>
}
