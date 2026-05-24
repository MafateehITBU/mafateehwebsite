import { HOME_CONTENT } from './home.js'

/** @param {'en' | 'ar'} locale */
export function getHomeContent(locale) {
  const key = locale === 'ar' ? 'ar' : 'en'
  return HOME_CONTENT[key] ?? HOME_CONTENT.en
}

export { HOME_CONTENT } from './home.js'
