import { useRef, useState } from 'react'
import { Icon } from '@iconify/react'
import { Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { PricingCard } from './PricingCard.jsx'

import 'swiper/css'

/**
 * @param {{
 *   packages: Array<Record<string, unknown>>,
 *   locale: 'en' | 'ar',
 *   requestQuoteLabel: string,
 *   prevLabel: string,
 *   nextLabel: string,
 * }} props
 */
export function PricingCarousel({
  packages,
  locale,
  requestQuoteLabel,
  prevLabel,
  nextLabel,
}) {
  const swiperRef = useRef(/** @type {import('swiper').Swiper | null} */ (null))
  const [activeIndex, setActiveIndex] = useState(0)
  const length = packages.length
  const enableLoop = length > 1

  if (length === 0) return null

  const navButtonClass =
    'inline-flex h-9 w-9 items-center justify-center rounded-full text-primary transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:text-secondary dark:focus-visible:outline-secondary'

  return (
    <div className="pricing-swiper-wrap relative mt-10 sm:mt-12">
      <Swiper
        className="pricing-swiper cursor-grab active:cursor-grabbing"
        dir="rtl"
        modules={[Autoplay]}
        onSwiper={(swiper) => {
          swiperRef.current = swiper
          setActiveIndex(swiper.realIndex)
        }}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        slidesPerView={1}
        centeredSlides
        spaceBetween={2}
        speed={700}
        loop={enableLoop}
        grabCursor
        watchSlidesProgress
        autoplay={
          length > 1
            ? {
                delay: 5000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }
            : false
        }
        breakpoints={{
          640: {
            slidesPerView: 1.35,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 24,
          },
        }}
      >
        {packages.map((pkg, index) => (
          <SwiperSlide key={String(pkg.id)} className="!h-auto">
            <PricingCard
              pkg={pkg}
              locale={locale}
              isActive={activeIndex === index}
              requestQuoteLabel={requestQuoteLabel}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {enableLoop ? (
        <div
          dir="ltr"
          className="mt-6 flex items-center justify-center gap-5 sm:mt-8"
        >
          <button
            type="button"
            className={navButtonClass}
            aria-label={prevLabel}
            onClick={() => swiperRef.current?.slidePrev()}
          >
            <Icon icon="solar:arrow-left-linear" className="h-5 w-5" aria-hidden />
          </button>
          <button
            type="button"
            className={navButtonClass}
            aria-label={nextLabel}
            onClick={() => swiperRef.current?.slideNext()}
          >
            <Icon icon="solar:arrow-right-linear" className="h-5 w-5" aria-hidden />
          </button>
        </div>
      ) : null}
    </div>
  )
}
