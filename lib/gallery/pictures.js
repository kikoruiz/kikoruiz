import fs from 'node:fs'
import path from 'node:path'
import getT from 'next-translate/getT'
import {GALLERY_ALBUMS} from '../../config/gallery.js'
import {getSlug} from '../utils.js'

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

export function taggedPictures({tags, excludeTags = []}) {
  return function ({keywords}) {
    return (
      tags.some(tag => keywords.includes(tag)) &&
      keywords.every(keyword => !excludeTags.includes(keyword))
    )
  }
}

export async function getHighlightedPicture(highlightedPicture) {
  const pictures = await getAllPictures()
  const {fileName, imageSize} = pictures.find(
    ({fileName}) => fileName === highlightedPicture
  )

  return {fileName, imageSize}
}

export async function getGalleryPictures({locale, slug}) {
  const pictures = await getAllPictures()
  const t = await getT(locale, 'common')

  const {tags, excludeTags} = GALLERY_ALBUMS.find(album => {
    const albumSlug = getSlug(t(`gallery.albums.${album.id}.name`))

    return slug === albumSlug
  })

  return pictures.filter(taggedPictures({tags, excludeTags}))
}
