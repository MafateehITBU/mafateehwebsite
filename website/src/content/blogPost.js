/**
 * Blog post detail page copy, EN / AR.
 */

/** @type {Record<'en' | 'ar', {
 *   mostRead: string,
 *   newsletterTitle: string,
 *   newsletterSubtitle: string,
 *   emailPlaceholder: string,
 *   subscribe: string,
 *   subscribeSuccess: string,
 *   notFound: string,
 *   backToBlog: string,
 *   loading: string,
 *   readCount: (count: number) => string,
 * }>} */
export const BLOG_POST_CONTENT = {
  en: {
    mostRead: 'Most Read Blogs',
    newsletterTitle: 'Subscribe to Our News Letter',
    newsletterSubtitle:
      'Get the latest insights, tips, and updates delivered straight to your inbox.',
    emailPlaceholder: 'Your Email Address',
    subscribe: 'Subscribe Now',
    subscribeSuccess: 'Thanks for subscribing!',
    notFound: 'Blog post not found.',
    backToBlog: 'Back to blog',
    loading: 'Loading…',
    readCount: (count) => (count === 1 ? `${count} read` : `${count} reads`),
  },
  ar: {
    mostRead: 'الأكثر قراءة',
    newsletterTitle: 'اشترك في نشرتنا الإخبارية',
    newsletterSubtitle: 'احصل على أحدث الرؤى والنصائح والتحديثات مباشرة إلى بريدك.',
    emailPlaceholder: 'بريدك الإلكتروني',
    subscribe: 'اشترك الآن',
    subscribeSuccess: 'شكراً لاشتراكك!',
    notFound: 'المقال غير موجود.',
    backToBlog: 'العودة إلى المدونة',
    loading: 'جاري التحميل…',
    readCount: (count) => (count === 1 ? `${count} قراءة` : `${count} قراءات`),
  },
}

/** @param {'en' | 'ar'} locale */
export function getBlogPostContent(locale) {
  const key = locale === 'ar' ? 'ar' : 'en'
  return BLOG_POST_CONTENT[key] ?? BLOG_POST_CONTENT.en
}
