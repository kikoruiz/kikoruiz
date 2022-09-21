import {GALLERY_ALBUMS} from '../../config/gallery.js'
import {getHighlightedPicture} from './pictures.js'

export function getGalleryAlbums() {
  const galleryAlbums = GALLERY_ALBUMS.map(async data => {
    const highlightedPicture = await getHighlightedPicture({tag: data.tag})

    return {...data, highlightedPicture}
  })

  return Promise.all(galleryAlbums)
}
