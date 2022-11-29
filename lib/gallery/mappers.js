import {getPlaiceholder} from 'plaiceholder'
import getT from 'next-translate/getT'
import {getSlug} from '../utils.js'

function getOrientation(size) {
  const dimensions = size.split('x')
  const [width, height] = dimensions
  const orientation = Number(width) > Number(height) ? 'horizontal' : 'vertical'

  return orientation
}

function getPrettyDate(date, locale) {
  return new Date(date).toLocaleString(locale, {
    month: 'long',
    year: 'numeric'
  })
}

export function fromExifToGallery({slug, locale}) {
  return async function ({
    fileName,
    title,
    createDate,
    model,
    imageSize,
    iso,
    aperture,
    shutterSpeed,
    focalLength,
    keywords
  }) {
    const orientation = getOrientation(imageSize)
    const src = `/pictures/${fileName}`
    const {base64} = await getPlaiceholder(src)
    const t = await getT(locale, 'common')
    const isPano = keywords.includes('pano')

    // Replace incorrect models.
    model = model.replace(/(\[)(Canon EOS R)(\])/, '$2')

    // Samyang lens cases (for EOS cameras).
    if (model === 'Canon EOS 6D') {
      if (!focalLength) focalLength = '14.0 mm'
      if (!aperture) aperture = 2.8
    }
    // EOS RF lens cases (in panos).
    if (model === 'Canon EOS R' && isPano) {
      if (!focalLength) focalLength = '15.0 mm'
    }

    return {
      name: title,
      id: fileName.split('.')[0],
      url: `/${getSlug(t('sections.gallery.name'))}/${slug}`,
      slug: getSlug(title),
      image: {src, base64, orientation},
      date: createDate,
      prettyDate: getPrettyDate(createDate, locale),
      shotInfo: {
        iso,
        ...(aperture && {aperture}),
        shutterSpeed,
        ...(focalLength && {
          focalLength: Number(focalLength.replace('.0 mm', ''))
        })
      },
      isPano
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
