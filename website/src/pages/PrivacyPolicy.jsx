import { useEffect, useState } from 'react'
import api from '../axiosConfig.js'
import { Header } from '../components/layout/Header.jsx'
import { RichHtmlContent } from '../components/common/RichHtmlContent.jsx'
import { useLanguage } from '../context/useLanguage.js'
import { getFooterContent } from '../content/footer.js'

/**
 * @param {'en' | 'ar'} locale
 * @param {string | null | undefined} en
 * @param {string | null | undefined} ar
 */
function pickLocalized(locale, en, ar) {
  if (locale === 'ar' && ar && String(ar).trim()) return ar
  return en ?? ''
}

export function PrivacyPolicy() {
  const { locale } = useLanguage()
  const privacyNav = getFooterContent(locale).nav.find((item) => item.key === 'privacy')
  const [policy, setPolicy] = useState(/** @type {Record<string, unknown> | null} */ (null))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    api
      .get('/public/privacy-policy')
      .then((res) => {
        if (!cancelled) setPolicy(res.data)
      })
      .catch(() => {
        if (!cancelled) setPolicy(null)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const bodyHtml = policy
    ? pickLocalized(locale, String(policy.content ?? ''), String(policy.contentAr ?? ''))
    : ''
  const isRtl = locale === 'ar'

  return (
    <>
      <Header />
      <main
        className="section-solid site-container min-h-[50vh] px-10 py-12 sm:px-15 sm:py-16 md:px-30 lg:px-35"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {loading ? (
          <p className={`font-body text-foreground/70 ${isRtl ? 'text-right' : 'text-left'}`}>
            {locale === 'ar' ? 'جاري التحميل…' : 'Loading…'}
          </p>
        ) : null}

        {!loading && bodyHtml ? (
          <RichHtmlContent
            html={bodyHtml}
            extended
            dir={isRtl ? 'rtl' : 'ltr'}
            className={[
              'privacy-policy-body w-full max-w-3xl font-body text-base leading-relaxed text-foreground/90 sm:text-lg',
              isRtl ? 'ms-auto text-right' : 'text-left',
            ].join(' ')}
          />
        ) : null}

        {!loading && !bodyHtml ? (
          <div className={['w-full max-w-3xl', isRtl ? 'ms-auto text-right' : 'text-left'].join(' ')}>
            <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
              {privacyNav?.label ?? 'Privacy Policy'}
            </h1>
            <p className="mt-6 font-body text-foreground/70">
              {locale === 'ar'
                ? 'سيتم عرض سياسة الخصوصية هنا قريباً.'
                : 'Privacy policy content will appear here soon.'}
            </p>
          </div>
        ) : null}
      </main>
    </>
  )
}
