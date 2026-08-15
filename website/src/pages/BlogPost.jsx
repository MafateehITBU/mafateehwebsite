import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import api from '../axiosConfig.js'
import { BlogPostArticle } from '../components/blog/BlogPostArticle.jsx'
import { BlogPostSidebar } from '../components/blog/BlogPostSidebar.jsx'
import { Header } from '../components/layout/Header.jsx'
import { getBlogPostContent } from '../content/blogPost.js'
import { getHomeContent } from '../content/index.js'
import { useLanguage } from '../context/useLanguage.js'
import { useLocalizedPath } from '../hooks/useLocalizedPath.js'
import { formatBlogDate, getBlogLabels } from '../components/home/Blogs/blogLocale.js'

export function BlogPost() {
  const { slug } = useParams()
  const { locale } = useLanguage()
  const localizedPath = useLocalizedPath()
  const navigate = useNavigate()
  const copy = getBlogPostContent(locale)
  const { blogs: cardCopy } = getHomeContent(locale)
  const isRtl = locale === 'ar'

  const [blog, setBlog] = useState(/** @type {Record<string, unknown> | null} */ (null))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(/** @type {string | null} */ (null))

  useEffect(() => {
    if (!slug) return
    let cancelled = false
    setLoading(true)
    setError(null)
    api
      .get(`/public/blogs/${slug}`)
      .then((res) => {
        if (!cancelled) {
          setBlog(res.data)
          const viewKey = `blog-view-recorded:${slug}`
          if (!sessionStorage.getItem(viewKey)) {
            sessionStorage.setItem(viewKey, '1')
            void api.post(`/public/blogs/${slug}/view`).catch(() => {})
          }
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError('not-found')
          navigate(localizedPath('/blogs'), { replace: true, state: { missingSlug: slug } })
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [slug, localizedPath, navigate])

  const labels = blog ? getBlogLabels(locale, blog) : null
  const createdAt = blog ? formatBlogDate(String(blog.createdAt ?? ''), locale) : ''

  return (
    <>
      <Header />
      <main
        className="section-solid site-container md:px-25 min-h-[50vh] py-10 sm:py-12 lg:py-14"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {loading ? (
          <p className="font-body text-foreground/70">{copy.loading}</p>
        ) : null}

        {error || !blog ? (
          !loading ? (
            <div>
              <p className="font-body text-foreground/70">{copy.notFound}</p>
              <Link
                to={localizedPath('/blogs')}
                className="mt-4 inline-block font-body text-primary hover:underline dark:text-secondary"
              >
                {copy.backToBlog}
              </Link>
            </div>
          ) : null
        ) : null}

        {blog && labels ? (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(280px,340px)] lg:items-start lg:gap-10 xl:grid-cols-[minmax(0,1fr)_360px] xl:gap-12">
            <BlogPostArticle
              title={labels.title}
              categoryName={labels.categoryName}
              bodyHtml={labels.bodyHtml}
              createdAt={createdAt}
              readTime={labels.readTime}
              featuredImageUrl={blog.featuredImageUrl}
              minReadLabel={cardCopy.minRead}
              locale={locale}
            />
            <BlogPostSidebar locale={locale} currentSlug={slug} />
          </div>
        ) : null}
      </main>
    </>
  )
}
