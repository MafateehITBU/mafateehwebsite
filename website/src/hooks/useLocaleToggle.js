import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/useLanguage.js'
import { localizedPath, stripLocalePrefix } from '../utils/localePath.js'

export function useLocaleToggle() {
  const { locale, setLocale } = useLanguage()
  const navigate = useNavigate()
  const location = useLocation()

  return useCallback(() => {
    const next = locale === 'ar' ? 'en' : 'ar'
    const logical = stripLocalePrefix(location.pathname)
    setLocale(next)
    navigate(
      `${localizedPath(logical, next)}${location.search}${location.hash}`,
      { replace: false },
    )
  }, [locale, setLocale, navigate, location])
}
