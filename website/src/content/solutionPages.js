/**
 * Static copy for IT / Marketing / Branding solution pages (sections 2 & 3).
 *
 * EDIT HERE for:
 * - servicesHeading — only the heading above the API cards (section 1)
 * - choosePrefix / chooseHighlight / highlightSubtitle / points — section 2 left panel
 * - rectangles[0..3] — section 2 right tiles (order: col1-top, col2-top, col1-bottom, col2-bottom)
 * - methodologyLabel / methodologyHeading / methodologySteps — section 3
 *
 * Section 1 cards come from the API (`/public/services`), not this file.
 * Keys must match pageKey in `SolutionPageSections` and category.slug in the database:
 *   it → slug "it" | marketing → "marketing" | branding → "branding"
 */

/** @typedef {{ icon: string, text: string }} SolutionPoint */

/** @typedef {{ title: string, subtitle: string }} SolutionRectangle */

/** @typedef {{ number: string, title: string, subtitle: string }} MethodologyStep */

/** @typedef {Object} SolutionPageLocale
 * @property {string} servicesHeading
 * @property {string} choosePrefix
 * @property {string} chooseHighlight
 * @property {string} highlightSubtitle
 * @property {SolutionPoint[]} points
 * @property {SolutionRectangle[]} rectangles
 * @property {string} methodologyLabel
 * @property {string} methodologyHeading
 * @property {MethodologyStep[]} methodologySteps
 */

/** @type {Record<'it' | 'marketing' | 'branding', Record<'en' | 'ar', SolutionPageLocale>>} */
export const SOLUTION_PAGES = {
  it: {
    en: {
      servicesHeading: 'Precision-Engineered IT Solutions',
      choosePrefix: 'We Choose Our',
      chooseHighlight: 'IT Solutions',
      highlightSubtitle:
        'We deliver tailored IT solutions that streamline operations, enhance security, and drive real business growth through innovative technology.',
      points: [
        { icon: 'material-symbols:bolt-rounded', text: 'Scalable & Future-Ready Systems' },
        { icon: 'mdi:puzzle', text: 'Custom-Built Solutions' },
        { icon: 'material-symbols:rocket', text: 'High-Performance Development' },
        { icon: 'material-symbols:security', text: 'Advanced Security Solutions' },
      ],
      rectangles: [
        { title: '99%', subtitle: 'System Uptime' },
        { title: '50+', subtitle: 'Expert Engineers' },
        { title: '200+', subtitle: 'Global Projects' },
        { title: '24/7', subtitle: 'Active Support' },
      ],
      methodologyLabel: 'Methodology',
      methodologyHeading: 'How We Deliver IT Excellence',
      methodologySteps: [
        {
          number: '01',
          title: 'Analysis & Planning',
          subtitle: "We assess your business needs, workflows, and technical requirements while designing intuitive UI/UX experiences to ensure the final solution is scalable, user-friendly, and aligned with your operational goals.",
        },
        {
          number: '02',
          title: 'Development & Integration',
          subtitle: 'We build, customize, and integrate systems using modern technologies to ensure efficiency, performance, and seamless connectivity.',
        },
        {
          number: '03',
          title: 'Testing, Launch & Support',
          subtitle: 'We thoroughly test, deploy, and continuously support your solution to ensure stability, security, and long-term success.',
        },
      ],
    },
    ar: {
      servicesHeading: 'حلول تقنية معلومات مصممة بدقة عالية',
      choosePrefix: 'نختار',
      chooseHighlight: 'حلول تقنية المعلومات',
      highlightSubtitle:
        'نقدم حلولاً تقنية معلومات مصممة خصيصاً لتبسيط العمليات، وتعزيز الأمن، ودفع نمو الأعمال الحقيقي من خلال التكنولوجيا المبتكرة.',
      points: [
        { icon: 'material-symbols:bolt-rounded', text: 'أنظمة قابلة للتطوير وجاهزة للمستقبل' },
        { icon: 'mdi:puzzle', text: 'حلول مصممة خصيصاً' },
        { icon: 'material-symbols:rocket', text: 'التطوير عالي الأداء' },
        { icon: 'material-symbols:security', text: 'الحلول الأمنية المتقدمة'},
      ],
      rectangles: [
        { title: '99%', subtitle: 'أنظمة قابلة للتطوير وجاهزة للمستقبل' },
        { title: '50+', subtitle: 'مهندسين متخصصين' },
        { title: '200+', subtitle: 'مشاريع عالمية' },
        { title: '24/7', subtitle: 'دعم فعال' },
      ],
      methodologyLabel: 'المنهجية',
      methodologyHeading: 'كيف نقدّم التميز التقني',
      methodologySteps: [
        {
          number: '01',
          title: 'التحليل والتخطيط',
          subtitle: 'نبدأ بفهم احتياجات أعمالك ودراسة العمليات والمتطلبات التقنية، مع تصميم واجهات وتجارب استخدام (UI/UX) تضمن أن يكون الحل النهائي سهل الاستخدام، قابلًا للتوسع، ومتوافقًا مع أهدافك التشغيلية.',
        },
        {
          number: '02',
          title: 'التطوير والتكامل',
          subtitle: 'نقوم بتطوير الحلول التقنية وتخصيصها وربطها مع الأنظمة والمنصات المختلفة، لضمان كفاءة التشغيل وسلاسة تدفق البيانات بين جميع الأقسام.',
        },
        {
          number: '03',
          title: 'الاختبار والإطلاق والدعم',
          subtitle: 'نختبر الأنظمة بدقة قبل الإطلاق، ثم نوفر الدعم والمتابعة المستمرة لضمان الاستقرار والأمان وتحقيق أفضل أداء على المدى الطويل.',
        },
      ],
    },
  },
  marketing: {
    en: {
      servicesHeading: 'Our Digital Marketing Services',
      choosePrefix: 'We Choose Our',
      chooseHighlight: 'Digital Marketing Solutions',
      highlightSubtitle:
        'We craft data-driven digital strategies that grow brand visibility, boost engagement, and increase conversions across all online channels.',
      points: [
        { icon: 'akar-icons:statistic-up', text: 'SEO & Organic Growth' },
        { icon: 'el:idea', text: 'Creative Content Strategy' },
        { icon: 'boxicons:announcement-filled', text: 'Social Media Campaigns' },
        { icon: 'bi:basket-fill', text: 'Paid Advertising Optimization' },
      ],
      rectangles: [
        { title: '99%', subtitle: 'Successful campaigns' },
        { title: '50+', subtitle: 'Expert marketers' },
        { title: '200+', subtitle: 'Average ROI growth' },
        { title: '24/7', subtitle: 'Active Support' },
      ],
      methodologyLabel: 'Methodology',
      methodologyHeading: 'The Path to Digital Growth',
      methodologySteps: [
        {
          number: '01',
          title: 'Strategy & Research',
          subtitle: 'We analyze your market, competitors, and audience behavior to build a data-driven marketing strategy aligned with your business goals.',
        },
        {
          number: '02',
          title: 'Campaign Execution',
          subtitle: 'We launch targeted campaigns across SEO, paid ads, and social media with continuous optimization for maximum performance.',
        },
        {
          number: '03',
          title: 'Optimization & Scaling',
          subtitle: 'We monitor analytics, refine strategies, and scale high-performing channels to ensure sustainable long-term growth.',
        },
      ],
    },
    ar: {
      servicesHeading: 'خدمات التسويق الرقمي',
      choosePrefix: 'نختار',
      chooseHighlight: 'حلول التسويق الرقمي',
      highlightSubtitle:
        'نحن نصمم استراتيجيات رقمية قائمة على البيانات تعمل على زيادة ظهور العلامة التجارية، وتعزيز التفاعل، وزيادة التحويلات عبر جميع القنوات الإلكترونية.',
      points: [
        { icon: 'akar-icons:statistic-up', text: 'تحسين محركات البحث' },
        { icon: 'el:idea', text: 'استراتيجية المحتوى الإبداعي' },
        { icon: 'boxicons:announcement-filled', text: 'حملات وسائل التواصل الاجتماعي' },
        { icon: 'bi:basket-fillbi:', text: 'تحسين الإعلانات المدفوعة' },
      ],
      rectangles: [
        { title: '99%', subtitle: 'حملات ناجحة' },
        { title: '50+', subtitle: 'مسوقين متخصصين' },
        { title: '200+', subtitle: 'متوسط ​​نمو عائد الاستثمار' },
        { title: '24/7', subtitle: 'دعم فعال' },
      ],
      methodologyLabel: 'المنهجية',
      methodologyHeading: 'الطريق إلى النمو الرقمي',
      methodologySteps: [
        {
          number: '01',
          title: 'الاستراتيجية والأبحاث',
          subtitle: 'نقوم بتحليل السوق والمنافسين وسلوك الجمهور لبناء استراتيجية تسويقية قائمة على البيانات ومتوافقة مع أهداف عملك.',
        },
        {
          number: '02',
          title: 'تنفيذ الحملات',
          subtitle: 'نطلق حملات تسويقية مستهدفة عبر تحسين محركات البحث والإعلانات المدفوعة ووسائل التواصل الاجتماعي مع تحسين مستمر لتحقيق أقصى قدر من الأداء.',
        },
        {
          number: '03',
          title: 'تحسين وتوسيع',
          subtitle: 'نقوم بمراقبة التحليلات، وتحسين الاستراتيجيات، وتوسيع نطاق القنوات عالية الأداء لضمان نمو مستدام طويل الأجل.',
        },
      ],
    },
  },
  branding: {
    en: {
      servicesHeading: 'Our Branding Services',
      choosePrefix: 'We Choose Our',
      chooseHighlight: 'Creative Branding Solutions',
      highlightSubtitle:
        'We create meaningful brand identities that reflect your vision, connect with your audience, and build a strong market presence.',
      points: [
        { icon: 'material-symbols:diamond-outline-rounded', text: 'Unique Brand Identities' },
        { icon: 'boxicons:globe-filled', text: 'Brands Successfully Built' },
        { icon: 'mdi:paint-outline', text: 'Creative Design Experts' },
        { icon: 'mdi:handshake', text: 'Client-Centered Approach' },
      ],
      rectangles: [
        { title: '95%', subtitle: 'Client Satisfaction' },
        { title: '50+', subtitle: 'Strategic Projects' },
        { title: '200+', subtitle: 'Clients' },
        { title: '24/7', subtitle: 'Active Support' },
      ],
      methodologyLabel: 'Methodology',
      methodologyHeading: 'The Path to Building Your Brand',
      methodologySteps: [
        {
          number: '01',
          title: 'Discovery',
          subtitle: 'Understanding your vision, values, and target audience.',
        },
        {
          number: '02',
          title: 'Strategy',
          subtitle: 'Defining brand positioning, voice, and direction.',
        },
        {
          number: '03',
          title: 'Design',
          subtitle: 'Creating logo, visual identity, and brand elements.',
        },
      ],
    },
    ar: {
      servicesHeading: 'خدمات الهوية البصرية',
      choosePrefix: 'نختار',
      chooseHighlight: 'حلول إبداعية للعلامات التجارية',
      highlightSubtitle:
        'نحن نصمم هويات علامات تجارية ذات مغزى تعكس رؤيتك، وتتواصل مع جمهورك، وتبني حضوراً قوياً في السوق.',
      points: [
        { icon: 'material-symbols:diamond-outline-rounded', text: 'هويات علامات تجارية فريدة' },
        { icon: 'boxicons:globe-filled', text: 'العلامات التجارية التي تم بناؤها بنجاح' },
        { icon: 'mdi:paint-outline', text: 'خبراء التصميم الإبداعي' },
        { icon: 'mdi:handshake', text: 'نهج يركز على العميل' },
      ],
      rectangles: [
        { title: '95%', subtitle: 'رضاء العملاء' },
        { title: '50+', subtitle: 'مشاريع إستراتيجية' },
        { title: '200+', subtitle: 'عملاء' },
        { title: '24/7', subtitle: 'دعم فعال' },
      ],
      methodologyLabel: 'المنهجية',
      methodologyHeading: 'الطريق لبناء علامتك التجارية',
      methodologySteps: [
        {
          number: '01',
          title: 'اكتشاف',
          subtitle: 'فهم رؤيتك، وقيمك، وجمهورك المستهدف.',
        },
        {
          number: '02',
          title: 'استراتيجية',
          subtitle: 'تحديد موضع العلامة التجارية، والصوت، والاتجاه.',
        },
        {
          number: '03',
          title: 'تصميم',
          subtitle: 'إنشاء الشعار، والهوية البصرية، وعناصر العلامة التجارية.',
        },
      ],
    },
  },
}

/** @param {'it' | 'marketing' | 'branding'} pageKey — must match `SolutionPageSections` prop */
export function getSolutionPageContent(pageKey, locale) {
  const lang = locale === 'ar' ? 'ar' : 'en'
  return SOLUTION_PAGES[pageKey]?.[lang] ?? SOLUTION_PAGES[pageKey]?.en
}
