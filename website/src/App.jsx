import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { lazy, Suspense, useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'

import { ScrollToTop } from './components/common/ScrollToTop.jsx'
import { SiteShell } from './components/layout/SiteShell.jsx'
import { LocaleLayout } from './components/routing/LocaleLayout.jsx'
import {
  BlogLegacyRedirect,
  BlogSlugLegacyRedirect,
  LegacyLocaleRedirect,
  RootLocaleRedirect,
} from './components/routing/LocaleRedirects.jsx'
import { SeoProvider } from './context/SeoProvider.jsx'
import { Home } from './pages/Home.jsx'

const BlogPost = lazy(() =>
  import('./pages/BlogPost.jsx').then((m) => ({ default: m.BlogPost })),
)
const Blogs = lazy(() =>
  import('./pages/Blogs.jsx').then((m) => ({ default: m.Blogs })),
)
const PrivacyPolicy = lazy(() =>
  import('./pages/PrivacyPolicy.jsx').then((m) => ({ default: m.PrivacyPolicy })),
)
const TermsAndConditions = lazy(() =>
  import('./pages/TermsAndConditions.jsx').then((m) => ({
    default: m.TermsAndConditions,
  })),
)
const CookiePolicy = lazy(() =>
  import('./pages/CookiePolicy.jsx').then((m) => ({ default: m.CookiePolicy })),
)
const AccessibilityStatement = lazy(() =>
  import('./pages/AccessibilityStatement.jsx').then((m) => ({
    default: m.AccessibilityStatement,
  })),
)
const About = lazy(() =>
  import('./pages/About.jsx').then((m) => ({ default: m.About })),
)
const IT = lazy(() => import('./pages/IT.jsx').then((m) => ({ default: m.IT })))
const Marketing = lazy(() =>
  import('./pages/Marketing.jsx').then((m) => ({ default: m.Marketing })),
)
const Branding = lazy(() =>
  import('./pages/Branding.jsx').then((m) => ({ default: m.Branding })),
)
const Packages = lazy(() =>
  import('./pages/Packages.jsx').then((m) => ({ default: m.Packages })),
)
const Contact = lazy(() =>
  import('./pages/Contact.jsx').then((m) => ({ default: m.Contact })),
)
const NotFound = lazy(() =>
  import('./pages/NotFound.jsx').then((m) => ({ default: m.NotFound })),
)

const AOS_MIN_WIDTH = 1024

function shouldDisableAos() {
  return window.innerWidth < AOS_MIN_WIDTH
}

function RouteFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center" aria-busy="true">
      <span className="sr-only">Loading</span>
    </div>
  )
}

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true,
      easing: 'ease-in-out',
      disable: shouldDisableAos,
    })

    const onResize = () => {
      AOS.refresh()
    }

    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return (
    <BrowserRouter>
      <SeoProvider>
        <ScrollToTop />
        <SiteShell>
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<RootLocaleRedirect />} />
              <Route path="/blog" element={<BlogLegacyRedirect />} />
              <Route path="/blogs" element={<LegacyLocaleRedirect to="/blogs" />} />
              <Route path="/blogs/:slug" element={<BlogSlugLegacyRedirect />} />
              <Route path="/about" element={<LegacyLocaleRedirect to="/about" />} />
              <Route path="/it-solutions" element={<LegacyLocaleRedirect to="/it-solutions" />} />
              <Route path="/digital-marketing" element={<LegacyLocaleRedirect to="/digital-marketing" />} />
              <Route path="/branding" element={<LegacyLocaleRedirect to="/branding" />} />
              <Route path="/packages" element={<LegacyLocaleRedirect to="/packages" />} />
              <Route path="/contact" element={<LegacyLocaleRedirect to="/contact" />} />
              <Route path="/contact-us" element={<LegacyLocaleRedirect to="/contact" />} />
              <Route path="/privacy-policy" element={<LegacyLocaleRedirect to="/privacy-policy" />} />
              <Route path="/terms-and-conditions" element={<LegacyLocaleRedirect to="/terms-and-conditions" />} />
              <Route path="/cookie-policy" element={<LegacyLocaleRedirect to="/cookie-policy" />} />
              <Route path="/accessibility" element={<LegacyLocaleRedirect to="/accessibility" />} />
              <Route path="/:locale" element={<LocaleLayout />}>
                <Route index element={<Home />} />
                <Route path="blog" element={<Navigate to="../blogs" replace />} />
                <Route path="blogs" element={<Blogs />} />
                <Route path="blogs/:slug" element={<BlogPost />} />
                <Route path="privacy-policy" element={<PrivacyPolicy />} />
                <Route path="terms-and-conditions" element={<TermsAndConditions />} />
                <Route path="cookie-policy" element={<CookiePolicy />} />
                <Route path="accessibility" element={<AccessibilityStatement />} />
                <Route path="about" element={<About />} />
                <Route path="it-solutions" element={<IT />} />
                <Route path="digital-marketing" element={<Marketing />} />
                <Route path="branding" element={<Branding />} />
                <Route path="packages" element={<Packages />} />
                <Route path="contact" element={<Contact />} />
                <Route path="contact-us" element={<Navigate to="../contact" replace />} />
                <Route path="*" element={<NotFound />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </SiteShell>
      </SeoProvider>
    </BrowserRouter>
  )
}

export default App
