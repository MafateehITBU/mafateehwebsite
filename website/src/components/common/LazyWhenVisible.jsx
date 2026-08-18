import { useEffect, useRef, useState } from 'react'

/**
 * Renders children only when the placeholder enters (or nears) the viewport.
 * Defers below-fold JS/CSS chunks without changing layout once mounted.
 */
export function LazyWhenVisible({
  children,
  rootMargin = '320px 0px',
  minHeight = '1px',
  className = '',
}) {
  const ref = useRef(/** @type {HTMLDivElement | null} */ (null))
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!visible && node) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) {
            setVisible(true)
            observer.disconnect()
          }
        },
        { rootMargin },
      )
      observer.observe(node)
      return () => observer.disconnect()
    }
    return undefined
  }, [rootMargin, visible])

  return (
    <div
      ref={ref}
      className={className}
      style={visible ? undefined : { minHeight }}
    >
      {visible ? children : null}
    </div>
  )
}
