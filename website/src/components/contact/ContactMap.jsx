import { useStaticInfo } from '../../context/StaticInfoContext.jsx'

/**
 * @param {{ title: string }} props
 */
export function ContactMap({ title }) {
  const { staticInfo } = useStaticInfo()
  const lat = staticInfo?.latitude
  const lng = staticInfo?.longitude

  if (typeof lat !== 'number' || typeof lng !== 'number') {
    return null
  }

  const src = `https://maps.google.com/maps?q=${lat},${lng}&hl=en&z=15&output=embed`

  return (
    <div className="overflow-hidden rounded-xl border border-line blog-post-card-shadow">
      <iframe
        title={title}
        src={src}
        className="block h-72 w-full border-0 sm:h-80 lg:h-96"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  )
}
