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

/**
 * @param {string} href
 * @param {string} pathname
 */
export function isNavActive(href, pathname) {
  const p = pathname.replace(/\/$/, '') || '/'
  const h = href.replace(/\/$/, '') || '/'
  if (h === '/') return p === '/' || p === ''
  return p === h || p.startsWith(`${h}/`)
}
