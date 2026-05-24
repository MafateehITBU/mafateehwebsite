/** @typedef {{ key: string; href: string; en: string; ar: string }} NavItem */

/** @type {NavItem[]} */
export const NAV_ITEMS = [
  { key: 'home', href: '/', en: 'Home', ar: 'الرئيسية' },
  { key: 'about', href: '/about', en: 'About Us', ar: 'من نحن' },
  { key: 'it', href: '/it-solutions', en: 'IT Solutions', ar: 'الحلول التقنية' },
  {
    key: 'marketing',
    href: '/digital-marketing',
    en: 'Digital Marketing',
    ar: 'التسويق الالكتروني',
  },
  { key: 'branding', href: '/branding', en: 'Branding', ar: 'الهوية البصرية' },
  { key: 'packages', href: '/packages', en: 'Packages', ar: 'الباقات' },
]
