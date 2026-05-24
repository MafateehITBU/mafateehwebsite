import { Icon } from '@iconify/react'

/** @param {{ message: string }} props */
export function BlogsEmptyState({ message }) {
  return (
    <div
      className="flex w-full max-w-md flex-col items-center gap-5 px-4 text-center"
      role="status"
    >
      <span className="blogs-empty-bob inline-flex text-primary/55 dark:text-secondary/75">
        <Icon
          icon="solar:file-text-outline"
          className="h-16 w-16 sm:h-20 sm:w-20"
          aria-hidden
        />
      </span>
      <p className="font-body text-base text-foreground/70 sm:text-lg">{message}</p>
    </div>
  )
}
