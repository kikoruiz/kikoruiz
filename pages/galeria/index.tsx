import Head from 'next/head'
import useTranslation from 'next-translate/useTranslation'
import GalleryList from 'components/gallery-list'
import GalleryHeader from 'components/gallery-header'
import {getGalleryAlbums} from 'lib/gallery/albums'
import {fromAlbumToGallery} from 'lib/gallery/mappers'
import {fromLocalesToAlternates} from 'lib/mappers'
import {SECTIONS} from 'config'
import {Picture} from 'types/gallery'
import {Alternate} from 'types'
import {getAbsoluteUrl} from 'lib/utils'

export default function Gallery({albums, alternates, section}: GalleryProps) {
  const {t} = useTranslation()

  return (
    <>
      <Head>
        <title>{`Kiko Ruiz / ${t('sections.gallery.name')}`}</title>
        <meta name="description" content={t('sections.gallery.description')} />
        {alternates.map(({locale, href}) => (
          <link key={locale} rel="alternate" hrefLang={locale} href={href} />
        ))}

        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content={`Kiko Ruiz / ${t('sections.gallery.name')}`}
        />
        <meta
          property="og:description"
          content={t('sections.gallery.description')}
        />
        <meta
          property="og:image"
          content={getAbsoluteUrl(
            SECTIONS.find(({id}) => id === section).highlightedPicture
          )}
        />
      </Head>

      <GalleryHeader isAlbum />

      <GalleryList pictures={albums} isAlbum />
    </>
  )
}

export async function getStaticProps({locale, locales, defaultLocale}) {
  const section = 'gallery'
  const galleryAlbums = await getGalleryAlbums()
  const albums = await Promise.all(
    galleryAlbums.map(fromAlbumToGallery(locale))
  )
  const alternates = await Promise.all(
    locales.map(await fromLocalesToAlternates({defaultLocale, section}))
  )

  return {
    props: {albums, alternates, section}
  }
}

interface GalleryProps {
  albums: Picture[]
  alternates: Alternate[]
  section: string
}
