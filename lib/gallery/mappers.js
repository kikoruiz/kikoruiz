import {getPlaiceholder} from 'plaiceholder'
import getT from 'next-translate/getT'
import {getSlug} from '../utils.js'

function getOrientation(size) {
  const dimensions = size.split('x')
  const [width, height] = dimensions
  const orientation = Number(width) > Number(height) ? 'horizontal' : 'vertical'

  return orientation
}

export function fromExifToGallery({slug, locale}) {
  return async function ({
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
    const t = await getT(locale, 'common')

    return {
      name: title,
      id: fileName.split('.')[0],
      url: `/${t('sections.gallery.slug')}/${slug}`,
      slug: getSlug(title),
      image: {src, base64, orientation},
      metadata: {
        iso,
        ...(aperture && {aperture}),
        shutterSpeed
      }
    }
  }
}

export function fromAlbumToGallery(locale) {
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
