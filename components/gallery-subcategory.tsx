import {useEffect} from 'react'
import {useInView} from 'react-intersection-observer'
import useTranslation from 'next-translate/useTranslation'
import {Picture} from 'types/gallery'
import GalleryListItems from './gallery-list-items'

export default function GallerySubcategory({
  index,
  id,
  category,
  items,
  isAlbum,
  sortingOption,
  onChange
}: GallerySubcategoryProps) {
  const {t} = useTranslation()
  const name = t(`gallery.albums.${category}.subcategories.${id}`)
  const {ref, inView, entry} = useInView({
    threshold: 0,
    trackVisibility: true,
    delay: 300
  })

  useEffect(() => {
    if (!entry) return

    const {
      isIntersecting,
      isVisible
    }: {isIntersecting: boolean; isVisible?: boolean} = entry

    if (inView && isIntersecting) {
      if (!isVisible) {
        onChange(name)
      }
      if (isVisible && index === 0) {
        onChange(null)
      }
    }
  }, [inView, entry, onChange, name, index])

  return (
    <div ref={ref} className="mt-3 xl:mt-4" id={id}>
      <header className="rounded-sm bg-gradient-to-r from-neutral-800/30 p-3 text-xl font-light text-neutral-300/60 drop-shadow-sm">
        {name}
      </header>

      <GalleryListItems
        items={items}
        isAlbum={isAlbum}
        sortingOption={sortingOption}
      />
    </div>
  )
}

interface GallerySubcategoryProps {
  index: number
  id: string
  category?: string
  items: Picture[]
  isAlbum?: boolean
  sortingOption?: string
  onChange: (name: string) => void
}
