import {GALLERY_ALBUMS, TRANSVERSAL_ALBUMS} from 'config/gallery'

// A picture can be tagged for several albums, but only one owns it, so that it
// has a single page of its own instead of one per album. The owner is the album
// the picture is really about, never a transversal one.
export function getPictureAlbum(keywords: string[]) {
  const albums = GALLERY_ALBUMS.filter(({tags, excludeTags}) =>
    taggedPictures({tags, excludeTags})({keywords})
  )

  return albums.find(({id}) => !TRANSVERSAL_ALBUMS.includes(id)) ?? albums[0]
}

export function taggedPictures({
  tags,
  excludeTags = []
}: {
  tags: string[]
  excludeTags: string[]
}) {
  return function ({keywords}: {keywords: string[]}) {
    return (
      tags.some(tag => keywords.includes(tag)) &&
      keywords.every(keyword => !excludeTags.includes(keyword))
    )
  }
}
