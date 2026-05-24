/**
 * Blogs listing page copy (sidebar + grid), EN / AR.
 */

/** @type {Record<'en' | 'ar', {
 *   searchPlaceholder: string,
 *   categories: string,
 *   tags: string,
 *   followUs: string,
 *   viewMore: string,
 *   noResults: string,
 *   loading: string,
 *   loadError: string,
 *   searchAria: string,
 *   activeFilters: string,
 *   clearAll: string,
 *   removeFilter: string,
 * }>} */
export const BLOGS_PAGE_CONTENT = {
  en: {
    searchPlaceholder: 'Search articles…',
    categories: 'Categories',
    tags: 'Tags',
    followUs: 'Follow Us On',
    viewMore: 'View More',
    noResults: 'No posts match your filters.',
    loading: 'Loading posts…',
    loadError: 'Could not load posts. Please try again later.',
    searchAria: 'Search blog posts',
    activeFilters: 'Active filters',
    clearAll: 'Clear all',
    removeFilter: 'Remove filter',
  },
  ar: {
    searchPlaceholder: 'ابحث في المقالات…',
    categories: 'التصنيفات',
    tags: 'الوسوم',
    followUs: 'تابعنا على',
    viewMore: 'عرض المزيد',
    noResults: 'لا توجد مقالات تطابق عوامل التصفية.',
    loading: 'جاري تحميل المقالات…',
    loadError: 'تعذر تحميل المقالات. يرجى المحاولة لاحقاً.',
    searchAria: 'البحث في المقالات',
    activeFilters: 'عوامل التصفية النشطة',
    clearAll: 'مسح الكل',
    removeFilter: 'إزالة عامل التصفية',
  },
}

/** @param {'en' | 'ar'} locale */
export function getBlogsPageContent(locale) {
  const key = locale === 'ar' ? 'ar' : 'en'
  return BLOGS_PAGE_CONTENT[key] ?? BLOGS_PAGE_CONTENT.en
}
