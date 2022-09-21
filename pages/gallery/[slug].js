import Collection from '../../components/collection.js'
import {getGalleryAlbums} from '../../lib/gallery/albums.js'
import {getGalleryPictures} from '../../lib/gallery/pictures.js'
import {fromExifToCollection} from '../../lib/gallery/mappers.js'

export default function GalleryAlbum({pictures}) {
  return <Collection items={pictures} />
}

export async function getStaticPaths() {
  const albums = await getGalleryAlbums()
  const paths = albums.map(({slug}) => ({
    params: {slug}
  }))

  return {paths, fallback: false}
}

export async function getStaticProps({params: {slug}}) {
  const pictures = await getGalleryPictures({slug})

  return {
    props: {
      pictures: pictures.map(fromExifToCollection)
    }
  }
}
