import {fromExifToGallery} from 'lib/gallery/mappers'
import {getAllPictures} from 'lib/gallery/pictures'
import {getAspectRatio} from 'lib/utils'
import products from 'data/store/products.json'
import {Print} from 'types/store'

export async function getPrints({locale}: {locale: string}): Promise<Print[]> {
  const rawPictures = await getAllPictures()
  const pictureIds = new Set(products.map(({pictureId}) => pictureId))
  const mappedPictures = await Promise.all(
    rawPictures
      .filter(({fileName}) => pictureIds.has(fileName.split('.')[0]))
      .map(fromExifToGallery({locale}))
  )
  const picturesById = new Map(
    mappedPictures.map(picture => [picture.id, picture])
  )

  return products.map(({id, pictureId, size, isBorderless, paper, price}) => {
    const {name, slug, permalink, image, imageSize} =
      picturesById.get(pictureId)

    return {
      id,
      name,
      slug,
      paper,
      size,
      isBorderless,
      price,
      image,
      aspectRatio: getAspectRatio(imageSize),
      imageSize,
      picture: permalink
    }
  })
}
