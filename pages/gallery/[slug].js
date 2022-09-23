import ImageGallery from '../../components/image-gallery.js'
import {getGalleryAlbums} from '../../lib/gallery/albums.js'
import {getGalleryPictures} from '../../lib/gallery/pictures.js'
import {fromExifToImageGallery} from '../../lib/gallery/mappers.js'

export default function GalleryAlbum({pictures}) {
  return <ImageGallery items={pictures} />
}

export async function getStaticPaths() {
  const albums = await getGalleryAlbums()
  const paths = albums.map(({slug}) => ({
    params: {slug}
  }))

  return {paths, fallback: false}
}

export async function getStaticProps({params: {slug}}) {
  const galleryPictures = await getGalleryPictures({slug})
  const pictures = await Promise.all(
    galleryPictures.map(fromExifToImageGallery)
  )

  return {
    props: {pictures}
  }
}
