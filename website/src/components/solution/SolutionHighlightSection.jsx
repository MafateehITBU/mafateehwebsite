import { Icon } from '@iconify/react'
import { useLanguage } from '../../context/useLanguage.js'
import { getSolutionPageContent } from '../../content/solutionPages.js'

/**
 * @param {{ pageKey: 'it' | 'marketing' | 'branding' }} props
 */
export function SolutionHighlightSection({ pageKey }) {
  const { locale } = useLanguage()
  const copy = getSolutionPageContent(pageKey, locale)
  const isRtl = locale === 'ar'

  if (!copy) return null

  const [rect0, rect1, rect2, rect3] = copy.rectangles

  return (
    <section
      className="relative py-14 sm:py-16 lg:py-20"
      dir={isRtl ? 'rtl' : 'ltr'}
      aria-labelledby="solution-highlight-heading"
    >
      <div className="site-container">
        <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-center lg:justify-center lg:gap-8  xl:gap-10">
          <div data-aos="zoom-in" className="w-full max-w-2xl rounded-2xl bg-white/10 p-6 backdrop-blur-sm sm:p-8">
            <h2
              id="solution-highlight-heading"
              className="font-heading text-2xl font-bold leading-snug sm:text-3xl"
            >
              <span className="text-white">{copy.choosePrefix} </span>
              <span className="text-secondary">{copy.chooseHighlight}</span>
            </h2>
            <p className="mt-4 font-body text-base leading-relaxed text-white/90 sm:text-lg">
              {copy.highlightSubtitle}
            </p>

            <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
              {copy.points.map((point) => (
                <li key={point.text} className="flex items-start gap-3">
                  <Icon
                    icon={point.icon}
                    className="mt-0.5 h-6 w-6 shrink-0 text-secondary"
                    aria-hidden
                  />
                  <span className="font-body text-sm leading-relaxed text-white sm:text-base">
                    {point.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div data-aos="zoom-in" className="mx-auto grid w-full max-w-[22rem] grid-cols-2 gap-4 sm:max-w-[26rem] sm:gap-5 lg:mx-0 lg:ms-auto lg:max-w-[30rem] xl:max-w-[32rem]">
            <div className="flex flex-col gap-4 sm:gap-5">
              {rect0 ? (
                <HighlightTile
                  title={rect0.title}
                  subtitle={rect0.subtitle}
                  variant="background"
                />
              ) : null}
              {rect2 ? (
                <HighlightTile
                  title={rect2.title}
                  subtitle={rect2.subtitle}
                  variant="secondary"
                />
              ) : null}
            </div>
            <div className="flex flex-col gap-4 pt-8 sm:gap-5 sm:pt-10 lg:pt-12">
              {rect1 ? (
                <HighlightTile
                  title={rect1.title}
                  subtitle={rect1.subtitle}
                  variant="secondary"
                />
              ) : null}
              {rect3 ? (
                <HighlightTile
                  title={rect3.title}
                  subtitle={rect3.subtitle}
                  variant="background"
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/**
 * @param {{ title: string, subtitle: string, variant: 'background' | 'secondary' }} props
 */
function HighlightTile({ title, subtitle, variant }) {
  const isSecondary = variant === 'secondary'

  return (
    <article
      className={[
        'flex min-h-[12rem] w-full flex-col items-center justify-center rounded-xl px-4 py-6 text-center sm:min-h-[13.5rem] sm:px-5 lg:min-h-[14.5rem]',
        isSecondary
          ? 'bg-secondary text-white'
          : 'bg-background text-foreground',
      ].join(' ')}
    >
      <p className="text-3xl sm:text-4xl">{title}</p>
      <p
        className={[
          'mt-3 max-w-[13rem] font-body text-base leading-relaxed sm:mt-4 sm:max-w-[14rem] sm:text-lg',
          isSecondary ? 'text-white/90' : 'text-foreground/75',
        ].join(' ')}
      >
        {subtitle}
      </p>
    </article>
  )
}
