import { Icon } from '@iconify/react'
import { MultilineText } from '../../common/MultilineText.jsx'
import { getPackageLabels } from './packageLocale.js'

/**
 * @param {{
 *   pkg: Record<string, unknown>,
 *   locale: 'en' | 'ar',
 *   isActive: boolean,
 *   requestQuoteLabel: string,
 * }} props
 */
export function PricingCard({ pkg, locale, isActive, requestQuoteLabel }) {
  const { name, shortDescription, privileges } = getPackageLabels(locale, pkg)
  const isRtl = locale === 'ar'

  return (
    <article
      dir={isRtl ? 'rtl' : 'ltr'}
      className={[
        'mx-auto flex h-full w-full max-w-[20rem] flex-col rounded-4xl px-5 py-6 text-start transition-[border-color,background-color,box-shadow,transform] duration-700 ease-out sm:max-w-[21rem] sm:px-6 sm:py-7 lg:max-w-[25rem]',
        isActive
          ? 'bg-primary text-white shadow-lg ring-2 ring-inset ring-secondary'
          : 'border border-primary bg-transparent text-foreground ',
      ].join(' ')}
    >
      <h3
        className={[
          'font-heading text-lg font-bold leading-snug sm:text-xl',
          isActive ? 'text-white' : 'text-foreground',
        ].join(' ')}
      >
        {name}
      </h3>
      {shortDescription ? (
        <MultilineText
          as="p"
          className={[
            'mt-2 font-body text-sm leading-relaxed sm:text-[0.9375rem]',
            isActive ? 'text-white/90' : 'text-foreground/75 dark:text-gray-400',
          ].join(' ')}
        >
          {shortDescription}
        </MultilineText>
      ) : null}

      <a
        href="/contact"
        className="mx-auto mt-8 inline-flex min-h-10 w-auto items-center justify-center rounded-lg bg-secondary px-5 py-2 font-body text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        {requestQuoteLabel}
      </a>

      {isActive && <div className="mt-4 mb-2 h-px w-full bg-line" aria-hidden />}

      {privileges.length > 0 ? (
        <ul className="mt-5 flex flex-1 flex-col gap-2.5 sm:mt-6 sm:gap-3">
          {privileges.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-start">
              <Icon
                icon="simple-line-icons:check"
                className="mt-0.5 h-5 w-5 shrink-0 text-line"
                aria-hidden
              />
              <MultilineText
                as="span"
                className={[
                  'font-body text-md leading-snug',
                  isActive ? 'text-white/95' : 'text-foreground/85',
                ].join(' ')}
              >
                {item}
              </MultilineText>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex-1" />
      )}
    </article>
  )
}
