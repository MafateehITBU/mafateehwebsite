import { pickLocalized } from './portfolioLocale.js'

const ACTIVE =
  'border-[#157037] bg-[#157037] text-white hover:border-[#157037] hover:text-white'
const INACTIVE =
  'border-line bg-transparent text-foreground hover:border-[#157037] hover:text-[#157037] dark:border-white dark:text-foreground dark:hover:border-[#157037] dark:hover:text-[#157037]'

/**
 * @param {{
 *   categories: Array<{ id: string, name: string, nameAr?: string | null }>,
 *   activeId: string,
 *   allLabel: string,
 *   locale: 'en' | 'ar',
 *   onSelect: (id: string) => void,
 * }} props
 */
export function PortfolioCategoryTabs({ categories, activeId, allLabel, locale, onSelect }) {
  return (
    <div
      className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5"
      role="tablist"
      aria-label={allLabel}
    >
      <button
        type="button"
        role="tab"
        aria-selected={activeId === 'all'}
        onClick={() => onSelect('all')}
        className={[
          'cursor-pointer rounded-lg border px-4 py-2 font-body text-md font-medium transition-colors duration-200',
          activeId === 'all' ? ACTIVE : INACTIVE,
        ].join(' ')}
      >
        {allLabel}
      </button>
      {categories.map((cat) => {
        const label = pickLocalized(locale, cat.name, cat.nameAr)
        const isActive = activeId === cat.id
        return (
          <button
            key={cat.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(cat.id)}
            className={[
              'cursor-pointer rounded-lg border px-4 py-2 font-body text-md font-medium transition-colors duration-200',
              isActive ? ACTIVE : INACTIVE,
            ].join(' ')}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
