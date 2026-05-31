import { useCallback, useEffect, useMemo, useState } from 'react'
import api from '../../axiosConfig.js'
import { getBlogsPageContent } from '../../content/blogsPage.js'
import { getHomeContent } from '../../content/index.js'
import { useLanguage } from '../../context/useLanguage.js'
import { getApiErrorMessage } from '../../utils/apiError.js'
import {
  countBlogsByCategory,
  filterBlogs,
} from '../../utils/blogFilters.js'
import { isPublishedBlog } from '../home/Blogs/blogLocale.js'
import { BlogCard } from '../home/Blogs/BlogCard.jsx'
import { BlogsEmptyState } from './BlogsEmptyState.jsx'
import { BlogsPageLoader } from './BlogsPageLoader.jsx'
import { BlogsSidebar } from './BlogsSidebar.jsx'

const INITIAL_VISIBLE = 6
const LOAD_MORE_STEP = 6

export function BlogsPageContent() {
  const { locale } = useLanguage()
  const pageCopy = getBlogsPageContent(locale)
  const { blogs: cardCopy } = getHomeContent(locale)
  const isRtl = locale === 'ar'

  const [blogs, setBlogs] = useState(/** @type {Array<Record<string, unknown>>} */ ([]))
  const [categories, setCategories] = useState(
    /** @type {Array<Record<string, unknown>>} */ ([]),
  )
  const [tags, setTags] = useState(/** @type {Array<Record<string, unknown>>} */ ([]))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(/** @type {string | null} */ (null))

  const [searchInput, setSearchInput] = useState('')
  const [appliedSearch, setAppliedSearch] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    /** @type {string | null} */ (null),
  )
  const [selectedTagSlugs, setSelectedTagSlugs] = useState(/** @type {string[]} */ ([]))
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const [blogsRes, categoriesRes, tagsRes] = await Promise.all([
          api.get('/public/blogs'),
          api.get('/public/blog-categories'),
          api.get('/public/tags'),
        ])
        if (cancelled) return
        const rows = Array.isArray(blogsRes.data) ? blogsRes.data : []
        setBlogs(rows.filter(isPublishedBlog))
        setCategories(Array.isArray(categoriesRes.data) ? categoriesRes.data : [])
        setTags(Array.isArray(tagsRes.data) ? tagsRes.data : [])
      } catch (err) {
        if (!cancelled) setError(getApiErrorMessage(err))
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  const categoryCounts = useMemo(
    () => countBlogsByCategory(blogs, categories),
    [blogs, categories],
  )

  const filteredBlogs = useMemo(
    () =>
      filterBlogs(blogs, {
        searchQuery: appliedSearch,
        categoryId: selectedCategoryId,
        tagSlugs: selectedTagSlugs,
      }),
    [blogs, appliedSearch, selectedCategoryId, selectedTagSlugs],
  )

  const visibleBlogs = useMemo(
    () => filteredBlogs.slice(0, visibleCount),
    [filteredBlogs, visibleCount],
  )

  const hasMore = visibleCount < filteredBlogs.length

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE)
  }, [appliedSearch, selectedCategoryId, selectedTagSlugs])

  const handleSearchSubmit = useCallback(() => {
    setAppliedSearch(searchInput.trim())
  }, [searchInput])

  const handleCategorySelect = useCallback((categoryId) => {
    setSelectedCategoryId(categoryId)
  }, [])

  const handleTagToggle = useCallback((tagSlug) => {
    setSelectedTagSlugs((prev) =>
      prev.includes(tagSlug) ? prev.filter((s) => s !== tagSlug) : [...prev, tagSlug],
    )
  }, [])

  const handleRemoveSearch = useCallback(() => {
    setSearchInput('')
    setAppliedSearch('')
  }, [])

  const handleRemoveCategory = useCallback(() => {
    setSelectedCategoryId(null)
  }, [])

  const handleRemoveTag = useCallback((tagSlug) => {
    setSelectedTagSlugs((prev) => prev.filter((s) => s !== tagSlug))
  }, [])

  const handleClearAllFilters = useCallback(() => {
    setSearchInput('')
    setAppliedSearch('')
    setSelectedCategoryId(null)
    setSelectedTagSlugs([])
  }, [])

  const sidebarProps = {
    copy: pageCopy,
    locale,
    categories,
    tags,
    categoryCounts,
    selectedCategoryId,
    selectedTagSlugs,
    appliedSearch,
    searchInput,
    onSearchInputChange: setSearchInput,
    onSearchSubmit: handleSearchSubmit,
    onRemoveSearch: handleRemoveSearch,
    onRemoveCategory: handleRemoveCategory,
    onRemoveTag: handleRemoveTag,
    onClearAllFilters: handleClearAllFilters,
    onCategorySelect: handleCategorySelect,
    onTagToggle: handleTagToggle,
  }

  return (
    <section
      className="section-solid py-12 sm:py-14 lg:py-16"
      dir={isRtl ? 'rtl' : 'ltr'}
      aria-label={cardCopy.heading}
    >
      <div className="site-container">
        {loading ? <BlogsPageLoader message={pageCopy.loading} /> : null}

        {error ? (
          <p className="font-body text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
        ) : null}

        {!loading && !error ? (
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(260px,320px)] lg:items-start lg:gap-12 xl:grid-cols-[minmax(0,1fr)_360px] xl:gap-14">
            {filteredBlogs.length === 0 ? (
              <>
                <div className="flex min-h-[min(52vh,28rem)] items-center justify-center sm:min-h-[min(58vh,32rem)] lg:min-h-[min(62vh,36rem)]">
                  <BlogsEmptyState message={pageCopy.noResults} />
                </div>
                <BlogsSidebar {...sidebarProps} />
              </>
            ) : (
              <>
                <div className="min-w-0" data-aos={isRtl ? 'slide-left' : 'slide-right'}>
                  <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-6 lg:gap-7">
                    {visibleBlogs.map((blog) => (
                      <li key={String(blog.id)}>
                        <BlogCard
                          blog={blog}
                          locale={locale}
                          readMoreLabel={cardCopy.readMore}
                          minReadLabel={cardCopy.minRead}
                        />
                      </li>
                    ))}
                  </ul>

                  {hasMore ? (
                    <div className="mt-10 flex justify-center">
                      <button
                        type="button"
                        onClick={() =>
                          setVisibleCount((n) =>
                            Math.min(n + LOAD_MORE_STEP, filteredBlogs.length),
                          )
                        }
                        className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-8 py-2.5 font-body text-sm font-semibold text-white transition hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:text-base"
                      >
                        {pageCopy.viewMore}
                      </button>
                    </div>
                  ) : null}
                </div>

                <BlogsSidebar {...sidebarProps} />
              </>
            )}
          </div>
        ) : null}
      </div>
    </section>
  )
}
