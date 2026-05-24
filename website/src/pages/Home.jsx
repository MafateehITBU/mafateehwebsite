import { Header } from '../components/layout/Header.jsx'
import { HeroSection } from '../components/home/Hero/HeroSection.jsx'
import { ServicesSection } from '../components/home/Services/ServicesSection.jsx'
import { CompanySection } from '../components/home/Company/CompanySection.jsx'
import { PromoSection } from '../components/home/Promo/PromoSection.jsx'
import { ProcessSection } from '../components/home/Process/ProcessSection.jsx'
import { PortfolioSection } from '../components/home/Portfolio/PortfolioSection.jsx'
import { PartnersSection } from '../components/home/Partners/PartnersSection.jsx'
import { PricingSection } from '../components/home/Pricing/PricingSection.jsx'
import { TestimonialsSection } from '../components/home/Testimonials/TestimonialsSection.jsx'
import { BlogsSection } from '../components/home/Blogs/BlogsSection.jsx'

export function Home() {
  return (
    <>
      <Header />
      <main className="site-container text-white">
        <HeroSection />
      </main>
      <ServicesSection />
      <CompanySection />
      <PromoSection />
      <ProcessSection />
      <PortfolioSection />
      <PartnersSection />
      <PricingSection />
      <TestimonialsSection />
      <BlogsSection />
    </>
  )
}
