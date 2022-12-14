import {GALLERY_ALBUMS} from '../../config/gallery'
import {getHighlightedPicture} from './pictures'

export function getGalleryAlbums() {
  const galleryAlbums = GALLERY_ALBUMS.map(async data => {
    const highlightedPicture = await getHighlightedPicture(
      data.highlightedPicture
    )

    return {...data, highlightedPicture}
  })

  return Promise.all(galleryAlbums)
}
