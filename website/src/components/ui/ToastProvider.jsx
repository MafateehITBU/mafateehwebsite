import { Toaster } from 'sonner'
import { useLanguage } from '../../context/useLanguage.js'
import { useTheme } from '../../context/useTheme.js'

export function ToastProvider() {
  const { locale } = useLanguage()
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <Toaster
      richColors
      expand
      position={locale === 'ar' ? 'top-left' : 'top-right'}
      toastOptions={{
        className: 'site-toast',
        style: {
          borderRadius: '0.75rem',
          border: `1px solid ${isDark ? 'color-mix(in srgb, var(--color-line) 80%, transparent)' : 'var(--color-line)'}`,
          background: isDark ? 'var(--color-card)' : '#ffffff',
          color: 'var(--color-foreground)',
          fontFamily: 'var(--font-body)',
          fontSize: '0.875rem',
        },
      }}
    />
  )
}
