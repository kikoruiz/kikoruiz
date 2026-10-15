import {describe, it, expect} from 'vitest'
import pictures from 'data/pictures/metadata.json'
import products from 'data/store/products.json'
import downloads from 'data/store/downloads.json'
import papers from 'data/store/papers.json'
import {
  DOWNLOAD_MIN_RATING,
  DOWNLOAD_VARIANTS,
  PRINT_MIN_RATING,
  PRINT_VARIANTS
} from 'config/store'
import {getDownloadId} from 'lib/store/downloads'
import {fitsPrintSheet, isForSale} from 'lib/utils/pictures'

const pictureIds = new Set(pictures.map(({fileName}) => fileName.split('.')[0]))
const printableIds = pictures
  .filter(
    ({rating, imageSize, fileName}) =>
      rating >= PRINT_MIN_RATING &&
      fitsPrintSheet(imageSize) &&
      isForSale(fileName.split('.')[0])
  )
  .map(({fileName}) => fileName.split('.')[0])
const downloadableIds = pictures
  .filter(
    ({rating, fileName}) =>
      rating >= DOWNLOAD_MIN_RATING && isForSale(fileName.split('.')[0])
  )
  .map(({fileName}) => fileName.split('.')[0])

function duplicates(ids: string[]) {
  return ids.filter((id, index) => ids.indexOf(id) !== index)
}

// A missing or stale `priceId` only shows up as a broken checkout, since the
// ids come from the inventory scripts and not from this repo.
describe('store catalogue', () => {
  describe('prints', () => {
    it('has a Stripe price for every print', () => {
      const missing = products.filter(({priceId}) => !priceId).map(({id}) => id)

      expect(missing).toEqual([])
    })

    it('has no repeated ids', () => {
      expect(duplicates(products.map(({id}) => id))).toEqual([])
    })

    it('only sells pictures that exist in the gallery', () => {
      const unknown = products
        .filter(({pictureId}) => !pictureIds.has(pictureId))
        .map(({id}) => id)

      expect(unknown).toEqual([])
    })

    it('only sells papers that are described', () => {
      const unknown = products
        .filter(({paper}) => !(paper in papers))
        .map(({id}) => id)

      expect(unknown).toEqual([])
    })

    it('prices every print as its size and border say', () => {
      const wrong = products
        .filter(({size, isBorderless, price}) => {
          const variant = PRINT_VARIANTS.find(
            variant =>
              variant.size === size && variant.isBorderless === isBorderless
          )

          return variant?.price !== price
        })
        .map(({id}) => id)

      expect(wrong).toEqual([])
    })

    it('builds every id from its picture, size and paper', () => {
      const wrong = products
        .filter(
          ({id, pictureId, size, isBorderless, paper}) =>
            id !==
            `print_${pictureId}_${size}${isBorderless ? '_borderless' : ''}_${paper}`
        )
        .map(({id}) => id)

      expect(wrong).toEqual([])
    })

    it('sells every picture that qualifies', () => {
      const sold = new Set(products.map(({pictureId}) => pictureId))
      const missing = printableIds.filter(pictureId => !sold.has(pictureId))

      expect(missing).toEqual([])
    })
  })

  describe('downloads', () => {
    it('has a Stripe price for every download', () => {
      const missing = downloads
        .filter(({priceId}) => !priceId)
        .map(({id}) => id)

      expect(missing).toEqual([])
    })

    it('has no repeated ids', () => {
      expect(duplicates(downloads.map(({id}) => id))).toEqual([])
    })

    it('builds every id from its picture and tier', () => {
      const wrong = downloads
        .filter(
          ({id, pictureId, tier}) => id !== getDownloadId({pictureId, tier})
        )
        .map(({id}) => id)

      expect(wrong).toEqual([])
    })

    it('prices every download as its tier says', () => {
      const wrong = downloads
        .filter(
          ({tier, price}) =>
            DOWNLOAD_VARIANTS.find(variant => variant.tier === tier)?.price !==
            price
        )
        .map(({id}) => id)

      expect(wrong).toEqual([])
    })

    it('sells every tier of every picture that qualifies', () => {
      const expected = downloadableIds.flatMap(pictureId =>
        DOWNLOAD_VARIANTS.map(({tier}) => getDownloadId({pictureId, tier}))
      )

      const sold = new Set(downloads.map(({id}) => id))

      expect(expected.filter(id => !sold.has(id))).toEqual([])
    })
  })
})
