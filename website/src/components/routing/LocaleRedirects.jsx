import { Navigate, useParams } from 'react-router-dom'
import { useLanguage } from '../../context/useLanguage.js'
import { localizedPath } from '../../utils/localePath.js'

/** @param {{ to: string }} props Logical path e.g. `/about` */
export function LegacyLocaleRedirect({ to }) {
  const { locale } = useLanguage()
  return <Navigate to={localizedPath(to, locale)} replace />
}

export function RootLocaleRedirect() {
  const { locale } = useLanguage()
  return <Navigate to={`/${locale}`} replace />
}

/** @param {{ suffix?: string }} props */
export function BlogLegacyRedirect({ suffix = '' }) {
  const { locale } = useLanguage()
  return <Navigate to={localizedPath(`/blogs${suffix}`, locale)} replace />
}

export function BlogSlugLegacyRedirect() {
  const { locale } = useLanguage()
  const { slug } = useParams()
  const safeSlug = typeof slug === 'string' ? slug : ''
  return <Navigate to={localizedPath(`/blogs/${safeSlug}`, locale)} replace />
}
