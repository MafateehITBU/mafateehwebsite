import { Icon } from '@iconify/react'
import about2 from '../../assets/imgs/about/about2.webp'
import about3 from '../../assets/imgs/about/about3.webp'
import { AnimatedCounter } from '../common/AnimatedCounter.jsx'
import { MultilineText } from '../common/MultilineText.jsx'
import { useLanguage } from '../../context/useLanguage.js'
import { getAboutPageContent } from '../../content/aboutPage.js'

export function AboutJourneySection() {
  const { locale } = useLanguage()
  const copy = getAboutPageContent(locale)
  const isRtl = locale === 'ar'

  return (
    <section
      className="section-solid py-14 sm:py-16 lg:py-20"
      dir={isRtl ? 'rtl' : 'ltr'}
      aria-labelledby="about-journey-heading"
    >
      <div className="site-container">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-14 xl:gap-16">
          {/* Left — two-column gallery (below story on mobile) */}
          <div className="order-2 flex flex-1 items-end justify-center gap-5 lg:order-1">
            <div className="flex flex-col justify-end pt-10 sm:pt-12 lg:pt-14">
              <div className="inline-grid max-w-full">
                <img
                  src={about2}
                  alt=""
                  className="col-start-1 row-start-1 block h-auto max-h-[9rem] w-auto max-w-full rounded-xl object-contain object-center sm:max-h-[10rem] lg:max-h-[15rem]"
                  loading="lazy"
                  decoding="async"
                />
                <div className="col-start-1 row-start-2 mt-4 flex min-h-[15rem] w-0 min-w-full flex-col justify-center rounded-xl bg-secondary px-5 py-7 text-center text-white sm:min-h-[17rem] sm:px-6 sm:py-8">
                  <h3 className="font-heading text-2xl font-bold sm:text-3xl">
                    {copy.gallerySecondaryTitle}
                  </h3>
                  <p className="mt-2 font-body text-sm leading-relaxed break-words text-white/90 sm:text-base">
                    {copy.gallerySecondarySubtitle}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="inline-grid max-w-full">
                <img
                  src={about3}
                  alt=""
                  className="col-start-1 row-start-1 block h-auto max-h-[10rem] w-auto max-w-full rounded-xl object-contain object-center sm:max-h-[11rem] lg:max-h-[25rem]"
                  loading="lazy"
                  decoding="async"
                />
                <div
                  className={[
                    'col-start-1 row-start-2 mt-4 flex min-h-[7.5rem] w-0 min-w-full flex-col rounded-xl bg-primary px-4 py-5 text-white sm:min-h-[8.5rem] sm:px-5 sm:py-6',
                    isRtl ? 'items-end text-end' : 'items-start text-start',
                  ].join(' ')}
                >
                  <Icon
                    icon="mdi:star-four-points"
                    className="h-8 w-8 shrink-0 text-secondary sm:h-9 sm:w-9"
                    aria-hidden
                  />
                  <p className="mt-3 font-body text-sm italic leading-relaxed break-words sm:text-base">
                    &ldquo;{copy.quoteText}&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right — story + counters (on top on mobile) */}
          <div
            data-aos="zoom-in"
            className="order-1 flex flex-1 flex-col lg:order-2 lg:max-w-xl lg:pt-4"
          >
            <div className="flex items-center gap-4">
              <span className="shrink-0 font-body text-xs font-semibold uppercase tracking-[0.2em] text-foreground/70 sm:text-sm">
                {copy.storyEyebrow}
              </span>
              <span className="h-px flex-1 bg-line" aria-hidden />
            </div>

            <h2
              id="about-journey-heading"
              className="mt-5 font-heading text-3xl font-bold leading-tight text-foreground sm:text-4xl"
            >
              {copy.journeyBefore}{' '}
              <span className="text-primary">{copy.journeyHighlight}</span>
            </h2>

            <MultilineText
              as="p"
              className="mt-4 font-body text-base leading-relaxed text-foreground/80 sm:text-lg"
            >
              {copy.journeySubtitle}
            </MultilineText>

            <ul className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6">
              {copy.counters.map((item, index) => (
                <li key={item.label} className="flex flex-col">
                  <AnimatedCounter
                    value={item.value}
                    delay={index * 120}
                    className="font-heading text-2xl font-bold text-primary sm:text-3xl"
                  />
                  <span className="mt-2 font-body text-sm text-foreground sm:text-base">
                    {item.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
