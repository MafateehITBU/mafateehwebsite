import { DecorHand } from '../decor/DecorHand.jsx'
import { ParticleField } from '../decor/ParticleField.jsx'
import { useLanguage } from '../../context/useLanguage.js'
import { useTheme } from '../../context/useTheme.js'

/**
 * Full-page decorative layer (scrolls with document).
 * Hand is viewport-fixed (see DecorHand). Sections with bg-background cover decor.
 */
export function SiteBackground() {
  const { locale } = useLanguage()
  const { theme } = useTheme()
  const isRtl = locale === 'ar'
  const isDark = theme === 'dark'
  return (
    <div
      className="site-decor-layer pointer-events-none absolute inset-0 z-0 min-h-dvh min-h-full w-full"
      aria-hidden
    >
      <div className="site-decor-base absolute inset-0 min-h-full w-full" />
      <ParticleField isDark={isDark} />
      <DecorHand isRtl={isRtl} />
    </div>
  )
}
