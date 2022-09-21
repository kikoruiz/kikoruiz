import Collection from '../../components/collection.js'
import {getGalleryAlbums} from '../../lib/gallery/albums.js'
import {fromAlbumToCollection} from '../../lib/gallery/mappers.js'

export default function Gallery({albums}) {
  return <Collection items={albums} />
}

export async function getStaticProps() {
  const albums = await getGalleryAlbums()

  return {
    props: {albums: albums.map(fromAlbumToCollection)}
  }
}
