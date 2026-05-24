import { useEffect, useState } from 'react'
import { useLanguage } from '../../../context/useLanguage.js'
import { getHomeContent } from '../../../content/index.js'

const TYPING_MS = 58
const DELETING_MS = 36
const PAUSE_AFTER_TYPE_MS = 2200

function useTypewriter(text, enabled) {
  const [displayed, setDisplayed] = useState('')
  const [phase, setPhase] = useState('typing')

  useEffect(() => {
    if (!enabled) {
      setDisplayed(text)
      setPhase('typing')
      return undefined
    }

    setDisplayed('')
    setPhase('typing')
  }, [text, enabled])

  useEffect(() => {
    if (!enabled) return undefined

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
  const [motionEnabled, setMotionEnabled] = useState(true)

  useEffect(() => {
    setMotionEnabled(
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    )
  }, [])

  const animatedText = useTypewriter(copy.animated, motionEnabled)

  return (
    <h4
      className={`block font-body text-lg font-medium leading-snug text-secondary sm:text-xl md:text-2xl ${className}`.trim()}
    >
      <span className="text-secondary">{copy.prefix}</span>
      <span className="text-secondary">{animatedText}</span>
      <span
        className="ms-0.5 inline-block w-[2px] translate-y-px animate-pulse bg-secondary align-middle"
        style={{ height: '0.85em' }}
        aria-hidden
      />
    </h4>
  )
}
