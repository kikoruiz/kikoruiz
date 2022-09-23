import ImageGallery from '../../components/image-gallery.js'
import {getGalleryAlbums} from '../../lib/gallery/albums.js'
import {fromAlbumToImageGallery} from '../../lib/gallery/mappers.js'

export default function Gallery({albums}) {
  return <ImageGallery items={albums} isAlbum />
}

export async function getStaticProps() {
  const galleryAlbums = await getGalleryAlbums()
  const albums = await Promise.all(galleryAlbums.map(fromAlbumToImageGallery))

  return {
    props: {albums}
  }
}
