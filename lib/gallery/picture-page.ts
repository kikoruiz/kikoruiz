import {Translate} from 'next-translate'
import {GALLERY_ALBUMS} from 'config/gallery'
import {getSlug} from 'lib/utils'
import {taggedPictures} from 'lib/utils/pictures'
import {getImagePlaceholder} from 'lib/utils/image'
import {getPicturePermalink} from './mappers'
import {PictureSibling, RawPicture} from 'types/gallery'

const SIBLINGS_LENGTH = 6

export function getPictureAlbumId({keywords}: RawPicture) {
  const album = GALLERY_ALBUMS.find(({tags, excludeTags}) =>
    taggedPictures({tags, excludeTags})({keywords})
  )

  return album.id
}

// Deliberately not mapped through `fromExifToGallery`: a strip of six full
// `Picture` objects would blow up the page payload.
export async function getPictureSiblings({
  allPictures,
  albumId,
  pictureId,
  t
}: {
  allPictures: RawPicture[]
  albumId: string
  pictureId: string
  t: Translate
}): Promise<PictureSibling[]> {
  const {tags, excludeTags} = GALLERY_ALBUMS.find(({id}) => id === albumId)
  const siblings = allPictures
    .filter(taggedPictures({tags, excludeTags}))
    .filter(({fileName}) => !fileName.startsWith(pictureId))
    .slice(0, SIBLINGS_LENGTH)

  return Promise.all(
    siblings.map(async ({fileName, title}) => {
      const src = `/pictures/${fileName}`
      const {css} = await getImagePlaceholder(src)
      const slug = getSlug(title)

      return {
        slug,
        name: title,
        permalink: getPicturePermalink({slug, t}),
        image: {src, css}
      }
    })
  )
}
