import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../../axiosConfig.js'
import { useLanguage } from '../../../context/useLanguage.js'
import { getHomeContent } from '../../../content/index.js'
import { getApiErrorMessage } from '../../../utils/apiError.js'
import { BlogCard } from './BlogCard.jsx'
import { isPublishedBlog } from './blogLocale.js'

export function BlogsSection() {
  const { locale } = useLanguage()
  const { blogs: copy } = getHomeContent(locale)
  const [blogs, setBlogs] = useState(/** @type {Array<Record<string, unknown>>} */ ([]))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(/** @type {string | null} */ (null))

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const res = await api.get('/public/blogs')
        if (cancelled) return
        const rows = Array.isArray(res.data) ? res.data : []
        setBlogs(rows.filter(isPublishedBlog))
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

  const latestBlogs = useMemo(() => blogs.slice(0, 3), [blogs])

  return (
    <section className="section-solid py-14 sm:py-16 lg:py-20" aria-labelledby="blogs-heading">
      <div className="site-container xl:max-w-[1600px]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2
            id="blogs-heading"
            className="font-heading text-3xl font-bold text-foreground sm:text-4xl"
          >
            {copy.heading}
          </h2>
          <Link
            to="/blogs"
            className="inline-flex min-h-11 shrink-0 items-center justify-center self-start rounded-lg bg-primary px-6 py-2.5 font-body text-sm font-semibold text-white transition-colors duration-200 hover:bg-secondary sm:self-center"
          >
            {copy.viewAll}
          </Link>
        </div>

        {loading ? (
          <p className="mt-10 font-body text-foreground/70">{copy.loading}</p>
        ) : null}

        {error ? (
          <p className="mt-10 font-body text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
        ) : null}

        {!loading && !error && latestBlogs.length > 0 ? (
          <ul className="mt-10 grid grid-cols-1 gap-6 sm:mt-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-6 xl:gap-7">
            {latestBlogs.map((blog) => (
              <li key={String(blog.id)}>
                <BlogCard
                  blog={blog}
                  locale={locale}
                  readMoreLabel={copy.readMore}
                  minReadLabel={copy.minRead}
                />
              </li>
            ))}
          </ul>
        ) : null}

        {!loading && !error && latestBlogs.length === 0 ? (
          <p className="mt-10 font-body text-foreground/70">{copy.empty}</p>
        ) : null}
      </div>
    </section>
  )
}
