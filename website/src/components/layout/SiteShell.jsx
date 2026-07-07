import { useLocation } from 'react-router-dom'
import { Icon } from '@iconify/react'
import { CtaSection } from './CtaSection.jsx'
import { Footer } from './Footer.jsx'
import { SiteBackground } from './SiteBackground.jsx'

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
  '/about',
  '/it-solutions',
  '/digital-marketing',
  '/branding',
  '/packages',
  '/contact',
])

/** @param {string} pathname */
function isKnownRoute(pathname) {
  if (STATIC_ROUTES.has(pathname)) return true
  if (/^\/blogs\/[^/]+$/.test(pathname)) return true
  return false
}

/** Return false on paths that should NOT show the shared CTA above the footer. */
function shouldShowCta(pathname) {
  if (!isKnownRoute(pathname)) return false
  if (pathname === '/') return false
  if (pathname === '/contact') return false
  if (pathname === '/privacy-policy') return false
  if (pathname === '/blogs') return false
  if (pathname.startsWith('/blogs/')) return false
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
        {showCta ? <CtaSection /> : null}
        <Footer />
      </div>

      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Send us a WhatsApp message"
        title="Send us a WhatsApp message"
        className="fixed bottom-5 right-5 z-50 inline-flex h-13 w-13 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_28px_rgba(37,211,102,0.35)] transition-transform duration-200 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366] sm:bottom-6 sm:right-6"
      >
        <Icon icon="mdi:whatsapp" className="h-7 w-7" aria-hidden />
      </a>
    </div>
  )
}
