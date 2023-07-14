import {getPlaiceholder} from 'plaiceholder'
import getT from 'next-translate/getT'
import {getSlug} from '../utils'
import {Coordinates, Image, Location, Picture, ShotInfo} from 'types/gallery'
import {
  ALLOWED_PICTURE_TAGS,
  GALLERY_ALBUMS,
  GALLERY_TAGS
} from 'config/gallery'
import {getGalleryTags} from './tags'
import {taggedPictures} from './pictures'
import {getPostSlugByPictureSlug} from 'lib/blog/posts'

const DEFAULT_CANON_EF_LENS = 'Samyang 14mm f/2.8 IF ED UMC Aspherical'
const DEFAULT_CANON_RF_LENS = 'Canon RF 15-35mm F2.8L IS USM'

interface ExifData {
  fileName: string
  title: string
  description?: string
  createDate: string
  processingDate?: string
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
  coordinates?: Coordinates
  location?: Location
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

async function getAlbumSlug({
  slug,
  keywords,
  locale
}: {
  slug?: string
  keywords: string[]
  locale: string
}) {
  if (slug) return slug

  const t = await getT(locale, 'common')
  const album = GALLERY_ALBUMS.find(({tags, excludeTags}) =>
    taggedPictures({tags, excludeTags})({keywords})
  )

  return getSlug(t(`gallery.albums.${album.id}.name`))
}

export function fromExifToGallery({
  slug: albumSlug,
  tag,
  locale,
  skipGalleryPath = false,
  needsImage = true
}: {
  slug?: string
  tag?: string
  locale: string
  skipGalleryPath?: boolean
  needsImage?: boolean
}) {
  return async function ({
    fileName,
    title,
    description,
    createDate,
    processingDate,
    model,
    lens,
    imageSize,
    fileSize,
    iso,
    aperture,
    shutterSpeed,
    focalLength,
    keywords,
    rawFileName,
    megapixels,
    coordinates,
    location
  }: ExifData): Promise<Picture> {
    const orientation = getOrientation(imageSize)
    const src = `/pictures/${fileName}`
    let image: Image
    if (needsImage) {
      const {css} = await getPlaiceholder(src)
      image = {src, orientation, css}
    }
    const t = await getT(locale, 'common')
    const slug = getSlug(title)
    const path = skipGalleryPath
      ? ''
      : `/${getSlug(t('sections.gallery.name'))}/${
          tag
            ? `tags/${tag}`
            : await getAlbumSlug({
                slug: albumSlug,
                keywords,
                locale
              })
        }`
    const queryKey = t('gallery.carousel.query-key')
    const url = `${path}/?${queryKey}=${slug}`
    const isPano = keywords.includes('panorama')
    const isStarTracked = keywords.includes('star tracker')
    const tags = await getGalleryTags({
      locale,
      tags: keywords.filter(keyword => GALLERY_TAGS.includes(keyword))
    })
    const tutorialSlug = getPostSlugByPictureSlug(`tutorial-${slug}`)

    // Replace incorrect models.
    model = model.replace(/(\[)(Canon EOS R)(\])/, '$2')

    // Samyang lens cases (for EOS cameras).
    if (model === 'Canon EOS 6D') {
      if (!focalLength) focalLength = '14.0 mm'
      if (!aperture) aperture = 2.8
      if (!lens) lens = DEFAULT_CANON_EF_LENS
    }
    // EOS RF lens cases (in panos).
    if (model === 'Canon EOS R' && isPano) {
      if (!focalLength) focalLength = '15.0 mm'
      if (!lens) lens = DEFAULT_CANON_RF_LENS
    }

    // Replace incorrect lenses.
    lens = lens.replace('0.0mm f/0.0', DEFAULT_CANON_EF_LENS)
    if (lens.includes(' or ')) {
      lens = lens.split(' or ')[0]
    }

    return {
      id: fileName.split('.')[0],
      slug,
      name: title,
      ...(description && {description}),
      url,
      ...(image && {image}),
      imageSize,
      fileSize,
      date: createDate,
      ...(processingDate && {processingDate}),
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
      isStarTracked,
      editingSoftware: rawFileName.includes('.cr2')
        ? 'Adobe Lightroom'
        : 'Adobe Lightroom + Adobe Photoshop',
      megapixels,
      rawTags: keywords.filter(keywords =>
        ALLOWED_PICTURE_TAGS.includes(keywords)
      ),
      tags,
      ...(coordinates && {coordinates}),
      ...(location && {location}),
      ...(tutorialSlug && {
        tutorial: {href: `/${getSlug(t('sections.blog.name'))}/${tutorialSlug}`}
      })
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
