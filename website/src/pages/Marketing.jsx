import { Header } from '../components/layout/Header.jsx'
import { PageHeader } from '../components/layout/PageHeader.jsx'
import { SolutionPageSections } from '../components/solution/SolutionPageSections.jsx'
import { useLanguage } from '../context/useLanguage.js'
import { getPageCopy } from '../content/pages.js'

/** Hero: `pages.js` → `marketing`. Body: `pageKey="marketing"` `categorySlug="marketing"`. */
export function Marketing() {
  const { locale } = useLanguage()
  const copy = getPageCopy('marketing', locale)

  return (
    <>
      <Header />
      <PageHeader
        pageName={copy.pageName}
        title={copy.title}
        subtitle={copy.subtitle}
      />
      <SolutionPageSections pageKey="marketing" categorySlug="marketing" />
    </>
  )
}
