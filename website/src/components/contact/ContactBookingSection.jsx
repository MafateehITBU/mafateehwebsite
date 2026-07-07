import { Icon } from '@iconify/react'

/**
 * @param {{
 *   locale: 'en' | 'ar',
 *   copy: {
 *     bookingHeading: string,
 *     bookingSubtitle: string,
 *     bookingButton: string,
 *     bookingFallback: string,
 *     bookingUrl: string,
 *   },
 * }} props
 */
export function ContactBookingSection({ locale, copy }) {
  const isRtl = locale === 'ar'
  const bookingUrl = String(copy.bookingUrl ?? '').trim()
  const hasBookingUrl = bookingUrl.length > 0

  return (
    <section
      className="mt-12 rounded-2xl border border-line bg-card p-6 sm:mt-14 sm:p-8"
      dir={isRtl ? 'rtl' : 'ltr'}
      aria-label={copy.bookingHeading}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
            {copy.bookingHeading}
          </h3>
          <p className="mt-2 max-w-3xl font-body text-sm leading-relaxed text-foreground/75 sm:text-base">
            {copy.bookingSubtitle}
          </p>
        </div>

        {hasBookingUrl ? (
          <a
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 font-body text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            <Icon icon="mdi:calendar-clock-outline" className="h-5 w-5" aria-hidden />
            {copy.bookingButton}
          </a>
        ) : null}
      </div>

      {hasBookingUrl ? (
        <div className="mt-6 overflow-hidden rounded-xl border border-line">
          <iframe
            src={bookingUrl}
            title={copy.bookingHeading}
            className="h-[620px] w-full bg-white"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      ) : (
        <p className="mt-6 rounded-lg border border-dashed border-line px-4 py-3 font-body text-sm text-foreground/70">
          {copy.bookingFallback}
        </p>
      )}
    </section>
  )
}
