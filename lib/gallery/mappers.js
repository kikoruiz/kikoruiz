import {getPlaiceholder} from 'plaiceholder'

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
    key: fileName.split('.')[0],
    image: {src, base64, orientation},
    metadata: {
      iso,
      aperture,
      shutterSpeed
    }
  }
}

export async function fromAlbumToImageGallery({
  name,
  slug,
  highlightedPicture
}) {
  const src = `/pictures/${highlightedPicture.fileName}`
  const {base64} = await getPlaiceholder(src)

  return {
    name,
    key: slug,
    url: `/gallery/${slug}`,
    image: {
      src,
      base64,
      orientation: getOrientation(highlightedPicture.imageSize)
    }
  }
}
