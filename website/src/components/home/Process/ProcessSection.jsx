import { useLanguage } from '../../../context/useLanguage.js'
import { getHomeContent } from '../../../content/index.js'
import { ProcessCenterImage } from './ProcessCenterImage.jsx'
import { ProcessFlowArrows } from './ProcessFlowArrows.jsx'
import { ProcessDiagramStep, ProcessStepCard } from './ProcessStepPoint.jsx'

export function ProcessSection() {
  const { locale } = useLanguage()
  const { process } = getHomeContent(locale)
  const isRtl = locale === 'ar'
  const [step1, step2, step3, step4] = process.steps

  return (
    <section className="section-solid py-16 sm:py-20 lg:py-24" aria-labelledby="process-heading">
      <div className="site-container">
        <h2
          id="process-heading"
          className="text-center font-heading text-3xl font-bold text-foreground sm:text-4xl"
        >
          {process.heading}
        </h2>

        {/* Desktop — wide grid matching reference */}
        <div className="relative mx-auto mt-14 hidden w-full max-w-6xl lg:block xl:max-w-[72rem]">
          <div className="process-diagram relative min-h-[34rem] w-full xl:min-h-[36rem]">
            <ProcessFlowArrows isRtl={isRtl} />

            <div className="relative z-10 grid h-full min-h-[34rem] w-full grid-cols-[1fr_auto_1fr] grid-rows-[auto_1fr_auto] items-center gap-x-4 gap-y-6 xl:min-h-[36rem] xl:gap-x-8 xl:gap-y-8">
              <div className="col-start-2 row-start-1 flex justify-center px-2">
                <ProcessDiagramStep
                  icon={step1.icon}
                  title={step1.title}
                  subtitle={step1.subtitle}
                />
              </div>

              <div className="col-start-1 row-start-2 flex justify-end pe-2 xl:pe-8">
                <ProcessDiagramStep
                  icon={step4.icon}
                  title={step4.title}
                  subtitle={step4.subtitle}
                />
              </div>

              <div className="col-start-2 row-start-2 flex justify-center">
                <ProcessCenterImage />
              </div>

              <div className="col-start-3 row-start-2 flex justify-start ps-2 xl:ps-6">
                <ProcessDiagramStep
                  icon={step2.icon}
                  title={step2.title}
                  subtitle={step2.subtitle}
                />
              </div>

              <div className="col-start-2 row-start-3 flex justify-center px-2 xl:px-8">
                <ProcessDiagramStep
                  icon={step3.icon}
                  title={step3.title}
                  subtitle={step3.subtitle}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile */}
        <div className="mt-12 flex flex-col gap-12 sm:mt-14 lg:hidden">
          <ProcessStepCard icon={step1.icon} title={step1.title} subtitle={step1.subtitle} />
          <ProcessStepCard icon={step2.icon} title={step2.title} subtitle={step2.subtitle} />
          <ProcessCenterImage />
          <ProcessStepCard icon={step3.icon} title={step3.title} subtitle={step3.subtitle} />
          <ProcessStepCard icon={step4.icon} title={step4.title} subtitle={step4.subtitle} />
        </div>
      </div>
    </section>
  )
}
