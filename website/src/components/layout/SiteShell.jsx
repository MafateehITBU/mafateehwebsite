import { lazy, Suspense } from 'react'
import { useLocation } from 'react-router-dom'
import { Icon } from '@iconify/react'
import { CookieConsent } from '../common/CookieConsent.jsx'
import { LazyWhenVisible } from '../common/LazyWhenVisible.jsx'
import { SiteBackground } from './SiteBackground.jsx'
import { stripLocalePrefix } from '../../utils/localePath.js'

const CtaSection = lazy(() =>
  import('./CtaSection.jsx').then((m) => ({ default: m.CtaSection })),
)
const Footer = lazy(() =>
  import('./Footer.jsx').then((m) => ({ default: m.Footer })),
)

/**
 * App shell: background decor, page content, optional CTA, footer.
 *
 * ADD a route without CTA → extend `shouldShowCta` (e.g. blogs, privacy, home).
 * CTA copy lives in `content/cta.js`; component is `CtaSection.jsx`.
 */

const STATIC_ROUTES = new Set([
  '/',
  '/blogs',
  '/privacy-policy',
  '/terms-and-conditions',
  '/cookie-policy',
  '/accessibility',
  '/about',
  '/it-solutions',
  '/digital-marketing',
  '/branding',
  '/packages',
  '/contact',
])

/** @param {string} pathname */
function logicalPathname(pathname) {
  return stripLocalePrefix(pathname.replace(/\/$/, '') || '/') || '/'
}

/** @param {string} pathname */
function isKnownRoute(pathname) {
  const logical = logicalPathname(pathname)
  if (STATIC_ROUTES.has(logical)) return true
  if (/^\/blogs\/[^/]+$/.test(logical)) return true
  return false
}

/** Return false on paths that should NOT show the shared CTA above the footer. */
function shouldShowCta(pathname) {
  const logical = logicalPathname(pathname)
  if (!isKnownRoute(pathname)) return false
  if (logical === '/') return false
  if (logical === '/contact') return false
  if (logical === '/privacy-policy') return false
  if (logical === '/terms-and-conditions') return false
  if (logical === '/cookie-policy') return false
  if (logical === '/accessibility') return false
  if (logical === '/blogs') return false
  if (logical.startsWith('/blogs/')) return false
  return true
}

/**
 * Wraps every page: full-height decor behind, content stacked above.
 */
export function SiteShell({ children }) {
  const { pathname } = useLocation()
  const showCta = shouldShowCta(pathname)
  const whatsappHref = 'https://wa.me/962770609728'

  return (
    <div className="relative isolate flex min-h-0 w-full flex-1 flex-col">
      <SiteBackground />
      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        {children}
        <LazyWhenVisible minHeight="1px">
          <Suspense fallback={null}>
            {showCta ? <CtaSection /> : null}
            <Footer />
          </Suspense>
        </LazyWhenVisible>
      </div>

      <CookieConsent />

      <LazyWhenVisible minHeight="1px">
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Send us a WhatsApp message"
          title="Send us a WhatsApp message"
          className="fixed bottom-5 right-5 z-50 inline-flex h-13 w-13 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_28px_rgba(37,211,102,0.35)] transition-transform duration-200 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366] sm:bottom-6 sm:right-6"
          onClick={() => {
            if (typeof window.gtag === 'function') {
              window.gtag('event', 'contact', {
                event_category: 'whatsapp',
                event_label: 'float_button',
              })
            }
          }}
        >
          <Icon icon="mdi:whatsapp" className="h-7 w-7" aria-hidden />
        </a>
      </LazyWhenVisible>
    </div>
  )
}
