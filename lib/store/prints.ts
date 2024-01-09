import {
  DEFAULT_PRINT_PRICE,
  DEFAULT_PRINT_SIZE,
  PICTURES_FOR_PRINTING
} from 'config/store'
import {fromExifToGallery} from 'lib/gallery/mappers'
import {getAllPictures} from 'lib/gallery/pictures'
import {getAspectRatio} from 'lib/utils'
import {Print} from 'types/store'

export async function getPrints({locale}: {locale: string}): Promise<Print[]> {
  const rawPictures = await getAllPictures()
  const mappedPictures = await Promise.all(
    rawPictures.map(fromExifToGallery({locale}))
  )
  const picturesForPrinting = mappedPictures.filter(({id}) =>
    PICTURES_FOR_PRINTING.includes(id)
  )

  return picturesForPrinting.map(({id, name, slug, url, image, imageSize}) => ({
    id,
    name,
    slug,
    url: '',
    description: '',
    paper: '',
    size: DEFAULT_PRINT_SIZE,
    price: DEFAULT_PRINT_PRICE,
    image,
    aspectRatio: getAspectRatio(imageSize),
    imageSize,
    picture: url
  }))
}
