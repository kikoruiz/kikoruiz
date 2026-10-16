import HomeSectionsItem from './home-sections-item'
import {SectionImage} from 'types'
import type {SectionPalette} from 'lib/utils/color'

interface HomeSectionsProps {
  images: SectionImage[]
  palette?: SectionPalette
  isCollapsed: boolean
}

export default function HomeSections({
  images,
  palette,
  isCollapsed = false
}: HomeSectionsProps) {
  return (
    <section className="w-full rounded-2xl bg-neutral-900/60 p-1">
      <div className="columns-2 md:flex gap-1">
        {images.map(image => (
          <HomeSectionsItem
            key={image.id}
            palette={palette}
            isCollapsed={isCollapsed}
            {...image}
          />
        ))}
      </div>
    </section>
  )
}

HomeSections.displayName = 'HomeSections'
