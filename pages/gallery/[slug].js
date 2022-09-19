import {getGalleryAlbums} from '../../lib/gallery/albums.js'
import {getGalleryPictures} from '../../lib/gallery/pictures.js'

export default function GalleryAlbum({pictures}) {
  return pictures.length > 0 ? (
    <ul>
      {pictures.map(({fileName, title}, index) => (
        <li key={index}>
          {title}: {fileName}
        </li>
      ))}
    </ul>
  ) : (
    'There are no pictures in this album.'
  )
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
    props: {pictures}
  }
}
