import { Icon } from '@iconify/react'
import { MultilineText } from '../../common/MultilineText.jsx'

/**
 * Service card (icon, title, description). Used on home and solution pages.
 *
 * - Home `ServicesSection` → default `align="center"`
 * - Solution pages → `align="start"` with parent `dir` for EN left / AR right
 * - Icons are Iconify names from API or `home.js`
 * - Descriptions support `\n` line breaks via `MultilineText`
 */

/**
 * @param {{
 *   icon: string,
 *   title: string,
 *   description: string,
 *   align?: 'center' | 'start',
 * }} props
 */
export function ServiceCard({ icon, title, description, align = 'center' }) {
  const isStart = align === 'start'

  return (
    <article
      className={[
        'flex h-full flex-col rounded-lg bg-card px-6 py-10 text-foreground shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-[transform,box-shadow] duration-300 ease-out hover:scale-[1.03] hover:shadow-[0_12px_32px_rgba(0,0,0,0.18)] motion-reduce:transition-none motion-reduce:hover:scale-100 dark:shadow-[0_4px_32px_rgba(254,254,254,0.12),0_0_2px_rgba(254,254,254,0.16)] dark:hover:shadow-[0_8px_40px_rgba(254,254,254,0.12),0_0_2px_rgba(254,254,254,0.16)]',
        isStart ? 'items-start text-start' : 'items-center text-center',
      ].join(' ')}
    >
      <Icon
        icon={icon}
        className="h-12 w-12 text-primary dark:text-secondary"
        aria-hidden
      />
      <h3 className="mt-5 font-heading text-xl font-semibold text-foreground">
        {title}
      </h3>
      <MultilineText
        as="p"
        className="mt-3 font-body text-base leading-relaxed text-foreground/80"
      >
        {description}
      </MultilineText>
    </article>
  )
}
