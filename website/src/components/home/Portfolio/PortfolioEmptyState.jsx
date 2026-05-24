import { Icon } from '@iconify/react'

/** @param {{ message: string }} props */
export function PortfolioEmptyState({ message }) {
  return (
    <div className="flex flex-col items-center gap-4 py-10 sm:py-12">
      <Icon
        icon="solar:folder-open-outline"
        className="portfolio-empty-bob h-14 w-14 text-foreground/35 dark:text-foreground/45 sm:h-16 sm:w-16"
        aria-hidden
      />
      <p className="max-w-sm text-center font-body text-foreground/70">{message}</p>
    </div>
  )
}
