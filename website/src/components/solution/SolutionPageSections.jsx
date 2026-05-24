/**
 * Composes the three shared body sections for IT, Marketing, and Branding pages.
 *
 * Usage in a page (after `PageHeader`):
 *   <SolutionPageSections pageKey="it" categorySlug="it" />
 *
 * - pageKey → `content/solutionPages.js` (sections 2 & 3 + services heading)
 * - categorySlug → filters API services by `category.slug` (must match DB)
 */

import { SolutionHighlightSection } from './SolutionHighlightSection.jsx'
import { SolutionMethodologySection } from './SolutionMethodologySection.jsx'
import { SolutionServicesSection } from './SolutionServicesSection.jsx'

/**
 * Shared body sections for IT, Marketing, and Branding pages.
 *
 * @param {{
 *   pageKey: 'it' | 'marketing' | 'branding',
 *   categorySlug: string,
 * }} props
 */
export function SolutionPageSections({ pageKey, categorySlug }) {
  return (
    <>
      <SolutionServicesSection pageKey={pageKey} categorySlug={categorySlug} />
      <SolutionHighlightSection pageKey={pageKey} />
      <SolutionMethodologySection pageKey={pageKey} />
    </>
  )
}
