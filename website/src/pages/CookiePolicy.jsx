import { Header } from '../components/layout/Header.jsx'
import { RichHtmlContent } from '../components/common/RichHtmlContent.jsx'
import { useLanguage } from '../context/useLanguage.js'
import { getCookiePolicyContent } from '../content/cookiePolicy.js'

export function CookiePolicy() {
  const { locale } = useLanguage()
  const copy = getCookiePolicyContent(locale)
  const isRtl = locale === 'ar'

  return (
    <>
      <Header />
      <main
        className={[
          'section-solid site-container min-h-[50vh] px-10 py-12 sm:px-15 sm:py-16 md:px-30 lg:px-35',
          isRtl ? 'text-right' : 'text-left',
        ].join(' ')}
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
          {copy.title}
        </h1>
        <RichHtmlContent
          html={copy.html}
          extended
          dir={isRtl ? 'rtl' : 'ltr'}
          className="privacy-policy-body mt-8 w-full max-w-3xl font-body text-base leading-relaxed text-foreground/90 sm:text-lg"
        />
      </main>
    </>
  )
}
