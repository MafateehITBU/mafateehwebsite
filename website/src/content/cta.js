/**
 * Shared CTA band copy (shown on most inner pages via `SiteShell`).
 * EDIT HERE for heading / subtitle / button text in EN and AR.
 * To hide CTA on a route, add the path in `SiteShell.jsx` → `shouldShowCta`.
 */

/** @typedef {{ heading: string, subtitle: string, button: string }} CtaLocaleContent */

/** @type {Record<'en' | 'ar', CtaLocaleContent>} */
export const CTA_CONTENT = {
  en: {
    heading: "Let's Build the Future Together",
    subtitle:
      'Your vision deserves to become reality. Connect with our innovative team and let’s create extraordinary digital experiences that push the boundaries of technology.',
    button: 'Get Started Today',
  },
  ar: {
    heading: 'لنَبنِ المستقبل معاً',
    subtitle:
      'رؤيتك تستحق أن تتحقق. تواصل مع فريقنا المبتكر لنصنع تجارب رقمية استثنائية تتجاوز حدود التقنية.',
    button: 'ابدأ معنا اليوم',
  },
}

/** @param {'en' | 'ar'} locale */
export function getCtaContent(locale) {
  const key = locale === 'ar' ? 'ar' : 'en'
  return CTA_CONTENT[key] ?? CTA_CONTENT.en
}
