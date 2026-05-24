const BASIC_TAGS = new Set([
  'b',
  'strong',
  'i',
  'em',
  'u',
  'br',
  'p',
  'div',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
])

const EXTENDED_TAGS = new Set([...BASIC_TAGS, 'span', 'hr', 'font'])

const ALLOWED_SPAN_CLASSES = new Set(['text-primary', 'text-secondary'])

const LEGACY_SPAN_CLASS_MAP = {
  'rich-color-primary': 'text-primary',
  'rich-color-secondary': 'text-secondary',
}

const ALLOWED_FONT_COLORS = new Map([
  ['#00502e', 'text-primary'],
  ['00502e', 'text-primary'],
  ['#dfb026', 'text-secondary'],
  ['dfb026', 'text-secondary'],
  ['rgb(0,80,46)', 'text-primary'],
  ['rgb(0, 80, 46)', 'text-primary'],
  ['rgb(223,176,38)', 'text-secondary'],
  ['rgb(223, 176, 38)', 'text-secondary'],
])

/**
 * @param {string} raw
 * @returns {string | null}
 */
function normalizeFontColor(raw) {
  const key = String(raw).trim().toLowerCase().replace(/\s/g, '')
  return ALLOWED_FONT_COLORS.get(key) ?? null
}

/**
 * @param {string} attrs
 * @returns {string}
 */
function sanitizeSpanOpen(attrs) {
  const classMatch = attrs.match(/\bclass=["']([^"']*)["']/i)
  if (!classMatch) return ''
  const classes = [
    ...new Set(
      classMatch[1]
        .split(/\s+/)
        .map((c) => LEGACY_SPAN_CLASS_MAP[c] ?? c)
        .filter((c) => ALLOWED_SPAN_CLASSES.has(c)),
    ),
  ]
  if (classes.length === 0) return ''
  return `<span class="${classes.join(' ')}">`
}

/**
 * @param {string} attrs
 * @returns {string}
 */
function sanitizeFontOpen(attrs) {
  const colorMatch =
    attrs.match(/\bcolor=["']([^"']+)["']/i) ?? attrs.match(/\bcolor=([#\w(),.\s]+)/i)
  if (!colorMatch) return ''
  const colorClass = normalizeFontColor(colorMatch[1])
  if (!colorClass) return ''
  return `<span class="${colorClass}">`
}

function spanHasAllowedClass(attrs) {
  const classMatch = attrs.match(/\bclass=["']([^"']*)["']/i)
  if (!classMatch) return false
  return classMatch[1]
    .split(/\s+/)
    .some((c) => ALLOWED_SPAN_CLASSES.has(c) || c in LEGACY_SPAN_CLASS_MAP)
}

/**
 * Cleans rich-text editor noise (orphan spans, hr inside headings, empty blocks).
 * @param {string} html
 */
function normalizeEditorHtml(html) {
  let s = String(html ?? '')

  // Drop meaningless span wrappers; keep color spans for sanitizeRichHtml.
  s = s.replace(/<span\b([^>]*)>/gi, (match, attrs) => {
    if (!spanHasAllowedClass(attrs)) return ''
    const classMatch = attrs.match(/\bclass=["']([^"']*)["']/i)
    const classes = [
      ...new Set(
        classMatch[1]
          .split(/\s+/)
          .map((c) => LEGACY_SPAN_CLASS_MAP[c] ?? c)
          .filter((c) => ALLOWED_SPAN_CLASSES.has(c)),
      ),
    ]
    return `<span class="${classes.join(' ')}">`
  })

  // Move dividers out of heading tags.
  s = s.replace(/<(h[1-6])\b[^>]*>\s*<hr\b[^>]*>\s*/gi, '<hr class="rich-divider"><$1>')
  s = s.replace(/<(h[1-6])\b[^>]*>\s*<hr class="rich-divider"\s*\/?>\s*/gi, '<hr class="rich-divider"><$1>')

  // Drop empty headings / blocks left after cleanup.
  s = s.replace(/<h[1-6]\b[^>]*>\s*<\/h[1-6]>/gi, '')
  s = s.replace(/<div>\s*<\/div>/gi, '')
  s = s.replace(/<div>\s*(?:<br\s*\/?>\s*)*<\/div>/gi, '')

  // Normalize non-breaking spaces and collapse excessive line breaks.
  s = s.replace(/&nbsp;/gi, ' ')
  s = s.replace(/(<br\s*\/?>\s*){3,}/gi, '<br><br>')

  return s
}

/**
 * @param {string} html
 * @returns {string}
 */
function balanceSpanTags(html) {
  let depth = 0
  return html.replace(
    /<span class="(?:text-primary|text-secondary)">|<\/span>/gi,
    (match) => {
      if (match.startsWith('</')) {
        if (depth > 0) {
          depth -= 1
          return '</span>'
        }
        return ''
      }
      depth += 1
      return match
    },
  )
}

/**
 * @param {string} input
 * @param {{ extended?: boolean }} [options]
 * @returns {string}
 */
export function sanitizeRichHtml(input, options = {}) {
  const extended = options.extended === true
  const allowed = extended ? EXTENDED_TAGS : BASIC_TAGS
  const trimmed = String(input ?? '').trim()
  if (!trimmed) return trimmed

  let out = extended ? normalizeEditorHtml(trimmed) : trimmed
  out = out
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')

  out = out.replace(/<\/?([a-z][a-z0-9]*)\b([^>]*)>/gi, (match, tagName, attrs) => {
    const tag = tagName.toLowerCase()
    const isClose = match.startsWith('</')

    if (!allowed.has(tag)) return ''

    if (tag === 'span') {
      if (!extended) return ''
      if (isClose) return '</span>'
      return sanitizeSpanOpen(attrs)
    }

    if (tag === 'font') {
      if (!extended) return ''
      if (isClose) return '</span>'
      return sanitizeFontOpen(attrs)
    }

    if (isClose) return `</${tag}>`
    if (tag === 'br') return '<br>'
    if (tag === 'hr' && extended) return '<hr class="rich-divider">'
    return `<${tag}>`
  })

  if (extended) {
    out = balanceSpanTags(out)
  }

  return out
}

/** @param {string} input */
export function sanitizeBlogHtml(input) {
  return sanitizeRichHtml(input, { extended: false })
}

/**
 * @param {string} html
 * @returns {string}
 */
export function stripHtmlToPlainText(html) {
  return String(html ?? '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<hr\b[^>]*>/gi, '\n\n')
    .replace(/<\/h[1-6]>/gi, '\n\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

/**
 * @param {string} value
 * @returns {boolean}
 */
export function looksLikeHtml(value) {
  return /<[a-z][\s\S]*>/i.test(String(value ?? ''))
}
