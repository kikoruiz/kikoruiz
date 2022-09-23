import fs from 'node:fs'
import path from 'node:path'
import {GALLERY_ALBUMS} from '../../config/gallery.js'

const picturesMetadataFile = path.join(
  process.cwd(),
  'data',
  'pictures',
  'metadata.json'
)

async function getAllPictures() {
  const metadata = fs.readFileSync(picturesMetadataFile)

  return JSON.parse(metadata)
}

export async function getHighlightedPicture({tag}) {
  const MIN_RATING = 3
  const pictures = await getAllPictures()
  const highlightedPicture = pictures.find(
    ({keywords, rating}) => keywords.includes(tag) && rating >= MIN_RATING
  )

  return (
    highlightedPicture && {
      fileName: highlightedPicture.fileName,
      imageSize: highlightedPicture.imageSize
    }
  )
}

export async function getGalleryPictures({slug}) {
  const pictures = await getAllPictures()
  const {tag} = GALLERY_ALBUMS.find(album => slug === album.slug)

  return pictures.filter(({keywords}) => keywords.includes(tag))
}
