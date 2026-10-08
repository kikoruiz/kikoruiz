import {GALLERY_ALBUMS, TRANSVERSAL_ALBUMS} from 'config/gallery'
import {
  PRINT_BORDERLESS_MAX_RATIO_DEVIATION,
  PRINT_SHEET_RATIO
} from 'config/store'

// A picture can be tagged for several albums, but only one owns it, so that it
// has a single page of its own instead of one per album. The owner is the album
// the picture is really about, never a transversal one.
export function getPictureAlbum(keywords: string[]) {
  const albums = GALLERY_ALBUMS.filter(({tags, excludeTags}) =>
    taggedPictures({tags, excludeTags})({keywords})
  )

  return albums.find(({id}) => !TRANSVERSAL_ALBUMS.includes(id)) ?? albums[0]
}

// Borderless means the picture has to reach every edge of the sheet, which
// only looks right when its own ratio is already close to the sheet's; much
// further off and the choice is between cropping away part of the
// composition or cutting paper to a custom size.
export function fitsBorderless(imageSize: string) {
  const [width, height] = imageSize.split('x').map(Number)
  const ratio = Math.max(width, height) / Math.min(width, height)
  const deviation = Math.abs(ratio - PRINT_SHEET_RATIO) / PRINT_SHEET_RATIO

  return deviation <= PRINT_BORDERLESS_MAX_RATIO_DEVIATION
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
