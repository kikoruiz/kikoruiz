import Head from 'next/head'
import ImageGallery from '../../components/image-gallery.js'
import {getGalleryAlbums} from '../../lib/gallery/albums.js'
import {fromAlbumToImageGallery} from '../../lib/gallery/mappers.js'
import {fromLocalesToAlternates} from '../../lib/mappers.js'

export default function Gallery({albums, alternates}) {
  return (
    <>
      <Head>
        <title>Kiko Ruiz</title>
        {alternates.map(({locale, href}) => (
          <link key={locale} rel="alternate" hrefLang={locale} href={href} />
        ))}
      </Head>

      <ImageGallery items={albums} isAlbum />
    </>
  )
}

export async function getStaticProps({locale, locales, defaultLocale}) {
  const section = 'gallery'
  const galleryAlbums = await getGalleryAlbums()
  const albums = await Promise.all(
    galleryAlbums.map(fromAlbumToImageGallery(locale))
  )
  const alternates = await Promise.all(
    locales.map(await fromLocalesToAlternates({defaultLocale, section}))
  )

  return {
    props: {albums, alternates, section}
  }
}
