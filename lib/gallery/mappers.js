function getOrientation(size) {
  const dimensions = size.split('x')
  const [width, height] = dimensions
  const orientation = Number(width) > Number(height) ? 'horizontal' : 'vertical'

  return orientation
}

export function fromExifToCollection({fileName, title, imageSize}) {
  const orientation = getOrientation(imageSize)

  return {
    image: {src: `/pictures/${fileName}`, orientation},
    name: title,
    key: fileName.split('.')[0]
  }
}

export function fromAlbumToCollection({name, slug, highlightedPicture}) {
  return {
    name,
    key: slug,
    url: `/gallery/${slug}`,
    image: {
      src: `/pictures/${highlightedPicture.fileName}`,
      orientation: getOrientation(highlightedPicture.imageSize)
    }
  }
}
