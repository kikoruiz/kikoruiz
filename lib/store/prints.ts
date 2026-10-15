import {fromExifToGallery} from 'lib/gallery/mappers'
import {getAllPictures} from 'lib/gallery/pictures'
import {getAspectRatio} from 'lib/utils'
import products from 'data/store/products.json'
import {PrintPicture} from 'types/store'

export async function getPrints({
  locale
}: {
  locale: string
}): Promise<PrintPicture[]> {
  const rawPictures = await getAllPictures()
  const pictureIds = new Set(products.map(({pictureId}) => pictureId))
  const sellablePictures = rawPictures.filter(({fileName}) =>
    pictureIds.has(fileName.split('.')[0])
  )
  const mappedPictures = await Promise.all(
    sellablePictures.map(fromExifToGallery({locale}))
  )
  const picturesById = new Map(
    mappedPictures.map(picture => [picture.id, picture])
  )
  const productsByPictureId = new Map<string, typeof products>()
  for (const product of products) {
    productsByPictureId.set(product.pictureId, [
      ...(productsByPictureId.get(product.pictureId) ?? []),
      product
    ])
  }

  // `rawPictures` already comes newest first, so following its order here is
  // what keeps the sizes of a newer picture ahead of an older one's, same as
  // the downloads already do.
  return sellablePictures.map(({fileName}) => {
    const pictureId = fileName.split('.')[0]
    const {name, slug, permalink, image, imageSize} =
      picturesById.get(pictureId)

    return {
      pictureId,
      name,
      slug,
      image,
      aspectRatio: getAspectRatio(imageSize),
      imageSize,
      picture: permalink,
      variants: productsByPictureId
        .get(pictureId)
        .map(
          ({
            id,
            name: productName,
            size,
            isBorderless,
            paper,
            price,
            priceId
          }) => ({
            id,
            productName,
            paper,
            size,
            isBorderless,
            price,
            priceId
          })
        )
    }
  })
}
