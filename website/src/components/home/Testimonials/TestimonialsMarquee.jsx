import { InfiniteMarquee } from '../../common/InfiniteMarquee.jsx'
import { TestimonialCard } from './TestimonialCard.jsx'

/**
 * @param {Array<Record<string, unknown>>} testimonials
 */
function buildMarqueeSequence(testimonials) {
  if (testimonials.length === 0) return []
  const minItems = 10
  let expanded = [...testimonials]
  while (expanded.length < minItems) {
    expanded = [...expanded, ...testimonials]
  }
  return expanded
}

/**
 * @param {{
 *   testimonials: Array<Record<string, unknown>>,
 *   locale: 'en' | 'ar',
 * }} props
 */
export function TestimonialsMarquee({ testimonials, locale }) {
  const sequence = buildMarqueeSequence(testimonials)
  if (sequence.length === 0) return null

  return (
    <InfiniteMarquee
      className="testimonials-marquee mt-10 sm:mt-12"
      groupClassName="flex shrink-0 items-stretch gap-4 sm:gap-5"
      duration={45}
      direction="rtl"
    >
      {sequence.map((item, index) => (
        <TestimonialCard
          key={`${String(item.id)}-${index}`}
          item={item}
          locale={locale}
        />
      ))}
    </InfiniteMarquee>
  )
}
