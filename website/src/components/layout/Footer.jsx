import { Icon } from '@iconify/react'
import { Link } from 'react-router-dom'
import logoWhite from '../../assets/imgs/logo-white.png'
import { getFooterContent } from '../../content/footer.js'
import { useLanguage } from '../../context/useLanguage.js'
import { useStaticInfo } from '../../context/StaticInfoContext.jsx'

const CONTACT_ICONS = {
  address: 'mdi:map-marker-outline',
  phone: 'mdi:phone-outline',
  email: 'mdi:email-outline',
  businessHours: 'mdi:clock-outline',
}

function FooterColumnHeading({ children }) {
  return (
    <h3 className="mb-5 font-heading text-lg font-semibold text-white">
      <span className="relative inline-block pb-2">
        {children}
        <span
          className="absolute bottom-0 start-0 h-0.5 w-1/2 bg-secondary"
          aria-hidden
        />
      </span>
    </h3>
  )
}

function ContactRow({ icon, label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2.5">
        <Icon icon={icon} className="h-5 w-5 shrink-0 text-secondary" aria-hidden />
        <span className="font-body text-xs font-semibold uppercase tracking-wide text-secondary">
          {label}
        </span>
      </div>
      <div className="ps-7 font-body text-sm leading-relaxed text-white">{children}</div>
    </div>
  )
}

export function Footer() {
  const { locale } = useLanguage()
  const copy = getFooterContent(locale)
  const { staticInfo, loading, getLocalizedAddress } = useStaticInfo()
  const address = getLocalizedAddress(locale)

  const phone = staticInfo?.phoneNumber?.trim() || null
  const email = staticInfo?.email?.trim() || null
  const businessHours = staticInfo?.businessHours?.trim() || null

  const placeholder = loading ? '…' : '—'

  return (
    <footer className="relative mt-auto pt-14 pb-6 text-white sm:pt-16 lg:pt-15">
      <div className="site-container">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8 xl:gap-12">
          <div className="flex flex-col gap-4 rounded-2xl p-5 backdrop-blur-sm">
            <img
              src={logoWhite}
              alt="Mafateeh"
              className="h-auto w-52 max-w-full object-contain object-start sm:w-56"
              width={224}
              height={67}
              loading="lazy"
              decoding="async"
            />
            <p className="max-w-sm font-body text-md leading-relaxed text-white">
              {copy.tagline}
            </p>
          </div>

          <nav className="flex flex-col" aria-label={copy.navigation}>
            <FooterColumnHeading>{copy.navigation}</FooterColumnHeading>
            <ul className="flex flex-col gap-2.5">
              {copy.nav.map((item) => (
                <li key={item.key}>
                  <Link
                    to={item.href}
                    className="font-body text-sm text-white transition-colors hover:text-secondary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col">
            <FooterColumnHeading>{copy.ourServices}</FooterColumnHeading>
            <ul className="flex flex-col gap-2.5">
              {copy.services.map((service) => (
                <li
                  key={service}
                  className="font-body text-sm leading-snug text-white"
                >
                  {service}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col">
            <FooterColumnHeading>{copy.contactInfo}</FooterColumnHeading>
            <div className="flex flex-col gap-5">
              <ContactRow icon={CONTACT_ICONS.address} label={copy.contact.address}>
                <span className="whitespace-pre-line">{address || placeholder}</span>
              </ContactRow>

              <ContactRow icon={CONTACT_ICONS.phone} label={copy.contact.phone}>
                {phone ? (
                  <a
                    href={`tel:${phone.replace(/\s/g, '')}`}
                    className="transition-colors hover:text-secondary"
                  >
                    {phone}
                  </a>
                ) : (
                  placeholder
                )}
              </ContactRow>

              <ContactRow icon={CONTACT_ICONS.email} label={copy.contact.email}>
                {email ? (
                  <a
                    href={`mailto:${email}`}
                    className="break-all transition-colors hover:text-secondary"
                  >
                    {email}
                  </a>
                ) : (
                  placeholder
                )}
              </ContactRow>

              <ContactRow
                icon={CONTACT_ICONS.businessHours}
                label={copy.contact.businessHours}
              >
                <span className="whitespace-pre-line">
                  {businessHours || placeholder}
                </span>
              </ContactRow>
            </div>
          </div>
        </div>
      </div>

      <div
        className="mt-10 w-full border-t border-line sm:mt-12"
        role="presentation"
        aria-hidden
      />

      <div className="pt-6">
        <p className="text-center font-body text-sm text-white">
          {copy.copyright.before}
          <strong>{copy.copyright.brand}</strong>
        </p>
      </div>
    </footer>
  )
}
