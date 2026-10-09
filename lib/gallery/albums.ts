import {GALLERY_ALBUMS} from 'config/gallery'
import {getHighlightedPicture} from './pictures'

function buildGalleryAlbums() {
  const galleryAlbums = GALLERY_ALBUMS.map(async data => {
    const highlightedPicture = await getHighlightedPicture(
      data.highlightedPicture
    )

    return {...data, highlightedPicture}
  })

  return Promise.all(galleryAlbums)
}

let cachedGalleryAlbums: ReturnType<typeof buildGalleryAlbums>

export function getGalleryAlbums() {
  if (!cachedGalleryAlbums) cachedGalleryAlbums = buildGalleryAlbums()

  return cachedGalleryAlbums
}
