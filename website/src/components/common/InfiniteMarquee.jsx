import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'

const MarqueeGroup = forwardRef(
  /**
   * @param {{
   *   children: import('react').ReactNode,
   *   copyId: string,
   *   className?: string,
   * } & import('react').HTMLAttributes<HTMLDivElement>} props
   * @param {import('react').Ref<HTMLDivElement>} ref
   */
  function MarqueeGroup({ children, copyId, className = '', ...rest }, ref) {
    return (
      <div ref={ref} className={className} {...rest}>
        {Children.map(children, (child, index) => {
          if (!isValidElement(child)) return child
          const baseKey =
            child.key != null && String(child.key) !== ''
              ? String(child.key)
              : `marquee-item-${index}`
          return cloneElement(child, { key: `${baseKey}-${copyId}` })
        })}
      </div>
    )
  },
)

/**
 * Seamless infinite marquee: two identical groups + measured pixel offset (no % seam gaps).
 *
 * @param {{
 *   children: import('react').ReactNode,
 *   className?: string,
 *   groupClassName?: string,
 *   duration?: number,
 *   direction?: 'rtl' | 'ltr',
 *   loopGapClassName?: string,
 * }} props
 */
export function InfiniteMarquee({
  children,
  className = '',
  groupClassName = 'flex shrink-0 items-center gap-4 sm:gap-5',
  duration = 45,
  direction = 'rtl',
  loopGapClassName = 'w-5 shrink-0 sm:w-8',
}) {
  const groupRef = useRef(/** @type {HTMLDivElement | null} */ (null))
  const gapRef = useRef(/** @type {HTMLDivElement | null} */ (null))
  const [shiftPx, setShiftPx] = useState(0)

  useLayoutEffect(() => {
    const group = groupRef.current
    const gap = gapRef.current
    if (!group || !gap) return undefined

    const measure = () => {
      const groupWidth = Math.ceil(group.getBoundingClientRect().width)
      const gapWidth = Math.ceil(gap.getBoundingClientRect().width)
      const total = groupWidth + gapWidth
      setShiftPx(total > 0 ? total : 0)
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(group)
    observer.observe(gap)
    window.addEventListener('resize', measure)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [children, loopGapClassName])

  const ready = shiftPx > 0
  const trackStyle = ready
    ? {
        ['--marquee-shift']: `${shiftPx}px`,
        ['--marquee-duration']: `${duration}s`,
      }
    : undefined

  return (
    <div
      dir="ltr"
      className={['w-full overflow-hidden touch-pan-y', className].filter(Boolean).join(' ')}
    >
      <div
        className={[
          'infinite-marquee-track flex w-max flex-nowrap',
          direction === 'rtl' ? 'infinite-marquee-track--rtl' : 'infinite-marquee-track--ltr',
          ready ? 'infinite-marquee-track--running' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        style={trackStyle}
      >
        <MarqueeGroup ref={groupRef} copyId="a" className={groupClassName}>
          {children}
        </MarqueeGroup>
        <div ref={gapRef} className={loopGapClassName} aria-hidden />
        <MarqueeGroup copyId="b" className={groupClassName} aria-hidden>
          {children}
        </MarqueeGroup>
      </div>
    </div>
  )
}
