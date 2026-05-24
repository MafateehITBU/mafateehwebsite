const CARD_COUNT = 6

function Shimmer({ className = '' }) {
  return <span className={['skeleton-shimmer block rounded-md', className].join(' ')} aria-hidden />
}

function BlogCardSkeleton() {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl bg-card shadow-[0_2px_12px_rgba(0,0,0,0.08)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.35)]">
      <Shimmer className="aspect-[16/8] w-full rounded-none" />
      <div className="flex flex-1 flex-col px-5 py-4 sm:px-6">
        <Shimmer className="h-3 w-24" />
        <Shimmer className="mt-3 h-5 w-full" />
        <Shimmer className="mt-2 h-5 w-[88%]" />
        <Shimmer className="mt-3 h-4 w-full" />
        <Shimmer className="mt-1.5 h-4 w-[92%]" />
        <div className="mt-4 h-px w-full bg-line" aria-hidden />
        <div className="mt-4 flex justify-between gap-3">
          <Shimmer className="h-4 w-20" />
          <Shimmer className="h-4 w-16" />
        </div>
      </div>
    </article>
  )
}

function SidebarSkeleton() {
  return (
    <aside className="flex flex-col gap-8" aria-hidden>
      <Shimmer className="h-12 w-full rounded-lg" />
      <div className="flex flex-col gap-3">
        <Shimmer className="h-5 w-28" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2 py-1">
            <div className="flex justify-between gap-3">
              <Shimmer className="h-4 w-32" />
              <Shimmer className="h-4 w-6" />
            </div>
            <Shimmer className="h-px w-full rounded-none" />
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-3">
        <Shimmer className="h-5 w-16" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Shimmer key={i} className="h-8 w-16 rounded-md" />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <Shimmer className="h-5 w-32" />
        <div className="flex gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Shimmer key={i} className="h-7 w-7 rounded-full" />
          ))}
        </div>
      </div>
    </aside>
  )
}

/** @param {{ message: string }} props */
export function BlogsPageLoader({ message }) {
  return (
    <div
      className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(260px,320px)] lg:items-start lg:gap-12 xl:grid-cols-[minmax(0,1fr)_360px] xl:gap-14"
      aria-busy="true"
      aria-live="polite"
      aria-label={message}
    >
      <div className="min-w-0">
        <p className="sr-only">{message}</p>
        <div className="mb-8 flex items-center justify-center gap-3 lg:justify-start">
          <span className="blogs-loader-spinner inline-block h-8 w-8 rounded-full border-[3px] border-primary/25 border-t-primary dark:border-t-secondary" />
          <span className="font-body text-sm font-medium text-foreground/70 sm:text-base">
            {message}
          </span>
        </div>
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-6 lg:gap-7">
          {Array.from({ length: CARD_COUNT }).map((_, index) => (
            <li
              key={index}
              className="blogs-skeleton-fade-in"
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <BlogCardSkeleton />
            </li>
          ))}
        </ul>
      </div>
      <SidebarSkeleton />
    </div>
  )
}
