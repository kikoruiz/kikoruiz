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
  const picturesForPrinting = mappedPictures.filter(({id}) =>
    products.find(product => product.id === id)
  )

  return picturesForPrinting.map(({id, name, slug, url, image, imageSize}) => {
    const {
      price,
      metadata: {print_paper: paper, print_size: size}
    } = products.find(product => product.id === id)

    return {
      id,
      name,
      slug,
      paper,
      size,
      price: price / 100,
      image,
      aspectRatio: getAspectRatio(imageSize),
      imageSize,
      picture: url
    }
  })
}
