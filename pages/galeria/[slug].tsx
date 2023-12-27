import Head from 'next/head'
import getT from 'next-translate/getT'
import useTranslation from 'next-translate/useTranslation'
import {getGalleryAlbums} from 'lib/gallery/albums'
import {getGalleryPictures} from 'lib/gallery/pictures'
import {fromExifToGallery} from 'lib/gallery/mappers'
import {fromLocalesToAlternates} from 'lib/mappers'
import {autoSortSeasons, getSlug} from 'lib/utils'
import {GALLERY_ALBUMS} from 'config/gallery'
import {Picture, Subcategory} from 'types/gallery'
import {Alternate} from 'types'
import GalleryPage from 'components/gallery-page'
import {DEFAULT_ORIGIN} from 'config'

interface GallerySlugProps {
  pictures: Picture[]
  category?: string
  subcategories?: Subcategory[]
  alternates: Alternate[]
}

export default function GallerySlug({
  alternates,
  ...pageProps
}: GallerySlugProps) {
  const {t} = useTranslation()
  const title = `Kiko Ruiz / ${t(`gallery.albums.${pageProps.category}.name`)}`

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={t('sections.gallery.description')} />

        {alternates.map(({locale, href}) => (
          <link key={locale} rel="alternate" hrefLang={locale} href={href} />
        ))}

        <meta property="og:title" content={title} />
        <meta
          property="og:description"
          content={t('sections.gallery.description')}
        />
        <meta
          property="og:image"
          content={`${process.env.ORIGIN || DEFAULT_ORIGIN}/pictures/${
            GALLERY_ALBUMS.find(({id}) => id === pageProps.category)
              .highlightedPicture
          }`}
        />
      </Head>

      <GalleryPage {...pageProps} />
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
  const subcategories =
    category.id === 'seasonal' ? autoSortSeasons() : category?.subcategories
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
