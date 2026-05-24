import { ContactPageContent } from '../components/contact/ContactPageContent.jsx'
import { Header } from '../components/layout/Header.jsx'
import { PageHeader } from '../components/layout/PageHeader.jsx'
import { useLanguage } from '../context/useLanguage.js'
import { getPageCopy } from '../content/pages.js'

export function Contact() {
  const { locale } = useLanguage()
  const copy = getPageCopy('contact', locale)

  return (
    <>
      <Header />
      <PageHeader
        pageName={copy.pageName}
        title={copy.title}
        subtitle={copy.subtitle}
      />
      <ContactPageContent />
    </>
  )
}
