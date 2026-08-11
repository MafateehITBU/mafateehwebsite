import { useEffect } from 'react'
import { Navigate, Outlet, useParams } from 'react-router-dom'
import { useLanguage } from '../../context/useLanguage.js'
import { DEFAULT_LOCALE, LOCALES } from '../../utils/localePath.js'

export function LocaleLayout() {
  const { locale: urlLocale } = useParams()
  const { locale, setLocale } = useLanguage()

  useEffect(() => {
    if (
      (urlLocale === 'en' || urlLocale === 'ar') &&
      urlLocale !== locale
    ) {
      setLocale(urlLocale)
    }
  }, [urlLocale, locale, setLocale])

  if (!urlLocale || !LOCALES.includes(urlLocale)) {
    return <Navigate to={`/${DEFAULT_LOCALE}`} replace />
  }

  return <Outlet />
}
