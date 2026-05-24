import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useLanguage } from '../../context/useLanguage.js'

/** Scrolls the window to the top on route changes, language changes, and page refresh. */
export function ScrollToTop() {
  const { pathname } = useLocation()
  const { locale } = useLanguage()

  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname, locale])

  return null
}
