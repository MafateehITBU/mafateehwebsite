/**
 * About page body copy (sections below `PageHeader`).
 * EDIT HERE for all About-specific text in EN / AR.
 */

/** @typedef {{ title: string, subtitle: string }} AboutInfoCard */

/** @typedef {{ value: string, label: string }} AboutCounter */

/** @typedef {Object} AboutPageLocale
 * @property {string} storyMissionHeading
 * @property {string} empowerBefore
 * @property {string} empowerYear
 * @property {string} empowerAfter
 * @property {string} empowerSubtitle
 * @property {AboutInfoCard[]} infoCards
 * @property {string} contactUs
 * @property {string} gallerySecondaryTitle
 * @property {string} gallerySecondarySubtitle
 * @property {string} quoteText
 * @property {string} storyEyebrow
 * @property {string} journeyBefore
 * @property {string} journeyHighlight
 * @property {string} journeySubtitle
 * @property {AboutCounter[]} counters
 */

/** @type {Record<'en' | 'ar', AboutPageLocale>} */
export const ABOUT_PAGE_CONTENT = {
  en: {
    storyMissionHeading: 'Our Story & Mission',
    empowerBefore: 'Empowering Digital Growth Since',
    empowerYear: '2018',
    empowerAfter: '',
    empowerSubtitle:
      'We transform ideas into smart digital solutions that help businesses grow, scale, and succeed with confidence.',
    infoCards: [
      {
        title: 'Expert Team',
        subtitle: 'Skilled professionals combining technology and creativity.',
      },
      {
        title: 'Tailored Solutions',
        subtitle: 'Customized strategies designed for your business goals.',
      },
      {
        title: 'Business Growth',
        subtitle: 'Solutions focused on increasing efficiency and revenue.',
      },
      {
        title: 'Ongoing Support',
        subtitle: 'We stay with you every step of your digital journey.',
      },
    ],
    contactUs: 'Contact Us',
    gallerySecondaryTitle: '250+',
    gallerySecondarySubtitle: 'GLOBAL PARTNERS',
    quoteText: 'Mafateeh transformed our legacy systems into a modern engine for growth.',
    storyEyebrow: 'OUR STORY',
    journeyBefore: 'A Journey Defined by',
    journeyHighlight: 'Excellence',
    journeySubtitle:
      'Founded in 2018, Mafateeh IT & Media Solutions began with a singular focus: to bridge the gap between complex technology and business accessibility. We saw a world moving fast, but businesses struggling to keep up with the technical demands of a digital-first economy.\n \nWhat started as a small team of four passionate innovators has evolved into a full-service powerhouse, specializing in custom software development, high-impact media production, and strategic IT consulting.\n\n Today, we stand as a beacon of reliability and innovation, serving clients across three continents while maintaining the boutique, high-touch service that defined our first year. Our story is not just about our growth—it\'s about the milestones our clients have reached through our partnership.',
    counters: [
      { value: '2018', label: 'INCEPTION' },
      { value: '50+', label: 'SPECIALISTS' },
      { value: '15+', label: 'AWARDS' },
    ],
  },
  ar: {
    storyMissionHeading: 'قصتنا ورسالتنا',
    empowerBefore: 'نُمكّن النمو الرقمي منذ',
    empowerYear: '2018',
    empowerAfter: '',
    empowerSubtitle:
      'نحن نحول الأفكار إلى حلول رقمية ذكية تساعد الشركات على النمو والتوسع والنجاح بثقة.',
    infoCards: [
      {
        title: 'فريق الخبراء',
        subtitle: 'محترفون ماهرون يجمعون بين التكنولوجيا والإبداع.',
      },
      {
        title: 'حلول مخصصة',
        subtitle: 'استراتيجيات مخصصة مصممة خصيصاً لتحقيق أهداف عملك.',
      },
      {
        title: 'نمو الأعمال',
        subtitle: 'حلول تركز على زيادة الكفاءة والإيرادات.',
      },
      {
        title: 'دعم مستمر',
        subtitle: 'نبقى معك في كل خطوة من رحلتك الرقمية.',
      },
    ],
    contactUs: 'تواصل معنا',
    gallerySecondaryTitle: 'نبني على الثقة',
    gallerySecondarySubtitle: 'شراكات تحوّل الرؤية إلى نتائج مستدامة.',
    quoteText: 'حوّلت مفاتيح أنظمتنا القديمة إلى محرك حديث للنمو.',
    storyEyebrow: 'قصتنا',
    journeyBefore: 'رحلة تُعرّفها',
    journeyHighlight: 'التميز',
    journeySubtitle:
      'تأسست شركة مفاتيح لحلول تكنولوجيا المعلومات والإعلام عام ٢٠١٨، وانطلقت بهدفٍ واحد: سد الفجوة بين التكنولوجيا المعقدة وإمكانية الوصول إليها في مجال الأعمال. لقد رأينا عالماً يتطور بسرعة، لكن الشركات تكافح لمواكبة المتطلبات التقنية لاقتصاد رقمي في المقام الأول.  \n\n ما بدأ كفريق صغير من أربعة مبتكرين شغوفين تطور إلى شركة متكاملة الخدمات، متخصصة في تطوير البرمجيات المخصصة وإنتاج الوسائط الإعلامية عالية التأثير والاستشارات الاستراتيجية في مجال تكنولوجيا المعلومات.  \n\n اليوم، نقف كمنارة للموثوقية والابتكار، نخدم عملاءنا في ثلاث قارات مع الحفاظ على الخدمة المتميزة والشخصية التي ميزت عامنا الأول. قصتنا لا تقتصر على نمونا فحسب، بل تتعداه إلى الإنجازات التي حققها عملاؤنا من خلال شراكتنا.',
    counters: [
      { value: '2018', label: 'التأسيس' },
      { value: '50+', label: 'خبراء' },
      { value: '15+', label: 'جوائز' },
    ],
  },
}

/** @param {'en' | 'ar'} locale */
export function getAboutPageContent(locale) {
  const key = locale === 'ar' ? 'ar' : 'en'
  return ABOUT_PAGE_CONTENT[key] ?? ABOUT_PAGE_CONTENT.en
}
