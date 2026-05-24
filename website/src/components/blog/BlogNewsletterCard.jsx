import { useState } from 'react'

/**
 * @param {{
 *   copy: import('../../content/blogPost.js').BLOG_POST_CONTENT['en'],
 *   locale: 'en' | 'ar',
 * }} props
 */
export function BlogNewsletterCard({ copy, locale }) {
  const isRtl = locale === 'ar'
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setSubmitted(true)
  }

  return (
    <section
      className="blog-post-card-shadow rounded-xl bg-primary px-5 py-6 text-white dark:bg-secondary dark:text-foreground sm:px-6 sm:py-7"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <h2 className="font-heading text-lg font-bold sm:text-xl">{copy.newsletterTitle}</h2>
      <p className="mt-2 font-body text-sm leading-relaxed text-white/90 dark:text-foreground/80 sm:text-base">
        {copy.newsletterSubtitle}
      </p>

      {submitted ? (
        <p className="mt-5 font-body text-sm font-medium sm:text-base">{copy.subscribeSuccess}</p>
      ) : (
        <form className="mt-5 flex flex-col gap-3" onSubmit={handleSubmit} noValidate>
          <label htmlFor="blog-newsletter-email" className="sr-only">
            {copy.emailPlaceholder}
          </label>
          <input
            id="blog-newsletter-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={copy.emailPlaceholder}
            className="w-full rounded-lg border border-white/20 bg-white/95 px-4 py-2.5 font-body text-sm text-foreground outline-none placeholder:text-foreground/45 focus:border-white dark:border-foreground/15 dark:bg-background/95 dark:focus:border-foreground/30 sm:py-3 sm:text-base"
            autoComplete="email"
            required
          />
          <button
            type="submit"
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-white px-5 py-2.5 font-body text-sm font-semibold text-primary transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white dark:bg-[#0d0d0d] dark:text-white dark:focus-visible:outline-foreground sm:text-base"
          >
            {copy.subscribe}
          </button>
        </form>
      )}
    </section>
  )
}
