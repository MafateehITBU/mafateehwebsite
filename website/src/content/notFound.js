/** @typedef {{ code: string, title: string, message: string, hint: string, homeLabel: string }} NotFoundCopy */

/** @type {Record<'en' | 'ar', NotFoundCopy>} */
export const NOT_FOUND_CONTENT = {
  en: {
    code: '404',
    title: 'Page not found',
    message:
      'The page you’re looking for doesn’t exist or may have been moved. Let’s get you back on track.',
    hint: 'Check the URL or return to the homepage.',
    homeLabel: 'Back to home',
  },
  ar: {
    code: '404',
    title: 'الصفحة غير موجودة',
    message:
      'الصفحة التي تبحث عنها غير موجودة أو ربما تم نقلها. دعنا نعيدك إلى المسار الصحيح.',
    hint: 'تحقق من الرابط أو عد إلى الصفحة الرئيسية.',
    homeLabel: 'العودة للرئيسية',
  },
}

/** @param {'en' | 'ar'} locale */
export function getNotFoundContent(locale) {
  const key = locale === 'ar' ? 'ar' : 'en'
  return NOT_FOUND_CONTENT[key] ?? NOT_FOUND_CONTENT.en
}
