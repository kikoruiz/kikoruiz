import Head from 'next/head'
import getT from 'next-translate/getT'
import GalleryPage from 'components/gallery-page'
import JsonLd from 'components/json-ld'
import {getAllPictures} from 'lib/gallery/pictures'
import {getAlbumPageProps} from 'lib/gallery/album-page'
import {getPictureAlbum} from 'lib/utils/pictures'
import {fromSectionToBreadcrumbItems} from 'lib/mappers'
import {getPictureStructuredData} from 'lib/structured-data'
import {getAbsoluteUrl, getSlug} from 'lib/utils'
import {SITE_NAME} from 'config'
import products from 'data/store/products.json'
import {Alternate, BreadcrumbItem} from 'types'
import {Picture, Subcategory} from 'types/gallery'
import {PicturePrint} from 'types/store'

interface GalleryPictureProps {
  pictures: Picture[]
  category?: string
  subcategories?: Subcategory[]
  basePath: string
  openPictureSlug: string
  structuredData: object
  alternates: Alternate[]
}

// The title, the description and the social tags of the open picture live in
// `GalleryPage`, which emits them on this route and on the album one alike, so
// they keep describing whatever the carousel has on screen.
export default function GalleryPicture({
  alternates,
  structuredData,
  ...pageProps
}: GalleryPictureProps) {
  return (
    <>
      <Head>
        {alternates.map(({locale, href}) => (
          <link key={locale} rel="alternate" hrefLang={locale} href={href} />
        ))}
      </Head>

      <GalleryPage {...pageProps} />

      <JsonLd data={structuredData} />
    </>
  )
}

export async function getStaticPaths({locales}) {
  const allPictures = await getAllPictures()
  const paths = []

  for (const locale of locales) {
    const t = await getT(locale, 'common')

    for (const {title, keywords} of allPictures) {
      const album = getPictureAlbum(keywords)

      if (!album) continue

      paths.push({
        params: {
          slug: getSlug(t(`gallery.albums.${album.id}.name`)),
          picture: getSlug(title)
        },
        locale
      })
    }
  }

  return {paths, fallback: false}
}

export async function getStaticProps({
  params: {slug, picture: pictureSlug},
  locale,
  locales,
  defaultLocale
}) {
  const albumProps = await getAlbumPageProps({
    slug,
    locale,
    locales,
    defaultLocale,
    pictureSlug
  })
  const picture = albumProps.pictures.find(({slug}) => slug === pictureSlug)
  const t = await getT(locale, 'common')
  const prints: PicturePrint[] = products
    .filter(({pictureId}) => pictureId === picture.id)
    .map(({id, name, size, isBorderless, paper, price}) => ({
      id,
      name,
      size,
      isBorderless,
      paper,
      price
    }))
  const localePath = locale === defaultLocale ? '' : `/${locale}`
  const breadcrumbItems: BreadcrumbItem[] = [
    {id: 'home', name: SITE_NAME, href: '/'},
    ...fromSectionToBreadcrumbItems({
      section: albumProps.section,
      picture,
      albumId: albumProps.category,
      t
    })
  ]
  const structuredData = getPictureStructuredData({
    picture,
    prints,
    canonical: albumProps.alternates.find(({locale: l}) => l === locale).href,
    licenseUrl: getAbsoluteUrl(
      `${localePath}/${getSlug(t('legal.pages.copyright.name'))}`
    ),
    breadcrumbItems,
    localePath
  })

  return {
    props: {
      ...albumProps,
      openPictureSlug: pictureSlug,
      structuredData
    }
  }
}
