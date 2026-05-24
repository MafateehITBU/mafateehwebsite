import { useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { ThemeContext } from './themeContext.js'

const STORAGE_KEY = 'mafateeh-theme'

function getInitialTheme() {
  if (typeof window === 'undefined') return 'light'
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(getInitialTheme)

  useLayoutEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  // Enable color transitions after mount (avoids animating initial load)
  useEffect(() => {
    const root = document.documentElement
    const frame = requestAnimationFrame(() => {
      root.classList.add('theme-transition')
    })
    return () => cancelAnimationFrame(frame)
  }, [])

  const value = useMemo(
    () => ({
      theme,
      setTheme: setThemeState,
      toggleTheme: () =>
        setThemeState((t) => (t === 'dark' ? 'light' : 'dark')),
    }),
    [theme],
  )

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  )
}
