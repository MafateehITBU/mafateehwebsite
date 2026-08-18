/** Served from /public so LCP image can be preloaded with a stable URL. */
const HAND_SRC = '/decor-hand.webp'
const HAND_SRC_SM = '/decor-hand-sm.webp'

/** Optical offset below flex center (PNG has extra space above the hand) */
const VERTICAL_OFFSET =
  'translate-y-10 sm:translate-y-12 md:translate-y-14 lg:translate-y-16'

/**
 * Decorative hand — fixed in the viewport; stays put while scrolling.
 * Solid sections (section-solid) cover it when they pass over.
 */
export function DecorHand({ isRtl }) {
  return (
    <div
      className={`pointer-events-none fixed inset-y-0 z-[3] flex items-center ${
        isRtl ? 'right-0 justify-end' : 'left-0 justify-start'
      }`}
      aria-hidden
    >
      <img
        src={HAND_SRC}
        srcSet={`${HAND_SRC_SM} 320w, ${HAND_SRC} 720w`}
        sizes="(max-width: 640px) min(78vw, 320px), min(68vw, 720px)"
        alt=""
        className={`block w-[min(78vw,40rem)] max-h-[92dvh] max-w-none select-none object-contain ${VERTICAL_OFFSET} sm:w-[min(68vw,44rem)] lg:w-[min(58vw,52rem)] ${
          isRtl ? '-scale-x-100' : ''
        }`}
        width={720}
        height={454}
        loading="eager"
        fetchPriority="high"
        decoding="async"
        draggable={false}
      />
    </div>
  )
}
