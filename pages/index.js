import Head from 'next/head.js'
import ImageGallery from '../components/image-gallery.js'
import {getGalleryAlbums} from '../lib/gallery/albums.js'
import {fromAlbumToImageGallery} from '../lib/gallery/mappers.js'

export default function Home({albums}) {
  return (
    <>
      <Head>
        <title>Kiko Ruiz</title>
      </Head>

      <ImageGallery items={albums} isAlbum />
    </>
  )
}

export async function getStaticProps({locale}) {
  const galleryAlbums = await getGalleryAlbums()
  const albums = await Promise.all(
    galleryAlbums.map(fromAlbumToImageGallery(locale))
  )

  return {
    props: {albums}
  }
}
