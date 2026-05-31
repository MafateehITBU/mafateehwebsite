import about1 from '../../assets/imgs/about/about1.png'
import { useLanguage } from '../../context/useLanguage.js'
import { getAboutPageContent } from '../../content/aboutPage.js'

export function AboutStorySection() {
  const { locale } = useLanguage()
  const copy = getAboutPageContent(locale)
  const isRtl = locale === 'ar'

  return (
    <section
      className="section-solid py-14 sm:py-16 lg:py-20"
      dir={isRtl ? 'rtl' : 'ltr'}
      aria-labelledby="about-story-mission-heading"
    >
      <div className="site-container">
        <h2
          id="about-story-mission-heading"
          className="text-center font-heading text-3xl font-bold text-foreground sm:text-4xl"
        >
          {copy.storyMissionHeading}
        </h2>

        <div className="mt-10 flex flex-col gap-10 lg:mt-14 lg:flex-row lg:items-center lg:gap-12 xl:gap-16">
          <div data-aos={isRtl? "slide-left" : "slide-right"} className="flex flex-1 flex-col">
            <h3 className="font-heading text-2xl font-bold leading-snug text-foreground sm:text-3xl">
              {copy.empowerBefore}{' '}
              <span className="text-secondary underline decoration-secondary decoration-2 underline-offset-4">
                {copy.empowerYear}
              </span>
              {copy.empowerAfter ? ` ${copy.empowerAfter}` : ''}
            </h3>
            <p className="mt-4 max-w-xl font-body text-base leading-relaxed text-foreground/80 sm:text-lg">
              {copy.empowerSubtitle}
            </p>

            <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
              {copy.infoCards.map((card) => (
                <li
                  key={card.title}
                  className="rounded-xl border border-transparent bg-[#f8f9fa] px-5 py-4 text-foreground dark:border-line dark:bg-[#131313] dark:text-white"
                >
                  <h4 className="font-heading text-base font-semibold sm:text-lg">{card.title}</h4>
                  <p className="mt-2 font-body text-sm leading-relaxed text-foreground/75 dark:text-white/80">
                    {card.subtitle}
                  </p>
                </li>
              ))}
            </ul>

            <a
              href="#contact"
              className="mt-8 flex min-h-11 w-full items-center justify-center rounded-lg border-2 border-secondary bg-secondary px-8 py-2.5 font-body text-sm font-semibold text-white transition-colors duration-300 hover:bg-transparent hover:text-secondary sm:text-base"
            >
              {copy.contactUs}
            </a>
          </div>

          <div data-aos={isRtl? "slide-right" : "slide-left"} className="flex flex-1 justify-center lg:justify-end">
            <img
              src={about1}
              alt=""
              className="h-auto max-h-[16rem] w-full max-w-lg object-contain sm:max-h-[18rem] lg:max-h-[35rem] lg:max-w-none"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
