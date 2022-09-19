import {ALBUMS} from '../../config/gallery.js'

export async function getGalleryAlbums() {
  return ALBUMS.map(data => ({...data, permalink: `/gallery/${data.slug}`}))
}
