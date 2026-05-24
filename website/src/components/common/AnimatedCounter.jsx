import { useEffect, useMemo, useRef, useState } from 'react'

function parseCounterValue(value) {
  const match = String(value).match(/^(\d+(?:\.\d+)?)(.*)$/)
  if (!match) {
    return { target: null, suffix: '', isNumeric: false }
  }
  return {
    target: Number(match[1]),
    suffix: match[2],
    isNumeric: true,
  }
}

function easeOutCubic(t) {
  return 1 - (1 - t) ** 3
}

function formatCount(current, suffix) {
  return `${current}${suffix}`
}

/**
 * Counts up from zero when the element scrolls into view.
 * Non-numeric values (e.g. text) are shown as-is.
 */
function getDefaultDuration(target) {
  if (target >= 1000) return 2200
  if (target >= 100) return 2000
  return 1600
}

export function AnimatedCounter({ value, className, duration, delay = 0 }) {
  const ref = useRef(null)
  const parsed = useMemo(() => parseCounterValue(value), [value])
  const initialDisplay = parsed.isNumeric ? formatCount(0, parsed.suffix) : value
  const [display, setDisplay] = useState(initialDisplay)
  const hasAnimated = useRef(false)

  useEffect(() => {
    setDisplay(parsed.isNumeric ? formatCount(0, parsed.suffix) : value)
    hasAnimated.current = false
  }, [value, parsed.isNumeric, parsed.suffix])

  useEffect(() => {
    if (!parsed.isNumeric) {
      setDisplay(value)
      return undefined
    }

    const el = ref.current
    if (!el) return undefined

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      setDisplay(value)
      return undefined
    }

    let frameId = 0
    let timeoutId = 0

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimated.current) return
        hasAnimated.current = true
        observer.disconnect()

        const run = () => {
          const target = parsed.target
          const { suffix } = parsed
          const animDuration = duration ?? getDefaultDuration(target)
          const start = performance.now()

          const tick = (now) => {
            const progress = Math.min((now - start) / animDuration, 1)
            const current = Math.round(easeOutCubic(progress) * target)
            setDisplay(formatCount(current, suffix))
            if (progress < 1) {
              frameId = requestAnimationFrame(tick)
            }
          }

          frameId = requestAnimationFrame(tick)
        }

        if (delay > 0) {
          timeoutId = window.setTimeout(run, delay)
        } else {
          run()
        }
      },
      { threshold: 0.35, rootMargin: '0px 0px -8% 0px' },
    )

    observer.observe(el)

    return () => {
      observer.disconnect()
      cancelAnimationFrame(frameId)
      clearTimeout(timeoutId)
    }
  }, [value, duration, delay, parsed])

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  )
}
