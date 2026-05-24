import { Header } from '../components/layout/Header.jsx'
import { PageHeader } from '../components/layout/PageHeader.jsx'
import { SolutionPageSections } from '../components/solution/SolutionPageSections.jsx'
import { useLanguage } from '../context/useLanguage.js'
import { getPageCopy } from '../content/pages.js'

/** Hero copy: `pages.js` → `branding`. Body: `SolutionPageSections` + `solutionPages.js` + API slug `branding`. */
export function Branding() {
  const { locale } = useLanguage()
  const copy = getPageCopy('branding', locale)

  return (
    <>
      <Header />
      <PageHeader
        pageName={copy.pageName}
        title={copy.title}
        subtitle={copy.subtitle}
      />
      <SolutionPageSections pageKey="branding" categorySlug="branding" />
    </>
  )
}
