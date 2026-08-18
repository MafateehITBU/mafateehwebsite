import { useEffect } from 'react'

const AOS_MIN_WIDTH = 1024

/** Load AOS only on desktop — mobile disables it but should not download the library or CSS. */
export function useAosInit() {
  useEffect(() => {
    if (typeof window === 'undefined' || window.innerWidth < AOS_MIN_WIDTH) {
      return undefined
    }

    let cancelled = false
    let refresh = () => {}

    Promise.all([import('aos'), import('aos/dist/aos.css')]).then(([aosMod]) => {
      if (cancelled) return
      const AOS = aosMod.default
      AOS.init({
        duration: 700,
        once: true,
        easing: 'ease-out',
      })
      refresh = () => AOS.refresh()
      window.addEventListener('resize', refresh)
    })

    return () => {
      cancelled = true
      window.removeEventListener('resize', refresh)
    }
  }, [])
}
