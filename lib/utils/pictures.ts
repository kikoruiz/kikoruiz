import {GALLERY_ALBUMS, TRANSVERSAL_ALBUMS} from 'config/gallery'
import {
  PICTURES_NOT_FOR_SALE,
  PRINT_MAX_RATIO_DEVIATION,
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

// Whether the picture's own shape is close enough to a DIN sheet to be sold
// as one. A square or a panorama is not: the sheet would have to crop it or
// surround it with a mat so lopsided it reads as a mistake.
export function fitsPrintSheet(imageSize: string) {
  const [width, height] = imageSize.split('x').map(Number)
  const ratio = Math.max(width, height) / Math.min(width, height)
  const deviation = Math.abs(ratio - PRINT_SHEET_RATIO) / PRINT_SHEET_RATIO

  return deviation <= PRINT_MAX_RATIO_DEVIATION
}

export function isForSale(pictureId: string) {
  return !PICTURES_NOT_FOR_SALE.includes(pictureId)
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
