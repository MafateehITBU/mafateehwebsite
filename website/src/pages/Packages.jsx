import { Header } from '../components/layout/Header.jsx'
import { PageHeader } from '../components/layout/PageHeader.jsx'
import { useLanguage } from '../context/useLanguage.js'
import { getPageCopy } from '../content/pages.js'
import { PricingSection } from '../components/home/Pricing/PricingSection.jsx'

/** About page */
export function Packages() {
  const { locale } = useLanguage()
  const copy = getPageCopy('packages', locale)

  return (
    <>
      <Header />
      <PageHeader
        pageName={copy.pageName}
        title={copy.title}
        subtitle={copy.subtitle}
      />
      
      <PricingSection />

    </>
  )
}
