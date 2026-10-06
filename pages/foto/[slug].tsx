import Head from 'next/head'
import {useRouter} from 'next/router'
import getT from 'next-translate/getT'
import useTranslation from 'next-translate/useTranslation'
import PicturePage from 'components/picture-page'
import JsonLd from 'components/json-ld'
import {getAllPictures} from 'lib/gallery/pictures'
import {fromExifToGallery} from 'lib/gallery/mappers'
import {getPictureAlbumId, getPictureSiblings} from 'lib/gallery/picture-page'
import {
  fromLocalesToAlternates,
  fromSectionToBreadcrumbItems
} from 'lib/mappers'
import {getPictureStructuredData} from 'lib/structured-data'
import {getAbsoluteUrl, getSlug} from 'lib/utils'
import {SITE_NAME} from 'config'
import products from 'data/store/products.json'
import {Alternate, BreadcrumbItem} from 'types'
import {Picture, PictureSibling} from 'types/gallery'
import {PicturePrint} from 'types/store'

interface PhotoProps {
  picture: Picture
  albumId: string
  albumName: string
  siblings: PictureSibling[]
  prints: PicturePrint[]
  structuredData: object
  alternates: Alternate[]
}

export default function Photo({
  picture,
  albumId,
  albumName,
  siblings,
  prints,
  structuredData,
  alternates
}: PhotoProps) {
  const {locale} = useRouter()
  const {t} = useTranslation()
  const canonical = alternates.find(a => a.locale === locale)?.href
  const title = `${SITE_NAME} / ${picture.name}`
  const description =
    picture.description ??
    `${t('gallery.picture.description', {name: picture.name})} ${albumName}.`
  const ogImage = getAbsoluteUrl(picture.image.src)
  const [width, height] = picture.imageSize.split('x')

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />

        <meta property="og:type" content="article" />
        <meta property="og:title" content={title} />
        <meta property="og:url" content={canonical} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content={width} />
        <meta property="og:image:height" content={height} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />

        {alternates.map(({locale, href}) => (
          <link key={locale} rel="alternate" hrefLang={locale} href={href} />
        ))}
      </Head>

      <PicturePage
        picture={picture}
        album={{id: albumId, name: albumName}}
        siblings={siblings}
        prints={prints}
      />

      <JsonLd data={structuredData} />
    </>
  )
}

export async function getStaticPaths({locales}) {
  const allPictures = await getAllPictures()
  const paths = []

  for (const locale of locales) {
    for (const {title} of allPictures) {
      paths.push({params: {slug: getSlug(title)}, locale})
    }
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
  const allPictures = await getAllPictures()
  const rawPicture = allPictures.find(({title}) => getSlug(title) === slug)
  const albumId = getPictureAlbumId(rawPicture)
  const t = await getT(locale, 'common')
  const albumName = t(`gallery.albums.${albumId}.name`)
  const picture = await fromExifToGallery({
    locale,
    slug: getSlug(albumName)
  })(rawPicture)
  const siblings = await getPictureSiblings({
    allPictures,
    albumId,
    pictureId: picture.id,
    t
  })
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
  const alternates: Alternate[] = await Promise.all(
    locales.map(
      await fromLocalesToAlternates({
        defaultLocale,
        locale,
        section: 'photo',
        category: slug
      })
    )
  )
  const localePath = locale === defaultLocale ? '' : `/${locale}`
  const breadcrumbItems: BreadcrumbItem[] = [
    {id: 'home', name: SITE_NAME, href: '/'},
    ...fromSectionToBreadcrumbItems({section, picture, albumId, t})
  ]
  const structuredData = getPictureStructuredData({
    picture,
    prints,
    canonical: alternates.find(a => a.locale === locale).href,
    licenseUrl: getAbsoluteUrl(
      `${localePath}/${getSlug(t('legal.pages.copyright.name'))}`
    ),
    breadcrumbItems,
    localePath
  })

  return {
    props: {
      picture,
      albumId,
      albumName,
      siblings,
      prints,
      structuredData,
      alternates,
      section
    }
  }
}
