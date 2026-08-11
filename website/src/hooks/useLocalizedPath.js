import { useCallback } from 'react'
import { useLanguage } from '../context/useLanguage.js'
import { localizedPath } from '../utils/localePath.js'

export function useLocalizedPath() {
  const { locale } = useLanguage()
  return useCallback(
    /** @param {string} path */
    (path) => localizedPath(path, locale),
    [locale],
  )
}
