import {GALLERY_ALBUMS} from '../../config/gallery.js'

export async function getGalleryAlbums() {
  return GALLERY_ALBUMS.map(data => ({
    ...data,
    permalink: `/gallery/${data.slug}`
  }))
}
