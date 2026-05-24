/** @typedef {{ icon: string; title: string; description: string }} ServiceItem */

/** @typedef {{ label: string; percent: number }} SkillItem */

/** @typedef {Object} HomeLocaleContent
 * @property {Object} hero
 * @property {string} hero.title
 * @property {string} hero.subtitle
 * @property {string} hero.getQuotes
 * @property {string} hero.getStarted
 * @property {{ prefix: string; animated: string }} hero.typewriter
 * @property {Object} services
 * @property {string} services.heading
 * @property {ServiceItem[]} services.items
 * @property {Object} company
 * @property {string} company.eyebrow
 * @property {string} company.title
 * @property {string} company.subtitle
 * @property {SkillItem[]} company.skills
 * @property {Object} promo
 * @property {string} promo.heading
 * @property {string} promo.subtitle
 * @property {string} promo.getStarted
 * @property {ReadonlyArray<{ icon: string, lines: [string, string] }>} promo.cards
 * @property {Object} process
 * @property {string} process.heading
 * @property {ReadonlyArray<{ icon: string, title: string, subtitle: string }>} process.steps
 * @property {Object} portfolio
 * @property {string} portfolio.heading
 * @property {string} portfolio.allCategories
 * @property {string} portfolio.loading
 * @property {string} portfolio.empty
 * @property {string} portfolio.showMore
 * @property {Object} partners
 * @property {string} partners.heading
 * @property {string} partners.loading
 * @property {Object} pricing
 * @property {string} pricing.heading
 * @property {string} pricing.subtitle
 * @property {string} pricing.requestQuote
 * @property {string} pricing.loading
 * @property {string} pricing.prev
 * @property {string} pricing.next
 * @property {Object} testimonials
 * @property {string} testimonials.heading
 * @property {string} testimonials.subtitle
 * @property {string} testimonials.loading
 * @property {Object} blogs
 * @property {string} blogs.heading
 * @property {string} blogs.pageName
 * @property {string} blogs.pageTitle
 * @property {string} blogs.pageSubtitle
 * @property {string} blogs.viewAll
 * @property {string} blogs.readMore
 * @property {(minutes: number) => string} blogs.minRead
 * @property {string} blogs.loading
 * @property {string} blogs.empty
 */

const LOREM_EN =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'

const LOREM_AR =
  'لوريم إيبسوم هو نص شكلي يُستخدم في التصميم والطباعة. هذا النص مؤقت لعرض شكل البطاقة والمحتوى في الواجهة.'

/** @type {Record<'en' | 'ar', HomeLocaleContent>} */
export const HOME_CONTENT = {
  en: {
    hero: {
      title: 'In a World Full of Uncertainty…Choose Proven Results',
      subtitle:
        'At Mafateeh, we combine marketing, technology, and systems to create integrated experiences that strengthen your business and deliver measurable results.',
      getQuotes: 'Get a Quote',
      getStarted: 'Start With Us',
      typewriter: {
        prefix: 'We Build Digital ',
        animated: 'Solutions That Drive Real Growth & Sales',
      },
    },
    services: {
      heading: 'Our Services',
      items: [
        {
          icon: 'solar:cart-large-2-bold-duotone',
          title: 'E-Commerce Development',
          description: 'Professional online stores built to increase sales and simplify customer experience.',
        },
        {
          icon: 'material-symbols-light:developer-mode-tv-outline',
          title: 'Website Development',
          description: 'Modern, high-performance websites that strengthen your brand presence online.',
        },
        {
          icon: 'solar:chart-square-bold-duotone',
          title: 'Digital Marketing',
          description: 'Smart marketing strategies designed to reach audiences and drive real results.',
        },
        {
          icon: 'lineicons:seo-monitor',
          title: 'SEO Optimization',
          description: 'mprove your search visibility and help customers find your business first.',
        },
        {
          icon: 'solar:palette-round-bold-duotone',
          title: 'Branding & Visual Identity',
          description: 'Creative branding solutions that make your business look stronger and more memorable.',
        },
        {
          icon: 'solar:widget-5-bold-duotone',
          title: 'ERP & Smart Systems',
          description: 'Smart systems that organize operations and improve business efficiency.',
        },
      ],
    },
    company: {
      eyebrow: 'About Mafateeh',
      title: 'Your Partner in Building Real Digital Growth',
      subtitle: 'At Mafateeh, we combine marketing, technology, and smart systems to help businesses grow stronger, operate smarter, and achieve scalable results.',
      skills: [
        { label: 'IT Consulting', percent: 90 },
        { label: 'Web Development', percent: 75 },
        { label: 'UX Design', percent: 70 },
      ],
    },
    promo: {
      heading: 'Years of Experience. Results That Speak for Themselves.',
      subtitle: 'At Mafateeh, we don’t just provide digital services, we build solutions that help businesses grow, scale, and achieve real measurable results.',
      getStarted: 'Start With Us Today',
      cards: [
        { icon: 'solar:clipboard-check-bold-duotone', lines: ['+250', 'Projects Delivered'] },
        { icon: 'solar:medal-ribbons-star-bold-duotone', lines: ['+7', 'Years of Experience'] },
        { icon: 'solar:users-group-rounded-bold-duotone', lines: ['+120', 'Clients & Success Partners'] },
      ],
    },
    process: {
      heading: 'Our Process',
      steps: [
        {
          icon: 'solar:chart-bold-duotone',
          title: '1. Research & Analysis',
          subtitle:
            'We begin by understanding your business, analyzing the market, and building a strategy based on measurable goals and real opportunities.',
        },
        {
          icon: 'hugeicons:ai-innovation-01',
          title: '2. Strategic Development',
          subtitle:
            'Our specialized team develops tailored solutions using advanced tools and modern technologies for optimal performance.',
        },
        {
          icon: 'solar:refresh-circle-bold-duotone',
          title: '3. Continuous Optimization',
          subtitle:
            'We continuously monitor performance and improve results through ongoing analysis, optimization, and updates.',
        },
        {
          icon: 'solar:rocket-2-bold-duotone',
          title: '4. Launch & Support',
          subtitle:
            'We ensure a smooth professional launch with continuous support designed for sustainable growth.',
        },
      ],
    },
    portfolio: {
      heading: 'Our Portfolio',
      allCategories: 'All Projects',
      loading: 'Loading portfolio…',
      empty: 'No projects in this category yet.',
      showMore: 'Show more',
    },
    partners: {
      heading: 'Building Long-Term Success With Our Partners',
      loading: 'Loading partners…',
    },
    pricing: {
      heading: 'Our Packages',
      subtitle: 'Custom packages to grow your business and achieve measurable results.',
      requestQuote: 'Request a Quote',
      loading: 'Loading plans…',
      prev: 'Previous plan',
      next: 'Next plan',
    },
    testimonials: {
      heading: 'Testimonials',
      subtitle:
        'Trusted feedback from companies and partners who believe in our quality.',
      loading: 'Loading testimonials…',
    },
    blogs: {
      heading: 'Latest Blog Posts',
      pageName: 'Blog',
      pageTitle: 'Insights & Articles',
      pageSubtitle:
        'Explore strategies, trends, and practical ideas to grow your business in the digital world.',
      viewAll: 'View All Posts',
      readMore: 'Read More',
      minRead: (minutes) => `${minutes} min read`,
      loading: 'Loading posts…',
      empty: 'No published posts yet.',
    },
  },
  ar: {
    hero: {
      title: 'وسط فوضى الاحتمالات… اختر النتائج المضمونة',
      subtitle:
        'في مفاتيح، نجمع بين التسويق، التقنية، والأنظمة لنصنع تجربة متكاملة تمنح مشروعك حضورًا أقوى، أداءً أفضل، ونتائج يمكن قياسها.',
      getQuotes: 'اطلب عرض سعر',
      getStarted: 'ابدأ معنا',
      typewriter: {
        prefix: 'نبني حلولًا رقمية تساعد  ',
        animated: 'مشروعك على النمو وتحقيق مبيعات فعلية',
      },
    },
    services: {
      heading: 'خدماتنا',
      items: [
        {
          icon: 'solar:cart-large-2-bold-duotone',
          title: 'إنشاء المتاجر الإلكترونية',
          description: 'متاجر إلكترونية احترافية مصممة لزيادة المبيعات وتسهيل تجربة الشراء.',
        },
        {
          icon: 'material-symbols-light:developer-mode-tv-outline',
          title: 'تصميم وتطوير المواقع الإلكترونية',
          description: 'مواقع سريعة وعصرية تعكس هوية مشروعك وتبني حضورًا أقوى.',
        },
        {
          icon: 'solar:chart-square-bold-duotone',
          title: 'إدارة الحملات الإعلانية',
          description: 'استراتيجيات تسويق ذكية تساعدك على الوصول، التأثير، وتحقيق نتائج فعلية.',
        },
        {
          icon: 'lineicons:seo-monitor',
          title: 'تصدّر نتائج البحث والذكاء الاصطناعي',
          description: 'نرفع ظهورك بمحركات البحث لنساعد العملاء على الوصول إليك أولًا.',
        },
        {
          icon: 'solar:palette-round-bold-duotone',
          title: 'الهوية البصرية والمحتوى المرئي',
          description: 'هوية بصرية ومحتوى إبداعي يمنح علامتك حضورًا يلفت ويُذكر.',
        },
        {
          icon: 'solar:widget-5-bold-duotone',
          title: 'أنظمة ERP المدعومة بالذكاء الاصطناعي',
          description: 'أنظمة ذكية تنظّم عملياتك وتحوّل الفوضى إلى إدارة أكثر كفاءة.',
        },
      ],
    },
    company: {
      eyebrow: 'عن مفاتيح',
      title: 'شريكك في بناء نمو رقمي حقيقي',
      subtitle: 'في مفاتيح، نجمع بين التسويق، التقنية، والأنظمة لنساعد الشركات على بناء حضور أقوى، تنظيم أعمالها، وتحقيق نتائج قابلة للنمو.',
      skills: [
        { label: 'استشارات تقنية', percent: 90 },
        { label: 'تطوير المواقع', percent: 75 },
        { label: 'تصميم تجربة المستخدم', percent: 70 },
      ],
    },
    promo: {
      heading: 'سنوات من الخبرة… ونتائج تتحدث عن نفسها',
      subtitle: 'في مفاتيح، لا نقدّم خدمات رقمية فقط، بل نبني حلولًا تساعد المشاريع على النمو، التنظيم، وتحقيق نتائج فعلية قابلة للتوسع.',
      getStarted: 'ابدأ معنا اليوم',
      cards: [
        { icon: 'solar:clipboard-check-bold-duotone', lines: ['+250', 'مشروع تم تنفيذه'] },
        { icon: 'solar:medal-ribbons-star-bold-duotone', lines: ['+7', 'سنوات من الخبرة'] },
        { icon: 'solar:users-group-rounded-bold-duotone', lines: ['+120', 'عميل وشريك نجاح'] },
      ],
    },
    process: {
      heading: 'آلية العمل',
      steps: [
        {
          icon: 'solar:chart-bold-duotone',
          title: '1. ندرس ونحلل',
          subtitle: 'نبدأ بفهم مشروعك، دراسة السوق، وتحليل التحديات لبناء خطة واضحة مبنية على أهداف حقيقية ونتائج قابلة للقياس.',
        },
        {
          icon: 'hugeicons:ai-innovation-01',
          title: '2. نخطط ونطوّر',
          subtitle: 'يعمل فريقنا من المختصين على تنفيذ الحلول باستخدام أحدث الأدوات والتقنيات لضمان أفضل أداء وتجربة.',
        },
        {
          icon: 'solar:refresh-circle-bold-duotone',
          title: '3. نتابع ونحسّن',
          subtitle: 'نراقب الأداء بشكل مستمر ونطوّر النتائج من خلال التحليل، التحسين، والتحديثات المستمرة.',
        },
        {
          icon: 'solar:rocket-2-bold-duotone',
          title: '4. نطلق وندعم',
          subtitle: 'نضمن إطلاقًا احترافيًا وتجربة مستقرة مع دعم مستمر يساعد مشروعك على النمو بثبات.',
        },
      ],
    },
    portfolio: {
      heading: 'أعمالنا',
      allCategories: 'جميع المشاريع',
      loading: 'جاري تحميل الأعمال…',
      empty: 'لا توجد مشاريع في هذا التصنيف حالياً.',
      showMore: 'عرض المزيد',
    },
    partners: {
      heading: 'شركاء النجاح الذين منحونا ثقتهم لنصنع أثرًا حقيقيًا',
      loading: 'جاري تحميل الشركاء…',
    },
    pricing: {
      heading: 'الباقات المتاحة',
      subtitle: 'باقات مخصصة لتنمية أعمالك وتحقيق نتائج قابلة للتوسع.',
      requestQuote: 'اطلب تسعيرة الباقة',
      loading: 'جاري تحميل الباقات…',
      prev: 'الباقة السابقة',
      next: 'الباقة التالية',
    },
    testimonials: {
      heading: 'آراء العملاء',
      subtitle: 'آراء موثوقة من شركات وشركاء يثقون بجودة عملنا.',
      loading: 'جاري تحميل الآراء…',
    },
    blogs: {
      heading: 'أحدث المقالات',
      pageName: 'المدونة',
      pageTitle: 'مقالات ورؤى',
      pageSubtitle:
        'اكتشف استراتيجيات وأفكاراً عملية تساعدك على تنمية أعمالك في العالم الرقمي.',
      viewAll: 'عرض كل المقالات',
      readMore: 'اقرأ المزيد',
      minRead: (minutes) => `${minutes} دقيقة قراءة`,
      loading: 'جاري تحميل المقالات…',
      empty: 'لا توجد مقالات منشورة حالياً.',
    },
  },
}
