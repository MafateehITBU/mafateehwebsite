import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLocalizedPath } from '../../../hooks/useLocalizedPath.js'

const DOT_COUNT = 14
/** Golden focal ring radius in SVG units (viewBox 1000×1000). */
const FOCAL_RING_R = 128
/** Focal graphic width vs orbit radius — golden frame on the orbit path. */
const FOCAL_SIZE_ORBIT_RATIO = 2.3
/** Orbit path radius from viewport size (px). */
const ORBIT_RADIUS_MIN = 195
const ORBIT_RADIUS_MAX = 340
const ORBIT_SIZE_RATIO = 0.58
const SPIN_MS = 20000
const SVG_C = 500
/** Active “window” on the orbit (3 o’clock from hub at left edge). */
const ACTIVE_SLOT_DEG = 0
/** Service is inside the golden frame (degrees from active slot). */
const FRAME_PASS_DEG = 11
/** Fade band as the label approaches / leaves the frame. */
const FRAME_APPROACH_DEG = 20
const UPPER_FILL_DURATION_S = 4
const LOWER_FILL_DURATION_S = 5.25
const LOWER_FILL_DELAY_S = 0.45

const UPPER_ARC_D = `M ${SVG_C - FOCAL_RING_R} ${SVG_C} A ${FOCAL_RING_R} ${FOCAL_RING_R} 0 0 1 ${SVG_C + FOCAL_RING_R} ${SVG_C}`
const LOWER_ARC_D = `M ${SVG_C - FOCAL_RING_R} ${SVG_C} A ${FOCAL_RING_R} ${FOCAL_RING_R} 0 0 0 ${SVG_C + FOCAL_RING_R} ${SVG_C}`
const LOWER_ARC_LENGTH = Math.PI * FOCAL_RING_R

/**
 * @param {{
 *   cx: number
 *   cy: number
 *   fillIndex: number
 *   total: number
 *   progress: import('framer-motion').MotionValue<number>
 *   reduceMotion: boolean
 * }} props
 */
function FocalUpperDot({ cx, cy, fillIndex, total, progress, reduceMotion }) {
  const opacity = useTransform(progress, (p) => {
    if (reduceMotion) return 1
    const slot = fillIndex / (total - 1)
    const fade = 0.12
    if (p <= slot - fade) return 0
    if (p >= slot) return 1
    return (p - (slot - fade)) / fade
  })
  const scale = useTransform(progress, (p) => {
    if (reduceMotion) return 1
    const slot = fillIndex / (total - 1)
    return p >= slot - 0.05 ? 1 : 0.45
  })

  return (
    <motion.circle
      cx={cx}
      cy={cy}
      r={7.5}
      className="capabilities-orbit__focal-dot"
      style={{
        opacity,
        scale,
        transformOrigin: `${cx}px ${cy}px`,
      }}
    />
  )
}

/**
 * @param {{
 *   progress: import('framer-motion').MotionValue<number>
 *   reduceMotion: boolean
 * }} props
 */
function FocalLowerArc({ progress, reduceMotion }) {
  const strokeDashoffset = useTransform(progress, (p) =>
    reduceMotion ? 0 : LOWER_ARC_LENGTH * (1 - p),
  )

  return (
    <motion.path
      d={LOWER_ARC_D}
      fill="none"
      className="capabilities-orbit__focal-arc"
      strokeWidth={20}
      strokeLinecap="round"
      strokeDasharray={LOWER_ARC_LENGTH}
      style={{ strokeDashoffset }}
    />
  )
}

/**
 * @param {{ reduceMotion: boolean; sizePx: number }} props
 */
function OmcFocalGraphic({ reduceMotion, sizePx }) {
  const upperProgress = useMotionValue(reduceMotion ? 1 : 0)
  const lowerProgress = useMotionValue(reduceMotion ? 1 : 0)

  const dots = useMemo(() => {
    return Array.from({ length: DOT_COUNT + 1 }, (_, i) => {
      const t = i / DOT_COUNT
      const angle = Math.PI + t * Math.PI
      return {
        cx: SVG_C + FOCAL_RING_R * Math.cos(angle),
        cy: SVG_C + FOCAL_RING_R * Math.sin(angle),
        fillIndex: i,
        key: i,
      }
    })
  }, [])

  useEffect(() => {
    if (reduceMotion) return

    upperProgress.set(0)
    lowerProgress.set(0)

    const upperLoop = animate(upperProgress, [0, 1, 0], {
      duration: UPPER_FILL_DURATION_S,
      repeat: Infinity,
      ease: 'easeInOut',
    })
    const lowerLoop = animate(lowerProgress, [0, 1, 0], {
      duration: LOWER_FILL_DURATION_S,
      repeat: Infinity,
      ease: 'easeInOut',
      delay: LOWER_FILL_DELAY_S,
    })

    return () => {
      upperLoop.stop()
      lowerLoop.stop()
    }
  }, [reduceMotion, upperProgress, lowerProgress])

  return (
    <div
      className="capabilities-orbit__focal-graphic"
      style={{ width: sizePx, height: sizePx }}
      aria-hidden
    >
      <svg className="capabilities-orbit__focal-svg" viewBox="0 0 1000 1000">
        <circle
          cx={SVG_C}
          cy={SVG_C}
          r={FOCAL_RING_R}
          fill="none"
          className="capabilities-orbit__focal-outline"
          strokeWidth="1"
        />

        <path
          d={UPPER_ARC_D}
          fill="none"
          className="capabilities-orbit__focal-upper-track"
          strokeWidth="1.5"
        />

        <path
          d={LOWER_ARC_D}
          fill="none"
          className="capabilities-orbit__focal-lower-track"
          strokeWidth={20}
          strokeLinecap="round"
          aria-hidden
        />

        <FocalLowerArc progress={lowerProgress} reduceMotion={reduceMotion} />

        {dots.map((d) => (
          <FocalUpperDot
            key={d.key}
            cx={d.cx}
            cy={d.cy}
            fillIndex={d.fillIndex}
            total={DOT_COUNT + 1}
            progress={upperProgress}
            reduceMotion={reduceMotion}
          />
        ))}
      </svg>
    </div>
  )
}

/**
 * @param {number} deg
 */
function normDeg(deg) {
  return ((deg % 360) + 360) % 360
}

/**
 * @param {number} a
 * @param {number} b
 */
function angleDistance(a, b) {
  const d = Math.abs(normDeg(a - b))
  return d > 180 ? 360 - d : d
}

/**
 * Diameter (px) for each service node so circles pack along the orbit path.
 * @param {number} orbitRadius
 * @param {number} count
 */
function serviceCircleDiameter(orbitRadius, count) {
  if (count <= 0) return 56
  const chord = 2 * orbitRadius * Math.sin(Math.PI / count)
  return Math.round(Math.min(220, Math.max(52, chord * 0.94)))
}

/**
 * @param {string} label
 */
function splitCapabilityLabel(label) {
  return label
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

/**
 * @param {string} label
 */
function CapabilityOrbitLabel({ label }) {
  const lines = splitCapabilityLabel(label)

  if (lines.length <= 1) {
    return lines[0] ?? label
  }

  return (
    <>
      <span className="capabilities-orbit__orbit-label-tag">{lines[0]}</span>
      <span className="capabilities-orbit__orbit-label-sub">{lines[1]}</span>
    </>
  )
}

/**
 * @param {{ items: { label: string; href: string }[]; ariaLabel?: string; textRtl?: boolean }} props
 */
export function ConnectedCapabilitiesOrbit({
  items,
  ariaLabel = 'Capabilities',
  textRtl = false,
}) {
  const localizedPath = useLocalizedPath()
  const reduceMotion = useReducedMotion()
  const viewportRef = useRef(/** @type {HTMLDivElement | null} */ (null))
  const [orbitRadius, setOrbitRadius] = useState(280)
  const [rotation, setRotation] = useState(0)

  const activeSlot = ACTIVE_SLOT_DEG
  const labelDir = textRtl ? 'rtl' : 'ltr'
  /** Golden frame centered on the orbit path at the active window (3 o’clock). */
  const focalOffset = orbitRadius
  const focalGraphicSize = Math.round(orbitRadius * FOCAL_SIZE_ORBIT_RATIO)

  useEffect(() => {
    const el = viewportRef.current
    if (!el) return

    const update = () => {
      const h = el.offsetHeight || 460
      const w = el.offsetWidth || 360
      const size = Math.min(h, w)
      setOrbitRadius(
        Math.min(ORBIT_RADIUS_MAX, Math.max(ORBIT_RADIUS_MIN, size * ORBIT_SIZE_RATIO)),
      )
    }

    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (reduceMotion) return

    let start = performance.now()
    let frame = 0

    const tick = (now) => {
      const elapsed = now - start
      const deg = (elapsed / SPIN_MS) * 360
      setRotation(deg)
      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [reduceMotion, items.length, activeSlot])

  const hubSize = orbitRadius * 2
  const serviceCircleSize = useMemo(
    () => serviceCircleDiameter(orbitRadius, items.length),
    [orbitRadius, items.length],
  )

  const orbitNodes = useMemo(() => {
    const count = items.length
    return items.map((item, index) => {
      const base = (360 / count) * index
      const current = normDeg(base + rotation)
      const dist = angleDistance(current, activeSlot)
      const inFrame = dist < FRAME_PASS_DEG

      const rad = (current * Math.PI) / 180
      const x = Math.cos(rad) * orbitRadius
      const y = Math.sin(rad) * orbitRadius

      let opacity = 1

      if (inFrame) {
        opacity = 1
      } else if (dist < FRAME_APPROACH_DEG) {
        const t = (dist - FRAME_PASS_DEG) / (FRAME_APPROACH_DEG - FRAME_PASS_DEG)
        opacity = 0.45 + (1 - t) * 0.55
      } else {
        opacity = 0.35 + (1 - Math.min(dist, 85) / 85) * 0.5
      }

      return { item, index, x, y, opacity, inFrame, dist }
    })
  }, [items, rotation, orbitRadius, activeSlot])

  const passingItem = useMemo(() => {
    const inFrameNode = orbitNodes.find((n) => n.inFrame)
    if (inFrameNode) return inFrameNode.item
    let best = items[0]
    let bestDist = Infinity
    for (const node of orbitNodes) {
      if (node.dist < bestDist) {
        bestDist = node.dist
        best = node.item
      }
    }
    return best
  }, [orbitNodes, items])

  const shouldSpin = !reduceMotion

  return (
    <div
      className="capabilities-orbit"
      dir="ltr"
      role="navigation"
      aria-label={ariaLabel}
    >
      <div ref={viewportRef} className="capabilities-orbit__viewport">
        <div className="capabilities-orbit__hub-clip">
          <motion.div
            className="capabilities-orbit__hub"
            style={{ width: hubSize, height: hubSize }}
            initial={
              reduceMotion
                ? false
                : { opacity: 0, scale: 0.94 }
            }
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
          <div
            className="capabilities-orbit__outer-ring"
            style={{ width: hubSize, height: hubSize }}
            aria-hidden
          />

          <div
            className={[
              'capabilities-orbit__track',
              shouldSpin ? 'capabilities-orbit__track--spinning' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            aria-hidden={false}
          >
            {orbitNodes.map(({ item, index, x, y, opacity, inFrame }) => (
              <div
                key={`${index}-${item.href}`}
                className={[
                  'capabilities-orbit__item-slot',
                  inFrame ? 'capabilities-orbit__item-slot--in-frame' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                style={{
                  width: serviceCircleSize,
                  height: serviceCircleSize,
                  transform: `translate(${x}px, ${y}px) translate(-50%, -50%)`,
                }}
              >
                <div
                  className={[
                    'capabilities-orbit__service-node',
                    inFrame ? 'capabilities-orbit__service-node--in-frame' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  style={{ opacity }}
                >
                  {inFrame ? (
                    <Link
                      to={localizedPath(item.href)}
                      className="capabilities-orbit__orbit-label capabilities-orbit__orbit-label--in-frame"
                      dir={labelDir}
                      lang={textRtl ? 'ar' : undefined}
                    >
                      <CapabilityOrbitLabel label={item.label} />
                    </Link>
                  ) : (
                    <span
                      className="capabilities-orbit__orbit-label"
                      dir={labelDir}
                      lang={textRtl ? 'ar' : undefined}
                    >
                      <CapabilityOrbitLabel label={item.label} />
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div
            className="capabilities-orbit__focal-anchor"
            style={{
              transform: `translate(calc(-50% + ${focalOffset}px), -50%)`,
            }}
          >
            <OmcFocalGraphic
              reduceMotion={!!reduceMotion}
              sizePx={focalGraphicSize}
            />
          </div>
          </motion.div>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {passingItem?.label.replace(/\n/g, ' — ')}
      </p>
    </div>
  )
}
