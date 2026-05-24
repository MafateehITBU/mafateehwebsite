import { BlogsPageContent } from '../components/blogs/BlogsPageContent.jsx'
import { Header } from '../components/layout/Header.jsx'
import { PageHeader } from '../components/layout/PageHeader.jsx'
import { useLanguage } from '../context/useLanguage.js'
import { getPageCopy } from '../content/pages.js'

export function Blogs() {
  const { locale } = useLanguage()
  const copy = getPageCopy('blogs', locale)

  return (
    <>
      <Header />
      <PageHeader
        pageName={copy.pageName}
        title={copy.title}
        subtitle={copy.subtitle}
      />
      <BlogsPageContent />
    </>
  )
}
