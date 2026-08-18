import { lazy, Suspense, useEffect, useState } from 'react'
import { useLanguage } from '../../../context/useLanguage.js'
import { getHomeContent } from '../../../content/index.js'

const ConnectedCapabilitiesOrbit = lazy(() =>
  import('./ConnectedCapabilitiesOrbit.jsx').then((m) => ({
    default: m.ConnectedCapabilitiesOrbit,
  })),
)

function useDesktopOrbit() {
  const [show, setShow] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(min-width: 1024px)').matches,
  )

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const update = () => setShow(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  return show
}

export function CompanySection() {
  const { locale } = useLanguage()
  const { company } = getHomeContent(locale)
  const { capabilities } = company
  const isRtl = locale === 'ar'
  const showOrbit = useDesktopOrbit()

  return (
    <section
      id="about-mafateeh"
      className="company-capabilities section-solid overflow-x-hidden py-14 sm:py-16 lg:py-24"
      aria-labelledby="company-heading"
    >
      <div
        className="company-capabilities__wrapper"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        <div className="company-capabilities__inner">
          <div
            className="site-container company-capabilities__text-shell"
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            <div className="company-capabilities__text-col">
              <p className="text-primary text-lg font-bold dark:text-secondary">
                {company.eyebrow}
              </p>

              <h2
                id="company-heading"
                className="company-capabilities__heading mt-5 max-w-lg font-heading text-3xl font-bold leading-[1.15] text-foreground sm:text-4xl lg:text-[2.75rem]"
              >
                {company.title}
              </h2>

              <p className="company-capabilities__body mt-5 max-w-md font-body text-lg leading-relaxed text-foreground/80 sm:text-xl lg:max-w-md">
                {company.subtitle}
              </p>
            </div>
          </div>

          {showOrbit ? (
            <div className="company-capabilities__orbit-col hidden lg:flex" dir="ltr">
              <Suspense fallback={null}>
                <ConnectedCapabilitiesOrbit
                  items={capabilities.items}
                  ariaLabel={capabilities.label}
                  textRtl={isRtl}
                />
              </Suspense>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
