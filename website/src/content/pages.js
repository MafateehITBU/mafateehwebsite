/**
 * Page hero copy (breadcrumb label, H1, subtitle) for inner pages using `PageHeader`.
 *
 * EDIT HERE when adding a route:
 * 1. Add a key (e.g. `contact`) with `en` and `ar` objects.
 * 2. Use `getPageCopy('contact', locale)` in the page component.
 * 3. Register the route in `App.jsx`.
 *
 * `pageName` = last segment in breadcrumb (Home > pageName).
 */

/** @typedef {{ pageName: string, title: string, subtitle: string }} PageCopy */

/** @type {Record<string, Record<'en' | 'ar', PageCopy>>} */
export const PAGE_COPY = {
  privacy: {
    en: {
      pageName: 'Privacy Policy',
      title: 'Privacy Policy',
      subtitle:
        'Learn how we collect, use, and protect your information when you use our website and services.',
    },
    ar: {
      pageName: 'سياسة الخصوصية',
      title: 'سياسة الخصوصية',
      subtitle:
        'تعرّف على كيفية جمع معلوماتك واستخدامها وحمايتها عند استخدام موقعنا وخدماتنا.',
    },
  },

  blogs: {
    en: {
      pageName: 'Blogs',
      title: 'Blogs',
      subtitle: 'Insights, trends, and expert knowledge to help your business stay ahead in the digital world. Discover practical tips, strategies, and innovations that drive real growth.',
    },
    ar: {
      pageName: 'المدونات',
      title: 'المدونات',
      subtitle: 'رؤى واتجاهات وخبرات متخصصة لمساعدة أعمالك على البقاء في الصدارة في العالم الرقمي. اكتشف نصائح عملية واستراتيجيات وابتكارات تدفع النمو الحقيقي.',
    },
  },

  about: {
    en: {
      pageName: 'About Us',
      title: 'About Us',
      subtitle: 'Empowering businesses with smart digital solutions that drive growth, innovation, and long-term success.',
    },
    ar: {
      pageName: 'من نحن',
      title: 'من نحن',
      subtitle: 'تمكين الشركات بحلول رقمية ذكية تدفع النمو والابتكار والنجاح على المدى الطويل.',
    },
  },

  contact: {
    en: {
      pageName: 'Contact Us',
      title: 'Contact Us',
      subtitle: 'We’re here to help you achieve your goals. Contact us today to discuss your project or learn more about our services.',
    },
    ar: {
      pageName: 'تواصل معنا',
      title: 'تواصل معنا',
      subtitle: 'نحن هنا لمساعدتك في تحقيق أهدافك. تواصل معنا اليوم لمناقشة مشروعك أو أكثر من الخدمات التي نقدمها.',
    },
  },

  marketing: {
    en: {
      pageName: 'Digital Marketing',
      title: 'Digital Marketing',
      subtitle: 'Driving real business growth through data-driven marketing strategies and high-performing campaigns.',
    },
    ar: {
      pageName: 'التسويق الرقمي',
      title: 'التسويق الرقمي',
      subtitle: 'تحقيق نمو حقيقي للأعمال من خلال استراتيجيات التسويق القائمة على البيانات والحملات عالية الأداء.',
    },
  },

  it: {
    en: {
      pageName: 'IT Solutions',
      title: 'IT Solutions',
      subtitle: 'Empowering businesses with scalable IT solutions that enhance performance, strengthen security, and drive real growth.',
    },
    ar: {
      pageName: 'حلول تقنية المعلومات',
      title: 'حلول تقنية المعلومات',
      subtitle: 'نصمم هويات علامات تجارية قوية تربط بين الناس، وتلهمهم، وتترك انطباعاً دائماً.',
    },
  },

  branding: {
    en: {
      pageName: 'Branding',
      title: 'Branding',
      subtitle: 'We craft powerful brand identities that connect, inspire, and leave a lasting impression.',
    },
    ar: {
      pageName: 'الهوية البصرية',
      title: 'الهوية البصرية',
      subtitle: 'نحن نساعد الشركات في النمو والنجاح في العالم الرقمي. خدمات الهوية البصرية التي نقدمها مصممة لمساعدتك في تحقيق أهدافك.',
    },
  },

  packages: {
    en: {
      pageName: 'Packages',
      title: 'Packages',
      subtitle: 'Mafateeh provides high-authority IT and media solutions tailored to your scale. No hidden fees, just precision digital craft.',
    },
    ar: {
      pageName: 'الباقات',
      title: 'الباقات',
      subtitle: 'تُقدّم شركة مفاتيح حلولاً تقنية وإعلامية عالية الجودة مُصممة خصيصاً لتناسب احتياجاتك. لا رسوم خفية، فقط دقة متناهية في العمل الرقمي.',
    },
  },
}

/** @param {keyof typeof PAGE_COPY} pageKey — e.g. 'about', 'blogs', 'it' */
export function getPageCopy(pageKey, locale) {
  const lang = locale === 'ar' ? 'ar' : 'en'
  return PAGE_COPY[pageKey]?.[lang] ?? PAGE_COPY[pageKey]?.en
}
