import fs from 'node:fs'
import path from 'node:path'
import getT from 'next-translate/getT'
import {
  DEFAULT_IS_ASCENDING_ORDER,
  GALLERY_ALBUMS,
  GALLERY_TAGS
} from 'config/gallery'
import {getSlug} from 'lib/utils'
import {PictureOnMap, RawPicture} from 'types/gallery'
import {fromExifToGallery} from './mappers'
import {taggedPictures} from 'lib/utils/pictures'

const picturesMetadataFile = path.join(
  process.cwd(),
  'data',
  'pictures',
  'metadata.json'
)

export async function getAllPictures(): Promise<RawPicture[]> {
  const metadata = fs.readFileSync(picturesMetadataFile, 'utf8')
  const allPictures = JSON.parse(metadata) as RawPicture[]

  return DEFAULT_IS_ASCENDING_ORDER ? allPictures : allPictures.reverse()
}

export async function getHighlightedPicture(highlightedPicture) {
  const pictures = await getAllPictures()
  const {
    fileName,
    imageSize
  }: {
    fileName: string
    imageSize: string
  } = pictures.find(({fileName}) => fileName === highlightedPicture)

  return {fileName, imageSize}
}

export async function getGalleryPictures({
  locale,
  slug
}: {
  locale: string
  slug: string
}) {
  const pictures = await getAllPictures()
  const t = await getT(locale, 'common')
  const {tags, excludeTags} = GALLERY_ALBUMS.find(album => {
    const albumSlug = getSlug(t(`gallery.albums.${album.id}.name`))

    return slug === albumSlug
  })

  return pictures.filter(taggedPictures({tags, excludeTags}))
}

export async function getGalleryPicturesByTag({
  locale,
  tag
}: {
  locale: string
  tag: string
}) {
  const pictures = await getAllPictures()
  const t = await getT(locale, 'gallery')
  const originalTag = GALLERY_TAGS.find(
    galleryTag => getSlug(t(`tags.${getSlug(galleryTag)}`)) === tag
  )

  return pictures.filter(({keywords}) => keywords.includes(originalTag))
}

export async function getAllPicturesOnMap({
  locale
}: {
  locale: string
}): Promise<PictureOnMap[]> {
  const allPictures = await getAllPictures()
  const mappedPictures = await Promise.all(
    allPictures.map(fromExifToGallery({locale}))
  )
  const picturesWithCoordinates = mappedPictures.filter(
    ({coordinates}) => coordinates
  )

  return picturesWithCoordinates.map(({slug, coordinates, image}) => ({
    slug,
    coordinates,
    image
  }))
}
