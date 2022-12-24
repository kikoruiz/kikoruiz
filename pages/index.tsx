import Head from 'next/head'
import {Alternate} from 'types'
import {Picture} from 'types/gallery'
import GalleryList from '../components/gallery-list'
import {getGalleryAlbums} from '../lib/gallery/albums'
import {fromAlbumToGallery} from '../lib/gallery/mappers'
import {fromLocalesToAlternates} from '../lib/mappers'

export default function Home({albums, alternates}: HomeProps) {
  return (
    <>
      <Head>
        <title>Kiko Ruiz</title>
        {alternates.map(({locale, href}) => (
          <link key={locale} rel="alternate" hrefLang={locale} href={href} />
        ))}
      </Head>

      <GalleryList items={albums} isAlbum />
    </>
  )
}

export async function getStaticProps({locale, locales, defaultLocale}) {
  const galleryAlbums = await getGalleryAlbums()
  const albums = await Promise.all(
    galleryAlbums.map(fromAlbumToGallery(locale))
  )
  const alternates = await Promise.all(
    locales.map(await fromLocalesToAlternates({defaultLocale}))
  )

  return {
    props: {albums, alternates}
  }
}

interface HomeProps {
  albums: Picture[]
  alternates: Alternate[]
}
