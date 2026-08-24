import { lazy, Suspense, useEffect, useState } from 'react'
import { useLanguage } from '../../context/useLanguage.js'
import { useTheme } from '../../context/useTheme.js'

const MOBILE_BREAKPOINT = 768

// Load decorative components only on desktop — avoids any JS/network cost on mobile
const DecorHand = lazy(() =>
  import('../decor/DecorHand.jsx').then((m) => ({ default: m.DecorHand })),
)
const ParticleField = lazy(() =>
  import('../decor/ParticleField.jsx').then((m) => ({ default: m.ParticleField })),
)

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window === 'undefined' ? false : window.innerWidth >= MOBILE_BREAKPOINT,
  )
  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    const mq = window.matchMedia(`(min-width: ${MOBILE_BREAKPOINT}px)`)
    const handler = (e) => setIsDesktop(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return isDesktop
}

/**
 * Full-page decorative layer (scrolls with document).
 * Hand and particles are desktop-only — completely excluded on mobile to help LCP/FCP.
 */
export function SiteBackground() {
  const { locale } = useLanguage()
  const { theme } = useTheme()
  const isRtl = locale === 'ar'
  const isDark = theme === 'dark'
  const isDesktop = useIsDesktop()

  return (
    <div
      className="site-decor-layer pointer-events-none absolute inset-0 z-0 min-h-dvh min-h-full w-full"
      aria-hidden
    >
      <div className="site-decor-base absolute inset-0 min-h-full w-full" />
      {isDesktop && (
        <Suspense fallback={null}>
          <ParticleField isDark={isDark} />
          <DecorHand isRtl={isRtl} />
        </Suspense>
      )}
    </div>
  )
}
