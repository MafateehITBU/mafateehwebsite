/** @typedef {Object} FooterLocaleContent
 * @property {string} tagline
 * @property {string} navigation
 * @property {string} ourServices
 * @property {string} contactInfo
 * @property {ReadonlyArray<{ key: string; href: string; label: string }>} nav
 * @property {readonly string[]} services
 * @property {{ address: string; phone: string; email: string; businessHours: string }} contact
 * @property {{ before: string; brand: string }} copyright
 */

/** @type {Record<'en' | 'ar', FooterLocaleContent>} */
export const FOOTER_CONTENT = {
  en: {
    tagline:
      'Your partner in building integrated digital solutions that combine creativity, technology, and continuous development.',
    navigation: 'Navigation',
    ourServices: 'Our Services',
    contactInfo: 'Contact Info',
    nav: [
      { key: 'home', href: '/', label: 'Home' },
      { key: 'about', href: '/about', label: 'About Us' },
      { key: 'packages', href: '/pricing', label: 'Packages' },
      { key: 'blog', href: '/blogs', label: 'Blog' },
      { key: 'privacy', href: '/privacy-policy', label: 'Privacy Policy' },
    ],
    services: [
      'IT Solutions',
      'Digital Marketing',
      'E-commerce Solutions',
      'Website & Mobile App Development',
      'ERP & CRM Systems',
      'Advertising Campaign Management',
      'Branding & Visual Identity',
      'AI Solutions',
    ],
    contact: {
      address: 'ADDRESS',
      phone: 'PHONE',
      email: 'EMAIL',
      businessHours: 'BUSINESS HOURS',
    },
    copyright: {
      before: '© 2026 All Rights Reserved. Designed by ',
      brand: 'MafateehGroup',
    },
  },
  ar: {
    tagline:
      'شريكك في بناء حلول رقمية متكاملة تجمع بين الإبداع، التقنية، والتطوير المستمر.',
    navigation: 'التنقل',
    ourServices: 'خدماتنا',
    contactInfo: 'معلومات التواصل',
    nav: [
      { key: 'home', href: '/', label: 'الرئيسية' },
      { key: 'about', href: '/about', label: 'من نحن' },
      { key: 'packages', href: '/pricing', label: 'الباقات' },
      { key: 'blog', href: '/blogs', label: 'المدونة' },
      { key: 'privacy', href: '/privacy-policy', label: 'سياسة الخصوصية' },
    ],
    services: [
      'حلول تقنية المعلومات',
      'التسويق الرقمي',
      'إنشاء المتاجر الإلكترونية',
      'تطوير المواقع والتطبيقات',
      'أنظمة ERP و CRM',
      'إدارة الحملات الإعلانية',
      'الهوية البصرية وصناعة المحتوى',
      'حلول الذكاء الاصطناعي',
    ],
    contact: {
      address: 'العنوان',
      phone: 'الهاتف',
      email: 'البريد الإلكتروني',
      businessHours: 'ساعات العمل',
    },
    copyright: {
      before: '© 2026 جميع الحقوق محفوظة. تصميم بواسطة ',
      brand: 'MafateehGroup',
    },
  },
}

/** @param {'en' | 'ar'} locale */
export function getFooterContent(locale) {
  const key = locale === 'ar' ? 'ar' : 'en'
  return FOOTER_CONTENT[key] ?? FOOTER_CONTENT.en
}
