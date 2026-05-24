import companyImg from '../../../assets/imgs/home/company.png'
import { useLanguage } from '../../../context/useLanguage.js'
import { getHomeContent } from '../../../content/index.js'
// import { SkillProgressBar } from './SkillProgressBar.jsx'

export function CompanySection() {
  const { locale } = useLanguage()
  const { company } = getHomeContent(locale)
  const isRtl = locale === 'ar'

  return (
    <section
      className="section-solid py-14 sm:py-16 lg:py-20"
      aria-labelledby="company-heading"
    >
      <div
        className={[
          'site-container flex flex-col gap-10',
          'lg:flex-row lg:items-center lg:justify-between lg:gap-12',
        ].join(' ')}
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        <div className="flex w-full flex-col gap-6 lg:max-w-xl lg:shrink-0">
          <h3 className="font-heading text-base font-semibold text-primary dark:text-secondary sm:text-lg">
            {company.eyebrow}
          </h3>
          <h2
            id="company-heading"
            className="font-heading text-2xl font-bold leading-tight text-foreground sm:text-3xl lg:text-[2rem]"
          >
            {company.title}
          </h2>
          <p className="font-body text-base leading-relaxed text-foreground sm:text-lg">
            {company.subtitle}
          </p>
          {/* <div className="mt-2 flex flex-col gap-5">
            {company.skills.map((skill, index) => (
              <SkillProgressBar
                key={skill.label}
                label={skill.label}
                percent={skill.percent}
                delayMs={index * 150}
              />
            ))}
          </div> */}
        </div>

        <div className="flex w-full justify-center lg:max-w-[min(55%,40rem)] lg:flex-1 lg:justify-end">
          <img
            src={companyImg}
            alt=""
            className={`h-auto w-full max-w-lg object-contain sm:max-w-xl lg:max-w-[min(100%,38rem)] xl:max-w-[42rem] transition-transform duration-300 ${
              isRtl ? '-scale-x-100' : ''
            }`}
            width={640}
            height={640}
            decoding="async"
            draggable={false}
          />
        </div>
      </div>
    </section>
  )
}
