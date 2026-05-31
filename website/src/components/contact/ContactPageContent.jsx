import { useLanguage } from '../../context/useLanguage.js'
import { getContactPageContent } from '../../content/contactPage.js'
import { ContactForm } from './ContactForm.jsx'
import { ContactMap } from './ContactMap.jsx'
import { ContactSupportCard } from './ContactSupportCard.jsx'

export function ContactPageContent() {
  const { locale } = useLanguage()
  const copy = getContactPageContent(locale)
  const isRtl = locale === 'ar'

  return (
    <section
      className="section-solid py-12 sm:py-14 lg:py-16"
      dir={isRtl ? 'rtl' : 'ltr'}
      aria-label={copy.formHeading}
    >
      <div className="site-container px-3 sm:px-15 md:px-30 lg:px-35">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(380px,500px)] lg:items-start lg:gap-12 xl:gap-14">
          <ContactForm copy={copy} locale={locale} />

          <aside data-aos={isRtl? "slide-right" : "slide-left"} className="flex flex-col gap-6 lg:sticky lg:top-20 lg:max-h-[calc(100dvh-5rem)] lg:self-start lg:overflow-y-auto xl:top-24">
            <ContactSupportCard copy={copy} locale={locale} />
            <ContactMap title={copy.mapTitle} />
          </aside>
        </div>
      </div>
    </section>
  )
}
