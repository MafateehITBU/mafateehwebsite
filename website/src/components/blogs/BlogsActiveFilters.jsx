import { Icon } from '@iconify/react'
import { useMemo } from 'react'
import { getCategoryLabel } from '../../utils/blogFilters.js'

/**
 * @param {{
 *   copy: import('../../content/blogsPage.js').BLOGS_PAGE_CONTENT['en'],
 *   locale: 'en' | 'ar',
 *   appliedSearch: string,
 *   categories: Array<Record<string, unknown>>,
 *   tags: Array<Record<string, unknown>>,
 *   selectedCategoryId: string | null,
 *   selectedTagSlugs: string[],
 *   onRemoveSearch: () => void,
 *   onRemoveCategory: () => void,
 *   onRemoveTag: (slug: string) => void,
 *   onClearAll: () => void,
 * }} props
 */
export function BlogsActiveFilters({
  copy,
  locale,
  appliedSearch,
  categories,
  tags,
  selectedCategoryId,
  selectedTagSlugs,
  onRemoveSearch,
  onRemoveCategory,
  onRemoveTag,
  onClearAll,
}) {
  const activeItems = useMemo(() => {
    /** @type {Array<{ key: string, label: string, onRemove: () => void }>} */
    const items = []

    const search = appliedSearch.trim()
    if (search) {
      items.push({
        key: `search:${search}`,
        label: search,
        onRemove: onRemoveSearch,
      })
    }

    if (selectedCategoryId) {
      const category = categories.find((c) => String(c.id ?? '') === selectedCategoryId)
      const name = category ? getCategoryLabel(locale, category) : selectedCategoryId
      items.push({
        key: `category:${selectedCategoryId}`,
        label: name,
        onRemove: onRemoveCategory,
      })
    }

    for (const slug of selectedTagSlugs) {
      const tag = tags.find((t) => String(t.slug ?? '') === slug)
      const name = tag ? String(tag.name ?? slug) : slug
      items.push({
        key: `tag:${slug}`,
        label: name,
        onRemove: () => onRemoveTag(slug),
      })
    }

    return items
  }, [
    appliedSearch,
    categories,
    locale,
    onRemoveCategory,
    onRemoveSearch,
    onRemoveTag,
    selectedCategoryId,
    selectedTagSlugs,
    tags,
  ])

  if (activeItems.length === 0) return null

  return (
    <div className="flex flex-col gap-2.5" aria-label={copy.activeFilters}>
      <p className="font-body text-xs font-semibold uppercase tracking-wide text-foreground/55">
        {copy.activeFilters}
      </p>
      <ul className="flex flex-wrap gap-2">
        {activeItems.map((item) => (
          <li key={item.key}>
            <span className="inline-flex max-w-full items-center gap-1 rounded-md bg-foreground/8 py-1 ps-2.5 pe-1 font-body text-xs text-foreground dark:bg-white/10 sm:text-sm">
              <span className="max-w-[11rem] truncate sm:max-w-[14rem]">{item.label}</span>
              <button
                type="button"
                onClick={item.onRemove}
                className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded text-foreground/70 transition hover:bg-foreground/10 hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary dark:hover:bg-white/10"
                aria-label={`${copy.removeFilter}: ${item.label}`}
              >
                <Icon icon="mdi:close" className="h-4 w-4" aria-hidden />
              </button>
            </span>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={onClearAll}
        className="self-start font-body text-sm font-medium text-primary underline-offset-2 transition hover:text-secondary hover:underline dark:text-secondary dark:hover:text-white"
      >
        {copy.clearAll}
      </button>
    </div>
  )
}
