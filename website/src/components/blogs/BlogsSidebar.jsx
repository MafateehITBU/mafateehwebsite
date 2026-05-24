import { Icon } from '@iconify/react'
import { useCallback } from 'react'
import { HeroSocialLinks } from '../home/Hero/HeroSocialLinks.jsx'
import { getCategoryLabel } from '../../utils/blogFilters.js'
import { BlogsActiveFilters } from './BlogsActiveFilters.jsx'

/**
 * @param {{
 *   copy: import('../../content/blogsPage.js').BLOGS_PAGE_CONTENT['en'],
 *   locale: 'en' | 'ar',
 *   categories: Array<Record<string, unknown>>,
 *   tags: Array<Record<string, unknown>>,
 *   categoryCounts: Record<string, number>,
 *   selectedCategoryId: string | null,
 *   selectedTagSlugs: string[],
 *   appliedSearch: string,
 *   searchInput: string,
 *   onSearchInputChange: (value: string) => void,
 *   onSearchSubmit: () => void,
 *   onRemoveSearch: () => void,
 *   onRemoveCategory: () => void,
 *   onRemoveTag: (tagSlug: string) => void,
 *   onClearAllFilters: () => void,
 *   onCategorySelect: (categoryId: string | null) => void,
 *   onTagToggle: (tagSlug: string) => void,
 * }} props
 */
export function BlogsSidebar({
  copy,
  locale,
  categories,
  tags,
  categoryCounts,
  selectedCategoryId,
  selectedTagSlugs,
  appliedSearch,
  searchInput,
  onSearchInputChange,
  onSearchSubmit,
  onRemoveSearch,
  onRemoveCategory,
  onRemoveTag,
  onClearAllFilters,
  onCategorySelect,
  onTagToggle,
}) {
  const isRtl = locale === 'ar'

  const handleSearchKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        onSearchSubmit()
      }
    },
    [onSearchSubmit],
  )

  return (
    <aside className="flex flex-col gap-8 lg:gap-10" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="flex flex-col gap-2">
        <label htmlFor="blogs-search" className="sr-only">
          {copy.searchAria}
        </label>
        <div className="flex overflow-hidden rounded-lg border border-line bg-card">
          <input
            id="blogs-search"
            type="search"
            value={searchInput}
            onChange={(e) => onSearchInputChange(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder={copy.searchPlaceholder}
            className="min-w-0 flex-1 bg-transparent px-4 py-2.5 font-body text-sm text-foreground outline-none placeholder:text-foreground/45 sm:py-3 sm:text-base"
            autoComplete="off"
          />
          <button
            type="button"
            onClick={onSearchSubmit}
            className="inline-flex shrink-0 items-center justify-center bg-primary px-4 text-white transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            aria-label={copy.searchAria}
          >
            <Icon icon="mdi:magnify" className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden />
          </button>
        </div>
        <BlogsActiveFilters
          copy={copy}
          locale={locale}
          appliedSearch={appliedSearch}
          categories={categories}
          tags={tags}
          selectedCategoryId={selectedCategoryId}
          selectedTagSlugs={selectedTagSlugs}
          onRemoveSearch={onRemoveSearch}
          onRemoveCategory={onRemoveCategory}
          onRemoveTag={onRemoveTag}
          onClearAll={onClearAllFilters}
        />
      </div>

      <div>
        <h2 className="font-heading text-lg font-bold text-foreground sm:text-xl">
          {copy.categories}
        </h2>
        <ul className="mt-4 flex flex-col">
          {categories.map((category) => {
            const id = String(category.id ?? '')
            const isActive = selectedCategoryId === id
            const count = categoryCounts[id] ?? 0
            const label = getCategoryLabel(locale, category)

            return (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => onCategorySelect(isActive ? null : id)}
                  className={[
                    'flex w-full items-baseline justify-between gap-3 py-3 text-start font-body text-sm transition-colors sm:text-base',
                    isActive
                      ? 'font-semibold text-primary'
                      : 'text-foreground/85 hover:text-primary',
                  ].join(' ')}
                >
                  <span>{label}</span>
                  <span className="shrink-0 tabular-nums text-foreground/55">{count}</span>
                </button>
                <span className="block h-px w-full bg-line" aria-hidden />
              </li>
            )
          })}
        </ul>
      </div>

      {tags.length > 0 ? (
        <div>
          <h2 className="font-heading text-lg font-bold text-foreground sm:text-xl">
            {copy.tags}
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag) => {
              const slug = String(tag.slug ?? '')
              const isActive = selectedTagSlugs.includes(slug)
              return (
                <li key={String(tag.id ?? slug)}>
                  <button
                    type="button"
                    onClick={() => onTagToggle(slug)}
                    aria-pressed={isActive}
                    className={[
                      'rounded-md px-3 py-1.5 font-body text-sm transition-colors',
                      isActive
                        ? 'bg-primary text-white'
                        : 'bg-foreground/8 text-foreground hover:bg-primary hover:text-white dark:bg-white/10',
                    ].join(' ')}
                  >
                    {String(tag.name ?? slug)}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      ) : null}

      <div>
        <h2 className="font-heading text-lg font-bold text-foreground sm:text-xl">
          {copy.followUs}
        </h2>
        <HeroSocialLinks
          className="mt-4 [&_a]:text-primary [&_a]:hover:opacity-80 dark:[&_a]:text-secondary"
        />
      </div>
    </aside>
  )
}
