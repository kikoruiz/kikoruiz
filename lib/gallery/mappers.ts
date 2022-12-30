import {getPlaiceholder} from 'plaiceholder'
import getT from 'next-translate/getT'
import {getSlug} from '../utils'
import {Image, Picture, ShotInfo} from 'types/gallery'
import {ALLOWED_PICTURE_TAGS} from 'config/gallery'

const DEFAULT_CANON_LENS = 'Samyang 14mm f/2.8 IF ED UMC Aspherical'

interface ExifData {
  fileName: string
  title: string
  createDate: string
  model: string
  lens: string
  imageSize: string
  fileSize: string
  iso: number
  aperture: number
  shutterSpeed: string | number
  focalLength: string
  keywords: string[]
  rawFileName: string
  megapixels: number
}

function getOrientation(size: string) {
  const dimensions = size.split('x')
  const [width, height] = dimensions
  const orientation = Number(width) > Number(height) ? 'horizontal' : 'vertical'

  return orientation
}

function getPrettyDate(date: string, locale: string) {
  return new Date(date).toLocaleString(locale, {
    month: 'long',
    year: 'numeric'
  })
}

export function fromExifToGallery({
  slug,
  locale
}: {
  slug: string
  locale: string
}) {
  return async function ({
    fileName,
    title,
    createDate,
    model,
    lens = DEFAULT_CANON_LENS,
    imageSize,
    fileSize,
    iso,
    aperture,
    shutterSpeed,
    focalLength,
    keywords,
    rawFileName,
    megapixels
  }: ExifData): Promise<Picture> {
    const orientation = getOrientation(imageSize)
    const src = `/pictures/${fileName}`
    const {css} = await getPlaiceholder(src)
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
      image: {src, orientation, css} as Image,
      imageSize,
      fileSize,
      date: createDate,
      prettyDate: getPrettyDate(createDate, locale),
      model,
      lens,
      shotInfo: {
        iso,
        ...(aperture && {aperture}),
        shutterSpeed,
        ...(focalLength && {
          focalLength: Number(focalLength.replace('.0 mm', ''))
        })
      } as ShotInfo,
      isPano,
      editingSoftware: rawFileName.includes('.cr2')
        ? 'Adobe Lightroom'
        : 'Adobe Photoshop',
      megapixels,
      tags: keywords.filter(keywords => ALLOWED_PICTURE_TAGS.includes(keywords))
    }
  }
}

export function fromAlbumToGallery(locale: string) {
  return async function ({id, highlightedPicture}) {
    const src = `/pictures/${highlightedPicture.fileName}`
    const {css} = await getPlaiceholder(src)
    const t = await getT(locale, 'common')
    const albumSlug = getSlug(t(`gallery.albums.${id}.name`))

    return {
      id,
      url: `/${getSlug(t('sections.gallery.name'))}/${albumSlug}`,
      image: {
        src,
        orientation: getOrientation(highlightedPicture.imageSize),
        css
      }
    }
  }
}
