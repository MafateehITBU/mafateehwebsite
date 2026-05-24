import { Icon } from '@iconify/react'

/** @param {{ rate: number }} props */
export function TestimonialStars({ rate }) {
  const filled = Math.min(5, Math.max(0, Math.round(rate)))

  return (
    <div className="flex gap-0.5" aria-label={`${filled} out of 5`}>
      {Array.from({ length: 5 }, (_, index) => (
        <Icon
          key={index}
          icon={index < filled ? 'mdi:star' : 'mdi:star-outline'}
          className="h-4 w-4 text-amber-400"
          aria-hidden
        />
      ))}
    </div>
  )
}
