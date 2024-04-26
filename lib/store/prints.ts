import {fromExifToGallery} from 'lib/gallery/mappers'
import {getAllPictures} from 'lib/gallery/pictures'
import {getAspectRatio} from 'lib/utils'
import products from 'data/store/products.json'
import {Print} from 'types/store'

export async function getPrints({locale}: {locale: string}): Promise<Print[]> {
  const rawPictures = await getAllPictures()
  const mappedPictures = await Promise.all(
    rawPictures.map(fromExifToGallery({locale}))
  )

  return products.map(({id, pictureId, size, isBorderless, paper, price}) => {
    const {name, slug, url, image, imageSize} = mappedPictures.find(
      ({id}) => id === pictureId
    )

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
      picture: url
    }
  })
}
