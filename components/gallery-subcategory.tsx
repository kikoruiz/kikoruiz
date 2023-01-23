import {useEffect, useRef} from 'react'
import useTranslation from 'next-translate/useTranslation'
import {Picture, Subcategory} from 'types/gallery'
import GalleryListItems from './gallery-list-items'
import icons from './gallery-subcategory-icons'
import {getTitle} from 'lib/utils'

function getOffset(element: Element) {
  const elementRect = element?.getBoundingClientRect()

  return Math.ceil(elementRect?.top)
}

export default function GallerySubcategory({
  index,
  id,
  category,
  visibleSubcategory,
  subcategories,
  items,
  isAlbum,
  sortingOption,
  onChange
}: GallerySubcategoryProps) {
  const {t} = useTranslation()
  const name = t(`gallery.albums.${category}.subcategories.${id}`)
  const Icon = icons[`${getTitle(id).replaceAll('-', '')}Icon`]
  const ref = useRef(null)

  useEffect(() => {
    const element = ref.current
    const breadcrumbOffset = getOffset(document.querySelector('#breadcrumb'))
    const observer = new IntersectionObserver(
      entries => {
        const [entry] = entries
        const {isIntersecting, boundingClientRect} = entry

        if (isIntersecting) {
          onChange({visible: name})
        }

        if (visibleSubcategory !== name) return

        if (!isIntersecting && boundingClientRect.bottom < window.innerHeight) {
          onChange({overlapped: name})
        } else if (index === 0) {
          onChange({overlapped: null})
        } else {
          const previousSubcategory = subcategories[index - 1]
          const previousSubcategoryName = t(
            `gallery.albums.${category}.subcategories.${previousSubcategory.id}`
          )

          onChange({overlapped: previousSubcategoryName})
        }
      },
      {
        threshold: 1,
        rootMargin: `-${breadcrumbOffset}px 0% 0% 0%`
      }
    )

    observer.observe(element)

    return () => observer.unobserve(element)
  }, [
    index,
    id,
    category,
    visibleSubcategory,
    subcategories,
    onChange,
    name,
    t
  ])

  return (
    <div className="mt-3 xl:mt-4" id={id}>
      <header
        ref={ref}
        className="flex items-center rounded-sm bg-gradient-to-r from-neutral-800/30 p-3 text-xl font-light text-neutral-300/60 drop-shadow-sm"
      >
        <Icon className="mr-3 w-9 rounded-full opacity-90" />
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
  visibleSubcategory?: string
  subcategories: Subcategory[]
  items: Picture[]
  isAlbum?: boolean
  sortingOption?: string
  onChange: ({
    visible,
    overlapped
  }: {
    visible?: string
    overlapped?: string
  }) => void
}
