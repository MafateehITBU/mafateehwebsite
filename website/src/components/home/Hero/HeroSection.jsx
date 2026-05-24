import { useLanguage } from '../../../context/useLanguage.js'
import { getHomeContent } from '../../../content/index.js'
import { HeroSocialLinks } from './HeroSocialLinks.jsx'
import { TypewriterSubtitle } from './TypewriterSubtitle.jsx'

export function HeroSection() {
  const { locale } = useLanguage()
  const copy = getHomeContent(locale).hero
  const isRtl = locale === 'ar'

  const containerClass = isRtl
    ? 'flex w-full max-w-xl flex-col gap-6 md:mr-auto md:gap-8 items-stretch text-right'
    : [
        'flex w-full max-w-xl flex-col gap-6 md:ml-auto md:gap-8',
        'items-center text-center md:items-start md:text-left',
      ].join(' ')

  return (
    <section className="relative flex min-h-[calc(100dvh-4.5rem)] w-full items-center py-10 sm:min-h-[calc(100dvh-5rem)] sm:py-14">
      <div dir={isRtl ? 'rtl' : 'ltr'} className={containerClass}>
        <h1 className="w-full font-heading text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
          {copy.title}
        </h1>

        <TypewriterSubtitle className="w-full" />

        <p className="w-full font-body text-base font-normal leading-relaxed text-white sm:text-[1.0625rem] md:text-[1.125rem] lg:text-lg">
          {copy.subtitle}
        </p>
        <HeroSocialLinks />

        <div
          dir={isRtl ? 'rtl' : 'ltr'}
          className={[
            'flex w-full flex-col gap-3',
            isRtl
              ? 'items-stretch md:flex-row md:justify-start md:gap-5'
              : 'max-w-md items-stretch md:max-w-none md:flex-row md:justify-start md:gap-5',
          ].join(' ')}
        >
          <a
            href="#quotes"
            className="inline-flex w-full items-center justify-center rounded-lg border-2 border-white bg-secondary px-6 py-3 font-body text-base font-semibold text-white transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:w-auto md:min-w-[10.5rem]"
          >
            {copy.getQuotes}
          </a>
          <a
            href="#contact"
            className="inline-flex w-full items-center justify-center rounded-lg border-2 border-white bg-primary px-6 py-3 font-body text-base font-semibold text-white transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white dark:bg-background dark:hover:bg-background/90 md:w-auto md:min-w-[10.5rem]"
          >
            {copy.getStarted}
          </a>
        </div>
      </div>
    </section>
  )
}
