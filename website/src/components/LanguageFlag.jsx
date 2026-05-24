import saFlag from '../assets/flags/sa.svg'
import usFlag from '../assets/flags/us.svg'

const flagClassName = 'h-7 w-auto shrink-0 rounded-sm object-cover cursor-pointer'

/** Shown when site is English — tap to switch to Arabic */
export function SaudiArabiaFlag({ className = flagClassName }) {
  return (
    <img
      src={saFlag}
      alt=""
      className={className}
      width={40}
      height={20}
      decoding="async"
      draggable={false}
    />
  )
}

/** Shown when site is Arabic — tap to switch to English */
export function USFlag({ className = flagClassName }) {
  return (
    <img
      src={usFlag}
      alt=""
      className={className}
      width={40}
      height={20}
      decoding="async"
      draggable={false}
    />
  )
}

export function LanguageFlag({ locale, className = flagClassName }) {
  if (locale === 'en') {
    return <SaudiArabiaFlag className={className} />
  }
  return <USFlag className={className} />
}
