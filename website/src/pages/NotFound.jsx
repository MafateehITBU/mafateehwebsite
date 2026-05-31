import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Header } from '../components/layout/Header.jsx'
import { useLanguage } from '../context/useLanguage.js'
import { getNotFoundContent } from '../content/notFound.js'

const EASE = [0.22, 1, 0.36, 1]

/**
 * @param {{ reduceMotion: boolean }} props
 */
function NotFoundVisual({ reduceMotion }) {
  return (
    <div className="not-found__visual" aria-hidden>
      <motion.div
        className="not-found__ring not-found__ring--outer"
        animate={reduceMotion ? undefined : { rotate: 360 }}
        transition={{ duration: 48, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="not-found__ring not-found__ring--inner"
        animate={reduceMotion ? undefined : { rotate: -360 }}
        transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="not-found__arc"
        animate={reduceMotion ? undefined : { rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />
      <motion.span
        className="not-found__code"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        404
      </motion.span>
    </div>
  )
}

export function NotFound() {
  const { locale } = useLanguage()
  const copy = getNotFoundContent(locale)
  const reduceMotion = useReducedMotion()
  const isRtl = locale === 'ar'

  return (
    <>
      <Header />
      <section
        className="not-found section-solid relative flex min-h-[calc(100dvh-4.5rem)] items-center overflow-hidden py-16 sm:min-h-[calc(100dvh-5rem)] sm:py-20"
        dir={isRtl ? 'rtl' : 'ltr'}
        aria-labelledby="not-found-title"
      >
        <div className="not-found__glow not-found__glow--primary" aria-hidden />
        <div className="not-found__glow not-found__glow--secondary" aria-hidden />

        <div className="site-container relative z-10 flex w-full flex-col items-center text-center">
          <NotFoundVisual reduceMotion={!!reduceMotion} />

          <motion.p
            className="not-found__eyebrow mt-8 font-body text-xs font-semibold uppercase tracking-[0.2em] text-primary dark:text-secondary"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: EASE }}
          >
            {copy.code}
          </motion.p>

          <motion.h1
            id="not-found-title"
            className="mt-4 max-w-lg font-heading text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl"
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.22, ease: EASE }}
          >
            {copy.title}
          </motion.h1>

          <motion.p
            className="mt-4 max-w-md font-body text-base leading-relaxed text-foreground/80 sm:text-lg"
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.32, ease: EASE }}
          >
            {copy.message}
          </motion.p>

          <motion.p
            className="mt-2 font-body text-sm text-foreground/55"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.42, ease: EASE }}
          >
            {copy.hint}
          </motion.p>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5, ease: EASE }}
          >
            <Link
              to="/"
              className="mt-10 inline-flex min-h-11 min-w-[10.5rem] items-center justify-center rounded-lg bg-secondary px-8 py-3 font-body text-base font-semibold text-white shadow-sm transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {copy.homeLabel}
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}
