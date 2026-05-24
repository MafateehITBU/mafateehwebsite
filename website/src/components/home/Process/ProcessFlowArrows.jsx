const W = 900
const H = 560
const CX = W / 2
const CY = H / 2
/** Larger radius — arcs sit in the corners between steps, away from the center image */
const R = 270

/**
 * Four separate arrows (clockwise): step1→2, 2→3, 3→4, 4→1.
 * Short arcs centered in each quadrant between steps (~18° span).
 */
const SEGMENTS = [
  { start: -54, end: -25, label: '1-2' },
  { start: 30, end: 54, label: '2-3' },
  { start: 126, end: 150, label: '3-4' },
  { start: 200, end: 230, label: '4-1' },
]

function polar(deg) {
  const rad = (deg * Math.PI) / 180
  return {
    x: CX + R * Math.cos(rad),
    y: CY + R * Math.sin(rad),
  }
}

function arcPath(startDeg, endDeg) {
  const s = polar(startDeg)
  const e = polar(endDeg)
  return `M ${s.x.toFixed(1)} ${s.y.toFixed(1)} A ${R} ${R} 0 0 1 ${e.x.toFixed(1)} ${e.y.toFixed(1)}`
}

/**
 * @param {{ isRtl?: boolean }} props
 */
export function ProcessFlowArrows({ isRtl = false }) {
  return (
    <svg
      className={[
        'process-flow-arrows pointer-events-none absolute inset-0 h-full w-full origin-center',
        isRtl ? '-scale-x-100' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      aria-hidden
    >
      <defs>
        <marker
          id="process-flow-arrowhead"
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <path d="M0 0 L6 3 L0 6 Z" className="fill-[var(--process-arrow)]" />
        </marker>
      </defs>
      {SEGMENTS.map(({ start, end, label }) => (
        <path
          key={label}
          d={arcPath(start, end)}
          className="stroke-[var(--process-arrow)]"
          strokeWidth="1.75"
          strokeLinecap="round"
          fill="none"
          markerEnd="url(#process-flow-arrowhead)"
        />
      ))}
    </svg>
  )
}
