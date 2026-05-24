import { Icon } from '@iconify/react'
import { MultilineText } from '../../common/MultilineText.jsx'
import { getTestimonialLabels } from './testimonialLocale.js'
import { TestimonialStars } from './TestimonialStars.jsx'

/**
 * @param {{ item: Record<string, unknown>, locale: 'en' | 'ar' }} props
 */
export function TestimonialCard({ item, locale }) {
  const { name, position, content, imageUrl, rate } = getTestimonialLabels(locale, item)
  const isRtl = locale === 'ar'

  return (
    <article
      dir={isRtl ? 'rtl' : 'ltr'}
      className="flex w-[min(100%,22rem)] shrink-0 flex-col rounded-xl border border-primary bg-card px-5 py-5 text-start shadow-sm dark:border-secondary sm:w-[26rem] lg:w-[25rem] sm:px-6 sm:py-6"
    >
      <Icon
        icon="icon-park-outline:quote"
        className={[
          'h-9 w-9 shrink-0 text-primary dark:text-secondary',
          isRtl ? 'self-end' : 'self-start',
        ].join(' ')}
        aria-hidden
      />

      {content ? (
        <MultilineText
          as="p"
          className="mt-3 font-body text-sm leading-relaxed text-foreground/90 sm:text-[0.9375rem]"
        >
          {content}
        </MultilineText>
      ) : null}

      <div className="mt-5 flex items-center gap-3 sm:mt-6">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            className="h-12 w-12 shrink-0 rounded-full object-cover sm:h-14 sm:w-14"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 font-heading text-sm font-bold text-primary dark:bg-secondary/20 dark:text-secondary sm:h-14 sm:w-14"
            aria-hidden
          >
            {name.charAt(0)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="font-heading text-sm font-semibold text-foreground sm:text-base">{name}</p>
          {position ? (
            <p className="mt-0.5 font-body text-xs font-medium text-primary dark:text-secondary sm:text-sm">
              {position}
            </p>
          ) : null}
          <div className="mt-1.5">
            <TestimonialStars rate={rate} />
          </div>
        </div>
      </div>
    </article>
  )
}
