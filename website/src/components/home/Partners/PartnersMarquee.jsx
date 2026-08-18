import { InfiniteMarquee } from '../../common/InfiniteMarquee.jsx'
import { optimizedImageUrl } from '../../../utils/optimizedImageUrl.js'

/**
 * @param {Array<{ id: string, name: string, logoUrl?: string | null }>} partners
 */
function buildMarqueeSequence(partners) {
  if (partners.length === 0) return []
  const minItems = 10
  let expanded = [...partners]
  while (expanded.length < minItems) {
    expanded = [...expanded, ...partners]
  }
  return expanded
}

function PartnerLogoBox({ name, logoUrl }) {
  const src = logoUrl ? optimizedImageUrl(logoUrl, { width: 176, quality: 75 }) : ''
  return (
    <div className="flex h-20 w-36 shrink-0 items-center justify-center rounded-lg bg-white px-4 py-3 sm:h-24 sm:w-44 sm:px-5 sm:py-4">
      {src ? (
        <img
          src={src}
          alt={name}
          className="max-h-full max-w-full object-contain"
          width={176}
          height={96}
          loading="lazy"
          decoding="async"
        />
      ) : (
        <span className="font-body text-xs font-medium text-foreground/60">{name}</span>
      )}
    </div>
  )
}

/**
 * @param {{ partners: Array<{ id: string, name: string, logoUrl?: string | null }> }} props
 */
export function PartnersMarquee({ partners }) {
  const sequence = buildMarqueeSequence(partners)
  if (sequence.length === 0) return null

  return (
    <InfiniteMarquee
      className="partners-marquee mt-10 sm:mt-12"
      groupClassName="flex shrink-0 items-center gap-4 sm:gap-5"
      duration={45}
      direction="rtl"
    >
      {sequence.map((partner, index) => (
        <PartnerLogoBox
          key={`${partner.id}-${index}`}
          name={partner.name}
          logoUrl={partner.logoUrl}
        />
      ))}
    </InfiniteMarquee>
  )
}
