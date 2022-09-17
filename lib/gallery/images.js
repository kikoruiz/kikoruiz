import {camelCase} from 'change-case'
import {smugmugFetcher} from '../utils.js'

export async function getGalleryImages({id}) {
  const data = await smugmugFetcher.get(`/api/v2/album/${id}!images`)
  const images = data.Response?.AlbumImage?.map(
    ({
      Title,
      Caption,
      KeywordArray,
      Latitude,
      Longitude,
      Altitude,
      FileName,
      DateTimeOriginal,
      OriginalHeight,
      OriginalWidth,
      Hidden,
      ThumbnailUrl,
      WebUri,
      Uris: {
        ImageSizeDetails: {Uri}
      }
    }) => {
      return {
        title: Title,
        ...(Caption && {caption: Caption}),
        keywords: KeywordArray,
        location: {
          latitude: Latitude,
          longitude: Longitude,
          altitude: Altitude
        },
        fileName: FileName,
        date: DateTimeOriginal,
        originalHeight: OriginalHeight,
        originalWidth: OriginalWidth,
        hidden: Hidden,
        thumbnailUrl: ThumbnailUrl,
        webUrl: WebUri,
        sizesEndpoint: Uri
      }
    }
  )

  return images
}

function mapImageSize({Url, Height, Width}) {
  return {
    url: Url,
    height: Height,
    width: Width
  }
}

function normalizeSize(value) {
  return camelCase(value.replace('ImageSize', ''))
}

export async function getImageSizes({endpoint}) {
  const data = await smugmugFetcher.get(endpoint)
  const imageSizes = data.Response?.ImageSizeDetails
  const {UsableSizes} = imageSizes
  const sizes = UsableSizes.reduce(
    (acc, value) => ({
      ...acc,
      [normalizeSize(value)]: mapImageSize(imageSizes[value])
    }),
    {}
  )

  return sizes
}
