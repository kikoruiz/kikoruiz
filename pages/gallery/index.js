import {getGalleryAlbums} from '../../lib/gallery/albums.js'

export default function Gallery({albums}) {
  console.log({albums})

  return (
    <ul>
      {albums.map(({name}, index) => (
        <li key={index}>{name}</li>
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
