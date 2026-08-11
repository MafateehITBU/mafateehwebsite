import { Link } from 'react-router-dom'
import { getPageHeaderContent } from '../../content/pageHeader.js'
import { useLanguage } from '../../context/useLanguage.js'
import { useLocalizedPath } from '../../hooks/useLocalizedPath.js'

/**
 * Inner page hero — NOT `section-solid` (site decor shows through).
 *
 * Pass localized strings from `getPageCopy()` in `content/pages.js`:
 *   pageName — breadcrumb current page (e.g. "About Us")
 *   title    — main H1
 *   subtitle — optional paragraph under H1
 *
 * "Home" breadcrumb label → `content/pageHeader.js`
 */

/**
 * @param {{
 *   pageName: string,
 *   title: string,
 *   subtitle?: string,
 *   homeHref?: string,
 * }} props
 */
export function PageHeader({ pageName, title, subtitle, homeHref }) {
  const { locale } = useLanguage()
  const localizedPath = useLocalizedPath()
  const { home } = getPageHeaderContent(locale)
  const resolvedHomeHref = homeHref ?? localizedPath('/')
  const isRtl = locale === 'ar'

  return (
    <header
      className="relative py-12 text-center text-white sm:py-14 lg:py-16"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="site-container flex flex-col items-center gap-4 sm:gap-5">
        <nav aria-label={isRtl ? 'مسار التنقل' : 'Breadcrumb'}>
          <ol className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 font-body text-sm text-white/85 sm:text-base">
            <li>
              <Link
                to={resolvedHomeHref}
                className="transition-colors hover:text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
              >
                {home}
              </Link>
            </li>
            <li aria-hidden className="text-white/55">
              &gt;
            </li>
            <li aria-current="page" className="font-medium text-white">
              {pageName}
            </li>
          </ol>
        </nav>

        <h1 className="max-w-4xl font-heading text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-[2.5rem]">
          {title}
        </h1>

        {subtitle ? (
          <p className="max-w-2xl font-body text-base leading-relaxed text-white/90 sm:text-lg">
            {subtitle}
          </p>
        ) : null}
      </div>
    </header>
  )
}
