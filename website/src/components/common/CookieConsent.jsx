import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/useLanguage.js'
import { useLocalizedPath } from '../../hooks/useLocalizedPath.js'

const STORAGE_KEY = 'mafateeh-cookie-consent'

/** @returns {'accepted' | 'rejected' | null} */
export function readCookieConsent() {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    if (value === 'accepted' || value === 'rejected') return value
  } catch (_) {}
  return null
}

/** @param {'accepted' | 'rejected'} value */
export function writeCookieConsent(value) {
  try {
    localStorage.setItem(STORAGE_KEY, value)
  } catch (_) {}
  window.dispatchEvent(new CustomEvent('mafateeh-cookie-consent', { detail: value }))
}

const COPY = {
  en: {
    title: 'We use cookies',
    body: 'We use essential cookies to run the site and optional analytics cookies (Google Analytics) to understand traffic. You can accept or reject analytics cookies.',
    accept: 'Accept all',
    reject: 'Reject analytics',
    policy: 'Cookie policy',
  },
  ar: {
    title: 'نستخدم ملفات تعريف الارتباط',
    body: 'نستخدم ملفات تعريف الارتباط الأساسية لتشغيل الموقع وملفات تحليلات اختيارية (Google Analytics) لفهم الزيارات. يمكنك قبول أو رفض ملفات التحليلات.',
    accept: 'قبول الكل',
    reject: 'رفض التحليلات',
    policy: 'سياسة ملفات تعريف الارتباط',
  },
}

export function CookieConsent() {
  const { locale } = useLanguage()
  const localizedPath = useLocalizedPath()
  const copy = locale === 'ar' ? COPY.ar : COPY.en
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(readCookieConsent() === null)
  }, [])

  if (!visible) return null

  const close = (choice) => {
    writeCookieConsent(choice)
    setVisible(false)
  }

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-line bg-background/95 p-4 shadow-lg backdrop-blur-md sm:p-5"
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-desc"
    >
      <div className="site-container flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-3xl">
          <p id="cookie-consent-title" className="font-heading text-base font-semibold text-foreground">
            {copy.title}
          </p>
          <p id="cookie-consent-desc" className="mt-2 font-body text-sm leading-relaxed text-foreground/80">
            {copy.body}{' '}
            <Link
              to={localizedPath('/cookie-policy')}
              className="font-medium text-primary underline-offset-2 hover:underline dark:text-secondary"
            >
              {copy.policy}
            </Link>
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">
          <button
            type="button"
            className="rounded-lg border border-line px-4 py-2 font-body text-sm font-medium text-foreground transition hover:bg-foreground/5"
            onClick={() => close('rejected')}
          >
            {copy.reject}
          </button>
          <button
            type="button"
            className="rounded-lg bg-primary px-4 py-2 font-body text-sm font-semibold text-white transition hover:brightness-110 dark:bg-secondary dark:text-foreground"
            onClick={() => close('accepted')}
          >
            {copy.accept}
          </button>
        </div>
      </div>
    </div>
  )
}
