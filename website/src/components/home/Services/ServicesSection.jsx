import { useLanguage } from '../../../context/useLanguage.js'
import { getHomeContent } from '../../../content/index.js'
import { ServiceCard } from './ServiceCard.jsx'

export function ServicesSection() {
  const { locale } = useLanguage()
  const { services } = getHomeContent(locale)

  return (
    <section
      id="services"
      className="section-solid py-14 sm:py-16 lg:py-20 scroll-mt-24"
      aria-labelledby="services-heading"
    >
      <div className="site-container">
        <h2
          id="services-heading"
          className="text-center font-heading text-3xl font-bold text-foreground sm:text-4xl"
          data-aos="fade-down"
        >
          {services.heading}
        </h2>

        <ul className="mt-10 grid grid-cols-1 gap-6 sm:mt-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-8" data-aos="fade-up">
          {services.items.map((item) => (
            <li key={item.title} className="overflow-visible">
              <ServiceCard
                icon={item.icon}
                title={item.title}
                description={item.description}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
