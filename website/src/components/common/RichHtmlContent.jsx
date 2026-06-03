import { MultilineText } from './MultilineText.jsx'
import { looksLikeHtml, sanitizeBlogHtml, sanitizeRichHtml } from '../../utils/htmlContent.js'

/**
 * Renders sanitized blog HTML (bold, italic, underline, line breaks) or plain text fallback.
 * @param {{
 *   html?: string | null,
 *   as?: 'div' | 'p' | 'article',
 *   className?: string,
 *   dir?: 'ltr' | 'rtl',
 *   extended?: boolean,
 * }} props
 */
export function RichHtmlContent({
  html,
  as: Tag = 'div',
  className = '',
  dir,
  extended = false,
}) {
  const raw = String(html ?? '').trim()
  if (!raw) return null

  if (!looksLikeHtml(raw)) {
    return (
      <MultilineText
        as={Tag === 'article' ? 'div' : Tag}
        dir={dir}
        className={className}
      >
        {raw}
      </MultilineText>
    )
  }

  const safe = extended ? sanitizeRichHtml(raw, { extended: true }) : sanitizeBlogHtml(raw)
  if (!safe) return null

  return (
    <Tag
      dir={dir}
      className={`rich-html ${className}`.trim()}
      dangerouslySetInnerHTML={{ __html: safe }}
    />
  )
}
