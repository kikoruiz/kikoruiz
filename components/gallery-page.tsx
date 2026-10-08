import {useMemo, useState, ChangeEvent} from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import {useRouter} from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import GalleryList from 'components/gallery-list'
import GalleryHeader from 'components/gallery-header'
import {
  getAbsoluteUrl,
  getSocialImageSize,
  getSocialImageUrl,
  sortListBy
} from 'lib/utils'
import {
  DEFAULT_IS_ASCENDING_ORDER,
  DEFAULT_SORTING_OPTION,
  GALLERY_ALBUMS,
  PICTURE_ROUTE
} from 'config/gallery'
import {SITE_NAME} from 'config'
import {Picture, Subcategory} from 'types/gallery'

const DynamicGalleryCarousel = dynamic(
  () => import('components/gallery-carousel')
)

export default function GalleryPage({
  pictures,
  category,
  subcategories,
  basePath,
  openPictureSlug
}: GalleryPageProps) {
  const {query, pathname, locale, defaultLocale} = useRouter()
  const {t} = useTranslation()
  const queryKey = t('gallery.carousel.query-key')
  // `picture` is the dynamic segment of the picture page, while the query key is
  // how the album page tracks the open one behind its masked URL. The router
  // comes first so swiping keeps the head in step without new props.
  const openSlug = (query.picture ??
    query[queryKey] ??
    openPictureSlug) as string
  const [sortingOption, setSortingOption] = useState(DEFAULT_SORTING_OPTION)
  const [isAscendingOrder, setIsAscendingOrder] = useState(
    DEFAULT_IS_ASCENDING_ORDER
  )
  // Sorting on render instead of in an effect is what makes the server and the
  // browser agree on the order, and the carousel depends on it: reordering its
  // slides underneath would leave Embla showing another picture.
  const items = useMemo(() => {
    const sortedItems = sortListBy(pictures, sortingOption) as Picture[]

    return isAscendingOrder ? [...sortedItems].reverse() : sortedItems
  }, [pictures, sortingOption, isAscendingOrder])
  const openPicture = openSlug && items.find(({slug}) => slug === openSlug)
  // The viewer covers the album behind it, and leaving the picture page means a
  // full navigation to the album, so there the grid is only worth keeping for
  // its links: hiding it stops the browser fetching thumbnails nobody sees. On
  // the album page it stays, since its scroll is what the visitor comes back to.
  const isPicturePage = pathname === PICTURE_ROUTE

  function handleSortingChange(event: ChangeEvent<HTMLInputElement>) {
    const option = event.target.value

    setSortingOption(option)
  }

  function toggleSortingDirection() {
    setIsAscendingOrder(!isAscendingOrder)
  }

  return (
    <>
      {openPicture ? (
        <PictureHead
          picture={openPicture}
          albumName={category && t(`gallery.albums.${category}.name`)}
          localePath={locale === defaultLocale ? '' : `/${locale}`}
        />
      ) : (
        category && (
          <Head>
            <meta
              property="og:title"
              content={`${SITE_NAME} / ${t(`gallery.albums.${category}.name`)}`}
            />
            <meta
              property="og:description"
              content={t('sections.gallery.description')}
            />
            <meta
              property="og:image"
              content={getAbsoluteUrl(
                getSocialImageUrl(
                  `/pictures/${
                    GALLERY_ALBUMS.find(({id}) => id === category)
                      .highlightedPicture
                  }`
                )
              )}
            />
          </Head>
        )
      )}

      <GalleryHeader />

      <GalleryList
        pictures={items}
        category={category}
        subcategories={subcategories}
        isHidden={isPicturePage && Boolean(openPicture)}
        onSort={handleSortingChange}
        sortingOption={sortingOption}
        toggleSortingDirection={toggleSortingDirection}
        isAscendingOrder={isAscendingOrder}
      />

      {openPicture && (
        <DynamicGalleryCarousel
          pictures={items}
          openPicture={openPicture}
          category={category}
          subcategories={subcategories}
          basePath={basePath}
        />
      )}
    </>
  )
}

// The open picture owns the head on both routes: the picture page renders this
// from its own props, and the album page renders it behind a masked URL. So the
// title, the description and the canonical always describe what is on screen.
function PictureHead({
  picture,
  albumName,
  localePath
}: {
  picture: Picture
  albumName?: string
  localePath: string
}) {
  const {t} = useTranslation()
  const {name, description, image, imageSize, permalink} = picture
  const title = `${SITE_NAME} / ${name}`
  const text =
    description?.replaceAll(/\n\n/g, ' ') ??
    [t('gallery.picture.description', {name}), albumName && `${albumName}.`]
      .filter(Boolean)
      .join(' ')
  const canonical = getAbsoluteUrl(`${localePath}${permalink}`)
  const ogImage = getAbsoluteUrl(getSocialImageUrl(image.src))
  const {width, height} = getSocialImageSize(imageSize)

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={text} />
      <link rel="canonical" href={canonical} key="canonical" />

      <meta property="og:type" content="article" />
      <meta property="og:title" content={title} />
      <meta property="og:url" content={canonical} />
      <meta property="og:description" content={text} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content={`${width}`} />
      <meta property="og:image:height" content={`${height}`} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={text} />
      <meta name="twitter:image" content={ogImage} />
    </Head>
  )
}

interface GalleryPageProps {
  pictures: Picture[]
  category?: string
  subcategories?: Subcategory[]
  basePath: string
  openPictureSlug?: string
}

GalleryPage.displayName = 'GalleryPage'
