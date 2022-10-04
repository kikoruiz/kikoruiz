import Head from 'next/head'
import getT from 'next-translate/getT'
import ImageGallery from '../../components/image-gallery.js'
import {getGalleryAlbums} from '../../lib/gallery/albums.js'
import {getGalleryPictures} from '../../lib/gallery/pictures.js'
import {fromExifToImageGallery} from '../../lib/gallery/mappers.js'

export default function GalleryAlbum({pictures}) {
  return (
    <>
      <Head>
        <title>Kiko Ruiz</title>
      </Head>

      <ImageGallery items={pictures} />
    </>
  )
}

export async function getStaticPaths({locales}) {
  let paths = []
  const albums = await getGalleryAlbums()

  for (const locale of locales) {
    const t = await getT(locale, 'common')

    paths = paths.concat(
      albums.map(({id}) => ({
        params: {slug: t(`gallery.albums.${id}.slug`)},
        locale
      }))
    )
  }

  return {paths, fallback: false}
}

export async function getStaticProps({params: {slug}, locale}) {
  const galleryPictures = await getGalleryPictures({locale, slug})
  const pictures = await Promise.all(
    galleryPictures.map(fromExifToImageGallery)
  )

  return {
    props: {pictures, section: 'gallery'}
  }
}
