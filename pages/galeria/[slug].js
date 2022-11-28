import {useState, useEffect} from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import {useRouter} from 'next/router'
import getT from 'next-translate/getT'
import GalleryList from '../../components/gallery-list.js'
import GalleryHeader from '../../components/gallery-header.js'
import {getGalleryAlbums} from '../../lib/gallery/albums.js'
import {getGalleryPictures} from '../../lib/gallery/pictures.js'
import {fromExifToGallery} from '../../lib/gallery/mappers.js'
import {fromLocalesToAlternates} from '../../lib/mappers.js'
import {getSlug, sortListBy} from '../../lib/utils.js'
import {DEFAULT_SORTING_OPTION} from '../../config/gallery.js'

const DynamicGalleryCarousel = dynamic(() =>
  import('../../components/gallery-carousel.js')
)

export default function GalleryAlbum({pictures, alternates}) {
  const {query} = useRouter()
  const {carousel} = query
  const [isCarouselOpen, setIsCarouselOpen] = useState(false)
  const [sortingOption, setSortingOption] = useState(DEFAULT_SORTING_OPTION)
  const [isReversedSorting, setIsReversedSorting] = useState(false)
  const [items, setItems] = useState(sortListBy(pictures, sortingOption))

  function handleSortingChange(event) {
    const option = event.target.value

    setSortingOption(option)
  }

  function toggleSortingDirection() {
    setIsReversedSorting(!isReversedSorting)
  }

  useEffect(() => {
    const sortedItems = sortListBy(pictures, sortingOption)

    setItems(isReversedSorting ? [...sortedItems].reverse() : [...sortedItems])
  }, [pictures, sortingOption, isReversedSorting])

  useEffect(() => {
    setIsCarouselOpen(Boolean(carousel))
  }, [setIsCarouselOpen, carousel])

  return (
    <>
      <Head>
        <title>Kiko Ruiz</title>
        {alternates.map(({locale, href}) => (
          <link key={locale} rel="alternate" hrefLang={locale} href={href} />
        ))}
      </Head>

      <GalleryHeader />
      <GalleryList
        items={items}
        onSort={handleSortingChange}
        sortingOption={sortingOption}
        toggleSortingDirection={toggleSortingDirection}
        isReversedSorting={isReversedSorting}
      />
      {isCarouselOpen && (
        <DynamicGalleryCarousel
          items={items}
          setIsCarouselOpen={setIsCarouselOpen}
        />
      )}
    </>
  )
}

export async function getStaticPaths({locales}) {
  let paths = []
  const albums = await getGalleryAlbums()

  for (const locale of locales) {
    const t = await getT(locale, 'common')

    paths = paths.concat(
      albums.map(({id}) => {
        const slug = getSlug(t(`gallery.albums.${id}.name`))

        return {
          params: {slug},
          locale
        }
      })
    )
  }

  return {paths, fallback: false}
}

export async function getStaticProps({
  params: {slug},
  locale,
  locales,
  defaultLocale
}) {
  const section = 'gallery'
  const galleryPictures = await getGalleryPictures({locale, slug})
  const pictures = await Promise.all(
    galleryPictures.map(fromExifToGallery({locale, slug}))
  )
  const alternates = await Promise.all(
    locales.map(
      await fromLocalesToAlternates({
        defaultLocale,
        locale,
        section,
        category: slug
      })
    )
  )

  return {
    props: {pictures, alternates, section}
  }
}
