/**
 * Cloudinary-aware image URL helper for responsive WebP delivery.
 * Non-Cloudinary URLs are returned unchanged.
 *
 * @param {unknown} url
 * @param {{ width?: number, quality?: number }} [options]
 */
export function optimizedImageUrl(url, options = {}) {
  const src = String(url ?? '').trim()
  if (!src) return ''
  const { width, quality = 80 } = options
  const marker = '/upload/'
  const idx = src.indexOf(marker)
  if (idx === -1) return src
  const prefix = src.slice(0, idx + marker.length)
  const rest = src.slice(idx + marker.length)
  if (rest.startsWith('f_')) return src
  const transforms = ['f_auto', 'q_auto', `q_${quality}`]
  if (width) transforms.push(`w_${width}`, 'c_limit')
  return `${prefix}${transforms.join(',')}/${rest}`
}
