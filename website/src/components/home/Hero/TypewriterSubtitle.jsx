import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../../../context/useLanguage.js'
import { getHomeContent } from '../../../content/index.js'

const TYPING_MS = 58
const DELETING_MS = 36
const PAUSE_AFTER_TYPE_MS = 2200
const MOBILE_MAX_WIDTH = 767

function useTypewriter(text, enabled) {
  // Start with full text to avoid CLS — animation begins only once enabled resolves
  const [displayed, setDisplayed] = useState(text)
  const [phase, setPhase] = useState('done')
  const started = useRef(false)

  useEffect(() => {
    if (!enabled) {
      setDisplayed(text)
      setPhase('done')
      started.current = false
      return undefined
    }
    // Kick off typing from empty only once
    if (!started.current) {
      started.current = true
      setDisplayed('')
      setPhase('typing')
    }
  }, [text, enabled])

  useEffect(() => {
    if (!enabled || phase === 'done') return undefined

    let timeoutId

    if (phase === 'typing') {
      if (displayed.length < text.length) {
        timeoutId = setTimeout(
          () => setDisplayed(text.slice(0, displayed.length + 1)),
          TYPING_MS,
        )
      } else {
        timeoutId = setTimeout(() => setPhase('deleting'), PAUSE_AFTER_TYPE_MS)
      }
    } else if (phase === 'deleting') {
      if (displayed.length > 0) {
        timeoutId = setTimeout(
          () => setDisplayed(text.slice(0, displayed.length - 1)),
          DELETING_MS,
        )
      } else {
        timeoutId = setTimeout(() => setPhase('typing'), 280)
      }
    }

    return () => clearTimeout(timeoutId)
  }, [displayed, phase, text, enabled])

  return displayed
}

export function TypewriterSubtitle({ className = '' }) {
  const { locale } = useLanguage()
  const copy = getHomeContent(locale).hero.typewriter
  // Default true — will be corrected after mount (no CLS on first render)
  const [motionEnabled, setMotionEnabled] = useState(false)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mobile = window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH}px)`).matches
    setMotionEnabled(!reduced && !mobile)
  }, [])

  const animatedText = useTypewriter(copy.animated, motionEnabled)

  return (
    <h4
      className={`block font-body text-lg font-medium leading-snug text-secondary sm:text-xl md:text-2xl ${className}`.trim()}
    >
      <span className="text-secondary">{copy.prefix}</span>
      <span className="text-secondary">{animatedText}</span>
      {motionEnabled && (
        <span
          className="ms-0.5 inline-block w-[2px] translate-y-px animate-pulse bg-secondary align-middle"
          style={{ height: '0.85em' }}
          aria-hidden
        />
      )}
    </h4>
  )
}
