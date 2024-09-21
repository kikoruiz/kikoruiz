import HomeSectionsItem from './home-sections-item'
import {SectionImage} from 'types'
import type {ImageAverageColor} from 'types/gallery'

interface HomeSectionsProps {
  images: SectionImage[]
  averageColor?: ImageAverageColor
  isCollapsed: boolean
}

export default function HomeSections({
  images,
  averageColor,
  isCollapsed = false
}: HomeSectionsProps) {
  return (
    <section className="w-full rounded-2xl bg-neutral-900/60 p-1">
      <div className="columns-2 md:flex space-y-1 md:space-y-0 gap-1">
        {images.map(image => (
          <HomeSectionsItem
            key={image.id}
            averageColor={averageColor}
            isCollapsed={isCollapsed}
            {...image}
          />
        ))}
      </div>
    </section>
  )
}
