import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { LanguageContext } from './languageContext.js'

const STORAGE_KEY = 'mafateeh-locale'
const LOCALE_FADE_MS = 280

/** @returns {'en' | 'ar'} */
function readStoredLocale() {
  if (typeof window === 'undefined') return 'en'
  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw === 'ar' || raw === 'en') return raw
  const nav = navigator.language || ''
  return nav.toLowerCase().startsWith('ar') ? 'ar' : 'en'
}

function prefersReducedMotion() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function LanguageProvider({ children }) {
  const [locale, setLocaleState] = useState(readStoredLocale)
  const [contentVisible, setContentVisible] = useState(true)
  const timeoutRef = useRef(/** @type {ReturnType<typeof setTimeout> | null} */ (null))

  useLayoutEffect(() => {
    const root = document.documentElement
    root.lang = locale === 'ar' ? 'ar' : 'en'
    root.dir = locale === 'ar' ? 'rtl' : 'ltr'
    localStorage.setItem(STORAGE_KEY, locale)
  }, [locale])

  useEffect(() => {
    const root = document.documentElement
    const frame = requestAnimationFrame(() => {
      root.classList.add('locale-transition')
    })
    return () => cancelAnimationFrame(frame)
  }, [])

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    },
    [],
  )

  const setLocale = useCallback(
    /** @param {'en' | 'ar' | ((prev: 'en' | 'ar') => 'en' | 'ar')} next */
    (next) => {
      const resolved =
        typeof next === 'function' ? next(locale) : next
      if (resolved !== 'en' && resolved !== 'ar') return
      if (resolved === locale) return

      if (timeoutRef.current) clearTimeout(timeoutRef.current)

      if (prefersReducedMotion()) {
        setLocaleState(resolved)
        setContentVisible(true)
        return
      }

      setContentVisible(false)
      timeoutRef.current = setTimeout(() => {
        setLocaleState(resolved)
        requestAnimationFrame(() => {
          setContentVisible(true)
        })
      }, LOCALE_FADE_MS)
    },
    [locale],
  )

  const toggleLocale = useCallback(() => {
    setLocale(locale === 'ar' ? 'en' : 'ar')
  }, [locale, setLocale])

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      toggleLocale,
      isLocaleSwitching: !contentVisible,
    }),
    [locale, setLocale, toggleLocale, contentVisible],
  )

  return (
    <LanguageContext.Provider value={value}>
      <div
        className={[
          'locale-transition-root flex min-h-dvh flex-col',
          contentVisible ? 'locale-transition-root--visible' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {children}
      </div>
    </LanguageContext.Provider>
  )
}
