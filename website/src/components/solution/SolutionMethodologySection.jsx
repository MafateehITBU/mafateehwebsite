import { useLanguage } from '../../context/useLanguage.js'
import { getSolutionPageContent } from '../../content/solutionPages.js'

/**
 * Section 3 — solid background, centered methodology steps.
 *
 * EDIT copy → `solutionPages.js`: methodologyLabel, methodologyHeading, methodologySteps[]
 * EDIT step box colors → `stepStyles` below (01 & 03: primary, 02: white) — no `dark:` variants
 */

/**
 * @param {{ pageKey: 'it' | 'marketing' | 'branding' }} props
 */
export function SolutionMethodologySection({ pageKey }) {
  const { locale } = useLanguage()
  const copy = getSolutionPageContent(pageKey, locale)
  const isRtl = locale === 'ar'

  if (!copy) return null

  /** Step number boxes — same look in light and dark (01 & 03 primary, 02 white) */
  const stepStyles = [
    'bg-white text-foreground dark:bg-transparent',
    'bg-primary text-white',
    'bg-white text-foreground dark:bg-transparent',
  ]

  return (
    <section
      className="section-solid py-14 sm:py-16 lg:py-20"
      dir={isRtl ? 'rtl' : 'ltr'}
      aria-labelledby="solution-methodology-heading"
    >
      <div className="site-container text-center">
        <p className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-secondary sm:text-sm">
          {copy.methodologyLabel}
        </p>
        <h2
          id="solution-methodology-heading"
          className="mt-3 font-heading text-3xl font-bold text-foreground sm:text-4xl"
        >
          {copy.methodologyHeading}
        </h2>

        <ol className="mt-15 grid grid-cols-1 gap-10 sm:mt-20 md:grid-cols-3 md:gap-8 lg:gap-12">
          {copy.methodologySteps.map((step, index) => (
            <li key={step.number} className="flex max-w-md flex-col items-center md:max-w-none">
              <div
                className={[
                  'flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-2xl border border-line font-heading text-xl font-bold sm:h-20 sm:w-20 sm:text-2xl lg:h-[5.25rem] lg:w-[5.25rem] lg:text-[1.75rem]',
                  stepStyles[index] ?? stepStyles[0],
                ].join(' ')}
              >
                {step.number}
              </div>
              <h3 className="mt-6 font-heading text-xl font-semibold text-foreground sm:text-2xl">
                {step.title}
              </h3>
              <p className="mt-3 max-w-sm font-body text-base leading-relaxed text-foreground/75 sm:text-lg">
                {step.subtitle}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
