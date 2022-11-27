import Head from 'next/head'
import GalleryList from '../../components/gallery-list.js'
import GalleryHeader from '../../components/gallery-header.js'
import {getGalleryAlbums} from '../../lib/gallery/albums.js'
import {fromAlbumToGallery} from '../../lib/gallery/mappers.js'
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

      <GalleryHeader isAlbum />
      <GalleryList items={albums} isAlbum />
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
