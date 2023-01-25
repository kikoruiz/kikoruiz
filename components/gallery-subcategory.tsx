import {useEffect, useRef} from 'react'
import useTranslation from 'next-translate/useTranslation'
import {Picture, Subcategory} from 'types/gallery'
import GalleryListItems from './gallery-list-items'
import icons from './gallery-subcategory-icons'
import {getCapitalizedName} from 'lib/utils'

function getOffset(element: Element, side: 'top' | 'bottom' = 'top') {
  const elementRect = element?.getBoundingClientRect()

  return Math.ceil(elementRect?.[side])
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
  const Icon = icons[`${getCapitalizedName(id)}Icon`]
  const elementRef = useRef(null)
  const anchorRef = useRef(null)

  useEffect(() => {
    const element = elementRef.current
    const anchor = anchorRef.current
    const breadcrumbElement = document.querySelector('#breadcrumb')
    const breadcrumbOffset = getOffset(breadcrumbElement)
    const breadcrumbOffsetBottom = getOffset(breadcrumbElement, 'bottom')
    const observer = new IntersectionObserver(
      entries => {
        const [entry] = entries
        const {isIntersecting, boundingClientRect} = entry

        if (isIntersecting) {
          onChange({visible: id})
        }

        if (visibleSubcategory !== id) return

        if (!isIntersecting && boundingClientRect.bottom < window.innerHeight) {
          onChange({overlapped: id})
        } else if (index === 0) {
          onChange({overlapped: null})
        } else {
          const previousSubcategory = subcategories[index - 1]

          onChange({overlapped: previousSubcategory.id})
        }
      },
      {
        threshold: 1,
        rootMargin: `-${breadcrumbOffset}px 0% 0% 0%`
      }
    )

    anchor.style.top = `-${
      breadcrumbOffsetBottom - element.getBoundingClientRect().height
    }px`
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
    <div className={`relative ${index === 0 ? 'mt-3' : 'mt-12'}`}>
      <span id={id} ref={anchorRef} aria-hidden="true" className="absolute" />
      <header
        ref={elementRef}
        className="flex items-center rounded bg-gradient-to-r from-neutral-800/30 p-3 text-3xl font-extrabold text-orange-300/60 drop-shadow-sm"
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
