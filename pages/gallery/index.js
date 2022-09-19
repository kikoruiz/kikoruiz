import Link from 'next/link'
import {getGalleryAlbums} from '../../lib/gallery/albums.js'

export default function Gallery({albums}) {
  return (
    <ul>
      {albums.map(({name, slug}) => (
        <li key={slug}>
          <Link href={`/gallery/${slug}`}>
            <a>{name}</a>
          </Link>
        </li>
      ))}
    </ul>
  )
}

export async function getStaticProps() {
  const albums = await getGalleryAlbums()

  return {
    props: {albums}
  }
}
