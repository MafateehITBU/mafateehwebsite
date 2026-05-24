/**
 * Renders CMS/API text with line breaks preserved (`\n` in JSON → visible new lines).
 * Used in service cards when descriptions contain multiple lines from the admin.
 * @param {{
 *   children?: string | null,
 *   as?: 'p' | 'span' | 'div',
 *   className?: string,
 * }} props
 */
export function MultilineText({ children, as: Tag = 'p', className = '' }) {
  if (children == null || String(children) === '') return null
  const classes = ['whitespace-pre-line', className].filter(Boolean).join(' ')
  return <Tag className={classes}>{children}</Tag>
}
