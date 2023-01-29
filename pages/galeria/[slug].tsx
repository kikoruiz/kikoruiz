import {useState, useEffect} from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import {useRouter} from 'next/router'
import getT from 'next-translate/getT'
import GalleryList from 'components/gallery-list'
import GalleryHeader from 'components/gallery-header'
import {getGalleryAlbums} from 'lib/gallery/albums'
import {getGalleryPictures} from 'lib/gallery/pictures'
import {fromExifToGallery} from 'lib/gallery/mappers'
import {fromLocalesToAlternates} from 'lib/mappers'
import {getSlug, sortListBy} from 'lib/utils'
import {DEFAULT_SORTING_OPTION, GALLERY_ALBUMS} from 'config/gallery'
import useSubcategoryContext from 'contexts/subcategory'
import {Picture, Subcategory} from 'types/gallery'
import {Alternate} from 'types'

export const config = {
  unstable_excludeFiles: ['public/**/*']
}

const DynamicGalleryCarousel = dynamic(
  () => import('../../components/gallery-carousel')
)

export default function GalleryAlbum({
  pictures,
  category,
  subcategories,
  alternates
}: GalleryAlbumProps) {
  const {query} = useRouter()
  const {carousel} = query
  const [isCarouselOpen, setIsCarouselOpen] = useState(false)
  const [sortingOption, setSortingOption] = useState(DEFAULT_SORTING_OPTION)
  const [isReversedSorting, setIsReversedSorting] = useState(false)
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
    setIsReversedSorting(!isReversedSorting)
  }

  useEffect(() => {
    const sortedItems = sortListBy(pictures, sortingOption) as Picture[]

    setItems(isReversedSorting ? [...sortedItems].reverse() : [...sortedItems])
  }, [pictures, sortingOption, isReversedSorting])

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
      <Head>
        <title>Kiko Ruiz</title>
        {alternates.map(({locale, href}) => (
          <link key={locale} rel="alternate" hrefLang={locale} href={href} />
        ))}
      </Head>

      <GalleryHeader />
      <GalleryList
        pictures={items}
        category={category}
        subcategories={subcategories}
        onSort={handleSortingChange}
        sortingOption={sortingOption}
        toggleSortingDirection={toggleSortingDirection}
        isReversedSorting={isReversedSorting}
      />
      {isCarouselOpen && (
        <DynamicGalleryCarousel
          pictures={items}
          subcategories={subcategories}
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
  const pictures: Picture[] = await Promise.all(
    galleryPictures.map(fromExifToGallery({locale, slug}))
  )
  const t = await getT(locale, 'common')
  const category = GALLERY_ALBUMS.find(({id}) => {
    const albumSlug = getSlug(t(`gallery.albums.${id}.name`))

    return albumSlug === slug
  })
  const subcategories = category?.subcategories
  const alternates: Alternate[] = await Promise.all(
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
    props: {
      pictures,
      ...(category && {category: category.id}),
      ...(subcategories && {subcategories}),
      alternates,
      section
    }
  }
}

interface GalleryAlbumProps {
  pictures: Picture[]
  category?: string
  subcategories?: Subcategory[]
  alternates: Alternate[]
}
