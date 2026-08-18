import { lazy, Suspense } from 'react'
import { Header } from '../components/layout/Header.jsx'
import { HeroSection } from '../components/home/Hero/HeroSection.jsx'
import { LazyWhenVisible } from '../components/common/LazyWhenVisible.jsx'

const ServicesSection = lazy(() =>
  import('../components/home/Services/ServicesSection.jsx').then((m) => ({
    default: m.ServicesSection,
  })),
)
const CompanySection = lazy(() =>
  import('../components/home/Company/CompanySection.jsx').then((m) => ({
    default: m.CompanySection,
  })),
)
const PromoSection = lazy(() =>
  import('../components/home/Promo/PromoSection.jsx').then((m) => ({
    default: m.PromoSection,
  })),
)
const ProcessSection = lazy(() =>
  import('../components/home/Process/ProcessSection.jsx').then((m) => ({
    default: m.ProcessSection,
  })),
)
const PortfolioSection = lazy(() =>
  import('../components/home/Portfolio/PortfolioSection.jsx').then((m) => ({
    default: m.PortfolioSection,
  })),
)
const PartnersSection = lazy(() =>
  import('../components/home/Partners/PartnersSection.jsx').then((m) => ({
    default: m.PartnersSection,
  })),
)
const PricingSection = lazy(() =>
  import('../components/home/Pricing/PricingSection.jsx').then((m) => ({
    default: m.PricingSection,
  })),
)
const TestimonialsSection = lazy(() =>
  import('../components/home/Testimonials/TestimonialsSection.jsx').then((m) => ({
    default: m.TestimonialsSection,
  })),
)
const BlogsSection = lazy(() =>
  import('../components/home/Blogs/BlogsSection.jsx').then((m) => ({
    default: m.BlogsSection,
  })),
)

function SectionFallback({ minHeight = '12rem' }) {
  return <div aria-hidden style={{ minHeight }} />
}

export function Home() {
  return (
    <>
      <Header />
      <main className="site-container text-white">
        <HeroSection />
      </main>
      <LazyWhenVisible minHeight="20rem">
        <Suspense fallback={<SectionFallback minHeight="20rem" />}>
          <ServicesSection />
        </Suspense>
      </LazyWhenVisible>
      <LazyWhenVisible minHeight="18rem">
        <Suspense fallback={<SectionFallback minHeight="18rem" />}>
          <CompanySection />
        </Suspense>
      </LazyWhenVisible>
      <LazyWhenVisible minHeight="16rem">
        <Suspense fallback={<SectionFallback minHeight="16rem" />}>
          <PromoSection />
        </Suspense>
      </LazyWhenVisible>
      <LazyWhenVisible minHeight="18rem">
        <Suspense fallback={<SectionFallback minHeight="18rem" />}>
          <ProcessSection />
        </Suspense>
      </LazyWhenVisible>
      <LazyWhenVisible minHeight="20rem">
        <Suspense fallback={<SectionFallback minHeight="20rem" />}>
          <PortfolioSection />
        </Suspense>
      </LazyWhenVisible>
      <LazyWhenVisible minHeight="14rem">
        <Suspense fallback={<SectionFallback minHeight="14rem" />}>
          <PartnersSection />
        </Suspense>
      </LazyWhenVisible>
      <LazyWhenVisible minHeight="18rem">
        <Suspense fallback={<SectionFallback minHeight="18rem" />}>
          <PricingSection />
        </Suspense>
      </LazyWhenVisible>
      <LazyWhenVisible minHeight="16rem">
        <Suspense fallback={<SectionFallback minHeight="16rem" />}>
          <TestimonialsSection />
        </Suspense>
      </LazyWhenVisible>
      <LazyWhenVisible minHeight="16rem">
        <Suspense fallback={<SectionFallback minHeight="16rem" />}>
          <BlogsSection />
        </Suspense>
      </LazyWhenVisible>
    </>
  )
}
