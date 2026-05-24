import { Icon } from '@iconify/react'
import { useLanguage } from '../../../context/useLanguage.js'
import { getHomeContent } from '../../../content/index.js'

function PromoFeatureCard({ icon, lines }) {
  return (
    <article className="promo-feature-card flex min-w-0 flex-1 flex-col items-center justify-center rounded-xl px-3 py-6 text-center shadow-md sm:px-5 sm:py-7">
      <Icon icon={icon} className="h-10 w-10 shrink-0 text-white sm:h-11 sm:w-11 lg:h-12 lg:w-12" aria-hidden />
      <p className="mt-3 font-body leading-snug text-white sm:mt-4">
        <span className="block text-base font-bold sm:text-lg">{lines[0]}</span>
        <span className="mt-0.5 block text-xs font-medium sm:text-sm">{lines[1]}</span>
      </p>
    </article>
  )
}

export function PromoSection() {
  const { locale } = useLanguage()
  const { promo } = getHomeContent(locale)
  const isRtl = locale === 'ar'

  return (
    <section className="relative py-14 sm:py-16 lg:py-20" aria-labelledby="promo-heading">
      <div
        className={[
          'site-container flex flex-col gap-8',
          'lg:flex-row lg:items-center lg:justify-between lg:gap-10',
        ].join(' ')}
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        <div className="relative flex flex-1 flex-col justify-center overflow-hidden rounded-2xl px-6 py-12 sm:px-10 sm:py-14 lg:max-w-[40%] lg:px-12 lg:py-16">
          <div
            className="absolute inset-0 bg-primary/5 backdrop-blur-sm "
            aria-hidden
          />
          <div
            className={[
              'relative z-10 flex w-full flex-col gap-5 text-white sm:gap-6',
              'items-center text-center',
              isRtl ? 'lg:items-start lg:text-right' : 'lg:items-start lg:text-left',
            ].join(' ')}
          >
            <h2
              id="promo-heading"
              className="font-heading text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-[1.6rem]"
            >
              {promo.heading}
            </h2>
            <p className="font-body text-base font-normal leading-relaxed text-white sm:text-lg lg:text-[1.0625rem]">
              {promo.subtitle}
            </p>
            <div className="mt-2 flex w-full justify-center lg:justify-start">
              <a
                href="#contact"
                className="inline-flex min-h-12 items-center justify-center rounded-lg border-2 border-white bg-secondary px-8 py-3 font-body text-[0.9375rem] font-semibold text-white transition-colors duration-200 hover:bg-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:text-[0.9375rem]"
              >
                {promo.getStarted}
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-row items-stretch gap-2 sm:gap-3 lg:max-w-[48%] lg:items-center">
          {promo.cards.map((card) => (
            <PromoFeatureCard key={card.lines.join('-')} icon={card.icon} lines={card.lines} />
          ))}
        </div>
      </div>
    </section>
  )
}
