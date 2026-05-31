import { Icon } from '@iconify/react'
import { RichHtmlContent } from '../common/RichHtmlContent.jsx'

/**
 * @param {{
 *   title: string,
 *   categoryName: string,
 *   bodyHtml: string,
 *   createdAt: string,
 *   readTime: number,
 *   featuredImageUrl: string | null | undefined,
 *   minReadLabel: (minutes: number) => string,
 *   locale: 'en' | 'ar',
 * }} props
 */
export function BlogPostArticle({
  title,
  categoryName,
  bodyHtml,
  createdAt,
  readTime,
  featuredImageUrl,
  minReadLabel,
  locale,
}) {
  const isRtl = locale === 'ar'

  return (
    <article
      data-aos="zoom-in"
      className="blog-post-card-shadow rounded-xl bg-card px-5 py-6 sm:px-7 sm:py-8"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        {categoryName ? (
          <span className="rounded-full bg-primary px-3 py-1 font-body text-xs font-semibold uppercase tracking-wide text-white dark:bg-secondary dark:text-foreground sm:text-sm">
            {categoryName}
          </span>
        ) : null}
        {createdAt ? (
          <span className="font-body text-sm text-foreground/55 sm:text-base">{createdAt}</span>
        ) : null}
        {readTime > 0 ? (
          <span className="inline-flex items-center gap-1.5 font-body text-sm text-foreground/55 sm:text-base">
            <Icon icon="mdi:clock-outline" className="h-4 w-4 shrink-0" aria-hidden />
            {minReadLabel(readTime)}
          </span>
        ) : null}
      </div>

      <h1 className="mt-5 font-heading text-2xl font-bold leading-tight text-foreground sm:text-3xl lg:text-4xl">
        {title}
      </h1>

      <div className="mt-5 h-px w-full bg-line" role="presentation" aria-hidden />

      {featuredImageUrl ? (
        <img
          src={String(featuredImageUrl)}
          alt=""
          className="mx-auto mt-6 block max-h-[28rem] w-full max-w-3xl rounded-xl object-cover"
          loading="lazy"
          decoding="async"
        />
      ) : null}

      <RichHtmlContent
        html={bodyHtml}
        as="div"
        dir={isRtl ? 'rtl' : 'ltr'}
        className="mt-6 font-body text-base leading-relaxed text-foreground/90 sm:mt-8 sm:text-lg"
      />
    </article>
  )
}
