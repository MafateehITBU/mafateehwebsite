import { AboutJourneySection } from './AboutJourneySection.jsx'
import { AboutStorySection } from './AboutStorySection.jsx'

/** About page body — story/mission block then journey/gallery block. */
export function AboutPageContent() {
  return (
    <>
      <AboutStorySection />
      <AboutJourneySection />
    </>
  )
}
