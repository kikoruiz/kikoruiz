import {getPlaiceholder} from 'plaiceholder'
import getT from 'next-translate/getT'

function getOrientation(size) {
  const dimensions = size.split('x')
  const [width, height] = dimensions
  const orientation = Number(width) > Number(height) ? 'horizontal' : 'vertical'

  return orientation
}

export async function fromExifToImageGallery({
  fileName,
  title,
  imageSize,
  iso,
  aperture,
  shutterSpeed
}) {
  const orientation = getOrientation(imageSize)
  const src = `/pictures/${fileName}`
  const {base64} = await getPlaiceholder(src)

  return {
    name: title,
    id: fileName.split('.')[0],
    image: {src, base64, orientation},
    metadata: {
      iso,
      ...(aperture && {aperture}),
      shutterSpeed
    }
  }
}

export function fromAlbumToImageGallery(locale) {
  return async function ({id, highlightedPicture}) {
    const src = `/pictures/${highlightedPicture.fileName}`
    const {base64} = await getPlaiceholder(src)
    const t = await getT(locale, 'common')

    return {
      id,
      url: `/${t('sections.gallery.slug')}/${t(`gallery.albums.${id}.slug`)}`,
      image: {
        src,
        base64,
        orientation: getOrientation(highlightedPicture.imageSize)
      }
    }
  }
}
