import { Header } from '../components/layout/Header.jsx'
import { PageHeader } from '../components/layout/PageHeader.jsx'
import { SolutionPageSections } from '../components/solution/SolutionPageSections.jsx'
import { useLanguage } from '../context/useLanguage.js'
import { getPageCopy } from '../content/pages.js'

/** Hero: `pages.js` → `it`. Body sections: `pageKey="it"` `categorySlug="it"`. */
export function IT() {
  const { locale } = useLanguage()
  const copy = getPageCopy('it', locale)

  return (
    <>
      <Header />
      <PageHeader
        pageName={copy.pageName}
        title={copy.title}
        subtitle={copy.subtitle}
      />
      <SolutionPageSections pageKey="it" categorySlug="it" />
    </>
  )
}
