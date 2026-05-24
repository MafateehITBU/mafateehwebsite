import { stripHtmlToPlainText } from '../../../utils/htmlContent.js'

/**
 * @param {'en' | 'ar'} locale
 * @param {string | null | undefined} en
 * @param {string | null | undefined} ar
 */
export function pickLocalized(locale, en, ar) {
  if (locale === 'ar' && ar && String(ar).trim()) return ar
  return en ?? ''
}

/**
 * @param {'en' | 'ar'} locale
 * @param {string} dateStr
 */
export function formatBlogDate(dateStr, locale) {
  const date = new Date(dateStr)
  if (Number.isNaN(date.getTime())) return ''

  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar' : 'en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

/**
 * @param {'en' | 'ar'} locale
 * @param {{
 *   title: string,
 *   titleAr?: string | null,
 *   content?: string | null,
 *   contentAr?: string | null,
 *   category?: { name?: string, nameAr?: string | null } | null,
 *   readTime?: number | null,
 * }} blog
 */
export function getBlogLabels(locale, blog) {
  const body = pickLocalized(locale, blog.content, blog.contentAr)
  return {
    title: pickLocalized(locale, blog.title, blog.titleAr),
    excerpt: stripHtmlToPlainText(body),
    bodyHtml: body,
    categoryName: blog.category
      ? pickLocalized(locale, blog.category.name, blog.category.nameAr)
      : '',
    readTime: typeof blog.readTime === 'number' ? blog.readTime : 0,
  }
}

/**
 * @param {Record<string, unknown>} blog
 */
export function isPublishedBlog(blog) {
  return blog.published === true
}
