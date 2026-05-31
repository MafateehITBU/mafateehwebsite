import { getCtaContent } from '../../content/cta.js'
import { useLanguage } from '../../context/useLanguage.js'

/**
 * Shared CTA band — NOT `section-solid`. Rendered by `SiteShell` on most inner routes.
 *
 * EDIT text → `content/cta.js`
 * EDIT button link → `href` on the `<a>` (default `#contact`)
 * EDIT styles → Tailwind on button (secondary bg, white border, hover transparent)
 */
export function CtaSection() {
  const { locale } = useLanguage()
  const copy = getCtaContent(locale)
  const isRtl = locale === 'ar'

  return (
    <section
      className="relative py-14 text-center text-white sm:py-16 lg:py-20"
      aria-labelledby="cta-heading"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="site-container flex flex-col items-center gap-5 sm:gap-6">
        <h2
          id="cta-heading"
          className="max-w-3xl font-heading text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl"
        >
          {copy.heading}
        </h2>
        <p className="max-w-2xl font-body text-base leading-relaxed text-white/90 sm:text-lg">
          {copy.subtitle}
        </p>
        <a
          href="/contact"
          className="mt-1 inline-flex min-h-11 items-center justify-center rounded-lg border-2 border-white bg-secondary px-8 py-2.5 font-body text-sm font-semibold text-white transition-colors duration-300 hover:bg-transparent sm:text-base"
        >
          {copy.button}
        </a>
      </div>
    </section>
  )
}
