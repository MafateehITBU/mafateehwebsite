import { pickLocalized } from '../components/home/Blogs/blogLocale.js'
import { stripHtmlToPlainText } from './htmlContent.js'

/**
 * @param {Record<string, unknown>} blog
 * @returns {string[]}
 */
export function getBlogTagSlugs(blog) {
  const rows = blog.tags
  if (!Array.isArray(rows)) return []
  return rows
    .map((row) => {
      if (row && typeof row === 'object' && row.tag && typeof row.tag === 'object') {
        return String(row.tag.slug ?? '')
      }
      return ''
    })
    .filter(Boolean)
}

/**
 * @param {Record<string, unknown>} blog
 * @returns {string[]}
 */
function getBlogTagNames(blog) {
  const rows = blog.tags
  if (!Array.isArray(rows)) return []
  return rows
    .map((row) => {
      if (row && typeof row === 'object' && row.tag && typeof row.tag === 'object') {
        return String(row.tag.name ?? '')
      }
      return ''
    })
    .filter(Boolean)
}

/**
 * @param {Record<string, unknown>} blog
 * @param {string} queryLower
 */
function blogMatchesSearch(blog, queryLower) {
  const titleEn = String(blog.title ?? '').toLowerCase()
  const titleAr = String(blog.titleAr ?? '').toLowerCase()
  const contentEn = stripHtmlToPlainText(String(blog.content ?? '')).toLowerCase()
  const contentAr = stripHtmlToPlainText(String(blog.contentAr ?? '')).toLowerCase()

  const category = blog.category
  const categoryNameEn =
    category && typeof category === 'object' ? String(category.name ?? '').toLowerCase() : ''
  const categoryNameAr =
    category && typeof category === 'object'
      ? String(category.nameAr ?? '').toLowerCase()
      : ''

  const tagNames = getBlogTagNames(blog).map((n) => n.toLowerCase())

  const haystack = [
    titleEn,
    titleAr,
    contentEn,
    contentAr,
    categoryNameEn,
    categoryNameAr,
    ...tagNames,
  ].join(' ')

  return haystack.includes(queryLower)
}

/**
 * @param {Array<Record<string, unknown>>} blogs
 * @param {{
 *   searchQuery?: string,
 *   categoryId?: string | null,
 *   tagSlugs?: string[],
 * }} filters
 */
export function filterBlogs(blogs, filters) {
  const searchQuery = (filters.searchQuery ?? '').trim().toLowerCase()
  const categoryId = filters.categoryId ?? null
  const tagSlugs = filters.tagSlugs ?? []

  return blogs.filter((blog) => {
    if (categoryId && String(blog.categoryId ?? '') !== categoryId) {
      return false
    }

    if (tagSlugs.length > 0) {
      const blogSlugs = getBlogTagSlugs(blog)
      const hasTag = tagSlugs.some((slug) => blogSlugs.includes(slug))
      if (!hasTag) return false
    }

    if (searchQuery && !blogMatchesSearch(blog, searchQuery)) {
      return false
    }

    return true
  })
}

/**
 * @param {Array<Record<string, unknown>>} blogs
 * @param {Array<{ id: string }>} categories
 */
export function countBlogsByCategory(blogs, categories) {
  /** @type {Record<string, number>} */
  const counts = {}
  for (const cat of categories) {
    counts[cat.id] = 0
  }
  for (const blog of blogs) {
    const id = String(blog.categoryId ?? '')
    if (id && counts[id] !== undefined) {
      counts[id] += 1
    }
  }
  return counts
}

/**
 * @param {'en' | 'ar'} locale
 * @param {{ name?: string, nameAr?: string | null }} category
 */
export function getCategoryLabel(locale, category) {
  return pickLocalized(locale, category.name, category.nameAr)
}
