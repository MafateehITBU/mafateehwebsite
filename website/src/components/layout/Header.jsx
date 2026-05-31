import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import logo from '../../assets/imgs/logo.png'
import logoWhite from '../../assets/imgs/logo-white.png'
import { NAV_ITEMS } from '../../constants/navigation.js'
import { useLanguage } from '../../context/useLanguage.js'
import { isNavActive, usePathname } from '../../utils/pathname.js'
import { LanguageFlag } from '../LanguageFlag.jsx'
import { ThemeToggle } from '../ThemeToggle.jsx'

const MOBILE_MENU_BG = '#131313'

// --- Icons (burger open / close) ---

function IconMenu({ className }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}

function IconClose({ className }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}

// --- Nav link styles ---

/** Desktop nav: bottom border highlights active / hover (primary light, secondary dark). */
function navLinkClass(active) {
  const base =
    'font-body text-base font-medium transition-colors lg:text-[1.0625rem] border-b-2 pb-1'
  if (active) {
    return `${base} border-primary text-primary dark:border-secondary dark:text-secondary`
  }
  return `${base} border-transparent text-foreground/90 hover:border-primary hover:text-primary dark:hover:border-secondary dark:hover:text-secondary`
}

/** Full-screen mobile menu: active item white + bold; others muted white. */
function mobileMenuNavLinkClass(active) {
  const base =
    'inline-block font-body text-lg transition-colors border-b-2 pb-1'
  if (active) {
    return `${base} border-white font-bold text-white`
  }
  return `${base} border-transparent font-medium text-white/75 hover:border-white/50 hover:text-white`
}

/** Language flag, Contact us, and theme toggle (desktop header). */
function HeaderActions({
  contactLabel,
  locale,
  onToggleLocale,
  onContactClick,
}) {
  return (
    <>
      <button
        type="button"
        className="inline-flex shrink-0 items-center justify-center transition hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        onClick={onToggleLocale}
        aria-label={
          locale === 'en'
            ? 'Switch language to Arabic'
            : 'Switch language to English'
        }
        title={locale === 'en' ? 'العربية' : 'English'}
      >
        <LanguageFlag locale={locale} />
      </button>
      <a
        href="contact"
        className="inline-flex min-w-[9.5rem] shrink-0 items-center justify-center whitespace-nowrap rounded-lg bg-secondary px-6 py-2.5 font-body text-sm font-semibold text-white shadow-sm transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:min-w-[10.5rem] sm:px-8 sm:text-base"
        onClick={onContactClick}
      >
        {contactLabel}
      </a>
      <ThemeToggle />
    </>
  )
}

export function Header() {
  const { locale, toggleLocale } = useLanguage()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuId = useId()
  const menuPanelRef = useRef(/** @type {HTMLElement | null} */ (null))
  const menuToggleRef = useRef(/** @type {HTMLButtonElement | null} */ (null))
  const isRtl = locale === 'ar'
  const contactLabel = isRtl ? 'تواصل معنا' : 'Contact us'
  const languagesLabel = isRtl ? 'اللغات' : 'Languages'

  const closeMenu = useCallback(() => {
    const active = document.activeElement
    if (
      active instanceof HTMLElement &&
      menuPanelRef.current?.contains(active)
    ) {
      active.blur()
    }
    setMenuOpen(false)
    requestAnimationFrame(() => {
      menuToggleRef.current?.focus()
    })
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') closeMenu()
    }
    document.addEventListener('keydown', onKeyDown)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = prev
    }
  }, [menuOpen, closeMenu])

  /** Full-screen panel — reveals top → bottom; portaled to body. */
  const mobileMenuPortal =
    typeof document !== 'undefined'
      ? createPortal(
          <aside
            ref={menuPanelRef}
            id={menuId}
            role="dialog"
            aria-modal={menuOpen}
            aria-hidden={!menuOpen}
            inert={!menuOpen}
            style={{ backgroundColor: MOBILE_MENU_BG }}
            className={`mobile-menu-panel fixed inset-0 z-[110] flex h-dvh min-h-dvh flex-col md:hidden ${
              menuOpen ? 'mobile-menu-panel--open' : ''
            }`}
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            {/* Logo (left) + close (right) — LTR bar so positions stay consistent */}
            <div
              className="flex shrink-0 items-center justify-between px-5 py-5"
              dir="ltr"
            >
              <img
                src={logoWhite}
                alt="Mafateeh"
                className="h-10 w-auto max-w-[9rem] object-contain sm:h-11"
                width={160}
                height={48}
                decoding="async"
              />
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 text-white transition hover:border-secondary hover:text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
                aria-label="Close menu"
                tabIndex={menuOpen ? 0 : -1}
                onClick={closeMenu}
              >
                <IconClose className="h-5 w-5" />
              </button>
            </div>

            <nav
              className="flex flex-1 flex-col overflow-y-auto px-5 pb-10"
              aria-label="Mobile primary"
            >
              <ul className="flex flex-col">
                {NAV_ITEMS.map((item) => {
                  const label = isRtl ? item.ar : item.en
                  const active = isNavActive(item.href, pathname)
                  return (
                    <li key={item.key}>
                      <div className="py-4">
                        <a
                          href={item.href}
                          className={mobileMenuNavLinkClass(active)}
                          aria-current={active ? 'page' : undefined}
                          tabIndex={menuOpen ? 0 : -1}
                          onClick={closeMenu}
                        >
                          {label}
                        </a>
                      </div>
                      <div
                        className="mobile-menu-divider w-full"
                        aria-hidden
                      />
                    </li>
                  )
                })}
              </ul>

              <div className="mt-10 flex flex-col">
                <p className="font-body text-xl font-bold text-white sm:text-2xl">
                  {languagesLabel}
                </p>
                <button
                  type="button"
                  className="mt-4 inline-flex w-fit items-center justify-center transition hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
                  onClick={() => {
                    toggleLocale()
                  }}
                  tabIndex={menuOpen ? 0 : -1}
                  aria-label={
                    locale === 'en'
                      ? 'Switch language to Arabic'
                      : 'Switch language to English'
                  }
                >
                  <LanguageFlag
                    locale={locale}
                    className="h-8 w-auto shrink-0 rounded-sm object-cover"
                  />
                </button>
                <a
                  href="/contact"
                  className="mt-8 flex w-full items-center justify-center rounded-lg bg-secondary px-6 py-3.5 font-body text-base font-semibold text-white shadow-sm transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
                  tabIndex={menuOpen ? 0 : -1}
                  onClick={closeMenu}
                >
                  {contactLabel}
                </a>
              </div>
            </nav>
          </aside>,
          document.body,
        )
      : null

  return (
    <>
      {mobileMenuPortal}

      <header className="sticky top-0 z-50 border-b border-line bg-background dark:border-b-0">
        <div className="site-container relative py-2 sm:py-2.5">
          <div
            className="flex w-full items-center justify-between gap-2 sm:gap-3"
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            <div className="flex min-w-0 flex-1 items-center gap-3 md:gap-4 lg:gap-5">
              <a
                href="/"
                className="block shrink-0 outline-none ring-primary focus-visible:ring-2"
                aria-label="Mafateeh"
                onClick={closeMenu}
              >
                <img
                  src={logo}
                  alt=""
                  className="h-10 w-auto max-w-[8rem] object-contain sm:h-11 sm:max-w-[9rem] md:h-15 md:max-w-[12rem] md:mr-8 dark:hidden"
                  width={160}
                  height={48}
                  decoding="async"
                />
                <img
                  src={logoWhite}
                  alt=""
                  className="hidden h-10 w-auto max-w-[8rem] object-contain sm:h-11 sm:max-w-[9rem] md:h-15 md:max-w-[12rem] md:mr-8 dark:block"
                  width={160}
                  height={48}
                  decoding="async"
                />
              </a>

              <nav
                className="hidden min-w-0 md:block"
                aria-label="Primary"
              >
                <ul className="flex flex-wrap items-end justify-start gap-x-3 gap-y-1 lg:gap-x-6">
                  {NAV_ITEMS.map((item) => {
                    const label = isRtl ? item.ar : item.en
                    const active = isNavActive(item.href, pathname)
                    return (
                      <li key={item.key}>
                        <a
                          href={item.href}
                          className={navLinkClass(active)}
                          aria-current={active ? 'page' : undefined}
                        >
                          {label}
                        </a>
                      </li>
                    )
                  })}
                </ul>
              </nav>
            </div>

            <div className="hidden shrink-0 items-center md:flex md:gap-5 lg:gap-6">
              <HeaderActions
                contactLabel={contactLabel}
                locale={locale}
                onToggleLocale={toggleLocale}
              />
            </div>

            <div className="flex shrink-0 items-center gap-2 md:hidden">
              <ThemeToggle tabIndex={0} />
              <button
                ref={menuToggleRef}
                type="button"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-line bg-card text-foreground transition hover:border-primary/40"
                aria-expanded={menuOpen}
                aria-controls={menuId}
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                onClick={() => (menuOpen ? closeMenu() : setMenuOpen(true))}
              >
                <IconMenu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
