import Collection from '../components/collection.js'
import {getGalleryAlbums} from '../lib/gallery/albums.js'

export default function Home({albums}) {
  return <Collection items={albums} />
}

export async function getStaticProps() {
  const albums = await getGalleryAlbums()

  return {
    props: {albums}
  }
}
