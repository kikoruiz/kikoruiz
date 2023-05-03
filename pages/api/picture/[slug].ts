import type {NextApiRequest, NextApiResponse} from 'next'
import {fromExifToGallery} from 'lib/gallery/mappers'
import {getAllPictures} from 'lib/gallery/pictures'
import {getSlug} from 'lib/utils'
import {Picture} from 'types/gallery'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {slug, locale} = req.query as {slug: string; locale: string}
  const allPictures = await getAllPictures()
  const rawPicture = allPictures.find(({title}) => getSlug(title) === slug)
  const picture: Picture = await fromExifToGallery({
    locale,
    skipGalleryPath: true,
    openInCarousel: false
  })(rawPicture)

  if (picture) {
    res.status(200).json(picture)
  } else {
    res.status(404).json('No picture found for this slug.')
  }
}
