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
    shutterSpeed,
    focalLength
  }) {
    const orientation = getOrientation(imageSize)
    const src = `/pictures/${fileName}`
    const {base64} = await getPlaiceholder(src)
    const t = await getT(locale, 'common')

    return {
      name: title,
      id: fileName.split('.')[0],
      url: `/${getSlug(t('sections.gallery.name'))}/${slug}`,
      slug: getSlug(title),
      image: {src, base64, orientation},
      metadata: {
        iso,
        ...(aperture && {aperture}),
        shutterSpeed,
        ...(focalLength && {focalLength})
      }
    }
  }
}

export function fromAlbumToGallery(locale) {
  return async function ({id, highlightedPicture}) {
    const src = `/pictures/${highlightedPicture.fileName}`
    const {base64} = await getPlaiceholder(src)
    const t = await getT(locale, 'common')
    const albumSlug = getSlug(t(`gallery.albums.${id}.name`))

    return {
      id,
      url: `/${getSlug(t('sections.gallery.name'))}/${albumSlug}`,
      image: {
        src,
        base64,
        orientation: getOrientation(highlightedPicture.imageSize)
      }
    }
  }
}
