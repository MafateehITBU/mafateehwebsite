import { Icon } from '@iconify/react'

/** Desktop diagram step — icon left, uppercase heading + gray body (reference layout) */
export function ProcessDiagramStep({ icon, title, subtitle, className = '' }) {
  return (
    <article
      dir="ltr"
      className={[
        'process-diagram-step group flex max-w-[15.5rem] items-center gap-3.5 sm:max-w-[17rem] sm:gap-4 lg:max-w-[20rem]',
        className,
      ].join(' ')}
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center sm:h-12 sm:w-12 lg:h-25 lg:w-25">
        <Icon
          icon={icon}
          className="h-full w-full text-primary transition-transform duration-300 ease-out group-hover:-translate-y-1 dark:text-white"
          aria-hidden
        />
      </span>
      <div className="min-w-0 flex-1 text-left">
        <h3 className="font-heading text-[0.7rem] font-bold uppercase leading-[1.35] tracking-wide text-foreground sm:text-xs lg:text-[1.125rem]">
          {title}
        </h3>
        <p className="mt-2 font-body text-[0.6875rem] leading-relaxed text-[#6b7280] dark:text-gray-400 sm:text-xs lg:text-[1.0625rem] lg:leading-relaxed">
          {subtitle}
        </p>
      </div>
    </article>
  )
}

/** Mobile stack: icon → title → subtitle, centered */
export function ProcessStepCard({ icon, title, subtitle }) {
  return (
    <article className="process-step group flex w-full flex-col items-center gap-3 rounded-xl border border-line px-5 py-6 text-center dark:border-[#157037] sm:gap-4 sm:px-6 sm:py-7">
      <Icon
        icon={icon}
        className="h-12 w-12 text-primary transition-transform duration-300 ease-out group-hover:-translate-y-1 dark:text-white sm:h-14 sm:w-14"
        aria-hidden
      />
      <h3 className="max-w-sm font-heading text-sm font-bold uppercase leading-snug tracking-wide text-foreground">
        {title}
      </h3>
      <p className="max-w-sm font-body text-sm leading-relaxed text-[#6b7280] dark:text-gray-400">
        {subtitle}
      </p>
    </article>
  )
}
