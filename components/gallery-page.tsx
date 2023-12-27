import {useState, useEffect} from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import {useRouter} from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import GalleryList from 'components/gallery-list'
import GalleryHeader from 'components/gallery-header'
import {getAbsoluteUrl, sortListBy} from 'lib/utils'
import {
  DEFAULT_IS_ASCENDING_ORDER,
  DEFAULT_SORTING_OPTION,
  GALLERY_ALBUMS
} from 'config/gallery'
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
  const {t} = useTranslation()
  const queryKey = t('gallery.carousel.query-key')
  const {[queryKey]: querySlug} = query
  const [isCarouselOpen, setIsCarouselOpen] = useState(false)
  const [sortingOption, setSortingOption] = useState(DEFAULT_SORTING_OPTION)
  const [isAscendingOrder, setIsAscendingOrder] = useState(
    DEFAULT_IS_ASCENDING_ORDER
  )
  const [items, setItems] = useState(
    sortListBy(pictures, sortingOption) as Picture[]
  )
  const openPicture =
    isCarouselOpen && items.find(item => item.slug === querySlug)
  const openPictureDescription = openPicture?.description?.replaceAll(
    /\n\n/g,
    ' '
  )

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
    setIsCarouselOpen(Boolean(querySlug))
  }, [setIsCarouselOpen, querySlug])

  return (
    <>
      <Head>
        {openPicture ? (
          <>
            <title>Kiko Ruiz / {openPicture.name}</title>
            <meta
              property="og:title"
              content={`Kiko Ruiz / ${openPicture.name}`}
            />
            <meta
              property="og:image"
              content={getAbsoluteUrl(openPicture.image.src)}
            />
            {openPictureDescription ? (
              <>
                <meta name="description" content={openPictureDescription} />
                <meta
                  property="og:description"
                  content={openPictureDescription}
                />
              </>
            ) : (
              <meta
                property="og:description"
                content={t('sections.gallery.description')}
              />
            )}
          </>
        ) : (
          <>
            <meta
              property="og:title"
              content={`Kiko Ruiz / ${t(`gallery.albums.${category}.name`)}`}
            />
            <meta
              property="og:description"
              content={t('sections.gallery.description')}
            />
            <meta
              property="og:image"
              content={getAbsoluteUrl(
                `/pictures/${
                  GALLERY_ALBUMS.find(({id}) => id === category)
                    .highlightedPicture
                }`
              )}
            />
          </>
        )}
      </Head>

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
