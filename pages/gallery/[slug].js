import {getGalleryAlbums} from '../../lib/gallery/albums.js'
import {getGalleryImages, getImageSizes} from '../../lib/gallery/images.js'

export default function GalleryAlbum({images}) {
  console.log({images})

  return (
    <ul>
      {images.map(({title}, index) => (
        <li key={index}>{title}</li>
      ))}
    </ul>
  )
}

export async function getStaticPaths() {
  const albums = await getGalleryAlbums()
  const paths = albums.map(({slug}) => ({
    params: {slug}
  }))

  return {paths, fallback: false}
}

export async function getStaticProps({params}) {
  const albums = await getGalleryAlbums()
  const album = albums.find(({slug}) => slug === params.slug)
  const images = await getGalleryImages({id: album.id})
  const sizesToFetch = images.map(({sizesEndpoint: endpoint}) =>
    getImageSizes({endpoint})
  )
  const allSizes = await Promise.allSettled(sizesToFetch)
  const imagesWithSizes = images.map((image, index) => ({
    ...image,
    sizes: allSizes[index].value
  }))

  return {
    props: {images: imagesWithSizes}
  }
}
