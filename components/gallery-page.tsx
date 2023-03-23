import {useState, useEffect} from 'react'
import dynamic from 'next/dynamic'
import {useRouter} from 'next/router'
import GalleryList from 'components/gallery-list'
import GalleryHeader from 'components/gallery-header'
import {sortListBy} from 'lib/utils'
import {
  DEFAULT_IS_ASCENDING_ORDER,
  DEFAULT_SORTING_OPTION
} from 'config/gallery'
import useSubcategoryContext from 'contexts/subcategory'
import {Picture, Subcategory} from 'types/gallery'

const DynamicGalleryCarousel = dynamic(
  () => import('components/gallery-carousel')
)

export default function GalleryPage({
  pictures,
  category,
  subcategories
}: GalleryPageProps) {
  const {query} = useRouter()
  const {carousel} = query
  const [isCarouselOpen, setIsCarouselOpen] = useState(false)
  const [sortingOption, setSortingOption] = useState(DEFAULT_SORTING_OPTION)
  const [isAscendingOrder, setIsAscendingOrder] = useState(
    DEFAULT_IS_ASCENDING_ORDER
  )
  const [items, setItems] = useState(
    sortListBy(pictures, sortingOption) as Picture[]
  )
  const {setSubcategory} = useSubcategoryContext()
  const hasSubcategories = subcategories?.length > 0

  function handleSortingChange(event) {
    const option = event.target.value

    setSortingOption(option)
  }

  function toggleSortingDirection() {
    setIsAscendingOrder(!isAscendingOrder)
  }

  useEffect(() => {
    const sortedItems = sortListBy(pictures, sortingOption) as Picture[]

    setItems(isAscendingOrder ? [...sortedItems].reverse() : [...sortedItems])
  }, [pictures, sortingOption, isAscendingOrder])

  useEffect(() => {
    setIsCarouselOpen(Boolean(carousel))
  }, [setIsCarouselOpen, carousel])

  // Reset subcategory value.
  useEffect(
    () => () => {
      if (hasSubcategories) setSubcategory(null)
    },
    [hasSubcategories, setSubcategory]
  )

  return (
    <>
      <GalleryHeader />

      <GalleryList
        pictures={items}
        category={category}
        subcategories={subcategories}
        onSort={handleSortingChange}
        sortingOption={sortingOption}
        toggleSortingDirection={toggleSortingDirection}
        isAscendingOrder={isAscendingOrder}
      />

      {isCarouselOpen && (
        <DynamicGalleryCarousel
          pictures={items}
          category={category}
          subcategories={subcategories}
          setIsCarouselOpen={setIsCarouselOpen}
        />
      )}
    </>
  )
}

interface GalleryPageProps {
  pictures: Picture[]
  category?: string
  subcategories?: Subcategory[]
}
