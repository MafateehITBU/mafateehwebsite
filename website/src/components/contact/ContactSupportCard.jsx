import { Icon } from '@iconify/react'
import { HeroSocialLinks } from '../home/Hero/HeroSocialLinks.jsx'
import { useStaticInfo } from '../../context/StaticInfoContext.jsx'

/**
 * @param {{
 *   copy: import('../../content/contactPage.js').CONTACT_PAGE_CONTENT['en'],
 *   locale: 'en' | 'ar',
 * }} props
 */
export function ContactSupportCard({ copy, locale }) {
  const { staticInfo, loading } = useStaticInfo()
  const isRtl = locale === 'ar'
  const phone = staticInfo?.phoneNumber?.trim() || null
  const email = staticInfo?.email?.trim() || null
  const businessHours = staticInfo?.businessHours?.trim() || null
  const placeholder = loading ? '…' : '—'

  return (
    <section
      className="rounded-xl bg-primary px-8 py-6 text-white dark:bg-secondary dark:text-foreground sm:px-12 sm:py-7"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <h2 className="font-heading text-xl font-bold sm:text-2xl">{copy.supportHeading}</h2>

      <ul className="mt-6 flex flex-col gap-6">
        <li className="flex gap-3 sm:gap-4">
          <Icon
            icon="mdi:phone-outline"
            className="mt-0.5 h-6 w-6 shrink-0 text-white dark:text-white"
            aria-hidden
          />
          <div>
            <p className="font-body text-xs font-semibold uppercase tracking-wide text-white/75 dark:text-foreground/65">
              {copy.priorityLine}
            </p>
            {phone ? (
              <a
                href={`tel:${phone.replace(/\s/g, '')}`}
                className="mt-1 inline-block font-body text-base font-medium text-white transition hover:opacity-80 dark:text-foreground"
                dir="ltr"
              >
                {phone}
              </a>
            ) : (
              <p className="mt-1 font-body text-base">{placeholder}</p>
            )}
          </div>
        </li>

        <li className="flex gap-3 sm:gap-4">
          <Icon
            icon="mdi:email-outline"
            className="mt-0.5 h-6 w-6 shrink-0 text-white dark:text-white"
            aria-hidden
          />
          <div>
            <p className="font-body text-xs font-semibold uppercase tracking-wide text-white/75 dark:text-foreground/65">
              {copy.emailLabel}
            </p>
            {email ? (
              <a
                href={`mailto:${email}`}
                className="mt-1 inline-block break-all font-body text-base font-medium text-white transition hover:opacity-80 dark:text-foreground"
                dir="ltr"
              >
                {email}
              </a>
            ) : (
              <p className="mt-1 font-body text-base">{placeholder}</p>
            )}
          </div>
        </li>

        <li className="flex gap-3 sm:gap-4">
          <Icon
            icon="mdi:clock-outline"
            className="mt-0.5 h-6 w-6 shrink-0 text-white dark:text-white"
            aria-hidden
          />
          <div>
            <p className="font-body text-xs font-semibold uppercase tracking-wide text-white/75 dark:text-foreground/65">
              {copy.businessHours}
            </p>
            <p className="mt-1 whitespace-pre-line font-body text-base leading-relaxed text-white dark:text-foreground">
              {businessHours || placeholder}
            </p>
          </div>
        </li>
      </ul>

      <div className=" pt-6">
        <p className="font-body text-xs font-semibold uppercase tracking-wide text-white/75 dark:text-foreground/65">
          {copy.followUs}
        </p>
        <HeroSocialLinks className="mt-3 [&_a]:text-white [&_a]:hover:opacity-80 dark:[&_a]:text-foreground" />
      </div>
    </section>
  )
}
