import {fromExifToGallery} from 'lib/gallery/mappers'
import {getAllPictures} from 'lib/gallery/pictures'
import {getAspectRatio} from 'lib/utils'
import {isForSale} from 'lib/utils/pictures'
import rawDownloads from 'data/store/downloads.json'
import {
  DOWNLOAD_MIN_RATING,
  DOWNLOAD_TYPE,
  DOWNLOAD_VARIANTS
} from 'config/store'
import {Download, RawDownload} from 'types/store'

export function getDownloadId({
  pictureId,
  tier
}: {
  pictureId: string
  tier: string
}) {
  return `${DOWNLOAD_TYPE}_${pictureId}_${tier}`
}

export async function getDownloads({
  locale
}: {
  locale: string
}): Promise<Download[]> {
  const rawPictures = await getAllPictures()
  // The catalogue is the config talking: every picture rated high enough is on
  // sale, and Stripe only adds the price it was given here.
  const pictures = await Promise.all(
    rawPictures
      .filter(
        ({rating, fileName}) =>
          rating >= DOWNLOAD_MIN_RATING && isForSale(fileName.split('.')[0])
      )
      .map(fromExifToGallery({locale}))
  )
  const priceIds = new Map(
    (rawDownloads as RawDownload[]).map(({id, priceId}) => [id, priceId])
  )

  return pictures.map(({id, name, slug, permalink, image, imageSize}) => ({
    id,
    name,
    slug,
    image,
    aspectRatio: getAspectRatio(imageSize),
    imageSize,
    picture: permalink,
    variants: DOWNLOAD_VARIANTS.map(({tier, licence, longestSide, price}) => {
      const variantId = getDownloadId({pictureId: id, tier})

      return {
        id: variantId,
        tier,
        licence,
        longestSide,
        price,
        priceId: priceIds.get(variantId) ?? null
      }
    })
  }))
}
