import { useSyncExternalStore } from 'react'

function getPathname() {
  if (typeof window === 'undefined') return '/'
  return window.location.pathname || '/'
}

function subscribeToPathname(onStoreChange) {
  window.addEventListener('popstate', onStoreChange)
  window.addEventListener('hashchange', onStoreChange)
  return () => {
    window.removeEventListener('popstate', onStoreChange)
    window.removeEventListener('hashchange', onStoreChange)
  }
}

export function usePathname() {
  return useSyncExternalStore(subscribeToPathname, getPathname, () => '/')
}

import { stripLocalePrefix } from './localePath.js'

/**
 * @param {string} href Logical href e.g. `/about`
 * @param {string} pathname Full pathname e.g. `/en/about`
 */
export function isNavActive(href, pathname) {
  const p = stripLocalePrefix(pathname.replace(/\/$/, '') || '/')
  const h = (href.replace(/\/$/, '') || '/')
  if (h === '/') return p === '/' || p === ''
  return p === h || p.startsWith(`${h}/`)
}
