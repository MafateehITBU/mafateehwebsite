import { ServiceCard } from '../home/Services/ServiceCard.jsx'

/**
 * Section 1 grid: 3 columns; first card spans 2 columns on md+.
 *
 * EDIT:
 * - Column span / gaps → Tailwind classes on `<ul>` and first `<li>` (md:col-span-2)
 * - Text alignment → section `dir` in parent + `align="start"` on ServiceCard
 */

/**
 * @param {{ items: Array<{ id: string, icon: string, title: string, description: string }> }} props
 */
export function SolutionServicesGrid({ items }) {
  if (items.length === 0) return null

  return (
    <ul className="mt-10 grid grid-cols-1 gap-6 sm:mt-12 md:grid-cols-3 md:gap-8">
      {items.map((item, index) => (
        <li
          key={item.id}
          className={index === 0 ? 'overflow-visible md:col-span-2' : 'overflow-visible'}
        >
          <ServiceCard
            icon={item.icon}
            title={item.title}
            description={item.description}
            align="start"
          />
        </li>
      ))}
    </ul>
  )
}
